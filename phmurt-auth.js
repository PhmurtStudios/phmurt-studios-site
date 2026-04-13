/* ═══════════════════════════════════════════════════════════════════
   PHMURT AUTH  –  Auth + Cloud Data Layer  v3
   ═══════════════════════════════════════════════════════════════════
   Powered by Supabase when configured (supabase-config.js filled in).
   Falls back to local-storage + cookie auth when offline / unconfigured.

   CRITICAL SECURITY NOTE — Client-Side Session is a Cache Only:
   ────────────────────────────────────────────────────────────────
   The session object returned by getSession() includes subscription status
   (isSubscribed, subscriptionTier, subscriptionExpires). This is a CLIENT-SIDE
   CACHE populated from the profiles table. It is NOT authoritative.

   For pro feature access:
   1. Use session.isSubscribed for UI/UX only (enable buttons, show modals)
   2. Server-side RLS policies must ALWAYS verify:
      - subscription_tier IN ('pro', 'party', 'lifetime')
      - subscription_status == 'active'
      - subscription_expires_at > now() (or NULL for lifetime subscriptions)
      - is_banned == false
   3. Webhook (stripe-webhook/index.ts) is the source of truth for status

   A subscription can be:
   - Canceled/banned after local session loads (webhook propagates the change)
   - In flight during checkout (webhook may not have fired yet)
   - Expired server-side while session is still cached client-side

   Never grant pro features based on session.isSubscribed without
   server-side verification.

   Public API (PhmurtDB):
     .getSession()                        → session | null  (sync; cache only for subscriptions)
     .isAdmin()                           → bool
     .signUp(name, email, password)       → Promise<session>
     .signIn(email, password)             → Promise<session>
     .signOut()
     .onAuthStateChange(fn)
     .db()                                → Supabase client | null
     .saveCharacter(snapshot, existingId) → Promise<{success,id}>
     .loadCharacter(id)                   → Promise<data|null>
     .getCharacters()                     → Promise<array>
     .deleteCharacter(id)                 → Promise<bool>
     .saveCampaign(campaign)              → Promise<bool>
     .getCampaigns()                      → Promise<array>
     .deleteCampaign(id)                  → Promise<bool>
    .saveUserSyncBlob(blob)              → Promise<{success,error?}>
    .loadUserSyncBlob()                  → Promise<object|null>
     .openAuth()                          → void
   ═══════════════════════════════════════════════════════════════════ */
