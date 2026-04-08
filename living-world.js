// ═══════════════════════════════════════════════════════════════════════
// LIVING WORLD ENGINE — Real-time world events during campaign sessions
// ═══════════════════════════════════════════════════════════════════════
//
// When the DM activates "Living World" mode, the engine generates a
// stream of world events at configurable intervals. Events mutate the
// campaign state (factions, regions, rulers, alliances) and appear as
// an animated ticker the DM can share with players.
//
// Event categories:
//   political  — alliances form/break, treaties, betrayals
//   military   — wars, sieges, raids, territory changes
//   economic   — trade booms/busts, new trade routes, sanctions
//   social     — festivals, plagues, religious movements, unrest
//   arcane     — magical phenomena, artifact discoveries, rifts
//   natural    — storms, earthquakes, droughts, monster migrations
//
// Each event has consequences that modify the world data in-place
// via the setData() callback.
// ═══════════════════════════════════════════════════════════════════════

(function() {
  "use strict";

  // ── Seeded RNG (mulberry32) ──
  function lwRng(seed) {
    let t = seed | 0;
    return function() {
      t = (t + 0x6D2B79F5) | 0;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
  function pickN(arr, n, rng) {
    const s = [...arr].sort(() => rng() - 0.5);
    return s.slice(0, Math.min(n, s.length));
  }
  function weightedPick(options, rng) {
    // options: [{item, weight}]
    const total = options.reduce((s, o) => s + o.weight, 0);
    let r = rng() * total;
    for (const o of options) {
      r -= o.weight;
      if (r <= 0) return o.item;
    }
    return options[options.length - 1].item;
  }

  // ═══════════════════════════════════════════════════════════════════
  // FACTION RELATIONS SYSTEM
  // ═══════════════════════════════════════════════════════════════════

  class FactionRelations {
    constructor() {
      this.relationScores = {};     // { "factionA-factionB": score }
      this.treaties = {};            // { "factionA-factionB": [treaty_type, ...] }
      this.activeWars = {};          // { "factionA-factionB": { warScore, startTick } }
      this.tradeRoutes = {};         // { "regionA-regionB": true }
    }

    // Get normalized key (A-B regardless of order)
    _key(factionA, factionB) {
      return [factionA, factionB].sort().join('-');
    }

    // Get relation score between two factions (-100 to +100)
    getRelation(factionA, factionB) {
      if (factionA === factionB) return 100;
      return this.relationScores[this._key(factionA, factionB)] || 0;
    }

    // Modify relation score
    modifyRelation(factionA, factionB, delta) {
      if (factionA === factionB) return;
      const key = this._key(factionA, factionB);
      this.relationScores[key] = Math.max(-100, Math.min(100, (this.relationScores[key] || 0) + delta));
    }

    // Check if two factions are at war
    isAtWar(factionA, factionB) {
      return !!this.activeWars[this._key(factionA, factionB)];
    }

    // Declare war between two factions
    declareWar(factionA, factionB) {
      const key = this._key(factionA, factionB);
      if (!this.activeWars[key]) {
        this.activeWars[key] = { warScore: 0, startTick: 0 };
      }
    }

    // End a war
    endWar(factionA, factionB) {
      const key = this._key(factionA, factionB);
      delete this.activeWars[key];
    }

    // Get war score (positive = factionA winning, negative = factionB winning)
    getWarScore(factionA, factionB) {
      const key = this._key(factionA, factionB);
      const war = this.activeWars[key];
      if (!war) return 0;
      // If factionA is the lesser one alphabetically, flip the score
      const [first, second] = [factionA, factionB].sort();
      return first === factionA ? war.warScore : -war.warScore;
    }

    // Modify war score
    modifyWarScore(factionA, factionB, delta) {
      const key = this._key(factionA, factionB);
      if (this.activeWars[key]) {
        this.activeWars[key].warScore += delta;
      }
    }

    // Add treaty between two factions
    addTreaty(factionA, factionB, treatyType) {
      const key = this._key(factionA, factionB);
      if (!this.treaties[key]) this.treaties[key] = [];
      if (!this.treaties[key].includes(treatyType)) {
        this.treaties[key].push(treatyType);
      }
    }

    // Remove treaty
    removeTreaty(factionA, factionB, treatyType) {
      const key = this._key(factionA, factionB);
      if (this.treaties[key]) {
        this.treaties[key] = this.treaties[key].filter(t => t !== treatyType);
      }
    }

    // Check if treaty exists
    hasTreaty(factionA, factionB, treatyType) {
      const key = this._key(factionA, factionB);
      return this.treaties[key]?.includes(treatyType) || false;
    }

    // Get all treaties between two factions
    getTreaties(factionA, factionB) {
      const key = this._key(factionA, factionB);
      return [...(this.treaties[key] || [])];
    }

    // Add trade route between regions
    addTradeRoute(regionA, regionB) {
      const key = [regionA, regionB].sort().join('-');
      this.tradeRoutes[key] = true;
    }

    // Remove trade route
    removeTradeRoute(regionA, regionB) {
      const key = [regionA, regionB].sort().join('-');
      delete this.tradeRoutes[key];
    }

    // Check if trade route exists
    hasTradeRoute(regionA, regionB) {
      const key = [regionA, regionB].sort().join('-');
      return !!this.tradeRoutes[key];
    }

    // Serialize to JSON
    toJSON() {
      return {
        relationScores: this.relationScores,
        treaties: this.treaties,
        activeWars: this.activeWars,
        tradeRoutes: this.tradeRoutes,
      };
    }

    // Deserialize from JSON
    fromJSON(data) {
      this.relationScores = data.relationScores || {};
      this.treaties = data.treaties || {};
      this.activeWars = data.activeWars || {};
      this.tradeRoutes = data.tradeRoutes || {};
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // EVENT TEMPLATES
  // ═══════════════════════════════════════════════════════════════════

  const EVENT_TEMPLATES = {

    // ── POLITICAL ──
    political: [
      {
        id: "alliance_formed",
        headline: (a, b) => `${a} and ${b} Forge Alliance`,
        detail: (a, b) => `Diplomats from the ${a} and the ${b} have signed a pact of mutual defense. Both factions will now coordinate their efforts against common threats.`,
        weight: 3,
        requires: (factions) => factions.filter(f => !f.rivals?.length || f.attitude !== "hostile").length >= 2,
        apply: (data, rng, relations) => {
          const eligible = data.factions.filter(f => f.power > 20);
          if (eligible.length < 2) return null;
          const [a, b] = pickN(eligible, 2, rng);
          if (a.allies?.includes(b.name) || a.rivals?.includes(b.name)) return null;
          // Only form alliance if relation > 20
          if (relations && relations.getRelation(a.name, b.name) < 20) return null;
          return {
            headline: `${a.name} and ${b.name} Forge Alliance`,
            detail: `Diplomats from the ${a.name} and the ${b.name} have signed a pact of mutual defense and trade cooperation.`,
            category: "political",
            icon: "⚖",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === a.name) return { ...f, allies: [...(f.allies || []).filter(x => x !== b.name), b.name], attitude: f.attitude === "hostile" ? "neutral" : f.attitude };
                if (f.name === b.name) return { ...f, allies: [...(f.allies || []).filter(x => x !== a.name), a.name], attitude: f.attitude === "hostile" ? "neutral" : f.attitude };
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(a.name, b.name, 60);
              rel.addTreaty(a.name, b.name, "military_alliance");
            }
          };
        }
      },
      {
        id: "alliance_broken",
        weight: 2,
        apply: (data, rng, relations) => {
          const withAllies = data.factions.filter(f => f.allies?.length > 0);
          if (!withAllies.length) return null;
          const a = pick(withAllies, rng);
          const bName = pick(a.allies, rng);
          const b = data.factions.find(f => f.name === bName);
          if (!b) return null;
          const reasons = [
            "a trade dispute over valuable mineral rights",
            "allegations of espionage and stolen secrets",
            "a border skirmish that escalated beyond control",
            "the assassination of a key diplomat",
            "disagreement over how to handle a growing threat",
            "broken promises regarding military support"
          ];
          return {
            headline: `${a.name} Breaks Alliance with ${b.name}`,
            detail: `The alliance between the ${a.name} and the ${b.name} has collapsed due to ${pick(reasons, rng)}.`,
            category: "political",
            icon: "⊘",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === a.name) return { ...f, allies: (f.allies || []).filter(x => x !== b.name), rivals: [...(f.rivals || []), b.name] };
                if (f.name === b.name) return { ...f, allies: (f.allies || []).filter(x => x !== a.name), rivals: [...(f.rivals || []), a.name] };
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(a.name, b.name, -40);
              rel.removeTreaty(a.name, b.name, "military_alliance");
              rel.removeTreaty(a.name, b.name, "trade_agreement");
            }
          };
        }
      },
      {
        id: "new_ruler",
        weight: 2,
        apply: (data, rng) => {
          const factions = data.factions.filter(f => f.hierarchy?.length > 0);
          if (!factions.length) return null;
          const faction = pick(factions, rng);
          const ruler = faction.hierarchy.find(h => h.role === "ruler");
          const heir = faction.hierarchy.find(h => h.role === "heir");
          if (!ruler || !heir) return null;
          const causes = [
            `${ruler.name} has died of a mysterious illness`,
            `${ruler.name} was found dead under suspicious circumstances`,
            `${ruler.name} has abdicated the throne`,
            `${ruler.name} was overthrown in a palace coup`,
            `${ruler.name} has gone missing during a journey`,
            `${ruler.name} was slain in a duel of honor`
          ];
          const cause = pick(causes, rng);
          return {
            headline: `${heir.name} Ascends to Lead ${faction.name}`,
            detail: `${cause}. ${heir.name}, formerly ${heir.title}, now assumes command as the new ${ruler.title} of the ${faction.name}.`,
            category: "political",
            icon: "♔",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name !== faction.name) return f;
                const newHierarchy = f.hierarchy.map(h => {
                  if (h.role === "ruler") return { ...h, name: heir.name, title: ruler.title };
                  if (h.role === "heir") return { ...h, name: generateReplacementName(rng) };
                  return h;
                });
                return { ...f, hierarchy: newHierarchy };
              }),
              npcs: d.npcs.map(n => {
                if (n.name === ruler.name) return { ...n, alive: false };
                return n;
              })
            })
          };
        }
      },
      {
        id: "diplomatic_incident",
        weight: 3,
        apply: (data, rng, relations) => {
          if (data.factions.length < 2) return null;
          const [a, b] = pickN(data.factions, 2, rng);
          const incidents = [
            { text: `An ambassador from the ${a.name} was publicly humiliated at the ${b.name} court`, severity: "tense" },
            { text: `Spies from the ${a.name} were caught infiltrating ${b.name} territory`, severity: "hostile" },
            { text: `A trade delegation from ${b.name} was robbed in ${a.name} lands, and the perpetrators were never caught`, severity: "tense" },
            { text: `${a.name} has imposed heavy tariffs on goods from ${b.name} territories`, severity: "tense" },
          ];
          const incident = pick(incidents, rng);
          return {
            headline: `Tensions Rise Between ${a.name} and ${b.name}`,
            detail: `${incident.text}. Relations between the two powers have deteriorated sharply.`,
            category: "political",
            icon: "⚡",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === a.name && !f.rivals?.includes(b.name)) return { ...f, rivals: [...(f.rivals || []), b.name].slice(-3) };
                return f;
              }),
              regions: d.regions.map(r => {
                if (r.ctrl === a.name || r.ctrl === b.name) return { ...r, state: r.state === "stable" ? "tense" : r.state };
                return r;
              })
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(a.name, b.name, -15);
              // If dropping below -40, high chance of war next
              if (rel.getRelation(a.name, b.name) < -40 && rng() < 0.3) {
                rel.declareWar(a.name, b.name);
              }
            }
          };
        }
      },
      {
        id: "coup_attempt",
        weight: 2,
        apply: (data, rng) => {
          const factions = data.factions.filter(f => f.hierarchy?.length > 1);
          if (!factions.length) return null;
          const faction = pick(factions, rng);
          const ruler = faction.hierarchy.find(h => h.role === "ruler");
          if (!ruler) return null;
          const outcomes = [
            { success: true, text: `A conspiracy within the ${faction.name} has succeeded in overthrowing ${ruler.name}` },
            { success: false, text: `An assassination plot against ${ruler.name} has been uncovered and the conspirators executed` },
          ];
          const outcome = pick(outcomes, rng);
          return {
            headline: outcome.success ? `${faction.name} Leadership Overturned` : `Coup Thwarted in ${faction.name}`,
            detail: `${outcome.text}. The faction's internal stability hangs in the balance as power consolidates or fragments.`,
            category: "political",
            icon: "†",
            importance: "major",
            mutations: (d) => {
              if (!outcome.success) {
                // Failed coup — minor power loss
                return {
                  ...d,
                  factions: d.factions.map(f => f.name === faction.name ? { ...f, power: Math.max(0, f.power - 3) } : f)
                };
              }
              // Successful coup — new ruler
              return {
                ...d,
                factions: d.factions.map(f => {
                  if (f.name !== faction.name) return f;
                  const conspiratorRole = rng() > 0.5 ? "heir" : "general";
                  const conspirator = f.hierarchy.find(h => h.role === conspiratorRole);
                  if (!conspirator) return f;
                  const newHierarchy = f.hierarchy.map(h => {
                    if (h.role === "ruler") return { ...h, name: conspirator.name, title: h.title };
                    if (h === conspirator) return { ...h, name: generateReplacementName(rng), role: conspiratorRole };
                    return h;
                  });
                  return { ...f, hierarchy: newHierarchy, power: Math.max(0, f.power - 5) };
                }),
                npcs: d.npcs.map(n => n.name === ruler.name ? { ...n, alive: false } : n)
              };
            }
          };
        }
      },
      {
        // Assassination — a faction leader is killed by an assassin (random event)
        id: "assassination",
        weight: 1,
        apply: (data, rng, relations) => {
          const factions = data.factions.filter(f => f.hierarchy?.length > 0 && f.power > 20);
          if (!factions.length) return null;
          const target = pick(factions, rng);
          const ruler = target.hierarchy.find(h => h.role === "ruler");
          if (!ruler) return null;
          const heir = target.hierarchy.find(h => h.role === "heir");
          // Determine who hired the assassin
          const rivals = data.factions.filter(f => f.name !== target.name && (f.rivals?.includes(target.name) || (relations && relations.getRelation(f.name, target.name) > 15)));
          const suspectedEmployer = rivals.length > 0 ? pick(rivals, rng) : null;
          const methods = [
            "poisoned during a state banquet",
            "struck down by an arrow from the shadows",
            "found dead in their chambers with a blade between the ribs",
            "killed by a disguised servant during a private audience",
            "slain by a poisoned dart while addressing the court"
          ];
          const method = pick(methods, rng);
          const suspectText = suspectedEmployer
            ? ` Suspicion falls on agents of the ${suspectedEmployer.name}, though nothing can be proven.`
            : " The assassin's employer remains unknown, fueling paranoid speculation throughout the court.";
          return {
            headline: `${ruler.name} of ${target.name} Assassinated!`,
            detail: `${ruler.name}, ${ruler.title} of the ${target.name}, has been ${method}. The realm is plunged into chaos as ${heir ? heir.name + " scrambles to assume power" : "the succession is thrown into question"}.${suspectText}`,
            category: "political",
            icon: "†",
            importance: "critical",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name !== target.name) return f;
                const newHierarchy = f.hierarchy.map(h => {
                  if (h.role === "ruler" && heir) return { ...h, name: heir.name };
                  if (h.role === "heir") return { ...h, name: generateReplacementName(rng) };
                  return h;
                });
                // Major destabilization — significant power loss
                return { ...f, hierarchy: newHierarchy, power: Math.max(5, f.power - 20), trend: "declining" };
              }),
              npcs: d.npcs.map(n => n.name === ruler.name ? { ...n, alive: false } : n),
              // All regions under this faction become tense
              regions: d.regions.map(r => r.ctrl === target.name ? { ...r, state: r.state === "stable" ? "tense" : r.state, threat: r.threat === "low" ? "medium" : r.threat } : r),
            }),
            relationMutation: (rel) => {
              // Suspicion worsens relations with the suspected employer
              if (suspectedEmployer) {
                rel.modifyRelation(target.name, suspectedEmployer.name, 15);
              }
            }
          };
        }
      },
      {
        id: "royal_wedding",
        weight: 2,
        apply: (data, rng) => {
          const eligible = data.factions.filter(f => !f.allies?.includes(data.factions.find(x => x !== f)?.name) && f.power > 15);
          if (eligible.length < 2) return null;
          const [a, b] = pickN(eligible, 2, rng);
          const royalty = ["Prince", "Princess", "Duke", "Duchess", "Heir"];
          return {
            headline: `${pick(royalty, rng)} of ${a.name} Weds ${pick(royalty, rng)} of ${b.name}`,
            detail: `A grand wedding ceremony has united the ${a.name} and ${b.name} through marriage. This dynastic union cements a powerful alliance between the two factions.`,
            category: "political",
            icon: "✠",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === a.name) return { ...f, allies: [...new Set([...(f.allies || []), b.name])], attitude: "friendly" };
                if (f.name === b.name) return { ...f, allies: [...new Set([...(f.allies || []), a.name])], attitude: "friendly" };
                return f;
              })
            })
          };
        }
      },
      {
        id: "diplomatic_summit",
        weight: 3,
        apply: (data, rng) => {
          const rivals = [];
          for (const f of data.factions) {
            for (const rName of (f.rivals || [])) {
              const r = data.factions.find(x => x.name === rName);
              if (r && !f.allies?.includes(r.name)) rivals.push([f, r]);
            }
          }
          if (!rivals.length) return null;
          const [a, b] = pick(rivals, rng);
          const outcomes = [
            { result: "truce", duration: "temporary" },
            { result: "negotiation", duration: "fragile" },
          ];
          const outcome = pick(outcomes, rng);
          return {
            headline: `Diplomatic Summit: ${a.name} and ${b.name} Negotiate`,
            detail: `High-ranking diplomats from the ${a.name} and ${b.name} have met to discuss a ${outcome.duration} ceasefire. Tensions ease momentarily as both sides seek respite from conflict.`,
            category: "political",
            icon: "⊘",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => {
                if ((r.ctrl === a.name || r.ctrl === b.name) && r.state === "contested") {
                  return { ...r, threat: r.threat === "high" ? "medium" : r.threat };
                }
                return r;
              })
            })
          };
        }
      },
      {
        id: "tax_revolt",
        weight: 2,
        apply: (data, rng) => {
          const controlled = data.regions.filter(r => r.ctrl);
          if (!controlled.length) return null;
          const region = pick(controlled, rng);
          return {
            headline: `Tax Revolt in ${region.name}`,
            detail: `Citizens of ${region.name} have risen up against heavy taxation imposed by the ${region.ctrl}. Protests have turned violent as the ruling faction struggles to maintain order.`,
            category: "political",
            icon: "⟡",
            importance: "major",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "contested", threat: "high" } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.max(0, f.power - 4) } : f)
            })
          };
        }
      },
      {
        id: "coronation",
        weight: 2,
        apply: (data, rng) => {
          const factions = data.factions.filter(f => f.hierarchy?.some(h => h.role === "ruler"));
          if (!factions.length) return null;
          const faction = pick(factions, rng);
          return {
            headline: `New Ruler Crowned: ${faction.name} Ascends Under New Leadership`,
            detail: `After the death and retirement of the previous ruler, a new leader has been formally coronated as the head of the ${faction.name}. The hierarchy is reorganized as courtiers vie for position near the throne.`,
            category: "political",
            icon: "♔",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => f.name === faction.name ? { ...f, power: Math.min(100, f.power + 2), attitude: "neutral" } : f)
            })
          };
        }
      },
      {
        id: "espionage_uncovered",
        weight: 2,
        apply: (data, rng) => {
          if (data.factions.length < 2) return null;
          const [a, b] = pickN(data.factions, 2, rng);
          return {
            headline: `Spy Ring Discovered: ${a.name} Exposed in ${b.name}`,
            detail: `An extensive espionage network operating on behalf of the ${a.name} has been uncovered within ${b.name} territory. The discovery has sparked outrage and severely damaged diplomatic relations between the two factions.`,
            category: "political",
            icon: "◉",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === a.name) return { ...f, power: Math.max(0, f.power - 5) };
                if (f.name === b.name) return { ...f, rivals: [...new Set([...(f.rivals || []), a.name])] };
                return f;
              })
            })
          };
        }
      },
      {
        id: "vassal_submission",
        weight: 2,
        apply: (data, rng, relations) => {
          const weak = data.factions.filter(f => f.power < 25);
          const strong = data.factions.filter(f => f.power > 50);
          if (!weak.length || !strong.length) return null;
          const vassal = pick(weak, rng);
          const overlord = pick(strong, rng);
          if (vassal.name === overlord.name) return null;
          return {
            headline: `${vassal.name} Submits to ${overlord.name}`,
            detail: `Facing overwhelming pressure and dwindling resources, the ${vassal.name} has submitted to the overlordship of the ${overlord.name}. In exchange for protection, they agree to pay tribute and provide soldiers when called upon.`,
            category: "political",
            icon: "⏣",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === vassal.name) return { ...f, attitude: "neutral", power: Math.max(0, f.power - 3) };
                if (f.name === overlord.name) return { ...f, power: Math.min(100, f.power + 2) };
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(vassal.name, overlord.name, 15);
              rel.addTreaty(vassal.name, overlord.name, "vassal_tribute");
            }
          };
        }
      },
      {
        id: "independence_declared",
        weight: 2,
        apply: (data, rng, relations) => {
          if (!relations) return null;
          const vassals = [];
          for (const f of data.factions) {
            for (const f2 of data.factions) {
              if (f.name !== f2.name && relations.hasTreaty(f.name, f2.name, "vassal_tribute")) {
                vassals.push([f, f2]);
              }
            }
          }
          if (!vassals.length) return null;
          const [vassal, overlord] = pick(vassals, rng);
          return {
            headline: `${vassal.name} Declares Independence from ${overlord.name}`,
            detail: `After years of vassalage, the ${vassal.name} have risen up and declared independence. The ${overlord.name} views this as a grave betrayal of their agreement.`,
            category: "political",
            icon: "⊙",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === vassal.name) return { ...f, power: Math.min(100, f.power + 5), attitude: "hostile" };
                if (f.name === overlord.name) return { ...f, power: Math.max(0, f.power - 3) };
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(vassal.name, overlord.name, -40);
              rel.removeTreaty(vassal.name, overlord.name, "vassal_tribute");
              rel.declareWar(vassal.name, overlord.name);
            }
          };
        }
      },
      {
        id: "peace_treaty",
        weight: 1,
        apply: (data, rng, relations) => {
          if (!relations) return null;
          const activeWars = [];
          for (const [key, war] of Object.entries(relations.activeWars)) {
            activeWars.push(key);
          }
          if (!activeWars.length) return null;
          const warKey = pick(activeWars, rng);
          const [fA, fB] = warKey.split('-');
          const factionA = data.factions.find(f => f.name === fA);
          const factionB = data.factions.find(f => f.name === fB);
          if (!factionA || !factionB) return null;
          const winner = relations.getWarScore(fA, fB) > 0 ? factionA : factionB;
          const loser = winner.name === fA ? factionB : factionA;
          return {
            headline: `Peace Treaty Signed: ${fA} and ${fB}`,
            detail: `After a long and bitter conflict, the ${fA} and ${fB} have negotiated a peace treaty. The ${winner.name} emerge victorious and have secured significant territorial concessions.`,
            category: "political",
            icon: "⊕",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === winner.name) return { ...f, attitude: "neutral", trend: "stable" };
                if (f.name === loser.name) return { ...f, attitude: "neutral", trend: "stable", power: Math.max(0, f.power - 5) };
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.endWar(fA, fB);
              rel.modifyRelation(fA, fB, -5);
            }
          };
        }
      },
      {
        id: "non_aggression_pact",
        weight: 2,
        apply: (data, rng, relations) => {
          const rivals = [];
          for (const f of data.factions) {
            for (const rName of (f.rivals || [])) {
              const r = data.factions.find(x => x.name === rName);
              if (r && relations && relations.getRelation(f.name, r.name) > -50) rivals.push([f, r]);
            }
          }
          if (!rivals.length) return null;
          const [a, b] = pick(rivals, rng);
          return {
            headline: `Non-Aggression Pact: ${a.name} and ${b.name}`,
            detail: `Tired of constant conflict, the ${a.name} and ${b.name} have agreed to a non-aggression pact. Both sides pledge to stop military hostilities and refrain from attacks on each other's territories.`,
            category: "political",
            icon: "⊘",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === a.name || f.name === b.name) {
                  return { ...f, attitude: f.attitude === "hostile" ? "neutral" : f.attitude };
                }
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(a.name, b.name, 20);
              rel.addTreaty(a.name, b.name, "non_aggression_pact");
            }
          };
        }
      },
      {
        id: "betrayal",
        weight: 1,
        apply: (data, rng, relations) => {
          const allied = [];
          for (const f of data.factions) {
            for (const aName of (f.allies || [])) {
              const a = data.factions.find(x => x.name === aName);
              if (a) allied.push([f, a]);
            }
          }
          if (!allied.length) return null;
          const [betrayer, victim] = pick(allied, rng);
          return {
            headline: `Betrayal! ${betrayer.name} Turns on ${victim.name}`,
            detail: `In a shocking turn of events, the ${betrayer.name} have backstabbed their former ally, the ${victim.name}. All treaties are abandoned and open hostilities erupt as trust shatters completely.`,
            category: "political",
            icon: "†",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === betrayer.name) return { ...f, allies: (f.allies || []).filter(x => x !== victim.name), attitude: "hostile", power: Math.min(100, f.power + 5) };
                if (f.name === victim.name) return { ...f, allies: (f.allies || []).filter(x => x !== betrayer.name), rivals: [...(f.rivals || []), betrayer.name], attitude: "hostile", power: Math.max(0, f.power - 5) };
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(betrayer.name, victim.name, -80);
              rel.removeTreaty(betrayer.name, victim.name, "military_alliance");
              rel.removeTreaty(betrayer.name, victim.name, "trade_agreement");
              rel.declareWar(betrayer.name, victim.name);
            }
          };
        }
      },
      {
        id: "revolution",
        weight: 2,
        apply: (data, rng) => {
          const eligible = data.factions.filter(f => f.power < 50 || f.trend === "declining");
          if (!eligible.length) return null;
          const faction = pick(eligible, rng);
          const govTypes = ["republic", "council", "commune", "theocracy", "military junta", "tribal confederacy", "oligarchy", "democracy"];
          const newGovType = pick(govTypes.filter(g => g !== faction.govType), rng);
          const shouldRename = rng() < 0.3;
          let newName = faction.name;
          if (shouldRename) {
            const templates = [
              `Free ${faction.name}`,
              `People's Council of ${faction.name}`,
              `United ${faction.name}`,
              `${faction.name} Republic`,
              `Democratic ${faction.name}`
            ];
            newName = pick(templates, rng);
          }
          const ruler = faction.hierarchy?.find(h => h.role === "ruler");
          const rulerTitle = newGovType === "republic" ? "President" : newGovType === "council" ? "Chancellor" : newGovType === "commune" ? "Coordinator" : newGovType === "theocracy" ? "High Priest" : newGovType === "military junta" ? "General" : newGovType === "tribal confederacy" ? "Chieftain" : newGovType === "oligarchy" ? "Elder" : "Prime Minister";
          return {
            headline: `${faction.name} Undergoes Revolution!`,
            detail: `The ${faction.name} has undergone a dramatic upheaval. The old order has been cast down and a new ${newGovType} has risen in its place. ${newName !== faction.name ? `The faction has also renamed itself to the ${newName}.` : ""}`,
            category: "political",
            icon: "●",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name !== faction.name) return f;
                const newHierarchy = f.hierarchy.map(h => {
                  if (h.role === "ruler") return { ...h, name: generateReplacementName(rng), title: rulerTitle };
                  return h;
                });
                // Update allies/rivals references in other factions
                return { ...f, name: newName, govType: newGovType, hierarchy: newHierarchy, power: Math.max(0, f.power - (10 + Math.floor(rng() * 10))), trend: "declining" };
              }).map(f => ({
                ...f,
                allies: (f.allies || []).map(a => a === faction.name ? newName : a),
                rivals: (f.rivals || []).map(r => r === faction.name ? newName : r),
              })),
              regions: d.regions.map(r => ({
                ...r,
                ctrl: r.ctrl === faction.name ? newName : r.ctrl,
                state: r.ctrl === faction.name ? "tense" : r.state,
              })),
              cities: (d.cities || []).map(c => ({ ...c, faction: c.faction === faction.name ? newName : c.faction })),
              npcs: (d.npcs || []).map(n => ({ ...n, faction: n.faction === faction.name ? newName : n.faction })),
            })
          };
        }
      },
      {
        id: "kingdom_renamed",
        weight: 1,
        apply: (data, rng) => {
          const conquerors = [];
          for (const f of data.factions) {
            const hasConquered = data.regions.some(r => r.ctrl === f.name && r.state === "conquered");
            if (hasConquered) conquerors.push(f);
          }
          if (!conquerors.length) return null;
          const faction = pick(conquerors, rng);
          const templates = [
            `Greater ${faction.name}`,
            `${faction.name} Empire`,
            `United ${faction.name}`,
            `Restored ${faction.name}`,
            `Triumphant ${faction.name}`
          ];
          const newName = pick(templates, rng);
          const ruler = faction.hierarchy?.find(h => h.role === "ruler");
          const newTitle = faction.govType === "monarchy" ? "Emperor" : faction.govType === "republic" ? "Consul" : "Overlord";
          return {
            headline: `${faction.name} Renamed to ${newName}`,
            detail: `Following its recent military conquests, the ${faction.name} has declared a new name to reflect its expanded dominion: the ${newName}. Official proclamations herald a new era of glory and strength.`,
            category: "political",
            icon: "♜",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name !== faction.name) return f;
                const newHierarchy = f.hierarchy.map(h => {
                  if (h.role === "ruler") return { ...h, title: newTitle };
                  return h;
                });
                return { ...f, name: newName, hierarchy: newHierarchy };
              }).map(f => ({
                ...f,
                allies: (f.allies || []).map(a => a === faction.name ? newName : a),
                rivals: (f.rivals || []).map(r => r === faction.name ? newName : r),
              })),
              regions: d.regions.map(r => ({ ...r, ctrl: r.ctrl === faction.name ? newName : r.ctrl })),
              cities: (d.cities || []).map(c => ({ ...c, faction: c.faction === faction.name ? newName : c.faction })),
              npcs: (d.npcs || []).map(n => ({ ...n, faction: n.faction === faction.name ? newName : n.faction })),
            })
          };
        }
      },
      {
        id: "border_shift",
        weight: 3,
        apply: (data, rng, relations) => {
          if (data.factions.length < 2) return null;
          const border = [];
          for (const f1 of data.factions) {
            for (const f2 of data.factions) {
              if (f1.name !== f2.name) {
                const hasAdjacentRegions = data.regions.some(r1 => r1.ctrl === f1.name && data.regions.some(r2 => r2.ctrl === f2.name));
                if (hasAdjacentRegions && (relations?.getRelation(f1.name, f2.name) > 10 || f1.power > f2.power * 1.5)) {
                  border.push([f1, f2]);
                }
              }
            }
          }
          if (!border.length) return null;
          const [stronger, weaker] = pick(border, rng);
          const regions = data.regions.filter(r => r.ctrl === weaker.name);
          if (!regions.length) return null;
          const transferred = pick(regions, rng);
          return {
            headline: `Border Shift: ${transferred.name} Changes Hands`,
            detail: `Through diplomatic negotiation and subtle pressure, the ${stronger.name} has convinced the ${weaker.name} to cede control of ${transferred.name}. The border has been redrawn and new banners now fly over the region.`,
            category: "political",
            icon: "⬡",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === transferred.name ? { ...r, ctrl: stronger.name } : r),
              factions: d.factions.map(f => {
                if (f.name === stronger.name) return { ...f, power: Math.min(100, f.power + 2) };
                if (f.name === weaker.name) return { ...f, power: Math.max(0, f.power - 2) };
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(stronger.name, weaker.name, 5);
            }
          };
        }
      },
      {
        // Full kingdom annexation — a powerful faction absorbs ALL territories of a weaker one
        // This merges borders on the map, making one larger unified kingdom
        id: "territory_annexed",
        weight: 1,
        apply: (data, rng, relations) => {
          if (data.factions.length < 2) return null;
          // Find a dominant faction that controls significantly more territory/power
          const factionPower = data.factions.map(f => ({
            faction: f,
            regions: data.regions.filter(r => r.ctrl === f.name).length,
            power: f.power || 50,
          })).sort((a, b) => b.power - a.power);

          // The strongest faction can annex the weakest if power difference is large enough
          const strongest = factionPower[0];
          const weakest = factionPower[factionPower.length - 1];
          if (!strongest || !weakest || strongest.faction.name === weakest.faction.name) return null;
          if (strongest.power < 60 || weakest.faction.power > 35) return null;
          if (weakest.regions < 1) return null;

          // Must be at war or have very hostile relations
          const atWar = relations && relations.isAtWar(strongest.faction.name, weakest.faction.name);
          const veryHostile = relations && relations.getRelation(strongest.faction.name, weakest.faction.name) > 30;
          if (!atWar && !veryHostile && rng() > 0.2) return null;

          const annexedRegions = data.regions.filter(r => r.ctrl === weakest.faction.name).map(r => r.name);
          const annexedCities = data.cities.filter(c => annexedRegions.includes(c.region)).map(c => c.name);

          return {
            headline: `${strongest.faction.name} Annexes the ${weakest.faction.name}!`,
            detail: `In a decisive act of military and political dominance, the ${strongest.faction.name} has formally annexed all territories held by the ${weakest.faction.name}. The conquered regions of ${annexedRegions.slice(0, 3).join(", ")}${annexedRegions.length > 3 ? ` and ${annexedRegions.length - 3} more` : ""} now fly the banners of the ${strongest.faction.name}. The ${weakest.faction.name} ceases to exist as a sovereign power, its remaining leadership either swearing fealty or fleeing into exile. The map of the realm has been redrawn — the ${strongest.faction.name} now commands a vast unified domain.`,
            category: "military",
            icon: "♔",
            importance: "critical",
            mutations: (d) => ({
              ...d,
              // Transfer ALL regions to the conquering faction
              regions: d.regions.map(r => {
                if (r.ctrl === weakest.faction.name) {
                  return { ...r, ctrl: strongest.faction.name, state: "conquered", threat: "medium" };
                }
                return r;
              }),
              // Transfer all cities
              cities: d.cities.map(c => {
                if (annexedRegions.includes(c.region)) {
                  return { ...c, faction: strongest.faction.name };
                }
                return c;
              }),
              // Update faction power — conqueror absorbs the defeated's remaining power
              factions: d.factions.map(f => {
                if (f.name === strongest.faction.name) {
                  return { ...f, power: Math.min(100, f.power + Math.floor(weakest.faction.power * 0.5) + 10), trend: "rising" };
                }
                if (f.name === weakest.faction.name) {
                  return { ...f, power: 0, trend: "declining" };
                }
                return f;
              }),
              // NPCs from the conquered faction lose their faction affiliation
              npcs: d.npcs.map(n => {
                if (n.faction === weakest.faction.name) {
                  return { ...n, faction: strongest.faction.name };
                }
                return n;
              }),
            }),
            relationMutation: (rel) => {
              if (atWar) rel.endWar(strongest.faction.name, weakest.faction.name);
              // Other factions grow wary of the new superpower
              data.factions.forEach(f => {
                if (f.name !== strongest.faction.name && f.name !== weakest.faction.name) {
                  rel.modifyRelation(f.name, strongest.faction.name, 8);
                }
              });
            }
          };
        }
      },
      {
        id: "faction_collapse",
        weight: 1,
        apply: (data, rng) => {
          const collapsing = data.factions.filter(f => f.power < 15 && data.factions.length > 1);
          if (!collapsing.length) return null;
          const faction = pick(collapsing, rng);
          return {
            headline: `${faction.name} Disintegrates!`,
            detail: `The ${faction.name} has finally succumbed to internal strife and external pressures. Their territories fall into chaos and are claimed by neighboring powers or left contested. A once-proud faction ceases to exist as a coherent power.`,
            category: "political",
            icon: "☠",
            importance: "major",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.ctrl === faction.name ? { ...r, ctrl: undefined, state: "contested", threat: "high" } : r),
              factions: d.factions.map(f => {
                if (f.name === faction.name) return { ...f, power: 0, trend: "declining" };
                if (f.allies?.includes(faction.name)) return { ...f, allies: (f.allies || []).filter(x => x !== faction.name) };
                if (f.rivals?.includes(faction.name)) return { ...f, rivals: (f.rivals || []).filter(x => x !== faction.name) };
                return f;
              })
            })
          };
        }
      },
      {
        id: "faction_emergence",
        weight: 1,
        apply: (data, rng) => {
          const candidates = data.factions.filter(f => f.power > 70 && data.regions.filter(r => r.ctrl === f.name).length >= 3);
          if (!candidates.length) return null;
          const parent = pick(candidates, rng);
          const parentRegions = data.regions.filter(r => r.ctrl === parent.name);
          const splitCount = Math.min(2, parentRegions.length - 1);
          const splitRegions = pickN(parentRegions, Math.min(splitCount, Math.floor(rng() * 2) + 1), rng);
          if (!splitRegions.length) return null;
          const govTypes = ["republic", "council", "monarchy", "tribal", "oligarchy"];
          const rulerTitles = ["Chancellor", "President", "Chieftain", "Elder", "Consul"];
          const newGovType = pick(govTypes, rng);
          const newRulerTitle = pick(rulerTitles, rng);
          const newName = `${pick(splitRegions, rng).name} ${pick(["Confederacy", "League", "Free State", "Principality"], rng)}`;
          const newFaction = {
            id: data.factions.length + 1,
            name: newName,
            attitude: "neutral",
            power: 30 + Math.floor(rng() * 20),
            trend: "rising",
            desc: "A newly independent state that has broken away from its parent faction.",
            color: pick(["#8b6d4a", "#4a6d8b", "#6d8b4a", "#8b4a6d", "#4a8b6d", "#6d4a8b", "#7a5c3c", "#3c5c7a"], rng),
            govType: newGovType,
            hierarchy: [{ title: newRulerTitle, name: generateReplacementName(rng), role: "ruler" }],
            resources: [],
            allies: [],
            rivals: [parent.name]
          };
          return {
            headline: `${newName} Emerges from ${parent.name}!`,
            detail: `A revolutionary movement within the ${parent.name} has succeeded in establishing an independent state. The regions of ${splitRegions.map(r => r.name).join(" and ")} have declared themselves free from ${parent.name} rule. A new faction, the ${newName}, now stands as a separate power.`,
            category: "political",
            icon: "🆕",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: [...d.factions.map(f => {
                if (f.name === parent.name) return { ...f, power: Math.max(0, f.power - 15), trend: "declining" };
                return f;
              }), newFaction],
              regions: d.regions.map(r => splitRegions.some(sr => sr.name === r.name) ? { ...r, ctrl: newName, state: "tense" } : r)
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(parent.name, newName, -20);
            }
          };
        }
      },
      {
        id: "government_reform",
        weight: 2,
        apply: (data, rng) => {
          const candidates = data.factions.filter(f => {
            if (f.power <= 40) return false;
            const capital = data.regions.find(r => r.ctrl === f.name && (r.state === "stable" || r.state === "prosperous"));
            return !!capital;
          });
          if (!candidates.length) return null;
          const faction = pick(candidates, rng);
          const govTypes = ["republic", "council", "monarchy", "oligarchy", "democracy", "theocracy"];
          const newGovType = pick(govTypes.filter(g => g !== faction.govType), rng);
          const newRulerTitle = newGovType === "republic" ? "President" : newGovType === "council" ? "Chancellor" : newGovType === "monarchy" ? "Monarch" : newGovType === "oligarchy" ? "Elder" : newGovType === "democracy" ? "Prime Minister" : "High Priestess";
          return {
            headline: `${faction.name} Undergoes Peaceful Government Reform`,
            detail: `The ${faction.name} has embarked on a period of peaceful institutional reform. Through deliberation and consensus, the leadership has transitioned to a ${newGovType} system. Citizens celebrate this bloodless transformation of their government.`,
            category: "political",
            icon: "⸎",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name !== faction.name) return f;
                const newHierarchy = f.hierarchy.map(h => {
                  if (h.role === "ruler") return { ...h, title: newRulerTitle };
                  return h;
                });
                return { ...f, govType: newGovType, hierarchy: newHierarchy };
              }),
              regions: d.regions.map(r => r.ctrl === faction.name ? { ...r, state: "stable" } : r)
            }),
            relationMutation: (rel) => {
              for (const other of data.factions) {
                if (other.name !== faction.name && other.govType === newGovType) {
                  rel.modifyRelation(faction.name, other.name, 5);
                }
              }
            }
          };
        }
      },
    ],

    // ── MILITARY ──
    military: [
      {
        id: "war_declared",
        weight: 1,
        apply: (data, rng, relations) => {
          const rivals = [];
          for (const f of data.factions) {
            for (const rName of (f.rivals || [])) {
              const r = data.factions.find(x => x.name === rName);
              if (r) rivals.push([f, r]);
            }
          }
          if (!rivals.length) return null;
          const [aggressor, defender] = pick(rivals, rng);
          // Only declare war if relation < -30 or already at war
          if (relations && relations.getRelation(aggressor.name, defender.name) > -30 && !relations.isAtWar(aggressor.name, defender.name)) return null;
          return {
            headline: `War! ${aggressor.name} Attacks ${defender.name}`,
            detail: `The ${aggressor.name} has declared open war on the ${defender.name}. Armies are mobilizing and border regions are being fortified. Civilians flee the frontier.`,
            category: "military",
            icon: "⚔",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === aggressor.name) return { ...f, attitude: "hostile", power: Math.min(100, f.power + 5), trend: "rising" };
                if (f.name === defender.name) return { ...f, attitude: "hostile", trend: "declining" };
                return f;
              }),
              regions: d.regions.map(r => {
                if (r.ctrl === aggressor.name || r.ctrl === defender.name) return { ...r, state: "contested", threat: "high" };
                return r;
              })
            }),
            relationMutation: (rel) => {
              rel.declareWar(aggressor.name, defender.name);
            }
          };
        }
      },
      {
        id: "territory_seized",
        weight: 2,
        apply: (data, rng, relations) => {
          const contested = data.regions.filter(r => r.state === "contested" || r.threat === "high");
          if (!contested.length) {
            // Pick a border region instead
            const vulnerable = data.regions.filter(r => r.ctrl);
            if (vulnerable.length < 2) return null;
            const target = pick(vulnerable, rng);
            const aggressor = data.factions.find(f => f.name !== target.ctrl && (f.rivals?.includes(target.ctrl) || f.attitude === "hostile"));
            if (!aggressor) return null;
            const oldCtrl = target.ctrl;
            return {
              headline: `${aggressor.name} Seizes ${target.name}`,
              detail: `Forces loyal to the ${aggressor.name} have occupied ${target.name}, wresting control from the ${oldCtrl}. The population watches nervously as new banners are raised over the settlement.`,
              category: "military",
              icon: "⚑",
              importance: "major",
              mutations: (d) => ({
                ...d,
                regions: d.regions.map(r => r.name === target.name ? { ...r, ctrl: aggressor.name, state: "contested", threat: "high" } : r),
                cities: d.cities.map(c => c.region === target.name ? { ...c, faction: aggressor.name } : c),
                npcs: d.npcs.map(n => n.faction === oldCtrl && (d.cities.find(c => c.name === n.home)?.region === target.name) ? { ...n, faction: aggressor.name } : n),
                factions: d.factions.map(f => {
                  if (f.name === aggressor.name) return { ...f, power: Math.min(100, f.power + 8), trend: "rising" };
                  if (f.name === oldCtrl) return { ...f, power: Math.max(0, f.power - 10), trend: "declining" };
                  return f;
                })
              }),
              relationMutation: (rel) => {
                rel.modifyWarScore(aggressor.name, oldCtrl, 5);
              }
            };
          }
          const region = pick(contested, rng);
          const currentCtrl = data.factions.find(f => f.name === region.ctrl);
          const attacker = data.factions.find(f => f.name !== region.ctrl && (f.rivals?.includes(region.ctrl) || f.power > (currentCtrl?.power || 50)));
          if (!attacker) return null;
          // Only allow seizure if at war
          if (relations && !relations.isAtWar(attacker.name, currentCtrl?.name)) return null;
          // If the defending faction is very weak, total destruction
          const isTotalConquest = (currentCtrl?.power || 50) < 20 || rng() < 0.15;
          const newState = isTotalConquest ? "destroyed" : "conquered";
          const headlineVerb = isTotalConquest ? "Razes" : "Captures";
          const detailText = isTotalConquest
            ? `${attacker.name} forces have completely destroyed ${region.name}. Buildings burn, walls lie in ruins, and the ${region.ctrl || "defenders"} are no more.`
            : `After fierce fighting, ${attacker.name} forces have taken control of ${region.name}. The ${region.ctrl || "defenders"} have been driven out.`;
          return {
            headline: `${attacker.name} ${headlineVerb} ${region.name}`,
            detail: detailText,
            category: "military",
            icon: isTotalConquest ? "☠" : "⚑",
            importance: "major",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, ctrl: attacker.name, state: newState, threat: "critical" } : r),
              cities: d.cities.map(c => {
                if (c.region === region.name) {
                  if (isTotalConquest) return { ...c, destroyed: true, faction: attacker.name };
                  return { ...c, faction: attacker.name };
                }
                return c;
              }),
              npcs: d.npcs.map(n => {
                if (n.faction === region.ctrl && isTotalConquest) return { ...n, alive: false };
                return n;
              }),
              factions: d.factions.map(f => {
                if (f.name === attacker.name) return { ...f, power: Math.min(100, f.power + 8) };
                if (f.name === region.ctrl) return { ...f, power: Math.max(0, f.power - 10) };
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.modifyWarScore(attacker.name, currentCtrl?.name, 10);
              // If warScore > 50, war can end with territory transfer
              if (rel.getWarScore(attacker.name, currentCtrl?.name) > 50) {
                rel.endWar(attacker.name, currentCtrl?.name);
              }
            }
          };
        }
      },
      {
        id: "raid",
        weight: 4,
        apply: (data, rng) => {
          const targets = data.cities.filter(c => c.region);
          if (!targets.length) return null;
          const city = pick(targets, rng);
          const raiders = ["bandits", "orcs", "goblins", "mercenaries", "pirates", "undead raiders", "barbarian tribes", "gnoll war-packs"];
          const raider = pick(raiders, rng);
          return {
            headline: `${city.name} Raided by ${raider.charAt(0).toUpperCase() + raider.slice(1)}`,
            detail: `A band of ${raider} attacked ${city.name} in the ${city.region} region. While the town guard managed to drive them off, significant damage was done to the outer districts.`,
            category: "military",
            icon: "⟡",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === city.region ? { ...r, threat: r.threat === "low" ? "medium" : "high" } : r)
            })
          };
        }
      },
      {
        id: "siege_begins",
        weight: 2,
        apply: (data, rng) => {
          const targets = data.regions.filter(r => r.ctrl && r.state !== "destroyed");
          if (!targets.length) return null;
          const region = pick(targets, rng);
          const rivals = data.factions.filter(f => f.name !== region.ctrl && (f.rivals?.includes(region.ctrl) || f.attitude === "hostile"));
          if (!rivals.length) return null;
          const besieger = pick(rivals, rng);
          return {
            headline: `${besieger.name} Lays Siege to ${region.name}`,
            detail: `The ${besieger.name} have surrounded ${region.name} and begun a prolonged siege. Supply lines are cut and the region's defenders prepare for a long and difficult campaign.`,
            category: "military",
            icon: "♜",
            importance: "major",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "contested", threat: "critical" } : r),
              factions: d.factions.map(f => {
                if (f.name === besieger.name) return { ...f, power: Math.min(100, f.power + 3) };
                if (f.name === region.ctrl) return { ...f, power: Math.max(0, f.power - 5) };
                return f;
              })
            })
          };
        }
      },
      {
        // Conquered regions are pacified and stabilized under new ownership
        // This transitions "conquered" regions to "stable", visually integrating them into the new kingdom
        id: "territory_pacified",
        weight: 5,
        apply: (data, rng) => {
          const conqueredRegions = data.regions.filter(r => r.state === "conquered" && r.ctrl);
          if (!conqueredRegions.length) return null;
          const region = pick(conqueredRegions, rng);
          const ctrl = data.factions.find(f => f.name === region.ctrl);
          if (!ctrl) return null;
          return {
            headline: `${region.name} Pacified Under ${ctrl.name} Rule`,
            detail: `After months of military occupation and diplomatic effort, ${region.name} has been fully integrated into the ${ctrl.name}. New administrators have been appointed, resistance has faded, and the banners of the ${ctrl.name} now fly unchallenged over the region. The borders of the realm have been permanently redrawn.`,
            category: "political",
            icon: "⊕",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "stable", threat: "low" } : r),
            })
          };
        }
      },
      {
        id: "mercenary_arrival",
        weight: 2,
        apply: (data, rng) => {
          const factions = data.factions.filter(f => f.power < 80);
          if (!factions.length) return null;
          const faction = pick(factions, rng);
          const mercTypes = ["dragon riders", "sellsword companies", "goblin mercenaries", "orc war-bands", "drow assassins"];
          return {
            headline: `Mercenaries Arrive to Aid ${faction.name}`,
            detail: `A contingent of ${pick(mercTypes, rng)} has been hired by the ${faction.name}. With fresh troops and battle-hardened warriors, the faction's military strength has increased dramatically.`,
            category: "military",
            icon: "⚔",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => f.name === faction.name ? { ...f, power: Math.min(100, f.power + 12), trend: "rising" } : f)
            })
          };
        }
      },
      {
        id: "desertion",
        weight: 2,
        apply: (data, rng) => {
          const factions = data.factions.filter(f => f.power > 20 && f.trend !== "rising");
          if (!factions.length) return null;
          const faction = pick(factions, rng);
          const deserterAmt = Math.floor(rng() * 15) + 5; // 5-20% power loss
          return {
            headline: `Mass Desertion in ${faction.name} Forces`,
            detail: `Soldiers of the ${faction.name} have begun abandoning their posts, disillusioned by constant defeats and poor leadership. The exodus weakens the faction's military capacity.`,
            category: "military",
            icon: "↺",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => f.name === faction.name ? { ...f, power: Math.max(0, f.power - deserterAmt), trend: "declining" } : f)
            })
          };
        }
      },
      {
        id: "fortification_built",
        weight: 2,
        apply: (data, rng) => {
          const controlled = data.regions.filter(r => r.ctrl);
          if (!controlled.length) return null;
          const region = pick(controlled, rng);
          return {
            headline: `New Fortification Completed in ${region.name}`,
            detail: `A massive fortress has been completed in ${region.name}, bolstering the defenses of the ${region.ctrl}. With enhanced fortifications, the region is now far more resistant to invasion.`,
            category: "military",
            icon: "♜",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, threat: r.threat === "high" ? "medium" : r.threat } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.min(100, f.power + 2) } : f)
            })
          };
        }
      },
      {
        id: "arms_race",
        weight: 2,
        apply: (data, rng) => {
          if (data.factions.length < 2) return null;
          const [a, b] = pickN(data.factions, 2, rng);
          return {
            headline: `Arms Race: ${a.name} and ${b.name} Escalate Military Buildup`,
            detail: `In response to perceived threats, both the ${a.name} and the ${b.name} have dramatically increased military production. Armor smithies work day and night, and both factions grow more formidable.`,
            category: "military",
            icon: "⚙",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === a.name || f.name === b.name) {
                  return { ...f, power: Math.min(100, f.power + 4), trend: "rising" };
                }
                return f;
              })
            })
          };
        }
      },
      {
        id: "veterans_return",
        weight: 2,
        apply: (data, rng) => {
          const factions = data.factions.filter(f => f.power < 75);
          if (!factions.length) return null;
          const faction = pick(factions, rng);
          return {
            headline: `Seasoned Veterans Return to ${faction.name}`,
            detail: `Battle-hardened soldiers who were long thought lost have returned from a distant campaign. Their experience and skill have reinvigorated the ${faction.name}'s military forces.`,
            category: "military",
            icon: "⊛",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => f.name === faction.name ? { ...f, power: Math.min(100, f.power + 6), trend: "rising" } : f)
            })
          };
        }
      },
      {
        id: "battle_fought",
        weight: 3,
        apply: (data, rng, relations) => {
          if (!relations) return null;
          const activeWars = [];
          for (const [key] of Object.entries(relations.activeWars)) {
            activeWars.push(key);
          }
          if (!activeWars.length) return null;
          const warKey = pick(activeWars, rng);
          const [fA, fB] = warKey.split('-');
          const factionA = data.factions.find(f => f.name === fA);
          const factionB = data.factions.find(f => f.name === fB);
          if (!factionA || !factionB) return null;
          const powerDiff = factionA.power - factionB.power;
          const winner = powerDiff > 0 ? factionA : factionB;
          const loser = powerDiff > 0 ? factionB : factionA;
          return {
            headline: `Battle: ${winner.name} Defeats ${loser.name}`,
            detail: `A major battle has been fought between the ${factionA.name} and the ${factionB.name}. The ${winner.name} emerge victorious after fierce combat. Casualties are heavy on both sides.`,
            category: "military",
            icon: "⚔",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === winner.name) return { ...f, power: Math.min(100, f.power + 5) };
                if (f.name === loser.name) return { ...f, power: Math.max(0, f.power - 5) };
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.modifyWarScore(fA, fB, powerDiff > 0 ? 8 : -8);
            }
          };
        }
      },
      {
        id: "naval_blockade",
        weight: 2,
        apply: (data, rng, relations) => {
          const rivals = [];
          for (const f of data.factions) {
            for (const rName of (f.rivals || [])) {
              const r = data.factions.find(x => x.name === rName);
              if (r) rivals.push([f, r]);
            }
          }
          if (!rivals.length) return null;
          const [blockader, target] = pick(rivals, rng);
          return {
            headline: `Naval Blockade: ${blockader.name} Seals ${target.name} Coast`,
            detail: `The ${blockader.name} have established a naval blockade along the ${target.name} coast, cutting off vital trade and supply routes. The ${target.name}'s maritime commerce grinds to a halt.`,
            category: "military",
            icon: "⛓",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => f.name === target.name ? { ...f, power: Math.max(0, f.power - 8) } : f),
              regions: d.regions.map(r => r.ctrl === target.name ? { ...r, state: r.state === "prosperous" ? "stable" : r.state } : r)
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(blockader.name, target.name, -10);
            }
          };
        }
      },
      {
        id: "border_skirmish",
        weight: 2,
        apply: (data, rng, relations) => {
          const rivals = [];
          for (const f of data.factions) {
            for (const rName of (f.rivals || [])) {
              const r = data.factions.find(x => x.name === rName);
              if (r) rivals.push([f, r]);
            }
          }
          if (!rivals.length) return null;
          const [a, b] = pick(rivals, rng);
          return {
            headline: `Border Skirmish: ${a.name} vs ${b.name}`,
            detail: `A minor border clash has erupted between soldiers of the ${a.name} and ${b.name}. Though brief, the skirmish leaves wounded on both sides and tensions further inflamed.`,
            category: "military",
            icon: "†",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === a.name || f.name === b.name) {
                  return { ...f, power: Math.max(0, f.power - 2) };
                }
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(a.name, b.name, -5);
            }
          };
        }
      },
      {
        id: "joint_military_exercise",
        weight: 2,
        apply: (data, rng, relations) => {
          const allied = [];
          for (const f of data.factions) {
            for (const aName of (f.allies || [])) {
              const a = data.factions.find(x => x.name === aName);
              if (a) allied.push([f, a]);
            }
          }
          if (!allied.length) return null;
          const [a, b] = pick(allied, rng);
          return {
            headline: `Joint Military Exercise: ${a.name} and ${b.name}`,
            detail: `The military forces of the ${a.name} and ${b.name} have conducted a massive joint training exercise. The display of coordinated strength reinforces their alliance and boosts morale.`,
            category: "military",
            icon: "⊞",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === a.name || f.name === b.name) {
                  return { ...f, power: Math.min(100, f.power + 2) };
                }
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(a.name, b.name, 5);
            }
          };
        }
      },

      // ═══════════════════════════════════════════════════════════
      //  SIEGE MECHANICS — extended warfare events
      // ═══════════════════════════════════════════════════════════
      {
        id: "siege_escalates",
        weight: 3,
        apply: (data, rng, relations) => {
          const besieged = data.regions.filter(r => r.state === "contested" && r.threat === "critical" && r.ctrl);
          if (!besieged.length) return null;
          const region = pick(besieged, rng);
          const besiegers = data.factions.filter(f => f.name !== region.ctrl && (f.rivals?.includes(region.ctrl) || (relations && relations.isAtWar(f.name, region.ctrl))));
          if (!besiegers.length) return null;
          const besieger = pick(besiegers, rng);
          const tactics = [
            { name: "sappers", desc: `Tunnelers from the ${besieger.name} have burrowed beneath the walls of ${region.name}. The foundations groan and crack as siege engineers collapse key sections, leaving the defenders scrambling to shore up breaches.`, defLoss: 8, atkGain: 3 },
            { name: "siege towers", desc: `Massive wooden siege towers, clad in wet hides against fire, roll toward the walls of ${region.name}. The ${besieger.name} troops scale the ramparts under a hail of arrows, gaining a foothold on the battlements.`, defLoss: 6, atkGain: 4 },
            { name: "Greek fire", desc: `Alchemical fire rains down on ${region.name} as the ${besieger.name} deploys incendiary weapons. Buildings within the walls burn uncontrollably, sowing panic among the defenders.`, defLoss: 10, atkGain: 2 },
            { name: "starvation", desc: `With supply lines severed for weeks, the defenders of ${region.name} grow gaunt. Rats and leather become meals. The ${besieger.name} need only wait as hunger does the work of a thousand soldiers.`, defLoss: 7, atkGain: 1 },
            { name: "bombardment", desc: `Day and night, the trebuchets of the ${besieger.name} hurl massive stones into ${region.name}. Towers crumble, walls crack, and morale within the city plummets with each thunderous impact.`, defLoss: 9, atkGain: 3 },
          ];
          const tactic = pick(tactics, rng);
          return {
            headline: `Siege of ${region.name} Intensifies — ${tactic.name.charAt(0).toUpperCase() + tactic.name.slice(1)}`,
            detail: tactic.desc,
            category: "military",
            icon: "🔥",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === besieger.name) return { ...f, power: Math.min(100, f.power + tactic.atkGain) };
                if (f.name === region.ctrl) return { ...f, power: Math.max(0, f.power - tactic.defLoss) };
                return f;
              })
            }),
            relationMutation: (rel) => {
              if (rel && region.ctrl) rel.modifyWarScore(besieger.name, region.ctrl, 5);
            }
          };
        }
      },
      {
        id: "siege_broken",
        weight: 2,
        apply: (data, rng, relations) => {
          const besieged = data.regions.filter(r => r.state === "contested" && r.threat === "critical" && r.ctrl);
          if (!besieged.length) return null;
          const region = pick(besieged, rng);
          const defender = data.factions.find(f => f.name === region.ctrl);
          if (!defender || defender.power < 15) return null;
          const methods = [
            `A daring night sally by the garrison of ${region.name} shattered the besieging camp. Fires lit among the siege equipment spread chaos, and the attackers fled into the darkness.`,
            `A relief army arrived from allied territory, smashing through the siege lines surrounding ${region.name}. The besiegers, caught between the garrison and the relief force, were routed.`,
            `The defenders of ${region.name} discovered a weak point in the enemy encirclement and launched a devastating counterattack. Siege engines were captured and turned against their makers.`,
            `Foul weather and disease ravaged the besieging army outside ${region.name}. With soldiers dying faster from plague than combat, the siege collapsed of its own accord.`,
          ];
          return {
            headline: `Siege of ${region.name} Broken!`,
            detail: pick(methods, rng),
            category: "military",
            icon: "⚑",
            importance: "major",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "tense", threat: "medium" } : r),
              factions: d.factions.map(f => {
                if (f.name === defender.name) return { ...f, power: Math.min(100, f.power + 6), trend: "rising" };
                return f;
              })
            }),
            relationMutation: (rel) => {
              if (rel && region.ctrl) {
                const enemy = data.factions.find(f => f.name !== region.ctrl && rel.isAtWar(f.name, region.ctrl));
                if (enemy) rel.modifyWarScore(enemy.name, region.ctrl, -8);
              }
            }
          };
        }
      },
      {
        id: "wall_breach",
        weight: 2,
        apply: (data, rng, relations) => {
          const walled = data.regions.filter(r => r.state === "contested" && r.ctrl && (r.type === "capital" || r.type === "city"));
          if (!walled.length) return null;
          const region = pick(walled, rng);
          const attackers = data.factions.filter(f => f.name !== region.ctrl && (relations ? relations.isAtWar(f.name, region.ctrl) : f.rivals?.includes(region.ctrl)));
          if (!attackers.length) return null;
          const attacker = pick(attackers, rng);
          return {
            headline: `Walls of ${region.name} Breached!`,
            detail: `After relentless bombardment, the great walls of ${region.name} have been breached. The ${attacker.name} pour through the gap in a tide of steel. Street-to-street fighting erupts as the defenders fall back to inner fortifications, but the outcome hangs by a thread.`,
            category: "military",
            icon: "💥",
            importance: "critical",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, threat: "critical" } : r),
              factions: d.factions.map(f => {
                if (f.name === attacker.name) return { ...f, power: Math.min(100, f.power + 5) };
                if (f.name === region.ctrl) return { ...f, power: Math.max(0, f.power - 8) };
                return f;
              })
            }),
            relationMutation: (rel) => {
              if (rel) rel.modifyWarScore(attacker.name, region.ctrl, 8);
            }
          };
        }
      },
      {
        id: "siege_sortie",
        weight: 2,
        apply: (data, rng) => {
          const besieged = data.regions.filter(r => r.state === "contested" && r.ctrl);
          if (!besieged.length) return null;
          const region = pick(besieged, rng);
          const defender = data.factions.find(f => f.name === region.ctrl);
          if (!defender) return null;
          const success = rng() > 0.45;
          return {
            headline: success
              ? `Garrison of ${region.name} Launches Successful Sortie`
              : `Failed Sortie from ${region.name}`,
            detail: success
              ? `Under cover of dawn mist, the garrison of ${region.name} burst from the gates and struck the siege camp of the enemy. Siege engines were set ablaze and supply wagons captured before the defenders withdrew behind their walls, bloodied but victorious.`
              : `A desperate sortie from ${region.name} met a prepared enemy. The garrison suffered heavy losses and was forced back behind the walls, their morale shaken and their numbers thinned.`,
            category: "military",
            icon: success ? "⚔" : "↺",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === defender.name) return { ...f, power: Math.max(0, f.power + (success ? 4 : -6)) };
                return f;
              }),
              regions: d.regions.map(r => r.name === region.name && !success ? { ...r, threat: "critical" } : r)
            })
          };
        }
      },
      {
        id: "siege_disease",
        weight: 2,
        apply: (data, rng) => {
          const besieged = data.regions.filter(r => r.state === "contested" && r.threat === "critical" && r.ctrl);
          if (!besieged.length) return null;
          const region = pick(besieged, rng);
          const affectsBoth = rng() > 0.5;
          const diseases = ["dysentery", "plague", "typhus", "cholera", "the sweating sickness"];
          const disease = pick(diseases, rng);
          const besieger = data.factions.find(f => f.name !== region.ctrl && (f.rivals?.includes(region.ctrl) || f.attitude === "hostile"));
          return {
            headline: `${disease.charAt(0).toUpperCase() + disease.slice(1)} Ravages the Siege of ${region.name}`,
            detail: affectsBoth
              ? `${disease.charAt(0).toUpperCase() + disease.slice(1)} has broken out among both the defenders of ${region.name} and the besieging army. Corpses are catapulted over walls, water sources are fouled, and soldiers on both sides fall to fever faster than to swords.`
              : `The cramped and filthy conditions inside besieged ${region.name} have bred ${disease}. The defenders weaken daily, and the stench of death rises over the walls. The besiegers need only wait.`,
            category: "military",
            icon: "☠",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === region.ctrl) return { ...f, power: Math.max(0, f.power - 8) };
                if (affectsBoth && besieger && f.name === besieger.name) return { ...f, power: Math.max(0, f.power - 5) };
                return f;
              })
            })
          };
        }
      },
      {
        id: "siege_negotiation",
        weight: 2,
        apply: (data, rng, relations) => {
          const besieged = data.regions.filter(r => r.state === "contested" && r.ctrl);
          if (!besieged.length) return null;
          const region = pick(besieged, rng);
          const defender = data.factions.find(f => f.name === region.ctrl);
          const attacker = data.factions.find(f => f.name !== region.ctrl && (relations ? relations.isAtWar(f.name, region.ctrl) : f.rivals?.includes(region.ctrl)));
          if (!defender || !attacker) return null;
          const accepted = rng() > 0.6;
          return {
            headline: accepted
              ? `${region.name} Surrenders After Siege Negotiations`
              : `Siege Negotiations Collapse at ${region.name}`,
            detail: accepted
              ? `After protracted negotiations, the defenders of ${region.name} have agreed to open their gates to the ${attacker.name}. In exchange for a bloodless surrender, the garrison is allowed to march out with their weapons. The region changes hands without further destruction.`
              : `Negotiations between the ${attacker.name} and the besieged ${defender.name} garrison in ${region.name} have collapsed. The defenders vow to fight to the last, and the ${attacker.name} prepare for a final, bloody assault.`,
            category: "military",
            icon: accepted ? "🏳" : "⚔",
            importance: "major",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => {
                if (r.name !== region.name) return r;
                return accepted
                  ? { ...r, ctrl: attacker.name, state: "conquered", threat: "medium" }
                  : { ...r, threat: "critical" };
              }),
              factions: d.factions.map(f => {
                if (accepted && f.name === attacker.name) return { ...f, power: Math.min(100, f.power + 6) };
                if (accepted && f.name === defender.name) return { ...f, power: Math.max(0, f.power - 8) };
                if (!accepted && f.name === defender.name) return { ...f, power: Math.max(0, f.power + 2) }; // Resolve boost
                return f;
              }),
              cities: accepted ? d.cities.map(c => c.region === region.name ? { ...c, faction: attacker.name } : c) : d.cities
            }),
            relationMutation: (rel) => {
              if (accepted && rel) {
                rel.modifyWarScore(attacker.name, defender.name, 12);
                if (rel.getWarScore(attacker.name, defender.name) > 50) rel.endWar(attacker.name, defender.name);
              }
            }
          };
        }
      },
      {
        id: "siege_relief_army",
        weight: 2,
        apply: (data, rng) => {
          const besieged = data.regions.filter(r => r.state === "contested" && r.threat === "critical" && r.ctrl);
          if (!besieged.length) return null;
          const region = pick(besieged, rng);
          const ctrl = data.factions.find(f => f.name === region.ctrl);
          if (!ctrl) return null;
          const allies = (ctrl.allies || []).map(n => data.factions.find(f => f.name === n)).filter(Boolean);
          const reliever = allies.length > 0 && rng() > 0.4 ? pick(allies, rng) : ctrl;
          const isAlly = reliever.name !== ctrl.name;
          return {
            headline: isAlly
              ? `${reliever.name} Marches to Relieve ${region.name}`
              : `Relief Force Assembles for ${region.name}`,
            detail: isAlly
              ? `Honoring their alliance, the ${reliever.name} have dispatched a relief army to break the siege of ${region.name}. The besiegers now face war on two fronts as fresh troops approach from the ${["north","south","east","west"][Math.floor(rng()*4)]}.`
              : `The ${ctrl.name} have gathered reserves from across their realm and march to relieve the besieged garrison of ${region.name}. The siege may soon be shattered — or a decisive battle fought.`,
            category: "military",
            icon: "🏇",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === ctrl.name) return { ...f, power: Math.min(100, f.power + 4) };
                if (isAlly && f.name === reliever.name) return { ...f, power: Math.max(0, f.power - 2) }; // Cost of sending army
                return f;
              })
            }),
            relationMutation: (rel) => {
              if (isAlly && rel) rel.modifyRelation(ctrl.name, reliever.name, 10);
            }
          };
        }
      },
      {
        id: "scorched_earth",
        weight: 1,
        apply: (data, rng) => {
          const contested = data.regions.filter(r => (r.state === "contested" || r.state === "conquered") && r.ctrl);
          if (!contested.length) return null;
          const region = pick(contested, rng);
          const ctrl = data.factions.find(f => f.name === region.ctrl);
          if (!ctrl) return null;
          return {
            headline: `${ctrl.name} Orders Scorched Earth in ${region.name}`,
            detail: `Rather than let valuable resources fall to the enemy, the ${ctrl.name} have ordered the burning of crops, poisoning of wells, and destruction of infrastructure in ${region.name}. The land itself is turned into a weapon — but at terrible cost to the populace.`,
            category: "military",
            icon: "🔥",
            importance: "critical",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "dangerous", threat: "high" } : r),
              factions: d.factions.map(f => f.name === ctrl.name ? { ...f, power: Math.max(0, f.power - 3) } : f)
            })
          };
        }
      },
      {
        id: "siege_engines_destroyed",
        weight: 2,
        apply: (data, rng) => {
          const besieged = data.regions.filter(r => r.state === "contested" && r.ctrl);
          if (!besieged.length) return null;
          const region = pick(besieged, rng);
          const attacker = data.factions.find(f => f.name !== region.ctrl && (f.rivals?.includes(region.ctrl) || f.attitude === "hostile"));
          if (!attacker) return null;
          const methods = [
            `A daring commando raid by the defenders destroyed the enemy's trebuchets and catapults`,
            `A fire arrow from the walls ignited the pitch stores near the siege engines, and the resulting inferno consumed them all`,
            `Saboteurs infiltrated the enemy camp under cover of darkness and weakened the siege engines' supports, causing them to collapse under their own weight`,
          ];
          return {
            headline: `Siege Engines Destroyed at ${region.name}`,
            detail: `${pick(methods, rng)}. Without their siege equipment, the ${attacker.name} cannot breach the walls of ${region.name}. The siege stalls.`,
            category: "military",
            icon: "💥",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => f.name === attacker.name ? { ...f, power: Math.max(0, f.power - 5) } : f)
            })
          };
        }
      },
    ],

    // ── ECONOMIC ──
    economic: [
      {
        id: "trade_boom",
        weight: 3,
        apply: (data, rng, relations) => {
          const regions = data.regions.filter(r => r.state !== "contested" && r.state !== "dangerous");
          if (!regions.length) return null;
          const region = pick(regions, rng);
          // Try to find another region with a trade route
          let tradePartner = null;
          if (relations) {
            for (const r2 of data.regions) {
              if (r2.name !== region.name && relations.hasTradeRoute(region.name, r2.name)) {
                tradePartner = r2;
                break;
              }
            }
          }
          const goods = ["rare spices", "enchanted crystals", "dwarven steel", "exotic fabrics", "dragon-bone carvings", "elven wine", "adamantine ore", "ancient relics"];
          const good = pick(goods, rng);
          return {
            headline: `Trade Boom in ${region.name}`,
            detail: `A new trade route carrying ${good} has brought unprecedented wealth to ${region.name}. Merchants flock to the region's markets and the economy flourishes.`,
            category: "economic",
            icon: "◆",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "prosperous" } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.min(100, f.power + 3) } : f)
            }),
            relationMutation: (rel) => {
              if (tradePartner && region.ctrl && tradePartner.ctrl && region.ctrl !== tradePartner.ctrl) {
                rel.modifyRelation(region.ctrl, tradePartner.ctrl, 5);
              }
            }
          };
        }
      },
      {
        id: "famine",
        weight: 2,
        apply: (data, rng) => {
          const regions = data.regions.filter(r => r.name);
          if (!regions.length) return null;
          const region = pick(regions, rng);
          return {
            headline: `Famine Strikes ${region.name}`,
            detail: `Crop failures and livestock disease have plunged ${region.name} into famine. The people grow desperate and unrest spreads as food stores dwindle.`,
            category: "economic",
            icon: "⚌",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "dangerous", threat: r.threat === "low" ? "medium" : "high" } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.max(0, f.power - 5) } : f)
            })
          };
        }
      },
      {
        id: "gold_rush",
        weight: 3,
        apply: (data, rng) => {
          const regions = data.regions.filter(r => r.state !== "destroyed");
          if (!regions.length) return null;
          const region = pick(regions, rng);
          const resources = ["gold deposits", "mithril veins", "ruby fields", "diamond deposits", "rare herbs", "arcane crystals"];
          return {
            headline: `Gold Rush in ${region.name}`,
            detail: `Rich deposits of ${pick(resources, rng)} have been discovered in ${region.name}. Prospectors and merchants flock to the region, bringing unprecedented wealth.`,
            category: "economic",
            icon: "◇",
            importance: "major",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "prosperous" } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.min(100, f.power + 8) } : f)
            })
          };
        }
      },
      {
        id: "trade_embargo",
        weight: 2,
        apply: (data, rng, relations) => {
          const factions = data.factions.filter(f => f.allies?.length > 0);
          if (!factions.length) return null;
          const [embargo, target] = (() => {
            const emb = pick(factions, rng);
            const allies = emb.allies || [];
            if (!allies.length) return [emb, pick(data.factions.filter(f => f.name !== emb.name), rng)];
            return [emb, data.factions.find(f => f.name === pick(allies, rng))];
          })();
          if (!target || embargo.name === target.name) return null;
          return {
            headline: `${embargo.name} Imposes Trade Embargo on ${target.name}`,
            detail: `The ${embargo.name} has cut off all trade with the ${target.name}, denying them access to vital goods and resources. The ${target.name}'s economy begins to falter.`,
            category: "economic",
            icon: "⊘",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => f.name === target.name ? { ...f, power: Math.max(0, f.power - 6) } : f),
              regions: d.regions.map(r => r.ctrl === target.name ? { ...r, state: r.state === "prosperous" ? "stable" : r.state } : r)
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(embargo.name, target.name, -20);
              rel.removeTreaty(embargo.name, target.name, "trade_agreement");
            }
          };
        }
      },
      {
        id: "pirate_fleet",
        weight: 2,
        apply: (data, rng) => {
          const coastal = data.regions.filter(r => r.name && Math.random() > 0.5); // Simplified coastal check
          if (!coastal.length) return null;
          const region = pick(coastal, rng);
          return {
            headline: `Pirate Fleet Terrorizes ${region.name} Coast`,
            detail: `A fearsome pirate armada has appeared off the coast of ${region.name}, raiding merchant vessels and coastal settlements. Trade routes are disrupted and insurance costs soar.`,
            category: "economic",
            icon: "☠",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, threat: r.threat === "low" ? "medium" : "high" } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.max(0, f.power - 3) } : f)
            })
          };
        }
      },
      {
        id: "harvest_festival",
        weight: 3,
        apply: (data, rng) => {
          const regions = data.regions.filter(r => r.state !== "destroyed" && r.state !== "dangerous");
          if (!regions.length) return null;
          const region = pick(regions, rng);
          return {
            headline: `Bountiful Harvest Festival in ${region.name}`,
            detail: `An exceptional harvest has blessed ${region.name} with abundance. The ensuing festival draws traders and travelers from across the realm, bringing prosperity and joy to the region.`,
            category: "economic",
            icon: "⚌",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "prosperous" } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.min(100, f.power + 3) } : f)
            })
          };
        }
      },
      {
        id: "market_crash",
        weight: 2,
        apply: (data, rng) => {
          const prosperous = data.regions.filter(r => r.state === "prosperous");
          if (!prosperous.length) return null;
          const region = pick(prosperous, rng);
          return {
            headline: `Market Crash in ${region.name}`,
            detail: `Speculation and overextended credit have led to an economic collapse in ${region.name}. Markets crash, fortunes evaporate, and widespread poverty spreads as merchants go bankrupt.`,
            category: "economic",
            icon: "▼",
            importance: "major",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "stable", threat: "medium" } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.max(0, f.power - 6) } : f)
            })
          };
        }
      },
      {
        id: "new_trade_route",
        weight: 2,
        apply: (data, rng, relations) => {
          const eligible = data.regions.filter(r => r.ctrl);
          if (eligible.length < 2) return null;
          const [a, b] = pickN(eligible, 2, rng);
          return {
            headline: `New Trade Route Established: ${a.name} to ${b.name}`,
            detail: `A new merchant route has been established connecting ${a.name} and ${b.name}. Both regions benefit from increased commerce and economic cooperation between the ${a.ctrl} and ${b.ctrl}.`,
            category: "economic",
            icon: "⟿",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => {
                if (r.name === a.name || r.name === b.name) {
                  return { ...r, state: r.state === "stable" || r.state === "prosperous" ? r.state : "stable" };
                }
                return r;
              }),
              factions: d.factions.map(f => {
                if (f.name === a.ctrl || f.name === b.ctrl) {
                  return { ...f, power: Math.min(100, f.power + 2) };
                }
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.addTradeRoute(a.name, b.name);
              if (a.ctrl && b.ctrl && a.ctrl !== b.ctrl) {
                rel.addTreaty(a.ctrl, b.ctrl, "trade_agreement");
                rel.modifyRelation(a.ctrl, b.ctrl, 10);
              }
            }
          };
        }
      },
      {
        id: "trade_agreement_signed",
        weight: 2,
        apply: (data, rng, relations) => {
          const nonHostile = [];
          for (const f of data.factions) {
            for (const f2 of data.factions) {
              if (f.name !== f2.name && relations && relations.getRelation(f.name, f2.name) > -20) {
                nonHostile.push([f, f2]);
              }
            }
          }
          if (!nonHostile.length) return null;
          const [a, b] = pick(nonHostile, rng);
          return {
            headline: `Trade Agreement: ${a.name} and ${b.name}`,
            detail: `The ${a.name} and ${b.name} have signed a comprehensive trade agreement, opening their markets to each other. Merchants celebrate as tariffs are slashed and commerce flourishes.`,
            category: "economic",
            icon: "◫",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === a.name || f.name === b.name) {
                  return { ...f, power: Math.min(100, f.power + 3) };
                }
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.addTreaty(a.name, b.name, "trade_agreement");
              rel.modifyRelation(a.name, b.name, 10);
            }
          };
        }
      },
      {
        id: "resource_dispute",
        weight: 2,
        apply: (data, rng, relations) => {
          if (data.factions.length < 2) return null;
          const [a, b] = pickN(data.factions, 2, rng);
          const resources = ["iron mines", "timber forests", "grain fields", "fishing grounds", "salt deposits"];
          return {
            headline: `Resource Dispute: ${a.name} vs ${b.name}`,
            detail: `The ${a.name} and ${b.name} are in fierce dispute over control of valuable ${pick(resources, rng)}. Both claim historical rights to the resource and tensions escalate.`,
            category: "economic",
            icon: "⚒",
            importance: "standard",
            mutations: (d) => d,
            relationMutation: (rel) => {
              rel.modifyRelation(a.name, b.name, -15);
              if (rel.getRelation(a.name, b.name) < -50) {
                rel.declareWar(a.name, b.name);
              }
            }
          };
        }
      },
      {
        id: "sanctions_imposed",
        weight: 1,
        apply: (data, rng, relations) => {
          const villains = data.factions.filter(f => f.power > 30);
          const allies = data.factions.filter(f => f.allies?.length > 0);
          if (!villains.length || !allies.length) return null;
          const target = pick(villains, rng);
          const sanctioners = allies.filter(f => f.name !== target.name).slice(0, 2);
          if (!sanctioners.length) return null;
          return {
            headline: `Coalition Imposes Sanctions on ${target.name}`,
            detail: `A coalition of allied factions has imposed comprehensive economic sanctions on the ${target.name} due to their aggressive expansion. Trade is banned and assets frozen.`,
            category: "economic",
            icon: "⊘",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === target.name) return { ...f, power: Math.max(0, f.power - (sanctioners.length * 4)) };
                return f;
              })
            }),
            relationMutation: (rel) => {
              for (const sanctioner of sanctioners) {
                rel.modifyRelation(sanctioner.name, target.name, -20);
              }
            }
          };
        }
      },
      {
        id: "mutual_investment",
        weight: 2,
        apply: (data, rng, relations) => {
          const allied = [];
          for (const f of data.factions) {
            for (const aName of (f.allies || [])) {
              const a = data.factions.find(x => x.name === aName);
              if (a) allied.push([f, a]);
            }
          }
          if (!allied.length) return null;
          const [a, b] = pick(allied, rng);
          const regions = data.regions.filter(r => r.ctrl === a.name || r.ctrl === b.name);
          if (!regions.length) return null;
          const region = pick(regions, rng);
          return {
            headline: `Mutual Investment: ${a.name} and ${b.name}`,
            detail: `The ${a.name} and ${b.name} have announced a major joint investment project in ${region.name}. Infrastructure is built, businesses expand, and both factions benefit from the partnership.`,
            category: "economic",
            icon: "⚒",
            importance: "major",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: r.state === "stable" || r.state === "prosperous" ? "prosperous" : r.state } : r),
              factions: d.factions.map(f => {
                if (f.name === a.name || f.name === b.name) {
                  return { ...f, power: Math.min(100, f.power + 3) };
                }
                return f;
              })
            }),
            relationMutation: (rel) => {
              rel.modifyRelation(a.name, b.name, 8);
            }
          };
        }
      },
    ],

    // ── SOCIAL ──
    social: [
      {
        id: "plague",
        weight: 1,
        apply: (data, rng) => {
          const cities = data.cities.filter(c => c.name);
          if (!cities.length) return null;
          const city = pick(cities, rng);
          const plagues = ["the Crimson Wasting", "Shadowpox", "the Grey Cough", "Boneshiver Fever", "the Weeping Sickness", "Darkblood Plague"];
          return {
            headline: `Plague Outbreak in ${city.name}`,
            detail: `${pick(plagues, rng)} has broken out in ${city.name}. The city gates are sealed and healers work tirelessly, but the death toll rises daily.`,
            category: "social",
            icon: "☠",
            importance: "major",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === city.region ? { ...r, state: "dangerous", threat: "high" } : r)
            })
          };
        }
      },
      {
        id: "festival",
        weight: 4,
        apply: (data, rng) => {
          const cities = data.cities.filter(c => c.name);
          if (!cities.length) return null;
          const city = pick(cities, rng);
          const festivals = [
            "the Festival of the Twin Moons", "Harvest Revel", "the Grand Joust",
            "Midsummer's Fire", "the Night of a Thousand Lanterns", "the Brewer's Feast",
            "the Day of Ancestors", "the Arcane Exhibition", "the Great Market Fair"
          ];
          return {
            headline: `${pick(festivals, rng)} in ${city.name}`,
            detail: `The streets of ${city.name} are alive with celebration. Travelers from across the region gather to partake in the festivities, bringing commerce and merriment.`,
            category: "social",
            icon: "✦",
            importance: "minor",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === city.region ? { ...r, state: r.state === "tense" ? "stable" : r.state } : r)
            })
          };
        }
      },
      {
        id: "uprising",
        weight: 2,
        apply: (data, rng) => {
          const oppressed = data.regions.filter(r => r.state === "contested" || r.state === "dangerous" || r.threat === "high");
          if (!oppressed.length) return null;
          const region = pick(oppressed, rng);
          return {
            headline: `Peasant Uprising in ${region.name}`,
            detail: `The common folk of ${region.name} have risen up against their rulers. Armed with pitchforks and fury, they storm tax collectors' offices and burn noble estates.`,
            category: "social",
            icon: "⊞",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "contested", threat: "high" } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.max(0, f.power - 8), trend: "declining" } : f)
            })
          };
        }
      },
      {
        id: "hero_emerges",
        weight: 3,
        apply: (data, rng) => {
          const factions = data.factions.filter(f => f.power < 90);
          if (!factions.length) return null;
          const faction = pick(factions, rng);
          const heroTypes = ["warrior", "mage", "bard", "rogue", "paladin", "ranger"];
          const heroNames = ["Valoreth", "Brightblade", "Shadowstrike", "Goldenvoice", "Frostborn", "Swifthand"];
          return {
            headline: `A Hero Rises in ${faction.name}`,
            detail: `A legendary ${pick(heroTypes, rng)} named ${pick(heroNames, rng)} has emerged from the ${faction.name}, rallying the people with daring deeds and bold leadership. Morale soars and recruitment accelerates.`,
            category: "social",
            icon: "⭐",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => f.name === faction.name ? { ...f, power: Math.min(100, f.power + 10), trend: "rising" } : f)
            })
          };
        }
      },
      {
        id: "mass_exodus",
        weight: 2,
        apply: (data, rng) => {
          const regions = data.regions.filter(r => r.state === "contested" || r.state === "dangerous" || r.threat === "critical");
          if (!regions.length) return null;
          const region = pick(regions, rng);
          return {
            headline: `Mass Exodus from ${region.name}`,
            detail: `Hundreds of families are fleeing ${region.name}, overwhelmed by war, disease, or disaster. The region's population dwindles and cities grow quiet.`,
            category: "social",
            icon: "⊙",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: r.state === "destroyed" ? "destroyed" : "depopulated" } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.max(0, f.power - 5) } : f)
            })
          };
        }
      },
      {
        id: "religious_schism",
        weight: 2,
        apply: (data, rng) => {
          const factions = data.factions.filter(f => f.power > 20);
          if (!factions.length) return null;
          const faction = pick(factions, rng);
          const faiths = ["the Old Gods", "the Sun Pantheon", "the Dark Deities", "the Ancestral Spirits", "the Primal Forces"];
          return {
            headline: `Religious Schism Tears Through ${faction.name}`,
            detail: `A bitter theological dispute over the worship of ${pick(faiths, rng)} has split the ${faction.name} into factions. Families are torn apart and violence brews.`,
            category: "social",
            icon: "⚜",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => f.name === faction.name ? { ...f, power: Math.max(0, f.power - 7), trend: "declining" } : f)
            })
          };
        }
      },
      {
        id: "legendary_birth",
        weight: 2,
        apply: (data, rng) => {
          const factions = data.factions.filter(f => f.power > 10);
          if (!factions.length) return null;
          const faction = pick(factions, rng);
          return {
            headline: `Prophesied Child Born in ${faction.name}`,
            detail: `An ancient prophecy has been fulfilled with the birth of a child spoken of in sacred texts. The newborn is believed to be destined for greatness, and the ${faction.name} morale reaches unprecedented heights.`,
            category: "social",
            icon: "◌",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => f.name === faction.name ? { ...f, power: Math.min(100, f.power + 5), trend: "rising" } : f)
            })
          };
        }
      },
      {
        id: "great_tournament",
        weight: 2,
        apply: (data, rng) => {
          const cities = data.cities.filter(c => c.name);
          if (!cities.length) return null;
          const city = pick(cities, rng);
          return {
            headline: `Great Tournament Held in ${city.name}`,
            detail: `Warriors from across the realm have gathered in ${city.name} for a legendary tournament. Champions compete for glory, treasure, and renown, drawing thousands of spectators and boosting the city's reputation.`,
            category: "social",
            icon: "◆",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === city.region ? { ...r, state: r.state === "stable" || r.state === "prosperous" ? r.state : "stable" } : r),
              factions: d.factions.map(f => f.name === city.faction ? { ...f, power: Math.min(100, f.power + 2) } : f)
            })
          };
        }
      },
      {
        id: "cultural_renaissance",
        weight: 2,
        apply: (data, rng) => {
          const regions = data.regions.filter(r => r.state !== "destroyed" && r.state !== "dangerous");
          if (!regions.length) return null;
          const region = pick(regions, rng);
          return {
            headline: `Cultural Renaissance Blooms in ${region.name}`,
            detail: `Art, music, and learning flourish in ${region.name} as patrons invest in culture and artists flock to the thriving region. Magnificent works are created and knowledge spreads far and wide.`,
            category: "social",
            icon: "⊛",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "prosperous" } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.min(100, f.power + 3) } : f)
            })
          };
        }
      },
    ],

    // ── ARCANE ──
    arcane: [
      {
        id: "magical_anomaly",
        weight: 3,
        apply: (data, rng) => {
          const regions = data.regions.filter(r => r.name);
          if (!regions.length) return null;
          const region = pick(regions, rng);
          const anomalies = [
            "A rift to the Feywild has opened, spilling strange creatures and wild magic into the countryside",
            "An ancient ley line has surged with power, causing random magical effects across the region",
            "The sky above the region has turned an eerie purple, and magic behaves unpredictably",
            "A massive arcane crystal has erupted from the ground, pulsing with unknown energy",
            "Portals of unknown origin flicker in and out of existence throughout the region",
            "All metal in the region has become temporarily magnetized, disrupting trade and warfare"
          ];
          return {
            headline: `Magical Anomaly in ${region.name}`,
            detail: `${pick(anomalies, rng)}. Scholars and adventurers alike rush to investigate.`,
            category: "arcane",
            icon: "✦",
            importance: "standard",
            mutations: (d) => d // No state mutation — flavor event for DM hooks
          };
        }
      },
      {
        id: "artifact_discovered",
        weight: 1,
        apply: (data, rng) => {
          const cities = data.cities.filter(c => c.name);
          if (!cities.length) return null;
          const city = pick(cities, rng);
          const artifacts = [
            "the Scepter of Eternal Dawn", "a Tome of Forgotten Gods", "the Orb of Dragonkind",
            "an ancient Warforged titan buried beneath the city", "a map to the Vault of Souls",
            "the Crown of the First King", "a portal key to an unknown plane"
          ];
          return {
            headline: `Artifact Discovered Near ${city.name}`,
            detail: `Miners near ${city.name} have unearthed ${pick(artifacts, rng)}. Multiple factions are sending agents to secure it.`,
            category: "arcane",
            icon: "◎",
            importance: "major",
            mutations: (d) => d
          };
        }
      },
      {
        id: "wild_magic_surge",
        weight: 2,
        apply: (data, rng) => {
          const regions = data.regions.filter(r => r.name);
          if (!regions.length) return null;
          const region = pick(regions, rng);
          const effects = [
            "turning livestock inside out", "aging people decades in moments", "transmuting stone to flesh",
            "causing temporary levitation", "opening portals to other worlds", "creating illusory duplicates"
          ];
          return {
            headline: `Wild Magic Surge in ${region.name}`,
            detail: `An unpredictable wave of raw magic has swept across ${region.name}, ${pick(effects, rng)}. Mages scramble to understand the phenomenon while civilians hide in fear.`,
            category: "arcane",
            icon: "⚡",
            importance: "standard",
            mutations: (d) => d // Flavor event — DM can decide consequences
          };
        }
      },
      {
        id: "ley_line_shift",
        weight: 2,
        apply: (data, rng) => {
          const regions = data.regions.filter(r => r.name);
          if (!regions.length) return null;
          const region = pick(regions, rng);
          const shifts = [
            "has strengthened, empowering local spellcasters",
            "has weakened, causing magical effects to fail",
            "has shifted direction, draining energy from settlements",
            "has converged at a single point, creating a magical maelstrom"
          ];
          return {
            headline: `Ley Line Shift in ${region.name}`,
            detail: `The arcane energies flowing through ${region.name} have shifted dramatically. The fundamental forces of magic in the region ${pick(shifts, rng)}.`,
            category: "arcane",
            icon: "✦",
            importance: "standard",
            mutations: (d) => d // Flavor event — DM to interpret magical effects
          };
        }
      },
      {
        id: "summoning_gone_wrong",
        weight: 2,
        apply: (data, rng) => {
          const cities = data.cities.filter(c => c.region);
          if (!cities.length) return null;
          const city = pick(cities, rng);
          const creatures = [
            "a demon of unfathomable hunger", "a celestial wrath-bringer", "a void creature from beyond reality",
            "an ancient dragon", "a lich of terrible power"
          ];
          return {
            headline: `Summoning Gone Wrong in ${city.name}`,
            detail: `A magical ritual in ${city.name} has catastrophically failed, summoning ${pick(creatures, rng)} instead of the intended entity. The creature rampages through the city, leaving destruction in its wake.`,
            category: "arcane",
            icon: "☠",
            importance: "major",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === city.region ? { ...r, threat: "critical", state: "contested" } : r)
            })
          };
        }
      },
      {
        id: "planar_convergence",
        weight: 2,
        apply: (data, rng) => {
          const regions = data.regions.filter(r => r.name);
          if (!regions.length) return null;
          const region = pick(regions, rng);
          return {
            headline: `Planar Convergence Detected in ${region.name}`,
            detail: `The barrier between the mortal plane and the realm of fey has grown dangerously thin in ${region.name}. Strange creatures and unearthly phenomena plague the region as the boundaries of reality blur.`,
            category: "arcane",
            icon: "⟲",
            importance: "major",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, threat: r.threat === "low" ? "medium" : "high" } : r)
            })
          };
        }
      },
      {
        id: "arcane_academy_founded",
        weight: 2,
        apply: (data, rng) => {
          const cities = data.cities.filter(c => c.region);
          if (!cities.length) return null;
          const city = pick(cities, rng);
          return {
            headline: `Arcane Academy Founded in ${city.name}`,
            detail: `A grand academy of magic has been established in ${city.name}, attracting scholars and mages from across the realm. The city becomes a beacon of knowledge and magical learning, elevating its prestige.`,
            category: "arcane",
            icon: "≡",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === city.region ? { ...r, state: r.state === "stable" || r.state === "prosperous" ? r.state : "stable" } : r),
              factions: d.factions.map(f => f.name === city.faction ? { ...f, power: Math.min(100, f.power + 3) } : f)
            })
          };
        }
      },
      {
        id: "prophecy_fulfilled",
        weight: 1,
        apply: (data, rng) => {
          if (data.factions.length === 0) return null;
          const faction = pick(data.factions, rng);
          return {
            headline: `Ancient Prophecy Fulfilled: Major Shift for ${faction.name}`,
            detail: `An ancient prophecy recorded in sacred texts for centuries has finally come to pass. The ${faction.name} experiences a seismic shift in their fortunes as fate itself seems to reshape the balance of power.`,
            category: "arcane",
            icon: "◎",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === faction.name) {
                  return { ...f, power: Math.min(100, f.power + 8), trend: "rising" };
                }
                return f;
              })
            })
          };
        }
      },
    ],

    // ── NATURAL ──
    natural: [
      {
        id: "natural_disaster",
        weight: 2,
        apply: (data, rng) => {
          const regions = data.regions.filter(r => r.name);
          if (!regions.length) return null;
          const region = pick(regions, rng);
          const disasters = [
            { type: "earthquake", text: `A powerful earthquake has shaken ${region.name}, toppling buildings and opening fissures in the earth` },
            { type: "storm", text: `A devastating storm of unnatural fury has ravaged ${region.name}, flooding rivers and destroying crops` },
            { type: "wildfire", text: `Wildfires sweep across ${region.name}, driving wildlife into settlements and choking the skies with smoke` },
            { type: "drought", text: `A prolonged drought has dried up wells and rivers in ${region.name}, threatening the survival of entire communities` },
          ];
          const d = pick(disasters, rng);
          return {
            headline: `${d.type.charAt(0).toUpperCase() + d.type.slice(1)} Devastates ${region.name}`,
            detail: `${d.text}. Recovery will take months, and aid is desperately needed.`,
            category: "natural",
            icon: "⟲",
            importance: "standard",
            mutations: (data) => ({
              ...data,
              regions: data.regions.map(r => r.name === region.name ? { ...r, state: "rebuilding", threat: r.threat === "low" ? "medium" : r.threat } : r)
            })
          };
        }
      },
      {
        id: "monster_migration",
        weight: 3,
        apply: (data, rng) => {
          const regions = data.regions.filter(r => r.name);
          if (!regions.length) return null;
          const region = pick(regions, rng);
          const monsters = [
            "a flight of wyverns", "a pack of dire wolves", "wandering hill giants",
            "a swarm of ankhegs", "displaced trolls", "roaming owlbears",
            "migrating bulettes", "a pride of displacer beasts"
          ];
          return {
            headline: `${pick(monsters, rng).split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} Spotted Near ${region.name}`,
            detail: `Scouts report dangerous creatures moving through ${region.name}. Travelers are warned and bounties have been posted.`,
            category: "natural",
            icon: "⊛",
            importance: "minor",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, threat: r.threat === "low" ? "medium" : "high" } : r)
            })
          };
        }
      },
      {
        id: "bountiful_spring",
        weight: 2,
        apply: (data, rng) => {
          const damaged = data.regions.filter(r => r.state === "rebuilding" || r.state === "dangerous");
          if (!damaged.length) return null;
          const region = pick(damaged, rng);
          return {
            headline: `Bountiful Spring Returns to ${region.name}`,
            detail: `After seasons of hardship, the land of ${region.name} begins to recover. Abundant rains and warm weather restore life to the region. Crops flourish and hope returns to the people.`,
            category: "natural",
            icon: "❦",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "stable", threat: r.threat === "high" ? "medium" : r.threat } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.min(100, f.power + 3) } : f)
            })
          };
        }
      },
      {
        id: "volcanic_eruption",
        weight: 1,
        apply: (data, rng) => {
          const regions = data.regions.filter(r => r.state !== "destroyed");
          if (!regions.length) return null;
          const region = pick(regions, rng);
          return {
            headline: `Volcanic Eruption Devastates ${region.name}`,
            detail: `A dormant volcano has awakened with catastrophic fury, unleashing lava, ash, and destruction across ${region.name}. The region is engulfed in flames and toxic smoke, rendering it uninhabitable.`,
            category: "natural",
            icon: "▲",
            importance: "major",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, state: "destroyed", threat: "critical" } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.max(0, f.power - 10) } : f)
            })
          };
        }
      },
      {
        id: "great_migration",
        weight: 2,
        apply: (data, rng) => {
          const regions = data.regions.filter(r => r.ctrl);
          if (!regions.length) return null;
          const region = pick(regions, rng);
          const animals = ["herds of stampeding elk", "massive caribou migrations", "floods of locusts", "waves of migratory birds", "packs of predators following prey"];
          return {
            headline: `Great Migration Disrupts ${region.name}`,
            detail: `A massive movement of wild animals has swept through ${region.name}. ${pick(animals, rng)} block roads, trample crops, and disrupt normal trade and travel.`,
            category: "natural",
            icon: "⊛",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === region.name ? { ...r, threat: r.threat === "low" ? "medium" : "high" } : r),
              factions: d.factions.map(f => f.name === region.ctrl ? { ...f, power: Math.max(0, f.power - 2) } : f)
            })
          };
        }
      },
    ],
  };

  // ── Name generator for replacement rulers ──
  const LW_FIRST_M = ["Aldric","Beren","Caelum","Darius","Edmund","Fenris","Gareth","Hadrian","Iden","Jareth","Kael","Lucan","Magnus","Nolan","Orin","Percival","Rhys","Seren","Theron","Varis"];
  const LW_FIRST_F = ["Aria","Brielle","Cassara","Delia","Elara","Freya","Gwendolyn","Helena","Iris","Jocelyn","Kira","Lyra","Mira","Nyx","Ophelia","Petra","Quinn","Rowena","Seraphina","Thalia"];
  const LW_LAST = ["Ashford","Blackthorn","Coldwell","Darkwood","Emberstone","Fairwind","Greycloak","Hawkridge","Ironforge","Kingsley","Loreweaver","Mournblade","Nighthollow","Oakenshield","Proudmane","Ravencrest","Stormwalker","Thornwall","Valorheart","Windermere"];

  function generateReplacementName(rng) {
    const first = rng() > 0.5 ? pick(LW_FIRST_F, rng) : pick(LW_FIRST_M, rng);
    return first + " " + pick(LW_LAST, rng);
  }


  // ═══════════════════════════════════════════════════════════════════
  // LIVING WORLD CONTROLLER
  // ═══════════════════════════════════════════════════════════════════

  class LivingWorldEngine {
    constructor() {
      this.active = false;
      this.intervalId = null;
      this.eventLog = [];         // All generated events this session
      this.pendingEvents = [];    // Events waiting to be shown
      this.tickCount = 0;
      this.seed = Date.now();
      this.rng = lwRng(this.seed);
      this.onEvent = null;        // Callback: (event) => void
      this.onStateUpdate = null;  // Callback: (mutator) => void
      this.intervalMs = 90000;    // Default: 90 seconds between events
      this.relations = new FactionRelations();
      this.categoryWeights = {
        political: 4,
        military: 3,
        economic: 2,
        social: 3,
        arcane: 2,
        natural: 2,
      };
    }

    start(data, options = {}) {
      if (this.active) return;
      this.active = true;
      this.seed = options.seed || Date.now();
      this.rng = lwRng(this.seed);
      this.intervalMs = options.intervalMs || 90000;
      if (options.categoryWeights) this.categoryWeights = { ...this.categoryWeights, ...options.categoryWeights };
      this.eventLog = [];
      this.pendingEvents = [];
      this.tickCount = 0;

      // Initialize relations from faction data
      this.relations = new FactionRelations();
      if (data?.factions) {
        for (const f of data.factions) {
          if (f.allies) {
            for (const allyName of f.allies) {
              this.relations.modifyRelation(f.name, allyName, 50);
            }
          }
          if (f.rivals) {
            for (const rivalName of f.rivals) {
              this.relations.modifyRelation(f.name, rivalName, -50);
            }
          }
        }
      }

      // Generate first event quickly (10-20 seconds in)
      const firstDelay = 10000 + Math.floor(this.rng() * 10000);
      this._firstTimeout = setTimeout(() => {
        this._tick(data);
        // Then start regular interval
        this.intervalId = setInterval(() => this._tick(data), this.intervalMs);
      }, firstDelay);
    }

    stop() {
      this.active = false;
      if (this._firstTimeout) clearTimeout(this._firstTimeout);
      if (this.intervalId) clearInterval(this.intervalId);
      this.intervalId = null;
      this._firstTimeout = null;
    }

    setData(data) {
      // Update the engine's reference to current world data
      this._currentData = data;
    }

    _tick(data) {
      if (!this.active) return;
      // Use latest data if available
      const currentData = this._currentData || data;
      if (!currentData?.factions?.length || !currentData?.regions?.length) return;

      this.tickCount++;

      // Pick a category based on weights (with context-aware weighting)
      let categories = Object.entries(this.categoryWeights).map(([cat, weight]) => ({
        item: cat, weight
      }));

      // Adjust weights based on world state
      const hasActiveWars = Object.keys(this.relations.activeWars).length > 0;
      const averageRelation = Object.values(this.relations.relationScores).reduce((a, b) => a + b, 0) / Math.max(1, Object.keys(this.relations.relationScores).length);

      if (hasActiveWars) {
        categories = categories.map(c => ({ ...c, weight: c.item === "military" ? c.weight * 2 : c.weight }));
      }
      if (averageRelation < -20) {
        categories = categories.map(c => ({ ...c, weight: c.item === "political" ? c.weight * 1.5 : c.weight }));
      }
      if (averageRelation > 30) {
        categories = categories.map(c => ({ ...c, weight: c.item === "economic" ? c.weight * 1.5 : c.weight }));
      }

      const category = weightedPick(categories, this.rng);

      // Try templates in that category
      const templates = EVENT_TEMPLATES[category];
      if (!templates?.length) return;

      // Shuffle templates for variety
      const shuffled = [...templates].sort(() => this.rng() - 0.5);

      for (const template of shuffled) {
        const event = template.apply(currentData, this.rng, this.relations);
        if (event) {
          // Don't repeat the same event type too soon
          const recentTypes = this.eventLog.slice(-4).map(e => e.id || e.category);
          if (recentTypes.includes(template.id)) continue;

          event.id = template.id;
          event.timestamp = Date.now();
          event.tickNumber = this.tickCount;

          this.eventLog.push(event);
          this.pendingEvents.push(event);

          // Apply relation mutations
          if (event.relationMutation) {
            event.relationMutation(this.relations);
          }

          // Notify subscribers
          if (this.onEvent) this.onEvent(event);
          if (this.onStateUpdate && event.mutations) {
            this.onStateUpdate(event.mutations);
          }
          return; // One event per tick
        }
      }
    }

    // Get and clear pending events (for UI consumption)
    consumeEvents() {
      const events = [...this.pendingEvents];
      this.pendingEvents = [];
      return events;
    }

    getEventLog() {
      return [...this.eventLog];
    }

    getStats() {
      return {
        active: this.active,
        totalEvents: this.eventLog.length,
        pendingEvents: this.pendingEvents.length,
        tickCount: this.tickCount,
        intervalMs: this.intervalMs,
      };
    }

    // Advance time by N ticks, generating events synchronously
    // Returns { events: [...], finalData: {...} }
    advanceTime(data, ticks) {
      if (!data?.factions?.length || !data?.regions?.length) {
        return { events: [], finalData: data };
      }

      // Ensure relations are initialized from faction data
      if (!this.relations || Object.keys(this.relations.relationScores || {}).length === 0) {
        this.relations = new FactionRelations();
        if (data?.factions) {
          for (const f of data.factions) {
            if (f.allies) {
              for (const allyName of f.allies) {
                this.relations.modifyRelation(f.name, allyName, 50);
              }
            }
            if (f.rivals) {
              for (const rivalName of f.rivals) {
                this.relations.modifyRelation(f.name, rivalName, -50);
              }
            }
          }
        }
      }

      const events = [];
      let currentData = JSON.parse(JSON.stringify(data)); // Deep clone to avoid mutations

      for (let i = 0; i < ticks; i++) {
        this.tickCount++;

        // Pick a category based on weights (with context-aware weighting)
        let categories = Object.entries(this.categoryWeights).map(([cat, weight]) => ({
          item: cat, weight
        }));

        // Adjust weights based on world state
        const hasActiveWars = Object.keys(this.relations.activeWars).length > 0;
        const averageRelation = Object.values(this.relations.relationScores).reduce((a, b) => a + b, 0) / Math.max(1, Object.keys(this.relations.relationScores).length);

        if (hasActiveWars) {
          categories = categories.map(c => ({ ...c, weight: c.item === "military" ? c.weight * 2 : c.weight }));
        }
        if (averageRelation < -20) {
          categories = categories.map(c => ({ ...c, weight: c.item === "political" ? c.weight * 1.5 : c.weight }));
        }
        if (averageRelation > 30) {
          categories = categories.map(c => ({ ...c, weight: c.item === "economic" ? c.weight * 1.5 : c.weight }));
        }

        const category = weightedPick(categories, this.rng);

        // Try templates in that category
        const templates = EVENT_TEMPLATES[category];
        if (!templates?.length) continue;

        // Shuffle templates for variety
        const shuffled = [...templates].sort(() => this.rng() - 0.5);

        for (const template of shuffled) {
          const event = template.apply(currentData, this.rng, this.relations);
          if (event) {
            // Don't repeat the same event type too soon
            const recentTypes = events.slice(-4).map(e => e.id || e.category);
            if (recentTypes.includes(template.id)) continue;

            event.id = template.id;
            event.timestamp = Date.now();
            event.tickNumber = this.tickCount;

            events.push(event);
            this.eventLog.push(event);

            // Apply relation mutations
            if (event.relationMutation) {
              event.relationMutation(this.relations);
            }

            // Apply mutations to our working copy
            if (event.mutations) {
              currentData = event.mutations(currentData) || currentData;
            }
            break; // One event per tick
          }
        }
      }

      return { events, finalData: currentData };
    }

    /**
     * Player/Party Actions — manually trigger specific events targeting chosen factions/regions.
     * Returns an event object if successful, or null if the action couldn't be applied.
     * @param {string} actionId - one of the PLAYER_ACTIONS keys
     * @param {object} data - current campaign data
     * @param {object} params - { targetFaction, targetRegion, allyFaction, etc. }
     */
    triggerPlayerAction(actionId, data, params = {}) {
      const action = PLAYER_ACTIONS[actionId];
      if (!action) return null;
      const rng = this.rng || Math.random;
      const event = action.apply(data, rng, this.relations, params);
      if (!event) return null;
      event.tickNumber = ++this.tickCount;
      event.timestamp = Date.now();
      event._playerAction = true; // Mark as player-triggered
      this.eventLog.push(event);
      this.pendingEvents.push(event);
      if (this.onEvent) this.onEvent(event);
      if (this.onStateUpdate && event.mutations) this.onStateUpdate(event.mutations);
      if (event.relationMutation && this.relations) event.relationMutation(this.relations);
      return event;
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // PLAYER ACTIONS — Events the party can trigger directly
  // ═══════════════════════════════════════════════════════════════════

  const PLAYER_ACTIONS = {
    assassinate_leader: {
      id: "assassinate_leader",
      label: "Assassinate Leader",
      icon: "†",
      description: "Send assassins to eliminate a faction's ruler, destabilizing their power structure.",
      requiresTarget: "faction",
      apply: (data, rng, relations, { targetFaction }) => {
        const faction = data.factions.find(f => f.name === targetFaction);
        if (!faction || !faction.hierarchy?.length) return null;
        const ruler = faction.hierarchy.find(h => h.role === "ruler");
        if (!ruler) return null;
        const heir = faction.hierarchy.find(h => h.role === "heir");
        // Success chance based on faction power (harder to kill powerful leaders)
        const successChance = Math.max(0.3, 0.8 - faction.power / 200);
        const success = rng() < successChance;
        if (!success) {
          return {
            headline: `Assassination Attempt on ${ruler.name} Fails!`,
            detail: `An assassination attempt against ${ruler.name} of the ${faction.name} has been foiled. The would-be assassins were captured, and the faction is now on high alert. Security has been doubled and all outsiders are viewed with suspicion.`,
            category: "political",
            icon: "⛨",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => f.name === faction.name ? { ...f, power: Math.min(100, f.power + 5) } : f),
              regions: d.regions.map(r => r.ctrl === faction.name ? { ...r, threat: "high" } : r),
            }),
          };
        }
        return {
          headline: `${ruler.name} of ${faction.name} Assassinated by the Party!`,
          detail: `Through cunning and deadly precision, agents have struck down ${ruler.name}, ${ruler.title} of the ${faction.name}. The faction is thrown into disarray as ${heir ? heir.name + " attempts to seize the reins of power" : "a power vacuum tears the leadership apart"}. The realm trembles at the audacity of the act.`,
          category: "political",
          icon: "†",
          importance: "critical",
          mutations: (d) => ({
            ...d,
            factions: d.factions.map(f => {
              if (f.name !== faction.name) return f;
              const newHierarchy = f.hierarchy.map(h => {
                if (h.role === "ruler" && heir) return { ...h, name: heir.name };
                if (h.role === "heir") return { ...h, name: generateReplacementName(rng) };
                return h;
              });
              return { ...f, hierarchy: newHierarchy, power: Math.max(0, f.power - 25), trend: "declining" };
            }),
            npcs: d.npcs.map(n => n.name === ruler.name ? { ...n, alive: false } : n),
            regions: d.regions.map(r => r.ctrl === faction.name ? { ...r, state: "tense", threat: r.threat === "low" ? "medium" : "high" } : r),
          }),
        };
      }
    },

    incite_rebellion: {
      id: "incite_rebellion",
      label: "Incite Rebellion",
      icon: "⟡",
      description: "Stir up unrest in a faction's territory, weakening their hold on the populace.",
      requiresTarget: "faction",
      apply: (data, rng, relations, { targetFaction }) => {
        const faction = data.factions.find(f => f.name === targetFaction);
        if (!faction) return null;
        const regions = data.regions.filter(r => r.ctrl === faction.name && r.state !== "destroyed");
        if (!regions.length) return null;
        const targetRegion = pick(regions, rng);
        const success = rng() < 0.65;
        if (!success) {
          return {
            headline: `Rebellion Crushed in ${targetRegion.name}`,
            detail: `An attempted uprising in ${targetRegion.name} was swiftly put down by ${faction.name} forces. The instigators were captured, and martial law has been declared throughout the region.`,
            category: "social",
            icon: "⛓",
            importance: "standard",
            mutations: (d) => ({
              ...d,
              regions: d.regions.map(r => r.name === targetRegion.name ? { ...r, threat: "high" } : r),
            }),
          };
        }
        return {
          headline: `Rebellion Erupts in ${targetRegion.name}!`,
          detail: `The people of ${targetRegion.name} have risen up against the ${faction.name}! Barricades block the streets, the garrison is overwhelmed, and the local governor has fled. The region is now in open revolt and contested territory.`,
          category: "social",
          icon: "⟡",
          importance: "major",
          mutations: (d) => ({
            ...d,
            regions: d.regions.map(r => r.name === targetRegion.name ? { ...r, state: "contested", threat: "critical" } : r),
            factions: d.factions.map(f => f.name === faction.name ? { ...f, power: Math.max(0, f.power - 10), trend: "declining" } : f),
          }),
        };
      }
    },

    forge_alliance: {
      id: "forge_alliance",
      label: "Forge Alliance",
      icon: "⚖",
      description: "Broker a new alliance between two factions through diplomacy.",
      requiresTarget: "two_factions",
      apply: (data, rng, relations, { targetFaction, allyFaction }) => {
        const f1 = data.factions.find(f => f.name === targetFaction);
        const f2 = data.factions.find(f => f.name === allyFaction);
        if (!f1 || !f2 || f1.name === f2.name) return null;
        if (relations && relations.isAtWar(f1.name, f2.name)) {
          return {
            headline: `Peace Brokered Between ${f1.name} and ${f2.name}`,
            detail: `Through extraordinary diplomatic effort, a ceasefire has been negotiated between the warring ${f1.name} and ${f2.name}. Hostilities cease immediately, and prisoners are exchanged. The road to lasting peace remains uncertain, but the bloodshed has stopped.`,
            category: "political",
            icon: "⊕",
            importance: "major",
            mutations: (d) => ({
              ...d,
              factions: d.factions.map(f => {
                if (f.name === f1.name) return { ...f, rivals: (f.rivals || []).filter(r => r !== f2.name) };
                if (f.name === f2.name) return { ...f, rivals: (f.rivals || []).filter(r => r !== f1.name) };
                return f;
              }),
            }),
            relationMutation: (rel) => { rel.endWar(f1.name, f2.name); rel.modifyRelation(f1.name, f2.name, 20); },
          };
        }
        return {
          headline: `Alliance Forged: ${f1.name} and ${f2.name}`,
          detail: `A historic alliance has been established between the ${f1.name} and the ${f2.name}. The pact promises mutual defense, shared intelligence, and open borders. Other factions watch the new power bloc with a mixture of hope and apprehension.`,
          category: "political",
          icon: "⚖",
          importance: "major",
          mutations: (d) => ({
            ...d,
            factions: d.factions.map(f => {
              if (f.name === f1.name) return { ...f, allies: [...new Set([...(f.allies || []), f2.name])], rivals: (f.rivals || []).filter(r => r !== f2.name) };
              if (f.name === f2.name) return { ...f, allies: [...new Set([...(f.allies || []), f1.name])], rivals: (f.rivals || []).filter(r => r !== f1.name) };
              return f;
            }),
          }),
          relationMutation: (rel) => { rel.modifyRelation(f1.name, f2.name, 30); rel.addTreaty(f1.name, f2.name, "alliance"); },
        };
      }
    },

    sabotage_supply_lines: {
      id: "sabotage_supply_lines",
      label: "Sabotage Supplies",
      icon: "⊛",
      description: "Disrupt a faction's supply lines, weakening their military and economy.",
      requiresTarget: "faction",
      apply: (data, rng, relations, { targetFaction }) => {
        const faction = data.factions.find(f => f.name === targetFaction);
        if (!faction) return null;
        return {
          headline: `Supply Lines of ${faction.name} Sabotaged!`,
          detail: `Critical supply routes serving the ${faction.name} have been disrupted. Warehouses burn, bridges collapse, and caravans are ambushed. The faction's military operations are severely hampered, and food prices in their territories have skyrocketed.`,
          category: "military",
          icon: "⊛",
          importance: "major",
          mutations: (d) => ({
            ...d,
            factions: d.factions.map(f => f.name === faction.name ? { ...f, power: Math.max(0, f.power - 15), trend: "declining" } : f),
            regions: d.regions.map(r => r.ctrl === faction.name ? { ...r, threat: r.threat === "low" ? "medium" : r.threat } : r),
          }),
        };
      }
    },

    spread_propaganda: {
      id: "spread_propaganda",
      label: "Spread Propaganda",
      icon: "⸎",
      description: "Spread rumors and propaganda to damage a faction's reputation and sow discord.",
      requiresTarget: "faction",
      apply: (data, rng, relations, { targetFaction }) => {
        const faction = data.factions.find(f => f.name === targetFaction);
        if (!faction) return null;
        const propagandaTypes = [
          `Pamphlets accusing ${faction.name} leadership of corruption have flooded the marketplaces`,
          `Traveling bards are singing songs mocking the ${faction.name}'s recent military failures`,
          `Forged documents suggesting ${faction.name} betrayed its own allies have been leaked to rival courts`,
          `Rumors that the ${faction.name}'s treasury is empty have caused merchants to demand payment upfront`
        ];
        return {
          headline: `Propaganda Campaign Against ${faction.name}`,
          detail: `${pick(propagandaTypes, rng)}. Public confidence in the faction has plummeted, and even loyal subjects whisper doubts. The ${faction.name}'s diplomatic standing has been severely damaged.`,
          category: "social",
          icon: "⸎",
          importance: "standard",
          mutations: (d) => ({
            ...d,
            factions: d.factions.map(f => f.name === faction.name ? { ...f, power: Math.max(0, f.power - 8) } : f),
          }),
          relationMutation: (rel) => {
            // Worsen relations with everyone
            data.factions.forEach(f => {
              if (f.name !== faction.name) rel.modifyRelation(f.name, faction.name, -5);
            });
          },
        };
      }
    },

    declare_war: {
      id: "declare_war",
      label: "Declare War",
      icon: "⚔",
      description: "Provoke open warfare between two factions.",
      requiresTarget: "two_factions",
      apply: (data, rng, relations, { targetFaction, allyFaction }) => {
        const aggressor = data.factions.find(f => f.name === targetFaction);
        const defender = data.factions.find(f => f.name === allyFaction);
        if (!aggressor || !defender || aggressor.name === defender.name) return null;
        if (relations && relations.isAtWar(aggressor.name, defender.name)) return null;
        return {
          headline: `War Declared: ${aggressor.name} vs ${defender.name}!`,
          detail: `Through careful manipulation and provocation, open war has erupted between the ${aggressor.name} and the ${defender.name}. Armies mobilize, borders are fortified, and the drums of war echo across the land. Civilians flee the border regions as the first skirmishes begin.`,
          category: "military",
          icon: "⚔",
          importance: "critical",
          mutations: (d) => ({
            ...d,
            factions: d.factions.map(f => {
              if (f.name === aggressor.name) return { ...f, rivals: [...new Set([...(f.rivals || []), defender.name])], allies: (f.allies || []).filter(a => a !== defender.name) };
              if (f.name === defender.name) return { ...f, rivals: [...new Set([...(f.rivals || []), aggressor.name])], allies: (f.allies || []).filter(a => a !== aggressor.name) };
              return f;
            }),
          }),
          relationMutation: (rel) => { rel.declareWar(aggressor.name, defender.name); },
        };
      }
    },
  };

  // Expose PLAYER_ACTIONS for UI
  window.PLAYER_ACTIONS = PLAYER_ACTIONS;

  // ═══════════════════════════════════════════════════════════════════
  // EXPORT — Global singleton
  // ═══════════════════════════════════════════════════════════════════

  window.LivingWorldEngine = LivingWorldEngine;
  window.livingWorld = new LivingWorldEngine();

})();
