/* ═══════════════════════════════════════════════════════════════════════════
   KINGDOM BUILDER — Comprehensive Domain & Kingdom Management System
   Territory claiming, settlement building, governance, religion, diplomacy.
   Integrates with Living World, Economy, Faction War, Seasons, and Religion.
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  const { useState, useEffect, useRef, useCallback, useMemo } = React;
  const {
    Home, Hammer, Shield, Coins, Users, TrendingUp, AlertTriangle,
    Plus, Trash2, Edit2, Check, Clock, Zap, MapPin, Award, BarChart3,
    Crown, Scroll, BookOpen, Swords, Flag, Eye, ChevronRight, ChevronDown,
    Settings, Star, Heart, Landmark, Scale, Map, Building2, Wheat,
    Castle, Sparkles, X, ChevronLeft, ArrowRight, Info, Lock, Compass,
    Anchor, Flame, Droplets, Wind, Sun, Moon, Mountain, Trees, Skull,
    GraduationCap, Gem, Target, Tent, Axe, Bug
  } = window.LucideReact || {};

  const T = window.__PHMURT_THEME || {
    bg: "var(--bg)", bgNav: "var(--bg-nav)", bgCard: "var(--bg-card)",
    bgHover: "var(--bg-hover)", text: "var(--text)", textDim: "var(--text-dim)",
    textMuted: "var(--text-muted)", textFaint: "var(--text-faint)",
    crimson: "var(--crimson)", crimsonSoft: "var(--crimson-soft)",
    gold: "var(--gold)", green: "var(--green)", border: "var(--border)",
    ui: "'Cinzel', serif", heading: "'Cinzel', serif", body: "'Spectral', Georgia, serif"
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1: CONSTANTS & CATALOGS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Settlement Size Tiers ──────────────────────────────────────────────
  const SETTLEMENT_SIZES = {
    hamlet:     { name: "Hamlet",     minPop: 0,     maxPop: 200,   maxBuildings: 6,  baseLots: 1, icon: "⌂", defenseBonus: 0 },
    village:    { name: "Village",    minPop: 200,   maxPop: 1000,  maxBuildings: 12, baseLots: 2, icon: "⌂", defenseBonus: 1 },
    town:       { name: "Town",       minPop: 1000,  maxPop: 5000,  maxBuildings: 24, baseLots: 4, icon: "◈", defenseBonus: 2 },
    smallCity:  { name: "Small City", minPop: 5000,  maxPop: 15000, maxBuildings: 40, baseLots: 6, icon: "◈", defenseBonus: 4 },
    largeCity:  { name: "Large City", minPop: 15000, maxPop: 40000, maxBuildings: 60, baseLots: 8, icon: "★", defenseBonus: 6 },
    metropolis: { name: "Metropolis", minPop: 40000, maxPop: 999999,maxBuildings: 80, baseLots:12, icon: "★", defenseBonus: 8 }
  };

  function getSettlementSize(pop) {
    if (pop >= 40000) return "metropolis";
    if (pop >= 15000) return "largeCity";
    if (pop >= 5000)  return "smallCity";
    if (pop >= 1000)  return "town";
    if (pop >= 200)   return "village";
    return "hamlet";
  }

  // ── Terrain Types (aligned with hexcrawl) ──────────────────────────────
  const TERRAIN_TYPES = {
    plains:    { name: "Plains",     claimCost: 1, prepCost: 1, farmValue: 3, mineValue: 0, tradeValue: 1, icon: "⚘", color: "#8fbc5e", desc: "Fertile lowlands ideal for farming" },
    forest:    { name: "Forest",     claimCost: 2, prepCost: 2, farmValue: 0, mineValue: 0, tradeValue: 1, icon: "♣", color: "#2d6a2d", desc: "Dense woodland rich in timber and game" },
    hills:     { name: "Hills",      claimCost: 2, prepCost: 1, farmValue: 1, mineValue: 2, tradeValue: 1, icon: "▲",  color: "#8b7355", desc: "Rolling terrain with mineral deposits" },
    mountains: { name: "Mountains",  claimCost: 4, prepCost: 3, farmValue: 0, mineValue: 3, tradeValue: 0, icon: "⛰",  color: "#6b6b6b", desc: "Towering peaks with deep ore veins" },
    swamp:     { name: "Swamp",      claimCost: 3, prepCost: 3, farmValue: 0, mineValue: 0, tradeValue: 0, icon: "≈", color: "#4a6741", desc: "Boggy wetlands with hidden dangers" },
    desert:    { name: "Desert",     claimCost: 2, prepCost: 2, farmValue: 0, mineValue: 1, tradeValue: 2, icon: "☼",  color: "#c2a64e", desc: "Arid wastes with buried treasures" },
    coast:     { name: "Coast",      claimCost: 2, prepCost: 1, farmValue: 1, mineValue: 0, tradeValue: 3, icon: "〜", color: "#4a8db7", desc: "Shoreline with fishing and ports" },
    jungle:    { name: "Jungle",     claimCost: 4, prepCost: 4, farmValue: 1, mineValue: 0, tradeValue: 1, icon: "♧", color: "#1a5c1a", desc: "Thick tropical canopy with rare herbs" },
    tundra:    { name: "Tundra",     claimCost: 2, prepCost: 2, farmValue: 0, mineValue: 1, tradeValue: 0, icon: "✵",  color: "#a0c4d8", desc: "Frozen expanse with hardy people" },
    grassland: { name: "Grassland",  claimCost: 1, prepCost: 1, farmValue: 2, mineValue: 0, tradeValue: 1, icon: "⚘", color: "#a8cc65", desc: "Wide open pastures for livestock" },
    volcanic:  { name: "Volcanic",   claimCost: 5, prepCost: 4, farmValue: 0, mineValue: 4, tradeValue: 0, icon: "△", color: "#a83232", desc: "Dangerous but rich in rare minerals" },
    oasis:     { name: "Oasis",      claimCost: 3, prepCost: 1, farmValue: 2, mineValue: 0, tradeValue: 2, icon: "◊",  color: "#4ab89a", desc: "Lush haven amid barren lands" }
  };

  // ── Territory Improvements ─────────────────────────────────────────────
  const HEX_IMPROVEMENTS = {
    // Economic
    farm:       { name: "Farm",           cost: 2, buildTurns: 1, requires: ["plains","hills","coast","grassland","oasis"],  economy: 2, loyalty: 0, stability: 0, icon: "⚘", desc: "Cultivated farmland producing food", category: "economic" },
    ranch:      { name: "Ranch",          cost: 3, buildTurns: 1, requires: ["plains","grassland","hills"],                  economy: 2, loyalty: 0, stability: 0, icon: "∴", desc: "Raises livestock for meat and leather", category: "economic" },
    mine:       { name: "Mine",           cost: 4, buildTurns: 2, requires: ["hills","mountains","volcanic"],                economy: 3, loyalty: 0, stability: 0, icon: "⛏",  desc: "Extracts ore and precious metals", category: "economic" },
    lumberCamp: { name: "Lumber Camp",    cost: 2, buildTurns: 1, requires: ["forest","jungle"],                             economy: 2, loyalty: 0, stability: 0, icon: "⚒", desc: "Harvests timber for construction", category: "economic" },
    quarry:     { name: "Quarry",         cost: 4, buildTurns: 2, requires: ["hills","mountains"],                           economy: 2, loyalty: 0, stability: 1, icon: "▦", desc: "Cuts stone for building", category: "economic" },
    fishery:    { name: "Fishery",        cost: 2, buildTurns: 1, requires: ["coast","swamp"],                               economy: 2, loyalty: 0, stability: 0, icon: "≋", desc: "Harvests fish and sea resources", category: "economic" },
    vineyard:   { name: "Vineyard",       cost: 3, buildTurns: 2, requires: ["plains","hills","oasis"],                      economy: 2, loyalty: 1, stability: 0, icon: "❦", desc: "Produces wine and luxury goods", category: "economic" },
    tradingPost:{ name: "Trading Post",   cost: 4, buildTurns: 1, requires: null,                                            economy: 3, loyalty: 0, stability: 0, icon: "⚖", desc: "Frontier outpost facilitating commerce", category: "economic" },
    herbGarden: { name: "Herb Garden",    cost: 3, buildTurns: 1, requires: ["forest","jungle","swamp","oasis"],             economy: 1, loyalty: 1, stability: 0, icon: "❧", desc: "Cultivates rare herbs and reagents", category: "economic" },
    silkFarm:   { name: "Silk Farm",      cost: 5, buildTurns: 2, requires: ["forest","jungle"],                             economy: 3, loyalty: 0, stability: 0, icon: "◎", desc: "Produces fine silks for trade", category: "economic" },
    apiary:     { name: "Apiary",         cost: 2, buildTurns: 1, requires: ["plains","forest","grassland"],                 economy: 1, loyalty: 1, stability: 0, icon: "⬡", desc: "Bee keeping for honey and wax", category: "economic" },
    saltFlats:  { name: "Salt Works",     cost: 3, buildTurns: 1, requires: ["coast","desert","tundra"],                     economy: 3, loyalty: 0, stability: 0, icon: "⬜", desc: "Harvests salt — a valuable commodity", category: "economic" },

    // Infrastructure
    road:       { name: "Road",           cost: 1, buildTurns: 0, requires: null,                                            economy: 1, loyalty: 0, stability: 0, icon: "═",  desc: "Connects settlements, speeds travel", category: "infrastructure" },
    bridge:     { name: "Bridge",         cost: 3, buildTurns: 1, requires: ["swamp","coast"],                               economy: 1, loyalty: 0, stability: 0, icon: "⌒", desc: "Spans waterways and chasms", category: "infrastructure" },
    aqueduct:   { name: "Aqueduct",       cost: 4, buildTurns: 2, requires: null,                                            economy: 1, loyalty: 1, stability: 0, icon: "⌇",  desc: "Carries fresh water to settlements", category: "infrastructure" },
    canal:      { name: "Canal",          cost: 6, buildTurns: 3, requires: ["plains","swamp","coast","grassland"],           economy: 2, loyalty: 0, stability: 0, icon: "⌇", desc: "Navigable waterway for trade barges", category: "infrastructure" },
    lighthouse: { name: "Lighthouse",     cost: 4, buildTurns: 2, requires: ["coast"],                                       economy: 2, loyalty: 0, stability: 1, icon: "⚑", desc: "Guides ships and deters pirates", category: "infrastructure" },

    // Military
    fort:       { name: "Fort",           cost: 6, buildTurns: 2, requires: null,                                            economy: 0, loyalty: 0, stability: 2, icon: "⛊", desc: "Military outpost defending the hex", category: "military" },
    watchtower: { name: "Watchtower",     cost: 3, buildTurns: 1, requires: null,                                            economy: 0, loyalty: 0, stability: 1, icon: "⚑", desc: "Provides early warning of threats", category: "military" },
    borderPost: { name: "Border Post",    cost: 2, buildTurns: 1, requires: null,                                            economy: 0, loyalty: 0, stability: 1, icon: "⚐", desc: "Marks and monitors the frontier", category: "military" },
    siegeWorks: { name: "Siege Works",    cost: 8, buildTurns: 3, requires: ["hills","mountains"],                           economy: 0, loyalty: 0, stability: 3, icon: "▲", desc: "Fortified artillery emplacement", category: "military" },

    // Religious/Cultural
    shrine:     { name: "Roadside Shrine",cost: 1, buildTurns: 0, requires: null,                                            economy: 0, loyalty: 1, stability: 0, icon: "✟",  desc: "Small shrine blessing travelers", category: "cultural" },
    sacredGrove:{ name: "Sacred Grove",   cost: 3, buildTurns: 1, requires: ["forest","jungle"],                             economy: 0, loyalty: 2, stability: 0, icon: "❧", desc: "Ancient druidic sanctuary", category: "cultural" },
    monument:   { name: "Waystone",       cost: 2, buildTurns: 1, requires: null,                                            economy: 0, loyalty: 1, stability: 1, icon: "☗", desc: "Carved monolith marking territory", category: "cultural" }
  };

  const HEX_IMPROVEMENT_CATEGORIES = {
    economic:       { label: "Economic",       color: "#d4af37" },
    infrastructure: { label: "Infrastructure", color: "#3498db" },
    military:       { label: "Military",       color: "#c94f3f" },
    cultural:       { label: "Cultural",       color: "#9b59b6" }
  };

  // ── Settlement Building Catalog ────────────────────────────────────────
  const BUILDINGS = {
    // ─── Government ───
    townHall:       { name: "Town Hall",        cost: 10, buildTurns: 2, category: "government",    economy: 1, loyalty: 1, stability: 1, unrest: -1, slots: 2, requires: [], desc: "Seat of local government", icon: "⌂" },
    castle:         { name: "Castle",           cost: 36, buildTurns: 4, category: "government",    economy: 2, loyalty: 2, stability: 4, unrest: -2, slots: 4, requires: ["townHall"], desc: "Fortified seat of power", icon: "⛊" },
    palace:         { name: "Royal Palace",     cost: 54, buildTurns: 6, category: "government",    economy: 3, loyalty: 4, stability: 4, unrest: -3, slots: 6, requires: ["castle"], desc: "Grand seat of the sovereign", icon: "♛" },
    courthouse:     { name: "Courthouse",       cost: 12, buildTurns: 2, category: "government",    economy: 0, loyalty: 2, stability: 2, unrest: -1, slots: 1, requires: ["townHall"], desc: "Administers justice and law", icon: "⚖" },
    embassy:        { name: "Embassy",          cost: 16, buildTurns: 2, category: "government",    economy: 1, loyalty: 0, stability: 2, unrest: 0,  slots: 2, requires: ["townHall"], desc: "Foreign diplomatic quarters", icon: "⚐" },
    prison:         { name: "Prison",           cost: 8,  buildTurns: 1, category: "government",    economy: 0, loyalty: -1, stability: 2, unrest: -2, slots: 1, requires: ["courthouse"], desc: "Houses criminals", icon: "⛓" },
    taxOffice:      { name: "Tax Office",       cost: 8,  buildTurns: 1, category: "government",    economy: 2, loyalty: -1, stability: 1, unrest: 0, slots: 1, requires: ["townHall"], desc: "Efficient revenue collection", icon: "§" },
    crier:          { name: "Town Crier Post",  cost: 2,  buildTurns: 0, category: "government",    economy: 0, loyalty: 1, stability: 1, unrest: 0, slots: 0, requires: [], desc: "Delivers news and royal decrees", icon: "♪" },

    // ─── Military ───
    barracks:       { name: "Barracks",         cost: 6,  buildTurns: 1, category: "military",      economy: 0, loyalty: 0, stability: 1, unrest: -1, slots: 1, requires: [], desc: "Houses and trains soldiers", icon: "⚔" },
    garrison:       { name: "Garrison",         cost: 14, buildTurns: 2, category: "military",      economy: 0, loyalty: 0, stability: 3, unrest: -1, slots: 2, requires: ["barracks"], desc: "Permanent military presence", icon: "⛊" },
    walls:          { name: "City Walls",       cost: 4,  buildTurns: 1, category: "military",      economy: 0, loyalty: 0, stability: 2, unrest: 0,  slots: 0, requires: [], desc: "Stone fortifications", icon: "▦" },
    reinforcedWalls:{ name: "Reinforced Walls", cost: 12, buildTurns: 2, category: "military",      economy: 0, loyalty: 0, stability: 4, unrest: 0,  slots: 0, requires: ["walls"], desc: "Magically warded stone walls", icon: "▦" },
    trainingGround: { name: "Training Ground",  cost: 8,  buildTurns: 1, category: "military",      economy: 0, loyalty: 0, stability: 1, unrest: -1, slots: 1, requires: ["barracks"], desc: "Advanced military drills", icon: "⊕" },
    arsenal:        { name: "Arsenal",          cost: 16, buildTurns: 2, category: "military",      economy: 1, loyalty: 0, stability: 2, unrest: 0,  slots: 1, requires: ["garrison","smithy"], desc: "Weapons and siege storage", icon: "⚔" },
    warCollege:     { name: "War College",      cost: 22, buildTurns: 3, category: "military",      economy: 0, loyalty: 0, stability: 3, unrest: 0,  slots: 2, requires: ["trainingGround","academy"], desc: "Trains elite officers and tacticians", icon: "⚑" },
    spyNetwork:     { name: "Spy Network",      cost: 12, buildTurns: 2, category: "military",      economy: 1, loyalty: 0, stability: 2, unrest: -1, slots: 1, requires: ["barracks"], desc: "Covert intelligence operations", icon: "◉" },
    stables:        { name: "Military Stables",  cost: 8, buildTurns: 1, category: "military",      economy: 0, loyalty: 0, stability: 1, unrest: 0,  slots: 1, requires: ["barracks"], desc: "Houses warhorses and cavalry mounts", icon: "♘" },

    // ─── Economic ───
    marketplace:    { name: "Marketplace",      cost: 6,  buildTurns: 1, category: "economic",      economy: 3, loyalty: 1, stability: 0, unrest: 0,  slots: 2, requires: [], desc: "Central trading hub", icon: "⚖" },
    bazaar:         { name: "Grand Bazaar",     cost: 20, buildTurns: 3, category: "economic",      economy: 5, loyalty: 2, stability: 0, unrest: 0,  slots: 4, requires: ["marketplace"], desc: "Sprawling exotic marketplace", icon: "❖" },
    smithy:         { name: "Smithy",           cost: 4,  buildTurns: 1, category: "economic",      economy: 2, loyalty: 0, stability: 0, unrest: 0,  slots: 1, requires: [], desc: "Weapons and tools forge", icon: "⚒" },
    shop:           { name: "Shop",             cost: 4,  buildTurns: 1, category: "economic",      economy: 2, loyalty: 0, stability: 0, unrest: 0,  slots: 1, requires: [], desc: "General goods store", icon: "⬦" },
    warehouse:      { name: "Warehouse",        cost: 6,  buildTurns: 1, category: "economic",      economy: 2, loyalty: 0, stability: 0, unrest: 0,  slots: 1, requires: ["marketplace"], desc: "Bulk storage for goods", icon: "▤" },
    mint:           { name: "Mint",             cost: 20, buildTurns: 3, category: "economic",      economy: 5, loyalty: 0, stability: 1, unrest: 0,  slots: 2, requires: ["marketplace","castle"], desc: "Mints the kingdom's coinage", icon: "⊛" },
    bank:           { name: "Bank",             cost: 14, buildTurns: 2, category: "economic",      economy: 4, loyalty: 0, stability: 1, unrest: 0,  slots: 1, requires: ["marketplace"], desc: "Manages wealth and loans", icon: "⊞" },
    guildHall:      { name: "Guild Hall",       cost: 18, buildTurns: 2, category: "economic",      economy: 3, loyalty: 1, stability: 1, unrest: 0,  slots: 2, requires: ["marketplace"], desc: "Artisan and merchant guilds", icon: "⚜" },
    dock:           { name: "Dock",             cost: 12, buildTurns: 2, category: "economic",      economy: 4, loyalty: 0, stability: 0, unrest: 0,  slots: 2, requires: [], coastOnly: true, desc: "Harbor for ships and trade", icon: "⚓" },
    shipyard:       { name: "Shipyard",         cost: 20, buildTurns: 3, category: "economic",      economy: 4, loyalty: 0, stability: 1, unrest: 0,  slots: 3, requires: ["dock"], coastOnly: true, desc: "Builds vessels for trade and war", icon: "⚓" },
    inn:            { name: "Inn",              cost: 4,  buildTurns: 1, category: "economic",      economy: 2, loyalty: 1, stability: 0, unrest: 0,  slots: 1, requires: [], desc: "Lodging for travelers", icon: "⌂" },
    tannery:        { name: "Tannery",          cost: 4,  buildTurns: 1, category: "economic",      economy: 2, loyalty: -1, stability: 0, unrest: 0, slots: 1, requires: [], desc: "Processes hides into leather", icon: "◈" },
    brewery:        { name: "Brewery",          cost: 6,  buildTurns: 1, category: "economic",      economy: 2, loyalty: 1, stability: 0, unrest: 0,  slots: 1, requires: [], desc: "Brews ale and spirits", icon: "⚗" },
    jeweler:        { name: "Jeweler",          cost: 10, buildTurns: 2, category: "economic",      economy: 3, loyalty: 0, stability: 0, unrest: 0,  slots: 1, requires: ["smithy"], desc: "Crafts fine jewelry and gems", icon: "◇" },
    exchangeHouse:  { name: "Exchange House",   cost: 16, buildTurns: 2, category: "economic",      economy: 4, loyalty: 0, stability: 0, unrest: 0,  slots: 2, requires: ["bank"], desc: "Currency exchange and foreign investments", icon: "⊕" },

    // ─── Religious ───
    shrineBuilding: { name: "Shrine",           cost: 4,  buildTurns: 1, category: "religious",     economy: 0, loyalty: 1, stability: 1, unrest: -1, slots: 1, requires: [], desc: "Small place of worship", icon: "✟" },
    temple:         { name: "Temple",           cost: 16, buildTurns: 2, category: "religious",     economy: 1, loyalty: 2, stability: 2, unrest: -2, slots: 2, requires: ["shrineBuilding"], desc: "Major house of worship", icon: "✝" },
    cathedral:      { name: "Cathedral",        cost: 32, buildTurns: 4, category: "religious",     economy: 2, loyalty: 4, stability: 4, unrest: -4, slots: 4, requires: ["temple"], desc: "Grand seat of faith", icon: "†" },
    monastery:      { name: "Monastery",        cost: 12, buildTurns: 2, category: "religious",     economy: 1, loyalty: 1, stability: 1, unrest: 0,  slots: 2, requires: ["shrineBuilding"], desc: "Cloistered order of devotion", icon: "✟" },
    graveyard:      { name: "Graveyard",        cost: 2,  buildTurns: 1, category: "religious",     economy: 0, loyalty: 1, stability: 0, unrest: -1, slots: 1, requires: [], desc: "Hallowed burial ground", icon: "⚰" },
    oracleHall:     { name: "Oracle Hall",      cost: 14, buildTurns: 2, category: "religious",     economy: 0, loyalty: 2, stability: 2, unrest: -1, slots: 2, requires: ["temple"], desc: "Divination and prophecy center", icon: "◎" },
    reliquary:      { name: "Reliquary",        cost: 10, buildTurns: 2, category: "religious",     economy: 1, loyalty: 2, stability: 1, unrest: -1, slots: 1, requires: ["shrineBuilding"], desc: "Houses sacred relics and artifacts", icon: "❖" },

    // ─── Cultural ───
    tavern:         { name: "Tavern",           cost: 4,  buildTurns: 1, category: "cultural",      economy: 1, loyalty: 2, stability: 0, unrest: -1, slots: 1, requires: [], desc: "Drink, song, and rumors", icon: "⚗" },
    theater:        { name: "Theater",          cost: 12, buildTurns: 2, category: "cultural",      economy: 1, loyalty: 3, stability: 0, unrest: -1, slots: 2, requires: [], desc: "Performances and art", icon: "♫" },
    library:        { name: "Library",          cost: 8,  buildTurns: 1, category: "cultural",      economy: 1, loyalty: 1, stability: 1, unrest: 0,  slots: 1, requires: [], desc: "Repository of knowledge", icon: "❧" },
    academy:        { name: "Academy",          cost: 20, buildTurns: 3, category: "cultural",      economy: 2, loyalty: 2, stability: 2, unrest: 0,  slots: 2, requires: ["library"], desc: "Higher learning institution", icon: "✦" },
    bardCollege:    { name: "Bard College",     cost: 16, buildTurns: 2, category: "cultural",      economy: 1, loyalty: 3, stability: 0, unrest: -2, slots: 2, requires: ["theater"], desc: "School of music and lore", icon: "♪" },
    arena:          { name: "Arena",            cost: 18, buildTurns: 3, category: "cultural",      economy: 2, loyalty: 4, stability: 0, unrest: -2, slots: 4, requires: [], desc: "Gladiatorial combat and spectacle", icon: "⊕" },
    colosseum:      { name: "Grand Colosseum",  cost: 36, buildTurns: 5, category: "cultural",      economy: 4, loyalty: 6, stability: 0, unrest: -4, slots: 6, requires: ["arena"], desc: "Legendary arena of champions", icon: "⊛" },
    monument:       { name: "Monument",         cost: 6,  buildTurns: 1, category: "cultural",      economy: 0, loyalty: 2, stability: 1, unrest: -1, slots: 1, requires: [], desc: "Inspires civic pride", icon: "☗" },
    museum:         { name: "Museum",           cost: 14, buildTurns: 2, category: "cultural",      economy: 1, loyalty: 2, stability: 1, unrest: -1, slots: 2, requires: ["library"], desc: "Preserves history and culture", icon: "⌂" },
    park:           { name: "Park",             cost: 2,  buildTurns: 1, category: "cultural",      economy: 0, loyalty: 2, stability: 0, unrest: -1, slots: 1, requires: [], desc: "Green space for citizens", icon: "❧" },
    bathhouse:      { name: "Bathhouse",        cost: 6,  buildTurns: 1, category: "cultural",      economy: 1, loyalty: 2, stability: 0, unrest: -1, slots: 1, requires: [], desc: "Public baths for health and socializing", icon: "≈" },
    observatory:    { name: "Observatory",      cost: 14, buildTurns: 2, category: "cultural",      economy: 1, loyalty: 1, stability: 1, unrest: 0,  slots: 2, requires: ["academy"], desc: "Studies the stars and planes", icon: "✧" },
    zoo:            { name: "Menagerie",        cost: 10, buildTurns: 2, category: "cultural",      economy: 1, loyalty: 3, stability: 0, unrest: -1, slots: 2, requires: [], desc: "Exotic creatures on display", icon: "⬡" },

    // ─── Residential ───
    tenements:      { name: "Tenements",        cost: 2,  buildTurns: 1, category: "residential",   economy: 0, loyalty: -1, stability: 0, unrest: 0, slots: 1, requires: [], desc: "Cheap cramped housing", popBonus: 250, icon: "▫" },
    houses:         { name: "Houses",           cost: 4,  buildTurns: 1, category: "residential",   economy: 0, loyalty: 0, stability: 0, unrest: -1, slots: 1, requires: [], desc: "Decent citizen housing", popBonus: 500, icon: "⌂" },
    mansions:       { name: "Mansions",         cost: 8,  buildTurns: 2, category: "residential",   economy: 1, loyalty: 1, stability: 0, unrest: 0,  slots: 2, requires: [], desc: "Noble estates", popBonus: 100, icon: "◈" },
    nobleVilla:     { name: "Noble Villa",      cost: 16, buildTurns: 2, category: "residential",   economy: 2, loyalty: 1, stability: 1, unrest: 0,  slots: 4, requires: ["mansions"], desc: "Grand aristocratic estate", popBonus: 50, icon: "♛" },
    foreignQuarter: { name: "Foreign Quarter",  cost: 10, buildTurns: 2, category: "residential",   economy: 2, loyalty: 0, stability: -1, unrest: 0, slots: 2, requires: [], desc: "District for foreign nationals", popBonus: 300, icon: "◎" },

    // ─── Infrastructure ───
    granary:        { name: "Granary",          cost: 6,  buildTurns: 1, category: "infrastructure", economy: 1, loyalty: 1, stability: 1, unrest: 0, slots: 1, requires: [], desc: "Food storage and reserves", icon: "⚘" },
    mill:           { name: "Mill",             cost: 4,  buildTurns: 1, category: "infrastructure", economy: 2, loyalty: 0, stability: 0, unrest: 0, slots: 1, requires: [], desc: "Grinds grain into flour", icon: "⚙" },
    cistern:        { name: "Cistern",          cost: 4,  buildTurns: 1, category: "infrastructure", economy: 0, loyalty: 1, stability: 1, unrest: 0, slots: 1, requires: [], desc: "Clean water storage", icon: "⌇" },
    sewer:          { name: "Sewer System",     cost: 10, buildTurns: 2, category: "infrastructure", economy: 0, loyalty: 2, stability: 2, unrest: -1, slots: 0, requires: ["cistern"], desc: "Underground waste management", icon: "⊘" },
    magicShop:      { name: "Magic Shop",       cost: 20, buildTurns: 2, category: "infrastructure", economy: 3, loyalty: 0, stability: 0, unrest: 0, slots: 1, requires: ["library"], desc: "Arcane goods and services", icon: "✦" },
    hospital:       { name: "Hospital",         cost: 14, buildTurns: 2, category: "infrastructure", economy: 0, loyalty: 2, stability: 1, unrest: -1, slots: 2, requires: [], desc: "Healing and plague prevention", icon: "✚" },
    alchemistLab:   { name: "Alchemist Lab",    cost: 12, buildTurns: 2, category: "infrastructure", economy: 2, loyalty: 0, stability: 0, unrest: 0, slots: 1, requires: ["library"], desc: "Produces potions and reagents", icon: "⚗" },
    clocktower:     { name: "Clocktower",       cost: 10, buildTurns: 2, category: "infrastructure", economy: 1, loyalty: 1, stability: 1, unrest: 0, slots: 1, requires: [], desc: "Timekeeping and signal tower", icon: "⌚" },
    teleportCircle: { name: "Teleport Circle",  cost: 30, buildTurns: 4, category: "infrastructure", economy: 4, loyalty: 0, stability: 0, unrest: 0, slots: 2, requires: ["magicShop","academy"], desc: "Arcane instant travel network", icon: "◎" },
    foundry:        { name: "Foundry",          cost: 10, buildTurns: 2, category: "infrastructure", economy: 3, loyalty: 0, stability: 0, unrest: 0, slots: 2, requires: ["smithy"], desc: "Industrial metalworking facility", icon: "⚒" }
  };

  const BUILDING_CATEGORIES = {
    government:     { label: "Government",     color: "#5b7fb5", icon: "⌂" },
    military:       { label: "Military",       color: "#c94f3f", icon: "⚔" },
    economic:       { label: "Economic",       color: "#d4af37", icon: "⚖" },
    religious:      { label: "Religious",      color: "#9b59b6", icon: "✟" },
    cultural:       { label: "Cultural",       color: "#e67e22", icon: "♫" },
    residential:    { label: "Residential",    color: "#7cb342", icon: "⌂" },
    infrastructure: { label: "Infrastructure", color: "#3498db", icon: "⚙" }
  };

  // ── Council Roles ──────────────────────────────────────────────────────
  const COUNCIL_ROLES = {
    ruler:          { name: "Ruler",           stat: "all",       desc: "Sovereign head of state. Provides bonuses to all kingdom stats.",                   icon: "♛", bonus: { economy: 1, loyalty: 1, stability: 1 } },
    consort:        { name: "Consort",         stat: "loyalty",   desc: "Supports the ruler. Boosts loyalty and can act as regent.",                          icon: "♕", bonus: { loyalty: 2 } },
    councilor:      { name: "Councilor",       stat: "loyalty",   desc: "Manages citizen relations. Addresses grievances and public opinion.",                icon: "⚐", bonus: { loyalty: 2 } },
    general:        { name: "General",         stat: "stability", desc: "Commands the military. Essential for defense and warfare.",                          icon: "⚔",  bonus: { stability: 2 } },
    grandDiplomat:  { name: "Grand Diplomat",  stat: "stability", desc: "Handles foreign relations, treaties, and alliances.",                               icon: "⚐", bonus: { stability: 2 } },
    highPriest:     { name: "High Priest",     stat: "stability", desc: "Spiritual leader. Manages temples, divine favor, and religious policy.",             icon: "✝",  bonus: { stability: 2 } },
    magister:       { name: "Magister",        stat: "economy",   desc: "Oversees arcane matters, magical research, and spell services.",                    icon: "✦",  bonus: { economy: 2 } },
    marshal:        { name: "Marshal",         stat: "economy",   desc: "Patrols the countryside, manages roads, clears threats from territory.",            icon: "♘", bonus: { economy: 2 } },
    enforcer:       { name: "Royal Enforcer",  stat: "loyalty",   desc: "Maintains public order through shows of force. Feared but effective.",              icon: "⚖",  bonus: { loyalty: 2 } },
    spymaster:      { name: "Spymaster",       stat: "economy",   desc: "Runs intelligence networks. Espionage, counter-intelligence, and secrets.",         icon: "◉",  bonus: { economy: 2 } },
    treasurer:      { name: "Treasurer",       stat: "economy",   desc: "Manages the royal treasury, tax collection, and kingdom finances.",                 icon: "⊛", bonus: { economy: 3 } },
    warden:         { name: "Warden",          stat: "loyalty",   desc: "Manages infrastructure, public works, and settlement defense.",                     icon: "⛊", bonus: { loyalty: 2 } },
    headsman:       { name: "Headsman",        stat: "stability", desc: "Public executioner. Discourages crime and sedition through fear.",                  icon: "⚔",  bonus: { stability: 1 } },
    harbourmaster:  { name: "Harbourmaster",   stat: "economy",   desc: "Manages port tariffs, naval trade, and maritime defense.",                          icon: "⚓", bonus: { economy: 2 } }
  };

  // ── Edicts ─────────────────────────────────────────────────────────────
  const EDICT_TYPES = {
    taxation: {
      name: "Taxation",
      desc: "How heavily citizens are taxed",
      icon: "⊛",
      options: {
        none:         { label: "None",         economy: -1, loyalty: 1,  stability: 0 },
        light:        { label: "Light",        economy: 1,  loyalty: 0,  stability: 0 },
        normal:       { label: "Normal",       economy: 2,  loyalty: -1, stability: 0 },
        heavy:        { label: "Heavy",        economy: 3,  loyalty: -2, stability: 0 },
        overwhelming: { label: "Overwhelming", economy: 4,  loyalty: -4, stability: 0 }
      }
    },
    promotion: {
      name: "Promotion",
      desc: "Investment in attracting new citizens and trade",
      icon: "⚐",
      options: {
        none:        { label: "None",       economy: 0,  loyalty: 0, stability: -1, consumption: 0 },
        token:       { label: "Token",      economy: 0,  loyalty: 0, stability: 1,  consumption: 1 },
        standard:    { label: "Standard",   economy: 0,  loyalty: 0, stability: 2,  consumption: 2 },
        aggressive:  { label: "Aggressive", economy: 0,  loyalty: 0, stability: 3,  consumption: 4 },
        expansionist:{ label: "Expansionist",economy: 0, loyalty: 0, stability: 4,  consumption: 8 }
      }
    },
    holiday: {
      name: "Festivals",
      desc: "Frequency of kingdom-sponsored festivals and holidays",
      icon: "♫",
      options: {
        none:       { label: "None",       economy: 0, loyalty: -1, stability: 0, consumption: 0 },
        annual:     { label: "Annual",     economy: 0, loyalty: 1,  stability: 0, consumption: 1 },
        biannual:   { label: "Biannual",   economy: 0, loyalty: 2,  stability: 0, consumption: 2 },
        quarterly:  { label: "Quarterly",  economy: 0, loyalty: 3,  stability: 0, consumption: 4 },
        monthly:    { label: "Monthly",    economy: 0, loyalty: 4,  stability: 0, consumption: 8 }
      }
    },
    law: {
      name: "Law Enforcement",
      desc: "Strictness of laws and their enforcement",
      icon: "⚖",
      options: {
        lax:       { label: "Lax",        economy: 0, loyalty: 1,  stability: -1 },
        normal:    { label: "Normal",     economy: 0, loyalty: 0,  stability: 1 },
        strict:    { label: "Strict",     economy: 0, loyalty: -1, stability: 2 },
        oppressive:{ label: "Oppressive", economy: 0, loyalty: -3, stability: 3 }
      }
    },
    religion: {
      name: "Religious Policy",
      desc: "Official stance on religion within the kingdom",
      icon: "✟",
      options: {
        tolerance:   { label: "Tolerance",   economy: 0, loyalty: 1,  stability: 0, desc: "All faiths welcome" },
        stateChurch: { label: "State Church", economy: 0, loyalty: 0,  stability: 2, desc: "One faith sponsored by the crown" },
        theocracy:   { label: "Theocracy",   economy: 0, loyalty: -1, stability: 3, desc: "Religion and state are one" },
        secular:     { label: "Secular",     economy: 1, loyalty: 0,  stability: -1, desc: "Religion holds no official power" }
      }
    },
    conscription: {
      name: "Conscription",
      desc: "Military draft policy for citizens",
      icon: "⚔",
      options: {
        none:       { label: "None",        economy: 0, loyalty: 1,  stability: -1 },
        volunteer:  { label: "Volunteer",   economy: 0, loyalty: 0,  stability: 1 },
        militia:    { label: "Militia Levy", economy: -1, loyalty: -1, stability: 2 },
        universal:  { label: "Universal",   economy: -2, loyalty: -3, stability: 4 }
      }
    }
  };

  // ── Kingdom Events ─────────────────────────────────────────────────────
  const KINGDOM_EVENTS = [
    // ─ Beneficial ─
    { id: "bountiful_harvest",     name: "Bountiful Harvest",         type: "beneficial", weight: 3, desc: "The fields yield a magnificent crop this season.",                          effect: { treasury: 3, popGrowth: 100 }, condition: function(k) { return k.territories && Object.values(k.territories).some(function(t) { return (t.improvements||[]).some(function(i) { return i.type === "farm"; }); }); } },
    { id: "trade_opportunity",     name: "Trade Opportunity",         type: "beneficial", weight: 3, desc: "A foreign merchant guild seeks a lasting trade agreement.",                  effect: { treasury: 4 } },
    { id: "cultural_renaissance",  name: "Cultural Renaissance",      type: "beneficial", weight: 2, desc: "Artists and scholars flock to the kingdom, inspired by its culture.",        effect: { treasury: 2, unrest: -1 } },
    { id: "pilgrimage",            name: "Holy Pilgrimage",           type: "beneficial", weight: 2, desc: "Pilgrims travel to your kingdom's temples, bringing devotion and coin.",     effect: { treasury: 3, unrest: -2 }, condition: function(k) { return k.stateReligion; } },
    { id: "hero_emerges",          name: "Local Hero Emerges",        type: "beneficial", weight: 1, desc: "A common citizen performs a heroic deed, becoming a folk legend.",            effect: { unrest: -3 } },
    { id: "diplomatic_marriage",   name: "Diplomatic Marriage",       type: "beneficial", weight: 1, desc: "A favorable marriage alliance is proposed.",                                 effect: { treasury: 2 } },
    { id: "divine_blessing",       name: "Divine Blessing",           type: "beneficial", weight: 1, desc: "The gods smile upon the kingdom. Crops grow, the sick are healed.",          effect: { unrest: -4, popGrowth: 200 }, condition: function(k) { return k.stateReligion; } },
    { id: "new_settlers",          name: "New Settlers Arrive",       type: "beneficial", weight: 3, desc: "Settlers from distant lands seek a new home in your domain.",                effect: { popGrowth: 300, treasury: 1 } },
    { id: "mine_strike",           name: "Rich Vein Discovered",      type: "beneficial", weight: 2, desc: "Miners strike a rich vein of precious ore.",                                effect: { treasury: 8 }, condition: function(k) { return k.territories && Object.values(k.territories).some(function(t) { return (t.improvements||[]).some(function(i) { return i.type === "mine"; }); }); } },
    { id: "wandering_wizard",      name: "Wandering Wizard",          type: "beneficial", weight: 2, desc: "A powerful mage offers to enchant the kingdom's defenses.",                  effect: { treasury: 2 } },
    { id: "treasure_hoard",        name: "Hidden Treasure Found",     type: "beneficial", weight: 1, desc: "Workers unearth an ancient treasure hoard while digging foundations.",       effect: { treasury: 6 } },
    { id: "good_harvest_moon",     name: "Harvest Moon",              type: "beneficial", weight: 2, desc: "An auspicious moon brings fertility to the land.",                           effect: { popGrowth: 150, treasury: 1 } },
    { id: "artisan_influx",        name: "Artisan Influx",            type: "beneficial", weight: 2, desc: "Skilled craftspeople seek refuge and opportunities in your realm.",           effect: { treasury: 2, popGrowth: 100 } },

    // ─ Harmful ─
    { id: "bandit_raids",          name: "Bandit Raids",              type: "harmful",    weight: 3, desc: "Organized bandits attack caravans and outlying farms.",                      effect: { treasury: -2, unrest: 2 }, check: { stat: "stability", dc: 14 } },
    { id: "plague_outbreak",       name: "Plague Outbreak",           type: "harmful",    weight: 2, desc: "Disease spreads through the settlements.",                                   effect: { unrest: 3, popGrowth: -500 }, check: { stat: "stability", dc: 16 } },
    { id: "tax_revolt",            name: "Tax Revolt",                type: "harmful",    weight: 2, desc: "Citizens refuse to pay taxes and demand reform.",                            effect: { treasury: -3, unrest: 4 }, check: { stat: "loyalty", dc: 14 } },
    { id: "monster_attack",        name: "Monster Attack",            type: "harmful",    weight: 2, desc: "A dangerous creature terrorizes the countryside.",                           effect: { unrest: 3 }, check: { stat: "stability", dc: 15 } },
    { id: "corruption_scandal",    name: "Corruption Scandal",        type: "harmful",    weight: 2, desc: "A council member is caught embezzling from the treasury.",                   effect: { treasury: -4, unrest: 2 }, check: { stat: "loyalty", dc: 13 } },
    { id: "food_shortage",         name: "Food Shortage",             type: "harmful",    weight: 2, desc: "Poor yields and supply chain issues cause hunger.",                          effect: { unrest: 4 }, check: { stat: "economy", dc: 14 } },
    { id: "earthquake",            name: "Earthquake",                type: "harmful",    weight: 1, desc: "The ground shakes, damaging buildings and terrifying citizens.",              effect: { treasury: -3, unrest: 3 }, check: { stat: "stability", dc: 18 } },
    { id: "dragon_sighting",       name: "Dragon Sighting",           type: "harmful",    weight: 1, desc: "A dragon circles the kingdom, demanding tribute.",                          effect: { treasury: -8, unrest: 5 }, check: { stat: "stability", dc: 20 } },
    { id: "heresy",                name: "Heretical Movement",        type: "harmful",    weight: 2, desc: "A cult spreads dangerous beliefs, undermining the faith.",                   effect: { unrest: 3 }, check: { stat: "stability", dc: 14 }, condition: function(k) { return k.stateReligion; } },
    { id: "border_dispute",        name: "Border Dispute",            type: "harmful",    weight: 2, desc: "A neighboring power claims part of your territory.",                        effect: { unrest: 2 }, check: { stat: "stability", dc: 15 } },
    { id: "assassination_attempt", name: "Assassination Attempt",     type: "harmful",    weight: 1, desc: "An assassin targets a council member.",                                     effect: { unrest: 3 }, check: { stat: "stability", dc: 17 } },
    { id: "famine",                name: "Famine",                    type: "harmful",    weight: 1, desc: "Widespread crop failure threatens starvation.",                              effect: { treasury: -4, popGrowth: -1000, unrest: 6 }, check: { stat: "economy", dc: 18 } },
    { id: "flood",                 name: "Great Flood",               type: "harmful",    weight: 1, desc: "Rivers overflow, destroying farmland and bridges.",                         effect: { treasury: -3, unrest: 3 }, check: { stat: "stability", dc: 15 } },
    { id: "smuggler_ring",         name: "Smuggler Ring",             type: "harmful",    weight: 2, desc: "A smuggling operation undermines lawful commerce.",                          effect: { treasury: -2, unrest: 1 }, check: { stat: "economy", dc: 13 } },
    { id: "wildfire",              name: "Wildfire",                  type: "harmful",    weight: 1, desc: "Fire sweeps through forests and outlying settlements.",                      effect: { treasury: -2, unrest: 2 }, check: { stat: "stability", dc: 14 }, condition: function(k) { return k.territories && Object.values(k.territories).some(function(t) { return t.terrain === "forest" || t.terrain === "jungle"; }); } },
    { id: "cursed_artifact",       name: "Cursed Artifact Unearthed", type: "harmful",    weight: 1, desc: "Workers unearth something that should have stayed buried.",                 effect: { unrest: 4 }, check: { stat: "stability", dc: 16 } },
    { id: "goblin_incursion",      name: "Goblin Incursion",          type: "harmful",    weight: 2, desc: "Goblin tribes muster and raid the borderlands.",                            effect: { treasury: -2, unrest: 2 }, check: { stat: "stability", dc: 13 } },
    { id: "haunting",              name: "Restless Dead",             type: "harmful",    weight: 1, desc: "Undead stir in the graveyards, terrorizing nearby villages.",                effect: { unrest: 3 }, check: { stat: "stability", dc: 15 } },

    // ─ Neutral / Choice ─
    { id: "refugees",              name: "Refugees Arrive",           type: "choice",     weight: 3, desc: "Displaced people beg for shelter. Accept them or turn them away?",
      choiceA: { label: "Welcome them", effect: { popGrowth: 500, treasury: -2 } },
      choiceB: { label: "Turn them away", effect: { unrest: 1 } } },
    { id: "traveling_circus",      name: "Traveling Circus",          type: "choice",     weight: 2, desc: "A famous circus troupe offers to perform. Fund them or decline?",
      choiceA: { label: "Fund the show", effect: { unrest: -3, treasury: -1 } },
      choiceB: { label: "Politely decline", effect: {} } },
    { id: "land_dispute",          name: "Noble Land Dispute",        type: "choice",     weight: 2, desc: "Two noble houses claim the same parcel. Side with the warriors or the merchants?",
      choiceA: { label: "Favor the warriors", effect: { treasury: -1 } },
      choiceB: { label: "Favor the merchants", effect: { treasury: 2, unrest: 1 } } },
    { id: "undead_rising",         name: "Undead Rising",             type: "choice",     weight: 1, desc: "Undead emerge from an old graveyard. Send troops or call for adventurers?",
      choiceA: { label: "Send troops", effect: { treasury: -2 } },
      choiceB: { label: "Hire adventurers", effect: { treasury: -4, unrest: -1 } } },
    { id: "foreign_envoy",         name: "Foreign Envoy",             type: "choice",     weight: 2, desc: "An envoy proposes a mutual defense pact. The terms favor them slightly.",
      choiceA: { label: "Accept the pact", effect: { treasury: -1 } },
      choiceB: { label: "Negotiate harder", effect: {} } },
    { id: "merchant_prince",       name: "Merchant Prince",           type: "choice",     weight: 2, desc: "A wealthy merchant offers to build a trading post — for exclusive trade rights.",
      choiceA: { label: "Grant exclusivity", effect: { treasury: 5, unrest: 1 } },
      choiceB: { label: "Decline the offer", effect: {} } },
    { id: "wandering_prophet",     name: "Wandering Prophet",         type: "choice",     weight: 2, desc: "A charismatic prophet draws crowds. Embrace or exile them?",
      choiceA: { label: "Embrace the prophet", effect: { unrest: -2, treasury: -1 } },
      choiceB: { label: "Exile the prophet", effect: { unrest: 1 } } },
    { id: "ancient_ruins",         name: "Ancient Ruins Discovered",  type: "choice",     weight: 2, desc: "Explorers find ruins in the wilderness. Excavate or seal them?",
      choiceA: { label: "Excavate", effect: { treasury: 4, unrest: 1 } },
      choiceB: { label: "Seal them", effect: { unrest: -1 } } },
    { id: "thieves_guild",         name: "Thieves' Guild Offer",      type: "choice",     weight: 1, desc: "The local thieves' guild offers information in exchange for tolerance.",
      choiceA: { label: "Accept the deal", effect: { treasury: 2, unrest: 1 } },
      choiceB: { label: "Crack down on them", effect: { treasury: -2, unrest: -1 } } },
    { id: "dragon_egg",            name: "Dragon Egg Found",          type: "choice",     weight: 1, desc: "A farmer discovers a dragon egg. It could hatch something powerful — or dangerous.",
      choiceA: { label: "Keep and nurture it", effect: { unrest: 2 } },
      choiceB: { label: "Destroy it safely", effect: { unrest: -1 } } },
    { id: "feywild_crossing",      name: "Feywild Crossing",          type: "choice",     weight: 1, desc: "A portal to the Feywild opens in your territory. Wondrous but unpredictable.",
      choiceA: { label: "Embrace the fey", effect: { treasury: 3, unrest: 2 } },
      choiceB: { label: "Ward it shut", effect: { treasury: -2 } } }
  ];

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2: KINGDOM ENGINE (BUG-FIXED)
  // ═══════════════════════════════════════════════════════════════════════════

  function initKingdom(name, rulerName, bannerCfg) {
    return {
      name: name || "New Kingdom",
      banner: bannerCfg || { shape: "pointed", border: "ornate", emblem: "lion", bg: "#1a2e20", fg: "#c9a032" },
      founded: Date.now(),
      turn: 0,
      phase: "idle",

      // Core Stats (derived — stored for display but recalculated each render)
      unrest: 0,
      fame: 0,
      infamy: 0,

      // Resources
      treasury: 10,

      // Population
      totalPopulation: 100,

      // Territory & Settlements
      territories: {},
      settlements: {},
      capitalSettlement: null,

      // Governance
      council: {},
      edicts: {
        taxation: "normal",
        promotion: "none",
        holiday: "none",
        law: "normal",
        religion: "tolerance",
        conscription: "volunteer"
      },
      laws: [],

      // Religion
      stateReligion: null,
      divineFavor: {},

      // Military (hooks into Faction War)
      warFactionId: null,

      // History
      eventLog: [],
      turnHistory: [],
      activeEvent: null
    };
  }

  // ── Calculate derived kingdom stats (PURE — no side effects) ───────────
  function calcKingdomStats(kingdom) {
    var economy = 0, loyalty = 0, stability = 0, consumption = 0;
    var totalDefense = 0;

    // Council bonuses
    var council = kingdom.council || {};
    Object.keys(council).forEach(function(role) {
      var npc = council[role];
      if (npc && COUNCIL_ROLES[role]) {
        var bonus = COUNCIL_ROLES[role].bonus;
        economy += bonus.economy || 0;
        loyalty += bonus.loyalty || 0;
        stability += bonus.stability || 0;
      }
    });

    // Vacant council penalty: -2 per unfilled critical role
    var criticalRoles = ["ruler", "treasurer", "general", "highPriest"];
    criticalRoles.forEach(function(role) {
      if (!council[role]) stability -= 2;
    });

    // Edict modifiers
    var edicts = kingdom.edicts || {};
    Object.keys(edicts).forEach(function(edictType) {
      var level = edicts[edictType];
      var edictDef = EDICT_TYPES[edictType];
      if (edictDef && edictDef.options[level]) {
        var opts = edictDef.options[level];
        economy += opts.economy || 0;
        loyalty += opts.loyalty || 0;
        stability += opts.stability || 0;
        consumption += opts.consumption || 0;
      }
    });

    // Territory improvements
    var territories = kingdom.territories || {};
    Object.keys(territories).forEach(function(hexId) {
      var hex = territories[hexId];
      (hex.improvements || []).forEach(function(imp) {
        var impData = HEX_IMPROVEMENTS[imp.type];
        if (impData && imp.completed) {
          economy += impData.economy || 0;
          loyalty += impData.loyalty || 0;
          stability += impData.stability || 0;
        }
      });
    });

    // Settlement buildings
    var settlements = kingdom.settlements || {};
    Object.keys(settlements).forEach(function(setId) {
      var settlement = settlements[setId];
      (settlement.buildings || []).forEach(function(b) {
        var bData = BUILDINGS[b.type];
        if (bData && b.completed) {
          economy += bData.economy || 0;
          loyalty += bData.loyalty || 0;
          stability += bData.stability || 0;
          if (bData.category === "military") totalDefense += (bData.stability || 0);
        }
      });
      var size = getSettlementSize(settlement.population || 0);
      totalDefense += (SETTLEMENT_SIZES[size] && SETTLEMENT_SIZES[size].defenseBonus) || 0;
    });

    // Consumption from claimed hexes
    var numHexes = Object.keys(territories).length;
    consumption += numHexes;

    // Unrest penalty — applied to derived stats, NOT mutating kingdom
    var unrest = kingdom.unrest || 0;
    economy -= unrest;
    loyalty -= unrest;
    stability -= unrest;

    // Income: positive economy → treasury gains
    var income = Math.max(0, economy);

    return { economy: economy, loyalty: loyalty, stability: stability, consumption: consumption, income: income, totalDefense: totalDefense, unrest: unrest };
  }

  // ── Process a kingdom turn phase ───────────────────────────────────────
  function processKingdomTurn(kingdom, phase) {
    var k = JSON.parse(JSON.stringify(kingdom));
    var stats = calcKingdomStats(k);
    var log = [];

    switch (phase) {
      case "upkeep": {
        var cost = Math.max(0, stats.consumption);
        if (k.treasury >= cost) {
          k.treasury -= cost;
          log.push("Paid " + cost + " BP in consumption costs.");
        } else {
          var deficit = cost - k.treasury;
          k.treasury = 0;
          k.unrest = (k.unrest || 0) + 2;
          log.push("Treasury deficit of " + deficit + " BP! Unrest increases by 2.");
        }

        // Stability check to reduce unrest
        if (k.unrest > 0) {
          var roll = Math.floor(Math.random() * 20) + 1 + stats.stability;
          if (roll >= 14) {
            k.unrest = Math.max(0, k.unrest - 1);
            log.push("Stability check passed (rolled " + roll + "). Unrest reduced by 1.");
          } else {
            k.unrest += 1;
            log.push("Stability check failed (rolled " + roll + "). Unrest increases by 1.");
          }
        }

        // Unrest-reducing buildings
        var unrestReduction = 0;
        Object.values(k.settlements || {}).forEach(function(s) {
          (s.buildings || []).forEach(function(b) {
            var bData = BUILDINGS[b.type];
            if (bData && b.completed && bData.unrest && bData.unrest < 0) {
              unrestReduction += Math.abs(bData.unrest);
            }
          });
        });
        if (unrestReduction > 0 && k.unrest > 0) {
          var reduced = Math.min(k.unrest, unrestReduction);
          k.unrest = Math.max(0, k.unrest - reduced);
          log.push("Buildings reduce unrest by " + reduced + ".");
        }

        if (k.unrest >= 20) {
          log.push("⚠ CRITICAL: Unrest has reached " + k.unrest + "! The kingdom is on the verge of collapse!");
        }
        break;
      }

      case "income": {
        var incRoll = Math.floor(Math.random() * 20) + 1 + stats.economy;
        var earned = Math.max(0, Math.floor(incRoll / 5));
        k.treasury += earned;
        log.push("Economy check: rolled " + incRoll + ". Earned " + earned + " BP.");

        // Population growth
        var loyaltyBonus = Math.max(0, stats.loyalty);
        var growthRate = loyaltyBonus * 10 + 50;
        var popGrowth = Math.floor(growthRate * Math.max(0, 1 - (k.unrest || 0) * 0.05));
        k.totalPopulation = Math.max(0, (k.totalPopulation || 100) + popGrowth);

        // Distribute population to settlements proportionally
        var setKeys = Object.keys(k.settlements || {});
        if (setKeys.length > 0 && popGrowth > 0) {
          var perSettlement = Math.floor(popGrowth / setKeys.length);
          setKeys.forEach(function(sid) { k.settlements[sid].population = (k.settlements[sid].population || 100) + perSettlement; });
        }

        if (popGrowth > 0) log.push("Population grew by " + popGrowth + " (total: " + k.totalPopulation.toLocaleString() + ").");
        if (popGrowth <= 0) log.push("Population stagnant at " + k.totalPopulation.toLocaleString() + ".");
        break;
      }

      case "event": {
        var eventRoll = Math.floor(Math.random() * 100);
        if (eventRoll < 60) {
          var eligible = KINGDOM_EVENTS.filter(function(e) { return !e.condition || e.condition(k); });
          if (eligible.length === 0) { log.push("No applicable events."); break; }
          var totalWeight = eligible.reduce(function(s, e) { return s + e.weight; }, 0);
          var pick = Math.random() * totalWeight;
          var chosen = eligible[0];
          for (var ei = 0; ei < eligible.length; ei++) {
            pick -= eligible[ei].weight;
            if (pick <= 0) { chosen = eligible[ei]; break; }
          }

          if (chosen.type === "choice") {
            k.activeEvent = JSON.parse(JSON.stringify(chosen));
            k.activeEvent.timestamp = Date.now();
            log.push("Event: " + chosen.name + " — " + chosen.desc + " (awaiting DM decision)");
          } else if (chosen.type === "harmful" && chosen.check) {
            var statVal = stats[chosen.check.stat] || 0;
            var chkRoll = Math.floor(Math.random() * 20) + 1 + statVal;
            if (chkRoll >= chosen.check.dc) {
              log.push("Event: " + chosen.name + " — Mitigated! (rolled " + chkRoll + " vs DC " + chosen.check.dc + ")");
              // On success: half the bad effects
              applyEventEffect(k, chosen.effect, 0.5);
            } else {
              log.push("Event: " + chosen.name + " — Failed to mitigate! (rolled " + chkRoll + " vs DC " + chosen.check.dc + ")");
              applyEventEffect(k, chosen.effect, 1.0);
            }
          } else {
            applyEventEffect(k, chosen.effect, 1.0);
            log.push("Event: " + chosen.name + " — " + chosen.desc);
          }

          if (!k.eventLog) k.eventLog = [];
          k.eventLog.push({ turn: k.turn, event: chosen.name, type: chosen.type, timestamp: Date.now() });
          if (k.eventLog.length > 500) k.eventLog = k.eventLog.slice(-500);
        } else {
          log.push("No kingdom event this turn.");
        }
        break;
      }

      case "building": {
        var anyCompleted = false;
        // Settlement construction
        Object.values(k.settlements || {}).forEach(function(settlement) {
          var queue = settlement.constructionQueue || [];
          var newQueue = [];
          queue.forEach(function(item) {
            item.turnsRemaining -= 1;
            if (item.turnsRemaining <= 0) {
              if (!settlement.buildings) settlement.buildings = [];
              settlement.buildings.push({ type: item.buildingType, completed: true, builtTurn: k.turn });
              anyCompleted = true;
              log.push("Completed: " + ((BUILDINGS[item.buildingType] && BUILDINGS[item.buildingType].name) || item.buildingType) + " in " + settlement.name);
            } else {
              newQueue.push(item);
            }
          });
          settlement.constructionQueue = newQueue;
        });

        // Hex improvements
        Object.values(k.territories || {}).forEach(function(hex) {
          var queue = hex.improvementQueue || [];
          var newQueue = [];
          queue.forEach(function(item) {
            item.turnsRemaining -= 1;
            if (item.turnsRemaining <= 0) {
              if (!hex.improvements) hex.improvements = [];
              hex.improvements.push({ type: item.type, completed: true, builtTurn: k.turn });
              anyCompleted = true;
              log.push("Completed: " + ((HEX_IMPROVEMENTS[item.type] && HEX_IMPROVEMENTS[item.type].name) || item.type) + " at " + hex.name);
            } else {
              newQueue.push(item);
            }
          });
          hex.improvementQueue = newQueue;
        });

        if (!anyCompleted) log.push("No construction completed this turn.");
        break;
      }

      default:
        break;
    }

    return { kingdom: k, log: log };
  }

  function applyEventEffect(kingdom, effect, multiplier) {
    if (!effect) return;
    var m = multiplier || 1.0;
    if (effect.treasury) kingdom.treasury = Math.max(0, kingdom.treasury + Math.round(effect.treasury * m));
    if (effect.unrest) kingdom.unrest = Math.max(0, (kingdom.unrest || 0) + Math.round(effect.unrest * m));
    if (effect.popGrowth) kingdom.totalPopulation = Math.max(0, (kingdom.totalPopulation || 100) + Math.round(effect.popGrowth * m));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3: SHARED STYLES
  // ═══════════════════════════════════════════════════════════════════════════

  // Ornamental flourish helper
  var FLOURISH = " \u2E31 ";
  var ORNAMENT_L = "\u2756 ";
  var ORNAMENT_R = " \u2756";

  const S = {
    page: { display:"flex", flexDirection:"column", height:"100%", background:T.bg, color:T.text, fontFamily:T.body, overflow:"hidden" },
    header: { padding:"0", flexShrink:0, background:T.bgCard, borderBottom:"none", display:"flex", flexDirection:"column" },
    headerInner: { padding:"16px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" },
    headerBorder: { height:"3px", background:"linear-gradient(90deg, transparent 0%, "+T.gold+"55 15%, "+T.gold+" 50%, "+T.gold+"55 85%, transparent 100%)" },
    headerAccent: { height:"1px", background:"linear-gradient(90deg, transparent 0%, "+T.gold+"22 20%, "+T.gold+"44 50%, "+T.gold+"22 80%, transparent 100%)", marginTop:"1px" },
    title: { fontSize:"24px", fontWeight:"bold", fontFamily:T.heading, color:T.gold, margin:0, display:"flex", alignItems:"center", gap:"10px", letterSpacing:"2px", textShadow:"0 1px 4px rgba(0,0,0,0.5), 0 0 20px "+T.gold+"15" },
    scrollArea: { flex:1, overflowY:"auto", padding:"20px", position:"relative" },
    card: { background:T.bgCard, border:"1px solid "+T.border, borderRadius:"2px", padding:"16px", marginBottom:"12px", boxShadow:"0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)", position:"relative" },
    cardHover: { cursor:"pointer", transition:"border-color 0.2s, box-shadow 0.2s, transform 0.15s" },
    cardRoyal: { background:"linear-gradient(135deg, "+T.bgCard+" 0%, "+T.bgCard+" 85%, "+T.gold+"08 100%)", borderTop:"2px solid "+T.gold+"44" },
    grid2: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" },
    grid3: { display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px" },
    grid4: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:"14px" },
    statRow: { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:"10px", marginBottom:"16px" },
    statBox: { background:"linear-gradient(180deg, "+T.bgCard+" 0%, "+T.bg+"88 100%)", border:"1px solid "+T.border, borderTop:"2px solid "+T.gold+"44", borderRadius:"2px", padding:"14px 10px 12px", textAlign:"center", boxShadow:"0 2px 6px rgba(0,0,0,0.2)", position:"relative", overflow:"hidden" },
    treasuryBox: { background:"linear-gradient(180deg, "+T.bgCard+" 0%, "+T.bg+"88 100%)", border:"1px solid "+T.border, borderTop:"2px solid "+T.gold+"66", borderRadius:"2px", padding:"18px 14px 14px", textAlign:"center", boxShadow:"0 2px 8px rgba(0,0,0,0.3)", position:"relative", overflow:"hidden", gridColumn: "span 2" },
    statLabel: { fontSize:"9px", color:T.gold, fontWeight:"700", textTransform:"uppercase", letterSpacing:"2px", marginBottom:"6px", fontFamily:T.ui, opacity:0.7 },
    statVal: function(color) { return { fontSize:"24px", fontWeight:"bold", color: color || T.gold, textShadow:"0 0 12px "+(color||T.gold)+"22", fontFamily:T.heading, letterSpacing:"1px" }; },
    sectionHead: { fontSize:"16px", fontWeight:"bold", color:T.gold, marginBottom:"14px", display:"flex", alignItems:"center", gap:"8px", fontFamily:T.heading, letterSpacing:"1px", paddingBottom:"10px", borderBottom:"2px solid transparent", borderImage:"linear-gradient(90deg, "+T.gold+"66 0%, "+T.gold+"22 70%, transparent 100%) 1" },
    btn: { padding:"8px 16px", borderRadius:"2px", border:"1px solid "+T.crimson, background:"linear-gradient(180deg, "+T.crimson+" 0%, "+T.crimson+"cc 100%)", color:"#fff", cursor:"pointer", fontWeight:"700", fontSize:"12px", display:"inline-flex", alignItems:"center", gap:"6px", transition:"all 0.2s", fontFamily:T.ui, letterSpacing:"0.8px", textTransform:"uppercase", boxShadow:"0 2px 4px rgba(0,0,0,0.3)" },
    btnGold: { background:"transparent", color:T.gold, borderColor:T.gold+"88" },
    btnSmall: { padding:"4px 10px", fontSize:"10px", letterSpacing:"0.5px" },
    btnDanger: { background:"linear-gradient(180deg, #c94f3f 0%, #a83a2e 100%)", borderColor:"#c94f3f" },
    input: { padding:"8px 12px", borderRadius:"2px", border:"1px solid "+T.border, borderBottom:"2px solid "+T.gold+"33", background:T.bg, color:T.text, fontSize:"13px", fontFamily:T.body, width:"100%", transition:"border-color 0.2s" },
    select: { padding:"8px 12px", borderRadius:"2px", border:"1px solid "+T.border, borderBottom:"2px solid "+T.gold+"33", background:T.bg, color:T.text, fontSize:"13px", fontFamily:T.body, width:"100%" },
    label: { fontSize:"9px", fontWeight:"700", color:T.gold, textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"6px", display:"block", fontFamily:T.ui, opacity:0.6 },
    pill: function(color) { return { display:"inline-block", padding:"3px 10px", borderRadius:"1px", fontSize:"10px", fontWeight:"700", background:(color||T.gold)+"12", color:color||T.gold, letterSpacing:"0.5px", border:"1px solid "+(color||T.gold)+"33", fontFamily:T.ui }; },
    tabs: { display:"flex", gap:"4px", marginBottom:"16px", flexWrap:"wrap" },
    tab: function(active) { return { padding:"7px 16px", borderRadius:"2px", border:"1px solid "+(active?T.gold:T.border), borderBottom:active?"2px solid "+T.gold:"2px solid transparent", background:active?T.gold+"10":"transparent", color:active?T.gold:T.textDim, cursor:"pointer", fontSize:"11px", fontWeight:"700", fontFamily:T.ui, transition:"all 0.2s", letterSpacing:"0.8px", textTransform:"uppercase" }; },
    empty: { textAlign:"center", padding:"48px 24px", color:T.textDim, fontSize:"14px", fontFamily:T.body },
    divider: { border:"none", height:"1px", background:"linear-gradient(90deg, transparent 0%, "+T.gold+"33 50%, transparent 100%)", margin:"20px 0" },
    badge: function(color) { return { display:"inline-flex", alignItems:"center", gap:"4px", padding:"3px 10px", borderRadius:"2px", fontSize:"10px", fontWeight:"700", background:(color||"#888")+"15", color:color||"#888", border:"1px solid "+(color||"#888")+"25", letterSpacing:"0.3px", fontFamily:T.ui }; },
    ornament: { textAlign:"center", color:T.gold+"55", fontSize:"14px", letterSpacing:"8px", margin:"8px 0", fontFamily:"serif" }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4: UI COMPONENTS
  // ═══════════════════════════════════════════════════════════════════════════

  function StatBadge(_ref) {
    var label = _ref.label, value = _ref.value, color = _ref.color, featured = _ref.featured;
    var boxStyle = featured ? S.treasuryBox : S.statBox;
    var fontSize = featured ? "28px" : "24px";
    return React.createElement("div", { style: Object.assign({}, boxStyle, { borderTopColor: (color || T.gold) + (featured ? "77" : "66") }) },
      React.createElement("div", { style: S.statLabel }, label),
      React.createElement("div", { style: Object.assign({}, S.statVal(color), { fontSize: fontSize }) },
        typeof value === "number" ? (value >= 0 ? "+" + value : String(value)) : value
      ),
      React.createElement("div", { style: { position:"absolute", bottom:"0", left:"0", right:"0", height:"2px", background:"linear-gradient(90deg, transparent, "+(color||T.gold)+"22, transparent)" } })
    );
  }

  // ── Kingdom Stage Calculator ──────────────────────────────────────────
  function getKingdomStage(kingdom) {
    if (!kingdom) return 0;
    var hexes = Object.keys(kingdom.territories || {}).length;
    var settlements = Object.keys(kingdom.settlements || {}).length;
    var buildings = Object.values(kingdom.settlements || {}).reduce(function(s, set) {
      return s + (set.buildings || []).filter(function(b) { return b.completed; }).length;
    }, 0);
    var total = hexes + settlements + buildings;
    if (total >= 31) return 4;
    if (total >= 16) return 3;
    if (total >= 6) return 2;
    if (total >= 1) return 1;
    return 0;
  }

  // ── Banner SVG Generator ──────────────────────────────────────────────
function getBannerSVG(cfg) {
    var C = cfg || {};
    var shape = C.shape || 'pointed';
    var border = C.border || 'trim';
    var emblem = C.emblem || 'lion';
    var bg = C.bg || '#1a2e20';
    var fg = C.fg || '#c9a032';
    var dk = '#0a0805';

    // Shape paths (clip + outline)
    var SP = {
        pointed: {
            clip: 'M 5 12 L 95 12 L 95 248 L 50 295 L 5 248 Z',
            outline: 'M 5 12 L 95 12 L 95 248 L 50 295 L 5 248 Z'
        },
        forked: {
            clip: 'M 5 12 L 95 12 L 95 260 L 70 230 L 50 295 L 30 230 L 5 260 Z',
            outline: 'M 5 12 L 95 12 L 95 260 L 70 230 L 50 295 L 30 230 L 5 260 Z'
        },
        straight: {
            clip: 'M 5 12 L 95 12 L 95 280 L 5 280 Z',
            outline: 'M 5 12 L 95 12 L 95 280 L 5 280 Z'
        },
        swallowtail: {
            clip: 'M 5 12 L 95 12 L 95 280 L 50 240 L 5 280 Z',
            outline: 'M 5 12 L 95 12 L 95 280 L 50 240 L 5 280 Z'
        },
        rounded: {
            clip: 'M 5 12 L 95 12 L 95 240 Q 95 280 50 295 Q 5 280 5 240 Z',
            outline: 'M 5 12 L 95 12 L 95 240 Q 95 280 50 295 Q 5 280 5 240 Z'
        }
    };

    var s = SP[shape] || SP.pointed;

    // Wrinkle lines (subtle fabric folds)
    var wrinkles = '';
    var wd = darkenColor(bg, 0.82);
    wrinkles += '<line x1="18" y1="45" x2="22" y2="120" stroke="' + wd + '" stroke-width="0.5" opacity="0.4"/>';
    wrinkles += '<line x1="78" y1="60" x2="80" y2="155" stroke="' + wd + '" stroke-width="0.5" opacity="0.35"/>';
    wrinkles += '<line x1="35" y1="180" x2="30" y2="240" stroke="' + wd + '" stroke-width="0.4" opacity="0.3"/>';
    wrinkles += '<line x1="65" y1="170" x2="70" y2="235" stroke="' + wd + '" stroke-width="0.4" opacity="0.3"/>';

    // Border
    var borderSVG = '';
    if (border === 'trim') {
        borderSVG = '<path d="' + s.outline + '" fill="none" stroke="' + fg + '" stroke-width="2.5"/>';
    } else if (border === 'double') {
        borderSVG = '<path d="' + s.outline + '" fill="none" stroke="' + fg + '" stroke-width="3.5"/>';
        borderSVG += '<path d="' + s.outline + '" fill="none" stroke="' + bg + '" stroke-width="1.5"/>';
        borderSVG += '<path d="' + s.outline + '" fill="none" stroke="' + fg + '" stroke-width="0.5"/>';
    } else if (border === 'ornate') {
        borderSVG = '<path d="' + s.outline + '" fill="none" stroke="' + fg + '" stroke-width="4"/>';
        borderSVG += '<path d="' + s.outline + '" fill="none" stroke="' + bg + '" stroke-width="2"/>';
        borderSVG += '<path d="' + s.outline + '" fill="none" stroke="' + fg + '" stroke-width="0.8"/>';
        // Corner accents
        var acc = '<circle cx="10" cy="17" r="2.5" fill="' + fg + '"/>';
        acc += '<circle cx="90" cy="17" r="2.5" fill="' + fg + '"/>';
        acc += '<circle cx="50" cy="17" r="2" fill="' + fg + '"/>';
        // Diamond accents along top
        acc += '<path d="M 30 17 l 2.5 -3 l 2.5 3 l -2.5 3 z" fill="' + fg + '"/>';
        acc += '<path d="M 65 17 l 2.5 -3 l 2.5 3 l -2.5 3 z" fill="' + fg + '"/>';
        borderSVG += acc;
    }

    // Emblem
    var emblemSVG = getEmblemSVG(emblem, fg, dk);

    // Rod and cords
    var rod = '<rect x="2" y="6" width="96" height="6" rx="3" fill="#4a3520" stroke="#2a1a0a" stroke-width="0.5"/>';
    rod += '<circle cx="3" cy="9" r="3.5" fill="#5a4530" stroke="#2a1a0a" stroke-width="0.5"/>';
    rod += '<circle cx="97" cy="9" r="3.5" fill="#5a4530" stroke="#2a1a0a" stroke-width="0.5"/>';
    var cords = '<path d="M 3 9 Q -5 -5 10 2" fill="none" stroke="#3a2a15" stroke-width="1.2"/>';
    cords += '<path d="M 97 9 Q 105 -5 90 2" fill="none" stroke="#3a2a15" stroke-width="1.2"/>';

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 300" width="100" height="300" preserveAspectRatio="xMidYMin meet">';
    svg += '<defs>';
    svg += '<clipPath id="kclip"><path d="' + s.clip + '"/></clipPath>';
    svg += '<filter id="kemb" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0.5" dy="1" stdDeviation="0.8" flood-color="' + dk + '" flood-opacity="0.5"/></filter>';
    svg += '</defs>';
    // Background
    svg += '<g clip-path="url(#kclip)">';
    svg += '<rect x="0" y="0" width="100" height="300" fill="' + bg + '"/>';
    svg += wrinkles;
    svg += '</g>';
    // Border
    svg += borderSVG;
    // Emblem with shadow
    svg += '<g clip-path="url(#kclip)" filter="url(#kemb)">';
    svg += emblemSVG;
    svg += '</g>';
    // Rod and cords
    svg += rod + cords;
    svg += '</svg>';
    return svg;

    function darkenColor(hex, factor) {
        var r = parseInt(hex.slice(1,3),16);
        var g = parseInt(hex.slice(3,5),16);
        var b = parseInt(hex.slice(5,7),16);
        r = Math.round(r * factor);
        g = Math.round(g * factor);
        b = Math.round(b * factor);
        return '#' + ((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
    }

    function getEmblemSVG(name, fill, stroke) {
        var f = fill;
        var o = ''; // output SVG string

        // All emblems designed to fill roughly x:15-85, y:55-235 area
        // Using composite shapes for bold heraldic silhouettes

        switch(name) {

        case 'lion':
            o += '<path d="' + 'M 66.1 213.6 C 66.1 213.4 65.8 212.5 65.3 211.8 C 63.8 209.4 63.5 206.7 64.1 203.7 C 64.5 202.2 64.2 201.6 63.2 201.4 C 62.2 201.3 61.7 202.1 61.2 204.6 C 60.8 206.8 60.8 206.8 60.2 204.3 C 59.7 202.2 59.7 199.6 60.2 198.0 C 61.0 195.3 60.1 194.4 59.2 197.0 C 58.5 198.7 58.5 198.7 58.3 196.5 C 57.9 192.0 59.3 188.5 61.5 188.4 C 61.9 188.4 62.5 188.2 62.9 187.9 C 64.5 186.8 65.4 187.6 66.2 190.9 C 66.4 192.0 66.8 193.0 66.9 193.1 C 67.8 193.7 69.5 193.0 69.6 191.9 C 69.7 191.5 70.0 190.6 70.2 190.0 C 70.7 188.9 70.9 187.1 70.6 187.1 C 70.3 187.1 69.5 184.6 69.1 182.2 C 68.6 180.0 68.5 179.8 67.8 179.1 C 67.4 178.8 66.7 177.8 66.4 177.0 C 65.6 175.2 65.4 175.2 64.4 176.3 C 63.7 177.1 63.3 177.2 62.0 177.4 C 60.5 177.5 60.5 177.5 60.0 178.6 C 58.1 182.7 57.0 186.7 56.5 192.1 C 56.2 195.1 56.2 195.1 55.4 192.2 C 54.5 188.7 54.3 185.5 54.8 182.6 C 55.1 180.9 55.1 180.9 54.8 178.7 C 54.3 176.4 54.5 174.6 55.3 173.8 C 55.8 173.3 55.8 169.6 55.2 169.6 C 54.9 169.6 54.8 170.0 54.5 171.2 C 54.4 172.2 54.0 173.3 53.6 174.0 C 52.9 175.2 52.9 175.2 53.0 177.7 C 53.1 180.4 52.7 183.6 52.3 183.6 C 52.2 183.6 52.0 184.1 51.9 184.9 C 51.6 186.5 51.1 187.5 50.6 187.5 C 49.9 187.5 50.2 191.0 51.2 193.5 C 51.9 195.4 51.4 196.2 49.6 196.2 C 48.6 196.2 48.6 196.2 48.7 197.9 C 48.9 201.1 48.4 204.0 48.0 201.9 C 47.3 198.2 45.8 197.4 45.7 200.6 C 45.7 203.9 45.2 205.8 44.8 204.3 C 43.6 200.3 42.1 200.0 42.1 203.9 C 42.0 206.7 41.6 208.5 40.4 210.3 C 39.6 211.5 39.6 211.5 39.7 209.2 C 39.7 205.1 38.4 203.9 35.3 205.4 C 34.5 205.8 33.9 205.9 33.0 205.7 C 31.6 205.5 31.5 205.6 31.8 208.3 C 31.9 210.3 31.9 210.4 31.3 209.6 C 29.6 207.5 29.2 205.7 29.3 202.1 C 29.5 197.6 27.5 198.0 26.6 202.6 C 26.2 204.7 26.2 204.7 25.7 202.6 C 24.9 199.2 25.1 196.4 26.1 194.6 C 26.9 193.2 26.9 192.3 26.1 192.3 C 25.3 192.3 24.8 193.0 24.2 194.9 C 23.7 196.3 23.7 196.3 23.5 194.6 C 23.0 190.4 23.8 187.0 25.5 186.2 C 29.1 184.5 30.0 184.4 30.8 185.8 C 31.3 186.6 31.4 187.0 31.4 188.7 C 31.5 190.6 31.5 190.6 33.5 190.4 C 36.4 190.2 38.1 187.2 38.1 182.3 C 38.1 181.8 38.3 180.9 38.4 180.2 C 38.9 178.3 38.9 177.6 38.2 177.0 C 37.3 176.2 37.0 175.1 37.2 173.3 C 37.9 168.8 36.9 166.8 35.6 169.8 C 34.6 172.2 32.3 173.5 33.3 171.1 C 33.7 170.1 33.6 169.0 33.1 169.0 C 32.1 169.0 29.8 171.9 29.0 174.2 C 28.6 175.4 28.5 175.5 28.4 174.9 C 27.8 172.0 29.1 168.0 31.5 165.4 C 32.6 164.2 32.7 163.8 32.2 162.2 C 32.0 161.3 32.0 161.3 33.7 161.2 C 35.5 161.1 35.3 161.3 38.0 157.1 C 39.6 154.6 41.0 153.1 43.2 151.4 C 44.3 150.5 45.0 149.7 45.9 148.3 C 47.3 146.1 48.2 145.0 49.4 144.2 C 50.4 143.5 50.6 142.8 50.1 141.2 C 49.7 139.8 49.8 139.5 50.5 139.7 C 51.4 140.0 51.5 138.6 50.7 137.9 C 49.8 137.1 47.5 134.0 46.2 131.8 C 43.7 127.3 43.3 130.6 45.8 135.5 C 47.1 138.2 45.7 140.6 44.1 138.3 C 43.8 137.9 43.4 137.6 43.1 137.6 C 42.6 137.6 41.8 136.9 41.5 136.2 C 40.4 133.7 39.8 138.3 40.8 141.3 C 41.5 143.4 40.0 143.5 39.0 141.4 C 38.0 139.3 37.7 139.7 37.9 143.1 C 38.0 146.3 37.8 147.7 36.8 150.7 C 36.3 152.3 36.3 152.3 36.2 149.7 C 36.1 146.0 35.9 145.6 34.7 145.9 C 33.3 146.2 33.3 146.3 33.9 150.3 C 34.1 152.3 33.8 154.3 32.6 156.4 C 31.6 158.4 31.5 158.4 31.6 156.1 C 31.7 153.0 31.3 151.8 29.7 151.4 C 29.4 151.3 28.9 150.9 28.7 150.5 C 28.2 149.7 27.6 149.7 27.5 150.5 C 27.2 152.1 26.4 152.9 25.2 152.7 C 23.7 152.4 23.4 153.0 23.4 156.3 C 23.4 158.8 23.4 158.8 22.3 156.5 C 20.9 153.6 20.8 151.1 21.8 148.4 C 22.4 146.7 22.4 146.3 21.9 144.8 C 21.1 142.3 19.7 144.0 19.6 147.6 C 19.5 149.6 19.5 149.6 18.9 148.5 C 17.3 145.5 17.1 141.6 18.6 138.9 C 20.2 136.0 19.3 132.7 17.4 134.4 C 16.5 135.2 16.4 135.1 16.7 133.3 C 17.5 129.6 18.6 128.0 20.2 128.4 C 21.5 128.7 22.2 128.7 23.3 128.4 C 24.5 128.1 24.7 128.4 24.8 131.7 C 25.1 137.9 26.1 137.2 29.1 128.7 C 29.6 127.4 30.0 126.2 30.2 125.9 C 31.0 124.7 30.5 124.0 28.9 124.0 C 26.3 124.0 22.6 121.8 24.4 121.3 C 27.7 120.4 30.0 118.1 31.2 114.6 C 32.1 111.9 32.0 111.8 29.1 111.8 C 26.4 111.9 25.8 111.5 24.9 109.7 C 24.6 109.0 23.8 106.5 23.8 106.1 C 23.8 106.0 24.3 106.4 24.9 107.0 C 27.0 109.1 28.2 108.3 27.1 105.7 C 26.1 103.6 25.9 100.6 26.5 98.3 C 27.2 95.9 26.9 95.1 25.8 95.9 C 25.0 96.4 24.4 96.0 24.0 94.8 C 23.7 93.8 23.0 93.5 22.6 94.3 C 22.0 95.8 20.1 95.5 18.7 93.8 C 17.8 92.8 17.7 92.3 18.2 92.3 C 19.9 92.3 21.3 89.4 20.5 87.8 C 20.3 87.5 20.3 87.0 20.3 85.9 C 20.4 84.7 20.4 84.4 20.1 83.9 C 19.8 83.4 19.7 83.0 19.7 81.6 C 19.7 78.9 18.2 79.4 17.3 82.4 C 16.8 83.9 16.5 84.2 16.5 83.4 C 16.5 83.1 16.4 82.9 16.3 82.9 C 16.0 82.9 16.0 82.4 16.0 80.1 C 16.0 77.9 16.1 77.4 16.2 77.4 C 16.4 77.4 16.5 77.1 16.6 76.7 C 16.8 75.6 17.8 74.2 18.7 73.8 C 19.5 73.4 19.6 73.4 19.6 72.3 C 19.6 71.3 19.6 71.2 19.9 71.4 C 20.7 72.0 21.2 71.9 21.4 71.1 C 22.0 68.7 21.3 67.5 19.4 67.7 C 18.0 67.9 18.0 67.9 19.0 65.7 C 20.4 62.8 21.6 62.2 23.1 63.6 C 24.1 64.6 24.2 64.6 24.9 63.5 C 25.9 62.0 25.6 60.3 23.9 59.1 C 23.0 58.3 23.6 57.0 24.8 57.0 C 24.9 57.0 25.0 56.8 25.0 56.5 C 25.0 56.1 25.2 56.0 25.9 56.0 C 26.5 56.0 26.7 56.1 26.7 56.5 C 26.7 56.8 26.8 57.0 27.0 57.0 C 27.4 57.0 28.5 59.2 28.8 60.4 C 28.9 61.3 29.0 61.5 29.4 61.5 C 30.0 61.5 31.1 63.2 31.4 64.7 C 31.8 66.4 31.4 67.7 29.6 70.0 C 27.2 73.0 26.7 75.4 28.3 76.5 C 29.8 77.5 34.8 84.2 35.1 85.6 C 35.4 86.9 35.5 87.0 36.1 87.2 C 36.5 87.3 37.4 87.9 38.2 88.5 C 40.0 89.9 40.0 89.9 40.8 88.5 C 41.2 87.9 41.6 87.4 41.7 87.4 C 42.1 87.4 41.8 85.9 41.2 84.6 C 39.1 80.4 40.8 74.8 44.1 74.8 C 45.8 74.8 46.4 76.2 45.5 78.3 C 44.7 80.1 44.9 80.6 46.2 80.6 C 49.1 80.6 49.5 80.1 48.3 77.4 C 47.0 74.4 46.8 73.5 46.8 71.7 C 46.8 70.3 46.7 69.9 46.4 69.6 C 46.1 69.2 45.4 66.1 45.5 65.5 C 45.7 64.8 47.0 63.7 49.0 62.4 C 50.5 61.5 50.7 61.2 50.9 60.5 C 51.2 59.0 52.5 58.5 56.7 57.9 C 59.4 57.6 59.4 57.6 61.3 59.7 C 63.3 62.1 63.2 62.1 64.6 61.0 C 67.0 59.1 68.1 60.5 67.2 64.4 C 66.7 66.3 66.7 67.4 67.2 67.9 C 67.4 68.2 68.0 69.5 68.6 70.9 C 70.8 76.8 74.2 76.9 72.6 70.9 C 72.2 69.3 72.2 69.4 72.8 68.8 C 73.9 67.7 74.9 68.4 75.7 70.7 C 76.6 73.5 77.3 71.4 76.5 68.1 C 75.4 63.6 76.4 60.6 78.3 62.6 C 81.5 66.1 82.6 70.7 81.2 75.8 C 80.6 78.2 80.6 78.5 81.4 79.0 C 82.2 79.5 83.1 80.8 83.4 81.8 C 83.5 82.2 83.6 82.5 83.8 82.5 C 84.2 82.5 84.1 87.6 83.7 87.8 C 83.4 87.9 83.2 87.7 83.0 86.9 C 81.7 83.1 79.3 83.8 78.3 88.3 C 77.5 91.5 76.5 92.4 74.9 91.1 C 72.9 89.5 72.2 96.2 73.6 103.6 C 74.7 109.8 77.1 105.9 77.1 97.8 C 77.1 95.7 77.1 93.9 77.2 93.9 C 77.4 93.9 78.6 98.3 78.9 100.0 C 79.6 104.5 78.8 108.6 76.8 111.1 C 76.1 111.9 76.0 112.8 76.6 115.6 C 76.8 116.6 76.9 117.5 76.8 118.9 C 76.7 119.9 76.6 121.6 76.6 122.7 C 76.5 123.9 76.5 124.6 76.6 124.6 C 77.0 124.6 78.4 127.4 78.7 128.4 C 79.4 131.6 78.1 135.3 75.9 136.9 C 75.1 137.5 75.1 137.5 74.8 139.6 C 73.8 147.1 72.3 150.1 69.4 150.5 C 67.9 150.7 67.6 151.6 68.3 153.5 C 68.8 154.5 68.6 154.7 67.0 154.7 C 66.3 154.7 66.2 154.8 66.2 155.3 C 66.2 160.1 69.3 162.5 69.4 157.8 C 69.5 154.9 70.1 153.7 70.7 155.2 C 71.2 156.3 72.5 157.0 74.2 157.0 C 75.9 157.0 76.2 156.2 75.6 153.3 C 75.4 152.5 75.7 152.7 76.5 154.0 C 77.3 155.2 77.4 156.6 77.0 157.8 C 76.5 159.0 76.6 159.8 77.4 160.4 C 79.0 161.5 80.1 164.2 80.1 167.2 C 80.1 168.7 80.1 168.7 79.4 167.7 C 78.2 165.8 75.9 166.3 76.0 168.4 C 76.1 170.2 79.8 171.6 80.1 170.0 C 80.1 169.6 80.8 169.5 80.8 170.0 C 80.8 170.1 80.3 171.2 79.8 172.3 C 78.5 174.6 78.5 175.0 79.4 176.6 C 80.8 178.9 81.4 179.5 82.3 179.3 C 83.2 179.1 83.2 179.1 83.1 180.4 C 82.9 182.2 82.4 183.2 81.7 183.2 C 80.9 183.2 80.9 184.2 81.7 187.7 C 82.0 189.2 82.3 190.5 82.3 190.5 C 82.3 191.0 80.5 192.3 79.9 192.3 C 78.9 192.3 79.0 193.4 80.1 195.4 C 81.1 197.1 81.1 197.0 79.6 198.3 C 78.6 199.1 78.4 199.2 77.3 199.0 C 76.2 198.7 76.2 198.7 76.2 199.7 C 76.2 200.3 76.1 200.7 76.0 200.7 C 75.9 200.7 75.8 201.4 75.8 202.2 C 75.8 206.2 74.3 208.8 71.9 208.8 C 70.8 208.8 70.8 208.6 71.7 207.0 C 72.8 204.8 72.9 202.3 71.9 202.3 C 71.4 202.3 71.0 203.0 70.5 204.5 C 70.1 206.1 69.5 206.7 68.2 206.7 C 66.5 206.7 66.2 207.4 66.3 211.3 C 66.3 212.8 66.3 214.0 66.2 214.0 C 66.2 214.0 66.1 213.8 66.1 213.6 Z M 53.4 170.6 C 53.7 170.3 54.2 169.7 54.4 169.2 C 54.6 168.7 55.0 168.3 55.2 168.3 C 55.6 168.3 55.6 168.3 55.6 164.0 C 55.6 158.9 55.5 158.7 53.9 160.6 C 53.1 161.5 53.0 161.5 52.0 161.3 C 50.6 161.1 50.5 161.7 51.4 163.8 C 52.1 165.6 52.3 166.6 52.1 169.1 C 52.0 171.6 52.2 171.8 53.4 170.6 Z M 68.2 144.0 C 71.2 142.1 71.4 136.4 68.6 132.2 C 67.0 129.9 65.6 127.0 65.0 124.7 C 64.8 123.7 64.5 122.8 64.4 122.7 C 64.0 122.2 64.4 116.7 64.8 115.2 C 65.7 112.3 67.7 109.6 69.7 108.4 C 70.5 108.0 70.5 108.0 70.1 103.9 C 69.2 96.4 69.5 91.8 71.0 88.5 C 71.5 87.3 71.5 86.4 71.2 84.7 C 70.9 83.3 70.8 81.4 71.1 79.5 C 71.4 77.6 71.4 77.7 69.6 77.9 C 68.1 78.1 68.1 78.1 68.2 81.2 C 68.3 85.2 68.2 87.7 67.5 90.7 C 66.8 94.0 66.9 96.8 67.9 103.0 C 68.1 104.2 66.1 104.2 65.5 102.9 C 64.9 101.8 64.4 102.2 64.0 104.4 C 62.6 111.2 62.3 121.0 63.5 122.6 C 64.3 123.6 63.0 124.0 61.8 123.2 C 60.2 122.1 60.2 123.8 61.7 130.5 C 64.2 141.8 66.0 145.5 68.2 144.0 Z M 73.4 119.1 C 73.4 116.6 73.0 115.5 72.3 115.6 C 70.9 115.9 71.4 121.6 72.8 121.3 C 73.4 121.2 73.4 121.2 73.4 119.1 Z M 30.1 107.4 C 30.1 107.3 30.1 106.2 29.9 105.0 C 29.8 103.3 29.8 102.3 29.9 100.9 C 30.2 98.3 30.2 98.1 29.7 98.1 C 28.9 98.1 28.1 101.6 27.9 105.3 C 27.9 107.7 29.2 109.0 30.1 107.4 Z M 48.2 93.7 C 48.4 93.6 48.5 93.1 48.5 92.6 C 48.5 90.9 47.1 90.0 46.4 91.2 C 46.1 91.7 46.1 91.7 46.1 90.9 C 46.1 88.8 47.2 87.9 49.1 88.2 C 50.8 88.4 51.4 87.9 51.4 85.8 C 51.4 84.2 50.7 84.1 48.0 85.7 C 47.3 86.1 46.2 86.7 45.6 87.0 C 44.5 87.5 44.5 87.3 44.3 91.1 C 44.1 93.3 46.6 94.9 48.2 93.7 Z M 52.1 79.6 C 53.4 79.6 53.4 79.6 53.4 78.8 C 53.4 76.8 51.2 76.0 50.0 77.6 C 49.0 78.9 49.0 80.1 50.1 79.8 C 50.5 79.7 51.5 79.6 52.1 79.6 Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'stag':
            o += '<path d="' + 'M 48.6 209.0 C 47.1 208.0 45.8 205.1 45.8 202.8 C 45.8 202.4 45.6 201.8 45.4 201.5 C 44.7 200.4 44.6 199.3 44.6 196.1 C 44.5 189.2 43.7 184.3 41.3 177.3 C 39.6 172.0 39.0 169.5 38.8 166.0 C 38.7 164.5 38.5 162.5 38.4 161.5 C 38.2 160.3 38.1 159.2 38.2 157.7 C 38.3 155.4 38.4 155.4 36.3 156.2 C 29.5 158.8 23.6 152.4 22.0 140.6 C 21.2 134.5 21.9 133.2 24.1 136.6 C 26.3 140.0 27.3 140.6 31.3 141.2 C 34.5 141.6 35.3 141.9 37.1 143.2 C 39.0 144.7 39.0 144.7 39.5 142.8 C 39.7 141.9 39.9 141.0 40.1 140.8 C 41.0 139.3 39.8 136.7 36.1 132.3 C 34.7 130.7 33.1 128.6 32.4 127.5 C 31.0 125.3 30.6 125.2 29.5 126.5 C 27.3 128.9 25.6 127.7 22.5 121.9 C 20.3 117.6 20.3 117.6 19.2 117.1 C 17.7 116.5 17.5 116.1 18.0 115.3 C 19.4 113.2 21.1 113.7 23.4 116.8 C 27.1 122.0 28.9 121.2 27.3 115.0 C 27.0 113.8 26.6 112.1 26.4 111.2 C 25.7 107.4 24.9 105.6 23.1 103.9 C 21.1 102.0 20.3 99.3 20.0 93.6 C 19.8 89.5 19.5 88.7 17.5 86.3 C 16.7 85.4 16.9 84.8 17.9 84.8 C 20.1 84.8 21.5 87.3 22.2 92.3 C 22.8 96.5 23.1 97.4 23.9 97.4 C 24.7 97.4 24.7 97.5 24.4 90.8 C 24.2 84.2 24.2 84.1 22.9 82.8 C 21.5 81.5 21.2 80.4 20.8 76.2 C 20.5 72.6 20.3 71.7 19.2 69.4 C 18.2 67.5 18.3 66.9 19.7 67.0 C 21.1 67.0 22.1 68.8 22.9 72.8 C 23.7 77.1 23.9 77.7 25.1 77.7 C 26.8 77.7 27.5 76.3 29.0 68.5 C 30.0 63.8 31.0 62.0 32.9 62.0 C 34.5 62.0 34.8 63.4 33.5 64.1 C 31.9 64.9 31.6 65.7 31.0 71.2 C 30.5 75.7 30.0 77.7 28.7 80.4 C 28.2 81.5 27.7 82.7 27.6 83.2 C 26.9 85.5 27.8 91.7 28.5 89.7 C 28.7 89.1 29.8 88.1 30.9 87.7 C 32.4 87.1 32.8 86.6 34.0 83.2 C 35.1 79.8 36.1 78.3 37.1 78.3 C 38.2 78.3 38.4 79.7 37.5 80.3 C 36.7 80.8 36.4 81.8 35.7 85.8 C 34.7 91.3 34.4 92.0 31.8 94.1 C 28.5 96.9 28.0 98.8 28.9 104.5 C 30.4 113.0 32.7 119.2 36.3 123.8 C 38.0 126.1 38.2 126.1 38.8 124.0 C 39.1 123.1 39.8 121.6 40.3 120.7 C 42.1 117.7 42.2 116.3 41.2 110.4 C 40.1 104.4 40.6 99.5 42.2 100.1 C 42.4 100.2 42.4 100.4 42.2 103.3 C 42.1 105.0 42.3 105.7 43.7 109.7 C 45.7 115.1 45.7 118.5 43.9 124.4 C 42.5 129.0 42.8 135.4 44.4 134.6 C 44.6 134.5 45.4 134.0 46.2 133.6 C 47.5 133.0 47.7 133.0 48.9 133.3 C 49.9 133.7 50.4 133.7 51.5 133.3 C 52.6 133.0 52.9 133.0 54.2 133.6 C 56.2 134.6 56.4 134.6 56.9 133.2 C 57.6 131.4 57.5 128.2 56.4 124.8 C 54.5 118.1 54.5 115.2 56.8 109.0 C 58.1 105.4 58.3 104.3 58.0 102.1 C 57.6 99.3 58.7 99.4 59.5 102.3 C 60.0 104.2 59.9 106.2 59.1 110.6 C 58.1 116.0 58.3 117.8 59.9 120.6 C 60.5 121.4 61.1 122.9 61.4 123.9 C 62.9 129.0 69.3 116.6 71.3 104.6 C 72.3 98.8 71.7 96.8 68.3 94.0 C 65.8 91.9 65.5 91.3 64.5 85.1 C 63.9 81.8 63.6 81.0 62.8 80.3 C 61.7 79.4 62.4 78.0 63.7 78.5 C 64.5 78.8 65.2 80.1 66.3 83.2 C 67.5 86.4 68.0 87.2 69.4 87.7 C 70.0 87.9 70.8 88.5 71.2 88.9 C 72.5 90.4 72.7 90.1 72.9 86.2 C 73.0 83.8 72.8 83.1 71.5 80.2 C 70.2 77.5 69.8 75.8 69.3 71.3 C 68.7 66.0 68.0 64.1 66.7 64.1 C 66.1 64.1 65.9 63.2 66.2 62.5 C 67.7 59.6 70.2 63.1 71.6 70.0 C 72.8 76.2 73.5 77.7 75.3 77.7 C 76.2 77.7 76.7 76.6 77.2 73.9 C 78.1 68.5 79.2 66.7 81.2 67.0 C 82.0 67.1 81.9 67.9 81.0 69.8 C 79.9 71.9 79.6 73.0 79.4 76.6 C 79.2 80.2 78.9 81.2 77.3 82.9 C 76.1 84.3 76.1 84.4 76.0 86.0 C 75.2 97.7 76.6 102.2 78.0 92.7 C 78.9 86.9 80.2 84.5 82.6 84.9 C 83.5 85.0 83.4 85.5 82.1 87.1 C 80.8 88.9 80.5 89.8 80.3 94.0 C 79.9 99.9 79.2 101.9 76.9 104.2 C 75.3 105.8 74.7 107.3 73.7 111.9 C 73.4 113.5 72.9 115.4 72.7 116.2 C 71.3 121.0 73.6 121.6 76.6 117.2 C 78.7 114.1 80.2 113.4 81.8 114.7 C 83.0 115.8 82.8 116.6 81.3 117.0 C 80.2 117.3 79.8 117.8 77.7 122.0 C 74.7 127.8 73.1 128.9 70.8 126.5 C 69.7 125.3 69.1 125.3 68.4 126.6 C 68.0 127.5 66.0 130.1 62.6 134.2 C 59.9 137.5 59.5 138.8 60.5 141.7 C 60.8 142.7 61.1 143.7 61.1 144.0 C 61.1 144.7 61.8 144.4 63.0 143.4 C 64.5 142.1 65.8 141.6 69.0 141.2 C 73.0 140.6 73.9 140.0 76.0 136.8 C 78.5 133.0 79.1 134.2 78.2 140.6 C 76.6 152.6 71.0 158.7 63.9 156.2 C 61.9 155.5 62.1 155.3 62.1 158.5 C 62.1 160.4 62.0 161.7 61.7 162.9 C 61.6 163.9 61.4 165.3 61.4 166.2 C 61.4 169.4 61.0 171.1 58.6 178.4 C 56.8 183.8 56.6 184.6 56.0 190.2 C 55.7 193.2 55.7 194.7 55.7 196.4 C 55.8 198.7 55.5 200.9 54.9 201.6 C 54.7 201.7 54.5 202.6 54.4 203.6 C 53.9 208.0 51.0 210.6 48.6 209.0 Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'eagle':
            o += '<path d="' + 'M 49.0 205.6 C 48.7 205.3 48.4 204.7 48.3 204.3 C 48.2 204.0 47.8 203.5 47.5 203.3 C 46.6 202.9 45.9 200.1 46.8 200.1 C 47.1 200.1 48.0 194.6 48.2 191.1 C 48.4 188.9 47.9 188.2 47.3 189.6 C 47.1 189.9 46.6 190.7 46.2 191.4 C 44.3 194.3 44.0 197.9 45.7 198.6 C 46.2 198.9 46.2 199.1 45.5 200.1 C 43.5 202.6 41.2 199.4 41.2 194.0 C 41.2 191.7 41.2 191.7 39.4 192.3 C 36.8 193.4 33.7 190.8 32.6 186.7 C 31.1 181.1 33.4 172.7 36.0 174.0 C 37.1 174.5 37.6 176.8 36.7 176.8 C 35.1 176.8 34.9 182.1 36.4 184.3 C 38.1 186.7 39.9 186.2 38.7 183.7 C 38.1 182.5 38.0 180.8 38.4 179.5 C 38.6 178.7 38.6 178.1 38.5 177.4 C 37.9 171.1 38.6 169.0 42.0 168.4 C 44.8 167.9 46.7 164.5 44.2 164.5 C 43.0 164.5 42.2 163.9 41.6 162.5 C 40.8 160.8 41.0 160.1 42.1 160.2 C 43.3 160.3 44.0 159.5 44.7 156.9 C 45.4 154.5 45.4 153.5 44.7 153.5 C 44.2 153.5 43.9 153.2 43.5 152.5 C 42.2 150.4 36.4 157.0 36.4 160.5 C 36.4 161.3 36.7 161.5 37.8 161.6 C 39.4 161.6 40.3 163.3 39.8 165.4 C 39.5 167.0 39.2 167.3 39.0 166.3 C 38.8 165.3 37.9 165.0 37.9 165.9 C 37.9 167.9 36.3 168.6 35.3 167.1 C 34.5 165.8 34.3 165.8 33.4 167.5 C 32.8 168.7 32.5 169.0 31.6 169.4 C 30.1 170.1 29.6 170.6 29.5 172.2 C 29.2 175.8 29.0 176.4 27.7 176.4 C 27.0 176.4 27.0 176.5 27.1 177.5 C 27.1 178.4 27.1 178.6 26.7 178.6 C 25.5 178.9 24.9 175.6 25.8 173.6 C 26.4 172.2 26.3 170.9 25.7 170.0 C 25.0 169.0 24.4 169.2 24.4 170.5 C 24.3 171.8 24.1 171.9 23.6 170.8 C 23.0 169.8 23.0 168.0 23.5 167.1 C 23.9 166.3 23.9 165.2 23.6 164.3 C 22.3 161.1 25.5 159.2 28.2 161.5 C 30.4 163.5 30.9 163.1 34.6 156.0 C 37.9 149.7 38.0 149.1 36.5 148.8 C 35.1 148.6 34.4 147.3 34.4 145.2 C 34.4 144.5 34.9 142.7 35.1 143.1 C 35.1 143.2 35.2 143.7 35.4 144.2 C 36.3 147.5 38.5 144.9 40.1 138.6 C 40.8 136.1 41.1 135.4 43.0 131.9 C 45.4 127.4 45.4 127.3 44.5 121.8 C 43.8 117.9 43.3 117.9 43.1 121.8 C 43.0 126.2 42.4 129.3 41.6 130.3 C 41.1 131.0 41.0 130.9 41.0 129.7 C 41.0 127.9 40.3 128.1 39.9 130.0 C 38.3 137.3 33.9 143.9 32.3 141.5 C 31.7 140.6 31.7 139.7 32.4 138.2 C 33.1 136.8 34.2 132.8 34.2 131.8 C 34.2 130.2 33.5 131.1 32.3 134.1 C 28.3 144.6 22.7 150.1 20.5 145.7 C 19.8 144.2 20.0 143.4 21.5 142.0 C 23.0 140.6 24.5 138.2 24.5 137.1 C 24.5 136.0 24.0 136.0 23.1 137.1 C 21.6 138.9 20.5 138.5 21.9 136.6 C 25.1 132.2 25.8 129.2 23.2 130.8 C 21.4 131.9 19.8 131.6 18.9 130.1 C 18.3 128.9 18.6 126.6 19.4 126.6 C 20.3 126.6 23.1 123.2 23.1 122.1 C 23.1 121.3 23.0 121.2 21.7 121.9 C 19.0 123.2 18.9 122.4 21.3 120.2 C 23.9 117.8 23.9 117.0 21.6 116.8 C 18.4 116.5 16.3 112.4 19.1 111.9 C 20.6 111.6 20.9 110.1 19.5 110.1 C 18.8 110.1 18.0 109.4 18.0 108.8 C 18.0 108.7 18.5 108.4 19.0 108.2 C 22.0 106.9 22.8 105.4 20.9 104.8 C 18.5 104.2 17.2 101.1 17.9 97.5 C 18.1 96.4 18.3 96.2 18.6 97.0 C 19.1 98.2 21.3 98.5 21.3 97.4 C 21.3 96.7 21.1 96.5 20.1 96.0 C 19.0 95.4 18.7 95.0 17.9 93.6 C 17.5 92.8 17.2 91.4 17.4 91.1 C 17.4 91.0 17.9 91.3 18.4 91.8 C 20.3 93.7 21.9 92.8 20.3 90.7 C 18.4 88.2 17.5 83.6 18.5 81.7 C 19.0 80.6 19.3 80.7 20.2 82.2 C 21.1 83.7 21.8 84.0 21.8 82.8 C 21.8 82.3 21.7 81.8 21.5 81.6 C 21.0 80.7 20.3 77.4 20.7 77.4 C 20.8 77.4 21.2 78.1 21.7 79.0 C 23.1 81.4 24.1 80.9 23.1 78.3 C 21.3 73.4 22.3 67.6 24.3 71.3 C 26.9 76.0 27.4 76.2 27.4 72.8 C 27.4 69.6 28.1 67.7 29.2 67.7 C 29.7 67.7 29.7 67.8 29.2 69.0 C 28.1 71.5 28.9 74.0 31.7 76.7 C 35.6 80.5 36.0 82.4 33.7 86.9 C 29.4 95.4 32.8 105.0 38.5 100.4 C 39.4 99.7 40.4 99.0 40.7 98.9 C 41.4 98.6 41.5 98.3 41.1 96.3 C 40.8 95.0 40.9 93.8 41.2 93.0 C 41.4 92.4 41.8 92.5 41.8 93.1 C 41.8 94.4 42.8 95.6 43.8 95.4 C 47.4 94.7 51.3 84.0 48.2 83.4 C 47.1 83.2 44.7 83.6 44.4 84.0 C 44.0 84.5 43.9 83.8 44.1 82.7 C 44.7 80.3 44.3 79.7 43.0 80.8 C 41.6 81.8 40.3 81.3 39.3 79.2 C 38.5 77.3 38.6 76.2 39.5 77.4 C 40.9 79.3 42.6 78.3 41.7 76.2 C 40.4 73.1 41.4 68.4 43.4 67.8 C 43.8 67.7 44.0 67.4 44.0 67.2 C 44.1 64.7 45.9 63.6 49.6 63.9 C 52.8 64.2 53.4 63.9 53.9 62.1 C 54.2 61.0 54.3 61.0 54.7 62.0 C 55.0 62.8 55.0 63.6 54.7 66.2 C 54.6 67.0 54.7 67.6 55.0 68.7 C 55.7 71.1 56.0 71.3 57.1 71.1 C 58.3 70.9 58.4 71.1 57.6 72.7 C 57.2 73.5 56.8 73.8 56.5 73.8 C 55.8 73.8 55.8 74.9 56.3 77.2 C 56.6 78.7 57.0 79.2 57.8 78.8 C 58.3 78.6 58.3 78.7 58.3 79.3 C 58.3 80.5 57.6 81.6 56.7 81.6 C 55.9 81.6 55.9 81.6 56.0 85.4 C 56.1 90.9 56.6 93.0 57.9 94.1 C 58.6 94.6 58.7 95.0 58.0 95.3 C 57.1 95.6 55.3 94.5 55.3 93.5 C 55.3 92.5 54.3 93.3 54.0 94.6 C 53.5 97.0 53.6 97.2 54.7 97.0 C 56.2 96.7 57.4 97.3 59.8 99.4 C 66.5 105.6 71.2 96.6 66.3 86.9 C 64.0 82.4 64.4 80.5 68.3 76.7 C 71.1 74.0 71.9 71.7 70.8 69.1 C 70.3 67.8 70.3 67.7 70.8 67.7 C 71.9 67.7 72.6 69.6 72.6 72.8 C 72.6 76.2 73.1 76.0 75.7 71.3 C 77.6 67.8 78.6 72.8 77.0 77.8 C 76.0 81.0 76.7 81.7 78.3 79.0 C 78.8 78.1 79.2 77.4 79.3 77.4 C 79.7 77.4 79.0 80.7 78.5 81.6 C 78.3 81.8 78.2 82.3 78.2 82.8 C 78.2 84.0 78.9 83.7 79.8 82.2 C 80.7 80.7 81.2 80.7 81.7 82.1 C 82.4 84.0 81.5 88.0 79.8 90.4 C 78.2 92.8 79.6 93.9 81.6 91.8 C 82.6 90.9 82.7 90.9 82.6 92.0 C 82.3 94.0 80.3 96.5 78.9 96.5 C 78.7 96.5 78.6 96.7 78.6 97.3 C 78.6 98.5 81.1 98.2 81.4 96.9 C 81.7 95.5 82.3 97.4 82.3 99.7 C 82.3 102.2 81.0 104.3 79.1 104.8 C 77.1 105.4 78.3 107.3 81.3 108.3 C 82.4 108.7 81.8 110.1 80.5 110.1 C 79.0 110.1 79.4 111.6 80.9 111.9 C 83.7 112.4 81.6 116.5 78.4 116.8 C 76.1 117.0 76.2 117.8 78.6 120.1 C 81.1 122.5 81.0 123.2 78.3 121.9 C 77.0 121.2 76.9 121.3 76.9 122.1 C 76.9 123.1 78.7 125.5 80.2 126.3 C 81.1 126.8 81.3 127.1 81.4 127.7 C 81.8 130.8 79.5 132.4 76.8 130.8 C 75.4 129.9 75.2 130.0 75.2 130.9 C 75.2 131.7 77.0 135.3 78.3 136.9 C 78.6 137.3 78.9 137.8 78.9 138.0 C 78.9 138.6 77.5 138.0 76.9 137.1 C 76.0 136.0 75.5 136.0 75.5 137.1 C 75.5 138.2 77.0 140.7 78.5 142.0 C 80.0 143.3 80.2 144.2 79.5 145.7 C 77.2 150.1 71.4 144.2 67.4 133.5 C 66.5 131.1 65.8 130.3 65.8 131.8 C 65.8 132.8 67.1 137.3 67.7 138.4 C 68.3 139.5 68.3 140.3 67.8 141.3 C 66.2 144.2 61.8 137.6 60.0 129.7 C 59.5 127.2 58.7 127.0 58.9 129.3 C 59.0 131.0 58.9 131.1 58.3 130.1 C 57.4 128.8 56.9 124.6 56.7 117.5 C 56.5 110.8 55.8 111.3 54.6 119.0 C 53.5 125.7 53.8 127.7 56.3 131.3 C 58.8 134.8 58.9 135.1 59.8 138.4 C 61.6 145.0 63.7 147.6 64.6 144.2 C 64.8 143.7 64.9 143.2 64.9 143.1 C 65.1 142.7 65.6 144.5 65.6 145.2 C 65.6 147.3 64.9 148.6 63.5 148.8 C 62.0 149.1 62.2 149.7 65.1 155.5 C 68.9 163.0 69.5 163.4 71.7 161.6 C 74.6 159.2 77.7 161.1 76.4 164.3 C 76.1 165.2 76.1 166.3 76.5 167.1 C 77.0 168.0 77.0 169.8 76.4 170.8 C 75.9 171.9 75.7 171.8 75.6 170.5 C 75.6 169.2 75.0 169.0 74.3 170.0 C 73.7 170.9 73.6 172.2 74.2 173.6 C 75.1 175.6 74.5 178.9 73.3 178.6 C 72.9 178.6 72.9 178.4 72.9 177.5 C 73.0 176.5 73.0 176.4 72.3 176.4 C 71.0 176.4 70.8 175.8 70.5 172.3 C 70.3 170.6 70.0 170.1 68.4 169.4 C 67.5 169.0 67.2 168.7 66.6 167.5 C 65.7 165.8 65.5 165.8 64.7 167.1 C 63.7 168.6 62.1 167.9 62.1 165.9 C 62.1 165.0 61.2 165.3 61.0 166.3 C 60.8 167.4 60.3 166.6 60.1 164.9 C 59.9 162.9 60.7 161.5 62.2 161.5 C 63.8 161.5 64.1 160.4 63.0 158.8 C 62.7 158.3 61.9 156.8 61.2 155.5 C 60.1 153.6 59.7 153.0 58.7 152.3 C 57.2 151.3 57.2 151.3 56.5 152.5 C 56.1 153.2 55.8 153.5 55.3 153.5 C 54.6 153.5 54.6 154.5 55.3 156.9 C 56.0 159.4 56.7 160.3 57.9 160.3 C 59.0 160.3 59.1 160.8 58.4 162.5 C 57.8 163.9 57.0 164.5 55.8 164.5 C 54.8 164.5 54.8 164.5 54.8 165.2 C 54.8 166.6 56.3 168.3 57.6 168.3 C 61.0 168.4 62.1 170.9 61.5 177.5 C 61.4 178.3 61.4 178.9 61.6 179.5 C 62.0 180.6 61.9 182.6 61.3 183.6 C 60.2 185.7 61.3 186.6 62.9 184.9 C 65.0 182.9 65.3 176.8 63.3 176.8 C 62.6 176.8 62.6 176.1 63.2 175.0 C 64.9 171.7 67.8 176.3 67.8 182.3 C 67.8 189.2 64.1 194.0 60.3 192.2 C 58.6 191.4 58.7 191.3 58.7 194.2 C 58.8 199.7 56.3 202.9 54.4 199.8 C 53.9 199.0 53.9 199.0 54.6 198.4 C 56.0 197.2 55.7 194.7 53.8 191.4 C 51.3 187.2 50.9 191.3 53.0 199.4 C 53.7 202.2 53.7 202.6 52.6 203.3 C 52.2 203.6 51.7 204.1 51.6 204.5 C 51.0 206.2 49.9 206.6 49.0 205.6 Z M 42.1 179.0 C 43.9 177.3 45.4 173.2 44.0 173.7 C 43.7 173.8 42.8 174.0 42.1 174.2 C 39.7 174.7 39.3 175.2 39.3 177.3 C 39.3 179.7 40.6 180.5 42.1 179.0 Z M 60.4 179.1 C 61.4 177.4 60.4 174.7 58.7 174.4 C 55.3 173.7 55.6 173.7 55.6 174.6 C 55.6 177.4 59.3 181.0 60.4 179.1 Z M 46.0 150.8 C 46.6 146.2 46.6 143.7 46.0 143.8 C 44.7 144.1 44.1 153.1 45.3 153.1 C 45.6 153.1 45.7 152.8 46.0 150.8 Z M 55.2 152.3 C 55.6 149.0 54.9 143.7 54.0 143.7 C 53.4 143.7 53.5 146.4 54.0 150.8 C 54.3 153.4 55.0 154.2 55.2 152.3 Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'wolf':
            o += '<path d="' + 'M 40.8 187.4 C 40.5 186.9 40.2 185.9 40.0 185.3 C 39.9 184.6 39.6 183.7 39.4 183.3 C 39.3 182.9 39.1 182.2 39.1 181.9 C 39.1 181.2 38.8 181.1 37.9 181.6 C 37.2 182.0 36.9 182.7 36.9 184.2 C 36.9 185.5 36.6 185.4 36.1 183.9 C 35.7 182.7 35.6 180.8 36.0 179.8 C 36.4 178.8 36.3 176.2 35.8 176.0 C 35.2 175.6 34.9 175.8 34.1 177.0 C 33.0 178.6 33.0 174.9 34.1 173.1 C 35.9 170.0 36.0 169.9 37.4 171.3 C 39.2 173.1 39.5 172.6 41.4 165.1 C 42.1 162.7 42.9 159.3 43.4 157.5 C 44.3 153.9 44.4 152.4 43.9 150.8 C 43.6 149.9 43.0 149.5 42.8 150.2 C 42.6 150.8 33.3 151.3 31.0 150.8 C 29.5 150.4 29.5 150.4 29.1 151.3 C 28.8 151.9 28.4 152.3 27.8 152.5 C 27.3 152.6 26.7 152.9 26.4 153.1 C 25.8 153.7 25.1 153.3 24.5 152.2 C 23.8 150.9 23.9 150.6 24.8 150.5 C 25.3 150.4 25.6 150.2 25.7 149.9 C 26.5 146.9 26.4 146.5 25.3 146.5 C 24.5 146.5 24.4 146.6 24.4 147.3 C 24.3 147.7 24.2 148.3 24.1 148.4 C 24.1 148.6 24.0 149.0 24.0 149.3 C 24.0 149.7 23.8 149.9 23.1 150.0 C 22.2 150.1 22.2 150.1 22.2 151.9 C 22.1 154.0 22.0 154.2 21.4 152.8 C 20.8 151.6 20.7 150.6 20.8 149.0 C 21.2 144.8 21.2 144.8 20.1 144.6 C 18.9 144.3 18.7 144.5 18.4 146.0 C 18.1 147.3 17.9 147.2 17.7 145.8 C 17.5 144.2 17.7 142.5 18.3 141.2 C 19.7 138.0 18.7 135.1 16.8 136.9 C 16.0 137.8 16.0 137.8 16.0 136.5 C 16.0 135.8 16.1 135.3 16.2 135.3 C 16.3 135.3 16.6 134.9 16.9 134.4 C 18.5 131.8 20.7 131.7 21.6 134.2 C 21.9 135.0 22.4 135.9 22.9 136.3 C 23.3 136.7 24.0 137.6 24.5 138.3 C 26.1 141.0 27.1 141.3 31.6 140.3 C 32.9 140.1 34.6 139.9 35.3 139.9 C 37.4 139.9 37.8 139.1 37.2 136.9 C 37.0 136.5 36.9 135.4 36.9 134.6 C 36.9 133.7 36.8 132.4 36.7 131.7 C 36.6 130.8 36.6 130.3 36.7 129.4 C 36.9 128.8 37.0 127.7 37.1 126.9 C 37.5 122.1 37.6 121.3 38.2 120.0 C 38.5 119.3 38.9 118.2 39.0 117.7 C 39.1 117.1 39.6 116.1 40.0 115.4 C 41.2 113.5 41.4 111.2 40.4 111.5 C 39.5 111.7 37.9 113.8 37.9 114.6 C 37.9 115.9 36.4 115.1 35.8 113.6 C 35.7 113.2 35.6 112.3 35.6 111.6 C 35.5 109.9 35.0 110.0 33.8 112.0 C 33.3 112.9 32.6 113.9 32.4 114.2 C 29.2 118.4 25.8 111.5 28.3 106.0 C 29.3 104.0 30.3 103.4 29.9 105.1 C 29.2 108.9 31.0 110.9 33.2 108.8 C 34.6 107.4 34.5 105.5 32.9 105.0 C 30.4 104.3 30.7 98.7 33.3 97.4 C 35.8 96.3 36.0 96.0 36.6 93.6 C 37.3 91.1 38.4 89.0 39.5 88.2 C 40.2 87.7 40.3 87.5 40.8 85.3 C 41.4 82.8 41.6 82.5 42.0 84.1 C 42.4 85.5 42.8 85.4 43.4 83.8 C 44.4 81.3 45.0 82.0 45.6 86.2 C 45.8 87.7 45.8 87.7 46.7 87.7 C 48.1 87.7 49.3 88.3 50.1 89.5 C 50.4 90.0 51.1 90.9 51.5 91.4 C 52.1 92.0 52.5 92.9 53.1 94.4 C 53.8 96.7 53.9 97.3 53.9 101.3 C 53.9 102.1 54.0 103.4 54.2 104.1 C 54.3 105.0 54.3 105.4 54.2 105.6 C 54.1 105.8 54.1 106.3 54.2 107.4 C 54.5 110.6 54.4 113.5 53.9 113.6 C 53.4 113.7 53.4 113.8 53.4 115.3 C 53.4 116.8 53.4 116.9 52.9 116.9 C 52.5 116.9 52.4 117.0 52.4 117.7 C 52.4 118.5 52.1 118.8 52.0 118.2 C 51.7 117.4 51.0 117.8 51.0 118.7 C 51.0 125.5 57.0 130.5 65.3 130.5 C 67.7 130.5 69.9 130.5 70.4 130.7 C 73.0 131.3 75.0 129.0 75.0 125.4 C 75.0 122.4 72.7 120.0 68.6 119.0 C 64.0 117.8 61.3 112.6 61.4 105.1 C 61.4 101.3 61.9 89.6 62.0 89.4 C 62.2 89.1 62.9 90.4 63.3 91.8 C 63.5 92.6 64.0 93.8 64.3 94.5 C 65.8 97.7 66.2 98.4 66.2 98.9 C 66.2 99.1 66.4 99.9 66.7 100.7 C 67.5 102.4 67.7 103.8 67.5 106.1 C 67.2 110.1 67.4 112.7 68.1 112.7 C 68.6 112.7 68.6 112.7 68.5 109.8 C 68.4 107.0 68.4 107.0 69.0 108.4 C 69.5 109.5 69.8 109.7 70.2 109.7 C 70.7 109.6 71.2 110.1 71.6 110.9 C 71.7 111.1 72.0 111.4 72.2 111.4 C 73.0 111.4 74.0 113.9 74.0 116.1 C 74.0 117.1 74.1 117.3 74.8 118.3 C 80.0 125.1 76.7 138.0 70.1 136.1 C 69.1 135.8 69.1 137.0 70.0 139.4 C 72.1 144.6 74.1 144.3 75.6 138.7 C 76.5 135.3 77.6 136.1 78.8 140.9 C 79.4 143.3 79.7 143.9 81.2 146.3 C 83.0 149.4 83.3 150.1 83.3 152.1 C 83.3 153.7 83.5 154.4 83.8 154.4 C 83.9 154.4 84.0 154.8 84.0 155.7 C 84.0 156.7 83.9 157.0 83.7 157.0 C 83.6 157.0 83.5 157.3 83.5 158.0 C 83.5 158.6 83.6 159.0 83.7 159.0 C 84.3 159.0 84.1 161.1 83.5 161.4 C 83.0 161.6 83.0 161.7 83.0 163.2 C 83.0 164.7 83.0 164.8 82.5 164.8 C 81.7 164.8 81.7 167.5 82.5 169.2 C 82.8 169.8 83.0 170.6 83.0 170.9 C 83.0 171.2 83.1 172.0 83.1 172.7 C 83.1 173.4 83.2 174.6 83.2 175.4 C 83.3 176.5 83.3 177.0 83.0 177.8 C 82.4 179.5 81.0 180.6 81.4 179.0 C 81.8 177.7 81.7 175.7 81.1 175.1 C 80.0 173.8 79.5 174.9 80.3 177.2 C 80.7 178.4 80.7 178.9 80.3 180.1 C 80.0 181.5 80.0 182.5 80.5 183.2 C 80.9 183.8 80.9 183.9 80.6 184.2 C 80.0 184.9 79.2 184.6 78.7 183.5 C 78.4 182.9 78.1 182.1 77.9 181.8 C 77.7 181.4 77.5 180.9 77.5 180.7 C 77.5 180.0 76.8 180.3 76.6 181.1 C 76.5 181.5 76.2 182.0 76.0 182.1 C 75.6 182.4 75.6 183.4 76.0 184.6 C 76.4 185.6 76.4 185.6 75.7 185.4 C 74.6 185.1 74.3 184.3 73.9 181.5 C 73.5 178.5 72.6 177.7 72.6 180.3 C 72.6 181.9 72.4 181.9 71.9 180.6 C 71.3 179.4 71.3 177.8 71.8 176.7 C 71.9 176.2 72.1 175.6 72.1 175.3 C 72.1 174.0 73.0 173.0 74.3 172.7 C 75.0 172.6 75.8 172.4 76.1 172.2 C 78.2 171.0 77.4 155.7 75.3 155.7 C 74.7 155.7 74.7 155.8 74.7 156.9 C 74.7 157.6 74.6 158.0 74.4 158.0 C 74.2 158.0 74.1 158.3 74.1 158.7 C 74.1 159.4 74.1 159.5 73.3 159.6 C 69.4 159.8 69.3 159.8 69.0 162.1 C 68.8 163.6 68.7 164.0 68.4 164.1 C 68.2 164.1 68.0 164.4 68.0 164.7 C 68.0 165.9 67.2 168.7 66.9 168.7 C 66.7 168.7 66.3 169.3 66.0 170.3 C 65.7 171.4 65.4 171.9 65.1 171.9 C 64.3 171.9 63.8 173.8 63.8 176.8 C 63.9 180.0 63.7 181.2 62.7 182.3 C 62.0 183.2 61.9 183.1 62.0 181.4 C 62.1 180.2 62.1 179.8 61.8 179.5 C 60.7 177.9 59.7 181.1 60.5 183.2 C 61.3 185.2 59.8 185.0 58.9 183.0 C 57.7 180.4 57.6 180.3 57.0 180.5 C 56.1 180.7 56.0 181.2 56.0 182.9 C 56.0 185.0 55.7 185.2 55.2 183.7 C 54.7 182.5 54.7 182.4 54.7 178.6 C 54.7 173.5 53.2 172.2 52.3 176.5 C 52.1 177.5 51.9 176.0 51.9 174.2 C 52.1 170.6 54.1 168.0 56.2 168.7 C 58.4 169.5 61.4 165.4 62.9 159.9 C 63.8 156.5 63.2 154.3 62.1 156.9 C 61.7 157.8 61.7 157.8 61.6 157.1 C 61.5 156.3 61.1 156.2 60.5 156.7 C 60.2 157.0 60.2 156.9 60.2 155.4 C 60.2 153.5 60.0 153.4 58.8 154.5 C 57.7 155.4 57.3 155.1 57.9 153.8 C 58.4 152.7 58.8 150.9 59.0 147.8 C 59.4 142.8 59.1 142.8 56.1 147.3 C 54.8 149.1 53.2 151.1 52.2 152.1 C 50.4 153.9 50.3 154.0 50.3 156.4 C 50.3 158.4 50.0 160.3 49.5 160.3 C 49.3 160.3 49.1 160.7 48.9 161.6 C 48.8 162.3 48.5 163.0 48.3 163.1 C 48.1 163.2 47.9 163.7 47.8 164.5 C 47.7 165.4 47.5 165.8 47.3 165.8 C 47.0 165.8 46.9 166.2 46.7 167.5 C 46.5 168.6 46.3 169.5 46.1 169.7 C 45.9 169.9 45.6 170.7 45.4 171.5 C 45.2 172.5 45.0 172.9 44.6 172.9 C 43.8 173.1 43.8 174.8 44.7 175.6 C 45.4 176.4 45.8 177.5 45.7 178.3 C 45.6 178.6 45.5 179.8 45.4 180.9 C 45.2 183.3 44.8 184.5 43.9 185.3 C 43.1 186.1 42.9 185.8 43.3 184.6 C 43.6 183.4 43.6 181.4 43.3 181.2 C 42.8 180.8 42.4 181.0 42.3 181.6 C 42.2 181.9 42.0 182.4 41.8 182.8 C 41.6 183.2 41.5 183.8 41.5 185.2 C 41.5 188.0 41.3 188.4 40.8 187.4 Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'dragon':
            o += '<path d="' + 'M 53.8 193.8 C 53.4 193.2 53.1 191.7 53.3 190.7 C 53.4 190.1 56.8 186.2 57.3 186.2 C 57.7 186.2 57.4 184.4 56.5 181.8 C 55.2 178.1 55.3 178.1 53.1 177.6 C 50.5 176.9 50.5 176.9 50.5 178.2 C 50.5 179.2 50.4 179.3 49.9 179.7 C 48.9 180.3 48.5 180.9 48.0 182.6 C 47.7 183.9 47.5 184.2 47.3 184.0 C 45.9 183.0 45.4 183.1 44.2 184.7 C 43.4 185.9 43.4 185.9 42.7 184.7 C 41.9 183.4 41.3 183.3 40.2 184.0 C 39.5 184.5 39.5 184.5 39.2 183.7 C 38.3 181.0 38.5 181.2 37.4 181.4 C 36.9 181.5 36.3 181.7 36.1 181.8 C 35.8 182.0 35.8 181.8 35.6 179.7 C 35.4 177.2 35.2 176.6 34.3 176.3 C 33.2 175.8 33.2 175.9 33.3 173.9 C 33.4 172.1 33.4 172.1 32.0 170.6 C 26.2 164.7 26.7 153.7 32.9 151.4 C 33.8 151.1 34.0 150.9 34.0 150.5 C 34.0 150.1 34.3 149.7 34.8 149.4 C 36.0 148.5 36.3 147.7 36.4 145.0 C 36.4 143.1 36.5 142.8 36.8 142.8 C 38.2 142.8 38.9 140.2 37.6 139.5 C 35.4 138.4 33.5 140.2 33.7 143.3 C 33.8 144.8 33.8 144.8 33.5 144.3 C 32.5 143.1 32.3 139.8 33.2 138.9 C 33.7 138.4 33.4 135.4 32.6 131.9 C 31.1 125.8 27.3 123.4 26.5 128.0 C 26.3 129.3 26.3 129.3 26.0 128.3 C 25.4 126.2 26.0 123.9 27.1 123.5 C 28.5 123.0 29.5 118.6 29.4 113.5 C 29.2 106.5 25.9 101.0 24.2 105.1 C 23.8 105.9 23.8 105.9 23.7 105.1 C 23.5 103.4 24.2 101.9 25.5 101.5 C 27.4 100.9 29.1 93.3 28.5 88.7 C 27.5 81.3 23.4 67.7 22.1 67.4 C 21.1 67.2 20.9 66.9 21.6 66.2 C 22.6 65.2 23.0 65.5 24.4 68.0 C 27.2 73.2 31.6 80.1 39.9 92.2 C 41.4 94.3 42.9 96.7 43.4 97.4 C 44.1 98.7 44.7 99.1 44.7 98.4 C 44.7 98.2 45.0 97.5 45.3 97.0 C 46.7 94.7 47.5 90.6 46.7 90.2 C 45.4 89.5 43.7 84.5 43.7 81.0 C 43.7 80.3 43.7 80.3 44.7 81.1 C 46.4 82.6 46.7 82.2 46.1 79.1 C 45.7 76.9 45.6 76.2 46.0 76.6 C 46.2 76.7 47.3 77.4 48.4 78.2 C 49.5 78.9 50.7 79.8 51.0 80.2 C 51.8 81.3 53.3 81.5 54.2 80.5 C 55.2 79.3 55.7 79.4 56.4 80.9 C 57.1 82.3 57.6 82.5 58.2 81.8 C 59.5 80.1 62.5 81.5 61.6 83.3 C 61.4 83.7 61.3 87.0 61.5 88.7 C 61.7 90.7 62.5 89.9 63.7 86.4 C 64.5 84.0 67.5 80.5 68.0 81.4 C 68.2 81.8 67.7 82.9 66.7 84.1 C 64.8 86.4 64.1 89.4 65.5 88.8 C 65.9 88.7 66.8 88.6 67.5 88.6 C 68.6 88.7 68.8 88.6 69.4 87.9 C 70.1 87.0 70.2 87.2 69.8 88.7 C 69.4 90.3 68.9 90.6 67.5 90.6 C 66.0 90.6 64.6 92.0 64.6 93.4 C 64.6 94.3 64.8 94.4 66.3 94.6 C 67.2 94.8 67.7 95.3 67.7 96.3 C 67.7 97.1 64.5 96.7 63.8 95.7 C 62.8 94.5 62.2 94.5 62.2 95.8 C 62.2 97.2 61.8 98.7 61.3 98.9 C 61.0 99.1 60.8 99.5 60.7 99.9 C 60.6 100.6 60.5 100.7 60.3 100.4 C 60.2 100.2 59.9 100.0 59.7 100.0 C 58.5 100.2 58.2 100.0 57.8 99.0 C 57.4 97.6 56.9 97.2 55.6 96.9 C 55.1 96.8 54.5 96.5 54.3 96.3 C 54.1 96.0 53.6 95.9 53.3 95.9 C 52.9 95.9 52.4 95.7 52.1 95.5 C 51.2 94.8 51.0 95.2 51.1 97.0 C 51.4 101.4 52.8 103.6 55.0 103.6 C 56.8 103.6 57.8 104.6 58.7 107.6 C 59.0 108.6 59.4 109.5 59.6 109.7 C 59.8 109.9 60.5 110.5 61.2 111.1 C 63.3 112.9 63.8 115.4 63.1 119.8 C 62.9 121.3 62.9 121.3 63.6 122.8 C 65.0 125.4 65.1 129.7 63.8 132.3 C 63.4 133.3 63.3 133.7 63.3 135.0 C 63.3 136.6 62.8 138.3 62.2 138.9 C 61.8 139.3 61.7 141.2 62.2 141.2 C 62.3 141.2 63.0 141.7 63.6 142.3 C 65.5 144.1 65.5 144.0 68.1 136.8 C 68.8 134.6 69.7 132.4 69.9 131.8 C 70.7 130.2 70.6 129.2 69.3 126.6 C 68.2 124.3 67.9 120.8 68.6 118.8 C 69.2 117.1 69.4 117.2 69.4 119.0 C 69.4 121.8 70.4 122.6 70.6 119.9 C 70.8 117.3 72.6 114.5 72.6 116.9 C 72.6 117.4 72.7 117.5 73.6 117.5 C 74.8 117.5 75.0 117.8 74.3 118.7 C 74.0 119.1 73.8 119.9 73.7 120.4 C 73.6 121.1 73.5 121.5 73.2 121.7 C 72.6 122.1 72.5 124.1 72.7 128.8 C 72.9 132.3 72.9 132.6 72.6 133.1 C 72.0 134.0 72.2 135.5 73.0 137.0 C 73.3 137.7 73.8 138.8 73.9 139.3 C 74.1 139.8 74.4 140.3 74.7 140.4 C 75.2 140.6 75.2 140.6 75.0 141.5 C 74.2 144.3 72.8 142.5 71.4 136.9 C 70.6 133.7 70.4 134.0 67.4 144.0 C 65.8 149.2 65.8 149.2 61.8 148.6 C 58.7 148.1 58.0 148.4 58.2 150.5 C 58.9 157.9 58.1 163.0 55.5 167.9 C 53.0 172.4 55.9 176.9 59.6 174.3 C 60.4 173.7 61.0 171.6 60.4 171.6 C 60.1 171.6 59.5 169.6 59.5 168.4 C 59.5 167.2 59.6 167.1 60.2 168.2 C 61.1 169.5 61.4 169.5 63.5 168.2 C 65.3 167.0 67.3 166.4 68.0 166.9 C 68.2 167.0 68.0 167.4 67.1 169.1 C 66.2 170.6 65.8 171.6 65.5 173.1 C 64.9 175.6 63.7 178.0 62.3 179.3 C 61.0 180.6 60.9 180.6 61.5 179.1 C 62.5 176.1 62.0 174.9 60.3 176.4 C 59.7 177.0 58.8 177.6 58.2 177.8 C 56.8 178.3 56.8 178.8 58.2 182.1 C 59.7 185.9 59.9 186.0 61.4 183.4 C 62.8 181.0 64.6 180.3 65.8 181.6 C 66.6 182.6 66.5 183.2 65.4 183.3 C 64.1 183.5 64.0 185.2 65.4 185.6 C 66.7 185.9 68.0 189.4 66.8 189.4 C 66.5 189.4 66.5 189.6 66.5 191.1 C 66.5 193.4 66.3 193.8 65.8 192.6 C 65.6 192.0 65.3 191.6 64.9 191.5 C 64.5 191.3 64.3 191.1 64.2 190.5 C 64.1 189.4 60.0 188.9 58.8 189.9 C 58.6 190.0 58.4 189.9 58.2 189.4 C 57.7 188.3 57.0 188.6 56.1 190.1 C 55.7 190.9 55.1 191.8 54.9 192.1 C 54.6 192.4 54.4 193.0 54.4 193.5 C 54.4 194.4 54.3 194.4 53.8 193.8 Z M 52.6 173.1 C 52.6 172.7 52.4 172.1 52.3 171.9 C 51.9 171.3 52.0 170.0 52.5 167.1 C 53.3 162.2 53.1 161.4 50.6 160.1 C 48.8 159.3 48.7 159.3 48.9 161.3 C 49.0 163.5 49.4 164.8 50.2 165.6 C 50.7 166.1 50.8 166.4 50.7 166.9 C 50.3 168.5 50.7 172.9 51.3 173.6 C 51.7 174.2 52.6 173.9 52.6 173.1 Z M 47.0 170.1 C 46.9 164.7 43.2 159.8 41.3 162.7 C 39.2 166.3 39.4 171.0 41.8 171.4 C 42.5 171.5 43.3 171.7 43.5 171.7 C 45.6 172.4 47.0 171.7 47.0 170.1 Z M 33.4 164.1 C 34.1 162.5 33.9 159.7 33.0 158.0 C 31.6 155.6 30.3 161.1 31.7 164.0 C 32.3 165.4 32.8 165.4 33.4 164.1 Z M 52.7 122.0 C 52.8 119.7 50.8 116.9 49.1 116.9 C 48.1 116.9 48.1 116.9 48.1 115.9 C 48.1 113.7 47.4 111.6 46.1 110.1 C 45.7 109.7 45.3 109.3 45.3 109.2 C 45.2 109.2 45.3 108.4 45.5 107.5 C 46.0 104.0 45.7 100.0 45.0 100.0 C 44.6 100.0 44.6 100.1 44.6 101.8 C 44.6 104.9 43.9 105.9 41.8 105.9 C 39.7 105.9 39.6 106.5 41.0 110.4 C 42.0 113.4 42.3 115.1 42.5 119.2 C 42.6 122.9 42.5 122.8 44.4 121.7 C 46.1 120.7 48.4 120.9 49.9 122.1 C 51.3 123.3 52.6 123.2 52.7 122.0 Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'sun':
            o += '<path d="' + 'M 36.9 178.3 C 36.5 177.9 35.7 176.1 35.5 175.3 C 35.1 173.7 35.7 171.7 37.3 169.8 C 39.3 167.4 39.5 166.8 39.1 165.3 C 38.3 163.1 38.3 163.0 38.3 162.1 C 38.3 160.7 38.2 160.7 36.1 162.3 C 31.4 165.7 28.1 168.0 27.6 168.0 C 27.2 168.0 27.8 166.5 28.6 165.6 C 28.9 165.3 29.1 164.7 29.9 162.9 C 30.2 162.4 30.6 161.7 30.8 161.4 C 31.0 161.0 31.5 160.0 32.1 159.0 C 32.6 158.0 33.2 156.7 33.6 156.1 C 33.9 155.5 34.2 155.0 34.1 154.9 C 34.1 154.7 33.8 154.7 33.0 154.7 C 31.8 154.7 31.9 154.6 30.0 156.5 C 28.0 158.5 28.0 158.5 26.3 158.6 C 25.8 158.7 22.5 158.8 21.1 158.8 C 20.6 158.8 20.6 158.8 20.1 159.4 C 19.4 160.3 19.1 160.5 18.9 160.5 C 18.6 160.5 18.6 160.4 18.6 159.2 C 18.7 155.8 19.6 154.9 23.5 154.5 C 25.9 154.2 26.3 154.0 26.9 152.6 C 27.3 151.6 28.4 150.3 29.7 149.3 C 30.4 148.7 30.3 148.7 27.0 148.0 C 18.4 146.4 18.1 146.3 18.1 145.9 C 18.1 145.5 18.4 145.4 20.0 145.1 C 22.3 144.5 24.6 143.9 26.8 143.2 C 29.1 142.6 30.3 142.3 31.9 142.0 C 32.9 141.8 32.9 141.8 33.0 141.6 C 33.3 141.4 33.1 141.0 32.6 140.5 C 32.2 140.1 31.7 139.9 29.6 139.8 C 25.1 139.3 24.4 138.9 22.2 135.0 C 21.1 133.3 21.0 133.2 19.2 133.2 C 17.7 133.2 17.5 133.1 18.0 132.4 C 18.7 131.4 19.7 130.8 20.8 130.7 C 21.9 130.7 23.6 131.5 24.7 132.8 C 26.2 134.5 26.6 134.7 29.0 134.5 C 30.1 134.4 31.9 134.3 32.7 134.3 C 33.4 134.3 33.8 134.2 33.8 134.1 C 33.8 133.8 32.9 132.4 30.1 128.2 C 28.5 126.0 27.2 124.1 27.2 123.9 C 26.5 122.5 27.0 122.2 28.4 123.2 C 29.4 124.0 30.5 124.7 31.8 125.5 C 32.2 125.7 33.1 126.3 33.8 126.8 C 34.6 127.3 35.5 127.9 35.9 128.1 C 36.6 128.5 37.5 129.1 38.5 129.7 C 39.3 130.2 40.2 130.5 40.6 130.5 C 41.0 130.5 41.0 130.5 41.0 130.0 C 41.0 129.2 40.7 128.7 39.3 127.3 C 37.0 125.0 36.5 124.0 36.7 121.8 C 37.0 116.4 36.9 115.7 34.6 114.5 C 33.6 113.9 33.7 113.5 34.9 113.4 C 38.3 113.1 40.5 115.3 40.9 119.4 C 41.1 121.7 41.5 122.4 42.9 123.2 C 44.2 123.9 45.1 124.5 46.0 125.3 C 46.6 125.8 47.0 126.1 47.1 125.9 C 47.1 125.9 47.8 122.3 48.3 118.8 C 49.1 113.6 49.6 112.3 50.2 113.2 C 50.5 113.7 51.6 117.2 51.9 119.0 C 52.2 120.6 52.5 122.0 52.7 122.8 C 52.9 123.5 53.5 125.5 53.7 126.6 C 54.1 128.3 54.4 128.4 55.8 127.3 C 56.3 126.8 56.3 126.8 56.4 125.1 C 56.5 121.1 56.5 120.7 57.0 119.8 C 57.4 119.2 58.6 118.1 59.7 117.5 C 60.6 117.0 61.6 116.1 61.8 115.6 C 62.2 114.8 62.2 113.2 61.8 112.8 C 61.3 112.2 61.7 111.3 62.3 111.7 C 62.6 111.8 63.5 112.8 63.9 113.3 C 64.4 114.1 64.7 115.4 64.6 116.6 C 64.6 117.8 64.2 118.5 62.8 120.1 C 61.2 122.0 61.2 122.2 61.7 124.8 C 62.0 126.6 62.0 126.6 62.0 127.2 C 62.0 128.1 61.8 128.8 61.5 129.1 C 61.1 129.3 61.3 129.6 61.8 129.6 C 62.4 129.6 63.4 129.0 66.3 126.8 C 69.1 124.7 69.4 124.5 70.5 123.8 C 72.0 122.8 72.5 122.7 72.5 123.3 C 72.4 123.6 72.3 123.8 71.7 124.7 C 68.8 128.8 64.7 135.4 64.7 136.1 C 64.7 136.3 65.2 136.4 66.2 136.5 C 67.2 136.6 67.1 136.6 68.8 134.9 C 71.4 132.4 71.7 132.3 75.9 132.2 C 79.2 132.1 79.5 132.0 80.5 130.9 C 81.3 130.1 81.4 130.1 81.4 131.0 C 81.7 133.8 80.2 135.6 77.3 135.9 C 73.9 136.2 73.4 136.5 72.4 138.3 C 71.5 140.1 71.2 140.4 70.3 141.1 C 69.0 141.9 68.8 142.2 69.1 142.4 C 69.4 142.6 71.0 143.0 73.3 143.5 C 77.2 144.3 80.5 145.0 80.7 145.1 C 81.1 145.4 81.1 145.6 80.8 145.9 C 80.7 146.0 79.0 146.4 74.9 147.2 C 71.7 147.9 68.9 148.5 68.7 148.6 C 67.8 148.8 67.3 149.0 67.3 149.1 C 67.3 149.3 68.0 150.5 68.5 151.1 C 69.1 151.8 69.4 151.9 72.5 152.2 C 75.5 152.5 76.6 153.2 78.0 156.2 C 78.8 157.9 79.0 158.0 80.6 158.1 C 82.2 158.1 82.3 158.2 82.3 158.5 C 82.3 158.7 82.3 158.7 82.1 158.9 C 81.1 160.1 80.1 160.5 78.6 160.5 C 77.2 160.4 76.9 160.2 75.3 158.5 C 73.5 156.7 73.4 156.7 71.9 156.8 C 70.9 156.9 70.4 157.0 69.6 157.3 C 68.9 157.5 68.7 157.5 66.4 157.4 C 66.1 157.4 66.0 157.5 66.0 157.5 C 66.0 157.6 67.6 160.0 68.8 161.7 C 69.2 162.3 69.7 163.1 69.9 163.4 C 70.4 164.4 70.8 165.1 71.5 166.1 C 72.4 167.4 72.4 167.4 72.5 167.7 C 72.5 168.2 72.3 168.3 71.8 168.0 C 71.1 167.7 68.2 165.7 65.6 164.1 C 62.1 161.8 59.7 160.3 59.4 160.3 C 59.1 160.3 58.9 160.8 58.8 161.5 C 58.7 162.5 59.3 163.7 60.3 164.4 C 62.2 165.8 62.9 167.7 62.8 171.2 C 62.7 174.2 62.9 174.9 64.3 175.9 C 65.2 176.6 65.3 177.2 64.5 177.4 C 63.0 177.8 61.7 177.4 60.4 176.1 C 59.1 174.9 58.8 173.9 58.7 171.5 C 58.6 168.8 58.3 168.4 56.4 167.6 C 55.2 167.1 54.6 166.7 54.0 165.9 C 53.7 165.5 53.4 165.2 53.3 165.2 C 53.0 165.2 52.7 165.8 52.6 166.3 C 52.6 166.5 52.6 166.8 52.5 167.0 C 52.5 167.2 52.3 167.8 52.2 168.4 C 52.1 169.0 51.7 170.4 51.5 171.6 C 50.4 177.1 50.2 177.9 49.7 178.0 C 49.3 178.1 49.1 177.9 49.1 176.9 C 49.0 175.1 48.8 173.9 48.1 170.5 C 47.5 167.6 46.5 162.7 46.3 162.2 C 46.2 161.9 45.3 162.2 44.9 162.6 C 44.6 163.1 44.4 163.6 44.3 165.1 C 44.1 167.6 43.9 168.3 43.3 169.5 C 42.7 170.5 41.8 171.6 40.7 172.6 C 38.9 174.0 38.3 175.0 38.0 176.8 C 37.8 178.4 37.7 178.6 37.3 178.6 C 37.1 178.6 37.0 178.5 36.9 178.3 Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'crown':
            o += '<path d="' + 'M28.1,183.4C28.1,183.4,28.0,183.3,28.0,183.3C27.5,183.1,27.1,181.9,27.3,180.9C27.3,180.5,27.8,179.8,27.9,179.8C28.1,179.8,28.0,179.5,27.8,179.0C27.7,178.7,27.6,178.5,27.5,178.5C27.5,178.5,26.0,176.3,26.0,176.2C26.0,176.1,26.1,175.7,26.2,175.3C26.6,173.4,26.6,173.3,26.6,172.6C26.6,171.6,26.6,171.4,26.3,171.5C26.2,171.5,26.1,171.5,25.9,171.3C25.0,170.7,24.9,169.1,25.5,168.2C25.6,168.0,25.7,167.8,25.7,167.8C25.7,167.6,25.4,167.0,25.1,166.6C24.7,166.0,24.3,165.0,24.2,164.3C24.2,164.0,24.2,164.0,23.9,164.0C22.8,164.0,22.1,162.6,22.3,160.9C22.4,160.4,22.4,160.4,22.3,160.3C20.8,158.9,19.5,158.7,18.1,159.6C17.7,159.9,17.7,159.9,17.7,159.3C17.7,158.4,17.9,157.5,18.3,156.9C18.6,156.4,18.6,156.4,18.3,156.1C17.3,155.4,16.9,153.7,17.3,152.2C17.4,151.6,17.4,151.6,17.2,151.4C16.5,150.9,16.0,149.4,16.2,148.1C16.2,147.7,16.5,146.8,16.6,146.7C16.7,146.6,16.7,146.5,16.5,146.2C16.3,146.0,16.0,145.3,15.9,145.0C15.9,144.8,15.9,144.7,15.8,144.7C15.8,144.7,15.8,144.4,15.8,143.9C15.8,143.5,15.8,143.2,15.8,143.2C15.9,143.2,15.9,143.1,15.9,143.1C15.9,142.6,16.4,141.7,16.8,141.3C17.1,141.0,17.1,141.0,16.9,140.5C16.7,139.8,16.7,138.6,16.9,137.9C17.3,136.7,18.1,136.0,18.9,136.1C19.2,136.1,19.2,136.1,19.2,135.9C19.2,135.8,19.2,135.5,19.2,135.2C19.4,133.3,20.7,132.1,21.9,132.8C22.3,133.0,22.4,133.0,22.4,132.9C22.4,132.7,22.7,132.0,22.9,131.6C23.6,130.6,24.8,130.4,25.6,131.3C25.9,131.6,25.9,131.6,26.1,131.4C26.7,130.1,28.1,129.9,28.9,130.9C29.2,131.3,29.2,131.3,29.5,130.8C30.2,129.7,31.3,129.6,32.1,130.5C32.3,130.7,32.4,130.7,32.6,130.7C32.7,130.6,32.9,130.6,33.2,130.6C33.6,130.6,33.6,130.6,33.6,130.2C34.0,128.3,35.3,127.4,36.5,128.2C36.8,128.4,36.8,128.4,37.0,128.1C37.7,126.9,38.8,126.7,39.6,127.6C40.0,127.9,39.9,127.9,40.2,127.6C40.9,127.0,41.8,127.0,42.5,127.8C42.8,128.1,42.8,128.0,43.1,127.8C44.4,126.7,45.9,127.9,46.1,130.3C46.2,130.7,46.2,130.7,46.4,130.7C46.6,130.7,47.0,131.0,47.2,131.3C47.3,131.7,47.4,131.7,47.6,131.5C47.7,131.2,47.6,131.1,47.5,131.0C46.9,130.4,46.2,128.9,45.9,127.5C45.8,127.0,45.8,127.0,45.2,126.3C44.6,125.5,44.6,125.6,44.8,125.4C45.6,124.5,45.9,124.2,45.9,123.9C46.1,122.6,47.1,120.9,48.1,120.1C48.5,119.8,48.5,119.8,48.6,118.5C48.7,116.4,48.8,115.1,48.8,115.0C48.8,115.0,48.0,115.1,46.5,115.4C46.1,115.5,45.7,115.6,45.7,115.6C45.7,115.6,45.7,114.5,45.7,113.2C45.7,110.8,45.7,110.8,45.8,110.8C45.9,110.8,47.3,111.1,48.1,111.2C48.8,111.4,48.8,111.4,48.7,110.8C48.7,110.5,48.7,109.7,48.6,108.9C48.4,106.2,48.2,106.5,50.0,106.5C51.6,106.5,51.6,106.5,51.6,106.7C51.6,106.8,51.5,107.1,51.5,107.5C51.5,107.9,51.4,108.8,51.3,109.6C51.2,111.4,51.2,111.3,51.4,111.3C51.5,111.3,52.0,111.2,52.6,111.1C54.6,110.7,54.3,110.5,54.3,113.2C54.3,114.5,54.3,115.6,54.3,115.6C54.3,115.6,54.0,115.5,53.8,115.5C52.7,115.3,51.2,115.0,51.2,115.0C51.2,115.1,51.3,116.4,51.4,118.8C51.5,119.8,51.5,119.8,51.9,120.1C52.9,120.9,53.9,122.6,54.1,123.9C54.1,124.1,54.2,124.3,54.7,124.9C55.1,125.3,55.3,125.6,55.3,125.6C55.3,125.6,55.1,126.0,54.8,126.3C54.2,127.0,54.2,127.0,54.1,127.5C53.8,128.9,53.1,130.4,52.5,131.0C52.4,131.1,52.3,131.3,52.4,131.5C52.5,131.7,52.7,131.7,52.8,131.3C53.0,131.0,53.3,130.7,53.6,130.7C53.8,130.7,53.8,130.7,53.8,130.3C54.0,128.0,55.5,126.8,56.8,127.7C57.1,127.9,57.2,128.0,57.3,128.0C58.1,127.0,59.0,126.9,59.8,127.6C60.1,127.9,60.0,127.9,60.3,127.6C61.2,126.7,62.6,127.0,63.1,128.1C63.2,128.3,63.2,128.3,63.7,128.0C64.8,127.4,66.1,128.5,66.4,130.3C66.4,130.6,66.4,130.6,66.8,130.6C67.0,130.6,67.2,130.6,67.4,130.6C67.7,130.7,67.7,130.7,67.9,130.5C68.7,129.6,69.8,129.8,70.5,130.8C70.8,131.3,70.8,131.3,71.1,130.9C71.9,129.9,73.3,130.1,73.9,131.4C74.1,131.6,74.1,131.6,74.4,131.3C75.2,130.4,76.4,130.6,77.1,131.6C77.3,132.0,77.6,132.7,77.6,132.9C77.6,133.0,77.7,133.0,78.1,132.8C79.3,132.1,80.6,133.3,80.8,135.2C80.8,135.5,80.8,135.8,80.8,135.9C80.8,136.1,80.8,136.1,81.1,136.1C81.9,136.0,82.7,136.7,83.1,137.9C83.3,138.6,83.3,139.8,83.1,140.5C82.9,141.0,82.9,141.0,83.2,141.3C83.6,141.7,84.1,142.7,84.1,143.1C84.1,143.1,84.1,143.2,84.2,143.2C84.2,143.2,84.2,143.5,84.2,143.9C84.2,144.3,84.2,144.6,84.2,144.6C84.1,144.6,84.1,144.8,84.1,144.9C84.0,145.3,83.7,146.0,83.5,146.2C83.3,146.5,83.3,146.6,83.4,146.7C83.5,146.8,83.8,147.7,83.8,148.1C84.0,149.4,83.5,150.9,82.8,151.4C82.6,151.6,82.6,151.6,82.7,152.2C83.1,153.7,82.7,155.4,81.7,156.1C81.4,156.4,81.4,156.4,81.7,156.9C82.1,157.5,82.3,158.4,82.3,159.3C82.3,159.9,82.3,159.9,82.0,159.7C80.9,158.8,79.4,158.9,78.2,159.9C77.5,160.4,77.5,160.4,77.7,161.0C78.0,162.5,77.2,164.0,76.1,164.0C75.8,164.0,75.8,164.1,75.8,164.2C75.8,164.3,75.6,165.0,75.5,165.4C75.3,165.9,74.9,166.6,74.6,166.9C74.5,167.0,74.3,167.5,74.3,167.7C74.3,167.8,74.3,168.0,74.5,168.1C75.1,169.1,75.0,170.7,74.1,171.3C73.9,171.5,73.8,171.5,73.7,171.5C73.4,171.4,73.4,171.6,73.4,172.6C73.4,173.3,73.4,173.4,73.8,175.3C73.9,175.7,74.0,176.1,74.0,176.2C74.0,176.3,72.5,178.5,72.5,178.5C72.4,178.5,72.3,178.7,72.2,179.0C72.0,179.5,71.9,179.8,72.1,179.8C72.2,179.8,72.6,180.5,72.7,180.9C72.9,181.8,72.6,183.1,72.0,183.3C72.0,183.3,71.9,183.4,71.9,183.4C71.9,183.5,71.4,183.5,71.3,183.4C71.3,183.4,69.8,183.0,68.2,182.7C56.4,180.4,43.3,180.4,31.5,182.8C30.0,183.1,28.7,183.4,28.7,183.4C28.6,183.5,28.1,183.5,28.1,183.4ZM31.8,177.6C32.0,177.2,32.0,176.8,31.8,176.5C31.4,176.0,30.8,176.6,31.0,177.3C31.1,177.8,31.6,178.0,31.8,177.6ZM68.8,177.7C69.0,177.5,69.1,176.9,69.0,176.6C68.7,176.2,68.3,176.2,68.1,176.7C67.9,177.4,68.4,178.1,68.8,177.7ZM33.8,177.1C34.3,176.6,33.7,175.4,33.3,175.9C33.1,176.1,33.0,176.2,33.0,176.6C33.0,177.2,33.5,177.6,33.8,177.1ZM66.8,177.1C67.1,176.7,66.9,175.8,66.5,175.8C66.2,175.8,66.0,176.3,66.0,176.7C66.1,177.3,66.6,177.5,66.8,177.1ZM42.6,176.1C42.7,176.0,42.8,175.5,42.7,175.3C42.5,174.5,41.8,174.7,41.8,175.5C41.8,176.2,42.2,176.5,42.6,176.1ZM58.0,176.2C58.4,175.9,58.2,174.8,57.8,174.8C57.3,174.8,57.1,175.8,57.5,176.2C57.7,176.3,57.8,176.3,58.0,176.2ZM45.1,176.0C45.5,175.6,45.4,174.6,44.9,174.6C44.4,174.6,44.2,175.6,44.6,176.0C44.8,176.1,45.0,176.1,45.1,176.0ZM55.3,176.0C55.8,175.6,55.6,174.6,55.1,174.6C54.6,174.6,54.5,175.6,54.9,176.0C55.0,176.1,55.2,176.1,55.3,176.0ZM32.5,175.2C33.0,174.9,32.8,173.8,32.3,173.8C32.0,173.8,31.9,173.9,31.8,174.3C31.7,174.9,32.1,175.4,32.5,175.2ZM67.9,175.2C68.1,175.0,68.2,174.7,68.2,174.3C68.0,173.6,67.4,173.6,67.2,174.3C67.1,174.9,67.5,175.4,67.9,175.2ZM43.8,173.5C44.1,173.0,43.8,172.1,43.3,172.3C42.9,172.4,42.8,173.2,43.1,173.5C43.3,173.8,43.6,173.8,43.8,173.5ZM56.9,173.5C57.2,173.2,57.1,172.4,56.7,172.3C56.4,172.2,56.1,172.5,56.1,173.0C56.1,173.6,56.6,173.9,56.9,173.5ZM31.3,173.2C31.4,173.1,31.5,172.8,31.5,172.5C31.5,171.7,30.8,171.5,30.6,172.2C30.5,172.9,30.9,173.4,31.3,173.2ZM69.2,173.1C69.5,172.8,69.5,172.1,69.2,171.9C68.7,171.5,68.3,172.2,68.5,172.9C68.6,173.2,69.0,173.3,69.2,173.1ZM33.5,172.5C33.7,172.1,33.6,171.4,33.2,171.3C32.7,171.2,32.4,172.0,32.8,172.6C33.0,172.8,33.3,172.8,33.5,172.5ZM67.2,172.6C67.6,172.0,67.3,171.2,66.8,171.3C66.4,171.4,66.3,172.1,66.5,172.5C66.7,172.8,67.0,172.8,67.2,172.6ZM42.2,171.5C42.5,171.1,42.3,170.2,41.9,170.2C41.6,170.2,41.3,170.8,41.4,171.2C41.6,171.7,42.0,171.9,42.2,171.5ZM58.4,171.6C58.7,171.2,58.7,170.6,58.4,170.3C58.0,170.0,57.7,170.3,57.7,171.0C57.7,171.6,58.1,171.9,58.4,171.6ZM45.0,171.1C45.2,170.7,45.1,170.0,44.7,169.9C44.4,169.7,44.0,170.3,44.2,170.8C44.3,171.4,44.7,171.5,45.0,171.1ZM55.7,171.2C56.1,170.8,55.7,169.6,55.3,169.9C55.0,170.0,54.9,170.2,54.9,170.6C54.9,171.2,55.3,171.5,55.7,171.2ZM24.4,163.5C25.7,162.6,25.4,159.8,24.0,159.6C23.4,159.5,22.7,160.2,22.5,161.1C22.3,162.8,23.4,164.3,24.4,163.5ZM76.6,163.6C77.5,163.1,77.8,161.5,77.2,160.4C76.4,158.8,74.8,159.6,74.8,161.7C74.8,163.1,75.7,164.1,76.6,163.6ZM29.6,162.4C30.0,162.2,30.3,161.3,30.2,160.6C29.9,159.0,28.4,158.9,28.1,160.5C27.8,161.9,28.7,163.1,29.6,162.4ZM71.4,162.5C72.0,162.2,72.3,161.1,72.0,160.2C71.6,159.0,70.3,159.0,70.0,160.3C69.7,161.7,70.5,163.0,71.4,162.5ZM43.3,160.0C44.3,159.2,44.4,157.0,43.4,156.2C43.1,156.0,42.4,155.9,42.1,156.1C41.1,156.9,41.1,159.0,42.1,159.9C42.4,160.2,43.0,160.2,43.3,160.0ZM57.9,159.9C58.9,159.0,58.8,156.7,57.8,156.1C56.4,155.4,55.4,157.6,56.2,159.3C56.5,160.1,57.4,160.4,57.9,159.9ZM36.0,159.8C37.1,159.3,37.4,157.2,36.6,155.9C36.0,154.9,34.8,155.0,34.3,156.2C33.5,158.1,34.6,160.4,36.0,159.8ZM65.1,159.7C65.9,159.1,66.2,157.4,65.7,156.2C64.9,154.4,63.0,155.2,63.0,157.4C62.9,158.0,63.0,158.7,63.1,158.7C63.1,158.7,63.2,158.8,63.2,159.0C63.5,159.8,64.5,160.1,65.1,159.7ZM50.6,157.5C52.0,156.5,51.6,153.3,50.1,153.1C48.9,153.0,48.1,154.7,48.6,156.3C48.9,157.6,49.8,158.1,50.6,157.5ZM19.2,155.8C19.6,155.5,20.1,155.3,20.4,155.3C20.5,155.3,20.7,155.1,20.8,154.6C20.9,154.3,21.0,154.4,20.5,152.9C20.2,152.1,20.0,151.3,19.9,151.2C19.8,150.5,19.8,150.5,19.2,150.5C18.5,150.5,18.1,150.8,17.7,151.6C17.0,153.1,17.4,155.3,18.5,155.9C18.8,156.1,18.8,156.1,19.2,155.8ZM81.4,155.9C83.3,155.0,82.9,150.7,80.9,150.5C80.3,150.5,80.2,150.5,80.1,151.2C80.0,151.5,79.7,152.3,79.5,153.0C79.0,154.4,79.1,154.3,79.2,154.7C79.4,155.2,79.5,155.3,79.8,155.3C80.1,155.4,80.6,155.6,80.8,155.8C81.1,156.1,81.2,156.1,81.4,155.9ZM21.3,155.3C21.3,155.1,21.2,154.8,21.1,154.8C21.0,154.8,20.9,155.1,20.9,155.3C20.9,155.3,21.0,155.4,21.2,155.4C21.3,155.4,21.3,155.4,21.3,155.3ZM79.1,155.3C79.2,155.3,79.0,154.8,78.9,154.8C78.8,154.8,78.7,155.1,78.7,155.3C78.7,155.4,79.1,155.4,79.1,155.3ZM17.7,151.1C17.9,150.6,18.6,150.1,19.2,150.1C19.7,150.1,19.7,150.2,19.5,149.5C19.4,148.9,19.1,147.3,19.0,146.6C19.0,145.9,18.8,145.8,18.1,145.9C16.3,146.0,15.7,149.6,17.2,151.0C17.5,151.3,17.6,151.3,17.7,151.1ZM22.3,150.7C24.2,147.3,26.0,145.7,28.4,145.5C28.7,145.5,29.0,145.5,29.0,145.5C29.0,145.5,28.9,145.2,28.9,145.0C28.7,143.0,28.6,140.1,28.7,138.2C28.7,137.6,28.7,137.6,27.4,137.6C24.4,137.7,23.3,138.1,22.2,139.7C20.5,142.3,20.3,145.4,21.5,150.0C21.9,151.5,21.9,151.5,22.3,150.7ZM82.8,151.0C84.0,149.8,83.9,147.1,82.6,146.1C82.2,145.8,81.7,145.8,81.3,145.9C81.0,146.1,81.0,146.1,81.0,146.6C80.9,147.3,80.6,148.9,80.5,149.5C80.3,150.2,80.3,150.1,80.8,150.1C81.4,150.1,82.1,150.6,82.3,151.1C82.4,151.3,82.5,151.3,82.8,151.0ZM33.6,150.7C33.6,149.9,33.8,149.4,34.3,148.8C34.6,148.4,34.6,148.3,35.1,148.6C35.5,148.8,35.5,148.8,35.5,148.1C35.4,145.7,33.5,144.6,32.4,146.3C31.3,147.9,31.8,150.5,33.3,151.0C33.6,151.1,33.6,151.1,33.6,150.7ZM67.0,150.8C68.3,150.1,68.6,147.6,67.6,146.2C66.4,144.5,64.5,145.8,64.5,148.3C64.5,148.7,64.5,148.8,64.9,148.6C65.4,148.3,65.4,148.4,65.7,148.8C66.2,149.4,66.4,149.9,66.4,150.7C66.4,151.1,66.5,151.1,67.0,150.8ZM78.4,150.4C79.7,145.5,79.6,142.4,77.8,139.7C76.7,138.1,75.6,137.7,72.6,137.6C71.3,137.6,71.3,137.6,71.3,138.3C71.4,139.8,71.4,142.2,71.2,143.8C71.1,144.6,71.0,145.4,71.0,145.5C71.0,145.7,71.0,145.7,71.9,145.9C74.7,146.4,76.3,147.7,77.7,150.3C77.9,150.7,78.1,151.1,78.2,151.1C78.2,151.1,78.3,150.8,78.4,150.4ZM51.6,148.4C52.0,147.1,51.9,146.0,51.3,145.1C49.8,142.8,47.4,145.5,48.4,148.3C48.5,148.8,48.6,148.8,48.6,148.3C48.7,147.4,49.4,146.3,49.9,146.2C50.4,146.0,51.3,147.3,51.4,148.4C51.4,148.8,51.5,148.8,51.6,148.4ZM68.6,146.9C69.6,144.8,68.2,141.9,66.5,142.5C65.8,142.8,65.2,144.0,65.2,145.1C65.2,145.5,65.2,145.5,65.6,145.3C66.6,144.7,67.9,145.5,68.2,146.9C68.3,147.2,68.4,147.2,68.6,146.9ZM31.8,146.8C32.2,145.5,33.4,144.7,34.3,145.2C34.8,145.5,34.8,145.5,34.8,145.2C34.8,143.4,33.6,142.1,32.5,142.5C31.2,143.0,30.7,145.3,31.4,146.8C31.6,147.2,31.7,147.2,31.8,146.8ZM17.1,146.0C17.5,145.5,18.1,145.4,18.7,145.5C18.9,145.6,18.9,145.6,18.9,144.9C18.9,144.0,19.1,142.8,19.2,142.1C19.2,141.9,19.0,141.6,18.7,141.4C18.3,141.1,17.5,141.1,17.1,141.4C15.9,142.3,15.7,144.5,16.6,145.9C16.8,146.3,16.8,146.3,17.1,146.0ZM83.4,145.9C84.3,144.5,84.1,142.3,82.9,141.4C82.3,140.9,81.4,141.1,80.9,141.8C80.8,142.0,80.8,142.0,80.9,142.5C81.0,143.2,81.1,144.1,81.1,144.9C81.1,145.6,81.1,145.6,81.3,145.5C81.9,145.4,82.5,145.5,82.9,145.9C83.2,146.3,83.2,146.3,83.4,145.9ZM48.7,144.5C48.8,144.5,48.9,144.3,49.1,144.2C49.8,143.7,50.7,143.8,51.3,144.5C51.5,144.8,51.6,144.6,51.8,143.6C52.0,142.4,51.5,141.1,50.8,140.5C49.5,139.5,47.8,141.5,48.2,143.6C48.4,144.5,48.5,144.9,48.7,144.5ZM31.3,143.2C32.0,142.1,32.9,141.8,33.7,142.3C34.2,142.6,34.2,142.6,34.3,141.9C34.4,140.5,33.7,139.1,32.7,138.9C31.2,138.5,30.1,141.0,30.8,143.0C31.0,143.6,31.1,143.6,31.3,143.2ZM69.1,143.2C69.5,142.3,69.5,141.0,69.2,140.3C69.1,140.2,69.1,140.1,69.1,140.1C69.1,139.9,68.7,139.3,68.3,139.1C67.1,138.2,65.6,139.8,65.7,141.9C65.8,142.6,65.8,142.6,66.3,142.3C67.0,141.8,67.9,142.1,68.5,143.0C68.9,143.6,68.9,143.6,69.1,143.2ZM45.3,138.8C45.3,135.4,45.3,135.4,45.2,135.5C45.1,135.5,43.2,135.9,41.2,136.3C40.1,136.6,37.6,137.0,37.0,137.1C36.6,137.1,36.6,137.1,36.6,137.4C36.5,137.8,36.5,140.0,36.6,140.1C36.6,140.2,36.8,140.1,37.0,140.1C37.2,140.0,37.9,140.0,38.7,140.0C40.5,140.0,40.9,140.1,44.0,141.6C44.6,141.9,45.1,142.2,45.2,142.2C45.3,142.2,45.3,142.2,45.3,138.8ZM55.9,141.4C59.1,139.9,60.5,139.6,62.9,140.2C63.2,140.3,63.4,140.3,63.4,140.3C63.5,140.2,63.5,137.8,63.4,137.4C63.4,137.1,63.4,137.1,63.0,137.1C61.9,136.9,59.4,136.5,57.2,136.0C56.9,135.9,56.2,135.8,55.8,135.7C55.3,135.6,54.9,135.5,54.8,135.5C54.7,135.4,54.7,135.4,54.7,138.7C54.7,141.9,54.7,141.9,54.8,141.9C54.9,141.9,55.4,141.7,55.9,141.4ZM19.5,140.9C19.8,140.2,20.1,139.3,20.4,138.9C20.7,138.4,20.6,138.0,20.1,137.3C18.9,135.3,16.7,137.0,17.0,139.7C17.1,140.6,17.2,140.8,17.7,140.7C18.2,140.7,18.7,140.9,19.0,141.2C19.3,141.5,19.3,141.6,19.5,140.9ZM81.0,141.3C81.3,140.9,81.8,140.7,82.3,140.7C82.8,140.8,82.9,140.6,83.0,139.7C83.3,137.0,81.1,135.3,79.9,137.3C79.4,138.0,79.3,138.4,79.6,138.9C79.9,139.3,80.2,140.2,80.5,140.9C80.7,141.6,80.7,141.5,81.0,141.3ZM48.9,140.4C49.6,139.7,50.5,139.7,51.1,140.4C51.5,140.7,51.5,140.7,51.6,140.4C51.8,139.7,51.9,139.2,51.8,138.7C51.8,138.2,51.6,137.4,51.5,137.4C51.5,137.4,51.4,137.4,51.4,137.3C51.1,136.5,50.1,136.1,49.4,136.4C49.2,136.5,48.6,137.0,48.6,137.2C48.6,137.2,48.6,137.3,48.5,137.4C48.1,138.0,48.0,139.3,48.4,140.4C48.5,140.7,48.5,140.7,48.9,140.4ZM31.0,139.4C31.6,138.4,32.5,138.2,33.3,138.8C33.6,139.0,33.6,139.0,33.7,138.4C34.0,136.6,33.2,135.0,31.9,135.0C30.4,135.0,29.6,137.6,30.5,139.4C30.7,139.8,30.7,139.8,31.0,139.4ZM69.5,139.3C70.2,137.9,69.8,136.0,68.8,135.2C68.4,134.9,67.7,134.9,67.2,135.2C66.4,135.9,66.0,137.2,66.3,138.5C66.4,139.0,66.4,139.0,66.6,138.8C67.3,138.2,68.3,138.4,69.0,139.3C69.3,139.8,69.3,139.8,69.5,139.3ZM21.2,137.6C21.7,137.0,22.2,136.5,22.7,136.1C23.1,135.8,23.1,135.8,23.1,135.4C22.9,132.7,20.4,132.1,19.6,134.5C19.3,135.4,19.3,136.1,19.7,136.3C20.0,136.5,20.5,137.2,20.6,137.7C20.8,138.2,20.8,138.1,21.2,137.6ZM79.3,137.7C79.5,137.3,80.0,136.5,80.3,136.3C80.6,136.2,80.6,136.0,80.6,135.3C80.3,133.0,78.5,132.2,77.4,133.8C77.1,134.2,77.0,134.7,76.9,135.4C76.9,135.8,76.9,135.8,77.3,136.1C77.8,136.5,78.3,137.0,78.8,137.6C79.2,138.1,79.2,138.2,79.3,137.7ZM48.6,136.7C49.3,135.6,50.7,135.6,51.4,136.7C51.6,137.0,51.7,136.9,51.8,136.5C52.1,134.8,51.4,133.1,50.2,132.8C48.9,132.5,47.8,134.8,48.3,136.7C48.4,137.0,48.4,137.0,48.6,136.7ZM34.2,135.8C35.7,133.8,34.1,129.9,32.4,131.1C32.2,131.2,32.1,131.3,32.1,131.3C32.0,131.3,31.6,131.8,31.5,132.1C31.2,132.7,31.1,133.7,31.2,134.4C31.2,134.6,31.2,134.6,31.8,134.6C32.7,134.6,33.4,135.1,33.7,135.9C33.8,136.2,33.9,136.2,34.2,135.8ZM66.3,136.0C66.3,135.8,66.8,135.1,67.2,134.8C67.5,134.6,67.5,134.6,68.1,134.6C68.8,134.6,68.8,134.6,68.8,134.0C68.9,132.8,68.4,131.7,67.7,131.1C66.2,130.1,64.6,132.7,65.3,135.0C65.6,135.8,66.2,136.4,66.3,136.0ZM23.8,135.5C24.2,135.3,25.1,135.1,25.6,135.1C26.2,135.0,26.2,135.0,26.2,133.9C26.2,133.2,26.1,132.8,25.9,132.3C25.1,130.5,23.4,130.7,22.7,132.6C22.6,133.2,22.6,133.2,22.8,133.6C23.1,134.1,23.4,135.0,23.4,135.5C23.4,135.6,23.4,135.7,23.4,135.6C23.5,135.6,23.6,135.6,23.8,135.5ZM76.6,135.5C76.6,134.9,76.9,134.1,77.2,133.6C77.4,133.2,77.4,133.2,77.3,132.6C76.4,129.9,73.8,130.9,73.8,133.9C73.8,135.0,73.8,135.0,74.4,135.1C75.1,135.1,76.3,135.4,76.4,135.6C76.6,135.7,76.6,135.7,76.6,135.5ZM28.5,135.0C29.1,134.9,29.1,134.9,29.2,134.7C30.3,131.9,27.8,129.1,26.3,131.4C26.1,131.8,26.1,131.9,26.2,132.3C26.5,133.1,26.5,133.9,26.4,134.8C26.4,135.1,26.9,135.1,28.5,135.0ZM73.6,134.8C73.5,133.9,73.5,133.1,73.8,132.3C73.9,131.9,73.9,131.8,73.7,131.4C72.2,129.1,69.7,131.9,70.8,134.7C70.9,135.0,71.0,135.0,72.8,135.0C73.6,135.0,73.6,135.0,73.6,134.8ZM30.0,133.6C30.2,133.5,30.4,133.2,30.6,133.1C30.7,133.0,30.9,132.9,30.9,132.9C31.0,132.8,31.0,132.6,31.1,132.4C31.2,132.0,31.6,131.3,31.9,131.0C32.0,130.9,32.0,130.7,31.7,130.5C31.0,130.0,30.0,130.3,29.5,131.2C29.4,131.5,29.4,131.5,29.5,132.1C29.7,132.4,29.7,132.6,29.7,133.2C29.7,134.1,29.7,134.1,30.0,133.6ZM70.3,133.2C70.3,132.5,70.3,132.4,70.5,132.0C70.6,131.5,70.6,131.5,70.5,131.2C70.0,130.3,69.0,130.0,68.3,130.5C68.0,130.8,67.9,130.9,68.2,131.1C68.4,131.4,68.7,132.0,68.9,132.4C69.0,132.7,69.1,132.9,69.1,132.9C69.4,133.1,69.7,133.3,69.9,133.6C70.3,134.1,70.3,134.1,70.3,133.2ZM35.9,133.5C36.2,133.0,36.8,132.4,37.2,132.2C37.4,132.1,37.5,131.3,37.5,130.6C37.2,127.8,34.7,127.3,33.9,130.0C33.8,130.6,33.8,130.7,34.0,130.9C34.5,131.4,35.0,132.3,35.1,133.4C35.1,133.9,35.6,134.0,35.9,133.5ZM64.8,133.7C64.9,133.7,64.9,133.6,64.9,133.2C65.1,132.3,65.5,131.4,66.0,130.9C66.2,130.7,66.2,130.7,66.2,130.5C65.8,128.1,63.9,127.4,62.9,129.4C62.4,130.2,62.4,132.0,62.8,132.2C63.4,132.6,63.9,133.0,64.1,133.5C64.3,133.8,64.5,133.9,64.8,133.7ZM48.6,133.3C49.3,132.2,50.6,132.2,51.4,133.3C51.7,133.7,51.8,133.7,51.8,133.2C52.0,132.1,51.5,130.8,50.8,130.2C49.5,129.3,47.9,131.1,48.2,133.2C48.2,133.7,48.3,133.7,48.6,133.3ZM45.2,132.4C45.3,132.3,45.3,132.2,45.3,132.2C45.3,131.8,45.4,131.4,45.7,131.1C46.0,130.6,46.0,130.6,45.8,129.7C45.6,128.3,44.5,127.4,43.6,127.9C43.0,128.2,43.0,128.2,43.2,128.8C43.5,129.7,43.5,131.0,43.2,131.7C43.1,132.1,43.0,132.2,43.1,132.2C43.2,132.3,43.4,132.3,43.7,132.3C44.3,132.5,45.1,132.5,45.2,132.4ZM56.5,132.3C57.0,132.2,57.0,132.2,56.8,131.6C56.5,130.9,56.6,129.7,56.8,128.9C57.0,128.2,57.0,128.2,56.6,127.9C55.6,127.3,54.4,128.2,54.2,129.8C54.0,130.5,54.0,130.6,54.3,131.0C54.5,131.3,54.6,131.6,54.7,132.1C54.7,132.3,54.8,132.4,54.9,132.4C55.0,132.5,55.9,132.4,56.5,132.3ZM42.8,132.1C43.3,131.1,43.2,129.4,42.6,128.4C42.0,127.4,40.9,127.2,40.2,128.0C40.1,128.1,40.1,128.2,40.3,128.6C40.6,129.5,40.6,130.5,40.4,131.3C40.4,131.7,40.3,131.7,40.9,131.8C41.2,131.9,41.7,132.0,42.0,132.0C42.3,132.1,42.6,132.2,42.6,132.2C42.7,132.2,42.7,132.1,42.8,132.1ZM58.1,132.0C58.3,131.9,58.6,131.9,58.6,131.9C58.7,131.9,58.9,131.8,59.1,131.8C59.7,131.7,59.6,131.7,59.5,131.2C59.4,130.4,59.4,129.5,59.7,128.7C59.9,128.1,59.9,128.1,59.4,127.7C59.1,127.5,58.3,127.5,57.9,127.8C57.1,128.4,56.7,129.8,56.9,131.2C57.2,132.2,57.2,132.2,58.1,132.0ZM38.1,131.9C38.3,131.8,38.7,131.7,39.2,131.7C40.1,131.7,40.1,131.7,40.2,131.2C40.8,128.4,38.7,126.2,37.3,128.1C37.0,128.5,37.0,128.5,37.2,128.9C37.6,129.7,37.7,130.0,37.7,131.1C37.7,132.1,37.7,132.0,38.1,131.9ZM62.3,131.9C62.3,131.9,62.3,131.7,62.3,131.4C62.2,130.6,62.4,129.6,62.8,128.9C63.0,128.5,63.0,128.4,62.7,128.0C61.5,126.5,59.7,127.8,59.7,130.2C59.7,131.1,59.9,131.7,60.1,131.7C60.5,131.6,61.7,131.8,61.9,131.9C62.1,132.0,62.3,132.0,62.3,131.9Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'swords':
            o += '<path d="' + 'M 78.8 179.5 C 78.2 179.3 77.6 178.9 77.2 178.4 C 76.6 177.7 76.4 176.9 76.3 175.1 C 76.1 173.7 76.0 173.2 75.3 172.5 C 73.9 171.1 71.7 169.4 70.0 168.2 C 69.2 167.6 69.2 167.6 68.7 167.6 C 68.0 167.6 68.0 167.6 66.0 169.9 C 64.8 171.3 64.7 171.4 64.7 171.6 C 64.7 173.0 63.0 174.2 61.8 173.6 C 60.5 172.9 61.0 170.6 62.6 170.1 C 62.9 170.0 62.9 170.0 64.2 168.3 C 65.5 166.4 65.7 166.1 65.8 165.8 C 65.8 165.5 65.8 165.5 65.3 165.2 C 65.1 165.0 63.0 163.6 60.8 162.0 C 54.8 157.9 52.9 156.6 50.7 154.9 C 50.2 154.6 49.9 154.4 49.8 154.4 C 49.8 154.4 49.4 154.7 49.0 155.0 C 46.8 156.6 44.9 157.9 40.2 161.2 C 33.7 165.7 34.2 165.3 34.2 165.6 C 34.3 166.0 34.5 166.3 35.8 168.1 C 37.0 169.7 37.1 169.8 37.3 169.8 C 38.9 170.3 39.5 172.5 38.3 173.3 C 37.2 174.1 35.3 172.8 35.3 171.4 C 35.3 171.2 35.2 171.1 34.1 169.8 C 32.1 167.5 32.0 167.4 31.3 167.4 C 30.9 167.4 30.9 167.4 30.0 168.0 C 28.3 169.1 26.4 170.7 24.8 172.2 C 24.0 173.0 23.8 173.4 23.7 175.2 C 23.6 175.9 23.5 176.6 23.4 177.0 C 22.5 179.9 19.3 180.2 17.9 177.6 C 16.2 174.8 17.6 171.4 22.1 167.5 C 22.5 167.2 24.0 166.0 25.4 164.9 C 27.9 162.9 27.9 162.9 27.9 162.6 C 27.8 162.2 27.6 161.9 26.3 160.1 C 25.1 158.4 25.0 158.3 24.8 158.3 C 23.1 157.8 22.5 155.4 24.0 154.7 C 25.1 154.2 26.5 155.2 26.8 156.6 C 26.8 156.9 26.8 156.9 28.2 158.6 C 30.0 160.6 30.1 160.7 30.7 160.7 C 31.0 160.7 31.0 160.7 31.9 160.1 C 35.9 157.5 45.1 150.9 45.1 150.7 C 45.1 150.7 44.4 150.1 43.5 149.3 C 35.9 143.3 31.1 138.9 27.2 134.6 C 21.5 128.1 18.2 122.0 17.4 116.2 C 17.2 114.6 17.1 112.5 17.3 111.0 C 17.5 109.7 17.4 109.7 17.9 110.5 C 22.6 119.1 26.8 124.3 32.6 128.4 C 33.1 128.7 33.4 129.0 33.4 129.0 C 33.4 129.0 33.4 129.2 33.4 129.4 C 32.8 132.6 36.8 137.4 45.3 143.9 C 47.1 145.2 49.8 147.3 49.9 147.3 C 49.9 147.3 50.3 147.0 50.7 146.7 C 51.1 146.4 51.9 145.8 52.5 145.3 C 58.7 140.8 62.3 137.5 64.5 134.7 C 66.2 132.4 67.0 130.4 66.6 128.9 C 66.5 128.8 66.7 128.7 67.4 128.2 C 69.3 126.8 70.7 125.7 72.4 124.0 C 75.9 120.4 78.8 116.5 82.1 110.5 C 82.6 109.5 82.5 109.5 82.7 110.8 C 83.5 118.4 80.2 126.1 72.4 134.8 C 68.5 139.1 63.8 143.3 55.6 149.9 C 55.0 150.4 54.6 150.7 54.6 150.8 C 54.6 150.9 62.5 156.5 66.5 159.2 C 69.1 161.0 68.9 160.9 69.3 160.9 C 69.9 160.9 70.0 160.8 71.9 158.6 C 73.2 157.1 73.2 157.1 73.3 156.8 C 73.5 155.1 75.4 154.1 76.4 155.2 C 77.4 156.1 76.7 157.9 75.3 158.4 C 75.0 158.5 75.0 158.5 73.7 160.3 C 72.3 162.1 72.1 162.4 72.1 162.8 C 72.1 163.1 72.1 163.1 74.7 165.2 C 77.8 167.6 77.9 167.7 78.8 168.5 C 82.2 171.7 83.5 174.7 82.4 177.3 C 82.0 178.3 81.3 179.1 80.3 179.4 C 80.0 179.6 79.2 179.6 78.8 179.5 Z M 80.1 178.7 C 80.8 178.5 81.6 177.7 81.9 176.6 C 82.4 175.0 81.8 173.1 80.2 171.0 C 79.8 170.5 78.2 168.9 77.6 168.4 C 76.6 167.6 72.8 164.5 72.7 164.5 C 72.6 164.5 72.6 164.6 73.1 165.9 C 73.7 167.4 73.7 167.5 73.5 167.9 C 73.3 168.2 73.1 168.2 72.1 168.1 C 71.0 167.9 71.1 167.9 71.1 168.0 C 71.1 168.0 71.3 168.2 71.5 168.4 C 73.6 169.8 76.1 172.1 76.4 172.8 C 76.8 173.4 76.9 173.9 77.0 175.1 C 77.1 176.1 77.1 176.4 77.3 176.9 C 77.6 178.3 78.8 179.1 80.1 178.7 Z M 21.0 178.6 C 21.8 178.4 22.5 177.7 22.7 176.7 C 22.9 176.3 22.9 175.9 23.0 175.2 C 23.1 173.5 23.3 172.8 23.9 172.1 C 24.5 171.4 27.9 168.4 28.9 167.9 C 29.0 167.8 29.0 167.7 28.8 167.7 C 27.2 168.0 26.8 168.0 26.6 167.7 C 26.3 167.4 26.3 167.3 26.9 165.8 C 27.3 164.5 27.4 164.3 27.3 164.3 C 27.2 164.3 22.9 167.8 22.0 168.6 C 18.4 171.8 17.2 174.6 18.3 176.9 C 18.9 178.2 19.9 178.8 21.0 178.6 Z M 79.2 177.8 C 78.1 177.3 77.9 174.9 78.9 174.0 C 79.0 173.9 79.1 173.8 79.1 173.8 C 79.1 173.6 79.7 173.7 80.0 173.8 C 81.1 174.4 81.2 177.0 80.1 177.8 C 79.8 177.9 79.4 178.0 79.2 177.8 Z M 20.1 177.6 C 19.4 177.4 19.0 176.3 19.1 175.3 C 19.5 172.8 21.6 173.0 21.7 175.4 C 21.8 177.0 21.0 178.1 20.1 177.6 Z M 79.8 177.4 C 80.2 177.1 80.5 176.2 80.4 175.5 C 80.1 173.6 78.8 173.8 78.8 175.8 C 78.8 177.0 79.3 177.8 79.8 177.4 Z M 20.8 177.0 C 21.7 176.1 21.2 173.5 20.2 174.0 C 19.5 174.5 19.4 176.4 20.1 177.1 C 20.3 177.4 20.5 177.4 20.8 177.0 Z M 63.0 172.9 C 63.5 172.6 63.9 172.1 63.9 171.5 C 63.9 171.1 63.9 171.1 65.4 169.4 C 67.0 167.6 67.2 167.4 67.6 167.2 C 68.2 166.8 68.4 166.8 70.8 167.2 C 73.0 167.5 72.9 167.5 72.9 167.4 C 72.9 167.4 72.6 166.4 72.1 165.3 C 71.4 163.4 71.4 163.4 71.4 162.9 C 71.4 162.1 71.4 162.2 73.2 159.7 C 74.6 157.8 74.6 157.8 74.8 157.8 C 76.1 157.6 76.7 155.5 75.4 155.5 C 74.7 155.5 74.0 156.2 74.0 157.0 C 74.0 157.4 74.0 157.4 72.4 159.2 C 70.0 161.9 70.2 161.8 67.5 161.4 C 66.6 161.3 65.7 161.2 65.5 161.1 C 65.1 161.1 65.0 161.1 65.0 161.2 C 65.0 161.2 65.4 162.1 65.8 163.2 C 66.9 166.1 66.9 165.8 64.7 168.8 C 63.3 170.7 63.3 170.7 63.1 170.7 C 61.7 170.9 61.2 173.0 62.5 173.0 C 62.7 173.0 62.8 173.0 63.0 172.9 Z M 38.0 172.7 C 38.7 172.2 37.9 170.5 36.9 170.5 C 36.7 170.5 36.8 170.6 35.3 168.6 C 33.5 166.2 33.5 166.1 33.5 165.3 C 33.5 164.9 33.5 164.8 34.3 162.9 C 34.7 161.8 35.0 160.9 35.0 160.9 C 35.0 160.9 34.0 161.0 32.9 161.2 C 29.7 161.6 30.0 161.7 27.5 158.9 C 26.0 157.2 26.0 157.2 26.0 156.8 C 26.0 156.0 25.3 155.3 24.6 155.3 C 24.1 155.3 23.9 155.6 23.9 156.1 C 23.9 156.8 24.5 157.5 25.2 157.6 C 25.4 157.6 25.5 157.7 26.8 159.5 C 29.0 162.5 29.0 162.2 27.8 165.2 C 27.4 166.2 27.1 167.2 27.1 167.2 C 27.1 167.2 27.1 167.3 27.3 167.2 C 27.3 167.2 28.3 167.1 29.4 166.9 C 32.4 166.5 32.1 166.4 34.6 169.2 C 36.1 170.9 36.1 170.9 36.1 171.2 C 36.1 172.3 37.3 173.2 38.0 172.7 Z M 69.6 165.9 C 67.8 165.6 67.8 165.6 67.2 164.0 C 66.8 163.1 66.6 162.4 66.6 162.3 C 66.6 162.3 70.0 162.9 70.0 162.9 C 70.1 163.0 71.3 166.1 71.3 166.1 C 71.3 166.2 71.3 166.2 71.3 166.2 C 71.3 166.2 70.5 166.1 69.6 165.9 Z M 28.7 165.9 C 28.7 165.9 29.9 162.8 30.0 162.7 C 30.0 162.7 30.1 162.7 30.2 162.6 C 30.3 162.6 31.1 162.5 31.9 162.4 C 32.7 162.2 33.4 162.1 33.4 162.2 C 33.4 162.2 33.2 162.9 32.8 163.8 C 32.1 165.4 32.1 165.4 30.5 165.7 C 28.9 166.0 28.7 166.0 28.7 165.9 Z M 70.7 165.6 C 70.7 165.5 69.8 163.2 69.7 163.2 C 69.6 163.2 67.4 162.8 67.3 162.8 C 67.2 162.8 67.2 162.8 67.7 164.1 C 68.1 165.3 68.1 165.3 68.3 165.3 C 68.6 165.4 70.5 165.7 70.6 165.7 C 70.7 165.7 70.7 165.7 70.7 165.6 Z M 30.7 165.3 C 31.3 165.2 31.9 165.1 31.9 165.1 C 31.9 165.0 32.8 162.7 32.8 162.7 C 32.8 162.7 32.8 162.7 32.7 162.7 C 32.5 162.7 30.3 163.0 30.2 163.1 C 30.2 163.1 29.3 165.3 29.3 165.4 C 29.3 165.5 29.4 165.5 30.7 165.3 Z M 65.4 164.2 C 65.4 164.2 65.1 163.5 64.8 162.7 C 64.5 162.0 64.3 161.2 64.3 161.1 C 64.2 160.9 64.2 160.9 62.8 160.0 C 55.7 155.5 50.0 151.3 43.1 145.5 C 33.7 137.8 28.0 131.6 24.3 125.3 C 23.9 124.6 23.9 124.6 24.1 124.5 C 24.3 124.4 24.3 124.4 24.4 124.6 C 24.4 124.7 24.7 125.2 25.0 125.7 C 28.4 131.3 33.5 136.9 41.3 143.5 C 48.7 149.8 55.6 154.9 63.2 159.8 C 64.4 160.5 64.6 160.6 64.5 160.4 C 64.5 160.3 64.5 160.3 64.7 160.3 C 66.9 160.6 67.0 160.6 67.0 160.5 C 67.0 160.5 66.6 160.2 66.1 159.9 C 61.9 157.0 56.6 153.2 50.8 148.9 C 49.9 148.2 48.4 147.1 47.5 146.5 C 42.5 142.7 39.9 140.6 37.5 138.2 C 34.1 134.8 32.6 132.3 32.6 129.9 C 32.6 129.3 32.6 129.3 32.1 128.9 C 26.9 125.2 22.6 120.2 18.6 113.3 C 18.3 112.8 18.0 112.3 18.0 112.3 C 17.9 112.3 17.9 114.4 18.0 115.2 C 18.5 119.5 20.1 123.6 23.0 128.0 C 27.0 133.9 32.7 139.7 42.6 147.7 C 49.0 153.0 51.0 154.4 60.7 161.1 C 63.0 162.7 65.0 164.1 65.0 164.1 C 65.2 164.3 65.4 164.3 65.4 164.2 Z M 37.1 162.4 C 38.5 161.5 40.5 160.1 41.6 159.3 C 44.0 157.7 45.7 156.5 47.2 155.4 C 47.8 154.9 48.5 154.4 48.8 154.3 C 49.0 154.1 49.2 153.9 49.2 153.9 C 49.2 153.8 47.7 152.7 47.6 152.7 C 47.6 152.7 47.2 152.9 46.8 153.3 C 44.0 155.3 40.4 157.8 37.1 159.9 C 35.8 160.7 35.8 160.7 35.7 160.9 C 35.7 161.0 35.5 161.8 35.2 162.5 C 34.6 164.0 34.6 164.1 34.7 164.1 C 34.7 164.1 35.8 163.3 37.1 162.4 Z M 33.9 160.3 C 35.0 160.1 35.2 160.1 35.4 160.3 C 35.6 160.4 35.6 160.4 36.9 159.5 C 41.1 156.8 47.2 152.6 47.2 152.4 C 47.2 152.3 46.0 151.3 45.8 151.3 C 45.8 151.3 45.2 151.7 44.4 152.3 C 40.8 154.9 36.8 157.7 33.8 159.7 C 33.1 160.2 32.9 160.4 33.0 160.4 C 33.1 160.4 33.5 160.3 33.9 160.3 Z M 55.7 148.9 C 67.0 139.8 72.7 134.1 76.9 127.9 C 80.3 122.8 82.0 118.2 82.1 113.4 C 82.1 111.9 82.1 111.9 81.8 112.5 C 77.7 119.6 73.4 124.7 68.1 128.6 C 67.4 129.1 67.4 129.1 67.4 129.7 C 67.4 132.1 65.9 134.7 62.6 138.0 C 60.1 140.4 57.5 142.5 52.5 146.2 C 51.4 147.0 50.6 147.7 50.6 147.7 C 50.5 147.8 51.9 148.8 52.0 148.8 C 52.1 148.8 57.2 144.6 59.7 142.5 C 67.1 136.1 72.3 130.3 75.4 124.9 C 75.7 124.2 75.7 124.2 75.9 124.3 C 76.1 124.4 76.1 124.4 75.8 124.9 C 71.7 132.0 65.1 138.9 53.5 148.1 C 52.9 148.6 52.3 149.1 52.3 149.1 C 52.3 149.2 53.8 150.3 53.9 150.3 C 54.0 150.3 54.8 149.7 55.7 148.9 Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'tree':
            o += '<path d="' + 'M 49.7 182.7 C 49.7 182.5 49.6 182.4 49.6 182.3 C 49.6 182.3 49.5 182.2 49.5 182.0 C 49.2 181.7 49.2 181.6 49.3 181.1 C 49.4 180.5 49.3 180.3 49.1 180.1 C 48.0 179.6 47.5 178.2 48.2 178.0 C 48.5 178.0 48.5 178.0 48.4 178.1 C 48.1 178.5 48.4 179.0 48.8 178.8 C 49.4 178.3 49.5 177.0 49.0 176.5 C 48.1 175.8 46.9 176.6 46.9 177.9 C 46.9 178.8 46.5 179.1 45.6 179.1 C 44.7 179.2 44.4 178.4 45.2 178.1 C 45.5 178.0 45.5 178.0 45.3 178.1 C 45.2 178.2 45.2 178.6 45.3 178.6 C 45.6 178.6 46.0 178.1 46.4 177.1 C 46.7 176.1 47.1 175.6 47.5 175.4 C 47.8 175.2 47.6 175.0 47.1 175.0 C 46.3 175.1 45.3 176.1 45.3 176.8 C 45.3 177.7 44.3 178.3 43.2 178.0 C 42.3 177.7 42.6 176.8 43.6 176.8 C 43.9 176.8 43.9 176.8 43.4 177.0 C 42.8 177.4 42.8 177.5 43.1 177.6 C 43.7 177.9 44.1 177.6 44.7 176.4 C 44.8 176.1 44.9 175.8 45.0 175.8 C 45.0 175.7 45.1 175.4 45.1 175.2 C 45.3 174.3 45.6 174.1 47.3 173.0 C 47.8 172.7 48.3 172.3 48.4 172.0 C 48.7 171.4 48.8 159.5 48.5 158.4 C 48.1 156.8 47.0 155.8 46.0 155.8 C 44.7 155.8 44.1 157.0 45.1 157.5 C 45.6 157.8 46.4 157.4 46.4 156.8 C 46.4 156.7 46.5 156.9 46.6 157.1 C 46.9 157.6 46.3 158.2 45.4 158.2 C 44.2 158.2 43.6 157.2 44.3 156.2 C 44.5 155.9 44.5 155.6 44.4 155.5 C 43.8 155.0 42.4 155.0 42.3 155.5 C 42.3 155.8 42.4 156.0 42.7 156.0 C 43.3 156.1 43.4 156.2 42.8 156.4 C 42.3 156.5 41.7 156.4 41.5 156.1 C 41.4 156.1 41.5 156.0 41.6 155.8 C 42.4 154.5 42.1 152.9 40.9 152.9 C 40.2 152.9 40.4 151.4 41.2 151.1 C 41.8 151.0 42.5 151.6 42.3 152.1 C 42.1 152.6 42.3 153.7 42.8 154.3 C 43.1 154.8 43.5 154.9 44.0 154.6 C 44.3 154.5 44.3 154.4 43.9 154.3 C 43.2 153.9 42.8 153.3 43.1 153.1 C 43.3 152.9 44.1 153.0 44.1 153.1 C 44.1 153.7 45.8 155.0 46.4 154.9 C 46.8 154.9 46.7 154.4 46.2 153.9 C 46.0 153.7 45.6 153.2 45.2 152.7 C 44.3 151.5 43.8 151.1 43.0 151.0 C 42.7 151.0 42.6 150.9 42.4 150.8 C 41.9 150.4 42.1 150.2 42.9 150.3 C 43.5 150.5 43.6 150.4 42.9 149.7 C 42.5 149.2 42.1 148.9 41.8 148.9 C 41.7 148.8 41.4 148.8 41.3 148.7 C 39.9 148.0 38.4 148.0 37.4 148.6 C 37.3 148.8 37.1 148.8 37.1 148.8 C 36.9 148.8 36.3 149.2 36.0 149.5 C 35.0 150.5 35.0 152.7 36.0 153.9 C 37.2 155.3 39.8 153.3 38.9 151.6 C 38.7 151.0 38.8 150.1 39.1 150.3 C 39.6 150.5 39.9 152.3 39.6 152.9 C 39.5 153.0 39.5 153.2 39.5 153.3 C 39.5 153.9 38.7 154.7 37.9 154.9 C 36.6 155.3 35.5 154.6 35.2 153.4 C 35.0 152.5 34.8 152.5 33.9 153.3 C 33.2 154.0 32.8 153.9 32.7 153.3 C 32.6 153.2 32.6 153.0 32.4 152.9 C 32.0 152.6 32.1 152.5 33.0 152.4 C 33.8 152.3 34.0 152.2 34.1 151.9 C 34.3 151.3 34.2 151.2 33.7 151.5 C 32.4 152.0 31.8 151.6 31.8 150.2 C 31.8 149.7 31.9 149.7 32.1 150.1 C 32.3 150.6 32.8 150.8 33.6 150.7 C 34.6 150.5 35.3 150.0 34.9 149.7 C 34.7 149.6 34.3 149.6 34.3 149.7 C 34.3 150.0 33.7 149.8 33.3 149.3 C 32.8 148.8 32.7 148.4 33.0 148.1 C 33.1 148.0 33.2 148.0 33.7 148.5 C 34.0 148.7 34.2 148.9 34.4 148.9 C 34.6 149.0 34.5 149.0 35.9 148.4 C 37.5 147.7 39.3 147.2 39.9 147.4 C 40.7 147.6 41.0 147.2 40.7 146.1 C 40.6 145.8 40.5 145.3 40.4 144.9 C 40.1 143.6 39.6 143.2 38.4 143.2 C 36.8 143.1 35.2 143.7 34.6 144.6 C 33.8 145.7 34.2 146.6 35.6 147.2 C 36.7 147.8 38.4 146.2 37.9 144.9 C 37.8 144.5 37.7 144.5 37.2 144.5 C 36.3 144.4 36.7 144.1 37.6 144.1 C 38.4 144.1 38.7 144.3 38.7 145.2 C 38.7 147.6 34.9 148.8 33.9 146.7 C 33.4 145.6 33.8 144.1 34.8 143.4 C 35.4 143.0 37.9 142.3 39.0 142.3 C 40.1 142.3 40.2 142.0 39.5 140.9 C 38.7 139.7 37.8 139.2 37.2 139.5 C 36.8 139.8 36.8 140.3 37.4 140.8 C 38.0 141.3 38.0 141.3 37.7 141.3 C 36.8 141.3 36.1 139.7 36.9 139.2 C 37.6 138.7 38.5 138.9 39.4 139.8 C 40.1 140.5 40.3 140.7 41.2 142.7 C 41.4 143.2 41.9 144.2 42.3 145.0 C 42.7 145.9 43.4 147.1 43.7 147.7 C 44.6 149.5 44.9 149.9 45.5 150.6 C 47.1 152.4 48.0 152.9 48.5 152.1 C 48.7 151.8 48.7 151.8 48.3 151.2 C 47.3 149.8 46.3 148.8 45.8 149.0 C 45.2 149.1 45.2 149.0 45.2 148.1 C 45.3 147.4 45.1 147.1 44.7 147.1 C 44.5 147.1 44.5 147.0 44.6 147.0 C 44.7 146.9 44.6 146.3 44.4 145.8 C 44.1 145.2 44.2 145.1 44.5 145.3 C 44.6 145.4 45.0 145.5 45.3 145.7 C 46.2 146.1 46.3 146.3 45.7 146.3 C 44.7 146.3 46.3 148.5 47.5 148.8 C 47.8 148.9 48.0 148.8 48.3 148.6 C 49.1 148.0 48.7 147.4 46.6 145.7 C 45.9 145.2 45.6 145.0 44.5 144.3 C 43.0 143.5 42.4 141.9 43.2 140.9 C 44.0 140.0 45.1 140.5 44.6 141.5 C 44.4 141.8 44.4 141.8 44.3 141.5 C 43.9 140.8 43.4 141.2 43.5 142.2 C 43.5 143.2 44.0 143.9 45.1 144.2 C 46.1 144.6 46.7 144.4 45.9 144.0 C 45.6 143.8 45.5 143.8 45.5 143.5 C 45.5 143.0 46.7 143.4 47.2 144.1 C 47.3 144.3 47.4 144.4 47.4 144.6 C 47.4 144.9 47.6 145.4 47.9 145.5 C 48.4 145.8 49.0 145.4 49.0 144.6 C 49.0 143.1 49.1 143.2 48.4 142.5 C 47.8 141.9 47.7 141.8 47.9 141.5 C 48.0 141.4 48.1 141.4 48.5 141.4 C 49.0 141.4 49.0 141.3 48.3 140.8 C 47.9 140.4 47.5 140.0 47.4 139.8 C 47.3 139.4 45.2 138.1 44.1 137.8 C 43.3 137.6 42.7 137.7 42.6 138.0 C 42.6 138.2 43.4 138.3 43.9 138.2 C 44.3 138.1 43.7 138.7 43.1 138.9 C 42.1 139.4 41.5 138.7 42.1 137.8 C 42.4 137.4 42.5 137.1 42.6 136.0 C 42.8 134.5 42.9 134.2 43.7 134.1 C 43.9 134.0 44.2 133.9 44.3 133.9 C 44.9 133.7 45.4 134.1 45.5 134.9 C 45.6 135.4 45.3 135.7 44.9 135.5 C 44.7 135.4 44.7 135.4 44.9 135.2 C 45.3 134.9 45.1 134.7 44.5 134.7 C 43.9 134.8 43.4 135.2 43.5 135.5 C 43.7 136.4 44.2 137.0 45.4 137.5 C 45.7 137.7 46.3 138.0 46.6 138.1 C 47.0 138.3 47.4 138.6 47.7 138.7 C 48.2 139.2 48.5 139.2 48.8 139.1 C 49.7 138.6 49.9 136.5 49.1 135.9 C 48.4 135.4 48.0 135.5 47.9 136.2 C 47.8 136.9 47.6 137.0 47.2 136.6 C 46.0 135.4 48.0 134.3 49.3 135.3 C 49.7 135.6 49.8 135.6 49.8 135.1 C 49.8 134.3 49.1 133.6 48.5 134.0 C 48.4 134.1 48.4 134.1 48.4 134.0 C 48.2 133.6 48.4 133.4 49.2 132.9 C 49.6 132.6 49.8 132.4 49.8 132.3 C 50.0 132.0 50.0 132.0 50.1 132.3 C 50.2 132.4 50.4 132.6 50.8 132.9 C 51.5 133.3 51.7 133.5 51.7 133.7 C 51.7 134.0 51.6 134.1 51.5 134.0 C 50.9 133.6 50.2 134.3 50.2 135.1 C 50.2 135.6 50.3 135.6 50.7 135.3 C 51.2 134.9 51.7 134.8 52.3 135.0 C 53.2 135.2 53.5 135.9 52.9 136.5 C 52.4 137.0 52.2 136.9 52.1 136.3 C 52.1 135.6 51.9 135.4 51.3 135.7 C 50.6 136.0 50.2 136.8 50.5 137.9 C 50.7 139.1 51.5 139.5 52.3 138.8 C 52.6 138.5 52.9 138.3 54.0 137.8 C 55.7 137.0 56.3 136.6 56.5 135.6 C 56.6 135.3 56.4 135.1 56.0 134.9 C 55.2 134.6 54.6 134.8 55.1 135.2 C 55.3 135.4 55.3 135.4 55.1 135.5 C 54.7 135.7 54.5 135.5 54.5 134.9 C 54.6 134.1 55.1 133.7 55.7 133.9 C 55.8 133.9 56.1 134.0 56.3 134.1 C 57.1 134.2 57.3 134.6 57.4 136.0 C 57.5 136.9 57.6 137.3 57.9 137.8 C 58.6 138.9 57.7 139.5 56.5 138.7 C 55.8 138.3 55.8 138.1 56.2 138.2 C 57.0 138.4 57.7 138.1 57.2 137.8 C 56.7 137.5 55.8 137.7 54.7 138.3 C 53.8 138.7 52.6 139.6 52.6 139.8 C 52.6 140.0 52.1 140.4 51.6 140.9 C 51.0 141.3 51.0 141.4 51.5 141.4 C 51.9 141.4 52.0 141.4 52.1 141.5 C 52.3 141.8 52.2 141.9 51.6 142.5 C 51.3 142.8 51.0 143.1 51.0 143.2 C 51.0 143.4 51.0 144.3 51.0 144.6 C 51.0 145.4 51.6 145.9 52.2 145.5 C 52.4 145.3 52.6 144.8 52.6 144.6 C 52.6 144.3 52.7 144.1 53.1 143.8 C 53.6 143.2 54.5 143.1 54.5 143.5 C 54.5 143.8 54.4 143.8 54.1 144.0 C 53.3 144.4 53.9 144.6 54.9 144.2 C 55.9 143.9 56.4 143.3 56.6 142.4 C 56.7 141.4 56.1 140.7 55.7 141.5 C 55.6 141.8 55.6 141.8 55.4 141.5 C 55.1 140.9 55.3 140.5 55.9 140.5 C 56.7 140.5 57.2 141.2 57.1 142.2 C 57.0 143.2 56.5 143.8 55.2 144.5 C 54.4 145.0 54.2 145.1 53.2 145.9 C 51.2 147.4 50.9 148.2 51.9 148.8 C 52.4 149.0 53.0 148.7 53.8 147.9 C 54.6 147.1 54.9 146.3 54.3 146.3 C 53.7 146.3 53.8 146.1 54.7 145.7 C 55.0 145.5 55.4 145.4 55.5 145.3 C 55.8 145.1 55.9 145.2 55.6 145.8 C 55.3 146.4 55.3 146.8 55.4 147.0 C 55.5 147.1 55.5 147.1 55.4 147.1 C 54.9 147.1 54.7 147.4 54.8 148.1 C 54.8 148.4 54.8 148.7 54.8 148.8 C 54.8 149.0 54.5 149.0 54.2 149.0 C 53.9 148.9 53.9 148.9 53.3 149.4 C 52.6 149.9 51.4 151.5 51.4 151.8 C 51.4 152.4 52.1 152.6 52.8 152.2 C 54.0 151.4 55.0 150.2 56.1 148.0 C 56.5 147.3 57.1 146.2 57.5 145.5 C 58.5 143.9 58.7 143.4 59.2 142.0 C 60.1 139.7 62.5 138.3 63.6 139.3 C 63.9 139.6 63.9 140.2 63.7 140.6 C 63.5 140.9 63.4 140.9 62.9 140.7 C 62.5 140.6 62.5 140.5 62.9 140.5 C 63.5 140.5 63.6 140.2 63.1 139.8 C 62.6 139.2 62.1 139.4 61.0 140.6 C 60.0 141.7 59.9 142.1 60.8 142.0 C 61.3 141.9 63.7 142.7 65.0 143.3 C 65.8 143.7 66.4 144.9 66.3 145.9 C 66.1 147.6 64.6 148.3 62.9 147.4 C 61.0 146.5 60.7 143.9 62.5 144.0 C 63.4 144.1 63.7 144.5 62.8 144.5 C 62.5 144.5 62.4 144.5 62.3 144.6 C 61.5 145.5 62.5 147.3 63.9 147.3 C 64.4 147.3 64.4 147.3 65.3 146.7 C 66.4 145.9 65.6 144.1 63.9 143.6 C 61.5 142.8 59.9 143.2 59.7 144.6 C 59.7 144.7 59.5 145.2 59.4 145.6 C 59.0 147.1 59.1 147.5 59.9 147.4 C 61.1 147.2 62.7 147.7 64.7 148.7 C 65.5 149.1 65.7 149.1 66.3 148.4 C 66.8 147.9 67.0 147.9 67.1 148.3 C 67.2 148.6 67.2 148.6 67.1 148.8 C 66.7 149.5 65.7 150.2 65.7 149.7 C 65.7 149.6 65.3 149.6 65.1 149.7 C 64.8 149.9 65.0 150.2 65.6 150.5 C 66.7 150.9 67.6 150.8 67.9 150.1 C 68.1 149.7 68.2 149.7 68.2 150.2 C 68.2 151.6 67.6 152.0 66.3 151.5 C 65.9 151.3 65.8 151.3 65.8 151.6 C 65.9 152.2 66.1 152.3 67.0 152.4 C 67.9 152.5 68.0 152.6 67.6 152.9 C 67.5 153.0 67.4 153.1 67.4 153.2 C 67.3 153.4 67.2 153.7 67.1 153.7 C 66.9 153.9 66.7 153.8 65.9 153.1 C 65.2 152.5 65.0 152.5 64.8 153.3 C 64.7 154.0 64.5 154.2 64.2 154.5 C 63.0 155.5 60.8 154.8 60.5 153.4 C 60.5 153.2 60.4 153.0 60.4 152.9 C 60.1 152.3 60.5 150.5 60.9 150.3 C 61.2 150.1 61.3 151.1 61.1 151.6 C 60.2 153.2 62.7 155.3 64.0 153.9 C 65.4 152.4 64.9 149.6 63.1 148.9 C 63.0 148.9 62.7 148.7 62.6 148.6 C 61.6 148.0 60.1 148.0 58.8 148.6 C 58.5 148.8 58.3 148.9 58.2 148.9 C 57.9 149.0 57.5 149.3 57.1 149.8 C 56.5 150.4 56.5 150.5 57.1 150.3 C 57.9 150.2 58.1 150.4 57.6 150.8 C 57.4 150.9 57.3 151.0 57.0 151.0 C 56.3 151.1 55.6 151.6 54.8 152.7 C 54.6 153.0 54.2 153.5 53.9 153.8 C 53.3 154.4 53.2 154.9 53.6 154.9 C 54.2 155.0 55.9 153.7 55.9 153.1 C 55.9 153.0 56.8 152.9 56.9 153.1 C 57.2 153.4 56.8 153.9 56.1 154.3 C 55.6 154.5 55.9 154.8 56.5 154.8 C 57.3 154.7 58.0 153.0 57.7 152.1 C 57.5 151.6 58.2 151.0 58.8 151.1 C 59.6 151.4 59.8 152.9 59.1 152.9 C 57.9 152.9 57.5 154.4 58.4 155.8 C 58.5 156.0 58.6 156.1 58.5 156.1 C 58.3 156.4 57.7 156.5 57.2 156.4 C 56.6 156.2 56.7 156.1 57.3 156.0 C 57.6 156.0 57.8 155.8 57.7 155.5 C 57.5 155.0 56.1 155.0 55.6 155.5 C 55.5 155.6 55.5 155.9 55.7 156.2 C 56.4 157.3 55.8 158.2 54.5 158.1 C 53.5 158.1 53.1 157.6 53.4 157.1 C 53.5 156.8 53.6 156.8 53.7 157.0 C 53.9 157.7 54.9 157.8 55.3 157.1 C 55.5 156.8 55.3 156.2 54.8 156.0 C 53.5 155.3 52.1 156.4 51.5 158.4 C 51.3 159.3 51.3 170.7 51.5 171.9 C 51.6 172.2 52.1 172.7 53.2 173.3 C 54.3 174.0 54.8 174.5 54.9 175.2 C 54.9 175.4 55.1 176.0 55.6 176.9 C 55.9 177.6 56.4 177.8 56.9 177.6 C 57.2 177.5 57.2 177.4 56.6 177.0 C 56.1 176.8 56.1 176.8 56.4 176.8 C 56.7 176.8 56.8 176.8 57.0 177.0 C 57.7 177.5 57.4 178.0 56.2 178.0 C 55.2 178.0 54.7 177.6 54.7 176.8 C 54.7 175.9 53.1 174.7 52.5 175.1 C 52.3 175.1 52.3 175.3 52.5 175.4 C 52.9 175.5 53.3 176.1 53.6 177.1 C 54.0 178.0 54.4 178.6 54.7 178.6 C 54.8 178.6 54.8 178.3 54.7 178.1 C 54.5 178.0 54.5 178.0 54.8 178.1 C 55.6 178.4 55.3 179.2 54.4 179.1 C 53.5 179.1 53.1 178.8 53.1 177.9 C 53.1 176.4 51.6 175.7 50.8 176.8 C 50.4 177.4 51.0 179.1 51.5 178.8 C 51.8 178.7 51.8 178.3 51.6 178.1 C 51.5 178.0 51.5 178.0 51.8 178.0 C 52.2 178.2 52.3 178.5 52.0 179.0 C 51.9 179.4 51.3 180.0 51.0 180.1 C 50.7 180.2 50.6 180.4 50.7 180.9 C 50.8 181.5 50.8 181.6 50.7 181.8 C 50.6 181.9 50.5 182.1 50.5 182.2 C 50.4 182.3 50.4 182.4 50.3 182.6 C 50.2 183.0 49.9 183.1 49.7 182.7 Z M 58.5 146.5 C 58.6 146.2 58.8 145.2 58.8 145.1 C 58.6 144.8 58.2 145.1 58.1 145.4 C 57.9 146.1 58.2 146.9 58.5 146.5 Z M 41.8 146.2 C 42.0 145.7 41.8 145.0 41.4 144.8 C 41.1 144.7 41.1 144.9 41.3 145.8 C 41.5 146.5 41.7 146.6 41.8 146.2 Z M 22.3 143.3 C 22.3 143.2 21.7 140.5 21.7 140.5 C 21.7 140.4 21.3 140.6 20.2 141.3 C 20.0 141.4 20.0 141.4 20.1 141.3 C 20.5 140.6 21.0 139.7 20.9 139.7 C 20.8 139.7 18.2 139.1 18.1 139.0 C 18.0 139.0 19.2 138.7 20.6 138.5 C 21.0 138.4 21.0 138.4 20.5 137.5 C 20.2 137.0 20.0 136.7 20.1 136.7 C 20.1 136.7 20.4 136.9 20.9 137.1 C 21.5 137.6 21.7 137.6 21.7 137.6 C 21.7 137.5 22.3 134.8 22.4 134.8 C 22.4 134.7 22.5 135.4 22.7 136.2 C 22.9 136.9 23.0 137.6 23.1 137.6 C 23.1 137.6 24.3 136.9 24.6 136.7 C 24.7 136.6 24.7 136.6 24.6 136.8 C 24.2 137.5 23.8 138.3 23.8 138.3 C 23.8 138.3 24.4 138.5 25.2 138.7 C 26.0 138.9 26.7 139.0 26.7 139.0 C 26.7 139.0 26.5 139.1 26.3 139.1 C 24.8 139.4 23.8 139.7 23.8 139.7 C 23.8 139.8 24.0 140.1 24.2 140.5 C 24.5 141.0 24.7 141.3 24.7 141.3 C 24.7 141.4 24.4 141.2 23.9 140.9 C 23.5 140.7 23.1 140.5 23.1 140.5 C 23.0 140.5 22.9 141.1 22.7 141.9 C 22.4 143.4 22.4 143.4 22.3 143.3 Z M 77.3 141.9 C 77.1 141.1 77.0 140.5 76.9 140.5 C 76.9 140.5 75.7 141.1 75.4 141.3 C 75.3 141.4 75.3 141.4 75.3 141.4 C 76.3 139.6 76.3 139.7 75.9 139.6 C 75.8 139.6 75.1 139.4 74.5 139.3 C 73.9 139.2 73.3 139.0 73.3 139.0 C 73.3 139.0 73.5 139.0 73.7 138.9 C 75.2 138.6 76.2 138.4 76.2 138.3 C 76.2 138.3 75.8 137.5 75.4 136.8 C 75.3 136.6 75.3 136.6 75.4 136.7 C 75.8 137.0 76.9 137.6 76.9 137.6 C 77.0 137.6 77.1 136.9 77.3 136.2 C 77.5 135.4 77.6 134.7 77.6 134.7 C 77.7 134.7 77.8 135.2 77.9 135.9 C 78.1 136.5 78.2 137.2 78.2 137.3 C 78.3 137.5 78.3 137.6 78.3 137.6 C 78.4 137.6 79.2 137.1 79.8 136.8 C 80.0 136.7 80.0 136.7 79.5 137.5 C 79.3 137.9 79.1 138.3 79.1 138.3 C 79.1 138.3 79.5 138.5 79.9 138.6 C 80.4 138.7 81.0 138.8 81.4 138.9 C 81.7 138.9 81.9 139.0 81.9 139.0 C 81.9 139.0 81.2 139.2 79.3 139.6 C 79.2 139.6 79.1 139.7 79.1 139.7 C 79.1 139.8 79.7 140.9 79.9 141.3 C 80.0 141.4 80.0 141.4 79.9 141.3 C 79.4 141.0 78.4 140.5 78.3 140.5 C 78.3 140.5 78.3 140.4 78.0 142.0 C 77.8 142.7 77.7 143.3 77.6 143.3 C 77.6 143.3 77.5 142.7 77.3 141.9 Z M 25.8 128.2 C 25.6 127.3 25.4 126.7 25.4 126.7 C 25.3 126.7 25.0 126.8 24.6 127.1 C 24.2 127.3 23.8 127.5 23.8 127.5 C 23.7 127.6 23.9 127.3 24.4 126.4 C 24.7 125.8 24.8 125.9 23.1 125.5 C 22.3 125.3 21.7 125.2 21.7 125.2 C 23.7 124.8 24.6 124.6 24.6 124.5 C 24.6 124.4 24.5 124.2 24.4 124.0 C 23.7 122.8 23.7 122.8 23.9 123.0 C 24.8 123.5 25.3 123.7 25.4 123.7 C 25.4 123.7 25.6 123.1 25.8 122.2 C 25.9 121.4 26.1 120.8 26.1 120.9 C 26.1 120.9 26.2 121.6 26.4 122.3 C 26.6 123.4 26.7 123.7 26.8 123.7 C 26.8 123.7 27.2 123.6 27.5 123.4 C 28.5 122.8 28.4 122.8 28.2 123.2 C 28.1 123.4 27.9 123.7 27.8 124.0 C 27.4 124.6 27.3 124.5 29.0 124.9 C 29.8 125.1 30.5 125.2 30.4 125.2 C 30.4 125.2 29.7 125.4 29.0 125.5 C 27.4 125.9 27.4 125.8 27.8 126.4 C 28.5 127.6 28.5 127.6 28.1 127.4 C 27.9 127.3 27.5 127.1 27.3 126.9 C 26.7 126.5 26.8 126.3 26.1 129.5 C 26.1 129.6 25.9 129.0 25.8 128.2 Z M 73.7 128.7 C 73.2 126.4 73.3 126.5 72.7 126.9 C 71.4 127.7 71.5 127.7 72.1 126.6 C 72.3 126.3 72.5 126.0 72.5 125.9 C 72.4 125.8 71.6 125.6 69.6 125.2 C 69.5 125.2 70.2 125.1 71.0 124.9 C 72.7 124.5 72.6 124.6 72.2 124.0 C 72.1 123.7 71.9 123.4 71.8 123.2 C 71.6 122.8 71.5 122.8 72.7 123.5 C 73.3 123.9 73.2 123.9 73.6 122.3 C 73.8 121.5 73.9 120.9 73.9 120.8 C 73.9 120.8 74.1 121.5 74.3 122.3 C 74.6 123.9 74.6 123.9 75.2 123.5 C 76.3 122.8 76.3 122.8 76.1 123.2 C 76.0 123.4 75.8 123.7 75.6 124.0 C 75.3 124.6 75.2 124.5 76.9 124.9 C 77.7 125.1 78.3 125.2 78.3 125.2 C 78.2 125.2 77.6 125.4 76.8 125.5 C 75.2 125.9 75.3 125.8 75.6 126.4 C 76.3 127.6 76.3 127.6 75.9 127.4 C 75.8 127.3 75.4 127.1 75.2 126.9 C 74.6 126.6 74.6 126.5 74.3 128.1 C 74.1 128.8 74.0 129.5 73.9 129.5 C 73.9 129.6 73.8 129.2 73.7 128.7 Z M 48.3 128.4 C 47.6 128.3 46.8 128.2 46.6 128.1 C 46.4 128.0 46.4 128.0 46.5 127.9 C 46.7 127.7 46.6 127.6 46.5 127.7 C 46.3 127.7 46.3 127.7 46.4 127.3 C 46.4 126.6 46.4 126.1 46.2 125.7 C 46.0 125.1 46.0 124.9 46.2 125.0 C 46.8 125.3 46.9 125.4 47.2 125.6 C 47.4 125.8 47.5 125.8 47.8 125.7 C 48.1 125.6 48.1 125.6 48.3 125.8 C 48.4 125.9 48.6 126.0 48.6 126.1 C 48.8 126.1 49.1 126.3 49.1 126.4 C 49.1 126.5 48.9 126.5 48.7 126.5 C 48.0 126.6 47.6 126.7 47.6 126.8 C 47.6 126.8 47.7 126.8 47.8 126.8 C 49.3 126.6 51.1 126.6 52.4 126.9 C 53.0 127.0 52.9 127.0 52.9 126.9 C 52.9 126.8 52.2 126.6 51.5 126.5 C 51.1 126.5 50.9 126.4 50.9 126.4 C 50.9 126.3 51.2 126.1 51.4 126.1 C 51.4 126.0 51.6 125.9 51.7 125.8 C 51.9 125.6 51.9 125.6 52.2 125.7 C 52.5 125.8 52.6 125.8 52.8 125.6 C 53.1 125.4 53.2 125.3 53.8 125.0 C 54.0 124.9 54.0 125.1 53.8 125.7 C 53.6 126.1 53.6 126.6 53.6 127.3 C 53.7 127.7 53.7 127.7 53.6 127.7 C 52.0 127.0 50.0 126.8 48.3 127.1 C 47.9 127.2 48.0 127.3 48.4 127.3 C 50.1 127.0 52.3 127.3 53.3 127.8 C 53.6 128.0 53.6 128.0 53.4 128.1 C 52.6 128.4 50.2 128.5 48.3 128.4 Z M 49.2 126.1 C 48.7 125.3 48.9 123.8 49.6 123.1 C 49.8 122.9 49.8 122.9 49.7 123.4 C 49.7 123.9 49.7 124.0 49.6 124.0 C 49.1 124.4 49.0 125.4 49.4 126.1 C 49.6 126.5 49.4 126.5 49.2 126.1 Z M 50.6 126.1 C 51.0 125.4 50.9 124.4 50.4 124.0 C 50.3 124.0 50.3 123.9 50.3 123.4 C 50.2 122.9 50.2 122.9 50.4 123.1 C 51.1 123.8 51.3 125.3 50.8 126.1 C 50.6 126.5 50.4 126.5 50.6 126.1 Z M 49.9 125.9 C 49.9 125.7 49.9 125.6 49.7 125.6 C 49.6 125.6 49.6 125.6 49.6 125.5 C 49.6 125.4 49.6 125.3 49.5 125.3 C 49.4 125.2 49.4 125.2 49.5 125.2 C 49.6 125.2 49.6 125.1 49.6 125.0 C 49.6 124.8 49.6 124.8 49.7 124.9 C 49.9 124.9 49.9 124.9 49.9 124.6 C 50.0 124.2 50.0 124.2 50.1 124.6 C 50.1 124.9 50.1 124.9 50.3 124.9 C 50.4 124.8 50.4 124.8 50.4 125.0 C 50.4 125.1 50.4 125.2 50.5 125.2 C 50.6 125.3 50.6 125.3 50.5 125.3 C 50.4 125.4 50.3 125.4 50.4 125.5 C 50.4 125.6 50.4 125.6 50.3 125.6 C 50.1 125.6 50.1 125.7 50.1 125.9 C 50.0 126.3 50.0 126.3 49.9 125.9 Z M 48.5 125.6 C 48.1 125.1 48.0 124.8 48.0 124.0 C 48.0 123.2 48.0 123.2 48.3 123.7 C 48.5 124.0 48.5 124.1 48.6 124.7 C 48.7 125.8 48.7 125.9 48.5 125.6 Z M 51.3 125.6 C 51.3 124.6 51.7 123.3 52.0 123.3 C 52.1 123.3 52.0 124.7 51.8 125.1 C 51.5 125.7 51.3 125.9 51.3 125.6 Z M 47.0 125.3 C 46.9 125.2 46.9 125.2 46.9 125.2 C 46.9 125.2 46.7 125.0 46.4 124.9 C 46.0 124.7 46.0 124.7 45.9 124.5 C 45.7 124.1 45.7 124.1 46.0 124.3 C 46.3 124.6 46.8 124.8 46.8 124.7 C 46.8 124.6 46.0 124.1 45.9 124.1 C 45.9 124.1 45.6 123.7 45.6 123.7 C 45.6 123.6 45.7 123.7 45.8 123.7 C 46.0 123.9 46.5 124.1 46.6 124.1 C 46.8 124.1 46.6 124.0 46.3 123.8 C 45.8 123.6 45.6 123.3 45.5 123.1 C 45.4 122.6 45.5 122.6 45.8 123.0 C 45.9 123.2 46.1 123.3 46.1 123.3 C 46.2 123.3 46.2 123.4 46.2 123.4 C 46.2 123.5 46.3 123.5 46.3 123.5 C 46.3 123.5 46.5 123.6 46.6 123.7 C 46.8 123.9 46.9 123.9 46.9 123.8 C 46.9 123.7 46.6 123.5 46.5 123.5 C 46.5 123.5 46.4 123.4 46.4 123.4 C 46.4 123.3 46.4 123.3 46.3 123.3 C 46.1 123.3 45.4 122.1 45.4 121.7 C 45.4 121.4 45.5 121.4 46.2 122.5 C 46.5 122.9 46.7 123.3 46.9 123.5 C 47.0 123.8 47.1 123.9 47.1 124.0 C 47.1 124.1 47.1 124.1 47.1 124.2 C 47.2 124.2 47.2 124.4 47.1 124.4 C 47.1 124.5 47.1 124.5 47.1 124.7 C 47.2 124.9 47.2 124.9 47.1 125.0 C 47.1 125.0 47.1 125.1 47.1 125.1 C 47.1 125.2 47.1 125.3 47.1 125.3 C 47.1 125.3 47.1 125.3 47.0 125.3 Z M 52.9 125.1 C 52.9 125.1 52.9 125.0 52.9 125.0 C 52.8 124.9 52.8 124.9 52.9 124.7 C 52.9 124.5 52.9 124.5 52.9 124.4 C 52.8 124.4 52.8 124.2 52.9 124.1 C 53.0 124.1 53.0 123.9 52.9 123.9 C 52.9 123.9 53.0 123.7 53.1 123.5 C 53.3 123.3 53.5 122.9 53.8 122.5 C 54.5 121.4 54.6 121.4 54.6 121.7 C 54.6 122.0 54.5 122.3 54.1 122.8 C 54.0 123.0 53.8 123.2 53.8 123.2 C 53.8 123.4 54.0 123.3 54.3 123.0 C 54.5 122.6 54.6 122.6 54.5 123.1 C 54.4 123.4 54.2 123.6 53.7 123.8 C 53.4 124.0 53.2 124.1 53.4 124.1 C 53.5 124.1 54.0 123.9 54.2 123.7 C 54.3 123.7 54.4 123.6 54.4 123.7 C 54.4 123.7 54.1 124.1 54.1 124.1 C 54.0 124.1 53.2 124.6 53.2 124.7 C 53.2 124.8 53.7 124.6 54.0 124.3 C 54.3 124.1 54.3 124.1 54.1 124.5 C 54.0 124.7 54.0 124.7 53.6 124.9 C 53.3 125.0 53.1 125.2 53.1 125.2 C 53.1 125.2 53.1 125.2 53.0 125.3 C 52.9 125.3 52.9 125.3 52.9 125.1 Z M 53.4 123.7 C 53.5 123.6 53.7 123.5 53.7 123.5 C 53.8 123.5 53.8 123.4 53.8 123.4 C 53.8 123.3 53.6 123.3 53.6 123.4 C 53.6 123.4 53.5 123.5 53.5 123.5 C 53.4 123.5 53.1 123.7 53.1 123.8 C 53.1 123.9 53.2 123.9 53.4 123.7 Z M 48.5 123.4 C 48.4 123.2 48.2 122.9 48.2 122.8 C 48.1 122.7 48.1 122.7 48.2 122.5 C 48.2 122.3 48.2 122.3 48.3 122.5 C 48.3 122.6 48.5 122.8 48.6 123.0 C 48.9 123.6 48.8 124.0 48.5 123.4 Z M 51.3 123.6 C 51.3 123.5 51.3 123.2 51.5 123.0 C 51.6 122.8 51.7 122.5 51.7 122.4 C 51.8 122.3 51.8 122.3 51.8 122.5 C 51.9 122.7 51.9 122.7 51.8 122.8 C 51.8 122.9 51.7 123.1 51.6 123.3 C 51.3 123.8 51.3 123.9 51.3 123.6 Z M 48.9 123.0 C 48.9 122.8 48.7 122.6 48.6 122.4 C 48.6 122.2 48.5 122.0 48.5 121.8 C 48.4 121.4 48.5 121.4 48.6 121.7 C 48.7 121.9 48.8 122.2 48.9 122.4 C 49.0 122.7 49.1 122.8 49.1 123.0 C 49.1 123.2 49.1 123.2 48.9 123.0 Z M 50.9 123.0 C 50.9 122.8 51.0 122.6 51.1 122.4 C 51.2 122.2 51.3 121.9 51.3 121.8 C 51.5 121.4 51.6 121.4 51.5 121.8 C 51.5 122.1 51.4 122.3 51.1 122.9 C 50.9 123.3 50.9 123.3 50.9 123.0 Z M 49.3 122.6 C 49.3 122.5 49.2 122.1 49.0 121.8 C 48.8 121.2 48.7 121.0 48.9 120.7 C 49.1 120.3 49.1 120.3 49.1 120.8 C 49.1 121.1 49.2 121.4 49.3 121.8 C 49.5 122.3 49.5 122.5 49.4 122.6 C 49.4 122.7 49.4 122.7 49.3 122.6 Z M 50.6 122.6 C 50.5 122.5 50.5 122.3 50.7 121.8 C 50.8 121.4 50.9 121.1 50.9 120.8 C 50.9 120.3 50.9 120.3 51.1 120.7 C 51.3 121.0 51.2 121.2 50.9 121.8 C 50.8 122.1 50.7 122.4 50.7 122.5 C 50.7 122.6 50.6 122.7 50.6 122.6 Z M 49.8 122.1 C 49.8 122.0 49.7 121.8 49.6 121.6 C 49.3 120.9 49.4 120.0 49.7 119.6 C 49.9 119.5 49.9 119.5 49.9 120.8 C 49.8 121.6 49.8 122.2 49.8 122.2 C 49.8 122.3 49.8 122.2 49.8 122.1 Z M 50.2 122.0 C 50.1 120.0 50.1 119.5 50.3 119.6 C 50.6 120.0 50.7 120.9 50.4 121.5 C 50.3 121.7 50.3 121.9 50.2 122.0 C 50.2 122.3 50.2 122.3 50.2 122.0 Z M 35.9 118.0 C 35.5 116.4 35.6 116.4 34.9 116.8 C 34.7 116.9 34.4 117.1 34.2 117.2 C 33.8 117.5 33.8 117.5 34.5 116.3 C 34.8 115.7 34.9 115.8 33.2 115.4 C 32.4 115.2 31.8 115.1 31.8 115.1 C 33.8 114.7 34.7 114.4 34.7 114.4 C 34.7 114.3 34.6 114.0 34.3 113.6 C 33.9 112.8 33.8 112.7 33.9 112.8 C 33.9 112.8 34.3 113.0 34.7 113.2 C 35.1 113.5 35.4 113.6 35.5 113.6 C 35.5 113.6 35.7 113.0 35.9 112.1 C 36.0 111.3 36.2 110.7 36.2 110.7 C 36.2 110.8 36.3 111.4 36.5 112.2 C 36.9 113.8 36.8 113.7 37.4 113.4 C 38.6 112.7 38.5 112.7 38.4 112.9 C 37.9 113.8 37.6 114.3 37.7 114.4 C 37.7 114.4 38.2 114.6 39.0 114.7 C 39.7 114.9 40.4 115.0 40.5 115.1 C 40.6 115.1 40.2 115.2 39.1 115.4 C 38.2 115.6 37.7 115.8 37.7 115.8 C 37.6 115.8 37.8 116.2 38.1 116.6 C 38.3 117.0 38.5 117.4 38.5 117.4 C 38.5 117.4 38.4 117.4 37.6 116.9 C 37.3 116.7 37.0 116.6 36.9 116.6 C 36.8 116.6 36.7 116.9 36.5 118.0 C 36.3 118.8 36.2 119.4 36.2 119.5 C 36.2 119.5 36.0 118.8 35.9 118.0 Z M 63.6 118.4 C 63.4 117.7 63.3 117.1 63.2 116.9 C 63.2 116.5 63.1 116.5 62.4 116.9 C 61.6 117.4 61.5 117.4 61.5 117.4 C 61.5 117.4 61.7 117.0 61.9 116.6 C 62.2 116.2 62.4 115.8 62.3 115.8 C 62.3 115.7 61.8 115.6 60.9 115.4 C 60.1 115.2 59.4 115.1 59.4 115.1 C 59.4 115.1 60.1 114.9 60.9 114.8 C 61.8 114.6 62.3 114.4 62.3 114.4 C 62.4 114.3 62.2 114.0 61.9 113.6 C 61.7 113.2 61.5 112.8 61.5 112.8 C 61.5 112.8 61.5 112.8 61.5 112.8 C 61.6 112.8 61.9 113.0 62.3 113.2 C 62.7 113.5 63.1 113.6 63.1 113.6 C 63.2 113.6 63.3 113.1 63.5 112.3 C 63.6 111.6 63.8 110.9 63.8 110.8 C 63.8 110.7 63.9 111.1 64.1 112.1 C 64.3 113.0 64.5 113.6 64.5 113.6 C 64.6 113.6 64.9 113.5 65.3 113.2 C 65.7 113.0 66.1 112.8 66.1 112.8 C 66.2 112.7 66.1 112.8 65.7 113.6 C 65.4 114.0 65.3 114.3 65.3 114.4 C 65.3 114.4 65.7 114.5 66.7 114.8 C 67.5 114.9 68.2 115.1 68.2 115.1 C 68.2 115.1 67.6 115.2 66.8 115.4 C 65.6 115.7 65.3 115.7 65.3 115.8 C 65.3 115.9 65.4 116.2 65.7 116.5 C 66.2 117.5 66.2 117.5 65.8 117.2 C 65.6 117.1 65.3 116.9 65.1 116.8 C 64.4 116.4 64.6 116.1 63.8 119.4 C 63.8 119.5 63.7 119.0 63.6 118.4 Z M 49.9 115.4 C 49.6 113.8 49.3 112.8 49.3 112.8 C 49.2 112.8 48.5 113.2 47.8 113.6 C 47.6 113.8 47.6 113.8 47.7 113.6 C 48.0 113.2 48.6 112.1 48.6 112.1 C 48.6 112.1 48.1 111.9 47.4 111.8 C 45.8 111.4 45.7 111.4 45.7 111.4 C 45.8 111.3 48.5 110.8 48.5 110.8 C 48.6 110.8 48.4 110.3 47.7 109.2 C 47.6 109.0 47.6 109.0 47.8 109.1 C 48.2 109.3 49.2 110.0 49.3 110.0 C 49.3 110.0 49.6 109.0 49.9 107.4 C 50.0 107.0 50.0 107.0 50.1 107.4 C 50.4 109.0 50.7 110.0 50.7 110.0 C 50.8 110.0 51.9 109.3 52.2 109.1 C 52.4 109.0 52.4 109.0 52.3 109.2 C 51.8 109.9 51.4 110.6 51.4 110.7 C 51.4 110.7 52.4 111.0 54.0 111.3 C 54.2 111.3 54.3 111.4 54.3 111.4 C 54.3 111.4 53.7 111.6 52.9 111.7 C 52.1 111.9 51.4 112.1 51.4 112.1 C 51.4 112.1 52.0 113.2 52.3 113.6 C 52.4 113.8 52.4 113.8 52.2 113.6 C 51.5 113.2 50.8 112.8 50.7 112.8 C 50.7 112.8 50.4 113.8 50.1 115.4 C 50.1 115.5 50.0 115.7 50.0 115.7 C 50.0 115.7 49.9 115.5 49.9 115.4 Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'bear':
            o += '<path d="' + 'M 69.9 212.0 C 69.7 211.9 69.5 211.6 69.5 211.4 C 69.4 211.2 69.1 211.1 68.8 211.1 C 68.2 211.1 67.8 210.6 67.8 209.7 C 67.8 209.4 67.7 209.1 67.6 209.1 C 67.1 209.1 66.5 207.6 66.5 206.2 C 66.5 205.5 66.4 204.7 66.2 204.4 C 65.1 202.2 66.7 199.0 68.8 199.2 C 70.6 199.5 72.4 198.3 72.4 196.8 C 72.4 195.7 65.9 183.1 64.7 181.8 C 60.7 177.3 59.2 179.2 50.6 201.0 C 47.3 209.2 47.9 208.7 44.9 207.4 C 41.7 205.9 39.1 204.2 38.6 203.2 C 38.0 202.2 37.5 202.1 37.3 203.0 C 37.2 203.9 36.6 203.3 36.5 202.0 C 36.4 201.5 36.3 201.0 36.1 201.0 C 35.7 201.0 35.3 198.6 35.4 196.5 C 35.5 192.6 35.6 191.9 36.2 191.3 C 36.4 191.1 36.7 190.5 36.8 190.0 C 37.7 186.8 40.0 187.6 40.6 191.3 C 40.8 192.7 42.8 195.5 43.6 195.5 C 44.2 195.5 44.3 194.8 44.6 188.7 C 44.9 184.3 45.4 179.5 45.8 178.4 C 45.9 177.9 45.9 176.7 45.7 174.4 C 45.4 169.7 45.6 167.9 46.9 163.1 C 48.2 158.5 48.2 157.6 47.4 154.0 C 46.5 150.6 45.8 146.5 45.4 142.0 C 44.8 137.3 45.1 137.6 42.6 138.8 C 34.8 142.4 30.1 142.3 25.8 138.2 C 24.7 137.1 24.3 137.0 23.9 138.0 C 23.6 138.8 23.2 138.6 23.0 137.6 C 23.0 137.1 22.8 136.9 22.5 136.9 C 21.9 136.9 21.4 136.1 21.4 135.1 C 21.4 134.6 21.3 134.4 20.9 134.2 C 20.4 134.0 20.2 133.2 20.2 131.4 C 20.2 130.7 20.2 130.1 20.1 130.0 C 19.8 129.6 19.9 127.7 20.3 126.8 C 20.5 126.1 20.6 125.6 20.5 125.0 C 20.2 121.8 23.2 121.4 24.2 124.5 C 24.5 125.6 25.5 126.5 29.4 129.5 C 32.2 131.6 35.3 129.2 39.8 121.8 C 41.9 118.3 41.9 118.2 39.2 115.6 C 34.2 111.0 29.8 106.1 27.3 102.7 C 25.8 100.7 23.4 94.5 23.0 91.3 C 22.7 89.8 22.1 89.5 21.7 90.7 C 21.5 91.4 21.4 91.4 21.4 89.6 C 21.4 88.6 21.4 87.7 21.3 87.7 C 20.9 87.4 21.3 82.8 21.8 81.9 C 22.1 81.5 22.3 80.9 22.3 80.5 C 22.3 79.8 22.9 78.8 23.4 78.5 C 23.6 78.4 24.0 77.9 24.3 77.3 C 25.6 74.9 27.4 76.9 27.6 81.2 C 27.7 84.8 29.8 91.8 31.2 93.4 C 32.8 95.1 39.2 97.6 41.9 97.4 C 42.8 97.3 43.5 97.4 43.5 97.6 C 43.5 97.7 43.8 97.7 44.2 97.6 C 44.5 97.5 45.1 97.4 45.4 97.4 C 45.9 97.5 46.1 97.2 46.5 96.5 C 46.8 95.9 47.1 95.5 47.3 95.5 C 47.5 95.5 47.7 95.1 47.9 94.7 C 48.0 94.2 48.3 93.9 48.5 93.9 C 48.8 93.9 48.8 93.7 48.8 92.4 C 48.8 91.1 48.8 91.0 48.4 91.0 C 48.2 91.0 47.8 90.5 47.5 89.9 C 46.5 87.9 45.4 87.3 43.2 87.2 C 40.9 87.1 40.9 87.1 40.9 84.2 C 41.0 82.0 41.0 82.0 38.7 81.8 C 36.3 81.7 35.0 81.0 34.0 79.2 C 32.5 76.4 32.2 71.3 33.6 69.2 C 34.1 68.3 34.3 68.5 34.3 70.1 C 34.3 73.6 36.8 78.0 38.8 78.0 C 39.3 78.0 39.2 76.3 38.7 74.3 C 38.5 73.4 38.3 72.1 38.3 71.4 C 38.3 70.7 38.1 69.9 38.0 69.5 C 37.1 67.6 37.7 66.0 39.5 65.9 C 41.3 65.8 44.3 64.4 44.6 63.6 C 44.8 63.3 45.3 62.7 45.9 62.3 C 46.9 61.7 47.0 61.6 47.1 60.6 C 47.5 57.2 49.2 56.8 50.3 60.0 C 50.7 61.4 51.2 61.5 51.7 60.5 C 53.4 57.6 55.8 59.0 56.2 63.1 C 56.3 64.7 56.9 65.8 58.3 66.9 C 58.8 67.4 59.5 68.2 59.9 68.8 C 60.2 69.4 60.6 70.0 60.7 70.1 C 60.9 70.3 61.1 70.8 61.3 71.2 C 61.4 71.6 61.7 72.1 61.9 72.3 C 62.1 72.5 62.4 73.0 62.5 73.3 C 62.6 73.7 62.9 74.5 63.2 75.2 C 63.5 75.9 63.8 76.6 63.8 76.8 C 63.8 77.0 64.0 77.7 64.4 78.4 C 64.7 79.2 65.0 80.0 65.0 80.5 C 65.0 81.2 65.5 82.4 67.4 86.1 C 71.4 93.9 72.2 98.9 70.4 105.5 C 68.7 111.5 70.1 131.3 73.1 143.7 C 74.7 150.5 74.7 150.1 74.8 157.0 C 75.1 168.7 75.8 174.8 78.8 190.3 C 79.7 195.1 80.1 197.7 80.0 198.2 C 79.8 199.8 73.9 209.1 73.0 209.2 C 72.4 209.3 72.4 209.4 72.4 210.5 C 72.4 211.9 72.3 211.9 71.0 212.1 C 70.6 212.2 70.1 212.1 69.9 212.0 Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'griffin':
            o += '<path d="' + 'M 24.8 172.4 C 24.8 171.2 24.0 170.9 23.0 171.7 C 22.7 171.9 22.7 171.7 22.8 170.2 C 23.0 167.6 23.0 167.4 22.6 167.4 C 22.4 167.4 22.3 167.2 22.3 166.4 C 22.3 165.8 22.2 165.5 21.9 165.3 C 21.7 165.2 21.6 164.9 21.6 164.3 C 21.6 163.9 21.5 163.5 21.4 163.5 C 21.3 163.5 21.3 163.2 21.3 162.8 C 21.3 162.5 21.2 161.9 21.0 161.7 C 20.9 161.4 20.8 160.8 20.7 160.3 C 20.7 159.8 20.7 158.6 20.7 157.6 C 20.6 156.1 20.7 155.7 20.9 155.7 C 21.1 155.7 21.1 155.4 21.1 154.0 C 20.9 151.9 21.1 151.5 22.0 151.5 C 23.1 151.5 23.4 150.0 22.8 147.7 C 21.9 144.3 23.5 140.1 26.2 138.7 C 27.3 138.1 27.5 137.9 28.1 136.2 C 28.7 134.6 28.7 133.8 28.2 133.0 C 27.9 132.6 27.7 132.2 27.7 131.9 C 27.7 131.4 27.2 131.3 26.7 131.8 C 26.4 132.1 26.3 132.0 26.2 131.1 C 26.0 130.0 25.0 129.7 24.8 130.6 C 24.7 130.9 24.5 131.1 24.3 131.1 C 23.9 131.1 23.8 131.2 23.8 133.1 C 23.7 135.2 23.7 135.2 23.2 135.3 C 22.6 135.4 22.6 135.4 22.6 137.4 C 22.5 139.6 22.0 140.4 21.6 138.9 C 21.1 137.1 20.4 138.5 20.0 142.0 C 19.9 142.4 19.8 142.8 19.6 142.8 C 19.4 142.8 19.1 145.3 19.1 146.8 C 19.1 147.3 18.9 147.8 18.7 148.0 C 18.5 148.1 18.4 148.5 18.4 148.7 C 18.4 149.4 17.6 152.4 17.2 153.1 C 16.7 153.9 16.0 154.0 16.0 153.3 C 16.0 153.0 16.1 152.8 16.2 152.8 C 16.7 152.8 17.1 149.8 16.7 149.5 C 16.6 149.4 16.6 149.0 16.8 148.2 C 17.1 146.7 17.4 144.1 17.9 137.6 C 18.2 134.8 18.5 132.1 18.5 131.4 C 18.8 129.6 18.8 129.2 18.3 129.2 C 17.8 129.2 17.7 128.8 18.1 128.2 C 19.1 126.6 20.3 118.5 19.5 118.5 C 19.2 118.5 19.2 118.4 19.8 117.5 C 20.2 116.8 20.7 115.4 21.4 112.7 C 22.3 109.4 22.6 108.6 23.9 106.0 C 26.9 100.2 28.4 99.9 27.0 105.5 C 26.1 108.6 26.1 110.8 26.9 112.7 C 27.2 113.4 27.7 114.8 28.0 115.8 C 28.5 117.5 28.6 117.7 29.5 118.3 C 30.0 118.7 30.7 119.5 31.1 120.2 C 31.9 121.8 32.9 121.9 33.0 120.3 C 33.0 119.7 32.9 119.5 32.8 119.5 C 32.6 119.5 32.5 119.2 32.5 118.8 C 32.5 117.1 32.1 115.6 31.7 115.6 C 31.3 115.6 31.3 115.5 31.3 112.8 C 31.3 110.5 31.3 110.1 31.0 110.1 C 30.8 110.1 30.8 109.8 30.8 109.0 C 31.1 106.2 30.6 101.4 30.0 101.2 C 28.8 100.7 28.6 99.9 29.7 99.4 C 30.5 99.1 30.6 98.9 30.6 98.3 C 30.6 97.6 30.7 97.5 31.8 97.3 C 32.4 97.2 33.2 97.0 33.5 96.8 C 33.9 96.6 34.2 96.6 34.6 97.0 C 34.9 97.3 35.7 97.6 36.3 97.7 C 37.5 97.9 37.5 97.9 37.6 98.9 C 37.6 99.9 37.6 99.9 37.2 99.8 C 36.5 99.6 35.9 100.3 35.9 101.2 C 35.9 102.2 37.4 102.4 37.8 101.5 C 38.0 101.2 38.5 100.9 38.9 100.8 C 39.7 100.6 39.8 100.5 40.0 99.6 C 40.7 95.7 41.7 102.5 41.3 108.0 C 41.1 109.8 41.8 110.6 42.5 109.4 C 42.6 109.1 42.7 109.1 42.7 109.4 C 42.7 110.0 43.5 109.8 44.1 109.1 C 44.6 108.3 44.7 106.9 44.3 105.4 C 43.9 103.8 44.8 102.7 45.4 104.1 C 45.5 104.4 45.9 104.5 46.3 104.5 C 46.6 104.5 47.1 104.7 47.3 105.0 C 47.8 105.6 48.2 106.8 48.0 106.8 C 47.9 106.8 47.8 107.1 47.8 107.3 C 47.8 107.6 47.6 107.9 47.5 108.0 C 47.2 108.1 47.1 108.5 47.1 109.1 C 47.1 110.8 48.9 111.6 50.0 110.4 C 50.6 109.6 50.8 108.1 50.2 108.1 C 49.9 108.1 49.8 107.9 49.8 107.5 C 49.8 107.2 49.7 106.8 49.6 106.8 C 49.0 106.3 50.1 104.7 51.4 104.2 C 51.9 104.0 52.5 103.8 52.8 103.7 C 53.4 103.5 53.5 104.2 53.1 105.9 C 52.6 108.3 54.1 111.2 54.9 109.2 C 55.1 108.6 55.1 108.6 55.1 109.2 C 55.1 109.5 55.2 109.7 55.4 109.7 C 55.6 109.7 55.9 110.0 56.0 110.4 C 56.2 110.7 56.4 111.0 56.6 111.0 C 56.7 111.0 56.9 111.4 57.0 111.8 C 57.5 113.2 59.5 113.2 59.7 111.9 C 59.8 111.6 60.3 111.2 60.8 110.9 C 61.5 110.5 61.8 110.2 61.9 109.5 C 62.0 109.0 62.3 108.2 62.6 107.6 C 63.8 105.2 62.7 103.4 61.0 105.0 C 60.6 105.4 60.3 105.2 60.7 104.7 C 61.1 104.3 60.9 103.0 60.4 102.8 C 60.1 102.7 59.6 102.2 59.4 101.8 C 59.1 101.4 58.7 101.0 58.4 100.9 C 58.1 100.8 58.2 100.8 58.8 100.7 C 59.5 100.7 59.7 100.8 59.7 101.2 C 59.7 101.5 59.9 101.7 60.5 101.7 C 61.3 101.7 61.4 101.6 61.4 100.8 C 61.4 100.0 60.8 99.5 60.2 99.9 C 59.9 100.0 59.9 99.9 59.9 99.3 C 59.9 98.1 60.2 97.8 61.2 97.8 C 61.8 97.8 62.3 97.6 62.5 97.3 C 63.2 96.4 67.0 97.0 67.0 98.0 C 67.1 98.7 67.2 98.9 67.8 99.2 C 68.8 99.7 68.9 100.0 67.9 100.7 C 67.0 101.4 66.6 105.4 66.9 109.2 C 67.0 110.2 67.0 110.4 66.8 110.4 C 66.4 110.4 66.3 112.1 66.4 114.5 C 66.4 116.2 66.4 116.2 65.9 116.2 C 65.3 116.2 65.1 116.9 65.1 119.0 C 65.1 119.4 65.1 119.8 65.0 119.8 C 64.9 119.8 64.8 120.1 64.8 120.6 C 64.8 121.6 65.3 121.7 65.8 120.9 C 66.0 120.5 66.2 120.4 66.6 120.6 C 68.0 121.2 68.1 121.1 68.2 118.9 C 68.4 117.0 68.4 116.9 67.9 116.1 C 67.2 114.7 67.6 112.0 69.2 106.6 C 70.1 103.5 70.3 101.7 69.8 101.0 C 69.5 100.7 69.5 100.7 69.8 100.7 C 70.2 100.7 70.7 101.8 70.7 102.6 C 70.7 103.6 71.3 103.4 72.6 102.1 C 74.5 100.1 74.9 99.4 74.8 98.4 C 74.7 97.3 75.0 97.1 75.5 98.1 C 76.1 99.2 75.9 100.5 75.0 102.2 C 73.4 105.1 74.1 106.0 76.6 104.4 C 77.4 103.9 77.4 103.8 77.3 102.8 C 77.3 101.4 77.7 101.7 78.0 103.2 C 78.5 105.4 77.8 107.1 75.9 108.6 C 74.3 110.0 74.3 111.0 76.1 111.0 C 77.4 111.0 77.7 110.7 77.7 109.6 C 77.7 108.9 77.7 108.9 78.0 109.6 C 78.4 110.7 78.3 112.0 77.6 113.3 C 76.9 114.6 77.0 114.5 74.5 115.1 C 72.8 115.5 74.6 118.7 76.8 119.1 C 77.6 119.2 77.7 119.2 77.8 118.3 C 78.0 117.4 78.0 117.4 78.2 118.2 C 78.6 120.3 77.6 121.7 75.6 121.7 C 74.0 121.7 73.9 122.3 75.1 124.8 C 76.7 128.1 77.9 129.2 78.2 127.6 C 78.3 126.7 78.6 127.0 78.6 128.0 C 78.6 130.2 77.3 131.1 76.0 129.8 C 74.3 128.1 74.2 128.9 75.4 134.4 C 76.6 139.3 77.2 140.9 77.9 140.8 C 78.5 140.6 78.5 140.7 78.1 141.7 C 77.5 143.3 76.2 142.9 75.2 140.7 C 74.6 139.6 74.0 139.6 74.0 140.6 C 74.0 141.1 74.0 141.5 74.1 141.6 C 74.8 142.5 75.2 146.1 74.7 147.7 C 74.2 149.7 74.6 151.2 75.6 151.2 C 76.4 151.2 76.7 152.0 76.6 154.0 C 76.5 155.1 76.5 155.4 76.8 155.4 C 77.0 155.4 77.1 156.5 76.9 156.8 C 76.5 157.3 76.7 161.9 77.1 161.9 C 78.8 161.9 80.5 151.1 79.0 150.3 C 78.3 150.0 78.8 149.6 79.7 149.6 C 80.5 149.6 80.8 147.8 80.2 147.0 C 79.7 146.6 80.1 146.4 80.9 146.7 C 81.9 147.3 83.5 145.9 83.5 144.5 C 83.5 144.3 83.6 144.1 83.7 144.1 C 84.0 144.1 84.0 144.6 84.0 147.1 C 84.0 149.7 84.0 150.2 83.7 150.2 C 83.6 150.2 83.5 150.4 83.5 150.7 C 83.5 150.9 83.3 151.6 83.1 152.1 C 82.8 152.8 82.6 153.4 82.6 154.5 C 82.6 155.5 82.5 156.1 82.3 156.5 C 82.0 157.1 82.0 157.1 82.0 156.3 C 82.0 155.2 81.4 155.1 80.8 156.0 C 80.5 156.4 80.2 156.7 80.1 156.7 C 80.0 156.7 79.9 156.9 79.9 157.1 C 79.9 159.0 77.9 162.8 76.6 163.3 C 76.1 163.5 76.0 163.7 76.0 164.3 C 76.0 164.9 75.9 165.1 75.7 165.1 C 75.4 165.1 75.3 165.3 75.3 166.2 C 75.3 167.2 75.3 167.4 75.0 167.4 C 74.6 167.4 74.6 167.5 74.7 169.6 C 74.7 171.9 74.7 171.9 74.3 171.3 C 73.6 170.6 72.7 171.1 72.6 172.4 C 72.5 173.3 72.5 173.3 72.2 172.5 C 71.8 171.2 70.8 171.2 70.6 172.4 C 70.5 173.1 70.5 173.2 70.4 172.8 C 70.3 172.5 70.1 172.2 69.9 172.2 C 69.0 172.2 69.2 168.2 70.1 168.0 C 71.0 167.8 71.9 166.3 71.9 165.2 C 71.9 164.4 71.9 164.4 71.2 164.6 C 67.5 165.7 65.8 164.3 65.4 159.9 C 65.3 158.9 65.2 158.6 65.0 158.6 C 64.7 158.6 64.6 158.4 64.6 158.0 C 64.6 156.9 63.8 157.1 63.7 158.3 C 63.6 159.1 63.5 159.3 63.1 159.3 C 62.5 159.3 61.9 160.3 61.9 161.3 C 61.9 161.7 61.7 161.9 61.3 161.9 C 61.0 162.0 60.7 162.3 60.6 162.8 C 60.5 163.4 60.4 163.4 59.8 163.3 C 59.3 163.1 59.2 163.2 59.1 163.8 C 59.0 164.3 58.8 164.5 58.4 164.5 C 58.1 164.5 57.8 164.7 57.6 165.1 C 57.4 165.5 57.2 165.8 57.1 165.8 C 56.9 165.8 56.8 166.1 56.8 166.5 C 56.7 167.2 56.6 167.0 56.4 165.5 C 56.3 164.9 55.0 165.0 54.8 165.6 C 54.6 166.1 54.6 166.1 54.5 165.5 C 54.4 165.1 54.3 164.8 54.1 164.8 C 53.9 164.8 53.7 164.6 53.7 164.3 C 53.7 164.0 53.6 163.8 53.4 163.8 C 53.0 163.8 52.8 162.3 53.0 161.2 C 53.2 160.5 53.3 160.4 54.7 160.4 C 55.9 160.4 56.4 160.2 56.6 159.9 C 56.8 159.6 57.1 159.3 57.3 159.2 C 58.3 158.7 58.9 155.4 58.0 155.4 C 57.4 155.4 57.1 154.8 57.1 153.2 C 57.1 152.4 57.0 151.6 56.9 151.3 C 56.5 150.6 56.6 149.9 57.0 149.9 C 57.2 149.9 57.3 149.7 57.3 149.3 C 57.3 148.8 57.4 148.7 57.8 148.9 C 58.2 149.0 58.3 148.9 58.3 148.3 C 58.3 147.8 58.4 147.7 58.9 147.8 C 59.9 148.2 62.7 142.2 62.8 139.7 C 62.8 138.2 61.6 136.8 61.3 138.0 C 61.3 138.2 61.2 138.0 61.2 137.5 C 61.2 137.0 61.0 136.2 60.7 135.6 C 60.4 135.1 60.1 134.3 60.0 133.8 C 59.8 132.8 58.2 132.6 58.2 133.7 C 58.2 134.1 58.0 134.4 57.8 134.4 C 57.4 134.4 57.2 136.9 57.5 138.6 C 57.6 139.2 57.7 139.7 57.7 139.8 C 57.6 139.9 57.1 139.8 56.5 139.7 C 55.4 139.5 55.3 139.5 55.3 140.1 C 55.3 140.4 55.2 140.8 55.1 141.0 C 55.0 141.2 54.9 142.0 54.9 142.8 C 54.8 144.2 54.8 144.2 54.6 142.9 C 54.4 141.5 53.6 140.9 53.3 141.8 C 53.3 142.0 53.1 142.1 52.9 142.1 C 52.7 142.1 52.5 142.3 52.5 142.5 C 52.3 143.7 51.6 141.4 51.5 139.1 C 51.3 134.8 51.3 134.4 52.4 135.6 C 53.5 136.8 54.8 135.9 54.6 133.9 C 54.5 133.4 54.5 133.1 54.6 133.1 C 54.7 133.1 54.8 132.8 54.8 132.4 C 54.8 132.1 55.0 131.5 55.2 131.2 C 55.4 131.0 55.6 130.6 55.6 130.4 C 55.6 130.2 55.8 129.7 56.0 129.3 C 56.6 128.4 56.8 125.9 56.3 125.9 C 56.0 125.9 56.0 125.8 56.1 125.3 C 56.6 123.7 56.3 122.7 55.6 122.7 C 54.8 122.7 54.8 122.7 55.3 122.2 C 56.2 121.3 56.5 119.1 55.7 119.1 C 55.4 119.1 55.3 119.0 55.4 118.8 C 55.6 118.1 55.3 116.2 54.9 116.2 C 54.7 116.2 54.5 116.0 54.5 115.7 C 54.2 114.4 53.4 114.2 52.6 115.2 C 51.6 116.5 51.5 116.2 51.6 113.6 C 51.7 111.4 51.7 111.4 48.8 111.4 C 45.9 111.4 45.9 111.4 46.0 113.6 C 46.0 116.1 45.9 116.3 45.1 115.4 C 44.3 114.6 43.0 114.8 43.0 115.7 C 43.0 116.3 42.9 116.5 42.7 116.5 C 42.5 116.5 42.4 116.7 42.4 116.9 C 42.4 117.0 42.2 117.2 42.0 117.2 C 41.5 117.2 41.6 118.6 42.0 119.3 C 42.4 119.8 42.4 119.8 42.0 119.8 C 41.2 119.8 41.3 121.2 42.2 122.7 C 42.8 124.0 42.8 124.0 42.0 123.8 C 41.3 123.6 41.3 123.6 41.4 124.8 C 41.5 125.8 41.4 125.9 41.1 125.9 C 40.6 125.9 40.8 128.4 41.5 129.5 C 41.8 129.9 42.0 130.5 42.0 130.7 C 42.0 130.9 42.2 131.2 42.4 131.4 C 42.5 131.6 42.7 132.1 42.7 132.4 C 42.7 132.8 42.8 133.1 42.9 133.1 C 43.1 133.1 43.1 133.4 43.1 134.0 C 42.9 136.3 43.9 137.2 45.1 135.8 C 46.0 134.8 46.4 135.2 46.2 136.9 C 46.1 137.4 46.0 138.5 46.0 139.4 C 46.0 141.4 44.9 144.7 44.9 142.8 C 44.9 142.6 44.8 142.4 44.6 142.4 C 44.5 142.4 44.3 142.2 44.3 142.0 C 44.1 140.8 43.2 141.4 43.0 142.9 C 42.7 144.4 42.6 144.2 42.4 141.4 C 42.3 139.6 41.8 138.8 41.3 139.7 C 41.2 139.9 40.9 140.0 40.6 140.0 C 39.9 140.0 39.8 139.6 40.2 138.1 C 40.5 136.5 40.1 134.5 39.4 134.4 C 38.6 134.3 38.3 137.8 38.9 140.7 C 38.9 141.0 38.9 141.2 38.7 141.2 C 38.2 141.2 38.4 147.5 39.0 147.7 C 39.1 147.8 39.3 148.1 39.3 148.4 C 39.3 148.7 39.4 148.9 39.7 148.9 C 40.0 148.9 40.1 149.1 40.1 149.6 C 40.1 150.0 40.3 150.2 40.5 150.2 C 40.8 150.2 41.0 151.3 40.7 151.7 C 40.6 151.8 40.5 152.5 40.5 153.3 C 40.5 154.2 40.4 154.8 40.1 155.2 C 39.9 155.6 39.8 155.7 39.8 155.4 C 39.8 155.2 39.6 155.1 39.4 155.1 C 38.4 155.1 39.3 158.9 40.3 159.3 C 40.6 159.4 40.9 159.8 41.1 160.1 C 41.2 160.6 41.5 160.7 42.8 160.5 C 44.2 160.3 44.3 160.4 44.4 161.1 C 44.7 162.2 44.5 164.1 44.0 164.1 C 43.9 164.1 43.7 164.3 43.7 164.5 C 43.7 164.6 43.6 164.8 43.4 164.8 C 43.2 164.8 43.0 165.0 42.9 165.4 C 42.7 165.8 42.6 165.8 42.6 165.5 C 42.4 164.5 41.2 165.0 41.1 166.2 C 41.0 167.2 41.0 167.2 40.8 166.5 C 40.7 166.1 40.5 165.8 40.3 165.8 C 40.1 165.8 39.9 165.5 39.9 165.1 C 39.8 164.6 39.6 164.5 39.2 164.5 C 38.8 164.5 38.6 164.3 38.5 164.0 C 38.4 163.6 38.2 163.5 37.7 163.5 C 37.4 163.6 37.1 163.6 37.0 163.5 C 37.0 163.4 36.9 163.0 36.8 162.7 C 36.7 162.3 36.4 162.0 36.2 161.9 C 35.9 161.9 35.7 161.7 35.7 161.4 C 35.7 160.8 35.1 159.6 34.7 159.6 C 34.2 159.6 33.9 159.2 33.9 158.6 C 33.9 158.2 33.7 158.0 33.4 158.0 C 33.2 158.0 33.0 158.2 33.0 158.5 C 33.0 158.8 32.8 159.0 32.6 159.0 C 32.2 159.0 31.8 161.1 31.8 162.9 C 31.8 163.2 31.7 163.8 31.5 164.3 C 31.2 164.8 31.1 165.5 31.2 166.0 C 31.2 166.9 31.2 166.9 30.6 166.8 C 30.1 166.7 29.8 166.9 29.7 167.2 C 29.4 167.9 28.9 167.6 28.9 166.8 C 28.9 166.1 28.6 165.8 28.1 165.8 C 27.6 165.8 27.6 167.4 28.0 168.5 C 28.4 169.7 28.2 172.2 27.7 172.2 C 27.5 172.2 27.2 172.5 27.1 172.8 C 26.9 173.3 26.9 173.3 26.9 172.5 C 26.9 171.2 25.9 171.2 25.4 172.4 C 25.0 173.4 24.8 173.4 24.8 172.4 Z M 26.4 165.4 C 26.4 165.0 26.4 164.5 26.5 164.2 C 26.9 162.7 26.9 159.6 26.5 159.6 C 26.3 159.6 26.2 159.5 26.3 159.4 C 26.8 159.0 26.6 157.7 26.0 157.7 C 25.4 157.7 24.9 161.6 25.4 163.7 C 25.4 164.1 25.5 164.9 25.5 165.3 C 25.5 165.9 25.6 166.1 25.9 166.1 C 26.3 166.1 26.4 165.9 26.4 165.4 Z M 71.3 163.4 C 72.7 162.9 72.6 157.4 71.3 157.3 C 70.9 157.3 70.7 158.8 71.1 159.1 C 71.2 159.2 71.2 159.2 71.0 159.3 C 70.5 159.3 69.7 158.1 69.7 157.3 C 69.7 156.9 69.6 156.7 69.4 156.7 C 69.2 156.7 69.0 156.5 69.0 156.4 C 69.0 156.2 68.9 156.0 68.8 156.0 C 68.7 156.0 68.6 155.6 68.6 155.0 C 68.6 153.7 68.1 153.4 67.3 154.4 C 65.9 156.0 65.8 160.5 67.0 162.7 C 67.8 164.1 68.9 164.3 71.3 163.4 Z M 31.4 159.8 C 31.6 156.6 30.7 154.1 29.3 154.1 C 28.9 154.1 28.9 154.2 29.0 155.2 C 29.0 156.0 29.0 156.4 28.8 156.4 C 28.7 156.4 28.6 156.5 28.6 156.7 C 28.6 156.9 28.4 157.0 28.2 157.0 C 28.1 157.0 27.9 157.2 27.9 157.5 C 27.9 157.7 27.8 158.1 27.6 158.3 C 27.1 159.1 27.3 160.2 28.0 160.4 C 28.4 160.5 29.0 160.7 29.5 160.8 C 31.2 161.4 31.2 161.4 31.4 159.8 Z M 33.2 155.3 C 33.4 155.0 33.5 154.4 33.5 153.5 C 33.5 152.8 33.6 152.2 33.7 152.2 C 33.8 152.2 33.9 151.8 33.9 151.4 C 33.9 150.6 33.8 150.5 33.2 150.5 C 32.6 150.5 32.5 150.4 32.5 149.9 C 32.5 149.5 32.4 149.2 32.2 149.2 C 31.9 149.2 31.8 149.0 31.8 148.7 C 31.8 146.9 30.8 146.8 30.3 148.5 C 30.1 149.2 29.8 150.0 29.7 150.2 C 29.2 151.0 29.4 152.0 30.2 152.6 C 30.6 152.9 31.2 153.8 31.5 154.5 C 32.1 155.8 32.7 156.1 33.2 155.3 Z M 65.7 155.1 C 65.9 154.3 66.7 152.8 67.5 152.3 C 68.2 151.7 68.2 151.0 67.5 149.2 C 67.2 148.5 67.0 147.7 67.0 147.4 C 67.0 146.9 66.3 146.8 66.0 147.4 C 65.9 147.6 65.8 148.0 65.8 148.3 C 65.8 148.7 65.7 148.9 65.4 148.9 C 65.0 148.9 65.0 149.1 65.0 149.7 C 65.0 150.4 64.9 150.5 64.3 150.3 C 63.6 150.1 63.6 150.1 63.6 151.1 C 63.6 151.8 63.7 152.2 63.9 152.2 C 64.0 152.2 64.1 152.5 64.1 153.5 C 64.1 155.5 65.4 156.8 65.7 155.1 Z M 38.0 109.9 C 38.1 109.4 38.5 107.9 39.0 106.7 C 40.5 102.8 40.0 99.2 38.3 101.8 C 38.0 102.3 37.5 102.7 37.2 102.8 C 36.6 103.0 36.3 104.2 36.7 104.7 C 37.0 105.1 36.9 105.6 36.6 105.3 C 34.8 103.4 33.6 105.6 35.0 108.2 C 35.4 108.9 35.7 109.7 35.7 109.9 C 35.7 111.3 37.7 111.4 38.0 109.9 Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'crescent':
            o += '<path d="' + 'M 48.1 173.4 C 46.9 173.3 45.4 173.2 44.6 173.0 C 44.3 173.0 43.8 172.9 43.5 172.8 C 42.5 172.7 42.2 172.6 40.3 171.9 C 37.1 170.8 34.3 169.2 31.9 167.3 C 31.7 167.2 31.4 167.0 31.2 166.8 C 30.4 166.4 28.2 163.9 26.4 161.3 C 25.2 159.5 23.9 156.8 23.1 154.4 C 20.4 146.5 21.1 138.4 25.0 130.7 C 26.1 128.6 26.8 127.5 27.4 126.9 C 27.6 126.8 28.0 126.4 28.2 126.1 C 29.6 124.4 30.8 123.2 32.0 122.2 C 34.2 120.5 34.5 120.2 34.7 120.2 C 34.8 120.2 35.0 120.0 35.3 119.9 C 36.2 119.3 37.5 118.5 38.4 118.0 C 38.9 117.7 39.4 117.3 39.6 117.2 C 40.0 116.8 40.1 116.8 40.4 116.8 C 40.7 116.8 41.0 117.0 41.2 117.2 C 41.6 117.6 41.4 118.0 40.5 118.7 C 39.8 119.2 39.5 119.7 39.0 120.4 C 37.4 122.7 36.3 125.5 36.2 127.5 C 36.0 130.0 36.8 133.9 37.8 135.4 C 37.8 135.6 38.0 135.8 38.0 135.9 C 38.4 136.7 40.3 138.9 41.5 139.9 C 43.1 141.2 46.0 142.4 48.3 142.6 C 48.9 142.7 51.3 142.7 51.9 142.6 C 53.4 142.5 56.1 141.5 57.6 140.5 C 57.7 140.4 58.0 140.2 58.1 140.2 C 58.6 139.9 60.8 137.6 61.2 137.0 C 61.2 136.8 61.3 136.7 61.4 136.7 C 61.8 136.4 62.9 134.0 63.4 132.5 C 64.0 130.8 64.1 128.8 63.7 126.6 C 63.3 123.8 61.7 120.5 60.1 119.1 C 59.5 118.5 59.5 118.4 59.5 117.9 C 59.6 117.5 59.7 117.0 59.8 116.8 C 60.1 116.4 63.2 118.0 65.8 120.0 C 67.9 121.5 70.8 124.3 72.1 125.8 C 73.7 127.7 75.6 131.0 76.4 133.2 C 76.5 133.7 76.8 134.5 77.0 134.9 C 77.5 136.4 78.2 139.7 78.3 141.4 C 78.4 141.7 78.4 142.4 78.5 142.8 C 78.7 145.1 78.4 149.2 77.9 151.0 C 77.1 153.5 74.6 159.3 73.9 160.1 C 73.8 160.2 73.6 160.5 73.5 160.7 C 73.1 161.4 71.9 162.9 71.5 163.3 C 71.4 163.5 71.0 163.8 70.9 164.0 C 70.0 165.0 69.2 165.7 68.3 166.4 C 66.5 167.8 65.4 168.6 64.1 169.4 C 63.7 169.6 63.3 169.9 63.1 170.0 C 62.9 170.2 62.7 170.3 62.0 170.5 C 61.5 170.7 61.1 170.9 61.0 171.0 C 61.0 171.0 60.8 171.1 60.7 171.1 C 60.6 171.1 60.3 171.2 60.0 171.4 C 59.2 171.7 58.7 171.9 57.9 172.1 C 57.4 172.2 56.9 172.4 56.7 172.4 C 55.9 172.8 55.2 173.0 53.4 173.2 C 52.0 173.3 49.5 173.4 48.1 173.4 Z M 50.5 171.6 C 53.1 171.4 55.7 170.9 58.0 170.2 C 58.6 170.0 59.1 169.8 59.7 169.8 C 62.3 169.3 68.7 164.7 71.0 161.5 C 72.5 159.6 74.1 156.6 75.1 154.2 C 76.5 150.6 77.0 147.7 77.0 143.8 C 77.0 140.4 76.5 137.4 75.4 134.4 C 74.9 133.1 73.8 130.8 73.3 130.1 C 73.1 129.9 72.9 129.5 72.8 129.3 C 72.3 128.4 71.6 127.5 70.9 126.7 C 70.7 126.5 70.5 126.3 70.5 126.2 C 70.4 126.1 70.3 125.9 70.2 125.8 C 70.1 125.7 70.0 125.6 70.0 125.6 C 70.0 125.5 70.0 125.5 69.9 125.5 C 69.8 125.4 69.7 125.4 69.7 125.3 C 69.5 125.0 66.6 122.4 66.4 122.4 C 66.2 122.4 66.3 122.5 66.9 123.4 C 67.2 123.8 67.4 124.3 67.5 124.4 C 67.5 124.5 67.6 124.6 67.7 124.6 C 67.8 124.7 67.8 124.7 67.8 124.8 C 67.8 124.9 68.0 125.2 68.1 125.4 C 69.7 128.0 70.7 130.8 71.1 133.4 C 71.3 135.2 71.3 137.7 71.1 139.9 C 70.8 142.7 69.7 145.8 68.1 148.3 C 66.3 151.3 64.7 153.0 61.4 155.2 C 59.5 156.5 58.1 157.2 57.1 157.4 C 56.8 157.5 56.5 157.6 56.4 157.7 C 55.8 157.8 54.1 158.2 52.8 158.5 C 50.5 158.9 46.7 158.7 43.9 158.0 C 41.8 157.5 39.0 156.4 38.7 155.9 C 38.6 155.8 38.2 155.5 37.8 155.2 C 35.4 153.2 32.9 150.5 31.9 148.7 C 31.8 148.5 31.5 148.0 31.4 147.7 C 31.2 147.4 30.9 146.9 30.7 146.6 C 30.6 146.2 30.4 145.7 30.2 145.5 C 29.7 144.6 29.0 141.7 28.8 140.1 C 28.6 138.8 28.6 135.9 28.8 134.6 C 28.8 133.9 29.2 132.1 29.3 131.9 C 29.3 131.8 29.4 131.6 29.4 131.4 C 29.7 129.5 31.7 125.4 33.2 123.6 C 33.8 122.8 34.0 122.5 33.8 122.5 C 33.4 122.5 29.4 126.6 28.3 128.1 C 28.1 128.4 27.9 128.7 27.7 128.8 C 27.5 129.1 27.4 129.3 27.3 129.5 C 27.2 129.7 27.0 130.1 26.8 130.5 C 25.4 133.0 23.8 137.0 23.4 139.5 C 22.4 144.5 23.0 150.5 24.8 154.7 C 24.9 155.0 25.0 155.3 25.1 155.4 C 25.2 155.7 25.4 156.4 25.6 156.7 C 25.7 156.9 25.8 157.1 25.9 157.3 C 25.9 157.4 26.0 157.6 26.1 157.7 C 26.2 157.9 26.5 158.3 26.7 158.6 C 27.9 160.7 28.8 161.8 30.9 163.9 C 31.7 164.8 32.4 165.5 32.5 165.7 C 32.7 165.9 32.8 166.0 33.5 166.4 C 33.8 166.6 34.1 166.8 34.2 166.9 C 35.1 167.6 38.8 169.6 39.9 169.9 C 40.1 170.0 40.5 170.2 40.8 170.3 C 42.0 170.8 45.5 171.5 47.1 171.6 C 47.7 171.6 49.9 171.6 50.5 171.6 Z M 67.2 164.3 C 67.1 164.1 67.3 163.8 68.1 163.1 C 68.5 162.7 68.9 162.2 69.1 161.9 C 69.3 161.7 69.5 161.4 69.7 161.2 C 70.4 160.5 71.2 159.4 71.6 158.7 C 71.7 158.5 71.9 158.1 72.1 157.9 C 72.6 157.0 73.1 156.3 73.4 155.5 C 73.6 155.2 73.8 154.7 73.9 154.4 C 74.1 154.1 74.2 153.9 74.3 153.4 C 74.5 152.5 74.6 152.2 74.8 151.6 C 74.9 151.4 75.0 151.0 75.1 150.8 C 75.1 150.5 75.2 150.2 75.3 149.9 C 75.5 149.5 75.6 148.8 75.7 147.8 C 75.7 146.9 75.7 143.2 75.7 142.2 C 75.6 140.7 75.6 140.7 75.5 140.7 C 75.4 140.7 75.4 140.8 75.4 142.4 C 75.3 145.8 75.2 146.5 74.6 149.5 C 74.4 150.8 74.3 151.3 74.1 151.8 C 74.0 152.1 74.0 152.4 73.9 152.5 C 73.8 152.9 73.4 153.9 73.0 154.8 C 72.9 155.2 72.6 155.8 72.4 156.1 C 71.7 157.7 71.4 158.1 69.8 159.8 C 69.1 160.4 69.0 160.6 68.8 160.5 C 68.6 160.4 69.0 159.8 69.7 159.0 C 70.8 157.9 71.4 156.7 72.3 154.6 C 72.5 154.3 72.7 153.8 72.8 153.7 C 73.1 153.0 73.8 150.5 73.8 149.9 C 73.8 149.8 73.8 149.4 73.9 149.1 C 74.0 148.8 74.1 148.2 74.1 147.8 C 74.1 147.4 74.2 147.0 74.3 146.9 C 74.3 146.8 74.4 146.5 74.4 146.3 C 74.4 146.0 74.4 145.8 74.5 145.6 C 74.5 145.2 74.5 143.5 74.5 143.5 C 74.4 143.5 74.3 143.8 74.3 144.5 C 74.3 145.2 74.2 145.8 74.0 146.4 C 74.0 146.6 73.9 146.9 73.9 147.0 C 73.8 147.6 73.7 148.3 73.6 148.7 C 73.5 149.0 73.4 149.4 73.3 149.6 C 73.3 150.1 72.8 151.2 72.3 152.6 C 71.2 155.3 69.4 157.8 68.9 157.4 C 68.7 157.3 68.7 157.1 69.1 156.7 C 69.2 156.5 69.5 156.2 69.6 156.1 C 69.7 155.9 69.9 155.7 69.9 155.6 C 70.3 155.2 71.7 152.4 72.0 151.4 C 73.4 147.5 73.8 144.5 73.7 138.9 C 73.6 136.8 73.6 136.7 73.5 136.7 C 73.4 136.7 73.4 136.7 73.4 137.9 C 73.2 142.0 73.2 142.8 72.8 144.9 C 72.7 145.3 72.6 145.8 72.6 146.0 C 72.5 146.3 72.4 146.9 72.2 147.5 C 71.8 149.1 71.6 149.8 70.8 151.3 C 70.6 151.8 70.3 152.3 70.3 152.4 C 70.2 152.5 70.1 152.8 69.9 153.0 C 69.7 153.3 69.5 153.6 69.4 153.7 C 69.1 154.2 69.0 154.3 68.7 154.1 C 68.4 154.0 68.5 153.8 69.1 152.9 C 69.8 152.0 70.4 150.8 70.6 150.0 C 70.7 149.8 70.9 149.4 71.0 149.2 C 71.1 148.8 71.2 148.6 71.3 148.3 C 71.3 148.1 71.4 147.8 71.5 147.6 C 71.8 146.8 71.9 146.0 72.3 143.0 C 72.6 140.7 72.6 140.3 72.5 140.3 C 72.4 140.3 72.4 140.4 72.3 141.1 C 71.9 143.2 71.3 145.3 70.4 147.3 C 70.0 148.1 69.9 148.5 69.7 148.7 C 69.5 148.8 69.4 149.0 69.4 149.1 C 69.0 149.9 68.2 150.9 67.0 152.1 C 65.6 153.5 65.2 153.7 65.2 153.3 C 65.2 153.0 65.4 152.8 66.6 151.6 C 68.0 150.2 68.1 150.0 68.8 148.8 C 70.5 145.9 71.4 142.8 71.7 138.9 C 71.8 138.4 71.8 137.9 71.9 137.7 C 72.0 137.2 72.0 136.9 72.0 135.7 C 71.9 134.1 71.9 133.7 71.7 132.9 C 71.7 132.6 71.5 131.8 71.4 131.3 C 71.3 130.3 71.3 130.3 70.9 129.5 C 70.7 129.1 70.4 128.6 70.3 128.4 C 70.1 128.0 69.8 127.6 69.7 127.1 C 69.6 127.0 69.4 126.6 69.2 126.4 C 68.8 125.7 68.7 125.4 68.7 125.1 C 68.7 125.0 69.0 125.1 69.2 125.2 C 69.6 125.5 70.0 126.0 70.4 126.5 C 70.6 126.8 70.8 127.1 71.0 127.3 C 71.3 127.6 71.6 128.2 71.8 128.6 C 71.9 128.7 72.0 128.9 72.2 129.0 C 72.3 129.2 72.5 129.6 72.9 130.2 C 73.2 130.7 73.5 131.2 73.6 131.4 C 73.8 131.8 74.0 132.3 74.1 132.8 C 74.3 133.4 74.4 133.6 74.6 133.8 C 75.0 134.2 75.7 137.0 76.2 140.1 C 76.5 141.7 76.6 144.0 76.4 145.8 C 76.4 146.4 76.3 147.2 76.3 147.6 C 76.3 148.9 76.3 149.3 76.1 149.9 C 76.0 150.3 75.8 150.9 75.7 151.3 C 75.2 153.1 74.7 154.2 73.9 155.9 C 73.1 157.4 72.1 159.2 71.6 159.7 C 71.5 159.9 71.3 160.2 71.2 160.4 C 71.1 160.6 70.9 160.8 70.6 161.1 C 70.4 161.3 70.0 161.7 69.7 162.1 C 69.1 162.8 68.0 163.9 67.7 164.2 C 67.4 164.4 67.3 164.4 67.2 164.3 Z M 50.5 157.3 C 51.5 157.3 52.2 157.2 52.7 157.1 C 52.9 157.0 53.1 157.0 53.3 157.0 C 53.6 157.0 54.6 156.7 55.8 156.3 C 56.4 156.1 56.9 155.9 57.1 155.9 C 57.4 155.9 57.5 155.8 57.8 155.7 C 57.9 155.6 58.5 155.3 58.9 155.1 C 59.4 154.8 59.9 154.6 60.0 154.4 C 60.2 154.3 60.5 154.2 60.6 154.1 C 61.1 153.8 62.5 152.8 63.0 152.3 C 64.5 151.0 66.1 149.3 66.3 148.9 C 66.3 148.8 66.5 148.5 66.7 148.2 C 67.4 147.1 68.1 145.8 68.4 145.0 C 68.5 144.8 68.7 144.2 68.9 143.7 C 69.3 142.8 69.4 142.6 69.4 142.2 C 69.5 142.0 69.6 141.5 69.7 141.2 C 69.7 140.9 69.8 140.5 69.8 140.3 C 69.9 140.1 69.9 139.8 70.0 139.6 C 70.1 139.0 70.1 134.8 70.0 134.0 C 69.5 131.4 68.7 128.8 67.7 127.0 C 67.5 126.8 67.3 126.4 67.2 126.2 C 66.7 125.3 65.7 123.9 64.7 122.9 C 64.1 122.2 64.0 122.2 64.4 123.3 C 64.7 124.4 64.9 125.3 65.0 125.7 C 65.0 125.9 65.1 126.3 65.1 126.6 C 65.5 128.0 65.4 129.8 64.9 132.0 C 64.6 133.5 64.0 135.1 63.3 136.2 C 63.2 136.4 63.1 136.6 63.0 136.8 C 62.9 136.9 62.8 137.1 62.7 137.2 C 62.6 137.3 62.4 137.6 62.3 137.8 C 61.7 138.7 60.6 139.9 59.3 140.9 C 58.9 141.3 58.3 141.6 57.4 142.1 C 57.0 142.3 56.8 142.4 56.7 142.5 C 56.7 142.6 56.6 142.7 56.5 142.7 C 56.4 142.7 56.1 142.8 55.9 142.9 C 55.2 143.2 54.7 143.4 54.0 143.5 C 53.7 143.5 53.4 143.6 53.2 143.6 C 52.0 144.1 48.4 144.2 47.4 143.8 C 47.3 143.7 47.2 143.7 46.9 143.7 C 46.5 143.8 46.0 143.6 45.3 143.4 C 45.0 143.2 44.6 143.1 44.4 143.0 C 43.9 142.9 42.9 142.4 42.7 142.2 C 42.6 142.1 42.5 142.1 42.5 142.1 C 42.4 142.1 42.3 142.0 42.1 141.8 C 41.9 141.6 41.8 141.5 41.6 141.5 C 40.4 141.1 37.3 137.5 36.3 135.2 C 35.0 132.4 34.7 127.3 35.5 124.8 C 35.6 124.6 35.7 124.2 35.8 123.9 C 35.8 123.7 35.9 123.3 36.0 123.2 C 36.5 122.1 36.3 122.1 35.2 123.1 C 34.4 123.9 33.6 125.2 32.6 126.9 C 30.2 131.3 29.2 137.0 30.1 140.6 C 30.2 140.8 30.3 141.1 30.3 141.4 C 30.4 141.9 30.5 142.5 30.8 143.3 C 31.1 144.2 31.2 144.4 31.3 144.9 C 31.7 145.9 32.8 147.9 33.8 149.3 C 35.3 151.3 37.3 153.2 39.1 154.3 C 40.6 155.2 41.7 155.7 42.2 155.9 C 42.4 155.9 42.7 156.1 42.9 156.2 C 43.8 156.7 46.7 157.2 48.7 157.3 C 49.1 157.3 49.5 157.3 49.5 157.3 C 49.5 157.3 50.0 157.3 50.5 157.3 Z M 43.1 155.4 C 42.8 155.3 40.8 154.5 40.6 154.3 C 40.6 154.2 40.3 154.1 40.1 154.0 C 39.4 153.6 38.7 153.1 38.3 152.7 C 38.2 152.6 38.0 152.4 37.8 152.3 C 36.8 151.7 35.3 150.1 33.8 148.2 C 33.4 147.6 33.2 147.3 33.1 146.9 C 32.9 146.5 32.7 146.0 32.5 145.8 C 32.4 145.7 32.4 145.6 32.3 145.4 C 32.2 145.0 32.2 144.9 31.9 144.6 C 31.7 144.5 31.7 144.3 31.6 144.2 C 31.6 144.1 31.5 143.9 31.5 143.8 C 31.4 143.7 31.3 143.4 31.3 143.3 C 31.2 143.2 31.2 142.9 31.1 142.6 C 30.2 139.4 30.2 135.5 31.1 132.4 C 31.5 130.9 31.7 130.1 31.8 129.5 C 31.8 129.4 31.9 129.3 31.9 129.2 C 32.0 129.1 32.1 128.9 32.1 128.7 C 32.7 127.2 34.1 124.9 34.6 124.7 C 35.0 124.6 35.1 124.8 34.9 125.3 C 34.8 125.5 34.8 125.8 34.7 125.9 C 34.7 126.1 34.7 126.4 34.6 126.6 C 34.5 127.1 34.4 127.7 34.4 128.3 C 34.4 128.5 34.3 128.8 34.3 128.9 C 34.2 129.3 34.2 129.4 34.2 129.8 C 34.3 130.0 34.3 130.4 34.3 130.7 C 34.4 131.4 34.5 132.0 34.7 132.7 C 34.8 133.0 35.0 133.5 35.1 133.8 C 35.2 134.2 35.2 134.4 35.6 135.2 C 35.8 135.6 36.0 136.1 36.1 136.2 C 36.1 136.3 36.1 136.4 36.2 136.4 C 36.3 136.5 36.5 136.7 36.7 137.3 C 37.0 137.9 37.4 138.4 37.7 138.8 C 37.8 139.0 38.0 139.2 38.0 139.3 C 38.2 139.5 38.2 139.6 38.5 139.8 C 38.7 140.0 39.3 140.6 39.4 140.8 C 39.4 140.8 39.6 140.9 39.8 141.1 C 40.1 141.2 40.4 141.4 40.5 141.5 C 40.7 141.7 41.0 141.9 41.2 142.1 C 42.4 142.9 42.8 143.3 42.7 143.4 C 42.6 143.6 42.4 143.6 41.9 143.2 C 41.7 143.0 41.4 142.9 41.3 142.8 C 41.2 142.7 40.9 142.5 40.7 142.3 C 40.4 142.1 40.1 141.8 39.8 141.6 C 38.2 140.4 36.7 138.8 36.4 137.8 C 36.3 137.6 36.2 137.4 36.1 137.3 C 35.6 136.7 34.8 135.1 34.5 134.0 C 34.2 133.1 34.1 132.9 34.0 132.7 C 33.9 132.6 33.8 132.6 33.8 132.8 C 33.9 133.0 34.6 135.1 34.7 135.4 C 34.7 135.5 34.8 135.6 34.8 135.7 C 34.8 135.8 34.8 135.8 34.9 135.9 C 34.9 136.0 34.9 136.2 34.9 136.4 C 34.8 136.6 34.8 136.7 35.0 136.7 C 35.2 136.8 35.2 136.8 35.4 137.4 C 35.7 138.1 36.3 139.1 36.7 139.8 C 36.8 140.0 36.9 140.1 36.9 140.2 C 37.0 140.4 38.0 141.5 39.3 142.9 C 40.1 143.7 40.2 143.8 40.2 143.9 C 40.1 144.1 39.7 144.0 39.1 143.5 C 38.1 142.8 36.2 140.5 35.9 139.6 C 35.8 139.4 35.8 139.4 35.6 139.1 C 35.5 139.0 35.4 138.8 35.3 138.5 C 35.2 138.3 35.0 137.9 34.9 137.7 C 34.8 137.4 34.7 137.1 34.6 136.9 C 34.6 136.7 34.5 136.5 34.4 136.3 C 34.2 135.9 34.0 135.5 33.8 135.0 C 33.5 134.3 33.2 133.8 33.2 134.0 C 33.2 134.1 33.6 135.5 33.8 136.1 C 34.3 137.6 35.6 140.4 36.0 141.0 C 36.9 142.2 37.3 142.8 37.7 143.3 C 38.0 143.6 38.3 143.9 38.3 144.0 C 38.3 144.1 38.4 144.1 38.5 144.2 C 38.6 144.2 38.7 144.3 38.9 144.5 C 39.1 144.8 39.3 144.9 39.5 145.1 C 40.2 145.5 40.3 145.7 40.0 145.9 C 39.6 146.2 39.0 145.7 36.9 143.2 C 35.8 141.9 34.6 140.0 34.2 138.9 C 34.1 138.3 33.8 137.8 33.7 137.6 C 33.6 137.6 33.5 137.3 33.4 137.1 C 33.2 136.5 33.1 136.5 33.1 137.2 C 33.2 137.4 33.2 137.6 33.5 138.2 C 33.7 138.7 33.8 139.0 33.9 139.2 C 34.1 140.4 34.9 142.0 35.9 143.5 C 36.0 143.6 36.2 143.9 36.2 144.1 C 36.4 144.6 37.0 145.4 37.8 146.3 C 38.0 146.5 38.2 146.7 38.3 146.8 C 38.3 147.0 38.6 147.2 38.8 147.2 C 38.8 147.2 38.9 147.3 39.0 147.4 C 39.3 147.8 40.0 148.5 40.2 148.5 C 40.5 148.5 41.1 149.0 41.2 149.3 C 41.2 149.7 40.5 149.4 39.5 148.8 C 38.1 147.9 35.8 144.9 34.6 142.6 C 34.5 142.2 34.2 141.8 34.2 141.7 C 33.9 141.3 33.4 140.2 32.9 138.7 C 32.6 137.9 32.5 137.5 32.2 136.2 C 32.1 136.0 32.0 136.0 32.0 136.2 C 32.0 136.4 32.0 137.4 32.1 137.7 C 32.1 137.8 32.1 138.2 32.1 138.6 C 32.2 139.1 32.2 139.2 32.3 139.6 C 32.4 139.9 32.5 140.1 32.5 140.3 C 32.6 140.7 32.7 141.1 33.0 141.8 C 33.1 142.1 33.3 142.6 33.4 142.9 C 33.7 143.6 34.0 144.2 34.3 144.8 C 34.5 145.1 34.8 145.7 35.0 146.0 C 35.4 146.8 35.5 146.9 36.0 147.5 C 36.6 148.2 37.5 149.1 38.1 149.6 C 38.4 149.8 38.8 150.1 38.9 150.2 C 39.0 150.4 39.2 150.5 39.6 150.7 C 39.8 150.9 40.2 151.1 40.5 151.3 C 40.8 151.5 41.2 151.7 41.4 151.8 C 42.0 152.2 42.1 152.2 42.2 152.4 C 42.5 152.9 42.1 153.1 41.6 152.7 C 41.5 152.6 41.1 152.3 40.7 152.1 C 39.9 151.7 39.2 151.2 38.8 150.9 C 38.7 150.8 38.4 150.6 38.3 150.5 C 37.4 150.0 35.1 147.6 34.8 146.8 C 34.8 146.7 34.7 146.6 34.6 146.5 C 34.5 146.4 34.4 146.2 34.3 146.0 C 34.2 145.7 34.1 145.6 33.9 145.3 C 33.6 145.0 33.6 145.0 33.4 144.6 C 33.3 144.4 33.2 144.0 33.1 143.8 C 33.0 143.5 32.8 143.1 32.7 142.9 C 32.6 142.6 32.5 142.2 32.4 142.0 C 32.3 141.8 32.2 141.5 32.1 141.3 C 32.1 141.1 32.0 140.7 31.9 140.4 C 31.6 139.3 31.3 137.2 31.3 135.9 C 31.3 135.5 31.2 135.4 31.0 135.7 C 30.4 136.8 31.4 142.2 32.7 145.0 C 33.0 145.8 33.2 146.3 33.3 146.5 C 33.3 146.7 33.4 146.8 33.5 147.0 C 33.6 147.1 33.7 147.2 33.7 147.2 C 33.8 147.7 35.7 149.8 37.0 150.9 C 37.4 151.2 37.8 151.6 38.9 152.3 C 39.1 152.4 39.4 152.7 39.6 152.9 C 40.2 153.3 40.2 153.4 40.4 153.4 C 40.5 153.4 40.6 153.5 40.6 153.5 C 40.7 153.6 41.0 153.8 41.3 154.0 C 41.7 154.1 42.2 154.4 42.5 154.6 C 43.1 154.9 43.4 155.1 43.7 155.1 C 44.0 155.2 44.0 155.3 43.9 155.4 C 43.9 155.4 43.4 155.5 43.1 155.4 Z M 50.0 81.0 L 52.0 87.2 L 58.6 87.2 L 53.3 91.1 L 55.3 97.3 L 50.0 93.4 L 44.7 97.3 L 46.7 91.1 L 41.4 87.2 L 48.0 87.2 Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'axes':
            o += '<path d="' + 'M77.6,187.1C75.8,184.6,70.1,177.1,65.1,170.3C53.7,154.9,53.6,154.9,53.6,154.9C53.6,154.9,53.3,155.2,52.9,155.5C49.8,158.6,47.0,161.2,38.7,168.7C33.8,173.1,34.2,172.7,34.3,173.0C34.6,173.6,37.1,178.0,37.2,178.0C37.4,178.0,38.0,178.5,38.3,178.8C38.8,179.6,39.0,180.3,39.0,181.5C39.0,182.8,38.7,183.4,38.0,183.7C37.6,183.9,36.5,183.8,36.1,183.5C35.4,183.1,34.9,182.2,34.7,181.1C34.6,180.6,34.6,180.6,33.5,178.9C31.9,176.4,31.3,175.6,31.0,175.6C30.4,175.6,27.0,178.9,24.8,181.7C23.7,183.0,23.6,183.4,23.4,186.2C23.2,188.9,22.6,190.4,21.4,191.1C20.6,191.7,19.2,191.6,18.3,191.1C16.1,189.6,15.5,185.2,16.9,181.5C18.0,178.6,19.4,176.7,24.9,171.0C26.0,169.9,27.0,168.9,27.0,168.8C27.0,168.7,26.7,168.0,25.1,165.1C24.2,163.6,24.1,163.5,23.9,163.4C22.8,163.0,22.2,161.7,22.2,159.9C22.3,158.8,22.4,158.3,23.0,157.9C23.3,157.7,24.4,157.6,24.8,157.8C25.7,158.2,26.4,159.3,26.5,160.3C26.5,160.8,26.6,160.8,27.3,162.0C28.8,164.3,29.5,165.2,29.8,165.6C30.3,166.0,30.2,166.0,31.7,164.7C37.3,159.7,41.3,156.0,48.0,149.6C49.0,148.6,49.0,148.6,47.6,146.8C34.5,129.0,31.6,125.2,31.5,125.2C31.4,125.2,30.6,126.3,30.4,126.7C29.5,128.5,29.8,129.8,31.4,130.0C32.0,130.1,32.0,130.1,32.1,130.9C32.6,133.6,33.9,137.0,35.5,140.2C36.2,141.5,36.2,141.5,36.2,142.0C36.2,142.9,36.0,142.9,33.8,142.7C23.5,141.4,18.3,136.4,16.4,126.1C15.9,123.5,15.8,122.8,15.8,119.2C15.8,116.1,15.8,116.1,16.2,116.1C16.5,116.1,16.6,116.1,17.7,116.9C20.3,118.5,21.7,119.2,24.0,120.1C24.5,120.3,24.5,120.3,24.6,121.1C24.7,123.2,25.2,123.9,26.2,123.2C26.8,122.8,28.1,121.3,28.2,120.9C28.3,120.7,28.1,120.5,27.7,120.4C26.5,120.1,25.7,119.6,25.1,118.9C24.7,118.4,24.8,118.6,23.1,114.4C19.3,105.2,19.4,105.5,19.4,105.0C19.4,104.6,19.4,104.6,19.7,104.6C19.9,104.6,20.0,104.6,20.2,104.7C22.4,106.4,28.2,110.8,29.2,111.6C30.4,112.5,31.1,113.9,31.2,115.9C31.3,116.3,31.4,116.7,31.6,116.7C31.7,116.7,32.2,116.1,32.6,115.6C32.9,115.1,32.9,115.1,33.1,114.2C33.3,113.0,33.3,113.0,33.5,112.9C33.6,112.8,34.1,112.6,34.7,112.4C39.3,110.8,39.4,110.7,39.4,111.9C39.4,112.4,38.8,115.5,38.3,118.2C38.1,119.1,38.1,119.0,37.0,119.2C36.6,119.3,36.1,119.4,36.0,119.5C35.9,119.6,34.9,121.0,34.9,121.1C34.9,121.2,35.9,122.6,40.4,128.7C47.6,138.4,52.6,145.1,52.6,145.1C52.8,145.1,57.2,140.6,58.9,138.7C64.3,132.7,67.0,127.8,66.7,124.6C66.6,123.4,66.5,123.5,67.4,122.7C73.4,117.2,77.8,110.2,82.5,99.1C82.8,98.4,82.8,98.4,83.2,98.4C83.7,98.4,83.6,98.3,83.7,99.5C84.0,102.2,83.9,106.0,83.4,108.8C81.5,121.3,74.5,132.8,58.2,150.0C57.2,151.1,57.2,151.1,57.3,151.4C57.4,151.5,63.5,159.7,70.8,169.6C84.2,187.6,84.2,187.6,84.2,188.4C84.2,189.2,84.2,189.2,83.2,190.4C82.2,191.6,82.2,191.6,81.6,191.6C81.0,191.6,81.0,191.6,77.6,187.1ZM20.5,189.4C21.5,188.8,21.9,187.7,22.1,184.9C22.2,183.4,22.3,182.8,22.5,182.2C22.6,182.0,22.6,181.7,22.7,181.6C22.8,181.1,25.2,178.3,26.7,176.8C26.9,176.6,27.1,176.4,27.2,176.3C27.2,176.3,27.1,176.3,26.6,176.3C26.1,176.3,26.0,176.3,25.9,176.2C25.4,175.8,25.4,174.9,25.8,173.4C26.1,172.4,26.1,172.4,25.8,172.7C20.0,178.6,18.1,181.4,17.6,184.7C17.2,186.7,18.2,189.1,19.6,189.7C19.9,189.8,20.1,189.7,20.5,189.4ZM82.4,188.7C82.6,188.4,82.6,188.4,82.5,188.2C82.3,188.0,80.6,185.6,67.8,168.4C42.7,134.6,34.6,123.7,34.5,123.7C34.5,123.7,34.3,124.0,34.0,124.3C33.5,124.9,33.5,124.9,38.9,132.2C45.7,141.3,77.7,184.3,79.9,187.4C81.8,189.9,81.6,189.8,82.4,188.7ZM19.1,189.2C17.8,188.4,17.8,183.9,19.1,183.1C19.3,182.9,20.2,182.9,20.5,183.1C21.1,183.5,21.4,184.4,21.3,186.3C21.3,187.8,21.1,188.6,20.6,189.1C20.3,189.3,19.4,189.4,19.1,189.2ZM20.0,187.4C20.4,186.5,20.4,185.4,19.9,184.6C19.8,184.4,19.8,184.4,19.7,184.5C19.1,185.2,19.1,186.8,19.6,187.6C19.7,187.9,19.8,187.8,20.0,187.4ZM37.4,181.8C37.7,181.5,37.7,181.4,37.5,181.0C37.3,180.3,36.9,179.9,36.4,179.7C36.3,179.7,36.1,179.6,36.1,179.6C36.0,179.5,36.0,179.5,36.0,179.9C36.1,180.7,36.4,181.4,36.9,181.8C37.2,182.0,37.3,182.0,37.4,181.8ZM34.8,177.3C32.9,174.0,32.9,174.0,32.8,172.8C32.8,171.7,32.9,171.5,33.6,169.0C33.9,167.9,34.1,167.0,34.1,167.0C34.1,167.0,33.3,167.2,32.4,167.3C29.1,167.9,29.2,168.0,26.8,164.4C25.0,161.7,25.0,161.6,26.9,165.0C28.3,167.4,28.4,167.6,28.4,168.8C28.4,169.8,28.4,169.9,27.7,172.5C27.3,173.6,27.1,174.4,27.1,174.4C27.1,174.5,27.8,174.3,28.7,174.2C30.6,173.8,31.6,173.8,32.1,174.1C32.5,174.4,33.1,175.1,34.6,177.4C35.3,178.5,35.9,179.3,35.9,179.3C35.9,179.3,35.4,178.4,34.8,177.3ZM28.0,173.2C28.0,172.7,28.0,172.6,28.6,170.7C28.9,169.6,29.2,168.7,29.2,168.6C29.3,168.5,32.7,167.8,33.0,167.8C33.5,167.8,33.4,168.2,32.9,170.0C32.1,172.7,32.0,172.9,31.9,172.9C31.3,173.1,28.9,173.5,28.5,173.6C28.0,173.6,28.0,173.6,28.0,173.2ZM30.3,172.0C30.7,171.9,31.1,171.7,31.2,171.7C31.2,171.7,31.6,170.5,31.8,169.6C31.9,169.3,31.9,169.3,31.9,169.3C31.8,169.3,31.4,169.4,31.0,169.5C29.9,169.7,30.1,169.6,29.7,170.9C29.5,171.5,29.3,172.1,29.3,172.1C29.3,172.2,29.4,172.1,30.3,172.0ZM38.8,166.1C45.8,159.9,48.0,157.8,51.2,154.7C52.5,153.3,52.5,153.3,52.1,152.8C51.7,152.2,51.7,152.2,51.1,152.7C46.5,157.3,42.1,161.4,36.8,165.8C35.7,166.6,35.7,166.7,35.7,166.9C35.7,167.2,35.4,168.2,35.1,169.2C35.0,169.6,35.0,169.6,35.3,169.3C35.6,169.1,37.1,167.7,38.8,166.1ZM36.7,164.0C41.5,160.0,48.1,154.0,50.7,151.2C50.8,151.0,50.8,151.0,50.5,150.5C50.1,150.1,50.1,150.1,49.0,151.1C44.0,156.0,39.1,160.5,35.1,164.1C34.5,164.7,34.0,165.1,33.9,165.2C33.9,165.2,34.2,165.2,34.6,165.2C35.3,165.2,35.3,165.2,36.7,164.0ZM25.2,161.5C25.1,160.7,24.8,160.1,24.3,159.7C24.0,159.4,24.0,159.4,23.8,159.7C23.6,159.9,23.6,160.1,23.7,160.5C24.0,161.2,24.4,161.7,25.2,161.9C25.2,161.9,25.2,161.7,25.2,161.5ZM56.8,148.9C70.4,134.6,77.6,124.1,80.8,113.5C81.8,110.5,82.3,107.5,82.5,104.3C82.6,103.0,82.6,103.0,82.2,103.9C78.4,112.3,73.9,119.2,68.8,124.0C68.1,124.6,68.1,124.6,68.1,125.3C68.1,130.4,64.3,136.2,54.4,145.9C53.7,146.6,53.7,146.6,54.0,147.0C54.3,147.4,54.3,147.4,54.5,147.2C54.6,147.1,55.4,146.3,56.2,145.4C66.2,134.7,71.8,126.9,75.7,118.2C76.0,117.4,76.0,117.4,76.4,117.4C76.9,117.4,76.9,117.5,76.9,118.1C76.9,118.5,76.9,118.5,76.6,119.3C72.8,127.9,66.4,136.7,56.0,147.6C55.2,148.6,55.2,148.6,55.6,149.1C55.8,149.4,56.0,149.7,56.0,149.7C56.0,149.7,56.4,149.3,56.8,148.9ZM33.8,140.4C32.5,137.7,31.4,134.5,30.9,132.4C30.8,131.7,30.8,131.7,30.4,131.7C29.0,131.4,28.4,129.9,28.6,127.6C28.7,126.1,29.7,124.3,30.6,123.7C31.0,123.4,31.7,123.4,32.1,123.5C32.4,123.6,32.4,123.6,33.0,122.9C33.6,122.1,33.6,122.1,33.5,121.9C33.5,121.8,33.5,121.4,33.5,120.9C33.5,119.8,33.6,119.8,34.4,118.7C35.1,117.8,35.2,117.8,36.1,117.6C36.5,117.5,36.9,117.5,36.9,117.4C37.0,117.4,37.8,113.3,37.8,113.3C37.7,113.2,34.6,114.4,34.5,114.5C34.5,114.5,34.4,115.0,34.3,115.5C34.1,116.4,34.1,116.4,33.6,117.1C32.5,118.4,32.4,118.5,31.6,118.5C31.2,118.5,31.1,118.4,30.9,118.4C30.8,118.3,30.8,118.3,30.2,119.0C29.6,119.8,29.6,119.8,29.6,120.3C29.8,121.5,29.6,122.0,28.7,123.1C27.5,124.8,26.7,125.2,25.5,125.2C24.9,125.2,24.8,125.2,24.5,125.0C23.8,124.5,23.3,123.4,23.3,122.1C23.3,121.9,23.3,121.7,23.3,121.7C22.8,121.7,19.3,120.0,17.6,118.9C17.2,118.7,16.9,118.5,16.9,118.5C16.8,118.5,16.9,119.5,17.0,120.6C18.1,133.1,22.8,139.1,33.0,140.8C34.2,141.0,34.1,141.1,33.8,140.4ZM28.4,118.5C28.7,118.2,29.7,116.8,29.9,116.6C30.0,116.4,29.8,115.5,29.5,114.7C29.2,113.8,29.1,113.7,26.4,111.6C22.6,108.8,22.5,108.7,22.5,108.7C22.5,108.7,24.6,113.9,25.6,116.3C26.0,117.3,26.3,117.7,26.9,118.1C27.2,118.3,28.0,118.7,28.2,118.7C28.2,118.7,28.3,118.6,28.4,118.5Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'fish':
            o += '<path d="' + 'M 35.1 215.8 C 32.9 215.4 33.5 214.2 36.5 212.4 C 39.0 211.0 39.5 210.4 39.7 208.4 C 40.0 203.9 37.8 196.9 31.4 182.1 C 30.9 180.9 30.1 178.9 29.7 177.8 C 28.8 175.5 28.7 175.4 28.1 176.3 C 27.2 177.8 24.3 180.3 22.0 181.5 C 20.1 182.4 19.1 182.6 18.1 182.0 C 16.5 181.1 16.7 179.6 18.6 177.5 C 21.1 174.6 24.2 170.0 25.0 167.7 C 25.1 167.2 25.4 166.5 25.6 166.1 C 25.9 165.5 25.9 165.5 25.6 164.3 C 23.1 152.4 24.2 141.7 28.8 132.2 C 29.9 129.9 29.9 130.0 28.9 130.1 C 28.0 130.2 27.4 130.1 26.9 129.6 C 26.0 128.6 26.4 127.7 29.8 123.7 C 33.2 119.5 34.2 118.8 37.9 118.3 C 38.5 118.2 39.0 118.1 39.2 118.1 C 39.8 118.0 44.9 110.0 48.8 103.1 C 52.9 95.8 55.4 91.7 59.2 86.4 C 62.6 81.7 68.0 75.5 69.1 75.2 C 71.4 74.6 67.5 81.1 60.4 89.3 C 57.2 93.1 55.1 96.3 54.1 99.4 C 53.6 100.9 53.8 101.3 54.4 99.9 C 56.2 95.9 60.2 90.3 64.1 86.3 C 66.9 83.5 68.7 81.2 70.6 77.8 C 74.0 71.8 76.7 73.0 80.1 82.1 C 85.2 96.1 83.2 111.7 74.6 125.2 C 74.1 125.9 74.1 125.9 73.5 129.8 C 72.0 139.6 71.2 142.2 68.8 145.2 C 65.6 149.2 57.2 154.4 50.2 156.8 C 48.2 157.5 48.4 157.2 47.2 160.1 C 46.4 162.2 46.3 161.6 47.9 165.5 C 49.6 169.8 49.8 170.5 49.3 173.4 C 49.2 174.0 49.0 175.3 48.9 176.1 C 48.6 178.8 47.8 180.5 46.9 180.5 C 46.1 180.5 48.5 184.0 50.9 186.5 C 57.3 193.0 65.5 195.6 73.2 193.4 C 75.6 192.7 77.2 192.0 79.0 190.8 C 82.3 188.5 82.7 192.6 79.6 197.0 C 75.1 203.6 67.6 206.6 58.9 205.3 C 56.2 204.9 53.8 204.9 53.3 205.3 C 53.1 205.4 52.9 205.8 52.6 206.7 C 51.4 210.6 49.6 212.5 46.2 213.8 C 43.0 215.0 36.8 216.1 35.1 215.8 Z M 56.5 105.9 C 56.5 105.8 56.2 105.7 55.9 105.6 C 55.6 105.5 55.2 105.4 55.1 105.4 C 54.8 105.3 54.8 105.3 54.8 105.5 C 54.8 105.6 54.8 105.7 54.8 105.7 C 54.8 105.7 55.1 105.8 55.3 105.9 C 55.9 106.1 56.5 106.1 56.5 105.9 Z M 72.7 97.3 C 75.1 96.6 75.7 95.8 74.8 94.0 C 74.1 92.4 73.0 91.7 71.5 91.7 C 68.5 91.7 67.2 94.2 68.9 96.7 C 69.5 97.6 70.8 97.8 72.7 97.3 Z M 71.0 96.2 C 69.4 95.3 69.5 93.2 71.2 92.4 C 73.4 91.4 75.0 94.6 73.0 96.0 C 72.6 96.4 71.5 96.5 71.0 96.2 Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        

        case 'phoenix':
            o += '<path d="' + 'M48.4,190.8C48.4,190.8,48.1,190.6,47.9,190.4C46.9,189.7,45.9,188.7,45.5,188.1C45.3,187.8,45.3,187.8,45.1,188.1C45.0,188.2,44.6,188.6,44.3,189.0C43.9,189.4,43.5,189.9,43.4,190.0C43.2,190.3,43.2,190.3,43.2,189.9C43.2,189.4,43.3,189.0,43.8,188.1C44.1,187.6,44.3,186.9,44.3,186.6C44.3,186.6,44.0,186.6,43.5,186.7C43.0,186.7,43.0,186.7,43.0,187.5C43.0,188.4,42.9,189.1,42.6,189.8C42.4,190.5,42.4,190.6,42.3,190.1C42.2,189.1,41.9,188.1,41.6,187.6C41.4,187.3,41.4,187.3,41.2,187.6C40.7,189.0,40.0,189.8,39.1,190.0C38.8,190.0,38.8,190.0,39.1,189.6C39.5,189.0,39.8,188.2,39.9,187.4C39.9,187.0,39.8,187.1,39.4,187.6C39.0,188.1,38.8,188.1,39.1,187.6C39.2,187.4,39.2,187.3,39.2,187.3C39.2,187.3,39.0,187.2,38.9,187.2C38.0,187.0,36.9,187.0,35.8,187.3C35.2,187.5,35.1,187.5,34.8,187.4C33.6,187.2,33.0,187.2,32.3,187.5C31.8,187.6,31.8,187.5,32.0,187.2C32.3,186.7,32.4,186.3,32.4,185.6C32.3,185.2,32.3,185.2,31.8,184.5C30.5,182.9,29.9,180.8,29.8,177.9C29.8,176.9,29.8,176.9,30.1,177.5C30.8,179.0,31.6,180.3,31.8,180.3C31.9,180.3,32.6,180.1,32.6,180.0C32.6,180.0,32.5,179.7,32.4,179.4C31.8,177.4,31.5,175.4,31.5,172.2C31.5,169.5,31.5,169.2,31.9,170.4C32.5,172.4,33.3,174.5,34.2,176.2C34.7,177.3,34.7,177.3,34.9,175.3C35.0,174.1,35.0,173.7,35.1,173.7C35.2,173.7,35.4,174.5,35.6,175.5C36.4,178.9,37.0,179.6,38.2,178.6C38.5,178.4,38.4,178.3,38.0,177.8C36.8,176.5,36.6,176.0,36.6,174.4C36.6,173.7,36.6,173.7,36.3,173.5C34.1,172.1,33.4,169.6,34.2,165.8C34.3,165.2,34.3,165.2,33.9,165.3C33.5,165.3,32.1,165.4,32.1,165.3C32.1,165.3,32.2,165.1,32.3,164.8C32.7,164.0,33.4,163.3,34.3,162.5C35.0,162.0,34.9,161.9,34.0,162.2C32.6,162.7,29.5,163.1,28.6,163.0C28.2,163.0,30.1,161.1,31.4,160.3C31.7,160.1,32.0,159.9,32.0,159.9C32.0,159.8,31.8,159.8,31.3,159.7C30.4,159.7,29.4,159.5,27.7,159.2C26.5,158.9,26.5,158.9,27.0,158.5C28.2,157.8,30.6,156.9,31.3,156.9C31.3,156.9,31.4,156.8,31.4,156.8C31.4,156.7,31.3,156.7,30.9,156.6C28.2,156.4,26.2,156.1,24.2,155.4C23.6,155.1,23.5,155.0,24.2,154.9C24.4,154.9,25.0,154.8,25.6,154.6C27.3,154.2,27.4,154.2,28.8,154.2C29.6,154.2,30.1,154.2,30.1,154.2C30.1,154.1,29.5,153.9,28.8,153.6C27.2,153.0,24.6,151.9,23.3,151.3C22.3,150.7,20.8,149.9,20.9,149.8C20.9,149.8,23.5,149.6,25.0,149.6C26.4,149.5,28.2,149.6,28.9,149.7C29.1,149.7,29.1,149.7,29.1,149.7C29.1,149.6,28.8,149.5,28.1,149.3C22.5,147.4,19.8,145.6,19.8,143.7C19.8,143.4,19.8,143.4,20.0,143.4C20.9,143.4,22.9,143.7,24.2,144.1C25.0,144.3,24.9,144.2,24.0,143.6C21.5,142.0,19.8,140.2,18.3,137.7C18.0,137.2,18.0,137.2,18.3,137.2C19.8,137.2,22.3,137.9,24.3,139.1C25.0,139.5,25.2,139.5,24.7,139.0C23.0,137.4,21.1,134.8,19.1,131.5C18.5,130.3,18.5,130.4,18.6,130.4C20.2,130.7,22.1,131.7,24.3,133.4C25.4,134.2,25.4,134.1,24.3,132.9C21.1,129.4,18.7,126.2,17.0,122.8C16.5,122.1,16.5,122.1,16.9,122.2C17.9,122.4,19.2,123.3,20.9,125.0C21.8,125.9,21.9,125.9,21.2,124.8C20.3,123.4,19.2,121.5,18.1,119.5C17.2,117.8,16.0,115.4,16.1,115.3C16.1,115.3,16.8,115.7,17.4,116.1C18.4,116.7,19.5,117.7,20.7,119.0C21.6,119.9,21.7,119.9,21.0,118.8C19.1,115.8,17.3,112.4,16.1,109.4C16.0,109.0,15.9,108.7,15.8,108.7C15.8,108.7,15.8,108.6,15.8,108.5C15.8,108.2,15.7,108.1,18.8,111.5C20.4,113.3,21.7,114.7,21.8,114.7C21.9,114.7,21.8,114.5,21.6,114.2C20.3,112.1,18.9,109.2,17.9,106.3C17.3,104.8,16.6,102.4,16.6,102.4C16.7,102.3,18.5,104.1,19.4,105.2C20.0,105.9,20.1,105.8,19.6,104.9C18.5,102.9,17.5,100.0,17.7,99.3C17.7,99.1,17.8,99.1,17.8,99.2C17.8,99.2,17.9,99.4,18.1,99.5C20.8,101.5,24.6,105.9,28.8,112.1C29.3,112.9,29.5,113.1,29.5,112.9C29.5,112.5,34.2,118.6,36.2,121.7C39.8,127.1,41.8,132.2,42.5,137.5C42.6,138.3,42.6,138.3,41.8,139.3C39.3,142.6,39.2,144.7,41.3,145.6C41.8,145.7,41.7,145.8,41.8,145.4C42.0,144.7,42.3,143.7,42.3,143.6C42.5,143.4,42.4,143.4,42.0,143.4C41.2,143.4,41.1,143.6,43.1,140.0C43.9,138.6,44.1,138.1,44.3,136.2C44.3,135.9,44.3,135.9,43.6,136.3C43.4,136.4,43.2,136.5,43.2,136.5C43.2,136.5,43.3,136.2,43.5,135.9C44.0,134.9,44.5,133.1,44.4,132.9C44.4,132.9,44.1,132.9,43.8,133.0C43.2,133.2,43.0,133.1,43.2,132.9C44.8,131.5,45.3,127.7,44.0,126.6C43.4,126.0,43.1,125.4,42.9,124.6C42.8,124.1,42.8,123.0,42.8,123.1C42.9,123.1,43.0,123.2,43.2,123.4C43.8,123.9,44.7,124.3,45.7,124.3C46.2,124.4,46.3,124.4,46.3,124.3C46.3,124.2,46.2,124.2,45.9,124.1C43.2,123.5,40.8,121.5,41.4,120.3C41.7,119.9,41.9,120.0,42.6,120.8C43.8,122.1,45.9,123.2,47.1,123.3C47.7,123.4,47.7,123.4,47.5,122.9C47.0,121.0,45.9,120.1,44.0,120.1C43.2,120.0,43.2,120.0,43.8,119.1C44.9,117.3,46.1,116.9,48.0,117.6C48.3,117.8,48.5,117.8,49.0,117.8C51.0,117.8,52.6,119.0,54.3,121.6C56.2,124.7,57.3,126.1,58.4,127.3C58.8,127.7,58.8,127.7,58.4,127.8C57.8,127.9,57.2,127.7,56.7,127.2C56.4,126.9,56.3,126.9,56.3,127.2C56.3,127.6,56.7,128.4,57.5,129.4C58.0,130.1,58.8,131.0,59.0,131.0C59.0,131.0,59.2,130.6,59.4,130.0C60.4,127.4,61.8,124.6,63.7,121.8C65.4,119.2,70.3,112.7,70.5,112.8C70.6,112.9,70.7,112.9,70.8,112.7C70.9,112.5,71.4,111.8,72.0,111.0C75.9,105.4,79.2,101.5,81.9,99.5C82.1,99.4,82.2,99.2,82.2,99.2C82.2,99.2,82.2,99.1,82.3,99.1C82.4,99.1,82.4,99.2,82.3,99.8C82.0,101.3,81.4,103.0,80.5,104.8C80.3,105.2,80.1,105.6,80.1,105.6C80.1,105.7,80.2,105.7,80.3,105.5C80.8,104.9,83.3,102.3,83.4,102.4C83.4,102.4,82.8,104.3,82.4,105.4C81.3,108.7,79.8,111.9,78.5,114.0C78.2,114.5,78.1,114.7,78.2,114.7C78.3,114.7,79.6,113.3,81.2,111.5C82.8,109.7,84.1,108.3,84.2,108.3C84.2,108.3,84.2,108.7,84.2,108.7C84.1,108.7,84.0,109.1,83.8,109.6C82.5,112.7,80.9,115.8,79.2,118.6C78.4,119.8,78.4,119.9,79.3,118.9C80.5,117.7,81.6,116.8,82.7,116.1C83.3,115.6,83.9,115.3,83.9,115.3C84.0,115.4,82.2,118.8,81.6,120.1C80.6,121.9,79.4,124.0,78.6,125.2C78.1,125.9,78.2,125.9,78.8,125.2C79.9,124.2,81.0,123.2,81.8,122.7C82.4,122.3,83.5,122.0,83.4,122.2C82.0,125.2,79.2,129.1,75.7,132.9C74.7,134.0,74.7,134.1,75.7,133.4C77.2,132.2,79.0,131.2,80.1,130.8C80.6,130.6,81.4,130.3,81.5,130.4C81.5,130.4,80.7,131.9,80.0,133.0C78.5,135.3,77.0,137.2,75.6,138.7C74.8,139.5,74.8,139.5,75.8,139.0C77.2,138.3,78.5,137.8,79.8,137.4C80.5,137.3,81.8,137.1,81.9,137.2C81.9,137.2,81.4,138.2,80.8,139.0C79.7,140.7,77.9,142.4,75.9,143.7C75.1,144.2,75.1,144.3,75.8,144.1C77.0,143.7,78.5,143.5,79.7,143.4C80.3,143.3,80.3,143.3,80.2,143.7C80.1,145.7,77.2,147.6,71.6,149.3C71.1,149.5,70.9,149.6,70.9,149.7C70.9,149.7,70.9,149.7,71.0,149.7C72.2,149.5,75.5,149.5,79.1,149.8C79.2,149.8,78.4,150.3,77.5,150.8C75.9,151.7,73.5,152.8,71.2,153.6C70.5,153.9,69.9,154.1,69.9,154.2C69.9,154.2,70.4,154.2,71.2,154.2C72.6,154.2,72.7,154.2,74.4,154.6C75.0,154.8,75.6,154.9,75.8,154.9C76.5,155.1,76.5,155.1,75.4,155.5C73.4,156.1,71.8,156.4,69.1,156.6C68.5,156.7,68.5,156.8,69.0,156.9C70.0,157.1,71.4,157.7,72.4,158.2C72.9,158.5,73.5,158.9,73.5,158.9C73.3,158.9,70.8,159.5,70.2,159.6C69.3,159.7,69.4,159.7,69.5,160.1C69.5,160.2,69.6,160.5,69.6,160.7C69.7,161.1,69.7,161.1,70.1,161.4C70.6,161.9,70.6,161.9,70.6,161.2C70.7,160.9,70.7,160.6,70.7,160.6C70.8,160.5,71.0,161.3,71.3,162.2C71.4,162.6,71.5,162.9,71.5,163.0C71.6,163.0,71.6,163.1,71.6,163.1C71.5,163.1,71.5,163.1,71.5,163.2C71.7,164.3,71.8,166.1,71.6,167.1C71.2,169.4,70.3,170.6,68.1,171.7C67.2,172.2,66.4,172.7,65.7,173.5C65.3,173.9,65.3,173.9,65.6,174.3C66.2,175.0,66.7,176.0,67.0,176.8C67.2,177.2,67.3,177.2,67.4,177.1C67.4,177.0,67.4,177.0,67.5,177.2C67.5,177.4,67.6,177.3,68.3,176.4C69.3,175.2,70.8,173.1,71.6,171.7C71.8,171.4,71.9,171.2,71.9,171.1C72.0,171.0,71.8,173.2,71.6,174.3C71.4,175.9,70.8,177.8,70.3,178.8C70.1,179.3,70.2,179.3,70.7,178.8C71.8,177.9,72.9,177.3,74.0,177.1C74.2,177.1,74.2,177.1,74.1,177.2C73.6,177.8,70.5,181.3,69.9,181.9C69.3,182.5,69.4,182.9,70.2,183.9C70.5,184.3,71.2,184.9,71.4,185.0C71.7,185.1,71.6,185.3,71.3,185.3C70.9,185.4,70.5,185.7,69.2,186.9C68.2,187.8,68.2,187.8,67.6,187.6C66.9,187.4,66.9,187.4,67.2,187.9C67.6,188.5,67.5,188.5,66.9,188.1C66.4,187.7,65.5,187.2,65.3,187.2C65.2,187.2,65.2,187.3,65.1,187.5C65.0,188.3,64.1,189.7,63.3,190.4C63.1,190.6,62.9,190.8,62.9,190.8C62.8,191.1,62.8,190.7,63.0,190.4C63.7,188.7,63.4,186.8,62.6,187.2C62.4,187.3,62.3,187.3,62.2,187.2C62.0,187.1,61.8,187.2,61.6,187.5C61.2,188.2,60.6,188.9,60.0,189.3C59.7,189.6,59.3,189.9,59.2,190.1C58.8,190.4,58.8,190.4,58.8,189.6C58.8,189.1,58.8,188.7,58.8,188.7C58.8,188.7,58.6,188.8,58.4,188.9C57.8,189.3,57.3,189.5,56.7,189.6C55.9,189.7,55.9,189.7,56.4,189.3C57.3,188.5,59.0,186.7,59.0,186.5C59.0,186.5,58.8,186.4,58.5,186.3C57.9,186.1,57.9,186.1,57.4,186.7C56.5,187.9,54.3,189.8,54.2,189.5C54.2,189.4,54.2,189.3,54.3,189.2C54.4,189.1,54.7,188.3,54.7,188.2C54.7,188.1,54.3,188.0,53.3,187.7C53.1,187.7,53.2,187.7,53.4,188.4C53.7,189.0,53.7,189.0,53.6,189.0C53.4,189.0,53.1,188.8,52.8,188.5C52.4,188.1,52.4,188.1,52.2,188.5C52.0,188.9,51.4,189.9,51.1,190.3C50.9,190.6,50.7,190.6,50.7,190.3C50.7,190.2,50.7,189.7,50.7,189.3C50.6,188.9,50.6,188.3,50.6,188.1C50.7,187.7,50.7,187.7,50.3,187.7C50.2,187.7,49.9,187.6,49.8,187.6C49.6,187.5,49.6,187.6,50.0,188.4C50.6,189.6,50.5,189.6,49.4,188.7C47.7,187.2,47.6,187.1,47.4,187.6C47.1,188.6,47.4,189.7,48.3,190.5C48.6,190.7,48.6,190.9,48.5,190.9C48.4,190.9,48.4,190.8,48.4,190.8ZM65.2,179.1C65.6,177.9,65.7,175.8,65.4,174.4C65.3,174.0,65.2,174.0,64.8,174.5C64.6,175.0,64.5,175.0,64.5,175.4C64.4,176.1,64.5,178.2,64.7,178.8C64.7,179.0,65.0,179.3,65.1,179.3C65.2,179.3,65.2,179.2,65.2,179.1ZM59.4,178.2C59.6,178.0,59.9,177.2,59.8,176.9C59.8,176.6,59.4,175.7,59.3,175.7C59.1,175.7,58.9,176.6,59.0,177.1C59.1,178.3,59.2,178.4,59.4,178.2ZM62.3,175.5C62.3,174.7,62.4,174.3,62.5,173.2C62.5,172.8,62.5,172.8,61.9,173.2C61.5,173.5,61.5,173.5,61.8,174.4C61.9,174.8,62.0,175.4,62.1,175.7C62.2,176.6,62.3,176.5,62.3,175.5ZM41.2,173.5C41.6,172.9,41.6,172.9,41.6,171.5C41.6,169.9,41.6,169.8,41.3,170.5C41.0,171.4,40.8,172.4,40.8,173.6C40.7,174.3,40.8,174.3,41.2,173.5ZM38.5,171.2C38.6,169.7,39.0,168.3,39.7,166.8C40.3,165.7,40.2,165.7,39.5,166.6C38.6,167.6,38.6,167.6,38.5,167.2C38.2,165.8,38.2,164.4,38.5,163.2C38.7,162.4,38.6,162.3,38.4,162.6C38.3,162.7,38.1,163.0,37.8,163.2C37.6,163.5,37.3,163.7,37.3,163.8C37.2,164.0,37.3,165.0,37.4,165.4C37.5,166.1,37.1,165.6,36.7,164.7C36.7,164.5,36.6,164.3,36.6,164.3C36.4,164.3,35.6,164.8,35.6,164.9C35.5,166.1,36.1,169.2,36.7,170.4C37.0,170.9,37.0,170.9,37.2,170.0C37.3,169.6,37.5,168.9,37.6,168.3C38.1,166.3,38.2,166.3,38.2,168.4C38.2,169.7,38.2,171.1,38.3,171.5C38.4,171.7,38.5,171.6,38.5,171.2ZM61.0,170.8C61.7,169.6,62.0,168.1,62.1,166.4C62.1,165.1,61.8,164.1,61.8,165.2C61.8,165.6,61.5,167.2,61.4,167.5C61.4,167.6,61.3,167.5,61.2,167.4C61.0,167.1,61.0,167.1,60.5,167.7C60.0,168.1,60.0,168.1,60.1,168.4C60.1,168.5,60.1,168.9,60.1,169.1C60.2,170.0,60.5,171.3,60.6,171.3C60.7,171.3,60.8,171.1,61.0,170.8ZM68.1,169.0C68.8,168.1,69.5,166.6,70.0,164.4C70.4,163.0,70.4,163.0,70.0,163.0C69.6,163.0,69.6,163.0,69.6,163.3C69.5,164.0,68.9,165.1,68.6,165.5C68.4,165.6,68.4,165.6,68.5,165.5C68.6,164.9,68.6,164.6,68.7,164.0C68.7,162.9,68.7,162.8,68.3,162.8C68.1,162.7,67.7,162.7,67.3,162.6C67.0,162.5,66.6,162.4,66.6,162.4C66.5,162.4,66.6,162.6,66.8,163.0C66.9,163.2,67.1,163.6,67.2,163.8C67.3,164.1,67.5,164.6,67.7,164.8C67.9,165.3,67.9,165.3,67.8,165.3C67.7,165.4,67.7,165.3,67.8,166.0C68.0,166.9,68.0,168.2,67.8,168.7C67.6,169.3,67.6,169.4,67.7,169.4C67.8,169.4,67.9,169.2,68.1,169.0ZM64.5,167.9C65.0,167.2,65.2,166.7,65.4,166.0C65.5,165.3,65.5,165.2,65.2,165.1C64.2,164.8,63.1,164.1,62.1,163.2C61.6,162.7,61.6,162.7,61.6,163.1C61.7,163.6,61.7,163.7,61.9,163.9C62.8,164.7,64.0,167.3,64.0,168.4C64.0,168.7,64.1,168.6,64.5,167.9ZM58.4,145.7C60.8,144.9,60.8,142.7,58.1,139.3C57.4,138.3,57.4,138.3,57.5,137.5C57.6,136.5,57.9,134.8,58.2,133.8C58.4,132.8,58.4,132.8,58.1,132.6C57.4,132.2,56.5,131.4,55.5,130.4C55.0,129.8,55.0,129.8,55.0,130.3C55.0,130.8,55.0,131.1,55.2,131.5C55.3,131.7,55.3,131.7,55.0,132.2C54.5,132.7,54.5,132.7,55.0,133.1C55.3,133.2,55.6,133.5,55.7,133.7C56.2,134.3,56.4,135.0,55.9,134.5C55.3,133.8,54.8,133.8,54.8,134.6C54.7,135.2,54.9,135.5,55.7,136.7C56.1,137.3,56.3,137.9,56.3,138.2C56.3,138.3,56.3,138.3,56.3,138.3C55.6,137.9,55.1,137.7,54.9,137.8C54.8,137.9,54.8,137.9,55.2,138.9C56.1,141.4,57.3,143.5,58.0,144.1C58.1,144.3,58.1,144.3,58.0,144.4C57.8,144.6,57.2,145.0,57.1,145.0C57.0,145.0,57.0,145.1,57.2,145.8C57.3,145.9,57.7,145.9,58.4,145.7Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'fleur':
            o += '<path d="' + 'M49.9,193.6C49.6,193.0,49.2,191.8,48.6,190.7C47.5,188.2,47.1,186.9,47.0,185.8C47.0,185.3,46.9,185.3,46.5,185.6C46.2,185.9,45.5,186.3,44.9,186.4C44.5,186.5,42.9,186.6,42.9,186.6C42.9,186.5,43.0,186.4,43.1,186.3C43.4,186.1,44.0,185.2,44.2,184.7C44.7,183.8,45.0,182.9,45.6,180.7C46.1,178.8,46.5,177.8,47.0,177.2C47.6,176.5,47.5,176.7,47.6,175.4C47.7,174.0,47.8,172.6,47.8,170.9C47.8,169.8,47.8,169.8,47.4,169.8C47.0,169.8,47.0,169.8,47.0,170.7C46.6,176.9,44.6,181.1,41.1,183.0C39.2,184.0,36.9,184.2,34.9,183.5C31.1,182.1,28.9,178.5,29.1,173.7C29.2,169.1,31.3,165.9,34.4,165.3C34.8,165.3,36.6,165.3,36.7,165.4C36.7,165.4,36.5,165.8,36.4,166.3C35.7,168.0,35.5,169.1,35.5,170.6C35.5,172.1,35.7,172.8,36.3,173.8C37.6,175.8,40.3,175.8,41.8,173.9C42.4,173.0,43.2,170.8,43.2,169.9C43.2,169.8,43.0,169.8,42.0,169.8C40.6,169.8,40.3,169.7,39.7,169.2C38.1,167.9,38.4,165.4,40.3,164.5C40.6,164.4,41.3,164.3,42.1,164.3C42.9,164.3,42.9,164.3,42.7,163.7C42.2,161.5,40.6,158.6,39.1,156.9C35.6,152.9,31.5,151.7,28.7,153.6C25.7,155.8,24.3,161.6,25.7,166.2C25.8,166.6,25.9,166.9,25.9,166.9C25.8,166.9,24.4,166.3,23.9,166.0C20.0,164.1,17.3,160.8,16.3,156.4C16.1,155.7,15.9,154.5,15.9,154.2C15.9,154.1,15.9,154.0,15.8,154.0C15.8,154.0,15.8,153.4,15.8,152.2C15.8,151.1,15.8,150.4,15.8,150.4C15.9,150.4,15.9,150.3,15.9,150.3C15.9,149.7,16.3,147.7,16.6,146.6C18.2,141.3,21.5,137.5,25.3,136.6C26.4,136.3,28.9,136.3,30.0,136.5C38.0,138.1,44.0,146.2,46.2,158.2C46.6,160.0,47.0,163.2,47.0,164.1C47.0,164.3,47.0,164.3,47.3,164.3C47.6,164.3,47.6,164.3,47.6,164.0C47.6,163.9,47.6,163.5,47.5,163.1C46.9,155.6,45.3,149.0,41.8,140.0C40.5,136.5,40.4,136.1,40.0,134.6C39.4,131.7,39.4,128.3,40.1,124.9C40.6,122.0,40.8,121.5,46.0,107.4C47.6,102.9,49.9,96.3,49.9,96.0C49.9,96.0,50.0,95.9,50.0,95.9C50.0,95.9,50.0,96.0,50.0,96.0C50.0,96.2,51.0,99.0,52.2,102.6C53.2,105.2,54.0,107.5,57.0,115.6C58.2,118.7,58.7,120.3,59.0,121.3C60.6,126.5,60.8,130.9,59.8,135.2C59.6,136.3,59.2,137.2,58.1,140.3C55.5,146.8,54.1,151.8,53.2,157.3C52.9,159.4,52.6,162.2,52.5,163.7C52.5,164.3,52.5,164.3,52.7,164.3C53.0,164.3,53.0,164.3,53.0,163.8C54.0,149.9,60.2,139.2,68.7,136.8C70.9,136.2,73.5,136.2,75.3,136.8C79.0,137.9,82.2,142.0,83.5,147.2C83.8,148.3,84.1,150.0,84.1,150.5C84.1,150.6,84.1,150.7,84.2,150.7C84.2,150.7,84.2,151.2,84.2,152.2C84.2,153.1,84.2,153.8,84.2,153.8C84.1,153.8,84.1,153.9,84.1,154.1C83.7,158.9,81.0,163.2,76.9,165.6C76.0,166.1,74.2,166.9,74.1,166.8C74.1,166.8,74.2,166.6,74.3,166.3C75.2,163.4,75.0,159.4,73.6,156.6C71.6,152.3,67.9,151.5,63.7,154.4C60.7,156.4,58.5,159.5,57.3,163.3C57.0,164.4,56.9,164.3,58.2,164.3C59.8,164.4,60.3,164.6,61.0,165.5C62.0,166.9,61.4,169.0,59.7,169.7C59.4,169.7,59.1,169.8,58.1,169.8C56.5,169.8,56.6,169.7,56.9,171.0C57.5,173.1,58.3,174.4,59.6,175.0C61.6,175.9,63.8,174.7,64.3,172.2C64.7,170.5,64.5,168.6,63.6,166.2C63.4,165.8,63.3,165.4,63.3,165.4C63.4,165.2,65.5,165.3,66.0,165.4C67.6,165.9,69.0,167.1,69.8,168.9C71.6,172.5,71.2,177.6,69.1,180.5C67.0,183.4,63.2,184.6,59.9,183.4C55.9,182.0,53.5,177.6,53.0,170.6C52.9,169.8,52.9,169.8,52.6,169.8C52.3,169.8,52.3,169.8,52.3,170.5C52.3,171.4,52.4,173.1,52.5,174.8C52.6,176.3,52.6,176.3,53.1,177.0C53.8,178.1,54.2,179.0,54.7,181.2C55.5,184.4,55.9,185.4,56.9,186.4C57.1,186.6,57.1,186.6,56.3,186.5C55.4,186.5,54.9,186.4,54.2,186.1C53.8,185.9,53.3,185.5,53.2,185.3C53.1,185.1,53.0,185.3,53.0,185.6C52.9,186.6,52.6,187.8,51.4,190.5C51.0,191.6,50.5,192.8,50.4,193.2C50.2,193.7,50.1,194.1,50.1,194.1C50.1,194.1,50.0,193.8,49.9,193.6Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'anchor':
            o += '<path d="' + 'M48.7,224.7C47.6,223.0,45.9,221.7,41.1,218.9C35.6,215.8,32.8,213.9,30.1,211.3C22.9,204.8,18.4,195.4,16.0,182.6C15.8,181.3,15.8,181.3,15.8,178.3C15.8,175.4,15.8,175.4,16.4,175.4C16.9,175.4,16.9,175.4,18.1,177.6C20.0,181.1,22.5,185.5,26.5,192.3C28.1,195.0,28.1,195.0,28.0,195.9C28.0,196.8,28.0,196.8,26.8,196.9C25.6,197.0,25.6,197.0,26.3,198.2C31.4,205.9,40.1,211.6,44.2,209.8C46.1,209.0,47.2,207.2,47.5,204.3C47.5,204.0,47.4,183.5,47.2,158.3C47.0,133.3,46.9,112.8,46.9,112.6C46.9,112.4,46.4,112.2,45.1,111.9C43.3,111.5,43.4,111.4,43.4,112.2C43.4,114.3,43.0,119.8,42.8,120.6C42.4,121.9,41.9,122.4,40.8,122.4C39.8,122.5,39.6,122.3,39.3,121.4C39.0,120.7,39.1,118.1,39.3,115.4C39.5,113.5,39.7,111.4,39.7,111.1C39.7,110.9,39.6,110.9,39.4,110.9C39.3,110.9,37.9,110.7,36.3,110.5C29.7,109.5,27.5,108.9,26.9,108.0C26.6,107.6,26.6,105.5,26.8,105.1C27.1,104.5,26.9,104.5,32.9,104.6C36.0,104.6,38.5,104.6,38.5,104.6C38.5,104.5,37.5,103.2,36.6,102.2C33.2,98.6,32.1,96.6,31.3,92.9C31.0,91.9,31.0,91.9,31.0,88.8C31.0,85.5,31.1,84.8,31.5,82.6C33.2,74.7,38.7,67.7,45.4,65.0C46.3,64.6,55.1,64.6,55.7,65.0C59.1,67.1,62.4,72.4,63.3,77.4C63.8,79.6,63.9,83.4,63.6,85.7C63.1,90.7,60.9,95.4,57.7,98.2C57.4,98.5,57.4,98.6,57.3,99.0C57.2,100.0,56.7,100.5,56.0,100.7C55.7,100.7,55.6,100.8,55.6,101.0C55.6,101.6,55.4,102.9,55.1,103.8C54.8,104.7,54.8,104.7,57.0,104.7C58.2,104.7,62.2,104.6,65.9,104.6C73.2,104.5,72.8,104.5,73.2,105.1C73.4,105.5,73.4,107.6,73.1,108.0C72.5,109.0,70.2,109.6,61.8,110.7C55.6,111.6,53.1,112.1,53.1,112.5C53.0,122.8,52.5,204.0,52.5,204.3C52.8,207.2,53.9,209.0,55.8,209.8C59.9,211.6,68.6,205.9,73.7,198.2C74.4,197.0,74.4,197.0,73.2,196.9C72.0,196.8,72.0,196.8,72.0,195.9C71.9,195.0,71.9,195.0,74.0,191.5C77.9,184.8,80.4,180.3,82.3,176.8C83.1,175.4,83.1,175.4,83.6,175.4C84.2,175.4,84.2,175.4,84.2,178.3C84.2,181.3,84.2,181.3,83.9,182.8C81.2,197.7,75.4,207.9,65.9,214.6C64.0,215.9,62.6,216.8,58.7,219.0C54.1,221.6,52.3,223.0,51.3,224.7C51.0,225.3,51.0,225.3,50.0,225.3C49.0,225.3,49.0,225.3,48.7,224.7ZM44.9,103.9C44.5,102.6,44.4,101.6,44.4,99.5C44.4,96.3,44.8,94.6,45.9,92.8C47.0,91.0,48.0,90.4,50.0,90.4C51.7,90.4,52.9,91.0,53.8,92.3C54.1,92.8,54.1,92.8,54.7,92.7C55.3,92.7,55.3,92.7,55.9,92.0C58.3,89.2,60.0,84.8,59.8,82.5C59.4,79.3,58.4,76.1,57.1,74.0C55.4,71.2,52.5,69.7,49.9,70.2C43.3,71.4,36.7,78.5,35.1,86.1C34.2,90.1,35.9,94.1,39.9,97.4C41.5,98.7,42.5,100.7,43.0,103.6C43.2,104.7,43.2,104.7,44.0,104.7C44.4,104.7,44.9,104.8,45.0,104.8C45.2,104.8,45.2,104.8,44.9,103.9ZM50.4,101.8C50.8,101.5,51.3,100.8,51.2,100.8C50.6,100.4,50.5,99.8,50.5,98.3C50.5,97.1,50.5,97.1,50.3,97.0C49.6,96.5,48.3,98.3,48.4,99.6C48.5,100.2,48.9,101.1,49.2,101.5C49.8,102.1,50.0,102.1,50.4,101.8Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'raven':
            o += '<path d="' + 'M45.4,181.8C45.4,181.8,45.4,181.8,45.3,181.8C45.3,181.8,45.3,181.6,45.3,181.2C45.5,180.6,45.4,180.0,45.2,179.8C45.1,179.7,45.1,179.6,45.1,179.6C45.3,179.3,45.6,179.3,46.5,179.7C47.3,180.0,47.8,180.1,48.2,180.1C48.5,180.1,48.5,180.1,48.7,179.8C49.0,179.5,49.0,179.5,49.3,179.5C49.6,179.6,49.7,179.5,49.7,179.2C49.7,178.9,49.9,178.6,50.3,178.6C50.7,178.6,50.8,178.4,50.8,177.7C50.9,177.0,50.9,175.3,50.8,173.9C50.8,172.8,50.8,172.7,50.9,172.0C50.9,171.5,51.0,171.1,51.0,170.2C51.0,169.0,51.0,169.0,51.2,169.2C51.6,169.5,51.9,170.1,52.1,170.6C52.2,170.8,52.2,170.9,52.1,171.3C52.1,171.5,52.0,172.0,52.0,172.4C52.0,173.1,51.9,173.6,51.6,175.0C51.4,175.8,51.5,178.4,51.7,178.8C51.7,178.9,51.8,179.0,51.8,179.2C51.9,180.2,53.0,180.6,54.8,180.3C55.9,180.2,56.1,180.1,56.4,180.0C57.2,179.5,57.4,179.5,57.4,180.3C57.4,180.6,57.4,181.0,57.5,181.1C57.6,181.8,57.1,181.9,56.6,181.3C56.3,181.0,56.3,181.0,55.9,181.2C55.6,181.4,55.2,181.4,54.6,181.2C54.2,181.1,54.2,181.1,53.8,181.1C53.5,181.2,53.5,181.2,53.1,180.9C52.6,180.5,52.3,180.5,51.8,180.8C51.4,181.1,51.4,181.1,50.9,180.9C50.4,180.7,50.1,180.7,49.7,180.9C49.4,181.1,49.3,181.1,48.9,180.9C48.5,180.7,48.3,180.7,47.9,180.9C47.6,181.0,46.3,181.7,46.3,181.8C46.3,181.9,45.4,181.9,45.4,181.8ZM63.3,181.8C63.2,181.7,63.2,181.6,63.3,181.2C63.4,180.6,63.4,180.0,63.2,179.8C63.0,179.7,63.0,179.5,63.2,179.4C63.3,179.3,63.9,179.5,64.4,179.7C65.7,180.3,66.4,180.3,66.7,179.8C66.8,179.6,66.9,179.5,67.1,179.5C67.4,179.4,67.6,179.2,67.6,178.8C67.5,178.0,66.3,175.5,65.3,174.0C64.9,173.4,64.7,173.0,64.4,172.0C64.1,171.1,64.0,170.7,63.6,169.9C63.4,169.6,63.3,169.4,63.3,169.3C63.3,169.2,64.2,169.5,64.8,169.9C65.2,170.2,66.3,172.6,66.6,174.1C66.8,174.8,67.5,176.2,68.4,177.7C68.8,178.4,70.0,179.9,70.3,180.0C70.9,180.5,71.7,180.5,73.6,180.2C73.8,180.2,74.1,180.1,74.3,180.0C75.0,179.6,75.5,179.6,75.4,180.0C75.3,180.1,75.3,180.6,75.4,181.1C75.5,181.9,75.1,182.0,74.5,181.3C74.2,181.0,74.2,181.0,73.9,181.2C73.5,181.4,73.2,181.4,72.6,181.2C72.2,181.1,72.1,181.1,71.8,181.1C71.4,181.2,71.4,181.2,71.1,181.0C70.5,180.5,70.2,180.4,69.6,180.9C69.3,181.1,69.3,181.1,68.8,180.9C68.3,180.7,68.0,180.7,67.7,180.9C67.5,181.0,67.3,181.1,67.2,181.1C67.2,181.1,67.0,181.0,66.8,180.9C66.2,180.7,65.9,180.7,64.9,181.3C64.5,181.6,64.2,181.8,64.2,181.8C64.2,181.9,63.4,181.9,63.3,181.8ZM61.8,180.9C62.0,180.7,62.4,180.4,62.7,180.3C62.9,180.3,62.9,180.3,63.0,180.5C63.0,180.7,63.0,180.8,62.6,180.8C62.3,180.8,62.2,180.8,61.9,181.0C61.6,181.2,61.6,181.2,61.8,180.9ZM43.9,180.9C44.2,180.6,44.5,180.3,44.8,180.3C45.0,180.3,45.0,180.3,45.0,180.5C45.0,180.8,45.0,180.8,44.6,180.8C44.3,180.8,44.2,180.8,44.0,181.0C43.7,181.2,43.7,181.2,43.9,180.9ZM59.0,181.0C58.8,180.8,58.3,180.6,58.0,180.7C57.8,180.7,57.8,180.7,57.8,180.4C57.8,180.2,57.8,180.2,58.0,180.2C58.3,180.3,58.7,180.5,58.9,180.8C59.1,181.1,59.2,181.2,59.0,181.0ZM76.7,180.9C76.5,180.7,76.4,180.7,76.1,180.7C75.8,180.7,75.7,180.7,75.7,180.5C75.7,180.1,75.9,180.1,76.4,180.4C76.6,180.6,77.2,181.1,77.0,181.1C77.0,181.1,76.9,181.0,76.7,180.9ZM54.4,179.8C55.8,179.5,56.3,179.3,56.8,179.0C57.5,178.5,57.9,178.5,57.8,179.0C57.8,179.1,57.7,179.3,57.8,179.4C57.8,179.6,57.8,179.6,57.7,179.4C57.4,179.0,57.0,179.1,56.2,179.5C56.0,179.6,55.8,179.7,55.3,179.7C54.7,179.8,54.1,179.9,54.4,179.8ZM59.3,179.7C59.0,179.5,58.9,179.5,58.6,179.5C58.2,179.6,58.2,179.6,58.2,179.3C58.2,179.1,58.2,179.1,58.3,179.1C58.6,179.1,59.0,179.3,59.3,179.5C59.5,179.7,59.6,179.9,59.5,179.8C59.5,179.8,59.4,179.8,59.3,179.7ZM72.6,179.7C73.7,179.5,74.3,179.3,74.7,179.0C75.2,178.6,75.8,178.5,75.7,178.9C75.7,179.0,75.7,179.2,75.7,179.3C75.7,179.5,75.7,179.5,75.6,179.3C75.3,179.1,74.8,179.1,74.2,179.5C73.9,179.6,73.7,179.7,73.2,179.7C72.4,179.9,72.0,179.9,72.6,179.7ZM77.1,179.6C76.9,179.5,76.8,179.5,76.5,179.5C76.1,179.6,76.1,179.6,76.1,179.4C76.1,179.1,76.1,179.1,76.4,179.1C76.7,179.2,77.2,179.4,77.3,179.6C77.4,179.7,77.4,179.8,77.4,179.8C77.4,179.8,77.3,179.7,77.1,179.6ZM55.2,179.0C55.3,178.9,55.5,178.7,55.7,178.5C56.3,177.8,56.7,177.6,56.7,178.2C56.7,178.6,56.4,178.8,55.6,179.0C55.4,179.0,55.1,179.1,55.0,179.1C55.0,179.1,55.1,179.1,55.2,179.0ZM73.2,178.9C73.4,178.8,73.6,178.6,73.7,178.4C74.0,178.1,74.3,177.8,74.4,177.8C74.6,177.8,74.6,177.9,74.7,178.2C74.7,178.5,74.3,178.8,73.7,178.9C73.5,179.0,73.3,179.0,73.2,179.1C73.0,179.1,73.0,179.1,73.2,178.9ZM58.1,178.3C58.0,178.2,57.7,178.2,57.5,178.2C57.1,178.2,57.0,178.1,57.2,178.1C57.3,178.0,57.4,178.0,57.5,178.0C57.6,178.0,58.1,178.1,58.4,178.2C58.6,178.4,58.5,178.4,58.1,178.3ZM76.0,178.3C75.9,178.2,75.6,178.2,75.4,178.2C75.0,178.2,75.0,178.1,75.4,178.0C75.6,178.0,76.0,178.1,76.3,178.2C76.5,178.3,76.4,178.4,76.0,178.3ZM24.7,171.0C24.1,170.9,23.4,170.7,23.1,170.4C22.8,170.2,22.4,169.7,22.4,169.7C22.5,169.7,22.9,169.6,23.4,169.5C26.1,168.9,27.1,168.5,29.6,167.0C31.0,166.1,32.0,165.5,32.9,165.0C33.4,164.7,33.5,164.7,33.5,164.5C33.5,164.2,33.3,164.2,32.3,164.8C31.2,165.4,31.0,165.5,29.3,166.6C26.9,168.1,25.9,168.5,23.0,169.1C22.4,169.2,21.8,169.3,21.6,169.3C20.2,169.6,19.0,169.1,18.4,167.8C18.2,167.4,18.2,167.4,18.8,167.4C22.1,167.1,25.5,165.8,30.5,162.8C32.9,161.4,34.3,160.6,34.9,160.2C35.6,159.9,35.6,159.9,35.6,159.7C35.5,159.3,35.3,159.4,31.4,161.7C24.9,165.6,22.4,166.6,18.0,167.0C16.5,167.1,15.8,166.8,15.8,165.8C15.8,165.4,15.8,165.4,16.7,165.1C23.0,163.7,28.4,160.9,34.4,155.9C35.7,154.9,36.1,154.6,38.0,153.1C41.8,150.2,43.3,148.9,44.7,147.3C45.4,146.5,45.6,146.2,45.6,146.0C45.6,145.8,45.4,145.9,44.6,146.2C43.8,146.6,43.1,146.7,42.1,146.8C41.7,146.8,41.3,146.8,41.3,146.8C41.3,146.8,41.5,146.6,41.7,146.5C44.1,144.6,46.0,142.5,49.7,138.0C52.1,135.1,52.1,135.1,52.8,134.3C53.7,133.3,54.6,132.2,55.4,131.4C55.9,130.8,56.0,130.7,56.0,130.6C56.0,130.5,56.0,130.4,55.9,130.4C55.6,130.4,52.9,133.3,49.8,137.2C45.6,142.3,43.5,144.5,41.0,146.4C40.6,146.7,40.4,146.9,40.3,147.1C39.8,147.9,38.9,148.7,36.3,150.0C35.4,150.5,34.2,151.2,33.6,151.5C30.8,153.0,29.2,153.6,27.6,153.9C27.1,154.0,26.8,154.1,26.4,154.4C24.5,155.3,23.1,155.4,21.7,154.8C21.2,154.6,21.2,154.6,21.0,154.8C20.7,155.2,20.6,155.2,19.6,155.2C18.8,155.2,18.7,155.2,18.5,155.4C17.7,155.9,16.5,155.8,16.4,155.4C16.4,155.2,16.4,155.1,16.9,154.6C18.1,153.3,19.2,152.4,21.6,150.8C29.1,145.8,32.9,141.9,42.3,129.8C47.3,123.4,49.6,120.6,50.9,119.4C54.4,116.2,58.3,115.0,60.6,116.4C61.6,117.1,62.1,118.6,62.1,121.0C62.1,122.0,62.1,122.2,61.6,123.8C61.0,125.6,60.9,125.9,61.0,127.0C61.0,128.2,60.9,128.9,60.4,130.5C60.1,131.4,60.1,131.6,60.3,131.6C60.6,131.6,61.3,130.0,61.9,128.0C62.3,126.7,62.6,125.3,63.4,121.8C64.7,116.5,65.1,115.1,65.7,113.7C67.0,110.9,69.2,108.7,71.1,108.3C71.3,108.2,71.4,108.2,71.4,108.2C71.4,108.1,71.9,108.1,72.5,108.1C73.2,108.1,73.6,108.1,73.6,108.2C73.6,108.2,73.8,108.2,73.9,108.3C74.4,108.4,75.0,108.6,75.8,109.1C76.6,109.6,76.6,109.6,77.7,109.7C78.7,109.7,79.5,109.8,79.9,109.9C80.1,110.0,80.2,110.5,80.0,110.7C79.7,111.0,78.8,111.5,78.3,111.5C77.6,111.5,76.2,112.4,75.9,113.2C75.8,113.4,75.7,113.5,75.6,113.5C75.4,113.5,75.4,113.8,75.5,114.0C75.6,114.0,75.7,114.2,75.7,114.4C76.0,115.0,76.2,115.2,76.8,115.2C77.1,115.2,77.1,115.2,77.2,115.5C77.2,115.6,77.3,115.8,77.3,115.8C77.5,116.0,77.5,116.0,76.8,116.5C75.3,117.7,74.6,118.7,73.7,120.9C73.5,121.4,73.4,121.9,73.4,122.0C73.4,122.0,73.5,122.4,73.7,122.9C74.4,124.8,74.7,126.5,74.9,129.7C75.2,134.3,75.1,137.6,74.5,141.6C73.5,147.9,72.1,150.8,67.8,155.4C66.8,156.6,66.5,157.0,66.1,158.6C65.8,159.8,65.6,160.7,65.2,163.9C65.1,164.8,64.9,165.9,64.9,166.2C64.8,166.9,64.8,166.9,64.8,167.6C64.9,168.2,65.1,169.2,65.2,169.5C65.2,169.6,65.2,169.6,65.1,169.6C65.1,169.6,64.9,169.4,64.6,169.3C63.9,168.8,63.6,168.7,63.1,168.8C62.7,168.9,62.7,169.0,62.3,168.1C61.6,166.8,61.2,165.4,60.9,163.1C60.7,162.1,60.7,162.1,60.5,162.2C60.4,162.2,60.1,162.3,59.9,162.4C59.7,162.5,59.3,162.6,59.0,162.7C58.5,162.8,58.5,162.8,58.2,163.1C58.1,163.3,57.5,163.8,57.0,164.2C56.2,164.8,56.1,165.0,55.4,165.8C55.1,166.3,54.6,166.9,54.3,167.2C53.6,167.9,53.2,168.8,52.9,170.2C52.8,170.5,52.7,170.8,52.7,170.8C52.7,170.8,52.5,170.6,52.4,170.2C52.1,169.5,51.4,168.6,50.9,168.2C50.7,168.0,50.7,168.0,50.6,167.4C50.3,166.1,50.3,164.9,50.5,164.0C50.7,163.4,50.7,163.3,49.9,163.4C48.7,163.6,48.2,163.7,47.3,164.3C45.9,165.2,45.3,165.4,43.0,165.7C41.1,166.0,40.2,166.3,37.3,167.5C31.6,169.9,26.9,171.2,24.7,171.0ZM28.1,150.1C31.1,148.0,34.3,145.2,37.3,141.8C38.7,140.2,39.7,139.0,43.0,135.0C47.7,129.1,49.7,126.8,52.6,124.1C53.4,123.4,53.5,123.2,53.5,123.1C53.5,123.0,53.5,122.9,53.4,122.9C53.2,122.9,53.0,123.1,51.5,124.5C48.8,127.2,47.2,129.1,42.2,135.3C35.9,143.0,32.5,146.5,27.9,149.7C27.3,150.1,27.3,150.2,27.4,150.4C27.5,150.5,27.5,150.5,28.1,150.1ZM35.5,147.9C39.4,144.9,41.9,142.3,47.7,134.9C51.1,130.6,52.0,129.4,53.8,127.5C54.6,126.6,54.7,126.4,54.6,126.3C54.4,126.1,54.3,126.2,53.0,127.7C51.4,129.4,50.3,130.8,47.3,134.7C41.9,141.6,39.3,144.4,35.6,147.2C34.4,148.2,34.4,148.2,34.6,148.4C34.7,148.5,34.8,148.5,35.5,147.9ZM74.1,145.5C75.1,141.5,75.6,136.5,75.4,132.3C75.3,128.8,75.1,126.6,74.7,125.0C74.6,124.3,74.6,124.2,74.6,124.2C75.1,123.8,75.7,123.0,76.0,122.3C76.3,121.7,76.9,121.1,77.8,120.7C80.4,119.6,81.6,121.3,82.0,127.0C82.4,131.7,81.9,134.8,80.3,138.0C79.1,140.3,78.7,140.9,77.5,141.7C76.5,142.5,76.0,143.1,74.8,144.8C74.4,145.4,74.0,145.9,74.0,145.9C74.0,145.9,74.0,145.7,74.1,145.5ZM77.8,115.6C77.7,115.6,77.6,115.5,77.6,115.3C77.4,114.6,77.5,114.7,76.9,114.7C76.5,114.7,76.4,114.7,76.3,114.5C76.2,114.5,76.1,114.4,76.1,114.3C76.1,114.2,77.0,114.3,77.5,114.4C78.3,114.5,79.6,114.6,81.2,114.6C82.0,114.6,82.6,114.6,82.6,114.6C82.6,114.7,82.4,114.7,82.1,114.8C81.8,114.9,81.1,115.0,80.6,115.2C79.2,115.5,77.9,115.7,77.8,115.6ZM76.7,113.0C76.7,112.9,77.3,112.4,77.6,112.2C77.9,112.0,78.0,112.0,78.4,112.0C78.6,112.0,78.8,112.0,78.9,111.9C78.9,111.9,79.2,111.8,79.4,111.6C80.2,111.3,80.4,111.0,80.5,110.5C80.5,110.2,80.6,110.2,81.2,110.4C82.3,110.6,83.0,111.1,83.6,111.8C84.2,112.5,84.3,112.9,84.1,112.7C83.5,112.4,83.7,112.4,80.8,112.5C78.2,112.5,77.8,112.6,77.1,112.9C76.9,113.0,76.7,113.0,76.7,113.0ZM73.8,112.6C74.4,112.2,74.6,111.0,74.0,110.3C73.3,109.5,72.2,110.1,72.2,111.3C72.2,112.4,73.1,113.1,73.8,112.6ZM73.0,111.8C72.6,111.3,73.0,110.5,73.5,110.7C74.0,111.0,73.8,112.0,73.3,112.0C73.1,112.0,73.1,111.9,73.0,111.8Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        case 'boar':
            o += '<path d="' + 'M 69.5 166.4 C 69.4 166.3 69.5 165.7 69.6 165.7 C 69.7 165.6 69.7 165.4 69.6 165.4 C 69.6 165.4 69.1 165.9 69.0 166.1 C 68.8 166.4 68.2 166.4 68.2 166.1 C 68.2 165.7 68.8 164.2 69.3 163.4 C 69.6 162.9 69.6 162.9 69.6 161.9 C 69.6 160.8 69.6 160.8 69.8 160.1 C 70.2 159.0 70.3 158.1 70.1 157.0 C 69.7 154.8 68.6 153.8 66.1 153.0 C 65.9 153.0 65.6 152.8 65.4 152.8 C 65.2 152.6 64.8 152.5 64.2 152.4 C 62.7 152.0 61.5 151.3 60.8 150.5 C 60.7 150.3 60.7 150.3 58.3 150.3 C 55.1 150.3 50.2 150.4 49.7 150.6 C 49.7 150.6 48.9 150.6 48.0 150.6 C 46.4 150.7 46.4 150.7 46.0 151.1 C 45.2 151.8 45.2 151.8 41.2 152.3 C 40.0 152.4 39.5 152.6 38.7 153.1 C 38.5 153.2 38.1 153.3 37.9 153.4 C 37.0 153.6 36.2 154.1 35.2 155.1 C 34.6 155.7 34.6 155.7 34.5 156.3 C 34.4 156.8 34.2 157.3 33.8 157.8 C 33.5 158.2 33.5 158.2 33.3 157.9 C 33.0 157.6 32.8 157.6 32.8 157.9 C 32.6 158.6 32.4 159.1 32.3 159.4 C 31.7 160.5 29.9 161.4 28.7 161.0 C 28.4 160.9 28.4 160.9 29.1 159.8 C 29.7 158.9 29.6 158.9 28.9 159.3 C 28.0 159.9 27.5 160.1 27.4 159.9 C 27.3 159.8 27.9 158.5 28.5 157.6 C 29.4 156.3 30.5 155.2 32.9 153.1 C 34.1 152.0 34.8 151.3 34.8 151.0 C 34.8 150.8 34.3 150.9 33.5 151.4 C 32.9 151.8 32.6 151.9 32.2 152.0 C 31.0 152.4 30.4 153.0 29.9 154.2 C 29.5 155.1 29.2 155.3 28.6 155.3 C 28.2 155.3 28.2 155.4 27.9 156.0 C 27.4 157.7 25.9 158.8 24.3 158.9 C 23.8 158.9 23.8 158.8 24.2 158.1 C 24.7 157.2 24.7 157.0 24.2 157.4 C 23.4 158.0 23.3 158.0 23.5 157.2 C 23.7 156.3 24.4 155.1 25.2 154.2 C 25.5 154.0 25.9 153.5 26.1 153.1 C 26.7 152.3 26.8 152.1 27.2 151.9 C 28.0 151.5 28.4 151.1 29.4 149.8 C 30.4 148.5 30.5 148.4 32.7 147.7 C 33.9 147.3 34.3 147.1 34.6 146.8 C 35.3 146.1 35.5 145.5 35.2 145.0 C 35.1 144.8 35.0 144.9 34.8 145.1 C 34.5 145.4 34.5 145.3 34.0 144.8 C 32.5 143.4 31.8 143.3 28.2 144.2 C 25.5 144.9 24.8 144.9 23.6 144.5 C 22.5 144.2 21.4 143.6 21.4 143.4 C 21.4 143.2 22.3 142.9 23.0 142.8 C 23.6 142.7 23.7 142.7 23.7 142.6 C 23.7 142.3 22.6 141.2 22.3 141.1 C 22.2 141.1 22.0 141.2 21.6 141.4 C 20.4 142.0 19.6 142.0 18.7 141.4 C 17.8 140.9 16.8 139.3 16.8 138.7 C 16.8 138.2 17.1 138.1 18.0 138.2 C 18.7 138.2 18.9 138.2 19.2 137.9 C 20.0 137.2 20.9 136.6 21.7 136.3 C 23.7 135.4 25.3 134.0 28.6 130.1 C 29.3 129.2 29.9 128.5 29.9 128.5 C 30.0 128.4 30.0 128.1 29.8 127.8 C 29.6 127.5 29.3 127.2 28.8 126.9 C 27.9 126.4 27.7 126.0 28.1 125.7 C 28.5 125.4 30.3 125.3 30.6 125.5 C 30.7 125.6 31.0 125.7 31.2 125.7 C 31.3 125.7 31.5 125.6 31.8 125.2 C 32.2 124.6 32.6 124.3 32.7 124.3 C 32.7 124.3 32.8 124.4 32.8 124.6 C 32.8 125.2 32.7 125.2 33.7 124.4 C 34.8 123.6 34.9 123.6 34.9 124.2 C 34.8 124.6 34.8 124.6 35.4 124.3 C 36.2 123.8 37.4 123.4 37.8 123.4 C 38.0 123.4 38.0 123.5 37.8 124.0 C 37.6 124.4 37.6 124.6 37.7 124.6 C 37.7 124.7 38.3 124.5 39.0 124.3 C 40.4 123.8 41.0 123.7 41.7 123.7 C 42.1 123.7 42.1 123.7 42.0 123.9 C 41.5 124.5 41.8 124.6 43.3 124.3 C 44.3 124.2 45.4 124.2 45.5 124.3 C 45.6 124.4 45.6 124.4 45.4 124.6 C 45.3 124.7 45.1 124.9 45.0 124.9 C 44.1 125.4 44.3 125.5 45.7 125.4 C 46.7 125.4 48.8 125.5 49.4 125.6 C 50.2 125.7 50.4 125.9 50.2 126.5 C 50.1 126.6 50.2 126.7 51.1 126.8 C 52.3 126.9 53.2 127.2 54.0 127.6 C 54.2 127.7 54.1 127.8 53.7 128.0 C 53.2 128.3 53.2 128.3 54.3 128.6 C 55.4 128.8 56.2 129.1 56.9 129.5 C 57.2 129.7 57.1 129.7 56.7 129.9 C 56.3 130.1 56.4 130.2 57.5 130.4 C 60.9 131.3 64.0 132.7 69.4 135.7 C 71.7 137.1 72.6 137.7 73.1 138.6 C 73.8 139.6 74.8 139.9 76.1 139.4 C 78.1 138.7 79.3 139.0 80.5 140.6 C 81.0 141.3 81.0 141.1 81.0 143.7 C 81.0 146.3 81.0 146.3 81.5 147.2 C 81.9 147.9 81.9 148.4 81.5 148.4 C 81.4 148.4 80.2 147.9 79.8 147.7 C 79.0 147.4 78.4 146.5 78.3 145.7 C 78.2 145.5 78.2 145.3 78.2 145.2 C 78.2 145.2 78.0 145.0 77.9 144.8 C 77.3 144.1 77.2 143.5 77.5 142.5 C 77.7 141.9 77.7 141.3 77.6 141.0 C 77.6 140.8 77.6 140.8 76.7 141.0 C 76.3 141.1 76.1 141.1 75.2 141.1 C 74.3 141.1 74.2 141.1 74.2 141.2 C 74.2 141.5 73.9 143.5 73.8 144.1 C 73.5 147.8 74.7 149.6 77.8 150.0 C 79.0 150.2 79.2 150.3 79.8 151.8 C 80.7 153.9 81.9 156.6 82.4 157.3 C 83.0 158.2 83.4 159.4 83.2 159.6 C 83.1 159.6 83.0 159.7 82.8 159.7 C 82.4 159.8 82.1 160.0 81.9 160.1 C 81.7 160.3 81.7 160.4 82.0 161.3 C 82.2 162.1 82.2 162.4 82.1 163.0 C 81.9 163.9 81.1 165.1 80.8 165.1 C 80.8 165.1 80.6 165.2 80.4 165.4 C 80.0 165.7 79.8 165.7 79.6 165.5 C 79.4 165.4 79.4 165.4 79.4 164.5 C 79.3 163.5 79.2 163.5 78.8 164.7 C 78.5 165.7 78.2 165.8 77.8 165.0 C 76.6 161.9 76.6 161.1 78.4 158.8 C 78.4 158.7 78.4 158.6 78.2 157.9 C 77.7 156.0 77.0 154.7 76.3 154.2 C 76.0 154.0 75.8 154.0 75.1 153.9 C 74.8 153.8 74.1 153.6 73.4 153.4 C 72.2 153.0 72.1 152.9 72.2 153.2 C 72.5 153.8 72.7 154.2 73.0 155.1 C 73.3 156.0 73.3 156.2 73.5 157.8 C 73.6 158.3 73.7 158.7 73.8 159.0 C 74.1 159.8 74.0 160.1 73.2 160.6 C 72.6 161.1 72.6 161.2 72.9 162.6 C 73.3 164.2 73.2 164.9 72.5 165.5 C 71.6 166.3 71.2 166.5 70.2 166.5 C 69.6 166.5 69.6 166.5 69.5 166.4 Z M 25.1 142.1 C 25.3 142.1 25.4 142.0 25.4 142.0 C 25.4 141.9 25.2 141.7 25.0 141.4 C 24.1 140.5 23.8 139.8 23.6 138.6 C 23.5 137.8 23.4 137.8 23.1 138.4 C 22.4 139.7 22.9 141.4 24.2 142.2 C 24.6 142.4 24.7 142.4 25.1 142.1 Z M 26.7 141.1 C 27.6 140.9 28.0 140.5 27.6 140.2 C 27.4 140.2 25.4 140.1 25.4 140.2 C 25.3 140.3 25.5 140.6 25.8 141.0 C 26.0 141.3 26.0 141.3 26.7 141.1 Z M 28.4 134.2 C 28.7 134.1 28.7 134.0 28.8 133.9 C 29.2 132.8 29.8 132.5 30.5 132.9 C 31.2 133.3 31.5 133.3 31.2 132.8 C 30.9 132.3 29.9 132.2 29.3 132.5 C 28.6 132.8 27.4 133.8 27.4 134.0 C 27.4 134.2 27.9 134.3 28.4 134.2 Z M 28.1 129.5 C 28.0 129.4 27.7 129.2 27.5 129.0 C 27.2 128.8 26.9 128.5 26.7 128.4 C 26.3 128.1 26.3 128.1 26.5 127.9 C 27.3 127.3 28.6 127.3 29.3 127.9 C 29.7 128.1 29.7 128.2 29.4 128.7 C 28.9 129.5 28.6 129.7 28.1 129.5 Z' + '" fill="'+f+'" fill-rule="evenodd"/>';
            break;

        default:
            o += '<path d="M 30 100 L 70 100 L 70 170 Q 70 200 50 220 Q 30 200 30 170 Z" fill="'+f+'"/>';
            break;

        }

        return o;
    }
}












  // ── Castle Watermark SVG Generator ─────────────────────────────────────
  function getCastleSVG(opts) {
    var o = opts || {};
    var color = o.color || '#000000';
    var opacity = o.opacity != null ? o.opacity : 0.06;
    var W = 800, H = 500;
    var s = '';

    function cren(x, y, width, mW, mH, cW) {
      var p = 'M ' + x + ' ' + y, cx = x;
      while (cx < x + width - 1) {
        var m = Math.min(mW, x + width - cx);
        p += ' v' + (-mH) + ' h' + m + ' v' + mH; cx += m;
        if (cx < x + width - 1) { var c = Math.min(cW, x + width - cx); p += ' h' + c; cx += c; }
      }
      return p;
    }
    function roof(cx, ty, hw, rh) { return 'M '+(cx-hw)+' '+ty+' L '+cx+' '+(ty-rh)+' L '+(cx+hw)+' '+ty+' Z'; }
    function flag(cx, by, ph, fw, fh, side) {
      var ty = by - ph, d = side === 'left' ? -1 : 1;
      var r = '<line x1="'+cx+'" y1="'+by+'" x2="'+cx+'" y2="'+ty+'" stroke="'+color+'" stroke-width="1.5" opacity="'+(opacity*2.5)+'"/>';
      var fx = cx+d*fw, c1=cx+d*fw*0.6, c2=cx+d*fw*0.4;
      r += '<path d="M '+cx+' '+ty+' Q '+c1+' '+(ty+fh*0.15)+' '+fx+' '+(ty+fh*0.35)+' L '+(cx+d*fw*0.35)+' '+(ty+fh*0.5)+' Q '+c2+' '+(ty+fh*0.65)+' '+fx+' '+(ty+fh*0.8)+' L '+cx+' '+(ty+fh)+' Z" fill="'+color+'" opacity="'+(opacity*2)+'"/>';
      return r;
    }
    function aWin(cx, cy, w, h) {
      var hw = w/2;
      return '<path d="M '+(cx-hw)+' '+cy+' v'+(-h*0.6)+' a '+hw+' '+hw+' 0 0 1 '+w+' 0 v'+(h*0.6)+' Z" fill="'+color+'" opacity="'+(opacity*1.8)+'"/>';
    }
    function cWin(cx, cy, w, h) {
      var hw=w/2, hh=h/2;
      var r='<rect x="'+(cx-hw)+'" y="'+(cy-h)+'" width="'+w+'" height="'+h+'" fill="'+color+'" opacity="'+(opacity*1.5)+'"/>';
      r+='<line x1="'+cx+'" y1="'+(cy-h)+'" x2="'+cx+'" y2="'+cy+'" stroke="'+color+'" stroke-width="1" opacity="'+(opacity*3)+'"/>';
      r+='<line x1="'+(cx-hw)+'" y1="'+(cy-hh)+'" x2="'+(cx+hw)+'" y2="'+(cy-hh)+'" stroke="'+color+'" stroke-width="1" opacity="'+(opacity*3)+'"/>';
      return r;
    }
    function rWin(cx,cy,w,h){return '<rect x="'+(cx-w/2)+'" y="'+(cy-h)+'" width="'+w+'" height="'+h+'" fill="'+color+'" opacity="'+(opacity*1.8)+'"/>';}
    function slit(x,y){return '<rect x="'+(x-1.5)+'" y="'+y+'" width="3" height="16" rx="1" fill="'+color+'" opacity="'+(opacity*2)+'"/>';}
    function tree(cx,by,h,w){
      var ty=by-h;
      return '<path d="M '+cx+' '+by+' L '+cx+' '+(ty+h*0.4)+'" stroke="'+color+'" stroke-width="3" opacity="'+(opacity*1.5)+'"/>'+
             '<ellipse cx="'+cx+'" cy="'+(ty+h*0.25)+'" rx="'+(w/2)+'" ry="'+(h*0.35)+'" fill="'+color+'" opacity="'+(opacity*0.8)+'"/>';
    }

    s += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMax meet">';

    var gY = H - 40;
    // Ground
    s += '<rect x="0" y="'+gY+'" width="'+W+'" height="60" fill="'+color+'" opacity="'+(opacity*0.5)+'"/>';
    s += '<ellipse cx="'+W/2+'" cy="'+(gY+5)+'" rx="'+(W*0.55)+'" ry="30" fill="'+color+'" opacity="'+(opacity*0.3)+'"/>';

    // ── MAIN KEEP ──
    var kX=310,kW=180,kH=220,kT=gY-kH;
    s+='<rect x="'+kX+'" y="'+kT+'" width="'+kW+'" height="'+kH+'" fill="'+color+'" opacity="'+opacity+'"/>';
    s+='<path d="'+cren(kX,kT,kW,12,14,8)+'" fill="'+color+'" opacity="'+opacity+'"/>';
    // Stone texture
    for(var r=0;r<11;r++){var ry=kT+20+r*20;s+='<line x1="'+kX+'" y1="'+ry+'" x2="'+(kX+kW)+'" y2="'+ry+'" stroke="'+color+'" stroke-width="0.5" opacity="'+(opacity*0.6)+'"/>';var bo=(r%2===0)?15:30;for(var bx=kX+bo;bx<kX+kW;bx+=30)s+='<line x1="'+bx+'" y1="'+ry+'" x2="'+bx+'" y2="'+(ry+20)+'" stroke="'+color+'" stroke-width="0.4" opacity="'+(opacity*0.4)+'"/>';}
    // Grand gate with portcullis
    var gX=kX+kW/2,gW2=20,gH=60;
    s+='<path d="M '+(gX-gW2)+' '+gY+' v'+(-gH*0.6)+' a '+gW2+' '+gW2+' 0 0 1 '+(gW2*2)+' 0 v'+(gH*0.6)+' Z" fill="'+color+'" opacity="'+(opacity*1.5)+'"/>';
    for(var gi=-3;gi<=3;gi++)s+='<line x1="'+(gX+gi*5)+'" y1="'+(gY-gH*0.95)+'" x2="'+(gX+gi*5)+'" y2="'+gY+'" stroke="'+color+'" stroke-width="0.8" opacity="'+(opacity*2)+'"/>';
    for(var gr=0;gr<5;gr++){var py=gY-8-gr*10;s+='<line x1="'+(gX-gW2+3)+'" y1="'+py+'" x2="'+(gX+gW2-3)+'" y2="'+py+'" stroke="'+color+'" stroke-width="0.6" opacity="'+(opacity*1.5)+'"/>';}
    // Keep windows
    s+=aWin(kX+35,kT+80,16,28)+aWin(kX+kW-35,kT+80,16,28)+aWin(kX+kW/2,kT+70,20,35);
    s+=cWin(kX+30,kT+140,12,18)+cWin(kX+kW/2,kT+135,14,22)+cWin(kX+kW-30,kT+140,12,18);

    // ── CENTRAL TOWER ──
    var cTX=kX+kW/2-30,cTW=60,cTH=80,cTT=kT-cTH;
    s+='<rect x="'+cTX+'" y="'+cTT+'" width="'+cTW+'" height="'+cTH+'" fill="'+color+'" opacity="'+opacity+'"/>';
    s+='<path d="'+cren(cTX,cTT,cTW,8,10,6)+'" fill="'+color+'" opacity="'+opacity+'"/>';
    s+='<path d="'+roof(cTX+cTW/2,cTT-10,cTW/2+5,50)+'" fill="'+color+'" opacity="'+(opacity*1.1)+'"/>';
    s+=aWin(cTX+cTW/2,cTT+45,18,30);
    s+=flag(cTX+cTW/2,cTT-60,30,28,22,'right');

    // ── LEFT FRONT TOWER ──
    var lX=kX-40,lW=50,lH=260,lT=gY-lH;
    s+='<rect x="'+lX+'" y="'+lT+'" width="'+lW+'" height="'+lH+'" fill="'+color+'" opacity="'+opacity+'"/>';
    s+='<path d="'+cren(lX,lT,lW,8,10,6)+'" fill="'+color+'" opacity="'+opacity+'"/>';
    s+='<path d="'+roof(lX+lW/2,lT-8,lW/2+8,45)+'" fill="'+color+'" opacity="'+(opacity*1.1)+'"/>';
    s+=aWin(lX+lW/2,lT+50,14,24)+rWin(lX+lW/2,lT+100,10,14)+aWin(lX+lW/2,lT+155,12,20)+slit(lX+lW/2,lT+195);
    s+=flag(lX+lW/2,lT-53,25,22,18,'left');

    // ── RIGHT FRONT TOWER ──
    var rX=kX+kW-10,rW=50,rH=260,rT=gY-rH;
    s+='<rect x="'+rX+'" y="'+rT+'" width="'+rW+'" height="'+rH+'" fill="'+color+'" opacity="'+opacity+'"/>';
    s+='<path d="'+cren(rX,rT,rW,8,10,6)+'" fill="'+color+'" opacity="'+opacity+'"/>';
    s+='<path d="'+roof(rX+rW/2,rT-8,rW/2+8,45)+'" fill="'+color+'" opacity="'+(opacity*1.1)+'"/>';
    s+=aWin(rX+rW/2,rT+50,14,24)+rWin(rX+rW/2,rT+100,10,14)+aWin(rX+rW/2,rT+155,12,20)+slit(rX+rW/2,rT+195);
    s+=flag(rX+rW/2,rT-53,25,22,18,'right');

    // ── LEFT CURTAIN WALL ──
    var lwX=lX-100,lwH=140,lwT=gY-lwH;
    s+='<rect x="'+lwX+'" y="'+lwT+'" width="100" height="'+lwH+'" fill="'+color+'" opacity="'+(opacity*0.85)+'"/>';
    s+='<path d="'+cren(lwX,lwT,100,10,12,7)+'" fill="'+color+'" opacity="'+(opacity*0.85)+'"/>';
    s+=cWin(lwX+30,lwT+50,10,14)+cWin(lwX+65,lwT+50,10,14);
    s+=slit(lwX+15,lwT+80)+slit(lwX+48,lwT+80)+slit(lwX+80,lwT+80);

    // ── RIGHT CURTAIN WALL ──
    var rwX=rX+rW,rwT=gY-140;
    s+='<rect x="'+rwX+'" y="'+rwT+'" width="100" height="140" fill="'+color+'" opacity="'+(opacity*0.85)+'"/>';
    s+='<path d="'+cren(rwX,rwT,100,10,12,7)+'" fill="'+color+'" opacity="'+(opacity*0.85)+'"/>';
    s+=cWin(rwX+35,rwT+50,10,14)+cWin(rwX+70,rwT+50,10,14);
    s+=slit(rwX+15,rwT+80)+slit(rwX+50,rwT+80)+slit(rwX+85,rwT+80);

    // ── FAR LEFT TOWER ──
    var flX=lwX-35,flW=40,flH=180,flT=gY-flH;
    s+='<rect x="'+flX+'" y="'+flT+'" width="'+flW+'" height="'+flH+'" fill="'+color+'" opacity="'+opacity+'"/>';
    s+='<path d="'+cren(flX,flT,flW,7,9,5)+'" fill="'+color+'" opacity="'+opacity+'"/>';
    s+='<path d="'+roof(flX+flW/2,flT-6,flW/2+6,38)+'" fill="'+color+'" opacity="'+(opacity*1.1)+'"/>';
    s+=aWin(flX+flW/2,flT+45,12,20);
    s+=flag(flX+flW/2,flT-44,22,18,15,'left');

    // ── FAR RIGHT TOWER ──
    var frX=rwX+95,frW=40,frH=180,frT=gY-frH;
    s+='<rect x="'+frX+'" y="'+frT+'" width="'+frW+'" height="'+frH+'" fill="'+color+'" opacity="'+opacity+'"/>';
    s+='<path d="'+cren(frX,frT,frW,7,9,5)+'" fill="'+color+'" opacity="'+opacity+'"/>';
    s+='<path d="'+roof(frX+frW/2,frT-6,frW/2+6,38)+'" fill="'+color+'" opacity="'+(opacity*1.1)+'"/>';
    s+=aWin(frX+frW/2,frT+45,12,20);
    s+=flag(frX+frW/2,frT-44,22,18,15,'right');

    // ── MOAT & DRAWBRIDGE ──
    s+='<path d="M '+(kX-80)+' '+(gY+2)+' Q '+W/2+' '+(gY+30)+' '+(kX+kW+80)+' '+(gY+2)+'" fill="none" stroke="'+color+'" stroke-width="2" opacity="'+(opacity*1.5)+'"/>';
    s+='<path d="M '+(kX-80)+' '+(gY+8)+' Q '+W/2+' '+(gY+35)+' '+(kX+kW+80)+' '+(gY+8)+'" fill="none" stroke="'+color+'" stroke-width="1" opacity="'+opacity+'"/>';
    var dbW=44,dbX=gX-dbW/2;
    s+='<rect x="'+dbX+'" y="'+gY+'" width="'+dbW+'" height="6" fill="'+color+'" opacity="'+(opacity*1.2)+'"/>';
    s+='<line x1="'+(gX-gW2+2)+'" y1="'+(gY-gH*0.5)+'" x2="'+dbX+'" y2="'+gY+'" stroke="'+color+'" stroke-width="1.2" opacity="'+(opacity*2)+'" stroke-dasharray="3 2"/>';
    s+='<line x1="'+(gX+gW2-2)+'" y1="'+(gY-gH*0.5)+'" x2="'+(dbX+dbW)+'" y2="'+gY+'" stroke="'+color+'" stroke-width="1.2" opacity="'+(opacity*2)+'" stroke-dasharray="3 2"/>';

    // ── DECORATIVE ──
    // Royal banner on keep
    var bx=kX+kW/2,by=kT+30;
    s+='<rect x="'+(bx-8)+'" y="'+by+'" width="16" height="28" fill="'+color+'" opacity="'+(opacity*1.3)+'"/>';
    s+='<path d="M '+(bx-8)+' '+(by+28)+' L '+bx+' '+(by+36)+' L '+(bx+8)+' '+(by+28)+' Z" fill="'+color+'" opacity="'+(opacity*1.3)+'"/>';
    // Torch sconces
    s+='<circle cx="'+(gX-gW2-8)+'" cy="'+(gY-gH*0.4)+'" r="3" fill="'+color+'" opacity="'+(opacity*2)+'"/>';
    s+='<circle cx="'+(gX+gW2+8)+'" cy="'+(gY-gH*0.4)+'" r="3" fill="'+color+'" opacity="'+(opacity*2)+'"/>';
    // Machicolations
    for(var mi=0;mi<9;mi++){var mx=kX+10+mi*20;s+='<path d="M '+mx+' '+kT+' l 3 8 h 8 l 3 -8" fill="none" stroke="'+color+'" stroke-width="0.8" opacity="'+(opacity*1.2)+'"/>';}
    // Birds
    [[120,100],[150,85],[650,95],[680,110],[400,60]].forEach(function(b){s+='<path d="M '+(b[0]-6)+' '+(b[1]+2)+' Q '+b[0]+' '+(b[1]-4)+' '+(b[0]+6)+' '+(b[1]+2)+'" fill="none" stroke="'+color+'" stroke-width="1" opacity="'+(opacity*3)+'"/>';});
    // Clouds
    s+='<ellipse cx="150" cy="80" rx="60" ry="18" fill="'+color+'" opacity="'+(opacity*0.3)+'"/>';
    s+='<ellipse cx="180" cy="75" rx="40" ry="14" fill="'+color+'" opacity="'+(opacity*0.25)+'"/>';
    s+='<ellipse cx="620" cy="70" rx="55" ry="16" fill="'+color+'" opacity="'+(opacity*0.3)+'"/>';
    // Trees
    s+=tree(60,gY,90,50)+tree(30,gY,70,40)+tree(740,gY,85,48)+tree(770,gY,65,38);

    s += '</svg>';
    return s;
  }

  // ── Kingdom Dashboard ──────────────────────────────────────────────────
  function KingdomDashboard(_ref) {
    var kingdom = _ref.kingdom, stats = _ref.stats, onNavigate = _ref.onNavigate, viewRole = _ref.viewRole;
    var hexCount = Object.keys(kingdom.territories || {}).length;
    var settlementCount = Object.keys(kingdom.settlements || {}).length;
    var buildingCount = Object.values(kingdom.settlements || {}).reduce(function(s, set) { return s + (set.buildings || []).filter(function(b) { return b.completed; }).length; }, 0);
    var councilFilled = Object.keys(kingdom.council || {}).filter(function(r) { return kingdom.council[r]; }).length;
    var recentEvents = (kingdom.eventLog || []).slice(-5).reverse();
    var bannerSvg = getBannerSVG(kingdom.banner || {});

    // Extract banner accent colors (user-chosen)
    var bannerCfg = kingdom.banner || {};
    var accentFg = bannerCfg.fg || T.gold;
    var accentBg = bannerCfg.bg || T.bgCard;

    // Generate castle watermark — use accent color, adapt opacity for light vs dark
    var isDark = (T.bg || '').charAt(1) < '5';
    var castleSvg = getCastleSVG({ color: accentFg, opacity: isDark ? 0.035 : 0.05 });

    return React.createElement("div", { style: { position:"relative" } },
      // ── Castle Watermark (behind everything) ──
      React.createElement("div", { style: { position:"absolute", top:"60px", left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:"900px", height:"500px", pointerEvents:"none", zIndex:0, opacity:1 }, dangerouslySetInnerHTML: { __html: castleSvg } }),
      // ── Left Banner (mirrored) ──
      React.createElement("div", { style: { position:"fixed", top:"70px", left:"12px", width:"140px", height:"440px", opacity:1, pointerEvents:"none", zIndex:100, transform:"scaleX(-1)", filter:"drop-shadow(2px 4px 6px rgba(0,0,0,0.4))" }, dangerouslySetInnerHTML: { __html: bannerSvg } }),
      // ── Right Banner ──
      React.createElement("div", { style: { position:"fixed", top:"70px", right:"12px", width:"140px", height:"440px", opacity:1, pointerEvents:"none", zIndex:100, filter:"drop-shadow(-2px 4px 6px rgba(0,0,0,0.4))" }, dangerouslySetInnerHTML: { __html: bannerSvg } }),

      // Royal Kingdom Banner Card
      React.createElement("div", { style: Object.assign({}, S.card, { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"28px 32px", marginBottom:"18px", position:"relative", zIndex:1, background:"linear-gradient(135deg, "+accentBg+"18 0%, "+T.bgCard+" 40%, "+T.bgCard+" 60%, "+accentBg+"18 100%)", borderTop:"2px solid "+accentFg+"55", borderBottom:"1px solid "+accentFg+"22" }) },
        React.createElement("div", null,
          React.createElement("div", { style: { fontSize:"10px", color:accentFg, fontFamily:T.ui, letterSpacing:"2px", textTransform:"uppercase", marginBottom:"6px", opacity:0.6 } }, "\u2014\u2014 The Realm of \u2014\u2014"),
          React.createElement("div", { style: { fontSize:"22px", fontWeight:"bold", fontFamily:T.heading, color:accentFg, letterSpacing:"2px", textShadow:"0 1px 4px rgba(0,0,0,0.4)" } }, kingdom.name),
          React.createElement("div", { style: { fontSize:"11px", color:T.textDim, marginTop:"6px", fontFamily:T.ui, letterSpacing:"0.5px" } },
            "Turn " + kingdom.turn + " \u2E31 Founded " + new Date(kingdom.founded).toLocaleDateString() + " \u2E31 Pop. " + (kingdom.totalPopulation || 0).toLocaleString()
          )
        ),
        React.createElement("div", { style: { display:"flex", alignItems:"center", gap:"12px" } },
          kingdom.stateReligion && React.createElement("div", { style: S.pill("#9b59b6") }, "\u2720 " + kingdom.stateReligion),
          React.createElement("div", { style: { width:"40px", height:"40px", borderRadius:"50%", border:"2px solid "+accentFg+"44", display:"flex", alignItems:"center", justifyContent:"center", background:accentFg+"08" } },
            Crown && React.createElement(Crown, { size: 18, color: accentFg })
          )
        )
      ),
      // Ornamental divider
      React.createElement("div", { style: { textAlign:"center", color:accentFg+"55", fontSize:"14px", letterSpacing:"8px", margin:"8px 0", fontFamily:"serif", position:"relative", zIndex:1 } }, "\u2726 \u2727 \u2726"),

      React.createElement("div", { style: Object.assign({}, S.statRow, { position:"relative", zIndex:1 }) },
        React.createElement(StatBadge, { label: "Economy", value: stats.economy, color: stats.economy >= 0 ? "#7cb342" : "#c94f3f" }),
        React.createElement(StatBadge, { label: "Loyalty", value: stats.loyalty, color: stats.loyalty >= 0 ? "#7cb342" : "#c94f3f" }),
        React.createElement(StatBadge, { label: "Treasury", value: kingdom.treasury + " BP", color: accentFg, featured: true }),
        React.createElement(StatBadge, { label: "Stability", value: stats.stability, color: stats.stability >= 0 ? "#7cb342" : "#c94f3f" }),
        React.createElement(StatBadge, { label: "Unrest", value: kingdom.unrest || 0, color: (kingdom.unrest || 0) > 5 ? "#c94f3f" : (kingdom.unrest || 0) > 0 ? "#e67e22" : "#7cb342" }),
        React.createElement(StatBadge, { label: "Defense", value: stats.totalDefense, color: "#5b7fb5" })
      ),

      // Treasury Details
      React.createElement("div", { style: Object.assign({}, S.statRow, { gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", position:"relative", zIndex:1 }) },
        React.createElement("div", { style: Object.assign({}, S.statBox, { borderTopColor: accentFg+"44", background:"linear-gradient(180deg, "+accentBg+"08 0%, "+T.bgCard+" 100%)" }) },
          React.createElement("div", { style: Object.assign({}, S.statLabel, { color:accentFg }) }, "Income / Turn"),
          React.createElement("div", { style: { fontSize:"16px", fontWeight:"bold", color:"#7cb342", fontFamily:T.heading } }, "+" + stats.income + " BP")
        ),
        React.createElement("div", { style: Object.assign({}, S.statBox, { borderTopColor: accentFg+"44", background:"linear-gradient(180deg, "+accentBg+"08 0%, "+T.bgCard+" 100%)" }) },
          React.createElement("div", { style: Object.assign({}, S.statLabel, { color:accentFg }) }, "Consumption"),
          React.createElement("div", { style: { fontSize:"16px", fontWeight:"bold", color:"#c94f3f", fontFamily:T.heading } }, "-" + stats.consumption + " BP")
        ),
        React.createElement("div", { style: Object.assign({}, S.statBox, { borderTopColor: accentFg+"44", background:"linear-gradient(180deg, "+accentBg+"08 0%, "+T.bgCard+" 100%)" }) },
          React.createElement("div", { style: Object.assign({}, S.statLabel, { color:accentFg }) }, "Net / Turn"),
          React.createElement("div", { style: { fontSize:"16px", fontWeight:"bold", color: (stats.income - stats.consumption) >= 0 ? "#7cb342" : "#c94f3f" } },
            (stats.income - stats.consumption >= 0 ? "+" : "") + (stats.income - stats.consumption) + " BP"
          )
        ),
        React.createElement("div", { style: Object.assign({}, S.statBox, { borderTopColor: accentFg+"44", background:"linear-gradient(180deg, "+accentBg+"08 0%, "+T.bgCard+" 100%)" }) },
          React.createElement("div", { style: Object.assign({}, S.statLabel, { color:accentFg }) }, "Hexes / Settlements"),
          React.createElement("div", { style: { fontSize:"16px", fontWeight:"bold", color:accentFg } }, hexCount + " / " + settlementCount)
        ),
        React.createElement("div", { style: Object.assign({}, S.statBox, { borderTopColor: accentFg+"44", background:"linear-gradient(180deg, "+accentBg+"08 0%, "+T.bgCard+" 100%)" }) },
          React.createElement("div", { style: Object.assign({}, S.statLabel, { color:accentFg }) }, "Buildings"),
          React.createElement("div", { style: { fontSize:"16px", fontWeight:"bold", color:accentFg } }, buildingCount)
        ),
        React.createElement("div", { style: Object.assign({}, S.statBox, { borderTopColor: accentFg+"44", background:"linear-gradient(180deg, "+accentBg+"08 0%, "+T.bgCard+" 100%)" }) },
          React.createElement("div", { style: Object.assign({}, S.statLabel, { color:accentFg }) }, "Council"),
          React.createElement("div", { style: { fontSize:"16px", fontWeight:"bold", color: councilFilled >= 4 ? "#7cb342" : "#e67e22" } }, councilFilled + "/" + Object.keys(COUNCIL_ROLES).length)
        )
      ),

      // Ornamental divider between stats and navigation
      React.createElement("div", { style: { textAlign:"center", margin:"20px 0 16px", position:"relative", zIndex:1 } },
        React.createElement("div", { style: { height:"1px", background:"linear-gradient(90deg, transparent, "+accentFg+"33, transparent)", position:"absolute", top:"50%", left:"0", right:"0" } }),
        React.createElement("span", { style: { position:"relative", background:T.bg, padding:"0 16px", color:accentFg+"44", fontSize:"12px", letterSpacing:"6px" } }, "\u2726 \u2726 \u2726")
      ),

      // Royal Chambers Navigation
      React.createElement("div", { style: Object.assign({}, S.sectionHead, { position:"relative", zIndex:1, color:accentFg, borderImage:"linear-gradient(90deg, "+accentFg+"66 0%, "+accentFg+"22 70%, transparent 100%) 1" }) }, Compass && React.createElement(Compass, { size: 16 }), " Royal Chambers"),

      // Featured Row: Territory and Settlements
      React.createElement("div", { style: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px", marginBottom: "14px", position:"relative", zIndex:1 } },
        [
          { id: "territory", label: "Territory", icon: Map, desc: "Claim hexes, build improvements, manage land", color: "#8fbc5e", featured: true },
          { id: "settlements", label: "Settlements", icon: Building2, desc: "Found towns, construct buildings, grow cities", color: accentFg, featured: true }
        ].map(function(panel) {
          return React.createElement("div", {
            key: panel.id,
            style: Object.assign({}, S.card, S.cardHover, {
              borderLeft: "none", borderTop: "4px solid " + panel.color, cursor: "pointer",
              padding: "22px 18px", textAlign: "center",
              background: "linear-gradient(180deg, " + panel.color + "12 0%, " + T.bgCard + " 100%)"
            }),
            onClick: function() { onNavigate(panel.id); }
          },
            panel.icon && React.createElement("div", { style: { marginBottom: "12px", display:"flex", justifyContent:"center" } },
              React.createElement("div", { style: { width:"50px", height:"50px", borderRadius:"50%", border:"2px solid "+panel.color+"55", display:"flex", alignItems:"center", justifyContent:"center", background:panel.color+"15" } },
                React.createElement(panel.icon, { size: 24, color: panel.color })
              )
            ),
            React.createElement("div", { style: { fontSize: "14px", fontWeight: "bold", color: panel.color, fontFamily: T.heading, letterSpacing: "1px", textTransform: "uppercase" } }, panel.label),
            React.createElement("div", { style: { fontSize: "11px", color: T.text, marginTop: "8px", lineHeight: "1.4", opacity:0.75 } }, panel.desc),
            React.createElement("div", { style: { marginTop:"12px", fontSize:"10px", color:panel.color+"aa", fontFamily:T.ui, letterSpacing:"1px" } }, "\u25B8 ENTER")
          );
        })
      ),

      // Secondary Row: Remaining chambers
      React.createElement("div", { style: { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:"12px", marginBottom: "16px", position:"relative", zIndex:1 } },
        [
          { id: "governance", label: "Governance", icon: Crown, desc: "Council, edicts, laws, and royal decrees", color: "#5b7fb5" },
          { id: "religion", label: "Religion", icon: Star, desc: "State faith, temples, divine favor", color: "#9b59b6" },
          { id: "events", label: "Event Log", icon: Scroll, desc: "Kingdom history and recent events", color: "#e67e22" },
          viewRole === "dm" ? { id: "turn", label: "Advance Turn", icon: Zap, desc: "Process the next kingdom turn", color: T.crimson } : null
        ].filter(Boolean).map(function(panel) {
          return React.createElement("div", {
            key: panel.id,
            style: Object.assign({}, S.card, S.cardHover, {
              borderLeft: "none", borderTop: "3px solid " + panel.color, cursor: "pointer",
              padding: "16px 14px", textAlign: "center",
              background: "linear-gradient(180deg, " + panel.color + "08 0%, " + T.bgCard + " 100%)"
            }),
            onClick: function() { onNavigate(panel.id); }
          },
            panel.icon && React.createElement("div", { style: { marginBottom: "8px", display:"flex", justifyContent:"center" } },
              React.createElement("div", { style: { width:"38px", height:"38px", borderRadius:"50%", border:"2px solid "+panel.color+"44", display:"flex", alignItems:"center", justifyContent:"center", background:panel.color+"10" } },
                React.createElement(panel.icon, { size: 18, color: panel.color })
              )
            ),
            React.createElement("div", { style: { fontSize: "12px", fontWeight: "bold", color: panel.color, fontFamily: T.heading, letterSpacing: "0.5px", textTransform: "uppercase" } }, panel.label),
            React.createElement("div", { style: { fontSize: "10px", color: T.text, marginTop: "5px", lineHeight: "1.3", opacity:0.7 } }, panel.desc),
            React.createElement("div", { style: { marginTop:"8px", fontSize:"9px", color:panel.color+"88", fontFamily:T.ui, letterSpacing:"0.5px" } }, "\u25B8 ENTER")
          );
        })
      ),

      // Pending Event Banner
      kingdom.activeEvent && React.createElement("div", { style: Object.assign({}, S.card, { borderTop:"3px solid #e67e22", borderLeft:"none", background:"linear-gradient(180deg, #e67e2208 0%, "+T.bgCard+" 100%)", position:"relative", zIndex:1 }) },
        React.createElement("div", { style: { fontSize:"14px", fontWeight:"bold", color:"#e67e22", marginBottom:"6px", fontFamily:T.heading, letterSpacing:"0.5px" } }, "\u26A0 Pending Event: " + kingdom.activeEvent.name),
        React.createElement("div", { style: { fontSize:"12px", color:T.text, marginBottom:"10px", fontStyle:"italic", opacity:0.8 } }, kingdom.activeEvent.desc),
        viewRole === "dm" && React.createElement("button", { style: S.btn, onClick: function() { onNavigate("events"); } }, "Resolve Event")
      ),

      // Recent Events Chronicle
      recentEvents.length > 0 && React.createElement("div", { style: { marginTop:"8px", position:"relative", zIndex:1, marginLeft:"12px", paddingLeft:"16px", borderLeft:"3px solid "+accentFg+"22" } },
        React.createElement("div", { style: Object.assign({}, S.sectionHead, { marginLeft:"-12px", paddingLeft:"0", color:accentFg, borderImage:"linear-gradient(90deg, "+accentFg+"66 0%, "+accentFg+"22 70%, transparent 100%) 1" }) }, Scroll && React.createElement(Scroll, { size: 16 }), " Chronicle of Recent Events"),
        React.createElement("div", { style: Object.assign({}, S.card, { padding:"0", overflow:"hidden" }) },
          recentEvents.map(function(ev, i) {
            var typeColor = ev.type === "harmful" ? "#c94f3f" : ev.type === "beneficial" ? "#7cb342" : "#5b7fb5";
            return React.createElement("div", { key: i, style: { padding:"10px 16px", borderBottom: i < recentEvents.length - 1 ? "1px solid "+T.border : "none", display:"flex", alignItems:"center", gap:"12px" } },
              React.createElement("div", { style: { width:"6px", height:"6px", borderRadius:"50%", background:typeColor, flexShrink:0, boxShadow:"0 0 6px "+typeColor+"44" } }),
              React.createElement("span", { style: { color:accentFg, fontWeight:"700", fontSize:"11px", fontFamily:T.ui, letterSpacing:"0.5px", minWidth:"52px" } }, "Turn " + ev.turn),
              React.createElement("span", { style: { color:typeColor, fontSize:"12px" } }, ev.event)
            );
          })
        )
      )
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5: PANEL COMPONENTS (Territory, Settlement, Governance, Religion, Events, Turn)
  // These are loaded from the original implementation but with fixed state updates.
  // The key fix: setKingdom now receives the full prev state and returns full next state.
  // ═══════════════════════════════════════════════════════════════════════════

  // Helper: immutable kingdom update
  function updateKingdom(setKingdom, updater) {
    setKingdom(function(prev) {
      var k = JSON.parse(JSON.stringify(prev.kingdom || prev));
      updater(k);
      if (prev.kingdom !== undefined) return Object.assign({}, prev, { kingdom: k });
      return k;
    });
  }

  // ── Territory Panel ────────────────────────────────────────────────────
  function TerritoryPanel(_ref) {
    var kingdom = _ref.kingdom, setKingdom = _ref.setKingdom, viewRole = _ref.viewRole, onBack = _ref.onBack;
    var _s1 = useState(false), showClaimForm = _s1[0], setShowClaimForm = _s1[1];
    var _s2 = useState({ name: "", terrain: "plains" }), claimForm = _s2[0], setClaimForm = _s2[1];
    var _s3 = useState(null), selectedHex = _s3[0], setSelectedHex = _s3[1];
    var _s4 = useState(false), showBuildMenu = _s4[0], setShowBuildMenu = _s4[1];
    var _s5 = useState(null), impCategory = _s5[0], setImpCategory = _s5[1];

    var territories = kingdom.territories || {};
    var hexList = Object.entries(territories).sort(function(a, b) { return a[1].name.localeCompare(b[1].name); });

    var handleClaim = function() {
      if (!claimForm.name) return;
      var terrain = TERRAIN_TYPES[claimForm.terrain];
      if (!terrain || kingdom.treasury < terrain.claimCost) return;
      var hexId = Date.now().toString();
      updateKingdom(setKingdom, function(k) {
        k.treasury -= terrain.claimCost;
        k.territories[hexId] = { id: hexId, name: claimForm.name, terrain: claimForm.terrain, claimedTurn: k.turn, improvements: [], improvementQueue: [], prepared: false };
      });
      setShowClaimForm(false);
      setClaimForm({ name: "", terrain: "plains" });
    };

    var handlePrepare = function(hexId) {
      var hex = territories[hexId];
      if (!hex || hex.prepared) return;
      var terrain = TERRAIN_TYPES[hex.terrain];
      if (!terrain || kingdom.treasury < terrain.prepCost) return;
      updateKingdom(setKingdom, function(k) { k.treasury -= terrain.prepCost; k.territories[hexId].prepared = true; });
    };

    var handleBuildImprovement = function(hexId, impType) {
      var imp = HEX_IMPROVEMENTS[impType];
      if (!imp || kingdom.treasury < imp.cost) return;
      var hex = territories[hexId];
      if (imp.requires && !imp.requires.includes(hex.terrain)) return;
      updateKingdom(setKingdom, function(k) {
        k.treasury -= imp.cost;
        if (imp.buildTurns <= 0) {
          k.territories[hexId].improvements.push({ type: impType, completed: true, builtTurn: k.turn });
        } else {
          if (!k.territories[hexId].improvementQueue) k.territories[hexId].improvementQueue = [];
          k.territories[hexId].improvementQueue.push({ type: impType, turnsRemaining: imp.buildTurns });
        }
      });
      setShowBuildMenu(false);
    };

    var sel = selectedHex ? territories[selectedHex] : null;

    return React.createElement("div", null,
      React.createElement("div", { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" } },
        React.createElement("div", { style: S.sectionHead }, Map && React.createElement(Map, { size: 18 }), "Territory (" + hexList.length + " hexes)"),
        React.createElement("div", { style: { display:"flex", gap:"8px" } },
          viewRole === "dm" && React.createElement("button", { style: S.btn, onClick: function() { setShowClaimForm(!showClaimForm); } }, Plus && React.createElement(Plus, { size: 14 }), "Claim Hex"),
          React.createElement("button", { style: Object.assign({}, S.btn, S.btnGold), onClick: onBack }, "← Dashboard")
        )
      ),

      showClaimForm && React.createElement("div", { style: Object.assign({}, S.card, { borderLeft:"4px solid #8fbc5e" }) },
        React.createElement("div", { style: { fontSize:"14px", fontWeight:"bold", color:"#8fbc5e", marginBottom:"10px" } }, "Claim New Hex"),
        React.createElement("div", { style: S.grid2 },
          React.createElement("div", null,
            React.createElement("label", { style: S.label }, "Hex Name"),
            React.createElement("input", { style: S.input, value: claimForm.name, placeholder: "e.g., Greenhollow Valley", onChange: function(e) { setClaimForm({ name: e.target.value, terrain: claimForm.terrain }); } })
          ),
          React.createElement("div", null,
            React.createElement("label", { style: S.label }, "Terrain"),
            React.createElement("select", { style: S.select, value: claimForm.terrain, onChange: function(e) { setClaimForm({ name: claimForm.name, terrain: e.target.value }); } },
              Object.entries(TERRAIN_TYPES).map(function(entry) { return React.createElement("option", { key: entry[0], value: entry[0] }, entry[1].icon + " " + entry[1].name + " (" + entry[1].claimCost + " BP)"); })
            )
          )
        ),
        React.createElement("div", { style: { display:"flex", gap:"8px", marginTop:"10px" } },
          React.createElement("button", { style: S.btn, onClick: handleClaim }, "Claim (" + ((TERRAIN_TYPES[claimForm.terrain] && TERRAIN_TYPES[claimForm.terrain].claimCost) || 0) + " BP)"),
          React.createElement("button", { style: Object.assign({}, S.btn, S.btnGold), onClick: function() { setShowClaimForm(false); } }, "Cancel")
        )
      ),

      hexList.length === 0
        ? React.createElement("div", { style: S.empty }, "No territory claimed yet. Claim your first hex to begin building your kingdom!")
        : React.createElement("div", { style: S.grid4 },
          hexList.map(function(entry) {
            var id = entry[0], hex = entry[1];
            var terrain = TERRAIN_TYPES[hex.terrain] || {};
            var impCount = (hex.improvements || []).filter(function(i) { return i.completed; }).length;
            var isBuilding = (hex.improvementQueue || []).length > 0;
            return React.createElement("div", {
              key: id,
              style: Object.assign({}, S.card, S.cardHover, { borderLeft:"4px solid "+(terrain.color||T.gold), background: selectedHex === id ? T.bgHover : T.bgCard }),
              onClick: function() { setSelectedHex(selectedHex === id ? null : id); }
            },
              React.createElement("div", { style: { display:"flex", justifyContent:"space-between", alignItems:"center" } },
                React.createElement("span", { style: { fontSize:"14px", fontWeight:"bold", color:terrain.color || T.gold } }, hex.name),
                React.createElement("span", { style: { fontSize:"16px" } }, terrain.icon)
              ),
              React.createElement("div", { style: { fontSize:"11px", color:T.textDim, marginTop:"4px" } }, terrain.name + (terrain.desc ? " — " + terrain.desc : "")),
              React.createElement("div", { style: { display:"flex", gap:"6px", marginTop:"6px", flexWrap:"wrap" } },
                hex.prepared ? React.createElement("span", { style: S.pill("#7cb342") }, "Prepared") : React.createElement("span", { style: S.pill("#e67e22") }, "Unprepared"),
                impCount > 0 && React.createElement("span", { style: S.pill(T.gold) }, impCount + " imp."),
                isBuilding && React.createElement("span", { style: S.pill("#3498db") }, "⚒ Building")
              )
            );
          })
        ),

      sel && React.createElement("div", { style: Object.assign({}, S.card, { marginTop:"16px", borderLeft:"4px solid "+((TERRAIN_TYPES[sel.terrain] && TERRAIN_TYPES[sel.terrain].color)||T.gold) }) },
        React.createElement("div", { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" } },
          React.createElement("div", { style: { fontSize:"16px", fontWeight:"bold", color:T.gold, fontFamily:T.heading } }, sel.name + " — " + ((TERRAIN_TYPES[sel.terrain] && TERRAIN_TYPES[sel.terrain].name) || sel.terrain)),
          React.createElement("div", { style: { display:"flex", gap:"6px" } },
            !sel.prepared && viewRole === "dm" && React.createElement("button", { style: Object.assign({}, S.btn, S.btnSmall), onClick: function() { handlePrepare(selectedHex); } }, "Prepare (" + ((TERRAIN_TYPES[sel.terrain] && TERRAIN_TYPES[sel.terrain].prepCost)||0) + " BP)"),
            sel.prepared && viewRole === "dm" && React.createElement("button", { style: Object.assign({}, S.btn, S.btnSmall), onClick: function() { setShowBuildMenu(!showBuildMenu); } }, "+ Improvement")
          )
        ),

        (sel.improvements || []).length > 0 && React.createElement("div", { style: { marginBottom:"12px" } },
          React.createElement("div", { style: Object.assign({}, S.label, { marginBottom:"8px" }) }, "Improvements"),
          React.createElement("div", { style: { display:"flex", gap:"8px", flexWrap:"wrap" } },
            (sel.improvements || []).map(function(imp, idx) {
              var impData = HEX_IMPROVEMENTS[imp.type] || {};
              return React.createElement("div", { key: idx, style: S.badge((HEX_IMPROVEMENT_CATEGORIES[impData.category] && HEX_IMPROVEMENT_CATEGORIES[impData.category].color) || "#888") }, impData.icon + " " + impData.name);
            })
          )
        ),

        (sel.improvementQueue || []).length > 0 && React.createElement("div", { style: { marginBottom:"12px" } },
          React.createElement("div", { style: Object.assign({}, S.label, { marginBottom:"8px" }) }, "Under Construction"),
          (sel.improvementQueue || []).map(function(item, idx) {
            return React.createElement("div", { key: idx, style: { fontSize:"12px", color:T.textDim, padding:"4px 0" } },
              "⚒ " + ((HEX_IMPROVEMENTS[item.type] && HEX_IMPROVEMENTS[item.type].name) || item.type) + " — " + item.turnsRemaining + " turn(s) remaining"
            );
          })
        ),

        showBuildMenu && React.createElement("div", { style: { marginTop:"12px" } },
          React.createElement("div", { style: Object.assign({}, S.label, { marginBottom:"8px" }) }, "Available Improvements"),
          React.createElement("div", { style: S.tabs },
            Object.entries(HEX_IMPROVEMENT_CATEGORIES).map(function(entry) {
              return React.createElement("div", { key: entry[0], style: S.tab(impCategory === entry[0]), onClick: function() { setImpCategory(impCategory === entry[0] ? null : entry[0]); } }, entry[1].label);
            })
          ),
          React.createElement("div", { style: S.grid4 },
            Object.entries(HEX_IMPROVEMENTS).filter(function(entry) {
              var imp = entry[1];
              if (impCategory && imp.category !== impCategory) return false;
              if (!imp.requires) return true;
              return imp.requires.includes(sel.terrain);
            }).map(function(entry) {
              var key = entry[0], imp = entry[1];
              var canAfford = kingdom.treasury >= imp.cost;
              var alreadyBuilt = (sel.improvements || []).some(function(i) { return i.type === key; });
              var ok = canAfford && !alreadyBuilt;
              return React.createElement("div", {
                key: key,
                style: Object.assign({}, S.card, { opacity: ok ? 1 : 0.45, cursor: ok ? "pointer" : "default", padding:"10px" }),
                onClick: function() { ok && handleBuildImprovement(selectedHex, key); }
              },
                React.createElement("div", { style: { fontSize:"14px", marginBottom:"4px" } }, imp.icon + " " + imp.name),
                React.createElement("div", { style: { fontSize:"10px", color:T.textDim } }, imp.desc),
                React.createElement("div", { style: { fontSize:"10px", color:T.gold, marginTop:"4px" } }, imp.cost + " BP · " + (imp.buildTurns || 0) + " turns"),
                React.createElement("div", { style: { display:"flex", gap:"4px", flexWrap:"wrap", marginTop:"4px" } },
                  imp.economy > 0 && React.createElement("span", { style: S.pill("#d4af37") }, "+" + imp.economy + " Econ"),
                  imp.stability > 0 && React.createElement("span", { style: S.pill("#5b7fb5") }, "+" + imp.stability + " Stab"),
                  imp.loyalty > 0 && React.createElement("span", { style: S.pill("#7cb342") }, "+" + imp.loyalty + " Loy")
                ),
                alreadyBuilt && React.createElement("div", { style: { fontSize:"10px", color:"#7cb342", marginTop:"4px" } }, "✓ Already built")
              );
            })
          )
        ),

        React.createElement("div", { style: { fontSize:"11px", color:T.textDim, marginTop:"8px" } },
          "Farm: " + ((TERRAIN_TYPES[sel.terrain] && TERRAIN_TYPES[sel.terrain].farmValue) || 0) + " · Mine: " + ((TERRAIN_TYPES[sel.terrain] && TERRAIN_TYPES[sel.terrain].mineValue) || 0) + " · Trade: " + ((TERRAIN_TYPES[sel.terrain] && TERRAIN_TYPES[sel.terrain].tradeValue) || 0)
        )
      )
    );
  }

  // ── Settlement Panel ───────────────────────────────────────────────────
  function SettlementPanel(_ref) {
    var kingdom = _ref.kingdom, setKingdom = _ref.setKingdom, viewRole = _ref.viewRole, onBack = _ref.onBack;
    var _s1 = useState(false), showFoundForm = _s1[0], setShowFoundForm = _s1[1];
    var _s2 = useState({ name: "", hexId: "" }), foundForm = _s2[0], setFoundForm = _s2[1];
    var _s3 = useState(null), selectedSettlement = _s3[0], setSelectedSettlement = _s3[1];
    var _s4 = useState(null), buildCategory = _s4[0], setBuildCategory = _s4[1];

    var settlements = kingdom.settlements || {};
    var settlementList = Object.entries(settlements).sort(function(a, b) { return (b[1].population || 0) - (a[1].population || 0); });
    var preparedHexes = Object.entries(kingdom.territories || {}).filter(function(e) { return e[1].prepared; });

    var handleFound = function() {
      if (!foundForm.name || !foundForm.hexId) return;
      var id = Date.now().toString();
      updateKingdom(setKingdom, function(k) {
        k.settlements[id] = { id: id, name: foundForm.name, hexId: foundForm.hexId, population: 100, buildings: [], constructionQueue: [], foundedTurn: k.turn };
        if (!k.capitalSettlement) k.capitalSettlement = id;
      });
      setShowFoundForm(false); setFoundForm({ name: "", hexId: "" });
    };

    var handleBuild = function(settlementId, buildingType) {
      var building = BUILDINGS[buildingType];
      if (!building || kingdom.treasury < building.cost) return;
      var settlement = settlements[settlementId];
      var size = getSettlementSize(settlement.population || 0);
      var maxBldg = (SETTLEMENT_SIZES[size] && SETTLEMENT_SIZES[size].maxBuildings) || 6;
      var current = (settlement.buildings || []).length + (settlement.constructionQueue || []).length;
      if (current >= maxBldg) return;
      if (building.requires && building.requires.length > 0) {
        var existingTypes = (settlement.buildings || []).map(function(b) { return b.type; });
        if (!building.requires.every(function(r) { return existingTypes.includes(r); })) return;
      }
      updateKingdom(setKingdom, function(k) {
        k.treasury -= building.cost;
        var s = k.settlements[settlementId];
        if (!s.constructionQueue) s.constructionQueue = [];
        if (building.buildTurns <= 0) {
          if (!s.buildings) s.buildings = [];
          s.buildings.push({ type: buildingType, completed: true, builtTurn: k.turn });
        } else {
          s.constructionQueue.push({ buildingType: buildingType, turnsRemaining: building.buildTurns });
        }
      });
    };

    var sel = selectedSettlement ? settlements[selectedSettlement] : null;
    var selSize = sel ? getSettlementSize(sel.population || 0) : null;
    var selSizeData = selSize ? SETTLEMENT_SIZES[selSize] : null;

    return React.createElement("div", null,
      React.createElement("div", { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" } },
        React.createElement("div", { style: S.sectionHead }, Building2 && React.createElement(Building2, { size: 18 }), "Settlements (" + settlementList.length + ")"),
        React.createElement("div", { style: { display:"flex", gap:"8px" } },
          viewRole === "dm" && React.createElement("button", { style: S.btn, onClick: function() { setShowFoundForm(!showFoundForm); } }, Plus && React.createElement(Plus, { size: 14 }), "Found Settlement"),
          React.createElement("button", { style: Object.assign({}, S.btn, S.btnGold), onClick: onBack }, "← Dashboard")
        )
      ),

      showFoundForm && React.createElement("div", { style: Object.assign({}, S.card, { borderLeft:"4px solid #d4af37" }) },
        React.createElement("div", { style: { fontSize:"14px", fontWeight:"bold", color:"#d4af37", marginBottom:"10px" } }, "Found New Settlement"),
        preparedHexes.length === 0
          ? React.createElement("div", { style: { fontSize:"12px", color:T.textDim } }, "You need at least one prepared hex. Go to Territory first.")
          : React.createElement(React.Fragment, null,
            React.createElement("div", { style: S.grid2 },
              React.createElement("div", null,
                React.createElement("label", { style: S.label }, "Name"),
                React.createElement("input", { style: S.input, value: foundForm.name, placeholder: "e.g., Oakvale", onChange: function(e) { setFoundForm({ name: e.target.value, hexId: foundForm.hexId }); } })
              ),
              React.createElement("div", null,
                React.createElement("label", { style: S.label }, "Location"),
                React.createElement("select", { style: S.select, value: foundForm.hexId, onChange: function(e) { setFoundForm({ name: foundForm.name, hexId: e.target.value }); } },
                  React.createElement("option", { value: "" }, "— Select hex —"),
                  preparedHexes.map(function(e) { return React.createElement("option", { key: e[0], value: e[0] }, e[1].name + " (" + ((TERRAIN_TYPES[e[1].terrain] && TERRAIN_TYPES[e[1].terrain].name) || "") + ")"); })
                )
              )
            ),
            React.createElement("div", { style: { display:"flex", gap:"8px", marginTop:"10px" } },
              React.createElement("button", { style: S.btn, onClick: handleFound }, "Found Settlement"),
              React.createElement("button", { style: Object.assign({}, S.btn, S.btnGold), onClick: function() { setShowFoundForm(false); } }, "Cancel")
            )
          )
      ),

      settlementList.length === 0
        ? React.createElement("div", { style: S.empty }, "No settlements yet. Claim and prepare a hex, then found your first settlement!")
        : React.createElement("div", { style: S.grid4 },
          settlementList.map(function(entry) {
            var id = entry[0], s = entry[1];
            var size = getSettlementSize(s.population || 0);
            var sizeData = SETTLEMENT_SIZES[size];
            var bCount = (s.buildings || []).filter(function(b) { return b.completed; }).length;
            var isCapital = kingdom.capitalSettlement === id;
            return React.createElement("div", {
              key: id,
              style: Object.assign({}, S.card, S.cardHover, { borderLeft:"4px solid "+(isCapital ? T.crimson : "#d4af37"), background: selectedSettlement === id ? T.bgHover : T.bgCard }),
              onClick: function() { setSelectedSettlement(selectedSettlement === id ? null : id); }
            },
              React.createElement("div", { style: { display:"flex", justifyContent:"space-between", alignItems:"center" } },
                React.createElement("span", { style: { fontSize:"14px", fontWeight:"bold", color:T.gold } }, s.name),
                isCapital && React.createElement("span", { style: S.pill(T.crimson) }, "♛ Capital")
              ),
              React.createElement("div", { style: { fontSize:"11px", color:T.textDim, marginTop:"4px" } },
                sizeData.icon + " " + sizeData.name + " · Pop: " + (s.population || 0).toLocaleString()
              ),
              React.createElement("div", { style: { fontSize:"11px", color:T.textDim } }, bCount + "/" + sizeData.maxBuildings + " buildings"),
              (s.constructionQueue || []).length > 0 && React.createElement("span", { style: Object.assign({}, S.pill("#3498db"), { marginTop:"6px" }) }, "⚒ " + s.constructionQueue.length + " building")
            );
          })
        ),

      sel && React.createElement("div", { style: Object.assign({}, S.card, { marginTop:"16px", borderLeft:"4px solid "+T.gold }) },
        React.createElement("div", { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px" } },
          React.createElement("div", null,
            React.createElement("div", { style: { fontSize:"18px", fontWeight:"bold", color:T.gold, fontFamily:T.heading } }, sel.name),
            React.createElement("div", { style: { fontSize:"12px", color:T.textDim } },
              selSizeData.icon + " " + selSizeData.name + " · Pop: " + (sel.population || 0).toLocaleString() + " · " + (sel.buildings || []).length + "/" + selSizeData.maxBuildings + " buildings"
            )
          ),
          kingdom.capitalSettlement !== selectedSettlement && viewRole === "dm" && React.createElement("button", {
            style: Object.assign({}, S.btn, S.btnSmall),
            onClick: function() { updateKingdom(setKingdom, function(k) { k.capitalSettlement = selectedSettlement; }); }
          }, "Set as Capital")
        ),

        (sel.buildings || []).length > 0 && React.createElement("div", { style: { marginBottom:"12px" } },
          React.createElement("div", { style: Object.assign({}, S.label, { marginBottom:"8px" }) }, "Buildings"),
          React.createElement("div", { style: { display:"flex", gap:"6px", flexWrap:"wrap" } },
            (sel.buildings || []).map(function(b, idx) {
              var bData = BUILDINGS[b.type] || {};
              var cat = BUILDING_CATEGORIES[bData.category] || {};
              return React.createElement("div", { key: idx, style: S.badge(cat.color) }, bData.icon + " " + bData.name);
            })
          )
        ),

        (sel.constructionQueue || []).length > 0 && React.createElement("div", { style: { marginBottom:"12px" } },
          React.createElement("div", { style: Object.assign({}, S.label, { marginBottom:"8px" }) }, "Under Construction"),
          (sel.constructionQueue || []).map(function(item, idx) {
            return React.createElement("div", { key: idx, style: { fontSize:"12px", color:T.textDim, padding:"4px 0" } },
              "⚒ " + ((BUILDINGS[item.buildingType] && BUILDINGS[item.buildingType].name) || item.buildingType) + " — " + item.turnsRemaining + " turn(s)"
            );
          })
        ),

        viewRole === "dm" && React.createElement("div", { style: { marginTop:"12px" } },
          React.createElement("div", { style: Object.assign({}, S.label, { marginBottom:"8px" }) }, "Construct Building"),
          React.createElement("div", { style: S.tabs },
            Object.entries(BUILDING_CATEGORIES).map(function(entry) {
              return React.createElement("div", { key: entry[0], style: S.tab(buildCategory === entry[0]), onClick: function() { setBuildCategory(buildCategory === entry[0] ? null : entry[0]); } }, entry[1].icon + " " + entry[1].label);
            })
          ),
          buildCategory && React.createElement("div", { style: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:"8px" } },
            Object.entries(BUILDINGS).filter(function(e) { return e[1].category === buildCategory; }).map(function(entry) {
              var key = entry[0], b = entry[1];
              var canAfford = kingdom.treasury >= b.cost;
              var existingTypes = (sel.buildings || []).map(function(x) { return x.type; });
              var meetsReqs = !b.requires || b.requires.length === 0 || b.requires.every(function(r) { return existingTypes.includes(r); });
              var alreadyMax = (sel.buildings || []).length + (sel.constructionQueue || []).length >= selSizeData.maxBuildings;
              var enabled = canAfford && meetsReqs && !alreadyMax;
              return React.createElement("div", {
                key: key,
                style: Object.assign({}, S.card, { padding:"10px", opacity: enabled ? 1 : 0.45, cursor: enabled ? "pointer" : "default" }),
                onClick: function() { enabled && handleBuild(selectedSettlement, key); }
              },
                React.createElement("div", { style: { fontSize:"13px", fontWeight:"bold", marginBottom:"2px" } }, b.icon + " " + b.name),
                React.createElement("div", { style: { fontSize:"10px", color:T.textDim, marginBottom:"4px" } }, b.desc),
                React.createElement("div", { style: { fontSize:"10px", color:T.gold } }, b.cost + " BP · " + b.buildTurns + " turns"),
                React.createElement("div", { style: { display:"flex", gap:"4px", flexWrap:"wrap", marginTop:"4px" } },
                  b.economy > 0 && React.createElement("span", { style: S.pill("#d4af37") }, "+" + b.economy + " Econ"),
                  b.loyalty > 0 && React.createElement("span", { style: S.pill("#7cb342") }, "+" + b.loyalty + " Loy"),
                  b.stability > 0 && React.createElement("span", { style: S.pill("#5b7fb5") }, "+" + b.stability + " Stab"),
                  b.unrest && b.unrest < 0 && React.createElement("span", { style: S.pill("#9b59b6") }, b.unrest + " Unrest")
                ),
                !meetsReqs && React.createElement("div", { style: { fontSize:"9px", color:"#c94f3f", marginTop:"4px" } }, "Requires: " + b.requires.map(function(r) { return (BUILDINGS[r] && BUILDINGS[r].name) || r; }).join(", "))
              );
            })
          )
        )
      )
    );
  }

  // ── Governance Panel ───────────────────────────────────────────────────
  function GovernancePanel(_ref) {
    var kingdom = _ref.kingdom, setKingdom = _ref.setKingdom, viewRole = _ref.viewRole, data = _ref.data, onBack = _ref.onBack;
    var _s1 = useState(null), editingRole = _s1[0], setEditingRole = _s1[1];
    var npcs = data.npcs || data.party || [];
    var council = kingdom.council || {};

    var handleAssign = function(role, value) {
      if (value === "__clear__") {
        updateKingdom(setKingdom, function(k) { delete k.council[role]; });
      } else if (value) {
        var npc = npcs.find(function(n) { return (n.id || n.name) === value; });
        if (npc) updateKingdom(setKingdom, function(k) { k.council[role] = { id: npc.id || npc.name, name: npc.name || npc.id }; });
      }
      setEditingRole(null);
    };

    var handleSetEdict = function(edictType, level) {
      updateKingdom(setKingdom, function(k) { k.edicts[edictType] = level; });
    };

    return React.createElement("div", null,
      React.createElement("div", { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" } },
        React.createElement("div", { style: S.sectionHead }, Crown && React.createElement(Crown, { size: 18 }), "Governance & Law"),
        React.createElement("button", { style: Object.assign({}, S.btn, S.btnGold), onClick: onBack }, "← Dashboard")
      ),

      React.createElement("div", { style: Object.assign({}, S.card, { marginBottom:"16px" }) },
        React.createElement("div", { style: { fontSize:"14px", fontWeight:"bold", color:T.gold, marginBottom:"12px", fontFamily:T.heading, display:"flex", alignItems:"center", gap:"8px" } }, Crown && React.createElement(Crown, { size: 16 }), "Royal Council"),
        React.createElement("div", { style: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:"8px" } },
          Object.entries(COUNCIL_ROLES).map(function(entry) {
            var roleKey = entry[0], roleData = entry[1];
            var assigned = council[roleKey];
            var isCritical = ["ruler","treasurer","general","highPriest"].includes(roleKey);
            return React.createElement("div", { key: roleKey, style: Object.assign({}, S.card, { padding:"10px", borderLeft:"3px solid "+(assigned ? "#7cb342" : isCritical ? "#c94f3f" : T.border) }) },
              React.createElement("div", { style: { display:"flex", justifyContent:"space-between", alignItems:"center" } },
                React.createElement("div", { style: { fontSize:"12px", fontWeight:"bold", color:T.gold } }, roleData.icon + " " + roleData.name),
                assigned ? React.createElement("span", { style: S.pill("#7cb342") }, "Filled") : React.createElement("span", { style: S.pill(isCritical ? "#c94f3f" : T.textDim) }, isCritical ? "⚠ Vacant" : "Open")
              ),
              React.createElement("div", { style: { fontSize:"10px", color:T.textDim, margin:"4px 0" } }, roleData.desc),
              assigned && React.createElement("div", { style: { fontSize:"12px", fontWeight:"600", color:T.text } }, assigned.name),
              React.createElement("div", { style: { display:"flex", gap:"4px", marginTop:"4px", flexWrap:"wrap" } },
                roleData.bonus.economy && React.createElement("span", { style: S.pill("#d4af37") }, "+" + roleData.bonus.economy + " Econ"),
                roleData.bonus.loyalty && React.createElement("span", { style: S.pill("#7cb342") }, "+" + roleData.bonus.loyalty + " Loy"),
                roleData.bonus.stability && React.createElement("span", { style: S.pill("#5b7fb5") }, "+" + roleData.bonus.stability + " Stab")
              ),
              viewRole === "dm" && React.createElement("div", { style: { marginTop:"6px" } },
                editingRole === roleKey
                  ? React.createElement("select", { style: Object.assign({}, S.select, { fontSize:"11px" }), onChange: function(e) { handleAssign(roleKey, e.target.value); }, value: "" },
                      React.createElement("option", { value: "" }, "— Select NPC —"),
                      npcs.map(function(npc, i) { return React.createElement("option", { key: i, value: npc.id || npc.name }, npc.name || npc.id); }),
                      assigned && React.createElement("option", { value: "__clear__" }, "⊘ Remove")
                    )
                  : React.createElement("button", { style: Object.assign({}, S.btn, S.btnSmall, S.btnGold), onClick: function() { setEditingRole(roleKey); } }, assigned ? "Reassign" : "Assign")
              )
            );
          })
        )
      ),

      React.createElement("div", { style: S.card },
        React.createElement("div", { style: { fontSize:"14px", fontWeight:"bold", color:T.gold, marginBottom:"12px", fontFamily:T.heading, display:"flex", alignItems:"center", gap:"8px" } }, Scroll && React.createElement(Scroll, { size: 16 }), "Royal Edicts"),
        Object.entries(EDICT_TYPES).map(function(entry) {
          var edictKey = entry[0], edict = entry[1];
          return React.createElement("div", { key: edictKey, style: { marginBottom:"16px" } },
            React.createElement("div", { style: { fontSize:"13px", fontWeight:"bold", color:T.text, marginBottom:"2px" } }, (edict.icon || "") + " " + edict.name),
            React.createElement("div", { style: { fontSize:"10px", color:T.textDim, marginBottom:"8px" } }, edict.desc),
            React.createElement("div", { style: { display:"flex", gap:"6px", flexWrap:"wrap" } },
              Object.entries(edict.options).map(function(optEntry) {
                var optKey = optEntry[0], opt = optEntry[1];
                var active = (kingdom.edicts || {})[edictKey] === optKey;
                return React.createElement("div", {
                  key: optKey,
                  style: { padding:"6px 12px", borderRadius:"4px", fontSize:"11px", fontWeight:"600", border:"1px solid "+(active ? T.gold : T.border), background: active ? T.gold+"18" : "transparent", color: active ? T.gold : T.textDim, cursor: viewRole === "dm" ? "pointer" : "default", transition:"all 0.2s" },
                  onClick: function() { viewRole === "dm" && handleSetEdict(edictKey, optKey); }
                },
                  opt.label,
                  React.createElement("div", { style: { display:"flex", gap:"4px", marginTop:"4px", flexWrap:"wrap" } },
                    opt.economy && React.createElement("span", { style: { fontSize:"9px", color: opt.economy > 0 ? "#7cb342" : "#c94f3f" } }, (opt.economy > 0 ? "+" : "") + opt.economy + " Econ"),
                    opt.loyalty && React.createElement("span", { style: { fontSize:"9px", color: opt.loyalty > 0 ? "#7cb342" : "#c94f3f" } }, (opt.loyalty > 0 ? "+" : "") + opt.loyalty + " Loy"),
                    opt.stability && React.createElement("span", { style: { fontSize:"9px", color: opt.stability > 0 ? "#7cb342" : "#c94f3f" } }, (opt.stability > 0 ? "+" : "") + opt.stability + " Stab"),
                    opt.consumption && React.createElement("span", { style: { fontSize:"9px", color:"#c94f3f" } }, "-" + opt.consumption + " BP/turn")
                  )
                );
              })
            )
          );
        })
      )
    );
  }

  // ── Religion Panel ─────────────────────────────────────────────────────
  function ReligionPanel(_ref) {
    var kingdom = _ref.kingdom, setKingdom = _ref.setKingdom, viewRole = _ref.viewRole, onBack = _ref.onBack;
    var _s1 = useState(false), showPicker = _s1[0], setShowPicker = _s1[1];
    var pantheon = window.PANTHEON || {};
    var allDeities = [].concat(pantheon.greater || [], pantheon.intermediate || [], pantheon.lesser || []);
    var stateReligion = kingdom.stateReligion;
    var divineFavor = kingdom.divineFavor || {};
    var stateDeity = allDeities.find(function(d) { return d.id === stateReligion || d.name === stateReligion; });

    var handleSet = function(deityId) { updateKingdom(setKingdom, function(k) { k.stateReligion = deityId; if (!k.divineFavor) k.divineFavor = {}; if (!k.divineFavor[deityId]) k.divineFavor[deityId] = 50; }); setShowPicker(false); };
    var handleFavor = function(deityId, delta) { updateKingdom(setKingdom, function(k) { if (!k.divineFavor) k.divineFavor = {}; k.divineFavor[deityId] = Math.max(0, Math.min(100, (k.divineFavor[deityId] || 50) + delta)); }); };

    var templeBuildings = [];
    Object.values(kingdom.settlements || {}).forEach(function(s) { (s.buildings || []).forEach(function(b) { if (["shrineBuilding","temple","cathedral","monastery","oracleHall","reliquary"].includes(b.type)) templeBuildings.push(Object.assign({}, b, { settlement: s.name })); }); });

    return React.createElement("div", null,
      React.createElement("div", { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" } },
        React.createElement("div", { style: S.sectionHead }, Star && React.createElement(Star, { size: 18 }), "Religion & Divine Favor"),
        React.createElement("button", { style: Object.assign({}, S.btn, S.btnGold), onClick: onBack }, "← Dashboard")
      ),

      React.createElement("div", { style: Object.assign({}, S.card, { borderLeft:"4px solid #9b59b6" }) },
        React.createElement("div", { style: { fontSize:"14px", fontWeight:"bold", color:"#9b59b6", marginBottom:"8px", fontFamily:T.heading } }, "✟ State Religion"),
        stateReligion
          ? React.createElement("div", null,
              React.createElement("div", { style: { fontSize:"16px", fontWeight:"bold", color:T.gold } }, ((stateDeity && stateDeity.symbol) || "✦") + " " + ((stateDeity && stateDeity.name) || stateReligion)),
              stateDeity && React.createElement("div", { style: { fontSize:"12px", color:T.textDim, marginTop:"4px" } }, (stateDeity.title || "") + " · " + (stateDeity.alignment || "") + " · " + (stateDeity.domains || []).join(", ")),
              React.createElement("div", { style: { marginTop:"8px" } },
                React.createElement("div", { style: S.label }, "Divine Favor"),
                React.createElement("div", { style: { display:"flex", alignItems:"center", gap:"8px" } },
                  React.createElement("div", { style: { flex:1, height:"8px", background:T.border, borderRadius:"4px", overflow:"hidden" } },
                    React.createElement("div", { style: { width: (divineFavor[stateReligion] || 50) + "%", height:"100%", background: (divineFavor[stateReligion] || 50) > 70 ? "#7cb342" : (divineFavor[stateReligion] || 50) > 30 ? "#e67e22" : "#c94f3f", borderRadius:"4px", transition:"width 0.3s" } })
                  ),
                  React.createElement("span", { style: { fontSize:"14px", fontWeight:"bold", color:T.gold, minWidth:"40px" } }, (divineFavor[stateReligion] || 50) + "%"),
                  viewRole === "dm" && React.createElement("button", { style: Object.assign({}, S.btn, S.btnSmall), onClick: function() { handleFavor(stateReligion, 5); } }, "+5"),
                  viewRole === "dm" && React.createElement("button", { style: Object.assign({}, S.btn, S.btnSmall, S.btnDanger), onClick: function() { handleFavor(stateReligion, -5); } }, "-5")
                )
              ),
              viewRole === "dm" && React.createElement("button", { style: Object.assign({}, S.btn, S.btnSmall, S.btnGold, { marginTop:"10px" }), onClick: function() { setShowPicker(true); } }, "Change State Religion")
            )
          : React.createElement("div", null,
              React.createElement("div", { style: { fontSize:"12px", color:T.textDim, marginBottom:"10px" } }, "No state religion declared."),
              viewRole === "dm" && React.createElement("button", { style: S.btn, onClick: function() { setShowPicker(true); } }, "Declare State Religion")
            ),

        showPicker && React.createElement("div", { style: { marginTop:"12px", maxHeight:"300px", overflowY:"auto" } },
          React.createElement("div", { style: Object.assign({}, S.label, { marginBottom:"8px" }) }, "Select Deity"),
          allDeities.length > 0
            ? React.createElement("div", { style: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:"6px" } },
                allDeities.map(function(deity) { return React.createElement("div", { key: deity.id || deity.name, style: Object.assign({}, S.card, { padding:"8px", cursor:"pointer", borderLeft:"3px solid #9b59b6" }), onClick: function() { handleSet(deity.id || deity.name); } },
                  React.createElement("div", { style: { fontSize:"12px", fontWeight:"bold", color:T.gold } }, (deity.symbol || "✦") + " " + deity.name),
                  React.createElement("div", { style: { fontSize:"10px", color:T.textDim } }, deity.title || deity.alignment || "")
                ); })
              )
            : React.createElement("div", null,
                React.createElement("div", { style: { fontSize:"12px", color:T.textDim, marginBottom:"8px" } }, "No pantheon loaded. Enter a deity name:"),
                React.createElement("div", { style: { display:"flex", gap:"6px" } },
                  React.createElement("input", { id:"_kbDeityInput", style: S.input, placeholder:"e.g., Pelor" }),
                  React.createElement("button", { style: S.btn, onClick: function() { var v = document.getElementById("_kbDeityInput"); if (v && v.value) handleSet(v.value); } }, "Set")
                )
              ),
          React.createElement("button", { style: Object.assign({}, S.btn, S.btnGold, S.btnSmall, { marginTop:"8px" }), onClick: function() { setShowPicker(false); } }, "Cancel")
        )
      ),

      React.createElement("div", { style: Object.assign({}, S.card, { marginTop:"12px" }) },
        React.createElement("div", { style: { fontSize:"13px", fontWeight:"bold", color:"#9b59b6", marginBottom:"10px" } }, "✝ Holy Sites (" + templeBuildings.length + ")"),
        templeBuildings.length === 0
          ? React.createElement("div", { style: { fontSize:"12px", color:T.textDim } }, "No religious buildings yet. Build shrines and temples in your settlements.")
          : React.createElement("div", { style: { display:"flex", gap:"6px", flexWrap:"wrap" } },
              templeBuildings.map(function(b, i) { var bData = BUILDINGS[b.type] || {}; return React.createElement("div", { key: i, style: S.badge("#9b59b6") }, bData.icon + " " + bData.name + " (" + b.settlement + ")"); })
            )
      )
    );
  }

  // ── Event Log Panel ────────────────────────────────────────────────────
  function EventLogPanel(_ref) {
    var kingdom = _ref.kingdom, setKingdom = _ref.setKingdom, viewRole = _ref.viewRole, onBack = _ref.onBack;
    var events = (kingdom.eventLog || []).slice().reverse();
    var activeEvent = kingdom.activeEvent;

    var handleResolve = function(choice) {
      if (!activeEvent) return;
      var fx = choice === "A" ? (activeEvent.choiceA && activeEvent.choiceA.effect) : (activeEvent.choiceB && activeEvent.choiceB.effect);
      updateKingdom(setKingdom, function(k) {
        if (fx) applyEventEffect(k, fx, 1.0);
        if (!k.eventLog) k.eventLog = [];
        k.eventLog.push({ turn: k.turn, event: activeEvent.name + " → " + (choice === "A" ? activeEvent.choiceA.label : activeEvent.choiceB.label), type: "resolved", timestamp: Date.now() });
        if (k.eventLog.length > 500) k.eventLog = k.eventLog.slice(-500);
        k.activeEvent = null;
      });
    };

    return React.createElement("div", null,
      React.createElement("div", { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" } },
        React.createElement("div", { style: S.sectionHead }, Scroll && React.createElement(Scroll, { size: 18 }), "Kingdom Events"),
        React.createElement("button", { style: Object.assign({}, S.btn, S.btnGold), onClick: onBack }, "← Dashboard")
      ),

      activeEvent && React.createElement("div", { style: Object.assign({}, S.card, { borderLeft:"4px solid #e67e22" }) },
        React.createElement("div", { style: { fontSize:"14px", fontWeight:"bold", color:"#e67e22", marginBottom:"6px" } }, "⚠ " + activeEvent.name),
        React.createElement("div", { style: { fontSize:"12px", color:T.textDim, marginBottom:"12px" } }, activeEvent.desc),
        activeEvent.choiceA && viewRole === "dm" && React.createElement("div", { style: { display:"flex", gap:"8px" } },
          React.createElement("button", { style: S.btn, onClick: function() { handleResolve("A"); } }, activeEvent.choiceA.label),
          React.createElement("button", { style: Object.assign({}, S.btn, S.btnGold), onClick: function() { handleResolve("B"); } }, activeEvent.choiceB.label)
        )
      ),

      events.length === 0
        ? React.createElement("div", { style: S.empty }, "No events yet.")
        : events.map(function(ev, i) {
          return React.createElement("div", { key: i, style: { padding:"10px 14px", borderBottom:"1px solid "+T.border, display:"flex", alignItems:"center", gap:"10px" } },
            React.createElement("div", { style: { width:"28px", height:"28px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", flexShrink:0, background: ev.type === "harmful" ? "#c94f3f20" : ev.type === "beneficial" ? "#7cb34220" : "#5b7fb520" } },
              ev.type === "harmful" ? "⚠" : ev.type === "beneficial" ? "✦" : "✓"
            ),
            React.createElement("div", { style: { flex:1 } },
              React.createElement("div", { style: { fontSize:"13px", fontWeight:"600", color:T.text } }, ev.event),
              React.createElement("div", { style: { fontSize:"10px", color:T.textDim } }, "Turn " + ev.turn)
            )
          );
        })
    );
  }

  // ── Turn Resolution Panel ──────────────────────────────────────────────
  function TurnPanel(_ref) {
    var kingdom = _ref.kingdom, setKingdom = _ref.setKingdom, viewRole = _ref.viewRole, onBack = _ref.onBack;
    var _s1 = useState(0), phase = _s1[0], setPhase = _s1[1];
    var _s2 = useState([]), turnLog = _s2[0], setTurnLog = _s2[1];

    var phases = [
      { id: "upkeep",   name: "1. Upkeep",  desc: "Pay consumption, check stability", icon: "⊛" },
      { id: "income",   name: "2. Income",   desc: "Collect revenue, population growth", icon: "↑" },
      { id: "event",    name: "3. Events",   desc: "Roll for kingdom events", icon: "◆" },
      { id: "building", name: "4. Building", desc: "Advance construction", icon: "⚒" }
    ];

    var handleProcess = function() {
      if (phase >= phases.length) return;
      var result = processKingdomTurn(kingdom, phases[phase].id);
      setKingdom(function(prev) { return Object.assign({}, prev, { kingdom: result.kingdom }); });
      setTurnLog(function(prev) { return prev.concat([{ phase: phases[phase].name, logs: result.log }]); });
      setPhase(function(p) { return p + 1; });
    };

    var handleFinalize = function() {
      updateKingdom(setKingdom, function(k) {
        k.turn += 1;
        if (!k.turnHistory) k.turnHistory = [];
        k.turnHistory.push({ turn: k.turn - 1, log: turnLog, timestamp: Date.now() });
      });
      setPhase(0); setTurnLog([]);
    };

    var allDone = phase >= phases.length;

    return React.createElement("div", null,
      React.createElement("div", { style: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" } },
        React.createElement("div", { style: S.sectionHead }, Zap && React.createElement(Zap, { size: 18 }), "Kingdom Turn " + (kingdom.turn + 1)),
        React.createElement("button", { style: Object.assign({}, S.btn, S.btnGold), onClick: onBack }, "← Dashboard")
      ),

      // Phase Progress Steps
      React.createElement("div", { style: { display:"flex", gap:"0", marginBottom:"16px", position:"relative" } },
        phases.map(function(p, i) {
          var done = i < phase, active = i === phase;
          var stepColor = done ? "#7cb342" : active ? T.gold : T.textDim;
          return React.createElement("div", { key: p.id, style: { flex:1, padding:"10px 8px", textAlign:"center", fontSize:"10px", fontWeight:"700", fontFamily:T.ui, letterSpacing:"0.5px", textTransform:"uppercase", borderTop:"3px solid "+(done ? "#7cb342" : active ? T.gold : T.border), background: done ? "#7cb34208" : active ? T.gold+"08" : "transparent", color: stepColor, position:"relative" } },
            React.createElement("div", { style: { fontSize:"14px", marginBottom:"2px" } }, p.icon),
            p.name
          );
        })
      ),

      !allDone && React.createElement("div", { style: Object.assign({}, S.card, { borderTop:"3px solid "+T.gold, borderLeft:"none", background:"linear-gradient(180deg, "+T.gold+"06 0%, "+T.bgCard+" 100%)" }) },
        React.createElement("div", { style: { fontSize:"15px", fontWeight:"bold", color:T.gold, marginBottom:"6px", fontFamily:T.heading, letterSpacing:"0.5px" } }, phases[phase].name),
        React.createElement("div", { style: { fontSize:"12px", color:T.textDim, marginBottom:"14px", fontStyle:"italic" } }, phases[phase].desc),
        viewRole === "dm" && React.createElement("button", { style: S.btn, onClick: handleProcess }, "Process " + phases[phase].name)
      ),

      allDone && React.createElement("div", { style: Object.assign({}, S.card, { borderTop:"3px solid #7cb342", borderLeft:"none", background:"linear-gradient(180deg, #7cb34208 0%, "+T.bgCard+" 100%)" }) },
        React.createElement("div", { style: { fontSize:"15px", fontWeight:"bold", color:"#7cb342", marginBottom:"6px", fontFamily:T.heading, letterSpacing:"0.5px" } }, "\u2713 All Phases Complete"),
        React.createElement("div", { style: { fontSize:"12px", color:T.textDim, marginBottom:"14px", fontStyle:"italic" } }, "Review the chronicle below, then seal this turn."),
        viewRole === "dm" && React.createElement("button", { style: Object.assign({}, S.btn, { background:"linear-gradient(180deg, #7cb342, #5a8a30)", borderColor:"#7cb342" }), onClick: handleFinalize }, Crown && React.createElement(Crown, { size: 14 }), "Seal Turn " + (kingdom.turn + 1))
      ),

      turnLog.length > 0 && React.createElement("div", { style: { marginTop:"16px" } },
        React.createElement("div", { style: S.sectionHead }, Scroll && React.createElement(Scroll, { size: 16 }), " Turn Chronicle"),
        turnLog.map(function(entry, i) {
          return React.createElement("div", { key: i, style: Object.assign({}, S.card, { borderLeft:"3px solid "+(i === turnLog.length - 1 ? T.gold : "#7cb342"), padding:"14px 16px" }) },
            React.createElement("div", { style: { fontSize:"12px", fontWeight:"bold", color:T.gold, marginBottom:"8px", fontFamily:T.ui, letterSpacing:"0.8px", textTransform:"uppercase" } }, entry.phase),
            entry.logs.map(function(line, j) { return React.createElement("div", { key: j, style: { fontSize:"12px", color:T.textDim, padding:"3px 0", paddingLeft:"12px", borderLeft:"1px solid "+T.border } }, line); })
          );
        })
      )
    );
  }

  // ── Kingdom Creation Wizard ────────────────────────────────────────────
  function CreateKingdomWizard(_ref) {
    var onComplete = _ref.onComplete;
    var _s1 = useState(""), name = _s1[0], setName = _s1[1];
    var _s2 = useState(1), step = _s2[0], setStep = _s2[1];
    var _s3 = useState({ shape:"pointed", border:"ornate", emblem:"lion", bg:"#1a2e20", fg:"#c9a032" }),
        banner = _s3[0], setBanner = _s3[1];

    var SHAPES = [
      { id:"pointed", label:"Pointed" },
      { id:"forked", label:"Forked" },
      { id:"straight", label:"Straight" },
      { id:"swallowtail", label:"Swallowtail" },
      { id:"rounded", label:"Rounded" }
    ];
    var BORDERS = [
      { id:"trim", label:"Trim" },
      { id:"double", label:"Double" },
      { id:"ornate", label:"Ornate" }
    ];
    var EMBLEMS = [
      { id:"lion", label:"Lion" }, { id:"eagle", label:"Eagle" }, { id:"dragon", label:"Dragon" },
      { id:"bear", label:"Bear" }, { id:"griffin", label:"Griffin" }, { id:"wolf", label:"Wolf" },
      { id:"stag", label:"Stag" }, { id:"phoenix", label:"Phoenix" }, { id:"boar", label:"Boar" },
      { id:"raven", label:"Raven" }, { id:"crown", label:"Crown" }, { id:"sun", label:"Sun" },
      { id:"crescent", label:"Crescent" }, { id:"tree", label:"Tree" }, { id:"swords", label:"Swords" },
      { id:"axes", label:"Axes" }, { id:"fleur", label:"Fleur-de-lis" }, { id:"anchor", label:"Anchor" },
      { id:"fish", label:"Fish" }
    ];
    var PALETTES = [
      { bg:"#1a2e20", fg:"#c9a032", label:"Forest & Gold" },
      { bg:"#1a1a2e", fg:"#c9a032", label:"Midnight & Gold" },
      { bg:"#2e1a1a", fg:"#c9a032", label:"Blood & Gold" },
      { bg:"#1a2e20", fg:"#c0c0c0", label:"Forest & Silver" },
      { bg:"#1a1a2e", fg:"#c0c0c0", label:"Midnight & Silver" },
      { bg:"#2e1a1a", fg:"#c0c0c0", label:"Blood & Silver" },
      { bg:"#2e2a1a", fg:"#e8d8a0", label:"Parchment & Ivory" },
      { bg:"#0e1e2e", fg:"#4a9fd4", label:"Navy & Azure" }
    ];

    var upd = function(key, val) { setBanner(function(p) { var n = Object.assign({}, p); n[key] = val; return n; }); };

    // Chip button style
    var chip = function(selected) {
      return {
        padding:"6px 12px", borderRadius:"4px", cursor:"pointer", fontSize:"11px",
        fontFamily:T.ui, letterSpacing:"0.5px", border:"1px solid " + (selected ? T.gold : T.gold+"33"),
        background: selected ? T.gold+"22" : "transparent", color: selected ? T.gold : T.textDim,
        transition:"all 0.15s", textTransform:"capitalize", whiteSpace:"nowrap"
      };
    };
    // Small emblem chip with mini preview
    var emblemChip = function(e, selected) {
      return {
        display:"flex", flexDirection:"column", alignItems:"center", gap:"4px",
        padding:"6px 8px", borderRadius:"4px", cursor:"pointer", fontSize:"10px",
        fontFamily:T.ui, border:"1px solid " + (selected ? T.gold : T.gold+"33"),
        background: selected ? T.gold+"22" : "transparent", color: selected ? T.gold : T.textDim,
        transition:"all 0.15s", minWidth:"52px", textTransform:"capitalize"
      };
    };
    var sectionLabel = { fontSize:"10px", color:T.gold, fontFamily:T.ui, letterSpacing:"2px", textTransform:"uppercase", marginBottom:"8px", opacity:0.6 };
    var sectionWrap = { marginBottom:"16px" };

    // Live preview SVG
    var previewSvg = getBannerSVG(banner);

    if (step === 1) {
      return React.createElement("div", { style: { maxWidth:"480px", margin:"40px auto", textAlign:"center" } },
        React.createElement("div", { style: { color:T.gold+"44", fontSize:"16px", letterSpacing:"12px", marginBottom:"20px" } }, "\u2726\u2727\u2726"),
        React.createElement("div", { style: { width:"80px", height:"80px", margin:"0 auto 20px", borderRadius:"50%", border:"3px solid "+T.gold+"44", display:"flex", alignItems:"center", justifyContent:"center", background:"radial-gradient(circle, "+T.gold+"10 0%, transparent 70%)", boxShadow:"0 0 30px "+T.gold+"10" } },
          Crown && React.createElement(Crown, { size: 36, color: T.gold })
        ),
        React.createElement("div", { style: { fontSize:"10px", color:T.gold, fontFamily:T.ui, letterSpacing:"3px", textTransform:"uppercase", marginBottom:"8px", opacity:0.5 } }, "Royal Decree"),
        React.createElement("div", { style: { fontSize:"26px", fontWeight:"bold", color:T.gold, fontFamily:T.heading, marginBottom:"8px", letterSpacing:"2px", textShadow:"0 1px 4px rgba(0,0,0,0.4)" } }, "Found a Kingdom"),
        React.createElement("div", { style: { fontSize:"13px", color:T.textDim, marginBottom:"8px", fontStyle:"italic", lineHeight:"1.6" } }, "Establish your domain, appoint your council,"),
        React.createElement("div", { style: { fontSize:"13px", color:T.textDim, marginBottom:"28px", fontStyle:"italic", lineHeight:"1.6" } }, "and build your legacy."),
        React.createElement("div", { style: { height:"1px", background:"linear-gradient(90deg, transparent, "+T.gold+"44, transparent)", margin:"0 40px 28px" } }),
        React.createElement("div", { style: Object.assign({}, S.card, S.cardRoyal, { textAlign:"left", maxWidth:"380px", margin:"0 auto", padding:"24px" }) },
          React.createElement("div", { style: { marginBottom:"20px" } },
            React.createElement("label", { style: S.label }, "Name Your Kingdom"),
            React.createElement("input", { style: Object.assign({}, S.input, { fontSize:"15px", padding:"10px 14px", fontFamily:T.heading, letterSpacing:"0.5px" }), value: name, placeholder: "e.g., The Realm of Thornwall", onChange: function(e) { setName(e.target.value); } })
          ),
          React.createElement("button", {
            style: Object.assign({}, S.btn, { width:"100%", justifyContent:"center", padding:"12px 16px", fontSize:"13px", letterSpacing:"1.5px", opacity: name ? 1 : 0.4 }),
            onClick: function() { if (name) setStep(2); }
          }, "Next Step \u2192")
        ),
        React.createElement("div", { style: { color:T.gold+"33", fontSize:"14px", letterSpacing:"12px", marginTop:"24px" } }, "\u2756\u2756\u2756")
      );
    }

    // Step 2: Banner Designer (clean, minimal layout)
    return React.createElement("div", { style: { maxWidth:"620px", margin:"30px auto" } },
      // Header
      React.createElement("div", { style: { textAlign:"center", marginBottom:"24px" } },
        React.createElement("div", { style: { fontSize:"10px", color:T.gold, fontFamily:T.ui, letterSpacing:"3px", textTransform:"uppercase", marginBottom:"6px", opacity:0.5 } }, "Step 2 of 2"),
        React.createElement("div", { style: { fontSize:"22px", fontWeight:"bold", color:T.gold, fontFamily:T.heading, letterSpacing:"2px" } }, "Design Your Banner")
      ),
      // Preview centered
      React.createElement("div", { style: { textAlign:"center", marginBottom:"24px" } },
        React.createElement("div", { style: { width:"100px", height:"300px", margin:"0 auto" }, dangerouslySetInnerHTML: { __html: previewSvg } }),
        React.createElement("div", { style: { fontSize:"13px", color:T.gold, fontFamily:T.heading, marginTop:"8px", letterSpacing:"1px" } }, name)
      ),
      // Options card
      React.createElement("div", { style: Object.assign({}, S.card, S.cardRoyal, { padding:"24px" }) },
        // Shape + Border side by side
        React.createElement("div", { style: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px", marginBottom:"20px" } },
          React.createElement("div", null,
            React.createElement("div", { style: sectionLabel }, "Shape"),
            React.createElement("div", { style: { display:"flex", flexWrap:"wrap", gap:"6px" } },
              SHAPES.map(function(s) {
                return React.createElement("div", { key:s.id, style: chip(banner.shape===s.id), onClick: function() { upd("shape",s.id); } }, s.label);
              })
            )
          ),
          React.createElement("div", null,
            React.createElement("div", { style: sectionLabel }, "Border"),
            React.createElement("div", { style: { display:"flex", flexWrap:"wrap", gap:"6px" } },
              BORDERS.map(function(b) {
                return React.createElement("div", { key:b.id, style: chip(banner.border===b.id), onClick: function() { upd("border",b.id); } }, b.label);
              })
            )
          )
        ),
        // Colors - compact color swatches
        React.createElement("div", { style: { marginBottom:"20px" } },
          React.createElement("div", { style: sectionLabel }, "Colors"),
          React.createElement("div", { style: { display:"flex", flexWrap:"wrap", gap:"8px" } },
            PALETTES.map(function(p, i) {
              var sel = banner.bg===p.bg && banner.fg===p.fg;
              return React.createElement("div", {
                key:i, title:p.label,
                style: { width:"36px", height:"36px", borderRadius:"4px", cursor:"pointer", border: sel ? "2px solid "+T.gold : "2px solid transparent", padding:"2px", transition:"all 0.15s", background:"transparent" },
                onClick: function() { setBanner(function(prev) { return Object.assign({}, prev, { bg:p.bg, fg:p.fg }); }); }
              },
                React.createElement("div", { style: { width:"100%", height:"100%", borderRadius:"2px", background:"linear-gradient(135deg, "+p.bg+" 50%, "+p.fg+" 50%)" } })
              );
            })
          )
        ),
        // Emblem - text chips (no mini SVG renders)
        React.createElement("div", { style: { marginBottom:"24px" } },
          React.createElement("div", { style: sectionLabel }, "Emblem"),
          React.createElement("div", { style: { display:"flex", flexWrap:"wrap", gap:"6px" } },
            EMBLEMS.map(function(e) {
              return React.createElement("div", {
                key:e.id,
                style: chip(banner.emblem===e.id),
                onClick: function() { upd("emblem",e.id); }
              }, e.label);
            })
          )
        ),
        // Buttons
        React.createElement("div", { style: { display:"flex", gap:"10px" } },
          React.createElement("button", {
            style: Object.assign({}, S.btn, S.btnGold, { padding:"10px 16px", fontSize:"12px" }),
            onClick: function() { setStep(1); }
          }, "\u2190 Back"),
          React.createElement("button", {
            style: Object.assign({}, S.btn, { flex:1, justifyContent:"center", padding:"12px 16px", fontSize:"13px", letterSpacing:"1.5px" }),
            onClick: function() { onComplete(initKingdom(name, null, banner)); }
          }, Crown && React.createElement(Crown, { size: 16 }), "Establish Kingdom")
        )
      )
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 6: MAIN COMPONENT
  // ═══════════════════════════════════════════════════════════════════════════

  function KingdomView(_ref) {
    var data = _ref.data, setData = _ref.setData, viewRole = _ref.viewRole;
    var _s1 = useState("dashboard"), view = _s1[0], setView = _s1[1];
    var kingdom = data.kingdom || null;

    var setKingdom = useCallback(function(updater) {
      setData(function(prev) {
        if (typeof updater === "function") return updater(prev);
        return Object.assign({}, prev, { kingdom: updater });
      });
    }, [setData]);

    var handleCreate = useCallback(function(newKingdom) {
      setData(function(prev) {
        // Set kingdom data and also enable the kingdom module so the tab persists
        var mods = Object.assign({}, prev.modules || {}, { kingdom: true });
        return Object.assign({}, prev, { kingdom: newKingdom, modules: mods });
      });
    }, [setData]);

    var stats = useMemo(function() {
      if (!kingdom) return { economy: 0, loyalty: 0, stability: 0, consumption: 0, income: 0, totalDefense: 0, unrest: 0 };
      return calcKingdomStats(kingdom);
    }, [kingdom]);

    if (!kingdom) {
      return React.createElement("div", { style: S.page },
        React.createElement("div", { style: S.header },
          React.createElement("div", { style: S.headerInner },
            React.createElement("h1", { style: S.title }, Crown && React.createElement(Crown, { size: 26 }), "Kingdom Builder")
          ),
          React.createElement("div", { style: S.headerBorder }),
          React.createElement("div", { style: S.headerAccent })
        ),
        React.createElement("div", { style: S.scrollArea },
          viewRole === "dm"
            ? React.createElement(CreateKingdomWizard, { onComplete: handleCreate })
            : React.createElement("div", { style: S.empty }, "No kingdom founded yet. The DM can establish one from this tab.")
        )
      );
    }

    return React.createElement("div", { style: S.page },
      React.createElement("div", { style: S.header },
        React.createElement("div", { style: S.headerInner },
          React.createElement("h1", { style: S.title }, Crown && React.createElement(Crown, { size: 22 }), kingdom.name),
          React.createElement("div", { style: { display:"flex", alignItems:"center", gap:"16px" } },
            React.createElement("span", { style: { fontSize:"11px", color:T.textDim, fontFamily:T.ui, letterSpacing:"1px", textTransform:"uppercase" } }, "Turn " + kingdom.turn),
            React.createElement("span", { style: { fontSize:"13px", color:T.gold, fontWeight:"bold", fontFamily:T.heading, letterSpacing:"0.5px" } }, kingdom.treasury + " BP"),
            (kingdom.unrest || 0) > 5 && React.createElement("span", { style: S.pill("#c94f3f") }, "⚠ Unrest: " + kingdom.unrest)
          )
        ),
        React.createElement("div", { style: S.headerBorder }),
        React.createElement("div", { style: S.headerAccent })
      ),
      React.createElement("div", { style: S.scrollArea },
        view === "dashboard" && React.createElement(KingdomDashboard, { kingdom: kingdom, stats: stats, onNavigate: setView, viewRole: viewRole }),
        view === "territory" && React.createElement(TerritoryPanel, { kingdom: kingdom, setKingdom: setKingdom, viewRole: viewRole, onBack: function() { setView("dashboard"); } }),
        view === "settlements" && React.createElement(SettlementPanel, { kingdom: kingdom, setKingdom: setKingdom, viewRole: viewRole, onBack: function() { setView("dashboard"); } }),
        view === "governance" && React.createElement(GovernancePanel, { kingdom: kingdom, setKingdom: setKingdom, viewRole: viewRole, data: data, onBack: function() { setView("dashboard"); } }),
        view === "religion" && React.createElement(ReligionPanel, { kingdom: kingdom, setKingdom: setKingdom, viewRole: viewRole, onBack: function() { setView("dashboard"); } }),
        view === "events" && React.createElement(EventLogPanel, { kingdom: kingdom, setKingdom: setKingdom, viewRole: viewRole, onBack: function() { setView("dashboard"); } }),
        view === "turn" && React.createElement(TurnPanel, { kingdom: kingdom, setKingdom: setKingdom, viewRole: viewRole, onBack: function() { setView("dashboard"); } })
      )
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPORTS
  // ═══════════════════════════════════════════════════════════════════════════

  window.KingdomView = KingdomView;
  window.KINGDOM_BUILDINGS = BUILDINGS;
  window.KINGDOM_EVENTS = KINGDOM_EVENTS;
  window.SETTLEMENT_SIZES = SETTLEMENT_SIZES;
  window.COUNCIL_ROLES = COUNCIL_ROLES;
  window.HEX_IMPROVEMENTS = HEX_IMPROVEMENTS;
  window.TERRAIN_TYPES = TERRAIN_TYPES;
  window.initKingdom = initKingdom;
  window.calcKingdomStats = calcKingdomStats;

})();
