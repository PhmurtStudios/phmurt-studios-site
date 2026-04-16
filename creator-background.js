/* ═══════════════════════════════════════════════════════════════════
   PHMURT CREATOR — Background
   Split-pane homebrew background creator using shared creator.css + util.
   Persists to 'phmurt_homebrew_entities_background' (legacy shape)
   and cloud 'homebrew_content' table.
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';
  var KEY = 'phmurt_homebrew_entities_background';
  var U = global.PhmurtCreatorUtil || {};

  function defaultBackground() {
    return {
      type: 'background', clientId: null,
      name: 'New Background', tags: '', skills: '', tools: '', languages: 0,
      feature: '', featureDesc: '',
      equipment: '', personalityTraits: [], ideals: [], bonds: [], flaws: [],
      specialty: '', campaignId: null, isPublic: false
    };
  }

  var state = { current: null, editId: null };

  // ── Persistence ───────────────────────────────────────────────────
  function loadAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; }
    catch (e) { return []; }
  }
  function saveAll(list) { localStorage.setItem(KEY, JSON.stringify(list)); }
  function generateClientId() { return 'bg_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6); }

  // ── Cloud sync ────────────────────────────────────────────────────
  function getSupabase() { return global.phmurtSupabase || null; }
  function currentUserId() {
    try {
      var s = global.PhmurtDB && global.PhmurtDB.getSession && global.PhmurtDB.getSession();
      return (s && s.user && s.user.id) || null;
    } catch (e) { return null; }
  }
  var cloudSync = (U.debounce ? U.debounce(doCloudSync, 700) : function() { setTimeout(doCloudSync, 700); });
  function doCloudSync() {
    var sb = getSupabase(); var uid = currentUserId();
    if (!sb || !uid || !state.current || !state.current.clientId) return;
    setSyncState('syncing');
    state.current._authorName = U.getAuthorName ? U.getAuthorName() : 'Anonymous';
    sb.from('homebrew_content').upsert({
      user_id: uid, type: 'background', client_id: state.current.clientId,
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
  function escAttr(s) { return (s == null ? '' : String(s)).replace(/"/g, '&quot;'); }
  function esc(s) { return U.escapeHtml ? U.escapeHtml(s) : String(s == null ? '' : s); }
  function selectEl(key, opts, cur, labels) {
    labels = labels || {};
    return '<select data-k="' + key + '">' + opts.map(function (o) {
      return '<option value="' + escAttr(o) + '"' + (String(cur) === String(o) ? ' selected' : '') + '>' + esc(labels[o] != null ? labels[o] : o) + '</option>';
    }).join('') + '</select>';
  }

  function renderTraitRows(list) {
    return (list || []).map(function (item, i) {
      return '<div class="cr-trait-row" data-idx="' + i + '" >' +
        '<input type="text" data-list="trait" data-group="' + (this.group) + '" data-idx="' + i + '" value="' + escAttr(item) + '" placeholder="' + escAttr(this.ph) + '" />' +
        '<button type="button" class="cr-btn" data-act="remove-trait" data-group="' + (this.group) + '" data-idx="' + i + '" style="margin-top:6px;">Remove</button>' +
      '</div>';
    }, this).join('');
  }

  function render() {
    var s = state.current; if (!s) return;
    var root = document.getElementById('creator-root'); if (!root) return;

    var personalityHtml = renderTraitRows.call({ group: 'personalityTraits', ph: 'e.g. I joke to deal with stress' }, s.personalityTraits);
    var idealsHtml = renderTraitRows.call({ group: 'ideals', ph: 'e.g. Beauty' }, s.ideals);
    var bondsHtml = renderTraitRows.call({ group: 'bonds', ph: 'e.g. I seek to protect my family' }, s.bonds);
    var flawsHtml = renderTraitRows.call({ group: 'flaws', ph: 'e.g. I am suspicious of strangers' }, s.flaws);

    root.innerHTML =
      '<div class="cr-topbar">' +
        '<button class="cr-back" type="button" data-act="close">◂ Back</button>' +
        '<div class="cr-title">' +
          '<div class="cr-eyebrow">Homebrew · Background</div>' +
          '<div class="cr-heading">' + esc(s.name || 'New Background') + '</div>' +
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
              '<div class="cr-field wide"><label>Name <span class="req">*</span></label><input type="text" data-k="name" value="' + escAttr(s.name) + '" placeholder="e.g. Criminal" /></div>' +
              '<div class="cr-field wide"><label>Tags</label><input type="text" data-k="tags" value="' + escAttr(s.tags) + '" placeholder="e.g. underworld, street" /></div>' +
            '</div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Proficiencies</div>' +
            '<div class="cr-field"><label>Skills <span class="req">*</span></label><input type="text" data-k="skills" value="' + escAttr(s.skills) + '" placeholder="e.g. Stealth, Deception" /></div>' +
            '<div class="cr-field"><label>Tools</label><input type="text" data-k="tools" value="' + escAttr(s.tools) + '" placeholder="e.g. Thieves&#39; tools" /></div>' +
            '<div class="cr-field"><label>Extra Languages</label><input type="number" data-k="languages" value="' + (s.languages || 0) + '" min="0" /></div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Feature <span class="req">*</span></div>' +
            '<div class="cr-field"><label>Feature Name</label><input type="text" data-k="feature" value="' + escAttr(s.feature) + '" placeholder="e.g. Criminal Contact" /></div>' +
            '<div class="cr-field"><label>Feature Description</label><textarea data-k="featureDesc" rows="4" placeholder="Describe what this feature does...">'+esc(s.featureDesc)+'</textarea></div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Equipment</div>' +
            '<div class="cr-field"><input type="text" data-k="equipment" value="' + escAttr(s.equipment) + '" placeholder="e.g. Common clothes, crowbar, lock picks" /></div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Personality Traits</div>' +
            '<div data-group="personalityTraits">' + personalityHtml + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-trait" data-group="personalityTraits" style="margin-top:8px;">+ Add Trait</button>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Ideals</div>' +
            '<div data-group="ideals">' + idealsHtml + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-trait" data-group="ideals" style="margin-top:8px;">+ Add Ideal</button>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Bonds</div>' +
            '<div data-group="bonds">' + bondsHtml + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-trait" data-group="bonds" style="margin-top:8px;">+ Add Bond</button>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Flaws</div>' +
            '<div data-group="flaws">' + flawsHtml + '</div>' +
            '<button type="button" class="cr-btn" data-act="add-trait" data-group="flaws" style="margin-top:8px;">+ Add Flaw</button>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Specialty <span class="hint">optional variant name</span></div>' +
            '<div class="cr-field"><input type="text" data-k="specialty" value="' + escAttr(s.specialty) + '" placeholder="e.g. Spy" /></div>' +
          '</div>' +

          '<div class="cr-section">' +
            '<div class="cr-section-label">Publishing & Sharing</div>' +
            '<div class="cr-field"><label>Add to Campaign</label>' +
              '<select data-k="campaignId"><option value="">— Not attached —</option></select>' +
            '</div>' +
            '<div class="cr-field"><label class="cr-toggle"><input type="checkbox" data-k="isPublic"' + (s.isPublic ? ' checked' : '') + ' /> Make public in the community library</label></div>' +
          '</div>' +

        '</div>' +

        '<div class="cr-preview-pane">' +
          '<h2>Live Preview</h2>' +
          renderBackgroundCard(s) +
        '</div>' +
      '</div>';

    populateCampaignDropdown(s);
    setSyncState('');
  }

  function renderBackgroundCard(s) {
    var skillsClean = (s.skills || '').trim() || '—';
    var toolsClean = (s.tools || '').trim();
    var langLine = s.languages && parseInt(s.languages, 10) > 0 ? ', and ' + s.languages + ' extra language' + (s.languages > 1 ? 's' : '') : '';
    var profLine = 'Skills: ' + skillsClean + (toolsClean ? ', Tools: ' + toolsClean : '') + langLine;

    var equipClean = (s.equipment || '').trim();
    var personalityClean = (s.personalityTraits || []).filter(function(t) { return t && t.trim(); });
    var idealsClean = (s.ideals || []).filter(function(t) { return t && t.trim(); });
    var bondsClean = (s.bonds || []).filter(function(t) { return t && t.trim(); });
    var flawsClean = (s.flaws || []).filter(function(t) { return t && t.trim(); });

    var html = '<div class="cr-spellcard">' +
      '<img src="logo.png" alt="Phmurt" class="cr-sc-brand" />' +
      '<div class="cr-sc-name">' + esc(s.name) + '</div>' +
      '<div class="cr-sc-meta">' + profLine + '</div>';

    if (s.feature || s.featureDesc) {
      html += '<div class="cr-sc-higher"><strong>' + esc(s.feature || 'Feature') + '</strong>' +
        (s.featureDesc ? '<div style="margin-top:6px;">' + (U.renderMarkdown ? U.renderMarkdown(s.featureDesc) : esc(s.featureDesc)) + '</div>' : '') +
      '</div>';
    }

    if (equipClean) {
      html += '<div class="cr-sc-row"><strong>Equipment:</strong> ' + esc(equipClean) + '</div>';
    }

    if (personalityClean.length || idealsClean.length || bondsClean.length || flawsClean.length) {
      html += '<div class="cr-sc-higher" style="margin-top:10px;">';
      if (personalityClean.length) {
        html += '<div style="margin-bottom:8px;"><strong>Personality Traits:</strong><ul style="margin:4px 0 0 22px;padding:0;">' +
          personalityClean.map(function(t) { return '<li>' + esc(t) + '</li>'; }).join('') +
        '</ul></div>';
      }
      if (idealsClean.length) {
        html += '<div style="margin-bottom:8px;"><strong>Ideals:</strong><ul style="margin:4px 0 0 22px;padding:0;">' +
          idealsClean.map(function(t) { return '<li>' + esc(t) + '</li>'; }).join('') +
        '</ul></div>';
      }
      if (bondsClean.length) {
        html += '<div style="margin-bottom:8px;"><strong>Bonds:</strong><ul style="margin:4px 0 0 22px;padding:0;">' +
          bondsClean.map(function(t) { return '<li>' + esc(t) + '</li>'; }).join('') +
        '</ul></div>';
      }
      if (flawsClean.length) {
        html += '<div><strong>Flaws:</strong><ul style="margin:4px 0 0 22px;padding:0;">' +
          flawsClean.map(function(t) { return '<li>' + esc(t) + '</li>'; }).join('') +
        '</ul></div>';
      }
      html += '</div>';
    }

    if (s.specialty) {
      html += '<div class="cr-sc-row" style="margin-top:10px;"><strong>Specialty:</strong> ' + esc(s.specialty) + '</div>';
    }

    html += '</div>';
    return html;
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
    var k = t.getAttribute('data-k');
    var group = t.getAttribute('data-group');
    var idx = t.getAttribute('data-idx');
    if (k) {
      if (t.type === 'checkbox') state.current[k] = t.checked;
      else if (k === 'languages') state.current[k] = parseInt(t.value, 10) || 0;
      else state.current[k] = t.value;
    } else if (t.hasAttribute('data-list') && group && idx !== null) {
      var i = parseInt(idx, 10);
      if (!state.current[group]) state.current[group] = [];
      state.current[group][i] = t.value;
    }
    render(); cloudSync();
  }
  function onClick(e) {
    var t = e.target.closest('[data-act]'); if (!t) return;
    var a = t.getAttribute('data-act');
    var g = t.getAttribute('data-group');
    var i = t.getAttribute('data-idx');
    if (a === 'close') return close();
    if (a === 'save') return save();
    if (a === 'delete') return del();
    if (a === 'export') return exportPng();
    if (a === 'add-trait') {
      if (!state.current[g]) state.current[g] = [];
      state.current[g].push('');
      render();
      return;
    }
    if (a === 'remove-trait') {
      if (state.current[g]) {
        state.current[g].splice(parseInt(i, 10), 1);
        render();
      }
      return;
    }
  }
  function onKeydown(e) {
    if (e.key !== 'Escape') return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (['input', 'textarea', 'select'].indexOf(tag) !== -1) return;
    close();
  }

  function save() {
    if (!state.current.name || !state.current.name.trim()) { if (U.showToast) U.showToast('Error', 'Name is required'); else alert('Name is required'); return; }
    if (!state.current.skills || !state.current.skills.trim()) { if (U.showToast) U.showToast('Error', 'Skills are required'); else alert('Skills are required'); return; }
    if (!state.current.feature || !state.current.feature.trim()) { if (U.showToast) U.showToast('Error', 'Feature name is required'); else alert('Feature name is required'); return; }
    if (!state.current.featureDesc || !state.current.featureDesc.trim()) { if (U.showToast) U.showToast('Error', 'Feature description is required'); else alert('Feature description is required'); return; }
    if (!state.current.clientId) state.current.clientId = generateClientId();
    state.current.personalityTraits = (state.current.personalityTraits || []).filter(function(t) { return t && t.trim(); });
    state.current.ideals = (state.current.ideals || []).filter(function(t) { return t && t.trim(); });
    state.current.bonds = (state.current.bonds || []).filter(function(t) { return t && t.trim(); });
    state.current.flaws = (state.current.flaws || []).filter(function(t) { return t && t.trim(); });
    var list = loadAll();
    state.current.id = state.current.id || state.current.clientId;
    var idx = list.findIndex(function(b) { return b.id === state.current.id; });
    if (idx >= 0) list[idx] = state.current; else list.push(state.current);
    saveAll(list);
    if (global._homebrewBackgrounds !== undefined) global._homebrewBackgrounds = list;
    if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
    cloudSync(); close();
  }
  function del() {
    var doDelete = function() {
      var list = loadAll().filter(function(b) { return b.id !== state.current.id; });
      saveAll(list);
      if (global._homebrewBackgrounds !== undefined) global._homebrewBackgrounds = list;
      if (typeof global.cmpRenderContent === 'function') global.cmpRenderContent();
      close();
    };
    if (U.showConfirm) U.showConfirm('Delete this background? This cannot be undone.', doDelete);
    else if (confirm('Delete this background?')) doDelete();
  }
  function exportPng() {
    var card = document.querySelector('#creator-root .cr-spellcard');
    if (!card || typeof global.html2canvas !== 'function') { if (U.showToast) U.showToast('Error', 'PNG export not available.'); else alert('PNG export not available.'); return; }
    global.html2canvas(card, { backgroundColor: null, scale: 2 }).then(function(canvas) {
      canvas.toBlob(function(blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a'); a.href = url; a.download = (state.current.name || 'background') + '.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function() { URL.revokeObjectURL(url); }, 1000);
      });
    });
  }
  function populateCampaignDropdown(s) {
    var sel = document.querySelector('#creator-root select[data-k="campaignId"]'); if (!sel) return;
    var campaigns = (global.phmurtCampaigns && global.phmurtCampaigns.list) || [];
    campaigns.forEach(function(c) {
      var o = document.createElement('option'); o.value = c.id;
      o.textContent = c.name + (c.role === 'dm' ? ' (DM)' : ' (Player)');
      if (s.campaignId === c.id) o.selected = true;
      sel.appendChild(o);
    });
  }

  function openBackground(editId) {
    var root = document.getElementById('creator-root'); if (!root) return;
    var list = loadAll();
    var existing = editId ? list.find(function(b) { return b.id === editId; }) : null;
    state.current = existing ? Object.assign(defaultBackground(), existing) : defaultBackground();
    if (!state.current.personalityTraits) state.current.personalityTraits = [];
    if (!state.current.ideals) state.current.ideals = [];
    if (!state.current.bonds) state.current.bonds = [];
    if (!state.current.flaws) state.current.flaws = [];
    state.editId = editId || null;
    root.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    render(); wireEvents();
    try { history.replaceState({}, '', location.pathname + '?create=background' + (editId ? '&id=' + editId : '')); } catch (e) { }
  }
  function close() {
    var root = document.getElementById('creator-root'); if (!root) return;
    root.setAttribute('hidden', '');
    document.body.style.overflow = '';
    state.current = null; state.editId = null;
    try { var url = new URL(location.href); url.searchParams.delete('create'); url.searchParams.delete('id'); history.replaceState({}, '', url.toString()); } catch (e) { }
  }
  function maybeAutoOpen() { try { var q = new URLSearchParams(location.search); if (q.get('create') === 'background') openBackground(q.get('id') || null); } catch (e) { } }

  global.PhmurtBackgroundCreator = { openBackground: openBackground, close: close };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', maybeAutoOpen);
  else maybeAutoOpen();
})(window);
