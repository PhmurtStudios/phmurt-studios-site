// ═══════════════════════════════════════════════════════════════════════════
// CAMPAIGN RELATIONSHIP WEB – Structured D&D Relationship Viewer
// Faction power rankings, alliance/rivalry maps, NPC networks, city control
// ═══════════════════════════════════════════════════════════════════════════

window.RelationshipWebView = function RelationshipWebView({ data, setData, viewRole }) {
  const [viewMode, setViewMode] = React.useState("overview"); // "overview" | "factions" | "npcs" | "graph"
  const [selectedEntity, setSelectedEntity] = React.useState(null); // { type, id }
  const [searchTerm, setSearchTerm] = React.useState("");
  const [graphZoom, setGraphZoom] = React.useState(1);

  // ─────────────────────────────────────────────────────────────────────
  // THEME
  // ─────────────────────────────────────────────────────────────────────
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

  const REL_COLORS = {
    alliance: "#2ecc71", rivalry: "#e74c3c", trade: "#3498db",
    membership: "#95a5a6", worship: "#8e44ad", love: "#ff69b4", feud: "#f39c12"
  };

  // ─────────────────────────────────────────────────────────────────────
  // DATA DERIVATION
  // ─────────────────────────────────────────────────────────────────────
  const factions = React.useMemo(() => (data.factions || []), [data.factions]);
  const npcs = React.useMemo(() => (data.npcs || []), [data.npcs]);
  const cities = React.useMemo(() => (data.cities || []), [data.cities]);
  const party = React.useMemo(() => (data.party || []), [data.party]);
  const regions = React.useMemo(() => (data.regions || []), [data.regions]);

  const majorFactions = React.useMemo(() => factions.filter(f => !f.isSubFaction).sort((a, b) => (b.power || 0) - (a.power || 0)), [factions]);
  const subFactions = React.useMemo(() => factions.filter(f => f.isSubFaction), [factions]);

  const factionByName = React.useMemo(() => {
    const map = {};
    factions.forEach(f => { map[f.name] = f; });
    return map;
  }, [factions]);

  // Build all relationships as a flat list
  const relationships = React.useMemo(() => {
    const rels = [];
    const seen = new Set();
    const addRel = (a, b, type, label) => {
      const key = [a, b].sort().join("||") + "||" + type;
      if (seen.has(key)) return;
      seen.add(key);
      rels.push({ a, b, type, label });
    };

    factions.forEach(f => {
      (f.allies || []).forEach(a => addRel(f.name, a, "alliance", "Allied"));
      (f.rivals || []).forEach(r => addRel(f.name, r, "rivalry", "Rivals"));
      if (f.isSubFaction && f.parentFaction) addRel(f.name, f.parentFaction, "membership", "Operates within");
    });

    npcs.filter(n => n.faction).forEach(n => {
      addRel(n.name, n.faction, "membership", n.role || "Member");
    });

    cities.forEach(c => {
      if (c.faction) addRel(c.name, c.faction, "trade", "Controlled by");
    });

    return rels;
  }, [factions, npcs, cities]);

  // Get connections for a specific entity name
  const getConnections = (name) => {
    return relationships.filter(r => r.a === name || r.b === name).map(r => ({
      ...r,
      other: r.a === name ? r.b : r.a
    }));
  };

  // Search filter
  const matchesSearch = (name) => {
    if (!searchTerm.trim()) return true;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  };

  // ─────────────────────────────────────────────────────────────────────
  // SHARED COMPONENTS
  // ─────────────────────────────────────────────────────────────────────
  const RelBadge = ({ type, label }) => {
    const color = REL_COLORS[type] || T.textFaint;
    return React.createElement("span", {
      style: {
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "2px 8px", fontSize: 9, fontFamily: T.ui,
        letterSpacing: "0.5px", borderRadius: "2px",
        color: color, background: color + "12", border: `1px solid ${color}30`
      }
    }, type === "alliance" ? "⚔" : type === "rivalry" ? "⚡" : type === "trade" ? "◆" : type === "membership" ? "●" : "○", " ", label || type);
  };

  const PowerBar = ({ value, max, color }) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100));
    return React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
      React.createElement("div", { style: { flex: 1, height: 5, background: "rgba(0,0,0,0.2)", borderRadius: 3, overflow: "hidden" } },
        React.createElement("div", { style: { height: "100%", width: pct + "%", background: color || T.crimson, borderRadius: 3, transition: "width 0.3s ease" } })
      ),
      React.createElement("span", { style: { fontSize: 11, color: T.textMuted, fontFamily: T.ui, minWidth: 24, textAlign: "right" } }, value)
    );
  };

  const SectionLabel = ({ children }) => React.createElement("div", {
    style: { fontSize: 10, color: T.gold, fontFamily: T.ui, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 12 }
  }, children);

  // ─────────────────────────────────────────────────────────────────────
  // OVERVIEW TAB
  // ─────────────────────────────────────────────────────────────────────
  const renderOverview = () => {
    const alliances = relationships.filter(r => r.type === "alliance");
    const rivalries = relationships.filter(r => r.type === "rivalry");
    const leaders = npcs.filter(n => n.isLeader);

    return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 24 } },

      // Power Rankings
      React.createElement("div", { style: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px 24px" } },
        React.createElement(SectionLabel, null, "Power Rankings"),
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 2 } },
          majorFactions.map((f, i) => React.createElement("div", {
            key: f.id,
            onClick: () => setSelectedEntity({ type: "faction", name: f.name }),
            style: {
              display: "grid", gridTemplateColumns: "28px 12px 1fr 100px 60px 24px", alignItems: "center", gap: 12,
              padding: "12px 16px", borderRadius: 3, cursor: "pointer",
              background: selectedEntity?.name === f.name ? "rgba(212,67,58,0.06)" : i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.08)",
              transition: "background 0.15s"
            }
          },
            React.createElement("span", { style: { fontSize: 18, color: i < 3 ? T.gold : T.textFaint, fontFamily: T.ui, textAlign: "right", fontWeight: 300 } }, i + 1),
            React.createElement("div", { style: { width: 10, height: 10, borderRadius: "50%", background: f.color || T.gold } }),
            React.createElement("div", null,
              React.createElement("div", { style: { fontSize: 13, color: T.text, fontWeight: 400 } }, f.name),
              React.createElement("div", { style: { fontSize: 10, color: T.textFaint, marginTop: 2 } },
                [f.govType, f.attitude].filter(Boolean).join(" · ")
              )
            ),
            React.createElement(PowerBar, { value: f.power || 0, max: 100, color: f.color }),
            React.createElement("span", {
              style: {
                fontSize: 10, fontFamily: T.ui, textAlign: "center", letterSpacing: "0.5px",
                color: f.trend === "rising" ? T.green : f.trend === "declining" ? T.crimson : T.textFaint
              }
            }, f.trend === "rising" ? "▲ Rising" : f.trend === "declining" ? "▼ Falling" : "— Stable"),
            React.createElement("span", { style: { fontSize: 10, color: T.textFaint } }, "›")
          ))
        )
      ),

      // Alliances & Rivalries — side by side
      React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } },
        // Alliances
        React.createElement("div", { style: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px 24px" } },
          React.createElement(SectionLabel, null, "Alliances (" + alliances.length + ")"),
          alliances.length > 0
            ? React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
                alliances.map((a, i) => {
                  const facA = factionByName[a.a];
                  const facB = factionByName[a.b];
                  return React.createElement("div", {
                    key: i,
                    style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 3, background: "rgba(46,204,113,0.04)", border: "1px solid rgba(46,204,113,0.1)" }
                  },
                    React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: facA?.color || T.gold, flexShrink: 0 } }),
                    React.createElement("span", { style: { fontSize: 12, color: T.text, flex: 1 } }, a.a),
                    React.createElement("span", { style: { fontSize: 14, color: "#2ecc71" } }, "⟷"),
                    React.createElement("span", { style: { fontSize: 12, color: T.text, flex: 1, textAlign: "right" } }, a.b),
                    React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: facB?.color || T.gold, flexShrink: 0 } })
                  );
                })
              )
            : React.createElement("div", { style: { fontSize: 11, color: T.textFaint, fontStyle: "italic" } }, "No alliances formed")
        ),

        // Rivalries
        React.createElement("div", { style: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px 24px" } },
          React.createElement(SectionLabel, null, "Rivalries & Conflicts (" + rivalries.length + ")"),
          rivalries.length > 0
            ? React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
                rivalries.map((r, i) => {
                  const facA = factionByName[r.a];
                  const facB = factionByName[r.b];
                  return React.createElement("div", {
                    key: i,
                    style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 3, background: "rgba(231,76,60,0.04)", border: "1px solid rgba(231,76,60,0.1)" }
                  },
                    React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: facA?.color || T.crimson, flexShrink: 0 } }),
                    React.createElement("span", { style: { fontSize: 12, color: T.text, flex: 1 } }, r.a),
                    React.createElement("span", { style: { fontSize: 14, color: "#e74c3c" } }, "⚔"),
                    React.createElement("span", { style: { fontSize: 12, color: T.text, flex: 1, textAlign: "right" } }, r.b),
                    React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: facB?.color || T.crimson, flexShrink: 0 } })
                  );
                })
              )
            : React.createElement("div", { style: { fontSize: 11, color: T.textFaint, fontStyle: "italic" } }, "No active rivalries")
        )
      ),

      // Organizations & Shadow Powers
      subFactions.length > 0 && React.createElement("div", { style: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px 24px" } },
        React.createElement(SectionLabel, null, "Organizations & Shadow Powers"),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 } },
          subFactions.map(sf => React.createElement("div", {
            key: sf.id,
            onClick: () => setSelectedEntity({ type: "faction", name: sf.name }),
            style: {
              padding: "14px 16px", background: "rgba(0,0,0,0.1)", border: `1px solid ${T.border}`,
              borderRadius: 4, borderLeft: `3px solid ${sf.color}`, cursor: "pointer", transition: "border-color 0.15s"
            }
          },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 } },
              React.createElement("span", { style: { fontSize: 13, color: T.text, fontWeight: 400 } }, sf.name),
              React.createElement("span", { style: { fontSize: 9, color: T.textFaint, marginLeft: "auto" } }, "Power ", sf.power)
            ),
            React.createElement("div", { style: { fontSize: 10, color: T.textFaint, marginBottom: 6 } }, sf.govType || "Unknown type"),
            sf.desc && React.createElement("div", { style: { fontSize: 10, color: T.textMuted, lineHeight: 1.5, marginBottom: 8 } },
              sf.desc.length > 100 ? sf.desc.substring(0, 100) + "…" : sf.desc
            ),
            React.createElement("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" } },
              (sf.influence || []).map((inf, ii) => React.createElement("span", {
                key: ii,
                style: { fontSize: 8, color: sf.color, background: sf.color + "15", padding: "2px 6px", borderRadius: 2, border: `1px solid ${sf.color}30` }
              }, inf))
            ),
            sf.parentFaction && React.createElement("div", { style: { fontSize: 9, color: T.textFaint, marginTop: 8, paddingTop: 6, borderTop: `1px solid ${T.border}` } },
              "Operates within: ", sf.parentFaction
            )
          ))
        )
      ),

      // Key Leaders
      leaders.length > 0 && React.createElement("div", { style: { background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4, padding: "20px 24px" } },
        React.createElement(SectionLabel, null, "Key Leaders"),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 } },
          leaders.map(n => {
            const fac = factionByName[n.faction];
            return React.createElement("div", {
              key: n.id,
              onClick: () => setSelectedEntity({ type: "npc", name: n.name }),
              style: {
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                background: "rgba(0,0,0,0.06)", border: `1px solid ${T.border}`, borderRadius: 4,
                borderLeft: `3px solid ${fac?.color || T.textFaint}`, cursor: "pointer"
              }
            },
              React.createElement("div", { style: { width: 32, height: 32, borderRadius: "50%", background: fac?.color || T.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: T.bg, fontFamily: T.heading, fontWeight: 600, flexShrink: 0 } },
                n.name.charAt(0)
              ),
              React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement("div", { style: { fontSize: 12, color: T.text, fontWeight: 400 } }, n.name),
                React.createElement("div", { style: { fontSize: 10, color: T.textFaint, marginTop: 2 } },
                  [n.role, n.faction].filter(Boolean).join(" · ")
                )
              ),
              n.alive === false && React.createElement("span", { style: { fontSize: 9, color: T.crimson, fontFamily: T.ui } }, "DECEASED")
            );
          })
        )
      )
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // FACTIONS TAB
  // ─────────────────────────────────────────────────────────────────────
  const renderFactions = () => {
    const filtered = factions.filter(f => matchesSearch(f.name));

    return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } },
      filtered.map(f => {
        const conns = getConnections(f.name);
        const allies = conns.filter(c => c.type === "alliance");
        const rivals = conns.filter(c => c.type === "rivalry");
        const members = conns.filter(c => c.type === "membership" && c.other !== f.name);
        const isExpanded = selectedEntity?.name === f.name;

        return React.createElement("div", {
          key: f.id,
          style: {
            background: T.bgCard, border: `1px solid ${isExpanded ? T.crimsonBorder : T.border}`,
            borderRadius: 4, overflow: "hidden", transition: "border-color 0.2s"
          }
        },
          // Header row
          React.createElement("div", {
            onClick: () => setSelectedEntity(isExpanded ? null : { type: "faction", name: f.name }),
            style: {
              display: "grid", gridTemplateColumns: "14px 1fr auto 80px 50px", alignItems: "center", gap: 12,
              padding: "14px 20px", cursor: "pointer", borderLeft: `4px solid ${f.color}`
            }
          },
            React.createElement("div", { style: { width: 12, height: 12, borderRadius: "50%", background: f.color } }),
            React.createElement("div", null,
              React.createElement("div", { style: { fontSize: 14, color: T.text, fontWeight: 400 } }, f.name),
              React.createElement("div", { style: { fontSize: 10, color: T.textFaint, marginTop: 2 } },
                [f.govType, f.isSubFaction ? "Organization" : "Major Faction"].filter(Boolean).join(" · ")
              )
            ),
            React.createElement("div", { style: { display: "flex", gap: 6 } },
              allies.length > 0 && React.createElement("span", { style: { fontSize: 9, color: "#2ecc71", padding: "2px 6px", background: "rgba(46,204,113,0.1)", borderRadius: 2, fontFamily: T.ui } },
                allies.length + " allies"
              ),
              rivals.length > 0 && React.createElement("span", { style: { fontSize: 9, color: "#e74c3c", padding: "2px 6px", background: "rgba(231,76,60,0.1)", borderRadius: 2, fontFamily: T.ui } },
                rivals.length + " rivals"
              )
            ),
            React.createElement(PowerBar, { value: f.power || 0, max: 100, color: f.color }),
            React.createElement("span", { style: { fontSize: 12, color: T.textFaint, textAlign: "right", transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "none" } }, "›")
          ),

          // Expanded details
          isExpanded && React.createElement("div", {
            style: { padding: "0 20px 20px 24px", borderTop: `1px solid ${T.border}`, marginTop: 0, paddingTop: 16 }
          },
            f.desc && React.createElement("div", { style: { fontSize: 11, color: T.textMuted, lineHeight: 1.6, marginBottom: 16, fontStyle: "italic", maxWidth: 700 } }, f.desc),

            // Attitude & Trend
            React.createElement("div", { style: { display: "flex", gap: 24, marginBottom: 16 } },
              React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 8, color: T.textFaint, fontFamily: T.ui, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 } }, "Attitude"),
                React.createElement("div", { style: { fontSize: 12, color: f.attitude === "hostile" ? T.crimson : f.attitude === "allied" || f.attitude === "friendly" ? T.green : T.text, textTransform: "capitalize" } }, f.attitude || "Neutral")
              ),
              React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 8, color: T.textFaint, fontFamily: T.ui, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 } }, "Trend"),
                React.createElement("div", { style: { fontSize: 12, color: f.trend === "rising" ? T.green : f.trend === "declining" ? T.crimson : T.textMuted } },
                  f.trend === "rising" ? "▲ Rising" : f.trend === "declining" ? "▼ Declining" : "— Stable"
                )
              ),
              f.resources && f.resources.length > 0 && React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 8, color: T.textFaint, fontFamily: T.ui, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 4 } }, "Resources"),
                React.createElement("div", { style: { fontSize: 11, color: T.textMuted } }, f.resources.join(", "))
              )
            ),

            // Hierarchy
            f.hierarchy && f.hierarchy.length > 0 && React.createElement("div", { style: { marginBottom: 16 } },
              React.createElement("div", { style: { fontSize: 8, color: T.textFaint, fontFamily: T.ui, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 } }, "Leadership"),
              React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 4 } },
                f.hierarchy.map((h, i) => React.createElement("div", {
                  key: i,
                  style: { display: "flex", alignItems: "center", gap: 8, paddingLeft: i * 16, fontSize: 11 }
                },
                  React.createElement("span", { style: { color: i === 0 ? T.gold : T.textFaint } }, h.title + ":"),
                  React.createElement("span", { style: { color: T.textMuted } }, h.name)
                ))
              )
            ),

            // Connections
            conns.length > 0 && React.createElement("div", null,
              React.createElement("div", { style: { fontSize: 8, color: T.textFaint, fontFamily: T.ui, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8 } }, "Connections"),
              React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6 } },
                conns.map((c, i) => React.createElement("div", {
                  key: i,
                  onClick: (e) => { e.stopPropagation(); setSelectedEntity({ type: "any", name: c.other }); },
                  style: {
                    display: "flex", alignItems: "center", gap: 6, padding: "6px 10px",
                    background: "rgba(0,0,0,0.1)", border: `1px solid ${T.border}`, borderRadius: 3,
                    cursor: "pointer", fontSize: 11
                  }
                },
                  React.createElement("div", { style: { width: 6, height: 6, borderRadius: "50%", background: REL_COLORS[c.type] || T.textFaint } }),
                  React.createElement("span", { style: { color: T.textMuted } }, c.other),
                  React.createElement("span", { style: { fontSize: 8, color: REL_COLORS[c.type] || T.textFaint, fontFamily: T.ui } }, c.label)
                ))
              )
            )
          )
        );
      })
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // NPC NETWORK TAB
  // ─────────────────────────────────────────────────────────────────────
  const renderNPCs = () => {
    const leaders = npcs.filter(n => n.isLeader && matchesSearch(n.name));
    const others = npcs.filter(n => !n.isLeader && matchesSearch(n.name));

    const renderNPCCard = (n) => {
      const fac = factionByName[n.faction];
      const conns = getConnections(n.name);
      const isExpanded = selectedEntity?.name === n.name;

      return React.createElement("div", {
        key: n.id,
        onClick: () => setSelectedEntity(isExpanded ? null : { type: "npc", name: n.name }),
        style: {
          background: T.bgCard, border: `1px solid ${isExpanded ? T.crimsonBorder : T.border}`,
          borderRadius: 4, borderLeft: `3px solid ${fac?.color || T.textFaint}`,
          padding: "14px 16px", cursor: "pointer", transition: "border-color 0.15s"
        }
      },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: isExpanded ? 12 : 0 } },
          React.createElement("div", { style: { width: 28, height: 28, borderRadius: "50%", background: fac?.color || T.gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: T.bg, fontFamily: T.heading, fontWeight: 600, flexShrink: 0 } },
            n.name.charAt(0)
          ),
          React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            React.createElement("div", { style: { fontSize: 13, color: T.text, fontWeight: 400 } }, n.name),
            React.createElement("div", { style: { fontSize: 10, color: T.textFaint, marginTop: 1 } },
              [n.role, n.faction, n.loc].filter(Boolean).join(" · ")
            )
          ),
          n.alive === false && React.createElement("span", { style: { fontSize: 8, color: T.crimson, fontFamily: T.ui, letterSpacing: "1px" } }, "DECEASED"),
          React.createElement("span", {
            style: {
              fontSize: 10, padding: "2px 8px", borderRadius: 2, fontFamily: T.ui,
              color: n.attitude === "hostile" ? T.crimson : n.attitude === "friendly" || n.attitude === "allied" ? T.green : T.textFaint,
              background: n.attitude === "hostile" ? "rgba(212,67,58,0.08)" : n.attitude === "friendly" || n.attitude === "allied" ? "rgba(94,224,154,0.08)" : "rgba(0,0,0,0.08)"
            }
          }, n.attitude || "neutral")
        ),

        isExpanded && React.createElement("div", { style: { paddingTop: 12, borderTop: `1px solid ${T.border}` } },
          n.desc && React.createElement("div", { style: { fontSize: 11, color: T.textMuted, lineHeight: 1.6, marginBottom: 12, fontStyle: "italic" } }, n.desc),
          conns.length > 0 && React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 4 } },
            conns.map((c, i) => React.createElement("span", {
              key: i,
              style: { display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", fontSize: 9, background: "rgba(0,0,0,0.1)", border: `1px solid ${T.border}`, borderRadius: 2, color: T.textMuted }
            },
              React.createElement("div", { style: { width: 4, height: 4, borderRadius: "50%", background: REL_COLORS[c.type] || T.textFaint } }),
              c.other, " — ", c.label
            ))
          )
        )
      );
    };

    return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20 } },
      leaders.length > 0 && React.createElement("div", null,
        React.createElement(SectionLabel, null, "Leaders & Rulers"),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 } },
          leaders.map(renderNPCCard)
        )
      ),
      others.length > 0 && React.createElement("div", null,
        React.createElement(SectionLabel, null, "Other NPCs"),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10 } },
          others.map(renderNPCCard)
        )
      ),
      party.length > 0 && React.createElement("div", null,
        React.createElement(SectionLabel, null, "Party Members"),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 } },
          party.map((p, i) => React.createElement("div", {
            key: i,
            style: {
              background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 4,
              borderLeft: `3px solid ${T.questGold}`, padding: "14px 16px"
            }
          },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } },
              React.createElement("div", { style: { width: 28, height: 28, borderRadius: "50%", background: T.questGold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: T.bg, fontFamily: T.heading, fontWeight: 600, flexShrink: 0 } },
                "★"
              ),
              React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 13, color: T.text, fontWeight: 400 } }, p.name),
                React.createElement("div", { style: { fontSize: 10, color: T.textFaint, marginTop: 1 } },
                  [p.race, p.class || p.class_, p.level ? "Lv" + p.level : null].filter(Boolean).join(" · ")
                )
              )
            )
          ))
        )
      )
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // GRAPH VIEW — Circular layout (much cleaner than force-directed)
  // ─────────────────────────────────────────────────────────────────────
  const renderGraph = () => {
    const allEntities = [];
    const entityMap = {};

    // Add major factions first (inner ring), then sub-factions, then leaders
    majorFactions.forEach(f => {
      const id = "f_" + f.name;
      allEntities.push({ id, name: f.name, type: "faction", color: f.color || T.gold, radius: Math.max(18, 18 + (f.power || 0) / 10), ring: 0 });
      entityMap[f.name] = id;
    });
    subFactions.forEach(f => {
      const id = "sf_" + f.name;
      allEntities.push({ id, name: f.name, type: "subfaction", color: f.color || T.textFaint, radius: 14, ring: 1 });
      entityMap[f.name] = id;
    });
    npcs.filter(n => n.isLeader).forEach(n => {
      const fac = factionByName[n.faction];
      const id = "n_" + n.name;
      allEntities.push({ id, name: n.name, type: "npc", color: fac?.color || T.textFaint, radius: 10, ring: 2 });
      entityMap[n.name] = id;
    });
    cities.forEach(c => {
      const id = "c_" + c.name;
      if (!entityMap[c.name]) {
        allEntities.push({ id, name: c.name, type: "city", color: c.isCapital ? T.questGold : T.textMuted, radius: c.isCapital ? 14 : 10, ring: 2 });
        entityMap[c.name] = id;
      }
    });

    if (allEntities.length === 0) {
      return React.createElement("div", { style: { padding: 40, textAlign: "center", color: T.textFaint, fontStyle: "italic" } },
        "No entities to display. Add factions, NPCs, or cities to see the relationship graph."
      );
    }

    const SVG_W = 900;
    const SVG_H = 620;
    const CX = SVG_W / 2;
    const CY = SVG_H / 2;

    // Position entities in concentric circles by ring
    const rings = [[], [], []];
    allEntities.forEach(e => rings[e.ring].push(e));

    const ringRadii = [160, 250, 320];
    rings.forEach((ring, ri) => {
      ring.forEach((e, i) => {
        const angle = (2 * Math.PI * i / ring.length) - Math.PI / 2;
        e.x = CX + ringRadii[ri] * Math.cos(angle);
        e.y = CY + ringRadii[ri] * Math.sin(angle);
      });
    });

    // Build visible edges
    const graphEdges = [];
    relationships.forEach(r => {
      const srcId = entityMap[r.a];
      const tgtId = entityMap[r.b];
      if (srcId && tgtId) {
        const src = allEntities.find(e => e.id === srcId);
        const tgt = allEntities.find(e => e.id === tgtId);
        if (src && tgt) {
          graphEdges.push({ src, tgt, type: r.type, label: r.label });
        }
      }
    });

    const hoveredName = selectedEntity?.name;

    return React.createElement("div", {
      style: { background: "rgba(12,8,4,0.3)", border: `1px solid ${T.border}`, borderRadius: 4, overflow: "hidden", position: "relative" }
    },
      React.createElement("svg", {
        viewBox: `0 0 ${SVG_W} ${SVG_H}`,
        style: { width: "100%", height: 620, display: "block", transform: `scale(${graphZoom})`, transformOrigin: "center center" },
        onWheel: (e) => { e.preventDefault(); setGraphZoom(z => Math.max(0.5, Math.min(2.5, z + (e.deltaY > 0 ? -0.1 : 0.1)))); }
      },
        // Edges
        graphEdges.map((edge, i) => {
          const isHighlighted = hoveredName === edge.src.name || hoveredName === edge.tgt.name;
          const color = REL_COLORS[edge.type] || "#555";
          const dashArray = edge.type === "rivalry" ? "6,4" : edge.type === "trade" ? "2,4" : edge.type === "membership" ? "3,3" : "none";
          return React.createElement("line", {
            key: "e" + i,
            x1: edge.src.x, y1: edge.src.y, x2: edge.tgt.x, y2: edge.tgt.y,
            stroke: color, strokeWidth: isHighlighted ? 2.5 : 1.5, strokeDasharray: dashArray,
            opacity: hoveredName ? (isHighlighted ? 0.9 : 0.1) : 0.4,
            style: { transition: "opacity 0.2s" }
          });
        }),

        // Nodes
        allEntities.map(e => {
          const isHovered = hoveredName === e.name;
          const isConnected = hoveredName && relationships.some(r => (r.a === hoveredName && r.b === e.name) || (r.b === hoveredName && r.a === e.name));
          const dimmed = hoveredName && !isHovered && !isConnected;

          return React.createElement("g", {
            key: e.id,
            onClick: () => setSelectedEntity(selectedEntity?.name === e.name ? null : { type: e.type, name: e.name }),
            style: { cursor: "pointer" }
          },
            // Node shape
            e.type === "city"
              ? React.createElement("rect", {
                  x: e.x - e.radius, y: e.y - e.radius, width: e.radius * 2, height: e.radius * 2,
                  rx: 2, fill: e.color, opacity: dimmed ? 0.15 : isHovered ? 1 : 0.8,
                  stroke: isHovered ? T.gold : "none", strokeWidth: 1.5,
                  style: { transition: "opacity 0.2s" }
                })
              : React.createElement("circle", {
                  cx: e.x, cy: e.y, r: e.radius,
                  fill: e.color, opacity: dimmed ? 0.15 : isHovered ? 1 : 0.8,
                  stroke: isHovered ? T.gold : "none", strokeWidth: 1.5,
                  style: { transition: "opacity 0.2s" }
                }),
            // Label
            React.createElement("text", {
              x: e.x, y: e.y + e.radius + 12,
              textAnchor: "middle", fontSize: e.type === "faction" ? 10 : 8,
              fill: dimmed ? "rgba(255,255,255,0.1)" : isHovered ? T.text : "rgba(255,255,255,0.5)",
              fontFamily: T.heading, style: { pointerEvents: "none", transition: "fill 0.2s" }
            }, e.name.length > 14 ? e.name.substring(0, 12) + "…" : e.name)
          );
        })
      ),

      // Legend overlay
      React.createElement("div", {
        style: { position: "absolute", bottom: 12, left: 12, display: "flex", gap: 12, flexWrap: "wrap" }
      },
        [["Alliance", "#2ecc71"], ["Rivalry", "#e74c3c"], ["Trade", "#3498db"], ["Membership", "#95a5a6"]].map(([label, color]) =>
          React.createElement("div", {
            key: label,
            style: { display: "flex", alignItems: "center", gap: 4, fontSize: 9, color: "rgba(255,255,255,0.4)" }
          },
            React.createElement("div", { style: { width: 16, height: 2, background: color, borderRadius: 1 } }),
            label
          )
        )
      ),

      // Interaction hint
      React.createElement("div", {
        style: { position: "absolute", bottom: 12, right: 12, fontSize: 9, color: "rgba(255,255,255,0.3)", fontFamily: T.body }
      }, "Click: highlight connections · Scroll: zoom")
    );
  };

  // ─────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "factions", label: "Factions" },
    { key: "npcs", label: "NPCs" },
    { key: "graph", label: "Graph" }
  ];

  return React.createElement("div", {
    style: { padding: "20px 40px 36px", maxWidth: "100%", width: "100%", overflowY: "auto", flex: 1 }
  },
    // Header
    React.createElement("div", {
      style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 24 }
    },
      React.createElement("div", { style: { flex: "1 1 200px" } },
        React.createElement("div", { style: { fontSize: 22, color: T.text, fontWeight: 400, fontFamily: T.body, letterSpacing: "0.02em" } }, "Relationships"),
        React.createElement("div", { style: { fontSize: 12, color: T.textMuted, fontWeight: 300, marginTop: 2 } },
          factions.length + " factions · " + npcs.filter(n => n.isLeader).length + " leaders · " + relationships.length + " connections"
        )
      ),

      // Search
      React.createElement("div", { style: { flex: "1 1 180px", minWidth: 120, maxWidth: 280 } },
        React.createElement("input", {
          type: "text",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          placeholder: "Search entities\u2026",
          style: {
            width: "100%", padding: "8px 12px", fontSize: 12,
            background: T.bgNav, border: `1px solid ${T.border}`, borderRadius: 3,
            color: T.text, fontFamily: T.body
          }
        })
      ),

      // View Tabs
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

    // Content
    viewMode === "overview" && renderOverview(),
    viewMode === "factions" && renderFactions(),
    viewMode === "npcs" && renderNPCs(),
    viewMode === "graph" && renderGraph()
  );
};
