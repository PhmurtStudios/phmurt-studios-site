/* ═══════════════════════════════════════════════════════════════════
   STRIPE CONFIG — Phmurt Studios Pro Subscription
   ═══════════════════════════════════════════════════════════════════
   Fill in these values from your Stripe Dashboard:
   1. Go to https://dashboard.stripe.com
   2. Get your Publishable Key from Developers → API Keys
   3. Create a Product called "Phmurt Studios Pro"
   4. Add TWO prices to that product:
      - $5/month  (recurring monthly)  → copy the Price ID
      - $50/year  (recurring yearly)   → copy the Price ID
   5. Set up a Customer Portal at
      https://dashboard.stripe.com/settings/billing/portal
   ═══════════════════════════════════════════════════════════════════ */

// SECURITY: Load from window.PHMURT_CONFIG set by server
// Never commit real keys to source control
var STRIPE_PUBLISHABLE_KEY = (typeof window !== 'undefined' && window.PHMURT_CONFIG && window.PHMURT_CONFIG.stripe_pk && typeof window.PHMURT_CONFIG.stripe_pk === 'string') ? window.PHMURT_CONFIG.stripe_pk : '';
var STRIPE_PRICE_ID_MONTHLY = (typeof window !== 'undefined' && window.PHMURT_CONFIG && window.PHMURT_CONFIG.stripe_price_monthly && typeof window.PHMURT_CONFIG.stripe_price_monthly === 'string') ? window.PHMURT_CONFIG.stripe_price_monthly : '';
var STRIPE_PRICE_ID_YEARLY  = (typeof window !== 'undefined' && window.PHMURT_CONFIG && window.PHMURT_CONFIG.stripe_price_yearly && typeof window.PHMURT_CONFIG.stripe_price_yearly === 'string') ? window.PHMURT_CONFIG.stripe_price_yearly : '';

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
