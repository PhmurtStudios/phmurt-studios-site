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

      // Validate script path - only allow simple filenames (no path traversal)
      if (!/^[a-zA-Z0-9\-_.]+\.js$/.test(src)) {
        reject(new Error('Invalid script source: ' + src));
        return;
      }

      var sel = 'script[data-phmurt-play-asset="' + src + '"]';
      if (document.querySelector(sel)) {
        resolve();
        return;
      }

      var s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.setAttribute("data-phmurt-play-asset", src);
      s.setAttribute("crossorigin", "anonymous");

      var settled = false;
      var timeoutId = setTimeout(function() {
        if (!settled) {
          settled = true;
          s.onload = null;
          s.onerror = null;
          reject(new Error("Script load timeout: " + src));
        }
      }, 30000); // 30 second timeout

      s.onload = function () {
        if (!settled) {
          settled = true;
          clearTimeout(timeoutId);
          s.onerror = null;
          resolve();
        }
      };
      s.onerror = function () {
        if (!settled) {
          settled = true;
          clearTimeout(timeoutId);
          reject(new Error("Failed to load " + src));
        }
      };

      document.head.appendChild(s);
    });
  }

  /**
   * @returns {Promise<void>}
   */
  global.__loadCampaignPlayAssets = function __loadCampaignPlayAssets() {
    if (chain) return chain;

    // ── CRITICAL FIX: Ensure loading order is strict sequential and validate results ──
    // Loading order matters: combat-engine, visual-effects, then monster-data.
    // Each script depends on the previous. Validate that each one actually defined its global.
    chain = loadScript("combat-engine.js")
      .then(function () {
        if (typeof window.CombatEngine === 'undefined') {
          throw new Error("combat-engine.js loaded but CombatEngine global not defined");
        }
        return loadScript("visual-effects.js");
      })
      .then(function () {
        if (typeof window.VFX === 'undefined') {
          throw new Error("visual-effects.js loaded but VFX global not defined");
        }
        return loadScript("monster-data.js");
      })
      .then(function () {
        if (typeof window.SRD_MONSTERS === 'undefined') {
          throw new Error("monster-data.js loaded but SRD_MONSTERS global not defined");
        }
      })
      .catch(function (err) {
        chain = null; // Reset chain so retry is possible
        var msg = err && err.message ? err.message : String(err);
        console.error("Campaign Play Assets loading failed:", msg);
        // Don't re-throw: allow higher-level code to handle cleanup gracefully
        // Caller should check window.COMBAT_ENGINE etc. before using them
      });

    return chain;
  };
})(window);
