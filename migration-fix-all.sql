-- ═══════════════════════════════════════════════════════════════════
-- Phmurt Studios — Fix-All Migration
-- Safely creates/adds everything the admin panel expects.
-- Uses IF NOT EXISTS / IF NOT EXISTS everywhere so it's safe to re-run.
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════

-- ══════════════════════════════════════════════════════════════════
-- 1. PROFILES — add any missing columns
-- ══════════════════════════════════════════════════════════════════
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_superuser boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_banned boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tags text[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_beta_user boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_tier text DEFAULT 'free';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT null;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text DEFAULT null;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_started_at timestamptz DEFAULT null;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz DEFAULT null;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_cancel_at timestamptz DEFAULT null;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_interval text DEFAULT null;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_subscription ON public.profiles (subscription_tier);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe ON public.profiles (stripe_customer_id);

-- Constraints (safe: catches duplicate_object)
DO $$ BEGIN
  ALTER TABLE public.profiles ADD CONSTRAINT chk_subscription_tier
    CHECK (subscription_tier IN ('free', 'pro'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE public.profiles ADD CONSTRAINT chk_subscription_interval
    CHECK (subscription_interval IS NULL OR subscription_interval IN ('monthly', 'yearly'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ══════════════════════════════════════════════════════════════════
-- 2. CHARACTERS — add any missing columns
-- ══════════════════════════════════════════════════════════════════
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS race text;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS class text;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS level integer DEFAULT 1;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS builder_type text DEFAULT '5e';
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS flagged boolean DEFAULT false;
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS flag_reason text;
ALTER TABLE public.characters ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- ══════════════════════════════════════════════════════════════════
-- 3. CAMPAIGNS — add any missing columns
-- ══════════════════════════════════════════════════════════════════
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS system text;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS invite_code text;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS flagged boolean DEFAULT false;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS flag_reason text;

-- ══════════════════════════════════════════════════════════════════
-- 4. ADMIN AUDIT LOG
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id          bigserial PRIMARY KEY,
  admin_id    uuid REFERENCES auth.users ON DELETE SET NULL,
  admin_email text,
  action      text NOT NULL,
  target_type text,
  target_id   text,
  details     jsonb DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Policies (safe: drop first then re-create)
DROP POLICY IF EXISTS "Admin read audit" ON public.admin_audit_log;
CREATE POLICY "Admin read audit" ON public.admin_audit_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true))
);
DROP POLICY IF EXISTS "Admin insert audit" ON public.admin_audit_log;
CREATE POLICY "Admin insert audit" ON public.admin_audit_log FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true))
);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON public.admin_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON public.admin_audit_log (action);
CREATE INDEX IF NOT EXISTS idx_audit_log_target ON public.admin_audit_log (target_type, target_id);

-- ══════════════════════════════════════════════════════════════════
-- 5. SITE ANNOUNCEMENTS
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.site_announcements (
  id          bigserial PRIMARY KEY,
  title       text NOT NULL,
  message     text NOT NULL,
  type        text DEFAULT 'info',
  is_active   boolean DEFAULT true,
  show_on     text[] DEFAULT '{}',
  starts_at   timestamptz DEFAULT now(),
  expires_at  timestamptz,
  dismissible boolean DEFAULT true,
  created_by  uuid REFERENCES auth.users ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
ALTER TABLE public.site_announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active" ON public.site_announcements;
CREATE POLICY "Public read active" ON public.site_announcements FOR SELECT USING (
  is_active = true
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true))
);
DROP POLICY IF EXISTS "Admin manage" ON public.site_announcements;
CREATE POLICY "Admin manage" ON public.site_announcements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true))
);

-- ══════════════════════════════════════════════════════════════════
-- 6. SITE SETTINGS
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.site_settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL DEFAULT 'false',
  label       text,
  description text,
  category    text DEFAULT 'general',
  data_type   text DEFAULT 'boolean',
  updated_by  uuid REFERENCES auth.users ON DELETE SET NULL,
  updated_at  timestamptz DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read settings" ON public.site_settings;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin manage settings" ON public.site_settings;
