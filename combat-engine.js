/* ═══════════════════════════════════════════════════════════════════════════
   PHMURT STUDIOS — D&D 5e COMBAT ENGINE
   Attacks & saves, advantage stacking, damage resist/immune/vuln (incl.
   nonmagical B/P/S), cover & dodge vs AC, auto-fail STR/DEX saves, restrained
   DEX dis, condition immunity text, legendary→action resolution, PC weapon
   table, encounter math, movement, conditions reference.
   ═══════════════════════════════════════════════════════════════════════════ */

window.CombatEngine = (() => {
  "use strict";

  // ─── DICE SYSTEM ───────────────────────────────────────────────────────────

  /** Roll a single die (e.g., d20 → 1-20) */
  const rollDie = (sides) => Math.floor(Math.random() * sides) + 1;

  /** Parse and roll a dice expression like "2d6+5", "3d8", "1d20-2", "4d6kh3"
   *  Returns { rolls:[], modifier:number, total:number, expression:string, details:string, nat20:bool, nat1:bool }
   */
  const rollDice = (expr) => {
    if (!expr || typeof expr !== "string") return { rolls: [], modifier: 0, total: 0, expression: expr || "", details: "", nat20: false, nat1: false };
    expr = expr.trim().toLowerCase();

    // Handle "Xd" expressions like "3x1d4+1" (magic missile style)
    if (expr.includes("x")) {
      const parts = expr.split("x");
      const count = parseInt(parts[0]) || 1;
      const subExpr = parts[1];
      const results = [];
      let grandTotal = 0;
      for (let i = 0; i < count; i++) {
        const r = rollDice(subExpr);
        results.push(r);
        grandTotal += r.total;
      }
      return {
        rolls: results.map(r => r.total),
        modifier: 0,
        total: grandTotal,
        expression: expr,
        details: results.map(r => r.total).join(", "),
        subRolls: results,
        nat20: false,
        nat1: false,
      };
    }

    // Parse standard NdS+M format
    const match = expr.match(/^(\d+)?d(\d+)\s*(kh\d+|kl\d+)?\s*([+-]\s*\d+)?$/);
    if (!match) {
      // Try just a flat number
      const num = parseInt(expr);
      if (!isNaN(num)) return { rolls: [num], modifier: 0, total: num, expression: expr, details: String(num), nat20: false, nat1: false };
      return { rolls: [], modifier: 0, total: 0, expression: expr, details: "?", nat20: false, nat1: false };
    }

    const count = parseInt(match[1]) || 1;
    const sides = parseInt(match[2]);
    const keepRule = match[3] || "";
    const modifier = match[4] ? parseInt(match[4].replace(/\s/g, "")) : 0;

    let rolls = [];
    for (let i = 0; i < count; i++) rolls.push(rollDie(sides));

    let keptRolls = [...rolls];
    if (keepRule.startsWith("kh")) {
      const keep = parseInt(keepRule.slice(2));
      keptRolls = [...rolls].sort((a, b) => b - a).slice(0, keep);
    } else if (keepRule.startsWith("kl")) {
      const keep = parseInt(keepRule.slice(2));
      keptRolls = [...rolls].sort((a, b) => a - b).slice(0, keep);
    }

    const diceTotal = keptRolls.reduce((a, b) => a + b, 0);
    const total = diceTotal + modifier;
    const nat20 = sides === 20 && count === 1 && rolls[0] === 20;
    const nat1 = sides === 20 && count === 1 && rolls[0] === 1;

    return {
      rolls,
      keptRolls,
      modifier,
      total,
      expression: expr,
      details: rolls.length > 1 ? `[${rolls.join(", ")}]` : String(rolls[0]),
      nat20,
      nat1,
    };
  };

  /** Parse a damage string like "2d6 + 5" or "19 (2d10 + 8) piercing plus 7 (2d6) fire"
   *  from a monster action description and roll it.
   *  Returns { total, breakdown: [{ type, roll, total }], critTotal }
   */
  const rollDamage = (damageStr, isCrit = false) => {
    if (!damageStr) return { total: 0, breakdown: [], critTotal: 0 };
    const parts = [];
    // Match patterns like "19 (2d10 + 8) piercing" or "7 (2d6) fire" or "2d6+5 slashing"
    const regex = /(?:(\d+)\s*\()?(\d+d\d+)\s*([+-]\s*\d+)?\)?\s*(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)?/gi;
    let m;
    while ((m = regex.exec(damageStr)) !== null) {
      const diceExpr = m[2] + (m[3] ? m[3].replace(/\s/g, "") : "");
      const dtype = (m[4] || "untyped").toLowerCase();
      const roll = rollDice(diceExpr);
      const critRoll = isCrit ? rollDice(m[2]) : { total: 0 }; // Crit doubles dice only, not modifier
      parts.push({ type: dtype, roll, total: roll.total, critBonus: critRoll.total });
    }
    if (parts.length === 0 && damageStr) {
      // Try simple number
      const num = parseInt(damageStr);
      if (!isNaN(num)) parts.push({ type: "untyped", roll: { total: num, rolls: [num], expression: String(num), details: String(num) }, total: num, critBonus: 0 });
    }
    const total = parts.reduce((s, p) => s + p.total, 0);
    const critTotal = total + parts.reduce((s, p) => s + p.critBonus, 0);
    return { total, critTotal, breakdown: parts };
  };

  /** Roll a d20 with advantage/disadvantage
   *  mode: "normal" | "advantage" | "disadvantage"
   */
  const rollD20 = (modifier = 0, mode = "normal") => {
    const r1 = rollDie(20);
    const r2 = rollDie(20);
    let chosen;
    if (mode === "advantage") chosen = Math.max(r1, r2);
    else if (mode === "disadvantage") chosen = Math.min(r1, r2);
    else chosen = r1;
    return {
      roll1: r1,
      roll2: r2,
      chosen,
      modifier,
      total: chosen + modifier,
      nat20: chosen === 20,
      nat1: chosen === 1,
      mode,
      details: mode !== "normal" ? `(${r1}, ${r2}) → ${chosen}` : String(r1),
    };
  };


  // ─── ACTION PARSER ─────────────────────────────────────────────────────────
  // Parse monster/NPC action descriptions into structured attack data

  /** Parse an attack action description into structured data.
   *  e.g., "Melee Weapon Attack: +14 to hit, reach 10 ft., one target.
   *         Hit: 19 (2d10 + 8) piercing damage plus 7 (2d6) fire damage."
   */
  const parseAttackAction = (action) => {
    if (!action || !action.desc) return null;
    const desc = action.desc;

    // Detect attack type
    const attackMatch = desc.match(/(Melee|Ranged)\s+(Weapon|Spell)\s+Attack:\s*\+(\d+)\s+to hit/i);
    if (!attackMatch) return null;

    const attackType = attackMatch[1].toLowerCase(); // "melee" or "ranged"
    const weaponOrSpell = attackMatch[2].toLowerCase(); // "weapon" or "spell"
    const toHit = parseInt(attackMatch[3]);

    // Parse reach/range
    let reach = 5;
    const reachMatch = desc.match(/reach\s+(\d+)\s*ft/i);
    if (reachMatch) reach = parseInt(reachMatch[1]);
    const rangeMatch = desc.match(/range\s+(\d+)(?:\/(\d+))?\s*ft/i);
    let range = null, longRange = null;
    if (rangeMatch) {
      range = parseInt(rangeMatch[1]);
      longRange = rangeMatch[2] ? parseInt(rangeMatch[2]) : null;
    }

    // Parse targets
    let targets = 1;
    const targetsMatch = desc.match(/(\d+)\s+target/i);
    // "one target" is default
    if (targetsMatch) targets = parseInt(targetsMatch[1]);

    // Parse damage
    const hitMatch = desc.match(/Hit:\s*(.*?)(?:\.|$)/i);
    let damageComponents = [];
    if (hitMatch) {
      const hitStr = hitMatch[1];
      // Match all damage expressions: "19 (2d10 + 8) piercing damage" or "2d6 fire damage"
      const dmgRegex = /(\d+)\s*\((\d+d\d+)\s*([+-]\s*\d+)?\)\s*(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)\s*damage/gi;
      let dm;
      while ((dm = dmgRegex.exec(hitStr)) !== null) {
        damageComponents.push({
          avgDamage: parseInt(dm[1]),
          dice: dm[2] + (dm[3] ? dm[3].replace(/\s/g, "") : ""),
          type: dm[4].toLowerCase(),
        });
      }
      // Also check for simple "XdY type damage" without average
      if (damageComponents.length === 0) {
        const simpleDmg = /(\d+d\d+)\s*([+-]\s*\d+)?\s*(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)?\s*damage/gi;
        while ((dm = simpleDmg.exec(hitStr)) !== null) {
          damageComponents.push({
            avgDamage: 0,
            dice: dm[1] + (dm[2] ? dm[2].replace(/\s/g, "") : ""),
            type: (dm[3] || "untyped").toLowerCase(),
          });
        }
      }
    }

    // Parse additional effects (saving throw on hit)
    let onHitSave = null;
    const saveMatch = desc.match(/must\s+(?:succeed on|make)\s+a?\s*DC\s*(\d+)\s+(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+saving\s+throw/i);
    if (saveMatch) {
      onHitSave = { dc: parseInt(saveMatch[1]), ability: saveMatch[2] };
      // Check for effect on failed save
      const failMatch = desc.match(/(?:or\s+(?:be\s+)?(knocked\s+prone|grappled|restrained|poisoned|frightened|charmed|paralyzed|petrified|stunned|blinded|deafened|incapacitated))/i);
      if (failMatch) onHitSave.condition = failMatch[1].replace(/knocked\s+/, "").toLowerCase();
      // Check for additional damage on failed save
      const failDmg = desc.match(/taking\s+(\d+)\s*\((\d+d\d+)\s*([+-]\s*\d+)?\)\s*([\w]+)\s*damage/i);
      if (failDmg) {
        onHitSave.damage = {
          avgDamage: parseInt(failDmg[1]),
          dice: failDmg[2] + (failDmg[3] ? failDmg[3].replace(/\s/g, "") : ""),
          type: failDmg[4].toLowerCase(),
        };
      }
    }

    // Detect special properties
    const isGrapple = /grappled/i.test(desc);
    const knocksProne = /knocked\s+prone/i.test(desc);

    return {
      name: action.name,
      attackType,      // "melee" or "ranged"
      weaponOrSpell,   // "weapon" or "spell"
      toHit,
      reach,
      range: range || reach,
      longRange: longRange || (range ? range * 2 : reach),
      targets,
      damage: damageComponents,
      onHitSave,
      isGrapple,
      knocksProne,
      description: desc,
    };
  };

  /** Parse a saving throw action (like breath weapons, frightful presence)
   *  e.g., "Fire Breath (Recharge 5-6). The dragon exhales fire in a 60-foot cone.
   *         Each creature must make a DC 21 Dexterity saving throw, taking 63 (18d6) fire damage
   *         on a failed save, or half as much on a successful one."
   */
  const parseSaveAction = (action) => {
    if (!action || !action.desc) return null;
    const desc = action.desc;

    // Must have a DC saving throw
    const saveMatch = desc.match(/DC\s*(\d+)\s+(Strength|Dexterity|Constitution|Intelligence|Wisdom|Charisma)\s+saving\s+throw/i);
    if (!saveMatch) return null;

    // Skip if this is primarily an attack action (has "to hit")
    if (/\+\d+\s+to hit/i.test(desc)) return null;

    const dc = parseInt(saveMatch[1]);
    const ability = saveMatch[2];

    // Parse shape/area
    let shape = "sphere", radius = 0, length = 0, width = 5;
    const coneMatch = desc.match(/(\d+)-foot\s+cone/i);
    const lineMatch = desc.match(/(\d+)-foot\s+line\s+that\s+is\s+(\d+)\s+feet?\s+wide/i);
    const sphereMatch = desc.match(/(\d+)-foot(?:\s*-?\s*foot)?\s+(?:radius|sphere)/i);
    const cubeMatch = desc.match(/(\d+)-foot\s+cube/i);
    const rangeMatch2 = desc.match(/within\s+(\d+)\s+feet/i);

    if (coneMatch) { shape = "cone"; radius = parseInt(coneMatch[1]); }
    else if (lineMatch) { shape = "line"; length = parseInt(lineMatch[1]); width = parseInt(lineMatch[2]); }
    else if (sphereMatch) { shape = "sphere"; radius = parseInt(sphereMatch[1]); }
    else if (cubeMatch) { shape = "cube"; radius = parseInt(cubeMatch[1]); }
    else if (rangeMatch2) { shape = "sphere"; radius = parseInt(rangeMatch2[1]); }

    // Parse damage on failure
    let failDamage = null;
    const dmgMatch = desc.match(/taking\s+(\d+)\s*\((\d+d\d+)\s*([+-]\s*\d+)?\)\s*(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)\s*damage/i);
    if (dmgMatch) {
      failDamage = {
        avgDamage: parseInt(dmgMatch[1]),
        dice: dmgMatch[2] + (dmgMatch[3] ? dmgMatch[3].replace(/\s/g, "") : ""),
        type: dmgMatch[4].toLowerCase(),
      };
    }

    // Half damage on success?
    const halfOnSave = /half\s+(?:as\s+much|damage)/i.test(desc);

    // Conditions applied on failure
    let failConditions = [];
    const conditionChecks = ["blinded","charmed","deafened","frightened","grappled","incapacitated","invisible","paralyzed","petrified","poisoned","prone","restrained","stunned","unconscious"];
    for (const cond of conditionChecks) {
      if (new RegExp(`\\b${cond}\\b`, "i").test(desc)) failConditions.push(cond);
    }
    if (/knocked\s+prone/i.test(desc)) failConditions.push("prone");

    // Recharge
    let recharge = null;
    const rechargeMatch = action.name.match(/Recharge\s+(\d+)(?:-(\d+))?/i);
    if (rechargeMatch) {
      recharge = { min: parseInt(rechargeMatch[1]), max: parseInt(rechargeMatch[2] || 6) };
    }

    // Detect breath weapon type for visual effects
    let breathType = null;
    if (/fire\s*breath|exhales?\s*fire/i.test(desc)) breathType = "fire";
    else if (/cold\s*breath|exhales?\s*(?:cold|frost|ice)/i.test(desc)) breathType = "cold";
    else if (/lightning\s*breath|exhales?\s*lightning/i.test(desc)) breathType = "lightning";
    else if (/acid\s*breath|exhales?\s*acid/i.test(desc)) breathType = "acid";
    else if (/poison\s*breath|exhales?\s*poison/i.test(desc)) breathType = "poison";
    else if (/necrotic|shadow/i.test(desc)) breathType = "necrotic";
    else if (/radiant|holy/i.test(desc)) breathType = "radiant";
    else if (/force/i.test(desc)) breathType = "force";
    else if (/thunder/i.test(desc)) breathType = "thunder";
    else if (/psychic/i.test(desc)) breathType = "psychic";

    return {
      name: action.name,
      type: "save",
      dc,
      ability,
      shape,
      radius,
      length,
      width,
      failDamage,
      halfOnSave,
      failConditions,
      recharge,
      breathType,
      description: desc,
    };
  };

  /** Parse a multiattack description to determine which attacks to make.
   *  e.g., "The dragon makes three attacks: one with its bite and two with its claws."
   */
  const parseMultiattack = (multiattackAction, allActions) => {
    if (!multiattackAction || !multiattackAction.desc) return [];
    const desc = multiattackAction.desc.toLowerCase();

    const attacks = [];
    const actionMap = {};
    for (const a of allActions) {
      if (a.name.toLowerCase() !== "multiattack") {
        actionMap[a.name.toLowerCase()] = a;
      }
    }

    // Pattern: "one with its bite and two with its claws"
    const patternRegex = /(one|two|three|four|five|1|2|3|4|5)\s+(?:with\s+its?\s+|)([\w\s]+?)(?:\s+(?:attack|attacks))?(?:\s*(?:and|,)\s*|\.|\s*$)/gi;
    const numWords = { one: 1, two: 2, three: 3, four: 4, five: 5 };
    let m;
    while ((m = patternRegex.exec(desc)) !== null) {
      const count = numWords[m[1]] || parseInt(m[1]) || 1;
      const name = m[2].trim().replace(/\s+attacks?$/, "");
      // Find matching action
      const action = actionMap[name] || Object.values(actionMap).find(a => a.name.toLowerCase().includes(name));
      if (action) {
        for (let i = 0; i < count; i++) attacks.push(action);
      }
    }

    // Fallback: if we couldn't parse, look for "makes X attacks"
    if (attacks.length === 0) {
      const simpleMatch = desc.match(/makes?\s+(\w+)\s+(?:melee\s+)?attacks?/);
      if (simpleMatch) {
        const count = numWords[simpleMatch[1]] || parseInt(simpleMatch[1]) || 2;
        // Find first attack action
        const firstAttack = allActions.find(a => a.name !== "Multiattack" && /attack:/i.test(a.desc));
        if (firstAttack) {
          for (let i = 0; i < count; i++) attacks.push(firstAttack);
        }
      }
    }

    // Check for "can use its Frightful Presence"
    if (/can\s+use\s+its?\s+/i.test(multiattackAction.desc)) {
      const useMatch = multiattackAction.desc.match(/can\s+use\s+its?\s+([\w\s]+?)(?:\.\s*It\s+|,\s*)/i);
      if (useMatch) {
        const specialName = useMatch[1].trim().toLowerCase();
        const specialAction = actionMap[specialName] || Object.values(actionMap).find(a => a.name.toLowerCase().includes(specialName));
        if (specialAction) attacks.unshift(specialAction); // Use it first
      }
    }

    return attacks;
  };


  // ─── ABILITY SCORE HELPERS ─────────────────────────────────────────────────

  const abilityMod = (score) => Math.floor((score - 10) / 2);

  const abilityShort = { "Strength": "str", "Dexterity": "dex", "Constitution": "con", "Intelligence": "int", "Wisdom": "wis", "Charisma": "cha" };
  const abilityFromShort = { str: "Strength", dex: "Dexterity", con: "Constitution", int: "Intelligence", wis: "Wisdom", cha: "Charisma",
    STR: "Strength", DEX: "Dexterity", CON: "Constitution", INT: "Intelligence", WIS: "Wisdom", CHA: "Charisma" };

  /** Get save modifier for a monster, accounting for proficient saves */
  const getSaveModifier = (monster, ability) => {
    const shortAbility = abilityShort[ability] || ability.toLowerCase().slice(0, 3);
    const score = monster[shortAbility] || 10;
    const baseMod = abilityMod(score);

    // Check proficient saves
    if (monster.saves) {
      const saveStr = monster.saves.toLowerCase();
      const abbrMap = { str: "str", dex: "dex", con: "con", int: "int", wis: "wis", cha: "cha" };
      const regex = new RegExp(`${shortAbility}\\s*([+-]\\d+)`, "i");
      const m = saveStr.match(regex);
      if (m) return parseInt(m[1]);
    }

    return baseMod;
  };

  /** Get proficiency bonus from CR */
  const profBonusFromCR = (cr) => {
    const crNum = typeof cr === "string" ? (cr.includes("/") ? parseInt(cr.split("/")[0]) / parseInt(cr.split("/")[1]) : parseFloat(cr)) : cr;
    if (crNum < 5) return 2;
    if (crNum < 9) return 3;
    if (crNum < 13) return 4;
    if (crNum < 17) return 5;
    if (crNum < 21) return 6;
    if (crNum < 25) return 7;
    if (crNum < 29) return 8;
    return 9;
  };

  /** PC / class creature proficiency by level (PHB) */
  const profBonusFromLevel = (level) => {
    const lv = Math.min(20, Math.max(1, parseInt(level, 10) || 1));
    if (lv <= 4) return 2;
    if (lv <= 8) return 3;
    if (lv <= 12) return 4;
    if (lv <= 16) return 5;
    return 6;
  };

  const DAMAGE_TYPE_WORDS = ["acid", "bludgeoning", "cold", "fire", "force", "lightning", "necrotic", "piercing", "poison", "psychic", "radiant", "slashing", "thunder"];

  const combineAdvDis = (current, incoming) => {
    if (!incoming || incoming === "normal") return current;
    if (!current || current === "normal") return incoming;
    if (current === incoming) return current;
    return "normal";
  };

  /** Build resistance / immunity / vulnerability sets from SRD-style strings */
  const ingestDamageRelationString = (str, rel) => {
    if (!str || typeof str !== "string" || !str.trim()) return;
    str.split(";").map((s) => s.trim()).filter(Boolean).forEach((segment) => {
      const s = segment.toLowerCase();
      const nonmagicalBps = /nonmagical|non-magical|aren't silvered|isn't silvered|adamantine/i.test(s)
        && /bludgeoning|piercing|slashing|weapon/i.test(s);
      if (nonmagicalBps) {
        ["bludgeoning", "piercing", "slashing"].forEach((t) => rel.resist.add(t));
        rel.bpsResistNonmagical = true;
      }
      DAMAGE_TYPE_WORDS.forEach((t) => {
        if (new RegExp("\\b" + t + "\\b").test(s)) rel.resist.add(t);
      });
    });
  };

  const ingestDamageImmuneString = (str, rel) => {
    if (!str || typeof str !== "string" || !str.trim()) return;
    str.split(";").map((s) => s.trim()).filter(Boolean).forEach((segment) => {
      const s = segment.toLowerCase();
      const nonmagicalBps = /nonmagical|non-magical|aren't silvered|adamantine/i.test(s)
        && /bludgeoning|piercing|slashing|weapon/i.test(s);
      if (nonmagicalBps) {
        ["bludgeoning", "piercing", "slashing"].forEach((t) => rel.immune.add(t));
        rel.bpsImmuneNonmagical = true;
      }
      DAMAGE_TYPE_WORDS.forEach((t) => {
        if (new RegExp("\\b" + t + "\\b").test(s)) rel.immune.add(t);
      });
    });
  };

  const ingestDamageVulnString = (str, rel) => {
    if (!str || typeof str !== "string" || !str.trim()) return;
    str.split(";").map((s) => s.trim()).filter(Boolean).forEach((segment) => {
      const s = segment.toLowerCase();
      DAMAGE_TYPE_WORDS.forEach((t) => {
        if (new RegExp("\\b" + t + "\\b").test(s)) rel.vuln.add(t);
      });
    });
  };

  const getDamageRelations = (target) => {
    const rel = {
      resist: new Set(),
      immune: new Set(),
      vuln: new Set(),
      bpsResistNonmagical: false,
      bpsImmuneNonmagical: false,
    };
    ingestDamageRelationString(target.damageResistances, rel);
    ingestDamageImmuneString(target.damageImmunities, rel);
    ingestDamageVulnString(target.damageVulnerabilities, rel);
    return rel;
  };

  const parseConditionImmunities = (str) => {
    const s = new Set();
    if (!str || typeof str !== "string") return s;
    str.split(/[,;]/).map((x) => x.trim().toLowerCase()).filter(Boolean).forEach((c) => s.add(c.replace(/\s+/g, " ")));
    return s;
  };

  /** Apply 5e damage modifiers: immune → 0; then vuln (×2); then resist (½). */
  const applyDamageWithRelations = (rawAmount, damageType, rel, attackOpts) => {
    const dtype = (damageType || "untyped").toLowerCase();
    const magical = !!(attackOpts && attackOpts.magicalWeapon);
    const isBps = ["bludgeoning", "piercing", "slashing"].includes(dtype);
    let a = rawAmount;
    const notes = [];

    const immuneNorm = rel.immune.has(dtype);
    const immuneNmBps = isBps && rel.bpsImmuneNonmagical && rel.immune.has(dtype) && !magical;
    if (immuneNorm || immuneNmBps) {
      notes.push("immune");
      return { amount: 0, notes };
    }

    if (rel.vuln.has(dtype)) {
      a = Math.floor(a * 2);
      notes.push("vulnerable");
    }

    const resistNorm = rel.resist.has(dtype);
    const resistNmBps = isBps && rel.bpsResistNonmagical && rel.resist.has(dtype) && !magical;
    if (resistNorm || resistNmBps) {
      a = Math.floor(a / 2);
      notes.push("resistant");
    }

    return { amount: a, notes };
  };

  const targetAutoFailsStrDexSave = (conds) =>
    (conds || []).some((c) => ["paralyzed", "stunned", "unconscious"].includes(String(c).toLowerCase()));

  const conditionBlockedByImmunity = (cond, immuneSet) => {
    if (!cond || !immuneSet || immuneSet.size === 0) return false;
    const c = String(cond).toLowerCase().replace(/knocked\s+/, "").trim();
    return immuneSet.has(c);
  };


  // ─── COMBAT RESOLUTION ─────────────────────────────────────────────────────

  /** Make an attack roll against a target AC.
   *  combatOpts: { targetDodging, coverACBonus, attackBlessBonus (d4, not auto-rolled here — add to toHit before call if desired) }
   */
  const makeAttackRoll = (toHit, targetAC, advantage = "normal", combatOpts) => {
    let adv = advantage;
    if (combatOpts && combatOpts.targetDodging) adv = combineAdvDis(adv, "disadvantage");
    const bless = combatOpts && combatOpts.attackBlessBonus ? combatOpts.attackBlessBonus : 0;
    const modToHit = toHit + bless;
    const cover = combatOpts && combatOpts.coverACBonus ? parseInt(combatOpts.coverACBonus, 10) || 0 : 0;
    const effectiveAC = targetAC + cover;
    const result = rollD20(modToHit, adv);
    const hit = result.nat20 || (!result.nat1 && result.total >= effectiveAC);
    return { ...result, hit, targetAC: effectiveAC, baseAC: targetAC, coverBonus: cover, isCrit: result.nat20, toHitBonus: bless };
  };

  /** Make a saving throw.
   *  Returns { success, roll, total, nat20, nat1, details }
   */
  const makeSavingThrow = (dc, saveMod, advantage = "normal") => {
    const result = rollD20(saveMod, advantage);
    const success = result.nat20 || (!result.nat1 && result.total >= dc);
    return { ...result, success, dc };
  };

  /** Execute a full attack action against a target.
   *  options: { magicalWeapon, targetDodging, coverACBonus, attackBlessBonus (flat to hit) }
   */
  const executeAttack = (attacker, target, action, options) => {
    const opts = options || {};
    const parsed = parseAttackAction(action);
    if (!parsed) return { results: [], totalDamage: 0, parsed: null };

    const results = [];
    let totalDamage = 0;

    let advMode = "normal";
    const attackerConds = (attacker.conditions || []).map((c) => String(c).toLowerCase());
    const targetConds = (target.conditions || []).map((c) => String(c).toLowerCase());
    if (targetConds.includes("prone") && parsed.attackType === "melee") advMode = "advantage";
    if (targetConds.includes("stunned") || targetConds.includes("paralyzed") || targetConds.includes("unconscious")) advMode = "advantage";
    if (targetConds.includes("restrained")) advMode = "advantage";
    if (targetConds.includes("blinded")) advMode = "advantage";
    if (attackerConds.includes("invisible")) advMode = "advantage";
    if (attackerConds.includes("blinded")) advMode = combineAdvDis(advMode, "disadvantage");
    if (attackerConds.includes("frightened")) advMode = combineAdvDis(advMode, "disadvantage");
    if (attackerConds.includes("poisoned")) advMode = combineAdvDis(advMode, "disadvantage");
    if (attackerConds.includes("restrained")) advMode = combineAdvDis(advMode, "disadvantage");
    if (attackerConds.includes("prone")) advMode = combineAdvDis(advMode, "disadvantage");
    if (targetConds.includes("prone") && parsed.attackType === "ranged") advMode = combineAdvDis(advMode, "disadvantage");

    const combatRollOpts = {
      targetDodging: opts.targetDodging,
      coverACBonus: opts.coverACBonus,
      attackBlessBonus: opts.attackBlessBonus,
    };
    const atkRoll = makeAttackRoll(parsed.toHit, target.ac || 10, advMode, combatRollOpts);
    const dmgRel = getDamageRelations(target);
    const condImmune = parseConditionImmunities(target.conditionImmunities || "");

    if (atkRoll.hit) {
      const isCrit = atkRoll.isCrit;
      const dmgBreakdown = [];
      let atkDmg = 0;

      for (const comp of parsed.damage) {
        const roll = rollDice(comp.dice);
        let dmg = roll.total;
        if (isCrit) {
          const critExtra = rollDice(comp.dice.replace(/[+-]\d+$/, ""));
          dmg += critExtra.total;
        }
        if ((targetConds.includes("paralyzed") || targetConds.includes("unconscious")) && parsed.attackType === "melee" && !isCrit) {
          const autoCritExtra = rollDice(comp.dice.replace(/[+-]\d+$/, ""));
          dmg += autoCritExtra.total;
        }
        const applied = applyDamageWithRelations(dmg, comp.type, dmgRel, opts);
        dmgBreakdown.push({
          type: comp.type,
          dice: comp.dice,
          roll,
          totalBeforeReduction: dmg,
          total: applied.amount,
          damageNotes: applied.notes,
        });
        atkDmg += applied.amount;
      }

      totalDamage += atkDmg;
      results.push({
        type: "attack",
        hit: true,
        isCrit,
        attackRoll: atkRoll,
        damage: dmgBreakdown,
        totalDamage: atkDmg,
        attackType: parsed.attackType,
        name: parsed.name,
      });

      if (parsed.onHitSave) {
        let saveResult;
        let extraDmg = 0;
        if (targetAutoFailsStrDexSave(targetConds) && (parsed.onHitSave.ability === "Strength" || parsed.onHitSave.ability === "Dexterity")) {
          saveResult = { success: false, autoFail: true, total: -999, dc: parsed.onHitSave.dc, details: "auto-fail (incapacitated)" };
        } else {
          const saveMod = getSaveModifier(target, parsed.onHitSave.ability);
          let saveAdv = "normal";
          if (targetConds.includes("restrained") && parsed.onHitSave.ability === "Dexterity") saveAdv = "disadvantage";
          saveResult = makeSavingThrow(parsed.onHitSave.dc, saveMod, saveAdv);
        }
        if (!saveResult.success) {
          if (parsed.onHitSave.damage) {
            const eDmg = rollDice(parsed.onHitSave.damage.dice);
            const ed = applyDamageWithRelations(eDmg.total, parsed.onHitSave.damage.type || "untyped", dmgRel, opts);
            extraDmg = ed.amount;
            totalDamage += extraDmg;
          }
        }
        let condOut = !saveResult.success ? parsed.onHitSave.condition : null;
        if (condOut && conditionBlockedByImmunity(condOut, condImmune)) condOut = null;
        results.push({
          type: "onHitSave",
          save: saveResult,
          ability: parsed.onHitSave.ability,
          dc: parsed.onHitSave.dc,
          condition: condOut,
          extraDamage: extraDmg,
        });
      }
    } else {
      results.push({
        type: "attack",
        hit: false,
        isCrit: false,
        attackRoll: atkRoll,
        damage: [],
        totalDamage: 0,
        attackType: parsed.attackType,
        name: parsed.name,
      });
    }

    return { results, totalDamage, parsed };
  };

  /** Execute a saving throw action (breath weapon, etc.) against multiple targets.
   *  options reserved for future (e.g. line of sight)
   */
  const executeSaveAction = (attacker, targets, action, options) => {
    const parsed = parseSaveAction(action);
    if (!parsed) return { results: [], parsed: null };

    const results = [];
    for (const target of targets) {
      const targetConds = (target.conditions || []).map((c) => String(c).toLowerCase());
      const condImmune = parseConditionImmunities(target.conditionImmunities || "");
      const dmgRel = getDamageRelations(target);

      let saveResult;
      if (targetAutoFailsStrDexSave(targetConds) && (parsed.ability === "Strength" || parsed.ability === "Dexterity")) {
        saveResult = { success: false, autoFail: true, total: -999, dc: parsed.dc, details: "auto-fail" };
      } else {
        const saveMod = getSaveModifier(target, parsed.ability);
        let saveAdv = "normal";
        if (targetConds.includes("restrained") && parsed.ability === "Dexterity") saveAdv = "disadvantage";
        saveResult = makeSavingThrow(parsed.dc, saveMod, saveAdv);
      }

      let damage = 0;
      let damageRoll = null;
      if (parsed.failDamage) {
        damageRoll = rollDice(parsed.failDamage.dice);
        let raw = 0;
        if (saveResult.success && parsed.halfOnSave) raw = Math.floor(damageRoll.total / 2);
        else if (!saveResult.success) raw = damageRoll.total;
        const applied = applyDamageWithRelations(raw, parsed.failDamage.type, dmgRel, options || {});
        damage = applied.amount;
      }

      let appliedConditions = saveResult.success ? [] : parsed.failConditions.filter((c) => !conditionBlockedByImmunity(c, condImmune));

      results.push({
        target: target.name || "Target",
        targetId: target.id,
        save: saveResult,
        damage,
        damageRoll,
        damageType: parsed.failDamage?.type || "",
        conditions: appliedConditions,
      });
    }

    return { results, parsed };
  };

  /** Map a legendary action line to a concrete action from the stat block when possible */
  const resolveLegendaryAction = (monster, legAction) => {
    if (!legAction || !monster) return legAction;
    const desc = legAction.desc || "";
    let m = desc.match(/makes?\s+(?:one|two|three)?\s*([\w\s]+?)\s+attack/i);
    if (m) {
      const key = m[1].trim().toLowerCase().replace(/\s+its\s+/g, " ").replace(/^its\s+/i, "");
      const actions = monster.actions || [];
      const found = actions.find((a) => {
        const n = a.name.toLowerCase();
        return n === key || n.includes(key) || key.includes(n);
      });
      if (found && /attack:/i.test(found.desc || "")) return found;
    }
    m = desc.match(/uses?\s+([\w\s]+?)(?:\.|,|$)/i);
    if (m) {
      const key = m[1].trim().toLowerCase();
      const found = (monster.actions || []).find((a) => a.name.toLowerCase().includes(key));
      if (found) return found;
    }
    return legAction;
  };

  /** Execute a multiattack sequence.
   *  combatOptions forwarded to executeAttack / executeSaveAction
   */
  const executeMultiattack = (attacker, target, monster, combatOptions) => {
    const multiAction = (monster.actions || []).find((a) => a.name.toLowerCase() === "multiattack");
    if (!multiAction) return { attackSequence: [], totalDamage: 0 };

    const attackActions = parseMultiattack(multiAction, monster.actions);
    const sequence = [];
    let totalDamage = 0;

    for (const action of attackActions) {
      const saveAction = parseSaveAction(action);
      if (saveAction) {
        const result = executeSaveAction(attacker, [target], action, combatOptions);
        sequence.push({ action, result: result.results[0], type: "save", parsed: result.parsed });
        totalDamage += result.results[0]?.damage || 0;
      } else {
        const result = executeAttack(attacker, target, action, combatOptions);
        sequence.push({ action, result: result.results[0], type: "attack", parsed: result.parsed });
        totalDamage += result.totalDamage;
      }
    }

    return { attackSequence: sequence, totalDamage };
  };

  /** Average value of dice string for building synthetic attack lines (e.g. 2d6+3) */
  const averageDiceExpr = (expr) => {
    if (!expr) return 0;
    const e = String(expr).replace(/\s/g, "").toLowerCase();
    let sum = 0;
    const re = /(\d+)d(\d+)/g;
    let m;
    while ((m = re.exec(e)) !== null) {
      sum += parseInt(m[1], 10) * (parseInt(m[2], 10) + 1) / 2;
    }
    const modM = e.match(/([+-]\d+)$/);
    if (modM) sum += parseInt(modM[1], 10);
    return Math.floor(sum);
  };

  /**
   * PC / humanoid weapon attack using WEAPONS table.
   * pc: { str, dex, conditions?, proficiencyBonus? } — level used if proficiencyBonus omitted
   */
  const executePcWeaponAttack = (pc, target, weaponName, options) => {
    const opts = options || {};
    const w = WEAPONS[weaponName];
    if (!w) return { results: [], totalDamage: 0, parsed: null, error: "Unknown weapon: " + weaponName };

    const str = pc.str != null ? pc.str : 10;
    const dex = pc.dex != null ? pc.dex : 10;
    const strMod = abilityMod(str);
    const dexMod = abilityMod(dex);
    const useMod = w.properties.includes("finesse") ? Math.max(strMod, dexMod) : (w.melee ? strMod : dexMod);
    const pb = opts.proficiencyBonus != null ? opts.proficiencyBonus : profBonusFromLevel(pc.lv || pc.level || 1);
    const prof = opts.proficient !== false ? pb : 0;
    const toHit = useMod + prof;
    const diceExpr = w.damage;
    const avg = averageDiceExpr(diceExpr) + useMod;
    const reach = w.range || 5;
    const kind = w.melee ? "Melee" : "Ranged";
    const fakeDesc = `${kind} Weapon Attack: +${toHit} to hit, ${w.melee ? "reach" : "range"} ${reach} ft., one target. Hit: ${avg} (${diceExpr}+${useMod}) ${w.type} damage.`;
    const fakeAction = { name: weaponName, desc: fakeDesc };
    const magical = !!opts.magicalWeapon;
    return executeAttack(
      { ...pc, conditions: (pc.conditions || []).map((c) => String(c).toLowerCase()) },
      target,
      fakeAction,
      { ...opts, magicalWeapon: magical }
    );
  };


  // ─── CONDITION EFFECTS ─────────────────────────────────────────────────────

  const CONDITION_EFFECTS = {
    blinded: {
      description: "Can't see. Auto-fail sight-based checks. Attack rolls have disadvantage. Attacks against have advantage.",
      attackDisadvantage: true, attackedWithAdvantage: true,
    },
    charmed: {
      description: "Can't attack charmer. Charmer has advantage on social checks.",
      cantAttackCharmer: true,
    },
    deafened: {
      description: "Can't hear. Auto-fail hearing-based checks.",
    },
    frightened: {
      description: "Disadvantage on ability checks and attacks while source of fear is visible. Can't willingly move closer.",
      attackDisadvantage: true, checkDisadvantage: true,
    },
    grappled: {
      description: "Speed becomes 0. Ends if grappler is incapacitated or moved out of reach.",
      speedZero: true,
    },
    hidden: {
      description: "Unseen and unheard until revealed. Attacks have advantage, attacks against have disadvantage while hidden.",
      attackAdvantage: true, attackedWithDisadvantage: true,
    },
    incapacitated: {
      description: "Can't take actions or reactions.",
      noActions: true, noReactions: true,
    },
    invisible: {
      description: "Impossible to see without magic. Heavily obscured. Attacks have advantage, attacks against have disadvantage.",
      attackAdvantage: true, attackedWithDisadvantage: true,
    },
    paralyzed: {
      description: "Incapacitated. Can't move or speak. Auto-fail STR and DEX saves. Attacks have advantage. Hits within 5ft are auto-crits.",
      noActions: true, noMovement: true, autoFailStrDex: true, attackedWithAdvantage: true, autoCritMelee: true,
    },
    petrified: {
      description: "Transformed to stone. Weight x10. Incapacitated. Resist all damage. Immune to poison and disease.",
      noActions: true, noMovement: true, resistAll: true,
    },
    poisoned: {
      description: "Disadvantage on attack rolls and ability checks.",
      attackDisadvantage: true, checkDisadvantage: true,
    },
    prone: {
      description: "Can only crawl. Disadvantage on attacks. Melee attacks against have advantage. Ranged attacks against have disadvantage.",
      attackDisadvantage: true, meleeAdvantage: true, rangedDisadvantage: true,
    },
    restrained: {
      description: "Speed 0. Attacks have disadvantage. Attacks against have advantage. Disadvantage on DEX saves.",
      speedZero: true, attackDisadvantage: true, attackedWithAdvantage: true, dexSaveDisadvantage: true,
    },
    stunned: {
      description: "Incapacitated. Can't move. Can speak falteringly. Auto-fail STR and DEX saves. Attacks against have advantage.",
      noActions: true, autoFailStrDex: true, attackedWithAdvantage: true,
    },
    unconscious: {
      description: "Incapacitated. Can't move or speak. Unaware. Drop everything. Fall prone. Auto-fail STR and DEX saves. Attacks have advantage. Hits within 5ft are auto-crits.",
      noActions: true, noMovement: true, autoFailStrDex: true, attackedWithAdvantage: true, autoCritMelee: true,
    },
  };


  // ─── CHARACTER ACTION TYPES ────────────────────────────────────────────────
  // All standard actions a character can take in combat

  const STANDARD_ACTIONS = [
    { name: "Attack", type: "action", description: "Make a melee or ranged weapon attack. Extra Attack allows multiple attacks.", icon: "⚔️" },
    { name: "Cast a Spell", type: "action", description: "Cast a spell with a casting time of 1 action.", icon: "✨" },
    { name: "Dash", type: "action", description: "Double your movement speed for this turn.", icon: "💨", effect: "doubleMovement" },
    { name: "Disengage", type: "action", description: "Your movement doesn't provoke opportunity attacks for the rest of the turn.", icon: "🏃", effect: "noOpportunityAttacks" },
    { name: "Dodge", type: "action", description: "Until your next turn, attacks against you have disadvantage if you can see the attacker. DEX saves have advantage.", icon: "🛡️", effect: "dodge" },
    { name: "Help", type: "action", description: "Give an ally advantage on their next ability check or attack roll.", icon: "🤝", effect: "helpAlly" },
    { name: "Hide", type: "action", description: "Make a Dexterity (Stealth) check to hide.", icon: "👁️", effect: "hide" },
    { name: "Ready", type: "action", description: "Prepare an action to trigger on a specific condition.", icon: "⏳", effect: "ready" },
    { name: "Search", type: "action", description: "Make a Wisdom (Perception) or Intelligence (Investigation) check.", icon: "🔍", effect: "search" },
    { name: "Use an Object", type: "action", description: "Interact with an object that requires your action (potion, scroll, etc.).", icon: "🧪", effect: "useObject" },
    { name: "Grapple", type: "action", description: "Athletics check vs target's Athletics or Acrobatics. Replaces one attack.", icon: "🤼", effect: "grapple" },
    { name: "Shove", type: "action", description: "Athletics check to push target 5ft away or knock prone. Replaces one attack.", icon: "👊", effect: "shove" },
  ];

  const BONUS_ACTIONS = [
    { name: "Offhand Attack", type: "bonus", description: "Attack with a light weapon in your other hand (no ability mod to damage).", icon: "🗡️" },
    { name: "Cast Bonus Spell", type: "bonus", description: "Cast a spell with a casting time of 1 bonus action.", icon: "✨" },
    { name: "Class Feature", type: "bonus", description: "Use a class-specific bonus action (Cunning Action, Rage, etc.).", icon: "⭐" },
  ];

  const REACTIONS = [
    { name: "Opportunity Attack", type: "reaction", description: "Attack a creature leaving your reach.", icon: "⚔️" },
    { name: "Readied Action", type: "reaction", description: "Execute your readied action when the trigger occurs.", icon: "⏳" },
    { name: "Cast Reaction Spell", type: "reaction", description: "Cast Shield, Counterspell, or other reaction spells.", icon: "✨" },
  ];

  const FREE_ACTIONS = [
    { name: "Interact with Object", type: "free", description: "One free object interaction per turn (draw weapon, open door, etc.).", icon: "🚪" },
    { name: "Communicate", type: "free", description: "Brief utterance or signal during your turn.", icon: "💬" },
    { name: "Drop Prone", type: "free", description: "Drop to the ground (costs no movement).", icon: "⬇️" },
    { name: "Drop Item", type: "free", description: "Release a held item.", icon: "📦" },
  ];


  // ─── WEAPON DATA ───────────────────────────────────────────────────────────

  const WEAPONS = {
    // Simple Melee
    "Club":           { damage: "1d4", type: "bludgeoning", properties: ["light"], range: 5, category: "simple", melee: true },
    "Dagger":         { damage: "1d4", type: "piercing", properties: ["finesse","light","thrown"], range: 5, thrown: "20/60", category: "simple", melee: true },
    "Greatclub":      { damage: "1d8", type: "bludgeoning", properties: ["two-handed"], range: 5, category: "simple", melee: true },
    "Handaxe":        { damage: "1d6", type: "slashing", properties: ["light","thrown"], range: 5, thrown: "20/60", category: "simple", melee: true },
    "Javelin":        { damage: "1d6", type: "piercing", properties: ["thrown"], range: 5, thrown: "30/120", category: "simple", melee: true },
    "Light Hammer":   { damage: "1d4", type: "bludgeoning", properties: ["light","thrown"], range: 5, thrown: "20/60", category: "simple", melee: true },
    "Mace":           { damage: "1d6", type: "bludgeoning", properties: [], range: 5, category: "simple", melee: true },
    "Quarterstaff":   { damage: "1d6", type: "bludgeoning", properties: ["versatile"], versatile: "1d8", range: 5, category: "simple", melee: true },
    "Sickle":         { damage: "1d4", type: "slashing", properties: ["light"], range: 5, category: "simple", melee: true },
    "Spear":          { damage: "1d6", type: "piercing", properties: ["thrown","versatile"], versatile: "1d8", thrown: "20/60", range: 5, category: "simple", melee: true },
    // Simple Ranged
    "Light Crossbow": { damage: "1d8", type: "piercing", properties: ["ammunition","loading","two-handed"], range: 80, longRange: 320, category: "simple", melee: false },
    "Dart":           { damage: "1d4", type: "piercing", properties: ["finesse","thrown"], range: 20, longRange: 60, category: "simple", melee: false },
    "Shortbow":       { damage: "1d6", type: "piercing", properties: ["ammunition","two-handed"], range: 80, longRange: 320, category: "simple", melee: false },
    "Sling":          { damage: "1d4", type: "bludgeoning", properties: ["ammunition"], range: 30, longRange: 120, category: "simple", melee: false },
    // Martial Melee
    "Battleaxe":      { damage: "1d8", type: "slashing", properties: ["versatile"], versatile: "1d10", range: 5, category: "martial", melee: true },
    "Flail":          { damage: "1d8", type: "bludgeoning", properties: [], range: 5, category: "martial", melee: true },
    "Glaive":         { damage: "1d10", type: "slashing", properties: ["heavy","reach","two-handed"], range: 10, category: "martial", melee: true },
    "Greataxe":       { damage: "1d12", type: "slashing", properties: ["heavy","two-handed"], range: 5, category: "martial", melee: true },
    "Greatsword":     { damage: "2d6", type: "slashing", properties: ["heavy","two-handed"], range: 5, category: "martial", melee: true },
    "Halberd":        { damage: "1d10", type: "slashing", properties: ["heavy","reach","two-handed"], range: 10, category: "martial", melee: true },
    "Lance":          { damage: "1d12", type: "piercing", properties: ["reach","special"], range: 10, category: "martial", melee: true },
    "Longsword":      { damage: "1d8", type: "slashing", properties: ["versatile"], versatile: "1d10", range: 5, category: "martial", melee: true },
    "Maul":           { damage: "2d6", type: "bludgeoning", properties: ["heavy","two-handed"], range: 5, category: "martial", melee: true },
    "Morningstar":    { damage: "1d8", type: "piercing", properties: [], range: 5, category: "martial", melee: true },
    "Pike":           { damage: "1d10", type: "piercing", properties: ["heavy","reach","two-handed"], range: 10, category: "martial", melee: true },
    "Rapier":         { damage: "1d8", type: "piercing", properties: ["finesse"], range: 5, category: "martial", melee: true },
    "Scimitar":       { damage: "1d6", type: "slashing", properties: ["finesse","light"], range: 5, category: "martial", melee: true },
    "Shortsword":     { damage: "1d6", type: "piercing", properties: ["finesse","light"], range: 5, category: "martial", melee: true },
    "Trident":        { damage: "1d6", type: "piercing", properties: ["thrown","versatile"], versatile: "1d8", thrown: "20/60", range: 5, category: "martial", melee: true },
    "War Pick":       { damage: "1d8", type: "piercing", properties: [], range: 5, category: "martial", melee: true },
    "Warhammer":      { damage: "1d8", type: "bludgeoning", properties: ["versatile"], versatile: "1d10", range: 5, category: "martial", melee: true },
    "Whip":           { damage: "1d4", type: "slashing", properties: ["finesse","reach"], range: 10, category: "martial", melee: true },
    // Martial Ranged
    "Blowgun":        { damage: "1", type: "piercing", properties: ["ammunition","loading"], range: 25, longRange: 100, category: "martial", melee: false },
    "Hand Crossbow":  { damage: "1d6", type: "piercing", properties: ["ammunition","light","loading"], range: 30, longRange: 120, category: "martial", melee: false },
    "Heavy Crossbow": { damage: "1d10", type: "piercing", properties: ["ammunition","heavy","loading","two-handed"], range: 100, longRange: 400, category: "martial", melee: false },
    "Longbow":        { damage: "1d8", type: "piercing", properties: ["ammunition","heavy","two-handed"], range: 150, longRange: 600, category: "martial", melee: false },
    "Net":            { damage: "0", type: "none", properties: ["special","thrown"], range: 5, longRange: 15, category: "martial", melee: false },
  };

  /** Get number of attacks from Extra Attack feature based on class and level */
  const getExtraAttacks = (cls, level) => {
    if (!cls || !level) return 1;
    // Fighter gets Extra Attack (2) at 11, (3) at 20
    if (cls === "Fighter") {
      if (level >= 20) return 4;
      if (level >= 11) return 3;
      if (level >= 5) return 2;
      return 1;
    }
    // Most martial classes get Extra Attack at 5
    if (["Paladin", "Ranger", "Barbarian", "Monk"].includes(cls)) {
      return level >= 5 ? 2 : 1;
    }
    // Bladesinger Wizard, Valor Bard, etc. at 6 — simplified
    return 1;
  };


  // ─── ENCOUNTER DIFFICULTY CALCULATOR ───────────────────────────────────────

  const XP_THRESHOLDS = {
    1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
    2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
    3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
    4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
    5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
    6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
    7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
    8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
    9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
    10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
    11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
    12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4500 },
    13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
    14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
    15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
    16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
    17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
    18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
    19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
    20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 },
  };

  const ENCOUNTER_MULTIPLIERS = [
    { count: 1, mult: 1 },
    { count: 2, mult: 1.5 },
    { count: 3, mult: 2 },
    { count: 7, mult: 2.5 },
    { count: 11, mult: 3 },
    { count: 15, mult: 4 },
  ];

  const calculateEncounterDifficulty = (partyLevels, monsterXPs) => {
    const partyThresholds = { easy: 0, medium: 0, hard: 0, deadly: 0 };
    for (const lv of partyLevels) {
      const t = XP_THRESHOLDS[Math.min(20, Math.max(1, lv))];
      partyThresholds.easy += t.easy;
      partyThresholds.medium += t.medium;
      partyThresholds.hard += t.hard;
      partyThresholds.deadly += t.deadly;
    }

    const totalXP = monsterXPs.reduce((a, b) => a + b, 0);
    const count = monsterXPs.length;
    let multiplier = 1;
    for (const { count: c, mult } of ENCOUNTER_MULTIPLIERS) {
      if (count >= c) multiplier = mult;
    }
    const adjustedXP = Math.round(totalXP * multiplier);

    let difficulty = "trivial";
    if (adjustedXP >= partyThresholds.deadly) difficulty = "deadly";
    else if (adjustedXP >= partyThresholds.hard) difficulty = "hard";
    else if (adjustedXP >= partyThresholds.medium) difficulty = "medium";
    else if (adjustedXP >= partyThresholds.easy) difficulty = "easy";

    return { difficulty, adjustedXP, totalXP, multiplier, partyThresholds };
  };


  // ─── RECHARGE MECHANICS ────────────────────────────────────────────────────

  /** Check if a rechargeable ability recharges at the start of the turn.
   *  Returns true if recharged.
   */
  const rollRecharge = (min, max = 6) => {
    const roll = rollDie(6);
    return roll >= min;
  };


  // ─── DEATH SAVES ───────────────────────────────────────────────────────────

  const rollDeathSave = () => {
    const roll = rollDie(20);
    return {
      roll,
      nat20: roll === 20,  // Regain 1 HP
      nat1: roll === 1,    // 2 failures
      success: roll >= 10,
    };
  };


  // ─── INITIATIVE ────────────────────────────────────────────────────────────

  /** Roll initiative for a creature.
   *  dexMod: DEX modifier
   *  Returns { roll, modifier, total }
   */
  const rollInitiative = (dexMod = 0) => {
    const roll = rollDie(20);
    return { roll, modifier: dexMod, total: roll + dexMod };
  };


  // ─── MOVEMENT & DISTANCE ──────────────────────────────────────────────────

  /** Calculate distance in feet between two grid positions (5ft per square).
   *  Uses the D&D diagonal rule (alternating 5/10/5/10...).
   */
  const calculateDistance = (x1, y1, x2, y2, gridSize = 40) => {
    const dx = Math.abs(Math.round((x2 - x1) / gridSize));
    const dy = Math.abs(Math.round((y2 - y1) / gridSize));
    // Standard D&D: each square = 5ft. Diagonal alternates 5/10.
    const min = Math.min(dx, dy);
    const max = Math.max(dx, dy);
    const diag5 = Math.ceil(min / 2);
    const diag10 = Math.floor(min / 2);
    return (max - min) * 5 + diag5 * 5 + diag10 * 10;
  };

  /** Check if a target is within reach/range */
  const isInRange = (attackerX, attackerY, targetX, targetY, range, gridSize = 40) => {
    const dist = calculateDistance(attackerX, attackerY, targetX, targetY, gridSize);
    return dist <= range;
  };


  // ─── PUBLIC API ────────────────────────────────────────────────────────────

  return {
    // Dice
    rollDie,
    rollDice,
    rollD20,
    rollDamage,

    // Parsing
    parseAttackAction,
    parseSaveAction,
    parseMultiattack,

    // Combat Resolution
    makeAttackRoll,
    makeSavingThrow,
    executeAttack,
    executeSaveAction,
    executeMultiattack,

    // Helpers
    abilityMod,
    abilityShort,
    abilityFromShort,
    getSaveModifier,
    profBonusFromCR,
    profBonusFromLevel,
    getExtraAttacks,

    // Encounter
    calculateEncounterDifficulty,
    XP_THRESHOLDS,

    // Mechanics
    rollRecharge,
    rollDeathSave,
    rollInitiative,
    calculateDistance,
    isInRange,

    // Extended resolution
    combineAdvDis,
    getDamageRelations,
    applyDamageWithRelations,
    parseConditionImmunities,
    resolveLegendaryAction,
    executePcWeaponAttack,

    // Data
    CONDITION_EFFECTS,
    STANDARD_ACTIONS,
    BONUS_ACTIONS,
    REACTIONS,
    FREE_ACTIONS,
    WEAPONS,
  };
})();
