const DND_DATA = {
races: {
  human: { name:"Human", asi:{str:1,dex:1,con:1,int:1,wis:1,cha:1}, speed:30, size:"Medium", languages:["Common"], extraLanguages:1, traits:[{name:"Extra Language",desc:"You can speak, read, and write one extra language of your choice."},{name:"Ability Score Increase",desc:"Your ability scores each increase by 1."}], subraces:[] },
  elf: { name:"Elf", asi:{dex:2}, speed:30, size:"Medium", languages:["Common","Elvish"], traits:[{name:"Darkvision",desc:"60 ft. darkvision."},{name:"Keen Senses",desc:"Proficiency in Perception."},{name:"Fey Ancestry",desc:"Advantage on saving throws against being charmed, and magic can't put you to sleep."},{name:"Trance",desc:"Elves don't need to sleep. You can finish a long rest in 4 hours."}],
    subraces:[
      {id:"high-elf", name:"High Elf", asi:{int:1}, extraLanguages:1, traits:[{name:"Cantrip",desc:"You know one wizard cantrip of your choice."},{name:"Extra Language",desc:"You can read, speak, and write one extra language."}]},
      {id:"wood-elf", name:"Wood Elf", asi:{wis:1}, speed:35, traits:[{name:"Fleet of Foot",desc:"Your base walking speed increases to 35 feet."},{name:"Mask of the Wild",desc:"You can attempt to hide even when only lightly obscured by natural phenomena."}]},
      {id:"dark-elf", name:"Dark Elf (Drow)", asi:{cha:1}, traits:[{name:"Superior Darkvision",desc:"120 ft. darkvision."},{name:"Sunlight Sensitivity",desc:"Disadvantage on attack rolls and Perception checks in direct sunlight."},{name:"Drow Magic",desc:"You know the Dancing Lights cantrip. At 3rd level, Faerie Fire. At 5th level, Darkness."}]}
    ]
  },
  dwarf: { name:"Dwarf", asi:{con:2}, speed:25, size:"Medium", languages:["Common","Dwarvish"], traits:[{name:"Darkvision",desc:"60 ft. darkvision."},{name:"Dwarven Resilience",desc:"Advantage on saving throws against poison, resistance against poison damage."},{name:"Stonecunning",desc:"Double proficiency bonus on History checks related to stonework."}],
    subraces:[
      {id:"hill-dwarf", name:"Hill Dwarf", asi:{wis:1}, traits:[{name:"Dwarven Toughness",desc:"Your HP maximum increases by 1 per level."}]},
      {id:"mountain-dwarf", name:"Mountain Dwarf", asi:{str:2}, traits:[{name:"Dwarven Armor Training",desc:"Proficiency with light armor, medium armor, and shields."}]}
    ]
  },
  halfling: { name:"Halfling", asi:{dex:2}, speed:25, size:"Small", languages:["Common","Halfling"], traits:[{name:"Lucky",desc:"When you roll a 1 on a d20, you can reroll and must use the new result."},{name:"Brave",desc:"Advantage on saving throws against being frightened."},{name:"Halfling Nimbleness",desc:"You can move through the space of any creature larger than you."}],
    subraces:[
      {id:"lightfoot", name:"Lightfoot", asi:{cha:1}, traits:[{name:"Naturally Stealthy",desc:"You can attempt to hide even when obscured only by a creature one size larger."}]},
      {id:"stout", name:"Stout", asi:{con:1}, traits:[{name:"Stout Resilience",desc:"Advantage on saving throws against poison, resistance against poison damage."}]}
    ]
  },
  gnome: { name:"Gnome", asi:{int:2}, speed:25, size:"Small", languages:["Common","Gnomish"], traits:[{name:"Darkvision",desc:"60 ft. darkvision."},{name:"Gnome Cunning",desc:"Advantage on all Intelligence, Wisdom, and Charisma saving throws against magic."}],
    subraces:[
      {id:"forest-gnome", name:"Forest Gnome", asi:{dex:1}, traits:[{name:"Natural Illusionist",desc:"You know the Minor Illusion cantrip."},{name:"Speak with Small Beasts",desc:"Through sounds and gestures, you can communicate with Small and Tiny beasts."}]},
      {id:"rock-gnome", name:"Rock Gnome", asi:{con:1}, traits:[{name:"Artificer's Lore",desc:"Double proficiency on History checks related to magic items, alchemical objects, or tech."},{name:"Tinker",desc:"You can spend 1 hour to construct a Tiny clockwork device."}]}
    ]
  },
  halfelf: { name:"Half-Elf", asi:{cha:2}, asiChoice:2, speed:30, size:"Medium", languages:["Common","Elvish"], extraLanguages:1, traits:[{name:"Darkvision",desc:"60 ft. darkvision."},{name:"Fey Ancestry",desc:"Advantage on saving throws against being charmed."},{name:"Skill Versatility",desc:"You gain proficiency in two skills of your choice."},{name:"Ability Score Increase",desc:"+2 Charisma, +1 to two ability scores of your choice."}], subraces:[] },
  halforc: { name:"Half-Orc", asi:{str:2,con:1}, speed:30, size:"Medium", languages:["Common","Orc"], traits:[{name:"Darkvision",desc:"60 ft. darkvision."},{name:"Menacing",desc:"Proficiency in Intimidation."},{name:"Relentless Endurance",desc:"When reduced to 0 HP but not killed, drop to 1 HP instead. Once per long rest."},{name:"Savage Attacks",desc:"On a critical hit with a melee weapon, add one extra damage die."}], subraces:[] },
  tiefling: { name:"Tiefling", asi:{int:1,cha:2}, speed:30, size:"Medium", languages:["Common","Infernal"], traits:[{name:"Darkvision",desc:"60 ft. darkvision."},{name:"Hellish Resistance",desc:"Resistance to fire damage."},{name:"Infernal Legacy",desc:"You know Thaumaturgy. At 3rd level, Hellish Rebuke. At 5th level, Darkness."}], subraces:[] },
  dragonborn: { name:"Dragonborn", asi:{str:2,cha:1}, speed:30, size:"Medium", languages:["Common","Draconic"], traits:[{name:"Breath Weapon",desc:"You can use your action to exhale destructive energy. Your draconic ancestry determines the size, shape, and damage type of the exhalation. Each creature in the area must make a saving throw (DC = 8 + your Constitution modifier + your proficiency bonus). A creature takes 2d6 damage on a failed save, and half as much on a success. The damage increases to 3d6 at 6th level, 4d6 at 11th level, and 5d6 at 16th level. You can use this once per short or long rest."},{name:"Damage Resistance",desc:"You have resistance to the damage type associated with your draconic ancestry."}],
    subraces:[
      {id:"black",  name:"Black Dragonborn",  asi:{}, traits:[{name:"Draconic Ancestry: Black",desc:"Damage Type: Acid. Breath Weapon: 5 by 30 ft. line (Dex. save). You have resistance to acid damage."}]},
      {id:"blue",   name:"Blue Dragonborn",   asi:{}, traits:[{name:"Draconic Ancestry: Blue",desc:"Damage Type: Lightning. Breath Weapon: 5 by 30 ft. line (Dex. save). You have resistance to lightning damage."}]},
      {id:"brass",  name:"Brass Dragonborn",  asi:{}, traits:[{name:"Draconic Ancestry: Brass",desc:"Damage Type: Fire. Breath Weapon: 5 by 30 ft. line (Dex. save). You have resistance to fire damage."}]},
      {id:"bronze", name:"Bronze Dragonborn", asi:{}, traits:[{name:"Draconic Ancestry: Bronze",desc:"Damage Type: Lightning. Breath Weapon: 5 by 30 ft. line (Dex. save). You have resistance to lightning damage."}]},
      {id:"copper", name:"Copper Dragonborn", asi:{}, traits:[{name:"Draconic Ancestry: Copper",desc:"Damage Type: Acid. Breath Weapon: 5 by 30 ft. line (Dex. save). You have resistance to acid damage."}]},
      {id:"gold",   name:"Gold Dragonborn",   asi:{}, traits:[{name:"Draconic Ancestry: Gold",desc:"Damage Type: Fire. Breath Weapon: 15 ft. cone (Dex. save). You have resistance to fire damage."}]},
      {id:"green",  name:"Green Dragonborn",  asi:{}, traits:[{name:"Draconic Ancestry: Green",desc:"Damage Type: Poison. Breath Weapon: 15 ft. cone (Con. save). You have resistance to poison damage."}]},
      {id:"red",    name:"Red Dragonborn",    asi:{}, traits:[{name:"Draconic Ancestry: Red",desc:"Damage Type: Fire. Breath Weapon: 15 ft. cone (Dex. save). You have resistance to fire damage."}]},
      {id:"silver", name:"Silver Dragonborn", asi:{}, traits:[{name:"Draconic Ancestry: Silver",desc:"Damage Type: Cold. Breath Weapon: 15 ft. cone (Con. save). You have resistance to cold damage."}]},
      {id:"white",  name:"White Dragonborn",  asi:{}, traits:[{name:"Draconic Ancestry: White",desc:"Damage Type: Cold. Breath Weapon: 15 ft. cone (Con. save). You have resistance to cold damage."}]}
    ]
  }
},

classes: {
  barbarian: { name:"Barbarian", hitDie:12, saves:["str","con"], primaryAbility:"str", armorProf:["Light armor","Medium armor","Shields"], weaponProf:["Simple weapons","Martial weapons"], skillCount:2, skillOptions:["Animal Handling","Athletics","Intimidation","Nature","Perception","Survival"],
    subclasses:["Berserker","Totem Warrior"],
    features:[{level:1,name:"Rage",desc:"Enter a rage as a bonus action. Advantage on Str checks/saves, bonus melee damage, resistance to bludgeoning/piercing/slashing."},{level:1,name:"Unarmored Defense",desc:"While not wearing armor, AC = 10 + DEX mod + CON mod."}],
    equipment:[["Greataxe","Any martial melee weapon"],["Two handaxes","Any simple weapon"],["Explorer's pack"]]
  },
  bard: { name:"Bard", hitDie:8, saves:["dex","cha"], primaryAbility:"cha", spellcastingAbility:"cha", armorProf:["Light armor"], weaponProf:["Simple weapons","Hand crossbows","Longswords","Rapiers","Shortswords"], skillCount:3, skillOptions:["Any three skills"],
    subclasses:["Lore","Valor"],
    features:[{level:1,name:"Spellcasting",desc:"Cha-based spellcasting. You know 2 cantrips and 4 spells. Spell slots start at 2 first-level slots."},{level:1,name:"Bardic Inspiration",desc:"Bonus action: grant a creature a d6 Bardic Inspiration die to add to one check/save/attack. Uses = CHA mod."}],
    equipment:[["Rapier","Longsword","Any simple weapon"],["Diplomat's pack","Entertainer's pack"],["Lute","Any musical instrument"],["Leather armor","Dagger"]]
  },
  cleric: { name:"Cleric", hitDie:8, saves:["wis","cha"], primaryAbility:"wis", spellcastingAbility:"wis", armorProf:["Light armor","Medium armor","Shields"], weaponProf:["Simple weapons"], skillCount:2, skillOptions:["History","Insight","Medicine","Persuasion","Religion"],
    features:[{level:1,name:"Spellcasting",desc:"Wis-based spellcasting. Prepare spells = Wis mod + Cleric level. Ritual Casting."},{level:1,name:"Divine Domain",desc:"Choose your domain — grants bonus spells and features from 1st level."}],
    subclasses:["Life","Light","Trickery","War","Nature","Tempest","Knowledge"],
    equipment:[["Mace","Warhammer"],["Scale mail","Leather armor","Chain mail"],["Light crossbow & 20 bolts","Any simple weapon"],["Priest's pack","Explorer's pack"],["Shield","Any simple weapon"]]
  },
  druid: { name:"Druid", hitDie:8, saves:["wis","int"], primaryAbility:"wis", spellcastingAbility:"wis", armorProf:["Light armor","Medium armor","Shields (nonmetal)"], weaponProf:["Clubs","Daggers","Darts","Javelins","Maces","Quarterstaffs","Scimitars","Sickles","Slings","Spears"], skillCount:2, skillOptions:["Arcana","Animal Handling","Insight","Medicine","Nature","Perception","Religion","Survival"],
    subclasses:["Land","Moon"],
    features:[{level:1,name:"Spellcasting",desc:"Wis-based spellcasting. Prepare spells = Wis mod + Druid level. Ritual Casting."},{level:1,name:"Druidic",desc:"You know Druidic, a secret language. You can speak it and leave hidden messages."}],
    equipment:[["Wooden shield","Any simple weapon"],["Scimitar","Any simple melee weapon"],["Leather armor","Explorer's pack","Druidic focus"]]
  },
  fighter: { name:"Fighter", hitDie:10, saves:["str","con"], primaryAbility:"str", armorProf:["All armor","Shields"], weaponProf:["Simple weapons","Martial weapons"], skillCount:2, skillOptions:["Acrobatics","Animal Handling","Athletics","History","Insight","Intimidation","Perception","Survival"],
    subclasses:["Champion","Battle Master","Eldritch Knight"],
    features:[{level:1,name:"Fighting Style",desc:"Choose a fighting style: Archery (+2 ranged attack rolls), Defense (+1 AC in armor), Dueling (+2 damage with one weapon), Great Weapon Fighting (reroll 1s and 2s on damage), Protection (impose disadvantage on attacks against allies), Two-Weapon Fighting (add ability mod to second attack)."},{level:1,name:"Second Wind",desc:"Bonus action: regain 1d10 + Fighter level HP. Recharges on short or long rest."}],
    equipment:[["Chain mail","Leather armor + longbow + 20 arrows"],["Martial weapon + shield","Two martial weapons"],["Light crossbow + 20 bolts","Two handaxes"],["Dungeoneer's pack","Explorer's pack"]]
  },
  monk: { name:"Monk", hitDie:8, saves:["str","dex"], primaryAbility:"dex", armorProf:[], weaponProf:["Simple weapons","Shortswords"], skillCount:2, skillOptions:["Acrobatics","Athletics","History","Insight","Religion","Stealth"],
    subclasses:["Open Hand","Shadow"],
    features:[{level:1,name:"Unarmored Defense",desc:"AC = 10 + DEX mod + WIS mod while not wearing armor or wielding a shield."},{level:1,name:"Martial Arts",desc:"Use DEX instead of STR for unarmed strikes and monk weapons. Unarmed strike = 1d4. Bonus action unarmed strike after attack."}],
    equipment:[["Shortsword","Any simple weapon"],["Dungeoneer's pack","Explorer's pack"],["10 darts"]]
  },
  paladin: { name:"Paladin", hitDie:10, saves:["wis","cha"], primaryAbility:"cha", spellcastingAbility:"cha", armorProf:["All armor","Shields"], weaponProf:["Simple weapons","Martial weapons"], skillCount:2, skillOptions:["Athletics","Insight","Intimidation","Medicine","Persuasion","Religion"],
    subclasses:["Devotion","Vengeance"],
    features:[{level:1,name:"Divine Sense",desc:"Action: know the location of celestials, fiends, undead within 60 ft. Uses = 1 + CHA mod per long rest."},{level:1,name:"Lay on Hands",desc:"Touch to restore HP from a pool of 5 × Paladin level. Or expend 5 to cure one disease or poison."}],
    equipment:[["Martial weapon + shield","Two martial weapons"],["Five javelins","Any simple melee weapon"],["Priest's pack","Explorer's pack"],["Chain mail","Leather armor + longbow + 20 arrows"]]
  },
  ranger: { name:"Ranger", hitDie:10, saves:["str","dex"], primaryAbility:"dex", spellcastingAbility:"wis", armorProf:["Light armor","Medium armor","Shields"], weaponProf:["Simple weapons","Martial weapons"], skillCount:3, skillOptions:["Animal Handling","Athletics","Insight","Investigation","Nature","Perception","Stealth","Survival"],
    subclasses:["Hunter","Beast Master"],
    features:[{level:1,name:"Favored Enemy",desc:"Choose a type of enemy. Advantage on Survival checks to track them, advantage on Intelligence checks to recall info about them."},{level:1,name:"Natural Explorer",desc:"Choose a favored terrain. Bonuses to travel, foraging, tracking, and navigation in that terrain."}],
    equipment:[["Scale mail","Leather armor"],["Two shortswords","Two simple melee weapons"],["Dungeoneer's pack","Explorer's pack"],["Longbow + 20 arrows"]]
  },
  rogue: { name:"Rogue", hitDie:8, saves:["dex","int"], primaryAbility:"dex", armorProf:["Light armor"], weaponProf:["Simple weapons","Hand crossbows","Longswords","Rapiers","Shortswords"], skillCount:4, skillOptions:["Acrobatics","Athletics","Deception","Insight","Intimidation","Investigation","Perception","Performance","Persuasion","Sleight of Hand","Stealth"],
    subclasses:["Thief","Assassin","Arcane Trickster"],
    features:[{level:1,name:"Expertise",desc:"Choose 2 proficient skills. Your proficiency bonus is doubled for those skills."},{level:1,name:"Sneak Attack",desc:"Once per turn, you can deal extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or ranged weapon. You don't need advantage if another enemy of the target is within 5 feet of it, that enemy isn't incapacitated, and you don't have disadvantage on the attack roll."},{level:1,name:"Thieves' Cant",desc:"A secret mix of dialect, jargon, and code used by rogues and criminals."}],
    equipment:[["Rapier","Shortsword"],["Shortbow + 20 arrows","Shortsword"],["Burglar's pack","Dungeoneer's pack","Explorer's pack"],["Leather armor","Daggers x2","Thieves' tools"]]
  },
  sorcerer: { name:"Sorcerer", hitDie:6, saves:["con","cha"], primaryAbility:"cha", spellcastingAbility:"cha", armorProf:[], weaponProf:["Daggers","Darts","Slings","Quarterstaffs","Light crossbows"], skillCount:2, skillOptions:["Arcana","Deception","Insight","Intimidation","Persuasion","Religion"],
    subclasses:["Draconic Bloodline","Wild Magic"],
    features:[{level:1,name:"Spellcasting",desc:"Cha-based spellcasting. Know 4 spells, 2 cantrips. 2 first-level spell slots."},{level:1,name:"Sorcerous Origin",desc:"Choose your magical origin: Draconic Bloodline or Wild Magic."}],
    equipment:[["Light crossbow + 20 bolts","Any simple weapon"],["Component pouch","Arcane focus"],["Dungeoneer's pack","Explorer's pack"],["Two daggers"]]
  },
  warlock: { name:"Warlock", hitDie:8, saves:["wis","cha"], primaryAbility:"cha", spellcastingAbility:"cha", armorProf:["Light armor"], weaponProf:["Simple weapons"], skillCount:2, skillOptions:["Arcana","Deception","History","Intimidation","Investigation","Nature","Religion"],
    subclasses:["Archfey","Fiend","Great Old One"],
    features:[{level:1,name:"Otherworldly Patron",desc:"Choose your patron: Archfey, Fiend, or Great Old One. Grants expanded spell list and bonus features."},{level:1,name:"Pact Magic",desc:"Cha-based spellcasting. Spell slots recharge on short rest. 2 cantrips known, 2 spells known, 1 first-level slot."}],
    equipment:[["Light crossbow + 20 bolts","Any simple weapon"],["Component pouch","Arcane focus"],["Scholar's pack","Dungeoneer's pack"],["Leather armor","Any simple weapon","Two daggers"]]
  },
  wizard: { name:"Wizard", hitDie:6, saves:["int","wis"], primaryAbility:"int", spellcastingAbility:"int", armorProf:[], weaponProf:["Daggers","Darts","Slings","Quarterstaffs","Light crossbows"], skillCount:2, skillOptions:["Arcana","History","Insight","Investigation","Medicine","Religion"],
    features:[{level:1,name:"Spellcasting",desc:"Int-based spellcasting. Spellbook starts with 6 first-level spells. Prepare Int mod + Wizard level spells. Ritual Casting."},{level:1,name:"Arcane Recovery",desc:"Once per long rest, during a short rest, you can recover expended spell slots with a combined level equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher."}],
    subclasses:["Abjuration","Conjuration","Divination","Enchantment","Evocation","Illusion","Necromancy","Transmutation"],
    equipment:[["Quarterstaff","Dagger"],["Component pouch","Arcane focus"],["Scholar's pack","Explorer's pack"],["Spellbook"]]
  }
},

backgrounds: {
  acolyte: { name:"Acolyte", skills:["Insight","Religion"], languages:2, feature:"Shelter of the Faithful", featureDesc:"You can call on the aid of religious establishments that share your faith.", equipment:"Holy symbol, prayer book, 5 sticks incense, vestments, common clothes, 15 gp" },
  charlatan: { name:"Charlatan", skills:["Deception","Sleight of Hand"], tools:["Disguise kit","Forgery kit"], feature:"False Identity", featureDesc:"You have a false identity with documentation and a disguise.", equipment:"Fine clothes, disguise kit, con tools, 15 gp" },
  criminal: { name:"Criminal", skills:["Deception","Stealth"], tools:["Gaming set","Thieves' tools"], feature:"Criminal Contact", featureDesc:"You have a reliable criminal contact who can find information.", equipment:"Crowbar, dark common clothes with hood, 15 gp" },
  entertainer: { name:"Entertainer", skills:["Acrobatics","Performance"], tools:["Disguise kit","Musical instrument"], feature:"By Popular Demand", featureDesc:"You can always find a place to perform and earn free lodging.", equipment:"Musical instrument, favor of admirer, costume, 15 gp" },
  folkhero: { name:"Folk Hero", skills:["Animal Handling","Survival"], tools:["Artisan's tools","Vehicles (land)"], feature:"Rustic Hospitality", featureDesc:"Common folk will shelter and hide you.", equipment:"Artisan's tools, shovel, iron pot, common clothes, 10 gp" },
  guildartisan: { name:"Guild Artisan", skills:["Insight","Persuasion"], tools:["Artisan's tools"], languages:1, feature:"Guild Membership", featureDesc:"Guild members will provide you lodging and legal assistance.", equipment:"Artisan's tools, letter of introduction, traveler's clothes, 15 gp" },
  hermit: { name:"Hermit", skills:["Medicine","Religion"], tools:["Herbalism kit"], languages:1, feature:"Discovery", featureDesc:"Your seclusion gave you access to a unique discovery.", equipment:"Scroll case, winter blanket, common clothes, herbalism kit, 5 gp" },
  noble: { name:"Noble", skills:["History","Persuasion"], tools:["Gaming set"], languages:1, feature:"Position of Privilege", featureDesc:"People assume the best of you and defer to your wishes.", equipment:"Fine clothes, signet ring, scroll of pedigree, 25 gp" },
  outlander: { name:"Outlander", skills:["Athletics","Survival"], tools:["Musical instrument"], languages:1, feature:"Wanderer", featureDesc:"You can always find food and fresh water, and remember geography.", equipment:"Staff, hunting trap, trophy, traveler's clothes, 10 gp" },
  sage: { name:"Sage", skills:["Arcana","History"], languages:2, feature:"Researcher", featureDesc:"If you don't know information, you know where to find it.", equipment:"Bottle ink, quill, small knife, letters from colleague, common clothes, 10 gp" },
  sailor: { name:"Sailor", skills:["Athletics","Perception"], tools:["Navigator's tools","Vehicles (water)"], feature:"Ship's Passage", featureDesc:"You can secure free passage on sailing ships.", equipment:"Belaying pin, silk rope 50ft, lucky charm, common clothes, 10 gp" },
  soldier: { name:"Soldier", skills:["Athletics","Intimidation"], tools:["Gaming set","Vehicles (land)"], feature:"Military Rank", featureDesc:"Soldiers loyal to your former organization recognize your rank.", equipment:"Insignia of rank, trophy, playing cards, common clothes, 10 gp" },
  urchin: { name:"Urchin", skills:["Sleight of Hand","Stealth"], tools:["Disguise kit","Thieves' tools"], feature:"City Secrets", featureDesc:"You know the secret paths of cities, moving twice the normal speed.", equipment:"Small knife, map of home city, pet mouse, token of parents, common clothes, 10 gp" }
},

skills: {
  acrobatics:{name:"Acrobatics",ability:"dex"}, animalhandling:{name:"Animal Handling",ability:"wis"},
  arcana:{name:"Arcana",ability:"int"}, athletics:{name:"Athletics",ability:"str"},
  deception:{name:"Deception",ability:"cha"}, history:{name:"History",ability:"int"},
  insight:{name:"Insight",ability:"wis"}, intimidation:{name:"Intimidation",ability:"cha"},
  investigation:{name:"Investigation",ability:"int"}, medicine:{name:"Medicine",ability:"wis"},
  nature:{name:"Nature",ability:"int"}, perception:{name:"Perception",ability:"wis"},
  performance:{name:"Performance",ability:"cha"}, persuasion:{name:"Persuasion",ability:"cha"},
  religion:{name:"Religion",ability:"int"}, sleightofhand:{name:"Sleight of Hand",ability:"dex"},
  stealth:{name:"Stealth",ability:"dex"}, survival:{name:"Survival",ability:"wis"}
},

spells: {
  wizard: {
    cantrips:["Fire Bolt","Ray of Frost","Shocking Grasp","Mage Hand","Prestidigitation","Minor Illusion","Acid Splash","Poison Spray","True Strike","Light","Message","Dancing Lights","Friends","Blade Ward"],
    level1:["Magic Missile","Sleep","Charm Person","Shield","Mage Armor","Detect Magic","Identify","Comprehend Languages","Feather Fall","Fog Cloud","Thunderwave","Burning Hands","Grease","Jump","Longstrider","Unseen Servant","Alarm","Disguise Self","Illusory Script","Witch Bolt","False Life","Ray of Sickness","Absorb Elements","Catapult","Ice Knife","Chromatic Orb","Expeditious Retreat"]
  },
  sorcerer: {
    cantrips:["Fire Bolt","Chill Touch","Shocking Grasp","Ray of Frost","Mage Hand","Prestidigitation","Minor Illusion","True Strike","Light","Message","Dancing Lights","Friends","Blade Ward","Thunderclap","Acid Splash"],
    level1:["Magic Missile","Sleep","Charm Person","Shield","Burning Hands","Thunderwave","Fog Cloud","Chromatic Orb","Disguise Self","Expeditious Retreat","False Life","Feather Fall","Jump","Mage Armor","Ray of Sickness","Silent Image","Witch Bolt","Absorb Elements","Catapult","Ice Knife"]
  },
  bard: {
    cantrips:["Friends","Light","Mage Hand","Minor Illusion","Prestidigitation","True Strike","Thunderclap","Vicious Mockery","Blade Ward"],
    level1:["Charm Person","Comprehend Languages","Cure Wounds","Detect Magic","Disguise Self","Dissonant Whispers","Earth Tremor","Faerie Fire","Feather Fall","Healing Word","Heroism","Hideous Laughter","Identify","Illusory Script","Longstrider","Silent Image","Sleep","Speak with Animals","Thunderwave","Unseen Servant"]
  },
  cleric: {
    cantrips:["Guidance","Light","Mending","Resistance","Sacred Flame","Spare the Dying","Thaumaturgy","Toll the Dead","Word of Radiance","Blade Ward","True Strike"],
    level1:["Bane","Bless","Command","Create or Destroy Water","Cure Wounds","Detect Evil and Good","Detect Magic","Detect Poison and Disease","Guiding Bolt","Healing Word","Inflict Wounds","Protection from Evil and Good","Purify Food and Drink","Sanctuary","Shield of Faith"]
  },
  druid: {
    cantrips:["Druidcraft","Guidance","Mending","Poison Spray","Produce Flame","Resistance","Shillelagh","Thorn Whip","Thunderclap"],
    level1:["Animal Friendship","Absorb Elements","Charm Person","Create or Destroy Water","Cure Wounds","Detect Magic","Detect Poison and Disease","Earth Tremor","Entangle","Faerie Fire","Fog Cloud","Goodberry","Healing Word","Ice Knife","Jump","Longstrider","Purify Food and Drink","Speak with Animals","Thunderwave"]
  },
  paladin: {
    level1:["Bless","Command","Compelled Duel","Cure Wounds","Detect Evil and Good","Detect Magic","Detect Poison and Disease","Divine Favor","Heroism","Protection from Evil and Good","Purify Food and Drink","Searing Smite","Shield of Faith","Thunderous Smite","Wrathful Smite"]
  },
  ranger: {
    level1:["Absorb Elements","Alarm","Animal Friendship","Cure Wounds","Detect Magic","Detect Poison and Disease","Ensnaring Strike","Fog Cloud","Goodberry","Hail of Thorns","Hunter's Mark","Jump","Longstrider","Speak with Animals"]
  },
  warlock: {
    cantrips:["Blade Ward","Chill Touch","Eldritch Blast","Friends","Mage Hand","Minor Illusion","Poison Spray","Prestidigitation","True Strike","Thunderclap"],
    level1:["Armor of Agathys","Arms of Hadar","Charm Person","Comprehend Languages","Expeditious Retreat","Hellish Rebuke","Hex","Illusory Script","Protection from Evil and Good","Unseen Servant","Witch Bolt"]
  }
},

standardArray: [15,14,13,12,10,8],
abilityNames: { str:"Strength", dex:"Dexterity", con:"Constitution", int:"Intelligence", wis:"Wisdom", cha:"Charisma" },
abilityShort: { str:"STR", dex:"DEX", con:"CON", int:"INT", wis:"WIS", cha:"CHA" },

alignments: ["Lawful Good","Neutral Good","Chaotic Good","Lawful Neutral","True Neutral","Chaotic Neutral","Lawful Evil","Neutral Evil","Chaotic Evil"],

profBonus: { 1:2,2:2,3:2,4:2,5:3,6:3,7:3,8:3,9:4,10:4,11:4,12:4,13:5,14:5,15:5,16:5,17:6,18:6,19:6,20:6 },

hpByLevel: { barbarian:12, bard:8, cleric:8, druid:8, fighter:10, monk:8, paladin:10, ranger:10, rogue:8, sorcerer:6, warlock:8, wizard:6 }
};

