/* ═══════════════════════════════════════════════════════════════════
   STRIPE ENV — Phmurt Studios (LIVE MODE)
   ═══════════════════════════════════════════════════════════════════
   Defines the globals that stripe-config.js reads. MUST be loaded
   BEFORE stripe-config.js in every HTML page that uses Stripe.

   Publishable keys and price IDs are designed by Stripe to be safe
   for client-side use. Do NOT add sk_live_, sk_test_, or whsec_
   here — those live only in Supabase Edge Function secrets.

   Live mode activated: 2026-04-15
   ═══════════════════════════════════════════════════════════════════ */

/* Publishable key (safe, client-side) */
var STRIPE_PUBLISHABLE_KEY_ENV = 'pk_live_51TK9O7Rt76j4bhQkBUE3nWdoEBVTTFk3fju0s4Rhpgn5YSEmAE7VDVq00XPATlGSRdo6EigeV8WFDwjpj25qXiZs00sC7Y1OlD';

/* Recurring subscription price IDs */
var STRIPE_PRICE_ID_MONTHLY_ENV = 'price_1TKp4PRt76j4bhQkqeFk4X9e';   // $5.00 / month
var STRIPE_PRICE_ID_YEARLY_ENV  = 'price_1TKp4QRt76j4bhQk3Dw7NRmP';   // $50.00 / year

/* One-time "Lifetime" price — checkout code doesn't use this yet, but expose it so a future Buy Lifetime button can reference it */
var STRIPE_PRICE_ID_LIFETIME_ENV = 'price_1TLXdjRt76j4bhQkPsngxyv6'; // $50.00 one-time

/* Customer Portal configuration ID (prefix is bpc_, not bps_) */
var STRIPE_CUSTOMER_PORTAL_ID_ENV = 'bpc_1TKslaRt76j4bhQk6IDJpowa';
