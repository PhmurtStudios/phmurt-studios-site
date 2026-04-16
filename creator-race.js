/* ═══════════════════════════════════════════════════════════════════
   RACE CREATOR — Split-pane form + live preview
   ═══════════════════════════════════════════════════════════════════
   Homebrew race creator with stat-block preview. Uses shared creator.css
   + PhmurtCreatorUtil. Data syncs to localStorage + Supabase.
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var KEY           = 'phmurt_homebrew_entities_race';
  var SYNC_DEBOUNCE = 700;
  var CLOUD_TABLE   = 'homebrew_content';
  var U             = global.PhmurtCreatorUtil || {};

  var SIZES         = ['Tiny','Small','Medium','Large','Huge','Gargantuan'];
  var DARKVISION    = ['None','30 ft','60 ft','120 ft'];
  var ABS           = ['STR','DEX','CON','INT','WIS','CHA'];
  var RESISTANCES   = ['Fire','Cold','Lightning','Poison','Necrotic','Radiant','Thunder','Acid'];

  function defaultRace() {
    return {
      type: 'race',
      clientId: null,
      name: 'New Race',
      size: 'Medium',
      tags: '',
      speed: 30,
      flySpeed: 0,
      swimSpeed: 0,
      darkvision: 'None',
      languages: 'Common',
      asi: {},  // e.g. { STR: 2, CON: 1 }
      resistances: [],
      weaponProf: '',
      toolProf: '',
      innateCantrip: '',
      traits: [{ name: '', desc: '' }],
      subraces: [],
      campaignId: null,
      isPublic: false
    };
  }

  var state = { current: null, saveTimer: null, editId: null };

  // ── Persistence ───────────────────────────────────────────────────
  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function saveAll(all) { localStorage.setItem(KEY, JSON.stringify(all)); }
  function generateClientId() { return 'rc_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8); }

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
      type: 'race',
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

  function selectEl(key, opts, cur) {
    var html = '<select data-k="' + key + '">';
    opts.forEach(function (o) {
      html += '<option value="' + escAttr(o) + '"' + (String(cur) === String(o) ? ' selected' : '') + '>' + esc(o) + '</option>';
    });
    return html + '</select>';
  }
  function numField(key, cur, min) {
    return '<input type="number" data-k="' + key + '" value="' + escAttr(cur) + '"' + (min != null ? ' min="' + min + '"' : '') + ' />';
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

    var asiBlocks = ABS.map(function (a) {
      var cur = (s.asi && s.asi[a]) || 0;
      return '<div class="cr-field"><label>' + a + '</label>' +
             '<select data-asi="' + a + '"><option value="0">+0</option><option value="1"' + (cur === 1 ? ' selected' : '') + '>+1</option><option value="2"' + (cur === 2 ? ' selected' : '') + '>+2</option></select>' +
             '</div>';
    }).join('');

    var resistanceRow = RESISTANCES.map(function (r) {
      return chip('resistances', r, r, (s.resistances || []).indexOf(r) !== -1);
    }).join('');

    var traitsBlock = (s.traits || []).map(function (t, i) { return traitRow('traits', t, i); }).join('');
    var subracesBlock = (s.subraces || []).map(function (sr, i) { return subraceRow(sr, i); }).join('');

    root.innerHTML =
      '<div class="cr-topbar">' +
        '<button class="cr-back" type="button" data-act="close">◂ Back</button>' +
        '<div class="cr-title">' +
          '<div class="cr-eyebrow">Homebrew · Race</div>' +
          '<div class="cr-heading">' + esc(s.name || 'New Race') + '</div>' +
        '</div>' +
        '<div class="cr-sync-indicator">—</div>' +
        '<div class="cr-actions">' +
          '<button class="cr-btn" data-act="export">Export</button>' +
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
              '<div class="cr-field wide"><label>Name <span class="req">*</span></label>' + textField('name', s.name, 'e.g. Elf') + '</div>' +
              '<div class="cr-field"><label>Size</label>' + selectEl('size', SIZES, s.size) + '</div>' +
              '<div class="cr-field wide"><label>Tags</label>' + textField('tags', s.tags, 'humanoid, fey, etc.') + '</div>' +
            '</div>' +
          '</div>' +

          // Movement & Senses
          '<div class="cr-section">' +
            '<div class="cr-section-label">Movement & Senses <span class="hint">speeds in feet</span></div>' +
            '<div class="cr-grid cr-grid-2">' +
              '<div class="cr-field"><label>Walking Speed</label>' + numField('speed', s.speed, 0) + '</div>' +
              '<div class="cr-field"><label>Flying Speed</label>' + numField('flySpeed', s.flySpeed, 0) + '</div>' +
              '<div class="cr-field"><label>Swimming Speed</label>' + numField('swimSpeed', s.swimSpeed, 0) + '</div>' +
              '<div class="cr-field"><label>Darkvision</label>' + selectEl('darkvision', DARKVISION, s.darkvision) + '</div>' +
              '<div class="cr-field wide"><label>Languages</label>' + textField('languages', s.languages, 'Common, Draconic') + '</div>' +
            '</div>' +
          '</div>' +

          // Ability Score Increases
          '<div class="cr-section">' +
            '<div class="cr-section-label">Ability Score Increases</div>' +
            '<div class="cr-grid cr-grid-3">' + asiBlocks + '</div>' +
          '</div>' +

          // Damage Resistances
          '<div class="cr-section">' +
            '<div class="cr-section-label">Damage Resistances</div>' +
            '<div class="cr-chips">' + resistanceRow + '</div>' +
          '</div>' +

          // Proficiencies
          '<div class="cr-section">' +
            '<div class="cr-section-label">Proficiencies <span class="hint">comma-separated</span></div>' +
            '<div class="cr-grid cr-grid-2">' +
              '<div class="cr-field"><label>Weapon Proficiencies</label>' + textField('weaponProf', s.weaponProf, 'Longsword, Shortsword') + '</div>' +
              '<div class="cr-field"><label>Tool Proficiencies</label>' + textField('toolProf', s.toolProf, 'Artisan\'s Tools') + '</div>' +
            '</div>' +
          '</div>' +

          // Innate Spellcasting
          '<div class="cr-section">' +
            '<details>' +
              '<summary>Innate Spellcasting (Optional)</summary>' +
              '<div class="cr-field" style="margin-top:10px;"><label>Cantrip Name</label>' + textField('innateCantrip', s.innateCantrip, 'e.g. Light') + '</div>' +
            '</details>' +
          '</div>' +

          // Traits
          '<div class="cr-section">' +
            '<div class="cr-section-label">Racial Traits</div>' +
            '<div data-list="traits">' + traitsBlock + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-trait" style="margin-top:8px;">+ Add Trait</button>' +
          '</div>' +

          // Subraces
          '<div class="cr-section">' +
            '<div class="cr-section-label">Subraces</div>' +
            '<div data-list="subraces">' + subracesBlock + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-subrace" style="margin-top:8px;">+ Add Subrace</button>' +
          '</div>' +

          // Publishing
          '<div class="cr-section">' +
            '<div class="cr-section-label">Publishing & Sharing</div>' +
            '<div class="cr-field"><label>Add to Campaign</label>' +
              '<select data-k="campaignId"><option value="">— Not attached —</option></select>' +
              '<div class="hint">Players in the selected campaign can view this race.</div>' +
            '</div>' +
            '<div class="cr-field"><label class="cr-toggle"><input type="checkbox" data-k="isPublic"' + (s.isPublic ? ' checked' : '') + ' /> Make public in the community library</label></div>' +
          '</div>' +

        '</div>' +

        '<div class="cr-preview-pane">' +
          '<h2>Live Preview</h2>' +
          renderRaceCard(s) +
        '</div>' +
      '</div>';

    populateCampaignDropdown(s);
    setSyncState('');
  }

  function traitRow(listKey, t, idx) {
    return '<div class="cr-trait-row" data-idx="' + idx + '" style="margin-bottom:10px;padding:10px;background:var(--bg-card);border:1px solid var(--border);">' +
      '<input type="text" data-list="' + listKey + '" data-idx="' + idx + '" data-field="name" value="' + escAttr(t.name) + '" placeholder="Name" style="margin-bottom:6px;" />' +
      '<textarea data-list="' + listKey + '" data-idx="' + idx + '" data-field="desc" rows="2" placeholder="Description">' + esc(t.desc) + '</textarea>' +
      '<button type="button" class="cr-btn" data-act="remove-row" data-list="' + listKey + '" data-idx="' + idx + '" style="margin-top:6px;">Remove</button>' +
    '</div>';
  }

  function subraceRow(sr, idx) {
    var traitLines = (sr.traits || []).map(function (t, ti) {
      return '<input type="text" data-list="subraces" data-idx="' + idx + '" data-subfield="traits" data-subidx="' + ti + '" value="' + escAttr(t.name || '') + '" placeholder="Trait name" style="margin-bottom:4px;" />';
    }).join('');

    return '<div class="cr-trait-row" data-idx="' + idx + '" style="margin-bottom:10px;padding:10px;background:var(--bg-card);border:1px solid var(--border);">' +
      '<input type="text" data-list="subraces" data-idx="' + idx + '" data-field="name" value="' + escAttr(sr.name || '') + '" placeholder="Subrace name" style="margin-bottom:6px;" />' +
      '<div style="margin-bottom:6px;"><strong>Traits:</strong> ' + (traitLines || '<em>none</em>') + '</div>' +
      '<button type="button" class="cr-btn" data-act="remove-row" data-list="subraces" data-idx="' + idx + '" style="margin-top:6px;">Remove</button>' +
    '</div>';
  }

  // ── Live preview ──────────────────────────────────────────────────
  function renderRaceCard(s) {
    var speedLine = [];
    if (s.speed && s.speed > 0) speedLine.push(s.speed + ' ft.');
    if (s.flySpeed && s.flySpeed > 0) speedLine.push('fly ' + s.flySpeed + ' ft.');
    if (s.swimSpeed && s.swimSpeed > 0) speedLine.push('swim ' + s.swimSpeed + ' ft.');
    var speedStr = speedLine.length ? speedLine.join(', ') : '30 ft.';

    var asiSummary = ABS.filter(function (a) { return s.asi && s.asi[a] && s.asi[a] > 0; })
      .map(function (a) { return a + ' +' + (s.asi[a]); }).join(', ') || '—';

    var traitsHtml = (s.traits||[]).filter(function(t){return t.name||t.desc;}).map(function(t){
      return '<div class="cr-sb-trait"><strong><em>' + esc(t.name) + '.</em></strong> ' + esc(t.desc) + '</div>';
    }).join('');

    var subracesHtml = (s.subraces||[]).filter(function(sr){return sr.name;}).map(function(sr){
      return '<div style="margin-top:12px;padding:8px;background:rgba(0,0,0,0.05);border-left:3px solid var(--accent);">' +
        '<strong>' + esc(sr.name) + '</strong>' +
        ((sr.traits||[]).length ? '<div style="margin-top:6px;font-size:0.9em;">' +
          (sr.traits.map(function(t){ return esc(t.name || ''); }).join(', ')) + '</div>' : '') +
      '</div>';
    }).join('');

    var html =
      '<div class="cr-spellcard">' +
        '<img src="logo.png" alt="Phmurt" class="cr-sc-brand" />' +
        '<div class="cr-sc-name">' + (esc(s.name) || '<span style="color:var(--text-faint);">Untitled Race</span>') + '</div>' +
        '<div class="cr-sc-meta">' + esc(s.size) + ', ' + (s.darkvision !== 'None' ? s.darkvision + ' darkvision, ' : '') + speedStr + '</div>' +
        '<div class="cr-sc-row"><strong>Ability Score Increases</strong><span>' + asiSummary + '</span></div>' +
        (s.languages ? '<div class="cr-sc-row"><strong>Languages</strong><span>' + esc(s.languages) + '</span></div>' : '') +
        (s.resistances && s.resistances.length ? '<div class="cr-sc-row"><strong>Resistances</strong><span>' + esc(s.resistances.join(', ')) + '</span></div>' : '') +
        (traitsHtml ? '<div class="cr-sc-body">' + traitsHtml + '</div>' : '') +
        (subracesHtml ? '<div class="cr-sc-higher"><strong>Subraces</strong>' + subracesHtml + '</div>' : '') +
      '</div>';
    return html;
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
    var asi = t.getAttribute('data-asi');
    var list = t.getAttribute('data-list');
    var group = t.getAttribute('data-group');

    if (k) {
      if (t.type === 'checkbox') state.current[k] = t.checked;
      else if (t.type === 'number') state.current[k] = parseInt(t.value, 10) || 0;
      else state.current[k] = t.value;
    } else if (asi) {
      if (!state.current.asi) state.current.asi = {};
      state.current.asi[asi] = parseInt(t.value, 10) || 0;
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
    if (act === 'export') return exportJson();
    if (act === 'delete') return del();
    if (act === 'add-trait') { state.current.traits.push({ name:'', desc:'' }); render(); return; }
    if (act === 'add-subrace') { state.current.subraces.push({ name:'', asi:{}, traits:[] }); render(); return; }
    if (act === 'remove-row') {
      var list = t.getAttribute('data-list'); var idx = parseInt(t.getAttribute('data-idx'),10);
      state.current[list].splice(idx, 1); render(); return;
    }
  }
  function onKeydown(e) {
    if (e.key !== 'Escape') return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (['input','textarea','select'].indexOf(tag) !== -1) return;
    close();
  }

  // ── Save / delete ─────────────────────────────────────────────────
  function save() {
    if (!state.current.name || !state.current.name.trim()) { alert('Name is required'); return; }
    if (!state.current.clientId) state.current.clientId = generateClientId();
    var all = loadAll();
    all[state.current.clientId] = state.current;
    saveAll(all);
    if (global._homebrewRaces) global._homebrewRaces = all;
    if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
    cloudSync();
    close();
  }
  function del() {
    if (!confirm('Delete this race?')) return;
    var all = loadAll();
    delete all[state.current.clientId];
    saveAll(all);
    if (global._homebrewRaces) global._homebrewRaces = all;
    if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
    close();
  }
  function exportJson() {
    var blob = new Blob([JSON.stringify(state.current, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (state.current.name || 'race').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.race.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
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
  function openRace(editId) {
    var root = document.getElementById('creator-root'); if (!root) return;
    var all = loadAll();
    var existing = editId ? all[editId] : null;
    state.current = existing ? Object.assign(defaultRace(), existing) : defaultRace();
    state.editId = editId || null;
    root.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    render();
    wireEvents();
    try { history.replaceState({}, '', location.pathname + '?create=race' + (editId ? '&id=' + editId : '')); } catch (e) {}
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
      if (q.get('create') === 'race') openRace(q.get('id') || null);
    } catch (e) {}
  }

  // ── Export API ────────────────────────────────────────────────────
  global.PhmurtRaceCreator = { openRace: openRace, close: close };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', maybeAutoOpen);
  } else {
    maybeAutoOpen();
  }
})(window);
