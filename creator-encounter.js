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
      setup:'', monsters:[{name:'',count:1,cr:'1',notes:''}],
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

    var monstersHtml = (s.monsters||[]).map(function(m, i){
      var xp = U.crToXp ? (U.crToXp(m.cr) || 0) : 0;
      return '<div class="cr-trait-row" style="margin-bottom:10px;padding:10px;background:var(--bg-card);border:1px solid var(--border);">' +
        '<div class="cr-grid cr-grid-3" style="align-items:end;">' +
          '<div class="cr-field wide"><label>Monster</label><input type="text" data-list="monsters" data-idx="'+i+'" data-field="name" value="'+escAttr(m.name)+'" placeholder="e.g. Orc Warrior" /></div>' +
          '<div class="cr-field"><label>Count</label><input type="number" data-list="monsters" data-idx="'+i+'" data-field="count" value="'+(m.count||1)+'" min="1" /></div>' +
          '<div class="cr-field"><label>CR</label>' +
            '<select data-list="monsters" data-idx="'+i+'" data-field="cr">' +
              CR_OPTS.map(function(c){return '<option value="'+c+'"'+(String(m.cr)===c?' selected':'')+'>'+c+'</option>';}).join('') +
            '</select>' +
          '</div>' +
        '</div>' +
        '<input type="text" data-list="monsters" data-idx="'+i+'" data-field="notes" value="'+escAttr(m.notes)+'" placeholder="Notes (e.g., Half HP, Immobilized)" style="margin-top:8px;" />' +
        '<div class="cr-autocalc">' + (m.count||1) + ' × ' + xp + ' XP = ' + ((m.count||1) * xp) + ' XP</div>' +
        '<button type="button" class="cr-btn" data-act="remove-monster" data-idx="'+i+'" style="margin-top:6px;">Remove</button>' +
      '</div>';
    }).join('');

    var terrainHtml = (s.terrain||[]).map(function(t, i){
      return '<div class="cr-trait-row" style="margin-bottom:10px;padding:10px;background:var(--bg-card);border:1px solid var(--border);">' +
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
            '<div class="cr-section-label">Enemies</div>' +
            '<div>' + monstersHtml + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-monster" style="margin-top:8px;">+ Add Enemy</button>' +
            '<div class="cr-autocalc" style="margin-top:10px;">' +
              'Total: ' + encXp.totalMonsters + ' monster(s) · raw ' + encXp.rawXp + ' XP × ' + encXp.multiplier + ' = <strong>' + encXp.adjustedXp + ' adj XP</strong> → computed difficulty: <strong>' + computedDiff + '</strong>' +
            '</div>' +
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
    if (a === 'add-monster') { state.current.monsters.push({name:'',count:1,cr:'1',notes:''}); render(); return; }
    if (a === 'remove-monster') { state.current.monsters.splice(parseInt(t.getAttribute('data-idx'),10),1); render(); return; }
    if (a === 'add-terrain') { state.current.terrain.push({name:'',desc:''}); render(); return; }
    if (a === 'remove-terrain') { state.current.terrain.splice(parseInt(t.getAttribute('data-idx'),10),1); render(); return; }
  }
  function onKeydown(e) {
    if (e.key !== 'Escape') return;
    var tag = (e.target.tagName||'').toLowerCase();
    if (['input','textarea','select'].indexOf(tag)!==-1) return;
    close();
  }

  function save() {
    if (!state.current.name.trim()) { alert('Name is required'); return; }
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
    if (!confirm('Delete this encounter?')) return;
    var list = loadAll().filter(function(x){ return x.id !== state.current.id; });
    saveAll(list);
    if (global._homebrewEncounters !== undefined) global._homebrewEncounters = list;
    if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
    close();
  }
  function exportPng() {
    var card = document.querySelector('#creator-root .cr-spellcard');
    if (!card || typeof global.html2canvas !== 'function') { alert('PNG export not available.'); return; }
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
    if (!state.current.monsters || !state.current.monsters.length) state.current.monsters = [{name:'',count:1,cr:'1',notes:''}];
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
