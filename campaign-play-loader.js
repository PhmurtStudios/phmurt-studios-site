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
      var sel = 'script[data-phmurt-play-asset="' + src.replace(/"/g, "") + '"]';
      if (document.querySelector(sel)) {
        resolve();
        return;
      }
      var s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.setAttribute("data-phmurt-play-asset", src);
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("Failed to load " + src)); };
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
        if (!window.COMBAT_ENGINE) console.error("combat-engine.js loaded but COMBAT_ENGINE global not found");
        return loadScript("visual-effects.js");
      })
      .then(function () {
        if (!window.VISUAL_EFFECTS) console.error("visual-effects.js loaded but VISUAL_EFFECTS global not found");
        return loadScript("monster-data.js");
      })
      .then(function () {
        if (!window.MONSTER_DATA) console.error("monster-data.js loaded but MONSTER_DATA global not found");
      })
      .catch(function (err) {
        chain = null;
        console.error("Campaign Play Assets loading failed:", err);
        throw err;
      });
    return chain;
  };
})(window);
