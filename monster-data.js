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
        "desc": "The aboleth targets one creature it can see within 30 feet. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth."
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
    "damageVulnerabilities": "",
    "xp": 5900
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
    "cr": "0.25",
    "crNum": 0.25,
    "traits": [
      {
        "name": "Spellcasting",
        "desc": "The acolyte is a 1st-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). The acolyte has the following cleric spells prepared: Cantrips (at will): light, sacred flame, thaumaturgy; 1st level (3 slots): cure wounds, guiding bolt, sanctuary"
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
    "damageVulnerabilities": "",
    "xp": 50
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
        "desc": "The dragon beats its wings. Each creature within 10 feet must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "acid",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 11500
  },
  {
    "size": "Huge",
    "type": "dragon",
    "alignment": "lawful evil",
    "ac": 19,
    "acType": "natural armor",
    "hp": 195,
    "hpFormula": "17d12+85",
    "speed": "40 ft., fly 80 ft.",
    "str": 25,
    "dex": 10,
    "con": 23,
    "int": 16,
    "wis": 15,
    "cha": 19,
    "saves": "Dex +4, Con +10, Wis +6, Cha +8",
    "skills": "Insight +6, Perception +10",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 20",
    "languages": "Draconic",
    "cr": "16",
    "crNum": 16,
    "damageImmunities": "lightning",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
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
        "desc": "Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 90-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 21 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 15000,
    "name": "Adult Blue Dragon"
  },
  {
    "size": "Huge",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 18,
    "acType": "natural armor",
    "hp": 172,
    "hpFormula": "15d12+75",
    "speed": "40 ft., fly 80 ft., burrow 30 ft.",
    "str": 23,
    "dex": 10,
    "con": 21,
    "int": 16,
    "wis": 15,
    "cha": 17,
    "saves": "Dex +3, Con +8, Wis +5, Cha +6",
    "skills": "History +6, Insight +5, Investigation +6, Perception +8",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 18",
    "languages": "Draconic",
    "cr": "13",
    "crNum": 13,
    "damageImmunities": "fire",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
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
        "desc": "Melee Weapon Attack: +10 to hit, reach 15 ft., one target. Hit: 15 (2d10 + 6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 11 (2d6 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +10 to hit, reach 15 ft., one target. Hit: 13 (2d8 + 6) bludgeoning damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 55 (10d10) fire damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Sleep Breath (Recharge 5-6)",
        "desc": "The dragon exhales sleep gas in a 60-foot cone. Each creature in that area must succeed on a DC 16 Constitution saving throw or fall unconscious for 10 minutes."
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
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 18 Dexterity saving throw or take 11 (2d6 + 6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 10000,
    "name": "Adult Brass Dragon"
  },
  {
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
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 20",
    "languages": "Draconic",
    "cr": "15",
    "crNum": 15,
    "damageImmunities": "lightning",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
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
        "desc": "Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 100-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Repulsion Breath (Recharge 5-6)",
        "desc": "The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 18 Strength saving throw or be pushed 60 feet away from the dragon."
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
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 21 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 13000,
    "name": "Adult Bronze Dragon"
  },
  {
    "name": "Adult Copper Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 18,
    "acType": "natural armor",
    "hp": 180,
    "hpFormula": "19d12+76",
    "speed": "40 ft., climb 40 ft., fly 80 ft.",
    "str": 23,
    "dex": 12,
    "con": 19,
    "int": 18,
    "wis": 15,
    "cha": 16,
    "saves": "Dex +4, Con +7, Wis +5, Cha +6",
    "skills": "Deception +6, Insight +5, Investigation +7, Perception +8, Stealth +4",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 18",
    "languages": "Draconic",
    "cr": "12",
    "crNum": 12,
    "damageImmunities": "acid",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
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
        "desc": "Melee Weapon Attack: +10 to hit, reach 15 ft., one target. Hit: 15 (2d10 + 6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 11 (2d6 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +10 to hit, reach 15 ft., one target. Hit: 13 (2d8 + 6) bludgeoning damage."
      },
      {
        "name": "Acid Breath (Recharge 5-6)",
        "desc": "The dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 15 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Slowing Breath (Recharge 5-6)",
        "desc": "The dragon exhales gas in a 60-foot cone. Each creature in that area must succeed on a DC 15 Constitution saving throw or be slowed for 1 minute."
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
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 18 Dexterity saving throw or take 11 (2d6 + 6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 8000
  },
  {
    "name": "Adult Gold Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "lawful good",
    "ac": 19,
    "acType": "natural armor",
    "hp": 212,
    "hpFormula": "17d12+102",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 27,
    "dex": 10,
    "con": 25,
    "int": 16,
    "wis": 15,
    "cha": 19,
    "saves": "Dex +5, Con +12, Wis +7, Cha +9",
    "skills": "Insight +7, Perception +11",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 21",
    "languages": "Draconic",
    "cr": "17",
    "crNum": 17,
    "damageImmunities": "fire",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
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
        "desc": "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 20 Dexterity saving throw, taking 99 (18d10) fire damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Weakening Breath (Recharge 5-6)",
        "desc": "The dragon exhales gas in a 90-foot cone. Each creature in that area must succeed on a DC 20 Strength saving throw or have disadvantage on Strength checks and Strength saving throws for 1 minute."
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
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 18000
  },
  {
    "name": "Adult Green Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "lawful evil",
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
    "skills": "Deception +7, Insight +6, Perception +10",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 20",
    "languages": "Draconic",
    "cr": "15",
    "crNum": 15,
    "damageImmunities": "poison",
    "damageResistances": "",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": "",
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
        "desc": "Melee Weapon Attack: +10 to hit, reach 15 ft., one target. Hit: 16 (2d10 + 6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +10 to hit, reach 10 ft., one target. Hit: 13 (2d6 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +10 to hit, reach 15 ft., one target. Hit: 14 (2d8 + 6) bludgeoning damage."
      },
      {
        "name": "Poison Breath (Recharge 5-6)",
        "desc": "The dragon exhales poisonous gas in a 60-foot cone. Each creature in that area must make a DC 17 Constitution saving throw, taking 66 (12d10) poison damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 18 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 13000
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
    "speed": "40 ft., fly 80 ft.",
    "str": 27,
    "dex": 10,
    "con": 25,
    "int": 16,
    "wis": 13,
    "cha": 21,
    "saves": "Dex +5, Con +12, Wis +6, Cha +10",
    "skills": "Insight +6, Perception +10",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 20",
    "languages": "Draconic",
    "cr": "17",
    "crNum": 17,
    "damageImmunities": "fire",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
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
        "desc": "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 20 Dexterity saving throw, taking 126 (23d10) fire damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 18000
  },
  {
    "name": "Adult Silver Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "lawful good",
    "ac": 19,
    "acType": "natural armor",
    "hp": 243,
    "hpFormula": "17d12+136",
    "speed": "40 ft., fly 80 ft.",
    "str": 27,
    "dex": 10,
    "con": 25,
    "int": 16,
    "wis": 13,
    "cha": 21,
    "saves": "Dex +5, Con +12, Wis +6, Cha +10",
    "skills": "Arcana +7, Insight +7, Perception +10",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 20",
    "languages": "Draconic",
    "cr": "16",
    "crNum": 16,
    "damageImmunities": "cold",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
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
        "desc": "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 20 Constitution saving throw, taking 110 (20d10) cold damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Paralyzing Breath (Recharge 5-6)",
        "desc": "The dragon exhales paralyzing gas in a 60-foot cone. Each creature in that area must succeed on a DC 20 Constitution saving throw or be paralyzed for 1 minute."
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
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 15000
  },
  {
    "name": "Adult White Dragon",
    "size": "Huge",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 200,
    "hpFormula": "16d12+112",
    "speed": "40 ft., burrow 30 ft., fly 80 ft., swim 40 ft.",
    "str": 22,
    "dex": 10,
    "con": 22,
    "int": 8,
    "wis": 12,
    "cha": 12,
    "saves": "Dex +4, Con +10, Wis +5",
    "skills": "Perception +9",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 19",
    "languages": "Draconic",
    "cr": "20",
    "crNum": 20,
    "damageImmunities": "cold",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
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
        "desc": "Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 16 (2d10 + 6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 13 (2d6 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 14 (2d8 + 6) bludgeoning damage."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 110 (20d10) cold damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 10 feet of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 27000
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
    "dex": 10,
    "con": 25,
    "int": 16,
    "wis": 15,
    "cha": 19,
    "saves": "Dex +6, Con +13, Wis +9, Cha +11",
    "skills": "Perception +13",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 23",
    "languages": "Draconic",
    "cr": "21",
    "crNum": 21,
    "damageImmunities": "acid",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
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
        "desc": "The dragon can use its Frightful Presence and then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice within 120 feet that is aware of the dragon must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 21 Dexterity saving throw, taking 110 (20d10) lightning damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 33000
  },
  {
    "name": "Ancient Blue Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "lawful evil",
    "ac": 22,
    "acType": "natural armor",
    "hp": 367,
    "hpFormula": "21d20+147",
    "speed": "40 ft., fly 80 ft.",
    "str": 29,
    "dex": 10,
    "con": 25,
    "int": 18,
    "wis": 17,
    "cha": 21,
    "saves": "Dex +6, Con +13, Wis +10, Cha +12",
    "skills": "Insight +10, Perception +14",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 24",
    "languages": "Draconic",
    "cr": "23",
    "crNum": 23,
    "damageImmunities": "lightning",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence and then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice within 120 feet that is aware of the dragon must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 110 (20d10) lightning damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 33000
  },
  {
    "name": "Ancient Brass Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 21,
    "acType": "natural armor",
    "hp": 330,
    "hpFormula": "20d20+140",
    "speed": "40 ft., fly 80 ft., burrow 40 ft.",
    "str": 27,
    "dex": 10,
    "con": 23,
    "int": 18,
    "wis": 17,
    "cha": 19,
    "saves": "Dex +6, Con +13, Wis +10, Cha +11",
    "skills": "History +10, Insight +10, Investigation +10, Perception +13",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 23",
    "languages": "Draconic",
    "cr": "20",
    "crNum": 20,
    "damageImmunities": "fire",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence and then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 17 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 13 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +13 to hit, reach 20 ft., one target. Hit: 15 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice within 120 feet that is aware of the dragon must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 90-foot cone that is 10 feet wide. Each creature in that area must make a DC 22 Dexterity saving throw, taking  fire damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 20 Dexterity saving throw or take 13 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 24500
  },
  {
    "name": "Ancient Bronze Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 22,
    "acType": "natural armor",
    "hp": 402,
    "hpFormula": "23d20+161",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 29,
    "dex": 10,
    "con": 27,
    "int": 18,
    "wis": 17,
    "cha": 19,
    "saves": "Dex +6, Con +15, Wis +10, Cha +11",
    "skills": "Insight +10, Perception +15",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 25",
    "languages": "Draconic",
    "cr": "22",
    "crNum": 22,
    "damageImmunities": "lightning",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence and then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 18 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 14 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +14 to hit, reach 20 ft., one target. Hit: 16 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice within 120 feet that is aware of the dragon must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Repulsion Breath (Recharge 5-6)",
        "desc": "The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 23 Strength saving throw. On a failed save, the creature is pushed 60 feet away from the dragon."
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
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 41000
  },
  {
    "name": "Ancient Copper Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 21,
    "acType": "natural armor",
    "hp": 308,
    "hpFormula": "19d20+133",
    "speed": "40 ft., climb 40 ft., fly 80 ft.",
    "str": 27,
    "dex": 12,
    "con": 23,
    "int": 20,
    "wis": 17,
    "cha": 18,
    "saves": "Dex +7, Con +13, Wis +10, Cha +11",
    "skills": "Deception +11, Insight +10, Investigation +11, Perception +15, Stealth +7",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 25",
    "languages": "Draconic",
    "cr": "21",
    "crNum": 21,
    "damageImmunities": "acid",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence and then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 17 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 13 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +13 to hit, reach 20 ft., one target. Hit: 15 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice within 120 feet that is aware of the dragon must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Acid Breath (Recharge 5-6)",
        "desc": "The dragon exhales acid in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 88 (16d10) acid damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 20 Dexterity saving throw or take 13 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 33000
  },
  {
    "name": "Ancient Gold Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "lawful good",
    "ac": 22,
    "acType": "natural armor",
    "hp": 546,
    "hpFormula": "28d20+280",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 29,
    "dex": 10,
    "con": 29,
    "int": 18,
    "wis": 17,
    "cha": 23,
    "saves": "Dex +6, Con +16, Wis +10, Cha +13",
    "skills": "Insight +10, Perception +16",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 26",
    "languages": "Draconic",
    "cr": "24",
    "crNum": 24,
    "damageImmunities": "fire",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence and then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice within 120 feet that is aware of the dragon must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 90-foot cone that is 10 feet wide. Each creature in that area must make a DC 22 Dexterity saving throw, taking 99 (18d10) fire damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 62000
  },
  {
    "name": "Ancient Green Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "lawful evil",
    "ac": 21,
    "acType": "natural armor",
    "hp": 385,
    "hpFormula": "22d20+154",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 27,
    "dex": 12,
    "con": 25,
    "int": 20,
    "wis": 17,
    "cha": 19,
    "saves": "Dex +7, Con +14, Wis +10, Cha +11",
    "skills": "Deception +11, Insight +10, Perception +15",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 25",
    "languages": "Draconic",
    "cr": "22",
    "crNum": 22,
    "damageImmunities": "poison",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence and then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +14 to hit, reach 15 ft., one target. Hit: 18 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +14 to hit, reach 10 ft., one target. Hit: 14 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +14 to hit, reach 20 ft., one target. Hit: 16 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice within 120 feet that is aware of the dragon must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Poison Breath (Recharge 5-6)",
        "desc": "The dragon exhales poison in a 120-foot cone that is 10 feet wide. Each creature in that area must make a DC 22 Dexterity saving throw, taking 88 (16d10) poison damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 21 Dexterity saving throw or take 14 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 41000
  },
  {
    "name": "Ancient Red Dragon",
    "size": "Gargantuan",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 22,
    "acType": "natural armor",
    "hp": 546,
    "hpFormula": "28d20+280",
    "speed": "40 ft., fly 80 ft.",
    "str": 30,
    "dex": 10,
    "con": 29,
    "int": 18,
    "wis": 15,
    "cha": 23,
    "saves": "Dex +6, Con +16, Wis +9, Cha +13",
    "skills": "Insight +9, Perception +15",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 25",
    "languages": "Draconic",
    "cr": "24",
    "crNum": 24,
    "damageImmunities": "fire",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence and then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice within 120 feet that is aware of the dragon must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 90-foot cone that is 10 feet wide. Each creature in that area must make a DC 22 Dexterity saving throw, taking 126 (23d10) fire damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 62000
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
    "str": 27,
    "dex": 10,
    "con": 25,
    "int": 16,
    "wis": 13,
    "cha": 23,
    "saves": "Dex +6, Con +14, Wis +8, Cha +13",
    "skills": "Arcana +9, Insight +8, Perception +13",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 23",
    "languages": "Draconic",
    "cr": "23",
    "crNum": 23,
    "damageImmunities": "cold",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence and then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +15 to hit, reach 15 ft., one target. Hit: 19 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +15 to hit, reach 10 ft., one target. Hit: 15 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +15 to hit, reach 20 ft., one target. Hit: 17 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice within 120 feet that is aware of the dragon must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The dragon exhales cold in a 120-foot cone that is 10 feet wide. Each creature in that area must make a DC 22 Dexterity saving throw, taking 88 (16d10) cold damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 52500
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
    "saves": "Dex +5, Con +15, Wis +6",
    "skills": "Perception +11",
    "senses": "blindsight 60 ft., darkvision 120 ft., passive Perception 21",
    "languages": "Draconic",
    "cr": "20",
    "crNum": 20,
    "damageImmunities": "cold",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
      {
        "name": "Legendary Resistance (3/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      },
      {
        "name": "Amphibious",
        "desc": "The dragon can breathe air and water."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The dragon can use its Frightful Presence and then makes three attacks: one bite and two claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +13 to hit, reach 15 ft., one target. Hit: 17 (2d10 + 8) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 13 (2d6 + 8) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +13 to hit, reach 20 ft., one target. Hit: 15 (2d8 + 8) bludgeoning damage."
      },
      {
        "name": "Frightful Presence",
        "desc": "Each creature of the dragon's choice within 120 feet that is aware of the dragon must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The dragon exhales cold in a 90-foot cone that is 10 feet wide. Each creature in that area must make a DC 22 Dexterity saving throw, taking 110 (20d10) cold damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 15 feet of the dragon must succeed on a DC 20 Dexterity saving throw or take 13 (2d6 + 8) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 20000
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
    "speed": "30 ft.",
    "str": 14,
    "dex": 11,
    "con": 13,
    "int": 1,
    "wis": 3,
    "cha": 1,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 6",
    "languages": "understands commands given in any language but can't speak",
    "cr": "1",
    "crNum": 1,
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "desc": "The armor has disadvantage on saving throws against spells and magical effects."
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
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "poison, psychic",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": "",
    "xp": 200
  },
  {
    "name": "Ape",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 19,
    "hpFormula": "3d8+3",
    "speed": "30 ft., climb 30 ft.",
    "str": 16,
    "dex": 14,
    "con": 12,
    "int": 6,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Athletics +5, Perception +3",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "0.5",
    "crNum": 0.5,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The ape makes two fist attacks."
      },
      {
        "name": "Fist",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) bludgeoning damage."
      },
      {
        "name": "Rock",
        "desc": "Ranged Weapon Attack: +5 to hit, range 25/50 ft., one target. Hit: 6 (1d6 + 3) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 100
  },
  {
    "name": "Baboon",
    "size": "Small",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 3,
    "hpFormula": "1d6",
    "speed": "30 ft., climb 30 ft.",
    "str": 12,
    "dex": 14,
    "con": 11,
    "int": 3,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 11",
    "languages": "",
    "cr": "0.125",
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 25
  },
  {
    "name": "Badger",
    "size": "Small",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "",
    "hp": 3,
    "hpFormula": "1d6",
    "speed": "20 ft., burrow 5 ft.",
    "str": 10,
    "dex": 11,
    "con": 12,
    "int": 2,
    "wis": 12,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "darkvision 30 ft., passive Perception 11",
    "languages": "",
    "cr": "0.125",
    "crNum": 0.125,
    "traits": [
      {
        "name": "Keen Smell",
        "desc": "The badger has advantage on Wisdom (Perception) checks that rely on smell."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 25
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
    "hpFormula": "3d8+3",
    "speed": "30 ft.",
    "str": 15,
    "dex": 16,
    "con": 12,
    "int": 14,
    "wis": 11,
    "cha": 10,
    "saves": "",
    "skills": "Deception +2, Insight +2, Investigation +4, Perception +2, Sleight of Hand +5, Stealth +5",
    "senses": "passive Perception 12",
    "languages": "Thieves' cant plus any one language",
    "cr": "0.125",
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
    "damageVulnerabilities": "",
    "xp": 25
  },
  {
    "name": "Bandit Captain",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any non-good alignment",
    "ac": 15,
    "acType": "studded leather armor",
    "hp": 65,
    "hpFormula": "10d8+20",
    "speed": "30 ft.",
    "str": 15,
    "dex": 16,
    "con": 14,
    "int": 14,
    "wis": 11,
    "cha": 14,
    "saves": "Dex +3, Wis +2",
    "skills": "Acrobatics +3, Deception +3, Insight +2, Intimidation +3, Investigation +3, Perception +2, Stealth +4",
    "senses": "passive Perception 12",
    "languages": "Thieves' cant plus any one language",
    "cr": "2",
    "crNum": 2,
    "traits": [
      {
        "name": "Parry",
        "desc": "The captain adds 2 to its AC against one melee attack that would hit it this turn."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The captain makes three Scimitar attacks."
      },
      {
        "name": "Scimitar",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      }
    ],
    "legendaryActions": [
      {
        "name": "Parry",
        "desc": "The captain adds 2 to its AC against one melee attack."
      },
      {
        "name": "Scimitar Attack",
        "desc": "The captain makes one Scimitar attack."
      }
    ],
    "reactions": [
      {
        "name": "Parry and Riposte",
        "desc": "The captain adds 2 to its AC against one melee attack that would hit it this turn. If this causes the attack to miss, the captain can make one melee weapon attack against the attacker."
      }
    ],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 450
  },
  {
    "name": "Bat",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 1,
    "hpFormula": "1d4-1",
    "speed": "0 ft., fly 30 ft.",
    "str": 2,
    "dex": 15,
    "con": 10,
    "int": 2,
    "wis": 12,
    "cha": 4,
    "saves": "",
    "skills": "Perception +3",
    "senses": "blindsight 60 ft., passive Perception 13",
    "languages": "",
    "cr": "0",
    "crNum": 0,
    "traits": [
      {
        "name": "Echolocation",
        "desc": "The bat can't use its blindsight while deafened."
      }
    ],
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
    "damageVulnerabilities": "",
    "xp": 0
  },
  {
    "name": "Beholder",
    "size": "Large",
    "type": "aberration",
    "alignment": "chaotic evil",
    "ac": 17,
    "acType": "natural armor",
    "hp": 180,
    "hpFormula": "19d10+76",
    "speed": "0 ft., fly 20 ft. (hover)",
    "str": 10,
    "dex": 14,
    "con": 18,
    "int": 17,
    "wis": 16,
    "cha": 17,
    "saves": "Int +6, Wis +6, Cha +6",
    "skills": "Perception +10",
    "senses": "darkvision 120 ft., passive Perception 20",
    "languages": "Deep Speech, Undercommon",
    "cr": "13",
    "crNum": 13,
    "traits": [
      {
        "name": "Antimagic Cone",
        "desc": "The beholder's central eye creates an area of antimagic in a 150-foot cone."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 16 (4d6 + 2) piercing damage."
      },
      {
        "name": "Charm Ray",
        "desc": "The beholder casts charm person at will (save DC 16). While the target is charmed by the beholder, the beholder has advantage on any attack roll against it."
      },
      {
        "name": "Paralyzing Ray",
        "desc": "If the target can see the beholder, the target must succeed on a DC 16 Dexterity saving throw or be paralyzed for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      },
      {
        "name": "Fear Ray",
        "desc": "If the target can see the beholder, the target must succeed on a DC 16 Wisdom saving throw or be frightened for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      },
      {
        "name": "Slowing Ray",
        "desc": "If the target can see the beholder, the target must succeed on a DC 16 Dexterity saving throw. On a failure, the target's speed is halved for 1 minute. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      },
      {
        "name": "Enervation Ray",
        "desc": "The target must make a DC 16 Constitution saving throw, taking 36 (8d8) necrotic damage on a failure, or half as much on a success."
      },
      {
        "name": "Telekinetic Ray",
        "desc": "If the target is a creature, it must succeed on a DC 16 Strength saving throw or be moved up to 5 feet in a direction of the beholder's choice. This movement does not provoke opportunity attacks."
      },
      {
        "name": "Sleep Ray",
        "desc": "If the target can see the beholder, the target must succeed on a DC 16 Wisdom saving throw or fall asleep and drop what it's holding. The target stays asleep until someone uses an action to shake the sleeper awake, or until the target takes damage."
      },
      {
        "name": "Petrification Ray",
        "desc": "If the target can see the beholder, the target must make a DC 16 Dexterity saving throw. On a failure, the creature begins to turn to stone and is restrained. It must repeat the save at the end of its next turn. On a success, the effect ends. If the creature fails the save by 5 or more, it is instantly petrified."
      },
      {
        "name": "Disintegration Ray",
        "desc": "If the target can see the beholder, the target must succeed on a DC 16 Dexterity saving throw, taking 45 (10d8) force damage on a failure, or half as much on a success. If the target is reduced to 0 hit points by this damage, it is disintegrated."
      },
      {
        "name": "Death Ray",
        "desc": "If the target can see the beholder, the target must succeed on a DC 16 Dexterity saving throw or take 55 (10d10) necrotic damage. The target dies if this damage reduces it to 0 hit points."
      }
    ],
    "legendaryActions": [
      {
        "name": "Eye Ray",
        "desc": "The beholder uses one eye ray."
      }
    ],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 10000
  },
  {
    "name": "Berserker",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any chaotic alignment",
    "ac": 13,
    "acType": "hide armor",
    "hp": 67,
    "hpFormula": "9d8+27",
    "speed": "30 ft.",
    "str": 16,
    "dex": 12,
    "con": 16,
    "int": 9,
    "wis": 11,
    "cha": 9,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "any one language (usually Common)",
    "cr": "2",
    "crNum": 2,
    "traits": [
      {
        "name": "Reckless Attack",
        "desc": "At the start of its turn, the berserker can gain advantage on all melee weapon attack rolls during that turn, but attack rolls against it have advantage until the start of its next turn."
      },
      {
        "name": "Unarmored Defense",
        "desc": "While the berserker is not wearing armor, its AC includes its Constitution modifier."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The berserker makes two melee attacks."
      },
      {
        "name": "Greataxe",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12 + 3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 450
  },
  {
    "name": "Black Bear",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "",
    "hp": 34,
    "hpFormula": "4d10+12",
    "speed": "40 ft., climb 30 ft.",
    "str": 15,
    "dex": 10,
    "con": 16,
    "int": 2,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +3",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "1",
    "crNum": 1,
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
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 2) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 9 (2d4 + 2) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 200
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
    "cr": "0.125",
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
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 25
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
    "speed": "30 ft., burrow 15 ft., fly 60 ft.",
    "str": 19,
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
    "crNum": 3,
    "traits": [
      {
        "name": "Legendary Resistance (1/Day)",
        "desc": "If the dragon fails a saving throw, it can choose to succeed instead."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 9 (1d8 + 4) piercing damage plus 2 (1d4) lightning damage."
      },
      {
        "name": "Lightning Breath (Recharge 6)",
        "desc": "The dragon exhales lightning in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much on a successful one."
      }
    ],
    "legendaryActions": [
      {
        "name": "Detect",
        "desc": "The dragon makes a Wisdom (Perception) check."
      },
      {
        "name": "Tail",
        "desc": "The dragon makes a tail attack."
      }
    ],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "lightning",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 700
  },
  {
    "name": "Boar",
    "size": "Medium",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "",
    "hp": 11,
    "hpFormula": "2d8+2",
    "speed": "40 ft.",
    "str": 13,
    "dex": 11,
    "con": 12,
    "int": 2,
    "wis": 9,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 9",
    "languages": "",
    "cr": "0.25",
    "crNum": 0.25,
    "traits": [
      {
        "name": "Relentless (Recharge 5-6)",
        "desc": "If the boar takes 7 or fewer damage, it can use a reaction to move up to its speed toward a hostile creature."
      }
    ],
    "actions": [
      {
        "name": "Tusk",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 50
  },
  {
    "name": "Brass Dragon Wyrmling",
    "size": "Medium",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 16,
    "acType": "natural armor",
    "hp": 41,
    "hpFormula": "5d8+10",
    "speed": "30 ft., fly 60 ft., burrow 20 ft.",
    "str": 15,
    "dex": 14,
    "con": 13,
    "int": 11,
    "wis": 11,
    "cha": 13,
    "saves": "Dex +4, Con +2, Wis +2, Cha +3",
    "skills": "Perception +4, Stealth +2",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 14",
    "languages": "Draconic",
    "cr": "1",
    "crNum": 1,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 2) piercing damage."
      },
      {
        "name": "Fire Breath (Recharge 6)",
        "desc": "The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 11 Dexterity saving throw, taking 22 (4d10) fire damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Sleep Breath (Recharge 6)",
        "desc": "The dragon exhales sleep gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constitution saving throw or fall unconscious for 1 minute."
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
      }
    ],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "fire",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 200
  },
  {
    "name": "Bronze Dragon Wyrmling",
    "size": "Medium",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 17,
    "acType": "natural armor",
    "hp": 52,
    "hpFormula": "8d8+16",
    "speed": "30 ft., fly 60 ft., swim 30 ft.",
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
    "cr": "2",
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
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 3) piercing damage."
      },
      {
        "name": "Lightning Breath (Recharge 6)",
        "desc": "The dragon exhales lightning in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 16 (3d10) lightning damage on a failed save, or half as much on a successful one."
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
      }
    ],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "lightning",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 450
  },
  {
    "name": "Brown Bear",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "",
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
    "skills": "Perception +4",
    "senses": "passive Perception 14",
    "languages": "",
    "cr": "1",
    "crNum": 1,
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
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 8 (1d8 + 4) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 200
  },
  {
    "name": "Camel",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 9,
    "acType": "",
    "hp": 15,
    "hpFormula": "2d10+4",
    "speed": "50 ft.",
    "str": 16,
    "dex": 8,
    "con": 14,
    "int": 2,
    "wis": 11,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "0.25",
    "crNum": 0.25,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) bludgeoning damage."
      },
      {
        "name": "Spit",
        "desc": "Ranged Weapon Attack: +5 to hit, range 10 ft., one target. Hit: 5 (1d4 + 3) acid damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 50
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
    "con": 10,
    "int": 3,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Perception +3, Stealth +4",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "0",
    "crNum": 0,
    "traits": [
      {
        "name": "Keen Smell",
        "desc": "The cat has advantage on Wisdom (Perception) checks that rely on smell."
      }
    ],
    "actions": [
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +0 to hit, reach 5 ft., one target. Hit: 1 (1d4 - 1) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 0
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
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "understands Deep Speech but can't speak",
    "cr": "3",
    "crNum": 3,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The chuul can breathe air and water."
      },
      {
        "name": "Sense Magic",
        "desc": "The chuul senses magic within 120 feet at will."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The chuul makes two pincer attacks."
      },
      {
        "name": "Pincer",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 13 (2d8 + 4) slashing damage. The target is grappled (escape DC 14)."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 700
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
    "dex": 9,
    "con": 18,
    "int": 3,
    "wis": 8,
    "cha": 1,
    "saves": "Wis +1",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 9",
    "languages": "understands the languages of its creator but can't speak",
    "cr": "9",
    "crNum": 9,
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "desc": "The golem has disadvantage on saving throws against spells and magical effects."
      },
      {
        "name": "Berserk",
        "desc": "Whenever the golem starts its turn, the DM rolls a d6. On a 1, the golem can't be controlled."
      },
      {
        "name": "Immutable Form",
        "desc": "The golem is immune to any spell or effect that would alter its form."
      },
      {
        "name": "Magic Resistance",
        "desc": "The golem has advantage on saving throws against spells and magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The golem makes two slam attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 5) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "acid, poison, psychic",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": "",
    "xp": 5000
  },
  {
    "name": "Cloaker",
    "size": "Large",
    "type": "aberration",
    "alignment": "chaotic neutral",
    "ac": 14,
    "acType": "natural armor",
    "hp": 78,
    "hpFormula": "12d10+24",
    "speed": "0 ft., fly 40 ft.",
    "str": 17,
    "dex": 15,
    "con": 12,
    "int": 13,
    "wis": 12,
    "cha": 14,
    "saves": "Wis +4",
    "skills": "Stealth +5",
    "senses": "darkvision 60 ft., passive Perception 11",
    "languages": "Deep Speech",
    "cr": "8",
    "crNum": 8,
    "traits": [
      {
        "name": "Damage Transfer",
        "desc": "While attached to a creature, the cloaker takes only half damage."
      },
      {
        "name": "False Appearance",
        "desc": "While motionless, the cloaker is indistinguishable from a dark leather cloak."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 6 (1d6 + 3) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 3900
  },
  {
    "name": "Commoner",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 10,
    "acType": "",
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
    "damageVulnerabilities": "",
    "xp": 0
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
    "con": 12,
    "int": 1,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "Perception +2",
    "senses": "blindsight 10 ft., passive Perception 12",
    "languages": "",
    "cr": "0.25",
    "crNum": 0.25,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) piercing damage."
      },
      {
        "name": "Constrict",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 6 (1d8 + 2) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 50
  },
  {
    "name": "Copper Dragon Wyrmling",
    "size": "Medium",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 16,
    "acType": "natural armor",
    "hp": 22,
    "hpFormula": "4d8+4",
    "speed": "30 ft., climb 30 ft., fly 60 ft.",
    "str": 13,
    "dex": 14,
    "con": 12,
    "int": 14,
    "wis": 11,
    "cha": 13,
    "saves": "Dex +4, Con +2, Int +4, Wis +2, Cha +3",
    "skills": "Insight +2, Perception +4, Stealth +4",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 14",
    "languages": "Draconic",
    "cr": "1",
    "crNum": 1,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 1) piercing damage."
      },
      {
        "name": "Breath Weapons (Recharge 6)",
        "desc": "The dragon uses one of the following breath weapons: Acid Breath. The dragon exhales acid in a 15-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 18 (4d8) acid damage on a failed save, or half as much on a successful one. Slowing Breath. The dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constitution saving throw."
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
      }
    ],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "acid",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 200
  },
  {
    "name": "Crab",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 2,
    "hpFormula": "1d4",
    "speed": "30 ft., swim 30 ft.",
    "str": 3,
    "dex": 15,
    "con": 11,
    "int": 1,
    "wis": 9,
    "cha": 3,
    "saves": "",
    "skills": "Stealth +4",
    "senses": "blindsight 30 ft., passive Perception 9",
    "languages": "",
    "cr": "0.125",
    "crNum": 0.125,
    "traits": [],
    "actions": [
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
    "damageVulnerabilities": "",
    "xp": 25
  },
  {
    "name": "Crocodile",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
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
    "cr": "0.5",
    "crNum": 0.5,
    "traits": [
      {
        "name": "Hold Breath",
        "desc": "The crocodile can hold its breath for 15 minutes."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (1d10 + 2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 100
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
    "dex": 13,
    "con": 12,
    "int": 12,
    "wis": 14,
    "cha": 14,
    "saves": "Wis +4",
    "skills": "Deception +4, Insight +4, Persuasion +4, Religion +3",
    "senses": "passive Perception 12",
    "languages": "any one language (usually Common)",
    "cr": "2",
    "crNum": 2,
    "traits": [
      {
        "name": "Spellcasting",
        "desc": "The fanatic is a 4th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks)."
      }
    ],
    "actions": [
      {
        "name": "Dagger",
        "desc": "Melee or Ranged Weapon Attack: +2 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 2 (1d4) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 450
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
    "speed": "50 ft.",
    "str": 11,
    "dex": 16,
    "con": 11,
    "int": 2,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "Perception +3",
    "senses": "passive Perception 13",
    "languages": "",
    "cr": "0",
    "crNum": 0,
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
    "damageVulnerabilities": "",
    "xp": 0
  },
  {
    "name": "Dire Wolf",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "",
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
    "skills": "Perception +4, Stealth +4",
    "senses": "passive Perception 14",
    "languages": "",
    "cr": "1",
    "crNum": 1,
    "traits": [
      {
        "name": "Keen Hearing and Smell",
        "desc": "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
      },
      {
        "name": "Pack Tactics",
        "desc": "The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 feet of the target."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 200
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
    "con": 12,
    "int": 2,
    "wis": 11,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "0.25",
    "crNum": 0.25,
    "traits": [],
    "actions": [
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 9 (2d4 + 4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 50
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
    "cha": 8,
    "saves": "",
    "skills": "Perception +4",
    "senses": "passive Perception 14",
    "languages": "",
    "cr": "0",
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
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 0
  },
  {
    "name": "Elephant",
    "size": "Huge",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "",
    "hp": 76,
    "hpFormula": "8d12+16",
    "speed": "40 ft.",
    "str": 22,
    "dex": 9,
    "con": 15,
    "int": 3,
    "wis": 11,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "4",
    "crNum": 4,
    "traits": [
      {
        "name": "Trampling Charge",
        "desc": "If the elephant moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that creature must succeed on a DC 18 Strength saving throw or be knocked prone."
      }
    ],
    "actions": [
      {
        "name": "Gore",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 19 (3d8 + 6) piercing damage."
      },
      {
        "name": "Stomp",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 14 (2d6 + 6) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 1100
  },
  {
    "name": "Elk",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "",
    "hp": 19,
    "hpFormula": "3d10+3",
    "speed": "40 ft.",
    "str": 16,
    "dex": 10,
    "con": 12,
    "int": 2,
    "wis": 11,
    "cha": 6,
    "saves": "",
    "skills": "Perception +2",
    "senses": "passive Perception 12",
    "languages": "",
    "cr": "0.25",
    "crNum": 0.25,
    "traits": [],
    "actions": [
      {
        "name": "Ram",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 3) bludgeoning damage."
      },
      {
        "name": "Hooves",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 8 (2d4 + 3) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 50
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
    "int": 6,
    "wis": 10,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "understands the languages of its creator but can't speak",
    "cr": "5",
    "crNum": 5,
    "traits": [
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
        "desc": "The golem has advantage on saving throws against spells and magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The golem makes two slam attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "lightning, poison, psychic",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": "",
    "xp": 1800
  },
  {
    "name": "Flying Snake",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 14,
    "acType": "",
    "hp": 5,
    "hpFormula": "2d4",
    "speed": "30 ft., fly 60 ft.",
    "str": 4,
    "dex": 16,
    "con": 11,
    "int": 1,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "",
    "senses": "blindsight 60 ft., passive Perception 10",
    "languages": "",
    "cr": "0.125",
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage plus 2 (1d4) poison damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 25
  },
  {
    "name": "Flying Sword",
    "size": "Small",
    "type": "construct",
    "alignment": "unaligned",
    "ac": 17,
    "acType": "",
    "hp": 17,
    "hpFormula": "5d6+2",
    "speed": "0 ft., fly 50 ft. (hover)",
    "str": 12,
    "dex": 15,
    "con": 11,
    "int": 1,
    "wis": 5,
    "cha": 1,
    "saves": "",
    "skills": "",
    "senses": "blindsight 60 ft. (blind beyond 60 feet), passive Perception 7",
    "languages": "",
    "cr": "0.25",
    "crNum": 0.25,
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "desc": "The sword has disadvantage on saving throws against spells and magical effects."
      },
      {
        "name": "False Appearance",
        "desc": "While the sword remains motionless and isn't flying, it is indistinguishable from a normal sword."
      }
    ],
    "actions": [
      {
        "name": "Longsword",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8 + 1) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "poison, psychic",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": "",
    "xp": 50
  },
  {
    "name": "Frog",
    "size": "Tiny",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 11,
    "acType": "",
    "hp": 1,
    "hpFormula": "1d4-1",
    "speed": "20 ft., swim 20 ft.",
    "str": 1,
    "dex": 13,
    "con": 8,
    "int": 1,
    "wis": 8,
    "cha": 3,
    "saves": "",
    "skills": "Perception +1, Stealth +3",
    "senses": "darkvision 30 ft., passive Perception 11",
    "languages": "",
    "cr": "0",
    "crNum": 0,
    "traits": [
      {
        "name": "Amphibious",
        "desc": "The frog can breathe air and water."
      },
      {
        "name": "Standing Leap",
        "desc": "The frog's long jump is up to 20 feet and its high jump is up to 10 feet."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 3 (1d4 + 1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 0
  },
  {
    "name": "Giant Ape",
    "size": "Huge",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 7,
    "acType": "",
    "hp": 157,
    "hpFormula": "15d12+60",
    "speed": "40 ft., climb 40 ft.",
    "str": 23,
    "dex": 11,
    "con": 19,
    "int": 7,
    "wis": 12,
    "cha": 7,
    "saves": "",
    "skills": "Athletics +9, Perception +4",
    "senses": "passive Perception 14",
    "languages": "",
    "cr": "7",
    "crNum": 7,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The ape makes two fist attacks."
      },
      {
        "name": "Fist",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 22 (3d10 + 6) bludgeoning damage."
      },
      {
        "name": "Rock",
        "desc": "Ranged Weapon Attack: +9 to hit, range 50/100 ft., one target. Hit: 30 (4d10 + 6) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 2900
  },
  {
    "name": "Giant Badger",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 10,
    "acType": "",
    "hp": 13,
    "hpFormula": "2d10+2",
    "speed": "30 ft., burrow 10 ft.",
    "str": 13,
    "dex": 10,
    "con": 12,
    "int": 2,
    "wis": 12,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "darkvision 30 ft., passive Perception 11",
    "languages": "",
    "cr": "0.25",
    "crNum": 0.25,
    "traits": [
      {
        "name": "Keen Smell",
        "desc": "The badger has advantage on Wisdom (Perception) checks that rely on smell."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The badger makes two attacks: one with its bite and one with its claws."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) piercing damage."
      },
      {
        "name": "Claws",
        "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 6 (2d4 + 1) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 50
  },
  {
    "name": "Giant Bat",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "",
    "hp": 22,
    "hpFormula": "4d10+4",
    "speed": "10 ft., fly 60 ft.",
    "str": 15,
    "dex": 16,
    "con": 11,
    "int": 2,
    "wis": 12,
    "cha": 6,
    "saves": "",
    "skills": "Perception +3",
    "senses": "blindsight 120 ft., passive Perception 13",
    "languages": "",
    "cr": "0.25",
    "crNum": 0.25,
    "traits": [
      {
        "name": "Echolocation",
        "desc": "The bat can't use its blindsight while deafened."
      }
    ],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 50
  },
  {
    "name": "Giant Boar",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 42,
    "hpFormula": "5d10+15",
    "speed": "40 ft.",
    "str": 17,
    "dex": 10,
    "con": 16,
    "int": 2,
    "wis": 7,
    "cha": 5,
    "saves": "",
    "skills": "",
    "senses": "passive Perception 8",
    "languages": "",
    "cr": "2",
    "crNum": 2,
    "traits": [
      {
        "name": "Relentless (Recharge 5-6)",
        "desc": "If the boar takes 10 or fewer damage, it can use a reaction to move up to its speed toward a hostile creature it can see."
      }
    ],
    "actions": [
      {
        "name": "Tusk",
        "desc": "Melee Weapon Attack: +5 to hit, reach 10 ft., one target. Hit: 10 (2d6 + 3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 450
  },
  {
    "name": "Giant Centipede",
    "size": "Small",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 13,
    "acType": "",
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
    "senses": "blindsight 30 ft., passive Perception 8",
    "languages": "",
    "cr": "0.25",
    "crNum": 0.25,
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
    "damageVulnerabilities": "",
    "xp": 50
  },
  {
    "name": "Giant Constrictor Snake",
    "size": "Huge",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 60,
    "hpFormula": "8d12+16",
    "speed": "30 ft., swim 30 ft.",
    "str": 19,
    "dex": 14,
    "con": 15,
    "int": 1,
    "wis": 10,
    "cha": 3,
    "saves": "",
    "skills": "Perception +2",
    "senses": "blindsight 10 ft., passive Perception 12",
    "languages": "",
    "cr": "2",
    "crNum": 2,
    "traits": [],
    "actions": [
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 11 (2d6 + 4) piercing damage."
      },
      {
        "name": "Constrict",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one creature. Hit: 13 (2d8 + 4) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 450
  },
  {
    "name": "Giant Crab",
    "size": "Large",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 15,
    "acType": "",
    "hp": 45,
    "hpFormula": "6d10+12",
    "speed": "30 ft., swim 30 ft.",
    "str": 17,
    "dex": 15,
    "con": 15,
    "int": 1,
    "wis": 9,
    "cha": 3,
    "saves": "",
    "skills": "Stealth +4",
    "senses": "blindsight 30 ft., passive Perception 9",
    "languages": "",
    "cr": "1.8",
    "crNum": 1.8,
    "traits": [],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The crab makes two claw attacks."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 0
  },
  {
    "name": "Giant Crocodile",
    "size": "Gargantuan",
    "type": "beast",
    "alignment": "unaligned",
    "ac": 12,
    "acType": "",
    "hp": 102,
    "hpFormula": "12d20+24",
    "speed": "30 ft., swim 50 ft.",
    "str": 21,
    "dex": 9,
    "con": 15,
    "int": 2,
    "wis": 10,
    "cha": 7,
    "saves": "",
    "skills": "Stealth +2",
    "senses": "passive Perception 10",
    "languages": "",
    "cr": "5",
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
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 21 (3d12 + 5) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 1800
  },
  {
    "name": "Gibbering Mouther",
    "size": "Small",
    "type": "aberration",
    "alignment": "unaligned",
    "ac": 9,
    "acType": "",
    "hp": 27,
    "hpFormula": "5d6+10",
    "speed": "20 ft.",
    "str": 11,
    "dex": 9,
    "con": 14,
    "int": 3,
    "wis": 10,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "darkvision 60 ft., passive Perception 10",
    "languages": "",
    "cr": "2",
    "crNum": 2,
    "traits": [
      {
        "name": "Aberrant Mind",
        "desc": "Any creature starting within 5 feet must succeed on a DC 10 Wisdom saving throw or have disadvantage on attack rolls."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The mouther makes three bite attacks."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +2 to hit, reach 5 ft., one target. Hit: 7 (2d6) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 450
  },
  {
    "name": "Guard",
    "size": "Medium",
    "type": "humanoid",
    "subtype": "any race",
    "alignment": "any alignment",
    "ac": 16,
    "acType": "leather armor, shield",
    "hp": 11,
    "hpFormula": "2d8+2",
    "speed": "30 ft.",
    "str": 13,
    "dex": 12,
    "con": 12,
    "int": 10,
    "wis": 11,
    "cha": 10,
    "saves": "",
    "skills": "Perception +2",
    "senses": "passive Perception 12",
    "languages": "any one language (usually Common)",
    "cr": "0.125",
    "crNum": 0.125,
    "traits": [],
    "actions": [
      {
        "name": "Spear",
        "desc": "Melee or Ranged Weapon Attack: +3 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d6 + 1) piercing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 25
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
    "dex": 9,
    "con": 20,
    "int": 3,
    "wis": 11,
    "cha": 1,
    "saves": "",
    "skills": "",
    "senses": "darkvision 120 ft., passive Perception 10",
    "languages": "understands the languages of its creator but can't speak",
    "cr": "16",
    "crNum": 16,
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "desc": "The golem has disadvantage on saving throws against spells and magical effects."
      },
      {
        "name": "Immutable Form",
        "desc": "The golem is immune to any spell or effect that would alter its form."
      },
      {
        "name": "Magic Resistance",
        "desc": "The golem has advantage on saving throws against spells and magical effects."
      },
      {
        "name": "Magic Weapons",
        "desc": "The golem's weapon attacks are magical."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The golem makes two melee attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 20 (3d8 + 7) bludgeoning damage."
      },
      {
        "name": "Sword",
        "desc": "Melee Weapon Attack: +13 to hit, reach 10 ft., one target. Hit: 23 (3d10 + 7) slashing damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "fire, poison, psychic",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": "",
    "xp": 15000
  },
  {
    "name": "Mind Flayer",
    "size": "Medium",
    "type": "aberration",
    "alignment": "lawful evil",
    "ac": 15,
    "acType": "armor",
    "hp": 71,
    "hpFormula": "10d8+30",
    "speed": "30 ft.",
    "str": 11,
    "dex": 12,
    "con": 16,
    "int": 17,
    "wis": 16,
    "cha": 17,
    "saves": "Int +5, Wis +4",
    "skills": "Arcana +5, Insight +4, Perception +4, Stealth +3",
    "senses": "darkvision 120 ft., passive Perception 14",
    "languages": "Deep Speech, telepathy 120 ft.",
    "cr": "7",
    "crNum": 7,
    "traits": [
      {
        "name": "Magic Resistance",
        "desc": "The mind flayer has advantage on saving throws against spells and magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The mind flayer makes two attacks."
      },
      {
        "name": "Tentacle",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one creature. Hit: 15 (2d10 + 3) psychic damage."
      },
      {
        "name": "Dagger",
        "desc": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 4 (1d4 + 2) piercing damage."
      },
      {
        "name": "Mind Blast (Recharge 5-6)",
        "desc": "The mind flayer magically emits psychic energy in a 60-foot cone. Each creature in that area must succeed on a DC 15 Intelligence saving throw or take 22 (4d8 + 4) psychic damage and be stunned for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 2900
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
    "con": 19,
    "int": 6,
    "wis": 13,
    "cha": 6,
    "saves": "",
    "skills": "",
    "senses": "darkvision 120 ft., passive Perception 11",
    "languages": "",
    "cr": "5",
    "crNum": 5,
    "traits": [
      {
        "name": "Limited Telepathy",
        "desc": "The otyugh can magically transmit simple messages within 120 feet."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The otyugh makes three attacks: one with its bite and two with its tentacles."
      },
      {
        "name": "Bite",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage."
      },
      {
        "name": "Tentacle",
        "desc": "Melee Weapon Attack: +5 to hit, reach 15 ft., one target. Hit: 10 (2d6 + 3) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "xp": 1800
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
    "saves": "",
    "skills": "",
    "senses": "darkvision 120 ft., passive Perception 10",
    "languages": "understands the languages of its creator but can't speak",
    "cr": "10",
    "crNum": 10,
    "traits": [
      {
        "name": "Antimagic Susceptibility",
        "desc": "The golem has disadvantage on saving throws against spells and magical effects."
      },
      {
        "name": "Immutable Form",
        "desc": "The golem is immune to any spell or effect that would alter its form."
      },
      {
        "name": "Magic Resistance",
        "desc": "The golem has advantage on saving throws against spells and magical effects."
      }
    ],
    "actions": [
      {
        "name": "Multiattack",
        "desc": "The golem makes two slam attacks."
      },
      {
        "name": "Slam",
        "desc": "Melee Weapon Attack: +10 to hit, reach 15 ft., one target. Hit: 19 (3d8 + 6) bludgeoning damage."
      }
    ],
    "legendaryActions": [],
    "reactions": [],
    "damageResistances": "",
    "damageImmunities": "acid, cold, fire, lightning, necrotic, poison, psychic, radiant, thunder",
    "conditionImmunities": "charmed, exhaustion, frightened, paralyzed, petrified, poisoned",
    "damageVulnerabilities": "",
    "xp": 5900
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
    "dex": 10,
    "con": 17,
    "int": 12,
    "wis": 11,
    "cha": 15,
    "saves": "Dex +3, Con +5, Wis +3, Cha +5",
    "skills": "Perception +6",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 16",
    "languages": "Draconic",
    "cr": "7",
    "crNum": 7,
    "damageImmunities": "acid",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
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
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 13 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 5 feet of the dragon must succeed on a DC 15 Dexterity saving throw or take 11 (2d6 + 4) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 2900
  },
  {
    "name": "Young Blue Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "lawful evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 142,
    "hpFormula": "15d10+60",
    "speed": "40 ft., fly 80 ft.",
    "str": 21,
    "dex": 10,
    "con": 19,
    "int": 14,
    "wis": 13,
    "cha": 17,
    "saves": "Dex +3, Con +6, Wis +4, Cha +6",
    "skills": "Insight +4, Perception +7",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 17",
    "languages": "Draconic",
    "cr": "9",
    "crNum": 9,
    "damageImmunities": "lightning",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
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
        "desc": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 16 (2d10 + 5) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 14 (2d8 + 5) bludgeoning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 5 feet of the dragon must succeed on a DC 16 Dexterity saving throw or take 12 (2d6 + 5) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 5000
  },
  {
    "name": "Young Brass Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "chaotic good",
    "ac": 17,
    "acType": "natural armor",
    "hp": 110,
    "hpFormula": "13d10+39",
    "speed": "40 ft., fly 80 ft., burrow 30 ft.",
    "str": 19,
    "dex": 10,
    "con": 17,
    "int": 14,
    "wis": 13,
    "cha": 15,
    "saves": "Dex +3, Con +5, Wis +4, Cha +5",
    "skills": "History +4, Insight +4, Stealth +3",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 11",
    "languages": "Draconic",
    "cr": "6",
    "crNum": 6,
    "damageImmunities": "fire",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
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
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 13 Dexterity saving throw, taking 22 (4d10) fire damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Sleep Breath (Recharge 5-6)",
        "desc": "The dragon exhales sleep gas in a 30-foot cone. Each creature in that area must succeed on a DC 13 Constitution saving throw or fall unconscious for 5 minutes."
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
        "desc": "The dragon beats its wings. Each creature within 5 feet of the dragon must succeed on a DC 15 Dexterity saving throw or take 11 (2d6 + 4) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 2300
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
    "str": 21,
    "dex": 10,
    "con": 19,
    "int": 14,
    "wis": 13,
    "cha": 15,
    "saves": "Dex +3, Con +6, Wis +4, Cha +5",
    "skills": "Insight +4, Perception +7",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 17",
    "languages": "Draconic",
    "cr": "8",
    "crNum": 8,
    "damageImmunities": "lightning",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
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
        "desc": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 16 (2d10 + 5) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +8 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 5) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +8 to hit, reach 10 ft., one target. Hit: 14 (2d8 + 5) bludgeoning damage."
      },
      {
        "name": "Lightning Breath (Recharge 5-6)",
        "desc": "The dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Repulsion Breath (Recharge 5-6)",
        "desc": "The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 14 Strength saving throw or be pushed 40 feet away from the dragon."
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
        "desc": "The dragon beats its wings. Each creature within 5 feet of the dragon must succeed on a DC 16 Dexterity saving throw or take 12 (2d6 + 5) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 5000
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
    "con": 17,
    "int": 14,
    "wis": 11,
    "cha": 13,
    "saves": "Dex +4, Con +5, Wis +3, Cha +4",
    "skills": "Deception +4, Insight +3, Stealth +4",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 10",
    "languages": "Draconic",
    "cr": "7",
    "crNum": 7,
    "damageImmunities": "acid",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
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
        "desc": "Melee Weapon Attack: +5 to hit, reach 10 ft., one target. Hit: 13 (2d10 + 2) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 2) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +5 to hit, reach 10 ft., one target. Hit: 12 (2d8 + 2) bludgeoning damage."
      },
      {
        "name": "Acid Breath (Recharge 5-6)",
        "desc": "The dragon exhales acid in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 13 Dexterity saving throw, taking 33 (6d8) acid damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Slowing Breath (Recharge 5-6)",
        "desc": "The dragon exhales gas in a 30-foot cone. Each creature in that area must succeed on a DC 13 Constitution saving throw or be slowed for 1 minute."
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
        "desc": "The dragon beats its wings. Each creature within 5 feet of the dragon must succeed on a DC 13 Dexterity saving throw or take 10 (2d6 + 2) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 2900
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
    "str": 23,
    "dex": 10,
    "con": 21,
    "int": 14,
    "wis": 13,
    "cha": 17,
    "saves": "Dex +3, Con +8, Wis +4, Cha +6",
    "skills": "Insight +4, Perception +7",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 17",
    "languages": "Draconic",
    "cr": "10",
    "crNum": 10,
    "damageImmunities": "fire",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
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
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 16 (2d10 + 6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 14 (2d8 + 6) bludgeoning damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 16 Dexterity saving throw, taking 66 (12d10) fire damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Weakening Breath (Recharge 5-6)",
        "desc": "The dragon exhales gas in a 60-foot cone. Each creature in that area must succeed on a DC 16 Strength saving throw or have disadvantage on Strength checks and Strength saving throws for 1 minute."
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
        "desc": "The dragon beats its wings. Each creature within 5 feet of the dragon must succeed on a DC 17 Dexterity saving throw or take 12 (2d6 + 6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 5900
  },
  {
    "name": "Young Green Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "lawful evil",
    "ac": 18,
    "acType": "natural armor",
    "hp": 136,
    "hpFormula": "13d10+65",
    "speed": "40 ft., fly 80 ft., swim 40 ft.",
    "str": 19,
    "dex": 12,
    "con": 21,
    "int": 16,
    "wis": 13,
    "cha": 15,
    "saves": "Dex +4, Con +7, Wis +4, Cha +5",
    "skills": "Deception +5, Insight +4, Perception +7",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 17",
    "languages": "Draconic",
    "cr": "8",
    "crNum": 8,
    "damageImmunities": "poison",
    "damageResistances": "",
    "conditionImmunities": "poisoned",
    "damageVulnerabilities": "",
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
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 15 (2d10 + 4) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +7 to hit, reach 10 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage."
      },
      {
        "name": "Poison Breath (Recharge 5-6)",
        "desc": "The dragon exhales poisonous gas in a 40-foot cone. Each creature in that area must make a DC 15 Constitution saving throw, taking 44 (8d10) poison damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 5 feet of the dragon must succeed on a DC 15 Dexterity saving throw or take 11 (2d6 + 4) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 5000
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
    "speed": "40 ft., fly 80 ft.",
    "str": 23,
    "dex": 10,
    "con": 21,
    "int": 14,
    "wis": 11,
    "cha": 17,
    "saves": "Dex +3, Con +8, Wis +3, Cha +6",
    "skills": "Perception +7",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 17",
    "languages": "Draconic",
    "cr": "10",
    "crNum": 10,
    "damageImmunities": "fire",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
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
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 16 (2d10 + 6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 14 (2d8 + 6) bludgeoning damage."
      },
      {
        "name": "Fire Breath (Recharge 5-6)",
        "desc": "The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 16 Dexterity saving throw, taking 77 (14d10) fire damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 5 feet of the dragon must succeed on a DC 17 Dexterity saving throw or take 12 (2d6 + 6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 5900
  },
  {
    "name": "Young Silver Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "lawful good",
    "ac": 18,
    "acType": "natural armor",
    "hp": 168,
    "hpFormula": "16d10+80",
    "speed": "40 ft., fly 80 ft.",
    "str": 23,
    "dex": 10,
    "con": 21,
    "int": 14,
    "wis": 11,
    "cha": 17,
    "saves": "Dex +3, Con +8, Wis +3, Cha +6",
    "skills": "Arcana +4, Insight +4, Perception +7",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 17",
    "languages": "Draconic",
    "cr": "9",
    "crNum": 9,
    "damageImmunities": "cold",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
    "traits": [
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
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 16 (2d10 + 6) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +9 to hit, reach 5 ft., one target. Hit: 12 (2d6 + 6) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +9 to hit, reach 10 ft., one target. Hit: 14 (2d8 + 6) bludgeoning damage."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 16 Constitution saving throw, taking 66 (12d10) cold damage on a failed save, or half as much on a successful one."
      },
      {
        "name": "Paralyzing Breath (Recharge 5-6)",
        "desc": "The dragon exhales paralyzing gas in a 30-foot cone. Each creature in that area must succeed on a DC 16 Constitution saving throw or be paralyzed for 1 minute."
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
        "desc": "The dragon beats its wings. Each creature within 5 feet of the dragon must succeed on a DC 17 Dexterity saving throw or take 12 (2d6 + 6) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 5000
  },
  {
    "name": "Young White Dragon",
    "size": "Large",
    "type": "dragon",
    "alignment": "chaotic evil",
    "ac": 17,
    "acType": "natural armor",
    "hp": 133,
    "hpFormula": "14d10+56",
    "speed": "40 ft., burrow 20 ft., fly 80 ft., swim 40 ft.",
    "str": 18,
    "dex": 10,
    "con": 18,
    "int": 6,
    "wis": 11,
    "cha": 10,
    "saves": "Dex +3, Con +6, Wis +3",
    "skills": "Perception +6",
    "senses": "blindsight 30 ft., darkvision 120 ft., passive Perception 16",
    "languages": "Draconic",
    "cr": "6",
    "crNum": 6,
    "damageImmunities": "cold",
    "damageResistances": "",
    "conditionImmunities": "",
    "damageVulnerabilities": "",
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
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 13 (2d8 + 4) piercing damage."
      },
      {
        "name": "Claw",
        "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 4) slashing damage."
      },
      {
        "name": "Tail",
        "desc": "Melee Weapon Attack: +6 to hit, reach 10 ft., one target. Hit: 12 (2d8 + 4) bludgeoning damage."
      },
      {
        "name": "Cold Breath (Recharge 5-6)",
        "desc": "The dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking 55 (10d10) cold damage on a failed save, or half as much on a successful one."
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
        "desc": "The dragon beats its wings. Each creature within 5 feet of the dragon must succeed on a DC 14 Dexterity saving throw or take 10 (2d6 + 4) bludgeoning damage and be knocked prone."
      }
    ],
    "reactions": [],
    "xp": 2300
  }
,
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
  "languages": "Goblin",
  "cr": "0.25",
  "crNum": 0.25,
  "traits": [
    {
      "name": "Nimble Escape",
      "desc": "The goblin can take the Disengage or Dash action as a bonus action on each of its turns."
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
  "damageVulnerabilities": "",
  "xp": 50
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
  "languages": "Draconic",
  "cr": "0.125",
  "crNum": 0.125,
  "traits": [
    {
      "name": "Pack Tactics",
      "desc": "The kobold has advantage on an attack roll against a creature if at least one other kobold is within 5 feet of the target and the other kobold isn't incapacitated."
    },
    {
      "name": "Sunlight Sensitivity",
      "desc": "While in sunlight, the kobold has disadvantage on attack rolls, and on Wisdom (Perception) checks that rely on sight."
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
  "damageVulnerabilities": "",
  "xp": 25
},
  {
  "name": "Skeleton",
  "size": "Medium",
  "type": "undead",
  "alignment": "lawful evil",
  "ac": 13,
  "acType": "armor scraps",
  "hp": 13,
  "hpFormula": "2d8 + 4",
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
  "cr": "0.25",
  "crNum": 0.25,
  "traits": [
    {
      "name": "Damage Immunities",
      "desc": "poison"
    }
  ],
  "actions": [
    {
      "name": "Shortsword",
      "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
    },
    {
      "name": "Shortbow",
      "desc": "Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "poison",
  "conditionImmunities": "exhaustion, poisoned",
  "damageVulnerabilities": "",
  "xp": 50
},
  {
  "name": "Zombie",
  "size": "Medium",
  "type": "undead",
  "alignment": "neutral evil",
  "ac": 8,
  "acType": "natural armor",
  "hp": 22,
  "hpFormula": "3d8 + 9",
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
  "cr": "0.25",
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
      "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) bludgeoning damage."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "poison",
  "conditionImmunities": "exhaustion, poisoned",
  "damageVulnerabilities": "",
  "xp": 50
},
  {
  "name": "Wolf",
  "size": "Medium",
  "type": "beast",
  "alignment": "unaligned",
  "ac": 13,
  "acType": "natural armor",
  "hp": 11,
  "hpFormula": "2d8 + 2",
  "speed": "40 ft.",
  "str": 12,
  "dex": 15,
  "con": 13,
  "int": 3,
  "wis": 12,
  "cha": 6,
  "saves": "",
  "skills": "Perception +3, Stealth +4",
  "senses": "passive Perception 13",
  "languages": "",
  "cr": "0.25",
  "crNum": 0.25,
  "traits": [
    {
      "name": "Pack Tactics",
      "desc": "The wolf has advantage on an attack roll against a creature if at least one other wolf is within 5 feet of the target and the other wolf isn't incapacitated."
    },
    {
      "name": "Keen Hearing and Smell",
      "desc": "The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
    }
  ],
  "actions": [
    {
      "name": "Bite",
      "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) piercing damage. If the target is a creature, it must succeed on a DC 12 Strength saving throw or be knocked prone."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "",
  "conditionImmunities": "",
  "damageVulnerabilities": "",
  "xp": 50
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
  "languages": "Orc",
  "cr": "0.5",
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
  "conditionImmunities": "charmed, frightened",
  "damageVulnerabilities": "",
  "xp": 100
},
  {
  "name": "Ogre",
  "size": "Large",
  "type": "giant",
  "alignment": "chaotic evil",
  "ac": 11,
  "acType": "hide armor",
  "hp": 59,
  "hpFormula": "7d10 + 21",
  "speed": "40 ft.",
  "str": 19,
  "dex": 8,
  "con": 16,
  "int": 5,
  "wis": 7,
  "cha": 7,
  "saves": "",
  "skills": "",
  "senses": "darkvision 60 ft., passive Perception 8",
  "languages": "Orc",
  "cr": "2",
  "crNum": 2,
  "traits": [],
  "actions": [
    {
      "name": "Multiattack",
      "desc": "The ogre makes two greatclub attacks."
    },
    {
      "name": "Greatclub",
      "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) bludgeoning damage."
    },
    {
      "name": "Javelin",
      "desc": "Melee or Ranged Weapon Attack: +6 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 11 (2d6 + 4) piercing damage."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "",
  "conditionImmunities": "",
  "damageVulnerabilities": "",
  "xp": 450
},
  {
  "name": "Troll",
  "size": "Large",
  "type": "giant",
  "alignment": "chaotic evil",
  "ac": 15,
  "acType": "natural armor",
  "hp": 84,
  "hpFormula": "8d10 + 40",
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
  "languages": "Trollish",
  "cr": "5",
  "crNum": 5,
  "traits": [
    {
      "name": "Regeneration",
      "desc": "The troll regains 10 hit points at the start of its turn. If the troll takes acid or fire damage, this trait doesn't function at the start of the troll's next turn. The troll dies only if it starts its turn with 0 hit points and doesn't regenerate."
    }
  ],
  "actions": [
    {
      "name": "Multiattack",
      "desc": "The troll makes three attacks: one with its bite and two with its claws."
    },
    {
      "name": "Bite",
      "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 7 (1d6 + 4) piercing damage."
    },
    {
      "name": "Claw",
      "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 11 (2d6 + 4) slashing damage."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "",
  "conditionImmunities": "",
  "damageVulnerabilities": "acid, fire",
  "xp": 1800
},
  {
  "name": "Owlbear",
  "size": "Large",
  "type": "monstrosity",
  "alignment": "unaligned",
  "ac": 13,
  "acType": "natural armor",
  "hp": 59,
  "hpFormula": "7d10 + 21",
  "speed": "40 ft.",
  "str": 20,
  "dex": 12,
  "con": 17,
  "int": 3,
  "wis": 12,
  "cha": 7,
  "saves": "",
  "skills": "Perception +4",
  "senses": "darkvision 120 ft., passive Perception 14",
  "languages": "",
  "cr": "3",
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
      "desc": "The owlbear makes one beak attack and two claw attacks."
    },
    {
      "name": "Beak",
      "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 10 (1d8 + 5) piercing damage."
    },
    {
      "name": "Claw",
      "desc": "Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8 + 5) slashing damage."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "",
  "conditionImmunities": "",
  "damageVulnerabilities": "",
  "xp": 700
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
  "languages": "Thieves' cant",
  "cr": "1",
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
      "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 9 (2d4 + 2) piercing damage."
    },
    {
      "name": "Claws",
      "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) slashing damage. If the target is a creature other than an undead, it must succeed on a DC 12 Constitution saving throw or be paralyzed for 1 minute."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "poison",
  "conditionImmunities": "charmed, exhaustion, poisoned",
  "damageVulnerabilities": "",
  "xp": 200
},
  {
  "name": "Giant Spider",
  "size": "Large",
  "type": "beast",
  "alignment": "unaligned",
  "ac": 14,
  "acType": "natural armor",
  "hp": 26,
  "hpFormula": "4d10 + 8",
  "speed": "30 ft., climb 30 ft.",
  "str": 12,
  "dex": 16,
  "con": 13,
  "int": 2,
  "wis": 11,
  "cha": 4,
  "saves": "",
  "skills": "Stealth +6",
  "senses": "blindsight 10 ft., darkvision 60 ft., passive Perception 10",
  "languages": "",
  "cr": "1",
  "crNum": 1,
  "traits": [
    {
      "name": "Spider Climb",
      "desc": "The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
    },
    {
      "name": "Web Sense",
      "desc": "While in contact with a web, the spider knows the exact location of any other creature in contact with the same web."
    },
    {
      "name": "Web Walker",
      "desc": "The spider ignores movement restrictions caused by webbing."
    }
  ],
  "actions": [
    {
      "name": "Bite",
      "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) piercing damage, and the target must succeed on a DC 12 Constitution saving throw or take 9 (2d8) poison damage."
    },
    {
      "name": "Web (Recharge 5-6)",
      "desc": "The spider shoots sticky webbing in a 30-foot line. Each creature in that line must make a DC 12 Dexterity saving throw. On a failure, a creature is restrained by the webbing. A creature restrained by the webbing can use its action to make a DC 12 Strength check, escaping on a success."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "",
  "conditionImmunities": "",
  "damageVulnerabilities": "",
  "xp": 200
},
  {
  "name": "Gnoll",
  "size": "Medium",
  "type": "humanoid",
  "subtype": "gnoll",
  "alignment": "chaotic evil",
  "ac": 15,
  "acType": "hide armor, shield",
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
  "senses": "darkvision 60 ft., passive Perception 10",
  "languages": "Gnoll",
  "cr": "0.5",
  "crNum": 0.5,
  "traits": [
    {
      "name": "Rampage",
      "desc": "When the gnoll reduces a creature to 0 hit points with a melee attack on its turn, the gnoll can use a bonus action to move up to half its speed toward another creature it can see within 30 feet and make an attack."
    }
  ],
  "actions": [
    {
      "name": "Bite",
      "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) piercing damage."
    },
    {
      "name": "Spear",
      "desc": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 20/60 ft., one target. Hit: 6 (1d6 + 2) piercing damage, or 7 (1d8 + 2) piercing damage if used with two hands to make a melee attack."
    },
    {
      "name": "Longbow",
      "desc": "Ranged Weapon Attack: +3 to hit, range 150/600 ft., one target. Hit: 5 (1d8 + 1) piercing damage."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "",
  "conditionImmunities": "",
  "damageVulnerabilities": "",
  "xp": 100
},
  {
  "name": "Bugbear",
  "size": "Medium",
  "type": "humanoid",
  "subtype": "goblinoid",
  "alignment": "chaotic evil",
  "ac": 16,
  "acType": "hide armor, shield",
  "hp": 27,
  "hpFormula": "5d8 + 5",
  "speed": "30 ft.",
  "str": 15,
  "dex": 16,
  "con": 13,
  "int": 8,
  "wis": 11,
  "cha": 9,
  "saves": "Dex +5, Str +4",
  "skills": "Stealth +7",
  "senses": "darkvision 60 ft., passive Perception 10",
  "languages": "Goblin",
  "cr": "1",
  "crNum": 1,
  "traits": [
    {
      "name": "Brute",
      "desc": "A melee weapon deals one extra die of its damage when the bugbear hits with it."
    },
    {
      "name": "Surprise Attack",
      "desc": "If the bugbear acts before its opponents in combat, it has advantage on attack rolls against any creature it hasn't acted against before."
    }
  ],
  "actions": [
    {
      "name": "Multiattack",
      "desc": "The bugbear makes two attacks with its morningstar or two attacks with javelins."
    },
    {
      "name": "Morningstar",
      "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 9 (2d8 + 2) piercing damage."
    },
    {
      "name": "Javelin",
      "desc": "Melee or Ranged Weapon Attack: +4 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 5 (1d6 + 2) piercing damage."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "",
  "conditionImmunities": "",
  "damageVulnerabilities": "",
  "xp": 200
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
  "int": 14,
  "wis": 10,
  "cha": 9,
  "saves": "",
  "skills": "Insight +2",
  "senses": "darkvision 60 ft., passive Perception 10",
  "languages": "Goblin",
  "cr": "0.5",
  "crNum": 0.5,
  "traits": [
    {
      "name": "Martial Advantage",
      "desc": "Once per turn, the hobgoblin can deal an extra 7 (2d6) damage to a creature it hits with a weapon attack if that creature is within 5 feet of an ally of the hobgoblin that isn't incapacitated."
    }
  ],
  "actions": [
    {
      "name": "Longsword",
      "desc": "Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 5 (1d8 + 1) slashing damage, or 6 (1d10 + 1) slashing damage if used with two hands."
    },
    {
      "name": "Longbow",
      "desc": "Ranged Weapon Attack: +3 to hit, range 150/600 ft., one target. Hit: 5 (1d8 + 1) piercing damage."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "",
  "conditionImmunities": "",
  "damageVulnerabilities": "",
  "xp": 100
},
  {
  "name": "Minotaur",
  "size": "Large",
  "type": "monstrosity",
  "alignment": "chaotic evil",
  "ac": 14,
  "acType": "natural armor",
  "hp": 76,
  "hpFormula": "8d10 + 32",
  "speed": "40 ft.",
  "str": 18,
  "dex": 11,
  "con": 17,
  "int": 6,
  "wis": 16,
  "cha": 9,
  "saves": "Str +6",
  "skills": "Perception +5",
  "senses": "darkvision 60 ft., passive Perception 15",
  "languages": "Abyssal",
  "cr": "3",
  "crNum": 3,
  "traits": [
    {
      "name": "Charge",
      "desc": "If the minotaur moves at least 10 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be knocked prone."
    },
    {
      "name": "Labyrinthine Recall",
      "desc": "The minotaur can perfectly recall any path it has traveled."
    },
    {
      "name": "Reckless Attack",
      "desc": "At the start of its turn, the minotaur can gain advantage on all melee weapon attack rolls during that turn, but attack rolls against it have advantage until the start of its next turn."
    }
  ],
  "actions": [
    {
      "name": "Multiattack",
      "desc": "The minotaur makes two attacks: one with its gore and one with its greataxe."
    },
    {
      "name": "Gore",
      "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 13 (2d8 + 4) piercing damage."
    },
    {
      "name": "Greataxe",
      "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 17 (2d12 + 4) slashing damage."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "",
  "conditionImmunities": "",
  "damageVulnerabilities": "",
  "xp": 700
},
  {
  "name": "Wight",
  "size": "Medium",
  "type": "undead",
  "alignment": "chaotic evil",
  "ac": 15,
  "acType": "studded leather armor",
  "hp": 45,
  "hpFormula": "10d8",
  "speed": "30 ft.",
  "str": 15,
  "dex": 16,
  "con": 16,
  "int": 10,
  "wis": 13,
  "cha": 15,
  "saves": "Dex +5, Wis +3",
  "skills": "Perception +3",
  "senses": "darkvision 60 ft., passive Perception 13",
  "languages": "the languages it knew in life",
  "cr": "3",
  "crNum": 3,
  "traits": [
    {
      "name": "Sunlight Sensitivity",
      "desc": "While in sunlight, the wight has disadvantage on attack rolls, and on Wisdom (Perception) checks that rely on sight."
    }
  ],
  "actions": [
    {
      "name": "Multiattack",
      "desc": "The wight makes two attacks with its longsword or longbow."
    },
    {
      "name": "Life Drain",
      "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 6 (1d6 + 3) necrotic damage. The target must succeed on a DC 14 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken."
    },
    {
      "name": "Longsword",
      "desc": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 7 (1d8 + 3) slashing damage, or 8 (1d10 + 3) slashing damage if used with two hands."
    },
    {
      "name": "Longbow",
      "desc": "Ranged Weapon Attack: +5 to hit, range 150/600 ft., one target. Hit: 7 (1d8 + 3) piercing damage."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "cold, lightning, necrotic",
  "damageImmunities": "poison",
  "conditionImmunities": "exhaustion, paralyzed, poisoned",
  "damageVulnerabilities": "",
  "xp": 700
},
  {
  "name": "Wraith",
  "size": "Medium",
  "type": "undead",
  "alignment": "chaotic evil",
  "ac": 13,
  "acType": "natural armor",
  "hp": 67,
  "hpFormula": "9d8 + 27",
  "speed": "0 ft., fly 60 ft. (hover)",
  "str": 6,
  "dex": 16,
  "con": 16,
  "int": 12,
  "wis": 14,
  "cha": 15,
  "saves": "Con +5, Int +4, Wis +4",
  "skills": "Perception +4, Stealth +6",
  "senses": "darkvision 60 ft., passive Perception 14",
  "languages": "the languages it knew in life",
  "cr": "5",
  "crNum": 5,
  "traits": [
    {
      "name": "Incorporeal Movement",
      "desc": "The wraith can move through creatures and solid objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside a solid object."
    },
    {
      "name": "Sunlight Sensitivity",
      "desc": "While in sunlight, the wraith has disadvantage on attack rolls, and on Wisdom (Perception) checks that rely on sight."
    }
  ],
  "actions": [
    {
      "name": "Life Drain",
      "desc": "Melee Weapon Attack: +6 to hit, reach 5 ft., one target. Hit: 21 (4d8 + 3) necrotic damage. The target must succeed on a DC 14 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken."
    },
    {
      "name": "Create Specter",
      "desc": "The wraith targets a humanoid it can see within 10 feet of it that has been dead for no longer than 1 day and died violently. The target's spirit rises as a specter (see the Specter stat block) in the space of its corpse or in the nearest unoccupied space."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "acid, cold, fire, lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks",
  "damageImmunities": "necrotic, poison, psychic",
  "conditionImmunities": "charmed, exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained",
  "damageVulnerabilities": "",
  "xp": 1800
},
  {
  "name": "Specter",
  "size": "Medium",
  "type": "undead",
  "alignment": "chaotic evil",
  "ac": 12,
  "acType": "natural armor",
  "hp": 22,
  "hpFormula": "5d8",
  "speed": "0 ft., fly 50 ft. (hover)",
  "str": 8,
  "dex": 14,
  "con": 10,
  "int": 10,
  "wis": 10,
  "cha": 11,
  "saves": "Int +2, Wis +2",
  "skills": "Perception +2",
  "senses": "darkvision 60 ft., passive Perception 12",
  "languages": "any language it knew in life",
  "cr": "1",
  "crNum": 1,
  "traits": [
    {
      "name": "Incorporeal Movement",
      "desc": "The specter can move through creatures and solid objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside a solid object."
    },
    {
      "name": "Sunlight Sensitivity",
      "desc": "While in sunlight, the specter has disadvantage on attack rolls, and on Wisdom (Perception) checks that rely on sight."
    }
  ],
  "actions": [
    {
      "name": "Life Drain",
      "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 10 (3d6) necrotic damage. The target must succeed on a DC 13 Constitution saving throw or its hit point maximum is reduced by an amount equal to the damage taken."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "acid, cold, fire, lightning, thunder; bludgeoning, piercing, and slashing from nonmagical attacks",
  "damageImmunities": "necrotic, poison, psychic",
  "conditionImmunities": "charmed, exhaustion, grappled, paralyzed, petrified, poisoned, prone, restrained",
  "damageVulnerabilities": "",
  "xp": 200
},
  {
  "name": "Ghast",
  "size": "Medium",
  "type": "undead",
  "alignment": "chaotic evil",
  "ac": 13,
  "acType": "natural armor",
  "hp": 36,
  "hpFormula": "8d8",
  "speed": "30 ft.",
  "str": 14,
  "dex": 16,
  "con": 10,
  "int": 11,
  "wis": 10,
  "cha": 8,
  "saves": "",
  "skills": "",
  "senses": "darkvision 60 ft., passive Perception 10",
  "languages": "Thieves' cant",
  "cr": "2",
  "crNum": 2,
  "traits": [
    {
      "name": "Stench",
      "desc": "Any creature that starts its turn within 5 feet of the ghast must succeed on a DC 12 Constitution saving throw or be poisoned until the start of its next turn."
    },
    {
      "name": "Turning Defiance",
      "desc": "The ghast and any ghouls within 30 feet of it have advantage on saving throws against effects that turn undead."
    }
  ],
  "actions": [
    {
      "name": "Bite",
      "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 9 (2d6 + 2) piercing damage."
    },
    {
      "name": "Claws",
      "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) slashing damage. If the target is a creature other than an undead, it must succeed on a DC 12 Constitution saving throw or be paralyzed for 1 minute."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "poison",
  "conditionImmunities": "charmed, exhaustion, poisoned",
  "damageVulnerabilities": "",
  "xp": 450
},
  {
  "name": "Basilisk",
  "size": "Medium",
  "type": "monstrosity",
  "alignment": "unaligned",
  "ac": 15,
  "acType": "natural armor",
  "hp": 52,
  "hpFormula": "8d10 + 16",
  "speed": "20 ft.",
  "str": 15,
  "dex": 16,
  "con": 15,
  "int": 2,
  "wis": 12,
  "cha": 7,
  "saves": "",
  "skills": "Perception +3",
  "senses": "darkvision 60 ft., passive Perception 13",
  "languages": "",
  "cr": "3",
  "crNum": 3,
  "traits": [
    {
      "name": "Petrifying Gaze",
      "desc": "If a creature starts its turn within 30 feet of the basilisk and the two can see each other, the creature must succeed on a DC 12 Dexterity saving throw or take 10 (3d6) force damage. If the save fails by 5 or more, the creature is instead restrained as it begins to turn to stone. A creature restrained by this effect must repeat the saving throw at the end of its next turn, becoming petrified on a failure or ending the effect on a success."
    }
  ],
  "actions": [
    {
      "name": "Bite",
      "desc": "Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 6 (1d8 + 2) piercing damage plus 7 (2d6) poison damage."
    }
  ],
  "legendaryActions": [],
  "reactions": [],
  "damageResistances": "",
  "damageImmunities": "",
  "conditionImmunities": "",
  "damageVulnerabilities": "",
  "xp": 700
}
];