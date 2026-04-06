(function () {
  // ── HTML sanitizer for user content ──
  window.psEscapeHtml = function(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // ── Admin verification (server-side check) ────────────────────────────
  // Admin status is now verified through the database profile flag (is_admin)
  // rather than client-side email list comparison. This prevents exposing
  // admin identities to all users and improves security.
  function _shellIsAdmin() {
    try {
      var raw = localStorage.getItem('phmurt_auth_session');
      var s = raw ? JSON.parse(raw) : null;
      if (!s) return false;
      // Use the isAdmin flag from the profile/session, verified server-side
      return !!(s.isAdmin === true);
    } catch(e) { return false; }
  }

  const SHELL = {
    nav: [
      { href: 'index.html', label: 'Home' },
      { label: 'Content', children: [
        { href: 'grimoire.html', label: 'Grimoire' },
        { href: 'compendium.html', label: 'Compendium' }
      ]},
      { label: 'Players', children: [
        { href: 'learn.html', label: 'Learn to Play' },
        { href: 'gallery.html', label: 'Character Gallery' },
        { href: 'character-builder.html', label: 'Character Builder' },
        { href: 'character-sheets.html', label: 'Character Sheets' }
      ]},
      { label: 'DM Tools', children: [
        { href: 'generators.html', label: 'Random Generators' },
        { href: 'campaigns.html', label: 'Campaign Manager' }
      ]},
      { href: 'about.html', label: 'About' },
      { href: 'my-characters.html', label: 'My Characters' }
      // Admin link is injected dynamically by updateAuthNav()
    ],
    // flat list for mobile menu and backwards compat
    flatNav: [
      ['index.html', 'Home'],
      ['grimoire.html', 'Grimoire'],
      ['compendium.html', 'Compendium'],
      ['learn.html', 'Learn'],
      ['gallery.html', 'Gallery'],
      ['generators.html', 'Generators'],
      ['character-builder.html', 'Builder'],
      ['character-sheets.html', 'Sheets'],
      ['campaigns.html', 'Campaigns'],
      ['about.html', 'About'],
      ['my-characters.html', 'My Characters']
      // Admin link is injected dynamically by updateAuthNav()
    ],
    footerName: 'Phmurt Studios',
    footerCopy: 'Roll Well. Play Weird.'
  };

  const BREADCRUMBS = {
    'index.html': [
      { label: 'Home', current: true }
    ],
    'about.html': [
      { href: 'index.html', label: 'Home' },
      { label: 'About', current: true }
    ],
    'grimoire.html': [
      { href: 'index.html', label: 'Home' },
      { label: 'Grimoire', current: true }
    ],
    'compendium.html': [
      { href: 'index.html', label: 'Home' },
      { label: 'Compendium', current: true }
    ],
    'character-builder.html': [
      { href: 'index.html', label: 'Home' },
      { label: 'Character Builder', current: true }
    ],
    'character-builder-35.html': [
      { href: 'index.html', label: 'Home' },
      { href: 'character-sheets.html', label: 'Sheets' },
      { label: 'D&D 3.5e Builder', current: true }
    ],
    'character-sheets.html': [
      { href: 'index.html', label: 'Home' },
      { label: 'Character Sheets', current: true }
    ],
    'sheet-dnd5e.html': [
      { href: 'index.html', label: 'Home' },
      { href: 'character-sheets.html', label: 'Sheets' },
      { label: 'D&D 5e Sheet', current: true }
    ],
    'soup-savant.html': [
      { href: 'index.html', label: 'Home' },
      { href: 'grimoire.html', label: 'Grimoire' },
      { label: 'Soup Savant', current: true }
    ],
    'legendary.html': [
      { href: 'index.html', label: 'Home' },
      { href: 'grimoire.html', label: 'Grimoire' },
      { label: 'Legendary Soups', current: true }
    ],
    'learn.html': [
      { href: 'index.html', label: 'Home' },
      { label: 'Learn to Play', current: true }
    ],
    'gallery.html': [
      { href: 'index.html', label: 'Home' },
      { label: 'Character Gallery', current: true }
    ],
    'generators.html': [
      { href: 'index.html', label: 'Home' },
      { label: 'DM Generators', current: true }
    ],
    'campaigns.html': [
      { href: 'index.html', label: 'Home' },
      { label: 'Campaigns', current: true }
    ],
    'my-characters.html': [
      { href: 'index.html', label: 'Home' },
      { label: 'My Characters', current: true }
    ],
    'reset-password.html': [
      { href: 'index.html', label: 'Home' },
      { label: 'Reset Password', current: true }
    ],
    '404.html': [
      { href: 'index.html', label: 'Home' },
      { label: 'Page Not Found', current: true }
    ]
  };

  function normalizePath(path) {
    if (!path || path === '/' || path.endsWith('/')) return 'index.html';
    return path.split('/').pop();
  }

  // Map page filenames to which top-level nav label should be active
  // For dropdown parents, use the dropdown label so the parent highlights
  function activeNavFor(pageName, explicit) {
    if (explicit) return explicit;
    const map = {
      'index.html': 'Home',
      'grimoire.html': 'Content',
      'compendium.html': 'Content',
      'soup-savant.html': 'Content',
      'legendary.html': 'Content',
      'learn.html': 'Players',
      'gallery.html': 'Players',
      'character-builder.html': 'Players',
      'character-builder-35.html': 'Players',
      'character-sheets.html': 'Players',
      'sheet-dnd5e.html': 'Players',
      'generators.html': 'DM Tools',
      'campaigns.html': 'DM Tools',
      'about.html': 'About',
      'my-characters.html': 'My Characters',
      'reset-password.html': null
    };
    return map[pageName] ?? null;
  }

  function getFooterCopy() {
    return document.body?.dataset.footerCopy || SHELL.footerCopy;
  }

  function getPageName() {
    return normalizePath(window.location.pathname);
  }

  function parseBreadcrumbData() {
    const raw = document.body?.dataset.breadcrumb;
    if (!raw) return null;
    const items = raw.split(';').map(part => part.trim()).filter(Boolean).map((part, index, arr) => {
      const [labelPart, hrefPart] = part.split('|').map(v => (v || '').trim());
      return {
        label: labelPart,
        href: hrefPart || undefined,
        current: !hrefPart || index === arr.length - 1
      };
    }).filter(item => item.label);
    return items.length ? items : null;
  }

  function navMarkup(activeLabel) {
    // Desktop nav with dropdown support
    const links = SHELL.nav.map(item => {
      if (item.children) {
        const isActive = item.label === activeLabel;
        const childLinks = item.children.map(c =>
          `<a href="${c.href}" class="ps-dropdown-link">${c.label}</a>`
        ).join('');
        return `<div class="ps-nav-dropdown${isActive ? ' active' : ''}">
          <button class="ps-nav-dropdown-btn${isActive ? ' active' : ''}" type="button">${item.label} <span class="ps-nav-caret">▾</span></button>
          <div class="ps-dropdown-panel">${childLinks}</div>
        </div>`;
      }
      return `<a href="${item.href}"${item.label === activeLabel ? ' class="active"' : ''}>${item.label}</a>`;
    }).join('');

    // Mobile nav uses flat list with group headers
    let mobileLinks = '';
    SHELL.nav.forEach((item, index) => {
      if (item.children) {
        mobileLinks += `<div class="ps-mobile-group-label">${item.label}</div>`;
        item.children.forEach(c => {
          mobileLinks += `<a href="${c.href}">${c.label}</a>`;
        });
        mobileLinks += '<div class="ps-mobile-divider"></div>';
      } else {
        if (index > 0) mobileLinks += '<div class="ps-mobile-divider"></div>';
        mobileLinks += `<a href="${item.href}"${item.label === activeLabel ? ' class="active"' : ''}>${item.label}</a>`;
      }
    });

    return `
      <nav class="ps-nav" role="navigation" aria-label="Main navigation">
        <div class="ps-nav-links">${links}<a href="admin.html" id="nav-admin-link" style="display:none">Admin</a></div>
        <div class="ps-nav-right">
          <div class="ps-dice-wrapper">
            <button class="ps-dice-btn" title="Roll d20" onclick="PhmurtDice.quickRoll()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">
                <polygon points="12,2 22,19 2,19"/>
                <polygon points="12,7 18,17 6,17"/>
                <line x1="12" y1="2" x2="12" y2="7"/>
                <line x1="22" y1="19" x2="18" y2="17"/>
                <line x1="2" y1="19" x2="6" y2="17"/>
              </svg>
            </button>
            <div class="ps-dice-popup" id="dicePopup"></div>
          </div>
          <button class="ps-theme-toggle" id="themeToggle" type="button" aria-label="Toggle theme" onclick="toggleTheme()">☽</button>
          <div class="nav-auth-wrap">
            <button id="nav-auth-btn" type="button">Sign In</button>
            <div id="nav-user-dropdown"></div>
          </div>
          <button class="ps-hamburger" id="hamburger" type="button" aria-label="Menu" aria-controls="mobileMenu" aria-expanded="false"><span></span><span></span><span></span></button>
        </div>
      </nav>

      <div class="ps-mobile-menu" id="mobileMenu" aria-hidden="true">
        <button class="ps-mobile-close" id="mobileClose" type="button">✕ Close</button>
        ${mobileLinks}
        <a href="admin.html" id="mobile-admin-link" style="display:none">Admin</a>
      </div>
    `;
  }

  function breadcrumbMarkup(items) {
    if (!items || !items.length) return '';
    return `
      <nav class="ps-breadcrumb" aria-label="Breadcrumb">
        ${items.map((item, index) => {
          const crumb = item.current || !item.href
            ? `<span class="current">${item.label}</span>`
            : `<a href="${item.href}">${item.label}</a>`;
          const sep = index < items.length - 1 ? '<span class="sep">/</span>' : '';
          return crumb + sep;
        }).join('')}
      </nav>
    `;
  }

  function footerMarkup() {
    return `
      <footer class="ps-footer" role="contentinfo">
        <div class="ps-footer-logo">
          <img src="logo.png" alt="Phmurt Studios" />
          <span class="ps-footer-name">${SHELL.footerName}</span>
        </div>
        <div class="ps-footer-copy">${getFooterCopy()}</div>
      </footer>
    `;
  }

  function syncThemeButton() {
    const saved = localStorage.getItem('phmurt_theme') || 'dark';
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = (saved === 'light' ? '☀' : '☽');
  }

  // Wrap toggleTheme to add smooth transition class
  (function enhanceThemeToggle() {
    let attempts = 0;
    const maxAttempts = 20;
    const tryBind = () => {
      if (typeof window.toggleTheme !== 'function') {
        attempts += 1;
        if (attempts < maxAttempts) setTimeout(tryBind, 150);
        return;
      }
      const origToggle = window.toggleTheme;
      window.toggleTheme = function() {
        document.documentElement.classList.add('theme-transition');
        origToggle.apply(this, arguments);
        syncThemeButton();
        setTimeout(() => document.documentElement.classList.remove('theme-transition'), 500);
      };
    };
    tryBind();
  })();

  function ensureShell() {
    const pageName = getPageName();
    const activeLabel = activeNavFor(pageName, document.body?.dataset.navActive || null);

    // Skip-nav link (accessibility)
    if (!document.querySelector('.ps-skip-nav')) {
      const skip = document.createElement('a');
      skip.href = '#main-content';
      skip.className = 'ps-skip-nav';
      skip.textContent = 'Skip to content';
      document.body.insertBefore(skip, document.body.firstChild);
    }

    const navMount = document.getElementById('ps-site-shell');
    if (navMount) navMount.innerHTML = navMarkup(activeLabel);

    // Add main-content id to first content area
    const mainTarget = document.querySelector('.ps-page-hero, .ps-hero, .cb-wrap, .cs-wrap, .ps-content, main');
    if (mainTarget && !mainTarget.id) mainTarget.id = 'main-content';

    const breadcrumbMount = document.getElementById('ps-page-breadcrumb');
    if (breadcrumbMount) {
      const crumbs = parseBreadcrumbData() || BREADCRUMBS[pageName] || [];
      breadcrumbMount.innerHTML = breadcrumbMarkup(crumbs);
    }

    const footerMount = document.getElementById('ps-site-footer');
    if (footerMount) footerMount.innerHTML = footerMarkup();

    syncThemeButton();
    setupBackToTop();
  }

  function setupBackToTop() {
    if (document.querySelector('.ps-top-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'ps-top-btn';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&#8593;';
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          btn.classList.toggle('visible', window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function _getAuthSession() {
    /* Prefer PhmurtDB (covers both Supabase and legacy sessions) */
    if (typeof PhmurtDB !== 'undefined' && PhmurtDB.getSession) {
      return PhmurtDB.getSession();
    }
    /* Fallback: read localStorage directly */
    try { return JSON.parse(localStorage.getItem('phmurt_auth_session') || 'null'); }
    catch(e) { return null; }
  }

  function updateAuthNav() {
    var btn = document.getElementById('nav-auth-btn');
    var dd  = document.getElementById('nav-user-dropdown');
    if (!btn) return;

    var session = _getAuthSession();

    var isAdmin = !!(session && session.isAdmin === true);

    // ── Show/hide Admin nav links (desktop + mobile) ────────────
    var adminLink       = document.getElementById('nav-admin-link');
    var mobileAdminLink = document.getElementById('mobile-admin-link');
    if (adminLink)       adminLink.style.display       = isAdmin ? '' : 'none';
    if (mobileAdminLink) mobileAdminLink.style.display = isAdmin ? '' : 'none';

    if (session && session.userId) {
      // ── Signed in ──────────────────────────────────────────────
      var display = (session.displayName || session.name || session.email || 'Account').trim();
      btn.textContent = display.length > 16
        ? display.split(' ').map(function(w){ return w[0]; }).join('').toUpperCase().slice(0,2)
        : display;
      btn.title = display;
      btn.setAttribute('data-signed-in', '1');
      btn.style.borderColor = 'var(--crimson-border)';
      btn.style.color       = 'var(--text)';

      if (dd) {
        dd.innerHTML =
          '<div style="font-family:Spectral,serif;font-size:12px;color:var(--text-muted);padding:9px 14px 8px;border-bottom:1px solid var(--border-mid);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px;">' + psEscapeHtml(display) + '</div>' +
          '<a href="my-characters.html">My Characters</a>' +
          '<button id="nav-signout-btn">Sign Out</button>';

        var soBtn = document.getElementById('nav-signout-btn');
        if (soBtn) {
          soBtn.addEventListener('click', function() {
            if (typeof PhmurtDB !== 'undefined' && PhmurtDB.signOut) {
              PhmurtDB.signOut();
            } else {
              localStorage.removeItem('phmurt_auth_session');
              window.dispatchEvent(new Event('phmurt-auth-change'));
            }
            dd.classList.remove('open');
            if (typeof window.psToast === 'function') window.psToast('Signed out.');
          });
        }
      }
    } else {
      // ── Signed out ─────────────────────────────────────────────
      btn.textContent = 'Sign In';
      btn.title = '';
      btn.removeAttribute('data-signed-in');
      btn.style.borderColor = '';
      btn.style.color       = '';
      if (dd) { dd.innerHTML = ''; dd.classList.remove('open'); }
    }
  }

  function wireAuthButton() {
    const btn = document.getElementById('nav-auth-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (btn.getAttribute('data-signed-in')) {
        // Toggle user dropdown
        var dd = document.getElementById('nav-user-dropdown');
        if (dd) dd.classList.toggle('open');
        return;
      }
      if (window.PhmurtDB && typeof window.PhmurtDB.openAuth === 'function') {
        window.PhmurtDB.openAuth();
        return;
      }
      window.location.href = 'my-characters.html';
    });
  }

  function setupMobileNav() {
    const ham = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    const close = document.getElementById('mobileClose');
    if (!ham || !menu) return;

    const setOpen = (open) => {
      ham.classList.toggle('open', open);
      menu.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-hidden', String(!open));
      document.body.classList.toggle('menu-open', open);
    };

    ham.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
    if (close) close.addEventListener('click', () => setOpen(false));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('click', (e) => {
      if (!menu.classList.contains('open')) return;
      if (e.target.closest('#mobileMenu') || e.target.closest('#hamburger')) return;
      setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) setOpen(false);
    });
  }

  function setupNavDropdowns() {
    var closeTimer = null;

    document.querySelectorAll('.ps-nav-dropdown').forEach(function(dd) {
      // Mouse enter — open immediately, cancel any pending close
      dd.addEventListener('mouseenter', function() {
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        // Close all others first
        document.querySelectorAll('.ps-nav-dropdown.open').forEach(function(other) {
          if (other !== dd) other.classList.remove('open');
        });
        dd.classList.add('open');
      });

      // Mouse leave — close after short delay so user can move to panel
      dd.addEventListener('mouseleave', function() {
        var ref = dd;
        closeTimer = setTimeout(function() {
          ref.classList.remove('open');
          closeTimer = null;
        }, 200);
      });

      // Click toggle for touch devices
      var btn = dd.querySelector('.ps-nav-dropdown-btn');
      if (btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var wasOpen = dd.classList.contains('open');
          document.querySelectorAll('.ps-nav-dropdown.open').forEach(function(d) { d.classList.remove('open'); });
          if (!wasOpen) dd.classList.add('open');
        });
      }
    });

    // Click outside closes all
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.ps-nav-dropdown')) {
        document.querySelectorAll('.ps-nav-dropdown.open').forEach(function(d) { d.classList.remove('open'); });
      }
    });

    // Escape closes all
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.ps-nav-dropdown.open').forEach(function(d) { d.classList.remove('open'); });
      }
    });
  }

  function setupPageTransitions() {
    document.querySelectorAll('a[href]').forEach((a) => {
      if (a.dataset.noTransition === 'true') return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (/^(https?:)?\/\//i.test(href)) return;
      if (!href.endsWith('.html')) return;

      a.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        document.body.classList.add('page-out');
        window.setTimeout(() => { window.location.href = href; }, 180);
      });
    });
  }

  function setupReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length || !('IntersectionObserver' in window)) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => obs.observe(el));
  }

  function setupAuthDropdownClose() {
    document.addEventListener('click', function (e) {
      if (e.target.closest('.nav-auth-wrap')) return;
      const dd = document.getElementById('nav-user-dropdown');
      if (dd) dd.classList.remove('open');
    });
  }


  window.psToast = function(message, duration) {
    duration = duration || 3000;
    const existing = document.getElementById('ps-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'ps-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function() { toast.classList.add('visible'); });
    setTimeout(function() {
      toast.classList.remove('visible');
      setTimeout(function() { toast.remove(); }, 300);
    }, duration);
  };

  /* ── Page visit tracking ─────────────────────────────────────────────
     Logs the current page to the Supabase `site_visits` table.
     Fires after DOMContentLoaded so supabase-config.js has run.
     Silently skips if Supabase is not configured.                    ── */
  function trackPageVisit() {
    try {
      var sb = (typeof phmurtSupabase !== 'undefined') ? phmurtSupabase : null;
      if (!sb) return;
      var page = window.location.pathname.split('/').pop() || 'index.html';
      var userId = null;
      try {
        var raw = localStorage.getItem('phmurt_auth_session');
        var sess = raw ? JSON.parse(raw) : null;
        if (sess && sess.userId) userId = sess.userId;
      } catch(e) {}
      sb.from('site_visits').insert({ page: page, user_id: userId || null }).then(function() {}).catch(function() {});
    } catch(e) {}
  }

  // ── Dice Roller ──
  window.PhmurtDice = {
    _history: [],
    _selectedDie: 20,
    _count: 1,
    _panelOpen: false,

    quickRoll: function() {
      var popup = document.getElementById('dicePopup');
      if (!popup) return;

      // Toggle panel open/close
      if (PhmurtDice._panelOpen) {
        popup.classList.remove('visible');
        PhmurtDice._panelOpen = false;
        return;
      }

      PhmurtDice._panelOpen = true;
      PhmurtDice._renderPanel();
      popup.classList.add('visible');
    },

    _renderPanel: function() {
      var popup = document.getElementById('dicePopup');
      if (!popup) return;

      var dice = [4, 6, 8, 10, 12, 20, 100];
      var diceHtml = dice.map(function(d) {
        var sel = d === PhmurtDice._selectedDie ? ' ps-die-selected' : '';
        return '<button class="ps-die-btn' + sel + '" onclick="event.stopPropagation();PhmurtDice.selectDie(' + d + ')">d' + d + '</button>';
      }).join('');

      var historyHtml = '';
      if (PhmurtDice._history.length) {
        historyHtml = '<div class="ps-dice-history">';
        PhmurtDice._history.slice(-5).reverse().forEach(function(h) {
          var cls = '';
          if (h.max === h.total && h.count === 1) cls = ' nat20';
          if (h.total === h.count) cls = ' nat1';
          historyHtml += '<div class="ps-dice-hist-row"><span class="ps-dice-hist-label">' + h.count + 'd' + h.die + '</span><span class="ps-dice-hist-val' + cls + '">' + h.total + (h.rolls.length > 1 ? ' <span class="ps-dice-hist-detail">(' + h.rolls.join('+') + ')</span>' : '') + '</span></div>';
        });
        historyHtml += '</div>';
      }

      popup.innerHTML =
        '<div class="ps-dice-panel">' +
          '<div class="ps-dice-panel-title">Dice Roller</div>' +
          '<div class="ps-dice-selector">' + diceHtml + '</div>' +
          '<div class="ps-dice-count-row">' +
            '<button class="ps-dice-count-btn" onclick="event.stopPropagation();PhmurtDice.adjustCount(-1)">-</button>' +
            '<span class="ps-dice-count-display">' + PhmurtDice._count + 'd' + PhmurtDice._selectedDie + '</span>' +
            '<button class="ps-dice-count-btn" onclick="event.stopPropagation();PhmurtDice.adjustCount(1)">+</button>' +
          '</div>' +
          '<button class="ps-dice-roll-btn" onclick="event.stopPropagation();PhmurtDice.roll()">Roll</button>' +
          '<div id="diceResult"></div>' +
          historyHtml +
        '</div>';
    },

    selectDie: function(d) {
      PhmurtDice._selectedDie = d;
      PhmurtDice._renderPanel();
    },

    adjustCount: function(delta) {
      PhmurtDice._count = Math.max(1, Math.min(10, PhmurtDice._count + delta));
      PhmurtDice._renderPanel();
    },

    roll: function() {
      var die = PhmurtDice._selectedDie;
      var count = PhmurtDice._count;
      var rolls = [];
      for (var i = 0; i < count; i++) {
        rolls.push(Math.floor(Math.random() * die) + 1);
      }
      var total = rolls.reduce(function(a, b) { return a + b; }, 0);

      PhmurtDice._history.push({ die: die, count: count, rolls: rolls, total: total, max: die });
      if (PhmurtDice._history.length > 20) PhmurtDice._history.shift();

      // Animate button
      var btn = document.querySelector('.ps-dice-btn');
      if (btn) {
        btn.classList.add('rolling');
        setTimeout(function() { btn.classList.remove('rolling'); }, 500);
      }

      PhmurtDice._renderPanel();

      // Flash the result
      var resultEl = document.getElementById('diceResult');
      if (resultEl) {
        var cls = '';
        if (total === die * count) cls = ' nat20';
        if (total === count) cls = ' nat1';
        resultEl.innerHTML = '<div class="ps-dice-result-num' + cls + '">' + total + '</div>' +
          (rolls.length > 1 ? '<div class="ps-dice-result-breakdown">' + rolls.join(' + ') + '</div>' : '');
      }
    },

    _timer: null,
    init: function() {
      document.addEventListener('click', function(e) {
        var wrapper = document.querySelector('.ps-dice-wrapper');
        if (wrapper && !wrapper.contains(e.target)) {
          var popup = document.getElementById('dicePopup');
          if (popup) popup.classList.remove('visible');
          PhmurtDice._panelOpen = false;
        }
      });
    }
  };

  // Outgoing link transitions add body.page-out (opacity:0). If the document is cached in
  // the back/forward cache (bfcache), restoring it brings back that class — the page stays
  // visually blank until a full reload. Clear it whenever the page is shown again.
  window.addEventListener('pageshow', function () {
    if (document.body) document.body.classList.remove('page-out');
  });

  document.addEventListener('DOMContentLoaded', function () {
    if (document.body) document.body.classList.remove('page-out');
    ensureShell();
    updateAuthNav();
    wireAuthButton();
    setupMobileNav();
    setupNavDropdowns();
    setupPageTransitions();
    setupReveal();
    setupAuthDropdownClose();
    PhmurtDice.init();
    window.addEventListener('phmurt-auth-change', updateAuthNav);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(function() {});
    }

    // Track this page visit (fire-and-forget)
    setTimeout(trackPageVisit, 500);
  });
})();
