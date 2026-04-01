/* ═══════════════════════════════
   THEME TOGGLE – Phmurt Studios
   Phmurt Studios Theme Toggle
   ═══════════════════════════════ */
(function() {
  var THEME_KEY = 'phmurt_theme';
  var VISITED_KEY = 'phmurt_visited';

  // Apply saved theme
  var saved = localStorage.getItem(THEME_KEY) || 'dark';
  if (saved === 'light') {
    document.documentElement.classList.add('light-mode');
  }

  window.toggleTheme = function() {
    var isLight = document.documentElement.classList.contains('light-mode');
    document.documentElement.classList.add('theme-transition');
    if (isLight) {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem(THEME_KEY, 'light');
    }
    // Remove first-visit pulse on interaction
    var toggle = document.querySelector('.ps-theme-toggle');
    if (toggle) toggle.classList.remove('first-visit');
    localStorage.setItem(VISITED_KEY, 'true');

    setTimeout(function() {
      document.documentElement.classList.remove('theme-transition');
    }, 500);
  };


  // First-visit pulse
  document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem(VISITED_KEY)) {
      var toggle = document.querySelector('.ps-theme-toggle');
      if (toggle) {
        toggle.classList.add('first-visit');
        setTimeout(function() {
          toggle.classList.remove('first-visit');
        }, 5000);
      }
    }
  });
})();
