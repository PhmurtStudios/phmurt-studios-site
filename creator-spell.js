/* ═══════════════════════════════════════════════════════════════════
   SPELL CREATOR — Split-pane form + live preview
   ═══════════════════════════════════════════════════════════════════
   Pilot implementation of the new homebrew creator pattern. Pattern
   will be replicated across the other 8 entity types (race, class,
   background, subclass, feat, item, monster, encounter) once
   validated.

   Integration:
     - Reads/writes the same localStorage key (`phmurt_homebrew_spells`)
       that the legacy modal uses — zero data migration required.
     - Syncs to Supabase `homebrew_content` for logged-in users.
     - Replaces `openSpellCreatorModal()` by attaching a new global
       `PhmurtCreator.openSpell(editId)` that compendium.html routes to.
     - Old modal code remains as a fallback if this file fails to load.
   ═══════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  // ── Config ────────────────────────────────────────────────────────
  var SPELL_KEY     = 'phmurt_homebrew_spells';
  var SYNC_DEBOUNCE = 700;   // ms between user change and save
  var CLOUD_TABLE   = 'homebrew_content';

  var SCHOOLS       = ['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'];
  var CAST_TIMES    = ['1 action','1 bonus action','1 reaction','1 minute','10 minutes','1 hour','8 hours'];
  var RANGES        = ['Self','Touch','5 feet','30 feet','60 feet','90 feet','120 feet','150 feet','300 feet','500 feet','1 mile','Sight','Unlimited'];
  var DURATIONS     = ['Instantaneous','1 round','1 minute','10 minutes','1 hour','8 hours','24 hours','Until dispelled','Special','Concentration, up to 1 minute','Concentration, up to 10 minutes','Concentration, up to 1 hour','Concentration, up to 8 hours'];
  var CLASSES       = ['Bard','Cleric','Druid','Paladin','Ranger','Sorcerer','Warlock','Wizard','Artificer'];
  var DAMAGE_TYPES  = ['Acid','Bludgeoning','Cold','Fire','Force','Lightning','Necrotic','Piercing','Poison','Psychic','Radiant','Slashing','Thunder'];

  // ── State ─────────────────────────────────────────────────────────
  var state = {
    id: null,              // client_id (e.g. "sp-fireball")
    mode: 'create',
    spell: defaultSpell(),
    original: null,        // snapshot for dirty check
    saveTimer: null,
    syncStatus: 'idle',    // idle | dirty | saving | saved | error
    cloudRowId: null       // Supabase row id if synced
  };

  function defaultSpell() {
    return {
      name: '',
      level: 1,
      school: 'Evocation',
      castingTime: '1 action',
      range: '60 feet',
      duration: 'Instantaneous',
      components: ['V','S'],
      materialComponent: '',
      description: '',
      atHigherLevels: '',
      ritual: false,
      concentration: false,
      damageType: '',
      damage: '',
      classes: [],
      saveAbility: '',     // NEW: STR/DEX/CON/INT/WIS/CHA for save-based spells
      attackType: '',      // NEW: 'melee' | 'ranged' | '' (spell attack roll)
      tags: [],            // NEW: user-defined tags for browse filters
      created: null,
      updated: null
    };
  }

  // ── Utility: escape HTML ──────────────────────────────────────────
  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }
  function escAttr(s) { return esc(s); }

  // ── Minimal markdown → HTML (safe subset) ─────────────────────────
  // Supports: **bold**, *italic*, `code`, - lists, 1. lists, --- hr,
  // > blockquote, basic paragraphs. Output is html-escaped first.
  function renderMarkdown(md) {
    if (!md) return '';
    var html = esc(md);

    // Code spans first
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Bold + italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    // Horizontal rule
    html = html.replace(/^\s*---\s*$/gm, '<hr/>');

    // Lists: group consecutive - or 1. lines
    var lines = html.split('\n');
    var out = [];
    var listType = null;
    var para = [];
    function flushPara() {
      if (para.length) {
        out.push('<p>' + para.join(' ') + '</p>');
        para = [];
      }
    }
    function flushList() {
      if (listType) { out.push('</' + listType + '>'); listType = null; }
    }
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      var ulM = /^\s*[-*]\s+(.*)$/.exec(ln);
      var olM = /^\s*\d+\.\s+(.*)$/.exec(ln);
      var bqM = /^&gt;\s?(.*)$/.exec(ln);

      if (ulM) {
        flushPara();
        if (listType !== 'ul') { flushList(); out.push('<ul>'); listType = 'ul'; }
        out.push('<li>' + ulM[1] + '</li>');
      } else if (olM) {
        flushPara();
        if (listType !== 'ol') { flushList(); out.push('<ol>'); listType = 'ol'; }
        out.push('<li>' + olM[1] + '</li>');
      } else if (bqM) {
        flushPara(); flushList();
        out.push('<blockquote>' + bqM[1] + '</blockquote>');
      } else if (/^\s*$/.test(ln)) {
        flushPara(); flushList();
      } else if (ln === '<hr/>') {
        flushPara(); flushList();
        out.push(ln);
      } else {
        flushList();
        para.push(ln);
      }
    }
    flushPara(); flushList();
    return out.join('\n');
  }

  // ── Auto-calc helpers ─────────────────────────────────────────────
  var UTIL = global.PhmurtCreatorUtil || {};
  function saveDCHint(spell) {
    if (!spell.saveAbility) return '';
    return 'Save DC = 8 + proficiency + spellcasting modifier — target makes a ' +
           spell.saveAbility + ' saving throw (resolves per caster).';
  }
  function attackHint(spell) {
    if (!spell.attackType) return '';
    var t = /melee/i.test(spell.attackType) ? 'melee' : 'ranged';
    return 'Attack bonus = proficiency + spellcasting modifier — make a ' + t +
           ' spell attack.' + (spell.damage ? ' On hit: ' + spell.damage +
             (spell.damageType ? ' ' + String(spell.damageType).toLowerCase() : '') + ' damage.' : '');
  }
  function damageHint(spell) {
    if (!spell.damage) return '';
    if (!UTIL.damageSummary) return '';
    var s = UTIL.damageSummary(spell.damage, spell.level, spell.atHigherLevels || '');
    return s || '';
  }
  function scalingHint(spell) {
    if (spell.level === 0) {
      return 'Cantrips typically gain one additional damage die at character levels 5, 11, and 17. ' +
             'Describe your cantrip\'s scaling in the "At Higher Levels" box.';
    }
    return '';
  }

  // ── Localstorage ──────────────────────────────────────────────────
  function loadLocal() {
    try {
      var raw = localStorage.getItem(SPELL_KEY);
      return raw ? (JSON.parse(raw) || {}) : {};
    } catch (e) { return {}; }
  }
  function saveLocal(all) {
    try { localStorage.setItem(SPELL_KEY, JSON.stringify(all)); } catch (e) {}
  }
  function generateClientId(name) {
    var base = 'sp-' + (name || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    var all = loadLocal();
    if (!all[base]) return base;
    var i = 2;
    while (all[base + '-' + i]) i++;
    return base + '-' + i;
  }

  // ── Cloud sync ────────────────────────────────────────────────────
  function getSupabase() {
    // phmurtSupabase is the initialized client created in supabase-config.js.
    // window.supabase is the library namespace (has .createClient but not .from).
    var sb = global.phmurtSupabase;
    if (sb && typeof sb.from === 'function') return sb;
    return null;
  }
  function currentUserId() {
    try {
      if (global.PhmurtDB && typeof global.PhmurtDB.getSession === 'function') {
        var sess = global.PhmurtDB.getSession();
        if (sess && sess.user && sess.user.id) return sess.user.id;
      }
    } catch (e) {}
    return null;
  }
  function cloudSyncSpell(spellData) {
    var sb  = getSupabase();
    var uid = currentUserId();
    if (!sb || !uid) return Promise.resolve({ skipped: true });
    spellData._authorName = U.getAuthorName ? U.getAuthorName() : 'Anonymous';
    var row = {
      user_id:   uid,
      type:      'spell',
      client_id: state.id,
      data:      spellData,
      is_public: false
    };
    return sb.from(CLOUD_TABLE)
      .upsert(row, { onConflict: 'user_id,type,client_id' })
      .select('id')
      .single()
      .then(function (r) {
        if (r.error) throw r.error;
        state.cloudRowId = r.data && r.data.id;
        return { synced: true };
      });
  }

  // ── Render ────────────────────────────────────────────────────────
  function render() {
    var root = document.getElementById('creator-root');
    if (!root) return;

    var s = state.spell;
    var srdOpts = buildSrdTemplateOptions();

    root.innerHTML =
      '<div class="cr-topbar">' +
        '<button class="cr-back" onclick="PhmurtCreator.close()">&larr; Back to Compendium</button>' +
        '<div class="cr-title">' +
          '<div class="cr-eyebrow">The Workshop</div>' +
          '<div class="cr-heading">' + (state.mode === 'edit' ? 'Edit Spell' : 'Create Spell') +
            (s.name ? ' &mdash; <span style="color:var(--text-muted);font-weight:normal;">' + esc(s.name) + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="cr-sync-indicator" id="cr-sync">idle</div>' +
        '<div class="cr-actions">' +
          '<button class="cr-btn" onclick="PhmurtCreator.importJson()">Import</button>' +
          '<button class="cr-btn" onclick="PhmurtCreator.exportJson()">Export</button>' +
          (state.mode === 'edit' ? '<button class="cr-btn danger" onclick="PhmurtCreator.deleteSpell()">Delete</button>' : '') +
          '<button class="cr-btn primary" onclick="PhmurtCreator.saveNow()">Save</button>' +
        '</div>' +
      '</div>' +

      '<div class="cr-split">' +
        '<section class="cr-form-pane">' +
          '<div class="cr-template-row">' +
            '<label>Start from SRD</label>' +
            '<select id="cr-template-sel">' + srdOpts + '</select>' +
            '<button type="button" onclick="PhmurtCreator.applyTemplate()">Apply</button>' +
          '</div>' +

          '<div id="cr-error-host"></div>' +

          // Basics
          '<div class="cr-section">' +
            '<div class="cr-section-label">Basics</div>' +
            '<div class="cr-grid cr-grid-2">' +
              field('Spell Name', '<input type="text" data-k="name" value="' + escAttr(s.name) + '" placeholder="e.g. Sun Strike" />', true) +
              field('Level', '<select data-k="level">' +
                [0,1,2,3,4,5,6,7,8,9].map(function (n) {
                  return '<option value="' + n + '"' + (s.level === n ? ' selected' : '') + '>' + (n === 0 ? 'Cantrip' : 'Level ' + n) + '</option>';
                }).join('') + '</select>', true) +
              field('School', selectEl('school', SCHOOLS, s.school), true) +
              field('Casting Time', comboEl('castingTime', CAST_TIMES, s.castingTime), true) +
              field('Range', comboEl('range', RANGES, s.range), true) +
              field('Duration', comboEl('duration', DURATIONS, s.duration), true) +
            '</div>' +
          '</div>' +

          // Components
          '<div class="cr-section">' +
            '<div class="cr-section-label">Components</div>' +
            '<div class="cr-chips" style="margin-bottom:8px;">' +
              chipBox('components', 'V', 'Verbal', s.components.indexOf('V') !== -1) +
              chipBox('components', 'S', 'Somatic', s.components.indexOf('S') !== -1) +
              chipBox('components', 'M', 'Material', s.components.indexOf('M') !== -1) +
            '</div>' +
            '<div class="cr-field" id="cr-material-wrap" style="' + (s.components.indexOf('M') !== -1 ? '' : 'display:none;') + '">' +
              '<label>Material Components</label>' +
              '<input type="text" data-k="materialComponent" value="' + escAttr(s.materialComponent) + '" placeholder="e.g. a pinch of bat guano and sulfur" />' +
            '</div>' +
          '</div>' +

          // Mechanics (attack/save/damage)
          '<div class="cr-section">' +
            '<div class="cr-section-label">Mechanics <span class="hint">leave blank for non-damage/non-save spells</span></div>' +
            '<div class="cr-grid cr-grid-2">' +
              field('Attack Roll', selectEl('attackType', ['','melee','ranged'], s.attackType, { '': 'None', 'melee': 'Melee Spell Attack', 'ranged': 'Ranged Spell Attack' })) +
              field('Saving Throw', selectEl('saveAbility', ['','STR','DEX','CON','INT','WIS','CHA'], s.saveAbility, { '': 'None' })) +
              field('Damage Type', selectEl('damageType', [''].concat(DAMAGE_TYPES), s.damageType, { '': 'None' })) +
              field('Damage / Healing Dice', '<input type="text" data-k="damage" value="' + escAttr(s.damage) + '" placeholder="e.g. 8d6, 2d4+2" />') +
            '</div>' +
            (s.damage      ? '<div class="cr-autocalc">' + damageHint(s) + '</div>' : '') +
            (s.saveAbility ? '<div class="cr-autocalc">' + saveDCHint(s) + '</div>' : '') +
            (s.attackType  ? '<div class="cr-autocalc">' + attackHint(s) + '</div>' : '') +
            (s.level === 0 ? '<div class="cr-autocalc">' + scalingHint(s) + '</div>' : '') +
          '</div>' +

          // Flags
          '<div class="cr-section">' +
            '<div class="cr-section-label">Flags</div>' +
            '<div class="cr-toggles">' +
              toggleEl('ritual',        'Ritual',       s.ritual) +
              toggleEl('concentration', 'Concentration', s.concentration) +
            '</div>' +
          '</div>' +

          // Description (markdown)
          '<div class="cr-section">' +
            '<div class="cr-section-label">Description <span class="hint">**bold**, *italic*, `code`, - lists, --- rule</span></div>' +
            '<div class="cr-field wide">' +
              '<textarea data-k="description" rows="8" placeholder="On a hit, the target takes 2d6 fire damage...">' + esc(s.description) + '</textarea>' +
            '</div>' +
          '</div>' +

          // At higher levels
          '<div class="cr-section">' +
            '<div class="cr-section-label">Upcasting / Scaling</div>' +
            '<div class="cr-field wide">' +
              '<label>' + (s.level === 0 ? 'Cantrip Scaling' : 'At Higher Levels') + '</label>' +
              '<textarea data-k="atHigherLevels" rows="3" placeholder="' +
                (s.level === 0
                  ? 'This spell\'s damage increases by 1d6 when you reach 5th level...'
                  : 'When you cast this spell using a spell slot of 4th level or higher, the damage increases by 1d6 for each slot level above 3rd.') +
                '">' + esc(s.atHigherLevels) + '</textarea>' +
            '</div>' +
          '</div>' +

          // Classes
          '<div class="cr-section">' +
            '<details' + (s.classes.length ? ' open' : '') + '>' +
              '<summary>Available to Classes (' + (s.classes.length || 'none') + ')</summary>' +
              '<div class="cr-chips" style="margin-top:10px;">' +
                CLASSES.map(function (c) {
                  return chipBox('classes', c, c, s.classes.indexOf(c) !== -1);
                }).join('') +
              '</div>' +
            '</details>' +
          '</div>' +

          // Tags
          '<div class="cr-section">' +
            '<details' + (s.tags.length ? ' open' : '') + '>' +
              '<summary>Tags (' + (s.tags.length || 'none') + ')</summary>' +
              '<div class="cr-field wide" style="margin-top:10px;">' +
                '<label>Comma-separated</label>' +
                '<input type="text" data-k="tags" value="' + escAttr(s.tags.join(', ')) + '" placeholder="blast, control, battlefield" />' +
                '<div class="hint">Used by the community browser for filtering.</div>' +
              '</div>' +
            '</details>' +
          '</div>' +

        '</section>' +

        '<section class="cr-preview-pane">' +
          '<h2>Preview</h2>' +
          '<div id="cr-preview">' + renderSpellCard(s) + '</div>' +
        '</section>' +
      '</div>';

    wireEvents();
    updateSyncBadge();
  }

  // Helpers used in render
  function field(label, inner, req) {
    return '<div class="cr-field">' +
      '<label>' + esc(label) + (req ? '<span class="req">*</span>' : '') + '</label>' +
      inner +
    '</div>';
  }
  function selectEl(key, vals, current, displayMap) {
    displayMap = displayMap || {};
    return '<select data-k="' + key + '">' +
      vals.map(function (v) {
        var disp = displayMap[v] != null ? displayMap[v] : (v || '(none)');
        return '<option value="' + escAttr(v) + '"' + (current === v ? ' selected' : '') + '>' + esc(disp) + '</option>';
      }).join('') + '</select>';
  }
  function comboEl(key, vals, current) {
    // Free-text input backed by a datalist (lets user pick from suggestions OR type their own)
    var listId = 'cr-dl-' + key;
    return '<input type="text" data-k="' + key + '" list="' + listId + '" value="' + escAttr(current) + '" />' +
      '<datalist id="' + listId + '">' +
      vals.map(function (v) { return '<option value="' + escAttr(v) + '"></option>'; }).join('') +
      '</datalist>';
  }
  function chipBox(key, val, label, checked) {
    return '<label class="cr-chip">' +
      '<input type="checkbox" data-k="' + key + '" data-val="' + escAttr(val) + '"' + (checked ? ' checked' : '') + ' />' +
      esc(label) +
    '</label>';
  }
  function toggleEl(key, label, checked) {
    return '<label class="cr-toggle">' +
      '<input type="checkbox" data-k="' + key + '"' + (checked ? ' checked' : '') + ' />' +
      esc(label) +
    '</label>';
  }

  // ── Live preview ──────────────────────────────────────────────────
  function renderSpellCard(s) {
    var comps = s.components.slice().sort().join(', ') || 'None';
    if (s.components.indexOf('M') !== -1 && s.materialComponent) {
      comps += ' (' + esc(s.materialComponent) + ')';
    }
    var levelTxt = s.level === 0 ? 'Cantrip' : 'Level ' + s.level;
    var meta = levelTxt + ' ' + s.school.toLowerCase();
    if (s.ritual)         meta += ' (ritual)';

    var duration = s.duration || '—';
    if (s.concentration && duration.toLowerCase().indexOf('concentration') === -1) {
      duration = 'Concentration, ' + duration.toLowerCase();
    }

    var tags = [];
    if (s.classes.length) s.classes.forEach(function (c) { tags.push(c); });
    if (s.tags.length)    s.tags.forEach(function (t) { tags.push('#' + t); });

    var body = renderMarkdown(s.description) || '<p><em>No description yet. Add one on the left.</em></p>';

    // Append auto-attack/save line to body if set
    var extras = [];
    if (s.attackType)  extras.push(attackHint(s));
    if (s.saveAbility && !s.attackType) extras.push(saveDCHint(s));
    if (s.damage && !s.attackType && !s.saveAbility) {
      extras.push('The target takes ' + esc(s.damage) +
        (s.damageType ? ' ' + esc(s.damageType.toLowerCase()) : '') + ' damage.');
    }
    if (extras.length) body += '<p><em>' + extras.join(' ') + '</em></p>';

    var html =
      '<div class="cr-spellcard">' +
        '<div class="cr-sc-name">' + (esc(s.name) || '<span style="color:var(--text-faint);font-style:italic;">Untitled Spell</span>') + '</div>' +
        '<div class="cr-sc-meta">' + esc(meta) + '</div>' +
        '<div class="cr-sc-row"><strong>Casting Time</strong><span>' + esc(s.castingTime) + (s.ritual ? ' (or ritual)' : '') + '</span></div>' +
        '<div class="cr-sc-row"><strong>Range</strong><span>' + esc(s.range) + '</span></div>' +
        '<div class="cr-sc-row"><strong>Components</strong><span>' + comps + '</span></div>' +
        '<div class="cr-sc-row"><strong>Duration</strong><span>' + esc(duration) + '</span></div>' +
        '<div class="cr-sc-body">' + body + '</div>' +
        (s.atHigherLevels
          ? '<div class="cr-sc-higher"><strong>' + (s.level === 0 ? 'Cantrip Scaling' : 'At Higher Levels') + '</strong>' + renderMarkdown(s.atHigherLevels) + '</div>'
          : '') +
        (tags.length
          ? '<div class="cr-sc-tags">' + tags.map(function (t) { return '<span class="cr-sc-tag">' + esc(t) + '</span>'; }).join('') + '</div>'
          : '') +
      '</div>';
    return html;
  }

  function updatePreview() {
    var el = document.getElementById('cr-preview');
    if (el) el.innerHTML = renderSpellCard(state.spell);
    var heading = document.querySelector('.cr-heading');
    if (heading && state.spell.name) {
      heading.innerHTML = (state.mode === 'edit' ? 'Edit Spell' : 'Create Spell') +
        ' &mdash; <span style="color:var(--text-muted);font-weight:normal;">' + esc(state.spell.name) + '</span>';
    }
  }

  function updateAutoCalc() {
    // Re-render the Mechanics section's autocalc blocks when relevant fields change.
    // Cheap + correct: re-render the whole form. But re-rendering loses focus.
    // Instead: surgically update the preview + material visibility.
    var mat = document.getElementById('cr-material-wrap');
    if (mat) mat.style.display = state.spell.components.indexOf('M') !== -1 ? '' : 'none';
  }

  // ── Events ────────────────────────────────────────────────────────
  function wireEvents() {
    var root = document.getElementById('creator-root');
    if (!root) return;

    root.addEventListener('input', function (e) {
      var t = e.target;
      var k = t.getAttribute('data-k');
      if (!k) return;
      commitField(t, k);
      scheduleSave();
      updatePreview();
      updateAutoCalc();
    });
    root.addEventListener('change', function (e) {
      var t = e.target;
      var k = t.getAttribute('data-k');
      if (!k) return;
      commitField(t, k);
      scheduleSave();
      updatePreview();
      updateAutoCalc();
    });

    // Esc to go back
    document.addEventListener('keydown', escHandler);
  }
  function escHandler(e) {
    if (e.key === 'Escape' && !document.getElementById('creator-root').hasAttribute('hidden')) {
      // Don't close if user is actively typing in an input / textarea
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      close();
    }
  }

  function commitField(el, key) {
    var s = state.spell;
    if (el.type === 'checkbox') {
      // Array-of-values checkboxes (components, classes)
      if (key === 'components' || key === 'classes') {
        var v = el.getAttribute('data-val');
        var arr = s[key];
        var idx = arr.indexOf(v);
        if (el.checked && idx === -1) arr.push(v);
        if (!el.checked && idx !== -1) arr.splice(idx, 1);
      } else {
        // Plain boolean (ritual, concentration)
        s[key] = el.checked;
      }
    } else if (key === 'tags') {
      s.tags = el.value.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    } else if (key === 'level') {
      s.level = parseInt(el.value, 10) || 0;
    } else {
      s[key] = el.value;
    }
  }

  // ── Save pipeline ─────────────────────────────────────────────────
  function scheduleSave() {
    setSyncStatus('dirty');
    if (state.saveTimer) clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(function () { commitSave(false); }, SYNC_DEBOUNCE);
  }

  function validate() {
    var s = state.spell;
    if (!s.name || !s.name.trim()) return 'Spell name is required.';
    if (s.level < 0 || s.level > 9) return 'Level must be 0–9.';
    if (!s.description || !s.description.trim()) return 'Description is required.';
    if (s.components.indexOf('M') !== -1 && !s.materialComponent.trim()) {
      // not strictly required by SRD but flag as warning
    }
    return null;
  }

  function commitSave(userTriggered) {
    var err = validate();
    if (err) {
      if (userTriggered) showError(err);
      setSyncStatus('error');
      return;
    }
    showError(null);

    var s = state.spell;
    var all = loadLocal();

    if (!state.id) state.id = generateClientId(s.name);
    s.updated = new Date().toISOString();
    if (!s.created) s.created = all[state.id] && all[state.id].created || s.updated;
    s.id = state.id;

    all[state.id] = JSON.parse(JSON.stringify(s));
    saveLocal(all);

    // Sync in-memory spell registry used by compendium render
    if (global._homebrewSpells) {
      global._homebrewSpells[state.id] = all[state.id];
    }
    if (global.cmpRenderContent) { try { global.cmpRenderContent(); } catch (e) {} }
    if (global.cmpRefreshMineCount) { try { global.cmpRefreshMineCount(); } catch (e) {} }

    setSyncStatus('saving');
    cloudSyncSpell(all[state.id])
      .then(function (r) {
        setSyncStatus(r.skipped ? 'saved-local' : 'saved');
      })
      .catch(function (e) {
        console.warn('[creator] cloud sync failed', e);
        setSyncStatus('cloud-error');
      });

    if (userTriggered && global.showRestToast) {
      try { global.showRestToast('Spell Saved', 'Your spell "' + s.name + '" has been saved.'); } catch (e) {}
    }
  }

  function showError(msg) {
    var host = document.getElementById('cr-error-host');
    if (!host) return;
    host.innerHTML = msg ? '<div class="cr-error">' + esc(msg) + '</div>' : '';
  }

  function setSyncStatus(status) {
    state.syncStatus = status;
    updateSyncBadge();
  }
  function updateSyncBadge() {
    var el = document.getElementById('cr-sync');
    if (!el) return;
    var map = {
      'idle':         { text: 'ready',       cls: '' },
      'dirty':        { text: 'editing\u2026',  cls: 'syncing' },
      'saving':       { text: 'saving\u2026',   cls: 'syncing' },
      'saved':        { text: 'saved + synced', cls: 'ok' },
      'saved-local':  { text: 'saved locally', cls: 'ok' },
      'cloud-error':  { text: 'saved locally · cloud failed', cls: 'err' },
      'error':        { text: 'fix errors above', cls: 'err' }
    };
    var m = map[state.syncStatus] || map.idle;
    el.textContent = m.text;
    el.className = 'cr-sync-indicator ' + m.cls;
  }

  // ── Templates (start from SRD) ────────────────────────────────────
  function buildSrdTemplateOptions() {
    var opts = ['<option value="">— choose a spell —</option>'];
    try {
      var descs = (global.DND_DATA && global.DND_DATA.spellDescriptions) || {};
      var names = Object.keys(descs).sort();
      names.forEach(function (n) {
        opts.push('<option value="' + escAttr(n) + '">' + esc(n) + '</option>');
      });
    } catch (e) {}
    return opts.join('');
  }
  function applyTemplate() {
    var sel = document.getElementById('cr-template-sel');
    if (!sel || !sel.value) return;
    var src = (global.DND_DATA && global.DND_DATA.spellDescriptions && global.DND_DATA.spellDescriptions[sel.value]) || null;
    if (!src) return;
    // Prefill fields from SRD template. Leave user's name untouched if they already typed one.
    var s = state.spell;
    if (!s.name) s.name = sel.value + ' (Homebrew)';
    if (src.school)    s.school      = src.school;
    if (src.castTime)  s.castingTime = src.castTime.replace(/\bft\b/, 'feet');
    if (src.range)     s.range       = src.range.replace(/\bft\b/, 'feet');
    if (src.duration)  s.duration    = src.duration;
    if (src.desc && !s.description)  s.description = src.desc;
    render();
  }

  // ── Import / Export JSON ──────────────────────────────────────────
  function exportJson() {
    var blob = new Blob([JSON.stringify(state.spell, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (state.spell.name || 'spell').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.spell.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function importJson() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = function () {
      var file = input.files && input.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        try {
          var parsed = JSON.parse(ev.target.result);
          var merged = Object.assign(defaultSpell(), parsed);
          // Normalize: components/classes must be arrays, level must be int
          if (!Array.isArray(merged.components)) merged.components = ['V','S'];
          if (!Array.isArray(merged.classes))    merged.classes    = [];
          if (!Array.isArray(merged.tags))       merged.tags       = [];
          merged.level = parseInt(merged.level, 10) || 0;
          state.spell = merged;
          state.id = null; // treat as a new entry until saved
          state.mode = 'create';
          render();
          if (global.showRestToast) global.showRestToast('Imported', 'Spell loaded — review and hit Save.');
        } catch (e) {
          if (U.showToast) U.showToast('Import Error', 'Could not parse that JSON file: ' + e.message);
          else alert('Could not parse that JSON file: ' + e.message);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function deleteSpell() {
    if (!state.id) return close();
    var doDelete = function() {
      var all = loadLocal();
      delete all[state.id];
      saveLocal(all);
      if (global._homebrewSpells) delete global._homebrewSpells[state.id];

      var sb  = getSupabase();
      var uid = currentUserId();
      if (sb && uid) {
        sb.from(CLOUD_TABLE).delete()
          .match({ user_id: uid, type: 'spell', client_id: state.id })
          .then(function () {}, function () {});
      }
      if (global.cmpRenderContent)   { try { global.cmpRenderContent(); } catch (e) {} }
      if (global.cmpRefreshMineCount){ try { global.cmpRefreshMineCount(); } catch (e) {} }
      close();
    };
    if (U.showConfirm) U.showConfirm('Delete spell "' + state.spell.name + '"? This cannot be undone.', doDelete);
    else if (confirm('Delete spell "' + state.spell.name + '"? This cannot be undone.')) doDelete();
  }

  // ── Lifecycle ─────────────────────────────────────────────────────
  function openSpell(editId) {
    var all = loadLocal();
    if (editId && all[editId]) {
      state.id       = editId;
      state.mode     = 'edit';
      state.spell    = Object.assign(defaultSpell(), all[editId]);
      // Coerce arrays in case of legacy data
      if (!Array.isArray(state.spell.components)) state.spell.components = ['V','S'];
      if (!Array.isArray(state.spell.classes))    state.spell.classes    = [];
      if (!Array.isArray(state.spell.tags))       state.spell.tags       = [];
    } else {
      state.id    = null;
      state.mode  = 'create';
      state.spell = defaultSpell();
    }
    state.original = JSON.stringify(state.spell);

    var root = document.getElementById('creator-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'creator-root';
      document.body.appendChild(root);
    }
    root.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    render();

    // Update URL without reload for deep-link support
    try {
      var u = new URL(global.location.href);
      u.searchParams.set('create', 'spell');
      if (editId) u.searchParams.set('id', editId); else u.searchParams.delete('id');
      global.history.replaceState({}, '', u.toString());
    } catch (e) {}
  }

  function close() {
    if (state.saveTimer) { clearTimeout(state.saveTimer); state.saveTimer = null; }
    var root = document.getElementById('creator-root');
    if (root) root.setAttribute('hidden', '');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', escHandler);
    try {
      var u = new URL(global.location.href);
      u.searchParams.delete('create');
      u.searchParams.delete('id');
      global.history.replaceState({}, '', u.toString());
    } catch (e) {}
  }

  function saveNow() { commitSave(true); }

  // ── Public API + deep-link auto-open ──────────────────────────────
  var api = {
    openSpell:     openSpell,
    close:         close,
    applyTemplate: applyTemplate,
    saveNow:       saveNow,
    importJson:    importJson,
    exportJson:    exportJson,
    deleteSpell:   deleteSpell
  };
  global.PhmurtCreator = api;

  // Auto-open if landed with ?create=spell in URL
  function maybeAutoOpen() {
    try {
      var u = new URL(global.location.href);
      if (u.searchParams.get('create') === 'spell') {
        openSpell(u.searchParams.get('id') || null);
      }
    } catch (e) {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', maybeAutoOpen);
  } else {
    maybeAutoOpen();
  }
})(window);
