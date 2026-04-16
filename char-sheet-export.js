// ══════════════════════════════════════════════════════════════
// D&D Character Sheet PDF Export
// Opens a print-optimized window styled as a traditional character sheet.
// Works for both 5e and 3.5e builders.
// ══════════════════════════════════════════════════════════════

(function(){
  'use strict';

  // ── 5e Export ──────────────────────────────────────────────
  window.exportCharSheet5e = function(){
    if(!C || !C.race || !C.cls) return alert('Build a character first before exporting.');

    var race = DND_DATA.races[C.race];
    var cls  = DND_DATA.classes[C.cls];
    var bg   = C.background ? DND_DATA.backgrounds[C.background] : null;
    var subrace = (race.subraces||[]).find(function(s){ return s.id === C.subrace; });
    var pb   = DND_DATA.profBonus[totalCharLevel()] || 2;
    var name = (C.details.name || 'Unnamed Adventurer');
    var speed = subrace && subrace.speed ? subrace.speed : (race.speed || 30);

    // Ability totals & mods
    var abs = ['str','dex','con','int','wis','cha'];
    var scores = {}, mods = {};
    abs.forEach(function(a){
      scores[a] = totalScore(a);
      mods[a] = Math.floor((scores[a] - 10) / 2);
    });

    // AC
    var ac = 10 + mods.dex;
    if((cls.armorProf||[]).some(function(a){return a.includes('All armor')||a.includes('Heavy');})) ac=16;
    else if((cls.armorProf||[]).some(function(a){return a.includes('Medium');})) ac=14+Math.min(mods.dex,2);
    else if((cls.armorProf||[]).some(function(a){return a.includes('Light');})) ac=11+mods.dex;
    if((cls.armorProf||[]).some(function(a){return a.includes('Shield');})) ac+=2;
    if(C.cls==='barbarian') ac=10+mods.dex+mods.con;
    if(C.cls==='monk') ac=10+mods.dex+mods.wis;

    // HP
    var maxHP = typeof calcMaxHP === 'function' ? calcMaxHP() : (cls.hitDie + mods.con);

    // Hit Dice
    var hitDice;
    if(typeof isMulticlass === 'function' && isMulticlass()){
      hitDice = C.classes.map(function(e){ var cd=DND_DATA.classes[e.cls]; return e.level+'d'+(cd?cd.hitDie:8); }).join(' + ');
    } else {
      hitDice = C.level + 'd' + cls.hitDie;
    }

    // Class string
    var classStr;
    if(typeof classString === 'function' && typeof isMulticlass === 'function' && isMulticlass()){
      classStr = classString();
    } else {
      var subclassLabel = '';
      if(C.subclass && DND_DATA.subclasses && DND_DATA.subclasses[C.cls]){
        var scD = DND_DATA.subclasses[C.cls].find(function(sc){return sc.id===C.subclass;});
        if(scD) subclassLabel = ' (' + scD.name + ')';
      }
      classStr = cls.name + subclassLabel + ' ' + C.level;
    }

    // Proficient skills
    var bgKeys = bg ? bg.skills.map(function(s){ return skKey(s); }) : [];
    var allProf = bgKeys.concat(C.selectedSkills);

    // Saves
    var savesHtml = abs.map(function(a){
      var isP = (cls.saves||[]).includes(a);
      var tot = mods[a] + (isP ? pb : 0);
      var sign = tot >= 0 ? '+' : '';
      return '<tr><td class="prof-dot">' + (isP ? '●' : '○') + '</td><td>' + sign + tot + '</td><td>' + abilName(a) + '</td></tr>';
    }).join('');

    // Skills
    var skillsHtml = '';
    if(DND_DATA.skills){
      var sKeys = Object.keys(DND_DATA.skills);
      sKeys.sort(function(a,b){ return DND_DATA.skills[a].name.localeCompare(DND_DATA.skills[b].name); });
      skillsHtml = sKeys.map(function(id){
        var sk = DND_DATA.skills[id];
        var key = skKey(sk.name);
        var isP = allProf.includes(key);
        var tot = mods[sk.ability] + (isP ? pb : 0);
        var sign = tot >= 0 ? '+' : '';
        return '<tr><td class="prof-dot">' + (isP ? '●' : '○') + '</td><td>' + sign + tot + '</td><td>' + _esc(sk.name) + ' <small>(' + sk.ability.toUpperCase() + ')</small></td></tr>';
      }).join('');
    }

    // Features
    var features = [];
    // Race traits
    if(race.traits) race.traits.forEach(function(t){ features.push({name:t.name||t, desc:t.desc||'', source:race.name}); });
    if(subrace && subrace.traits) subrace.traits.forEach(function(t){ features.push({name:t.name||t, desc:t.desc||'', source:subrace.name}); });
    // Class features
    (cls.features||[]).forEach(function(f){ features.push({name:f.name, desc:f.desc||'', source:cls.name+' 1'}); });
    // Level features
    if(typeof ensureClassesArray === 'function') ensureClassesArray();
    (C.classes||[]).forEach(function(entry){
      var cd = DND_DATA.classes[entry.cls];
      if(!cd) return;
      var lvlFeats = (DND_DATA.levelFeatures && DND_DATA.levelFeatures[entry.cls]) || {};
      for(var lv=2; lv<=entry.level; lv++){
        (lvlFeats[lv]||[]).forEach(function(f){ features.push({name:f.name, desc:f.desc||'', source:cd.name+' '+lv}); });
      }
    });
    // Subclass features
    if(C.subclass && DND_DATA.subclasses && DND_DATA.subclasses[C.cls]){
      var scData = DND_DATA.subclasses[C.cls].find(function(sc){return sc.id===C.subclass;});
      if(scData && scData.features){
        if(Array.isArray(scData.features)){
          scData.features.forEach(function(f){ if(f.level && f.level <= C.level) features.push({name:f.name, desc:f.desc||'', source:scData.name+' '+f.level}); });
        } else {
          Object.keys(scData.features).forEach(function(lv){ if(parseInt(lv) <= C.level) scData.features[lv].forEach(function(f){ features.push({name:f.name, desc:f.desc||'', source:scData.name+' '+lv}); }); });
        }
      }
    }

    var featuresHtml = features.map(function(f){
      return '<div class="feat-block"><div class="feat-name">' + _esc(f.name) + ' <small>(' + _esc(f.source) + ')</small></div>' +
        (f.desc ? '<div class="feat-desc">' + _esc(f.desc) + '</div>' : '') + '</div>';
    }).join('');

    // Equipment
    var equipHtml = '';
    if(typeof inventoryItems !== 'undefined' && inventoryItems.length){
      equipHtml = inventoryItems.map(function(it){
        return '<li>' + _esc(it.name) + (it.qty > 1 ? ' ×' + it.qty : '') + '</li>';
      }).join('');
    } else {
      // Fallback: parse from class equipment
      var fallback = [];
      (cls.equipment||[]).forEach(function(choice,ci){
        if(!Array.isArray(choice)||!choice.length) return;
        if(choice.length===1) fallback.push(choice[0]);
        else { var sel=C.equipChoices[ci]; if(sel!==undefined) fallback.push(choice[sel]); }
      });
      if(bg && bg.equipment) bg.equipment.split(',').forEach(function(i){ var t=i.trim(); if(t) fallback.push(t); });
      equipHtml = fallback.map(function(i){ return '<li>' + _esc(i) + '</li>'; }).join('');
    }

    // Spells
    var spellsHtml = '';
    var allSpells = (C.selectedCantrips||[]).concat(C.selectedSpells||[]);
    if(allSpells.length){
      var cantrips = C.selectedCantrips || [];
      var spells = C.selectedSpells || [];
      if(cantrips.length) spellsHtml += '<div class="spell-level">Cantrips</div><div class="spell-list">' + cantrips.map(function(s){return _esc(s);}).join(', ') + '</div>';
      if(spells.length) spellsHtml += '<div class="spell-level">Prepared Spells</div><div class="spell-list">' + spells.map(function(s){return _esc(s);}).join(', ') + '</div>';
    }

    // Proficiencies
    var profList = [];
    if(cls.armorProf && cls.armorProf.length) profList.push('<b>Armor:</b> ' + cls.armorProf.join(', '));
    if(cls.weaponProf && cls.weaponProf.length) profList.push('<b>Weapons:</b> ' + cls.weaponProf.join(', '));
    if(cls.toolProf && cls.toolProf.length) profList.push('<b>Tools:</b> ' + cls.toolProf.join(', '));
    if(race.languages && race.languages.length) profList.push('<b>Languages:</b> ' + race.languages.join(', '));
    var profHtml = profList.join('<br>');

    // Passive Perception
    var passivePerc = 10 + mods.wis + (allProf.includes('perception') ? pb : 0);

    // Details
    var alignment = C.details.alignment || '';
    var personality = C.details.personality || '';
    var ideals = C.details.ideals || '';
    var bonds = C.details.bonds || '';
    var flaws = C.details.flaws || '';
    var backstory = C.details.backstory || '';

    _openSheet({
      name: name,
      classStr: classStr,
      race: race.name + (subrace ? ' ('+subrace.name+')' : ''),
      background: bg ? bg.name : '',
      alignment: alignment,
      level: C.level,
      pb: pb,
      ac: ac,
      hp: maxHP,
      hitDice: hitDice,
      speed: speed,
      initiative: mods.dex,
      passivePerc: passivePerc,
      scores: scores,
      mods: mods,
      savesHtml: savesHtml,
      skillsHtml: skillsHtml,
      featuresHtml: featuresHtml,
      equipHtml: equipHtml,
      spellsHtml: spellsHtml,
      profHtml: profHtml,
      personality: personality,
      ideals: ideals,
      bonds: bonds,
      flaws: flaws,
      backstory: backstory,
      edition: '5e'
    });
  };

  // ── 3.5e Export ────────────────────────────────────────────
  window.exportCharSheet35 = function(){
    if(typeof C35 === 'undefined' || !C35 || !C35.race || !C35.cls) return alert('Build a character first before exporting.');

    var race = DND_DATA.races35[C35.race];
    var cls  = DND_DATA.classes35[C35.cls];
    if(!race || !cls) return alert('Character data incomplete.');
    var name = (C35.details && C35.details.name) || 'Unnamed Adventurer';
    var level = C35.level || 1;

    // Ability scores and mods
    var abs = ['str','dex','con','int','wis','cha'];
    var scores = {}, mods = {};
    abs.forEach(function(a){
      var base = (C35.abilities && C35.abilities[a]) || 10;
      var raceBonus = (race.asi && race.asi[a]) || 0;
      scores[a] = base + raceBonus;
      mods[a] = Math.floor((scores[a] - 10) / 2);
    });

    // AC & HP from sheet state
    var st = (typeof sheet35State !== 'undefined') ? sheet35State : {};
    var ac = st.ac || (10 + mods.dex);
    var maxHP = st.maxHP || (cls.hitDie + mods.con);
    var speed = race.speed || 30;
    var bab = st.babVal || Math.floor(level * (cls.babProgression === 'full' ? 1 : cls.babProgression === 'three_quarter' ? 0.75 : 0.5));

    // Saves
    var savesHtml = '';
    var saveNames = {fort:'Fortitude', ref:'Reflex', will:'Will'};
    var saveAbils = {fort:'con', ref:'dex', will:'wis'};
    ['fort','ref','will'].forEach(function(s){
      var base = 0;
      if(cls.saves && cls.saves[s]) base = cls.saves[s] === 'good' ? Math.floor(2 + level/2) : Math.floor(level/3);
      var tot = base + mods[saveAbils[s]];
      var sign = tot >= 0 ? '+' : '';
      savesHtml += '<tr><td>' + sign + tot + '</td><td>' + saveNames[s] + '</td></tr>';
    });

    // Skills
    var skillsHtml = '';
    if(DND_DATA.skills35){
      var sKeys = Object.keys(DND_DATA.skills35);
      sKeys.sort(function(a,b){ return (DND_DATA.skills35[a].name||a).localeCompare(DND_DATA.skills35[b].name||b); });
      skillsHtml = sKeys.map(function(id){
        var sk = DND_DATA.skills35[id];
        var ranks = (C35.skillRanks && C35.skillRanks[id]) || 0;
        var abil = sk.ability || 'int';
        var tot = ranks + mods[abil];
        var sign = tot >= 0 ? '+' : '';
        return '<tr><td>' + sign + tot + '</td><td>' + _esc(sk.name||id) + ' <small>(' + abil.toUpperCase() + ')</small></td><td class="ranks">' + ranks + '</td></tr>';
      }).join('');
    }

    // Feats
    var featsHtml = '';
    if(C35.selectedFeats && C35.selectedFeats.length){
      featsHtml = C35.selectedFeats.map(function(f){ return '<div class="feat-block"><div class="feat-name">' + _esc(f) + '</div></div>'; }).join('');
    }

    // Equipment (from inventory if available)
    var equipHtml = '';
    if(typeof inventoryItems35 !== 'undefined' && inventoryItems35.length){
      equipHtml = inventoryItems35.map(function(it){ return '<li>' + _esc(it.name) + (it.qty>1?' ×'+it.qty:'') + '</li>'; }).join('');
    } else if(cls.equipment){
      var items = typeof cls.equipment === 'string' ? cls.equipment.split(',') : (Array.isArray(cls.equipment) ? cls.equipment : []);
      equipHtml = items.map(function(i){ var t = (typeof i==='string' ? i : '').trim(); return t ? '<li>' + _esc(t) + '</li>' : ''; }).join('');
    }

    // Spells
    var spellsHtml = '';
    if(C35.selectedSpells && C35.selectedSpells.length){
      spellsHtml = '<div class="spell-level">Known Spells</div><div class="spell-list">' + C35.selectedSpells.map(function(s){return _esc(s);}).join(', ') + '</div>';
    }

    var alignment = (C35.details && C35.details.alignment) || '';
    var personality = (C35.details && C35.details.personality) || '';
    var backstory = (C35.details && C35.details.backstory) || '';

    _openSheet({
      name: name,
      classStr: cls.name + ' ' + level,
      race: race.name,
      background: '',
      alignment: alignment,
      level: level,
      pb: 0,
      ac: ac,
      hp: maxHP,
      hitDice: level + 'd' + cls.hitDie,
      speed: speed,
      initiative: mods.dex,
      passivePerc: 0,
      scores: scores,
      mods: mods,
      savesHtml: savesHtml,
      skillsHtml: skillsHtml,
      featuresHtml: featsHtml,
      equipHtml: equipHtml,
      spellsHtml: spellsHtml,
      profHtml: '',
      personality: personality,
      ideals: '',
      bonds: '',
      flaws: '',
      backstory: backstory,
      edition: '3.5e',
      bab: bab
    });
  };

  // ── Helpers ────────────────────────────────────────────────
  function _esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function abilName(a){ return {str:'Strength',dex:'Dexterity',con:'Constitution',int:'Intelligence',wis:'Wisdom',cha:'Charisma'}[a]||a; }
  function _modStr(v){ return (v >= 0 ? '+' : '') + v; }

  // ── Open Print Window ──────────────────────────────────────
  function _openSheet(d){
    var abs = ['str','dex','con','int','wis','cha'];
    var abilBoxes = abs.map(function(a){
      return '<div class="ab-box">' +
        '<div class="ab-label">' + a.toUpperCase() + '</div>' +
        '<div class="ab-mod">' + _modStr(d.mods[a]) + '</div>' +
        '<div class="ab-score">' + d.scores[a] + '</div>' +
      '</div>';
    }).join('');

    var babRow = d.edition === '3.5e' ? '<div class="stat-box"><div class="stat-label">BAB</div><div class="stat-val">+' + d.bab + '</div></div>' : '';
    var pbRow = d.pb ? '<div class="stat-box"><div class="stat-label">PROF</div><div class="stat-val">+' + d.pb + '</div></div>' : '';
    var ppRow = d.passivePerc ? '<div class="stat-box"><div class="stat-label">PASSIVE</div><div class="stat-val">' + d.passivePerc + '</div></div>' : '';

    var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + _esc(d.name) + ' — Character Sheet</title>' +
    '<style>' +
      '@import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Spectral:ital,wght@0,300;0,400;0,500;1,400&display=swap");' +
      '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }' +

      '@page { size: letter; margin: 0.4in 0.45in; }' +
      '@media print { body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } .no-print { display:none !important; } }' +

      'body { font-family: "Spectral", Georgia, serif; font-size: 10px; color: #1a1a1a; background: #fff; line-height: 1.4; padding: 10px; }' +

      /* Header */
      '.header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #8b0000; padding-bottom: 8px; margin-bottom: 10px; }' +
      '.char-name { font-family: "Cinzel", serif; font-size: 22px; font-weight: 700; color: #1a1a1a; }' +
      '.char-meta { font-size: 10px; color: #444; text-align: right; line-height: 1.5; }' +
      '.char-meta b { color: #1a1a1a; }' +

      /* Main layout */
      '.sheet-body { display: grid; grid-template-columns: 180px 1fr; gap: 10px; }' +

      /* Ability column */
      '.left-col { display: flex; flex-direction: column; gap: 6px; }' +
      '.ab-box { border: 2px solid #333; border-radius: 6px; text-align: center; padding: 5px 4px 3px; background: #faf8f5; }' +
      '.ab-label { font-family: "Cinzel", serif; font-size: 7px; font-weight: 700; letter-spacing: 2px; color: #8b0000; }' +
      '.ab-mod { font-family: "Cinzel", serif; font-size: 20px; font-weight: 700; line-height: 1.1; }' +
      '.ab-score { font-size: 11px; color: #666; border-top: 1px solid #ccc; margin-top: 2px; padding-top: 1px; }' +

      /* Stat boxes row */
      '.stat-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }' +
      '.stat-box { flex: 1; min-width: 60px; border: 2px solid #333; border-radius: 4px; text-align: center; padding: 5px 4px; background: #faf8f5; }' +
      '.stat-label { font-family: "Cinzel", serif; font-size: 6px; font-weight: 700; letter-spacing: 1.5px; color: #8b0000; text-transform: uppercase; }' +
      '.stat-val { font-family: "Cinzel", serif; font-size: 16px; font-weight: 700; }' +

      /* Saves & Skills */
      '.section-title { font-family: "Cinzel", serif; font-size: 8px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #8b0000; border-bottom: 1.5px solid #8b0000; padding-bottom: 2px; margin: 8px 0 4px; }' +
      'table.saves, table.skills { width: 100%; border-collapse: collapse; font-size: 9.5px; }' +
      'table.saves td, table.skills td { padding: 1.5px 3px; vertical-align: middle; }' +
      '.prof-dot { font-size: 8px; width: 14px; }' +
      '.ranks { text-align: right; color: #888; font-size: 8px; }' +

      /* Right content */
      '.right-col { display: flex; flex-direction: column; gap: 4px; }' +

      /* Two-column sections */
      '.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }' +

      /* Feature blocks */
      '.feat-block { margin-bottom: 4px; }' +
      '.feat-name { font-family: "Cinzel", serif; font-size: 9px; font-weight: 600; color: #333; }' +
      '.feat-name small { font-weight: 400; color: #888; font-size: 8px; }' +
      '.feat-desc { font-size: 8.5px; color: #555; line-height: 1.35; margin-top: 1px; }' +

      /* Equipment list */
      'ul.equip { list-style: none; padding: 0; columns: 2; column-gap: 12px; }' +
      'ul.equip li { font-size: 9.5px; padding: 1px 0; break-inside: avoid; }' +
      'ul.equip li::before { content: "• "; color: #8b0000; }' +

      /* Spells */
      '.spell-level { font-family: "Cinzel", serif; font-size: 8px; font-weight: 700; color: #8b0000; margin-top: 4px; }' +
      '.spell-list { font-size: 9.5px; color: #333; }' +

      /* Proficiencies */
      '.prof-block { font-size: 9px; line-height: 1.5; }' +
      '.prof-block b { font-family: "Cinzel", serif; font-size: 8px; letter-spacing: 0.5px; }' +

      /* Personality */
      '.trait-box { border: 1px solid #ccc; border-radius: 3px; padding: 4px 6px; margin-bottom: 4px; min-height: 24px; }' +
      '.trait-label { font-family: "Cinzel", serif; font-size: 7px; font-weight: 700; letter-spacing: 1px; color: #8b0000; text-transform: uppercase; margin-bottom: 1px; }' +
      '.trait-text { font-size: 9px; color: #333; line-height: 1.35; }' +

      /* Backstory */
      '.backstory { font-size: 9px; color: #333; line-height: 1.4; white-space: pre-wrap; }' +

      /* Print button */
      '.print-bar { text-align: center; padding: 14px; }' +
      '.print-bar button { font-family: "Cinzel", serif; font-size: 12px; padding: 10px 32px; background: #8b0000; color: #fff; border: none; cursor: pointer; letter-spacing: 2px; }' +
      '.print-bar button:hover { background: #a00; }' +

      /* Footer */
      '.sheet-footer { text-align: center; font-size: 7px; color: #aaa; margin-top: 6px; font-style: italic; }' +
    '</style></head><body>' +

    '<div class="print-bar no-print"><button onclick="window.print()">Print / Save as PDF</button></div>' +

    /* Header */
    '<div class="header">' +
      '<div class="char-name">' + _esc(d.name) + '</div>' +
      '<div class="char-meta">' +
        '<b>' + _esc(d.classStr) + '</b><br>' +
        _esc(d.race) + (d.background ? ' · ' + _esc(d.background) : '') +
        (d.alignment ? ' · ' + _esc(d.alignment) : '') +
      '</div>' +
    '</div>' +

    '<div class="sheet-body">' +

      /* Left Column: Abilities */
      '<div class="left-col">' +
        abilBoxes +
        '<div class="section-title">Saving Throws</div>' +
        '<table class="saves">' + d.savesHtml + '</table>' +
        '<div class="section-title">Skills</div>' +
        '<table class="skills">' + d.skillsHtml + '</table>' +
      '</div>' +

      /* Right Column */
      '<div class="right-col">' +

        /* Stat Row */
        '<div class="stat-row">' +
          '<div class="stat-box"><div class="stat-label">Armor Class</div><div class="stat-val">' + d.ac + '</div></div>' +
          '<div class="stat-box"><div class="stat-label">Hit Points</div><div class="stat-val">' + d.hp + '</div></div>' +
          '<div class="stat-box"><div class="stat-label">Hit Dice</div><div class="stat-val" style="font-size:12px;">' + _esc(d.hitDice) + '</div></div>' +
          '<div class="stat-box"><div class="stat-label">Speed</div><div class="stat-val">' + d.speed + ' ft</div></div>' +
          '<div class="stat-box"><div class="stat-label">Initiative</div><div class="stat-val">' + _modStr(d.initiative) + '</div></div>' +
          pbRow + babRow + ppRow +
        '</div>' +

        /* Personality Traits */
        (d.personality || d.ideals || d.bonds || d.flaws ?
          '<div class="two-col">' +
            (d.personality ? '<div class="trait-box"><div class="trait-label">Personality Traits</div><div class="trait-text">' + _esc(d.personality) + '</div></div>' : '') +
            (d.ideals ? '<div class="trait-box"><div class="trait-label">Ideals</div><div class="trait-text">' + _esc(d.ideals) + '</div></div>' : '') +
            (d.bonds ? '<div class="trait-box"><div class="trait-label">Bonds</div><div class="trait-text">' + _esc(d.bonds) + '</div></div>' : '') +
            (d.flaws ? '<div class="trait-box"><div class="trait-label">Flaws</div><div class="trait-text">' + _esc(d.flaws) + '</div></div>' : '') +
          '</div>' : '') +

        /* Proficiencies */
        (d.profHtml ? '<div class="section-title">Proficiencies</div><div class="prof-block">' + d.profHtml + '</div>' : '') +

        /* Equipment */
        (d.equipHtml ? '<div class="section-title">Equipment</div><ul class="equip">' + d.equipHtml + '</ul>' : '') +

        /* Spells */
        (d.spellsHtml ? '<div class="section-title">Spellcasting</div>' + d.spellsHtml : '') +

        /* Features */
        (d.featuresHtml ? '<div class="section-title">Features &amp; Traits</div>' + d.featuresHtml : '') +

        /* Backstory */
        (d.backstory ? '<div class="section-title">Backstory</div><div class="backstory">' + _esc(d.backstory) + '</div>' : '') +

      '</div>' +

    '</div>' +

    '<div class="sheet-footer">D&amp;D ' + _esc(d.edition) + ' Character Sheet — ' + _esc(d.name) + ' — phmurtstudios.com</div>' +

    '</body></html>';

    var w = window.open('', '_blank');
    if(w){
      w.document.write(html);
      w.document.close();
    } else {
      alert('Popup blocked. Please allow popups for this site to export your character sheet.');
    }
  }

})();