var PhmurtDB = (function () {

  /* ── Config ──────────────────────────────────────────────────────── */
  /* ── State ───────────────────────────────────────────────────────── */
  var _session   = null;
  var _listeners = [];

  // SECURITY (V-012): Session nonce to mitigate CSRF in state-changing operations
  var _csrfNonce = '';
  try {
    var arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    _csrfNonce = Array.from(arr, function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  } catch(e) { _csrfNonce = Math.random().toString(36).slice(2); }

  // SECURITY: Rate limiting in closure scope (inaccessible from console)
  var _signInAttempts = [];

  /* ── Supabase ref ────────────────────────────────────────────────── */
  function _sb() {
    return (typeof phmurtSupabase !== 'undefined' && phmurtSupabase) ? phmurtSupabase : null;
  }

  /* ── Session factory ─────────────────────────────────────────────── */
  // CRITICAL FIX (V-056): Track profile fetch version to prevent race conditions
  // when rapid auth state changes occur. Each auth state change increments this
  // counter, and profile fetch only updates _session if its version is still current.
  var _profileFetchVersion = 0;

  function _isAdmin(profileFlag) {
    return !!profileFlag;
  }

  function _makeSession(user, profile) {
    // SECURITY: Validate user object has required fields
    if (!user || !user.id) return null;
    var name = (profile && profile.name)
      || (user.user_metadata && user.user_metadata.name)
      || (user.email || 'Adventurer').split('@')[0];
    var tier = (profile && profile.subscription_tier) || 'free';
    var subStatus = (profile && profile.subscription_status) || null;
    // SECURITY: Check if subscription is still valid (not expired)
    // NOTE: This is a client-side check only. Server must always verify subscription status
    // before granting pro features. Never trust client-side isSubscribed flag alone.
    var subExpires = profile && profile.subscription_expires_at ? new Date(profile.subscription_expires_at) : null;
    // UPDATED: Support 'pro', 'party', and 'lifetime' tiers
    // Lifetime subscriptions are never treated as expired
    // SECURITY: Require 'active' status (not 'pending' or other statuses)
    var isSubscribed = (tier === 'pro' || tier === 'party' || tier === 'lifetime')
      && subStatus === 'active'
      && (tier === 'lifetime' || !subExpires || subExpires > new Date());
    return {
      userId:              user.id,
      user:                user.id,   // Alias so sess.user works (e.g. pricing.html)
      name:                name,
      email:               user.email || '',
      displayName:         name,
      isAdmin:             _isAdmin(profile && profile.is_admin),
      isSuperuser:         !!(profile && profile.is_superuser),
      isBanned:            !!(profile && profile.is_banned),
      isBetaUser:          !!(profile && profile.is_beta_user),
      tier:                tier,  // NEW: Expose actual tier string for feature gating
      subscriptionTier:    isSubscribed ? tier : 'free',
      isSubscribed:        isSubscribed,
      isLifetime:          tier === 'lifetime' && isSubscribed,
      hasAllContentAccess: tier === 'lifetime' && isSubscribed, // Lifetime members get all content (free + premium, past + future)
      subscriptionExpires: subExpires ? subExpires.toISOString() : null,
      subscriptionCancelAt: (profile && profile.subscription_cancel_at) || null,
    };
  }

  /* ── Subscription limit checker ───────────────────────────────────
     Counts the user's existing records and compares against the
     configured limit for their subscription tier. Returns:
       { blocked: false } or { blocked: true, message: '...', limit: N, current: N }
  ────────────────────────────────────────────────────────────────── */
  var _limitCache = {};  // Cache settings for 60 seconds
  var _limitCacheTime = 0;

  function _fetchLimits() {
    var now = Date.now();
    if (_limitCache && _limitCacheTime && (now - _limitCacheTime) < 60000) {
      return Promise.resolve(_limitCache);
    }
    var sb = _sb();
    if (!sb) return Promise.resolve({});
    return sb.from('site_settings')
      .select('key, value')
      .in('key', [
        'free_max_characters', 'free_max_campaigns', 'paid_max_characters', 'paid_max_campaigns',
        'pro_price_monthly', 'pro_price_yearly', 'pro_price_yearly_savings',
        'free_tier_features', 'free_tier_locked', 'pro_tier_features',
        'free_feature_keys',
      ])
      .then(function (r) {
        var map = {};
        (r.data || []).forEach(function (s) {
          try { map[s.key] = JSON.parse(s.value); } catch (e) { map[s.key] = s.value; }
        });
        _limitCache = map;
        _limitCacheTime = Date.now();
        return map;
      })
      .catch(function () {
        // SECURITY: Return restrictive defaults if settings can't be fetched
        // This ensures limits are enforced even if the settings query fails
        return { free_max_characters: 3, free_max_campaigns: 1, paid_max_characters: -1, paid_max_campaigns: -1 };
      });
  }

  function _checkLimit(table, freeKey, paidKey) {
    var sb = _sb();
    if (!sb || !_session) return Promise.resolve({ blocked: false });

    // Admins bypass limits
    if (_session.isAdmin || _session.isSuperuser) return Promise.resolve({ blocked: false });

    return _fetchLimits().then(function (limits) {
      // NOTE: Uses cached session.isSubscribed. Server-side database triggers are the real enforcement.
      // If a subscription was recently canceled, the webhook may not have fired yet, so this might
      // allow a save that the server will reject. That's OK — server RLS is authoritative.
      var limitKey = _session.isSubscribed ? paidKey : freeKey;
      var maxCount = limits[limitKey];
      if (maxCount === undefined || maxCount === null) maxCount = _session.isSubscribed ? -1 : 3;
      maxCount = parseInt(maxCount, 10);
      if (maxCount < 0) return { blocked: false }; // -1 = unlimited

      // Count current records
      return sb.from(table).select('id', { count: 'exact' })
        .eq('owner_id', _session.userId).limit(0)
        .then(function (r) {
          var current = r.count || 0;
          if (current >= maxCount) {
            var typeLabel = table === 'characters' ? 'characters' : 'campaigns';
            var result = {
              blocked: true,
              message: 'You\'ve reached the maximum of ' + maxCount + ' ' + typeLabel + ' on the free plan. Upgrade to Phmurt Studios Pro for unlimited ' + typeLabel + '!',
              table: table,
              limit: maxCount,
              current: current
            };
            // Fire event so the upgrade banner can appear
            try { window.dispatchEvent(new CustomEvent('phmurt-limit-reached', { detail: result })); } catch (e) { /* Event dispatch may fail silently */ }
            return result;
          }
          return { blocked: false, limit: maxCount, current: current };
        })
        .catch(function (err) {
          // Client-side limit check failed — log it but allow the save to proceed.
          // The server-side DB trigger (enforce_character_limit / enforce_campaign_limit)
          // is the real security boundary and will reject over-limit inserts.
          console.warn('[PhmurtAuth] Client limit check failed, deferring to server:', err);
          return { blocked: false };
        });
    });
  }

  function _fireChange() {
    _listeners.forEach(function (fn) {
      try {
        fn();
      } catch (e) {
        if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Listener error:', e.message || e);
      }
    });
    window.dispatchEvent(new Event('phmurt-auth-change'));
  }

  /* ── Profile fetch ───────────────────────────────────────────────── */
  function _fetchProfile(userId) {
    var sb = _sb();
    if (!sb) return Promise.resolve(null);
    return sb.from('profiles').select('*').eq('id', userId).maybeSingle()
      .then(function (r) { return r.data || null; })
      .catch(function (err) {
        if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Failed to fetch profile:', err ? err.message : 'Unknown error');
        return null;
      });
  }

  /* ══════════════════════════════════════════════════════════════════
     SUPABASE INIT
  ══════════════════════════════════════════════════════════════════ */
  function _runSupabaseInit(sb) {
    // Pre-warm tier config cache so getTierConfig() and isFeatureAvailable() have data
    _fetchLimits().catch(function () { /* best effort */ });

    sb.auth.getSession().then(function (r) {
      var sess = r.data && r.data.session;
      if (sess && sess.user) {
        return _fetchProfile(sess.user.id).then(function (profile) {
          // SECURITY: Ensure profile exists before passing to _makeSession
          if (sess.user) {
            var session = _makeSession(sess.user, profile || null);
            if (session) {
              _session = session;
              _fireChange();
              // CRITICAL FIX (V-057): Persist Supabase session to localStorage so other tabs can sync
              _lsSet(LS_SESSION, session);
            }
          }
        });
      }
      // No Supabase session — reinforce legacy session (may already be set)
      if (!_session) _initLegacy();
    }).catch(function (err) {
      if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Supabase init failed:', err ? err.message : 'Unknown error');
      if (!_session) _initLegacy();
    });

    sb.auth.onAuthStateChange(function (event, sess) {
      if (sess && sess.user) {
        // CRITICAL FIX (V-056): Capture version at time of auth event
        var thisVersion = ++_profileFetchVersion;
        _fetchProfile(sess.user.id).then(function (profile) {
          // Only apply this result if no newer auth events have occurred
          if (_profileFetchVersion !== thisVersion) {
            if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] onAuthStateChange stale profile fetch ignored (newer event occurred)');
            return;
          }
          var session = _makeSession(sess.user, profile);
          if (session) {
            _session = session;
            _fireChange();
            // CRITICAL FIX (V-057): Persist to localStorage for cross-tab sync
            _lsSet(LS_SESSION, session);
          }
        }).catch(function (err) {
          if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] onAuthStateChange profile fetch failed:', err ? err.message : 'Unknown error');
        });
      } else if (event === 'SIGNED_OUT') {
        // CRITICAL FIX (V-056): Invalidate any pending profile fetches
        _profileFetchVersion++;
        // Only clear session on explicit sign-out, not on initial load
        // with no Supabase session (which would wipe the legacy session)
        _session = null;
        _fireChange();
        // CRITICAL FIX (V-057): Clear localStorage to trigger cross-tab sync
        _legacySetSession(null);
      }
      // Ignore INITIAL_SESSION with no session — don't wipe legacy session
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     LEGACY LOCAL-STORAGE FALLBACK
     NOTE: These vars MUST be declared before _initSupabase runs,
     because _initLegacy() reads LS_SESSION via _legacyGetSession().
  ══════════════════════════════════════════════════════════════════ */
  var LS_SESSION = 'phmurt_auth_session';
  var LS_USERS   = 'phmurt_users_db';
  var CK_SESSION = 'phmurt_sess';
  var CK_USERS   = 'phmurt_udb';

  (function _initSupabase() {
    // ALWAYS try legacy session first (synchronous, instant).
    // This guarantees _session is populated before any page script
    // calls getSession(), regardless of Supabase async timing.
    _initLegacy();

    var sb = _sb();
    if (!sb) {
      /* CDN may still be loading — wait for it and upgrade to cloud auth */
      if (typeof SUPABASE_URL !== 'undefined' && SUPABASE_URL &&
          typeof SUPABASE_ANON_KEY !== 'undefined' && SUPABASE_ANON_KEY) {
        window.addEventListener('phmurt-supabase-ready', function () {
          var sb2 = _sb();
          if (!sb2) return;
          _runSupabaseInit(sb2);
        }, { once: true });
      }
      return;
    }
    _runSupabaseInit(sb);
  })();

  function _setCk(n, v, d) {
    try {
      var e = d ? '; expires=' + (function () { var x = new Date(); x.setTime(x.getTime() + d * 864e5); return x.toUTCString(); }()) : '';
      document.cookie = n + '=' + encodeURIComponent(v || '') + e + '; path=/; SameSite=Strict; Secure';
    } catch (err) {
      if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Failed to set cookie:', err.message || err);
    }
  }
  function _getCk(n) {
    try {
      var p = n + '=', parts = document.cookie.split(';');
      for (var i = 0; i < parts.length; i++) {
        var c = parts[i].replace(/^\s+/, '');
        if (c.indexOf(p) === 0) return decodeURIComponent(c.substring(p.length));
      }
    } catch (err) {
      if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Failed to read cookie:', err.message || err);
    }
    return null;
  }
  function _delCk(n) { _setCk(n, '', -1); }

  function _lsGet(key) {
    try {
      var r = localStorage.getItem(key);
      if (r) {
        var parsed = JSON.parse(r);
        // SECURITY: Validate parsed data is an object/array, not a primitive or code
        if (parsed !== null && typeof parsed === 'object') return parsed;
        return null;
      }
    } catch (err) {
      if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Failed to read localStorage:', err.message || err);
    }
    return null;
  }
  function _lsSet(key, val) {
    try {
      localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
    } catch (err) {
      if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Failed to write localStorage:', err.message || err);
    }
  }

  function _legacyGetSession() {
    var s = _lsGet(LS_SESSION);
    if (s && s.userId) return s;
    try {
      var cr = _getCk(CK_SESSION);
      if (cr) {
        try {
          var cp = JSON.parse(cr);
          // SECURITY (V-013): Validate session object structure before use
          if (cp && typeof cp === 'object' && cp.userId && typeof cp.userId === 'string' && cp.email && typeof cp.email === 'string') {
            _lsSet(LS_SESSION, cp);
            return cp;
          }
        } catch (parseErr) {
          if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Failed to parse session cookie:', parseErr.message || parseErr);
        }
      }
    } catch (err) {
      if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Error getting legacy session:', err.message || err);
    }
    return null;
  }
  // SECURITY (V-004): Legacy sessions must NEVER have isAdmin=true.
  // Admin status is only valid when verified through Supabase profile.
  function _legacySetSession(data) {
    if (data) {
      // Strip isAdmin from legacy sessions as a safety measure
      if (data.isAdmin) data = Object.assign({}, data, { isAdmin: false });
      var j = JSON.stringify(data);
      _lsSet(LS_SESSION, j);
      _setCk(CK_SESSION, j, 30);
    } else {
      try {
        localStorage.removeItem(LS_SESSION);
      } catch (err) {
        if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Failed to remove session:', err.message || err);
      }
      _delCk(CK_SESSION);
    }
  }
  function _legacyGetUsers() {
    var u = _lsGet(LS_USERS);
    if (u && typeof u === 'object' && !Array.isArray(u)) return u;
    try {
      var cr = _getCk(CK_USERS);
      if (cr) {
        try {
          var cp = JSON.parse(cr);
          // SECURITY (V-014): Ensure users object is a plain object, not array or other type
          if (cp && typeof cp === 'object' && !Array.isArray(cp)) {
            _lsSet(LS_USERS, cp);
            return cp;
          }
        } catch (parseErr) {
          if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Failed to parse users cookie:', parseErr.message || parseErr);
        }
      }
    } catch (err) {
      if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Error getting legacy users:', err.message || err);
    }
    return {};
  }
  function _legacySaveUsers(users) {
    _lsSet(LS_USERS, users);
    var j = JSON.stringify(users);
    if (j.length <= 3584) _setCk(CK_USERS, j, 365);
  }
  function _legacyHashPwd(pwd, email) {
    // SECURITY: Use email as a per-user salt to prevent rainbow tables
    // This is still client-side only and should not be relied upon for production.
    // The real security is Supabase JWT + server-side auth.
    var salt = email.toLowerCase();
    var iterations = 1000; // Multiple iterations to slow down brute force
    var input = '';
    for (var i = 0; i < iterations; i++) {
      input += (pwd + ':' + salt);
    }
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
      .then(function (h) { return Array.from(new Uint8Array(h)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join(''); });
  }
  function _uid() {
    var arr = new Uint8Array(8);
    crypto.getRandomValues(arr);
    var hex = Array.from(arr).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
    return 'user_' + Date.now().toString(36) + '_' + hex;
  }

  function _initLegacy() {
    var s = _legacyGetSession();
    if (s) {
      // Ensure legacy sessions have consistent subscription fields
      if (s.tier === undefined) s.tier = 'free';
      if (s.subscriptionTier === undefined) s.subscriptionTier = 'free';
      if (s.isSubscribed === undefined) s.isSubscribed = false;
      if (s.subscriptionExpires === undefined) s.subscriptionExpires = null;
      if (s.subscriptionCancelAt === undefined) s.subscriptionCancelAt = null;
      if (s.isBanned === undefined) s.isBanned = false;
      if (s.isBetaUser === undefined) s.isBetaUser = false;
      _session = s; _fireChange();
    }
  }

  /* Legacy character helpers */
  function _legacyCharKey() { return _session ? 'phmurt_characters_' + _session.userId : null; }
  function _legacyGetChars() { var k = _legacyCharKey(); return k ? (_lsGet(k) || []) : []; }
  function _legacySaveChars(ch) { var k = _legacyCharKey(); if (k) _lsSet(k, ch); }

  /* Legacy campaign helpers */
  function _legacyCampKey() { return _session ? 'phmurt_campaigns_' + _session.userId : null; }
  function _legacyGetCamps() { var k = _legacyCampKey(); return k ? (_lsGet(k) || []) : []; }
  function _legacySaveCamps(c) { var k = _legacyCampKey(); if (k) _lsSet(k, c); }

  function _legacySaveCampLocal(campaign) {
    try {
      var camps = _legacyGetCamps();
      var found = false;
      for (var i = 0; i < camps.length; i++) {
        if (camps[i].id === campaign.id) { camps[i] = campaign; found = true; break; }
      }
      if (!found) camps.push(campaign);
      _legacySaveCamps(camps);
    } catch (e) { /* Legacy localStorage may not be available */ }
  }

  function _legacyDeleteCampLocal(id) {
    try {
      var camps = _legacyGetCamps();
      camps = camps.filter(function (c) { return c.id !== id; });
      _legacySaveCamps(camps);
    } catch (e) { /* Legacy localStorage may not be available */ }
  }

  /* ── Re-authentication prompt for legacy sessions ────────────────
     When a user has a legacy localStorage session but no Supabase JWT,
     we show a password prompt inline so they can subscribe without
     having to sign out first.
  ─────────────────────────────────────────────────────────────────── */
  function _showReauthPrompt(sb, returnUrl, interval) {
    return new Promise(function (resolve, reject) {
      // Remove any existing reauth modal
      var old = document.getElementById('phmurt-reauth-overlay');
      if (old) old.remove();

      var userEmail = _session ? _session.email : '';

      var overlay = document.createElement('div');
      overlay.id = 'phmurt-reauth-overlay';
      overlay.className = 'phmurt-upgrade-overlay';
      // SECURITY (V-050): Escape userEmail to prevent XSS
      function _esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
      overlay.innerHTML =
        '<div class="phmurt-upgrade-modal">' +
          '<div class="upgrade-glow"></div>' +
          '<div class="upgrade-body">' +
            '<button class="upgrade-close" id="phmurt-reauth-close">&times;</button>' +
            '<div class="upgrade-icon">&#128274;</div>' +
            '<h2 class="upgrade-title">Sign In to Subscribe</h2>' +
            '<p class="upgrade-text">We need to verify your identity for <strong>' + _esc(userEmail || 'your account') + '</strong> before processing payment.</p>' +
            '<input type="password" id="phmurt-reauth-pw" placeholder="Password" ' +
              'style="width:100%;padding:12px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(212,67,58,0.2);border-radius:4px;color:#f5ede0;font-family:Spectral,serif;font-size:14px;margin-bottom:16px;text-align:center;outline:none;" />' +
            '<p id="phmurt-reauth-err" style="color:#ef4444;font-size:12px;margin:0 0 12px;display:none;"></p>' +
            '<button class="upgrade-btn" id="phmurt-reauth-submit" style="width:100%;">Continue to Checkout</button>' +
            '<div style="display:flex;align-items:center;gap:12px;margin:18px 0 14px;">' +
              '<div style="flex:1;height:1px;background:rgba(212,67,58,0.15);"></div>' +
              '<span style="color:#5a5046;font-family:Spectral,serif;font-size:12px;">or</span>' +
              '<div style="flex:1;height:1px;background:rgba(212,67,58,0.15);"></div>' +
            '</div>' +
            '<button id="phmurt-reauth-magic" style="width:100%;padding:12px 14px;background:transparent;border:1px solid rgba(212,67,58,0.25);border-radius:4px;color:#d4c4a8;font-family:Cinzel,serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all 0.2s;">Email Me a Sign-In Link</button>' +
            '<p id="phmurt-reauth-magic-msg" style="color:#5ee09a;font-size:12px;margin:8px 0 0;display:none;"></p>' +
          '</div>' +
        '</div>';
      document.body.appendChild(overlay);

      var pwInput = document.getElementById('phmurt-reauth-pw');
      var errEl = document.getElementById('phmurt-reauth-err');
      var submitBtn = document.getElementById('phmurt-reauth-submit');
      // SECURITY (V-046): Validate elements exist before using them
      if (!pwInput || !errEl || !submitBtn) {
        overlay.remove();
        return reject(new Error('Modal elements not found'));
      }

      function cleanup() { overlay.remove(); }

      document.getElementById('phmurt-reauth-close').addEventListener('click', function () {
        cleanup();
        reject(new Error('Cancelled.'));
      });
      overlay.addEventListener('click', function (ev) {
        if (ev.target === overlay) { cleanup(); reject(new Error('Cancelled.')); }
      });

      function doReauth() {
        var pw = (pwInput.value || '').trim();
        if (!pw) { errEl.textContent = 'Password is required.'; errEl.style.display = 'block'; return; }
        errEl.style.display = 'none';
        submitBtn.textContent = 'Signing in…';
        submitBtn.disabled = true;

        var email = _session ? _session.email : '';
        var displayName = _session ? (_session.name || _session.displayName || 'Adventurer') : 'Adventurer';

        // Try sign-in first; if the user has no Supabase account yet,
        // auto-create one so legacy-only users can subscribe seamlessly.
        function signInOrSignUp() {
          return sb.auth.signInWithPassword({ email: email, password: pw })
            .then(function (r) {
              if (r.error) throw new Error(r.error.message);
              return r;
            })
            .catch(function (signInErr) {
              // "Invalid login credentials" can mean wrong password OR no account.
              // Try signUp — if it fails with "already registered", the password was wrong.
              if (signInErr.message && signInErr.message.indexOf('Invalid login credentials') !== -1) {
                submitBtn.textContent = 'Creating cloud account…';
                return sb.auth.signUp({
                  email: email,
                  password: pw,
                  options: { data: { name: displayName } }
                }).then(function (sr) {
                  if (sr.error) {
                    // Account already exists — the password was simply wrong.
                    if (sr.error.message && sr.error.message.indexOf('already registered') !== -1) {
                      var resetErr = new Error('Incorrect password. If you forgot it, use the reset link below.');
                      resetErr._showReset = true;
                      throw resetErr;
                    }
                    throw new Error(sr.error.message);
                  }
                  // Ensure a profiles row exists for the new user.
                  // The DB trigger handle_new_user() may create it, but
                  // we upsert as a safety net in case the trigger is missing.
                  var newUser = sr.data && sr.data.user;
                  var upsertPromise = (newUser && newUser.id)
                    ? sb.from('profiles').upsert({
                        id: newUser.id, name: displayName, email: email,
                        is_admin: false
                      }, { onConflict: 'id' }).then(function () { /* ok */ })
                        .catch(function () { /* best effort — trigger may handle it */ })
                    : Promise.resolve();
                  return upsertPromise.then(function () {
                    // If email confirmation is required, the user object may exist
                    // but session may be null. Try signing in again.
                    if (sr.data && sr.data.session) return sr;
                    return sb.auth.signInWithPassword({ email: email, password: pw })
                      .then(function (r2) {
                        if (r2.error) throw new Error(r2.error.message);
                        return r2;
                      });
                  });
                });
              }
              throw signInErr;
            });
        }

        signInOrSignUp()
          .then(function (r) {
            // Now we have a Supabase session — update internal state
            var user = r.data.user;
            return _fetchProfile(user.id).then(function (profile) {
              var session = _makeSession(user, profile);
              if (!session) throw new Error('Failed to create session.');
              _session = session;
              _fireChange();
              // Get the new token and proceed to checkout
              return sb.auth.getSession();
            });
          })
          .then(function (r) {
            var token = r.data && r.data.session && r.data.session.access_token;
            if (!token) throw new Error('Authentication failed. Please try again.');
            submitBtn.textContent = 'Starting checkout…';
            // Now proceed with the actual checkout via Supabase functions.invoke
            // Determine interval — support monthly, yearly, party_monthly, party_yearly, lifetime
            var resolvedInterval = interval;
            if (interval !== 'yearly' && interval !== 'party_monthly' && interval !== 'party_yearly' && interval !== 'lifetime') {
              resolvedInterval = 'monthly';
            }
            return sb.functions.invoke('stripe-checkout', {
              body: {
                return_url: returnUrl || window.location.href,
                interval: resolvedInterval,
              },
            }).then(function (result) {
              if (result.error) {
                // Extract the actual error message from the edge function response
                // sb.functions.invoke wraps non-2xx in a generic message; the real
                // error body is accessible via result.error.context (Response object).
                var ctx = result.error.context;
                if (ctx && typeof ctx.json === 'function') {
                  return ctx.json().then(function (body) {
                    throw new Error(body && body.error ? body.error : (result.error.message || 'Checkout request failed.'));
                  }).catch(function (parseErr) {
                    if (parseErr.message && parseErr.message !== 'Checkout request failed.' && parseErr.message !== result.error.message) throw parseErr;
                    throw new Error(result.error.message || 'Checkout request failed.');
                  });
                }
                throw new Error(result.error.message || 'Checkout request failed.');
              }
              var data = result.data;
              if (!data || !data.url) throw new Error(data && data.error ? data.error : 'No checkout URL returned from server.');
              try {
                var parsed = new URL(data.url);
                // SECURITY: Strict hostname validation — allow all *.stripe.com subdomains
                var isValidHost = parsed.hostname === 'stripe.com' ||
                                  (parsed.hostname.length > 11 && parsed.hostname.slice(-11) === '.stripe.com') ||
                                  parsed.hostname === 'www.phmurtstudios.com' ||
                                  parsed.hostname === 'phmurtstudios.com';
                if (parsed.protocol !== 'https:' || !isValidHost) {
                  throw new Error('Unexpected redirect URL.');
                }
                cleanup();
                window.location.href = data.url;
              } catch (urlErr) {
                if (urlErr.message === 'Unexpected redirect URL.') throw urlErr;
                throw new Error('Invalid response from payment server.');
              }
              resolve(data);
            });
          })
          .catch(function (err) {
            submitBtn.textContent = 'Continue to Checkout';
            submitBtn.disabled = false;
            // SECURITY: Sanitize error message to prevent XSS injection
            var errMsg = err.message || 'Sign-in failed. Please try again.';
            errEl.textContent = String(errMsg).slice(0, 200); // Truncate to prevent DOM bloat
            errEl.style.display = 'block';
            // Show password reset link when password is wrong
            if (err._showReset && !document.getElementById('phmurt-reauth-reset')) {
              var resetLink = document.createElement('a');
              resetLink.id = 'phmurt-reauth-reset';
              resetLink.href = '#';
              resetLink.textContent = 'Reset password';
              resetLink.style.cssText = 'color:#d4433a;font-size:12px;display:block;margin-top:8px;text-decoration:underline;cursor:pointer;';
              resetLink.addEventListener('click', function (ev) {
                ev.preventDefault();
                resetLink.textContent = 'Sending reset email…';
                sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password.html' })
                  .then(function () { resetLink.textContent = 'Reset email sent! Check your inbox.'; resetLink.style.color = '#5ee09a'; })
                  .catch(function (re) { resetLink.textContent = 'Could not send reset email: ' + (re.message || 'Unknown error'); });
              });
              errEl.parentNode.insertBefore(resetLink, errEl.nextSibling);
            }
            // Do NOT reject here — let the user retry by entering password again.
            // The modal stays open so they can try again or click close to cancel.
          });
      }

      submitBtn.addEventListener('click', doReauth);
      pwInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') doReauth(); });

      // Magic link sign-in button
      var magicBtn = document.getElementById('phmurt-reauth-magic');
      var magicMsg = document.getElementById('phmurt-reauth-magic-msg');
      if (magicBtn) {
        magicBtn.addEventListener('click', function () {
          if (!userEmail) {
            magicMsg.textContent = 'No email address found. Please use the password option.';
            magicMsg.style.color = '#ef4444';
            magicMsg.style.display = 'block';
            return;
          }
          magicBtn.textContent = 'Sending…';
          magicBtn.disabled = true;
          var redirectUrl = (returnUrl || window.location.href).split('?')[0];
          if (interval === 'yearly') redirectUrl += '?plan=yearly';
          else redirectUrl += '?plan=monthly';
          sb.auth.signInWithOtp({
            email: userEmail,
            options: { emailRedirectTo: redirectUrl }
          }).then(function (r) {
            if (r.error) throw new Error(r.error.message);
            // SECURITY: Escape userEmail to prevent XSS injection
          var escapedEmail = String(userEmail || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
          magicMsg.textContent = 'Check your email! Click the link we sent to ' + escapedEmail + ', then you\'ll be taken to checkout.';
            magicMsg.style.color = '#5ee09a';
            magicMsg.style.display = 'block';
            magicBtn.textContent = 'Email Sent';
          }).catch(function (e) {
            magicMsg.textContent = e.message || 'Could not send sign-in link. Please try the password option.';
            magicMsg.style.color = '#ef4444';
            magicMsg.style.display = 'block';
            magicBtn.textContent = 'Email Me a Sign-In Link';
            magicBtn.disabled = false;
          });
        });
      }

      // Focus the password field after a brief delay
      // SECURITY: Check element exists before focusing
      if (pwInput) {
        setTimeout(function () { pwInput.focus(); }, 100);
      }
    });
  }

  /* ── Cross-tab session sync ──────────────────────────────────────── */
  window.addEventListener('storage', function (e) {
    if (e.key === 'phmurt_auth_session' || e.key === 'phmurt_sb_auth') {
      // CRITICAL FIX (V-055): Re-validate _session from localStorage, don't just fire event.
      // If another tab signs out, _session remains in memory as stale data.
      // Must reload from storage to catch sign-outs.
      if (e.newValue === null) {
        // Session was deleted in another tab — clear it here too
        _session = null;
      } else {
        // Try to reload from storage (legacy or Supabase)
        var stored = _lsGet(LS_SESSION);
        if (stored && stored.userId) {
          _session = stored;
        } else {
          _session = null;
        }
      }
      window.dispatchEvent(new Event('phmurt-auth-change'));
    }
  });

  /* ── Periodic subscription status validation ──────────────────────
     CRITICAL FIX (V-058): Validate subscription status periodically (5 min)
     to catch webhook-based changes (cancellations, downgrades) that update
     the database but not the client-side session cache. Without this, users
     see stale subscription status after their Stripe subscription is canceled.
     ─────────────────────────────────────────────────────────────────── */
  (function() {
    var _lastValidationTime = 0;
    var _VALIDATION_INTERVAL = 5 * 60 * 1000; // 5 minutes

    setInterval(function() {
      var now = Date.now();
      if (now - _lastValidationTime < _VALIDATION_INTERVAL) return;
      _lastValidationTime = now;

      if (!_session || !_session.userId) return; // Not signed in
      var sb = (typeof phmurtSupabase !== 'undefined' && phmurtSupabase) ? phmurtSupabase : null;
      if (!sb) return; // Supabase not available

      // Fetch latest profile from server
      sb.from('profiles').select('subscription_tier, subscription_status, subscription_expires_at, subscription_cancel_at, is_banned')
        .eq('id', _session.userId).maybeSingle()
        .then(function(r) {
          if (!r.data) return; // User profile missing
          var profile = r.data;

          // Detect subscription changes and update session
          var oldTier = _session.tier;
          var newTier = profile.subscription_tier || 'free';
          var oldStatus = _session.isSubscribed;
          var newStatus = (newTier === 'pro' || newTier === 'party' || newTier === 'lifetime')
            && profile.subscription_status === 'active'
            && (newTier === 'lifetime' || !profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());

          if (oldTier !== newTier || oldStatus !== newStatus || (profile.is_banned && !_session.isBanned)) {
            // Subscription status changed server-side, update client session
            _session = _makeSession(_session, profile);
            _fireChange();
            _lsSet(LS_SESSION, _session);
            if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) {
              console.info('[PhmurtAuth] Subscription status refreshed from server:', { oldTier: oldTier, newTier: newTier, oldStatus: oldStatus, newStatus: newStatus });
            }
          }
        })
        .catch(function(err) {
          if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) {
            console.warn('[PhmurtAuth] Periodic subscription validation failed:', err && err.message);
          }
        });
    }, 1 * 60 * 1000); // Check every minute (but only validate every 5 min due to throttle)
  })();

  /* ══════════════════════════════════════════════════════════════════
     PUBLIC API
  ══════════════════════════════════════════════════════════════════ */
  return {

    getSession: function () {
      // Fallback: if _session is null (e.g. async init timing issue),
      // try loading from legacy localStorage on demand.
      if (!_session) {
        var s = _legacyGetSession();
        if (s) { _session = s; }
      }
      // Ensure .user alias exists (legacy sessions may lack it)
      if (_session && !_session.user && _session.userId) {
        _session.user = _session.userId;
      }
      return _session;
    },
    getCsrfNonce: function () { return _csrfNonce; },
    isAdmin:    function () { return !!(_session && _session.isAdmin); },
    db:         function () { return _sb(); },

    onAuthStateChange: function (fn) { if (typeof fn === 'function') _listeners.push(fn); },

    /* ── Force-refresh session from database ─────────────────── */
    /* Call after Stripe checkout return or any external change   */
    refreshSession: function () {
      if (!_session || !_session.userId) return Promise.reject(new Error('Not signed in.'));
      var sb = _sb();
      if (!sb) return Promise.reject(new Error('Supabase not available.'));
      return _fetchProfile(_session.userId).then(function (profile) {
        if (!profile) return _session;
        var updated = _makeSession(_session, profile);
        if (updated) {
          _session = updated;
          _fireChange();
          _lsSet(LS_SESSION, updated);
        }
        return _session;
      });
    },

    /* ── Sign Up ──────────────────────────────────────────────── */
    signUp: function (name, email, password) {
      var ne   = (email || '').trim().toLowerCase();
      var dnam = (name  || 'Adventurer').trim(); if (dnam.length > 50) dnam = dnam.slice(0, 50);
      if (!ne)       return Promise.reject(new Error('Email is required.'));
      if (!password) return Promise.reject(new Error('Password is required.'));

      var sb = _sb();
      if (sb) {
        return sb.auth.signUp({ email: ne, password: password, options: { data: { name: dnam } } })
          .then(function (r) {
            if (r.error) throw new Error(r.error.message);
            var user = r.data && r.data.user;
            if (!user) throw new Error('Sign-up failed. Please try again.');
            return sb.from('profiles').upsert({
              id: user.id, name: dnam, email: ne,
              is_admin: false
            }, { onConflict: 'id' }).then(function () {
              var sess = _makeSession(user, { name: dnam, is_admin: false });
              if (!sess) throw new Error('Failed to create session.');
              _session = sess;
              _fireChange();
              return sess;
            });
          })
          .catch(function (err) {
            if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Sign-up error:', err.message || err);
            throw err;
          });
      }

      // Legacy
      var users = _legacyGetUsers();
      if (users[ne]) return Promise.reject(new Error('An account with that email already exists.'));
      return _legacyHashPwd(password, ne).then(function (hash) {
        var u = { userId: _uid(), name: dnam, email: ne, passwordHash: hash, createdAt: new Date().toISOString() };
        users[ne] = u;
        _legacySaveUsers(users);
        var sess = { userId: u.userId, name: dnam, email: ne, displayName: dnam, isAdmin: false };
        _legacySetSession(sess);
        _session = sess;
        _fireChange();
        return sess;
      });
    },

    /* ── Sign In ──────────────────────────────────────────────── */
    signIn: function (email, password) {
      // SECURITY (V-011): Client-side rate limiting on sign-in attempts
      var now = Date.now();
      // Remove attempts older than 60 seconds - validate array hasn't been tampered
      if (!Array.isArray(_signInAttempts)) _signInAttempts = [];
      _signInAttempts = _signInAttempts.filter(function(t) {
        return typeof t === 'number' && now - t < 60000;
      });
      if (_signInAttempts.length >= 5) {
        return Promise.reject(new Error('Too many sign-in attempts. Please wait 60 seconds.'));
      }
      _signInAttempts.push(now);

      var ne = (email || '').trim().toLowerCase();
      if (!ne)       return Promise.reject(new Error('Email is required.'));
      if (!password) return Promise.reject(new Error('Password is required.'));

      var sb = _sb();
      if (sb) {
        return sb.auth.signInWithPassword({ email: ne, password: password })
          .then(function (r) {
            if (r.error) throw new Error(r.error.message);
            var user = r.data.user;
            return _fetchProfile(user.id).then(function (profile) {
              if (profile && profile.is_banned) {
                sb.auth.signOut().catch(function (err) {
                  if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Sign-out after ban check failed:', err.message || err);
                });
                throw new Error('This account has been suspended.');
              }
              var sess = _makeSession(user, profile);
              if (!sess) throw new Error('Failed to create session from user and profile.');
              _session = sess;
              _fireChange();
              return sess;
            });
          })
          .catch(function (err) {
            if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Sign-in error:', err.message || err);
            throw err;
          });
      }

      // Legacy
      var users = _legacyGetUsers();
      var u = users[ne];
      if (!u) return Promise.reject(new Error('Invalid email or password.'));
      return _legacyHashPwd(password, ne).then(function (hash) {
        // SECURITY: Constant-time comparison to prevent timing attacks (defense in depth)
        // Compare hash lengths first, then hashes; this prevents early rejection on hash length mismatch
        var hashMatch = (hash && u.passwordHash && hash.length === u.passwordHash.length);
        if (hashMatch) {
          var match = true;
          for (var i = 0; i < hash.length; i++) {
            if (hash[i] !== u.passwordHash[i]) match = false;
          }
          if (!match) throw new Error('Invalid email or password.');
        } else {
          throw new Error('Invalid email or password.');
        }
        var sess = { userId: u.userId, name: u.name, email: ne, displayName: u.name, isAdmin: false };
        _legacySetSession(sess);
        _session = sess;
        _fireChange();
        return sess;
      });
    },

    /* ── Sign Out ─────────────────────────────────────────────── */
    signOut: function () {
      var sb = _sb();
      if (sb) {
        sb.auth.signOut().catch(function (err) {
          if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Supabase sign-out failed:', err.message || err);
        });
      }
      _legacySetSession(null);
      _session = null;
      _fireChange();
    },

    /* ══════════════════════════════════════════════════════════
       CHARACTERS
    ══════════════════════════════════════════════════════════ */

    /* saveCharacter(snapshot, existingId?) → Promise<{success,id}> */
    saveCharacter: function (snapshot, existingId) {
      if (!_session) return Promise.resolve({ success: false, error: 'Not signed in.' });

      // SECURITY (V-015): Input validation
      var name = snapshot && snapshot.name ? String(snapshot.name).slice(0, 100) : 'Unnamed';
      var race = snapshot && snapshot.race ? String(snapshot.race).slice(0, 50) : '';
      var cls = snapshot && (snapshot.class || snapshot.cls) ? String(snapshot.class || snapshot.cls).slice(0, 50) : '';
      var level = snapshot && snapshot.level ? Math.min(Math.max(1, parseInt(snapshot.level, 10) || 1), 30) : 1;

      var sb = _sb();
      if (sb) {
        // SECURITY (V-040): Determine edition from snapshot.edition first, then snapshot.builderType, then fallback
        // to heuristic checking for edition-specific fields
        var builder = '5e';
        if (snapshot && snapshot.edition === '3.5') {
          builder = '35e';
        } else if (existingId && snapshot && snapshot.builderType) {
          builder = snapshot.builderType;
        } else if (!existingId && snapshot) {
          // For new characters, prefer edition field, then check for 3.5e-specific fields
          if (snapshot.edition === '3.5') {
            builder = '35e';
          } else if (snapshot.alignment && !snapshot.background) {
            // 3.5e has alignment field, 5e doesn't (in initial create)
            builder = '35e';
          } else {
            builder = '5e';
          }
        }

        var row = {
          owner_id:     _session.userId,
          name:         name,
          race:         race,
          class:        cls,
          level:        level,
          builder_type: builder,
          data:         snapshot,
          updated_at:   new Date().toISOString()
        };

        // ── Subscription limit check (only for NEW characters) ────
        // A character is "new" if there's no existingId, or if the ID is a legacy
        // numeric localStorage ID (not a UUID). UUIDs contain hyphens/letters.
        var isNewCharacter = !existingId;
        var safeId = existingId ? String(existingId).trim() : null;

        if (isNewCharacter) {
          // Create new character with limit check
          return _checkLimit('characters', 'free_max_characters', 'paid_max_characters').then(function (limitResult) {
            if (limitResult.blocked) {
              return { success: false, error: limitResult.message, limitReached: true };
            }
            return sb.from('characters').insert(row).select('id').single()
              .then(function (r) {
                if (r.error) throw r.error;
                return { success: true, id: r.data.id };
              })
              .catch(function (e) { return { success: false, error: e.message }; });
          });
        }

        // Update existing character
        if (!safeId) return Promise.resolve({ success: false, error: 'Invalid character ID.' });
        return sb.from('characters').update(row)
          .eq('id', safeId).eq('owner_id', _session.userId)
          .select('id').single()
          .then(function (r) {
            if (r.error) throw r.error;
            return { success: true, id: r.data.id };
          })
          .catch(function (e) {
            // If update failed, log the reason then try insert (for legacy ID migration)
            console.warn('[PhmurtDB] Update failed for character ' + safeId + ':', e.message || e);
            return _checkLimit('characters', 'free_max_characters', 'paid_max_characters').then(function (limitResult) {
              if (limitResult.blocked) {
                return { success: false, error: limitResult.message, limitReached: true };
              }
              return sb.from('characters').insert(row).select('id').single()
                .then(function (r2) {
                  if (r2.error) return { success: false, error: r2.error.message || 'Insert failed after update miss.' };
                  if (!r2.data) return { success: false, error: 'No data returned from insert.' };
                  return { success: true, id: r2.data.id };
                })
                .catch(function (e2) { return { success: false, error: e2.message || 'Fallback insert failed.' }; });
            });
          });
      }

      // Legacy localStorage
      try {
        var dataStr = JSON.stringify(snapshot);
        if (dataStr.length > 2000000) return Promise.resolve({ success: false, error: 'Character data too large.' });

        var chars = _legacyGetChars();
        var idx   = (existingId !== undefined && existingId !== null) ? parseInt(existingId, 10) : NaN;
        var entry = {
          id:    isNaN(idx) ? Date.now().toString() : existingId,
          name:  name,
          race:  race,
          class: cls,
          level: level,
          data:  snapshot
        };
        if (!isNaN(idx) && idx >= 0 && idx < chars.length) {
          chars[idx] = entry;
        } else {
          chars.push(entry);
          idx = chars.length - 1;
        }
        _legacySaveChars(chars);
        return Promise.resolve({ success: true, id: idx.toString() });
      } catch (e) {
        return Promise.resolve({ success: false, error: e.message });
      }
    },

    /* loadCharacter(id) → Promise<data|null> */
    loadCharacter: function (id) {
      if (!_session) return Promise.resolve(null);

      var sb = _sb();
      if (sb && !/^\d+$/.test(id)) {
        return sb.from('characters').select('data')
          .eq('id', id).eq('owner_id', _session.userId).maybeSingle()
          .then(function (r) { return r.data ? r.data.data : null; })
          .catch(function () { return null; });
      }

      // Legacy
      var chars = _legacyGetChars();
      var idx   = parseInt(id, 10);
      return Promise.resolve((chars[idx] && chars[idx].data) || null);
    },

    /* getCharacters() → Promise<array> */
    getCharacters: function () {
      if (!_session) return Promise.resolve([]);

      var sb = _sb();
      if (sb) {
        return sb.from('characters')
          .select('id, name, race, class, level, builder_type, created_at, updated_at')
          .eq('owner_id', _session.userId)
          .order('updated_at', { ascending: false })
          .then(function (r) { return r.data || []; })
          .catch(function () { return _legacyGetChars(); });
      }
      return Promise.resolve(_legacyGetChars());
    },

    /* deleteCharacter(id) → Promise<bool> */
    deleteCharacter: function (id) {
      if (!_session) return Promise.resolve(false);

      var sb = _sb();
      if (sb && !/^\d+$/.test(id)) {
        return sb.from('characters').delete()
          .eq('id', id).eq('owner_id', _session.userId)
          .then(function (r) { return !r.error; })
          .catch(function () { return false; });
      }

      // Legacy
      var chars = _legacyGetChars();
      var idx   = parseInt(id, 10);
      if (!isNaN(idx) && idx >= 0 && idx < chars.length) {
        chars.splice(idx, 1);
        _legacySaveChars(chars);
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    },

    /* ══════════════════════════════════════════════════════════
       CAMPAIGNS
    ══════════════════════════════════════════════════════════ */

    /* saveCampaign(campaign) → Promise<bool> */
    saveCampaign: function (campaign) {
      if (!_session) return Promise.resolve(false);
      var sb = _sb();
      if (sb) {
        // SECURITY (V-026): Validate campaign data size
        var dataStr = JSON.stringify(campaign);
        if (dataStr.length > 5000000) return Promise.reject(new Error('Campaign data exceeds maximum size.'));

        var campRow = {
          id:          campaign.id,
          owner_id:    _session.userId,
          name:        (campaign.name || 'Unnamed Campaign').slice(0, 80),
          description: campaign.description || '',
          system:      campaign.system || '5e',
          invite_code: campaign.inviteCode || null,
          data:        campaign,
          updated_at:  new Date().toISOString()
        };

        // Check if this is a new campaign (no existing ID) or an update
        var isNew = !campaign.id;
        if (isNew) {
          return _checkLimit('campaigns', 'free_max_campaigns', 'paid_max_campaigns').then(function (limitResult) {
            if (limitResult.blocked) {
              return Promise.reject(new Error(limitResult.message));
            }
            return sb.from('campaigns').insert(campRow).select('id').single()
              .then(function (r) { if (r.error) throw r.error; campaign.id = r.data.id; return true; })
              .catch(function () { _legacySaveCampLocal(campaign); return true; });
          });
        }

        // SECURITY FIX: Use scoped update instead of upsert to prevent
        // overwriting another user's campaign if IDs collide.
        return sb.from('campaigns').update(campRow)
          .eq('id', campaign.id)
          .eq('owner_id', _session.userId)
          .then(function (r) {
            if (r.error) {
              console.warn('[Auth] Campaign update failed:', r.error.message);
              _legacySaveCampLocal(campaign);
            }
            return true;
          })
          .catch(function () {
            // Fallback: save to localStorage on cloud failure
            _legacySaveCampLocal(campaign);
            return true;
          });
      }

      // Legacy localStorage
      _legacySaveCampLocal(campaign);
      return Promise.resolve(true);
    },

    /* getCampaigns() → Promise<array of campaign objects> */
    getCampaigns: function () {
      if (!_session) return Promise.resolve([]);
      var sb = _sb();
      if (sb) {
        return sb.from('campaigns').select('id, data')
          .eq('owner_id', _session.userId)
          .order('updated_at', { ascending: false })
          .then(function (r) {
            return (r.data || []).map(function (row) {
              var campaign = row.data || {};
              if (!campaign.id && row.id) campaign.id = row.id;
              return campaign;
            });
          })
          .catch(function () { return _legacyGetCamps(); });
      }
      return Promise.resolve(_legacyGetCamps());
    },

    /* deleteCampaign(id) → Promise<bool> */
    deleteCampaign: function (id) {
      if (!_session) return Promise.resolve(false);
      var sb = _sb();
      if (sb) {
        return sb.from('campaigns').delete()
          .eq('id', id).eq('owner_id', _session.userId)
          .then(function (r) { return !r.error; })
          .catch(function () {
            _legacyDeleteCampLocal(id);
            return true;
          });
      }
      _legacyDeleteCampLocal(id);
      return Promise.resolve(true);
    },

    /* ── User Sync Blob (cross-device app state) ─────────────── */
    saveUserSyncBlob: function (blob) {
      if (!_session) return Promise.resolve({ success: false, error: 'Not signed in.' });
      var sb = _sb();
      if (sb) {
        return sb.auth.getUser()
          .then(function (r) {
            var user = r.data && r.data.user;
            if (!user) throw new Error('No active user.');
            var meta = Object.assign({}, user.user_metadata || {});
            meta.phmurt_sync_blob_v1 = blob || null;
            return sb.auth.updateUser({ data: meta });
          })
          .then(function (r2) {
            if (r2.error) throw r2.error;
            return { success: true };
          })
          .catch(function (e) {
            return { success: false, error: e && e.message ? e.message : 'Sync save failed' };
          });
      }
      try {
        _lsSet('phmurt_sync_blob_' + _session.userId, blob || null);
        return Promise.resolve({ success: true });
      } catch (e2) {
        return Promise.resolve({ success: false, error: e2.message });
      }
    },

    loadUserSyncBlob: function () {
      if (!_session) return Promise.resolve(null);
      var sb = _sb();
      if (sb) {
        return sb.auth.getUser()
          .then(function (r) {
            var user = r.data && r.data.user;
            var meta = user && user.user_metadata ? user.user_metadata : {};
            return meta.phmurt_sync_blob_v1 || null;
          })
          .catch(function () { return null; });
      }
      return Promise.resolve(_lsGet('phmurt_sync_blob_' + _session.userId) || null);
    },

    /* ══════════════════════════════════════════════════════════
       AUTH MODAL
    ══════════════════════════════════════════════════════════ */
    openAuth: function () {
      if (document.getElementById('phmurtAuthModal')) return;

      var S = {
        overlay: 'position:fixed;inset:0;background:rgba(0,0,0,.75);display:flex;align-items:center;justify-content:center;z-index:10000;padding:16px;',
        card:    'background:var(--bg-card,#111010);border:1px solid var(--crimson-border,rgba(212,67,58,0.32));padding:40px 36px;max-width:420px;width:100%;border-radius:4px;position:relative;',
        title:   'font-family:Cinzel,serif;font-size:20px;font-weight:400;color:var(--text,#f5ede0);margin:0 0 6px;letter-spacing:.5px;',
        sub:     'font-family:Spectral,serif;font-size:13px;color:var(--text-muted,#8c7d6e);margin:0 0 24px;',
        tabs:    'display:flex;border-bottom:1px solid var(--border,rgba(255,255,255,0.09));margin-bottom:24px;',
        tab:     'font-family:Cinzel,serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;padding:8px 16px;cursor:pointer;border:none;background:transparent;border-bottom:2px solid transparent;margin-bottom:-1px;transition:color .15s,border-color .15s;',
        tabOn:   'color:var(--crimson,#d4433a);border-bottom-color:var(--crimson,#d4433a);',
        tabOff:  'color:var(--text-muted,#8c7d6e);border-bottom-color:transparent;',
        label:   'font-family:Cinzel,serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted,#8c7d6e);display:block;margin-bottom:6px;',
        input:   'width:100%;padding:10px 12px;background:var(--bg-input,rgba(255,255,255,0.04));border:1px solid var(--border,rgba(255,255,255,0.09));color:var(--text,#f5ede0);font-family:Spectral,serif;font-size:14px;border-radius:3px;box-sizing:border-box;outline:none;transition:border-color .15s;',
        field:   'margin-bottom:16px;',
        btn:     'width:100%;padding:12px;background:var(--crimson,#d4433a);color:#f5f0e8;border:none;font-family:Cinzel,serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border-radius:3px;margin-top:8px;transition:background .15s;',
        err:     'font-family:Spectral,serif;font-size:13px;color:var(--crimson,#d4433a);background:rgba(212,67,58,0.1);border-radius:3px;padding:10px 12px;margin-bottom:16px;display:none;',
        note:    'font-family:Spectral,serif;font-size:12px;color:var(--text-muted,#8c7d6e);margin-top:14px;text-align:center;',
        close:   'position:absolute;top:14px;right:16px;background:transparent;border:none;color:var(--text-muted,#8c7d6e);font-size:20px;cursor:pointer;line-height:1;padding:4px 8px;'
      };

      var modal = document.createElement('div');
      modal.id = 'phmurtAuthModal';
      modal.style.cssText = S.overlay;

      var usingSupabase = !!_sb();
      var subtext = usingSupabase
        ? 'Sign in to access your account from any device.'
        : 'Sign in to access your account and saved characters.';

      modal.innerHTML =
        '<div style="' + S.card + '">' +
          '<button id="pa-close" style="' + S.close + '" aria-label="Close">✕</button>' +
          '<h3 style="' + S.title + '">Phmurt Studios</h3>' +
          '<p style="' + S.sub + '">' + subtext + '</p>' +
          '<div style="' + S.tabs + '">' +
            '<button id="pa-tab-in" style="' + S.tab + S.tabOn  + '" data-tab="in">Sign In</button>' +
            '<button id="pa-tab-up" style="' + S.tab + S.tabOff + '" data-tab="up">Create Account</button>' +
          '</div>' +
          '<div id="pa-err" style="' + S.err + '"></div>' +
          '<div id="pa-panel-in">' +
            '<div style="' + S.field + '"><label style="' + S.label + '">Email Address</label>' +
              '<input id="pa-in-email" type="email" autocomplete="email" placeholder="you@example.com" style="' + S.input + '" /></div>' +
            '<div style="' + S.field + '"><label style="' + S.label + '">Password</label>' +
              '<input id="pa-in-pass" type="password" autocomplete="current-password" placeholder="••••••••" style="' + S.input + '" /></div>' +
            '<button id="pa-in-submit" style="' + S.btn + '">Sign In</button>' +
          '</div>' +
          '<div id="pa-panel-up" style="display:none;">' +
            '<div style="' + S.field + '"><label style="' + S.label + '">Display Name</label>' +
              '<input id="pa-up-name" type="text" autocomplete="name" placeholder="Your adventurer name" style="' + S.input + '" /></div>' +
            '<div style="' + S.field + '"><label style="' + S.label + '">Email Address</label>' +
              '<input id="pa-up-email" type="email" autocomplete="email" placeholder="you@example.com" style="' + S.input + '" /></div>' +
            '<div style="' + S.field + '"><label style="' + S.label + '">Password</label>' +
              '<input id="pa-up-pass" type="password" autocomplete="new-password" placeholder="Choose a password" style="' + S.input + '" /></div>' +
            '<div style="' + S.field + '"><label style="' + S.label + '">Confirm Password</label>' +
              '<input id="pa-up-pass2" type="password" autocomplete="new-password" placeholder="Repeat your password" style="' + S.input + '" /></div>' +
            '<div style="' + S.field + 'display:flex;align-items:flex-start;gap:8px;"><input id="pa-up-age-check" type="checkbox" style="margin-top:2px;cursor:pointer;"/><label for="pa-up-age-check" style="' + S.label + 'margin-bottom:0;cursor:pointer;">I confirm I am at least 13 years of age</label></div>' +
            '<div style="' + S.field + 'display:flex;align-items:flex-start;gap:8px;"><input id="pa-up-terms-check" type="checkbox" style="margin-top:2px;cursor:pointer;"/><label for="pa-up-terms-check" style="' + S.label + 'margin-bottom:0;cursor:pointer;">I agree to the <a href=&quot;terms.html&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot; style=&quot;color:var(--crimson,#d4433a);text-decoration:underline;&quot;>Terms of Service</a> and <a href=&quot;privacy.html&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot; style=&quot;color:var(--crimson,#d4433a);text-decoration:underline;&quot;>Privacy Policy</a></label></div>' +
            '<button id="pa-up-submit" style="' + S.btn + 'opacity:0.6;cursor:not-allowed;" disabled>Create Account</button>' +
            (usingSupabase ? '<p style="' + S.note + '">A confirmation email may be sent to verify your address.</p>' : '') +
          '</div>' +
        '</div>';

      document.body.appendChild(modal);

      function showErr(msg) {
        var el = document.getElementById('pa-err');
        el.textContent = msg;
        el.style.display = msg ? 'block' : 'none';
      }
      function setLoading(id, on) {
        var b = document.getElementById(id);
        if (!b) return;
        b.disabled = on;
        b.style.opacity = on ? '0.6' : '1';
        b.style.cursor  = on ? 'wait' : 'pointer';
      }

      function switchTab(tab) {
        showErr('');
        var inP = document.getElementById('pa-panel-in');
        var upP = document.getElementById('pa-panel-up');
        var inT = document.getElementById('pa-tab-in');
        var upT = document.getElementById('pa-tab-up');
        if (tab === 'in') {
          inP.style.display = 'block'; upP.style.display = 'none';
          inT.style.cssText = S.tab + S.tabOn;  upT.style.cssText = S.tab + S.tabOff;
          document.getElementById('pa-in-email').focus();
        } else {
          inP.style.display = 'none';  upP.style.display = 'block';
          inT.style.cssText = S.tab + S.tabOff; upT.style.cssText = S.tab + S.tabOn;
          document.getElementById('pa-up-name').focus();
        }
      }

      // SECURITY (V-047): Null-check before addEventListener to prevent crashes
      var tabIn = document.getElementById('pa-tab-in');
      var tabUp = document.getElementById('pa-tab-up');
      if (tabIn) tabIn.addEventListener('click', function () { switchTab('in'); });
      if (tabUp) tabUp.addEventListener('click', function () { switchTab('up'); });

      // Handle age verification and terms consent checkboxes
      var ageCheckbox = document.getElementById('pa-up-age-check');
      var termsCheckbox = document.getElementById('pa-up-terms-check');
      var submitBtn = document.getElementById('pa-up-submit');
      if (ageCheckbox && termsCheckbox && submitBtn) {
        function updateSubmitButton() {
          if (ageCheckbox.checked && termsCheckbox.checked) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
          } else {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';
            submitBtn.style.cursor = 'not-allowed';
          }
        }
        ageCheckbox.addEventListener('change', updateSubmitButton);
        termsCheckbox.addEventListener('change', updateSubmitButton);
      }

      function closeModal() { modal.remove(); }
      // SECURITY (V-048): Null-check elements before adding listeners
      var closeBtn = document.getElementById('pa-close');
      if (closeBtn) closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
      modal.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

      var signInSubmit = document.getElementById('pa-in-submit');
      if (signInSubmit) {
        signInSubmit.addEventListener('click', function () {
          showErr('');
          var emailInput = document.getElementById('pa-in-email');
          var passInput = document.getElementById('pa-in-pass');
          if (!emailInput || !passInput) return;
          var email = emailInput.value.trim();
          var pass  = passInput.value;
          if (!email) { showErr('Please enter your email address.'); return; }
          if (!pass)  { showErr('Please enter your password.'); return; }
          setLoading('pa-in-submit', true);
          PhmurtDB.signIn(email, pass)
            .then(function () { closeModal(); })
            .catch(function (err) {
              showErr(err.message || 'Sign in failed. Please try again.');
              setLoading('pa-in-submit', false);
            });
        });
      }

      var signUpSubmit = document.getElementById('pa-up-submit');
      if (signUpSubmit) {
        signUpSubmit.addEventListener('click', function () {
          showErr('');
          var nameInput = document.getElementById('pa-up-name');
          var emailInput = document.getElementById('pa-up-email');
          var passInput = document.getElementById('pa-up-pass');
          var pass2Input = document.getElementById('pa-up-pass2');
          if (!nameInput || !emailInput || !passInput || !pass2Input) return;
          var name  = nameInput.value.trim();
          var email = emailInput.value.trim();
          var pass  = passInput.value;
          var pass2 = pass2Input.value;
          var ageCheckElem = document.getElementById('pa-up-age-check');
          var termsCheckElem = document.getElementById('pa-up-terms-check');
          if (!ageCheckElem || !termsCheckElem) return;
          var ageCheck = ageCheckElem.checked;
          var termsCheck = termsCheckElem.checked;
          if (!name)           { showErr('Please enter a display name.'); return; }
          if (!email)          { showErr('Please enter your email address.'); return; }
          if (!pass)           { showErr('Please choose a password.'); return; }
          if (pass.length < 12) { showErr('Password must be at least 12 characters.'); return; }
          if (pass !== pass2)  { showErr('Passwords do not match.'); return; }
          if (!ageCheck)       { showErr('You must confirm you are at least 13 years of age.'); return; }
          if (!termsCheck)     { showErr('You must agree to the Terms of Service and Privacy Policy.'); return; }
          setLoading('pa-up-submit', true);
          PhmurtDB.signUp(name, email, pass)
          .then(function (sess) {
            if (_sb()) {
              showErr('');
              var infoEl = document.getElementById('pa-err');
              if (infoEl) {
                infoEl.style.display = 'block';
                infoEl.style.color   = 'var(--text,#f5ede0)';
                infoEl.style.background = 'rgba(78,218,128,0.12)';
                infoEl.textContent = 'Account created! Check your email to confirm, then sign in.';
              }
              setLoading('pa-up-submit', false);
              setTimeout(function () { switchTab('in'); }, 2200);
            } else {
              closeModal();
            }
          })
          .catch(function (err) {
            showErr(err.message || 'Account creation failed. Please try again.');
            setLoading('pa-up-submit', false);
          });
        });
      }

      modal.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        var inP = document.getElementById('pa-panel-in');
        if (inP && inP.style.display !== 'none') {
          var inSubmitBtn = document.getElementById('pa-in-submit');
          if (inSubmitBtn) inSubmitBtn.click();
        } else {
          var upSubmitBtn = document.getElementById('pa-up-submit');
          if (upSubmitBtn) upSubmitBtn.click();
        }
      });

      setTimeout(function () {
        var el = document.getElementById('pa-in-email');
        if (el) el.focus();
      }, 80);
    },

    /* ── Account Deletion (GDPR compliance) ────────────────────── */
    requestAccountDeletion: function () {
      var sb = _sb();
      if (!sb || !_session) return Promise.reject(new Error('Not signed in.'));
      // Mark account for deletion in profiles table; admin or server-side process completes the deletion
      return sb.from('profiles').update({
        deletion_requested_at: new Date().toISOString(),
        is_banned: true
      }).eq('id', _session.userId)
        .then(function (r) {
          if (r.error) throw new Error(r.error.message || 'Deletion request failed.');
          // Delete user's characters and campaigns client-side
          return sb.from('characters').delete().eq('owner_id', _session.userId);
        })
        .then(function () {
          return sb.from('campaigns').delete().eq('owner_id', _session.userId);
        })
        .then(function () {
          // Sign out and clear local data
          localStorage.removeItem('phmurt_auth_session');
          localStorage.removeItem('phmurt_characters');
          localStorage.removeItem('phmurt_campaigns');
          // SECURITY: Also clear user-specific localStorage keys
          if (_session && _session.userId) {
            localStorage.removeItem('phmurt_characters_' + _session.userId);
            localStorage.removeItem('phmurt_campaigns_' + _session.userId);
            localStorage.removeItem('phmurt_sync_blob_' + _session.userId);
          }
          _session = null;
          _fireChange();
          return { success: true };
        })
        .catch(function (err) {
          if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Account deletion error:', err.message || err);
          throw err;
        });
    },

    /* ── Encounter Templates ──────────────────────────────────── */
    saveEncounterTemplate: function (campaignId, template) {
      var sb = _sb();
      if (!sb || !_session) return Promise.resolve({ success: false, error: 'Not signed in' });
      var record = {
        campaign_id: campaignId,
        owner_id:    _session.userId,
        name:        template.name,
        data:        template,
        updated_at:  new Date().toISOString()
      };
      // SECURITY: Validate template.id exists and is a string before using it
      if (template.id && typeof template.id === 'string' && !template.id.startsWith('tpl-')) {
        // Existing DB record
        // CRITICAL FIX (V-059): Check owner_id to prevent updating other users' templates
        return sb.from('encounter_templates').update(record)
          .eq('id', template.id).eq('owner_id', _session.userId)
          .then(function (r) { return { success: !r.error, error: r.error && r.error.message }; });
      }
      return sb.from('encounter_templates').insert(record).select('id').single()
        .then(function (r) {
          return { success: !r.error, id: r.data && r.data.id, error: r.error && r.error.message };
        });
    },

    getEncounterTemplates: function (campaignId) {
      var sb = _sb();
      if (!sb) return Promise.resolve([]);
      return sb.from('encounter_templates')
        .select('id, name, data, updated_at')
        .eq('campaign_id', campaignId)
        .order('updated_at', { ascending: false })
        .then(function (r) { return r.data || []; })
        .catch(function () { return []; });
    },

    deleteEncounterTemplate: function (templateId) {
      // CRITICAL FIX (V-059): Check owner_id to prevent deleting other users' templates
      if (!_session) return Promise.resolve(false);
      var sb = _sb();
      if (!sb) return Promise.resolve(false);
      return sb.from('encounter_templates').delete()
        .eq('id', templateId).eq('owner_id', _session.userId)
        .then(function (r) { return !r.error; })
        .catch(function () { return false; });
    },

    /* ── Campaign Invites ─────────────────────────────────────── */
    createInviteCode: function (campaignId) {
      var sb = _sb();
      if (!sb || !_session) return Promise.resolve(null);
      return sb.from('campaign_invites').insert({
        campaign_id: campaignId,
        owner_id:    _session.userId
      }).select('code').single()
        .then(function (r) { return r.data ? r.data.code : null; })
        .catch(function () { return null; });
    },

    joinCampaignByCode: function (code) {
      var sb = _sb();
      if (!sb) return Promise.resolve({ success: false, error: 'Not connected' });
      return sb.rpc('join_campaign_by_code', { invite_code: code })
        .then(function (r) { return r.data || { success: false, error: r.error && r.error.message }; })
        .catch(function (e) { return { success: false, error: e.message }; });
    },

    getInviteCodes: function (campaignId) {
      var sb = _sb();
      if (!sb) return Promise.resolve([]);
      return sb.from('campaign_invites')
        .select('id, code, use_count, max_uses, expires_at, created_at')
        .eq('campaign_id', campaignId)
        .order('created_at', { ascending: false })
        .then(function (r) { return r.data || []; })
        .catch(function () { return []; });
    },

    deleteInviteCode: function (inviteId) {
      // CRITICAL FIX (V-059): Check owner_id to prevent deleting other users' invite codes
      if (!_session) return Promise.resolve(false);
      var sb = _sb();
      if (!sb) return Promise.resolve(false);
      return sb.from('campaign_invites').delete()
        .eq('id', inviteId).eq('owner_id', _session.userId)
        .then(function (r) { return !r.error; })
        .catch(function () { return false; });
    },

    /* ── Campaign Members ─────────────────────────────────────── */
    getCampaignMembers: function (campaignId) {
      var sb = _sb();
      if (!sb) return Promise.resolve([]);
      // SECURITY: Server-side RLS must verify that the user owns or is a member of this campaign
      return sb.from('campaign_members')
        .select('user_id, role, joined_at, profiles(name, email)')
        .eq('campaign_id', campaignId)
        .then(function (r) { return r.data || []; })
        .catch(function () { return []; });
    },

    getMyCampaigns: function () {
      /* Returns campaigns user owns OR is a member of */
      var sb = _sb();
      if (!sb || !_session) return Promise.resolve([]);
      var userId = _session.userId;
      return Promise.all([
        // Owned campaigns
        sb.from('campaigns').select('id, data, created_at, updated_at').eq('owner_id', userId),
        // Member campaigns
        sb.from('campaign_members')
          .select('campaign_id, role, campaigns(id, data, created_at, updated_at)')
          .eq('user_id', userId)
      ]).then(function (results) {
        var owned = (results[0].data || []).map(function (c) { return Object.assign({}, c, { _role: 'dm' }); });
        var joined = (results[1].data || []).filter(function (m) { return m.campaigns; }).map(function (m) {
          return Object.assign({}, m.campaigns, { _role: m.role });
        });
        // Merge, deduplicate by id
        var seen = {};
        return owned.concat(joined).filter(function (c) {
          if (seen[c.id]) return false;
          seen[c.id] = true;
          return true;
        });
      }).catch(function () { return []; });
    },

    /* ── Storage — Map Images ─────────────────────────────────── */
    uploadMapImage: function (campaignId, file) {
      var sb = _sb();
      if (!sb || !_session) return Promise.resolve(null);
      if (!file || !file.name) return Promise.resolve({ error: 'No file provided' });
      // SECURITY: Sanitize file name - remove path separators, null bytes, and double extensions
      var safeName = String(file.name || 'file')
        .replace(/\0/g, '') // Remove null bytes
        .replace(/[\/\\]/g, '_') // Remove path separators
        .replace(/[^a-zA-Z0-9._-]/g, '_') // Only alphanumeric, dots, underscores, hyphens
        .replace(/\.\./g, '_'); // Remove double dots
      var path = _session.userId + '/' + campaignId + '/' + Date.now() + '-' + safeName;
      return sb.storage.from('map-images').upload(path, file, { upsert: false })
        .then(function (r) {
          if (r.error) { if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtDB] Map upload failed:', r.error.message); return null; }
          return sb.storage.from('map-images').createSignedUrl(path, 60 * 60 * 24 * 7) // 7-day URL
            .then(function (u) { return u.data ? u.data.signedUrl : null; });
        });
    },

    getMapImageUrl: function (path) {
      var sb = _sb();
      if (!sb) return Promise.resolve(null);
      return sb.storage.from('map-images').createSignedUrl(path, 60 * 60 * 24 * 7)
        .then(function (r) { return r.data ? r.data.signedUrl : null; });
    },

    /* ── Storage — Portraits ──────────────────────────────────── */
    uploadPortrait: function (entityId, file) {
      var sb = _sb();
      if (!sb || !_session) return Promise.resolve(null);
      if (!file || !file.name) return Promise.resolve({ error: 'No file provided' });
      // SECURITY: Sanitize file extension to prevent path traversal and double extensions
      var parts = String(file.name || 'file.jpg').split('.');
      var ext = (parts.length > 1 ? parts[parts.length - 1] : 'jpg').toLowerCase();
      // Clean extension: only lowercase alphanumeric, max 5 chars
      ext = ext.replace(/[^a-z0-9]/g, '').slice(0, 5);
      if (!ext) ext = 'jpg';
      // Validate entityId doesn't contain path separators
      var safeEntityId = String(entityId || 'entity').replace(/[\/\\]/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
      var path = _session.userId + '/' + safeEntityId + '.' + ext;
      return sb.storage.from('portraits').upload(path, file, { upsert: true })
        .then(function (r) {
          if (r.error) { if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtDB] Portrait upload failed:', r.error.message); return null; }
          return sb.storage.from('portraits').createSignedUrl(path, 60 * 60 * 24 * 30)
            .then(function (u) { return u.data ? u.data.signedUrl : null; });
        });
    },

    /* ── Subscription Management ─────────────────────────────── */
    getSubscriptionInfo: function () {
      if (!_session) return { tier: 'free', isSubscribed: false };
      return {
        tier:        _session.tier || 'free',  // UPDATED: Use actual tier from profile
        isSubscribed: !!_session.isSubscribed,
        expiresAt:   _session.subscriptionExpires || null,
        cancelAt:    _session.subscriptionCancelAt || null,
      };
    },

    checkLimit: function (table) {
      var freeKey = table === 'characters' ? 'free_max_characters' : 'free_max_campaigns';
      var paidKey = table === 'characters' ? 'paid_max_characters' : 'paid_max_campaigns';
      return _checkLimit(table, freeKey, paidKey);
    },

    startSubscription: function (returnUrl, interval) {
      if (!_session) return Promise.reject(new Error('Please sign in to subscribe.'));
      var sb = _sb();
      if (!sb) return Promise.reject(new Error('Supabase not configured.'));

      // Helper: call the checkout edge function via the Supabase client
      // (handles apikey, auth headers, and gateway validation correctly)
      function _invokeCheckout(supabaseClient) {
        // Determine interval — support monthly, yearly, party_monthly, party_yearly, lifetime
        var resolvedInterval = interval;
        if (interval !== 'yearly' && interval !== 'party_monthly' && interval !== 'party_yearly' && interval !== 'lifetime') {
          resolvedInterval = 'monthly';
        }
        return supabaseClient.functions.invoke('stripe-checkout', {
          body: {
            return_url: returnUrl || window.location.href,
            interval: resolvedInterval,
          },
        }).then(function (result) {
          if (result.error) {
            // Extract actual error from edge function response body
            var ctx = result.error.context;
            if (ctx && typeof ctx.json === 'function') {
              return ctx.json().then(function (body) {
                var err = new Error(body && body.error ? body.error : (result.error.message || 'Checkout request failed.'));
                err.status = ctx.status;
                throw err;
              }).catch(function (parseErr) {
                if (parseErr.status) throw parseErr; // re-throw if already our error
                var err = new Error(result.error.message || 'Checkout request failed.');
                err.status = ctx && ctx.status;
                throw err;
              });
            }
            var err = new Error(result.error.message || 'Checkout request failed.');
            err.status = ctx && ctx.status;
            throw err;
          }
          var data = result.data;
          if (!data || !data.url) throw new Error(data && data.error ? data.error : 'No checkout URL returned from server.');
          // SECURITY: Validate the redirect URL with strict hostname matching
          try {
            var parsed = new URL(data.url);
            // Strict hostname validation — allow all *.stripe.com subdomains
            // (checkout.stripe.com for new subs, billing.stripe.com for portal)
            var isValidHost = parsed.hostname === 'stripe.com' ||
                              (parsed.hostname.length > 11 && parsed.hostname.slice(-11) === '.stripe.com') ||
                              parsed.hostname === 'www.phmurtstudios.com' ||
                              parsed.hostname === 'phmurtstudios.com';
            if (parsed.protocol !== 'https:' || !isValidHost) {
              throw new Error('Unexpected redirect URL.');
            }
            window.location.href = data.url;
          } catch (urlErr) {
            if (urlErr.message === 'Unexpected redirect URL.') throw urlErr;
            throw new Error('Invalid response from payment server.');
          }
          return data;
        });
      }

      // Helper: client-side Stripe checkout (no JWT needed)
      // Loads Stripe.js and redirects directly to Stripe's hosted checkout page
      function _clientSideCheckout() {
        var priceId = (interval === 'yearly') ? STRIPE_PRICE_ID_YEARLY : STRIPE_PRICE_ID_MONTHLY;
        if (!priceId || typeof STRIPE_PUBLISHABLE_KEY === 'undefined' || !STRIPE_PUBLISHABLE_KEY) {
          return Promise.reject(new Error('Stripe not configured.'));
        }
        // Load Stripe.js if not already loaded (singleton guard prevents duplicate loads)
        function loadStripeJs() {
          if (window.Stripe) return Promise.resolve(window.Stripe);
          if (window._stripeLoadPromise) return window._stripeLoadPromise;
          window._stripeLoadPromise = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.onload = function () { resolve(window.Stripe); };
            script.onerror = function () { window._stripeLoadPromise = null; reject(new Error('Could not load payment system.')); };
            document.head.appendChild(script);
          });
          return window._stripeLoadPromise;
        }
        // SECURITY: Validate returnUrl before using it
        var baseUrl = 'https://phmurtstudios.com'; // safe default
        try {
          var candidate = (returnUrl || window.location.href).split('?')[0];
          var parsed = new URL(candidate);
          if (parsed.protocol === 'https:' && (parsed.hostname === 'phmurtstudios.com' || parsed.hostname === 'www.phmurtstudios.com')) {
            baseUrl = candidate;
          }
        } catch (e) { /* use default */ }
        return loadStripeJs().then(function (StripeFactory) {
          var stripe = StripeFactory(STRIPE_PUBLISHABLE_KEY);
          return stripe.redirectToCheckout({
            lineItems: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            successUrl: baseUrl + '?subscription=success',
            cancelUrl: baseUrl + '?subscription=canceled',
            customerEmail: _session.email || '',
            clientReferenceId: _session.userId || _session.id || ''
          });
        }).then(function (result) {
          // redirectToCheckout returns only if there was an error (success = browser redirect)
          if (result && result.error) throw new Error(result.error.message);
        }).catch(function (stripeErr) {
          console.error('[PhmurtAuth] Stripe checkout error:', stripeErr && stripeErr.message || stripeErr);
          throw stripeErr;
        });
      }

      var _self = this;
      return sb.auth.getSession().then(function (r) {
        var token = r.data && r.data.session && r.data.session.access_token;
        if (!token) {
          // No token — try a silent refresh before falling back to re-auth prompt
          return sb.auth.refreshSession().then(function (ref) {
            var refreshedToken = ref.data && ref.data.session && ref.data.session.access_token;
            if (!refreshedToken) {
              return _showReauthPrompt(sb, returnUrl, interval);
            }
            // Refresh succeeded — proceed to checkout
            return _invokeCheckout(sb);
          }).catch(function () {
            return _showReauthPrompt(sb, returnUrl, interval);
          });
        }

        // Try checkout; on failure try refreshing session, then re-auth as last resort
        return _invokeCheckout(sb).catch(function (err) {
          // Token may be expired — try refreshing the session
          return sb.auth.refreshSession().then(function (ref) {
            var newToken = ref.data && ref.data.session && ref.data.session.access_token;
            if (!newToken) {
              return _showReauthPrompt(sb, returnUrl, interval);
            }
            return _invokeCheckout(sb);
          }).catch(function (retryErr) {
            if (retryErr.message && retryErr.message.indexOf('Unexpected') !== -1) throw retryErr;
            return _showReauthPrompt(sb, returnUrl, interval);
          });
        });
      });
    },

    /* Check character limit without saving — returns { blocked, limit, current } */
    checkCharacterLimit: function () {
      return _checkLimit('characters', 'free_max_characters', 'paid_max_characters');
    },

    /* Check campaign limit without saving — returns { blocked, limit, current } */
    checkCampaignLimit: function () {
      return _checkLimit('campaigns', 'free_max_campaigns', 'paid_max_campaigns');
    },

    /* Opens Stripe Customer Portal so user can manage/cancel subscription */
    manageSubscription: function (returnUrl) {
      if (!_session) return Promise.reject(new Error('Not signed in.'));
      if (!_session.isSubscribed) return Promise.reject(new Error('No active subscription.'));
      // Re-use the checkout endpoint — it auto-redirects to portal for existing subscribers
      return window.PhmurtDB.startSubscription(returnUrl || window.location.href, 'monthly');
    },

    /* Check if a feature is available on the user's current tier
       NOTE: This is a client-side check for UI behavior only. Server-side RLS
       and database triggers are the real security boundary. Never trust this
       for access control to pro features. */
    isFeatureAvailable: function (featureName) {
      // Admins/superusers always have access
      if (_session && (_session.isAdmin || _session.isSuperuser)) return true;
      // Pro users have access to everything — but note: server must verify subscription
      // status before granting actual access via RLS and API checks
      if (_session && _session.isSubscribed) return true;
      // Free users: check against the free-tier feature list (from DB cache or defaults)
      var defaults = ['character-builder', 'character-sheet', 'dice-roller', 'basic-campaign', 'learn', 'gallery'];
      var freeFeatures = (_limitCache && Array.isArray(_limitCache.free_feature_keys))
        ? _limitCache.free_feature_keys
        : defaults;
      return freeFeatures.indexOf(featureName) !== -1;
    },

    /* Returns the full tier config for UI rendering.
       Reads from DB-cached site_settings when available, falls back to hardcoded defaults. */
    getTierConfig: function () {
      var c = _limitCache || {};
      return {
        free: {
          name: 'Free',
          maxCharacters: c.free_max_characters != null ? c.free_max_characters : 3,
          maxCampaigns: c.free_max_campaigns != null ? c.free_max_campaigns : 1,
          features: Array.isArray(c.free_tier_features) ? c.free_tier_features : [
            'Character Builder (5e & 3.5e)',
            'Interactive Character Sheets',
            'Dice Roller',
            'Learn to Play Guides',
            'Art Gallery',
            'Basic Campaign Management',
          ],
          locked: Array.isArray(c.free_tier_locked) ? c.free_tier_locked : [
            'Unlimited Characters & Campaigns',
            'Generators (Names, Loot, Encounters, Quests)',
            'Advanced Campaign Tabs (Heist, Intrigue, Prophecy, Puzzles)',
            'Downtime & Religion Systems',
            'Hexcrawl & World Atlas',
            'Economy & Faction War Engines',
            'Battle Map & Living World',
            'Priority Support',
          ],
        },
        pro: {
          name: 'Phmurt Studios Pro',
          price: {
            monthly: c.pro_price_monthly || '$5/mo',
            yearly: c.pro_price_yearly || '$50/yr',
            yearlySavings: c.pro_price_yearly_savings || 'Save $10',
          },
          maxCharacters: c.paid_max_characters != null ? c.paid_max_characters : -1,
          maxCampaigns: c.paid_max_campaigns != null ? c.paid_max_campaigns : -1,
          features: Array.isArray(c.pro_tier_features) ? c.pro_tier_features : ['Everything in Free, plus:', 'Unlimited Characters & Campaigns', 'All Generators', 'All Campaign Systems', 'All World-Building Tools', 'Priority Support'],
        },
      };
    },
  };

})();

