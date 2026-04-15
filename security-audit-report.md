# phmurtstudios.com — Security Hardening Audit & Status

**Date:** 2026-04-15
**Scope:** Cloudflare edge security, HTTP response headers, Content Security Policy, Supabase RLS / storage / RPCs, code-side observations.

---

## 1. What is now live in production

### Batch 1 — HTTP security headers (Cloudflare Transform Rule, deployed)

Verified live via `curl -I https://phmurtstudios.com`.

| Header | Value |
|---|---|
| `Content-Security-Policy-Report-Only` | `default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://zrfmboqoyrqsyckktgpv.supabase.co; connect-src 'self' https://zrfmboqoyrqsyckktgpv.supabase.co wss://zrfmboqoyrqsyckktgpv.supabase.co https://api.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com; frame-ancestors 'none'; form-action 'self' https://checkout.stripe.com; base-uri 'self'; object-src 'none'; upgrade-insecure-requests` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Embedder-Policy` | `unsafe-none` (kept compatible with third-party embeds) |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=(), payment=(self "https://js.stripe.com"), usb=(), magnetometer=(), gyroscope=(), accelerometer=()` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |

CSP runs in **Report-Only** mode for now — it logs violations without breaking anything. Recommend keeping report-only for ~7 days, monitoring `chrome://net-internals` or browser DevTools console for violations, then flipping to enforcing mode by renaming the header.

### Batch 2 — Cloudflare zone settings (deployed)

| Setting | Before | After |
|---|---|---|
| DNSSEC | Disabled | **Pending DS at registrar** (see action item §4) |
| SSL/TLS encryption mode | Full | **Full (Strict)** — verified GitHub Pages serves a valid Let's Encrypt cert for `phmurtstudios.com` and `www.phmurtstudios.com` |
| Minimum TLS version | TLS 1.0 | **TLS 1.2** |
| Bot Fight Mode | Off | **On** |

Smoke test post-deploy: `HTTP 200`, valid TLS verification, no console errors.

---

## 2. Supabase audit findings

### 2.1 Tables — RLS posture (public schema)

All 13 application tables have RLS **enabled** with policies attached. Detailed counts:

| Table | RLS | Policies | Notes |
|---|:---:|:---:|---|
| admin_audit_log | ✓ | 4 | |
| battle_map_snapshots | ✓ | 3 | |
| campaign_invites | ✓ | 4 | |
| campaign_members | ✓ | 4 | |
| campaigns | ✓ | 7 | |
| characters | ✓ | 6 | |
| encounter_templates | ✓ | 4 | |
| profiles | ✓ | 6 | **Contains the critical issue below** |
| site_announcements | ✓ | 4 | |
| site_errors | ✓ | 6 | Anon INSERT allowed (intentional client-side error logging) |
| site_settings | ✓ | 3 | |
| site_visits | ✓ | 5 | Anon INSERT allowed (intentional analytics) |
| stripe_events | ✓ | 1 | |

### 2.2 🔴 CRITICAL finding — `profiles` UPDATE policy is exploitable by anonymous users

A policy named **`Service role can update all profiles`** exists on `public.profiles` with:

```
cmd        = UPDATE
roles      = {public}        ← matches every Postgres role, including anon
qual       = true            ← matches every existing row
with_check = true            ← allows any new column values
```

