/* ══════════════════════════════════════════════════════════════
   builder-wizard.js  —  Guided onboarding for the Character Builder
   ──────────────────────────────────────────────────────────────
   Shows contextual tips, beginner recommendations, and a
   "Quick Build" option for first-time users. Injects an overlay
   system that hooks into the existing goToStep() navigation.

   Activation:
     • Auto-shows on first visit (localStorage flag)
     • Manual toggle via "Guide" button in sidebar
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var LS_KEY = 'phmurt_builder_wizard_seen';
  var LS_QB_KEY = 'phmurt_quickbuild_used';

  /* ── Quick Build Archetypes ─────────────────────────────────── */
  var ARCHETYPES = [
    {
      id: 'warrior',
      icon: '⚔️',
      title: 'The Warrior',
      desc: 'A straightforward melee fighter. High Strength, tough armor, simple to play.',
      race: 'human', cls: 'fighter', bg: 'soldier',
      abilities: { str: 15, dex: 13, con: 14, int: 8, wis: 12, cha: 10 },
      tip: 'Fighters are great for beginners — you get lots of hit points and can use any weapon or armor.'
    },
    {
      id: 'spellcaster',
      icon: '🔮',
      title: 'The Spellcaster',
      desc: 'A magical powerhouse. High Intelligence, arcane spells, endless versatility.',
      race: 'elf', cls: 'wizard', bg: 'sage',
      abilities: { str: 8, dex: 14, con: 13, int: 15, wis: 12, cha: 10 },
      tip: 'Wizards have the largest spell list in the game. You start fragile but grow incredibly powerful.'
    },
    {
      id: 'healer',
      icon: '✨',
      title: 'The Healer',
      desc: 'A divine protector. High Wisdom, healing magic, solid in both support and combat.',
      race: 'dwarf', cls: 'cleric', bg: 'acolyte',
      abilities: { str: 14, dex: 10, con: 13, int: 8, wis: 15, cha: 12 },
      tip: 'Clerics can wear heavy armor AND cast spells. Every party wants a cleric.'
    },
    {
      id: 'sneaky',
      icon: '🗡️',
      title: 'The Sneak',
      desc: 'A cunning rogue. High Dexterity, stealth, massive sneak attack damage.',
      race: 'halfling', cls: 'rogue', bg: 'criminal',
      abilities: { str: 10, dex: 15, con: 13, int: 12, wis: 14, cha: 8 },
      tip: 'Rogues deal huge damage with Sneak Attack and have tons of skill proficiencies.'
    },
    {
      id: 'nature',
      icon: '🌿',
      title: 'The Ranger',
      desc: 'A wilderness tracker. Good at range and melee, with some nature magic.',
      race: 'elf', cls: 'ranger', bg: 'outlander',
      abilities: { str: 12, dex: 15, con: 13, int: 10, wis: 14, cha: 8 },
      tip: 'Rangers are versatile — great archers with tracking skills and nature spells at level 2.'
    },
    {
      id: 'talker',
      icon: '🎭',
      title: 'The Face',
      desc: 'A charismatic bard. High Charisma, social skills, support magic, jack of all trades.',
      race: 'half_elf', cls: 'bard', bg: 'entertainer',
      abilities: { str: 8, dex: 14, con: 12, int: 10, wis: 13, cha: 15 },
      tip: 'Bards excel at social encounters and can fill almost any party role with their flexible spell list.'
    }
  ];

  /* ── Step Guide Tips ────────────────────────────────────────── */
  var STEP_TIPS = {
    1: {
      title: 'Choose Your Race',
      tip: 'Your race determines your appearance, ability score bonuses, and special traits like darkvision or extra languages. For your first character, <strong>Human</strong> is versatile, <strong>Elf</strong> is great for spellcasters, and <strong>Dwarf</strong> is perfect for tough melee fighters.',
      hint: 'Look at the ability score bonuses — they should complement the class you want to play.'
    },
    2: {
      title: 'Pick Your Class',
      tip: 'Your class defines how you play — what weapons you use, what abilities you have, and your role in the party. <strong>Fighter</strong> and <strong>Rogue</strong> are the simplest to learn. <strong>Cleric</strong> and <strong>Wizard</strong> are great if you want spells.',
      hint: 'The class description shows Hit Die (how tough you are), Primary Ability (what stat to focus on), and Saving Throw proficiencies.'
    },
    3: {
      title: 'Select a Background',
      tip: 'Backgrounds represent your character\'s life before adventuring. They give you extra skill proficiencies, tool proficiencies, and sometimes equipment. Pick one that fits the story you want to tell.',
      hint: 'The skill proficiencies from your background stack with your class skills — pick ones that complement rather than overlap.'
    },
    4: {
      title: 'Set Ability Scores',
      tip: 'These six scores define your character\'s raw capabilities. <strong>Standard Array</strong> (15, 14, 13, 12, 10, 8) is the easiest method. Put your highest score in your class\'s primary ability.',
      hint: 'Constitution affects your hit points at every level — don\'t dump it below 10 unless you have a specific build in mind.'
    },
    5: {
      title: 'Choose Skills',
      tip: 'Skills let you do specific things well — Stealth for sneaking, Persuasion for talking, Perception for noticing hidden things. Pick skills that match how you want to play.',
      hint: 'Perception is widely considered the most useful skill in D&D. If it\'s an option, it\'s rarely a bad choice.'
    },
    6: {
      title: 'Pick Equipment',
      tip: 'Choose your starting weapons and gear. Most choices are between a stronger weapon or a versatile loadout. If you have high Strength, pick melee weapons. High Dexterity? Go for ranged or finesse weapons.',
      hint: 'You\'ll find more equipment during adventures — don\'t stress too much about getting the perfect loadout right now.'
    },
    7: {
      title: 'Select Spells',
      tip: 'Pick your known spells and cantrips. Cantrips can be used unlimited times. For first-level spells, mix damage spells with at least one utility spell. <strong>Cantrips to consider:</strong> damage (Fire Bolt, Sacred Flame) and utility (Light, Mage Hand, Prestidigitation).',
      hint: 'Having one crowd control spell (like Sleep or Entangle) can completely change a fight.'
    },
    8: {
      title: 'Add Details',
      tip: 'Give your character a name, personality, and backstory. This is where your character comes alive! You don\'t need to write a novel — even a few sentences about who they are and why they adventure is enough.',
      hint: 'A character flaw makes for much more interesting roleplay than a perfect hero.'
    }
  };

  /* ── DOM Injection ──────────────────────────────────────────── */
  function _esc(v) {
    return String(v == null ? '' : v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function injectWizardUI() {
    /* Guide toggle button in sidebar */
    var sidebar = document.getElementById('sidebar');
    if (sidebar) {
      var guideBtn = document.createElement('button');
      guideBtn.id = 'wizard-guide-btn';
      guideBtn.innerHTML = '📖 Guide';
      guideBtn.title = 'Toggle step-by-step guide';
      guideBtn.style.cssText = 'display:block;width:100%;margin-top:12px;padding:8px 12px;font-family:Cinzel,serif;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;background:rgba(212,67,58,0.06);border:1px solid rgba(212,67,58,0.15);color:var(--crimson,#d4433a);border-radius:4px;cursor:pointer;transition:all .15s;';
      guideBtn.addEventListener('click', function () {
        var tip = document.getElementById('wizard-step-tip');
        if (tip) {
          tip.style.display = tip.style.display === 'none' ? 'block' : 'none';
          try {
            localStorage.setItem('phmurt_wizard_tips_visible', tip.style.display === 'none' ? '0' : '1');
          } catch (e) {}
        }
      });
      sidebar.appendChild(guideBtn);
    }

    /* Step tip container (inserted at top of .cb-main) */
    var main = document.querySelector('.cb-main');
    if (main) {
      var tipDiv = document.createElement('div');
      tipDiv.id = 'wizard-step-tip';
      tipDiv.style.cssText = 'margin-bottom:20px;padding:16px 20px;background:rgba(212,67,58,0.04);border:1px solid rgba(212,67,58,0.12);border-radius:6px;display:block;';
      tipDiv.innerHTML = '<div id="wizard-tip-content"></div>';
      main.insertBefore(tipDiv, main.firstChild);

      /* Respect saved visibility */
      try {
        if (localStorage.getItem('phmurt_wizard_tips_visible') === '0') {
          tipDiv.style.display = 'none';
        }
      } catch (e) {}
    }

    /* Welcome overlay */
    var overlay = document.createElement('div');
    overlay.id = 'wizard-welcome';
    overlay.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(8,8,10,0.85);z-index:10001;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.innerHTML =
      '<div id="wizard-welcome-modal" style="background:var(--bg-card,#141420);border:1px solid var(--border,rgba(255,255,255,0.11));border-radius:8px;max-width:700px;width:100%;max-height:90vh;overflow-y:auto;padding:40px 36px;">' +
        '<div style="text-align:center;margin-bottom:28px;">' +
          '<div style="font-size:36px;margin-bottom:12px;">⚔️</div>' +
          '<h2 style="font-family:Cinzel,serif;font-size:22px;color:var(--text,#f2e8d6);margin:0 0 8px;">Welcome to the Character Builder</h2>' +
          '<p style="font-family:Spectral,serif;font-size:15px;color:var(--text-muted,#9a8870);margin:0;">Choose how you\'d like to build your character.</p>' +
        '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px;">' +
          '<button id="wizard-mode-guided" style="padding:20px 16px;background:rgba(212,67,58,0.06);border:1px solid rgba(212,67,58,0.2);border-radius:6px;cursor:pointer;text-align:left;">' +
            '<div style="font-family:Cinzel,serif;font-size:13px;font-weight:600;color:var(--crimson,#d4433a);margin-bottom:6px;">📖 Guided Mode</div>' +
            '<div style="font-family:Spectral,serif;font-size:13px;color:var(--text-muted,#9a8870);line-height:1.5;">Step-by-step tips and recommendations at each stage. Great for first-timers.</div>' +
          '</button>' +
          '<button id="wizard-mode-free" style="padding:20px 16px;background:transparent;border:1px solid var(--border,rgba(255,255,255,0.11));border-radius:6px;cursor:pointer;text-align:left;">' +
            '<div style="font-family:Cinzel,serif;font-size:13px;font-weight:600;color:var(--text,#f2e8d6);margin-bottom:6px;">🎲 Free Build</div>' +
            '<div style="font-family:Spectral,serif;font-size:13px;color:var(--text-muted,#9a8870);line-height:1.5;">Jump right in and make your own choices. Tips available in the sidebar any time.</div>' +
          '</button>' +
        '</div>' +
        '<div style="border-top:1px solid var(--border,rgba(255,255,255,0.11));padding-top:24px;">' +
          '<div style="font-family:Cinzel,serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--text-dim,#6b5e50);margin-bottom:16px;text-align:center;">Or try a Quick Build</div>' +
          '<div id="wizard-archetypes" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;"></div>' +
        '</div>' +
        '<button id="wizard-welcome-close" style="display:block;margin:24px auto 0;padding:8px 28px;font-family:Cinzel,serif;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;background:transparent;border:1px solid var(--border,rgba(255,255,255,0.11));color:var(--text-dim,#6b5e50);border-radius:4px;cursor:pointer;">Skip</button>' +
      '</div>';
    document.body.appendChild(overlay);

    /* Mobile responsive rules for wizard overlay */
    var wizStyle = document.createElement('style');
    wizStyle.textContent = '@media(max-width:480px){#wizard-welcome>div{padding:28px 18px !important;max-width:calc(100vw - 24px) !important;}#wizard-archetypes{grid-template-columns:repeat(2,1fr) !important;}}@media(max-width:375px){#wizard-welcome>div>div:nth-child(2){grid-template-columns:1fr !important;}#wizard-archetypes{grid-template-columns:1fr !important;gap:8px !important;}#wizard-welcome h2{font-size:18px !important;}}';
    document.head.appendChild(wizStyle);

    /* Archetype cards */
    var archGrid = document.getElementById('wizard-archetypes');
    ARCHETYPES.forEach(function (a) {
      var card = document.createElement('button');
      card.className = 'wizard-archetype';
      card.setAttribute('data-arch', a.id);
      card.style.cssText = 'padding:12px 10px;background:transparent;border:1px solid var(--border,rgba(255,255,255,0.11));border-radius:6px;cursor:pointer;text-align:center;transition:all .15s;';
      card.innerHTML =
        '<div style="font-size:22px;margin-bottom:4px;">' + a.icon + '</div>' +
        '<div style="font-family:Cinzel,serif;font-size:10px;letter-spacing:1px;color:var(--text,#f2e8d6);margin-bottom:3px;">' + _esc(a.title) + '</div>' +
        '<div style="font-family:Spectral,serif;font-size:11px;color:var(--text-dim,#6b5e50);line-height:1.4;">' + _esc(a.desc) + '</div>';
      card.addEventListener('mouseenter', function () { card.style.borderColor = 'rgba(212,67,58,0.3)'; });
      card.addEventListener('mouseleave', function () { card.style.borderColor = ''; });
      card.addEventListener('click', function () { applyQuickBuild(a); });
      archGrid.appendChild(card);
    });

    /* Wire mode buttons */
    document.getElementById('wizard-mode-guided').addEventListener('click', function () {
      closeWelcome();
      enableGuidedMode();
    });
    document.getElementById('wizard-mode-free').addEventListener('click', function () {
      closeWelcome();
      disableGuidedMode();
    });
    document.getElementById('wizard-welcome-close').addEventListener('click', function () {
      closeWelcome();
      disableGuidedMode();
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) { closeWelcome(); disableGuidedMode(); }
    });
  }

  /* ── Welcome Overlay Control ────────────────────────────────── */
  function showWelcome() {
    var el = document.getElementById('wizard-welcome');
    if (el) el.style.display = 'flex';
  }

  function closeWelcome() {
    var el = document.getElementById('wizard-welcome');
    if (el) el.style.display = 'none';
    try { localStorage.setItem(LS_KEY, '1'); } catch (e) {}
  }

  /* ── Guided Mode ────────────────────────────────────────────── */
  function enableGuidedMode() {
    var tip = document.getElementById('wizard-step-tip');
    if (tip) tip.style.display = 'block';
    try { localStorage.setItem('phmurt_wizard_tips_visible', '1'); } catch (e) {}
    updateStepTip(typeof C !== 'undefined' ? C.step : 1);
  }

  function disableGuidedMode() {
    var tip = document.getElementById('wizard-step-tip');
    if (tip) tip.style.display = 'none';
    try { localStorage.setItem('phmurt_wizard_tips_visible', '0'); } catch (e) {}
  }

  function updateStepTip(stepNum) {
    var content = document.getElementById('wizard-tip-content');
    var tip = STEP_TIPS[stepNum];
    if (!content || !tip) {
      if (content) content.parentElement.style.display = 'none';
      return;
    }
    var container = content.parentElement;
    try {
      if (localStorage.getItem('phmurt_wizard_tips_visible') === '0') {
        container.style.display = 'none';
        return;
      }
    } catch (e) {}
    container.style.display = 'block';
    content.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">' +
        '<div>' +
          '<div style="font-family:Cinzel,serif;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--crimson,#d4433a);margin-bottom:6px;">📖 ' + _esc(tip.title) + '</div>' +
          '<div style="font-family:Spectral,serif;font-size:14px;color:var(--text-muted,#9a8870);line-height:1.6;">' + tip.tip + '</div>' +
          '<div style="font-family:Spectral,serif;font-size:13px;color:var(--text-dim,#6b5e50);margin-top:8px;font-style:italic;">💡 ' + tip.hint + '</div>' +
        '</div>' +
        '<button onclick="document.getElementById(\'wizard-step-tip\').style.display=\'none\';try{localStorage.setItem(\'phmurt_wizard_tips_visible\',\'0\')}catch(e){}" style="flex-shrink:0;background:none;border:none;color:var(--text-dim,#6b5e50);cursor:pointer;font-size:16px;padding:0;line-height:1;" title="Hide tips">✕</button>' +
      '</div>';
  }

  /* ── Quick Build ────────────────────────────────────────────── */
  function applyQuickBuild(archetype) {
    if (typeof C === 'undefined' || typeof DND_DATA === 'undefined') return;

    closeWelcome();

    /* Validate that the race, class, and background exist */
    if (!DND_DATA.races[archetype.race] || !DND_DATA.classes[archetype.cls] || !DND_DATA.backgrounds[archetype.bg]) {
      if (window.psToast) window.psToast('Quick Build data not available. Try the guided mode instead.');
      enableGuidedMode();
      return;
    }

    /* Apply selections */
    C.race = archetype.race;
    C.subrace = null;
    if (typeof selectRace === 'function') selectRace(archetype.race);

    C.cls = archetype.cls;
    if (typeof selectClass === 'function') selectClass(archetype.cls);

    C.background = archetype.bg;
    if (typeof selectBackground === 'function') selectBackground(archetype.bg);

    /* Set ability scores (standard array assignment) */
    C.scoreMethod = 'standard';
    var abilMap = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };
    C.abilities = {};
    Object.keys(archetype.abilities).forEach(function (k) {
      var key = abilMap[k] || k.toUpperCase();
      C.abilities[key] = archetype.abilities[k];
    });

    /* Show confirmation toast */
    if (window.psToast) {
      window.psToast(archetype.title + ' quick build applied! Review and continue from Step 1.');
    }

    /* Enable guided tips */
    enableGuidedMode();

    /* Go to step 1 for review */
    if (typeof goToStep === 'function') goToStep(1, true);
    if (typeof updateMiniSummary === 'function') updateMiniSummary();

    try { localStorage.setItem(LS_QB_KEY, archetype.id); } catch (e) {}
  }

  /* ── Hook into goToStep ─────────────────────────────────────── */
  function hookNavigation() {
    if (typeof window.goToStep !== 'function') return;

    var originalGoToStep = window.goToStep;
    window.goToStep = function (n, skipVal) {
      originalGoToStep(n, skipVal);
      /* Update wizard tip for the new step */
      updateStepTip(n);
    };
  }

  /* ── Init ───────────────────────────────────────────────────── */
  function initWizard() {
    injectWizardUI();
    hookNavigation();
    updateStepTip(1);

    /* Show welcome overlay for first-time visitors */
    var params = new URLSearchParams(window.location.search);
    var isLoading = params.has('load');
    var hasSeen = false;
    try { hasSeen = localStorage.getItem(LS_KEY) === '1'; } catch (e) {}

    if (!isLoading && !hasSeen) {
      /* Slight delay so the builder renders first */
      setTimeout(showWelcome, 400);
    }
  }

  /* Wait for DOM and the builder to init */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(initWizard, 100); });
  } else {
    setTimeout(initWizard, 100);
  }

})();
