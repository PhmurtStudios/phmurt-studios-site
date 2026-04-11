/* ═══════════════════════════════════════════════════════════════════
   PHMURT REALTIME — Battle Map Sync Layer
   ═══════════════════════════════════════════════════════════════════
   Wraps Supabase Realtime Broadcast for live battle map sync.
   Falls back to localStorage polling when Supabase is unavailable.

   Public API (PhmurtRealtime):
     .joinBattleMap(campaignId, role, onState)
       → Subscribes to live battle map state for a campaign.
         role: 'dm' | 'player'
         onState: callback(state) called on every state update
         Returns a { leave() } handle.

     .broadcastState(campaignId, state)
       → DM calls this to push current map state to all players.
         Debounced 150ms internally.

     .saveSnapshot(campaignId, state)
       → Persists current map state to DB so late-joining players
         can load it. Called by DM periodically (every 5s).

     .loadSnapshot(campaignId)
       → Returns Promise<state|null>. Players call on join to get
         current map before live updates start flowing.

     .isOnline()
       → Returns true if Supabase realtime is connected.
   ═══════════════════════════════════════════════════════════════════ */
var PhmurtRealtime = (function () {

  var _channels    = {};   // campaignId → Supabase channel
  var _timers      = {};   // campaignId → debounce timer
  var _snapTimers  = {};   // campaignId → snapshot save timer
  var SYNC_KEY     = 'phmurt-battlemap-sync';  // localStorage fallback key (must match campaign-play.js)

  /* ── Supabase client ref ──────────────────────────────────────── */
  function _sb() {
    return (typeof phmurtSupabase !== 'undefined' && phmurtSupabase) ? phmurtSupabase : null;
  }

  /* ── Join battle map channel ──────────────────────────────────── */
  function joinBattleMap(campaignId, role, onState) {
    if (!campaignId) return { leave: function () {} };

    // SECURITY: Validate onState callback
    if (typeof onState !== 'function') {
      return { leave: function () {} };
    }

    var sb = _sb();

    if (sb) {
      /* ── Supabase Broadcast (real cross-device sync) ── */
      // Sanitize campaignId to prevent channel name injection
      var safeCampaignId = String(campaignId).replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 100);
      if (!safeCampaignId) return { leave: function () {} };
      var channelName = 'battle-map:' + safeCampaignId;

      // Clean up existing channel for this campaign if any
      if (_channels[campaignId]) {
        try { sb.removeChannel(_channels[campaignId]); } catch (e) { /* Channel cleanup may fail silently */ }
      }

      var channel = sb.channel(channelName, {
        config: { broadcast: { self: false, ack: false } }
      });

      channel.on('broadcast', { event: 'state' }, function (msg) {
        // SECURITY: Validate message structure before calling callback
        if (msg && typeof msg === 'object' && msg.payload && typeof onState === 'function') {
          try {
            onState(msg.payload);
          } catch (e) {
            console.warn('[PhmurtRealtime] onState callback error:', e);
          }
        }
      });

      // Also listen for DB snapshot updates (for late joiners via Realtime Postgres)
      if (role === 'player') {
        channel.on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'battle_map_snapshots', filter: 'campaign_id=eq.' + safeCampaignId },
          function (payload) {
            // SECURITY: Validate postgres change payload before using
            if (payload && typeof payload === 'object' && payload.new && typeof payload.new === 'object' &&
                payload.new.state && typeof onState === 'function') {
              try {
                onState(payload.new.state);
              } catch (e) {
                console.warn('[PhmurtRealtime] postgres_changes onState callback error:', e);
              }
            }
          }
        );
      }

      channel.subscribe(function (status) {
        if (status === 'SUBSCRIBED') {
          console.info('[PhmurtRealtime] Subscribed to', channelName, 'as', role);
        } else if (status === 'CHANNEL_ERROR') {
          console.warn('[PhmurtRealtime] Channel error on', channelName, '— falling back to localStorage poll');
          _startLocalStoragePoll(campaignId, role, onState);
        }
      });

      _channels[campaignId] = channel;

      return {
        leave: function () {
          if (_channels[campaignId]) {
            var currentSb = _sb();
            if (currentSb) {
              try { currentSb.removeChannel(_channels[campaignId]); } catch (e) { /* Channel cleanup may fail silently */ }
            }
            delete _channels[campaignId];
          }
          clearTimeout(_timers[campaignId]);
          clearTimeout(_snapTimers[campaignId]);
        }
      };

    } else {
      /* ── localStorage fallback (same device only) ── */
      console.info('[PhmurtRealtime] Supabase unavailable — using localStorage sync');
      return _startLocalStoragePoll(campaignId, role, onState);
    }
  }

  /* ── Broadcast state (DM → players) ──────────────────────────── */
  function broadcastState(campaignId, state) {
    if (!campaignId || !state || typeof state !== 'object') return;

    // Always write to localStorage for same-device fallback
    try { localStorage.setItem(SYNC_KEY + ':' + campaignId, JSON.stringify(state)); } catch (e) { /* localStorage may not be available or full */ }

    var sb = _sb();
    if (!sb) return;

    // Debounce 150ms to avoid flooding the channel
    clearTimeout(_timers[campaignId]);
    _timers[campaignId] = setTimeout(function () {
      var ch = _channels[campaignId];
      if (ch) {
        ch.send({
          type: 'broadcast',
          event: 'state',
          payload: state
        }).catch(function (e) {
          console.warn('[PhmurtRealtime] Broadcast failed:', e);
        });
      }
    }, 150);

    // Save DB snapshot every 5 seconds (so late-joiners can load state)
    // SECURITY: Clear pending snapshot timers to avoid stacking multiple saves
    clearTimeout(_snapTimers[campaignId]);
    _snapTimers[campaignId] = setTimeout(function () {
      // Ensure callback still has valid state reference
      if (campaignId && state && typeof state === 'object') {
        saveSnapshot(campaignId, state);
      }
    }, 5000);
  }

  /* ── Save snapshot to DB (persisted state) ────────────────────── */
  function saveSnapshot(campaignId, state) {
    var sb = _sb();
    if (!sb || !campaignId) return Promise.resolve(null);

    // SECURITY: Validate that the current user has an active session
    // before allowing snapshot writes. The RPC should also enforce
    // ownership via RLS, but we add client-side guard too.
    var auth = typeof PhmurtAuth !== 'undefined' ? PhmurtAuth : null;
    if (auth && typeof auth.getSession === 'function') {
      var sess = auth.getSession();
      if (!sess || !sess.userId) {
        console.warn('[PhmurtRealtime] Snapshot save blocked — no active session');
        return Promise.resolve(null);
      }
    }

    // SECURITY: Validate state object before sending
    if (!state || typeof state !== 'object') {
      console.warn('[PhmurtRealtime] Snapshot save blocked — invalid state');
      return Promise.resolve(null);
    }

    return sb.rpc('upsert_battle_map', {
      p_campaign_id: String(campaignId).slice(0, 100),
      p_state: state
    }).then(function (r) {
      if (r && r.error) {
        console.warn('[PhmurtRealtime] Snapshot save failed:', (r.error && r.error.message) || r.error);
      }
    }).catch(function (e) {
      console.warn('[PhmurtRealtime] Snapshot save error:', e);
    });
  }

  /* ── Load snapshot from DB (for players joining) ─────────────── */
  // SECURITY (V-035): Validate campaignId is not null/undefined before using
  function loadSnapshot(campaignId) {
    var sb = _sb();
    if (!campaignId) {
      return Promise.resolve(null);
    }

    if (!sb) {
      // Try localStorage fallback
      try {
        var raw = localStorage.getItem(SYNC_KEY + ':' + String(campaignId));
        return Promise.resolve(raw ? JSON.parse(raw) : null);
      } catch (e) { return Promise.resolve(null); }
    }

    return sb.from('battle_map_snapshots')
      .select('state, updated_at')
      .eq('campaign_id', String(campaignId))
      .maybeSingle()
      .then(function (r) {
        // SECURITY: Validate response structure before using
        if (!r || typeof r !== 'object') return null;
        if (r.error || !r.data || typeof r.data !== 'object') return null;
        return (r.data.state && typeof r.data.state === 'object') ? r.data.state : null;
      })
      .catch(function (e) {
        console.warn('[PhmurtRealtime] Snapshot load error:', e);
        return null;
      });
  }

  /* ── localStorage polling fallback ────────────────────────────── */
  // SECURITY (V-034): Ensure intervals are always cleaned up to prevent memory leaks
  function _startLocalStoragePoll(campaignId, role, onState) {
    if (role === 'dm') {
      return { leave: function () {} };
    }
    var lsKey = SYNC_KEY + ':' + campaignId;
    var _lastSeen = null;
    var _interval = null;
    var _isActive = true;

    _interval = setInterval(function () {
      if (!_isActive) return;
      try {
        var raw = localStorage.getItem(lsKey);
        if (raw && typeof raw === 'string' && raw !== _lastSeen) {
          _lastSeen = raw;
          try {
            var state = JSON.parse(raw);
            if (typeof onState === 'function' && _isActive) {
              onState(state);
            }
          } catch (parseError) {
            console.warn('[PhmurtRealtime] localStorage poll JSON parse error:', parseError);
          }
        }
      } catch (e) { /* localStorage access error */ }
    }, 250);

    return {
      leave: function () {
        _isActive = false;
        if (_interval) {
          clearInterval(_interval);
          _interval = null;
        }
      }
    };
  }

  /* ── Online check ─────────────────────────────────────────────── */
  function isOnline() {
    return !!_sb();
  }

  /* ── Public API ───────────────────────────────────────────────── */
  return {
    joinBattleMap:  joinBattleMap,
    broadcastState: broadcastState,
    saveSnapshot:   saveSnapshot,
    loadSnapshot:   loadSnapshot,
    isOnline:       isOnline
  };

})();
