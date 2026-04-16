/* ═══════════════════════════════════════════════════════════════════
   PHMURT CREATOR — Shared utilities
   ═══════════════════════════════════════════════════════════════════
   - Dice / damage calculator used by every creator
   - Small helpers (slug, debounce, escape, safe markdown)
   Exposes: window.PhmurtCreatorUtil
   ═══════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  // ── Dice calculator ───────────────────────────────────────────────
  // Parses expressions like:
  //   "8d6"                          → terms: [{n:8,d:6,k:0}]
  //   "2d6+3"                        → [{n:2,d:6,k:0},{k:3}]
  //   "1d8+1d6+2"                    → 3 terms
  //   "4d10 fire + 2d6 necrotic"     → 2 terms, type labels preserved
  //   "8d6; +1d6/slot above 3rd"     → scaling suffix parsed separately
  // Returns { terms, types, avg, min, max, parsed:true } or { parsed:false }.

  var DICE_RE = /(\d+)\s*d\s*(\d+)/gi;
  var FLAT_RE = /([+\-])\s*(\d+)(?!\s*d)/gi;
  var TYPE_RE = /\b(acid|bludgeoning|cold|fire|force|lightning|necrotic|piercing|poison|psychic|radiant|slashing|thunder)\b/i;

  function parseDamage(input) {
    if (!input || typeof input !== 'string') return { parsed: false };
    var s = input.trim();
    if (!s) return { parsed: false };

    // Split on "+" only when the rhs starts with a dice or a signed-word damage segment.
    // Simple approach: scan once for dice terms, once for trailing flat numbers, and pull out damage types.
    var terms = [];
    var m;
    DICE_RE.lastIndex = 0;
    while ((m = DICE_RE.exec(s))) {
      terms.push({ n: parseInt(m[1], 10), d: parseInt(m[2], 10), k: 0 });
    }
    var flat = 0;
    FLAT_RE.lastIndex = 0;
    while ((m = FLAT_RE.exec(s))) {
      var v = parseInt(m[2], 10);
      flat += (m[1] === '-' ? -v : v);
    }
    if (!terms.length && !flat) return { parsed: false };

    // Aggregate stats
    var min = flat, max = flat, avg = flat;
    terms.forEach(function (t) {
      if (!t.n || !t.d) return;
      min += t.n;
      max += t.n * t.d;
      avg += t.n * (t.d + 1) / 2;
    });

    // Damage types present
    var types = [];
    var tm = s.match(new RegExp(TYPE_RE.source, 'gi'));
    if (tm) types = tm.map(function (x) { return x.toLowerCase(); })
                      .filter(function (v, i, a) { return a.indexOf(v) === i; });

    return {
      parsed: true,
      terms: terms,
      flat: flat,
      types: types,
      min: min,
      max: max,
      avg: Math.round(avg * 10) / 10
    };
  }

  // Scaling predictor: parse strings like
  //   "+1d6 per slot above 3rd"
  //   "damage increases by 2d8 for each slot level above 5th"
  //   "1d10 at 5th level, 2d10 at 11th, 3d10 at 17th" (cantrip)
  function parseScaling(text) {
    if (!text) return null;
    var t = text.toLowerCase();
    // Leveled scaling: "+Xdy per/each slot above Nth"
    var lv = t.match(/(\d+)\s*d\s*(\d+)[^a-z0-9]+(?:per|each|for each)[^a-z0-9]+slot[^0-9]+(\d+)/);
    if (lv) {
      return { kind: 'slot', perN: parseInt(lv[1], 10), perD: parseInt(lv[2], 10), baseSlot: parseInt(lv[3], 10) };
    }
    // Flat per slot: "+N per slot above Kth"
    var lvf = t.match(/([+\-]?\d+)\s+(?:per|each|for each)[^a-z0-9]+slot[^0-9]+(\d+)/);
    if (lvf) {
      return { kind: 'slot-flat', per: parseInt(lvf[1], 10), baseSlot: parseInt(lvf[2], 10) };
    }
    // Cantrip: collect "N dX at Yth"
    var cm = [];
    var re = /(\d+)\s*d\s*(\d+)\s*(?:dice)?\s*(?:at|by)\s*(?:character\s+)?(\d+)\s*(?:st|nd|rd|th)?\s*level/gi;
    var x;
    while ((x = re.exec(t))) cm.push({ lvl: parseInt(x[3], 10), n: parseInt(x[1], 10), d: parseInt(x[2], 10) });
    if (cm.length) return { kind: 'cantrip', tiers: cm.sort(function (a,b){ return a.lvl-b.lvl; }) };
    return null;
  }

  // Given a base damage string, spell level, and scaling, produce a friendly summary.
  function damageSummary(damageStr, spellLevel, scalingStr) {
    var base = parseDamage(damageStr);
    if (!base.parsed) return null;

    var parts = ['avg ' + base.avg + ' · max ' + base.max];
    var sc = parseScaling(scalingStr);

    if (sc && sc.kind === 'slot' && spellLevel != null) {
      // project at 9th-level slot
      var stepsTo9 = Math.max(0, 9 - (sc.baseSlot || spellLevel));
      if (stepsTo9 > 0) {
        var extraDice = sc.perN * stepsTo9;
        // assume additive dice share the first term's die size if matching, else report bonus line
        var firstTerm = base.terms[0];
        var projAvg = base.avg + extraDice * (sc.perD + 1) / 2;
        var projMax = base.max + extraDice * sc.perD;
        var projDice = (firstTerm && firstTerm.d === sc.perD)
          ? (firstTerm.n + extraDice) + 'd' + sc.perD
          : damageStr + ' +' + extraDice + 'd' + sc.perD;
        parts.push('at 9th-slot: ' + projDice + ' (avg ' + Math.round(projAvg*10)/10 + ', max ' + projMax + ')');
      }
    } else if (sc && sc.kind === 'cantrip') {
      var last = sc.tiers[sc.tiers.length - 1];
      if (last) {
        parts.push('at 17th lvl: ' + last.n + 'd' + last.d + ' (avg ' + Math.round(last.n*(last.d+1)/2*10)/10 + ', max ' + last.n*last.d + ')');
      }
    }
    if (base.types.length) parts.push(base.types.join('/') + ' damage');
    return parts.join(' · ');
  }

  // Attack/save formula hint
  function saveDCHint() { return 'Save DC = 8 + proficiency + spellcasting modifier (resolves per caster)'; }
  function attackHint() { return 'Attack Bonus = proficiency + spellcasting modifier (resolves per caster)'; }

  // ── Small helpers ─────────────────────────────────────────────────
  function slugify(s) {
    return (s || '').toString().toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 64);
  }
  function debounce(fn, ms) {
    var t;
    return function () {
      var self = this, args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  }
  function escapeHtml(s) {
    return (s == null ? '' : String(s))
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function renderMarkdown(md) {
    if (!md) return '';
    var h = escapeHtml(md);
    h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
    h = h.replace(/^\s*> ?(.*)$/gm, '<blockquote>$1</blockquote>');
    h = h.replace(/^\s*[-*] (.*)$/gm, '<li>$1</li>');
    h = h.replace(/(<li>.*<\/li>)(\s*(<li>.*<\/li>))+/gs, '<ul>$&</ul>');
    h = h.replace(/^---+$/gm, '<hr>');
    h = h.split(/\n\s*\n/).map(function (p) {
      if (/^<(ul|blockquote|hr|h\d)/.test(p.trim())) return p;
      return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
    }).join('');
    return h;
  }

  // Challenge Rating XP table (complete SRD)
  var CR_XP = {
    '0': 10, '1/8': 25, '1/4': 50, '1/2': 100,
    '1': 200, '2': 450, '3': 700, '4': 1100, '5': 1800,
    '6': 2300, '7': 2900, '8': 3900, '9': 5000, '10': 5900,
    '11': 7200, '12': 8400, '13': 10000, '14': 11500, '15': 13000,
    '16': 15000, '17': 18000, '18': 20000, '19': 22000, '20': 25000,
    '21': 33000, '22': 41000, '23': 50000, '24': 62000,
    '25': 75000, '26': 90000, '27': 105000, '28': 120000,
    '29': 135000, '30': 155000
  };
  function crToXp(cr) { return CR_XP[String(cr)] != null ? CR_XP[String(cr)] : null; }
  // Proficiency by CR (SRD DMG table)
  function crToProficiency(cr) {
    var n = parseFloat((String(cr) || '0').replace('1/8','.125').replace('1/4','.25').replace('1/2','.5'));
    if (n < 5) return 2;
    if (n < 9) return 3;
    if (n < 13) return 4;
    if (n < 17) return 5;
    if (n < 21) return 6;
    if (n < 25) return 7;
    if (n < 29) return 8;
    return 9;
  }
  function abilityMod(score) {
    if (score == null || isNaN(score)) return 0;
    return Math.floor((parseInt(score, 10) - 10) / 2);
  }
  function fmtMod(m) { return (m >= 0 ? '+' : '') + m; }

  // Monster average HP from hit-dice expression
  function monsterHp(hitDice, conScore) {
    var parts = parseDamage(hitDice);
    if (!parts.parsed) return null;
    var conMod = abilityMod(conScore);
    var totalDice = parts.terms.reduce(function (a, t) { return a + t.n; }, 0);
    return Math.floor(parts.avg + conMod * totalDice);
  }

  // ── Export ────────────────────────────────────────────────────────
  global.PhmurtCreatorUtil = {
    parseDamage: parseDamage,
    parseScaling: parseScaling,
    damageSummary: damageSummary,
    saveDCHint: saveDCHint,
    attackHint: attackHint,
    slugify: slugify,
    debounce: debounce,
    escapeHtml: escapeHtml,
    renderMarkdown: renderMarkdown,
    crToXp: crToXp,
    crToProficiency: crToProficiency,
    abilityMod: abilityMod,
    fmtMod: fmtMod,
    monsterHp: monsterHp
  };
})(window);