CREATE POLICY "Admin manage settings" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true))
);

-- Seed default settings (won't overwrite existing)
INSERT INTO public.site_settings (key, value, label, description, category, data_type) VALUES
  ('maintenance_mode',        'false',  'Maintenance Mode',         'Put the entire site into read-only maintenance mode.', 'maintenance', 'boolean'),
  ('maintenance_message',     '"We''re performing scheduled maintenance. The site will be back shortly!"', 'Maintenance Message', 'Custom message shown during maintenance mode.', 'maintenance', 'string'),
  ('maintenance_allowed_ips', '[]',     'Maintenance Bypass IPs',   'JSON array of IP addresses that can bypass maintenance mode.', 'maintenance', 'json'),
  ('maintenance_eta',         'null',   'Maintenance ETA',          'Estimated time maintenance will end (ISO timestamp).', 'maintenance', 'string'),
  ('feature_character_builder',    'true',  'Character Builder',         'Enable/disable the character builder tool.', 'features', 'boolean'),
  ('feature_campaign_manager',     'true',  'Campaign Manager',          'Enable/disable campaign creation and management.', 'features', 'boolean'),
  ('feature_cloud_sync',           'true',  'Cloud Sync',                'Enable/disable cloud sync for characters and campaigns.', 'features', 'boolean'),
  ('feature_gallery',              'true',  'Community Gallery',         'Enable/disable the community gallery page.', 'features', 'boolean'),
  ('feature_compendium',           'true',  'Compendium',                'Enable/disable the compendium/reference pages.', 'features', 'boolean'),
  ('feature_generators',           'true',  'Generators',                'Enable/disable random generators.', 'features', 'boolean'),
  ('feature_soup_savant',          'true',  'Soup Savant',               'Enable/disable the Soup Savant mini-game.', 'features', 'boolean'),
  ('feature_new_signups',          'true',  'New User Registration',     'Allow new users to create accounts.', 'features', 'boolean'),
  ('feature_password_reset',       'true',  'Password Reset',            'Allow users to reset their passwords via email.', 'features', 'boolean'),
  ('beta_enabled',                 'false', 'Beta Features Global',      'Master toggle for beta features.', 'beta', 'boolean'),
  ('beta_character_builder_35',    'false', '3.5e Character Builder',    'Beta: the 3.5 edition character builder.', 'beta', 'boolean'),
  ('beta_advanced_dice',           'false', 'Advanced Dice Roller',      'Beta: advanced dice roller with custom macros.', 'beta', 'boolean'),
  ('beta_live_sessions',           'false', 'Live Session Tracker',      'Beta: real-time collaborative session tracking.', 'beta', 'boolean'),
  ('beta_ai_npc_generator',       'false', 'AI NPC Generator',          'Beta: AI-powered NPC personality and backstory generator.', 'beta', 'boolean'),
  ('limit_max_file_upload_mb', '5',   'Max File Upload Size (MB)', 'Maximum upload size for portraits and map images.', 'limits', 'number'),
  ('site_name',               '"Phmurt Studios"', 'Site Name',    'Display name used in headers and emails.', 'general', 'string'),
  ('signup_welcome_message',  '"Welcome to Phmurt Studios! Start by creating your first character."', 'Welcome Message', 'Message shown to new users after sign-up.', 'general', 'string'),
  ('error_reporting_enabled', 'true',  'Client Error Reporting',    'Collect client-side JavaScript errors.', 'general', 'boolean'),
  ('cleanup_errors_days',     '30',    'Error Log Retention (days)','Auto-delete error log entries older than this.', 'limits', 'number'),
  ('cleanup_visits_days',     '90',    'Visit Log Retention (days)','Auto-delete visit log entries older than this.', 'limits', 'number'),
  ('free_max_characters', '3',     'Free Tier: Max Characters',  'Maximum characters a free user can create. -1 for unlimited.', 'limits', 'number'),
  ('free_max_campaigns',  '1',     'Free Tier: Max Campaigns',   'Maximum campaigns a free user can own. -1 for unlimited.', 'limits', 'number'),
  ('paid_max_characters', '-1',    'Paid Tier: Max Characters',  'Maximum characters a subscribed user can create. -1 = unlimited.', 'limits', 'number'),
  ('paid_max_campaigns',  '-1',    'Paid Tier: Max Campaigns',   'Maximum campaigns a subscribed user can own. -1 = unlimited.', 'limits', 'number'),
  ('subscription_price_monthly', '"$5/month"',  'Pro Price (Monthly)',    'Display price for monthly plan.', 'general', 'string'),
  ('subscription_price_yearly',  '"$50/year"',  'Pro Price (Yearly)',     'Display price for yearly plan.', 'general', 'string'),
  ('stripe_enabled',             'false',       'Stripe Payments Enabled', 'Enable Stripe subscription payments.', 'features', 'boolean')
ON CONFLICT (key) DO NOTHING;

-- Remove old limit keys if they exist
DELETE FROM public.site_settings WHERE key = 'limit_max_characters';
DELETE FROM public.site_settings WHERE key = 'limit_max_campaigns';

-- ══════════════════════════════════════════════════════════════════
-- 7. STRIPE EVENTS
-- ══════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.stripe_events (
  id              bigserial PRIMARY KEY,
  stripe_event_id text UNIQUE NOT NULL,
  event_type      text NOT NULL,
  customer_id     text,
  subscription_id text,
  data            jsonb DEFAULT '{}',
  processed       boolean DEFAULT false,
  created_at      timestamptz DEFAULT now()
);
ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin read stripe" ON public.stripe_events;
CREATE POLICY "Admin read stripe" ON public.stripe_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true))
);

