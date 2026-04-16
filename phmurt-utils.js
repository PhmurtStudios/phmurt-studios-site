/* ══════════════════════════════════════════════════════════════
   phmurt-utils.js  —  Shared site-wide utility functions
   ──────────────────────────────────────────────────────────────
   Consolidates duplicate helpers that previously lived in
   individual page scripts. All exports go on window.PU.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── HTML Escaping ──────────────────────────────────────────── */

  /**
   * Escape a string for safe insertion into HTML content.
   * Handles null/undefined gracefully.
   * @param {*} v - Value to escape
   * @returns {string} Escaped HTML string
   */
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Escape a string for safe insertion into an HTML attribute value.
   * Same as esc() but included as a semantic alias.
   * @param {*} v - Value to escape
   * @returns {string} Escaped string safe for attribute use
   */
  function escAttr(v) {
    return esc(v);
  }

  /* ── Ability Score Helpers ──────────────────────────────────── */

  /**
   * Calculate the ability score modifier.
   * @param {number} score - Ability score (e.g. 10, 14, 18)
   * @returns {number} Modifier value (e.g. 0, 2, 4)
   */
  function abilityMod(score) {
    return Math.floor(((parseInt(score, 10) || 10) - 10) / 2);
  }

  /**
   * Format an ability modifier with +/- sign.
   * @param {number} mod - Modifier value
   * @returns {string} Formatted string like "+2" or "-1"
   */
  function fmtMod(mod) {
    var m = typeof mod === 'number' ? mod : parseInt(mod, 10) || 0;
    return (m >= 0 ? '+' : '') + m;
  }

  /**
   * Calculate AND format the modifier for an ability score.
   * Convenience combo of abilityMod + fmtMod.
   * @param {number} score - Ability score
   * @returns {string} Formatted modifier string
   */
  function modStr(score) {
    return fmtMod(abilityMod(score));
  }

  /* ── Proficiency Bonus ──────────────────────────────────────── */

  /**
   * Calculate proficiency bonus from character level (5e).
   * @param {number} level - Character level (1-20)
   * @returns {number} Proficiency bonus (2-6)
   */
  function profBonus(level) {
    var lvl = Math.max(1, Math.min(20, parseInt(level, 10) || 1));
    return Math.ceil(lvl / 4) + 1;
  }

  /**
   * Format proficiency bonus as "+N" string.
   * @param {number} level - Character level
   * @returns {string} Formatted proficiency bonus
   */
  function profBonusStr(level) {
    return '+' + profBonus(level);
  }

  /* ── String Utilities ───────────────────────────────────────── */

  /**
   * Capitalize first letter of a string.
   * @param {string} s - Input string
   * @returns {string} Capitalized string
   */
  function capitalize(s) {
    if (!s || typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /**
   * Create a URL-safe slug from a string.
   * @param {string} s - Input string
   * @returns {string} Slugified string
   */
  function slugify(s) {
    return String(s || 'untitled')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Truncate a string to a maximum length with ellipsis.
   * @param {string} s - Input string
   * @param {number} max - Maximum character length
   * @returns {string} Truncated string
   */
  function truncate(s, max) {
    if (!s || typeof s !== 'string') return '';
    max = max || 100;
    return s.length > max ? s.slice(0, max - 1) + '…' : s;
  }

  /* ── DOM Helpers ────────────────────────────────────────────── */

  /**
   * Build an HTML <select> element string from an options array.
   * @param {string} id - Element ID
   * @param {Array} options - Array of {value, label} or plain strings
   * @param {string} [selected] - Currently selected value
   * @param {string} [className] - Optional CSS class
   * @returns {string} HTML string for the select element
   */
  function selectHtml(id, options, selected, className) {
    var cls = className ? ' class="' + esc(className) + '"' : '';
    var html = '<select id="' + esc(id) + '"' + cls + '>';
    (options || []).forEach(function (opt) {
      var val, label;
      if (typeof opt === 'string') { val = opt; label = opt; }
      else { val = opt.value !== undefined ? opt.value : opt.label; label = opt.label || opt.value || ''; }
      var sel = String(val) === String(selected) ? ' selected' : '';
      html += '<option value="' + esc(val) + '"' + sel + '>' + esc(label) + '</option>';
    });
    html += '</select>';
    return html;
  }

  /**
   * Show a toast notification using the site's psToast system.
   * Falls back to console.log if psToast isn't available.
   * @param {string} msg - Message to display
   */
  function toast(msg) {
    if (typeof window.psToast === 'function') {
      window.psToast(msg);
    } else {
      console.log('[Toast]', msg);
    }
  }

  /* ── Clipboard ──────────────────────────────────────────────── */

  /**
   * Copy text to clipboard with toast feedback.
   * @param {string} text - Text to copy
   * @param {string} [successMsg] - Optional success message
   */
  function copyToClipboard(text, successMsg) {
    successMsg = successMsg || 'Copied!';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        toast(successMsg);
      }).catch(function () {
        _fallbackCopy(text, successMsg);
      });
    } else {
      _fallbackCopy(text, successMsg);
    }
  }

  function _fallbackCopy(text, msg) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast(msg); }
    catch (e) { toast('Copy failed.'); }
    document.body.removeChild(ta);
  }

  /* ── Dice Helpers ───────────────────────────────────────────── */

  /**
   * Roll a single die (1dN).
   * @param {number} sides - Number of sides
   * @returns {number} Roll result
   */
  function rollDie(sides) {
    return Math.floor(Math.random() * (sides || 6)) + 1;
  }

  /**
   * Roll XdY+Z dice expression.
   * @param {number} count - Number of dice
   * @param {number} sides - Sides per die
   * @param {number} [bonus] - Static bonus
   * @returns {number} Total roll result
   */
  function rollDice(count, sides, bonus) {
    var total = bonus || 0;
    for (var i = 0; i < (count || 1); i++) {
      total += rollDie(sides);
    }
    return total;
  }

  /**
   * Parse a dice expression string like "2d6+3" and roll it.
   * @param {string} expr - Dice expression
   * @returns {number} Roll result, or 0 if unparseable
   */
  function rollExpr(expr) {
    var match = String(expr || '').match(/^(\d+)?d(\d+)([+-]\d+)?$/i);
    if (!match) return parseInt(expr, 10) || 0;
    return rollDice(
      parseInt(match[1], 10) || 1,
      parseInt(match[2], 10) || 6,
      parseInt(match[3], 10) || 0
    );
  }

  /* ── Number Formatting ──────────────────────────────────────── */

  /**
   * Format a number with commas (e.g. 1000 → "1,000").
   * @param {number} n - Number to format
   * @returns {string} Formatted number string
   */
  function fmtNum(n) {
    return String(parseInt(n, 10) || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  /**
   * Ordinal suffix for a number (1st, 2nd, 3rd, etc.).
   * @param {number} n - Number
   * @returns {string} Number with ordinal suffix
   */
  function ordinal(n) {
    var v = parseInt(n, 10) || 0;
    var s = ['th', 'st', 'nd', 'rd'];
    var mod100 = v % 100;
    return v + (s[(mod100 - 20) % 10] || s[mod100] || s[0]);
  }

  /* ── Export ─────────────────────────────────────────────────── */

  window.PU = {
    esc:             esc,
    escAttr:         escAttr,
    abilityMod:      abilityMod,
    fmtMod:          fmtMod,
    modStr:          modStr,
    profBonus:       profBonus,
    profBonusStr:    profBonusStr,
    capitalize:      capitalize,
    slugify:         slugify,
    truncate:        truncate,
    selectHtml:      selectHtml,
    toast:           toast,
    copyToClipboard: copyToClipboard,
    rollDie:         rollDie,
    rollDice:        rollDice,
    rollExpr:        rollExpr,
    fmtNum:          fmtNum,
    ordinal:         ordinal
  };

  /* Aliases for backward compatibility */
  window.PU.escapeHtml = esc;
  window.PU.escapeAttr = escAttr;
  window.PU.cap        = capitalize;

})();
