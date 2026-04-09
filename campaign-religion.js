// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════
// CAMPAIGN RELIGION & DIVINE INFLUENCE SYSTEM
// Comprehensive D&D 5e SRD Pantheon with Expanded Religious Mechanics
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════

(function(global) {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // PANTHEON DEFINITION - FULL D&D 5e SRD COMPATIBLE
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════

  var PANTHEON = {
    // ───────────────────────────────────────────────────────────────────────────────────────────────────────────
    // GREATER DEITIES (Tier 1 - Most Powerful)
    // ───────────────────────────────────────────────────────────────────────────────────────────────────────────
    greater: [
      {
        id: 'pelor',
        name: 'Pelor',
        title: 'The Sun God',
        alignment: 'NG',
        domains: ['Life', 'Light'],
        tier: 'greater',
        icon: '✦',
        symbol: 'A sun with a smiling face',
        description: 'God of the sun, light, strength, and healing. Pelor is the eternal optimist, bringing warmth and hope to all lands. His radiant power drives back darkness and evil.',
        favors: ['healing the sick', 'protecting the innocent', 'destroying undead', 'bringing light to darkness'],
        angers: ['undeath', 'cruelty to innocents', 'obscuring the truth', 'practicing necromancy'],
        blessings: [
          { name: 'Radiant Touch', effect: '+2 to healing magic, heal 1d6 extra HP per spell' },
          { name: 'Sun\'s Blessing', effect: 'Immunity to blindness, benefit from light' },
          { name: 'Holy Radiance', effect: '+1 damage vs undead creatures' }
        ],
        curses: [
          { name: 'Shadow Curse', effect: '-2 to sight checks, sunlight harms you' },
          { name: 'Darkness Bound', effect: 'Cannot benefit from light, weakness in bright areas' },
          { name: 'Sunless Soul', effect: 'Healing spells on you are 25% less effective' }
        ],
        rivalDeities: ['shar', 'talona', 'talos'],
        alliedDeities: ['lathander', 'bahamut', 'helm'],
        clericDomains: ['Life', 'Light'],
        holyDay: 'Midsummer (7th month, 21st day)',
        associatedRace: 'Humans'
      },
      {
        id: 'moradin',
        name: 'Moradin',
        title: 'The Dwarf God',
        alignment: 'LG',
        domains: ['Forge', 'Knowledge'],
        tier: 'greater',
        icon: '⚒',
        symbol: 'An anvil and hammer crossed',
        description: 'God of dwarves, creation, smithing, and mining. Moradin is the master craftsman who shaped the dwarven race. He values craftsmanship, duty, and stone work above all.',
        favors: ['creating masterwork items', 'protecting dwarf-kind', 'honest labor', 'defending strongholds'],
        angers: ['shoddy craftsmanship', 'desecrating stone halls', 'enslaving dwarves', 'greed and theft'],
        blessings: [
          { name: 'Craftsmaster\'s Precision', effect: '+2 to crafting checks, create items 30% faster' },
          { name: 'Stone\'s Steadiness', effect: '+1 AC underground, tremorsense 30ft' },
          { name: 'Forge\'s Gift', effect: 'Repair broken items as action 1/week' }
        ],
        curses: [
          { name: 'Broken Hands', effect: '-2 to crafting, fine work takes 3x longer' },
          { name: 'Earth\'s Rejection', effect: 'Fall damage doubled, unstable ground underfoot' },
          { name: 'Rust Curse', effect: 'Equipment degrades rapidly, repairs take twice as long' }
        ],
        rivalDeities: ['gruumsh', 'lolth', 'cyric'],
        alliedDeities: ['helm', 'tyr', 'bahamut'],
        clericDomains: ['Forge', 'Knowledge'],
        holyDay: 'First Day of the Year (1st month, 1st day)',
        associatedRace: 'Dwarves'
      },
      {
        id: 'corellon',
        name: 'Corellon Larethian',
        title: 'The Elf God',
        alignment: 'CG',
        domains: ['Arcana', 'Light'],
        tier: 'greater',
        icon: '✦',
        symbol: 'A crescent moon and starlight',
        description: 'God of elves, magic, art, and beauty. Corellon is the source of elven magic and creativity. His blessing brings inspiration and grace to all endeavors of artistry.',
        favors: ['creating beautiful art', 'advancing magic', 'protecting elves', 'spreading joy and wonder'],
        angers: ['destroying art', 'perverting magic', 'enslaving elves', 'making the world ugly'],
        blessings: [
          { name: 'Arcane Resonance', effect: '+1 spell DC, spells cast with advantage' },
          { name: 'Elven Grace', effect: '+2 Dexterity for 1 hour, once per day' },
          { name: 'Inspiration\'s Touch', effect: 'Grant bardic inspiration die to allies 1/day' }
        ],
        curses: [
          { name: 'Discordant Magic', effect: 'Spells cast have 25% failure chance' },
          { name: 'Ugly Curse', effect: '-3 Charisma, beauty fades from the world around you' },
          { name: 'Broken Creativity', effect: 'Cannot create art or inspiration for 1 week' }
        ],
        rivalDeities: ['lolth', 'malar'],
        alliedDeities: ['selune', 'mystra', 'sune'],
        clericDomains: ['Arcana', 'Light'],
        holyDay: 'Starnight (3rd month, 13th day)',
        associatedRace: 'Elves'
      },
      {
        id: 'gruumsh',
        name: 'Gruumsh',
        title: 'The Orc God',
        alignment: 'CE',
        domains: ['War', 'Tempest'],
        tier: 'greater',
        icon: '↯',
        symbol: 'A single great eye',
        description: 'God of orcs, storms, war, and destruction. Gruumsh is the primal force of conquest and destruction. He demands blood and victory from his followers.',
        favors: ['glorious combat', 'defeating powerful foes', 'destroying civilization', 'conquest'],
        angers: ['mercy in battle', 'cooperation with non-orcs', 'peace', 'healing enemies'],
        blessings: [
          { name: 'Storm Fury', effect: '+2 melee damage, advantage on rage saves' },
          { name: 'Warrior\'s Might', effect: 'Extra attack when you kill an enemy, once per round' },
          { name: 'Battle Hunger', effect: 'Regenerate 2 HP each round when in combat' }
        ],
        curses: [
          { name: 'Coward\'s Mark', effect: '-3 to attack rolls vs stronger foes' },
          { name: 'Weakness', effect: '-1 to all damage rolls for 1 week' },
          { name: 'Storm\'s Wrath', effect: 'Random lightning strikes nearby (50% damage to self)' }
        ],
        rivalDeities: ['pelor', 'bahamut', 'tyr', 'moradin'],
        alliedDeities: ['malar', 'talos', 'bane'],
        clericDomains: ['War', 'Tempest'],
        holyDay: 'Bloodmoon (10th month, 15th day)',
        associatedRace: 'Orcs'
      },
      {
        id: 'lolth',
        name: 'Lolth',
        title: 'The Spider Queen',
        alignment: 'CE',
        domains: ['Trickery'],
        tier: 'greater',
        icon: '⊛',
        symbol: 'An eight-legged spider',
        description: 'Goddess of drow, spiders, darkness, and chaos. Lolth is the embodiment of treachery and cruelty. She demands obedience and rewards those who betray their enemies.',
        favors: ['betraying allies', 'enslaving others', 'spreading darkness', 'killing in shadows'],
        angers: ['redemption', 'elves thriving', 'light spreading', 'freeing slaves'],
        blessings: [
          { name: 'Shadow Walk', effect: 'Move silently even on loud surfaces, advantage on stealth' },
          { name: 'Spider\'s Climb', effect: 'Climb at full speed, spider climb 1/day' },
          { name: 'Poison Touch', effect: 'Attacks deal 1d6 poison damage, venomous bite' }
        ],
        curses: [
          { name: 'Revealed', effect: 'Stealth impossible, always visible in shadows' },
          { name: 'Light\'s Burn', effect: 'Sunlight deals 1d6 damage per round' },
          { name: 'Spider\'s Hunger', effect: 'Take 1 poison damage per round, no save' }
        ],
        rivalDeities: ['corellon', 'pelor', 'sune'],
        alliedDeities: ['shar', 'cyric', 'malar'],
        clericDomains: ['Trickery'],
        holyDay: 'Dark Moon (1st month, 15th day)',
        associatedRace: 'Drow'
      },
      {
        id: 'bahamut',
        name: 'Bahamut',
        title: 'The Dragon God',
        alignment: 'LG',
        domains: ['Life', 'War'],
        tier: 'greater',
        icon: '⊛',
        symbol: 'A platinum dragon\'s head in profile',
        description: 'God of justice, nobility, and metallic dragons. Bahamut is the eternal protector against evil. He defends the weak and wages righteous war against tyranny.',
        favors: ['defeating evil', 'protecting the weak', 'honorable combat', 'aiding dragons'],
        angers: ['harming innocents', 'betraying allies', 'disrespect to dragons', 'tyranny'],
        blessings: [
          { name: 'Dragon\'s Might', effect: '+2 melee damage, advantage vs evil creatures' },
          { name: 'Platinum Shield', effect: '+1 AC, immunity to charm' },
          { name: 'Just Judgment', effect: 'Advantage on Insight checks to discern truth' }
        ],
        curses: [
          { name: 'Disgraced', effect: '-2 Charisma, authority figures distrust you' },
          { name: 'Weakness', effect: '-1 to all saves vs evil magic' },
          { name: 'Dragon\'s Ire', effect: 'Dragons will attack you on sight' }
        ],
        rivalDeities: ['tiamat', 'gruumsh', 'malar'],
        alliedDeities: ['pelor', 'moradin', 'tyr'],
        clericDomains: ['Life', 'War'],
        holyDay: 'Drakesummer (5th month, 1st day)',
        associatedRace: 'Dragons (metallic)'
      },
      {
        id: 'tiamat',
        name: 'Tiamat',
        title: 'The Dragon Goddess',
        alignment: 'LE',
        domains: ['Trickery', 'War'],
        tier: 'greater',
        icon: '♔',
        symbol: 'A five-headed dragon crown',
        description: 'Goddess of greed, chromatic dragons, and draconic ambition. Tiamat is the eternal foe of justice. She demands wealth, power, and dominion over all.',
        favors: ['accumulating treasure', 'slaying metallics', 'betraying enemies', 'spreading fear'],
        angers: ['giving away wealth', 'helping metallic dragons', 'destroying her temples'],
        blessings: [
          { name: 'Dragon Avarice', effect: '+1 to all rolls vs creatures guarding treasure' },
          { name: 'Draconic Strength', effect: '+2 to damage when using a dragon\'s lair' },
          { name: 'Five Heads', effect: 'Gain advantage on initiative and perception checks' }
        ],
        curses: [
          { name: 'Greed\'s Curse', effect: 'Cannot resist stealing, compulsive theft' },
          { name: 'Weakness', effect: 'Metallic dragons deal double damage to you' },
          { name: 'Dragon\'s Betrayal', effect: 'Dragons will not aid you, see you as prey' }
        ],
        rivalDeities: ['bahamut', 'pelor', 'helm'],
        alliedDeities: ['bane', 'loviatar', 'cyric'],
        clericDomains: ['Trickery', 'War'],
        holyDay: 'Greedmoon (8th month, 8th day)',
        associatedRace: 'Dragons (chromatic)'
      }
    ],

    // ───────────────────────────────────────────────────────────────────────────────────────────────────────────
    // INTERMEDIATE DEITIES (Tier 2 - Standard Gods)
    // ───────────────────────────────────────────────────────────────────────────────────────────────────────────
    intermediate: [
      {
        id: 'helm',
        name: 'Helm',
        title: 'The God of Guardians',
        alignment: 'LN',
        domains: ['Life', 'Light'],
        tier: 'intermediate',
        icon: '⚔',
        symbol: 'A staring eye within a gauntlet',
        description: 'God of protection, guardians, and duty. Helm is watchful and unwavering. He stands eternal against threats and demands absolute loyalty from his followers.',
        favors: ['protecting the weak', 'standing watch', 'honoring oaths', 'vigilance'],
        angers: ['abandoning posts', 'betraying trust', 'sleeping on duty', 'cowardice'],
        blessings: [
          { name: 'Eternal Watch', effect: 'Never surprised, darkvision improves 30ft' },
          { name: 'Guardian\'s Bond', effect: '+2 AC when protecting an ally' },
          { name: 'Unwavering', effect: 'Advantage on saves vs fear and mind control' }
        ],
        curses: [
          { name: 'Weakness', effect: 'Surprise attacks against you have advantage' },
          { name: 'Broken Oath', effect: '-2 to all rolls until oath is fulfilled' },
          { name: 'Betrayer\'s Mark', effect: 'Those you fail to protect attack you first' }
        ],
        rivalDeities: ['mask', 'cyric'],
        alliedDeities: ['tyr', 'pelor', 'bahamut'],
        clericDomains: ['Life', 'Light'],
        holyDay: 'Guard\'s Vigilance (4th month, 1st day)',
        associatedRace: 'All races'
      },
      {
        id: 'tyr',
        name: 'Tyr',
        title: 'The God of Justice',
        alignment: 'LG',
        domains: ['War'],
        tier: 'intermediate',
        icon: '⚖',
        symbol: 'A scale balanced on a sword',
        description: 'God of justice, law, and truth. Tyr is blind to all but the truth. He values law above all and demands honesty from his worshippers.',
        favors: ['discovering truth', 'punishing injustice', 'upholding law', 'honest dealing'],
        angers: ['lying under oath', 'perverting justice', 'helping the guilty escape'],
        blessings: [
          { name: 'Truth Sight', effect: 'Advantage on Insight checks to discern lies' },
          { name: 'Just Verdict', effect: '+2 to persuasion checks when speaking truth' },
          { name: 'Righteous Judgment', effect: 'Advantage on attacks vs unjust foes' }
        ],
        curses: [
          { name: 'Blind to Truth', effect: 'Cannot discern lies, always deceived' },
          { name: 'Oath Breaker', effect: 'Oaths bind you automatically, breaking them causes damage' },
          { name: 'False Justice', effect: 'Your judgments are always wrong' }
        ],
        rivalDeities: ['mask', 'cyric', 'shar'],
        alliedDeities: ['helm', 'bahamut', 'moradin'],
        clericDomains: ['War', 'Knowledge'],
        holyDay: 'Truth Proclamation (6th month, 15th day)',
        associatedRace: 'All races'
      },
      {
        id: 'tempus',
        name: 'Tempus',
        title: 'The War God',
        alignment: 'CN',
        domains: ['War'],
        tier: 'intermediate',
        icon: '⚔',
        symbol: 'An upright greatsword with no point',
        description: 'God of war, battle, and warriors. Tempus is the embodiment of conflict itself. He rewards brave warriors and strong tactics, but cares not for justice or law.',
        favors: ['glorious combat', 'military strategy', 'strength in battle', 'warrior\'s honor'],
        angers: ['cowardice', 'one-sided battles', 'ignoring tactics', 'mock combat'],
        blessings: [
          { name: 'War God\'s Blessing', effect: '+1 to attack rolls and damage' },
          { name: 'Battle Tactics', effect: 'Advantage on initiative, see enemy positions' },
          { name: 'Weapon Mastery', effect: '+1 to weapon damage of any type' }
        ],
        curses: [
          { name: 'Coward\'s Mark', effect: '-2 to attacks when outnumbered' },
          { name: 'Weakness', effect: '-1 to all combat rolls for 1 week' },
          { name: 'Shame of War', effect: 'Enemies gain advantage on attacks vs you' }
        ],
        rivalDeities: ['helm', 'tyr'],
        alliedDeities: ['gruumsh', 'talos', 'bane'],
        clericDomains: ['War'],
        holyDay: 'Battlefest (7th month, 15th day)',
        associatedRace: 'Warriors of all races'
      },
      {
        id: 'mystra',
        name: 'Mystra',
        title: 'The Goddess of Magic',
        alignment: 'NG',
        domains: ['Arcana', 'Knowledge'],
        tier: 'intermediate',
        icon: '◎',
        symbol: 'A spiral of blue and white magic',
        description: 'Goddess of magic, spells, and the Weave. Mystra is magic incarnate. She guides spellcasters and ensures magic flows through the world.',
        favors: ['studying magic', 'using spells wisely', 'advancing arcane knowledge', 'protecting the Weave'],
        angers: ['wild magic', 'perverted spells', 'destroying libraries', 'silencing magic'],
        blessings: [
          { name: 'Weave\'s Blessing', effect: '+1 spell DC, spells cast with advantage' },
          { name: 'Arcane Resonance', effect: 'Cast one spell 1/day without using a slot' },
          { name: 'Magic Flow', effect: 'Mana/spell slots regenerate 25% faster' }
        ],
        curses: [
          { name: 'Weave Rejection', effect: 'Spells cast have 30% failure chance' },
          { name: 'Silence', effect: 'Cannot cast spells for 1 week' },
          { name: 'Wild Magic', effect: 'Casting causes random wild magic surges' }
        ],
        rivalDeities: ['cyric', 'shar'],
        alliedDeities: ['oghma', 'corellon', 'deneir'],
        clericDomains: ['Arcana', 'Knowledge'],
        holyDay: 'Magefair (9th month, 1st day)',
        associatedRace: 'Spellcasters'
      },
      {
        id: 'oghma',
        name: 'Oghma',
        title: 'The God of Knowledge',
        alignment: 'N',
        domains: ['Knowledge'],
        tier: 'intermediate',
        icon: '≡',
        symbol: 'A blank scroll and quill',
        description: 'God of knowledge, invention, and inspiration. Oghma is the keeper of all knowledge. He values discovery and the recording of truth.',
        favors: ['discovering knowledge', 'documenting information', 'inventing new things', 'sharing learning'],
        angers: ['burning libraries', 'suppressing knowledge', 'destroying records', 'enforced ignorance'],
        blessings: [
          { name: 'Knowledge Granted', effect: '+3 to research and knowledge checks' },
          { name: 'Perfect Recall', effect: 'Recall anything read or heard once per day' },
          { name: 'Inspiration', effect: 'Grant inspiration dice to allies 1/day' }
        ],
        curses: [
          { name: 'Ignorance', effect: '-3 to knowledge checks, forget recent information' },
          { name: 'Silence', effect: 'Cannot speak or communicate for 1 week' },
          { name: 'Mind Fog', effect: 'Disadvantage on Intelligence saves' }
        ],
        rivalDeities: ['shar', 'cyric'],
        alliedDeities: ['mystra', 'deneir', 'savras'],
        clericDomains: ['Knowledge'],
        holyDay: 'Scribe\'s Day (2nd month, 22nd day)',
        associatedRace: 'Scholars'
      },
      {
        id: 'sune',
        name: 'Sune',
        title: 'The Goddess of Love',
        alignment: 'CG',
        domains: ['Life', 'Light'],
        tier: 'intermediate',
        icon: '♡',
        symbol: 'A heart inside a rose',
        description: 'Goddess of love, beauty, and passion. Sune is the embodiment of joy and romance. She celebrates freedom and beauty in all forms.',
        favors: ['celebrating beauty', 'spreading love and joy', 'protecting lovers', 'creating art'],
        angers: ['destroying beauty', 'forcing relationships', 'cruelty to lovers', 'despair'],
        blessings: [
          { name: 'Beauty\'s Presence', effect: '+2 Charisma for 1 hour, 1/day' },
          { name: 'Lover\'s Blessing', effect: '+1 to Persuasion checks, enemies treat you kindly' },
          { name: 'Inspiration\'s Touch', effect: 'Grant bardic inspiration die to allies 1/day' }
        ],
        curses: [
          { name: 'Marred Beauty', effect: '-3 Charisma, people are cold and distant' },
          { name: 'Despair\'s Shadow', effect: 'Cannot inspire or encourage others' },
          { name: 'Broken Heart', effect: 'Disadvantage on all saving throws' }
        ],
        rivalDeities: ['shar', 'lolth'],
        alliedDeities: ['corellon', 'selune', 'lathander'],
        clericDomains: ['Life', 'Light'],
        holyDay: 'Festival of Love (3rd month, 1st day)',
        associatedRace: 'All races'
      },
      {
        id: 'selune',
        name: 'Selûne',
        title: 'The Goddess of the Moon',
        alignment: 'CG',
        domains: ['Knowledge', 'Life'],
        tier: 'intermediate',
        icon: '☾',
        symbol: 'Two moons on a starry sky',
        description: 'Goddess of the moon, stars, and navigation. Selûne guides travelers and grants safe passage. She watches over all who journey in darkness.',
        favors: ['aiding travelers', 'navigation and guidance', 'protecting night wanderers', 'stargazing'],
        angers: ['harming travelers', 'blotting out stars', 'leading astray', 'ignoring the moon'],
        blessings: [
          { name: 'Moon\'s Guidance', effect: 'Never get lost, advantage on navigation checks' },
          { name: 'Night Sight', effect: 'Perfect darkvision out to 120ft' },
          { name: 'Safe Journey', effect: '+1 AC during travel, safe rest at night' }
        ],
        curses: [
          { name: 'Lost', effect: '-3 to navigation, always get turned around' },
          { name: 'Night Blind', effect: 'Cannot see in darkness for 1 week' },
          { name: 'Cursed Road', effect: 'Haunted by shadows while traveling' }
        ],
        rivalDeities: ['shar'],
        alliedDeities: ['pelor', 'sune', 'chauntea'],
        clericDomains: ['Knowledge', 'Life'],
        holyDay: 'Highharvestide (10th month, 15th day)',
        associatedRace: 'Travelers'
      },
      {
        id: 'shar',
        name: 'Shar',
        title: 'The Goddess of Darkness',
        alignment: 'NE',
        domains: ['Death', 'Trickery'],
        tier: 'intermediate',
        icon: '☽',
        symbol: 'A black disk or void',
        description: 'Goddess of darkness, loss, and the night. Shar is the embodiment of secrets and hidden things. She rewards those who work in shadows.',
        favors: ['keeping secrets', 'causing loss', 'spreading darkness', 'betrayal'],
        angers: ['revealing secrets', 'bringing light', 'exposing truth', 'charity'],
        blessings: [
          { name: 'Shadow\'s Cloak', effect: 'Advantage on stealth, advantage on hiding' },
          { name: 'Darkness Aura', effect: 'Dim light within 10ft becomes darkness' },
          { name: 'Secret Keeper', effect: 'Cannot be compelled to reveal secrets' }
        ],
        curses: [
          { name: 'Exposed', effect: 'All secrets revealed, cannot hide truth' },
          { name: 'Light\'s Curse', effect: 'Bright light damages you, no shadows to hide in' },
          { name: 'Truth\'s Burden', effect: 'Must speak truth for 1 week' }
        ],
        rivalDeities: ['pelor', 'selune', 'lathander'],
        alliedDeities: ['cyric', 'lolth', 'talona'],
        clericDomains: ['Death', 'Trickery'],
        holyDay: 'Nightal 24 (12th month, 24th day)',
        associatedRace: 'Secretive folk'
      },
      {
        id: 'kelemvor',
        name: 'Kelemvor',
        title: 'The God of Death',
        alignment: 'LN',
        domains: ['Death'],
        tier: 'intermediate',
        icon: '†',
        symbol: 'A skeletal hand holding a scale',
        description: 'God of the dead, dying, and judgment. Kelemvor is the neutral arbiter of death. He judges all souls and ensures the proper passage to the afterlife.',
        favors: ['honoring the dead', 'respecting funeral rites', 'accepting death peacefully', 'judging fairly'],
        angers: ['undeath', 'disturbing graves', 'murder', 'denying death'],
        blessings: [
          { name: 'Death\'s Respite', effect: 'Avoid death at 0 HP once per week' },
          { name: 'Fated', effect: 'Glimpse one future outcome per week' },
          { name: 'Pale Passage', effect: 'Undead cannot perceive you for 1 hour' }
        ],
        curses: [
          { name: 'Lingering Death', effect: 'Dying gives exhaustion, -2 to CON saves' },
          { name: 'Fate\'s Cruelty', effect: 'Automatically fail one save per day' },
          { name: 'Undeath Drawn', effect: 'Undead are hostile to you, attack on sight' }
        ],
        rivalDeities: ['bhaal', 'talona'],
        alliedDeities: ['pelor', 'helm'],
        clericDomains: ['Death'],
        holyDay: 'Day of the Dead (11th month, 15th day)',
        associatedRace: 'All races'
      },
      {
        id: 'silvanus',
        name: 'Silvanus',
        title: 'The God of Nature',
        alignment: 'N',
        domains: ['Nature'],
        tier: 'intermediate',
        icon: '⚍',
        symbol: 'A great oak tree',
        description: 'God of wild nature and druids. Silvanus is the force of primal nature itself. He values balance, natural cycles, and the wild places of the world.',
        favors: ['protecting forests', 'preserving nature', 'studying wild creatures', 'maintaining balance'],
        angers: ['deforestation', 'animal cruelty', 'polluting nature', 'disrupting balance'],
        blessings: [
          { name: 'Nature\'s Blessing', effect: '+1 to nature checks, speak with animals' },
          { name: 'Wild Aspect', effect: 'Advantage on animal handling, beasts aid you' },
          { name: 'Living Armor', effect: 'Entangling vegetation defends you' }
        ],
        curses: [
          { name: 'Withering', effect: '-2 max HP, exhaustion spreads faster' },
          { name: 'Hunted', effect: 'All wild creatures treat you as predator' },
          { name: 'Barren', effect: 'Cannot benefit from healing magic for 1 week' }
        ],
        rivalDeities: ['talos', 'malar'],
        alliedDeities: ['chauntea', 'corellon'],
        clericDomains: ['Nature'],
        holyDay: 'Greengrass (4th month, 1st day)',
        associatedRace: 'Druids'
      },
      {
        id: 'chauntea',
        name: 'Chauntea',
        title: 'The Goddess of Agriculture',
        alignment: 'NG',
        domains: ['Life', 'Nature'],
        tier: 'intermediate',
        icon: '⚌',
        symbol: 'A ripe sheaf of wheat',
        description: 'Goddess of agriculture, farmers, and summer. Chauntea ensures harvests are bountiful. She blesses the fields and feeds the hungry.',
        favors: ['farming and cultivation', 'ensuring good harvests', 'feeding the hungry', 'caring for livestock'],
        angers: ['crop destruction', 'starvation', 'poisoning fields', 'harming farmers'],
        blessings: [
          { name: 'Harvest Blessing', effect: '+2 to farming, grow food 50% faster' },
          { name: 'Summer\'s Bounty', effect: 'Always find food and water, healing improved' },
          { name: 'Fertile Ground', effect: 'Plants grow where you walk' }
        ],
        curses: [
          { name: 'Blight', effect: '-2 max HP, cannot grow food' },
          { name: 'Famine', effect: 'Cannot find food or water, always hungry' },
          { name: 'Infertility', effect: 'Plants wilt around you' }
        ],
        rivalDeities: ['talos', 'talona'],
        alliedDeities: ['pelor', 'silvanus', 'lathander'],
        clericDomains: ['Life', 'Nature'],
        holyDay: 'Midsummer (7th month, 21st day)',
        associatedRace: 'Farmers'
      },
      {
        id: 'lathander',
        name: 'Lathander',
        title: 'The God of Dawn',
        alignment: 'NG',
        domains: ['Life', 'Light'],
        tier: 'intermediate',
        icon: '✶',
        symbol: 'A sun rising above mountains',
        description: 'God of dawn, renewal, and athletics. Lathander brings new beginnings with each sunrise. He grants strength to those who greet the dawn.',
        favors: ['new beginnings', 'renewal and healing', 'athletic endeavors', 'dawn prayers'],
        angers: ['undeath', 'preventing healing', 'despair', 'eternal night'],
        blessings: [
          { name: 'Dawn\'s Blessing', effect: '+2 to Strength, heal 1d6 at dawn' },
          { name: 'New Day', effect: 'Once per week restore a lost ability' },
          { name: 'Renewal', effect: 'Cure disease/poison instantly 1/week' }
        ],
        curses: [
          { name: 'Endless Night', effect: 'Dawn does not refresh you, always exhausted' },
          { name: 'Weakness', effect: '-2 to Strength checks' },
          { name: 'Stagnation', effect: 'Cannot heal naturally for 1 week' }
        ],
        rivalDeities: ['shar', 'talona'],
        alliedDeities: ['pelor', 'chauntea', 'sune'],
        clericDomains: ['Life', 'Light'],
        holyDay: 'Greengrass (4th month, 1st day)',
        associatedRace: 'All races'
      },
      {
        id: 'bane',
        name: 'Bane',
        title: 'The God of Tyranny',
        alignment: 'LE',
        domains: ['War'],
        tier: 'intermediate',
        icon: '♔',
        symbol: 'A black fist clutching a rod',
        description: 'God of tyranny, fear, and hatred. Bane embodies absolute control and domination. He rewards those who seize power and crush their enemies.',
        favors: ['spreading fear', 'conquering nations', 'enslaving populations', 'absolute authority'],
        angers: ['freedom being granted', 'slaves being freed', 'rebellion', 'questioning authority'],
        blessings: [
          { name: 'Tyrant\'s Aura', effect: '+1 to Intimidation, fear aura 10ft radius' },
          { name: 'Domination', effect: 'Advantage on Charisma (Intimidation) checks' },
          { name: 'Iron Will', effect: 'Resistance to charm effects' }
        ],
        curses: [
          { name: 'Weakling', effect: '-2 to all Strength checks' },
          { name: 'Rebellion', effect: 'Followers turn against you' },
          { name: 'Powerless', effect: 'Cannot command or lead anyone' }
        ],
        rivalDeities: ['pelor', 'corellon'],
        alliedDeities: ['cyric', 'loviatar', 'tiamat'],
        clericDomains: ['War'],
        holyDay: 'Deepwinter (1st month, 15th day)',
        associatedRace: 'Tyrants'
      },
      {
        id: 'bhaal',
        name: 'Bhaal',
        title: 'The God of Murder',
        alignment: 'NE',
        domains: ['Death'],
        tier: 'intermediate',
        icon: '☠',
        symbol: 'A skull within an inverted triangle',
        description: 'God of murder, assassination, and bloodlust. Bhaal is death incarnate. He rewards precise, deadly strikes and efficient killing.',
        favors: ['assassination', 'murder', 'bloodlust', 'death'],
        angers: ['mercy', 'failed assassinations', 'protection of the innocent'],
        blessings: [
          { name: 'Assassin\'s Mark', effect: '+2 to attack rolls if unseen' },
          { name: 'Death Strike', effect: 'Attacks against surprised enemies deal extra damage' },
          { name: 'Silent Kill', effect: 'Move silently even on loud surfaces' }
        ],
        curses: [
          { name: 'Revealed', effect: 'Always visible, cannot hide or sneak' },
          { name: 'Failure', effect: 'All assassination attempts fail' },
          { name: 'Mercy', effect: 'Cannot harm innocents, compelled to protect them' }
        ],
        rivalDeities: ['pelor', 'kelemvor', 'ilmater'],
        alliedDeities: ['shar', 'cyric'],
        clericDomains: ['Death'],
        holyDay: 'Darkfeast (12th month, 15th day)',
        associatedRace: 'Assassins'
      },
      {
        id: 'cyric',
        name: 'Cyric',
        title: 'The God of Lies',
        alignment: 'CE',
        domains: ['Trickery'],
        tier: 'intermediate',
        icon: '⊛',
        symbol: 'A crescent curve with a dot',
        description: 'God of lies, deception, and illusion. Cyric is chaos incarnate. He rewards cunning deception and rewards those who best others through trickery.',
        favors: ['deceiving others', 'spreading lies', 'sowing discord', 'chaos and confusion'],
        angers: ['truth being revealed', 'being deceived', 'failed lies'],
        blessings: [
          { name: 'Convincing Lies', effect: '+2 to Deception checks' },
          { name: 'Illusory Self', effect: 'Cast invisibility 1/day' },
          { name: 'Contradiction', effect: 'Say opposite of truth, enemies confused' }
        ],
        curses: [
          { name: 'Truth Curse', effect: 'Cannot speak lies, must tell truth' },
          { name: 'Exposed', effect: 'All lies automatically revealed' },
          { name: 'Confusion', effect: 'You are always confused about reality' }
        ],
        rivalDeities: ['tyr', 'oghma', 'mystra'],
        alliedDeities: ['shar', 'lolth', 'bane'],
        clericDomains: ['Trickery'],
        holyDay: 'Spellnight (9th month, 13th day)',
        associatedRace: 'Tricksters'
      },
      {
        id: 'mask',
        name: 'Mask',
        title: 'The God of Shadows',
        alignment: 'CN',
        domains: ['Trickery'],
        tier: 'intermediate',
        icon: '⊛',
        symbol: 'A mask in darkness',
        description: 'God of shadows, thieves, and intrigue. Mask rewards those who work unseen. He values cunning and stealth above all.',
        favors: ['stealing', 'intrigue', 'shadowy dealings', 'perfect heists'],
        angers: ['being caught', 'failed theft', 'exposing secrets', 'loud actions'],
        blessings: [
          { name: 'Shadow Walk', effect: 'Move silently even on loud surfaces' },
          { name: 'Thief\'s Edge', effect: 'Advantage on sleight of hand and theft' },
          { name: 'Shadow Cloak', effect: 'Invisibility in shadows for 10 minutes 1/day' }
        ],
        curses: [
          { name: 'Revealed', effect: 'Constantly visible despite stealth attempts' },
          { name: 'Curse of Theft', effect: 'Cannot steal or thieve, you are caught' },
          { name: 'Betrayer\'s Mark', effect: 'Other thieves hunt you' }
        ],
        rivalDeities: ['helm', 'tyr'],
        alliedDeities: ['shar', 'cyric', 'lolth'],
        clericDomains: ['Trickery'],
        holyDay: 'Darknights (8th month, 8th and 22nd days)',
        associatedRace: 'Thieves'
      },
      {
        id: 'ilmater',
        name: 'Ilmater',
        title: 'The God of Suffering',
        alignment: 'LG',
        domains: ['Life'],
        tier: 'intermediate',
        icon: '⊕',
        symbol: 'Hands bound by a red cord',
        description: 'God of endurance, suffering, and perseverance. Ilmater accepts suffering so others do not have to. He rewards sacrifice and compassion.',
        favors: ['protecting the suffering', 'self-sacrifice', 'enduring hardship', 'mercy'],
        angers: ['causing suffering', 'cruelty', 'abandoning those in pain'],
        blessings: [
          { name: 'Endurance', effect: '+2 to saves vs pain and suffering' },
          { name: 'Sacrifice', effect: 'Take another\'s damage 1/day' },
          { name: 'Compassion Touch', effect: 'Heal 1d6 + 3 HP with a touch' }
        ],
        curses: [
          { name: 'Suffering', effect: '-2 max HP, permanent damage' },
          { name: 'Cruelty', effect: 'Cannot show compassion or mercy' },
          { name: 'Isolation', effect: 'Others avoid you, loneliness' }
        ],
        rivalDeities: ['bhaal', 'loviatar'],
        alliedDeities: ['pelor', 'torm'],
        clericDomains: ['Life'],
        holyDay: 'The Feast of the Moon (10th month, 15th day)',
        associatedRace: 'Martyrs'
      },
      {
        id: 'torm',
        name: 'Torm',
        title: 'The God of Duty',
        alignment: 'LG',
        domains: ['War'],
        tier: 'intermediate',
        icon: '⚔',
        symbol: 'A gauntlet upright',
        description: 'God of duty, loyalty, and obedience. Torm demands absolute loyalty to righteous causes. He rewards those who stand firm in their duties.',
        favors: ['fulfilling duties', 'loyal service', 'defending righteous causes', 'sacrifice'],
        angers: ['abandoning duty', 'betrayal', 'disloyalty', 'breaking oaths'],
        blessings: [
          { name: 'Duty\'s Strength', effect: '+1 to all attack rolls while serving your oath' },
          { name: 'Loyal Heart', effect: 'Advantage on saves vs charms affecting loyalty' },
          { name: 'Oath Bound', effect: 'Oaths you swear are magically enforced' }
        ],
        curses: [
          { name: 'Oath Breaker', effect: '-2 to all rolls until oath is fulfilled' },
          { name: 'Betrayer', effect: 'Allies distrust you, gain no bonuses from them' },
          { name: 'Lost Purpose', effect: 'Cannot find meaning or purpose' }
        ],
        rivalDeities: ['mask', 'cyric'],
        alliedDeities: ['helm', 'bahamut', 'ilmater'],
        clericDomains: ['War'],
        holyDay: 'Midsummer (7th month, 21st day)',
        associatedRace: 'Paladins'
      },
      {
        id: 'waukeen',
        name: 'Waukeen',
        title: 'The Goddess of Trade',
        alignment: 'N',
        domains: ['Knowledge', 'Trickery'],
        tier: 'intermediate',
        icon: '◆',
        symbol: 'A purse and coin',
        description: 'Goddess of trade, money, and wealth. Waukeen blesses merchants and rewards fair dealing. She values wealth but also honest commerce.',
        favors: ['profitable trades', 'fair dealing', 'accumulating wealth', 'commerce'],
        angers: ['theft', 'fraud', 'breaking contracts', 'unfair dealings'],
        blessings: [
          { name: 'Merchant\'s Luck', effect: '+2 to appraisal and bartering checks' },
          { name: 'Golden Touch', effect: 'Gain 25% more gold from commerce' },
          { name: 'Deal Maker', effect: 'Advantage on persuasion checks for trades' }
        ],
        curses: [
          { name: 'Poverty', effect: '-2 to earning gold, lose money constantly' },
          { name: 'Fraud', effect: 'All your deals fail, you lose money' },
          { name: 'Theft Curse', effect: 'Thieves are attracted to you' }
        ],
        rivalDeities: [],
        alliedDeities: ['oghma'],
        clericDomains: ['Knowledge', 'Trickery'],
        holyDay: 'Trade Accord (6th month, 1st day)',
        associatedRace: 'Merchants'
      }
    ],

    // ───────────────────────────────────────────────────────────────────────────────────────────────────────────
    // LESSER DEITIES (Tier 3 - Demigods and Minor Gods)
    // ───────────────────────────────────────────────────────────────────────────────────────────────────────────
    lesser: [
      {
        id: 'auril',
        name: 'Auril',
        title: 'The Goddess of Winter',
        alignment: 'NE',
        domains: ['Nature', 'Tempest'],
        tier: 'lesser',
        icon: '✧',
        symbol: 'A snowflake or icicle',
        description: 'Goddess of winter, cold, and frost. Auril is merciless and relentless. She brings terrible winters and demands sacrifice from mortals.',
        favors: ['enduring cold', 'causing winter', 'sacrifice', 'hunting in snow'],
        angers: ['warmth and spring', 'mercy', 'defying winter'],
        blessings: [
          { name: 'Winter\'s Blessing', effect: 'Immunity to cold, move through ice freely' },
          { name: 'Frost Touch', effect: 'Attacks deal 1d6 cold damage' },
          { name: 'Freeze', effect: 'Freeze water or weaken structures' }
        ],
        curses: [
          { name: 'Winter\'s Curse', effect: 'Take double cold damage, slow movement' },
          { name: 'Frostbite', effect: '-2 to Strength and Dexterity' },
          { name: 'Eternal Cold', effect: 'Cannot benefit from warmth or fire' }
        ],
        rivalDeities: ['chauntea', 'pelor'],
        alliedDeities: ['talos', 'shar'],
        clericDomains: ['Nature', 'Tempest'],
        holyDay: 'Deepwinter (1st month, 15th day)',
        associatedRace: null
      },
      {
        id: 'malar',
        name: 'Malar',
        title: 'The God of the Hunt',
        alignment: 'CE',
        domains: ['Nature'],
        tier: 'lesser',
        icon: '⊗',
        symbol: 'A bloody paw print',
        description: 'God of the hunt, bloodlust, and lycanthropy. Malar is primal rage incarnate. He rewards hunters and those who embrace savagery.',
        favors: ['hunting', 'bloodlust', 'beast forms', 'wild combat'],
        angers: ['peaceful hunting', 'civilization', 'order'],
        blessings: [
          { name: 'Hunter\'s Instinct', effect: '+2 to tracking and hunting checks' },
          { name: 'Beast Form', effect: 'Shapeshift 1/day for 1 hour' },
          { name: 'Blood Rage', effect: 'Advantage on melee attacks against wounded prey' }
        ],
        curses: [
          { name: 'Hunted', effect: 'Beasts attack on sight, cannot find peace' },
          { name: 'Weakness', effect: '-2 to all tracking checks' },
          { name: 'Tamed', effect: 'Cannot show rage or aggression' }
        ],
        rivalDeities: ['corellon', 'chauntea'],
        alliedDeities: ['gruumsh', 'talos'],
        clericDomains: ['Nature'],
        holyDay: 'Highharvestide (10th month, 15th day)',
        associatedRace: null
      },
      {
        id: 'talos',
        name: 'Talos',
        title: 'The God of Storms',
        alignment: 'CE',
        domains: ['Tempest'],
        tier: 'lesser',
        icon: '∿',
        symbol: 'Three triangular lightning bolts',
        description: 'God of storms, destruction, and rebellion. Talos is chaos and destruction. He rewards those who tear down civilization.',
        favors: ['causing destruction', 'raising storms', 'rebellion', 'chaos'],
        angers: ['construction', 'peace', 'clearing weather', 'order'],
        blessings: [
          { name: 'Storm Aspect', effect: 'Lightning damage +2d6, resistance to lightning' },
          { name: 'Storm Call', effect: 'Call down lightning once per day' },
          { name: 'Tempest Power', effect: 'Advantage on saves vs weather' }
        ],
        curses: [
          { name: 'Storm Curse', effect: 'Random lightning strikes nearby (50% self-damage)' },
          { name: 'Grounded', effect: 'Cannot benefit from flying' },
          { name: 'Calm', effect: 'Weather always opposes you' }
        ],
        rivalDeities: ['chauntea', 'pelor'],
        alliedDeities: ['gruumsh', 'malar'],
        clericDomains: ['Tempest'],
        holyDay: 'Midsummer (7th month, 21st day)',
        associatedRace: null
      },
      {
        id: 'umberlee',
        name: 'Umberlee',
        title: 'The Goddess of the Sea',
        alignment: 'CE',
        domains: ['Tempest'],
        tier: 'lesser',
        icon: '≈',
        symbol: 'A wave in various colors',
        description: 'Goddess of the sea, waves, and currents. Umberlee is the capricious power of the ocean. She both takes and saves sailors.',
        favors: ['sea travel', 'sacrifice to the sea', 'appeasement', 'storms at sea'],
        angers: ['polluting the sea', 'disrespecting sailors', 'calming storms'],
        blessings: [
          { name: 'Sea Legs', effect: 'Never seasick, swim at full speed' },
          { name: 'Wave Rider', effect: 'Advantage on water-based checks' },
          { name: 'Breath of the Sea', effect: 'Waterbreathing 1/day' }
        ],
        curses: [
          { name: 'Drowned', effect: 'Suffocate in water, sinking in sea' },
          { name: 'Cursed Voyage', effect: 'Ships and boats are destroyed around you' },
          { name: 'Sea\'s Prey', effect: 'Sea creatures attack on sight' }
        ],
        rivalDeities: [],
        alliedDeities: ['talos', 'auril'],
        clericDomains: ['Tempest'],
        holyDay: 'Midsummer (7th month, 21st day)',
        associatedRace: 'Sailors'
      },
      {
        id: 'talona',
        name: 'Talona',
        title: 'The Goddess of Disease',
        alignment: 'CE',
        domains: ['Death'],
        tier: 'lesser',
        icon: '◬',
        symbol: 'A yellow teardrop with a rotten dot in the center',
        description: 'Goddess of disease, poison, and plague. Talona is sickness incarnate. She spreads suffering and rewards those who embrace decay.',
        favors: ['spreading disease', 'poisoning', 'plague creation', 'suffering'],
        angers: ['healing', 'curing diseases', 'stopping plagues'],
        blessings: [
          { name: 'Toxic Touch', effect: 'Attacks deal 1d6 poison damage' },
          { name: 'Disease Carrier', effect: 'Transmit diseases without harm' },
          { name: 'Plague Aura', effect: 'Diseases spread in 10ft radius' }
        ],
        curses: [
          { name: 'Plague Carrier', effect: 'Spread disease constantly' },
          { name: 'Sickness', effect: 'Permanently diseased, no cure' },
          { name: 'Weakness', effect: '-2 to all saves vs poison' }
        ],
        rivalDeities: ['pelor', 'lathander', 'chauntea'],
        alliedDeities: ['shar', 'cyric'],
        clericDomains: ['Death'],
        holyDay: 'Deepwinter (1st month, 15th day)',
        associatedRace: null
      },
      {
        id: 'loviatar',
        name: 'Loviatar',
        title: 'The Goddess of Pain',
        alignment: 'LE',
        domains: ['Death'],
        tier: 'lesser',
        icon: '⊘',
        symbol: 'A tongue set against sharp fangs',
        description: 'Goddess of pain, agony, and torture. Loviatar feeds on suffering. She rewards those who inflict pain and endure it.',
        favors: ['inflicting pain', 'torture', 'torment', 'suffering'],
        angers: ['healing', 'mercy', 'preventing pain'],
        blessings: [
          { name: 'Pain Master', effect: '+2 to Intimidation checks' },
          { name: 'Pain Immunity', effect: 'Resistance to all damage' },
          { name: 'Torment Touch', effect: 'Inflict 1d6 pain damage with touch' }
        ],
        curses: [
          { name: 'Constant Pain', effect: '-1 to all rolls from pain' },
          { name: 'Sensitivity', effect: '+2 damage taken from all sources' },
          { name: 'Weakness', effect: 'Cannot resist pain, no pain tolerance' }
        ],
        rivalDeities: ['ilmater', 'pelor'],
        alliedDeities: ['bane', 'cyric', 'bhaal'],
        clericDomains: ['Death'],
        holyDay: 'Spellnight (9th month, 13th day)',
        associatedRace: null
      },
      {
        id: 'savras',
        name: 'Savras',
        title: 'The God of Divination',
        alignment: 'LN',
        domains: ['Knowledge'],
        tier: 'lesser',
        icon: '◎',
        symbol: 'A crystal ball',
        description: 'God of divination, fate, and truth. Savras sees all possible futures. He rewards those who seek knowledge through divination.',
        favors: ['seeking divination', 'studying fate', 'prophecy', 'seeking truth'],
        angers: ['ignoring prophecy', 'deceiving prophets', 'denying fate'],
        blessings: [
          { name: 'True Sight', effect: 'See invisible creatures and magic' },
          { name: 'Fated', effect: 'Glimpse one future outcome per week' },
          { name: 'Divination Boost', effect: '+2 to divination magic' }
        ],
        curses: [
          { name: 'Blindness', effect: 'Cannot see futures or magic' },
          { name: 'False Visions', effect: 'All divinations mislead you' },
          { name: 'Ignorance', effect: 'Cannot learn through study' }
        ],
        rivalDeities: ['shar', 'cyric'],
        alliedDeities: ['oghma', 'mystra'],
        clericDomains: ['Knowledge'],
        holyDay: 'Scribe\'s Day (2nd month, 22nd day)',
        associatedRace: 'Seers'
      },
      {
        id: 'deneir',
        name: 'Deneir',
        title: 'The God of Writing',
        alignment: 'NG',
        domains: ['Knowledge'],
        tier: 'lesser',
        icon: '⸎',
        symbol: 'A quill and scroll',
        description: 'God of writing, scholars, and literature. Deneir preserves knowledge through the written word. He rewards scribes and scholars.',
        favors: ['writing and recording', 'preserving knowledge', 'studying books', 'creation'],
        angers: ['burning books', 'destroying knowledge', 'forgetting lore'],
        blessings: [
          { name: 'Perfect Penmanship', effect: '+2 to writing checks, write 3x faster' },
          { name: 'Knowledge Recall', effect: 'Recall anything read once per day' },
          { name: 'Library Access', effect: 'Always find libraries and knowledge' }
        ],
        curses: [
          { name: 'Illiteracy', effect: 'Cannot read or write' },
          { name: 'Forgotten', effect: 'Cannot retain written information' },
          { name: 'Silence', effect: 'Cannot speak or communicate' }
        ],
        rivalDeities: ['shar', 'cyric'],
        alliedDeities: ['oghma', 'mystra'],
        clericDomains: ['Knowledge'],
        holyDay: 'Scribe\'s Day (2nd month, 22nd day)',
        associatedRace: 'Scholars'
      }
    ]
  };

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // RELIGION EVENTS EXPANDED TEMPLATES
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════

  var RELIGION_EVENTS = {
    divine_blessing: {
      name: 'Divine Blessing',
      icon: '✦',
      category: 'blessing',
      description: 'A favored faction receives divine protection and power',
      effects: { morale: 20, power: 15, influence: 10 }
    },
    divine_wrath: {
      name: 'Divine Wrath',
      icon: '↯',
      category: 'curse',
      description: 'An angered deity punishes a faction with misfortune',
      effects: { morale: -25, power: -15, influence: -20, damage: 10 }
    },
    holy_war: {
      name: 'Holy War',
      icon: '⚔',
      category: 'conflict',
      description: 'Two factions clash in name of their gods',
      effects: { violence: 'high', influence: 0, diplomatic: -30 }
    },
    miracle: {
      name: 'Miracle',
      icon: '⊕',
      category: 'blessing',
      description: 'A miraculous healing or protective event',
      effects: { morale: 30, devotion: 25, population: 5 }
    },
    heresy: {
      name: 'Heresy',
      icon: '⟡',
      category: 'schism',
      description: 'Faction member denounces their deity',
      effects: { morale: -20, unity: -30, devotion: -15 }
    },
    pilgrimage: {
      name: 'Pilgrimage',
      icon: '⟿',
      category: 'movement',
      description: 'Mass movement of worshippers boosts devotion',
      effects: { devotion: 40, influence: 20, morale: 10 }
    },
    prophet_arises: {
      name: 'Prophet Arises',
      icon: '♔',
      category: 'leadership',
      description: 'Charismatic prophet claims divine mandate',
      effects: { morale: 25, power: 20, influence: 30, charisma: 15 }
    },
    temple_desecration: {
      name: 'Temple Desecration',
      icon: '☠',
      category: 'conflict',
      description: 'Enemy defiles a sacred temple',
      effects: { morale: -30, devotion: -35, rage: 40, conflict: 'high' }
    },
    divine_artifact: {
      name: 'Divine Artifact Found',
      icon: '✧',
      category: 'discovery',
      description: 'A holy relic is discovered',
      effects: { power: 25, influence: 35, devotion: 20, wealth: 15 }
    },
    schism: {
      name: 'Religious Schism',
      icon: '⚠️',
      category: 'schism',
      description: 'A temple splits into doctrinal factions',
      effects: { unity: -40, devotion: -20, conflict: 'moderate', influence: -15 }
    },
    inquisition: {
      name: 'Inquisition',
      icon: '⊙',
      category: 'conflict',
      description: 'Faction hunts heretics and rival worshippers',
      effects: { morale: 10, influence: -10, conflict: 'high', fear: 20 }
    },
    crusade: {
      name: 'Crusade',
      icon: '⚔',
      category: 'conflict',
      description: 'Holy war expedition to spread faith',
      effects: { morale: 15, violence: 'high', influence: 25, casualties: -20 }
    },
    divine_champion: {
      name: 'Divine Champion',
      icon: '⛨',
      category: 'blessing',
      description: 'A chosen hero appears to defend the faith',
      effects: { morale: 40, power: 30, influence: 35, hope: 50 }
    },
    plague_of_faith: {
      name: 'Plague of Faith',
      icon: '☠',
      category: 'curse',
      description: 'Disease sent as divine punishment',
      effects: { morale: -35, population: -15, devotion: -40, fear: 30 }
    },
    apotheosis: {
      name: 'Apotheosis',
      icon: '⭐',
      category: 'blessing',
      description: 'A mortal ascends to godhood',
      effects: { morale: 50, influence: 50, power: 40, legend: 100 }
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // PLAYER RELIGION ACTIONS EXPANDED
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════

  var PLAYER_RELIGION_ACTIONS = {
    offer_tribute: {
      name: 'Offer Tribute',
      description: 'Party donates resources to a temple to gain divine favor',
      cost: 'variable (gold or items)',
      favorGain: 15,
      requirements: 'Access to a temple'
    },
    seek_divine_guidance: {
      name: 'Seek Divine Guidance',
      description: 'Consult an oracle for divine wisdom on current quest',
      cost: 'Prayer and time',
      requirements: 'High favor with deity',
      effects: 'Gain insight on objectives'
    },
    desecrate_temple: {
      name: 'Desecrate Temple',
      description: 'Destroy or defile a rival temple',
      cost: 'Combat risk, massive diplomatic penalty',
      favorLoss: 50,
      effects: 'Holy war likely, rival devastated'
    },
    call_divine_intervention: {
      name: 'Call Divine Intervention',
      description: 'Invoke direct aid from a deity',
      cost: 'Requires favor >= 80',
      favorLoss: 80,
      effects: 'Powerful spell effect or blessing'
    },
    convert_populace: {
      name: 'Convert Populace',
      description: 'Spread faith in a region through preaching',
      cost: 'Time and charisma',
      favorGain: 10,
      effects: 'Increase deity\'s influence in region'
    },
    challenge_heresy: {
      name: 'Challenge Heresy',
      description: 'Oppose rival faith through debate or action',
      cost: 'Risk of conflict',
      favorGain: 20,
      effects: 'Reduce rival deity\'s influence'
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // TEMPLE SYSTEM EXPANDED
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════

  var TEMPLE_LEVELS = {
    shrine: {
      name: 'Wayside Shrine',
      rank: 1,
      devotionGen: 2,
      maxPriests: 2,
      influenceRadius: 5,
      constructionCost: 500,
      constructionTime: 7,
      militaryBonus: 0,
      description: 'A small, humble place of worship'
    },
    chapel: {
      name: 'Chapel',
      rank: 2,
      devotionGen: 5,
      maxPriests: 8,
      influenceRadius: 10,
      constructionCost: 2000,
      constructionTime: 30,
      militaryBonus: 1,
      description: 'A proper place of worship for a region'
    },
    temple: {
      name: 'Temple',
      rank: 3,
      devotionGen: 12,
      maxPriests: 25,
      influenceRadius: 25,
      constructionCost: 8000,
      constructionTime: 90,
      militaryBonus: 2,
      description: 'A grand structure of significant power'
    },
    cathedral: {
      name: 'Cathedral',
      rank: 4,
      devotionGen: 25,
      maxPriests: 80,
      influenceRadius: 50,
      constructionCost: 25000,
      constructionTime: 180,
      militaryBonus: 4,
      description: 'A legendary structure of divine power'
    },
    holy_citadel: {
      name: 'Holy Citadel',
      rank: 5,
      devotionGen: 50,
      maxPriests: 200,
      influenceRadius: 100,
      constructionCost: 75000,
      constructionTime: 365,
      militaryBonus: 8,
      description: 'The ultimate seat of divine power'
    }
  };

  function createTemple(deityId, level, city) {
    var levelData = TEMPLE_LEVELS[level || 'temple'];
    return {
      id: 'temple-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      deityId: deityId,
      city: city || 'Unknown',
      level: level || 'temple',
      devotion: 30,
      priests: Math.floor(Math.random() * (levelData ? levelData.maxPriests / 2 : 15)) + 3,
      influence: levelData ? levelData.influenceRadius : 15,
      founded: Date.now(),
      upgraded: false
    };
  }

  function assignTemples(cities, factions, seed) {
    if (!Array.isArray(cities) || !Array.isArray(factions)) return [];

    var temples = [];
    var rng = function(s) {
      var x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    cities.forEach(function(city, idx) {
      var isCapital = city.capital === true;
      var templeCnt = isCapital ? 3 : Math.floor(rng(seed + idx * 7) * 3) + 1;
      var assignedDeities = [];

      for (var i = 0; i < templeCnt; i++) {
        var deityPool = PANTHEON.greater.concat(PANTHEON.intermediate, PANTHEON.lesser);
        var deityIdx = Math.floor(rng(seed + idx * 13 + i * 17) * deityPool.length);
        var deity = deityPool[deityIdx];

        if (!deity || assignedDeities.indexOf(deity.id) !== -1) continue;
        assignedDeities.push(deity.id);

        var levelRng = rng(seed + idx * 23 + i * 31);
        var level = 'shrine';
        if (isCapital) level = 'cathedral';
        else if (levelRng > 0.7) level = 'temple';
        else if (levelRng > 0.4) level = 'chapel';

        temples.push(createTemple(deity.id, level, city.name));
      }
    });

    return temples;
  }

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // RELIGION ENGINE CLASS - EXPANDED
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════

  function ReligionEngine(data) {
    this.divineFavor = new Map();
    this.temples = [];
    this.religionHistory = [];
    this.religionTensions = new Map();
    this.data = data || {};

    this._initDivineFavor(data ? data.factions : []);
  }

  ReligionEngine.prototype._initDivineFavor = function(factions) {
    var self = this;
    if (!Array.isArray(factions)) return;

    factions.forEach(function(faction) {
      if (!faction || !faction.name) return;
      var favorMap = new Map();

      PANTHEON.greater.concat(PANTHEON.intermediate, PANTHEON.lesser).forEach(function(deity) {
        var alignmentMatch = faction.alignment && deity.alignment ?
          faction.alignment.charAt(0) === deity.alignment.charAt(0) ? 5 : -5 : 0;
        favorMap.set(deity.id, alignmentMatch);
      });

      self.divineFavor.set(faction.name, favorMap);
    });
  };

  ReligionEngine.prototype.assignTemplesToCampaign = function(cities, factions, seed) {
    this.temples = assignTemples(cities, factions, seed || Date.now());
    return this.temples;
  };

  ReligionEngine.prototype.pray = function(deityId, factionName) {
    if (!factionName || !deityId) return null;

    var favorMap = this.divineFavor.get(factionName);
    if (!favorMap) return null;

    var currentFavor = favorMap.get(deityId) || 0;
    var bonus = Math.floor(Math.random() * 10) + 5;
    var newFavor = Math.min(100, currentFavor + bonus);

    favorMap.set(deityId, newFavor);

    return {
      success: true,
      deity: deityId,
      faction: factionName,
      previousFavor: currentFavor,
      newFavor: newFavor,
      response: newFavor > 60 ? 'divine blessing' : newFavor > 30 ? 'acknowledgment' : 'silence'
    };
  };

  ReligionEngine.prototype.convertRegion = function(deityId, regionName) {
    if (!regionName || !deityId) return null;

    var regionTemples = this.temples.filter(function(t) { return t.city === regionName; });
    if (regionTemples.length === 0) return null;

    var targetTemple = regionTemples[Math.floor(Math.random() * regionTemples.length)];
    var conversionRate = Math.floor(Math.random() * 20) + 10;

    targetTemple.devotion = Math.min(100, targetTemple.devotion + conversionRate);

    return {
      success: true,
      deity: deityId,
      region: regionName,
      conversionRate: conversionRate,
      newDevotion: targetTemple.devotion
    };
  };

  ReligionEngine.prototype.holyWar = function(deityIdA, deityIdB) {
    var templesA = this.temples.filter(function(t) { return t.deityId === deityIdA; });
    var templesB = this.temples.filter(function(t) { return t.deityId === deityIdB; });

    if (templesA.length === 0 || templesB.length === 0) return null;

    var sharedCities = {};
    templesA.forEach(function(t) { sharedCities[t.city] = (sharedCities[t.city] || 0) + 1; });

    var conflictCities = [];
    templesB.forEach(function(t) {
      if (sharedCities[t.city]) conflictCities.push(t.city);
    });

    return {
      success: true,
      deityA: deityIdA,
      deityB: deityIdB,
      conflictCities: conflictCities,
      severity: conflictCities.length > 3 ? 'major' : conflictCities.length > 1 ? 'moderate' : 'minor'
    };
  };

  ReligionEngine.prototype.processHolyDay = function(calendar) {
    var self = this;
    var blessedTemples = [];

    if (!calendar || !calendar.getCurrentDate) return [];

    var currentDate = calendar.getCurrentDate();
    var month = currentDate.month || 1;
    var day = currentDate.day || 1;

    this.temples.forEach(function(temple) {
      var deity = null;
      var allDeities = PANTHEON.greater.concat(PANTHEON.intermediate, PANTHEON.lesser);

      for (var i = 0; i < allDeities.length; i++) {
        if (allDeities[i].id === temple.deityId) {
          deity = allDeities[i];
          break;
        }
      }

      if (!deity || !deity.holyDay) return;

      var holyDateParts = deity.holyDay.split('(');
      if (holyDateParts.length > 1) {
        var datePart = holyDateParts[1].replace(')', '').split(',').pop().trim();
        var monthDay = datePart.split('day')[0].trim().split('th')[0].split('st')[0].split('nd')[0].split('rd')[0].trim().split(' ');
        var holyMonth = parseInt(monthDay[0]);
        var holyDay = parseInt(monthDay[1]);

        if (month === holyMonth && day === holyDay) {
          temple.devotion = Math.min(100, temple.devotion + 15);
          blessedTemples.push(temple.deityId);
        }
      }
    });

    return blessedTemples;
  };

  ReligionEngine.prototype.getDominantFaith = function(factionName) {
    if (!factionName) return null;

    var favorMap = this.divineFavor.get(factionName);
    if (!favorMap) return null;

    var dominant = null;
    var maxFavor = -101;

    favorMap.forEach(function(favor, deityId) {
      if (favor > maxFavor) {
        maxFavor = favor;
        dominant = deityId;
      }
    });

    return { faction: factionName, dominantDeity: dominant, favor: maxFavor };
  };

  ReligionEngine.prototype.getHeresyRisk = function(factionName) {
    if (!factionName) return null;

    var favorMap = this.divineFavor.get(factionName);
    if (!favorMap) return { faction: factionName, risk: 0 };

    var deityFavors = [];
    favorMap.forEach(function(favor, deityId) {
      if (favor > 30) deityFavors.push({ deityId: deityId, favor: favor });
    });

    var risk = 0;
    if (deityFavors.length > 2) risk = 30;
    else if (deityFavors.length === 2) risk = 15;

    return {
      faction: factionName,
      risk: risk,
      rivalFaiths: deityFavors.length
    };
  };

  ReligionEngine.prototype.getDivineFavorSummary = function(factionName) {
    if (!factionName) return null;

    var favorMap = this.divineFavor.get(factionName);
    if (!favorMap) return null;

    var summary = {
      faction: factionName,
      favored: [],
      neutral: [],
      disfavored: []
    };

    var allDeities = PANTHEON.greater.concat(PANTHEON.intermediate, PANTHEON.lesser);
    allDeities.forEach(function(deity) {
      var favor = favorMap.get(deity.id) || 0;

      if (favor > 50) {
        summary.favored.push({ deity: deity.name, favor: favor, id: deity.id });
      } else if (favor < -50) {
        summary.disfavored.push({ deity: deity.name, favor: favor, id: deity.id });
      } else {
        summary.neutral.push({ deity: deity.name, favor: favor, id: deity.id });
      }
    });

    return summary;
  };

  ReligionEngine.prototype.getRegionReligion = function(regionName) {
    if (!regionName || !Array.isArray(this.temples)) return null;

    var regionTemples = this.temples.filter(function(t) { return t.city === regionName; });
    if (regionTemples.length === 0) return null;

    var deityTotals = {};
    regionTemples.forEach(function(temple) {
      if (!deityTotals[temple.deityId]) {
        deityTotals[temple.deityId] = { devotion: 0, temples: 0 };
      }
      deityTotals[temple.deityId].devotion += temple.devotion;
      deityTotals[temple.deityId].temples += 1;
    });

    var dominant = null;
    var maxDevotion = 0;
    Object.keys(deityTotals).forEach(function(deityId) {
      if (deityTotals[deityId].devotion > maxDevotion) {
        maxDevotion = deityTotals[deityId].devotion;
        dominant = deityId;
      }
    });

    return {
      region: regionName,
      dominant: dominant,
      temples: regionTemples,
      deityTotals: deityTotals
    };
  };

  ReligionEngine.prototype.tick = function(data, calendar) {
    var self = this;
    var events = [];

    if (Array.isArray(this.temples)) {
      this.temples.forEach(function(temple) {
        var levelData = TEMPLE_LEVELS[temple.level || 'temple'];
        var baseGen = levelData ? levelData.devotionGen : 5;
        var season = calendar ? calendar.getSeason() : null;
        var seasonId = season ? season.id : null;
        var seasonBonus = 0;

        temple.devotion = Math.min(100, temple.devotion + baseGen + seasonBonus);
      });
    }

    this.divineFavor.forEach(function(favorMap, factionName) {
      favorMap.forEach(function(favor, deityId) {
        if (favor > 70) {
          events.push({
            type: 'divine_blessing',
            deity: deityId,
            faction: factionName,
            favor: favor
          });
        } else if (favor < -70) {
          events.push({
            type: 'divine_wrath',
            deity: deityId,
            faction: factionName,
            favor: favor
          });
        }
      });
    });

    this.religionHistory.push({ tick: Date.now(), events: events });
    return events;
  };

  ReligionEngine.prototype.triggerDivineIntervention = function(deityId, targetRegion) {
    var deity = null;
    var allDeities = PANTHEON.greater.concat(PANTHEON.intermediate, PANTHEON.lesser);

    for (var i = 0; i < allDeities.length; i++) {
      if (allDeities[i].id === deityId) {
        deity = allDeities[i];
        break;
      }
    }

    if (!deity) return null;

    var interventionTypes = ['blessing', 'curse', 'manifestation', 'miracle'];
    var type = interventionTypes[Math.floor(Math.random() * interventionTypes.length)];

    return {
      deity: deity.name,
      type: type,
      region: targetRegion,
      power: 'legendary',
      description: 'A direct manifestation of ' + deity.name + '\'s divine will!',
      timestamp: Date.now()
    };
  };

  ReligionEngine.prototype.getDeityByName = function(name) {
    var allDeities = PANTHEON.greater.concat(PANTHEON.intermediate, PANTHEON.lesser);
    for (var i = 0; i < allDeities.length; i++) {
      if (allDeities[i].name.toLowerCase() === name.toLowerCase() || allDeities[i].id === name) {
        return allDeities[i];
      }
    }
    return null;
  };

  ReligionEngine.prototype.getDeityBlessingList = function(deityId) {
    var deity = this.getDeityByName(deityId);
    if (!deity || !Array.isArray(deity.blessings)) return [];
    return deity.blessings;
  };

  ReligionEngine.prototype.getDeityDomains = function(deityId) {
    var deity = this.getDeityByName(deityId);
    if (!deity) return [];
    return deity.domains || [];
  };

  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════
  // EXPORTS
  // ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════

  global.ReligionEngine = ReligionEngine;
  global.PANTHEON = PANTHEON;
  global.RELIGION_EVENTS = RELIGION_EVENTS;
  global.PLAYER_RELIGION_ACTIONS = PLAYER_RELIGION_ACTIONS;
  global.TEMPLE_LEVELS = TEMPLE_LEVELS;

})(window);
