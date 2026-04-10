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
var STRIPE_PUBLISHABLE_KEY = 'pk_test_51TK9OH2Me6B5yZKdIoLLRqD1r4LlBauSA1syGGJkZOvo7duRYKPL8oxmK9qchFUP7vwLw9vTpgSgi9iNoJG1H4zz00YXbsyDXP';

/* ── Price IDs (public, identify your Stripe product prices) ─────── */
var STRIPE_PRICE_ID_MONTHLY = 'price_1TK9Vk2Me6B5yZKdxakmjGlV';   // $4.99/month
var STRIPE_PRICE_ID_YEARLY  = 'price_1TK9Vk2Me6B5yZKdggyhlKun';   // $49.99/year

/* Legacy alias — checkout function reads the specific monthly/yearly IDs */
var STRIPE_PRICE_ID = '';                 // (unused, kept for compat)

var STRIPE_PORTAL_URL = '';               // Leave blank to auto-generate

/* ═══════════════════════════════════════════════════════════════════
   SUPABASE EDGE FUNCTION URL for creating Checkout Sessions
   Auto-constructed from your Supabase URL. No need to change.
   ═══════════════════════════════════════════════════════════════════ */
var STRIPE_CHECKOUT_FUNCTION_URL = '';

(function () {
  if (!STRIPE_CHECKOUT_FUNCTION_URL && typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL) {
    // Validate URL format before concatenating
    try {
      var parsedUrl = new URL(SUPABASE_URL);
      // Ensure URL ends without trailing slash before concatenation
      var baseUrl = SUPABASE_URL.replace(/\/$/, '');
      STRIPE_CHECKOUT_FUNCTION_URL = baseUrl + '/functions/v1/stripe-checkout';
    } catch (e) {
      // Invalid URL, leave STRIPE_CHECKOUT_FUNCTION_URL empty
      if (window.PHMURT_DEBUG) console.warn('[Stripe] Invalid SUPABASE_URL format:', e);
    }
  }
})();
