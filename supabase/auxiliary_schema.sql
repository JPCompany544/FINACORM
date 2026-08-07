-- Auxiliary Schema definitions for Northstar Bank extra services
-- This schema represents cards, transactions, beneficiaries, scheduled payments, and notifications.

-- CARDS TABLE
CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    number TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('metal', 'virtual', 'standard')),
    brand TEXT NOT NULL CHECK (brand IN ('Visa', 'Mastercard')),
    cardholder_name TEXT NOT NULL,
    expiry TEXT NOT NULL DEFAULT '09/31',
    status TEXT NOT NULL CHECK (status IN ('Active', 'Frozen', 'Expired', 'Pending', 'Blocked', 'Lost')),
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    color TEXT NOT NULL,
    linked_account_id TEXT NOT NULL,
    available_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    daily_spending NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    monthly_spending NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    spending_limit_daily NUMERIC(15, 2) NOT NULL DEFAULT 2000.00,
    spending_limit_weekly NUMERIC(15, 2) NOT NULL DEFAULT 5000.00,
    spending_limit_monthly NUMERIC(15, 2) NOT NULL DEFAULT 10000.00,
    spending_limit_atm NUMERIC(15, 2) NOT NULL DEFAULT 1000.00,
    spending_limit_online NUMERIC(15, 2) NOT NULL DEFAULT 2000.00,
    spending_limit_contactless NUMERIC(15, 2) NOT NULL DEFAULT 500.00,
    pin TEXT NOT NULL DEFAULT '0000',
    online_payments BOOLEAN NOT NULL DEFAULT TRUE,
    contactless_payments BOOLEAN NOT NULL DEFAULT TRUE,
    atm_withdrawals BOOLEAN NOT NULL DEFAULT TRUE,
    international_transactions BOOLEAN NOT NULL DEFAULT FALSE,
    magstripe_payments BOOLEAN NOT NULL DEFAULT FALSE,
    recurring_payments BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id TEXT NOT NULL,
    merchant TEXT NOT NULL,
    description TEXT,
    amount NUMERIC(15, 2) NOT NULL,
    running_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL CHECK (status IN ('success', 'pending', 'failed')),
    type TEXT NOT NULL CHECK (type IN ('shopping', 'subscription', 'food', 'salary', 'transfer', 'utilities', 'travel', 'transport', 'insurance', 'investment', 'refund', 'other')),
    reference_number TEXT,
    payment_method TEXT DEFAULT 'Electronic Transfer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- BENEFICIARIES TABLE
