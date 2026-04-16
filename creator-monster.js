/* ═══════════════════════════════════════════════════════════════════
   PHMURT CREATOR — Monster
   ═══════════════════════════════════════════════════════════════════
   Split-pane creator with stat-block preview. Uses shared creator.css
   + PhmurtCreatorUtil. Data format compatible with the existing
   'phmurt_homebrew_monsters' localStorage key so rendering elsewhere
   keeps working.
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var KEY = 'phmurt_homebrew_monsters';
  var SYNC_DEBOUNCE = 700;
  var CLOUD_TABLE = 'homebrew_content';
  var U = global.PhmurtCreatorUtil || {};

  var SIZES  = ['Tiny','Small','Medium','Large','Huge','Gargantuan'];
  var TYPES  = ['Aberration','Beast','Celestial','Construct','Dragon','Elemental','Fey','Fiend','Giant','Humanoid','Monstrosity','Ooze','Plant','Undead'];
  var AC_TYPES = ['Natural Armor','Leather','Studded Leather','Chain Shirt','Scale Mail','Breastplate','Half Plate','Ring Mail','Chain Mail','Splint','Plate','Shield','Mage Armor','Custom'];
  var ABS    = ['STR','DEX','CON','INT','WIS','CHA'];
  var SKILLS = ['Acrobatics','Animal Handling','Arcana','Athletics','Deception','History','Insight','Intimidation','Investigation','Medicine','Nature','Perception','Performance','Persuasion','Religion','Sleight of Hand','Stealth','Survival'];
  var SKILL_ABILITY = {
    'Acrobatics':'DEX','Animal Handling':'WIS','Arcana':'INT','Athletics':'STR',
    'Deception':'CHA','History':'INT','Insight':'WIS','Intimidation':'CHA',
    'Investigation':'INT','Medicine':'WIS','Nature':'INT','Perception':'WIS',
    'Performance':'CHA','Persuasion':'CHA','Religion':'INT',
    'Sleight of Hand':'DEX','Stealth':'DEX','Survival':'WIS'
  };
  var CR_OPTS = ['0','1/8','1/4','1/2','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'];

  function defaultMonster() {
    return {
      type: 'monster',
      clientId: null,
      name: 'New Monster',
      size: 'Medium', monsterType: 'Beast', alignment: 'Unaligned',
      ac: 13, acType: 'Natural Armor',
      hitDice: '5d8+5',
      speed: { walk: 30, fly: 0, swim: 0, climb: 0, burrow: 0 },
      abilities: { STR:10, DEX:10, CON:10, INT:10, WIS:10, CHA:10 },
      cr: '1',
      saveProficiencies: [],
      skillProficiencies: [],
      vulnerabilities: '', resistances: '', immunities: '', conditionImmunities: '',
      senses: '', languages: '',
      traits: [{ name: '', desc: '' }],
      actions: [{ name: '', desc: '' }],
      lore: '',
      campaignId: null,
      isPublic: false
    };
  }

  var state = { current: null, saveTimer: null, editId: null };

  // ── Persistence ───────────────────────────────────────────────────
  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; }
    catch (e) { return []; }
  }
  function saveAll(list) { localStorage.setItem(KEY, JSON.stringify(list)); }
  function generateClientId() { return 'm_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8); }

  // ── Cloud sync ────────────────────────────────────────────────────
  function getSupabase() { return global.phmurtSupabase || null; }
  function currentUserId() {
    try {
      var s = global.PhmurtDB && global.PhmurtDB.getSession && global.PhmurtDB.getSession();
      return (s && s.user && s.user.id) || null;
    } catch (e) { return null; }
  }
  var cloudSync = (U.debounce ? U.debounce(doCloudSync, SYNC_DEBOUNCE) : function(){ setTimeout(doCloudSync, SYNC_DEBOUNCE); });
  function doCloudSync() {
    var sb = getSupabase(); var uid = currentUserId();
    if (!sb || !uid || !state.current || !state.current.clientId) return;
    setSyncState('syncing');
    var row = {
      user_id: uid,
      type: 'monster',
      client_id: state.current.clientId,
      data: state.current,
      slug: U.slugify ? U.slugify(state.current.name) : state.current.name.toLowerCase().replace(/\s+/g,'-'),
      is_public: !!state.current.isPublic
    };
    sb.from(CLOUD_TABLE).upsert(row, { onConflict: 'user_id,type,client_id' }).then(function (r) {
      setSyncState(r.error ? 'err' : 'ok');
    }, function () { setSyncState('err'); });
  }
  function setSyncState(kind) {
    var el = document.querySelector('#creator-root .cr-sync-indicator');
    if (!el) return;
    el.className = 'cr-sync-indicator ' + kind;
    el.textContent = kind === 'ok' ? '✓ Synced' : kind === 'syncing' ? 'Syncing…' : kind === 'err' ? '✕ Sync error' : '';
  }

  // ── Render ────────────────────────────────────────────────────────
  function escAttr(s) { return (s == null ? '' : String(s)).replace(/"/g, '&quot;'); }
  function esc(s) { return (U.escapeHtml ? U.escapeHtml(s) : String(s == null ? '' : s)); }

  function selectEl(key, opts, cur, labels) {
    labels = labels || {};
    var html = '<select data-k="' + key + '">';
    opts.forEach(function (o) {
      var label = labels[o] != null ? labels[o] : o;
      html += '<option value="' + escAttr(o) + '"' + (String(cur) === String(o) ? ' selected' : '') + '>' + esc(label) + '</option>';
    });
    return html + '</select>';
  }
  function numField(key, cur, min, max) {
    return '<input type="number" data-k="' + key + '" value="' + escAttr(cur) + '"' +
      (min != null ? ' min="' + min + '"' : '') + (max != null ? ' max="' + max + '"' : '') + ' />';
  }
  function textField(key, cur, ph) {
    return '<input type="text" data-k="' + key + '" value="' + escAttr(cur) + '" placeholder="' + escAttr(ph||'') + '" />';
  }
  function chip(group, val, label, checked) {
    return '<label class="cr-chip"><input type="checkbox" data-group="' + group + '" value="' + escAttr(val) + '"' + (checked ? ' checked' : '') + ' /> ' + esc(label) + '</label>';
  }

  function render() {
    var s = state.current; if (!s) return;
    var root = document.getElementById('creator-root'); if (!root) return;

    var abilityBlocks = ABS.map(function (a) {
      var v = s.abilities[a] || 10;
      var mod = U.fmtMod ? U.fmtMod(U.abilityMod(v)) : '';
      return '<div class="cr-field"><label>' + a + '</label>' +
             '<input type="number" data-ability="' + a + '" value="' + v + '" min="1" max="30" />' +
             '<div class="cr-autocalc">mod ' + mod + '</div></div>';
    }).join('');

    var saveRow = ABS.map(function (a) {
      return chip('saveProficiencies', a, a, s.saveProficiencies.indexOf(a) !== -1);
    }).join('');

    var skillRow = SKILLS.map(function (sk) {
      return chip('skillProficiencies', sk, sk, s.skillProficiencies.indexOf(sk) !== -1);
    }).join('');

    var traitsBlock = (s.traits || []).map(function (t, i) { return traitRow('traits', t, i); }).join('');
    var actionsBlock = (s.actions || []).map(function (t, i) { return traitRow('actions', t, i); }).join('');

    root.innerHTML =
      '<div class="cr-topbar">' +
        '<button class="cr-back" type="button" data-act="close">◂ Back</button>' +
        '<div class="cr-title">' +
          '<div class="cr-eyebrow">Homebrew · Monster</div>' +
          '<div class="cr-heading">' + esc(s.name || 'New Monster') + '</div>' +
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

          // Identity
          '<div class="cr-section">' +
            '<div class="cr-section-label">Identity</div>' +
            '<div class="cr-grid cr-grid-2">' +
              '<div class="cr-field wide"><label>Name <span class="req">*</span></label>' + textField('name', s.name, 'e.g. Frost Wyrm') + '</div>' +
              '<div class="cr-field"><label>Size</label>' + selectEl('size', SIZES, s.size) + '</div>' +
              '<div class="cr-field"><label>Creature Type</label>' + selectEl('monsterType', TYPES, s.monsterType) + '</div>' +
              '<div class="cr-field wide"><label>Alignment</label>' + textField('alignment', s.alignment, 'e.g. Chaotic Evil') + '</div>' +
            '</div>' +
          '</div>' +

          // Defense
          '<div class="cr-section">' +
            '<div class="cr-section-label">Defense</div>' +
            '<div class="cr-grid cr-grid-2">' +
              '<div class="cr-field"><label>Armor Class</label>' + numField('ac', s.ac, 0, 40) + '</div>' +
              '<div class="cr-field"><label>AC Type</label>' + selectEl('acType', AC_TYPES, s.acType) + '</div>' +
              '<div class="cr-field wide"><label>Hit Dice</label>' + textField('hitDice', s.hitDice, 'e.g. 8d10+16') +
                '<div class="cr-autocalc">' + hpHint(s) + '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +

          // Speed
          '<div class="cr-section">' +
            '<div class="cr-section-label">Speed <span class="hint">feet per turn, 0 = none</span></div>' +
            '<div class="cr-grid cr-grid-3">' +
              '<div class="cr-field"><label>Walk</label><input type="number" data-speed="walk" value="' + (s.speed.walk||0) + '" /></div>' +
              '<div class="cr-field"><label>Fly</label><input type="number" data-speed="fly" value="' + (s.speed.fly||0) + '" /></div>' +
              '<div class="cr-field"><label>Swim</label><input type="number" data-speed="swim" value="' + (s.speed.swim||0) + '" /></div>' +
              '<div class="cr-field"><label>Climb</label><input type="number" data-speed="climb" value="' + (s.speed.climb||0) + '" /></div>' +
              '<div class="cr-field"><label>Burrow</label><input type="number" data-speed="burrow" value="' + (s.speed.burrow||0) + '" /></div>' +
            '</div>' +
          '</div>' +

          // Abilities
          '<div class="cr-section">' +
            '<div class="cr-section-label">Ability Scores <span class="hint">modifiers auto-calc</span></div>' +
            '<div class="cr-grid cr-grid-3">' + abilityBlocks + '</div>' +
          '</div>' +

          // Challenge
          '<div class="cr-section">' +
            '<div class="cr-section-label">Challenge</div>' +
            '<div class="cr-grid cr-grid-2">' +
              '<div class="cr-field"><label>Challenge Rating</label>' + selectEl('cr', CR_OPTS, s.cr) + '</div>' +
              '<div class="cr-field"><label>XP / Proficiency</label>' +
                '<input type="text" value="' + xpHint(s) + '" readonly />' +
              '</div>' +
            '</div>' +
          '</div>' +

          // Saves & Skills
          '<div class="cr-section">' +
            '<div class="cr-section-label">Saving Throw Proficiencies</div>' +
            '<div class="cr-chips">' + saveRow + '</div>' +
          '</div>' +
          '<div class="cr-section">' +
            '<div class="cr-section-label">Skill Proficiencies</div>' +
            '<div class="cr-chips">' + skillRow + '</div>' +
          '</div>' +

          // Damage & Conditions
          '<div class="cr-section">' +
            '<div class="cr-section-label">Damage & Condition Handling <span class="hint">comma-separated</span></div>' +
            '<div class="cr-grid cr-grid-2">' +
              '<div class="cr-field"><label>Vulnerabilities</label>' + textField('vulnerabilities', s.vulnerabilities, 'Fire, Cold') + '</div>' +
              '<div class="cr-field"><label>Resistances</label>' + textField('resistances', s.resistances, 'Cold, Lightning') + '</div>' +
              '<div class="cr-field"><label>Immunities</label>' + textField('immunities', s.immunities, 'Poison') + '</div>' +
              '<div class="cr-field"><label>Condition Immunities</label>' + textField('conditionImmunities', s.conditionImmunities, 'Charmed, Frightened') + '</div>' +
              '<div class="cr-field"><label>Senses</label>' + textField('senses', s.senses, 'darkvision 60 ft., passive Perception 13') + '</div>' +
              '<div class="cr-field"><label>Languages</label>' + textField('languages', s.languages, 'Common, Draconic') + '</div>' +
            '</div>' +
          '</div>' +

          // Traits
          '<div class="cr-section">' +
            '<div class="cr-section-label">Traits & Features</div>' +
            '<div data-list="traits">' + traitsBlock + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-trait" style="margin-top:8px;">+ Add Trait</button>' +
          '</div>' +

          // Actions
          '<div class="cr-section">' +
            '<div class="cr-section-label">Actions <span class="hint">damage auto-analyzes</span></div>' +
            '<div data-list="actions">' + actionsBlock + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-action" style="margin-top:8px;">+ Add Action</button>' +
          '</div>' +

          // Lore
          '<div class="cr-section">' +
            '<div class="cr-section-label">Lore / Description <span class="hint">markdown supported</span></div>' +
            '<div class="cr-field"><textarea data-k="lore" rows="4" placeholder="Where the creature lives, its habits, what legends say...">' + esc(s.lore) + '</textarea></div>' +
          '</div>' +

          // Publishing
          '<div class="cr-section">' +
            '<div class="cr-section-label">Publishing & Sharing</div>' +
            '<div class="cr-field"><label>Add to Campaign</label>' +
              '<select data-k="campaignId"><option value="">— Not attached —</option></select>' +
              '<div class="hint">Players in the selected campaign can view this monster.</div>' +
            '</div>' +
            '<div class="cr-field"><label class="cr-toggle"><input type="checkbox" data-k="isPublic"' + (s.isPublic ? ' checked' : '') + ' /> Make public in the community library</label></div>' +
          '</div>' +

        '</div>' +

        '<div class="cr-preview-pane">' +
          '<h2>Live Preview</h2>' +
          renderStatblock(s) +
        '</div>' +
      '</div>';

    populateCampaignDropdown(s);
    setSyncState(''); // reset to em-dash
  }

  function traitRow(listKey, t, idx) {
    return '<div class="cr-trait-row" data-idx="' + idx + '" style="margin-bottom:10px;padding:10px;background:var(--bg-card);border:1px solid var(--border);">' +
      '<input type="text" data-list="' + listKey + '" data-idx="' + idx + '" data-field="name" value="' + escAttr(t.name) + '" placeholder="Name (e.g., Multiattack)" style="margin-bottom:6px;" />' +
      '<textarea data-list="' + listKey + '" data-idx="' + idx + '" data-field="desc" rows="2" placeholder="Description">' + esc(t.desc) + '</textarea>' +
      (listKey === 'actions' && t.desc ? '<div class="cr-autocalc">' + actionHint(t.desc) + '</div>' : '') +
      '<button type="button" class="cr-btn" data-act="remove-row" data-list="' + listKey + '" data-idx="' + idx + '" style="margin-top:6px;">Remove</button>' +
    '</div>';
  }

  // ── Auto-calc hints ───────────────────────────────────────────────
  function hpHint(s) {
    var hp = U.monsterHp ? U.monsterHp(s.hitDice, s.abilities && s.abilities.CON) : null;
    if (hp == null) return 'Enter hit dice like 8d10+16';
    var parsed = U.parseDamage(s.hitDice);
    return 'HP ≈ ' + hp + '  (avg of ' + (parsed ? parsed.avg : '?') + ' + CON mod × dice)';
  }
  function xpHint(s) {
    var xp = U.crToXp ? U.crToXp(s.cr) : null;
    var pb = U.crToProficiency ? U.crToProficiency(s.cr) : null;
    return (xp != null ? xp + ' XP' : '—') + '  ·  PB +' + (pb || 2);
  }
  function actionHint(desc) {
    if (!desc || !U.parseDamage) return '';
    var sum = U.damageSummary(desc, null, '');
    return sum || '';
  }

  // ── Statblock preview ─────────────────────────────────────────────
  function renderStatblock(s) {
    var pb = U.crToProficiency ? U.crToProficiency(s.cr) : 2;
    function abMod(a) { return U.abilityMod ? U.abilityMod(s.abilities[a]) : 0; }
    function abCell(a) {
      var sc = s.abilities[a] || 10;
      return '<td><strong>' + sc + '</strong><br><span class="cr-sb-mod">' + (U.fmtMod ? U.fmtMod(abMod(a)) : '') + '</span></td>';
    }
    var hp = U.monsterHp ? U.monsterHp(s.hitDice, s.abilities.CON) : '?';
    var saves = (s.saveProficiencies||[]).map(function (a) {
      return a + ' ' + (U.fmtMod ? U.fmtMod(abMod(a) + pb) : '');
    }).join(', ');
    var skillsLine = (s.skillProficiencies||[]).map(function (sk) {
      var ab = SKILL_ABILITY[sk]; var mod = abMod(ab) + pb;
      return sk + ' ' + (U.fmtMod ? U.fmtMod(mod) : '');
    }).join(', ');
    var spd = s.speed || {};
    var speedLine = ['walk','fly','swim','climb','burrow']
      .filter(function (k) { return spd[k] && spd[k] > 0; })
      .map(function (k) { return (k === 'walk' ? '' : k + ' ') + spd[k] + ' ft.'; })
      .join(', ');

    var xp = U.crToXp ? U.crToXp(s.cr) : 0;

    var traitsHtml = (s.traits||[]).filter(function(t){return t.name||t.desc;}).map(function(t){
      return '<div class="cr-sb-trait"><strong><em>' + esc(t.name) + '.</em></strong> ' + esc(t.desc) + '</div>';
    }).join('');

    var actionsHtml = (s.actions||[]).filter(function(t){return t.name||t.desc;}).map(function(t){
      return '<div class="cr-sb-trait"><strong><em>' + esc(t.name) + '.</em></strong> ' + esc(t.desc) + '</div>';
    }).join('');

    return '<div class="cr-spellcard cr-statblock">' +
      '<img src="logo.png" alt="Phmurt" class="cr-sc-brand" />' +
      '<div class="cr-sc-name">' + esc(s.name) + '</div>' +
      '<div class="cr-sc-meta">' + esc(s.size) + ' ' + esc(s.monsterType).toLowerCase() + ', ' + esc(s.alignment).toLowerCase() + '</div>' +
      '<div class="cr-sc-row"><strong>Armor Class</strong> ' + s.ac + ' (' + esc(s.acType) + ')</div>' +
      '<div class="cr-sc-row"><strong>Hit Points</strong> ' + hp + ' (' + esc(s.hitDice) + ')</div>' +
      '<div class="cr-sc-row"><strong>Speed</strong> ' + (speedLine || '—') + '</div>' +
      '<table class="cr-sb-abilities"><tr>' + ABS.map(function(a){return '<th>'+a+'</th>';}).join('') + '</tr><tr>' + ABS.map(abCell).join('') + '</tr></table>' +
      (saves ? '<div class="cr-sc-row"><strong>Saving Throws</strong> ' + saves + '</div>' : '') +
      (skillsLine ? '<div class="cr-sc-row"><strong>Skills</strong> ' + skillsLine + '</div>' : '') +
      (s.vulnerabilities ? '<div class="cr-sc-row"><strong>Damage Vulnerabilities</strong> ' + esc(s.vulnerabilities) + '</div>' : '') +
      (s.resistances ? '<div class="cr-sc-row"><strong>Damage Resistances</strong> ' + esc(s.resistances) + '</div>' : '') +
      (s.immunities ? '<div class="cr-sc-row"><strong>Damage Immunities</strong> ' + esc(s.immunities) + '</div>' : '') +
      (s.conditionImmunities ? '<div class="cr-sc-row"><strong>Condition Immunities</strong> ' + esc(s.conditionImmunities) + '</div>' : '') +
      (s.senses ? '<div class="cr-sc-row"><strong>Senses</strong> ' + esc(s.senses) + '</div>' : '') +
      (s.languages ? '<div class="cr-sc-row"><strong>Languages</strong> ' + esc(s.languages) + '</div>' : '') +
      '<div class="cr-sc-row"><strong>Challenge</strong> ' + esc(s.cr) + ' (' + (xp||0) + ' XP)  ·  Proficiency Bonus +' + pb + '</div>' +
      (traitsHtml ? '<div class="cr-sc-body">' + traitsHtml + '</div>' : '') +
      (actionsHtml ? '<div class="cr-sc-higher"><strong>Actions</strong>' + actionsHtml + '</div>' : '') +
      (s.lore ? '<div class="cr-sc-body" style="margin-top:18px;">' + (U.renderMarkdown ? U.renderMarkdown(s.lore) : esc(s.lore)) + '</div>' : '') +
    '</div>';
  }

  // ── Events ────────────────────────────────────────────────────────
  function wireEvents() {
    var root = document.getElementById('creator-root');
    if (!root || root._wired) return;
    root._wired = true;

    root.addEventListener('input', onChange);
    root.addEventListener('change', onChange);
    root.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
  }
  function onChange(e) {
    var t = e.target; if (!t) return;
    var k = t.getAttribute('data-k');
    var ab = t.getAttribute('data-ability');
    var sp = t.getAttribute('data-speed');
    var list = t.getAttribute('data-list');
    var group = t.getAttribute('data-group');
    if (k) {
      if (t.type === 'checkbox') state.current[k] = t.checked;
      else if (t.type === 'number') state.current[k] = parseInt(t.value, 10) || 0;
      else state.current[k] = t.value;
    } else if (ab) {
      state.current.abilities[ab] = parseInt(t.value, 10) || 10;
    } else if (sp) {
      state.current.speed[sp] = parseInt(t.value, 10) || 0;
    } else if (list && t.hasAttribute('data-idx') && t.hasAttribute('data-field')) {
      var idx = parseInt(t.getAttribute('data-idx'), 10);
      var field = t.getAttribute('data-field');
      state.current[list][idx][field] = t.value;
    } else if (group) {
      var arr = state.current[group] || (state.current[group] = []);
      var v = t.value;
      if (t.checked && arr.indexOf(v) === -1) arr.push(v);
      if (!t.checked) state.current[group] = arr.filter(function (x) { return x !== v; });
    }
    render();
    cloudSync();
  }
  function onClick(e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var act = t.getAttribute('data-act');
    if (act === 'close') return close();
    if (act === 'save') return save();
    if (act === 'export') return exportPng();
    if (act === 'delete') return del();
    if (act === 'add-trait') { state.current.traits.push({ name:'', desc:'' }); render(); return; }
    if (act === 'add-action') { state.current.actions.push({ name:'', desc:'' }); render(); return; }
    if (act === 'remove-row') {
      var list = t.getAttribute('data-list'); var idx = parseInt(t.getAttribute('data-idx'),10);
      if (state.current[list] && idx >= 0 && idx < state.current[list].length) {
        state.current[list].splice(idx, 1);
      }
      render(); return;
    }
  }
  function onKeydown(e) {
    if (e.key !== 'Escape') return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (['input','textarea','select'].indexOf(tag) !== -1) return;
    close();
  }

  // ── Save / delete / export ────────────────────────────────────────
  function save() {
    if (!state.current.name || !state.current.name.trim()) { if (U.showToast) U.showToast('Error', 'Name is required'); else alert('Name is required'); return; }
    if (!state.current.clientId) state.current.clientId = generateClientId();
    var list = loadAll();
    var existingIdx = list.findIndex(function (m) { return m.clientId === state.current.clientId; });
    if (existingIdx >= 0) list[existingIdx] = state.current;
    else list.push(state.current);
    saveAll(list);
    if (global._homebrewMonsters) global._homebrewMonsters = list;
    if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
    cloudSync();
    close();
  }
  function del() {
    var doDelete = function() {
      var list = loadAll().filter(function (m) { return m.clientId !== state.current.clientId; });
      saveAll(list);
      if (global._homebrewMonsters) global._homebrewMonsters = list;
      if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
      close();
    };
    if (U.showConfirm) U.showConfirm('Delete this monster? This cannot be undone.', doDelete);
    else if (confirm('Delete this monster?')) doDelete();
  }
  function exportPng() {
    var card = document.querySelector('#creator-root .cr-spellcard');
    if (!card) return;
    if (typeof global.html2canvas !== 'function') {
      if (U.showToast) U.showToast('Error', 'PNG export library not loaded. Falling back to JSON copy.');
      else alert('PNG export library not loaded. Falling back to JSON copy.');
      return;
    }
    global.html2canvas(card, { backgroundColor: null, scale: 2 }).then(function (canvas) {
      canvas.toBlob(function (blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = (state.current.name || 'monster') + '.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      });
    });
  }

  function populateCampaignDropdown(s) {
    var sel = document.querySelector('#creator-root select[data-k="campaignId"]');
    if (!sel) return;
    var campaigns = (global.phmurtCampaigns && global.phmurtCampaigns.list) || [];
    campaigns.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c.id; opt.textContent = c.name + (c.role === 'dm' ? ' (DM)' : ' (Player)');
      if (s.campaignId === c.id) opt.selected = true;
      sel.appendChild(opt);
    });
  }

  // ── Open / close ──────────────────────────────────────────────────
  function openMonster(editId) {
    var root = document.getElementById('creator-root'); if (!root) return;
    var list = loadAll();
    var existing = editId ? list.find(function (m) { return m.clientId === editId || m.id === editId; }) : null;
    state.current = existing ? Object.assign(defaultMonster(), existing) : defaultMonster();
    state.editId = editId || null;
    root.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    render();
    wireEvents();
    try { history.replaceState({}, '', location.pathname + '?create=monster' + (editId ? '&id=' + editId : '')); } catch (e) {}
  }
  function close() {
    var root = document.getElementById('creator-root'); if (!root) return;
    if (state.saveTimer) clearTimeout(state.saveTimer);
    root.setAttribute('hidden', '');
    document.body.style.overflow = '';
    state.current = null; state.editId = null;
    try {
      var url = new URL(location.href);
      url.searchParams.delete('create'); url.searchParams.delete('id');
      history.replaceState({}, '', url.toString());
    } catch (e) {}
  }

  // ── Auto-open from URL ────────────────────────────────────────────
  function maybeAutoOpen() {
    try {
      var q = new URLSearchParams(location.search);
      if (q.get('create') === 'monster') openMonster(q.get('id') || null);
    } catch (e) {}
  }

  // ── Export API ────────────────────────────────────────────────────
  global.PhmurtMonsterCreator = { openMonster: openMonster, close: close };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', maybeAutoOpen);
  } else {
    maybeAutoOpen();
  }
})(window);
