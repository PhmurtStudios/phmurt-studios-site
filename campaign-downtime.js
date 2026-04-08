(function() {
  'use strict';

  // ============================================================================
  // DOWNTIME ACTIVITIES CATALOG
  // ============================================================================

  const DOWNTIME_ACTIVITIES = [
    {
      id: 'crafting',
      name: 'Crafting',
      icon: '🔨',
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
      icon: '⚔️',
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
      icon: '📚',
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
      icon: '💼',
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
      icon: '🍺',
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
      icon: '🏪',
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
      icon: '🗝️',
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
      id: 'pit_fighting',
      name: 'Pit Fighting',
      icon: '👊',
      description: 'Underground arena combat for gold and reputation.',
      durationDays: 7,
      goldCost: 0,
      goldReward: { min: 20, max: 100 },
      requirements: { class: [], level: 2, location: 'city' },
      risks: ['Serious injury', 'Gamblers seeking debts'],
      rewards: ['Arena reputation', 'Gold winnings'],
      outcomeProbabilities: { greatSuccess: 0.20, success: 0.60, complication: 0.20 }
    },
    {
      id: 'gambling',
      name: 'Gambling',
      icon: '🎲',
      description: 'Games of chance with variable stakes and outcomes.',
      durationDays: 3,
      goldCost: 0,
      goldReward: { min: -100, max: 200 },
      requirements: { class: [], level: 1, location: 'tavern' },
      risks: ['Debt owed', 'Cheating accusations'],
      rewards: ['Winnings', 'New contacts'],
      outcomeProbabilities: { greatSuccess: 0.15, success: 0.45, complication: 0.40 }
    },
    {
      id: 'religious_service',
      name: 'Religious Service',
      icon: '⛪',
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
      icon: '💊',
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
      icon: '✨',
      description: 'Sell spell services to NPCs for gold. Casters only.',
      durationDays: 7,
      goldCost: 0,
      goldReward: { min: 40, max: 150 },
      requirements: { class: ['Bard', 'Cleric', 'Druid', 'Sorcerer', 'Warlock', 'Wizard'], level: 1, location: 'city' },
      risks: ['Demanding client', 'Spell backfire', 'Reputation risk'],
      rewards: ['Gold payment', 'Reputation boost', 'Spell components'],
      outcomeProbabilities: { greatSuccess: 0.15, success: 0.70, complication: 0.15 }
    }
  ];

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

    _generateRewards(activity, outcome, rng) {
      const rewards = [];

      if (outcome === 'great_success') {
        const goldMin = Math.max(0, activity.goldReward.min);
        const goldMax = activity.goldReward.max;
        const gold = Math.floor(rng() * (goldMax - goldMin + 1)) + goldMin;
        if (gold > 0) rewards.push({ type: 'gold', value: Math.ceil(gold * 1.5) });

        const idx = Math.floor(rng() * activity.rewards.length);
        rewards.push({ type: 'special', value: activity.rewards[idx] });
      } else if (outcome === 'success') {
        const goldMin = Math.max(0, activity.goldReward.min);
        const goldMax = activity.goldReward.max;
        const gold = Math.floor(rng() * (goldMax - goldMin + 1)) + goldMin;
        if (gold > 0) rewards.push({ type: 'gold', value: gold });
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

    _generateNarrative(activity, outcome, character, rng) {
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
      return options[Math.floor(rng() * options.length)];
    }

    getAvailableActivities(character, currentCity) {
      return DOWNTIME_ACTIVITIES.filter(activity => {
        const classOk = activity.requirements.class.length === 0 ||
                       activity.requirements.class.includes(character.class);
        const levelOk = character.level >= activity.requirements.level;
        // location check would require city data integration
        return classOk && levelOk;
      });
    }

    getDowntimeLog() {
      return [...this.log];
    }

    serialize() {
      return JSON.stringify({
        assignments: this.assignments,
        log: this.log
      });
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
  // QUEST TEMPLATES
  // ============================================================================

  const QUEST_TEMPLATES = [
    // Bounty Quests
    {
      type: 'bounty',
      subtype: 'hunt_monster',
      generateTitle: (rng) => {
        const monsters = ['dire wolf', 'basilisk', 'wyvern', 'owlbear', 'manticore'];
        const m = monsters[Math.floor(rng() * monsters.length)];
        return `Hunt the ${m}`;
      },
      generateDescription: (data, rng) => {
        return `A dangerous creature has been terrorizing the region. The local militia needs adventurers to track it down and eliminate the threat.`;
      },
      generateObjectives: (rng) => [
        { text: 'Track the creature to its lair', completed: false },
        { text: 'Defeat the creature', completed: false },
        { text: 'Return proof of the kill', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 25, easy: 50, medium: 100, hard: 250, legendary: 500 };
        return { gold: baseGold[difficulty] || 100, xp: 200, items: [], reputation: 1 };
      }
    },
    {
      type: 'bounty',
      subtype: 'capture_outlaw',
      generateTitle: (rng) => {
        const titles = ['Capture the outlaw', 'Bring in the fugitive', 'Find the wanted criminal'];
        return titles[Math.floor(rng() * titles.length)];
      },
      generateDescription: (data, rng) => {
        return `A wanted criminal is loose in the region. Local authorities offer a reward for their capture, dead or alive.`;
      },
      generateObjectives: (rng) => [
        { text: 'Locate the outlaw', completed: false },
        { text: 'Capture or defeat the outlaw', completed: false },
        { text: 'Deliver to authorities', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 50, easy: 100, medium: 200, hard: 400, legendary: 750 };
        return { gold: baseGold[difficulty] || 150, xp: 250, items: [], reputation: 2 };
      }
    },
    {
      type: 'bounty',
      subtype: 'clear_dungeon',
      generateTitle: (rng) => {
        const names = ['the goblin warren', 'the troll den', 'the lich tomb', 'the dragon hoard'];
        const name = names[Math.floor(rng() * names.length)];
        return `Clear ${name}`;
      },
      generateDescription: (data, rng) => {
        return `A dangerous dungeon has become a haven for monsters and criminals. The regional lord seeks adventurers to clear it out.`;
      },
      generateObjectives: (rng) => [
        { text: 'Enter the dungeon', completed: false },
        { text: 'Eliminate the main threat', completed: false },
        { text: 'Secure the area', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 75, easy: 150, medium: 300, hard: 500, legendary: 1000 };
        return { gold: baseGold[difficulty] || 200, xp: 300, items: ['treasure'], reputation: 2 };
      }
    },
    {
      type: 'bounty',
      subtype: 'eliminate_threat',
      generateTitle: (rng) => {
        return 'Eliminate a dark threat';
      },
      generateDescription: (data, rng) => {
        return `Evil forces gather in the shadows. A mysterious threat must be eliminated before it grows too powerful.`;
      },
      generateObjectives: (rng) => [
        { text: 'Investigate the threat', completed: false },
        { text: 'Confront the source', completed: false },
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
        { text: 'Guard the caravan during travel', completed: false },
        { text: 'Arrive safely at the destination', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 50, easy: 100, medium: 200, hard: 300, legendary: 600 };
        return { gold: baseGold[difficulty] || 150, xp: 200, items: [], reputation: 2 };
      }
    },
    {
      type: 'escort',
      subtype: 'guide_pilgrim',
      generateTitle: (rng) => {
        return 'Guide a pilgrim to a holy site';
      },
      generateDescription: (data, rng) => {
        return `A faithful pilgrim seeks an escort to a sacred location. The journey is long and beset with perils.`;
      },
      generateObjectives: (rng) => [
        { text: 'Meet the pilgrim', completed: false },
        { text: 'Guide them through dangerous terrain', completed: false },
        { text: 'Reach the destination together', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 40, easy: 80, medium: 150, hard: 250, legendary: 500 };
        return { gold: baseGold[difficulty] || 120, xp: 180, items: [], reputation: 2 };
      }
    },
    {
      type: 'escort',
      subtype: 'escort_diplomat',
      generateTitle: (rng) => {
        return 'Escort a diplomat safely';
      },
      generateDescription: (data, rng) => {
        return `A diplomat of importance requires protection for a critical journey. Failure could have political consequences.`;
      },
      generateObjectives: (rng) => [
        { text: 'Protect the diplomat from threats', completed: false },
        { text: 'Navigate political intrigue', completed: false },
        { text: 'Ensure safe arrival for negotiations', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 75, easy: 150, medium: 300, hard: 500, legendary: 1000 };
        return { gold: baseGold[difficulty] || 250, xp: 250, items: [], reputation: 3 };
      }
    },
    // Investigation Quests
    {
      type: 'investigation',
      subtype: 'solve_murder',
      generateTitle: (rng) => {
        return 'Investigate a murder';
      },
      generateDescription: (data, rng) => {
        return `Someone has been killed under mysterious circumstances. The authorities seek investigators to uncover the truth.`;
      },
      generateObjectives: (rng) => [
        { text: 'Examine the crime scene', completed: false },
        { text: 'Interview witnesses and suspects', completed: false },
        { text: 'Identify and apprehend the killer', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 50, easy: 100, medium: 200, hard: 400, legendary: 800 };
        return { gold: baseGold[difficulty] || 150, xp: 250, items: [], reputation: 2 };
      }
    },
    {
      type: 'investigation',
      subtype: 'uncover_conspiracy',
      generateTitle: (rng) => {
        return 'Uncover a dark conspiracy';
      },
      generateDescription: (data, rng) => {
        return `Strange events suggest a larger plot at work. Someone seeks brave souls to unravel the conspiracy.`;
      },
      generateObjectives: (rng) => [
        { text: 'Gather intelligence on the plot', completed: false },
        { text: 'Identify the conspirators', completed: false },
        { text: 'Stop the conspiracy before it succeeds', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 75, easy: 150, medium: 300, hard: 600, legendary: 1200 };
        return { gold: baseGold[difficulty] || 250, xp: 350, items: [], reputation: 3 };
      }
    },
    {
      type: 'investigation',
      subtype: 'find_missing_person',
      generateTitle: (rng) => {
        return 'Find a missing person';
      },
      generateDescription: (data, rng) => {
        return `Someone important has disappeared without a trace. Their family seeks adventurers to locate them.`;
      },
      generateObjectives: (rng) => [
        { text: 'Investigate their disappearance', completed: false },
        { text: 'Follow leads to their location', completed: false },
        { text: 'Rescue and return them safely', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 40, easy: 80, medium: 150, hard: 300, legendary: 600 };
        return { gold: baseGold[difficulty] || 120, xp: 200, items: [], reputation: 2 };
      }
    },
    // Political Quests
    {
      type: 'political',
      subtype: 'broker_peace',
      generateTitle: (rng) => {
        return 'Broker peace between rivals';
      },
      generateDescription: (data, rng) => {
        return `Two factions stand on the brink of conflict. A neutral party seeks help negotiating peace before war erupts.`;
      },
      generateObjectives: (rng) => [
        { text: 'Meet with both faction leaders', completed: false },
        { text: 'Negotiate terms acceptable to both', completed: false },
        { text: 'Formalize the peace agreement', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 75, easy: 150, medium: 300, hard: 600, legendary: 1200 };
        return { gold: baseGold[difficulty] || 250, xp: 300, items: [], reputation: 3 };
      }
    },
    {
      type: 'political',
      subtype: 'sabotage_faction',
      generateTitle: (rng) => {
        return 'Sabotage enemy operations';
      },
      generateDescription: (data, rng) => {
        return `A rival faction seeks to hire adventurers for covert operations against their enemies.`;
      },
      generateObjectives: (rng) => [
        { text: 'Infiltrate the target location', completed: false },
        { text: 'Sabotage or steal the objective', completed: false },
        { text: 'Escape without getting caught', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 100, easy: 200, medium: 400, hard: 750, legendary: 1500 };
        return { gold: baseGold[difficulty] || 300, xp: 300, items: [], reputation: 2 };
      }
    },
    {
      type: 'political',
      subtype: 'deliver_ultimatum',
      generateTitle: (rng) => {
        return 'Deliver an ultimatum';
      },
      generateDescription: (data, rng) => {
        return `A powerful faction demands an intermediary deliver a message to their rivals. Diplomacy—or intimidation—required.`;
      },
      generateObjectives: (rng) => [
        { text: 'Locate the recipient', completed: false },
        { text: 'Deliver the message convincingly', completed: false },
        { text: 'Return with their response', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 60, easy: 120, medium: 250, hard: 500, legendary: 1000 };
        return { gold: baseGold[difficulty] || 200, xp: 250, items: [], reputation: 2 };
      }
    },
    // Exploration Quests
    {
      type: 'exploration',
      subtype: 'map_region',
      generateTitle: (rng) => {
        return 'Map uncharted territory';
      },
      generateDescription: (data, rng) => {
        return `Geographical societies seek accurate maps of unexplored regions. Adventurers willing to chart new lands will be well compensated.`;
      },
      generateObjectives: (rng) => [
        { text: 'Explore the unmapped region', completed: false },
        { text: 'Document key landmarks and hazards', completed: false },
        { text: 'Deliver the completed map', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 50, easy: 100, medium: 200, hard: 400, legendary: 800 };
        return { gold: baseGold[difficulty] || 150, xp: 250, items: [], reputation: 2 };
      }
    },
    {
      type: 'exploration',
      subtype: 'find_lost_city',
      generateTitle: (rng) => {
        return 'Locate a legendary lost city';
      },
      generateDescription: (data, rng) => {
        return `Legends speak of a magnificent city lost to time. Scholars and treasure hunters seek adventurers to find it.`;
      },
      generateObjectives: (rng) => [
        { text: 'Research the city location', completed: false },
        { text: 'Navigate to the supposed site', completed: false },
        { text: 'Confirm the discovery', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 100, easy: 200, medium: 400, hard: 800, legendary: 1600 };
        return { gold: baseGold[difficulty] || 300, xp: 400, items: ['legendary'], reputation: 4 };
      }
    },
    {
      type: 'exploration',
      subtype: 'investigate_anomaly',
      generateTitle: (rng) => {
        return 'Investigate a strange phenomenon';
      },
      generateDescription: (data, rng) => {
        return `Bizarre events hint at something unnatural occurring in a region. Adventurers are sought to investigate.`;
      },
      generateObjectives: (rng) => [
        { text: 'Travel to the anomaly location', completed: false },
        { text: 'Research the cause', completed: false },
        { text: 'Resolve or contain the phenomenon', completed: false }
      ],
      suggestRewards: (difficulty) => {
        const baseGold = { trivial: 75, easy: 150, medium: 300, hard: 600, legendary: 1200 };
        return { gold: baseGold[difficulty] || 250, xp: 350, items: [], reputation: 3 };
      }
    }
  ];

  // ============================================================================
  // QUEST BOARD
  // ============================================================================

  class QuestBoard {
    constructor() {
      this.quests = [];
      this.nextId = 1;
    }

    generateQuests(data, count, rng = Math.random) {
      const newQuests = [];

      for (let i = 0; i < count; i++) {
        const template = QUEST_TEMPLATES[Math.floor(rng() * QUEST_TEMPLATES.length)];
        const difficulty = this._selectDifficulty(rng);

        const giver = data.npcs && data.npcs.length > 0
          ? data.npcs[Math.floor(rng() * data.npcs.length)].name
          : 'Unknown Benefactor';

        const region = data.cities && data.cities.length > 0
          ? data.cities[Math.floor(rng() * data.cities.length)].region
          : 'Unknown Region';

        const faction = data.factions && data.factions.length > 0
          ? data.factions[Math.floor(rng() * data.factions.length)].name
          : null;

        const quest = {
          id: this.nextId++,
          title: template.generateTitle(rng),
          type: template.type,
          subtype: template.subtype,
          status: 'available',
          urgency: Math.ceil(rng() * 5),
          faction: faction,
          region: region,
          giver: giver,
          description: template.generateDescription(data, rng),
          objectives: template.generateObjectives(rng),
          rewards: template.suggestRewards(difficulty),
          deadline: null,
          difficulty: difficulty,
          chain: null,
          prerequisite: null,
          discoveredBy: ['rumor', 'notice_board', 'npc'][Math.floor(rng() * 3)],
          lore: '',
          createdDay: 0
        };

        this.quests.push(quest);
        newQuests.push(quest);
      }

      return newQuests;
    }

    _selectDifficulty(rng) {
      const roll = rng();
      if (roll < 0.15) return 'trivial';
      if (roll < 0.35) return 'easy';
      if (roll < 0.65) return 'medium';
      if (roll < 0.85) return 'hard';
      return 'legendary';
    }

    acceptQuest(questId) {
      const quest = this.quests.find(q => q.id === questId);
      if (!quest) throw new Error(`Quest ${questId} not found`);
      quest.status = 'active';
      return quest;
    }

    completeObjective(questId, objectiveIndex) {
      const quest = this.quests.find(q => q.id === questId);
      if (!quest) throw new Error(`Quest ${questId} not found`);
      if (quest.objectives[objectiveIndex]) {
        quest.objectives[objectiveIndex].completed = true;
      }
      return quest;
    }

    completeQuest(questId) {
      const quest = this.quests.find(q => q.id === questId);
      if (!quest) throw new Error(`Quest ${questId} not found`);
      quest.status = 'completed';
      return { quest, rewards: quest.rewards };
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
  // EXPORTS
  // ============================================================================

  window.DowntimeEngine = DowntimeEngine;
  window.DOWNTIME_ACTIVITIES = DOWNTIME_ACTIVITIES;
  window.QuestBoard = QuestBoard;
  window.QUEST_TEMPLATES = QUEST_TEMPLATES;

})();