CREATE TABLE IF NOT EXISTS beneficiaries (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    account_number TEXT NOT NULL,
    bank_name TEXT NOT NULL DEFAULT 'External Bank',
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    type TEXT NOT NULL DEFAULT 'domestic' CHECK (type IN ('domestic', 'international')),
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- SCHEDULED PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS scheduled_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for each table
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow users select/insert/update/delete their own data
CREATE POLICY "cards_self" ON cards FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "transactions_self" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "beneficiaries_self" ON beneficiaries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "scheduled_payments_self" ON scheduled_payments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "notifications_self" ON notifications FOR ALL USING (auth.uid() = user_id);

-- CREDIT AUDITS TABLE
CREATE TABLE IF NOT EXISTS credit_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    reference TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE credit_audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "credit_audits_select" ON credit_audits FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "credit_audits_insert" ON credit_audits FOR INSERT TO authenticated WITH CHECK (TRUE);

-- RPC FUNCTION FOR ATOMIC CREDITS (by account_id)
CREATE OR REPLACE FUNCTION credit_account(
    p_account_id UUID,
    p_amount NUMERIC,
    p_reference TEXT,
    p_description TEXT,
    p_admin_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_user_id UUID;
    v_current_balance NUMERIC;
    v_currency VARCHAR(3);
BEGIN
    SELECT user_id, current_balance, currency INTO v_user_id, v_current_balance, v_currency
    FROM public.accounts
    WHERE id = p_account_id AND status = 'ACTIVE'
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    UPDATE public.accounts
    SET current_balance = current_balance + p_amount,
        available_balance = available_balance + p_amount
    WHERE id = p_account_id;

    INSERT INTO public.transactions (
        user_id, account_id, merchant, description, amount, status, type, reference_number,
        direction, currency, balance_before, balance_after, source, destination, created_by
    )
    VALUES (
        v_user_id, CAST(p_account_id AS TEXT), 'Credit', p_description, p_amount, 'success', 'CREDIT', p_reference,
        'CREDIT', COALESCE(v_currency, 'USD'), v_current_balance, v_current_balance + p_amount, 'Northstar Adjustment', 'Northstar Account', p_admin_id
    );

    INSERT INTO public.credit_audits (admin_id, customer_id, amount, reference, description)
    VALUES (p_admin_id, v_user_id, p_amount, p_reference, p_description);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC FUNCTION FOR ATOMIC CREDITS (by user_id — preferred for admin panel)
-- Uses SECURITY DEFINER to bypass RLS. Finds the customer's primary active account
-- automatically so callers only need the user/profile UUID.
-- Transaction and audit inserts are graceful — they skip silently if those
-- tables have not yet been migrated.
CREATE OR REPLACE FUNCTION credit_customer(
    p_user_id UUID,
    p_amount NUMERIC,
    p_reference TEXT,
    p_description TEXT,
    p_admin_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_account_id UUID;
BEGIN
    -- Validate amount
    IF p_amount <= 0 THEN
        RETURN FALSE;
    END IF;

    -- Find the primary active account for this user (prefer CHECKING)
    DECLARE
        v_current_balance NUMERIC;
        v_currency VARCHAR(3);
    BEGIN
        SELECT id, current_balance, currency INTO v_account_id, v_current_balance, v_currency
        FROM public.accounts
        WHERE user_id = p_user_id AND status = 'ACTIVE'
        ORDER BY CASE WHEN upper(account_type) = 'CHECKING' THEN 0 ELSE 1 END, created_at ASC
        LIMIT 1
        FOR UPDATE;

        IF NOT FOUND THEN
            RETURN FALSE;
        END IF;

        -- Apply credit to both balance columns
        UPDATE public.accounts
        SET current_balance   = current_balance   + p_amount,
            available_balance = available_balance + p_amount
        WHERE id = v_account_id;

        -- Record ledger transaction (skips silently if transactions table not yet created)
        BEGIN
            INSERT INTO public.transactions (
                user_id, account_id, merchant, description, amount, status, type, reference_number,
                direction, currency, balance_before, balance_after, source, destination, created_by
            )
            VALUES (
                p_user_id, CAST(v_account_id AS TEXT), 'ADMIN CREDIT', p_description, p_amount, 'success', 'CREDIT', p_reference,
                'CREDIT', COALESCE(v_currency, 'USD'), v_current_balance, v_current_balance + p_amount, 'Northstar Adjustment', 'Northstar Account', p_admin_id
            );
        EXCEPTION WHEN undefined_table THEN
            NULL;
        END;
    END;

    -- Record admin audit trail (skips silently if credit_audits table not yet created)
    BEGIN
        INSERT INTO public.credit_audits
            (admin_id, customer_id, amount, reference, description)
        VALUES
            (p_admin_id, p_user_id, p_amount, p_reference, p_description);
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC FUNCTION TO GET ALL CUSTOMERS WITH EMAILS (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION get_all_customers()
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
    created_at TIMESTAMPTZ
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
        p.created_at
    FROM public.profiles p
    LEFT JOIN auth.users u ON p.id = u.id
    LEFT JOIN public.accounts a ON p.id = a.user_id;
END;
$$ LANGUAGE plpgsql;

-- ─── TRANSFER APPROVAL SYSTEM ADDITIONS ──────────────────────────────────────

-- 1. Add Transfer PIN to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS transfer_pin TEXT DEFAULT '1234';

-- 2. Create Transfer Requests Table
CREATE TABLE IF NOT EXISTS public.transfer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    source_account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    recipient_name TEXT NOT NULL,
    recipient_bank TEXT NOT NULL,
    destination_country TEXT NOT NULL,
    recipient_account_number TEXT NOT NULL,
    routing_information TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    transfer_type TEXT NOT NULL DEFAULT 'domestic',
    transfer_speed TEXT NOT NULL DEFAULT 'standard',
    description TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL' CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'DECLINED')),
    admin_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Transfer Requests
ALTER TABLE public.transfer_requests ENABLE ROW LEVEL SECURITY;

-- Policies for Transfer Requests
CREATE POLICY "Users can view and manage their own transfer requests"
    ON public.transfer_requests FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transfer requests"
    ON public.transfer_requests FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Admins can update transfer requests"
    ON public.transfer_requests FOR UPDATE TO authenticated USING (TRUE);

-- 3. Create Transfer Audits Table
CREATE TABLE IF NOT EXISTS public.transfer_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL,
    transfer_id UUID REFERENCES public.transfer_requests(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('APPROVE', 'DECLINE')),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Transfer Audits
ALTER TABLE public.transfer_audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view and create transfer audits"
    ON public.transfer_audits FOR ALL TO authenticated USING (TRUE);

-- Enable Realtime for Transfer Requests table
-- If the publication exists, add the table to it
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.transfer_requests;
    END IF;
END $$;

-- RPC FUNCTION TO PERFORM BALANCED TRANSFERS (SECURITY DEFINER)
-- Lock source account, verify balance, debit sender, credit local recipient if applicable,
-- and log transaction logs atomically.
CREATE OR REPLACE FUNCTION public.transfer_funds_rpc(
    p_sender_id UUID,
    p_source_account_id UUID,
    p_recipient_name TEXT,
    p_recipient_bank TEXT,
    p_recipient_account TEXT,
    p_amount NUMERIC,
    p_currency VARCHAR,
    p_reference TEXT,
    p_description TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    v_sender_balance NUMERIC;
    v_sender_currency VARCHAR(3);
    v_recipient_user_id UUID;
    v_recipient_account_id UUID;
    v_recipient_balance NUMERIC;
    v_recipient_currency VARCHAR(3);
    v_is_local BOOLEAN := FALSE;
BEGIN
    -- 1. Lock source account and verify status and balance
    SELECT current_balance, currency INTO v_sender_balance, v_sender_currency
    FROM public.accounts
    WHERE id = p_source_account_id AND user_id = p_sender_id AND status = 'ACTIVE'
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Source account not found or inactive';
    END IF;

    IF v_sender_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient funds in source account';
    END IF;

    -- 2. Check if recipient account is local (lives in our bank)
    SELECT id, user_id, current_balance, currency INTO v_recipient_account_id, v_recipient_user_id, v_recipient_balance, v_recipient_currency
    FROM public.accounts
    WHERE account_number = p_recipient_account AND status = 'ACTIVE'
    FOR UPDATE;

    IF FOUND THEN
        v_is_local := TRUE;
    END IF;

    -- 3. Perform debit on sender
    UPDATE public.accounts
    SET current_balance = current_balance - p_amount,
        available_balance = available_balance - p_amount
    WHERE id = p_source_account_id;

    -- 4. Create debit transaction for sender (fully populated)
    INSERT INTO public.transactions (
        user_id, account_id, merchant, description, amount, status, type, reference_number,
        direction, currency, balance_before, balance_after, source, destination,
        recipient_name, recipient_bank, recipient_account_number
    )
    VALUES (
        p_sender_id, CAST(p_source_account_id AS TEXT), p_recipient_name, p_description, p_amount, 'success', 'TRANSFER_SENT', p_reference,
        'DEBIT', COALESCE(p_currency, v_sender_currency, 'USD'), v_sender_balance, v_sender_balance - p_amount, 'Northstar Account', p_recipient_bank,
        p_recipient_name, p_recipient_bank, p_recipient_account
    );

    -- 5. If local, perform credit on recipient and create credit transaction
    IF v_is_local THEN
        UPDATE public.accounts
        SET current_balance = current_balance + p_amount,
            available_balance = available_balance + p_amount
        WHERE id = v_recipient_account_id;

        INSERT INTO public.transactions (
            user_id, account_id, merchant, description, amount, status, type, reference_number,
            direction, currency, balance_before, balance_after, source, destination,
            recipient_name, recipient_bank, recipient_account_number
        )
        VALUES (
            v_recipient_user_id, CAST(v_recipient_account_id AS TEXT), 'Internal Transfer', p_description, p_amount, 'success', 'TRANSFER_RECEIVED', p_reference,
            'CREDIT', COALESCE(p_currency, v_recipient_currency, 'USD'), v_recipient_balance, v_recipient_balance + p_amount, 'Northstar Account', 'Northstar Account',
            p_recipient_name, 'Northstar Bank', p_recipient_account
        );
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ─── TRANSACTION LEDGER STRUCTURE UPGRADES ───────────────────────────────────

-- Alter transactions table to remove CHECK constraints and add missing ledger columns
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_status_check;
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_type_check;

ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS direction TEXT CHECK (direction IN ('CREDIT', 'DEBIT'));
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD';
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS balance_before NUMERIC(15, 2) DEFAULT 0.00;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS balance_after NUMERIC(15, 2) DEFAULT 0.00;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS destination TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS recipient_name TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS recipient_bank TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS recipient_account_number TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS destination_country TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS transfer_speed TEXT;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS created_by UUID;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS approved_by UUID;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Alter beneficiaries table to add missing details
ALTER TABLE public.beneficiaries ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.beneficiaries ADD COLUMN IF NOT EXISTS routing_information TEXT;
ALTER TABLE public.beneficiaries ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD';
ALTER TABLE public.beneficiaries ADD COLUMN IF NOT EXISTS nickname TEXT;





