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
    // SECURITY: Validate event and listener parameters
    if (!evt || typeof evt !== 'string' || typeof fn !== 'function') return;
    if (!_listeners[evt]) _listeners[evt] = [];
    _listeners[evt].push(fn);
  }
  function off(evt, fn) {
    // SECURITY: Validate event and listener parameters
    if (!evt || typeof evt !== 'string' || typeof fn !== 'function') return;
    if (!_listeners[evt]) return;
    _listeners[evt] = _listeners[evt].filter(function (f) { return f !== fn; });
  }
  // SECURITY (V-036): Emit function properly cleans up listener list on error
  function emit(evt, payload) {
    // SECURITY: Validate event name to prevent injection
    if (!evt || typeof evt !== 'string') return;
    evt = String(evt).slice(0, 100);

    /* Internal listeners */
    var listeners = _listeners[evt] || [];
    for (var i = listeners.length - 1; i >= 0; i--) {
      try {
        if (typeof listeners[i] === 'function') {
          listeners[i](payload);
        }
      } catch (e) {
        console.warn("[CharSync] listener error", e);
        // Remove listener that throws errors to prevent spam and memory issues
        listeners.splice(i, 1);
      }
    }
    /* DOM event for cross-component / cross-page */
    try {
      var customEvent = new CustomEvent(evt, { detail: payload });
      if (window && typeof window.dispatchEvent === 'function') {
        window.dispatchEvent(customEvent);
      }
    } catch (e) { /* old browsers or other error */ }
  }

  /* ── Snapshot diffing ────────────────────────────────────────────────── */
  /** Extracts the party-relevant fields from a full builder snapshot. */
  function extractPartyFields(snapshot, meta) {
    if (!snapshot || typeof snapshot !== 'object') return null;
    // SECURITY (V-042): Log edition for debugging cross-edition sync issues
    var edition = String(snapshot.edition || '5e').slice(0, 20);
    var details   = (snapshot.details && typeof snapshot.details === 'object') ? snapshot.details : {};
    var abilities = (snapshot.abilities && typeof snapshot.abilities === 'object') ? snapshot.abilities : {};
    var con       = Math.max(1, Math.min(30, parseInt(abilities.con, 10) || 10));
    var dex       = Math.max(1, Math.min(30, parseInt(abilities.dex, 10) || 10));
    var str       = Math.max(1, Math.min(30, parseInt(abilities.str, 10) || 10));
    var level     = Math.max(1, Math.min(20, parseInt(snapshot.level, 10) || 1));
    var conMod    = Math.floor((con - 10) / 2);
    var dexMod    = Math.floor((dex - 10) / 2);

    /* Compute max HP from builder data */
    var maxHp = _computeMaxHp(snapshot, conMod, level, edition);

    // INTEGRATION (V-002): Include combat-critical fields for proper combat resolution
    var damageResistances = snapshot.damageResistances || [];
    var damageImmunities = snapshot.damageImmunities || [];
    var damageVulnerabilities = snapshot.damageVulnerabilities || [];
    var conditionImmunities = snapshot.conditionImmunities || [];

    // Normalize to strings for storage (arrays may be serialized from builder)
    if (Array.isArray(damageResistances)) damageResistances = damageResistances.join('; ');
    if (Array.isArray(damageImmunities)) damageImmunities = damageImmunities.join('; ');
    if (Array.isArray(damageVulnerabilities)) damageVulnerabilities = damageVulnerabilities.join('; ');
    if (Array.isArray(conditionImmunities)) conditionImmunities = conditionImmunities.join(', ');

    return {
      name:    details.name || (meta && meta.name) || "Unnamed",
      cls:     _humanize(snapshot.cls || snapshot.class_ || (meta && meta.class) || ""),
      race:    _humanize(snapshot.race || (meta && meta.race) || ""),
      lv:      level,
      maxHp:   maxHp,
      // SECURITY (V-045): AC extraction works for both 5e and 3.5e (both store snapshot.ac)
      ac:      Math.max(1, parseInt(snapshot.ac, 10) || (10 + dexMod)),
      str:     str,
      dex:     dex,
      con:     con,
      int:     parseInt(abilities.int, 10) || 10,
      wis:     parseInt(abilities.wis, 10) || 10,
      cha:     parseInt(abilities.cha, 10) || 10,
      bio:     details.backstory || details.bio || details.notes || "",
      player:  details.player || details.playerName || details.owner || "",
      edition: edition,
      // INTEGRATION (V-003): Combat resistances and immunities for proper damage/condition resolution
      damageResistances: damageResistances,
      damageImmunities: damageImmunities,
      damageVulnerabilities: damageVulnerabilities,
      conditionImmunities: conditionImmunities,
      /* Keep a digest so we can skip no-op syncs */
      _digest: null,
    };
  }

  function _computeMaxHp(snapshot, conMod, level, edition) {
    if (!snapshot || typeof snapshot !== 'object') return 10;
    edition = String(edition || '5e').slice(0, 20);
    /* If the builder stored explicit maxHp, trust it */
    var explicitHp = parseInt(snapshot.maxHp, 10);
    if (!isNaN(explicitHp) && explicitHp > 0) {
      return Math.max(1, Math.min(1000, explicitHp));
    }
    /* Estimate from hit dice + CON */
    var hitDie = 8; // d8 default (5e standard)
    var cls = String(snapshot.cls || "").toLowerCase().slice(0, 50);

    // SECURITY (V-043): Use edition-specific hit die tables
    if (edition === '3.5') {
      // 3.5e hit dice
      if (cls === "barbarian") hitDie = 12;
      else if (cls === "fighter" || cls === "paladin" || cls === "ranger") hitDie = 10;
      else if (cls === "rogue" || cls === "monk") hitDie = 8;
      else if (cls === "sorcerer" || cls === "wizard") hitDie = 4;
      else hitDie = 8;
    } else {
      // 5e hit dice (SRD default)
      if (cls === "barbarian") hitDie = 12;
      else if (cls === "fighter" || cls === "paladin" || cls === "ranger") hitDie = 10;
      else if (cls === "sorcerer" || cls === "wizard") hitDie = 6;
      else hitDie = 8;
    }
    /* Level 1 = max die + CON.  Subsequent levels = avg + CON each */
    level = Math.max(1, Math.min(20, level));
    conMod = Math.max(-5, Math.min(5, conMod));
    var hp = hitDie + conMod;
    var avg = Math.floor(hitDie / 2) + 1;
    /* If hpRolls exist, use them */
    if (Array.isArray(snapshot.hpRolls) && snapshot.hpRolls.length > 0) {
      for (var i = 0; i < snapshot.hpRolls.length && i < level - 1; i++) {
        var roll = parseInt(snapshot.hpRolls[i], 10);
        hp += (!isNaN(roll) ? Math.max(1, roll) : avg) + conMod;
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
    var toughBonus = parseInt(snapshot.toughBonus, 10);
    if (!isNaN(toughBonus) && toughBonus > 0) {
      hp += Math.min(20, toughBonus);
    }
    return Math.max(1, Math.min(1000, hp));
  }

  function _humanize(s) {
    if (!s) return "";
    return s.replace(/[-_]/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  /** Compute a simple digest string so we skip duplicate pushes. */
  function digest(fields) {
    if (!fields) return "";
    // INTEGRATION (V-012): Include combat resistances/immunities in digest
    return [fields.name, fields.cls, fields.lv, fields.maxHp, fields.ac,
            fields.str, fields.dex, fields.con,
            fields.damageResistances || '', fields.damageImmunities || '',
            fields.damageVulnerabilities || '', fields.conditionImmunities || ''].join("|");
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
  // SECURITY (V-037): Sanitize characterId to prevent injection/XSS
  function _writeMailbox(characterId, fields) {
    try {
      // SECURITY: Validate characterId format
      var safeCid = String(characterId || '').replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 100);
      if (!safeCid) return;
      var key = "phmurt_charsync_" + safeCid;
      localStorage.setItem(key, JSON.stringify({
        fields: fields,
        at: Date.now(),
      }));
    } catch (e) { /* quota or other storage error */ }
  }

  // SECURITY (V-038): Validate parsed object structure before using
  function _readMailbox(characterId) {
    try {
      // SECURITY: Validate characterId format
      var safeCid = String(characterId || '').replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 100);
      if (!safeCid) return null;
      var key = "phmurt_charsync_" + safeCid;
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
      /* Stale after 5 minutes */
      var age = Date.now() - (Number(obj.at) || 0);
      if (age > 300000 || age < 0) return null;
      return (obj.fields && typeof obj.fields === 'object') ? obj.fields : null;
    } catch (e) { return null; }
  }

  /** Server-side fan-out: patch all campaigns on Supabase. */
  function _serverFanOut(characterId, fields) {
    if (typeof PhmurtDB === "undefined" || !PhmurtDB.getSession || !PhmurtDB.getSession()) {
      return Promise.resolve();
    }
    if (typeof PhmurtDB.getCampaigns !== "function") return Promise.resolve();

    return PhmurtDB.getCampaigns().then(function (campaigns) {
      if (!Array.isArray(campaigns) || campaigns.length === 0) return Promise.resolve();

      var cid = String(characterId);
      var saves = [];
      campaigns.forEach(function (camp) {
        // SECURITY: Validate campaign structure before modification
        if (!camp || typeof camp !== 'object' || !camp.data || typeof camp.data !== 'object') return;
        if (!Array.isArray(camp.data.party)) return;

        var changed = false;
        camp.data.party = camp.data.party.map(function (member) {
          if (!member || typeof member !== 'object') return member;
          if (String(member.sourceCharacterId || '') !== cid) return member;
          /* Skip if digest matches (no real changes) */
          if (member._syncDigest && member._syncDigest === fields._digest) return member;
          changed = true;
          // INTEGRATION (V-004): Sync combat-critical resistances/immunities to campaign
          return Object.assign({}, member, {
            name:    fields.name   || member.name,
            cls:     fields.cls    || member.cls,
            race:    fields.race   || member.race,
            lv:      fields.lv     || member.lv,
            maxHp:   fields.maxHp  || member.maxHp,
            /* Clamp current HP to new maxHp */
            hp:      Math.min(Math.max(0, Number(member.hp) || 0), fields.maxHp || member.maxHp || 1),
            ac:      fields.ac     || member.ac,
            str:     fields.str    || member.str,
            dex:     fields.dex    || member.dex,
            con:     fields.con    || member.con,
            bio:     fields.bio    || member.bio,
            player:  fields.player || member.player,
            // INTEGRATION (V-005): Include combat resistances/immunities in campaign party member
            damageResistances: fields.damageResistances !== undefined ? fields.damageResistances : member.damageResistances,
            damageImmunities: fields.damageImmunities !== undefined ? fields.damageImmunities : member.damageImmunities,
            damageVulnerabilities: fields.damageVulnerabilities !== undefined ? fields.damageVulnerabilities : member.damageVulnerabilities,
            conditionImmunities: fields.conditionImmunities !== undefined ? fields.conditionImmunities : member.conditionImmunities,
            _syncDigest: fields._digest,
            _lastSyncAt: Date.now(),
          });
        });
        if (changed) {
          var activityText = String(fields.name || 'Character') + " synced from Character Builder";
          var newActivity = { time: "Just now", text: activityText.slice(0, 200) };
          var priorActivity = Array.isArray(camp.data.activity) ? camp.data.activity.slice(0, 39) : [];
          camp.data.activity = [newActivity].concat(priorActivity);
          var savePayload = typeof cmCompactForCloud === "function" ? cmCompactForCloud(camp.data || camp) : (camp.data || camp);
          if (savePayload && typeof savePayload === 'object') {
            saves.push(PhmurtDB.saveCampaign(savePayload));
          }
        }
      });
      return Promise.all(saves);
    }).catch(function (e) {
      console.warn("[CharSync] server fan-out failed", e);
      return Promise.resolve();
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
      state:       (state && typeof state === 'object') ? state : {},
      at:          Date.now(),
    };

    /* Emit so an open builder can react */
    emit(EVENT_CAMPAIGN_STATE, payload);

    /* Persist in localStorage for cross-tab */
    try {
      // SECURITY: Sanitize characterId
      var safeCid = String(characterId || '').replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 100);
      if (!safeCid) return;
      var key = "phmurt_campstate_" + safeCid;
      var existing = {};
      try {
        var raw = localStorage.getItem(key);
        existing = (raw && typeof raw === 'string') ? (JSON.parse(raw) || {}) : {};
        if (!existing || typeof existing !== 'object' || Array.isArray(existing)) {
          existing = {};
        }
      } catch (e) { /* localStorage may not be available */ }
      // SECURITY: Sanitize campaignId as key
      var safeCampId = String(campaignId || '').replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 100);
      if (safeCampId) {
        existing[safeCampId] = { state: payload.state, at: Date.now() };
      }
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) { /* quota or other storage error */ }
  }

  /**
   * Read the latest campaign states for a character (used by builder).
   * Returns { campaignId: { state, at } }
   * SECURITY (V-039): Validate parsed object before use
   */
  function getCampaignStates(characterId) {
    if (!characterId) return {};
    try {
      // SECURITY: Sanitize characterId
      var safeCid = String(characterId || '').replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 100);
      if (!safeCid) return {};
      var key = "phmurt_campstate_" + safeCid;
      var raw = localStorage.getItem(key);
      if (!raw || typeof raw !== 'string') return {};
      var obj = JSON.parse(raw);
      // Ensure we got back a plain object, not an array or primitive
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        return obj;
      }
      return {};
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
      // SECURITY: Validate member structure
      if (!member || typeof member !== 'object' || !member.sourceCharacterId) return member;
      var pending = _readMailbox(member.sourceCharacterId);
      if (!pending || typeof pending !== 'object') return member;
      if (member._syncDigest && member._syncDigest === pending._digest) return member;
      changed = true;
      // INTEGRATION (V-006): Apply combat resistances/immunities from pending updates
      return Object.assign({}, member, {
        name:    pending.name   || member.name,
        cls:     pending.cls    || member.cls,
        race:    pending.race   || member.race,
        lv:      pending.lv     || member.lv,
        maxHp:   pending.maxHp  || member.maxHp,
        hp:      Math.min(Math.max(0, Number(member.hp) || 0), pending.maxHp || member.maxHp || 1),
        ac:      pending.ac     || member.ac,
        str:     pending.str    || member.str,
        dex:     pending.dex    || member.dex,
        con:     pending.con    || member.con,
        bio:     pending.bio    || member.bio,
        player:  pending.player || member.player,
        damageResistances: pending.damageResistances !== undefined ? pending.damageResistances : member.damageResistances,
        damageImmunities: pending.damageImmunities !== undefined ? pending.damageImmunities : member.damageImmunities,
        damageVulnerabilities: pending.damageVulnerabilities !== undefined ? pending.damageVulnerabilities : member.damageVulnerabilities,
        conditionImmunities: pending.conditionImmunities !== undefined ? pending.conditionImmunities : member.conditionImmunities,
        _syncDigest: pending._digest,
        _lastSyncAt: Date.now(),
      });
    });
    return changed ? updated : party;
  }

  /* ── Cross-tab listener (storage events) ─────────────────────────────── */
  // SECURITY (V-040): Validate storage event data before using
  window.addEventListener("storage", function (e) {
    if (!e || !e.key || typeof e.key !== 'string') return;

    /* Builder save mailbox changed */
    if (e.key.indexOf("phmurt_charsync_") === 0) {
      var cid = e.key.replace("phmurt_charsync_", "").slice(0, 100);
      try {
        if (!e.newValue || typeof e.newValue !== 'string') return;
        var obj = JSON.parse(e.newValue);
        if (obj && typeof obj === 'object' && !Array.isArray(obj) && obj.fields && typeof obj.fields === 'object') {
          emit(EVENT_CHAR_UPDATED, {
            characterId: String(cid),
            fields: obj.fields,
            at: (typeof obj.at === 'number') ? obj.at : Date.now(),
          });
        }
      } catch (ex) { /* corrupt */ }
    }

    /* Campaign state changed */
    if (e.key.indexOf("phmurt_campstate_") === 0) {
      var charId = e.key.replace("phmurt_campstate_", "").slice(0, 100);
      try {
        if (!e.newValue || typeof e.newValue !== 'string') return;
        var states = JSON.parse(e.newValue);
        if (!states || typeof states !== 'object' || Array.isArray(states)) return;
        Object.keys(states).forEach(function (campId) {
          // SECURITY: Limit campaign ID key length
          var safeCampId = String(campId).slice(0, 100);
          var stateEntry = states[campId];
          if (stateEntry && typeof stateEntry === 'object') {
            emit(EVENT_CAMPAIGN_STATE, {
              characterId: String(charId),
              campaignId: safeCampId,
              state: (stateEntry.state && typeof stateEntry.state === 'object') ? stateEntry.state : {},
              at: (typeof stateEntry.at === 'number') ? stateEntry.at : Date.now(),
            });
          }
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
