// ═══════════════════════════════════════════════════════════════════════════
// CAMPAIGN RELATIONSHIP WEB – Party-Centric Relationship Tracker
// Tracks the party's alliances, rivalries, reputation, and standing with
// every faction, kingdom, and individual in the campaign world.
// ═══════════════════════════════════════════════════════════════════════════

window.RelationshipWebView = function RelationshipWebView({ data, setData, viewRole }) {
  const [viewMode, setViewMode] = React.useState("standing"); // "standing" | "allies" | "enemies" | "npcs"
  const [selectedEntity, setSelectedEntity] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const isDM = viewRole === "dm";

  const T = {
    bg: "var(--bg)", bgNav: "var(--bg-nav)", bgCard: "var(--bg-card)",
    bgHover: "var(--bg-hover)", bgInput: "var(--bg-input)",
    text: "var(--text)", textDim: "var(--text-dim)", textMuted: "var(--text-muted)", textFaint: "var(--text-faint)",
    crimson: "var(--crimson)", crimsonDim: "var(--crimson-dim)", crimsonBorder: "var(--crimson-border)", crimsonSoft: "var(--crimson-soft)",
    border: "var(--border)", borderMid: "var(--border-mid)",
    gold: "var(--gold)", goldDim: "var(--gold-dim)", green: "var(--green)", greenDim: "var(--green-dim)",
    orange: "var(--orange)", orangeDim: "var(--orange-dim)", questGold: "var(--quest-gold)",
    heading: "'Cinzel', serif", body: "'Spectral', serif", ui: "'Cinzel', serif"
  };

  // ─────────────────────────────────────────────────────────────────────
  // DATA
  // ─────────────────────────────────────────────────────────────────────
  const factions = React.useMemo(() => (data.factions || []), [data.factions]);
  const npcs = React.useMemo(() => (data.npcs || []), [data.npcs]);
  const party = React.useMemo(() => (data.party || []), [data.party]);
  const partyRep = React.useMemo(() => (data.partyReputation || {}), [data.partyReputation]);

  const factionByName = React.useMemo(() => {
    const m = {};
    factions.forEach(f => { m[f.name] = f; });
    return m;
  }, [factions]);

  // Compute party standing with each faction based on attitude field
  const factionStandings = React.useMemo(() => {
    return factions.map(f => {
      const rep = partyRep[f.name] || {};
      const attitude = f.attitude || "neutral";
      const score = rep.score != null ? rep.score :
        attitude === "allied" ? 80 : attitude === "friendly" ? 60 :
        attitude === "neutral" ? 40 : attitude === "hostile" ? 10 :
        attitude === "at war" ? 0 : 40;
      const tier = score >= 80 ? "Allied" : score >= 60 ? "Friendly" : score >= 40 ? "Neutral" : score >= 20 ? "Unfriendly" : "Hostile";
      const tierColor = score >= 80 ? T.green : score >= 60 ? "#6ecf8a" : score >= 40 ? T.textMuted : score >= 20 ? T.orange : T.crimson;
      return { ...f, score, tier, tierColor, rep, isAlly: score >= 60, isEnemy: score < 30 };
    }).sort((a, b) => b.score - a.score);
  }, [factions, partyRep]);

  // NPC dispositions toward the party
  const npcStandings = React.useMemo(() => {
    return npcs.map(n => {
      const rep = partyRep[n.name] || {};
      const att = n.attitude || "neutral";
      const score = rep.score != null ? rep.score :
        att === "allied" || att === "friendly" ? 70 : att === "neutral" ? 50 : att === "hostile" ? 15 : 50;
      const tier = score >= 80 ? "Loyal" : score >= 60 ? "Friendly" : score >= 40 ? "Neutral" : score >= 20 ? "Unfriendly" : "Hostile";
      const tierColor = score >= 80 ? T.green : score >= 60 ? "#6ecf8a" : score >= 40 ? T.textMuted : score >= 20 ? T.orange : T.crimson;
      const fac = factionByName[n.faction];
      return { ...n, score, tier, tierColor, factionColor: fac?.color || T.textFaint, isAlly: score >= 60, isEnemy: score < 30 };
    }).sort((a, b) => b.score - a.score);
  }, [npcs, partyRep, factionByName]);

  const allies = factionStandings.filter(f => f.isAlly);
  const enemies = factionStandings.filter(f => f.isEnemy);
  const allyNPCs = npcStandings.filter(n => n.isAlly);
  const enemyNPCs = npcStandings.filter(n => n.isEnemy);

  const matchesSearch = (name) => !searchTerm.trim() || name.toLowerCase().includes(searchTerm.toLowerCase());

  // DM: Update reputation score
  const updateRep = (entityName, newScore) => {
    if (viewRole !== "dm") return; // SECURITY: only DM can adjust reputation
    setData(d => ({
      ...d,
      partyReputation: { ...(d.partyReputation || {}), [entityName]: { ...(d.partyReputation || {})[entityName], score: Math.max(0, Math.min(100, newScore)) } }
    }));
  };

  // ─────────────────────────────────────────────────────────────────────
  // SHARED UI
  // ─────────────────────────────────────────────────────────────────────
  const SectionLabel = ({ children, count }) => React.createElement("div", {
    style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }
  },
    React.createElement("div", { style: { fontSize: 10, color: T.gold, fontFamily: T.ui, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase" } }, children),
    count != null && React.createElement("span", { style: { fontSize: 9, color: T.textFaint, fontFamily: T.ui } }, "(" + count + ")")
  );

  const RepBar = ({ score, color, showLabel }) => {
    return React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
      React.createElement("div", { style: { flex: 1, height: 6, background: "rgba(0,0,0,0.25)", borderRadius: 3, overflow: "hidden", position: "relative" } },
        React.createElement("div", { style: { position: "absolute", left: 0, top: 0, height: "100%", width: score + "%", background: color, borderRadius: 3, transition: "width 0.4s ease" } }),
        // Tick marks at 20, 40, 60, 80
        [20, 40, 60, 80].map(t => React.createElement("div", { key: t, style: { position: "absolute", left: t + "%", top: 0, width: 1, height: "100%", background: "rgba(255,255,255,0.08)" } }))
      ),
      React.createElement("span", { style: { fontSize: 11, color: color, fontFamily: T.ui, minWidth: 26, textAlign: "right", fontWeight: 500 } }, score)
    );
  };

  const TierBadge = ({ tier, color }) => React.createElement("span", {
    style: {
      fontSize: 9, fontFamily: T.ui, letterSpacing: "0.5px", padding: "2px 8px",
      borderRadius: 2, color: color, background: color + "15", border: `1px solid ${color}30`
    }
  }, tier);

  // ─────────────────────────────────────────────────────────────────────
  // STANDING TAB — Full overview of party's political standing
  // ─────────────────────────────────────────────────────────────────────
  const renderStanding = () => {
    const filtered = factionStandings.filter(f => matchesSearch(f.name));
    const majorFiltered = filtered.filter(f => !f.isSubFaction);
    const orgFiltered = filtered.filter(f => f.isSubFaction);

    return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 24 } },

      // Summary banner
      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 } },
        [
          { label: "Allies", value: allies.length, color: T.green },
          { label: "Friendly", value: factionStandings.filter(f => f.score >= 40 && f.score < 60).length, color: T.textMuted },
          { label: "Enemies", value: enemies.length, color: T.crimson },
          { label: "NPC Contacts", value: allyNPCs.length, color: T.gold }
        ].map(s => React.createElement("div", {
          key: s.label,
          style: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4, padding: "16px 20px", textAlign: "center" }
        },
          React.createElement("div", { style: { fontSize: 28, color: s.color, fontFamily: T.ui, fontWeight: 300, lineHeight: 1 } }, s.value),
          React.createElement("div", { style: { fontSize: 9, color: T.textFaint, fontFamily: T.ui, letterSpacing: "1px", textTransform: "uppercase", marginTop: 6 } }, s.label)
        ))
      ),

      // Kingdom / Major Faction standings
      React.createElement("div", { style: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px 24px" } },
        React.createElement(SectionLabel, { count: majorFiltered.length }, "Kingdom & Faction Standing"),
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 2 } },
          majorFiltered.map((f, i) => {
            const isExpanded = selectedEntity === f.name;
            return React.createElement("div", { key: f.id },
              React.createElement("div", {
                onClick: () => setSelectedEntity(isExpanded ? null : f.name),
                style: {
                  display: "grid", gridTemplateColumns: "14px 1fr 70px 160px 24px", alignItems: "center", gap: 14,
                  padding: "12px 16px", borderRadius: 3, cursor: "pointer",
                  background: isExpanded ? "rgba(212,67,58,0.04)" : i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.06)",
                  borderLeft: `3px solid ${f.color || T.gold}`,
                  transition: "background 0.15s"
                }
              },
                React.createElement("div", { style: { width: 10, height: 10, borderRadius: "50%", background: f.color || T.gold } }),
                React.createElement("div", null,
                  React.createElement("div", { style: { fontSize: 13, color: T.text, fontWeight: 400 } }, f.name),
                  React.createElement("div", { style: { fontSize: 10, color: T.textFaint, marginTop: 2 } }, f.govType || "Unknown")
                ),
                React.createElement(TierBadge, { tier: f.tier, color: f.tierColor }),
                React.createElement(RepBar, { score: f.score, color: f.tierColor }),
                React.createElement("span", { style: { fontSize: 12, color: T.textFaint, transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "none" } }, "›")
              ),
              // Expanded detail
              isExpanded && React.createElement("div", { style: { padding: "12px 20px 16px 36px", borderBottom: `1px solid ${T.border}` } },
                f.desc && React.createElement("div", { style: { fontSize: 11, color: T.textMuted, lineHeight: 1.6, fontStyle: "italic", marginBottom: 12, maxWidth: 640 } }, f.desc),
                React.createElement("div", { style: { display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 12 } },
                  React.createElement("div", null,
                    React.createElement("div", { style: { fontSize: 8, color: T.textFaint, fontFamily: T.ui, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 } }, "Power"),
                    React.createElement("div", { style: { fontSize: 13, color: T.gold } }, f.power || "—")
                  ),
                  React.createElement("div", null,
                    React.createElement("div", { style: { fontSize: 8, color: T.textFaint, fontFamily: T.ui, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 } }, "Trend"),
                    React.createElement("div", { style: { fontSize: 13, color: f.trend === "rising" ? T.green : f.trend === "declining" ? T.crimson : T.textMuted } },
                      f.trend === "rising" ? "▲ Rising" : f.trend === "declining" ? "▼ Declining" : "— Stable"
                    )
                  ),
                  f.allies && f.allies.length > 0 && React.createElement("div", null,
                    React.createElement("div", { style: { fontSize: 8, color: T.textFaint, fontFamily: T.ui, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 } }, "Allied With"),
                    React.createElement("div", { style: { fontSize: 11, color: T.allyGreen } }, f.allies.join(", "))
                  ),
                  f.rivals && f.rivals.length > 0 && React.createElement("div", null,
                    React.createElement("div", { style: { fontSize: 8, color: T.textFaint, fontFamily: T.ui, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 } }, "Rivals"),
                    React.createElement("div", { style: { fontSize: 11, color: T.rivalRed } }, f.rivals.join(", "))
                  )
                ),
                // DM rep adjuster
                isDM && React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginTop: 8, paddingTop: 10, borderTop: `1px solid ${T.border}` } },
                  React.createElement("span", { style: { fontSize: 9, color: T.textFaint, fontFamily: T.ui, letterSpacing: "1px", textTransform: "uppercase" } }, "Adjust Rep:"),
                  [-10, -5, -1, 1, 5, 10].map(d => React.createElement("button", {
                    key: d,
                    onClick: (e) => { e.stopPropagation(); updateRep(f.name, f.score + d); },
                    style: {
                      padding: "4px 8px", fontSize: 10, fontFamily: T.ui, border: `1px solid ${T.border}`,
                      background: d > 0 ? "rgba(46,204,113,0.08)" : "rgba(231,76,60,0.08)",
                      color: d > 0 ? T.green : T.crimson, borderRadius: 2, cursor: "pointer"
                    }
                  }, (d > 0 ? "+" : "") + d))
                )
              )
            );
          })
        )
      ),

      // Organizations
      orgFiltered.length > 0 && React.createElement("div", { style: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px 24px" } },
        React.createElement(SectionLabel, { count: orgFiltered.length }, "Organizations & Guilds"),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 } },
          orgFiltered.map(sf => React.createElement("div", {
            key: sf.id,
            style: {
              padding: "14px 16px", background: "rgba(0,0,0,0.06)", border: `1px solid ${T.border}`,
              borderRadius: 4, borderLeft: `3px solid ${sf.color}`
            }
          },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 } },
              React.createElement("span", { style: { fontSize: 13, color: T.text } }, sf.name),
              React.createElement(TierBadge, { tier: sf.tier, color: sf.tierColor }),
              React.createElement("span", { style: { fontSize: 9, color: T.textFaint, marginLeft: "auto" } }, sf.score + "/100")
            ),
            React.createElement(RepBar, { score: sf.score, color: sf.tierColor }),
            sf.parentFaction && React.createElement("div", { style: { fontSize: 9, color: T.textFaint, marginTop: 8 } }, "Within: " + sf.parentFaction),
            isDM && React.createElement("div", { style: { display: "flex", gap: 4, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.border}` } },
              [-5, -1, 1, 5].map(d => React.createElement("button", {
                key: d,
                onClick: () => updateRep(sf.name, sf.score + d),
                style: { padding: "3px 6px", fontSize: 9, border: `1px solid ${T.border}`, background: d > 0 ? "rgba(46,204,113,0.06)" : "rgba(231,76,60,0.06)", color: d > 0 ? T.green : T.crimson, borderRadius: 2, cursor: "pointer" }
              }, (d > 0 ? "+" : "") + d))
            )
          ))
        )
      )
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // ALLIES TAB — Detailed view of all allies
  // ─────────────────────────────────────────────────────────────────────
  const renderAllies = () => {
    return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 24 } },
      // Allied factions
      React.createElement("div", { style: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px 24px" } },
        React.createElement(SectionLabel, { count: allies.length }, "Allied Factions & Kingdoms"),
        allies.length > 0
          ? React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
              allies.map(f => React.createElement("div", {
                key: f.id,
                style: { display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 4, borderLeft: `4px solid ${f.color}`, background: "rgba(46,204,113,0.03)", border: `1px solid rgba(46,204,113,0.12)` }
              },
                React.createElement("div", { style: { width: 14, height: 14, borderRadius: "50%", background: f.color || T.gold, flexShrink: 0 } }),
                React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                  React.createElement("div", { style: { fontSize: 14, color: T.text, fontWeight: 400 } }, f.name),
                  React.createElement("div", { style: { fontSize: 10, color: T.textFaint, marginTop: 2 } }, [f.govType, f.trend === "rising" ? "▲ Growing" : f.trend === "declining" ? "▼ Weakening" : null].filter(Boolean).join(" · "))
                ),
                React.createElement(TierBadge, { tier: f.tier, color: f.tierColor }),
                React.createElement("div", { style: { width: 120 } }, React.createElement(RepBar, { score: f.score, color: f.tierColor })),
                React.createElement("span", { style: { fontSize: 10, color: T.gold, fontFamily: T.ui } }, "Power " + (f.power || "?"))
              ))
            )
          : React.createElement("div", { style: { padding: 20, textAlign: "center", fontSize: 12, color: T.textFaint, fontStyle: "italic" } }, "No allied factions yet. Build relationships through quests and diplomacy.")
      ),

      // Friendly NPCs
      React.createElement("div", { style: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px 24px" } },
        React.createElement(SectionLabel, { count: allyNPCs.length }, "Friendly Contacts"),
        allyNPCs.length > 0
          ? React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 } },
              allyNPCs.map(n => React.createElement("div", {
                key: n.id,
                style: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(0,0,0,0.04)", border: `1px solid ${T.border}`, borderRadius: 4, borderLeft: `3px solid ${n.factionColor}` }
              },
                React.createElement("div", { style: { width: 30, height: 30, borderRadius: "50%", background: n.factionColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: T.bg, fontFamily: T.heading, fontWeight: 600, flexShrink: 0 } }, n.name.charAt(0)),
                React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                  React.createElement("div", { style: { fontSize: 12, color: T.text } }, n.name),
                  React.createElement("div", { style: { fontSize: 10, color: T.textFaint, marginTop: 1 } }, [n.role, n.faction, n.loc].filter(Boolean).join(" · "))
                ),
                React.createElement(TierBadge, { tier: n.tier, color: n.tierColor })
              ))
            )
          : React.createElement("div", { style: { padding: 16, textAlign: "center", fontSize: 12, color: T.textFaint, fontStyle: "italic" } }, "No friendly NPC contacts yet.")
      )
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // ENEMIES TAB — All hostiles and dangers
  // ─────────────────────────────────────────────────────────────────────
  const renderEnemies = () => {
    return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 24 } },
      // Hostile factions
      React.createElement("div", { style: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px 24px" } },
        React.createElement(SectionLabel, { count: enemies.length }, "Hostile Factions & Enemies"),
        enemies.length > 0
          ? React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } },
              enemies.sort((a, b) => a.score - b.score).map(f => React.createElement("div", {
                key: f.id,
                style: { display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 4, borderLeft: `4px solid ${f.color}`, background: "rgba(212,67,58,0.03)", border: `1px solid rgba(212,67,58,0.1)` }
              },
                React.createElement("div", { style: { width: 14, height: 14, borderRadius: "50%", background: f.color || T.crimson, flexShrink: 0 } }),
                React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                  React.createElement("div", { style: { fontSize: 14, color: T.text, fontWeight: 400 } }, f.name),
                  React.createElement("div", { style: { fontSize: 10, color: T.textFaint, marginTop: 2 } }, [f.govType, "Power " + (f.power || "?")].filter(Boolean).join(" · "))
                ),
                React.createElement(TierBadge, { tier: f.tier, color: f.tierColor }),
                React.createElement("div", { style: { width: 120 } }, React.createElement(RepBar, { score: f.score, color: f.tierColor })),
                f.trend === "rising" && React.createElement("span", { style: { fontSize: 9, color: T.crimson, fontFamily: T.ui, letterSpacing: "0.5px" } }, "⚠ GROWING")
              ))
            )
          : React.createElement("div", { style: { padding: 20, textAlign: "center", fontSize: 12, color: T.textFaint, fontStyle: "italic" } }, "No enemies — yet. Tread carefully.")
      ),

      // Hostile NPCs
      React.createElement("div", { style: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px 24px" } },
        React.createElement(SectionLabel, { count: enemyNPCs.length }, "Hostile Individuals"),
        enemyNPCs.length > 0
          ? React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 } },
              enemyNPCs.sort((a, b) => a.score - b.score).map(n => React.createElement("div", {
                key: n.id,
                style: { display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: "rgba(212,67,58,0.03)", border: `1px solid rgba(212,67,58,0.08)`, borderRadius: 4, borderLeft: `3px solid ${n.factionColor}` }
              },
                React.createElement("div", { style: { width: 30, height: 30, borderRadius: "50%", background: n.factionColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: T.bg, fontFamily: T.heading, fontWeight: 600, flexShrink: 0 } }, n.name.charAt(0)),
                React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                  React.createElement("div", { style: { fontSize: 12, color: T.text } }, n.name),
                  React.createElement("div", { style: { fontSize: 10, color: T.textFaint, marginTop: 1 } }, [n.role, n.faction].filter(Boolean).join(" · "))
                ),
                React.createElement(TierBadge, { tier: n.tier, color: n.tierColor }),
                n.alive === false && React.createElement("span", { style: { fontSize: 8, color: T.green, fontFamily: T.ui, letterSpacing: "1px" } }, "DEFEATED")
              ))
            )
          : React.createElement("div", { style: { padding: 16, textAlign: "center", fontSize: 12, color: T.textFaint, fontStyle: "italic" } }, "No hostile individuals.")
      )
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // NPC NETWORK TAB
  // ─────────────────────────────────────────────────────────────────────
  const renderNPCs = () => {
    const filtered = npcStandings.filter(n => matchesSearch(n.name));
    const leaders = filtered.filter(n => n.isLeader);
    const others = filtered.filter(n => !n.isLeader);

    const renderCard = (n) => React.createElement("div", {
      key: n.id,
      onClick: () => setSelectedEntity(selectedEntity === n.name ? null : n.name),
      style: {
        background: T.bgCard, border: `1px solid ${selectedEntity === n.name ? T.crimsonBorder : T.border}`,
        borderRadius: 4, borderLeft: `3px solid ${n.factionColor}`, padding: "14px 16px", cursor: "pointer", transition: "border-color 0.15s"
      }
    },
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: selectedEntity === n.name ? 10 : 0 } },
        React.createElement("div", { style: { width: 28, height: 28, borderRadius: "50%", background: n.factionColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: T.bg, fontFamily: T.heading, fontWeight: 600, flexShrink: 0 } }, n.name.charAt(0)),
        React.createElement("div", { style: { flex: 1, minWidth: 0 } },
          React.createElement("div", { style: { fontSize: 13, color: T.text } }, n.name),
          React.createElement("div", { style: { fontSize: 10, color: T.textFaint, marginTop: 1 } }, [n.role, n.faction, n.loc].filter(Boolean).join(" · "))
        ),
        React.createElement(TierBadge, { tier: n.tier, color: n.tierColor }),
        n.alive === false && React.createElement("span", { style: { fontSize: 8, color: T.crimson, fontFamily: T.ui } }, "DEAD")
      ),
      selectedEntity === n.name && React.createElement("div", { style: { borderTop: `1px solid ${T.border}`, paddingTop: 10 } },
        React.createElement("div", { style: { width: "100%", marginBottom: 8 } }, React.createElement(RepBar, { score: n.score, color: n.tierColor })),
        n.desc && React.createElement("div", { style: { fontSize: 10, color: T.textMuted, lineHeight: 1.6, fontStyle: "italic", marginBottom: 8 } }, n.desc),
        isDM && React.createElement("div", { style: { display: "flex", gap: 4 } },
          [-5, -1, 1, 5].map(d => React.createElement("button", {
            key: d,
            onClick: (e) => { e.stopPropagation(); updateRep(n.name, n.score + d); },
            style: { padding: "3px 6px", fontSize: 9, border: `1px solid ${T.border}`, background: d > 0 ? "rgba(46,204,113,0.06)" : "rgba(231,76,60,0.06)", color: d > 0 ? T.green : T.crimson, borderRadius: 2, cursor: "pointer" }
          }, (d > 0 ? "+" : "") + d))
        )
      )
    );

    return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20 } },
      leaders.length > 0 && React.createElement("div", null,
        React.createElement(SectionLabel, { count: leaders.length }, "Leaders & Rulers"),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 } }, leaders.map(renderCard))
      ),
      others.length > 0 && React.createElement("div", null,
        React.createElement(SectionLabel, { count: others.length }, "Other NPCs"),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 } }, others.map(renderCard))
      ),
      party.length > 0 && React.createElement("div", null,
        React.createElement(SectionLabel, { count: party.length }, "Party Members"),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 } },
          party.map((p, i) => React.createElement("div", {
            key: i,
            style: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4, borderLeft: `3px solid ${T.questGold}`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }
          },
            React.createElement("div", { style: { width: 28, height: 28, borderRadius: "50%", background: T.questGold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: T.bg, fontFamily: T.heading, fontWeight: 600 } }, "★"),
            React.createElement("div", null,
              React.createElement("div", { style: { fontSize: 13, color: T.text } }, p.name),
              React.createElement("div", { style: { fontSize: 10, color: T.textFaint, marginTop: 1 } }, [p.race, p.class || p.class_, p.level ? "Lv" + p.level : null].filter(Boolean).join(" · "))
            )
          ))
        )
      )
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // PARTY TAB — Kingdom affiliation, social rank, faction reputation, diplomacy
  // ─────────────────────────────────────────────────────────────────────
  const Select = ({ value, onChange, style, children }) => React.createElement("select", {
    value, onChange: e => onChange(e.target.value),
    style: { padding: "8px 12px", fontSize: 12, background: T.bgInput, border: `1px solid ${T.border}`, borderRadius: 3, color: T.text, fontFamily: T.body, cursor: "pointer", ...style }
  }, children);

  const renderParty = () => {
    if (!isDM) {
      return React.createElement("div", { style: { padding: 40, textAlign: "center", color: T.textFaint, fontStyle: "italic" } }, "Party settings are managed by the DM.");
    }

    const SOCIAL_RANKS = [
      { value:"outcast",     label:"Outcast — Exiled, wanted, or shunned by society",         color: T.crimson,   lbl:"Outcasts",      desc:"The party is shunned or hunted. Guards are suspicious, merchants refuse service, and most doors are closed to them." },
      { value:"peasant",     label:"Peasant — Common folk, laborers, and farmers",             color: T.textFaint, lbl:"Peasants",      desc:"The party lives at the lowest rung. They have no political influence, few resources, and must earn every scrap of respect." },
      { value:"commoner",    label:"Commoner — Merchants, artisans, and townsfolk",            color: T.textMuted, lbl:"Commoners",     desc:"Ordinary citizens. The party can trade freely and move without suspicion, but holds no special privilege." },
      { value:"freeman",     label:"Freeman — Respected citizens with some standing",          color: T.textDim,   lbl:"Freemen",       desc:"Respected members of society. Some merchants offer discounts, and minor officials take their concerns seriously." },
      { value:"guild_member",label:"Guild Member — Part of a recognized trade or adventurer's guild", color:"#4a90d9", lbl:"Guild Members", desc:"Recognized by a guild. The party has access to guild resources, safe houses, and a network of contacts." },
      { value:"knight",      label:"Knight — Sworn warriors with land or title",               color:"#2e8b57",    lbl:"Knights",       desc:"Titled warriors with sworn oaths. The party commands respect from soldiers, has access to military resources, and may hold small lands." },
      { value:"lesser_noble",label:"Lesser Noble — Barons, baronesses, landed lords",          color: T.gold,      lbl:"Lesser Nobles", desc:"The party holds minor titles and lands. They attend court, can raise levies, and have political influence in their region." },
      { value:"noble",       label:"Noble — Counts, dukes, or high-ranking aristocrats",       color:"#d4a017",    lbl:"Nobles",        desc:"High-ranking aristocrats. The party wields significant political power, commands armies, and influences the fate of regions." },
      { value:"royal",       label:"Royal — Princes, princesses, or members of the royal family", color:"#8b50f0", lbl:"Royalty",       desc:"Members of the ruling family. The party has immense authority, vast wealth, and the weight of a dynasty behind their every action." },
      { value:"ruler",       label:"Ruler — Kings, queens, emperors, or sovereign leaders",    color: T.crimson,   lbl:"Rulers",        desc:"The party sits atop the hierarchy. Their word is law, their armies vast, and their decisions shape the world itself." },
    ];

    const currentRankInfo = SOCIAL_RANKS.find(r => r.value === (data.partyRank || "commoner"));

    return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20 } },

      // Kingdom Affiliation
      React.createElement("div", { style: { background: T.bgCard, padding: 24, border: `1px solid ${T.border}`, borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" } },
        React.createElement("div", { style: { fontSize: 10, color: T.textFaint, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 } }, "Kingdom Affiliation"),
        React.createElement(Select, { value: data.partyKingdom || "", onChange: v => setData(d => ({ ...d, partyKingdom: v })), style: { width: "100%", marginBottom: 12 } },
          React.createElement("option", { value: "" }, "No Affiliation (Independent)"),
          factions.map(f => React.createElement("option", { key: f.id, value: f.name }, f.name))
        ),
        data.partyKingdom && React.createElement("div", { style: { fontSize: 12, color: T.textMuted, fontStyle: "italic" } },
          "The party is affiliated with ",
          React.createElement("span", { style: { color: T.gold } }, data.partyKingdom),
          (() => { const f = factions.find(f => f.name === data.partyKingdom); return f ? " — a " + (f.govType || "faction") + " currently " + (f.trend || "stable") : null; })()
        )
      ),

      // Social Standing
      React.createElement("div", { style: { background: T.bgCard, padding: 24, border: `1px solid ${T.border}`, borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" } },
        React.createElement("div", { style: { fontSize: 10, color: T.textFaint, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 } }, "Party Social Standing"),
        React.createElement(Select, { value: data.partyRank || "commoner", onChange: v => setData(d => ({ ...d, partyRank: v })), style: { width: "100%", marginBottom: 12 } },
          SOCIAL_RANKS.map(r => React.createElement("option", { key: r.value, value: r.value }, r.label))
        ),
        currentRankInfo && React.createElement("div", { style: { padding: 12, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 3 } },
          React.createElement("div", { style: { fontSize: 14, color: currentRankInfo.color, fontWeight: 400, marginBottom: 6 } }, currentRankInfo.lbl),
          React.createElement("div", { style: { fontSize: 12, color: T.textMuted, fontWeight: 300, lineHeight: "1.5" } }, currentRankInfo.desc)
        )
      ),

      // Party Reputation by Faction
      React.createElement("div", { style: { background: T.bgCard, padding: 24, border: `1px solid ${T.border}`, borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" } },
        React.createElement("div", { style: { fontSize: 10, color: T.textFaint, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 } }, "Party Reputation by Faction"),
        factions.length === 0
          ? React.createElement("div", { style: { fontSize: 12, color: T.textFaint, fontStyle: "italic" } }, "No factions exist yet. Generate a world first.")
          : React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
              factions.map(f => {
                const rep = (data.partyReputations || {})[f.name] || "neutral";
                return React.createElement("div", {
                  key: f.id,
                  style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: T.bg, border: `1px solid ${T.border}`, borderRadius: 3, borderLeft: `3px solid ${f.color}` }
                },
                  React.createElement("span", { style: { flex: 1, fontSize: 13, color: T.text, fontWeight: 300 } }, f.name),
                  React.createElement(Select, {
                    value: rep,
                    onChange: v => setData(d => ({ ...d, partyReputations: { ...(d.partyReputations || {}), [f.name]: v } })),
                    style: { width: 130 }
                  }, ["revered","allied","friendly","neutral","cautious","hostile","hated"].map(a => React.createElement("option", { key: a, value: a }, a)))
                );
              })
            )
      ),

      // Faction Diplomacy Matrix
      React.createElement("div", { style: { background: T.bgCard, padding: 24, border: `1px solid ${T.border}`, borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" } },
        React.createElement("div", { style: { fontSize: 10, color: T.textFaint, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 } }, "Faction Diplomacy"),
        React.createElement("div", { style: { fontSize: 11, color: T.textMuted, marginBottom: 12 } }, "Faction-to-faction relationships. Click to view details."),
        factions.length < 2
          ? React.createElement("div", { style: { fontSize: 12, color: T.textFaint, fontStyle: "italic" } }, "Need at least 2 factions to set relationships.")
          : React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
              factions.map(f => React.createElement("div", {
                key: f.id,
                style: {
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  background: T.bg, border: `1px solid ${T.border}`, borderRadius: 3,
                  borderLeft: `3px solid ${f.color}`, transition: "all 0.2s"
                }
              },
                React.createElement("span", { style: { fontSize: 13, color: T.text, fontWeight: 300, flex: 1 } }, f.name),
                React.createElement("div", { style: { display: "flex", gap: 8, fontSize: 10 } },
                  f.allies?.length > 0 && React.createElement("span", { style: { color: T.green } }, f.allies.length + " allies"),
                  f.rivals?.length > 0 && React.createElement("span", { style: { color: T.crimson } }, f.rivals.length + " rivals"),
                  !f.allies?.length && !f.rivals?.length && React.createElement("span", { style: { color: T.textFaint } }, "no relationships")
                )
              ))
            )
      )
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // MAIN LAYOUT
  // ─────────────────────────────────────────────────────────────────────
  const tabs = [
    { key: "standing", label: "Standing" },
    { key: "allies", label: "Allies" },
    { key: "enemies", label: "Enemies" },
    { key: "npcs", label: "NPC Network" },
    { key: "party", label: "Party" }
  ];

  return React.createElement("div", {
    style: { padding: "20px 40px 36px", maxWidth: "100%", width: "100%", overflowY: "auto", flex: 1 }
  },
    // Header
    React.createElement("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 24 } },
      React.createElement("div", { style: { flex: "1 1 200px" } },
        React.createElement("div", { style: { fontSize: 22, color: T.text, fontWeight: 400, fontFamily: T.body, letterSpacing: "0.02em" } }, "Party Relations"),
        React.createElement("div", { style: { fontSize: 12, color: T.textMuted, fontWeight: 300, marginTop: 2 } },
          allies.length + " allies · " + enemies.length + " enemies · " + allyNPCs.length + " contacts"
        )
      ),
      React.createElement("div", { style: { flex: "1 1 180px", minWidth: 120, maxWidth: 260 } },
        React.createElement("input", {
          type: "text", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value),
          placeholder: "Search\u2026",
          style: { width: "100%", padding: "8px 12px", fontSize: 12, background: T.bgNav, border: `1px solid ${T.border}`, borderRadius: 3, color: T.text, fontFamily: T.body }
        })
      ),
      React.createElement("div", { style: { display: "flex", gap: 4 } },
        tabs.map(t => React.createElement("button", {
          key: t.key,
          onClick: () => { setViewMode(t.key); setSelectedEntity(null); },
          style: {
            padding: "6px 14px", fontSize: 10, fontFamily: T.ui, letterSpacing: "1px", textTransform: "uppercase",
            border: viewMode === t.key ? `1px solid ${T.crimson}` : `1px solid ${T.border}`,
            background: viewMode === t.key ? "rgba(212,67,58,0.12)" : "transparent",
            color: viewMode === t.key ? T.crimson : T.textFaint,
            borderRadius: 3, cursor: "pointer", transition: "all 0.15s"
          }
        }, t.label))
      )
    ),

    viewMode === "standing" && renderStanding(),
    viewMode === "allies" && renderAllies(),
    viewMode === "enemies" && renderEnemies(),
    viewMode === "npcs" && renderNPCs(),
    viewMode === "party" && renderParty()
  );
};
