/* ═══════════════════════════════════════════════════════════════════════════
   PHMURT STUDIOS — COMBAT FLOW UI
   Floating combat text, action resolution display, enhanced combat log
   formatting, and DM/Player view helpers.

   Integrates with CombatEngine (dice, attacks, saves) and the Battlemap
   canvas render loop.  All state lives on window.CombatFlowUI.
   ═══════════════════════════════════════════════════════════════════════════ */

window.CombatFlowUI = (() => {
  "use strict";

  // ─── DAMAGE TYPE VISUAL CONFIG ─────────────────────────────────────────────

  const DAMAGE_TYPE_CONFIG = {
    fire:         { color: "#ff4500", glow: "#ff6347", icon: "⟡", label: "Fire" },
    cold:         { color: "#00bfff", glow: "#87ceeb", icon: "✧",  label: "Cold" },
    lightning:    { color: "#00e5ff", glow: "#b3f0ff", icon: "⚡", label: "Lightning" },
    thunder:      { color: "#9c88ff", glow: "#c4b5fd", icon: "⊛", label: "Thunder" },
    acid:         { color: "#76ff03", glow: "#b2ff59", icon: "⊛", label: "Acid" },
    poison:       { color: "#4caf50", glow: "#81c784", icon: "☠",  label: "Poison" },
    necrotic:     { color: "#8b5cf6", glow: "#a78bfa", icon: "☠", label: "Necrotic" },
    radiant:      { color: "#ffd54f", glow: "#fff176", icon: "✦", label: "Radiant" },
    force:        { color: "#e040fb", glow: "#ea80fc", icon: "◎", label: "Force" },
    psychic:      { color: "#ec407a", glow: "#f48fb1", icon: "◈", label: "Psychic" },
    bludgeoning:  { color: "#bcaaa4", glow: "#d7ccc8", icon: "⚒", label: "Bludgeoning" },
    piercing:     { color: "#e0e0e0", glow: "#f5f5f5", icon: "†",  label: "Piercing" },
    slashing:     { color: "#ef9a9a", glow: "#ffcdd2", icon: "⚔",  label: "Slashing" },
    healing:      { color: "#66bb6a", glow: "#a5d6a7", icon: "⊕", label: "Healing" },
    untyped:      { color: "#ffffff", glow: "#e0e0e0", icon: "⚪", label: "Damage" },
  };

  const getDamageConfig = (type) =>
    DAMAGE_TYPE_CONFIG[(type || "untyped").toLowerCase()] || DAMAGE_TYPE_CONFIG.untyped;


  // ─── ACTION CATEGORY DEFINITIONS ───────────────────────────────────────────
  // Maps D&D 5e standard actions to categories, icons, and economy costs.

  const ACTION_CATEGORIES = {
    attack: {
      id: "attack", label: "Attack", hotkey: "1",
      cost: "action", color: "#dc143c",
      desc: "Make a weapon attack against a target.",
      subActions: ["melee", "ranged", "unarmed", "offhand"],
    },
    castSpell: {
      id: "castSpell", label: "Cast Spell", hotkey: "2",
      cost: "varies", color: "#7c4dff",
      desc: "Cast a prepared or known spell.",
    },
    dash: {
      id: "dash", label: "Dash", hotkey: "3",
      cost: "action", color: "#29b6f6",
      desc: "Double your movement speed this turn.",
    },
    dodge: {
      id: "dodge", label: "Dodge", hotkey: "4",
      cost: "action", color: "#ffa726",
      desc: "Attacks against you have disadvantage. DEX saves have advantage.",
    },
    disengage: {
      id: "disengage", label: "Disengage", hotkey: "5",
      cost: "action", color: "#26a69a",
      desc: "Your movement doesn't provoke opportunity attacks this turn.",
    },
    help: {
      id: "help", label: "Help", hotkey: "6",
      cost: "action", color: "#42a5f5",
      desc: "Give an ally advantage on their next ability check or attack.",
    },
    hide: {
      id: "hide", label: "Hide", hotkey: "7",
      cost: "action", color: "#78909c",
      desc: "Make a Stealth check to become hidden.",
    },
    ready: {
      id: "ready", label: "Ready", hotkey: "8",
      cost: "action", color: "#ab47bc",
      desc: "Prepare a reaction trigger and action for later this round.",
    },
    useObject: {
      id: "useObject", label: "Use Object", hotkey: "9",
      cost: "action", color: "#8d6e63",
      desc: "Interact with an object (potion, scroll, etc.).",
    },
    grapple: {
      id: "grapple", label: "Grapple", hotkey: "G",
      cost: "action", color: "#f9a825",
      desc: "Attempt to grapple a creature (replaces one attack).",
    },
    shove: {
      id: "shove", label: "Shove", hotkey: "V",
      cost: "action", color: "#ef6c00",
      desc: "Shove a creature prone or 5 ft away (replaces one attack).",
    },
  };

  const BONUS_ACTIONS = {
    offhandAttack: { id: "offhandAttack", label: "Offhand Attack", cost: "bonus", color: "#dc143c" },
    classFeature:  { id: "classFeature",  label: "Class Feature",  cost: "bonus", color: "#ffd54f" },
    bonusSpell:    { id: "bonusSpell",    label: "Bonus Spell",    cost: "bonus", color: "#7c4dff" },
  };


  // ─── FLOATING COMBAT TEXT SYSTEM ───────────────────────────────────────────
  // Canvas-based animated text that rises from tokens to show damage, misses,
  // crits, healing, saves, and conditions.

  /** @type {Array<FloatingTextParticle>} */
  let _activeTexts = [];
  let _nextTextId = 0;

  /**
   * @typedef {Object} FloatingTextParticle
   * @property {number} id
   * @property {number} x        - World X (grid coords)
   * @property {number} y        - World Y (grid coords)
   * @property {string} text     - Display text (e.g. "-15", "MISS", "CRITICAL!")
   * @property {string} color    - Fill color
   * @property {string} glow     - Glow/shadow color
   * @property {number} fontSize - Base font size in px
   * @property {number} born     - Timestamp created
   * @property {number} lifetime - Duration in ms
   * @property {number} vx       - Horizontal velocity (px/s)
   * @property {number} vy       - Vertical velocity (px/s, negative = up)
   * @property {string} style    - "damage" | "crit" | "miss" | "heal" | "save" | "condition" | "death"
   * @property {number} [delay]  - Delay before showing (ms)
   */

  const TEXT_STYLES = {
    damage: {
      fontSize: 22, lifetime: 2200, vy: -55, vx: 0,
      fontWeight: "900", fontFamily: "'Cinzel', serif",
    },
    crit: {
      fontSize: 30, lifetime: 2800, vy: -45, vx: 0,
      fontWeight: "900", fontFamily: "'Cinzel', serif",
    },
    miss: {
      fontSize: 18, lifetime: 1600, vy: -40, vx: 0,
      fontWeight: "700", fontFamily: "'Cinzel', serif",
    },
    heal: {
      fontSize: 22, lifetime: 2000, vy: -50, vx: 0,
      fontWeight: "900", fontFamily: "'Cinzel', serif",
    },
    save: {
      fontSize: 16, lifetime: 1800, vy: -35, vx: 0,
      fontWeight: "700", fontFamily: "'Spectral', serif",
    },
    condition: {
      fontSize: 14, lifetime: 2400, vy: -30, vx: 0,
      fontWeight: "600", fontFamily: "'Spectral', serif",
    },
    death: {
      fontSize: 28, lifetime: 3000, vy: -30, vx: 0,
      fontWeight: "900", fontFamily: "'Cinzel', serif",
    },
    info: {
      fontSize: 14, lifetime: 1800, vy: -32, vx: 0,
      fontWeight: "500", fontFamily: "'Spectral', serif",
    },
  };

  /**
   * Spawn a floating text particle at a world position.
   * @param {Object} opts
   * @param {number} opts.x          - World X (token center)
   * @param {number} opts.y          - World Y (token center)
   * @param {string} opts.text       - Text to display
   * @param {string} [opts.style]    - Style preset key
   * @param {string} [opts.color]    - Override color
   * @param {string} [opts.glow]     - Override glow
   * @param {number} [opts.delay]    - Delay in ms before appearing
   * @param {number} [opts.offsetX]  - Random scatter range (px)
   */
  function spawnFloatingText(opts) {
    const styleDef = TEXT_STYLES[opts.style || "damage"] || TEXT_STYLES.damage;
    const scatter = opts.offsetX || 12;
    const particle = {
      id: _nextTextId++,
      x: opts.x + (Math.random() - 0.5) * scatter,
      y: opts.y - 10,
      text: opts.text || "",
      color: opts.color || "#fff",
      glow: opts.glow || opts.color || "#fff",
      fontSize: opts.fontSize || styleDef.fontSize,
      fontWeight: styleDef.fontWeight,
      fontFamily: styleDef.fontFamily,
      born: performance.now(),
      lifetime: opts.lifetime || styleDef.lifetime,
      vx: styleDef.vx + (Math.random() - 0.5) * 8,
      vy: styleDef.vy,
      style: opts.style || "damage",
      delay: opts.delay || 0,
      scale: 1,
    };
    _activeTexts.push(particle);
    return particle.id;
  }

  /**
   * Spawn damage numbers for an attack result.
   * @param {number} x          - Target world X
   * @param {number} y          - Target world Y
   * @param {Object} result     - Attack result from resolveAttack()
   */
  function spawnDamageText(x, y, result) {
    if (!result || typeof result !== 'object') return;

    if (result.miss || result.fumble) {
      spawnFloatingText({
        x, y,
        text: result.fumble ? "FUMBLE!" : "MISS",
        style: "miss",
        color: "#888",
        glow: "#555",
      });
      return;
    }

    if (!!result.isCrit) {
      spawnFloatingText({
        x, y: y - 18,
        text: "CRITICAL!",
        style: "crit",
        color: "#ffd54f",
        glow: "#ffab00",
        delay: 0,
      });
    }

    // Spawn per-damage-type numbers with stagger
    const breakdown = result.damageBreakdown || [];
    let delay = result.isCrit ? 300 : 0;
    let totalApplied = 0;

    breakdown.forEach((comp, i) => {
      const cfg = getDamageConfig(comp.type);
      const applied = comp.applied != null ? comp.applied : comp.total;
      totalApplied += applied;

      if (applied === 0 && comp.relation === "immune") {
        spawnFloatingText({
          x, y,
          text: "IMMUNE",
          style: "save",
          color: "#aaa",
          glow: "#666",
          delay: delay,
        });
      } else if (applied > 0) {
        let label = "-" + applied;
        if (comp.relation === "resistant") label += " (resist)";
        if (comp.relation === "vulnerable") label = "-" + applied + "!";

        spawnFloatingText({
          x, y,
          text: label,
          style: result.isCrit ? "crit" : "damage",
          color: cfg.color,
          glow: cfg.glow,
          delay: delay + i * 180,
          offsetX: 16,
        });
      }
    });

    // If no breakdown, show total
    if (breakdown.length === 0 && result.totalDamage > 0) {
      const cfg = getDamageConfig(result.damageType);
      spawnFloatingText({
        x, y,
        text: "-" + result.totalDamage,
        style: result.isCrit ? "crit" : "damage",
        color: cfg.color,
        glow: cfg.glow,
        delay: delay,
      });
    }
  }

  /**
   * Spawn healing text.
   */
  function spawnHealText(x, y, amount) {
    spawnFloatingText({
      x, y,
      text: "+" + amount,
      style: "heal",
      color: "#66bb6a",
      glow: "#2e7d32",
    });
  }

  /**
   * Spawn a saving throw result.
   */
  function spawnSaveText(x, y, success, label) {
    spawnFloatingText({
      x, y,
      text: success ? (label || "SAVED") : (label || "FAILED"),
      style: "save",
      color: success ? "#66bb6a" : "#ef5350",
      glow: success ? "#2e7d32" : "#c62828",
    });
  }

  /**
   * Spawn condition applied/removed text.
   */
  function spawnConditionText(x, y, conditionName, applied) {
    spawnFloatingText({
      x, y,
      text: (applied ? "+" : "−") + " " + conditionName,
      style: "condition",
      color: applied ? "#ffa726" : "#78909c",
      glow: applied ? "#e65100" : "#546e7a",
    });
  }

  /**
   * Spawn death/unconscious text.
   */
  function spawnDeathText(x, y, text) {
    spawnFloatingText({
      x, y,
      text: text || "DEFEATED",
      style: "death",
      color: "#d32f2f",
      glow: "#b71c1c",
    });
  }

  /**
   * Spawn info text (e.g., "Dodging", "Disengaged", etc.)
   */
  function spawnInfoText(x, y, text, color) {
    spawnFloatingText({
      x, y,
      text: text,
      style: "info",
      color: color || "#90caf9",
      glow: color || "#42a5f5",
    });
  }

  /**
   * Render all active floating text particles onto a 2D canvas context.
   * Call this from the main render loop AFTER drawing tokens.
   *
   * @param {CanvasRenderingContext2D} ctx  - Canvas context (already transformed for pan/zoom)
   * @param {number} zoom                   - Current zoom level
   * @param {number} now                    - performance.now() timestamp
   */
  function renderFloatingTexts(ctx, zoom, now) {
    if (_activeTexts.length === 0) return;
    if (!ctx || typeof ctx !== 'object') return;

    const expired = new Set();
    const safeZoom = Math.max(0.01, Math.min(100, zoom || 1));
    const invZoom = 1 / safeZoom;

    ctx.save();

    _activeTexts.forEach((p) => {
      const age = now - p.born;
      if (age < p.delay) return; // still delayed

      const activeAge = age - p.delay;
      if (activeAge >= p.lifetime) {
        expired.add(p.id);
        return;
      }

      const t = activeAge / p.lifetime; // 0 → 1
      const fadeIn = Math.min(1, activeAge / 150);
      const fadeOut = t > 0.7 ? 1 - ((t - 0.7) / 0.3) : 1;
      const alpha = fadeIn * fadeOut;
      if (alpha <= 0) return;

      // Position: rise over time
      const elapsedSec = activeAge / 1000;
      const dx = p.vx * elapsedSec;
      const dy = p.vy * elapsedSec;

      // Scale pop on spawn
      let scale = 1;
      if (activeAge < 200) {
        const st = activeAge / 200;
        scale = 0.3 + 0.7 * (1 - Math.pow(1 - st, 3)); // ease-out cubic
      }
      // Crit pulse
      if (p.style === "crit" && activeAge < 600) {
        scale *= 1 + 0.12 * Math.sin(activeAge / 80 * Math.PI);
      }

      const px = p.x + dx;
      const py = p.y + dy;
      const sz = p.fontSize * invZoom * scale;

      ctx.globalAlpha = alpha;
      ctx.font = p.fontWeight + " " + Math.round(sz) + "px " + p.fontFamily;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Glow outline
      ctx.shadowColor = p.glow;
      ctx.shadowBlur = 8 * invZoom;
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.lineWidth = 3 * invZoom;
      ctx.lineJoin = "round";
      ctx.strokeText(p.text, px, py);

      // Fill
      ctx.shadowBlur = 4 * invZoom;
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, px, py);

      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
    });

    ctx.restore();

    // Prune expired
    if (expired.size > 0) {
      _activeTexts = _activeTexts.filter((p) => !expired.has(p.id));
    }
  }

  /**
   * Are there any active floating texts? (Used to keep requestAnimationFrame alive.)
   */
  function hasActiveTexts() {
    return _activeTexts.length > 0;
  }

  /**
   * Clear all floating texts.
   */
  function clearFloatingTexts() {
    _activeTexts = [];
  }


  // ─── ATTACK RESOLUTION DISPLAY ─────────────────────────────────────────────
  // Formats attack/spell resolution into a structured object for the UI.

  /**
   * Build a detailed attack result object for display in the combat log
   * and the confirm flyout.
   *
   * @param {Object} opts
   * @param {Object} opts.attacker       - Attacker token
   * @param {Object} opts.target         - Target token
   * @param {string} opts.actionName     - Name of the action used
   * @param {Object} opts.attackRoll     - { roll1, roll2, chosen, modifier, total, nat20, nat1, mode }
   * @param {number} opts.targetAC       - Target's armor class
   * @param {boolean} opts.hit           - Whether the attack hit
   * @param {boolean} opts.isCrit        - Whether it was a critical hit
   * @param {Array}  opts.damageBreakdown - [{ type, dice, roll, total, applied, relation }]
   * @param {number} opts.totalDamage    - Total damage after resistances
   * @param {number} opts.rawDamage      - Damage before resistances
   * @param {Object} [opts.savingThrow]  - { ability, dc, roll, modifier, total, success }
   * @param {Array}  [opts.conditionsApplied] - Condition names applied
   * @param {Array}  [opts.conditionsRemoved] - Condition names removed
   * @returns {Object} Structured display result
   */
  function formatAttackResult(opts) {
    if (!opts || typeof opts !== 'object') return { lines: [], details: [] };
    const lines = [];
    const details = [];

    // Attack roll line
    if (opts.attackRoll && typeof opts.attackRoll === 'object') {
      const r = opts.attackRoll;
      let rollStr = "";
      if (r.mode === "advantage") {
        rollStr = "2d20kh1(" + r.roll1 + ", " + r.roll2 + ") → " + r.chosen;
      } else if (r.mode === "disadvantage") {
        rollStr = "2d20kl1(" + r.roll1 + ", " + r.roll2 + ") → " + r.chosen;
      } else {
        rollStr = "d20(" + r.chosen + ")";
      }
      rollStr += (r.modifier >= 0 ? " + " : " − ") + Math.abs(r.modifier) + " = " + r.total;

      let verdict = "";
      if (r.nat20) verdict = "NATURAL 20 — CRITICAL HIT!";
      else if (r.nat1) verdict = "NATURAL 1 — AUTOMATIC MISS!";
      else if (opts.hit) verdict = r.total + " vs AC " + opts.targetAC + " → HIT";
      else verdict = r.total + " vs AC " + opts.targetAC + " → MISS";

      details.push({
        section: "attack",
        label: "Attack Roll",
        roll: rollStr,
        verdict: verdict,
        hit: opts.hit,
        isCrit: opts.isCrit,
        nat20: r.nat20,
        nat1: r.nat1,
      });
    }

    // Saving throw line
    if (opts.savingThrow) {
      const sv = opts.savingThrow;
      const abilityNames = { str: "STR", dex: "DEX", con: "CON", int: "INT", wis: "WIS", cha: "CHA" };
      const abilityLabel = abilityNames[(sv.ability || "").toLowerCase()] || sv.ability || "?";
      let rollStr = "d20(" + (sv.roll || "?") + ")";
      rollStr += (sv.modifier >= 0 ? " + " : " − ") + Math.abs(sv.modifier || 0) + " = " + (sv.total || "?");
      const verdict = (sv.total || 0) + " vs DC " + sv.dc + " → " + (sv.success ? "SAVED" : "FAILED");

      details.push({
        section: "save",
        label: abilityLabel + " Save",
        roll: rollStr,
        verdict: verdict,
        success: sv.success,
        dc: sv.dc,
      });
    }

    // Damage breakdown
    if (opts.damageBreakdown && opts.damageBreakdown.length > 0) {
      const dmgLines = opts.damageBreakdown.map((comp) => {
        const cfg = getDamageConfig(comp.type);
        let line = "";
        if (comp.roll && comp.roll.expression) {
          line = comp.roll.expression + "(" + comp.roll.details + ")";
          if (comp.roll.modifier) {
            line += (comp.roll.modifier >= 0 ? " + " : " − ") + Math.abs(comp.roll.modifier);
          }
          line += " = " + comp.total;
        } else {
          line = String(comp.total || 0);
        }
        line += " " + cfg.label.toLowerCase();

        if (comp.relation === "resistant") line += " (½ resistant → " + comp.applied + ")";
        else if (comp.relation === "immune") line += " (immune → 0)";
        else if (comp.relation === "vulnerable") line += " (×2 vulnerable → " + comp.applied + ")";

        return { text: line, type: comp.type, applied: comp.applied != null ? comp.applied : comp.total, color: cfg.color };
      });

      const totalApplied = opts.totalDamage || dmgLines.reduce((s, d) => s + (d.applied || 0), 0);

      details.push({
        section: "damage",
        label: opts.isCrit ? "Critical Damage" : "Damage",
        components: dmgLines,
        totalDamage: totalApplied,
        rawDamage: opts.rawDamage || totalApplied,
      });
    }

    // Conditions
    if (opts.conditionsApplied && opts.conditionsApplied.length) {
      details.push({
        section: "conditions",
        label: "Conditions Applied",
        conditions: opts.conditionsApplied.map((c) => ({ name: c, applied: true })),
      });
    }
    if (opts.conditionsRemoved && opts.conditionsRemoved.length) {
      details.push({
        section: "conditions",
        label: "Conditions Removed",
        conditions: opts.conditionsRemoved.map((c) => ({ name: c, applied: false })),
      });
    }

    return {
      attacker: opts.attacker ? { id: opts.attacker.id, name: opts.attacker.name, tokenType: opts.attacker.tokenType } : null,
      target: opts.target ? { id: opts.target.id, name: opts.target.name, tokenType: opts.target.tokenType } : null,
      actionName: opts.actionName || "Attack",
      hit: !!opts.hit,
      isCrit: !!opts.isCrit,
      totalDamage: opts.totalDamage || 0,
      details: details,
      timestamp: Date.now(),
    };
  }


  // ─── ENHANCED COMBAT LOG ENTRY FORMATTING ──────────────────────────────────
  // Produces rich log entries with nested detail sections.

  /**
   * Format a combat log entry for display in the sidebar.
   * @param {Object} entry - Raw log entry
   * @param {string} viewRole - "dm" or "player"
   * @param {Function} getTokenById - Lookup function
   * @returns {Object} Formatted entry
   */
  function formatLogEntry(entry, viewRole, getTokenById) {
    if (!entry) return null;

    const maskName = (name, tokenId) => {
      if (viewRole !== "player") return name;
      const tok = getTokenById ? getTokenById(tokenId) : null;
      if (tok && tok.hidden) return "Hidden Creature";
      return name;
    };

    const formatted = {
      id: entry.id,
      time: entry.time || "",
      type: entry.type || "system",
      icon: "⚔",
      color: "#f4ead6",
      headline: "",
      sublines: [],
      expandable: false,
      details: entry.details || [],
    };

    switch (entry.type) {
      case "attack": {
        const atkName = maskName(entry.attacker, entry.attackerId);
        const tgtName = maskName(entry.target, entry.targetId);
        formatted.icon = entry.isCrit ? "⊛" : "⚔";
        formatted.color = "#dc143c";
        formatted.headline = atkName + " → " + tgtName + ": " + (entry.action || "Attack");
        formatted.expandable = true;

        if (entry.details && entry.details.length) {
          entry.details.forEach((d) => {
            if (d.section === "attack") {
              formatted.sublines.push({
                text: d.roll,
                accent: d.hit ? "#5ee09a" : "#ef5350",
                bold: false,
              });
              formatted.sublines.push({
                text: d.verdict,
                accent: d.nat20 ? "#ffd54f" : (d.hit ? "#5ee09a" : "#ef5350"),
                bold: true,
              });
            }
            if (d.section === "damage") {
              d.components.forEach((c) => {
                formatted.sublines.push({
                  text: c.text,
                  accent: c.color || "#f4ead6",
                  bold: false,
                });
              });
              formatted.sublines.push({
                text: "Total: " + d.totalDamage + " damage" + (d.rawDamage !== d.totalDamage ? " (" + d.rawDamage + " raw)" : ""),
                accent: "#dc143c",
                bold: true,
              });
            }
            if (d.section === "conditions" && d.conditions && d.conditions.length) {
              d.conditions.forEach((c) => {
                formatted.sublines.push({
                  text: (c.applied ? "Applied: " : "Removed: ") + c.name,
                  accent: c.applied ? "#ffa726" : "#78909c",
                  bold: false,
                });
              });
            }
          });
        } else {
          // Legacy format
          if (entry.roll) formatted.sublines.push({ text: "Roll: " + entry.roll, accent: "#90caf9" });
          if (entry.damage) formatted.sublines.push({ text: "Damage: " + entry.damage, accent: "#dc143c", bold: true });
        }
        break;
      }

      case "miss": {
        const atkName = maskName(entry.attacker, entry.attackerId);
        const tgtName = maskName(entry.target, entry.targetId);
        formatted.icon = "⛨";
        formatted.color = "#78909c";
        formatted.headline = atkName + " → " + tgtName + ": " + (entry.action || "Attack") + " — MISS";
        formatted.expandable = true;

        if (entry.details && entry.details.length) {
          entry.details.forEach((d) => {
            if (d.section === "attack") {
              formatted.sublines.push({ text: d.roll, accent: "#90caf9" });
              formatted.sublines.push({ text: d.verdict, accent: "#ef5350", bold: true });
            }
          });
        } else if (entry.roll) {
          formatted.sublines.push({ text: "Roll: " + entry.roll, accent: "#90caf9" });
        }
        break;
      }

      case "save": {
        const tgtName = maskName(entry.target, entry.targetId);
        formatted.icon = entry.success ? "✓" : "✗";
        formatted.color = entry.success ? "#66bb6a" : "#ef5350";
        formatted.headline = tgtName + ": " + (entry.ability || "").toUpperCase() + " Save" +
          (entry.action ? " vs " + entry.action : "") +
          " — " + (entry.success ? "SAVED" : "FAILED");
        formatted.expandable = true;

        if (entry.details && entry.details.length) {
          entry.details.forEach((d) => {
            if (d.section === "save") {
              formatted.sublines.push({ text: d.roll, accent: "#90caf9" });
              formatted.sublines.push({ text: d.verdict, accent: d.success ? "#66bb6a" : "#ef5350", bold: true });
            }
            if (d.section === "damage") {
              d.components.forEach((c) => {
                formatted.sublines.push({ text: c.text, accent: c.color });
              });
              formatted.sublines.push({ text: "Total: " + d.totalDamage + " damage", accent: "#dc143c", bold: true });
            }
          });
        }
        break;
      }

      case "heal": {
        formatted.icon = "⊕";
        formatted.color = "#66bb6a";
        formatted.headline = (entry.target || "?") + " healed for " + (entry.amount || 0) + " HP";
        break;
      }

      case "death": {
        formatted.icon = "☠";
        formatted.color = "#d32f2f";
        formatted.headline = (entry.target || "?") + " — " + (entry.text || "Defeated");
        break;
      }

      case "condition": {
        formatted.icon = entry.applied ? "◆" : "◇";
        formatted.color = entry.applied ? "#ffa726" : "#78909c";
        formatted.headline = (entry.target || "?") + ": " +
          (entry.applied ? "+" : "−") + " " + (entry.condition || "Condition");
        break;
      }

      case "initiative": {
        formatted.icon = "⊞";
        formatted.color = "#ffd54f";
        formatted.headline = entry.text || "Initiative rolled";
        break;
      }

      case "round": {
        formatted.icon = "⏳";
        formatted.color = "#90caf9";
        formatted.headline = entry.text || "Round " + (entry.round || "?");
        break;
      }

      case "feature": {
        formatted.icon = "✦";
        formatted.color = "#ffd54f";
        formatted.headline = entry.text || (entry.attacker || "?") + " used " + (entry.action || "feature");
        break;
      }

      default: {
        formatted.icon = "⸎";
        formatted.color = "rgba(242,232,214,0.5)";
        formatted.headline = entry.text || "Unknown action";
        break;
      }
    }

    return formatted;
  }


  // ─── DM / PLAYER VIEW HELPERS ──────────────────────────────────────────────

  /**
   * Filter token data for player view — strips hidden stats.
   * @param {Object} token       - Full token object
   * @param {string} viewRole    - "dm" or "player"
   * @param {string} [playerId]  - Current player's ID (for ownership)
   * @returns {Object} Filtered token data
   */
  function filterTokenForView(token, viewRole, playerId) {
    if (!token) return null;
    if (viewRole === "dm") return token; // DM sees everything

    // Player view: PCs show full data, enemies show limited
    if (token.tokenType === "pc") {
      return token; // Players can see all PC data
    }

    // For enemies/NPCs: hide internal stats in player view
    return {
      ...token,
      // Show visible state
      id: token.id,
      name: token.hidden ? "Unknown Creature" : token.name,
      x: token.x,
      y: token.y,
      color: token.color,
      tokenType: token.tokenType,
      size: token.size,
      hidden: token.hidden,
      // Show HP as percentage, not exact numbers (BG3-style)
      hp: token.hp,
      maxHp: token.maxHp,
      hpVisible: !token.hidden, // Players can see HP bars of visible enemies
      // Hide detailed stats
      ac: undefined,
      speed: undefined,
      monsterData: undefined,
      combatProfile: undefined,
      // Keep conditions visible (they're observable in-world)
      conditions: token.conditions,
    };
  }

  /**
   * Get action availability for a token based on economy state.
   * @param {Object} turnState - Current turn state for the token
   * @returns {Object} Available action types
   */
  function getAvailableActions(turnState) {
    if (!turnState) return { action: true, bonus: true, reaction: true, move: true };
    return {
      action: !turnState.actionUsed,
      bonus: !turnState.bonusActionUsed,
      reaction: !turnState.reactionSpent,
      move: (turnState.movementRemaining || 0) > 0,
      moveFt: turnState.movementRemaining || 0,
    };
  }

  /**
   * Check if a particular action category is available given the economy state.
   * @param {string} categoryId - Action category ID
   * @param {Object} turnState  - Current turn state
   * @param {Object} token      - Token object
   * @returns {{ available: boolean, reason: string }}
   */
  function checkActionAvailability(categoryId, turnState, token) {
    const cat = ACTION_CATEGORIES[categoryId] || BONUS_ACTIONS[categoryId];
    if (!cat) return { available: false, reason: "Unknown action" };

    const avail = getAvailableActions(turnState);

    if (cat.cost === "action" && !avail.action) {
      return { available: false, reason: "Action already used this turn" };
    }
    if (cat.cost === "bonus" && !avail.bonus) {
      return { available: false, reason: "Bonus action already used this turn" };
    }
    if (cat.cost === "reaction" && !avail.reaction) {
      return { available: false, reason: "Reaction already spent this round" };
    }

    return { available: true, reason: "" };
  }


  // ─── ROLL RESULT CARD DATA ─────────────────────────────────────────────────
  // Structures for the roll result popup that appears after an action.

  /**
   * Create a roll result card for the UI.
   * Used by the ConfirmFlyout to show the outcome of an action.
   */
  function createRollResultCard(formattedResult) {
    if (!formattedResult) return null;
    return {
      type: "rollResult",
      attacker: formattedResult.attacker,
      target: formattedResult.target,
      actionName: formattedResult.actionName,
      hit: formattedResult.hit,
      isCrit: formattedResult.isCrit,
      totalDamage: formattedResult.totalDamage,
      details: formattedResult.details,
      timestamp: formattedResult.timestamp,
    };
  }


  // ─── INITIATIVE DISPLAY HELPERS ────────────────────────────────────────────

  /**
   * Get the display initiative order with DM/player filtering.
   */
  function getDisplayInitiative(combatants, tokens, viewRole) {
    if (!Array.isArray(combatants) || !Array.isArray(tokens)) return [];
    return combatants.map((c) => {
      if (!c || typeof c !== 'object') return null;
      const tok = tokens.find((t) => t && t.id === c.mapTokenId);
      if (!tok) return { ...c, visible: false };

      if (viewRole === "player" && tok.hidden) {
        return {
          ...c,
          visible: false,
        };
      }

      return {
        ...c,
        visible: true,
        tokenType: tok.tokenType,
        hp: tok.hp,
        maxHp: tok.maxHp,
        isDead: (tok.hp || 0) <= 0,
        isPC: tok.tokenType === "pc",
      };
    });
  }


  // ─── PUBLIC API ────────────────────────────────────────────────────────────

  return {
    // Config
    DAMAGE_TYPE_CONFIG,
    ACTION_CATEGORIES,
    BONUS_ACTIONS,
    getDamageConfig,

    // Floating text
    spawnFloatingText,
    spawnDamageText,
    spawnHealText,
    spawnSaveText,
    spawnConditionText,
    spawnDeathText,
    spawnInfoText,
    renderFloatingTexts,
    hasActiveTexts,
    clearFloatingTexts,

    // Attack resolution display
    formatAttackResult,
    createRollResultCard,

    // Combat log
    formatLogEntry,

    // View helpers
    filterTokenForView,
    getAvailableActions,
    checkActionAvailability,
    getDisplayInitiative,
  };
})();
