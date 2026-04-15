/* ═══════════════════════════════════════════════════════════════════
   SUPABASE CONFIG – Phmurt Studios
   ═══════════════════════════════════════════════════════════════════
   SECURITY (V-002): Supabase anon key is a public key by design
   (intended for client-side use). Real security is enforced via:
   1. Row-Level Security (RLS) policies on all Supabase tables
   2. Server-side auth verification for privileged operations
   3. Supabase JWT verification for all API calls

   IMPORTANT RLS REQUIREMENTS (must be enabled in Supabase dashboard):
   - characters:  SELECT/UPDATE/DELETE WHERE owner_id = auth.uid()
   - campaigns:   SELECT/UPDATE/DELETE WHERE owner_id = auth.uid() OR id IN (campaign_members)
   - profiles:    SELECT own profile, UPDATE only own profile
   - campaign_invites: INSERT/DELETE WHERE owner_id = auth.uid()
   - encounter_templates: SELECT/UPDATE/DELETE WHERE owner_id = auth.uid()
   ═══════════════════════════════════════════════════════════════════ */

/* CONFIGURATION: Load from environment or use fallback values
   SECURITY: In production, prefer loading from environment variables or config server
   Hardcoded keys are acceptable for public anon keys but must be protected by RLS policies */
var SUPABASE_URL      = 'https://zrfmboqoyrqsyckktgpv.supabase.co';
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyZm1ib3FveXJxc3lja2t0Z3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTY0MzQsImV4cCI6MjA4OTU3MjQzNH0.1tzr_vD7wF2tjFw9fCyqYsAs_EZ_hJ1zlKERwrTFi5I';

/* SECURITY (V-020): Gate debug logging behind flag. Set to true only for development. */
Object.defineProperty(window, 'PHMURT_DEBUG', { value: false, writable: false, configurable: false });

/* SECURITY: Check localStorage availability (required for session persistence) */
(function () {
  try {
    var _test = '__phmurt_storage_test__';
    localStorage.setItem(_test, _test);
    localStorage.removeItem(_test);
  } catch (e) {
    console.warn('[Phmurt] localStorage not available. Session persistence disabled.');
  }
})();

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
var _phmurtInitInProgress = false;

(function () {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

  /* SECURITY: Validate URLs to ensure HTTPS enforcement */
  if (!SUPABASE_URL.startsWith('https://')) {
    console.error('[Phmurt] SUPABASE_URL must use HTTPS protocol.');
    return;
  }

  /* SECURITY: Prevent multiple initialization attempts (race condition protection) */
  function _createClient() {
    if (_phmurtInitInProgress) {
      if (window.PHMURT_DEBUG) console.warn('[Phmurt] Initialization already in progress.');
      return;
    }
    _phmurtInitInProgress = true;

    try {
      if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
        throw new Error('Supabase library not properly loaded.');
      }

      phmurtSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession:     true,
          autoRefreshToken:   true,
          detectSessionInUrl: true,
          storageKey:         'phmurt_sb_auth'
        }
      });

      if (window.PHMURT_DEBUG) console.info('[Phmurt] Supabase client ready.');
      /* SECURITY: Use CustomEvent for better control over event details */
      var event = new CustomEvent('phmurt-supabase-ready', { detail: { ready: true } });
      window.dispatchEvent(event);
    } catch (e) {
      console.error('[Phmurt] Supabase initialization failed:', e);
      if (window.PHMURT_DEBUG) console.warn('[Phmurt] Running in offline mode.');
      phmurtSupabase = null;
    } finally {
      _phmurtInitInProgress = false;
    }
  }

  if (typeof window.supabase !== 'undefined') {
    /* CDN was already loaded (e.g. admin.html includes it explicitly) */
    _createClient();
  } else {
    /* Dynamically inject the CDN — works on any page without manual <script> tags */
    var _loadCDN = function() {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.47.0';
      s.crossOrigin = 'anonymous';
      // SECURITY: Update this hash when upgrading the version. Verify at https://www.jsdelivr.com/
      s.integrity = 'sha384-fm42zLXjam4N3lT5umWgNtBBPMP3Ddrdmr9lnPKtDWzs5Dqy457Yn6+eTvCgRU3n';
      s.onload  = _createClient;
      s.onerror = function () {
        if (window.PHMURT_DEBUG) console.warn('[Phmurt] Supabase CDN failed to load – offline mode.');
        /* SECURITY: Ensure graceful degradation on CDN failures */
        if (phmurtSupabase === null) {
          console.error('[Phmurt] Critical: Supabase client unavailable. App will not function.');
        }
      };
      s.referrerPolicy = 'no-referrer';
      document.head.appendChild(s);
    };
    _loadCDN();
  }
})();
