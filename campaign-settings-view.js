window.CampaignSettingsView = function CampaignSettingsView({ data, setData, viewRole, campaignMembers }) {
  if (viewRole !== "dm") {
    return (
      <div style={{
        padding: "2rem",
        background: T.bg,
        borderRadius: "8px",
        textAlign: "center",
        color: T.text
      }}>
        <h2 style={{ color: T.crimson, fontSize: "1.2rem", marginBottom: "1rem" }}>
          Settings Restricted
        </h2>
        <p style={{ color: T.textMuted }}>
          Settings are only available to the DM.
        </p>
      </div>
    );
  }

  const updateModule = (key, value) => {
    setData(d => ({
      ...d,
      modules: { ...d.modules, [key]: value }
    }));
  };

  const updateModuleConfig = (key, value) => {
    setData(d => ({
      ...d,
      modules: { ...d.modules, [key]: value }
    }));
  };

  const handleCampaignNameChange = (e) => {
    setData(d => ({ ...d, campaignName: e.target.value }));
  };

  const handleCampaignDescChange = (e) => {
    setData(d => ({ ...d, campaignDescription: e.target.value }));
  };

  const handleCampaignTypeChange = (e) => {
    setData(d => ({ ...d, campaignType: e.target.value }));
  };

  const handleStatusChange = (e) => {
    setData(d => ({ ...d, campaignStatus: e.target.value }));
  };

  const handleStartDateChange = (e) => {
    setData(d => ({ ...d, campaignStartDate: e.target.value }));
  };

  const handleExport = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign-${data.campaignName || "export"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        setData(d => ({ ...d, ...imported }));
      } catch (err) {
        alert("Failed to parse JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleResetWorld = () => {
    if (window.confirm("Are you sure? This will reset all event history and faction power.")) {
      setData(d => ({
        ...d,
        modules: { ...d.modules, eventHistory: [], factionPower: {} }
      }));
    }
  };

  const isModuleRequired = (key) => {
    const deps = {
      economy: "livingWorld",
      religion: "calendar",
      questBoard: "livingWorld"
    };
    return deps[key];
  };

  const canEnableModule = (key) => {
    const required = isModuleRequired(key);
    if (!required) return true;
    return data.modules[required] === true;
  };

  const systemConfigs = {
    livingWorld: [
      { label: "Event Frequency", key: "lwEventFrequency", type: "select", options: ["30s", "60s", "90s", "180s", "300s", "600s", "Custom"] },
      { label: "Auto-Timeline Integration", key: "lwAutoTimeline", type: "toggle" }
    ],
    economy: [
      { label: "Starting Treasury Multiplier", key: "economyTreasuryMult", type: "select", options: ["0.5x", "1x", "2x"] },
      { label: "Price Volatility", key: "economyVolatility", type: "select", options: ["low", "medium", "high"] }
    ],
    calendar: [
      { label: "Starting Year", key: "calendarStartYear", type: "number" },
      { label: "Starting Season", key: "calendarStartSeason", type: "select", options: ["verdance", "solace", "decline", "frost"] },
      { label: "Weather Intensity", key: "weatherIntensity", type: "select", options: ["mild", "moderate", "extreme"] }
    ],
    religion: [
      { label: "Pantheon Selection", key: "religionPantheon", type: "select", options: ["full", "curated", "custom"] },
      { label: "Divine Intervention Frequency", key: "divineFrequency", type: "select", options: ["rare", "occasional", "common"] }
    ],
    hexcrawl: [
      { label: "Encounter Frequency", key: "encounterFrequency", type: "select", options: ["rare", "normal", "frequent"] },
      { label: "Travel Difficulty", key: "travelDifficulty", type: "select", options: ["easy", "normal", "hard"] }
    ],
    questBoard: [
      { label: "Quest Generation Rate", key: "questGenRate", type: "select", options: ["few", "moderate", "many"] },
      { label: "Auto-Expire Quests", key: "questAutoExpire", type: "toggle" }
    ],
    downtime: [
      { label: "Gold Multiplier", key: "downtimeGoldMultiplier", type: "select", options: ["0.5x", "1x", "1.5x", "2x"] },
      { label: "Risk Level", key: "downtimeRisk", type: "select", options: ["safe", "moderate", "dangerous"] }
    ]
  };

  const systems = [
    { key: "livingWorld", name: "Core Living World Engine", desc: "Base event system, faction politics, territory changes", icon: "⚔" },
    { key: "economy", name: "Regional Economy", desc: "Trade goods, market prices, faction treasuries, trade routes", icon: "⚖", requires: "livingWorld" },
    { key: "calendar", name: "Seasons & Calendar", desc: "Fantasy calendar, weather, seasonal effects", icon: "☾" },
    { key: "religion", name: "Religion & Divine Influence", desc: "Pantheon, temples, divine favor, blessings/curses", icon: "✠", requires: "calendar" },
    { key: "hexcrawl", name: "Wilderness Exploration", desc: "Hex crawl travel between cities, encounters, foraging", icon: "☆" },
    { key: "questBoard", name: "Dynamic Quest Board", desc: "Procedural quest generation based on world state", icon: "⸎", requires: "livingWorld" },
    { key: "downtime", name: "Downtime Activities", desc: "Between-session crafting, training, carousing etc.", icon: "⌂" },
    { key: "homebrew", name: "Homebrew Workshop", desc: "Custom monsters, items, spells, NPCs", icon: "⚗" },
    { key: "factionWar", name: "Faction War Simulator", desc: "Risk + Total War-style strategic warfare between campaign factions", icon: "⚐", requires: "factionTracker" },
    { key: "prophecy", name: "Prophecy Engine & Religion", desc: "Deity pantheon, divine favor, prophecy creation & fulfillment, blessings/curses", icon: "☽", requires: "religion" },
    // Plague standalone removed — integrated into Living World Atlas events
    { key: "heist", name: "Heist Planner", desc: "Blueprint planning, crew roles, heat system, complication generator", icon: "⚷" },
    { key: "intrigue", name: "Court Intrigue", desc: "Shadow conspiracy web, agent tracking, clue system (Cult of Kosmos style)", icon: "◈" },
    { key: "puzzles", name: "Puzzle Workshop", desc: "20+ puzzle templates, cipher wheels, grid puzzles, hint system, interactive components", icon: "⊞" },
    { key: "scheduler", name: "Session Scheduler", desc: "Player availability, session planning", icon: "⊛" }
  ];

  return (
    <div style={{ padding: "2rem", background: T.bg, minHeight: "100vh" }}>
      {/* Section 1: Campaign Info */}
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ color: T.gold, fontSize: "1.5rem", marginBottom: "1.5rem", borderBottom: `2px solid ${T.border}`, paddingBottom: "0.75rem" }}>
          Campaign Information
        </h2>

        <div style={{ background: T.bgCard, padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "1rem" }}>
            <div style={{ color: T.text, fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>
              Campaign Name
            </div>
            <input
              type="text"
              value={data.campaignName || ""}
              onChange={handleCampaignNameChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: T.bg,
                border: `1px solid ${T.border}`,
                color: T.text,
                borderRadius: "4px",
                fontFamily: T.body,
                fontSize: "0.95rem",
                boxSizing: "border-box"
              }}
              placeholder="Enter campaign name..."
            />
          </label>

          <label style={{ display: "block", marginBottom: "1rem" }}>
            <div style={{ color: T.text, fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>
              Campaign Description
            </div>
            <textarea
              value={data.campaignDescription || ""}
              onChange={handleCampaignDescChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                background: T.bg,
                border: `1px solid ${T.border}`,
                color: T.text,
                borderRadius: "4px",
                fontFamily: T.body,
                fontSize: "0.95rem",
                minHeight: "100px",
                boxSizing: "border-box",
                resize: "vertical"
              }}
              placeholder="Describe your campaign..."
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
            <label>
              <div style={{ color: T.text, fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                Campaign Type
              </div>
              <select
                value={data.campaignType || "homebrew"}
                onChange={handleCampaignTypeChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: T.bg,
                  border: `1px solid ${T.border}`,
                  color: T.text,
                  borderRadius: "4px",
                  fontFamily: T.body,
                  fontSize: "0.95rem"
                }}
              >
                <option value="homebrew">Homebrew</option>
                <option value="module">Published Module</option>
                <option value="one-shot">One-Shot</option>
              </select>
            </label>

            <label>
              <div style={{ color: T.text, fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                Start Date
              </div>
              <input
                type="date"
                value={data.campaignStartDate || ""}
                onChange={handleStartDateChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: T.bg,
                  border: `1px solid ${T.border}`,
                  color: T.text,
                  borderRadius: "4px",
                  fontFamily: T.body,
                  fontSize: "0.95rem"
                }}
              />
            </label>

            <label>
              <div style={{ color: T.text, fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                Status
              </div>
              <select
                value={data.campaignStatus || "active"}
                onChange={handleStatusChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: T.bg,
                  border: `1px solid ${T.border}`,
                  color: T.text,
                  borderRadius: "4px",
                  fontFamily: T.body,
                  fontSize: "0.95rem"
                }}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Section 2: Living World Systems */}
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ color: T.gold, fontSize: "1.5rem", marginBottom: "0.5rem", borderBottom: `2px solid ${T.border}`, paddingBottom: "0.75rem" }}>
          Living World Modules
        </h2>
        <p style={{ color: T.textMuted, fontSize: "0.95rem", marginBottom: "1.5rem" }}>
          Choose which simulation systems run during your live campaign
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.25rem" }}>
          {systems.map(system => {
            const isEnabled = data.modules[system.key];
            const isDisabled = !canEnableModule(system.key);
            const requiredSystem = isModuleRequired(system.key);

            return (
              <div
                key={system.key}
                style={{
                  background: T.bgCard,
                  border: `1px solid ${isDisabled ? T.border : isEnabled ? T.gold : T.border}`,
                  borderRadius: "8px",
                  padding: "1.25rem",
                  opacity: isDisabled ? 0.6 : 1,
                  transition: "all 0.2s ease",
                  pointerEvents: isDisabled ? "none" : "auto"
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem" }}>
                  <div
                    onClick={() => !isDisabled && updateModule(system.key, !isEnabled)}
                    style={{
                      width: "40px",
                      height: "24px",
                      background: isEnabled ? T.gold : T.border,
                      borderRadius: "12px",
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      padding: "2px",
                      flexShrink: 0,
                      transition: "background 0.2s ease"
                    }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        background: T.bg,
                        borderRadius: "10px",
                        transition: "transform 0.2s ease",
                        transform: isEnabled ? "translateX(16px)" : "translateX(0)"
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                      <span style={{ fontSize: "1.25rem" }}>{system.icon}</span>
                      <h3 style={{ color: T.text, fontSize: "1.05rem", margin: 0, fontWeight: "600" }}>
                        {system.name}
                      </h3>
                    </div>
                    <p style={{ color: T.textMuted, fontSize: "0.9rem", margin: "0.5rem 0 0 0" }}>
                      {system.desc}
                    </p>

                    {requiredSystem && (
                      <div style={{ color: T.textFaint, fontSize: "0.85rem", marginTop: "0.5rem", fontStyle: "italic" }}>
                        Requires: <span style={{ color: T.crimson }}>{systems.find(s => s.key === requiredSystem)?.name}</span>
                      </div>
                    )}

                    {isDisabled && requiredSystem && (
                      <div style={{ color: T.crimson, fontSize: "0.85rem", marginTop: "0.5rem", fontWeight: "500" }}>
                        ⚠ Enable {systems.find(s => s.key === requiredSystem)?.name} first
                      </div>
                    )}
                  </div>
                </div>

                {isEnabled && systemConfigs[system.key] && (
                  <div style={{
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    borderTop: `1px solid ${T.border}`,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem"
                  }}>
                    {systemConfigs[system.key].map(config => (
                      <div key={config.key}>
                        <label style={{ display: "block" }}>
                          <div style={{ color: T.text, fontSize: "0.8rem", fontWeight: "600", marginBottom: "0.4rem" }}>
                            {config.label}
                          </div>
                          {config.type === "select" && (
                            <div>
                              <select
                                value={(data.modules[config.key] || config.options[0]) === "Custom" || (config.options.includes("Custom") && !config.options.includes(data.modules[config.key]) && data.modules[config.key]) ? "Custom" : (data.modules[config.key] || config.options[0])}
                                onChange={(e) => updateModuleConfig(config.key, e.target.value)}
                                style={{
                                  width: "100%",
                                  padding: "0.5rem",
                                  background: T.bg,
                                  border: `1px solid ${T.border}`,
                                  color: T.text,
                                  borderRadius: "4px",
                                  fontFamily: T.body,
                                  fontSize: "0.85rem"
                                }}
                              >
                                {config.options.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                              {config.options.includes("Custom") && ((data.modules[config.key] || "") === "Custom" || (!config.options.slice(0, -1).includes(data.modules[config.key]) && data.modules[config.key] && data.modules[config.key] !== config.options[0])) && (
                                <div style={{ marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                  <input
                                    type="number"
                                    min="10"
                                    max="3600"
                                    placeholder="seconds"
                                    value={data.modules[config.key + "Custom"] || ""}
                                    onChange={(e) => updateModuleConfig(config.key + "Custom", parseInt(e.target.value) || "")}
                                    style={{
                                      flex: 1,
                                      padding: "0.5rem",
                                      background: T.bg,
                                      border: `1px solid ${T.border}`,
                                      color: T.text,
                                      borderRadius: "4px",
                                      fontFamily: T.body,
                                      fontSize: "0.85rem"
                                    }}
                                  />
                                  <span style={{ fontSize: "0.8rem", color: T.textMuted }}>seconds</span>
                                </div>
                              )}
                            </div>
                          )}
                          {config.type === "number" && (
                            <input
                              type="number"
                              value={data.modules[config.key] || 1042}
                              onChange={(e) => updateModuleConfig(config.key, parseInt(e.target.value))}
                              style={{
                                width: "100%",
                                padding: "0.5rem",
                                background: T.bg,
                                border: `1px solid ${T.border}`,
                                color: T.text,
                                borderRadius: "4px",
                                fontFamily: T.body,
                                fontSize: "0.85rem"
                              }}
                            />
                          )}
                          {config.type === "toggle" && (
                            <div
                              onClick={() => updateModuleConfig(config.key, !data.modules[config.key])}
                              style={{
                                width: "40px",
                                height: "24px",
                                background: data.modules[config.key] ? T.gold : T.border,
                                borderRadius: "12px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                padding: "2px",
                                transition: "background 0.2s ease"
                              }}
                            >
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  background: T.bg,
                                  borderRadius: "10px",
                                  transition: "transform 0.2s ease",
                                  transform: data.modules[config.key] ? "translateX(16px)" : "translateX(0)"
                                }}
                              />
                            </div>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Player Visibility */}
      <div style={{ marginBottom: "3rem" }}>
        <h2 style={{ color: T.gold, fontSize: "1.5rem", marginBottom: "1.5rem", borderBottom: `2px solid ${T.border}`, paddingBottom: "0.75rem" }}>
          Player Visibility
        </h2>

        <div style={{ background: T.bgCard, padding: "1.5rem", borderRadius: "8px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {[
            { key: "playerWorldMap", label: "Can players see the World Map?" },
            { key: "playerFactions", label: "Can players see Faction info?" },
            { key: "playerEconomy", label: "Can players see Economy data?" },
            { key: "playerQuests", label: "Can players see the Quest Board?" },
            { key: "playerRelationships", label: "Can players see the Relationship Web?" }
          ].map(visibility => (
            <div key={visibility.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <label style={{ color: T.text, fontSize: "0.95rem", fontWeight: "500", margin: 0 }}>
                {visibility.label}
              </label>
              <div
                onClick={() => updateModule(visibility.key, !data.modules[visibility.key])}
                style={{
                  width: "40px",
                  height: "24px",
                  background: data.modules[visibility.key] ? T.gold : T.border,
                  borderRadius: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "2px",
                  transition: "background 0.2s ease",
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    background: T.bg,
                    borderRadius: "10px",
                    transition: "transform 0.2s ease",
                    transform: data.modules[visibility.key] ? "translateX(16px)" : "translateX(0)"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Danger Zone */}
      <div>
        <h2 style={{ color: T.crimson, fontSize: "1.5rem", marginBottom: "1.5rem", borderBottom: `2px solid ${T.crimsonBorder}`, paddingBottom: "0.75rem" }}>
          Danger Zone
        </h2>

        <div style={{ background: T.bgCard, border: `2px solid ${T.crimsonBorder}`, padding: "1.5rem", borderRadius: "8px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <button
            onClick={handleResetWorld}
            style={{
              padding: "0.75rem 1rem",
              background: T.crimson,
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontFamily: T.ui,
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "opacity 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.opacity = "0.8"}
            onMouseOut={(e) => e.target.style.opacity = "1"}
          >
            Reset Living World
          </button>

          <button
            onClick={handleExport}
            style={{
              padding: "0.75rem 1rem",
              background: T.gold,
              color: T.bg,
              border: "none",
              borderRadius: "4px",
              fontFamily: T.ui,
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "opacity 0.2s ease"
            }}
            onMouseOver={(e) => e.target.style.opacity = "0.8"}
            onMouseOut={(e) => e.target.style.opacity = "1"}
          >
            Export Campaign Data
          </button>

          <label style={{ position: "relative", cursor: "pointer" }}>
            <button
              style={{
                padding: "0.75rem 1rem",
                background: T.gold,
                color: T.bg,
                border: "none",
                borderRadius: "4px",
                fontFamily: T.ui,
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
                width: "100%"
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = "0.8"}
              onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
            >
              Import Campaign Data
            </button>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>
    </div>
  );
};
