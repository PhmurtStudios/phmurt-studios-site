/* ══════════════════════════════════════════════════════════════
   phmurt-tour.js  —  Lightweight page tour system
   ──────────────────────────────────────────────────────────────
   Highlights elements on the page with a spotlight overlay and
   shows contextual tooltips. Used for character builder/sheet
   and campaign manager onboarding tours.

   Usage:
     PhmurtTour.start('character-builder');
     PhmurtTour.start('campaign-manager');

   Tours auto-start on first visit (localStorage flag) and can
   be re-triggered via a "Take Tour" button.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var TOUR_LS_PREFIX = 'phmurt_tour_';
  var activeTour = null;
  var currentStep = 0;
  var overlay = null;
  var tooltip = null;
  var spotlight = null;

  /* ── Tour Definitions ──────────────────────────────────────── */
  var TOURS = {

    /* Character Builder tour */
    'character-builder': [
      {
        target: '#sidebar',
        title: 'Step Navigation',
        text: 'Build your character step by step. Click any step to jump to it. The sidebar tracks your progress and shows a summary of your choices.',
        position: 'right'
      },
      {
        target: '[data-step="1"]',
        title: 'Race Selection',
        text: 'Start here. Your race determines ability score bonuses, traits like darkvision, and extra proficiencies. Click a race card to see its details.',
        position: 'right'
      },
      {
        target: '[data-step="4"]',
        title: 'Ability Scores',
        text: 'Your six core stats. Use Standard Array for a balanced spread or Point Buy for full control. Put your highest score in your class\'s primary ability.',
        position: 'right'
      },
      {
        target: '#sidebarSummary',
        title: 'Character Summary',
        text: 'Your character preview updates live as you make choices. Check back here to see how your build is shaping up.',
        position: 'right'
      },
      {
        target: '#wizard-quickbuild-btn',
        title: 'Quick Build',
        text: 'Short on time? Quick Build lets you pick an archetype and instantly fills in race, class, background, and ability scores.',
        position: 'right'
      },
      {
        target: '.cb-nav-btns',
        title: 'Navigation',
        text: 'Use Continue to move forward, or click any step in the sidebar to jump around. Your choices are saved automatically.',
        position: 'top'
      }
    ],

    /* Character Sheet tour (step 9 / summary view) */
    'character-sheet': [
      {
        target: '.cs-ability-grid',
        title: 'Ability Scores',
        text: 'Your six core attributes. The large number is your score, the smaller number below is the modifier used for rolls. Racial bonuses are already included.',
        position: 'bottom'
      },
      {
        target: '.cs-stat-row',
        title: 'Combat Stats',
        text: 'Armor Class (how hard you are to hit), Initiative (turn order in combat), Speed (how far you move per turn), and Hit Points (your health).',
        position: 'bottom'
      },
      {
        target: '#cs-saves-list',
        title: 'Saving Throws',
        text: 'Saving throws resist effects like spells and traps. The filled dot means you\'re proficient in that save and add your proficiency bonus.',
        position: 'left'
      },
      {
        target: '#cs-skills-list',
        title: 'Skills',
        text: 'Skills cover everything from Stealth to Persuasion. Proficient skills (filled dot) add your proficiency bonus. Click any skill to roll a check.',
        position: 'left'
      },
      {
        target: '#cs-features-sec',
        title: 'Features and Traits',
        text: 'Racial traits, class features, and background abilities. These define what makes your character unique beyond raw numbers.',
        position: 'top'
      },
      {
        target: '.cs-init-btn, [onclick*="rollCheck"]',
        title: 'Interactive Rolls',
        text: 'Click any highlighted stat to roll dice. The builder automatically calculates your modifiers and shows the result.',
        position: 'top'
      }
    ],

    /* Campaign Manager tour */
    'campaign-manager': [
      {
        target: '.cm-sidebar-campaigns, [class*="sidebar"]',
        title: 'Campaign List',
        text: 'All your campaigns appear here. Click one to open it. Each campaign is a complete world with its own timeline, NPCs, quests, and party.',
        position: 'right',
        fallbackText: true
      },
      {
        target: '[class*="tab"][class*="active"], [data-tab="dashboard"]',
        title: 'Dashboard',
        text: 'Your campaign overview. See recent activity, party status, active quests, and quick stats all in one place.',
        position: 'bottom',
        fallbackText: true
      },
      {
        target: '[data-tab="timeline"], [class*="timeline"]',
        title: 'Session Timeline',
        text: 'Every session is recorded chronologically. Add session summaries, key events, and world changes. Players see the narrative; DMs see behind-the-scenes notes.',
        position: 'bottom',
        fallbackText: true
      },
      {
        target: '[data-tab="party"], [class*="party"]',
        title: 'Party Management',
        text: 'Track your adventuring party. View character stats, manage HP, apply conditions, and assign characters to players who join your campaign.',
        position: 'bottom',
        fallbackText: true
      },
      {
        target: '[class*="invite"], [onclick*="Invite"]',
        title: 'Invite Players',
        text: 'Generate invite codes to bring players into your campaign. Share the code or link \u2014 when they join, they\'ll see the player view of your world.',
        position: 'bottom',
        fallbackText: true
      },
      {
        target: '[data-tab="world"], [class*="world"]',
        title: 'World Building',
        text: 'Define regions, cities, NPCs, and factions. Everything you create here can be referenced in sessions and quests.',
        position: 'bottom',
        fallbackText: true
      }
    ]
  };

  /* ── CSS Injection ─────────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('phmurt-tour-styles')) return;
    var style = document.createElement('style');
    style.id = 'phmurt-tour-styles';
    style.textContent =
      '#ps-tour-overlay{position:fixed;inset:0;z-index:99998;pointer-events:none;}' +
      '#ps-tour-backdrop{position:fixed;inset:0;z-index:99997;background:rgba(0,0,0,0.65);transition:opacity .25s;pointer-events:auto;}' +
      '#ps-tour-spotlight{position:fixed;z-index:99999;border:2px solid var(--crimson,#d4433a);border-radius:4px;box-shadow:0 0 0 9999px rgba(0,0,0,0.6);pointer-events:none;transition:all .3s ease;}' +
      '#ps-tour-tooltip{position:fixed;z-index:100000;background:var(--bg-card,#141420);border:1px solid var(--crimson-border,rgba(212,67,58,0.36));max-width:340px;width:100%;padding:20px 22px 16px;pointer-events:auto;transition:opacity .25s,transform .25s;opacity:0;transform:translateY(8px);}' +
      '#ps-tour-tooltip.visible{opacity:1;transform:translateY(0);}' +
      '#ps-tour-tooltip::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--crimson,#d4433a),transparent);}' +
      '.ps-tour-title{font-family:"Cinzel",serif;font-size:14px;letter-spacing:1.5px;color:var(--text,#f2e8d6);margin-bottom:10px;}' +
      '.ps-tour-text{font-family:"Spectral",serif;font-size:14px;color:var(--text-muted,#9a8870);line-height:1.7;margin-bottom:16px;}' +
      '.ps-tour-footer{display:flex;justify-content:space-between;align-items:center;}' +
      '.ps-tour-counter{font-family:"Spectral",serif;font-size:12px;color:var(--text-dim,#6b5e50);}' +
      '.ps-tour-btns{display:flex;gap:8px;}' +
      '.ps-tour-btn{font-family:"Cinzel",serif;font-size:9px;letter-spacing:1.5px;text-transform:uppercase;padding:8px 16px;cursor:pointer;transition:all .15s;min-height:36px;border-radius:2px;}' +
      '.ps-tour-btn-skip{background:transparent;border:1px solid var(--border,rgba(255,255,255,0.11));color:var(--text-dim,#6b5e50);}' +
      '.ps-tour-btn-skip:hover{border-color:var(--text-muted);color:var(--text-muted);}' +
      '.ps-tour-btn-next{background:var(--crimson,#d4433a);border:none;color:#f5f0e8;}' +
      '.ps-tour-btn-next:hover{background:var(--crimson-dim,#a82a20);}' +
      '.ps-tour-btn-prev{background:transparent;border:1px solid var(--border,rgba(255,255,255,0.11));color:var(--text-muted,#9a8870);}' +
      '.ps-tour-btn-prev:hover{border-color:var(--text-muted);}' +
      '@media(max-width:480px){#ps-tour-tooltip{max-width:calc(100vw - 24px);padding:16px 14px 12px;}.ps-tour-title{font-size:12px;}.ps-tour-text{font-size:13px;}}';
    document.head.appendChild(style);
  }

  /* ── DOM Setup ──────────────────────────────────────────────── */
  function createElements() {
    if (overlay) return;

    var backdrop = document.createElement('div');
    backdrop.id = 'ps-tour-backdrop';
    backdrop.addEventListener('click', endTour);
    document.body.appendChild(backdrop);

    spotlight = document.createElement('div');
    spotlight.id = 'ps-tour-spotlight';
    document.body.appendChild(spotlight);

    tooltip = document.createElement('div');
    tooltip.id = 'ps-tour-tooltip';
    tooltip.innerHTML =
      '<div class="ps-tour-title" id="ps-tour-title"></div>' +
      '<div class="ps-tour-text" id="ps-tour-text"></div>' +
      '<div class="ps-tour-footer">' +
        '<div class="ps-tour-counter" id="ps-tour-counter"></div>' +
        '<div class="ps-tour-btns">' +
          '<button class="ps-tour-btn ps-tour-btn-skip" id="ps-tour-skip">End Tour</button>' +
          '<button class="ps-tour-btn ps-tour-btn-prev" id="ps-tour-prev">\u2190 Back</button>' +
          '<button class="ps-tour-btn ps-tour-btn-next" id="ps-tour-next">Next \u2192</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(tooltip);

    document.getElementById('ps-tour-skip').addEventListener('click', endTour);
    document.getElementById('ps-tour-prev').addEventListener('click', function () { goStep(currentStep - 1); });
    document.getElementById('ps-tour-next').addEventListener('click', function () {
      if (currentStep < activeTour.length - 1) {
        goStep(currentStep + 1);
      } else {
        endTour();
      }
    });

    overlay = true;
  }

  /* ── Find Target Element ───────────────────────────────────── */
  function findTarget(step) {
    var selectors = step.target.split(',');
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i].trim());
      if (el && el.offsetParent !== null) return el;
    }
    return null;
  }

  /* ── Position Tooltip ──────────────────────────────────────── */
  function positionTooltip(targetEl, step) {
    var rect = targetEl.getBoundingClientRect();
    var pos = step.position || 'bottom';
    var pad = 14;
    var tw = Math.min(340, window.innerWidth - 24);

    tooltip.style.width = tw + 'px';

    // Remove visibility temporarily to measure
    tooltip.classList.remove('visible');

    var left, top;

    if (pos === 'right') {
      left = rect.right + pad;
      top = rect.top;
      if (left + tw > window.innerWidth - 12) {
        left = rect.left - tw - pad;
        if (left < 12) left = 12;
      }
    } else if (pos === 'left') {
      left = rect.left - tw - pad;
      top = rect.top;
      if (left < 12) left = rect.right + pad;
    } else if (pos === 'top') {
      left = rect.left + (rect.width - tw) / 2;
      top = rect.top - tooltip.offsetHeight - pad;
      if (top < 12) top = rect.bottom + pad;
    } else { /* bottom */
      left = rect.left + (rect.width - tw) / 2;
      top = rect.bottom + pad;
    }

    // Clamp to viewport
    left = Math.max(12, Math.min(left, window.innerWidth - tw - 12));
    top = Math.max(12, Math.min(top, window.innerHeight - 120));

    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';

    requestAnimationFrame(function () {
      tooltip.classList.add('visible');
    });
  }

  /* ── Show a Step ───────────────────────────────────────────── */
  function goStep(n) {
    if (!activeTour || n < 0 || n >= activeTour.length) return;
    currentStep = n;
    var step = activeTour[n];

    // Update content
    document.getElementById('ps-tour-title').textContent = step.title;
    document.getElementById('ps-tour-text').textContent = step.text;
    document.getElementById('ps-tour-counter').textContent = (n + 1) + ' of ' + activeTour.length;

    // Prev/Next button states
    document.getElementById('ps-tour-prev').style.display = n > 0 ? '' : 'none';
    document.getElementById('ps-tour-next').textContent = n < activeTour.length - 1 ? 'Next \u2192' : 'Finish';

    // Find target element
    var targetEl = findTarget(step);

    if (targetEl) {
      // Scroll element into view
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(function () {
        var rect = targetEl.getBoundingClientRect();
        var sp = 6; // spotlight padding

        spotlight.style.display = 'block';
        spotlight.style.left = (rect.left - sp) + 'px';
        spotlight.style.top = (rect.top - sp) + 'px';
        spotlight.style.width = (rect.width + sp * 2) + 'px';
        spotlight.style.height = (rect.height + sp * 2) + 'px';

        positionTooltip(targetEl, step);
      }, 350);
    } else {
      // No target found — position tooltip in center
      spotlight.style.display = 'none';
      tooltip.style.left = Math.max(12, (window.innerWidth - 340) / 2) + 'px';
      tooltip.style.top = Math.max(80, window.innerHeight / 3) + 'px';
      tooltip.classList.add('visible');
    }
  }

  /* ── Start Tour ────────────────────────────────────────────── */
  function startTour(tourId) {
    var steps = TOURS[tourId];
    if (!steps || steps.length === 0) return;

    injectStyles();
    createElements();

    activeTour = steps;
    currentStep = 0;

    document.getElementById('ps-tour-backdrop').style.display = 'block';
    spotlight.style.display = 'block';
    tooltip.style.display = 'block';

    goStep(0);

    // Mark as seen
    try { localStorage.setItem(TOUR_LS_PREFIX + tourId, '1'); } catch (e) {}
  }

  /* ── End Tour ──────────────────────────────────────────────── */
  function endTour() {
    if (!activeTour) return;
    activeTour = null;

    var backdrop = document.getElementById('ps-tour-backdrop');
    if (backdrop) backdrop.style.display = 'none';
    if (spotlight) spotlight.style.display = 'none';
    if (tooltip) {
      tooltip.classList.remove('visible');
      tooltip.style.display = 'none';
    }
  }

  /* ── Has Seen Tour ─────────────────────────────────────────── */
  function hasSeen(tourId) {
    try { return localStorage.getItem(TOUR_LS_PREFIX + tourId) === '1'; } catch (e) { return false; }
  }

  /* ── Public API ────────────────────────────────────────────── */
  window.PhmurtTour = {
    start: startTour,
    end: endTour,
    hasSeen: hasSeen,
    tours: TOURS
  };

})();
