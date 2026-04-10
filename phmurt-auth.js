/* ═══════════════════════════════════════════════════════════════════
   PHMURT AUTH  –  Auth + Cloud Data Layer  v3
   ═══════════════════════════════════════════════════════════════════
   Powered by Supabase when configured (supabase-config.js filled in).
   Falls back to local-storage + cookie auth when offline / unconfigured.

   Public API (PhmurtDB):
     .getSession()                        → session | null  (sync)
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
  function _isAdmin(profileFlag) {
    return !!profileFlag;
  }

  function _makeSession(user, profile) {
    var name = (profile && profile.name)
      || (user.user_metadata && user.user_metadata.name)
      || (user.email || 'Adventurer').split('@')[0];
    var tier = (profile && profile.subscription_tier) || 'free';
    var subStatus = (profile && profile.subscription_status) || null;
    // Check if subscription is still valid (not expired)
    var subExpires = profile && profile.subscription_expires_at ? new Date(profile.subscription_expires_at) : null;
    var isSubscribed = tier === 'pro' && subStatus === 'active' && (!subExpires || subExpires > new Date());
    return {
      userId:              user.id,
      name:                name,
      email:               user.email || '',
      displayName:         name,
      isAdmin:             _isAdmin(profile && profile.is_admin),
      isSuperuser:         !!(profile && profile.is_superuser),
      isBanned:            !!(profile && profile.is_banned),
      isBetaUser:          !!(profile && profile.is_beta_user),
      subscriptionTier:    isSubscribed ? 'pro' : 'free',
      isSubscribed:        isSubscribed,
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
              limit: maxCount,
              current: current
            };
            // Fire event so the upgrade banner can appear
            try { window.dispatchEvent(new CustomEvent('phmurt-limit-reached', { detail: result })); } catch (e) {}
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
          _session = _makeSession(sess.user, profile);
          _fireChange();
        });
      }
      _fireChange();
    }).catch(function (err) {
      if (typeof PHMURT_DEBUG !== 'undefined' && PHMURT_DEBUG) console.warn('[PhmurtAuth] Supabase init failed:', err ? err.message : 'Unknown error');
      _initLegacy();
    });

    sb.auth.onAuthStateChange(function (event, sess) {
      if (sess && sess.user) {
        _fetchProfile(sess.user.id).then(function (profile) {
          _session = _makeSession(sess.user, profile);
          _fireChange();
        });
      } else {
        _session = null;
        _fireChange();
      }
    });
  }

  (function _initSupabase() {
    var sb = _sb();
    if (!sb) {
      _initLegacy();
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

  /* ══════════════════════════════════════════════════════════════════
     LEGACY LOCAL-STORAGE FALLBACK
  ══════════════════════════════════════════════════════════════════ */
  var LS_SESSION = 'phmurt_auth_session';
  var LS_USERS   = 'phmurt_users_db';
  var CK_SESSION = 'phmurt_sess';
  var CK_USERS   = 'phmurt_udb';

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
    var s = pwd + ':' + email.toLowerCase();
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
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
    if (s) { _session = s; _fireChange(); }
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
    } catch (e) {}
  }

  function _legacyDeleteCampLocal(id) {
    try {
      var camps = _legacyGetCamps();
      camps = camps.filter(function (c) { return c.id !== id; });
      _legacySaveCamps(camps);
    } catch (e) {}
  }

  /* ══════════════════════════════════════════════════════════════════
     PUBLIC API
  ══════════════════════════════════════════════════════════════════ */
  return {

    getSession: function () { return _session; },
    getCsrfNonce: function () { return _csrfNonce; },
    isAdmin:    function () { return !!(_session && _session.isAdmin); },
    db:         function () { return _sb(); },

    onAuthStateChange: function (fn) { if (typeof fn === 'function') _listeners.push(fn); },

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
      // Remove attempts older than 60 seconds
      _signInAttempts = _signInAttempts.filter(function(t) { return now - t < 60000; });
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
        if (hash !== u.passwordHash) throw new Error('Invalid email or password.');
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
        var builder = existingId ? (snapshot.builderType || '5e') : (snapshot.cls ? '5e' : '35e');

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
        if (isNewCharacter) {
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

        if (existingId) {
          // SECURITY (V-016): Validate existingId is non-empty string before using in query
          var safeId = String(existingId).trim();
          if (!safeId) return Promise.resolve({ success: false, error: 'Invalid character ID.' });
          return sb.from('characters').update(row)
            .eq('id', safeId).eq('owner_id', _session.userId)
            .select('id').single()
            .then(function (r) {
              if (r.error) throw r.error;
              return { success: true, id: r.data.id };
            })
            .catch(function (e) {
              // If update failed, log the reason then try insert
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
        } else {
          // Insert new (with limit check)
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

      document.getElementById('pa-tab-in').addEventListener('click', function () { switchTab('in'); });
      document.getElementById('pa-tab-up').addEventListener('click', function () { switchTab('up'); });

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
      document.getElementById('pa-close').addEventListener('click', closeModal);
      modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
      modal.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

      document.getElementById('pa-in-submit').addEventListener('click', function () {
        showErr('');
        var email = document.getElementById('pa-in-email').value.trim();
        var pass  = document.getElementById('pa-in-pass').value;
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

      document.getElementById('pa-up-submit').addEventListener('click', function () {
        showErr('');
        var name  = document.getElementById('pa-up-name').value.trim();
        var email = document.getElementById('pa-up-email').value.trim();
        var pass  = document.getElementById('pa-up-pass').value;
        var pass2 = document.getElementById('pa-up-pass2').value;
        var ageCheck = document.getElementById('pa-up-age-check').checked;
        var termsCheck = document.getElementById('pa-up-terms-check').checked;
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

      modal.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        var inP = document.getElementById('pa-panel-in');
        if (inP && inP.style.display !== 'none') document.getElementById('pa-in-submit').click();
        else document.getElementById('pa-up-submit').click();
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
      if (template.id && template.id.startsWith && !template.id.startsWith('tpl-')) {
        // Existing DB record
        return sb.from('encounter_templates').update(record).eq('id', template.id)
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
      var sb = _sb();
      if (!sb) return Promise.resolve(false);
      return sb.from('encounter_templates').delete().eq('id', templateId)
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
      var sb = _sb();
      if (!sb) return Promise.resolve(false);
      return sb.from('campaign_invites').delete().eq('id', inviteId)
        .then(function (r) { return !r.error; })
        .catch(function() { return false; });
    },

    /* ── Campaign Members ─────────────────────────────────────── */
    getCampaignMembers: function (campaignId) {
      var sb = _sb();
      if (!sb) return Promise.resolve([]);
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
      var path = _session.userId + '/' + campaignId + '/' + Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.\./g, '_');
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
      var path = _session.userId + '/' + entityId + '.' + (file.name.split('.').pop() || 'jpg').replace(/\.\./g, '_');
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
        tier:        _session.subscriptionTier || 'free',
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
      if (!_session) return Promise.reject(new Error('Not signed in.'));
      var sb = _sb();
      if (!sb) return Promise.reject(new Error('Supabase not configured.'));

      var checkoutUrl = (typeof STRIPE_CHECKOUT_FUNCTION_URL !== 'undefined' && STRIPE_CHECKOUT_FUNCTION_URL)
        ? STRIPE_CHECKOUT_FUNCTION_URL
        : (typeof SUPABASE_URL !== 'undefined' ? SUPABASE_URL + '/functions/v1/stripe-checkout' : null);

      if (!checkoutUrl) return Promise.reject(new Error('Stripe checkout not configured.'));

      return sb.auth.getSession().then(function (r) {
        var token = r.data && r.data.session && r.data.session.access_token;
        if (!token) throw new Error('No active session.');

        return fetch(checkoutUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            return_url: returnUrl || window.location.href,
            // SECURITY: Whitelist interval values — server also validates, but defense in depth
            interval: (interval === 'yearly') ? 'yearly' : 'monthly',
          }),
        })
        .then(function (resp) { return resp.json(); })
        .then(function (data) {
          if (data.error) throw new Error(data.error);
          // SECURITY: Validate the redirect URL is an HTTPS Stripe URL (prevents javascript:/data: URI attacks)
          if (data.url) {
            try {
              var parsed = new URL(data.url);
              if (parsed.protocol !== 'https:' || (parsed.hostname.indexOf('stripe.com') === -1 && parsed.hostname.indexOf('phmurtstudios.com') === -1)) {
                throw new Error('Unexpected redirect URL.');
              }
              window.location.href = data.url;
            } catch (urlErr) {
              if (urlErr.message === 'Unexpected redirect URL.') throw urlErr;
              throw new Error('Invalid response from payment server.');
            }
          }
          return data;
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

    /* Check if a feature is available on the user's current tier */
    isFeatureAvailable: function (featureName) {
      // Admins/superusers always have access
      if (_session && (_session.isAdmin || _session.isSuperuser)) return true;
      // Pro users have access to everything
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
            monthly: c.pro_price_monthly || '$4.99/mo',
            yearly: c.pro_price_yearly || '$49.99/yr',
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

/* ── Cross-tab session sync ──────────────────────────────────────── */
window.addEventListener('storage', function (e) {
  if (e.key === 'phmurt_auth_session' || e.key === 'phmurt_sb_auth') {
    window.dispatchEvent(new Event('phmurt-auth-change'));
  }
});

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
      try { sess = PhmurtDB.getSession(); } catch (e) {}
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

  // ── Shared CSS injection ──────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    /* Subscription upgrade modal */
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
        box.innerHTML += '<p>' + msg.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>';
        if (flags.maintenance_eta && flags.maintenance_eta !== 'null') {
          try {
            var eta = new Date(flags.maintenance_eta);
            if (!isNaN(eta.getTime())) {
              box.innerHTML += '<div class="phmurt-maintenance-eta">Estimated return: ' + eta.toLocaleString() + '</div>';
            }
          } catch (e) {}
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
          try { sess = PhmurtDB.getSession(); } catch (e) {}
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
      try { dismissed = JSON.parse(sessionStorage.getItem('phmurt_dismissed_announcements') || '{}'); } catch (e) {}

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
            } catch (e) {}
          });
        }
      });
    }).catch(function () { /* Silently fail — don't break the site */ });
  }

  function showDisabledPage(title, message) {
    var overlay = document.createElement('div');
    overlay.className = 'phmurt-disabled-overlay';
    overlay.innerHTML = '<div class="phmurt-disabled-box"><h1>' + title + '</h1><p>' + message + '</p><p style="margin-top:16px;"><a href="index.html">Return to Home</a></p></div>';
    document.body.appendChild(overlay);
  }

  // ── Subscription success handler ────────────────────────────────
  function checkSubscriptionSuccess() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('subscription') === 'success') {
      // Show success toast/banner
      var banner = document.createElement('div');
      banner.className = 'phmurt-announce-bar success';
      banner.innerHTML = '<span class="phmurt-announce-title">Welcome to Phmurt Studios Pro!</span><span>Your subscription is now active. Enjoy unlimited characters and campaigns!</span><button class="phmurt-announce-close" onclick="this.parentElement.remove()">&times;</button>';
      document.body.insertBefore(banner, document.body.firstChild);
      // Clean URL
      var url = new URL(window.location.href);
      url.searchParams.delete('subscription');
      window.history.replaceState({}, '', url.toString());
      // Refresh session to pick up new subscription status
      if (typeof PhmurtDB !== 'undefined' && sb) {
        sb.auth.getSession().then(function (r) {
          if (r.data && r.data.session && r.data.session.user) {
            sb.from('profiles').select('*').eq('id', r.data.session.user.id).maybeSingle()
              .then(function (pr) {
                if (pr.data) {
                  window.dispatchEvent(new Event('phmurt-auth-change'));
                }
              });
          }
        });
      }
    }
  }

  // ── Upgrade prompt (shown when save fails due to limit) ────────
  window.addEventListener('phmurt-limit-reached', function (e) {
    var detail = e.detail || {};
    if (document.querySelector('.phmurt-upgrade-overlay')) return; // Already showing
    var overlay = document.createElement('div');
    overlay.className = 'phmurt-upgrade-overlay';
    var msg = detail.message || 'You\'ve reached the free plan limit.';
    var table = detail.table === 'characters' ? 'characters' : detail.table === 'campaigns' ? 'campaigns' : 'items';
    overlay.innerHTML =
      '<div class="phmurt-upgrade-modal">' +
        '<div class="upgrade-glow"></div>' +
        '<div class="upgrade-body">' +
          '<button class="upgrade-close" id="phmurt-upgrade-close">&times;</button>' +
          '<div class="upgrade-icon">&#9876;</div>' +
          '<h2 class="upgrade-title">Limit Reached</h2>' +
          '<p class="upgrade-text">' + msg.replace(/</g, '&lt;') + '<br>Upgrade to <strong>Phmurt Studios Pro</strong> for unlimited ' + table + ', generators, advanced campaign tools, and more.</p>' +
          '<div class="phmurt-upgrade-btns">' +
            '<button class="upgrade-btn" id="phmurt-upgrade-monthly">$4.99 / month</button>' +
            '<button class="upgrade-btn yearly" id="phmurt-upgrade-yearly">$49.99 / year</button>' +
          '</div>' +
          '<span class="upgrade-save">Save $10 with yearly!</span>' +
        '</div>' +
        '<div class="upgrade-divider"></div>' +
        '<div class="upgrade-footer">' +
          '<a class="upgrade-compare" href="pricing.html">Compare plans</a>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    // Close handlers
    document.getElementById('phmurt-upgrade-close').addEventListener('click', function () { overlay.remove(); });
    overlay.addEventListener('click', function (ev) { if (ev.target === overlay) overlay.remove(); });
    // Subscribe handlers
    document.getElementById('phmurt-upgrade-monthly').addEventListener('click', function () {
      if (typeof PhmurtDB !== 'undefined') {
        PhmurtDB.startSubscription(null, 'monthly').catch(function (err) {
          alert('Could not start subscription: ' + (err.message || 'Unknown error'));
        });
      }
    });
    document.getElementById('phmurt-upgrade-yearly').addEventListener('click', function () {
      if (typeof PhmurtDB !== 'undefined') {
        PhmurtDB.startSubscription(null, 'yearly').catch(function (err) {
          alert('Could not start subscription: ' + (err.message || 'Unknown error'));
        });
      }
    });
  });

  // ── Global Feature Gate ─────────────────────────────────────────
  // Call window.PhmurtGate(featureName) from any page. Returns true
  // if the user may proceed; returns false and shows an upgrade
  // modal if they're on the free tier.  Usage:
  //   if (!PhmurtGate('generators')) return;
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

    overlay.innerHTML =
      '<div class="phmurt-upgrade-modal">' +
        '<div class="upgrade-glow"></div>' +
        '<div class="upgrade-body">' +
          '<button class="upgrade-close" id="phmurt-gate-close">&times;</button>' +
          '<div class="upgrade-icon">&#9876;</div>' +
          '<h2 class="upgrade-title">Upgrade to Pro</h2>' +
          '<p class="upgrade-text"><strong>' + featureLabel + '</strong> is a Pro feature. Unlock it — plus unlimited characters, campaigns, and every generator.</p>' +
          '<div class="phmurt-upgrade-btns">' +
            '<button class="phmurt-gate-btn upgrade-btn" data-plan="monthly">' + tierCfg.pro.price.monthly + '</button>' +
            '<button class="phmurt-gate-btn upgrade-btn yearly" data-plan="yearly">' + tierCfg.pro.price.yearly + '</button>' +
          '</div>' +
          '<span class="upgrade-save">' + tierCfg.pro.price.yearlySavings + ' with yearly!</span>' +
        '</div>' +
        '<div class="upgrade-divider"></div>' +
        '<div class="upgrade-footer">' +
          '<a class="upgrade-compare" href="pricing.html">Compare plans</a>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    // Close
    document.getElementById('phmurt-gate-close').addEventListener('click', function () { overlay.remove(); });
    overlay.addEventListener('click', function (ev) { if (ev.target === overlay) overlay.remove(); });

    // Subscribe buttons
    overlay.querySelectorAll('.phmurt-gate-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var plan = btn.getAttribute('data-plan');
        PhmurtDB.startSubscription(null, plan).catch(function (err) {
          alert('Could not start checkout: ' + (err.message || 'Unknown error'));
        });
      });
    });

    return false;
  };

  // ── Auto-gate pages with data-phmurt-feature attribute ──────────
  // Any page can add <body data-phmurt-feature="generators"> and the
  // gate will fire automatically on load if the user is on free tier.
  function _autoGatePage() {
    var feature = document.body && document.body.getAttribute('data-phmurt-feature');
    if (feature && !window.PhmurtGate(feature)) {
      // Feature was blocked — the modal is already showing
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

  // Auto-gate runs after auth state resolves
  window.addEventListener('phmurt-auth-change', function () { _autoGatePage(); });
})();
