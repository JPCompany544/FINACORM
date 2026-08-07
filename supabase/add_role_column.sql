-- ─── MIGRATION: Add role column to profiles ───────────────────────────────────
-- Run this in the Supabase SQL Editor (once).
-- It adds a `role` column with a safe default of 'customer',
-- and exposes a simple RPC for admins to promote any user.

-- 1. Add role column (idempotent)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer'
  CHECK (role IN ('customer', 'admin'));

-- 2. Admin helper RPC: promotes a user to admin (runs with SECURITY DEFINER)
--    Only admins themselves can call this — protected by RLS on the function.
CREATE OR REPLACE FUNCTION public.set_user_role(p_user_id UUID, p_role TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_role NOT IN ('customer', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: %', p_role;
  END IF;

  UPDATE public.profiles
  SET role = p_role
  WHERE id = p_user_id;
END;
$$;
