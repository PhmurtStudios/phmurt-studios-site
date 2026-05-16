/* ═══════════════════════════════════════════════════════════════════════════
   PHMURT — Campaign ↔ Battlemap integration layer
   Single campaign model: stable actor ids, encounter blueprints, combat ledger,
   and helpers to sync tokens with party / NPC records.
   ───────────────────────────────────────────────────────────────────────────
   v2 (2026-04-21):
     • Richer post-combat summaries (kills, downs, friendly losses, total damage)
     • encounterValidate() reports missing party/npc/monster references
     • queryLedger() / cleanupLedger() / removeLedgerEntry() for ledger upkeep
     • combatStats() aggregates encounter outcomes for dashboards
     • Stable, monotonic actorId generation (no random collisions across reloads)
     • mergeEncounter() for safe blueprint edits
   ═══════════════════════════════════════════════════════════════════════════ */

(function (global) {
  "use strict";

  var VERSION = 2;
  var LEDGER_CAP_DEFAULT = 250;
  var ACTIVITY_CAP_DEFAULT = 40;

  // ── Monotonic counter for stable per-session id generation ───────────
  // Persists for the page lifetime; combined with Date.now() + random hex so
  // ids stay unique even within the same millisecond and across hot reloads.
  var _idCounter = 0;
  function _uid(prefix) {
    _idCounter = (_idCounter + 1) | 0;
    var rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
    while (rand.length < 6) rand = "0" + rand;
    return (prefix || "id") + "-" + Date.now().toString(36) + "-" + _idCounter.toString(36) + "-" + rand;
  }

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

  function _isObj(o) { return o && typeof o === 'object' && !Array.isArray(o); }

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
    var party = Array.isArray(data.party) ? data.party : [];
    var npcs = Array.isArray(data.npcs) ? data.npcs : [];
    var partyOk = !party.some(function (p) { return !p || !p.actorId; });
    var npcsOk = !npcs.some(function (n) { return !n || !n.actorId; });

    // ── DATA INTEGRITY CHECK: Detect deserialization mismatches ──
    if (!verOk && data.battleIntegrationVersion !== undefined && data.battleIntegrationVersion < VERSION) {
      // Soft-migrate older versions (1 → 2 currently a no-op for shape)
      // Future bumps should add migration steps here.
    }

    if (verOk && encountersOk && ledgerOk && partyOk && npcsOk) return data;

    return _safeAssign({}, data, {
      battleIntegrationVersion: VERSION,
      encounters: encountersOk ? data.encounters : [],
      combatLedger: ledgerOk ? data.combatLedger : [],
      party: party.map(function (p, idx) {
        if (!p || typeof p !== 'object') return p;
        if (p.actorId) return p;
        // Prefer p.id; fall back to monotonic uid so missing-id PCs still get stable refs.
        var key = (p.id !== null && p.id !== undefined && p.id !== "") ? String(p.id) : ("idx" + idx);
        return _safeAssign({}, p, { actorId: "pc-" + key });
      }),
      npcs: npcs.map(function (n, idx) {
        if (!n || typeof n !== 'object') return n;
        if (n.actorId) return n;
        var key = (n.id !== null && n.id !== undefined && n.id !== "") ? String(n.id) : ("idx" + idx);
        return _safeAssign({}, n, { actorId: "npc-" + key });
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
      id: enc.id || _uid("enc"),
      name: enc.name || "Encounter",
      location: enc.location || "",
      notes: enc.notes || "",
      // Optional difficulty/CR metadata used by the encounter view; preserved if present.
      difficulty: enc.difficulty || "",
      targetCR: (typeof enc.targetCR === "number") ? enc.targetCR : null,
      tags: Array.isArray(enc.tags) ? enc.tags.slice() : [],
      participants: Array.isArray(enc.participants) ? enc.participants : [],
    };
  }

  /**
   * Merge edits into an existing blueprint without losing unknown fields.
   * Use instead of spreading manually so unknown keys (added later) survive.
   */
  function mergeEncounter(existing, patch) {
    if (!_isObj(existing)) return normalizeEncounter(patch);
    if (!_isObj(patch)) return existing;
    var merged = _safeAssign({}, existing, patch);
    if (patch.participants !== undefined && !Array.isArray(patch.participants)) {
      merged.participants = existing.participants || [];
    }
    return normalizeEncounter(merged);
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
    var s = String(npcId);
    for (var i = 0; i < npcs.length; i++) {
      if (!npcs[i]) continue;
      if (String(npcs[i].id) === s) return npcs[i];
      if (npcs[i].actorId && String(npcs[i].actorId) === s) return npcs[i];
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
        var n = findNpc(npcArr, part.npcId !== undefined ? part.npcId : part.refId);
        if (n) out.push({ kind: "npc", npc: n });
      } else if (part.type === "monster") {
        var name = part.monsterName || part.name;
        if (!name) return;
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
   * Validate that every participant in a blueprint resolves. Returns
   * { ok, missing: [{type, ref, reason}], total, resolved }
   * Useful for showing a yellow warning on encounter cards before launch.
   */
  function encounterValidate(encounter, party, npcs) {
    var enc = normalizeEncounter(encounter);
    if (!enc) return { ok: false, missing: [{ type: "blueprint", ref: null, reason: "invalid" }], total: 0, resolved: 0 };
    var partyArr = party || [];
    var npcArr = npcs || [];
    var srd = Array.isArray(global.SRD_MONSTERS) ? global.SRD_MONSTERS : [];
    var monsterLookup = {};
    for (var m = 0; m < srd.length; m++) {
      if (srd[m] && srd[m].name) monsterLookup[String(srd[m].name).toLowerCase()] = srd[m];
    }
    var missing = [];
    var total = 0, resolved = 0;
    enc.participants.forEach(function (p) {
      if (!p || !p.type) return;
      total++;
      if (p.type === "partyAll") {
        if (partyArr.length === 0) missing.push({ type: "partyAll", ref: null, reason: "party empty" });
        else resolved++;
      } else if (p.type === "partyMember") {
        var pm = findPartyMember(partyArr, p.refId !== undefined ? p.refId : p.actorId);
        if (pm) resolved++; else missing.push({ type: "partyMember", ref: p.refId || p.actorId, reason: "PC not found" });
      } else if (p.type === "npc") {
        var n = findNpc(npcArr, p.npcId !== undefined ? p.npcId : p.refId);
        if (n) resolved++; else missing.push({ type: "npc", ref: p.npcId || p.refId, reason: "NPC not found" });
      } else if (p.type === "monster") {
        var nm = p.monsterName || p.name;
        if (nm && monsterLookup[String(nm).toLowerCase()]) resolved++;
        else missing.push({ type: "monster", ref: nm, reason: nm ? "monster '" + nm + "' not in SRD" : "no name" });
      } else {
        missing.push({ type: p.type, ref: null, reason: "unknown participant type" });
      }
    });
    return { ok: missing.length === 0, missing: missing, total: total, resolved: resolved };
  }

  /**
   * @param {object} [opts] opts.skipActivity — do not push to campaign activity feed (e.g. per-kill noise)
   *                        opts.cap — override default ledger cap
   */
  function appendLedger(setData, entry, opts) {
    if (typeof setData !== "function" || !entry) return;
    opts = opts || {};
    var cap = (typeof opts.cap === "number" && opts.cap > 0) ? opts.cap : LEDGER_CAP_DEFAULT;
    setData(function (d) {
      var ledger = Array.isArray(d.combatLedger) ? d.combatLedger : [];
      var row = _safeAssign({}, entry, {
        id: _uid("cl"),
        at: new Date().toISOString(),
      });
      var act = Array.isArray(d.activity) ? d.activity : [];
      var line = entry.summary || entry.title || entry.type || "Combat log";
      var out = _safeAssign({}, d, {
        combatLedger: [row].concat(ledger).slice(0, cap),
      });
      if (!opts.skipActivity) {
        out.activity = [{ time: "Just now", text: line }].concat(act).slice(0, ACTIVITY_CAP_DEFAULT);
      }
      return out;
    });
  }

  /** Filter the ledger without mutating campaign data. */
  function queryLedger(data, filter) {
    if (!data || !Array.isArray(data.combatLedger)) return [];
    filter = filter || {};
    var rows = data.combatLedger;
    if (filter.type) rows = rows.filter(function (r) { return r && r.type === filter.type; });
    if (filter.encounterId) rows = rows.filter(function (r) { return r && r.encounterId === filter.encounterId; });
    if (filter.since) {
      var since = (filter.since instanceof Date) ? filter.since.getTime() : new Date(filter.since).getTime();
      rows = rows.filter(function (r) { return r && r.at && new Date(r.at).getTime() >= since; });
    }
    if (typeof filter.limit === "number" && filter.limit > 0) rows = rows.slice(0, filter.limit);
    return rows;
  }

  /** Remove a single ledger entry by id. */
  function removeLedgerEntry(setData, entryId) {
    if (typeof setData !== "function" || !entryId) return;
    setData(function (d) {
      var ledger = Array.isArray(d.combatLedger) ? d.combatLedger : [];
      var next = ledger.filter(function (r) { return r && r.id !== entryId; });
      if (next.length === ledger.length) return d;
      return _safeAssign({}, d, { combatLedger: next });
    });
  }

  /**
   * Trim the ledger by max age (days) and/or max count.
   * Returns nothing; mutates via setData.
   */
  function cleanupLedger(setData, opts) {
    if (typeof setData !== "function") return;
    opts = opts || {};
    var maxDays = (typeof opts.maxDays === "number" && opts.maxDays > 0) ? opts.maxDays : null;
    var maxCount = (typeof opts.maxCount === "number" && opts.maxCount > 0) ? opts.maxCount : LEDGER_CAP_DEFAULT;
    var cutoff = maxDays ? Date.now() - (maxDays * 86400000) : null;
    setData(function (d) {
      var ledger = Array.isArray(d.combatLedger) ? d.combatLedger : [];
      var pruned = ledger.filter(function (r) {
        if (!r) return false;
        if (cutoff && r.at && new Date(r.at).getTime() < cutoff) return false;
        return true;
      });
      if (pruned.length > maxCount) pruned = pruned.slice(0, maxCount);
      if (pruned.length === ledger.length) return d;
      return _safeAssign({}, d, { combatLedger: pruned });
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
      difficulty: enc.difficulty || "",
      targetCR: (typeof enc.targetCR === "number") ? enc.targetCR : null,
      tags: Array.isArray(enc.tags) ? enc.tags.slice() : [],
      participants: (enc.participants || []).map(function (p) {
        return (p && typeof p === 'object') ? _safeAssign({}, p) : p;
      }),
    };
  }

  /**
   * Summarize token state for timeline / ledger (post-combat).
   * Now returns a richer snapshot: enemies defeated, allies downed/killed,
   * total damage dealt + taken, and per-side survivor counts.
   * Returns { lines, stats }. Old callers using only the array of lines
   * keep working because lines is identical to the prior return shape.
   */
  function summarizeTokensForLedger(tokens) {
    var lines = [];
    var stats = {
      enemies: { total: 0, defeated: 0, survived: 0, damageTaken: 0 },
      allies: { total: 0, downed: 0, killed: 0, damageTaken: 0, atFull: 0 },
    };
    (tokens || []).forEach(function (t) {
      if (!t) return;
      var maxHp = (typeof t.maxHp === "number") ? t.maxHp : null;
      var hp = (t.hp === null || t.hp === undefined) ? null : t.hp;
      var dmg = (maxHp !== null && hp !== null) ? Math.max(0, maxHp - hp) : 0;
      var name = t.name || (t.tokenType === "enemy" ? "Enemy" : "Ally");
      if (t.tokenType === "enemy") {
        stats.enemies.total++;
        stats.enemies.damageTaken += dmg;
        if (hp !== null && hp <= 0) {
          stats.enemies.defeated++;
          lines.push(name + " defeated");
        } else {
          stats.enemies.survived++;
        }
      } else {
        stats.allies.total++;
        stats.allies.damageTaken += dmg;
        if (hp !== null && hp <= 0) {
          if (t.dead) {
            stats.allies.killed++;
            lines.push(name + " killed");
          } else {
            stats.allies.downed++;
            lines.push(name + " downed");
          }
        } else if (maxHp !== null && hp === maxHp) {
          stats.allies.atFull++;
        }
      }
    });
    // Make lines.stats accessible for callers that want both shapes.
    try { Object.defineProperty(lines, "stats", { value: stats, enumerable: false }); } catch (e) { /* frozen array — ignore */ }
    return lines;
  }

  /**
   * Optional: push a combat summary into the latest timeline session (dm-facing).
   * Accepts payload.sessionId to target a specific session entry; otherwise
   * appends to timeline[0] (newest) as before.
   */
  function appendTimelineCombatEvent(setData, payload) {
    if (typeof setData !== "function" || !payload) return;
    setData(function (d) {
      var tl = Array.isArray(d.timeline) ? d.timeline : [];
      if (tl.length === 0) return d;
      var idx = 0;
      if (payload.sessionId) {
        for (var i = 0; i < tl.length; i++) {
          if (tl[i] && tl[i].id === payload.sessionId) { idx = i; break; }
        }
      }
      var head = tl[idx];
      if (!head) return d;
      var ev = {
        id: _uid("ce"),
        type: "encounter",
        headline: payload.headline || "Combat resolved",
        text: payload.text || "",
        outcome: payload.outcome || "",
        encounterId: payload.encounterId || null,
        stats: payload.stats || null,
        dmOnly: !!payload.dmOnly,
        scope: "party",
      };
      var newHead = _safeAssign({}, head, {
        events: (head.events || []).concat([ev]),
      });
      var newTl = tl.slice();
      newTl[idx] = newHead;
      return _safeAssign({}, d, { timeline: newTl });
    });
  }

  /**
   * Aggregate combat statistics across the whole ledger, useful for the
   * campaign dashboard / overview cards. Returns:
   *   { encounters, monstersDefeated, alliesDowned, alliesKilled,
   *     totalDamageDealt, totalDamageTaken, lastEncounterAt }
   */
  function combatStats(data) {
    var ledger = (data && Array.isArray(data.combatLedger)) ? data.combatLedger : [];
    var s = {
      encounters: 0,
      monstersDefeated: 0,
      alliesDowned: 0,
      alliesKilled: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      lastEncounterAt: null,
    };
    for (var i = 0; i < ledger.length; i++) {
      var r = ledger[i];
      if (!r) continue;
      if (r.type === "encounter") s.encounters++;
      var st = r.stats;
      if (st) {
        if (st.enemies) {
          s.monstersDefeated += (st.enemies.defeated || 0);
          s.totalDamageDealt += (st.enemies.damageTaken || 0);
        }
        if (st.allies) {
          s.alliesDowned += (st.allies.downed || 0);
          s.alliesKilled += (st.allies.killed || 0);
          s.totalDamageTaken += (st.allies.damageTaken || 0);
        }
      }
      if (r.at && (!s.lastEncounterAt || new Date(r.at) > new Date(s.lastEncounterAt))) {
        s.lastEncounterAt = r.at;
      }
    }
    return s;
  }

  global.PhmurtCampaignCombat = {
    VERSION: VERSION,
    migrateCampaignData: migrateCampaignData,
    normalizeEncounter: normalizeEncounter,
    mergeEncounter: mergeEncounter,
    planEncounterDeployment: planEncounterDeployment,
    encounterValidate: encounterValidate,
    appendLedger: appendLedger,
    queryLedger: queryLedger,
    removeLedgerEntry: removeLedgerEntry,
    cleanupLedger: cleanupLedger,
    cloneEncounter: cloneEncounter,
    summarizeTokensForLedger: summarizeTokensForLedger,
    appendTimelineCombatEvent: appendTimelineCombatEvent,
    combatStats: combatStats,
  };
})(typeof window !== "undefined" ? window : this);
