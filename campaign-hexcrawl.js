(function() {
  'use strict';

  // ============================================================================
  // HEX TERRAIN DEFINITIONS
  // ============================================================================
  const HEX_TERRAINS = {
    plains: {
      id: 'plains',
      name: 'Plains',
      icon: '🌾',
      travelCost: 1,
      forageDC: 10,
      shelterAvailable: true,
      visibility: 3,
      description: 'Open grassland with scattered trees and rolling hills',
      possibleEncounters: ['traveling_merchants', 'wild_horses', 'bandit_ambush', 'friendly_druids']
    },
    forest: {
      id: 'forest',
      name: 'Forest',
      icon: '🌲',
      travelCost: 2,
      forageDC: 11,
      shelterAvailable: true,
      visibility: 1,
      description: 'Dense woodland with thick canopy and underbrush',
      possibleEncounters: ['wolf_pack', 'goblin_patrol', 'lost_pilgrim', 'territorial_bear']
    },
    hills: {
      id: 'hills',
      name: 'Hills',
      icon: '⛰️',
      travelCost: 2,
      forageDC: 12,
      shelterAvailable: false,
      visibility: 2,
      description: 'Rolling terrain with rocky outcrops and ravines',
      possibleEncounters: ['bandit_ambush', 'goblin_patrol', 'smuggler_camp', 'giant_spider_lair']
    },
    mountains: {
      id: 'mountains',
      name: 'Mountains',
      icon: '🏔️',
      travelCost: 3,
      forageDC: 14,
      shelterAvailable: false,
      visibility: 2,
      description: 'Jagged peaks with steep slopes and thin air',
      possibleEncounters: ['dragon_flyover', 'territorial_creature', 'undead_rising']
    },
    swamp: {
      id: 'swamp',
      name: 'Swamp',
      icon: '🌿',
      travelCost: 3,
      forageDC: 13,
      shelterAvailable: false,
      visibility: 1,
      description: 'Murky wetlands with standing water and twisted trees',
      possibleEncounters: ['giant_spider_lair', 'territorial_creature', 'will_o_wisps', 'undead_rising']
    },
    desert: {
      id: 'desert',
      name: 'Desert',
      icon: '🏜️',
      travelCost: 2,
      forageDC: 15,
      shelterAvailable: false,
      visibility: 3,
      description: 'Vast sandy expanse with occasional dunes and rock formations',
      possibleEncounters: ['trading_caravan', 'giant_scorpions', 'bandits', 'mirage']
    },
    tundra: {
      id: 'tundra',
      name: 'Tundra',
      icon: '❄️',
      travelCost: 2,
      forageDC: 16,
      shelterAvailable: false,
      visibility: 2,
      description: 'Frozen wasteland with permafrost and biting winds',
      possibleEncounters: ['ice_storm', 'frost_giant_camp', 'frozen_undead', 'arctic_wolves']
    },
    jungle: {
      id: 'jungle',
      name: 'Jungle',
      icon: '🌴',
      travelCost: 3,
      forageDC: 12,
      shelterAvailable: true,
      visibility: 1,
      description: 'Thick tropical vegetation with oppressive humidity',
      possibleEncounters: ['giant_spider_lair', 'lost_ruins', 'territorial_tribe', 'owlbear_nest']
    },
    coast: {
      id: 'coast',
      name: 'Coast',
      icon: '🏖️',
      travelCost: 1,
      forageDC: 11,
      shelterAvailable: true,
      visibility: 2,
      description: 'Sandy beach with rocky coves and tide pools',
      possibleEncounters: ['trading_caravan', 'pirates', 'shipwreck', 'sea_monster']
    },
    river: {
      id: 'river',
      name: 'River',
      icon: '💧',
      travelCost: 2,
      forageDC: 10,
      shelterAvailable: true,
      visibility: 2,
      description: 'Flowing waterway with banks and occasional rapids',
      possibleEncounters: ['fishing_folk', 'river_troll', 'bandits', 'water_elemental']
    },
    lake: {
      id: 'lake',
      name: 'Lake',
      icon: '💦',
      travelCost: 1,
      forageDC: 9,
      shelterAvailable: false,
      visibility: 2,
      description: 'Large body of water with islands and fishing spots',
      possibleEncounters: ['trading_caravan', 'fishing_folk', 'lake_monster']
    },
    ruins: {
      id: 'ruins',
      name: 'Ancient Ruins',
      icon: '🏛️',
      travelCost: 2,
      forageDC: 14,
      shelterAvailable: true,
      visibility: 1,
      description: 'Crumbling structures of a forgotten civilization',
      possibleEncounters: ['undead_rising', 'treasure_guardian', 'lost_civilization', 'ley_line_vortex']
    }
  };

  // ============================================================================
  // EXPLORATION FEATURES
  // ============================================================================
  const HEX_FEATURES = [
    { id: 'campsite', name: 'Abandoned Campsite', icon: '⛺', description: 'Former adventurer camp with cold fire pit', mechanicalEffect: 'shelter_available' },
    { id: 'stream', name: 'Crystal Stream', icon: '🏞️', description: 'Clear water source', mechanicalEffect: 'water_source' },
    { id: 'cave', name: 'Cave Entrance', icon: '🕳️', description: 'Leads into darkness', mechanicalEffect: 'shelter_or_danger' },
    { id: 'standing_stones', name: 'Standing Stones', icon: '🔷', description: 'Ancient circle of mysterious megaliths', mechanicalEffect: 'arcane_resonance' },
    { id: 'fairy_ring', name: 'Fairy Ring', icon: '💫', description: 'Circle of mushrooms with otherworldly aura', mechanicalEffect: 'magic_site' },
    { id: 'old_road', name: 'Old Road', icon: '🛣️', description: 'Cobblestone path, long abandoned', mechanicalEffect: 'travel_bonus' },
    { id: 'animal_den', name: 'Animal Den', icon: '🦙', description: 'Burrow or lair of local fauna', mechanicalEffect: 'encounter_likely' },
    { id: 'herb_patch', name: 'Herb Patch', icon: '🌿', description: 'Medicinal plants growing wild', mechanicalEffect: 'forage_bonus' },
    { id: 'mineral_vein', name: 'Mineral Vein', icon: '💎', description: 'Exposed ore deposit', mechanicalEffect: 'material_source' },
    { id: 'viewpoint', name: 'Natural Viewpoint', icon: '👁️', description: 'High vantage point overlooking the land', mechanicalEffect: 'vision_bonus' },
    { id: 'hidden_trail', name: 'Hidden Trail', icon: '🥾', description: 'Overgrown path through thick brush', mechanicalEffect: 'shortcut' }
  ];

  // ============================================================================
  // WILDERNESS ENCOUNTERS
  // ============================================================================
  const WILDERNESS_ENCOUNTERS = [
    // Peaceful (1-2)
    { id: 'traveling_merchants', name: 'Traveling Merchants', terrains: ['plains', 'coast', 'forest'], dangerMin: 1, dangerMax: 2, description: 'Merchant caravan heading to market', difficulty: 'easy', rewards: ['supplies', 'rumors'], canAvoid: true, avoidDC: 8 },
    { id: 'lost_pilgrim', name: 'Lost Pilgrim', terrains: ['plains', 'forest', 'hills'], dangerMin: 1, dangerMax: 2, description: 'Religious wanderer seeking sanctuary', difficulty: 'easy', rewards: ['blessing', 'rumor'], canAvoid: false, avoidDC: 0 },
    { id: 'friendly_druids', name: 'Friendly Druids', terrains: ['forest', 'swamp', 'jungle'], dangerMin: 1, dangerMax: 2, description: 'Circle of druids performing ritual', difficulty: 'easy', rewards: ['herbs', 'knowledge'], canAvoid: true, avoidDC: 10 },
    { id: 'wild_horses', name: 'Wild Horse Herd', terrains: ['plains', 'hills', 'desert'], dangerMin: 1, dangerMax: 2, description: 'Stampeding horses heading east', difficulty: 'easy', rewards: ['none'], canAvoid: true, avoidDC: 9 },

    // Moderate (3-4)
    { id: 'bandit_ambush', name: 'Bandit Ambush', terrains: ['plains', 'forest', 'hills', 'desert'], dangerMin: 3, dangerMax: 4, description: 'Roadside bandits demand toll', difficulty: 'medium', rewards: ['gold', 'weapons'], canAvoid: true, avoidDC: 12 },
    { id: 'wolf_pack', name: 'Wolf Pack', terrains: ['forest', 'hills', 'tundra'], dangerMin: 3, dangerMax: 4, description: 'Hungry wolves circle the party', difficulty: 'medium', rewards: ['pelts'], canAvoid: true, avoidDC: 11 },
    { id: 'goblin_patrol', name: 'Goblin Patrol', terrains: ['hills', 'forest', 'ruins'], dangerMin: 3, dangerMax: 4, description: 'Scouting party of goblins', difficulty: 'medium', rewards: ['loot', 'intelligence'], canAvoid: true, avoidDC: 13 },
    { id: 'territorial_bear', name: 'Territorial Bear', terrains: ['forest', 'hills', 'mountains'], dangerMin: 3, dangerMax: 4, description: 'Protective beast guards territory', difficulty: 'medium', rewards: ['pelt', 'teeth'], canAvoid: true, avoidDC: 14 },
    { id: 'smuggler_camp', name: 'Smuggler Camp', terrains: ['forest', 'hills', 'coast'], dangerMin: 3, dangerMax: 4, description: 'Hidden camp of contraband runners', difficulty: 'medium', rewards: ['valuable_goods'], canAvoid: true, avoidDC: 13 },

    // Dangerous (5+)
    { id: 'dragon_flyover', name: 'Dragon Flyover', terrains: ['mountains', 'plains', 'forest'], dangerMin: 5, dangerMax: 5, description: 'Wyrm passing overhead, seeking prey', difficulty: 'deadly', rewards: ['legendary_loot'], canAvoid: true, avoidDC: 16 },
    { id: 'troll_bridge', name: 'Troll Bridge', terrains: ['river', 'hills', 'forest'], dangerMin: 4, dangerMax: 5, description: 'Ancient bridge guarded by troll', difficulty: 'hard', rewards: ['troll_treasure'], canAvoid: true, avoidDC: 15 },
    { id: 'undead_rising', name: 'Undead Rising', terrains: ['ruins', 'swamp', 'mountains', 'tundra'], dangerMin: 4, dangerMax: 5, description: 'Corpses animated by dark magic', difficulty: 'hard', rewards: ['cursed_item'], canAvoid: true, avoidDC: 14 },
    { id: 'owlbear_nest', name: 'Owlbear Nest', terrains: ['forest', 'jungle', 'hills'], dangerMin: 4, dangerMax: 5, description: 'Territorial hybrid beast nests here', difficulty: 'hard', rewards: ['exotic_hide'], canAvoid: true, avoidDC: 15 },
    { id: 'giant_spider_lair', name: 'Giant Spider Lair', terrains: ['swamp', 'jungle', 'forest', 'hills'], dangerMin: 4, dangerMax: 5, description: 'Web-covered area with massive arachnid', difficulty: 'hard', rewards: ['spider_silk'], canAvoid: true, avoidDC: 13 },
    { id: 'ley_line_vortex', name: 'Ley Line Vortex', terrains: ['ruins', 'mountains'], dangerMin: 5, dangerMax: 5, description: 'Intersection of magical currents', difficulty: 'deadly', rewards: ['arcane_essence'], canAvoid: false, avoidDC: 0 }
  ];

  // ============================================================================
  // TRAVEL EVENTS
  // ============================================================================
  const TRAVEL_EVENTS = [
    { id: 'path_blocked', name: 'Path Blocked', description: 'Fallen tree or rockslide requires detour', effect: 'travel_delay', delayHours: 4 },
    { id: 'hidden_cache', name: 'Hidden Cache', description: 'Discover old supply stash (1d6 provisions)', effect: 'gain_loot', value: 'supplies' },
    { id: 'weather_change', name: 'Weather Change', description: 'Sudden storm reduces visibility and slows travel', effect: 'travel_penalty', delayHours: 8 },
    { id: 'friendly_traveler', name: 'Friendly Traveler', description: 'NPC offers shelter, supplies, or useful information', effect: 'social_encounter', value: 'ally' },
    { id: 'territorial_creature', name: 'Territorial Creature', description: 'Beast marks territory - must fight, sneak, or detour', effect: 'combat_or_avoidance', difficulty: 'medium' },
    { id: 'ancient_waymarker', name: 'Ancient Waymarker', description: 'Stone marker reveals nearby hexes to map', effect: 'reveal_hexes', hexCount: 3 },
    { id: 'shortcut', name: 'Shortcut Discovered', description: 'Hidden path saves 1-2 hexes of travel', effect: 'travel_bonus', hexSaved: 2 },
    { id: 'ley_line', name: 'Ley Line Crossing', description: 'Magic is stronger here - spells amplified', effect: 'arcane_boost', duration: '1_hex' }
  ];

  // ============================================================================
  // SEEDED RANDOM NUMBER GENERATOR
  // ============================================================================
  function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function mulberry32(a) {
    return function() {
      a |= 0; a = a + 0x6d2b79f5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }

  // ============================================================================
  // PERLIN NOISE (SIMPLEX-LIKE FOR TERRAIN)
  // ============================================================================
  function perlinNoise(x, y, seed) {
    const xi = Math.floor(x) + seed * 73856093;
    const yi = Math.floor(y) + seed * 19349663;

    const n00 = seededRandom((xi ^ yi) * 73856093);
    const n10 = seededRandom(((xi + 1) ^ yi) * 73856093);
    const n01 = seededRandom((xi ^ (yi + 1)) * 73856093);
    const n11 = seededRandom(((xi + 1) ^ (yi + 1)) * 73856093);

    const u = x - Math.floor(x);
    const v = y - Math.floor(y);

    const uu = u * u * (3 - 2 * u);
    const vv = v * v * (3 - 2 * v);

    const nx0 = n00 * (1 - uu) + n10 * uu;
    const nx1 = n01 * (1 - uu) + n11 * uu;
    return nx0 * (1 - vv) + nx1 * vv;
  }

  // ============================================================================
  // HEX CRAWL ENGINE
  // ============================================================================
  class HexCrawlEngine {
    constructor(options = {}) {
      this.partyPosition = { q: 0, r: 0 };
      this.movement = options.movement || 6;
      this.maxMovement = this.movement;
      this.hexGrid = new Map();
      this.exploredHexes = new Set();
      this.revealedHexes = new Set();
      this.notes = new Map();
      this.travelEventHistory = [];
      this.encounterHistory = [];
    }

    /**
     * Generate hex grid between two cities using seeded noise
     */
    generateHexGrid(fromCity, toCity, seed = 42) {
      const startX = fromCity.mapX || 0;
      const startY = fromCity.mapY || 0;
      const endX = toCity.mapX || 100;
      const endY = toCity.mapY || 100;

      const hexes = [];
      const visited = new Set();

      const qStart = Math.floor(startX / 2);
      const rStart = Math.floor(startY / 2);
      const qEnd = Math.floor(endX / 2);
      const rEnd = Math.floor(endY / 2);

      const qDist = Math.abs(qEnd - qStart);
      const rDist = Math.abs(rEnd - rStart);
      const gridSize = Math.max(qDist, rDist) + 5;

      for (let i = -gridSize; i <= gridSize; i++) {
        for (let j = -gridSize; j <= gridSize; j++) {
          const q = qStart + i;
          const r = rStart + j;
          const key = `${q},${r}`;

          if (!visited.has(key)) {
            visited.add(key);
            const noiseVal = perlinNoise(q * 0.5, r * 0.5, seed);
            const hex = this._generateHex(q, r, noiseVal, seed);
            hexes.push(hex);
            this.hexGrid.set(key, hex);
          }
        }
      }

      return hexes;
    }

    _generateHex(q, r, noiseVal, seed) {
      let terrainId = 'plains';

      if (noiseVal < 0.15) terrainId = 'mountains';
      else if (noiseVal < 0.25) terrainId = 'hills';
      else if (noiseVal < 0.35) terrainId = 'forest';
      else if (noiseVal < 0.45) terrainId = 'swamp';
      else if (noiseVal < 0.55) terrainId = 'jungle';
      else if (noiseVal < 0.65) terrainId = 'desert';
      else if (noiseVal < 0.75) terrainId = 'tundra';
      else if (noiseVal < 0.85) terrainId = 'coast';
      else if (noiseVal < 0.92) terrainId = 'river';
      else terrainId = 'plains';

      const terrain = HEX_TERRAINS[terrainId];
      const rng = mulberry32((q * 73856093) ^ (r * 19349663) ^ (seed * 83492791));

      const features = [];
      const featureCount = Math.floor(rng() * 3);
      for (let i = 0; i < featureCount; i++) {
        const feat = HEX_FEATURES[Math.floor(rng() * HEX_FEATURES.length)];
        features.push({ ...feat });
      }

      const dangerLevel = Math.ceil(rng() * 5);

      return {
        q,
        r,
        terrain: terrainId,
        terrainData: terrain,
        explored: false,
        revealed: false,
        features,
        encounters: [],
        loot: [],
        notes: '',
        dangerLevel
      };
    }

    /**
     * Move party in hex direction (0-5)
     * Direction: 0=NE, 1=E, 2=SE, 3=SW, 4=W, 5=NW
     */
    moveParty(direction) {
      const directions = [
        { q: 1, r: 0 },   // NE
        { q: 1, r: -1 },  // E
        { q: 0, r: -1 },  // SE
        { q: -1, r: 0 },  // SW
        { q: -1, r: 1 },  // W
        { q: 0, r: 1 }    // NW
      ];

      if (direction < 0 || direction > 5) throw new Error('Invalid direction');

      const nextPos = directions[direction];
      const newQ = this.partyPosition.q + nextPos.q;
      const newR = this.partyPosition.r + nextPos.r;
      const key = `${newQ},${newR}`;

      const targetHex = this.hexGrid.get(key);
      if (!targetHex) throw new Error('Hex not found in grid');

      const moveCost = targetHex.terrainData.travelCost;
      if (this.movement < moveCost) throw new Error('Insufficient movement points');

      this.movement -= moveCost;
      this.partyPosition = { q: newQ, r: newR };

      this.exploreHex(newQ, newR);

      return { position: this.partyPosition, movement: this.movement, hex: targetHex };
    }

    /**
     * Explore and reveal hex contents
     */
    exploreHex(q, r) {
      const key = `${q},${r}`;
      const hex = this.hexGrid.get(key);
      if (!hex) return;

      hex.revealed = true;
      this.revealedHexes.add(key);

      if (!hex.explored) {
        hex.explored = true;
        this.exploredHexes.add(key);

        // Roll for encounter
        if (Math.random() < 0.3) {
          const encounter = this.rollEncounter(hex);
          if (encounter) hex.encounters.push(encounter);
        }
      }

      return hex;
    }

    /**
     * Camp at current hex - roll for random encounter
     */
    camp() {
      const key = `${this.partyPosition.q},${this.partyPosition.r}`;
      const hex = this.hexGrid.get(key);
      if (!hex) return { success: false };

      const encounterChance = 0.25 + (hex.dangerLevel * 0.1);
      const hasEncounter = Math.random() < encounterChance;

      let result = {
        position: this.partyPosition,
        shelterAvailable: hex.terrainData.shelterAvailable,
        hasEncounter,
        encounter: null,
        restful: !hasEncounter
      };

      if (hasEncounter) {
        result.encounter = this.rollEncounter(hex);
      }

      return result;
    }

    /**
     * Forage for food/water
     */
    forage(survivalBonus = 0) {
      const key = `${this.partyPosition.q},${this.partyPosition.r}`;
      const hex = this.hexGrid.get(key);
      if (!hex) return { success: false };

      const roll = Math.floor(Math.random() * 20) + 1 + survivalBonus;
      const success = roll >= hex.terrainData.forageDC;

      const resources = {
        plains: ['grain', 'game', 'berries'],
        forest: ['mushrooms', 'game', 'herbs'],
        hills: ['roots', 'rabbits'],
        mountains: ['goats', 'alpine_herbs'],
        swamp: ['frog', 'water_plant'],
        desert: ['cactus', 'insects'],
        tundra: ['lichen', 'arctic_fish'],
        jungle: ['fruit', 'game', 'insects'],
        coast: ['shellfish', 'seaweed'],
        river: ['fish', 'water_plant'],
        lake: ['fish', 'waterfowl'],
        ruins: []
      };

      const available = resources[hex.terrain] || [];

      return {
        success,
        roll,
        dc: hex.terrainData.forageDC,
        item: success && available.length > 0 ? available[Math.floor(Math.random() * available.length)] : null,
        quantity: success ? Math.floor(Math.random() * 4) + 1 : 0,
        description: success ? 'Found provisions' : 'Found nothing of value'
      };
    }

    /**
     * Navigate to target city - return pathfinding result
     */
    navigate(targetCity) {
      const currentQ = this.partyPosition.q;
      const currentR = this.partyPosition.r;
      const targetQ = Math.floor(targetCity.mapX / 2);
      const targetR = Math.floor(targetCity.mapY / 2);

      const distance = this._estimateDistance(currentQ, currentR, targetQ, targetR);
      const avgTravelCost = 1.8;
      const estimatedDays = Math.ceil(distance * avgTravelCost / this.maxMovement);

      return {
        target: targetCity.name,
        currentPosition: this.partyPosition,
        targetPosition: { q: targetQ, r: targetR },
        estimatedDistance: distance,
        estimatedDays,
        route: []
      };
    }

    _estimateDistance(q1, r1, q2, r2) {
      return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2;
    }

    /**
     * Get hexes visible from current position
     */
    getVisibleHexes() {
      const key = `${this.partyPosition.q},${this.partyPosition.r}`;
      const currentHex = this.hexGrid.get(key);
      if (!currentHex) return [];

      const visibility = currentHex.terrainData.visibility;
      const visibleHexes = [];

      for (const [hexKey, hex] of this.hexGrid) {
        const dist = this._estimateDistance(
          this.partyPosition.q, this.partyPosition.r,
          hex.q, hex.r
        );
        if (dist <= visibility && hex.revealed) {
          visibleHexes.push(hex);
        }
      }

      return visibleHexes;
    }

    /**
     * Roll random encounter based on terrain and danger
     */
    rollEncounter(hex) {
      const matching = WILDERNESS_ENCOUNTERS.filter(
        enc => enc.terrains.includes(hex.terrain) &&
               enc.dangerMin <= hex.dangerLevel &&
               enc.dangerMax >= hex.dangerLevel
      );

      if (matching.length === 0) return null;

      const encounter = matching[Math.floor(Math.random() * matching.length)];
      this.encounterHistory.push({ ...encounter, hex: `${hex.q},${hex.r}` });

      return encounter;
    }

    /**
     * Roll travel event
     */
    rollTravelEvent() {
      const event = TRAVEL_EVENTS[Math.floor(Math.random() * TRAVEL_EVENTS.length)];
      this.travelEventHistory.push(event);
      return event;
    }

    /**
     * Serialize exploration state
     */
    serialize() {
      const exploredArray = Array.from(this.exploredHexes);
      const revealedArray = Array.from(this.revealedHexes);

      return {
        partyPosition: this.partyPosition,
        movement: this.movement,
        exploredHexes: exploredArray,
        revealedHexes: revealedArray,
        encounterHistory: this.encounterHistory,
        travelEventHistory: this.travelEventHistory,
        timestamp: new Date().toISOString()
      };
    }

    /**
     * Deserialize exploration state
     */
    deserialize(data) {
      this.partyPosition = data.partyPosition;
      this.movement = data.movement;
      this.exploredHexes = new Set(data.exploredHexes);
      this.revealedHexes = new Set(data.revealedHexes);
      this.encounterHistory = data.encounterHistory;
      this.travelEventHistory = data.travelEventHistory;

      this.exploredHexes.forEach(key => {
        const hex = this.hexGrid.get(key);
        if (hex) hex.explored = true;
      });

      this.revealedHexes.forEach(key => {
        const hex = this.hexGrid.get(key);
        if (hex) hex.revealed = true;
      });

      return this;
    }

    /**
     * Reset movement to max (daily refresh)
     */
    resetDailyMovement() {
      this.movement = this.maxMovement;
    }

    /**
     * Add note to current hex
     */
    addNote(content) {
      const key = `${this.partyPosition.q},${this.partyPosition.r}`;
      const hex = this.hexGrid.get(key);
      if (hex) {
        hex.notes = content;
      }
    }

    /**
     * Get hex at coordinates
     */
    getHex(q, r) {
      return this.hexGrid.get(`${q},${r}`);
    }

    /**
     * Get stats
     */
    getStats() {
      return {
        exploredHexCount: this.exploredHexes.size,
        revealedHexCount: this.revealedHexes.size,
        totalEncounters: this.encounterHistory.length,
        totalTravelEvents: this.travelEventHistory.length,
        currentPosition: this.partyPosition,
        currentMovement: this.movement,
        maxMovement: this.maxMovement
      };
    }
  }

  // ============================================================================
  // EXPORTS
  // ============================================================================
  window.HexCrawlEngine = HexCrawlEngine;
  window.HEX_TERRAINS = HEX_TERRAINS;
  window.HEX_FEATURES = HEX_FEATURES;
  window.WILDERNESS_ENCOUNTERS = WILDERNESS_ENCOUNTERS;
  window.TRAVEL_EVENTS = TRAVEL_EVENTS;

})();
