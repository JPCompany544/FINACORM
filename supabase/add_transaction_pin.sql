-- ─── MIGRATION: Add Transaction PIN to profiles ─────────────────────────────────
-- Run this in the Supabase SQL Editor (once).
--
-- This migration:
-- 1. Enables pgcrypto extension for secure HMAC.
-- 2. Adds PIN-related columns to the profiles table.
-- 3. Updates the automatic signup trigger function.
-- 4. Secures the pin columns so they are inaccessible from the client side.
-- 5. Implements secure RPCs for checking, verifying, and setting/changing PINs.

-- 1. Enable pgcrypto (standard in Supabase, but run just in case)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Add columns to profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS transaction_pin_hash TEXT,
  ADD COLUMN IF NOT EXISTS transaction_pin_salt TEXT,
  ADD COLUMN IF NOT EXISTS failed_pin_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pin_lockout_until TIMESTAMPTZ;

-- 3. Update the handle_new_user_signup function to extract and save the PIN fields
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  v_first_name TEXT;
  v_last_name TEXT;
  v_phone TEXT;
  v_customer_num TEXT;
  v_account_number TEXT;
  v_next_cus_val INTEGER;
  v_next_acc_val BIGINT;
  v_transaction_pin_hash TEXT;
  v_transaction_pin_salt TEXT;
BEGIN
  -- Extract raw metadata passed from signup
  v_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  v_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  v_phone := COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', '');
  v_transaction_pin_hash := NEW.raw_user_meta_data->>'transaction_pin_hash';
  v_transaction_pin_salt := NEW.raw_user_meta_data->>'transaction_pin_salt';

  -- Generate a unique Customer Number (e.g. CUS-10000001)
  SELECT COALESCE(
    SUBSTRING(MAX(customer_number) FROM 'CUS-(\d+)')::INTEGER + 1,
    10000001
  )
  INTO v_next_cus_val
  FROM public.profiles;
  
  v_customer_num := 'CUS-' || v_next_cus_val::TEXT;

  -- Generate a unique 10-digit Account Number (e.g. 1000000001)
  SELECT COALESCE(
    MAX(account_number)::BIGINT + 1,
    1000000001
  )
  INTO v_next_acc_val
  FROM public.accounts
  WHERE account_number ~ '^\d+$';
  
  v_account_number := v_next_acc_val::TEXT;

  -- Safe insert transaction wrapper
  BEGIN
    -- Insert profile details (including the transaction PIN fields)
    INSERT INTO public.profiles (
      id, 
      first_name, 
      last_name, 
      phone, 
      customer_number, 
      transaction_pin_hash,
      transaction_pin_salt,
      created_at, 
      updated_at
    )
    VALUES (
      NEW.id,
      v_first_name,
      v_last_name,
      v_phone,
      v_customer_num,
      v_transaction_pin_hash,
      v_transaction_pin_salt,
      NOW(),
      NOW()
    );

    -- Insert default CHECKING account linked to the new profile
    INSERT INTO public.accounts (
      user_id, 
      account_number, 
      account_type, 
      currency, 
      status, 
      available_balance, 
      current_balance, 
      created_at, 
      updated_at
    )
    VALUES (
      NEW.id,
      v_account_number,
      'CHECKING',
      'USD',
      'ACTIVE',
      0.00,
      0.00,
      NOW(),
      NOW()
    );

  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Automatic customer provisioning failed for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Secure the PIN columns from standard SELECT access by client roles
-- In Supabase, clients query using "authenticated" or "anon" roles.
-- We revoke SELECT on these sensitive columns to make sure they cannot be retrieved.
REVOKE SELECT ON public.profiles FROM authenticated, anon;
GRANT SELECT (id, first_name, last_name, phone, customer_number, role, created_at, updated_at, failed_pin_attempts, pin_lockout_until) ON public.profiles TO authenticated;
GRANT SELECT (id, first_name, last_name, phone, customer_number, role, created_at, updated_at, failed_pin_attempts, pin_lockout_until) ON public.profiles TO anon;

-- 5. Secure RPC Functions (Run as SECURITY DEFINER to bypass column-level restrictions)

-- Check if user has a PIN configured
CREATE OR REPLACE FUNCTION public.check_user_has_pin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_has_pin BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT (transaction_pin_hash IS NOT NULL AND transaction_pin_salt IS NOT NULL)
  INTO v_has_pin
  FROM public.profiles
  WHERE id = v_user_id;

  RETURN COALESCE(v_has_pin, FALSE);
