-- ═══════════════════════════════════════════════════════════════
-- MIGRATION: Admin Panel Features
-- Run this ONCE in Supabase SQL Editor (Dashboard → SQL Editor)
-- Safe to run multiple times (uses IF NOT EXISTS / ADD COLUMN IF)
-- ═══════════════════════════════════════════════════════════════

-- 1. Add admin notes + tags to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tags text[];

-- 2. Add flagging columns to characters
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS flagged boolean DEFAULT false;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS flag_reason text;

-- 3. Add flagging columns to campaigns
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS flagged boolean DEFAULT false;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS flag_reason text;

-- 4. Create site_errors table for client-side error logging
CREATE TABLE IF NOT EXISTS public.site_errors (
  id         bigserial PRIMARY KEY,
  message    text,
  stack      text,
  page       text,
  user_agent text,
  user_id    uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_errors ENABLE ROW LEVEL SECURITY;

-- Allow any visitor (including anonymous) to insert errors
DO $$ BEGIN
  CREATE POLICY "Anon insert" ON public.site_errors FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Only admins can read errors
DO $$ BEGIN
  CREATE POLICY "Admin read" ON public.site_errors FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true))
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
