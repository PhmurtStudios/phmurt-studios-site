// ═══════════════════════════════════════════════
// D&D 3.5 EDITION — CHARACTER BUILDER DATA
// ═══════════════════════════════════════════════
const DND35_DATA = {};

// ── ABILITY NAMES ──
DND35_DATA.abilityNames  = {str:'Strength',dex:'Dexterity',con:'Constitution',int:'Intelligence',wis:'Wisdom',cha:'Charisma'};
DND35_DATA.abilityShort  = {str:'STR',dex:'DEX',con:'CON',int:'INT',wis:'WIS',cha:'CHA'};
DND35_DATA.profBonus     = {1:2,2:2,3:2,4:2,5:3,6:3,7:3,8:3,9:4,10:4,11:4,12:4,13:5,14:5,15:5,16:5,17:6,18:6,19:6,20:6};

// ── ALIGNMENTS ──
DND35_DATA.alignments = [
  'Lawful Good','Neutral Good','Chaotic Good',
  'Lawful Neutral','True Neutral','Chaotic Neutral',
  'Lawful Evil','Neutral Evil','Chaotic Evil'
];

// ── RACES ──
DND35_DATA.races = {
  human: {
    name:'Human', size:'Medium', speed:30, languages:['Common','One of your choice'],
    asi:{}, bonusSkillPoints:4, bonusFeat:true,
    traits:[
      {name:'Bonus Feat',desc:'Humans gain one extra feat at 1st level.'},
      {name:'Bonus Skill Points',desc:'Humans gain 4 extra skill points at 1st level and 1 extra skill point per level thereafter.'}
    ],
    subraces:[]
  },
  elf: {
    name:'Elf', size:'Medium', speed:30, languages:['Common','Elven'],
    asi:{dex:2,con:-2},
    traits:[
      {name:'Low-Light Vision',desc:'Elves can see twice as far as a human in dim light.'},
      {name:'Elven Immunities',desc:'Immune to magic sleep effects. +2 saving throw bonus vs. enchantment spells and effects.'},
      {name:'Keen Senses',desc:'+2 racial bonus on Listen, Search, and Spot checks. An elf who passes within 5 feet of a secret door is entitled to a Search check as if actively searching.'},
      {name:'Weapon Proficiency',desc:'Proficient with longsword, rapier, longbow, shortbow, and composite variants.'}
    ],
    skillBonuses:{listen:2,search:2,spot:2},
    subraces:[]
  },
  dwarf: {
    name:'Dwarf', size:'Medium', speed:20, languages:['Common','Dwarven'],
    asi:{con:2,cha:-2},
    traits:[
      {name:'Darkvision',desc:'Dwarves can see in the dark up to 60 feet.'},
      {name:'Stonecunning',desc:'+2 racial bonus on Search checks for unusual stonework. Automatic check if within 10 feet.'},
      {name:'Weapon Familiarity',desc:'Dwarves may treat dwarven waraxes and dwarven urgroshes as martial weapons rather than exotic weapons.'},
      {name:'Racial Combat Bonus',desc:'+1 racial bonus on attack rolls against orcs and goblinoids. +4 dodge bonus to AC against giants.'},
      {name:'Stability',desc:'+4 bonus vs. bull rush or trip attacks when standing on the ground.'},
      {name:'Poison Resistance',desc:'+2 racial bonus on saving throws against poison.'},
      {name:'Spell Resistance',desc:'+2 racial bonus on saving throws against spells and spell-like effects.'}
    ],
    skillBonuses:{appraise:2,craft:2},
    subraces:[]
  },
  gnome: {
    name:'Gnome', size:'Small', speed:20, languages:['Common','Gnome'],
    asi:{con:2,str:-2},
    traits:[
      {name:'Low-Light Vision',desc:'Gnomes can see twice as far as a human in dim light.'},
      {name:'Gnome Magic',desc:'+1 DC for all illusion spells. Can cast dancing lights, ghost sound, prestidigitation 1/day each. Can cast speak with animals (burrowing mammals) 1/day.'},
      {name:'Weapon Familiarity',desc:'Gnomes may treat gnome hooked hammers as martial weapons rather than exotic weapons.'},
      {name:'Racial Combat Bonus',desc:'+1 racial bonus on attack rolls against kobolds and goblinoids. +4 dodge bonus to AC against giants.'},
      {name:'Spell Resistance',desc:'+2 racial bonus on saving throws vs. illusions.'},
      {name:'Keen Ears',desc:'+2 racial bonus on Listen checks.'},
      {name:'Small Size',desc:'+1 bonus to Armor Class and attack rolls. +4 bonus on Hide checks. -4 penalty on grapple checks.'}
    ],
    skillBonuses:{listen:2,craft_alchemy:2},
    subraces:[]
  },
  halfling: {
    name:'Halfling', size:'Small', speed:20, languages:['Common','Halfling'],
    asi:{dex:2,str:-2},
    traits:[
      {name:'Small Size',desc:'+1 bonus to AC and attacks, +4 bonus on Hide checks.'},
      {name:'Lucky',desc:'+1 racial bonus on all saving throws.'},
      {name:'Courage',desc:'+2 morale bonus on saving throws against fear.'},
      {name:'Keen Aim',desc:'+1 racial bonus on attack rolls with thrown weapons and slings.'},
      {name:'Halfling Skills',desc:'+2 racial bonus on Climb, Jump, Listen, and Move Silently checks.'}
    ],
    skillBonuses:{climb:2,jump:2,listen:2,moveSilently:2},
    subraces:[]
  },
  halfElf: {
    name:'Half-Elf', size:'Medium', speed:30, languages:['Common','Elven'],
    asi:{},
    traits:[
      {name:'Low-Light Vision',desc:'Half-elves can see twice as far as a human in dim light.'},
      {name:'Partial Elven Immunities',desc:'+2 bonus on saving throws vs. enchantment spells and effects. Immune to sleep magic.'},
      {name:'Elven Senses',desc:'+1 racial bonus on Listen, Search, and Spot checks.'},
      {name:'Adaptable',desc:'Half-elves have no favored class, and do not take the -20% XP penalty for multiclassing.'}
    ],
    skillBonuses:{listen:1,search:1,spot:1,diplomacy:2,gather:2},
    subraces:[]
  },
  halfOrc: {
    name:'Half-Orc', size:'Medium', speed:30, languages:['Common','Orc'],
    asi:{str:2,int:-2,cha:-2},
    traits:[
      {name:'Darkvision',desc:'Half-orcs can see in the dark up to 60 feet.'},
      {name:'Orc Blood',desc:'For all effects related to race, a half-orc is considered an orc.'}
    ],
    skillBonuses:{},
    subraces:[]
  }
};

