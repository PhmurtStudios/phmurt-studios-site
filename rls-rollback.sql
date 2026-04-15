-- ============================================================
-- ROLLBACK SCRIPT — restores RLS policies to pre-fix state
-- Generated 2026-04-15 from pg_policies snapshot
-- Run this in the Supabase SQL editor if anything breaks
-- ============================================================

-- Restore the profiles UPDATE policy (NOTE: this restores the VULNERABLE state)
DROP POLICY IF EXISTS "Service role can update all profiles" ON public.profiles;
CREATE POLICY "Service role can update all profiles"
  ON public.profiles AS PERMISSIVE FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Restore the duplicate site_errors anon-insert policies
DROP POLICY IF EXISTS "Anon insert" ON public.site_errors;
CREATE POLICY "Anon insert"
  ON public.site_errors AS PERMISSIVE FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anon insert errors" ON public.site_errors;
CREATE POLICY "Anon insert errors"
  ON public.site_errors AS PERMISSIVE FOR INSERT
  TO public
  WITH CHECK (true);
