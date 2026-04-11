/* ═══════════════════════════════════════════════════════════════════════════
   PHMURT — Campaign ↔ Battlemap integration layer
   Single campaign model: stable actor ids, encounter blueprints, combat ledger,
   and helpers to sync tokens with party / NPC records.
   ═══════════════════════════════════════════════════════════════════════════ */

(function (global) {
  "use strict";

  var VERSION = 1;

  // SECURITY (V-016): Sanitize object keys to prevent prototype pollution
  function _safeAssign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i];
      if (src && typeof src === 'object') {
        Object.keys(src).forEach(function(key) {
          if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype') {
            target[key] = src[key];
          }
        });
      }
    }
    return target;
  }

  /**
   * Ensure campaign JSON has integration fields and stable actorId on party/npcs.
   * Returns the same reference if nothing changed.
   * ── CRITICAL FIX: Validate deserialized data to detect module version mismatches ──
   */
  function migrateCampaignData(data) {
    if (!data || typeof data !== "object") return data;
    var encountersOk = Array.isArray(data.encounters);
    var ledgerOk = Array.isArray(data.combatLedger);
    var verOk = data.battleIntegrationVersion === VERSION;
    var party = data.party || [];
    var npcs = data.npcs || [];
    var partyOk = !party.some(function (p) { return !p || !p.actorId; });
    var npcsOk = !npcs.some(function (n) { return !n || !n.actorId; });

    // ── DATA INTEGRITY CHECK: Detect deserialization mismatches ──
    // If version mismatch or fields missing, data may have been corrupted by old code.
    if (!verOk && data.battleIntegrationVersion !== undefined) {
      console.warn("[BattleIntegration] Version mismatch: expected", VERSION, "got", data.battleIntegrationVersion);
    }

    if (verOk && encountersOk && ledgerOk && partyOk && npcsOk) return data;

    // ── ATOMICITY FIX: Return fresh object with all required fields ──
    // Don't mutate input; create new object with validated structure.
    return _safeAssign({}, data, {
      battleIntegrationVersion: VERSION,
      encounters: encountersOk ? data.encounters : [],
      combatLedger: ledgerOk ? data.combatLedger : [],
      party: party.map(function (p) {
        if (!p || typeof p !== 'object') return p;
        return (p.actorId) ? p : _safeAssign({}, p, { actorId: "pc-" + String(p.id) });
      }),
      npcs: npcs.map(function (n) {
        if (!n || typeof n !== 'object') return n;
        return (n.actorId) ? n : _safeAssign({}, n, { actorId: "npc-" + String(n.id) });
      }),
    });
  }

  /**
   * Participant in a saved encounter blueprint.
   * type: "partyAll" | "partyMember" | "npc" | "monster"
   */
  function normalizeEncounter(enc) {
    if (!enc || typeof enc !== "object") return null;
    var randomId = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
    return {
      id: enc.id || "enc-" + Date.now() + "-" + randomId,
      name: enc.name || "Encounter",
      location: enc.location || "",
      notes: enc.notes || "",
      participants: Array.isArray(enc.participants) ? enc.participants : [],
    };
  }

  function findPartyMember(party, ref) {
    if (ref === null || ref === undefined || !Array.isArray(party)) return null;
    var s = String(ref);
    for (var i = 0; i < party.length; i++) {
      var p = party[i];
      if (!p || typeof p !== 'object') continue;
      if (String(p.id) === s) return p;
      if (p.actorId && String(p.actorId) === s) return p;
    }
    return null;
  }

  function findNpc(npcs, npcId) {
    if (!Array.isArray(npcs) || npcId === null || npcId === undefined) return null;
    for (var i = 0; i < npcs.length; i++) {
      if (npcs[i] && npcs[i].id === npcId) return npcs[i];
    }
    return null;
  }

  /**
   * Build a deployment plan: list of { kind, member?, npc?, monster? }
   */
  function planEncounterDeployment(encounter, party, npcs) {
    var enc = normalizeEncounter(encounter);
    if (!enc) return [];
    var partyArr = party || [];
    var npcArr = npcs || [];
    var srd = global.SRD_MONSTERS;
    if (!Array.isArray(srd)) srd = [];

    // Build monster lookup map for O(1) searches (case-insensitive for robustness)
    var monsterMap = {};
    var monsterLookup = {};
    for (var m = 0; m < srd.length; m++) {
      if (srd[m] && srd[m].name) {
        monsterMap[srd[m].name] = srd[m];
        monsterLookup[String(srd[m].name).toLowerCase()] = srd[m];
      }
    }

    var out = [];
    enc.participants.forEach(function (part) {
      if (!part || !part.type) return;
      if (part.type === "partyAll") {
        partyArr.forEach(function (p) {
          if (p && typeof p === 'object') {
            out.push({ kind: "pc", member: p });
          }
        });
      } else if (part.type === "partyMember") {
        var pm = findPartyMember(partyArr, part.refId !== null && part.refId !== undefined ? part.refId : part.actorId);
        if (pm) out.push({ kind: "pc", member: pm });
      } else if (part.type === "npc") {
        var n = findNpc(npcArr, part.npcId);
        if (n) out.push({ kind: "npc", npc: n });
      } else if (part.type === "monster") {
        var name = part.monsterName || part.name;
        if (!name) return;
        // SYSTEM FIX: Try exact match first, then case-insensitive fallback
        var found = monsterMap[name] || monsterLookup[String(name).toLowerCase()];
        if (found) {
          var cnt = Math.max(1, parseInt(part.count, 10) || 1);
          for (var k = 0; k < cnt; k++) out.push({ kind: "monster", monster: found });
        }
      }
    });
    return out;
  }

  /**
   * @param {object} [opts] opts.skipActivity — do not push to campaign activity feed (e.g. per-kill noise)
   */
  function appendLedger(setData, entry, opts) {
    if (typeof setData !== "function" || !entry) return;
    opts = opts || {};
    setData(function (d) {
      var ledger = Array.isArray(d.combatLedger) ? d.combatLedger : [];
      // Generate unique ID using timestamp and random component
      var randomPart = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
      var row = _safeAssign({}, entry, {
        id: "cl-" + Date.now() + "-" + randomPart,
        at: new Date().toISOString(),
      });
      var act = d.activity || [];
      var line = entry.summary || entry.title || entry.type || "Combat log";
      var out = _safeAssign({}, d, {
        combatLedger: [row].concat(ledger).slice(0, 250),
      });
      if (!opts.skipActivity) {
        out.activity = [{ time: "Just now", text: line }].concat(act).slice(0, 40);
      }
      return out;
    });
  }

  /** Merge encounter participants (e.g. after editing blueprint). */
  function cloneEncounter(enc) {
    if (!enc || typeof enc !== "object") return null;
    return {
      id: enc.id,
      name: enc.name,
      location: enc.location || "",
      notes: enc.notes || "",
      participants: (enc.participants || []).map(function (p) {
        return (p && typeof p === 'object') ? _safeAssign({}, p) : p;
      }),
    };
  }

  /**
   * Summarize token state for timeline / ledger (post-combat).
   */
  function summarizeTokensForLedger(tokens) {
    var lines = [];
    (tokens || []).forEach(function (t) {
      if (t && t.tokenType === "enemy" && t.hp !== null && t.hp <= 0) {
        lines.push((t.name || "Enemy") + " defeated");
      }
    });
    return lines;
  }

  /**
   * Optional: push a combat summary into the latest timeline session (dm-facing).
   */
  function appendTimelineCombatEvent(setData, payload) {
    if (typeof setData !== "function" || !payload) return;
    setData(function (d) {
      var tl = d.timeline || [];
      if (tl.length === 0) return d;
      var head = tl[0];
      var randomId = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
      var ev = {
        id: "ce-" + Date.now() + "-" + randomId,
        type: "encounter",
        headline: payload.headline || "Combat resolved",
        text: payload.text || "",
        outcome: payload.outcome || "",
        dmOnly: !!payload.dmOnly,
        scope: "party",
      };
      var newHead = _safeAssign({}, head, {
        events: (head.events || []).concat([ev]),
      });
      return _safeAssign({}, d, {
        timeline: [newHead].concat(tl.slice(1)),
      });
    });
  }

  global.PhmurtCampaignCombat = {
    VERSION: VERSION,
    migrateCampaignData: migrateCampaignData,
    normalizeEncounter: normalizeEncounter,
    planEncounterDeployment: planEncounterDeployment,
    appendLedger: appendLedger,
    cloneEncounter: cloneEncounter,
    summarizeTokensForLedger: summarizeTokensForLedger,
    appendTimelineCombatEvent: appendTimelineCombatEvent,
  };
})(typeof window !== "undefined" ? window : this);
