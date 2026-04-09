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

var STRIPE_PUBLISHABLE_KEY = 'pk_test_51TK9OH2Me6B5yZKdIoLLRqD1r4L1BauSA1syGGJkZOvo7duRYKPL8oxmK9qchFUP7vwLw9vTpgSgi9iNoJG1H4zz00YXbsyDXP';
var STRIPE_PRICE_ID_MONTHLY = 'price_1TK9Vk2Me6B5yZKdxakmjGlV';
var STRIPE_PRICE_ID_YEARLY  = 'price_1TK9Vk2Me6B5yZKdggyhlKun';

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
    STRIPE_CHECKOUT_FUNCTION_URL = SUPABASE_URL + '/functions/v1/stripe-checkout';
  }
})();
