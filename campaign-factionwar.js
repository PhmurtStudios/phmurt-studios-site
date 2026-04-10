/* ═══════════════════════════════════════════════════════════════════════════
   PHMURT STUDIOS — FACTION WAR SIMULATOR
   A deep strategic warfare layer combining Risk territory control with
   Total War-style army management, economy, diplomacy, and AI.

   Integrates with campaign factions[], regions[], and npcs[].
   State saved to campaign.warState and synced via auto-save.
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
"use strict";

const { useState, useEffect, useCallback, useRef, useMemo } = React;
const T = window.__PHMURT_THEME || {
  bg:"var(--bg)", bgNav:"var(--bg-nav)", bgCard:"var(--bg-card)", bgHover:"var(--bg-hover)",
  bgMid:"var(--bg-mid)", bgInput:"var(--bg-input)", text:"var(--text)", textDim:"var(--text-dim)",
  textMuted:"var(--text-muted)", textFaint:"var(--text-faint)", crimson:"var(--crimson)",
  crimsonDim:"var(--crimson-dim)", crimsonSoft:"var(--crimson-soft)", crimsonBorder:"var(--crimson-border)",
  border:"var(--border)", borderMid:"var(--border-mid)", gold:"var(--gold)", goldDim:"var(--gold-dim)",
  green:"var(--green)", greenDim:"var(--green-dim)", orange:"var(--orange)", orangeDim:"var(--orange-dim)",
  ui:"'Cinzel', serif", heading:"'Cinzel', serif", body:"'Spectral', Georgia, serif",
};
// Try to get theme from global
try { if (window.T) Object.assign(T, window.T); } catch(e) {}

const LR = window.LucideReact || {};
const { Swords, Shield, Crown, Target, Users, MapPin, Coins, Heart, AlertTriangle,
  ChevronRight, ChevronDown, ChevronUp, X, Plus, Minus, Play, Pause, FastForward,
  SkipForward, Eye, Settings, Scroll, Flag, TrendingUp, TrendingDown, Star,
  Crosshair, Flame, Snowflake, Zap, Castle, Skull, Map: MapIcon, Globe, Activity,
  ArrowRight, RefreshCw, Check, Clock, Package, BookOpen, Edit3 } = LR;

/* ═══════════════════════════════════════════════════════════════════
   SECTION 1: CONSTANTS & GAME DATA
   ═══════════════════════════════════════════════════════════════════ */

// ── Unit Definitions ──
// Each unit type has combat stats, costs, and special properties.
// attack/defense are base values; HP is per-model; morale determines rout threshold.
const UNIT_TYPES = {
  // ── INFANTRY ──
  militia:       { name:"Militia",         type:"infantry", tier:1, attack:3,  defense:4,  hp:10, speed:1,   morale:30,  range:0, cost:{ gold:40,  food:10 },            upkeep:{ gold:4,  food:2 },  req:null,              special:null, icon:"🛡️", desc:"Cheap defenders. Weak in open battle but adequate behind walls." },
  footmen:       { name:"Men-at-Arms",     type:"infantry", tier:2, attack:6,  defense:7,  hp:16, speed:1,   morale:55,  range:0, cost:{ gold:90,  food:15, iron:5 },    upkeep:{ gold:8,  food:3 },  req:"barracks",        special:null, icon:"⚔️", desc:"Reliable infantry. The backbone of any army." },
  pikemen:       { name:"Pikemen",         type:"infantry", tier:2, attack:5,  defense:9,  hp:14, speed:1,   morale:55,  range:0, cost:{ gold:85,  food:15, iron:8 },    upkeep:{ gold:7,  food:3 },  req:"barracks",        special:"anti_cavalry", icon:"🔱", desc:"Devastating against cavalry charges. Strong defensive line." },
  eliteGuards:   { name:"Elite Guards",    type:"infantry", tier:3, attack:9,  defense:10, hp:22, speed:1,   morale:80,  range:0, cost:{ gold:200, food:20, iron:15 },   upkeep:{ gold:18, food:4 },  req:"warAcademy",      special:"holdTheLine", icon:"🏅", desc:"The finest soldiers. Immovable in defense, devastating in attack." },
  berserkers:    { name:"Berserkers",      type:"infantry", tier:3, attack:14, defense:3,  hp:18, speed:1.5, morale:90,  range:0, cost:{ gold:180, food:25 },            upkeep:{ gold:16, food:5 },  req:"warAcademy",      special:"frenzy", icon:"🪓", desc:"Savage warriors who fight harder as they take damage. Glass cannons." },
  // ── RANGED ──
  bowmen:        { name:"Bowmen",          type:"ranged",   tier:1, attack:4,  defense:2,  hp:8,  speed:1,   morale:35,  range:2, cost:{ gold:60,  food:10 },            upkeep:{ gold:5,  food:2 },  req:null,              special:null, icon:"🏹", desc:"Basic ranged unit. Softens enemies before melee." },
  longbowmen:    { name:"Longbowmen",      type:"ranged",   tier:2, attack:7,  defense:3,  hp:10, speed:1,   morale:50,  range:3, cost:{ gold:110, food:12, iron:3 },    upkeep:{ gold:9,  food:3 },  req:"archeryRange",    special:"volley", icon:"🎯", desc:"Extended range and devastating volley fire." },
  crossbowmen:   { name:"Crossbowmen",     type:"ranged",   tier:2, attack:8,  defense:4,  hp:12, speed:1,   morale:50,  range:2, cost:{ gold:120, food:12, iron:8 },    upkeep:{ gold:10, food:3 },  req:"archeryRange",    special:"armorPierce", icon:"⊕", desc:"Armor-piercing bolts. Slower to fire but devastating against heavy troops." },
  // ── CAVALRY ──
  scoutRiders:   { name:"Scout Riders",    type:"cavalry",  tier:1, attack:4,  defense:3,  hp:10, speed:3,   morale:40,  range:0, cost:{ gold:80,  food:15 },            upkeep:{ gold:7,  food:4 },  req:null,              special:"scout", icon:"🐴", desc:"Fast and cheap. Excellent for reconnaissance and flanking." },
  cavalry:       { name:"Heavy Cavalry",   type:"cavalry",  tier:2, attack:9,  defense:6,  hp:18, speed:2.5, morale:65,  range:0, cost:{ gold:180, food:20, iron:10 },   upkeep:{ gold:15, food:5 },  req:"stables",         special:"charge", icon:"🐎", desc:"Devastating charge breaks enemy formations. Vulnerable to pikes." },
  knights:       { name:"Knights",         type:"cavalry",  tier:3, attack:12, defense:9,  hp:24, speed:2,   morale:85,  range:0, cost:{ gold:300, food:25, iron:20 },   upkeep:{ gold:25, food:6 },  req:"royalStables",    special:"charge", icon:"⚜️", desc:"Elite mounted warriors. The most powerful conventional unit." },
  // ── SIEGE ──
  batteringRam:  { name:"Battering Ram",   type:"siege",    tier:1, attack:3,  defense:2,  hp:25, speed:0.5, morale:20,  range:0, cost:{ gold:120, iron:15 },            upkeep:{ gold:8 },           req:"siegeWorkshop",   special:"gateBreaker", icon:"🪵", desc:"Smashes through gates. Essential for assaulting fortified positions." },
  catapult:      { name:"Catapult",        type:"siege",    tier:2, attack:12, defense:1,  hp:20, speed:0.5, morale:20,  range:3, cost:{ gold:250, iron:25 },            upkeep:{ gold:15 },          req:"siegeWorkshop",   special:"wallBreaker", icon:"🪨", desc:"Hurls boulders at walls and formations. Devastating against structures." },
  trebuchet:     { name:"Trebuchet",       type:"siege",    tier:3, attack:18, defense:1,  hp:30, speed:0.3, morale:20,  range:4, cost:{ gold:400, iron:40 },            upkeep:{ gold:25 },          req:"engineersGuild",  special:"wallBreaker", icon:"💥", desc:"The ultimate siege weapon. Reduces walls to rubble from extreme range." },
  // ── MAGIC ──
  apprentices:   { name:"War Apprentices", type:"magic",    tier:1, attack:5,  defense:2,  hp:6,  speed:1,   morale:40,  range:2, cost:{ gold:100, mana:10 },            upkeep:{ gold:10, mana:3 },  req:"mageTower",       special:null, icon:"✨", desc:"Novice spellcasters. Weak individually but add magical punch." },
  battleMages:   { name:"Battle Mages",    type:"magic",    tier:2, attack:10, defense:3,  hp:8,  speed:1,   morale:55,  range:3, cost:{ gold:220, mana:25 },            upkeep:{ gold:20, mana:6 },  req:"arcaneAcademy",   special:"aoeBlast", icon:"🔮", desc:"Trained war mages. Area-of-effect spells devastate clustered enemies." },
  archmages:     { name:"Archmages",       type:"magic",    tier:3, attack:16, defense:4,  hp:10, speed:1,   morale:70,  range:4, cost:{ gold:400, mana:50 },            upkeep:{ gold:35, mana:12 }, req:"wizardsSpire",    special:"devastation", icon:"⚡", desc:"Masters of destruction magic. A single archmage can turn a battle." },
  // ── SPECIAL ──
  spies:         { name:"Spies",           type:"agent",    tier:2, attack:2,  defense:1,  hp:4,  speed:4,   morale:60,  range:0, cost:{ gold:150 },                     upkeep:{ gold:12 },          req:"spyNetwork",      special:"sabotage", icon:"🗡️", desc:"Covert agents. Sabotage buildings, assassinate commanders, scout armies." },
  clerics:       { name:"War Clerics",     type:"support",  tier:2, attack:3,  defense:5,  hp:12, speed:1,   morale:75,  range:1, cost:{ gold:150, mana:15 },            upkeep:{ gold:12, mana:4 },  req:"temple",          special:"heal", icon:"✝️", desc:"Divine healers. Restore HP to friendly units and boost morale." },
};

