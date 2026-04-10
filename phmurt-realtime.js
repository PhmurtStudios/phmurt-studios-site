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
  var SYNC_KEY     = 'phmurt_bm_sync';  // localStorage fallback key

  /* ── Supabase client ref ──────────────────────────────────────── */
  function _sb() {
    return (typeof phmurtSupabase !== 'undefined' && phmurtSupabase) ? phmurtSupabase : null;
  }

  /* ── Join battle map channel ──────────────────────────────────── */
  function joinBattleMap(campaignId, role, onState) {
    if (!campaignId) return { leave: function () {} };

    var sb = _sb();

    if (sb) {
      /* ── Supabase Broadcast (real cross-device sync) ── */
      // Sanitize campaignId to prevent channel name injection
      var safeCampaignId = String(campaignId).replace(/[^a-zA-Z0-9_\-]/g, '');
      var channelName = 'battle-map:' + safeCampaignId;

      // Clean up existing channel for this campaign if any
      if (_channels[campaignId]) {
        try { sb.removeChannel(_channels[campaignId]); } catch (e) {}
      }

      var channel = sb.channel(channelName, {
        config: { broadcast: { self: false, ack: false } }
      });

      channel.on('broadcast', { event: 'state' }, function (msg) {
        if (msg && msg.payload && typeof onState === 'function') {
          onState(msg.payload);
        }
      });

      // Also listen for DB snapshot updates (for late joiners via Realtime Postgres)
      if (role === 'player') {
        var safeFilterCampaignId = String(campaignId).replace(/[^a-zA-Z0-9_\-]/g, '');
        channel.on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'battle_map_snapshots', filter: 'campaign_id=eq.' + safeFilterCampaignId },
          function (payload) {
            if (payload.new && payload.new.state && typeof onState === 'function') {
              onState(payload.new.state);
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
            try { sb.removeChannel(_channels[campaignId]); } catch (e) {}
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
    if (!campaignId) return;

    // Always write to localStorage for same-device fallback
    try { localStorage.setItem(SYNC_KEY + ':' + campaignId, JSON.stringify(state)); } catch (e) {}

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
    clearTimeout(_snapTimers[campaignId]);
    _snapTimers[campaignId] = setTimeout(function () {
      saveSnapshot(campaignId, state);
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

    return sb.rpc('upsert_battle_map', {
      p_campaign_id: campaignId,
      p_state: state
    }).then(function (r) {
      if (r.error) console.warn('[PhmurtRealtime] Snapshot save failed:', r.error.message);
    }).catch(function (e) {
      console.warn('[PhmurtRealtime] Snapshot save error:', e);
    });
  }

  /* ── Load snapshot from DB (for players joining) ─────────────── */
  function loadSnapshot(campaignId) {
    var sb = _sb();
    if (!sb || !campaignId) {
      // Try localStorage
      try {
        var raw = localStorage.getItem(SYNC_KEY + ':' + campaignId);
        return Promise.resolve(raw ? JSON.parse(raw) : null);
      } catch (e) { return Promise.resolve(null); }
    }

    return sb.from('battle_map_snapshots')
      .select('state, updated_at')
      .eq('campaign_id', campaignId)
      .maybeSingle()
      .then(function (r) {
        if (r.error || !r.data) return null;
        return r.data.state;
      })
      .catch(function (e) {
        console.warn('[PhmurtRealtime] Snapshot load error:', e);
        return null;
      });
  }

  /* ── localStorage polling fallback ────────────────────────────── */
  function _startLocalStoragePoll(campaignId, role, onState) {
    if (role === 'dm') {
      return { leave: function () {} };
    }
    var lsKey = SYNC_KEY + ':' + campaignId;
    var _lastSeen = null;
    var _interval = null;

    _interval = setInterval(function () {
      try {
        var raw = localStorage.getItem(lsKey);
        if (raw && raw !== _lastSeen) {
          _lastSeen = raw;
          var state = JSON.parse(raw);
          if (typeof onState === 'function') onState(state);
        }
      } catch (e) {}
    }, 250);

    return {
      leave: function () {
        if (_interval) clearInterval(_interval);
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