// ── CLASSES ──
// BAB progression: good=1, medium=0.75, poor=0.5
// Save progression: good=2+floor(L/2), poor=floor(L/3)
DND35_DATA.classes = {
  barbarian: {
    name:'Barbarian', hitDie:12, skillPoints:4, babProg:'good',
    goodSaves:['fort'], poorSaves:['ref','will'],
    primaryAbility:'str',
    armorProf:['Light armor','Medium armor','Shields (not tower)'],
    weaponProf:['Simple weapons','Martial weapons'],
    classSkills:['Climb','Handle Animal','Intimidate','Jump','Listen','Ride','Survival','Swim'],
    spellcastingAbility:null,
    features:[
      {level:1,name:'Fast Movement',desc:'Speed +10 ft (in light or no armor).'},
      {level:1,name:'Illiteracy',desc:'Barbarians do not automatically know how to read and write. 2 skill points to become literate.'},
      {level:1,name:'Rage',uses:1,recharge:'day',isDaily:true,desc:'Enter a fearsome rage: +4 STR, +4 CON, +2 Will saves, -2 AC. Lasts CON modifier +3 rounds. Fatigued afterward.'},
      {level:2,name:'Uncanny Dodge',desc:'Retain DEX bonus to AC even when flat-footed.'},
      {level:3,name:'Trap Sense +1',desc:'+1 bonus on Reflex saves to avoid traps and +1 dodge bonus to AC against attacks by traps.'}
    ],
    equipment:[['Greataxe','Any martial weapon'],['Studded leather armor'],['Explorer\'s Outfit']]
  },
  bard: {
    name:'Bard', hitDie:6, skillPoints:6, babProg:'medium',
    goodSaves:['ref','will'], poorSaves:['fort'],
    primaryAbility:'cha',
    armorProf:['Light armor','Shields (no spells)'],
    weaponProf:['Simple weapons','Longsword','Rapier','Sap','Short sword','Shortbow','Whip'],
    classSkills:['Appraise','Balance','Bluff','Climb','Concentration','Craft','Decipher Script','Diplomacy','Disguise','Escape Artist','Gather Information','Hide','Jump','Knowledge (all)','Listen','Move Silently','Perform','Profession','Sense Motive','Sleight of Hand','Speak Language','Spellcraft','Swim','Tumble','Use Magic Device'],
    spellcastingAbility:'cha',
    features:[
      {level:1,name:'Bardic Music',uses:'cha_mod_plus_level',recharge:'day',isDaily:true,desc:'Bardic music abilities a number of times per day equal to Perform ranks. Includes Inspire Courage, Inspire Competence, Fascinate, Suggestion, Inspire Greatness.'},
      {level:1,name:'Bardic Knowledge',desc:'Make a special bardic knowledge check (d20 + bard level + INT modifier) to recall useful information.'},
      {level:1,name:'Countersong',desc:'Use Perform to counter sound-based magical effects for up to 10 rounds.'},
      {level:1,name:'Fascinate',desc:'Use Perform to cause one or more creatures to become fascinated with you.'},
      {level:1,name:'Inspire Courage +1',desc:'+1 morale bonus on saves vs. charm and fear effects, and attack and weapon damage rolls.'}
    ],
    equipment:[['Rapier','Shortsword'],['Leather armor'],['Backpack, Common']]
  },
  cleric: {
    name:'Cleric', hitDie:8, skillPoints:2, babProg:'medium',
    goodSaves:['fort','will'], poorSaves:['ref'],
    primaryAbility:'wis',
    armorProf:['All armor','All shields'],
    weaponProf:['Simple weapons'],
    classSkills:['Concentration','Craft','Diplomacy','Heal','Knowledge (arcana)','Knowledge (history)','Knowledge (religion)','Knowledge (the planes)','Profession','Spellcraft'],
    spellcastingAbility:'wis',
    features:[
      {level:1,name:'Aura',desc:'A cleric of a chaotic, evil, good, or lawful deity has a particularly powerful aura of that alignment.'},
      {level:1,name:'Spontaneous Casting',desc:'Can spontaneously cast cure or inflict spells by sacrificing prepared spells of the same level.'},
      {level:1,name:'Turn/Rebuke Undead',uses:'3_plus_cha',recharge:'day',isDaily:true,desc:'Turn undead (good/neutral) or rebuke undead (evil). Uses = 3 + CHA modifier per day.'},
      {level:1,name:'Domain Spells',desc:'Clerics choose two domains and gain domain spells and a domain power for each.'}
    ],
    equipment:[['Scale mail'],['Light wooden shield'],['Heavy mace','Simple weapon of your choice']]
  },
  druid: {
    name:'Druid', hitDie:8, skillPoints:4, babProg:'medium',
    goodSaves:['fort','will'], poorSaves:['ref'],
    primaryAbility:'wis',
    armorProf:['Light armor','Medium armor','Shields (wooden only)'],
    weaponProf:['Club','Dagger','Dart','Quarterstaff','Scimitar','Sickle','Shortspear','Sling','Spear'],
    classSkills:['Concentration','Craft','Diplomacy','Handle Animal','Heal','Knowledge (nature)','Listen','Profession','Ride','Spellcraft','Spot','Survival','Swim'],
    spellcastingAbility:'wis',
    features:[
      {level:1,name:'Animal Companion',desc:'A druid gains the service of an animal companion. Gains additional abilities as the druid gains levels.'},
      {level:1,name:'Nature Sense',desc:'+2 bonus on Knowledge (nature) and Survival checks.'},
      {level:1,name:'Wild Empathy',desc:'Improve attitude of an animal (as Diplomacy for people). Level + CHA modifier + d20.'},
      {level:2,name:'Woodland Stride',desc:'Move through natural undergrowth without penalty and without leaving a trail.'},
      {level:4,name:'Wild Shape',uses:1,recharge:'day',isDaily:true,desc:'Assume the form of a small or medium animal. 1/day at 4th level, gaining one additional use per two levels.'}
    ],
    equipment:[['Scimitar'],['Wooden shield'],['Leather armor']]
  },
  fighter: {
    name:'Fighter', hitDie:10, skillPoints:2, babProg:'good',
    goodSaves:['fort'], poorSaves:['ref','will'],
    primaryAbility:'str',
    armorProf:['All armor','All shields (including tower)'],
    weaponProf:['Simple weapons','Martial weapons'],
    classSkills:['Climb','Craft','Handle Animal','Intimidate','Jump','Knowledge (dungeoneering)','Ride','Swim'],
    spellcastingAbility:null,
    features:[
      {level:1,name:'Bonus Feats',desc:'A fighter gains a bonus combat-related feat at 1st level and at every even-numbered level. Must meet the prerequisites for the feat.'}
    ],
    equipment:[['Longsword','Greataxe','Any martial weapon'],['Full plate','Chainmail'],['Tower shield','Heavy steel shield']]
  },
  monk: {
    name:'Monk', hitDie:8, skillPoints:4, babProg:'medium',
    goodSaves:['fort','ref','will'], poorSaves:[],
    primaryAbility:'wis',
    armorProf:[], weaponProf:['Club','Crossbow (light or heavy)','Dagger','Handaxe','Javelin','Kama','Nunchaku','Quarterstaff','Sai','Shuriken','Siangham','Sling'],
    classSkills:['Balance','Climb','Concentration','Craft','Diplomacy','Escape Artist','Hide','Jump','Knowledge (arcana)','Knowledge (religion)','Listen','Move Silently','Perform','Profession','Sense Motive','Spot','Swim','Tumble'],
    spellcastingAbility:null,
    features:[
      {level:1,name:'Unarmed Strike',desc:'Deal lethal or nonlethal damage equal to 1d6 (small: 1d4) without penalty. Considered armed.'},
      {level:1,name:'Flurry of Blows',desc:'Extra attacks at -2 penalty to all attacks. Gain one extra attack at highest BAB.'},
      {level:1,name:'Stunning Fist',uses:'level_per_day',recharge:'day',isDaily:true,desc:'Force opponent to make Fortitude save (DC 10 + half level + WIS mod) or be stunned for 1 round.'},
      {level:2,name:'Evasion',desc:'On successful Reflex save vs. area effect, take no damage (normally half).'},
      {level:3,name:'Still Mind',desc:'+2 bonus on saving throws against enchantment spells and effects.'},
      {level:3,name:'Ki Strike (Magic)',desc:'Unarmed attacks are treated as magic weapons for purposes of damage reduction.'}
    ],
    equipment:[['Quarterstaff'],['Explorer\'s Outfit']]
  },
  paladin: {
    name:'Paladin', hitDie:10, skillPoints:2, babProg:'good',
    goodSaves:['fort'], poorSaves:['ref','will'],
    primaryAbility:'cha',
    armorProf:['All armor','All shields'],
    weaponProf:['Simple weapons','Martial weapons'],
    classSkills:['Concentration','Craft','Diplomacy','Handle Animal','Heal','Knowledge (nobility)','Knowledge (religion)','Profession','Ride','Sense Motive','Spellcraft'],
    spellcastingAbility:'wis',
    features:[
      {level:1,name:'Aura of Good',desc:'The power of a paladin\'s aura of good equals the paladin level.'},
      {level:1,name:'Detect Evil',desc:'At will, detect evil as the spell.'},
      {level:1,name:'Smite Evil',uses:'cha_mod_min1',recharge:'day',isDaily:true,desc:'+CHA mod to attack roll, +paladin level to damage. Must be evil target.'},
      {level:1,name:'Divine Grace',desc:'+CHA modifier bonus on all saving throws.'},
      {level:1,name:'Lay on Hands',uses:'level_x_cha',recharge:'day',isDaily:true,isPool:true,desc:'Heal hit points equal to paladin level × CHA modifier. Alternatively, deal damage to undead.'},
      {level:2,name:'Aura of Courage',desc:'Immune to fear. Allies within 10 ft gain +4 morale bonus on fear saves.'},
      {level:2,name:'Divine Health',desc:'Immune to all diseases including supernatural and magical.'}
    ],
    equipment:[['Longsword','Any martial weapon'],['Full plate'],['Heavy steel shield']]
  },
  ranger: {
    name:'Ranger', hitDie:8, skillPoints:6, babProg:'good',
    goodSaves:['fort','ref'], poorSaves:['will'],
    primaryAbility:'dex',
    armorProf:['Light armor','Shields (not tower)'],
    weaponProf:['Simple weapons','Martial weapons'],
    classSkills:['Climb','Concentration','Craft','Handle Animal','Heal','Hide','Jump','Knowledge (dungeoneering)','Knowledge (geography)','Knowledge (nature)','Listen','Move Silently','Profession','Ride','Search','Spot','Survival','Swim','Use Rope'],
    spellcastingAbility:'wis',
    features:[
      {level:1,name:'Favored Enemy',desc:'Select a type of creature. +2 bonus on Bluff, Listen, Sense Motive, Spot, and Survival checks against it. +2 bonus on weapon damage rolls.'},
      {level:1,name:'Track',desc:'Gain Track as a bonus feat.'},
      {level:1,name:'Wild Empathy',desc:'Improve attitude of an animal (as Diplomacy). Level + CHA modifier + d20.'},
      {level:2,name:'Combat Style',desc:'At 2nd level, choose Archery or Two-Weapon Combat as a bonus fighting style feat (without prerequisites).'},
      {level:3,name:'Endurance',desc:'Gain Endurance as a bonus feat.'}
    ],
    equipment:[['Longbow','Shortbow','Two short swords'],['Studded leather armor'],['Quiver of 40 arrows']]
  },
  rogue: {
    name:'Rogue', hitDie:6, skillPoints:8, babProg:'medium',
    goodSaves:['ref'], poorSaves:['fort','will'],
    primaryAbility:'dex',
    armorProf:['Light armor'],
    weaponProf:['Simple weapons','Hand crossbow','Rapier','Sap','Shortbow','Short sword'],
    classSkills:['Appraise','Balance','Bluff','Climb','Craft','Decipher Script','Diplomacy','Disable Device','Disguise','Escape Artist','Forgery','Gather Information','Hide','Intimidate','Jump','Knowledge (local)','Listen','Move Silently','Open Lock','Perform','Profession','Search','Sense Motive','Sleight of Hand','Spot','Swim','Tumble','Use Magic Device','Use Rope'],
    spellcastingAbility:null,
    features:[
      {level:1,name:'Sneak Attack',desc:'+1d6 extra damage when flanking or when target is denied DEX bonus. +1d6 every two levels.'},
      {level:1,name:'Trapfinding',desc:'Can find and disarm magical traps (Search and Disable Device DC 20+).'},
      {level:2,name:'Evasion',desc:'On successful Reflex save vs. area effect, take no damage.'},
      {level:3,name:'Trap Sense +1',desc:'+1 bonus on Reflex saves vs. traps and +1 dodge bonus to AC vs. trap attacks.'},
      {level:4,name:'Uncanny Dodge',desc:'Retain DEX bonus to AC even when flat-footed.'}
    ],
    equipment:[['Short sword','Rapier'],['Leather armor'],['Thieves\' tools']]
  },
  sorcerer: {
    name:'Sorcerer', hitDie:4, skillPoints:2, babProg:'poor',
    goodSaves:['will'], poorSaves:['fort','ref'],
    primaryAbility:'cha',
    armorProf:[], weaponProf:['Simple weapons'],
    classSkills:['Bluff','Concentration','Craft','Knowledge (arcana)','Profession','Spellcraft'],
    spellcastingAbility:'cha',
    features:[
      {level:1,name:'Familiar',desc:'Gain a familiar — a magical beast that aids the sorcerer. Share spells, empathic link, grants special ability.'},
      {level:1,name:'Spells Known',desc:'Sorcerers learn a limited number of spells permanently, but cast them any number of times per day within daily limits. No preparation required.'}
    ],
    equipment:[['Quarterstaff','Dagger'],['Scholar\'s outfit'],['Component pouch']]
  },
  wizard: {
    name:'Wizard', hitDie:4, skillPoints:2, babProg:'poor',
    goodSaves:['will'], poorSaves:['fort','ref'],
    primaryAbility:'int',
    armorProf:[], weaponProf:['Club','Dagger','Heavy crossbow','Light crossbow','Quarterstaff'],
    classSkills:['Concentration','Craft','Decipher Script','Knowledge (all)','Profession','Spellcraft'],
    spellcastingAbility:'int',
    features:[
      {level:1,name:'Familiar',desc:'Gain a familiar — a magical beast. Share spells, empathic link, grants special ability.'},
      {level:1,name:'Scribe Scroll',desc:'Can scribe magical scrolls as a bonus feat at 1st level.'},
      {level:1,name:'Bonus Feats',desc:'Gain bonus metamagic or item creation feats at 5th level and every 5 levels thereafter.'},
      {level:1,name:'Specialization',desc:'Optionally specialize in a school of magic, gaining one extra spell slot per level but banning one or two other schools.'},
      {level:1,name:'Spellbook',desc:'Must prepare spells from a spellbook. Begin with 3+INT modifier 1st-level spells plus all 0-level wizard spells.'}
    ],
    equipment:[['Quarterstaff','Dagger'],['Scholar\'s outfit'],['Spellbook','Component pouch']]
  }
};

// ── SAVING THROW FORMULAS ──
DND35_DATA.saveBonusAt1 = {
  good: function(){ return 2; },
  poor: function(){ return 0; }
};

// ── BASE ATTACK BONUS AT LEVEL 1 ──
DND35_DATA.babAt1 = {
  good: 1, medium: 0, poor: 0
};

// ── SKILLS (3.5e full list) ──
DND35_DATA.skills = {
  appraise:        {name:'Appraise',         ability:'int', trained:false},
  balance:         {name:'Balance',           ability:'dex', trained:false},
  bluff:           {name:'Bluff',             ability:'cha', trained:false},
  climb:           {name:'Climb',             ability:'str', trained:false},
  concentration:   {name:'Concentration',     ability:'con', trained:false},
  craft:           {name:'Craft',             ability:'int', trained:false},
  decipherScript:  {name:'Decipher Script',   ability:'int', trained:true},
  diplomacy:       {name:'Diplomacy',         ability:'cha', trained:false},
  disableDevice:   {name:'Disable Device',    ability:'int', trained:true},
  disguise:        {name:'Disguise',          ability:'cha', trained:false},
  escapeArtist:    {name:'Escape Artist',     ability:'dex', trained:false},
  forgery:         {name:'Forgery',           ability:'int', trained:false},
  gatherInfo:      {name:'Gather Information',ability:'cha', trained:false},
  handleAnimal:    {name:'Handle Animal',     ability:'cha', trained:true},
  heal:            {name:'Heal',              ability:'wis', trained:false},
  hide:            {name:'Hide',              ability:'dex', trained:false},
  intimidate:      {name:'Intimidate',        ability:'cha', trained:false},
  jump:            {name:'Jump',              ability:'str', trained:false},
  knowledge_arcana:{name:'Knowledge (arcana)',ability:'int', trained:true},
  knowledge_dungeo:{name:'Knowledge (dungeoneering)',ability:'int',trained:true},
  knowledge_local: {name:'Knowledge (local)', ability:'int', trained:true},
  knowledge_nature:{name:'Knowledge (nature)',ability:'int', trained:true},
  knowledge_relgn: {name:'Knowledge (religion)',ability:'int',trained:true},
  knowledge_planes:{name:'Knowledge (planes)',ability:'int', trained:true},
  listen:          {name:'Listen',            ability:'wis', trained:false},
  moveSilently:    {name:'Move Silently',     ability:'dex', trained:false},
  openLock:        {name:'Open Lock',         ability:'dex', trained:true},
  perform:         {name:'Perform',           ability:'cha', trained:false},
  profession:      {name:'Profession',        ability:'wis', trained:true},
  ride:            {name:'Ride',              ability:'dex', trained:false},
  search:          {name:'Search',            ability:'int', trained:false},
  senseMotive:     {name:'Sense Motive',      ability:'wis', trained:false},
  sleightOfHand:   {name:'Sleight of Hand',   ability:'dex', trained:true},
  spellcraft:      {name:'Spellcraft',        ability:'int', trained:true},
  spot:            {name:'Spot',              ability:'wis', trained:false},
  survival:        {name:'Survival',          ability:'wis', trained:false},
  swim:            {name:'Swim',              ability:'str', trained:false},
  tumble:          {name:'Tumble',            ability:'dex', trained:true},
  useMagicDevice:  {name:'Use Magic Device',  ability:'cha', trained:true},
  useRope:         {name:'Use Rope',          ability:'dex', trained:false}
};

