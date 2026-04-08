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
   */
  function migrateCampaignData(data) {
    if (!data || typeof data !== "object") return data;
    var encountersOk = Array.isArray(data.encounters);
    var ledgerOk = Array.isArray(data.combatLedger);
    var verOk = data.battleIntegrationVersion === VERSION;
    var party = data.party || [];
    var npcs = data.npcs || [];
    var partyOk = !party.some(function (p) { return p.actorId == null; });
    var npcsOk = !npcs.some(function (n) { return n.actorId == null; });
    if (verOk && encountersOk && ledgerOk && partyOk && npcsOk) return data;

    return _safeAssign({}, data, {
      battleIntegrationVersion: VERSION,
      encounters: encountersOk ? data.encounters : [],
      combatLedger: ledgerOk ? data.combatLedger : [],
      party: party.map(function (p) {
        return p.actorId != null ? p : _safeAssign({}, p, { actorId: "pc-" + String(p.id) });
      }),
      npcs: npcs.map(function (n) {
        return n.actorId != null ? n : _safeAssign({}, n, { actorId: "npc-" + String(n.id) });
      }),
    });
  }

  /**
   * Participant in a saved encounter blueprint.
   * type: "partyAll" | "partyMember" | "npc" | "monster"
   */
  function normalizeEncounter(enc) {
    if (!enc || typeof enc !== "object") return null;
    return {
      id: enc.id || "enc-" + Date.now(),
      name: enc.name || "Encounter",
      location: enc.location || "",
      notes: enc.notes || "",
      participants: Array.isArray(enc.participants) ? enc.participants : [],
    };
  }

  function findPartyMember(party, ref) {
    if (ref == null) return null;
    var s = String(ref);
    for (var i = 0; i < party.length; i++) {
      var p = party[i];
      if (String(p.id) === s) return p;
      if (p.actorId != null && String(p.actorId) === s) return p;
    }
    return null;
  }

  function findNpc(npcs, npcId) {
    for (var i = 0; i < npcs.length; i++) {
      if (npcs[i].id === npcId) return npcs[i];
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

    var out = [];
    enc.participants.forEach(function (part) {
      if (!part || !part.type) return;
      if (part.type === "partyAll") {
        partyArr.forEach(function (p) {
          out.push({ kind: "pc", member: p });
        });
      } else if (part.type === "partyMember") {
        var pm = findPartyMember(partyArr, part.refId != null ? part.refId : part.actorId);
        if (pm) out.push({ kind: "pc", member: pm });
      } else if (part.type === "npc") {
        var n = findNpc(npcArr, part.npcId);
        if (n) out.push({ kind: "npc", npc: n });
      } else if (part.type === "monster") {
        var name = part.monsterName || part.name;
        if (!name) return;
        var found = null;
        for (var j = 0; j < srd.length; j++) {
          if (srd[j].name === name) {
            found = srd[j];
            break;
          }
        }
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
      var row = _safeAssign({}, entry, {
        id: "cl-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
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
        return _safeAssign({}, p);
      }),
    };
  }

  /**
   * Summarize token state for timeline / ledger (post-combat).
   */
  function summarizeTokensForLedger(tokens) {
    var lines = [];
    (tokens || []).forEach(function (t) {
      if (t.tokenType === "enemy" && t.hp != null && t.hp <= 0) {
        lines.push(t.name + " defeated");
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
      var ev = {
        id: "ce-" + Date.now(),
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