The intent (per the name) was to grant the Supabase **`service_role`** unrestricted writes. Instead it was attached to the Postgres pseudo-role `PUBLIC`, which `anon` and `authenticated` are members of. Verified reachable: a `PATCH` to `/rest/v1/profiles` with the public anon API key passes the auth/RLS gate (returned a column-validation error rather than 401/403, proving the policy doesn't block it).

**Exploit impact:** any visitor — without logging in — can `UPDATE` any row in `profiles`. Depending on your column set this can be used to overwrite emails, subscription flags (`is_pro`, `is_admin`, etc.), display names, anything.

**Recommended fix (one statement, fully reversible):**

```sql
-- 1. Drop the misconfigured policy
DROP POLICY "Service role can update all profiles" ON public.profiles;

-- 2. Recreate it scoped to service_role only
CREATE POLICY "Service role can update all profiles"
  ON public.profiles
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);
```

The `service_role` API key (server-side only, never shipped to browsers) will continue to work exactly as before. Anon and authenticated users keep whatever update access the **other 5 policies** on `profiles` give them — typically "users can update their own row," which appears to already exist (saved query "User Self-Update Policy for Profiles").

> ✅ **APPLIED 2026-04-15.** Anon UPDATE on `profiles` now affects 0 rows (verified via `SET LOCAL role = 'anon'` test). Rollback in `rls-rollback.sql`.

### 2.3 Other anon-writable policies (review, but likely intentional)

| Table | Policy | Why it's probably OK | Recommendation |
|---|---|---|---|
| `site_errors` | `Anon insert` + `Anon insert errors` | Lets the client log JS errors | Two near-duplicate policies — consolidate to one. Add a Cloudflare rate-limit on `/rest/v1/site_errors` to prevent log flooding. |
| `site_visits` | `Anon insert` | Page view tracking | Same — add a rate-limit rule. |

### 2.4 Storage buckets — healthy

| Bucket | Public | Size limit | MIME whitelist |
|---|:---:|---|---|
| `map-images` | No | 10 MB | image/jpeg, image/png, image/webp, image/* |
| `portraits` | No | 5 MB | image/jpeg, image/png, image/webp |

Both private with size + MIME caps. No action needed.

### 2.5 Anon-callable RPCs — review recommended (not blocking)

13 SECURITY DEFINER functions in `public` schema are executable by `anon`:

`get_subscription_status`, `get_user_campaign_ids`, `handle_new_user`, `is_admin`, `is_campaign_member`, `is_campaign_owner`, `is_superuser`, `join_campaign_by_code`, `phmurt_is_admin`, plus 4 more visible in the dashboard.

`SECURITY DEFINER` functions run as the function owner and bypass RLS. The names look intentional (helpers your client code calls), but each one is a privileged endpoint that needs to internally validate inputs. **Recommend you review each function body** to confirm:

1. It only reads data the caller is entitled to (e.g. `is_admin()` should check the calling user's identity, not a parameter).
2. Mutating ones (`join_campaign_by_code`, `handle_new_user`) validate and rate-limit themselves.
3. None return rows from privileged tables that bypass `profiles`/`campaigns` RLS.

I can pull each function's body into the audit if you want — say the word.

---

## 3. Code-side observations (no changes made — these are for your awareness)

| Item | Finding | Recommendation |
|---|---|---|
| Subresource Integrity | ✅ Already in place — `<script integrity="sha384-..." crossorigin="anonymous">` on the jsdelivr Supabase script | No action needed |
| Inline `<meta>` CSP in `home.html` | A weaker, older CSP is hard-coded into the HTML (`script-src 'self' 'unsafe-inline'`). Browsers OR multiple CSPs to the most restrictive set, so the header CSP we shipped is taking effect, but the meta tag is dead weight and confusing | Delete the `<meta http-equiv="Content-Security-Policy">` line from `home.html` (and any other pages that have it) |
| Stripe key | `supabase-config.js` shows `pk_test_...` — currently in test mode | Swap to `pk_live_...` when ready to take real payments. Stripe webhook handler should verify signatures using `STRIPE_WEBHOOK_SECRET` (typical Supabase Edge Function pattern — confirm it's enabled in your `stripe-checkout` function) |
| GitHub repo | Out of scope for this audit | Enable GitHub Dependabot alerts + secret scanning if not already on |

---

## 4. Action items for you (Aaron)

1. **Add the DS record at your domain registrar** to complete DNSSEC. From Cloudflare's DNSSEC dialog the values are:
   - **Algorithm:** 13 (ECDSAP256SHA256)
   - **Key Tag:** 2371
   - **Digest Type:** 2 (SHA-256)
   - **Public Key:** `mdsswUyr3DPW132mOi8V9xESWE8jToOdxCjjnopKl+GqJxpVXckHAeF+KkxLbxILfDLUTOrAK9iUzy1L53eKGQ==`
   - **Flags:** 257 (KSK)
   - **DS Record (full):** `phmurtstudios.com. 3600 IN DS 2371 13 2 61CEC1B77270858A92668782EB8DB17920900EC3F94435BC8319640B4F3DBC3...` *(use the "Click to copy" buttons in the Cloudflare DNSSEC modal for the exact final digest — I deferred that step to avoid copy-paste errors)*
   - Once added at the registrar, DNSSEC activates within 24 hours and Cloudflare will email confirmation.

2. **Approve (or modify) the `profiles` UPDATE policy fix in §2.2** — this is the only critical-severity finding. Reply "approve fix" to apply.

3. **Watch CSP report-only violations** in browser DevTools for a week, then I can flip CSP to enforcing.

4. **Optional follow-ups:**
   - Consolidate the two `site_errors` anon-insert policies.
   - Add Cloudflare rate-limit rules for `/rest/v1/site_errors` and `/rest/v1/site_visits`.
   - Review the 13 anon-callable RPC bodies.
   - Remove the dead `<meta>` CSP from `home.html`.
   - Consider Cloudflare WAF "Custom Rules" for path-specific protection (e.g. block requests to `/rest/v1/profiles?` with method PATCH/DELETE coming from anon — defense-in-depth on top of the policy fix).

---

## 4a. Applied changes (this session)

| Change | Status | Notes |
|---|---|---|
| `profiles` UPDATE policy scoped from `PUBLIC` → `service_role` | ✅ Applied | Anon UPDATE verified to affect 0 rows. Other 5 profile policies (incl. self-update) untouched. |
| Duplicate `site_errors` policy `Anon insert errors` removed | ✅ Applied | `Anon insert` retained as the canonical client-side error logging policy. |
| Postgres BEFORE INSERT rate-limit trigger on `site_errors` (500/min) and `site_visits` (1000/min) | ✅ Applied | Pivoted from Cloudflare rate-limit (not viable — Supabase REST is on `*.supabase.co`, outside the Cloudflare zone for `phmurtstudios.com`). Trigger function `public.rl_throttle_inserts(limit, ts_col)` runs SECURITY DEFINER, bypasses for `service_role` JWT, raises SQLSTATE 54000 over threshold. |
| Live smoke test | ✅ Pass | Homepage loads, no console errors, `POST /rest/v1/site_visits` returns 201, profile + settings reads return 200. |

Rollback for §2.2 + §2.3 lives at `rls-rollback.sql`. To remove the rate-limit triggers if needed:

```sql
DROP TRIGGER IF EXISTS rl_site_errors ON public.site_errors;
DROP TRIGGER IF EXISTS rl_site_visits ON public.site_visits;
DROP FUNCTION IF EXISTS public.rl_throttle_inserts();
```

---

## 5. What I deliberately did NOT do

- Did not touch any data row.
- Did not add the registrar DS record (you have to do that — Cloudflare can't reach your registrar).
- Did not flip CSP from report-only to enforcing.
- Did not modify any source file in your GitHub repo.
- Did not review the 13 SECURITY DEFINER RPC bodies (still optional follow-up).
- Did not enable HSTS preload submission (the header is set, but you'd submit at hstspreload.org separately if you want to be on the browser preload list — check first that you're truly committed; once on it, getting off takes weeks).
