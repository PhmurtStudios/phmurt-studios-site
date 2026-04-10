(function() {
  'use strict';

  // ============================================================================
  // DOWNTIME ACTIVITIES CATALOG
  // ============================================================================

  const DOWNTIME_ACTIVITIES = [
    {
      id: 'crafting',
      name: 'Crafting',
      icon: 'Hammer',
      description: 'Create items using materials and gold. Specialties vary by class.',
      durationDays: 10,
      goldCost: 50,
      goldReward: { min: 0, max: 0 },
      requirements: { class: [], level: 1, location: 'workshop' },
      risks: ['Material waste', 'Tool damage', 'Incomplete item'],
      rewards: ['Magical item', 'Weapon/Armor', 'Consumable'],
      outcomeProbabilities: { greatSuccess: 0.15, success: 0.65, complication: 0.20 }
    },
    {
      id: 'training',
      name: 'Training',
      icon: 'Swords',
      description: 'Learn a new proficiency or language. Complexity determines duration.',
      durationDays: 30,
      goldCost: 100,
      goldReward: { min: 0, max: 0 },
      requirements: { class: [], level: 1, location: 'academy' },
      risks: ['Inadequate teaching', 'Slow progress'],
      rewards: ['New proficiency', 'Language mastery'],
      outcomeProbabilities: { greatSuccess: 0.10, success: 0.70, complication: 0.20 }
    },
    {
      id: 'research',
      name: 'Research',
      icon: 'BookOpen',
      description: 'Study lore, discover faction secrets, identify magical items.',
      durationDays: 14,
      goldCost: 30,
      goldReward: { min: 0, max: 0 },
      requirements: { class: [], level: 1, location: 'library' },
      risks: ['Misleading information', 'Unwanted attention', 'Curse discovered'],
      rewards: ['Secret discovered', 'Artifact identified', 'Faction knowledge'],
      outcomeProbabilities: { greatSuccess: 0.20, success: 0.60, complication: 0.20 }
    },
    {
      id: 'working',
      name: 'Working',
      icon: 'Coins',
      description: 'Earn gold at a profession. Daily rate depends on skill and city prosperity.',
      durationDays: 10,
      goldCost: 0,
      goldReward: { min: 10, max: 50 },
      requirements: { class: [], level: 1, location: 'city' },
      risks: ['Poor wages', 'Injury on job'],
      rewards: ['Gold earned', 'Reputation boost'],
      outcomeProbabilities: { greatSuccess: 0.20, success: 0.70, complication: 0.10 }
    },
    {
      id: 'carousing',
      name: 'Carousing',
      icon: 'Users',
      description: 'Socialize and make contacts. May gain an ally or make an enemy.',
      durationDays: 7,
      goldCost: 20,
      goldReward: { min: 0, max: 0 },
      requirements: { class: [], level: 1, location: 'tavern' },
      risks: ['Debt incurred', 'Enemy made', 'Reputation damaged'],
      rewards: ['Ally gained', 'Rumor learned', 'Love interest'],
      outcomeProbabilities: { greatSuccess: 0.15, success: 0.65, complication: 0.20 }
    },
    {
      id: 'business',
      name: 'Running a Business',
      icon: 'TrendingUp',
      description: 'Manage a shop or tavern. Roll for profit or loss per tenday.',
      durationDays: 10,
      goldCost: 0,
      goldReward: { min: -50, max: 200 },
      requirements: { class: [], level: 3, location: 'city' },
      risks: ['Theft', 'Competition', 'Bad harvest'],
      rewards: ['Substantial profit', 'Increased reputation'],
      outcomeProbabilities: { greatSuccess: 0.15, success: 0.55, complication: 0.30 }
    },
    {
      id: 'crime',
      name: 'Crime',
      icon: 'Lock',
      description: 'Pickpocketing, heists, or fence stolen goods. High risk, high reward.',
      durationDays: 10,
      goldCost: 0,
      goldReward: { min: 50, max: 300 },
      requirements: { class: [], level: 2, location: 'city' },
      risks: ['Arrest', 'Wanted status', 'Guild attention'],
      rewards: ['Stolen loot', 'Guild connections'],
      outcomeProbabilities: { greatSuccess: 0.10, success: 0.50, complication: 0.40 }
    },
    {
      id: 'religious_devotion',
      name: 'Religious Devotion',
      icon: 'Heart',
      description: 'Devotion to a deity. Gain divine favor or blessings.',
      durationDays: 10,
      goldCost: 25,
      goldReward: { min: 0, max: 0 },
      requirements: { class: [], level: 1, location: 'temple' },
      risks: ['Divine displeasure', 'Geas imposed'],
      rewards: ['Divine favor', 'Blessing granted'],
      outcomeProbabilities: { greatSuccess: 0.15, success: 0.70, complication: 0.15 }
    },
    {
      id: 'recuperating',
      name: 'Recuperating',
      icon: 'Activity',
      description: 'Heal lingering injuries, remove curses, recover from trauma.',
      durationDays: 14,
      goldCost: 60,
      goldReward: { min: 0, max: 0 },
      requirements: { class: [], level: 1, location: 'temple' },
      risks: ['Incomplete recovery', 'New ailment'],
      rewards: ['Injury healed', 'Curse removed', 'HP restored'],
      outcomeProbabilities: { greatSuccess: 0.20, success: 0.70, complication: 0.10 }
    },
    {
      id: 'spellcasting_services',
      name: 'Spellcasting Services',
      icon: 'Sparkles',
      description: 'Sell spell services to NPCs for gold. Casters only.',
      durationDays: 7,
      goldCost: 0,
      goldReward: { min: 40, max: 150 },
      requirements: { class: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'], level: 1, location: 'city' },
      risks: ['Demanding client', 'Spell backfire', 'Reputation risk'],
      rewards: ['Gold payment', 'Reputation boost', 'Spell components'],
      outcomeProbabilities: { greatSuccess: 0.15, success: 0.70, complication: 0.15 }
    },
    {
      id: 'building',
      name: 'Building',
      icon: 'Home',
      description: 'Build or upgrade a stronghold, shop, temple, or other structure.',
      durationDays: 30,
      goldCost: 500,
      goldReward: { min: 0, max: 0 },
      requirements: { class: [], level: 5, location: 'city' },
      risks: ['Structural failure', 'Cost overrun', 'Builder dispute'],
      rewards: ['Stronghold established', 'Income property', 'Safe haven'],
      outcomeProbabilities: { greatSuccess: 0.10, success: 0.60, complication: 0.30 }
    },
    {
      id: 'networking',
      name: 'Networking',
      icon: 'Handshake',
      description: 'Build political connections, gather rumors, and establish contacts.',
      durationDays: 7,
      goldCost: 50,
      goldReward: { min: 0, max: 0 },
      requirements: { class: [], level: 2, location: 'city' },
      risks: ['Misinformation', 'Political entanglement', 'False lead'],
      rewards: ['Valuable contact', 'Rumors uncovered', 'Political favor'],
      outcomeProbabilities: { greatSuccess: 0.15, success: 0.65, complication: 0.20 }
    },
    {
      id: 'brewing',
      name: 'Brewing',
      icon: 'Flask',
      description: 'Brew potions and alchemical concoctions. Requires alchemical supplies.',
      durationDays: 5,
      goldCost: 25,
      goldReward: { min: 0, max: 0 },
      requirements: { class: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'], level: 3, location: 'workshop' },
      risks: ['Potion fails', 'Unstable mixture', 'Ingredient shortage'],
      rewards: ['Potion created', 'Rare extract', 'Alchemical discovery'],
      outcomeProbabilities: { greatSuccess: 0.12, success: 0.68, complication: 0.20 }
    },
    {
      id: 'scribing',
      name: 'Scribing',
      icon: 'PenTool',
      description: 'Copy spell scrolls, scribe letters, or document knowledge.',
      durationDays: 3,
      goldCost: 10,
      goldReward: { min: 0, max: 0 },
      requirements: { class: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'], level: 1, location: 'library' },
      risks: ['Ink spoils', 'Arcane error', 'Document damaged'],
      rewards: ['Spell scroll created', 'Rare tome copied', 'Commissions earned'],
      outcomeProbabilities: { greatSuccess: 0.20, success: 0.65, complication: 0.15 }
    },
    {
      id: 'bounty_hunting',
      name: 'Bounty Hunting',
      icon: 'Target',
      description: 'Track down and capture wanted criminals and dangerous fugitives.',
      durationDays: 10,
      goldCost: 0,
      goldReward: { min: 75, max: 250 },
      requirements: { class: [], level: 3, location: 'city' },
      risks: ['Bounty escapes', 'Betrayal', 'Ambush'],
      rewards: ['Bounty claimed', 'Reputation earned', 'Guild advancement'],
      outcomeProbabilities: { greatSuccess: 0.10, success: 0.50, complication: 0.40 }
    },
    {
      id: 'sailing',
      name: 'Sailing',
      icon: 'Wind',
      description: 'Work aboard a ship, explore waterways, or trade along coasts.',
      durationDays: 14,
      goldCost: 0,
      goldReward: { min: 25, max: 100 },
      requirements: { class: [], level: 1, location: 'port' },
      risks: ['Storm at sea', 'Piracy', 'Ship damage'],
      rewards: ['Wages earned', 'Naval contacts', 'Chart discovered'],
      outcomeProbabilities: { greatSuccess: 0.12, success: 0.63, complication: 0.25 }
    }
  ];

  // ============================================================================
  // ICON MAPPING FOR LUCIDE ICONS
  // ============================================================================

  const ICON_MAP = {
    'Hammer': 'Hammer',
    'Swords': 'Swords',
    'BookOpen': 'BookOpen',
    'Coins': 'Coins',
    'Users': 'Users',
    'TrendingUp': 'TrendingUp',
    'Lock': 'Lock',
    'Heart': 'Heart',
    'Activity': 'Activity',
    'Sparkles': 'Sparkles',
    'Home': 'Home',
    'Handshake': 'Handshake',
    'Flask': 'Flask',
    'PenTool': 'PenTool',
    'Target': 'Target',
    'Wind': 'Wind',
    'Check': 'Check'
  };

  // ============================================================================
  // DOWNTIME ENGINE
  // ============================================================================

  class DowntimeEngine {
    constructor() {
      this.assignments = []; // { characterName, activityId, daysAllocated, startDay, status }
      this.log = []; // { character, activity, outcome, day, narrative, rewards, consequences }
    }

    assignActivity(characterName, activityId, daysAllocated) {
      const activity = DOWNTIME_ACTIVITIES.find(a => a.id === activityId);
      if (!activity) throw new Error(`Activity ${activityId} not found`);

      this.assignments.push({
        characterName,
        activityId,
        daysAllocated,
        status: 'pending',
        timestamp: Date.now()
      });

      return { success: true, character: characterName, activity: activity.name };
    }

    resolveDowntime(character, activityId, rng = Math.random) {
      const activity = DOWNTIME_ACTIVITIES.find(a => a.id === activityId);
      if (!activity) throw new Error(`Activity ${activityId} not found`);

      const roll = rng();
      let outcome = 'success';
      let narrativeKey = 'success';

      if (roll < activity.outcomeProbabilities.greatSuccess) {
        outcome = 'great_success';
        narrativeKey = 'greatSuccess';
      } else if (roll < activity.outcomeProbabilities.greatSuccess + activity.outcomeProbabilities.success) {
        outcome = 'success';
        narrativeKey = 'success';
      } else {
        outcome = 'complication';
        narrativeKey = 'complication';
      }

      const rewards = this._generateRewards(activity, outcome, rng);
      const consequences = this._generateConsequences(activity, outcome, rng);
      const narrative = this._generateNarrative(activity, outcome, character, rng);

      const result = {
        character,
        activity: activity.name,
        activityId,
        outcome,
        narrative,
        rewards,
        consequences,
        timestamp: Date.now()
      };

      this.log.push(result);
      return result;
    }

    _generateRewards(activity, outcome, rng, currentCity = null, worldData = null) {
      const rewards = [];

      if (outcome === 'great_success') {
        const goldMin = activity.goldReward.min;
        const goldMax = activity.goldReward.max;
        const gold = Math.floor(rng() * (goldMax - goldMin + 1)) + goldMin;
        if (gold > 0) rewards.push({ type: 'gold', value: Math.ceil(gold * 1.5) });

        const idx = Math.floor(rng() * activity.rewards.length);
        rewards.push({ type: 'special', value: activity.rewards[idx] });
      } else if (outcome === 'success') {
        const goldMin = activity.goldReward.min;
        const goldMax = activity.goldReward.max;
        const gold = Math.floor(rng() * (goldMax - goldMin + 1)) + goldMin;
        if (gold > 0) rewards.push({ type: 'gold', value: gold });
      }

      // Add faction reputation bonus for successful outcomes
      if ((outcome === 'success' || outcome === 'great_success') &&
          worldData && worldData.factions && worldData.factions.length > 0 &&
          currentCity && worldData.cities) {
        const city = worldData.cities.find(c => c.name === currentCity);
        if (city) {
          // Get factions in this region
          const cityFactions = worldData.factions.filter(f => {
            const factionRegion = f.region && f.region.toLowerCase() === city.region?.toLowerCase();
            return factionRegion;
          });

          if (cityFactions.length > 0 && rng() > 0.5) {
            const faction = cityFactions[Math.floor(rng() * cityFactions.length)];
            rewards.push({ type: 'reputation', value: `+1 reputation with ${faction.name}` });
          }
        }
      }

      return rewards;
    }

    _generateConsequences(activity, outcome, rng) {
      const consequences = [];

      if (outcome === 'complication') {
        const idx = Math.floor(rng() * activity.risks.length);
        consequences.push({
          type: 'complication',
          description: activity.risks[idx],
          hookGenerated: true
        });
      }

      return consequences;
    }

    _generateNarrative(activity, outcome, character, rng, worldData = null) {
      const narratives = {
        greatSuccess: [
          `${character} excelled at ${activity.name.toLowerCase()}, exceeding all expectations.`,
          `Through skill and luck, ${character} achieved a remarkable success.`,
          `${character}'s dedication to ${activity.name.toLowerCase()} paid off handsomely.`
        ],
        success: [
          `${character} successfully completed ${activity.name.toLowerCase()}.`,
          `${character}'s efforts at ${activity.name.toLowerCase()} were fruitful.`,
          `A solid effort at ${activity.name.toLowerCase()} by ${character}.`
        ],
        complication: [
          `${character}'s ${activity.name.toLowerCase()} encountered unexpected troubles.`,
          `Something went wrong during ${character}'s ${activity.name.toLowerCase()}.`,
          `${character}'s plans for ${activity.name.toLowerCase()} hit a snag.`
        ]
      };

      const key = outcome === 'great_success' ? 'greatSuccess' : outcome;
      const options = narratives[key] || narratives.success;
      let narrative = options[Math.floor(rng() * options.length)];

      // Enhance narrative with NPC/world data if available
      if (worldData && worldData.npcs && worldData.npcs.length > 0) {
        const activityLower = activity.id.toLowerCase();
        let npcToMention = null;

        if (activityLower.includes('train') || activityLower === 'training') {
          const trainers = worldData.npcs.filter(n => n.role &&
            (n.role.toLowerCase().includes('trainer') || n.role.toLowerCase().includes('master')));
          if (trainers.length > 0) {
            npcToMention = trainers[Math.floor(rng() * trainers.length)];
          }
        } else if (activityLower.includes('craft')) {
          const crafters = worldData.npcs.filter(n => n.role &&
            (n.role.toLowerCase().includes('crafter') || n.role.toLowerCase().includes('smith')));
          if (crafters.length > 0) {
            npcToMention = crafters[Math.floor(rng() * crafters.length)];
          }
        }

        if (npcToMention) {
          const suffix = key === 'greatSuccess'
            ? ` Trained under ${npcToMention.name}.`
            : ` Worked with ${npcToMention.name}.`;
          narrative = narrative + suffix;
        }
      }

      return narrative;
    }

    getAvailableActivities(character, currentCity, worldData = null) {
      return DOWNTIME_ACTIVITIES.filter(activity => {
        const classOk = activity.requirements.class.length === 0 ||
                       activity.requirements.class.includes(character.class);
        const levelOk = character.level >= activity.requirements.level;

        // Location-based filtering with world data
        if (worldData && worldData.cities && currentCity) {
          const locationType = activity.requirements.location;
          const city = worldData.cities.find(c => c.name === currentCity);

          if (city && locationType !== 'city') {
            // Check if city has required location feature
            const hasFeature = city.features && city.features.some(feature => {
              const featureLower = feature.toLowerCase();
              const locLower = locationType.toLowerCase();
              // Match library/academy with research/training
              if (locLower === 'library' || locLower === 'academy') {
                return featureLower.includes('library') || featureLower.includes('academy');
              }
              // Match workshop with crafting
              if (locLower === 'workshop') {
                return featureLower.includes('workshop') || featureLower.includes('smith');
              }
              // Match temple with shrine for priestly activities
              if (locLower === 'temple') {
                return featureLower.includes('temple') || featureLower.includes('shrine');
              }
              // Match tavern
              if (locLower === 'tavern') {
                return featureLower.includes('tavern') || featureLower.includes('inn');
              }
              return featureLower.includes(locLower);
            });

            if (!hasFeature) return false;
          }
        }

        return classOk && levelOk;
      });
    }

    completeAssignment(characterName, activityId) {
      const assignment = this.assignments.find(
        a => a.characterName === characterName && a.activityId === activityId && a.status === 'pending'
      );
      if (!assignment) return null;
      assignment.status = 'resolved';
      return assignment;
    }

    getAssignmentsForCharacter(characterName) {
      return this.assignments.filter(a => a.characterName === characterName);
    }

    getActiveAssignments() {
      return this.assignments.filter(a => a.status === 'pending');
    }

    serialize() {
      return JSON.stringify({ assignments: this.assignments, log: this.log });
    }

    static deserialize(json) {
      const engine = new DowntimeEngine();
      const data = JSON.parse(json);
      engine.assignments = data.assignments || [];
      engine.log = data.log || [];
      return engine;
    }
  }

  // ============================================================================
  // QUEST BOARD
  // ============================================================================

  class QuestBoard {
    constructor() {
      this.quests = [];
      this.nextId = 1;
    }

    addQuest(quest) {
      const q = { ...quest, id: this.nextId++, status: 'available', createdAt: Date.now() };
      this.quests.push(q);
      return q;
    }

    updateQuest(questId, updates) {
      const quest = this.quests.find(q => q.id === questId);
      if (!quest) throw new Error(`Quest ${questId} not found`);
      Object.assign(quest, updates);
      return quest;
    }

    acceptQuest(questId) {
      const quest = this.quests.find(q => q.id === questId);
      if (!quest) throw new Error(`Quest ${questId} not found`);
      quest.status = 'active';
      quest.acceptedAt = Date.now();
      return quest;
    }

    completeObjective(questId, objectiveIndex) {
      const quest = this.quests.find(q => q.id === questId);
      if (!quest) throw new Error(`Quest ${questId} not found`);
      if (quest.objectives && quest.objectives[objectiveIndex]) {
        quest.objectives[objectiveIndex].completed = true;
      }
      return quest;
    }

    completeQuest(questId) {
      const quest = this.quests.find(q => q.id === questId);
      if (!quest) throw new Error(`Quest ${questId} not found`);
      quest.status = 'completed';
      return { quest, rewards: quest.rewards || {} };
    }

    failQuest(questId) {
      const quest = this.quests.find(q => q.id === questId);
      if (!quest) throw new Error(`Quest ${questId} not found`);
      quest.status = 'failed';
      return quest;
    }

    getActiveQuests() {
      return this.quests.filter(q => q.status === 'active');
    }

    getAvailableQuests() {
      return this.quests.filter(q => q.status === 'available');
    }

    getCompletedQuests() {
      return this.quests.filter(q => q.status === 'completed');
    }

    getQuestChain(chainId) {
      return this.quests.filter(q => q.chain === chainId);
    }

    checkDeadlines(currentDay) {
      const expired = [];
      this.quests.forEach(quest => {
        if (quest.deadline && quest.deadline < currentDay && quest.status === 'available') {
          quest.status = 'expired';
          expired.push(quest);
        }
      });
      return expired;
    }

    getQuestsByRegion(regionName) {
      return this.quests.filter(q => q.region === regionName && q.status !== 'expired');
    }

    serialize() {
      return JSON.stringify({
        quests: this.quests,
        nextId: this.nextId
      });
    }

    static deserialize(json) {
      const board = new QuestBoard();
      const data = JSON.parse(json);
      board.quests = data.quests || [];
      board.nextId = data.nextId || 1;
      return board;
    }
  }

  // ============================================================================
  // QUEST CONTEXTUALIZER - Integrates world atlas data into quests
  // ============================================================================

  function contextualizeQuest(template, data, rng) {
    if (!data || !data.npcs || !data.cities || !data.factions) {
      return template; // Return uncontextualized template if world data unavailable
    }

    // Helper to pick a random item from array
    const pickRandom = (arr) => arr && arr.length > 0 ? arr[Math.floor(rng() * arr.length)] : null;

    // Create a contextualized copy of the template
    const contextualized = { ...template };

    // Generate base title and description
    let titleBase = template.generateTitle(rng);
    let descBase = template.generateDescription(data, rng);

    // Contextualize with NPC, city, and faction names
    const npc = pickRandom(data.npcs);
    const city = pickRandom(data.cities);
    const faction = pickRandom(data.factions);

    if (npc) {
      descBase = descBase.replace(/the merchant|the official|the patron|an official/gi, npc.name);
    }
    if (city) {
      descBase = descBase.replace(/the city|the town|this city|this town/gi, city.name);
    }
    if (faction) {
      descBase = descBase.replace(/the authorities|the faction|the organization/gi, faction.name);
    }

    contextualized.generateTitle = () => titleBase;
    contextualized.generateDescription = () => descBase;

    return contextualized;
  }

  // ============================================================================
  // QUEST TEMPLATES
  // ============================================================================

  const QUEST_TEMPLATES = [
    // Kill Quests
    {
      type: 'kill',
      subtype: 'slay_monster',
      generateTitle: (rng) => {
        const monsters = ['goblin', 'troll', 'ogre', 'giant spider', 'basilisk', 'wyvern'];
        const m = monsters[Math.floor(rng() * monsters.length)];
        return `Slay the ${m}`;
      },
      generateDescription: (data, rng) => {
        return `A dangerous creature has been terrorizing the area. Locals are desperate for someone brave enough to put an end to the threat.`;
      },
      generateObjectives: (rng) => [
        { text: 'Locate the creature', completed: false },
        { text: 'Defeat the creature', completed: false },
        { text: 'Bring proof of victory', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 50, easy: 100, medium: 200, hard: 500, legendary: 1000 };
        return { gold: baseGold[difficulty] || 300, xp: 300, items: [], reputation: 2 };
      }
    },
    {
      type: 'kill',
      subtype: 'eliminate_bandits',
      generateTitle: (rng) => {
        return 'Eliminate a bandit camp';
      },
      generateDescription: (data, rng) => {
        return `Bandits have been plaguing trade routes. A merchant lord will pay handsomely for their elimination.`;
      },
      generateObjectives: (rng) => [
        { text: 'Scout the bandit camp', completed: false },
        { text: 'Defeat or scatter the bandits', completed: false },
        { text: 'Report back with results', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 75, easy: 150, medium: 300, hard: 600, legendary: 1200 };
        return { gold: baseGold[difficulty] || 400, xp: 350, items: [], reputation: 3 };
      }
    },
    {
      type: 'kill',
      subtype: 'defeat_boss',
      generateTitle: (rng) => {
        const bosses = ['the necromancer', 'the cult leader', 'the dragon lord', 'the shadow king'];
        const b = bosses[Math.floor(rng() * bosses.length)];
        return `Defeat ${b}`;
      },
      generateDescription: (data, rng) => {
        return `A powerful enemy threatens the realm. Only the most skilled adventurers have any hope of defeating this foe.`;
      },
      generateObjectives: (rng) => [
        { text: 'Gather intelligence on the boss', completed: false },
        { text: 'Assemble a strong team', completed: false },
        { text: 'Defeat the boss in combat', completed: false },
        { text: 'Seal or destroy the threat', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 100, easy: 200, medium: 400, hard: 750, legendary: 1500 };
        return { gold: baseGold[difficulty] || 300, xp: 400, items: [], reputation: 3 };
      }
    },
    // Fetch Quests
    {
      type: 'fetch',
      subtype: 'retrieve_artifact',
      generateTitle: (rng) => {
        const artifacts = ['the sword of kings', 'the crown jewel', 'an ancient relic', 'the lost amulet'];
        const a = artifacts[Math.floor(rng() * artifacts.length)];
        return `Retrieve ${a}`;
      },
      generateDescription: (data, rng) => {
        return `A valuable artifact has gone missing. Someone will pay handsomely for its safe return.`;
      },
      generateObjectives: (rng) => [
        { text: 'Locate the artifact', completed: false },
        { text: 'Navigate to its location', completed: false },
        { text: 'Retrieve and deliver the artifact', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 40, easy: 80, medium: 150, hard: 300, legendary: 600 };
        return { gold: baseGold[difficulty] || 120, xp: 180, items: [], reputation: 1 };
      }
    },
    {
      type: 'fetch',
      subtype: 'gather_ingredients',
      generateTitle: (rng) => {
        const items = ['rare herbs', 'alchemical components', 'materials for a ritual'];
        const i = items[Math.floor(rng() * items.length)];
        return `Gather ${i}`;
      },
      generateDescription: (data, rng) => {
        return `A local crafter or alchemist needs rare ingredients that can only be found in dangerous places.`;
      },
      generateObjectives: (rng) => [
        { text: 'Locate the ingredients', completed: false },
        { text: 'Gather all required items', completed: false },
        { text: 'Deliver to the patron', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 30, easy: 60, medium: 120, hard: 200, legendary: 400 };
        return { gold: baseGold[difficulty] || 100, xp: 150, items: [], reputation: 1 };
      }
    },
    {
      type: 'fetch',
      subtype: 'deliver_package',
      generateTitle: (rng) => {
        return 'Deliver a mysterious package';
      },
      generateDescription: (data, rng) => {
        return `A merchant needs a package delivered to a distant location. The pay is good, but details are vague.`;
      },
      generateObjectives: (rng) => [
        { text: 'Accept and collect the package', completed: false },
        { text: 'Travel to the destination', completed: false },
        { text: 'Deliver safely without opening it', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 25, easy: 50, medium: 100, hard: 150, legendary: 300 };
        return { gold: baseGold[difficulty] || 75, xp: 120, items: [], reputation: 1 };
      }
    },
    {
      type: 'fetch',
      subtype: 'salvage_wreckage',
      generateTitle: (rng) => {
        return 'Salvage valuables from a wreck';
      },
      generateDescription: (data, rng) => {
        return `A ship has wrecked or a caravan destroyed. Salvagers seek brave souls to retrieve valuable cargo.`;
      },
      generateObjectives: (rng) => [
        { text: 'Locate the wreck', completed: false },
        { text: 'Overcome hazards and obstacles', completed: false },
        { text: 'Recover the cargo', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 50, easy: 100, medium: 200, hard: 350, legendary: 700 };
        return { gold: baseGold[difficulty] || 150, xp: 200, items: ['salvage'], reputation: 1 };
      }
    },
    // Escort Quests
    {
      type: 'escort',
      subtype: 'protect_caravan',
      generateTitle: (rng) => {
        return 'Protect a merchant caravan';
      },
      generateDescription: (data, rng) => {
        return `Merchants require protection for a valuable shipment traveling through dangerous lands.`;
      },
      generateObjectives: (rng) => [
        { text: 'Meet the caravan at the departure point', completed: false },
        { text: 'Protect the caravan from bandits and monsters', completed: false },
        { text: 'Deliver the caravan safely to its destination', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 35, easy: 70, medium: 140, hard: 280, legendary: 560 };
        return { gold: baseGold[difficulty] || 105, xp: 160, items: [], reputation: 2 };
      }
    },
    {
      type: 'escort',
      subtype: 'guide_npc',
      generateTitle: (rng) => {
        return 'Guide an NPC to safety';
      },
      generateDescription: (data, rng) => {
        return `A noble or dignitary needs an escort to a distant location. The journey is fraught with danger.`;
      },
      generateObjectives: (rng) => [
        { text: 'Meet the NPC', completed: false },
        { text: 'Protect them during travel', completed: false },
        { text: 'Deliver them to the destination', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 30, easy: 60, medium: 120, hard: 240, legendary: 480 };
        return { gold: baseGold[difficulty] || 100, xp: 140, items: [], reputation: 2 };
      }
    },
    // Investigation Quests
    {
      type: 'investigation',
      subtype: 'find_criminal',
      generateTitle: (rng) => {
        return 'Track down a fugitive';
      },
      generateDescription: (data, rng) => {
        return `A criminal has fled the city. Authorities offer a reward for information leading to their capture.`;
      },
      generateObjectives: (rng) => [
        { text: 'Gather clues about their whereabouts', completed: false },
        { text: 'Track down the criminal', completed: false },
        { text: 'Apprehend or eliminate the target', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 40, easy: 80, medium: 160, hard: 320, legendary: 640 };
        return { gold: baseGold[difficulty] || 120, xp: 170, items: [], reputation: 2 };
      }
    },
    {
      type: 'investigation',
      subtype: 'solve_mystery',
      generateTitle: (rng) => {
        const mysteries = ['a series of robberies', 'strange murders', 'a haunting', 'a sabotage plot'];
        const m = mysteries[Math.floor(rng() * mysteries.length)];
        return `Solve ${m}`;
      },
      generateDescription: (data, rng) => {
        return `A mystery plagues the town. Someone must uncover the truth and bring the culprits to justice.`;
      },
      generateObjectives: (rng) => [
        { text: 'Investigate the crime scene', completed: false },
        { text: 'Interview witnesses and suspects', completed: false },
        { text: 'Gather evidence and solve the mystery', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 50, easy: 100, medium: 200, hard: 400, legendary: 800 };
        return { gold: baseGold[difficulty] || 150, xp: 200, items: [], reputation: 3 };
      }
    }
  ];

  // ============================================================================
  // REACT DOWNTIME VIEW COMPONENT
  // ============================================================================

  const { useState, useEffect, useCallback, useRef, useMemo } = React;
  const T = window.__PHMURT_THEME || {};
  try { if (window.T) Object.assign(T, window.T); } catch(e) {}

  const {
    Clock, Hammer, BookOpen, Coins, Users, Shield, Star, Plus, Check, X,
    ChevronDown, ChevronUp, Edit2, Trash2, Target, Activity, TrendingUp
  } = window.LucideReact || {};

  function DowntimeView({ data, setData, viewRole }) {
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [selectedActivityId, setSelectedActivityId] = useState(null);
    const [selectedCity, setSelectedCity] = useState('any');
    const [expandedCharacter, setExpandedCharacter] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, history, skills, stats

    const downtimeData = useMemo(() => {
      return data.downtime || {
        characters: {},
        activeActivities: [],
        history: [],
        skillMastery: {}
      };
    }, [data.downtime]);

    // Memoize success statistics to avoid recalculation on every render
    const historyStats = useMemo(() => ({
      total: downtimeData.history?.length || 0,
      successCount: downtimeData.history?.filter(h => h.outcome !== 'complication').length || 0,
      greatSuccessCount: downtimeData.history?.filter(h => h.outcome === 'great_success').length || 0
    }), [downtimeData.history]);

    const successRate = useMemo(() => {
      return historyStats.total > 0 ? Math.round((historyStats.successCount / historyStats.total) * 100) : 0;
    }, [historyStats.total, historyStats.successCount]);

    // Initialize character data if missing
    useEffect(() => {
      if (!data.downtime) {
        setData({
          ...data,
          downtime: {
            characters: {},
            activeActivities: [],
            history: [],
            skillMastery: {}
          }
        });
      }
    }, []);

    // Calculate mastery level for character+activity
    const getMasteryLevel = useCallback((characterName, activityId) => {
      const key = `${characterName}:${activityId}`;
      const mastery = downtimeData.skillMastery?.[key] || { successes: 0, level: 'Novice' };

      if (mastery.successes >= 15) return { level: 'Master', bonus: 15 };
      if (mastery.successes >= 7) return { level: 'Expert', bonus: 10 };
      if (mastery.successes >= 3) return { level: 'Proficient', bonus: 5 };
      return { level: 'Novice', bonus: 0 };
    }, [downtimeData.skillMastery]);

    // Handle activity assignment
    const handleAssignActivity = useCallback(() => {
      if (!selectedCharacter || !selectedActivityId) return;

      const activity = DOWNTIME_ACTIVITIES.find(a => a.id === selectedActivityId);
      if (!activity) return;

      const newActive = {
        id: `${selectedCharacter}_${Date.now()}`,
        characterName: selectedCharacter,
        activityId: selectedActivityId,
        activityName: activity.name,
        daysRequired: activity.durationDays,
        daysElapsed: 0,
        startDate: new Date().toISOString(),
        status: 'active',
        goldCost: activity.goldCost,
        city: selectedCity && selectedCity !== 'any' ? selectedCity : null
      };

      setData({
        ...data,
        downtime: {
          ...downtimeData,
          activeActivities: [...downtimeData.activeActivities, newActive]
        }
      });

      setShowActivityModal(false);
      setSelectedActivityId(null);
      setSelectedCharacter(null);
      setSelectedCity('any');
    }, [selectedCharacter, selectedActivityId, selectedCity, data, downtimeData, setData]);

    // Handle activity resolution
    const handleResolveActivity = useCallback((activeActivityId) => {
      const active = downtimeData.activeActivities.find(a => a.id === activeActivityId);
      if (!active) return;

      const activity = DOWNTIME_ACTIVITIES.find(a => a.id === active.activityId);
      if (!activity) return;

      // Simulate resolution
      const roll = Math.random();
      let outcome = 'success';
      if (roll < activity.outcomeProbabilities.greatSuccess) {
        outcome = 'great_success';
      } else if (roll > (1 - activity.outcomeProbabilities.complication)) {
        outcome = 'complication';
      }

      // Generate gold reward
      let goldEarned = 0;
      if (outcome !== 'complication') {
        const goldMin = Math.max(0, activity.goldReward.min);
        const goldMax = activity.goldReward.max;
        goldEarned = Math.floor(Math.random() * (goldMax - goldMin + 1)) + goldMin;
        if (outcome === 'great_success') goldEarned = Math.ceil(goldEarned * 1.5);
      }

      // Create history entry
      const historyEntry = {
        id: `${active.characterName}_${Date.now()}`,
        characterName: active.characterName,
        activityId: active.activityId,
        activityName: active.activityName,
        outcome,
        goldEarned,
        goldSpent: active.goldCost,
        narrative: `${active.characterName} ${outcome === 'great_success' ? 'excelled at' : outcome === 'complication' ? 'had complications with' : 'completed'} ${active.activityName.toLowerCase()}.`,
        completedDate: new Date().toISOString()
      };

      // Update skill mastery
      const masteryKey = `${active.characterName}:${active.activityId}`;
      const currentMastery = downtimeData.skillMastery?.[masteryKey] || { successes: 0, level: 'Novice' };
      if (outcome !== 'complication') {
        currentMastery.successes++;
      }

      setData({
        ...data,
        downtime: {
          ...downtimeData,
          activeActivities: downtimeData.activeActivities.filter(a => a.id !== activeActivityId),
          history: [...downtimeData.history, historyEntry],
          skillMastery: { ...downtimeData.skillMastery, [masteryKey]: currentMastery }
        }
      });

      setShowResolveModal(false);
    }, [downtimeData, data, setData]);

    // Calculate stats
    const stats = useMemo(() => {
      const totalGoldEarned = downtimeData.history?.reduce((sum, h) => sum + h.goldEarned, 0) || 0;
      const totalGoldSpent = downtimeData.history?.reduce((sum, h) => sum + h.goldSpent, 0) || 0;
      const complications = downtimeData.history?.filter(h => h.outcome === 'complication').length || 0;

      const activityCounts = {};
      downtimeData.history?.forEach(h => {
        activityCounts[h.activityName] = (activityCounts[h.activityName] || 0) + 1;
      });

      const mostPopular = Object.entries(activityCounts).sort((a, b) => b[1] - a[1])[0];

      return {
        totalGoldEarned,
        totalGoldSpent,
        netGold: totalGoldEarned - totalGoldSpent,
        complications,
        mostPopular: mostPopular ? mostPopular[0] : 'None'
      };
    }, [downtimeData.history]);

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '16px',
        fontFamily: T.ui || "'Cinzel', serif",
        backgroundColor: T.bg,
        color: T.text,
        minHeight: '100%'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '12px',
          borderBottom: `2px solid ${T.border}`
        }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', fontFamily: T.heading }}>Downtime Management</h1>
          <button
            onClick={() => setShowActivityModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: T.gold,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {Plus && <Plus size={18} />} Start Activity
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: `2px solid ${T.border}` }}>
          {['dashboard', 'history', 'skills', 'stats'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === tab ? (T.gold) : 'transparent',
                color: activeTab === tab ? 'white' : (T.text),
                border: activeTab === tab ? 'none' : '1px solid transparent',
                borderBottom: activeTab === tab ? 'none' : '2px solid transparent',
                borderRadius: activeTab === tab ? '4px 4px 0 0' : '0',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === tab ? '600' : '500',
                fontFamily: T.ui || "'Cinzel', serif",
                transition: 'all 0.2s ease'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Active Downtime Tracker */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
            {downtimeData.activeActivities?.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', color: T.textDim }}>
                No active downtime activities. Click "Start Activity" to begin.
              </div>
            ) : (
              downtimeData.activeActivities?.map(active => {
                const activity = DOWNTIME_ACTIVITIES.find(a => a.id === active.activityId);
                const progress = (active.daysElapsed / active.daysRequired) * 100;

                return (
                  <div
                    key={active.id}
                    style={{
                      padding: '14px',
                      backgroundColor: T.bgCard,
                      border: `2px solid ${T.gold}`,
                      borderRadius: '8px',
                      boxShadow: `0 2px 8px ${T.bgNav}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', fontFamily: T.heading, color: T.text }}>
                          {active.characterName}
                        </h3>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: T.textDim, fontWeight: '500' }}>
                          {active.activityName}
                        </p>
                      </div>
                      <div style={{
                        padding: '6px 10px',
                        backgroundColor: T.bgHover,
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: T.textDim,
                        border: `1px solid ${T.border}`
                      }}>
                        {activity?.icon}
                      </div>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        marginBottom: '4px'
                      }}>
                        <span>Progress</span>
                        <span>{active.daysElapsed}/{active.daysRequired} days</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: T.bgHover,
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${Math.min(progress, 100)}%`,
                          height: '100%',
                          backgroundColor: T.gold,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', fontSize: '12px' }}>
                      <button
                        onClick={() => {
                          setData({
                            ...data,
                            downtime: {
                              ...downtimeData,
                              activeActivities: downtimeData.activeActivities.map(a =>
                                a.id === active.id ? { ...a, daysElapsed: a.daysElapsed + 1 } : a
                              )
                            }
                          });
                        }}
                        style={{
                          flex: 1,
                          padding: '6px',
                          backgroundColor: T.gold,
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        +Day
                      </button>
                      <button
                        onClick={() => handleResolveActivity(active.id)}
                        style={{
                          flex: 1,
                          padding: '6px',
                          backgroundColor: T.green,
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {downtimeData.history?.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: T.textDim }}>
                No downtime history yet.
              </div>
            ) : (
              downtimeData.history?.map(entry => {
                const activity = DOWNTIME_ACTIVITIES.find(a => a.id === entry.activityId);
                const outcomeColor = entry.outcome === 'great_success' ? (T.gold) :
                                     entry.outcome === 'complication' ? (T.crimson) :
                                     (T.green);
                const outcomeBg = entry.outcome === 'great_success' ? (T.bgCard) :
                                  entry.outcome === 'complication' ? (T.bgCard) : (T.bgCard);

                return (
                  <div
                    key={entry.id}
                    style={{
                      padding: '14px',
                      backgroundColor: outcomeBg,
                      border: `2px solid ${outcomeColor}`,
                      borderRadius: '8px',
                      borderLeft: `6px solid ${outcomeColor}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', fontFamily: T.heading, color: T.text }}>
                          {entry.characterName}
                        </h4>
                        <p style={{ margin: '0 0 6px 0', fontSize: '13px', fontWeight: '500', color: T.textDim }}>
                          {entry.activityName}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: T.textMuted, lineHeight: '1.4' }}>
                          {entry.narrative}
                        </p>
                      </div>
                      <span style={{
                        padding: '6px 12px',
                        backgroundColor: outcomeColor,
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '700',
                        whiteSpace: 'nowrap',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {entry.outcome.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: T.textDim, flexWrap: 'wrap' }}>
                      {entry.goldEarned > 0 && (
                        <span style={{ color: T.green, fontWeight: '600' }}>
                          +{entry.goldEarned} gp
                        </span>
                      )}
                      {entry.goldSpent > 0 && (
                        <span style={{ color: T.crimson, fontWeight: '600' }}>
                          -{entry.goldSpent} gp
                        </span>
                      )}
                      {activity?.icon && (
                        <span style={{
                          padding: '2px 6px',
                          backgroundColor: T.bgHover,
                          borderRadius: '3px',
                          fontSize: '11px'
                        }}>
                          {activity.icon}
                        </span>
                      )}
                      <span style={{ marginLeft: 'auto' }}>
                        {new Date(entry.completedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(downtimeData.skillMastery || {}).length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: T.textDim }}>
                Complete activities to unlock skill mastery tracking.
              </div>
            ) : (
              Object.entries(downtimeData.skillMastery || {}).map(([key, mastery]) => {
                const [charName, actId] = key.split(':');
                const activity = DOWNTIME_ACTIVITIES.find(a => a.id === actId);
                const masteryInfo = getMasteryLevel(charName, actId);

                return (
                  <div
                    key={key}
                    style={{
                      padding: '14px',
                      backgroundColor: T.bgCard,
                      border: `2px solid ${T.border}`,
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: '600', fontFamily: T.heading, color: T.text }}>
                          {charName}
                        </h4>
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: '500', color: T.textDim }}>
                          {activity?.name}
                        </p>
                      </div>
                      <span style={{
                        padding: '6px 10px',
                        backgroundColor: masteryInfo.level === 'Master' ? (T.crimson) :
                                        masteryInfo.level === 'Expert' ? (T.orange) :
                                        masteryInfo.level === 'Proficient' ? (T.green) : (T.gold),
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '700',
                        whiteSpace: 'nowrap',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textAlign: 'center'
                      }}>
                        {masteryInfo.level}
                      </span>
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        marginBottom: '6px',
                        fontWeight: '500'
                      }}>
                        <span>Progression</span>
                        <span style={{ color: T.gold, fontWeight: '600' }}>
                          {Math.min(mastery.successes, 15)}/15
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: T.bgHover,
                        borderRadius: '4px',
                        overflow: 'hidden',
                        border: `1px solid ${T.border}`
                      }}>
                        <div style={{
                          width: `${Math.min((mastery.successes / 15) * 100, 100)}%`,
                          height: '100%',
                          backgroundColor: masteryInfo.level === 'Master' ? (T.crimson) :
                                           masteryInfo.level === 'Expert' ? (T.orange) :
                                           masteryInfo.level === 'Proficient' ? (T.green) : (T.gold),
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', color: T.textDim, textAlign: 'right' }}>
                      Mastery Bonus: +{masteryInfo.bonus}%
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{
                padding: '18px',
                backgroundColor: T.bgCard,
                border: `2px solid ${T.green}`,
                borderRadius: '8px'
              }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: T.green }}>
                  Gold Earned
                </p>
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: T.green }}>
                  +{stats.totalGoldEarned}
                </h2>
              </div>

              <div style={{
                padding: '18px',
                backgroundColor: T.bgCard,
                border: `2px solid ${T.crimson}`,
                borderRadius: '8px'
              }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: T.crimson }}>
                  Gold Spent
                </p>
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: T.crimson }}>
                  -{stats.totalGoldSpent}
                </h2>
              </div>

              <div style={{
                padding: '18px',
                backgroundColor: T.bgCard,
                border: `2px solid ${stats.netGold >= 0 ? (T.green) : (T.crimson)}`,
                borderRadius: '8px'
              }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: stats.netGold >= 0 ? (T.green) : (T.crimson) }}>
                  Net Gold
                </p>
                <h2 style={{
                  margin: 0,
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: stats.netGold >= 0 ? (T.green) : (T.crimson)
                }}>
                  {stats.netGold >= 0 ? '+' : ''}{stats.netGold}
                </h2>
              </div>

              <div style={{
                padding: '18px',
                backgroundColor: T.bgCard,
                border: `2px solid ${T.orange}`,
                borderRadius: '8px'
              }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: T.orange }}>
                  Complications
                </p>
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: T.orange }}>
                  {stats.complications}
                </h2>
              </div>

              <div style={{
                padding: '18px',
                backgroundColor: T.bgCard,
                border: `2px solid ${T.gold}`,
                borderRadius: '8px'
              }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: T.gold }}>
                  Total Activities
                </p>
                <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: T.gold }}>
                  {downtimeData.history?.length || 0}
                </h2>
              </div>

              <div style={{
                padding: '18px',
                backgroundColor: T.bgCard,
                border: `2px solid ${T.gold}`,
                borderRadius: '8px'
              }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: T.gold }}>
                  Popular Activity
                </p>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: T.gold }}>
                  {stats.mostPopular || 'None'}
                </h3>
              </div>
            </div>

            {/* Between Sessions Summary */}
            <div style={{
              padding: '18px',
              backgroundColor: T.bgCard,
              border: `2px solid ${T.border}`,
              borderRadius: '8px'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', fontFamily: T.heading }}>
                Campaign Summary
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                <div>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: '600', color: T.textDim }}>
                    Total Characters Active
                  </p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: T.text }}>
                    {new Set(downtimeData.history?.map(h => h.characterName) || []).size}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: '600', color: T.textDim }}>
                    Success Rate
                  </p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: T.green }}>
                    {successRate}%
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: '600', color: T.textDim }}>
                    Great Successes
                  </p>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: T.gold }}>
                    {historyStats.greatSuccessCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Assignment Modal */}
        {showActivityModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: T.bgNav,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: T.bgCard,
              padding: '24px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: `0 4px 16px ${T.bgNav}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: T.text }}>Start New Activity</h2>
                <button
                  onClick={() => {
                    setShowActivityModal(false);
                    setSelectedCharacter(null);
                    setSelectedActivityId(null);
                    setSelectedCity('any');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: T.textDim
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: T.textDim }}>
                    Character
                  </label>
                  <input
                    type="text"
                    value={selectedCharacter || ''}
                    onChange={(e) => setSelectedCharacter(e.target.value)}
                    placeholder="Enter character name"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${T.border}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      backgroundColor: T.bgInput || 'var(--bg-input)',
                      color: T.text
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: T.textDim }}>
                    Location
                  </label>
                  <select
                    value={selectedCity || 'any'}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${T.border}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      backgroundColor: T.bgInput || 'var(--bg-input)',
                      color: T.text
                    }}
                  >
                    <option value="any">Any City</option>
                    {data.cities && data.cities.map(city => (
                      <option key={city.name} value={city.name}>
                        {city.name} ({city.region})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: T.textDim }}>
                    Activity
                  </label>
                  <select
                    value={selectedActivityId || ''}
                    onChange={(e) => setSelectedActivityId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${T.border}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      backgroundColor: T.bgInput || 'var(--bg-input)',
                      color: T.text
                    }}
                  >
                    <option value="">Select an activity...</option>
                    {DOWNTIME_ACTIVITIES.map(activity => {
                      // Check if activity is available in selected city
                      let isAvailable = true;
                      if (selectedCity && selectedCity !== 'any' && data.cities) {
                        const city = data.cities.find(c => c.name === selectedCity);
                        if (city && activity.requirements.location !== 'city') {
                          const locType = activity.requirements.location;
                          isAvailable = city.features && city.features.some(feature => {
                            const featureLower = feature.toLowerCase();
                            const locLower = locType.toLowerCase();
                            if (locLower === 'library' || locLower === 'academy') {
                              return featureLower.includes('library') || featureLower.includes('academy');
                            }
                            if (locLower === 'workshop') {
                              return featureLower.includes('workshop') || featureLower.includes('smith');
                            }
                            if (locLower === 'temple') {
                              return featureLower.includes('temple') || featureLower.includes('shrine');
                            }
                            if (locLower === 'tavern') {
                              return featureLower.includes('tavern') || featureLower.includes('inn');
                            }
                            return featureLower.includes(locLower);
                          });
                        }
                      }
                      return (
                        <option key={activity.id} value={activity.id} disabled={!isAvailable}>
                          {activity.name} ({activity.durationDays} days, {activity.goldCost}gp)
                          {!isAvailable ? ' - Not available in this city' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {selectedActivityId && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: T.bgHover,
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: T.text
                  }}>
                    <p style={{ margin: '0 0 8px 0', fontWeight: '600' }}>Activity Details</p>
                    {(() => {
                      const act = DOWNTIME_ACTIVITIES.find(a => a.id === selectedActivityId);
                      return act ? (
                        <>
                          <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Description:</strong> {act.description}</p>
                          <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Duration:</strong> {act.durationDays} days</p>
                          <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Cost:</strong> {act.goldCost}gp</p>
                          <p style={{ margin: '4px 0', fontSize: '12px' }}><strong>Reward Range:</strong> {act.goldReward.min}-{act.goldReward.max}gp</p>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={handleAssignActivity}
                    disabled={!selectedCharacter || !selectedActivityId}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: selectedCharacter && selectedActivityId ? (T.gold) : (T.bgHover),
                      color: T.text,
                      border: 'none',
                      borderRadius: '4px',
                      cursor: selectedCharacter && selectedActivityId ? 'pointer' : 'not-allowed',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Start Activity
                  </button>
                  <button
                    onClick={() => {
                      setShowActivityModal(false);
                      setSelectedCharacter(null);
                      setSelectedActivityId(null);
                      setSelectedCity('any');
                    }}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: T.bgHover,
                      color: T.text,
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // EXPORTS
  // ============================================================================

  window.DowntimeEngine = DowntimeEngine;
  window.DOWNTIME_ACTIVITIES = DOWNTIME_ACTIVITIES;
  window.QuestBoard = QuestBoard;
  window.QUEST_TEMPLATES = QUEST_TEMPLATES;
  window.contextualizeQuest = contextualizeQuest;
  window.DowntimeView = DowntimeView;

})();
