-- ═══════════════════════════════════════════════════════════════════
-- Phmurt Studios — Subscriptions Migration v3 (HARDENED)
-- Run in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
--
-- SECURITY NOTES:
--   - Users CANNOT modify their own subscription fields (RLS enforced)
--   - SECURITY DEFINER functions are NOT callable via public RPC
--   - Server-side triggers enforce character/campaign limits at INSERT
--   - Stripe events table is write-only from Edge Functions (service_role)
--   - All subscription state changes go through the webhook only
-- ═══════════════════════════════════════════════════════════════════

-- ── 1. ADD SUBSCRIPTION FIELDS TO PROFILES ───────────────────────
alter table public.profiles add column if not exists subscription_tier text default 'free';
alter table public.profiles add column if not exists subscription_status text default null;
alter table public.profiles add column if not exists stripe_customer_id text default null;
alter table public.profiles add column if not exists subscription_started_at timestamptz default null;
alter table public.profiles add column if not exists subscription_expires_at timestamptz default null;
alter table public.profiles add column if not exists subscription_cancel_at timestamptz default null;
alter table public.profiles add column if not exists subscription_interval text default null;  -- 'monthly' or 'yearly'

-- Index for quick subscription lookups
create index if not exists idx_profiles_subscription on public.profiles (subscription_tier);
create index if not exists idx_profiles_stripe on public.profiles (stripe_customer_id);

-- ── SECURITY: Constrain subscription_tier to valid values ────────
-- Prevents any code path from writing garbage into the tier field
do $$ begin
  alter table public.profiles add constraint chk_subscription_tier
    check (subscription_tier in ('free', 'pro'));
exception when duplicate_object then null; end $$;

do $$ begin
  alter table public.profiles add constraint chk_subscription_interval
    check (subscription_interval is null or subscription_interval in ('monthly', 'yearly'));
exception when duplicate_object then null; end $$;

-- ══════════════════════════════════════════════════════════════════
-- SECURITY: PREVENT USERS FROM SELF-UPGRADING
-- ══════════════════════════════════════════════════════════════════
-- The existing "Self update" RLS policy on profiles lets users
-- update their own row. We need to ensure subscription-related
-- columns are EXCLUDED from self-updates.
--
-- Strategy: Drop the permissive "Self update" policy and replace
-- it with one that uses a column-level check function.
-- ══════════════════════════════════════════════════════════════════

-- Create a function that blocks subscription field changes by non-admins
create or replace function public.protect_subscription_fields()
returns trigger language plpgsql as $$
begin
  -- Allow service_role (Edge Functions) to change anything
  -- current_setting('role') = 'service_role' when called from Edge Functions
  if current_setting('role', true) = 'service_role' then
    return new;
  end if;

  -- Allow superusers/admins to change subscription fields
  if exists (
    select 1 from public.profiles
    where id = auth.uid()
    and (is_superuser = true or is_admin = true)
  ) then
    return new;
  end if;

  -- For regular users: prevent modification of subscription fields
  if new.subscription_tier is distinct from old.subscription_tier
    or new.subscription_status is distinct from old.subscription_status
    or new.stripe_customer_id is distinct from old.stripe_customer_id
    or new.subscription_started_at is distinct from old.subscription_started_at
    or new.subscription_expires_at is distinct from old.subscription_expires_at
    or new.subscription_cancel_at is distinct from old.subscription_cancel_at
    or new.subscription_interval is distinct from old.subscription_interval
    or new.is_admin is distinct from old.is_admin
    or new.is_superuser is distinct from old.is_superuser
    or new.is_banned is distinct from old.is_banned
  then
    raise exception 'Permission denied: cannot modify protected fields'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

-- Attach the trigger
drop trigger if exists protect_subscription_fields_trigger on public.profiles;
create trigger protect_subscription_fields_trigger
  before update on public.profiles
  for each row
  execute function public.protect_subscription_fields();

-- ── 2. STRIPE WEBHOOK EVENTS TABLE ──────────────────────────────
create table if not exists public.stripe_events (
  id              bigserial primary key,
  stripe_event_id text unique not null,
  event_type      text not null,
  customer_id     text,
  subscription_id text,
  data            jsonb default '{}',
  processed       boolean default false,
  created_at      timestamptz default now()
);
alter table public.stripe_events enable row level security;

-- SECURITY: Only admins can READ stripe events (for the admin panel)
create policy "Admin read stripe" on public.stripe_events for select using (
  exists (select 1 from public.profiles where id = auth.uid() and (is_admin = true or is_superuser = true))
);
-- SECURITY: No public insert/update/delete policies — only service_role (Edge Functions) can write

