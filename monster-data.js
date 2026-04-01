window.SRD_MONSTERS = [
  {
    "name": "Aboleth",
    "size": "Large",
    "type": "aberration",
    "alignment": "lawful evil",
    "ac": 17,
    "acType": "natural armor",
    "hp": 135,
    "hpFormula": "18d10+36",
    "speed": "10 ft., swim 40 ft.",
    "str": 21,
    "dex": 9,
    "con": 15,
    "int": 18,
    "wis": 15,
    "cha": 18,
    "saves": "Con +6, Int +8, Wis +6",
    "skills": "History +12, Perception +10",
    "senses": "darkvision 120 ft., passive Perception 20",
    "languages": "Deep Speech, telepathy 120 ft.",
    "cr": "10",
    "xp": 5900,
    "crNum": 10,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The aboleth can breathe air and water."
      },
      {
        "name": "Mucous Cloud",
        "desc": "While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or hits it with a melee attack within 5 feet must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours."
      },
      {
        "name": "Probing Telepathy",
        "desc": "If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The aboleth makes three tentacle attacks."
      },
      {
        "name": "Tentacle",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 12 (2d6 + 5) bludgeoning damage. If the target is a creature, it must succeed on a DC 14 Constitution saving throw or become diseased."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 15 (3d6 + 5) bludgeoning damage."
      },
      {
        "name": "Enslave (3/Day)",
        "desc": "The aboleth targets one creature it can see within 30 feet. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or is on a different plane."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The aboleth makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Swipe",
        "desc": "The aboleth makes one tail attack."
      },
      {
        "name": "Psychic Drain (Costs 2 Actions)",
        "desc": "One charmed creature takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage dealt."
      }
    ],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Acolyte",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 10,
    "acType": "natural armor",
    "hp": 9,
    "hpFormula": "2d8",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 14,
    "cha": 11,
    "saves": "Wisdom +4",
    "skills": "Medicine +4, Religion +2",
    "senses": "passive Perception 12",
    "languages": "any one language (usually Common)",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Spellcasting",
        "desc": "The acolyte is a 1st-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). The acolyte has following cleric spells prepared: Cantrips (at will): light, sacred flame, thaumaturgy; 1st level (3 slots): cure wounds, guiding bolt, sanctuary"
      }
    ],
    "actions": [
      {
        "name": "Mace",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 3 (1d6) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Adult Black Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 19,
    "acType": "natural armor",
    "hp": 195,
    "hpFormula": "17d12+85",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 23,
    "dex": 14,
    "con": 21,
    "int": 14,
    "wis": 13,
    "cha": 17,
    "saves": "Dex +7, Con +10, Wis +6, Cha +8",
    "skills": "Perception +11, Stealth +7",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 21",
    "languages": "Common, Draconic",
    "cr": "14",
    "xp": 11500,
    "crNum": 14,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 4 (1d8) acid damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is within 120 feet and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Acid Breath (Recharge 5-6)",
        "desc": "The dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 10 feet must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "acid",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Adult Red Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 19,
    "acType": "natural armor",
    "hp": 256,
    "hpFormula": "19d12+133",
    "speed": "40 ft., climb 40 ft., fly 80 ft.",
    "str": 27,
    "dex": 10,
    "con": 25,
    "int": 16,
    "wis": 13,
    "cha": 21,
    "saves": "Dex +6, Con +13, Wis +7, Cha +11",
    "skills": "Perception +13, Stealth +6",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 23",
    "languages": "Common, Draconic",
    "cr": "17",
    "xp": 18000,
    "crNum": 17,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 19 (2d10 + 8) piercing damage plus 7 (2d6) fire damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +14 to hit, reach 5 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is within 120 feet and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 63 (18d6) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 10 feet must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
      }
    ],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "fire",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Air Elemental",
    "size": "Large",
    "type": "elemental",
    "alignment": "neutral",
    "ac": 15,
    "acType": "natural armor",
    "hp": 39,
    "hpFormula": "6d10 + 12",
    "speed": "0 ft., fly 90 ft. (hover)",
    "str": 14,
    "dex": 16,
    "con": 14,
    "int": 6,
    "wis": 10,
    "cha": 7,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "understands Auran but can't speak",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Air Form",
        "desc": "The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 foot wide."
      },
      {
        "name": "Transparent",
        "desc": "Even when the elemental is in plain sight, it takes a successful DC 15 Wisdom (Perception) check to spot the elemental if it has neither moved nor attacked."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The elemental makes two slam attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) bludgeoning damage."
      },
      {
        "name": "Whirlwind (Recharge 4-6)",
        "desc": "Each creature in the elemental's space must make a DC 13 Strength saving throw. On a failed save, a target takes 15 (3d6 + 4) bludgeoning damage. If it is Large or smaller, it is also grappled (escape DC 14). Until the grapple ends, the target is restrained and unable to breathe unless it can breathe air. If the elemental moves, the grappled creature moves with it."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "damageVulnerabilities": ""
  },
  {
    "name": "Ancient Gold Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "lawful good",
    "ac": 22,
    "acType": "natural armor",
    "hp": 546,
    "hpFormula": "28d20 + 280",
    "speed": "40 ft., climb 40 ft., fly 80 ft., swim 40 ft.",
    "str": 30,
    "dex": 10,
    "con": 29,
    "int": 18,
    "wis": 17,
    "cha": 28,
    "saves": "Dexterity +7, Constitution +17, Wisdom +11, Charisma +17",
    "savingThrows": "Dexterity +7, Constitution +17, Wisdom +11, Charisma +17",
    "skills": "Arcana +11, Insight +11, Perception +18, Persuasion +17",
    "senses": "truesight 120 ft., passive Perception 28",
    "languages": "Draconic, telepathy 120 ft.",
    "cr": "24",
    "xp": 62000,
    "crNum": 24,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10 + 10) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +17 to hit, reach 10 ft., one target. Hit: 17 (2d6 + 10) slashing damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 90-foot cone. Each creature in that cone must make a DC 24 Dexterity saving throw, taking 91 (26d6) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "fire",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Ancient Red Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 22,
    "acType": "natural armor",
    "hp": 546,
    "hpFormula": "28d20 + 280",
    "speed": "40 ft., climb 40 ft., fly 80 ft.",
    "str": 30,
    "dex": 10,
    "con": 29,
    "int": 18,
    "wis": 15,
    "cha": 23,
    "saves": "Dexterity +7, Constitution +17, Wisdom +9, Charisma +13",
    "savingThrows": "Dexterity +7, Constitution +17, Wisdom +9, Charisma +13",
    "skills": "Insight +9, Perception +15",
    "senses": "truesight 120 ft., passive Perception 25",
    "languages": "Draconic, telepathy 120 ft.",
    "cr": "24",
    "xp": 62000,
    "crNum": 24,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Reactive",
        "desc": "The dragon can take one reaction on every turn of combat."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +17 to hit, reach 15 ft., one target. Hit: 21 (2d10 + 10) piercing damage. The target must succeed on a DC 24 Strength saving throw or be knocked prone."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +17 to hit, reach 10 ft., one target. Hit: 17 (2d6 + 10) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +17 to hit, reach 20 ft., one target. Hit: 19 (2d8 + 10) bludgeoning damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 90-foot cone. Each creature in that cone must make a DC 24 Dexterity saving throw, taking 91 (26d6) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "fire",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Animated Armor",
    "size": "Medium",
    "type": "construct",
    "alignment": "unaligned",
    "ac": 18,
    "acType": "natural armor",
    "hp": 33,
    "hpFormula": "6d8+6",
    "speed": "25 ft.",
    "str": 14,
    "dex": 11,
    "con": 13,
    "int": 1,
    "wis": 3,
    "cha": 1,
    "saves": "",
    "skills": "",
    "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 6",
    "languages": "",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "desc": "The armor is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the armor must succeed on a Constitution saving throw against the caster's spell save DC or fall prone."
      },
      {
        "name": "False Appearance",
        "desc": "While the armor remains motionless, it is indistinguishable from a normal suit of armor."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The armor makes two melee attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "poison, psychic",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Ankheg",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 14,
    "acType": "natural armor (11 while prone)",
    "hp": 39,
    "hpFormula": "6d10+6",
    "speed": "30 ft., burrow 10 ft.",
    "str": 17,
    "dex": 11,
    "con": 13,
    "int": 1,
    "wis": 13,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., tremorsense 60 ft., passive Perception 11",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) slashing damage plus 3 (1d6) acid damage. If the target is a Large or smaller creature, it is grappled (escape DC 13)."
      },
      {
        "name": "Acid Spray (Recharge 6)",
        "desc": "The ankheg spits acid in a line that is 30 feet long and 5 feet wide. Each creature in that line must make a DC 13 Dexterity saving throw, taking 10 (3d6) acid damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Ape",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 7,
    "hpFormula": "2d8-1",
    "speed": "30 ft., climb 30 ft.",
    "str": 16,
    "dex": 14,
    "con": 13,
    "int": 6,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Athletics +5, Perception +3",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The ape makes two fist attacks or two rock attacks."
      },
      {
        "name": "Fist",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) bludgeoning damage."
      },
      {
        "name": "Rock",
        "desc": "Ranged Weapon Attack: +5 to hit, range 25/50 ft., one target. Hit: 6 (1d6+3) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Archmage",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 12,
    "acType": "15 with mage armor",
    "hp": 99,
    "hpFormula": "18d8+18",
    "speed": "30 ft.",
    "str": 10,
    "dex": 14,
    "con": 12,
    "int": 16,
    "wis": 12,
    "cha": 14,
    "saves": "Int +5, Wis +3",
    "skills": "Arcana +8, History +8",
    "senses": "passive Perception 11",
    "languages": "any six languages",
    "cr": "12",
    "xp": 8400,
    "crNum": 12,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the archmage fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Magic Resistance",
        "desc": "The archmage has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Magic Weapons",
        "desc": "The archmage's weapon attacks are magical."
      }
    ],
    "actions": [
      {
        "name": "Dagger",
        "desc": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d4+2) piercing damage."
      }
    ],
    "legendaryActions": [
      {
        "name": "Cantrip",
        "desc": "The archmage casts a cantrip."
      },
      {
        "name": "Dagger Attack",
        "desc": "The archmage makes a dagger attack."
      },
      {
        "name": "Counterspell (Costs 2 Actions)",
        "desc": "The archmage interrupts an incoming spell that it can see within 60 feet and that is of a spell level it can understand. If the spell is cast by an arcane caster, the archmagee makes an Intelligence (Arcana) check (DC 10 + the spell's level). On a success, the archmage's spell fails and has no effect."
      }
    ],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Assassin",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any non-good alignment",
    "ac": 16,
    "acType": "studded leather armor",
    "hp": 78,
    "hpFormula": "12d8 + 24",
    "speed": "30 ft.",
    "str": 16,
    "dex": 16,
    "con": 14,
    "int": 13,
    "wis": 11,
    "cha": 10,
    "saves": "Dexterity +5, Intelligence +3, Wisdom +2",
    "skills": "Acrobatics +5, Deception +2, Perception +2, Stealth +8",
    "damageResistances": "poison",
    "senses": "passive Perception 12",
    "languages": "Thieves' cant plus any two languages",
    "cr": "8",
    "xp": 3900,
    "crNum": 8,
    "traits": [
      {
        "name": "Assassinate",
        "desc": "During its first turn, the assassin has advantage on attack rolls against any creature that hasn't taken a turn. Any hit the assassin scores against a surprised creature is a critical hit."
      },
      {
        "name": "Evasion",
        "desc": "If the assassin is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the assassin instead takes no damage if it succeeds on the saving throw, and only half damage if it fails."
      },
      {
        "name": "Assassinate",
        "desc": "During its first turn, the assassin has advantage on attack rolls against any creature that hasn't taken a turn. Any hit the assassin scores against a surprised creature is a critical hit."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The assassin makes two shortsword attacks."
      },
      {
        "name": "Shortsword",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 22 (4d8) poison damage on a failed save, or half as much damage on a successful one."
      },
      {
        "name": "Light Crossbow",
        "desc": "Ranged Weapon Attack: +5 to hit, range 80/320 ft., one target. Hit: 6 (1d8 + 3) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 22 (4d8) poison damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Awakened Shrub",
    "size": "Small",
    "type": "plant",
    "alignment": "unaligned",
    "ac": 9,
    "acType": "",
    "hp": 10,
    "hpFormula": "3d6",
    "speed": "20 ft.",
    "str": 3,
    "dex": 8,
    "con": 11,
    "int": 10,
    "wis": 10,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "one language the creator knows",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [],
    "actions": [
      {
        "name": "Rake",
        "desc": "Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1 (1d4-1) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Awakened Tree",
    "size": "Huge",
    "type": "plant",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "natural armor",
    "hp": 59,
    "hpFormula": "7d12+14",
    "speed": "20 ft.",
    "str": 19,
    "dex": 8,
    "con": 15,
    "int": 10,
    "wis": 10,
    "cha": 8,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "one language the creator knows",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [],
    "actions": [
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 14 (3d6+4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "bludgeoning, piercing",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "fire"
  },
  {
    "name": "Axe Beak",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "",
    "hp": 19,
    "hpFormula": "3d10+3",
    "speed": "50 ft.",
    "str": 15,
    "dex": 12,
    "con": 13,
    "int": 2,
    "wis": 10,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [],
    "actions": [
      {
        "name": "Beak",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 8 (1d12+2) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Azer",
    "size": "Medium",
    "type": "elemental",
    "alignment": "lawful neutral",
    "ac": 17,
    "acType": "natural armor",
    "hp": 39,
    "hpFormula": "6d8+12",
    "speed": "30 ft.",
    "str": 17,
    "dex": 12,
    "con": 15,
    "int": 12,
    "wis": 13,
    "cha": 10,
    "saves": "Con +4",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "Ignan",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Heated Body",
        "desc": "A creature that touches the azer or hits it with a melee attack while within 5 feet of it takes 3 (1d6) fire damage."
      },
      {
        "name": "Illumination",
        "desc": "The azer sheds bright light in a 10-foot radius and dim light for an additional 10 feet."
      }
    ],
    "actions": [
      {
        "name": "Greatsword",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "fire, poison; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "",
    "conditionImmunities": "exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "damageVulnerabilities": "cold"
  },
  {
    "name": "Baboon",
    "size": "Small",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "natural armor",
    "hp": 3,
    "hpFormula": "1d6",
    "speed": "40 ft.",
    "str": 8,
    "dex": 14,
    "con": 11,
    "int": 3,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 11",
    "languages": "",
    "cr": "0",
    "xp": 10,
    "crNum": 0,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Badger",
    "size": "Small",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "natural armor",
    "hp": 3,
    "hpFormula": "1d6",
    "speed": "30 ft., burrow 10 ft.",
    "str": 10,
    "dex": 11,
    "con": 13,
    "int": 2,
    "wis": 12,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "darkvision 30 ft., passive Perception 11",
    "languages": "",
    "cr": "0",
    "xp": 10,
    "crNum": 0,
    "traits": [
      {
        "name": "Keen Sense of Smell",
        "desc": "The badger has advantage on Wisdom (Perception) checks that rely on smell."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Balor",
    "size": "Huge",
    "type": "fiend",
    "subtype": "demon",
    "alignment": "chaotic evil",
    "ac": 19,
    "acType": "natural armor",
    "hp": 262,
    "hpFormula": "21d12+126",
    "speed": "40 ft., fly 80 ft.",
    "str": 26,
    "dex": 15,
    "con": 22,
    "int": 20,
    "wis": 16,
    "cha": 22,
    "saves": "Str +14, Con +12, Wis +9, Cha +12",
    "skills": "Insight +9, Perception +9",
    "senses": "truesight 120 ft., passive Perception 19",
    "languages": "Abyssal, telepathy 120 ft.",
    "cr": "19",
    "xp": 22000,
    "crNum": 19,
    "traits": [
      {
        "name": "Aura of Despair",
        "desc": "Any creature that starts its turn within 20 feet of the balor and can see it must succeed on a DC 20 Wisdom saving throw or take 13 (2d12) psychic damage."
      },
      {
        "name": "Aura of Hellfire",
        "desc": "At the start of each of the balor's turns, each creature within 30 feet of it takes 7 (2d6) fire damage, and nonmagical objects that aren't being worn or carried in that radius are ignited. A creature that touches the balor or hits it with a melee attack while within 5 feet of it takes 7 (2d6) fire damage."
      },
      {
        "name": "Magic Resistance",
        "desc": "The balor has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The balor makes two attacks with its longsword or two attacks with its whip."
      },
      {
        "name": "Longsword",
        "desc": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 21 (3d8+8) slashing damage plus 11 (2d10) lightning damage. If the balor is wielding the longsword with both hands, it deals an extra 11 (2d10) lightning damage (included in the attack)."
      },
      {
        "name": "Whip",
        "desc": "Melee Weapon Attack: +14 to hit, reach 30 ft., one target. Hit: 15 (2d6+8) slashing damage plus 11 (2d10) lightning damage, and the target must succeed on a DC 20 Strength saving throw or be knocked prone."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold, lightning; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Bandit",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any non-good alignment",
    "ac": 12,
    "acType": "leather armor",
    "hp": 16,
    "hpFormula": "3d8 + 3",
    "speed": "30 ft.",
    "str": 11,
    "dex": 16,
    "con": 12,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "Thieves' cant or any one language",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Scimitar",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      },
      {
        "name": "Light Crossbow",
        "desc": "Ranged Weapon Attack: +5 to hit, range 80/320 ft., one target. Hit: 7 (1d8 + 3) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Bandit Captain",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any non-good alignment",
    "ac": 15,
    "acType": "studded leather",
    "hp": 65,
    "hpFormula": "10d8+20",
    "speed": "30 ft.",
    "str": 15,
    "dex": 16,
    "con": 14,
    "int": 12,
    "wis": 11,
    "cha": 14,
    "saves": "Str +4, Dex +5, Wis +2",
    "skills": "Deception +4, Insight +2, Investigation +3, Stealth +6",
    "senses": "passive Perception 10",
    "languages": "Thieves' cant plus any two languages",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Parry",
        "desc": "The captain adds 2 to its AC against one melee attack that would hit it, provided that it can see the attacker and is wielding a melee weapon."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The captain makes three melee attacks: two with its scimitar and one with its dagger. Or the captain makes two ranged attacks with its daggers."
      },
      {
        "name": "Scimitar",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) slashing damage."
      },
      {
        "name": "Dagger",
        "desc": "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 5 (1d4+3) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [
      {
        "name": "Parry",
        "desc": "The captain adds 2 to its AC against one melee attack that would hit it, provided that it can see the attacker and is wielding a melee weapon."
      }
    ],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Barbed Devil",
    "size": "Medium",
    "type": "fiend",
    "subtype": "devil",
    "alignment": "lawful evil",
    "ac": 15,
    "acType": "natural armor",
    "hp": 110,
    "hpFormula": "13d8+52",
    "speed": "30 ft.",
    "str": 16,
    "dex": 17,
    "con": 18,
    "int": 12,
    "wis": 14,
    "cha": 14,
    "saves": "Str +5, Con +6, Wis +4, Cha +4",
    "skills": "Deception +4, Insight +4",
    "senses": "darkvision 120 ft., passive Perception 12",
    "languages": "Infernal, telepathy 120 ft.",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Barbed Hide",
        "desc": "At the start of each of the devil's turns, any creature grappling it takes 5 (1d10) piercing damage."
      },
      {
        "name": "Devil's Sight",
        "desc": "Magical darkness doesn't impede the devil's darkvision."
      },
      {
        "name": "Magic Resistance",
        "desc": "The devil has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The devil makes three melee attacks: two with its spear and one with its tail."
      },
      {
        "name": "Spear",
        "desc": "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 7 (1d8+3) piercing damage, or 8 (1d10+3) piercing damage if used with two hands to make a melee attack, plus 5 (2d4) poison damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Basilisk",
    "size": "Medium",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 15,
    "acType": "natural armor",
    "hp": 52,
    "hpFormula": "8d8+16",
    "speed": "20 ft.",
    "str": 16,
    "dex": 8,
    "con": 15,
    "int": 2,
    "wis": 8,
    "cha": 7,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 9",
    "languages": "",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Petrifying Gaze",
        "desc": "If a creature starts its turn within 30 feet of the basilisk and the two of them can see each other, the basilisk can force the creature to make a DC 12 Constitution saving throw if the basilisk isn't incapacitated. On a failed save, the creature magically begins to turn to stone and is restrained. It must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified until freed by the greater restoration spell or other magic."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) piercing damage plus 7 (2d6) poison damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Bat",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "natural armor",
    "hp": 1,
    "hpFormula": "1d4 - 1",
    "speed": "0 ft., fly 30 ft.",
    "str": 2,
    "dex": 15,
    "con": 8,
    "int": 2,
    "wis": 12,
    "cha": 4,
    "saves": "",
    "skills": "Perception +3",
    "senses": "blindsight 60 ft., passive Perception 13",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Echolocation",
        "desc": "The bat can't use its blindsight while deafened."
      },
      {
        "name": "Keen Hearing",
        "desc": "The bat has advantage on Wisdom (Perception) checks that rely on hearing."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +0 to hit, reach 5 ft., one creature. Hit: 1 (1d4 - 1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Beholder",
    "size": "Large",
    "type": "aberration",
    "alignment": "lawful evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 180,
    "hpFormula": "19d10+76",
    "speed": "0 ft., fly 20 ft. (hover)",
    "str": 10,
    "dex": 14,
    "con": 18,
    "int": 17,
    "wis": 15,
    "cha": 17,
    "saves": "Int +8, Wis +7, Cha +8",
    "skills": "Perception +12",
    "senses": "darkvision 120 ft., passive Perception 22",
    "languages": "Deep Speech, Undercommon",
    "cr": "13",
    "xp": 10000,
    "crNum": 13,
    "traits": [
      {
        "name": "Antimagic Cone",
        "desc": "The beholder's central eye creates an area of antimagic, as in the antimagic field spell, in a 150-foot cone. At the start of each of its turns, the beholder decides which way the cone faces and whether the cone is active."
      },
      {
        "name": "Eye Rays",
        "desc": "The beholder shoots three of its eye rays at random, each targeting a creature it can see within 120 feet. See the full stat block for ray effects."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 14 (4d6) piercing damage."
      },
      {
        "name": "Eye Rays",
        "desc": "The beholder shoots three eye rays at random, choosing one to three targets within 120 ft. Rays include: Charm Ray (DC 16 Wis), Paralyzing Ray (DC 16 Con), Fear Ray (DC 16 Wis), Slowing Ray (DC 16 Dex), Enervation Ray (DC 16 Con, 36 necrotic), Telekinetic Ray, Sleep Ray (DC 16 Wis), Petrification Ray (DC 16 Dex), Disintegration Ray (DC 16 Dex, 45 force), Death Ray (DC 16 Dex, 55 necrotic)."
      }
    ],
    "legendaryActions": [
      {
        "name": "Eye Ray",
        "desc": "The beholder uses one random eye ray."
      }
    ],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "prone",
    "damageVulnerabilities": ""
  },
  {
    "name": "Berserker",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "chaotic neutral",
    "ac": 13,
    "acType": "hide armor",
    "hp": 67,
    "hpFormula": "9d8 + 27",
    "speed": "30 ft.",
    "str": 16,
    "dex": 12,
    "con": 16,
    "int": 9,
    "wis": 11,
    "cha": 9,
    "saves": "Strength +5, Constitution +5",
    "skills": "Intimidation +2",
    "senses": "passive Perception 10",
    "languages": "any one language (usually Common)",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Reckless Attack",
        "desc": "At the start of its turn, the berserker can gain advantage on all melee weapon attack rolls during that turn, but attack rolls against it have advantage until the start of its next turn."
      },
      {
        "name": "Parry",
        "desc": "The berserker adds 2 to its AC against one melee attack that it can see being made against it, provided it's wielding a melee weapon."
      }
    ],
    "actions": [
      {
        "name": "Greataxe",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12 + 3) slashing damage."
      },
      {
        "name": "Handaxe",
        "desc": "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [
      {
        "name": "Parry",
        "desc": "The berserker adds 2 to its AC against one melee attack that it can see being made against it, provided it's wielding a melee weapon."
      }
    ],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Black Bear",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "natural armor",
    "hp": 27,
    "hpFormula": "5d8+5",
    "speed": "40 ft., climb 30 ft.",
    "str": 15,
    "dex": 10,
    "con": 13,
    "int": 2,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +3",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The bear makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4+2) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Black Dragon Wyrmling",
    "size": "Tiny",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 16,
    "acType": "natural armor",
    "hp": 22,
    "hpFormula": "5d4 + 10",
    "speed": "30 ft., fly 60 ft., swim 30 ft.",
    "str": 13,
    "dex": 14,
    "con": 15,
    "int": 12,
    "wis": 11,
    "cha": 13,
    "saves": "Dexterity +4, Constitution +4, Wisdom +2, Charisma +3",
    "savingThrows": "Dexterity +4, Constitution +4, Wisdom +2, Charisma +3",
    "skills": "Perception +4, Stealth +4",
    "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 14",
    "languages": "Draconic",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10 + 2) piercing damage."
      },
      {
        "name": "Breath Weapon (Recharge 5-6)",
        "desc": "The dragon exhales acid in a 15-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 22 (4d8) acid damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "acid",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Black Pudding",
    "size": "Large",
    "type": "ooze",
    "alignment": "unaligned",
    "ac": 7,
    "acType": "natural armor",
    "hp": 85,
    "hpFormula": "10d10 + 30",
    "speed": "20 ft., climb 20 ft.",
    "str": 16,
    "dex": 5,
    "con": 16,
    "int": 1,
    "wis": 6,
    "cha": 1,
    "saves": "",
    "skills": "",
    "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 8",
    "languages": "",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [
      {
        "name": "Amorphous",
        "desc": "The pudding can occupy another creature's space and vice versa."
      },
      {
        "name": "Corrosive Form",
        "desc": "A creature that touches the pudding or hits it with a melee attack while within 5 feet of it takes 4 (1d8) acid damage. Any nonmagical weapon made of metal or wood that hits the pudding corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If a weapon's penalty reaches -5, it is destroyed. Nonmagical ammunition made of metal or wood that hits the pudding is destroyed."
      },
      {
        "name": "Spider Climb",
        "desc": "The pudding can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      }
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) bludgeoning damage plus 7 (2d6) acid damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [
      {
        "name": "Split",
        "desc": "When a pudding that is Medium or larger is subjected to lightning or slashing damage, it can use its reaction to split into two new puddings if it has at least 10 hit points. Each new pudding has hit points equal to half the original pudding's, rounded down. Nonmagical weapons made of metal or wood splinter when they make contact with the pudding. The pudding can move through a space as narrow as 1 foot wide."
      }
    ],
    "damageResistances": "",
    "damageImmunities": "acid, cold, lightning, slashing",
    "conditionImmunities": "blinded, charmed, deafened, exhaustion, frightened, prone",
    "damageVulnerabilities": ""
  },
  {
    "name": "Blood Hawk",
    "size": "Small",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 7,
    "hpFormula": "2d6",
    "speed": "10 ft., fly 60 ft.",
    "str": 6,
    "dex": 14,
    "con": 10,
    "int": 3,
    "wis": 14,
    "cha": 5,
    "saves": "",
    "skills": "Perception +4",
    "senses": "passive Perception 14",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [
      {
        "name": "Keen Sight",
        "desc": "The hawk has advantage on Wisdom (Perception) checks that rely on sight."
      }
    ],
    "actions": [
      {
        "name": "Beak",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Blue Dragon Wyrmling",
    "size": "Medium",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 17,
    "acType": "natural armor",
    "hp": 52,
    "hpFormula": "8d8+16",
    "speed": "30 ft., fly 60 ft., burrow 30 ft.",
    "str": 17,
    "dex": 10,
    "con": 15,
    "int": 12,
    "wis": 13,
    "cha": 15,
    "saves": "Dex +2, Con +4, Wis +3, Cha +4",
    "skills": "Insight +3, Perception +5, Stealth +2",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 15",
    "languages": "Draconic",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d10+3) piercing damage."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 22 (4d8+4) lightning damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "lightning",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Boar",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "natural armor",
    "hp": 11,
    "hpFormula": "2d8+2",
    "speed": "40 ft.",
    "str": 13,
    "dex": 10,
    "con": 13,
    "int": 2,
    "wis": 11,
    "cha": 4,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Charge",
        "desc": "If the boar moves at least 5 feet straight toward a creature and then hits it with a tusk attack on the same turn, that target must succeed on a DC 11 Strength saving throw or be knocked prone. If the target is prone, the boar can make one bite attack against it as a bonus action."
      },
      {
        "name": "Relentless (Recharges after a Rest)",
        "desc": "If the boar takes 5 damage or less, it can take a reaction to move up to its speed without provoking opportunity attacks."
      }
    ],
    "actions": [
      {
        "name": "Tusk",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) slashing damage."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4+1) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Bone Devil",
    "size": "Large",
    "type": "fiend",
    "subtype": "devil",
    "alignment": "lawful evil",
    "ac": 19,
    "acType": "natural armor",
    "hp": 142,
    "hpFormula": "15d10+60",
    "speed": "40 ft., fly 40 ft.",
    "str": 19,
    "dex": 16,
    "con": 18,
    "int": 14,
    "wis": 12,
    "cha": 16,
    "saves": "Int +5, Wis +4, Cha +6",
    "skills": "Deception +6, Insight +4",
    "senses": "darkvision 120 ft., passive Perception 11",
    "languages": "Infernal, telepathy 120 ft.",
    "cr": "9",
    "xp": 5000,
    "crNum": 9,
    "traits": [
      {
        "name": "Devil's Sight",
        "desc": "Magical darkness doesn't impede the devil's darkvision."
      },
      {
        "name": "Magic Resistance",
        "desc": "The devil has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The devil makes three attacks: two with its claws and one with its sting."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 8 (1d8+4) slashing damage."
      },
      {
        "name": "Sting",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 10 (2d6+3) piercing damage plus 27 (6d8) poison damage, and the target must succeed on a DC 14 Constitution saving throw or become poisoned until the end of its next turn."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Brass Dragon Wyrmling",
    "size": "Medium",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 16,
    "acType": "natural armor",
    "hp": 22,
    "hpFormula": "3d8+9",
    "speed": "30 ft., fly 60 ft., burrow 30 ft.",
    "str": 15,
    "dex": 14,
    "con": 17,
    "int": 12,
    "wis": 11,
    "cha": 13,
    "saves": "Dex +4, Con +5, Wis +2, Cha +3",
    "skills": "Perception +4, Stealth +2",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 14",
    "languages": "Draconic",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10+2) piercing damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 15-foot line that is 5 feet wide. Each creature in that line must make a DC 13 Dexterity saving throw, taking 22 (4d8+4) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "fire",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Bronze Dragon Wyrmling",
    "size": "Medium",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 17,
    "acType": "natural armor",
    "hp": 32,
    "hpFormula": "5d8+10",
    "speed": "30 ft., fly 60 ft., swim 30 ft.",
    "str": 17,
    "dex": 10,
    "con": 15,
    "int": 12,
    "wis": 13,
    "cha": 12,
    "saves": "Dex +2, Con +4, Wis +3, Cha +3",
    "skills": "Insight +3, Perception +5, Stealth +2",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 15",
    "languages": "Draconic",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d10+3) piercing damage."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 16 (3d8+3) lightning damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "lightning",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Brown Bear",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "natural armor",
    "hp": 34,
    "hpFormula": "4d10+12",
    "speed": "40 ft., climb 30 ft.",
    "str": 19,
    "dex": 10,
    "con": 16,
    "int": 2,
    "wis": 13,
    "cha": 7,
    "saves": "",
    "skills": "Perception +3",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The bear makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 8 (1d8+4) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Bulette",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 17,
    "acType": "natural armor",
    "hp": 94,
    "hpFormula": "9d10+45",
    "speed": "40 ft., burrow 40 ft.",
    "str": 19,
    "dex": 11,
    "con": 21,
    "int": 2,
    "wis": 10,
    "cha": 5,
    "saves": "",
    "skills": "Perception +6",
    "senses": "darkvision 60 ft., tremorsense 60 ft., passive Perception 16",
    "languages": "",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Standing Leap",
        "desc": "The bulette's long jump is up to 30 feet and its high jump is up to 15 feet, with or without a running start."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 30 (4d12 + 4) piercing damage."
      },
      {
        "name": "Deadly Leap",
        "desc": "If the bulette jumps at least 15 feet as part of its movement, it can then use this action to land on its feet in a space that contains one or more other creatures. Each of those creatures must succeed on a DC 16 Strength or Dexterity saving throw (target's choice) or be knocked prone and take 14 (3d6 + 4) bludgeoning damage plus 14 (3d6 + 4) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Camel",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "",
    "hp": 15,
    "hpFormula": "2d10+4",
    "speed": "50 ft.",
    "str": 16,
    "dex": 9,
    "con": 14,
    "int": 2,
    "wis": 11,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [
      {
        "name": "Spit",
        "desc": "The camel can spit up to 30 feet. A creature hit with the spit must succeed on a DC 12 Dexterity saving throw or be blinded until the end of its next turn."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) bludgeoning damage."
      },
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (2d4+3) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Cat",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 1,
    "hpFormula": "1d4-1",
    "speed": "40 ft., climb 30 ft.",
    "str": 3,
    "dex": 15,
    "con": 8,
    "int": 2,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +2, Stealth +4",
    "senses": "passive Perception 12",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [
      {
        "name": "Keen Smell",
        "desc": "The cat has advantage on Wisdom (Perception) checks that rely on smell."
      }
    ],
    "actions": [
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 (1d4-1) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Centaur",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "neutral good",
    "ac": 12,
    "acType": "",
    "hp": 45,
    "hpFormula": "6d10+12",
    "speed": "50 ft.",
    "str": 18,
    "dex": 14,
    "con": 14,
    "int": 9,
    "wis": 13,
    "cha": 11,
    "saves": "Wis +3",
    "skills": "Athletics +6, Insight +3, Medicine +3, Perception +3, Survival +3",
    "senses": "passive Perception 13",
    "languages": "Elvish, Sylvan",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The centaur makes two attacks: one melee and one ranged."
      },
      {
        "name": "Pike",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 9 (1d10+4) piercing damage."
      },
      {
        "name": "Longbow",
        "desc": "Ranged Weapon Attack: +4 to hit, range 150/600 ft., one target. Hit: 6 (1d8+2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Chimera",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "chaotic evil",
    "ac": 14,
    "acType": "natural armor",
    "hp": 114,
    "hpFormula": "12d10+48",
    "speed": "30 ft., fly 60 ft.",
    "str": 19,
    "dex": 11,
    "con": 19,
    "int": 3,
    "wis": 14,
    "cha": 10,
    "saves": "",
    "skills": "Perception +8",
    "senses": "darkvision 60 ft., passive Perception 18",
    "languages": "understands Draconic but can't speak",
    "cr": "6",
    "xp": 2300,
    "crNum": 6,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The chimera makes three attacks: one with its bite, one with its horns, and one with its claws. When its fire breath is available, it can use the breath in place of its bite or horns."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) piercing damage."
      },
      {
        "name": "Horns",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 10 (1d12 + 4) bludgeoning damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon head exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Dexterity saving throw, taking 31 (7d8) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Chuul",
    "size": "Large",
    "type": "aberration",
    "alignment": "chaotic evil",
    "ac": 16,
    "acType": "natural armor",
    "hp": 93,
    "hpFormula": "11d10+33",
    "speed": "30 ft., swim 30 ft.",
    "str": 19,
    "dex": 10,
    "con": 16,
    "int": 5,
    "wis": 11,
    "cha": 5,
    "saves": "",
    "skills": "Perception +4",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "understands Deep Speech but can't speak",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The chuul can breathe air and water."
      },
      {
        "name": "Sense Magic",
        "desc": "The chuul senses magic within 120 feet of it at will."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The chuul makes two pincer attacks. If the chuul is grappling a creature, it can also use its tentacles once."
      },
      {
        "name": "Pincer",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 11 (2d6 + 4) bludgeoning damage. The target is grappled (escape DC 14)."
      },
      {
        "name": "Tentacles",
        "desc": "One creature grappled by the chuul must succeed on a DC 13 Constitution saving throw or be poisoned for 1 minute. Until this poison ends, the target is paralyzed."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Clay Golem",
    "size": "Large",
    "type": "construct",
    "alignment": "unaligned",
    "ac": 14,
    "acType": "natural armor",
    "hp": 133,
    "hpFormula": "14d10+56",
    "speed": "20 ft.",
    "str": 20,
    "dex": 8,
    "con": 18,
    "int": 3,
    "wis": 8,
    "cha": 1,
    "saves": "Wis +1",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 9",
    "languages": "understands the languages of its creator but can't speak",
    "cr": "9",
    "xp": 5000,
    "crNum": 9,
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "desc": "The golem is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the golem must succeed on a Constitution saving throw against the caster's spell save DC or fall prone."
      },
      {
        "name": "Aversion of Fire",
        "desc": "If the golem takes fire damage, it has disadvantage on attack rolls and ability checks until the end of its next turn."
      },
      {
        "name": "Immutable Form",
        "desc": "The golem is immune to any spell or effect that would alter its form."
      },
      {
        "name": "Magic Resistance",
        "desc": "The golem has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The golem makes two slam attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 16 (2d10+5) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "acid, cold, fire, lightning, piercing, slashing",
    "damageImmunities": "poison, psychic",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Cloud Giant",
    "size": "Huge",
    "type": "giant",
    "alignment": "chaotic evil",
    "ac": 17,
    "acType": "plate",
    "hp": 200,
    "hpFormula": "16d12+96",
    "speed": "40 ft., fly 40 ft.",
    "str": 27,
    "dex": 10,
    "con": 22,
    "int": 12,
    "wis": 16,
    "cha": 16,
    "saves": "Str +12, Con +10, Wis +7, Cha +7",
    "skills": "Insight +7, Perception +7",
    "senses": "passive Perception 17",
    "languages": "Giant, Primordial",
    "cr": "12",
    "xp": 8400,
    "crNum": 12,
    "traits": [
      {
        "name": "Innate Spellcasting",
        "desc": "The giant's spellcasting ability is Charisma. It can innately cast the following spells, requiring no material components: At will: detect magic, fog cloud"
      },
      {
        "name": "Keen Smell",
        "desc": "The giant has advantage on Wisdom (Perception) checks that rely on smell."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The giant makes two attacks with its morningstar."
      },
      {
        "name": "Morningstar",
        "desc": "Melee Weapon Attack: +12 to hit, reach 10 ft., one target. Hit: 21 (3d8+8) piercing damage."
      },
      {
        "name": "Rock",
        "desc": "Ranged Weapon Attack: +12 to hit, range 60/240 ft., one target. Hit: 30 (4d10+8) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Cockatrice",
    "size": "Small",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "",
    "hp": 27,
    "hpFormula": "6d6+6",
    "speed": "20 ft., fly 40 ft.",
    "str": 6,
    "dex": 12,
    "con": 12,
    "int": 2,
    "wis": 13,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one creature. Hit: 3 (1d4 + 1) piercing damage, and the target must succeed on a DC 11 Constitution saving throw against being magically petrified. On a failed save, the creature begins to turn to stone and is restrained. It must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified for 24 hours."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Commoner",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 10,
    "acType": "natural armor",
    "hp": 4,
    "hpFormula": "1d8",
    "speed": "30 ft.",
    "str": 10,
    "dex": 10,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 10,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "any one language (usually Common)",
    "cr": "0",
    "xp": 10,
    "crNum": 0,
    "traits": [],
    "actions": [
      {
        "name": "Club",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Constrictor Snake",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 13,
    "hpFormula": "2d10+2",
    "speed": "30 ft., swim 30 ft.",
    "str": 15,
    "dex": 14,
    "con": 13,
    "int": 1,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "Perception +2",
    "senses": "blindsight 10 ft., passive Perception 12",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) piercing damage."
      },
      {
        "name": "Constrict",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) bludgeoning damage. If the target is Medium or smaller, it is grappled (escape DC 14). Until this grapple ends, the target is restrained, and the snake can't constrict another target."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Copper Dragon Wyrmling",
    "size": "Medium",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 16,
    "acType": "natural armor",
    "hp": 22,
    "hpFormula": "3d8+9",
    "speed": "30 ft., climb 30 ft., fly 60 ft.",
    "str": 15,
    "dex": 14,
    "con": 17,
    "int": 14,
    "wis": 11,
    "cha": 13,
    "saves": "Dex +4, Con +5, Int +3, Cha +3",
    "skills": "Arcana +3, Perception +4, Stealth +2",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 14",
    "languages": "Draconic",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10+2) piercing damage."
      },
      {
        "name": "Acid Breath (Recharge 5-6)",
        "desc": "The dragon exhales acid in a 15-foot line that is 5 feet wide. Each creature in that line must make a DC 13 Dexterity saving throw, taking 22 (4d8+4) acid damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "acid",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Couatl",
    "size": "Medium",
    "type": "celestial",
    "alignment": "lawful good",
    "ac": 19,
    "acType": "natural armor",
    "hp": 97,
    "hpFormula": "13d8+39",
    "speed": "25 ft., fly 75 ft.",
    "str": 16,
    "dex": 14,
    "con": 16,
    "int": 18,
    "wis": 20,
    "cha": 18,
    "saves": "Wis +8, Cha +7",
    "skills": "Arcana +7, Insight +8, Perception +8, Religion +7",
    "senses": "truesight 120 ft., passive Perception 18",
    "languages": "all, telepathy 120 ft.",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [
      {
        "name": "Innate Spellcasting",
        "desc": "The couatl's innate spellcasting ability is Charisma (spell save DC 15). It can innately cast the following spells, requiring only verbal components: At will: detect evil and good, detect magic, detect thoughts"
      },
      {
        "name": "Magic Resistance",
        "desc": "The couatl has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Magic Weapons",
        "desc": "The couatl's weapon attacks are magical."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 6 (1d6+3) piercing damage, and the target must succeed on a DC 15 Constitution saving throw or take 7 (2d6) poison damage."
      },
      {
        "name": "Constrict",
        "desc": "Melee Weapon Attack: +5 to hit, reach 10 ft., one target. Hit: 8 (2d6+2) bludgeoning damage, and the target is grappled (escape DC 15). Until this grapple ends, the target is unable to breathe unless it can breathe without lungs. If the couatl moves, the grappled creature moves with it."
      }
    ],
    "legendaryActions": [],
    "reactions": [
      {
        "name": "Reaction",
        "desc": "The couatl adds 4 to its AC against one attack that would hit it. To do so, the couatl must see the attacker and be wielding a melee weapon."
      }
    ],
    "damageResistances": "radiant",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Crab",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "natural armor",
    "hp": 1,
    "hpFormula": "1d4 - 1",
    "speed": "30 ft., swim 30 ft.",
    "str": 3,
    "dex": 11,
    "con": 8,
    "int": 1,
    "wis": 8,
    "cha": 2,
    "saves": "",
    "skills": "Stealth +2",
    "senses": "blindsight 30 ft., passive Perception 9",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The crab can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Crocodile",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "natural armor",
    "hp": 19,
    "hpFormula": "3d10+3",
    "speed": "20 ft., swim 30 ft.",
    "str": 15,
    "dex": 10,
    "con": 13,
    "int": 2,
    "wis": 10,
    "cha": 5,
    "saves": "",
    "skills": "Stealth +2",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Hold Breath",
        "desc": "The crocodile can hold its breath for 15 minutes."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10+2) piercing damage. If the target is a creature, it is grappled (escape DC 12). Until this grapple ends, the target is restrained, and the crocodile can't bite another target."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Cultist",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any non-good alignment",
    "ac": 12,
    "acType": "leather armor",
    "hp": 16,
    "hpFormula": "3d8 + 3",
    "speed": "30 ft.",
    "str": 11,
    "dex": 12,
    "con": 13,
    "int": 10,
    "wis": 11,
    "cha": 10,
    "saves": "Wisdom +2",
    "skills": "Deception +2, Religion +2",
    "senses": "passive Perception 10",
    "languages": "any one language (usually Common)",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [
      {
        "name": "Dark Devotion",
        "desc": "The cultist has advantage on saving throws against being charmed or frightened."
      }
    ],
    "actions": [
      {
        "name": "Scimitar",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Cyclops",
    "size": "Huge",
    "type": "humanoid",
    "subtype": "giant",
    "alignment": "chaotic evil",
    "ac": 14,
    "acType": "natural armor",
    "hp": 138,
    "hpFormula": "12d12+60",
    "speed": "30 ft.",
    "str": 22,
    "dex": 11,
    "con": 20,
    "int": 8,
    "wis": 8,
    "cha": 10,
    "saves": "",
    "skills": "Perception +4",
    "senses": "passive Perception 14",
    "languages": "Giant",
    "cr": "6",
    "xp": 2300,
    "crNum": 6,
    "traits": [
      {
        "name": "Poor Depth Perception",
        "desc": "The cyclops has disadvantage on attack rolls against targets more than 30 feet away."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The cyclops makes two greataxe attacks."
      },
      {
        "name": "Greataxe",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 25 (3d12+6) slashing damage."
      },
      {
        "name": "Rock",
        "desc": "Ranged Weapon Attack: +9 to hit, range 30/120 ft., one target. Hit: 28 (4d10+6) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Deer",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "",
    "hp": 4,
    "hpFormula": "1d8",
    "speed": "40 ft.",
    "str": 11,
    "dex": 16,
    "con": 11,
    "int": 2,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "Perception +2",
    "senses": "passive Perception 12",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Deva",
    "size": "Medium",
    "type": "celestial",
    "alignment": "lawful good",
    "ac": 17,
    "acType": "natural armor",
    "hp": 136,
    "hpFormula": "13d8+78",
    "speed": "30 ft., fly 90 ft.",
    "str": 18,
    "dex": 17,
    "con": 18,
    "int": 17,
    "wis": 20,
    "cha": 19,
    "saves": "Wis +8, Cha +7",
    "skills": "Insight +8, Perception +8",
    "senses": "truesight 120 ft., passive Perception 18",
    "languages": "all, telepathy 120 ft.",
    "cr": "10",
    "xp": 5900,
    "crNum": 10,
    "traits": [
      {
        "name": "Innate Spellcasting",
        "desc": "The deva's spellcasting ability is Charisma (spell save DC 16). It can innately cast the following spells, requiring only verbal components: At will: detect evil and good, detect magic, detect thoughts"
      },
      {
        "name": "Magic Resistance",
        "desc": "The deva has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Magic Weapons",
        "desc": "The deva's weapon attacks are magical."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The deva makes two attacks with its mace."
      },
      {
        "name": "Mace",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 12 (2d6+5) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "radiant; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Dire Wolf",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "natural armor",
    "hp": 37,
    "hpFormula": "5d10+10",
    "speed": "50 ft.",
    "str": 17,
    "dex": 15,
    "con": 15,
    "int": 3,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +3, Stealth +4",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Keen Hearing and Smell",
        "desc": "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      },
      {
        "name": "Pack Tactics",
        "desc": "The wolf has advantage on an attack roll against a creature if at least one other wolf is within 5 feet of the target and the other wolf isn't incapacitated."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) piercing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Displacer Beast",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "lawful evil",
    "ac": 13,
    "acType": "natural armor",
    "hp": 85,
    "hpFormula": "10d10+30",
    "speed": "40 ft.",
    "str": 18,
    "dex": 15,
    "con": 16,
    "int": 6,
    "wis": 12,
    "cha": 8,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Avoidance",
        "desc": "If the displacer beast is subjected to an effect that allows it to make a saving throw to take only half damage, it instead takes no damage if it succeeds on the saving throw, and only half damage if it fails."
      },
      {
        "name": "Displacement",
        "desc": "The displacer beast projects a magical illusion that makes it appear to be standing near its actual location, causing attack rolls against it to have disadvantage. If it is hit by an attack, this trait is disrupted until the end of its next turn."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The displacer beast makes two attacks with its tentacles."
      },
      {
        "name": "Tentacle",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 7 (1d6 + 4) bludgeoning damage plus 3 (1d6) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Djinni",
    "size": "Large",
    "type": "elemental",
    "alignment": "chaotic good",
    "ac": 17,
    "acType": "natural armor",
    "hp": 161,
    "hpFormula": "14d10 + 84",
    "speed": "0 ft., fly 90 ft. (hover)",
    "str": 21,
    "dex": 15,
    "con": 22,
    "int": 15,
    "wis": 16,
    "cha": 20,
    "saves": "Intelligence +6, Wisdom +7, Charisma +9",
    "savingThrows": "Intelligence +6, Wisdom +7, Charisma +9",
    "skills": "Insight +7, Perception +7",
    "damageResistances": "lightning, thunder",
    "senses": "darkvision 120 ft., truesight 120 ft., passive Perception 17",
    "languages": "Auran, Common, telepathy 120 ft.",
    "cr": "11",
    "xp": 7200,
    "crNum": 11,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The djinni can breathe air and water."
      },
      {
        "name": "Innate Spellcasting",
        "desc": "The djinni's innate spellcasting ability is Charisma (spell save DC 17). It can innately cast the following spells, requiring no material components: At will: detect evil and good, detect magic, thunderwave; 3/day each: create food and water, invisibility, plane shift; 1/day each: wish"
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the djinni fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The djinni makes three scimitar attacks."
      },
      {
        "name": "Scimitar",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) slashing damage plus 3 (1d6) lightning damage."
      },
      {
        "name": "Thunderbolt",
        "desc": "Ranged Spell Attack: +9 to hit, range 120 ft., one target. Hit: 22 (4d8 + 4) lightning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageImmunities": "lightning, thunder, poison",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned, restrained",
    "damageVulnerabilities": ""
  },
  {
    "name": "Draft Horse",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "",
    "hp": 19,
    "hpFormula": "3d10+3",
    "speed": "40 ft.",
    "str": 18,
    "dex": 10,
    "con": 13,
    "int": 2,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 11",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 9 (2d4+4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Dragon Turtle",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 21,
    "acType": "natural armor",
    "hp": 363,
    "hpFormula": "22d20 + 132",
    "speed": "30 ft., swim 120 ft.",
    "str": 25,
    "dex": 10,
    "con": 23,
    "int": 16,
    "wis": 17,
    "cha": 19,
    "saves": "Dexterity +6, Constitution +13, Wisdom +10, Charisma +11",
    "savingThrows": "Dexterity +6, Constitution +13, Wisdom +10, Charisma +11",
    "skills": "Insight +10, Perception +10",
    "senses": "darkvision 120 ft., truesight 120 ft., passive Perception 20",
    "languages": "Draconic, Undercommon, telepathy 120 ft.",
    "cr": "17",
    "xp": 18000,
    "crNum": 17,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 19 (2d12 + 6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 15 (2d8 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 17 (2d10 + 6) bludgeoning damage."
      },
      {
        "name": "Steam Breath (Recharge 5-6)",
        "desc": "The dragon exhales scalding steam in a 60-foot cone. Each creature in that cone must make a DC 21 Constitution saving throw, taking 52 (15d6) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "fire",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Dretch",
    "size": "Small",
    "type": "fiend",
    "subtype": "demon",
    "alignment": "chaotic evil",
    "ac": 11,
    "acType": "",
    "hp": 3,
    "hpFormula": "1d6",
    "speed": "20 ft.",
    "str": 11,
    "dex": 10,
    "con": 12,
    "int": 5,
    "wis": 8,
    "cha": 3,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 9",
    "languages": "Abyssal, telepathy 60 ft.",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) slashing damage."
      },
      {
        "name": "Acid Spit (Recharge 6)",
        "desc": "The dretch spits acid in a line 15 feet long and 5 feet wide, provided the dretch isn't in sunlight. Each creature in that line must make a DC 11 Dexterity saving throw, taking 3 (1d6) acid damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold, fire, lightning",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Druid",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 11,
    "acType": "leather armor",
    "hp": 27,
    "hpFormula": "5d8+5",
    "speed": "30 ft.",
    "str": 10,
    "dex": 12,
    "con": 13,
    "int": 12,
    "wis": 15,
    "cha": 11,
    "saves": "Wis +4",
    "skills": "Medicine +4, Nature +3, Perception +4",
    "senses": "passive Perception 14",
    "languages": "Druidic plus any two languages",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [],
    "actions": [
      {
        "name": "Quarterstaff",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 3 (1d6) bludgeoning damage, or 4 (1d8) bludgeoning damage if used with two hands."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Dryad",
    "size": "Medium",
    "type": "fey",
    "alignment": "neutral",
    "ac": 15,
    "acType": "natural armor",
    "hp": 22,
    "hpFormula": "5d8",
    "speed": "30 ft.",
    "str": 10,
    "dex": 15,
    "con": 10,
    "int": 14,
    "wis": 15,
    "cha": 12,
    "saves": "",
    "skills": "Perception +4",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "Elvish, Sylvan",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The dryad has advantage on saving throws against spells and magical effects."
      },
      {
        "name": "Tree Dependent",
        "desc": "The dryad's life force is bound to a single oak tree within 240 feet of it. If the tree is destroyed, the dryad dies. As long as the tree is alive, the dryad can be restored to life even if it has been killed, regaining all its hit points within one day."
      }
    ],
    "actions": [
      {
        "name": "Quarterstaff",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 3 (1d6) bludgeoning damage."
      },
      {
        "name": "Shillelagh",
        "desc": "A nonmagical quarterstaff magically sprouts thorns and becomes a quarterstaff magic weapon. If the dryad loses the weapon, another quarterstaff becomes the dryad's new quarterstaff."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Eagle",
    "size": "Small",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "",
    "hp": 3,
    "hpFormula": "1d6",
    "speed": "10 ft., fly 60 ft.",
    "str": 6,
    "dex": 17,
    "con": 10,
    "int": 2,
    "wis": 14,
    "cha": 7,
    "saves": "",
    "skills": "Perception +4",
    "senses": "passive Perception 14",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Keen Sight",
        "desc": "The eagle has advantage on Wisdom (Perception) checks that rely on sight."
      }
    ],
    "actions": [
      {
        "name": "Talons",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Earth Elemental",
    "size": "Large",
    "type": "elemental",
    "alignment": "neutral",
    "ac": 17,
    "acType": "natural armor",
    "hp": 39,
    "hpFormula": "6d10 + 12",
    "speed": "30 ft., burrow 30 ft.",
    "str": 20,
    "dex": 8,
    "con": 16,
    "int": 5,
    "wis": 10,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., tremorsense 60 ft., passive Perception 10",
    "languages": "understands Terran but can't speak",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Earth Glide",
        "desc": "The elemental can burrow through nonmagical, unworked earth and stone. While doing so, the elemental doesn't disturb the material it moves through."
      },
      {
        "name": "Stone Camouflage",
        "desc": "The elemental has advantage on Stealth checks made to hide in rocky terrain."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The elemental makes two slam attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 14 (2d8 + 5) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, poisoned, prone",
    "damageVulnerabilities": ""
  },
  {
    "name": "Efreeti",
    "size": "Large",
    "type": "elemental",
    "alignment": "lawful evil",
    "ac": 17,
    "acType": "natural armor",
    "hp": 200,
    "hpFormula": "16d10 + 112",
    "speed": "40 ft., fly 60 ft.",
    "str": 22,
    "dex": 12,
    "con": 24,
    "int": 16,
    "wis": 15,
    "cha": 16,
    "saves": "Intelligence +7, Wisdom +6, Charisma +7",
    "savingThrows": "Intelligence +7, Wisdom +6, Charisma +7",
    "skills": "Insight +6, Perception +6",
    "damageResistances": "fire",
    "senses": "darkvision 120 ft., truesight 120 ft., passive Perception 16",
    "languages": "Ignan, Common, telepathy 120 ft.",
    "cr": "12",
    "xp": 8400,
    "crNum": 12,
    "traits": [
      {
        "name": "Innate Spellcasting",
        "desc": "The efreeti's innate spellcasting ability is Charisma (spell save DC 15). It can innately cast the following spells, requiring no material components: At will: detect magic; 3/day each: enlarge/reduce, invisibility; 1/day each: grant wish"
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the efreeti fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The efreeti makes two scimitar attacks or uses Hurl Flame twice."
      },
      {
        "name": "Scimitar",
        "desc": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage plus 7 (2d6) fire damage."
      },
      {
        "name": "Hurl Flame",
        "desc": "Ranged Spell Attack: +7 to hit, range 120 ft., one target. Hit: 33 (6d8 + 6) fire damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageImmunities": "fire, poison",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned, restrained",
    "damageVulnerabilities": ""
  },
  {
    "name": "Elephant",
    "size": "Huge",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "natural armor",
    "hp": 76,
    "hpFormula": "8d12+24",
    "speed": "40 ft.",
    "str": 22,
    "dex": 9,
    "con": 17,
    "int": 3,
    "wis": 11,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [],
    "actions": [
      {
        "name": "Gore",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 19 (3d8+6) piercing damage."
      },
      {
        "name": "Stomp",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one creature. Hit: 16 (2d8+6) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Elk",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "",
    "hp": 15,
    "hpFormula": "2d10+4",
    "speed": "40 ft.",
    "str": 16,
    "dex": 10,
    "con": 14,
    "int": 2,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "Perception +2",
    "senses": "passive Perception 12",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Charge",
        "desc": "If the elk moves at least 20 feet straight toward a creature and then hits it with a ram attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the elk can make one hoof attack against it as a bonus action."
      }
    ],
    "actions": [
      {
        "name": "Ram",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) bludgeoning damage."
      },
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (2d4+3) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Erinyes",
    "size": "Medium",
    "type": "fiend",
    "subtype": "devil",
    "alignment": "lawful evil",
    "ac": 16,
    "acType": "natural armor",
    "hp": 153,
    "hpFormula": "18d8+72",
    "speed": "30 ft., fly 60 ft.",
    "str": 18,
    "dex": 16,
    "con": 18,
    "int": 14,
    "wis": 14,
    "cha": 18,
    "saves": "Dex +6, Con +8, Wis +5, Cha +7",
    "skills": "Deception +7, Insight +5, Perception +5",
    "senses": "truesight 120 ft., passive Perception 15",
    "languages": "Infernal, telepathy 120 ft.",
    "cr": "12",
    "xp": 8400,
    "crNum": 12,
    "traits": [
      {
        "name": "Devil's Sight",
        "desc": "Magical darkness doesn't impede the devil's darkvision."
      },
      {
        "name": "Magic Resistance",
        "desc": "The erinyes has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Magic Weapons",
        "desc": "The erinyes's weapon attacks are magical."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The erinyes makes three attacks."
      },
      {
        "name": "Longsword",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 8 (1d8+4) slashing damage, or 9 (1d10+4) slashing damage if used with two hands, plus 22 (4d10) poison damage."
      },
      {
        "name": "Whip",
        "desc": "Melee Weapon Attack: +8 to hit, reach 15 ft., one target. Hit: 6 (1d4+4) slashing damage plus 22 (4d10) poison damage, and the target must succeed on a DC 17 Strength saving throw or be knocked prone."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Ettin",
    "size": "Giant",
    "type": "humanoid",
    "subtype": "giant",
    "alignment": "chaotic evil",
    "ac": 12,
    "acType": "natural armor",
    "hp": 110,
    "hpFormula": "13d10+39",
    "speed": "40 ft.",
    "str": 21,
    "dex": 8,
    "con": 17,
    "int": 6,
    "wis": 10,
    "cha": 8,
    "saves": "",
    "skills": "Perception +5",
    "senses": "darkvision 60 ft., passive Perception 15",
    "languages": "Giant, Orc",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [
      {
        "name": "Two Heads",
        "desc": "The ettin has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious. If the ettin takes damage to one head, it doesn't suffer concentration checks as a result of that damage."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The ettin makes two greataxe attacks."
      },
      {
        "name": "Greataxe",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 13 (2d12) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Fire Elemental",
    "size": "Large",
    "type": "elemental",
    "alignment": "neutral",
    "ac": 15,
    "acType": "natural armor",
    "hp": 39,
    "hpFormula": "6d10 + 12",
    "speed": "50 ft.",
    "str": 10,
    "dex": 17,
    "con": 14,
    "int": 6,
    "wis": 10,
    "cha": 7,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "understands Ignan but can't speak",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Fire Form",
        "desc": "The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 foot wide."
      },
      {
        "name": "Illumination",
        "desc": "The elemental sheds bright light in a 30-foot radius and dim light in an additional 30 feet."
      },
      {
        "name": "Water Susceptibility",
        "desc": "For every 5 feet the elemental moves in water, or for every gallon of water splashed on it, it takes 1 cold damage."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The elemental makes two touch attacks."
      },
      {
        "name": "Touch",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) fire damage. If the target is a creature or a flammable object, it ignites. If no one uses an action on the creature's next turn to extinguish the fire, it takes 5 (1d10) fire damage when its turn ends."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "charmed, exhaustion, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "damageVulnerabilities": "cold"
  },
  {
    "name": "Fire Giant",
    "size": "Huge",
    "type": "giant",
    "alignment": "chaotic evil",
    "ac": 16,
    "acType": "plate",
    "hp": 162,
    "hpFormula": "12d12+84",
    "speed": "30 ft.",
    "str": 25,
    "dex": 7,
    "con": 25,
    "int": 10,
    "wis": 12,
    "cha": 13,
    "saves": "Str +11, Con +11, Cha +5",
    "skills": "Athletics +15, Perception +4",
    "senses": "passive Perception 14",
    "languages": "Giant",
    "cr": "9",
    "xp": 5000,
    "crNum": 9,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The giant makes two attacks with its greatsword."
      },
      {
        "name": "Greatsword",
        "desc": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 28 (6d6+7) slashing damage."
      },
      {
        "name": "Rock",
        "desc": "Ranged Weapon Attack: +11 to hit, range 60/240 ft., one target. Hit: 29 (4d10+7) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "fire",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Flameskull",
    "size": "Tiny",
    "type": "undead",
    "alignment": "chaotic evil",
    "ac": 13,
    "acType": "",
    "hp": 22,
    "hpFormula": "5d4+10",
    "speed": "0 ft., fly 40 ft. (hover)",
    "str": 1,
    "dex": 16,
    "con": 14,
    "int": 16,
    "wis": 10,
    "cha": 11,
    "saves": "Int +5, Wis +2",
    "skills": "Arcana +5, Perception +2",
    "senses": "darkvision 60 ft., passive Perception 12",
    "languages": "Common, Infernal",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [
      {
        "name": "Illumination",
        "desc": "The flameskull sheds bright light in a 10-foot radius and dim light for an additional 10 feet."
      },
      {
        "name": "Magic Resistance",
        "desc": "The flameskull has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Rejuvenation",
        "desc": "If the flameskull is destroyed, it regains all its hit points at the start of its next turn."
      }
    ],
    "actions": [
      {
        "name": "Fire Ray",
        "desc": "Ranged Spell Attack: +5 to hit, range 60 ft., one target. Hit: 10 (3d6) fire damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "lightning, necrotic, nonmagical bludgeoning, piercing, and slashing",
    "damageImmunities": "cold, fire, poison",
    "conditionImmunities": "charmed, exhaustion, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "damageVulnerabilities": ""
  },
  {
    "name": "Flesh Golem",
    "size": "Medium",
    "type": "construct",
    "alignment": "unaligned",
    "ac": 9,
    "acType": "",
    "hp": 93,
    "hpFormula": "11d8+44",
    "speed": "30 ft.",
    "str": 19,
    "dex": 9,
    "con": 18,
    "int": 3,
    "wis": 10,
    "cha": 5,
    "saves": "Wis +2",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "understands the languages of its creator but can't speak",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "desc": "The golem is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the golem must succeed on a Constitution saving throw against the caster's spell save DC or fall prone."
      },
      {
        "name": "Aversion of Fire",
        "desc": "If the golem takes fire damage, it has disadvantage on attack rolls and ability checks until the end of its next turn."
      },
      {
        "name": "Immutable Form",
        "desc": "The golem is immune to any spell or effect that would alter its form."
      },
      {
        "name": "Lightning Absorption",
        "desc": "Whenever the golem is subjected to lightning damage, it takes no damage and instead regains a number of hit points equal to the lightning damage dealt."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The golem makes two slam attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "lightning, piercing, slashing",
    "damageImmunities": "poison, psychic",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": "fire"
  },
  {
    "name": "Flying Snake",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 14,
    "acType": "natural armor",
    "hp": 5,
    "hpFormula": "2d4+1",
    "speed": "30 ft., fly 60 ft.",
    "str": 4,
    "dex": 16,
    "con": 11,
    "int": 2,
    "wis": 12,
    "cha": 4,
    "saves": "",
    "skills": "",
    "senses": "blindsight 10 ft., passive Perception 11",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage plus 3 (1d6) poison damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Flying Sword",
    "size": "Small",
    "type": "construct",
    "alignment": "unaligned",
    "ac": 17,
    "acType": "natural armor",
    "hp": 17,
    "hpFormula": "5d6+5",
    "speed": "0 ft., fly 50 ft. (hover)",
    "str": 12,
    "dex": 15,
    "con": 12,
    "int": 1,
    "wis": 5,
    "cha": 1,
    "saves": "",
    "skills": "",
    "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 7",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "desc": "The sword is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the sword must succeed on a Constitution saving throw against the caster's spell save DC or fall prone."
      },
      {
        "name": "False Appearance",
        "desc": "While the sword remains motionless and isn't flying, it is indistinguishable from a normal sword."
      }
    ],
    "actions": [
      {
        "name": "Longsword",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8+1) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "poison, psychic",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Frog",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "natural armor",
    "hp": 1,
    "hpFormula": "1d4 - 1",
    "speed": "20 ft., swim 20 ft.",
    "str": 1,
    "dex": 13,
    "con": 8,
    "int": 1,
    "wis": 8,
    "cha": 3,
    "saves": "",
    "skills": "Perception +2, Stealth +3",
    "senses": "darkvision 30 ft., passive Perception 12",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The frog can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Frost Giant",
    "size": "Huge",
    "type": "giant",
    "alignment": "chaotic evil",
    "ac": 15,
    "acType": "natural armor",
    "hp": 138,
    "hpFormula": "12d12+60",
    "speed": "40 ft.",
    "str": 23,
    "dex": 9,
    "con": 21,
    "int": 9,
    "wis": 10,
    "cha": 12,
    "saves": "Str +9, Con +8",
    "skills": "Athletics +12, Perception +3",
    "senses": "passive Perception 13",
    "languages": "Giant",
    "cr": "8",
    "xp": 3900,
    "crNum": 8,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The giant makes two attacks with its greataxe."
      },
      {
        "name": "Greataxe",
        "desc": "Melee Weapon Attack: +9 to hit, reach 12 ft., one target. Hit: 25 (3d12+6) slashing damage."
      },
      {
        "name": "Rock",
        "desc": "Ranged Weapon Attack: +9 to hit, range 60/240 ft., one target. Hit: 28 (4d10+6) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "cold",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Galeb Duhr",
    "size": "Medium",
    "type": "elemental",
    "alignment": "neutral good",
    "ac": 15,
    "acType": "natural armor",
    "hp": 49,
    "hpFormula": "7d8+14",
    "speed": "15 ft., burrow 15 ft.",
    "str": 16,
    "dex": 12,
    "con": 15,
    "int": 11,
    "wis": 14,
    "cha": 12,
    "saves": "Con +4, Wis +4",
    "skills": "Insight +4, Perception +4",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "Terran",
    "cr": "6",
    "xp": 2300,
    "crNum": 6,
    "traits": [
      {
        "name": "Elemental Body",
        "desc": "The galeb duhr is immune to poison damage and the poisoned condition. The galeb duhr doesn't need to breathe or eat. It can't be diseased."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The galeb duhr makes two attacks: one with its slam and one with its stone fist."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) bludgeoning damage."
      },
      {
        "name": "Stone Fist",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) bludgeoning damage. If the target is Medium or smaller, it must succeed on a DC 15 Strength saving throw or be knocked prone."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "nonmagical bludgeoning, piercing, and slashing",
    "damageImmunities": "poison",
    "conditionImmunities": "exhaustion, paralyzed, petrified, poisoned, prone",
    "damageVulnerabilities": ""
  },
  {
    "name": "Gelatinous Cube",
    "size": "Large",
    "type": "ooze",
    "alignment": "unaligned",
    "ac": 6,
    "acType": "natural armor",
    "hp": 84,
    "hpFormula": "8d10 + 40",
    "speed": "15 ft.",
    "str": 14,
    "dex": 3,
    "con": 20,
    "int": 1,
    "wis": 6,
    "cha": 1,
    "saves": "",
    "skills": "",
    "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 8",
    "languages": "",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Engulfing",
        "desc": "The cube is 10 feet across and nearly fills its space. Creatures and objects entirely within the cube have total cover relative to anything outside it. A creature or object attempting to leave the cube must use an action to escape."
      },
      {
        "name": "Grappler",
        "desc": "The cube has advantage on saving throws against spells and magical effects, and magic can't be used to sense its location."
      },
      {
        "name": "Transparent",
        "desc": "Even when the cube is in plain sight, it takes a successful DC 15 Wisdom (Perception) check to spot the cube if it has neither moved nor attacked. A creature that tries to enter the cube's space while unaware of it is surprised."
      }
    ],
    "actions": [
      {
        "name": "Engulfing Acid",
        "desc": "One creature in the cube that is not restrained must make a DC 15 Dexterity saving throw, taking 10 (3d6) acid damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "acid, cold, lightning, slashing",
    "conditionImmunities": "blinded, charmed, deafened, exhaustion, frightened, prone",
    "damageVulnerabilities": ""
  },
  {
    "name": "Ghost",
    "size": "Medium",
    "type": "undead",
    "alignment": "any alignment",
    "ac": 11,
    "acType": "",
    "hp": 45,
    "hpFormula": "10d8",
    "speed": "0 ft., fly 40 ft. (hover)",
    "str": 7,
    "dex": 13,
    "con": 10,
    "int": 10,
    "wis": 12,
    "cha": 17,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "any languages it knew in life",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [
      {
        "name": "Ethereal Sight",
        "desc": "The ghost can see 60 feet into the Ethereal Plane when it is on the Material Plane, and vice versa."
      },
      {
        "name": "Incorporeal Movement",
        "desc": "The ghost can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."
      }
    ],
    "actions": [
      {
        "name": "Withering Touch",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 17 (4d6 + 3) necrotic damage."
      },
      {
        "name": "Etherealness",
        "desc": "The ghost enters the Ethereal Plane from the Material Plane, or vice versa."
      },
      {
        "name": "Horrifying Visage",
        "desc": "Each non-undead creature within 60 feet of the ghost that can see it must succeed on a DC 13 Wisdom saving throw or be frightened for 1 minute. If the save fails by 5 or more, the target also ages 1d4 × 10 years."
      },
      {
        "name": "Possession (Recharge 6)",
        "desc": "One humanoid that the ghost can see within 5 feet must succeed on a DC 13 Charisma saving throw or be possessed by the ghost."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "acid, fire, lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "cold, necrotic, poison",
    "conditionImmunities": "charmed, exhaustion, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "damageVulnerabilities": ""
  },
  {
    "name": "Ghoul",
    "size": "Medium",
    "type": "undead",
    "alignment": "chaotic evil",
    "ac": 12,
    "acType": "natural armor",
    "hp": 22,
    "hpFormula": "5d8",
    "speed": "30 ft.",
    "str": 13,
    "dex": 15,
    "con": 10,
    "int": 7,
    "wis": 10,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Abyssal",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Turn Defiance",
        "desc": "The ghoul and any ghouls within 30 feet of it have advantage on saving throws against effects that turn undead."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one creature. Hit: 7 (2d6) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Ape",
    "size": "Huge",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "natural armor",
    "hp": 157,
    "hpFormula": "15d12+60",
    "speed": "40 ft., climb 30 ft.",
    "str": 23,
    "dex": 11,
    "con": 19,
    "int": 7,
    "wis": 12,
    "cha": 7,
    "saves": "Str +9, Con +7",
    "skills": "Athletics +9, Perception +4",
    "senses": "passive Perception 14",
    "languages": "",
    "cr": "7",
    "xp": 2900,
    "crNum": 7,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The ape makes two fist attacks or two rock attacks."
      },
      {
        "name": "Fist",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 22 (3d8+9) bludgeoning damage."
      },
      {
        "name": "Rock",
        "desc": "Ranged Weapon Attack: +9 to hit, range 50/100 ft., one target. Hit: 30 (4d10+9) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Badger",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "",
    "hp": 13,
    "hpFormula": "2d8+4",
    "speed": "30 ft., burrow 10 ft.",
    "str": 13,
    "dex": 10,
    "con": 15,
    "int": 2,
    "wis": 12,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "darkvision 30 ft., passive Perception 11",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8+1) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Bat",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 22,
    "hpFormula": "4d10+4",
    "speed": "10 ft., fly 60 ft.",
    "str": 15,
    "dex": 14,
    "con": 12,
    "int": 2,
    "wis": 10,
    "cha": 4,
    "saves": "",
    "skills": "",
    "senses": "blindsight 60 ft., passive Perception 10",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Echolocation",
        "desc": "The bat can't use its blindsight while deafened."
      },
      {
        "name": "Keen Hearing",
        "desc": "The bat has advantage on Wisdom (Perception) checks that rely on hearing."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6+2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Boar",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "natural armor",
    "hp": 42,
    "hpFormula": "5d10+15",
    "speed": "40 ft.",
    "str": 17,
    "dex": 10,
    "con": 16,
    "int": 2,
    "wis": 11,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Charge",
        "desc": "If the boar moves at least 5 feet straight toward a creature and then hits it with a tusk attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone."
      },
      {
        "name": "Relentless (Recharges after a Rest)",
        "desc": "If the boar takes 5 damage or less, it can take a reaction to move up to its speed without provoking opportunity attacks."
      }
    ],
    "actions": [
      {
        "name": "Tusk",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) slashing damage."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Centipede",
    "size": "Small",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "natural armor",
    "hp": 4,
    "hpFormula": "1d6+1",
    "speed": "30 ft., climb 30 ft.",
    "str": 5,
    "dex": 14,
    "con": 12,
    "int": 1,
    "wis": 7,
    "cha": 3,
    "saves": "",
    "skills": "",
    "senses": "blindsight 30 ft., darkvision 30 ft., passive Perception 8",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) piercing damage, and the target must succeed on a DC 11 Dexterity saving throw or take 3 (1d6) poison damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Constrictor Snake",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "natural armor",
    "hp": 60,
    "hpFormula": "8d10 + 16",
    "speed": "30 ft., swim 30 ft.",
    "str": 19,
    "dex": 14,
    "con": 16,
    "int": 1,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "Perception +2",
    "senses": "blindsight 10 ft., darkvision 0 ft., passive Perception 12",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 11 (2d6 + 4) piercing damage."
      },
      {
        "name": "Constrict",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 13 (2d8 + 4) bludgeoning damage, and the target is grappled (escape DC 16). Until this grapple ends, the creature is restrained and unable to breathe unless it can breathe water, and the snake can't constrict another target."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Crab",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 15,
    "acType": "natural armor",
    "hp": 13,
    "hpFormula": "2d8+4",
    "speed": "30 ft., swim 30 ft.",
    "str": 13,
    "dex": 15,
    "con": 14,
    "int": 1,
    "wis": 9,
    "cha": 3,
    "saves": "",
    "skills": "Stealth +4",
    "senses": "blindsight 30 ft., passive Perception 9",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) slashing damage. If the target is a creature, it is grappled (escape DC 12)."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Crocodile",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "natural armor",
    "hp": 52,
    "hpFormula": "7d10+14",
    "speed": "30 ft., swim 50 ft.",
    "str": 19,
    "dex": 10,
    "con": 14,
    "int": 2,
    "wis": 10,
    "cha": 5,
    "saves": "",
    "skills": "Stealth +2",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Hold Breath",
        "desc": "The crocodile can hold its breath for 30 minutes."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15 (2d10+4) piercing damage. If the target is a creature, it is grappled (escape DC 15). Until this grapple ends, the target is restrained, and the crocodile can't bite another target."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Eagle",
    "size": "Large",
    "type": "beast",
    "alignment": "neutral good",
    "ac": 13,
    "acType": "",
    "hp": 26,
    "hpFormula": "4d10+4",
    "speed": "10 ft., fly 80 ft.",
    "str": 16,
    "dex": 17,
    "con": 12,
    "int": 8,
    "wis": 14,
    "cha": 10,
    "saves": "Dex +5, Wis +4, Cha +2",
    "skills": "Perception +7",
    "senses": "passive Perception 17",
    "languages": "understands Common and Giant but can't speak",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Keen Sight",
        "desc": "The eagle has advantage on Wisdom (Perception) checks that rely on sight."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The eagle makes two attacks: one with its beak and one with its talons."
      },
      {
        "name": "Beak",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) piercing damage."
      },
      {
        "name": "Talons",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (2d4+3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Elk",
    "size": "Huge",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 14,
    "acType": "natural armor",
    "hp": 42,
    "hpFormula": "5d12+10",
    "speed": "60 ft.",
    "str": 19,
    "dex": 16,
    "con": 14,
    "int": 2,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "Perception +2",
    "senses": "passive Perception 12",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Charge",
        "desc": "If the elk moves at least 20 feet straight toward a creature and then hits it with a ram attack on the same turn, that target must succeed on a DC 16 Strength saving throw or be knocked prone. If the target is prone, the elk can make one hoof attack against it as a bonus action."
      }
    ],
    "actions": [
      {
        "name": "Ram",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 11 (2d6+4) bludgeoning damage."
      },
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Fire Beetle",
    "size": "Small",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "natural armor",
    "hp": 4,
    "hpFormula": "1d6+1",
    "speed": "30 ft.",
    "str": 8,
    "dex": 10,
    "con": 12,
    "int": 1,
    "wis": 7,
    "cha": 3,
    "saves": "",
    "skills": "",
    "senses": "blindsight 30 ft., darkvision 30 ft., passive Perception 8",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Illumination",
        "desc": "The beetle sheds bright light in a 10-foot radius and dim light for an additional 10 feet."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 2 (1d6-1) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Frog",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "",
    "hp": 18,
    "hpFormula": "4d10",
    "speed": "30 ft., swim 30 ft.",
    "str": 12,
    "dex": 13,
    "con": 11,
    "int": 2,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "Perception +2, Stealth +2",
    "senses": "darkvision 30 ft., passive Perception 12",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The frog can breathe air and water."
      },
      {
        "name": "Standing Leap",
        "desc": "The frog's long jump is up to 20 feet and its high jump is up to 10 feet, with or without a running start."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) piercing damage, and the target is grappled (escape DC 11). Until this grapple ends, the target is restrained, and the frog can't bite another target."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Goat",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "",
    "hp": 19,
    "hpFormula": "3d10+3",
    "speed": "40 ft.",
    "str": 17,
    "dex": 11,
    "con": 13,
    "int": 3,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 11",
    "languages": "",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [
      {
        "name": "Charge",
        "desc": "If the goat moves at least 20 feet straight toward a creature and then hits it with a ram attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the goat can make one hoof attack against it as a bonus action."
      },
      {
        "name": "Sure-Footed",
        "desc": "The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone."
      }
    ],
    "actions": [
      {
        "name": "Ram",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Hyena",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 45,
    "hpFormula": "6d10+12",
    "speed": "50 ft.",
    "str": 16,
    "dex": 14,
    "con": 15,
    "int": 2,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +3",
    "senses": "darkvision 60 ft., passive Perception 13",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Keen Hearing and Smell",
        "desc": "The hyena has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      },
      {
        "name": "Pack Tactics",
        "desc": "The hyena has advantage on an attack roll against a creature if at least one other hyena is within 5 feet of the target and the other hyena isn't incapacitated."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Lizard",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "natural armor",
    "hp": 19,
    "hpFormula": "3d10+3",
    "speed": "30 ft., climb 30 ft.",
    "str": 15,
    "dex": 12,
    "con": 13,
    "int": 2,
    "wis": 10,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "darkvision 30 ft., passive Perception 10",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Octopus",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 52,
    "hpFormula": "8d10+16",
    "speed": "0 ft., swim 60 ft.",
    "str": 17,
    "dex": 13,
    "con": 15,
    "int": 3,
    "wis": 10,
    "cha": 4,
    "saves": "",
    "skills": "Perception +3, Stealth +3",
    "senses": "darkvision 60 ft., passive Perception 13",
    "languages": "",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The octopus can breathe air and water."
      },
      {
        "name": "Hold Breath",
        "desc": "While out of water, the octopus can hold its breath for 1 hour."
      },
      {
        "name": "Invisible in Water",
        "desc": "If the octopus is in water, it has three-quarters cover against attacks from outside the water."
      }
    ],
    "actions": [
      {
        "name": "Tentacles",
        "desc": "Melee Weapon Attack: +5 to hit, reach 15 ft., one target. Hit: 10 (2d6+3) bludgeoning damage. If the target is a creature, it is grappled (escape DC 14). Until this grapple ends, the target is restrained and unable to breathe unless it can breathe water. The octopus has three tentacles, each of which can grapple one target."
      },
      {
        "name": "Ink Cloud",
        "desc": "A 20-foot-radius cloud of ink extends all around the octopus if it is in water. The area is heavily obscured for 1 minute, unless a current disperses the cloud sooner. The octopus can use a bonus action after releasing the ink to move up to its swimming speed."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Owl",
    "size": "Large",
    "type": "beast",
    "alignment": "neutral",
    "ac": 11,
    "acType": "",
    "hp": 19,
    "hpFormula": "3d10+3",
    "speed": "5 ft., fly 60 ft.",
    "str": 13,
    "dex": 13,
    "con": 12,
    "int": 4,
    "wis": 14,
    "cha": 6,
    "saves": "",
    "skills": "Perception +5, Stealth +4",
    "senses": "darkvision 120 ft., passive Perception 15",
    "languages": "Auran",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [
      {
        "name": "Flyby",
        "desc": "The owl doesn't provoke an opportunity attack when it flies away from an enemy."
      },
      {
        "name": "Keen Hearing and Sight",
        "desc": "The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight."
      }
    ],
    "actions": [
      {
        "name": "Talons",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Poisonous Snake",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 14,
    "acType": "",
    "hp": 22,
    "hpFormula": "3d10+6",
    "speed": "30 ft., swim 30 ft.",
    "str": 10,
    "dex": 18,
    "con": 13,
    "int": 2,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "",
    "senses": "blindsight 10 ft., darkvision 30 ft., passive Perception 10",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 6 (1d6+3) piercing damage, and the target must make a DC 11 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Rat",
    "size": "Small",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 6,
    "hpFormula": "1d8+2",
    "speed": "30 ft.",
    "str": 7,
    "dex": 14,
    "con": 14,
    "int": 2,
    "wis": 10,
    "cha": 4,
    "saves": "",
    "skills": "Stealth +4",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Scorpion",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 15,
    "acType": "natural armor",
    "hp": 22,
    "hpFormula": "3d10+6",
    "speed": "40 ft., burrow 20 ft.",
    "str": 15,
    "dex": 13,
    "con": 15,
    "int": 1,
    "wis": 9,
    "cha": 3,
    "saves": "",
    "skills": "",
    "senses": "blindsight 60 ft., passive Perception 9",
    "languages": "",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The scorpion makes three attacks: two with its claws and one with its sting."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) slashing damage, and the target must succeed on a DC 12 Strength saving throw or be knocked prone."
      },
      {
        "name": "Sting",
        "desc": "Melee Weapon Attack: +4 to hit, reach 10 ft., one target. Hit: 7 (1d10+2) piercing damage, and the target must make a DC 12 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Sea Horse",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "natural armor",
    "hp": 16,
    "hpFormula": "3d10",
    "speed": "0 ft., swim 40 ft.",
    "str": 12,
    "dex": 15,
    "con": 11,
    "int": 2,
    "wis": 12,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 11",
    "languages": "",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [
      {
        "name": "Charge",
        "desc": "If the seahorse moves at least 20 feet straight toward a target and then hits it with a ram attack on the same turn, that target takes an extra 7 (2d6) bludgeoning damage. If the target is a creature, it must succeed on a DC 12 Strength saving throw or be knocked prone."
      }
    ],
    "actions": [
      {
        "name": "Ram",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Shark",
    "size": "Huge",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "",
    "hp": 126,
    "hpFormula": "11d12+55",
    "speed": "0 ft., swim 50 ft.",
    "str": 23,
    "dex": 11,
    "con": 21,
    "int": 1,
    "wis": 10,
    "cha": 5,
    "saves": "",
    "skills": "Perception +4",
    "senses": "blindsight 60 ft., passive Perception 14",
    "languages": "",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Blood Frenzy",
        "desc": "The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 22 (3d10+6) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Spider",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 14,
    "acType": "natural armor",
    "hp": 26,
    "hpFormula": "4d10+4",
    "speed": "30 ft., climb 30 ft.",
    "str": 14,
    "dex": 16,
    "con": 12,
    "int": 2,
    "wis": 11,
    "cha": 4,
    "saves": "",
    "skills": "Stealth +6",
    "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 10",
    "languages": "",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Spider Climb",
        "desc": "The spider can climb difficult surfaces, including upside down on ceilings, without needing an ability check."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 7 (1d10+2) piercing damage, and the target must succeed on a DC 11 Constitution saving throw or take 7 (2d6) poison damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Toad",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "",
    "hp": 39,
    "hpFormula": "6d10+12",
    "speed": "20 ft., swim 40 ft.",
    "str": 15,
    "dex": 13,
    "con": 14,
    "int": 2,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "",
    "senses": "darkvision 30 ft., passive Perception 10",
    "languages": "",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The toad can breathe air and water."
      },
      {
        "name": "Standing Leap",
        "desc": "The toad's long jump is up to 20 feet and its high jump is up to 10 feet, with or without a running start."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10+2) piercing damage plus 5 (2d4) poison damage, and the target must succeed on a DC 12 Constitution saving throw or be poisoned until the end of its next turn."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Vulture",
    "size": "Large",
    "type": "beast",
    "alignment": "neutral evil",
    "ac": 10,
    "acType": "",
    "hp": 22,
    "hpFormula": "3d10+6",
    "speed": "10 ft., fly 60 ft.",
    "str": 16,
    "dex": 10,
    "con": 13,
    "int": 6,
    "wis": 14,
    "cha": 7,
    "saves": "",
    "skills": "Perception +4",
    "senses": "passive Perception 14",
    "languages": "",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Keen Sight and Smell",
        "desc": "The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell."
      },
      {
        "name": "Pack Tactics",
        "desc": "The vulture has advantage on an attack roll against a creature if at least one other vulture is within 5 feet of the target and the other vulture isn't incapacitated."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The vulture makes two attacks: one with its beak and one with its talons."
      },
      {
        "name": "Beak",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) piercing damage."
      },
      {
        "name": "Talons",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (2d4+3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Wasp",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 22,
    "hpFormula": "3d10+6",
    "speed": "10 ft., fly 60 ft.",
    "str": 10,
    "dex": 14,
    "con": 12,
    "int": 1,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [],
    "actions": [
      {
        "name": "Sting",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 5 (1d6+2) piercing damage, and the target must make a DC 12 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much on a successful one. If the poison damage equals or exceeds the target's hit point maximum, the target falls prone."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Weasel",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "",
    "hp": 9,
    "hpFormula": "2d8",
    "speed": "40 ft.",
    "str": 11,
    "dex": 16,
    "con": 10,
    "int": 4,
    "wis": 11,
    "cha": 5,
    "saves": "",
    "skills": "Perception +4, Stealth +5",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d4+3) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Giant Wolf Spider",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "",
    "hp": 11,
    "hpFormula": "2d8+2",
    "speed": "40 ft., climb 40 ft.",
    "str": 12,
    "dex": 16,
    "con": 12,
    "int": 1,
    "wis": 12,
    "cha": 4,
    "saves": "",
    "skills": "Perception +3, Stealth +5",
    "senses": "darkvision 60 ft., passive Perception 13",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) piercing damage, and the target must succeed on a DC 11 Constitution saving throw or take 3 (1d6) poison damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Gibbering Mouther",
    "size": "Small",
    "type": "aberration",
    "alignment": "neutral",
    "ac": 9,
    "acType": "",
    "hp": 67,
    "hpFormula": "9d6+36",
    "speed": "20 ft.",
    "str": 11,
    "dex": 8,
    "con": 18,
    "int": 3,
    "wis": 10,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Aberrant Mind",
        "desc": "Any creature that starts its turn within 20 feet of the mouther and able to see it must succeed on a DC 13 Wisdom saving throw or take 5 (1d10) psychic damage."
      },
      {
        "name": "Amorphous",
        "desc": "The mouther can occupy another creature's space and vice versa."
      },
      {
        "name": "Not Incapacitated While Eating",
        "desc": "The mouther is able to take actions and move even while incapacitated."
      }
    ],
    "actions": [
      {
        "name": "Bites",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one creature. Hit: 15 (4d6+1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Glabrezu",
    "size": "Large",
    "type": "fiend",
    "subtype": "demon",
    "alignment": "chaotic evil",
    "ac": 17,
    "acType": "natural armor",
    "hp": 157,
    "hpFormula": "15d10+75",
    "speed": "40 ft.",
    "str": 20,
    "dex": 15,
    "con": 21,
    "int": 19,
    "wis": 17,
    "cha": 16,
    "saves": "Str +8, Con +8, Wis +6, Cha +6",
    "skills": "Insight +6, Perception +6",
    "senses": "truesight 120 ft., passive Perception 16",
    "languages": "Abyssal, telepathy 120 ft.",
    "cr": "9",
    "xp": 5000,
    "crNum": 9,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The glabrezu has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Magic Weapons",
        "desc": "The glabrezu's weapon attacks are magical."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The glabrezu makes four attacks: two with its claws and two with its tentacles."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 16 (2d10+5) slashing damage."
      },
      {
        "name": "Tentacle",
        "desc": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 15 (2d8+6) bludgeoning damage. If the target is Medium or smaller, it is grappled (escape DC 16). Until this grapple ends, the target is restrained and unable to breathe unless it can breathe water. The glabrezu can have up to two creatures grappled at a time."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Gladiator",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 16,
    "acType": "studded leather armor, shield",
    "hp": 112,
    "hpFormula": "15d8+45",
    "speed": "30 ft.",
    "str": 18,
    "dex": 15,
    "con": 16,
    "int": 10,
    "wis": 12,
    "cha": 15,
    "saves": "Str +7, Dex +4, Con +5",
    "skills": "Athletics +7, Insight +3",
    "senses": "passive Perception 11",
    "languages": "any one language (usually Common)",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Brute",
        "desc": "A melee weapon deals one extra die of its damage when the gladiator hits with it (included in the attack)."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The gladiator makes three melee attacks or two ranged attacks."
      },
      {
        "name": "Spear",
        "desc": "Melee or Ranged Weapon Attack: +7 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 11 (2d6+4) piercing damage, or 13 (2d8+4) piercing damage if used with two hands to make a melee attack."
      },
      {
        "name": "Shield Bash",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 9 (2d4+4) bludgeoning damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone."
      }
    ],
    "legendaryActions": [],
    "reactions": [
      {
        "name": "Parry",
        "desc": "The gladiator adds 3 to its AC against one melee attack that would hit it. To do so, the gladiator must see the attacker and be wielding a melee weapon."
      }
    ],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Goat",
    "size": "Small",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 3,
    "hpFormula": "1d6",
    "speed": "40 ft.",
    "str": 12,
    "dex": 14,
    "con": 11,
    "int": 2,
    "wis": 12,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 11",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Charge",
        "desc": "If the goat moves at least 20 feet straight toward a creature and then hits it with a ram attack on the same turn, that target must succeed on a DC 10 Strength saving throw or be knocked prone. If the target is prone, the goat can make one head butt attack against it as a bonus action."
      },
      {
        "name": "Sure-Footed",
        "desc": "The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone."
      }
    ],
    "actions": [
      {
        "name": "Ram",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4+1) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Goblin",
    "size": "Small",
    "type": "humanoid",
    "subtype": "goblinoid",
    "alignment": "neutral evil",
    "ac": 15,
    "acType": "leather armor, shield",
    "hp": 7,
    "hpFormula": "2d6",
    "speed": "30 ft.",
    "str": 8,
    "dex": 14,
    "con": 10,
    "int": 10,
    "wis": 8,
    "cha": 8,
    "saves": "",
    "skills": "Stealth +6",
    "senses": "darkvision 60 ft., passive Perception 9",
    "languages": "Common, Goblin",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Nimble Escape",
        "desc": "The goblin can take the Disengage or Hide action as a bonus action on each of its turns."
      }
    ],
    "actions": [
      {
        "name": "Scimitar",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage."
      },
      {
        "name": "Shortbow",
        "desc": "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Gold Dragon Wyrmling",
    "size": "Medium",
    "type": "dragon",
    "alignment": "lawful good",
    "ac": 17,
    "acType": "natural armor",
    "hp": 27,
    "hpFormula": "5d8 + 5",
    "speed": "30 ft., fly 60 ft., swim 30 ft.",
    "str": 15,
    "dex": 10,
    "con": 13,
    "int": 14,
    "wis": 11,
    "cha": 16,
    "saves": "Dexterity +2, Constitution +3, Wisdom +2, Charisma +5",
    "savingThrows": "Dexterity +2, Constitution +3, Wisdom +2, Charisma +5",
    "skills": "Insight +2, Perception +4",
    "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 14",
    "languages": "Draconic",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10 + 2) piercing damage."
      },
      {
        "name": "Breath Weapon (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 15-foot cone. Each creature in that cone must make a DC 12 Dexterity saving throw, taking 22 (4d8) fire damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "fire",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Gorgon",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 19,
    "acType": "natural armor",
    "hp": 114,
    "hpFormula": "12d10+48",
    "speed": "40 ft.",
    "str": 20,
    "dex": 11,
    "con": 18,
    "int": 2,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +4",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Trampling Charge",
        "desc": "If the gorgon moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 16 Strength saving throw or be knocked prone."
      }
    ],
    "actions": [
      {
        "name": "Gore",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 18 (2d12 + 5) piercing damage."
      },
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 16 (2d10 + 5) bludgeoning damage."
      },
      {
        "name": "Petrifying Breath (Recharge 5-6)",
        "desc": "The gorgon exhales petrifying gas in a 30-foot cone. Each creature in that area must succeed on a DC 13 Constitution saving throw. On a failed save, a target begins to turn to stone and is restrained. The restrained target must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the target is petrified until freed by the greater restoration spell or other magic."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "petrified",
    "damageVulnerabilities": ""
  },
  {
    "name": "Gray Ooze",
    "size": "Small",
    "type": "ooze",
    "alignment": "unaligned",
    "ac": 8,
    "acType": "",
    "hp": 22,
    "hpFormula": "3d8+9",
    "speed": "10 ft.",
    "str": 12,
    "dex": 6,
    "con": 16,
    "int": 1,
    "wis": 6,
    "cha": 2,
    "saves": "",
    "skills": "",
    "senses": "blindsight 60 ft. (blind beyond 60 feet), passive Perception 8",
    "languages": "",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [
      {
        "name": "Amorphous",
        "desc": "The ooze can occupy another creature's space and vice versa."
      },
      {
        "name": "Corrosive Form",
        "desc": "A creature that touches the ooze or hits it with a melee attack while within 5 feet of it takes 4 (1d8) acid damage. Any nonmagical weapon made of metal or wood that hits the ooze corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If a weapon's penalty drops below -5, the weapon is destroyed. Nonmagical ammunition made of metal or wood that hits the ooze is destroyed after dealing damage. The ooze can eat through 2-inch-thick, non-magical wood or metal in 1 round."
      }
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4+1) acid damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "acid, cold, lightning, poison, slashing",
    "conditionImmunities": "blinded, charmed, deafened, exhaustion, frightened, prone",
    "damageVulnerabilities": ""
  },
  {
    "name": "Green Dragon Wyrmling",
    "size": "Medium",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 17,
    "acType": "natural armor",
    "hp": 38,
    "hpFormula": "7d8+7",
    "speed": "30 ft., fly 60 ft., swim 30 ft.",
    "str": 15,
    "dex": 12,
    "con": 13,
    "int": 14,
    "wis": 11,
    "cha": 13,
    "saves": "Dex +3, Con +2, Int +4, Wis +2, Cha +3",
    "skills": "Perception +4, Stealth +3",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 14",
    "languages": "Draconic",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10+2) piercing damage."
      },
      {
        "name": "Poison Breath (Recharge 5-6)",
        "desc": "The dragon exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 11 Constitution saving throw, taking 16 (3d8+3) poison damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "poison",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Griffon",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 59,
    "hpFormula": "7d10+21",
    "speed": "30 ft., fly 80 ft.",
    "str": 18,
    "dex": 14,
    "con": 16,
    "int": 2,
    "wis": 12,
    "cha": 8,
    "saves": "Dex +4, Wis +3",
    "skills": "Perception +7",
    "senses": "darkvision 60 ft., passive Perception 17",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Keen Sight",
        "desc": "The griffon has advantage on Wisdom (Perception) checks that rely on sight."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The griffon makes two attacks: one with its beak and one with its claws."
      },
      {
        "name": "Beak",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 8 (1d8+4) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Guard",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 16,
    "acType": "scale mail, shield",
    "hp": 11,
    "hpFormula": "2d8 + 2",
    "speed": "30 ft.",
    "str": 13,
    "dex": 12,
    "con": 12,
    "int": 10,
    "wis": 11,
    "cha": 10,
    "saves": "Strength +3, Constitution +3",
    "skills": "Perception +2",
    "senses": "passive Perception 12",
    "languages": "any one language (usually Common)",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Spear",
        "desc": "Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6 + 1) piercing damage, or 5 (1d8 + 1) piercing damage when used with two hands."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Harpy",
    "size": "Medium",
    "type": "monstrosity",
    "alignment": "chaotic evil",
    "ac": 11,
    "acType": "",
    "hp": 22,
    "hpFormula": "5d8",
    "speed": "20 ft., fly 40 ft.",
    "str": 12,
    "dex": 13,
    "con": 10,
    "int": 8,
    "wis": 12,
    "cha": 13,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 11",
    "languages": "Common",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The harpy makes two attacks: one with its talons and one with its club."
      },
      {
        "name": "Talons",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 6 (2d4+1) slashing damage."
      },
      {
        "name": "Club",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4+1) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Hawk",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "",
    "hp": 1,
    "hpFormula": "1d4-1",
    "speed": "10 ft., fly 60 ft.",
    "str": 5,
    "dex": 16,
    "con": 10,
    "int": 2,
    "wis": 14,
    "cha": 6,
    "saves": "",
    "skills": "Perception +4",
    "senses": "passive Perception 14",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Keen Sight",
        "desc": "The hawk has advantage on Wisdom (Perception) checks that rely on sight."
      }
    ],
    "actions": [
      {
        "name": "Talons",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d4+3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Hell Hound",
    "size": "Medium",
    "type": "monstrosity",
    "alignment": "evil",
    "ac": 15,
    "acType": "natural armor",
    "hp": 45,
    "hpFormula": "7d8+14",
    "speed": "60 ft.",
    "str": 17,
    "dex": 12,
    "con": 14,
    "int": 6,
    "wis": 12,
    "cha": 6,
    "saves": "Wis +3",
    "skills": "Perception +5",
    "senses": "darkvision 60 ft., passive Perception 15",
    "languages": "understands Infernal but can't speak",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Keen Hearing and Smell",
        "desc": "The hound has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      },
      {
        "name": "Pack Tactics",
        "desc": "The hound has advantage on an attack roll against a creature if at least one other hound is within 5 feet of the target and the other hound isn't incapacitated."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) piercing damage plus 7 (2d6) fire damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The hound exhales fire in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity saving throw, taking 22 (4d8+4) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "fire",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Hen",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "natural armor",
    "hp": 1,
    "hpFormula": "1d4 - 1",
    "speed": "20 ft., fly 20 ft.",
    "str": 2,
    "dex": 13,
    "con": 9,
    "int": 2,
    "wis": 8,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 9",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [],
    "actions": [
      {
        "name": "Beak",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Hezrou",
    "size": "Large",
    "type": "fiend",
    "subtype": "demon",
    "alignment": "chaotic evil",
    "ac": 16,
    "acType": "natural armor",
    "hp": 136,
    "hpFormula": "13d10+65",
    "speed": "30 ft.",
    "str": 19,
    "dex": 12,
    "con": 21,
    "int": 5,
    "wis": 12,
    "cha": 13,
    "saves": "Str +7, Con +8",
    "skills": "",
    "senses": "darkvision 120 ft., passive Perception 11",
    "languages": "Abyssal, telepathy 120 ft.",
    "cr": "8",
    "xp": 3900,
    "crNum": 8,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The hezrou has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Scent",
        "desc": "The hezrou has advantage on Wisdom (Perception) checks that rely on smell."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The hezrou makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15 (2d8+6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Hill Giant",
    "size": "Huge",
    "type": "giant",
    "alignment": "chaotic evil",
    "ac": 13,
    "acType": "natural armor",
    "hp": 105,
    "hpFormula": "10d12+40",
    "speed": "40 ft.",
    "str": 21,
    "dex": 8,
    "con": 19,
    "int": 5,
    "wis": 9,
    "cha": 6,
    "saves": "Str +8, Con +7",
    "skills": "Perception +2",
    "senses": "passive Perception 12",
    "languages": "Giant",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The giant makes two attacks with its greatclub."
      },
      {
        "name": "Greatclub",
        "desc": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 18 (4d8) bludgeoning damage."
      },
      {
        "name": "Rock",
        "desc": "Ranged Weapon Attack: +8 to hit, range 60/240 ft., one target. Hit: 21 (4d8+7) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Hippogriff",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "natural armor",
    "hp": 19,
    "hpFormula": "3d10+3",
    "speed": "40 ft., fly 60 ft.",
    "str": 17,
    "dex": 13,
    "con": 13,
    "int": 2,
    "wis": 12,
    "cha": 8,
    "saves": "",
    "skills": "Perception +4",
    "senses": "passive Perception 14",
    "languages": "",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Keen Sight",
        "desc": "The hippogriff has advantage on Wisdom (Perception) checks that rely on sight."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d10+3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Hobgoblin",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "goblinoid",
    "alignment": "lawful evil",
    "ac": 18,
    "acType": "chain mail, shield",
    "hp": 11,
    "hpFormula": "2d8 + 2",
    "speed": "30 ft.",
    "str": 13,
    "dex": 12,
    "con": 12,
    "int": 12,
    "wis": 10,
    "cha": 9,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Common, Goblin",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [
      {
        "name": "Discipline",
        "desc": "The hobgoblin has advantage on saving throws against being charmed."
      },
      {
        "name": "Parry",
        "desc": "The hobgoblin adds 2 to its AC against one melee attack that it can see being made against it, provided it's wielding a melee weapon."
      }
    ],
    "actions": [
      {
        "name": "Longsword",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8 + 1) slashing damage, or 6 (1d10 + 1) slashing damage when used with two hands."
      },
      {
        "name": "Javelin",
        "desc": "Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 4 (1d6 + 1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [
      {
        "name": "Parry",
        "desc": "The hobgoblin adds 2 to its AC against one melee attack that it can see being made against it, provided it's wielding a melee weapon."
      }
    ],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Homunculus",
    "size": "Tiny",
    "type": "construct",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 5,
    "hpFormula": "2d4",
    "speed": "20 ft., fly 40 ft.",
    "str": 4,
    "dex": 15,
    "con": 10,
    "int": 10,
    "wis": 10,
    "cha": 7,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "understands all languages known to its creator but can't speak",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "desc": "The homunculus is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the homunculus must succeed on a Constitution saving throw against the caster's spell save DC or fall prone."
      },
      {
        "name": "Telepathic Bond",
        "desc": "While the homunculus and its creator are on the same plane of existence, the creator can magically sense what the homunculus senses (no action required) and can speak through the homunculus (one action to speak through the homunculus)."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 1 piercing damage, and the target must succeed on a DC 10 Constitution saving throw or take 5 (2d4) poison damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "poison, psychic",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Horse",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "natural armor",
    "hp": 13,
    "hpFormula": "2d10 + 2",
    "speed": "60 ft.",
    "str": 16,
    "dex": 10,
    "con": 12,
    "int": 2,
    "wis": 11,
    "cha": 7,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "0",
    "xp": 10,
    "crNum": 0,
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Hunter Shark",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 45,
    "hpFormula": "7d10+7",
    "speed": "0 ft., swim 40 ft.",
    "str": 18,
    "dex": 13,
    "con": 13,
    "int": 1,
    "wis": 11,
    "cha": 5,
    "saves": "",
    "skills": "Perception +2",
    "senses": "blindsight 30 ft., passive Perception 12",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Blood Frenzy",
        "desc": "The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Hydra",
    "size": "Huge",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 15,
    "acType": "natural armor",
    "hp": 172,
    "hpFormula": "15d12+75",
    "speed": "30 ft., swim 30 ft.",
    "str": 20,
    "dex": 12,
    "con": 20,
    "int": 2,
    "wis": 10,
    "cha": 7,
    "saves": "",
    "skills": "Perception +6",
    "senses": "darkvision 60 ft., passive Perception 16",
    "languages": "",
    "cr": "8",
    "xp": 3900,
    "crNum": 8,
    "traits": [
      {
        "name": "Hold Breath",
        "desc": "The hydra can hold its breath for 1 hour."
      },
      {
        "name": "Multiple Heads",
        "desc": "The hydra has five heads. While it has more than one head, the hydra has advantage on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious."
      },
      {
        "name": "Reactive Heads",
        "desc": "For each head the hydra has beyond one, it gets an extra reaction that can be used only for opportunity attacks."
      },
      {
        "name": "Wakeful",
        "desc": "While the hydra sleeps, at least one of its heads is awake."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The hydra makes as many bite attacks as it has heads."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 10 (1d10 + 5) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Hyena",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 5,
    "hpFormula": "1d8+1",
    "speed": "50 ft.",
    "str": 13,
    "dex": 14,
    "con": 12,
    "int": 2,
    "wis": 12,
    "cha": 5,
    "saves": "",
    "skills": "Perception +3",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Pack Tactics",
        "desc": "The hyena has advantage on an attack roll against a creature if at least one other hyena is within 5 feet of the target and the other hyena isn't incapacitated."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Imp",
    "size": "Tiny",
    "type": "fiend",
    "subtype": "devil",
    "alignment": "lawful evil",
    "ac": 13,
    "acType": "natural armor",
    "hp": 10,
    "hpFormula": "3d4 + 3",
    "speed": "20 ft., fly 40 ft.",
    "str": 6,
    "dex": 16,
    "con": 13,
    "int": 11,
    "wis": 14,
    "cha": 14,
    "saves": "Wisdom +4, Charisma +4",
    "skills": "Deception +4, Insight +4, Persuasion +4, Stealth +5",
    "damageResistances": "cold, fire, lightning, poison",
    "damageImmunities": "fire, poison",
    "senses": "darkvision 120 ft., passive Perception 12",
    "languages": "Infernal, Common",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Shapechanger",
        "desc": "The imp can use its action to polymorph into a beast form that resembles a rat (AC 12), a raven (AC 12), or a spider (AC 14), or back into its true form. Its statistics are the same in each form, except for the AC noted. Any equipment it's wearing isn't transformed. It reverts to its true form if it dies."
      },
      {
        "name": "Spellcasting",
        "desc": "The imp is a spellcaster. Its spellcasting ability is Charisma (spell save DC 12). It can innately cast the following spells, requiring no material components: At will: disguise self, mage hand; 1/day: scorching ray"
      },
      {
        "name": "Devil's Sight",
        "desc": "Magical darkness doesn't impede the imp's darkvision."
      },
      {
        "name": "Magic Resistance",
        "desc": "The imp has advantage on saving throws against spells and magical effects."
      }
    ],
    "actions": [
      {
        "name": "Sting",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d4 + 3) piercing damage, and the target must make on a DC 12 Constitution saving throw, taking 10 (3d6) poison damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Intellect Devourer",
    "size": "Tiny",
    "type": "aberration",
    "alignment": "chaotic evil",
    "ac": 12,
    "acType": "",
    "hp": 16,
    "hpFormula": "3d4+9",
    "speed": "40 ft.",
    "str": 6,
    "dex": 14,
    "con": 16,
    "int": 12,
    "wis": 10,
    "cha": 6,
    "saves": "",
    "skills": "Stealth +4",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "understands all languages but can't speak",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Telepathic Strengths and Weaknesses",
        "desc": "If the intellect devourer is adjacent to a creature against which it has advantage on melee attack rolls (see below), that creature has disadvantage on any saving throw it makes against the intellect devourer's spells. If a target resists those saving throws, the target is immune to the intellect devourer's spells."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4+2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Invisible Stalker",
    "size": "Medium",
    "type": "elemental",
    "alignment": "neutral",
    "ac": 15,
    "acType": "",
    "hp": 22,
    "hpFormula": "5d8",
    "speed": "50 ft., fly 50 ft. (hover)",
    "str": 16,
    "dex": 20,
    "con": 10,
    "int": 13,
    "wis": 15,
    "cha": 11,
    "saves": "Dex +7",
    "skills": "Perception +4, Stealth +7",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "Auran, understands all languages but speaks none",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Invisibility",
        "desc": "The stalker is invisible."
      },
      {
        "name": "Finely Tuned Senses",
        "desc": "The stalker can't be surprised."
      }
    ],
    "actions": [
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "damageVulnerabilities": ""
  },
  {
    "name": "Iron Golem",
    "size": "Large",
    "type": "construct",
    "alignment": "unaligned",
    "ac": 20,
    "acType": "natural armor",
    "hp": 210,
    "hpFormula": "20d10+100",
    "speed": "30 ft.",
    "str": 24,
    "dex": 8,
    "con": 20,
    "int": 3,
    "wis": 11,
    "cha": 1,
    "saves": "",
    "skills": "",
    "senses": "darkvision 120 ft., passive Perception 10",
    "languages": "understands the languages of its creator but can't speak",
    "cr": "16",
    "xp": 15000,
    "crNum": 16,
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "desc": "The golem is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the golem must succeed on a Constitution saving throw against the caster's spell save DC or fall prone."
      },
      {
        "name": "Fire Absorption",
        "desc": "Whenever the golem is subjected to fire damage, it takes no damage and instead regains a number of hit points equal to the fire damage dealt."
      },
      {
        "name": "Immutable Form",
        "desc": "The golem is immune to any spell or effect that would alter its form."
      },
      {
        "name": "Magic Resistance",
        "desc": "The golem has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The golem makes two melee attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 20 (3d8+7) bludgeoning damage."
      },
      {
        "name": "Sword",
        "desc": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 23 (3d10+7) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "fire, poison, psychic; bludgeoning, piercing, and slashing from nonmagical attacks",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Jackal",
    "size": "Small",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "natural armor",
    "hp": 3,
    "hpFormula": "1d6",
    "speed": "40 ft.",
    "str": 8,
    "dex": 13,
    "con": 11,
    "int": 3,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "Perception +3",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "0",
    "xp": 10,
    "crNum": 0,
    "traits": [
      {
        "name": "Pack Tactics",
        "desc": "The jackal has advantage on an attack roll against a creature if at least one other jackal is within 5 feet of the target and the other jackal isn't incapacitated."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +1 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Killer Whale",
    "size": "Huge",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 90,
    "hpFormula": "12d12+24",
    "speed": "0 ft., swim 60 ft.",
    "str": 19,
    "dex": 10,
    "con": 15,
    "int": 3,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +3",
    "senses": "blindsight 120 ft., passive Perception 13",
    "languages": "",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Echolocation",
        "desc": "The whale can't use its blindsight while deafened."
      },
      {
        "name": "Hold Breath",
        "desc": "The whale can hold its breath for 30 minutes."
      },
      {
        "name": "Keen Hearing",
        "desc": "The whale has advantage on Wisdom (Perception) checks that rely on hearing."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 21 (3d8+4) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Knight",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 18,
    "acType": "plate armor",
    "hp": 52,
    "hpFormula": "8d8+16",
    "speed": "30 ft.",
    "str": 16,
    "dex": 11,
    "con": 14,
    "int": 11,
    "wis": 11,
    "cha": 15,
    "saves": "Con +4",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "any one language (usually Common)",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Brave",
        "desc": "The knight has advantage on saving throws against being frightened."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The knight makes two longsword attacks."
      },
      {
        "name": "Longsword",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) slashing damage, or 8 (1d10+3) slashing damage if used with both hands."
      },
      {
        "name": "Heavy Crossbow",
        "desc": "Ranged Weapon Attack: +2 to hit, range 100/400 ft., one target. Hit: 5 (1d10) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [
      {
        "name": "Parry",
        "desc": "The knight adds 2 to its AC against one melee attack that would hit it. To do so, the knight must see the attacker and be wielding a melee weapon."
      }
    ],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Kobold",
    "size": "Small",
    "type": "humanoid",
    "subtype": "kobold",
    "alignment": "lawful evil",
    "ac": 12,
    "acType": "leather armor",
    "hp": 5,
    "hpFormula": "2d6 - 2",
    "speed": "30 ft.",
    "str": 7,
    "dex": 15,
    "con": 9,
    "int": 8,
    "wis": 7,
    "cha": 8,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 8",
    "languages": "Common, Draconic",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [
      {
        "name": "Sunlight Sensitivity",
        "desc": "While in sunlight, the kobold has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
      },
      {
        "name": "Pack Tactics",
        "desc": "The kobold has advantage on an attack roll against a creature if at least one other kobold is within 5 feet of the target and the other kobold isn't incapacitated."
      }
    ],
    "actions": [
      {
        "name": "Dagger",
        "desc": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d4 + 2) piercing damage."
      },
      {
        "name": "Sling",
        "desc": "Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 4 (1d4 + 2) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Kraken",
    "size": "Colossal",
    "type": "monstrosity",
    "alignment": "chaotic evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 472,
    "hpFormula": "27d20+189",
    "speed": "20 ft., swim 60 ft.",
    "str": 30,
    "dex": 11,
    "con": 25,
    "int": 17,
    "wis": 15,
    "cha": 17,
    "saves": "Str +16, Dex +7, Con +13, Int +9",
    "skills": "Insight +8, Perception +9",
    "senses": "truesight 120 ft., passive Perception 19",
    "languages": "understands Abyssal, Celestial, Infernal, and Primordial but has no mouth to speak",
    "cr": "23",
    "xp": 50000,
    "crNum": 23,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The kraken can breathe air and water."
      },
      {
        "name": "Freedom of Movement",
        "desc": "The kraken ignores difficult terrain, and magical effects can't reduce its speed or cause it to be restrained. It can spend 5 feet of movement to escape from nonmagical restraints or being grappled."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the kraken fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Reactive Tentacles",
        "desc": "For each creature other than the kraken within 5 feet of it that the kraken can see when it makes a melee attack, the kraken makes one additional melee attack with one of its tentacles against that creature."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The kraken makes three tentacle attacks, each of which it can replace with a use of Fling."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +16 to hit, reach 5 ft., one target. Hit: 33 (3d12+10) piercing damage. If the target is a creature, it is grappled (escape DC 18). Until this grapple ends, the target is restrained. The kraken can bite only one creature at a time."
      },
      {
        "name": "Tentacle",
        "desc": "Melee Weapon Attack: +16 to hit, reach 30 ft., one target. Hit: 20 (3d6+10) bludgeoning damage, and the target is grappled (escape DC 18). Until this grapple ends, the target is restrained. The kraken can have up to ten creatures grappled at a time, using each tentacle to grapple up to one creature."
      },
      {
        "name": "Fling",
        "desc": "One Large or smaller creature grappled by the kraken is thrown up to 60 feet in a random direction and knocked prone. If a thrown creature strikes a solid surface, it takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the creature is thrown at another creature, that creature must succeed on a DC 18 Dexterity saving throw or take the same damage and be knocked prone."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "lightning, poison; bludgeoning, piercing, and slashing from nonmagical attacks",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, poisoned, prone, restrained",
    "damageVulnerabilities": ""
  },
  {
    "name": "Lamia",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "chaotic evil",
    "ac": 13,
    "acType": "natural armor",
    "hp": 110,
    "hpFormula": "13d10+39",
    "speed": "30 ft.",
    "str": 16,
    "dex": 13,
    "con": 16,
    "int": 14,
    "wis": 15,
    "cha": 16,
    "saves": "Int +4, Wis +4, Cha +5",
    "skills": "Deception +5, Insight +4, Performance +5",
    "senses": "darkvision 60 ft., passive Perception 12",
    "languages": "Abyssal, Common",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The lamia makes two attacks: one with its claws and one with its spear or one with its claws and one with its tail."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) slashing damage."
      },
      {
        "name": "Spear",
        "desc": "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 6 (1d6+3) piercing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Lemure",
    "size": "Medium",
    "type": "fiend",
    "subtype": "devil",
    "alignment": "lawful evil",
    "ac": 13,
    "acType": "natural armor",
    "hp": 3,
    "hpFormula": "1d8-1",
    "speed": "20 ft.",
    "str": 10,
    "dex": 16,
    "con": 9,
    "int": 3,
    "wis": 11,
    "cha": 4,
    "saves": "",
    "skills": "",
    "senses": "darkvision 120 ft., passive Perception 10",
    "languages": "understands Infernal but can't speak",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Devil's Sight",
        "desc": "Magical darkness doesn't impede the lemure's darkvision."
      },
      {
        "name": "Hellish Rejuvenation",
        "desc": "A lemure that dies in the Nine Hells comes back to life with all its hit points within 1d10 days, as long as devils don't prevent its resurrection."
      }
    ],
    "actions": [
      {
        "name": "Fist",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4+1) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold, fire",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, frightened, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Lich",
    "size": "Medium",
    "type": "undead",
    "alignment": "any evil alignment",
    "ac": 17,
    "acType": "natural armor",
    "hp": 135,
    "hpFormula": "18d8 + 54",
    "speed": "30 ft.",
    "str": 16,
    "dex": 16,
    "con": 16,
    "int": 20,
    "wis": 14,
    "cha": 16,
    "saves": "Constitution +10, Intelligence +12, Wisdom +8, Charisma +9",
    "savingThrows": "Constitution +10, Intelligence +12, Wisdom +8, Charisma +9",
    "skills": "Arcana +12, History +12, Insight +8, Perception +8",
    "damageResistances": "cold, lightning, necrotic",
    "senses": "truesight 120 ft., passive Perception 18",
    "languages": "Abyssal, Common; telepathy 120 ft.",
    "cr": "21",
    "xp": 33000,
    "crNum": 21,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the lich fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Rejuvenation",
        "desc": "If the lich has a phylactery and the body is destroyed, the lich returns to life in 1d10 days by automatically awakening in its phylactery at full health."
      },
      {
        "name": "Spellcasting",
        "desc": "The lich is a 20th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 20, +12 to hit with spell attacks). The lich has the following wizard spells prepared:"
      }
    ],
    "actions": [
      {
        "name": "Paralyzing Touch",
        "desc": "Melee Spell Attack: +12 to hit, reach 5 ft., one creature. Hit: 10 (3d6) cold damage. The target must succeed on a DC 18 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on a success."
      },
      {
        "name": "Frightening Gaze",
        "desc": "The lich fixes its gaze on one creature it can see within 10 feet of it. The target must succeed on a DC 18 Wisdom saving throw against this magic or become frightened until the end of its next turn."
      },
      {
        "name": "Slow",
        "desc": "The lich targets one creature it can see within 60 feet of it. The creature must succeed on a DC 18 Dexterity saving throw or be slowed until the end of the lich's next turn (see the slowed condition in appendix A)."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageImmunities": "cold, lightning, necrotic, poison",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Lion",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 26,
    "hpFormula": "4d10+4",
    "speed": "50 ft.",
    "str": 17,
    "dex": 15,
    "con": 13,
    "int": 3,
    "wis": 12,
    "cha": 8,
    "saves": "",
    "skills": "Perception +3",
    "senses": "darkvision 60 ft., passive Perception 13",
    "languages": "",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Pack Tactics",
        "desc": "The lion has advantage on an attack roll against a creature if at least one other lion is within 5 feet of the target and the other lion isn't incapacitated."
      },
      {
        "name": "Pounce",
        "desc": "If the lion moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the lion can make one bite attack against it as a bonus action."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Lizard",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "natural armor",
    "hp": 1,
    "hpFormula": "1d4 - 1",
    "speed": "20 ft.",
    "str": 2,
    "dex": 14,
    "con": 9,
    "int": 1,
    "wis": 8,
    "cha": 3,
    "saves": "",
    "skills": "Stealth +4",
    "senses": "darkvision 30 ft., passive Perception 9",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Mage",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 12,
    "acType": "natural armor",
    "hp": 22,
    "hpFormula": "5d8",
    "speed": "30 ft.",
    "str": 9,
    "dex": 14,
    "con": 11,
    "int": 16,
    "wis": 12,
    "cha": 11,
    "saves": "Intelligence +5, Wisdom +3",
    "skills": "Arcana +5, Insight +3",
    "senses": "passive Perception 11",
    "languages": "any four languages",
    "cr": "6",
    "xp": 2300,
    "crNum": 6,
    "traits": [
      {
        "name": "Spellcasting",
        "desc": "The mage is a 5th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 13, +5 to hit with spell attacks). The mage has the following wizard spells prepared: Cantrips (at will): fire bolt, light, mage hand, prestidigitation; 1st level (4 slots): detect magic, mage armor, magic missile, shield; 2nd level (3 slots): misty step, scorching ray; 3rd level (2 slots): counterspell, fireball"
      }
    ],
    "actions": [
      {
        "name": "Dagger",
        "desc": "Melee or Ranged Weapon Attack: +2 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 2 (1d4) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [
      {
        "name": "Parry",
        "desc": "The mage adds 2 to its AC against one melee attack that it can see being made against it."
      }
    ],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Mammoth",
    "size": "Huge",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "natural armor",
    "hp": 126,
    "hpFormula": "11d12+55",
    "speed": "40 ft.",
    "str": 24,
    "dex": 9,
    "con": 21,
    "int": 3,
    "wis": 11,
    "cha": 6,
    "saves": "",
    "skills": "Perception +3",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "6",
    "xp": 2300,
    "crNum": 6,
    "traits": [],
    "actions": [
      {
        "name": "Gore",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 24 (2d12+6) piercing damage."
      },
      {
        "name": "Stomp",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one creature. Hit: 22 (3d8+6) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Manticore",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "chaotic evil",
    "ac": 14,
    "acType": "natural armor",
    "hp": 76,
    "hpFormula": "8d10+32",
    "speed": "30 ft., fly 60 ft.",
    "str": 17,
    "dex": 16,
    "con": 17,
    "int": 7,
    "wis": 12,
    "cha": 8,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "Common",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The manticore makes three attacks: one with its bite and two with its claws or two with its talons."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) slashing damage."
      },
      {
        "name": "Talons",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) slashing damage."
      },
      {
        "name": "Tail Spikes",
        "desc": "Ranged Weapon Attack: +5 to hit, range 100/200 ft., one target. Hit: 7 (1d8+3) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Marilith",
    "size": "Large",
    "type": "fiend",
    "subtype": "demon",
    "alignment": "chaotic evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 189,
    "hpFormula": "18d10+90",
    "speed": "40 ft.",
    "str": 18,
    "dex": 20,
    "con": 20,
    "int": 18,
    "wis": 16,
    "cha": 20,
    "saves": "Str +9, Con +10, Wis +8, Cha +10",
    "skills": "",
    "senses": "truesight 120 ft., passive Perception 13",
    "languages": "Abyssal, telepathy 120 ft.",
    "cr": "16",
    "xp": 15000,
    "crNum": 16,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The marilith has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Magic Weapons",
        "desc": "The marilith's weapon attacks are magical."
      },
      {
        "name": "Reactive",
        "desc": "The marilith can take one reaction on every turn in a combat."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The marilith makes seven attacks: six with its longswords and one with its tail."
      },
      {
        "name": "Longsword",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one creature. Hit: 15 (2d10 + 4) bludgeoning damage. If the target is Medium or smaller, it is grappled (escape DC 19)."
      },
      {
        "name": "Teleport",
        "desc": "The marilith magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."
      }
    ],
    "legendaryActions": [],
    "reactions": [
      {
        "name": "Parry",
        "desc": "The marilith adds 5 to its AC against one melee attack that would hit it."
      }
    ],
    "damageResistances": "cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Mastiff",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 5,
    "hpFormula": "1d8+1",
    "speed": "40 ft.",
    "str": 13,
    "dex": 14,
    "con": 12,
    "int": 3,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "Perception +3",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [
      {
        "name": "Keen Hearing and Smell",
        "desc": "The mastiff has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) piercing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Medusa",
    "size": "Medium",
    "type": "monstrosity",
    "alignment": "lawful evil",
    "ac": 15,
    "acType": "natural armor",
    "hp": 127,
    "hpFormula": "17d8+51",
    "speed": "30 ft.",
    "str": 10,
    "dex": 15,
    "con": 16,
    "int": 12,
    "wis": 13,
    "cha": 15,
    "saves": "",
    "skills": "Deception +5, Insight +4, Perception +4, Stealth +5",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "Common",
    "cr": "6",
    "xp": 2300,
    "crNum": 6,
    "traits": [
      {
        "name": "Petrifying Gaze",
        "desc": "When a creature that can see the medusa's eyes starts its turn within 30 feet of the medusa, the medusa can force it to make a DC 14 Constitution saving throw if the medusa isn't incapacitated and can see the creature. On a failed save, the creature is petrified."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The medusa makes either three melee attacks — one with its snake hair and two with its shortsword — or two ranged attacks with its longbow."
      },
      {
        "name": "Snake Hair",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 4 (1d4 + 2) piercing damage plus 14 (4d6) poison damage."
      },
      {
        "name": "Shortsword",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Longbow",
        "desc": "Ranged Weapon Attack: +5 to hit, range 150/600 ft., one target. Hit: 6 (1d8 + 2) piercing damage plus 7 (2d6) poison damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Merrow",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "chaotic evil",
    "ac": 13,
    "acType": "natural armor",
    "hp": 45,
    "hpFormula": "6d10+12",
    "speed": "10 ft., swim 40 ft.",
    "str": 18,
    "dex": 13,
    "con": 14,
    "int": 6,
    "wis": 10,
    "cha": 9,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Abyssal, Aquan",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The merrow can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The merrow makes two attacks: one with its bite and one with its claws or trident."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) slashing damage."
      },
      {
        "name": "Trident",
        "desc": "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 6 (1d6+3) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Mimic",
    "size": "Medium",
    "type": "monstrosity",
    "alignment": "neutral",
    "ac": 12,
    "acType": "natural armor",
    "hp": 58,
    "hpFormula": "9d8+18",
    "speed": "15 ft.",
    "str": 17,
    "dex": 12,
    "con": 15,
    "int": 5,
    "wis": 13,
    "cha": 8,
    "saves": "",
    "skills": "Stealth +5",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Shapechanger",
        "desc": "The mimic can use its action to polymorph into an object or back into its true, amorphous form."
      },
      {
        "name": "Adhesive (Object Form Only)",
        "desc": "The mimic adheres to anything that touches it. A Huge or smaller creature adhered to the mimic is also grappled by it (escape DC 13)."
      },
      {
        "name": "False Appearance (Object Form Only)",
        "desc": "While the mimic remains motionless, it is indistinguishable from an ordinary object."
      }
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) bludgeoning damage. If the mimic is in object form, the target is subjected to its Adhesive trait."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage plus 4 (1d8) acid damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "acid",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Mind Flayer",
    "size": "Medium",
    "type": "aberration",
    "alignment": "lawful evil",
    "ac": 15,
    "acType": "breastplate",
    "hp": 71,
    "hpFormula": "13d8+13",
    "speed": "30 ft.",
    "str": 11,
    "dex": 12,
    "con": 12,
    "int": 19,
    "wis": 17,
    "cha": 17,
    "saves": "Int +7, Wis +6, Cha +6",
    "skills": "Arcana +7, Deception +6, Insight +6, Perception +6, Persuasion +6, Stealth +4",
    "senses": "darkvision 120 ft., passive Perception 16",
    "languages": "Deep Speech, Undercommon, telepathy 120 ft.",
    "cr": "7",
    "xp": 2900,
    "crNum": 7,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The mind flayer has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Innate Spellcasting (Psionics)",
        "desc": "The mind flayer's innate spellcasting ability is Intelligence (spell save DC 15). It can innately cast the following spells, requiring no components: At will: detect thoughts, levitate; 1/day each: dominate monster, plane shift (self only)."
      }
    ],
    "actions": [
      {
        "name": "Tentacles",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 15 (2d10 + 4) psychic damage. If the target is Medium or smaller, it is grappled (escape DC 15) and must succeed on a DC 15 Intelligence saving throw or be stunned until the grapple ends."
      },
      {
        "name": "Extract Brain",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one incapacitated humanoid grappled by the mind flayer. Hit: The target takes 55 (10d10) piercing damage. If this damage reduces the target to 0 hit points, the mind flayer kills the target by extracting and devouring its brain."
      },
      {
        "name": "Mind Blast (Recharge 5-6)",
        "desc": "The mind flayer magically emits psychic energy in a 60-foot cone. Each creature in that area must succeed on a DC 15 Intelligence saving throw or take 22 (4d8 + 4) psychic damage and be stunned for 1 minute."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Minotaur",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "chaotic evil",
    "ac": 14,
    "acType": "natural armor",
    "hp": 76,
    "hpFormula": "8d10+32",
    "speed": "40 ft.",
    "str": 18,
    "dex": 11,
    "con": 17,
    "int": 6,
    "wis": 16,
    "cha": 9,
    "saves": "",
    "skills": "Perception +5",
    "senses": "darkvision 60 ft., passive Perception 15",
    "languages": "Giant",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Charge",
        "desc": "If the minotaur moves at least 10 feet straight toward a creature and then hits it with a gore attack on the same turn, that target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be pushed up to 10 feet away and knocked prone."
      },
      {
        "name": "Labyrinthine Recall",
        "desc": "The minotaur can perfectly recall any path it has traveled."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The minotaur makes three attacks: one with its bite and two with its horns or greataxe."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) piercing damage."
      },
      {
        "name": "Horns",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d10+3) piercing damage."
      },
      {
        "name": "Greataxe",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (1d12+3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Mule",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "",
    "hp": 3,
    "hpFormula": "1d6",
    "speed": "40 ft.",
    "str": 14,
    "dex": 10,
    "con": 12,
    "int": 2,
    "wis": 11,
    "cha": 7,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [
      {
        "name": "Beast of Burden",
        "desc": "The mule is considered to be one size larger for the purpose of determining its carrying capacity."
      },
      {
        "name": "Sure-Footed",
        "desc": "The mule has advantage on Strength and Dexterity saving throws made against effects that would knock it prone."
      }
    ],
    "actions": [
      {
        "name": "Hoof",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Mummy",
    "size": "Human-sized",
    "type": "undead",
    "alignment": "lawful evil",
    "ac": 11,
    "acType": "",
    "hp": 58,
    "hpFormula": "9d8+18",
    "speed": "20 ft.",
    "str": 16,
    "dex": 8,
    "con": 15,
    "int": 6,
    "wis": 10,
    "cha": 12,
    "saves": "Wis +2",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "the languages it knew in life",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Curse of the Mummy Lord",
        "desc": "If the mummy dies, magical energy escapes in a 30-foot-radius sphere centered on its body. Each creature in that area must make a DC 12 Wisdom saving throw. A creature takes 11 (2d10) psychic damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Sunlight Sensitivity",
        "desc": "The mummy takes 2 radiant damage when it starts its turn in sunlight."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The mummy can use its Dreadful Glare and makes one attack with its rotting fist."
      },
      {
        "name": "Rotting Fist",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) bludgeoning damage plus 10 (3d6) necrotic damage."
      },
      {
        "name": "Dreadful Glare",
        "desc": "The mummy targets one creature it can see within 60 feet of it. If the target can see the mummy, it must succeed on a DC 11 Wisdom saving throw against this magic or become frightened until the end of the mummy's next turn. If the target fails the save by 5 or more, it is frightened until the end of its next turn, and can't move or take actions at all on its next turn, as it is paralyzed by fear."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "necrotic, nonmagical bludgeoning, piercing, and slashing, poison",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Mummy Lord",
    "size": "Medium",
    "type": "undead",
    "alignment": "lawful evil",
    "ac": 17,
    "acType": "natural armor",
    "hp": 97,
    "hpFormula": "13d8+39",
    "speed": "20 ft.",
    "str": 18,
    "dex": 10,
    "con": 17,
    "int": 11,
    "wis": 18,
    "cha": 16,
    "saves": "Con +8, Int +5, Wis +9, Cha +8",
    "skills": "History +5, Religion +5",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "the languages it knew in life",
    "cr": "15",
    "xp": 13000,
    "crNum": 15,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The mummy lord has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Rejuvenation",
        "desc": "A destroyed mummy lord gains a new body in 24 hours if its heart is intact, regaining all its hit points and becoming active again."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The mummy can use its Dreadful Glare and makes one attack with its rotting fist."
      },
      {
        "name": "Rotting Fist",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 14 (3d6 + 4) bludgeoning damage plus 21 (6d6) necrotic damage. If the target is a creature, it must succeed on a DC 16 Constitution saving throw or be cursed with mummy rot."
      },
      {
        "name": "Dreadful Glare",
        "desc": "The mummy lord targets one creature it can see within 60 feet. If the target can see the mummy lord, it must succeed on a DC 16 Wisdom saving throw against this magic or become frightened until the end of the mummy's next turn."
      }
    ],
    "legendaryActions": [
      {
        "name": "Attack",
        "desc": "The mummy lord makes one attack with its rotting fist or uses its Dreadful Glare."
      },
      {
        "name": "Blinding Dust",
        "desc": "Blinding dust and sand swirls magically around the mummy lord. Each creature within 5 feet must succeed on a DC 16 Constitution saving throw or be blinded until the end of the creature's next turn."
      },
      {
        "name": "Blasphemous Word (Costs 2 Actions)",
        "desc": "The mummy lord utters a blasphemous word. Each non-undead creature within 10 feet that can hear the magical utterance must succeed on a DC 16 Constitution saving throw or be stunned until the end of the mummy lord's next turn."
      }
    ],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "necrotic, poison; bludgeoning, piercing, and slashing from nonmagical attacks",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, poisoned",
    "damageVulnerabilities": "fire"
  },
  {
    "name": "Myconid Sprout",
    "size": "Small",
    "type": "plant",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "natural armor",
    "hp": 13,
    "hpFormula": "3d6+3",
    "speed": "20 ft.",
    "str": 13,
    "dex": 13,
    "con": 12,
    "int": 10,
    "wis": 11,
    "cha": 9,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Myconid",
    "cr": "0",
    "xp": 10,
    "crNum": 0,
    "traits": [
      {
        "name": "Spore Cloud (Recharge 6)",
        "desc": "A 15-foot radius cloud of toxic spores extends all around the myconid on a turn when it takes damage. Each creature in that area must succeed on a DC 12 Constitution saving throw or take 5 (2d4) poison damage."
      }
    ],
    "actions": [
      {
        "name": "Fist",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Nalfeshnee",
    "size": "Large",
    "type": "fiend",
    "subtype": "demon",
    "alignment": "chaotic evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 184,
    "hpFormula": "16d10+96",
    "speed": "20 ft., fly 30 ft.",
    "str": 21,
    "dex": 10,
    "con": 22,
    "int": 19,
    "wis": 12,
    "cha": 15,
    "saves": "Con +9, Int +8, Wis +5, Cha +6",
    "skills": "Insight +5, Perception +5",
    "senses": "truesight 120 ft., passive Perception 15",
    "languages": "Abyssal, telepathy 120 ft.",
    "cr": "13",
    "xp": 10000,
    "crNum": 13,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The nalfeshnee has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The nalfeshnee makes four attacks: one with its bite and three with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 12 (2d6+5) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 15 (2d8+6) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Night Hag",
    "size": "Medium",
    "type": "fiend",
    "alignment": "chaotic evil",
    "ac": 17,
    "acType": "natural armor",
    "hp": 112,
    "hpFormula": "15d8+45",
    "speed": "30 ft.",
    "str": 18,
    "dex": 15,
    "con": 16,
    "int": 16,
    "wis": 14,
    "cha": 16,
    "saves": "Dex +5, Con +6, Wis +5, Cha +6",
    "skills": "Arcana +6, Deception +6, Insight +5, Perception +5, Stealth +5",
    "senses": "darkvision 120 ft., passive Perception 15",
    "languages": "Abyssal, Common, Infernal, Primordial",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Innate Spellcasting",
        "desc": "The hag's innate spellcasting ability is Charisma (spell save DC 14). She can innately cast the following spells, requiring no material components: At will: detect magic, detect thoughts"
      },
      {
        "name": "Magic Resistance",
        "desc": "The hag has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Magic Weapons",
        "desc": "The hag's weapon attacks are magical."
      }
    ],
    "actions": [
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) slashing damage."
      },
      {
        "name": "Invisibility and Teleportation",
        "desc": "The hag magically becomes invisible until she attacks or casts a spell, or until her concentration ends (as if concentrating on a spell). While invisible, she can move up to her speed each round on initiative count 20 (losing ties)."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Nightmare",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "chaotic evil",
    "ac": 13,
    "acType": "natural armor",
    "hp": 68,
    "hpFormula": "8d10+24",
    "speed": "60 ft., fly 90 ft.",
    "str": 18,
    "dex": 15,
    "con": 16,
    "int": 3,
    "wis": 12,
    "cha": 15,
    "saves": "Wis +4",
    "skills": "Insight +1",
    "senses": "passive Perception 11",
    "languages": "understands Abyssal, Common, and Infernal but can't speak",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The nightmare makes two attacks: one with its bite and one to constrict."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) piercing damage."
      },
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) bludgeoning damage."
      },
      {
        "name": "Ethereal Flaming Mane",
        "desc": "When the nightmare uses its action to cast a spell, it can make a melee attack as a bonus action."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "fire",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Noble",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 15,
    "acType": "breastplate",
    "hp": 9,
    "hpFormula": "2d8",
    "speed": "30 ft.",
    "str": 11,
    "dex": 13,
    "con": 11,
    "int": 12,
    "wis": 14,
    "cha": 16,
    "saves": "",
    "skills": "Deception +3, Insight +2, Persuasion +5",
    "senses": "passive Perception 12",
    "languages": "any two languages",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Rapier",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8+1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Ochre Jelly",
    "size": "Large",
    "type": "ooze",
    "alignment": "unaligned",
    "ac": 8,
    "acType": "",
    "hp": 45,
    "hpFormula": "6d10+12",
    "speed": "10 ft., swim 10 ft.",
    "str": 15,
    "dex": 6,
    "con": 14,
    "int": 2,
    "wis": 6,
    "cha": 1,
    "saves": "",
    "skills": "",
    "senses": "blindsight 60 ft. (blind beyond 60 feet), passive Perception 8",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Amorphous",
        "desc": "The jelly can occupy another creature's space and vice versa."
      },
      {
        "name": "Corrosive Form",
        "desc": "A creature that touches the jelly or hits it with a melee attack while within 5 feet of it takes 4 (1d8) acid damage. Any nonmagical weapon made of metal or wood that hits the jelly corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If a weapon's penalty drops below -5, the weapon is destroyed. Nonmagical ammunition made of metal or wood that hits the jelly is destroyed after dealing damage. The jelly can eat through 2-inch-thick, non-magical wood or metal in 1 round."
      }
    ],
    "actions": [
      {
        "name": "Pseudopod",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) acid damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "acid, cold, lightning, poison, slashing",
    "conditionImmunities": "blinded, charmed, deafened, exhaustion, frightened, prone",
    "damageVulnerabilities": ""
  },
  {
    "name": "Octopus",
    "size": "Small",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 3,
    "hpFormula": "1d6",
    "speed": "0 ft., swim 30 ft.",
    "str": 8,
    "dex": 15,
    "con": 11,
    "int": 3,
    "wis": 10,
    "cha": 4,
    "saves": "",
    "skills": "Perception +2, Stealth +4",
    "senses": "darkvision 30 ft., passive Perception 12",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The octopus can breathe air and water."
      },
      {
        "name": "Hold Breath",
        "desc": "While out of water, the octopus can hold its breath for 1 hour."
      },
      {
        "name": "Invisible in Water",
        "desc": "If the octopus is in water, it has three-quarters cover against attacks from outside the water."
      }
    ],
    "actions": [
      {
        "name": "Tentacles",
        "desc": "Melee Weapon Attack: +4 to hit, reach 15 ft., one target. Hit: 4 (1d4+2) bludgeoning damage. If the target is a creature, it is grappled (escape DC 12). Until this grapple ends, the target is restrained, and unable to breathe unless it can breathe water. The octopus has three tentacles, each of which can grapple one target."
      },
      {
        "name": "Ink Cloud",
        "desc": "A 5-foot-radius cloud of ink extends all around the octopus if it is in water. The area is heavily obscured for 1 minute, unless a current disperses the cloud sooner. The octopus can use a bonus action after releasing the ink to move up to its swimming speed."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Ogre",
    "size": "Large",
    "type": "humanoid",
    "subtype": "ogre",
    "alignment": "chaotic evil",
    "ac": 11,
    "acType": "hide armor",
    "hp": 59,
    "hpFormula": "7d10+21",
    "speed": "40 ft.",
    "str": 19,
    "dex": 8,
    "con": 16,
    "int": 5,
    "wis": 7,
    "cha": 8,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 8",
    "languages": "Common, Giant",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [],
    "actions": [
      {
        "name": "Greatclub",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) bludgeoning damage."
      },
      {
        "name": "Javelin",
        "desc": "Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 11 (2d6+4) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Oni",
    "size": "Large",
    "type": "fiend",
    "alignment": "lawful evil",
    "ac": 16,
    "acType": "natural armor",
    "hp": 110,
    "hpFormula": "13d10+39",
    "speed": "30 ft., fly 30 ft. (hover)",
    "str": 19,
    "dex": 11,
    "con": 16,
    "int": 14,
    "wis": 12,
    "cha": 15,
    "saves": "Dex +3, Con +5, Wis +4, Cha +5",
    "skills": "Insight +4, Perception +4",
    "senses": "darkvision 60 ft., truesight 120 ft., passive Perception 14",
    "languages": "Giant, Common",
    "cr": "7",
    "xp": 2900,
    "crNum": 7,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The oni has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Magic Weapons",
        "desc": "The oni's weapon attacks are magical."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The oni makes two attacks with its claws or two with its glaive."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 8 (1d8+4) slashing damage."
      },
      {
        "name": "Glaive",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 11 (2d8+3) slashing damage, or 12 (2d8+4) slashing damage if used with both hands to make a melee attack."
      },
      {
        "name": "Change Shape",
        "desc": "The oni magically polymorphs into a Small or Medium humanoid, into a giant, or back into its true form. Other than its size, its statistics remain unchanged. It can't change into a form smaller than Small or larger than giant."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Orc",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "orc",
    "alignment": "chaotic evil",
    "ac": 13,
    "acType": "hide armor",
    "hp": 15,
    "hpFormula": "2d8 + 6",
    "speed": "30 ft.",
    "str": 16,
    "dex": 12,
    "con": 16,
    "int": 7,
    "wis": 11,
    "cha": 10,
    "saves": "",
    "skills": "Intimidation +2",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Common, Orc",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [
      {
        "name": "Aggressive",
        "desc": "As a bonus action, the orc can move up to its speed toward a hostile creature that it can see."
      }
    ],
    "actions": [
      {
        "name": "Greataxe",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12 + 3) slashing damage."
      },
      {
        "name": "Javelin",
        "desc": "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 6 (1d6 + 3) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Otyugh",
    "size": "Large",
    "type": "aberration",
    "alignment": "neutral",
    "ac": 14,
    "acType": "natural armor",
    "hp": 114,
    "hpFormula": "12d10+48",
    "speed": "30 ft.",
    "str": 16,
    "dex": 11,
    "con": 18,
    "int": 6,
    "wis": 13,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "Otyugh",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Limited Telepathy",
        "desc": "The otyugh can magically sense the presence of creatures within 60 feet of it that have an Intelligence of 3 or higher. It can't sense a creature if water, extensive stonework, or 3 feet of organic matter blocks the telepathic connection."
      },
      {
        "name": "Reactive Attacks",
        "desc": "For each creature other than the otyugh within 5 feet of it that the otyugh can see when it makes a melee attack, the otyugh makes one additional melee attack with the same weapon against that creature."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The otyugh makes three attacks: one with its bite and two with its tentacles."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) piercing damage. If the target is a creature, it must succeed on a DC 15 Constitution saving throw against being magically diseased. The disease lasts until removed by the greater restoration spell or other magic."
      },
      {
        "name": "Tentacle",
        "desc": "Melee Weapon Attack: +5 to hit, reach 15 ft., one target. Hit: 6 (1d6+3) piercing damage plus 3 (1d6) poison damage. If the target is Medium or smaller, it is grappled (escape DC 15). Until this grapple ends, the target is restrained, and unable to breathe unless it can breathe water. If the otyugh moves, the grappled creature moves with it."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Owl",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "",
    "hp": 1,
    "hpFormula": "1d4-1",
    "speed": "5 ft., fly 60 ft.",
    "str": 3,
    "dex": 13,
    "con": 8,
    "int": 2,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +4, Stealth +3",
    "senses": "darkvision 120 ft., passive Perception 14",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Flyby",
        "desc": "The owl doesn't provoke an opportunity attack when it flies away from an enemy."
      },
      {
        "name": "Keen Hearing and Sight",
        "desc": "The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight."
      }
    ],
    "actions": [
      {
        "name": "Talons",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Owlbear",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "natural armor",
    "hp": 59,
    "hpFormula": "7d10+21",
    "speed": "40 ft.",
    "str": 20,
    "dex": 12,
    "con": 17,
    "int": 3,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +3",
    "senses": "darkvision 60 ft., passive Perception 13",
    "languages": "",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Keen Sight and Smell",
        "desc": "The owlbear has advantage on Wisdom (Perception) checks that rely on sight or smell."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The owlbear makes two attacks: one with its beak and one with its claws."
      },
      {
        "name": "Beak",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one creature. Hit: 10 (1d10 + 5) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8 + 5) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Panther",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "natural armor",
    "hp": 13,
    "hpFormula": "2d8 + 4",
    "speed": "50 ft.",
    "str": 14,
    "dex": 15,
    "con": 14,
    "int": 2,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +3, Stealth +4",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "0",
    "xp": 10,
    "crNum": 0,
    "traits": [
      {
        "name": "Keen Smell",
        "desc": "The panther has advantage on Wisdom (Perception) checks that rely on smell."
      },
      {
        "name": "Pounce",
        "desc": "If the panther moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the panther can make one bite attack against it as a bonus action."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Pegasus",
    "size": "Large",
    "type": "celestial",
    "alignment": "chaotic good",
    "ac": 12,
    "acType": "",
    "hp": 59,
    "hpFormula": "7d10+21",
    "speed": "60 ft., fly 90 ft.",
    "str": 18,
    "dex": 15,
    "con": 16,
    "int": 10,
    "wis": 15,
    "cha": 13,
    "saves": "Dex +4",
    "skills": "Perception +4",
    "senses": "passive Perception 14",
    "languages": "understands Common and Celestial but can't speak",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Peryton",
    "size": "Medium",
    "type": "monstrosity",
    "alignment": "chaotic evil",
    "ac": 13,
    "acType": "natural armor",
    "hp": 33,
    "hpFormula": "6d8+6",
    "speed": "20 ft., fly 60 ft.",
    "str": 14,
    "dex": 14,
    "con": 13,
    "int": 4,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "Perception +4",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "understands Common and Sylvan but can't speak",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Dive Attack",
        "desc": "If the peryton is flying and dives at least 30 feet straight toward a target and then hits it with a melee attack, the attack deals an extra 7 (2d6) damage to the target."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The peryton makes two attacks: one with its beak and one with its talons."
      },
      {
        "name": "Beak",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) piercing damage."
      },
      {
        "name": "Talons",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4+2) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Phase Spider",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 15,
    "acType": "natural armor",
    "hp": 32,
    "hpFormula": "5d10+5",
    "speed": "40 ft.",
    "str": 15,
    "dex": 15,
    "con": 12,
    "int": 6,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "Stealth +4",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Ethereal Jaunt",
        "desc": "As a bonus action on its turn, the spider can magically shift from the Material Plane to the Ethereal Plane, or vice versa. Its movement this turn doesn't change."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 7 (1d10+2) piercing damage, and the target must make a DC 11 Constitution saving throw or take 9 (2d8) poison damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Pit Fiend",
    "size": "Large",
    "type": "fiend",
    "subtype": "devil",
    "alignment": "lawful evil",
    "ac": 19,
    "acType": "natural armor",
    "hp": 300,
    "hpFormula": "24d10+168",
    "speed": "30 ft., fly 60 ft.",
    "str": 24,
    "dex": 14,
    "con": 24,
    "int": 20,
    "wis": 16,
    "cha": 22,
    "saves": "Str +12, Dex +8, Con +12, Wis +8, Cha +12",
    "skills": "Deception +12, Insight +8, Perception +8",
    "senses": "truesight 120 ft., passive Perception 18",
    "languages": "Infernal, telepathy 120 ft.",
    "cr": "20",
    "xp": 25000,
    "crNum": 20,
    "traits": [
      {
        "name": "Aura of Despair",
        "desc": "Any creature that starts its turn within 20 feet of the pit fiend and can see it must succeed on a DC 20 Wisdom saving throw or be frightened until the start of its next turn."
      },
      {
        "name": "Devil's Sight",
        "desc": "Magical darkness doesn't impede the pit fiend's darkvision."
      },
      {
        "name": "Magic Resistance",
        "desc": "The pit fiend has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The pit fiend makes four attacks: one with its bite and three with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 15 (2d6+8) piercing damage. The target must succeed on a DC 20 Constitution saving throw or take 7 (2d6) poison damage and become poisoned until the end of its next turn."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 12 (2d4+7) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Planetar",
    "size": "Large",
    "type": "celestial",
    "alignment": "lawful good",
    "ac": 19,
    "acType": "natural armor",
    "hp": 200,
    "hpFormula": "16d10+112",
    "speed": "40 ft., fly 120 ft.",
    "str": 24,
    "dex": 20,
    "con": 24,
    "int": 19,
    "wis": 22,
    "cha": 21,
    "saves": "Con +11, Wis +10, Cha +10",
    "skills": "Insight +10, Perception +10",
    "senses": "truesight 120 ft., passive Perception 20",
    "languages": "all, telepathy 120 ft.",
    "cr": "16",
    "xp": 15000,
    "crNum": 16,
    "traits": [
      {
        "name": "Innate Spellcasting",
        "desc": "The planetar's spellcasting ability is Charisma (spell save DC 20). It can innately cast the following spells, requiring only verbal components: At will: detect evil and good, detect magic, detect thoughts"
      },
      {
        "name": "Magic Resistance",
        "desc": "The planetar has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Magic Weapons",
        "desc": "The planetar's weapon attacks are magical."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The planetar makes two attacks with its greatsword."
      },
      {
        "name": "Greatsword",
        "desc": "Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 21 (4d6+7) slashing damage plus 22 (4d10) radiant damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "radiant; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Poisonous Snake",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "",
    "hp": 2,
    "hpFormula": "1d4",
    "speed": "30 ft., swim 30 ft.",
    "str": 2,
    "dex": 16,
    "con": 10,
    "int": 1,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "",
    "senses": "blindsight 10 ft., passive Perception 10",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 4 (1d4+2) piercing damage plus 2 (1d4) poison damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Polar Bear",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "natural armor",
    "hp": 42,
    "hpFormula": "5d10+15",
    "speed": "40 ft., swim 30 ft.",
    "str": 20,
    "dex": 10,
    "con": 16,
    "int": 2,
    "wis": 13,
    "cha": 7,
    "saves": "",
    "skills": "Perception +3",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Keen Smell",
        "desc": "The bear has advantage on Wisdom (Perception) checks that rely on smell."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The bear makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 9 (1d8+5) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 12 (2d6+5) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Pony",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "",
    "hp": 11,
    "hpFormula": "2d8+2",
    "speed": "40 ft.",
    "str": 15,
    "dex": 10,
    "con": 13,
    "int": 2,
    "wis": 11,
    "cha": 7,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Priest",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 13,
    "acType": "chain shirt",
    "hp": 27,
    "hpFormula": "5d8 + 5",
    "speed": "25 ft.",
    "str": 10,
    "dex": 10,
    "con": 12,
    "int": 13,
    "wis": 16,
    "cha": 13,
    "saves": "Wisdom +5, Charisma +3",
    "skills": "Medicine +7, Persuasion +3, Religion +3",
    "senses": "passive Perception 13",
    "languages": "any two languages",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Divine Eminence",
        "desc": "As a bonus action, the priest can expend one spell slot to cause its melee weapon attacks to magically deal an extra 10 (3d6) radiant damage to a target it hits. This benefit lasts until the end of the turn. If the priest expends a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each level above 1st."
      },
      {
        "name": "Spellcasting",
        "desc": "The priest is a 5th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 13, +5 to hit with spell attacks). The priest has the following cleric spells prepared: Cantrips (at will): light, sacred flame, thaumaturgy; 1st level (4 slots): cure wounds, guiding bolt, sanctuary; 2nd level (3 slots): lesser restoration, spiritual weapon; 3rd level (2 slots): dispel magic, spirit guardians"
      }
    ],
    "actions": [
      {
        "name": "Mace",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 3 (1d6) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Pteranodon",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 13,
    "hpFormula": "2d8+4",
    "speed": "10 ft., fly 80 ft.",
    "str": 12,
    "dex": 15,
    "con": 13,
    "int": 2,
    "wis": 12,
    "cha": 5,
    "saves": "",
    "skills": "Perception +3",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Purple Worm",
    "size": "Gargantuan",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 18,
    "acType": "natural armor",
    "hp": 247,
    "hpFormula": "15d20+90",
    "speed": "50 ft., burrow 30 ft.",
    "str": 28,
    "dex": 7,
    "con": 22,
    "int": 1,
    "wis": 8,
    "cha": 4,
    "saves": "Con +11, Wis +4",
    "skills": "",
    "senses": "blindsight 30 ft., tremorsense 60 ft., passive Perception 9",
    "languages": "",
    "cr": "15",
    "xp": 13000,
    "crNum": 15,
    "traits": [
      {
        "name": "Tunneler",
        "desc": "The worm can burrow through solid rock at half its burrow speed and leaves a 10-foot-diameter tunnel in its wake."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The worm makes two attacks: one with its bite and one with its stinger."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 22 (3d8 + 9) piercing damage. If the target is a Large or smaller creature, it must succeed on a DC 19 Dexterity saving throw or be swallowed by the worm."
      },
      {
        "name": "Tail Stinger",
        "desc": "Melee Weapon Attack: +14 to hit, reach 10 ft., one creature. Hit: 19 (3d6 + 9) piercing damage plus 42 (12d6) poison damage. The target must make a DC 19 Constitution saving throw, taking half poison damage on a success."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Quaggoth",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "quaggoth",
    "alignment": "chaotic evil",
    "ac": 13,
    "acType": "natural armor",
    "hp": 45,
    "hpFormula": "6d8 + 18",
    "speed": "40 ft.",
    "str": 17,
    "dex": 12,
    "con": 16,
    "int": 6,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "",
    "senses": "darkvision 120 ft., passive Perception 11",
    "languages": "Quaggoth",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the quaggoth fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The quaggoth makes two claw attacks and one bite attack."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "",
    "conditionImmunities": "frightened",
    "damageVulnerabilities": ""
  },
  {
    "name": "Quasit",
    "size": "Tiny",
    "type": "fiend",
    "subtype": "demon",
    "alignment": "chaotic evil",
    "ac": 13,
    "acType": "",
    "hp": 3,
    "hpFormula": "1d4+1",
    "speed": "40 ft.",
    "str": 5,
    "dex": 17,
    "con": 13,
    "int": 10,
    "wis": 10,
    "cha": 6,
    "saves": "",
    "skills": "Stealth +4",
    "senses": "darkvision 120 ft., passive Perception 10",
    "languages": "Abyssal, Common",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The quasit has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Shapechanger",
        "desc": "The quasit can use its action to polymorph into a beast form that resembles a bat, centipede, or mouse, or back into its true form. Its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed."
      }
    ],
    "actions": [
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d4+3) slashing damage."
      },
      {
        "name": "Scare (1/Day)",
        "desc": "One creature of the quasit's choice within 20 feet that the quasit can see must succeed on a DC 10 Wisdom saving throw or be frightened for 1 minute."
      },
      {
        "name": "Invisibility",
        "desc": "The quasit magically turns invisible until it attacks or uses Scare, or until its concentration ends (as if concentrating on a spell). Any equipment the quasit is wearing or carrying is invisible with it."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold, fire, lightning",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Rat",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "natural armor",
    "hp": 1,
    "hpFormula": "1d4 - 1",
    "speed": "20 ft.",
    "str": 2,
    "dex": 11,
    "con": 8,
    "int": 2,
    "wis": 10,
    "cha": 4,
    "saves": "",
    "skills": "",
    "senses": "darkvision 30 ft., passive Perception 10",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Raven",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 1,
    "hpFormula": "1d4-1",
    "speed": "10 ft., fly 50 ft.",
    "str": 3,
    "dex": 14,
    "con": 8,
    "int": 2,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "Perception +3",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Mimicry",
        "desc": "The raven can mimic simple sounds it has heard, such as a person whispering, a baby crying, or an animal chittering. A creature that hears the sounds can tell they are imitations with a successful DC 10 Wisdom (Insight) check."
      }
    ],
    "actions": [
      {
        "name": "Peck",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Red Dragon Wyrmling",
    "size": "Medium",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 17,
    "acType": "natural armor",
    "hp": 45,
    "hpFormula": "7d8+14",
    "speed": "30 ft., climb 30 ft., fly 60 ft.",
    "str": 19,
    "dex": 10,
    "con": 15,
    "int": 12,
    "wis": 11,
    "cha": 15,
    "saves": "Dex +2, Con +4, Wis +2, Cha +4",
    "skills": "Perception +5, Stealth +1",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 15",
    "languages": "Draconic",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 9 (1d10+4) piercing damage plus 3 (1d6) fire damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity saving throw, taking 22 (4d8+4) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "fire",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Reef Shark",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 22,
    "hpFormula": "4d8+4",
    "speed": "0 ft., swim 40 ft.",
    "str": 13,
    "dex": 14,
    "con": 13,
    "int": 1,
    "wis": 10,
    "cha": 4,
    "saves": "",
    "skills": "Perception +2",
    "senses": "blindsight 30 ft., passive Perception 12",
    "languages": "",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [
      {
        "name": "Blood Frenzy",
        "desc": "The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Remorhaz",
    "size": "Huge",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 17,
    "acType": "natural armor",
    "hp": 195,
    "hpFormula": "17d12+85",
    "speed": "30 ft., burrow 30 ft.",
    "str": 24,
    "dex": 13,
    "con": 21,
    "int": 4,
    "wis": 12,
    "cha": 6,
    "saves": "Con +9",
    "skills": "",
    "senses": "darkvision 60 ft., tremorsense 60 ft., passive Perception 11",
    "languages": "",
    "cr": "11",
    "xp": 7200,
    "crNum": 11,
    "traits": [
      {
        "name": "Heated Body",
        "desc": "A creature that touches the remorhaz or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 18 (2d10+7) piercing damage plus 10 (3d6) fire damage. If the target is a creature, it is grappled (escape DC 18). Until this grapple ends, the target is restrained, and unable to breathe unless it can breathe fire. If the remorhaz moves, the grappled creature moves with it."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "fire",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "cold"
  },
  {
    "name": "Revenant",
    "size": "Medium",
    "type": "undead",
    "alignment": "neutral evil",
    "ac": 13,
    "acType": "",
    "hp": 93,
    "hpFormula": "11d8+44",
    "speed": "30 ft.",
    "str": 18,
    "dex": 13,
    "con": 18,
    "int": 13,
    "wis": 15,
    "cha": 8,
    "saves": "Str +7, Con +7, Wis +5",
    "skills": "Athletics +7, Insight +4, Medicine +4, Perception +4, Survival +4",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "the languages it knew in life",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Regeneration",
        "desc": "The revenant regains 10 hit points at the start of its turn. If the revenant takes damage from a bludgeoning, piercing, or slashing weapon that's made of silvered material, its regeneration doesn't function at the start of its next turn."
      },
      {
        "name": "Regeneration",
        "desc": "The revenant regains 10 hit points at the start of its turn. If the revenant takes damage from a bludgeoning, piercing, or slashing weapon that's made of silvered material, its regeneration doesn't function at the start of its next turn."
      },
      {
        "name": "Turn Immunity",
        "desc": "The revenant is immune to effects that turn undead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The revenant makes two longsword attacks."
      },
      {
        "name": "Longsword",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d8+3) slashing damage, or 12 (2d8+4) slashing damage if used with both hands."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "necrotic, nonmagical bludgeoning, piercing, and slashing",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Rhinoceros",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "natural armor",
    "hp": 27,
    "hpFormula": "5d10+2",
    "speed": "40 ft.",
    "str": 19,
    "dex": 8,
    "con": 15,
    "int": 2,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 11",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Charge",
        "desc": "If the rhinoceros moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 15 Strength saving throw or be knocked prone."
      }
    ],
    "actions": [
      {
        "name": "Gore",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10 (1d10+5) piercing damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Riding Horse",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "",
    "hp": 13,
    "hpFormula": "2d10+2",
    "speed": "60 ft.",
    "str": 16,
    "dex": 10,
    "con": 12,
    "int": 2,
    "wis": 11,
    "cha": 7,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (2d4+3) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Roper",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "neutral evil",
    "ac": 20,
    "acType": "natural armor",
    "hp": 93,
    "hpFormula": "11d10+33",
    "speed": "10 ft., climb 10 ft.",
    "str": 18,
    "dex": 8,
    "con": 17,
    "int": 7,
    "wis": 16,
    "cha": 6,
    "saves": "",
    "skills": "Perception +6, Stealth +5",
    "senses": "darkvision 60 ft., passive Perception 16",
    "languages": "",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "False Appearance",
        "desc": "While the roper remains motionless, it is indistinguishable from a normal cave formation, such as a stalagmite."
      },
      {
        "name": "Grasping Tendrils",
        "desc": "The roper can have up to six tendrils at a time. Each tendril can be attacked (AC 20; 10 hit points). Destroying a tendril deals no damage to the roper."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The roper makes four attacks with its tendrils, uses Reel, and makes one attack with its bite."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 22 (4d8 + 4) piercing damage."
      },
      {
        "name": "Tendril",
        "desc": "Melee Weapon Attack: +7 to hit, reach 50 ft., one creature. Hit: The target is grappled (escape DC 15). Until the grapple ends, the target is restrained and has disadvantage on Strength checks and Strength saving throws."
      },
      {
        "name": "Reel",
        "desc": "The roper pulls each creature grappled by it up to 25 feet straight toward it."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Rug of Smothering",
    "size": "Large",
    "type": "construct",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 33,
    "hpFormula": "6d10+6",
    "speed": "10 ft.",
    "str": 17,
    "dex": 14,
    "con": 12,
    "int": 1,
    "wis": 3,
    "cha": 1,
    "saves": "",
    "skills": "",
    "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 6",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "desc": "The rug is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the rug must succeed on a Constitution saving throw against the caster's spell save DC or fall prone."
      },
      {
        "name": "Damage Transfer",
        "desc": "While it has at least 1 hit point, the rug takes only half the damage dealt to it, and the caster of a spell that deals damage to the rug takes the other half. If the rug is reduced to 0 hit points, the caster takes the remaining damage."
      },
      {
        "name": "False Appearance",
        "desc": "While the rug remains motionless, it is indistinguishable from a normal rug."
      }
    ],
    "actions": [
      {
        "name": "Smother",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one Medium or smaller creature. Hit: 13 (2d8+4) bludgeoning damage, and if the creature is Medium or smaller, it is grappled (escape DC 14). Until this grapple ends, the target is unable to breathe or speak. If the rug moves, the grappled creature moves with it."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "poison, psychic",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Rust Monster",
    "size": "Medium",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 14,
    "acType": "natural armor",
    "hp": 27,
    "hpFormula": "5d8+5",
    "speed": "40 ft.",
    "str": 13,
    "dex": 12,
    "con": 13,
    "int": 2,
    "wis": 13,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [
      {
        "name": "Iron Scent",
        "desc": "The rust monster can pinpoint, by scent, the location of ferrous metal within 30 feet of it."
      },
      {
        "name": "Rust Metal",
        "desc": "Any nonmagical weapon made of metal that hits the rust monster corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8 + 1) piercing damage."
      },
      {
        "name": "Antennae",
        "desc": "The rust monster corrodes a nonmagical ferrous metal object it can see within 5 feet. If the object is either metal armor or a metal shield being worn or carried, it takes a permanent and cumulative -1 penalty to the AC it offers."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Saber-Toothed Tiger",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 52,
    "hpFormula": "7d10+14",
    "speed": "40 ft.",
    "str": 18,
    "dex": 15,
    "con": 15,
    "int": 3,
    "wis": 12,
    "cha": 8,
    "saves": "",
    "skills": "Perception +3, Stealth +6",
    "senses": "darkvision 60 ft., passive Perception 13",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Keen Hearing and Smell",
        "desc": "The tiger has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      },
      {
        "name": "Pounce",
        "desc": "If the tiger moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 15 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10 (1d10+4) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 12 (2d6+4) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Salamander",
    "size": "Large",
    "type": "elemental",
    "alignment": "neutral evil",
    "ac": 15,
    "acType": "natural armor",
    "hp": 90,
    "hpFormula": "12d10+24",
    "speed": "30 ft.",
    "str": 18,
    "dex": 14,
    "con": 15,
    "int": 11,
    "wis": 10,
    "cha": 12,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Ignan",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Heated Body",
        "desc": "A creature that touches the salamander or hits it with a melee attack while within 5 feet of it takes 7 (2d6) fire damage."
      },
      {
        "name": "Illumination",
        "desc": "The salamander sheds bright light in a 10-foot radius and dim light for an additional 10 feet."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The salamander makes two attacks: one with its spear and one with its tail."
      },
      {
        "name": "Spear",
        "desc": "Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 11 (2d6+4) piercing damage, or 13 (2d8+4) piercing damage if used with both hands to make a melee attack, plus 3 (1d6) fire damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 11 (2d6+4) bludgeoning damage plus 3 (1d6) fire damage, and the target must succeed on a DC 14 Strength saving throw or be knocked prone."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "fire, poison",
    "conditionImmunities": "exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "damageVulnerabilities": "cold"
  },
  {
    "name": "Satyr",
    "size": "Medium",
    "type": "fey",
    "alignment": "chaotic neutral",
    "ac": 14,
    "acType": "leather armor",
    "hp": 27,
    "hpFormula": "5d8 + 5",
    "speed": "40 ft.",
    "str": 12,
    "dex": 16,
    "con": 13,
    "int": 12,
    "wis": 10,
    "cha": 14,
    "saves": "",
    "skills": "Perception +2, Performance +4, Stealth +5",
    "senses": "passive Perception 12",
    "languages": "Common, Sylvan",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The satyr has advantage on saving throws against spells and magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The satyr makes two attacks: one with its dagger and one with its shortsword."
      },
      {
        "name": "Dagger",
        "desc": "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 5 (1d4 + 3) piercing damage."
      },
      {
        "name": "Shortsword",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage."
      },
      {
        "name": "Pipe",
        "desc": "The satyr plays an enchanting melody on a magical pipe. Each creature within 30 feet of the satyr that can hear it must succeed on a DC 13 Wisdom saving throw or be charmed until the end of the satyr's next turn. While charmed, a creature has disadvantage on weapon attack rolls against the satyr."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "magic weapons attacks",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Scorpion",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "natural armor",
    "hp": 1,
    "hpFormula": "1d4 - 1",
    "speed": "40 ft.",
    "str": 3,
    "dex": 11,
    "con": 8,
    "int": 1,
    "wis": 8,
    "cha": 2,
    "saves": "",
    "skills": "",
    "senses": "blindsight 30 ft., passive Perception 9",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [],
    "actions": [
      {
        "name": "Sting",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one creature. Hit: 1 (1d4 - 1) piercing damage, and the target must succeed on a DC 9 Constitution saving throw or take 1 (1d4) poison damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Scout",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 13,
    "acType": "leather armor",
    "hp": 16,
    "hpFormula": "3d8+3",
    "speed": "40 ft.",
    "str": 11,
    "dex": 16,
    "con": 12,
    "int": 11,
    "wis": 14,
    "cha": 11,
    "saves": "",
    "skills": "Nature +4, Perception +6, Stealth +5",
    "senses": "passive Perception 16",
    "languages": "any one language (usually Common)",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The scout makes two melee attacks or two ranged attacks."
      },
      {
        "name": "Shortsword",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) piercing damage."
      },
      {
        "name": "Shortbow",
        "desc": "Ranged Weapon Attack: +5 to hit, range 80/320 ft., one target. Hit: 6 (1d6+3) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Sea Horse",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 15,
    "acType": "",
    "hp": 1,
    "hpFormula": "1d4-1",
    "speed": "0 ft., swim 20 ft.",
    "str": 3,
    "dex": 15,
    "con": 8,
    "int": 1,
    "wis": 10,
    "cha": 2,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 1 piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Shambling Mound",
    "size": "Large",
    "type": "plant",
    "alignment": "unaligned",
    "ac": 15,
    "acType": "natural armor",
    "hp": 95,
    "hpFormula": "10d10 + 40",
    "speed": "20 ft., swim 20 ft.",
    "str": 18,
    "dex": 8,
    "con": 16,
    "int": 5,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "Stealth +2",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "understands Common and Druidic but can't speak",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "False Appearance",
        "desc": "While the mound is motionless, it is indistinguishable from a normal mound of earth and plants."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The mound makes two slam attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "bludgeoning, piercing, slashing",
    "damageImmunities": "",
    "conditionImmunities": "charmed, exhaustion, frightened, poisoned",
    "damageVulnerabilities": "cold, fire"
  },
  {
    "name": "Shield Guardian",
    "size": "Large",
    "type": "construct",
    "alignment": "unaligned",
    "ac": 17,
    "acType": "natural armor",
    "hp": 142,
    "hpFormula": "15d10+60",
    "speed": "30 ft.",
    "str": 18,
    "dex": 8,
    "con": 18,
    "int": 3,
    "wis": 11,
    "cha": 1,
    "saves": "",
    "skills": "",
    "senses": "darkvision 120 ft., passive Perception 10",
    "languages": "understands commands given in any language but can't speak",
    "cr": "7",
    "xp": 2900,
    "crNum": 7,
    "traits": [
      {
        "name": "Bound",
        "desc": "The guardian is magically bound to an amulet. As long as the amulet is intact and the guardian is within 500 miles of it, the amulet's wearer can telepathically call the guardian, compel it to never willingly move more than 500 miles away from the amulet. If the amulet is destroyed, the guardian is killed."
      },
      {
        "name": "Regeneration",
        "desc": "The guardian regains 10 hit points at the start of its turn if it has at least 1 hit point."
      },
      {
        "name": "Spell Storing",
        "desc": "A spellcaster who wears the shield guardian's amulet can cause the guardian to store one spell of 4th level or lower. The spell must be cast into the amulet. The guardian can cast the stored spell at will on its initiative turn, using the same spellcasting ability modifier as the wearer."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The guardian makes two attacks with its slam."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "poison, psychic; bludgeoning, piercing, and slashing from nonmagical attacks",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Silver Dragon Wyrmling",
    "size": "Medium",
    "type": "dragon",
    "alignment": "lawful good",
    "ac": 17,
    "acType": "natural armor",
    "hp": 32,
    "hpFormula": "5d8 + 10",
    "speed": "30 ft., fly 60 ft.",
    "str": 15,
    "dex": 10,
    "con": 15,
    "int": 14,
    "wis": 11,
    "cha": 16,
    "saves": "Constitution +4, Charisma +5",
    "savingThrows": "Constitution +4, Charisma +5",
    "skills": "Arcana +3, Insight +2, Perception +4",
    "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 14",
    "languages": "Draconic",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10 + 2) piercing damage."
      },
      {
        "name": "Breath Weapon (Recharge 5-6)",
        "desc": "The dragon exhales a cone of cold air in a 15-foot cone. Each creature in that area must make a DC 12 Constitution saving throw, taking 22 (4d8) cold damage on a failed save, or half as much damage on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Skeleton",
    "size": "Medium",
    "type": "undead",
    "alignment": "lawful evil",
    "ac": 15,
    "acType": "armor scraps",
    "hp": 13,
    "hpFormula": "2d8+4",
    "speed": "30 ft.",
    "str": 10,
    "dex": 14,
    "con": 15,
    "int": 6,
    "wis": 8,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 9",
    "languages": "understands all languages it knew in life but can't speak",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Shortsword",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6+2) piercing damage."
      },
      {
        "name": "Shortbow",
        "desc": "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6+2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "poison",
    "conditionImmunities": "exhaustion, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Solar",
    "size": "Large",
    "type": "celestial",
    "alignment": "lawful good",
    "ac": 21,
    "acType": "natural armor",
    "hp": 243,
    "hpFormula": "17d10+170",
    "speed": "50 ft., fly 150 ft.",
    "str": 26,
    "dex": 20,
    "con": 26,
    "int": 25,
    "wis": 25,
    "cha": 30,
    "saves": "Int +12, Wis +12, Cha +17",
    "skills": "Insight +12, Perception +12",
    "senses": "truesight 120 ft., passive Perception 22",
    "languages": "all, telepathy 120 ft.",
    "cr": "21",
    "xp": 33000,
    "crNum": 21,
    "traits": [
      {
        "name": "Innate Spellcasting",
        "desc": "The solar's spellcasting ability is Charisma (spell save DC 25). It can innately cast the following spells, requiring only verbal components: At will: detect evil and good, detect magic"
      },
      {
        "name": "Magic Resistance",
        "desc": "The solar has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Magic Weapons",
        "desc": "The solar's weapon attacks are magical. When the solar hits with any weapon, it deals an extra 19 (3d12) radiant damage (included in the attack)."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The solar makes two attacks with its greatsword."
      },
      {
        "name": "Greatsword",
        "desc": "Melee Weapon Attack: +15 to hit, reach 5 ft., one target. Hit: 22 (4d6+8) slashing damage plus 19 (3d12) radiant damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "radiant; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Soldier",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 16,
    "acType": "scale mail, shield",
    "hp": 16,
    "hpFormula": "3d8 + 3",
    "speed": "30 ft.",
    "str": 15,
    "dex": 13,
    "con": 12,
    "int": 10,
    "wis": 11,
    "cha": 10,
    "saves": "Strength +4, Constitution +3",
    "skills": "Athletics +4, Perception +2",
    "senses": "passive Perception 12",
    "languages": "any one language (usually Common)",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [],
    "actions": [
      {
        "name": "Longsword",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) slashing damage, or 7 (1d10 + 2) slashing damage when used with two hands."
      },
      {
        "name": "Light Crossbow",
        "desc": "Ranged Weapon Attack: +3 to hit, range 80/320 ft., one target. Hit: 5 (1d8 + 1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [
      {
        "name": "Parry",
        "desc": "The soldier adds 2 to its AC against one melee attack that it can see being made against it, provided it's wielding a melee weapon."
      }
    ],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Specter",
    "size": "Medium",
    "type": "undead",
    "alignment": "chaotic evil",
    "ac": 12,
    "acType": "",
    "hp": 27,
    "hpFormula": "5d8+5",
    "speed": "0 ft., fly 50 ft. (hover)",
    "str": 8,
    "dex": 14,
    "con": 13,
    "int": 10,
    "wis": 10,
    "cha": 11,
    "saves": "Wis +2",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "understands all languages it knew in life but can't speak",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Ephemeral",
        "desc": "The specter can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."
      },
      {
        "name": "Sunlight Sensitivity",
        "desc": "While in sunlight, the specter has disadvantage on attack rolls, and on Wisdom (Perception) checks that rely on sight."
      },
      {
        "name": "Undead Nature",
        "desc": "The specter doesn't need to breathe or sleep."
      }
    ],
    "actions": [
      {
        "name": "Life Drain",
        "desc": "Melee Spell Attack: +3 to hit, reach 5 ft., one creature. Hit: 10 (3d6) necrotic damage. The target must succeed on a DC 12 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "necrotic, nonmagical bludgeoning, piercing, and slashing",
    "conditionImmunities": "charmed, exhaustion, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "damageVulnerabilities": ""
  },
  {
    "name": "Spider",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 14,
    "acType": "",
    "hp": 1,
    "hpFormula": "1d4-1",
    "speed": "20 ft., climb 20 ft.",
    "str": 3,
    "dex": 16,
    "con": 10,
    "int": 1,
    "wis": 10,
    "cha": 2,
    "saves": "",
    "skills": "Stealth +6",
    "senses": "darkvision 30 ft., passive Perception 10",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Spider Climb",
        "desc": "The spider can climb difficult surfaces, including upside down on ceilings, without needing an ability check."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Spy",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 12,
    "acType": "leather armor",
    "hp": 27,
    "hpFormula": "6d8",
    "speed": "30 ft.",
    "str": 10,
    "dex": 16,
    "con": 10,
    "int": 14,
    "wis": 11,
    "cha": 10,
    "saves": "Dexterity +4, Intelligence +3",
    "skills": "Acrobatics +4, Deception +2, Investigation +4, Perception +3, Persuasion +2, Sleight of Hand +4, Stealth +6",
    "senses": "passive Perception 13",
    "languages": "Thieves' cant plus any two languages",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Assassinate",
        "desc": "During its first turn, the spy has advantage on attack rolls against any creature that hasn't taken a turn."
      },
      {
        "name": "Evasion",
        "desc": "If the spy is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the spy instead takes no damage if it succeeds on the saving throw, and only half damage if it fails."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The spy makes two melee attacks."
      },
      {
        "name": "Shortsword",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage, and the spy has advantage on the attack roll if it is hidden from the target."
      },
      {
        "name": "Hand Crossbow",
        "desc": "Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 6 (1d6 + 3) piercing damage, and the target must succeed on a DC 13 Dexterity saving throw or be poisoned for 1 hour."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Stirge",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 14,
    "acType": "natural armor",
    "hp": 1,
    "hpFormula": "1d4-1",
    "speed": "10 ft., fly 40 ft.",
    "str": 3,
    "dex": 16,
    "con": 8,
    "int": 1,
    "wis": 8,
    "cha": 3,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 9",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 4 (1d4 + 2) piercing damage. The target must succeed on a DC 11 Constitution saving throw or lose 1 (1d4) hit points at the start of its next turn due to blood loss."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Stone Giant",
    "size": "Huge",
    "type": "giant",
    "alignment": "neutral",
    "ac": 17,
    "acType": "natural armor",
    "hp": 126,
    "hpFormula": "11d12+55",
    "speed": "40 ft.",
    "str": 23,
    "dex": 15,
    "con": 20,
    "int": 10,
    "wis": 12,
    "cha": 9,
    "saves": "Str +9, Con +8, Wis +4",
    "skills": "Athletics +12, Perception +4",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "Giant",
    "cr": "7",
    "xp": 2900,
    "crNum": 7,
    "traits": [
      {
        "name": "Stone Camouflage",
        "desc": "The giant has advantage on Dexterity (Stealth) checks made to hide in rocky terrain."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The giant makes two greatclub attacks or two rock attacks."
      },
      {
        "name": "Greatclub",
        "desc": "Melee Weapon Attack: +9 to hit, reach 15 ft., one target. Hit: 19 (3d8+6) bludgeoning damage."
      },
      {
        "name": "Rock",
        "desc": "Ranged Weapon Attack: +9 to hit, range 60/240 ft., one target. Hit: 28 (4d10+6) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Stone Golem",
    "size": "Large",
    "type": "construct",
    "alignment": "unaligned",
    "ac": 17,
    "acType": "natural armor",
    "hp": 178,
    "hpFormula": "17d10+85",
    "speed": "30 ft.",
    "str": 22,
    "dex": 9,
    "con": 20,
    "int": 3,
    "wis": 11,
    "cha": 1,
    "saves": "Str +9",
    "skills": "",
    "senses": "darkvision 120 ft., passive Perception 10",
    "languages": "understands the languages of its creator but can't speak",
    "cr": "10",
    "xp": 5900,
    "crNum": 10,
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "desc": "The golem is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the golem must succeed on a Constitution saving throw against the caster's spell save DC or fall prone."
      },
      {
        "name": "Immutable Form",
        "desc": "The golem is immune to any spell or effect that would alter its form."
      },
      {
        "name": "Magic Resistance",
        "desc": "The golem has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The golem makes two slam attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 19 (3d8+6) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "poison, psychic; bludgeoning, piercing, and slashing from nonmagical attacks",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Storm Giant",
    "size": "Huge",
    "type": "giant",
    "alignment": "chaotic good",
    "ac": 18,
    "acType": "plate",
    "hp": 230,
    "hpFormula": "17d12+119",
    "speed": "50 ft., fly 50 ft. (hover)",
    "str": 29,
    "dex": 16,
    "con": 24,
    "int": 16,
    "wis": 18,
    "cha": 18,
    "saves": "Str +14, Con +12, Wis +9, Cha +9",
    "skills": "Arcana +6, Athletics +14, History +6, Insight +9, Perception +9",
    "senses": "passive Perception 19",
    "languages": "Giant, Primordial",
    "cr": "13",
    "xp": 10000,
    "crNum": 13,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The giant can breathe air and water."
      },
      {
        "name": "Innate Spellcasting",
        "desc": "The giant's spellcasting ability is Charisma (spell save DC 17). It can innately cast the following spells, requiring no material components: At will: detect magic, feather fall"
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the giant fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The giant makes two attacks with its greatsword."
      },
      {
        "name": "Greatsword",
        "desc": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 30 (6d6+9) slashing damage."
      },
      {
        "name": "Rock",
        "desc": "Ranged Weapon Attack: +14 to hit, range 60/240 ft., one target. Hit: 35 (4d12+9) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold, lightning, thunder",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Succubus",
    "size": "Medium",
    "type": "fiend",
    "subtype": "demon",
    "alignment": "chaotic evil",
    "ac": 15,
    "acType": "natural armor",
    "hp": 66,
    "hpFormula": "12d8 + 24",
    "speed": "30 ft., fly 60 ft.",
    "str": 8,
    "dex": 17,
    "con": 14,
    "int": 15,
    "wis": 12,
    "cha": 20,
    "saves": "Wisdom +4, Charisma +8",
    "skills": "Deception +8, Insight +4, Perception +4, Persuasion +8",
    "damageResistances": "cold, fire, lightning, poison",
    "senses": "truesight 120 ft., passive Perception 14",
    "languages": "Abyssal, Common, Infernal, telepathy 120 ft.",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [
      {
        "name": "Telepathic Bond",
        "desc": "The succubus ignores the range limitation on its telepathy when communicating with a creature it has charmed. The charmed creature can telepathically communicate with the succubus as long as the two of them are on the same plane of existence."
      }
    ],
    "actions": [
      {
        "name": "Claw (Fiend Form Only)",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      },
      {
        "name": "Charm",
        "desc": "One humanoid the succubus can see within 30 feet of it must succeed on a DC 16 Wisdom saving throw or be magically charmed for 1 day. The charmed creature obeys the succubus's verbal or telepathic commands. If the creature takes any damage or receives an obvious command to harm itself, it can repeat the saving throw, ending the effect on a success. If the creature successfully saves against the effect, or if the effect ends for it, the creature is immune to this succubus's Charm for the next 24 hours."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageImmunities": "fire, poison",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Succubus/Incubus",
    "size": "Medium",
    "type": "fiend",
    "subtype": "shapechanger",
    "alignment": "neutral evil",
    "ac": 15,
    "acType": "natural armor",
    "hp": 66,
    "hpFormula": "12d8+12",
    "speed": "30 ft., fly 60 ft.",
    "str": 8,
    "dex": 17,
    "con": 13,
    "int": 15,
    "wis": 12,
    "cha": 20,
    "saves": "",
    "skills": "Deception +9, Insight +5, Perception +5, Persuasion +9, Stealth +7",
    "senses": "darkvision 60 ft., passive Perception 15",
    "languages": "Abyssal, Common, Infernal, telepathy 60 ft.",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [
      {
        "name": "Telepathic Bond",
        "desc": "The fiend ignores the range restriction on its telepathy when communicating with a creature it has charmed."
      },
      {
        "name": "Shapechanger",
        "desc": "The fiend can use its action to polymorph into a Small or Medium humanoid, or back into its true form."
      }
    ],
    "actions": [
      {
        "name": "Claw (Fiend Form Only)",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      },
      {
        "name": "Charm",
        "desc": "One humanoid the fiend can see within 30 feet must succeed on a DC 15 Wisdom saving throw or be magically charmed for 1 day."
      },
      {
        "name": "Draining Kiss",
        "desc": "The fiend kisses a creature charmed by it or a willing creature. The target must make a DC 15 Constitution saving throw against this magic, taking 32 (5d10 + 5) psychic damage on a failed save, or half as much on a successful one. The target's hit point maximum is reduced by an amount equal to the damage taken."
      },
      {
        "name": "Etherealness",
        "desc": "The fiend magically enters the Ethereal Plane from the Material Plane, or vice versa."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold, fire, lightning, poison; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Swarm of Bats",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 22,
    "hpFormula": "5d8",
    "speed": "0 ft., fly 30 ft.",
    "str": 5,
    "dex": 15,
    "con": 10,
    "int": 2,
    "wis": 12,
    "cha": 4,
    "saves": "",
    "skills": "",
    "senses": "blindsight 60 ft., passive Perception 11",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Echolocation",
        "desc": "The swarm can't use its blindsight while deafened."
      },
      {
        "name": "Swarm",
        "desc": "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny bat. The swarm can't be grappled or restrained. At the start of each of the swarm's turns, it chooses one creature it can sense within 30 feet. The swarm must move toward that creature on its available movement or chase it."
      }
    ],
    "actions": [
      {
        "name": "Bites",
        "desc": "Melee Weapon Attack: +4 to hit, reach 0 ft., one creature in the swarm's space. Hit: 5 (2d4) piercing damage, or 2 (1d4) piercing damage if the swarm has half its hit points or fewer."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Swarm of Insects",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 22,
    "hpFormula": "5d8",
    "speed": "20 ft., fly 20 ft.",
    "str": 3,
    "dex": 13,
    "con": 10,
    "int": 1,
    "wis": 10,
    "cha": 2,
    "saves": "",
    "skills": "",
    "senses": "blindsight 30 ft., passive Perception 10",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Swarm",
        "desc": "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't be grappled or restrained."
      }
    ],
    "actions": [
      {
        "name": "Bites",
        "desc": "Melee Weapon Attack: +3 to hit, reach 0 ft., one target in the swarm's space. Hit: 10 (4d4) piercing damage, or 5 (2d4) piercing damage if the swarm has half its hit points or fewer."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Swarm of Poisonous Snakes",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 14,
    "acType": "",
    "hp": 36,
    "hpFormula": "8d8",
    "speed": "30 ft., swim 30 ft.",
    "str": 8,
    "dex": 16,
    "con": 10,
    "int": 1,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "",
    "senses": "blindsight 10 ft., passive Perception 10",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Swarm",
        "desc": "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny snake."
      }
    ],
    "actions": [
      {
        "name": "Bites",
        "desc": "Melee Weapon Attack: +5 to hit, reach 0 ft., one creature in the swarm's space. Hit: 10 (4d4) piercing damage, and the target must make a DC 10 Constitution saving throw, taking 5 (2d4) poison damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Swarm of Rats",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "",
    "hp": 24,
    "hpFormula": "7d8",
    "speed": "20 ft.",
    "str": 9,
    "dex": 10,
    "con": 10,
    "int": 2,
    "wis": 10,
    "cha": 2,
    "saves": "",
    "skills": "",
    "senses": "darkvision 30 ft., passive Perception 10",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Keen Smell",
        "desc": "The swarm has advantage on Wisdom (Perception) checks that rely on smell."
      },
      {
        "name": "Swarm",
        "desc": "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny rat."
      }
    ],
    "actions": [
      {
        "name": "Bites",
        "desc": "Melee Weapon Attack: +2 to hit, reach 0 ft., one target in the swarm's space. Hit: 7 (2d6) piercing damage, or 3 (1d6) piercing damage if the swarm has half its hit points or fewer."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Swarm of Ravens",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 24,
    "hpFormula": "7d8",
    "speed": "10 ft., fly 50 ft.",
    "str": 6,
    "dex": 14,
    "con": 10,
    "int": 3,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "Perception +4",
    "senses": "passive Perception 14",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Mimicry",
        "desc": "The swarm can mimic simple sounds it has heard, such as a person whispering, a baby crying, or an animal chittering."
      },
      {
        "name": "Swarm",
        "desc": "The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny raven."
      }
    ],
    "actions": [
      {
        "name": "Beaks",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target in the swarm's space. Hit: 7 (2d6) piercing damage, or 3 (1d6) piercing damage if the swarm has half its hit points or fewer."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Tarrasque",
    "size": "Gargantuan",
    "type": "monstrosity",
    "subtype": "titan",
    "alignment": "unaligned",
    "ac": 25,
    "acType": "natural armor",
    "hp": 676,
    "hpFormula": "33d20+330",
    "speed": "40 ft.",
    "str": 30,
    "dex": 11,
    "con": 30,
    "int": 3,
    "wis": 11,
    "cha": 11,
    "saves": "Int +5, Wis +9, Cha +9",
    "skills": "",
    "senses": "blindsight 120 ft., passive Perception 10",
    "languages": "",
    "cr": "30",
    "xp": 155000,
    "crNum": 30,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the tarrasque fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Magic Resistance",
        "desc": "The tarrasque has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Reflective Carapace",
        "desc": "Any time the tarrasque is targeted by a magic missile spell, a line spell, or a spell that requires a ranged attack roll, roll a d6. On a 1 to 5, the tarrasque is unaffected. On a 6, the tarrasque is unaffected, and the effect is reflected back at the caster."
      },
      {
        "name": "Siege Monster",
        "desc": "The tarrasque deals double damage to objects and structures."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The tarrasque can use its Frightful Presence. It then makes five attacks: one with its bite, two with its claws, one with its horns, and one with its tail. It can use its Swallow instead of its bite."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +19 to hit, reach 10 ft., one target. Hit: 36 (4d12 + 10) piercing damage. If the target is a creature, it is grappled (escape DC 20). Until this grapple ends, the target is restrained, and the tarrasque can't bite another target."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +19 to hit, reach 15 ft., one target. Hit: 28 (4d8 + 10) slashing damage."
      },
      {
        "name": "Horns",
        "desc": "Melee Weapon Attack: +19 to hit, reach 10 ft., one target. Hit: 32 (4d10 + 10) piercing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +19 to hit, reach 20 ft., one target. Hit: 24 (4d6 + 10) bludgeoning damage. If the target is a creature, it must succeed on a DC 20 Strength saving throw or be knocked prone."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the tarrasque's choice within 120 feet and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Swallow",
        "desc": "The tarrasque makes one bite attack against a Large or smaller creature it is grappling. If the attack hits, the target takes the bite's damage, the target is swallowed, and the grapple ends."
      }
    ],
    "legendaryActions": [
      {
        "name": "Attack",
        "desc": "The tarrasque makes one claw attack or tail attack."
      },
      {
        "name": "Move",
        "desc": "The tarrasque moves up to half its speed."
      },
      {
        "name": "Chomp (Costs 2 Actions)",
        "desc": "The tarrasque makes one bite attack or uses its Swallow."
      }
    ],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "fire, poison; bludgeoning, piercing, and slashing from nonmagical attacks",
    "conditionImmunities": "charmed, frightened, paralyzed, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Thug",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any non-good alignment",
    "ac": 11,
    "acType": "leather armor",
    "hp": 32,
    "hpFormula": "5d8+10",
    "speed": "30 ft.",
    "str": 15,
    "dex": 11,
    "con": 14,
    "int": 10,
    "wis": 10,
    "cha": 11,
    "saves": "",
    "skills": "Intimidation +3",
    "senses": "passive Perception 10",
    "languages": "any one language (usually Common)",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The thug makes two melee attacks."
      },
      {
        "name": "Mace",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 5 (1d6 + 2) bludgeoning damage."
      },
      {
        "name": "Heavy Crossbow",
        "desc": "Ranged Weapon Attack: +2 to hit, range 100/400 ft., one target. Hit: 5 (1d10) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Tiger",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 37,
    "hpFormula": "5d10+10",
    "speed": "40 ft.",
    "str": 17,
    "dex": 15,
    "con": 14,
    "int": 3,
    "wis": 12,
    "cha": 8,
    "saves": "",
    "skills": "Perception +4, Stealth +6",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Keen Hearing and Smell",
        "desc": "The tiger has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      },
      {
        "name": "Pounce",
        "desc": "If the tiger moves at least 20 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d10+3) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Treant",
    "size": "Huge",
    "type": "plant",
    "alignment": "chaotic good",
    "ac": 16,
    "acType": "natural armor",
    "hp": 138,
    "hpFormula": "12d12 + 60",
    "speed": "30 ft.",
    "str": 23,
    "dex": 8,
    "con": 21,
    "int": 12,
    "wis": 16,
    "cha": 12,
    "saves": "Wisdom +6",
    "savingThrows": "Wisdom +6",
    "skills": "Perception +9",
    "damageResistances": "bludgeoning, piercing, slashing",
    "senses": "passive Perception 19",
    "languages": "Common, Druidic, Sylvan",
    "cr": "9",
    "xp": 5000,
    "crNum": 9,
    "traits": [
      {
        "name": "False Appearance",
        "desc": "While the treant remains motionless, it is indistinguishable from a normal tree."
      },
      {
        "name": "Siege Monster",
        "desc": "The treant deals double damage to objects and structures."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The treant makes two slam attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 16 (3d6 + 6) bludgeoning damage."
      },
      {
        "name": "Rock",
        "desc": "Ranged Weapon Attack: +10 to hit, range 60/240 ft., one target. Hit: 28 (4d10 + 6) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageImmunities": "",
    "conditionImmunities": "charmed, exhaustion, frightened, poisoned",
    "damageVulnerabilities": "fire"
  },
  {
    "name": "Tribal Warrior",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 12,
    "acType": "hide armor",
    "hp": 11,
    "hpFormula": "2d8+2",
    "speed": "30 ft.",
    "str": 13,
    "dex": 11,
    "con": 12,
    "int": 8,
    "wis": 11,
    "cha": 8,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "any one language",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Spear",
        "desc": "Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6+1) piercing damage, or 5 (1d8+1) piercing damage if used with two hands to make a melee attack."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Troll",
    "size": "Large",
    "type": "humanoid",
    "subtype": "giant",
    "alignment": "chaotic evil",
    "ac": 15,
    "acType": "natural armor",
    "hp": 84,
    "hpFormula": "8d10+40",
    "speed": "30 ft.",
    "str": 18,
    "dex": 13,
    "con": 20,
    "int": 3,
    "wis": 9,
    "cha": 7,
    "saves": "",
    "skills": "Perception +2",
    "senses": "darkvision 60 ft., passive Perception 12",
    "languages": "Giant",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Regeneration",
        "desc": "The troll regains 10 hit points at the start of its turn. If the troll takes acid or fire damage, this trait doesn't function at the start of the troll's next turn. The troll dies only if it starts its turn with 0 hit points and doesn't regenerate."
      },
      {
        "name": "Reactive Attacks",
        "desc": "For each creature other than the troll within 5 feet of it that the troll can see when it makes a melee attack, the troll makes one additional melee attack with the same weapon against that creature."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The troll makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 7 (1d6+4) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Unicorn",
    "size": "Large",
    "type": "celestial",
    "alignment": "lawful good",
    "ac": 12,
    "acType": "",
    "hp": 67,
    "hpFormula": "9d10+18",
    "speed": "60 ft.",
    "str": 18,
    "dex": 14,
    "con": 15,
    "int": 11,
    "wis": 17,
    "cha": 16,
    "saves": "Dex +4, Con +4, Int +3, Wis +5, Cha +5",
    "skills": "Insight +5, Perception +5",
    "senses": "darkvision 60 ft., passive Perception 15",
    "languages": "all, telepathy 60 ft.",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Charge",
        "desc": "If the unicorn moves at least 20 feet straight toward a creature and then hits it with a horn attack on the same turn, that target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone."
      },
      {
        "name": "Innate Spellcasting",
        "desc": "The unicorn's innate spellcasting ability is Charisma (spell save DC 15). It can innately cast the following spells, requiring only verbal components: At will: detect evil and good, detect magic, detect thoughts"
      },
      {
        "name": "Magic Resistance",
        "desc": "The unicorn has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Magic Weapons",
        "desc": "The unicorn's weapon attacks are magical."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The unicorn makes two attacks: one with its horn and one with its hooves."
      },
      {
        "name": "Horn",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) piercing damage."
      },
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "poison, psychic",
    "conditionImmunities": "charmed, frightened, paralyzed, poisoned, restrained",
    "damageVulnerabilities": ""
  },
  {
    "name": "Vampire",
    "size": "Medium",
    "type": "undead",
    "alignment": "lawful evil",
    "ac": 16,
    "acType": "natural armor",
    "hp": 144,
    "hpFormula": "17d8+68",
    "speed": "30 ft.",
    "str": 18,
    "dex": 18,
    "con": 18,
    "int": 17,
    "wis": 15,
    "cha": 18,
    "saves": "Dex +9, Wis +7, Cha +9",
    "skills": "Perception +7, Stealth +9",
    "senses": "darkvision 120 ft., passive Perception 17",
    "languages": "the languages it knew in life",
    "cr": "13",
    "xp": 10000,
    "crNum": 13,
    "traits": [
      {
        "name": "Shapechanger",
        "desc": "The vampire can use its action to polymorph into a Tiny bat, a Medium cloud of mist, or back into its true form."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the vampire fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Regeneration",
        "desc": "The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water."
      },
      {
        "name": "Spider Climb",
        "desc": "The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      },
      {
        "name": "Vampire Weaknesses",
        "desc": "The vampire has the following flaws: Forbiddance, Harmed by Running Water, Stake to the Heart, Sunlight Hypersensitivity."
      }
    ],
    "actions": [
      {
        "name": "Multiattack (Vampire Form Only)",
        "desc": "The vampire makes two attacks, only one of which can be a bite attack."
      },
      {
        "name": "Unarmed Strike (Vampire Form Only)",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one creature. Hit: 8 (1d8 + 4) bludgeoning damage. Instead of dealing damage, the vampire can grapple the target (escape DC 18)."
      },
      {
        "name": "Bite (Bat or Vampire Form Only)",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one willing creature, or a creature that is grappled by the vampire, incapacitated, or restrained. Hit: 7 (1d6 + 4) piercing damage plus 10 (3d6) necrotic damage. The target's hit point maximum is reduced by an amount equal to the necrotic damage taken."
      },
      {
        "name": "Charm",
        "desc": "The vampire targets one humanoid it can see within 30 feet. The target must succeed on a DC 17 Wisdom saving throw against this magic or be charmed by the vampire."
      }
    ],
    "legendaryActions": [
      {
        "name": "Move",
        "desc": "The vampire moves up to its speed without provoking opportunity attacks."
      },
      {
        "name": "Unarmed Strike",
        "desc": "The vampire makes one unarmed strike."
      },
      {
        "name": "Bite (Costs 2 Actions)",
        "desc": "The vampire makes one bite attack."
      }
    ],
    "reactions": [],
    "damageResistances": "necrotic; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Vampire Spawn",
    "size": "Medium",
    "type": "undead",
    "alignment": "neutral evil",
    "ac": 15,
    "acType": "leather armor",
    "hp": 44,
    "hpFormula": "8d8+8",
    "speed": "30 ft.",
    "str": 16,
    "dex": 16,
    "con": 13,
    "int": 12,
    "wis": 11,
    "cha": 12,
    "saves": "Dex +3, Wis +2",
    "skills": "Perception +2, Stealth +5",
    "senses": "darkvision 60 ft., passive Perception 12",
    "languages": "the languages it knew in life",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Regeneration",
        "desc": "The spawn regains 6 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the spawn takes radiant damage or damage from running water, this trait doesn't function at the start of the spawn's next turn."
      },
      {
        "name": "Spider Climb",
        "desc": "The spawn can climb difficult surfaces, including upside down on ceilings, without needing an ability check."
      },
      {
        "name": "Vampire Weaknesses",
        "desc": "The spawn has the following flaws: Forbiddance. The spawn can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The spawn takes 20 acid damage when it ends its turn in running water. Sunlight Hypersensitivity. The spawn takes 20 radiant damage when it starts its turn in sunlight. Unlike most undead, it doesn't have an aversion to mirrors or garlic."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The spawn makes two melee attacks, instead of one, when it takes the Attack action on its turn. It can use its life drain in place of one of these attacks."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 6 (1d6+3) slashing damage plus 7 (2d6) necrotic damage."
      },
      {
        "name": "Life Drain",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one willing creature, or a creature that is grappled by the spawn, incapacitated, or restrained. Hit: 7 (1d6+4) necrotic damage. The target's hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. If a creature's hit point maximum is reduced to 0 by this attack, the creature dies."
      }
    ],
    "legendaryActions": [],
    "reactions": [
      {
        "name": "Reaction",
        "desc": "The spawn can take a reaction to make a claw attack when a creature it can see within 5 feet of it makes an attack roll."
      }
    ],
    "damageResistances": "necrotic, nonmagical bludgeoning, piercing, and slashing",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "radiant"
  },
  {
    "name": "Veteran",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 17,
    "acType": "plate armor",
    "hp": 27,
    "hpFormula": "5d8 + 5",
    "speed": "30 ft.",
    "str": 16,
    "dex": 13,
    "con": 12,
    "int": 11,
    "wis": 11,
    "cha": 10,
    "saves": "Strength +5, Dexterity +3, Wisdom +2",
    "skills": "Athletics +5, Perception +2",
    "senses": "passive Perception 12",
    "languages": "any one language (usually Common)",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."
      },
      {
        "name": "Longsword",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage, or 8 (1d10 + 3) slashing damage when used with two hands."
      },
      {
        "name": "Shortsword",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) piercing damage."
      },
      {
        "name": "Heavy Crossbow",
        "desc": "Ranged Weapon Attack: +3 to hit, range 100/400 ft., one target. Hit: 6 (1d10 + 1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [
      {
        "name": "Parry",
        "desc": "The veteran adds 2 to its AC against one melee attack that it can see being made against it, provided it's wielding a melee weapon."
      }
    ],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Violet Fungus",
    "size": "Medium",
    "type": "plant",
    "alignment": "unaligned",
    "ac": 5,
    "acType": "",
    "hp": 18,
    "hpFormula": "4d8",
    "speed": "0 ft.",
    "str": 3,
    "dex": 1,
    "con": 10,
    "int": 1,
    "wis": 7,
    "cha": 1,
    "saves": "",
    "skills": "",
    "senses": "blindsight 30 ft. (blind beyond 60 feet), passive Perception 8",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "False Appearance",
        "desc": "While the violet fungus remains motionless, it is indistinguishable from an ordinary fungus."
      }
    ],
    "actions": [
      {
        "name": "Rotting Touch",
        "desc": "Melee Weapon Attack: +0 to hit, reach 10 ft., one creature. Hit: 4 (1d8) poison damage. If the target is a creature, it must succeed on a DC 10 Constitution saving throw or take an additional 5 (2d4) poison damage at the start of each of the target's turns. The creature can repeat the saving throw at the end of each of its turns, ending the damage on itself on a success."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Vrock",
    "size": "Large",
    "type": "fiend",
    "subtype": "demon",
    "alignment": "chaotic evil",
    "ac": 15,
    "acType": "natural armor",
    "hp": 110,
    "hpFormula": "13d10+39",
    "speed": "40 ft., fly 60 ft.",
    "str": 17,
    "dex": 15,
    "con": 16,
    "int": 8,
    "wis": 10,
    "cha": 8,
    "saves": "Dex +4, Wis +2",
    "skills": "",
    "senses": "darkvision 120 ft., passive Perception 10",
    "languages": "Abyssal, telepathy 120 ft.",
    "cr": "6",
    "xp": 2300,
    "crNum": 6,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The vrock has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The vrock makes two attacks: one with its beak and one with its talons."
      },
      {
        "name": "Beak",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) piercing damage."
      },
      {
        "name": "Talons",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Vulture",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "",
    "hp": 5,
    "hpFormula": "1d8+1",
    "speed": "10 ft., fly 50 ft.",
    "str": 6,
    "dex": 10,
    "con": 13,
    "int": 2,
    "wis": 14,
    "cha": 4,
    "saves": "",
    "skills": "Perception +4",
    "senses": "passive Perception 14",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Keen Sight and Smell",
        "desc": "The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell."
      },
      {
        "name": "Pack Tactics",
        "desc": "The vulture has advantage on an attack roll against a creature if at least one other vulture is within 5 feet of the target and the other vulture isn't incapacitated."
      }
    ],
    "actions": [
      {
        "name": "Beak",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 2 (1d4) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Warhorse",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "",
    "hp": 19,
    "hpFormula": "3d10+3",
    "speed": "60 ft.",
    "str": 18,
    "dex": 12,
    "con": 13,
    "int": 2,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 11",
    "languages": "",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Water Elemental",
    "size": "Large",
    "type": "elemental",
    "alignment": "neutral",
    "ac": 15,
    "acType": "natural armor",
    "hp": 39,
    "hpFormula": "6d10 + 12",
    "speed": "30 ft., swim 90 ft.",
    "str": 10,
    "dex": 14,
    "con": 14,
    "int": 5,
    "wis": 10,
    "cha": 8,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "understands Aquan but can't speak",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The elemental can breathe air and water."
      },
      {
        "name": "Water Form",
        "desc": "The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 foot wide."
      },
      {
        "name": "Transparent",
        "desc": "Even when the elemental is in plain sight, it takes a successful DC 15 Wisdom (Perception) check to spot the elemental if it has neither moved nor attacked. A creature that tries to enter the elemental's space while unaware of it is surprised by the elemental."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The elemental makes two slam attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) bludgeoning damage."
      },
      {
        "name": "Whelm (Recharge 4-6)",
        "desc": "Each creature in the elemental's space must make a DC 13 Strength saving throw. On a failed save, a target takes 13 (2d8 + 4) bludgeoning damage. If it is Large or smaller, it is also grappled (escape DC 14). Until the grapple ends, the target is restrained and unable to breathe unless it can breathe water. If the elemental moves, the grappled creature moves with it."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "acid, bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "damageVulnerabilities": ""
  },
  {
    "name": "Water Weird",
    "size": "Large",
    "type": "elemental",
    "alignment": "neutral",
    "ac": 13,
    "acType": "",
    "hp": 58,
    "hpFormula": "9d10+18",
    "speed": "0 ft., swim 60 ft.",
    "str": 17,
    "dex": 16,
    "con": 14,
    "int": 5,
    "wis": 8,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 9",
    "languages": "Aquan",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Bound",
        "desc": "The weird is bound to the area around its summoner's tower or the body of water in which it was summoned. The weird can't move more than 120 feet away from the area where it was summoned, and it dies if it moves farther than 120 feet away."
      },
      {
        "name": "Transparent",
        "desc": "Even when the weird is in plain sight, it takes a successful DC 15 Wisdom (Perception) check to spot the weird if it has neither moved nor attacked. A creature that tries to enter the weird's space while unaware of it is surprised by the weird."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The weird makes two attacks: one with its slam and one with its drowning grip."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) bludgeoning damage."
      },
      {
        "name": "Drowning Grip",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) bludgeoning damage. If the target is Medium or smaller, it is grappled (escape DC 14). Until this grapple ends, the target is unable to breathe unless it can breathe water. If the weird moves, the grappled creature moves with it."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "acid; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "cold, exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Weasel",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "",
    "hp": 1,
    "hpFormula": "1d4-1",
    "speed": "30 ft.",
    "str": 3,
    "dex": 16,
    "con": 8,
    "int": 2,
    "wis": 12,
    "cha": 5,
    "saves": "",
    "skills": "Perception +3, Stealth +5",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Memel Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "White Dragon Wyrmling",
    "size": "Medium",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 16,
    "acType": "natural armor",
    "hp": 32,
    "hpFormula": "5d8+10",
    "speed": "30 ft., burrow 15 ft., fly 60 ft., swim 30 ft.",
    "str": 15,
    "dex": 10,
    "con": 14,
    "int": 4,
    "wis": 10,
    "cha": 11,
    "saves": "Dex +2, Con +4, Wis +2",
    "skills": "Perception +4",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 14",
    "languages": "Draconic",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10+2) piercing damage plus 2 (1d4) cold damage."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The dragon exhales cold in a 15-foot cone. Each creature in that area must make a DC 12 Constitution saving throw, taking 22 (4d8+4) cold damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Wight",
    "size": "Medium",
    "type": "undead",
    "alignment": "neutral evil",
    "ac": 15,
    "acType": "scale mail",
    "hp": 45,
    "hpFormula": "10d8",
    "speed": "30 ft.",
    "str": 15,
    "dex": 14,
    "con": 16,
    "int": 10,
    "wis": 13,
    "cha": 15,
    "saves": "Wisdom +2",
    "skills": "Perception +2",
    "senses": "darkvision 60 ft., passive Perception 12",
    "languages": "the languages it knew in life",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Sunlight Sensitivity",
        "desc": "While in sunlight, the wight has disadvantage on attack rolls, and on Wisdom (Perception) checks that rely on sight."
      },
      {
        "name": "Undead Nature",
        "desc": "The wight doesn't need to breathe or sleep."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The wight makes two longsword attacks or two longbow attacks. It can use its Life Drain in place of one longsword attack."
      },
      {
        "name": "Life Drain",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 5 (1d6+2) necrotic damage. The target must succeed on a DC 13 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. If a creature's hit point maximum is reduced to 0 by this attack, the creature dies."
      },
      {
        "name": "Longsword",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) slashing damage, or 7 (1d10+2) slashing damage if used with both hands."
      },
      {
        "name": "Longbow",
        "desc": "Ranged Weapon Attack: +4 to hit, range 150/600 ft., one target. Hit: 6 (1d8+2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "necrotic, poison",
    "conditionImmunities": "exhaustion, frightened, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Winter Wolf",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "chaotic evil",
    "ac": 13,
    "acType": "natural armor",
    "hp": 110,
    "hpFormula": "13d10+39",
    "speed": "50 ft.",
    "str": 18,
    "dex": 16,
    "con": 16,
    "int": 7,
    "wis": 12,
    "cha": 8,
    "saves": "",
    "skills": "Perception +4, Stealth +5",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "Common, Giant, Goblin, Worg",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Artic Lair",
        "desc": "The wolf has advantage on saving throws against spells and other magical effects while within 10 feet of the lair."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The wolf makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) slashing damage."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The wolf exhales cold in a 15-foot cone. Each creature in that area must make a DC 14 Dexterity saving throw, taking 22 (5d8) cold damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "cold",
    "conditionImmunities": "",
    "damageVulnerabilities": "fire"
  },
  {
    "name": "Wolf",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "",
    "hp": 11,
    "hpFormula": "2d8+2",
    "speed": "40 ft.",
    "str": 12,
    "dex": 15,
    "con": 12,
    "int": 3,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "Perception +3, Stealth +4",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Keen Hearing and Smell",
        "desc": "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      },
      {
        "name": "Pack Tactics",
        "desc": "The wolf has advantage on an attack roll against a creature if at least one other wolf is within 5 feet of the target and the other wolf isn't incapacitated."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) piercing damage. If the target is a creature, it must succeed on a DC 12 Strength saving throw or be knocked prone."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Worg",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "evil",
    "ac": 13,
    "acType": "natural armor",
    "hp": 45,
    "hpFormula": "6d10+12",
    "speed": "60 ft.",
    "str": 19,
    "dex": 13,
    "con": 15,
    "int": 7,
    "wis": 12,
    "cha": 8,
    "saves": "",
    "skills": "Perception +4",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "Goblin, Worg",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Keen Hearing and Smell",
        "desc": "The worg has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      },
      {
        "name": "Pack Tactics",
        "desc": "The worg has advantage on an attack roll against a creature if at least one other worg is within 5 feet of the target and the other worg isn't incapacitated."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be knocked prone."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Wraith",
    "size": "Medium",
    "type": "undead",
    "alignment": "neutral evil",
    "ac": 13,
    "acType": "",
    "hp": 67,
    "hpFormula": "9d8+27",
    "speed": "0 ft., fly 60 ft. (hover)",
    "str": 6,
    "dex": 16,
    "con": 16,
    "int": 12,
    "wis": 14,
    "cha": 15,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 12",
    "languages": "the languages it knew in life",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Incorporeal Movement",
        "desc": "The wraith can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."
      },
      {
        "name": "Sunlight Sensitivity",
        "desc": "While in sunlight, the wraith has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
      }
    ],
    "actions": [
      {
        "name": "Life Drain",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 21 (4d8 + 3) necrotic damage. The target must succeed on a DC 14 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken."
      },
      {
        "name": "Create Specter",
        "desc": "The wraith targets a humanoid within 10 feet that has been dead for no longer than 1 minute and died violently. The target's spirit rises as a specter in the space of its corpse or in the nearest unoccupied space."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "acid, cold, fire, lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks that aren't silvered",
    "damageImmunities": "necrotic, poison",
    "conditionImmunities": "charmed, exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "damageVulnerabilities": ""
  },
  {
    "name": "Wyvern",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "natural armor",
    "hp": 110,
    "hpFormula": "13d10+39",
    "speed": "20 ft., fly 80 ft.",
    "str": 19,
    "dex": 10,
    "con": 16,
    "int": 5,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "Perception +4",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "",
    "cr": "6",
    "xp": 2300,
    "crNum": 6,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The wyvern makes two attacks: one with its bite and one with its stinger. While flying, it can use its claws in place of one other attack."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one creature. Hit: 11 (2d6 + 4) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) slashing damage."
      },
      {
        "name": "Stinger",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one creature. Hit: 11 (2d6 + 4) piercing damage. The target must make a DC 15 Constitution saving throw, taking 24 (7d6) poison damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Xorn",
    "size": "Medium",
    "type": "elemental",
    "alignment": "neutral",
    "ac": 19,
    "acType": "natural armor",
    "hp": 95,
    "hpFormula": "10d8+50",
    "speed": "20 ft., burrow 20 ft.",
    "str": 17,
    "dex": 10,
    "con": 20,
    "int": 11,
    "wis": 10,
    "cha": 11,
    "saves": "Con +7",
    "skills": "Perception +3, Stealth +3",
    "senses": "darkvision 60 ft., tremorsense 60 ft., passive Perception 13",
    "languages": "Terran",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Earth Glide",
        "desc": "The xorn can burrow through nonmagical rock and stone. While doing so, the xorn doesn't disturb the material it moves through."
      },
      {
        "name": "Stone Camouflage",
        "desc": "The xorn has advantage on Dexterity (Stealth) checks made to hide in rocky terrain."
      },
      {
        "name": "Treasure Sense",
        "desc": "The xorn can pinpoint, by scent, the location of precious metals and stones, such as coins and gems, within 60 feet of it."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The xorn makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 8 (1d8+4) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Young Black Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 127,
    "hpFormula": "15d10+45",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 19,
    "dex": 14,
    "con": 17,
    "int": 12,
    "wis": 11,
    "cha": 15,
    "saves": "Dex +5, Con +6, Wis +3, Cha +5",
    "skills": "Perception +6, Stealth +5",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 16",
    "languages": "Common, Draconic",
    "cr": "7",
    "xp": 2900,
    "crNum": 7,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage plus 4 (1d8) acid damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      },
      {
        "name": "Acid Breath (Recharge 5-6)",
        "desc": "The dragon exhales acid in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 49 (11d8) acid damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "acid",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Young Blue Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 152,
    "hpFormula": "16d10+64",
    "speed": "40 ft., fly 80 ft., burrow 40 ft.",
    "str": 19,
    "dex": 10,
    "con": 19,
    "int": 14,
    "wis": 13,
    "cha": 17,
    "saves": "Dex +4, Con +8, Wis +4, Cha +6",
    "skills": "Insight +4, Perception +8, Stealth +4",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 18",
    "languages": "Common, Draconic",
    "cr": "9",
    "xp": 5000,
    "crNum": 9,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10+4) piercing damage plus 4 (1d8) lightning damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "lightning",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Young Brass Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 18,
    "acType": "natural armor",
    "hp": 110,
    "hpFormula": "13d10+39",
    "speed": "40 ft., fly 80 ft., burrow 40 ft.",
    "str": 17,
    "dex": 10,
    "con": 17,
    "int": 14,
    "wis": 13,
    "cha": 15,
    "saves": "Dex +3, Con +6, Wis +4, Cha +5",
    "skills": "Insight +4, Perception +7, Stealth +3",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 17",
    "languages": "Common, Draconic",
    "cr": "6",
    "xp": 2300,
    "crNum": 6,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 15 (2d10+4) piercing damage plus 3 (1d6) fire damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 45 (10d8) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "fire",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Young Bronze Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 18,
    "acType": "natural armor",
    "hp": 142,
    "hpFormula": "15d10+60",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 19,
    "dex": 10,
    "con": 19,
    "int": 14,
    "wis": 13,
    "cha": 16,
    "saves": "Dex +3, Con +7, Wis +4, Cha +6",
    "skills": "Insight +4, Perception +7, Stealth +3",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 17",
    "languages": "Common, Draconic",
    "cr": "8",
    "xp": 3900,
    "crNum": 8,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10+4) piercing damage plus 4 (1d8) lightning damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 100-foot line that is 5 feet wide. Each creature in that line must make a DC 15 Dexterity saving throw, taking 52 (8d12) lightning damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "lightning",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Young Copper Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 17,
    "acType": "natural armor",
    "hp": 114,
    "hpFormula": "12d10+48",
    "speed": "40 ft., climb 40 ft., fly 80 ft.",
    "str": 17,
    "dex": 12,
    "con": 18,
    "int": 16,
    "wis": 14,
    "cha": 15,
    "saves": "Dex +4, Int +6, Wis +5, Cha +5",
    "skills": "Arcana +6, Deception +5, Insight +5, Perception +8, Stealth +4",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 18",
    "languages": "Common, Draconic",
    "cr": "7",
    "xp": 2900,
    "crNum": 7,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 15 (2d10+4) piercing damage plus 3 (1d6) acid damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage."
      },
      {
        "name": "Acid Breath (Recharge 5-6)",
        "desc": "The dragon exhales acid in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 15 Dexterity saving throw, taking 49 (11d8) acid damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "acid",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Young Gold Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "lawful good",
    "ac": 18,
    "acType": "natural armor",
    "hp": 178,
    "hpFormula": "17d10+85",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 21,
    "dex": 14,
    "con": 20,
    "int": 18,
    "wis": 17,
    "cha": 18,
    "saves": "Dex +5, Con +8, Wis +6, Cha +7",
    "skills": "Insight +6, Perception +9, Stealth +5",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 19",
    "languages": "Common, Draconic",
    "cr": "10",
    "xp": 5900,
    "crNum": 10,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 16 (2d10+5) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 12 (2d6+5) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 14 (2d8+5) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is within 120 feet and aware of it must succeed on a DC 15 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 16 Dexterity saving throw, taking 55 (10d10) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "fire",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Young Green Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 136,
    "hpFormula": "16d10+48",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 17,
    "dex": 12,
    "con": 16,
    "int": 16,
    "wis": 13,
    "cha": 15,
    "saves": "Dex +4, Con +6, Int +6, Wis +4, Cha +5",
    "skills": "Deception +5, Insight +4, Perception +7, Stealth +4",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 17",
    "languages": "Common, Draconic",
    "cr": "8",
    "xp": 3900,
    "crNum": 8,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 15 (2d10+4) piercing damage plus 3 (1d6) poison damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage."
      },
      {
        "name": "Poison Breath (Recharge 5-6)",
        "desc": "The dragon exhales poisonous gas in a 30-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking 42 (12d6) poison damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "poison",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Young Red Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 178,
    "hpFormula": "17d10+85",
    "speed": "40 ft., climb 40 ft., fly 80 ft.",
    "str": 23,
    "dex": 10,
    "con": 21,
    "int": 14,
    "wis": 11,
    "cha": 19,
    "saves": "Dex +4, Con +9, Wis +4, Cha +8",
    "skills": "Perception +8, Stealth +4",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 18",
    "languages": "Common, Draconic",
    "cr": "10",
    "xp": 5900,
    "crNum": 10,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage plus 3 (1d6) fire damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "fire",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Young Silver Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 17,
    "acType": "natural armor",
    "hp": 168,
    "hpFormula": "16d10+80",
    "speed": "40 ft., fly 80 ft.",
    "str": 19,
    "dex": 10,
    "con": 21,
    "int": 18,
    "wis": 16,
    "cha": 19,
    "saves": "Dex +4, Con +9, Wis +6, Cha +7",
    "skills": "Arcana +7, Insight +6, Perception +10, Stealth +4",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 20",
    "languages": "Common, Draconic, Telepathy 120 ft.",
    "cr": "9",
    "xp": 5000,
    "crNum": 9,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 15 (2d10+4) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 13 (2d8+4) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is within 120 feet and aware of it must succeed on a DC 15 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The dragon exhales cold in a 40-foot cone. Each creature in that area must make a DC 17 Constitution saving throw, taking 54 (12d8) cold damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Young White Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 17,
    "acType": "natural armor",
    "hp": 110,
    "hpFormula": "13d10+39",
    "speed": "40 ft., burrow 30 ft., fly 80 ft., swim 40 ft.",
    "str": 18,
    "dex": 10,
    "con": 17,
    "int": 6,
    "wis": 11,
    "cha": 12,
    "saves": "Dex +3, Con +6, Wis +3",
    "skills": "Perception +6",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 16",
    "languages": "Common, Draconic",
    "cr": "6",
    "xp": 2300,
    "crNum": 6,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon makes three attacks: one with its bite and two with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10+4) piercing damage plus 4 (1d8) cold damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6+4) slashing damage."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The dragon exhales cold in a 30-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking 45 (10d8) cold damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "cold",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": ""
  },
  {
    "name": "Zombie",
    "size": "Medium",
    "type": "undead",
    "alignment": "neutral evil",
    "ac": 8,
    "acType": "",
    "hp": 22,
    "hpFormula": "3d8+9",
    "speed": "20 ft.",
    "str": 13,
    "dex": 6,
    "con": 16,
    "int": 3,
    "wis": 6,
    "cha": 5,
    "saves": "Wis +0",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 8",
    "languages": "understands all languages it knew in life but can't speak",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Undead Fortitude",
        "desc": "If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw against DC 5 + the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead."
      }
    ],
    "actions": [
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one creature. Hit: 4 (1d6+1) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "poison",
    "conditionImmunities": "exhaustion, poisoned",
    "damageVulnerabilities": ""
  },
  {
    "name": "Banshee",
    "size": "Medium",
    "type": "undead",
    "subtype": null,
    "alignment": "chaotic evil",
    "ac": 12,
    "acType": "",
    "hp": 91,
    "hpFormula": "10d10+40",
    "speed": "0 ft., fly 40 ft. (hover)",
    "str": 10,
    "dex": 14,
    "con": 18,
    "int": 12,
    "wis": 16,
    "cha": 16,
    "saves": "Wis +7, Cha +7",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "acid, cold, fire, lightning, thunder",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "senses": "darkvision 60 ft., passive Perception 13",
    "languages": "all, but can't speak",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [
      {
        "name": "Undead Nature",
        "desc": "The banshee doesn't require air, food, drink, or sleep."
      },
      {
        "name": "Turn Immunity",
        "desc": "The banshee is immune to effects that turn undead."
      },
      {
        "name": "Wailing Vulnerability",
        "desc": "If the banshee is unable to wail, such as in the area of a silence spell, it has disadvantage on attack rolls and saving throws, and it can't use its Terrifying Wail reaction."
      }
    ],
    "actions": [
      {
        "name": "Touch",
        "desc": "Melee Spell Attack: +7 to hit, reach 5 ft., one target. Hit: 17 (4d8) necrotic damage."
      }
    ],
    "legendaryActions": null,
    "reactions": [
      {
        "name": "Terrifying Wail (1/Day)",
        "desc": "When a creature the banshee can see enters a space within 60 feet of the banshee, the banshee can use its reaction to wail. Each creature within 30 feet must make a DC 15 Wisdom saving throw. On a failure, a creature drops to 0 hit points. On a success, a creature takes 10 (3d6) psychic damage."
      }
    ]
  },
  {
    "name": "Blink Dog",
    "size": "Medium",
    "type": "fey",
    "subtype": null,
    "alignment": "lawful good",
    "ac": 13,
    "acType": "",
    "hp": 22,
    "hpFormula": "4d8+4",
    "speed": "40 ft.",
    "str": 12,
    "dex": 17,
    "con": 12,
    "int": 10,
    "wis": 13,
    "cha": 11,
    "saves": "",
    "skills": "Perception +2, Stealth +4",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "passive Perception 12",
    "languages": "understands Common but can't speak",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Blink (Recharge 4-6)",
        "desc": "As a reaction when the dog is hit by an attack, it can teleport up to 30 feet away. An attacker who hits the dog can't use this ability."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Cloaker",
    "size": "Large",
    "type": "aberration",
    "subtype": null,
    "alignment": "chaotic neutral",
    "ac": 14,
    "acType": "natural armor",
    "hp": 78,
    "hpFormula": "12d10+24",
    "speed": "10 ft., fly 40 ft.",
    "str": 17,
    "dex": 15,
    "con": 14,
    "int": 13,
    "wis": 12,
    "cha": 14,
    "saves": "",
    "skills": "Stealth +4",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "all, telepathy 60 ft.",
    "cr": "8",
    "xp": 3900,
    "crNum": 8,
    "traits": [
      {
        "name": "Damage Transfer",
        "desc": "While attached to a creature, the cloaker takes only half the damage dealt to it (rounded down), and the creature attached to the cloaker takes the other half."
      },
      {
        "name": "False Appearance",
        "desc": "While the cloaker remains motionless without its underside exposed, it is indistinguishable from a dark leather cloak."
      },
      {
        "name": "Light Sensitivity",
        "desc": "While in bright light, the cloaker has disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The cloaker makes two attacks: one with its bite and one with its tentacles."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) piercing damage."
      },
      {
        "name": "Tentacles",
        "desc": "Melee Weapon Attack: +5 to hit, reach 10 ft., one target. Hit: 16 (2d10+3) bludgeoning damage, and the target is grappled (escape DC 15). If the cloaker isn't attached to a creature, it can use both tentacles on the same target."
      },
      {
        "name": "Moan (Recharge 5-6)",
        "desc": "Each creature within 60 feet that can hear the moan and that fails a DC 13 Wisdom saving throw becomes frightened until the end of its next turn."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Death Knight",
    "size": "Large",
    "type": "undead",
    "subtype": null,
    "alignment": "chaotic evil",
    "ac": 20,
    "acType": "plate and shield",
    "hp": 180,
    "hpFormula": "19d10+76",
    "speed": "30 ft.",
    "str": 20,
    "dex": 11,
    "con": 18,
    "int": 16,
    "wis": 13,
    "cha": 16,
    "saves": "Con +8, Int +6, Wis +5, Cha +7",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "cold, lightning, necrotic",
    "damageImmunities": "poison",
    "conditionImmunities": "exhaustion, frightened, paralyzed, poisoned",
    "senses": "truesight 120 ft., passive Perception 11",
    "languages": "Abyssal, Common",
    "cr": "17",
    "xp": 18000,
    "crNum": 17,
    "traits": [
      {
        "name": "Hellish Weapons",
        "desc": "The death knight's weapon attacks are magical and deal an extra 11 (2d10) necrotic damage on a hit (included in the attacks below)."
      },
      {
        "name": "Immortal Life",
        "desc": "If the death knight is reduced to 0 hit points, it revives with all its hit points at sunset the next day, unless it is destroyed with a wish spell."
      },
      {
        "name": "Magic Resistance",
        "desc": "The death knight has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Undead Nature",
        "desc": "The death knight doesn't require air, food, drink, or sleep."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The death knight makes three longsword attacks or uses its Hellfire Orb twice."
      },
      {
        "name": "Longsword",
        "desc": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 17 (2d8+8) slashing damage plus 11 (2d10) necrotic damage."
      },
      {
        "name": "Hellfire Orb",
        "desc": "Ranged Spell Attack: +7 to hit, range 150 ft., one target. Hit: 27 (5d8) fire damage."
      },
      {
        "name": "Parry",
        "desc": "The death knight adds 4 to its AC against one melee attack that would hit it. To do so, the death knight must see the attacker and be wielding a melee weapon."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Faerie Dragon",
    "size": "Tiny",
    "type": "dragon",
    "subtype": null,
    "alignment": "chaotic good",
    "ac": 15,
    "acType": "",
    "hp": 10,
    "hpFormula": "4d4",
    "speed": "10 ft., fly 60 ft.",
    "str": 3,
    "dex": 20,
    "con": 10,
    "int": 14,
    "wis": 12,
    "cha": 16,
    "saves": "",
    "skills": "Perception +2",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "fire",
    "conditionImmunities": "",
    "senses": "darkvision 60 ft., passive Perception 12",
    "languages": "Draconic, Sylvan",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The dragon has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Innate Spellcasting",
        "desc": "The dragon's innate spellcasting ability is Charisma (spell save DC 14). It can innately cast the following spells, requiring no material components: At will: dancing lights, mage hand; 3/day each: color spray, mirror image; 1/day each: polymorph, invisibility"
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (2d4+2) piercing damage."
      },
      {
        "name": "Euphoria Breath (Recharge 5-6)",
        "desc": "The dragon exhales a shimmering cloud of magical gas in a 15-foot cone. Each creature in that area must succeed on a DC 12 Wisdom saving throw or be charmed for 1 minute. While charmed in this way, a creature has a speed of 0."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Gargoyle",
    "size": "Medium",
    "type": "elemental",
    "subtype": null,
    "alignment": "chaotic evil",
    "ac": 15,
    "acType": "natural armor",
    "hp": 52,
    "hpFormula": "7d10+14",
    "speed": "30 ft., fly 60 ft.",
    "str": 15,
    "dex": 11,
    "con": 15,
    "int": 6,
    "wis": 11,
    "cha": 7,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "bludgeoning, piercing, slashing from nonmagical attacks not made with adamantine",
    "damageImmunities": "poison",
    "conditionImmunities": "exhaustion, petrified, poisoned",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Terran",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "False Appearance",
        "desc": "While the gargoyle remains motionless, it is indistinguishable from an inanimate statue."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The gargoyle makes two claw attacks or two slam attacks."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6+2) slashing damage."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) bludgeoning damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Ghast",
    "size": "Medium",
    "type": "undead",
    "subtype": null,
    "alignment": "chaotic evil",
    "ac": 13,
    "acType": "",
    "hp": 36,
    "hpFormula": "8d8",
    "speed": "30 ft.",
    "str": 16,
    "dex": 17,
    "con": 10,
    "int": 11,
    "wis": 10,
    "cha": 8,
    "saves": "Con +2",
    "skills": "Perception +2, Stealth +3",
    "damageVulnerabilities": "",
    "damageResistances": "necrotic",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, poisoned",
    "senses": "darkvision 60 ft., passive Perception 12",
    "languages": "Common",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Stench",
        "desc": "Any creature that starts its turn within 5 feet of the ghast must succeed on a DC 10 Constitution saving throw or be poisoned until the start of its next turn. A creature that succeeds on the save is immune to the ghast's stench for 24 hours."
      },
      {
        "name": "Turning Defiance",
        "desc": "The ghast and any ghouls within 30 feet of it have advantage on saving throws against effects that turn undead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The ghast makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (2d4+3) slashing damage. If the target is a creature other than an undead, it must succeed on a DC 10 Constitution saving throw or be paralyzed for 1 minute."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Grick",
    "size": "Medium",
    "type": "monstrosity",
    "subtype": null,
    "alignment": "neutral",
    "ac": 14,
    "acType": "natural armor",
    "hp": 27,
    "hpFormula": "5d10+5",
    "speed": "30 ft., climb 30 ft.",
    "str": 14,
    "dex": 14,
    "con": 13,
    "int": 3,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "bludgeoning, piercing, slashing",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Stone Camouflage",
        "desc": "The grick has advantage on Dexterity (Stealth) checks made to hide in rocky terrain."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The grick makes one attack with its tentacles. If that attack hits, the grick can make one beak attack against the same target."
      },
      {
        "name": "Tentacles",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 9 (2d6+2) slashing damage."
      },
      {
        "name": "Beak",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6+2) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Mephit (Dust)",
    "size": "Small",
    "type": "elemental",
    "subtype": null,
    "alignment": "neutral evil",
    "ac": 12,
    "acType": "",
    "hp": 17,
    "hpFormula": "5d6",
    "speed": "30 ft., fly 30 ft.",
    "str": 5,
    "dex": 14,
    "con": 10,
    "int": 9,
    "wis": 11,
    "cha": 10,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Auran, Terran",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Death Burst",
        "desc": "When the mephit is reduced to 0 hit points or grappled by the giant, it explodes in a cloud of dust. Each creature within 5 feet must succeed on a DC 12 Dexterity saving throw or be blinded until the end of its next turn."
      }
    ],
    "actions": [
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) slashing damage."
      },
      {
        "name": "Blinding Breath (Recharge 6)",
        "desc": "The mephit exhales a 15-foot cone of blinding dust. Each creature in that area must succeed on a DC 12 Dexterity saving throw or be blinded for 1 minute. A creature can repeat the save at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Mephit (Ice)",
    "size": "Small",
    "type": "elemental",
    "subtype": null,
    "alignment": "neutral evil",
    "ac": 12,
    "acType": "",
    "hp": 22,
    "hpFormula": "5d6+5",
    "speed": "30 ft.",
    "str": 7,
    "dex": 13,
    "con": 12,
    "int": 9,
    "wis": 11,
    "cha": 12,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "bludgeoning, fire",
    "damageResistances": "cold",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Aquan, Auran",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Death Burst",
        "desc": "When the mephit is reduced to 0 hit points or grappled by the giant, it explodes. Each creature within 5 feet must make a DC 12 Dexterity saving throw, taking 7 (2d6) cold damage on a failed save, or half as much on a successful one."
      }
    ],
    "actions": [
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4+1) slashing damage plus 2 (1d4) cold damage."
      },
      {
        "name": "Frost Breath (Recharge 6)",
        "desc": "The mephit exhales a 15-foot cone of cold air. Each creature in that area must succeed on a DC 12 Dexterity saving throw, taking 5 (2d4) cold damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Mephit (Magma)",
    "size": "Small",
    "type": "elemental",
    "subtype": null,
    "alignment": "neutral evil",
    "ac": 12,
    "acType": "",
    "hp": 22,
    "hpFormula": "5d6+5",
    "speed": "30 ft., fly 30 ft.",
    "str": 8,
    "dex": 12,
    "con": 12,
    "int": 7,
    "wis": 11,
    "cha": 10,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "cold",
    "damageResistances": "fire",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Ignan, Terran",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Death Burst",
        "desc": "When the mephit is reduced to 0 hit points or grappled by the giant, it explodes. Each creature within 5 feet must make a DC 12 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "actions": [
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4+1) slashing damage plus 2 (1d4) fire damage."
      },
      {
        "name": "Fire Breath (Recharge 6)",
        "desc": "The mephit exhales a 15-foot cone of hot gas. Each creature in that area must succeed on a DC 12 Dexterity saving throw, taking 5 (2d4) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Mephit (Mud)",
    "size": "Small",
    "type": "elemental",
    "subtype": null,
    "alignment": "neutral evil",
    "ac": 11,
    "acType": "",
    "hp": 27,
    "hpFormula": "5d6+10",
    "speed": "20 ft., swim 20 ft.",
    "str": 8,
    "dex": 12,
    "con": 14,
    "int": 5,
    "wis": 10,
    "cha": 11,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Aquan, Terran",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Death Burst",
        "desc": "When the mephit is reduced to 0 hit points or grappled by the giant, it explodes. Each creature within 5 feet must make a DC 12 Dexterity saving throw. A creature takes 5 (2d4) bludgeoning damage on a failed save, or half as much on a successful one."
      }
    ],
    "actions": [
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4+1) slashing damage."
      },
      {
        "name": "Mud Breath (Recharge 6)",
        "desc": "The mephit exhales a 15-foot cone of wet sludge. Each creature in that area must succeed on a DC 12 Dexterity saving throw or be knocked prone."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Mephit (Smoke)",
    "size": "Small",
    "type": "elemental",
    "subtype": null,
    "alignment": "neutral evil",
    "ac": 12,
    "acType": "",
    "hp": 22,
    "hpFormula": "5d6+5",
    "speed": "30 ft., fly 30 ft.",
    "str": 6,
    "dex": 14,
    "con": 12,
    "int": 7,
    "wis": 10,
    "cha": 11,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "fire, poison",
    "damageImmunities": "",
    "conditionImmunities": "poisoned",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Auran, Ignan",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Death Burst",
        "desc": "When the mephit is reduced to 0 hit points or grappled by the giant, it explodes in a cloud of smoke. Each creature within 5 feet must succeed on a DC 12 Dexterity saving throw or be blinded until the end of its next turn."
      }
    ],
    "actions": [
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) slashing damage."
      },
      {
        "name": "Stinking Cloud (Recharge 6)",
        "desc": "The mephit exhales a 15-foot cone of noxious gas. Each creature in that area must succeed on a DC 12 Constitution saving throw or be poisoned for 1 minute. A creature can repeat the save at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Mephit (Steam)",
    "size": "Small",
    "type": "elemental",
    "subtype": null,
    "alignment": "neutral evil",
    "ac": 13,
    "acType": "",
    "hp": 22,
    "hpFormula": "5d6+5",
    "speed": "30 ft., fly 30 ft.",
    "str": 8,
    "dex": 13,
    "con": 12,
    "int": 7,
    "wis": 10,
    "cha": 12,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "cold",
    "damageResistances": "fire",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Aquan, Ignan",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Death Burst",
        "desc": "When the mephit is reduced to 0 hit points or grappled by the giant, it explodes. Each creature within 5 feet must make a DC 12 Dexterity saving throw, taking 5 (2d4) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "actions": [
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4+1) slashing damage plus 2 (1d4) fire damage."
      },
      {
        "name": "Scalding Breath (Recharge 6)",
        "desc": "The mephit exhales a 15-foot cone of scalding steam. Each creature in that area must succeed on a DC 12 Dexterity saving throw, taking 5 (2d4) fire damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Myconid (Adult)",
    "size": "Small",
    "type": "plant",
    "subtype": null,
    "alignment": "any alignment",
    "ac": 12,
    "acType": "",
    "hp": 22,
    "hpFormula": "5d6+5",
    "speed": "20 ft.",
    "str": 10,
    "dex": 10,
    "con": 12,
    "int": 13,
    "wis": 15,
    "cha": 6,
    "saves": "Wis +4",
    "skills": "Perception +4",
    "damageVulnerabilities": "cold, fire",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "charmed, frightened",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "Myconid",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Spore Network",
        "desc": "The myconid is aware of all myconids and fungi within 30 miles and can communicate with them telepathically."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The myconid makes one melee attack and uses Spore Cloud or Spore Explosion."
      },
      {
        "name": "Fist",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 5 (2d4) bludgeoning damage."
      },
      {
        "name": "Spore Cloud (Recharge 5-6)",
        "desc": "A 15-foot radius cloud of toxic spores extends from the myconid. Each creature in that area must succeed on a DC 12 Constitution saving throw or take 7 (2d6) poison damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Needle Blight",
    "size": "Small",
    "type": "plant",
    "subtype": null,
    "alignment": "neutral evil",
    "ac": 15,
    "acType": "natural armor",
    "hp": 4,
    "hpFormula": "1d6+1",
    "speed": "0 ft.",
    "str": 6,
    "dex": 8,
    "con": 12,
    "int": 1,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "bludgeoning, piercing",
    "damageImmunities": "",
    "conditionImmunities": "blinded, charmed, deafened, exhaustion, frightened, poisoned",
    "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 10",
    "languages": "",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "False Appearance",
        "desc": "While the blight remains motionless, it is indistinguishable from dead plant matter."
      }
    ],
    "actions": [
      {
        "name": "Needle",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Pixie",
    "size": "Tiny",
    "type": "fey",
    "subtype": null,
    "alignment": "chaotic good",
    "ac": 15,
    "acType": "",
    "hp": 1,
    "hpFormula": "1d4",
    "speed": "10 ft., fly 30 ft.",
    "str": 3,
    "dex": 18,
    "con": 13,
    "int": 14,
    "wis": 11,
    "cha": 11,
    "saves": "",
    "skills": "Perception +3, Stealth +5",
    "damageVulnerabilities": "iron",
    "damageResistances": "magic",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "passive Perception 13",
    "languages": "Sylvan",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The pixie has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Dagger",
        "desc": "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 6 (1d4+4) piercing damage."
      },
      {
        "name": "Polymorph (Recharge 4-6)",
        "desc": "The pixie targets one creature it can see within 30 feet. The creature must succeed on a DC 15 Wisdom saving throw or be polymorphed into a harmless creature of the pixie's choice."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Pseudodragon",
    "size": "Tiny",
    "type": "dragon",
    "subtype": null,
    "alignment": "neutral good",
    "ac": 13,
    "acType": "",
    "hp": 7,
    "hpFormula": "2d6",
    "speed": "15 ft., fly 60 ft.",
    "str": 6,
    "dex": 15,
    "con": 10,
    "int": 10,
    "wis": 12,
    "cha": 10,
    "saves": "",
    "skills": "Perception +3, Stealth +4",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 60 ft., passive Perception 13",
    "languages": "understands Common and Draconic but can't speak",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The pseudodragon has advantage on saving throws against spells and other magical effects."
      },
      {
        "name": "Limited Telepathy",
        "desc": "The pseudodragon can magically communicate simple ideas, emotions, and images telepathically with any creature within 100 feet of it that can understand a language."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) piercing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) piercing damage, and the target must succeed on a DC 12 Constitution saving throw or take 7 (2d6) poison damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Quipper",
    "size": "Tiny",
    "type": "beast",
    "subtype": null,
    "alignment": "unaligned",
    "ac": 13,
    "acType": "",
    "hp": 1,
    "hpFormula": "1d4",
    "speed": "swim 40 ft.",
    "str": 2,
    "dex": 16,
    "con": 9,
    "int": 1,
    "wis": 7,
    "cha": 2,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 60 ft., passive Perception 8",
    "languages": "",
    "cr": "0",
    "xp": 0,
    "crNum": 0,
    "traits": [
      {
        "name": "Blood Frenzy",
        "desc": "The quipper has advantage on melee attack rolls against any creature that doesn't have all its hit points."
      },
      {
        "name": "Water Breathing",
        "desc": "The quipper can only breathe underwater."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Sprite",
    "size": "Tiny",
    "type": "fey",
    "subtype": null,
    "alignment": "chaotic good",
    "ac": 15,
    "acType": "",
    "hp": 2,
    "hpFormula": "1d4",
    "speed": "10 ft., fly 40 ft.",
    "str": 3,
    "dex": 16,
    "con": 10,
    "int": 14,
    "wis": 13,
    "cha": 11,
    "saves": "",
    "skills": "Perception +3",
    "damageVulnerabilities": "iron",
    "damageResistances": "magic",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "passive Perception 13",
    "languages": "Sylvan",
    "cr": "1/4",
    "xp": 50,
    "crNum": 0.25,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The sprite has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Shortsword",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d4+3) slashing damage, and the target must succeed on a DC 10 Constitution saving throw or become poisoned for 1 minute. If the target is poisoned for 1 minute from this weapon and takes damage from it again, the poison can be removed if the target is cured with a greater restoration spell or similar magic."
      },
      {
        "name": "Heart Sight (Recharge 5-6)",
        "desc": "The sprite senses the presence and location of any celestial, dragon, elemental, fey, fiend, or undead creature within 60 feet of it."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Twig Blight",
    "size": "Small",
    "type": "plant",
    "subtype": null,
    "alignment": "neutral evil",
    "ac": 13,
    "acType": "natural armor",
    "hp": 4,
    "hpFormula": "1d6+1",
    "speed": "20 ft.",
    "str": 6,
    "dex": 13,
    "con": 12,
    "int": 1,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "Stealth +3",
    "damageVulnerabilities": "",
    "damageResistances": "bludgeoning, piercing",
    "damageImmunities": "",
    "conditionImmunities": "blinded, charmed, deafened, exhaustion, frightened, poisoned",
    "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 10",
    "languages": "",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [
      {
        "name": "False Appearance",
        "desc": "While the blight remains motionless, it is indistinguishable from dead plant matter."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Vine Blight",
    "size": "Small",
    "type": "plant",
    "subtype": null,
    "alignment": "neutral evil",
    "ac": 12,
    "acType": "",
    "hp": 5,
    "hpFormula": "2d6",
    "speed": "5 ft.",
    "str": 15,
    "dex": 8,
    "con": 10,
    "int": 1,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "bludgeoning, piercing",
    "damageImmunities": "",
    "conditionImmunities": "blinded, charmed, deafened, exhaustion, frightened, poisoned",
    "senses": "blindsight 60 ft. (blind beyond this radius), passive Perception 10",
    "languages": "",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [
      {
        "name": "False Appearance",
        "desc": "While the blight remains motionless, it is indistinguishable from normal vines and plants."
      }
    ],
    "actions": [
      {
        "name": "Constrict",
        "desc": "Melee Weapon Attack: +4 to hit, reach 10 ft., one target. Hit: 9 (2d6+2) bludgeoning damage, and the target is grappled (escape DC 14). If the blight isn't grappling a creature, it can use both tentacles on the same target."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Carrion Crawler",
    "size": "Large",
    "type": "monstrosity",
    "subtype": null,
    "alignment": "unaligned",
    "ac": 12,
    "acType": "natural armor",
    "hp": 51,
    "hpFormula": "6d10+18",
    "speed": "30 ft., climb 30 ft.",
    "str": 16,
    "dex": 14,
    "con": 16,
    "int": 1,
    "wis": 12,
    "cha": 5,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Carrion Sense",
        "desc": "The crawler can smell carrion from a distance of up to 1 mile away."
      },
      {
        "name": "Spider Climb",
        "desc": "The crawler can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The crawler makes two tentacle attacks."
      },
      {
        "name": "Tentacle",
        "desc": "Melee Weapon Attack: +5 to hit, reach 10 ft., one creature. Hit: 7 (1d8+3) poison damage, and the target must succeed on a DC 13 Constitution saving throw or be paralyzed for 1 minute. The target can repeat the save at the end of each of its turns, ending the condition on itself on a success."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Darkmantle",
    "size": "Small",
    "type": "monstrosity",
    "subtype": null,
    "alignment": "unaligned",
    "ac": 11,
    "acType": "",
    "hp": 22,
    "hpFormula": "5d6+5",
    "speed": "10 ft., fly 40 ft.",
    "str": 16,
    "dex": 12,
    "con": 13,
    "int": 2,
    "wis": 10,
    "cha": 5,
    "saves": "",
    "skills": "Stealth +3",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 120 ft., passive Perception 10",
    "languages": "",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [
      {
        "name": "Echolocation",
        "desc": "The mantle can't use its darkvision in areas of magical darkness."
      },
      {
        "name": "False Appearance",
        "desc": "While the mantle clings to the ceiling or hangs from a stalactite, it is indistinguishable from a cave formation."
      }
    ],
    "actions": [
      {
        "name": "Tentacles",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 6 (1d6+3) bludgeoning damage, and the target is grappled (escape DC 14). If the mantle isn't grappling a creature, it can use both tentacles on the same target."
      },
      {
        "name": "Darkness Aura (1/Day)",
        "desc": "The mantle activates an aura of magical darkness. The darkness spreads in a 30-foot radius and is centered on the mantle. The mantle sees through the darkness."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Death Dog",
    "size": "Large",
    "type": "monstrosity",
    "subtype": null,
    "alignment": "neutral evil",
    "ac": 12,
    "acType": "natural armor",
    "hp": 39,
    "hpFormula": "6d10+12",
    "speed": "40 ft.",
    "str": 15,
    "dex": 14,
    "con": 14,
    "int": 3,
    "wis": 13,
    "cha": 6,
    "saves": "",
    "skills": "Perception +4",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 120 ft., passive Perception 14",
    "languages": "",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Two Heads",
        "desc": "The dog has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious."
      },
      {
        "name": "Reactive Heads",
        "desc": "For each head the dog has beyond one, it gets an extra reaction that can be used only for opportunity attacks."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dog makes two bite attacks."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Goblin Boss",
    "size": "Small",
    "type": "humanoid",
    "subtype": "goblinoid",
    "alignment": "neutral evil",
    "ac": 17,
    "acType": "leather armor and shield",
    "hp": 21,
    "hpFormula": "6d6",
    "speed": "30 ft.",
    "str": 10,
    "dex": 16,
    "con": 10,
    "int": 10,
    "wis": 8,
    "cha": 10,
    "saves": "",
    "skills": "Stealth +5",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 60 ft., passive Perception 9",
    "languages": "Goblin",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Parry",
        "desc": "The goblin adds 2 to its AC against one melee attack that would hit it, provided the goblin can see the attacker and is wielding a melee weapon."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The goblin makes two attacks with its scimitar."
      },
      {
        "name": "Scimitar",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) slashing damage."
      },
      {
        "name": "Javelin",
        "desc": "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 5 (1d6+2) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Gnoll",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "gnoll",
    "alignment": "chaotic evil",
    "ac": 15,
    "acType": "leather armor",
    "hp": 22,
    "hpFormula": "5d8",
    "speed": "30 ft.",
    "str": 14,
    "dex": 12,
    "con": 11,
    "int": 6,
    "wis": 10,
    "cha": 7,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Gnoll",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [
      {
        "name": "Rampage",
        "desc": "When the gnoll reduces a creature to 0 hit points with a melee attack on its turn, the gnoll can take a bonus action to move up to half its speed and make a bite attack."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 6 (1d8+2) piercing damage."
      },
      {
        "name": "Spear",
        "desc": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 6 (1d8+2) piercing damage."
      },
      {
        "name": "Longbow",
        "desc": "Ranged Weapon Attack: +3 to hit, range 150/600 ft., one target. Hit: 5 (1d8+1) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Gnoll Pack Lord",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "gnoll",
    "alignment": "chaotic evil",
    "ac": 16,
    "acType": "leather armor",
    "hp": 49,
    "hpFormula": "7d10+14",
    "speed": "30 ft.",
    "str": 16,
    "dex": 14,
    "con": 15,
    "int": 8,
    "wis": 11,
    "cha": 9,
    "saves": "",
    "skills": "Melee +4",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Gnoll",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Rampage",
        "desc": "When the gnoll reduces a creature to 0 hit points with a melee attack on its turn, the gnoll can take a bonus action to move up to half its speed and make a bite attack."
      },
      {
        "name": "Pack Tactics",
        "desc": "The gnoll has advantage on an attack roll against a creature if at least one of the gnoll's allies is within 5 feet of the creature and the ally isn't incapacitated."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The gnoll makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 7 (1d8+3) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) slashing damage."
      },
      {
        "name": "Spear",
        "desc": "Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 7 (1d8+3) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Hobgoblin Captain",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "goblinoid",
    "alignment": "lawful evil",
    "ac": 17,
    "acType": "half plate and shield",
    "hp": 39,
    "hpFormula": "6d10+12",
    "speed": "30 ft.",
    "str": 15,
    "dex": 14,
    "con": 14,
    "int": 12,
    "wis": 11,
    "cha": 11,
    "saves": "Int +3",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Goblin",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Parry",
        "desc": "The hobgoblin adds 2 to its AC against one melee attack that would hit it, provided it can see the attacker and is wielding a melee weapon."
      },
      {
        "name": "Martial Advantage",
        "desc": "Once per turn, the hobgoblin can deal an extra 7 (2d6) damage to a creature it hits with a weapon attack if that creature is within 5 feet of an ally of the hobgoblin that isn't incapacitated."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The hobgoblin makes two longsword attacks or two javelin attacks."
      },
      {
        "name": "Longsword",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) slashing damage, or 7 (1d10+2) if used with both hands."
      },
      {
        "name": "Javelin",
        "desc": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 5 (1d6+2) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Merfolk",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "merfolk",
    "alignment": "neutral",
    "ac": 11,
    "acType": "",
    "hp": 11,
    "hpFormula": "2d8+2",
    "speed": "0 ft., swim 40 ft.",
    "str": 10,
    "dex": 13,
    "con": 12,
    "int": 11,
    "wis": 12,
    "cha": 12,
    "saves": "",
    "skills": "Perception +3",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "passive Perception 13",
    "languages": "Merfolk, Aquan",
    "cr": "1/8",
    "xp": 25,
    "crNum": 0.125,
    "traits": [
      {
        "name": "Limited Amphibiousness",
        "desc": "The merfolk can breathe air and water, but needs to be submerged at least once every 4 hours to avoid suffocation."
      }
    ],
    "actions": [
      {
        "name": "Spear",
        "desc": "Melee or Ranged Weapon Attack: +2 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 3 (1d6) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Orc Eye of Gruumsh",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "orc",
    "alignment": "chaotic evil",
    "ac": 16,
    "acType": "scale mail",
    "hp": 45,
    "hpFormula": "7d8+14",
    "speed": "30 ft.",
    "str": 16,
    "dex": 12,
    "con": 14,
    "int": 10,
    "wis": 11,
    "cha": 11,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Orc",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Aggressive",
        "desc": "As a bonus action, the orc can move up to its speed toward a hostile creature that it can see."
      },
      {
        "name": "Eye of Gruumsh",
        "desc": "The orc can see in dim light within 120 feet as if it were bright light."
      },
      {
        "name": "Spellcasting",
        "desc": "The orc is a 3rd-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 10, +2 to hit with spell attacks). The orc has the following druid spells prepared: Cantrips (at will): druidcraft, produce flame; 1st level (4 slots): cure wounds, faerie fire, thunderwave"
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The orc makes two attacks with its greataxe."
      },
      {
        "name": "Greataxe",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12+3) slashing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Orc War Chief",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "orc",
    "alignment": "chaotic evil",
    "ac": 16,
    "acType": "scale mail",
    "hp": 93,
    "hpFormula": "11d10+33",
    "speed": "30 ft.",
    "str": 18,
    "dex": 14,
    "con": 16,
    "int": 10,
    "wis": 11,
    "cha": 13,
    "saves": "Str +6, Con +5, Wis +3",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "passive Perception 10",
    "languages": "Orc",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [
      {
        "name": "Aggressive",
        "desc": "As a bonus action, the orc can move up to its speed toward a hostile creature that it can see."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The orc makes two greataxe attacks or two javelin attacks."
      },
      {
        "name": "Greataxe",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10 (1d12+4) slashing damage."
      },
      {
        "name": "Javelin",
        "desc": "Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 7 (1d6+4) piercing damage."
      },
      {
        "name": "Parry",
        "desc": "The orc adds 3 to its AC against one melee attack that would hit it, provided it can see the attacker and is wielding a melee weapon."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Sahuagin",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "sahuagin",
    "alignment": "lawful evil",
    "ac": 12,
    "acType": "leather armor",
    "hp": 22,
    "hpFormula": "4d8+4",
    "speed": "30 ft., swim 40 ft.",
    "str": 13,
    "dex": 11,
    "con": 12,
    "int": 12,
    "wis": 13,
    "cha": 9,
    "saves": "",
    "skills": "Perception +4",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 120 ft., passive Perception 14",
    "languages": "Sahuagin",
    "cr": "1/2",
    "xp": 100,
    "crNum": 0.5,
    "traits": [
      {
        "name": "Blood Frenzy",
        "desc": "The sahuagin has advantage on melee attack rolls against any creature that doesn't have all its hit points."
      },
      {
        "name": "Limited Amphibiousness",
        "desc": "The sahuagin can breathe air and water, but needs to be submerged at least once every 4 hours to avoid suffocation."
      },
      {
        "name": "Shark Telepathy",
        "desc": "The sahuagin can magically communicate simple ideas with sharks and other sahuagin within 120 feet using telepathy."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The sahuagin makes two melee attacks: one bite and one claws or trident."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6+1) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4+1) slashing damage."
      },
      {
        "name": "Trident",
        "desc": "Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6+1) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Werewolf",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "human, shapechanger",
    "alignment": "chaotic evil",
    "ac": 12,
    "acType": "leather armor",
    "hp": 78,
    "hpFormula": "12d8+24",
    "speed": "30 ft. (40 ft. in wolf form)",
    "str": 15,
    "dex": 13,
    "con": 14,
    "int": 10,
    "wis": 11,
    "cha": 10,
    "saves": "",
    "skills": "Perception +4, Stealth +3",
    "damageVulnerabilities": "",
    "damageResistances": "bludgeoning, piercing, slashing from nonmagical attacks not made with silver",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "passive Perception 14",
    "languages": "Common",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Shapechanger",
        "desc": "The werewolf can use an action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      },
      {
        "name": "Keen Hearing and Smell",
        "desc": "The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      }
    ],
    "actions": [
      {
        "name": "Multiattack (Humanoid or Hybrid Form Only)",
        "desc": "The werewolf makes two longsword attacks, two greataxe attacks or one bite and one claws."
      },
      {
        "name": "Bite (Wolf or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) piercing damage. If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with werewolf lycanthropy."
      },
      {
        "name": "Claws (Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6+2) slashing damage."
      },
      {
        "name": "Longsword (Humanoid or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) or 7 (1d10+2) if used with both hands slashing damage."
      },
      {
        "name": "Greataxe (Humanoid or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 9 (1d12+2) slashing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Wererat",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "human, shapechanger",
    "alignment": "lawful evil",
    "ac": 12,
    "acType": "",
    "hp": 33,
    "hpFormula": "6d8+6",
    "speed": "30 ft.",
    "str": 10,
    "dex": 15,
    "con": 12,
    "int": 11,
    "wis": 10,
    "cha": 8,
    "saves": "",
    "skills": "Perception +2",
    "damageVulnerabilities": "",
    "damageResistances": "bludgeoning, piercing, slashing from nonmagical attacks not made with silver",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 60 ft., passive Perception 12",
    "languages": "Common",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Shapechanger",
        "desc": "The wererat can use an action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      },
      {
        "name": "Keen Smell",
        "desc": "The wererat has advantage on Wisdom (Perception) checks that rely on smell."
      }
    ],
    "actions": [
      {
        "name": "Multiattack (Humanoid or Hybrid Form Only)",
        "desc": "The wererat makes two attacks, only one of which can be a bite."
      },
      {
        "name": "Bite (Rat or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) piercing damage. If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with wererat lycanthropy."
      },
      {
        "name": "Shortsword (Humanoid or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d6+2) piercing damage."
      },
      {
        "name": "Hand Crossbow (Humanoid or Hybrid Form Only)",
        "desc": "Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 4 (1d6+2) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Werebear",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "human, shapechanger",
    "alignment": "neutral good",
    "ac": 10,
    "acType": "",
    "hp": 135,
    "hpFormula": "10d10+80",
    "speed": "30 ft. (40 ft., climb 30 ft. in bear form)",
    "str": 19,
    "dex": 10,
    "con": 17,
    "int": 11,
    "wis": 12,
    "cha": 12,
    "saves": "",
    "skills": "Perception +4",
    "damageVulnerabilities": "",
    "damageResistances": "bludgeoning, piercing, slashing from nonmagical attacks not made with silver",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "passive Perception 14",
    "languages": "Common",
    "cr": "5",
    "xp": 1800,
    "crNum": 5,
    "traits": [
      {
        "name": "Shapechanger",
        "desc": "The werebear can use an action to polymorph into a bear-humanoid hybrid or into a bear, or back into its true form. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      },
      {
        "name": "Keen Smell",
        "desc": "The werebear has advantage on Wisdom (Perception) checks that rely on smell."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "In bear form, the werebear makes two claw attacks. In humanoid form, it makes two weapon attacks."
      },
      {
        "name": "Bite (Bear or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 15 (2d8+6) piercing damage."
      },
      {
        "name": "Claw (Bear or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d6+6) slashing damage."
      },
      {
        "name": "Greataxe (Humanoid or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 10 (1d12+4) or 11 (1d12+5) slashing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Wereboar",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "human, shapechanger",
    "alignment": "neutral evil",
    "ac": 11,
    "acType": "leather armor",
    "hp": 78,
    "hpFormula": "12d8+24",
    "speed": "30 ft. (40 ft. in boar form)",
    "str": 17,
    "dex": 10,
    "con": 15,
    "int": 10,
    "wis": 11,
    "cha": 8,
    "saves": "",
    "skills": "",
    "damageVulnerabilities": "",
    "damageResistances": "bludgeoning, piercing, slashing from nonmagical attacks not made with silver",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "passive Perception 10",
    "languages": "Common",
    "cr": "2",
    "xp": 450,
    "crNum": 2,
    "traits": [
      {
        "name": "Shapechanger",
        "desc": "The wereboar can use an action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      },
      {
        "name": "Relentless (Recharge 5-6)",
        "desc": "If the wereboar takes 10 damage or less that would reduce it to 0 hit points, it instead remains conscious with 1 hit point."
      }
    ],
    "actions": [
      {
        "name": "Multiattack (Humanoid or Hybrid Form Only)",
        "desc": "The wereboar makes two attacks, using its tusks or its greataxe."
      },
      {
        "name": "Bite (Boar or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) piercing damage. If the target is a humanoid, it must succeed on a DC 12 Constitution saving throw or be cursed with wereboar lycanthropy."
      },
      {
        "name": "Tusks (Boar or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) piercing damage."
      },
      {
        "name": "Greataxe (Humanoid or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12+3) slashing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Weretiger",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "human, shapechanger",
    "alignment": "neutral",
    "ac": 12,
    "acType": "",
    "hp": 120,
    "hpFormula": "16d8+48",
    "speed": "30 ft. (40 ft., climb 30 ft. in tiger form)",
    "str": 17,
    "dex": 15,
    "con": 16,
    "int": 10,
    "wis": 13,
    "cha": 11,
    "saves": "",
    "skills": "Perception +4, Stealth +4",
    "damageVulnerabilities": "",
    "damageResistances": "bludgeoning, piercing, slashing from nonmagical attacks not made with silver",
    "damageImmunities": "",
    "conditionImmunities": "",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "Common",
    "cr": "4",
    "xp": 1100,
    "crNum": 4,
    "traits": [
      {
        "name": "Shapechanger",
        "desc": "The weretiger can use an action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      },
      {
        "name": "Keen Hearing and Smell",
        "desc": "The weretiger has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      }
    ],
    "actions": [
      {
        "name": "Multiattack (Humanoid or Hybrid Form Only)",
        "desc": "In humanoid form, the weretiger makes two longsword attacks or two shortbow attacks. In hybrid form, it can make one bite attack and one claw attack."
      },
      {
        "name": "Bite (Tiger or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d10+3) piercing damage. If the target is a humanoid, it must succeed on a DC 13 Constitution saving throw or be cursed with weretiger lycanthropy."
      },
      {
        "name": "Claw (Tiger or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) slashing damage."
      },
      {
        "name": "Longsword (Humanoid or Hybrid Form Only)",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) or 8 (1d10+3) if used with both hands slashing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Androsphinx",
    "size": "Large",
    "type": "monstrosity",
    "subtype": null,
    "alignment": "lawful neutral",
    "ac": 17,
    "acType": "natural armor",
    "hp": 199,
    "hpFormula": "19d10+95",
    "speed": "40 ft., fly 60 ft.",
    "str": 22,
    "dex": 16,
    "con": 20,
    "int": 18,
    "wis": 18,
    "cha": 16,
    "saves": "Dex +6, Con +8, Int +8, Wis +8",
    "skills": "Arcana +8, History +8, Insight +8, Perception +8",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "psychic",
    "conditionImmunities": "charmed, frightened, paralyzed, poisoned",
    "senses": "truesight 120 ft., passive Perception 18",
    "languages": "Common, Sphinx",
    "cr": "17",
    "xp": 18000,
    "crNum": 17,
    "traits": [
      {
        "name": "Inscrutable",
        "desc": "The sphinx is immune to divination magic."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the sphinx fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Magic Weapons",
        "desc": "The sphinx's weapon attacks are magical."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The sphinx makes two claw attacks."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 13 (2d6+6) slashing damage."
      },
      {
        "name": "Roar (Recharge 5-6)",
        "desc": "The sphinx emits a magical roar. Each creature within 300 feet that can hear it and that fails a DC 16 Wisdom saving throw is frightened for 1 minute. A creature can repeat the save at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "legendaryActions": [
      {
        "name": "Claw Attack",
        "desc": "The sphinx makes one claw attack."
      },
      {
        "name": "Teleport (Costs 2 Actions)",
        "desc": "The sphinx magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."
      },
      {
        "name": "Cast a Spell (Costs 3 Actions)",
        "desc": "The sphinx casts a spell it knows, using a saving throw it is proficient in."
      }
    ]
  },
  {
    "name": "Gynosphinx",
    "size": "Large",
    "type": "monstrosity",
    "subtype": null,
    "alignment": "lawful neutral",
    "ac": 17,
    "acType": "natural armor",
    "hp": 199,
    "hpFormula": "19d10+95",
    "speed": "40 ft., fly 60 ft.",
    "str": 18,
    "dex": 16,
    "con": 20,
    "int": 18,
    "wis": 18,
    "cha": 18,
    "saves": "Dex +6, Con +8, Int +8, Wis +8, Cha +8",
    "skills": "Arcana +8, History +8, Insight +8, Medicine +8, Perception +8, Religion +8",
    "damageVulnerabilities": "",
    "damageResistances": "",
    "damageImmunities": "psychic",
    "conditionImmunities": "charmed, frightened, paralyzed, poisoned",
    "senses": "truesight 120 ft., passive Perception 18",
    "languages": "Common, Sphinx",
    "cr": "18",
    "xp": 20000,
    "crNum": 18,
    "traits": [
      {
        "name": "Inscrutable",
        "desc": "The sphinx is immune to divination magic."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the sphinx fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Magic Weapons",
        "desc": "The sphinx's weapon attacks are magical."
      },
      {
        "name": "Spellcasting",
        "desc": "The sphinx is a 9th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 16, +8 to hit with spell attacks). It has the following wizard spells prepared: Cantrips (at will): mage hand, prestidigitation, light; 1st level (4 slots): detect magic, identify, shield; 2nd level (3 slots): darkness, locate object; 3rd level (3 slots): dispel magic, remove curse; 4th level (3 slots): banishment, greater invisibility"
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The sphinx makes two claw attacks."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) slashing damage."
      }
    ],
    "legendaryActions": [
      {
        "name": "Claw Attack",
        "desc": "The sphinx makes one claw attack."
      },
      {
        "name": "Teleport (Costs 2 Actions)",
        "desc": "The sphinx magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."
      },
      {
        "name": "Cast a Spell (Costs 3 Actions)",
        "desc": "The sphinx casts a spell it knows, using a saving throw it is proficient in."
      }
    ]
  },
  {
    "name": "Yuan-ti Abomination",
    "size": "Large",
    "type": "monstrosity",
    "subtype": "shapechanger",
    "alignment": "chaotic evil",
    "ac": 15,
    "acType": "natural armor",
    "hp": 127,
    "hpFormula": "15d10+45",
    "speed": "40 ft., climb 40 ft.",
    "str": 19,
    "dex": 16,
    "con": 17,
    "int": 17,
    "wis": 15,
    "cha": 18,
    "saves": "Con +5, Wis +4, Cha +6",
    "skills": "Perception +4, Stealth +5",
    "damageVulnerabilities": "",
    "damageResistances": "poison",
    "damageImmunities": "",
    "conditionImmunities": "poisoned",
    "senses": "darkvision 120 ft., passive Perception 14",
    "languages": "Abyssal, Common, Yuan-ti",
    "cr": "7",
    "xp": 2900,
    "crNum": 7,
    "traits": [
      {
        "name": "Shapechanger",
        "desc": "The abomination can use an action to polymorph into a snake-humanoid hybrid or back into its true form. Its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      },
      {
        "name": "Innate Spellcasting",
        "desc": "The abomination's innate spellcasting ability is Charisma (spell save DC 14). It can innately cast the following spells, requiring no material components: At will: poison spray, animal friendship (snakes only)"
      },
      {
        "name": "Magic Resistance",
        "desc": "The abomination has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The abomination makes two attacks: one with its bite and one with its claws or constrict."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 7 (1d6+4) piercing damage plus 10 (3d6) poison damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 7 (1d6+4) slashing damage."
      },
      {
        "name": "Constrict",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 11 (2d6+4) bludgeoning damage, and the target is grappled (escape DC 16). If the abomination isn't grappling a creature, it can use both tentacles on the same target."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Yuan-ti Malison",
    "size": "Medium",
    "type": "monstrosity",
    "subtype": "shapechanger",
    "alignment": "chaotic evil",
    "ac": 14,
    "acType": "natural armor",
    "hp": 66,
    "hpFormula": "12d8+24",
    "speed": "30 ft., climb 30 ft.",
    "str": 16,
    "dex": 14,
    "con": 15,
    "int": 14,
    "wis": 12,
    "cha": 16,
    "saves": "",
    "skills": "Deception +5, Perception +3",
    "damageVulnerabilities": "",
    "damageResistances": "poison",
    "damageImmunities": "",
    "conditionImmunities": "poisoned",
    "senses": "darkvision 60 ft., passive Perception 13",
    "languages": "Abyssal, Common, Yuan-ti",
    "cr": "3",
    "xp": 700,
    "crNum": 3,
    "traits": [
      {
        "name": "Shapechanger",
        "desc": "The malison can use an action to polymorph into a snake-humanoid hybrid or back into its true form. Its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies."
      },
      {
        "name": "Innate Spellcasting",
        "desc": "The malison's innate spellcasting ability is Charisma (spell save DC 13). It can innately cast the following spells, requiring no material components: At will: poison spray, animal friendship (snakes only)"
      },
      {
        "name": "Magic Resistance",
        "desc": "The malison has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The malison makes two attacks: one with its bite and one with its claws or scimitar."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d4+3) piercing damage plus 7 (2d6) poison damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 5 (1d6+3) slashing damage."
      },
      {
        "name": "Scimitar",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) slashing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Yuan-ti Pureblood",
    "size": "Medium",
    "type": "monstrosity",
    "subtype": "shapechanger",
    "alignment": "chaotic evil",
    "ac": 11,
    "acType": "",
    "hp": 27,
    "hpFormula": "5d8+5",
    "speed": "30 ft., climb 30 ft.",
    "str": 16,
    "dex": 14,
    "con": 13,
    "int": 14,
    "wis": 12,
    "cha": 14,
    "saves": "",
    "skills": "Deception +4, Perception +2",
    "damageVulnerabilities": "",
    "damageResistances": "poison",
    "damageImmunities": "",
    "conditionImmunities": "poisoned",
    "senses": "darkvision 60 ft., passive Perception 12",
    "languages": "Abyssal, Common, Yuan-ti",
    "cr": "1",
    "xp": 200,
    "crNum": 1,
    "traits": [
      {
        "name": "Innate Spellcasting",
        "desc": "The pureblood's innate spellcasting ability is Charisma (spell save DC 12). It can innately cast the following spells, requiring no material components: At will: poison spray, animal friendship (snakes only); 3/day: suggestion"
      },
      {
        "name": "Magic Resistance",
        "desc": "The pureblood has advantage on saving throws against spells and other magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The pureblood makes two attacks with its scimitar or casts a cantrip."
      },
      {
        "name": "Scimitar",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) slashing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Adult Blue Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 19,
    "acType": "natural armor",
    "hp": 225,
    "hpFormula": "18d10+126",
    "speed": "40 ft., fly 80 ft.",
    "str": 25,
    "dex": 10,
    "con": 23,
    "int": 16,
    "wis": 15,
    "cha": 19,
    "saves": "Dex +4, Con +10, Wis +6, Cha +8",
    "skills": "Insight +6, Perception +10",
    "damageImmunities": "lightning",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 20",
    "languages": "Draconic",
    "cr": "16",
    "crNum": 16,
    "xp": 15000,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10+6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6+6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8+6) bludgeoning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 100-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6+6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Adult Brass Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 18,
    "acType": "natural armor",
    "hp": 172,
    "hpFormula": "15d12+75",
    "speed": "40 ft., fly 80 ft.",
    "str": 23,
    "dex": 10,
    "con": 21,
    "int": 14,
    "wis": 13,
    "cha": 17,
    "saves": "Dex +4, Con +9, Wis +5, Cha +7",
    "skills": "Insight +5, Perception +9",
    "damageImmunities": "fire",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 19",
    "languages": "Draconic",
    "cr": "13",
    "crNum": 13,
    "xp": 10000,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 15 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 16 (2d10+6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 12 (2d6+6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +10 to hit, reach 15 ft., one target. Hit: 14 (2d8+6) bludgeoning damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 60-foot cone. Each creature in that cone must make a DC 17 Dexterity saving throw, taking 55 (10d10) fire damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Sleep Breath (Recharge 5-6)",
        "desc": "The dragon exhales sleep gas in a 30-foot cone. Each creature in that cone must succeed on a DC 17 Constitution saving throw or fall unconscious for 10 minutes."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 18 Dexterity saving throw or take 12 (2d6+6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Adult Bronze Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 19,
    "acType": "natural armor",
    "hp": 212,
    "hpFormula": "17d12+102",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 25,
    "dex": 10,
    "con": 23,
    "int": 16,
    "wis": 15,
    "cha": 17,
    "saves": "Dex +4, Con +10, Wis +6, Cha +7",
    "skills": "Insight +6, Perception +10",
    "damageImmunities": "lightning",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 20",
    "languages": "Draconic",
    "cr": "15",
    "crNum": 15,
    "xp": 13000,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 15 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10+6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6+6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8+6) bludgeoning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 100-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Repulsion Breath (Recharge 5-6)",
        "desc": "The dragon exhales repulsion energy in a 30-foot cone. Each creature in that cone must succeed on a DC 18 Strength saving throw. On a failed save, a creature takes 55 (10d10) force damage and is pushed 40 feet away from the dragon."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6+6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Adult Copper Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 18,
    "acType": "natural armor",
    "hp": 184,
    "hpFormula": "16d12+80",
    "speed": "40 ft., climb 40 ft., fly 80 ft.",
    "str": 23,
    "dex": 12,
    "con": 21,
    "int": 18,
    "wis": 15,
    "cha": 16,
    "saves": "Dex +5, Con +9, Wis +6, Cha +7",
    "skills": "Deception +7, Insight +6, Perception +10, Stealth +5",
    "damageImmunities": "acid",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 20",
    "languages": "Draconic",
    "cr": "14",
    "crNum": 14,
    "xp": 11500,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 15 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 16 (2d10+6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 12 (2d6+6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +10 to hit, reach 15 ft., one target. Hit: 14 (2d8+6) bludgeoning damage."
      },
      {
        "name": "Acid Breath (Recharge 5-6)",
        "desc": "The dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 17 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Slowing Breath (Recharge 5-6)",
        "desc": "The dragon exhales gas in a 30-foot cone. Each creature in that cone must succeed on a DC 17 Constitution saving throw. On a failed save, a creature can't use reactions, and its speed is halved, and it can't make more than one attack on its turn."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 18 Dexterity saving throw or take 12 (2d6+6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Adult Gold Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "lawful good",
    "ac": 19,
    "acType": "natural armor",
    "hp": 256,
    "hpFormula": "19d12+152",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 27,
    "dex": 14,
    "con": 25,
    "int": 16,
    "wis": 15,
    "cha": 24,
    "saves": "Dex +6, Con +12, Wis +7, Cha +11",
    "skills": "Insight +7, Perception +11",
    "damageImmunities": "fire",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 21",
    "languages": "Draconic",
    "cr": "17",
    "crNum": 17,
    "xp": 18000,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +12 to hit, reach 10 ft., one target. Hit: 18 (2d10+7) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 14 (2d6+7) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +12 to hit, reach 15 ft., one target. Hit: 16 (2d8+7) bludgeoning damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 60-foot cone. Each creature in that cone must make a DC 20 Dexterity saving throw, taking 66 (12d10) fire damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Weakening Breath (Recharge 5-6)",
        "desc": "The dragon exhales gas in a 30-foot cone. Each creature in that cone must succeed on a DC 20 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 20 Dexterity saving throw or take 14 (2d6+7) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Adult Green Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 19,
    "acType": "natural armor",
    "hp": 207,
    "hpFormula": "18d12+90",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 23,
    "dex": 12,
    "con": 21,
    "int": 18,
    "wis": 15,
    "cha": 17,
    "saves": "Dex +5, Con +9, Wis +6, Cha +7",
    "skills": "Deception +7, Insight +6, Perception +10, Stealth +5",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 20",
    "languages": "Draconic",
    "cr": "15",
    "crNum": 15,
    "xp": 13000,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 15 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 16 (2d10+6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 12 (2d6+6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +10 to hit, reach 15 ft., one target. Hit: 14 (2d8+6) bludgeoning damage."
      },
      {
        "name": "Poison Breath (Recharge 5-6)",
        "desc": "The dragon exhales poisonous gas in a 60-foot cone. Each creature in that cone must make a DC 17 Constitution saving throw, taking 54 (12d8) poison damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 18 Dexterity saving throw or take 12 (2d6+6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Adult Silver Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "lawful good",
    "ac": 19,
    "acType": "natural armor",
    "hp": 243,
    "hpFormula": "17d12+153",
    "speed": "40 ft., fly 80 ft.",
    "str": 27,
    "dex": 12,
    "con": 25,
    "int": 16,
    "wis": 13,
    "cha": 20,
    "saves": "Dex +5, Con +12, Wis +5, Cha +9",
    "skills": "Arcana +7, Insight +5, Perception +9",
    "damageImmunities": "cold",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 19",
    "languages": "Draconic",
    "cr": "16",
    "crNum": 16,
    "xp": 15000,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +12 to hit, reach 10 ft., one target. Hit: 18 (2d10+7) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +12 to hit, reach 5 ft., one target. Hit: 14 (2d6+7) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +12 to hit, reach 15 ft., one target. Hit: 16 (2d8+7) bludgeoning damage."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The dragon exhales an icy blast in a 90-foot cone. Each creature in that cone must make a DC 20 Constitution saving throw, taking 66 (12d10) cold damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Paralyzing Breath (Recharge 5-6)",
        "desc": "The dragon exhales paralyzing gas in a 30-foot cone. Each creature in that cone must succeed on a DC 20 Constitution saving throw or be paralyzed for 1 minute."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 20 Dexterity saving throw or take 14 (2d6+7) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Adult White Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 200,
    "hpFormula": "16d12+96",
    "speed": "40 ft., burrow 30 ft., fly 80 ft., swim 40 ft.",
    "str": 22,
    "dex": 10,
    "con": 22,
    "int": 8,
    "wis": 12,
    "cha": 12,
    "saves": "Dex +4, Con +10, Wis +5, Cha +5",
    "skills": "Perception +9",
    "damageImmunities": "cold",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 19",
    "languages": "Draconic",
    "cr": "13",
    "crNum": 13,
    "xp": 10000,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 15 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 16 (2d10+6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +10 to hit, reach 5 ft., one target. Hit: 12 (2d6+6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +10 to hit, reach 15 ft., one target. Hit: 14 (2d8+6) bludgeoning damage."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The dragon exhales an icy blast in a 30-foot cone. Each creature in that cone must make a DC 18 Dexterity saving throw, taking 54 (12d8) cold damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 18 Dexterity saving throw or take 12 (2d6+6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Ancient Black Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 22,
    "acType": "natural armor",
    "hp": 367,
    "hpFormula": "21d20+147",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 27,
    "dex": 14,
    "con": 25,
    "int": 16,
    "wis": 15,
    "cha": 19,
    "saves": "Dex +7, Con +13, Wis +8, Cha +10",
    "skills": "Insight +8, Perception +14",
    "damageImmunities": "acid",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 24",
    "languages": "Draconic",
    "cr": "21",
    "crNum": 21,
    "xp": 33000,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10+8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6+8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8+8) bludgeoning damage."
      },
      {
        "name": "Acid Breath (Recharge 5-6)",
        "desc": "The dragon exhales acid in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 21 Dexterity saving throw, taking 67 (15d8) acid damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6+8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Ancient Blue Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 22,
    "acType": "natural armor",
    "hp": 481,
    "hpFormula": "26d20+208",
    "speed": "40 ft., fly 80 ft.",
    "str": 29,
    "dex": 10,
    "con": 27,
    "int": 18,
    "wis": 17,
    "cha": 21,
    "saves": "Dex +6, Con +15, Wis +10, Cha +12",
    "skills": "Insight +10, Perception +16",
    "damageImmunities": "lightning",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 26",
    "languages": "Draconic",
    "cr": "23",
    "crNum": 23,
    "xp": 50000,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +16 to hit, reach 15 ft., one target. Hit: 20 (2d10+9) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +16 to hit, reach 10 ft., one target. Hit: 16 (2d6+9) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +16 to hit, reach 20 ft., one target. Hit: 18 (2d8+9) bludgeoning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 24 Dexterity saving throw or take 16 (2d6+9) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Ancient Brass Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 20,
    "acType": "natural armor",
    "hp": 297,
    "hpFormula": "17d20+119",
    "speed": "40 ft., fly 80 ft.",
    "str": 27,
    "dex": 10,
    "con": 25,
    "int": 16,
    "wis": 15,
    "cha": 19,
    "saves": "Dex +6, Con +13, Wis +9, Cha +11",
    "skills": "Insight +9, Perception +14",
    "damageImmunities": "fire",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 24",
    "languages": "Draconic",
    "cr": "20",
    "crNum": 20,
    "xp": 25000,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10+8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6+8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8+8) bludgeoning damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 120-foot cone. Each creature in that cone must make a DC 21 Dexterity saving throw, taking 84 (13d10) fire damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Sleep Breath (Recharge 5-6)",
        "desc": "The dragon exhales sleep gas in a 90-foot cone. Each creature in that cone must succeed on a DC 21 Constitution saving throw or fall unconscious for 10 minutes."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6+8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Ancient Bronze Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 22,
    "acType": "natural armor",
    "hp": 444,
    "hpFormula": "24d20+192",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 29,
    "dex": 10,
    "con": 27,
    "int": 18,
    "wis": 17,
    "cha": 19,
    "saves": "Dex +6, Con +15, Wis +10, Cha +11",
    "skills": "Insight +10, Perception +16",
    "damageImmunities": "lightning",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 26",
    "languages": "Draconic",
    "cr": "22",
    "crNum": 22,
    "xp": 41000,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +16 to hit, reach 15 ft., one target. Hit: 20 (2d10+9) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +16 to hit, reach 10 ft., one target. Hit: 16 (2d6+9) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +16 to hit, reach 20 ft., one target. Hit: 18 (2d8+9) bludgeoning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Repulsion Breath (Recharge 5-6)",
        "desc": "The dragon exhales repulsion energy in a 90-foot cone. Each creature in that cone must succeed on a DC 23 Strength saving throw. On a failed save, a creature takes 66 (12d10) force damage and is pushed 60 feet away from the dragon."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 24 Dexterity saving throw or take 16 (2d6+9) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Ancient Copper Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 21,
    "acType": "natural armor",
    "hp": 350,
    "hpFormula": "20d20+140",
    "speed": "40 ft., climb 40 ft., fly 80 ft.",
    "str": 27,
    "dex": 12,
    "con": 25,
    "int": 20,
    "wis": 17,
    "cha": 18,
    "saves": "Dex +7, Con +13, Wis +10, Cha +11",
    "skills": "Deception +11, Insight +10, Perception +15, Stealth +7",
    "damageImmunities": "acid",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 25",
    "languages": "Draconic",
    "cr": "21",
    "crNum": 21,
    "xp": 33000,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10+8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6+8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8+8) bludgeoning damage."
      },
      {
        "name": "Acid Breath (Recharge 5-6)",
        "desc": "The dragon exhales acid in a 90-foot line that is 10 feet wide. Each creature in that line must make a DC 21 Dexterity saving throw, taking 70 (16d8) acid damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Slowing Breath (Recharge 5-6)",
        "desc": "The dragon exhales gas in a 90-foot cone. Each creature in that cone must succeed on a DC 21 Constitution saving throw. On a failed save, a creature can't use reactions, and its speed is halved, and it can't make more than one attack on its turn."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6+8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Ancient Green Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 21,
    "acType": "natural armor",
    "hp": 385,
    "hpFormula": "22d20+176",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 27,
    "dex": 12,
    "con": 25,
    "int": 20,
    "wis": 17,
    "cha": 19,
    "saves": "Dex +7, Con +13, Wis +10, Cha +11",
    "skills": "Deception +11, Insight +10, Perception +15, Stealth +7",
    "damageImmunities": "poison",
    "conditionImmunities": "poisoned",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 25",
    "languages": "Draconic",
    "cr": "22",
    "crNum": 22,
    "xp": 41000,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10+8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6+8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8+8) bludgeoning damage."
      },
      {
        "name": "Poison Breath (Recharge 5-6)",
        "desc": "The dragon exhales poisonous gas in a 90-foot cone. Each creature in that cone must make a DC 21 Constitution saving throw, taking 77 (14d10) poison damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6+8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Ancient Silver Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "lawful good",
    "ac": 22,
    "acType": "natural armor",
    "hp": 487,
    "hpFormula": "25d20+225",
    "speed": "40 ft., fly 80 ft.",
    "str": 29,
    "dex": 12,
    "con": 27,
    "int": 18,
    "wis": 15,
    "cha": 24,
    "saves": "Dex +7, Con +15, Wis +9, Cha +14",
    "skills": "Arcana +10, Insight +9, Perception +15",
    "damageImmunities": "cold",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 25",
    "languages": "Draconic",
    "cr": "23",
    "crNum": 23,
    "xp": 50000,
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 22 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +16 to hit, reach 15 ft., one target. Hit: 20 (2d10+9) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +16 to hit, reach 10 ft., one target. Hit: 16 (2d6+9) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +16 to hit, reach 20 ft., one target. Hit: 18 (2d8+9) bludgeoning damage."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The dragon exhales an icy blast in a 120-foot cone. Each creature in that cone must make a DC 23 Constitution saving throw, taking 88 (16d10) cold damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Paralyzing Breath (Recharge 5-6)",
        "desc": "The dragon exhales paralyzing gas in a 90-foot cone. Each creature in that cone must succeed on a DC 23 Constitution saving throw or be paralyzed for 1 minute."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 24 Dexterity saving throw or take 16 (2d6+9) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Ancient White Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 20,
    "acType": "natural armor",
    "hp": 333,
    "hpFormula": "18d20+144",
    "speed": "40 ft., burrow 40 ft., fly 80 ft., swim 40 ft.",
    "str": 26,
    "dex": 10,
    "con": 26,
    "int": 10,
    "wis": 13,
    "cha": 14,
    "saves": "Dex +6, Con +14, Wis +8, Cha +9",
    "skills": "Perception +14",
    "damageImmunities": "cold",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 24",
    "languages": "Draconic",
    "cr": "20",
    "crNum": 20,
    "xp": 25000,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      },
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice that is aware of the dragon and within 120 feet of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence. It then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10+8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6+8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8+8) bludgeoning damage."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The dragon exhales an icy blast in a 90-foot cone. Each creature in that cone must make a DC 22 Dexterity saving throw, taking 72 (16d8) cold damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The dragon makes a tail attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6+8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Behir",
    "size": "Huge",
    "type": "monstrosity",
    "alignment": "neutral evil",
    "ac": 17,
    "acType": "natural armor",
    "hp": 168,
    "hpFormula": "16d12+80",
    "speed": "50 ft., climb 40 ft.",
    "str": 23,
    "dex": 16,
    "con": 21,
    "int": 7,
    "wis": 14,
    "cha": 7,
    "saves": "Str +9",
    "skills": "Perception +5",
    "damageImmunities": "lightning",
    "senses": "darkvision 90 ft., passive Perception 15",
    "languages": "",
    "cr": "11",
    "crNum": 11,
    "xp": 7200,
    "traits": [
      {
        "name": "Keen Smell",
        "desc": "The behir has advantage on Wisdom (Perception) checks that rely on smell."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The behir makes two attacks: one bite and one constrict."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 16 (2d10+6) piercing damage."
      },
      {
        "name": "Constrict",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one Large or smaller creature. Hit: 17 (2d10+6) bludgeoning damage, and the target is grappled. Until this grapple ends, the target can't breathe unless it can breathe without lungs."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The behir exhales a line of lightning 20 feet long and 5 feet wide. Each creature in that area must make a DC 17 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Swallow",
        "desc": "The behir makes one bite attack against a Medium or smaller creature it is grappling. If the attack hits, the target is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, and unable to breathe unless the behir can breathe underwater."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Bugbear",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "goblinoid",
    "alignment": "chaotic evil",
    "ac": 16,
    "acType": "leather armor",
    "hp": 27,
    "hpFormula": "5d8+5",
    "speed": "30 ft.",
    "str": 15,
    "dex": 14,
    "con": 13,
    "int": 8,
    "wis": 11,
    "cha": 10,
    "saves": "",
    "skills": "Stealth +4, Survival +2",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "Goblin",
    "cr": "1",
    "crNum": 1,
    "xp": 200,
    "traits": [
      {
        "name": "Brute",
        "desc": "A melee weapon deals one extra die of its damage when the bugbear hits with it."
      },
      {
        "name": "Surprise Attack",
        "desc": "If the bugbear surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 7 (2d6) damage from the attack."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The bugbear makes two melee attacks, such as two with its morningstar or one morningstar and one javelin."
      },
      {
        "name": "Morningstar",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 6 (1d8+2) bludgeoning damage, or 7 (1d10+2) if used with two hands."
      },
      {
        "name": "Javelin",
        "desc": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 30/120 ft., one creature. Hit: 5 (1d6+2) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Chain Devil",
    "size": "Medium",
    "type": "fiend",
    "subtype": "devil",
    "alignment": "lawful evil",
    "ac": 16,
    "acType": "natural armor",
    "hp": 85,
    "hpFormula": "10d8+40",
    "speed": "30 ft.",
    "str": 18,
    "dex": 16,
    "con": 18,
    "int": 11,
    "wis": 12,
    "cha": 14,
    "saves": "Str +7, Con +7, Wis +4, Cha +5",
    "skills": "Insight +4",
    "damageResistances": "cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, poisoned",
    "senses": "darkvision 120 ft., passive Perception 11",
    "languages": "Infernal, telepathy 120 ft.",
    "cr": "8",
    "crNum": 8,
    "xp": 3900,
    "traits": [
      {
        "name": "Devil's Sight",
        "desc": "Magical darkness doesn't impede the devil's darkvision."
      },
      {
        "name": "Magic Resistance",
        "desc": "The devil has advantage on saving throws against spells and magical effects."
      },
      {
        "name": "Reactive Attacks",
        "desc": "For each creature other than itself within 30 feet of the devil that it can see, the devil gets a +2 bonus to attack rolls."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The devil makes three attacks with its chain."
      },
      {
        "name": "Chain",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 11 (2d6+4) slashing damage. The target must succeed on a DC 15 Strength saving throw or be restrained."
      },
      {
        "name": "Helm of Telepathy",
        "desc": "The devil uses its helm to cast detect thoughts, requiring no material components and no action to cast."
      }
    ],
    "legendaryActions": null,
    "reactions": [
      {
        "name": "Reactive Attack",
        "desc": "The devil makes a melee attack when a creature it can see moves away from it."
      }
    ]
  },
  {
    "name": "Cult Fanatic",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any non-good alignment",
    "ac": 13,
    "acType": "leather armor",
    "hp": 33,
    "hpFormula": "6d8+6",
    "speed": "30 ft.",
    "str": 11,
    "dex": 16,
    "con": 12,
    "int": 12,
    "wis": 14,
    "cha": 14,
    "saves": "Wis +4",
    "skills": "Deception +4, Persuasion +4, Religion +3",
    "senses": "passive Perception 12",
    "languages": "any one language (usually Common)",
    "cr": "2",
    "crNum": 2,
    "xp": 450,
    "traits": [
      {
        "name": "Dark Devotion",
        "desc": "The fanatic has advantage on saving throws against being charmed or frightened."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The fanatic makes two melee attacks."
      },
      {
        "name": "Dagger",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 5 (1d4+3) piercing damage."
      },
      {
        "name": "Light Crossbow",
        "desc": "Ranged Weapon Attack: +5 to hit, range 80/320 ft., one target. Hit: 6 (1d8+3) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": [
      {
        "name": "Parry",
        "desc": "The fanatic adds 2 to its AC against one melee attack made against it, provided it can see the attacker."
      }
    ]
  },
  {
    "name": "Doppelganger",
    "size": "Medium",
    "type": "monstrosity",
    "subtype": "shapechanger",
    "alignment": "unaligned",
    "ac": 14,
    "acType": "",
    "hp": 52,
    "hpFormula": "8d8+16",
    "speed": "30 ft.",
    "str": 11,
    "dex": 16,
    "con": 14,
    "int": 12,
    "wis": 14,
    "cha": 14,
    "saves": "",
    "skills": "Deception +4, Insight +4",
    "senses": "darkvision 60 ft., passive Perception 12",
    "languages": "Thieves' Cant",
    "cr": "3",
    "crNum": 3,
    "xp": 700,
    "traits": [
      {
        "name": "Shapechanger",
        "desc": "The doppelganger can use its action to polymorph into a Small or Medium humanoid it has seen, or back into its true form. Its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed."
      },
      {
        "name": "Ambusher",
        "desc": "The doppelganger has advantage on attack rolls against any creature it has surprised."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The doppelganger makes two melee attacks."
      },
      {
        "name": "Shortsword",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6+3) piercing damage."
      },
      {
        "name": "Light Crossbow",
        "desc": "Ranged Weapon Attack: +5 to hit, range 80/320 ft., one target. Hit: 7 (1d8+3) piercing damage."
      },
      {
        "name": "Read Thoughts",
        "desc": "The doppelganger magically reads the surface thoughts of one creature it can see within 60 feet. The effect can penetrate barriers, but 1 foot of wood or dirt blocks it."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Drow",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "elf",
    "alignment": "neutral evil",
    "ac": 15,
    "acType": "chain mail",
    "hp": 13,
    "hpFormula": "2d8+4",
    "speed": "30 ft.",
    "str": 10,
    "dex": 14,
    "con": 12,
    "int": 11,
    "wis": 11,
    "cha": 12,
    "saves": "",
    "skills": "Perception +2, Stealth +4",
    "senses": "darkvision 120 ft., passive Perception 12",
    "languages": "Elvish, Undercommon",
    "cr": "1/4",
    "crNum": 0.25,
    "xp": 50,
    "traits": [
      {
        "name": "Keen Senses",
        "desc": "The drow has advantage on Wisdom (Perception) checks that rely on sight."
      },
      {
        "name": "Fey Ancestry",
        "desc": "The drow has advantage on saving throws against being charmed, and magic can't put the drow to sleep."
      },
      {
        "name": "Innate Spellcasting",
        "desc": "The drow's spellcasting ability is Charisma. It can innately cast the following spells, requiring no material components: At will: dancing lights. 1/day each: darkness, faerie fire."
      }
    ],
    "actions": [
      {
        "name": "Rapier",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8+2) piercing damage."
      },
      {
        "name": "Hand Crossbow",
        "desc": "Ranged Weapon Attack: +4 to hit, range 30/120 ft., one target. Hit: 5 (1d6+2) piercing damage, and the target must succeed on a DC 12 Constitution saving throw, taking 3 (1d6) poison damage on a failed save."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Ettercap",
    "size": "Medium",
    "type": "monstrosity",
    "alignment": "neutral evil",
    "ac": 13,
    "acType": "natural armor",
    "hp": 44,
    "hpFormula": "8d8+8",
    "speed": "30 ft., climb 30 ft.",
    "str": 14,
    "dex": 13,
    "con": 12,
    "int": 7,
    "wis": 12,
    "cha": 8,
    "saves": "",
    "skills": "Perception +3, Stealth +3",
    "senses": "darkvision 60 ft., passive Perception 13",
    "languages": "",
    "cr": "2",
    "crNum": 2,
    "xp": 450,
    "traits": [
      {
        "name": "Spider Climb",
        "desc": "The ettercap can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
      },
      {
        "name": "Web Sense",
        "desc": "While in contact with a web, the ettercap knows the exact location of any other creature in contact with the same web."
      },
      {
        "name": "Web Walker",
        "desc": "The ettercap ignores movement restrictions caused by webbing."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The ettercap makes two attacks: one bite and one attack with its claws or bite again."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 6 (1d8+2) piercing damage, and the target must succeed on a DC 12 Constitution saving throw or take 4 (1d8) poison damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10+2) slashing damage."
      },
      {
        "name": "Web (Recharge 5-6)",
        "desc": "Ranged Weapon Attack: +3 to hit, range 30/60 ft., one Large or smaller creature. Hit: The creature is restrained by webbing. As an action, the restrained creature can make a DC 12 Strength check, bursting the webbing on a success."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Green Hag",
    "size": "Medium",
    "type": "fey",
    "alignment": "chaotic evil",
    "ac": 17,
    "acType": "natural armor",
    "hp": 82,
    "hpFormula": "11d8+33",
    "speed": "30 ft.",
    "str": 18,
    "dex": 12,
    "con": 16,
    "int": 12,
    "wis": 13,
    "cha": 14,
    "saves": "Wis +3",
    "skills": "Arcana +3, Deception +4, Perception +3",
    "senses": "darkvision 60 ft., passive Perception 13",
    "languages": "Common, Draconic, Sylvan",
    "cr": "3",
    "crNum": 3,
    "xp": 700,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The hag can breathe air and water."
      },
      {
        "name": "Innate Spellcasting",
        "desc": "The hag's innate spellcasting ability is Charisma. She can innately cast the following spells, requiring no material components: At will: dancing lights, minor illusion, vicious mockery."
      },
      {
        "name": "Mimicry",
        "desc": "The hag can mimic animal sounds and humanoid voices. A creature that hears the sounds must succeed on a DC 14 Wisdom check to recognize the hag's voice."
      }
    ],
    "actions": [
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8+4) slashing damage."
      },
      {
        "name": "Illusory Appearance",
        "desc": "The hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like an ugly creature of her general size and humanoid shape."
      },
      {
        "name": "Invisible Passage",
        "desc": "The hag casts invisibility, using Charisma as the spellcasting ability. She can cast it at will, but the spell ends if she attacks or casts another spell."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Sea Hag",
    "size": "Medium",
    "type": "fey",
    "alignment": "chaotic evil",
    "ac": 14,
    "acType": "natural armor",
    "hp": 52,
    "hpFormula": "7d8+21",
    "speed": "30 ft., swim 40 ft.",
    "str": 16,
    "dex": 13,
    "con": 16,
    "int": 12,
    "wis": 12,
    "cha": 13,
    "saves": "Wis +3",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "Aquan, Common",
    "cr": "2",
    "crNum": 2,
    "xp": 450,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The hag can breathe air and water."
      },
      {
        "name": "Horrific Appearance",
        "desc": "Any humanoid that starts its turn within 30 feet of the hag and can see the hag's true form must make a DC 13 Wisdom saving throw. On a failed save, the creature is frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns."
      },
      {
        "name": "Sense Location",
        "desc": "The hag senses the exact location of any creature against which she has cast this spell that is on the same plane of existence as her."
      }
    ],
    "actions": [
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6+3) slashing damage."
      },
      {
        "name": "Death Glare",
        "desc": "One humanoid the hag can see within 60 feet of her must make a DC 13 Wisdom saving throw against this magic. Taking 4 (1d8) psychic damage on a failed save, or half as much on a successful one. If the target drops to 0 hit points from this damage, it dies."
      },
      {
        "name": "Illusory Appearance",
        "desc": "The hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like a humanoid of her size and type or an object."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Guardian Naga",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "lawful good",
    "ac": 18,
    "acType": "natural armor",
    "hp": 127,
    "hpFormula": "15d10+45",
    "speed": "40 ft.",
    "str": 19,
    "dex": 16,
    "con": 16,
    "int": 16,
    "wis": 19,
    "cha": 18,
    "saves": "Dex +6, Con +6, Int +6, Wis +7, Cha +7",
    "skills": "Insight +7, Perception +7",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, frightened, paralyzed, poisoned",
    "senses": "darkvision 90 ft., passive Perception 17",
    "languages": "Celestial, Common",
    "cr": "10",
    "crNum": 10,
    "xp": 5900,
    "traits": [
      {
        "name": "Rejuvenation",
        "desc": "If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning."
      },
      {
        "name": "Spellcasting",
        "desc": "The naga is a 9th-level spellcaster. Its spellcasting ability is Wisdom, and it has the following cleric spells prepared: Cantrips (at will): mending, sacred flame, thaumaturgy. 1st level (4 slots): bless, cure wounds, detect magic, sanctuary. 2nd level (3 slots): calm emotions, hold person. 3rd level (3 slots): bestow curse, clairvoyance. 4th level (3 slots): banishment, dimension door. 5th level (1 slot): flame strike, geas."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The naga makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one creature. Hit: 7 (1d6+4) piercing damage, and the target must make a DC 15 Constitution saving throw, taking 7 (2d6) poison damage on a failed save."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 8 (1d8+4) slashing damage."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The naga makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The naga makes a tail attack."
      },
      {
        "name": "Cast a Spell (Costs 2 Actions)",
        "desc": "The naga casts a spell using a spell slot, if available."
      }
    ],
    "reactions": []
  },
  {
    "name": "Spirit Naga",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "chaotic evil",
    "ac": 15,
    "acType": "natural armor",
    "hp": 75,
    "hpFormula": "10d10+20",
    "speed": "40 ft.",
    "str": 16,
    "dex": 16,
    "con": 15,
    "int": 14,
    "wis": 14,
    "cha": 16,
    "saves": "Dex +6, Con +5, Wis +5, Cha +6",
    "skills": "Perception +5",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, poisoned",
    "senses": "darkvision 60 ft., passive Perception 15",
    "languages": "Abyssal, Common",
    "cr": "8",
    "crNum": 8,
    "xp": 3900,
    "traits": [
      {
        "name": "Rejuvenation",
        "desc": "If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning."
      },
      {
        "name": "Spellcasting",
        "desc": "The naga is a 8th-level spellcaster. Its spellcasting ability is Charisma. It has the following warlock spells prepared: Cantrips (at will): eldritch blast, mage hand, minor illusion. 1st level (2 slots): arms of hadar, hex. 2nd level (2 slots): invisibility, scorching ray. 3rd level (2 slots): counterspell, fireball. 4th level (1 slot): dimension door."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The naga makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one creature. Hit: 6 (1d6+3) piercing damage, and the target must make a DC 13 Constitution saving throw, taking 7 (2d6) poison damage on a failed save."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 7 (1d8+3) slashing damage."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The naga makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail Attack",
        "desc": "The naga makes a tail attack."
      }
    ],
    "reactions": []
  },
  {
    "name": "Hook Horror",
    "size": "Large",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 15,
    "acType": "natural armor",
    "hp": 75,
    "hpFormula": "10d10+20",
    "speed": "30 ft., climb 30 ft.",
    "str": 18,
    "dex": 13,
    "con": 15,
    "int": 6,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +4",
    "senses": "darkvision 60 ft., passive Perception 14",
    "languages": "",
    "cr": "3",
    "crNum": 3,
    "xp": 700,
    "traits": [
      {
        "name": "Keen Sight and Smell",
        "desc": "The hook horror has advantage on Wisdom checks that rely on sight or smell."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The hook horror makes two attacks with its hooks."
      },
      {
        "name": "Hook",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 13 (2d8+4) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Horned Devil",
    "size": "Large",
    "type": "fiend",
    "subtype": "devil",
    "alignment": "lawful evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 178,
    "hpFormula": "17d10+85",
    "speed": "20 ft., fly 60 ft.",
    "str": 22,
    "dex": 16,
    "con": 21,
    "int": 12,
    "wis": 16,
    "cha": 17,
    "saves": "Str +9, Dex +6, Wis +7, Cha +7",
    "skills": "Insight +7",
    "damageResistances": "cold, fire, lightning; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, poisoned",
    "senses": "darkvision 120 ft., passive Perception 13",
    "languages": "Infernal, telepathy 120 ft.",
    "cr": "11",
    "crNum": 11,
    "xp": 7200,
    "traits": [
      {
        "name": "Devil's Sight",
        "desc": "Magical darkness doesn't impede the devil's darkvision."
      },
      {
        "name": "Magic Resistance",
        "desc": "The devil has advantage on saving throws against spells and magical effects."
      },
      {
        "name": "Reactive Attacks",
        "desc": "For each creature other than itself within 30 feet of the devil that it can see, the devil gets a +2 bonus to attack rolls."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The devil makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 16 (2d10+5) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 13 (2d8+5) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 10 (1d8+5) bludgeoning damage. If the target is a creature, it must succeed on a DC 17 Strength saving throw or be knocked prone."
      },
      {
        "name": "Hurl Flame",
        "desc": "Ranged Spell Attack: +6 to hit, range 150 ft., one target. Hit: 14 (4d6) fire damage."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The devil makes a Wisdom (Perception) check."
      },
      {
        "name": "Attack",
        "desc": "The devil makes a melee attack."
      },
      {
        "name": "Wing Attack (Costs 2 Actions)",
        "desc": "The devil beats its wings. Each creature within 10 feet of it that doesn't have a flying speed must succeed on a DC 17 Strength saving throw or be knocked prone."
      }
    ],
    "reactions": []
  },
  {
    "name": "Ice Devil",
    "size": "Large",
    "type": "fiend",
    "subtype": "devil",
    "alignment": "lawful evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 180,
    "hpFormula": "19d10+76",
    "speed": "40 ft.",
    "str": 21,
    "dex": 18,
    "con": 18,
    "int": 18,
    "wis": 18,
    "cha": 18,
    "saves": "Dex +7, Con +7, Wis +7, Cha +7",
    "skills": "Insight +7",
    "damageResistances": "bludgeoning, piercing, and slashing from nonmagical attacks; bludgeoning, piercing, and slashing from nonmagical attacks not made with silvered weapons",
    "damageImmunities": "cold, fire, poison",
    "conditionImmunities": "charmed, exhaustion, frightened, poisoned",
    "senses": "darkvision 120 ft., passive Perception 14",
    "languages": "Infernal, telepathy 120 ft.",
    "cr": "14",
    "crNum": 14,
    "xp": 11500,
    "traits": [
      {
        "name": "Devil's Sight",
        "desc": "Magical darkness doesn't impede the devil's darkvision."
      },
      {
        "name": "Magic Resistance",
        "desc": "The devil has advantage on saving throws against spells and magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The devil makes three attacks: two claws and one bite."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 13 (2d8+4) cold damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 10 (2d6+4) cold damage."
      },
      {
        "name": "Wall of Ice (Recharge 6)",
        "desc": "The devil casts wall of ice, using Intelligence as the spellcasting ability."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The devil makes a Wisdom (Perception) check."
      },
      {
        "name": "Claw Attack",
        "desc": "The devil makes a claw attack."
      },
      {
        "name": "Teleport",
        "desc": "The devil magically teleports, along with any equipment it is wearing or carrying, up to 60 feet to an unoccupied space it can see."
      }
    ],
    "reactions": []
  },
  {
    "name": "Shadow Demon",
    "size": "Medium",
    "type": "fiend",
    "subtype": "demon",
    "alignment": "chaotic evil",
    "ac": 13,
    "acType": "",
    "hp": 66,
    "hpFormula": "12d8+12",
    "speed": "0 ft., fly 40 ft. (hover)",
    "str": 6,
    "dex": 16,
    "con": 13,
    "int": 14,
    "wis": 13,
    "cha": 14,
    "saves": "Dex +5",
    "skills": "Stealth +7",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "senses": "darkvision 120 ft., passive Perception 11",
    "languages": "Abyssal, telepathy 120 ft.",
    "cr": "4",
    "crNum": 4,
    "xp": 1100,
    "traits": [
      {
        "name": "Incorporeal Movement",
        "desc": "The demon can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."
      },
      {
        "name": "Shadows Step",
        "desc": "While in dim light or darkness, the demon can use a bonus action to become invisible until it attacks, casts a spell, is in bright light, or until its concentration breaks (as if concentrating on a spell)."
      }
    ],
    "actions": [
      {
        "name": "Claw",
        "desc": "Melee Spell Attack: +5 to hit, reach 5 ft., one creature. Hit: 10 (2d6+3) psychic damage, and the target must succeed on a DC 13 Strength saving throw or have disadvantage on attack rolls until the end of its next turn."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Lizardfolk",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "lizardfolk",
    "alignment": "neutral",
    "ac": 15,
    "acType": "natural armor",
    "hp": 22,
    "hpFormula": "4d8+4",
    "speed": "30 ft., swim 30 ft.",
    "str": 15,
    "dex": 10,
    "con": 13,
    "int": 7,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +3, Survival +5",
    "senses": "passive Perception 13",
    "languages": "Draconic",
    "cr": "1/2",
    "crNum": 0.5,
    "xp": 100,
    "traits": [
      {
        "name": "Hold Breath",
        "desc": "The lizardfolk can hold its breath for 15 minutes."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The lizardfolk makes two melee attacks, each one with a different weapon."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6+2) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4+2) slashing damage."
      },
      {
        "name": "Javelin",
        "desc": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 5 (1d6+2) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Roc",
    "size": "Gargantuan",
    "type": "monstrosity",
    "alignment": "unaligned",
    "ac": 15,
    "acType": "natural armor",
    "hp": 248,
    "hpFormula": "16d20+80",
    "speed": "20 ft., fly 120 ft.",
    "str": 28,
    "dex": 10,
    "con": 20,
    "int": 3,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +4",
    "senses": "passive Perception 14",
    "languages": "",
    "cr": "11",
    "crNum": 11,
    "xp": 7200,
    "traits": [
      {
        "name": "Keen Sight",
        "desc": "The roc has advantage on Wisdom checks that rely on sight."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The roc makes two attacks: one bite and one talons."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 27 (4d10+8) piercing damage."
      },
      {
        "name": "Talons",
        "desc": "Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 23 (4d8+8) slashing damage, and the target must succeed on a DC 19 Strength saving throw or be knocked prone."
      },
      {
        "name": "Beak",
        "desc": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 15 (2d8+8) piercing damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Shadow",
    "size": "Medium",
    "type": "undead",
    "alignment": "chaotic evil",
    "ac": 12,
    "acType": "",
    "hp": 16,
    "hpFormula": "3d8+3",
    "speed": "0 ft., fly 60 ft. (hover)",
    "str": 6,
    "dex": 14,
    "con": 13,
    "int": 6,
    "wis": 10,
    "cha": 8,
    "saves": "",
    "skills": "Stealth +4",
    "damageVulnerabilities": "radiant",
    "damageResistances": "acid, cold, fire, lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks",
    "damageImmunities": "necrotic, poison",
    "conditionImmunities": "charmed, exhaustion, frightened, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "",
    "cr": "1/2",
    "crNum": 0.5,
    "xp": 100,
    "traits": [
      {
        "name": "Amorphous",
        "desc": "The shadow can occupy another creature's space and vice versa."
      },
      {
        "name": "Shadow Stealth",
        "desc": "While in dim light or darkness, the shadow can use a bonus action to become invisible until it moves or acts."
      },
      {
        "name": "Sunlight Weakness",
        "desc": "While in sunlight, the shadow has disadvantage on attack rolls, ability checks, and saving throws."
      }
    ],
    "actions": [
      {
        "name": "Strength Drain",
        "desc": "Melee Spell Attack: +4 to hit, reach 5 ft., one creature. Hit: 9 (2d8) necrotic damage, and the target's Strength score is reduced by 1d4. The target dies if this reduces its Strength to 0. Otherwise, the reduction lasts until the target finishes a short or long rest."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Will-o'-Wisp",
    "size": "Tiny",
    "type": "undead",
    "alignment": "chaotic evil",
    "ac": 19,
    "acType": "",
    "hp": 22,
    "hpFormula": "5d4+10",
    "speed": "0 ft., fly 50 ft. (hover)",
    "str": 1,
    "dex": 28,
    "con": 14,
    "int": 13,
    "wis": 14,
    "cha": 11,
    "saves": "",
    "skills": "Perception +4",
    "damageImmunities": "lightning, poison",
    "conditionImmunities": "charmed, exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained",
    "senses": "darkvision 120 ft., passive Perception 14",
    "languages": "understands the languages of its creator",
    "cr": "2",
    "crNum": 2,
    "xp": 450,
    "traits": [
      {
        "name": "Consume Life",
        "desc": "As a bonus action, the will-o'-wisp can target one creature it can see within 5 feet of it that has 0 hit points and is still alive. The creature must make a DC 14 Constitution saving throw against this magic, taking 10 (3d6) necrotic damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Ephemeral",
        "desc": "The will-o'-wisp can't wear or carry anything."
      },
      {
        "name": "Incorporeal Movement",
        "desc": "The will-o'-wisp can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object."
      },
      {
        "name": "Variable Illumination",
        "desc": "The will-o'-wisp sheds bright light in a 5- to 20-foot radius and dim light for an additional number of feet equal to the chosen radius. The will-o'-wisp can change the radius as a bonus action."
      }
    ],
    "actions": [
      {
        "name": "Shock",
        "desc": "Melee Spell Attack: +4 to hit, reach 5 ft., one creature. Hit: 9 (2d8) lightning damage."
      },
      {
        "name": "Invisibility",
        "desc": "The will-o'-wisp and up to one creature it can see within 5 feet of it becomes invisible until the spell ends or until the will-o'-wisp or the other creature attacks or casts a spell."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  },
  {
    "name": "Zombie Ogre",
    "size": "Large",
    "type": "undead",
    "alignment": "unaligned",
    "ac": 8,
    "acType": "natural armor",
    "hp": 85,
    "hpFormula": "10d10+30",
    "speed": "30 ft.",
    "str": 19,
    "dex": 8,
    "con": 16,
    "int": 3,
    "wis": 6,
    "cha": 5,
    "saves": "Wis +1",
    "skills": "",
    "damageImmunities": "poison",
    "conditionImmunities": "charmed, exhaustion, frightened, poisoned",
    "senses": "darkvision 60 ft., passive Perception 8",
    "languages": "understands Common and Giant but can't speak",
    "cr": "2",
    "crNum": 2,
    "xp": 450,
    "traits": [
      {
        "name": "Undead Fortitude",
        "desc": "If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw against a DC equal to the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead."
      }
    ],
    "actions": [
      {
        "name": "Morningstar",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one creature. Hit: 13 (2d8+4) bludgeoning damage."
      }
    ],
    "legendaryActions": null,
    "reactions": []
  }
];