/* ── Client-side error reporter ─────────────────────────────────── */
/* Logs unhandled JS errors to the site_errors Supabase table so
   admins can see what's breaking for users. Rate-limited to prevent
   flooding: max 5 errors per page load. */
(function () {
  var _errorCount = 0;
  var _MAX_ERRORS = 5;

  function _reportError(message, stack, page) {
    if (_errorCount >= _MAX_ERRORS) return;
    _errorCount++;
    try {
      var sb = (typeof phmurtSupabase !== 'undefined' && phmurtSupabase) ? phmurtSupabase : null;
      if (!sb) return;
      var sess = null;
      try { sess = PhmurtDB.getSession(); } catch (e) { /* Session may not be available */ }
      sb.from('site_errors').insert({
        message: String(message || 'Unknown error').slice(0, 500),
        stack: String(stack || '').slice(0, 2000),
        page: (page || window.location.pathname || '/').slice(0, 200),
        user_agent: (navigator.userAgent || '').slice(0, 300),
        user_id: sess ? sess.userId : null,
      }).then(function () {}).catch(function () {});
    } catch (e) { /* Never let error reporting itself cause errors */ }
  }

  window.addEventListener('error', function (e) {
    _reportError(
      e.message || 'Script error',
      e.error && e.error.stack ? e.error.stack : (e.filename || '') + ':' + (e.lineno || ''),
      window.location.pathname
    );
  });

  window.addEventListener('unhandledrejection', function (e) {
    var reason = e.reason || {};
    _reportError(
      reason.message || String(reason).slice(0, 500),
      reason.stack || '',
      window.location.pathname
    );
  });
})();

