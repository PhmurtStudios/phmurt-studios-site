window.PhmurtBuilderCommon = (function(){
  function initAppShell(){
    var ham = document.getElementById('hamburger');
    var menu = document.getElementById('mobileMenu');
    var close = document.getElementById('mobileClose');
    if (ham && menu) {
      ham.addEventListener('click', function(){
        ham.classList.toggle('open');
        menu.classList.toggle('open');
      });
    }
    if (close && ham && menu) {
      close.addEventListener('click', function(){
        ham.classList.remove('open');
        menu.classList.remove('open');
      });
    }
    if (menu && ham) {
      menu.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', function(){
          ham.classList.remove('open');
          menu.classList.remove('open');
        });
      });
    }
    document.addEventListener('click', function(e){
      if (menu && ham && menu.classList.contains('open') && !e.target.closest('#mobileMenu') && !e.target.closest('#hamburger')) {
        ham.classList.remove('open');
        menu.classList.remove('open');
      }
      if (!e.target.closest('.nav-auth-wrap')) {
        document.getElementById('nav-user-dropdown')?.classList.remove('open');
      }
    });
    document.querySelectorAll('a[href]').forEach(function(a){
      var href = a.getAttribute('href');
      if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('mailto')) {
        a.addEventListener('click', function(e){
          e.preventDefault();
          window.location.href = href;
        });
      }
    });
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('.reveal').forEach(function(el){
        obs.observe(el);
      });
    }
  }

  function clone(value){
    if (value === undefined) return undefined;
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (e) {
      console.warn('Clone failed for value:', e);
      return undefined;
    }
  }

  function createDebounced(fn, wait){
    var timer = null;
    return function(){
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function(){
        fn.apply(null, args);
      }, wait || 0);
    };
  }

  function saveDraft(key, payload){
    if (!key || typeof key !== 'string') {
      console.warn('Invalid draft key');
      return false;
    }
    try {
      localStorage.setItem('phmurt_builder_draft_' + key, JSON.stringify({ savedAt: Date.now(), payload: payload }));
      return true;
    } catch (err) {
      console.warn('Draft save failed:', err);
      return false;
    }
  }

  function loadDraft(key){
    if (!key || typeof key !== 'string') {
      return null;
    }
    try {
      var raw = localStorage.getItem('phmurt_builder_draft_' + key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.payload) return null;
      return parsed;
    } catch (err) {
      console.warn('Draft load failed:', err);
      return null;
    }
  }

  function clearDraft(key){
    if (!key || typeof key !== 'string') return;
    localStorage.removeItem('phmurt_builder_draft_' + key);
  }

  function formatRelative(ts){
    if (!ts) return 'recently';
    var delta = Math.max(0, Date.now() - ts);
    var mins = Math.round(delta / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + ' minute' + (mins === 1 ? '' : 's') + ' ago';
    var hrs = Math.round(mins / 60);
    if (hrs < 24) return hrs + ' hour' + (hrs === 1 ? '' : 's') + ' ago';
    var days = Math.round(hrs / 24);
    return days + ' day' + (days === 1 ? '' : 's') + ' ago';
  }

  function maybeOfferDraftRestore(opts){
    if (!opts || !opts.key) return null;
    var draft = loadDraft(opts.key);
    if (!draft || !draft.payload) return null;
    if (typeof opts.shouldOffer === 'function' && !opts.shouldOffer(draft)) return draft;

    var host = document.createElement('div');
    host.className = 'builder-recovery-bar';

    var cardDiv = document.createElement('div');
    cardDiv.className = 'builder-recovery-card';

    var copyDiv = document.createElement('div');
    copyDiv.className = 'builder-recovery-copy';

    var titleDiv = document.createElement('div');
    titleDiv.className = 'builder-recovery-title';
    titleDiv.textContent = 'Draft Recovery Available';

    var textDiv = document.createElement('div');
    textDiv.className = 'builder-recovery-text';
    textDiv.textContent = (opts.message || 'A local builder draft was found from ') + formatRelative(draft.savedAt) + '.';

    copyDiv.appendChild(titleDiv);
    copyDiv.appendChild(textDiv);

    var actionsDiv = document.createElement('div');
    actionsDiv.className = 'builder-recovery-actions';

    var restoreBtn = document.createElement('button');
    restoreBtn.type = 'button';
    restoreBtn.className = 'builder-recovery-btn primary';
    restoreBtn.setAttribute('data-builder-restore', '');
    restoreBtn.textContent = 'Restore Draft';

    var dismissBtn = document.createElement('button');
    dismissBtn.type = 'button';
    dismissBtn.className = 'builder-recovery-btn';
    dismissBtn.setAttribute('data-builder-dismiss', '');
    dismissBtn.textContent = 'Discard';

    actionsDiv.appendChild(restoreBtn);
    actionsDiv.appendChild(dismissBtn);

    cardDiv.appendChild(copyDiv);
    cardDiv.appendChild(actionsDiv);
    host.appendChild(cardDiv);

    var anchor = document.querySelector(opts.insertAfter || '.ps-breadcrumb');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(host, anchor.nextSibling);
    } else {
      document.body.insertBefore(host, document.body.firstChild);
    }

    restoreBtn.addEventListener('click', function(){
      if (typeof opts.onRestore === 'function') opts.onRestore(draft.payload, draft);
      host.remove();
    });

    dismissBtn.addEventListener('click', function(){
      clearDraft(opts.key);
      if (typeof opts.onDismiss === 'function') opts.onDismiss(draft);
      host.remove();
    });

    return draft;
  }

  function applyStateFields(target, source, fields){
    if (!target || !source || !Array.isArray(fields)) return target;
    fields.forEach(function(key){
      if (source[key] !== undefined) target[key] = clone(source[key]);
    });
    return target;
  }

  function writeCurrencyInputs(currency, prefix){
    if (!currency) return;
    ['cp','sp','ep','gp','pp'].forEach(function(coin){
      var el = document.getElementById((prefix || 'coin-') + coin);
      if (el && currency[coin] !== undefined) {
        var val = parseInt(currency[coin], 10);
        if (!isNaN(val) && val >= 0) {
          el.value = val;
        }
      }
    });
  }

  function readCurrencyInputs(prefix){
    var out = {};
    ['cp','sp','ep','gp','pp'].forEach(function(coin){
      var el = document.getElementById((prefix || 'coin-') + coin);
      var val = el ? parseInt(el.value, 10) : 0;
      out[coin] = !isNaN(val) ? Math.max(0, val) : 0;
    });
    return out;
  }

  function setTransientStatus(el, message, timeout){
    if (!el) return;
    el.textContent = message || '';
    if (timeout && timeout > 0) {
      setTimeout(function(){
        if (el.textContent === message) el.textContent = '';
      }, timeout);
    }
  }

  function getEditionKeys(edition){
    var normalized = edition === '3.5' || edition === '35e' ? '35e' : '5e';
    if (normalized === '35e') {
      return {
        loadKey: 'cb35_load_char_id',
        editKey: 'phmurt_edit_char35_id',
        currentKey: 'phmurt_current_char35_id',
        draftKey: '35e'
      };
    }
    return {
      loadKey: 'phmurt_load_char_id',
      editKey: 'phmurt_edit_char_id',
      currentKey: 'phmurt_current_char_id',
      draftKey: '5e'
    };
  }

  async function loadCharacterForEdit(opts){
    if (typeof PhmurtDB === 'undefined') return null;
    opts = opts || {};
    var keys = getEditionKeys(opts.edition);
    var storageKey = opts.storageKey || keys.loadKey;
    var id = localStorage.getItem(storageKey);
    if (!id || typeof id !== 'string') return null;
    localStorage.removeItem(storageKey);
    var data = await PhmurtDB.loadCharacter(id);
    if (!data) return null;
    if (opts.expectedEdition && data.edition !== opts.expectedEdition) return null;
    if (typeof opts.onData === 'function') opts.onData(data, id, keys);
    if (opts.persistEditKeys !== false) {
      localStorage.setItem(keys.editKey, id);
      localStorage.setItem(keys.currentKey, id);
    }
    return { id: id, data: data, keys: keys };
  }

  async function saveCharacterSnapshot(opts){
    opts = opts || {};
    if (typeof PhmurtDB === 'undefined') {
      return { success: false, error: 'Auth not loaded.' };
    }
    var session = PhmurtDB.getSession();
    if (!session) {
      return { success: false, error: 'Not signed in.' };
    }
    var keys = getEditionKeys(opts.edition);
    var existingId = opts.existingId || localStorage.getItem(keys.editKey) || undefined;
    var snapshot = typeof opts.getSnapshot === 'function' ? opts.getSnapshot() : opts.snapshot;
    var result = await PhmurtDB.saveCharacter(snapshot, existingId);
    if (result && result.success && result.id) {
      // SECURITY (V-044): Only update localStorage if database save succeeded with valid ID
      // This prevents marking a character as "current" if sync fails
      try {
        localStorage.setItem(keys.editKey, result.id);
        localStorage.setItem(keys.currentKey, result.id);
      } catch (e) {
        console.warn('[BuilderCommon] localStorage update failed:', e);
        // Database succeeded but localStorage failed - character is saved but edit state may be lost
        // This is recoverable on next load, so continue with success
      }
      if (typeof opts.onSuccess === 'function') opts.onSuccess(result, snapshot, keys);
    } else if (typeof opts.onError === 'function') {
      opts.onError(result, snapshot, keys);
    }
    return result;
  }

  return {
    initAppShell: initAppShell,
    clone: clone,
    createDebounced: createDebounced,
    saveDraft: saveDraft,
    loadDraft: loadDraft,
    clearDraft: clearDraft,
    maybeOfferDraftRestore: maybeOfferDraftRestore,
    formatRelative: formatRelative,
    applyStateFields: applyStateFields,
    writeCurrencyInputs: writeCurrencyInputs,
    readCurrencyInputs: readCurrencyInputs,
    setTransientStatus: setTransientStatus,
    getEditionKeys: getEditionKeys,
    loadCharacterForEdit: loadCharacterForEdit,
    saveCharacterSnapshot: saveCharacterSnapshot
  };
})();
