/* ═══════════════════════════════════════════════════════════════════
   PHMURT CREATOR — Class
   ═══════════════════════════════════════════════════════════════════
   Split-pane class creator for D&D 5e homebrew classes. Uses shared
   creator.css + PhmurtCreatorUtil. Data syncs to 'phmurt_homebrew_entities_class'.
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var KEY = 'phmurt_homebrew_entities_class';
  var SYNC_DEBOUNCE = 700;
  var CLOUD_TABLE = 'homebrew_content';
  var U = global.PhmurtCreatorUtil || {};

  var HIT_DICE = [6, 8, 10, 12];
  var ABILITIES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  var ABILITY_LABELS = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };
  var RECHARGE = ['short_rest', 'long_rest'];
  var SUBCLASS_LEVELS = ['1', '2', '3', '4', '5', '6', '7'];
  var SPELL_ABILITIES = ['', 'str', 'dex', 'con', 'int', 'wis', 'cha'];
  var SPELL_LISTS = ['', 'wizard', 'bard', 'cleric', 'druid', 'sorcerer', 'warlock', 'paladin', 'ranger'];
  var SLOT_ARCHETYPES = ['', 'wizard', 'bard', 'cleric', 'druid', 'sorcerer', 'warlock', 'paladin', 'ranger'];

  function defaultClass() {
    return {
      type: 'class',
      clientId: null,
      name: 'New Class',
      hitDie: 8,
      tags: '',
      primaryAbility: 'str',
      skillCount: 2,
      skillOptions: '',
      armorProf: '',
      weaponProf: '',
      toolProf: '',
      saves: ['str', 'dex'],
      subclassTitle: 'Archetype',
      subclassLevel: 3,
      subclasses: '',
      features: [{ name: '', desc: '' }],
      levelFeatures: {},
      spellcastingAbility: '',
      spellList: '',
      slotArchetype: '',
      ritualCasting: false,
      hasFocus: false,
      abilityUses: [],
      passiveFeatures: [],
      extraAttackLevel: 5,
      extraAttackTotal: 1,
      equipment: '',
      startingGold: '',
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
  function generateClientId() { return 'c_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8); }

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
    state.current._authorName = U.getAuthorName ? U.getAuthorName() : 'Anonymous';
    var row = {
      user_id: uid,
      type: 'class',
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

  // ── Render helpers ────────────────────────────────────────────────
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

  function getProfBonus(lvl) {
    if (lvl < 5) return 2;
    if (lvl < 9) return 3;
    if (lvl < 13) return 4;
    if (lvl < 17) return 5;
    return 6;
  }

  // ── Render ────────────────────────────────────────────────────────
  function render() {
    var s = state.current; if (!s) return;
    var root = document.getElementById('creator-root'); if (!root) return;

    var featureRows = (s.features || []).map(function (f, i) { return featureRow(f, i); }).join('');

    var levelFeatureRows = [];
    for (var lv = 2; lv <= 20; lv++) {
      var lvFeatures = s.levelFeatures[lv] || [];
      lvFeatures.forEach(function (f, i) {
        levelFeatureRows.push(levelFeatureRow(lv, f, i));
      });
    }

    var abilityRows = (s.abilityUses || []).map(function (a, i) { return abilityRow(a, i); }).join('');
    var passiveRows = (s.passiveFeatures || []).map(function (p, i) { return passiveRow(p, i); }).join('');

    root.innerHTML =
      '<div class="cr-topbar">' +
        '<button class="cr-back" type="button" data-act="close">◂ Back</button>' +
        '<div class="cr-title">' +
          '<div class="cr-eyebrow">Homebrew · Class</div>' +
          '<div class="cr-heading">' + esc(s.name || 'New Class') + '</div>' +
        '</div>' +
        '<div class="cr-sync-indicator">—</div>' +
        '<div class="cr-actions">' +
          (state.editId ? '<button class="cr-btn danger" data-act="delete">Delete</button>' : '') +
          '<button class="cr-btn primary" data-act="save">Save</button>' +
        '</div>' +
      '</div>' +

      '<div class="cr-split">' +
        '<div class="cr-form-pane">' +

          // 1. Identity
          '<div class="cr-section">' +
            '<div class="cr-section-label">Identity</div>' +
            '<div class="cr-grid cr-grid-2">' +
              '<div class="cr-field wide"><label>Name <span class="req">*</span></label>' + textField('name', s.name, 'e.g. Mystic') + '</div>' +
              '<div class="cr-field"><label>Hit Die</label>' + selectEl('hitDie', HIT_DICE.map(String), s.hitDie) + '</div>' +
              '<div class="cr-field wide"><label>Tags</label>' + textField('tags', s.tags, 'e.g. Spellcaster, Melee') + '</div>' +
              '<div class="cr-field"><label>Primary Ability</label>' + selectEl('primaryAbility', ABILITIES, s.primaryAbility, ABILITY_LABELS) + '</div>' +
            '</div>' +
          '</div>' +

          // 2. Proficiencies
          '<div class="cr-section">' +
            '<div class="cr-section-label">Proficiencies</div>' +
            '<div class="cr-grid cr-grid-1">' +
              '<div class="cr-field"><label>Armor Proficiencies</label>' + textField('armorProf', s.armorProf, 'Light, Medium') + '</div>' +
              '<div class="cr-field"><label>Weapon Proficiencies</label>' + textField('weaponProf', s.weaponProf, 'Simple, Martial') + '</div>' +
              '<div class="cr-field"><label>Tool Proficiencies</label>' + textField('toolProf', s.toolProf, 'e.g. Thieves\' tools') + '</div>' +
              '<div class="cr-field"><label>Skill Count</label>' + numField('skillCount', s.skillCount, 1, 18) + '</div>' +
              '<div class="cr-field"><label>Skill Options</label>' + textField('skillOptions', s.skillOptions, 'Acrobatics, Animal Handling, ...') + '</div>' +
            '</div>' +
            '<div class="cr-grid cr-grid-2" style="margin-top:12px;">' +
              '<div class="cr-field"><label>Saving Throw 1</label>' + selectEl('save0', ABILITIES, s.saves[0] || 'str', ABILITY_LABELS) + '</div>' +
              '<div class="cr-field"><label>Saving Throw 2</label>' + selectEl('save1', ABILITIES, s.saves[1] || 'dex', ABILITY_LABELS) + '</div>' +
            '</div>' +
          '</div>' +

          // 3. Subclass
          '<div class="cr-section">' +
            '<div class="cr-section-label">Subclass</div>' +
            '<div class="cr-grid cr-grid-2">' +
              '<div class="cr-field"><label>Subclass Title</label>' + textField('subclassTitle', s.subclassTitle, 'e.g. Archetype') + '</div>' +
              '<div class="cr-field"><label>Subclass Level</label>' + selectEl('subclassLevel', SUBCLASS_LEVELS, s.subclassLevel) + '</div>' +
              '<div class="cr-field wide"><label>Subclass Names</label>' + textField('subclasses', s.subclasses, 'e.g. Barbarian, Bard, Cleric') + '</div>' +
            '</div>' +
          '</div>' +

          // 4. Level 1 Features
          '<div class="cr-section">' +
            '<div class="cr-section-label">Level 1 Features</div>' +
            '<div data-list="features">' + featureRows + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-feature" style="margin-top:8px;">+ Add Feature</button>' +
          '</div>' +

          // 5. Level Features (2-20)
          '<div class="cr-section">' +
            '<div class="cr-section-label">Level Features (2-20)</div>' +
            '<button type="button" class="cr-btn" data-act="add-standard-asi" style="margin-bottom:12px;">Standard ASIs</button>' +
            '<div data-list="levelFeatures">' + levelFeatureRows + '</div>' +
            '<div class="cr-add-level-row" style="display:flex;gap:8px;align-items:center;margin-top:8px;">' +
              '<select id="cr-add-level-select" class="cr-input" style="width:90px;">' +
                (function(){ var o=''; for(var l=2;l<=20;l++) o+='<option value="'+l+'">Lv '+l+'</option>'; return o; })() +
              '</select>' +
              '<input id="cr-add-level-name" type="text" class="cr-input" placeholder="Feature name (optional)" style="flex:1;min-width:120px;" />' +
              '<button type="button" class="cr-btn" data-act="add-level-feature">+ Add</button>' +
            '</div>' +
          '</div>' +

          // 6. Spellcasting
          '<div class="cr-section">' +
            '<div class="cr-section-label">Spellcasting</div>' +
            '<div class="cr-grid cr-grid-2">' +
              '<div class="cr-field"><label>Spellcasting Ability</label>' + selectEl('spellcastingAbility', SPELL_ABILITIES, s.spellcastingAbility, { '': '—None—', str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' }) + '</div>' +
              '<div class="cr-field"><label>Spell List</label>' + selectEl('spellList', SPELL_LISTS, s.spellList, { '': '—None—', wizard: 'Wizard', bard: 'Bard', cleric: 'Cleric', druid: 'Druid', sorcerer: 'Sorcerer', warlock: 'Warlock', paladin: 'Paladin', ranger: 'Ranger' }) + '</div>' +
              '<div class="cr-field"><label>Slot Archetype</label>' + selectEl('slotArchetype', SLOT_ARCHETYPES, s.slotArchetype, { '': '—None—', wizard: 'Wizard', bard: 'Bard', cleric: 'Cleric', druid: 'Druid', sorcerer: 'Sorcerer', warlock: 'Warlock', paladin: 'Paladin', ranger: 'Ranger' }) + '</div>' +
              '<div class="cr-field"><label class="cr-toggle"><input type="checkbox" data-k="ritualCasting"' + (s.ritualCasting ? ' checked' : '') + ' /> Ritual Casting</label></div>' +
              '<div class="cr-field"><label class="cr-toggle"><input type="checkbox" data-k="hasFocus"' + (s.hasFocus ? ' checked' : '') + ' /> Can use Spellcasting Focus</label></div>' +
            '</div>' +
          '</div>' +

          // 7. Abilities
          '<div class="cr-section">' +
            '<div class="cr-section-label">Limited-Use Abilities</div>' +
            '<div data-list="abilityUses">' + abilityRows + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-ability" style="margin-top:8px;">+ Add Ability</button>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Passive Features</div>' +
            '<div data-list="passiveFeatures">' + passiveRows + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-passive" style="margin-top:8px;">+ Add Passive</button>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Extra Attack</div>' +
            '<div class="cr-grid cr-grid-2">' +
              '<div class="cr-field"><label>At Level</label>' + numField('extraAttackLevel', s.extraAttackLevel, 1, 20) + '</div>' +
              '<div class="cr-field"><label>Total Attacks</label>' + numField('extraAttackTotal', s.extraAttackTotal, 1, 4) + '</div>' +
            '</div>' +
          '</div>' +

          // 8. Equipment
          '<div class="cr-section">' +
            '<div class="cr-section-label">Equipment</div>' +
            '<div class="cr-grid cr-grid-1">' +
              '<div class="cr-field"><label>Equipment Options</label><textarea data-k="equipment" rows="3" placeholder="List equipment starting options...">' + esc(s.equipment) + '</textarea></div>' +
              '<div class="cr-field"><label>Starting Gold</label>' + textField('startingGold', s.startingGold, 'e.g. 5d4 × 10 gp') + '</div>' +
            '</div>' +
          '</div>' +

          // 9. Publishing
          '<div class="cr-section">' +
            '<div class="cr-section-label">Publishing & Sharing</div>' +
            '<div class="cr-field"><label>Add to Campaign</label>' +
              '<select data-k="campaignId"><option value="">— Not attached —</option></select>' +
              '<div class="hint">Players in the selected campaign can view this class.</div>' +
            '</div>' +
            '<div class="cr-field"><label class="cr-toggle"><input type="checkbox" data-k="isPublic"' + (s.isPublic ? ' checked' : '') + ' /> Make public in the community library</label></div>' +
          '</div>' +

        '</div>' +

        '<div class="cr-preview-pane">' +
          '<h2>Live Preview</h2>' +
          renderClassSummary(s) +
        '</div>' +
      '</div>';

    populateCampaignDropdown(s);
    setSyncState('');
  }

  function featureRow(f, idx) {
    return '<div class="cr-trait-row" data-idx="' + idx + '" >' +
      '<input type="text" data-list="features" data-idx="' + idx + '" data-field="name" value="' + escAttr(f.name) + '" placeholder="Feature name" style="margin-bottom:6px;" />' +
      '<textarea data-list="features" data-idx="' + idx + '" data-field="desc" rows="2" placeholder="Description">' + esc(f.desc) + '</textarea>' +
      '<button type="button" class="cr-btn" data-act="remove-feature" data-idx="' + idx + '" style="margin-top:6px;">Remove</button>' +
    '</div>';
  }

  function levelFeatureRow(lv, f, idx) {
    return '<div class="cr-level-feature-row" data-level="' + lv + '" data-idx="' + idx + '" >' +
      '<div style="display:flex;gap:8px;margin-bottom:6px;">' +
        '<div style="flex:0 0 80px;"><strong>Level ' + lv + '</strong></div>' +
        '<input type="text" data-level="' + lv + '" data-idx="' + idx + '" data-field="name" value="' + escAttr(f.name) + '" placeholder="Feature name" style="flex:1;" />' +
        '<label class="cr-toggle" style="flex:0 0 auto;"><input type="checkbox" data-level="' + lv + '" data-idx="' + idx + '" data-field="isASI"' + (f.isASI ? ' checked' : '') + ' /> ASI</label>' +
      '</div>' +
      '<textarea data-level="' + lv + '" data-idx="' + idx + '" data-field="desc" rows="2" placeholder="Description">' + esc(f.desc) + '</textarea>' +
      '<button type="button" class="cr-btn" data-act="remove-level-feature" data-level="' + lv + '" data-idx="' + idx + '" style="margin-top:6px;">Remove</button>' +
    '</div>';
  }

  function abilityRow(a, idx) {
    return '<div class="cr-ability-row" data-idx="' + idx + '" >' +
      '<input type="text" data-list="abilityUses" data-idx="' + idx + '" data-field="name" value="' + escAttr(a.name) + '" placeholder="Ability name" style="margin-bottom:6px;" />' +
      '<div style="display:flex;gap:8px;margin-bottom:6px;">' +
        '<input type="number" data-list="abilityUses" data-idx="' + idx + '" data-field="uses" value="' + (a.uses || 0) + '" placeholder="Uses" min="0" style="flex:0 0 80px;" />' +
        '<select data-list="abilityUses" data-idx="' + idx + '" data-field="recharge" style="flex:0 0 120px;">' +
          '<option value="short_rest"' + (a.recharge === 'short_rest' ? ' selected' : '') + '>Short Rest</option>' +
          '<option value="long_rest"' + (a.recharge === 'long_rest' ? ' selected' : '') + '>Long Rest</option>' +
        '</select>' +
      '</div>' +
      '<textarea data-list="abilityUses" data-idx="' + idx + '" data-field="desc" rows="2" placeholder="How this ability works">' + esc(a.desc) + '</textarea>' +
      '<button type="button" class="cr-btn" data-act="remove-ability" data-idx="' + idx + '" style="margin-top:6px;">Remove</button>' +
    '</div>';
  }

  function passiveRow(p, idx) {
    return '<div class="cr-passive-row" data-idx="' + idx + '" >' +
      '<input type="text" data-list="passiveFeatures" data-idx="' + idx + '" data-field="name" value="' + escAttr(p.name) + '" placeholder="Feature name" style="margin-bottom:6px;" />' +
      '<textarea data-list="passiveFeatures" data-idx="' + idx + '" data-field="desc" rows="2" placeholder="Description">' + esc(p.desc) + '</textarea>' +
      '<button type="button" class="cr-btn" data-act="remove-passive" data-idx="' + idx + '" style="margin-top:6px;">Remove</button>' +
    '</div>';
  }

  // ── Preview ───────────────────────────────────────────────────────
  function renderClassSummary(s) {
    var profBonus = 2;
    var tableHtml = '<table style="width:100%;border-collapse:collapse;font-size:0.9em;">' +
      '<tr style="border-bottom:1px solid var(--border);">' +
        '<th style="padding:4px;text-align:left;">Level</th>' +
        '<th style="padding:4px;text-align:left;">Prof Bonus</th>' +
        '<th style="padding:4px;text-align:left;">Features</th>' +
      '</tr>';

    for (var lv = 1; lv <= 20; lv++) {
      var pb = getProfBonus(lv);
      var pbStr = (pb > 0 ? '+' : '') + pb;
      var features = [];

      if (lv === 1) {
        (s.features || []).forEach(function (f) { if (f.name) features.push(f.name); });
      }
      if (s.levelFeatures && s.levelFeatures[lv]) {
        s.levelFeatures[lv].forEach(function (f) { if (f.name) features.push(f.name); });
      }

      tableHtml += '<tr style="border-bottom:1px solid var(--border-light);">' +
        '<td style="padding:4px;">' + lv + '</td>' +
        '<td style="padding:4px;">' + pbStr + '</td>' +
        '<td style="padding:4px;">' + esc(features.join(', ') || '—') + '</td>' +
      '</tr>';
    }
    tableHtml += '</table>';

    var savesStr = (s.saves || []).map(function (ab) { return ABILITY_LABELS[ab] || ab; }).join(', ');
    var subclassesStr = (s.subclasses || '').split(',').map(function (x) { return x.trim(); }).filter(Boolean).join(', ');

    return '<div class="cr-spellcard">' +
      '<img src="logo.png" alt="Phmurt" class="cr-sc-brand" />' +
      '<div class="cr-sc-name">' + esc(s.name) + '</div>' +
      (s.tags ? '<div class="cr-sc-meta">' + esc(s.tags) + '</div>' : '') +

      '<div class="cr-sc-row"><strong>Hit Die:</strong> d' + s.hitDie + '</div>' +
      (s.armorProf ? '<div class="cr-sc-row"><strong>Armor:</strong> ' + esc(s.armorProf) + '</div>' : '') +
      (s.weaponProf ? '<div class="cr-sc-row"><strong>Weapons:</strong> ' + esc(s.weaponProf) + '</div>' : '') +
      (s.toolProf ? '<div class="cr-sc-row"><strong>Tools:</strong> ' + esc(s.toolProf) + '</div>' : '') +

      (savesStr ? '<div class="cr-sc-row"><strong>Saving Throws:</strong> ' + savesStr + '</div>' : '') +
      '<div class="cr-sc-row"><strong>Primary Ability:</strong> ' + (ABILITY_LABELS[s.primaryAbility] || s.primaryAbility) + '</div>' +
      '<div class="cr-sc-row"><strong>Skills:</strong> Choose ' + s.skillCount + '</div>' +

      (s.subclassTitle && subclassesStr ? '<div class="cr-sc-body"><strong>' + esc(s.subclassTitle) + 's</strong> (at level ' + s.subclassLevel + ')<br>' + esc(subclassesStr) + '</div>' : '') +

      ((s.features && s.features.length) || (s.levelFeatures && Object.keys(s.levelFeatures).length) ? '<div class="cr-sc-body"><strong>Features</strong><br>' + renderFeaturesList(s) + '</div>' : '') +

      (s.spellcastingAbility ? '<div class="cr-sc-body"><strong>Spellcasting</strong><br>Ability: ' + (ABILITY_LABELS[s.spellcastingAbility] || s.spellcastingAbility) + '<br>' +
        (s.spellList ? 'List: ' + s.spellList : '') + '<br>' +
        (s.ritualCasting ? 'Can cast rituals' : '') +
        '</div>' : '') +

      '<div class="cr-sc-body"><strong>Class Table</strong>' + tableHtml + '</div>' +
    '</div>';
  }

  function renderFeaturesList(s) {
    var list = [];
    if (s.features) {
      s.features.forEach(function (f) {
        if (f.name) list.push('<strong>Level 1:</strong> ' + esc(f.name));
      });
    }
    for (var lv = 2; lv <= 20; lv++) {
      if (s.levelFeatures && s.levelFeatures[lv]) {
        s.levelFeatures[lv].forEach(function (f) {
          if (f.name) {
            var suffix = f.isASI ? ' (ASI)' : '';
            list.push('<strong>Level ' + lv + ':</strong> ' + esc(f.name) + suffix);
          }
        });
      }
    }
    return list.join('<br>');
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
    var list = t.getAttribute('data-list');
    var level = t.getAttribute('data-level');
    var idx = parseInt(t.getAttribute('data-idx'), 10);
    var field = t.getAttribute('data-field');

    if (k) {
      if (t.type === 'checkbox') state.current[k] = t.checked;
      else if (t.type === 'number') state.current[k] = parseInt(t.value, 10) || 0;
      else state.current[k] = t.value;
    } else if (list === 'features' && field) {
      if (!isNaN(idx)) {
        if (t.type === 'checkbox') state.current.features[idx][field] = t.checked;
        else state.current.features[idx][field] = t.value;
      }
    } else if (list === 'abilityUses' && field) {
      if (!isNaN(idx)) {
        if (t.type === 'number') state.current.abilityUses[idx][field] = parseInt(t.value, 10) || 0;
        else state.current.abilityUses[idx][field] = t.value;
      }
    } else if (list === 'passiveFeatures' && field) {
      if (!isNaN(idx)) {
        state.current.passiveFeatures[idx][field] = t.value;
      }
    } else if (level && field) {
      var lv = parseInt(level, 10);
      if (!state.current.levelFeatures[lv]) state.current.levelFeatures[lv] = [];
      if (t.type === 'checkbox') state.current.levelFeatures[lv][idx][field] = t.checked;
      else if (t.type === 'number') state.current.levelFeatures[lv][idx][field] = parseInt(t.value, 10) || 0;
      else state.current.levelFeatures[lv][idx][field] = t.value;
    }

    // Handle select for saves
    if (k === 'save0') state.current.saves[0] = t.value;
    if (k === 'save1') state.current.saves[1] = t.value;

    render();
    cloudSync();
  }

  function onClick(e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var act = t.getAttribute('data-act');

    if (act === 'close') return close();
    if (act === 'save') return save();
    if (act === 'delete') return del();
    if (act === 'add-feature') { state.current.features.push({ name:'', desc:'' }); render(); return; }
    if (act === 'remove-feature') {
      var idx = parseInt(t.getAttribute('data-idx'), 10);
      state.current.features.splice(idx, 1); render(); return;
    }
    if (act === 'add-level-feature') {
      var lvEl = document.getElementById('cr-add-level-select');
      var nameEl = document.getElementById('cr-add-level-name');
      var lv = lvEl ? parseInt(lvEl.value, 10) || 2 : 2;
      if (lv < 2 || lv > 20) lv = 2;
      var featureName = (nameEl && nameEl.value.trim()) ? nameEl.value.trim() : '';
      if (!state.current.levelFeatures[lv]) state.current.levelFeatures[lv] = [];
      state.current.levelFeatures[lv].push({ name:featureName, desc:'', isASI:false });
      if (nameEl) nameEl.value = '';
      render(); return;
    }
    if (act === 'add-standard-asi') {
      [4, 8, 12, 16, 19].forEach(function (asiLv) {
        if (!state.current.levelFeatures[asiLv]) state.current.levelFeatures[asiLv] = [];
        if (!state.current.levelFeatures[asiLv].some(function(f){return f.isASI;})) {
          state.current.levelFeatures[asiLv].push({ name:'Ability Score Improvement', desc:'', isASI:true });
        }
      });
      render(); return;
    }
    if (act === 'remove-level-feature') {
      var lv = parseInt(t.getAttribute('data-level'), 10);
      var idx = parseInt(t.getAttribute('data-idx'), 10);
      if (state.current.levelFeatures[lv]) {
        state.current.levelFeatures[lv].splice(idx, 1);
        if (state.current.levelFeatures[lv].length === 0) delete state.current.levelFeatures[lv];
      }
      render(); return;
    }
    if (act === 'add-ability') {
      state.current.abilityUses.push({ name:'', uses:0, recharge:'long_rest', desc:'' }); render(); return;
    }
    if (act === 'remove-ability') {
      var idx = parseInt(t.getAttribute('data-idx'), 10);
      state.current.abilityUses.splice(idx, 1); render(); return;
    }
    if (act === 'add-passive') {
      state.current.passiveFeatures.push({ name:'', desc:'' }); render(); return;
    }
    if (act === 'remove-passive') {
      var idx = parseInt(t.getAttribute('data-idx'), 10);
      state.current.passiveFeatures.splice(idx, 1); render(); return;
    }
  }

  function onKeydown(e) {
    if (e.key !== 'Escape') return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (['input','textarea','select'].indexOf(tag) !== -1) return;
    close();
  }

  // ── Save / delete ────────────────────────────────────────────────
  function save() {
    if (!state.current.name || !state.current.name.trim()) {
      if (U.showToast) U.showToast('Error', 'Name is required');
      else alert('Name is required');
      return;
    }
    if (!state.current.clientId) state.current.clientId = generateClientId();
    var list = loadAll();
    var existingIdx = list.findIndex(function (c) { return c.clientId === state.current.clientId; });
    if (existingIdx >= 0) list[existingIdx] = state.current;
    else list.push(state.current);
    saveAll(list);
    if (global._homebrewClasses) global._homebrewClasses = list;
    if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
    cloudSync();
    close();
  }

  function del() {
    var doDelete = function() {
      var list = loadAll().filter(function (c) { return c.clientId !== state.current.clientId; });
      saveAll(list);
      if (global._homebrewClasses) global._homebrewClasses = list;
      if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
      close();
    };
    if (U.showConfirm) U.showConfirm('Delete this class? This cannot be undone.', doDelete);
    else if (confirm('Delete this class?')) doDelete();
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
  function openClass(editId) {
    var root = document.getElementById('creator-root'); if (!root) return;
    var list = loadAll();
    var existing = editId ? list.find(function (c) { return c.clientId === editId || c.id === editId; }) : null;
    state.current = existing ? Object.assign(defaultClass(), existing) : defaultClass();
    state.editId = editId || null;
    root.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    render();
    wireEvents();
    try { history.replaceState({}, '', location.pathname + '?create=class' + (editId ? '&id=' + editId : '')); } catch (e) {}
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
      if (q.get('create') === 'class') openClass(q.get('id') || null);
    } catch (e) {}
  }

  // ── Export API ────────────────────────────────────────────────────
  global.PhmurtClassCreator = { openClass: openClass, close: close };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', maybeAutoOpen);
  } else {
    maybeAutoOpen();
  }
})(window);
