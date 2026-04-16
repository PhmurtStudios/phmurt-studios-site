/* ═══════════════════════════════════════════════════════════════════
   PHMURT CREATOR — Encounter
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';
  var KEY = 'phmurt_homebrew_encounters';
  var U = global.PhmurtCreatorUtil || {};
  var ENVS = ['Dungeon','Forest','Urban','Coastal','Desert','Mountain','Underground','Swamp','Sky','Arctic','Grassland','Planar','Other'];
  var DIFFS = ['Easy','Medium','Hard','Deadly'];

  // Encounter XP thresholds per character per difficulty (DMG p.82)
  var XP_THRESHOLDS = {
    1:{Easy:25,Medium:50,Hard:75,Deadly:100},
    2:{Easy:50,Medium:100,Hard:150,Deadly:200},
    3:{Easy:75,Medium:150,Hard:225,Deadly:400},
    4:{Easy:125,Medium:250,Hard:375,Deadly:500},
    5:{Easy:250,Medium:500,Hard:750,Deadly:1100},
    6:{Easy:300,Medium:600,Hard:900,Deadly:1400},
    7:{Easy:350,Medium:750,Hard:1100,Deadly:1700},
    8:{Easy:450,Medium:900,Hard:1400,Deadly:2100},
    9:{Easy:550,Medium:1100,Hard:1600,Deadly:2400},
    10:{Easy:600,Medium:1200,Hard:1900,Deadly:2800},
    11:{Easy:800,Medium:1600,Hard:2400,Deadly:3600},
    12:{Easy:1000,Medium:2000,Hard:3000,Deadly:4500},
    13:{Easy:1100,Medium:2200,Hard:3400,Deadly:5100},
    14:{Easy:1250,Medium:2500,Hard:3800,Deadly:5700},
    15:{Easy:1400,Medium:2800,Hard:4300,Deadly:6400},
    16:{Easy:1600,Medium:3200,Hard:4800,Deadly:7200},
    17:{Easy:2000,Medium:3900,Hard:5900,Deadly:8800},
    18:{Easy:2100,Medium:4200,Hard:6300,Deadly:9500},
    19:{Easy:2400,Medium:4900,Hard:7300,Deadly:10900},
    20:{Easy:2800,Medium:5700,Hard:8500,Deadly:12700}
  };
  // Multiplier based on number of monsters (DMG p.82)
  function encounterMultiplier(n) {
    if (n <= 1) return 1;
    if (n === 2) return 1.5;
    if (n <= 6) return 2;
    if (n <= 10) return 2.5;
    if (n <= 14) return 3;
    return 4;
  }

  function defaultEncounter() {
    return {
      type:'encounter', clientId:null,
      name:'New Encounter', environment:'Dungeon', difficulty:'Medium',
      partyLevelMin:1, partyLevelMax:20, partySize:4,
      setup:'', monsters:[],
      terrain:[], tactics:'', treasure:'', alternatives:'',
      campaignId:null, isPublic:false
    };
  }

  var state = { current:null, editId:null };

  function loadAll(){ try { return JSON.parse(localStorage.getItem(KEY)||'[]')||[]; } catch(e){ return []; } }
  function saveAll(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
  function generateClientId(){ return 'enc_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,6); }

  function getSupabase(){ return global.phmurtSupabase || null; }
  function currentUserId(){
    try { var s = global.PhmurtDB && global.PhmurtDB.getSession && global.PhmurtDB.getSession(); return s && s.user && s.user.id || null; }
    catch(e){ return null; }
  }
  var cloudSync = (U.debounce ? U.debounce(doCloudSync, 700) : function(){ setTimeout(doCloudSync, 700); });
  function doCloudSync() {
    var sb = getSupabase(); var uid = currentUserId();
    if (!sb || !uid || !state.current || !state.current.clientId) return;
    setSyncState('syncing');
    state.current._authorName = U.getAuthorName ? U.getAuthorName() : 'Anonymous';
    sb.from('homebrew_content').upsert({
      user_id: uid, type: 'encounter', client_id: state.current.clientId,
      data: state.current, slug: U.slugify ? U.slugify(state.current.name) : state.current.name,
      is_public: !!state.current.isPublic
    }, { onConflict: 'user_id,type,client_id' }).then(function(r){ setSyncState(r.error?'err':'ok'); }, function(){ setSyncState('err'); });
  }
  function setSyncState(k){
    var el = document.querySelector('#creator-root .cr-sync-indicator'); if(!el) return;
    el.className = 'cr-sync-indicator ' + k;
    el.textContent = k === 'ok' ? '✓ Synced' : k === 'syncing' ? 'Syncing…' : k === 'err' ? '✕ Sync error' : '';
  }

  var CR_OPTS = ['0','1/8','1/4','1/2','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'];

  /* ── SRD 5.1 Monster Database ──────────────────────────────────── */
  var SRD_MONSTERS = [
    {n:"Aboleth",cr:"10"},{n:"Acolyte",cr:"1/4"},{n:"Adult Black Dragon",cr:"14"},{n:"Adult Blue Dragon",cr:"16"},
    {n:"Adult Brass Dragon",cr:"13"},{n:"Adult Bronze Dragon",cr:"15"},{n:"Adult Copper Dragon",cr:"14"},
    {n:"Adult Gold Dragon",cr:"17"},{n:"Adult Green Dragon",cr:"15"},{n:"Adult Red Dragon",cr:"17"},
    {n:"Adult Silver Dragon",cr:"16"},{n:"Adult White Dragon",cr:"13"},{n:"Air Elemental",cr:"5"},
    {n:"Ancient Black Dragon",cr:"21"},{n:"Ancient Blue Dragon",cr:"23"},{n:"Ancient Brass Dragon",cr:"20"},
    {n:"Ancient Bronze Dragon",cr:"22"},{n:"Ancient Copper Dragon",cr:"21"},{n:"Ancient Gold Dragon",cr:"24"},
    {n:"Ancient Green Dragon",cr:"22"},{n:"Ancient Red Dragon",cr:"24"},{n:"Ancient Silver Dragon",cr:"23"},
    {n:"Ancient White Dragon",cr:"20"},{n:"Androsphinx",cr:"17"},{n:"Animated Armor",cr:"1"},
    {n:"Ankheg",cr:"2"},{n:"Ape",cr:"1/2"},{n:"Archmage",cr:"12"},{n:"Assassin",cr:"8"},
    {n:"Awakened Shrub",cr:"0"},{n:"Awakened Tree",cr:"2"},{n:"Axe Beak",cr:"1/4"},{n:"Azer",cr:"2"},
    {n:"Baboon",cr:"0"},{n:"Badger",cr:"0"},{n:"Balor",cr:"19"},{n:"Bandit",cr:"1/8"},
    {n:"Bandit Captain",cr:"2"},{n:"Barbed Devil",cr:"5"},{n:"Basilisk",cr:"3"},{n:"Bat",cr:"0"},
    {n:"Bearded Devil",cr:"3"},{n:"Behir",cr:"11"},{n:"Berserker",cr:"2"},{n:"Black Bear",cr:"1/2"},
    {n:"Black Dragon Wyrmling",cr:"2"},{n:"Black Pudding",cr:"4"},{n:"Blink Dog",cr:"1/4"},
    {n:"Blood Hawk",cr:"1/8"},{n:"Blue Dragon Wyrmling",cr:"3"},{n:"Boar",cr:"1/4"},
    {n:"Bone Devil",cr:"9"},{n:"Brass Dragon Wyrmling",cr:"1"},{n:"Bronze Dragon Wyrmling",cr:"2"},
    {n:"Brown Bear",cr:"1"},{n:"Bugbear",cr:"1"},{n:"Bulette",cr:"5"},{n:"Camel",cr:"1/8"},
    {n:"Cat",cr:"0"},{n:"Centaur",cr:"2"},{n:"Chain Devil",cr:"8"},{n:"Chimera",cr:"6"},
    {n:"Chuul",cr:"4"},{n:"Clay Golem",cr:"9"},{n:"Cloaker",cr:"8"},{n:"Cloud Giant",cr:"9"},
    {n:"Cockatrice",cr:"1/2"},{n:"Commoner",cr:"0"},{n:"Constrictor Snake",cr:"1/4"},
    {n:"Copper Dragon Wyrmling",cr:"1"},{n:"Couatl",cr:"4"},{n:"Crab",cr:"0"},
    {n:"Crocodile",cr:"1/2"},{n:"Cultist",cr:"1/8"},{n:"Cult Fanatic",cr:"2"},
    {n:"Darkmantle",cr:"1/2"},{n:"Death Dog",cr:"1"},{n:"Deer",cr:"0"},{n:"Deva",cr:"10"},
    {n:"Dire Wolf",cr:"1"},{n:"Djinni",cr:"11"},{n:"Doppelganger",cr:"3"},
    {n:"Draft Horse",cr:"1/4"},{n:"Dretch",cr:"1/4"},{n:"Drider",cr:"6"},{n:"Druid",cr:"2"},
    {n:"Dryad",cr:"1"},{n:"Duergar",cr:"1"},{n:"Dust Mephit",cr:"1/2"},{n:"Eagle",cr:"0"},
    {n:"Earth Elemental",cr:"5"},{n:"Efreeti",cr:"11"},{n:"Elephant",cr:"4"},
    {n:"Elf (Drow)",cr:"1/4"},{n:"Elk",cr:"1/4"},{n:"Erinyes",cr:"12"},{n:"Ettercap",cr:"2"},
    {n:"Ettin",cr:"4"},{n:"Fire Elemental",cr:"5"},{n:"Fire Giant",cr:"9"},
    {n:"Flesh Golem",cr:"5"},{n:"Flying Snake",cr:"1/8"},{n:"Flying Sword",cr:"1/4"},
    {n:"Frog",cr:"0"},{n:"Frost Giant",cr:"8"},{n:"Gargoyle",cr:"2"},{n:"Gelatinous Cube",cr:"2"},
    {n:"Ghast",cr:"2"},{n:"Ghost",cr:"4"},{n:"Ghoul",cr:"1"},{n:"Giant Ape",cr:"7"},
    {n:"Giant Badger",cr:"1/4"},{n:"Giant Bat",cr:"1/4"},{n:"Giant Boar",cr:"2"},
    {n:"Giant Centipede",cr:"1/4"},{n:"Giant Constrictor Snake",cr:"2"},{n:"Giant Crab",cr:"1/8"},
    {n:"Giant Crocodile",cr:"5"},{n:"Giant Eagle",cr:"1"},{n:"Giant Elk",cr:"2"},
    {n:"Giant Fire Beetle",cr:"0"},{n:"Giant Frog",cr:"1/4"},{n:"Giant Goat",cr:"1/2"},
    {n:"Giant Hyena",cr:"1"},{n:"Giant Lizard",cr:"1/4"},{n:"Giant Octopus",cr:"1"},
    {n:"Giant Owl",cr:"1/4"},{n:"Giant Poisonous Snake",cr:"1/4"},{n:"Giant Rat",cr:"1/8"},
    {n:"Giant Scorpion",cr:"3"},{n:"Giant Sea Horse",cr:"1/2"},{n:"Giant Shark",cr:"5"},
    {n:"Giant Spider",cr:"1"},{n:"Giant Toad",cr:"1"},{n:"Giant Vulture",cr:"1"},
    {n:"Giant Wasp",cr:"1/2"},{n:"Giant Weasel",cr:"1/8"},{n:"Giant Wolf Spider",cr:"1/4"},
    {n:"Gibbering Mouther",cr:"2"},{n:"Glabrezu",cr:"9"},{n:"Gladiator",cr:"5"},
    {n:"Gnoll",cr:"1/2"},{n:"Gnome (Deep/Svirfneblin)",cr:"1/2"},{n:"Goat",cr:"0"},
    {n:"Goblin",cr:"1/4"},{n:"Gold Dragon Wyrmling",cr:"3"},{n:"Gorgon",cr:"5"},
    {n:"Gray Ooze",cr:"1/2"},{n:"Green Dragon Wyrmling",cr:"2"},{n:"Green Hag",cr:"3"},
    {n:"Grick",cr:"2"},{n:"Griffon",cr:"2"},{n:"Grimlock",cr:"1/4"},
    {n:"Guardian Naga",cr:"10"},{n:"Guard",cr:"1/8"},{n:"Gynosphinx",cr:"11"},
    {n:"Half-Red Dragon Veteran",cr:"5"},{n:"Harpy",cr:"1"},{n:"Hawk",cr:"0"},
    {n:"Hell Hound",cr:"3"},{n:"Hezrou",cr:"8"},{n:"Hill Giant",cr:"5"},
    {n:"Hippogriff",cr:"1"},{n:"Hobgoblin",cr:"1/2"},{n:"Homunculus",cr:"0"},
    {n:"Horned Devil",cr:"11"},{n:"Hunter Shark",cr:"2"},{n:"Hydra",cr:"8"},
    {n:"Hyena",cr:"0"},{n:"Ice Devil",cr:"14"},{n:"Ice Mephit",cr:"1/2"},
    {n:"Imp",cr:"1"},{n:"Invisible Stalker",cr:"6"},{n:"Iron Golem",cr:"16"},
    {n:"Jackal",cr:"0"},{n:"Killer Whale",cr:"3"},{n:"Knight",cr:"3"},
    {n:"Kobold",cr:"1/8"},{n:"Kraken",cr:"23"},{n:"Lamia",cr:"4"},{n:"Lemure",cr:"0"},
    {n:"Lich",cr:"21"},{n:"Lion",cr:"1"},{n:"Lizard",cr:"0"},{n:"Lizardfolk",cr:"1/2"},
    {n:"Mage",cr:"6"},{n:"Magma Mephit",cr:"1/2"},{n:"Magmin",cr:"1/2"},
    {n:"Mammoth",cr:"6"},{n:"Manticore",cr:"3"},{n:"Marilith",cr:"16"},
    {n:"Mastiff",cr:"1/8"},{n:"Medusa",cr:"6"},{n:"Merfolk",cr:"1/8"},
    {n:"Merrow",cr:"2"},{n:"Mimic",cr:"2"},{n:"Minotaur",cr:"3"},
    {n:"Minotaur Skeleton",cr:"2"},{n:"Mule",cr:"1/8"},{n:"Mummy",cr:"3"},
    {n:"Mummy Lord",cr:"15"},{n:"Nalfeshnee",cr:"13"},{n:"Night Hag",cr:"5"},
    {n:"Nightmare",cr:"3"},{n:"Noble",cr:"1/8"},{n:"Nothic",cr:"2"},
    {n:"Ochre Jelly",cr:"2"},{n:"Octopus",cr:"0"},{n:"Ogre",cr:"2"},
    {n:"Ogre Zombie",cr:"2"},{n:"Oni",cr:"7"},{n:"Orc",cr:"1/2"},
    {n:"Otyugh",cr:"5"},{n:"Owlbear",cr:"3"},{n:"Owl",cr:"0"},
    {n:"Panther",cr:"1/4"},{n:"Pegasus",cr:"2"},{n:"Phase Spider",cr:"3"},
    {n:"Pit Fiend",cr:"20"},{n:"Planetar",cr:"16"},{n:"Plesiosaurus",cr:"2"},
    {n:"Poisonous Snake",cr:"1/8"},{n:"Polar Bear",cr:"2"},{n:"Pony",cr:"1/8"},
    {n:"Priest",cr:"2"},{n:"Pseudodragon",cr:"1/4"},{n:"Pteranodon",cr:"1/4"},
    {n:"Purple Worm",cr:"15"},{n:"Quasit",cr:"1"},{n:"Quipper",cr:"0"},
    {n:"Rakshasa",cr:"13"},{n:"Rat",cr:"0"},{n:"Raven",cr:"0"},
    {n:"Red Dragon Wyrmling",cr:"4"},{n:"Reef Shark",cr:"1/2"},
    {n:"Remorhaz",cr:"11"},{n:"Revenant",cr:"5"},{n:"Rhinoceros",cr:"2"},
    {n:"Riding Horse",cr:"1/4"},{n:"Roc",cr:"11"},{n:"Roper",cr:"5"},
    {n:"Rug of Smothering",cr:"2"},{n:"Rust Monster",cr:"1/2"},
    {n:"Saber-Toothed Tiger",cr:"2"},{n:"Sahuagin",cr:"1/2"},
    {n:"Salamander",cr:"5"},{n:"Satyr",cr:"1/2"},{n:"Scorpion",cr:"0"},
    {n:"Scout",cr:"1/2"},{n:"Sea Hag",cr:"2"},{n:"Sea Horse",cr:"0"},
    {n:"Shadow",cr:"1/2"},{n:"Shambling Mound",cr:"5"},{n:"Shield Guardian",cr:"7"},
    {n:"Shrieker",cr:"0"},{n:"Silver Dragon Wyrmling",cr:"2"},{n:"Skeleton",cr:"1/4"},
    {n:"Solar",cr:"21"},{n:"Specter",cr:"1"},{n:"Spider",cr:"0"},
    {n:"Spirit Naga",cr:"8"},{n:"Sprite",cr:"1/4"},{n:"Spy",cr:"1"},
    {n:"Steam Mephit",cr:"1/4"},{n:"Stirge",cr:"1/8"},{n:"Stone Giant",cr:"7"},
    {n:"Stone Golem",cr:"10"},{n:"Storm Giant",cr:"13"},
    {n:"Succubus/Incubus",cr:"4"},{n:"Swarm of Bats",cr:"1/4"},
    {n:"Swarm of Insects",cr:"1/2"},{n:"Swarm of Poisonous Snakes",cr:"2"},
    {n:"Swarm of Quippers",cr:"1"},{n:"Swarm of Ravens",cr:"1/4"},
    {n:"Swarm of Rats",cr:"1/4"},{n:"Tarrasque",cr:"30"},{n:"Thug",cr:"1/2"},
    {n:"Tiger",cr:"1"},{n:"Treant",cr:"9"},{n:"Triceratops",cr:"5"},
    {n:"Tribal Warrior",cr:"1/8"},{n:"Troll",cr:"5"},{n:"Tyrannosaurus Rex",cr:"8"},
    {n:"Unicorn",cr:"5"},{n:"Vampire",cr:"13"},{n:"Vampire Spawn",cr:"5"},
    {n:"Veteran",cr:"3"},{n:"Violet Fungus",cr:"1/4"},{n:"Vrock",cr:"6"},
    {n:"Vulture",cr:"0"},{n:"Warhorse",cr:"1/2"},{n:"Warhorse Skeleton",cr:"1/2"},
    {n:"Water Elemental",cr:"5"},{n:"Weasel",cr:"0"},{n:"Werebear",cr:"5"},
    {n:"Wereboar",cr:"4"},{n:"Wererat",cr:"2"},{n:"Weretiger",cr:"4"},
    {n:"Werewolf",cr:"3"},{n:"White Dragon Wyrmling",cr:"2"},{n:"Wight",cr:"3"},
    {n:"Will-o'-Wisp",cr:"2"},{n:"Winter Wolf",cr:"3"},{n:"Wolf",cr:"1/4"},
    {n:"Worg",cr:"1/2"},{n:"Wraith",cr:"5"},{n:"Wyvern",cr:"6"},{n:"Xorn",cr:"5"},
    {n:"Young Black Dragon",cr:"7"},{n:"Young Blue Dragon",cr:"9"},
    {n:"Young Brass Dragon",cr:"6"},{n:"Young Bronze Dragon",cr:"8"},
    {n:"Young Copper Dragon",cr:"7"},{n:"Young Gold Dragon",cr:"10"},
    {n:"Young Green Dragon",cr:"8"},{n:"Young Red Dragon",cr:"10"},
    {n:"Young Silver Dragon",cr:"9"},{n:"Young White Dragon",cr:"6"},
    {n:"Zombie",cr:"1/4"}
  ];

  /* Build combined monster list: SRD + homebrew */
  function getMonsterList() {
    var list = SRD_MONSTERS.map(function(m){ return { name: m.n, cr: m.cr, source: 'SRD' }; });
    // Add homebrew monsters
    try {
      var hb = JSON.parse(localStorage.getItem('phmurt_homebrew_monsters') || '[]');
      if (Array.isArray(hb)) {
        hb.forEach(function(m) {
          if (m && m.name) {
            list.push({ name: m.name, cr: m.cr || m.challengeRating || '0', source: 'Homebrew' });
          }
        });
      }
    } catch(e) {}
    // Also check the old _homebrewEntities format
    try {
      var old = global._homebrewEntities;
      if (old && old.monsters && Array.isArray(old.monsters)) {
        old.monsters.forEach(function(m) {
          if (m && m.name && !list.some(function(x){ return x.name === m.name && x.source === 'Homebrew'; })) {
            list.push({ name: m.name, cr: m.cr || m.challengeRating || '0', source: 'Homebrew' });
          }
        });
      }
    } catch(e) {}
    return list;
  }

  /* Monster lookup by name → cr */
  function findMonsterCR(name) {
    if (!name) return null;
    var lower = name.toLowerCase().trim();
    var list = getMonsterList();
    for (var i = 0; i < list.length; i++) {
      if (list[i].name.toLowerCase() === lower) return list[i].cr;
    }
    return null;
  }

  function escAttr(s){ return (s==null?'':String(s)).replace(/"/g,'&quot;'); }
  function esc(s){ return U.escapeHtml ? U.escapeHtml(s) : String(s==null?'':s); }
  function selectEl(key, opts, cur, labels){
    labels = labels||{};
    return '<select data-k="'+key+'">'+opts.map(function(o){
      return '<option value="'+escAttr(o)+'"'+(String(cur)===String(o)?' selected':'')+'>'+esc(labels[o]!=null?labels[o]:o)+'</option>';
    }).join('')+'</select>';
  }

  // ── Difficulty calculator ─────────────────────────────────────────
  function computeBudget(s) {
    var lv = Math.max(1, Math.min(20, Math.round(((s.partyLevelMin||1) + (s.partyLevelMax||1)) / 2)));
    var thr = XP_THRESHOLDS[lv] || XP_THRESHOLDS[1];
    var partySize = Math.max(1, s.partySize || 4);
    return {
      level: lv,
      thresholds: {
        Easy: thr.Easy * partySize,
        Medium: thr.Medium * partySize,
        Hard: thr.Hard * partySize,
        Deadly: thr.Deadly * partySize
      }
    };
  }
  function computeEncounterXP(s) {
    var monsters = s.monsters || [];
    var totalCount = 0;
    var rawXp = 0;
    monsters.forEach(function(m){
      var c = parseInt(m.count, 10) || 0;
      var xp = U.crToXp ? (U.crToXp(m.cr) || 0) : 0;
      totalCount += c;
      rawXp += c * xp;
    });
    var mult = encounterMultiplier(totalCount);
    return { totalMonsters: totalCount, rawXp: rawXp, adjustedXp: Math.round(rawXp * mult), multiplier: mult };
  }
  function difficultyLabel(adjusted, budget) {
    var t = budget.thresholds;
    if (adjusted >= t.Deadly) return 'Deadly';
    if (adjusted >= t.Hard)   return 'Hard';
    if (adjusted >= t.Medium) return 'Medium';
    if (adjusted >= t.Easy)   return 'Easy';
    return 'Trivial';
  }

  function render() {
    var s = state.current; if (!s) return;
    var root = document.getElementById('creator-root'); if (!root) return;

    var budget = computeBudget(s);
    var encXp = computeEncounterXP(s);
    var computedDiff = difficultyLabel(encXp.adjustedXp, budget);

    /* ── Added enemies (compact roster) ──────────────────────────── */
    var rosterHtml = '';
    if (s.monsters && s.monsters.length && s.monsters.some(function(m){return m.name;})) {
      rosterHtml = '<div class="cr-roster">' +
        (s.monsters||[]).map(function(m, i){
          if (!m.name) return '';
          var xp = U.crToXp ? (U.crToXp(m.cr) || 0) : 0;
          return '<div class="cr-roster-row">' +
            '<span class="cr-roster-name">' + esc(m.name) + ' <span class="cr-roster-cr">CR ' + esc(m.cr) + '</span></span>' +
            '<div class="cr-roster-controls">' +
              '<button type="button" class="cr-roster-btn" data-act="dec-monster" data-idx="'+i+'">−</button>' +
              '<span class="cr-roster-count">' + (m.count||1) + '</span>' +
              '<button type="button" class="cr-roster-btn" data-act="inc-monster" data-idx="'+i+'">+</button>' +
              '<span class="cr-roster-xp">' + ((m.count||1) * xp) + ' XP</span>' +
              '<button type="button" class="cr-roster-btn cr-roster-remove" data-act="remove-monster" data-idx="'+i+'" title="Remove">✕</button>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>';
    }

    /* ── Monster picker (search + filter + scrollable list) ─────── */
    var pickerHtml =
      '<div class="cr-picker">' +
        '<div class="cr-picker-bar">' +
          '<input type="text" id="cr-mp-search" placeholder="Search monsters…" autocomplete="off" />' +
          '<select id="cr-mp-cr">' +
            '<option value="">All CRs</option>' +
            CR_OPTS.map(function(c){ return '<option value="'+c+'">CR '+c+'</option>'; }).join('') +
          '</select>' +
          '<select id="cr-mp-src">' +
            '<option value="">All</option><option value="SRD">SRD</option><option value="Homebrew">Homebrew</option>' +
          '</select>' +
        '</div>' +
        '<div class="cr-picker-count" id="cr-mp-count"></div>' +
        '<div class="cr-picker-list" id="cr-mp-list"></div>' +
      '</div>';

    var terrainHtml = (s.terrain||[]).map(function(t, i){
      return '<div class="cr-trait-row" >' +
        '<input type="text" data-list="terrain" data-idx="'+i+'" data-field="name" value="'+escAttr(t.name)+'" placeholder="Feature name (e.g., Lava Pit)" style="margin-bottom:6px;" />' +
        '<textarea data-list="terrain" data-idx="'+i+'" data-field="desc" rows="2" placeholder="Difficulty, damage, mechanics...">'+esc(t.desc)+'</textarea>' +
        '<button type="button" class="cr-btn" data-act="remove-terrain" data-idx="'+i+'" style="margin-top:6px;">Remove</button>' +
      '</div>';
    }).join('');

    root.innerHTML =
      '<div class="cr-topbar">' +
        '<button class="cr-back" type="button" data-act="close">◂ Back</button>' +
        '<div class="cr-title">' +
          '<div class="cr-eyebrow">Homebrew · Encounter</div>' +
          '<div class="cr-heading">' + esc(s.name||'New Encounter') + '</div>' +
        '</div>' +
        '<div class="cr-sync-indicator">—</div>' +
        '<div class="cr-actions">' +
          '<button class="cr-btn" data-act="export">Export PNG</button>' +
          (state.editId ? '<button class="cr-btn danger" data-act="delete">Delete</button>' : '') +
          '<button class="cr-btn primary" data-act="save">Save</button>' +
        '</div>' +
      '</div>' +

      '<div class="cr-split">' +
        '<div class="cr-form-pane">' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Identity</div>' +
            '<div class="cr-grid cr-grid-2">' +
              '<div class="cr-field wide"><label>Name <span class="req">*</span></label><input type="text" data-k="name" value="'+escAttr(s.name)+'" placeholder="e.g. Bandits on the Road" /></div>' +
              '<div class="cr-field"><label>Environment</label>' + selectEl('environment', ENVS, s.environment) + '</div>' +
              '<div class="cr-field"><label>Intended Difficulty</label>' + selectEl('difficulty', DIFFS, s.difficulty) + '</div>' +
            '</div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Party <span class="hint">XP budget auto-calculates</span></div>' +
            '<div class="cr-grid cr-grid-3">' +
              '<div class="cr-field"><label>Level Min</label><input type="number" data-k="partyLevelMin" value="'+s.partyLevelMin+'" min="1" max="20" /></div>' +
              '<div class="cr-field"><label>Level Max</label><input type="number" data-k="partyLevelMax" value="'+s.partyLevelMax+'" min="1" max="20" /></div>' +
              '<div class="cr-field"><label>Party Size</label><input type="number" data-k="partySize" value="'+s.partySize+'" min="1" max="10" /></div>' +
            '</div>' +
            '<div class="cr-autocalc">Budget @ avg party level ' + budget.level + ': Easy ' + budget.thresholds.Easy + ' · Medium ' + budget.thresholds.Medium + ' · Hard ' + budget.thresholds.Hard + ' · Deadly ' + budget.thresholds.Deadly + ' XP</div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Setup <span class="hint">the scene</span></div>' +
            '<div class="cr-field"><textarea data-k="setup" rows="3" placeholder="Describe the location, initial conditions, what the party sees...">'+esc(s.setup)+'</textarea></div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Enemies <span class="hint">search &amp; click to add</span></div>' +
            rosterHtml +
            '<div class="cr-autocalc" style="margin-bottom:10px;">' +
              'Total: ' + encXp.totalMonsters + ' monster(s) · raw ' + encXp.rawXp + ' XP × ' + encXp.multiplier + ' = <strong>' + encXp.adjustedXp + ' adj XP</strong> → computed difficulty: <strong>' + computedDiff + '</strong>' +
            '</div>' +
            pickerHtml +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Terrain & Features</div>' +
            '<div>' + terrainHtml + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-terrain" style="margin-top:8px;">+ Add Terrain Feature</button>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Tactics / DM Notes</div>' +
            '<div class="cr-field"><textarea data-k="tactics" rows="3" placeholder="How enemies behave, morale, fleeing conditions...">'+esc(s.tactics)+'</textarea></div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Treasure / Rewards</div>' +
            '<div class="cr-field"><textarea data-k="treasure" rows="3" placeholder="Loot, items, gold, XP, etc...">'+esc(s.treasure)+'</textarea></div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Alternative Resolutions <span class="hint">non-combat paths</span></div>' +
            '<div class="cr-field"><textarea data-k="alternatives" rows="2" placeholder="Diplomacy, escape, trickery, bribe...">'+esc(s.alternatives)+'</textarea></div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Publishing & Sharing</div>' +
            '<div class="cr-field"><label>Add to Campaign</label>' +
              '<select data-k="campaignId"><option value="">— Not attached —</option></select>' +
            '</div>' +
            '<div class="cr-field"><label class="cr-toggle"><input type="checkbox" data-k="isPublic"'+(s.isPublic?' checked':'')+' /> Make public in the community library</label></div>' +
          '</div>' +

        '</div>' +

        '<div class="cr-preview-pane">' +
          '<h2>Live Preview</h2>' +
          renderEncounterCard(s, encXp, budget, computedDiff) +
        '</div>' +
      '</div>';

    populateCampaignDropdown(s);
    wireMonsterPicker(root);
    setSyncState('');
  }

  function renderEncounterCard(s, encXp, budget, computedDiff) {
    var monsters = (s.monsters||[]).filter(function(m){return m.name;});
    var terrain = (s.terrain||[]).filter(function(t){return t.name || t.desc;});
    return '<div class="cr-spellcard">' +
      '<img src="logo.png" alt="Phmurt" class="cr-sc-brand" />' +
      '<div class="cr-sc-name">' + esc(s.name) + '</div>' +
      '<div class="cr-sc-meta">' + esc(s.environment) + ' · Levels ' + s.partyLevelMin + '–' + s.partyLevelMax + ' · Party of ' + s.partySize + '</div>' +
      '<div class="cr-sc-row"><strong>Intended</strong> ' + esc(s.difficulty) + '</div>' +
      '<div class="cr-sc-row"><strong>Computed</strong> ' + esc(computedDiff) + ' (' + encXp.adjustedXp + ' adj XP)</div>' +
      (s.setup ? '<div class="cr-sc-body">' + (U.renderMarkdown ? U.renderMarkdown(s.setup) : esc(s.setup)) + '</div>' : '') +
      (monsters.length ?
        '<div class="cr-sc-higher"><strong>Enemies</strong>' +
          '<ul style="margin:6px 0 0 22px;padding:0;">' + monsters.map(function(m){
            var xp = U.crToXp ? (U.crToXp(m.cr) || 0) : 0;
            return '<li>' + (m.count||1) + '× ' + esc(m.name) + ' (CR ' + esc(m.cr) + ', ' + xp + ' XP)' + (m.notes ? ' — <em>' + esc(m.notes) + '</em>' : '') + '</li>';
          }).join('') + '</ul>' +
        '</div>' : '') +
      (terrain.length ?
        '<div class="cr-sc-higher"><strong>Terrain</strong>' +
          terrain.map(function(t){return '<div style="margin-top:6px;"><strong><em>' + esc(t.name||'Feature') + '.</em></strong> ' + esc(t.desc||'') + '</div>';}).join('') +
        '</div>' : '') +
      (s.tactics ? '<div class="cr-sc-higher"><strong>Tactics</strong>' + (U.renderMarkdown?U.renderMarkdown(s.tactics):esc(s.tactics)) + '</div>' : '') +
      (s.treasure ? '<div class="cr-sc-higher"><strong>Treasure</strong>' + (U.renderMarkdown?U.renderMarkdown(s.treasure):esc(s.treasure)) + '</div>' : '') +
      (s.alternatives ? '<div class="cr-sc-higher"><strong>Alternatives</strong>' + (U.renderMarkdown?U.renderMarkdown(s.alternatives):esc(s.alternatives)) + '</div>' : '') +
    '</div>';
  }

  /* ── Monster picker — populates the scrollable list ──────────── */
  var _mpSearchVal = '';
  var _mpCrVal = '';
  var _mpSrcVal = '';

  function wireMonsterPicker(root) {
    var searchInp = root.querySelector('#cr-mp-search');
    var crSel = root.querySelector('#cr-mp-cr');
    var srcSel = root.querySelector('#cr-mp-src');
    var listEl = root.querySelector('#cr-mp-list');
    var countEl = root.querySelector('#cr-mp-count');
    if (!searchInp || !listEl) return;

    // Restore filter state across re-renders
    searchInp.value = _mpSearchVal;
    if (crSel) crSel.value = _mpCrVal;
    if (srcSel) srcSel.value = _mpSrcVal;

    var allMonsters = getMonsterList();

    function renderPickerList() {
      _mpSearchVal = (searchInp.value || '').trim();
      _mpCrVal = crSel ? crSel.value : '';
      _mpSrcVal = srcSel ? srcSel.value : '';
      var q = _mpSearchVal.toLowerCase();
      var filtered = allMonsters.filter(function(m) {
        if (q && m.name.toLowerCase().indexOf(q) === -1) return false;
        if (_mpCrVal && m.cr !== _mpCrVal) return false;
        if (_mpSrcVal && m.source !== _mpSrcVal) return false;
        return true;
      });
      countEl.textContent = filtered.length + ' monster' + (filtered.length !== 1 ? 's' : '');
      if (!filtered.length) { listEl.innerHTML = '<div style="color:var(--text-muted);padding:16px;text-align:center;">No matches</div>'; return; }
      listEl.innerHTML = filtered.map(function(m) {
        var xp = U.crToXp ? (U.crToXp(m.cr) || 0) : 0;
        return '<div class="cr-mp-row" data-mp-name="'+escAttr(m.name)+'" data-mp-cr="'+escAttr(m.cr)+'">' +
          '<span class="cr-mp-name">' + esc(m.name) + '</span>' +
          '<span class="cr-mp-meta">CR ' + esc(m.cr) + ' · ' + xp + ' XP' + (m.source === 'Homebrew' ? ' · <em>HB</em>' : '') + '</span>' +
        '</div>';
      }).join('');
    }
    renderPickerList();

    searchInp.addEventListener('input', renderPickerList);
    if (crSel) crSel.addEventListener('change', renderPickerList);
    if (srcSel) srcSel.addEventListener('change', renderPickerList);

    listEl.addEventListener('click', function(e) {
      var row = e.target.closest('.cr-mp-row');
      if (!row) return;
      addMonsterFromPicker(row.getAttribute('data-mp-name'), row.getAttribute('data-mp-cr'));
    });
  }

  function addMonsterFromPicker(name, cr) {
    if (!state.current) return;
    // Check if this monster is already in the roster — if so, increment count
    var existing = null;
    (state.current.monsters||[]).forEach(function(m, i) {
      if (m.name === name && m.cr === cr) existing = i;
    });
    if (existing !== null) {
      state.current.monsters[existing].count = (state.current.monsters[existing].count || 1) + 1;
    } else {
      // Remove empty placeholder rows first
      state.current.monsters = (state.current.monsters||[]).filter(function(m){ return m.name; });
      state.current.monsters.push({ name: name, count: 1, cr: cr, notes: '' });
    }
    render(); cloudSync();
  }

  function wireEvents() {
    var root = document.getElementById('creator-root'); if (!root || root._wired) return;
    root._wired = true;
    root.addEventListener('input', onChange);
    root.addEventListener('change', onChange);
    root.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
  }
  function onChange(e) {
    var t = e.target; if (!t) return;
    // Skip monster picker inputs — they have their own handlers
    if (t.id === 'cr-mp-search' || t.id === 'cr-mp-cr' || t.id === 'cr-mp-src') return;
    var k = t.getAttribute('data-k'); var list = t.getAttribute('data-list');
    if (k) {
      if (t.type === 'checkbox') state.current[k] = t.checked;
      else if (t.type === 'number') state.current[k] = parseInt(t.value,10) || 0;
      else state.current[k] = t.value;
    } else if (list && t.hasAttribute('data-idx') && t.hasAttribute('data-field')) {
      var idx = parseInt(t.getAttribute('data-idx'),10);
      var field = t.getAttribute('data-field');
      if (!state.current[list][idx]) state.current[list][idx] = {};
      state.current[list][idx][field] = (t.type==='number') ? (parseInt(t.value,10)||0) : t.value;
    }
    render(); cloudSync();
  }
  function onClick(e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var a = t.getAttribute('data-act');
    if (a === 'close') return close();
    if (a === 'save') return save();
    if (a === 'delete') return del();
    if (a === 'export') return exportPng();
    if (a === 'remove-monster') { var mi = parseInt(t.getAttribute('data-idx'),10); if (state.current.monsters && mi >= 0 && mi < state.current.monsters.length) { state.current.monsters.splice(mi,1); render(); cloudSync(); } return; }
    if (a === 'inc-monster') { var ii = parseInt(t.getAttribute('data-idx'),10); if (state.current.monsters && state.current.monsters[ii]) { state.current.monsters[ii].count = (state.current.monsters[ii].count||1) + 1; render(); cloudSync(); } return; }
    if (a === 'dec-monster') { var di = parseInt(t.getAttribute('data-idx'),10); if (state.current.monsters && state.current.monsters[di]) { var c = (state.current.monsters[di].count||1) - 1; if (c < 1) state.current.monsters.splice(di,1); else state.current.monsters[di].count = c; render(); cloudSync(); } return; }
    if (a === 'add-terrain') { state.current.terrain.push({name:'',desc:''}); render(); return; }
    if (a === 'remove-terrain') { var ti = parseInt(t.getAttribute('data-idx'),10); if (state.current.terrain && ti >= 0 && ti < state.current.terrain.length) state.current.terrain.splice(ti,1); render(); return; }
  }
  function onKeydown(e) {
    if (e.key !== 'Escape') return;
    var tag = (e.target.tagName||'').toLowerCase();
    if (['input','textarea','select'].indexOf(tag)!==-1) return;
    close();
  }

  function save() {
    if (!state.current.name || !state.current.name.trim()) { if (U.showToast) U.showToast('Error', 'Name is required'); else alert('Name is required'); return; }
    if (!state.current.clientId) state.current.clientId = generateClientId();
    var list = loadAll();
    state.current.id = state.current.id || state.current.clientId;
    var idx = list.findIndex(function(x){ return x.id === state.current.id; });
    if (idx >= 0) list[idx] = state.current; else list.push(state.current);
    saveAll(list);
    if (global._homebrewEncounters !== undefined) global._homebrewEncounters = list;
    if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
    cloudSync(); close();
  }
  function del() {
    var doDelete = function() {
      var list = loadAll().filter(function(x){ return x.id !== state.current.id; });
      saveAll(list);
      if (global._homebrewEncounters !== undefined) global._homebrewEncounters = list;
      if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
      close();
    };
    if (U.showConfirm) U.showConfirm('Delete this encounter? This cannot be undone.', doDelete);
    else if (confirm('Delete this encounter?')) doDelete();
  }
  function exportPng() {
    var card = document.querySelector('#creator-root .cr-spellcard');
    if (!card || typeof global.html2canvas !== 'function') { if (U.showToast) U.showToast('Error', 'PNG export not available.'); else alert('PNG export not available.'); return; }
    global.html2canvas(card, { backgroundColor: null, scale: 2 }).then(function(canvas){
      canvas.toBlob(function(blob){
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = (state.current.name||'encounter')+'.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function(){URL.revokeObjectURL(url);}, 1000);
      });
    });
  }
  function populateCampaignDropdown(s) {
    var sel = document.querySelector('#creator-root select[data-k="campaignId"]'); if (!sel) return;
    var campaigns = (global.phmurtCampaigns && global.phmurtCampaigns.list) || [];
    campaigns.forEach(function(c){
      var o = document.createElement('option'); o.value = c.id;
      o.textContent = c.name + (c.role === 'dm' ? ' (DM)' : ' (Player)');
      if (s.campaignId === c.id) o.selected = true;
      sel.appendChild(o);
    });
  }

  function openEncounter(editId) {
    var root = document.getElementById('creator-root'); if (!root) return;
    var list = loadAll();
    var existing = editId ? list.find(function(x){return x.id === editId;}) : null;
    state.current = existing ? Object.assign(defaultEncounter(), existing) : defaultEncounter();
    if (!state.current.monsters) state.current.monsters = [];
    if (!state.current.terrain) state.current.terrain = [];
    state.editId = editId || null;
    root.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    render(); wireEvents();
    try { history.replaceState({}, '', location.pathname + '?create=encounter' + (editId?'&id='+editId:'')); } catch(e){}
  }
  function close() {
    var root = document.getElementById('creator-root'); if (!root) return;
    root.setAttribute('hidden','');
    document.body.style.overflow = '';
    state.current = null; state.editId = null;
    try { var url = new URL(location.href); url.searchParams.delete('create'); url.searchParams.delete('id'); history.replaceState({},'',url.toString()); } catch(e){}
  }
  function maybeAutoOpen(){ try { var q = new URLSearchParams(location.search); if (q.get('create')==='encounter') openEncounter(q.get('id')||null); } catch(e){} }

  global.PhmurtEncounterCreator = { openEncounter: openEncounter, close: close };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeAutoOpen);
  else maybeAutoOpen();
})(window);
