/* ═══════════════════════════════════════════════════════════════════
   SUPABASE CONFIG – Phmurt Studios
   ═══════════════════════════════════════════════════════════════════
   SETUP:
     1. Go to https://supabase.com → your project → Settings → API
     2. Copy "Project URL"    → paste into SUPABASE_URL below
     3. Copy "anon / public"  → paste into SUPABASE_ANON_KEY below
     4. Save and reload — cloud auth and data sync activate automatically.
   ═══════════════════════════════════════════════════════════════════ */

var SUPABASE_URL      = 'https://zrfmboqoyrqsyckktgpv.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZm1ib3FveXJxc3lja2t0Z3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTY0MzQsImV4cCI6MjA4OTU3MjQzNH0.1tzr_vD7wF2tjFw9fCyqYsAs_EZ_hJ1zlKERwrTFi5I';

/* ── Admin email verification ────────────────────────────────────
   DEPRECATED: Admin email list has been moved to server-side verification.
   DO NOT hardcode admin emails in client-side code as it exposes
   administrator identities to all users.
   Admin status must be verified through the database (is_admin flag)
   or via server-side auth check with Supabase.
   ─────────────────────────────────────────────────────────────────── */
/* REMOVED: var PHMURT_ADMIN_EMAILS = [...]; */

/* ── Initialise the Supabase client ────────────────────────────────
   Self-loads the CDN if it hasn't been included on the page yet.
   Fires 'phmurt-supabase-ready' on window when the client is live.
   phmurt-auth.js listens for that event to re-run cloud init.
   ─────────────────────────────────────────────────────────────────── */
var phmurtSupabase = null;

(function () {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

  function _createClient() {
    try {
      phmurtSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession:     true,
          autoRefreshToken:   true,
          detectSessionInUrl: true,
          storageKey:         'phmurt_sb_auth'
        }
      });
      console.info('[Phmurt] Supabase client ready.');
      window.dispatchEvent(new Event('phmurt-supabase-ready'));
    } catch (e) {
      console.warn('[Phmurt] Supabase init failed – running in offline mode.', e);
    }
  }

  if (typeof window.supabase !== 'undefined') {
    /* CDN was already loaded (e.g. admin.html includes it explicitly) */
    _createClient();
  } else {
    /* Dynamically inject the CDN — works on any page without manual <script> tags */
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    s.onload  = _createClient;
    s.onerror = function () { console.warn('[Phmurt] Supabase CDN failed to load – offline mode.'); };
    document.head.appendChild(s);
  }
})();