// ── FEATS ──
DND35_DATA.feats = [
  {name:'Alertness',              prereq:'—',           desc:'+2 bonus on Listen and Spot checks.'},
  {name:'Athletic',               prereq:'—',           desc:'+2 bonus on Climb and Swim checks.'},
  {name:'Combat Casting',         prereq:'—',           desc:'+4 bonus on Concentration checks for spells while in combat.'},
  {name:'Combat Reflexes',        prereq:'—',           desc:'Take additional attacks of opportunity equal to DEX bonus.'},
  {name:'Dodge',                  prereq:'DEX 13',      desc:'+1 dodge bonus to AC against one opponent per round.'},
  {name:'Endurance',              prereq:'—',           desc:'+4 bonus on checks involving extended physical action. Sleep in medium armor without fatigue.'},
  {name:'Improved Initiative',    prereq:'—',           desc:'+4 bonus on initiative checks.'},
  {name:'Iron Will',              prereq:'—',           desc:'+2 bonus on Will saving throws.'},
  {name:'Lightning Reflexes',     prereq:'—',           desc:'+2 bonus on Reflex saving throws.'},
  {name:'Toughness',              prereq:'—',           desc:'+3 hit points.'},
  {name:'Two-Weapon Fighting',    prereq:'DEX 15',      desc:'Reduce penalties for two-weapon fighting (from -6/-10 to -4/-4).'},
  {name:'Weapon Focus',           prereq:'Proficiency, BAB +1',desc:'+1 bonus on attack rolls with one chosen weapon.'},
  {name:'Weapon Finesse',         prereq:'BAB +1',      desc:'Use DEX instead of STR on attack rolls with light weapons.'},
  {name:'Great Fortitude',        prereq:'—',           desc:'+2 bonus on Fortitude saving throws.'},
  {name:'Stealthy',               prereq:'—',           desc:'+2 bonus on Hide and Move Silently checks.'},
  {name:'Skill Focus',            prereq:'—',           desc:'+3 bonus on one chosen skill.'},
  {name:'Power Attack',           prereq:'STR 13, BAB +1',desc:'Trade attack bonus for damage bonus on melee attacks (1-for-1, or 2-for-1 with two-handed weapon).'},
  {name:'Cleave',                 prereq:'STR 13, Power Attack',desc:'If you drop a foe, immediately make another attack against an adjacent enemy.'},
  {name:'Point Blank Shot',       prereq:'—',           desc:'+1 bonus on ranged attack and damage rolls within 30 feet.'},
  {name:'Far Shot',               prereq:'Point Blank Shot',desc:'Range increment increased by 50% (projectile) or doubled (thrown).'},
  {name:'Precise Shot',           prereq:'Point Blank Shot',desc:'Shoot into melee without -4 penalty.'},
  {name:'Rapid Shot',             prereq:'DEX 13, Point Blank Shot',desc:'Make one extra ranged attack per round at -2 to all attacks.'},
  {name:'Mobility',               prereq:'DEX 13, Dodge',desc:'+4 bonus to AC against attacks of opportunity from movement.'},
  {name:'Spring Attack',          prereq:'DEX 13, Dodge, Mobility, BAB +4',desc:'Move before and after attacking without provoking attacks of opportunity.'},
  {name:'Scribe Scroll',          prereq:'Caster level 1',desc:'Create magic scrolls.'},
  {name:'Brew Potion',            prereq:'Caster level 3',desc:'Create magic potions.'},
  {name:'Spell Penetration',      prereq:'—',           desc:'+2 bonus on caster level checks to overcome spell resistance.'},
  {name:'Silent Spell',           prereq:'—',           desc:'Cast spells without verbal components, using one higher spell slot.'},
  {name:'Still Spell',            prereq:'—',           desc:'Cast spells without somatic components, using one higher spell slot.'},
  {name:'Enlarge Spell',          prereq:'—',           desc:'Double the range of a spell, using one higher spell slot.'},
  {name:'Track',                  prereq:'—',           desc:'Use Survival skill to track creatures by their trails.'},
  {name:'Blind-Fight',            prereq:'—',           desc:'Re-roll miss chances from concealment. Full movement in darkness.'},
  {name:'Improved Unarmed Strike',prereq:'—',           desc:'Unarmed strikes deal lethal damage and do not provoke attacks of opportunity.'},
  {name:'Deflect Arrows',         prereq:'DEX 13, Improved Unarmed Strike',desc:'Deflect one ranged attack per round.'},
  {name:'Run',                    prereq:'—',           desc:'Run at 5× speed. +4 bonus on running Jump checks.'},
  {name:'Mounted Combat',         prereq:'Ride 1 rank', desc:'Once per round, negate a hit on mount with a Ride check (DC = attack roll result).'},
  {name:'Mounted Archery',        prereq:'Mounted Combat', desc:'Halve the penalty for using ranged weapons while mounted.'},
  {name:'Trample',                prereq:'Mounted Combat', desc:'Trample opponents when charging while mounted.'},
  {name:'Acrobatic',              prereq:'—',           desc:'+2 bonus on Jump and Tumble checks.'},
  {name:'Agile',                  prereq:'—',           desc:'+2 bonus on Balance and Escape Artist checks.'},
  {name:'Animal Affinity',        prereq:'—',           desc:'+2 bonus on Handle Animal and Ride checks.'},
  {name:'Deceitful',              prereq:'—',           desc:'+2 bonus on Disguise and Forgery checks.'},
  {name:'Deft Hands',             prereq:'—',           desc:'+2 bonus on Sleight of Hand and Use Rope checks.'},
  {name:'Diligent',               prereq:'—',           desc:'+2 bonus on Appraise and Decipher Script checks.'},
  {name:'Investigator',           prereq:'—',           desc:'+2 bonus on Gather Information and Search checks.'},
  {name:'Magical Aptitude',       prereq:'—',           desc:'+2 bonus on Spellcraft and Use Magic Device checks.'},
  {name:'Negotiator',             prereq:'—',           desc:'+2 bonus on Diplomacy and Sense Motive checks.'},
  {name:'Nimble Fingers',         prereq:'—',           desc:'+2 bonus on Disable Device and Open Lock checks.'},
  {name:'Persuasive',             prereq:'—',           desc:'+2 bonus on Bluff and Intimidate checks.'},
  {name:'Self-Sufficient',        prereq:'—',           desc:'+2 bonus on Heal and Survival checks.'},
  {name:'Improved Critical',      prereq:'Proficiency, BAB +8',desc:'Double the threat range of the chosen weapon.'},
  {name:'Greater Weapon Focus',   prereq:'Weapon Focus, Fighter 8',desc:'+1 more attack bonus with chosen weapon (+2 total).'}
];