// ── WEAPON LISTS ──
DND_DATA.weapons = {
  simple_melee: [
    {name:"Club",damage:"1d4",type:"Bludgeoning",props:"Light"},
    {name:"Dagger",damage:"1d4",type:"Piercing",props:"Finesse, Light, Thrown"},
    {name:"Greatclub",damage:"1d8",type:"Bludgeoning",props:"Two-handed"},
    {name:"Handaxe",damage:"1d6",type:"Slashing",props:"Light, Thrown"},
    {name:"Javelin",damage:"1d6",type:"Piercing",props:"Thrown"},
    {name:"Light Hammer",damage:"1d4",type:"Bludgeoning",props:"Light, Thrown"},
    {name:"Mace",damage:"1d6",type:"Bludgeoning",props:"—"},
    {name:"Quarterstaff",damage:"1d6",type:"Bludgeoning",props:"Versatile (1d8)"},
    {name:"Sickle",damage:"1d4",type:"Slashing",props:"Light"},
    {name:"Spear",damage:"1d6",type:"Piercing",props:"Thrown, Versatile (1d8)"}
  ],
  simple_ranged: [
    {name:"Crossbow, Light",damage:"1d8",type:"Piercing",props:"Ammunition, Loading, Two-handed"},
    {name:"Dart",damage:"1d4",type:"Piercing",props:"Finesse, Thrown"},
    {name:"Shortbow",damage:"1d6",type:"Piercing",props:"Ammunition, Two-handed"},
    {name:"Sling",damage:"1d4",type:"Bludgeoning",props:"Ammunition"}
  ],
  martial_melee: [
    {name:"Battleaxe",damage:"1d8",type:"Slashing",props:"Versatile (1d10)"},
    {name:"Flail",damage:"1d8",type:"Bludgeoning",props:"—"},
    {name:"Glaive",damage:"1d10",type:"Slashing",props:"Heavy, Reach, Two-handed"},
    {name:"Greataxe",damage:"1d12",type:"Slashing",props:"Heavy, Two-handed"},
    {name:"Greatsword",damage:"2d6",type:"Slashing",props:"Heavy, Two-handed"},
    {name:"Halberd",damage:"1d10",type:"Slashing",props:"Heavy, Reach, Two-handed"},
    {name:"Lance",damage:"1d12",type:"Piercing",props:"Reach, Special"},
    {name:"Longsword",damage:"1d8",type:"Slashing",props:"Versatile (1d10)"},
    {name:"Maul",damage:"2d6",type:"Bludgeoning",props:"Heavy, Two-handed"},
    {name:"Morningstar",damage:"1d8",type:"Piercing",props:"—"},
    {name:"Pike",damage:"1d10",type:"Piercing",props:"Heavy, Reach, Two-handed"},
    {name:"Rapier",damage:"1d8",type:"Piercing",props:"Finesse"},
    {name:"Scimitar",damage:"1d6",type:"Slashing",props:"Finesse, Light"},
    {name:"Shortsword",damage:"1d6",type:"Piercing",props:"Finesse, Light"},
    {name:"Trident",damage:"1d6",type:"Piercing",props:"Thrown, Versatile (1d8)"},
    {name:"War Pick",damage:"1d8",type:"Piercing",props:"—"},
    {name:"Warhammer",damage:"1d8",type:"Bludgeoning",props:"Versatile (1d10)"},
    {name:"Whip",damage:"1d4",type:"Slashing",props:"Finesse, Reach"}
  ],
  martial_ranged: [
    {name:"Blowgun",damage:"1",type:"Piercing",props:"Ammunition, Loading"},
    {name:"Crossbow, Hand",damage:"1d6",type:"Piercing",props:"Ammunition, Light, Loading"},
    {name:"Crossbow, Heavy",damage:"1d10",type:"Piercing",props:"Ammunition, Heavy, Loading, Two-handed"},
    {name:"Longbow",damage:"1d8",type:"Piercing",props:"Ammunition, Heavy, Two-handed"},
    {name:"Net",damage:"—",type:"—",props:"Special, Thrown"}
  ]
};

DND_DATA.weaponCategories = {
  "Any simple weapon":    [...DND_DATA.weapons.simple_melee, ...DND_DATA.weapons.simple_ranged],
  "Any simple melee weapon": DND_DATA.weapons.simple_melee,
  "Any martial weapon":   [...DND_DATA.weapons.martial_melee, ...DND_DATA.weapons.martial_ranged],
  "Any martial melee weapon": DND_DATA.weapons.martial_melee,
  "Any weapon":           [...DND_DATA.weapons.simple_melee, ...DND_DATA.weapons.simple_ranged, ...DND_DATA.weapons.martial_melee, ...DND_DATA.weapons.martial_ranged]
};

// ── ABILITY USE TRACKING ──
DND_DATA.abilityUses = {
  barbarian:[
    {name:'Rage', uses:2, recharge:'long_rest', desc:'Advantage on STR checks/saves, bonus melee damage, resistance to B/P/S damage. Lasts 1 minute.'},
    {name:'Unarmored Defense', uses:0, recharge:'passive', desc:'While not wearing armor: AC = 10 + DEX mod + CON mod.'}
  ],
  bard:[
    {name:'Bardic Inspiration', uses:'cha_mod', recharge:'long_rest', desc:'Bonus action: grant a creature a d6 to add to one check, save, or attack roll.'}
  ],
  cleric:[
    {name:'Channel Divinity', uses:1, recharge:'short_rest', desc:'Use your divine connection. Effect determined by your chosen domain.'}
  ],
  druid:[
    {name:'Wild Shape', uses:2, recharge:'short_rest', desc:'Magically assume the shape of a beast you have seen before (CR 1/4, no fly/swim speed at 2nd level).'}
  ],
  fighter:[
    {name:'Second Wind', uses:1, recharge:'short_rest', desc:'Bonus action: regain 1d10 + Fighter level HP.'},
    {name:'Action Surge', uses:1, recharge:'short_rest', desc:'Take one additional action on your turn. Not another Action Surge.'}
  ],
  monk:[
    {name:'Ki Points', uses:'level', recharge:'short_rest', isPool:true, desc:'Spend ki to fuel Flurry of Blows (1 ki), Patient Defense (1 ki), or Step of the Wind (1 ki).'},
    {name:'Unarmored Defense', uses:0, recharge:'passive', desc:'While not wearing armor: AC = 10 + DEX mod + WIS mod.'}
  ],
  paladin:[
    {name:'Divine Sense', uses:'1+cha_mod', recharge:'long_rest', desc:'Detect the presence of powerful celestials, fiends, and undead within 60 feet.'},
    {name:'Lay on Hands', uses:5, recharge:'long_rest', isPool:true, desc:'Touch to restore HP. Pool = 5 × paladin level. Spend 5 to cure one disease or neutralize one poison.'}
  ],
  ranger:[
    {name:'Favored Enemy', uses:0, recharge:'passive', desc:'Advantage on Survival checks to track chosen enemy type. Advantage on INT checks for info about them.'},
    {name:'Natural Explorer', uses:0, recharge:'passive', desc:'Expertise in chosen terrain: no difficult terrain slow, never lost, advantage on initiative, extra rations, tracking more creatures.'}
  ],
  rogue:[
    {name:'Sneak Attack', uses:0, recharge:'passive', desc:'Once per turn, you can deal extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or ranged weapon. You don\'t need advantage if another enemy of the target is within 5 feet of it, that enemy isn\'t incapacitated, and you don\'t have disadvantage on the attack roll.'},
    {name:'Cunning Action', uses:0, recharge:'passive', desc:'Bonus action: Dash, Disengage, or Hide.'}
  ],
  sorcerer:[
    {name:'Sorcery Points', uses:'level', recharge:'long_rest', isPool:true, desc:'Spend to create spell slots or fuel Metamagic options like Twinned Spell, Quickened Spell, etc.'},
    {name:'Font of Magic', uses:0, recharge:'passive', desc:'At 2nd level: convert spell slots to/from Sorcery Points.'}
  ],
  warlock:[
    {name:'Pact Magic Slots', uses:1, recharge:'short_rest', desc:'Your spell slots recharge on a short or long rest. All slots are the same level.'},
    {name:'Dark One\'s Blessing', uses:0, recharge:'passive', desc:'Fiend patron: when you reduce a creature to 0 HP, gain CHA mod + Warlock level temp HP.'}
  ],
  wizard:[
    {name:'Arcane Recovery', uses:1, recharge:'long_rest', desc:'Once per long rest, during a short rest, you can recover expended spell slots with a combined level equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher.'}
  ]
};

// ── STANDARD ACTIONS (D&D 5e rulebook) ──
DND_DATA.standardActions = [
  {name:'Attack',          type:'Action',       desc:'Make one melee or ranged weapon attack (or more with Extra Attack).'},
  {name:'Cast a Spell',    type:'Action/Bonus', desc:'Cast a spell with a casting time of 1 action or 1 bonus action.'},
  {name:'Dash',            type:'Action',       desc:'Gain extra movement equal to your speed for this turn.'},
  {name:'Disengage',       type:'Action',       desc:'Your movement doesn\'t provoke opportunity attacks for the rest of your turn.'},
  {name:'Dodge',           type:'Action',       desc:'Until your next turn: attacks against you have disadvantage, you have advantage on DEX saves.'},
  {name:'Help',            type:'Action',       desc:'Aid an ally: give them advantage on their next ability check or attack roll.'},
  {name:'Hide',            type:'Action',       desc:'Make a DEX (Stealth) check to hide from creatures that can\'t clearly see you.'},
  {name:'Ready',           type:'Action',       desc:'Prepare a reaction trigger and response for later in the round.'},
  {name:'Search',          type:'Action',       desc:'Devote your attention to finding something. WIS (Perception) or INT (Investigation).'},
  {name:'Use an Object',   type:'Action',       desc:'Interact with a second object or use a special object feature (some objects require the Use an Object action).'},
  {name:'Grapple',         type:'Attack',       desc:'Replace one attack: contested STR (Athletics) vs STR (Athletics) or DEX (Acrobatics). On success: target is grappled.'},
  {name:'Shove',           type:'Attack',       desc:'Replace one attack: knock prone or push 5ft. Contested STR (Athletics) vs STR (Athletics) or DEX (Acrobatics).'},
  {name:'Improvise',       type:'Action',       desc:'Do something not covered by another action. DM decides if an ability check is needed.'},
  {name:'Opportunity Attack', type:'Reaction',  desc:'When a creature you can see leaves your reach, you can use your reaction to make one melee attack.'},
  {name:'Dodge (Reaction)', type:'Reaction',    desc:'Some spells and features let you use your reaction to impose disadvantage on an attack or halve damage.'}
];

// ── SPELL SLOT TABLES ──

