-- ==============================================================================
-- FINACORM BANK: COMPLETE DATABASE RESET & SYSTEM ADMIN PROVISIONING SCRIPT
-- ==============================================================================
-- WARNING: Executing this script will purge ALL customer accounts, transactions, 
-- cards, transfers, notifications, and profiles from the database for a clean slate.
-- 
-- Run this script directly in the Supabase Dashboard -> SQL Editor.
-- ==============================================================================

BEGIN;

-- ─── 1. PURGE ALL AUXILIARY AND TRANSACTIONAL DATA ───────────────────────────
TRUNCATE TABLE public.transactions RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.transfer_audits RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.transfer_requests RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.credit_audits RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.notifications RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.scheduled_payments RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.beneficiaries RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.cards RESTART IDENTITY CASCADE;

-- ─── 2. PURGE ACCOUNTS & PROFILES ─────────────────────────────────────────────
TRUNCATE TABLE public.accounts RESTART IDENTITY CASCADE;
DELETE FROM public.profiles;

-- ─── 3. PURGE AUTH USERS (CLEAN SLATE FOR USER ACCOUNTS) ──────────────────────
-- Note: Deleting from auth.users removes all logins from Supabase Auth.
DELETE FROM auth.users;

COMMIT;

-- ==============================================================================
-- ADMIN MAINTENANCE INSTRUCTIONS & SQL QUERIES
-- ==============================================================================
--
-- HOW TO MAINTAIN & PROMOTE ADMIN ACCOUNTS:
-- 
-- METHOD A: Promote Any Registered User to Admin
-- 1. Register a new account via the app (/register) or Supabase Auth.
-- 2. Run the following SQL query in the Supabase SQL Editor:
-- 
--    UPDATE public.profiles
--    SET role = 'admin'
--    WHERE id = (SELECT id FROM auth.users WHERE email = 'YOUR_ADMIN_EMAIL@domain.com');
-- 
-- METHOD B: Demote an Admin Back to Standard Customer
-- 
--    UPDATE public.profiles
--    SET role = 'customer'
--    WHERE id = (SELECT id FROM auth.users WHERE email = 'USER_EMAIL@domain.com');
-- 
-- METHOD C: Verify Current System Admins
-- 
--    SELECT 
--      p.id, 
--      p.first_name, 
--      p.last_name, 
--      u.email, 
--      p.role, 
--      p.customer_number, 
--      p.created_at
--    FROM public.profiles p
--    JOIN auth.users u ON p.id = u.id
--    WHERE p.role = 'admin';
-- ==============================================================================