// ── SPELLS ──
DND35_DATA.spells = {
  wizard: {
    cantrips:['Acid Splash','Arcane Mark','Dancing Lights','Daze','Detect Magic','Detect Poison','Disrupt Undead','Flare','Ghost Sound','Light','Mage Hand','Mending','Message','Open/Close','Prestidigitation','Ray of Frost','Read Magic','Resistance','Touch of Fatigue'],
    level1: ['Alarm','Burning Hands','Cause Fear','Charm Person','Color Spray','Comprehend Languages','Detect Secret Doors','Disguise Self','Endure Elements','Enlarge Person','Erase','Expeditious Retreat','Feather Fall','Floating Disk','Grease','Hold Portal','Hypnotism','Identify','Jump','Mage Armor','Magic Missile','Magic Weapon','Mount','Obscuring Mist','Protection from Chaos/Evil/Good/Law','Ray of Enfeeblement','Reduce Person','Shield','Shocking Grasp','Silent Image','Sleep','Summon Monster I','True Strike','Unseen Servant','Ventriloquism'],
    level2: ['Arcane Lock','Bear\'s Endurance','Blindness/Deafness','Blur','Bull\'s Strength','Cat\'s Grace','Continual Flame','Darkness','Darkvision','Detect Thoughts','Eagle\'s Splendor','False Life','Flaming Sphere','Fog Cloud','Fox\'s Cunning','Ghoul Touch','Glitterdust','Gust of Wind','Hideous Laughter','Invisibility','Knock','Levitate','Locate Object','Minor Image','Mirror Image','Misdirection','Owl\'s Wisdom','Protection from Arrows','Pyrotechnics','Resist Energy','Rope Trick','Scorching Ray','See Invisibility','Shatter','Spectral Hand','Spider Climb','Summon Monster II','Summon Swarm','Touch of Idiocy','Web','Whispering Wind'],
    level3: ['Arcane Sight','Blink','Clairaudience/Clairvoyance','Deep Slumber','Dispel Magic','Displacement','Explosive Runes','Fireball','Flame Arrow','Fly','Gaseous Form','Gentle Repose','Halt Undead','Haste','Heroism','Hold Person','Invisibility Sphere','Keen Edge','Lightning Bolt','Magic Circle against Chaos/Evil/Good/Law','Major Image','Nondetection','Phantom Steed','Protection from Energy','Rage','Ray of Exhaustion','Shrink Item','Sleet Storm','Slow','Stinking Cloud','Suggestion','Summon Monster III','Tongues','Vampiric Touch','Water Breathing','Wind Wall'],
    level4: ['Animate Dead','Arcane Eye','Bestow Curse','Black Tentacles','Charm Monster','Confusion','Crushing Despair','Detect Scrying','Dimension Door','Dimensional Anchor','Enervation','Enlarge Person (Mass)','Fear','Fire Shield','Fire Trap','Globe of Invulnerability (Lesser)','Greater Invisibility','Hallucinatory Terrain','Ice Storm','Illusory Wall','Locate Creature','Minor Creation','Phantasmal Killer','Polymorph','Rainbow Pattern','Remove Curse','Resilient Sphere','Scrying','Shout','Solid Fog','Stoneskin','Summon Monster IV','Wall of Fire','Wall of Ice'],
    level5: ['Baleful Polymorph','Break Enchantment','Cloudkill','Cone of Cold','Contact Other Plane','Dismissal','Dominate Person','Dream','Fabricate','Feeblemind','Hold Monster','Interposing Hand','Magic Jar','Major Creation','Mind Fog','Mirage Arcana','Nightmare','Overland Flight','Passwall','Permanency','Persistent Image','Prying Eyes','Seeming','Sending','Shadow Evocation','Summon Monster V','Symbol of Pain','Telekinesis','Telepathic Bond','Teleport','Wall of Force','Wall of Stone','Waves of Fatigue'],
    level6: ['Acid Fog','Analyze Dweomer','Antimagic Field','Bear\'s Endurance (Mass)','Bull\'s Strength (Mass)','Chain Lightning','Circle of Death','Contingency','Create Undead','Disintegrate','Eyebite','Flesh to Stone','Forceful Hand','Freezing Sphere','Geas/Quest','Globe of Invulnerability','Greater Dispel Magic','Greater Heroism','Guards and Wards','Legend Lore','Mislead','Move Earth','Permanent Image','Planar Binding','Programmed Image','Repulsion','Shadow Walk','Stone to Flesh','Suggestion (Mass)','Summon Monster VI','Symbol of Fear','True Seeing','Undeath to Death','Veil','Wall of Iron'],
    level7: ['Arcane Sight (Greater)','Banishment','Control Undead','Control Weather','Delayed Blast Fireball','Ethereal Jaunt','Finger of Death','Forcecage','Grasping Hand','Greater Scrying','Greater Shadow Conjuration','Greater Teleport','Insanity','Instant Summons','Limited Wish','Mage\'s Magnificent Mansion','Mage\'s Sword','Phase Door','Plane Shift','Power Word Blind','Prismatic Spray','Project Image','Reverse Gravity','Sequester','Simulacrum','Spell Turning','Statue','Summon Monster VII','Symbol of Stunning','Symbol of Weakness','Teleport Object','Vision','Waves of Exhaustion'],
    level8: ['Antipathy','Binding','Charm Monster (Mass)','Clone','Create Greater Undead','Demand','Dimensional Lock','Discern Location','Horrid Wilting','Incendiary Cloud','Iron Body','Maze','Mind Blank','Moment of Prescience','Polar Ray','Polymorph Any Object','Power Word Stun','Prismatic Wall','Protection from Spells','Scintillating Pattern','Screen','Summon Monster VIII','Sunburst','Symbol of Death','Symbol of Insanity','Sympathy','Telekinetic Sphere','Temporal Stasis','Trap the Soul'],
    level9: ['Astral Projection','Crushing Hand','Disjunction','Dominate Monster','Energy Drain','Etherealness','Foresight','Freedom','Gate','Imprisonment','Meteor Swarm','Power Word Kill','Prismatic Sphere','Refuge','Shapechange','Soul Bind','Summon Monster IX','Teleportation Circle','Time Stop','Wail of the Banshee','Weird','Wish']
  },
  sorcerer: {
    cantrips:['Acid Splash','Arcane Mark','Dancing Lights','Daze','Detect Magic','Ghost Sound','Light','Mage Hand','Mending','Message','Open/Close','Prestidigitation','Ray of Frost','Read Magic','Resistance'],
    level1: ['Burning Hands','Cause Fear','Charm Person','Color Spray','Comprehend Languages','Disguise Self','Enlarge Person','Expeditious Retreat','Feather Fall','Grease','Mage Armor','Magic Missile','Obscuring Mist','Protection from Evil','Ray of Enfeeblement','Reduce Person','Shield','Shocking Grasp','Sleep','True Strike'],
    level2: ['Bear\'s Endurance','Blindness/Deafness','Blur','Bull\'s Strength','Cat\'s Grace','Darkness','Darkvision','Detect Thoughts','Eagle\'s Splendor','False Life','Flaming Sphere','Fox\'s Cunning','Glitterdust','Invisibility','Knock','Levitate','Mirror Image','Owl\'s Wisdom','Resist Energy','Scorching Ray','See Invisibility','Shatter','Spider Climb','Summon Monster II','Web'],
    level3: ['Blink','Deep Slumber','Dispel Magic','Fireball','Fly','Haste','Hold Person','Keen Edge','Lightning Bolt','Major Image','Protection from Energy','Rage','Slow','Stinking Cloud','Suggestion','Summon Monster III','Tongues','Vampiric Touch','Water Breathing','Wind Wall'],
    level4: ['Animate Dead','Black Tentacles','Charm Monster','Confusion','Dimension Door','Enervation','Enlarge Person (Mass)','Fear','Fire Shield','Greater Invisibility','Ice Storm','Phantasmal Killer','Polymorph','Resilient Sphere','Shout','Stoneskin','Summon Monster IV','Wall of Fire','Wall of Ice'],
    level5: ['Baleful Polymorph','Break Enchantment','Cloudkill','Cone of Cold','Dismissal','Dominate Person','Feeblemind','Hold Monster','Magic Jar','Overland Flight','Sending','Shadow Evocation','Summon Monster V','Telekinesis','Teleport','Wall of Force','Wall of Stone','Waves of Fatigue'],
    level6: ['Acid Fog','Chain Lightning','Circle of Death','Contingency','Disintegrate','Eyebite','Flesh to Stone','Globe of Invulnerability','Greater Dispel Magic','Greater Heroism','Mislead','Planar Binding','Suggestion (Mass)','Summon Monster VI','True Seeing','Undeath to Death'],
    level7: ['Banishment','Delayed Blast Fireball','Ethereal Jaunt','Finger of Death','Greater Teleport','Insanity','Limited Wish','Plane Shift','Power Word Blind','Prismatic Spray','Reverse Gravity','Spell Turning','Summon Monster VII','Waves of Exhaustion'],
    level8: ['Charm Monster (Mass)','Demand','Dimensional Lock','Horrid Wilting','Incendiary Cloud','Iron Body','Maze','Mind Blank','Polar Ray','Power Word Stun','Prismatic Wall','Summon Monster VIII','Sunburst','Temporal Stasis'],
    level9: ['Dominate Monster','Energy Drain','Gate','Meteor Swarm','Power Word Kill','Prismatic Sphere','Shapechange','Summon Monster IX','Time Stop','Wail of the Banshee','Wish']
  },
  cleric: {
    cantrips:['Create Water','Cure Minor Wounds','Detect Magic','Detect Poison','Flare','Guidance','Inflict Minor Wounds','Light','Mending','Purify Food and Drink','Read Magic','Resistance','Virtue'],
    level1: ['Bane','Bless','Bless Water','Cause Fear','Command','Comprehend Languages','Cure Light Wounds','Curse Water','Deathwatch','Detect Chaos/Evil/Good/Law','Detect Undead','Divine Favor','Doom','Endure Elements','Entropic Shield','Hide from Undead','Inflict Light Wounds','Magic Stone','Magic Weapon','Obscuring Mist','Protection from Chaos/Evil/Good/Law','Remove Fear','Sanctuary','Shield of Faith','Summon Monster I'],
    level2: ['Aid','Align Weapon','Augury','Bear\'s Endurance','Bull\'s Strength','Calm Emotions','Consecrate','Cure Moderate Wounds','Darkness','Death Knell','Delay Poison','Desecrate','Eagle\'s Splendor','Enthrall','Find Traps','Gentle Repose','Hold Person','Inflict Moderate Wounds','Make Whole','Owl\'s Wisdom','Remove Paralysis','Resist Energy','Restoration (Lesser)','Shatter','Shield Other','Silence','Sound Burst','Spiritual Weapon','Status','Summon Monster II','Zone of Truth'],
    level3: ['Animate Dead','Bestow Curse','Blindness/Deafness','Contagion','Continual Flame','Create Food and Water','Cure Serious Wounds','Daylight','Deeper Darkness','Dispel Magic','Glyph of Warding','Helping Hand','Inflict Serious Wounds','Invisibility Purge','Locate Object','Magic Circle against Chaos/Evil/Good/Law','Magic Vestment','Meld into Stone','Obscure Object','Prayer','Protection from Energy','Remove Blindness/Deafness','Remove Curse','Remove Disease','Searing Light','Speak with Dead','Stone Shape','Summon Monster III','Water Breathing','Water Walk','Wind Wall'],
    level4: ['Air Walk','Control Water','Cure Critical Wounds','Death Ward','Dimensional Anchor','Discern Lies','Dismissal','Divination','Divine Power','Freedom of Movement','Giant Vermin','Greater Magic Weapon','Imbue with Spell Ability','Inflict Critical Wounds','Neutralize Poison','Planar Ally (Lesser)','Poison','Repel Vermin','Restoration','Sending','Spell Immunity','Summon Monster IV','Tongues'],
    level5: ['Atonement','Break Enchantment','Command (Greater)','Commune','Cure Light Wounds (Mass)','Dispel Chaos/Evil/Good/Law','Disrupting Weapon','Flame Strike','Hallow','Inflict Light Wounds (Mass)','Insect Plague','Mark of Justice','Plane Shift','Raise Dead','Righteous Might','Scrying','Slay Living','Spell Resistance','Summon Monster V','Symbol of Pain','True Seeing','Unhallow','Wall of Stone'],
    level6: ['Animate Objects','Antilife Shell','Banishment','Bear\'s Endurance (Mass)','Blade Barrier','Bull\'s Strength (Mass)','Create Undead','Cure Moderate Wounds (Mass)','Eagle\'s Splendor (Mass)','Find the Path','Forbiddance','Geas/Quest','Greater Dispel Magic','Greater Glyph of Warding','Harm','Heal','Heroes\' Feast','Inflict Moderate Wounds (Mass)','Owl\'s Wisdom (Mass)','Planar Ally','Summon Monster VI','Symbol of Fear','Undeath to Death','Wind Walk','Word of Recall'],
    level7: ['Blasphemy','Control Weather','Cure Serious Wounds (Mass)','Destruction','Dictum','Ethereal Jaunt','Greater Restoration','Greater Scrying','Holy Word','Inflict Serious Wounds (Mass)','Refuge','Regenerate','Repulsion','Resurrection','Summon Monster VII','Symbol of Stunning','Symbol of Weakness','Word of Chaos'],
    level8: ['Antimagic Field','Cloak of Chaos','Create Greater Undead','Cure Critical Wounds (Mass)','Dimensional Lock','Discern Location','Earthquake','Fire Storm','Greater Planar Ally','Greater Spell Immunity','Holy Aura','Inflict Critical Wounds (Mass)','Shield of Law','Summon Monster VIII','Symbol of Death','Symbol of Insanity','Unholy Aura'],
    level9: ['Astral Projection','Energy Drain','Etherealness','Gate','Heal (Mass)','Implosion','Miracle','Soul Bind','Storm of Vengeance','Summon Monster IX','True Resurrection']
  },
  druid: {
    cantrips:['Create Water','Cure Minor Wounds','Detect Magic','Detect Poison','Flare','Guidance','Know Direction','Light','Mending','Purify Food and Drink','Read Magic','Resistance','Virtue'],
    level1: ['Calm Animals','Charm Animal','Cure Light Wounds','Detect Animals or Plants','Detect Snares and Pits','Endure Elements','Entangle','Faerie Fire','Goodberry','Hide from Animals','Jump','Longstrider','Magic Fang','Magic Stone','Obscuring Mist','Pass without Trace','Produce Flame','Shillelagh','Speak with Animals','Summon Nature\'s Ally I'],
    level2: ['Animal Messenger','Animal Trance','Barkskin','Bear\'s Endurance','Bull\'s Strength','Cat\'s Grace','Chill Metal','Delay Poison','Fire Trap','Flame Blade','Flaming Sphere','Fog Cloud','Gust of Wind','Heat Metal','Hold Animal','Owl\'s Wisdom','Reduce Animal','Resist Energy','Restoration (Lesser)','Soften Earth and Stone','Spider Climb','Summon Nature\'s Ally II','Summon Swarm','Tree Shape','Warp Wood','Wood Shape'],
    level3: ['Call Lightning','Contagion','Cure Moderate Wounds','Daylight','Diminish Plants','Dominate Animal','Greater Magic Fang','Meld into Stone','Neutralize Poison','Plant Growth','Poison','Protection from Energy','Quench','Remove Disease','Sleet Storm','Snare','Speak with Plants','Spike Growth','Stone Shape','Summon Nature\'s Ally III','Water Breathing','Wind Wall'],
    level4: ['Air Walk','Antiplant Shell','Blight','Command Plants','Control Water','Cure Serious Wounds','Dispel Magic','Flame Strike','Freedom of Movement','Giant Vermin','Ice Storm','Reincarnate','Repel Vermin','Rusting Grasp','Scrying','Spike Stones','Summon Nature\'s Ally IV'],
    level5: ['Animal Growth','Atonement','Awaken','Baleful Polymorph','Call Lightning Storm','Commune with Nature','Control Winds','Cure Critical Wounds','Death Ward','Hallow','Insect Plague','Stoneskin','Summon Nature\'s Ally V','Transmute Mud to Rock','Transmute Rock to Mud','Tree Stride','Unhallow','Wall of Fire','Wall of Thorns'],
    level6: ['Antilife Shell','Bear\'s Endurance (Mass)','Bull\'s Strength (Mass)','Cat\'s Grace (Mass)','Cure Light Wounds (Mass)','Dispel Magic (Greater)','Find the Path','Fire Seeds','Ironwood','Liveoak','Move Earth','Owl\'s Wisdom (Mass)','Repel Wood','Spellstaff','Stone Tell','Summon Nature\'s Ally VI','Transport via Plants','Wall of Stone'],
    level7: ['Animate Plants','Changestaff','Control Weather','Creeping Doom','Cure Moderate Wounds (Mass)','Fire Storm','Heal','Scrying (Greater)','Summon Nature\'s Ally VII','Sunbeam','Transmute Metal to Wood','True Seeing','Wind Walk'],
    level8: ['Animal Shapes','Control Plants','Cure Serious Wounds (Mass)','Earthquake','Finger of Death','Repel Metal or Stone','Reverse Gravity','Summon Nature\'s Ally VIII','Sunburst','Whirlwind','Word of Recall'],
    level9: ['Antipathy','Cure Critical Wounds (Mass)','Elemental Swarm','Foresight','Regenerate','Shambler','Shapechange','Storm of Vengeance','Summon Nature\'s Ally IX','Sympathy']
  },
  bard: {
    cantrips:['Dancing Lights','Daze','Detect Magic','Flare','Ghost Sound','Know Direction','Light','Lullaby','Mage Hand','Mending','Message','Open/Close','Prestidigitation','Read Magic','Resistance','Summon Instrument'],
    level1: ['Alarm','Animate Rope','Cause Fear','Charm Person','Comprehend Languages','Cure Light Wounds','Detect Secret Doors','Disguise Self','Erase','Expeditious Retreat','Feather Fall','Grease','Hypnotism','Identify','Magic Mouth','Magic Aura','Obscure Object','Remove Fear','Silent Image','Sleep','Summon Monster I','Tasha\'s Hideous Laughter','Undetectable Alignment','Unseen Servant','Ventriloquism'],
    level2: ['Alter Self','Animal Messenger','Animal Trance','Blindness/Deafness','Blur','Calm Emotions','Cat\'s Grace','Cure Moderate Wounds','Darkness','Daze Monster','Delay Poison','Detect Thoughts','Eagle\'s Splendor','Enthrall','Fox\'s Cunning','Glitterdust','Heroism','Hold Person','Hypnotic Pattern','Invisibility','Locate Object','Minor Image','Mirror Image','Misdirection','Pyrotechnics','Rage','Scare','Shatter','Silence','Sound Burst','Suggestion','Summon Monster II','Tongues','Whispering Wind'],
    level3: ['Blink','Charm Monster','Clairaudience/Clairvoyance','Confusion','Crushing Despair','Cure Serious Wounds','Daylight','Deep Slumber','Dispel Magic','Displacement','Fear','Gaseous Form','Glibness','Good Hope','Haste','Invisibility Sphere','Leomund\'s Tiny Hut','Major Image','Phantom Steed','Remove Curse','Scrying','Sculpt Sound','Secret Page','See Invisibility','Slow','Speak with Animals','Summon Monster III'],
    level4: ['Break Enchantment','Cure Critical Wounds','Detect Scrying','Dimension Door','Dominate Person','Freedom of Movement','Greater Invisibility','Hallucinatory Terrain','Hold Monster','Legend Lore','Locate Creature','Modify Memory','Neutralize Poison','Rainbow Pattern','Repel Vermin','Secure Shelter','Shadow Conjuration','Shout','Speak with Plants','Summon Monster IV','Zone of Silence'],
    level5: ['Dream','False Vision','Greater Dispel Magic','Greater Heroism','Mass Cure Light Wounds','Mind Fog','Mirage Arcana','Nightmare','Persistent Image','Seeming','Shadow Evocation','Shadow Walk','Song of Discord','Suggestion (Mass)','Summon Monster V'],
    level6: ['Analyze Dweomer','Animate Objects','Cat\'s Grace (Mass)','Charm Monster (Mass)','Cure Moderate Wounds (Mass)','Eagle\'s Splendor (Mass)','Eyebite','Find the Path','Fox\'s Cunning (Mass)','Geas/Quest','Greater Shout','Heroes\' Feast','Irresistible Dance','Permanent Image','Programmed Image','Project Image','Scrying (Greater)','Summon Monster VI','Sympathetic Vibration','Veil']
  },
  paladin: {
    cantrips:[],
    level1: ['Bless','Bless Water','Bless Weapon','Create Water','Cure Light Wounds','Detect Poison','Detect Undead','Divine Favor','Endure Elements','Magic Weapon','Protection from Chaos/Evil','Read Magic','Resistance','Virtue'],
    level2: ['Bull\'s Strength','Delay Poison','Eagle\'s Splendor','Owl\'s Wisdom','Remove Paralysis','Resist Energy','Shield Other','Undetectable Alignment','Zone of Truth'],
    level3: ['Cure Moderate Wounds','Daylight','Discern Lies','Dispel Magic','Greater Magic Weapon','Heal Mount','Magic Circle against Chaos/Evil','Prayer','Remove Blindness/Deafness','Remove Curse'],
    level4: ['Break Enchantment','Cure Serious Wounds','Death Ward','Dispel Chaos/Evil','Holy Sword','Mark of Justice','Neutralize Poison','Restoration']
  },
  ranger: {
    cantrips:[],
    level1: ['Alarm','Animal Messenger','Calm Animals','Charm Animal','Delay Poison','Detect Animals or Plants','Detect Poison','Detect Snares and Pits','Endure Elements','Entangle','Hide from Animals','Jump','Longstrider','Magic Fang','Pass without Trace','Read Magic','Resist Energy','Speak with Animals','Summon Nature\'s Ally I','Wind Wall'],
    level2: ['Barkskin','Bear\'s Endurance','Cat\'s Grace','Cure Light Wounds','Hold Animal','Owl\'s Wisdom','Protection from Energy','Snare','Speak with Plants','Spike Growth','Summon Nature\'s Ally II','Wind Wall'],
    level3: ['Command Plants','Cure Moderate Wounds','Darkvision','Diminish Plants','Greater Magic Fang','Neutralize Poison','Plant Growth','Reduce Animal','Remove Disease','Repel Vermin','Summon Nature\'s Ally III','Tree Shape','Water Walk'],
    level4: ['Animal Growth','Commune with Nature','Cure Serious Wounds','Freedom of Movement','Nondetection','Summon Nature\'s Ally IV','Tree Stride']
  }
};

