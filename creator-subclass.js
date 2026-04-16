/* ═══════════════════════════════════════════════════════════════════
   PHMURT CREATOR — Subclass
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';
  var KEY = 'phmurt_homebrew_entities_subclass';
  var U = global.PhmurtCreatorUtil || {};
  var PARENT_CLASSES = ['Barbarian','Bard','Cleric','Druid','Fighter','Monk','Paladin','Ranger','Rogue','Sorcerer','Warlock','Wizard','Artificer','Blood Hunter'];
  var SPELL_LEVELS = ['1','2','3','4','5','6','7','8','9'];
  var FEATURE_LEVELS = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];

  function defaultSubclass() {
    return {
      type:'subclass', clientId:null,
      parentClass:'', name:'New Subclass', tags:'',
      desc:'', expandedSpells:[], features:[],
      campaignId:null, isPublic:false
    };
  }

  var state = { current:null, editId:null };

  function loadAll(){ try { return JSON.parse(localStorage.getItem(KEY)||'[]')||[]; } catch(e){ return []; } }
  function saveAll(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
  function generateClientId(){ return 'subclass_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,6); }

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
    sb.from('homebrew_content').upsert({
      user_id: uid, type: 'subclass', client_id: state.current.clientId,
      data: state.current, slug: U.slugify ? U.slugify(state.current.name) : state.current.name,
      is_public: !!state.current.isPublic
    }, { onConflict: 'user_id,type,client_id' }).then(function(r){ setSyncState(r.error?'err':'ok'); }, function(){ setSyncState('err'); });
  }
  function setSyncState(k){
    var el = document.querySelector('#creator-root .cr-sync-indicator'); if(!el) return;
    el.className = 'cr-sync-indicator ' + k;
    el.textContent = k === 'ok' ? '✓ Synced' : k === 'syncing' ? 'Syncing…' : k === 'err' ? '✕ Sync error' : '';
  }

  function escAttr(s){ return (s==null?'':String(s)).replace(/"/g,'&quot;'); }
  function esc(s){ return U.escapeHtml ? U.escapeHtml(s) : String(s==null?'':s); }
  function selectEl(key, opts, cur, labels){
    labels = labels||{};
    return '<select data-k="'+key+'">'+opts.map(function(o){
      return '<option value="'+escAttr(o)+'"'+(String(cur)===String(o)?' selected':'')+'>'+esc(labels[o]!=null?labels[o]:o)+'</option>';
    }).join('')+'</select>';
  }

  function render() {
    var s = state.current; if (!s) return;
    var root = document.getElementById('creator-root'); if (!root) return;

    var spellsHtml = (s.expandedSpells||[]).map(function(sp, i){
      return '<div class="cr-trait-row" data-idx="'+i+'" style="margin-bottom:8px;padding:10px;background:var(--bg-card);border:1px solid var(--border);">' +
        '<div class="cr-grid cr-grid-2" style="gap:8px;margin-bottom:6px;">' +
          '<div><label>Spell Level</label>' + selectEl('spell-level', SPELL_LEVELS, sp.level) + '</div>' +
          '<div><label>Spells (CSV)</label><input type="text" data-list="spells" data-idx="'+i+'" data-field="spells" value="'+escAttr((sp.spells||[]).join(', '))+'" placeholder="e.g. magic missile, shield" /></div>' +
        '</div>' +
        '<button type="button" class="cr-btn" data-act="remove-spell" data-idx="'+i+'" style="margin-top:6px;">Remove</button>' +
      '</div>';
    }).join('');

    var featuresHtml = (s.features||[]).map(function(f, i){
      return '<div class="cr-trait-row" data-idx="'+i+'" style="margin-bottom:8px;padding:10px;background:var(--bg-card);border:1px solid var(--border);">' +
        '<div class="cr-grid cr-grid-2" style="gap:8px;margin-bottom:6px;">' +
          '<div><label>Level</label>' + selectEl('feature-level', FEATURE_LEVELS, f.level) + '</div>' +
          '<div><label>Feature Name</label><input type="text" data-list="features" data-idx="'+i+'" data-field="name" value="'+escAttr(f.name)+'" placeholder="e.g. Arcane Recovery" /></div>' +
        '</div>' +
        '<textarea data-list="features" data-idx="'+i+'" data-field="desc" rows="3" placeholder="Describe this feature...">'+esc(f.desc)+'</textarea>' +
        '<button type="button" class="cr-btn" data-act="remove-feature" data-idx="'+i+'" style="margin-top:6px;">Remove</button>' +
      '</div>';
    }).join('');

    root.innerHTML =
      '<div class="cr-topbar">' +
        '<button class="cr-back" type="button" data-act="close">◂ Back</button>' +
        '<div class="cr-title">' +
          '<div class="cr-eyebrow">Homebrew · Subclass</div>' +
          '<div class="cr-heading">' + esc(s.name||'New Subclass') + '</div>' +
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
              '<div class="cr-field"><label>Parent Class <span class="req">*</span></label>' + selectEl('parentClass', PARENT_CLASSES, s.parentClass) + '</div>' +
              '<div class="cr-field"><label>Subclass Name <span class="req">*</span></label><input type="text" data-k="name" value="'+escAttr(s.name)+'" placeholder="e.g. Evocation" /></div>' +
            '</div>' +
            '<div class="cr-field"><label>Tags</label><input type="text" data-k="tags" value="'+escAttr(s.tags)+'" placeholder="e.g. Magic, Support, Damage" /></div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Description <span class="hint">thematic flavor</span></div>' +
            '<div class="cr-field"><textarea data-k="desc" rows="4" placeholder="What this subclass is about...">'+esc(s.desc)+'</textarea></div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Expanded Spell List</div>' +
            '<div data-list="spells">' + spellsHtml + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-spell" style="margin-top:8px;">+ Add Spell Level</button>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Features <span class="hint">core abilities</span></div>' +
            '<div data-list="features">' + featuresHtml + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-feature" style="margin-top:8px;">+ Add Feature</button>' +
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
          renderSubclassCard(s) +
        '</div>' +
      '</div>';

    populateCampaignDropdown(s);
    setSyncState('');
  }

  function renderSubclassCard(s) {
    var featuresSorted = (s.features||[]).slice().sort(function(a,b){return parseInt(a.level,10)-parseInt(b.level,10);});
    var spellsSorted = (s.expandedSpells||[]).slice().sort(function(a,b){return parseInt(a.level,10)-parseInt(b.level,10);});

    var spellsHtml = spellsSorted.length ?
      '<div style="margin-top:12px;"><strong>Expanded Spell List</strong><table style="width:100%;border-collapse:collapse;margin-top:6px;">' +
        spellsSorted.map(function(sp){
          return '<tr style="border-bottom:1px solid var(--border);"><td style="padding:6px;font-weight:bold;">Level '+sp.level+'</td><td style="padding:6px;font-size:0.9em;">'+esc((sp.spells||[]).join(', '))+'</td></tr>';
        }).join('') +
      '</table></div>' : '';

    var featuresHtml = featuresSorted.map(function(f){
      return '<div style="margin-bottom:10px;"><span style="display:inline-block;background:var(--primary);color:white;padding:2px 6px;border-radius:3px;font-size:0.85em;font-weight:bold;margin-right:6px;">'+esc(f.level)+'</span><strong>'+esc(f.name)+'</strong><div style="font-size:0.9em;margin-top:2px;line-height:1.4;">'+esc(f.desc)+'</div></div>';
    }).join('');

    return '<div class="cr-spellcard">' +
      '<img src="logo.png" alt="Phmurt" class="cr-sc-brand" />' +
      '<div class="cr-sc-name">' + esc(s.name) + '</div>' +
      '<div class="cr-sc-meta">Subclass of ' + esc(s.parentClass||'—') + '</div>' +
      (s.desc ? '<div class="cr-sc-body">' + (U.renderMarkdown ? U.renderMarkdown(s.desc) : esc(s.desc)) + '</div>' : '') +
      spellsHtml +
      (featuresHtml ? '<div style="margin-top:12px;"><strong>Features</strong><div style="margin-top:6px;">'+featuresHtml+'</div></div>' : '') +
      ((s.tags && s.tags.trim()) ? '<div class="cr-sc-tags">' + s.tags.split(',').map(function(t){return '<span class="cr-sc-tag">'+esc(t.trim())+'</span>';}).join('') + '</div>' : '') +
    '</div>';
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
    var k = t.getAttribute('data-k'); var list = t.getAttribute('data-list'); var idx = t.getAttribute('data-idx'); var field = t.getAttribute('data-field');
    if (k) {
      if (t.type === 'checkbox') state.current[k] = t.checked;
      else state.current[k] = t.value;
    } else if (list === 'spells' && idx !== null) {
      var spIdx = parseInt(idx, 10);
      if (field === 'spells') {
        if (state.current.expandedSpells[spIdx]) state.current.expandedSpells[spIdx].spells = t.value.split(',').map(function(s){return s.trim();}).filter(function(s){return s;});
      }
    } else if (list === 'features' && idx !== null) {
      var fIdx = parseInt(idx, 10);
      if (field === 'name') state.current.features[fIdx].name = t.value;
      else if (field === 'desc') state.current.features[fIdx].desc = t.value;
    }
    var selByIdx = t.closest('[data-idx]');
    if (selByIdx && t.tagName === 'SELECT') {
      idx = parseInt(selByIdx.getAttribute('data-idx'), 10);
      var sel = t.closest('[data-list="spells"]');
      if (sel && t.getAttribute('data-k') === null) {
        if (state.current.expandedSpells[idx]) state.current.expandedSpells[idx].level = parseInt(t.value, 10);
      } else if (t.closest('[data-list="features"]')) {
        if (state.current.features[idx]) state.current.features[idx].level = parseInt(t.value, 10);
      }
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
    if (a === 'add-spell') { state.current.expandedSpells.push({level:1, spells:[]}); render(); return; }
    if (a === 'remove-spell') { state.current.expandedSpells.splice(parseInt(t.getAttribute('data-idx'),10),1); render(); return; }
    if (a === 'add-feature') { state.current.features.push({level:1, name:'', desc:''}); render(); return; }
    if (a === 'remove-feature') { state.current.features.splice(parseInt(t.getAttribute('data-idx'),10),1); render(); return; }
  }
  function onKeydown(e) {
    if (e.key !== 'Escape') return;
    var tag = (e.target.tagName||'').toLowerCase();
    if (['input','textarea','select'].indexOf(tag)!==-1) return;
    close();
  }

  function save() {
    if (!state.current.name || !state.current.name.trim()) { if (U.showToast) U.showToast('Error', 'Name is required'); else alert('Name is required'); return; }
    if (!state.current.parentClass) { if (U.showToast) U.showToast('Error', 'Parent Class is required'); else alert('Parent Class is required'); return; }
    if (!state.current.clientId) state.current.clientId = generateClientId();
    state.current.expandedSpells = (state.current.expandedSpells||[]).filter(function(sp){return sp.spells && sp.spells.length;});
    state.current.features = (state.current.features||[]).filter(function(f){return f.name && f.name.trim();});
    var list = loadAll();
    state.current.id = state.current.id || state.current.clientId;
    var idx = list.findIndex(function(sc){ return sc.id === state.current.id; });
    if (idx >= 0) list[idx] = state.current; else list.push(state.current);
    saveAll(list);
    if (global._homebrewSubclasses !== undefined) global._homebrewSubclasses = list;
    if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
    cloudSync(); close();
  }
  function del() {
    var doDelete = function() {
      var list = loadAll().filter(function(sc){ return sc.id !== state.current.id; });
      saveAll(list);
      if (global._homebrewSubclasses !== undefined) global._homebrewSubclasses = list;
      if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
      close();
    };
    if (U.showConfirm) U.showConfirm('Delete this subclass? This cannot be undone.', doDelete);
    else if (confirm('Delete this subclass?')) doDelete();
  }
  function exportPng() {
    var card = document.querySelector('#creator-root .cr-spellcard');
    if (!card || typeof global.html2canvas !== 'function') { if (U.showToast) U.showToast('Error', 'PNG export not available.'); else alert('PNG export not available.'); return; }
    global.html2canvas(card, { backgroundColor: null, scale: 2 }).then(function(canvas){
      canvas.toBlob(function(blob){
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = (state.current.name||'subclass')+'.png';
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

  function openSubclass(editId) {
    var root = document.getElementById('creator-root'); if (!root) return;
    var list = loadAll();
    var existing = editId ? list.find(function(sc){return sc.id === editId;}) : null;
    state.current = existing ? Object.assign(defaultSubclass(), existing) : defaultSubclass();
    if (!state.current.expandedSpells || !state.current.expandedSpells.length) state.current.expandedSpells = [];
    if (!state.current.features || !state.current.features.length) state.current.features = [];
    state.editId = editId || null;
    root.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    render(); wireEvents();
    try { history.replaceState({}, '', location.pathname + '?create=subclass' + (editId?'&id='+editId:'')); } catch(e){}
  }
  function close() {
    var root = document.getElementById('creator-root'); if (!root) return;
    root.setAttribute('hidden','');
    document.body.style.overflow = '';
    state.current = null; state.editId = null;
    try { var url = new URL(location.href); url.searchParams.delete('create'); url.searchParams.delete('id'); history.replaceState({},'',url.toString()); } catch(e){}
  }
  function maybeAutoOpen(){ try { var q = new URLSearchParams(location.search); if (q.get('create')==='subclass') openSubclass(q.get('id')||null); } catch(e){} }

  global.PhmurtSubclassCreator = { openSubclass: openSubclass, close: close };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeAutoOpen);
  else maybeAutoOpen();
})(window);
