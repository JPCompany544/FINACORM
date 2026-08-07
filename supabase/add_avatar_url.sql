-- ─── MIGRATION: Add avatar_url to profiles ────────────────────────────────────
-- Run this in the Supabase SQL Editor (once).
-- Adds the avatar_url column and updates the signup trigger to capture it.

-- 1. Add avatar_url column to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Grant select permission for avatar_url column to standard roles
GRANT SELECT (avatar_url) ON public.profiles TO authenticated, anon;

-- 2. Update the handle_new_user_signup function to extract and save avatar_url
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
  v_avatar_url TEXT;
BEGIN
  -- Extract raw metadata passed from signup
  v_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  v_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  v_phone := COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', '');
  v_transaction_pin_hash := NEW.raw_user_meta_data->>'transaction_pin_hash';
  v_transaction_pin_salt := NEW.raw_user_meta_data->>'transaction_pin_salt';
  v_avatar_url := NEW.raw_user_meta_data->>'avatar_url';

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
    -- Insert profile details (including the transaction PIN fields and avatar)
    INSERT INTO public.profiles (
      id, 
      first_name, 
      last_name, 
      phone, 
      customer_number, 
      transaction_pin_hash,
      transaction_pin_salt,
      avatar_url,
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
      v_avatar_url,
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