// ── SPELL DESCRIPTIONS (3.5e) ──
DND35_DATA.spellDescriptions = {
  'Magic Missile':    {school:'Evocation',castTime:'1 standard action',range:'Medium',duration:'Instantaneous',desc:'1d4+1 force damage per missile, 1 missile + 1 per 2 caster levels (max 5). Always hits.'},
  'Sleep':            {school:'Enchantment',castTime:'1 round',range:'Medium',duration:'1 min/level',desc:'Puts 4 HD of creatures into magical sleep. Lowest HD first.'},
  'Charm Person':     {school:'Enchantment',castTime:'1 standard action',range:'Close',duration:'1 hour/level',desc:'Makes one humanoid your friend. Will save negates.'},
  'Mage Armor':       {school:'Conjuration',castTime:'1 standard action',range:'Touch',duration:'1 hour/level',desc:'+4 armor bonus to AC. No max DEX. No armor check penalty.'},
  'Shield':           {school:'Abjuration',castTime:'1 standard action',range:'Personal',duration:'1 min/level',desc:'+4 shield bonus to AC. Immune to magic missiles.'},
  'Burning Hands':    {school:'Evocation',castTime:'1 standard action',range:'15 ft cone',duration:'Instantaneous',desc:'1d4 fire damage per caster level (max 5d4). Reflex half.'},
  'Ray of Frost':     {school:'Evocation',castTime:'1 standard action',range:'Close',duration:'Instantaneous',desc:'Ray deals 1d3 cold damage.'},
  'Shocking Grasp':   {school:'Evocation',castTime:'1 standard action',range:'Touch',duration:'Instantaneous',desc:'Touch attack for 1d6 electricity/level (max 5d6). +3 to hit metal armor.'},
  'Cure Light Wounds':{school:'Conjuration',castTime:'1 standard action',range:'Touch',duration:'Instantaneous',desc:'Cures 1d8+1/level (max +5) hp damage.'},
  'Detect Magic':     {school:'Divination',castTime:'1 standard action',range:'60 ft cone',duration:'Concentration up to 1 min/level',desc:'Detect magical auras. Three rounds of concentration reveals school.'},
  'Bless':            {school:'Enchantment',castTime:'1 standard action',range:'50 ft burst',duration:'1 min/level',desc:'+1 morale bonus on attack rolls and saves vs. fear.'},
  'Divine Favor':     {school:'Evocation',castTime:'1 standard action',range:'Personal',duration:'1 minute',desc:'+1 luck bonus/3 levels (max +3) on attacks and damage.'},
  'Entangle':         {school:'Transmutation',castTime:'1 standard action',range:'Long',duration:'1 min/level',desc:'Plants in 40-ft radius grab and slow creatures. Reflex or entangled.'},
  'Color Spray':      {school:'Illusion',castTime:'1 standard action',range:'15 ft cone',duration:'Special',desc:'Knocks unconscious, blinds, or stuns creatures based on HD. Will negates.'},
  'Grease':           {school:'Conjuration',castTime:'1 standard action',range:'Close',duration:'1 round/level',desc:'Slippery grease on object or 10-ft square. Balance checks or fall.'},
  'Obscuring Mist':   {school:'Conjuration',castTime:'1 standard action',range:'20 ft radius',duration:'1 min/level',desc:'Dense mist, 20% miss chance, conceals.'},
  'Expeditious Retreat':{school:'Transmutation',castTime:'1 standard action',range:'Personal',duration:'1 min/level',desc:'Your speed doubles (to a maximum increase of +30 ft).'},
  'Feather Fall':     {school:'Transmutation',castTime:'1 free action',range:'Close',duration:'1 round/level',desc:'Objects or creatures fall slowly, 60 ft/round. No fall damage.'},
  'Reduce Person':    {school:'Transmutation',castTime:'1 round',range:'Close',duration:'1 min/level',desc:'Humanoid halves in size. -2 STR, +2 DEX, +1 AC, +1 attacks, -1 damage. Fort negates.'},
  'Enlarge Person':   {school:'Transmutation',castTime:'1 round',range:'Close',duration:'1 min/level',desc:'Humanoid doubles in size. +2 STR, -2 DEX, -1 AC, -1 attacks, +1 damage. Fort negates.'},
  'True Strike':      {school:'Divination',castTime:'1 standard action',range:'Personal',duration:'See text',desc:'+20 insight bonus on your next single attack roll. Ignore concealment miss.'},
  'Identify':         {school:'Divination',castTime:'1 hour',range:'Touch',duration:'Instantaneous',desc:'Determine magical properties of item. 85% + 1%/level success.'},
  'Alarm':            {school:'Abjuration',castTime:'1 standard action',range:'Close',duration:'2 hours/level',desc:'Wards an area against intrusion. Mental or audible alarm when triggered.'},
  'Comprehend Languages':{school:'Divination',castTime:'1 standard action',range:'Personal',duration:'10 min/level',desc:'Understand all spoken and written languages.'},
  'Cause Fear':       {school:'Necromancy',castTime:'1 standard action',range:'Close',duration:'1d4 rounds',desc:'One creature fleeing in panic. Will partial. Only affects creatures with 5 HD or fewer.'},
  'Sanctuary':        {school:'Abjuration',castTime:'1 standard action',range:'Touch',duration:'1 round/level',desc:'Opponents cannot attack the warded creature without Will save.'},
  'Protection from Evil':{school:'Abjuration',castTime:'1 standard action',range:'Touch',duration:'1 min/level',desc:'+2 AC and saves vs. evil. Block mind control. Extraplanar evil can\'t touch target.'},
  'Command':          {school:'Enchantment',castTime:'1 standard action',range:'Close',duration:'1 round',desc:'One creature obeys single-word command. Will negates.'},
  'Silent Image':     {school:'Illusion',castTime:'1 standard action',range:'Long',duration:'Concentration',desc:'Visual illusion up to 4 10-ft cubes. Will to disbelieve.'},
  'Summon Monster I': {school:'Conjuration',castTime:'1 round',range:'Close',duration:'1 round/level',desc:'Summon one creature from the 1st-level list to fight for you.'},
  'Ghost Sound':      {school:'Illusion',castTime:'1 standard action',range:'Close',duration:'1 round/level',desc:'Create illusory sounds, volume equal to 4 humans per level.'},
  'Light':            {school:'Evocation',castTime:'1 standard action',range:'Touch',duration:'10 min/level',desc:'Object shines like a torch, 20-ft bright, 20-ft shadowy.'},
  'Read Magic':       {school:'Divination',castTime:'1 standard action',range:'Personal',duration:'10 min/level',desc:'Read magical writing, including scrolls.'},
  'Resistance':       {school:'Abjuration',castTime:'1 standard action',range:'Touch',duration:'1 minute',desc:'+1 resistance bonus on saving throws.'},
  'Mage Hand':        {school:'Transmutation',castTime:'1 standard action',range:'Close',duration:'Concentration',desc:'5-pound telekinesis.'},
  'Prestidigitation': {school:'Universal',castTime:'1 standard action',range:'10 ft',duration:'1 hour',desc:'Minor tricks: soil, clean, chill, warm, flavor, color, mark.'},
  'Goodberry':        {school:'Transmutation',castTime:'1 standard action',range:'Touch',duration:'1 day/level',desc:'2d4 berries good for 1 day. Each heals 1 hp and acts as food.'},
  'Produce Flame':    {school:'Evocation',castTime:'1 standard action',range:'Personal',duration:'1 min/level',desc:'Flame in hand for light and 1d6+1/level fire melee/ranged (30 ft).'},
  'Jump':             {school:'Transmutation',castTime:'1 standard action',range:'Touch',duration:'1 min/level',desc:'+10/+20/+30 competence bonus on Jump checks.'},
  'Longstrider':      {school:'Transmutation',castTime:'1 standard action',range:'Personal',duration:'1 hour/level',desc:'Your speed increases by 10 ft.'},
  'Hide from Animals':{school:'Abjuration',castTime:'1 standard action',range:'Touch',duration:'10 min/level',desc:'Animals cannot sense you unless attacked first.'},
  'Pass without Trace':{school:'Transmutation',castTime:'1 standard action',range:'Touch',duration:'1 hour/level',desc:'One creature/level leaves no scent or tracks.'},
  'Speak with Animals':{school:'Divination',castTime:'1 standard action',range:'Personal',duration:'1 min/level',desc:'Communicate with natural animals.'},
  'Faerie Fire':      {school:'Evocation',castTime:'1 standard action',range:'Long',duration:'1 min/level',desc:'Outline creatures with pale light. +2 attacks vs. outlined. No hiding.'},
  'Charm Animal':     {school:'Enchantment',castTime:'1 standard action',range:'Close',duration:'1 hour/level',desc:'Makes one animal your ally. Will negates.'},
  'Cure Minor Wounds':{school:'Conjuration',castTime:'1 standard action',range:'Touch',duration:'Instantaneous',desc:'Cures 1 point of damage.'},
  'Bless Water':      {school:'Transmutation',castTime:'1 minute',range:'Touch',duration:'Instantaneous',desc:'Makes vial of water into holy water.'},
  'Detect Poison':    {school:'Divination',castTime:'1 standard action',range:'Close',duration:'Instantaneous',desc:'Detect poison in one creature or small area.'},
  'Endure Elements':  {school:'Abjuration',castTime:'1 standard action',range:'Touch',duration:'24 hours',desc:'Ignore -50° to 140°F temperature effects.'},
  'Magic Weapon':     {school:'Transmutation',castTime:'1 standard action',range:'Touch',duration:'1 min/level',desc:'+1 enhancement bonus on attack and damage rolls.'},
  'Magic Fang':       {school:'Transmutation',castTime:'1 standard action',range:'Touch',duration:'1 min/level',desc:'One natural weapon of subject creature gets +1 on attack and damage.'},
  'Shillelagh':       {school:'Transmutation',castTime:'1 standard action',range:'Touch',duration:'1 min/level',desc:'Quarterstaff or club deals 2d6 damage as if Large. +1 attack.'},
  'Know Direction':   {school:'Divination',castTime:'1 standard action',range:'Personal',duration:'Instantaneous',desc:'You instantly know which way is north.'},
  // Level 2
  'Scorching Ray':   {school:'Evocation',castTime:'1 standard action',range:'Close',duration:'Instantaneous',desc:'Ranged touch attack, 4d6 fire. One ray +1 per 4 levels (max 3).'},
  'Invisibility':    {school:'Illusion',castTime:'1 standard action',range:'Touch',duration:'1 min/level',desc:'Subject is invisible until it attacks.'},
  'Mirror Image':    {school:'Illusion',castTime:'1 standard action',range:'Personal',duration:'1 min/level',desc:'Creates 1d4+1 (max 8) decoy duplicates of you.'},
  'Web':             {school:'Conjuration',castTime:'1 standard action',range:'Medium',duration:'10 min/level',desc:'Fills 20-ft-radius spread with sticky webs. Reflex or entangled.'},
  'Bull\'s Strength':{school:'Transmutation',castTime:'1 standard action',range:'Touch',duration:'1 min/level',desc:'+4 enhancement bonus to Strength.'},
  'Bear\'s Endurance':{school:'Transmutation',castTime:'1 standard action',range:'Touch',duration:'1 min/level',desc:'+4 enhancement bonus to Constitution.'},
  'Cat\'s Grace':    {school:'Transmutation',castTime:'1 standard action',range:'Touch',duration:'1 min/level',desc:'+4 enhancement bonus to Dexterity.'},
  'Glitterdust':     {school:'Conjuration',castTime:'1 standard action',range:'Medium',duration:'1 round/level',desc:'Blinds creatures, outlines invisible creatures. Will negates blindness.'},
  'Darkvision':      {school:'Transmutation',castTime:'1 standard action',range:'Touch',duration:'1 hour/level',desc:'See 60 ft in total darkness.'},
  'Levitate':        {school:'Transmutation',castTime:'1 standard action',range:'Close',duration:'1 min/level',desc:'Subject moves up and down at your direction. 20 ft/round.'},
  'Resist Energy':   {school:'Abjuration',castTime:'1 standard action',range:'Touch',duration:'10 min/level',desc:'Ignores first 10 damage of chosen energy type per attack.'},
  'Spiritual Weapon':{school:'Evocation',castTime:'1 standard action',range:'Medium',duration:'1 round/level',desc:'Magic weapon attacks on its own. +BAB+WIS mod, 1d8+1/3 levels.'},
  'Silence':         {school:'Illusion',castTime:'1 round',range:'Long',duration:'1 round/level',desc:'Negates sound in 20-ft radius. No verbal spells inside.'},
  'Barkskin':        {school:'Transmutation',castTime:'1 standard action',range:'Touch',duration:'10 min/level',desc:'+2 enhancement bonus to natural armor (+1/3 levels, max +5).'},
  'Cure Moderate Wounds':{school:'Conjuration',castTime:'1 standard action',range:'Touch',duration:'Instantaneous',desc:'Cures 2d8+1/level (max +10) hp damage.'},
  // Level 3
  'Fireball':        {school:'Evocation',castTime:'1 standard action',range:'Long',duration:'Instantaneous',desc:'1d6 fire/level (max 10d6) in 20-ft radius. Reflex half.'},
  'Lightning Bolt':  {school:'Evocation',castTime:'1 standard action',range:'120 ft line',duration:'Instantaneous',desc:'1d6 electricity/level (max 10d6) in a line. Reflex half.'},
  'Fly':             {school:'Transmutation',castTime:'1 standard action',range:'Touch',duration:'1 min/level',desc:'Subject flies at speed 60 ft (good maneuverability).'},
  'Haste':           {school:'Transmutation',castTime:'1 standard action',range:'Close',duration:'1 round/level',desc:'+1 attack, +1 AC, +1 Reflex, +30 ft speed. One creature/level.'},
  'Slow':            {school:'Transmutation',castTime:'1 standard action',range:'Close',duration:'1 round/level',desc:'One creature/level takes only one action, -1 AC, -1 attacks, -1 Reflex. Will negates.'},
  'Dispel Magic':    {school:'Abjuration',castTime:'1 standard action',range:'Medium',duration:'Instantaneous',desc:'Cancels magical spells and effects. d20+caster level vs 11+caster level of each spell.'},
  'Hold Person':     {school:'Enchantment',castTime:'1 standard action',range:'Medium',duration:'1 round/level',desc:'Paralyzes one humanoid. Will negates. New save each round.'},
  'Displacement':    {school:'Illusion',castTime:'1 standard action',range:'Touch',duration:'1 round/level',desc:'50% miss chance against attacks on subject.'},
  'Protection from Energy':{school:'Abjuration',castTime:'1 standard action',range:'Touch',duration:'10 min/level',desc:'Absorbs 12 damage/level of chosen energy type (max 120).'},
  'Cure Serious Wounds':{school:'Conjuration',castTime:'1 standard action',range:'Touch',duration:'Instantaneous',desc:'Cures 3d8+1/level (max +15) hp damage.'},
  'Call Lightning':  {school:'Evocation',castTime:'1 round',range:'Medium',duration:'1 min/level',desc:'Calls down 3d6 lightning bolts (5d6 outdoors in storm) each round.'},
  'Searing Light':   {school:'Evocation',castTime:'1 standard action',range:'Medium',duration:'Instantaneous',desc:'Ray deals 1d8/2 levels (max 5d8). Extra vs undead.'},
  // Level 4
  'Dimension Door':  {school:'Conjuration',castTime:'1 standard action',range:'Long',duration:'Instantaneous',desc:'Teleport short distance (400 ft + 40 ft/level).'},
  'Stoneskin':       {school:'Abjuration',castTime:'1 standard action',range:'Touch',duration:'10 min/level',desc:'DR 10/adamantine, absorbs 10 damage/level (max 150).'},
  'Polymorph':       {school:'Transmutation',castTime:'1 standard action',range:'Touch',duration:'1 min/level',desc:'Assume the form of any creature of your size or smaller.'},
  'Greater Invisibility':{school:'Illusion',castTime:'1 standard action',range:'Touch',duration:'1 round/level',desc:'As invisibility, but subject can attack and stay invisible.'},
  'Ice Storm':       {school:'Evocation',castTime:'1 standard action',range:'Long',duration:'1 round',desc:'3d6 bludgeoning + 2d6 cold in 40-ft cylinder. No save.'},
  'Fear':            {school:'Necromancy',castTime:'1 standard action',range:'30 ft cone',duration:'1 round/level',desc:'All in cone panicked for 1 round/level. Will save partial (shaken 1 round).'},
  'Wall of Fire':    {school:'Evocation',castTime:'1 standard action',range:'Medium',duration:'Concentration + 1 round/level',desc:'Deals 2d4 fire to creatures within 10 ft, 1d4 within 20 ft. 2d6+1/level to pass through.'},
  'Cure Critical Wounds':{school:'Conjuration',castTime:'1 standard action',range:'Touch',duration:'Instantaneous',desc:'Cures 4d8+1/level (max +20) hp damage.'},
  'Divine Power':    {school:'Evocation',castTime:'1 standard action',range:'Personal',duration:'1 round/level',desc:'You gain BAB equal to your level, +6 STR, and 1 temporary hp/level.'},
  'Freedom of Movement':{school:'Abjuration',castTime:'1 standard action',range:'Touch',duration:'10 min/level',desc:'Subject moves normally despite impediments. Cannot be grappled.'},
  'Flame Strike':    {school:'Evocation',castTime:'1 standard action',range:'Medium',duration:'Instantaneous',desc:'10-ft radius column, 1d6/level fire+divine (max 15d6). Reflex half.'},
  // Level 5
  'Teleport':        {school:'Conjuration',castTime:'1 standard action',range:'Touch',duration:'Instantaneous',desc:'Instantly transports you and touched objects/creatures to any known location.'},
  'Cone of Cold':    {school:'Evocation',castTime:'1 standard action',range:'60 ft cone',duration:'Instantaneous',desc:'1d6 cold/level (max 15d6). Reflex half.'},
  'Wall of Force':   {school:'Evocation',castTime:'1 standard action',range:'Close',duration:'1 round/level',desc:'Invisible wall of force, immune to damage. 10 ft square/level.'},
  'Cloudkill':       {school:'Conjuration',castTime:'1 standard action',range:'Medium',duration:'1 min/level',desc:'Kills creatures of 3 HD or less; 4-6 HD Fort save or die; 6+ HD 1d4 CON/round.'},
  'Dominate Person': {school:'Enchantment',castTime:'1 round',range:'Close',duration:'1 day/level',desc:'Control humanoid telepathically. Will negates. New save if ordered self-destructive.'},
  'Hold Monster':    {school:'Enchantment',castTime:'1 standard action',range:'Medium',duration:'1 round/level',desc:'As hold person but any creature. Will negates.'},
  'Raise Dead':      {school:'Conjuration',castTime:'1 minute',range:'Touch',duration:'Instantaneous',desc:'Restores life to deceased creature. -1 level, must have been dead less than 1 day/level.'},
  'Break Enchantment':{school:'Abjuration',castTime:'1 minute',range:'Close',duration:'Instantaneous',desc:'Frees creatures from enchantments, curses, transmutations, and petrification.'},
  // Level 6
  'Chain Lightning': {school:'Evocation',castTime:'1 standard action',range:'Long',duration:'Instantaneous',desc:'1d6/level to primary target, then arcs to secondary targets at half damage.'},
  'Disintegrate':    {school:'Transmutation',castTime:'1 standard action',range:'Medium',duration:'Instantaneous',desc:'Ranged touch, 2d6/level (max 40d6). Fort save for 5d6 instead.'},
  'Greater Dispel Magic':{school:'Abjuration',castTime:'1 standard action',range:'Medium',duration:'Instantaneous',desc:'As dispel magic, but +20 max on caster level check.'},
  'Heal':            {school:'Conjuration',castTime:'1 standard action',range:'Touch',duration:'Instantaneous',desc:'Cures 10 points/level damage and all conditions.'},
  'Blade Barrier':   {school:'Evocation',castTime:'1 standard action',range:'Medium',duration:'1 min/level',desc:'Wall of whirling blades deals 1d6/level. Reflex half to pass through.'},
  'True Seeing':     {school:'Divination',castTime:'1 standard action',range:'Touch',duration:'1 min/level',desc:'See all things as they actually are. Penetrates illusions, darkness, polymorph.'},
  // Level 7
  'Finger of Death': {school:'Necromancy',castTime:'1 standard action',range:'Close',duration:'Instantaneous',desc:'Kills one creature. Fort save for 3d6+1/level damage instead.'},
  'Greater Teleport': {school:'Conjuration',castTime:'1 standard action',range:'Touch',duration:'Instantaneous',desc:'As teleport, but no range limit and no chance of error.'},
  'Prismatic Spray': {school:'Evocation',castTime:'1 standard action',range:'60 ft cone',duration:'Instantaneous',desc:'Rays of seven colors with random devastating effects.'},
  'Delayed Blast Fireball':{school:'Evocation',castTime:'1 standard action',range:'Long',duration:'5 rounds or less',desc:'1d6 fire/level (max 20d6) in 20-ft radius. Can delay up to 5 rounds.'},
  'Resurrection':    {school:'Conjuration',castTime:'10 minutes',range:'Touch',duration:'Instantaneous',desc:'Fully restore dead creature. No level loss. Body not required.'},
  'Regenerate':      {school:'Conjuration',castTime:'3 rounds',range:'Touch',duration:'Instantaneous',desc:'Regrows limbs and organs, heals 4d8+1/level (max +35).'},
  // Level 8
  'Horrid Wilting':  {school:'Necromancy',castTime:'1 standard action',range:'Long',duration:'Instantaneous',desc:'1d6/level necrotic (max 20d6) to living creatures in 30-ft radius. Fort half.'},
  'Mind Blank':      {school:'Abjuration',castTime:'1 standard action',range:'Close',duration:'24 hours',desc:'Subject immune to all mind-affecting spells and divinations.'},
  'Prismatic Wall':  {school:'Abjuration',castTime:'1 standard action',range:'Close',duration:'10 min/level',desc:'Wall of seven-layered colors, each with different devastating effect.'},
  'Polar Ray':       {school:'Evocation',castTime:'1 standard action',range:'Close',duration:'Instantaneous',desc:'Ranged touch, 1d6/level (max 25d6) cold damage. No save.'},
  'Power Word Stun': {school:'Enchantment',castTime:'1 standard action',range:'Close',duration:'See text',desc:'Stuns creature with 150 hp or less. No save.'},
  // Level 9
  'Wish':            {school:'Universal',castTime:'1 standard action',range:'See text',duration:'See text',desc:'Most powerful spell. Duplicates any 8th-level or lower spell, or reshape reality.'},
  'Time Stop':       {school:'Transmutation',castTime:'1 standard action',range:'Personal',duration:'1d4+1 rounds (apparent)',desc:'You act freely for 1d4+1 rounds while time freezes for everyone else.'},
  'Meteor Swarm':    {school:'Evocation',castTime:'1 standard action',range:'Long',duration:'Instantaneous',desc:'Four meteors, each 6d6 fire in 40-ft radius. 24d6 total. Reflex half.'},
  'Power Word Kill': {school:'Enchantment',castTime:'1 standard action',range:'Close',duration:'Instantaneous',desc:'Kills one creature with 100 hp or less. No save.'},
  'Gate':            {school:'Conjuration',castTime:'1 standard action',range:'Medium',duration:'Instantaneous or concentration',desc:'Opens portal to another plane, or calls a specific extraplanar being.'},
  'Miracle':         {school:'Evocation',castTime:'1 standard action',range:'See text',duration:'See text',desc:'Divine equivalent of wish. Requests answered by deity.'},
  'Implosion':       {school:'Evocation',castTime:'1 standard action',range:'Close',duration:'Concentration (up to 4 rounds)',desc:'Kills one creature/round. Fort negates each round.'},
  'Storm of Vengeance':{school:'Conjuration',castTime:'1 round',range:'Long',duration:'Concentration (max 10 rounds)',desc:'Massive storm: acid rain, lightning, hail. Different effects each round.'},
  'Shapechange':     {school:'Transmutation',castTime:'1 standard action',range:'Personal',duration:'10 min/level',desc:'Take any creature form freely, changing as a free action each round.'},
  'Foresight':       {school:'Divination',castTime:'1 standard action',range:'Touch',duration:'10 min/level',desc:'Sixth sense warns of danger. Never surprised or flat-footed. +2 AC and Reflex.'}
};