-- ══════════════════════════════════════════════════════════════════
-- 8. FUNCTIONS & TRIGGERS
-- ══════════════════════════════════════════════════════════════════

-- Protect subscription fields from self-upgrade
CREATE OR REPLACE FUNCTION public.protect_subscription_fields()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF current_setting('role', true) = 'service_role' THEN RETURN new; END IF;
  IF EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_superuser = true OR is_admin = true)
  ) THEN RETURN new; END IF;
  IF new.subscription_tier IS DISTINCT FROM old.subscription_tier
    OR new.subscription_status IS DISTINCT FROM old.subscription_status
    OR new.stripe_customer_id IS DISTINCT FROM old.stripe_customer_id
    OR new.subscription_started_at IS DISTINCT FROM old.subscription_started_at
    OR new.subscription_expires_at IS DISTINCT FROM old.subscription_expires_at
    OR new.subscription_cancel_at IS DISTINCT FROM old.subscription_cancel_at
    OR new.subscription_interval IS DISTINCT FROM old.subscription_interval
    OR new.is_admin IS DISTINCT FROM old.is_admin
    OR new.is_superuser IS DISTINCT FROM old.is_superuser
    OR new.is_banned IS DISTINCT FROM old.is_banned
  THEN
    RAISE EXCEPTION 'Permission denied: cannot modify protected fields' USING errcode = '42501';
  END IF;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS protect_subscription_fields_trigger ON public.profiles;
CREATE TRIGGER protect_subscription_fields_trigger
  BEFORE UPDATE ON public.profiles FOR EACH ROW
  EXECUTE FUNCTION public.protect_subscription_fields();

