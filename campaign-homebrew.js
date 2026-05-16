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
     * @param {object} [opts] - Optional options: { types: string[], limit: number, fuzzy: boolean }
     * @returns {array} Matching items with type metadata: { item, type, score }
     */
    search(query, opts) {
      const results = [];
      if (!query || typeof query !== 'string') return results;
      const q = query.trim().toLowerCase();
      if (!q) return results;

      const options = opts || {};
      const typeFilter = Array.isArray(options.types) && options.types.length > 0 ? new Set(options.types) : null;
      const limit = typeof options.limit === 'number' && options.limit > 0 ? options.limit : Infinity;

      for (const [type, typeMap] of this.items) {
        if (typeFilter && !typeFilter.has(type)) continue;
        for (const item of typeMap.values()) {
          let score = 0;
          const nameLc = item.name ? String(item.name).toLowerCase() : '';
          if (nameLc === q) score = 100;
          else if (nameLc.startsWith(q)) score = 80;
          else if (nameLc.includes(q)) score = 60;
          else if (item.description && String(item.description).toLowerCase().includes(q)) score = 30;
          else if (item.type && String(item.type).toLowerCase().includes(q)) score = 20;
          else if (item.category && String(item.category).toLowerCase().includes(q)) score = 20;

          if (score > 0) {
            results.push({ item, type, score, name: item.name || '(unnamed)' });
          }
        }
      }

      results.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
      return results.slice(0, limit);
    }

    /**
     * Count items by type
     * @returns {object} Type → count map
     */
    counts() {
      const out = {};
      for (const [type, typeMap] of this.items) {
        out[type] = typeMap.size;
      }
      return out;
    }

    /**
     * Clone an existing item with a new ID
     * @param {string} type - Type of item
     * @param {number} itemId - Source item ID
     * @returns {object} New cloned item
     */
    clone(type, itemId) {
      const source = this.items.get(type)?.get(itemId);
      if (!source) throw new Error(`Item not found: ${type}/${itemId}`);
      const copy = JSON.parse(JSON.stringify(source));
      copy._id = ++this._idCounters[type];
      copy._createdAt = new Date().toISOString();
      copy._modifiedAt = copy._createdAt;
      copy.name = (copy.name || 'Item') + ' (Copy)';
      this.items.get(type).set(copy._id, copy);
      return copy;
    }

    /**
     * Get an item by type and ID
     * @param {string} type - Type of item
     * @param {number} itemId - Item ID
     * @returns {object|null} Item or null
     */
    get(type, itemId) {
      if (!this.items.has(type)) return null;
      return this.items.get(type).get(itemId) || null;
    }

    /**
     * Clear all items of a type, or all items if type omitted
     * @param {string} [type] - Optional type to clear
     */
    clear(type) {
      if (type) {
        if (this.items.has(type)) this.items.get(type).clear();
        return;
      }
      for (const typeMap of this.items.values()) typeMap.clear();
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
        if (!jsonString || typeof jsonString !== 'string') {
          throw new Error('Import string must be non-empty');
        }

        const item = JSON.parse(jsonString);
        if (!item || typeof item !== 'object') {
          throw new Error('Invalid homebrew format: not an object');
        }
        if (!item._type || !this.items.has(item._type)) {
          throw new Error('Invalid homebrew format: unknown type');
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
     * Calculate challenge rating for a monster using a tiered approach
     * loosely modeled on the DMG monster building tables (p. 274-276).
     * @param {object} monster - Monster object
     * @returns {number} Challenge rating (fractional supported: 0, 0.125, 0.25, 0.5, 1+)
     */
    calculateCR(monster) {
      if (monster._type !== 'monsters') {
        throw new Error('calculateCR only works with monsters');
      }

      // ---- Defensive CR ----
      const hp = Number(monster.hp) || 1;
      const ac = Number(monster.ac) || 10;
      const defCR = this._hpToCR(hp);
      const expectedAC = this._expectedDefensiveAC(defCR);
      const acDelta = ac - expectedAC;
      // ±2 AC = ±1 CR step
      const defensiveCR = Math.max(0, defCR + acDelta * 0.5);

      // ---- Offensive CR ----
      let damagePerRound = 0;
      let bestAttackBonus = 0;
      let bestSaveDC = 0;

      const allActions = []
        .concat(Array.isArray(monster.actions) ? monster.actions : [])
        .concat(Array.isArray(monster.legendaryActions) ? monster.legendaryActions : [])
        .concat(Array.isArray(monster.lairActions) ? monster.lairActions : []);

      for (const action of allActions) {
        if (!action) continue;
        if (action.damage) {
          damagePerRound += this._averageDamage(action.damage);
        }
        if (typeof action.attack === 'number' && action.attack > bestAttackBonus) {
          bestAttackBonus = action.attack;
        }
        if (typeof action.dc === 'number' && action.dc > bestSaveDC) {
          bestSaveDC = action.dc;
        }
      }

      // Legendary creatures typically act > 1 / round
      if (Array.isArray(monster.legendaryActions) && monster.legendaryActions.length > 0) {
        damagePerRound *= 1.25;
      }

      const offCR = this._damageToCR(damagePerRound);
      const expectedAttack = this._expectedAttackForCR(offCR);
      const attackDelta = bestAttackBonus > 0 ? (bestAttackBonus - expectedAttack) : 0;
      const dcDelta = bestSaveDC > 0 ? (bestSaveDC - this._expectedDCForCR(offCR)) : 0;
      const offensiveCR = Math.max(0, offCR + (attackDelta + dcDelta) * 0.25);

      const avg = (defensiveCR + offensiveCR) / 2;
      return this._roundToValidCR(avg);
    }

    /**
     * Calculate proficiency bonus from CR (PHB / DMG table)
     * @param {number} cr - Challenge rating
     * @returns {number} Proficiency bonus
     */
    proficiencyForCR(cr) {
      if (cr < 5) return 2;
      if (cr < 9) return 3;
      if (cr < 13) return 4;
      if (cr < 17) return 5;
      if (cr < 21) return 6;
      if (cr < 25) return 7;
      if (cr < 29) return 8;
      return 9;
    }

    /**
     * Calculate XP for a given CR (PHB monster XP table)
     * @param {number} cr
     * @returns {number} XP
     */
    xpForCR(cr) {
      const table = {
        0: 10, 0.125: 25, 0.25: 50, 0.5: 100,
        1: 200, 2: 450, 3: 700, 4: 1100, 5: 1800,
        6: 2300, 7: 2900, 8: 3900, 9: 5000, 10: 5900,
        11: 7200, 12: 8400, 13: 10000, 14: 11500, 15: 13000,
        16: 15000, 17: 18000, 18: 20000, 19: 22000, 20: 25000,
        21: 33000, 22: 41000, 23: 50000, 24: 62000, 25: 75000,
        26: 90000, 27: 105000, 28: 120000, 29: 135000, 30: 155000
      };
      return table[cr] != null ? table[cr] : 0;
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
        const dmgDice = parseInt(spell.damage.match(/\d+/)?.[0] || 1, 10);
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
     * @returns {string} Formatted stat block (markdown)
     */
    generateStatBlock(monster) {
      if (!monster) return '';
      const lines = [];
      const mod = (s) => {
        if (typeof s !== 'number') return '+0';
        const m = Math.floor((s - 10) / 2);
        return (m >= 0 ? '+' : '') + m;
      };

      lines.push(`# ${monster.name || 'Unnamed Creature'}`);
      lines.push(`*${monster.size || 'Medium'} ${monster.type || 'creature'}, ${monster.alignment || 'unaligned'}*`);
      lines.push('');
      lines.push(`**Armor Class** ${monster.ac != null ? monster.ac : '—'}`);
      lines.push(`**Hit Points** ${monster.hp != null ? monster.hp : '—'}`);
      lines.push(`**Speed** ${monster.speed || '30 ft.'}`);
      lines.push('');

      // Ability scores
      const stats = monster.stats || { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
      lines.push('| STR | DEX | CON | INT | WIS | CHA |');
      lines.push('|:---:|:---:|:---:|:---:|:---:|:---:|');
      lines.push(`| ${stats.str} (${mod(stats.str)}) | ${stats.dex} (${mod(stats.dex)}) | ${stats.con} (${mod(stats.con)}) | ${stats.int} (${mod(stats.int)}) | ${stats.wis} (${mod(stats.wis)}) | ${stats.cha} (${mod(stats.cha)}) |`);
      lines.push('');

      const fmtBonus = (entry) => {
        if (entry == null) return '';
        if (typeof entry === 'string') return entry;
        if (typeof entry === 'object') {
          const label = entry.name || (entry.stat ? entry.stat.toUpperCase() : '');
          const bonus = typeof entry.bonus === 'number'
            ? (entry.bonus >= 0 ? '+' + entry.bonus : String(entry.bonus))
            : '';
          return label + (bonus ? ' ' + bonus : '');
        }
        return String(entry);
      };
      if (Array.isArray(monster.saves) && monster.saves.length > 0) {
        lines.push(`**Saving Throws** ${monster.saves.map(fmtBonus).join(', ')}`);
      }
      if (Array.isArray(monster.skills) && monster.skills.length > 0) {
        lines.push(`**Skills** ${monster.skills.map(fmtBonus).join(', ')}`);
      }
      if (Array.isArray(monster.vulnerabilities) && monster.vulnerabilities.length > 0) {
        lines.push(`**Damage Vulnerabilities** ${monster.vulnerabilities.join(', ')}`);
      }
      if (Array.isArray(monster.resistances) && monster.resistances.length > 0) {
        lines.push(`**Damage Resistances** ${monster.resistances.join(', ')}`);
      }
      if (Array.isArray(monster.immunities) && monster.immunities.length > 0) {
        lines.push(`**Damage Immunities** ${monster.immunities.join(', ')}`);
      }
      lines.push(`**Senses** ${monster.senses || 'passive Perception 10'}`);
      lines.push(`**Languages** ${monster.languages || '—'}`);
      const cr = monster.cr != null ? monster.cr : 0;
      const xp = monster.xp != null ? monster.xp : this.xpForCR(cr);
      lines.push(`**Challenge** ${cr} (${xp} XP)`);
      lines.push(`**Proficiency Bonus** +${this.proficiencyForCR(cr)}`);
      lines.push('');

      if (Array.isArray(monster.traits) && monster.traits.length > 0) {
        lines.push('## Traits');
        lines.push('');
        for (const trait of monster.traits) {
          if (!trait) continue;
          lines.push(`***${trait.name || 'Trait'}.*** ${trait.desc || ''}`);
          lines.push('');
        }
      }

      if (Array.isArray(monster.actions) && monster.actions.length > 0) {
        lines.push('## Actions');
        lines.push('');
        for (const action of monster.actions) {
          if (!action) continue;
          let line = `***${action.name || 'Action'}.*** ${action.desc || ''}`;
          if (typeof action.attack === 'number') line += ` _Attack:_ +${action.attack} to hit.`;
          if (action.damage) line += ` _Hit:_ ${action.damage} damage.`;
          if (typeof action.dc === 'number') line += ` _DC ${action.dc} saving throw._`;
          lines.push(line);
          lines.push('');
        }
      }

      if (Array.isArray(monster.legendaryActions) && monster.legendaryActions.length > 0) {
        lines.push('## Legendary Actions');
        lines.push('');
        for (const action of monster.legendaryActions) {
          if (!action) continue;
          lines.push(`***${action.name || 'Action'}.*** ${action.desc || ''}`);
          lines.push('');
        }
      }

      if (Array.isArray(monster.lairActions) && monster.lairActions.length > 0) {
        lines.push('## Lair Actions');
        lines.push('');
        for (const action of monster.lairActions) {
          if (!action) continue;
          lines.push(`***${action.name || 'Action'}.*** ${action.desc || ''}`);
          lines.push('');
        }
      }

      if (monster.description) {
        lines.push('## Description');
        lines.push('');
        lines.push(monster.description);
        lines.push('');
      }

      return lines.join('\n');
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
        if (!jsonString || typeof jsonString !== 'string') {
          throw new Error('Input must be a non-empty string');
        }

        const data = JSON.parse(jsonString);
        if (!data || typeof data !== 'object') {
          throw new Error('Deserialized data must be an object');
        }

        if (Array.isArray(data.monsters)) {
          for (const m of data.monsters) {
            if (m && typeof m === 'object' && m._id) {
              this.items.get('monsters').set(m._id, m);
            }
          }
        }
        if (Array.isArray(data.items)) {
          for (const i of data.items) {
            if (i && typeof i === 'object' && i._id) {
              this.items.get('items').set(i._id, i);
            }
          }
        }
        if (Array.isArray(data.spells)) {
          for (const s of data.spells) {
            if (s && typeof s === 'object' && s._id) {
              this.items.get('spells').set(s._id, s);
            }
          }
        }
        if (Array.isArray(data.npcs)) {
          for (const n of data.npcs) {
            if (n && typeof n === 'object' && n._id) {
              this.items.get('npcs').set(n._id, n);
            }
          }
        }
        if (Array.isArray(data.classFeatures)) {
          for (const cf of data.classFeatures) {
            if (cf && typeof cf === 'object' && cf._id) {
              this.items.get('classFeatures').set(cf._id, cf);
            }
          }
        }
        if (Array.isArray(data.feats)) {
          for (const f of data.feats) {
            if (f && typeof f === 'object' && f._id) {
              this.items.get('feats').set(f._id, f);
            }
          }
        }

        if (data._idCounters && typeof data._idCounters === 'object') {
          this._idCounters = data._idCounters;
        }
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
      if (!item || typeof item !== 'object') {
        throw new Error('Item must be an object');
      }

      if (!item.name || (typeof item.name === 'string' && item.name.trim().length === 0)) {
        throw new Error('Item must have a non-empty name');
      }

      if (type === 'monsters') {
        if (item.cr === undefined || item.cr === null) {
          throw new Error('Monster must have a CR');
        }
        if (typeof item.cr !== 'number' || item.cr < 0) {
          throw new Error('Monster CR must be a non-negative number');
        }
      }

      if (type === 'spells') {
        if (item.level === undefined || item.level === null) {
          throw new Error('Spell must have a level (0-9)');
        }
        if (typeof item.level !== 'number' || item.level < 0 || item.level > 9) {
          throw new Error('Spell level must be 0-9');
        }
      }
    }

    /**
     * Parse damage string and return average. Supports:
     *   "1d8", "1d8+3", "2d6 - 1", "1d8+2d6+4", flat numbers, etc.
     * @private
     */
    _averageDamage(damageStr) {
      if (typeof damageStr === 'number' && isFinite(damageStr)) return Math.max(0, damageStr);
      if (!damageStr || typeof damageStr !== 'string') return 0;

      // Strip whitespace and damage type words like "(slashing)" or "fire"
      const cleaned = damageStr.replace(/\s+/g, '').replace(/\([^)]*\)/g, '');
      let total = 0;
      let matched = false;

      // Match dice expressions: NdM or NdM+B / -B
      const diceRe = /([+-]?)(\d+)d(\d+)/gi;
      let m;
      while ((m = diceRe.exec(cleaned)) !== null) {
        matched = true;
        const sign = m[1] === '-' ? -1 : 1;
        const dice = parseInt(m[2], 10);
        const sides = parseInt(m[3], 10);
        if (!isFinite(dice) || !isFinite(sides) || dice <= 0 || sides <= 0) continue;
        total += sign * dice * ((sides + 1) / 2);
      }

      // Match standalone numeric bonuses (after dice removed)
      const noDice = cleaned.replace(/[+-]?\d+d\d+/gi, '');
      const bonusRe = /([+-]?\d+)/g;
      let b;
      while ((b = bonusRe.exec(noDice)) !== null) {
        matched = true;
        const v = parseInt(b[1], 10);
        if (isFinite(v)) total += v;
      }

      if (!matched) return 0;
      return Math.max(0, total);
    }

    /**
     * Approximate HP-to-CR mapping (DMG p. 274)
     * @private
     */
    _hpToCR(hp) {
      const t = [
        [6, 0], [35, 0.125], [49, 0.25], [70, 0.5],
        [85, 1], [100, 2], [115, 3], [130, 4], [145, 5],
        [160, 6], [175, 7], [190, 8], [205, 9], [220, 10],
        [235, 11], [250, 12], [265, 13], [280, 14], [295, 15],
        [310, 16], [325, 17], [340, 18], [355, 19], [400, 20],
        [445, 21], [490, 22], [535, 23], [580, 24], [625, 25],
        [670, 26], [715, 27], [760, 28], [805, 29], [850, 30]
      ];
      for (let i = 0; i < t.length; i++) {
        if (hp <= t[i][0]) return t[i][1];
      }
      return 30;
    }

    /**
     * Damage-per-round to offensive CR (DMG p. 274)
     * @private
     */
    _damageToCR(dpr) {
      if (dpr <= 0) return 0;
      const t = [
        [1, 0], [3, 0.125], [5, 0.25], [8, 0.5],
        [14, 1], [20, 2], [26, 3], [32, 4], [38, 5],
        [44, 6], [50, 7], [56, 8], [62, 9], [68, 10],
        [74, 11], [80, 12], [86, 13], [92, 14], [98, 15],
        [104, 16], [110, 17], [116, 18], [122, 19], [140, 20],
        [158, 21], [176, 22], [194, 23], [212, 24], [230, 25],
        [248, 26], [266, 27], [284, 28], [302, 29], [320, 30]
      ];
      for (let i = 0; i < t.length; i++) {
        if (dpr <= t[i][0]) return t[i][1];
      }
      return 30;
    }

    /** Expected AC at a given CR (DMG defensive table) */
    _expectedDefensiveAC(cr) {
      if (cr <= 3) return 13;
      if (cr <= 4) return 14;
      if (cr <= 7) return 15;
      if (cr <= 9) return 16;
      if (cr <= 12) return 17;
      if (cr <= 16) return 18;
      return 19;
    }

    /** Expected attack bonus at a given CR */
    _expectedAttackForCR(cr) {
      if (cr <= 3) return 3;
      if (cr <= 4) return 5;
      if (cr <= 7) return 6;
      if (cr <= 9) return 7;
      if (cr <= 12) return 8;
      if (cr <= 16) return 10;
      if (cr <= 20) return 11;
      return 12;
    }

    /** Expected save DC at a given CR */
    _expectedDCForCR(cr) {
      if (cr <= 3) return 13;
      if (cr <= 7) return 14;
      if (cr <= 10) return 15;
      if (cr <= 12) return 16;
      if (cr <= 16) return 17;
      if (cr <= 20) return 18;
      return 19;
    }

    /** Round a number to nearest valid CR value */
    _roundToValidCR(cr) {
      const valid = [0, 0.125, 0.25, 0.5];
      for (let i = 1; i <= 30; i++) valid.push(i);
      let best = valid[0];
      let bestDiff = Math.abs(cr - best);
      for (let i = 1; i < valid.length; i++) {
        const d = Math.abs(cr - valid[i]);
        if (d < bestDiff) { best = valid[i]; bestDiff = d; }
      }
      return best;
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
