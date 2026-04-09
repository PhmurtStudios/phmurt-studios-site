-- ═══════════════════════════════════════════════════════════════════
-- Phmurt Studios — Admin Tools Migration v2
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. AUDIT LOG ─────────────────────────────────────────────────
-- Tracks every admin action (ban, delete, flag, setting change, etc.)
create table if not exists public.admin_audit_log (
  id          bigserial primary key,
  admin_id    uuid references auth.users on delete set null,
  admin_email text,
  action      text not null,            -- e.g. 'ban_user', 'delete_character', 'toggle_flag'
  target_type text,                     -- e.g. 'user', 'character', 'campaign', 'setting'
  target_id   text,                     -- UUID or key of the affected record
  details     jsonb default '{}',       -- extra context (old_value, new_value, reason, etc.)
  created_at  timestamptz default now()
);
alter table public.admin_audit_log enable row level security;
create policy "Admin read audit" on public.admin_audit_log for select using (
  exists (select 1 from public.profiles where id = auth.uid() and (is_admin = true or is_superuser = true))
);
create policy "Admin insert audit" on public.admin_audit_log for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and (is_admin = true or is_superuser = true))
);
-- Index for fast lookups
create index if not exists idx_audit_log_created on public.admin_audit_log (created_at desc);
create index if not exists idx_audit_log_action on public.admin_audit_log (action);
create index if not exists idx_audit_log_target on public.admin_audit_log (target_type, target_id);

-- ── 2. SITE ANNOUNCEMENTS ────────────────────────────────────────
-- Banners displayed across the site (maintenance notices, feature launches, etc.)
create table if not exists public.site_announcements (
  id          bigserial primary key,
  title       text not null,
  message     text not null,
  type        text default 'info',      -- 'info', 'warning', 'success', 'danger'
  is_active   boolean default true,
  show_on     text[] default '{}',      -- empty = all pages; or specific paths like '/character-builder.html'
  starts_at   timestamptz default now(),
  expires_at  timestamptz,              -- null = no expiry
  dismissible boolean default true,     -- user can close the banner
  created_by  uuid references auth.users on delete set null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.site_announcements enable row level security;
-- Anyone can read active announcements (needed for the banner)
create policy "Public read active" on public.site_announcements for select using (
  is_active = true
  or exists (select 1 from public.profiles where id = auth.uid() and (is_admin = true or is_superuser = true))
);
create policy "Admin manage" on public.site_announcements for all using (
  exists (select 1 from public.profiles where id = auth.uid() and (is_admin = true or is_superuser = true))
);

-- ── 3. SITE SETTINGS (Feature Flags & Maintenance Mode) ─────────
-- Key-value store for site-wide configuration toggles
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb not null default 'false',
  label       text,                     -- human-readable label
  description text,                     -- what this flag does
  category    text default 'general',   -- 'general', 'features', 'maintenance', 'limits', 'beta'
  data_type   text default 'boolean',   -- 'boolean', 'string', 'number', 'json'
  updated_by  uuid references auth.users on delete set null,
  updated_at  timestamptz default now()
);
alter table public.site_settings enable row level security;
-- Public read so client-side JS can check flags
create policy "Public read settings" on public.site_settings for select using (true);
create policy "Admin manage settings" on public.site_settings for all using (
  exists (select 1 from public.profiles where id = auth.uid() and (is_admin = true or is_superuser = true))
);

