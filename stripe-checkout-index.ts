// ═══════════════════════════════════════════════════════════════════
// Phmurt Studios — Stripe Checkout Session Creator (HARDENED)
// ═══════════════════════════════════════════════════════════════════
// Uses fetch() directly against Stripe REST API (no SDK dependency)
// to avoid Deno runtime compatibility issues.
//
// SECURITY NOTES:
//   - Origin whitelist prevents unauthorized cross-origin calls
//   - JWT verified via Supabase auth before any action
//   - return_url validated against allowed domains (prevents open redirect)
//   - interval input strictly validated against whitelist
//   - Rate limiting via per-user cooldown (in-memory, 10s) +
//     DB-backed sliding-window limit (5/hour/user) via rl_check_and_record
//   - Error messages sanitized — no Stripe internals leaked
//   - Profile existence and ban status verified before checkout
//
// CRITICAL: This function does NOT grant access to pro features.
// Only the webhook (stripe-webhook/index.ts) updates subscription status.
// Pro features must be gated server-side via RLS and database checks.
// ═══════════════════════════════════════════════════════════════════

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Stripe REST API helper ───────────────────────────────────────
const STRIPE_API = "https://api.stripe.com";

async function stripeRequest(
  method: string,
  path: string,
  apiKey: string,
  params?: Record<string, string>,
): Promise<{ ok: boolean; status: number; data: Record<string, unknown> }> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const url = method === "GET" && params
    ? `${STRIPE_API}${path}?${new URLSearchParams(params).toString()}`
    : `${STRIPE_API}${path}`;

  const fetchOpts: RequestInit = { method, headers };
  if (method === "POST" && params) {
    fetchOpts.body = new URLSearchParams(params).toString();
  }

  const resp = await fetch(url, fetchOpts);
  const data = await resp.json();
  return { ok: resp.ok, status: resp.status, data };
}

// ── Validate secrets at startup ───────────────────────────────────
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const PRICE_ID_MONTHLY = Deno.env.get("STRIPE_PRICE_ID_MONTHLY");
const PRICE_ID_YEARLY = Deno.env.get("STRIPE_PRICE_ID_YEARLY");
const PRICE_ID_PARTY_MONTHLY = Deno.env.get("STRIPE_PRICE_ID_PARTY_MONTHLY");
const PRICE_ID_PARTY_YEARLY = Deno.env.get("STRIPE_PRICE_ID_PARTY_YEARLY");
const PRICE_ID_LIFETIME = Deno.env.get("STRIPE_PRICE_ID_LIFETIME");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

// SECURITY: Configure your allowed origins here
const ALLOWED_ORIGINS = [
  "https://phmurtstudios.com",
  "https://www.phmurtstudios.com",
];

// SECURITY: Allowed return URL domains (prevents open redirect attacks)
const ALLOWED_RETURN_DOMAINS = [
  "phmurtstudios.com",
  "www.phmurtstudios.com",
];

if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("FATAL: Missing required environment variables.");
  throw new Error("Missing required environment variables: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
}
if (!PRICE_ID_MONTHLY && !PRICE_ID_YEARLY) {
  console.error("FATAL: At least one STRIPE_PRICE_ID must be configured.");
  throw new Error("Missing STRIPE_PRICE_ID_MONTHLY or STRIPE_PRICE_ID_YEARLY environment variable");
}

const supabase = createClient(SUPABASE_URL as string, SUPABASE_SERVICE_ROLE_KEY as string);

// ── Rate limiting: simple per-user cooldown (10 sec, in-memory) ───
// Guards against rapid double-clicks within a single warm instance.
// DB-backed sliding-window limit below covers cross-instance / cold
// starts and prevents slow-burn abuse (>5 starts per hour per user).
const recentRequests = new Map<string, number>();
const RATE_LIMIT_MS = 10_000;

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const last = recentRequests.get(userId);
  if (last && now - last < RATE_LIMIT_MS) return true;
  recentRequests.set(userId, now);
  if (recentRequests.size > 1000) {
    let deleted = 0;
    for (const [key, time] of recentRequests) {
      if (now - time > RATE_LIMIT_MS * 6) {
        recentRequests.delete(key);
        deleted++;
        if (deleted >= 100) break;
      }
    }
  }
  return false;
}