// ── Building Definitions ──
// Buildings are constructed in territories. Each has prerequisites, costs, and effects.
const BUILDINGS = {
  // Military
  trainingGrounds: { name:"Training Grounds", tier:1, chain:"military",  cost:{ gold:100, iron:10 },             turns:1, req:null,              effect:"Unlocks Militia recruitment", unlocks:["militia"] },
  barracks:        { name:"Barracks",         tier:2, chain:"military",  cost:{ gold:250, iron:30 },             turns:2, req:"trainingGrounds", effect:"Unlocks Men-at-Arms and Pikemen", unlocks:["footmen","pikemen"] },
  warAcademy:      { name:"War Academy",      tier:3, chain:"military",  cost:{ gold:500, iron:60, gold2:100 },  turns:3, req:"barracks",        effect:"Unlocks Elite Guards and Berserkers", unlocks:["eliteGuards","berserkers"] },
  // Ranged
  huntersLodge:    { name:"Hunter's Lodge",   tier:1, chain:"ranged",    cost:{ gold:80 },                       turns:1, req:null,              effect:"Unlocks Bowmen recruitment", unlocks:["bowmen"] },
  archeryRange:    { name:"Archery Range",    tier:2, chain:"ranged",    cost:{ gold:200, iron:15 },             turns:2, req:"huntersLodge",   effect:"Unlocks Longbowmen and Crossbowmen", unlocks:["longbowmen","crossbowmen"] },
  // Cavalry
  paddock:         { name:"Paddock",          tier:1, chain:"cavalry",   cost:{ gold:100, food:20 },             turns:1, req:null,              effect:"Unlocks Scout Riders", unlocks:["scoutRiders"] },
  stables:         { name:"Stables",          tier:2, chain:"cavalry",   cost:{ gold:300, food:30, iron:15 },    turns:2, req:"paddock",         effect:"Unlocks Heavy Cavalry", unlocks:["cavalry"] },
  royalStables:    { name:"Royal Stables",    tier:3, chain:"cavalry",   cost:{ gold:600, food:50, iron:30 },    turns:3, req:"stables",         effect:"Unlocks Knights", unlocks:["knights"] },
  // Siege
  siegeWorkshop:   { name:"Siege Workshop",   tier:2, chain:"siege",     cost:{ gold:200, iron:25 },             turns:2, req:null,              effect:"Unlocks Battering Ram and Catapult", unlocks:["batteringRam","catapult"] },
  engineersGuild:  { name:"Engineers' Guild", tier:3, chain:"siege",     cost:{ gold:450, iron:50 },             turns:3, req:"siegeWorkshop",   effect:"Unlocks Trebuchet", unlocks:["trebuchet"] },
  // Magic
  mageTower:       { name:"Mage Tower",       tier:1, chain:"magic",     cost:{ gold:200, mana:20 },             turns:2, req:null,              effect:"Unlocks War Apprentices. +5 mana/turn", unlocks:["apprentices"], bonus:{ mana:5 } },
  arcaneAcademy:   { name:"Arcane Academy",   tier:2, chain:"magic",     cost:{ gold:400, mana:50 },             turns:3, req:"mageTower",       effect:"Unlocks Battle Mages. +10 mana/turn", unlocks:["battleMages"], bonus:{ mana:10 } },
  wizardsSpire:    { name:"Wizard's Spire",   tier:3, chain:"magic",     cost:{ gold:700, mana:100 },            turns:4, req:"arcaneAcademy",   effect:"Unlocks Archmages. +20 mana/turn", unlocks:["archmages"], bonus:{ mana:20 } },
  // Economic
  market:          { name:"Market",           tier:1, chain:"economic",  cost:{ gold:80 },                       turns:1, req:null,              effect:"+15 gold/turn from trade", bonus:{ gold:15 } },
  tradeHub:        { name:"Trade Hub",        tier:2, chain:"economic",  cost:{ gold:250 },                      turns:2, req:"market",          effect:"+30 gold/turn. Trade routes with allies", bonus:{ gold:30 } },
  grandExchange:   { name:"Grand Exchange",   tier:3, chain:"economic",  cost:{ gold:600 },                      turns:3, req:"tradeHub",        effect:"+60 gold/turn. Regional economic dominance", bonus:{ gold:60 } },
  farm:            { name:"Farm",             tier:1, chain:"food",      cost:{ gold:60 },                       turns:1, req:null,              effect:"+10 food/turn", bonus:{ food:10 } },
  granary:         { name:"Granary",          tier:2, chain:"food",      cost:{ gold:150 },                      turns:2, req:"farm",            effect:"+25 food/turn. Reserves prevent famine", bonus:{ food:25 } },
  mine:            { name:"Mine",             tier:1, chain:"iron",      cost:{ gold:100 },                      turns:1, req:null,              effect:"+8 iron/turn", bonus:{ iron:8 } },
  smelter:         { name:"Smelter",          tier:2, chain:"iron",      cost:{ gold:250, iron:20 },             turns:2, req:"mine",            effect:"+18 iron/turn", bonus:{ iron:18 } },
  // Defensive
  watchtower:      { name:"Watchtower",       tier:1, chain:"defense",   cost:{ gold:60 },                       turns:1, req:null,              effect:"+1 fortification. Reveals approaching armies", fort:1 },
  palisade:        { name:"Palisade",         tier:2, chain:"defense",   cost:{ gold:150, iron:10 },             turns:2, req:"watchtower",      effect:"+2 fortification", fort:2 },
  stoneWalls:      { name:"Stone Walls",      tier:3, chain:"defense",   cost:{ gold:400, iron:40 },             turns:3, req:"palisade",        effect:"+3 fortification. Siege engines required to breach", fort:3 },
  fortress:        { name:"Fortress",         tier:4, chain:"defense",   cost:{ gold:800, iron:80 },             turns:5, req:"stoneWalls",      effect:"+5 fortification. Near-impregnable stronghold", fort:5 },
  // Special
  temple:          { name:"Temple",           tier:1, chain:"faith",     cost:{ gold:150 },                      turns:2, req:null,              effect:"Unlocks War Clerics. +10 morale all units", unlocks:["clerics"], bonus:{ morale:10 } },
  spyNetwork:      { name:"Spy Network",      tier:2, chain:"espionage", cost:{ gold:200 },                      turns:2, req:null,              effect:"Unlocks Spies. Enables sabotage and intel", unlocks:["spies"] },
  // Advanced buildings
  hospital:        { name:"Field Hospital",   tier:2, chain:"support",   cost:{ gold:200, mana:10 },             turns:2, req:"temple",          effect:"Heals 5% troops per turn in this region", bonus:{ heal:5 } },
  warCouncil:      { name:"War Council",      tier:3, chain:"command",   cost:{ gold:400 },                      turns:3, req:"warAcademy",      effect:"+2 commander level to armies in region", bonus:{ cmdBonus:2 } },
  supplyDepot:     { name:"Supply Depot",     tier:2, chain:"logistics", cost:{ gold:180, food:20 },             turns:2, req:null,              effect:"Armies resupply 2× faster. +10 food/turn", bonus:{ food:10, supplyRate:2 } },
  harbor:          { name:"Harbor",           tier:2, chain:"naval",     cost:{ gold:250 },                      turns:2, req:null,              effect:"+20 gold/turn on coast tiles. Enables naval movement", bonus:{ gold:20 }, terrainReq:"coast" },
};

// ── Terrain Combat Modifiers ──
const TERRAIN_MODS = {
  plains:    { infantry:0,  ranged:0,   cavalry:3,  siege:0,  magic:0, defense:0,  label:"Open ground favors cavalry charges" },
  forest:    { infantry:1,  ranged:2,   cavalry:-3, siege:-1, magic:0, defense:2,  label:"Dense cover. Cavalry struggles" },
  mountains: { infantry:1,  ranged:1,   cavalry:-2, siege:-2, magic:0, defense:4,  label:"High ground. Strong defensive terrain" },
  swamp:     { infantry:-1, ranged:-1,  cavalry:-4, siege:-3, magic:1, defense:1,  label:"Treacherous ground. Slows everything" },
  desert:    { infantry:-1, ranged:0,   cavalry:1,  siege:0,  magic:0, defense:-1, label:"Heat and sand. Attrition is constant" },
  coast:     { infantry:0,  ranged:1,   cavalry:-1, siege:0,  magic:0, defense:1,  label:"Coastal terrain. Mixed conditions" },
  tundra:    { infantry:-1, ranged:-1,  cavalry:-2, siege:-1, magic:0, defense:2,  label:"Frozen wastes. Attrition and cold" },
  hills:     { infantry:0,  ranged:2,   cavalry:-1, siege:0,  magic:0, defense:3,  label:"Rolling hills. Ranged advantage" },
};

// ── AI Personality Profiles ──
const AI_PROFILES = {
  aggressive:   { name:"Warmonger",    expandWeight:0.8, attackWeight:0.9, diplomacyWeight:0.2, buildWeight:0.4, desc:"Attacks weak neighbors. Prioritizes military buildup." },
  balanced:     { name:"Pragmatist",   expandWeight:0.5, attackWeight:0.5, diplomacyWeight:0.5, buildWeight:0.6, desc:"Adapts to situation. Builds when safe, fights when necessary." },
  defensive:    { name:"Turtle",       expandWeight:0.2, attackWeight:0.2, diplomacyWeight:0.6, buildWeight:0.9, desc:"Fortifies borders. Only attacks in retaliation." },
  diplomatic:   { name:"Statesman",    expandWeight:0.3, attackWeight:0.3, diplomacyWeight:0.9, buildWeight:0.7, desc:"Forms alliances. Uses diplomacy over warfare." },
  expansionist: { name:"Conqueror",    expandWeight:0.9, attackWeight:0.7, diplomacyWeight:0.3, buildWeight:0.5, desc:"Claims unclaimed territory. Rapid expansion." },
  economic:     { name:"Merchant Lord",expandWeight:0.4, attackWeight:0.2, diplomacyWeight:0.7, buildWeight:0.9, desc:"Builds wealth. Fights only to protect trade." },
};

// ── Resource base yields per terrain ──
const TERRAIN_YIELDS = {
  plains:    { gold:8,  food:12, iron:2,  mana:0 },
  forest:    { gold:5,  food:6,  iron:3,  mana:3 },
  mountains: { gold:6,  food:2,  iron:12, mana:2 },
  swamp:     { gold:3,  food:4,  iron:1,  mana:8 },
  desert:    { gold:10, food:1,  iron:3,  mana:4 },
  coast:     { gold:12, food:8,  iron:1,  mana:1 },
  tundra:    { gold:3,  food:2,  iron:5,  mana:5 },
  hills:     { gold:7,  food:6,  iron:8,  mana:1 },
};

// Population growth modifier by state
const STATE_MODS = {
  stable:     { income:1.0, recruit:1.0, growth:1.0, morale:0 },
  prosperous: { income:1.3, recruit:1.1, growth:1.2, morale:5 },
  tense:      { income:0.8, recruit:0.9, growth:0.5, morale:-5 },
  contested:  { income:0.5, recruit:1.2, growth:0,   morale:-10 },
  rebuilding: { income:0.6, recruit:0.7, growth:0.8, morale:-3 },
  corrupted:  { income:0.7, recruit:0.8, growth:0.3, morale:-8 },
  dangerous:  { income:0.4, recruit:1.0, growth:0.2, morale:-12 },
  destroyed:  { income:0.1, recruit:0.3, growth:0,   morale:-20 },
  conquered:  { income:0.6, recruit:0.5, growth:0.3, morale:-15 },
  patrolled:  { income:1.1, recruit:1.0, growth:1.0, morale:3 },
};


// ── Commander Traits ──
const COMMANDER_TRAITS = {
  tactician:    { name:"Tactician",     atkBonus:0, defBonus:3, moraleBonus:0,  siegeBonus:0, desc:"Superior defensive formations" },
  aggressive:   { name:"Aggressive",    atkBonus:4, defBonus:-1, moraleBonus:0, siegeBonus:0, desc:"Favors all-out assault" },
  inspiring:    { name:"Inspiring",     atkBonus:0, defBonus:0, moraleBonus:15, siegeBonus:0, desc:"Troops fight harder and rout less" },
  siegemaster:  { name:"Siege Master",  atkBonus:0, defBonus:0, moraleBonus:0,  siegeBonus:6, desc:"Expert at breaching fortifications" },
  cautious:     { name:"Cautious",      atkBonus:-2, defBonus:2, moraleBonus:5, siegeBonus:0, desc:"Preserves troops, takes fewer casualties" },
  ruthless:     { name:"Ruthless",      atkBonus:3, defBonus:0, moraleBonus:-5, siegeBonus:0, desc:"Feared commander — enemies lose morale" },
  logistician:  { name:"Logistician",   atkBonus:0, defBonus:0, moraleBonus:0,  siegeBonus:0, desc:"Supply consumption halved", supplyBonus:true },
  cavalryman:   { name:"Cavalryman",    atkBonus:0, defBonus:0, moraleBonus:0,  siegeBonus:0, desc:"+4 attack for all cavalry", cavalryBonus:4 },
  arcane:       { name:"Arcane",        atkBonus:0, defBonus:0, moraleBonus:0,  siegeBonus:0, desc:"+4 attack for all magic units", magicBonus:4 },
  legendary:    { name:"Legendary",     atkBonus:3, defBonus:3, moraleBonus:10, siegeBonus:2, desc:"A once-in-a-generation leader" },
};

