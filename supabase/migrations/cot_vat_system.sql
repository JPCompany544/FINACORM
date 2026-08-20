-- ─── MIGRATION: Add COT and VAT Code Verification System ──────────────────────
-- Run this in the Supabase SQL Editor.

-- 1. Add verification flags to public.profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS cot_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS vat_enabled BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Grant SELECT access to the new columns for authenticated and anonymous clients
GRANT SELECT (cot_enabled, vat_enabled) ON public.profiles TO authenticated, anon;

-- 3. Add transactional code fields to public.transfer_requests
ALTER TABLE public.transfer_requests
  ADD COLUMN IF NOT EXISTS cot_code TEXT,
  ADD COLUMN IF NOT EXISTS vat_code TEXT,
  ADD COLUMN IF NOT EXISTS cot_status TEXT DEFAULT 'NONE' CHECK (cot_status IN ('PENDING', 'APPROVED', 'DECLINED', 'NONE')),
  ADD COLUMN IF NOT EXISTS vat_status TEXT DEFAULT 'NONE' CHECK (vat_status IN ('PENDING', 'APPROVED', 'DECLINED', 'NONE'));

-- 4. Create an RPC function to securely update profile flags as an admin
CREATE OR REPLACE FUNCTION public.admin_update_profile_verification_flags(
    p_user_id UUID,
    p_cot_enabled BOOLEAN,
    p_vat_enabled BOOLEAN
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_caller_role TEXT;
BEGIN
    -- Get role of the calling user
    SELECT role INTO v_caller_role
    FROM public.profiles
    WHERE id = auth.uid();

    -- Check if caller is an admin
    IF v_caller_role <> 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Only administrators can modify verification flags.';
    END IF;

    -- Update flags
    UPDATE public.profiles
    SET cot_enabled = p_cot_enabled,
        vat_enabled = p_vat_enabled
    WHERE id = p_user_id;

    RETURN TRUE;
END;
$$;

-- 5. Create an RPC function to securely update transfer request code statuses as an admin
CREATE OR REPLACE FUNCTION public.admin_update_transfer_code_status(
    p_transfer_id UUID,
    p_type TEXT, -- 'COT' or 'VAT'
    p_status TEXT -- 'APPROVED' or 'DECLINED'
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_caller_role TEXT;
BEGIN
    -- Get role of the calling user
    SELECT role INTO v_caller_role
    FROM public.profiles
    WHERE id = auth.uid();

    -- Check if caller is an admin
    IF v_caller_role <> 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Only administrators can modify transfer verification codes.';
    END IF;

    -- Update code status depending on type
    IF p_type = 'COT' THEN
        UPDATE public.transfer_requests
        SET cot_status = p_status
        WHERE id = p_transfer_id;
    ELSIF p_type = 'VAT' THEN
        UPDATE public.transfer_requests
        SET vat_status = p_status
        WHERE id = p_transfer_id;
    ELSE
        RAISE EXCEPTION 'Invalid verification code type: %', p_type;
    END IF;

    -- If declined, we also decline the transfer request itself
    IF p_status = 'DECLINED' THEN
        UPDATE public.transfer_requests
        SET status = 'DECLINED',
            admin_reason = p_type || ' code verification was declined by administrator.'
        WHERE id = p_transfer_id;
    END IF;

    RETURN TRUE;
END;
$$;

-- 6. Update get_all_customers() function to return cot_enabled and vat_enabled
DROP FUNCTION IF EXISTS public.get_all_customers();
CREATE OR REPLACE FUNCTION public.get_all_customers()
RETURNS TABLE (
    id UUID,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    customer_number TEXT,
    email TEXT,
    account_number TEXT,
    account_type TEXT,
    current_balance NUMERIC,
    available_balance NUMERIC,
    status TEXT,
    currency TEXT,
    created_at TIMESTAMPTZ,
    cot_enabled BOOLEAN,
    vat_enabled BOOLEAN
) SECURITY DEFINER AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.first_name,
        p.last_name,
        p.phone,
        p.customer_number,
        u.email::text,
        a.account_number,
        a.account_type,
        a.current_balance,
        a.available_balance,
        a.status,
        a.currency::text,
        p.created_at,
        p.cot_enabled,
        p.vat_enabled
    FROM public.profiles p
    LEFT JOIN auth.users u ON p.id = u.id
    LEFT JOIN public.accounts a ON p.id = a.user_id;
END;
$$ LANGUAGE plpgsql;