/* ═══════════════════════════════════════════════════════════════════
   FEATURE FLAGS, MAINTENANCE MODE & ANNOUNCEMENTS
   ═══════════════════════════════════════════════════════════════════
   Fetches site_settings and site_announcements from Supabase.
   - Maintenance mode: shows a full-page overlay blocking saves
   - Feature flags: redirects users away from disabled pages
   - Announcements: shows a dismissible banner at the top of the page
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  var sb = (typeof phmurtSupabase !== 'undefined' && phmurtSupabase) ? phmurtSupabase : null;
  if (!sb) return; // Skip if Supabase not configured

  // Skip all of this on the admin page itself
  var currentPage = window.location.pathname || '/';
  if (currentPage.indexOf('admin') !== -1) return;

  // ── Shared CSS injection (maintenance, announcements, disabled page) ──
  var style = document.createElement('style');
  style.textContent = [
    '@keyframes phmurt-fade-in{from{opacity:0}to{opacity:1}}',
    '.phmurt-maintenance-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,12,8,0.97);z-index:99999;display:flex;align-items:center;justify-content:center;text-align:center;font-family:Spectral,serif;color:#f5ede0;}',
    '.phmurt-maintenance-box{max-width:500px;padding:48px;border:1px solid rgba(212,67,58,0.2);border-radius:12px;background:rgba(30,25,18,0.95);}',
    '.phmurt-maintenance-box h1{font-family:Cinzel,serif;font-size:24px;color:var(--crimson);margin-bottom:16px;letter-spacing:2px;}',
    '.phmurt-maintenance-box p{font-size:15px;line-height:1.7;color:#b8a88a;margin-bottom:12px;}',
    '.phmurt-maintenance-eta{font-size:13px;color:var(--crimson);margin-top:16px;padding:8px 16px;background:rgba(212,67,58,0.08);border-radius:6px;display:inline-block;}',
    '.phmurt-announce-bar{padding:10px 20px;font-family:Spectral,serif;font-size:13px;text-align:center;position:relative;z-index:9998;display:flex;align-items:center;justify-content:center;gap:12px;}',
    '.phmurt-announce-bar.info{background:#1a3a5c;color:#a8d4ff;border-bottom:1px solid #2a5080;}',
    '.phmurt-announce-bar.warning{background:#3d2e0a;color:#f5d06e;border-bottom:1px solid #5c4a15;}',
    '.phmurt-announce-bar.success{background:#0d3020;color:#7fe8a8;border-bottom:1px solid #1a5035;}',
    '.phmurt-announce-bar.danger{background:#3d1010;color:#f5a0a0;border-bottom:1px solid #5c2020;}',
    '.phmurt-announce-title{font-weight:600;margin-right:6px;}',
    '.phmurt-announce-close{background:none;border:none;color:inherit;cursor:pointer;font-size:18px;padding:0 4px;opacity:0.6;line-height:1;}',
    '.phmurt-announce-close:hover{opacity:1;}',
    '.phmurt-disabled-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,12,8,0.95);z-index:99998;display:flex;align-items:center;justify-content:center;text-align:center;font-family:Spectral,serif;color:#f5ede0;}',
    '.phmurt-disabled-box{max-width:450px;padding:40px;border:1px solid rgba(88,170,255,0.2);border-radius:12px;background:rgba(30,25,18,0.95);}',
    '.phmurt-disabled-box h1{font-family:Cinzel,serif;font-size:20px;color:#58aaff;margin-bottom:12px;letter-spacing:1px;}',
    '.phmurt-disabled-box p{font-size:14px;line-height:1.6;color:#b8a88a;}',
    '.phmurt-disabled-box a{color:var(--crimson);text-decoration:none;}',
  ].join('\n');
  document.head.appendChild(style);

  // Pre-initialize flags so pages checking window.phmurtFlags don't get undefined
  window.phmurtFlags = window.phmurtFlags || {};

  // ── Map pages to feature flag keys ────────────────────────────────
  var pageFlags = {
    '/character-builder.html':     'feature_character_builder',
    '/character-builder-35.html':  'feature_character_builder',
    '/campaigns.html':             'feature_campaign_manager',
    '/gallery.html':               'feature_gallery',
    '/compendium.html':            'feature_compendium',
    '/generators.html':            'feature_generators',
    '/soup-savant.html':           'feature_soup_savant',
  };
  // Beta pages require both the master beta toggle AND their specific flag
  var betaFlags = {
    '/character-builder-35.html':  'beta_character_builder_35',
  };

  // ── Fetch settings and announcements ──────────────────────────────
  function fetchSettingsAndAnnouncements() {
    var sb = (typeof phmurtSupabase !== 'undefined' && phmurtSupabase) ? phmurtSupabase : null;
    if (!sb) return; // Supabase not configured yet
    Promise.all([
      sb.from('site_settings').select('key, value, data_type').then(function (r) { return r.data || []; }).catch(function () { return []; }),
      sb.from('site_announcements').select('*').eq('is_active', true).order('created_at', { ascending: false }).then(function (r) { return r.data || []; }).catch(function () { return []; }),
    ]).then(function (results) {
      var settings = results[0];
      var announcements = results[1];

      // Parse settings into a usable map
      var flags = {};
      settings.forEach(function (s) {
        try { flags[s.key] = JSON.parse(s.value); } catch (e) { flags[s.key] = s.value; }
      });

      // Expose flags globally for other scripts
      window.phmurtFlags = flags;
      window.dispatchEvent(new CustomEvent('phmurt-flags-loaded', { detail: flags }));

      // ── Maintenance mode ──────────────────────────────────────────
      if (flags.maintenance_mode === true) {
        var overlay = document.createElement('div');
        overlay.className = 'phmurt-maintenance-overlay';
        var box = document.createElement('div');
        box.className = 'phmurt-maintenance-box';
        box.innerHTML = '<h1>Under Maintenance</h1>';
        var msg = flags.maintenance_message || 'We\'re performing scheduled maintenance. The site will be back shortly!';
        var msgP = document.createElement('p');
        // SECURITY (V-033): Use textContent instead of innerHTML to safely display message
        msgP.textContent = msg;
        box.appendChild(msgP);
        if (flags.maintenance_eta && flags.maintenance_eta !== 'null') {
          try {
            var eta = new Date(flags.maintenance_eta);
            if (!isNaN(eta.getTime())) {
              // SECURITY: Use textContent to prevent HTML injection in ETA display
              var etaDiv = document.createElement('div');
              etaDiv.className = 'phmurt-maintenance-eta';
              etaDiv.textContent = 'Estimated return: ' + eta.toLocaleString();
              box.appendChild(etaDiv);
            }
          } catch (e) { /* ETA formatting may fail silently */ }
        }
        overlay.appendChild(box);
        document.body.appendChild(overlay);

        // Block saves by overriding PhmurtDB methods
        if (typeof PhmurtDB !== 'undefined') {
          var _blockedMsg = { success: false, error: 'Site is in maintenance mode.' };
          PhmurtDB.saveCharacter = function () { return Promise.resolve(_blockedMsg); };
          PhmurtDB.saveCampaign = function () { return Promise.resolve(false); };
          PhmurtDB.saveUserSyncBlob = function () { return Promise.resolve(_blockedMsg); };
        }
        return; // Don't process feature flags or announcements during maintenance
      }

      // ── Feature flag enforcement ──────────────────────────────────
      var flagKey = pageFlags[currentPage];
      if (flagKey && flags[flagKey] === false) {
        showDisabledPage('This feature is currently disabled.', 'The site administrator has temporarily disabled this page. Please check back later.');
        return;
      }

      // Beta page enforcement
      var betaKey = betaFlags[currentPage];
      if (betaKey) {
        if (flags.beta_enabled !== true || flags[betaKey] !== true) {
          // Check if user is a beta tester
          var sess = null;
          try { sess = PhmurtDB.getSession(); } catch (e) { /* Session may not be available */ }
          if (!sess || !sess.isBetaUser) {
            showDisabledPage('Beta Feature', 'This feature is currently in beta testing and not yet available to all users.');
            return;
          }
        }
      }

      // ── New signup enforcement ────────────────────────────────────
      if (flags.feature_new_signups === false) {
        // Disable signup forms on pages that have them
        window.addEventListener('phmurt-auth-ready', function () {
          if (typeof PhmurtDB !== 'undefined') {
            var _origSignUp = PhmurtDB.signUp;
            PhmurtDB.signUp = function () {
              return Promise.reject(new Error('New registrations are currently disabled. Please try again later.'));
            };
          }
        });
      }

      // ── Password reset enforcement ────────────────────────────────
      if (flags.feature_password_reset === false && currentPage.indexOf('reset-password') !== -1) {
        showDisabledPage('Password Reset Disabled', 'Password reset is temporarily unavailable. Please contact an administrator for assistance.');
        return;
      }

      // ── Announcements ─────────────────────────────────────────────
      var now = new Date();
      var dismissed = {};
      try { dismissed = JSON.parse(sessionStorage.getItem('phmurt_dismissed_announcements') || '{}'); } catch (e) { /* sessionStorage may not be available */ }

      announcements.forEach(function (a) {
        // Check if already dismissed this session
        if (dismissed[a.id]) return;
        // Check date range
        if (a.starts_at && new Date(a.starts_at) > now) return;
        if (a.expires_at && new Date(a.expires_at) < now) return;
        // Check page filter
        if (a.show_on && a.show_on.length > 0) {
          var matchesPage = false;
          a.show_on.forEach(function (p) {
            if (currentPage.indexOf(p) !== -1) matchesPage = true;
          });
          if (!matchesPage) return;
        }

        var bar = document.createElement('div');
        // SECURITY: Whitelist announcement type to prevent CSS injection via className
        var safeType = { info: 'info', warning: 'warning', success: 'success', danger: 'danger' }[a.type] || 'info';
        bar.className = 'phmurt-announce-bar ' + safeType;

        // SECURITY: Full HTML entity encoding to prevent XSS
        function _esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
        var inner = '<span class="phmurt-announce-title">' + _esc(a.title) + '</span>';
        inner += '<span>' + _esc(a.message) + '</span>';
        if (a.dismissible !== false) {
          // SECURITY: Escape data-id to prevent attribute injection
          inner += '<button class="phmurt-announce-close" data-id="' + _esc(a.id) + '">&times;</button>';
        }
        bar.innerHTML = inner;
        document.body.insertBefore(bar, document.body.firstChild);

        // Dismiss handler
        var closeBtn = bar.querySelector('.phmurt-announce-close');
        if (closeBtn) {
          closeBtn.addEventListener('click', function () {
            bar.remove();
            try {
              dismissed[a.id] = true;
              sessionStorage.setItem('phmurt_dismissed_announcements', JSON.stringify(dismissed));
            } catch (e) { /* sessionStorage may not be available */ }
          });
        }
      });
    }).catch(function () { /* Silently fail — don't break the site */ });
  }

  function showDisabledPage(title, message) {
    // SECURITY (V-032): Escape title and message to prevent XSS
    function _esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
    var overlay = document.createElement('div');
    overlay.className = 'phmurt-disabled-overlay';
    overlay.innerHTML = '<div class="phmurt-disabled-box"><h1>' + _esc(title) + '</h1><p>' + _esc(message) + '</p><p style="margin-top:16px;"><a href="index.html">Return to Home</a></p></div>';
    document.body.appendChild(overlay);
  }

  // ── Subscription success handler ────────────────────────────────
  // SECURITY (V-031): Avoid inline onclick; use addEventListener instead
  // SECURITY: Webhook processing may be delayed, so we retry profile fetch with backoff
  function checkSubscriptionSuccess() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('subscription') === 'success') {
      // Show success toast/banner
      var banner = document.createElement('div');
      banner.className = 'phmurt-announce-bar success';
      banner.innerHTML = '<span class="phmurt-announce-title">Welcome to Phmurt Studios Pro!</span><span>Your subscription is now active. Enjoy unlimited characters and campaigns!</span><button class="phmurt-announce-close">&times;</button>';
      document.body.insertBefore(banner, document.body.firstChild);
      // Add close handler via addEventListener instead of inline onclick
      var closeBtn = banner.querySelector('.phmurt-announce-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', function () { banner.remove(); });
      }
      // Clean URL
      var url = new URL(window.location.href);
      url.searchParams.delete('subscription');
      window.history.replaceState({}, '', url.toString());
      // Refresh session to pick up new subscription status with retry logic
      // The webhook may be processing, so we retry fetching the profile
      if (typeof PhmurtDB !== 'undefined') {
        var sb = (typeof phmurtSupabase !== 'undefined' && phmurtSupabase) ? phmurtSupabase : null;
        if (sb) {
          function _tryRefreshProfile(attempt) {
            if (attempt > 5) {
              if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Max retries for profile refresh after subscription success');
              return; // Give up after 5 attempts (max ~25 seconds)
            }
            sb.auth.getSession().then(function (r) {
              if (r.data && r.data.session && r.data.session.user) {
                sb.from('profiles').select('*').eq('id', r.data.session.user.id).maybeSingle()
                  .then(function (pr) {
                    // SECURITY: Check profile exists and has subscription status before use
                    if (pr && pr.data) {
                      var session = _makeSession(r.data.session.user, pr.data);
                      if (session) {
                        _session = session;
                        _fireChange();
                        // If subscription isn't active yet, webhook may still be processing — retry
                        if (!session.isSubscribed && attempt < 5) {
                          var delay = Math.min(5000, 1500 * Math.pow(1.5, attempt));
                          setTimeout(function () { _tryRefreshProfile(attempt + 1); }, delay);
                        }
                      }
                    } else if (attempt < 5) {
                      // Profile not ready yet, retry with exponential backoff
                      var delay = Math.min(5000, 1500 * Math.pow(1.5, attempt));
                      setTimeout(function () { _tryRefreshProfile(attempt + 1); }, delay);
                    }
                  })
                  .catch(function (e) {
                    if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Profile fetch attempt', attempt, 'failed:', e.message || e);
                    if (attempt < 5) {
                      var delay = Math.min(5000, 1000 * Math.pow(1.5, attempt));
                      setTimeout(function () { _tryRefreshProfile(attempt + 1); }, delay);
                    }
                  });
              }
            });
          }
          _tryRefreshProfile(0);
        }
      }
    }
  }

  // Wait for DOM and Supabase to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      fetchSettingsAndAnnouncements();
      checkSubscriptionSuccess();
    });
  } else {
    fetchSettingsAndAnnouncements();
    checkSubscriptionSuccess();
  }

  // If Supabase wasn't ready when checkSubscriptionSuccess first ran, retry once it loads
  window.addEventListener('phmurt-supabase-ready', function () {
    var params = new URLSearchParams(window.location.search);
    if (params.get('subscription') === 'success') {
      checkSubscriptionSuccess();
    }
  }, { once: true });
})();

