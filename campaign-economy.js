/* ═══════════════════════════════════════════════════════════════════════════
   CAMPAIGN ECONOMY ENGINE — Deterministic trade, treasure, and supply systems
   Manages trade goods, regional markets, faction treasuries, and economic events
   for D&D campaign manager websites. Integrates with living-world.js events.
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  "use strict";

  // ─────────────────────────────────────────────────────────────────────
  // TRADE GOODS CATALOG (16 goods in 4 categories)
  // ─────────────────────────────────────────────────────────────────────

  const TRADE_GOODS = [
    // Raw Materials (6)
    {
      id: "iron-ore",
      name: "Iron Ore",
      category: "raw",
      basePrice: 15,
      icon: "⛏",
      volatility: 0.12,
      description: "Unrefined iron ore extracted from mountain mines",
      weight: 1
    },
    {
      id: "timber",
      name: "Timber",
      category: "raw",
      basePrice: 8,
      icon: "≡",
      volatility: 0.10,
      description: "Felled logs suitable for construction and fuel",
      weight: 2
    },
    {
      id: "stone",
      name: "Stone Blocks",
      category: "raw",
      basePrice: 5,
      icon: "◼",
      volatility: 0.08,
      description: "Quarried stone for building and masonry",
      weight: 3
    },
    {
      id: "grain",
      name: "Grain",
      category: "raw",
      basePrice: 2,
      icon: "⚌",
      volatility: 0.18,
      description: "Wheat, barley, and other staple crops",
      weight: 1
    },
    {
      id: "livestock",
      name: "Livestock",
      category: "raw",
      basePrice: 25,
      icon: "◬",
      volatility: 0.15,
      description: "Cattle, sheep, and other domesticated animals",
      weight: 0.5
    },
    {
      id: "furs",
      name: "Furs",
      category: "raw",
      basePrice: 18,
      icon: "◇",
      volatility: 0.14,
      description: "Pelts from hunting and trapping",
      weight: 0.5
    },

    // Refined Goods (4)
    {
      id: "steel",
      name: "Steel",
      category: "refined",
      basePrice: 35,
      icon: "⚔",
      volatility: 0.11,
      description: "High-quality forged steel ingots",
      weight: 1
    },
    {
      id: "cloth",
      name: "Cloth",
      category: "refined",
      basePrice: 12,
      icon: "⊸",
      volatility: 0.09,
      description: "Woven linen, wool, and cotton",
      weight: 1
    },
    {
      id: "leather",
      name: "Leather",
      category: "refined",
      basePrice: 20,
      icon: "◫",
      volatility: 0.12,
      description: "Treated and finished leather goods",
      weight: 1
    },
    {
      id: "ale-wine",
      name: "Ale & Wine",
      category: "refined",
      basePrice: 14,
      icon: "⌀",
      volatility: 0.13,
      description: "Fermented beverages for trade and consumption",
      weight: 1
    },

    // Luxury (4)
    {
      id: "gems",
      name: "Gems",
      category: "luxury",
      basePrice: 120,
      icon: "◆",
      volatility: 0.16,
      description: "Precious gemstones for nobility and magic",
      weight: 0.1
    },
    {
      id: "spices",
      name: "Spices",
      category: "luxury",
      basePrice: 60,
      icon: "⊕",
      volatility: 0.17,
      description: "Exotic spices from distant lands",
      weight: 0.5
    },
    {
      id: "silk",
      name: "Silk",
      category: "luxury",
      basePrice: 45,
      icon: "✦",
      volatility: 0.14,
      description: "Fine silk fabrics for the wealthy",
      weight: 0.5
    },
    {
      id: "arcane-components",
      name: "Arcane Components",
      category: "luxury",
      basePrice: 85,
      icon: "◎",
      volatility: 0.19,
      description: "Rare materials for spellcasting and enchantments",
      weight: 0.2
    },

    // Strategic (2)
    {
      id: "weapons",
      name: "Weapons",
      category: "strategic",
      basePrice: 50,
      icon: "†",
      volatility: 0.20,
      description: "Arms and armor for military use",
      weight: 1
    },
    {
      id: "warhorses",
      name: "Warhorses",
      category: "strategic",
      basePrice: 200,
      icon: "◇",
      volatility: 0.18,
      description: "Trained war-ready horses for cavalry",
      weight: 0.2
    }
  ];

  // ─────────────────────────────────────────────────────────────────────
  // REGION RESOURCE ASSIGNMENT (Deterministic seeded RNG)
  // ─────────────────────────────────────────────────────────────────────

  function mulberry32(seed) {
    return function() {
      seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function assignRegionResources(regions, seed) {
    const rng = mulberry32(seed || 42);
    const resourceMap = new Map();

    const typeResources = {
      mountain: ["iron-ore", "stone", "gems"],
      forest: ["timber", "furs", "stone"],
      plains: ["grain", "livestock", "timber"],
      coast: ["spices", "cloth", "ale-wine"],
      desert: ["gems", "spices", "stone"],
      swamp: ["furs", "leather", "ale-wine"],
      urban: ["steel", "weapons", "cloth"],
      magical: ["arcane-components", "gems", "spices"]
    };

    regions.forEach(region => {
      const type = (region.type || "plains").toLowerCase();
      const options = typeResources[type] || typeResources.plains;

      // Pick 2-4 goods for this region
      const numGoods = Math.floor(rng() * 3) + 2; // 2-4
      const shuffled = [...options];
      // Fisher-Yates shuffle
      for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var tmp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = tmp;
      }
      const selected = shuffled.slice(0, Math.min(numGoods, shuffled.length));

      // Add one "secondary" good from anywhere
      if (rng() > 0.4) {
        const allGoods = TRADE_GOODS.map(g => g.id);
        const extra = allGoods[Math.floor(rng() * allGoods.length)];
        if (!selected.includes(extra)) selected.push(extra);
      }

      resourceMap.set(region.id, selected);
    });

    return resourceMap;
  }

  // ─────────────────────────────────────────────────────────────────────
  // ECONOMY ENGINE CLASS
  // ─────────────────────────────────────────────────────────────────────

  class EconomyEngine {
    constructor(campaignData) {
      this.regions = campaignData.regions || [];
      this.factions = campaignData.factions || [];
      this.cities = campaignData.cities || [];
      this.tick = 0;

      // Markets: Map<regionId, Map<goodId, price>>
      this.markets = new Map();
      this.regionResources = assignRegionResources(this.regions, 42);

      // Initialize markets with base prices and random modifiers
      // Build lookup map for TRADE_GOODS to avoid .find() in inner loop
      const goodsById = new Map();
      TRADE_GOODS.forEach(g => goodsById.set(g.id, g));

      const rng = mulberry32(42);
      this.regions.forEach(region => {
        const regionMarket = new Map();
        const goods = this.regionResources.get(region.id) || [];
        goods.forEach(goodId => {
          const good = goodsById.get(goodId);
          if (good) {
            const modifier = 0.8 + rng() * 0.4; // 80-120% of base
            regionMarket.set(goodId, Math.round(good.basePrice * modifier));
          }
        });
        this.markets.set(region.id, regionMarket);
      });

      // Faction treasuries: Map<factionId, gold>
      this.treasuries = new Map();
      this.factions.forEach(faction => {
        this.treasuries.set(faction.id, (faction.power || 1) * 50);
      });

      // Trade routes: [{from, to, goods, profit, active}]
      this.tradeRoutes = [];

      // Supply/demand tracking per region per good
      this.supply = new Map(); // regionId -> goodId -> amount (0-100)
      this.regions.forEach(region => {
        const supplyMap = new Map();
        const regionGoods = this.regionResources.get(region.id);
        if (regionGoods) {
          regionGoods.forEach(goodId => {
            supplyMap.set(goodId, 50); // Start at 50 (balanced)
          });
        }
        this.supply.set(region.id, supplyMap);
      });

      // Event history for the UI ticker
      this.eventHistory = [];
    }

    /**
     * Primary update loop called once per living-world tick
     * Updates supply, demand, prices, and generates economic events
     */
    tick(data, rng, relations, warState) {
      const events = [];

      // ─ Phase 1: Produce goods (supply increases) ─
      this.regionResources.forEach((goods, regionId) => {
        const supplyMap = this.supply.get(regionId);
        goods.forEach(goodId => {
          const current = supplyMap.get(goodId) || 50;
          // Production: small increase each tick (base + random)
          const production = 2 + rng() * 3;
          supplyMap.set(goodId, Math.min(100, current + production));
        });
      });

      // ─ Phase 2: Update prices based on supply/demand ─
      this.markets.forEach((regionMarket, regionId) => {
        regionMarket.forEach((price, goodId) => {
          const good = TRADE_GOODS.find(g => g.id === goodId);
          if (!good) return; // Skip if good definition not found
          const supply = this.supply.get(regionId)?.get(goodId) || 50;

          // Price changes: high supply = lower prices, low supply = higher prices
          const supplyFactor = (100 - supply) / 100; // -0.5 to +0.5
          const volatility = good.volatility || 0.12;
          const change = (supplyFactor * 0.1 + (rng() - 0.5) * volatility);

          const newPrice = Math.max(1, Math.min(99999, Math.round(price * (1 + change))));
          regionMarket.set(goodId, newPrice);

          // Supply decreases due to consumption
          const consumption = 1 + rng() * 2;
          this.supply.get(regionId).set(goodId, Math.max(0, supply - consumption));
        });
      });

      // ─ Phase 3: Trade routes generate income ─
      this.tradeRoutes.forEach(route => {
        if (!route.active) return;

        const fromRegion = data.regions.find(r => r.id === route.from);
        const toRegion = data.regions.find(r => r.id === route.to);

        // Check if route is disrupted by war
        if (fromRegion?.state === "destroyed" || toRegion?.state === "destroyed") {
          route.active = false;
          return;
        }

        // Routes through contested regions have reduced profit
        let profitMult = 1.0;
        if (fromRegion?.state === "contested" || toRegion?.state === "contested") {
          profitMult = 0.6;
        }

        // Calculate profit from goods
        let routeProfit = 0;
        if (route.goods && Array.isArray(route.goods)) {
          route.goods.forEach(goodId => {
            const fromPrice = this.markets.get(route.from)?.get(goodId) || 1;
            const toPrice = this.markets.get(route.to)?.get(goodId) || 1;
            const margin = Math.max(0, toPrice - fromPrice);
            routeProfit += margin * 3; // Trade volume multiplier
          });
        }

        routeProfit = Math.round(routeProfit * profitMult);

        // Add to controlling faction's treasury
        if (fromRegion?.ctrl) {
          const current = this.treasuries.get(fromRegion.ctrl) || 0;
          this.treasuries.set(fromRegion.ctrl, current + routeProfit);
        }
      });

      // ─ Phase 4: Faction spending (military or development) ─
      if (data.factions && Array.isArray(data.factions)) {
        data.factions.forEach(faction => {
          if (!faction.id) return;
          const treasury = this.treasuries.get(faction.id) || 0;
          if (treasury < 10) return;

          // Check if faction is at war
          const isAtWar = data.regions?.some(r => r.ctrl === faction.id && r.state === "contested");

          if (isAtWar) {
            // Spend on military: 15-25% of treasury per tick
            const spend = Math.round(treasury * (0.15 + rng() * 0.1));
            this.treasuries.set(faction.id, treasury - spend);
          } else {
            // Spend on development: 5-10% per tick
            const spend = Math.round(treasury * (0.05 + rng() * 0.05));
            this.treasuries.set(faction.id, treasury - spend);
          }
        });
      }

      // ─ Phase 5: Generate economic events ─
      const eventOptions = ECONOMY_EVENTS.map(ev => ({ item: ev, weight: ev.weight || 1 }));
      if (eventOptions.length > 0) {
        const totalWeight = eventOptions.reduce((s, o) => s + o.weight, 0);
        let r = rng() * totalWeight;
        for (const o of eventOptions) {
          r -= o.weight;
          if (r <= 0) {
            const result = o.item.apply(data, rng, relations, this);
            if (result && result.headline) {
              events.push({
                id: o.item.id,
                ...result,
                economyMutation: result.economyMutation
              });
            }
            break;
          }
        }
      }

      this.tick++;

      return {
        markets: this.markets,
        treasuries: this.treasuries,
        tradeRoutes: this.tradeRoutes,
        tradeEvents: events
      };
    }

    /**
     * Get current market data for a region
     */
    getMarketData(regionName) {
      const region = this.regions.find(r => r.name === regionName);
      if (!region) return null;

      const regionMarket = this.markets.get(region.id);
      if (!regionMarket) return null;

      const goods = [];
      regionMarket.forEach((price, goodId) => {
        const good = TRADE_GOODS.find(g => g.id === goodId);
        if (good) {
          goods.push({
            ...good,
            currentPrice: price,
            supply: this.supply.get(region.id)?.get(goodId) || 50
          });
        }
      });

      return { region: regionName, goods };
    }

    /**
     * Get faction wealth summary
     */
    getFactionWealth(factionName) {
      const faction = this.factions.find(f => f.name === factionName);
      if (!faction) return null;

      const treasury = this.treasuries.get(faction.id) || 0;

      // Calculate trade income from routes controlled
      let tradeIncomePerTick = 0;
      this.tradeRoutes.forEach(route => {
        if (route.active) {
          const fromRegion = this.regions.find(r => r.id === route.from);
          if (fromRegion?.ctrl === factionName) {
            tradeIncomePerTick += route.profit || 0;
          }
        }
      });

      return {
        faction: factionName,
        treasury,
        tradeIncomePerTick,
        totalWealth: treasury + (tradeIncomePerTick * 10)
      };
    }

    /**
     * Establish a new trade route (if factions are friendly)
     */
    establishTradeRoute(fromRegionId, toRegionId, goods, relations) {
      const fromRegion = this.regions.find(r => r.id === fromRegionId);
      const toRegion = this.regions.find(r => r.id === toRegionId);

      if (!fromRegion || !toRegion) return false;

      // Check if factions controlling regions are friendly
      if (relations && fromRegion.ctrl && toRegion.ctrl) {
        const relation = relations.getRelation(fromRegion.ctrl, toRegion.ctrl);
        if (relation < -20) return false; // Too hostile
      }

      // Calculate profit
      let profit = 0;
      if (goods && Array.isArray(goods)) {
        goods.forEach(goodId => {
          const fromPrice = this.markets.get(fromRegionId)?.get(goodId) || 1;
          const toPrice = this.markets.get(toRegionId)?.get(goodId) || 1;
          profit += Math.max(0, toPrice - fromPrice);
        });
      }

      this.tradeRoutes.push({
        from: fromRegionId,
        to: toRegionId,
        goods,
        profit: Math.round(profit),
        active: true
      });

      return true;
    }

    /**
     * Blockade a region, cutting off trade and spiking prices
     */
    blockadeRegion(regionName) {
      const region = this.regions.find(r => r.name === regionName);
      if (!region) return false;

      // Deactivate all routes through this region
      this.tradeRoutes.forEach(route => {
        if (route.from === region.id || route.to === region.id) {
          route.active = false;
        }
      });

      // Spike prices due to scarcity
      const regionMarket = this.markets.get(region.id);
      if (regionMarket) {
        regionMarket.forEach((price, goodId) => {
          regionMarket.set(goodId, Math.round(price * 1.5));
        });
      }

      // Reduce supply (blockade prevents production)
      const supplyMap = this.supply.get(region.id);
      if (supplyMap) {
        supplyMap.forEach((supply, goodId) => {
          supplyMap.set(goodId, Math.max(0, supply - 20));
        });
      }

      return true;
    }

    /**
     * Get a summary of the entire economy state
     */
    getEconomySummary() {
      let totalTreasure = 0;
      let totalTradeRoutes = 0;
      let activeRoutes = 0;

      this.treasuries.forEach(gold => (totalTreasure += gold));
      this.tradeRoutes.forEach(route => {
        totalTradeRoutes++;
        if (route.active) activeRoutes++;
      });

      // Calculate average prices by category (optimized: iterate markets once, collect prices)
      const pricesByGood = new Map(); // good.id -> { prices: [], category }
      TRADE_GOODS.forEach(good => {
        pricesByGood.set(good.id, { prices: [], category: good.category, name: good.name });
      });

      this.markets.forEach(regionMarket => {
        regionMarket.forEach((price, goodId) => {
          const goodData = pricesByGood.get(goodId);
          if (goodData) goodData.prices.push(price);
        });
      });

      const categoryPrices = {};
      pricesByGood.forEach(({ prices, category, name }) => {
        if (prices.length > 0) {
          const avg = Math.round(prices.reduce((a, b) => a + b) / prices.length);
          if (!categoryPrices[category]) categoryPrices[category] = [];
          categoryPrices[category].push({ good: name, avg });
        }
      });

      return {
        totalTreasure: Math.round(totalTreasure),
        factionCount: this.treasuries.size,
        tradeRoutes: { total: totalTradeRoutes, active: activeRoutes },
        categoryPrices,
        ticks: this.tick
      };
    }

    /**
     * Serialize economy state for persistence
     */
    serialize() {
      const marketsData = [];
      const treasuriesData = [];
      const supplyData = [];

      this.markets.forEach((regionMarket, regionId) => {
        const goods = [];
        regionMarket.forEach((price, goodId) => {
          goods.push({ goodId, price });
        });
        marketsData.push({ regionId, goods });
      });

      this.treasuries.forEach((gold, factionId) => {
        treasuriesData.push({ factionId, gold });
      });

      this.supply.forEach((supplyMap, regionId) => {
        const goods = [];
        supplyMap.forEach((amount, goodId) => {
          goods.push({ goodId, amount });
        });
        supplyData.push({ regionId, goods });
      });

      return {
        markets: marketsData,
        treasuries: treasuriesData,
        supply: supplyData,
        tradeRoutes: this.tradeRoutes,
        tick: this.tick
      };
    }

    /**
     * Deserialize economy state from persistence
     */
    deserialize(data) {
      if (!data) return;

      this.markets.clear();
      if (data.markets) {
        data.markets.forEach(({ regionId, goods }) => {
          const regionMarket = new Map();
          goods.forEach(({ goodId, price }) => {
            regionMarket.set(goodId, price);
          });
          this.markets.set(regionId, regionMarket);
        });
      }

      this.treasuries.clear();
      if (data.treasuries) {
        data.treasuries.forEach(({ factionId, gold }) => {
          this.treasuries.set(factionId, gold);
        });
      }

      this.supply.clear();
      if (data.supply) {
        data.supply.forEach(({ regionId, goods }) => {
          const supplyMap = new Map();
          goods.forEach(({ goodId, amount }) => {
            supplyMap.set(goodId, amount);
          });
          this.supply.set(regionId, supplyMap);
        });
      }

      if (data.tradeRoutes) this.tradeRoutes = data.tradeRoutes;
      if (data.tick) this.tick = data.tick;
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // ECONOMIC EVENTS (living-world.js pattern)
  // ─────────────────────────────────────────────────────────────────────

  const ECONOMY_EVENTS = [
    {
      id: "trade_boom",
      weight: 2,
      apply: (data, rng, relations, economy) => {
        if (!data.regions || !economy) return null;
        const candidates = data.regions.filter(r => r.state === "stable");
        if (!candidates.length) return null;

        const region = candidates[Math.floor(rng() * candidates.length)];
        const goods = economy.regionResources.get(region.id) || [];
        if (!goods.length) return null;

        const goodId = goods[Math.floor(rng() * goods.length)];
        const good = TRADE_GOODS.find(g => g.id === goodId);
        if (!good) return null;

        const currentPrice = economy.markets.get(region.id)?.get(goodId) || good.basePrice;
        const boomedPrice = Math.round(currentPrice * 1.4);

        return {
          headline: `${good.name} Boom in ${region.name}`,
          detail: `Sudden demand surge for ${good.name}! Prices in ${region.name} spike from ${currentPrice} to ${boomedPrice} gold per unit.`,
          category: "economic",
          icon: "▲",
          importance: "standard",
          mutations: d => d,
          economyMutation: (eco) => {
            const market = eco.markets.get(region.id);
            if (market) market.set(goodId, boomedPrice);
          }
        };
      }
    },

    {
      id: "trade_bust",
      weight: 2,
      apply: (data, rng, relations, economy) => {
        if (!data.regions || !economy) return null;
        const candidates = data.regions.filter(r => r.state === "stable");
        if (!candidates.length) return null;

        const region = candidates[Math.floor(rng() * candidates.length)];
        const goods = economy.regionResources.get(region.id) || [];
        if (!goods.length) return null;

        const goodId = goods[Math.floor(rng() * goods.length)];
        const good = TRADE_GOODS.find(g => g.id === goodId);
        if (!good) return null;

        const currentPrice = economy.markets.get(region.id)?.get(goodId) || good.basePrice;
        const crashedPrice = Math.max(1, Math.round(currentPrice * 0.5));

        return {
          headline: `Oversupply Crashes ${good.name} Market`,
          detail: `Too much ${good.name} flooding the market in ${region.name}! Prices plummet from ${currentPrice} to ${crashedPrice} gold per unit.`,
          category: "economic",
          icon: "▼",
          importance: "standard",
          mutations: d => d,
          economyMutation: (eco) => {
            const market = eco.markets.get(region.id);
            if (market) market.set(goodId, crashedPrice);
          }
        };
      }
    },

    {
      id: "merchant_caravan",
      weight: 3,
      apply: (data, rng, relations, economy) => {
        if (!data.regions || data.regions.length < 2 || !economy) return null;

        const regions = data.regions.filter(r => r.state !== "destroyed");
        if (regions.length < 2) return null;

        const regionIndices = [Math.floor(rng() * regions.length), Math.floor(rng() * regions.length)];
        if (regionIndices[0] === regionIndices[1]) return null;

        const fromRegion = regions[regionIndices[0]];
        const toRegion = regions[regionIndices[1]];

        const goods = economy.regionResources.get(fromRegion.id) || [];
        if (!goods.length) return null;

        const goodsToTrade = goods.slice(0, Math.min(2, goods.length));
        const goodNames = goodsToTrade
          .map(gid => TRADE_GOODS.find(g => g.id === gid)?.name)
          .filter(Boolean)
          .join(", ");

        return {
          headline: `Merchant Caravan Departs ${fromRegion.name}`,
          detail: `A lucrative caravan carrying ${goodNames} is headed to ${toRegion.name}. Savvy traders can profit from regional price differences!`,
          category: "economic",
          icon: "◈",
          importance: "standard",
          mutations: d => d,
          economyMutation: (eco) => {
            eco.establishTradeRoute(fromRegion.id, toRegion.id, goodsToTrade, relations);
          }
        };
      }
    },

    {
      id: "pirate_raid",
      weight: 2,
      apply: (data, rng, relations, economy) => {
        if (!data.regions || !economy) return null;

        const candidates = data.regions.filter(r => r.type === "coast" || r.name.includes("Port"));
        if (!candidates.length) return null;

        const region = candidates[Math.floor(rng() * candidates.length)];

        return {
          headline: `Pirates Attack Trade in ${region.name}`,
          detail: `Notorious sea pirates have struck a major trading post in ${region.name}, disrupting shipments and terrorizing merchants.`,
          category: "economic",
          icon: "⚑",
          importance: "major",
          mutations: d => d,
          economyMutation: (eco) => {
            // Deactivate routes through this coastal region
            eco.tradeRoutes = eco.tradeRoutes.map(route => {
              if (route.from === region.id || route.to === region.id) {
                return { ...route, active: false };
              }
              return route;
            });
          }
        };
      }
    },

    {
      id: "new_resource_discovered",
      weight: 2,
      apply: (data, rng, relations, economy) => {
        if (!data.regions || !economy) return null;

        const region = data.regions[Math.floor(rng() * data.regions.length)];
        if (!region) return null;

        const current = economy.regionResources.get(region.id) || [];
        const available = TRADE_GOODS.filter(g => !current.includes(g.id));
        if (!available.length) return null;

        const newGood = available[Math.floor(rng() * available.length)];

        return {
          headline: `New Deposit of ${newGood.name} Found in ${region.name}`,
          detail: `Prospectors have discovered a rich deposit of ${newGood.name} in ${region.name}. This could boost the region's economy!`,
          category: "economic",
          icon: "⛏",
          importance: "major",
          mutations: d => d,
          economyMutation: (eco) => {
            let resources = eco.regionResources.get(region.id);
            if (!resources) {
              resources = [];
              eco.regionResources.set(region.id, resources);
            }
            if (!resources.includes(newGood.id)) {
              resources.push(newGood.id);
            }
            // Initialize market and supply for new good
            let regionMarket = eco.markets.get(region.id);
            if (!regionMarket) {
              regionMarket = new Map();
              eco.markets.set(region.id, regionMarket);
            }
            regionMarket.set(newGood.id, newGood.basePrice);

            let supplyMap = eco.supply.get(region.id);
            if (!supplyMap) {
              supplyMap = new Map();
              eco.supply.set(region.id, supplyMap);
            }
            supplyMap.set(newGood.id, 30);
          }
        };
      }
    },

    {
      id: "economic_sanctions",
      weight: 2,
      apply: (data, rng, relations, economy) => {
        if (!data.factions || !data.regions || data.factions.length < 2) return null;

        const factions = data.factions.filter(f => f.rivals && f.rivals.length > 0);
        if (!factions.length) return null;

        const sanctioner = factions[Math.floor(rng() * factions.length)];
        const target = sanctioner.rivals[Math.floor(rng() * sanctioner.rivals.length)];
        if (!target) return null;

        return {
          headline: `${sanctioner.name} Imposes Trade Embargo on ${target}`,
          detail: `In a bold economic move, the ${sanctioner.name} has cut off all trade with the ${target}. Expect prices to skyrocket in ${target} territories!`,
          category: "economic",
          icon: "⊘",
          importance: "major",
          mutations: d => d,
          economyMutation: (eco) => {
            // Deactivate routes between these factions' regions
            eco.tradeRoutes = eco.tradeRoutes.map(route => {
              const fromCtrl = data.regions.find(r => r.id === route.from)?.ctrl;
              const toCtrl = data.regions.find(r => r.id === route.to)?.ctrl;

              if (
                (fromCtrl === sanctioner.id && toCtrl === target) ||
                (fromCtrl === target && toCtrl === sanctioner.id)
              ) {
                return { ...route, active: false };
              }
              return route;
            });
          }
        };
      }
    },

    {
      id: "market_manipulation",
      weight: 2,
      apply: (data, rng, relations, economy) => {
        if (!data.regions || !economy) return null;

        const region = data.regions[Math.floor(rng() * data.regions.length)];
        if (!region) return null;

        const goods = economy.regionResources.get(region.id) || [];
        if (!goods.length) return null;

        const goodId = goods[Math.floor(rng() * goods.length)];
        const good = TRADE_GOODS.find(g => g.id === goodId);
        if (!good) return null;

        const manipulated = rng() > 0.5 ? "inflated" : "deflated";
        const manipFactor = manipulated === "inflated" ? 1.6 : 0.4;

        return {
          headline: `${good.name} Price ${manipulated === "inflated" ? "Inflated" : "Deflated"} in ${region.name}`,
          detail: `Merchants with deep pockets are artificially ${manipulated} the price of ${good.name} in ${region.name} for profit!`,
          category: "economic",
          icon: manipulated === "inflated" ? "≡" : "◆",
          importance: "standard",
          mutations: d => d,
          economyMutation: (eco) => {
            const market = eco.markets.get(region.id);
            if (market) {
              const current = market.get(goodId) || good.basePrice;
              market.set(goodId, Math.round(current * manipFactor));
            }
          }
        };
      }
    },

    {
      id: "famine",
      weight: 1,
      apply: (data, rng, relations, economy) => {
        if (!data.regions || !economy) return null;

        const region = data.regions[Math.floor(rng() * data.regions.length)];
        if (!region) return null;

        const grainGood = TRADE_GOODS.find(g => g.id === "grain");
        const grainPrice = economy.markets.get(region.id)?.get("grain") || (grainGood?.basePrice || 2);
        const faminePrices = Math.round(grainPrice * 3.5);

        return {
          headline: `Famine Strikes ${region.name}`,
          detail: `Crop failure and food shortages plague ${region.name}. Grain prices have tripled, and peasants go hungry as traders hoard supplies.`,
          category: "economic",
          icon: "⚌",
          importance: "critical",
          mutations: d => d,
          economyMutation: (eco) => {
            const market = eco.markets.get(region.id);
            if (market) market.set("grain", faminePrices);
            const supplyMap = eco.supply.get(region.id);
            if (supplyMap) supplyMap.set("grain", 5);
          }
        };
      }
    }
  ];

  // ─────────────────────────────────────────────────────────────────────
  // EXPORTS
  // ─────────────────────────────────────────────────────────────────────

  window.EconomyEngine = EconomyEngine;
  window.TRADE_GOODS = TRADE_GOODS;
  window.ECONOMY_EVENTS = ECONOMY_EVENTS;
  window.assignRegionResources = assignRegionResources;

  // For debugging
  if (typeof window.PHMURT_DEBUG === "boolean" && window.PHMURT_DEBUG) {
    console.log("[economy] EconomyEngine loaded with", TRADE_GOODS.length, "goods and", ECONOMY_EVENTS.length, "event types");
  }
})();
