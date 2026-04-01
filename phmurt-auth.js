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
     .openAuth()                          → void
   ═══════════════════════════════════════════════════════════════════ */
var PhmurtDB = (function () {

  /* ── Config ──────────────────────────────────────────────────────── */
  var ADMIN_EMAILS = ['dreverad@icloud.com', 'dreverad18@gmail.com'];

  /* ── State ───────────────────────────────────────────────────────── */
  var _session   = null;
  var _listeners = [];

  /* ── Supabase ref ────────────────────────────────────────────────── */
  function _sb() {
    return (typeof phmurtSupabase !== 'undefined' && phmurtSupabase) ? phmurtSupabase : null;
  }

  /* ── Session factory ─────────────────────────────────────────────── */
  function _isAdmin(email, profileFlag) {
    return !!(profileFlag || ADMIN_EMAILS.indexOf((email || '').toLowerCase()) !== -1);
  }

  function _makeSession(user, profile) {
    var name = (profile && profile.name)
      || (user.user_metadata && user.user_metadata.name)
      || (user.email || 'Adventurer').split('@')[0];
    return {
      userId:      user.id,
      name:        name,
      email:       user.email || '',
      displayName: name,
      isAdmin:     _isAdmin(user.email, profile && profile.is_admin),
      isSuperuser: !!(profile && profile.is_superuser),
      isBanned:    !!(profile && profile.is_banned)
    };
  }

  function _fireChange() {
    _listeners.forEach(function (fn) {
      try {
        fn();
      } catch (e) {
        console.warn('[PhmurtAuth] Listener error:', e.message || e);
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
        console.warn('[PhmurtAuth] Failed to fetch profile:', err ? err.message : 'Unknown error');
        return null;
      });
  }

  /* ══════════════════════════════════════════════════════════════════
     SUPABASE INIT
  ══════════════════════════════════════════════════════════════════ */
  function _runSupabaseInit(sb) {
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
      console.warn('[PhmurtAuth] Supabase init failed:', err ? err.message : 'Unknown error');
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
      document.cookie = n + '=' + encodeURIComponent(v || '') + e + '; path=/; SameSite=Strict';
    } catch (err) {
      console.warn('[PhmurtAuth] Failed to set cookie:', err.message || err);
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
      console.warn('[PhmurtAuth] Failed to read cookie:', err.message || err);
    }
    return null;
  }
  function _delCk(n) { _setCk(n, '', -1); }

  function _lsGet(key) {
    try {
      var r = localStorage.getItem(key);
      if (r) return JSON.parse(r);
    } catch (err) {
      console.warn('[PhmurtAuth] Failed to read localStorage:', err.message || err);
    }
    return null;
  }
  function _lsSet(key, val) {
    try {
      localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
    } catch (err) {
      console.warn('[PhmurtAuth] Failed to write localStorage:', err.message || err);
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
          if (cp && cp.userId) { _lsSet(LS_SESSION, cp); return cp; }
        } catch (parseErr) {
          console.warn('[PhmurtAuth] Failed to parse session cookie:', parseErr.message || parseErr);
        }
      }
    } catch (err) {
      console.warn('[PhmurtAuth] Error getting legacy session:', err.message || err);
    }
    return null;
  }
  function _legacySetSession(data) {
    if (data) {
      var j = JSON.stringify(data);
      _lsSet(LS_SESSION, j);
      _setCk(CK_SESSION, j, 30);
    } else {
      try {
        localStorage.removeItem(LS_SESSION);
      } catch (err) {
        console.warn('[PhmurtAuth] Failed to remove session:', err.message || err);
      }
      _delCk(CK_SESSION);
    }
  }
  function _legacyGetUsers() {
    var u = _lsGet(LS_USERS);
    if (u && typeof u === 'object') return u;
    try {
      var cr = _getCk(CK_USERS);
      if (cr) {
        try {
          var cp = JSON.parse(cr);
          if (cp && typeof cp === 'object') { _lsSet(LS_USERS, cp); return cp; }
        } catch (parseErr) {
          console.warn('[PhmurtAuth] Failed to parse users cookie:', parseErr.message || parseErr);
        }
      }
    } catch (err) {
      console.warn('[PhmurtAuth] Error getting legacy users:', err.message || err);
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
    isAdmin:    function () { return !!(_session && _session.isAdmin); },
    db:         function () { return _sb(); },

    onAuthStateChange: function (fn) { if (typeof fn === 'function') _listeners.push(fn); },

    /* ── Sign Up ──────────────────────────────────────────────── */
    signUp: function (name, email, password) {
      var ne   = (email || '').trim().toLowerCase();
      var dnam = (name  || 'Adventurer').trim();
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
              is_admin: ADMIN_EMAILS.indexOf(ne) !== -1
            }, { onConflict: 'id' }).then(function () {
              var sess = _makeSession(user, { name: dnam, is_admin: ADMIN_EMAILS.indexOf(ne) !== -1 });
              _session = sess;
              _fireChange();
              return sess;
            });
          })
          .catch(function (err) {
            console.warn('[PhmurtAuth] Sign-up error:', err.message || err);
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
        var sess = { userId: u.userId, name: dnam, email: ne, displayName: dnam, isAdmin: ADMIN_EMAILS.indexOf(ne) !== -1 };
        _legacySetSession(sess);
        _session = sess;
        _fireChange();
        return sess;
      });
    },

    /* ── Sign In ──────────────────────────────────────────────── */
    signIn: function (email, password) {
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
                  console.warn('[PhmurtAuth] Sign-out after ban check failed:', err.message || err);
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
            console.warn('[PhmurtAuth] Sign-in error:', err.message || err);
            throw err;
          });
      }

      // Legacy
      var users = _legacyGetUsers();
      var u = users[ne];
      if (!u) return Promise.reject(new Error('No account found with that email.'));
      return _legacyHashPwd(password, ne).then(function (hash) {
        if (hash !== u.passwordHash) throw new Error('Incorrect password.');
        var sess = { userId: u.userId, name: u.name, email: ne, displayName: u.name, isAdmin: ADMIN_EMAILS.indexOf(ne) !== -1 };
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
          console.warn('[PhmurtAuth] Supabase sign-out failed:', err.message || err);
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

      var sb = _sb();
      if (sb) {
        var name    = (snapshot.details && snapshot.details.name) || 'Unnamed Character';
        var race    = snapshot.race  || '';
        var cls     = snapshot.cls   || snapshot.class_ || '';
        var level   = snapshot.level || 1;
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

        if (existingId && !/^\d+$/.test(existingId)) {
          // Valid UUID — update
          return sb.from('characters').update(row)
            .eq('id', existingId).eq('owner_id', _session.userId)
            .select('id').single()
            .then(function (r) {
              if (r.error) throw r.error;
              return { success: true, id: r.data.id };
            })
            .catch(function (e) {
              // If not found, insert fresh
              return sb.from('characters').insert(row).select('id').single()
                .then(function (r2) { return { success: true, id: r2.data.id }; })
                .catch(function (e2) { return { success: false, error: e2.message }; });
            });
        } else {
          // Insert new
          return sb.from('characters').insert(row).select('id').single()
            .then(function (r) {
              if (r.error) throw r.error;
              return { success: true, id: r.data.id };
            })
            .catch(function (e) { return { success: false, error: e.message }; });
        }
      }

      // Legacy localStorage
      try {
        var chars = _legacyGetChars();
        var idx   = (existingId !== undefined && existingId !== null) ? parseInt(existingId, 10) : NaN;
        var entry = {
          id:    isNaN(idx) ? Date.now().toString() : existingId,
          name:  (snapshot.details && snapshot.details.name) || 'Unnamed Character',
          race:  snapshot.race || '',
          class: snapshot.cls  || '',
          level: snapshot.level || 1,
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
        return sb.from('campaigns').upsert({
          id:          campaign.id,
          owner_id:    _session.userId,
          name:        campaign.name || 'Unnamed Campaign',
          description: campaign.description || '',
          system:      campaign.system || '5e',
          invite_code: campaign.inviteCode || null,
          data:        campaign,
          updated_at:  new Date().toISOString()
        }, { onConflict: 'id' })
          .then(function (r) { return !r.error; })
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
        return sb.from('campaigns').select('data')
          .eq('owner_id', _session.userId)
          .order('updated_at', { ascending: false })
          .then(function (r) {
            return (r.data || []).map(function (row) { return row.data; });
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
            '<button id="pa-up-submit" style="' + S.btn + '">Create Account</button>' +
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
        if (!name)           { showErr('Please enter a display name.'); return; }
        if (!email)          { showErr('Please enter your email address.'); return; }
        if (!pass)           { showErr('Please choose a password.'); return; }
        if (pass.length < 8) { showErr('Password must be at least 8 characters.'); return; }
        if (pass !== pass2)  { showErr('Passwords do not match.'); return; }
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
        .then(function (r) { return !r.error; });
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
      var path = _session.userId + '/' + campaignId + '/' + Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      return sb.storage.from('map-images').upload(path, file, { upsert: false })
        .then(function (r) {
          if (r.error) { console.warn('[PhmurtDB] Map upload failed:', r.error.message); return null; }
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
      var path = _session.userId + '/' + entityId + '.' + (file.name.split('.').pop() || 'jpg');
      return sb.storage.from('portraits').upload(path, file, { upsert: true })
        .then(function (r) {
          if (r.error) { console.warn('[PhmurtDB] Portrait upload failed:', r.error.message); return null; }
          return sb.storage.from('portraits').createSignedUrl(path, 60 * 60 * 24 * 30)
            .then(function (u) { return u.data ? u.data.signedUrl : null; });
        });
    }
  };

})();

/* ── Cross-tab session sync ──────────────────────────────────────── */
window.addEventListener('storage', function (e) {
  if (e.key === 'phmurt_auth_session' || e.key === 'phmurt_sb_auth') {
    window.dispatchEvent(new Event('phmurt-auth-change'));
  }
});
