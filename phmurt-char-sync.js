/* ═══════════════════════════════════════════════════════════════════════════
   PHMURT CHARACTER SYNC  —  Bidirectional builder ↔ campaign live sync
   ═══════════════════════════════════════════════════════════════════════════
   Listens for character saves in the builder and pushes updates to every
   campaign containing that character.  Also exposes helpers for campaigns
   to push HP / condition / status changes back into a per-character
   "campaign state" blob so the builder can reflect live combat state.

   Public API  →  window.PhmurtCharSync
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";

  /* ── Event bus ───────────────────────────────────────────────────────── */
  var EVENT_CHAR_UPDATED   = "phmurt-character-updated";   // builder → campaigns
  var EVENT_CAMPAIGN_STATE  = "phmurt-campaign-state";      // campaign → builder
  var EVENT_SYNC_STATUS     = "phmurt-sync-status";         // UI feedback

  var _listeners = {};

  function on(evt, fn) {
    if (!_listeners[evt]) _listeners[evt] = [];
    _listeners[evt].push(fn);
  }
  function off(evt, fn) {
    if (!_listeners[evt]) return;
    _listeners[evt] = _listeners[evt].filter(function (f) { return f !== fn; });
  }
  function emit(evt, payload) {
    /* Internal listeners */
    (_listeners[evt] || []).forEach(function (fn) {
      try { fn(payload); } catch (e) { console.warn("[CharSync] listener error", e); }
    });
    /* DOM event for cross-component / cross-page */
    try {
      window.dispatchEvent(new CustomEvent(evt, { detail: payload }));
    } catch (e) { /* old browsers */ }
  }

  /* ── Snapshot diffing ────────────────────────────────────────────────── */
  /** Extracts the party-relevant fields from a full builder snapshot. */
  function extractPartyFields(snapshot, meta) {
    if (!snapshot) return null;
    var details   = snapshot.details  || {};
    var abilities = snapshot.abilities || {};
    var con       = parseInt(abilities.con, 10) || 10;
    var dex       = parseInt(abilities.dex, 10) || 10;
    var str       = parseInt(abilities.str, 10) || 10;
    var level     = parseInt(snapshot.level, 10) || 1;
    var conMod    = Math.floor((con - 10) / 2);
    var dexMod    = Math.floor((dex - 10) / 2);

    /* Compute max HP from builder data */
    var maxHp = _computeMaxHp(snapshot, conMod, level);

    return {
      name:    details.name || (meta && meta.name) || "Unnamed",
      cls:     _humanize(snapshot.cls || snapshot.class_ || (meta && meta.class) || ""),
      race:    _humanize(snapshot.race || (meta && meta.race) || ""),
      lv:      level,
      maxHp:   maxHp,
      ac:      Math.max(1, parseInt(snapshot.ac, 10) || (10 + dexMod)),
      str:     str,
      dex:     dex,
      con:     con,
      int:     parseInt(abilities.int, 10) || 10,
      wis:     parseInt(abilities.wis, 10) || 10,
      cha:     parseInt(abilities.cha, 10) || 10,
      bio:     details.backstory || details.bio || details.notes || "",
      player:  details.player || details.playerName || details.owner || "",
      /* Keep a digest so we can skip no-op syncs */
      _digest: null,
    };
  }

  function _computeMaxHp(snapshot, conMod, level) {
    /* If the builder stored explicit maxHp, trust it */
    if (snapshot.maxHp && parseInt(snapshot.maxHp, 10) > 0) return parseInt(snapshot.maxHp, 10);
    /* Estimate from hit dice + CON */
    var hitDie = 8; // d8 default
    var cls = (snapshot.cls || "").toLowerCase();
    if (cls === "barbarian") hitDie = 12;
    else if (cls === "fighter" || cls === "paladin" || cls === "ranger") hitDie = 10;
    else if (cls === "sorcerer" || cls === "wizard") hitDie = 6;
    /* Level 1 = max die + CON.  Subsequent levels = avg + CON each */
    var hp = hitDie + conMod;
    var avg = Math.floor(hitDie / 2) + 1;
    /* If hpRolls exist, use them */
    if (Array.isArray(snapshot.hpRolls) && snapshot.hpRolls.length > 0) {
      for (var i = 0; i < snapshot.hpRolls.length && i < level - 1; i++) {
        hp += (parseInt(snapshot.hpRolls[i], 10) || avg) + conMod;
      }
      /* Fill remaining levels with average */
      for (var j = snapshot.hpRolls.length; j < level - 1; j++) {
        hp += avg + conMod;
      }
    } else {
      for (var k = 1; k < level; k++) {
        hp += avg + conMod;
      }
    }
    /* Tough feat bonus */
    if (snapshot.toughBonus) hp += parseInt(snapshot.toughBonus, 10) || 0;
    return Math.max(1, hp);
  }

  function _humanize(s) {
    if (!s) return "";
    return s.replace(/[-_]/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  /** Compute a simple digest string so we skip duplicate pushes. */
  function digest(fields) {
    if (!fields) return "";
    return [fields.name, fields.cls, fields.lv, fields.maxHp, fields.ac,
            fields.str, fields.dex, fields.con].join("|");
  }

  /* ── Builder → Campaigns push ────────────────────────────────────────── */

  /**
   * Called from character-builder after every save.
   * Finds all campaigns that reference this character and patches them.
   *
   * @param {string}  characterId   The Supabase/localStorage character ID
   * @param {object}  snapshot      Full builder snapshot
   * @param {object}  [meta]        {name, class, race, level} from the character list row
   */
  function pushCharacterUpdate(characterId, snapshot, meta) {
    if (!characterId || !snapshot) return Promise.resolve();

    var fields = extractPartyFields(snapshot, meta);
    if (!fields) return Promise.resolve();
    fields._digest = digest(fields);

    /* Emit so any open campaign manager can react instantly */
    emit(EVENT_CHAR_UPDATED, {
      characterId: String(characterId),
      fields: fields,
      snapshot: snapshot,
      at: Date.now(),
    });

    /* Also write to localStorage as a "mailbox" for tabs that aren't listening yet */
    _writeMailbox(characterId, fields);

    /* If PhmurtDB is available and user is signed in, do a server-side fan-out:
       load all campaigns, patch matching party members, save back. */
    return _serverFanOut(characterId, fields);
  }

  /** Lightweight localStorage mailbox for cross-tab sync */
  function _writeMailbox(characterId, fields) {
    try {
      var key = "phmurt_charsync_" + characterId;
      localStorage.setItem(key, JSON.stringify({
        fields: fields,
        at: Date.now(),
      }));
    } catch (e) { /* quota */ }
  }

  function _readMailbox(characterId) {
    try {
      var key = "phmurt_charsync_" + characterId;
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      /* Stale after 5 minutes */
      if (Date.now() - (obj.at || 0) > 300000) return null;
      return obj.fields || null;
    } catch (e) { return null; }
  }

  /** Server-side fan-out: patch all campaigns on Supabase. */
  function _serverFanOut(characterId, fields) {
    if (typeof PhmurtDB === "undefined" || !PhmurtDB.getSession || !PhmurtDB.getSession()) {
      return Promise.resolve();
    }
    if (typeof PhmurtDB.getCampaigns !== "function") return Promise.resolve();

    return PhmurtDB.getCampaigns().then(function (campaigns) {
      if (!Array.isArray(campaigns) || campaigns.length === 0) return;

      var cid = String(characterId);
      var saves = [];
      campaigns.forEach(function (camp) {
        if (!camp || !camp.data || !Array.isArray(camp.data.party)) return;
        var changed = false;
        camp.data.party = camp.data.party.map(function (member) {
          if (String(member.sourceCharacterId) !== cid) return member;
          /* Skip if digest matches (no real changes) */
          if (member._syncDigest && member._syncDigest === fields._digest) return member;
          changed = true;
          return Object.assign({}, member, {
            name:    fields.name   || member.name,
            cls:     fields.cls    || member.cls,
            race:    fields.race   || member.race,
            lv:      fields.lv     || member.lv,
            maxHp:   fields.maxHp  || member.maxHp,
            /* Clamp current HP to new maxHp */
            hp:      Math.min(member.hp || member.maxHp, fields.maxHp || member.maxHp),
            ac:      fields.ac     || member.ac,
            str:     fields.str    || member.str,
            dex:     fields.dex    || member.dex,
            con:     fields.con,
            bio:     fields.bio    || member.bio,
            player:  fields.player || member.player,
            _syncDigest: fields._digest,
            _lastSyncAt: Date.now(),
          });
        });
        if (changed) {
          camp.data.activity = [
            { time: "Just now", text: fields.name + " synced from Character Builder" },
          ].concat((camp.data.activity || []).slice(0, 39));
          saves.push(PhmurtDB.saveCampaign(typeof cmCompactForCloud === "function" ? cmCompactForCloud(camp.data || camp) : (camp.data || camp)));
        }
      });
      return Promise.all(saves);
    }).catch(function (e) {
      console.warn("[CharSync] server fan-out failed", e);
    });
  }

  /* ── Campaign → Builder push (bidirectional) ─────────────────────────── */

  /**
   * Called from campaign manager when HP, conditions, status, or notes
   * change during gameplay.  Writes a per-character "campaign state" blob.
   *
   * @param {string} characterId    sourceCharacterId on the party member
   * @param {string} campaignId     which campaign
   * @param {object} state          { hp, maxHp, conditions, tempHp, deathSaves, notes }
   */
  function pushCampaignState(characterId, campaignId, state) {
    if (!characterId) return;

    var payload = {
      characterId: String(characterId),
      campaignId:  String(campaignId || ""),
      state:       state || {},
      at:          Date.now(),
    };

    /* Emit so an open builder can react */
    emit(EVENT_CAMPAIGN_STATE, payload);

    /* Persist in localStorage for cross-tab */
    try {
      var key = "phmurt_campstate_" + characterId;
      var existing = {};
      try { existing = JSON.parse(localStorage.getItem(key)) || {}; } catch (e) {}
      existing[campaignId] = { state: state, at: Date.now() };
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) { /* quota */ }
  }

  /**
   * Read the latest campaign states for a character (used by builder).
   * Returns { campaignId: { state, at } }
   */
  function getCampaignStates(characterId) {
    if (!characterId) return {};
    try {
      var key = "phmurt_campstate_" + characterId;
      return JSON.parse(localStorage.getItem(key)) || {};
    } catch (e) { return {}; }
  }

  /* ── Polling / mailbox check for campaigns that open after a save ─── */

  /**
   * Campaign manager calls this on mount to check if any party members
   * have pending builder updates in the mailbox.
   *
   * @param {Array} party   campaign party array
   * @returns {Array}       patched party array (or same reference if nothing changed)
   */
  function applyPendingUpdates(party) {
    if (!Array.isArray(party) || party.length === 0) return party;
    var changed = false;
    var updated = party.map(function (member) {
      if (!member.sourceCharacterId) return member;
      var pending = _readMailbox(member.sourceCharacterId);
      if (!pending) return member;
      if (member._syncDigest && member._syncDigest === pending._digest) return member;
      changed = true;
      return Object.assign({}, member, {
        name:    pending.name   || member.name,
        cls:     pending.cls    || member.cls,
        race:    pending.race   || member.race,
        lv:      pending.lv     || member.lv,
        maxHp:   pending.maxHp  || member.maxHp,
        hp:      Math.min(member.hp || member.maxHp, pending.maxHp || member.maxHp),
        ac:      pending.ac     || member.ac,
        str:     pending.str    || member.str,
        dex:     pending.dex    || member.dex,
        con:     pending.con,
        bio:     pending.bio    || member.bio,
        player:  pending.player || member.player,
        _syncDigest: pending._digest,
        _lastSyncAt: Date.now(),
      });
    });
    return changed ? updated : party;
  }

  /* ── Cross-tab listener (storage events) ─────────────────────────────── */
  window.addEventListener("storage", function (e) {
    if (!e.key) return;

    /* Builder save mailbox changed */
    if (e.key.indexOf("phmurt_charsync_") === 0) {
      var cid = e.key.replace("phmurt_charsync_", "");
      try {
        var obj = JSON.parse(e.newValue);
        if (obj && obj.fields) {
          emit(EVENT_CHAR_UPDATED, {
            characterId: cid,
            fields: obj.fields,
            at: obj.at || Date.now(),
          });
        }
      } catch (ex) { /* corrupt */ }
    }

    /* Campaign state changed */
    if (e.key.indexOf("phmurt_campstate_") === 0) {
      var charId = e.key.replace("phmurt_campstate_", "");
      try {
        var states = JSON.parse(e.newValue) || {};
        Object.keys(states).forEach(function (campId) {
          emit(EVENT_CAMPAIGN_STATE, {
            characterId: charId,
            campaignId: campId,
            state: states[campId].state,
            at: states[campId].at,
          });
        });
      } catch (ex) { /* corrupt */ }
    }
  });

  /* ── Public API ──────────────────────────────────────────────────────── */
  global.PhmurtCharSync = {
    /* Events */
    EVENT_CHAR_UPDATED:   EVENT_CHAR_UPDATED,
    EVENT_CAMPAIGN_STATE: EVENT_CAMPAIGN_STATE,
    EVENT_SYNC_STATUS:    EVENT_SYNC_STATUS,
    on:  on,
    off: off,

    /* Builder → Campaign */
    pushCharacterUpdate:   pushCharacterUpdate,
    extractPartyFields:    extractPartyFields,
    applyPendingUpdates:   applyPendingUpdates,

    /* Campaign → Builder */
    pushCampaignState:     pushCampaignState,
    getCampaignStates:     getCampaignStates,
  };

})(typeof window !== "undefined" ? window : this);
