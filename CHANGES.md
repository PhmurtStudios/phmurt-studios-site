# Files to Push to GitHub

## Last Updated: April 16, 2026

### Legacy-only account migration (April 16, 2026 — late evening)

- **phmurt-auth.js** *(updated)* — Fixes a pre-existing user-trap where any account with a `phmurt_auth_session` localStorage entry but no Supabase Auth JWT (and no refresh token) would hit a password prompt only at checkout, even though every other server call was silently failing too. Now detected and resolved proactively on every page load.
  - Added `_showLegacyMigrationPrompt(sb)` — standalone migration modal (mirrors the checkout reauth prompt's UX but does NOT invoke checkout on success). Includes password sign-in, auto-signup-if-no-account fallback, password reset link when wrong password is detected, and "Email me a sign-in link" magic-link fallback.
  - Added `_maybeShowLegacyMigrationPrompt(sb)` — called once per tab from `_runSupabaseInit` (both success and catch branches). Guards: skips `reset-password.html`, skips when URL hash contains `access_token=` / `error=` / `type=recovery` / `type=magiclink`, uses `sessionStorage['phmurt-legacy-migration-shown']` so dismissal doesn't re-trigger within the tab. Calls `sb.auth.refreshSession()` first — only prompts if that also can't recover a JWT.
  - Extended `onAuthStateChange` SIGNED_IN branch to wipe legacy data once a real Supabase session is established: `localStorage.removeItem('phmurt_users_db')` + clear cookies `phmurt_udb` and `phmurt_sess`. Idempotent — no-op after the first successful sign-in. `phmurt_auth_session` (LS_SESSION) is intentionally preserved because it now holds the Supabase-derived session for cross-tab sync.
  - Net effect: new users can't regress to legacy-only state, and any currently-stuck users are offered a one-time migration prompt the next time they load any page.

### Retention & Billing Batch 4 (April 16, 2026 — late evening)

- **Migration `retention_emails_and_grace`** *(applied)* — Four retention primitives, all SECURITY DEFINER with `SET search_path = public, pg_temp`, admin-gated RPCs raising `42501`, and tightened grants (`REVOKE FROM PUBLIC, anon` + `GRANT TO authenticated, service_role`):
  - `public.emails_sent` table — audit log for every transactional send (id, user_id, email_type, to_email, subject, provider, provider_msg_id, status, error, context jsonb, sent_at) with 3 indexes and admin-only SELECT RLS.
  - `public.email_in_window(p_user_id, p_to_email, p_email_type, p_window_s)` — boolean helper used by the email sender to enforce per-type cooldowns.
  - `public.is_pro_with_grace(p_user_id)` / `public.my_is_pro_with_grace()` — authoritative pro-check with a 3-day grace window for `past_due`/`unpaid`; `banned` always false, `lifetime` always true, `active`/`trialing` pass-through until expiry, then grace.
  - `public.admin_get_retention_stats(p_days_back)` — active/past-due/canceled/lifetime counts, signups, new_paid, churned, in_grace, and emails sent/failed totals over the window.
- **supabase/functions/send-transactional-email/index.ts** *(new, deployed v1)* — Resend-backed transactional email sender with five templates (welcome, payment_failed, subscription_canceled, receipt_confirmation, win_back) sharing a Cinzel-font layout() + button() helper with the Phmurt cream/brown palette. Auth supports BOTH shared-token Bearer (used by internal callers) and user JWT (restricted to `welcome` and only to the caller's own email). Per-user cooldowns enforced via `email_in_window` RPC (welcome: 365d, payment_failed: 24h, subscription_canceled: 7d, receipt_confirmation: 1h, win_back: 60d); fails CLOSED. Every attempt recorded to `emails_sent` with status `sent`/`failed`/`skipped`. `DEV_MODE=1` or missing `RESEND_API_KEY` short-circuits to audit-only so the wiring can be deployed before Resend is provisioned.
- **supabase/functions/stripe-webhook/index.ts** *(deployed v16)* — Added transactional email triggers on three events, all best-effort (try/catch swallows failures; webhooks never fail because an email didn't go out):
  - `checkout.session.completed` → `receipt_confirmation` (supports both lifetime and subscription paths, with plan_label, amount_formatted, manage_url).
  - `invoice.payment_failed` → `payment_failed` (24h cooldown prevents dunning spam on Stripe's retry cadence; includes hosted_invoice_url).
  - `customer.subscription.deleted` → `subscription_canceled` (skipped for lifetime holders; 7-day cooldown).
  - New env: `EMAIL_SHARED_TOKEN`, `PUBLIC_SITE_URL` (default `https://phmurtstudios.com`).
  - Grace window note: the `past_due` status it writes is now paired with `is_pro_with_grace()` server-side, so access persists for 3 days rather than cutting off immediately.
- **supabase/functions/stripe-checkout/index.ts** *(deployed v21)* — Promo and referral support:
  - Optional body field `promo_code` matching `^promo_[A-Za-z0-9]{1,64}$` → attached as `discounts[0][promotion_code]` and recorded in `metadata[promo_code]`.
  - Otherwise `allow_promotion_codes=true` so users can enter a code in Stripe's hosted checkout UI (the two params are mutually exclusive at Stripe).
  - Optional body field `referral_code` (2–32 chars, `[A-Za-z0-9_-]`) → attribution-only `metadata[referral_code]` (does not affect price).
- **supabase/functions/win-back-emails/index.ts** *(new, deployed v1)* — Scheduled edge function. Shared-token Bearer auth with constant-time compare (fails CLOSED if `WINBACK_SHARED_TOKEN`/`EMAIL_SHARED_TOKEN` unset). Selects up to 50 profiles where `subscription_status='canceled' AND subscription_tier='free' AND is_banned=false AND email IS NOT NULL AND subscription_expires_at BETWEEN now()-365d AND now()-30d`, then calls `send-transactional-email` per user with `win_back`. Downstream 60-day cooldown dedupes across weekly runs. Supports `?dry_run=1` or `{"dry_run": true}` for counting candidates without sending. Returns `{considered, sent, skipped, failed, dry_run}`.
- **phmurt-auth.js** — Client-side pro-check now mirrors the server's 3-day grace window: when `subscription_status` is `past_due` or `unpaid`, `isSubscribed` stays true for 3 days from `subscription_expires_at` (or from now if none is set). New session field `isInGrace` exposed for UI banners. Lifetime tier is never considered in-grace. Also wires a best-effort welcome-email call (`_fireWelcomeEmail`) after successful sign-up via the user's JWT; fires fire-and-forget with a 5s abort timeout and never blocks the sign-up flow. Server enforces a 1-year cooldown so reloads/retries are no-ops.

### Compliance & Ops Batch 3 (April 16, 2026 — evening)

- **supabase/functions/export-user-data/index.ts** *(new, deployed v1)* — GDPR/CCPA data-portability endpoint. JWT-gated; DB-backed sliding-window rate limit (3/hour/user, fails CLOSED); collects profile (admin_notes scrubbed), characters, campaigns, campaign memberships/invites, battle_map_snapshots, encounter_templates, homebrew_content, user_collections, lifetime_waitlist, site_events/visits/errors in parallel via `Promise.all`; returns signed-in caller's data only; responds as JSON attachment with `Content-Disposition: attachment; filename="phmurt-export-<uid-prefix>-<date>.json"`; origin whitelist + CORS.
- **supabase/functions/delete-user-account/index.ts** *(new, deployed v1)* — GDPR right-to-erasure endpoint. JWT-gated; requires body `confirm_phrase: "DELETE MY ACCOUNT"` exact match; DB-backed rate limit (2/hour/user, fails CLOSED); refuses self-delete for superusers; cancels active Stripe subscriptions first (best-effort); deletes campaign children before parents; anonymizes analytical rows (`site_events`/`site_visits`/`site_errors` `user_id → NULL`); deletes `profiles` row; calls `supabase.auth.admin.deleteUser(userId)`; writes audit row `action='self_account_deletion'` with `admin_id=null`. Partial-failure branch returns 500 with support hint if auth.users delete fails after data removal.
- **supabase/functions/daily-digest/index.ts** *(new, deployed v1)* — Yesterday-UTC summary of new signups, new active subs, churned subs, site visits, pricing views, gate-modal/CTA, checkout-started, lifetime-waitlist joins, and client errors. Shared-secret `Bearer` auth with constant-time compare (`safeEqual`). Optional Resend email delivery when `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `DIGEST_TO_EMAIL` are set; otherwise returns the digest JSON for manual retrieval. Call on/after 01:30 UTC so "yesterday" is fully closed.
- **Migration `admin_analytics_rpcs`** *(applied)* — Four SECURITY DEFINER RPCs with `SET search_path = public, pg_temp`, gated on `profiles.is_admin = true` (raises `42501` otherwise), permissions tightened via `REVOKE ... FROM PUBLIC, anon` + `GRANT ... TO authenticated, service_role`:
  - `admin_get_funnel_stats(p_days_back int)` — pricing-viewed / gate-shown / gate-CTA / checkout-started / lifetime-waitlist-joined / new signups / new active subs / churned subs over the window.
  - `admin_get_daily_signups(p_days_back int)` — per-day counts with `generate_series` zero-fill.
  - `admin_get_top_events(p_days_back int, p_limit int)` — top event names by count.
  - `admin_get_recent_errors(p_days_back int, p_limit int)` — recent client errors, deduped on `LEFT(message, 240)`.
- **admin-analytics.html** *(new, noindex)* — Admin dashboard with 7/28/90/180-day range selector. Boots by polling for `window.phmurtSupabase`, calls `admin_get_funnel_stats`; if the RPC errors with code `42501` or `"admin only"`, shows a gate notice instead of rendering. Renders funnel cards (with conversion %), bar chart for daily signups (CSS-only), top-events table, and recent-errors table. All values HTML-escaped.
- **account-privacy.html** *(new, noindex)* — User-facing self-service page. "Export my data" button → `POST /functions/v1/export-user-data` (Bearer JWT), streams the JSON bundle to the user as a browser download with the server-supplied `Content-Disposition` filename. "Permanently delete my account" flow requires typing `DELETE MY ACCOUNT` exactly (button stays disabled until the phrase matches), followed by a `window.confirm` double-check, then `POST /functions/v1/delete-user-account` with `{confirm_phrase}`. On success the local session is signed out and the user is redirected to `index.html?deleted=1`. Auth gate shows a sign-in prompt for signed-out visitors.
- **cookies.html** *(new)* — Cookie policy tailored to Phmurt Studios: documents `phmurt_sb_auth`, `phmurt_sess`, `phmurt_theme`, and the `phmurt-sid` `sessionStorage` key; explains first-party analytics approach (no third-party tracking/ads), lists Stripe / Google Fonts / jsDelivr third-party cookie surface, how to control cookies, and DNT position.
- **privacy.html** *(updated)* — Section 7.6 now points users to `account-privacy.html` for immediate self-service export/delete, with a bullet summary of what each action does.
- **sitemap.xml** *(updated)* — Added `cookies.html`; bumped `privacy.html`/`terms.html` `lastmod` to 2026-04-16. `admin-analytics.html` and `account-privacy.html` intentionally excluded (both `noindex`).
- **.well-known/security.txt** *(new)* — RFC 9116 compliant: `Contact: mailto:security@phmurtstudios.com`, `Expires: 2027-04-16T00:00:00.000Z`, `Preferred-Languages: en`, `Canonical: https://phmurtstudios.com/.well-known/security.txt`, plus a short scope/disclosure-etiquette preamble.
- **Frontend error telemetry** — Confirmed already wired in `phmurt-auth.js` (global `window.error` + `unhandledrejection` handlers, capped at 5 reports/session, inserts to `site_errors` with message/stack/page/user_agent/user_id); no code change needed this batch.
- **Fail-mode policy review** — Rate-limit fail mode explicitly re-stated per endpoint: `export-user-data` fails CLOSED (not time-critical); `delete-user-account` fails CLOSED (sensitive & irreversible); `stripe-checkout` fails OPEN (revenue-critical, as before).

### Growth & Hardening Batch 2 (April 16, 2026 — afternoon)

- **stripe-checkout edge function** *(deployed v20)* — Layered DB-backed sliding-window rate limit on top of the existing 10-second in-memory cooldown. `checkDbRateLimit(userId, 'start-checkout', 5, 3600)` via `rl_check_and_record` RPC (5 checkout starts per hour per user, fails OPEN on RPC errors so a DB blip doesn't block paying customers). Survives cold starts and cross-instance.
- **phmurt-auth.js** — A11y pass on `PhmurtGate()`: `role="dialog"`, `aria-modal`, `aria-labelledby`/`aria-describedby`, focus moved inside on open, Tab/Shift-Tab focus trap, Esc-to-close, focus restored to previously-focused element on close, explicit `type="button"` on all buttons, `aria-label` on close + CTA buttons, decorative icon marked `aria-hidden`. Sub-status banner now uses `role="alert"` + `aria-live="assertive"` for error states (past_due/unpaid) and `role="status"` + `aria-live="polite"` for the cancel-at-period-end warning. New `PhmurtDB.logEvent(name, props)` analytics helper (no-op fallback, scalar-only props, session-correlated). Emits `gate-modal-shown`, `gate-modal-cta-click`, `checkout-started`.
- **pricing.html** — Emits `pricing-page-viewed` with `from` attribution (url-param / internal / direct). **Lifetime waitlist capture UI**: when `lifetime-counter` hits zero, the disabled "Sold Out" button is replaced in-place with an email-capture form backed by `lifetime_waitlist_join` RPC; disabled emails/inputs after success; success/error toasts. JSON-LD `<script type="application/ld+json">` `Product` with 3 `Offer`s (Monthly $5, Yearly $50, Lifetime $50 LimitedAvailability maxValue 200) for SEO rich results.
- **getting-started.html** — JSON-LD `SoftwareApplication` block with free offer, category `GameApplication`, operating system "Any (web-based)".
- **sitemap.xml** — Added `pricing.html` (priority 0.9) and `getting-started.html` (priority 0.9); now 23 URLs.
- **archive/sql/migration-v6-rate-limit-events.sql** *(applied earlier this batch as `edge_function_rate_limits`)* — `public.rate_limit_events` table + `public.rl_check_and_record(p_user_id, p_ip_hash, p_bucket, p_max, p_window_s)` SECURITY DEFINER RPC for sliding-window limits with opportunistic pruning of rows >1h old.
- **archive/sql/migration-v7-site-events.sql** *(new)* — `public.site_events` funnel-analytics table (`event_name`, `event_props` jsonb, session_id, page, referrer); INSERT-only RLS for authenticated/anon (with `user_id IS NULL OR user_id = auth.uid()` constraint); admin-only SELECT via RLS.
- **archive/sql/migration-v8-lifetime-waitlist.sql** *(new)* — `public.lifetime_waitlist` table + `lifetime_waitlist_join(p_email)` SECURITY DEFINER RPC. Rejects sign-ups while slots remain (< 200 sold), absorbs duplicates via `ON CONFLICT DO NOTHING` so callers cannot probe whether an email is already on the list.
- **admin-dashboard.jsx** — Subscription anomaly panel fed by `subscription_health` view (paid_tier_not_active, banned_with_paid_tier, expiring_soon heuristics) with "Diagnose →" deep-links to `/debug-subscription.html?uid=<user_id>`.
- **character-builder.html** — Boot-time canary that reports `builder-5e` missing / hidden / zero-height anomalies to `site_errors` 500ms after DOMContentLoaded (best-effort, never throws).

### Subscription Hardening Batch (April 16, 2026)

- **phmurt-auth.js** — `isPro()` convenience; `subscriptionStatus` + `subscriptionCancelAt` on session; preflight `_fetchProfile` inside `_checkLimit` so stale sessions don't block paid users; post-checkout polling bumped to 10 attempts with 6s cap; `_renderSubStatusBanner()` for past_due / unpaid / canceling states (auto-opens billing portal); hardcoded free-tier default fixed `Art Gallery` → `Character Gallery`.
- **campaigns.html** — Hard-gate pro tab clicks (replaces the `!PhmurtGate(...)` no-op that always let users through); `handleConfirmCreate` split so `checkCampaignLimit()` preflight runs before insert to match character flow.
- **pricing.html** — Reads Pro monthly/yearly prices + savings label from `PhmurtDB.getTierConfig()` with `$5` / `$50` / `Save $10` fallbacks; re-renders on `phmurt-auth-change`; dynamic billing-save badge.
- **getting-started.html** — `gs-pro-hint` card hides for subscribers / admins / superusers via `phmurt-auth-change` listener.
- **style.css** — Tightened broad `html.light-mode [style*="rgba(...)"]` selectors by also requiring `[style*="background"]` so inline gradients/borders are no longer clobbered (fixes character-builder blank-page regression in light mode).
- **debug-subscription.html** *(new)* — Noindex diagnostic page with Client Session / Database Profile / Derived State panels, force-refresh, manage-subscription, and copy-support-bundle actions.
- **archive/sql/migration-v5-subscription-hardening.sql** *(new)* — Idempotent migration widening `chk_subscription_tier` to allow `party` and `lifetime`, adding `chk_subscription_status` constraint, re-asserting `enforce_character_limit` / `enforce_campaign_limit` triggers with banned + tier-status-expiry checks, corrective UPDATEs for v4 drift (`Art Gallery` → `Character Gallery`, `$4.99/mo` → `$5/mo`, `$49.99/yr` → `$50/yr`), and a `subscription_health` view for diagnostics.

### Changed Files

1. **creator.css** — Global input styling fix (white text boxes with !important), preview layout improvements, trait row base styles, **monster picker overhaul**: replaced card grid with horizontal row layout, filter pills (Type/Size/Source), expandable traditional D&D stat blocks, SVG search icon
2. **creator-util.js** — Added `getAuthorName()` helper for username injection
3. **creator-spell.js** — Injects `_authorName`, fixed unescaped `damageType` XSS
4. **creator-monster.js** — Null check on `s.speed`, bounds checking on splice, `_authorName` injection
5. **creator-class.js** — Fixed `global.showRestToast` → `U.showToast`, `_authorName` injection
6. **creator-race.js** — Bounds checking on splice, stripped inline trait-row styles, `_authorName` injection
7. **creator-subclass.js** — Null guards on array access, `.trim()` null safety, `_authorName` injection
8. **creator-feat.js** — Bounds checking on splice, `.trim()` null safety, `_authorName` injection
9. **creator-encounter.js** — Bounds checking on splice, `.trim()` null safety, `_authorName` injection, **complete SRD 5e monster database (~334 creatures with full stat blocks)**: ability scores, traits, actions, legendary actions for every monster. **Monster picker overhaul**: horizontal row layout with CR color stripe, Type/Size/Source filter pills, expand arrow reveals traditional D&D stat block (AC, HP, Speed, ability scores with modifiers, saves, skills, senses, languages, CR/XP, traits, actions, legendary actions), SVG search icon, Sort by Name/CR↑/CR↓/XP, homebrew monsters merged into picker
10. **creator-background.js** — Four `.trim()` null safety fixes, `_authorName` injection
11. **creator-item.js** — `.trim()` null safety, `_authorName` injection
12. **compendium.html** — Collection system, campaign add, clickable tags, card redesign, XSS fixes (escaped speed, hitDie, sub variable, upgraded cmpEsc to escape quotes), collected items in My Homebrew with creator attribution + "Make a Copy" / "Remove" buttons, `.cmp-card-collected` styling, cache invalidation on collect
13. **campaign-homebrew-view.js** — Community homebrew tab in campaign manager
14. **phmurt-auth.js** — Added `set_app_user` RPC call in `_fireChange()` for RLS user identification

15. **character-builder.html** — "Create Homebrew" buttons moved from standalone full-width buttons at the bottom of each step to inline dashed-border cards in the selection grid alongside standard options (Race, Class, Background steps)

### Style Consistency Fixes

16. **pricing.html** — Replaced rogue purple accent `#7c3aed` with `var(--crimson, #d4433a)`, fixed `--bg-card` fallback `#1e1e2e` → `#141420`, fixed pro card box-shadow to crimson glow
17. **campaigns.html** — Fixed loading shell `--bg` fallback `#0c0804` → `#08080a`, `--bg-nav` fallback `#100c08` → `#06060a`
18. **creator-util.js** *(updated)* — Fixed confirm dialog `--bg-card` fallback `#1e1914` → `#141420`, `--text` fallback `#e8dcc8` → `#f2e8d6`
19. **compendium.html** *(updated)* — Fixed view modal `--bg-card` fallback `#1e1914` → `#141420`, fixed 5 `--text` fallbacks `#e8dcc8` → `#f2e8d6`

### Navigation Reorganization

20. **phmurt-shell.js** *(updated)* — Flattened nav to all top-level links. Renamed: Grimoire → "Content", Compendium → "Homebrew Workshop". Added "Getting Started" nav link. Removed Character Sheets from nav. Removed dropdown groups entirely. New nav order: Home | Content | Homebrew Workshop | Characters | Campaigns | Generators | Getting Started | About. Updated all breadcrumbs and activeNavFor map (learn/gallery → Getting Started, soup-savant/legendary → Content).
21. **character-builder.html** *(updated)* — Homebrew create cards now open Homebrew Compendium tab (`showHomebrewManager()`) instead of inline entity modal
22. **getting-started.html** *(new)* — New hub page for new players. Three-step walkthrough (Learn Basics → Pick Character → Join Adventure), cards linking to Learn to Play and Character Gallery, interactive quick-start checklist with localStorage persistence, CTA banner linking to Characters page.

### Stale Reference Fixes (post-rename sweep)

23. **index.html** — "More in the Grimoire" → "More Content", "Player & DM Tools" → "Tools & Guides"
24. **learn.html** — "Explore the Grimoire →" → "Explore Content →"
25. **404.html** — "Browse the Grimoire" → "Browse Content"
26. **soup-savant.html** — Breadcrumb "Grimoire" → "Content"
27. **legendary.html** — Breadcrumb "Grimoire" → "Content"
28. **grimoire.html** — 2 "Compendium" link labels → "Homebrew Workshop"
29. **learn-dm.html** — "Compendium" tip card title → "Homebrew Workshop"
30. **campaigns.html** *(updated)* — Sidebar tool labels: "Compendium" → "Workshop", "Grimoire" → "Content"
31. **campaign-homebrew-view.js** *(updated)* — "Compendium" empty-state link → "Homebrew Workshop"
32. **creator-spell.js** *(updated)* — "Back to Compendium" button → "Back to Workshop"
33. **sw.js** *(updated)* — Added getting-started.html and char-sheet-export.js to service worker precache list

### Character Sheet PDF Export

34. **char-sheet-export.js** *(new)* — Traditional D&D character sheet PDF export. Opens a print-optimized window styled like a classic character sheet (parchment boxes, Cinzel headings, ability score blocks, saves, skills, equipment, spells, features, personality traits, backstory). Supports both 5e (`exportCharSheet5e()`) and 3.5e (`exportCharSheet35()`) with edition-appropriate fields (BAB for 3.5e, proficiency bonus for 5e).
35. **character-builder.html** *(updated)* — "Print / PDF" button replaced with "Export PDF" calling `exportCharSheet5e()`, script tag added for char-sheet-export.js
36. **character-builder-35.html** — "Print / PDF" button replaced with "Export PDF" calling `exportCharSheet35()`, script tag added for char-sheet-export.js

### Campaign Manager Mobile Fixes

38. **campaigns.html** *(updated)* — Mobile responsive CSS: hidden sidebar nav at 640px, map sidebar width override at 480px, 2-col stat grid, 1-col flyout, modal width caps, tighter action panel spacing

### Character Gallery Expansion

39. **gallery.html** *(updated)* — Added 24 new premade characters (12 Level 1, 12 Level 5) bringing total to 36 across all 12 classes at 3 levels. Race filter expanded with High Elf, Wood Elf, Dark Elf, Lightfoot Halfling, Stout Halfling, Rock Gnome, Forest Gnome.

### Shareable Character & Homebrew URLs

40. **shared.html** *(new)* — Public view page for shared characters and homebrew. Accepts `?type=character&id=UUID` or `?type=homebrew&t=type&id=UUID`. Renders read-only character sheets (ability scores, stats, saves, skills, features, equipment, spells, backstory) and homebrew content (type-specific detail views for races, classes, spells, monsters, items, etc.). Copy link button, edition badges, author attribution.
41. **phmurt-auth.js** *(updated)* — Added `shareCharacter(id)`, `unshareCharacter(id)`, `getShareUrl(type, id)` methods to PhmurtDB. Updated `getCharacters()` to include `is_public` column.
42. **characters.html** *(updated)* — Added Share button to character cards. Gold styling for unshared, green for shared. Click shared → copies link to clipboard. Click unshared → shares character + copies link. Subtle upgrade banner for free-tier users approaching 3-character limit.
43. **compendium.html** *(updated)* — Added "🔗 Link" copy button next to shared homebrew items in My Homebrew tab. Subtle upgrade nudge shown once after first share for free users.
44. **phmurt-shell.js** *(updated)* — Added `shared.html` and `learn-dm.html` to activeNavFor map.

### Subtle Upgrade Prompts

45. **characters.html** *(updated)* — Contextual upgrade hint appears below toolbar when free-tier user has 2+ characters (out of 3 free). Shows "View Plans" link to pricing.html.
46. **getting-started.html** *(updated)* — Pro upgrade hint shown to free-tier signed-in users after CTA banner. Hidden for subscribers/admins.
47. **compendium.html** *(updated)* — After first homebrew share, free-tier users see a one-time toast suggesting Pro upgrade.

### Shared Utilities Consolidation

48. **phmurt-utils.js** *(new)* — Site-wide shared utility module (`window.PU`). Consolidates duplicate functions from 18+ files: HTML escaping (`esc`, `escAttr`), ability score helpers (`abilityMod`, `fmtMod`, `modStr`), proficiency bonus (`profBonus`, `profBonusStr`), string utils (`capitalize`, `slugify`, `truncate`), DOM helpers (`selectHtml`), clipboard (`copyToClipboard`), dice rolling (`rollDie`, `rollDice`, `rollExpr`), number formatting (`fmtNum`, `ordinal`), toast wrapper.

### Learn to DM Polish

49. **getting-started.html** *(updated)* — Added "Learn to DM" as third card in the hub grid (3-column layout). Links to learn-dm.html with DM-focused description and "Become a DM →" CTA.
50. **learn-dm.html** *(updated)* — Fixed breadcrumb format (now `Home > Getting Started > Learn to DM` with proper links). Set `data-nav-active="Getting Started"` for correct nav highlighting. Added quiz score localStorage persistence: saves best score to `phmurt_dm_quiz_best`, displays previous best on revisit and after retake.

### Service Worker Update

51. **sw.js** *(updated)* — Cache version bumped to 186. Added `shared.html` and `phmurt-utils.js` to precache list.

### SQL Migration (apply via Supabase dashboard)

37. **archive/sql/migration-homebrew-rls.sql** — Proper RLS policies for homebrew_content, user_collections, campaign_homebrew tables + helper functions
52. **archive/sql/migration-character-sharing.sql** *(new)* — Adds `is_public` boolean column to characters table (default false), creates index for public lookups, adds RLS policy for anonymous read access to shared characters, ensures homebrew_content has matching public read policy.

### Character Builder Onboarding Wizard

53. **builder-wizard.js** *(new)* — Guided onboarding wizard for the Character Builder. Shows welcome overlay on first visit with 3 options: Guided Mode (step-by-step tips), Free Build (jump right in), or Quick Build (6 archetypes: Warrior, Spellcaster, Healer, Sneak, Ranger, Face). Quick Build auto-selects race, class, background, and abilities. Guide toggle button in sidebar. Step-specific tips update as you navigate. Responsive with 480px/375px mobile breakpoints for the overlay.
54. **character-builder.html** *(updated)* — Added `defer` to builder-data.js script tag for performance. Added builder-wizard.js script before phmurt-shell.js. Added 375px mobile breakpoint for compact layout on small screens.

### Initiative Tracker

55. **campaign-initiative.js** *(new)* — React initiative tracker component for the Campaign Manager. 15 D&D conditions with icons/colors. Add/remove combatants (player, enemy, ally, lair types). HP tracking with color-coded bars, AC, DEX mod. Condition toggle picker. Start/end combat, next/prev turn, round counter, roll all initiative, clear all. Active combatant highlighted. Death saves for players at 0 HP. Sorted by initiative (descending) with DEX tiebreaker.
56. **campaigns.html** *(updated)* — Added Initiative tab to campaign manager navigation. Lazy-loads campaign-initiative.js following existing module pattern.

### Encounter Generator Enhancement

57. **generators.html** *(updated)* — Enhanced random encounter generator with proper DMG XP budget calculations (XP thresholds per level, CR→XP lookup, encounter multiplier by monster count). Shows raw XP, adjusted XP, actual difficulty with color coding. Added "⚔️ Initiative Tracker" button that sends generated encounter to campaign manager. Added 480px and 375px mobile breakpoints for split-pane layout.

### Performance Audit

58. **character-builder-35.html** *(updated)* — Added `defer` to builder-data-35.js script tag to unblock HTML parsing.

### Automated Smoke Tests

59. **tests/playwright.config.js** *(new)* — Playwright config with Desktop Chrome + Mobile Safari projects, 30s timeout, 1 retry, 2 workers.
60. **tests/smoke.spec.js** *(new)* — Comprehensive smoke test suite: 13+ page load tests, character builder tests (race cards, wizard overlay), navigation link verification, gallery premade character count, Getting Started cards + interactive checklist, shared page error states, campaign manager auth gate, responsive layout tests (no horizontal overflow on mobile).

### Mobile Responsiveness Fixes

61. **style.css** *(updated)* — Added 375px global breakpoint (reduced padding, font sizes, 1-column grids, compact mobile menu). Fixed min-width overflow issues: dice popup uses `min(220px, 90vw)`, nav dropdown uses `min(200px, 85vw)`, grimoire search input uses `min-width:0`.
62. **shared.html** *(updated)* — Added 375px breakpoint: 2-column ability grid, 50% stat row wrapping, reduced section padding, compact header/button sizing.
63. **getting-started.html** *(updated)* — Added 375px breakpoint: tighter wrap padding, smaller hero title (1.3rem), compact step/card/checklist styling.
64. **learn-dm.html** *(updated)* — Added 375px breakpoint: reduced content padding (14px), smaller section titles and hero text, compact quiz option buttons.
65. **characters.html** *(updated)* — Added 375px breakpoint: tighter hub padding, compact cards, wrapping footer buttons, responsive filter bar.
66. **compendium.html** *(updated)* — Added 375px breakpoint: reduced layout padding, smaller type titles, compact form inputs and modal sizing.
67. **builder-wizard.js** *(updated)* — Injected responsive CSS for wizard overlay: 480px shows 2-column archetype grid, 375px shows single-column mode buttons and archetypes.

### Navigation Reorder

68. **phmurt-shell.js** *(updated)* — Moved "Getting Started" tab to sit between "Content" and "Homebrew Workshop" in both `nav` and `flatNav` arrays.

### Community Homebrew Attribution (SQL — already applied)

69. **archive/sql/migration-attribute-homebrew-to-loki.sql** *(new, already applied)* — Updated `_authorName` in the JSONB `data` column to "Loki" for all public `homebrew_content` rows. Community tab now displays "by Loki" for every shared entry.

### Localized Page Tours & Onboarding Overhaul

75a. **phmurt-shell.js** *(updated)* — Removed the generic first-visit homepage onboarding popup (4-step modal with emojis). Onboarding is now localized per-page via targeted tours instead.

75b. **builder-wizard.js** *(updated)* — Replaced all cartoony emojis with thematic Unicode symbols (swords, stars, crosses, etc.) throughout the Quick Build archetypes, Guided Mode UI, and step tips. Added persistent "Quick Build" button in the character builder sidebar (green accent) so the archetype picker is always accessible, not just on first visit.

75c. **learn-dm.html** *(updated)* — Replaced all cartoony emoji icons in the DM tutorial tip cards with thematic Unicode symbols.

75d. **phmurt-tour.js** *(new)* — Lightweight page tour engine. Highlights elements with a spotlight overlay and positioned tooltip. Supports Next/Back/End Tour navigation, step counter, auto-scroll to target, viewport clamping. Three tour definitions built in: `character-builder` (6 steps: sidebar nav, race selection, ability scores, summary, quick build, navigation), `character-sheet` (6 steps: ability scores, combat stats, saves, skills, features, interactive rolls), `campaign-manager` (6 steps: campaign list, dashboard, timeline, party, invites, world building). Tours auto-start on first visit (localStorage flag) and can be re-triggered via "Take Tour" buttons.

75e. **character-builder.html** *(updated)* — Added phmurt-tour.js script. Injects "Take Tour" button in sidebar. Auto-starts character builder tour on first visit (skipped if wizard overlay is showing). Injects "Tour Character Sheet" button when step 9 (character sheet) is reached; auto-starts sheet tour on first view.

75f. **campaigns.html** *(updated)* — Added phmurt-tour.js script. Added "Take Tour" button in sidebar below multiplayer section. Auto-starts campaign manager tour on first visit after a campaign is loaded.

75g. **phmurt-auth.js** *(updated)* — Fixed campaign cloud save failure: removed `name` field from `campRow` (column doesn't exist in the `campaigns` table schema, causing silent INSERT failures). Improved error propagation so cloud save failures surface to the UI instead of being swallowed.

75h. **sw.js** *(updated)* — Cache version bumped to 192. Added `phmurt-tour.js` to precache list.

### Navigation Tab Consistency Fix

74a. **compendium.html** *(updated)* — Fixed `data-nav-active` from `"Content"` to `"Homebrew Workshop"` so the correct tab highlights.
74b. **generators.html** *(updated)* — Added missing `data-nav-active="Generators"` attribute (only had `data-phmurt-feature`).
74c. **character-builder.html** *(updated)* — Fixed `data-nav-active` from `"Players"` to `"Characters"`.
74d. **character-builder-35.html** *(updated)* — Fixed `data-nav-active` from `"3.5e Builder"` to `"Characters"`.
74e. **character-sheets.html** *(updated)* — Fixed `data-nav-active` from `"Players"` to `"Characters"`.
74f. **sheet-dnd5e.html** *(updated)* — Fixed `data-nav-active` from `"Players"` to `"Characters"`.
74g. **my-characters.html** *(updated)* — Fixed `data-nav-active` from `"My Characters"` to `"Characters"`.
74h. **learn.html** *(updated)* — Fixed `data-nav-active` from `"Learn"` to `"Getting Started"`.
74i. **sw.js** *(updated)* — Cache version bumped to 192.

### Campaign Invite System Fix — Cloud Save & UUID Resolution

73a. **phmurt-auth.js** *(updated)* — Fixed critical bug where campaigns were never saved to Supabase (0 rows in DB). Root cause: `saveCampaign()` treated locally-generated `"camp-"` prefix IDs as existing campaigns and tried UPDATE (which silently failed on UUID column mismatch). Fix: detects `"camp-"` prefix IDs as local-only, strips the ID so Supabase generates a real UUID via `gen_random_uuid()`, then updates the campaign object with the real UUID. Also auto-enrolls the campaign owner as a DM member in `campaign_members` after successful INSERT.

73b. **campaigns.html** *(updated)* — After cloud save assigns real UUIDs to campaigns, React state is now updated everywhere: `campaigns` array, `activeCampaignId`, and `campaignRoles` all get the new UUID replacing the old local `"camp-"` ID. Added guard in `handleCreateInvite` that blocks invite code generation if the campaign still has a local ID (shows "please wait" message). Sets `campaignRoles` to "dm" immediately on campaign creation so DM UI controls are available before cloud sync completes.

73c. **Supabase migration** *(applied)* — Updated `campaign_members` SELECT RLS policy so campaign owners can see all members of their campaigns and players can see other members in the same campaign (was previously restricted to only seeing your own row).

73d. **sw.js** *(updated)* — Cache version bumped to 191.

### Campaign Multiplayer System — Full Implementation

72a. **phmurt-auth.js** *(updated)* — Added five new database functions for multiplayer campaign support: `updateMemberRole(campaignId, userId, role)` persists role changes to `campaign_members` table. `removeCampaignMember(campaignId, userId)` removes a player from a campaign (DM only, RLS enforced). `leaveCampaign(campaignId)` lets a player remove themselves. `subscribeToCampaign(campaignId, onUpdate)` creates a Supabase Realtime channel that listens for `campaigns` UPDATE events and `campaign_members` INSERT/UPDATE/DELETE events for live multiplayer sync. `unsubscribeFromCampaign(channel)` cleans up the subscription. Also updated `createInviteCode()` to return the full invite row (`id, code, use_count, max_uses, created_at`) instead of just the code string.

72b. **campaign-invites.js** *(updated)* — Fixed three broken/stubbed multiplayer features: (1) `updateMemberRole` now calls `PhmurtDB.updateMemberRole()` and persists to Supabase instead of only updating local state. (2) Kick/remove player now calls `PhmurtDB.removeCampaignMember()` and removes the member from local state, assignments, and roles — previously was `() => {}` (empty function). (3) Added Supabase Realtime subscription that re-fetches members on any `campaign_members` table change, so the members list updates live when players join/leave. Also added a character assignment picker modal — when DM clicks "Assign" on a member, a modal appears listing all party characters to pick from.

72c. **campaigns.html** *(updated)* — Added Supabase Realtime subscription in the main App component for player-role users: subscribes to campaign data changes so players see DM updates live (party changes, quest updates, etc.). Added "Leave Campaign" button in the sidebar for player-role users with confirmation dialog — removes the player from `campaign_members`, cleans up local state, and returns to campaign list. Updated `handleCreateInvite` to handle the new full-object return format from `createInviteCode()` with backward compatibility for string returns. Player tab access already correctly limited to: Dashboard, Timeline, World, Play, Quests, Relations, Initiative, Kingdom, Crafting, and Party (Invites).

72d. **sw.js** *(updated)* — Cache version bumped to 190.

### Site-Wide Improvements (6 Categories)

71a. **style.css** *(updated)* — Polish & trust signals: Added missing CSS for `.ps-cta-secondary`, `.ps-404-check`, `.ps-404-cta-group` (used in 404 page). Added consistent hover/transition states for all interactive cards (`.ps-feature`, `.ps-about-block`, `.ps-legendary-card`, `.ps-char-card`, `.ps-new-char-card`). Added button micro-interactions (active scale, focus ring consistency). Mobile touch target improvements: minimum 44px tap targets for filter buttons, CTAs, nav actions, tabs, HP buttons, and character card buttons.

71b. **All HTML pages** *(updated)* — SEO & discoverability: Added canonical URLs to all 15+ pages. Added JSON-LD structured data (WebSite schema on index, CollectionPage on grimoire/gallery, WebApplication on generators/character-builder, HowTo on learn). Fixed missing og:type/og:url on character-builder.html. Fixed missing twitter:title/twitter:description on campaigns.html and soup-savant.html.

71c. **gallery.html** *(updated)* — Character builder → gallery pipeline: Added "Community Characters" section below premade characters that loads user-shared public characters from the `characters` table via Supabase. Shows author name, ability scores, class/race, and "Add to Characters" button. Cards use same visual style as premade characters with "by [author]" attribution.

71d. **characters.html** *(updated)* — Renamed "Share" button to "Publish to Gallery" / "In Gallery" to make the connection between sharing and the gallery community section explicit. Updated all related toast messages and button states.

71e. **phmurt-shell.js** *(updated)* — Onboarding flow: Added guided first-visit walkthrough that appears on homepage for new, unauthenticated visitors. Four-step modal with progress dots: welcome intro, character gallery CTA, generators CTA, sign-up prompt. Dismisses on skip/backdrop click/close button. Sets `phmurt_onboarded` localStorage flag. Self-contained CSS injected at runtime. Mobile-responsive with 480px breakpoint.

71f. **All HTML pages** *(updated)* — Performance: Added `loading="lazy"` to below-fold images (about.html owlbear, 404.html owlbear). Added DNS prefetch hints for Supabase (`zrfmboqoyrqsyckktgpv.supabase.co`) and Stripe (`js.stripe.com`) across all major pages. Deferred `stripe-env.js` loading across all pages (previously sync, now deferred alongside stripe-config.js).

71g. **sw.js** *(updated)* — Cache version bumped to 189.

### Bug Fixes (Live Site Audit)

70a. **index.html** *(updated)* — Fixed stale homepage copy: "12 ready to play characters" → "40 ready-to-play characters across every class and level"
70b. **grimoire.html** *(updated)* — Fixed community homebrew section showing empty: changed query from non-existent `homebrew_compendium` table to `homebrew_content` with `is_public` filter, `likes_count` column, and JSONB data normalization (name/tags/author_name extraction). Fixed like-update query to match.
70c. **characters.html** *(updated)* — Fixed auth gate and signed-in state both displaying simultaneously: auth gate now starts `display:none` (same as ch-main) so JS controls which one appears based on session state, eliminating the race condition flash.

### Service Worker Update

70d. **sw.js** *(updated)* — Cache version bumped to 188.

### Character Gallery Redesign

70. **gallery.html** *(rewritten)* — Complete gallery redesign: compact card layout with left-side class accent stripe, 6-column ability score grid with modifiers, combat stat row (AC/HP/Speed) for detailed characters, class-colored icon circles. Full character sheet modal with traditional D&D layout (ability score boxes, saving throws with proficiency dots, skills list, attacks table, features, equipment tags, personality/backstory). "Add to My Characters" button saves premade character to user's Supabase characters table via `PhmurtDB.saveCharacter()`. Added 4 new characters from uploaded PDF sheets: Zarikar Thavios (Tiefling Sorcerer 9, Divine Soul), Za Hornyeth (Eladrin Rogue 6/Fighter 4, Arcane Trickster), Relmae Falstaer (Half-Elf Fighter 5, Champion), Amon Bellendon (Variant Human Wizard 7, Evocation). Extended character data schema supports AC, HP, speed, proficiency bonus, darkvision, resistances, saving throws, skills with bonuses, attacks with hit/damage, languages, background, and multiclass. 40 total premade characters. Updated race filter (added Eladrin, Variant Human) and level filter (added 7, 9, 10). Results counter shows "Showing X of Y characters". Search now matches name, class, and race. Removed community placeholder section. Responsive at 1200/768/480/375px breakpoints.
