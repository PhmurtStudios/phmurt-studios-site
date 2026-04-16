/* ══════════════════════════════════════════════════════════════
   phmurt-tour.js  —  Lightweight page tour system
   ──────────────────────────────────────────────────────────────
   Highlights elements with a spotlight cutout and shows a
   tooltip that physically points at each feature. Supports
   CSS selectors and text-matching fallbacks for React apps.

   Usage:
     PhmurtTour.start('character-builder');
     PhmurtTour.start('campaign-manager');
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var TOUR_LS_PREFIX = 'phmurt_tour_';
  var activeTour = null;
  var currentStep = 0;
  var els = {};

  /* ── Tour Definitions ──────────────────────────────────────── */
  var TOURS = {

    'character-builder': [
      {
        target: '#sidebar',
        title: 'Step Navigation',
        text: 'Build your character step by step. Click any step in this sidebar to jump to it. Your progress is tracked as you go.',
        pos: 'right'
      },
      {
        target: '[data-step="1"]',
        title: 'Step 1 \u2014 Race',
        text: 'Start by choosing your race. Each race gives different ability bonuses and traits like darkvision or extra languages.',
        pos: 'right'
      },
      {
        target: '[data-step="2"]',
        title: 'Step 2 \u2014 Class',
        text: 'Your class defines your role: Fighter for melee, Wizard for spells, Rogue for stealth. This is the biggest choice you\'ll make.',
        pos: 'right'
      },
      {
        target: '[data-step="4"]',
        title: 'Ability Scores',
        text: 'Assign your six core stats here. Use Standard Array for a quick balanced spread, or Point Buy for fine-tuned control.',
        pos: 'right'
      },
      {
        target: '#wizard-quickbuild-btn',
        title: 'Quick Build',
        text: 'Short on time? Pick an archetype \u2014 Warrior, Spellcaster, Healer, and more \u2014 and the builder fills everything in for you.',
        pos: 'right'
      },
      {
        target: '.cb-nav-btns',
        title: 'Navigation Buttons',
        text: 'Use these to move between steps. You can also click any step in the sidebar to jump around freely.',
        pos: 'top'
      }
    ],

    'character-sheet': [
      {
        target: '#cs-ability-grid, .cs-ability-grid',
        title: 'Ability Scores',
        text: 'Your six core stats. The large number is the score; the smaller number is the modifier used for all your rolls.',
        pos: 'bottom'
      },
      {
        target: '#cs-ac',
        title: 'Armor Class',
        text: 'How hard you are to hit. Enemies must roll this number or higher on a d20 to land an attack on you.',
        pos: 'bottom'
      },
      {
        target: '#cs-hp-bar, #cs-hp',
        title: 'Hit Points',
        text: 'Your health pool. When this reaches 0, you fall unconscious. Your Hit Die determines how many you gain each level.',
        pos: 'bottom'
      },
      {
        target: '#cs-saves-list',
        title: 'Saving Throws',
        text: 'These resist spells, traps, and effects. A filled dot means you\'re proficient and add your bonus to the roll.',
        pos: 'left'
      },
      {
        target: '#cs-skills-list',
        title: 'Skills',
        text: 'From Stealth to Persuasion \u2014 skills cover everything your character can attempt. Click any skill to roll a check.',
        pos: 'left'
      },
      {
        target: '#cs-features-sec, .cs-section:last-child',
        title: 'Features & Traits',
        text: 'All your racial traits, class features, and background abilities in one place. These define what makes your character unique.',
        pos: 'top'
      }
    ],

    'campaign-manager': [
      {
        findByText: 'CAMPAIGN',
        findParent: 2,
        title: 'Campaign Selector',
        text: 'Switch between campaigns or create a new one. Each campaign is a self-contained world with its own timeline, party, and lore.',
        pos: 'right'
      },
      {
        findByText: 'DASHBOARD',
        title: 'Dashboard Tab',
        text: 'Your campaign overview. Quick stats, active quests, party status, and a checklist to help you get started.',
        pos: 'right'
      },
      {
        findByText: 'TIMELINE',
        title: 'Timeline Tab',
        text: 'Log each session here. Record events, world changes, and story beats. Players see the narrative; DMs see private notes too.',
        pos: 'right'
      },
      {
        findByText: 'PARTY',
        title: 'Party Tab',
        text: 'Manage your adventuring party. Track HP, conditions, and character assignments. Import characters from the Character Builder.',
        pos: 'right'
      },
      {
        findByText: 'INVITE PLAYERS',
        fallbackSelector: '[class*="invite"], button',
        title: 'Invite Players',
        text: 'Generate an invite code and share it. When players enter the code, they join your campaign and see the player view.',
        pos: 'right'
      },
      {
        findByText: 'WORLD',
        title: 'World Tab',
        text: 'Build out your world \u2014 regions, cities, NPCs, and factions. Everything you create here feeds into your sessions.',
        pos: 'right'
      }
    ]
  };

  /* ── CSS ────────────────────────────────────────────────────── */
  function injectCSS() {
    if (document.getElementById('ps-tour-css')) return;
    var s = document.createElement('style');
    s.id = 'ps-tour-css';
    s.textContent = [
      '#ps-tour-bg{position:fixed;inset:0;z-index:99990;pointer-events:auto;}',
      '#ps-tour-bg svg{width:100%;height:100%;}',
      '#ps-tour-tip{position:fixed;z-index:99999;max-width:340px;width:calc(100vw - 24px);pointer-events:auto;opacity:0;transform:translateY(8px);transition:opacity .3s,transform .3s;}',
      '#ps-tour-tip.show{opacity:1;transform:translateY(0);}',
      '#ps-tour-tip-inner{background:var(--bg-card,#141420);border:1px solid var(--crimson-border,rgba(212,67,58,0.36));padding:20px 22px 16px;position:relative;}',
      '#ps-tour-tip-inner::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--crimson,#d4433a),transparent);}',
      '#ps-tour-arrow{position:absolute;width:12px;height:12px;background:var(--bg-card,#141420);border:1px solid var(--crimson-border,rgba(212,67,58,0.36));transform:rotate(45deg);z-index:-1;}',
      '.pst-title{font-family:"Cinzel",serif;font-size:14px;letter-spacing:1.5px;color:var(--text,#f2e8d6);margin-bottom:10px;}',
      '.pst-text{font-family:"Spectral",serif;font-size:14px;color:var(--text-muted,#9a8870);line-height:1.7;margin-bottom:16px;}',
      '.pst-foot{display:flex;justify-content:space-between;align-items:center;}',
      '.pst-cnt{font-family:"Spectral",serif;font-size:12px;color:var(--text-dim,#6b5e50);}',
      '.pst-btns{display:flex;gap:8px;}',
      '.pst-btn{font-family:"Cinzel",serif;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;padding:8px 16px;cursor:pointer;transition:all .15s;min-height:36px;border-radius:2px;}',
      '.pst-skip{background:transparent;border:1px solid var(--border,rgba(255,255,255,0.11));color:var(--text-dim,#6b5e50);}',
      '.pst-skip:hover{border-color:var(--text-muted);color:var(--text-muted);}',
      '.pst-prev{background:transparent;border:1px solid var(--border,rgba(255,255,255,0.11));color:var(--text-muted,#9a8870);}',
      '.pst-next{background:var(--crimson,#d4433a);border:none;color:#f5f0e8;}',
      '.pst-next:hover{background:var(--crimson-dim,#a82a20);}',
      '@media(max-width:480px){#ps-tour-tip{max-width:calc(100vw - 16px);}.pst-title{font-size:12px;}.pst-text{font-size:13px;}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  /* ── Create DOM ────────────────────────────────────────────── */
  function buildUI() {
    if (els.bg) return;

    // SVG backdrop with a hole cut out for the spotlight
    els.bg = document.createElement('div');
    els.bg.id = 'ps-tour-bg';
    els.bg.addEventListener('click', end);
    document.body.appendChild(els.bg);

    // Tooltip
    els.tip = document.createElement('div');
    els.tip.id = 'ps-tour-tip';
    els.tip.innerHTML =
      '<div id="ps-tour-arrow"></div>' +
      '<div id="ps-tour-tip-inner">' +
        '<div class="pst-title" id="pst-title"></div>' +
        '<div class="pst-text" id="pst-text"></div>' +
        '<div class="pst-foot">' +
          '<div class="pst-cnt" id="pst-cnt"></div>' +
          '<div class="pst-btns">' +
            '<button class="pst-btn pst-skip" id="pst-skip">End Tour</button>' +
            '<button class="pst-btn pst-prev" id="pst-prev">\u2190 Back</button>' +
            '<button class="pst-btn pst-next" id="pst-next">Next \u2192</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(els.tip);

    document.getElementById('pst-skip').addEventListener('click', end);
    document.getElementById('pst-prev').addEventListener('click', function () { go(currentStep - 1); });
    document.getElementById('pst-next').addEventListener('click', function () {
      currentStep < activeTour.length - 1 ? go(currentStep + 1) : end();
    });
  }

  /* ── Find Target ───────────────────────────────────────────── */
  function findEl(step) {
    // Try CSS selector first
    if (step.target) {
      var parts = step.target.split(',');
      for (var i = 0; i < parts.length; i++) {
        try {
          var el = document.querySelector(parts[i].trim());
          if (el && el.offsetWidth > 0) return el;
        } catch (e) { /* invalid selector */ }
      }
    }
    // Text-based search: find a visible element whose text content matches
    if (step.findByText) {
      var needle = step.findByText.toUpperCase();
      var candidates = document.querySelectorAll('button, span, div, a, [role="tab"]');
      for (var j = 0; j < candidates.length; j++) {
        var c = candidates[j];
        if (c.offsetWidth === 0) continue;
        var txt = (c.textContent || '').trim().toUpperCase();
        if (txt === needle || txt.indexOf(needle) === 0) {
          // Optionally walk up to a parent
          var result = c;
          if (step.findParent) {
            for (var p = 0; p < step.findParent; p++) {
              if (result.parentElement) result = result.parentElement;
            }
          }
          return result;
        }
      }
    }
    if (step.fallbackSelector) {
      try { return document.querySelector(step.fallbackSelector); } catch (e) {}
    }
    return null;
  }

  /* ── Draw Spotlight SVG ────────────────────────────────────── */
  function drawSpotlight(rect) {
    var vw = window.innerWidth, vh = window.innerHeight;
    var pad = 6;
    var x = Math.max(0, rect.left - pad);
    var y = Math.max(0, rect.top - pad);
    var w = rect.width + pad * 2;
    var h = rect.height + pad * 2;
    var r = 4;

    els.bg.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + vw + '" height="' + vh + '">' +
        '<defs><mask id="pst-mask">' +
          '<rect width="100%" height="100%" fill="white"/>' +
          '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="black"/>' +
        '</mask></defs>' +
        '<rect width="100%" height="100%" fill="rgba(0,0,0,0.65)" mask="url(#pst-mask)"/>' +
        '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="none" stroke="var(--crimson,#d4433a)" stroke-width="2"/>' +
      '</svg>';
  }

  /* ── Position Tooltip + Arrow ──────────────────────────────── */
  function positionTip(rect, pos) {
    var tip = els.tip;
    var arrow = document.getElementById('ps-tour-arrow');
    var tw = Math.min(340, window.innerWidth - 24);
    var gap = 16;

    tip.classList.remove('show');
    tip.style.width = tw + 'px';

    var left, top;
    var aw = 12; // arrow size

    if (pos === 'right') {
      left = rect.right + gap;
      top = rect.top + rect.height / 2 - 50;
      if (left + tw > window.innerWidth - 12) { pos = 'left'; left = rect.left - tw - gap; }
      if (left < 12) left = 12;
      arrow.style.cssText = 'left:-7px;top:40px;';
      arrow.style.borderRight = 'none'; arrow.style.borderTop = 'none';
    } else if (pos === 'left') {
      left = rect.left - tw - gap;
      top = rect.top + rect.height / 2 - 50;
      if (left < 12) { left = rect.right + gap; }
      arrow.style.cssText = 'right:-7px;top:40px;';
      arrow.style.borderLeft = 'none'; arrow.style.borderBottom = 'none';
    } else if (pos === 'top') {
      left = rect.left + (rect.width - tw) / 2;
      top = rect.top - 180;
      if (top < 12) { top = rect.bottom + gap; }
      arrow.style.cssText = 'bottom:-7px;left:50%;margin-left:-6px;';
      arrow.style.borderTop = 'none'; arrow.style.borderLeft = 'none';
    } else { /* bottom */
      left = rect.left + (rect.width - tw) / 2;
      top = rect.bottom + gap;
      arrow.style.cssText = 'top:-7px;left:50%;margin-left:-6px;';
      arrow.style.borderBottom = 'none'; arrow.style.borderRight = 'none';
    }

    left = Math.max(12, Math.min(left, window.innerWidth - tw - 12));
    top = Math.max(12, Math.min(top, window.innerHeight - 180));

    tip.style.left = left + 'px';
    tip.style.top = top + 'px';

    requestAnimationFrame(function () { tip.classList.add('show'); });
  }

  /* ── Go To Step ────────────────────────────────────────────── */
  function go(n) {
    if (!activeTour || n < 0 || n >= activeTour.length) return;
    currentStep = n;
    var step = activeTour[n];

    document.getElementById('pst-title').textContent = step.title;
    document.getElementById('pst-text').textContent = step.text;
    document.getElementById('pst-cnt').textContent = (n + 1) + ' / ' + activeTour.length;
    document.getElementById('pst-prev').style.display = n > 0 ? '' : 'none';
    document.getElementById('pst-next').textContent = n < activeTour.length - 1 ? 'Next \u2192' : 'Finish';

    var target = findEl(step);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(function () {
        var rect = target.getBoundingClientRect();
        drawSpotlight(rect);
        positionTip(rect, step.pos || 'bottom');
      }, 300);
    } else {
      // No target found — show centered
      var vw = window.innerWidth, vh = window.innerHeight;
      els.bg.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="' + vw + '" height="' + vh + '"><rect width="100%" height="100%" fill="rgba(0,0,0,0.65)"/></svg>';
      document.getElementById('ps-tour-arrow').style.display = 'none';
      els.tip.style.left = Math.max(12, (vw - 340) / 2) + 'px';
      els.tip.style.top = Math.max(80, vh / 3) + 'px';
      els.tip.classList.add('show');
    }
  }

  /* ── Start ─────────────────────────────────────────────────── */
  function start(id) {
    var steps = TOURS[id];
    if (!steps) return;
    injectCSS();
    buildUI();
    activeTour = steps;
    currentStep = 0;
    els.bg.style.display = 'block';
    els.tip.style.display = 'block';
    go(0);
    try { localStorage.setItem(TOUR_LS_PREFIX + id, '1'); } catch (e) {}
  }

  /* ── End ───────────────────────────────────────────────────── */
  function end() {
    activeTour = null;
    if (els.bg) els.bg.style.display = 'none';
    if (els.tip) { els.tip.classList.remove('show'); els.tip.style.display = 'none'; }
  }

  function hasSeen(id) {
    try { return localStorage.getItem(TOUR_LS_PREFIX + id) === '1'; } catch (e) { return false; }
  }

  window.PhmurtTour = { start: start, end: end, hasSeen: hasSeen };
})();