-- Character limit enforcement
CREATE OR REPLACE FUNCTION public.enforce_character_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  user_tier text; user_status text; user_expires timestamptz; max_count int; current_count int; is_user_admin boolean;
BEGIN
  SELECT subscription_tier, subscription_status, subscription_expires_at, (is_admin OR is_superuser)
  INTO user_tier, user_status, user_expires, is_user_admin FROM public.profiles WHERE id = new.owner_id;
  IF is_user_admin THEN RETURN new; END IF;
  IF user_tier = 'pro' AND user_status = 'active' AND (user_expires IS NULL OR user_expires > now()) THEN
    SELECT coalesce((value)::int, -1) INTO max_count FROM public.site_settings WHERE key = 'paid_max_characters';
  ELSE
    SELECT coalesce((value)::int, 3) INTO max_count FROM public.site_settings WHERE key = 'free_max_characters';
  END IF;
  IF max_count < 0 THEN RETURN new; END IF;
  SELECT count(*) INTO current_count FROM public.characters WHERE owner_id = new.owner_id;
  IF current_count >= max_count THEN
    RAISE EXCEPTION 'Character limit reached (% of %). Upgrade to Phmurt Studios Pro for unlimited characters.', current_count, max_count USING errcode = 'P0001';
  END IF;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS enforce_character_limit_trigger ON public.characters;
CREATE TRIGGER enforce_character_limit_trigger BEFORE INSERT ON public.characters FOR EACH ROW EXECUTE FUNCTION public.enforce_character_limit();

-- Campaign limit enforcement
CREATE OR REPLACE FUNCTION public.enforce_campaign_limit()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  user_tier text; user_status text; user_expires timestamptz; max_count int; current_count int; is_user_admin boolean;
BEGIN
  SELECT subscription_tier, subscription_status, subscription_expires_at, (is_admin OR is_superuser)
  INTO user_tier, user_status, user_expires, is_user_admin FROM public.profiles WHERE id = new.owner_id;
  IF is_user_admin THEN RETURN new; END IF;
  IF user_tier = 'pro' AND user_status = 'active' AND (user_expires IS NULL OR user_expires > now()) THEN
    SELECT coalesce((value)::int, -1) INTO max_count FROM public.site_settings WHERE key = 'paid_max_campaigns';
  ELSE
    SELECT coalesce((value)::int, 1) INTO max_count FROM public.site_settings WHERE key = 'free_max_campaigns';
  END IF;
  IF max_count < 0 THEN RETURN new; END IF;
  SELECT count(*) INTO current_count FROM public.campaigns WHERE owner_id = new.owner_id;
  IF current_count >= max_count THEN
    RAISE EXCEPTION 'Campaign limit reached (% of %). Upgrade to Phmurt Studios Pro for unlimited campaigns.', current_count, max_count USING errcode = 'P0001';
  END IF;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS enforce_campaign_limit_trigger ON public.campaigns;
CREATE TRIGGER enforce_campaign_limit_trigger BEFORE INSERT ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.enforce_campaign_limit();

-- Subscription status check
CREATE OR REPLACE FUNCTION public.get_subscription_status(user_id uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE profile_row record;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() != user_id THEN
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true)) THEN
      RAISE EXCEPTION 'Permission denied' USING errcode = '42501';
    END IF;
  END IF;
  SELECT subscription_tier, subscription_status, subscription_expires_at, subscription_cancel_at
  INTO profile_row FROM public.profiles WHERE id = user_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('tier', 'free', 'active', false); END IF;
  IF profile_row.subscription_tier = 'pro' AND profile_row.subscription_status = 'active'
    AND (profile_row.subscription_expires_at IS NULL OR profile_row.subscription_expires_at > now())
  THEN
    RETURN jsonb_build_object('tier', 'pro', 'active', true, 'expires_at', profile_row.subscription_expires_at, 'cancel_at', profile_row.subscription_cancel_at);
  ELSE
    IF profile_row.subscription_tier = 'pro' AND profile_row.subscription_expires_at IS NOT NULL AND profile_row.subscription_expires_at <= now() THEN
      UPDATE public.profiles SET subscription_tier = 'free', subscription_status = 'expired' WHERE id = user_id;
    END IF;
    RETURN jsonb_build_object('tier', 'free', 'active', false);
  END IF;