// ── DB-backed sliding-window rate limit ───────────────────────────
// Calls the public.rl_check_and_record(user_id, ip_hash, bucket, max,
// window_s) RPC. Returns true if the call is allowed, false if the
// user is over the limit for this bucket. Failures (network, RPC
// exception) fail OPEN so a DB blip doesn't block paying customers.
async function checkDbRateLimit(
  userId: string,
  bucket: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("rl_check_and_record", {
      p_user_id: userId,
      p_ip_hash: null,
      p_bucket: bucket,
      p_max: max,
      p_window_s: windowSeconds,
    });
    if (error) {
      console.error("rl_check_and_record failed, failing open:", error.message);
      return true;
    }
    return data === true;
  } catch (err) {
    console.error(
      "rl_check_and_record threw, failing open:",
      err instanceof Error ? err.message : String(err),
    );
    return true;
  }
}

// ── Email validation helper ───────────────────────────────────────
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

// ── CORS helper ───────────────────────────────────────────────────
function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowed =
    origin && ALLOWED_ORIGINS.some((o) => o === origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
  };
}

// ── Validate return URL ───────────────────────────────────────────
function isValidReturnUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    const hostname = parsed.hostname.replace(/^www\./, "");
    return ALLOWED_RETURN_DOMAINS.some(
      (d) => hostname === d || hostname === d.replace(/^www\./, "")
    );
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);
  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(null, { status: 405, headers: jsonHeaders });
  }

  if (!STRIPE_SECRET_KEY || !SUPABASE_URL) {
    return new Response(
      JSON.stringify({ error: "Payment system is not configured." }),
      { status: 503, headers: jsonHeaders }
    );
  }

  let user: { id: string; email?: string } | undefined = undefined;
  try {
    // SECURITY: Require and verify JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required." }),
        { status: 401, headers: jsonHeaders }
      );
    }

    const token = authHeader.substring(7);
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session. Please sign in again." }),
        { status: 401, headers: jsonHeaders }
      );
    }

    user = authUser;

    // SECURITY: In-memory cooldown (catches rapid double-clicks)
    if (isRateLimited(user.id)) {
      return new Response(
        JSON.stringify({ error: "Please wait a moment before trying again." }),
        { status: 429, headers: jsonHeaders }
      );
    }

    // SECURITY: DB-backed sliding-window limit — 5 checkout starts per
    // hour per user. Survives cold starts and cross-instance.
    const dbOk = await checkDbRateLimit(user.id, "start-checkout", 5, 3600);
    if (!dbOk) {
      return new Response(
        JSON.stringify({ error: "You've hit the hourly checkout limit. Please try again later or contact support." }),
        { status: 429, headers: jsonHeaders }
      );
    }

    // Parse and validate request body
    let body: Record<string, unknown> = {};
    try {
      const raw = await req.json();
      if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
        body = raw as Record<string, unknown>;
      }
    } catch {
      // Invalid JSON — continue with empty body
    }

    // SECURITY: Validate interval — strict whitelist
    const VALID_INTERVALS = ['monthly', 'yearly', 'party_monthly', 'party_yearly', 'lifetime'];
    const interval = VALID_INTERVALS.includes(body.interval as string) ? (body.interval as string) : 'monthly';

    // SECURITY: Optional promo_code (a Stripe promotion_code ID like "promo_...").
    // If provided and well-formed, we'll attach it as a discount. Otherwise we
    // fall back to allow_promotion_codes=true so users can enter a code in the
    // hosted checkout UI. The two params are mutually exclusive at Stripe.
    let specificPromoCodeId: string | null = null;
    if (typeof body.promo_code === "string") {
      const raw = body.promo_code.trim();
      // Stripe promotion_code IDs match ^promo_[A-Za-z0-9]{1,64}$
      if (/^promo_[A-Za-z0-9]{1,64}$/.test(raw)) {
        specificPromoCodeId = raw;
      } else if (raw.length > 0) {
        console.warn(`Rejected promo_code from user ${user.id} (bad format)`);
      }
    }

    // Optional referral_code — short human-friendly string used only for
    // attribution metadata on the Stripe session. Does NOT grant discounts.
    let referralCode: string | null = null;
    if (typeof body.referral_code === "string") {
      const raw = body.referral_code.trim();
      // Keep it conservative: 2-32 chars, alnum + - _
      if (/^[A-Za-z0-9_-]{2,32}$/.test(raw)) {
        referralCode = raw.slice(0, 32);
      } else if (raw.length > 0) {
        console.warn(`Rejected referral_code from user ${user.id} (bad format)`);
      }
    }

    // SECURITY: Validate return URL — prevent open redirect
    let returnUrl = "https://phmurtstudios.com";
    if (body.return_url && typeof body.return_url === "string") {
      if (isValidReturnUrl(body.return_url)) {
        returnUrl = body.return_url;
      } else {
        console.warn(
          `Rejected return_url: ${String(body.return_url).substring(0, 100)} from user ${user.id}`
        );
      }
    }

    // Pick the right price ID based on interval
    let priceId: string | undefined;
    switch (interval) {
      case 'yearly':
        priceId = PRICE_ID_YEARLY;
        break;
      case 'party_monthly':
        priceId = PRICE_ID_PARTY_MONTHLY;
        break;
      case 'party_yearly':
        priceId = PRICE_ID_PARTY_YEARLY;
        break;
      case 'lifetime':
        priceId = PRICE_ID_LIFETIME;
        break;
      default:
        priceId = PRICE_ID_MONTHLY;
    }

    if (!priceId || typeof priceId !== "string" || priceId.length === 0) {
      return new Response(
        JSON.stringify({ error: "This billing interval is not available." }),
        { status: 400, headers: jsonHeaders }
      );
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email, name, is_banned")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError.message);
      return new Response(
        JSON.stringify({ error: "Could not fetch profile. Please try again." }),
        { status: 500, headers: jsonHeaders }
      );
    }

    if (profile?.is_banned) {
      return new Response(
        JSON.stringify({ error: "This account has been suspended." }),
        { status: 403, headers: jsonHeaders }
      );
    }

    if (!profile) {
      console.warn(`Profile missing for user ${user.id} during checkout`);
      return new Response(
        JSON.stringify({ error: "Could not verify account. Please sign in again." }),
        { status: 401, headers: jsonHeaders }
      );
    }

    const customerId = profile?.stripe_customer_id;

    // If they already have an active subscription, redirect to portal
    // EXCEPTION: Lifetime purchases always go to checkout
    if (interval !== 'lifetime' && customerId && typeof customerId === "string") {
      try {
        const subsResult = await Promise.race([
          stripeRequest("GET", "/v1/subscriptions", STRIPE_SECRET_KEY, {
            customer: customerId,
            status: "active",
            limit: "1",
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Subscription check timeout")), 8000)
          ),
        ]);

        if (subsResult.ok && subsResult.data?.data && Array.isArray(subsResult.data.data) && subsResult.data.data.length > 0) {
          const portalResult = await stripeRequest("POST", "/v1/billing_portal/sessions", STRIPE_SECRET_KEY, {
            customer: customerId,
            return_url: returnUrl,
          });
          if (portalResult.ok && portalResult.data?.url) {
            return new Response(
              JSON.stringify({ url: portalResult.data.url, type: "portal" }),
              { status: 200, headers: jsonHeaders }
            );
          }
        }
      } catch (err) {
        console.error("Error checking existing subscription:", err instanceof Error ? err.message : String(err));
      }
    }

    // Determine plan type for metadata
    let planType = 'pro';
    if (interval.startsWith('party_')) {
      planType = 'party';
    } else if (interval === 'lifetime') {
      planType = 'lifetime';
    }

    // SECURITY: Enforce lifetime slot limit server-side (200 max)
    if (interval === 'lifetime') {
      const { count: lifetimeCount, error: countError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('subscription_tier', 'lifetime')
        .eq('subscription_status', 'active');
      if (countError) {
        console.error("Error checking lifetime slots:", countError.message);
        return new Response(
          JSON.stringify({ error: "Could not verify availability. Please try again." }),
          { status: 500, headers: jsonHeaders }
        );
      }
      if ((lifetimeCount ?? 0) >= 200) {
        return new Response(
          JSON.stringify({ error: "All 200 Lifetime Pass slots have been claimed. This offer is no longer available." }),
          { status: 409, headers: jsonHeaders }
        );
      }
    }

    // Build the Stripe Checkout Session params as form-encoded data
    const mode = interval === "lifetime" ? "payment" : "subscription";
    const safeInterval = interval.length <= 50 ? interval : "monthly";
    const expiresAt = String(Math.floor(Date.now() / 1000) + 30 * 60);

    const checkoutParams: Record<string, string> = {
      mode,
      "payment_method_types[0]": "card",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      success_url: `${returnUrl}?subscription=success`,
      cancel_url: `${returnUrl}?subscription=canceled`,
      client_reference_id: user.id,
      "metadata[supabase_user_id]": user.id,
      "metadata[interval]": safeInterval,
      "metadata[plan_type]": planType,
      expires_at: expiresAt,
    };

    // Promotion/discount handling. Stripe does not allow
    // allow_promotion_codes together with discounts[], so we pick one:
    //   - If the client passed a specific, well-formed promo_code ID,
    //     attach it as a discount.
    //   - Otherwise, enable the "Add promotion code" UI in hosted checkout.
    if (specificPromoCodeId) {
      checkoutParams["discounts[0][promotion_code]"] = specificPromoCodeId;
      checkoutParams["metadata[promo_code]"] = specificPromoCodeId;
    } else {
      checkoutParams["allow_promotion_codes"] = "true";
    }

    // Attribution-only referral metadata (does not affect price).
    if (referralCode) {
      checkoutParams["metadata[referral_code]"] = referralCode;
    }

    // Attach existing customer or prefill email
    if (customerId) {
      checkoutParams.customer = customerId;
    } else {
      const email = (profile?.email && typeof profile.email === "string") ? profile.email : (user.email || "");
      if (email && typeof email === "string" && isValidEmail(email)) {
        checkoutParams.customer_email = email;
      }
    }

    const sessionResult = await stripeRequest("POST", "/v1/checkout/sessions", STRIPE_SECRET_KEY, checkoutParams);

    if (!sessionResult.ok) {
      console.error("Stripe checkout session error:", sessionResult.status, JSON.stringify(sessionResult.data));
      return new Response(
        JSON.stringify({ error: "Could not create checkout session. Please try again." }),
        { status: 500, headers: jsonHeaders }
      );
    }

    const sessionUrl = sessionResult.data?.url;
    if (!sessionUrl || typeof sessionUrl !== "string") {
      return new Response(
        JSON.stringify({ error: "No checkout URL returned from server." }),
        { status: 500, headers: jsonHeaders }
      );
    }

    return new Response(
      JSON.stringify({ url: sessionUrl, type: "checkout" }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err) {
    let userId = 'unknown';
    try {
      if (typeof user !== 'undefined' && user && typeof user.id === 'string') {
        userId = user.id;
      }
    } catch {
      // Ignore
    }
    console.error("Checkout error for user:", {
      userId,
      errorType: err instanceof Error ? err.constructor.name : typeof err,
      message: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString(),
    });
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: jsonHeaders }
    );
  }
});