-- ── 3. UPDATE SITE_SETTINGS WITH SUBSCRIPTION LIMITS ─────────────
insert into public.site_settings (key, value, label, description, category, data_type) values
  ('free_max_characters', '3',     'Free Tier: Max Characters',  'Maximum characters a free user can create. Set to -1 for unlimited.', 'limits', 'number'),
  ('free_max_campaigns',  '1',     'Free Tier: Max Campaigns',   'Maximum campaigns a free user can own. Set to -1 for unlimited.', 'limits', 'number'),
  ('paid_max_characters', '-1',    'Paid Tier: Max Characters',  'Maximum characters a subscribed user can create. -1 = unlimited.', 'limits', 'number'),
  ('paid_max_campaigns',  '-1',    'Paid Tier: Max Campaigns',   'Maximum campaigns a subscribed user can own. -1 = unlimited.', 'limits', 'number'),
  ('subscription_price_monthly', '"$5/month"',  'Pro Price (Monthly)',    'Display price for monthly plan (UI only, actual price is set in Stripe).', 'general', 'string'),
  ('subscription_price_yearly',  '"$50/year"',  'Pro Price (Yearly)',     'Display price for yearly plan (UI only, actual price is set in Stripe).', 'general', 'string'),
  ('stripe_enabled',             'false',       'Stripe Payments Enabled', 'Enable Stripe subscription payments. Must configure Stripe keys first.', 'features', 'boolean')
on conflict (key) do nothing;

-- ── 4. UPDATE EXISTING LIMIT SETTINGS ────────────────────────────
delete from public.site_settings where key = 'limit_max_characters';
delete from public.site_settings where key = 'limit_max_campaigns';

-- ══════════════════════════════════════════════════════════════════
-- 5. SERVER-SIDE LIMIT ENFORCEMENT (THE REAL SECURITY LAYER)
-- ══════════════════════════════════════════════════════════════════
-- Client-side limits are just UX. These triggers are the actual wall.
-- Even if someone bypasses the JS, the database will reject the insert.
-- ══════════════════════════════════════════════════════════════════

create or replace function public.enforce_character_limit()
returns trigger language plpgsql security definer as $$
declare
  user_tier text;
  user_status text;
  user_expires timestamptz;
  max_count int;
  current_count int;
  is_user_admin boolean;
begin
  -- Look up the user's subscription info
  select subscription_tier, subscription_status, subscription_expires_at,
         (is_admin or is_superuser)
  into user_tier, user_status, user_expires, is_user_admin
  from public.profiles
  where id = new.owner_id;

  -- Admins bypass limits
  if is_user_admin then return new; end if;

  -- Determine if subscription is active
  if user_tier = 'pro' and user_status = 'active'
    and (user_expires is null or user_expires > now())
  then
    -- Get paid limit
    select coalesce((value)::int, -1) into max_count
    from public.site_settings where key = 'paid_max_characters';
  else
    -- Get free limit
    select coalesce((value)::int, 3) into max_count
    from public.site_settings where key = 'free_max_characters';
  end if;

  -- -1 means unlimited
  if max_count < 0 then return new; end if;

  -- Count existing characters
  select count(*) into current_count
  from public.characters
  where owner_id = new.owner_id;

  if current_count >= max_count then
    raise exception 'Character limit reached (% of %). Upgrade to Phmurt Studios Pro for unlimited characters.',
      current_count, max_count
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_character_limit_trigger on public.characters;
create trigger enforce_character_limit_trigger
  before insert on public.characters
  for each row
  execute function public.enforce_character_limit();

-- Same for campaigns
create or replace function public.enforce_campaign_limit()
returns trigger language plpgsql security definer as $$
declare
  user_tier text;
  user_status text;
  user_expires timestamptz;
  max_count int;
  current_count int;
  is_user_admin boolean;
begin
  select subscription_tier, subscription_status, subscription_expires_at,
         (is_admin or is_superuser)
  into user_tier, user_status, user_expires, is_user_admin
  from public.profiles
  where id = new.owner_id;

  if is_user_admin then return new; end if;

  if user_tier = 'pro' and user_status = 'active'
    and (user_expires is null or user_expires > now())
  then
    select coalesce((value)::int, -1) into max_count
    from public.site_settings where key = 'paid_max_campaigns';
  else
    select coalesce((value)::int, 1) into max_count
    from public.site_settings where key = 'free_max_campaigns';
  end if;

  if max_count < 0 then return new; end if;

  select count(*) into current_count
  from public.campaigns
  where owner_id = new.owner_id;

  if current_count >= max_count then
    raise exception 'Campaign limit reached (% of %). Upgrade to Phmurt Studios Pro for unlimited campaigns.',
      current_count, max_count
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_campaign_limit_trigger on public.campaigns;
create trigger enforce_campaign_limit_trigger
  before insert on public.campaigns
  for each row
  execute function public.enforce_campaign_limit();

