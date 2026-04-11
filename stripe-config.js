/* ═══════════════════════════════════════════════════════════════════
   STRIPE CONFIG — Phmurt Studios Pro Subscription
   ═══════════════════════════════════════════════════════════════════
   SECURITY NOTE: These are Stripe PUBLISHABLE keys and price IDs.
   They are designed by Stripe to be safe for client-side use.
   The SECRET key (sk_...) must NEVER appear here — it belongs
   only in Supabase Edge Function environment secrets.

   To switch to live mode:
   1. Replace pk_test_... with pk_live_... from Stripe Dashboard
   2. Replace price IDs with your live product's price IDs
   3. Update STRIPE_SECRET_KEY in Supabase Edge Function secrets
   4. Create a new webhook endpoint in Stripe live mode
   ═══════════════════════════════════════════════════════════════════ */

/* ── Publishable key (safe for client-side) ──────────────────────── */
/* SECURITY: Load from environment, never hardcode in source */
var STRIPE_PUBLISHABLE_KEY = typeof STRIPE_PUBLISHABLE_KEY_ENV !== 'undefined'
  ? STRIPE_PUBLISHABLE_KEY_ENV
  : '';

/* ── Price IDs (public, identify your Stripe product prices) ─────── */
/* SECURITY: Load from environment, never hardcode in source */
/* Set these via: script tags with data attributes, window globals, or build-time injection */
var STRIPE_PRICE_ID_MONTHLY = typeof STRIPE_PRICE_ID_MONTHLY_ENV !== 'undefined'
  ? STRIPE_PRICE_ID_MONTHLY_ENV
  : '';
var STRIPE_PRICE_ID_YEARLY = typeof STRIPE_PRICE_ID_YEARLY_ENV !== 'undefined'
  ? STRIPE_PRICE_ID_YEARLY_ENV
  : '';

/* Legacy alias — checkout function reads the specific monthly/yearly IDs */
/* DEPRECATED: Use STRIPE_PRICE_ID_MONTHLY or STRIPE_PRICE_ID_YEARLY instead */
var STRIPE_PRICE_ID = '';                 // (unused, kept for compat)

/* ── Customer Portal Configuration ────────────────────────────────── */
/* STRIPE_CUSTOMER_PORTAL_ID: Your Stripe Customer Portal configuration ID */
var STRIPE_CUSTOMER_PORTAL_ID = typeof STRIPE_CUSTOMER_PORTAL_ID_ENV !== 'undefined'
  ? STRIPE_CUSTOMER_PORTAL_ID_ENV
  : '';

/* STRIPE_PORTAL_URL is typically constructed by your backend from STRIPE_CUSTOMER_PORTAL_ID.
   Leave empty — your backend should provide the URL when needed. */
var STRIPE_PORTAL_URL = '';

/* ═══════════════════════════════════════════════════════════════════
   SUPABASE EDGE FUNCTION URL for creating Checkout Sessions
   Auto-constructed from your Supabase URL. No need to change.
   ═══════════════════════════════════════════════════════════════════ */
var STRIPE_CHECKOUT_FUNCTION_URL = '';

(function () {
  // Initialize STRIPE_CHECKOUT_FUNCTION_URL from SUPABASE_URL
  if (!STRIPE_CHECKOUT_FUNCTION_URL && typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) {
    try {
      // Validate SUPABASE_URL format
      new URL(SUPABASE_URL);
      var baseUrl = SUPABASE_URL.replace(/\/$/, '');
      var checkoutUrl = baseUrl + '/functions/v1/stripe-checkout';
      // Validate resulting URL is well-formed
      new URL(checkoutUrl);
      STRIPE_CHECKOUT_FUNCTION_URL = checkoutUrl;
    } catch (e) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn('[Stripe] Failed to initialize checkout URL:', e);
      }
    }
  }

  // Validate required configuration
  function validateStripeConfig() {
    var errors = [];

    if (!STRIPE_PUBLISHABLE_KEY) {
      errors.push('STRIPE_PUBLISHABLE_KEY is not configured. Set STRIPE_PUBLISHABLE_KEY_ENV.');
    } else if (!/^pk_(test|live)_/.test(STRIPE_PUBLISHABLE_KEY)) {
      errors.push('STRIPE_PUBLISHABLE_KEY format invalid. Expected pk_test_... or pk_live_...');
    }

    if (!STRIPE_PRICE_ID_MONTHLY) {
      errors.push('STRIPE_PRICE_ID_MONTHLY is not configured. Set STRIPE_PRICE_ID_MONTHLY_ENV.');
    } else if (!/^price_/.test(STRIPE_PRICE_ID_MONTHLY)) {
      errors.push('STRIPE_PRICE_ID_MONTHLY format invalid. Expected price_...');
    }

    if (!STRIPE_PRICE_ID_YEARLY) {
      errors.push('STRIPE_PRICE_ID_YEARLY is not configured. Set STRIPE_PRICE_ID_YEARLY_ENV.');
    } else if (!/^price_/.test(STRIPE_PRICE_ID_YEARLY)) {
      errors.push('STRIPE_PRICE_ID_YEARLY format invalid. Expected price_...');
    }

    if (!STRIPE_CUSTOMER_PORTAL_ID) {
      errors.push('STRIPE_CUSTOMER_PORTAL_ID is not configured. Set STRIPE_CUSTOMER_PORTAL_ID_ENV.');
    } else if (!/^bps_/.test(STRIPE_CUSTOMER_PORTAL_ID)) {
      errors.push('STRIPE_CUSTOMER_PORTAL_ID format invalid. Expected bps_...');
    }

    if (!STRIPE_CHECKOUT_FUNCTION_URL) {
      errors.push('STRIPE_CHECKOUT_FUNCTION_URL not initialized. Check SUPABASE_URL configuration.');
    } else {
      try {
        new URL(STRIPE_CHECKOUT_FUNCTION_URL);
      } catch (e) {
        errors.push('STRIPE_CHECKOUT_FUNCTION_URL format invalid. Invalid URL: ' + STRIPE_CHECKOUT_FUNCTION_URL);
      }
    }

    return errors;
  }

  // Expose validation function globally (client-side only)
  if (typeof window !== 'undefined' && typeof window.validateStripeConfig === 'undefined') {
    window.validateStripeConfig = validateStripeConfig;
  }

  // Log warnings on config issues if debug is enabled
  var configErrors = validateStripeConfig();
  if (configErrors.length > 0 && typeof console !== 'undefined' && console.warn) {
    console.warn('[Stripe Config] Issues found:', configErrors);
  }

  // Store validation errors for later reference
  if (typeof window !== 'undefined' && typeof window.stripeConfigErrors === 'undefined') {
    window.stripeConfigErrors = configErrors;
  }
})();