// ── SPELL DESCRIPTIONS ──
DND_DATA.spellDescriptions = {
  // Cantrips
  "Fire Bolt":           {school:"Evocation", castTime:"1 action", range:"120 ft", duration:"Instantaneous", desc:"Hurl a mote of fire. +d10 fire damage on hit. Hits flammable objects not worn or carried."},
  "Ray of Frost":        {school:"Evocation", castTime:"1 action", range:"60 ft", duration:"Instantaneous", desc:"Beam of blue-white light. +d8 cold damage, target speed reduced by 10 ft until your next turn."},
  "Shocking Grasp":      {school:"Evocation", castTime:"1 action", range:"Touch", duration:"Instantaneous", desc:"+d8 lightning damage. Advantage vs metal armor. Target can't take reactions until next turn."},
  "Mage Hand":           {school:"Conjuration", castTime:"1 action", range:"30 ft", duration:"1 minute", desc:"Spectral hand carries objects up to 10 lbs, opens doors, retrieves items. Can't attack."},
  "Prestidigitation":    {school:"Transmutation", castTime:"1 action", range:"10 ft", duration:"Up to 1 hour", desc:"Minor magical tricks: lights, sounds, smells, marks, trinkets, clean/soil objects."},
  "Minor Illusion":      {school:"Illusion", castTime:"1 action", range:"30 ft", duration:"1 minute", desc:"Create a sound or image. Investigation check to determine it's an illusion."},
  "Vicious Mockery":     {school:"Enchantment", castTime:"1 action", range:"60 ft", duration:"Instantaneous", desc:"Taunt with insults. WIS save or take d4 psychic damage and disadvantage on next attack roll."},
  "Eldritch Blast":      {school:"Evocation", castTime:"1 action", range:"120 ft", duration:"Instantaneous", desc:"Beam of crackling energy. +d10 force damage per beam. Two beams at 5th level."},
  "Sacred Flame":        {school:"Evocation", castTime:"1 action", range:"60 ft", duration:"Instantaneous", desc:"Flame-like radiance descends. DEX save or take d8 radiant damage. No cover bonus."},
  "Guidance":            {school:"Divination", castTime:"1 action", range:"Touch", duration:"Concentration, 1 min", desc:"Add d4 to one ability check of your choice before the spell ends."},
  "Thaumaturgy":         {school:"Transmutation", castTime:"1 action", range:"30 ft", duration:"Up to 1 minute", desc:"Manifest a wonder: tremors, flame flare, thunder clap, eye color change, voice booms."},
  "Produce Flame":       {school:"Conjuration", castTime:"1 action", range:"Self", duration:"10 minutes", desc:"Flame in your hand gives 10ft light. Can hurl it: +d8 fire damage, 30ft range."},
  "Thorn Whip":          {school:"Transmutation", castTime:"1 action", range:"30 ft", duration:"Instantaneous", desc:"+d6 piercing damage. Pull creature up to 10 ft toward you."},
  "Druidcraft":          {school:"Transmutation", castTime:"1 action", range:"30 ft", duration:"Instantaneous", desc:"Predict weather, make flower bloom, create sensory effect, light or snuff a flame."},
  "Shillelagh":          {school:"Transmutation", castTime:"1 bonus action", range:"Touch", duration:"1 minute", desc:"Your club or quarterstaff deals d8 damage using WIS instead of STR."},
  "Toll the Dead":       {school:"Necromancy", castTime:"1 action", range:"60 ft", duration:"Instantaneous", desc:"WIS save or d8 necrotic (d12 if wounded). No attack roll needed."},
  "Thunderclap":         {school:"Evocation", castTime:"1 action", range:"5 ft", duration:"Instantaneous", desc:"CON save or d6 thunder damage. Audible 100 ft away."},
  "Chill Touch":         {school:"Necromancy", castTime:"1 action", range:"120 ft", duration:"1 round", desc:"+d8 necrotic damage. Target can't regain HP. Undead also get disadvantage on attacks vs you."},
  "True Strike":         {school:"Divination", castTime:"1 action", range:"30 ft", duration:"Concentration, 1 round", desc:"Advantage on your next attack roll vs target before end of next turn."},
  "Light":               {school:"Evocation", castTime:"1 action", range:"Touch", duration:"1 hour", desc:"Object glows 20ft bright, 20ft dim. DEX save to avoid if worn/held by hostile creature."},
  "Message":             {school:"Transmutation", castTime:"1 action", range:"120 ft", duration:"1 round", desc:"Whisper a message to a creature. They can reply in a whisper only you hear."},
  "Dancing Lights":      {school:"Evocation", castTime:"1 action", range:"120 ft", duration:"Concentration, 1 min", desc:"Up to four torch-lights move as you direct. Dim light in 10ft area each."},
  "Friends":             {school:"Enchantment", castTime:"1 action", range:"Self", duration:"Concentration, 1 min", desc:"Advantage on CHA checks against one creature. It knows you used magic after spell ends."},
  "Blade Ward":          {school:"Abjuration", castTime:"1 action", range:"Self", duration:"1 round", desc:"Resistance to bludgeoning, piercing, and slashing damage from weapon attacks until next turn."},
  "Acid Splash":         {school:"Conjuration", castTime:"1 action", range:"60 ft", duration:"Instantaneous", desc:"Orb of acid. DEX save or d6 acid damage. Can target two creatures within 5 ft of each other."},
  "Poison Spray":        {school:"Conjuration", castTime:"1 action", range:"10 ft", duration:"Instantaneous", desc:"CON save or d12 poison damage."},
  "Word of Radiance":    {school:"Evocation", castTime:"1 action", range:"5 ft", duration:"Instantaneous", desc:"All chosen creatures within 5ft: CON save or d6 radiant damage."},
  "Spare the Dying":     {school:"Necromancy", castTime:"1 action", range:"Touch", duration:"Instantaneous", desc:"Touch a dying creature (0 HP) to stabilize it. Has no effect on undead or constructs."},
  "Resistance":          {school:"Abjuration", castTime:"1 action", range:"Touch", duration:"Concentration, 1 min", desc:"Touch a creature. Once before spell ends, roll d4 and add to one saving throw."},
  "Mending":             {school:"Transmutation", castTime:"1 minute", range:"Touch", duration:"Instantaneous", desc:"Repair a single break or tear in an object. Invisible seam."},

  // 1st Level Spells
  "Magic Missile":       {school:"Evocation", castTime:"1 action", range:"120 ft", duration:"Instantaneous", desc:"Three darts of magical force. Each hits automatically for d4+1 force damage. Always hits."},
  "Sleep":               {school:"Enchantment", castTime:"1 action", range:"90 ft", duration:"1 minute", desc:"Roll 5d8. Creatures with HP ≤ total fall unconscious, lowest HP first."},
  "Charm Person":        {school:"Enchantment", castTime:"1 action", range:"30 ft", duration:"1 hour", desc:"WIS save or target regards you as a friendly acquaintance. Knows it was charmed after."},
  "Shield":              {school:"Abjuration", castTime:"1 reaction", range:"Self", duration:"1 round", desc:"+5 AC until start of next turn including vs the triggering attack. Also blocks Magic Missile."},
  "Mage Armor":          {school:"Abjuration", castTime:"1 action", range:"Touch", duration:"8 hours", desc:"Willing creature's AC becomes 13 + DEX modifier. Lasts 8 hours or until armor worn."},
  "Detect Magic":        {school:"Divination", castTime:"1 action", range:"Self", duration:"Concentration, 10 min", desc:"Sense presence of magic within 30 ft. See magical auras, learn school of magic. Ritual."},
  "Identify":            {school:"Divination", castTime:"1 minute", range:"Touch", duration:"Instantaneous", desc:"Learn the properties of a magic item, active spells on a creature, or how to activate it. Ritual."},
  "Thunderwave":         {school:"Evocation", castTime:"1 action", range:"Self (15ft cube)", duration:"Instantaneous", desc:"CON save: d8 thunder + 10ft push on fail. Half on save. Audible 300ft."},
  "Burning Hands":       {school:"Evocation", castTime:"1 action", range:"Self (15ft cone)", duration:"Instantaneous", desc:"DEX save: 3d6 fire on fail, half on save. Flammable objects ignite."},
  "Cure Wounds":         {school:"Evocation", castTime:"1 action", range:"Touch", duration:"Instantaneous", desc:"Touch a living creature to restore d8 + spellcasting modifier HP. No effect on undead/constructs."},
  "Healing Word":        {school:"Evocation", castTime:"1 bonus action", range:"60 ft", duration:"Instantaneous", desc:"Bonus action heal: target regains d4 + spellcasting modifier HP. Range 60 ft."},
  "Bless":               {school:"Enchantment", castTime:"1 action", range:"30 ft", duration:"Concentration, 1 min", desc:"Up to 3 creatures add d4 to attack rolls and saving throws."},
  "Bane":                {school:"Enchantment", castTime:"1 action", range:"30 ft", duration:"Concentration, 1 min", desc:"Up to 3 creatures: CHA save or subtract d4 from attack rolls and saving throws."},
  "Guiding Bolt":        {school:"Evocation", castTime:"1 action", range:"120 ft", duration:"1 round", desc:"+4d6 radiant damage. Next attack vs target has advantage before end of your next turn."},
  "Inflict Wounds":      {school:"Necromancy", castTime:"1 action", range:"Touch", duration:"Instantaneous", desc:"Melee spell attack: 3d10 necrotic damage on hit."},
  "Shield of Faith":     {school:"Abjuration", castTime:"1 bonus action", range:"60 ft", duration:"Concentration, 10 min", desc:"Shimmering field gives target +2 AC."},
  "Command":             {school:"Enchantment", castTime:"1 action", range:"60 ft", duration:"1 round", desc:"WIS save or follow one-word command: Approach, Drop, Flee, Grovel, Halt."},
  "Sanctuary":           {school:"Abjuration", castTime:"1 bonus action", range:"30 ft", duration:"1 minute", desc:"Attackers must WIS save to target protected creature. Ends if it attacks or casts."},
  "Entangle":            {school:"Conjuration", castTime:"1 action", range:"90 ft", duration:"Concentration, 1 min", desc:"Grasping weeds fill 20ft square. STR save or restrained. Area is difficult terrain."},
  "Faerie Fire":         {school:"Evocation", castTime:"1 action", range:"60 ft", duration:"Concentration, 1 min", desc:"DEX save or outlined in light. Attacks vs outlined creatures have advantage. No hiding."},
  "Goodberry":           {school:"Transmutation", castTime:"1 action", range:"Touch", duration:"Instantaneous", desc:"Create 10 berries. Each restores 1 HP and provides a day's nourishment."},
  "Fog Cloud":           {school:"Conjuration", castTime:"1 action", range:"120 ft", duration:"Concentration, 1 hour", desc:"20ft radius sphere of fog. Heavily obscured area. Wind disperses it."},
  "Feather Fall":        {school:"Transmutation", castTime:"1 reaction", range:"60 ft", duration:"1 minute", desc:"Up to 5 falling creatures descend 60ft/round and take no fall damage."},
  "Longstrider":         {school:"Transmutation", castTime:"1 action", range:"Touch", duration:"1 hour", desc:"Touch a creature. Its speed increases by 10 ft for the duration."},
  "Jump":                {school:"Transmutation", castTime:"1 action", range:"Touch", duration:"1 minute", desc:"Triple a creature's jump distance for the duration."},
  "Hex":                 {school:"Enchantment", castTime:"1 bonus action", range:"90 ft", duration:"Concentration, 1 hour", desc:"Curse target: deal extra d6 necrotic on hits. Choose ability: target has disadvantage on checks with it."},
  "Hellish Rebuke":      {school:"Evocation", castTime:"1 reaction", range:"60 ft", duration:"Instantaneous", desc:"When damaged: DEX save or 2d10 fire to attacker. Half on save."},
  "Armor of Agathys":    {school:"Abjuration", castTime:"1 action", range:"Self", duration:"1 hour", desc:"Gain 5 temp HP. When hit in melee, attacker takes 5 cold damage."},
  "Arms of Hadar":       {school:"Conjuration", castTime:"1 action", range:"Self (10ft)", duration:"Instantaneous", desc:"STR save or 2d6 necrotic and can't take reactions. Half damage on save."},
  "Witch Bolt":          {school:"Evocation", castTime:"1 action", range:"30 ft", duration:"Concentration, 1 min", desc:"Ranged attack: d12 lightning. Each turn, bonus action to deal d12 again automatically."},
  "Expeditious Retreat":  {school:"Transmutation", castTime:"1 bonus action", range:"Self", duration:"Concentration, 10 min", desc:"Take Dash action as bonus action on each turn."},
  "False Life":          {school:"Necromancy", castTime:"1 action", range:"Self", duration:"1 hour", desc:"Gain 1d4+4 temporary HP."},
  "Disguise Self":       {school:"Illusion", castTime:"1 action", range:"Self", duration:"1 hour", desc:"Change appearance of body and equipment. Investigation vs spell save DC to see through."},
  "Silent Image":        {school:"Illusion", castTime:"1 action", range:"60 ft", duration:"Concentration, 10 min", desc:"Create a visual illusion up to 15ft cube. Investigation check to disbelieve."},
  "Comprehend Languages":{school:"Divination", castTime:"1 action", range:"Self", duration:"1 hour", desc:"Understand any spoken or written language. Touch written surface for word-by-word translation. Ritual."},
  "Unseen Servant":      {school:"Conjuration", castTime:"1 action", range:"60 ft", duration:"1 hour", desc:"Invisible force performs simple tasks: fetch, clean, hold, carry (10lbs). Speed 15ft. Ritual."},
  "Alarm":               {school:"Abjuration", castTime:"1 minute", range:"30 ft", duration:"8 hours", desc:"Mental or audible alarm when tiny+ creature enters 20ft cube. Ritual."},
  "Grease":              {school:"Conjuration", castTime:"1 action", range:"60 ft", duration:"1 minute", desc:"Slick grease in 10ft square. DEX save or fall prone. Difficult terrain."},
  "Chromatic Orb":       {school:"Evocation", castTime:"1 action", range:"90 ft", duration:"Instantaneous", desc:"4\" sphere of energy: choose acid/cold/fire/lightning/poison/thunder. Ranged attack: 3d8 damage."},
  "Ice Knife":           {school:"Conjuration", castTime:"1 action", range:"60 ft", duration:"Instantaneous", desc:"Ranged attack: d10 piercing. Miss or hit: shards explode 5ft, DEX save or 2d6 cold."},
  "Catapult":            {school:"Transmutation", castTime:"1 action", range:"60 ft", duration:"Instantaneous", desc:"Launch a 1-5 lb object 90 ft. DEX save or 3d8 bludgeoning damage."},
  "Absorb Elements":     {school:"Abjuration", castTime:"1 reaction", range:"Self", duration:"1 round", desc:"Resistance to triggering damage type. Next melee hit deals +1d6 of that type."},
  "Hunter's Mark":       {school:"Divination", castTime:"1 bonus action", range:"90 ft", duration:"Concentration, 1 hour", desc:"Mark a creature. Deal +d6 damage to it on weapon hits. Advantage on Perception/Survival to track."},
  "Ensnaring Strike":    {school:"Conjuration", castTime:"1 bonus action", range:"Self", duration:"Concentration, 1 min", desc:"Next hit: STR save or restrained by vines. Repeating save each turn. d6 piercing if restrained."},
  "Hail of Thorns":      {school:"Conjuration", castTime:"1 bonus action", range:"Self", duration:"Concentration, 1 min", desc:"Next ranged hit: d10 piercing burst, 5ft radius DEX save or d10 piercing to others."},
  "Animal Friendship":   {school:"Enchantment", castTime:"1 action", range:"30 ft", duration:"24 hours", desc:"WIS save (DC varies by INT) or beast is charmed by you for 24 hours."},
  "Speak with Animals":  {school:"Divination", castTime:"1 action", range:"Self", duration:"10 minutes", desc:"Comprehend and verbally communicate with beasts. They share knowledge of nearby locations. Ritual."},
  "Compelled Duel":      {school:"Enchantment", castTime:"1 bonus action", range:"30 ft", duration:"Concentration, 1 min", desc:"WIS save or target is drawn to fight only you. Disadvantage attacking others. DEX save to move away."},
  "Divine Favor":        {school:"Evocation", castTime:"1 bonus action", range:"Self", duration:"Concentration, 1 min", desc:"Weapon attacks deal extra d4 radiant damage."},
  "Heroism":             {school:"Enchantment", castTime:"1 action", range:"Touch", duration:"Concentration, 1 min", desc:"Immune to frightened. Gain temp HP equal to spellcasting mod at start of each turn."},
  "Searing Smite":       {school:"Evocation", castTime:"1 bonus action", range:"Self", duration:"Concentration, 1 min", desc:"Next hit: +d6 fire damage. Target ignites: d4 fire each turn until action to extinguish."},
  "Thunderous Smite":    {school:"Evocation", castTime:"1 bonus action", range:"Self", duration:"Concentration, 1 min", desc:"Next hit: +2d6 thunder, STR save or 10ft push and knocked prone. Audible 300ft."},
  "Wrathful Smite":      {school:"Evocation", castTime:"1 bonus action", range:"Self", duration:"Concentration, 1 min", desc:"Next hit: +d6 psychic, WIS save or frightened until sees you succeed a save."},
  "Protection from Evil and Good":{school:"Abjuration", castTime:"1 action", range:"Touch", duration:"Concentration, 10 min", desc:"Protection vs aberrations, celestials, elementals, fey, fiends, undead: no charm/fright/possession, attacks have disadvantage."},
  "Purify Food and Drink":{school:"Transmutation", castTime:"1 action", range:"10 ft", duration:"Instantaneous", desc:"Remove poison and disease from food and drink in 5ft sphere. Ritual."},
  "Create or Destroy Water":{school:"Transmutation", castTime:"1 action", range:"30 ft", duration:"Instantaneous", desc:"Create 10 gallons of clean water in a container, or destroy water in a 30ft cube."},
  "Detect Evil and Good":{school:"Divination", castTime:"1 action", range:"Self", duration:"Concentration, 10 min", desc:"Know if aberration/celestial/elemental/fey/fiend/undead is within 30ft and its location."},
  "Detect Poison and Disease":{school:"Divination", castTime:"1 action", range:"Self", duration:"Concentration, 10 min", desc:"Sense presence and location of poison/disease/poisonous creature within 30ft. Ritual."},
  "Earth Tremor":        {school:"Evocation", castTime:"1 action", range:"10 ft", duration:"Instantaneous", desc:"DEX save or d6 bludgeoning + fall prone. Ground in area becomes difficult terrain."},
  "Dissonant Whispers":  {school:"Enchantment", castTime:"1 action", range:"60 ft", duration:"Instantaneous", desc:"WIS save or 3d6 psychic + use reaction to flee. Half damage, no fleeing on save."},
  "Illusory Script":     {school:"Illusion", castTime:"1 minute", range:"Touch", duration:"10 days", desc:"Write secret message. Others see unintelligible script or a decoy message. Ritual."},

  // 2nd Level Spells
  "Hold Person":         {school:"Enchantment", castTime:"1 action", range:"60 feet", duration:"Concentration, up to 1 minute", desc:"Choose a humanoid that you can see within range. The target must succeed on a Wisdom saving throw or be paralyzed for the duration. At the end of each of its turns, the target can make another Wisdom saving throw. On a success, the spell ends on the target. At Higher Levels: When you cast this spell using a spell slot of 3rd level or higher, you can target one additional humanoid for each slot level above 2nd."},
  "Misty Step":          {school:"Conjuration", castTime:"1 bonus action", range:"Self", duration:"Instantaneous", desc:"Briefly surrounded by silvery mist, you teleport up to 30 feet to an unoccupied space that you can see."},

  // 3rd Level Spells
  "Counterspell":        {school:"Abjuration", castTime:"1 reaction", range:"60 feet", duration:"Instantaneous", desc:"You attempt to interrupt a creature in the process of casting a spell. If the creature is casting a spell of 3rd level or lower, its spell fails and has no effect. If it is casting a spell of 4th level or higher, make an ability check using your spellcasting ability. The DC equals 10 + the spell's level. On a success, the creature's spell fails and has no effect. At Higher Levels: When you cast this spell using a spell slot of 4th level or higher, the interrupted spell has no effect if its level is equal to or less than the level of the spell slot you used."},
  "Lightning Bolt":      {school:"Evocation", castTime:"1 action", range:"Self (100-foot line)", duration:"Instantaneous", desc:"A stroke of lightning forming a line 100 feet long and 5 feet wide blasts out from you in a direction you choose. Each creature in the line must make a Dexterity saving throw. A creature takes 8d6 lightning damage on a failed save, or half as much on a successful one. At Higher Levels: When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd."},
  "Revivify":            {school:"Necromancy", castTime:"1 action", range:"Touch", duration:"Instantaneous", desc:"You touch a creature that has died within the last minute. That creature returns to life with 1 hit point. This spell can't return to life a creature that has died of old age, nor can it restore any missing body parts."},

  // 4th Level Spells
  "Polymorph":           {school:"Transmutation", castTime:"1 action", range:"60 feet", duration:"Concentration, up to 1 hour", desc:"This spell transforms a creature that you can see within range into a new form. An unwilling creature must make a Wisdom saving throw to avoid the effect. The transformation lasts for the duration, or until the target drops to 0 hit points or dies. The new form can be any beast whose challenge rating is equal to or less than the target's (or the target's level, if it doesn't have a challenge rating). The target's game statistics are replaced by the statistics of the chosen beast. The target assumes the hit points of its new form. When it reverts, the creature returns to the number of hit points it had before it transformed."},
};

// ── ITEM CATEGORIES (for equipment dropdowns) ──
DND_DATA.itemCategories = {
  "Any musical instrument": [
    "Bagpipes","Drum","Dulcimer","Flute","Lute","Lyre","Horn","Pan flute","Shawm","Viol"
  ],
  "Any artisan's tools": [
    "Alchemist's supplies","Brewer's supplies","Calligrapher's supplies",
    "Carpenter's tools","Cartographer's tools","Cobbler's tools","Cook's utensils",
    "Glassblower's tools","Jeweler's tools","Leatherworker's tools","Mason's tools",
    "Painter's supplies","Potter's tools","Smith's tools","Tinker's tools",
    "Weaver's tools","Woodcarver's tools"
  ],
  "Any gaming set": ["Dice set","Dragonchess set","Playing card set","Three-dragon ante set"],
  "Any simple melee weapon": null,
  "Any martial melee weapon": null,
  "Any simple weapon": null,
  "Any martial weapon": null,
  "Any weapon": null,
  "Any arcane focus": ["Crystal","Orb","Rod","Staff","Wand"],
  "Any druidic focus": ["Sprig of mistletoe","Totem","Wooden staff","Yew wand"],
  "Any holy symbol": ["Amulet","Emblem","Reliquary"],
  "Any musical instrument (one of your choice)": null,
};
// Merge weapon categories into itemCategories
if(DND_DATA.weaponCategories){
  Object.keys(DND_DATA.weaponCategories).forEach(k=>{
    DND_DATA.itemCategories[k] = DND_DATA.weaponCategories[k];
  });
}

// ── LEVEL UP DATA ──
// ══════════════════════════════════════════════════════
// XP THRESHOLDS (index = level - 1)
// ══════════════════════════════════════════════════════
DND_DATA.xpThresholds = [
  0,300,900,2700,6500,14000,23000,34000,
  48000,64000,85000,100000,120000,140000,
  165000,195000,225000,265000,305000,355000
];

// ══════════════════════════════════════════════════════
// SPELL SLOTS — extended to level 20
// index = level-1, array = [1st,2nd,3rd,4th,5th,6th,7th,8th,9th]
// ══════════════════════════════════════════════════════
DND_DATA.spellSlots = {
  // Full casters
  bard:     [
    [2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],
    [4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],
    [4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1,1],
    [4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]
  ],
  cleric:   [
    [2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],
    [4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],
    [4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1,1],
    [4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]
  ],
  druid:    [
    [2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],
    [4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],
    [4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1,1],
    [4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]
  ],
  sorcerer: [
    [2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],
    [4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],
    [4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1,1],
    [4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]
  ],
  wizard:   [
    [2],[3],[4,2],[4,3],[4,3,2],[4,3,3],[4,3,3,1],[4,3,3,2],[4,3,3,3,1],[4,3,3,3,2],
    [4,3,3,3,2,1],[4,3,3,3,2,1],[4,3,3,3,2,1,1],[4,3,3,3,2,1,1],
    [4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1],[4,3,3,3,2,1,1,1,1],
    [4,3,3,3,3,1,1,1,1],[4,3,3,3,3,2,1,1,1],[4,3,3,3,3,2,2,1,1]
  ],
  // Half casters (first spell slot at level 2 for paladin/ranger)
  paladin:  [
    null,[2],[3],[3],[4,2],[4,2],[4,3],[4,3],[4,3,2],[4,3,2],
    [4,3,3],[4,3,3],[4,3,3,1],[4,3,3,1],[4,3,3,2],[4,3,3,2],
    [4,3,3,3,1],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2]
  ],
  ranger:   [
    null,[2],[3],[3],[4,2],[4,2],[4,3],[4,3],[4,3,2],[4,3,2],
    [4,3,3],[4,3,3],[4,3,3,1],[4,3,3,1],[4,3,3,2],[4,3,3,2],
    [4,3,3,3,1],[4,3,3,3,1],[4,3,3,3,2],[4,3,3,3,2]
  ],
  // Pact Magic — [slots, slot_level] per level
  warlock: [
    [1,1],[2,1],[2,2],[2,2],[3,3],[3,3],[4,4],[4,4],[5,5],[5,5],
    [3,5],[3,5],[3,5],[3,5],[3,5],[3,5],[4,5],[4,5],[4,5],[4,5]
  ]
};