END;
$$;

-- Stripe webhook handler
CREATE OR REPLACE FUNCTION public.handle_stripe_subscription(
  p_stripe_customer_id text, p_status text, p_tier text DEFAULT 'pro', p_expires_at timestamptz DEFAULT null, p_cancel_at timestamptz DEFAULT null
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF p_tier NOT IN ('free', 'pro') THEN RAISE EXCEPTION 'Invalid tier value' USING errcode = '22023'; END IF;
  IF p_status NOT IN ('active', 'past_due', 'canceled', 'unpaid', 'expired', 'trialing') THEN RAISE EXCEPTION 'Invalid status value' USING errcode = '22023'; END IF;
  IF p_stripe_customer_id IS NULL OR length(p_stripe_customer_id) < 5 THEN RAISE EXCEPTION 'Invalid customer ID' USING errcode = '22023'; END IF;
  UPDATE public.profiles SET
    subscription_tier = p_tier, subscription_status = p_status,
    subscription_expires_at = p_expires_at, subscription_cancel_at = p_cancel_at,
    subscription_started_at = CASE WHEN p_status = 'active' AND subscription_started_at IS NULL THEN now() ELSE subscription_started_at END
  WHERE stripe_customer_id = p_stripe_customer_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_stripe_subscription FROM public;
REVOKE EXECUTE ON FUNCTION public.handle_stripe_subscription FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_stripe_subscription FROM anon;
REVOKE EXECUTE ON FUNCTION public.enforce_character_limit FROM public;
REVOKE EXECUTE ON FUNCTION public.enforce_character_limit FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_character_limit FROM anon;
REVOKE EXECUTE ON FUNCTION public.enforce_campaign_limit FROM public;
REVOKE EXECUTE ON FUNCTION public.enforce_campaign_limit FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_campaign_limit FROM anon;

-- Cleanup function
CREATE OR REPLACE FUNCTION public.run_admin_cleanup()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE err_days int; vis_days int; err_deleted int; vis_deleted int; audit_deleted int;
BEGIN
  SELECT coalesce((value)::int, 30) INTO err_days FROM public.site_settings WHERE key = 'cleanup_errors_days';
  SELECT coalesce((value)::int, 90) INTO vis_days FROM public.site_settings WHERE key = 'cleanup_visits_days';
  IF err_days IS NULL THEN err_days := 30; END IF;
  IF vis_days IS NULL THEN vis_days := 90; END IF;
  DELETE FROM public.site_errors WHERE created_at < now() - (err_days || ' days')::interval;
  GET DIAGNOSTICS err_deleted = ROW_COUNT;
  DELETE FROM public.site_visits WHERE visited_at < now() - (vis_days || ' days')::interval;
  GET DIAGNOSTICS vis_deleted = ROW_COUNT;
  DELETE FROM public.admin_audit_log WHERE created_at < now() - interval '365 days';
  GET DIAGNOSTICS audit_deleted = ROW_COUNT;
  UPDATE public.site_announcements SET is_active = false, updated_at = now()
  WHERE is_active = true AND expires_at IS NOT NULL AND expires_at < now();
  RETURN jsonb_build_object('errors_deleted', err_deleted, 'visits_deleted', vis_deleted, 'audit_deleted', audit_deleted, 'ran_at', now());
END;
$$;

-- Admin delete policies for cleanup
DROP POLICY IF EXISTS "Admin delete errors" ON public.site_errors;
CREATE POLICY "Admin delete errors" ON public.site_errors FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true))
);
DROP POLICY IF EXISTS "Admin delete visits" ON public.site_visits;
CREATE POLICY "Admin delete visits" ON public.site_visits FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (is_admin = true OR is_superuser = true))
);

-- ═══════════════════════════════════════════════════════════════════
-- DONE! All tables, columns, policies, functions, and triggers are set.
-- ═══════════════════════════════════════════════════════════════════