// ── EQUIPMENT CHOICES HELPER ──
DND35_DATA.weaponCategories = {
  'Any martial weapon':       'See Weapons',
  'Any simple weapon':        'See Weapons',
  'Any martial melee weapon': 'See Weapons',
};

DND35_DATA.weapons = {
  simple_melee:[
    {name:'Club',        damage:'1d6', type:'B', crit:'×2',   range:'10 ft'},
    {name:'Dagger',      damage:'1d4', type:'P/S',crit:'19-20/×2',range:'10 ft'},
    {name:'Quarterstaff',damage:'1d6/1d6',type:'B',crit:'×2', range:'—'},
    {name:'Shortspear',  damage:'1d6', type:'P',  crit:'×2',  range:'20 ft'},
    {name:'Spear',       damage:'1d8', type:'P',  crit:'×3',  range:'20 ft'},
    {name:'Light Mace',  damage:'1d6', type:'B',  crit:'×2',  range:'—'},
    {name:'Heavy Mace',  damage:'1d8', type:'B',  crit:'×2',  range:'—'},
    {name:'Sickle',      damage:'1d6', type:'S',  crit:'×2',  range:'—'},
    {name:'Handaxe',     damage:'1d6', type:'S',  crit:'×3',  range:'—'},
    {name:'Light Hammer',damage:'1d4', type:'B',  crit:'×2',  range:'20 ft'},
    {name:'Morningstar', damage:'1d8', type:'B/P',crit:'×2',  range:'—'},
  ],
  simple_ranged:[
    {name:'Heavy Crossbow',damage:'1d10',type:'P',crit:'19-20/×2',range:'120 ft'},
    {name:'Light Crossbow',damage:'1d8', type:'P',crit:'19-20/×2',range:'80 ft'},
    {name:'Dart',          damage:'1d4', type:'P',crit:'×2',       range:'20 ft'},
    {name:'Sling',         damage:'1d4', type:'B',crit:'×2',       range:'50 ft'},
    {name:'Javelin',       damage:'1d6', type:'P',crit:'×2',       range:'30 ft'},
  ],
  martial_melee:[
    {name:'Longsword',   damage:'1d8',  type:'S',   crit:'19-20/×2',range:'—'},
    {name:'Shortsword',  damage:'1d6',  type:'P',   crit:'19-20/×2',range:'—'},
    {name:'Rapier',      damage:'1d6',  type:'P',   crit:'18-20/×2',range:'—'},
    {name:'Greataxe',    damage:'1d12', type:'S',   crit:'×3',      range:'—'},
    {name:'Greatsword',  damage:'2d6',  type:'S',   crit:'19-20/×2',range:'—'},
    {name:'Battleaxe',   damage:'1d8',  type:'S',   crit:'×3',      range:'—'},
    {name:'Flail',       damage:'1d8',  type:'B',   crit:'×2',      range:'—'},
    {name:'Halberd',     damage:'1d10', type:'P/S', crit:'×3',      range:'—'},
    {name:'Lance',       damage:'1d8',  type:'P',   crit:'×3',      range:'—'},
    {name:'Scimitar',    damage:'1d6',  type:'S',   crit:'18-20/×2',range:'—'},
    {name:'Warhammer',   damage:'1d8',  type:'B',   crit:'×3',      range:'—'},
    {name:'Falchion',    damage:'2d4',  type:'S',   crit:'18-20/×2',range:'—'},
    {name:'Short Sword', damage:'1d6',  type:'P',   crit:'19-20/×2',range:'—'},
    {name:'Trident',     damage:'1d8',  type:'P',   crit:'×2',      range:'10 ft'},
  ],
  martial_ranged:[
    {name:'Longbow',     damage:'1d8',  type:'P', crit:'×3',       range:'100 ft'},
    {name:'Shortbow',    damage:'1d6',  type:'P', crit:'×3',       range:'60 ft'},
    {name:'Composite Longbow',damage:'1d8',type:'P',crit:'×3',     range:'110 ft'},
    {name:'Composite Shortbow',damage:'1d6',type:'P',crit:'×3',    range:'70 ft'},
    {name:'Hand Crossbow',damage:'1d4', type:'P', crit:'19-20/×2', range:'30 ft'},
  ]
};