// ══════════════════════════════════════════════════════
// LEVEL FEATURES — levels 2-20 for all classes
// Level 1 features live in DND_DATA.classes[cls].features
// isASI: true = Ability Score Improvement at this level
// ══════════════════════════════════════════════════════
DND_DATA.levelFeatures = {

  // ── BARBARIAN ──────────────────────────────────────
  barbarian: {
    2:  [{name:"Reckless Attack",desc:"When you make your first attack on your turn, you can attack recklessly — advantage on melee weapon attack rolls using STR, but attack rolls against you have advantage until your next turn."},
         {name:"Danger Sense",desc:"Advantage on DEX saving throws against effects you can see (e.g. traps, spells). Not while blinded, deafened, or incapacitated."}],
    3:  [{name:"Primal Path",desc:"Choose your Primal Path: Path of the Berserker, Path of the Totem Warrior, or another. Your path grants additional features at levels 3, 6, 10, and 14."},
         {name:"Rage (3/day)",desc:"Rage uses increase to 3 per long rest."}],
    4:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each. Cannot exceed 20."}],
    5:  [{name:"Extra Attack",desc:"You can attack twice, instead of once, whenever you take the Attack action on your turn."},
         {name:"Fast Movement",desc:"Your speed increases by 10 ft while you aren't wearing heavy armor."}],
    6:  [{name:"Primal Path Feature",desc:"You gain a feature from your chosen Primal Path."},
         {name:"Rage (4/day)",desc:"Rage uses increase to 4 per long rest."}],
    7:  [{name:"Feral Instinct",desc:"Advantage on initiative rolls. If surprised at the start of combat, you can act normally if you enter your rage before doing anything else."}],
    8:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    9:  [{name:"Brutal Critical (1 die)",desc:"On a critical hit with a melee weapon, roll one additional weapon damage die."},
         {name:"Rage Damage +3",desc:"Bonus damage while raging increases to +3."}],
    10: [{name:"Primal Path Feature",desc:"You gain a feature from your chosen Primal Path."}],
    11: [{name:"Relentless Rage",desc:"If you drop to 0 HP while raging and don't die outright, make a DC 10 CON save. On success, drop to 1 HP. The DC increases by 5 each time you use this until you finish a short or long rest."}],
    12: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Rage (5/day)",desc:"Rage uses increase to 5 per long rest."}],
    13: [{name:"Brutal Critical (2 dice)",desc:"On a critical hit with a melee weapon, roll two additional weapon damage dice."}],
    14: [{name:"Primal Path Feature",desc:"You gain a feature from your chosen Primal Path."}],
    15: [{name:"Persistent Rage",desc:"Your rage ends early only if you fall unconscious or choose to end it. It no longer ends from not attacking or taking damage."}],
    16: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Rage Damage +4",desc:"Bonus damage while raging increases to +4."}],
    17: [{name:"Brutal Critical (3 dice)",desc:"On a critical hit with a melee weapon, roll three additional weapon damage dice."},
         {name:"Rage (6/day)",desc:"Rage uses increase to 6 per long rest."}],
    18: [{name:"Indomitable Might",desc:"If your total for a STR check is less than your STR score, you can use that score in place of the total."}],
    19: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    20: [{name:"Primal Champion",desc:"Your STR and CON scores each increase by 4. Their maximum is also now 24."},
         {name:"Unlimited Rages",desc:"You can rage an unlimited number of times per long rest."}]
  },

  // ── BARD ───────────────────────────────────────────
  bard: {
    2:  [{name:"Jack of All Trades",desc:"Add half your proficiency bonus (rounded down) to any ability check that doesn't already include your proficiency bonus."},
         {name:"Song of Rest (d6)",desc:"If you or any friendly creatures who can hear your performance regain HP at the end of a short rest, each regains an extra d6 HP."}],
    3:  [{name:"Bard College",desc:"Choose a Bard College: College of Lore, College of Valor, or another. Grants features at levels 3, 6, and 14."},
         {name:"Expertise",desc:"Choose 2 proficient skills. Your proficiency bonus is doubled for ability checks using those skills."}],
    4:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    5:  [{name:"Bardic Inspiration (d8)",desc:"Your Bardic Inspiration die increases from d6 to d8."},
         {name:"Font of Inspiration",desc:"You regain all uses of Bardic Inspiration on a short or long rest (previously only long rest)."}],
    6:  [{name:"Countercharm",desc:"As an action, start a performance. Friendly creatures within 30 ft have advantage on saving throws against being frightened or charmed as long as you maintain it."},
         {name:"Bard College Feature",desc:"You gain a feature from your Bard College."}],
    7:  [{name:"Spell Progression",desc:"Your spell slots and known spells increase. See your character sheet for current spell progression."}],
    8:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    9:  [{name:"Song of Rest (d8)",desc:"Your Song of Rest die increases from d6 to d8."}],
    10: [{name:"Bardic Inspiration (d10)",desc:"Your Bardic Inspiration die increases from d8 to d10."},
         {name:"Expertise (2 more)",desc:"Choose 2 more proficient skills. Your proficiency bonus is doubled for ability checks using those skills."},
         {name:"Magical Secrets",desc:"Choose 2 spells from any class's spell list. They count as bard spells for you."}],
    11: [{name:"Spell Progression",desc:"Your spell slots and known spells increase (6th-level spell slots unlocked)."}],
    12: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    13: [{name:"Song of Rest (d10)",desc:"Your Song of Rest die increases from d8 to d10."}],
    14: [{name:"Magical Secrets",desc:"Choose 2 more spells from any class's spell list."},
         {name:"Bard College Feature",desc:"You gain a feature from your Bard College."}],
    15: [{name:"Bardic Inspiration (d12)",desc:"Your Bardic Inspiration die increases from d10 to d12."}],
    16: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    17: [{name:"Song of Rest (d12)",desc:"Your Song of Rest die increases from d10 to d12."}],
    18: [{name:"Magical Secrets",desc:"Choose 2 more spells from any class's spell list."}],
    19: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    20: [{name:"Superior Inspiration",desc:"When you roll initiative and have no uses of Bardic Inspiration left, you regain one use."}]
  },

  // ── CLERIC ─────────────────────────────────────────
  cleric: {
    2:  [{name:"Channel Divinity (1/rest)",desc:"You gain the ability to channel divine energy. You have 1 use per short or long rest. You also gain the Turn Undead option and a second Channel Divinity option from your domain."},
         {name:"Divine Domain Feature",desc:"Your chosen Divine Domain grants you an additional feature."}],
    3:  [{name:"Spell Progression",desc:"Your spell slots increase. See your character sheet for current spell progression."}],
    4:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    5:  [{name:"Destroy Undead (CR 1/2)",desc:"When an undead fails its saving throw against your Turn Undead, it is instantly destroyed if its CR is 1/2 or lower."}],
    6:  [{name:"Channel Divinity (2/rest)",desc:"You can now use Channel Divinity twice between rests."},
         {name:"Divine Domain Feature",desc:"Your chosen Divine Domain grants an additional feature."}],
    7:  [{name:"Spell Progression",desc:"Your spell slots increase (4th-level slots unlocked)."}],
    8:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Destroy Undead (CR 1)",desc:"Your Destroy Undead threshold increases to CR 1."},
         {name:"Divine Domain Feature",desc:"Your chosen Divine Domain grants an additional feature."}],
    9:  [{name:"Spell Progression",desc:"Your spell slots increase (5th-level slots unlocked)."}],
    10: [{name:"Divine Intervention",desc:"You can call on your deity for aid. Roll d100. If you roll equal to or lower than your Cleric level, your deity intervenes. Once successful, can't be used again for 7 days."}],
    11: [{name:"Destroy Undead (CR 2)",desc:"Your Destroy Undead threshold increases to CR 2."}],
    12: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    13: [{name:"Spell Progression",desc:"Your spell slots increase (7th-level slots unlocked)."}],
    14: [{name:"Destroy Undead (CR 3)",desc:"Your Destroy Undead threshold increases to CR 3."}],
    15: [{name:"Spell Progression",desc:"Your spell slots increase (8th-level slots unlocked)."}],
    16: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    17: [{name:"Destroy Undead (CR 4)",desc:"Your Destroy Undead threshold increases to CR 4."},
         {name:"Divine Domain Feature",desc:"Your chosen Divine Domain grants an additional feature."}],
    18: [{name:"Channel Divinity (3/rest)",desc:"You can now use Channel Divinity three times between rests."}],
    19: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    20: [{name:"Divine Intervention (Improved)",desc:"Your Divine Intervention call automatically succeeds without rolling. After you use it, you can't use it again for 7 days."}]
  },

  // ── DRUID ──────────────────────────────────────────
  druid: {
    2:  [{name:"Wild Shape (CR 1/4)",desc:"Use your action to transform into a beast with CR 1/4 or lower (no fly or swim speed). You can use this twice per short rest. Lasts up to 1 hour or half your druid level."},
         {name:"Druid Circle",desc:"Choose a Druid Circle: Circle of the Land, Circle of the Moon, or another. Grants features at levels 2, 6, 10, and 14."}],
    3:  [{name:"Spell Progression",desc:"Your spell slots increase (2nd-level slots unlocked)."}],
    4:  [{name:"Wild Shape (CR 1/2)",desc:"You can now assume beast shapes with CR 1/2 or lower (still no fly speed)."},
         {name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    5:  [{name:"Spell Progression",desc:"Your spell slots increase (3rd-level slots unlocked)."}],
    6:  [{name:"Druid Circle Feature",desc:"Your Druid Circle grants an additional feature."}],
    7:  [{name:"Spell Progression",desc:"Your spell slots increase (4th-level slots unlocked)."}],
    8:  [{name:"Wild Shape (CR 1)",desc:"You can now assume beast shapes with CR 1 or lower, as well as creatures with a swim speed."},
         {name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    9:  [{name:"Spell Progression",desc:"Your spell slots increase (5th-level slots unlocked)."}],
    10: [{name:"Druid Circle Feature",desc:"Your Druid Circle grants an additional feature."}],
    11: [{name:"Spell Progression",desc:"Your spell slots increase (6th-level slots unlocked)."}],
    12: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    13: [{name:"Spell Progression",desc:"Your spell slots increase (7th-level slots unlocked)."}],
    14: [{name:"Druid Circle Feature",desc:"Your Druid Circle grants an additional feature."}],
    15: [{name:"Spell Progression",desc:"Your spell slots increase (8th-level slots unlocked)."}],
    16: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    17: [{name:"Spell Progression",desc:"Your spell slots increase (9th-level slots unlocked)."}],
    18: [{name:"Timeless Body",desc:"The primal magic you wield causes you to age more slowly. For every 10 years that pass, your body ages only 1 year."},
         {name:"Beast Spells",desc:"You can cast many of your druid spells in any shape you assume using Wild Shape. You perform the somatic and verbal components in beast form."}],
    19: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    20: [{name:"Archdruid",desc:"You can use Wild Shape an unlimited number of times. Additionally, ignore verbal and somatic spell components while transformed, and maintain concentration on Wild Shape through damage more easily."}]
  },

  // ── FIGHTER ────────────────────────────────────────
  fighter: {
    2:  [{name:"Action Surge (1/rest)",desc:"On your turn, take one additional action. Once per short or long rest."}],
    3:  [{name:"Martial Archetype",desc:"Choose a Martial Archetype: Champion, Battle Master, Eldritch Knight, or another. Grants features at levels 3, 7, 10, 15, and 18."}],
    4:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    5:  [{name:"Extra Attack",desc:"You can attack twice whenever you take the Attack action."}],
    6:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    7:  [{name:"Martial Archetype Feature",desc:"Your Martial Archetype grants an additional feature."}],
    8:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    9:  [{name:"Indomitable (1/long rest)",desc:"Reroll a saving throw that you fail. You must use the new roll. Once per long rest."}],
    10: [{name:"Martial Archetype Feature",desc:"Your Martial Archetype grants an additional feature."}],
    11: [{name:"Extra Attack (2)",desc:"You can now attack three times whenever you take the Attack action."}],
    12: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    13: [{name:"Indomitable (2/long rest)",desc:"You can now use Indomitable twice between long rests."}],
    14: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    15: [{name:"Martial Archetype Feature",desc:"Your Martial Archetype grants an additional feature."}],
    16: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    17: [{name:"Action Surge (2/rest)",desc:"You can now use Action Surge twice between short rests (but not twice in the same turn)."},
         {name:"Indomitable (3/long rest)",desc:"You can now use Indomitable three times between long rests."}],
    18: [{name:"Martial Archetype Feature",desc:"Your Martial Archetype grants an additional feature."}],
    19: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    20: [{name:"Extra Attack (3)",desc:"You can now attack four times whenever you take the Attack action."}]
  },

  // ── MONK ───────────────────────────────────────────
  monk: {
    2:  [{name:"Ki (2 points)",desc:"Gain 2 ki points (equals monk level). Spend to fuel Flurry of Blows (1 ki: 2 bonus unarmed strikes), Patient Defense (1 ki: Dodge as bonus action), or Step of the Wind (1 ki: Dash or Disengage as bonus action). Recharge on short rest."},
         {name:"Unarmored Movement (+10 ft)",desc:"Your speed increases by 10 ft while not wearing armor or wielding a shield."}],
    3:  [{name:"Monastic Tradition",desc:"Choose a Monastic Tradition: Way of the Open Hand, Way of Shadow, Way of the Four Elements, or another. Grants features at levels 3, 6, 11, and 17."},
         {name:"Deflect Missiles",desc:"Use your reaction when hit by a ranged weapon attack to reduce damage by d10 + DEX mod + Monk level. If reduced to 0, catch and throw it as a ranged attack (1 ki)."}],
    4:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Slow Fall",desc:"Reaction: reduce falling damage by 5 × monk level."}],
    5:  [{name:"Extra Attack",desc:"You can attack twice whenever you take the Attack action."},
         {name:"Stunning Strike",desc:"When you hit with a melee weapon attack, spend 1 ki to stun the target. CON save vs your ki save DC. On fail: stunned until end of your next turn (attacks vs it have advantage, it fails DEX/STR saves)."},
         {name:"Martial Arts (d6)",desc:"Your Martial Arts die increases to d6."}],
    6:  [{name:"Ki-Empowered Strikes",desc:"Your unarmed strikes count as magical for the purpose of overcoming resistance and immunity."},
         {name:"Monastic Tradition Feature",desc:"Your Monastic Tradition grants an additional feature."},
         {name:"Unarmored Movement (+15 ft)",desc:"Your speed bonus increases to +15 ft."}],
    7:  [{name:"Evasion",desc:"When subjected to an effect that allows a DEX save for half damage, you take no damage on a success, and only half on a failure."},
         {name:"Stillness of Mind",desc:"Use your action to end one effect on yourself that is causing you to be charmed or frightened."}],
    8:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    9:  [{name:"Unarmored Movement (wall/ceiling)",desc:"You gain the ability to move along vertical surfaces and across liquids on your turn without falling during the move."}],
    10: [{name:"Purity of Body",desc:"Your mastery of ki grants immunity to disease and poison."},
         {name:"Unarmored Movement (+20 ft)",desc:"Your speed bonus increases to +20 ft."}],
    11: [{name:"Monastic Tradition Feature",desc:"Your Monastic Tradition grants an additional feature."},
         {name:"Martial Arts (d8)",desc:"Your Martial Arts die increases to d8."}],
    12: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    13: [{name:"Tongue of the Sun and Moon",desc:"You learn to touch the ki of other minds, allowing you to understand all spoken languages and be understood by any creature that understands language."}],
    14: [{name:"Diamond Soul",desc:"Proficiency in all saving throws. Additionally, when you fail a saving throw, spend 1 ki to reroll and take the new result."}],
    15: [{name:"Timeless Body",desc:"Your ki sustains you so you suffer none of the frailty of old age, and you cannot be aged magically. You still die normally."},
         {name:"Unarmored Movement (+25 ft)",desc:"Your speed bonus increases to +25 ft."}],
    16: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    17: [{name:"Monastic Tradition Feature",desc:"Your Monastic Tradition grants an additional feature."},
         {name:"Martial Arts (d10)",desc:"Your Martial Arts die increases to d10."}],
    18: [{name:"Empty Body",desc:"Spend 4 ki: become invisible for 1 minute, resist all damage except force. Spend 8 ki: cast Astral Projection without material components for yourself."},
         {name:"Unarmored Movement (+30 ft)",desc:"Your speed bonus increases to +30 ft."}],
    19: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    20: [{name:"Perfect Self",desc:"When you roll initiative and have no ki points remaining, you regain 4 ki points."}]
  },

  // ── PALADIN ────────────────────────────────────────
  paladin: {
    2:  [{name:"Fighting Style",desc:"Choose a fighting style: Defense (+1 AC in armor), Dueling (+2 damage with one-handed weapon), Great Weapon Fighting (reroll 1s and 2s on two-handed weapon damage), or Protection (use reaction to impose disadvantage on attacker of ally)."},
         {name:"Spellcasting",desc:"You are a half-caster. Use CHA for spellcasting. You prepare paladin spells (CHA mod + half paladin level, rounded down). You also always have your Sacred Oath spells prepared."},
         {name:"Divine Smite",desc:"When you hit with a melee weapon attack, expend a spell slot to deal extra radiant damage: 2d8 for a 1st-level slot, plus 1d8 for each slot level above 1st (max 5d8). The damage increases by 1d8 if the target is an undead or a fiend."}],
    3:  [{name:"Divine Health",desc:"The divine magic flowing through you makes you immune to disease."},
         {name:"Sacred Oath",desc:"Swear an oath: Oath of Devotion, Oath of the Ancients, Oath of Vengeance, or another. Grants Oath spells, Channel Divinity options, and features at levels 3, 7, 15, and 20."}],
    4:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    5:  [{name:"Extra Attack",desc:"You can attack twice whenever you take the Attack action."}],
    6:  [{name:"Aura of Protection",desc:"While conscious, you and friendly creatures within 10 ft add your CHA modifier (minimum +1) to all saving throws."}],
    7:  [{name:"Sacred Oath Feature",desc:"Your Sacred Oath grants an additional feature."}],
    8:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    9:  [{name:"Spell Progression",desc:"Your spell slots increase (3rd-level paladin spells unlocked)."}],
    10: [{name:"Aura of Courage",desc:"While conscious, you and friendly creatures within 10 ft can't be frightened."}],
    11: [{name:"Improved Divine Smite",desc:"Whenever you hit a creature with a melee weapon, you deal an extra 1d8 radiant damage (in addition to any Divine Smite you might add)."}],
    12: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    13: [{name:"Spell Progression",desc:"Your spell slots increase (4th-level paladin spells unlocked)."}],
    14: [{name:"Cleansing Touch",desc:"Use your action to end one spell on yourself or a willing creature you touch. Uses = CHA modifier (min 1) per long rest."}],
    15: [{name:"Sacred Oath Feature",desc:"Your Sacred Oath grants an additional feature."}],
    16: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    17: [{name:"Spell Progression",desc:"Your spell slots increase (5th-level paladin spells unlocked)."}],
    18: [{name:"Aura Improvements",desc:"The range of your Aura of Protection and Aura of Courage increases to 30 ft."}],
    19: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    20: [{name:"Sacred Oath Capstone",desc:"You gain the capstone feature of your Sacred Oath, a powerful ability that defines the pinnacle of your paladin's power."}]
  },

  // ── RANGER ─────────────────────────────────────────
  ranger: {
    2:  [{name:"Fighting Style",desc:"Choose a fighting style: Archery (+2 ranged attack rolls), Defense (+1 AC in armor), Dueling (+2 damage with one-handed weapon), or Two-Weapon Fighting (add ability modifier to off-hand attacks)."},
         {name:"Spellcasting",desc:"You gain spellcasting. WIS-based. You know spells rather than preparing them. Your spell slots update with your level."}],
    3:  [{name:"Ranger Archetype",desc:"Choose a Ranger Archetype: Hunter, Beast Master, or another. Grants features at levels 3, 7, 11, and 15."},
         {name:"Primeval Awareness",desc:"Expend a spell slot to sense for 1 minute per slot level whether aberrations, celestials, dragons, elementals, fey, fiends, or undead are present within 1 mile (6 miles in natural terrain)."}],
    4:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    5:  [{name:"Extra Attack",desc:"You can attack twice whenever you take the Attack action."}],
    6:  [{name:"Favored Enemy (2nd type)",desc:"Choose a second favored enemy type. Also learn one more language associated with your original or new favored enemy."},
         {name:"Natural Explorer (2nd terrain)",desc:"Choose a second favored terrain type."}],
    7:  [{name:"Ranger Archetype Feature",desc:"Your Ranger Archetype grants an additional feature."}],
    8:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Land's Stride",desc:"Moving through nonmagical difficult terrain costs no extra movement. Advantage on saves against magically created plants. No damage from nonmagical plant hazards."}],
    9:  [{name:"Spell Progression",desc:"Your spell slots increase (2nd-level ranger spells unlocked)."}],
    10: [{name:"Natural Explorer (3rd terrain)",desc:"Choose a third favored terrain type."},
         {name:"Hide in Plain Sight",desc:"Spend 1 minute creating camouflage: +10 to Stealth checks while motionless in natural environments."}],
    11: [{name:"Ranger Archetype Feature",desc:"Your Ranger Archetype grants an additional feature."}],
    12: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    13: [{name:"Spell Progression",desc:"Your spell slots increase (3rd-level ranger spells unlocked)."}],
    14: [{name:"Favored Enemy (3rd type)",desc:"Choose a third favored enemy type."},
         {name:"Vanish",desc:"Use the Hide action as a bonus action. Also, you can't be tracked by nonmagical means unless you choose to leave a trail."}],
    15: [{name:"Ranger Archetype Feature",desc:"Your Ranger Archetype grants an additional feature."}],
    16: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    17: [{name:"Spell Progression",desc:"Your spell slots increase (4th-level ranger spells unlocked)."}],
    18: [{name:"Feral Senses",desc:"Gain preternatural senses. When attacking a creature you can't see, your inability to see doesn't impose disadvantage. You're also aware of any invisible creature within 30 ft."}],
    19: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    20: [{name:"Foe Slayer",desc:"Once on each of your turns, add your WIS modifier to an attack roll or damage roll against one of your favored enemies. You can use this before or after rolling."}]
  },

  // ── ROGUE ──────────────────────────────────────────
  rogue: {
    2:  [{name:"Cunning Action",desc:"You can take the Dash, Disengage, or Hide action as a bonus action on each of your turns."}],
    3:  [{name:"Roguish Archetype",desc:"Choose a Roguish Archetype: Thief, Assassin, Arcane Trickster, or another. Grants features at levels 3, 9, 13, and 17."},
         {name:"Sneak Attack (2d6)",desc:"Sneak Attack damage increases to 2d6."}],
    4:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    5:  [{name:"Uncanny Dodge",desc:"When an attacker you can see hits you with an attack, use your reaction to halve the attack's damage against you."},
         {name:"Sneak Attack (3d6)",desc:"Sneak Attack damage increases to 3d6."}],
    6:  [{name:"Expertise (2 more)",desc:"Choose 2 more proficient skills to double your proficiency bonus on."},
         {name:"Sneak Attack (3d6)",desc:"Sneak Attack damage remains 3d6 until level 7."}],
    7:  [{name:"Evasion",desc:"When subjected to an effect that allows a DEX save for half damage, you take no damage on success, and only half on a failure."},
         {name:"Sneak Attack (4d6)",desc:"Sneak Attack damage increases to 4d6."}],
    8:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Sneak Attack (4d6)",desc:"Sneak Attack damage remains 4d6."}],
    9:  [{name:"Roguish Archetype Feature",desc:"Your Roguish Archetype grants an additional feature."},
         {name:"Sneak Attack (5d6)",desc:"Sneak Attack damage increases to 5d6."}],
    10: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Sneak Attack (5d6)",desc:"Sneak Attack damage remains 5d6."}],
    11: [{name:"Reliable Talent",desc:"When you make an ability check using a skill you're proficient in, treat any d20 result of 9 or lower as a 10."},
         {name:"Sneak Attack (6d6)",desc:"Sneak Attack damage increases to 6d6."}],
    12: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Sneak Attack (6d6)",desc:"Sneak Attack damage remains 6d6."}],
    13: [{name:"Roguish Archetype Feature",desc:"Your Roguish Archetype grants an additional feature."},
         {name:"Sneak Attack (7d6)",desc:"Sneak Attack damage increases to 7d6."}],
    14: [{name:"Blindsense",desc:"If you are able to hear, you are aware of the location of any hidden or invisible creature within 10 ft of you."},
         {name:"Sneak Attack (7d6)",desc:"Sneak Attack damage remains 7d6."}],
    15: [{name:"Slippery Mind",desc:"You gain proficiency in WIS saving throws."},
         {name:"Sneak Attack (8d6)",desc:"Sneak Attack damage increases to 8d6."}],
    16: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Sneak Attack (8d6)",desc:"Sneak Attack damage remains 8d6."}],
    17: [{name:"Roguish Archetype Feature",desc:"Your Roguish Archetype grants an additional feature."},
         {name:"Sneak Attack (9d6)",desc:"Sneak Attack damage increases to 9d6."}],
    18: [{name:"Elusive",desc:"No attack roll has advantage against you while you aren't incapacitated."},
         {name:"Sneak Attack (9d6)",desc:"Sneak Attack damage remains 9d6."}],
    19: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Sneak Attack (10d6)",desc:"Sneak Attack damage increases to 10d6."}],
    20: [{name:"Stroke of Luck",desc:"If your attack misses a target within range, you can turn it into a hit. Alternatively, if you fail an ability check, treat the d20 roll as a 20. Once per short or long rest."},
         {name:"Sneak Attack (10d6)",desc:"Sneak Attack damage remains 10d6 at level 20."}]
  },

  // ── SORCERER ───────────────────────────────────────
  sorcerer: {
    2:  [{name:"Font of Magic",desc:"You gain 2 sorcery points (equals your sorcerer level). Use points to create spell slots (2=1st, 3=2nd, 5=3rd, 6=4th, 7=5th) or convert spell slots to sorcery points (slot level). Recharge on long rest."}],
    3:  [{name:"Metamagic (2 options)",desc:"Choose 2 Metamagic options: Careful Spell (protect allies in AoEs), Distant Spell (double range), Empowered Spell (reroll damage dice), Extended Spell (double duration), Heightened Spell (disadvantage on save), Quickened Spell (bonus action cast), Subtle Spell (no verbal/somatic), Twinned Spell (target two creatures)."},
         {name:"Sorcery Points (3)",desc:"Your sorcery point total increases to 3."}],
    4:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    5:  [{name:"Sorcery Points (5)",desc:"Your sorcery point total increases to 5."}],
    6:  [{name:"Sorcerous Origin Feature",desc:"Your Sorcerous Origin grants an additional feature."}],
    7:  [{name:"Sorcery Points (7)",desc:"Your sorcery point total increases to 7."}],
    8:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    9:  [{name:"Sorcery Points (9)",desc:"Your sorcery point total increases to 9."}],
    10: [{name:"Metamagic (3rd option)",desc:"Choose one additional Metamagic option."},
         {name:"Sorcery Points (10)",desc:"Your sorcery point total increases to 10."}],
    11: [{name:"Sorcery Points (11)",desc:"Your sorcery point total increases to 11."}],
    12: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    13: [{name:"Sorcery Points (13)",desc:"Your sorcery point total increases to 13."}],
    14: [{name:"Sorcerous Origin Feature",desc:"Your Sorcerous Origin grants an additional feature."}],
    15: [{name:"Sorcery Points (15)",desc:"Your sorcery point total increases to 15."}],
    16: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    17: [{name:"Metamagic (4th option)",desc:"Choose one additional Metamagic option."},
         {name:"Sorcery Points (17)",desc:"Your sorcery point total increases to 17."}],
    18: [{name:"Sorcerous Origin Feature",desc:"Your Sorcerous Origin grants an additional feature."},
         {name:"Sorcery Points (18)",desc:"Your sorcery point total increases to 18."}],
    19: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Sorcery Points (19)",desc:"Your sorcery point total increases to 19."}],
    20: [{name:"Sorcerous Restoration",desc:"Regain 4 expended sorcery points whenever you finish a short rest."},
         {name:"Sorcery Points (20)",desc:"Your sorcery point total increases to 20."}]
  },

  // ── WARLOCK ────────────────────────────────────────
  warlock: {
    2:  [{name:"Eldritch Invocations (2)",desc:"Choose 2 Eldritch Invocations to augment your magical powers. Examples: Agonizing Blast (+CHA to Eldritch Blast), Devil's Sight (darkvision 120ft in magical darkness), Mask of Many Faces (cast Disguise Self at will), Repelling Blast (push targets 10ft)."}],
    3:  [{name:"Pact Boon",desc:"Choose your Pact Boon: Pact of the Chain (find familiar), Pact of the Blade (create a magical weapon), or Pact of the Tome (Book of Shadows with 3 cantrips)."},
         {name:"Eldritch Invocations (3 total)",desc:"Choose one additional Eldritch Invocation (total 3). Your spell slots become 2nd level."}],
    4:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Eldritch Invocations (4 total)",desc:"Choose one additional Eldritch Invocation (total 4)."}],
    5:  [{name:"Eldritch Invocations (5 total)",desc:"Choose one additional Eldritch Invocation (total 5). Your spell slots become 3rd level."}],
    6:  [{name:"Otherworldly Patron Feature",desc:"Your Otherworldly Patron grants an additional feature."},
         {name:"Eldritch Invocations (6 total)",desc:"Choose one additional Eldritch Invocation (total 6)."}],
    7:  [{name:"Eldritch Invocations (7 total)",desc:"Choose one additional Eldritch Invocation (total 7). Your spell slots become 4th level."}],
    8:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Eldritch Invocations (8 total)",desc:"Choose one additional Eldritch Invocation (total 8)."}],
    9:  [{name:"Eldritch Invocations (9 total)",desc:"Choose one additional Eldritch Invocation (total 9). Your spell slots become 5th level."}],
    10: [{name:"Otherworldly Patron Feature",desc:"Your Otherworldly Patron grants an additional feature."},
         {name:"Eldritch Invocations (10 total)",desc:"Choose one additional Eldritch Invocation (total 10)."}],
    11: [{name:"Mystic Arcanum (6th Level)",desc:"You can cast one 6th-level spell from your patron's list once per long rest without using a spell slot. Current 6th-level warlock spells include: Eyebite, Flesh to Stone, Scatter, Soul Cage."},
         {name:"Eldritch Invocations (11 total)",desc:"Choose one additional Eldritch Invocation (total 11)."}],
    12: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Eldritch Invocations (12 total)",desc:"Choose one additional Eldritch Invocation (total 12)."}],
    13: [{name:"Mystic Arcanum (7th Level)",desc:"You can cast one 7th-level spell from your patron's list once per long rest without using a spell slot. Examples: Etherealness, Finger of Death, Forcecage, Plane Shift."}],
    14: [{name:"Otherworldly Patron Feature",desc:"Your Otherworldly Patron grants an additional feature."},
         {name:"Eldritch Invocations (13 total)",desc:"Choose one additional Eldritch Invocation (total 13)."}],
    15: [{name:"Mystic Arcanum (8th Level)",desc:"You can cast one 8th-level spell from your patron's list once per long rest without using a spell slot. Examples: Demiplane, Dominate Monster, Feeblemind, Maddening Darkness."}],
    16: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Eldritch Invocations (14 total)",desc:"Choose one additional Eldritch Invocation (total 14)."}],
    17: [{name:"Mystic Arcanum (9th Level)",desc:"You can cast one 9th-level spell from your patron's list once per long rest without using a spell slot. Examples: Astral Projection, Foresight, True Polymorph, Weird."}],
    18: [{name:"Eldritch Invocations (15 total)",desc:"Choose one additional Eldritch Invocation (total 15)."}],
    19: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."},
         {name:"Eldritch Invocations (16 total)",desc:"Choose one additional Eldritch Invocation (total 16)."}],
    20: [{name:"Eldritch Master",desc:"You can entreat your patron for aid. Spend 1 minute entreating your patron to regain all expended spell slots from Pact Magic. Once per long rest."}]
  },

  // ── WIZARD ─────────────────────────────────────────
  wizard: {
    2:  [{name:"Arcane Tradition",desc:"Choose an Arcane Tradition: School of Evocation, School of Abjuration, School of Transmutation, School of Illusion, School of Enchantment, School of Divination, School of Conjuration, or School of Necromancy. Grants features at levels 2, 6, 10, and 14."}],
    3:  [{name:"Spell Progression",desc:"Your spell slots increase (2nd-level slots unlocked). Add 2 spells to your spellbook."}],
    4:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    5:  [{name:"Spell Progression",desc:"Your spell slots increase (3rd-level slots unlocked). Add 2 spells to your spellbook."}],
    6:  [{name:"Arcane Tradition Feature",desc:"Your Arcane Tradition grants an additional feature."}],
    7:  [{name:"Spell Progression",desc:"Your spell slots increase (4th-level slots unlocked). Add 2 spells to your spellbook."}],
    8:  [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    9:  [{name:"Spell Progression",desc:"Your spell slots increase (5th-level slots unlocked). Add 2 spells to your spellbook."}],
    10: [{name:"Arcane Tradition Feature",desc:"Your Arcane Tradition grants an additional feature."}],
    11: [{name:"Spell Progression",desc:"Your spell slots increase (6th-level slots unlocked). Add 2 spells to your spellbook."}],
    12: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    13: [{name:"Spell Progression",desc:"Your spell slots increase (7th-level slots unlocked). Add 2 spells to your spellbook."}],
    14: [{name:"Arcane Tradition Feature",desc:"Your Arcane Tradition grants an additional feature."}],
    15: [{name:"Spell Progression",desc:"Your spell slots increase (8th-level slots unlocked). Add 2 spells to your spellbook."}],
    16: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    17: [{name:"Spell Progression",desc:"Your spell slots increase (9th-level slots unlocked). Add 2 spells to your spellbook."}],
    18: [{name:"Spell Mastery",desc:"Choose one 1st-level and one 2nd-level wizard spell in your spellbook. You can cast each at their lowest level without expending a spell slot. To cast at a higher level, use a slot as normal."}],
    19: [{name:"Ability Score Improvement",isASI:true,desc:"Increase one ability score by 2, or two scores by 1 each."}],
    20: [{name:"Signature Spells",desc:"You gain mastery over two powerful spells. Choose two 3rd-level wizard spells in your spellbook. You always have them prepared and can cast each once per short rest at 3rd level without a spell slot."}]
  }

}; // end DND_DATA.levelFeatures

// ══════════════════════════════════════════════════════════════
// EXTENDED SPELL LISTS — levels 2 through 9
// These append to DND_DATA.spells[cls] which already has
// cantrips and level1 for each class.
// ══════════════════════════════════════════════════════════════

// ── WIZARD ──────────────────────────────────────────────────
DND_DATA.spells.wizard.level2 = [
  "Alter Self","Arcane Lock","Blindness/Deafness","Blur","Cloud of Daggers",
  "Crown of Madness","Darkness","Darkvision","Detect Thoughts","Enlarge/Reduce","Flaming Sphere","Gentle Repose","Hold Person","Invisibility",
  "Knock","Levitate","Locate Object","Magic Mouth","Melf's Acid Arrow",
  "Mirror Image","Misty Step","Nystul's Magic Aura","Phantasmal Force",
  "Ray of Enfeeblement","Rope Trick","Scorching Ray","See Invisibility","Shatter","Skywrite","Spider Climb","Suggestion","Web"
];
DND_DATA.spells.wizard.level3 = [
  "Animate Dead","Bestow Curse","Blink","Clairvoyance","Counterspell",
  "Dispel Magic","Fear","Feign Death","Fireball",
  "Fly","Gaseous Form","Glyph of Warding","Haste","Hypnotic Pattern","Leomund's Tiny Hut",
  "Lightning Bolt","Magic Circle","Major Image","Nondetection","Phantom Steed","Protection from Energy","Remove Curse","Sending",
  "Sleet Storm","Slow","Stinking Cloud","Summon Lesser Demons","Tongues","Vampiric Touch","Water Breathing"
];
DND_DATA.spells.wizard.level4 = [
  "Arcane Eye","Banishment","Black Tentacles","Blight","Charm Monster","Confusion",
  "Conjure Minor Elementals","Control Water","Dimension Door","Divination",
  "Elemental Bane","Fabricate","Fire Shield","Greater Invisibility","Hallucinatory Terrain",
  "Ice Storm","Leomund's Secret Chest","Locate Creature","Mordenkainen's Faithful Hound",
  "Mordenkainen's Private Sanctum","Otiluke's Resilient Sphere",
  "Phantasmal Killer","Polymorph","Sickening Radiance",
  "Stone Shape","Stoneskin","Storm Sphere","Summon Construct","Summon Elemental",
  "Summon Greater Demon","Vitriolic Sphere","Wall of Fire","Watery Sphere"
];
DND_DATA.spells.wizard.level5 = [
  "Animate Objects","Bigby's Hand","Cloudkill","Cone of Cold","Conjure Elemental",
  "Contact Other Plane","Contingency","Control Winds","Creation","Danse Macabre",
  "Dawn","Dominate Person","Dream","Far Step","Geas","Hold Monster",
  "Immolation","Infernal Calling","Legend Lore","Mislead","Modify Memory",
  "Negative Energy Flood","Passwall","Planar Binding","Rary's Telepathic Bond",
  "Scrying","Seeming","Skill Empowerment","Steel Wind Strike","Summon Draconic Spirit",
  "Synaptic Static","Telekinesis","Teleportation Circle","Wall of Force","Wall of Light",
  "Wall of Stone"
];
DND_DATA.spells.wizard.level6 = [
  "Arcane Gate","Chain Lightning","Circle of Death","Contingency","Create Undead",
  "Disintegrate","Drawmij's Instant Summons","Eyebite","Flesh to Stone",
  "Globe of Invulnerability","Guards and Wards","Investiture of Flame",
  "Investiture of Ice","Investiture of Stone","Investiture of Wind","Magic Jar",
  "Mass Suggestion","Mental Prison","Move Earth","Otiluke's Freezing Sphere",
  "Otto's Irresistible Dance","Programmed Illusion","Scatter","Soul Cage",
  "Summon Fiend","Sunbeam","Tenser's Transformation","True Seeing","Wall of Ice"
];
DND_DATA.spells.wizard.level7 = [
  "Crown of Stars","Delayed Blast Fireball","Divine Word","Etherealness",
  "Finger of Death","Fire Storm","Forcecage","Mirage Arcane","Mordenkainen's Magnificent Mansion",
  "Mordenkainen's Sword","Plane Shift","Power Word Pain","Prismatic Spray",
  "Project Image","Reverse Gravity","Sequester","Simulacrum","Symbol",
  "Teleport","Whirlwind"
];
DND_DATA.spells.wizard.level8 = [
  "Abi-Dalzim's Horrid Wilting","Antimagic Field","Antipathy/Sympathy",
  "Clone","Control Weather","Demiplane","Dominate Monster","Earthquake",
  "Feeblemind","Illusory Dragon","Incendiary Cloud","Maddening Darkness",
  "Maze","Mind Blank","Power Word Stun","Sunburst","Telepathy",
  "Tsunami"
];
DND_DATA.spells.wizard.level9 = [
  "Astral Projection","Blade of Disaster","Foresight","Gate","Imprisonment",
  "Mass Polymorph","Meteor Swarm","Power Word Kill","Prismatic Wall",
  "Psychic Scream","Shapechange","Time Stop","True Polymorph","Weird","Wish"
];

// ── SORCERER ────────────────────────────────────────────────
DND_DATA.spells.sorcerer.level2 = [
  "Blindness/Deafness","Blur","Cloud of Daggers","Crown of Madness","Darkness",
  "Darkvision","Detect Thoughts","Enhance Ability",
  "Enlarge/Reduce","Flaming Sphere","Hold Person","Invisibility","Knock",
  "Levitate","Magic Mouth","Mirror Image","Misty Step",
  "Phantasmal Force","Ray of Enfeeblement","Scorching Ray","See Invisibility",
  "Shatter","Spider Climb","Suggestion","Web"
];
DND_DATA.spells.sorcerer.level3 = [
  "Blink","Clairvoyance","Counterspell","Daylight","Dispel Magic",
  "Fear","Fireball","Fly","Gaseous Form",
  "Haste","Hypnotic Pattern","Lightning Bolt","Major Image","Protection from Energy","Sleet Storm","Slow","Stinking Cloud","Tongues","Vampiric Touch","Water Breathing"
];
DND_DATA.spells.sorcerer.level4 = [
  "Banishment","Blight","Charm Monster","Confusion","Dimension Door",
  "Dominate Beast","Elemental Bane","Fire Shield","Greater Invisibility",
  "Ice Storm","Sickening Radiance",
  "Storm Sphere","Stoneskin","Summon Elemental","Summon Greater Demon",
  "Vitriolic Sphere","Wall of Fire","Watery Sphere"
];
DND_DATA.spells.sorcerer.level5 = [
  "Animate Objects","Bigby's Hand","Cloudkill","Cone of Cold","Conjure Elemental",
  "Control Winds","Creation","Dawn","Dominate Person","Far Step","Geas",
  "Hold Monster","Immolation","Seeming","Skill Empowerment","Steel Wind Strike",
  "Summon Draconic Spirit","Synaptic Static","Telekinesis","Teleportation Circle",
  "Wall of Force","Wall of Light","Wall of Stone"
];
DND_DATA.spells.sorcerer.level6 = [
  "Arcane Gate","Chain Lightning","Circle of Death","Create Undead","Disintegrate",
  "Eyebite","Flesh to Stone","Globe of Invulnerability","Investiture of Flame",
  "Investiture of Ice","Investiture of Stone","Investiture of Wind","Mass Suggestion",
  "Mental Prison","Move Earth","Otiluke's Freezing Sphere","Scatter","Soul Cage",
  "Summon Fiend","Sunbeam","True Seeing"
];
DND_DATA.spells.sorcerer.level7 = [
  "Crown of Stars","Delayed Blast Fireball","Etherealness","Finger of Death",
  "Fire Storm","Forcecage","Plane Shift","Power Word Pain","Prismatic Spray",
  "Reverse Gravity","Symbol","Teleport","Whirlwind"
];
DND_DATA.spells.sorcerer.level8 = [
  "Abi-Dalzim's Horrid Wilting","Antimagic Field","Control Weather","Demiplane",
  "Dominate Monster","Earthquake","Feeblemind","Incendiary Cloud","Maddening Darkness",
  "Power Word Stun","Sunburst"
];
DND_DATA.spells.sorcerer.level9 = [
  "Blade of Disaster","Gate","Mass Polymorph","Meteor Swarm","Power Word Kill",
  "Psychic Scream","Time Stop","True Polymorph","Wish"
];

// ── BARD ────────────────────────────────────────────────────
DND_DATA.spells.bard.level2 = [
  "Blindness/Deafness","Cloud of Daggers","Crown of Madness","Detect Thoughts",
  "Enhance Ability","Enthrall","Heat Metal","Hold Person","Invisibility","Knock",
  "Lesser Restoration","Locate Animals or Plants","Locate Object","Magic Mouth",
  "Mirror Image","Phantasmal Force","Pyrotechnics",
  "See Invisibility","Shatter","Silence","Skywrite","Suggestion","Zone of Truth"
];
DND_DATA.spells.bard.level3 = [
  "Bestow Curse","Clairvoyance","Counterspell","Dispel Magic",
  "Fear","Feign Death","Gaseous Form","Glyph of Warding",
  "Hypnotic Pattern","Leomund's Tiny Hut","Major Image","Mass Healing Word",
  "Nondetection","Plant Growth","Sending","Slow","Speak with Dead",
  "Speak with Plants","Stinking Cloud","Tongues"
];
DND_DATA.spells.bard.level4 = [
  "Charm Monster","Confusion","Dimension Door","Freedom of Movement",
  "Greater Invisibility","Hallucinatory Terrain","Locate Creature",
  "Phantasmal Killer","Polymorph"
];
DND_DATA.spells.bard.level5 = [
  "Animate Objects","Awaken","Dominate Person","Dream","Geas","Greater Restoration",
  "Hold Monster","Legend Lore","Mass Cure Wounds","Mislead","Modify Memory",
  "Planar Binding","Raise Dead","Rary's Telepathic Bond","Scrying","Seeming",
  "Skill Empowerment","Steel Wind Strike","Synaptic Static","Teleportation Circle"
];
DND_DATA.spells.bard.level6 = [
  "Eyebite","Find the Path","Guards and Wards","Heroes' Feast","Mass Suggestion",
  "Otto's Irresistible Dance","Programmed Illusion","Scatter","Soul Cage","True Seeing"
];
DND_DATA.spells.bard.level7 = [
  "Etherealness","Forcecage","Mirage Arcane","Mordenkainen's Magnificent Mansion",
  "Plane Shift","Power Word Pain","Prismatic Spray","Project Image","Regenerate",
  "Resurrection","Symbol","Teleport","Whirlwind"
];
DND_DATA.spells.bard.level8 = [
  "Antipathy/Sympathy","Befuddlement","Dominate Monster","Feeblemind","Glibness",
  "Mind Blank","Power Word Stun","True Polymorph"
];
DND_DATA.spells.bard.level9 = [
  "Foresight","Mass Polymorph","Power Word Heal","Power Word Kill",
  "Prismatic Wall","Psychic Scream","True Polymorph","Weird"
];

// ── CLERIC ──────────────────────────────────────────────────
DND_DATA.spells.cleric.level2 = [
  "Aid","Augury","Blindness/Deafness","Calm Emotions","Continual Flame",
  "Enhance Ability","Find Traps","Gentle Repose","Hold Person","Lesser Restoration",
  "Locate Object","Prayer of Healing","Protection from Poison",
  "Silence","Spiritual Weapon","Warding Bond","Zone of Truth"
];
DND_DATA.spells.cleric.level3 = [
  "Animate Dead","Beacon of Hope","Bestow Curse","Clairvoyance",
  "Create Food and Water","Daylight","Dispel Magic","Feign Death",
  "Glyph of Warding","Magic Circle","Mass Healing Word",
  "Meld into Stone","Protection from Energy","Remove Curse","Revivify",
  "Sending","Speak with Dead","Spirit Guardians","Spirit Shroud","Tongues",
  "Water Walk","Wind Wall"
];
DND_DATA.spells.cleric.level4 = [
  "Aura of Life","Aura of Purity","Banishment","Control Water","Death Ward",
  "Divination","Freedom of Movement","Guardian of Faith","Locate Creature",
  "Stone Shape"
];
DND_DATA.spells.cleric.level5 = [
  "Commune","Contagion","Dawn","Dispel Evil and Good","Flame Strike",
  "Geas","Greater Restoration","Hallow","Holy Weapon","Hold Monster",
  "Insect Plague","Legend Lore","Mass Cure Wounds","Planar Binding",
  "Raise Dead","Scrying","Summon Celestial"
];
DND_DATA.spells.cleric.level6 = [
  "Blade Barrier","Create Undead","Find the Path","Forbiddance","Harm",
  "Heal","Heroes' Feast","Planar Ally","Sunbeam","True Seeing","Word of Recall"
];
DND_DATA.spells.cleric.level7 = [
  "Conjure Celestial","Divine Word","Etherealness","Fire Storm","Plane Shift",
  "Regenerate","Resurrection","Symbol","Temple of the Gods"
];
DND_DATA.spells.cleric.level8 = [
  "Antimagic Field","Control Weather","Earthquake","Holy Aura","Sunburst"
];
DND_DATA.spells.cleric.level9 = [
  "Astral Projection","Gate","Mass Heal","Power Word Heal","True Resurrection"
];

// ── DRUID ───────────────────────────────────────────────────
DND_DATA.spells.druid.level2 = [
  "Animal Messenger","Barkskin","Beast Sense","Continual Flame","Darkvision",
  "Dust Devil","Earthbind","Enhance Ability","Find Traps","Flame Blade",
  "Flaming Sphere","Gust of Wind","Heat Metal","Lesser Restoration",
  "Locate Animals or Plants","Locate Object","Moonbeam","Pass Without Trace","Protection from Poison","Skywrite","Spike Growth",
  "Summon Beast"
];
DND_DATA.spells.druid.level3 = [
  "Aura of Vitality","Call Lightning","Conjure Animals","Daylight",
  "Dispel Magic","Feign Death","Flame Arrows",
  "Meld into Stone","Plant Growth","Protection from Energy","Revivify",
  "Sleet Storm","Speak with Plants","Summon Fey","Water Breathing","Water Walk","Wind Wall"
];
DND_DATA.spells.druid.level4 = [
  "Blight","Conjure Minor Elementals","Conjure Woodland Beings","Control Water",
  "Dominate Beast","Freedom of Movement","Giant Insect","Grasping Vine",
  "Guardian of Nature","Hallucinatory Terrain","Ice Storm","Locate Creature",
  "Polymorph","Stone Shape","Stoneskin","Summon Construct","Summon Elemental",
  "Wall of Fire","Watery Sphere"
];
DND_DATA.spells.druid.level5 = [
  "Antilife Shell","Awaken","Commune with Nature","Conjure Elemental","Contagion",
  "Control Winds","Geas","Greater Restoration","Hold Monster","Insect Plague",
  "Maelstrom","Mass Cure Wounds","Planar Binding","Reincarnate","Scrying",
  "Steel Wind Strike","Summon Draconic Spirit","Tree Stride","Wall of Stone",
  "Wrath of Nature"
];
DND_DATA.spells.druid.level6 = [
  "Conjure Fey","Find the Path","Heal","Heroes' Feast","Investiture of Flame",
  "Investiture of Ice","Investiture of Stone","Investiture of Wind","Move Earth",
  "Primordial Ward","Sunbeam","Transport via Plants","True Seeing",
  "Wall of Thorns","Wind Walk"
];
DND_DATA.spells.druid.level7 = [
  "Fire Storm","Mirage Arcane","Plane Shift","Regenerate","Reverse Gravity",
  "Symbol","Whirlwind"
];
DND_DATA.spells.druid.level8 = [
  "Animal Shapes","Antipathy/Sympathy","Control Weather","Earthquake",
  "Feeblemind","Incendiary Cloud","Sunburst","Tsunami"
];
DND_DATA.spells.druid.level9 = [
  "Foresight","Mass Polymorph","Shapechange","Storm of Vengeance","True Resurrection"
];

// ── PALADIN (max 5th level slots) ───────────────────────────
DND_DATA.spells.paladin.level1 = [
  "Bless","Command","Compelled Duel","Cure Wounds","Detect Evil and Good","Detect Magic",
  "Detect Poison and Disease","Divine Favor","Heroism","Protection from Evil and Good",
  "Purify Food and Drink","Searing Smite","Shield of Faith","Thunderous Smite","Wrathful Smite"
];
DND_DATA.spells.paladin.level2 = [
  "Aid","Branding Smite","Find Steed","Gentle Repose","Lesser Restoration",
  "Locate Object","Magic Weapon","Prayer of Healing","Protection from Poison",
  "Warding Bond","Zone of Truth"
];
DND_DATA.spells.paladin.level3 = [
  "Aura of Vitality","Blinding Smite","Create Food and Water","Crusader's Mantle",
  "Daylight","Dispel Magic","Elemental Weapon","Magic Circle","Remove Curse","Revivify"
];
DND_DATA.spells.paladin.level4 = [
  "Aura of Life","Aura of Purity","Banishment","Death Ward",
  "Find Greater Steed","Locate Creature","Staggering Smite"
];
DND_DATA.spells.paladin.level5 = [
  "Banishing Smite","Circle of Power","Destructive Wave","Dispel Evil and Good",
  "Geas","Holy Weapon","Raise Dead","Summon Celestial"
];

// ── RANGER (max 5th level slots, first slot at level 2) ─────
DND_DATA.spells.ranger.level1 = [
  "Alarm","Animal Friendship","Cure Wounds","Detect Magic","Detect Poison and Disease",
  "Ensnaring Strike","Fog Cloud","Goodberry","Hail of Thorns","Hunter's Mark",
  "Jump","Longstrider","Speak with Animals"
];
DND_DATA.spells.ranger.level2 = [
  "Animal Messenger","Beast Sense","Cordon of Arrows","Darkvision",
  "Find Traps","Gust of Wind","Lesser Restoration","Locate Animals or Plants",
  "Locate Object","Pass Without Trace","Protection from Poison","Silence",
  "Spike Growth","Summon Beast"
];
DND_DATA.spells.ranger.level3 = [
  "Conjure Animals","Conjure Barrage","Daylight","Dispel Magic",
  "Flame Arrows","Lightning Arrow","Nondetection","Plant Growth",
  "Protection from Energy","Speak with Plants","Summon Fey","Water Breathing","Water Walk","Wind Wall"
];
DND_DATA.spells.ranger.level4 = [
  "Conjure Woodland Beings","Freedom of Movement","Grasping Vine",
  "Guardian of Nature","Locate Creature","Stoneskin","Summon Elemental"
];
DND_DATA.spells.ranger.level5 = [
  "Commune with Nature","Conjure Volley","Greater Restoration","Hold Monster",
  "Steel Wind Strike","Swift Quiver","Tree Stride","Wrath of Nature"
];

// ── WARLOCK ─────────────────────────────────────────────────
DND_DATA.spells.warlock.level1 = [
  "Armor of Agathys","Arms of Hadar","Charm Person","Comprehend Languages","Expeditious Retreat",
  "Hellish Rebuke","Hex","Illusory Script","Protection from Evil and Good","Unseen Servant","Witch Bolt"
];
DND_DATA.spells.warlock.level2 = [
  "Cloud of Daggers","Crown of Madness","Darkness","Enthrall","Hold Person",
  "Invisibility","Mirror Image","Misty Step","Ray of Enfeeblement",
  "Shatter","Spider Climb","Suggestion"
];
DND_DATA.spells.warlock.level3 = [
  "Counterspell","Dispel Magic","Fear","Fly","Gaseous Form",
  "Hunger of Hadar","Hypnotic Pattern","Magic Circle","Major Image",
  "Remove Curse","Spirit Shroud","Summon Fey","Summon Lesser Demons",
  "Tongues","Vampiric Touch"
];
DND_DATA.spells.warlock.level4 = [
  "Banishment","Blight","Charm Monster","Dimension Door","Elemental Bane",
  "Hallucinatory Terrain","Shadow of Moil",
  "Sickening Radiance","Summon Aberration","Summon Greater Demon","Wall of Fire"
];
DND_DATA.spells.warlock.level5 = [
  "Contact Other Plane","Danse Macabre","Dream","Far Step","Hold Monster",
  "Infernal Calling","Jallarzi's Storm of Radiance","Mislead","Modify Memory",
  "Negative Energy Flood","Planar Binding","Scrying","Synaptic Static","Teleportation Circle"
];

// ══════════════════════════════════════════════════════════════
// SPELLCASTER PROGRESSION TABLES
// ══════════════════════════════════════════════════════════════

// What type of spellcaster is each class?
// 'known'    = bard, sorcerer, warlock, ranger — pick spells, know them permanently
// 'book'     = wizard — adds spells to spellbook, prepares from it
// 'prepared' = cleric, druid, paladin — no fixed known list, prepare daily from full list
DND_DATA.spellcasterType = {
  bard:'known', sorcerer:'known', warlock:'known', ranger:'known',
  wizard:'book', cleric:'prepared', druid:'prepared', paladin:'prepared'
};

// Highest spell level accessible at each class level (index = classLevel - 1)
DND_DATA.maxSpellLevel = {
  fullcaster: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,9,9],
  halfcaster: [0,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5],
  warlock:    [1,1,2,2,3,3,4,4,5,5,5,5,5,5,5,5,5,5,5,5]
};

// Which max-spell-level table does each caster use?
DND_DATA.spellLevelTableType = {
  bard:'fullcaster', cleric:'fullcaster', druid:'fullcaster',
  sorcerer:'fullcaster', wizard:'fullcaster',
  paladin:'halfcaster', ranger:'halfcaster',
  warlock:'warlock'
};

// Total spells known at each level for 'known' casters (index = classLevel - 1)
// Cantrips are tracked separately below.
DND_DATA.spellsKnownTable = {
  bard:    [4,5,6,7,8,9,10,11,12,14,15,15,16,18,19,19,20,22,22,22],
  sorcerer:[2,3,4,5,6,7,8,9,10,11,12,12,13,13,14,14,15,15,15,15],
  warlock: [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15],
  ranger:  [0,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11]
};

// Total cantrips known at each level (index = classLevel - 1)
DND_DATA.cantripsKnownTable = {
  bard:    [2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  cleric:  [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5],
  druid:   [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  sorcerer:[4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6],
  warlock: [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
  wizard:  [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5]
};

// ══════════════════════════════════════════════════════════════
// SPELL LEVEL LOOKUP — maps every spell name to its level
// 0 = cantrip, 1-9 = spell level
// ══════════════════════════════════════════════════════════════
(function(){
  var data = DND_DATA;
  var levelMap = {};

  // Cantrips = level 0
  ['wizard','sorcerer','bard','cleric','druid','warlock'].forEach(function(cls){
    var list = data.spells[cls];
    if(list && list.cantrips) list.cantrips.forEach(function(s){ levelMap[s] = 0; });
  });

  // Levels 1-9
  var levelKeys = ['level1','level2','level3','level4','level5','level6','level7','level8','level9'];
  Object.keys(data.spells).forEach(function(cls){
    var list = data.spells[cls];
    levelKeys.forEach(function(lk, i){
      if(list[lk]) list[lk].forEach(function(s){ if(levelMap[s] === undefined) levelMap[s] = i+1; });
    });
  });

  data.spellLevel = levelMap;
})();

// ══════════════════════════════════════════════════════════════
// FEATS — D&D 5e PHB + Common Sourcebooks
// Each feat: name, prereq (null or string), desc, asi (optional partial ASI)
// ══════════════════════════════════════════════════════════════
DND_DATA.feats = [

  // ── General Feats ───────────────────────────────
  {
    name: "Alert",
    prereq: null,
    desc: "You gain +5 to initiative. You cannot be surprised while you are conscious. Other creatures do not gain advantage on attack rolls against you as a result of being hidden from you before initiative is rolled.",
    benefits: ["+5 to initiative", "Cannot be surprised while conscious", "No advantage against you from hidden attackers before initiative"]
  },
  {
    name: "Athlete",
    prereq: null,
    desc: "Increase your Strength or Dexterity by 1. When you are prone, standing up uses only 5 feet of movement. Climbing does not cost extra movement. Running long and high jumps only require 5 feet of running start.",
    asi: {choice: ["str","dex"], amount: 1},
    benefits: ["+1 STR or DEX", "Standing from prone costs only 5 ft of movement", "Climbing costs no extra movement", "Running jumps need only 5 ft of running start"]
  },
  {
    name: "Actor",
    prereq: null,
    desc: "Increase your Charisma by 1. You have advantage on Deception and Performance checks when trying to pass yourself off as a different person. You can mimic the speech of another person or the sounds made by other creatures after hearing them for at least 1 minute.",
    asi: {choice: ["cha"], amount: 1},
    benefits: ["+1 CHA", "Advantage on Deception and Performance when disguising as someone else", "Can mimic voices after 1 minute of listening"]
  },
  {
    name: "Charger",
    prereq: null,
    desc: "When you use your action to Dash, you can use a bonus action to make one melee weapon attack or to shove a creature. If you move at least 10 feet in a straight line before using this bonus action, you either gain a +5 bonus to the attack's damage roll (if you chose the melee attack) or push the target up to 10 feet away from you (if you chose the shove).",
    benefits: ["Dash then bonus action melee attack or shove", "+5 damage or 10 ft push if you moved 10 ft straight before the attack"]
  },
  {
    name: "Crossbow Expert",
    prereq: null,
    desc: "You ignore the loading quality of crossbows you are proficient with. Being within 5 feet of a hostile creature does not impose disadvantage on your ranged attack rolls. When you use the Attack action and attack with a one-handed weapon, you can use a bonus action to attack with a hand crossbow you are holding.",
    benefits: ["Ignore loading on crossbows", "No disadvantage on ranged attacks in melee", "Bonus action hand crossbow attack after one-handed weapon attack"]
  },
  {
    name: "Defensive Duelist",
    prereq: "Dexterity 13 or higher",
    desc: "When you are wielding a finesse weapon you are proficient with and another creature hits you with a melee attack, you can use your reaction to add your proficiency bonus to your AC for that attack, potentially causing the attack to miss.",
    benefits: ["Reaction: add proficiency bonus to AC against one melee attack", "Requires finesse weapon you are proficient with"]
  },
  {
    name: "Dual Wielder",
    prereq: null,
    desc: "You gain +1 to AC while wielding a separate melee weapon in each hand. You can use two-weapon fighting even when the weapons you wield are not light. You can draw or stow two one-handed weapons when you would normally only draw or stow one.",
    benefits: ["+1 AC while dual wielding", "Can two-weapon fight with non-light melee weapons", "Draw or stow two weapons at once"]
  },
  {
    name: "Dungeon Delver",
    prereq: null,
    desc: "Advantage on Perception and Investigation checks made to detect secret doors. Advantage on saving throws made to avoid or resist traps. Resistance to the damage dealt by traps. You can search for traps while traveling at a normal pace instead of slow pace.",
    benefits: ["Advantage on checks to detect secret doors", "Advantage on saves vs traps", "Resistance to trap damage", "Search for traps at normal travel pace"]
  },
  {
    name: "Durable",
    prereq: null,
    desc: "Increase your Constitution by 1. When you roll a Hit Die to recover hit points, the minimum number of hit points you regain from the roll equals twice your Constitution modifier (minimum of 2).",
    asi: {choice: ["con"], amount: 1},
    benefits: ["+1 CON", "Minimum HP regained from Hit Dice equals 2x CON modifier"]
  },
  {
    name: "Elemental Adept",
    prereq: "Ability to cast at least one spell",
    desc: "Choose one of the following damage types: acid, cold, fire, lightning, or thunder. Spells you cast ignore resistance to damage of the chosen type. In addition, when you roll damage for a spell you cast that deals damage of that type, you can treat any 1 on a damage die as a 2. You can select this feat multiple times, choosing a different damage type each time.",
    benefits: ["Spells ignore resistance to chosen damage type (acid/cold/fire/lightning/thunder)", "Treat 1s on damage dice as 2s for that damage type", "Can take multiple times for different types"]
  },
  {
    name: "Grappler",
    prereq: "Strength 13 or higher",
    desc: "You have advantage on attack rolls against a creature you are grappling. You can use your action to try to pin a creature grappled by you. To do so, make another grapple check. If you succeed, you and the creature are both restrained until the grapple ends.",
    benefits: ["Advantage on attacks vs grappled creatures", "Action: pin a grappled creature, restraining both of you"]
  },
  {
    name: "Great Weapon Master",
    prereq: null,
    desc: "On your turn, when you score a critical hit with a melee weapon or reduce a creature to 0 HP with one, you can make one melee weapon attack as a bonus action. Before you make a melee attack with a heavy weapon you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.",
    benefits: ["Bonus action melee attack on crit or kill", "-5 to hit / +10 damage option with heavy weapons"]
  },
  {
    name: "Healer",
    prereq: null,
    desc: "When you use a healer's kit to stabilize a dying creature, that creature also regains 1 HP. As an action, you can spend one use of a healer's kit to tend to a creature and restore 1d6+4 HP, plus additional HP equal to the creature's maximum number of Hit Dice. A creature can only benefit from this feat's healing once per short rest.",
    benefits: ["Stabilizing also restores 1 HP", "Action + healer's kit: restore 1d6+4 + max Hit Dice HP (once per short rest per creature)"]
  },
  {
    name: "Heavily Armored",
    prereq: "Proficiency with medium armor",
    desc: "Increase your Strength by 1. You gain proficiency with heavy armor.",
    asi: {choice: ["str"], amount: 1},
    benefits: ["+1 STR", "Gain heavy armor proficiency"]
  },
  {
    name: "Heavy Armor Master",
    prereq: "Proficiency with heavy armor",
    desc: "Increase your Strength by 1. While you are wearing heavy armor, bludgeoning, piercing, and slashing damage that you take from non-magical weapons is reduced by 3.",
    asi: {choice: ["str"], amount: 1},
    benefits: ["+1 STR", "Reduce non-magical bludgeoning, piercing, and slashing damage by 3 while in heavy armor"]
  },
  {
    name: "Inspiring Leader",
    prereq: "Charisma 13 or higher",
    desc: "You can spend 10 minutes inspiring your companions. When you do, up to six friendly creatures (including yourself) within 30 feet of you gain temporary HP equal to your level + your Charisma modifier. A creature cannot benefit from this feat again until it finishes a short or long rest.",
    benefits: ["10 min: up to 6 allies gain temp HP = your level + CHA mod", "Once per short or long rest per creature"]
  },
  {
    name: "Keen Mind",
    prereq: null,
    desc: "Increase your Intelligence by 1. You always know which way is north. You always know the number of hours left before the next sunrise or sunset. You can accurately recall anything you have seen or heard within the past month.",
    asi: {choice: ["int"], amount: 1},
    benefits: ["+1 INT", "Always know which direction is north", "Always know hours until next sunrise/sunset", "Recall anything seen or heard in the past month"]
  },
  {
    name: "Lightly Armored",
    prereq: null,
    desc: "Increase your Strength or Dexterity by 1. You gain proficiency with light armor.",
    asi: {choice: ["str","dex"], amount: 1},
    benefits: ["+1 STR or DEX", "Gain light armor proficiency"]
  },
  {
    name: "Linguist",
    prereq: null,
    desc: "Increase your Intelligence by 1. You learn three languages of your choice. You can ably create written ciphers. Others cannot decipher a code you create unless you teach them, they succeed on an Intelligence check (DC = your INT score + your proficiency bonus), or they use magic to decipher it.",
    asi: {choice: ["int"], amount: 1},
    benefits: ["+1 INT", "Learn 3 languages of your choice", "Create written ciphers others can't read without your help"]
  },
  {
    name: "Lucky",
    prereq: null,
    desc: "You have 3 luck points. Whenever you make an attack roll, ability check, or saving throw, you can spend one luck point to roll an additional d20. You can choose to spend one of your luck points after you roll but before the outcome is determined. You choose which of the d20s is used. You can also spend one luck point when an attack roll is made against you, forcing the attacker to reroll. Luck points are regained when you finish a long rest.",
    benefits: ["3 luck points per long rest", "Spend a point to roll an extra d20 on any attack, check, or save (choose which result)", "Spend a point to force an enemy to reroll an attack against you"]
  },
  {
    name: "Mage Slayer",
    prereq: null,
    desc: "When a creature within 5 feet of you casts a spell, you can use your reaction to make a melee weapon attack against that creature. When you damage a creature that is concentrating on a spell, that creature has disadvantage on the saving throw to maintain its concentration. You have advantage on saving throws against spells cast by creatures within 5 feet of you.",
    benefits: ["Reaction: melee attack when adjacent creature casts a spell", "Concentration saves have disadvantage when you damage the caster", "Advantage on saves vs spells from adjacent casters"]
  },
  {
    name: "Magic Initiate",
    prereq: null,
    desc: "Choose a class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two cantrips of your choice from that class's spell list. You also learn one 1st-level spell from that class. You can cast the 1st-level spell once per long rest at its lowest level without a spell slot. Your spellcasting ability is the same as the chosen class (CHA for bard/sorcerer/warlock, WIS for cleric/druid, INT for wizard).",
    benefits: ["Learn 2 cantrips from chosen class list", "Learn 1 first-level spell from chosen class list", "Cast that spell once per long rest without a slot"]
  },
  {
    name: "Martial Adept",
    prereq: null,
    desc: "You have martial training that allows you to perform special combat maneuvers. You learn two maneuvers of your choice from among those available to the Battle Master archetype. You gain one superiority die, a d6 (this die is added to any superiority dice you have from another source). The die is expended when you use it, and is regained when you finish a short or long rest.",
    benefits: ["Learn 2 Battle Master maneuvers", "Gain 1 superiority die (d6), regained on short rest"]
  },
  {
    name: "Medium Armor Master",
    prereq: "Proficiency with medium armor",
    desc: "Wearing medium armor does not impose disadvantage on your Dexterity (Stealth) checks. The maximum Dexterity bonus to AC you can apply from medium armor increases to 3 instead of 2.",
    benefits: ["No Stealth disadvantage from medium armor", "Max DEX bonus to AC from medium armor increases to +3"]
  },
  {
    name: "Mobile",
    prereq: null,
    desc: "Your speed increases by 10 feet. When you use the Dash action, difficult terrain does not cost extra movement for the rest of that turn. When you make a melee attack against a creature, you do not provoke opportunity attacks from that creature for the rest of the turn, whether or not the attack hits.",
    benefits: ["+10 ft speed", "Dash: ignore difficult terrain that turn", "No opportunity attacks from creatures you attack in melee (that turn)"]
  },
  {
    name: "Moderately Armored",
    prereq: "Proficiency with light armor",
    desc: "Increase your Strength or Dexterity by 1. You gain proficiency with medium armor and shields.",
    asi: {choice: ["str","dex"], amount: 1},
    benefits: ["+1 STR or DEX", "Gain medium armor and shield proficiency"]
  },
  {
    name: "Mounted Combatant",
    prereq: null,
    desc: "You have advantage on melee attack rolls against unmounted creatures that are smaller than your mount. You can force an attack targeted at your mount to target you instead. If your mount is subjected to an effect that allows a DEX save for half damage, it takes no damage on a success and half on a failure (if it lacks the Evasion feature).",
    benefits: ["Advantage on melee attacks vs unmounted smaller creatures", "Redirect attacks targeting your mount to yourself", "Mount takes no damage on DEX saves it succeeds on"]
  },
  {
    name: "Observant",
    prereq: null,
    desc: "Increase your Intelligence or Wisdom by 1. If you can see a creature's mouth while it is speaking a language you understand, you can interpret what it's saying by reading its lips. You have a +5 bonus to your passive Perception and passive Investigation scores.",
    asi: {choice: ["int","wis"], amount: 1},
    benefits: ["+1 INT or WIS", "Lip-read creatures speaking a known language", "+5 to passive Perception and passive Investigation"]
  },
  {
    name: "Polearm Master",
    prereq: null,
    desc: "When you take the Attack action and attack with only a glaive, halberd, quarterstaff, or spear, you can use a bonus action to make a melee attack with the opposite end of the weapon. This attack uses the same ability modifier as the primary attack and deals 1d4 bludgeoning damage. While wielding a glaive, halberd, pike, or quarterstaff, other creatures provoke an opportunity attack from you when they enter your reach.",
    benefits: ["Bonus action butt-end attack (1d4 bludgeoning) with polearms/quarterstaff/spear", "Creatures entering your reach provoke opportunity attacks"]
  },
  {
    name: "Resilient",
    prereq: null,
    desc: "Choose one ability score. Increase the chosen ability score by 1. You gain proficiency in saving throws using the chosen ability.",
    asi: {choice: ["str","dex","con","int","wis","cha"], amount: 1},
    benefits: ["+1 to chosen ability score", "Gain proficiency in saving throws for that ability"]
  },
  {
    name: "Ritual Caster",
    prereq: "Intelligence or Wisdom 13 or higher",
    desc: "You have learned a number of spells that you can cast as rituals. These spells are written in a ritual book. Choose one class: bard, cleric, druid, sorcerer, warlock, or wizard. You learn two 1st-level spells with the ritual tag from that class's spell list. You can cast them as rituals but not as regular spells unless you have spell slots. You can add ritual spells found on adventures to your book.",
    benefits: ["Learn 2 first-level ritual spells from chosen class", "Cast them as rituals only (10 extra minutes)", "Can copy ritual spells found on adventures into your book"]
  },
  {
    name: "Savage Attacker",
    prereq: null,
    desc: "Once per turn when you roll damage for a melee weapon attack, you can reroll the weapon's damage dice and use either total.",
    benefits: ["Once per turn: reroll melee weapon damage dice and use either result"]
  },
  {
    name: "Sentinel",
    prereq: null,
    desc: "When you hit a creature with an opportunity attack, the creature's speed becomes 0 for the rest of the turn. Creatures within 5 feet of you provoke opportunity attacks even if they took the Disengage action. When a creature within 5 feet of you makes an attack against a target other than you, you can use your reaction to make a melee weapon attack against the attacking creature.",
    benefits: ["Opportunity attacks reduce creature speed to 0", "Disengage does not prevent opportunity attacks from you", "Reaction: attack creatures within 5 ft that attack others"]
  },
  {
    name: "Sharpshooter",
    prereq: null,
    desc: "Attacking at long range does not impose disadvantage on your ranged weapon attack rolls. Your ranged weapon attacks ignore half cover and three-quarters cover. Before you make an attack with a ranged weapon that you are proficient with, you can choose to take a -5 penalty to the attack roll. If the attack hits, you add +10 to the attack's damage.",
    benefits: ["No disadvantage at long range", "Ranged attacks ignore half and three-quarters cover", "-5 to hit / +10 damage option with ranged weapons"]
  },
  {
    name: "Shield Master",
    prereq: null,
    desc: "If you take the Attack action on your turn, you can use a bonus action to try to shove a creature within 5 feet of you with your shield. If you are not incapacitated, you can add your shield's AC bonus to DEX saving throws you make against a spell or effect that targets only you. If you are subjected to an effect that allows a DEX save for half damage, you can use your reaction to take no damage if you succeed, interposing your shield between yourself and the source of the effect.",
    benefits: ["Bonus action shield shove after attacking", "+2 (shield bonus) to DEX saves vs single-target spells", "Reaction: take no damage on successful DEX save (half-damage effects)"]
  },
  {
    name: "Skilled",
    prereq: null,
    desc: "You gain proficiency in any combination of three skills or tools of your choice.",
    benefits: ["Gain proficiency in 3 skills or tools of your choice"]
  },
  {
    name: "Skulker",
    prereq: "Dexterity 13 or higher",
    desc: "You can try to hide when you are lightly obscured from the creature from which you are hiding. When you are hidden from a creature and miss it with a ranged weapon attack, making the attack does not reveal your position. Dim light does not impose disadvantage on your Perception checks that rely on sight.",
    benefits: ["Can hide when lightly obscured", "Missing with a ranged attack does not reveal your position", "No disadvantage on Perception in dim light"]
  },
  {
    name: "Spell Sniper",
    prereq: "Ability to cast at least one spell",
    desc: "When you cast a spell that requires an attack roll, the spell's range is doubled. Your ranged spell attacks ignore half cover and three-quarters cover. You learn one cantrip that requires an attack roll, chosen from the bard, cleric, druid, sorcerer, warlock, or wizard spell list. Your spellcasting ability for this cantrip uses the same class's ability.",
    benefits: ["Double range on spell attack spells", "Spell attacks ignore half and three-quarters cover", "Learn 1 attack-roll cantrip from any spell list"]
  },
  {
    name: "Tavern Brawler",
    prereq: null,
    desc: "Increase your Strength or Constitution by 1. You are proficient with improvised weapons and unarmed strikes. Your unarmed strike uses a d4 for damage. When you hit a creature with an unarmed strike or an improvised weapon on your turn, you can use a bonus action to attempt to grapple the creature.",
    asi: {choice: ["str","con"], amount: 1},
    benefits: ["+1 STR or CON", "Proficiency with improvised weapons and unarmed strikes", "Unarmed strikes deal 1d4", "Bonus action grapple attempt after hitting with an unarmed strike or improvised weapon"]
  },
  {
    name: "Tough",
    prereq: null,
    desc: "Your hit point maximum increases by an amount equal to twice your level when you gain this feat. Whenever you gain a level thereafter, your hit point maximum increases by an additional 2 hit points.",
    benefits: ["HP maximum increases by 2 per character level (retroactive and ongoing)"]
  },
  {
    name: "War Caster",
    prereq: "Ability to cast at least one spell",
    desc: "You have advantage on Constitution saving throws that you make to maintain your concentration on a spell when you take damage. You can perform the somatic components of spells even when you have weapons or a shield in one or both hands. When a hostile creature's movement provokes an opportunity attack from you, you can use your reaction to cast a spell at the creature rather than making an opportunity attack. The spell must have a casting time of 1 action and target only that creature.",
    benefits: ["Advantage on concentration saves when taking damage", "Can cast spells with somatic components while holding weapons or a shield", "Reaction: cast a spell as an opportunity attack"]
  },
  {
    name: "Weapon Master",
    prereq: null,
    desc: "Increase your Strength or Dexterity by 1. You gain proficiency with four weapons of your choice. Each one must be a simple or martial weapon.",
    asi: {choice: ["str","dex"], amount: 1},
    benefits: ["+1 STR or DEX", "Gain proficiency with 4 weapons of your choice"]
  }
];

// ── MULTICLASS PREREQUISITES (SRD 5.1) ──
// To multiclass INTO a class, you must meet these ability score minimums.
// The "or" key means either the main ability OR the "or" ability meets the 13 threshold.
DND_DATA.multiclassPrereqs = {
  barbarian: { str:13 },
  bard:      { cha:13 },
  cleric:    { wis:13 },
  druid:     { wis:13 },
  fighter:   { str:13, or:'dex' },
  monk:      { dex:13, wis:13 },
  paladin:   { str:13, cha:13 },
  ranger:    { dex:13, wis:13 },
  rogue:     { dex:13 },
  sorcerer:  { cha:13 },
  warlock:   { cha:13 },
  wizard:    { int:13 }
};

// ── MULTICLASS SPELLCASTING WEIGHT ──
// Weight for calculating multiclass caster level (full casters = 1, half-casters = 0.5, non-casters = 0)
DND_DATA.spellcastingWeight = {
  bard: 1, cleric: 1, druid: 1, sorcerer: 1, wizard: 1,
  paladin: 0.5, ranger: 0.5,
  fighter: 0, barbarian: 0, monk: 0, rogue: 0, warlock: 0
};

// ── MULTICLASS SPELL SLOT TABLE ──
// Indexed by caster level (0-20), each entry is an array of max spell slots per spell level
DND_DATA.multiclassSlotTable = [
  [],            // 0
  [2],           // 1
  [3],           // 2
  [4,2],         // 3
  [4,3],         // 4
  [4,3,2],       // 5
  [4,3,3],       // 6
  [4,3,3,1],     // 7
  [4,3,3,2],     // 8
  [4,3,3,3,1],   // 9
  [4,3,3,3,2],   // 10
  [4,3,3,3,2,1], // 11
  [4,3,3,3,2,1], // 12
  [4,3,3,3,2,1,1], // 13
  [4,3,3,3,2,1,1], // 14
  [4,3,3,3,2,1,1,1], // 15
  [4,3,3,3,2,1,1,1], // 16
  [4,3,3,3,2,1,1,1,1], // 17
  [4,3,3,3,3,1,1,1,1], // 18
  [4,3,3,3,3,2,1,1,1], // 19
  [4,3,3,3,3,2,2,1,1]  // 20
];

// ── MULTICLASS PROFICIENCY GAINS ──
// What proficiencies a character gains when multiclassing into each class
DND_DATA.multiclassProfGains = {
  barbarian: { armor: ['Shields'], weapons: ['Simple weapons', 'Martial weapons'] },
  bard:      { armor: ['Light armor'], weapons: [], skills: 1 },
  cleric:    { armor: ['Light armor', 'Medium armor', 'Shields'], weapons: [] },
  druid:     { armor: ['Light armor', 'Medium armor', 'Shields (nonmetal)'], weapons: [] },
  fighter:   { armor: ['Light armor', 'Medium armor', 'Shields'], weapons: ['Simple weapons', 'Martial weapons'] },
  monk:      { armor: [], weapons: ['Simple weapons', 'Shortswords'] },
  paladin:   { armor: ['Light armor', 'Medium armor', 'Shields'], weapons: ['Simple weapons', 'Martial weapons'] },
  ranger:    { armor: ['Light armor', 'Medium armor', 'Shields'], weapons: ['Simple weapons', 'Martial weapons'], skills: 1 },
  rogue:     { armor: ['Light armor'], weapons: [], skills: 1, tools: ["Thieves' tools"] },
  sorcerer:  { armor: [], weapons: [] },
  warlock:   { armor: ['Light armor'], weapons: ['Simple weapons'] },
  wizard:    { armor: [], weapons: [] }
};

// ── ALL D&D LANGUAGES ──
DND_DATA.featLanguages = [
  'Common', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish', 'Goblin',
  'Halfling', 'Orc', 'Abyssal', 'Celestial', 'Draconic',
  'Deep Speech', 'Infernal', 'Primordial', 'Sylvan', 'Undercommon'
];

// ── ABILITY DESCRIPTIONS ──
DND_DATA.abilityDescriptions = {
  str: 'Measures natural athleticism and bodily power. Affects melee attacks, carrying capacity, and physical feats.',
  dex: 'Measures agility, reflexes, and balance. Affects ranged attacks, AC, and initiative.',
  con: 'Measures health, stamina, and vital force. Affects HP, concentration saves, and death saves.',
  int: 'Measures mental acuity, information recall, and analytical skill. Affects investigation, nature knowledge, and spell attacks for wizards.',
  wis: 'Measures awareness, intuition, and insight. Affects perception, survival, and spell attacks for clerics/druids.',
  cha: 'Measures confidence, eloquence, and leadership. Affects persuasion, deception, and spell attacks for bards/sorcerers/warlocks.'
};

// ── SKILL DESCRIPTIONS ──
DND_DATA.skillDescriptions = {
  'Acrobatics': 'Your ability to stay on your feet in tricky situations. Used for tumbling, balancing, and dodging. (DEX)',
  'Animal Handling': 'Calm down a domesticated animal or intuit an animal\'s intentions and moods. (WIS)',
  'Arcana': 'Your ability to recall lore about spells, magic items, planes of existence, and other arcane matters. (INT)',
  'Athletics': 'Covers difficult situations you encounter while climbing, jumping, or swimming. (STR)',
  'Deception': 'Your ability to convincingly hide the truth, whether verbally or through your actions. (CHA)',
  'History': 'Your ability to recall lore about historical events, legendary people, ancient kingdoms, and similar matters. (INT)',
  'Insight': 'Your ability to determine the true intentions of a creature, such as when searching out a lie. (WIS)',
  'Intimidation': 'When you attempt to influence someone through overt threats, hostile actions, and physical violence. (CHA)',
  'Investigation': 'When you look around for clues and make deductions based on those clues. You might search an area for hidden objects or machinery. (INT)',
  'Medicine': 'The Medicine skill lets you try to stabilize a dying companion or diagnose an illness. (WIS)',
  'Nature': 'Your ability to recall lore about terrain, plants and animals, seasons, and weather. (INT)',
  'Perception': 'Your ability to spot, hear, or otherwise detect the presence of something. It measures your awareness of your surroundings. (WIS)',
  'Performance': 'Your ability to delight an audience with music, dance, acting, storytelling, or some other form of entertainment. (CHA)',
  'Persuasion': 'When you attempt to influence someone or a group of people with tact, social graces, or good nature. (CHA)',
  'Religion': 'Your ability to recall lore about gods, rites and prayers, religious hierarchies, holy symbols, and the practices of secret cults. (INT)',
  'Sleight of Hand': 'Whenever you attempt an act of legerdemain or manual trickery, such as planting something on someone else or concealing an object. (DEX)',
  'Stealth': 'Make a Stealth check when you attempt to hide from notice, slip away without being seen or heard, or sneak past guards. (DEX)',
  'Survival': 'Your ability to track other creatures and to hunt wild animals for food, to find shelter, to navigate by the stars, and to know which plants are edible. (WIS)'
};

// ── FEAT TOOLS (from tool proficiencies) ──
DND_DATA.featTools = [
  'Thieves\' tools', 'Climbing kit', 'Forgery kit', 'Disguise kit', 'Herbalism kit',
  'Alchemist\'s supplies', 'Brewer\'s supplies', 'Calligrapher\'s supplies', 'Carpenter\'s tools',
  'Cartographer\'s tools', 'Cobbler\'s tools', 'Cook\'s utensils', 'Glassblower\'s tools',
  'Jeweler\'s tools', 'Leatherworker\'s tools', 'Mason\'s tools', 'Painter\'s supplies',
  'Potter\'s tools', 'Smith\'s tools', 'Tinker\'s tools', 'Weaver\'s tools',
  'Lute', 'Horn', 'Violin', 'Flute', 'Drum', 'Bagpipe', 'Viol', 'Mandolin',
  'Gaming set', 'Dice set', 'Playing cards', 'Navigator\'s tools', 'Vehicles (land)', 'Vehicles (water)'
];

// ── SUBCLASS DATA ──
DND_DATA.subclassLevel = {
  barbarian: 3,
  bard: 3,
  cleric: 1,
  druid: 2,
  fighter: 3,
  monk: 3,
  paladin: 3,
  ranger: 3,
  rogue: 3,
  sorcerer: 1,
  warlock: 1,
  wizard: 2
};

DND_DATA.subclasses = {
  fighter: [
    { id:'champion', name:'Champion', flavorText:'The archetypal knight, with martial prowess and physical resilience.', features:[
      {level:3, name:'Improved Critical', desc:'Your weapon attacks score a critical hit on a roll of 19 or 20.'},
      {level:7, name:'Remarkable Athlete', desc:'Whenever you make an Athletics, Acrobatics, or Sleight of Hand check using STR, DEX, or INT, add a d4 bonus.'},
      {level:10, name:'Additional Magical Item', desc:'You gain an additional magical item of your choice.'},
      {level:15, name:'Superior Critical', desc:'Your weapon attacks now score a critical hit on a roll of 18-20.'},
      {level:18, name:'Survivor', desc:'At the start of each of your turns, regain 5 HP if you have at least 1 HP and weren\'t incapacitated.'}
    ]},
    { id:'battle-master', name:'Battle Master', flavorText:'A tactician who uses maneuvers and superiority dice to control the battlefield.', features:[
      {level:3, name:'Combat Superiority', desc:'You learn maneuvers. You gain superiority dice equal to 4 d8s. Use them to fuel maneuvers.'},
      {level:7, name:'Know Your Enemy', desc:'Action: learn target\'s ability scores after seeing them attack.'},
      {level:10, name:'Improved Combat Superiority', desc:'Your superiority dice change to d10s.'},
      {level:15, name:'Relentless', desc:'When you roll initiative and have no superiority dice remaining, regain 1.'},
      {level:18, name:'Master of Combat', desc:'Your superiority dice change to d12s.'}
    ]},
    { id:'eldritch-knight', name:'Eldritch Knight', flavorText:'A martial spellcaster who blends sword and sorcery for devastating effect.', features:[
      {level:3, name:'Spellcasting', desc:'You gain spellcasting ability, learning Abjuration or Evocation spells.'},
      {level:7, name:'War Magic', desc:'When you use the Attack action on your turn, you can cast a cantrip using a bonus action.'},
      {level:10, name:'Eldritch Strike', desc:'When you hit with a weapon attack, add your spell damage on top.'},
      {level:15, name:'Arcane Charge', desc:'When you cast a spell, use Bonus Action to move 30 feet in a straight line.'},
      {level:18, name:'Improved War Magic', desc:'Attacks do not provoke opportunity attacks when you teleport or dash via spells.'}
    ]}
  ],
  rogue: [
    { id:'thief', name:'Thief', flavorText:'A criminal operative who relies on cunning and stealth to pursue their goals.', features:[
      {level:3, name:'Fast Hands', desc:'Use a bonus action to take the Use an Object action, disarm a trap, or pick a lock.'},
      {level:9, name:'Second-Story Work', desc:'You gain advantage on Strength (Athletics) checks and don\'t take damage from a fall under 30 ft.'},
      {level:13, name:'Supreme Sneak', desc:'Advantage on Stealth checks if you move no more than half your speed.'},
      {level:17, name:'Use Magic Device', desc:'You can use any magical item regardless of class, race, and ability score requirements.'}
    ]},
    { id:'assassin', name:'Assassin', flavorText:'A master of poisons, infiltration, and sudden death.', features:[
      {level:3, name:'Assassinate', desc:'You have advantage on attack rolls against creatures that haven\'t taken a turn.'},
      {level:9, name:'Evasion', desc:'When you\'re subjected to an effect that allows a DEX save for half damage, take no damage on success.'},
      {level:13, name:'Infiltration Expertise', desc:'Gain advantage on Deception and Stealth checks to pass yourself off as someone or something else.'},
      {level:17, name:'Death Strike', desc:'When you hit with your assassinate attack, target must make a CON save or take 6d6 poison damage.'}
    ]},
    { id:'arcane-trickster', name:'Arcane Trickster', flavorText:'A mage-rogue blend wielding enchantment and illusion magic.', features:[
      {level:3, name:'Spellcasting', desc:'You learn Enchantment and Illusion spells using Intelligence as your spellcasting ability.'},
      {level:9, name:'Magical Ambush', desc:'If you\'re hidden, creatures can\'t see you when you cast a spell. You have advantage on the attack roll.'},
      {level:13, name:'Versatile Trickster', desc:'Use Mage Hand Legerdemain to cast any spell that has a range of self on a target wearing the hand.'},
      {level:17, name:'Master Trickster', desc:'Use your Mage Hand Legerdemain action bonus action. Can use the hand to use a Magic Wand.'}
    ]}
  ],
  wizard: [
    { id:'abjuration', name:'Abjuration', flavorText:'Masters of protection and warding magic who shield allies and banish foes.', features:[
      {level:2, name:'Abjuration Savant', desc:'Abjuration spells cost 25% less to copy into your spellbook. Learn more cantrips.'},
      {level:6, name:'Arcane Ward', desc:'Create a protective ward with HP = your wizard level + INT mod. Damaged ward regains 1 HP/turn you cast abjuration spell.'},
      {level:10, name:'Projected Ward', desc:'Your Arcane Ward can protect a creature within 30 feet that you can see.'},
      {level:14, name:'Improved Abjuration', desc:'When creatures you can see within 60 ft fail a save vs your spell, they gain disadvantage on the next save.'}
    ]},
    { id:'conjuration', name:'Conjuration', flavorText:'Specialists in summoning creatures, objects, and teleportation.', features:[
      {level:2, name:'Conjuration Savant', desc:'Conjuration spells cost 25% less to copy into your spellbook.'},
      {level:6, name:'Minor Conjuration', desc:'You can use an action to conjure nonmagical object (< 1 lb, < 1 ft). It vanishes after 1 hour or when damaged.'},
      {level:10, name:'Benign Transposition', desc:'You can use an action to teleport up to 30 ft to an unoccupied space you can see.'},
      {level:14, name:'Focused Conjuration', desc:'Conjured creatures don\'t require concentration and can\'t be dismissed.'}
    ]},
    { id:'divination', name:'Divination', flavorText:'Seers and scriers who pierce the veil of the future and discern hidden truths.', features:[
      {level:2, name:'Divination Savant', desc:'Divination spells cost 25% less to copy into your spellbook.'},
      {level:6, name:'Portent', desc:'When you finish a long rest, roll 2d20. You can use these rolls to replace ability checks, attacks, or saves you see being made.'},
      {level:10, name:'Expert Divination', desc:'Casting divination spells doesn\'t require concentration. You gain an additional Portent roll.'},
      {level:14, name:'Greater Portent', desc:'You gain 3 Portent rolls instead of 2. They refresh on a long rest.'}
    ]},
    { id:'enchantment', name:'Enchantment', flavorText:'Masters of charm and mind magic who bend wills to their own.', features:[
      {level:2, name:'Enchantment Savant', desc:'Enchantment spells cost 25% less to copy into your spellbook.'},
      {level:6, name:'Hypnotic Gaze', desc:'When a creature within 5 ft makes an attack vs you, use reaction to impose disadvantage.'},
      {level:10, name:'Instinctive Charm', desc:'When a creature you can see damages you, use reaction to make it save vs charm or be charmed.'},
      {level:14, name:'Split Enchantment', desc:'When you cast an enchantment spell affecting one creature, you can affect two creatures instead.'}
    ]},
    { id:'evocation', name:'Evocation', flavorText:'Destructive specialists who harness raw elemental force.', features:[
      {level:2, name:'Evocation Savant', desc:'Evocation spells cost 25% less to copy into your spellbook.'},
      {level:6, name:'Sculpt Spells', desc:'When you cast an evocation spell, you can choose creatures in the area equal to 1 + spell level. They automatically succeed on saves.'},
      {level:10, name:'Potent Cantrip', desc:'Your damaging cantrips don\'t deal reduced damage to creatures that make a successful save.'},
      {level:14, name:'Empowered Evocation', desc:'Add your INT mod to evocation spell damage rolls. Usable once per turn.'}
    ]},
    { id:'illusion', name:'Illusion', flavorText:'Masters of deception and misdirection who weave false realities.', features:[
      {level:2, name:'Illusion Savant', desc:'Illusion spells cost 25% less to copy into your spellbook.'},
      {level:6, name:'Improved Minor Illusion', desc:'You can create minor illusions without material components and as a bonus action.'},
      {level:10, name:'Malleable Illusions', desc:'You can use an action to change an illusion\'s image as long as you can see it and stay within range.'},
      {level:14, name:'Illusory Self', desc:'When a creature targets you with an attack, use reaction to impose disadvantage. You create decoy image.'}
    ]},
    { id:'necromancy', name:'Necromancy', flavorText:'Dark practitioners who command death and undeath.', features:[
      {level:2, name:'Necromancy Savant', desc:'Necromancy spells cost 25% less to copy into your spellbook.'},
      {level:6, name:'Grim Harvest', desc:'Creatures killed by necromancy spells grant you temp HP = spell level + INT mod.'},
      {level:10, name:'Undead Thralls', desc:'Zombies and skeletons you animate gain additional benefits and ability score increases.'},
      {level:14, name:'Inured to Undeath', desc:'Necrotic damage can\'t reduce your HP below 1, and undead creatures can\'t sense you if you are invisible.'}
    ]},
    { id:'transmutation', name:'Transmutation', flavorText:'Shifters and changers who reshape matter and living flesh.', features:[
      {level:2, name:'Transmutation Savant', desc:'Transmutation spells cost 25% less to copy into your spellbook.'},
      {level:6, name:'Minor Alchemy', desc:'You can transmute raw materials: wood to stone, copper to silver, etc. Limited to 1 sq ft per level.'},
      {level:10, name:'Magical Dabbling', desc:'You can cast transmutation spells using sorcery points. Gain additional spell slots.'},
      {level:14, name:'Master Transmuter', desc:'Spend 1-6 sorcery points to transmute yourself or a creature: change appearance, gain resistance, enhance speed.'}
    ]}
  ],
  cleric: [
    { id:'life', name:'Life Domain', flavorText:'Gods of healing and vitality. Bonus healing and protection for allies.', features:[
      {level:1, name:'Life Domain Spells', desc:'Bless, Cure Wounds, Lesser Restoration, Spiritual Weapon gain bonus spells.'},
      {level:1, name:'Disciple of Life', desc:'When you cast a healing spell, add your WIS mod to the HP regained.'},
      {level:6, name:'Blessed Healer', desc:'When you cast a healing spell on another, you regain HP = half the healing given.'},
      {level:8, name:'Divine Strike', desc:'Once per turn, your weapon attacks deal extra 1d8 radiant damage.'},
      {level:17, name:'Supreme Healing', desc:'When you use a spell slot to cast a healing spell, roll all dice twice and use highest.'}
    ]},
    { id:'light', name:'Light Domain', flavorText:'Gods of sun and knowledge. Fire spells and divine blasts.', features:[
      {level:1, name:'Light Domain Spells', desc:'Burning Hands, Faerie Fire, Flaming Sphere, Fireball gain bonus spells.'},
      {level:1, name:'Warding Flare', desc:'When a creature within 30 ft attacks you, impose disadvantage using your reaction.'},
      {level:6, name:'Potent Spellcasting', desc:'Add your WIS mod to damage rolls for light domain spells.'},
      {level:8, name:'Divine Strike', desc:'Once per turn, your weapon attacks deal extra 1d8 radiant damage.'},
      {level:17, name:'Corona of Light', desc:'Enemies attacking you get disadvantage. Allies gain advantage on saves vs spells.'}
    ]},
    { id:'trickery', name:'Trickery Domain', flavorText:'Gods of deception and theft. Shadow magic and duplicity.', features:[
      {level:1, name:'Trickery Domain Spells', desc:'Charm Person, Invisibility, Mirror Image, Polymorph gain bonus spells.'},
      {level:1, name:'Blessing of the Trickster', desc:'You can use an action to grant a creature advantage on Stealth checks.'},
      {level:6, name:'Invoke Duplicity', desc:'Create an illusory duplicate of yourself that you can use for attacks and spells.'},
      {level:8, name:'Divine Strike', desc:'Once per turn, your weapon attacks deal extra 1d8 psychic damage.'},
      {level:17, name:'Improved Duplicity', desc:'You can create 2 duplicates instead of 1 and make ranged spell attacks from them.'}
    ]},
    { id:'war', name:'War Domain', flavorText:'Gods of battle and conflict. Extra attacks and martial prowess.', features:[
      {level:1, name:'War Domain Spells', desc:'Divine Favor, Shield, Spiritual Weapon, Wrathful Smite gain bonus spells.'},
      {level:1, name:'War Priest', desc:'Bonus action to make weapon attack when you take the Dodge or Disengage action.'},
      {level:6, name:'Blessing of the War God', desc:'You add your WIS mod to weapon attack damage rolls.'},
      {level:8, name:'Divine Strike', desc:'Once per turn, your weapon attacks deal extra 1d8 damage of your domain type.'},
      {level:17, name:'Avatar of Battle', desc:'You have advantage on attack rolls in combat and can\'t be slowed.'}
    ]},
    { id:'nature', name:'Nature Domain', flavorText:'Gods of wilderness and natural forces. Command of plants and animals.', features:[
      {level:1, name:'Nature Domain Spells', desc:'Animal Friendship, Entangle, Barkskin, Plant Growth gain bonus spells.'},
      {level:1, name:'Acolyte of Nature', desc:'Learn one druid cantrip. Gain proficiency in WIS (Animal Handling).'},
      {level:6, name:'Dampen Elements', desc:'Use Channel Divinity to grant resistance to acid, cold, fire, lightning, or thunder.'},
      {level:8, name:'Divine Strike', desc:'Once per turn, your weapon attacks deal extra 1d8 cold, fire, or lightning damage.'},
      {level:17, name:'Master of Nature', desc:'Control weather patterns, gain immunity to poison, resistance to poison damage.'}
    ]},
    { id:'tempest', name:'Tempest Domain', flavorText:'Gods of storms and the sea. Thunder and lightning magic.', features:[
      {level:1, name:'Tempest Domain Spells', desc:'Fog Cloud, Thunderwave, Lightning Bolt, Destructive Wave gain bonus spells.'},
      {level:1, name:'Wrath of the Storm', desc:'When attacked while standing, use reaction to stun the attacker if you damage them.'},
      {level:6, name:'Thunderbolt Strike', desc:'Use reaction to cause a creature you damage to make a STR save or fall prone.'},
      {level:8, name:'Divine Strike', desc:'Once per turn, your weapon attacks deal extra 1d8 thunder damage.'},
      {level:17, name:'Stormborn', desc:'You gain immunity to lightning and thunder, and fly without wings using air currents.'}
    ]},
    { id:'knowledge', name:'Knowledge Domain', flavorText:'Gods of knowledge and magic. Extra skill proficiency and spellcasting power.', features:[
      {level:1, name:'Knowledge Domain Spells', desc:'Identify, Detect Thoughts, Suggest, Confusion gain bonus spells.'},
      {level:1, name:'Blessings of Knowledge', desc:'Gain proficiency in two skills and three languages of your choice.'},
      {level:6, name:'Channel Divinity: Potent Spellcasting', desc:'Add your WIS mod to spell attack rolls and saving throw DCs.'},
      {level:8, name:'Divine Strike', desc:'Once per turn, your weapon attacks deal extra 1d8 psychic damage.'},
      {level:17, name:'Visions of Mastery', desc:'When you finish a long rest, choose one spell you can cast. You can cast it at will.'}
    ]}
  ],
  sorcerer: [
    { id:'draconic-bloodline', name:'Draconic Bloodline', flavorText:'Dragon blood flows through your veins, granting draconic power.', features:[
      {level:1, name:'Draconic Resilience', desc:'AC = 13 + DEX mod (if not wearing armor). You have darkvision 60 ft. You resist damage type of your draconic ancestor.'},
      {level:6, name:'Elemental Affinity', desc:'When you cast a spell of damage type matching your ancestry, add CHA mod to damage once per turn.'},
      {level:14, name:'Dragon Wings', desc:'You can use an action to conjure spectral draconic wings. Gain fly speed = movement speed.'},
      {level:18, name:'Draconic Presence', desc:'Enemies within 60 ft make WIS saves or be frightened. Allies gain advantage on saves.'}
    ]},
    { id:'wild-magic', name:'Wild Magic', flavorText:'Your magic is chaotic and unpredictable, surging with primal forces.', features:[
      {level:1, name:'Wild Magic Surge', desc:'When you cast a sorcerer spell, roll d20. On 1, roll Wild Magic Surge table.'},
      {level:6, name:'Tides of Chaos', desc:'Gain advantage on attack roll, ability check, or save. Initiative rolls benefit from spell bonus.'},
      {level:14, name:'Spell Bombardment', desc:'When you roll damage for sorcerer spell, roll d6. If you roll 4+, add 2d6 extra damage.'},
      {level:18, name:'Controlled Chaos', desc:'You can use an action to reroll d20s instead of surging. You gain 2 tides per long rest.'}
    ]}
  ],
  warlock: [
    { id:'archfey', name:'The Archfey', flavorText:'Your patron is a powerful fey creature offering otherworldly power.', features:[
      {level:1, name:'Expanded Spell List', desc:'Dimension Door, Faerie Fire, Phantasmal Force, Sleep, Suggestion gain bonus spells.'},
      {level:1, name:'One with Shadows', desc:'In darkness, you are invisible. You can sense creatures within 30 ft even if invisible.'},
      {level:6, name:'Misty Escape', desc:'When you take damage, use reaction to teleport up to 60 ft and become invisible.'},
      {level:10, name:'Bewitching Strike', desc:'Your attack spells charm targets on hit. They have disadvantage on saves vs charm.'},
      {level:14, name:'Master of Shadows', desc:'You can cast Invisibility at will. You are invisible while casting spells in darkness.'}
    ]},
    { id:'fiend', name:'The Fiend', flavorText:'You have made a bargain with a demon, devil, or dark entity.', features:[
      {level:1, name:'Expanded Spell List', desc:'Burning Hands, Command, Hellish Rebuke, Scorching Ray, Fireball gain bonus spells.'},
      {level:1, name:'Dark One\'s Blessing', desc:'When you reduce a creature to 0 HP, gain temporary HP = CHA mod + warlock level.'},
      {level:6, name:'Dark One\'s Own Luck', desc:'Use reaction to add d10 to an ability check or save. Recharges on short rest.'},
      {level:10, name:'Fiendish Resilience', desc:'Choose resistance type at end of long rest. You gain that resistance.'},
      {level:14, name:'Hurl Through Hell', desc:'When you damage a creature, teleport it to hell and back on next turn taking damage.'}
    ]},
    { id:'great-old-one', name:'The Great Old One', flavorText:'Your patron is an ancient cosmic entity of unknowable power.', features:[
      {level:1, name:'Expanded Spell List', desc:'Armor of Agathys, Disguise Self, Phantasmal Force, Telekinesis gain bonus spells.'},
      {level:1, name:'Awakened Mind', desc:'You can telepathically communicate with creatures you see within 30 ft.'},
      {level:6, name:'Entropic Ward', desc:'When a creature attacks you, use reaction to impose disadvantage. Range extends to 60 ft.'},
      {level:10, name:'Thought Shield', desc:'Creatures taking psychic damage from you have disadvantage on save. You are immune to psychic damage.'},
      {level:14, name:'Create Thrall', desc:'When you reduce a creature to 0 HP, it rises as thrall obeying your commands telepathically.'}
    ]}
  ],
  bard: [
    { id:'lore', name:'College of Lore', flavorText:'Master of knowledge and skill, master of others\' tricks.', features:[
      {level:3, name:'Bonus Proficiencies', desc:'Gain proficiency with any three skills of your choice.'},
      {level:6, name:'Peerless Skill', desc:'Add Bardic Inspiration die to ability checks you make once per short rest.'},
      {level:14, name:'Magical Secrets', desc:'Learn any two spells from any class. Gain spell slots for them.'},
      {level:20, name:'Superior Inspiration', desc:'Regain all Bardic Inspiration dice on short rests. Once per turn, you can give a die to a creature.'}
    ]},
    { id:'valor', name:'College of Valor', flavorText:'A master of martial arts as well as magical arts, blending combat and spellcasting.', features:[
      {level:3, name:'Bonus Proficiencies', desc:'Gain proficiency with medium armor, shields, and martial weapons.'},
      {level:6, name:'Extra Attack', desc:'Make two weapon attacks when you take the Attack action.'},
      {level:14, name:'Battle Magic', desc:'When you attack with weapon, cast cantrip using bonus action.'},
      {level:20, name:'Superior Inspiration', desc:'Regain all Bardic Inspiration dice on short rests. Bonus action attacks gain extra damage.'}
    ]}
  ],
  druid: [
    { id:'land', name:'Circle of the Land', flavorText:'Master of nature magic and a keeper of the natural balance.', features:[
      {level:2, name:'Bonus Cantrip', desc:'Learn one bonus cantrip of your choice.'},
      {level:2, name:'Natural Recovery', desc:'Regain spell slots on short rest equal to half druid level (rounded up).'},
      {level:6, name:'Land\'s Stride', desc:'Difficult terrain doesn\'t slow you. You are immune to being restrained by terrain/plants.'},
      {level:14, name:'Nature\'s Sanctuary', desc:'Beasts and plants won\'t willingly harm you. You have advantage on saves vs plant spells.'}
    ]},
    { id:'moon', name:'Circle of the Moon', flavorText:'Master of Wild Shape, a shapeshifter and predator of the night.', features:[
      {level:2, name:'Combat Wild Shape', desc:'Use Wild Shape as bonus action. Wild Shape HP = druid HP.'},
      {level:6, name:'Improved Wild Shape', desc:'Wild Shape forms get +1 to AC and dexterity saves.'},
      {level:10, name:'Elemental Wild Shape', desc:'Gain ability to Wild Shape into elemental forms.'},
      {level:14, name:'Thousand Forms', desc:'You can cast Alter Self at will without spell slots.'}
    ]}
  ],
  monk: [
    { id:'open-hand', name:'Way of the Open Hand', flavorText:'Master of weaponless martial arts and unarmed combat.', features:[
      {level:3, name:'Martial Arts', desc:'Unarmed strike damage increases to 1d6. You can use DEX for unarmed attacks instead of STR.'},
      {level:3, name:'Flurry of Blows', desc:'After attacking, use bonus action for two unarmed strikes. Costs 1 ki point.'},
      {level:6, name:'Dedicated Weapon', desc:'Choose a martial weapon. You can use it with martial arts die instead of its damage die.'},
      {level:11, name:'Quivering Palm', desc:'Spend 3 ki to inflict curse: creature makes CON save or takes 10d10 damage instantly.'},
      {level:17, name:'Quivering Palm Master', desc:'Quivering Palm damage increases to 20d10. You can spend ki to heal instead of damage.'}
    ]},
    { id:'shadow', name:'Way of Shadow', flavorText:'Master of stealth and shadow, a living assassin.', features:[
      {level:3, name:'Shadow Arts', desc:'Spend ki points: cast invisibility, darkvision, silence, or pass without trace without spells.'},
      {level:6, name:'Shadow Step', desc:'Teleport 60 ft to shadow you can see as bonus action. Gain advantage on next melee attack.'},
      {level:11, name:'Cloak of Shadows', desc:'In dim light or darkness, you are invisible to creatures that rely on sight.'},
      {level:17, name:'Opportunist', desc:'Use reaction to make unarmed strike when creature within 5 ft takes action.'}
    ]}
  ],
  paladin: [
    { id:'devotion', name:'Oath of Devotion', flavorText:'Knights of virtue and light sworn to protect the innocent.', features:[
      {level:3, name:'Channel Divinity: Sacred Weapon', desc:'Use action to gain +CHA to weapon attack rolls for 1 minute.'},
      {level:3, name:'Channel Divinity: Sanctuary', desc:'Creature makes WIS save or can\'t attack you or your allies for 1 minute.'},
      {level:7, name:'Aura of Protection', desc:'Allies within 10 ft gain bonus to saves and attack rolls = CHA mod.'},
      {level:15, name:'Peerless Athlete', desc:'Add CHA mod to Athletics checks.'},
      {level:20, name:'Holy Aura', desc:'Enemies that start turn within 10 ft make save or take 2d6 radiant damage.'}
    ]},
    { id:'vengeance', name:'Oath of Vengeance', flavorText:'Knights of retribution sworn to smite evil and injustice.', features:[
      {level:3, name:'Channel Divinity: Abjure Enemy', desc:'Creature makes save or speed becomes 0 for 1 minute.'},
      {level:3, name:'Channel Divinity: Vow of Enmity', desc:'Gain advantage on next attack against one creature you choose.'},
      {level:7, name:'Relentless Avenger', desc:'After hitting with melee attack, use bonus action to move 30 ft toward target.'},
      {level:15, name:'Soul of Vengeance', desc:'Use reaction to make weapon attack when target damages you.'},
      {level:20, name:'Avenging Angel', desc:'Gain wings and fly speed. Gain advantage on attacks.'}
    ]}
  ],
  ranger: [
    { id:'hunter', name:'Hunter Archetype', flavorText:'A skilled tracker and skilled slayer of dangerous creatures.', features:[
      {level:3, name:'Colossus Slayer', desc:'Once per turn on hit, add 1d8 damage to weapon attack.'},
      {level:7, name:'Multiattack', desc:'Make two weapon attacks when you take the Attack action.'},
      {level:11, name:'Volley', desc:'Action: ranged attack against all creatures in 10 ft radius.'},
      {level:15, name:'Evasion', desc:'When you take damage, use reaction to take half damage with DEX save.'},
      {level:20, name:'Superior Hunter\'s Defense', desc:'Gain multiple ways to improve defense, damage, and hit chance.'}
    ]},
    { id:'beast-master', name:'Beast Master Archetype', flavorText:'A ranger bonded with an animal companion in battle.', features:[
      {level:3, name:'Ranger\'s Companion', desc:'Gain an animal companion that acts on your initiative and obeys your commands.'},
      {level:7, name:'Exceptional Training', desc:'Your beast gains proficiency in DEX and WIS saves, and two skills.'},
      {level:11, name:'Bestial Fury', desc:'Your beast makes two attacks when you take the Attack action.'},
      {level:15, name:'Share Spells', desc:'When you cast a spell with a range of self, your beast gains the benefit.'},
      {level:20, name:'Unbreakable Bond', desc:'Your beast gains proficiency in all saves and resistance to all damage.'}
    ]}
  ],
  barbarian: [
    { id:'berserker', name:'Path of the Berserker', flavorText:'Channeling rage into devastating melee attacks.', features:[
      {level:3, name:'Frenzy', desc:'During rage, use bonus action to make weapon attack. Can happen each turn.'},
      {level:6, name:'Mindless Rage', desc:'Immunity to charm and fear while raging. Can\'t be charmed or frightened.'},
      {level:10, name:'Intimidating Presence', desc:'Enemies within 30 ft make WIS save or be frightened when you rage.'},
      {level:14, name:'Retaliation', desc:'Use reaction to make weapon attack when a creature damages you.'},
      {level:20, name:'Primal Champion', desc:'STR and CON each increase by 4. Max increases to 24.'}
    ]},
    { id:'totem-warrior', name:'Path of the Totem Warrior', flavorText:'Calling on animal spirits for primal power.', features:[
      {level:3, name:'Totem Spirit', desc:'Choose bear, eagle, or wolf. Gain benefits while raging based on choice.'},
      {level:6, name:'Aspect of the Beast', desc:'Gain permanent benefit from your totem spirit outside of rage.'},
      {level:11, name:'Spirit Walker', desc:'You can cast commune with nature and beast sense without material components.'},
      {level:14, name:'Totemic Attunement', desc:'Gain additional benefits and attacks from your totem in rage.'},
      {level:20, name:'Primal Champion', desc:'STR and CON each increase by 4. Max increases to 24.'}
    ]}
  ]
};