// ── Random World Events (fire once per turn, ~30% chance) ──
const WORLD_EVENTS = [
  { id:"plague", weight:2, apply:(state, rng) => {
    const rids = Object.keys(state.regions).filter(r => state.regions[r].controllerId && state.regions[r].population > 500);
    if (!rids.length) return null;
    const rid = rids[Math.floor(rng() * rids.length)];
    const r = state.regions[rid];
    r.population = Math.max(100, Math.floor(r.population * 0.7));
    r.state = "dangerous";
    return { text:`Plague devastates ${r.name}! Population decimated.`, icon:"☠", severity:"critical" };
  }},
  { id:"bumper_harvest", weight:3, apply:(state, rng) => {
    const fids = Object.keys(state.factions).filter(f => !state.factions[f].eliminated);
    if (!fids.length) return null;
    const fid = fids[Math.floor(rng() * fids.length)];
    state.factions[fid].resources.food += 50;
    return { text:`Bumper harvest for ${state.factions[fid].name}! +50 food`, icon:"🌾", severity:"info", faction:state.factions[fid].name };
  }},
  { id:"gold_vein", weight:2, apply:(state, rng) => {
    const rids = Object.keys(state.regions).filter(r => state.regions[r].terrain === "mountains" && state.regions[r].controllerId);
    if (!rids.length) return null;
    const rid = rids[Math.floor(rng() * rids.length)];
    const r = state.regions[rid];
    const f = state.factions[r.controllerId];
    if (f) f.gold += 100;
    return { text:`Gold vein discovered in ${r.name}! +100 gold for ${r.controllerName}`, icon:"💎", severity:"major" };
  }},
  { id:"rebellion", weight:2, apply:(state, rng) => {
    const rids = Object.keys(state.regions).filter(r => state.regions[r].unrest > 15);
    if (!rids.length) return null;
    const rid = rids[Math.floor(rng() * rids.length)];
    const r = state.regions[rid];
    const oldCtrl = r.controllerId;
    r.controllerId = null; r.controllerName = "Rebels"; r.state = "contested"; r.unrest = 40;
    if (oldCtrl && state.factions[oldCtrl]) {
      state.factions[oldCtrl].territories = state.factions[oldCtrl].territories.filter(t => t !== parseInt(rid));
    }
    return { text:`Rebellion in ${r.name}! Territory lost to rebels.`, icon:"🔥", severity:"critical" };
  }},
  { id:"mercenaries", weight:3, apply:(state, rng) => {
    const fids = Object.keys(state.factions).filter(f => !state.factions[f].eliminated && state.factions[f].gold > 150);
    if (!fids.length) return null;
    const fid = fids[Math.floor(rng() * fids.length)];
    const f = state.factions[fid];
    f.gold -= 100;
    const army = f.armies[0];
    if (army) {
      const existing = army.units.find(u => u.type === "footmen");
      if (existing) existing.count += 30;
      else army.units.push({ type:"footmen", count:30, hp:UNIT_TYPES.footmen.hp });
    }
    return { text:`${f.name} hires mercenaries! +30 footmen`, icon:"⚔", severity:"info", faction:f.name };
  }},
  { id:"dragon_sighting", weight:1, apply:(state, rng) => {
    const rids = Object.keys(state.regions);
    if (!rids.length) return null;
    const rid = rids[Math.floor(rng() * rids.length)];
    const r = state.regions[rid];
    // Damage all armies in region
    Object.values(state.factions).forEach(f => {
      f.armies.forEach(a => {
        if (a.position === parseInt(rid)) {
          a.units.forEach(u => u.count = Math.max(1, Math.floor(u.count * 0.85)));
          a.morale = Math.max(10, a.morale - 20);
        }
      });
    });
    return { text:`Dragon sighted over ${r.name}! All armies in region take 15% casualties.`, icon:"🐉", severity:"critical" };
  }},
  { id:"diplomatic_marriage", weight:2, apply:(state, rng) => {
    const fids = Object.keys(state.factions).filter(f => !state.factions[f].eliminated);
    if (fids.length < 2) return null;
    const a = fids[Math.floor(rng() * fids.length)];
    let b = fids[Math.floor(rng() * fids.length)];
    while (b === a && fids.length > 1) b = fids[Math.floor(rng() * fids.length)];
    if (a === b) return null;
    const fa = state.factions[a], fb = state.factions[b];
    if (fa.diplomacy[b]) fa.diplomacy[b].relation = Math.min(100, fa.diplomacy[b].relation + 20);
    if (fb.diplomacy[a]) fb.diplomacy[a].relation = Math.min(100, fb.diplomacy[a].relation + 20);
    return { text:`Royal marriage between ${fa.name} and ${fb.name}! Relations improve.`, icon:"💒", severity:"major" };
  }},
  { id:"spy_scandal", weight:2, apply:(state, rng) => {
    const fids = Object.keys(state.factions).filter(f => !state.factions[f].eliminated);
    if (fids.length < 2) return null;
    const spy = fids[Math.floor(rng() * fids.length)];
    let target = fids[Math.floor(rng() * fids.length)];
    while (target === spy && fids.length > 1) target = fids[Math.floor(rng() * fids.length)];
    if (spy === target) return null;
    const fs = state.factions[spy], ft = state.factions[target];
    if (fs.diplomacy[target]) fs.diplomacy[target].relation = Math.max(-100, fs.diplomacy[target].relation - 25);
    if (ft.diplomacy[spy]) ft.diplomacy[spy].relation = Math.max(-100, ft.diplomacy[spy].relation - 25);
    return { text:`${ft.name} uncovers ${fs.name} spies! Relations plummet.`, icon:"🗡️", severity:"major" };
  }},
];

/* ═══════════════════════════════════════════════════════════════════
   SECTION 2: GAME ENGINE
   ═══════════════════════════════════════════════════════════════════ */

