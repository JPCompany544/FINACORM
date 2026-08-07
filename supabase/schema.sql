-- Enable UUID generation extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. PROFILES TABLE ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  customer_number TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 2. ACCOUNTS TABLE ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  account_number TEXT UNIQUE NOT NULL,
  account_type TEXT NOT NULL, -- e.g., 'checking', 'savings', 'investments'
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'ACTIVE', -- e.g., 'ACTIVE', 'FROZEN', 'INACTIVE'
  available_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  current_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT check_currency_length CHECK (char_length(currency) = 3)
);

-- ─── 3. AUTOMATIC UPDATED_AT TRIGGER ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_profiles_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_update_accounts_timestamp
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── 4. AUTOMATIC PROFILE CREATION TRIGGER (SUPABASE AUTH SYNC) ───────────────
-- This function automatically creates a profile when a user signs up.
-- It reads name, phone and generates a unique customer number if not supplied.
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER AS $$
DECLARE
  v_first_name TEXT;
  v_last_name TEXT;
  v_customer_num TEXT;
BEGIN
  -- Extract names from raw_user_meta_data if present, otherwise default to empty
  v_first_name := COALESCE(NEW.raw_user_meta_data->>'first_name', '');
  v_last_name := COALESCE(NEW.raw_user_meta_data->>'last_name', '');
  
  -- Generate a random unique customer number (e.g. NS-12345678)
  v_customer_num := 'NS-' || lpadded(floor(random() * 100000000)::text, 8, '0');
  
  -- Prevent collision on customer number
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE customer_number = v_customer_num) LOOP
    v_customer_num := 'NS-' || lpadded(floor(random() * 100000000)::text, 8, '0');
  END LOOP;

  INSERT INTO public.profiles (id, first_name, last_name, phone, customer_number)
  VALUES (
    NEW.id,
    v_first_name,
    v_last_name,
    COALESCE(NEW.phone, NEW.raw_user_meta_data->>'phone'),
    v_customer_num
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger linked to the auth.users table
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_signup();

-- ─── 5. INDEXES FOR QUERY OPTIMIZATION ────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_customer_number ON public.profiles(customer_number);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_account_number ON public.accounts(account_number);

-- ─── 6. ROW LEVEL SECURITY (RLS) policies ────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Accounts Policies
CREATE POLICY "Users can view their own accounts" 
  ON public.accounts 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts" 
  ON public.accounts 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
