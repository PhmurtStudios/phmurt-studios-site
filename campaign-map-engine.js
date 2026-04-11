/**
 * campaign-map-engine.js
 * Dynamic Fantasy Map Engine — Territory & Faction System
 *
 * Browser-side procedural continent generation + dynamic faction territory control.
 * Continental shapes ported from the Python atlas generator's pipeline:
 *   base ellipse → rotation → harmonics → gulfs → peninsulas → fjords →
 *   direction changes → roughen (two-pass) → smooth
 *
 * Architecture:
 *   MapEngine           — top-level orchestrator, public API
 *     ContinentGenerator— procedural landmass shapes (ported from Python)
 *     MapGrid           — cell-based spatial grid with land/sea mask
 *     TerritorySystem   — region generation, faction assignment, dynamic updates
 *     BorderSystem      — border extraction, smoothing, classification
 *     MapRenderer       — HTML5 Canvas rendering (clean modern fantasy aesthetic)
 */

(function (global) {
  "use strict";

  /* ================================================================
   *  CONFIGURATION
   * ================================================================ */

  const DEFAULTS = {
    mapWidth: 6000,
    mapHeight: 4500,
    gridStep: 10,
    regionCount: 10,
    factionCount: 5,
    regionMinDistance: 0.14,
    growthJitter: 0.35,
    borderSmoothing: 3,
    coastlineStep: 0.012,      // normalised step for roughening
    coastlineRoughness: 0.010, // normalised amplitude
    islandRoughness: 0.006,
    labelFont: "Cinzel, serif",
    bodyFont: "Spectral, Georgia, serif",
  };

  const FACTION_PALETTE = [
    { fill: "#5b7a6e", border: "#3d5c4e", name: "Verdant" },
    { fill: "#7a5b5b", border: "#5c3d3d", name: "Crimson" },
    { fill: "#5b6a7a", border: "#3d4c5c", name: "Azure" },
    { fill: "#7a6e5b", border: "#5c5040", name: "Amber" },
    { fill: "#6e5b7a", border: "#50405c", name: "Violet" },
    { fill: "#5b7a7a", border: "#3d5c5c", name: "Teal" },
    { fill: "#7a7a5b", border: "#5c5c3d", name: "Olive" },
    { fill: "#7a5b6e", border: "#5c3d50", name: "Maroon" },
    { fill: "#5b7a65", border: "#3d5c47", name: "Jade" },
    { fill: "#6a5b7a", border: "#4c3d5c", name: "Indigo" },
    { fill: "#7a6a5b", border: "#5c4c3d", name: "Bronze" },
    { fill: "#5b6e7a", border: "#3d505c", name: "Slate" },
  ];

  const REGION_NAMES = [
    "Essendel","Belrosia","Theandor","Corvanis","Falmere",
    "Greyhollow","Valdris","Sunmarch","Ironfen","Duskmoor",
    "Thornwall","Ashenveil","Brightvale","Mistpeak","Stormrest",
    "Goldreach","Nighthollow","Silverspire","Emberloft","Frostmere",
    "Ravencross","Wyrmwood","Starfall","Deepholme","Windhaven",
    "Oakenheart","Crystalmere","Dragonmarch","Veilshade","Flamecrest",
    "Dawnfield","Shadowfen","Ironridge","Cloudpeak","Pearlshore",
    "Wolfrun","Eaglecrest","Serpentmire","Hawkwatch","Liongate",
    "Ashenmoor","Thornveil","Palereach","Drifthollow","Cindermark",
    "Saltmere","Wyvern's Rest","Blackhollow","Silverglen","Icemarch",
    "Briarwatch","Stoneweald","Goldmere","Emberveil","Darkfen",
    "Whitespire","Greenholme","Ironvale","Skyreach","Bloodmoor",
    "Gryphon's Fall","Starweald","Amberglow","Frostholme","Dustmarch",
    "Silken Shore","Crownthorn","Rustfield","Moonveil","Ashglen",
  ];

  const CITY_NAMES = [
    "Goldug","Palanor","Duskhold","Thornburg","Silvenport",
    "Ashford","Ironhaven","Ravenspire","Stormgate","Brighthall",
    "Crystalford","Emberpeak","Frostwick","Moonhaven","Sunkeep",
    "Shadowmere","Starholm","Wyrmrest","Oakenwall","Deepwater",
    "Flamekeep","Cloudrest","Pearlhaven","Wolfhold","Eaglevale",
    "Serpentport","Hawkfield","Lionheart","Dawnspire","Veilburg",
    "Mistvale","Greyport","Wildegate","Stonemark","Windrift",
    "Crownpoint","Shieldwall","Redmere","Blueholm","Greenspire",
    "Cinderhall","Tidewatch","Barrowton","Helmshire","Goldenrod",
    "Saltwick","Thornford","Ravenmoor","Ironholme","Driftwood",
    "Frosthold","Ambergate","Whitecliff","Blackwater","Dunmare",
    "Skyholme","Copperhill","Brackenmere","Willowbend","Greycliff",
    "Harrowdale","Kestrelton","Pinehurst","Brindlegate","Coalhaven",
    "Millfield","Highbridge","Dustford","Longmeadow","Elmsreach",
    "Hollowford","Marshton","Ridgewell","Kettleburn","Fairhaven",
    "Lakeshore","Briarvale","Northmere","Oxbow","Quarrygate",
    "Stillwater","Wychford","Galeharbour","Oldwall","Rosethorn",
    "Ashcroft","Tinderholm","Brokenspire","Mosswick","Lanternfield",
  ];

  const FACTION_NAMES = [
    "Kingdom of Aldenmoor","The Vaelthryn Dominion","Confederacy of the Iron Coast",
    "Grand Duchy of Silvaran","The Thornwall Compact","Republic of the Golden Shore",
    "Empire of the Eastern March","The Free Cities of Mistral","Principality of Dusk",
    "The Ember Sovereignty","League of the Northern Reaches","Crown of Starfall",
    "The Ashen Covenant","Barony of Greymarch","The Crimson Accord",
    "Protectorate of the Silver Basin","The Ironwood Pact","Sultanate of the Burning Sands",
    "The Dragonscale Alliance","Commonwealth of the Pale Shore","Archduchy of Moonfall",
    "The Stormborn Collective","The Order of the Gilded Rose","Hegemony of the Black Tower",
  ];

  /* ================================================================
   *  POINTS OF INTEREST
   * ================================================================ */

  /* ================================================================
   *  POI SCALE — "major" POIs are continent-defining landmarks, events,
   *  or phenomena visible at wider zoom (alongside or before towns).
   *  "minor" POIs are local points of interest, visible when zoomed in.
   *  Types with canBeMajor:true have a random chance of being elevated.
   *  Types with alwaysMajor:true are always placed at world-scale.
   * ================================================================ */

  const MAJOR_POI_TYPES = [
    { type: "cataclysm_site", icon: "\u2622", label: "Cataclysm Site", weight: 1, alwaysMajor: true,
      prefixes: ["Shattered","Blighted","Forsaken","Annihilated","Sundered","Decimated","Ruinous","Scoured","Hollowed"],
      suffixes: ["Wastes","Crater","Scar","Desolation","Expanse","Blight","Devastation","Wound","Ruin"],
      hooks: [
        "The land itself weeps here — nothing has grown since the cataclysm. Rain evaporates before touching the ground, and compasses spin wildly within a league of the centre.",
        "Arcane residue still crackles in the air, warping creatures that linger too long. Explorers report finding twisted, glass-like formations that hum when touched.",
        "Entire armies vanished in the explosion that created this wasteland. On still nights, the clang of phantom swords and the screams of the lost can be heard on the wind.",
        "Scholars from three kingdoms debate whether the cataclysm was deliberate weapon or failed experiment. The crater is slowly growing larger, an inch per year.",
        "Birds refuse to fly over this place. Shadows fall in the wrong direction. Something at the epicentre still pulses with a sickly light.",
      ]},
    { type: "world_tree", icon: "\u2742", label: "World Tree", weight: 1, alwaysMajor: true,
      prefixes: ["Eternal","Primordial","Celestial","Living","Sacred","Mythic","Verdant","Dreaming","Ancient"],
      suffixes: ["Tree","Greatwood","Heartoak","Lifetree","Roothold","Canopy Throne","Worldspire","Evergreen"],
      hooks: [
        "Its roots are said to reach into the Underdark and its crown into the heavens. Entire ecosystems exist within its branches — some never touched by sunlight.",
        "Druids from every faction make pilgrimage here once a generation. The tree communicates through dreams to those who sleep beneath its canopy.",
        "The tree has been slowly dying for decades — no one knows why. Its falling leaves turn to gold before crumbling to ash. Some say a parasite gnaws at its heart.",
        "Cutting even a branch is said to cause earthquakes across the continent. A madman tried once — he was found turned to wood, still holding his axe.",
        "The tree is older than any recorded history. Carvings in its bark depict events that have not happened yet.",
      ]},
    { type: "titan_corpse", icon: "\u2620", label: "Titan's Remains", weight: 1, alwaysMajor: true,
      prefixes: ["Fallen","Petrified","Slumbering","Ancient","Colossal","Immense","Forgotten","Sunken","Mossgrown"],
      suffixes: ["Colossus","Titan","Giant","Leviathan","Behemoth","Goliath","Sentinel","Watcher"],
      hooks: [
        "Entire towns have been built in the hollows of its ribcage. The bone-white walls of the 'buildings' are warm to the touch, even in winter.",
        "Its blood, still liquid after millennia, pools in the lowest crevices. Alchemists prize it above gold — a single vial can fuel a month of enchantments.",
        "Some believe the titan is not dead — merely sleeping. Its heart still beats, once per century, and each beat causes tremors felt across the land.",
        "Cultists seek to resurrect it and usher in a new age of destruction. They have been gathering reagents for the ritual for three generations.",
        "Scholars argue about what killed it. The wound in its chest is the size of a lake, and the weapon that made it has never been found.",
      ]},
    { type: "great_rift", icon: "\u2301", label: "Great Rift", weight: 1, alwaysMajor: true,
      prefixes: ["Abyssal","Yawning","Screaming","Endless","Sundering","Dread","Bottomless","Howling","Gaping"],
      suffixes: ["Rift","Chasm","Abyss","Divide","Fissure","Maw","Gorge","Wound","Throat"],
      hooks: [
        "No one has ever reached the bottom — those who tried never returned. Ropes lowered into the dark are pulled taut by unseen hands before snapping.",
        "Strange creatures emerge from the depths at irregular intervals — things with too many eyes and skin like wet stone. They flee the sunlight but take livestock.",
        "The rift divides two kingdoms and neither dares build a bridge. The last attempt ended when the bridge was found dismantled overnight, every bolt removed.",
        "Echoes of voices can be heard rising from below at midnight — not screams, but conversation, as if a city thrives in the darkness far below.",
        "The air above the rift shimmers with heat even in winter. Coins dropped into it never make a sound of landing.",
      ]},
    { type: "divine_battlefield", icon: "\u2694", label: "Divine Battlefield", weight: 1, alwaysMajor: true,
      prefixes: ["Godsfall","Celestial","Hallowed","Cataclysmic","Eternal","Sacred","Mythic","Radiant","Twilight"],
      suffixes: ["Battlefield","Wargrounds","Fields","Arena","Stand","Theatre","Clash","Reckoning"],
      hooks: [
        "Gods clashed here in an age before mortals — the scars remain. Craters the size of lakes dot the landscape, and the soil is fused to glass in places.",
        "Weapons of divine make still litter the field, too powerful for mortal hands. Those who try to lift them are struck by visions of the battle that broke the world.",
        "The sky above this place is permanently stained a bruised violet, and stars are visible even at noon. Rain falls upward from the ground on moonless nights.",
        "Prayers spoken here are said to be heard directly by the gods. Pilgrims come from every land, but not all receive answers they want to hear.",
        "The ground trembles in a slow rhythm, like a heartbeat. Historians believe a god fell here and their divine essence still seeps through the earth.",
      ]},
    { type: "arcane_maelstrom", icon: "\u29BF", label: "Arcane Maelstrom", weight: 1, alwaysMajor: true,
      prefixes: ["Roiling","Unstable","Screaming","Wild","Prismatic","Chaotic","Devouring","Howling","Fractured"],
      suffixes: ["Maelstrom","Vortex","Storm","Tempest","Nexus","Anomaly","Eye","Spiral","Tear"],
      hooks: [
        "Magic behaves unpredictably for miles around — spells misfire, potions change effect, and enchanted items flicker. Wizards avoid this place but cannot stop studying it.",
        "The maelstrom appeared a century ago and has been slowly expanding, consuming a quarter-mile of land each decade. If it is not stopped, it will swallow the nearest city within thirty years.",
        "Wizards from across the realm study it from observation posts built at what they hope is a safe distance. Three posts have been destroyed so far.",
        "Artefacts thrown into the vortex sometimes return — transformed into something else entirely. A merchant threw in a copper coin and retrieved a singing diamond.",
        "The colours visible within the maelstrom do not exist anywhere else in nature. Artists who try to paint them go mad trying to mix the right pigments.",
      ]},
    { type: "sealed_evil", icon: "\u2718", label: "Sealed Prison", weight: 1, alwaysMajor: true,
      prefixes: ["Bound","Sealed","Warded","Chained","Imprisoned","Entombed","Locked","Eternal","Unbroken"],
      suffixes: ["Prison","Seal","Binding","Ward","Containment","Vault","Cage","Vigil","Watch"],
      hooks: [
        "Something ancient and terrible is imprisoned here — the wards are weakening. The runes carved into the foundation stones flicker where they once blazed with light.",
        "An order of paladins has guarded this site for over a thousand years, passing the duty from parent to child. Their numbers are dwindling and they are desperate for recruits.",
        "Earthquakes near the seal are growing more frequent and violent. Last month, a crack appeared in the outermost ward-ring for the first time in recorded history.",
        "The entity within whispers promises of power to anyone who draws near. Three guards have deserted in the past year, each found dead within a week, smiling.",
        "Nobody alive remembers what is sealed inside. The original records were deliberately destroyed. Whatever it is, the founders of five kingdoms agreed it must never be freed.",
      ]},
    { type: "floating_citadel", icon: "\u25B3", label: "Floating Citadel", weight: 1, alwaysMajor: true,
      prefixes: ["Sky","Cloud","Storm","Astral","Drifting","Soaring","Windborne","Luminous","Silver"],
      suffixes: ["Citadel","Fortress","Keep","Bastion","Stronghold","Palace","Spire","Sanctum"],
      hooks: [
        "The citadel drifts on an unpredictable path across the continent, its shadow moving across the land like a slow eclipse. No one knows what steers it.",
        "Its original builders ascended into the structure generations ago and sealed the gates. Lights still move behind the windows, but no one answers when hailed.",
        "A powerful archmage claimed dominion decades ago and rains lightning on anyone who approaches by air. Ground-level diplomats are received, briefly, and sent away with gifts.",
        "The citadel casts a shadow that blights crops wherever it passes. Farmers track its course and evacuate in advance. Compensation claims fill the royal courts.",
        "On rare occasions, objects fall from the citadel — books in unknown scripts, mechanical birds that sing one song then crumble, seeds that grow into glass flowers.",
      ]},
  ];

  const POI_TYPES = [
    { type: "ruins",       icon: "\u26D1", label: "Ruins",       weight: 3, canBeMajor: true,
      prefixes: ["Forgotten","Crumbling","Ancient","Sunken","Overgrown","Blighted","Shattered","Moss-draped","Half-buried","Vine-choked"],
      suffixes: ["Ruins","Remains","Relics","Foundations","Vestiges","Bones","Remnants","Footprint"],
      hooks: [
        "A spectral guardian in corroded armour demands tribute of memory — visitors must share a secret to pass, and those who lie are found wandering the ruins for days, babbling.",
        "Scholars from the Ivory College seek a lost codex believed to contain the true name of a dead god. They are willing to hire discreet adventurers.",
        "Strange lights bloom above the broken stones on moonless nights, forming geometric patterns visible only from the hilltop. Locals call them 'the old ones dreaming.'",
        "A thieves' guild has claimed the tunnels beneath as their headquarters. They pay the local lord a cut and he pretends the ruins are haunted to keep visitors away.",
        "The ruins predate every known civilisation by thousands of years. The stone is made of a material no mason can identify, and it does not weather, crack, or chip.",
      ]},
    { type: "dungeon",     icon: "\u2694", label: "Dungeon",     weight: 2,
      prefixes: ["Black","Iron","Bone","Shadow","Crimson","Silent","Howling","Sorrow","Dread","Weeping"],
      suffixes: ["Depths","Crypt","Vaults","Pit","Labyrinth","Catacombs","Oubliette","Underhall"],
      hooks: [
        "Prisoners who were thrown inside were never seen again — but their voices can still be heard echoing up the shaft, speaking in languages they never knew in life.",
        "A lich of immense power has claimed the lowest level as its throne room. It tolerates visitors on the upper floors and seems to be waiting for something specific.",
        "Adventurers report the walls rearranging themselves between visits. Maps drawn on one expedition are useless on the next. Something is testing them.",
        "A vein of rare arcane ore runs through the deepest chamber — worth a fortune, but guarded by things that have never seen sunlight and cannot tolerate it.",
        "The dungeon was originally a treasury. The vault doors are still sealed, protected by magical locks that have defeated every thief and wizard who tried them.",
      ]},
    { type: "temple",      icon: "\u2719", label: "Temple",      weight: 2,
      prefixes: ["Sacred","Golden","Twilight","Crystal","Eternal","Hallowed","Blessed","Silent","Radiant","Ivory"],
      suffixes: ["Temple","Sanctuary","Basilica","Shrine","Cathedral","Chapel","Tabernacle","Abbey"],
      hooks: [
        "Pilgrims flock here seeking a miraculous healing spring beneath the altar. The water cures wounds but extracts a toll — each healed person forgets their happiest memory.",
        "The high priest locked himself inside three months ago and has not emerged. Through the sealed doors, chanting can be heard day and night in a voice that is not his.",
        "An ancient prophecy etched into the altar has been deliberately half-erased. The remaining words speak of a chosen one and a city that will burn. Three cities claim the prophecy refers to a rival.",
        "A rival faith has sent operatives to desecrate this holy site. The temple guard is on high alert, but the infiltrators are patient and well-funded.",
        "The temple bells ring of their own accord at unpredictable hours, each time in a different sequence. A deaf monk claims he can hear them and that they are counting down.",
      ]},
    { type: "cave",        icon: "\u25CE", label: "Cave",        weight: 2,
      prefixes: ["Echoing","Crystal","Dripping","Frozen","Serpent's","Wind","Deep","Glittering","Worm-carved","Phosphor"],
      suffixes: ["Caverns","Grotto","Hollow","Den","Tunnels","Caves","Undercroft","Deeps"],
      hooks: [
        "Miners who broke through a wall found a chamber filled with perfectly preserved ancient weapons — then the tunnel collapsed behind them and a new noise began in the dark.",
        "A dragon has been spotted entering at dusk and not emerging until dawn. The cave mouth glows faintly orange on those nights, and the surrounding stone is warm to the touch.",
        "Rare bioluminescent fungi carpet the walls, prized by alchemists for potions of darkvision. Harvesting them attracts the cave's guardian — a fungal entity of vast intelligence.",
        "An underground river flows through the deepest chamber toward an unknown destination. Explorers who followed it by boat report hearing a city's worth of voices before turning back in fear.",
        "The cave walls are covered in paintings so old the pigment has fused with the stone. They depict creatures that match no known bestiary, and one painting shows a map of the stars — from a different sky.",
      ]},
    { type: "tower",       icon: "\u25B3", label: "Tower",       weight: 2,
      prefixes: ["Stargazer's","Obsidian","Ivory","Storm","Whispering","Runed","Lonely","Crooked","Shattered","Midnight"],
      suffixes: ["Tower","Spire","Pinnacle","Watchtower","Obelisk","Beacon","Needle","Pillar"],
      hooks: [
        "A reclusive wizard guards a powerful artefact in the uppermost chamber. She is not hostile but demands a favour of equal value from anyone who wishes to speak with her.",
        "Signal fires were lit here before the last great war, and the mechanism still works. Three kingdoms have standing orders to mobilise if this beacon is ever lit again.",
        "The top floor of the tower exists in a different plane of existence. Those who reach it describe a city of glass under an alien sky. They can never agree on the details.",
        "Locals avoid this place after hearing strange music drifting down at night — stringed instruments playing melodies that make listeners weep for reasons they cannot explain.",
        "The tower was never finished. Construction halted a century ago when every builder began having the same nightmare. The scaffolding still clings to the upper floors, weathered but intact.",
      ]},
    { type: "grove",       icon: "\u2766", label: "Grove",       weight: 2,
      prefixes: ["Moonlit","Ancient","Whispering","Faerie","Elder","Singing","Thornwoven","Silvered","Dream","Verdant"],
      suffixes: ["Grove","Glade","Thicket","Wood","Dell","Copse","Bower","Heartwood"],
      hooks: [
        "Druids perform seasonal rites here under the full moon, their chanting audible for miles. Those who interrupt the ceremony are politely but firmly turned into badgers for a week.",
        "The trees walk when no one is watching — or so the woodcutters insist. The grove's perimeter shifts by a few dozen yards every season, always moving toward the nearest settlement.",
        "A dryad queen presides over this grove and protects it fiercely from loggers. She has been known to bargain: one favour from the wood in exchange for one favour owed to the wood.",
        "Rare herbs with potent magical properties grow only within this grove's boundary. Transplanting them fails; seeds refuse to sprout more than a day's walk from the mother plants.",
        "At dawn, the entire grove hums at a frequency felt in the chest rather than heard. Birds fall silent. Animals stand still. Something deep beneath the roots stirs, then settles.",
      ]},
    { type: "mine",        icon: "\u2692", label: "Mine",        weight: 1,
      prefixes: ["Abandoned","Deep","King's","Lost","Flooded","Cursed","Rich","Hollow","Broken","Echo"],
      suffixes: ["Mine","Quarry","Dig","Excavation","Lode","Shaft","Delve","Works"],
      hooks: [
        "The veins dried up overnight — or so the miners claim. In truth, something moved into the lower tunnels, and the foreman sealed the shaft with the crew's own tools.",
        "Something in the deepest gallery has been tunnelling upward with disturbing precision, carving smooth cylindrical passages through solid rock. No tool marks are visible.",
        "A rare gemstone was found that shines with inner light and hums when held. The finder went mad within a week, and the stone is now locked in the assayer's vault.",
        "A labour dispute between rival mining guilds has turned violent. Both sides are hiring mercenaries, and the ore supply to three cities has been cut off.",
        "The oldest shaft connects to a natural cavern filled with breathable air and impossible vegetation. Flowers grow without sunlight. The miners refuse to enter.",
      ]},
    { type: "battlefield", icon: "\u2020", label: "Battlefield", weight: 1, canBeMajor: true,
      prefixes: ["Bloodied","Fallen","Last","Burning","Silent","Ashen","Grim","Sorrowful","Iron","Haunted"],
      suffixes: ["Fields","Grounds","Stand","March","Front","Moor","Heath","Crossing"],
      hooks: [
        "On the anniversary of the battle, ghostly armies clash from dusk until dawn. Spectral soldiers fight the same doomed engagement, and living witnesses feel wounds that aren't there.",
        "A legendary warlord's enchanted blade was lost here during the final charge and never recovered. Fortune seekers have been searching for a century; several have died in the attempt.",
        "Mass graves shift after heavy rains, revealing old relics — corroded medals, shattered helms, and occasionally something valuable enough to attract treasure hunters from across the realm.",
        "Veterans of the losing side make an annual pilgrimage to mourn. A permanent encampment has grown around the site, and old soldiers trade stories and debts of honour by firelight.",
        "The soil is still stained red in places where the fighting was fiercest. Nothing grows in those patches, and animals refuse to cross them even in broad daylight.",
      ]},
    { type: "monument",    icon: "\u2726", label: "Monument",    weight: 1, canBeMajor: true,
      prefixes: ["Titan's","Broken","Weeping","Sun","Storm","Herald's","Nameless","Carved","Colossal","Primordial"],
      suffixes: ["Monolith","Colossus","Marker","Pillar","Statue","Stone","Effigy","Obelisk"],
      hooks: [
        "The statue's expression changes with the seasons — serene in spring, anguished in winter. Sculptors insist the stone has not been altered, yet the change is unmistakable.",
        "No one knows who built this monument or why. It predates every written record, every oral tradition, every ruin in the known world. It simply is, and always has been.",
        "Those who press their palm to the stone receive vivid visions of a civilisation of impossible beauty and technology — and of its sudden, catastrophic end.",
        "Treasure hunters have been digging around the base for decades, convinced a vault lies beneath. The digging keeps collapsing, as if the earth itself is protecting whatever is below.",
        "The monument hums at a pitch just below hearing during electrical storms. Birds perch on it by the hundreds before migrating, as though receiving instructions.",
      ]},
    { type: "shrine",      icon: "\u2727", label: "Shrine",      weight: 2,
      prefixes: ["Wanderer's","Forgotten","Wayside","Hidden","Mossy","Spirit","Moonstone","Pilgrim's","Roadside","Weathered"],
      suffixes: ["Shrine","Altar","Sanctum","Stone","Offering Place","Rest","Waymark","Prayer-stone"],
      hooks: [
        "Travellers who leave an offering of food or coin report safer roads and fair weather for a week afterward. Those who take from the offering bowl are invariably robbed before reaching the next town.",
        "The shrine has been defaced with crude symbols — the local nature spirit is furious and has been spoiling milk and wilting gardens for miles around until the desecration is undone.",
        "A hermit has tended this place for forty years and knows secrets about the surrounding land that no archive holds. He'll share them, but only with those he deems worthy.",
        "Bandits have been stealing the shrine's offerings and selling them in the nearest town. The shrine's guardian spirit has begun manifesting physically, and it is not forgiving.",
        "A fresh offering appears on the shrine every morning — wildflowers, bread, a copper coin — but no one in the area admits to leaving them. Footprints in the mud lead to the shrine and stop.",
      ]},
    { type: "standing_stones", icon: "\u25C7", label: "Standing Stones", weight: 1, canBeMajor: true,
      prefixes: ["Starfall","Druid's","Whispering","Elder","Twilight","Singing","Frostbitten","Iron","Warding","Sunken"],
      suffixes: ["Circle","Ring","Stones","Henge","Pillars","Megaliths","Array","Crown"],
      hooks: [
        "The stones hum in perfect harmony during certain celestial alignments. Astronomers have calculated the next alignment and every mage within a hundred leagues is making plans to attend.",
        "A shimmering portal opens briefly in the centre of the ring on the summer solstice. Last year, something came through before the portal closed. It has not been found.",
        "A secretive cult gathers here on moonless nights to perform rituals they claim will 'complete the work the builders began.' Local authorities are concerned but lack evidence of a crime.",
        "Lightning strikes the tallest stone with unnatural regularity — always at midnight, always on the third day of the month. The stone bears no damage and is warm to the touch for hours afterward.",
        "Each stone bears carvings in a script no linguist has deciphered. A visiting scholar recently claimed to have translated a single word: 'warning.'",
      ]},
    { type: "shipwreck",   icon: "\u2693", label: "Shipwreck",   weight: 1,
      prefixes: ["Bleached","Storm-torn","Phantom","Rusted","Beached","Coral-crusted","Haunted","Salt-eaten","Barnacled","Splintered"],
      suffixes: ["Wreck","Hull","Remains","Graveyard","Derelict","Husk","Skeleton","Carcass"],
      hooks: [
        "The cargo manifest, still legible, lists items that should not exist: a bottled storm, a crate of frozen fire, and twelve barrels of distilled silence.",
        "Smugglers use the hull as a secret drop point for contraband. The harbourmaster is either blind or bought, and a customs officer is looking for help gathering evidence.",
        "Sea-spawn have nested inside the wreck and attack anyone who approaches within fifty yards. Their numbers are growing, and fishermen report they are becoming organised.",
        "On foggy nights, a ghost crew mans the deck — translucent sailors performing duties as if the ship were still at sea. They cannot be spoken to but react violently to trespassers.",
        "The name on the prow matches a ship that set sail three hundred years ago and was thought lost with all hands. The bodies inside are perfectly preserved, as if they died yesterday.",
      ]},
    { type: "lair",        icon: "\u2620", label: "Lair",        weight: 2,
      prefixes: ["Dread","Foul","Festering","Charred","Webbed","Bonestrewn","Putrid","Gnawed","Shadowed","Rank"],
      suffixes: ["Lair","Nest","Warren","Den","Haunt","Burrow","Hollow","Feeding Ground"],
      hooks: [
        "Livestock from nearby farms have been vanishing at night. The tracks lead here, but they change from hooves to something else entirely halfway along the trail.",
        "A bounty of 500 gold pieces has been posted for the creature's head — or proof of its death. Four parties have tried. Two came back. Neither will speak of what they saw.",
        "The creature was once a noble lord, transformed by a curse cast by a scorned lover. Breaking the curse would require ingredients found only in three different kingdoms.",
        "Tracks around the lair suggest the beast has young — at least three, possibly more. Hunters say this makes the mother ten times more dangerous and unpredictable.",
        "The lair reeks of death for a mile downwind. The creature drags its kills here and arranges the bones in deliberate patterns. A ranger says the patterns are a language.",
      ]},
    { type: "enchanted_spring", icon: "\u2604", label: "Enchanted Spring", weight: 1,
      prefixes: ["Moonwell","Silverspring","Lifebloom","Starlit","Glimmering","Fey","Dreaming","Crystal","Opal","Everflow"],
      suffixes: ["Spring","Pool","Well","Font","Waters","Basin","Mere","Source"],
      hooks: [
        "Those who drink from the spring gain vivid visions of possible futures — but only the worst ones. Those brave enough to drink twice see the best futures as well.",
        "The water heals any wound in minutes but inflicts hauntingly beautiful dreams for a week. Some travellers return again and again, chasing the dreams more than the healing.",
        "A water elemental of ancient power guards the spring against all who approach without the proper offering. The offering changes with the phase of the moon.",
        "The spring dried up a month ago for the first time in recorded history. Upstream, someone has built a dam and is siphoning the water into barrels marked with a noble house's crest.",
        "The water is perfectly clear and impossibly deep — those who look into it see their own reflection aged by decades, living a life they do not recognise.",
      ]},
    { type: "dragon_roost", icon: "\u2622", label: "Dragon Roost", weight: 1, canBeMajor: true,
      prefixes: ["Scorched","Windswept","Thundercrag","Ashfall","Wyrmscale","Smouldering","Dread","Cindered","Blackened","Stormcrown"],
      suffixes: ["Roost","Aerie","Perch","Eyrie","Peak","Throne","Lair","Crown"],
      hooks: [
        "The dragon has not been seen in three years — but the hoard remains untouched. Either it sleeps, or it watches from somewhere no one expects.",
        "A cult of fire-worshippers brings tribute to the roost every new moon. In return, the dragon has not burned a settlement in a generation. If the tribute stops, the pact ends.",
        "Dragon eggs are rumoured to be hidden in the lower caves — at least three, possibly more. Every kingdom on the continent would pay a king's ransom for a living egg.",
        "The dragon is actually polymorphed and has been living as a merchant in a nearby town for decades. It protects the region from its rivals and considers the locals 'its' people.",
        "The roost is ringed with the bones of would-be dragonslayers. The most recent skeleton wears armour that was forged only five years ago.",
      ]},
    { type: "haunted_manor", icon: "\u2302", label: "Haunted Manor", weight: 1,
      prefixes: ["Ravenmoor","Blackthorn","Whispering","Wailing","Duskfall","Thornheart","Greystone","Hollowgate","Ashwick","Mournfield"],
      suffixes: ["Manor","Estate","Hall","House","Mansion","Lodge","Grange","Holdfast"],
      hooks: [
        "The last heir went mad thirty years ago and bricked themselves inside. The masonry is seamless, but candlelight moves behind the windows every night.",
        "Servants' ghosts still set the dining table every evening at dusk — silverware, candles, three courses. By morning, the food is eaten and the plates are washed.",
        "A hidden vault beneath the wine cellar has never been opened despite numerous attempts. The lock is mechanical, not magical, but its complexity defeats every locksmith.",
        "From outside, the manor looks pristine — freshly painted, gardens trimmed, windows gleaming. Step through the front door and you find thirty years of ruin and decay.",
        "The portrait gallery is the most unsettling room. The painted eyes of the family follow visitors, and the final portrait — the frame clearly meant for the missing heir — paints itself a little more each night.",
      ]},
    { type: "fairy_ring",  icon: "\u2740", label: "Fairy Ring",   weight: 1,
      prefixes: ["Twinkling","Moonbeam","Dewdrop","Gossamer","Prismatic","Shimmering","Dancing","Iridescent","Glimmer","Silken"],
      suffixes: ["Ring","Circle","Glade","Court","Crossing","Threshold","Bower","Step"],
      hooks: [
        "Time moves differently inside — a visitor spent what felt like an hour dancing and emerged to find three years had passed. The fey consider this a generous trade.",
        "A fey lord holds court here on midsummer nights, offering bargains to mortals. Every deal is honoured to the letter, which is exactly the problem.",
        "Children who wander in return speaking a language no one can identify. They forget it within a week, but during that time they can speak to animals.",
        "On certain nights, fey music drifts from the ring — pipes and strings playing melodies of heartbreaking beauty. Those who listen too long find themselves dancing toward the ring without meaning to.",
        "A mortal woman entered the ring a decade ago and has not emerged. Her husband camps at the boundary, waiting. The fey bring him food and seem genuinely confused by his persistence.",
      ]},
    { type: "ancient_library", icon: "\u2261", label: "Ancient Library", weight: 1,
      prefixes: ["Dust-laden","Forbidden","Sealed","Arcane","Whispering","Infinite","Sunken","Coiled","Lightless","Echoing"],
      suffixes: ["Library","Archive","Athenaeum","Repository","Scriptorium","Vault","Stacks","Collection"],
      hooks: [
        "The books rearrange themselves overnight and some write new pages while no one watches. A cataloguer has been trying to index the collection for thirty years and is no closer to finishing.",
        "The forbidden section is sealed with blood magic that requires a willing sacrifice to bypass. The last person to enter emerged fluent in a dead language and unable to remember their own name.",
        "The keeper claims to have been here since the library was founded, which records suggest was over eight hundred years ago. She looks perhaps sixty, and her eyes hold something ancient.",
        "A rival mage has put out a contract for a specific tome believed to hold the key to lichdom. Several thieves have attempted the job; none returned.",
        "The deepest level of the stacks is said to contain books that read the reader — opening one fills the book with every secret the reader holds, written in their own hand.",
      ]},
    { type: "portal",      icon: "\u29BF", label: "Portal",      weight: 1, canBeMajor: true,
      prefixes: ["Shattered","Dormant","Flickering","Unstable","Ancient","Screaming","Void","Prismatic","Fractured","Blind"],
      suffixes: ["Gate","Portal","Rift","Breach","Doorway","Passage","Threshold","Tear"],
      hooks: [
        "Things occasionally fall through from the other side — objects made of unknown materials, coins bearing unfamiliar faces, and once, a single boot containing a foot.",
        "A guild of planar scholars monitors the portal around the clock and restricts access. They are deeply underfunded and increasingly desperate for patrons willing to ask no questions.",
        "The portal opened during a lightning storm two months ago and has not closed since. The air that seeps through smells of copper and tastes of winter. Something on the other side is getting closer.",
        "Three people have entered the portal voluntarily. One returned within seconds, aged by forty years. One returned after a week, believing only a minute had passed. The third has not returned.",
        "The portal's surface is perfectly reflective but shows a different landscape — green sky, red grass, and structures that hurt the eye to examine too closely.",
      ]},
    { type: "oasis",       icon: "\u2738", label: "Oasis",       weight: 1,
      prefixes: ["Hidden","Palm-fringed","Tranquil","Wanderer's","Blessed","Emerald","Serene","Jeweled","Verdant","Sheltered"],
      suffixes: ["Oasis","Haven","Refuge","Rest","Respite","Sanctuary","Wellspring","Shade"],
      hooks: [
        "A nomad tribe claims this oasis as sacred ground and guards it fiercely against outsiders. Travellers may drink but not camp — violators are left in the desert without water.",
        "The water never runs dry even in the worst droughts, and the surrounding vegetation thrives year-round. Druids say a ley-line intersection feeds the spring from deep underground.",
        "Strange fruit grows on the palm trees here — eating it grants temporary night-vision and dulls the sensation of pain. It cannot be preserved; it rots within an hour of picking.",
        "A buried temple lies beneath the sands surrounding the pool. Each sandstorm uncovers a little more of its roof, revealing mosaics of a civilisation that worshipped the water itself.",
        "The oasis is the only source of fresh water for three days' ride in any direction, making it the most strategically valuable piece of ground in the region. Two factions are preparing to fight over it.",
      ]},
    { type: "volcano",     icon: "\u2206", label: "Volcanic Vent", weight: 1, canBeMajor: true,
      prefixes: ["Smouldering","Ashen","Hellfire","Sulphur","Ember","Molten","Scorchmark","Cinderpeak","Blazing","Fuming"],
      suffixes: ["Vent","Caldera","Fissure","Maw","Crater","Furnace","Forge","Throat"],
      hooks: [
        "Fire elementals have been spotted emerging from the fissure in increasing numbers. They do not attack — they seem to be fleeing something deeper inside.",
        "A legendary forge-master seeks the volcanic heat to craft a weapon foretold in prophecy. She needs rare materials and trustworthy guards while she works.",
        "Tremors have been increasing for weeks. The ground is warm underfoot for a mile in every direction, and a plume of ash rises higher each day. Evacuation plans are being drawn up.",
        "Rare volcanic obsidian found only here is prized by enchanters — a fist-sized piece is worth a year's wages. The mining operation is dangerous, and the volcano is getting angrier.",
        "Deep within the caldera, an ancient fire dragon is said to slumber, its body heat keeping the mountain alive. If it wakes, half the continent will know about it.",
      ]},
    { type: "prison",      icon: "\u2612", label: "Prison",      weight: 1,
      prefixes: ["Iron","Black","Rotting","Forsaken","Condemned","Desolate","Shackled","Rust","Chain","Grief"],
      suffixes: ["Prison","Gaol","Stockade","Penitentiary","Dungeon","Keep","Barracks","Cage"],
      hooks: [
        "A political prisoner with valuable intelligence about a planned invasion is held in the deepest cell. Multiple factions want this person freed — or silenced permanently.",
        "The warden has been making deals with dark powers, trading prisoners' life-force for youth and strength. The guards suspect but fear for their families if they speak up.",
        "A mass breakout six months ago left the place in ruins — but a handful of prisoners chose to stay. They say what is outside is worse than what is in.",
        "Underground fighting pits operate in the lower levels, drawing wealthy spectators from across the region. Prisoners fight for privileges; the warden profits enormously.",
        "The prison was built to hold one specific prisoner. That prisoner escaped a decade ago, and the cell — covered in scratched equations and prophecies — has become a pilgrim site for mad scholars.",
      ]},
    { type: "marketplace", icon: "\u2617", label: "Black Market", weight: 1,
      prefixes: ["Shadowed","Midnight","Smuggler's","Whispering","Veiled","Thieves'","Hidden","Crooked","Underway","Lamplit"],
      suffixes: ["Bazaar","Market","Exchange","Den","Emporium","Fence","Fair","Souk"],
      hooks: [
        "Stolen artefacts from the capital have surfaced here, including a crown jewel that was supposed to be under magical lock. The thieves' guild denies involvement, which means they are definitely involved.",
        "A mysterious merchant in a bone-white mask sells maps to places that do not exist yet. Three customers followed their maps and found the locations exactly as drawn, including treasure.",
        "The thieves' guild runs the entire operation and demands a fifteen percent cut of all transactions. Those who refuse lose their merchandise and their kneecaps, in that order.",
        "Rare poisons, forbidden spell components, and cursed objects can be found here if you know the right questions to ask. The wrong questions are met with silence and a very long stare.",
        "An informant claims that a powerful noble is the secret patron of the market. Exposing them would cause a political earthquake — if the informant lives long enough to testify.",
      ]},
  ];

  /* ================================================================
   *  CITY FLAVOR DATA
   * ================================================================ */

  /* ================================================================
   *  SPATIALLY-AWARE CITY FLAVOR
   *  Each entry has a `req` object with spatial conditions. A trait is
   *  eligible only if ALL specified conditions are met. Unspecified
   *  conditions are treated as "any". This ensures that "stronghold
   *  against northern raiders" only appears in the north, "sea cliffs"
   *  only on the coast, etc.
   *
   *  Condition keys:
   *    compass : "north"|"south"|"east"|"west"|"central"|"any"
   *    terrain : "mountain"|"highland"|"lowland"|"any"
   *    coast   : "coastal"|"near"|"interior"|"any"
   *    border  : true (near faction border) | false | undefined (any)
   * ================================================================ */

  const CITY_TRAITS = [
    // --- Universal ---
    {text:"built on the bones of a far older civilisation — strange carvings surface in every cellar dig", req:{}},
    {text:"home to a renowned academy of the arcane arts, its towers crowned with crackling wardstones", req:{}},
    {text:"famous for the Hall of Mending, where healers channel ancient ley-line energy", req:{}},
    {text:"built around a vast fighting coliseum where champions earn glory and gold each full moon", req:{}},
    {text:"encircled by a shimmering barrier of old magic that repels the undead", req:{}},
    {text:"a sanctuary for wandering artists and bards, its streets alive with murals and music", req:{}},
    {text:"cursed since its founding — every seventh year a terrible calamity strikes without fail", req:{}},
    {text:"riddled with tunnels from a forgotten mining age; entire districts exist underground", req:{}},
    {text:"crowned with elegant sky-bridges connecting its tallest spires above the rooftops", req:{}},
    {text:"ruled by a council of merchant princes who settle disputes with commerce, not swords", req:{}},
    {text:"home to a great library whose vaulted halls stretch deeper than anyone has fully explored", req:{}},
    {text:"built around a massive petrified tree, its roots forming the foundations of every district", req:{}},
    {text:"renowned for its annual Festival of Masks, when all debts and grudges are forgiven for three days", req:{}},
    {text:"guarded by an elite order of paladins who swear oaths of silence upon initiation", req:{}},
    {text:"famous for its sprawling night market, where rare and forbidden goods change hands by lantern light", req:{}},

    // --- Coastal ---
    {text:"a bustling harbour where tall-masted galleons jostle for berth alongside fishing skiffs", req:{coast:"coastal"}},
    {text:"perched on wind-battered sea cliffs, its buildings anchored to the rock with iron bolts", req:{coast:"coastal"}},
    {text:"wrapped around a sheltered bay where the water runs so clear you can see the sandy bottom", req:{coast:"coastal"}},
    {text:"famous for its towering lighthouse, whose enchanted flame is said to be visible for forty leagues", req:{coast:"coastal"}},
    {text:"a port of call for ships from distant continents, its docks fragrant with foreign spices", req:{coast:"coastal"}},
    {text:"built on wooden stilts over the tidal flats, connected by rope-bridges and lantern-lit walkways", req:{coast:"coastal"}},
    {text:"home to the Tide Wardens, an order of sea-mages who calm storms and guide ships through fog", req:{coast:"coastal"}},
    {text:"known for its salt-crusted walls and the constant cry of gulls wheeling overhead", req:{coast:"coastal"}},

    // --- Interior ---
    {text:"surrounded by golden farmland as far as the eye can see, its granaries always full", req:{coast:"interior"}},
    {text:"a major crossroads where four trade routes converge, its inns packed with merchants and mercenaries", req:{coast:"interior"}},
    {text:"surrounded by sun-drenched vineyards that produce the finest wine on the continent", req:{coast:"interior", terrain:"lowland"}},
    {text:"built around steaming hot springs said to cure any ailment — the bathhouses never close", req:{coast:"interior"}},
    {text:"hidden in a deep valley, accessible only by a single winding road through dense forest", req:{coast:"interior"}},
    {text:"built at the ford of a wide, slow river; ferrymen and bargemen are the town's lifeblood", req:{coast:"interior"}},
    {text:"sitting in the shadow of an ancient aqueduct that still carries water from the distant hills", req:{coast:"interior"}},
    {text:"home to the largest livestock market in the region — the bellowing of cattle fills the morning air", req:{coast:"interior"}},

    // --- Mountain / Highland ---
    {text:"its forges burn day and night, fed by rich veins of iron and coal from the surrounding peaks", req:{terrain:"mountain"}},
    {text:"carved directly into a sheer cliff face, its windows glowing like a constellation at night", req:{terrain:"mountain"}},
    {text:"reached only by a stomach-churning stairway of 2,000 steps cut into living rock", req:{terrain:"mountain"}},
    {text:"crowned with stone observatories where star-readers chart the heavens and predict disasters", req:{terrain:"mountain"}},
    {text:"perched above the cloud line on a windswept plateau, the world spread out below like a map", req:{terrain:"highland", coast:"interior"}},
    {text:"built in the crater of an extinct volcano, its soil impossibly fertile and warm year-round", req:{terrain:"mountain"}},
    {text:"straddling a narrow mountain pass — every traveller must pass through its iron gates", req:{terrain:"mountain"}},
    {text:"known for its echo-stone amphitheatre where a whisper can be heard across a thousand seats", req:{terrain:"highland"}},

    // --- Compass-directional ---
    {text:"a fortress-town hardened against raiders from the frozen north, its walls scarred by siege", req:{compass:"north", border:true}},
    {text:"the first line of defence against incursions from the south, its garrison always on alert", req:{compass:"south", border:true}},
    {text:"a watchtower settlement guarding the eastern frontier, its beacon fires ready at all hours", req:{compass:"east", border:true}},
    {text:"a bastion on the western marches, where soldiers patrol the borderlands in shifts", req:{compass:"west", border:true}},
    {text:"warmed by gentle southern breezes, its orchards heavy with fruit even in autumn", req:{compass:"south", coast:"interior"}},
    {text:"battered by bitter northern gales — its people are as tough and weathered as the stone they build with", req:{compass:"north"}},
    {text:"blessed by long southern summers, flower gardens line every street and rooftop", req:{compass:"south"}},
    {text:"where the northern aurora dances overhead on clear nights, painting the snow in green and violet", req:{compass:"north"}},

    // --- Border / frontier ---
    {text:"a walled garrison town on the frontier, its population swelling with soldiers and camp followers", req:{border:true}},
    {text:"a refuge for the displaced — shanty camps ring the walls and food runs short every winter", req:{border:true}},
    {text:"a smuggler's paradise straddling disputed territory, where loyalty is bought and sold nightly", req:{border:true}},
    {text:"a tense border settlement where two flags fly and tavern brawls turn political without warning", req:{border:true}},

    // --- Grand cathedral (interior capitals feel) ---
    {text:"dominated by a soaring cathedral whose bells ring out across the valley at dawn and dusk", req:{coast:"interior"}},
  ];

  const CITY_TRADES = [
    // --- Universal ---
    {text:"enchanted gemstones cut by master jewellers",  req:{}},
    {text:"bolts of spell-woven cloth that change colour with the wearer's mood", req:{}},
    {text:"rare herbs and potions brewed by hedge-witches in the back alleys", req:{}},
    {text:"illuminated tomes and spell-scrolls copied by monastic scribes", req:{}},
    {text:"volatile alchemical reagents, shipped in warded crates", req:{}},
    {text:"masterwork plate armour bearing the city's hallmark stamp", req:{}},
    {text:"intricate clockwork mechanisms and self-winding music boxes", req:{}},
    {text:"holy relics authenticated by the temple's high archivist", req:{}},
    {text:"raw arcane components — powdered moonstone, phoenix ash, troll bile", req:{}},
    {text:"fine instruments crafted from resonance-wood and dragon-gut strings", req:{}},

    // --- Coastal ---
    {text:"tall timber and shipbuilding supplies hauled down from the coastal forests", req:{coast:"coastal"}},
    {text:"barrels of sea-salt and smoked fish that supply half the continent's larders", req:{coast:"coastal"}},
    {text:"whale oil and ambergris, harvested by deep-water harpooners", req:{coast:"coastal"}},
    {text:"exotic spices arriving by the shipload from lands across the sea", req:{coast:"coastal"}},
    {text:"lustrous pearls and fire-coral prised from the reef beds at low tide", req:{coast:"coastal"}},
    {text:"fresh catches auctioned on the docks before the morning mist lifts", req:{coast:"coastal"}},
    {text:"sea-glass trinkets and coral jewellery crafted by the shore-folk", req:{coast:"coastal"}},

    // --- Interior ---
    {text:"wagonloads of grain and fat livestock driven in from the surrounding farms", req:{coast:"interior"}},
    {text:"silk and luxury goods carried along the old caravan road", req:{coast:"interior"}},
    {text:"cask after cask of dwarven stout and highland whisky", req:{coast:"interior"}},
    {text:"golden honey and fragrant beeswax from the wildflower meadows", req:{coast:"interior"}},
    {text:"herds of warhorses bred on the open grasslands, prized by every army", req:{coast:"interior"}},

    // --- Mountain ---
    {text:"raw iron ore and weapons hammered in the mountain forges", req:{terrain:"mountain"}},
    {text:"silver filigree and gemstone jewellery set by highland artisans", req:{terrain:"mountain"}},
    {text:"blocks of veined marble quarried from the high cliffs", req:{terrain:"mountain"}},
    {text:"precision glasswork and lenses ground by mountain monks", req:{terrain:"highland"}},
    {text:"dragon-bone carvings, scrimshaw, and scale-mail fragments", req:{terrain:"mountain"}},
    {text:"rare alpine crystals said to amplify divination magic", req:{terrain:"mountain"}},

    // --- Northern ---
    {text:"thick furs, cured leathers, and wolf-pelt cloaks for the coming winter", req:{compass:"north"}},
    {text:"frost-hardened timber that resists rot and fire alike", req:{compass:"north"}},
    {text:"preserved mammoth ivory dug from the permafrost", req:{compass:"north"}},

    // --- Southern ---
    {text:"casks of sun-ripened wine and cold-pressed olive oil", req:{compass:"south"}},
    {text:"tropical fruits, ground spices, and fragrant incense", req:{compass:"south"}},
    {text:"brightly dyed cotton and woven reed baskets from the delta villages", req:{compass:"south"}},
  ];

  const CITY_NPCS = [
    {name:"Aldric the Grey",       role:"retired adventurer who runs the Broken Crown tavern",
     detail:"Lost his sword-arm years ago but still wins every arm-wrestling contest with his left. Knows the location of three unfound dungeons."},
    {name:"Sister Maelis",         role:"temple healer with a mysterious past",
     detail:"Arrived a decade ago with no memory of her life before. Her healing touch leaves faint silver scars that never fade."},
    {name:"Grimjaw",               role:"half-orc master blacksmith",
     detail:"Forges enchanted blades and refuses to sell to anyone he considers unworthy. Keeps a locked room in the back no one is allowed to enter."},
    {name:"Lady Elowen",           role:"noblewoman and secret resistance leader",
     detail:"Publicly hosts lavish banquets while funnelling gold to insurgents. Has three escape tunnels built into her manor."},
    {name:"Pip Shortwick",         role:"halfling information broker",
     detail:"Runs a 'lost and found' shop that is actually a front for the finest spy network in three kingdoms. Allergic to cats."},
    {name:"Captain Voss",          role:"battle-scarred guard captain",
     detail:"Trusts no one since the night her own lieutenant tried to assassinate her. Sleeps with one eye open, literally — a magical eye."},
    {name:"Theren Silkfoot",       role:"elven merchant prince",
     detail:"Has contacts in every major city on the continent. Rumoured to be over four hundred years old and to have personally known the last Elven Queen."},
    {name:"Magister Oran",         role:"eccentric wizard and professor",
     detail:"Studies forbidden temporal magic in his tower. His familiar is a talking cat that insults everyone. Time moves strangely in his study."},
    {name:"Brenna Ashwood",        role:"ranger and wilderness guide",
     detail:"Can track a sparrow through a thunderstorm. Bears a scar from a werewolf bite but claims she resisted the curse through sheer stubbornness."},
    {name:"Old Morwen",            role:"fortune teller and seer",
     detail:"Every prediction she has made in thirty years has come true, but always in an unexpected way. Charges one secret per reading."},
    {name:"Kael Ironhand",         role:"dwarven inventor and engineer",
     detail:"Building a steam-powered golem in his workshop. Has already blown up two buildings and the town council has given him one last chance."},
    {name:"Sera Nightbloom",       role:"apothecary and suspected poisoner",
     detail:"Her remedies are miraculous, but three of her former rivals died of 'natural causes.' Nobody can prove anything. She smiles a lot."},
    {name:"Brother Aldous",        role:"monk librarian and keeper of forbidden texts",
     detail:"Guards the Sealed Archive beneath the monastery. Has read every book inside but refuses to discuss what he learned. His hair turned white overnight."},
    {name:"Rook",                  role:"mysterious hooded figure at the crossroads inn",
     detail:"Nobody knows Rook's real name, face, or gender. Appears to be everywhere at once. Pays in old coins that no banker can identify."},
    {name:"Warden Thatch",         role:"prison keeper with a heart of gold",
     detail:"Sneaks extra rations to prisoners and once helped an innocent man escape. The magistrate suspects but can't prove it."},
    {name:"Lyric",                 role:"bard and covert intelligence operative",
     detail:"Her songs contain coded messages for resistance cells across the kingdom. Anyone who listens closely enough can piece together a map."},
    {name:"Dame Korrath",          role:"disgraced knight seeking redemption",
     detail:"Once served a tyrant king and carries the guilt of every order she followed. Will accept any quest that lets her save rather than destroy."},
    {name:"Fenwick the Pale",      role:"reformed necromancer and healer",
     detail:"Swore off dark magic after accidentally raising his own grandmother. Now uses his knowledge of death to save the dying. Very awkward at parties."},
    {name:"Tilda Bramblethorn",    role:"gnome alchemist with explosive tendencies",
     detail:"Holds the record for most buildings destroyed by a single person in peacetime (seven). Her potions are brilliant when they don't detonate."},
    {name:"The Cartographer",      role:"enigmatic mapmaker",
     detail:"Draws maps of places that do not exist yet. Three of his 'fictional' locations were later discovered exactly as drawn. Refuses to explain."},
    {name:"Harsk One-Eye",         role:"dockmaster and retired pirate",
     detail:"Knows every smuggling route along the coast. Will trade favours for stories. Has a parrot that speaks three languages and insults everyone."},
    {name:"Vesper Ashcloak",       role:"shadow broker and fence",
     detail:"Operates from a moving wagon that is never in the same place twice. Can acquire anything for a price — the more dangerous, the more she charges."},
    {name:"Bael Cindertongue",     role:"dragonborn lorekeeper",
     detail:"Carries a staff carved from a dragon's thighbone. Speaks fourteen languages including two that have been dead for a thousand years."},
    {name:"Mirra Dawnweaver",      role:"elven diplomat and spymaster",
     detail:"Smiles warmly while memorising everything you say. Has prevented two wars and started one. Nobody is sure which one she started."},
    {name:"Gromm the Unyielding",  role:"arena champion turned tavern bouncer",
     detail:"Undefeated in 47 arena bouts. Retired after his opponent turned out to be his long-lost son. Now breaks up bar fights with a disappointed look."},
  ];

  const CITY_HOOKS = [
    // --- Universal ---
    {text:"A mysterious plague is creeping through the lower quarters — the healers are baffled and the temples are overwhelmed.", req:{}},
    {text:"The ruling family's two heirs are at each other's throats. Both have hired sellswords. Civil war is a knife's edge away.", req:{}},
    {text:"A sinkhole swallowed three market stalls and exposed a warren of ancient catacombs. Something down there is moving.", req:{}},
    {text:"Every night for the past week, ghostly lights have drifted above the rooftops. The watch refuses to investigate.", req:{}},
    {text:"The city's greatest hero vanished during a routine border patrol. Her horse returned alone, saddle soaked in blood.", req:{}},
    {text:"The new tax collector arrived with fifty soldiers and a writ of unlimited authority. Three businesses have already been shuttered.", req:{}},
    {text:"A travelling carnival set up outside the gates. Since then, townsfolk have been sleepwalking toward the big tent at midnight.", req:{}},
    {text:"Workers expanding the cellar of the old guildhall broke through into a sealed vault. The air that escaped smelled of copper and ozone.", req:{}},
    {text:"The well water has begun to glow faintly blue after dark. Animals that drink it behave strangely for days.", req:{}},
    {text:"A senior officer of the watch was found dead in his locked quarters — no wounds, no poison, just a look of absolute terror.", req:{}},
    {text:"The ancient ward-stones that protect the city walls are cracking. The enchanter who maintained them died last month with no apprentice.", req:{}},
    {text:"Someone is burning noble estates one by one, always on moonless nights. Each fire leaves a charred sigil on the doorstep.", req:{}},
    {text:"Grave robbers broke into the founder's tomb and fled screaming. They refuse to say what they saw. The tomb is now sealed by the guard.", req:{}},
    {text:"Astronomers say the Red Comet will be visible within the month. Three different doomsday cults are already preaching in the square.", req:{}},
    {text:"The Weavers' Guild and the Ironmongers' Guild have armed their apprentices. A turf war is brewing and the watch is outnumbered.", req:{}},
    {text:"Children have been vanishing from the orphanage, one each week. The headmistress insists they 'went to better homes.'", req:{}},
    {text:"A petrified dragon egg was unearthed during construction. Three factions want it and none of them are willing to share.", req:{}},

    // --- Coastal ---
    {text:"A wrecked ship washed ashore with its cargo hold sealed by powerful wards. The harbourmaster won't let anyone near it.", req:{coast:"coastal"}},
    {text:"Pirates have grown bold enough to raid in broad daylight. The admiral's fleet is mysteriously delayed.", req:{coast:"coastal"}},
    {text:"Fishermen pulled up something massive in their nets last night. It's still alive in the warehouse, and it's growing.", req:{coast:"coastal"}},
    {text:"A ghost ship appeared in the harbour at dawn, crewed by skeletons standing at attention. By noon it had vanished, leaving only a chest on the dock.", req:{coast:"coastal"}},
    {text:"The tide has been running backwards for three days. The sea-witches say something beneath the waves is waking up.", req:{coast:"coastal"}},

    // --- Interior ---
    {text:"Three merchant caravans have vanished on the eastern road this month. No wreckage, no bodies, no tracks.", req:{coast:"interior"}},
    {text:"The wheat harvest is rotting in the fields despite perfect weather. Druids say the earth itself is poisoned.", req:{coast:"interior"}},
    {text:"Wolves the size of horses have been stalking the trade roads. Hunters say their eyes glow with an unnatural intelligence.", req:{coast:"interior"}},
    {text:"A farmer ploughed up a stone tablet covered in glowing runes. Now his crops grow overnight but his livestock won't go near the field.", req:{coast:"interior"}},

    // --- Mountain ---
    {text:"A dragon was seen circling the highest peak three nights running. It has not attacked, but the smoke rising from the summit is new.", req:{terrain:"mountain"}},
    {text:"Tremors have cracked the walls of the lower district. The miners say it is not natural — something is digging upward.", req:{terrain:"mountain"}},
    {text:"A mining crew broke through into a sealed dwarven hall. Their foreman came back alone, white-haired and unable to speak.", req:{terrain:"mountain"}},
    {text:"An avalanche revealed the entrance to a tomb that matches no known civilisation. Expeditions keep getting turned back by unseen forces.", req:{terrain:"mountain"}},

    // --- Border ---
    {text:"Refugees pour through the gates daily with horror stories of burned villages across the border.", req:{border:true}},
    {text:"Scouts report rival faction forces massing just across the border. The garrison commander is begging for reinforcements.", req:{border:true}},
    {text:"A diplomatic envoy from the rival faction was found dead at the inn — poisoned. Tensions are at breaking point.", req:{border:true}},
    {text:"Smugglers have turned the border crossing into a lawless corridor. The guard has been bribed into looking the other way.", req:{border:true}},
    {text:"A border skirmish left twelve soldiers dead. Both sides blame the other. War could erupt within the week.", req:{border:true}},

    // --- Northern ---
    {text:"Winter has lasted two months longer than it should. The elders say a frost-witch has cursed the land from her ice-tower in the peaks.", req:{compass:"north"}},
    {text:"A brutal underground fighting pit has opened in the cellars, drawing dangerous outsiders from across the frozen north.", req:{compass:"north"}},
    {text:"Hunting parties are vanishing into the northern forests. The last one left tracks that ended abruptly, as if they were lifted into the sky.", req:{compass:"north"}},

    // --- Southern ---
    {text:"A fever born in the southern marshes has reached the lower quarters. The infected speak in tongues before falling silent forever.", req:{compass:"south"}},
    {text:"The wells have run dry after the worst drought in living memory. Water is now more valuable than gold.", req:{compass:"south"}},
    {text:"Sandstorms have been sweeping in from the southern wastes, burying roads and driving venomous creatures into the streets.", req:{compass:"south"}},
  ];

  /* --- Sensory atmosphere pools (assigned during flavor pass) --- */
  const CITY_ATMOSPHERE = [
    // --- Universal ---
    {text:"The clang of hammer on anvil rings from the smith quarter at all hours", req:{}},
    {text:"Incense smoke drifts from the temple district, mingling with the smell of baking bread", req:{}},
    {text:"Lanterns sway on iron chains above the cobblestones, casting amber pools of light", req:{}},
    {text:"Stray cats watch from every rooftop and windowsill, as if keeping a silent census", req:{}},
    {text:"Street musicians play competing melodies from opposite corners of the square", req:{}},
    {text:"The scent of old parchment and candle wax seeps from the library windows", req:{}},
    {text:"Market hawkers shout over one another while children weave between the stalls", req:{}},
    {text:"Soldiers in polished mail patrol in pairs, their boot-steps echoing off the walls", req:{}},
    {text:"Laundry hangs between buildings like colourful banners, fluttering in the breeze", req:{}},
    {text:"The air smells of wood smoke, spiced stew, and something faintly magical", req:{}},

    // --- Coastal ---
    {text:"Salt wind carries the cry of gulls and the creak of rigging from the harbour", req:{coast:"coastal"}},
    {text:"The air tastes of brine and tar; fishing nets dry in the sun along every railing", req:{coast:"coastal"}},
    {text:"Waves crash against the sea wall, sending spray across the lower promenade", req:{coast:"coastal"}},
    {text:"The dock quarter reeks gloriously of fresh catch, pitch, and exotic spice", req:{coast:"coastal"}},

    // --- Interior ---
    {text:"The rich scent of turned earth and wildflowers drifts in from the surrounding fields", req:{coast:"interior"}},
    {text:"Cattle low in the distance and cart wheels creak along rutted dirt roads", req:{coast:"interior"}},
    {text:"Chimney smoke rises in lazy columns above the thatched roofs of the outer districts", req:{coast:"interior"}},

    // --- Mountain ---
    {text:"Thin mountain air carries the distant ring of pickaxes and the rumble of ore carts", req:{terrain:"mountain"}},
    {text:"Cold wind howls through the narrow streets, funnelled between sheer rock faces", req:{terrain:"mountain"}},
    {text:"The sky feels impossibly close — on clear nights you can almost touch the stars", req:{terrain:"mountain"}},

    // --- Northern ---
    {text:"Frost rimes every surface by morning; breath hangs in clouds even at midday", req:{compass:"north"}},
    {text:"Wood smoke pours from every chimney, and the crunch of snow underfoot never stops", req:{compass:"north"}},

    // --- Southern ---
    {text:"Warm air shimmers above sun-baked clay rooftops and the buzz of cicadas is constant", req:{compass:"south"}},
    {text:"Palm fronds rustle overhead and the scent of jasmine and citrus fills the evening air", req:{compass:"south"}},

    // --- Border ---
    {text:"The clank of armour and bark of drill sergeants carries from the garrison yard", req:{border:true}},
    {text:"Watchfires burn on the walls through the night and the mood in the taverns is tense", req:{border:true}},
  ];

  /* ================================================================
   *  UTILITIES
   * ================================================================ */

  function mulberry32(seed) {
    return function () {
      seed |= 0;
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (rng() * (i + 1)) | 0;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function pick(arr, rng) { return arr[(rng() * arr.length) | 0]; }

  function pickN(arr, n, rng) {
    const copy = arr.slice();
    shuffle(copy, rng);
    return copy.slice(0, n);
  }

  function distPt(ax, ay, bx, by) {
    const dx = ax - bx, dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function lerpV(a, b, t) { return a + (b - a) * t; }

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  /** Point-in-polygon (ray casting) for normalised coordinates */
  function pointInPolygon(px, py, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1];
      const xj = poly[j][0], yj = poly[j][1];
      if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  }

  /* ================================================================
   *  VALUE NOISE  (used for elevation / contour generation)
   * ================================================================ */

  class ValueNoise {
    constructor(rng, size = 256) {
      this.size = size;
      this.perm = new Uint8Array(size * 2);
      this.grad = new Float32Array(size);
      for (let i = 0; i < size; i++) {
        this.perm[i] = i;
        this.grad[i] = rng() * 2 - 1;
      }
      for (let i = size - 1; i > 0; i--) {
        const j = (rng() * (i + 1)) | 0;
        [this.perm[i], this.perm[j]] = [this.perm[j], this.perm[i]];
      }
      for (let i = 0; i < size; i++) this.perm[size + i] = this.perm[i];
    }
    _fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    noise2d(x, y) {
      const s = this.size;
      const xi = ((x | 0) % s + s) % s, yi = ((y | 0) % s + s) % s;
      const xf = x - Math.floor(x), yf = y - Math.floor(y);
      const u = this._fade(xf), v = this._fade(yf);
      const aa = this.perm[this.perm[xi] + yi];
      const ab = this.perm[this.perm[xi] + ((yi + 1) % s)];
      const ba = this.perm[this.perm[(xi + 1) % s] + yi];
      const bb = this.perm[this.perm[(xi + 1) % s] + ((yi + 1) % s)];
      return lerpV(lerpV(this.grad[aa], this.grad[ba], u), lerpV(this.grad[ab], this.grad[bb], u), v);
    }
    fbm(x, y, octaves = 4, lac = 2.0, gain = 0.5) {
      let sum = 0, amp = 1, freq = 1, max = 0;
      for (let i = 0; i < octaves; i++) {
        sum += this.noise2d(x * freq, y * freq) * amp;
        max += amp; amp *= gain; freq *= lac;
      }
      return sum / max;
    }
  }

  /* ================================================================
   *  MIN-HEAP
   * ================================================================ */

  class MinHeap {
    constructor() { this.data = []; }
    get size() { return this.data.length; }
    push(p, v) { this.data.push({ p, v }); this._up(this.data.length - 1); }
    pop() {
      const top = this.data[0]; const last = this.data.pop();
      if (this.data.length > 0) { this.data[0] = last; this._down(0); }
      return top;
    }
    _up(i) {
      const d = this.data;
      while (i > 0) { const p = (i - 1) >> 1; if (d[p].p <= d[i].p) break; [d[p], d[i]] = [d[i], d[p]]; i = p; }
    }
    _down(i) {
      const d = this.data, n = d.length;
      while (true) { let s = i, l = 2*i+1, r = 2*i+2; if (l<n && d[l].p<d[s].p) s=l; if (r<n && d[r].p<d[s].p) s=r; if (s===i) break; [d[s],d[i]]=[d[i],d[s]]; i=s; }
    }
  }

  /* ================================================================
   *  CONTINENT GENERATOR
   *  Ported from generate_fantasy_atlas.py — full shaping pipeline
   * ================================================================ */

  class ContinentGenerator {
    constructor(opts) {
      this.opts = opts;
      this.rng = null;
      this.coastStep = opts.coastlineStep || DEFAULTS.coastlineStep;
      this.coastRough = opts.coastlineRoughness || DEFAULTS.coastlineRoughness;
      this.islandRough = opts.islandRoughness || DEFAULTS.islandRoughness;
    }

    /**
     * Generate all landmasses for a seed.
     * Returns { mainland: [[x,y],...], extras: [[[x,y],...], ...], islands: [...] }
     * All coordinates are normalised 0-1.
     */
    generate(seed) {
      this.rng = mulberry32(seed);
      const rng = this.rng;

      // Generate major landmasses
      const { primary, extras } = this._generateLandmasses();

      // Generate small islands around landmasses
      const islands = this._generateIslands(primary, extras);

      return { mainland: primary, extras, islands };
    }

    /* --- Multi-continent layout selection --- */
    _generateLandmasses() {
      const rng = this.rng;
      const roll = rng();

      if (roll < 0.25) {
        // Single large centred continent
        return { primary: this._generateMainland(), extras: [] };
      } else if (roll < 0.40) {
        // Single offset continent
        const sides = [
          () => [rng() * 0.12 + 0.30, rng() * 0.20 + 0.40],
          () => [rng() * 0.12 + 0.58, rng() * 0.20 + 0.40],
          () => [rng() * 0.20 + 0.40, rng() * 0.12 + 0.30],
          () => [rng() * 0.20 + 0.40, rng() * 0.10 + 0.58],
        ];
        const [cx, cy] = pick(sides, rng)();
        return { primary: this._generateOffsetContinent(cx, cy, rng() * 0.20 + 0.80), extras: [] };
      } else if (roll < 0.65) {
        // One large + one medium
        const arr = rng() < 0.5 ? "lr" : (rng() < 0.5 ? "diagonal" : "near");
        let pcx, pcy, scx, scy;
        if (arr === "lr") {
          pcx = rng()*0.12+0.28; pcy = rng()*0.20+0.38;
          scx = rng()*0.13+0.65; scy = rng()*0.30+0.30;
        } else if (arr === "diagonal") {
          pcx = rng()*0.12+0.28; pcy = rng()*0.14+0.28;
          scx = rng()*0.13+0.62; scy = rng()*0.15+0.55;
        } else {
          pcx = rng()*0.15+0.35; pcy = rng()*0.14+0.28;
          scx = pcx + rng()*0.20-0.10; scy = rng()*0.14+0.58;
        }
        const primary = this._generateOffsetContinent(pcx, pcy, rng()*0.15+0.70);
        const secondary = this._generateOffsetContinent(scx, scy, rng()*0.20+0.40);
        return { primary, extras: [secondary] };
      } else if (roll < 0.80) {
        // Two medium side by side
        const c1 = this._generateOffsetContinent(rng()*0.13+0.25, rng()*0.25+0.35, rng()*0.15+0.55);
        const c2 = this._generateOffsetContinent(rng()*0.16+0.62, rng()*0.25+0.35, rng()*0.15+0.55);
        return c1.length >= c2.length ? { primary: c1, extras: [c2] } : { primary: c2, extras: [c1] };
      } else if (roll < 0.90) {
        // Two continents top/bottom
        const c1 = this._generateOffsetContinent(rng()*0.24+0.38, rng()*0.13+0.25, rng()*0.15+0.50);
        const c2 = this._generateOffsetContinent(rng()*0.24+0.38, rng()*0.13+0.62, rng()*0.15+0.50);
        return c1.length >= c2.length ? { primary: c1, extras: [c2] } : { primary: c2, extras: [c1] };
      } else {
        // Archipelago
        const main = this._generateOffsetContinent(rng()*0.20+0.35, rng()*0.20+0.35, rng()*0.15+0.50);
        const extras = [];
        const n = 2 + ((rng() * 3) | 0);
        for (let i = 0; i < n; i++) {
          extras.push(this._generateOffsetContinent(rng()*0.70+0.15, rng()*0.65+0.15, rng()*0.17+0.25));
        }
        return { primary: main, extras };
      }
    }

    /* --- Main continent generation --- */
    _generateMainland() {
      const rng = this.rng;
      const profiles = ["wide", "tall", "diagonal", "squat", "narrow"];
      const profile = pick(profiles, rng);
      let aspect, baseRy, cx, cy, rotation;

      switch (profile) {
        case "wide":
          aspect = rng()*0.8+1.6; baseRy = rng()*0.08+0.26;
          cx = 0.5+rng()*0.12-0.06; cy = 0.5+rng()*0.10-0.05;
          rotation = rng()*0.30-0.15; break;
        case "tall":
          aspect = rng()*0.3+0.5; baseRy = rng()*0.08+0.32;
          cx = 0.5+rng()*0.20-0.10; cy = 0.5+rng()*0.08-0.04;
          rotation = rng()*0.24-0.12; break;
        case "diagonal":
          aspect = rng()*0.8+1.4; baseRy = rng()*0.08+0.24;
          cx = 0.5+rng()*0.12-0.06; cy = 0.5+rng()*0.08-0.04;
          rotation = (rng()<0.5?-1:1)*(rng()*0.35+0.40); break;
        case "squat":
          aspect = rng()*0.8+2.2; baseRy = rng()*0.06+0.20;
          cx = 0.5+rng()*0.08-0.04; cy = 0.5+rng()*0.12-0.06;
          rotation = rng()*0.20-0.10; break;
        default: // narrow
          aspect = rng()*1.0+2.5; baseRy = rng()*0.06+0.16;
          cx = 0.5+rng()*0.10-0.05; cy = 0.5+rng()*0.10-0.05;
          rotation = rng()*1.0-0.50; break;
      }

      const numPts = 48 + ((rng() * 17) | 0); // 48-64
      let ring = this._baseEllipse(cx, cy, aspect, numPts, baseRy);
      ring = this._applyRotation(ring, cx, cy, rotation);
      ring = this._shapeContinent(ring, cx, cy);
      ring = this._roughenAndSmooth(ring, 1.0);
      return ring;
    }

    /* --- Offset / secondary continent --- */
    _generateOffsetContinent(cx, cy, scale) {
      const rng = this.rng;
      const profiles = ["wide", "wide", "tall", "diagonal", "squat"];
      const profile = pick(profiles, rng);
      let aspect, baseRy, rotation;

      switch (profile) {
        case "wide":
          aspect = rng()*0.8+1.4; baseRy = (rng()*0.08+0.22)*scale;
          rotation = rng()*0.30-0.15; break;
        case "tall":
          aspect = rng()*0.4+0.5; baseRy = (rng()*0.08+0.28)*scale;
          rotation = rng()*0.24-0.12; break;
        case "diagonal":
          aspect = rng()*0.7+1.3; baseRy = (rng()*0.08+0.20)*scale;
          rotation = (rng()<0.5?-1:1)*(rng()*0.30+0.35); break;
        default: // squat
          aspect = rng()*0.8+2.0; baseRy = (rng()*0.08+0.16)*scale;
          rotation = rng()*0.20-0.10; break;
      }

      const numPts = 48 + ((rng() * 17) | 0);
      let ring = this._baseEllipse(0.5, 0.5, aspect, numPts, baseRy);
      ring = this._applyRotation(ring, 0.5, 0.5, rotation);
      ring = this._shapeContinent(ring, 0.5, 0.5);

      // Shift to target centre
      const offX = cx - 0.5, offY = cy - 0.5;
      ring = ring.map(([x, y]) => [clamp(x + offX, 0.04, 0.96), clamp(y + offY, 0.04, 0.96)]);

      ring = this._roughenAndSmooth(ring, scale);
      return ring;
    }

    /* --- Generate islands with natural, irregular shapes --- */
    _generateIslands(mainland, extras) {
      const rng = this.rng;
      const islands = [];
      const allLand = [mainland, ...extras];
      const numIslands = 4 + ((rng() * 8) | 0); // 4-11

      // Pre-sample coastline points from all landmasses for fast distance checks
      const coastPts = [];
      for (const land of allLand) {
        const sampleStep = Math.max(1, (land.length / 40) | 0);
        for (let p = 0; p < land.length; p += sampleStep) coastPts.push(land[p]);
      }

      for (let i = 0; i < numIslands; i++) {
        const attempts = 100;
        for (let a = 0; a < attempts; a++) {
          const cx = rng() * 0.82 + 0.09;
          const cy = rng() * 0.78 + 0.09;

          // Centre must not be inside any landmass
          let bad = false;
          for (const land of allLand) {
            if (pointInPolygon(cx, cy, land)) { bad = true; break; }
          }
          if (bad) continue;

          // Must be near a coast (0.04 – 0.25 normalised)
          let minCoastDist = Infinity;
          for (const cp of coastPts) {
            const d = distPt(cx, cy, cp[0], cp[1]);
            if (d < minCoastDist) minCoastDist = d;
          }
          if (minCoastDist < 0.03 || minCoastDist > 0.25) continue;

          // Must be far enough from existing islands
          let tooClose = false;
          for (const isl of islands) {
            // Check distance to island centroid
            let icx = 0, icy = 0;
            for (const [x, y] of isl) { icx += x; icy += y; }
            icx /= isl.length; icy /= isl.length;
            if (distPt(cx, cy, icx, icy) < 0.06) { tooClose = true; break; }
          }
          if (tooClose) continue;

          // Pick an island "archetype" for shape variety
          const archetype = rng();
          let size, aspect, numPts;

          if (archetype < 0.25) {
            // Tiny rocky islet — small, roundish, rough
            size = rng() * 0.008 + 0.008;   // 0.008 - 0.016
            aspect = rng() * 0.6 + 0.7;      // 0.7 - 1.3 (roughly round)
            numPts = 20 + ((rng() * 8) | 0);
          } else if (archetype < 0.55) {
            // Long narrow island — like a reef barrier or volcanic chain
            size = rng() * 0.018 + 0.012;   // 0.012 - 0.030
            aspect = rng() * 1.5 + 1.8;      // 1.8 - 3.3 (very elongated)
            numPts = 30 + ((rng() * 14) | 0);
          } else if (archetype < 0.80) {
            // Medium irregular island — like a real island with bays and headlands
            size = rng() * 0.025 + 0.020;   // 0.020 - 0.045
            aspect = rng() * 1.2 + 0.6;      // 0.6 - 1.8
            numPts = 32 + ((rng() * 16) | 0);
          } else {
            // Large continental fragment — like a major island
            size = rng() * 0.030 + 0.035;   // 0.035 - 0.065
            aspect = rng() * 1.0 + 0.7;      // 0.7 - 1.7
            numPts = 40 + ((rng() * 20) | 0);
          }

          // Build shape
          let island = this._baseEllipse(cx, cy, aspect, numPts, size);

          // Random rotation
          const rotation = rng() * Math.PI * 2;
          const cosR = Math.cos(rotation), sinR = Math.sin(rotation);
          island = island.map(([px, py]) => {
            const dx = px - cx, dy = py - cy;
            return [cx + dx * cosR - dy * sinR, cy + dx * sinR + dy * cosR];
          });

          // Harmonic perturbations — more for larger islands
          const numH = size > 0.025 ? 3 + ((rng() * 3) | 0) : 2 + ((rng() * 2) | 0);
          island = this._applyHarmonicPerturbations(island, cx, cy, numH);

          // Shape features based on archetype and size
          if (archetype >= 0.25) {
            // Gulfs (1-2 bays with Gaussian falloff, scaled to island size)
            const numGulfs = 1 + ((rng() * 2) | 0);
            for (let g = 0; g < numGulfs; g++) {
              if (rng() < 0.7) {
                const idx = (rng() * island.length) | 0;
                const depth = size * (rng() * 0.30 + 0.12);
                const w = 2 + ((rng() * Math.max(1, island.length / 8)) | 0);
                island = this._deformRadial(island, cx, cy, idx, w, -depth);
              }
            }
            // Peninsulas / headlands (1-2 protrusions)
            const numPen = 1 + ((rng() * 2) | 0);
            for (let p = 0; p < numPen; p++) {
              if (rng() < 0.6) {
                const idx = (rng() * island.length) | 0;
                const extent = size * (rng() * 0.35 + 0.10);
                const w = 2 + ((rng() * Math.max(1, island.length / 10)) | 0);
                island = this._deformRadial(island, cx, cy, idx, w, extent);
              }
            }
          }

          // Fjord-like narrow notches on larger islands
          if (size > 0.025 && rng() < 0.5) {
            const idx = (rng() * island.length) | 0;
            const depth = size * (rng() * 0.25 + 0.10);
            const w = 1 + ((rng() * Math.max(1, island.length / 16)) | 0);
            island = this._deformRadial(island, cx, cy, idx, w, -depth);
          }

          // Direction changes for larger islands (adds small-scale irregularity)
          if (size > 0.020) {
            island = this._addSharpDirectionChanges(island, cx, cy);
          }

          // Roughen coastline — amplitude scaled to island size
          const roughAmp = (this.islandRough || 0.006) * (size / 0.025);
          island = this._roughenRing(island, roughAmp, this.coastStep * 0.7);
          if (size > 0.020) {
            island = this._roughenRingSecondary(island, roughAmp * 0.3, this.coastStep * 0.45);
          }

          // Final smooth
          island = this._smoothRing(island, 3, 0.35);

          // Clamp to map bounds
          island = island.map(([px, py]) => [
            clamp(px, 0.02, 0.98),
            clamp(py, 0.02, 0.98),
          ]);

          // ---- POST-GENERATION OVERLAP CHECK ----
          // Verify no point of the final island sits inside any landmass or
          // existing island, and no point is too close to another coastline.
          let overlaps = false;
          const checkStep = Math.max(1, (island.length / 16) | 0);
          for (let pi = 0; pi < island.length; pi += checkStep) {
            const [px, py] = island[pi];
            for (const land of allLand) {
              if (pointInPolygon(px, py, land)) { overlaps = true; break; }
            }
            if (overlaps) break;
            for (const isl of islands) {
              if (pointInPolygon(px, py, isl)) { overlaps = true; break; }
            }
            if (overlaps) break;
            // Also check no vertex is too close to a continent coastline
            for (const cp of coastPts) {
              if (distPt(px, py, cp[0], cp[1]) < 0.015) { overlaps = true; break; }
            }
            if (overlaps) break;
          }
          if (overlaps) continue;

          // Also check the reverse: no continent/island point is inside this island
          for (const cp of coastPts) {
            if (pointInPolygon(cp[0], cp[1], island)) { overlaps = true; break; }
          }
          if (overlaps) continue;
          for (const isl of islands) {
            const islStep = Math.max(1, (isl.length / 10) | 0);
            for (let pi = 0; pi < isl.length; pi += islStep) {
              if (pointInPolygon(isl[pi][0], isl[pi][1], island)) { overlaps = true; break; }
            }
            if (overlaps) break;
          }
          if (overlaps) continue;

          islands.push(island);

          // Update coastPts so subsequent islands avoid this one too
          const sampleStep = Math.max(1, (island.length / 12) | 0);
          for (let p = 0; p < island.length; p += sampleStep) coastPts.push(island[p]);

          break;
        }
      }
      return islands;
    }

    /**
     * Radial deformation helper — pushes/pulls ring points along their radial
     * direction from (cx,cy).  Positive amount = push outward (peninsula),
     * negative = pull inward (gulf/fjord).  Gaussian falloff around idx.
     */
    _deformRadial(ring, cx, cy, idx, halfWidth, amount) {
      const n = ring.length;
      const result = ring.map(p => [p[0], p[1]]);
      for (let off = -halfWidth; off <= halfWidth; off++) {
        const ni = ((idx + off) % n + n) % n;
        const sigma = Math.max(halfWidth * 0.45, 1);
        const falloff = Math.exp(-0.5 * (off / sigma) * (off / sigma));
        const d = Math.abs(amount) * falloff;
        const dx = result[ni][0] - cx, dy = result[ni][1] - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const sign = amount >= 0 ? 1 : -1;
        result[ni][0] = clamp(result[ni][0] + sign * (dx / dist) * d, 0.03, 0.97);
        result[ni][1] = clamp(result[ni][1] + sign * (dy / dist) * d, 0.03, 0.97);
      }
      return result;
    }

    /* ---- Base ellipse ---- */
    _baseEllipse(cx, cy, aspect, numPoints, baseRy) {
      const ry = baseRy;
      const rx = ry * aspect;
      const pts = [];
      for (let i = 0; i < numPoints; i++) {
        const theta = 2 * Math.PI * i / numPoints;
        const x = cx + rx * Math.cos(theta);
        const y = cy + ry * Math.sin(theta);
        pts.push([clamp(x, 0.05, 0.95), clamp(y, 0.05, 0.95)]);
      }
      return pts;
    }

    /* ---- Rotation ---- */
    _applyRotation(ring, cx, cy, rotation) {
      if (Math.abs(rotation) < 0.05) return ring;
      const cosR = Math.cos(rotation), sinR = Math.sin(rotation);
      return ring.map(([px, py]) => {
        const dx = px - cx, dy = py - cy;
        return [
          clamp(cx + dx * cosR - dy * sinR, 0.06, 0.94),
          clamp(cy + dx * sinR + dy * cosR, 0.06, 0.94),
        ];
      });
    }

    /* ---- Full shape pipeline ---- */
    _shapeContinent(ring, cx, cy) {
      const rng = this.rng;
      const numHarmonics = 3 + ((rng() * 4) | 0); // 3-6
      let r = this._applyHarmonicPerturbations(ring, cx, cy, numHarmonics);
      r = this._addGulfIndentations(r, cx, cy);
      r = this._addPeninsulaExtensions(r, cx, cy);
      r = this._addFjordsAndInlets(r, cx, cy);
      r = this._addSharpDirectionChanges(r, cx, cy);
      return r;
    }

    /* ---- Harmonic perturbations with tectonic bias ---- */
    _applyHarmonicPerturbations(ring, cx, cy, numHarmonics) {
      const rng = this.rng;
      const tectonicAngle = rng() * 2 * Math.PI;
      const tectonicStrength = rng() * 0.05 + 0.03;

      return ring.map(([px, py]) => {
        const dx = px - cx, dy = py - cy;
        const angle = Math.atan2(dy, dx);
        let d = Math.sqrt(dx * dx + dy * dy);
        let mod = 1.0;
        for (let h = 1; h <= numHarmonics; h++) {
          const phase = rng() * 2 * Math.PI;
          const amp = (rng() * 0.08 + 0.04) / Math.pow(h, 0.65);
          mod += amp * Math.sin(h * angle + phase);
        }
        mod -= tectonicStrength * Math.cos(angle - tectonicAngle);
        d *= mod;
        return [clamp(cx + d * Math.cos(angle), 0.05, 0.95), clamp(cy + d * Math.sin(angle), 0.05, 0.95)];
      });
    }

    /* ---- Gulf indentations (1-4, Gaussian falloff) ---- */
    _addGulfIndentations(ring, cx, cy) {
      const rng = this.rng;
      const n = ring.length;
      const numGulfs = 1 + ((rng() * 4) | 0);
      const modified = ring.map(p => [p[0], p[1]]);

      for (let g = 0; g < numGulfs; g++) {
        const idx = (rng() * n) | 0;
        const depth = g === 0 ? rng() * 0.08 + 0.10 : rng() * 0.07 + 0.05;
        const width = 3 + ((rng() * Math.max(1, n / 8 - 3)) | 0);

        for (let off = -width; off <= width; off++) {
          const ni = ((idx + off) % n + n) % n;
          const sigma = Math.max(width * 0.45, 1);
          const falloff = Math.exp(-0.5 * (off / sigma) * (off / sigma));
          const d = depth * falloff;
          modified[ni][0] += (cx - modified[ni][0]) * d;
          modified[ni][1] += (cy - modified[ni][1]) * d;
          modified[ni][0] = clamp(modified[ni][0], 0.05, 0.95);
          modified[ni][1] = clamp(modified[ni][1], 0.05, 0.95);
        }
      }
      return modified;
    }

    /* ---- Peninsula extensions (1-3, Gaussian falloff) ---- */
    _addPeninsulaExtensions(ring, cx, cy) {
      const rng = this.rng;
      const n = ring.length;
      const num = 1 + ((rng() * 3) | 0);
      const modified = ring.map(p => [p[0], p[1]]);

      for (let p = 0; p < num; p++) {
        const idx = (rng() * n) | 0;
        const extent = p === 0 ? rng() * 0.08 + 0.06 : rng() * 0.06 + 0.04;
        const width = 2 + ((rng() * Math.max(1, n / 10 - 2)) | 0);

        for (let off = -width; off <= width; off++) {
          const ni = ((idx + off) % n + n) % n;
          const sigma = Math.max(width * 0.40, 1);
          const falloff = Math.exp(-0.5 * (off / sigma) * (off / sigma));
          const ext = extent * falloff;
          const dx = modified[ni][0] - cx;
          const dy = modified[ni][1] - cy;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > 0.001) {
            modified[ni][0] = clamp(modified[ni][0] + (dx / d) * ext, 0.05, 0.95);
            modified[ni][1] = clamp(modified[ni][1] + (dy / d) * ext, 0.05, 0.95);
          }
        }
      }
      return modified;
    }

    /* ---- Fjords and inlets (1-3, narrow, linear falloff) ---- */
    _addFjordsAndInlets(ring, cx, cy) {
      const rng = this.rng;
      const n = ring.length;
      const num = 1 + ((rng() * 3) | 0);
      const modified = ring.map(p => [p[0], p[1]]);

      for (let f = 0; f < num; f++) {
        const idx = (rng() * n) | 0;
        const depth = rng() * 0.07 + 0.05;
        const width = 1 + ((rng() * Math.max(1, n / 20)) | 0);

        for (let off = -width; off <= width; off++) {
          const ni = ((idx + off) % n + n) % n;
          const t = Math.abs(off) / Math.max(width, 1);
          const falloff = Math.max(0, 1 - t); // linear taper
          const d = depth * falloff;
          modified[ni][0] += (cx - modified[ni][0]) * d;
          modified[ni][1] += (cy - modified[ni][1]) * d;
          modified[ni][0] = clamp(modified[ni][0], 0.05, 0.95);
          modified[ni][1] = clamp(modified[ni][1], 0.05, 0.95);
        }
      }
      return modified;
    }

    /* ---- Sharp direction changes (clustered detail zones) ---- */
    _addSharpDirectionChanges(ring, cx, cy) {
      const rng = this.rng;
      const n = ring.length;
      if (n < 12) return ring;
      const modified = ring.map(p => [p[0], p[1]]);
      const numZones = 3 + ((rng() * 4) | 0);

      // Pick zone centres
      const zoneCentres = [];
      for (let i = 0; i < numZones; i++) zoneCentres.push((rng() * n) | 0);
      zoneCentres.sort((a, b) => a - b);

      for (const zc of zoneCentres) {
        const zoneWidth = Math.max(2, (rng() * n / 8) | 0);
        const intensity = rng() * 0.025 + 0.01;

        for (let off = -zoneWidth; off <= zoneWidth; off++) {
          const i = ((zc + off) % n + n) % n;
          const t = Math.abs(off) / Math.max(zoneWidth, 1);
          const falloff = Math.max(0, 1 - t * t);
          if (rng() < 0.5 * falloff) {
            const dx = modified[i][0] - cx;
            const dy = modified[i][1] - cy;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > 0.01) {
              const push = (rng() < 0.5 ? -1 : 1) * intensity * falloff;
              modified[i][0] = clamp(modified[i][0] + (dx / d) * push, 0.05, 0.95);
              modified[i][1] = clamp(modified[i][1] + (dy / d) * push, 0.05, 0.95);
            }
          }
        }
      }
      return modified;
    }

    /* ---- Two-pass roughen + smooth (coastline detail) ---- */
    _roughenAndSmooth(ring, ampScale) {
      let r = this._roughenRing(ring, this.coastRough * ampScale, this.coastStep);
      r = this._roughenRingSecondary(r, this.coastRough * 0.35 * ampScale, this.coastStep * 0.55);
      r = this._smoothRing(r, 4, 0.32);
      return r;
    }

    /* ---- Primary roughening with rhythmic activity wave ---- */
    _roughenRing(points, amplitude, step) {
      const rng = this.rng;
      const n = points.length;
      const output = [];

      // Activity wave: 2-4 peaks
      const numPeaks = 2 + ((rng() * 3) | 0);
      const peakPhases = [], peakAmps = [];
      for (let i = 0; i < numPeaks; i++) {
        peakPhases.push(rng() * 2 * Math.PI);
        peakAmps.push(rng() * 0.7 + 0.3);
      }
      const ampSum = peakAmps.reduce((s, v) => s + v, 0);

      for (let idx = 0; idx < n; idx++) {
        const start = points[idx];
        const end = points[(idx + 1) % n];
        output.push([start[0], start[1]]);

        const dx = end[0] - start[0], dy = end[1] - start[1];
        const segLen = Math.sqrt(dx * dx + dy * dy);
        if (segLen < step * 1.2) continue;

        // Activity level for this segment
        const ringT = idx / Math.max(n, 1) * 2 * Math.PI;
        let activity = 0.15;
        for (let pk = 0; pk < numPeaks; pk++) {
          activity += peakAmps[pk] * Math.max(0, Math.cos(ringT * (pk + 1) + peakPhases[pk]));
        }
        activity = clamp(activity / (1 + ampSum * 0.5), 0.08, 1.0);
        const localAmp = amplitude * activity;

        // Perpendicular normal
        const nx = -dy / segLen, ny = dx / segLen;
        const tx = dx / segLen, ty = dy / segLen;
        const cuts = Math.max(1, (segLen / step) | 0);

        let drift = 0;
        for (let c = 1; c < cuts; c++) {
          const t = c / cuts;
          const bx = lerpV(start[0], end[0], t);
          const by = lerpV(start[1], end[1], t);
          const envelope = Math.pow(Math.sin(Math.PI * t), 0.75);
          const slide = (rng() * 2 - 1) * step * 0.12;

          drift += (rng() * 2 - 1) * localAmp * 0.35;
          drift *= 0.82;
          let push = (drift + (rng() * 2 - 1) * localAmp * 0.6) * envelope;

          // Occasional large features
          const roll = rng();
          if (roll < 0.04) push *= rng() * 1.5 + 2.0;
          else if (roll < 0.12) push *= rng() * 0.7 + 1.3;

          output.push([bx + nx * push + tx * slide, by + ny * push + ty * slide]);
        }
      }
      return output;
    }

    /* ---- Secondary roughening (curvature-aware) ---- */
    _roughenRingSecondary(points, amplitude, step) {
      const rng = this.rng;
      const n = points.length;
      const output = [];

      for (let idx = 0; idx < n; idx++) {
        const start = points[idx];
        const end = points[(idx + 1) % n];
        output.push([start[0], start[1]]);

        const dx = end[0] - start[0], dy = end[1] - start[1];
        const segLen = Math.sqrt(dx * dx + dy * dy);
        if (segLen < step * 1.05) continue;

        // Curvature check
        const prev = points[((idx - 1) % n + n) % n];
        const v1x = start[0] - prev[0], v1y = start[1] - prev[1];
        const v2x = end[0] - start[0], v2y = end[1] - start[1];
        const l1 = Math.sqrt(v1x*v1x + v1y*v1y) || 1e-8;
        const l2 = Math.sqrt(v2x*v2x + v2y*v2y) || 1e-8;
        const dot = (v1x*v2x + v1y*v2y) / (l1*l2);
        const curvature = 1.0 - clamp(dot, -1, 1);
        const curvFactor = clamp(1.2 - curvature * 0.8, 0.2, 1.0);
        const localAmp = amplitude * curvFactor;

        const nx = -dy / segLen, ny = dx / segLen;
        const tx = dx / segLen, ty = dy / segLen;
        const cuts = Math.max(1, (segLen / step) | 0);

        for (let c = 1; c < cuts; c++) {
          const t = c / cuts;
          const bx = lerpV(start[0], end[0], t);
          const by = lerpV(start[1], end[1], t);
          const envelope = Math.pow(Math.sin(Math.PI * t), 0.92);
          const slide = (rng() * 2 - 1) * step * 0.10;
          const push = (rng() * 2 - 1) * localAmp * envelope;
          output.push([bx + nx * push + tx * slide, by + ny * push + ty * slide]);
        }
      }
      return output;
    }

    /* ---- Laplacian smoothing ---- */
    _smoothRing(ring, passes, blend) {
      let pts = ring.map(p => [p[0], p[1]]);
      const n = pts.length;
      if (n < 5) return pts;
      for (let pass = 0; pass < passes; pass++) {
        const next = [];
        for (let i = 0; i < n; i++) {
          const p = pts[((i - 1) % n + n) % n];
          const c = pts[i];
          const q = pts[(i + 1) % n];
          next.push([
            c[0] * (1 - blend) + (p[0] + q[0]) * 0.5 * blend,
            c[1] * (1 - blend) + (p[1] + q[1]) * 0.5 * blend,
          ]);
        }
        pts = next;
      }
      return pts;
    }
  }

  /* ================================================================
   *  MAP GRID (with land/sea mask from continent polygons)
   * ================================================================ */

  class MapGrid {
    constructor(mapW, mapH, step) {
      this.mapW = mapW;
      this.mapH = mapH;
      this.step = step;
      this.cols = Math.ceil(mapW / step);
      this.rows = Math.ceil(mapH / step);
      this.size = this.cols * this.rows;

      this.land = new Uint8Array(this.size);
      this.owner = new Int16Array(this.size);
      this.faction = new Int16Array(this.size);
      this.coastDist = new Int16Array(this.size); // distance to coast in cells
      this.elevation = new Float32Array(this.size); // 0..1 elevation for contour lines

      this.land.fill(0);   // start as all sea
      this.owner.fill(-1);
      this.faction.fill(-1);
    }

    idx(col, row) { return row * this.cols + col; }
    col(idx) { return idx % this.cols; }
    row(idx) { return (idx / this.cols) | 0; }
    cx(idx) { return (idx % this.cols) * this.step + this.step * 0.5; }
    cy(idx) { return ((idx / this.cols) | 0) * this.step + this.step * 0.5; }

    cellAt(x, y) {
      const c = (x / this.step) | 0;
      const r = (y / this.step) | 0;
      if (c < 0 || c >= this.cols || r < 0 || r >= this.rows) return -1;
      return this.idx(c, r);
    }

    /** Stamp a normalised polygon onto the land mask */
    stampLand(polygon) {
      const step = this.step;
      for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
          if (this.land[this.idx(c, r)]) continue; // already land
          const nx = (c * step + step * 0.5) / this.mapW;
          const ny = (r * step + step * 0.5) / this.mapH;
          if (pointInPolygon(nx, ny, polygon)) {
            this.land[this.idx(c, r)] = 1;
          }
        }
      }
    }

    /** Compute distance to coast for each land cell (BFS) */
    computeCoastDistance() {
      const queue = [];
      this.coastDist.fill(9999);

      // Seed: land cells adjacent to sea
      for (let i = 0; i < this.size; i++) {
        if (!this.land[i]) continue;
        let isCoast = false;
        for (const n of this.neighbors4(i)) {
          if (!this.land[n]) { isCoast = true; break; }
        }
        if (isCoast) {
          this.coastDist[i] = 0;
          queue.push(i);
        }
      }

      // BFS
      let head = 0;
      while (head < queue.length) {
        const idx = queue[head++];
        const nd = this.coastDist[idx] + 1;
        for (const n of this.neighbors4(idx)) {
          if (this.land[n] && this.coastDist[n] > nd) {
            this.coastDist[n] = nd;
            queue.push(n);
          }
        }
      }
    }

    *neighbors4(idx) {
      const c = idx % this.cols, r = (idx / this.cols) | 0;
      if (c > 0) yield idx - 1;
      if (c < this.cols - 1) yield idx + 1;
      if (r > 0) yield idx - this.cols;
      if (r < this.rows - 1) yield idx + this.cols;
    }

    *neighbors8(idx) {
      const c = idx % this.cols, r = (idx / this.cols) | 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nc = c + dc, nr = r + dr;
          if (nc >= 0 && nc < this.cols && nr >= 0 && nr < this.rows) yield nr * this.cols + nc;
        }
      }
    }
  }

  /* ================================================================
   *  TERRITORY SYSTEM
   * ================================================================ */

  class TerritorySystem {
    constructor(grid, opts) {
      this.grid = grid;
      this.opts = opts;
      this.regions = [];
      this.factions = [];
      this.rng = null;
      this._borderCache = null;
    }

    generateRegions(seed) {
      this.rng = mulberry32(seed);
      const rng = this.rng;
      const grid = this.grid;
      grid.owner.fill(-1);
      grid.faction.fill(-1);
      this.regions = [];
      this._borderCache = null;

      const numRegions = this.opts.regionCount || DEFAULTS.regionCount;
      const minDist = this.opts.regionMinDistance || DEFAULTS.regionMinDistance;

      // Count land cells
      let landCount = 0;
      for (let i = 0; i < grid.size; i++) if (grid.land[i]) landCount++;
      if (landCount < 50) return this.regions;

      // Place region seeds on land via rejection sampling
      const seeds = [];
      const names = pickN(REGION_NAMES, numRegions, rng);

      for (let i = 0; i < numRegions; i++) {
        let best = null, bestMinD = 0;
        for (let a = 0; a < 500; a++) {
          const nx = 0.06 + rng() * 0.88;
          const ny = 0.06 + rng() * 0.88;
          const px = nx * grid.mapW, py = ny * grid.mapH;
          const cellIdx = grid.cellAt(px, py);
          if (cellIdx < 0 || !grid.land[cellIdx]) continue;
          // Prefer interior (coast distance > 2)
          if (grid.coastDist[cellIdx] < 2) continue;

          let md = Infinity;
          for (const s of seeds) md = Math.min(md, distPt(nx, ny, s.nx, s.ny));
          if (seeds.length === 0 || md > bestMinD) { bestMinD = md; best = { nx, ny, px, py, cellIdx }; }
          if (md >= minDist) break;
        }
        if (best) seeds.push(best);
      }

      for (let i = 0; i < seeds.length; i++) {
        this.regions.push({
          id: i, name: names[i] || `Region ${i}`,
          seedIdx: seeds[i].cellIdx, seedX: seeds[i].px, seedY: seeds[i].py,
          cells: new Set(), labelX: seeds[i].px, labelY: seeds[i].py,
          cities: [], factionId: -1,
        });
      }

      this._growRegions();
      this._computeCentroids();
      this._placeCities();
      return this.regions;
    }

    _growRegions() {
      const grid = this.grid;
      const jitter = this.opts.growthJitter || DEFAULTS.growthJitter;
      const rng = this.rng;
      const heap = new MinHeap();

      for (const region of this.regions) {
        heap.push(0, { idx: region.seedIdx, regionId: region.id });
        grid.owner[region.seedIdx] = region.id;
        region.cells.add(region.seedIdx);
      }

      while (heap.size > 0) {
        const { p: cost, v: { idx, regionId } } = heap.pop();
        if (grid.owner[idx] !== regionId && grid.owner[idx] !== -1) continue;
        for (const nIdx of grid.neighbors4(idx)) {
          if (grid.owner[nIdx] !== -1 || !grid.land[nIdx]) continue;
          const edgeCost = 1.0 + rng() * jitter * 3.5;
          const newCost = cost + edgeCost;
          grid.owner[nIdx] = regionId;
          if (regionId >= 0 && regionId < this.regions.length) { this.regions[regionId].cells.add(nIdx); }
          heap.push(newCost, { idx: nIdx, regionId });
        }
      }
    }

    _computeCentroids() {
      const grid = this.grid;
      for (const region of this.regions) {
        if (region.cells.size === 0) continue;
        let sx = 0, sy = 0;
        for (const idx of region.cells) { sx += grid.cx(idx); sy += grid.cy(idx); }
        region.labelX = sx / region.cells.size;
        region.labelY = sy / region.cells.size;
      }
    }

    _placeCities() {
      const rng = this.rng;
      const grid = this.grid;
      const allNames = shuffle(CITY_NAMES.slice(), rng);
      let ni = 0;
      const minCityDist = grid.step * 8; // minimum spacing between all cities globally
      const allCities = []; // global list for collision avoidance

      for (const region of this.regions) {
        const numCities = 3 + ((rng() * 4) | 0); // 3-6 cities per region
        const cellArr = Array.from(region.cells);
        const cities = [];

        // --- Capital placement: prefer interior, near centroid ---
        let bestIdx = region.seedIdx, bestScore = -Infinity;
        const sampleCount = Math.min(cellArr.length, 150);
        for (let a = 0; a < sampleCount; a++) {
          const ci = cellArr[(rng() * cellArr.length) | 0];
          const cx = grid.cx(ci), cy = grid.cy(ci);
          const dCentroid = distPt(cx, cy, region.labelX, region.labelY);
          const interior = grid.coastDist[ci] * grid.step;
          // Score: close to centroid + far from coast + far from other capitals
          let minGlobal = Infinity;
          for (const gc of allCities) minGlobal = Math.min(minGlobal, distPt(cx, cy, gc.x, gc.y));
          const spacing = allCities.length === 0 ? 0 : Math.max(0, minGlobal);
          const score = -dCentroid * 1.5 + interior * 0.5 + spacing * 0.3;
          if (score > bestScore && (allCities.length === 0 || minGlobal > minCityDist)) {
            bestScore = score; bestIdx = ci;
          }
        }

        const cap = {
          name: allNames[ni++ % allNames.length],
          x: grid.cx(bestIdx), y: grid.cy(bestIdx),
          cellIdx: bestIdx,
          capital: true, regionId: region.id,
          trait: null, trade: null, npc: null, hook: null, // assigned in _assignWorldFlavor
          population: (2000 + ((rng() * 8000) | 0)),
        };
        cities.push(cap);
        allCities.push(cap);

        // --- Towns: spread across region, prefer coast proximity variety ---
        for (let c = 1; c < numCities && cellArr.length > 20; c++) {
          let bIdx = -1, bScore = -Infinity;
          for (let a = 0; a < 60; a++) {
            const cand = cellArr[(rng() * cellArr.length) | 0];
            const cx = grid.cx(cand), cy = grid.cy(cand);
            // Minimum distance to all placed cities
            let minD = Infinity;
            for (const gc of allCities) minD = Math.min(minD, distPt(cx, cy, gc.x, gc.y));
            if (minD < minCityDist) continue;
            // Prefer some variety: alternate between coastal and interior
            const coastScore = (c % 2 === 0) ? -grid.coastDist[cand] : grid.coastDist[cand];
            const score = minD * 0.7 + coastScore * grid.step * 0.3;
            if (score > bScore) { bScore = score; bIdx = cand; }
          }
          if (bIdx >= 0) {
            const town = {
              name: allNames[ni++ % allNames.length],
              x: grid.cx(bIdx), y: grid.cy(bIdx),
              cellIdx: bIdx,
              capital: false, regionId: region.id,
              trait: null, trade: null, npc: null, hook: null, // assigned in _assignWorldFlavor
              population: (200 + ((rng() * 1800) | 0)),
            };
            cities.push(town);
            allCities.push(town);
          }
        }
        region.cities = cities;
      }
    }

    generateFactions(seed) {
      const rng = mulberry32(seed + 9999);
      const numFactions = Math.min(this.opts.factionCount || DEFAULTS.factionCount, this.regions.length);
      this.factions = [];
      const palette = shuffle(FACTION_PALETTE.slice(), rng);
      const names = shuffle(FACTION_NAMES.slice(), rng);

      for (let i = 0; i < numFactions; i++) {
        this.factions.push({
          id: i, name: names[i] || `Faction ${i}`,
          fill: palette[i % palette.length].fill, border: palette[i % palette.length].border,
          regions: new Set(), capital: null,
        });
      }

      const regionOrder = this.regions.map((_, i) => i);
      shuffle(regionOrder, rng);
      for (let i = 0; i < regionOrder.length; i++) this._assignRegionToFaction(regionOrder[i], i % numFactions);
      for (const faction of this.factions) {
        const regionIds = Array.from(faction.regions);
        if (regionIds.length > 0) {
          const first = this.regions[regionIds[0]];
          if (first && first.cities.length) faction.capital = first.cities[0];
        }
      }
      this._borderCache = null;
      return this.factions;
    }

    _assignRegionToFaction(regionId, factionId) {
      const region = this.regions[regionId];
      const grid = this.grid;
      if (region.factionId >= 0) {
        const old = this.factions[region.factionId];
        if (old) old.regions.delete(regionId);
      }
      region.factionId = factionId;
      this.factions[factionId].regions.add(regionId);
      for (const idx of region.cells) grid.faction[idx] = factionId;
      this._borderCache = null;
    }

    conquer(factionId, regionId) {
      if (!this.factions[factionId] || !this.regions[regionId]) return false;
      this._assignRegionToFaction(regionId, factionId);
      return true;
    }

    secede(regionId, name, color) {
      const region = this.regions[regionId];
      if (!region) return null;
      const rng = mulberry32(Date.now());
      const pal = pick(FACTION_PALETTE, rng);
      const nf = {
        id: this.factions.length, name: name || `Free ${region.name}`,
        fill: color || pal.fill, border: pal.border, regions: new Set(), capital: region.cities[0] || null,
      };
      this.factions.push(nf);
      this._assignRegionToFaction(regionId, nf.id);
      return nf;
    }

    alliance(absorberId, absorbedId) {
      const absorber = this.factions[absorberId], absorbed = this.factions[absorbedId];
      if (!absorber || !absorbed) return false;
      for (const rId of Array.from(absorbed.regions)) this._assignRegionToFaction(rId, absorberId);
      absorbed.regions.clear();
      return true;
    }

    getRegionAt(x, y) {
      const idx = this.grid.cellAt(x, y);
      return idx >= 0 && this.grid.owner[idx] >= 0 ? this.regions[this.grid.owner[idx]] : null;
    }

    getFactionAt(x, y) {
      const idx = this.grid.cellAt(x, y);
      const factionIdx = this.grid.faction[idx];
      return idx >= 0 && factionIdx >= 0 && factionIdx < this.factions.length ? this.factions[factionIdx] : null;
    }
  }

  /* ================================================================
   *  BORDER SYSTEM
   * ================================================================ */

  /* ================================================================
   *  ROAD SYSTEM (Two-tier MST: trunk roads between capitals,
   *               branch roads connecting towns to the network)
   * ================================================================ */

  class RoadSystem {
    constructor(grid) { this.grid = grid; this.roads = []; }

    /**
     * Build road network from city data.
     * @param {Array} allCities - flat array of { x, y, capital, regionId, name }
     * @param {Function} rng - seeded RNG
     */
    build(allCities, rng) {
      this.roads = [];
      if (allCities.length < 2) return;

      const capitals = allCities.filter(c => c.capital);
      const towns = allCities.filter(c => !c.capital);

      // ---- Trunk roads: Prim's MST over capitals ----
      const trunkEdges = this._primMST(capitals);
      for (const [i, j] of trunkEdges) {
        if (this._roadCrossesWater(capitals[i], capitals[j])) continue;
        const path = this._buildMeanderingRoad(capitals[i], capitals[j], rng);
        this.roads.push({ from: capitals[i], to: capitals[j], points: path, trunk: true });
      }

      // ---- Branch roads: connect each town to its nearest network city ----
      // "Network cities" = all capitals initially, then towns as they connect
      const connected = new Set(capitals);
      const connectedArr = capitals.slice();

      // Sort towns by distance to nearest capital so close ones connect first
      const townDist = towns.map(t => {
        let min = Infinity;
        for (const c of capitals) min = Math.min(min, distPt(t.x, t.y, c.x, c.y));
        return { town: t, dist: min };
      });
      townDist.sort((a, b) => a.dist - b.dist);

      for (const { town } of townDist) {
        // Find nearest connected city
        let nearest = null, nearDist = Infinity;
        for (const c of connectedArr) {
          const d = distPt(town.x, town.y, c.x, c.y);
          if (d < nearDist) { nearDist = d; nearest = c; }
        }
        if (nearest && nearDist < this.grid.mapW * 0.5 && !this._roadCrossesWater(town, nearest)) {
          const path = this._buildMeanderingRoad(town, nearest, rng);
          this.roads.push({ from: town, to: nearest, points: path, trunk: false });
          connected.add(town);
          connectedArr.push(town);
        }
      }
    }

    /** Prim's MST on a set of cities. Returns array of [i,j] index pairs. */
    _primMST(cities) {
      if (cities.length < 2) return [];
      const n = cities.length;
      const inTree = new Uint8Array(n);
      const dist = new Float64Array(n).fill(Infinity);
      const parent = new Int32Array(n).fill(-1);
      dist[0] = 0;
      const edges = [];

      for (let step = 0; step < n; step++) {
        // Pick lowest-distance node not in tree
        let u = -1, uDist = Infinity;
        for (let i = 0; i < n; i++) {
          if (!inTree[i] && dist[i] < uDist) { uDist = dist[i]; u = i; }
        }
        if (u < 0) break;
        inTree[u] = 1;
        if (parent[u] >= 0) edges.push([parent[u], u]);

        // Update distances
        for (let v = 0; v < n; v++) {
          if (inTree[v]) continue;
          const d = distPt(cities[u].x, cities[u].y, cities[v].x, cities[v].y);
          if (d < dist[v]) { dist[v] = d; parent[v] = u; }
        }
      }
      return edges;
    }

    /**
     * Build a meandering road between two cities.
     * Waypoint count scales with distance.  Each waypoint is displaced
     * perpendicular to the travel direction using layered sinusoids +
     * random jitter + coast-distance bias, then snapped to land.
     */
    _buildMeanderingRoad(cityA, cityB, rng) {
      const grid = this.grid;
      const dx = cityB.x - cityA.x, dy = cityB.y - cityA.y;
      const segLen = Math.sqrt(dx * dx + dy * dy);
      if (segLen < 1) return [{ x: cityA.x, y: cityA.y }, { x: cityB.x, y: cityB.y }];

      // More waypoints for longer roads (1 per ~400 map px, min 4, max 10)
      const numWaypoints = clamp(Math.round(segLen / 400), 4, 10);
      const ux = dx / segLen, uy = dy / segLen; // unit tangent
      const px = -uy, py = ux; // perpendicular

      const pts = [{ x: cityA.x, y: cityA.y }];

      // Two-layer sinusoidal meander for organic feel
      const phase1 = rng() * Math.PI * 2;
      const phase2 = rng() * Math.PI * 2;
      const freq1 = 1.8 + rng() * 1.0;  // broad wave
      const freq2 = 3.5 + rng() * 2.0;  // fine wobble
      const amp1 = segLen * (0.04 + rng() * 0.03);
      const amp2 = segLen * (0.01 + rng() * 0.015);

      for (let i = 1; i <= numWaypoints; i++) {
        const frac = i / (numWaypoints + 1);
        const bx = cityA.x + dx * frac;
        const by = cityA.y + dy * frac;

        // Two-layer sinusoidal displacement
        let wave = Math.sin(frac * Math.PI * freq1 + phase1) * amp1;
        wave += Math.sin(frac * Math.PI * freq2 + phase2) * amp2;
        // Small random jitter
        wave += (rng() - 0.5) * segLen * 0.025;

        // Coast-distance bias: nudge toward interior land
        const probeX = bx + px * wave, probeY = by + py * wave;
        const cellIdx = grid.cellAt(probeX, probeY);
        if (cellIdx >= 0 && grid.land[cellIdx]) {
          const coast = grid.coastDist[cellIdx];
          // If near coast, push inward
          if (coast < 3) wave *= 0.4;
        }

        // Clamp to reasonable range
        wave = clamp(wave, -segLen * 0.10, segLen * 0.10);

        const wx = bx + px * wave, wy = by + py * wave;

        // Ensure waypoint is on land; if not, binary-search toward straight line
        let finalX = wx, finalY = wy;
        const wCell = grid.cellAt(wx, wy);
        if (wCell < 0 || !grid.land[wCell]) {
          // Try progressively smaller offsets
          let found = false;
          for (let s = 0.75; s >= 0; s -= 0.25) {
            const tx = bx + px * wave * s, ty = by + py * wave * s;
            const tc = grid.cellAt(tx, ty);
            if (tc >= 0 && grid.land[tc]) { finalX = tx; finalY = ty; found = true; break; }
          }
          if (!found) { finalX = bx; finalY = by; }
        }

        pts.push({ x: finalX, y: finalY });
      }
      pts.push({ x: cityB.x, y: cityB.y });

      // Smooth with Catmull-Rom subdivision then Laplacian
      return this._smoothRoad(pts);
    }

    /**
     * Check if a road would cross significant water.
     * Samples points along the straight line and counts sea cells.
     */
    _roadCrossesWater(cityA, cityB) {
      const grid = this.grid;
      const dx = cityB.x - cityA.x, dy = cityB.y - cityA.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const samples = Math.max(5, Math.round(len / (grid.step * 5)));
      let seaCount = 0;
      for (let i = 1; i < samples; i++) {
        const f = i / samples;
        const cx = cityA.x + dx * f, cy = cityA.y + dy * f;
        const idx = grid.cellAt(cx, cy);
        if (idx < 0 || !grid.land[idx]) seaCount++;
      }
      return seaCount / samples > 0.25; // >25% over water = skip
    }

    /** Catmull-Rom subdivision + Laplacian smooth for flowing curves */
    _smoothRoad(pts) {
      if (pts.length < 3) return pts;

      // Catmull-Rom subdivision with 4 intermediate points per segment
      let sub = [];
      for (let i = 0; i < pts.length - 1; i++) {
        sub.push(pts[i]);
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];
        for (let t = 1; t <= 4; t++) {
          const f = t / 5;
          const x = 0.5 * ((2*p1.x) + (-p0.x+p2.x)*f + (2*p0.x-5*p1.x+4*p2.x-p3.x)*f*f + (-p0.x+3*p1.x-3*p2.x+p3.x)*f*f*f);
          const y = 0.5 * ((2*p1.y) + (-p0.y+p2.y)*f + (2*p0.y-5*p1.y+4*p2.y-p3.y)*f*f + (-p0.y+3*p1.y-3*p2.y+p3.y)*f*f*f);
          sub.push({ x, y });
        }
      }
      sub.push(pts[pts.length - 1]);

      // Laplacian smoothing — 5 passes, 40% blend, pin endpoints
      for (let pass = 0; pass < 5; pass++) {
        const next = [sub[0]];
        for (let i = 1; i < sub.length - 1; i++) {
          next.push({
            x: sub[i].x * 0.6 + (sub[i - 1].x + sub[i + 1].x) * 0.2,
            y: sub[i].y * 0.6 + (sub[i - 1].y + sub[i + 1].y) * 0.2,
          });
        }
        next.push(sub[sub.length - 1]);
        sub = next;
      }
      return sub;
    }
  }

  class BorderSystem {
    constructor(grid) { this.grid = grid; }

    /**
     * Extract faction border edges from the grid and smooth them.
     * Returns { factionBorders, regionBorders }
     * Region borders are extracted but not smoothed (not rendered).
     */
    extractBorders() {
      const grid = this.grid, step = grid.step;
      const factionEdges = new Map();

      for (let r = 0; r < grid.rows; r++) {
        for (let c = 0; c < grid.cols; c++) {
          const idx = grid.idx(c, r);
          const fA = grid.faction[idx], rA = grid.owner[idx];
          if (rA < 0) continue;

          // Check right neighbour
          if (c < grid.cols - 1) {
            const rIdx = grid.idx(c + 1, r);
            const fB = grid.faction[rIdx], rB = grid.owner[rIdx];
            if (rB >= 0 && fA !== fB) {
              const key = Math.min(fA, fB) + "-" + Math.max(fA, fB);
              if (!factionEdges.has(key)) factionEdges.set(key, []);
              factionEdges.get(key).push({
                x1: (c + 1) * step, y1: r * step,
                x2: (c + 1) * step, y2: (r + 1) * step,
              });
            }
          }

          // Check bottom neighbour
          if (r < grid.rows - 1) {
            const bIdx = grid.idx(c, r + 1);
            const fB = grid.faction[bIdx], rB = grid.owner[bIdx];
            if (rB >= 0 && fA !== fB) {
              const key = Math.min(fA, fB) + "-" + Math.max(fA, fB);
              if (!factionEdges.has(key)) factionEdges.set(key, []);
              factionEdges.get(key).push({
                x1: c * step, y1: (r + 1) * step,
                x2: (c + 1) * step, y2: (r + 1) * step,
              });
            }
          }
        }
      }

      const factionBorders = [];
      for (const [key, segs] of factionEdges) {
        const parts = key.split("-").map(Number);
        const a = parts[0], b = parts[1];
        if (typeof a !== "number" || typeof b !== "number") continue;
        for (const points of this._chainSegments(segs)) {
          factionBorders.push({ points: this._flowSmooth(points), a, b, type: "faction" });
        }
      }

      return { factionBorders, regionBorders: [] };
    }

    _chainSegments(segments) {
      if (!segments.length) return [];
      const pk = (x, y) => `${x},${y}`;
      const adj = new Map();
      for (let i = 0; i < segments.length; i++) {
        const s = segments[i];
        const k1 = pk(s.x1, s.y1), k2 = pk(s.x2, s.y2);
        if (!adj.has(k1)) adj.set(k1, []);
        if (!adj.has(k2)) adj.set(k2, []);
        adj.get(k1).push({ seg: i, other: k2, x: s.x2, y: s.y2 });
        adj.get(k2).push({ seg: i, other: k1, x: s.x1, y: s.y1 });
      }
      const used = new Uint8Array(segments.length);
      const chains = [];
      for (let i = 0; i < segments.length; i++) {
        if (used[i]) continue;
        const chain = [];
        const s = segments[i]; used[i] = 1;
        chain.push({ x: s.x1, y: s.y1 }); chain.push({ x: s.x2, y: s.y2 });
        let cursor = pk(s.x2, s.y2), ext = true;
        while (ext) { ext = false; for (const n of (adj.get(cursor)||[])) { if (!used[n.seg]) { used[n.seg]=1; chain.push({x:n.x,y:n.y}); cursor=n.other; ext=true; break; } } }
        chain.reverse();
        cursor = pk(chain[chain.length-1].x, chain[chain.length-1].y); ext = true;
        while (ext) { ext = false; for (const n of (adj.get(cursor)||[])) { if (!used[n.seg]) { used[n.seg]=1; chain.push({x:n.x,y:n.y}); cursor=n.other; ext=true; break; } } }
        if (chain.length >= 2) chains.push(chain);
      }
      return chains;
    }

    /**
     * Flow-smooth: downsample heavily then apply many Laplacian passes.
     * This produces flowing, organic curves like coastlines —
     * NOT the squiggly result of Chaikin on grid staircases.
     */
    _flowSmooth(pts) {
      if (pts.length < 4) return pts;

      // Step 1: Downsample — keep every Nth point so we have ~60-120 points.
      // This eliminates the high-frequency grid staircase entirely.
      const targetCount = Math.min(pts.length, Math.max(30, 80));
      const step = Math.max(1, Math.floor(pts.length / targetCount));
      let downsampled = [];
      for (let i = 0; i < pts.length; i += step) downsampled.push(pts[i]);
      // Always include the last point
      const last = pts[pts.length - 1];
      if (downsampled.length > 0) {
        const dl = downsampled[downsampled.length - 1];
        if (dl.x !== last.x || dl.y !== last.y) downsampled.push(last);
      }
      if (downsampled.length < 3) return downsampled;

      // Step 2: Many passes of Laplacian smoothing (aggressive blend).
      // This makes the curve flow organically, like a natural border.
      const isClosed = distPt(downsampled[0].x, downsampled[0].y,
        downsampled[downsampled.length-1].x, downsampled[downsampled.length-1].y) < this.grid.step * 2;

      let cur = downsampled.map(p => ({ x: p.x, y: p.y }));
      const passes = 12;
      const blend = 0.5;
      for (let pass = 0; pass < passes; pass++) {
        const next = [];
        for (let i = 0; i < cur.length; i++) {
          if (!isClosed && (i === 0 || i === cur.length - 1)) {
            next.push(cur[i]); // Pin endpoints for open chains
            continue;
          }
          const prev = cur[((i - 1) + cur.length) % cur.length];
          const curr = cur[i];
          const nxt = cur[(i + 1) % cur.length];
          next.push({
            x: curr.x * (1 - blend) + (prev.x + nxt.x) * 0.5 * blend,
            y: curr.y * (1 - blend) + (prev.y + nxt.y) * 0.5 * blend,
          });
        }
        cur = next;
      }

      return cur;
    }
  }

  /* ================================================================
   *  MAP RENDERER (Canvas — Clean Modern Fantasy)
   * ================================================================ */

  class MapRenderer {
    constructor(canvas, grid, ts, bs, rs, opts, continentData, pois) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.grid = grid;
      this.ts = ts;
      this.bs = bs;
      this.rs = rs; // RoadSystem
      this.opts = opts;
      this.continentData = continentData; // { mainland, extras, islands }
      this.pois = pois || [];

      this.zoom = 0.18;
      this.panX = 20;
      this.panY = 20;
      this.minZoom = 0.08;
      this.maxZoom = 4.0;
      this._dragging = false;
      this._dragStart = null;
      this._panStart = null;
      this.hoveredRegion = null;
      this.selectedRegion = null;
      this.hoveredFaction = null;
      this.hoveredPOI = null;
      this.selectedPOI = null;
      this._poiExpanded = false; // whether "more details" is showing
      this.hoveredCity = null;
      this.selectedCity = null;
      this._cityExpanded = false;
      this.onRegionClick = null;
      this.onRegionHover = null;
      this.onPOIClick = null;
      this.onCityClick = null;
      this._regionPaths = null;
      this._borderData = null;
      this._coastlineCache = null;
      this._rafId = null;          // requestAnimationFrame handle
      this._renderQueued = false;   // prevents duplicate RAF requests
      this._boundListeners = [];    // tracks listeners for cleanup

      this.theme = {
        bg: "#060e1f",
        sea: "#12305a",
        seaMid: "#0b1e3d",
        seaDeep: "#050c1a",
        shoreGlow: "rgba(40,80,140,0.18)",
        landBase: "#1e1e18",
        factionBorderWidth: 3.0,
        factionBorderColor: "rgba(20,18,14,0.45)",
        coastlineColor: "rgba(0,0,0,0)",
        coastlineWidth: 0,
        // Roads — clean, hand-drawn fantasy cartography style
        trunkRoadColor: "rgba(139,119,80,0.70)",
        trunkRoadCasing: "rgba(90,75,50,0.25)",
        trunkRoadWidth: 2.0,
        trunkRoadCasingWidth: 4.2,
        branchRoadColor: "rgba(58,48,30,0.50)",
        branchRoadWidth: 1.4,
        branchDash: [3, 6],
        labelColor: "#f2e8d6",
        labelShadow: "rgba(0,0,0,0.85)",
        cityMarkerColor: "#f2e8d6",
        capitalMarkerColor: "#c9a85c",
        highlightColor: "rgba(201,168,92,0.25)",
        selectedColor: "rgba(212,67,58,0.30)",
      };

      this._setupInteraction();
    }

    /**
     * Schedule a render on the next animation frame.
     * Coalesces multiple calls per frame into a single render,
     * preventing "spaz" from rapid mouse/wheel/touch events.
     */
    _scheduleRender() {
      if (this._renderQueued) return;
      this._renderQueued = true;
      this._rafId = (typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : setTimeout)(() => {
        this._renderQueued = false;
        this.render();
      });
    }

    /** Register an event listener on the canvas and track it for cleanup */
    _on(event, fn, opts) {
      this.canvas.addEventListener(event, fn, opts);
      this._boundListeners.push({ event, fn, opts });
    }

    /** Remove all registered event listeners — call before discarding renderer */
    destroy() {
      for (const { event, fn, opts } of this._boundListeners) {
        this.canvas.removeEventListener(event, fn, opts);
      }
      this._boundListeners = [];
      if (this._rafId) {
        (typeof cancelAnimationFrame !== "undefined" ? cancelAnimationFrame : clearTimeout)(this._rafId);
        this._rafId = null;
      }
      // Clean up canvas context and references to prevent memory leaks
      this.ctx = null;
      this.canvas = null;
      this.hoveredRegion = null;
      this.selectedRegion = null;
      this.hoveredFaction = null;
      this.hoveredPOI = null;
      this.selectedPOI = null;
      this.hoveredCity = null;
      this.selectedCity = null;
    }

    _setupInteraction() {
      const canvas = this.canvas;
      this._lastMoveTime = 0;

      this._on("mousedown", (e) => {
        this._dragging = true;
        this._dragStart = { x: e.clientX, y: e.clientY };
        this._panStart = { x: this.panX, y: this.panY };
        canvas.style.cursor = "grabbing";
      });

      this._on("mousemove", (e) => {
        if (this._dragging) {
          this.panX = this._panStart.x + (e.clientX - this._dragStart.x);
          this.panY = this._panStart.y + (e.clientY - this._dragStart.y);
          this._scheduleRender();
        } else {
          // Throttle hover checks to max ~20 fps to avoid spaz
          const now = performance.now();
          if (now - this._lastMoveTime < 50) return;
          this._lastMoveTime = now;

          const rect = canvas.getBoundingClientRect();
          const worldX = (e.clientX - rect.left - this.panX) / this.zoom;
          const worldY = (e.clientY - rect.top - this.panY) / this.zoom;

          // Check POI hover — major POIs interactive from 0.18, minor from 0.35
          let hitPOI = null;
          if (this.zoom >= 0.18) {
            const hitR = clamp(8 / this.zoom, 6, 22);
            for (const poi of this.pois) {
              if (!poi.discovered) continue;
              // Skip minor POIs at low zoom
              if (!poi.major && this.zoom < 0.35) continue;
              const poiR = poi.major ? hitR * 1.5 : hitR;
              const dx = worldX - poi.x, dy = worldY - poi.y;
              if (dx * dx + dy * dy < poiR * poiR) { hitPOI = poi; break; }
            }
          }

          // Check city hover (if no POI hit)
          let hitCity = null;
          if (!hitPOI && this.zoom >= 0.12) {
            const cityR = clamp(10 / this.zoom, 6, 24);
            for (const reg of this.ts.regions) {
              for (const city of reg.cities) {
                const dx = worldX - city.x, dy = worldY - city.y;
                if (dx * dx + dy * dy < cityR * cityR) { hitCity = city; break; }
              }
              if (hitCity) break;
            }
          }

          let needRender = false;
          if (hitPOI !== this.hoveredPOI) { this.hoveredPOI = hitPOI; needRender = true; }
          if (hitCity !== this.hoveredCity) { this.hoveredCity = hitCity; needRender = true; }

          const region = this.ts.getRegionAt(worldX, worldY);
          if (region !== this.hoveredRegion) {
            this.hoveredRegion = region;
            this.hoveredFaction = region ? this.ts.factions[region.factionId] : null;
            if (this.onRegionHover) this.onRegionHover(region, this.hoveredFaction);
            needRender = true;
          }
          if (needRender) this._scheduleRender();
          canvas.style.cursor = (hitPOI || hitCity) ? "pointer" : region ? "pointer" : "grab";
        }
      });

      this._on("mouseup", (e) => {
        if (this._dragging) {
          const dx = Math.abs(e.clientX - this._dragStart.x);
          const dy = Math.abs(e.clientY - this._dragStart.y);
          if (dx < 5 && dy < 5) {
            const rect = canvas.getBoundingClientRect();
            const worldX = (e.clientX - rect.left - this.panX) / this.zoom;
            const worldY = (e.clientY - rect.top - this.panY) / this.zoom;

            // Check for POI click — major POIs clickable from 0.18, minor from 0.35
            let clickedPOI = null;
            if (this.zoom >= 0.18) {
              const hitR = clamp(8 / this.zoom, 6, 22);
              for (const poi of this.pois) {
                if (!poi.discovered) continue;
                if (!poi.major && this.zoom < 0.35) continue;
                const poiR = poi.major ? hitR * 1.5 : hitR;
                const pdx = worldX - poi.x, pdy = worldY - poi.y;
                if (pdx * pdx + pdy * pdy < poiR * poiR) { clickedPOI = poi; break; }
              }
            }

            // Check city click (if no POI hit)
            let clickedCity = null;
            if (!clickedPOI && this.zoom >= 0.12) {
              const cityR = clamp(10 / this.zoom, 6, 24);
              for (const reg of this.ts.regions) {
                for (const city of reg.cities) {
                  const cdx = worldX - city.x, cdy = worldY - city.y;
                  if (cdx * cdx + cdy * cdy < cityR * cityR) { clickedCity = city; break; }
                }
                if (clickedCity) break;
              }
            }

            if (clickedPOI) {
              if (this.selectedPOI === clickedPOI) {
                this._poiExpanded = !this._poiExpanded;
              } else {
                this.selectedPOI = clickedPOI;
                this._poiExpanded = false;
              }
              this.selectedCity = null;
              this._cityExpanded = false;
              if (this.onPOIClick) this.onPOIClick(clickedPOI);
            } else if (clickedCity) {
              if (this.selectedCity === clickedCity) {
                this._cityExpanded = !this._cityExpanded;
              } else {
                this.selectedCity = clickedCity;
                this._cityExpanded = false;
              }
              this.selectedPOI = null;
              this._poiExpanded = false;
              if (this.onCityClick) this.onCityClick(clickedCity);
            } else {
              // Clicked on map — deselect everything
              this.selectedPOI = null;
              this._poiExpanded = false;
              this.selectedCity = null;
              this._cityExpanded = false;

              const region = this.ts.getRegionAt(worldX, worldY);
              this.selectedRegion = region;
              if (this.onRegionClick && region) this.onRegionClick(region, this.ts.factions[region.factionId]);
            }
            this._scheduleRender();
          }
        }
        this._dragging = false;
        canvas.style.cursor = "grab";
      });

      this._on("mouseleave", () => {
        this._dragging = false; this.hoveredRegion = null; this.hoveredFaction = null;
        this._scheduleRender();
      });

      this._on("wheel", (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        const oldZoom = this.zoom;
        // Symmetric zoom factor: 1.1 in / (1/1.1) out — ensures zoom in then out returns to same level
        const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        this.zoom = clamp(this.zoom * factor, this.minZoom, this.maxZoom);
        // Zoom toward cursor
        this.panX = mx - (mx - this.panX) * (this.zoom / oldZoom);
        this.panY = my - (my - this.panY) * (this.zoom / oldZoom);
        this._scheduleRender();
      }, { passive: false });

      // Touch support
      let lastTouches = null;
      this._on("touchstart", (e) => {
        e.preventDefault();
        lastTouches = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
        if (e.touches.length === 1) {
          this._dragging = true;
          this._dragStart = lastTouches[0];
          this._panStart = { x: this.panX, y: this.panY };
        }
      }, { passive: false });
      this._on("touchmove", (e) => {
        e.preventDefault();
        const touches = Array.from(e.touches).map(t => ({ x: t.clientX, y: t.clientY }));
        if (touches.length === 1 && this._dragging) {
          this.panX = this._panStart.x + (touches[0].x - this._dragStart.x);
          this.panY = this._panStart.y + (touches[0].y - this._dragStart.y);
          this._scheduleRender();
        } else if (touches.length === 2 && lastTouches && lastTouches.length === 2) {
          const od = distPt(lastTouches[0].x, lastTouches[0].y, lastTouches[1].x, lastTouches[1].y);
          const nd = distPt(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
          if (od > 0) {
            const rect = canvas.getBoundingClientRect();
            const mx = (touches[0].x+touches[1].x)/2-rect.left, my = (touches[0].y+touches[1].y)/2-rect.top;
            const oldZ = this.zoom;
            this.zoom = clamp(this.zoom*(nd/od), this.minZoom, this.maxZoom);
            this.panX = mx-(mx-this.panX)*(this.zoom/oldZ);
            this.panY = my-(my-this.panY)*(this.zoom/oldZ);
            this._scheduleRender();
          }
        }
        lastTouches = touches;
      }, { passive: false });
      this._on("touchend", () => { this._dragging = false; lastTouches = null; });
    }

    invalidate() {
      this._borderData = null; this._coastlineCache = null; this._territoryRunCache = null; this._contourCache = null;
      for (const r of this.ts.regions) r._hlRuns = null;
    }

    _buildBorderData() { this._borderData = this.bs.extractBorders(); }

    /** Build coastline paths from continent polygon data */
    _buildCoastlineCache() {
      if (!this.continentData) { this._coastlineCache = []; return; }
      const mapW = this.grid.mapW, mapH = this.grid.mapH;
      const toPixel = (poly) => poly.map(([nx, ny]) => [nx * mapW, ny * mapH]);
      const cache = [];
      cache.push(toPixel(this.continentData.mainland));
      for (const ext of this.continentData.extras) cache.push(toPixel(ext));
      for (const isl of this.continentData.islands) cache.push(toPixel(isl));
      this._coastlineCache = cache;
    }

    /** Build a combined clip path from all coastline polygons using smooth curves */
    _applyCoastlineClip(ctx) {
      ctx.beginPath();
      for (const poly of this._coastlineCache) {
        if (poly.length < 3) continue;
        ctx.moveTo(poly[0][0], poly[0][1]);
        for (let i = 0; i < poly.length; i++) {
          const next = poly[(i + 1) % poly.length];
          const mx = (poly[i][0] + next[0]) / 2;
          const my = (poly[i][1] + next[1]) / 2;
          ctx.quadraticCurveTo(poly[i][0], poly[i][1], mx, my);
        }
        ctx.closePath();
      }
      ctx.clip();
    }

    render() {
      const ctx = this.ctx, canvas = this.canvas;
      // Prevent rendering if already destroyed
      if (!ctx || !canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const dw = canvas.clientWidth, dh = canvas.clientHeight;
      if (canvas.width !== dw * dpr || canvas.height !== dh * dpr) {
        canvas.width = dw * dpr; canvas.height = dh * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!this._borderData) this._buildBorderData();
      if (!this._coastlineCache) this._buildCoastlineCache();

      // Background
      ctx.fillStyle = this.theme.bg;
      ctx.fillRect(0, 0, dw, dh);

      ctx.save();
      ctx.translate(this.panX, this.panY);
      ctx.scale(this.zoom, this.zoom);

      this._drawSea(ctx);
      this._drawCoastlineGlow(ctx);

      // Clip all land-based rendering to the smooth coastline polygons
      ctx.save();
      this._applyCoastlineClip(ctx);
      this._drawLandBase(ctx);
      this._drawTerritories(ctx);
      this._drawTextureLines(ctx);
      this._drawContours(ctx);
      this._drawHighlights(ctx);
      this._drawBorders(ctx);
      this._drawRoads(ctx);
      ctx.restore();

      // Coastline stroke drawn OUTSIDE clip so it's always crisp
      this._drawCoastlineStroke(ctx);
      this._drawCities(ctx);
      this._drawPOIs(ctx);
      if (this.zoom > 0.12) this._drawLabels(ctx);

      ctx.restore();

      // Popups drawn in screen space (outside the world transform)
      this._drawPOIPopup(this.ctx);
      this._drawCityPopup(this.ctx);
    }

    _drawSea(ctx) {
      const g = this.grid;
      const t = this.theme;

      // Multi-stop radial gradient: lighter near land mass center, darker at deep ocean edges
      const cx = g.mapW * 0.5, cy = g.mapH * 0.5;
      const outerR = Math.max(g.mapW, g.mapH) * 0.85;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR);
      grad.addColorStop(0.0, t.sea);       // Near-shore: muted blue
      grad.addColorStop(0.35, t.seaMid);   // Mid-ocean: darker
      grad.addColorStop(0.7, t.seaDeep);   // Deep ocean: very dark navy
      grad.addColorStop(1.0, t.bg);        // Abyss at edges: near-black
      ctx.fillStyle = grad;
      ctx.fillRect(-200, -200, g.mapW + 400, g.mapH + 400);

      // Subtle depth variation — soft blurred blobs, not grid squares
      if (!this._seaNoiseRng) {
        let s = 12345;
        this._seaNoiseRng = () => { s = (s * 16807) % 2147483647; return (s & 0x7fffffff) / 2147483647; };
      }
      const rng = this._seaNoiseRng;
      ctx.save();
      const blobCount = 30;
      for (let i = 0; i < blobCount; i++) {
        const bx = -200 + rng() * (g.mapW + 400);
        const by = -200 + rng() * (g.mapH + 400);
        const br = 150 + rng() * 350;
        const dark = rng() > 0.5;
        const blobGrad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        if (dark) {
          blobGrad.addColorStop(0, "rgba(4,8,18,0.06)");
          blobGrad.addColorStop(1, "rgba(4,8,18,0)");
        } else {
          blobGrad.addColorStop(0, "rgba(16,40,80,0.04)");
          blobGrad.addColorStop(1, "rgba(16,40,80,0)");
        }
        ctx.fillStyle = blobGrad;
        ctx.fillRect(bx - br, by - br, br * 2, br * 2);
      }
      ctx.restore();
    }

    _drawCoastlineGlow(ctx) {
      for (const poly of this._coastlineCache) {
        if (poly.length < 3) continue;
        // Multiple glow rings for soft shore effect
        for (let ring = 0; ring < 3; ring++) {
          ctx.save();
          ctx.shadowColor = `rgba(30,70,130,${0.06 - ring * 0.015})`;
          ctx.shadowBlur = 20 + ring * 18;
          ctx.fillStyle = "rgba(0,0,0,0)";
          ctx.strokeStyle = `rgba(60,100,140,${0.10 - ring * 0.025})`;
          ctx.lineWidth = 6 + ring * 8;
          ctx.beginPath();
          ctx.moveTo(poly[0][0], poly[0][1]);
          for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    /** Fill the land polygons with a base colour before faction overlays */
    _drawLandBase(ctx) {
      ctx.fillStyle = this.theme.landBase;
      // The clip is already set to coastline, so a large rect fills only land
      ctx.fillRect(-200, -200, this.grid.mapW + 400, this.grid.mapH + 400);

      // Give unowned land (small islands, unclaimed territory) a visible earthy tone
      // so they don't blend into the ocean
      const grid = this.grid, step = grid.step;
      const bleed = Math.ceil(step * 1.1);
      ctx.fillStyle = "rgba(90,80,60,0.35)";
      ctx.beginPath();
      for (let idx = 0; idx < grid.total; idx++) {
        if (grid.land[idx] && grid.faction[idx] < 0) {
          const x = grid.col(idx) * step - bleed;
          const y = grid.row(idx) * step - bleed;
          ctx.rect(x, y, step + bleed * 2, step + bleed * 2);
        }
      }
      ctx.fill();

      // Add subtle texture strokes to unowned land
      ctx.save();
      ctx.strokeStyle = "rgba(120,105,75,0.12)";
      ctx.lineWidth = 1;
      let noiseSeed = 54321;
      const nrng = () => { noiseSeed = (noiseSeed * 16807) % 2147483647; return (noiseSeed & 0x7fffffff) / 2147483647; };
      for (let idx = 0; idx < grid.total; idx++) {
        if (grid.land[idx] && grid.faction[idx] < 0) {
          const cx = grid.cx(idx), cy = grid.cy(idx);
          if (nrng() < 0.3) {
            const len = step * (0.3 + nrng() * 0.6);
            const angle = nrng() * Math.PI;
            ctx.beginPath();
            ctx.moveTo(cx - Math.cos(angle) * len, cy - Math.sin(angle) * len);
            ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    }

    /**
     * Build a cached array of horizontal runs per faction for cell-rect fills.
     * Cell rects guarantee perfect coverage with zero gaps — no dark patches
     * can ever appear between territories. The staircase at faction borders
     * is hidden by very wide smooth border cover strokes drawn on top.
     */
    _buildTerritoryRunCache() {
      const grid = this.grid, step = grid.step;
      const bleed = Math.ceil(step * 1.1);
      const cache = [];

      for (const faction of this.ts.factions) {
        if (faction.regions.size === 0) continue;
        const cells = [];
        for (const rId of faction.regions) {
          for (const idx of this.ts.regions[rId].cells) cells.push(idx);
        }
        cells.sort((a, b) => a - b);

        const runs = [];
        let i = 0;
        while (i < cells.length) {
          const row = grid.row(cells[i]);
          const startCol = grid.col(cells[i]);
          let endCol = startCol;
          while (
            i + 1 < cells.length &&
            grid.row(cells[i + 1]) === row &&
            grid.col(cells[i + 1]) === endCol + 1
          ) { i++; endCol = grid.col(cells[i]); }
          runs.push({
            x: startCol * step - bleed,
            y: row * step - bleed,
            w: (endCol - startCol + 1) * step + bleed * 2,
            h: step + bleed * 2,
          });
          i++;
        }
        cache.push({ fill: faction.fill, runs });
      }
      this._territoryRunCache = cache;
    }

    _drawTerritories(ctx) {
      if (!this._territoryRunCache) this._buildTerritoryRunCache();
      for (const entry of this._territoryRunCache) {
        ctx.fillStyle = entry.fill;
        ctx.beginPath();
        for (const r of entry.runs) ctx.rect(r.x, r.y, r.w, r.h);
        ctx.fill();
      }
    }

    /**
     * Build horizontal run-length encoded runs for a single region's cells.
     * Cached per region for fast highlight rendering.
     */
    _getRegionRuns(region) {
      if (region._hlRuns) return region._hlRuns;
      const grid = this.grid, step = grid.step;
      const bleed = Math.ceil(step * 1.1);
      const cells = Array.from(region.cells).sort((a, b) => a - b);
      const runs = [];
      let i = 0;
      while (i < cells.length) {
        const row = grid.row(cells[i]);
        let col = grid.col(cells[i]);
        let runStart = col;
        while (i + 1 < cells.length && grid.row(cells[i + 1]) === row && grid.col(cells[i + 1]) === col + 1) {
          col++; i++;
        }
        runs.push({
          x: runStart * step - bleed,
          y: row * step - bleed,
          w: (col - runStart + 1) * step + bleed * 2,
          h: step + bleed * 2,
        });
        i++;
      }
      region._hlRuns = runs;
      return runs;
    }

    _drawHighlights(ctx) {
      if (this.hoveredRegion && this.hoveredRegion !== this.selectedRegion) {
        ctx.fillStyle = this.theme.highlightColor;
        ctx.beginPath();
        for (const r of this._getRegionRuns(this.hoveredRegion)) ctx.rect(r.x, r.y, r.w, r.h);
        ctx.fill();
      }
      if (this.selectedRegion) {
        ctx.fillStyle = this.theme.selectedColor;
        ctx.beginPath();
        for (const r of this._getRegionRuns(this.selectedRegion)) ctx.rect(r.x, r.y, r.w, r.h);
        ctx.fill();
      }
    }

    _drawBorders(ctx) {
      const borders = this._borderData;
      const step = this.grid.step;
      ctx.lineJoin = "round"; ctx.lineCap = "round";

      // Filter out very short/spurious faction border chains.
      const minLen = step * 3;
      const validFB = borders.factionBorders.filter(b => {
        if (b.points.length < 4) return false;
        let len = 0;
        for (let i = 1; i < b.points.length; i++) {
          const dx = b.points[i].x - b.points[i - 1].x;
          const dy = b.points[i].y - b.points[i - 1].y;
          len += Math.sqrt(dx * dx + dy * dy);
          if (len >= minLen) return true;
        }
        return false;
      });

      // --- Faction borders: per-side clipped cover + decorative line ---
      //
      // For each border between factions A and B we:
      //  1. Build a smooth curve path from the border points.
      //  2. Build two clip polygons — one for each side of the curve —
      //     by offsetting the curve left/right by a large amount.
      //  3. Draw a wide stroke in faction A's color, clipped to A's side.
      //  4. Draw a wide stroke in faction B's color, clipped to B's side.
      // This ensures each faction's smooth color reaches exactly to the
      // border with NO bleed to the wrong side and NO staircase gaps.
      //  5. Draw a thin decorative border line on top.

      const coverWidth = step * 5.0;
      const sideOffset = step * 20; // how far the clip polygon extends

      for (const b of validFB) {
        const fA = this.ts.factions[b.a];
        const fB = this.ts.factions[b.b];
        if (!fA || !fB) continue;
        const pts = b.points;
        if (pts.length < 2) continue;

        // Compute per-point normals (perpendicular to curve direction)
        const normals = [];
        for (let i = 0; i < pts.length; i++) {
          const prev = pts[Math.max(0, i - 1)];
          const next = pts[Math.min(pts.length - 1, i + 1)];
          let nx = -(next.y - prev.y);
          let ny = next.x - prev.x;
          const len = Math.sqrt(nx * nx + ny * ny);
          if (len > 0.001) { nx /= len; ny /= len; }
          normals.push({ x: nx, y: ny });
        }

        // Determine which side faction A is on by sampling the grid
        // at a small offset from the border midpoint
        const midIdx = Math.floor(pts.length / 2);
        const probeX = pts[midIdx].x + normals[midIdx].x * step * 2;
        const probeY = pts[midIdx].y + normals[midIdx].y * step * 2;
        const probeCell = this.grid.cellAt(probeX, probeY);
        const probeIsA = probeCell >= 0 && this.grid.faction[probeCell] === b.a;
        // If probe is faction A, then the "normal" side is A's side
        // If probe is faction B, then the "normal" side is B's side
        const sideASign = probeIsA ? 1 : -1;

        // Build clip polygon for side A: curve points offset toward A + far edge
        const buildSideClip = (sign) => {
          const forward = [];
          const back = [];
          for (let i = 0; i < pts.length; i++) {
            forward.push({
              x: pts[i].x + normals[i].x * sign * 0.5,
              y: pts[i].y + normals[i].y * sign * 0.5,
            });
            back.push({
              x: pts[i].x + normals[i].x * sign * sideOffset,
              y: pts[i].y + normals[i].y * sign * sideOffset,
            });
          }
          back.reverse();
          return forward.concat(back);
        };

        // Draw faction A's side
        const clipA = buildSideClip(sideASign);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(clipA[0].x, clipA[0].y);
        for (let i = 1; i < clipA.length; i++) ctx.lineTo(clipA[i].x, clipA[i].y);
        ctx.closePath();
        ctx.clip();
        ctx.strokeStyle = fA.fill;
        ctx.lineWidth = coverWidth;
        this._strokeSmoothCurve(ctx, pts);
        ctx.restore();

        // Draw faction B's side
        const clipB = buildSideClip(-sideASign);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(clipB[0].x, clipB[0].y);
        for (let i = 1; i < clipB.length; i++) ctx.lineTo(clipB[i].x, clipB[i].y);
        ctx.closePath();
        ctx.clip();
        ctx.strokeStyle = fB.fill;
        ctx.lineWidth = coverWidth;
        this._strokeSmoothCurve(ctx, pts);
        ctx.restore();
      }

      // Decorative border line on top
      ctx.strokeStyle = this.theme.factionBorderColor;
      ctx.lineWidth = Math.max(step * 0.35, this.theme.factionBorderWidth / this.zoom);
      for (const b of validFB) this._strokeSmoothCurve(ctx, b.points);
    }

    _drawCoastlineStroke(ctx) {
      // Skip if coastline stroke is disabled (width 0 or transparent)
      if (this.theme.coastlineWidth <= 0) return;
      ctx.strokeStyle = this.theme.coastlineColor;
      ctx.lineWidth = this.theme.coastlineWidth / this.zoom;
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      for (const poly of this._coastlineCache) {
        if (poly.length < 3) continue;
        ctx.beginPath();
        ctx.moveTo(poly[0][0], poly[0][1]);
        for (let i = 0; i < poly.length; i++) {
          const next = poly[(i + 1) % poly.length];
          const mx = (poly[i][0] + next[0]) / 2;
          const my = (poly[i][1] + next[1]) / 2;
          ctx.quadraticCurveTo(poly[i][0], poly[i][1], mx, my);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    /** Stroke a point chain using smooth quadratic curves (no sharp corners) */
    _strokeSmoothCurve(ctx, points) {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      if (points.length === 2) {
        ctx.lineTo(points[1].x, points[1].y);
      } else {
        // Use midpoints as control anchors for smooth quadratic curves
        for (let i = 0; i < points.length - 1; i++) {
          const mx = (points[i].x + points[i + 1].x) / 2;
          const my = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, mx, my);
        }
        // Final segment to last point
        const last = points[points.length - 1];
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();
    }

    _drawRoads(ctx) {
      if (!this.rs || !this.rs.roads.length) return;
      const s = this.grid.mapW / 2800;
      ctx.lineCap = "round"; ctx.lineJoin = "round";

      // Sort: branch roads first (underneath), trunk roads on top
      const sorted = this.rs.roads.slice().sort((a, b) => (a.trunk ? 1 : 0) - (b.trunk ? 1 : 0));
      const t = this.theme;

      for (const road of sorted) {
        const pts = road.points;
        if (pts.length < 2) continue;

        if (road.trunk) {
          // Trunk road: solid dark casing + solid lighter core
          // This gives a clean "main highway" look
          ctx.setLineDash([]);
          ctx.strokeStyle = t.trunkRoadCasing;
          ctx.lineWidth = t.trunkRoadCasingWidth * s;
          this._strokeRoadPath(ctx, pts);

          ctx.strokeStyle = t.trunkRoadColor;
          ctx.lineWidth = t.trunkRoadWidth * s;
          this._strokeRoadPath(ctx, pts);
        } else {
          // Branch road: dashed line, no casing — lighter and thinner
          const dash = t.branchDash;
          ctx.setLineDash(dash.map(d => d * Math.max(s, 0.5)));
          ctx.strokeStyle = t.branchRoadColor;
          ctx.lineWidth = t.branchRoadWidth * s;
          this._strokeRoadPath(ctx, pts);
        }
      }
      ctx.setLineDash([]);
    }

    _strokeRoadPath(ctx, points) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      if (points.length <= 2) {
        ctx.lineTo(points[1].x, points[1].y);
      } else {
        for (let i = 0; i < points.length - 1; i++) {
          const mx = (points[i].x + points[i + 1].x) / 2;
          const my = (points[i].y + points[i + 1].y) / 2;
          ctx.quadraticCurveTo(points[i].x, points[i].y, mx, my);
        }
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
      }
      ctx.stroke();
    }

    _drawCities(ctx) {
      const regions = this.ts.regions, factions = this.ts.factions;
      const z = this.zoom;
      const capAlpha = z < 0.12 ? 0 : z < 0.22 ? (z - 0.12) / 0.10 : 1.0;
      const townAlpha = z < 0.25 ? 0 : z < 0.35 ? (z - 0.25) / 0.10 : 1.0;
      const baseSize = Math.min(Math.max(3, 5 / z), 14);

      for (const region of regions) {
        const faction = factions[region.factionId];
        if (!faction) continue;
        for (const city of region.cities) {
          const isHovered = city === this.hoveredCity;
          const isSelected = city === this.selectedCity;
          if (city.capital) {
            if (capAlpha < 0.01) continue;
            ctx.globalAlpha = capAlpha;
            const s = baseSize * 1.1 * (isHovered ? 1.2 : 1.0);
            ctx.shadowColor = isSelected ? "#fff" : this.theme.capitalMarkerColor;
            ctx.shadowBlur = Math.min((isHovered ? 10 : 6) / z, 24) * capAlpha;
            ctx.fillStyle = "rgba(8,8,10,0.6)";
            ctx.beginPath(); ctx.arc(city.x, city.y, s + Math.min(2/z, 6), 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = isSelected ? "#ffe0a0" : this.theme.capitalMarkerColor;
            ctx.beginPath(); ctx.arc(city.x, city.y, s, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = isSelected ? "#fff" : this.theme.capitalMarkerColor;
            ctx.lineWidth = Math.min((isHovered ? 3 : 2) / z, 6);
            const d = s * 1.3;
            ctx.beginPath();
            ctx.moveTo(city.x, city.y - d); ctx.lineTo(city.x + d, city.y);
            ctx.lineTo(city.x, city.y + d); ctx.lineTo(city.x - d, city.y);
            ctx.closePath(); ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1.0;
          } else {
            if (townAlpha < 0.01) continue;
            ctx.globalAlpha = townAlpha;
            const s = baseSize * (isHovered ? 1.2 : 1.0);
            ctx.fillStyle = "rgba(8,8,10,0.6)";
            ctx.beginPath(); ctx.arc(city.x, city.y, s + Math.min(1.5/z, 4), 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = isSelected ? "#ffe0a0" : isHovered ? "#fff" : this.theme.cityMarkerColor;
            ctx.beginPath(); ctx.arc(city.x, city.y, s, 0, Math.PI*2); ctx.fill();
            if (isHovered || isSelected) {
              ctx.strokeStyle = isSelected ? "#c9a85c" : "rgba(255,255,255,0.5)";
              ctx.lineWidth = Math.min(1.5 / z, 4);
              ctx.beginPath(); ctx.arc(city.x, city.y, s + 2/z, 0, Math.PI*2); ctx.stroke();
            }
            ctx.globalAlpha = 1.0;
          }
        }
      }
    }

    /**
     * Check if a label bounding box overlaps any already-placed label.
     * boxes is an array of {x1,y1,x2,y2} in world coords.
     */
    _labelFits(boxes, x1, y1, x2, y2, pad) {
      const px1 = x1 - pad, py1 = y1 - pad, px2 = x2 + pad, py2 = y2 + pad;
      for (let i = 0; i < boxes.length; i++) {
        const b = boxes[i];
        if (px1 < b.x2 && px2 > b.x1 && py1 < b.y2 && py2 > b.y1) return false;
      }
      return true;
    }

    _drawLabels(ctx) {
      const regions = this.ts.regions, factions = this.ts.factions;
      const lf = this.opts.labelFont || DEFAULTS.labelFont;
      const bf = this.opts.bodyFont || DEFAULTS.bodyFont;
      const placed = []; // collision boxes in world coords
      const pad = 8 / this.zoom; // padding between labels

      // --- Kingdom / Faction names (always visible, prominent) ---
      const grid = this.grid;
      const kingdomBoxes = []; // collision list for kingdom-vs-kingdom

      // Collect all capital positions for avoidance
      const capitalPts = [];
      for (const region of regions) {
        for (const city of region.cities) {
          if (city.capital) capitalPts.push({ x: city.x, y: city.y, fid: region.factionId });
        }
      }

      {
        const alpha = this.zoom < 0.15 ? 0.50
          : this.zoom < 0.25 ? 0.40
          : this.zoom < 0.50 ? 0.28
          : this.zoom < 0.80 ? 0.18
          : 0.12;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";

        // Sort regions by territory size descending — largest placed first
        const regionOrder = regions.slice().filter(r => r.cells.size > 0)
          .sort((a, b) => b.cells.size - a.cells.size);

        for (const region of regionOrder) {
          // Collect all cell positions and compute bounding box
          let sx = 0, sy = 0, cellCount = 0;
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          for (const idx of region.cells) {
            const cx = grid.cx(idx), cy = grid.cy(idx);
            sx += cx; sy += cy; cellCount++;
            if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
            if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
          }
          if (cellCount === 0) continue;
          const centX = sx / cellCount, centY = sy / cellCount;
          const terW = maxX - minX, terH = maxY - minY;

          const text = region.name.toUpperCase();

          // Size font purely from territory width — zoom-independent in world space
          const targetFill = 0.85;
          const targetW = terW * targetFill;
          const refSize = 50;
          const ls = Math.max(2, terW * 0.003);
          ctx.font = `700 ${refSize}px ${lf}`;
          try { ctx.letterSpacing = `${ls}px`; } catch(e) {}
          const refW = ctx.measureText(text).width;
          let ffs = refW > 0 ? clamp(refSize * (targetW / refW), 12, terH * 0.5) : refSize;
          ctx.font = `700 ${ffs}px ${lf}`;

          // Count how many boundary-check points lie inside the region
          const boxInsideRatio = (bx, by, bw, bh, rid) => {
            let total = 0, inside = 0;
            for (let xf = -0.5; xf <= 0.5; xf += 0.25) {
              for (let yf = -0.5; yf <= 0.5; yf += 0.5) {
                total++;
                const ci = grid.cellAt(bx + bw * xf, by + bh * yf);
                if (ci >= 0 && grid.owner[ci] === rid) inside++;
              }
            }
            return inside / total;
          };

          // Build exclusion zones around cities
          const cityZones = [];
          const capR = grid.step * 2.5;
          const townR = grid.step * 1.2;
          for (const city of region.cities) {
            const r = city.capital ? capR : townR;
            cityZones.push({ x: city.x, y: city.y, r, x1: city.x - r, y1: city.y - r * 1.3, x2: city.x + r, y2: city.y + r * 1.3 });
          }
          const hitsCity = (x1, y1, x2, y2) => {
            for (const z of cityZones) {
              if (x1 < z.x2 && x2 > z.x1 && y1 < z.y2 && y2 > z.y1) return true;
            }
            return false;
          };

          ctx.fillStyle = hexToRgba("#f2e8d6", alpha);
          let placed_ok = false;

          const scaleSteps = [1.0, 0.85, 0.70, 0.55, 0.45, 0.35, 0.25];

          for (let ai = 0; ai < scaleSteps.length && !placed_ok; ai++) {
            const curFFS = Math.max(8, ffs * scaleSteps[ai]);
            ctx.font = `700 ${curFFS}px ${lf}`;
            const curTW = ctx.measureText(text).width;
            const curTH = curFFS * 1.2;

            const sampleDiv = ai < 3 ? 10 : 15;
            const sampleStep = Math.max(grid.step, Math.min(terW, terH) / sampleDiv);

            const candidates = [];
            for (let py = minY + sampleStep * 0.5; py < maxY; py += sampleStep) {
              for (let px = minX + sampleStep * 0.5; px < maxX; px += sampleStep) {
                const ci = grid.cellAt(px, py);
                if (ci < 0 || grid.owner[ci] !== region.id) continue;

                const ratio = boxInsideRatio(px, py, curTW, curTH, region.id);
                if (ratio < 1.0) continue;

                const x1 = px - curTW * 0.5, y1 = py - curTH * 0.5;
                const x2 = x1 + curTW, y2 = y1 + curTH;

                if (ai < 4 && hitsCity(x1, y1, x2, y2)) continue;
                if (!this._labelFits(kingdomBoxes, x1, y1, x2, y2, pad)) continue;

                const centDist = Math.sqrt((px - centX) ** 2 + (py - centY) ** 2);
                candidates.push({ x: px, y: py, score: -centDist });
              }
            }

            if (candidates.length > 0) {
              candidates.sort((a, b) => b.score - a.score);
              const best = candidates[0];
              const x1 = best.x - curTW * 0.5, y1 = best.y - curTH * 0.5;
              ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = Math.min(8 / this.zoom, 30);
              ctx.fillText(text, best.x, best.y);
              ctx.shadowBlur = 0;
              kingdomBoxes.push({ x1, y1, x2: x1 + curTW, y2: y1 + curTH });
              placed_ok = true;
            }
          }

          // Last resort: place at the deepest interior point
          if (!placed_ok) {
            const fallFFS = Math.max(8, ffs * 0.2);
            ctx.font = `700 ${fallFFS}px ${lf}`;

            let bestIdx = -1, bestInterior = -1;
            for (const idx of region.cells) {
              let interior = 0;
              for (const nIdx of grid.neighbors4(idx)) {
                if (grid.owner[nIdx] === region.id) interior++;
              }
              const cx = grid.cx(idx), cy = grid.cy(idx);
              const cDist = Math.sqrt((cx - centX) ** 2 + (cy - centY) ** 2);
              const score = interior * 10000 - cDist;
              if (score > bestInterior) { bestInterior = score; bestIdx = idx; }
            }

            if (bestIdx >= 0) {
              const fx = grid.cx(bestIdx), fy = grid.cy(bestIdx);
              ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = Math.min(8 / this.zoom, 30);
              ctx.fillText(text, fx, fy);
              ctx.shadowBlur = 0;
              const ftw = ctx.measureText(text).width, fth = fallFFS * 1.2;
              kingdomBoxes.push({ x1: fx-ftw*0.5, y1: fy-fth*0.5, x2: fx+ftw*0.5, y2: fy+fth*0.5 });
            }
          }
        }
        try { ctx.letterSpacing = "0px"; } catch(e) {}
      }

      // --- Region names removed from map — shown only in info panel on click ---

      // --- Capital city names (fade in with markers, invisible when zoomed out) ---
      {
        const capLabelAlpha = this.zoom < 0.15 ? 0 : this.zoom < 0.25 ? (this.zoom - 0.15) / 0.10 : 1.0;
        if (capLabelAlpha > 0.01) {
        const cfs = clamp(10 / this.zoom, 14, 55);
        ctx.font = `400 italic ${cfs}px ${bf}`;
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        const baseSize = Math.min(Math.max(3, 5 / this.zoom), 14);
        for (const region of regions) {
          for (const city of region.cities) {
            if (!city.capital) continue;
            const yOff = baseSize * 1.1 * 1.3 + 6 / this.zoom;
            const tw = ctx.measureText(city.name).width;
            const th = cfs;
            const cx = city.x - tw * 0.5, cy = city.y + yOff;
            if (this._labelFits(placed, cx, cy, cx + tw, cy + th, pad * 0.5)) {
              ctx.globalAlpha = capLabelAlpha;
              ctx.shadowColor = this.theme.labelShadow;
              ctx.shadowBlur = 5 / this.zoom;
              ctx.fillStyle = this.theme.capitalMarkerColor;
              ctx.fillText(city.name, city.x, city.y + yOff);
              ctx.shadowBlur = 0;
              ctx.globalAlpha = 1.0;
              placed.push({ x1: cx, y1: cy, x2: cx + tw, y2: cy + th });
            }
            // Reserve marker area regardless
            const d = baseSize * 1.1 * 1.3 + 4 / this.zoom;
            placed.push({ x1: city.x - d, y1: city.y - d, x2: city.x + d, y2: city.y + d });
          }
        }
        ctx.textBaseline = "middle";
        } // end capLabelAlpha check
      }

      // --- Town names (only when zoomed in) ---
      if (this.zoom > 0.30) {
        const cfs = clamp(10 / this.zoom, 14, 55);
        ctx.font = `400 italic ${cfs}px ${bf}`;
        ctx.textAlign = "center"; ctx.textBaseline = "top";
        const baseSize = Math.max(3, 6 / this.zoom);
        const allTowns = [];
        for (const region of regions) {
          for (const city of region.cities) {
            if (!city.capital) allTowns.push(city);
          }
        }
        for (const city of allTowns) {
          const yOff = baseSize + 5 / this.zoom;
          const tw = ctx.measureText(city.name).width;
          const th = cfs;
          const cx = city.x - tw * 0.5, cy = city.y + yOff;
          if (this._labelFits(placed, cx, cy, cx + tw, cy + th, pad * 0.5)) {
            ctx.shadowColor = this.theme.labelShadow;
            ctx.shadowBlur = 5 / this.zoom;
            ctx.fillStyle = this.theme.labelColor;
            ctx.fillText(city.name, city.x, city.y + yOff);
            ctx.shadowBlur = 0;
            placed.push({ x1: cx, y1: cy, x2: cx + tw, y2: cy + th });
          }
        }
        ctx.textBaseline = "middle";
      }
    }


    /**
     * Draw POI markers on the map — small icons with backing circles.
     * Visible from medium zoom; labels appear at higher zoom.
     */
    _drawPOIs(ctx) {
      if (!this.pois || this.pois.length === 0) return;
      const z = this.zoom;

      // Two-tier visibility:
      //  Major POIs: fade in 0.18–0.28 (alongside towns, after capitals)
      //  Minor POIs: fade in 0.35–0.45 (after towns fully visible)
      const majorAlpha = z < 0.18 ? 0 : z < 0.28 ? (z - 0.18) / 0.10 : 1.0;
      const minorAlpha = z < 0.35 ? 0 : z < 0.45 ? (z - 0.35) / 0.10 : 1.0;
      if (majorAlpha < 0.01 && minorAlpha < 0.01) return;

      const baseR = clamp(6 / z, 4, 18);
      const fontSize = clamp(9 / z, 10, 40);
      const iconSize = clamp(10 / z, 8, 32);
      const bf = this.opts.bodyFont || DEFAULTS.bodyFont;

      ctx.save();
      for (const poi of this.pois) {
        if (!poi.discovered) continue;

        const isMajor = !!poi.major;
        const alpha = isMajor ? majorAlpha : minorAlpha;
        if (alpha < 0.01) continue;

        const isHovered = poi === this.hoveredPOI;
        const isSelected = poi === this.selectedPOI;
        const scaleFactor = isMajor ? 1.5 : 1.0; // major POIs are 50% larger
        const r = baseR * scaleFactor * (isHovered ? 1.25 : 1.0);

        ctx.globalAlpha = alpha * (isHovered ? 1.0 : 0.85);

        // Backing circle — major POIs get a richer, more dramatic look
        if (isMajor) {
          // Outer glow for major POIs
          ctx.shadowColor = isSelected ? "#c9a85c" : "rgba(180,140,60,0.6)";
          ctx.shadowBlur = Math.min((isHovered ? 14 : 8) / z, 30);
          ctx.fillStyle = isSelected ? "rgba(50,35,10,0.95)" : "rgba(20,15,5,0.90)";
          ctx.beginPath(); ctx.arc(poi.x, poi.y, r + 3 / z, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = 0;

          // Double border ring for major
          ctx.strokeStyle = isSelected ? "#ffe0a0" : isHovered ? "#c9a85c" : "rgba(201,168,92,0.7)";
          ctx.lineWidth = (isSelected ? 3.0 : isHovered ? 2.5 : 1.8) / z;
          ctx.beginPath(); ctx.arc(poi.x, poi.y, r + 3 / z, 0, Math.PI * 2); ctx.stroke();
          // Inner ring
          ctx.strokeStyle = "rgba(201,168,92,0.3)";
          ctx.lineWidth = 1.0 / z;
          ctx.beginPath(); ctx.arc(poi.x, poi.y, r - 1 / z, 0, Math.PI * 2); ctx.stroke();
        } else {
          // Standard minor POI backing
          ctx.fillStyle = isSelected ? "rgba(40,30,15,0.95)" : "rgba(12,10,8,0.80)";
          ctx.beginPath(); ctx.arc(poi.x, poi.y, r + 2 / z, 0, Math.PI * 2); ctx.fill();

          ctx.strokeStyle = isSelected ? "#c9a85c" : isHovered ? "rgba(201,168,92,0.8)" : "rgba(180,160,120,0.4)";
          ctx.lineWidth = (isSelected ? 2.5 : isHovered ? 2.0 : 1.2) / z;
          ctx.beginPath(); ctx.arc(poi.x, poi.y, r + 2 / z, 0, Math.PI * 2); ctx.stroke();
        }

        // Icon character — major icons slightly larger
        ctx.fillStyle = isSelected ? "#c9a85c" : isMajor ? "#ffe0a0" : "#f2e8d6";
        ctx.font = `${iconSize * scaleFactor}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(poi.icon, poi.x, poi.y + 1 / z);

        // Name label — major POIs show labels earlier
        const labelMinZoom = isMajor ? 0.22 : 0.38;
        const labelMaxZoom = labelMinZoom + 0.10;
        if (z > labelMinZoom) {
          const labelAlpha = z < labelMinZoom ? 0 : z < labelMaxZoom ? (z - labelMinZoom) / 0.10 : 1.0;
          ctx.globalAlpha = alpha * labelAlpha * 0.9;
          const labelSize = isMajor ? fontSize * 1.2 : fontSize;
          ctx.font = isMajor ? `600 ${labelSize}px ${bf}` : `400 italic ${labelSize}px ${bf}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.shadowColor = "rgba(0,0,0,0.9)";
          ctx.shadowBlur = 4 / z;
          ctx.fillStyle = isMajor ? "#e8d8b0" : "#d4c8a8";
          ctx.fillText(poi.name, poi.x, poi.y + r + 6 / z);
          ctx.shadowBlur = 0;
        }
      }
      ctx.globalAlpha = 1.0;
      ctx.restore();
    }

    /**
     * Draw a popup box for the selected or hovered POI.
     * Drawn in SCREEN space (after the main world-space transform).
     */
    _drawPOIPopup(ctx) {
      const poi = this.selectedPOI || this.hoveredPOI;
      if (!poi) return;
      const z = this.zoom;
      if (z < 0.12) return; // allow popups for major POIs at wider zoom

      // Convert POI world coords to screen coords
      const sx = poi.x * z + this.panX;
      const sy = poi.y * z + this.panY;
      const dpr = typeof devicePixelRatio !== "undefined" ? devicePixelRatio : 1;

      ctx.save();
      // Reset transform to screen space
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isExpanded = this.selectedPOI === poi && this._poiExpanded;
      const pad = 12;
      const maxW = 320;
      const lineH = 16;

      // Measure text
      const bf = this.opts.bodyFont || DEFAULTS.bodyFont;
      const lf = this.opts.labelFont || DEFAULTS.labelFont;
      ctx.font = `600 14px ${lf}`;
      const poiNameWidth = ctx.measureText(poi.name).width;

      ctx.font = `12px ${bf}`;
      const typeStr = `${poi.icon} ${poi.label}`;
      const dangerStr = "\u2605".repeat(poi.danger) + "\u2606".repeat(5 - poi.danger);

      // Word-wrap description
      const wrapText = (text, maxWidth) => {
        if (!text || typeof text !== "string") return [];
        const words = text.split(" ");
        const lines = [];
        let line = "";
        for (const word of words) {
          const test = line ? line + " " + word : word;
          if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = word;
          } else {
            line = test;
          }
        }
        if (line) lines.push(line);
        return lines;
      };

      const descLines = wrapText(poi.description, maxW - pad * 2);
      let hookLines = [];
      if (isExpanded) {
        ctx.font = `italic 12px ${bf}`;
        hookLines = wrapText(poi.hook ? '"' + poi.hook + '"' : "", maxW - pad * 2);
      }

      // Calculate box height
      let boxH = pad + 18 + 4 + lineH + 4; // title + type/danger line
      boxH += descLines.length * lineH + 4;
      if (isExpanded) {
        boxH += 6 + hookLines.length * lineH + 4;
        boxH += lineH; // "Rumour:" label
      }
      if (this.selectedPOI === poi && !isExpanded) {
        boxH += lineH + 4; // "Click for more..." hint
      }
      boxH += pad;

      const boxW = maxW;

      // Position popup above the POI marker
      let bx = sx - boxW / 2;
      let by = sy - boxH - 20;
      // Keep on screen
      const canvasW = this.canvas.clientWidth;
      const canvasH = this.canvas.clientHeight;
      if (bx < 8) bx = 8;
      if (bx + boxW > canvasW - 8) bx = canvasW - boxW - 8;
      if (by < 8) by = sy + 30; // flip below if not enough room above

      // Draw box background
      const cornerR = 6;
      ctx.beginPath();
      ctx.moveTo(bx + cornerR, by);
      ctx.lineTo(bx + boxW - cornerR, by);
      ctx.quadraticCurveTo(bx + boxW, by, bx + boxW, by + cornerR);
      ctx.lineTo(bx + boxW, by + boxH - cornerR);
      ctx.quadraticCurveTo(bx + boxW, by + boxH, bx + boxW - cornerR, by + boxH);
      ctx.lineTo(bx + cornerR, by + boxH);
      ctx.quadraticCurveTo(bx, by + boxH, bx, by + boxH - cornerR);
      ctx.lineTo(bx, by + cornerR);
      ctx.quadraticCurveTo(bx, by, bx + cornerR, by);
      ctx.closePath();
      ctx.fillStyle = "rgba(18,16,12,0.94)";
      ctx.fill();
      ctx.strokeStyle = poi.major ? "rgba(201,168,92,0.8)" : "rgba(201,168,92,0.5)";
      ctx.lineWidth = poi.major ? 1.5 : 1;
      ctx.stroke();

      // Draw pointer triangle toward POI
      const ptrX = clamp(sx, bx + 20, bx + boxW - 20);
      const ptrDir = by < sy ? 1 : -1; // 1 = below box, -1 = above box
      const ptrY = ptrDir > 0 ? by + boxH : by;
      ctx.beginPath();
      ctx.moveTo(ptrX - 8, ptrY);
      ctx.lineTo(ptrX, ptrY + ptrDir * 10);
      ctx.lineTo(ptrX + 8, ptrY);
      ctx.closePath();
      ctx.fillStyle = "rgba(18,16,12,0.94)";
      ctx.fill();

      // Draw text content
      let ty = by + pad;
      // Title
      ctx.font = `600 14px ${lf}`;
      ctx.fillStyle = poi.major ? "#ffe0a0" : "#c9a85c";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.fillText(poi.name, bx + pad, ty);
      // LEGENDARY tag for major POIs
      if (poi.major) {
        const titleEndX = bx + pad + poiNameWidth + 8;
        ctx.font = `700 9px ${lf}`;
        const tagText = "LEGENDARY";
        const tagW = ctx.measureText(tagText).width + 8;
        const tagH = 14;
        const tagY = ty + 1;
        ctx.fillStyle = "rgba(201,168,92,0.25)";
        ctx.beginPath();
        // Manual round rect for compatibility
        const tr = 3;
        ctx.moveTo(titleEndX + tr, tagY);
        ctx.lineTo(titleEndX + tagW - tr, tagY);
        ctx.quadraticCurveTo(titleEndX + tagW, tagY, titleEndX + tagW, tagY + tr);
        ctx.lineTo(titleEndX + tagW, tagY + tagH - tr);
        ctx.quadraticCurveTo(titleEndX + tagW, tagY + tagH, titleEndX + tagW - tr, tagY + tagH);
        ctx.lineTo(titleEndX + tr, tagY + tagH);
        ctx.quadraticCurveTo(titleEndX, tagY + tagH, titleEndX, tagY + tagH - tr);
        ctx.lineTo(titleEndX, tagY + tr);
        ctx.quadraticCurveTo(titleEndX, tagY, titleEndX + tr, tagY);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#c9a85c";
        ctx.fillText(tagText, titleEndX + 4, tagY + 2);
      }
      ty += 20;

      // Type + danger
      ctx.font = `12px ${bf}`;
      ctx.fillStyle = "#a89878";
      ctx.fillText(typeStr, bx + pad, ty);
      const dangerX = bx + boxW - pad - ctx.measureText(dangerStr).width;
      ctx.fillStyle = "#c9a85c";
      ctx.fillText(dangerStr, dangerX, ty);
      ty += lineH + 6;

      // Thin separator line
      ctx.strokeStyle = "rgba(180,160,120,0.2)";
      ctx.beginPath();
      ctx.moveTo(bx + pad, ty - 2);
      ctx.lineTo(bx + boxW - pad, ty - 2);
      ctx.stroke();

      // Description
      ctx.font = `12px ${bf}`;
      ctx.fillStyle = "#d4c8a8";
      for (const line of descLines) {
        ctx.fillText(line, bx + pad, ty);
        ty += lineH;
      }

      if (isExpanded) {
        ty += 6;
        ctx.font = `600 11px ${bf}`;
        ctx.fillStyle = "#a89060";
        ctx.fillText("RUMOUR:", bx + pad, ty);
        ty += lineH;
        ctx.font = `italic 12px ${bf}`;
        ctx.fillStyle = "#c0b090";
        for (const line of hookLines) {
          ctx.fillText(line, bx + pad, ty);
          ty += lineH;
        }
      } else if (this.selectedPOI === poi) {
        ty += 4;
        ctx.font = `italic 11px ${bf}`;
        ctx.fillStyle = "rgba(201,168,92,0.6)";
        ctx.fillText("Click again for more details\u2026", bx + pad, ty);
      }

      ctx.restore();
    }

    /**
     * Draw a popup box for the selected or hovered city.
     * Drawn in SCREEN space (after the main world-space transform).
     */
    _drawCityPopup(ctx) {
      const city = this.selectedCity || this.hoveredCity;
      if (!city) return;
      // Don't draw city popup if a POI popup is showing
      if (this.selectedPOI || this.hoveredPOI) return;
      const z = this.zoom;
      if (z < 0.12) return;

      const sx = city.x * z + this.panX;
      const sy = city.y * z + this.panY;
      const dpr = typeof devicePixelRatio !== "undefined" ? devicePixelRatio : 1;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isExpanded = this.selectedCity === city && this._cityExpanded;
      const pad = 12;
      const maxW = 300;
      const lineH = 16;
      const bf = this.opts.bodyFont || DEFAULTS.bodyFont;
      const lf = this.opts.labelFont || DEFAULTS.labelFont;

      // Word-wrap helper
      const wrapText = (text, font, maxWidth) => {
        if (!text || typeof text !== "string") return [];
        ctx.font = font;
        const words = text.split(" ");
        const lines = [];
        let line = "";
        for (const word of words) {
          const test = line ? line + " " + word : word;
          if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line); line = word;
          } else { line = test; }
        }
        if (line) lines.push(line);
        return lines;
      };

      // Find faction info
      const region = city.regionId >= 0 && city.regionId < this.ts.regions.length ? this.ts.regions[city.regionId] : null;
      const faction = region ? this.ts.factions[region.factionId] : null;
      const factionName = faction ? faction.name : "Unclaimed";
      const regionName = region ? region.name : "Unknown";

      // Build description
      const desc = `${city.capital ? "Capital city" : "Town"} of ${regionName}, ${city.trait || "a modest settlement"}.`;
      const descLines = wrapText(desc, `12px ${bf}`, maxW - pad * 2);

      // Atmosphere line (sensory detail)
      let atmosLines = [];
      if (city.atmosphere) {
        atmosLines = wrapText(city.atmosphere + ".", `italic 11px ${bf}`, maxW - pad * 2);
      }

      const popStr = city.population ? city.population.toLocaleString() : "???";
      const tradeStr = city.trade || "general goods";
      const tradeTextLines = wrapText(`Trade: ${tradeStr}`, `11px ${bf}`, maxW - pad - 90 - pad);

      let hookLines = [];
      let npcLine = "";
      let npcDetailLines = [];
      if (isExpanded) {
        if (city.hook) hookLines = wrapText('"' + city.hook + '"', `italic 12px ${bf}`, maxW - pad * 2);
        if (city.npc) {
          npcLine = `${city.npc.name} \u2014 ${city.npc.role}`;
          if (city.npc.detail) {
            npcDetailLines = wrapText(city.npc.detail, `11px ${bf}`, maxW - pad * 2);
          }
        }
      }

      // Calculate box height
      let boxH = pad + 20 + 4; // title
      boxH += lineH; // faction line
      boxH += 4 + descLines.length * lineH; // description
      if (atmosLines.length > 0) boxH += 2 + atmosLines.length * 14; // atmosphere
      boxH += 6; // gap before separator
      boxH += Math.max(1, tradeTextLines.length) * lineH + 4; // pop + trade
      if (isExpanded) {
        boxH += 8 + lineH; // "Notable Figure" header
        if (npcLine) boxH += lineH;
        if (npcDetailLines.length > 0) boxH += npcDetailLines.length * 14 + 2;
        boxH += 12 + lineH; // "Rumour" header
        boxH += hookLines.length * lineH + 4;
      }
      if (this.selectedCity === city && !isExpanded) {
        boxH += lineH + 4; // hint
      }
      boxH += pad;

      const boxW = maxW;
      let bx = sx - boxW / 2;
      let by = sy - boxH - 24;
      const canvasW = this.canvas.clientWidth;
      if (bx < 8) bx = 8;
      if (bx + boxW > canvasW - 8) bx = canvasW - boxW - 8;
      if (by < 8) by = sy + 34;

      // Draw box
      const cornerR = 6;
      ctx.beginPath();
      ctx.moveTo(bx + cornerR, by);
      ctx.lineTo(bx + boxW - cornerR, by);
      ctx.quadraticCurveTo(bx + boxW, by, bx + boxW, by + cornerR);
      ctx.lineTo(bx + boxW, by + boxH - cornerR);
      ctx.quadraticCurveTo(bx + boxW, by + boxH, bx + boxW - cornerR, by + boxH);
      ctx.lineTo(bx + cornerR, by + boxH);
      ctx.quadraticCurveTo(bx, by + boxH, bx, by + boxH - cornerR);
      ctx.lineTo(bx, by + cornerR);
      ctx.quadraticCurveTo(bx, by, bx + cornerR, by);
      ctx.closePath();
      ctx.fillStyle = "rgba(18,16,12,0.94)";
      ctx.fill();
      ctx.strokeStyle = city.capital ? "rgba(201,168,92,0.6)" : "rgba(180,170,150,0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Pointer
      const ptrX = clamp(sx, bx + 20, bx + boxW - 20);
      const ptrDir = by < sy ? 1 : -1;
      const ptrY = ptrDir > 0 ? by + boxH : by;
      ctx.beginPath();
      ctx.moveTo(ptrX - 8, ptrY);
      ctx.lineTo(ptrX, ptrY + ptrDir * 10);
      ctx.lineTo(ptrX + 8, ptrY);
      ctx.closePath();
      ctx.fillStyle = "rgba(18,16,12,0.94)";
      ctx.fill();

      // Content
      let ty = by + pad;

      // Title with icon
      ctx.font = `600 14px ${lf}`;
      ctx.fillStyle = city.capital ? "#c9a85c" : "#f2e8d6";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      const cityIcon = city.capital ? "\u2666 " : "\u25CF ";
      ctx.fillText(cityIcon + city.name, bx + pad, ty);

      // Capital/Town badge right-aligned
      ctx.font = `600 10px ${bf}`;
      ctx.fillStyle = city.capital ? "rgba(201,168,92,0.7)" : "rgba(200,190,170,0.5)";
      const badge = city.capital ? "CAPITAL" : "TOWN";
      ctx.textAlign = "right";
      ctx.fillText(badge, bx + boxW - pad, ty + 3);
      ctx.textAlign = "left";
      ty += 20;

      // Faction
      ctx.font = `italic 11px ${bf}`;
      ctx.fillStyle = "#a89878";
      ctx.fillText(factionName, bx + pad, ty);
      ty += lineH + 2;

      // Separator
      ctx.strokeStyle = "rgba(180,160,120,0.2)";
      ctx.beginPath();
      ctx.moveTo(bx + pad, ty - 1);
      ctx.lineTo(bx + boxW - pad, ty - 1);
      ctx.stroke();
      ty += 2;

      // Description
      ctx.font = `12px ${bf}`;
      ctx.fillStyle = "#d4c8a8";
      for (const line of descLines) { ctx.fillText(line, bx + pad, ty); ty += lineH; }

      // Atmosphere — sensory detail in italic, slightly dimmer
      if (atmosLines.length > 0) {
        ty += 2;
        ctx.font = `italic 11px ${bf}`;
        ctx.fillStyle = "#9a8a6a";
        for (const line of atmosLines) { ctx.fillText(line, bx + pad, ty); ty += 14; }
      }
      ty += 6;

      // Separator
      ctx.strokeStyle = "rgba(180,160,120,0.15)";
      ctx.beginPath(); ctx.moveTo(bx + pad, ty - 2); ctx.lineTo(bx + boxW - pad, ty - 2); ctx.stroke();

      // Pop + Trade
      ctx.font = `11px ${bf}`;
      ctx.fillStyle = "#a89878";
      ctx.fillText(`Pop: ~${popStr}`, bx + pad, ty);
      const tradeX = bx + pad + 90;
      for (const tl of tradeTextLines) { ctx.fillText(tl, tradeX, ty); ty += lineH; }
      if (tradeTextLines.length === 0) ty += lineH;
      ty += 4;

      if (isExpanded) {
        // Notable NPC
        ctx.strokeStyle = "rgba(180,160,120,0.15)";
        ctx.beginPath(); ctx.moveTo(bx + pad, ty); ctx.lineTo(bx + boxW - pad, ty); ctx.stroke();
        ty += 6;
        ctx.font = `600 10px ${bf}`;
        ctx.fillStyle = "#a89060";
        ctx.fillText("NOTABLE FIGURE", bx + pad, ty);
        ty += lineH;
        if (npcLine) {
          ctx.font = `600 12px ${bf}`;
          ctx.fillStyle = "#c9a85c";
          ctx.fillText(npcLine, bx + pad, ty);
          ty += lineH;
        }
        // NPC detail / backstory
        if (npcDetailLines.length > 0) {
          ctx.font = `11px ${bf}`;
          ctx.fillStyle = "#a09070";
          for (const dl of npcDetailLines) { ctx.fillText(dl, bx + pad, ty); ty += 14; }
          ty += 2;
        }
        ty += 4;

        // Rumour
        ctx.strokeStyle = "rgba(180,160,120,0.15)";
        ctx.beginPath(); ctx.moveTo(bx + pad, ty); ctx.lineTo(bx + boxW - pad, ty); ctx.stroke();
        ty += 6;
        ctx.font = `600 10px ${bf}`;
        ctx.fillStyle = "#a89060";
        ctx.fillText("RUMOUR", bx + pad, ty);
        ty += lineH;
        ctx.font = `italic 12px ${bf}`;
        ctx.fillStyle = "#c0b090";
        for (const line of hookLines) { ctx.fillText(line, bx + pad, ty); ty += lineH; }
      } else if (this.selectedCity === city) {
        ty += 2;
        ctx.font = `italic 11px ${bf}`;
        ctx.fillStyle = "rgba(201,168,92,0.6)";
        ctx.fillText("Click again for more details\u2026", bx + pad, ty);
      }

      ctx.restore();
    }

    /**
     * Draw topographic contour lines using marching squares → segment chaining → smooth curves.
     * Produces continuous, flowing contour lines like a hand-drawn cartographic map.
     */
    /**
     * Build and cache contour line data. Only runs once since elevation doesn't change.
     */
    _buildContourCache() {
      const grid = this.grid;
      const step = grid.step;
      const cols = grid.cols, rows = grid.rows;
      const levels = [0.07, 0.14, 0.21, 0.28, 0.35, 0.42, 0.50, 0.58, 0.66, 0.75, 0.85];

      // Interpolate crossing point along an edge between two grid corners
      const interpEdge = (c1, r1, e1, c2, r2, e2, lv) => {
        const t = (e1 === e2) ? 0.5 : clamp((lv - e1) / (e2 - e1), 0, 1);
        return [lerpV(c1, c2, t) * step + step * 0.5, lerpV(r1, r2, t) * step + step * 0.5];
      };

      // Edge keys for segment chaining
      const edgeKey = (c, r, side) => (c << 18) | (r << 4) | side; // numeric key (much faster than string)
      const oppositeKey = (c, r, side) => {
        switch (side) {
          case 0: return edgeKey(c, r - 1, 2);
          case 1: return edgeKey(c + 1, r, 3);
          case 2: return edgeKey(c, r + 1, 0);
          case 3: return edgeKey(c - 1, r, 1);
        }
      };

      // Chaikin subdivision: cut corners to produce smoother curves
      const chaikinSmooth = (pts, iterations) => {
        let p = pts;
        for (let iter = 0; iter < iterations; iter++) {
          const q = [p[0]]; // keep first point
          for (let i = 0; i < p.length - 1; i++) {
            q.push([
              p[i][0] * 0.75 + p[i+1][0] * 0.25,
              p[i][1] * 0.75 + p[i+1][1] * 0.25,
            ]);
            q.push([
              p[i][0] * 0.25 + p[i+1][0] * 0.75,
              p[i][1] * 0.25 + p[i+1][1] * 0.75,
            ]);
          }
          q.push(p[p.length - 1]); // keep last point
          p = q;
        }
        return p;
      };

      const contourCache = [];

      for (const level of levels) {
        const levelChains = [];
        // --- Phase 1: Marching squares ---
        const segments = [];
        const endpointMap = new Map();

        for (let r = 0; r < rows - 1; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const i00 = grid.idx(c, r), i10 = grid.idx(c + 1, r);
            const i01 = grid.idx(c, r + 1), i11 = grid.idx(c + 1, r + 1);
            // At least one corner must be land; water corners get sub-threshold elevation
            const l00 = grid.land[i00], l10 = grid.land[i10];
            const l01 = grid.land[i01], l11 = grid.land[i11];
            if (!l00 && !l10 && !l01 && !l11) continue;

            const e00 = l00 ? grid.elevation[i00] : -0.01;
            const e10 = l10 ? grid.elevation[i10] : -0.01;
            const e01 = l01 ? grid.elevation[i01] : -0.01;
            const e11 = l11 ? grid.elevation[i11] : -0.01;
            const ci = (e00 >= level ? 8 : 0) | (e10 >= level ? 4 : 0)
                     | (e01 >= level ? 2 : 0) | (e11 >= level ? 1 : 0);
            if (ci === 0 || ci === 15) continue;

            const topP    = () => interpEdge(c, r, e00, c+1, r, e10, level);
            const rightP  = () => interpEdge(c+1, r, e10, c+1, r+1, e11, level);
            const bottomP = () => interpEdge(c, r+1, e01, c+1, r+1, e11, level);
            const leftP   = () => interpEdge(c, r, e00, c, r+1, e01, level);

            const addSeg = (p1, s1, p2, s2) => {
              const k1 = edgeKey(c, r, s1), k2 = edgeKey(c, r, s2);
              const idx = segments.length;
              segments.push({ p1, p2, k1, k2 });
              if (!endpointMap.has(k1)) endpointMap.set(k1, []);
              endpointMap.get(k1).push(idx);
              if (!endpointMap.has(k2)) endpointMap.set(k2, []);
              endpointMap.get(k2).push(idx);
            };

            // Bit layout: TL=8 TR=4 BL=2 BR=1
            // Cases 5/10: one full side above → single segment top↔bottom
            // Cases 6/9: diagonal saddle → two segments
            switch (ci) {
              case 1: case 14: addSeg(bottomP(), 2, rightP(), 1); break;
              case 2: case 13: addSeg(leftP(), 3, bottomP(), 2); break;
              case 3: case 12: addSeg(leftP(), 3, rightP(), 1); break;
              case 4: case 11: addSeg(topP(), 0, rightP(), 1); break;
              case 5: case 10: addSeg(topP(), 0, bottomP(), 2); break;
              case 6:          addSeg(topP(), 0, leftP(), 3); addSeg(bottomP(), 2, rightP(), 1); break;
              case 7: case 8:  addSeg(topP(), 0, leftP(), 3); break;
              case 9:          addSeg(topP(), 0, rightP(), 1); addSeg(leftP(), 3, bottomP(), 2); break;
            }
          }
        }

        // --- Phase 2: Chain segments into polylines ---
        const used = new Uint8Array(segments.length);
        const chains = [];

        for (let si = 0; si < segments.length; si++) {
          if (used[si]) continue;
          used[si] = 1;

          const chain = [segments[si].p1, segments[si].p2];
          let headKey = segments[si].k1;
          let tailKey = segments[si].k2;

          // Extend tail
          let ext = true;
          while (ext) {
            ext = false;
            const oppKey = oppositeKey(
              (tailKey >> 18) & 0x3FFF,
              (tailKey >> 4) & 0x3FFF,
              tailKey & 0xF
            );
            const cands = endpointMap.get(oppKey);
            if (cands) {
              for (const ci of cands) {
                if (used[ci]) continue;
                used[ci] = 1;
                const seg = segments[ci];
                if (seg.k1 === oppKey) { chain.push(seg.p2); tailKey = seg.k2; }
                else { chain.push(seg.p1); tailKey = seg.k1; }
                ext = true; break;
              }
            }
          }

          // Extend head
          ext = true;
          while (ext) {
            ext = false;
            const oppKey = oppositeKey(
              (headKey >> 18) & 0x3FFF,
              (headKey >> 4) & 0x3FFF,
              headKey & 0xF
            );
            const cands = endpointMap.get(oppKey);
            if (cands) {
              for (const ci of cands) {
                if (used[ci]) continue;
                used[ci] = 1;
                const seg = segments[ci];
                if (seg.k2 === oppKey) { chain.unshift(seg.p1); headKey = seg.k1; }
                else { chain.unshift(seg.p2); headKey = seg.k2; }
                ext = true; break;
              }
            }
          }

          if (chain.length >= 2) chains.push(chain);
        }

        // --- Phase 3: Smooth chains ---
        for (const chain of chains) {
          if (chain.length < 2) continue;

          const smooth = chaikinSmooth(chain, 3);
          levelChains.push(smooth);
        }

        // Dark warm brown with enough contrast to stand out on all territory colors
        const a = level < 0.20 ? 0.22 : level < 0.40 ? 0.28 : level < 0.60 ? 0.35 : 0.42;
        const lw = level < 0.20 ? 1.2 : level < 0.40 ? 1.5 : level < 0.60 ? 1.8 : 2.2;
        contourCache.push({ chains: levelChains, color: `rgba(45,32,18,${a})`, lineWidth: lw });
      }
      this._contourCache = contourCache;
    }

    _drawContours(ctx) {
      if (!this._contourCache) this._buildContourCache();

      ctx.save();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (const level of this._contourCache) {
        ctx.strokeStyle = level.color;
        ctx.lineWidth = level.lineWidth;

        for (const smooth of level.chains) {
          ctx.beginPath();
          ctx.moveTo(smooth[0][0], smooth[0][1]);
          if (smooth.length === 2) {
            ctx.lineTo(smooth[1][0], smooth[1][1]);
          } else {
            for (let i = 1; i < smooth.length - 1; i++) {
              const mx = (smooth[i][0] + smooth[i + 1][0]) * 0.5;
              const my = (smooth[i][1] + smooth[i + 1][1]) * 0.5;
              ctx.quadraticCurveTo(smooth[i][0], smooth[i][1], mx, my);
            }
            const last = smooth[smooth.length - 1];
            ctx.lineTo(last[0], last[1]);
          }
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    /** No-op — texture lines removed in favour of contours only */
    _drawTextureLines(ctx) {}

    resize() {
      this.canvas.style.width = "100%"; this.canvas.style.height = "100%";
      this.render();
    }

    centerMap() {
      const dw = this.canvas.clientWidth, dh = this.canvas.clientHeight;
      this.zoom = Math.min(dw / this.grid.mapW, dh / this.grid.mapH) * 0.9;
      this.panX = (dw - this.grid.mapW * this.zoom) / 2;
      this.panY = (dh - this.grid.mapH * this.zoom) / 2;
      this.render();
    }
  }

  /* ================================================================
   *  MAP ENGINE
   * ================================================================ */

  class MapEngine {
    constructor(canvas, opts = {}) {
      this.opts = Object.assign({}, DEFAULTS, opts);
      this.canvas = canvas;
      this.grid = new MapGrid(this.opts.mapWidth, this.opts.mapHeight, this.opts.gridStep);
      this.territory = new TerritorySystem(this.grid, this.opts);
      this.borders = new BorderSystem(this.grid);
      this.roads = new RoadSystem(this.grid);
      this.continentGen = new ContinentGenerator(this.opts);
      this.renderer = null; // Created after generation
      this.pois = [];
      this._eventListeners = {};
      this._seed = 1;
      this._continentData = null;
    }

    /**
     * Generate smooth elevation for contour lines using layered noise + coast distance.
     * Produces values in [0, 1] for land cells only.
     */
    _generateElevation(seed) {
      const grid = this.grid;
      const cols = grid.cols, rows = grid.rows;
      const rng = mulberry32(seed + 54321);
      const noise = new ValueNoise(mulberry32(seed + 54321), 128);

      // Find max coastDist for normalisation
      let maxCD = 1;
      for (let i = 0; i < grid.size; i++) {
        if (grid.land[i] && grid.coastDist[i] > maxCD) maxCD = grid.coastDist[i];
      }

      // --- Base elevation: coast distance + very low-freq noise ---
      for (let idx = 0; idx < grid.size; idx++) {
        if (!grid.land[idx]) { grid.elevation[idx] = -1; continue; }
        const col = grid.col(idx), row = grid.row(idx);
        const nx = col / cols, ny = row / rows;
        const cd = Math.min(grid.coastDist[idx] / maxCD, 1.0);
        const coastPow = Math.pow(cd, 0.5);
        const broad = (noise.fbm(nx * 1.2, ny * 1.2, 2, 2.0, 0.5) + 1) * 0.5;
        grid.elevation[idx] = coastPow * 0.50 + broad * 0.20;
      }

      // --- Land extent for feature placement ---
      let landMinC = cols, landMaxC = 0, landMinR = rows, landMaxR = 0;
      let landSumC = 0, landSumR = 0, landCount = 0;
      for (let i = 0; i < grid.size; i++) {
        if (!grid.land[i]) continue;
        const c = grid.col(i), r = grid.row(i);
        if (c < landMinC) landMinC = c;
        if (c > landMaxC) landMaxC = c;
        if (r < landMinR) landMinR = r;
        if (r > landMaxR) landMaxR = r;
        landSumC += c; landSumR += r; landCount++;
      }
      const landW = landMaxC - landMinC, landH = landMaxR - landMinR;
      const landCX = landSumC / landCount, landCY = landSumR / landCount;

      // --- Mountain ranges: multi-segment curving spines ---
      const numRanges = 2 + ((rng() * 3) | 0);
      for (let ri = 0; ri < numRanges; ri++) {
        // Start point biased toward interior
        const sx = landMinC + landW * (0.20 + rng() * 0.60);
        const sy = landMinR + landH * (0.20 + rng() * 0.60);

        // Build a curving spine with 4-7 waypoints
        const numWaypoints = 4 + ((rng() * 4) | 0);
        const baseAngle = rng() * Math.PI * 2;
        const segLen = landW * (0.06 + rng() * 0.08);
        const spine = [{ x: sx, y: sy }];

        let curAngle = baseAngle;
        for (let wi = 1; wi < numWaypoints; wi++) {
          curAngle += (rng() - 0.5) * 0.8; // gentle curve
          const prev = spine[wi - 1];
          spine.push({
            x: prev.x + Math.cos(curAngle) * segLen,
            y: prev.y + Math.sin(curAngle) * segLen,
          });
        }

        const rangeWidth = landW * (0.04 + rng() * 0.05);
        const peakHeight = 0.30 + rng() * 0.35;

        // For each land cell, find distance to nearest spine segment
        for (let idx = 0; idx < grid.size; idx++) {
          if (!grid.land[idx]) continue;
          const c = grid.col(idx), r = grid.row(idx);

          let minDist = Infinity;
          let bestT = 0; // parameter along the full spine for noise variation
          for (let si = 0; si < spine.length - 1; si++) {
            const ax = spine[si].x, ay = spine[si].y;
            const bx = spine[si + 1].x, by = spine[si + 1].y;
            const dx = bx - ax, dy = by - ay;
            const lenSq = dx * dx + dy * dy;
            let t = lenSq > 0 ? ((c - ax) * dx + (r - ay) * dy) / lenSq : 0;
            t = clamp(t, 0, 1);
            const px = ax + dx * t, py = ay + dy * t;
            const dist = Math.sqrt((c - px) * (c - px) + (r - py) * (r - py));
            if (dist < minDist) {
              minDist = dist;
              bestT = (si + t) / (spine.length - 1);
            }
          }

          if (minDist < rangeWidth) {
            const falloff = 1.0 - (minDist / rangeWidth);
            const smooth = falloff * falloff * (3 - 2 * falloff);
            // Variation along spine — peaks and saddles
            const ridgeVar = (noise.fbm(bestT * 4 + ri * 13.7, ri * 5.1, 2, 2.0, 0.5) + 1) * 0.5;
            grid.elevation[idx] += smooth * peakHeight * (0.5 + ridgeVar * 0.5);
          }
        }
      }

      // --- Isolated peaks (2-4) ---
      const numPeaks = 2 + ((rng() * 3) | 0);
      for (let pi = 0; pi < numPeaks; pi++) {
        const px = landMinC + landW * (0.15 + rng() * 0.70);
        const py = landMinR + landH * (0.15 + rng() * 0.70);
        const peakRadius = landW * (0.04 + rng() * 0.06);
        const peakH = 0.25 + rng() * 0.30;

        for (let idx = 0; idx < grid.size; idx++) {
          if (!grid.land[idx]) continue;
          const c = grid.col(idx), r = grid.row(idx);
          const dist = Math.sqrt((c - px) * (c - px) + (r - py) * (r - py));
          if (dist < peakRadius) {
            const f = 1.0 - dist / peakRadius;
            grid.elevation[idx] += f * f * (3 - 2 * f) * peakH;
          }
        }
      }

      // --- Broad valleys / lowlands for contrast ---
      const numValleys = 1 + ((rng() * 3) | 0);
      for (let vi = 0; vi < numValleys; vi++) {
        const vx = landMinC + landW * (0.15 + rng() * 0.70);
        const vy = landMinR + landH * (0.15 + rng() * 0.70);
        const vRadius = landW * (0.08 + rng() * 0.12);
        const vDepth = 0.12 + rng() * 0.18;

        for (let idx = 0; idx < grid.size; idx++) {
          if (!grid.land[idx]) continue;
          const c = grid.col(idx), r = grid.row(idx);
          const dist = Math.sqrt((c - vx) * (c - vx) + (r - vy) * (r - vy));
          if (dist < vRadius) {
            const f = 1.0 - dist / vRadius;
            grid.elevation[idx] -= f * f * (3 - 2 * f) * vDepth;
          }
        }
      }

      // --- Normalise to [0, 1] ---
      let rawMin = Infinity, rawMax = -Infinity;
      for (let i = 0; i < grid.size; i++) {
        if (!grid.land[i]) continue;
        if (grid.elevation[i] < rawMin) rawMin = grid.elevation[i];
        if (grid.elevation[i] > rawMax) rawMax = grid.elevation[i];
      }
      const range = rawMax - rawMin || 1;
      for (let i = 0; i < grid.size; i++) {
        if (!grid.land[i]) { grid.elevation[i] = 0; continue; }
        grid.elevation[i] = clamp((grid.elevation[i] - rawMin) / range, 0, 1);
      }

      // --- Heavy blur for ultra-smooth contours (7 passes, radius 5) ---
      const tmp = new Float32Array(grid.size);
      for (let pass = 0; pass < 7; pass++) {
        const rad = 5;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = grid.idx(c, r);
            if (!grid.land[idx]) { tmp[idx] = 0; continue; }
            let sum = 0, cnt = 0;
            for (let dc = -rad; dc <= rad; dc++) {
              const nc = c + dc;
              if (nc < 0 || nc >= cols) continue;
              const ni = grid.idx(nc, r);
              if (!grid.land[ni]) continue;
              sum += grid.elevation[ni]; cnt++;
            }
            tmp[idx] = cnt > 0 ? sum / cnt : grid.elevation[idx];
          }
        }
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const idx = grid.idx(c, r);
            if (!grid.land[idx]) { grid.elevation[idx] = 0; continue; }
            let sum = 0, cnt = 0;
            for (let dr = -rad; dr <= rad; dr++) {
              const nr = r + dr;
              if (nr < 0 || nr >= rows) continue;
              const ni = grid.idx(c, nr);
              if (!grid.land[ni]) continue;
              sum += tmp[ni]; cnt++;
            }
            grid.elevation[idx] = cnt > 0 ? sum / cnt : tmp[idx];
          }
        }
      }

      // --- Final re-normalise ---
      rawMin = Infinity; rawMax = -Infinity;
      for (let i = 0; i < grid.size; i++) {
        if (!grid.land[i]) continue;
        if (grid.elevation[i] < rawMin) rawMin = grid.elevation[i];
        if (grid.elevation[i] > rawMax) rawMax = grid.elevation[i];
      }
      const range2 = rawMax - rawMin || 1;
      for (let i = 0; i < grid.size; i++) {
        if (!grid.land[i]) { grid.elevation[i] = 0; continue; }
        grid.elevation[i] = clamp((grid.elevation[i] - rawMin) / range2, 0, 1);
      }
    }

    /**
     * Generate Points of Interest scattered across the world.
     * Places 25-35 unique POIs on land, avoiding cities and each other.
     */
    _generatePOIs(seed) {
      const rng = mulberry32(seed + 31415);
      const grid = this.grid;
      const regions = this.territory.regions;

      // Collect all city positions for avoidance
      const cityPts = [];
      for (const reg of regions) {
        for (const c of reg.cities) cityPts.push({ x: c.x, y: c.y });
      }

      // Build weighted type pool for minor POIs
      const typePool = [];
      for (const pt of POI_TYPES) {
        for (let w = 0; w < pt.weight; w++) typePool.push(pt);
      }

      // Build major type pool (always-major types + canBeMajor regulars)
      const majorPool = [...MAJOR_POI_TYPES];

      const numMajorPOIs = 3 + ((rng() * 4) | 0); // 3-6 major POIs
      const numPOIs = 30 + ((rng() * 16) | 0); // 30-45 minor POIs
      const pois = [];
      const minPOIDist = grid.step * 12;  // spacing between POIs
      const minMajorDist = grid.step * 20; // major POIs spread further apart
      const minCityDist = grid.step * 6;  // spacing from cities
      const landCells = [];
      for (let i = 0; i < grid.size; i++) {
        if (grid.land[i] && grid.coastDist[i] >= 2) landCells.push(i);
      }

      // Shipwrecks go on coastal cells instead
      const coastCells = [];
      for (let i = 0; i < grid.size; i++) {
        if (grid.land[i] && grid.coastDist[i] <= 2 && grid.coastDist[i] >= 1) coastCells.push(i);
      }

      // ---- Place MAJOR POIs first (continent-scale landmarks) ----
      for (let mi = 0; mi < numMajorPOIs && mi < 10; mi++) {
        const poiType = majorPool[(rng() * majorPool.length) | 0];
        if (landCells.length === 0) continue;

        let bestIdx = -1, bestMinDist = -1;
        for (let attempt = 0; attempt < 120; attempt++) {
          const ci = landCells[(rng() * landCells.length) | 0];
          const cx = grid.cx(ci), cy = grid.cy(ci);

          let tooClose = false;
          for (const cp of cityPts) {
            if (distPt(cx, cy, cp.x, cp.y) < minCityDist * 1.5) { tooClose = true; break; }
          }
          if (tooClose) continue;

          let minD = Infinity;
          for (const existing of pois) {
            const d = distPt(cx, cy, existing.x, existing.y);
            if (d < minMajorDist) { minD = -1; break; }
            minD = Math.min(minD, d);
          }
          if (minD < 0) continue;

          if (minD > bestMinDist) { bestMinDist = minD; bestIdx = ci; }
          if (bestMinDist > minMajorDist * 2) break;
        }

        if (bestIdx < 0) continue;

        const px = grid.cx(bestIdx), py = grid.cy(bestIdx);
        const regionId = grid.owner[bestIdx];
        const factionId = grid.faction[bestIdx];

        const prefixes = poiType.prefixes || [];
        const suffixes = poiType.suffixes || [];
        const hooks = poiType.hooks || [];
        if (prefixes.length === 0 || suffixes.length === 0 || hooks.length === 0) continue;

        const prefix = prefixes[(rng() * prefixes.length) | 0];
        const suffix = suffixes[(rng() * suffixes.length) | 0];
        const name = `The ${prefix} ${suffix}`;

        const hook = hooks[(rng() * hooks.length) | 0];
        const danger = clamp(3 + ((rng() * 3) | 0), 3, 5); // major POIs are always dangerous (3-5)

        const elev = grid.elevation[bestIdx];
        const terrain = elev > 0.7 ? "high mountain" : elev > 0.45 ? "hills" : elev > 0.2 ? "lowlands" : "coastal flatlands";
        const regionName = regionId >= 0 && regions[regionId] ? regions[regionId].name : "unclaimed wilds";

        const descriptions = [
          `${name} — a legendary ${poiType.label.toLowerCase()} that dominates the ${terrain} of ${regionName}. Its influence is felt across the entire continent.`,
          `Visible for miles around, ${name} is a ${poiType.label.toLowerCase()} of immense power in the ${terrain} of ${regionName}. Wars have been fought over its control.`,
          `${name} looms over the ${terrain} of ${regionName}. Even the bravest adventurers speak of it in hushed tones.`,
          `A continent-defining landmark, ${name} in the ${terrain} of ${regionName} has shaped the course of history for millennia.`,
        ];
        const description = descriptions[(rng() * descriptions.length) | 0];

        pois.push({
          id: pois.length,
          type: poiType.type,
          icon: poiType.icon,
          label: poiType.label,
          name, description, hook, danger,
          x: px, y: py,
          regionId, factionId,
          discovered: true,
          major: true, // continent-scale landmark
        });
      }

      // ---- Then also promote some regular POIs to major ----
      // (canBeMajor types have a 25% chance of being elevated during normal generation)

      // ---- Place MINOR POIs ----
      for (let pi = 0; pi < numPOIs && pi < 60; pi++) {
        const poiType = typePool[(rng() * typePool.length) | 0];
        const isMajorCandidate = poiType.canBeMajor && rng() < 0.25;
        const isCoastal = poiType.type === "shipwreck";
        const pool = isCoastal ? coastCells : landCells;
        if (pool.length === 0) continue;

        // Try to find a valid position
        let bestIdx = -1, bestMinDist = -1;
        for (let attempt = 0; attempt < 100; attempt++) {
          const ci = pool[(rng() * pool.length) | 0];
          const cx = grid.cx(ci), cy = grid.cy(ci);

          // Check distance from cities
          let tooClose = false;
          for (const cp of cityPts) {
            if (distPt(cx, cy, cp.x, cp.y) < minCityDist) { tooClose = true; break; }
          }
          if (tooClose) continue;

          // Check distance from other POIs
          let minD = Infinity;
          for (const existing of pois) {
            const d = distPt(cx, cy, existing.x, existing.y);
            if (d < minPOIDist) { minD = -1; break; }
            minD = Math.min(minD, d);
          }
          if (minD < 0) continue;

          if (minD > bestMinDist) { bestMinDist = minD; bestIdx = ci; }
          if (bestMinDist > minPOIDist * 2) break; // good enough
        }

        if (bestIdx < 0) continue;

        const px = grid.cx(bestIdx), py = grid.cy(bestIdx);
        const regionId = grid.owner[bestIdx];
        const factionId = grid.faction[bestIdx];

        // Generate name — promoted POIs get "The" prefix for gravitas
        const prefixes = poiType.prefixes || [];
        const suffixes = poiType.suffixes || [];
        const hooks = poiType.hooks || [];
        if (prefixes.length === 0 || suffixes.length === 0 || hooks.length === 0) continue;

        const prefix = prefixes[(rng() * prefixes.length) | 0];
        const suffix = suffixes[(rng() * suffixes.length) | 0];
        const name = isMajorCandidate ? `The ${prefix} ${suffix}` : `${prefix} ${suffix}`;

        // Pick a quest hook
        const hook = hooks[(rng() * hooks.length) | 0];

        // Generate danger level — promoted majors are more dangerous
        const danger = isMajorCandidate
          ? clamp(3 + ((rng() * 3) | 0), 3, 5)
          : clamp(1 + ((rng() * 3 + rng() * 3) | 0) / 2, 1, 5);

        // Elevation-based flavour
        const elev = grid.elevation[bestIdx];
        const terrain = elev > 0.7 ? "high mountain" : elev > 0.45 ? "hills" : elev > 0.2 ? "lowlands" : "coastal flatlands";

        // Build description
        const regionName = regionId >= 0 && regions[regionId] ? regions[regionId].name : "unclaimed wilds";
        const descriptions = isMajorCandidate ? [
          `${name} — a legendary ${poiType.label.toLowerCase()} that looms over the ${terrain} of ${regionName}. Its reputation spans the continent.`,
          `${name}, a legendary ${poiType.label.toLowerCase()}, dominates the ${terrain} of ${regionName}. Kingdoms have risen and fallen in its shadow.`,
          `${name} stands as a monument to a forgotten age, its presence in the ${terrain} of ${regionName} shaping the fate of all who dwell nearby.`,
        ] : [
          `${name} — a ${poiType.label.toLowerCase()} nestled in the ${terrain} of ${regionName}.`,
          `Deep in the ${terrain}, the ${name} has drawn explorers and fortune-seekers for generations.`,
          `The ${name} stands amid the ${terrain} of ${regionName}, half-hidden from the unwary traveller.`,
          `Known to locals as the ${name}, this ${poiType.label.toLowerCase()} in the ${terrain} of ${regionName} holds many secrets.`,
        ];
        const description = descriptions[(rng() * descriptions.length) | 0];

        pois.push({
          id: pois.length,
          type: poiType.type,
          icon: poiType.icon,
          label: poiType.label,
          name, description, hook, danger,
          x: px, y: py,
          regionId, factionId,
          discovered: true,
          major: isMajorCandidate, // promoted regular POIs become major
        });
      }

      this.pois = pois;
    }

    /* ================================================================
     *  _computeCityContext(city) — derive spatial and relational context
     *  for a city so we can pick coherent flavor text.
     * ================================================================ */
    _computeCityContext(city) {
      const grid = this.grid;
      const ci = city.cellIdx >= 0 ? city.cellIdx : grid.cellAt(city.x, city.y);
      const elev = ci >= 0 ? grid.elevation[ci] : 0.3;
      const coastDist = ci >= 0 ? grid.coastDist[ci] : 10;

      // --- Terrain ---
      const terrain = elev > 0.65 ? "mountain" : elev > 0.4 ? "highland" : "lowland";

      // --- Coast ---
      const coast = coastDist <= 3 ? "coastal" : coastDist <= 7 ? "near" : "interior";

      // --- Compass (relative to continent centroid — cached) ---
      if (!this._landCentroid) {
        let cx = 0, cy = 0, cnt = 0;
        for (let i = 0; i < grid.size; i++) {
          if (grid.land[i]) { cx += grid.cx(i); cy += grid.cy(i); cnt++; }
        }
        this._landCentroid = cnt > 0 ? { x: cx / cnt, y: cy / cnt } : { x: grid.mapW / 2, y: grid.mapH / 2 };
      }
      const centX = this._landCentroid.x, centY = this._landCentroid.y;
      const dx = city.x - centX, dy = city.y - centY;
      const angle = Math.atan2(dy, dx); // -PI..PI, 0=east
      // Map angle to compass quadrant (north = up = -y)
      let compass;
      if (angle < -Math.PI * 0.625 || angle > Math.PI * 0.625) compass = "west";
      else if (angle < -Math.PI * 0.125) compass = "north";
      else if (angle < Math.PI * 0.125) compass = "east";
      else if (angle < Math.PI * 0.625) compass = "south";
      else compass = "west";
      // If very close to center, mark as central
      const distFromCenter = Math.sqrt(dx * dx + dy * dy);
      const mapDiag = Math.sqrt(grid.mapW * grid.mapW + grid.mapH * grid.mapH);
      if (distFromCenter < mapDiag * 0.12) compass = "central";

      // --- Border: is this city near a different faction? ---
      const myFaction = ci >= 0 ? grid.faction[ci] : -1;
      let border = false;
      if (ci >= 0) {
        const col = grid.col(ci), row = grid.row(ci);
        const checkR = 5; // check within 5 cells
        outer: for (let dr = -checkR; dr <= checkR; dr++) {
          for (let dc = -checkR; dc <= checkR; dc++) {
            const nc = col + dc, nr = row + dr;
            if (nc < 0 || nc >= grid.cols || nr < 0 || nr >= grid.rows) continue;
            const ni = grid.idx(nc, nr);
            if (grid.land[ni] && grid.faction[ni] >= 0 && grid.faction[ni] !== myFaction) {
              border = true; break outer;
            }
          }
        }
      }

      // --- Nearby POIs ---
      const nearbyPOIs = [];
      if (this.pois) {
        for (const poi of this.pois) {
          const d = distPt(city.x, city.y, poi.x, poi.y);
          if (d < grid.step * 25) nearbyPOIs.push({ poi, dist: d });
        }
        nearbyPOIs.sort((a, b) => a.dist - b.dist);
      }

      // --- Nearby cities (in same region or neighboring) ---
      const nearbyCities = [];
      for (const reg of this.territory.regions) {
        for (const c of reg.cities) {
          if (c === city) continue;
          const d = distPt(city.x, city.y, c.x, c.y);
          if (d < grid.step * 20) nearbyCities.push({ city: c, dist: d, sameRegion: reg.id === city.regionId });
        }
      }
      nearbyCities.sort((a, b) => a.dist - b.dist);

      // --- Faction info ---
      const region = city.regionId >= 0 ? this.territory.regions[city.regionId] : null;
      const faction = region ? this.territory.factions[region.factionId] : null;

      // --- Neighboring factions ---
      const neighborFactions = [];
      if (border && faction) {
        const seen = new Set();
        const col = grid.col(ci), row = grid.row(ci);
        const scanR = 8;
        for (let dr = -scanR; dr <= scanR; dr++) {
          for (let dc = -scanR; dc <= scanR; dc++) {
            const nc = col + dc, nr = row + dr;
            if (nc < 0 || nc >= grid.cols || nr < 0 || nr >= grid.rows) continue;
            const ni = grid.idx(nc, nr);
            const fid = grid.faction[ni];
            if (grid.land[ni] && fid >= 0 && fid !== region.factionId && !seen.has(fid)) {
              seen.add(fid);
              neighborFactions.push(this.territory.factions[fid]);
            }
          }
        }
      }

      return { terrain, coast, compass, border, elev, coastDist,
               nearbyPOIs, nearbyCities, region, faction, neighborFactions };
    }

    /* ================================================================
     *  _pickFlavor(pool, ctx, rng) — pick a random entry from a tagged
     *  pool that matches the given spatial context. Falls back to
     *  universal entries (empty req) if nothing specific matches.
     * ================================================================ */
    _pickFlavor(pool, ctx, rng) {
      const matches = (req) => {
        if (req.compass && req.compass !== "any" && ctx.compass !== req.compass) return false;
        if (req.terrain && req.terrain !== "any" && ctx.terrain !== req.terrain) return false;
        if (req.coast && req.coast !== "any" && ctx.coast !== req.coast) return false;
        if (req.border === true && !ctx.border) return false;
        if (req.border === false && ctx.border) return false;
        return true;
      };

      // First try: entries with at least one specific condition that matches
      const specific = pool.filter(e => {
        const r = e.req || {};
        const hasCondition = r.compass || r.terrain || r.coast || r.border !== undefined;
        return hasCondition && matches(r);
      });

      // Fall back to universal entries
      const universal = pool.filter(e => {
        const r = e.req || {};
        return !r.compass && !r.terrain && !r.coast && r.border === undefined;
      });

      // 60% chance to pick specific if available, otherwise universal
      const useSpecific = specific.length > 0 && rng() < 0.6;
      const candidates = useSpecific ? specific : (universal.length > 0 ? universal : pool);
      if (candidates.length === 0) return null;
      return candidates[(rng() * candidates.length) | 0];
    }

    /* ================================================================
     *  _assignWorldFlavor(seed) — post-generation pass that assigns
     *  all city flavor (trait, trade, hook, npc) using full world
     *  context including spatial position, nearby POIs, neighboring
     *  factions, and sibling cities. Also enriches POI descriptions
     *  with references to nearby settlements and factions.
     * ================================================================ */
    _assignWorldFlavor(seed) {
      const rng = mulberry32(seed + 5555);
      const grid = this.grid;
      const regions = this.territory.regions;
      const factions = this.territory.factions;

      // Shuffle NPCs for unique assignment
      const npcPool = shuffle(CITY_NPCS.slice(), rng);
      let npcIdx = 0;

      // --- Assign city flavor ---
      for (const region of regions) {
        for (const city of region.cities) {
          const ctx = this._computeCityContext(city);

          // Pick trait, trade, hook from spatially-filtered pools
          const traitEntry = this._pickFlavor(CITY_TRAITS, ctx, rng);
          const tradeEntry = this._pickFlavor(CITY_TRADES, ctx, rng);
          const hookEntry  = this._pickFlavor(CITY_HOOKS, ctx, rng);

          city.trait = traitEntry ? traitEntry.text : "a modest settlement";
          city.trade = tradeEntry ? tradeEntry.text : "general goods";
          city.hook  = hookEntry  ? hookEntry.text  : "All seems quiet — for now.";

          // Unique NPC
          city.npc = npcPool[npcIdx++ % npcPool.length];

          // Atmosphere — sensory detail for the popup
          const atmosEntry = this._pickFlavor(CITY_ATMOSPHERE, ctx, rng);
          city.atmosphere = atmosEntry ? atmosEntry.text : null;

          // --- Enrich hook with nearby references ---
          // If near a border, inject the rival faction name
          if (ctx.border && ctx.neighborFactions.length > 0) {
            const rival = ctx.neighborFactions[(rng() * ctx.neighborFactions.length) | 0];
            if (rival && city.hook.includes("rival faction")) {
              city.hook = city.hook.replace("rival faction", rival.name);
            }
            if (rival && city.hook.includes("enemy forces")) {
              city.hook = city.hook.replace("enemy forces", `${rival.name} forces`);
            }
          }

          // If near a POI, sometimes reference it in the hook
          if (ctx.nearbyPOIs.length > 0 && rng() < 0.4) {
            const nearest = ctx.nearbyPOIs[0].poi;
            const poiRef = ` Locals whisper it may be connected to ${nearest.name}.`;
            city.hook += poiRef;
          }

          // Store context for the popup to use
          city._ctx = {
            compass: ctx.compass,
            terrain: ctx.terrain,
            coast: ctx.coast,
            border: ctx.border,
          };
        }
      }

      // --- Enrich POI descriptions with nearby city/faction references ---
      if (this.pois) {
        for (const poi of this.pois) {
          const ci = grid.cellAt(poi.x, poi.y);
          const factionId = ci >= 0 ? grid.faction[ci] : -1;
          const faction = factionId >= 0 ? factions[factionId] : null;

          // Find nearest city
          let nearestCity = null, nearestDist = Infinity;
          for (const reg of regions) {
            for (const c of reg.cities) {
              const d = distPt(poi.x, poi.y, c.x, c.y);
              if (d < nearestDist) { nearestDist = d; nearestCity = c; }
            }
          }

          // Enrich description with faction and city context (if not already mentioned)
          if (faction && !poi.description.includes(faction.name) && !poi.description.includes("territory")) {
            poi.description = poi.description.replace(
              /of ([^.]+)\./,
              (_, regionName) => `of ${regionName}, within ${faction.name} territory.`
            );
          }

          // Enrich hook with nearby city reference
          if (nearestCity && nearestDist < grid.step * 20 && rng() < 0.5) {
            poi.hook += ` The people of ${nearestCity.name} know more.`;
          }

          // For major POIs, add cross-faction lore
          if (poi.major && faction) {
            // Find a different faction that might contest this POI
            const otherFactions = factions.filter(f => f && f !== faction);
            if (otherFactions.length > 0) {
              const rival = otherFactions[(rng() * otherFactions.length) | 0];
              if (rng() < 0.5) {
                poi.hook += ` ${faction.name} and ${rival.name} both claim dominion over this site.`;
              }
            }
          }
        }
      }
    }

    generate(seed) {
      this._seed = seed || 1;

      // Reset grid and cached data
      this.grid.land.fill(0);
      this.grid.owner.fill(-1);
      this.grid.faction.fill(-1);
      this.grid.elevation.fill(0);
      this._landCentroid = null;

      // Generate continent shapes
      this._continentData = this.continentGen.generate(this._seed);

      // Stamp onto grid
      this.grid.stampLand(this._continentData.mainland);
      for (const ext of this._continentData.extras) this.grid.stampLand(ext);
      for (const isl of this._continentData.islands) this.grid.stampLand(isl);

      // Compute coast distance (used for city placement)
      this.grid.computeCoastDistance();

      // Generate elevation for topographic contour lines
      this._generateElevation(this._seed);

      // Generate territories and factions
      this.territory.generateRegions(this._seed);
      this.territory.generateFactions(this._seed);

      // Build road network between all cities
      const allCities = [];
      for (const r of this.territory.regions) allCities.push(...r.cities);
      this.roads.build(allCities, mulberry32(this._seed + 7777));

      // Generate Points of Interest
      this._generatePOIs(this._seed);

      // Post-generation flavor pass — assign city traits/trades/hooks and
      // enrich POI descriptions with full world context (nearby POIs,
      // neighboring factions, spatial position, etc.)
      this._assignWorldFlavor(this._seed);

      // Destroy old renderer (removes stale event listeners) and create new one
      if (this.renderer) this.renderer.destroy();
      this.renderer = new MapRenderer(this.canvas, this.grid, this.territory, this.borders, this.roads, this.opts, this._continentData, this.pois);
      if (this._pendingClickCb) this.renderer.onRegionClick = this._pendingClickCb;
      if (this._pendingHoverCb) this.renderer.onRegionHover = this._pendingHoverCb;
      if (this._pendingPOIClickCb) this.renderer.onPOIClick = this._pendingPOIClickCb;
      if (this._pendingCityClickCb) this.renderer.onCityClick = this._pendingCityClickCb;
      this.renderer.centerMap();
      this._emit("generate", { seed: this._seed });
    }

    render() { if (this.renderer) this.renderer.render(); }
    centerMap() { if (this.renderer) this.renderer.centerMap(); }

    conquer(factionId, regionId) {
      const ok = this.territory.conquer(factionId, regionId);
      if (ok && this.renderer) {
        this.renderer.invalidate(); this.renderer.render();
        this._emit("conquer", { factionId, regionId, faction: this.territory.factions[factionId], region: this.territory.regions[regionId] });
      }
      return ok;
    }

    secede(regionId, name, color) {
      const nf = this.territory.secede(regionId, name, color);
      if (nf && this.renderer) {
        this.renderer.invalidate(); this.renderer.render();
        this._emit("secede", { regionId, newFaction: nf, region: this.territory.regions[regionId] });
      }
      return nf;
    }

    alliance(absorberId, absorbedId) {
      const ok = this.territory.alliance(absorberId, absorbedId);
      if (ok && this.renderer) {
        this.renderer.invalidate(); this.renderer.render();
        this._emit("alliance", { absorberId, absorbedId, absorber: this.territory.factions[absorberId] });
      }
      return ok;
    }

    getRegions() { return this.territory.regions; }
    getFactions() { return this.territory.factions; }
    getRegionAt(x, y) { return this.territory.getRegionAt(x, y); }
    getFactionAt(x, y) { return this.territory.getFactionAt(x, y); }
    getSeed() { return this._seed; }

    getPOIs() { return this.pois || []; }
    getPOIAt(x, y, radius) {
      const r = radius || 20;
      for (const poi of (this.pois || [])) {
        const dx = x - poi.x, dy = y - poi.y;
        if (dx * dx + dy * dy < r * r) return poi;
      }
      return null;
    }

    onRegionClick(fn) { if (this.renderer) this.renderer.onRegionClick = fn; this._pendingClickCb = fn; }
    onRegionHover(fn) { if (this.renderer) this.renderer.onRegionHover = fn; this._pendingHoverCb = fn; }
    onPOIClick(fn) { if (this.renderer) this.renderer.onPOIClick = fn; this._pendingPOIClickCb = fn; }
    onCityClick(fn) { if (this.renderer) this.renderer.onCityClick = fn; this._pendingCityClickCb = fn; }

    on(event, fn) { if (!this._eventListeners[event]) this._eventListeners[event] = []; this._eventListeners[event].push(fn); }
    off(event, fn) { const l = this._eventListeners[event]; if (l) { const i = l.indexOf(fn); if (i >= 0) l.splice(i, 1); } }
    _emit(event, data) { (this._eventListeners[event] || []).forEach(fn => fn(data)); }
  }

  /* Export */
  global.MapEngine = MapEngine;
  global.MapEngine._internals = { MapGrid, TerritorySystem, BorderSystem, RoadSystem, MapRenderer, ContinentGenerator, ValueNoise, FACTION_PALETTE, DEFAULTS };

})(typeof window !== "undefined" ? window : this);
