-- ═══════════════════════════════════════════════════════════════════
-- Phmurt Studios — Security Hardening Migration
-- Fixes critical RLS gaps found during security audit
-- Safe to re-run (uses IF NOT EXISTS / DROP IF EXISTS)
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════
-- 1. CHARACTERS TABLE — Ensure RLS is enabled with proper policies
-- ══════════════════════════════════════════════════════════════════
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;

-- Owner can read their own characters
DROP POLICY IF EXISTS "Own access" ON public.characters;
CREATE POLICY "Own access" ON public.characters FOR ALL
  USING (auth.uid() = owner_id);

-- Admins can read all characters (for admin panel)
DROP POLICY IF EXISTS "Admin read" ON public.characters;
CREATE POLICY "Admin read" ON public.characters FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true)));

-- Superusers can delete any character (for moderation)
DROP POLICY IF EXISTS "Superuser delete" ON public.characters;
CREATE POLICY "Superuser delete" ON public.characters FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_superuser = true));

-- Admins can update flags on any character (for moderation)
DROP POLICY IF EXISTS "Admin flag" ON public.characters;
CREATE POLICY "Admin flag" ON public.characters FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true)));

-- ══════════════════════════════════════════════════════════════════
-- 2. CAMPAIGNS TABLE — Ensure RLS is enabled with proper policies
-- ══════════════════════════════════════════════════════════════════
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Owner can do everything with their own campaigns
DROP POLICY IF EXISTS "Own access" ON public.campaigns;
CREATE POLICY "Own access" ON public.campaigns FOR ALL
  USING (auth.uid() = owner_id);

-- Admins can read all campaigns (for admin panel)
DROP POLICY IF EXISTS "Admin read" ON public.campaigns;
CREATE POLICY "Admin read" ON public.campaigns FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true)));

-- Superusers can delete any campaign (for moderation)
DROP POLICY IF EXISTS "Superuser delete" ON public.campaigns;
CREATE POLICY "Superuser delete" ON public.campaigns FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_superuser = true));

-- Admins can update flags on any campaign (for moderation)
DROP POLICY IF EXISTS "Admin flag" ON public.campaigns;
CREATE POLICY "Admin flag" ON public.campaigns FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true)));

-- ══════════════════════════════════════════════════════════════════
-- 3. PROFILES TABLE — Add admin read policy (critical for admin panel)
-- ══════════════════════════════════════════════════════════════════
-- Without this, non-superuser admins cannot view user management
DROP POLICY IF EXISTS "Admin read profiles" ON public.profiles;
CREATE POLICY "Admin read profiles" ON public.profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true)));

-- Admins can update profiles (ban, set admin, notes, tags)
DROP POLICY IF EXISTS "Admin update profiles" ON public.profiles;
CREATE POLICY "Admin update profiles" ON public.profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true)));

-- ══════════════════════════════════════════════════════════════════
-- 4. ADMIN AUDIT LOG — Make immutable (no UPDATE/DELETE by anyone via RLS)
-- ══════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Deny audit update" ON public.admin_audit_log;
CREATE POLICY "Deny audit update" ON public.admin_audit_log FOR UPDATE
  USING (false);

DROP POLICY IF EXISTS "Deny audit delete" ON public.admin_audit_log;
CREATE POLICY "Deny audit delete" ON public.admin_audit_log FOR DELETE
  USING (false);

-- ══════════════════════════════════════════════════════════════════
-- 5. SITE ERRORS — Block user tampering (only admins can delete via cleanup)
-- ══════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Deny error update" ON public.site_errors;
CREATE POLICY "Deny error update" ON public.site_errors FOR UPDATE
  USING (false);

-- ══════════════════════════════════════════════════════════════════
-- 6. SITE VISITS — Block user tampering
-- ══════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Deny visit update" ON public.site_visits;
CREATE POLICY "Deny visit update" ON public.site_visits FOR UPDATE
  USING (false);

-- ══════════════════════════════════════════════════════════════════
-- 7. STRIPE EVENTS — Ensure RLS is on and no public access
-- ══════════════════════════════════════════════════════════════════
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
-- Only admin read policy exists (from migration-fix-all.sql)
-- No INSERT/UPDATE/DELETE policies = only service_role can write (correct)

-- ══════════════════════════════════════════════════════════════════
-- 8. SITE SETTINGS — Restrict read to authenticated users only
-- ══════════════════════════════════════════════════════════════════
-- Public feature flags need to be readable by the site JS, but
-- we can restrict to authenticated + anon (Supabase anon key) which
-- is effectively the same but prevents completely unauthenticated access
-- Keeping as-is since site JS needs to read flags for feature gating

-- ══════════════════════════════════════════════════════════════════
-- DONE! All critical RLS gaps have been patched.
-- ══════════════════════════════════════════════════════════════════