-- ── Seed default feature flags & settings ────────────────────────
insert into public.site_settings (key, value, label, description, category, data_type) values
  -- Maintenance
  ('maintenance_mode',        'false',  'Maintenance Mode',         'Put the entire site into read-only maintenance mode. Users see a maintenance banner and cannot save data.', 'maintenance', 'boolean'),
  ('maintenance_message',     '"We''re performing scheduled maintenance. The site will be back shortly!"', 'Maintenance Message', 'Custom message shown during maintenance mode.', 'maintenance', 'string'),
  ('maintenance_allowed_ips', '[]',     'Maintenance Bypass IPs',   'JSON array of IP addresses that can bypass maintenance mode (for admin testing).', 'maintenance', 'json'),
  ('maintenance_eta',         'null',   'Maintenance ETA',          'Estimated time maintenance will end (ISO timestamp). Shown to users.', 'maintenance', 'string'),

  -- Feature Flags
  ('feature_character_builder',    'true',  'Character Builder',         'Enable/disable the character builder tool.', 'features', 'boolean'),
  ('feature_campaign_manager',     'true',  'Campaign Manager',          'Enable/disable campaign creation and management.', 'features', 'boolean'),
  ('feature_cloud_sync',           'true',  'Cloud Sync',                'Enable/disable cloud sync for characters and campaigns.', 'features', 'boolean'),
  ('feature_gallery',              'true',  'Community Gallery',         'Enable/disable the community gallery page.', 'features', 'boolean'),
  ('feature_compendium',           'true',  'Compendium',                'Enable/disable the compendium/reference pages.', 'features', 'boolean'),
  ('feature_generators',           'true',  'Generators',                'Enable/disable random generators (names, encounters, etc.).', 'features', 'boolean'),
  ('feature_soup_savant',          'true',  'Soup Savant',               'Enable/disable the Soup Savant mini-game.', 'features', 'boolean'),
  ('feature_new_signups',          'true',  'New User Registration',     'Allow new users to create accounts. Disable to freeze sign-ups.', 'features', 'boolean'),
  ('feature_password_reset',       'true',  'Password Reset',            'Allow users to reset their passwords via email.', 'features', 'boolean'),

  -- Beta Features
  ('beta_enabled',                 'false', 'Beta Features Global',      'Master toggle: when ON, users with the beta flag can access beta features.', 'beta', 'boolean'),
  ('beta_character_builder_35',    'false', '3.5e Character Builder',    'Beta: the 3.5 edition character builder (only visible to beta users when beta is enabled).', 'beta', 'boolean'),
  ('beta_advanced_dice',           'false', 'Advanced Dice Roller',      'Beta: advanced dice roller with custom macros.', 'beta', 'boolean'),
  ('beta_live_sessions',           'false', 'Live Session Tracker',      'Beta: real-time collaborative session tracking.', 'beta', 'boolean'),
  ('beta_ai_npc_generator',       'false', 'AI NPC Generator',          'Beta: AI-powered NPC personality and backstory generator.', 'beta', 'boolean'),

  -- Rate Limits & Guardrails
  ('limit_max_characters',    '50',   'Max Characters Per User',   'Maximum number of characters a single user can create.', 'limits', 'number'),
  ('limit_max_campaigns',     '10',   'Max Campaigns Per User',    'Maximum number of campaigns a single user can own.', 'limits', 'number'),
  ('limit_max_file_upload_mb', '5',   'Max File Upload Size (MB)', 'Maximum upload size for portraits and map images.', 'limits', 'number'),

  -- General
  ('site_name',               '"Phmurt Studios"', 'Site Name',    'Display name used in headers and emails.', 'general', 'string'),
  ('signup_welcome_message',  '"Welcome to Phmurt Studios! Start by creating your first character."', 'Welcome Message', 'Message shown to new users after sign-up.', 'general', 'string'),
  ('error_reporting_enabled', 'true',  'Client Error Reporting',    'Collect client-side JavaScript errors for the Error Log.', 'general', 'boolean'),
  ('cleanup_errors_days',     '30',    'Error Log Retention (days)','Automatically delete error log entries older than this many days.', 'limits', 'number'),
  ('cleanup_visits_days',     '90',    'Visit Log Retention (days)','Automatically delete visit log entries older than this many days.', 'limits', 'number')
on conflict (key) do nothing;

-- ── Add beta_user flag to profiles ───────────────────────────────
alter table public.profiles add column if not exists is_beta_user boolean default false;

-- ── 4. CLEANUP FUNCTION ──────────────────────────────────────────
-- Can be called from the admin panel or scheduled via pg_cron / Edge Function
create or replace function public.run_admin_cleanup()
returns jsonb language plpgsql security definer as $$
declare
  err_days int;
  vis_days int;
  err_deleted int;
  vis_deleted int;
  audit_deleted int;
begin
  -- Read retention settings
  select coalesce((value)::int, 30) into err_days from public.site_settings where key = 'cleanup_errors_days';
  select coalesce((value)::int, 90) into vis_days from public.site_settings where key = 'cleanup_visits_days';
  if err_days is null then err_days := 30; end if;
  if vis_days is null then vis_days := 90; end if;

  -- Delete old errors
  delete from public.site_errors where created_at < now() - (err_days || ' days')::interval;
  get diagnostics err_deleted = row_count;

  -- Delete old visits
  delete from public.site_visits where visited_at < now() - (vis_days || ' days')::interval;
  get diagnostics vis_deleted = row_count;

  -- Delete audit log entries older than 365 days
  delete from public.admin_audit_log where created_at < now() - interval '365 days';
  get diagnostics audit_deleted = row_count;

  -- Deactivate expired announcements
  update public.site_announcements set is_active = false, updated_at = now()
  where is_active = true and expires_at is not null and expires_at < now();

  return jsonb_build_object(
    'errors_deleted', err_deleted,
    'visits_deleted', vis_deleted,
    'audit_deleted', audit_deleted,
    'ran_at', now()
  );
end;
$$;

-- RLS policy so admins can call the cleanup function
-- (The function uses SECURITY DEFINER so it runs with full privileges,
--  but only admins can invoke it through the admin panel.)

-- ── 5. ADMIN POLICY FOR CLEANUP ──────────────────────────────────
-- Allow admins to delete old site_errors (needed for cleanup from client)
create policy "Admin delete errors" on public.site_errors for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and (is_admin = true or is_superuser = true))
);

-- Allow admins to delete old site_visits
create policy "Admin delete visits" on public.site_visits for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and (is_admin = true or is_superuser = true))
);

-- ═══════════════════════════════════════════════════════════════════
-- DONE! All tables, policies, and seed data are ready.
-- ═══════════════════════════════════════════════════════════════════