// ── ARMOR ──
DND35_DATA.armor = {
  'Padded':             {bonus:1, maxDex:8,  penalty:0,  spellFail:5,  speed30:30, speed20:20},
  'Leather':            {bonus:2, maxDex:6,  penalty:0,  spellFail:10, speed30:30, speed20:20},
  'Studded leather':    {bonus:3, maxDex:5,  penalty:-1, spellFail:15, speed30:30, speed20:20},
  'Chain shirt':        {bonus:4, maxDex:4,  penalty:-2, spellFail:20, speed30:30, speed20:20},
  'Hide':               {bonus:3, maxDex:4,  penalty:-3, spellFail:20, speed30:20, speed20:15},
  'Scale mail':         {bonus:4, maxDex:3,  penalty:-4, spellFail:25, speed30:20, speed20:15},
  'Chainmail':          {bonus:5, maxDex:2,  penalty:-5, spellFail:30, speed30:20, speed20:15},
  'Breastplate':        {bonus:5, maxDex:3,  penalty:-4, spellFail:25, speed30:20, speed20:15},
  'Splint mail':        {bonus:6, maxDex:0,  penalty:-7, spellFail:40, speed30:20, speed20:15},
  'Banded mail':        {bonus:6, maxDex:1,  penalty:-6, spellFail:35, speed30:20, speed20:15},
  'Half-plate':         {bonus:7, maxDex:0,  penalty:-7, spellFail:40, speed30:20, speed20:15},
  'Full plate':         {bonus:8, maxDex:1,  penalty:-6, spellFail:35, speed30:20, speed20:15},
  'Light wooden shield':{bonus:1, maxDex:99, penalty:-1, spellFail:5,  speed30:30, speed20:20, isShield:true},
  'Light steel shield': {bonus:1, maxDex:99, penalty:-1, spellFail:5,  speed30:30, speed20:20, isShield:true},
  'Heavy wooden shield':{bonus:2, maxDex:99, penalty:-2, spellFail:15, speed30:30, speed20:20, isShield:true},
  'Heavy steel shield': {bonus:2, maxDex:99, penalty:-2, spellFail:15, speed30:30, speed20:20, isShield:true},
  'Tower shield':       {bonus:4, maxDex:2,  penalty:-10,spellFail:50, speed30:20, speed20:15, isShield:true},
};

// ── ABILITY USE TRACKING ──
DND35_DATA.abilityUses = {
  barbarian:[{name:'Rage',uses:1,recharge:'day',desc:'Enter a fearsome rage once per day (+1 at 4th, 8th, etc.). +4 STR, +4 CON, +2 Will, -2 AC. Lasts CON mod +3 rounds.'}],
  bard:[{name:'Bardic Music',uses:'perform_ranks',recharge:'day',desc:'Use bardic music abilities (Inspire Courage, Fascinate, etc.) per day equal to Perform skill ranks.'}],
  cleric:[{name:'Turn Undead',uses:'3_plus_cha',recharge:'day',desc:'Turn (or rebuke) undead. 3 + CHA modifier uses per day.'}],
  druid:[{name:'Wild Shape',uses:1,recharge:'day',isDaily:true,desc:'(4th level+) Transform into an animal. 1/day at 4th level.'}],
  fighter:[],
  monk:[{name:'Stunning Fist',uses:'level',recharge:'day',desc:'Force a Fortitude save (DC 10 + half level + WIS mod) or target is stunned 1 round.'}],
  paladin:[
    {name:'Smite Evil',uses:'cha_mod_min1',recharge:'day',desc:'+CHA mod on attack, +paladin level on damage vs. evil. 1 use/day.'},
    {name:'Lay on Hands',uses:'pool',recharge:'day',isPool:true,desc:'Heal hp equal to paladin level × CHA mod per day.'},
    {name:'Turn Undead',uses:'3_plus_cha',recharge:'day',desc:'Turn undead as a cleric of your level -2.'}
  ],
  ranger:[],
  rogue:[],
  sorcerer:[],
  wizard:[]
};

// ── XP TABLE (3.5e Standard) ──
DND35_DATA.xpTable = {
  2:1000, 3:3000, 4:6000, 5:10000, 6:15000, 7:21000, 8:28000, 9:36000, 10:45000,
  11:55000, 12:66000, 13:78000, 14:91000, 15:105000, 16:120000, 17:136000,
  18:153000, 19:171000, 20:190000
};

// ── FEAT LEVELS ──
DND35_DATA.featLevels = [1, 3, 6, 9, 12, 15, 18];
DND35_DATA.fighterBonusFeatLevels = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

// ── MONK UNARMED DAMAGE PROGRESSION ──
DND35_DATA.monkUnarmedDamage = {
  1:'1d6', 4:'1d8', 8:'1d10', 12:'2d6', 16:'2d8', 20:'2d10'
};

// ── MONK SPEED BONUS PROGRESSION ──
DND35_DATA.monkSpeed = {
  1:0, 3:10, 6:20, 9:30, 12:40, 15:50, 18:60
};

