-- ─── MIGRATION: Admin Delete User RPC Function ───────────────────────────
-- Run this script in the Supabase Dashboard -> SQL Editor.
--
-- This function allows an authenticated administrator to permanently and safely
-- purge a customer account. Because it runs with SECURITY DEFINER, it has the
-- privileges to delete from auth.users, which cascades to all connected tables:
--   - public.profiles
--   - public.accounts
--   - public.cards
--   - public.transactions
--   - public.beneficiaries
--   - public.scheduled_payments
--   - public.notifications
--   - public.transfer_requests (and public.transfer_audits via cascade)
--
-- It also cleans up auxiliary tables that lack direct CASCADE foreign keys
-- (such as public.credit_audits), and prevents deletion of administrators.

CREATE OR REPLACE FUNCTION public.admin_delete_user(p_target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    v_caller_id UUID;
    v_caller_role TEXT;
    v_target_role TEXT;
    v_target_email TEXT;
    v_target_name TEXT;
BEGIN
    -- 1. Verify caller authentication
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: You must be logged in to execute this operation.';
    END IF;

    -- 2. Verify caller has admin role
    SELECT role INTO v_caller_role
    FROM public.profiles
    WHERE id = v_caller_id;

    IF v_caller_role IS NULL OR v_caller_role <> 'admin' THEN
        RAISE EXCEPTION 'Unauthorized: Only system administrators can delete customer accounts.';
    END IF;

    -- 3. Prevent self-deletion
    IF v_caller_id = p_target_user_id THEN
        RAISE EXCEPTION 'Action Prohibited: Administrators cannot delete their own account.';
    END IF;

    -- 4. Check target user role to protect administrators
    SELECT role, first_name || ' ' || last_name INTO v_target_role, v_target_name
    FROM public.profiles
    WHERE id = p_target_user_id;

    IF v_target_role = 'admin' THEN
        RAISE EXCEPTION 'Action Prohibited: Administrator accounts cannot be deleted directly.';
    END IF;

    -- Fetch target email for audit record if available
    SELECT email INTO v_target_email
    FROM auth.users
    WHERE id = p_target_user_id;

    -- 5. Delete auxiliary records that might not have ON DELETE CASCADE
    -- (e.g. credit_audits where customer_id is the target user)
    DELETE FROM public.credit_audits
    WHERE customer_id = p_target_user_id;

    -- 6. Delete from auth.users (cascades to profiles, accounts, cards, transactions, transfer_requests, etc.)
    DELETE FROM auth.users
    WHERE id = p_target_user_id;

    -- 7. Ensure profile is purged if it was orphaned without an auth.users record
    DELETE FROM public.profiles
    WHERE id = p_target_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'deleted_user_id', p_target_user_id,
        'deleted_user_name', COALESCE(v_target_name, 'Unknown'),
        'deleted_user_email', COALESCE(v_target_email, 'Unknown')
    );
END;
$$;

-- Grant execution permission to authenticated users (the function itself verifies admin role)
GRANT EXECUTE ON FUNCTION public.admin_delete_user(UUID) TO authenticated;
