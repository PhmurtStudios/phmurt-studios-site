/* ─────────────────────────────────────────────────────────────────────
   SECURE CONFIG INITIALIZATION
   - Validates all localStorage reads
   - Uses safe defaults
   - Prevents prototype pollution via Object.create(null)
   ───────────────────────────────────────────────────────────────────── */
(function() {
  // Safe config defaults with no prototype pollution risk
  var safeDefaults = Object.create(null);
  safeDefaults.apiBaseUrl = '';
  safeDefaults.defaultTenantSlug = 'phmurt-studios';
  safeDefaults.cloudEnabled = false;
  safeDefaults.supabaseUrl = '';
  safeDefaults.supabaseAnonKey = '';

  // Validate and read localStorage with try/catch
  try {
    var storedUrl = localStorage.getItem('phmurt_api_base_url');
    if (typeof storedUrl === 'string' && storedUrl.length > 0 && storedUrl.length < 500) {
      // Ensure URL is safe - validate URL format and scheme
      try {
        var urlObj = new URL(storedUrl);
        if ((urlObj.protocol === 'http:' || urlObj.protocol === 'https:') && urlObj.hostname) {
          safeDefaults.apiBaseUrl = storedUrl;
        }
      } catch(urlError) { /* invalid URL, skip */ }
    }
  } catch(e) { /* ignore */ }

  try {
    var storedSlug = localStorage.getItem('phmurt_default_tenant_slug');
    if (typeof storedSlug === 'string' && (/^[a-z0-9]([a-z0-9\-]{0,98}[a-z0-9])?$/.test(storedSlug))) {
      safeDefaults.defaultTenantSlug = storedSlug;
    }
  } catch(e) { /* ignore */ }

  // Merge with existing PHMURT_CONFIG if present (whitelist approach)
  if (typeof window.PHMURT_CONFIG === 'object' && window.PHMURT_CONFIG !== null) {
    if (typeof window.PHMURT_CONFIG.cloudEnabled === 'boolean') {
      safeDefaults.cloudEnabled = window.PHMURT_CONFIG.cloudEnabled;
    }
    if (typeof window.PHMURT_CONFIG.supabaseUrl === 'string' && window.PHMURT_CONFIG.supabaseUrl.length > 0 && window.PHMURT_CONFIG.supabaseUrl.length < 500) {
      safeDefaults.supabaseUrl = window.PHMURT_CONFIG.supabaseUrl;
    }
    if (typeof window.PHMURT_CONFIG.supabaseAnonKey === 'string' && window.PHMURT_CONFIG.supabaseAnonKey.length > 0 && window.PHMURT_CONFIG.supabaseAnonKey.length < 500) {
      safeDefaults.supabaseAnonKey = window.PHMURT_CONFIG.supabaseAnonKey;
    }
  }

  window.PHMURT_CONFIG = safeDefaults;
})();
