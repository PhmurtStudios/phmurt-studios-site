/* ═══════════════════════════════════════════════════════════════════
   PHMURT CREATOR — Item
   Split-pane homebrew item creator using shared creator.css + util.
   Persists to both 'phmurt_homebrew_items' (legacy shape for itemDB)
   and the cloud 'homebrew_content' table.
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';
  var KEY = 'phmurt_homebrew_items';
  var U = global.PhmurtCreatorUtil || {};

  var RARITIES = ['common','uncommon','rare','very rare','legendary','artifact'];
  var DAMAGE_TYPES = ['acid','bludgeoning','cold','fire','force','lightning','necrotic','piercing','poison','psychic','radiant','slashing','thunder'];
  var WEAPON_PROPS = ['Ammunition','Finesse','Heavy','Light','Loading','Reach','Special','Thrown','Two-handed','Versatile','Magical'];

  function categories() {
    return (global.DND_DATA && global.DND_DATA.itemCategories2) || {
      weapon:'Weapon', 'magic-weapon':'Magic Weapon', armor:'Armor', 'magic-armor':'Magic Armor',
      ring:'Ring', rod:'Rod', staff:'Staff', wand:'Wand', wondrous:'Wondrous Item',
      potion:'Potion', scroll:'Scroll', gear:'Adventuring Gear', tool:'Tool', other:'Other'
    };
  }

  function defaultItem() {
    return {
      type: 'item', clientId: null,
      name: 'New Item', category: 'wondrous', subcategory: '', rarity: 'uncommon',
      value: '', weight: 0,
      damage: '', damageType: '', properties: [],
      acFormula: '', strReq: '',
      attunement: false,
      desc: '',
      tags: [],
      campaignId: null, isPublic: false
    };
  }

  var state = { current: null, editId: null };

  // ── Persistence ───────────────────────────────────────────────────
  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function saveAll(db) { localStorage.setItem(KEY, JSON.stringify(db)); }
  function generateClientId() { return 'hb-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,6); }

  // ── Cloud sync ────────────────────────────────────────────────────
  function getSupabase() { return global.phmurtSupabase || null; }
  function currentUserId() {
    try {
      var s = global.PhmurtDB && global.PhmurtDB.getSession && global.PhmurtDB.getSession();
      return (s && s.user && s.user.id) || null;
    } catch (e) { return null; }
  }
  var cloudSync = (U.debounce ? U.debounce(doCloudSync, 700) : function(){ setTimeout(doCloudSync, 700); });
  function doCloudSync() {
    var sb = getSupabase(); var uid = currentUserId();
    if (!sb || !uid || !state.current || !state.current.clientId) return;
    setSyncState('syncing');
    state.current._authorName = U.getAuthorName ? U.getAuthorName() : 'Anonymous';
    sb.from('homebrew_content').upsert({
      user_id: uid, type: 'item', client_id: state.current.clientId,
      data: state.current, slug: U.slugify ? U.slugify(state.current.name) : state.current.name,
      is_public: !!state.current.isPublic
    }, { onConflict: 'user_id,type,client_id' }).then(function (r) { setSyncState(r.error ? 'err' : 'ok'); },
       function () { setSyncState('err'); });
  }
  function setSyncState(k) {
    var el = document.querySelector('#creator-root .cr-sync-indicator'); if (!el) return;
    el.className = 'cr-sync-indicator ' + k;
    el.textContent = k === 'ok' ? '✓ Synced' : k === 'syncing' ? 'Syncing…' : k === 'err' ? '✕ Sync error' : '';
  }

  // ── Render helpers ────────────────────────────────────────────────
  function escAttr(s){ return (s==null?'':String(s)).replace(/"/g,'&quot;'); }
  function esc(s){ return U.escapeHtml ? U.escapeHtml(s) : String(s==null?'':s); }
  function selectEl(key, opts, cur, labels) {
    labels = labels || {};
    return '<select data-k="' + key + '">' + opts.map(function(o){
      return '<option value="'+escAttr(o)+'"'+(String(cur)===String(o)?' selected':'')+'>'+esc(labels[o]!=null?labels[o]:o)+'</option>';
    }).join('') + '</select>';
  }
  function textField(key, cur, ph) {
    return '<input type="text" data-k="' + key + '" value="' + escAttr(cur) + '" placeholder="' + escAttr(ph||'') + '" />';
  }
  function numField(key, cur, step) {
    return '<input type="number" data-k="' + key + '" value="' + escAttr(cur||0) + '"' + (step?' step="'+step+'"':'') + ' />';
  }
  function chip(group, val, label, checked) {
    return '<label class="cr-chip"><input type="checkbox" data-group="'+group+'" value="'+escAttr(val)+'"'+(checked?' checked':'')+' /> '+esc(label)+'</label>';
  }

  function isWeapon(c) { return c === 'weapon' || c === 'magic-weapon'; }
  function isArmor(c) { return c === 'armor' || c === 'magic-armor'; }

  function render() {
    var s = state.current; if (!s) return;
    var root = document.getElementById('creator-root'); if (!root) return;
    var catsObj = categories(); var catKeys = Object.keys(catsObj);

    var conditional = '';
    if (isWeapon(s.category)) {
      conditional = '<div class="cr-section">' +
        '<div class="cr-section-label">Weapon Stats</div>' +
        '<div class="cr-grid cr-grid-2">' +
          '<div class="cr-field"><label>Damage</label>' + textField('damage', s.damage, 'e.g. 1d8+1, 2d6') +
            (s.damage ? '<div class="cr-autocalc">' + (U.damageSummary ? U.damageSummary(s.damage, null, '') || '' : '') + '</div>' : '') + '</div>' +
          '<div class="cr-field"><label>Damage Type</label>' + selectEl('damageType', [''].concat(DAMAGE_TYPES), s.damageType, {'':'— None —'}) + '</div>' +
        '</div>' +
        '<div class="cr-field" style="margin-top:10px;"><label>Properties</label>' +
          '<div class="cr-chips">' + WEAPON_PROPS.map(function(p){return chip('properties', p, p, s.properties.indexOf(p)!==-1);}).join('') + '</div>' +
        '</div>' +
      '</div>';
    } else if (isArmor(s.category)) {
      conditional = '<div class="cr-section">' +
        '<div class="cr-section-label">Armor Stats</div>' +
        '<div class="cr-grid cr-grid-2">' +
          '<div class="cr-field"><label>AC Formula</label>' + textField('acFormula', s.acFormula, 'e.g. 14 + DEX (max 2)') + '</div>' +
          '<div class="cr-field"><label>STR Requirement</label>' + textField('strReq', s.strReq, 'e.g. STR 13') + '</div>' +
        '</div>' +
      '</div>';
    }

    root.innerHTML =
      '<div class="cr-topbar">' +
        '<button class="cr-back" type="button" data-act="close">◂ Back</button>' +
        '<div class="cr-title">' +
          '<div class="cr-eyebrow">Homebrew · Item</div>' +
          '<div class="cr-heading">' + esc(s.name || 'New Item') + '</div>' +
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
              '<div class="cr-field wide"><label>Name <span class="req">*</span></label>' + textField('name', s.name, 'e.g. Blade of Forgotten Kings') + '</div>' +
              '<div class="cr-field"><label>Category</label>' + selectEl('category', catKeys, s.category, catsObj) + '</div>' +
              '<div class="cr-field"><label>Rarity</label>' + selectEl('rarity', RARITIES, s.rarity) + '</div>' +
              '<div class="cr-field"><label>Subcategory</label>' + textField('subcategory', s.subcategory, 'e.g. Named Weapons') + '</div>' +
              '<div class="cr-field"><label class="cr-toggle"><input type="checkbox" data-k="attunement"' + (s.attunement ? ' checked' : '') + ' /> Requires Attunement</label></div>' +
            '</div>' +
          '</div>' +

          conditional +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Value & Weight</div>' +
            '<div class="cr-grid cr-grid-2">' +
              '<div class="cr-field"><label>Value</label>' + textField('value', s.value, 'e.g. 500 gp') + '</div>' +
              '<div class="cr-field"><label>Weight (lb)</label>' + numField('weight', s.weight, '0.1') + '</div>' +
            '</div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Description <span class="hint">markdown supported</span></div>' +
            '<div class="cr-field"><textarea data-k="desc" rows="6" placeholder="What does this item look like and do?">' + esc(s.desc) + '</textarea></div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Tags <span class="hint">comma-separated</span></div>' +
            '<div class="cr-field">' + textField('tagsCsv', (s.tags||[]).join(', '), 'magical, cursed, legendary') + '</div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Publishing & Sharing</div>' +
            '<div class="cr-field"><label>Add to Campaign</label>' +
              '<select data-k="campaignId"><option value="">— Not attached —</option></select>' +
            '</div>' +
            '<div class="cr-field"><label class="cr-toggle"><input type="checkbox" data-k="isPublic"' + (s.isPublic?' checked':'') + ' /> Make public in the community library</label></div>' +
          '</div>' +

        '</div>' +

        '<div class="cr-preview-pane">' +
          '<h2>Live Preview</h2>' +
          renderItemCard(s) +
        '</div>' +
      '</div>';

    populateCampaignDropdown(s);
    setSyncState('');
  }

  function rarityLabel(r) { return (r||'').split(' ').map(function(w){return w.charAt(0).toUpperCase()+w.slice(1);}).join(' '); }

  function renderItemCard(s) {
    var cats = categories();
    var propLine = (s.properties && s.properties.length) ? s.properties.join(', ') : '';
    var meta = (cats[s.category] || s.category) + (s.subcategory ? ' · ' + s.subcategory : '') + ', ' + rarityLabel(s.rarity) + (s.attunement ? ' (requires attunement)' : '');
    var tags = (s.tags && s.tags.length) ? '<div class="cr-sc-tags">' + s.tags.map(function(t){return '<span class="cr-sc-tag">'+esc(t)+'</span>';}).join('') + '</div>' : '';
    return '<div class="cr-spellcard">' +
      '<img src="logo.png" alt="Phmurt" class="cr-sc-brand" />' +
      '<div class="cr-sc-name">' + esc(s.name) + '</div>' +
      '<div class="cr-sc-meta">' + esc(meta) + '</div>' +
      (s.damage ? '<div class="cr-sc-row"><strong>Damage</strong> ' + esc(s.damage) + (s.damageType ? ' ' + esc(s.damageType) : '') + '</div>' : '') +
      (propLine ? '<div class="cr-sc-row"><strong>Properties</strong> ' + esc(propLine) + '</div>' : '') +
      (s.acFormula ? '<div class="cr-sc-row"><strong>Armor Class</strong> ' + esc(s.acFormula) + '</div>' : '') +
      (s.strReq ? '<div class="cr-sc-row"><strong>Strength</strong> ' + esc(s.strReq) + '</div>' : '') +
      (s.value ? '<div class="cr-sc-row"><strong>Value</strong> ' + esc(s.value) + '</div>' : '') +
      ((s.weight!=null && s.weight>0) ? '<div class="cr-sc-row"><strong>Weight</strong> ' + s.weight + ' lb.</div>' : '') +
      '<div class="cr-sc-body">' + (U.renderMarkdown ? U.renderMarkdown(s.desc || '_No description yet._') : esc(s.desc||'')) + '</div>' +
      tags +
    '</div>';
  }

  // ── Events ────────────────────────────────────────────────────────
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
    var k = t.getAttribute('data-k'); var group = t.getAttribute('data-group');
    if (k === 'tagsCsv') {
      state.current.tags = t.value.split(',').map(function(x){return x.trim();}).filter(Boolean);
    } else if (k) {
      if (t.type === 'checkbox') state.current[k] = t.checked;
      else if (t.type === 'number') state.current[k] = parseFloat(t.value) || 0;
      else state.current[k] = t.value;
    } else if (group) {
      var arr = state.current[group] || (state.current[group] = []);
      var v = t.value;
      if (t.checked && arr.indexOf(v) === -1) arr.push(v);
      if (!t.checked) state.current[group] = arr.filter(function(x){return x !== v;});
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
  }
  function onKeydown(e) {
    if (e.key !== 'Escape') return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (['input','textarea','select'].indexOf(tag) !== -1) return;
    close();
  }

  function save() {
    if (!state.current.name || !state.current.name.trim()) { if (U.showToast) U.showToast('Error', 'Name is required'); else alert('Name is required'); return; }
    if (!state.current.clientId) state.current.clientId = generateClientId();
    var db = loadAll();
    // preserve legacy id as well so itemDB keeps working
    var id = state.current.id || state.current.clientId;
    state.current.id = id;
    state.current.source = 'homebrew';
    db[id] = state.current;
    saveAll(db);
    if (global.DND_DATA) {
      global.DND_DATA.homebrewDB = global.DND_DATA.homebrewDB || {};
      global.DND_DATA.homebrewDB[id] = state.current;
      if (global.DND_DATA.itemDB) global.DND_DATA.itemDB[id] = state.current;
    }
    if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
    cloudSync();
    close();
  }
  function del() {
    var doDelete = function() {
      var db = loadAll(); var id = state.current.id || state.current.clientId;
      delete db[id]; saveAll(db);
      if (global.DND_DATA && global.DND_DATA.homebrewDB) delete global.DND_DATA.homebrewDB[id];
      if (global.DND_DATA && global.DND_DATA.itemDB) delete global.DND_DATA.itemDB[id];
      if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
      close();
    };
    if (U.showConfirm) U.showConfirm('Delete this item? This cannot be undone.', doDelete);
    else if (confirm('Delete this item?')) doDelete();
  }
  function exportPng() {
    var card = document.querySelector('#creator-root .cr-spellcard');
    if (!card || typeof global.html2canvas !== 'function') { if (U.showToast) U.showToast('Error', 'PNG export not available.'); else alert('PNG export not available.'); return; }
    global.html2canvas(card, { backgroundColor: null, scale: 2 }).then(function(canvas){
      canvas.toBlob(function(blob){
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = (state.current.name||'item')+'.png';
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

  function openItem(editId) {
    var root = document.getElementById('creator-root'); if (!root) return;
    var db = loadAll();
    var existing = editId ? db[editId] : null;
    state.current = existing ? Object.assign(defaultItem(), existing) : defaultItem();
    // ensure tags is array
    if (typeof state.current.tags === 'string') state.current.tags = state.current.tags.split(',').map(function(x){return x.trim();}).filter(Boolean);
    state.editId = editId || null;
    root.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    render(); wireEvents();
    try { history.replaceState({}, '', location.pathname + '?create=item' + (editId?'&id='+editId:'')); } catch(e){}
  }
  function close() {
    var root = document.getElementById('creator-root'); if (!root) return;
    root.setAttribute('hidden','');
    document.body.style.overflow = '';
    state.current = null; state.editId = null;
    try {
      var url = new URL(location.href);
      url.searchParams.delete('create'); url.searchParams.delete('id');
      history.replaceState({}, '', url.toString());
    } catch(e){}
  }

  function maybeAutoOpen() {
    try {
      var q = new URLSearchParams(location.search);
      if (q.get('create') === 'item') openItem(q.get('id') || null);
    } catch(e){}
  }

  global.PhmurtItemCreator = { openItem: openItem, close: close };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeAutoOpen);
  else maybeAutoOpen();
})(window);
