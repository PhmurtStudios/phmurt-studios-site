// ═══════════════════════════════════════════════════════════════════════════
// CAMPAIGN SEASONS, CALENDAR & WEATHER SYSTEM
// D&D Campaign Manager Module
// ═══════════════════════════════════════════════════════════════════════════

window.CampaignSeasons = (function(){

  // ═══════════════════════════════════════════════════════════════════════════
  // FANTASY CALENDAR METADATA
  // ═══════════════════════════════════════════════════════════════════════════

  const FANTASY_CALENDAR = {
    seasons: [
      { id: 'verdance', name: 'Verdance', season: 'Spring', color: '#2ecc71', description: 'Season of renewal and growth' },
      { id: 'solstice', name: 'Solstice', season: 'Summer', color: '#f39c12', description: 'Season of light and heat' },
      { id: 'harvest', name: 'Harvest', season: 'Autumn', color: '#e67e22', description: 'Season of abundance and change' },
      { id: 'frostfall', name: 'Frostfall', season: 'Winter', color: '#3498db', description: 'Season of cold and darkness' }
    ],
    months: [
      // Verdance (Spring)
      { name: 'Thawmist', season: 'verdance', num: 1 },
      { name: 'Bloomsreach', season: 'verdance', num: 2 },
      { name: 'Seedswell', season: 'verdance', num: 3 },
      // Solstice (Summer)
      { name: 'Sunsheight', season: 'solstice', num: 4 },
      { name: 'Goldfire', season: 'solstice', num: 5 },
      { name: 'Highsun', season: 'solstice', num: 6 },
      // Harvest (Autumn)
      { name: 'Amberfall', season: 'harvest', num: 7 },
      { name: 'Grainmoon', season: 'harvest', num: 8 },
      { name: 'Rustleaf', season: 'harvest', num: 9 },
      // Frostfall (Winter)
      { name: 'Dimhallow', season: 'frostfall', num: 10 },
      { name: 'Snowveil', season: 'frostfall', num: 11 },
      { name: 'Deepwinter', season: 'frostfall', num: 12 }
    ],
    dayNames: ['Moonday', 'Tideday', 'Windday', 'Flameday', 'Earthday', 'Starday'],
    daysPerMonth: 30,
    monthsPerSeason: 3,
    seasonsPerYear: 4,
    daysPerYear: 360
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SEASONAL EVENTS TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════════

  const SEASONAL_EVENTS = {
    first_frost: {
      name: 'First Frost',
      season: 'frostfall',
      headline: 'The First Frost descends upon the land',
      detail: 'Temperatures plummet as winter makes its appearance. Rivers begin to freeze at their edges.',
      category: 'weather',
      icon: '✧',
      importance: 'major',
      mutations: { frostfall_power: 15, movement_penalty: 0.1 },
      calendarEffect: { winter_begins: true }
    },
    spring_thaw: {
      name: 'Spring Thaw',
      season: 'verdance',
      headline: 'The Spring Thaw awakens the world',
      detail: 'Snow melts rapidly, swelling rivers and streams. Flooding is common in low-lying areas.',
      category: 'environmental',
      icon: '≈',
      importance: 'major',
      mutations: { verdance_power: 20, flooding_risk: true },
      calendarEffect: { spring_begins: true }
    },
    harvest_festival: {
      name: 'Harvest Festival',
      season: 'harvest',
      headline: 'The Harvest Festival commences',
      detail: 'Communities gather to celebrate the season of plenty. Trade flourishes and spirits are high.',
      category: 'cultural',
      icon: '⚌',
      importance: 'major',
      mutations: { harvest_power: 25, trade_bonus: 0.3 },
      calendarEffect: { harvest_season: true }
    },
    midsummer_celebration: {
      name: 'Midsummer Celebration',
      season: 'solstice',
      headline: 'The Midsummer Celebration brings revelry',
      detail: 'The longest day arrives. Festivals light fires, bards sing, and magic feels strongest.',
      category: 'cultural',
      icon: '⟡',
      importance: 'major',
      mutations: { solstice_power: 20, magic_surge: true },
      calendarEffect: { midsummer: true }
    },
    drought: {
      name: 'Drought',
      season: 'solstice',
      headline: 'Severe drought grips the southern lands',
      detail: 'Crops wither, wells run dry, and water becomes precious. Prices for grain skyrocket.',
      category: 'environmental',
      icon: '✦',
      importance: 'severe',
      mutations: { water_prices: 2.0, crop_yield: 0.5, unrest: 0.2 },
      calendarEffect: { drought: true }
    },
    flood: {
      name: 'Flood',
      season: 'verdance',
      headline: 'Catastrophic floods sweep through the valleys',
      detail: 'Rivers overflow their banks. Villages are threatened and trade routes become impassable.',
      category: 'environmental',
      icon: '≈',
      importance: 'severe',
      mutations: { travel_blocked: true, unrest: 0.3, damage: 0.2 },
      calendarEffect: { flood: true }
    },
    unseasonable_cold: {
      name: 'Unseasonable Cold',
      season: 'solstice',
      headline: 'Unseasonable cold strikes during summer',
      detail: 'Unexpected frosts damage crops and confuse wildlife. People huddle in unusual times.',
      category: 'weather',
      icon: '✧',
      importance: 'moderate',
      mutations: { crop_yield: 0.7, unrest: 0.1 },
      calendarEffect: {}
    },
    perfect_growing_season: {
      name: 'Perfect Growing Season',
      season: 'verdance',
      headline: 'The perfect growing season arrives',
      detail: 'Weather, rain, and sun align perfectly. Crops flourish beyond expectation.',
      category: 'environmental',
      icon: '❦',
      importance: 'major',
      mutations: { crop_yield: 1.5, prosperity: 0.2 },
      calendarEffect: { abundance: true }
    },
    eclipse: {
      name: 'Arcane Eclipse',
      season: null, // Can occur any season
      headline: 'The moons align in an Arcane Eclipse',
      detail: 'Reality shivers as the moons pass. Magical energies surge wildly across the world.',
      category: 'arcane',
      icon: '☽',
      importance: 'severe',
      mutations: { wild_magic: true, magic_surge: 0.5, planar_breach: true },
      calendarEffect: { eclipse: true }
    },
    blood_moon: {
      name: 'Blood Moon',
      season: null, // Can occur any season
      headline: 'The Blood Moon rises in the sky',
      detail: 'The moon turns red. Undead stir from their rest, and evil things grow bold.',
      category: 'supernatural',
      icon: '☾',
      importance: 'severe',
      mutations: { undead_activity: 2.0, evil_power: 0.3, unrest: 0.2 },
      calendarEffect: { blood_moon: true }
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CLIMATE SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════

  const CLIMATE_TYPES = {
    arctic: { name: 'Arctic', baseWeathers: ['Clear', 'Cloudy', 'Snow', 'Blizzard', 'Fog'] },
    temperate: { name: 'Temperate', baseWeathers: ['Clear', 'Cloudy', 'Light Rain', 'Fog'] },
    tropical: { name: 'Tropical', baseWeathers: ['Clear', 'Cloudy', 'Heavy Rain', 'Thunderstorm', 'Heatwave'] },
    arid: { name: 'Arid', baseWeathers: ['Clear', 'Heatwave', 'Sandstorm', 'Fog'] },
    coastal: { name: 'Coastal', baseWeathers: ['Clear', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Thunderstorm', 'Fog'] },
    mountain: { name: 'Mountain', baseWeathers: ['Clear', 'Cloudy', 'Fog', 'Snow', 'Thunderstorm'] }
  };

  const WEATHER_STATES = {
    Clear: { icon: '✦', visibility: 'excellent', hazard: false, effects: [] },
    Cloudy: { icon: '◌', visibility: 'good', hazard: false, effects: [] },
    'Light Rain': { icon: '⏐', visibility: 'fair', hazard: false, effects: ['ground_wet'] },
    'Heavy Rain': { icon: '⏐', visibility: 'poor', hazard: true, effects: ['movement_slow', 'ranged_disadvantage'] },
    Thunderstorm: { icon: '↯', visibility: 'very_poor', hazard: true, effects: ['movement_slow', 'ranged_disadvantage', 'metal_danger', 'fire_damage_up'] },
    Fog: { icon: '≡', visibility: 'very_poor', hazard: false, effects: ['stealth_advantage', 'ranged_disadvantage'] },
    Snow: { icon: '✧', visibility: 'poor', hazard: true, effects: ['movement_slow', 'cold_damage'] },
    Blizzard: { icon: '◇', visibility: 'none', hazard: true, effects: ['movement_halved', 'ranged_disadvantage', 'cold_damage_severe'] },
    Heatwave: { icon: '⟡', visibility: 'excellent', hazard: true, effects: ['con_saves', 'heat_damage'] },
    Sandstorm: { icon: '∿', visibility: 'poor', hazard: true, effects: ['movement_slow', 'ranged_disadvantage', 'sand_damage'] }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // CALENDAR TRACKER CLASS
  // ═══════════════════════════════════════════════════════════════════════════

  function CalendarTracker(startDay, startMonth, startYear) {
    this.day = startDay || 1;
    this.month = startMonth || 1;
    this.year = startYear || 1000;
    this.dayOfWeek = 0; // 0-5 for 6-day week
    this.eventLog = [];
  }

  CalendarTracker.prototype.advance = function(days) {
    days = Math.max(0, parseInt(days) || 0);
    for (var i = 0; i < days; i++) {
      this.day++;
      this.dayOfWeek = (this.dayOfWeek + 1) % FANTASY_CALENDAR.dayNames.length;

      if (this.day > FANTASY_CALENDAR.daysPerMonth) {
        this.day = 1;
        this.month++;

        if (this.month > FANTASY_CALENDAR.months.length) {
          this.month = 1;
          this.year++;
        }
      }
    }
  };

  CalendarTracker.prototype.getDateString = function() {
    var monthObj = FANTASY_CALENDAR.months[this.month - 1];
    var monthName = monthObj ? monthObj.name : 'Unknown';
    var dayName = FANTASY_CALENDAR.dayNames[this.dayOfWeek];
    var suffix = this._getDaySuffix(this.day);
    return dayName + ', ' + this.day + suffix + ' of ' + monthName + ', Year ' + this.year;
  };

  CalendarTracker.prototype._getDaySuffix = function(day) {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  CalendarTracker.prototype.getSeason = function() {
    var monthObj = FANTASY_CALENDAR.months[this.month - 1];
    if (!monthObj) return null;
    var seasonId = monthObj.season;
    return FANTASY_CALENDAR.seasons.find(function(s) { return s.id === seasonId; });
  };

  CalendarTracker.prototype.getMonth = function() {
    return FANTASY_CALENDAR.months[this.month - 1] || null;
  };

  CalendarTracker.prototype.getDayOfYear = function() {
    return (this.month - 1) * FANTASY_CALENDAR.daysPerMonth + this.day;
  };

  CalendarTracker.prototype.getDaysSince = function(otherDate) {
    if (!otherDate) return 0;

    var thisDayOfYear = this.getDayOfYear() + (this.year * FANTASY_CALENDAR.daysPerYear);
    var otherDayOfYear = (otherDate.month - 1) * FANTASY_CALENDAR.daysPerMonth + otherDate.day +
                         (otherDate.year * FANTASY_CALENDAR.daysPerYear);

    return Math.max(0, thisDayOfYear - otherDayOfYear);
  };

  CalendarTracker.prototype.serialize = function() {
    return {
      day: this.day,
      month: this.month,
      year: this.year,
      dayOfWeek: this.dayOfWeek,
      eventLog: this.eventLog.slice()
    };
  };

  CalendarTracker.prototype.deserialize = function(data) {
    if (!data) return;
    this.day = data.day || 1;
    this.month = data.month || 1;
    this.year = data.year || 1000;
    this.dayOfWeek = data.dayOfWeek || 0;
    this.eventLog = data.eventLog ? data.eventLog.slice() : [];
  };

  CalendarTracker.prototype.logEvent = function(event) {
    this.eventLog.push({
      date: this.getDateString(),
      event: event,
      timestamp: Date.now()
    });
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // WEATHER ENGINE CLASS
  // ═══════════════════════════════════════════════════════════════════════════

  function WeatherEngine(seed) {
    this.seed = seed || 42;
    this.rng = mulberry32(this.seed);
    this.regionWeather = new Map();
    this.weatherHistory = new Map();
  }

  WeatherEngine.prototype._initRegionWeather = function(regionId, climate) {
    if (!this.regionWeather.has(regionId)) {
      var climateData = CLIMATE_TYPES[climate] || CLIMATE_TYPES.temperate;
      var initialWeather = climateData.baseWeathers[Math.floor(this.rng() * climateData.baseWeathers.length)];
      this.regionWeather.set(regionId, {
        current: initialWeather,
        climate: climate,
        duration: 1 + Math.floor(this.rng() * 5),
        durationRemaining: 1
      });
    }
  };

  WeatherEngine.prototype._getWeatherTransitions = function(current, climate, season) {
    var climateData = CLIMATE_TYPES[climate] || CLIMATE_TYPES.temperate;
    var baseOptions = climateData.baseWeathers.slice();
    var seasonMod = {};

    // Seasonal modifiers
    if (season === 'verdance') seasonMod = { 'Light Rain': 0.6, 'Heavy Rain': 0.5, 'Clear': 0.3 };
    else if (season === 'solstice') seasonMod = { 'Heatwave': 0.7, 'Clear': 0.5, 'Heavy Rain': 0.2 };
    else if (season === 'harvest') seasonMod = { 'Clear': 0.4, 'Cloudy': 0.4, 'Light Rain': 0.3 };
    else if (season === 'frostfall') seasonMod = { 'Snow': 0.6, 'Blizzard': 0.4, 'Clear': 0.2 };

    // Build weighted transition table
    var weights = {};
    baseOptions.forEach(function(w) {
      weights[w] = 0.3; // Base weight for any weather
    });

    // Current weather has 40% chance to persist
    weights[current] = (weights[current] || 0) + 0.4;

    // Apply season modifiers
    Object.keys(seasonMod).forEach(function(w) {
      if (weights[w] !== undefined) weights[w] += seasonMod[w];
    });

    return weights;
  };

  WeatherEngine.prototype._rollWeather = function(current, climate, season) {
    var transitions = this._getWeatherTransitions(current, climate, season);
    var roll = this.rng();
    var cumulative = 0;

    var weathers = Object.keys(transitions);
    for (var i = 0; i < weathers.length; i++) {
      cumulative += transitions[weathers[i]];
      if (roll <= cumulative) return weathers[i];
    }

    return current;
  };

  WeatherEngine.prototype.advanceDay = function(regions, calendar) {
    var results = [];
    var season = calendar.getSeason();
    var seasonId = season ? season.id : 'verdance';

    regions.forEach(function(region) {
      var climateType = this._determineClimate(region);
      this._initRegionWeather(region.id, climateType);

      var weatherData = this.regionWeather.get(region.id);
      weatherData.durationRemaining--;

      if (weatherData.durationRemaining <= 0) {
        var newWeather = this._rollWeather(weatherData.current, climateType, seasonId);
        weatherData.current = newWeather;
        weatherData.duration = 1 + Math.floor(this.rng() * 7);
        weatherData.durationRemaining = weatherData.duration;
      }

      var histKey = region.id + '_' + calendar.getDateString();
      if (!this.weatherHistory.has(histKey)) {
        this.weatherHistory.set(histKey, {
          weather: weatherData.current,
          date: calendar.getDateString(),
          regionId: region.id,
          regionName: region.name
        });
      }

      results.push({
        regionId: region.id,
        regionName: region.name,
        weather: weatherData.current,
        icon: WEATHER_STATES[weatherData.current] ? WEATHER_STATES[weatherData.current].icon : '?',
        hazard: WEATHER_STATES[weatherData.current] ? WEATHER_STATES[weatherData.current].hazard : false
      });
    }, this);

    return results;
  };

  WeatherEngine.prototype.getCurrentWeather = function(regionId) {
    var weatherData = this.regionWeather.get(regionId);
    if (!weatherData) return null;

    var state = WEATHER_STATES[weatherData.current];
    return {
      weather: weatherData.current,
      climate: weatherData.climate,
      icon: state ? state.icon : '?',
      visibility: state ? state.visibility : 'unknown',
      hazard: state ? state.hazard : false,
      effects: state ? state.effects.slice() : [],
      duration: weatherData.durationRemaining + ' day' + (weatherData.durationRemaining === 1 ? '' : 's')
    };
  };

  WeatherEngine.prototype.getForecast = function(regionId, days) {
    days = Math.min(Math.max(1, days || 3), 14);
    var current = this.regionWeather.get(regionId);
    if (!current) return [];

    var forecast = [];
    var testWeather = current.current;
    var climate = current.climate;

    for (var i = 0; i < days; i++) {
      var state = WEATHER_STATES[testWeather];
      forecast.push({
        day: i + 1,
        weather: testWeather,
        icon: state ? state.icon : '?',
        confidence: Math.max(50, 100 - (i * 8)) + '%',
        hazard: state ? state.hazard : false
      });

      // Rough simulation for forecast
      if (i < days - 1) {
        var rand = this.rng();
        if (rand < 0.4) {
          // Keep same weather
        } else {
          var climateData = CLIMATE_TYPES[climate] || CLIMATE_TYPES.temperate;
          testWeather = climateData.baseWeathers[Math.floor(this.rng() * climateData.baseWeathers.length)];
        }
      }
    }

    return forecast;
  };

  WeatherEngine.prototype._determineClimate = function(region) {
    if (!region.type) return 'temperate';
    var t = region.type.toLowerCase();
    if (t.includes('arctic') || t.includes('frozen')) return 'arctic';
    if (t.includes('desert') || t.includes('arid')) return 'arid';
    if (t.includes('tropical') || t.includes('jungle')) return 'tropical';
    if (t.includes('coast') || t.includes('sea')) return 'coastal';
    if (t.includes('mountain')) return 'mountain';
    return 'temperate';
  };

  WeatherEngine.prototype.serialize = function() {
    var regions = [];
    var histories = [];

    this.regionWeather.forEach(function(data, regionId) {
      regions.push({
        regionId: regionId,
        data: {
          current: data.current,
          climate: data.climate,
          duration: data.duration,
          durationRemaining: data.durationRemaining
        }
      });
    });

    this.weatherHistory.forEach(function(data, key) {
      histories.push(data);
    });

    return {
      seed: this.seed,
      regionWeather: regions,
      weatherHistory: histories
    };
  };

  WeatherEngine.prototype.deserialize = function(data) {
    if (!data) return;
    this.seed = data.seed || 42;
    this.regionWeather.clear();
    this.weatherHistory.clear();

    if (data.regionWeather && Array.isArray(data.regionWeather)) {
      data.regionWeather.forEach(function(item) {
        this.regionWeather.set(item.regionId, item.data);
      }, this);
    }

    if (data.weatherHistory && Array.isArray(data.weatherHistory)) {
      data.weatherHistory.forEach(function(item) {
        var key = item.regionId + '_' + item.date;
        this.weatherHistory.set(key, item);
      }, this);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SEASONS & EVENTS MANAGER
  // ═══════════════════════════════════════════════════════════════════════════

  function SeasonalEffectsManager() {
    this.activeEvents = [];
    this.eventHistory = [];
  }

  SeasonalEffectsManager.prototype.getSeasonalEffects = function(season, data) {
    var effects = {
      factionModifiers: {},
      priceModifiers: {},
      mechanics: {}
    };

    if (!season) return effects;

    switch (season.id) {
      case 'frostfall':
        // Northern regions suffer
        if (data.regions) {
          data.regions.forEach(function(r) {
            if (r.type && r.type.toLowerCase().includes('north')) {
              effects.factionModifiers[r.id] = (effects.factionModifiers[r.id] || 0) - 10;
            }
          });
        }
        effects.priceModifiers.food = 1.5;
        effects.mechanics.movementPenalty = 0.1;
        break;

      case 'solstice':
        // Southern/arid regions suffer heat
        if (data.regions) {
          data.regions.forEach(function(r) {
            if (r.type && (r.type.toLowerCase().includes('south') || r.type.toLowerCase().includes('desert'))) {
              effects.priceModifiers[r.id] = (effects.priceModifiers[r.id] || 1) * 1.3;
            }
          });
        }
        effects.mechanics.fireSpellDamageBump = 1;
        effects.mechanics.heatExhaustion = true;
        break;

      case 'verdance':
        // Spring flooding, new growth bonuses
        effects.mechanics.floodingRisk = true;
        effects.mechanics.cropGrowth = 1.2;
        if (data.factions) {
          data.factions.forEach(function(f) {
            effects.factionModifiers[f.name] = (effects.factionModifiers[f.name] || 0) + 5;
          });
        }
        break;

      case 'harvest':
        // Harvest bonuses
        effects.mechanics.cropYield = 1.3;
        effects.mechanics.tradeBump = 1.25;
        if (data.factions) {
          data.factions.forEach(function(f) {
            effects.factionModifiers[f.name] = (effects.factionModifiers[f.name] || 0) + 15;
          });
        }
        break;
    }

    return effects;
  };

  SeasonalEffectsManager.prototype.triggerSeasonalEvent = function(eventId, calendar) {
    var eventTemplate = SEASONAL_EVENTS[eventId];
    if (!eventTemplate) return null;

    var event = {
      id: eventId,
      name: eventTemplate.name,
      headline: eventTemplate.headline,
      detail: eventTemplate.detail,
      category: eventTemplate.category,
      icon: eventTemplate.icon,
      importance: eventTemplate.importance,
      triggeredAt: Date.now(),
      mutations: eventTemplate.mutations,
      calendarEffect: eventTemplate.calendarEffect
    };

    this.activeEvents.push(event);
    this.eventHistory.push(event);

    return event;
  };

  SeasonalEffectsManager.prototype.getActiveEvents = function() {
    return this.activeEvents.slice();
  };

  SeasonalEffectsManager.prototype.clearExpiredEvents = function(maxAge) {
    maxAge = maxAge || 90; // Default: events expire after 90 days
    var now = Date.now();

    this.activeEvents = this.activeEvents.filter(function(e) {
      return (now - e.triggeredAt) < (maxAge * 24 * 60 * 60 * 1000);
    });
  };

  SeasonalEffectsManager.prototype.serialize = function() {
    return {
      activeEvents: this.activeEvents.slice(),
      eventHistory: this.eventHistory.slice()
    };
  };

  SeasonalEffectsManager.prototype.deserialize = function(data) {
    if (!data) return;
    this.activeEvents = data.activeEvents ? data.activeEvents.slice() : [];
    this.eventHistory = data.eventHistory ? data.eventHistory.slice() : [];
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HELPER: Simple PRNG
  // ═══════════════════════════════════════════════════════════════════════════

  function mulberry32(a) {
    return function() {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════════

  return {
    CalendarTracker: CalendarTracker,
    WeatherEngine: WeatherEngine,
    SeasonalEffectsManager: SeasonalEffectsManager,
    FANTASY_CALENDAR: FANTASY_CALENDAR,
    SEASONAL_EVENTS: SEASONAL_EVENTS,
    CLIMATE_TYPES: CLIMATE_TYPES,
    WEATHER_STATES: WEATHER_STATES
  };

})();

// Export to window
window.CalendarTracker = window.CampaignSeasons.CalendarTracker;
window.WeatherEngine = window.CampaignSeasons.WeatherEngine;
window.SeasonalEffectsManager = window.CampaignSeasons.SeasonalEffectsManager;
window.FANTASY_CALENDAR = window.CampaignSeasons.FANTASY_CALENDAR;
window.SEASONAL_EVENTS = window.CampaignSeasons.SEASONAL_EVENTS;
window.CLIMATE_TYPES = window.CampaignSeasons.CLIMATE_TYPES;
window.WEATHER_STATES = window.CampaignSeasons.WEATHER_STATES;