// ── SPELLS PER DAY TABLES ──
DND35_DATA.spellsPerDay = {
  wizard: {
    0: [3,4,4,4,5,5,5,5,5,6,6,6,6,6,6,6,7,7,7,8],
    1: [1,2,3,3,3,4,4,4,4,4,5,5,5,5,5,6,6,6,6,6],
    2: [null,null,1,2,3,3,3,4,4,4,4,5,5,5,5,5,6,6,6,6],
    3: [null,null,null,1,2,3,3,3,4,4,4,4,5,5,5,5,5,6,6,6],
    4: [null,null,null,null,1,2,3,3,3,4,4,4,4,5,5,5,5,5,6,6],
    5: [null,null,null,null,null,1,2,3,3,3,4,4,4,4,5,5,5,5,5,6],
    6: [null,null,null,null,null,null,1,2,3,3,3,4,4,4,4,5,5,5,5,5],
    7: [null,null,null,null,null,null,null,1,2,3,3,3,4,4,4,4,5,5,5,5],
    8: [null,null,null,null,null,null,null,null,1,2,3,3,3,4,4,4,4,5,5,5],
    9: [null,null,null,null,null,null,null,null,null,1,2,3,3,3,4,4,4,4,5,5]
  },
  cleric: {
    0: [3,4,4,4,5,5,5,5,5,6,6,6,6,6,6,6,7,7,7,8],
    1: [1,2,2,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8],
    2: [null,null,1,2,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8],
    3: [null,null,null,1,2,2,3,4,4,4,5,5,5,6,6,6,7,7,7,8],
    4: [null,null,null,null,1,2,2,3,3,4,4,4,5,5,5,6,6,6,7,7],
    5: [null,null,null,null,null,1,2,2,3,3,3,4,4,4,5,5,5,6,6,6],
    6: [null,null,null,null,null,null,1,2,2,3,3,3,4,4,4,5,5,5,6,6],
    7: [null,null,null,null,null,null,null,1,2,2,3,3,3,4,4,4,5,5,5,6],
    8: [null,null,null,null,null,null,null,null,1,2,2,3,3,3,4,4,4,5,5,5],
    9: [null,null,null,null,null,null,null,null,null,1,2,2,3,3,3,4,4,4,5,5]
  },
  druid: {
    0: [3,4,4,4,5,5,5,5,5,6,6,6,6,6,6,6,7,7,7,8],
    1: [1,2,2,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8],
    2: [null,null,1,2,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8],
    3: [null,null,null,1,2,2,3,4,4,4,5,5,5,6,6,6,7,7,7,8],
    4: [null,null,null,null,1,2,2,3,3,4,4,4,5,5,5,6,6,6,7,7],
    5: [null,null,null,null,null,1,2,2,3,3,3,4,4,4,5,5,5,6,6,6],
    6: [null,null,null,null,null,null,1,2,2,3,3,3,4,4,4,5,5,5,6,6],
    7: [null,null,null,null,null,null,null,1,2,2,3,3,3,4,4,4,5,5,5,6],
    8: [null,null,null,null,null,null,null,null,1,2,2,3,3,3,4,4,4,5,5,5],
    9: [null,null,null,null,null,null,null,null,null,1,2,2,3,3,3,4,4,4,5,5]
  },
  bard: {
    0: [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
    1: [1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3],
    2: [null,null,null,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3],
    3: [null,null,null,null,null,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3],
    4: [null,null,null,null,null,null,null,1,1,1,1,1,1,2,2,2,2,2,2,3],
    5: [null,null,null,null,null,null,null,null,null,1,1,1,1,1,1,1,2,2,2,2],
    6: [null,null,null,null,null,null,null,null,null,null,null,1,1,1,1,1,1,2,2,2]
  },
  sorcerer: {
    0: [5,5,5,5,5,6,6,6,6,6,7,7,7,7,7,8,8,8,8,9],
    1: [3,4,4,5,5,5,5,6,6,6,6,6,6,7,7,7,7,8,8,8],
    2: [null,null,2,3,3,4,4,4,5,5,5,5,6,6,6,6,7,7,7,8],
    3: [null,null,null,null,1,2,2,3,3,4,4,4,4,5,5,5,6,6,6,7],
    4: [null,null,null,null,null,null,1,2,2,2,3,3,4,4,4,5,5,5,6,6],
    5: [null,null,null,null,null,null,null,null,1,1,2,2,2,3,3,4,4,4,5,5],
    6: [null,null,null,null,null,null,null,null,null,null,null,1,1,2,2,2,3,3,4,4]
  },
  paladin: {
    1: [null,null,null,1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3],
    2: [null,null,null,null,null,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3],
    3: [null,null,null,null,null,null,null,1,1,1,1,1,1,2,2,2,2,2,2,3],
    4: [null,null,null,null,null,null,null,null,null,1,1,1,1,1,1,2,2,2,2,3]
  },
  ranger: {
    1: [null,null,null,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,3],
    2: [null,null,null,null,null,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3],
    3: [null,null,null,null,null,null,null,null,1,1,1,1,1,1,2,2,2,2,2,3]
  }
};

// ── CLASS FEATURES BY LEVEL ──
DND35_DATA.classFeaturesByLevel = {
  barbarian: {
    1: ['Fast Movement +10 ft', 'Rage 1/day', 'Illiteracy'],
    2: ['Uncanny Dodge'],
    3: ['Trap Sense +1', 'Rage 2/day'],
    5: ['Improved Uncanny Dodge'],
    6: ['Trap Sense +2', 'Rage 3/day'],
    7: ['Damage Reduction 1/-'],
    9: ['Trap Sense +3', 'Rage 4/day'],
    11: ['Damage Reduction 2/-'],
    12: ['Trap Sense +4', 'Rage 5/day'],
    13: ['Greater Rage', 'Damage Reduction 3/-'],
    14: ['Trap Sense +5'],
    15: ['Rage 6/day'],
    17: ['Damage Reduction 4/-'],
    18: ['Trap Sense +6'],
    19: ['Mighty Rage', 'Rage 7/day'],
    20: ['Damage Reduction 5/-']
  },
  bard: {
    1: ['Bardic Music', 'Bardic Knowledge', 'Countersong', 'Fascinate', 'Inspire Courage +1'],
    2: ['Evasion'],
    4: ['Inspire Courage +2'],
    6: ['Suggestion'],
    8: ['Inspire Courage +3'],
    10: ['Jack of All Trades'],
    12: ['Inspire Courage +4'],
    14: ['Inspire Greatness'],
    16: ['Inspire Courage +5'],
    18: ['Mass Suggestion'],
    20: ['Inspire Courage +6']
  },
  cleric: {
    1: ['Aura', 'Spontaneous Casting', 'Turn/Rebuke Undead', 'Domain Spells'],
    5: ['Bonus Feat'],
    6: ['Improved Turn/Rebuke Undead'],
    9: ['Bonus Feat'],
    12: ['Improved Turn/Rebuke Undead'],
    15: ['Bonus Feat'],
    18: ['Improved Turn/Rebuke Undead'],
    20: ['Improved Turn/Rebuke Undead']
  },
  druid: {
    1: ['Aura', 'Nature Sense', 'Wild Empathy', 'Woodland Stride'],
    2: ['Wild Shape 1/day (Small/Medium animals)'],
    3: ['Trackless Step'],
    4: ['Wild Shape 2/day'],
    5: ['Improved Wild Shape (Small/Medium only)'],
    6: ['Wild Shape 3/day'],
    8: ['Wild Shape 4/day (can use Large forms)'],
    9: ['Venom Immunity'],
    10: ['Wild Shape 5/day'],
    12: ['Wild Shape 6/day (can use Plant forms)'],
    15: ['Timeless Body', 'Wild Shape 7/day (can use Huge forms)'],
    16: ['Wild Shape 8/day (can use Elemental forms)'],
    18: ['Wild Shape 9/day', 'Thousand Faces'],
    20: ['Wild Shape 10/day']
  },
  fighter: {
    1: ['Bonus Feat'],
    2: ['Bonus Feat'],
    4: ['Bonus Feat'],
    6: ['Bonus Feat'],
    8: ['Bonus Feat'],
    10: ['Bonus Feat'],
    12: ['Bonus Feat'],
    14: ['Bonus Feat'],
    16: ['Bonus Feat'],
    18: ['Bonus Feat'],
    20: ['Bonus Feat']
  },
  monk: {
    1: ['Bonus Feat', 'Flurry of Blows', 'Unarmed Strike 1d6', 'Unarmored AC Bonus +0'],
    2: ['Bonus Feat'],
    3: ['Still Mind', 'Unarmored AC Bonus +1', 'Speed +10 ft'],
    4: ['Ki Strike (magic)', 'Slow Fall 20 ft', 'Unarmed Strike 1d8'],
    5: ['Purity of Body'],
    6: ['Bonus Feat', 'Speed +20 ft'],
    7: ['Wholeness of Body'],
    8: ['Unarmored AC Bonus +2', 'Unarmed Strike 1d10'],
    9: ['Improved Evasion', 'Speed +30 ft'],
    10: ['Ki Strike (lawful)'],
    11: ['Diamond Body'],
    12: ['Unarmored AC Bonus +3', 'Speed +40 ft', 'Unarmed Strike 2d6'],
    13: ['Diamond Soul'],
    14: ['Bonus Feat'],
    15: ['Quivering Palm', 'Speed +50 ft'],
    16: ['Unarmored AC Bonus +4', 'Ki Strike (adamantine)', 'Unarmed Strike 2d8'],
    17: ['Timeless Body'],
    18: ['Unarmored AC Bonus +5', 'Speed +60 ft'],
    19: ['Empty Body'],
    20: ['Perfect Self', 'Unarmed Strike 2d10']
  },
  paladin: {
    1: ['Aura of Good', 'Detect Evil', 'Smite Evil 1/day'],
    2: ['Divine Grace'],
    3: ['Aura of Courage', 'Smite Evil 2/day'],
    4: ['Turn Undead'],
    5: ['Special Mount', 'Smite Evil 3/day'],
    6: ['Remove Disease 1/week'],
    7: ['Smite Evil 4/day'],
    9: ['Remove Disease 2/week', 'Smite Evil 5/day'],
    11: ['Smite Evil 6/day'],
    12: ['Remove Disease 3/week'],
    13: ['Smite Evil 7/day'],
    15: ['Remove Disease 4/week'],
    17: ['Smite Evil 8/day'],
    18: ['Remove Disease 5/week'],
    19: ['Smite Evil 9/day'],
    20: ['Holy Champion']
  },
  ranger: {
    1: ['Favored Enemy', 'Track', 'Wild Empathy', 'Combat Style'],
    2: ['Bonus Feat'],
    3: ['Endurance'],
    4: ['Animal Companion', 'Spells'],
    5: ['Improved Combat Style'],
    6: ['Bonus Feat'],
    8: ['Combat Style Mastery'],
    10: ['Evasion', 'Bonus Feat'],
    12: ['Camouflage'],
    14: ['Bonus Feat'],
    15: ['Improved Evasion'],
    16: ['Camouflage (Hide in Plain Sight)'],
    18: ['Bonus Feat'],
    20: ['Bonus Feat']
  },
  rogue: {
    1: ['Sneak Attack +1d6', 'Trapfinding'],
    2: ['Evasion'],
    3: ['Sneak Attack +2d6'],
    4: ['Uncanny Dodge (lose DEX bonus)'],
    5: ['Sneak Attack +3d6'],
    6: ['Improved Uncanny Dodge'],
    7: ['Sneak Attack +4d6'],
    8: ['Improved Evasion'],
    9: ['Sneak Attack +5d6', 'Debilitating Strike'],
    10: ['Sneak Attack +6d6', 'Exploit Weakness'],
    11: ['Sneak Attack +7d6'],
    12: ['Improved Evasion (better)'],
    13: ['Sneak Attack +8d6', 'Master Striker'],
    14: ['Slippery Mind'],
    15: ['Sneak Attack +9d6'],
    16: ['Sneak Attack +10d6', 'Improved Invisibility'],
    17: ['Sneak Attack +11d6'],
    18: ['Improved Evasion (perfect)'],
    19: ['Sneak Attack +12d6', 'Death Attack'],
    20: ['Sneak Attack +13d6']
  },
  sorcerer: {
    1: ['Spellcasting', 'Summon Familiar'],
    3: ['Bonus Feat'],
    5: ['Bonus Feat'],
    7: ['Bonus Metamagic Feat'],
    9: ['Bonus Feat'],
    11: ['Bonus Metamagic Feat'],
    13: ['Bonus Feat'],
    15: ['Bonus Metamagic Feat'],
    17: ['Bonus Feat'],
    19: ['Bonus Metamagic Feat'],
    20: ['Bonus Feat']
  },
  wizard: {
    1: ['Spellcasting', 'Scribe Scroll', 'Summon Familiar', 'Bonus Feat'],
    5: ['Bonus Feat'],
    10: ['Bonus Feat'],
    15: ['Bonus Feat'],
    20: ['Bonus Feat']
  }
};

// ── BASE ATTACK BONUS PROGRESSION ──
DND35_DATA.babProgression = {
  1: {good:[1], medium:[0], poor:[0]},
  2: {good:[2], medium:[1], poor:[1]},
  3: {good:[3], medium:[2], poor:[1]},
  4: {good:[4], medium:[3], poor:[2]},
  5: {good:[5,0], medium:[3,0], poor:[2,0]},
  6: {good:[6,1], medium:[4,1], poor:[3]},
  7: {good:[7,2], medium:[5,0], poor:[3,0]},
  8: {good:[8,3], medium:[6,1], poor:[4,1]},
  9: {good:[9,4], medium:[6,1], poor:[4,1]},
  10: {good:[10,5], medium:[7,2], poor:[5]},
  11: {good:[11,6,1], medium:[8,3], poor:[5,0]},
  12: {good:[12,7,2], medium:[9,4], poor:[6,1]},
  13: {good:[13,8,3], medium:[9,4], poor:[6,1]},
  14: {good:[14,9,4], medium:[10,5], poor:[7,2]},
  15: {good:[15,10,5], medium:[11,6,1], poor:[7,2]},
  16: {good:[16,11,6,1], medium:[12,7,2], poor:[8,3]},
  17: {good:[17,12,7,2], medium:[12,7,2], poor:[8,3]},
  18: {good:[18,13,8,3], medium:[13,8,3], poor:[9,4]},
  19: {good:[19,14,9,4], medium:[14,9,4], poor:[9,4]},
  20: {good:[20,15,10,5], medium:[15,10,5], poor:[10,5]}
};

// ── SAVE BONUS PROGRESSION ──
DND35_DATA.saveProgression = {
  good: [2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6],
  poor: [0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4]
};

// ── TURNING UNDEAD (Cleric/Paladin) ──
DND35_DATA.turnUndead = {
  cleric: {
    usesPerDay: [3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7]
  },
  paladin: {
    usesPerDay: [0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4]
  }
};

// ── RAGE USES BY LEVEL ──
DND35_DATA.rageUses = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];

// ── WILD SHAPE USES BY LEVEL ──
DND35_DATA.wildShapeUses = [0,0,0,1,2,3,3,4,4,5,5,6,6,6,7,8,8,9,9,10];

// ── SMITE EVIL USES BY LEVEL ──
DND35_DATA.smiteEvilUses = [0,1,1,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10];

// ── SNEAK ATTACK PROGRESSION (Rogue) ──
DND35_DATA.sneakAttack = {
  dice: [1,1,2,2,3,3,4,4,5,6,7,7,8,8,9,10,11,11,12,13]
};

