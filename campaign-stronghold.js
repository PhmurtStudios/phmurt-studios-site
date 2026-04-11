/* ═══════════════════════════════════════════════════════════════════════════
   STRONGHOLD & DOMAIN MANAGEMENT — D&D Campaign Stronghold Builder
   Manages strongholds, buildings, domain resources, construction queues,
   and domain events for party-owned fortifications, temples, and lairs.
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  const { useState, useEffect, useRef, useCallback } = React;
  const {
    Home, Hammer, Shield, Coins, Users, TrendingUp, AlertTriangle,
    Plus, Trash2, Edit2, Check, Clock, Zap, MapPin, Award, BarChart3
  } = window.LucideReact || {};

  const T = window.__PHMURT_THEME || {
    bg: "var(--bg)", bgNav: "var(--bg-nav)", bgCard: "var(--bg-card)",
    bgHover: "var(--bg-hover)", text: "var(--text)", textDim: "var(--text-dim)",
    crimson: "var(--crimson)", gold: "var(--gold)", border: "var(--border)",
    ui: "'Cinzel', serif", heading: "'Cinzel', serif", body: "'Spectral', Georgia, serif"
  };

  // ─────────────────────────────────────────────────────────────────────────
  // STRONGHOLD & BUILDING CATALOGS
  // ─────────────────────────────────────────────────────────────────────────

  const STRONGHOLD_TYPES = {
    keep: {
      name: "Keep",
      desc: "A fortified castle commanding the landscape",
      baseCost: 5000,
      buildDays: 120,
      maxBuildings: 8,
      icon: "◆"
    },
    tower: {
      name: "Wizard's Tower",
      desc: "A tower of arcane study and magical research",
      baseCost: 3000,
      buildDays: 60,
      maxBuildings: 4,
      icon: "✦"
    },
    temple: {
      name: "Temple",
      desc: "A holy sanctuary devoted to a deity",
      baseCost: 4000,
      buildDays: 90,
      maxBuildings: 6,
      icon: "✦"
    },
    guildHall: {
      name: "Guild Hall",
      desc: "A center of commerce and craft trade",
      baseCost: 3500,
      buildDays: 75,
      maxBuildings: 6,
      icon: "◆"
    },
    grove: {
      name: "Druid's Grove",
      desc: "A sacred natural sanctuary of forest and stone",
      baseCost: 2000,
      buildDays: 45,
      maxBuildings: 5,
      icon: "⊕"
    },
    hideout: {
      name: "Thieves' Den",
      desc: "A hidden underground lair for discrete operations",
      baseCost: 2500,
      buildDays: 30,
      maxBuildings: 5,
      icon: "◆"
    }
  };

  const BUILDING_TYPES = {
    barracks: {
      name: "Barracks",
      cost: 500,
      buildDays: 14,
      defense: 2,
      workers: 5,
      income: 0,
      desc: "Houses guards and soldiers",
      category: "military",
      icon: "⚔"
    },
    smithy: {
      name: "Smithy",
      cost: 750,
      buildDays: 21,
      defense: 0,
      workers: 3,
      income: 15,
      desc: "Produces weapons and armor",
      category: "economic",
      icon: "⚒"
    },
    library: {
      name: "Library",
      cost: 600,
      buildDays: 18,
      defense: 0,
      workers: 2,
      income: 5,
      desc: "Research and arcane study",
      category: "utility",
      icon: "◆"
    },
    farm: {
      name: "Farm",
      cost: 200,
      buildDays: 7,
      defense: 0,
      workers: 4,
      income: 10,
      desc: "Produces food for the domain",
      category: "economic",
      icon: "⚌"
    },
    market: {
      name: "Market",
      cost: 800,
      buildDays: 21,
      defense: 0,
      workers: 6,
      income: 25,
      desc: "Trade hub generating gold",
      category: "economic",
      icon: "◬"
    },
    wall: {
      name: "Stone Wall",
      cost: 1000,
      buildDays: 30,
      defense: 5,
      workers: 0,
      income: 0,
      desc: "Fortifies the stronghold",
      category: "military",
      icon: "⬚"
    },
    chapel: {
      name: "Chapel",
      cost: 400,
      buildDays: 14,
      defense: 0,
      workers: 1,
      income: 5,
      desc: "Provides healing and morale",
      category: "morale",
      icon: "✝"
    },
    tavern: {
      name: "Tavern",
      cost: 350,
      buildDays: 10,
      defense: 0,
      workers: 3,
      income: 12,
      desc: "Boosts morale and attracts visitors",
      category: "morale",
      icon: "⌀"
    },
    stable: {
      name: "Stable",
      cost: 300,
      buildDays: 10,
      defense: 0,
      workers: 2,
      income: 8,
      desc: "Houses mounts and beasts of burden",
      category: "economic",
      icon: "◇"
    },
    alchemyLab: {
      name: "Alchemy Lab",
      cost: 900,
      buildDays: 25,
      defense: 0,
      workers: 2,
      income: 20,
      desc: "Produces potions and reagents",
      category: "economic",
      icon: "⊕"
    },
    prison: {
      name: "Prison",
      cost: 600,
      buildDays: 18,
      defense: 1,
      workers: 3,
      income: 0,
      desc: "Holds captives and deters crime",
      category: "military",
      icon: "⬚"
    },
    watchtower: {
      name: "Watchtower",
      cost: 400,
      buildDays: 12,
      defense: 3,
      workers: 2,
      income: 0,
      desc: "Early warning against threats",
      category: "military",
      icon: "▲"
    },
    garden: {
      name: "Enchanted Garden",
      cost: 500,
      buildDays: 14,
      defense: 0,
      workers: 2,
      income: 8,
      desc: "Grows rare herbs and components",
      category: "economic",
      icon: "⊕"
    },
    treasury: {
      name: "Treasury",
      cost: 1200,
      buildDays: 28,
      defense: 2,
      workers: 2,
      income: 0,
      desc: "Secures gold and valuables",
      category: "utility",
      icon: "◆"
    },
    trainingGrounds: {
      name: "Training Grounds",
      cost: 700,
      buildDays: 18,
      defense: 1,
      workers: 4,
      income: 0,
      desc: "Trains militia and improves defense",
      category: "military",
      icon: "⚔"
    }
  };

  const DOMAIN_EVENTS = [
    {
      id: "bandit_raid",
      name: "Bandit Raid",
      type: "threat",
      defenseCheck: 8,
      desc: "Bandits attack the stronghold seeking plunder",
      successReward: "50gp bounty",
      failurePenalty: "Lose 100gp, -5 morale"
    },
    {
      id: "merchant_caravan",
      name: "Merchant Caravan",
      type: "opportunity",
      desc: "A caravan seeks shelter and trade",
      reward: "+75gp, +3 morale"
    },
    {
      id: "festival",
      name: "Harvest Festival",
      type: "event",
      desc: "The people celebrate the season",
      effect: "+10 morale, -25gp cost"
    },
    {
      id: "plague",
      name: "Plague Outbreak",
      type: "threat",
      defenseCheck: 12,
      desc: "Disease spreads through the domain",
      failurePenalty: "-15 morale, -2 workers"
    },
    {
      id: "refugees",
      name: "Refugees Arrive",
      type: "opportunity",
      desc: "Displaced people seek haven",
      effect: "+5 population, +2 morale"
    },
    {
      id: "dragon_sighting",
      name: "Dragon Sighting",
      type: "threat",
      defenseCheck: 15,
      desc: "A dragon circles the stronghold",
      failurePenalty: "Building destroyed, -20 morale"
    },
    {
      id: "tax_revolt",
      name: "Tax Revolt",
      type: "threat",
      defenseCheck: 6,
      desc: "Citizens protest taxes",
      failurePenalty: "-20 morale, -50gp"
    },
    {
      id: "visiting_noble",
      name: "Visiting Noble",
      type: "opportunity",
      desc: "A noble seeks alliance",
      reward: "+100gp, political favor"
    },
    {
      id: "mine_discovery",
      name: "Mine Discovery",
      type: "opportunity",
      desc: "Miners find precious ore",
      reward: "+200gp, new resource"
    },
    {
      id: "earthquake",
      name: "Earthquake",
      type: "threat",
      defenseCheck: 10,
      desc: "The ground shakes beneath the stronghold",
      failurePenalty: "Random building damaged"
    }
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // STYLES & THEME
  // ─────────────────────────────────────────────────────────────────────────

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: T.bg,
      color: T.text,
      fontFamily: T.body,
      overflow: 'hidden'
    },
    header: {
      padding: '20px',
      borderBottom: `1px solid ${T.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: T.bgCard
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      fontFamily: T.heading,
      color: T.gold,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    content: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      backgroundColor: T.bg
    },
    section: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: T.gold,
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontFamily: T.heading
    },
    statsBar: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '12px',
      marginBottom: '16px'
    },
    statCard: {
      backgroundColor: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: '6px',
      padding: '12px',
      textAlign: 'center'
    },
    statLabel: {
      fontSize: '12px',
      color: T.textDim,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '4px'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: T.gold
    },
    strongholdList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '16px'
    },
    strongholdCard: {
      backgroundColor: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: '8px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': { borderColor: T.gold, boxShadow: `0 0 12px ${T.gold}40` }
    },
    buildingGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '12px',
      marginBottom: '16px'
    },
    buildingTile: (category) => {
      const colors = {
        military: '#c94f3f',
        economic: '#d4af37',
        utility: '#4a90e2',
        morale: '#7cb342'
      };
      return {
        backgroundColor: colors[category] || T.bgCard,
        border: `1px solid ${T.border}`,
        borderRadius: '6px',
        padding: '12px',
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: '600',
        color: T.bg,
        cursor: 'pointer'
      };
    },
    button: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: `1px solid ${T.crimson}`,
      backgroundColor: T.crimson,
      color: T.bg,
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s'
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      color: T.gold,
      borderColor: T.gold
    },
    input: {
      padding: '8px 12px',
      borderRadius: '4px',
      border: `1px solid ${T.border}`,
      backgroundColor: T.bg,
      color: T.text,
      fontSize: '14px',
      fontFamily: 'inherit'
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      color: T.textDim,
      marginBottom: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    card: {
      backgroundColor: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: T.textDim
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // DOMAIN OVERVIEW PANEL
  // ─────────────────────────────────────────────────────────────────────────

  function DomainOverview({ data, setData, viewRole, onSelectDomain }) {
    const strongholds = data.strongholds?.domains || {};
    const allDomains = Object.values(strongholds);

    const totalTreasury = allDomains.reduce((sum, d) => sum + (d.treasury || 0), 0);
    const totalPopulation = allDomains.reduce((sum, d) => sum + (d.population || 0), 0);
    const avgMorale = allDomains.length > 0
      ? Math.round(allDomains.reduce((sum, d) => sum + (d.morale || 50), 0) / allDomains.length)
      : 50;
    const totalDefense = allDomains.reduce((sum, d) => {
      const buildings = d.buildings || [];
      return sum + buildings.reduce((s, b) => s + (BUILDING_TYPES[b.type]?.defense || 0), 0);
    }, 0);
    const totalIncome = allDomains.reduce((sum, d) => {
      const buildings = d.buildings || [];
      return sum + buildings.reduce((s, b) => s + (BUILDING_TYPES[b.type]?.income || 0), 0);
    }, 0);

    return React.createElement('div', { style: styles.section },
      React.createElement('h3', { style: styles.sectionTitle },
        Home && React.createElement(Home, { size: 18 }),
        'Domain Overview'
      ),
      React.createElement('div', { style: styles.statsBar },
        React.createElement('div', { style: styles.statCard },
          React.createElement('div', { style: styles.statLabel }, 'Treasury'),
          React.createElement('div', { style: styles.statValue }, totalTreasury + ' gp')
        ),
        React.createElement('div', { style: styles.statCard },
          React.createElement('div', { style: styles.statLabel }, 'Population'),
          React.createElement('div', { style: styles.statValue }, totalPopulation)
        ),
        React.createElement('div', { style: styles.statCard },
          React.createElement('div', { style: styles.statLabel }, 'Morale'),
          React.createElement('div', { style: styles.statValue }, avgMorale + '%')
        ),
        React.createElement('div', { style: styles.statCard },
          React.createElement('div', { style: styles.statLabel }, 'Defense'),
          React.createElement('div', { style: styles.statValue }, totalDefense)
        ),
        React.createElement('div', { style: styles.statCard },
          React.createElement('div', { style: styles.statLabel }, 'Weekly Income'),
          React.createElement('div', { style: styles.statValue }, totalIncome + ' gp')
        )
      ),
      allDomains.length === 0
        ? React.createElement('div', { style: styles.emptyState },
            'No strongholds yet. Create one to begin!'
          )
        : React.createElement('div', { style: styles.strongholdList },
            allDomains.map(domain =>
              React.createElement('div', {
                key: domain.id,
                style: styles.strongholdCard,
                onClick: () => onSelectDomain(domain.id)
              },
                React.createElement('h4', { style: { margin: '0 0 8px 0', color: T.gold } }, domain.name),
                React.createElement('p', { style: { margin: '4px 0', fontSize: '12px', color: T.textDim } },
                  'Type: ' + (STRONGHOLD_TYPES[domain.type]?.name || domain.type)
                ),
                React.createElement('p', { style: { margin: '4px 0', fontSize: '12px', color: T.textDim } },
                  'Treasury: ' + domain.treasury + ' gp'
                ),
                React.createElement('p', { style: { margin: '4px 0', fontSize: '12px', color: T.textDim } },
                  'Buildings: ' + (domain.buildings?.length || 0) + '/' + (STRONGHOLD_TYPES[domain.type]?.maxBuildings || 8)
                )
              )
            )
          )
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STRONGHOLD DETAIL VIEW
  // ─────────────────────────────────────────────────────────────────────────

  function StrongholdDetail({ domain, onUpdate, onBack }) {
    const [showBuildMenu, setShowBuildMenu] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    if (!domain) return null;

    const type = STRONGHOLD_TYPES[domain.type];
    const buildings = domain.buildings || [];
    const constructionQueue = domain.constructionQueue || [];

    const handleAddBuilding = (buildingType) => {
      const buildingData = BUILDING_TYPES[buildingType];
      if (!buildingData) return;

      if (buildings.length >= type.maxBuildings) {
        return;
      }

      const updated = { ...domain };
      if (!updated.constructionQueue) updated.constructionQueue = [];

      updated.constructionQueue.push({
        id: Date.now(),
        buildingType,
        daysRemaining: buildingData.buildDays,
        startedWeek: domain.weekNumber || 0,
        cost: buildingData.cost
      });
      updated.treasury = (updated.treasury || 0) - buildingData.cost;

      onUpdate(updated);
      setShowBuildMenu(false);
    };

    const handleRemoveBuilding = (index) => {
      const updated = { ...domain };
      updated.buildings = updated.buildings.filter((_, i) => i !== index);
      onUpdate(updated);
    };

    const handleAdvanceWeek = () => {
      const updated = { ...domain };

      // Collect income
      const incomeThisWeek = buildings.reduce((sum, b) => sum + (BUILDING_TYPES[b.type]?.income || 0), 0);
      updated.treasury = (updated.treasury || 0) + incomeThisWeek;

      // Progress construction
      const newQueue = [];
      if (updated.constructionQueue && updated.constructionQueue.length > 0) {
        updated.constructionQueue.forEach(item => {
          item.daysRemaining -= 7;
          if (item.daysRemaining <= 0) {
            // Add completed building
            if (!updated.buildings) updated.buildings = [];
            updated.buildings.push({
              id: item.id,
              type: item.buildingType,
              completed: true
            });
          } else {
            newQueue.push(item);
          }
        });
        updated.constructionQueue = newQueue;
      }

      // Random event (30% chance)
      if (Math.random() < 0.3) {
        const event = DOMAIN_EVENTS[Math.floor(Math.random() * DOMAIN_EVENTS.length)];
        if (!updated.eventLog) updated.eventLog = [];
        updated.eventLog.push({
          week: (updated.weekNumber || 0) + 1,
          event: event.name,
          outcome: 'triggered',
          timestamp: Date.now()
        });

        // Apply event effects
        if (event.type === 'opportunity' && event.reward) {
          updated.treasury += 50; // Simplified reward
          updated.morale = Math.min(100, (updated.morale || 50) + 3);
        } else if (event.type === 'threat') {
          updated.morale = Math.max(0, (updated.morale || 50) - 5);
        }
      }

      // Morale drift toward 50
      updated.morale = updated.morale || 50;
      if (updated.morale < 50) {
        updated.morale = Math.min(50, updated.morale + 2);
      } else if (updated.morale > 50) {
        updated.morale = Math.max(50, updated.morale - 2);
      }

      // Slow population growth
      updated.population = Math.floor((updated.population || 100) * 1.01);

      updated.weekNumber = (updated.weekNumber || 0) + 1;

      onUpdate(updated);
    };

    return React.createElement('div', { style: { ...styles.section, borderLeft: `4px solid ${T.gold}`, paddingLeft: '12px' } },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } },
        React.createElement('h3', { style: styles.sectionTitle },
          'View: ' + domain.name
        ),
        React.createElement('button', {
          style: { ...styles.button, ...styles.buttonSecondary },
          onClick: onBack
        }, '← Back')
      ),

      // Info panel
      React.createElement('div', { style: styles.card },
        React.createElement('p', { style: { margin: '4px 0', fontSize: '12px' } },
          'Type: ' + type.name + ' | Location: ' + domain.location
        ),
        React.createElement('p', { style: { margin: '4px 0', fontSize: '12px' } },
          'Tier ' + domain.tier + ' | Treasury: ' + domain.treasury + ' gp | Population: ' + domain.population
        ),
        React.createElement('p', { style: { margin: '4px 0', fontSize: '12px', color: domain.morale > 60 ? '#7cb342' : domain.morale > 40 ? T.gold : '#c94f3f' } },
          'Morale: ' + domain.morale + '%'
        )
      ),

      // Buildings
      React.createElement('h4', { style: styles.sectionTitle }, '⚔ Buildings (' + buildings.length + '/' + type.maxBuildings + ')'),
      React.createElement('div', { style: styles.buildingGrid },
        buildings.map((b, idx) => {
          const bdata = BUILDING_TYPES[b.type];
          return React.createElement('div', {
            key: idx,
            style: { ...styles.buildingTile(bdata?.category), position: 'relative' },
            title: bdata?.desc
          },
            React.createElement('div', { style: { fontSize: '14px', marginBottom: '4px' } }, bdata?.icon || '⬚'),
            React.createElement('div', { style: { fontSize: '11px', fontWeight: '700' } }, bdata?.name),
            React.createElement('button', {
              style: { position: 'absolute', top: '2px', right: '2px', padding: '2px 4px', fontSize: '10px', background: 'rgba(0,0,0,0.3)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '2px' },
              onClick: () => handleRemoveBuilding(idx)
            }, 'X')
          );
        })
      ),

      // Build menu
      React.createElement('div', { style: { marginBottom: '16px' } },
        showBuildMenu
          ? React.createElement('div', { style: { ...styles.card, maxHeight: '300px', overflowY: 'auto' } },
              React.createElement('h4', { style: { margin: '0 0 12px 0', color: T.gold } }, 'Available Buildings'),
              Object.entries(BUILDING_TYPES).map(([key, building]) =>
                React.createElement('div', {
                  key: key,
                  style: { ...styles.card, marginBottom: '8px', padding: '12px', cursor: 'pointer', backgroundColor: T.bgHover },
                  onClick: () => handleAddBuilding(key)
                },
                  React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold', marginBottom: '4px' } },
                    building.icon + ' ' + building.name
                  ),
                  React.createElement('div', { style: { fontSize: '11px', color: T.textDim, marginBottom: '4px' } },
                    building.desc
                  ),
                  React.createElement('div', { style: { fontSize: '10px', color: T.gold } },
                    building.cost + ' gp | ' + building.buildDays + ' days | +' + building.income + ' gp/week'
                  )
                )
              )
            )
          : React.createElement('button', {
              style: styles.button,
              onClick: () => setShowBuildMenu(true)
            },
            Plus && React.createElement(Plus, { size: 16 }),
            'Build New Building'
          )
      ),

      // Construction queue
      constructionQueue.length > 0 && React.createElement('div', { style: styles.section },
        React.createElement('h4', { style: styles.sectionTitle }, '⏱ Under Construction'),
        constructionQueue.map(item =>
          React.createElement('div', { key: item.id, style: styles.card },
            React.createElement('div', { style: { fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' } },
              BUILDING_TYPES[item.buildingType]?.name || item.buildingType
            ),
            React.createElement('div', { style: { fontSize: '11px', color: T.textDim } },
              item.daysRemaining + ' days remaining'
            )
          )
        )
      ),

      // Event log
      domain.eventLog && domain.eventLog.length > 0 && React.createElement('div', { style: styles.section },
        React.createElement('h4', { style: styles.sectionTitle }, '📜 Event Log (Last 5)'),
        domain.eventLog.slice(-5).reverse().map((entry, idx) =>
          React.createElement('div', { key: idx, style: styles.card },
            React.createElement('div', { style: { fontSize: '12px', fontWeight: 'bold', color: T.gold } },
              'Week ' + entry.week + ': ' + entry.event
            ),
            React.createElement('div', { style: { fontSize: '11px', color: T.textDim } },
              new Date(entry.timestamp).toLocaleDateString()
            )
          )
        )
      ),

      // Advance week button
      React.createElement('button', {
        style: { ...styles.button, marginTop: '16px', backgroundColor: T.gold, color: T.bg },
        onClick: handleAdvanceWeek
      },
        Zap && React.createElement(Zap, { size: 16 }),
        'Advance 1 Week'
      )
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NEW STRONGHOLD CREATION
  // ─────────────────────────────────────────────────────────────────────────

  function CreateStrongholdPanel({ data, setData, partyMembers, onClose }) {
    const [form, setForm] = useState({
      name: 'New Stronghold',
      type: 'keep',
      owner: partyMembers[0]?.id || '',
      location: ''
    });

    const handleCreate = () => {
      if (!form.name || !form.location) {
        return;
      }

      const updated = { ...data };
      if (!updated.strongholds) updated.strongholds = {};
      if (!updated.strongholds.domains) updated.strongholds.domains = {};

      const newDomain = {
        id: Date.now().toString(),
        name: form.name,
        type: form.type,
        owner: form.owner,
        location: form.location,
        tier: 1,
        treasury: 0,
        population: 100,
        morale: 50,
        workers: 10,
        buildings: [],
        constructionQueue: [],
        eventLog: [],
        weekNumber: 0
      };

      updated.strongholds.domains[newDomain.id] = newDomain;
      setData(updated);
      onClose();
    };

    return React.createElement('div', { style: styles.card },
      React.createElement('h4', { style: { ...styles.sectionTitle, margin: '0 0 12px 0' } },
        'Create New Stronghold'
      ),
      React.createElement('div', { style: { marginBottom: '12px' } },
        React.createElement('label', { style: styles.label }, 'Stronghold Name'),
        React.createElement('input', {
          type: 'text',
          style: styles.input,
          value: form.name,
          onChange: (e) => setForm({ ...form, name: e.target.value })
        })
      ),
      React.createElement('div', { style: { marginBottom: '12px' } },
        React.createElement('label', { style: styles.label }, 'Type'),
        React.createElement('select', {
          style: { ...styles.input, width: '100%' },
          value: form.type,
          onChange: (e) => setForm({ ...form, type: e.target.value })
        },
          Object.entries(STRONGHOLD_TYPES).map(([key, type]) =>
            React.createElement('option', { key, value: key }, type.name)
          )
        )
      ),
      React.createElement('div', { style: { marginBottom: '12px' } },
        React.createElement('label', { style: styles.label }, 'Owner'),
        React.createElement('select', {
          style: { ...styles.input, width: '100%' },
          value: form.owner,
          onChange: (e) => setForm({ ...form, owner: e.target.value })
        },
          partyMembers.map(member =>
            React.createElement('option', { key: member.id, value: member.id }, member.name || 'Unknown')
          )
        )
      ),
      React.createElement('div', { style: { marginBottom: '12px' } },
        React.createElement('label', { style: styles.label }, 'Location'),
        React.createElement('input', {
          type: 'text',
          style: styles.input,
          placeholder: 'e.g., The Misty Hills',
          value: form.location,
          onChange: (e) => setForm({ ...form, location: e.target.value })
        })
      ),
      React.createElement('div', { style: { display: 'flex', gap: '8px' } },
        React.createElement('button', {
          style: styles.button,
          onClick: handleCreate
        }, 'Create'),
        React.createElement('button', {
          style: { ...styles.button, ...styles.buttonSecondary },
          onClick: onClose
        }, 'Cancel')
      )
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN COMPONENT
  // ─────────────────────────────────────────────────────────────────────────

  function StrongholdView({ data, setData, viewRole }) {
    const [selectedDomainId, setSelectedDomainId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const debounceTimer = useRef(null);

    const strongholds = data.strongholds || {};
    const domains = strongholds.domains || {};
    const selectedDomain = selectedDomainId ? domains[selectedDomainId] : null;
    const partyMembers = data.party || [];

    const handleDomainUpdate = useCallback((updated) => {
      setData(prev => ({
        ...prev,
        strongholds: {
          ...prev.strongholds,
          domains: {
            ...prev.strongholds.domains,
            [updated.id]: updated
          }
        }
      }));
    }, [setData]);

    // Auto-save with debounce
    useEffect(() => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        // Data already saved via setData
      }, 500);

      return () => clearTimeout(debounceTimer.current);
    }, [data]);

    return React.createElement('div', { style: styles.container },
      React.createElement('div', { style: styles.header },
        React.createElement('h1', { style: styles.title },
          Home && React.createElement(Home, { size: 28 }),
          'Stronghold & Domain Management'
        ),
        viewRole === 'dm' && React.createElement('button', {
          style: styles.button,
          onClick: () => setShowCreateForm(true)
        },
          Plus && React.createElement(Plus, { size: 16 }),
          'New Stronghold'
        )
      ),

      React.createElement('div', { style: styles.content },
        showCreateForm && viewRole === 'dm' && React.createElement(CreateStrongholdPanel, {
          data,
          setData,
          partyMembers,
          onClose: () => setShowCreateForm(false)
        }),

        selectedDomain
          ? React.createElement(StrongholdDetail, {
              domain: selectedDomain,
              onUpdate: handleDomainUpdate,
              onBack: () => setSelectedDomainId(null)
            })
          : React.createElement(DomainOverview, {
              data,
              setData,
              viewRole,
              onSelectDomain: setSelectedDomainId
            })
      )
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EXPORTS
  // ─────────────────────────────────────────────────────────────────────────

  window.StrongholdView = StrongholdView;
  window.STRONGHOLD_TYPES = STRONGHOLD_TYPES;
  window.BUILDING_TYPES = BUILDING_TYPES;
  window.DOMAIN_EVENTS = DOMAIN_EVENTS;

})();
