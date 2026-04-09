-- ═══════════════════════════════════════════════════════════════════════════
-- PHMURT STUDIOS — SUPABASE SECURITY FIX
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════════════
-- FIXES:
--   1. profiles table: open SELECT → locked to own profile only
--   2. campaigns table: infinite-recursion RLS → non-recursive policy
-- ═══════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────
-- 1. PROFILES TABLE — Lock down to own-profile-only access
-- ─────────────────────────────────────────────────────────────────────────
-- Drop any existing permissive SELECT policies that expose all rows
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON profiles;
DROP POLICY IF EXISTS "Allow public read" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own profile,
-- but CANNOT modify privilege/moderation columns (is_admin, is_superuser, is_banned).
--
-- IMPORTANT: The old WITH CHECK used subqueries back to the profiles table,
-- which caused infinite recursion in Supabase RLS evaluation. The fix uses a
-- SECURITY DEFINER function that bypasses RLS to read the current privilege values.

-- Helper function: reads privilege columns bypassing RLS (runs as DB owner)
CREATE OR REPLACE FUNCTION public.profiles_privilege_check(
  row_id uuid,
  new_is_admin boolean,
  new_is_superuser boolean,
  new_is_banned boolean
) RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public
AS $$
  SELECT
    COALESCE(new_is_admin, false)    = COALESCE(p.is_admin, false)
    AND COALESCE(new_is_superuser, false) = COALESCE(p.is_superuser, false)
    AND COALESCE(new_is_banned, false)    = COALESCE(p.is_banned, false)
  FROM profiles p
  WHERE p.id = row_id;
$$;

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND public.profiles_privilege_check(id, is_admin, is_superuser, is_banned)
  );

-- Users can insert their own profile (for sign-up)
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow campaign_members to read names of other members (limited columns via app logic)
-- This lets the join query in getMyCampaigns work: campaign_members.select('..., profiles(name, email)')
CREATE POLICY "profiles_select_for_campaign_members"
  ON profiles FOR SELECT
  USING (
    id IN (
      SELECT cm.user_id FROM campaign_members cm
      WHERE cm.campaign_id IN (
        SELECT cm2.campaign_id FROM campaign_members cm2
        WHERE cm2.user_id = auth.uid()
      )
    )
  );


-- ─────────────────────────────────────────────────────────────────────────
-- 2. CAMPAIGNS TABLE — Fix infinite recursion in RLS policy
-- ─────────────────────────────────────────────────────────────────────────
-- The old policy likely referenced campaigns within its own USING clause,
-- causing infinite recursion. Drop all existing SELECT policies and recreate.
DROP POLICY IF EXISTS "campaigns_select" ON campaigns;
DROP POLICY IF EXISTS "campaigns_select_own" ON campaigns;
DROP POLICY IF EXISTS "campaigns_select_member" ON campaigns;
DROP POLICY IF EXISTS "Users can view own campaigns" ON campaigns;
DROP POLICY IF EXISTS "Members can view campaigns" ON campaigns;
DROP POLICY IF EXISTS "Enable read access for campaign owners and members" ON campaigns;
DROP POLICY IF EXISTS "campaigns_update_own" ON campaigns;
DROP POLICY IF EXISTS "campaigns_insert_own" ON campaigns;
DROP POLICY IF EXISTS "campaigns_delete_own" ON campaigns;

-- Ensure RLS is enabled
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Owner can do everything with their own campaigns
CREATE POLICY "campaigns_select_own"
  ON campaigns FOR SELECT
  USING (auth.uid() = owner_id);

-- Members can view campaigns they belong to
-- NOTE: This references campaign_members (a DIFFERENT table), not campaigns itself,
-- so there is no recursion.
CREATE POLICY "campaigns_select_member"
  ON campaigns FOR SELECT
  USING (
    id IN (
      SELECT cm.campaign_id FROM campaign_members cm
      WHERE cm.user_id = auth.uid()
    )
  );

-- Only owner can update
CREATE POLICY "campaigns_update_own"
  ON campaigns FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- Any authenticated user can create campaigns
CREATE POLICY "campaigns_insert_own"
  ON campaigns FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Only owner can delete
CREATE POLICY "campaigns_delete_own"
  ON campaigns FOR DELETE
  USING (auth.uid() = owner_id);


-- ─────────────────────────────────────────────────────────────────────────
-- 3. CAMPAIGN_MEMBERS TABLE — Ensure proper RLS
-- ─────────────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "campaign_members_select" ON campaign_members;
DROP POLICY IF EXISTS "campaign_members_insert" ON campaign_members;
DROP POLICY IF EXISTS "campaign_members_delete" ON campaign_members;

ALTER TABLE campaign_members ENABLE ROW LEVEL SECURITY;

-- Members can see other members in campaigns they belong to
CREATE POLICY "campaign_members_select"
  ON campaign_members FOR SELECT
  USING (
    campaign_id IN (
      SELECT cm.campaign_id FROM campaign_members cm
      WHERE cm.user_id = auth.uid()
    )
    OR
    campaign_id IN (
      SELECT c.id FROM campaigns c
      WHERE c.owner_id = auth.uid()
    )
  );

-- Campaign owner can add members
CREATE POLICY "campaign_members_insert"
  ON campaign_members FOR INSERT
  WITH CHECK (
    campaign_id IN (
      SELECT c.id FROM campaigns c
      WHERE c.owner_id = auth.uid()
    )
  );

-- Campaign owner can remove members, or member can remove themselves
CREATE POLICY "campaign_members_delete"
  ON campaign_members FOR DELETE
  USING (
    auth.uid() = user_id
    OR
    campaign_id IN (
      SELECT c.id FROM campaigns c
      WHERE c.owner_id = auth.uid()
    )
  );


-- ─────────────────────────────────────────────────────────────────────────
-- 4. VERIFY — Run these queries to confirm policies are active
-- ─────────────────────────────────────────────────────────────────────────
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('profiles', 'campaigns', 'campaign_members')
-- ORDER BY tablename, policyname;