// ── Seeded RNG for deterministic simulation ──
function seededRng(seed) {
  let s = seed;
  return function() {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// ── Initialize war state from campaign data ──
function initWarState(campaignData) {
  const factions = campaignData.factions || [];
  const regions = campaignData.regions || [];
  const npcs = campaignData.npcs || [];
  const rng = seededRng(Date.now());

  // Build adjacency graph — connect regions that share a faction or are close in list order
  const adjacency = {};
  regions.forEach((r, i) => {
    adjacency[r.id] = [];
    regions.forEach((r2, j) => {
      if (i === j) return;
      // Connect if: same faction, or adjacent in list (within 2 hops), or both cities/towns
      const sameFaction = r.ctrl && r2.ctrl && r.ctrl === r2.ctrl;
      const closeInList = Math.abs(i - j) <= 2;
      const bothSettlements = ["capital","city","town"].includes(r.type) && ["capital","city","town"].includes(r2.type);
      if (sameFaction || closeInList || (bothSettlements && Math.abs(i - j) <= 4)) {
        if (!adjacency[r.id].includes(r2.id)) adjacency[r.id].push(r2.id);
      }
    });
    // Ensure at least one connection
    if (adjacency[r.id].length === 0 && regions.length > 1) {
      const nearest = i === 0 ? 1 : i - 1;
      adjacency[r.id].push(regions[nearest].id);
      if (!adjacency[regions[nearest].id]) adjacency[regions[nearest].id] = [];
      if (!adjacency[regions[nearest].id].includes(r.id)) adjacency[regions[nearest].id].push(r.id);
    }
  });

  // Initialize faction war data
  const warFactions = {};
  factions.forEach((f, i) => {
    const controlled = regions.filter(r => r.ctrl === f.name).map(r => r.id);
    const profile = Object.keys(AI_PROFILES)[i % Object.keys(AI_PROFILES).length];
    const leaders = npcs.filter(n => n.faction === f.name && (n.isLeader || n.role?.match(/king|lord|chief|ruler|general|commander/i)));
    warFactions[f.id] = {
      id: f.id,
      name: f.name,
      color: f.color || `hsl(${i * 60}, 60%, 50%)`,
      power: f.power || 50,
      personality: profile,
      isPlayerControlled: false,
      eliminated: false,
      gold: 200 + Math.floor(f.power * 8),
      resources: {
        food: 50 + Math.floor(controlled.length * 20),
        iron: 20 + Math.floor(controlled.length * 8),
        mana: 10 + Math.floor(rng() * 20),
      },
      territories: controlled,
      armies: [],
      diplomacy: {},
      buildQueue: {}, // { regionId: { building, turnsLeft } }
      commanderPool: leaders.map(n => {
        const traitKeys = Object.keys(COMMANDER_TRAITS);
        const t1 = traitKeys[Math.floor(rng() * traitKeys.length)];
        let t2 = traitKeys[Math.floor(rng() * traitKeys.length)];
        while (t2 === t1) t2 = traitKeys[Math.floor(rng() * traitKeys.length)];
        return {
          id: n.id,
          name: n.name,
          level: n.level || Math.floor(5 + rng() * 10),
          traits: n.traits?.length ? n.traits : (rng() > 0.5 ? [t1, t2] : [t1]),
          alive: true,
        };
      }),
      turnIncome: { gold:0, food:0, iron:0, mana:0 },
      losses: { armies:0, territories:0, battles:0 },
      victories: { battles:0, territoriesGained:0 },
    };

    // Initialize diplomacy with other factions
    factions.forEach(f2 => {
      if (f2.id === f.id) return;
      let relation = 0;
      if ((f.allies || []).includes(f2.name)) relation = 40 + Math.floor(rng() * 20);
      else if ((f.rivals || []).includes(f2.name)) relation = -40 - Math.floor(rng() * 20);
      else relation = -10 + Math.floor(rng() * 20);
      warFactions[f.id].diplomacy[f2.id] = {
        relation: Math.max(-100, Math.min(100, relation)),
        treaties: [],
        warDeclared: false,
        truceUntil: 0,
      };
    });

    // Create starting army for each faction with territories
    if (controlled.length > 0) {
      const homeRegion = controlled[0];
      const commander = warFactions[f.id].commanderPool[0] || { id: -1, name: f.name + " General", level: 5, traits: [], alive: true };
      const armySize = Math.max(2, Math.floor(f.power / 15));
      const units = [];
      for (let u = 0; u < armySize; u++) {
        if (u < Math.ceil(armySize * 0.5)) units.push({ type:"footmen", count: 40 + Math.floor(rng() * 40), hp:UNIT_TYPES.footmen.hp });
        else if (u < Math.ceil(armySize * 0.7)) units.push({ type:"bowmen", count: 25 + Math.floor(rng() * 25), hp:UNIT_TYPES.bowmen.hp });
        else units.push({ type:"scoutRiders", count: 15 + Math.floor(rng() * 15), hp:UNIT_TYPES.scoutRiders.hp });
      }
      warFactions[f.id].armies.push({
        id: "army-" + f.id + "-1",
        name: f.name + " Main Host",
        commanderId: commander.id,
        commanderName: commander.name,
        units: units,
        position: homeRegion,
        movingTo: null,
        movementProgress: 0,
        morale: 70 + Math.floor(rng() * 20),
        supply: 100,
        experience: 0,
      });
    }
  });

  // Initialize region war data
  const warRegions = {};
  regions.forEach(r => {
    const terrain = r.terrain || "plains";
    const yields = TERRAIN_YIELDS[terrain] || TERRAIN_YIELDS.plains;
    const stateMod = STATE_MODS[r.state] || STATE_MODS.stable;
    const controller = factions.find(f => f.name === r.ctrl);

    warRegions[r.id] = {
      id: r.id,
      name: r.name,
      terrain: terrain,
      type: r.type || "wilderness",
      controllerId: controller ? controller.id : null,
      controllerName: r.ctrl || "Unaligned",
      population: parseInt(String(r.population || "1000").replace(/,/g, "")) || 1000,
      state: r.state || "stable",
      fortification: r.type === "capital" ? 3 : r.type === "city" ? 2 : r.type === "town" ? 1 : 0,
      buildings: [],
      garrison: [],
      baseYield: { ...yields },
      unrest: 0,
      siegeTurns: 0,
      underSiege: false,
      // Map layout position (auto-generated, DM can drag to reposition)
      x: 0, y: 0,
    };
  });

  // Auto-layout region positions in a force-directed-ish pattern
  const regionIds = Object.keys(warRegions);
  const cols = Math.ceil(Math.sqrt(regionIds.length));
  regionIds.forEach((rid, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    warRegions[rid].x = 80 + col * 140 + (row % 2 ? 70 : 0) + Math.floor(rng() * 30 - 15);
    warRegions[rid].y = 80 + row * 120 + Math.floor(rng() * 20 - 10);
  });

  return {
    turn: 1,
    phase: "planning", // planning, movement, battle, resolution
    speed: 0, // 0=paused, 1=slow, 2=normal, 3=fast
    tickInterval: null,
    factions: warFactions,
    regions: warRegions,
    adjacency: adjacency,
    battles: [],         // Current turn's battles
    battleLog: [],       // All resolved battles
    eventLog: [],        // Turn events and notifications
    turnHistory: [],     // Summary per turn
    settings: {
      turnDuration: "week", // day, week, month
      fogOfWar: false,
      attrition: true,
      morale: true,
      supplyLines: true,
    },
    seed: Date.now(),
  };
}

// ── Calculate faction income ──
function calcIncome(state, factionId) {
  const faction = state.factions[factionId];
  if (!faction) return { gold:0, food:0, iron:0, mana:0 };
  const income = { gold:0, food:0, iron:0, mana:0 };

  faction.territories.forEach(rid => {
    const region = state.regions[rid];
    if (!region) return;
    const stateMod = STATE_MODS[region.state] || STATE_MODS.stable;
    const mult = stateMod.income;
    income.gold += Math.floor(region.baseYield.gold * mult);
    income.food += Math.floor(region.baseYield.food * mult);
    income.iron += Math.floor(region.baseYield.iron * mult);
    income.mana += Math.floor(region.baseYield.mana * mult);

    // Building bonuses
    (region.buildings || []).forEach(bId => {
      const b = BUILDINGS[bId];
      if (b && b.bonus) {
        Object.keys(b.bonus).forEach(k => {
          if (k !== "morale" && income[k] !== undefined) income[k] += b.bonus[k];
        });
      }
    });
  });

  // Upkeep costs
  const upkeep = { gold:0, food:0, iron:0, mana:0 };
  faction.armies.forEach(army => {
    army.units.forEach(u => {
      const ut = UNIT_TYPES[u.type];
      if (ut && ut.upkeep) {
        Object.keys(ut.upkeep).forEach(k => {
          upkeep[k] = (upkeep[k] || 0) + ut.upkeep[k] * Math.ceil(u.count / 10); // upkeep per 10 models
        });
      }
    });
  });

  income.gold -= upkeep.gold;
  income.food -= upkeep.food;
  income.iron -= (upkeep.iron || 0);
  income.mana -= (upkeep.mana || 0);

  return income;
}

// ── Get commander trait bonuses for an army ──
function getCommanderBonuses(army, factionData) {
  const bonuses = { atk:0, def:0, morale:0, siege:0, supplySave:false, cavalryBonus:0, magicBonus:0, cautious:false };
  if (!factionData || !army.commanderId) return bonuses;
  const cmd = (factionData.commanderPool || []).find(c => c.id === army.commanderId);
  if (!cmd || !cmd.traits) return bonuses;
  cmd.traits.forEach(tId => {
    const t = COMMANDER_TRAITS[tId];
    if (!t) return;
    bonuses.atk += t.atkBonus || 0;
    bonuses.def += t.defBonus || 0;
    bonuses.morale += t.moraleBonus || 0;
    bonuses.siege += t.siegeBonus || 0;
    if (t.supplyBonus) bonuses.supplySave = true;
    if (t.cavalryBonus) bonuses.cavalryBonus += t.cavalryBonus;
    if (t.magicBonus) bonuses.magicBonus += t.magicBonus;
    if (tId === "cautious") bonuses.cautious = true;
  });
  return bonuses;
}

// ── Combat Resolution Engine (Enhanced) ──
function resolvesBattle(attacker, defender, region, state) {
  const terrain = TERRAIN_MODS[region.terrain] || TERRAIN_MODS.plains;
  const fortBonus = region.controllerId === defender.factionId ? (region.fortification || 0) * 5 : 0;
  const atkFaction = state.factions[attacker.factionId];
  const defFaction = state.factions[defender.factionId];
  const atkCmd = getCommanderBonuses(attacker, atkFaction);
  const defCmd = getCommanderBonuses(defender, defFaction);

  // Check for siege context — attacker assaulting fortified position
  const isSiegeAssault = fortBonus > 0 && region.controllerId === defender.factionId;
  const hasSiegeEquipment = attacker.units.some(u => UNIT_TYPES[u.type]?.type === "siege");

  // War council building bonus
  const defWarCouncil = (region.buildings || []).includes("warCouncil") && region.controllerId === defender.factionId;
  const atkWarCouncil = (region.buildings || []).includes("warCouncil") && region.controllerId === attacker.factionId;

  // Calculate army power
  function calcArmyPower(army, isDefender, cmdBonus) {
    let power = 0;
    let totalModels = 0;
    army.units.forEach(u => {
      const ut = UNIT_TYPES[u.type];
      if (!ut) return;
      const count = u.count;
      totalModels += count;
      let atk = ut.attack + (terrain[ut.type] || 0) + (cmdBonus.atk || 0);
      let def = ut.defense + (isDefender ? fortBonus : 0) + (isDefender ? (terrain.defense || 0) : 0) + (cmdBonus.def || 0);

      // Commander cavalry/magic specialization
      if (ut.type === "cavalry" && cmdBonus.cavalryBonus) atk += cmdBonus.cavalryBonus;
      if (ut.type === "magic" && cmdBonus.magicBonus) atk += cmdBonus.magicBonus;

      // Special abilities
      if (ut.special === "charge" && !isDefender) atk += 4;
      if (ut.special === "anti_cavalry") {
        // Count enemy cavalry for bonus scaling
        const enemyArmy = isDefender ? attacker : defender;
        const enemyCav = enemyArmy.units.filter(eu => UNIT_TYPES[eu.type]?.type === "cavalry").reduce((s,eu) => s + eu.count, 0);
        if (enemyCav > 0) atk += 5; // enhanced anti-cav when enemy has cavalry
        else atk += 2; // small base bonus
      }
      if (ut.special === "frenzy") atk += Math.floor((1 - u.hp / ut.hp) * 6);
      if (ut.special === "holdTheLine" && isDefender) def += 3;
      if (ut.special === "armorPierce") atk += 2;
      if (ut.special === "volley" && !isDefender) atk += 2;
      if (ut.special === "aoeBlast") atk += 3;
      if (ut.special === "devastation") atk += 6;
      // Siege specials — enhanced
      if (ut.special === "wallBreaker" && fortBonus > 0) atk += 8 + (cmdBonus.siege || 0);
      if (ut.special === "gateBreaker" && fortBonus > 0) atk += 5 + (cmdBonus.siege || 0);
      // Healer special
      if (ut.special === "heal") {
        // Clerics restore HP to friendlies — modeled as defense boost
        def += 4;
      }

      // Siege assault penalty for non-siege units attacking walls
      if (!isDefender && isSiegeAssault && ut.type !== "siege" && ut.type !== "magic" && !hasSiegeEquipment) {
        atk = Math.floor(atk * 0.6); // 40% penalty attacking walls without siege engines
      }

      power += (atk + def) * count * (Math.min(100, army.morale + (cmdBonus.morale || 0)) / 100);
    });

    // Commander level bonus (3% per level)
    let cmdLvl = army.commanderLevel || 5;
    if (isDefender && defWarCouncil) cmdLvl += 2;
    if (!isDefender && atkWarCouncil) cmdLvl += 2;
    power *= 1 + (cmdLvl * 0.03);

    // Experience bonus (1% per XP)
    power *= 1 + (army.experience || 0) * 0.01;

    // Supply penalty — starving army fights poorly
    if (army.supply < 30) power *= 0.7 + (army.supply / 100);

    return { power, totalModels };
  }

  const atkCalc = calcArmyPower(attacker, false, atkCmd);
  const defCalc = calcArmyPower(defender, true, defCmd);

  const total = atkCalc.power + defCalc.power;
  const atkRatio = total > 0 ? atkCalc.power / total : 0.5;

  // Add randomness (±15%)
  const rng = seededRng(state.seed + state.turn + (attacker.id?.charCodeAt?.(0) || 0));
  const roll = 0.85 + rng() * 0.3;
  const adjustedRatio = Math.max(0.05, Math.min(0.95, atkRatio * roll));

  const attackerWins = adjustedRatio > 0.5;

  // Calculate casualties — cautious commanders reduce winner losses
  const baseCasualtyRate = 0.15 + rng() * 0.15;
  let winnerCasualtyRate = baseCasualtyRate * 0.5;
  let loserCasualtyRate = baseCasualtyRate * 1.5;
  const routCasualtyRate = 0.1;

  if (attackerWins && atkCmd.cautious) winnerCasualtyRate *= 0.7;
  if (!attackerWins && defCmd.cautious) winnerCasualtyRate *= 0.7;

  // Siege assaults are bloodier
  if (isSiegeAssault) {
    winnerCasualtyRate *= 1.3;
    loserCasualtyRate *= 1.2;
  }

  function applyCasualties(army, rate) {
    army.units.forEach(u => {
      const losses = Math.ceil(u.count * rate);
      u.count = Math.max(0, u.count - losses);
    });
    army.units = army.units.filter(u => u.count > 0);
    army.morale = Math.max(0, army.morale - Math.floor(rate * 40));
  }

  const winner = attackerWins ? attacker : defender;
  const loser = attackerWins ? defender : attacker;

  applyCasualties(winner, winnerCasualtyRate);
  applyCasualties(loser, loserCasualtyRate + routCasualtyRate);

  // Experience gain — more for hard-fought battles
  const closeness = 1 - Math.abs(adjustedRatio - 0.5) * 2; // 0-1, higher = closer fight
  const xpGain = Math.floor(5 + closeness * 5);
  winner.experience = (winner.experience || 0) + xpGain;
  loser.experience = (loser.experience || 0) + Math.floor(xpGain * 0.5);

  // Commander level up chance (10% per battle, 20% for close fights)
  const lvlUpChance = 0.1 + closeness * 0.1;
  if (rng() < lvlUpChance && atkFaction) {
    const cmd = (atkFaction.commanderPool || []).find(c => c.id === attacker.commanderId);
    if (cmd) cmd.level = (cmd.level || 5) + 1;
  }
  if (rng() < lvlUpChance && defFaction) {
    const cmd = (defFaction.commanderPool || []).find(c => c.id === defender.commanderId);
    if (cmd) cmd.level = (cmd.level || 5) + 1;
  }

  // Fortification damage — siege equipment degrades walls
  let fortDamage = 0;
  if (isSiegeAssault && attackerWins) {
    fortDamage = hasSiegeEquipment ? 2 : 1;
    region.fortification = Math.max(0, region.fortification - fortDamage);
  }

  return {
    attackerWins,
    attackerPower: Math.round(atkCalc.power),
    defenderPower: Math.round(defCalc.power),
    attackerCasualties: Math.round(attackerWins ? winnerCasualtyRate * 100 : (loserCasualtyRate + routCasualtyRate) * 100),
    defenderCasualties: Math.round(attackerWins ? (loserCasualtyRate + routCasualtyRate) * 100 : winnerCasualtyRate * 100),
    terrain: terrain.label,
    fortBonus,
    fortDamage,
    isSiegeAssault,
    adjustedRatio: Math.round(adjustedRatio * 100),
    xpGained: xpGain,
  };
}

// ── AI Decision Engine ──
function aiTakeTurn(state, factionId) {
  const faction = state.factions[factionId];
  if (!faction || faction.isPlayerControlled || faction.eliminated) return [];
  const profile = AI_PROFILES[faction.personality] || AI_PROFILES.balanced;
  const rng = seededRng(state.seed + state.turn * 100 + factionId);
  const actions = [];

  // 1. Economic: Build if we can afford it
  if (rng() < profile.buildWeight) {
    faction.territories.forEach(rid => {
      const region = state.regions[rid];
      if (!region || faction.buildQueue[rid]) return; // already building
      const existing = region.buildings || [];
      // Prioritize: food if low, then military, then economy
      let target = null;
      if (faction.resources.food < 30 && !existing.includes("farm")) target = "farm";
      else if (!existing.includes("trainingGrounds")) target = "trainingGrounds";
      else if (!existing.includes("market")) target = "market";
      else if (!existing.includes("huntersLodge")) target = "huntersLodge";
      else if (existing.includes("trainingGrounds") && !existing.includes("barracks")) target = "barracks";
      else if (!existing.includes("watchtower")) target = "watchtower";
      else if (!existing.includes("mine") && region.terrain === "mountains") target = "mine";
      else if (!existing.includes("paddock") && region.terrain === "plains") target = "paddock";
      else if (!existing.includes("mageTower") && (region.terrain === "swamp" || region.terrain === "forest")) target = "mageTower";
      // Advanced builds for defensive personalities
      else if (profile.buildWeight > 0.7 && existing.includes("watchtower") && !existing.includes("palisade")) target = "palisade";
      else if (profile.buildWeight > 0.8 && existing.includes("palisade") && !existing.includes("stoneWalls")) target = "stoneWalls";
      else if (!existing.includes("supplyDepot") && faction.armies.length > 1) target = "supplyDepot";
      else if (existing.includes("barracks") && !existing.includes("siegeWorkshop") && profile.attackWeight > 0.5) target = "siegeWorkshop";
      else if (!existing.includes("temple") && faction.resources.mana > 30) target = "temple";
      else if (existing.includes("market") && !existing.includes("tradeHub") && profile.buildWeight > 0.6) target = "tradeHub";
      else if (existing.includes("mine") && !existing.includes("smelter")) target = "smelter";
      else if (existing.includes("farm") && !existing.includes("granary") && faction.resources.food < 80) target = "granary";

      if (target && BUILDINGS[target]) {
        const b = BUILDINGS[target];
        if (b.req && !existing.includes(b.req)) return;
        const cost = b.cost;
        let canAfford = true;
        Object.keys(cost).forEach(k => {
          const rk = k === "gold2" ? "gold" : k;
          if ((faction.gold && rk === "gold" ? faction.gold : faction.resources[rk] || 0) < cost[k]) canAfford = false;
        });
        if (canAfford) {
          actions.push({ type:"build", regionId:rid, building:target });
        }
      }
    });
  }

  // 2. Recruitment: Build armies if we have resources
  if (rng() < profile.attackWeight + 0.3) {
    faction.territories.forEach(rid => {
      const region = state.regions[rid];
      if (!region) return;
      const available = (region.buildings || []).flatMap(b => (BUILDINGS[b]?.unlocks || []));
      if (available.length === 0) available.push("militia"); // everyone can recruit militia
      // Find best available unit we can afford
      const affordable = available.filter(uType => {
        const ut = UNIT_TYPES[uType];
        if (!ut) return false;
        let canAfford = true;
        Object.keys(ut.cost).forEach(k => {
          const have = k === "gold" ? faction.gold : (faction.resources[k] || 0);
          if (have < ut.cost[k] * 2) canAfford = false; // recruit at least 20
        });
        return canAfford;
      });
      if (affordable.length > 0 && faction.armies.length < faction.territories.length + 2) {
        const unitType = affordable[Math.floor(rng() * affordable.length)];
        actions.push({ type:"recruit", regionId:rid, unitType, count: 20 + Math.floor(rng() * 30) });
      }
    });
  }

  // 3. Military: Move armies toward enemy territory
  if (rng() < profile.attackWeight) {
    faction.armies.forEach(army => {
      if (army.movingTo) return; // already moving
      const pos = army.position;
      const adj = state.adjacency[pos] || [];
      // Find hostile neighbors
      const hostileNeighbors = adj.filter(rid => {
        const region = state.regions[rid];
        if (!region || !region.controllerId) return false;
        if (region.controllerId === factionId) return false;
        const diplo = faction.diplomacy[region.controllerId];
        return diplo && (diplo.warDeclared || diplo.relation < -30);
      });
      const neutralNeighbors = adj.filter(rid => {
        const region = state.regions[rid];
        return region && !region.controllerId;
      });

      if (hostileNeighbors.length > 0 && rng() < profile.attackWeight) {
        const target = hostileNeighbors[Math.floor(rng() * hostileNeighbors.length)];
        actions.push({ type:"move", armyId:army.id, targetRegion:target });
      } else if (neutralNeighbors.length > 0 && rng() < profile.expandWeight) {
        const target = neutralNeighbors[Math.floor(rng() * neutralNeighbors.length)];
        actions.push({ type:"move", armyId:army.id, targetRegion:target });
      }
    });
  }

  // 4. Diplomacy: Consider war declarations or peace
  if (rng() < profile.diplomacyWeight) {
    Object.keys(faction.diplomacy).forEach(otherId => {
      const diplo = faction.diplomacy[otherId];
      const other = state.factions[otherId];
      if (!other || other.eliminated) return;

      if (!diplo.warDeclared && diplo.relation < -50 && rng() < profile.attackWeight * 0.5) {
        // Declare war
        actions.push({ type:"declareWar", targetFactionId: parseInt(otherId) });
      } else if (diplo.warDeclared && diplo.relation > -20 && rng() < profile.diplomacyWeight * 0.3) {
        // Offer peace
        actions.push({ type:"offerPeace", targetFactionId: parseInt(otherId) });
      } else if (!diplo.warDeclared && diplo.relation > 30 && !diplo.treaties.includes("alliance") && rng() < profile.diplomacyWeight * 0.4) {
        // Form alliance
        actions.push({ type:"formAlliance", targetFactionId: parseInt(otherId) });
      }
    });
  }

  return actions;
}

// ── Process a full turn ──
function processTurn(state) {
  const newState = JSON.parse(JSON.stringify(state));
  const rng = seededRng(newState.seed + newState.turn);
  const turnEvents = [];

  // Phase 1: Income
  Object.keys(newState.factions).forEach(fid => {
    const f = newState.factions[fid];
    if (f.eliminated) return;
    const income = calcIncome(newState, parseInt(fid));
    f.gold += income.gold;
    f.resources.food += income.food;
    f.resources.iron += income.iron;
    f.resources.mana += income.mana;
    f.turnIncome = income;
    // Prevent negatives (starvation/bankruptcy)
    if (f.gold < 0) { f.gold = 0; turnEvents.push({ faction:f.name, text:"Treasury depleted! Army morale dropping.", icon:"💰", severity:"warning" }); f.armies.forEach(a => a.morale = Math.max(0, a.morale - 10)); }
    if (f.resources.food < 0) { f.resources.food = 0; turnEvents.push({ faction:f.name, text:"Famine! Troops deserting.", icon:"🍞", severity:"critical" }); f.armies.forEach(a => { a.morale = Math.max(0, a.morale - 15); a.units.forEach(u => u.count = Math.max(1, Math.floor(u.count * 0.9))); }); }
  });

  // Phase 2: AI actions
  Object.keys(newState.factions).forEach(fid => {
    const actions = aiTakeTurn(newState, parseInt(fid));
    const f = newState.factions[fid];
    actions.forEach(action => {
      switch(action.type) {
        case "build": {
          const b = BUILDINGS[action.building];
          if (!b) break;
          // Deduct costs
          Object.keys(b.cost).forEach(k => {
            const rk = k === "gold2" ? "gold" : k;
            if (rk === "gold") f.gold -= b.cost[k];
            else f.resources[rk] = (f.resources[rk] || 0) - b.cost[k];
          });
          f.buildQueue[action.regionId] = { building: action.building, turnsLeft: b.turns };
          turnEvents.push({ faction:f.name, text: `Constructing ${b.name} in ${newState.regions[action.regionId]?.name}`, icon:"🏗️", severity:"info" });
          break;
        }
        case "recruit": {
          const ut = UNIT_TYPES[action.unitType];
          if (!ut) break;
          const count = action.count;
          Object.keys(ut.cost).forEach(k => {
            const total = ut.cost[k] * Math.ceil(count / 10);
            if (k === "gold") f.gold -= total;
            else f.resources[k] = (f.resources[k] || 0) - total;
          });
          // Add to army in region, or create garrison
          const armyInRegion = f.armies.find(a => a.position === action.regionId && !a.movingTo);
          if (armyInRegion) {
            const existing = armyInRegion.units.find(u => u.type === action.unitType);
            if (existing) existing.count += count;
            else armyInRegion.units.push({ type:action.unitType, count, hp:ut.hp });
          } else {
            f.armies.push({
              id: "army-" + fid + "-" + (f.armies.length + 1) + "-t" + newState.turn,
              name: f.name + " Garrison " + (f.armies.length + 1),
              commanderId: -1,
              commanderName: "Local Commander",
              units: [{ type:action.unitType, count, hp:ut.hp }],
              position: action.regionId,
              movingTo: null,
              movementProgress: 0,
              morale: 60,
              supply: 100,
              experience: 0,
            });
          }
          turnEvents.push({ faction:f.name, text:`Recruited ${count} ${ut.name}`, icon:ut.icon, severity:"info" });
          break;
        }
        case "move": {
          const army = f.armies.find(a => a.id === action.armyId);
          if (army) {
            army.movingTo = action.targetRegion;
            army.movementProgress = 0;
            const targetName = newState.regions[action.targetRegion]?.name || "unknown";
            turnEvents.push({ faction:f.name, text:`${army.name} marching to ${targetName}`, icon:"🚩", severity:"info" });
          }
          break;
        }
        case "declareWar": {
          const target = newState.factions[action.targetFactionId];
          if (target) {
            f.diplomacy[action.targetFactionId].warDeclared = true;
            f.diplomacy[action.targetFactionId].relation = Math.max(-100, f.diplomacy[action.targetFactionId].relation - 40);
            if (target.diplomacy[fid]) {
              target.diplomacy[fid].warDeclared = true;
              target.diplomacy[fid].relation = Math.max(-100, target.diplomacy[fid].relation - 40);
            }
            turnEvents.push({ faction:f.name, text:`Declared WAR on ${target.name}!`, icon:"⚔️", severity:"critical" });
          }
          break;
        }
        case "offerPeace": {
          const target = newState.factions[action.targetFactionId];
          if (target && rng() > 0.4) { // 60% accept rate
            f.diplomacy[action.targetFactionId].warDeclared = false;
            f.diplomacy[action.targetFactionId].truceUntil = newState.turn + 5;
            f.diplomacy[action.targetFactionId].relation += 15;
            if (target.diplomacy[fid]) {
              target.diplomacy[fid].warDeclared = false;
              target.diplomacy[fid].truceUntil = newState.turn + 5;
              target.diplomacy[fid].relation += 15;
            }
            turnEvents.push({ faction:f.name, text:`Peace treaty signed with ${target.name}`, icon:"🕊️", severity:"major" });
          }
          break;
        }
        case "formAlliance": {
          const target = newState.factions[action.targetFactionId];
          if (target && rng() > 0.3) {
            f.diplomacy[action.targetFactionId].treaties.push("alliance");
            f.diplomacy[action.targetFactionId].relation = Math.min(100, f.diplomacy[action.targetFactionId].relation + 20);
            if (target.diplomacy[fid]) {
              target.diplomacy[fid].treaties.push("alliance");
              target.diplomacy[fid].relation = Math.min(100, target.diplomacy[fid].relation + 20);
            }
            turnEvents.push({ faction:f.name, text:`Alliance formed with ${target.name}`, icon:"🤝", severity:"major" });
          }
          break;
        }
      }
    });
  });

  // Phase 3: Movement resolution
  Object.keys(newState.factions).forEach(fid => {
    const f = newState.factions[fid];
    f.armies.forEach(army => {
      if (!army.movingTo) return;
      if (army.units.length === 0) return;
      const speed = Math.min(1, ...army.units.map(u => UNIT_TYPES[u.type]?.speed || 1));
      army.movementProgress += speed;
      if (army.movementProgress >= 1) {
        army.position = army.movingTo;
        army.movingTo = null;
        army.movementProgress = 0;
      }
    });
  });

  // Phase 4: Battle resolution
  // Check for armies in same region from hostile factions
  const regionArmies = {};
  Object.keys(newState.factions).forEach(fid => {
    newState.factions[fid].armies.forEach(army => {
      if (!regionArmies[army.position]) regionArmies[army.position] = [];
      regionArmies[army.position].push({ ...army, factionId: parseInt(fid), factionName: newState.factions[fid].name });
    });
  });

  Object.keys(regionArmies).forEach(rid => {
    const armies = regionArmies[rid];
    if (armies.length < 2) return;
    // Check all pairs for hostility
    for (let i = 0; i < armies.length; i++) {
      for (let j = i + 1; j < armies.length; j++) {
        const a = armies[i];
        const b = armies[j];
        if (a.factionId === b.factionId) continue;
        const diplo = newState.factions[a.factionId]?.diplomacy?.[b.factionId];
        if (!diplo?.warDeclared) continue;

        const region = newState.regions[rid];
        // Determine attacker (the one who moved into the territory)
        const aIsHome = region.controllerId === a.factionId;
        const attacker = aIsHome ? b : a;
        const defender = aIsHome ? a : b;

        const result = resolvesBattle(attacker, defender, region, newState);

        // Apply results back to actual army objects
        const realAtk = newState.factions[attacker.factionId].armies.find(x => x.id === attacker.id);
        const realDef = newState.factions[defender.factionId].armies.find(x => x.id === defender.id);
        if (realAtk) { realAtk.units = attacker.units; realAtk.morale = attacker.morale; realAtk.experience = attacker.experience; }
        if (realDef) { realDef.units = defender.units; realDef.morale = defender.morale; realDef.experience = defender.experience; }

        // Remove armies with no units
        newState.factions[attacker.factionId].armies = newState.factions[attacker.factionId].armies.filter(a => a.units.length > 0);
        newState.factions[defender.factionId].armies = newState.factions[defender.factionId].armies.filter(a => a.units.length > 0);

        // Territory changes
        if (result.attackerWins && region.controllerId === defender.factionId) {
          const oldOwner = newState.factions[defender.factionId];
          const newOwner = newState.factions[attacker.factionId];
          region.controllerId = attacker.factionId;
          region.controllerName = newOwner.name;
          region.state = "conquered";
          region.unrest = 30;
          oldOwner.territories = oldOwner.territories.filter(t => t !== parseInt(rid));
          newOwner.territories.push(parseInt(rid));
          oldOwner.losses.territories++;
          newOwner.victories.territoriesGained++;
        }

        const battleRecord = {
          turn: newState.turn,
          region: region.name,
          attacker: newState.factions[attacker.factionId].name,
          defender: newState.factions[defender.factionId].name,
          attackerColor: newState.factions[attacker.factionId].color,
          defenderColor: newState.factions[defender.factionId].color,
          winner: result.attackerWins ? "attacker" : "defender",
          ...result,
        };
        newState.battleLog.push(battleRecord);
        turnEvents.push({
          faction: result.attackerWins ? newState.factions[attacker.factionId].name : newState.factions[defender.factionId].name,
          text: `Battle of ${region.name}: ${result.attackerWins ? newState.factions[attacker.factionId].name : newState.factions[defender.factionId].name} victorious!`,
          icon: "⚔️",
          severity: "critical",
          battle: battleRecord,
        });
      }
    }
  });

  // Phase 5: Building completion
  Object.keys(newState.factions).forEach(fid => {
    const f = newState.factions[fid];
    Object.keys(f.buildQueue).forEach(rid => {
      const entry = f.buildQueue[rid];
      entry.turnsLeft--;
      if (entry.turnsLeft <= 0) {
        const region = newState.regions[rid];
        if (region) {
          region.buildings = region.buildings || [];
          region.buildings.push(entry.building);
          const b = BUILDINGS[entry.building];
          if (b?.fort) region.fortification += b.fort;
          turnEvents.push({ faction:f.name, text:`${b?.name || entry.building} completed in ${region.name}`, icon:"✅", severity:"info" });
        }
        delete f.buildQueue[rid];
      }
    });
  });

  // Phase 6: Morale, supply, healing, and population
  Object.keys(newState.factions).forEach(fid => {
    const f = newState.factions[fid];
    if (f.eliminated) return;
    f.armies.forEach(army => {
      const cmdBonus = getCommanderBonuses(army, f);
      const region = newState.regions[army.position];
      const inFriendly = f.territories.includes(army.position);
      const hasSupplyDepot = region && (region.buildings || []).includes("supplyDepot");
      const hasHospital = region && (region.buildings || []).includes("hospital");
      const supplyRate = hasSupplyDepot ? 40 : 20;

      if (inFriendly) {
        army.morale = Math.min(100, army.morale + 5 + (cmdBonus.morale > 0 ? 2 : 0));
        army.supply = Math.min(100, army.supply + supplyRate);
        // Hospital healing — restore 5% troops
        if (hasHospital) {
          army.units.forEach(u => {
            const ut = UNIT_TYPES[u.type];
            if (ut) u.count = Math.min(u.count + Math.ceil(u.count * 0.05), u.count + 10); // cap +10 per turn
          });
        }
      } else {
        const drain = cmdBonus.supplySave ? 5 : 10;
        army.supply = Math.max(0, army.supply - drain);
        if (army.supply <= 20) {
          army.morale = Math.max(0, army.morale - 5);
          army.units.forEach(u => u.count = Math.max(1, Math.floor(u.count * 0.95)));
        }
        if (army.supply <= 0) {
          // Critical starvation
          army.morale = Math.max(0, army.morale - 10);
          army.units.forEach(u => u.count = Math.max(1, Math.floor(u.count * 0.88)));
          turnEvents.push({ faction:f.name, text:`${army.name} starving in hostile territory!`, icon:"💀", severity:"warning" });
        }
      }
    });
    // Population growth in stable territories
    f.territories.forEach(rid => {
      const r = newState.regions[rid];
      if (!r) return;
      const sm = STATE_MODS[r.state] || STATE_MODS.stable;
      if (sm.growth > 0) r.population = Math.floor(r.population * (1 + sm.growth * 0.01));
    });
    // Remove empty armies
    f.armies = f.armies.filter(a => a.units.length > 0 && a.units.some(u => u.count > 0));
    // Check elimination
    if (f.territories.length === 0 && f.armies.length === 0) {
      f.eliminated = true;
      turnEvents.push({ faction:f.name, text:`${f.name} has been ELIMINATED!`, icon:"💀", severity:"critical" });
    }
  });

  // Phase 7: Unrest and state changes
  Object.keys(newState.regions).forEach(rid => {
    const r = newState.regions[rid];
    if (!r.controllerId) return;
    // Unrest decays over time
    if (r.unrest > 0) r.unrest = Math.max(0, r.unrest - 3);
    // State transitions
    if (r.state === "conquered" && r.unrest <= 10) r.state = "tense";
    if (r.state === "tense" && r.unrest <= 0) r.state = "stable";
    if (r.state === "destroyed" && rng() < 0.1) r.state = "rebuilding";
    if (r.state === "rebuilding" && rng() < 0.2) r.state = "tense";
  });

  // Phase 8: Random world events (~30% chance per turn)
  if (rng() < 0.3) {
    const totalWeight = WORLD_EVENTS.reduce((s, e) => s + e.weight, 0);
    let roll = rng() * totalWeight;
    for (const evt of WORLD_EVENTS) {
      roll -= evt.weight;
      if (roll <= 0) {
        const result = evt.apply(newState, rng);
        if (result) turnEvents.push({ ...result, turn: newState.turn });
        break;
      }
    }
  }

  newState.eventLog = [...newState.eventLog, ...turnEvents.map(e => ({ ...e, turn: newState.turn }))];
  // Trim event log to prevent unbounded growth
  if (newState.eventLog.length > 500) newState.eventLog = newState.eventLog.slice(-500);
  if (newState.battleLog.length > 200) newState.battleLog = newState.battleLog.slice(-200);
  newState.turnHistory.push({ turn: newState.turn, events: turnEvents.length, battles: newState.battleLog.filter(b => b.turn === newState.turn).length });
  newState.turn++;
  newState.seed++;

  return newState;
}


/* ═══════════════════════════════════════════════════════════════════
   SECTION 3: UI COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

// ── Shared UI Primitives ──
function WarBtn({ children, onClick, active, danger, small, disabled, style:s }) {
  return React.createElement("button", {
    onClick: disabled ? undefined : onClick,
    style: {
      padding: small ? "4px 8px" : "7px 14px",
      background: danger ? T.crimsonDim : active ? T.crimsonDim : T.bgHover,
      border: "1px solid " + (danger ? T.crimsonDim : active ? T.crimsonDim : T.border),
      borderRadius: 4, cursor: disabled ? "default" : "pointer",
      color: danger ? T.crimson : active ? T.crimson : T.textMuted,
      fontFamily: T.ui, fontSize: small ? 9 : 10, letterSpacing: "1px", textTransform: "uppercase",
      display: "inline-flex", alignItems: "center", gap: 5, transition: "all 0.15s",
      opacity: disabled ? 0.4 : 1, ...s,
    }
  }, children);
}

function StatBox({ label, value, icon, color, small }) {
  return React.createElement("div", { style: { background:T.bgCard, border:"1px solid " + T.border, borderRadius:4, padding: small ? "6px 8px" : "10px 12px", textAlign:"center", minWidth: small ? 60 : 80 } },
    icon && React.createElement("div", { style: { fontSize: small ? 14 : 18, marginBottom:2 } }, icon),
    React.createElement("div", { style: { fontFamily:T.ui, fontSize: small ? 12 : 16, color: color || T.text, fontWeight:600 } }, value),
    React.createElement("div", { style: { fontFamily:T.ui, fontSize: small ? 7 : 8, letterSpacing:"1px", textTransform:"uppercase", color:T.textFaint, marginTop:2 } }, label),
  );
}

// ── Strategic Map Component ──
function StrategicMap({ state, selectedRegion, onSelectRegion, selectedFaction }) {
  const canvasRef = useRef(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [dragRegion, setDragRegion] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const regions = state.regions;
  const factions = state.factions;
  const adjacency = state.adjacency;

  // Calculate map bounds
  const allX = Object.values(regions).map(r => r.x);
  const allY = Object.values(regions).map(r => r.y);
  const mapW = Math.max(600, (Math.max(...allX) || 600) + 160);
  const mapH = Math.max(400, (Math.max(...allY) || 400) + 160);

  // Find armies per region
  const armyCounts = {};
  Object.values(factions).forEach(f => {
    f.armies.forEach(a => {
      if (!armyCounts[a.position]) armyCounts[a.position] = [];
      armyCounts[a.position].push({ factionId:f.id, color:f.color, name:a.name, size:a.units.reduce((s,u) => s+u.count, 0) });
    });
  });

  return React.createElement("div", {
    ref: canvasRef,
    style: { flex:1, position:"relative", overflow:"auto", background:T.bg, backgroundImage:"radial-gradient(circle, " + T.goldDim + " 1px, transparent 1px)", backgroundSize:"32px 32px" },
  },
    React.createElement("svg", { width:mapW, height:mapH, style:{ display:"block" } },
      // Connection lines
      Object.keys(adjacency).map(rid => {
        const from = regions[rid];
        if (!from) return null;
        return (adjacency[rid] || []).map(toId => {
          const to = regions[toId];
          if (!to || parseInt(rid) > parseInt(toId)) return null; // draw each line once
          return React.createElement("line", {
            key: rid + "-" + toId,
            x1: from.x, y1: from.y, x2: to.x, y2: to.y,
            stroke: T.goldDim, strokeWidth: 1, strokeDasharray: "4,4",
          });
        });
      }),
      // Army movement arrows
      Object.values(factions).flatMap(f => f.armies.filter(a => a.movingTo).map(a => {
        const from = regions[a.position];
        const to = regions[a.movingTo];
        if (!from || !to) return null;
        return React.createElement("line", {
          key: a.id + "-move",
          x1: from.x, y1: from.y, x2: to.x, y2: to.y,
          stroke: f.color, strokeWidth: 2, markerEnd: "url(#arrow)",
          strokeDasharray: "6,3", opacity: 0.7,
        });
      })),
      // Arrow marker def
      React.createElement("defs", null,
        React.createElement("marker", { id:"arrow", markerWidth:8, markerHeight:6, refX:8, refY:3, orient:"auto" },
          React.createElement("path", { d:"M0,0 L8,3 L0,6 Z", fill:T.gold })
        )
      ),
      // Region nodes
      Object.values(regions).map(r => {
        const isSelected = selectedRegion === r.id;
        const isHovered = hoveredRegion === r.id;
        const faction = Object.values(factions).find(f => f.id === r.controllerId);
        const color = faction ? faction.color : T.textFaint;
        const radius = r.type === "capital" ? 28 : r.type === "city" ? 22 : r.type === "town" ? 18 : 14;
        const armies = armyCounts[r.id] || [];
        const hasArmies = armies.length > 0;
        const totalArmy = armies.reduce((s,a) => s + a.size, 0);

        return React.createElement("g", { key:r.id,
          onMouseEnter: () => setHoveredRegion(r.id),
          onMouseLeave: () => setHoveredRegion(null),
          onClick: () => onSelectRegion(r.id),
          style: { cursor:"pointer" },
        },
          // Glow for selected
          isSelected && React.createElement("circle", { cx:r.x, cy:r.y, r:radius+6, fill:"none", stroke:"var(--gold)", strokeWidth:2, opacity:0.6 }),
          // Territory circle
          React.createElement("circle", {
            cx:r.x, cy:r.y, r:radius,
            fill: color + "33", stroke: color, strokeWidth: isHovered ? 2.5 : 1.5,
            opacity: isHovered ? 1 : 0.85,
          }),
          // Fortification indicator
          r.fortification > 0 && React.createElement("circle", { cx:r.x, cy:r.y, r:radius+3, fill:"none", stroke:color, strokeWidth:1, strokeDasharray:`${r.fortification*2},4`, opacity:0.5 }),
          // Region name
          React.createElement("text", {
            x:r.x, y:r.y - radius - 8,
            textAnchor:"middle", fill:"var(--text-dim)",
            fontSize:10, fontFamily:"'Cinzel', serif", letterSpacing:"0.5px",
          }, r.name),
          // Terrain icon
          React.createElement("text", {
            x:r.x, y:r.y + 4, textAnchor:"middle", fontSize:radius > 20 ? 16 : 12,
          }, r.terrain === "mountains" ? "⛰️" : r.terrain === "forest" ? "🌲" : r.terrain === "coast" ? "🌊" : r.terrain === "desert" ? "🏜️" : r.terrain === "swamp" ? "🌿" : r.terrain === "tundra" ? "❄️" : r.terrain === "hills" ? "⛰" : "🌾"),
          // Army indicator
          hasArmies && React.createElement("g", null,
            React.createElement("circle", { cx:r.x + radius - 4, cy:r.y - radius + 4, r:10, fill:"var(--bg-card)", stroke:armies[0].color, strokeWidth:1.5 }),
            React.createElement("text", { x:r.x + radius - 4, y:r.y - radius + 8, textAnchor:"middle", fill:"var(--text)", fontSize:9, fontFamily:"'Cinzel', serif", fontWeight:700 }, totalArmy > 999 ? Math.floor(totalArmy/1000)+"k" : totalArmy),
          ),
          // Siege indicator
          r.underSiege && React.createElement("text", { x:r.x - radius + 4, y:r.y - radius + 8, fontSize:12 }, "🔥"),
        );
      }),
    ),
    // Hover tooltip
    hoveredRegion && React.createElement("div", {
      style: {
        position:"fixed", top:0, left:0,
        pointerEvents:"none", zIndex:100,
        background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:4,
        padding:"8px 12px", fontSize:11, fontFamily:T.body, color:"var(--text-dim)",
        transform: `translate(${(regions[hoveredRegion]?.x || 0) + 40}px, ${(regions[hoveredRegion]?.y || 0) - 20}px)`,
      }
    },
      React.createElement("div", { style: { fontFamily:T.ui, fontSize:10, color:"var(--text)", marginBottom:4 } }, regions[hoveredRegion]?.name),
      React.createElement("div", null, "Terrain: ", regions[hoveredRegion]?.terrain),
      React.createElement("div", null, "Controller: ", regions[hoveredRegion]?.controllerName),
      React.createElement("div", null, "Fort: ", "█".repeat(regions[hoveredRegion]?.fortification || 0) || "None"),
      (armyCounts[hoveredRegion] || []).map((a,i) => React.createElement("div", { key:i, style:{color:a.color} }, "⚔ ", a.name, " (", a.size, ")"))
    ),
  );
}

// ── Faction Info Panel ──
function FactionPanel({ faction, state, onAction }) {
  if (!faction) return null;
  const income = calcIncome(state, faction.id);
  const totalArmy = faction.armies.reduce((s, a) => s + a.units.reduce((s2, u) => s2 + u.count, 0), 0);
  const profile = AI_PROFILES[faction.personality] || AI_PROFILES.balanced;

  return React.createElement("div", { style: { padding:"12px", overflow:"auto" } },
    // Header
    React.createElement("div", { style: { display:"flex", alignItems:"center", gap:10, marginBottom:12 } },
      React.createElement("div", { style: { width:12, height:12, borderRadius:"50%", background:faction.color, border:"2px solid " + faction.color } }),
      React.createElement("div", null,
        React.createElement("div", { style: { fontFamily:T.heading, fontSize:14, color:"var(--text)" } }, faction.name),
        React.createElement("div", { style: { fontFamily:T.ui, fontSize:8, letterSpacing:"1.5px", color:"var(--text-faint)", textTransform:"uppercase" } }, profile.name, faction.eliminated ? " — ELIMINATED" : ""),
      ),
    ),
    faction.eliminated && React.createElement("div", { style: { padding:"8px", background:T.crimsonDim, border:"1px solid " + T.crimsonDim, borderRadius:4, color:T.crimson, fontFamily:T.body, fontSize:12, marginBottom:12 } }, "This faction has been eliminated from the war."),

    // Resources
    React.createElement("div", { style: { fontFamily:T.ui, fontSize:8, letterSpacing:"2px", color:T.crimson, marginBottom:6, textTransform:"uppercase" } }, "Resources"),
    React.createElement("div", { style: { display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:4, marginBottom:12 } },
      React.createElement(StatBox, { label:"Gold", value:faction.gold, icon:"💰", small:true }),
      React.createElement(StatBox, { label:"Food", value:faction.resources.food, icon:"🍞", small:true }),
      React.createElement(StatBox, { label:"Iron", value:faction.resources.iron, icon:"⛏️", small:true }),
      React.createElement(StatBox, { label:"Mana", value:faction.resources.mana, icon:"✨", small:true }),
    ),
    // Income
    React.createElement("div", { style: { display:"flex", gap:8, marginBottom:12, fontSize:10, fontFamily:T.body, color:"var(--text-faint)" } },
      React.createElement("span", null, "Income: "),
      React.createElement("span", { style:{ color: income.gold >= 0 ? "var(--green)" : "var(--crimson)" } }, (income.gold >= 0 ? "+" : "") + income.gold, "g"),
      React.createElement("span", { style:{ color: income.food >= 0 ? "var(--green)" : "var(--crimson)" } }, (income.food >= 0 ? "+" : "") + income.food, "f"),
      React.createElement("span", { style:{ color: income.iron >= 0 ? "var(--green)" : "var(--crimson)" } }, (income.iron >= 0 ? "+" : "") + income.iron, "i"),
      React.createElement("span", { style:{ color: income.mana >= 0 ? "var(--green)" : "var(--crimson)" } }, (income.mana >= 0 ? "+" : "") + income.mana, "m"),
    ),
    // Stats
    React.createElement("div", { style: { display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:4, marginBottom:12 } },
      React.createElement(StatBox, { label:"Territories", value:faction.territories.length, icon:"🗺️", small:true }),
      React.createElement(StatBox, { label:"Armies", value:faction.armies.length, icon:"⚔️", small:true }),
      React.createElement(StatBox, { label:"Total Troops", value:totalArmy, icon:"🛡️", small:true }),
    ),
    // Armies list
    React.createElement("div", { style: { fontFamily:T.ui, fontSize:8, letterSpacing:"2px", color:"var(--crimson)", marginBottom:6, textTransform:"uppercase" } }, "Armies"),
    faction.armies.length === 0
      ? React.createElement("div", { style: { fontSize:11, color:"var(--text-faint)", fontFamily:T.body, padding:"8px 0" } }, "No armies in the field.")
      : faction.armies.map(army => {
        const totalSize = army.units.reduce((s, u) => s + u.count, 0);
        const regionName = state.regions[army.position]?.name || "Unknown";
        return React.createElement("div", { key:army.id, style: { background:"var(--bg-mid)", border:"1px solid var(--border)", borderRadius:4, padding:"8px 10px", marginBottom:4 } },
          React.createElement("div", { style: { display:"flex", justifyContent:"space-between", alignItems:"center" } },
            React.createElement("div", { style: { fontFamily:T.ui, fontSize:10, color:"var(--text)" } }, army.name),
            React.createElement("div", { style: { fontSize:10, fontFamily:T.body, color:"var(--text-faint)" } }, totalSize, " troops"),
          ),
          React.createElement("div", { style: { fontSize:10, fontFamily:T.body, color:"var(--text-faint)", marginTop:2 } },
            "📍 ", regionName,
            army.movingTo ? React.createElement("span", { style:{color:"var(--gold)"} }, " → ", state.regions[army.movingTo]?.name) : null,
          ),
          React.createElement("div", { style: { display:"flex", gap:8, marginTop:4, fontSize:9, color:"var(--text-faint)" } },
            React.createElement("span", null, "❤️ Morale: ", army.morale, "%"),
            React.createElement("span", null, "📦 Supply: ", army.supply, "%"),
            React.createElement("span", null, "⭐ XP: ", army.experience),
          ),
          React.createElement("div", { style: { display:"flex", flexWrap:"wrap", gap:3, marginTop:4 } },
            army.units.map((u, i) => {
              const ut = UNIT_TYPES[u.type];
              return React.createElement("span", { key:i, style: { fontSize:9, background:"var(--bg-card)", padding:"2px 6px", borderRadius:3, border:"1px solid var(--border)", color:"var(--text-muted)" } },
                ut?.icon || "?", " ", u.count, " ", ut?.name || u.type
              );
            }),
          ),
        );
      }),
    // Diplomacy summary
    React.createElement("div", { style: { fontFamily:T.ui, fontSize:8, letterSpacing:"2px", color:T.crimson, margin:"12px 0 6px", textTransform:"uppercase" } }, "Diplomacy"),
    Object.keys(faction.diplomacy).map(otherId => {
      const d = faction.diplomacy[otherId];
      const other = state.factions[otherId];
      if (!other) return null;
      const relColor = d.relation > 30 ? T.green : d.relation < -30 ? T.crimson : T.gold;
      return React.createElement("div", { key:otherId, style: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 0", borderBottom:"1px solid " + T.border, fontSize:11 } },
        React.createElement("div", { style: { display:"flex", alignItems:"center", gap:6 } },
          React.createElement("div", { style: { width:8, height:8, borderRadius:"50%", background:other.color } }),
          React.createElement("span", { style: { fontFamily:T.body, color:T.textMuted } }, other.name),
        ),
        React.createElement("div", { style: { display:"flex", alignItems:"center", gap:6 } },
          d.warDeclared && React.createElement("span", { style: { fontSize:8, background:T.crimsonDim, color:T.crimson, padding:"1px 5px", borderRadius:3, fontFamily:T.ui, letterSpacing:"1px" } }, "AT WAR"),
          d.treaties.includes("alliance") && React.createElement("span", { style: { fontSize:8, background:T.greenDim, color:T.green, padding:"1px 5px", borderRadius:3, fontFamily:T.ui, letterSpacing:"1px" } }, "ALLIED"),
          React.createElement("span", { style: { fontFamily:T.ui, fontSize:10, color:relColor, fontWeight:600, minWidth:30, textAlign:"right" } }, d.relation > 0 ? "+" + d.relation : d.relation),
        ),
      );
    }),
  );
}

// ── Event Log Panel ──
function EventLog({ events, maxShow }) {
  const visible = events.slice(-(maxShow || 50)).reverse();
  return React.createElement("div", { style: { overflow:"auto", flex:1 } },
    visible.length === 0
      ? React.createElement("div", { style: { padding:20, textAlign:"center", color:T.textFaint, fontFamily:T.body, fontSize:12 } }, "No events yet. Start the simulation.")
      : visible.map((e, i) => React.createElement("div", {
          key: i,
          style: {
            padding:"6px 10px", borderBottom:"1px solid " + T.border, fontSize:11,
            background: e.severity === "critical" ? T.crimsonDim : e.severity === "major" ? T.crimsonDim : "transparent",
          }
        },
        React.createElement("div", { style: { display:"flex", justifyContent:"space-between" } },
          React.createElement("span", { style: { fontFamily:T.body, color:T.textDim } }, e.icon || "📜", " ", e.text),
          React.createElement("span", { style: { fontFamily:T.ui, fontSize:8, color:"var(--text-faint)" } }, "T", e.turn),
        ),
        React.createElement("div", { style: { fontSize:9, color:"var(--text-faint)", fontFamily:T.ui, letterSpacing:"0.5px" } }, e.faction),
      ))
  );
}

// ── Region Detail Panel ──
function RegionDetail({ region, state, factions }) {
  if (!region) return React.createElement("div", { style: { padding:20, textAlign:"center", color:T.textFaint, fontFamily:T.body, fontSize:12 } }, "Click a region on the map to view details.");
  const controller = Object.values(factions).find(f => f.id === region.controllerId);
  const terrain = TERRAIN_MODS[region.terrain] || {};
  const yields = region.baseYield || {};
  const stateMod = STATE_MODS[region.state] || STATE_MODS.stable;

  return React.createElement("div", { style: { padding:"12px", overflow:"auto" } },
    React.createElement("div", { style: { fontFamily:T.heading, fontSize:16, color:T.text, marginBottom:2 } }, region.name),
    React.createElement("div", { style: { display:"flex", gap:8, marginBottom:12, fontSize:10, fontFamily:T.ui, letterSpacing:"1px", textTransform:"uppercase" } },
      React.createElement("span", { style: { color:T.textFaint } }, region.terrain),
      React.createElement("span", { style: { color:T.textFaint } }, "•"),
      React.createElement("span", { style: { color: controller?.color || "var(--text-faint)" } }, region.controllerName),
      React.createElement("span", { style: { color:"var(--text-faint)" } }, "•"),
      React.createElement("span", { style: { color: region.state === "stable" || region.state === "prosperous" ? "var(--green)" : region.state === "conquered" || region.state === "destroyed" ? "var(--crimson)" : "var(--gold)" } }, region.state),
    ),
    // Yields
    React.createElement("div", { style: { fontFamily:T.ui, fontSize:8, letterSpacing:"2px", color:"var(--crimson)", marginBottom:6, textTransform:"uppercase" } }, "Base Yields (×" + stateMod.income + ")"),
    React.createElement("div", { style: { display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:4, marginBottom:12 } },
      React.createElement(StatBox, { label:"Gold", value:Math.floor(yields.gold * stateMod.income), icon:"💰", small:true }),
      React.createElement(StatBox, { label:"Food", value:Math.floor(yields.food * stateMod.income), icon:"🍞", small:true }),
      React.createElement(StatBox, { label:"Iron", value:Math.floor(yields.iron * stateMod.income), icon:"⛏️", small:true }),
      React.createElement(StatBox, { label:"Mana", value:Math.floor(yields.mana * stateMod.income), icon:"✨", small:true }),
    ),
    // Fortification
    React.createElement("div", { style: { fontFamily:T.ui, fontSize:8, letterSpacing:"2px", color:"var(--crimson)", marginBottom:6, textTransform:"uppercase" } }, "Fortification"),
    React.createElement("div", { style: { display:"flex", gap:2, marginBottom:12 } },
      [1,2,3,4,5].map(i => React.createElement("div", { key:i, style: { width:20, height:8, borderRadius:2, background: i <= (region.fortification||0) ? "var(--gold)" : "var(--bg-mid)", border:"1px solid var(--border)" } })),
    ),
    // Terrain modifiers
    React.createElement("div", { style: { fontFamily:T.ui, fontSize:8, letterSpacing:"2px", color:"var(--crimson)", marginBottom:6, textTransform:"uppercase" } }, "Terrain Effects"),
    React.createElement("div", { style: { fontSize:11, fontFamily:T.body, color:"var(--text-faint)", marginBottom:8, fontStyle:"italic" } }, terrain.label),
    React.createElement("div", { style: { display:"flex", flexWrap:"wrap", gap:4, marginBottom:12 } },
      Object.keys(terrain).filter(k => k !== "label" && k !== "defense").map(k => {
        const v = terrain[k];
        return React.createElement("span", { key:k, style: { fontSize:9, padding:"2px 6px", borderRadius:3, background:"var(--bg-mid)", border:"1px solid var(--border)", color: v > 0 ? "var(--green)" : v < 0 ? "var(--crimson)" : "var(--text-faint)" } },
          k, ": ", v > 0 ? "+" + v : v
        );
      }),
    ),
    // Buildings
    React.createElement("div", { style: { fontFamily:T.ui, fontSize:8, letterSpacing:"2px", color:"var(--crimson)", marginBottom:6, textTransform:"uppercase" } }, "Buildings"),
    (region.buildings || []).length === 0
      ? React.createElement("div", { style: { fontSize:11, color:"var(--text-faint)", fontFamily:T.body } }, "No buildings constructed.")
      : React.createElement("div", { style: { display:"flex", flexDirection:"column", gap:3 } },
        (region.buildings || []).map((bId, i) => {
          const b = BUILDINGS[bId];
          return React.createElement("div", { key:i, style: { fontSize:10, padding:"4px 8px", background:"var(--bg-mid)", border:"1px solid var(--border)", borderRadius:3, fontFamily:T.body, color:"var(--text-muted)" } },
            "🏛️ ", b?.name || bId, React.createElement("span", { style: { color:"var(--text-faint)", fontSize:9, marginLeft:6 } }, b?.effect)
          );
        }),
      ),
  );
}


/* ═══════════════════════════════════════════════════════════════════
   SECTION 4: MAIN VIEW COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

function FactionWarView({ data, setData, viewRole }) {
  // Initialize or load war state
  const [warState, setWarState] = useState(() => {
    if (data.warState && data.warState.turn > 0) return data.warState;
    return initWarState(data);
  });
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedFaction, setSelectedFaction] = useState(null);
  const [rightPanel, setRightPanel] = useState("faction"); // faction, region, events, battles
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef = useRef(null);

  // Auto-save war state to campaign data
  useEffect(() => {
    const timer = setTimeout(() => {
      setData(prev => ({ ...prev, warState: warState }));
    }, 500);
    return () => clearTimeout(timer);
  }, [warState]);

  // Auto-play tick
  useEffect(() => {
    if (autoPlay) {
      autoRef.current = setInterval(() => {
        setWarState(prev => processTurn(prev));
      }, warState.speed === 3 ? 500 : warState.speed === 2 ? 1500 : 3000);
    }
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [autoPlay, warState.speed]);

  const advanceTurn = () => setWarState(prev => processTurn(prev));
  const toggleAutoPlay = () => setAutoPlay(!autoPlay);
  const setSpeed = (s) => setWarState(prev => ({ ...prev, speed: s }));
  const resetWar = () => { setAutoPlay(false); setWarState(initWarState(data)); };

  // Selected faction data
  const selFaction = selectedFaction ? warState.factions[selectedFaction] : null;
  const selRegion = selectedRegion ? warState.regions[selectedRegion] : null;

  // Auto-select faction when clicking region
  const handleRegionSelect = (rid) => {
    setSelectedRegion(rid);
    const r = warState.regions[rid];
    if (r?.controllerId) setSelectedFaction(r.controllerId);
    setRightPanel("region");
  };

  // Count active factions
  const activeFactions = Object.values(warState.factions).filter(f => !f.eliminated);
  const totalBattles = warState.battleLog.length;
  const recentEvents = warState.eventLog.filter(e => e.turn >= warState.turn - 3);

  return React.createElement("div", { style: { display:"flex", flexDirection:"column", height:"100%", overflow:"hidden" } },
    // ── Top Bar ──
    React.createElement("div", { style: { padding:"10px 16px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 } },
      React.createElement("div", { style: { display:"flex", alignItems:"center", gap:12 } },
        React.createElement("div", { style: { fontFamily:T.heading, fontSize:16, color:T.text, letterSpacing:"1px" } }, "Faction War"),
        React.createElement("div", { style: { fontFamily:T.ui, fontSize:9, letterSpacing:"1.5px", color:T.crimson, textTransform:"uppercase" } }, "Turn ", warState.turn),
        React.createElement("div", { style: { fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"1px" } }, activeFactions.length, " factions · ", totalBattles, " battles"),
      ),
      React.createElement("div", { style: { display:"flex", gap:4, alignItems:"center" } },
        React.createElement(WarBtn, { onClick: advanceTurn, disabled: autoPlay, small: true }, React.createElement(SkipForward, {size:10}), " Next Turn"),
        React.createElement(WarBtn, { onClick: toggleAutoPlay, active: autoPlay, small: true }, autoPlay ? React.createElement(Pause, {size:10}) : React.createElement(Play, {size:10}), autoPlay ? " Pause" : " Auto"),
        autoPlay && React.createElement("div", { style: { display:"flex", gap:2 } },
          [1,2,3].map(s => React.createElement("button", {
            key:s, onClick: () => setSpeed(s),
            style: { width:22, height:22, background: warState.speed === s ? T.crimsonDim : "transparent", border:"1px solid " + (warState.speed === s ? T.crimsonDim : T.border), borderRadius:3, cursor:"pointer", color: warState.speed === s ? T.crimson : T.textFaint, fontSize:9, fontFamily:T.ui }
          }, s, "×"))
        ),
        React.createElement(WarBtn, { onClick: resetWar, danger: true, small: true }, React.createElement(RefreshCw, {size:10}), " Reset"),
      ),
    ),

    // ── Main Layout ──
    React.createElement("div", { style: { display:"flex", flex:1, overflow:"hidden" } },
      // Left: Faction list
      React.createElement("div", { style: { width:180, minWidth:180, borderRight:"1px solid " + T.border, overflow:"auto", flexShrink:0 } },
        React.createElement("div", { style: { padding:"10px 12px", fontFamily:T.ui, fontSize:8, letterSpacing:"2px", color:T.crimson, textTransform:"uppercase", borderBottom:"1px solid " + T.border } }, "Factions"),
        Object.values(warState.factions).map(f => {
          const isSelected = selectedFaction === f.id;
          const totalTroops = f.armies.reduce((s, a) => s + a.units.reduce((s2, u) => s2 + u.count, 0), 0);
          return React.createElement("div", {
            key: f.id,
            onClick: () => { setSelectedFaction(f.id); setRightPanel("faction"); },
            style: {
              padding:"8px 12px", cursor:"pointer", borderBottom:"1px solid " + T.border,
              background: isSelected ? T.crimsonDim : "transparent",
              borderLeft: isSelected ? "3px solid " + T.crimson : "3px solid transparent",
              opacity: f.eliminated ? 0.4 : 1,
            }
          },
            React.createElement("div", { style: { display:"flex", alignItems:"center", gap:6, marginBottom:2 } },
              React.createElement("div", { style: { width:8, height:8, borderRadius:"50%", background:f.color } }),
              React.createElement("span", { style: { fontFamily:T.ui, fontSize:10, color: isSelected ? T.crimson : T.textMuted, letterSpacing:"0.5px" } }, f.name),
            ),
            React.createElement("div", { style: { display:"flex", gap:8, fontSize:9, color:T.textFaint, fontFamily:T.body } },
              React.createElement("span", null, "🗺️", f.territories.length),
              React.createElement("span", null, "⚔️", totalTroops),
              React.createElement("span", null, "💰", f.gold),
            ),
          );
        }),
      ),

      // Center: Map
      React.createElement(StrategicMap, {
        state: warState,
        selectedRegion,
        onSelectRegion: handleRegionSelect,
        selectedFaction,
      }),

      // Right: Detail Panel
      React.createElement("div", { style: { width:300, minWidth:300, borderLeft:"1px solid " + T.border, display:"flex", flexDirection:"column", flexShrink:0 } },
        // Panel tabs
        React.createElement("div", { style: { display:"flex", borderBottom:"1px solid " + T.border } },
          ["faction","region","events","battles"].map(tab => React.createElement("button", {
            key:tab, onClick: () => setRightPanel(tab),
            style: {
              flex:1, padding:"8px 4px", background: rightPanel === tab ? T.crimsonDim : "transparent",
              border:"none", borderBottom: rightPanel === tab ? "2px solid " + T.crimson : "2px solid transparent",
              cursor:"pointer", color: rightPanel === tab ? T.crimson : T.textFaint,
              fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase",
            }
          }, tab)),
        ),
        // Panel content
        React.createElement("div", { style: { flex:1, overflow:"auto" } },
          rightPanel === "faction" && React.createElement(FactionPanel, { faction:selFaction, state:warState, onAction:() => {} }),
          rightPanel === "region" && React.createElement(RegionDetail, { region:selRegion, state:warState, factions:warState.factions }),
          rightPanel === "events" && React.createElement(EventLog, { events:warState.eventLog, maxShow:100 }),
          rightPanel === "battles" && React.createElement("div", { style: { padding:12, overflow:"auto" } },
            warState.battleLog.length === 0
              ? React.createElement("div", { style: { padding:20, textAlign:"center", color:"var(--text-faint)", fontFamily:T.body, fontSize:12 } }, "No battles yet.")
              : warState.battleLog.slice().reverse().map((b, i) => React.createElement("div", {
                  key:i,
                  style: { background:"var(--bg-mid)", border:"1px solid var(--border)", borderRadius:4, padding:"10px", marginBottom:6 }
                },
                React.createElement("div", { style: { fontFamily:T.ui, fontSize:10, color:"var(--text)", marginBottom:4 } }, "⚔️ Battle of ", b.region),
                React.createElement("div", { style: { display:"flex", justifyContent:"space-between", marginBottom:4 } },
                  React.createElement("div", { style: { textAlign:"center" } },
                    React.createElement("div", { style: { fontSize:10, color: b.attackerColor, fontFamily:T.ui } }, b.attacker),
                    React.createElement("div", { style: { fontSize:14, fontFamily:T.heading, color: b.winner === "attacker" ? "var(--green)" : "var(--crimson)" } }, b.attackerPower),
                    React.createElement("div", { style: { fontSize:8, color:"var(--text-faint)" } }, b.attackerCasualties, "% lost"),
                  ),
                  React.createElement("div", { style: { fontSize:12, color:"var(--text-faint)", alignSelf:"center" } }, "vs"),
                  React.createElement("div", { style: { textAlign:"center" } },
                    React.createElement("div", { style: { fontSize:10, color: b.defenderColor, fontFamily:T.ui } }, b.defender),
                    React.createElement("div", { style: { fontSize:14, fontFamily:T.heading, color: b.winner === "defender" ? "var(--green)" : "var(--crimson)" } }, b.defenderPower),
                    React.createElement("div", { style: { fontSize:8, color:"var(--text-faint)" } }, b.defenderCasualties, "% lost"),
                  ),
                ),
                React.createElement("div", { style: { fontSize:9, color:"var(--text-faint)", fontFamily:T.body } },
                  b.terrain, b.fortBonus > 0 ? " · Fort +" + b.fortBonus : "", " · Turn ", b.turn
                ),
                React.createElement("div", { style: { fontSize:10, color: b.winner === "attacker" ? b.attackerColor : b.defenderColor, fontFamily:T.ui, marginTop:4, letterSpacing:"1px" } },
                  b.winner === "attacker" ? b.attacker : b.defender, " VICTORY"
                ),
              )),
          ),
        ),
      ),
    ),
  );
}

// Register as global for lazy loading
window.FactionWarView = FactionWarView;

})();
