/* ═══════════════════════════════════════════════════════════════════
   PHMURT CREATOR — Feat
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';
  var KEY = 'phmurt_homebrew_feats';
  var U = global.PhmurtCreatorUtil || {};
  var ABS = ['','STR','DEX','CON','INT','WIS','CHA','choice'];
  var AB_LABELS = {'':'None','STR':'Strength','DEX':'Dexterity','CON':'Constitution','INT':'Intelligence','WIS':'Wisdom','CHA':'Charisma','choice':"Player's Choice"};
  var TAGS = ['Combat','Magic','Social','Exploration','Racial','Class-Specific','Defensive','Utility'];

  function defaultFeat() {
    return {
      type:'feat', clientId:null,
      name:'New Feat', prerequisite:'',
      description:'', benefits:[''],
      asiAbility:'', asiAmount:1,
      tags:[], campaignId:null, isPublic:false
    };
  }

  var state = { current:null, editId:null };

  function loadAll(){ try { return JSON.parse(localStorage.getItem(KEY)||'[]')||[]; } catch(e){ return []; } }
  function saveAll(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
  function generateClientId(){ return 'feat_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,6); }

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
      user_id: uid, type: 'feat', client_id: state.current.clientId,
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
  function chip(group, val, label, checked){
    return '<label class="cr-chip"><input type="checkbox" data-group="'+group+'" value="'+escAttr(val)+'"'+(checked?' checked':'')+' /> '+esc(label)+'</label>';
  }

  function render() {
    var s = state.current; if (!s) return;
    var root = document.getElementById('creator-root'); if (!root) return;

    var benefitsHtml = (s.benefits||[]).map(function(b, i){
      return '<div class="cr-trait-row" data-idx="'+i+'" style="margin-bottom:8px;padding:10px;background:var(--bg-card);border:1px solid var(--border);">' +
        '<input type="text" data-list="benefits" data-idx="'+i+'" value="'+escAttr(b)+'" placeholder="e.g. You gain proficiency in one skill of your choice" />' +
        '<button type="button" class="cr-btn" data-act="remove-row" data-idx="'+i+'" style="margin-top:6px;">Remove</button>' +
      '</div>';
    }).join('');

    root.innerHTML =
      '<div class="cr-topbar">' +
        '<button class="cr-back" type="button" data-act="close">◂ Back</button>' +
        '<div class="cr-title">' +
          '<div class="cr-eyebrow">Homebrew · Feat</div>' +
          '<div class="cr-heading">' + esc(s.name||'New Feat') + '</div>' +
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
              '<div class="cr-field wide"><label>Name <span class="req">*</span></label><input type="text" data-k="name" value="'+escAttr(s.name)+'" placeholder="e.g. Sharpshooter" /></div>' +
              '<div class="cr-field wide"><label>Prerequisite</label><input type="text" data-k="prerequisite" value="'+escAttr(s.prerequisite)+'" placeholder="e.g. Dexterity 13 or higher, None" /><div class="hint">Leave blank if none.</div></div>' +
            '</div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Description <span class="hint">thematic flavor</span></div>' +
            '<div class="cr-field"><textarea data-k="description" rows="3" placeholder="What this feat represents...">'+esc(s.description)+'</textarea></div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Benefits <span class="hint">one per bullet</span></div>' +
            '<div data-list="benefits">' + benefitsHtml + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-row" style="margin-top:8px;">+ Add Benefit</button>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Ability Score Increase <span class="hint">optional</span></div>' +
            '<div class="cr-grid cr-grid-2">' +
              '<div class="cr-field"><label>Ability</label>' + selectEl('asiAbility', ABS, s.asiAbility, AB_LABELS) + '</div>' +
              '<div class="cr-field"><label>Amount</label>' + selectEl('asiAmount', [1,2], s.asiAmount, {1:'+1',2:'+2'}) + '</div>' +
            '</div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Tags</div>' +
            '<div class="cr-chips">' + TAGS.map(function(t){return chip('tags', t, t, s.tags.indexOf(t)!==-1);}).join('') + '</div>' +
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
          renderFeatCard(s) +
        '</div>' +
      '</div>';

    populateCampaignDropdown(s);
    setSyncState('');
  }

  function renderFeatCard(s) {
    var benefitsClean = (s.benefits||[]).filter(function(b){return b && b.trim();});
    var asiLine = s.asiAbility ? 'Increase your ' + (AB_LABELS[s.asiAbility]||s.asiAbility) + ' score by ' + (s.asiAmount||1) + '.' : '';
    return '<div class="cr-spellcard">' +
      '<img src="logo.png" alt="Phmurt" class="cr-sc-brand" />' +
      '<div class="cr-sc-name">' + esc(s.name) + '</div>' +
      (s.prerequisite ? '<div class="cr-sc-meta">Prerequisite: ' + esc(s.prerequisite) + '</div>' : '<div class="cr-sc-meta">No prerequisite</div>') +
      (s.description ? '<div class="cr-sc-body">' + (U.renderMarkdown ? U.renderMarkdown(s.description) : esc(s.description)) + '</div>' : '') +
      (benefitsClean.length || asiLine ?
        '<div class="cr-sc-higher"><strong>Benefits</strong>' +
          (asiLine ? '<div style="margin-bottom:6px;">' + esc(asiLine) + '</div>' : '') +
          (benefitsClean.length ? '<ul style="margin:6px 0 0 22px;padding:0;">' + benefitsClean.map(function(b){return '<li>'+esc(b)+'</li>';}).join('') + '</ul>' : '') +
        '</div>' : '') +
      ((s.tags && s.tags.length) ? '<div class="cr-sc-tags">' + s.tags.map(function(t){return '<span class="cr-sc-tag">'+esc(t)+'</span>';}).join('') + '</div>' : '') +
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
    var k = t.getAttribute('data-k'); var list = t.getAttribute('data-list'); var group = t.getAttribute('data-group');
    if (k) {
      if (t.type === 'checkbox') state.current[k] = t.checked;
      else if (k === 'asiAmount') state.current[k] = parseInt(t.value,10)||1;
      else state.current[k] = t.value;
    } else if (list === 'benefits' && t.hasAttribute('data-idx')) {
      state.current.benefits[parseInt(t.getAttribute('data-idx'),10)] = t.value;
    } else if (group) {
      var arr = state.current[group] || (state.current[group]=[]);
      if (t.checked && arr.indexOf(t.value)===-1) arr.push(t.value);
      if (!t.checked) state.current[group] = arr.filter(function(x){return x!==t.value;});
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
    if (a === 'add-row') { state.current.benefits.push(''); render(); return; }
    if (a === 'remove-row') { state.current.benefits.splice(parseInt(t.getAttribute('data-idx'),10),1); render(); return; }
  }
  function onKeydown(e) {
    if (e.key !== 'Escape') return;
    var tag = (e.target.tagName||'').toLowerCase();
    if (['input','textarea','select'].indexOf(tag)!==-1) return;
    close();
  }

  function save() {
    if (!state.current.name.trim()) { if (U.showToast) U.showToast('Error', 'Name is required'); else alert('Name is required'); return; }
    if (!state.current.clientId) state.current.clientId = generateClientId();
    state.current.benefits = (state.current.benefits||[]).filter(function(b){return b && b.trim();});
    var list = loadAll();
    state.current.id = state.current.id || state.current.clientId;
    var idx = list.findIndex(function(f){ return f.id === state.current.id; });
    if (idx >= 0) list[idx] = state.current; else list.push(state.current);
    saveAll(list);
    if (global._homebrewFeats !== undefined) global._homebrewFeats = list;
    if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
    cloudSync(); close();
  }
  function del() {
    var doDelete = function() {
      var list = loadAll().filter(function(f){ return f.id !== state.current.id; });
      saveAll(list);
      if (global._homebrewFeats !== undefined) global._homebrewFeats = list;
      if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
      close();
    };
    if (U.showConfirm) U.showConfirm('Delete this feat? This cannot be undone.', doDelete);
    else if (confirm('Delete this feat?')) doDelete();
  }
  function exportPng() {
    var card = document.querySelector('#creator-root .cr-spellcard');
    if (!card || typeof global.html2canvas !== 'function') { if (U.showToast) U.showToast('Error', 'PNG export not available.'); else alert('PNG export not available.'); return; }
    global.html2canvas(card, { backgroundColor: null, scale: 2 }).then(function(canvas){
      canvas.toBlob(function(blob){
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = (state.current.name||'feat')+'.png';
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

  function openFeat(editId) {
    var root = document.getElementById('creator-root'); if (!root) return;
    var list = loadAll();
    var existing = editId ? list.find(function(f){return f.id === editId;}) : null;
    state.current = existing ? Object.assign(defaultFeat(), existing) : defaultFeat();
    if (!state.current.benefits || !state.current.benefits.length) state.current.benefits = [''];
    state.editId = editId || null;
    root.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    render(); wireEvents();
    try { history.replaceState({}, '', location.pathname + '?create=feat' + (editId?'&id='+editId:'')); } catch(e){}
  }
  function close() {
    var root = document.getElementById('creator-root'); if (!root) return;
    root.setAttribute('hidden','');
    document.body.style.overflow = '';
    state.current = null; state.editId = null;
    try { var url = new URL(location.href); url.searchParams.delete('create'); url.searchParams.delete('id'); history.replaceState({},'',url.toString()); } catch(e){}
  }
  function maybeAutoOpen(){ try { var q = new URLSearchParams(location.search); if (q.get('create')==='feat') openFeat(q.get('id')||null); } catch(e){} }

  global.PhmurtFeatCreator = { openFeat: openFeat, close: close };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeAutoOpen);
  else maybeAutoOpen();
})(window);
