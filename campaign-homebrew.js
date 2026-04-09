/**
 * Homebrew Workshop System
 * Self-contained D&D homebrew creation and management system
 * Supports custom monsters, items, spells, and NPCs with templates and validation
 */

(function() {
  'use strict';

  // ============================================================================
  // TEMPLATES
  // ============================================================================

  const MONSTER_TEMPLATES = {
    humanoid_warrior: {
      name: 'Humanoid Warrior',
      size: 'Medium',
      type: 'humanoid',
      alignment: 'any',
      ac: 12,
      hp: 27,
      speed: '30 ft.',
      stats: { str: 16, dex: 13, con: 15, int: 10, wis: 11, cha: 10 },
      saves: [],
      skills: [],
      vulnerabilities: [],
      resistances: [],
      immunities: [],
      senses: 'passive Perception 10',
      languages: 'any',
      cr: 1,
      xp: 200,
      traits: [
        { name: 'Example Trait', desc: 'This is a placeholder trait. Edit as needed.' }
      ],
      actions: [
        { name: 'Longsword', desc: 'Melee Weapon Attack', attack: 5, damage: '1d8+3' }
      ],
      legendaryActions: [],
      lairActions: [],
      description: 'A typical humanoid warrior. Customize as needed.'
    },
    beast: {
      name: 'Wild Beast',
      size: 'Large',
      type: 'beast',
      alignment: 'unaligned',
      ac: 12,
      hp: 22,
      speed: '40 ft.',
      stats: { str: 15, dex: 14, con: 14, int: 2, wis: 12, cha: 6 },
      saves: [],
      skills: [],
      vulnerabilities: [],
      resistances: [],
      immunities: [],
      senses: 'darkvision 60 ft., passive Perception 11',
      languages: '',
      cr: 1,
      xp: 200,
      traits: [
        { name: 'Keen Senses', desc: 'The beast has advantage on Wisdom checks.' }
      ],
      actions: [
        { name: 'Bite', desc: 'Melee Weapon Attack', attack: 4, damage: '1d10+2' }
      ],
      legendaryActions: [],
      lairActions: [],
      description: 'A dangerous wild creature.'
    },
    undead: {
      name: 'Undead Minion',
      size: 'Medium',
      type: 'undead',
      alignment: 'chaotic evil',
      ac: 11,
      hp: 11,
      speed: '20 ft.',
      stats: { str: 13, dex: 11, con: 16, int: 3, wis: 6, cha: 5 },
      saves: [],
      skills: [],
      vulnerabilities: [],
      resistances: ['cold', 'lightning', 'poison'],
      immunities: ['poison', 'psychic'],
      senses: 'darkvision 60 ft., passive Perception 8',
      languages: 'understands those it knew in life',
      cr: 0.25,
      xp: 50,
      traits: [
        { name: 'Undead Fortitude', desc: 'When reduced to 0 HP, rolls CON save to remain standing.' }
      ],
      actions: [
        { name: 'Slam', desc: 'Melee Weapon Attack', attack: 3, damage: '1d4+1' }
      ],
      legendaryActions: [],
      lairActions: [],
      description: 'An undead creature bound to unlife.'
    },
    dragon: {
      name: 'Young Dragon',
      size: 'Large',
      type: 'dragon',
      alignment: 'chaotic evil',
      ac: 14,
      hp: 110,
      speed: '40 ft., fly 80 ft.',
      stats: { str: 19, dex: 10, con: 17, int: 16, wis: 13, cha: 15 },
      saves: [{ stat: 'dex', bonus: 3 }, { stat: 'con', bonus: 5 }, { stat: 'wis', bonus: 4 }],
      skills: [{ name: 'Perception', bonus: 7 }],
      vulnerabilities: [],
      resistances: [],
      immunities: ['fire'],
      senses: 'blindsight 60 ft., darkvision 120 ft., passive Perception 17',
      languages: 'Draconic',
      cr: 6,
      xp: 2300,
      traits: [
        { name: 'Draconic Resilience', desc: 'Damage reduction based on draconic heritage.' }
      ],
      actions: [
        { name: 'Multiattack', desc: 'Bite and two claw attacks.' },
        { name: 'Bite', desc: 'Melee Weapon Attack', attack: 7, damage: '2d10+4' }
      ],
      legendaryActions: [
        { name: 'Tail', desc: 'Melee Weapon Attack', attack: 7, damage: '2d8+4' }
      ],
      lairActions: [],
      description: 'A draconic predator of immense power.'
    },
    fiend: {
      name: 'Lesser Fiend',
      size: 'Medium',
      type: 'fiend',
      alignment: 'chaotic evil',
      ac: 13,
      hp: 44,
      speed: '30 ft., fly 60 ft.',
      stats: { str: 14, dex: 16, con: 15, int: 11, wis: 12, cha: 14 },
      saves: [],
      skills: [{ name: 'Deception', bonus: 4 }],
      vulnerabilities: [],
      resistances: ['cold', 'fire', 'lightning'],
      immunities: ['poison'],
      senses: 'darkvision 120 ft., passive Perception 11',
      languages: 'Infernal, telepathy 120 ft.',
      cr: 3,
      xp: 700,
      traits: [
        { name: 'Infernal Resistance', desc: 'Resistance to fire damage.' }
      ],
      actions: [
        { name: 'Claw', desc: 'Melee Weapon Attack', attack: 5, damage: '1d6+3' }
      ],
      legendaryActions: [],
      lairActions: [],
      description: 'A creature from the lower planes.'
    },
    aberration: {
      name: 'Aberrant Being',
      size: 'Medium',
      type: 'aberration',
      alignment: 'neutral evil',
      ac: 13,
      hp: 32,
      speed: '30 ft.',
      stats: { str: 10, dex: 14, con: 12, int: 16, wis: 13, cha: 8 },
      saves: [],
      skills: [{ name: 'Arcana', bonus: 4 }],
      vulnerabilities: [],
      resistances: [],
      immunities: [],
      senses: 'darkvision 60 ft., passive Perception 11',
      languages: 'Deep Speech, telepathy 120 ft.',
      cr: 2,
      xp: 450,
      traits: [
        { name: 'Strange Mind', desc: 'Advantage on saving throws against divination.' }
      ],
      actions: [
        { name: 'Psychic Lash', desc: 'Melee Spell Attack', attack: 4, damage: '1d8+2' }
      ],
      legendaryActions: [],
      lairActions: [],
      description: 'A being from beyond the natural world.'
    },
    construct: {
      name: 'Magical Construct',
      size: 'Medium',
      type: 'construct',
      alignment: 'unaligned',
      ac: 14,
      hp: 52,
      speed: '30 ft.',
      stats: { str: 16, dex: 12, con: 14, int: 4, wis: 10, cha: 6 },
      saves: [],
      skills: [],
      vulnerabilities: [],
      resistances: [],
      immunities: ['poison', 'psychic', 'exhaustion'],
      senses: 'darkvision 60 ft., passive Perception 10',
      languages: 'understands creator\'s commands',
      cr: 2,
      xp: 450,
      traits: [
        { name: 'Magical Immunity', desc: 'Immune to spells that allow saving throws.' }
      ],
      actions: [
        { name: 'Slam', desc: 'Melee Weapon Attack', attack: 5, damage: '1d8+3' }
      ],
      legendaryActions: [],
      lairActions: [],
      description: 'An artificial being created through magic.'
    },
    elemental: {
      name: 'Elemental Spirit',
      size: 'Medium',
      type: 'elemental',
      alignment: 'neutral',
      ac: 12,
      hp: 39,
      speed: '50 ft. (or 0 ft. if bound)',
      stats: { str: 14, dex: 14, con: 13, int: 6, wis: 10, cha: 6 },
      saves: [],
      skills: [],
      vulnerabilities: [],
      resistances: [],
      immunities: ['exhaustion', 'grappled', 'paralyzed', 'petrified', 'poisoned', 'restrained'],
      senses: 'darkvision 60 ft., passive Perception 10',
      languages: 'Primordial',
      cr: 2,
      xp: 450,
      traits: [
        { name: 'Elemental Form', desc: 'Can enter a hostile creature\'s space and stop there.' }
      ],
      actions: [
        { name: 'Slam', desc: 'Melee Weapon Attack', attack: 4, damage: '1d8+2' }
      ],
      legendaryActions: [],
      lairActions: [],
      description: 'A manifestation of elemental power.'
    }
  };

  const ITEM_TEMPLATES = {
    sword: {
      name: 'Custom Sword',
      type: 'weapon',
      rarity: 'uncommon',
      attunement: false,
      description: 'A finely crafted blade.',
      properties: ['melee', 'versatile'],
      damage: '1d8',
      damageType: 'slashing',
      ac: null,
      charges: null,
      rechargeCondition: null,
      weight: 3,
      value: 15,
      cursed: false,
      curseEffect: null,
      lore: 'Forged by skilled smiths.'
    },
    staff: {
      name: 'Custom Staff',
      type: 'wand',
      rarity: 'rare',
      attunement: true,
      description: 'A staff crackling with magical energy.',
      properties: ['magical', 'versatile'],
      damage: '1d6',
      damageType: 'force',
      ac: null,
      charges: 6,
      rechargeCondition: 'at dawn',
      weight: 4,
      value: 500,
      cursed: false,
      curseEffect: null,
      lore: 'Created by an ancient mage.'
    },
    ring: {
      name: 'Custom Ring',
      type: 'ring',
      rarity: 'rare',
      attunement: true,
      description: 'An ornate ring of power.',
      properties: ['magical'],
      damage: null,
      damageType: null,
      ac: null,
      charges: null,
      rechargeCondition: null,
      weight: 0,
      value: 300,
      cursed: false,
      curseEffect: null,
      lore: 'Passed down through generations.'
    },
    amulet: {
      name: 'Custom Amulet',
      type: 'wondrous',
      rarity: 'uncommon',
      attunement: true,
      description: 'A protective amulet.',
      properties: ['magical', 'protective'],
      damage: null,
      damageType: null,
      ac: null,
      charges: null,
      rechargeCondition: null,
      weight: 0.5,
      value: 200,
      cursed: false,
      curseEffect: null,
      lore: 'A traveler\'s companion.'
    },
    potion: {
      name: 'Custom Potion',
      type: 'potion',
      rarity: 'common',
      attunement: false,
      description: 'A mysterious liquid in a vial.',
      properties: ['consumable', 'magical'],
      damage: null,
      damageType: null,
      ac: null,
      charges: 1,
      rechargeCondition: 'consumed on use',
      weight: 0.5,
      value: 50,
      cursed: false,
      curseEffect: null,
      lore: 'Brewed by alchemists.'
    },
    armor: {
      name: 'Custom Armor',
      type: 'armor',
      rarity: 'uncommon',
      attunement: false,
      description: 'Protective armor.',
      properties: ['protection'],
      damage: null,
      damageType: null,
      ac: 15,
      charges: null,
      rechargeCondition: null,
      weight: 45,
      value: 400,
      cursed: false,
      curseEffect: null,
      lore: 'Forged for heroes.'
    },
    shield: {
      name: 'Custom Shield',
      type: 'armor',
      rarity: 'uncommon',
      attunement: false,
      description: 'A defensive shield.',
      properties: ['protection'],
      damage: null,
      damageType: null,
      ac: 2,
      charges: null,
      rechargeCondition: null,
      weight: 6,
      value: 100,
      cursed: false,
      curseEffect: null,
      lore: 'A warrior\'s steadfast companion.'
    },
    boots: {
      name: 'Custom Boots',
      type: 'wondrous',
      rarity: 'uncommon',
      attunement: true,
      description: 'Enchanted boots.',
      properties: ['magical', 'mobility'],
      damage: null,
      damageType: null,
      ac: null,
      charges: null,
      rechargeCondition: null,
      weight: 1,
      value: 150,
      cursed: false,
      curseEffect: null,
      lore: 'Swift footwear for quick escapes.'
    },
    cloak: {
      name: 'Custom Cloak',
      type: 'wondrous',
      rarity: 'uncommon',
      attunement: true,
      description: 'A mysterious cloak.',
      properties: ['magical', 'concealment'],
      damage: null,
      damageType: null,
      ac: null,
      charges: null,
      rechargeCondition: null,
      weight: 1,
      value: 200,
      cursed: false,
      curseEffect: null,
      lore: 'Woven from shadows.'
    },
    scroll: {
      name: 'Custom Scroll',
      type: 'scroll',
      rarity: 'varies',
      attunement: false,
      description: 'A scroll containing magical knowledge.',
      properties: ['consumable', 'magical'],
      damage: null,
      damageType: null,
      ac: null,
      charges: 1,
      rechargeCondition: 'consumed on use',
      weight: 0,
      value: 100,
      cursed: false,
      curseEffect: null,
      lore: 'Ancient magic preserved.'
    }
  };

  const SPELL_TEMPLATES = {
    damage_blast: {
      name: 'Custom Blast',
      level: 2,
      school: 'evocation',
      castingTime: '1 action',
      range: '60 feet',
      components: { v: true, s: true, m: false, materialDesc: null },
      duration: 'Instantaneous',
      concentration: false,
      ritual: false,
      description: 'You hurl magical energy at a target. Make a spell attack.',
      higherLevels: 'When you cast this spell using a spell slot of 3rd level or higher, increase damage by 1d6 for each slot level above 2nd.',
      classes: ['sorcerer', 'wizard'],
      damage: '3d6',
      damageType: 'force',
      saveType: null,
      saveEffect: null
    },
    healing_touch: {
      name: 'Custom Healing',
      level: 1,
      school: 'evocation',
      castingTime: '1 action',
      range: 'Touch',
      components: { v: true, s: true, m: false, materialDesc: null },
      duration: 'Instantaneous',
      concentration: false,
      ritual: false,
      description: 'A creature you touch regains hit points.',
      higherLevels: 'When you cast this spell using a spell slot of 2nd level or higher, the healing increases by 1d8 for each slot level above 1st.',
      classes: ['cleric', 'druid', 'paladin'],
      damage: null,
      damageType: null,
      saveType: null,
      saveEffect: null
    },
    buff: {
      name: 'Custom Buff',
      level: 1,
      school: 'transmutation',
      castingTime: '1 bonus action',
      range: '30 feet',
      components: { v: true, s: true, m: false, materialDesc: null },
      duration: '1 minute',
      concentration: true,
      ritual: false,
      description: 'A creature gains a benefit that helps it in combat.',
      higherLevels: 'Duration increases at higher levels.',
      classes: ['bard', 'cleric', 'sorcerer', 'wizard'],
      damage: null,
      damageType: null,
      saveType: null,
      saveEffect: null
    },
    debuff: {
      name: 'Custom Debuff',
      level: 1,
      school: 'enchantment',
      castingTime: '1 action',
      range: '60 feet',
      components: { v: true, s: true, m: false, materialDesc: null },
      duration: '1 minute',
      concentration: true,
      ritual: false,
      description: 'A creature you can see makes a save or is hindered.',
      higherLevels: 'The effect intensifies at higher levels.',
      classes: ['sorcerer', 'warlock', 'wizard'],
      damage: null,
      damageType: null,
      saveType: 'wisdom',
      saveEffect: 'half effect on success'
    },
    summon: {
      name: 'Custom Summon',
      level: 3,
      school: 'conjuration',
      castingTime: '1 action',
      range: '90 feet',
      components: { v: true, s: true, m: true, materialDesc: 'An offering worth at least 100 gp' },
      duration: '1 hour',
      concentration: true,
      ritual: false,
      description: 'You summon a creature to aid you in combat.',
      higherLevels: 'At higher levels, you can summon more powerful creatures.',
      classes: ['cleric', 'druid', 'sorcerer', 'wizard'],
      damage: null,
      damageType: null,
      saveType: null,
      saveEffect: null
    },
    utility: {
      name: 'Custom Utility',
      level: 1,
      school: 'transmutation',
      castingTime: '1 action',
      range: 'Touch',
      components: { v: true, s: true, m: false, materialDesc: null },
      duration: '1 hour',
      concentration: false,
      ritual: true,
      description: 'This spell provides a useful effect outside of combat.',
      higherLevels: null,
      classes: ['bard', 'cleric', 'druid', 'wizard'],
      damage: null,
      damageType: null,
      saveType: null,
      saveEffect: null
    }
  };

  const NPC_TEMPLATES = {
    noble: {
      name: 'Lord/Lady Name',
      race: 'human',
      class: 'aristocrat',
      level: 1,
      background: 'noble',
      personality: 'Dignified and commanding',
      ideal: 'Tradition and order',
      bond: 'Loyal to their bloodline',
      flaw: 'Disdain for commoners',
      appearance: 'Fine clothing and regalia',
      backstory: 'Born into privilege.',
      stats: { str: 10, dex: 12, con: 13, int: 14, wis: 12, cha: 15 },
      skills: [{ name: 'Insight', bonus: 1 }, { name: 'Persuasion', bonus: 4 }],
      equipment: ['fine clothes', 'signet ring'],
      spells: [],
      allies: [],
      enemies: [],
      secretMotivation: 'Power and influence'
    },
    merchant: {
      name: 'Trader Name',
      race: 'human',
      class: 'commoner',
      level: 1,
      background: 'merchant',
      personality: 'Cunning and shrewd',
      ideal: 'Profit and gain',
      bond: 'Devoted to their business',
      flaw: 'Greed drives their decisions',
      appearance: 'Practical, well-kept attire',
      backstory: 'Built their fortune from nothing.',
      stats: { str: 10, dex: 11, con: 12, int: 14, wis: 13, cha: 13 },
      skills: [{ name: 'Deception', bonus: 2 }, { name: 'Insight', bonus: 3 }],
      equipment: ['ledger', 'coin pouch'],
      spells: [],
      allies: [],
      enemies: [],
      secretMotivation: 'Wealth accumulation'
    },
    guard: {
      name: 'Guard Name',
      race: 'human',
      class: 'fighter',
      level: 2,
      background: 'soldier',
      personality: 'Disciplined and cautious',
      ideal: 'Protection and duty',
      bond: 'Loyal to their post',
      flaw: 'Follows orders without question',
      appearance: 'Armored, alert',
      backstory: 'Trained in the militia.',
      stats: { str: 15, dex: 12, con: 14, int: 10, wis: 12, cha: 10 },
      skills: [{ name: 'Perception', bonus: 3 }, { name: 'Insight', bonus: 2 }],
      equipment: ['spear', 'armor', 'shield'],
      spells: [],
      allies: [],
      enemies: [],
      secretMotivation: 'Safety and security'
    },
    scholar: {
      name: 'Scholar Name',
      race: 'elf',
      class: 'wizard',
      level: 3,
      background: 'sage',
      personality: 'Intellectual and curious',
      ideal: 'Knowledge above all',
      bond: 'Protective of their library',
      flaw: 'Arrogant about their intelligence',
      appearance: 'Robes and glasses, many books',
      backstory: 'Spent years studying magic.',
      stats: { str: 9, dex: 11, con: 12, int: 16, wis: 14, cha: 11 },
      skills: [{ name: 'Arcana', bonus: 5 }, { name: 'Investigation', bonus: 5 }],
      equipment: ['spellbook', 'quill', 'ink'],
      spells: ['mage hand', 'light', 'magic missile'],
      allies: [],
      enemies: [],
      secretMotivation: 'Uncovering forbidden knowledge'
    },
    criminal: {
      name: 'Criminal Name',
      race: 'halfling',
      class: 'rogue',
      level: 2,
      background: 'criminal',
      personality: 'Sneaky and opportunistic',
      ideal: 'Freedom at any cost',
      bond: 'Loyal to their crew',
      flaw: 'Cannot resist a lucrative score',
      appearance: 'Dark, inconspicuous clothing',
      backstory: 'Made a life in the shadows.',
      stats: { str: 10, dex: 15, con: 11, int: 12, wis: 10, cha: 12 },
      skills: [{ name: 'Stealth', bonus: 4 }, { name: 'Sleight of Hand', bonus: 4 }],
      equipment: ['lockpicks', 'dagger', 'rope'],
      spells: [],
      allies: [],
      enemies: [],
      secretMotivation: 'Escaping their past'
    },
    priest: {
      name: 'Priest Name',
      race: 'dwarf',
      class: 'cleric',
      level: 3,
      background: 'acolyte',
      personality: 'Compassionate and devout',
      ideal: 'Service to the divine',
      bond: 'Devoted to their temple',
      flaw: 'Too judgmental of sinners',
      appearance: 'Holy vestments',
      backstory: 'Called to the priesthood.',
      stats: { str: 12, dex: 10, con: 14, int: 11, wis: 15, cha: 13 },
      skills: [{ name: 'Medicine', bonus: 4 }, { name: 'Insight', bonus: 4 }],
      equipment: ['holy symbol', 'prayer book'],
      spells: ['bless', 'cure wounds', 'healing word'],
      allies: [],
      enemies: [],
      secretMotivation: 'Deepening their faith'
    },
    farmer: {
      name: 'Farmer Name',
      race: 'human',
      class: 'commoner',
      level: 1,
      background: 'folk hero',
      personality: 'Hardworking and practical',
      ideal: 'Community welfare',
      bond: 'Protective of their land',
      flaw: 'Suspicious of outsiders',
      appearance: 'Work clothes, sun-weathered',
      backstory: 'Worked the land their whole life.',
      stats: { str: 14, dex: 10, con: 14, int: 10, wis: 12, cha: 10 },
      skills: [{ name: 'Animal Handling', bonus: 3 }, { name: 'Survival', bonus: 3 }],
      equipment: ['tools', 'rope', 'lantern'],
      spells: [],
      allies: [],
      enemies: [],
      secretMotivation: 'Protecting family and crops'
    },
    adventurer: {
      name: 'Adventurer Name',
      race: 'human',
      class: 'fighter',
      level: 4,
      background: 'soldier',
      personality: 'Brave and experienced',
      ideal: 'Adventure and glory',
      bond: 'Protective of companions',
      flaw: 'Reckless in pursuit of danger',
      appearance: 'Travel-worn but sturdy equipment',
      backstory: 'Years of adventure on the road.',
      stats: { str: 16, dex: 13, con: 15, int: 11, wis: 12, cha: 12 },
      skills: [{ name: 'Survival', bonus: 3 }, { name: 'Athletics', bonus: 5 }],
      equipment: ['sword', 'shield', 'bedroll', 'rope'],
      spells: [],
      allies: [],
      enemies: [],
      secretMotivation: 'Redemption and purpose'
    }
  };

  const CLASS_FEATURE_TEMPLATES = {
    fighting_style: {
      name: 'Custom Fighting Style',
      featureType: 'class',
      className: 'Fighter',
      level: 1,
      description: 'You adopt a particular style of fighting as your specialty.',
      mechanics: 'Choose a benefit: +2 to damage with melee weapons, +2 to AC when wearing armor, etc.',
      prerequisite: 'None',
      source: 'homebrew'
    },
    channel_divinity: {
      name: 'Custom Channel Divinity',
      featureType: 'class',
      className: 'Cleric',
      level: 2,
      description: 'You gain the ability to channel divine energy directly from your deity.',
      mechanics: 'As an action, you present your holy symbol and invoke divine power. Describe the effect.',
      prerequisite: 'Cleric Level 2',
      source: 'homebrew'
    },
    metamagic: {
      name: 'Custom Metamagic',
      featureType: 'class',
      className: 'Sorcerer',
      level: 3,
      description: 'You can twist your spells to suit your needs using sorcery points.',
      mechanics: 'When you cast a spell, you can spend sorcery points to modify it. Describe the modification.',
      prerequisite: 'Sorcerer Level 3',
      source: 'homebrew'
    },
    invocation: {
      name: 'Custom Eldritch Invocation',
      featureType: 'class',
      className: 'Warlock',
      level: 2,
      description: 'In your study of occult lore, you have unearthed eldritch invocations.',
      mechanics: 'You gain a passive or activatable ability. Describe its effect.',
      prerequisite: 'Warlock Level 2',
      source: 'homebrew'
    },
    ki_technique: {
      name: 'Custom Ki Technique',
      featureType: 'class',
      className: 'Monk',
      level: 3,
      description: 'You channel ki into a specialized martial technique.',
      mechanics: 'You can spend ki points to activate this technique. Describe the effect and ki cost.',
      prerequisite: 'Monk Level 3',
      source: 'homebrew'
    },
    wild_shape_form: {
      name: 'Custom Wild Shape Form',
      featureType: 'class',
      className: 'Druid',
      level: 2,
      description: 'You can use your action to magically assume a new shape.',
      mechanics: 'You transform into a custom creature. Define its stats, abilities, and limitations.',
      prerequisite: 'Druid Level 2',
      source: 'homebrew'
    },
    subclass_feature: {
      name: 'Custom Subclass Feature',
      featureType: 'subclass',
      className: '',
      subclassName: '',
      level: 3,
      description: 'A specialized ability gained through your chosen archetype.',
      mechanics: 'Describe the mechanical effect of this subclass feature.',
      prerequisite: 'Level 3 in parent class',
      source: 'homebrew'
    },
    rage_feature: {
      name: 'Custom Rage Feature',
      featureType: 'class',
      className: 'Barbarian',
      level: 3,
      description: 'Your rage manifests in a unique way tied to your primal path.',
      mechanics: 'While raging, you gain an additional benefit. Describe the effect.',
      prerequisite: 'Barbarian Level 3',
      source: 'homebrew'
    }
  };

  const FEAT_TEMPLATES = {
    combat_feat: {
      name: 'Custom Combat Feat',
      category: 'combat',
      prerequisite: 'None',
      description: 'You have trained extensively in a specialized combat technique.',
      benefits: [
        'Increase your Strength or Dexterity score by 1, to a maximum of 20.',
        'Describe your first combat benefit here.',
        'Describe your second combat benefit here.'
      ],
      source: 'homebrew'
    },
    magic_feat: {
      name: 'Custom Magic Feat',
      category: 'magic',
      prerequisite: 'Spellcasting or Pact Magic feature',
      description: 'Your study of magic has granted you special capabilities.',
      benefits: [
        'You learn two cantrips of your choice from any spell list.',
        'Describe your magical benefit here.'
      ],
      source: 'homebrew'
    },
    skill_feat: {
      name: 'Custom Skill Feat',
      category: 'skill',
      prerequisite: 'None',
      description: 'You have honed a particular set of skills to remarkable proficiency.',
      benefits: [
        'Increase one ability score of your choice by 1, to a maximum of 20.',
        'You gain proficiency in one skill of your choice.',
        'Describe your additional skill benefit here.'
      ],
      source: 'homebrew'
    },
    racial_feat: {
      name: 'Custom Racial Feat',
      category: 'racial',
      prerequisite: 'Specific race required',
      description: 'You have unlocked abilities tied to your heritage.',
      benefits: [
        'Increase one ability score of your choice by 1, to a maximum of 20.',
        'Describe your racial benefit here.'
      ],
      source: 'homebrew'
    },
    defensive_feat: {
      name: 'Custom Defensive Feat',
      category: 'defensive',
      prerequisite: 'None',
      description: 'You have trained to protect yourself with exceptional skill.',
      benefits: [
        'Increase your Constitution score by 1, to a maximum of 20.',
        'Describe your defensive benefit here.'
      ],
      source: 'homebrew'
    },
    utility_feat: {
      name: 'Custom Utility Feat',
      category: 'utility',
      prerequisite: 'None',
      description: 'You have developed a versatile set of abilities useful in many situations.',
      benefits: [
        'Describe your first utility benefit here.',
        'Describe your second utility benefit here.'
      ],
      source: 'homebrew'
    }
  };

  // ============================================================================
  // HOMEBREWWORKSHOP CLASS
  // ============================================================================

  class HomebrewWorkshop {
    constructor() {
      this.items = new Map();
      this.items.set('monsters', new Map());
      this.items.set('items', new Map());
      this.items.set('spells', new Map());
      this.items.set('npcs', new Map());
      this.items.set('classFeatures', new Map());
      this.items.set('feats', new Map());
      this._idCounters = {
        monsters: 0,
        items: 0,
        spells: 0,
        npcs: 0,
        classFeatures: 0,
        feats: 0
      };
    }

    /**
     * Create a new homebrew item from a template
     * @param {string} type - Type: 'monsters', 'items', 'spells', 'npcs'
     * @param {string} templateId - Template key to start from
     * @returns {object} Editable homebrew object with _id and _type metadata
     */
    create(type, templateId) {
      if (!this.items.has(type)) {
        throw new Error(`Unknown type: ${type}`);
      }

      let template;
      switch (type) {
        case 'monsters':
          template = MONSTER_TEMPLATES[templateId];
          break;
        case 'items':
          template = ITEM_TEMPLATES[templateId];
          break;
        case 'spells':
          template = SPELL_TEMPLATES[templateId];
          break;
        case 'npcs':
          template = NPC_TEMPLATES[templateId];
          break;
        case 'classFeatures':
          template = CLASS_FEATURE_TEMPLATES[templateId];
          break;
        case 'feats':
          template = FEAT_TEMPLATES[templateId];
          break;
        default:
          throw new Error(`Unknown type: ${type}`);
      }

      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      const id = ++this._idCounters[type];
      const obj = JSON.parse(JSON.stringify(template));
      obj._id = id;
      obj._type = type;
      obj._createdAt = new Date().toISOString();
      obj._modifiedAt = new Date().toISOString();

      return obj;
    }

    /**
     * Save a homebrew item to storage
     * @param {string} type - Type of item
     * @param {object} item - Item object with _id and _type
     */
    save(type, item) {
      if (!item._id || !item._type) {
        throw new Error('Item must have _id and _type metadata');
      }

      item._modifiedAt = new Date().toISOString();

      // Validate based on type
      this._validate(type, item);

      this.items.get(type).set(item._id, item);
    }

    /**
     * Delete a homebrew item
     * @param {string} type - Type of item
     * @param {number} itemId - Item ID
     */
    delete(type, itemId) {
      if (!this.items.has(type)) {
        throw new Error(`Unknown type: ${type}`);
      }
      this.items.get(type).delete(itemId);
    }

    /**
     * Get all items of a type
     * @param {string} type - Type of item
     * @returns {array} Array of items
     */
    getAll(type) {
      if (!this.items.has(type)) {
        throw new Error(`Unknown type: ${type}`);
      }
      return Array.from(this.items.get(type).values());
    }

    /**
     * Search across all homebrew items
     * @param {string} query - Search term
     * @returns {array} Matching items with type metadata
     */
    search(query) {
      const results = [];
      const q = query.toLowerCase();

      for (const [type, typeMap] of this.items) {
        for (const item of typeMap.values()) {
          if (item.name && item.name.toLowerCase().includes(q)) {
            results.push(item);
          }
        }
      }

      return results;
    }

    /**
     * Export item as JSON
     * @param {string} type - Type of item
     * @param {number} itemId - Item ID
     * @returns {string} JSON string
     */
    export(type, itemId) {
      const item = this.items.get(type)?.get(itemId);
      if (!item) {
        throw new Error(`Item not found: ${type}/${itemId}`);
      }
      return JSON.stringify(item, null, 2);
    }

    /**
     * Import homebrew from JSON string
     * @param {string} jsonString - JSON data
     * @returns {object} Imported item
     */
    import(jsonString) {
      try {
        const item = JSON.parse(jsonString);
        if (!item._type || !item._id) {
          throw new Error('Invalid homebrew format');
        }

        // Assign new ID to avoid conflicts
        item._id = ++this._idCounters[item._type];
        item._importedAt = new Date().toISOString();

        this.save(item._type, item);
        return item;
      } catch (e) {
        throw new Error(`Import failed: ${e.message}`);
      }
    }

    /**
     * Calculate challenge rating for a monster
     * @param {object} monster - Monster object
     * @returns {number} Challenge rating
     */
    calculateCR(monster) {
      if (monster.type !== 'monsters') {
        throw new Error('calculateCR only works with monsters');
      }

      // Offensive CR: based on damage per round and attack bonus
      let offensiveCR = 0;
      let avgDamagePerRound = 0;

      if (monster.actions && monster.actions.length > 0) {
        // Simple damage parsing (e.g., "1d8+3")
        for (const action of monster.actions) {
          if (action.damage) {
            avgDamagePerRound += this._averageDamage(action.damage);
          }
        }
      }

      offensiveCR = Math.ceil(avgDamagePerRound / 5);

      // Defensive CR: based on AC and HP
      const acBonus = monster.ac - 10;
      const hpBonus = Math.floor(monster.hp / 10);
      let defensiveCR = acBonus + hpBonus;

      // Average CR
      return Math.round((offensiveCR + defensiveCR) / 2);
    }

    /**
     * Suggest appropriate spell level based on effects
     * @param {object} spell - Spell object
     * @returns {number} Suggested level (0-9)
     */
    calculateSpellLevel(spell) {
      if (spell._type !== 'spells') {
        throw new Error('calculateSpellLevel only works with spells');
      }

      let level = 0;

      // Level up based on damage
      if (spell.damage) {
        const dmgDice = parseInt(spell.damage.match(/\d+/)?.[0] || 1);
        level = Math.ceil(dmgDice / 2);
      }

      // Adjust for concentration
      if (spell.concentration) level += 1;

      // Cap at 9
      return Math.min(9, Math.max(0, level));
    }

    /**
     * Generate D&D format stat block text
     * @param {object} monster - Monster object
     * @returns {string} Formatted stat block
     */
    generateStatBlock(monster) {
      let block = '';
      block += `# ${monster.name}\n`;
      block += `*${monster.size} ${monster.type}, ${monster.alignment}*\n\n`;
      block += `**Armor Class** ${monster.ac}\n`;
      block += `**Hit Points** ${monster.hp}\n`;
      block += `**Speed** ${monster.speed}\n\n`;

      // Ability scores
      const stats = monster.stats;
      block += `| STR | DEX | CON | INT | WIS | CHA |\n`;
      block += `|:---:|:---:|:---:|:---:|:---:|:---:|\n`;
      block += `| ${stats.str} | ${stats.dex} | ${stats.con} | ${stats.int} | ${stats.wis} | ${stats.cha} |\n\n`;

      // Senses
      block += `**Senses** ${monster.senses}\n`;
      block += `**Languages** ${monster.languages || 'none'}\n`;
      block += `**Challenge** ${monster.cr} (${monster.xp} XP)\n\n`;

      // Traits
      if (monster.traits && monster.traits.length > 0) {
        block += `## Traits\n\n`;
        for (const trait of monster.traits) {
          block += `***${trait.name}.*** ${trait.desc}\n\n`;
        }
      }

      // Actions
      if (monster.actions && monster.actions.length > 0) {
        block += `## Actions\n\n`;
        for (const action of monster.actions) {
          block += `***${action.name}.*** ${action.desc}`;
          if (action.attack) block += ` (+${action.attack} to hit)`;
          if (action.damage) block += `, ${action.damage}`;
          block += '\n\n';
        }
      }

      // Legendary actions
      if (monster.legendaryActions && monster.legendaryActions.length > 0) {
        block += `## Legendary Actions\n\n`;
        for (const action of monster.legendaryActions) {
          block += `***${action.name}.*** ${action.desc}\n\n`;
        }
      }

      return block;
    }

    /**
     * Serialize workshop data
     * @returns {string} JSON string of all workshop data
     */
    serialize() {
      const data = {
        monsters: Array.from(this.items.get('monsters').values()),
        items: Array.from(this.items.get('items').values()),
        spells: Array.from(this.items.get('spells').values()),
        npcs: Array.from(this.items.get('npcs').values()),
        classFeatures: Array.from(this.items.get('classFeatures').values()),
        feats: Array.from(this.items.get('feats').values()),
        _idCounters: this._idCounters
      };
      return JSON.stringify(data, null, 2);
    }

    /**
     * Deserialize workshop data
     * @param {string} jsonString - JSON data
     */
    deserialize(jsonString) {
      try {
        const data = JSON.parse(jsonString);

        if (data.monsters) {
          for (const m of data.monsters) {
            this.items.get('monsters').set(m._id, m);
          }
        }
        if (data.items) {
          for (const i of data.items) {
            this.items.get('items').set(i._id, i);
          }
        }
        if (data.spells) {
          for (const s of data.spells) {
            this.items.get('spells').set(s._id, s);
          }
        }
        if (data.npcs) {
          for (const n of data.npcs) {
            this.items.get('npcs').set(n._id, n);
          }
        }
        if (data.classFeatures) {
          for (const cf of data.classFeatures) {
            this.items.get('classFeatures').set(cf._id, cf);
          }
        }
        if (data.feats) {
          for (const f of data.feats) {
            this.items.get('feats').set(f._id, f);
          }
        }

        this._idCounters = data._idCounters || this._idCounters;
      } catch (e) {
        throw new Error(`Deserialization failed: ${e.message}`);
      }
    }

    // ========================================================================
    // PRIVATE HELPERS
    // ========================================================================

    /**
     * Validate homebrew data
     * @private
     */
    _validate(type, item) {
      if (!item.name || item.name.trim().length === 0) {
        throw new Error('Item must have a name');
      }

      if (type === 'monsters') {
        if (item.cr === undefined || item.cr === null) {
          throw new Error('Monster must have a CR');
        }
      }

      if (type === 'spells') {
        if (item.level === undefined || item.level === null) {
          throw new Error('Spell must have a level (0-9)');
        }
        if (item.level < 0 || item.level > 9) {
          throw new Error('Spell level must be 0-9');
        }
      }
    }

    /**
     * Parse damage string and return average
     * @private
     */
    _averageDamage(damageStr) {
      if (!damageStr) return 0;

      // Parse "1d8+3" format
      const match = damageStr.match(/(\d+)d(\d+)(?:\+(\d+))?/);
      if (!match) return 0;

      const dice = parseInt(match[1]);
      const sides = parseInt(match[2]);
      const bonus = parseInt(match[3] || 0);

      // Average of a die is (sides + 1) / 2
      return dice * ((sides + 1) / 2) + bonus;
    }
  }

  // ============================================================================
  // EXPORTS
  // ============================================================================

  window.HomebrewWorkshop = HomebrewWorkshop;
  window.MONSTER_TEMPLATES = MONSTER_TEMPLATES;
  window.ITEM_TEMPLATES = ITEM_TEMPLATES;
  window.SPELL_TEMPLATES = SPELL_TEMPLATES;
  window.NPC_TEMPLATES = NPC_TEMPLATES;
  window.CLASS_FEATURE_TEMPLATES = CLASS_FEATURE_TEMPLATES;
  window.FEAT_TEMPLATES = FEAT_TEMPLATES;
})();
