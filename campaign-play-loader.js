/* ═══════════════════════════════════════════════════════════════════════════
   Deferred loader for Campaign Manager "Play" tab only.
   Pulls combat-engine.js, visual-effects.js, and monster-data.js after first
   visit to Play — keeps initial campaigns.html parse + main thread work lower.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (global) {
  "use strict";

  var chain = null;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (!src || typeof src !== 'string') {
        reject(new Error('Invalid script source'));
        return;
      }

      // Validate script path - only allow relative paths and known absolute paths
      if (!/^[a-zA-Z0-9\-_.\/]+\.js$/.test(src)) {
        reject(new Error('Invalid script source: ' + src));
        return;
      }

      var sel = 'script[data-phmurt-play-asset="' + src.replace(/"/g, "") + '"]';
      if (document.querySelector(sel)) {
        resolve();
        return;
      }

      var s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.setAttribute("data-phmurt-play-asset", src);

      var timeoutId = setTimeout(function() {
        reject(new Error("Script load timeout: " + src));
      }, 30000); // 30 second timeout

      s.onload = function () {
        clearTimeout(timeoutId);
        resolve();
      };
      s.onerror = function () {
        clearTimeout(timeoutId);
        reject(new Error("Failed to load " + src));
      };

      document.head.appendChild(s);
    });
  }

  /**
   * @returns {Promise<void>}
   */
  global.__loadCampaignPlayAssets = function __loadCampaignPlayAssets() {
    if (chain) return chain;

    chain = loadScript("combat-engine.js")
      .then(function () {
        if (typeof window.COMBAT_ENGINE === 'undefined') {
          console.warn("combat-engine.js loaded but COMBAT_ENGINE global not found");
        }
        return loadScript("visual-effects.js");
      })
      .then(function () {
        if (typeof window.VISUAL_EFFECTS === 'undefined') {
          console.warn("visual-effects.js loaded but VISUAL_EFFECTS global not found");
        }
        return loadScript("monster-data.js");
      })
      .then(function () {
        if (typeof window.MONSTER_DATA === 'undefined') {
          console.warn("monster-data.js loaded but MONSTER_DATA global not found");
        }
      })
      .catch(function (err) {
        chain = null;
        console.error("Campaign Play Assets loading failed:", err && err.message ? err.message : err);
        throw err;
      });

    return chain;
  };
})(window);
