-- ─── Idempotent Drop Statements ──────────────────────────────────────────────
-- Always drop the trigger first before dropping the function to avoid dependency locks.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_signup();

-- ─── Provisioning Function ──────────────────────────────────────────────────
-- This function runs under SECURITY DEFINER privileges to bypass row-level-security (RLS)
-- restrictions during user registration, letting it safely write to profiles and accounts.
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
BEGIN
  -- 1. Extract raw metadata passed from signup
  v_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  v_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  v_phone := COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone', '');

  -- 2. Generate a unique Customer Number (e.g. CUS-10000001)
  -- We query the current maximum suffix and increment it, starting at 10000001
  SELECT COALESCE(
    SUBSTRING(MAX(customer_number) FROM 'CUS-(\d+)')::INTEGER + 1,
    10000001
  )
  INTO v_next_cus_val
  FROM public.profiles;
  
  v_customer_num := 'CUS-' || v_next_cus_val::TEXT;

  -- 3. Generate a unique 10-digit Account Number (e.g. 1000000001)
  -- We search for the maximum account number and increment it, starting at 1000000001
  -- Since account numbers are numeric-only strings, we cast to BIGINT for incrementing.
  SELECT COALESCE(
    MAX(account_number)::BIGINT + 1,
    1000000001
  )
  INTO v_next_acc_val
  FROM public.accounts
  WHERE account_number ~ '^\d+$'; -- safety check to ensure numeric sequence integrity
  
  v_account_number := v_next_acc_val::TEXT;

  -- 4. Safe insert transaction wrapper to prevent blocking user signups on edge cases
  BEGIN
    -- Insert profile details
    INSERT INTO public.profiles (
      id, 
      first_name, 
      last_name, 
      phone, 
      customer_number, 
      created_at, 
      updated_at
    )
    VALUES (
      NEW.id,
      v_first_name,
      v_last_name,
      v_phone,
      v_customer_num,
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
    -- Log exception and abort transaction
    RAISE EXCEPTION 'Automatic customer provisioning failed for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Provisioning Trigger ───────────────────────────────────────────────────
-- Attaches the provisioning function as an AFTER INSERT trigger on the auth.users table.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_signup();