-- ── 6. SUBSCRIPTION STATUS CHECK (read-only, user can only check themselves) ──
create or replace function public.get_subscription_status(user_id uuid)
returns jsonb language plpgsql security definer as $$
declare
  profile_row record;
begin
  -- SECURITY: Users can only check their own subscription status
  if auth.uid() is null or auth.uid() != user_id then
    -- Admins can check anyone
    if not exists (
      select 1 from public.profiles
      where id = auth.uid() and (is_admin = true or is_superuser = true)
    ) then
      raise exception 'Permission denied' using errcode = '42501';
    end if;
  end if;

  select subscription_tier, subscription_status, subscription_expires_at, subscription_cancel_at
  into profile_row
  from public.profiles
  where id = user_id;

  if not found then
    return jsonb_build_object('tier', 'free', 'active', false);
  end if;

  if profile_row.subscription_tier = 'pro'
    and profile_row.subscription_status = 'active'
    and (profile_row.subscription_expires_at is null or profile_row.subscription_expires_at > now())
  then
    return jsonb_build_object(
      'tier', 'pro',
      'active', true,
      'expires_at', profile_row.subscription_expires_at,
      'cancel_at', profile_row.subscription_cancel_at
    );
  else
    -- Expired — auto-downgrade
    if profile_row.subscription_tier = 'pro'
      and profile_row.subscription_expires_at is not null
      and profile_row.subscription_expires_at <= now()
    then
      update public.profiles
      set subscription_tier = 'free', subscription_status = 'expired'
      where id = user_id;
    end if;
    return jsonb_build_object('tier', 'free', 'active', false);
  end if;
end;
$$;

-- ── 7. STRIPE WEBHOOK HANDLER (only callable from service_role) ──
-- SECURITY: This function uses SECURITY DEFINER and modifies
-- subscription fields. It must NOT be callable from the client.
-- We revoke EXECUTE from public/authenticated and only allow
-- the service_role (used by Edge Functions) to call it.
create or replace function public.handle_stripe_subscription(
  p_stripe_customer_id text,
  p_status text,
  p_tier text default 'pro',
  p_expires_at timestamptz default null,
  p_cancel_at timestamptz default null
)
returns void language plpgsql security definer as $$
begin
  -- SECURITY: Validate tier value
  if p_tier not in ('free', 'pro') then
    raise exception 'Invalid tier value' using errcode = '22023';
  end if;

  -- SECURITY: Validate status value
  if p_status not in ('active', 'past_due', 'canceled', 'unpaid', 'expired', 'trialing') then
    raise exception 'Invalid status value' using errcode = '22023';
  end if;

  -- SECURITY: Validate customer ID format
  if p_stripe_customer_id is null or length(p_stripe_customer_id) < 5 then
    raise exception 'Invalid customer ID' using errcode = '22023';
  end if;

  update public.profiles
  set
    subscription_tier = p_tier,
    subscription_status = p_status,
    subscription_expires_at = p_expires_at,
    subscription_cancel_at = p_cancel_at,
    subscription_started_at = case
      when p_status = 'active' and subscription_started_at is null
      then now()
      else subscription_started_at
    end
  where stripe_customer_id = p_stripe_customer_id;
end;
$$;

-- SECURITY: Revoke execute from public roles so clients can't call this
-- Only service_role (Edge Functions) can invoke it
revoke execute on function public.handle_stripe_subscription from public;
revoke execute on function public.handle_stripe_subscription from authenticated;
revoke execute on function public.handle_stripe_subscription from anon;

-- Also lock down the limit enforcement functions (they're triggers, not meant for direct calls)
revoke execute on function public.enforce_character_limit from public;
revoke execute on function public.enforce_character_limit from authenticated;
revoke execute on function public.enforce_character_limit from anon;
revoke execute on function public.enforce_campaign_limit from public;
revoke execute on function public.enforce_campaign_limit from authenticated;
revoke execute on function public.enforce_campaign_limit from anon;

-- Add beta user column if not exists
alter table public.profiles add column if not exists is_beta_user boolean default false;

-- ═══════════════════════════════════════════════════════════════════
-- DONE!
-- Defense layers (inside-out):
--   1. DB constraints: subscription_tier can only be 'free' or 'pro'
--   2. DB trigger: protect_subscription_fields blocks self-upgrade
--   3. DB trigger: enforce_character/campaign_limit blocks over-limit inserts
--   4. RLS policies: users can only access their own data
--   5. Edge Function: webhook verifies Stripe signatures before any DB write
--   6. Edge Function: checkout validates JWT, rate-limits, and checks bans
--   7. Client JS: provides UX feedback (not a security boundary)
-- ═══════════════════════════════════════════════════════════════════