/* ═══════════════════════════════════════════════════════════════════
   UPGRADE MODALS & FEATURE GATING
   ═══════════════════════════════════════════════════════════════════
   These run OUTSIDE the Supabase-dependent IIFE so they always
   initialise — even when the Supabase CDN loads asynchronously.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  // Skip on admin page
  var currentPage = window.location.pathname || '/';
  if (currentPage.indexOf('admin') !== -1) return;

  // ── Inject modal CSS (always needed) ──────────────────────────────
  var upgradeStyle = document.createElement('style');
  upgradeStyle.textContent = [
    '.phmurt-upgrade-overlay{position:fixed;inset:0;z-index:99997;display:flex;align-items:center;justify-content:center;background:rgba(6,4,2,0.82);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);animation:phmurt-fade-in 0.25s ease;}',
    '.phmurt-upgrade-modal{background:#13100c;border:1px solid rgba(212,67,58,0.25);border-radius:12px;padding:0;max-width:400px;width:90%;position:relative;box-shadow:0 0 60px rgba(212,67,58,0.08),0 12px 48px rgba(0,0,0,0.7);text-align:center;overflow:hidden;}',
    '.phmurt-upgrade-modal .upgrade-glow{height:3px;background:linear-gradient(90deg,transparent,rgba(212,67,58,0.6),transparent);margin-bottom:0;}',
    '.phmurt-upgrade-modal .upgrade-body{padding:32px 28px 26px;}',
    '.phmurt-upgrade-modal .upgrade-icon{font-size:28px;margin-bottom:14px;opacity:0.5;}',
    '.phmurt-upgrade-modal .upgrade-title{font-family:Cinzel,serif;font-size:15px;letter-spacing:3px;text-transform:uppercase;color:var(--crimson,#d4433a);margin:0 0 14px;font-weight:400;}',
    '.phmurt-upgrade-modal .upgrade-text{color:#8c7d6e;font-family:Spectral,serif;font-size:14px;line-height:1.7;margin:0 0 24px;}',
    '.phmurt-upgrade-modal .upgrade-text strong{color:#d4c4a8;}',
    '.phmurt-upgrade-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:8px;}',
    '.phmurt-upgrade-modal .upgrade-btn{padding:13px 22px;background:var(--crimson,#d4433a);color:#f5ede0;border:none;font-family:Cinzel,serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border-radius:4px;font-weight:600;transition:all 0.2s;flex:1;min-width:130px;box-shadow:0 2px 12px rgba(212,67,58,0.25);}',
    '.phmurt-upgrade-modal .upgrade-btn:hover{background:#e04a3f;box-shadow:0 4px 20px rgba(212,67,58,0.4);}',
    '.phmurt-upgrade-modal .upgrade-btn.yearly{background:transparent;border:1px solid rgba(212,67,58,0.35);color:var(--crimson,#d4433a);box-shadow:none;}',
    '.phmurt-upgrade-modal .upgrade-btn.yearly:hover{background:rgba(212,67,58,0.08);border-color:rgba(212,67,58,0.5);}',
    '.phmurt-upgrade-modal .upgrade-save{font-family:Spectral,serif;font-size:11px;color:rgba(94,224,154,0.7);font-weight:400;font-style:italic;letter-spacing:0.3px;margin-top:4px;display:block;}',
    '.phmurt-upgrade-modal .upgrade-divider{height:1px;background:rgba(212,67,58,0.1);margin:20px 0 0;}',
    '.phmurt-upgrade-modal .upgrade-footer{padding:14px 28px;background:rgba(255,255,255,0.015);}',
    '.phmurt-upgrade-modal .upgrade-compare{color:#5a5046;font-family:Cinzel,serif;font-size:9px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;transition:color 0.15s;}',
    '.phmurt-upgrade-modal .upgrade-compare:hover{color:var(--crimson,#d4433a);}',
    '.phmurt-upgrade-modal .upgrade-close{position:absolute;top:14px;right:16px;background:none;border:none;color:#3a332b;cursor:pointer;font-size:18px;padding:4px 8px;line-height:1;z-index:1;transition:color 0.15s;}',
    '.phmurt-upgrade-modal .upgrade-close:hover{color:#8c7d6e;}',
  ].join('\n');
  document.head.appendChild(upgradeStyle);

  // ── Inline checkout: replaces upgrade modal body with password form ──
  function _inlineCheckout(overlay, bodyEl, plan) {
    var sb = (typeof phmurtSupabase !== 'undefined' && phmurtSupabase) ? phmurtSupabase : null;
    var sess = PhmurtDB ? PhmurtDB.getSession() : null;

    // If Supabase isn't available or user isn't fully signed in, go to pricing page
    if (!sb || !sess || !sess.email) {
      window.location.href = 'pricing.html' + (plan ? '?plan=' + plan : '');
      return;
    }

    // Safety timeout: if checkout flow hangs for more than 8 seconds, redirect to pricing
    var _checkoutTimeout = setTimeout(function () {
      window.location.href = 'pricing.html' + (plan ? '?plan=' + plan : '');
    }, 8000);

    // Check if we already have a JWT — skip password if so
    sb.auth.getSession().then(function (r) {
      var token = r.data && r.data.session && r.data.session.access_token;
      if (token) {
        // Already authenticated — go straight to Stripe
        bodyEl.innerHTML =
          '<div class="upgrade-icon" style="font-size:24px;">&#9203;</div>' +
          '<h2 class="upgrade-title">Redirecting to Checkout…</h2>';
        return _doStripeCheckout(token, plan, overlay).then(function () {
          clearTimeout(_checkoutTimeout);
        }).catch(function (checkoutErr) {
          clearTimeout(_checkoutTimeout);
          console.error('[PhmurtAuth] Checkout error:', checkoutErr && checkoutErr.message || checkoutErr);
          // Redirect to pricing page on checkout failure
          window.location.href = 'pricing.html' + (plan ? '?plan=' + plan : '');
        });
      }
      // No JWT — show inline password form (user interaction clears the timeout)
      clearTimeout(_checkoutTimeout);
      // SECURITY (V-049): Avoid inline onclick; use event listeners instead
      bodyEl.innerHTML =
        '<button class="upgrade-close">&times;</button>' +
        '<div class="upgrade-icon">&#128274;</div>' +
        '<h2 class="upgrade-title">Confirm Identity</h2>' +
        '<p class="upgrade-text">Enter your password to continue to checkout.</p>' +
        '<input type="password" class="phmurt-inline-pw" placeholder="Password" ' +
          'style="width:100%;padding:12px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(212,67,58,0.2);border-radius:4px;color:#f5ede0;font-family:Spectral,serif;font-size:14px;margin-bottom:8px;text-align:center;outline:none;" />' +
        '<p class="phmurt-inline-err" style="color:#ef4444;font-size:12px;margin:0 0 8px;display:none;"></p>' +
        '<div class="phmurt-inline-reset-area"></div>' +
        '<button class="upgrade-btn phmurt-inline-submit" style="width:100%;">Continue to Checkout</button>';

      var pwInput = bodyEl.querySelector('.phmurt-inline-pw');
      var errEl = bodyEl.querySelector('.phmurt-inline-err');
      var submitBtn = bodyEl.querySelector('.phmurt-inline-submit');
      var resetArea = bodyEl.querySelector('.phmurt-inline-reset-area');
      var closeBtn = bodyEl.querySelector('.upgrade-close');
      // Wire up close button handler
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          overlay.remove();
        });
      }

      function doSubmit() {
        var pw = (pwInput.value || '').trim();
        if (!pw) { errEl.textContent = 'Password is required.'; errEl.style.display = 'block'; return; }
        errEl.style.display = 'none';
        submitBtn.textContent = 'Signing in…';
        submitBtn.disabled = true;

        var email = sess.email;
        var displayName = sess.name || sess.displayName || 'Adventurer';

        sb.auth.signInWithPassword({ email: email, password: pw })
          .then(function (r) {
            if (r.error) throw new Error(r.error.message);
            return r;
          })
          .catch(function (signInErr) {
            if (signInErr.message && signInErr.message.indexOf('Invalid login credentials') !== -1) {
              submitBtn.textContent = 'Creating cloud account…';
              return sb.auth.signUp({ email: email, password: pw, options: { data: { name: displayName } } })
                .then(function (sr) {
                  if (sr.error) {
                    if (sr.error.message && sr.error.message.indexOf('already registered') !== -1) {
                      var e2 = new Error('Incorrect password.');
                      e2._showReset = true;
                      throw e2;
                    }
                    throw new Error(sr.error.message);
                  }
                  if (sr.data && sr.data.session) return sr;
                  return sb.auth.signInWithPassword({ email: email, password: pw })
                    .then(function (r2) { if (r2.error) throw new Error(r2.error.message); return r2; });
                });
            }
            throw signInErr;
          })
          .then(function (r) {
            var user = r.data.user;
            return _fetchProfile(user.id).then(function (profile) {
              var session = _makeSession(user, profile);
              if (!session) throw new Error('Failed to create session.');
              _session = session;
              _fireChange();
              return sb.auth.getSession();
            });
          })
          .then(function (r) {
            var token = r.data && r.data.session && r.data.session.access_token;
            if (!token) throw new Error('Authentication failed. Please try again.');
            submitBtn.textContent = 'Redirecting to checkout…';
            return _doStripeCheckout(token, plan, overlay);
          })
          .catch(function (err) {
            submitBtn.textContent = 'Continue to Checkout';
            submitBtn.disabled = false;
            // SECURITY: Sanitize error message to prevent XSS
            var errMsg = err.message || 'Sign-in failed.';
            errEl.textContent = String(errMsg).slice(0, 200);
            errEl.style.display = 'block';
            if (err._showReset && !resetArea.querySelector('a')) {
              var a = document.createElement('a');
              a.href = '#';
              a.textContent = 'Reset password';
              a.style.cssText = 'color:#d4433a;font-size:12px;display:block;margin:6px 0 8px;text-decoration:underline;cursor:pointer;';
              a.addEventListener('click', function (ev) {
                ev.preventDefault();
                a.textContent = 'Sending reset email…';
                sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password.html' })
                  .then(function () { a.textContent = 'Reset email sent! Check your inbox.'; a.style.color = '#5ee09a'; })
                  .catch(function (re) { a.textContent = 'Error: ' + (re.message || 'Unknown'); });
              });
              resetArea.appendChild(a);
            }
          });
      }

      submitBtn.addEventListener('click', doSubmit);
      pwInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') doSubmit(); });
      setTimeout(function () { pwInput.focus(); }, 100);
    }).catch(function (err) {
      clearTimeout(_checkoutTimeout);
      // Session check or checkout failed — redirect to pricing page
      window.location.href = 'pricing.html' + (plan ? '?plan=' + plan : '');
    });
  }

  // ── Stripe checkout redirect helper ──
  function _doStripeCheckout(token, plan, overlay) {
    var sb = (typeof phmurtSupabase !== 'undefined' && phmurtSupabase) ? phmurtSupabase : null;
    if (!sb) {
      return Promise.reject(new Error('Supabase not configured.'));
    }

    return sb.functions.invoke('stripe-checkout', {
      body: { return_url: window.location.href, interval: (plan === 'yearly') ? 'yearly' : 'monthly' }
    })
    .then(function (result) {
      if (result.error) throw new Error(result.error.message || 'Checkout request failed.');
      var data = result.data;
      if (!data || !data.url) throw new Error(data && data.error ? data.error : 'No checkout URL returned from server.');
      try {
        var parsed = new URL(data.url);
        // SECURITY: Strict hostname validation using exact match, not indexOf
        var isValidHost = parsed.hostname === 'stripe.com' ||
                          parsed.hostname === 'checkout.stripe.com' ||
                          parsed.hostname === 'www.phmurtstudios.com' ||
                          parsed.hostname === 'phmurtstudios.com';
        if (parsed.protocol !== 'https:' || !isValidHost) {
          throw new Error('Unexpected redirect URL.');
        }
        window.location.href = data.url;
      } catch (urlErr) {
        if (urlErr.message === 'Unexpected redirect URL.') throw urlErr;
        throw new Error('Invalid response from payment server.');
      }
    })
    .catch(function (err) {
      if (overlay) overlay.remove();
      throw err;
    });
  }

  // ── Upgrade prompt (shown when save fails due to limit) ────────
  // SECURITY (V-029): Message is properly escaped to prevent XSS
  window.addEventListener('phmurt-limit-reached', function (e) {
    var detail = e.detail || {};
    if (document.querySelector('.phmurt-upgrade-overlay')) return; // Already showing
    var overlay = document.createElement('div');
    overlay.className = 'phmurt-upgrade-overlay';
    var msg = detail.message || 'You\'ve reached the free plan limit.';
    var table = detail.table === 'characters' ? 'characters' : detail.table === 'campaigns' ? 'campaigns' : 'items';
    // Escape message to prevent XSS
    var escapedMsg = psEscapeHtml(msg);
    overlay.innerHTML =
      '<div class="phmurt-upgrade-modal">' +
        '<div class="upgrade-glow"></div>' +
        '<div class="upgrade-body">' +
          '<button class="upgrade-close" id="phmurt-upgrade-close">&times;</button>' +
          '<div class="upgrade-icon">&#9876;</div>' +
          '<h2 class="upgrade-title">Limit Reached</h2>' +
          '<p class="upgrade-text">' + escapedMsg + '<br>Upgrade to <strong>Phmurt Studios Pro</strong> for unlimited ' + psEscapeHtml(table) + ', generators, advanced campaign tools, and more.</p>' +
          '<div class="phmurt-upgrade-btns">' +
            '<button class="upgrade-btn" id="phmurt-upgrade-monthly" style="display:flex;align-items:center;justify-content:center;">$5 / month</button>' +
            '<button class="upgrade-btn yearly" id="phmurt-upgrade-yearly" style="display:flex;align-items:center;justify-content:center;">$50 / year</button>' +
          '</div>' +
          '<span class="upgrade-save">Save $10 with yearly!</span>' +
        '</div>' +
        '<div class="upgrade-divider"></div>' +
        '<div class="upgrade-footer">' +
          '<a class="upgrade-compare" href="pricing.html">Compare plans</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    // Close handlers - SECURITY (V-030): Properly clean up event listeners
    var closeBtn = document.getElementById('phmurt-upgrade-close');
    var closeHandler = function () { overlay.remove(); };
    var bgClickHandler = function (ev) { if (ev.target === overlay) overlay.remove(); };
    if (closeBtn) closeBtn.addEventListener('click', closeHandler);
    overlay.addEventListener('click', bgClickHandler);
    // Direct checkout from upgrade modal (no pricing.html redirect)
    function _upgradeCheckout(plan) {
      if (typeof PhmurtDB === 'undefined') return;
      var btn = document.getElementById('phmurt-upgrade-' + plan);
      if (btn) { btn.textContent = 'Connecting\u2026'; btn.disabled = true; }
      PhmurtDB.startSubscription('https://phmurtstudios.com/', plan).catch(function (err) {
        if (btn) { btn.textContent = plan === 'yearly' ? '$50 / year' : '$5 / month'; btn.disabled = false; }
        console.error('Upgrade checkout error:', err);
      });
    }
    var mBtn = document.getElementById('phmurt-upgrade-monthly');
    var yBtn = document.getElementById('phmurt-upgrade-yearly');
    if (mBtn) mBtn.addEventListener('click', function () { _upgradeCheckout('monthly'); });
    if (yBtn) yBtn.addEventListener('click', function () { _upgradeCheckout('yearly'); });
  });

  // ── Global Feature Gate ─────────────────────────────────────────
  // Call window.PhmurtGate(featureName) from any page. Returns true
  // if the user may proceed; returns false and shows an upgrade
  // modal if they're on the free tier.  Usage:
  //   if (!PhmurtGate('generators')) return;
  // SECURITY: Feature label is escaped to prevent XSS
  // ────────────────────────────────────────────────────────────────
  window.PhmurtGate = function (featureName) {
    if (typeof PhmurtDB === 'undefined') return true; // Offline/no-auth fallback
    if (PhmurtDB.isFeatureAvailable(featureName)) return true;

    // ── Build & show upgrade modal ──────────────────────────────
    if (document.getElementById('phmurt-gate-modal')) return false; // Already showing

    var tierCfg = PhmurtDB.getTierConfig();
    var overlay = document.createElement('div');
    overlay.id = 'phmurt-gate-modal';
    overlay.className = 'phmurt-upgrade-overlay';

    var featureLabel = featureName.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    // SECURITY (V-027): Escape featureLabel to prevent XSS injection
    var escapedFeatureLabel = psEscapeHtml(featureLabel);

    overlay.innerHTML =
      '<div class="phmurt-upgrade-modal">' +
        '<div class="upgrade-glow"></div>' +
        '<div class="upgrade-body">' +
          '<button class="upgrade-close" id="phmurt-gate-close">&times;</button>' +
          '<div class="upgrade-icon">&#9876;</div>' +
          '<h2 class="upgrade-title">Upgrade to Pro</h2>' +
          '<p class="upgrade-text"><strong>' + escapedFeatureLabel + '</strong> is a Pro feature. Unlock it — plus unlimited characters, campaigns, and every generator.</p>' +
          '<div class="phmurt-upgrade-btns">' +
            '<button class="upgrade-btn" id="phmurt-gate-monthly" style="cursor:pointer;">' + psEscapeHtml(String(tierCfg.pro.price.monthly || '')) + '</button>' +
            '<button class="upgrade-btn yearly" id="phmurt-gate-yearly" style="cursor:pointer;">' + psEscapeHtml(String(tierCfg.pro.price.yearly || '')) + '</button>' +
          '</div>' +
          '<span class="upgrade-save">' + psEscapeHtml(String(tierCfg.pro.price.yearlySavings || '')) + ' with yearly!</span>' +
        '</div>' +
        '<div class="upgrade-divider"></div>' +
        '<div class="upgrade-footer">' +
          '<a class="upgrade-compare" href="pricing.html">Compare plans</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    // Close - SECURITY (V-028): Properly handle event listeners to prevent leaks
    var closeBtn = document.getElementById('phmurt-gate-close');
    var closeHandler = function () { overlay.remove(); };
    var bgClickHandler = function (ev) { if (ev.target === overlay) overlay.remove(); };
    if (closeBtn) closeBtn.addEventListener('click', closeHandler);
    overlay.addEventListener('click', bgClickHandler);

    // Direct checkout buttons — skip pricing.html redirect
    function _gateCheckout(plan) {
      if (typeof PhmurtDB === 'undefined') return;
      var btn = document.getElementById('phmurt-gate-' + plan);
      if (btn) { btn.textContent = 'Connecting\u2026'; btn.disabled = true; }
      PhmurtDB.startSubscription('https://phmurtstudios.com/', plan).catch(function (err) {
        if (btn) { btn.textContent = plan === 'yearly' ? '$50 / year' : '$5 / month'; btn.disabled = false; }
        console.error('Gate checkout error:', err);
      });
    }
    var monthlyBtn = document.getElementById('phmurt-gate-monthly');
    var yearlyBtn  = document.getElementById('phmurt-gate-yearly');
    if (monthlyBtn) monthlyBtn.addEventListener('click', function () { _gateCheckout('monthly'); });
    if (yearlyBtn)  yearlyBtn.addEventListener('click', function () { _gateCheckout('yearly'); });

    // Clean up listeners when modal is removed
    var observer = new MutationObserver(function() {
      if (!document.body.contains(overlay)) {
        if (closeBtn) closeBtn.removeEventListener('click', closeHandler);
        overlay.removeEventListener('click', bgClickHandler);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return false;
  };

  // ── Auto-gate pages with data-phmurt-feature attribute ──────────
  function _autoGatePage() {
    var feature = document.body && document.body.getAttribute('data-phmurt-feature');
    if (feature && !window.PhmurtGate(feature)) {
      // Feature was blocked — the modal is already showing
    }
  }

  // Auto-gate runs after auth state resolves
  window.addEventListener('phmurt-auth-change', function () { _autoGatePage(); });
})();