END;
$$;

-- Verify a user's transaction PIN
CREATE OR REPLACE FUNCTION public.verify_transaction_pin(p_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_stored_hash TEXT;
  v_stored_salt TEXT;
  v_failed_attempts INT;
  v_lockout_until TIMESTAMPTZ;
  v_calculated_hash TEXT;
  v_is_correct BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  SELECT transaction_pin_hash, transaction_pin_salt, failed_pin_attempts, pin_lockout_until
  INTO v_stored_hash, v_stored_salt, v_failed_attempts, v_lockout_until
  FROM public.profiles
  WHERE id = v_user_id;

  -- Verify user exists and has a PIN configured
  IF v_stored_hash IS NULL OR v_stored_salt IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'No transaction PIN set', 'noPin', true);
  END IF;

  -- Verify lockout status
  IF v_lockout_until IS NOT NULL AND v_lockout_until > NOW() THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Too many incorrect PIN attempts. Please try again later.',
      'lockout', true
    );
  END IF;

  -- Perform SHA-256 HMAC hash verification
  -- This is mathematically identical to Node's: crypto.createHmac("sha256", salt).update(pin).digest("hex")
  v_calculated_hash := encode(hmac(p_pin::bytea, v_stored_salt::bytea, 'sha256'), 'hex');
  v_is_correct := (v_stored_hash = v_calculated_hash);

  IF v_is_correct THEN
    -- Reset on success
    UPDATE public.profiles
    SET failed_pin_attempts = 0,
        pin_lockout_until = NULL
    WHERE id = v_user_id;

    RETURN jsonb_build_object('success', true);
  ELSE
    -- Increment failed attempts on failure
    v_failed_attempts := v_failed_attempts + 1;
    
    IF v_failed_attempts >= 5 THEN
      -- Temporarily lockout user for 15 minutes
      v_lockout_until := NOW() + INTERVAL '15 minutes';
      
      UPDATE public.profiles
      SET failed_pin_attempts = v_failed_attempts,
          pin_lockout_until = v_lockout_until
      WHERE id = v_user_id;

      RETURN jsonb_build_object(
        'success', false, 
        'error', 'Too many incorrect PIN attempts. Please try again later.',
        'lockout', true
      );
    ELSE
      UPDATE public.profiles
      SET failed_pin_attempts = v_failed_attempts
      WHERE id = v_user_id;

      RETURN jsonb_build_object(
        'success', false, 
        'error', 'Incorrect transaction PIN.'
      );
    END IF;
  END IF;
END;
$$;

-- Set a new transaction PIN (for first-time setup or reset)
CREATE OR REPLACE FUNCTION public.set_transaction_pin(p_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_salt TEXT;
  v_hash TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- Validate format: exactly 4 digits, numeric only
  IF p_pin NOT SIMILAR TO '[0-9]{4}' THEN
    RETURN jsonb_build_object('success', false, 'error', 'PIN must be exactly 4 digits');
  END IF;

  -- Generate random hex salt and hash the PIN
  v_salt := encode(gen_random_bytes(16), 'hex');
  v_hash := encode(hmac(p_pin::bytea, v_salt::bytea, 'sha256'), 'hex');

  UPDATE public.profiles
  SET transaction_pin_hash = v_hash,
      transaction_pin_salt = v_salt,
      failed_pin_attempts = 0,
      pin_lockout_until = NULL
  WHERE id = v_user_id;

  RETURN jsonb_build_object('success', true);
END;
$$;

-- Change transaction PIN (requires verifying current PIN)
CREATE OR REPLACE FUNCTION public.change_transaction_pin(p_current_pin TEXT, p_new_pin TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_verify_res JSONB;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Unauthorized');
  END IF;

  -- 1. Verify current PIN
  v_verify_res := public.verify_transaction_pin(p_current_pin);
  IF NOT (v_verify_res->>'success')::BOOLEAN THEN
    RETURN v_verify_res;
  END IF;

  -- 2. Validate new PIN format
  IF p_new_pin NOT SIMILAR TO '[0-9]{4}' THEN
    RETURN jsonb_build_object('success', false, 'error', 'New PIN must be exactly 4 digits');
  END IF;

  -- 3. Set the new PIN using the set_transaction_pin helper logic
  RETURN public.set_transaction_pin(p_new_pin);
END;
$$;
