/* ═══════════════════════════════
   THEME TOGGLE – Phmurt Studios
   Phmurt Studios Theme Toggle

   SECURITY: Validates all localStorage reads to prevent injection
   ═══════════════════════════════ */
(function() {
  var THEME_KEY = 'phmurt_theme';
  var VISITED_KEY = 'phmurt_visited';
  var _transitionTimeoutId = null;

  // Apply saved theme - with validation
  var saved = 'dark';
  try {
    var storedTheme = localStorage.getItem(THEME_KEY);
    // Only accept 'light' or 'dark' values - prevent injection
    if (storedTheme === 'light' || storedTheme === 'dark') {
      saved = storedTheme;
    }
  } catch(e) {
    // use default dark theme on error
    saved = 'dark';
  }

  if (saved === 'light') {
    document.documentElement.classList.add('light-mode');
  }

  window.toggleTheme = function() {
    var isLight = document.documentElement.classList.contains('light-mode');

    // Clear any pending transition timeout to prevent stacking
    if (_transitionTimeoutId !== null) {
      clearTimeout(_transitionTimeoutId);
      _transitionTimeoutId = null;
    }

    document.documentElement.classList.add('theme-transition');
    try {
      if (isLight) {
        document.documentElement.classList.remove('light-mode');
        localStorage.setItem(THEME_KEY, 'dark');
      } else {
        document.documentElement.classList.add('light-mode');
        localStorage.setItem(THEME_KEY, 'light');
      }
    } catch(e) {
      console.warn('[Theme] localStorage save failed:', e);
    }

    // Remove first-visit pulse on interaction
    var toggle = document.querySelector('.ps-theme-toggle');
    if (toggle) {
      toggle.classList.remove('first-visit');
    }

    try {
      localStorage.setItem(VISITED_KEY, 'true');
    } catch(e) {}

    _transitionTimeoutId = setTimeout(function() {
      document.documentElement.classList.remove('theme-transition');
      _transitionTimeoutId = null;
    }, 500);
  };


  // First-visit pulse
  function _initFirstVisitPulse() {
    var visitedFlag = false;
    try {
      visitedFlag = localStorage.getItem(VISITED_KEY) === 'true';
    } catch(e) { /* use default */ }

    if (!visitedFlag) {
      var toggle = document.querySelector('.ps-theme-toggle');
      if (toggle) {
        toggle.classList.add('first-visit');
        // SECURITY: Safely reference toggle element, don't retain stale reference
        var pulseTimeout = setTimeout(function() {
          var el = document.querySelector('.ps-theme-toggle');
          if (el) {
            el.classList.remove('first-visit');
          }
        }, 5000);
      }
    }
  }

  // Run on DOMContentLoaded or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _initFirstVisitPulse);
  } else {
    _initFirstVisitPulse();
  }
})();
