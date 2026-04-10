(function() {
  const { useState, useEffect, useCallback, useRef, useMemo } = React;
  const { Lock, Unlock, Key, Shield, Eye, EyeOff, Users, MapPin, Clock, AlertTriangle, Check, X, Plus, Edit2, Trash2, ChevronDown, ChevronUp, Target, Star, Coins, FileText, Layers, Compass, Activity } = window.LucideReact || {};

  const T = window.__PHMURT_THEME || {};
  try {
    if (window.T) Object.assign(T, window.T);
  } catch(e) {}

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: T.bg,
      color: T.text,
      fontFamily: T.ui,
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
    difficultyCircles: {
      display: 'inline-flex',
      gap: '4px',
      alignItems: 'center'
    },
    tabbar: {
      display: 'flex',
      gap: '8px',
      padding: '12px 20px',
      borderBottom: `1px solid ${T.border}`,
      backgroundColor: T.bg,
      overflowX: 'auto'
    },
    tab: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: T.ui,
      color: T.textDim,
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s'
    },
    tabActive: {
      backgroundColor: T.gold,
      color: T.bg,
      fontWeight: 'bold'
    },
    content: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      backgroundColor: T.bg
    },
    card: {
      backgroundColor: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px'
    },
    button: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: `1px solid ${T.gold}`,
      backgroundColor: T.gold,
      color: T.bg,
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      '&:hover': { opacity: 0.8 }
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      color: T.gold
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
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px',
      marginBottom: '16px'
    },
    difficultyBadge: (difficulty) => {
      const colors = { 1: T.green, 2: T.gold, 3: T.orange, 4: T.crimson, 5: T.crimsonSoft };
      return {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        backgroundColor: colors[difficulty] || T.textMuted,
        color: T.bg,
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold'
      };
    },
    heatMeter: (heat) => ({
      height: '24px',
      backgroundColor: T.bg,
      borderRadius: '4px',
      overflow: 'hidden',
      border: `1px solid ${T.border}`,
      position: 'relative'
    }),
    heatFill: (heat) => {
      const hue = Math.max(0, 120 - (heat * 1.2));
      return {
        height: '100%',
        width: `${Math.min(100, heat)}%`,
        backgroundColor: `hsl(${hue}, 80%, 50%)`,
        transition: 'width 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        color: T.text,
        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
      };
    },
    phaseTimeline: {
      display: 'flex',
      gap: '4px',
      marginBottom: '16px',
      flexWrap: 'wrap'
    },
    phaseNode: (complete, active) => ({
      padding: '8px 12px',
      borderRadius: '4px',
      backgroundColor: complete ? (T.gold) : (active ? (T.goldDim) : (T.bgCard)),
      color: complete || active ? T.bg : (T.textDim),
      fontSize: '12px',
      fontWeight: '600',
      border: `1px solid ${active ? (T.gold) : (T.border)}`
    }),
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
      fontFamily: T.heading || 'serif'
    },
    floorGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
      gap: '8px',
      padding: '16px',
      backgroundColor: T.bg,
      borderRadius: '8px',
      border: `2px dotted ${T.border}`,
      minHeight: '400px'
    },
    roomTile: (selected) => ({
      padding: '12px',
      backgroundColor: selected ? (T.gold) : (T.bgCard),
      border: `2px solid ${selected ? (T.gold) : (T.border)}`,
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      color: selected ? T.bg : (T.text),
      textAlign: 'center',
      transition: 'all 0.2s',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }),
    crewRole: {
      padding: '12px',
      backgroundColor: T.bgCard,
      border: `1px solid ${T.border}`,
      borderRadius: '6px',
      marginBottom: '8px'
    },
    complicationItem: (severity) => {
      const severityColors = { low: T.green, medium: T.orange, high: T.crimson };
      return {
        padding: '12px',
        backgroundColor: T.bgCard,
        border: `2px solid ${severityColors[severity] || T.textMuted}`,
        borderRadius: '6px',
        marginBottom: '8px'
      };
    },
    heatAction: (type) => {
      const colors = { increase: T.crimson, decrease: T.green, neutral: T.gold };
      return {
        padding: '8px 12px',
        backgroundColor: colors[type] || T.textMuted,
        color: T.bg,
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '600',
        marginRight: '4px',
        marginBottom: '4px',
        display: 'inline-block'
      };
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: T.textDim
    }
  };

  const COMPLICATIONS = [
    { name: 'Double Agent', severity: 'high' },
    { name: 'Guard Shift Change', severity: 'medium' },
    { name: 'Magical Ward Detected', severity: 'high' },
    { name: 'Unexpected VIP Guest', severity: 'medium' },
    { name: 'Alarm System Triggered', severity: 'high' },
    { name: 'Rival Thieves Present', severity: 'high' },
    { name: 'Weather Change (Storm)', severity: 'medium' },
    { name: 'Inside Man Gets Cold Feet', severity: 'high' },
    { name: 'Guard Dog Unleashed', severity: 'medium' },
    { name: 'Hidden Security Camera', severity: 'medium' },
    { name: 'Enchanted Locks Upgrade', severity: 'high' },
    { name: 'Noble Returns Early', severity: 'high' },
    { name: 'Curse Activation', severity: 'high' },
    { name: 'Patrols Increase', severity: 'medium' },
    { name: 'Informant Betrayal', severity: 'high' },
    { name: 'Structural Collapse Risk', severity: 'high' },
    { name: 'Religious Ceremony Planned', severity: 'medium' },
    { name: 'Assassin Guild Attention', severity: 'high' },
    { name: 'Lost Documents Discovery', severity: 'low' },
    { name: 'Servant Suspicious', severity: 'low' }
  ];

  function enrichComplication(complication, data) {
    let enriched = {...complication};

    if (!data) return enriched;

    const factions = data.factions || [];
    const npcs = data.npcs || [];

    if (enriched.name.includes('Rival') && factions.length > 0) {
      const rivalFaction = factions[Math.floor(Math.random() * factions.length)];
      enriched.name = enriched.name.replace('Rival Thieves', `The ${rivalFaction.name}`);
      enriched.worldContext = `Faction: ${rivalFaction.name}`;
    }

    if ((enriched.name.includes('Assassin') || enriched.name.includes('Agent')) && factions.length > 0) {
      const sourceFaction = factions[Math.floor(Math.random() * factions.length)];
      enriched.worldContext = `From: ${sourceFaction.name}`;
    }

    if (enriched.name.includes('Informant') && npcs.length > 0) {
      const informant = npcs[Math.floor(Math.random() * npcs.length)];
      enriched.worldContext = `NPC: ${informant.name}`;
    }

    return enriched;
  }

  const CREW_ROLES = [
    { name: 'Mastermind', skills: ['Insight', 'Deception', 'Investigation'], tools: ['Maps', 'Scrolls', 'Contacts'] },
    { name: 'Infiltrator', skills: ['Stealth', 'Sleight of Hand', 'Acrobatics'], tools: ['Lock picks', 'Rope', 'Disguises'] },
    { name: 'Muscle', skills: ['Athletics', 'Intimidation', 'Perception'], tools: ['Weapons', 'Armor', 'Crowbars'] },
    { name: 'Thief', skills: ['Sleight of Hand', 'Acrobatics', 'Stealth'], tools: ['Lock picks', 'Grappling hook', 'Caltrops'] },
    { name: 'Face', skills: ['Deception', 'Persuasion', 'Performance'], tools: ['Disguises', 'Credentials', 'Charm items'] },
    { name: 'Lookout', skills: ['Perception', 'Insight', 'Stealth'], tools: ['Spyglass', 'Maps', 'Signal devices'] },
    { name: 'Artificer/Hacker', skills: ['Arcana', 'Investigation', 'Tinker\'s tools'], tools: ['Spell scroll', 'Tools', 'Disabled trap kit'] },
    { name: 'Wildcard', skills: ['Any specialty'], tools: ['Improvised', 'Unexpected', 'Creative'] }
  ];

  const LOCATION_TYPES = ['Vault', 'Mansion', 'Castle', 'Temple', 'Guild Hall', 'Caravan', 'Ship', 'Sewer', 'Tower', 'Tavern'];
  const REWARD_TIERS = ['Petty', 'Moderate', 'Valuable', 'Legendary'];

  function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function generateBlueprint(heistName, locationType) {
    const template = BUILDING_TEMPLATES[locationType];
    if (!template) return {};

    const seed = heistName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const blueprint = {};

    template.rooms.forEach((room, idx) => {
      let guardCount = room.guards;
      let hazards = room.hazards;
      let loot = room.loot;

      if (room.type === 'room' || room.type === 'corridor') {
        const guardVar = Math.floor(seededRandom(seed + idx * 10) * 3);
        guardCount = Math.max(0, room.guards - 1 + guardVar);
      }

      const roomId = 'room_' + idx;
      blueprint[roomId] = {
        id: roomId,
        name: room.name,
        type: room.type,
        description: `${locationType} ${room.name.toLowerCase()}`,
        hazards: hazards,
        loot: loot,
        guards: guardCount
      };
    });

    return blueprint;
  }

  const BUILDING_TEMPLATES = {
    'Vault': {
      rooms: [
        { name: 'Entrance', type: 'entrance', guards: 2, hazards: 'Heavy doors, alarm system', loot: 'None', connections: [1] },
        { name: 'Lobby', type: 'corridor', guards: 1, hazards: 'None', loot: 'None', connections: [0, 2] },
        { name: 'Guard Room', type: 'guard_post', guards: 3, hazards: 'Archer positions', loot: 'None', connections: [1, 3] },
        { name: 'Inner Vault', type: 'vault', guards: 0, hazards: 'Magical ward', loot: 'Treasure chest', connections: [2, 4] },
        { name: 'Trap Corridor', type: 'corridor', guards: 0, hazards: 'Pressure plates, blade traps', loot: 'None', connections: [3, 5] },
        { name: 'Vault Chamber', type: 'vault', guards: 4, hazards: 'Enchanted locks, proximity sensors', loot: 'Crown jewels, gold bars', connections: [4] }
      ]
    },
    'Mansion': {
      rooms: [
        { name: 'Front Entrance', type: 'entrance', guards: 2, hazards: 'Locked door, servants', loot: 'None', connections: [1] },
        { name: 'Grand Hall', type: 'room', guards: 1, hazards: 'Chandeliers, open space', loot: 'Paintings', connections: [0, 2, 3, 4] },
        { name: 'Kitchen', type: 'room', guards: 1, hazards: 'Servants, fire hazard', loot: 'Supplies', connections: [1, 7] },
        { name: 'Bedroom', type: 'room', guards: 0, hazards: 'Alarm bell', loot: 'Jewelry, documents', connections: [1, 5] },
        { name: 'Study', type: 'room', guards: 0, hazards: 'Locked cabinet', loot: 'Valuable books, ledgers', connections: [1, 6] },
        { name: 'Treasury', type: 'vault', guards: 3, hazards: 'Magical protection', loot: 'Gold, gems', connections: [3] },
        { name: 'Servant Quarters', type: 'corridor', guards: 0, hazards: 'Servants present', loot: 'None', connections: [4, 7] },
        { name: 'Back Garden', type: 'exit', guards: 1, hazards: 'Walls, guards', loot: 'None', connections: [2, 6] }
      ]
    },
    'Castle': {
      rooms: [
        { name: 'Gatehouse', type: 'entrance', guards: 4, hazards: 'Portcullis, guards', loot: 'None', connections: [1] },
        { name: 'Courtyard', type: 'corridor', guards: 2, hazards: 'Open space, patrols', loot: 'None', connections: [0, 2, 3, 8] },
        { name: 'Great Hall', type: 'room', guards: 1, hazards: 'Large, echoing', loot: 'Tapestries', connections: [1, 4] },
        { name: 'Armory', type: 'room', guards: 3, hazards: 'Weapons, armor', loot: 'Enchanted sword', connections: [1, 5] },
        { name: 'Dungeon', type: 'room', guards: 2, hazards: 'Prisoners, darkness', loot: 'Prisoner records', connections: [2, 7] },
        { name: 'Tower', type: 'room', guards: 2, hazards: 'Stairs, height', loot: 'Spy glass', connections: [3, 6] },
        { name: 'Throne Room', type: 'room', guards: 4, hazards: 'Royal guards', loot: 'Crown, scepter', connections: [5, 9] },
        { name: 'Barracks', type: 'guard_post', guards: 5, hazards: 'Many soldiers', loot: 'None', connections: [4] },
        { name: 'Chapel', type: 'room', guards: 1, hazards: 'Holy ground, priest', loot: 'Religious artifacts', connections: [1, 9] },
        { name: 'Treasury', type: 'vault', guards: 3, hazards: 'Magical seals', loot: 'Royal treasury', connections: [6, 8] }
      ]
    },
    'Temple': {
      rooms: [
        { name: 'Entrance', type: 'entrance', guards: 2, hazards: 'Priests, sacred ground', loot: 'None', connections: [1] },
        { name: 'Nave', type: 'corridor', guards: 1, hazards: 'Worshippers, open space', loot: 'None', connections: [0, 2, 3] },
        { name: 'Altar Room', type: 'room', guards: 2, hazards: 'Holy magic, priest', loot: 'Sacred relics', connections: [1, 4] },
        { name: 'Crypt', type: 'room', guards: 0, hazards: 'Undead ward, darkness', loot: 'Burial treasures', connections: [1, 5] },
        { name: 'Vault', type: 'vault', guards: 3, hazards: 'Divine protection', loot: 'Sacred gold', connections: [2] },
        { name: 'Priest Quarters', type: 'room', guards: 1, hazards: 'Priest present', loot: 'Personal valuables', connections: [3, 6] },
        { name: 'Bell Tower', type: 'exit', guards: 1, hazards: 'Bells, height, guards', loot: 'None', connections: [5] }
      ]
    },
    'Guild Hall': {
      rooms: [
        { name: 'Entrance', type: 'entrance', guards: 1, hazards: 'Guard at desk', loot: 'None', connections: [1] },
        { name: 'Common Room', type: 'corridor', guards: 2, hazards: 'Members present', loot: 'None', connections: [0, 2, 3, 4] },
        { name: 'Meeting Hall', type: 'room', guards: 0, hazards: 'Large room, sound carries', loot: 'Documents', connections: [1, 5] },
        { name: 'Vault', type: 'vault', guards: 4, hazards: 'Magical locks, alarm', loot: 'Guild treasury', connections: [1] },
        { name: 'Archive', type: 'room', guards: 1, hazards: 'Valuable documents', loot: 'Contracts, records', connections: [1, 6] },
        { name: 'Back Alley Exit', type: 'exit', guards: 1, hazards: 'Narrow, muddy', loot: 'None', connections: [2] },
        { name: 'Rooftop', type: 'exit', guards: 1, hazards: 'Height, exposed', loot: 'None', connections: [4] }
      ]
    },
    'Caravan': {
      rooms: [
        { name: 'Lead Wagon', type: 'entrance', guards: 2, hazards: 'Driver, guards', loot: 'None', connections: [1] },
        { name: 'Cargo Wagon 1', type: 'room', guards: 1, hazards: 'Heavy crates', loot: 'Silk, spices', connections: [0, 2] },
        { name: 'Cargo Wagon 2', type: 'room', guards: 1, hazards: 'Fragile goods', loot: 'Gems, oil', connections: [1, 3] },
        { name: 'Rear Guard', type: 'guard_post', guards: 3, hazards: 'Armed guards', loot: 'None', connections: [2, 4] },
        { name: 'Hidden Compartment', type: 'vault', guards: 2, hazards: 'Secret lock', loot: 'Contraband, gold', connections: [3] }
      ]
    },
    'Ship': {
      rooms: [
        { name: 'Deck', type: 'entrance', guards: 2, hazards: 'Crew, waves, weather', loot: 'None', connections: [1, 2] },
        { name: 'Captain\'s Cabin', type: 'room', guards: 1, hazards: 'Locked door', loot: 'Maps, logs, valuables', connections: [0, 3] },
        { name: 'Cargo Hold', type: 'room', guards: 2, hazards: 'Dark, slippery', loot: 'Cargo, barrels', connections: [0, 4] },
        { name: 'Brig', type: 'room', guards: 2, hazards: 'Prisoners, guards', loot: 'Prisoner records', connections: [1] },
        { name: 'Crow\'s Nest', type: 'room', guards: 1, hazards: 'Height, exposed, swaying', loot: 'Telescope, coins', connections: [2, 5] },
        { name: 'Secret Compartment', type: 'vault', guards: 0, hazards: 'Hidden hatch', loot: 'Pirate gold, jewels', connections: [4] }
      ]
    },
    'Sewer': {
      rooms: [
        { name: 'Entrance', type: 'entrance', guards: 0, hazards: 'Stench, dark', loot: 'None', connections: [1] },
        { name: 'Main Junction', type: 'corridor', guards: 1, hazards: 'Murky water, slippery', loot: 'None', connections: [0, 2, 3] },
        { name: 'Waterway', type: 'corridor', guards: 0, hazards: 'Strong current, flooded', loot: 'None', connections: [1, 4] },
        { name: 'Den', type: 'room', guards: 0, hazards: 'Rats, mold, unstable', loot: 'Bones, trash', connections: [1, 5] },
        { name: 'Stash Room', type: 'vault', guards: 2, hazards: 'Hidden entrance, traps', loot: 'Stolen goods, gold', connections: [2] },
        { name: 'Exit', type: 'exit', guards: 0, hazards: 'Grate, locked', loot: 'None', connections: [3, 6] },
        { name: 'Flooded Chamber', type: 'room', guards: 0, hazards: 'Deep water, drowning risk', loot: 'Sunken treasures', connections: [5] }
      ]
    },
    'Tower': {
      rooms: [
        { name: 'Ground Floor', type: 'entrance', guards: 2, hazards: 'Locked door, guards', loot: 'None', connections: [1] },
        { name: 'Stairwell', type: 'corridor', guards: 1, hazards: 'Spiraling stairs, height', loot: 'None', connections: [0, 2, 3, 4] },
        { name: 'Laboratory', type: 'room', guards: 1, hazards: 'Magical experiments, danger', loot: 'Spell components, artifacts', connections: [1, 5] },
        { name: 'Library', type: 'room', guards: 1, hazards: 'Enchanted books', loot: 'Spellbooks, knowledge', connections: [1] },
        { name: 'Summit', type: 'room', guards: 2, hazards: 'Exposed, windy, height', loot: 'Scrying orb, treasure', connections: [1] },
        { name: 'Secret Basement', type: 'vault', guards: 3, hazards: 'Hidden entrance, traps', loot: 'Forbidden artifacts, gold', connections: [2] }
      ]
    },
    'Tavern': {
      rooms: [
        { name: 'Common Room', type: 'entrance', guards: 1, hazards: 'Crowds, drunk patrons', loot: 'None', connections: [1, 2] },
        { name: 'Kitchen', type: 'room', guards: 1, hazards: 'Heat, sharp objects', loot: 'Food, supplies', connections: [0, 3] },
        { name: 'Cellar', type: 'vault', guards: 2, hazards: 'Dark, damp, locked', loot: 'Wine, ale, gold', connections: [0, 4] },
        { name: 'Upstairs Rooms', type: 'room', guards: 0, hazards: 'Locked doors, patrons', loot: 'Personal items', connections: [1] },
        { name: 'Back Office', type: 'room', guards: 1, hazards: 'Owner present, records', loot: 'Ledgers, cash box', connections: [2, 5] },
        { name: 'Hidden Room', type: 'vault', guards: 2, hazards: 'Secret entrance, traps', loot: 'Secret treasury', connections: [4] }
      ]
    }
  };

  function HeistCreationPanel({ data, setData, onClose }) {
    const [newHeist, setNewHeist] = useState({
      id: Date.now(),
      name: 'New Heist',
      location: '',
      type: 'Vault',
      description: '',
      dmNotes: '',
      difficulty: 3,
      reward: 'Valuable',
      security: {
        guards: 5,
        traps: 3,
        locks: 4,
        wards: 2,
        alarms: 2
      },
      phases: {
        reconnaissance: { status: 'pending', notes: '' },
        planning: { status: 'pending', notes: '' },
        preparation: { status: 'pending', notes: '' },
        execution: { status: 'pending', notes: '' },
        escape: { status: 'pending', notes: '' }
      },
      heat: 0,
      crew: {},
      blueprint: {},
      complications: [],
      history: null
    });

    const handleCreate = () => {
      if (!newHeist.name || !newHeist.location) {
        alert('Please fill in heist name and location');
        return;
      }
      const updated = { ...data };
      if (!updated.heists) updated.heists = {};
      updated.heists[newHeist.id] = newHeist;
      setData(updated);
      onClose();
    };

    return (
      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Create New Heist</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <div style={styles.label}>Heist Name</div>
            <input
              style={styles.input}
              value={newHeist.name}
              onChange={(e) => setNewHeist({...newHeist, name: e.target.value})}
              placeholder="The Grand Vault Job"
            />
          </div>

          <div style={styles.grid}>
            <div>
              <div style={styles.label}>Target Location</div>
              <div style={{display: 'flex', gap: '8px', flexDirection: 'column'}}>
                <select
                  style={styles.input}
                  value={newHeist.location}
                  onChange={(e) => setNewHeist({...newHeist, location: e.target.value})}
                >
                  <option value="">Select from world locations or enter custom</option>
                  {(data.cities || []).map(c => (
                    <option key={`city-${c.name}`} value={c.name + " (" + (c.region || "Unknown") + ")"}>
                      {c.name} — {c.region || "Unknown"} (City)
                    </option>
                  ))}
                  {(data.pois || []).filter(p => ["dungeon","ruin","temple","tower","stronghold","mine"].includes((p.type||"").toLowerCase())).map(p => (
                    <option key={`poi-${p.name}`} value={p.name}>
                      {p.name} ({p.type || "Location"})
                    </option>
                  ))}
                </select>
                <input
                  style={styles.input}
                  value={newHeist.location}
                  onChange={(e) => setNewHeist({...newHeist, location: e.target.value})}
                  placeholder="Or enter custom location"
                />
              </div>
            </div>
            <div>
              <div style={styles.label}>Location Type</div>
              <select
                style={styles.input}
                value={newHeist.type}
                onChange={(e) => setNewHeist({...newHeist, type: e.target.value})}
              >
                {LOCATION_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <button
            style={{...styles.button, backgroundColor: T.goldDim}}
            onClick={() => {
              const generatedBlueprint = generateBlueprint(newHeist.name, newHeist.type);
              setNewHeist({...newHeist, blueprint: generatedBlueprint});
            }}
          >
            <Layers size={16} /> Generate Blueprint
          </button>

          <div>
            <div style={styles.label}>Description</div>
            <textarea
              style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
              value={newHeist.description}
              onChange={(e) => setNewHeist({...newHeist, description: e.target.value})}
              placeholder="What are the party stealing? Why does this heist matter?"
            />
          </div>

          <div>
            <div style={styles.label}>DM Notes</div>
            <textarea
              style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
              value={newHeist.dmNotes}
              onChange={(e) => setNewHeist({...newHeist, dmNotes: e.target.value})}
              placeholder="Hidden secrets, story hooks, plot twists..."
            />
          </div>

          <div style={styles.grid}>
            <div>
              <div style={styles.label}>Difficulty Slider</div>
              <input
                style={styles.input}
                type="range"
                min="1"
                max="5"
                value={newHeist.difficulty}
                onChange={(e) => setNewHeist({...newHeist, difficulty: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <div style={styles.label}>Reward Tier</div>
              <select
                style={styles.input}
                value={newHeist.reward}
                onChange={(e) => setNewHeist({...newHeist, reward: e.target.value})}
              >
                {REWARD_TIERS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div>
            <div style={styles.label}>Difficulty Rating</div>
            <div style={styles.difficultyCircles}>
              {[1,2,3,4,5].map(i => (
                <span key={i} style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: i <= newHeist.difficulty ? (T.gold) : (T.border),
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: i <= newHeist.difficulty ? T.bg : (T.textDim)
                }}>
                  {i <= newHeist.difficulty ? '★' : '○'}
                </span>
              ))}
            </div>
          </div>

          <div style={{...styles.card, backgroundColor: 'transparent', border: 'none', padding: 0}}>
            <div style={styles.label}>Security Breakdown</div>
            {['guards', 'traps', 'locks', 'wards', 'alarms'].map(sec => (
              <div key={sec} style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                <label style={{flex: 1, textTransform: 'capitalize'}}>{sec}:</label>
                <input
                  style={{...styles.input, width: '60px'}}
                  type="number"
                  min="0"
                  value={newHeist.security[sec]}
                  onChange={(e) => setNewHeist({
                    ...newHeist,
                    security: {...newHeist.security, [sec]: parseInt(e.target.value)}
                  })}
                />
              </div>
            ))}
          </div>

          <div style={{display: 'flex', gap: '8px'}}>
            <button
              style={styles.button}
              onClick={handleCreate}
            >
              <Plus size={16} /> Create Heist
            </button>
            <button
              style={{...styles.button, ...styles.buttonSecondary}}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  function HeistListView({ data, setData, onSelectHeist }) {
    const heists = data.heists || {};

    const getWorldContext = (heistLocation) => {
      if (!data || !data.cities) return null;
      const matchingCity = data.cities.find(c =>
        heistLocation && (
          heistLocation.includes(c.name) ||
          heistLocation === c.name
        )
      );
      if (matchingCity) {
        return {
          region: matchingCity.region,
          faction: data.factions && data.factions.find(f =>
            matchingCity.controllingFaction && f.name === matchingCity.controllingFaction
          )
        };
      }
      return null;
    };

    const deleteHeist = (id) => {
      if (!confirm('Delete this heist? This cannot be undone.')) return;
      const updated = { ...data };
      delete updated.heists[id];
      setData(updated);
    };

    return (
      <div style={styles.content}>
        {Object.values(heists).length === 0 ? (
          <div style={styles.emptyState}>
            <Target size={48} style={{opacity: 0.3, marginBottom: '12px'}} />
            <p>No heists yet. Create one to get started!</p>
          </div>
        ) : (
          Object.values(heists).map(heist => {
            const worldCtx = getWorldContext(heist.location);
            return (
            <div key={heist.id} style={styles.card}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <h3 style={{margin: '0 0 8px 0', color: T.gold, fontSize: '18px'}}>
                    {heist.name}
                  </h3>
                  <p style={{margin: '4px 0', fontSize: '14px', color: T.textDim}}>
                    <MapPin size={14} style={{display: 'inline', marginRight: '4px'}} />
                    {heist.location} — {heist.type}
                  </p>
                  {worldCtx && (
                    <div style={{display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap'}}>
                      {worldCtx.region && (
                        <div style={{...styles.difficultyBadge(1), backgroundColor: T.ui, fontSize: '12px', padding: '4px 8px'}}>
                          Region: {worldCtx.region}
                        </div>
                      )}
                      {worldCtx.faction && (
                        <div style={{...styles.difficultyBadge(1), backgroundColor: worldCtx.faction.color || T.ui, fontSize: '12px', padding: '4px 8px'}}>
                          {worldCtx.faction.name}
                        </div>
                      )}
                    </div>
                  )}
                  <p style={{margin: '4px 0', fontSize: '14px'}}>
                    {heist.description}
                  </p>
                  <div style={{display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap'}}>
                    <div style={styles.difficultyBadge(heist.difficulty)}>
                      {'★'.repeat(heist.difficulty)}{'○'.repeat(5-heist.difficulty)} {heist.difficulty}/5
                    </div>
                    <div style={{...styles.difficultyBadge(1), backgroundColor: T.goldDim}}>
                      <Coins size={14} /> {heist.reward}
                    </div>
                    <div style={{...styles.difficultyBadge(1), backgroundColor: 'hsl(0, 80%, 50%)'}}>
                      Heat: {heist.heat}
                    </div>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '8px'}}>
                  <button
                    style={styles.button}
                    onClick={() => onSelectHeist(heist.id)}
                  >
                    <Edit2 size={16} /> Plan
                  </button>
                  <button
                    style={{...styles.button, backgroundColor: T.crimson}}
                    onClick={() => deleteHeist(heist.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
    );
  }

  function BlueprintEditor({ heist, setHeist }) {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [newRoom, setNewRoom] = useState({
      name: '',
      description: '',
      hazards: '',
      loot: '',
      guards: 0,
      type: 'room'
    });

    const addRoom = () => {
      if (!newRoom.name) return;
      const id = 'room_' + Date.now();
      const updated = {...heist};
      if (!updated.blueprint) updated.blueprint = {};
      updated.blueprint[id] = {...newRoom, id};
      setHeist(updated);
      setNewRoom({name: '', description: '', hazards: '', loot: '', guards: 0, type: 'room'});
    };

    const deleteRoom = (id) => {
      const updated = {...heist};
      delete updated.blueprint[id];
      setHeist(updated);
      setSelectedRoom(null);
    };

    const rooms = heist.blueprint || {};

    return (
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <Layers size={20} /> Blueprint & Floor Plan
        </div>

        <div style={styles.grid}>
          <div>
            <div style={styles.label}>Room Name</div>
            <input
              style={styles.input}
              value={newRoom.name}
              onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
              placeholder="Treasure Chamber"
            />
          </div>
          <div>
            <div style={styles.label}>Room Type</div>
            <select
              style={styles.input}
              value={newRoom.type}
              onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
            >
              <option>room</option>
              <option>corridor</option>
              <option>entrance</option>
              <option>exit</option>
              <option>vault</option>
              <option>guard_post</option>
            </select>
          </div>
        </div>

        <div>
          <div style={styles.label}>Description</div>
          <textarea
            style={{...styles.input, minHeight: '60px'}}
            value={newRoom.description}
            onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
            placeholder="Room details, furnishings, layout..."
          />
        </div>

        <div style={styles.grid}>
          <div>
            <div style={styles.label}>Hazards</div>
            <textarea
              style={{...styles.input, minHeight: '60px'}}
              value={newRoom.hazards}
              onChange={(e) => setNewRoom({...newRoom, hazards: e.target.value})}
              placeholder="Traps, wards, environmental hazards..."
            />
          </div>
          <div>
            <div style={styles.label}>Loot</div>
            <textarea
              style={{...styles.input, minHeight: '60px'}}
              value={newRoom.loot}
              onChange={(e) => setNewRoom({...newRoom, loot: e.target.value})}
              placeholder="Treasure, valuable items, objectives..."
            />
          </div>
        </div>

        <div style={{marginBottom: '12px'}}>
          <div style={styles.label}>Guard Count</div>
          <input
            style={styles.input}
            type="number"
            min="0"
            value={newRoom.guards}
            onChange={(e) => setNewRoom({...newRoom, guards: parseInt(e.target.value)})}
          />
        </div>

        <button
          style={styles.button}
          onClick={addRoom}
        >
          <Plus size={16} /> Add Room to Blueprint
        </button>

        <div style={{marginTop: '20px'}}>
          <div style={styles.sectionTitle}>Layout Grid</div>
          <div style={styles.floorGrid}>
            {Object.values(rooms).length === 0 ? (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', color: T.textDim, padding: '40px'}}>
                Add rooms to build your blueprint
              </div>
            ) : (
              Object.values(rooms).map(room => (
                <div
                  key={room.id}
                  style={styles.roomTile(selectedRoom === room.id)}
                  onClick={() => setSelectedRoom(room.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    deleteRoom(room.id);
                  }}
                  title={`${room.guards} guard${room.guards !== 1 ? 's' : ''} | Right-click to delete`}
                >
                  {room.name}
                  {room.guards > 0 && <div style={{fontSize: '10px', marginTop: '4px', color: T.crimson}}>G: {room.guards}</div>}
                </div>
              ))
            )}
          </div>
        </div>

        {selectedRoom && rooms[selectedRoom] && (
          <div style={{...styles.card, marginTop: '16px', backgroundColor: T.bg}}>
            <h4 style={{margin: '0 0 12px 0', color: T.gold}}>
              {rooms[selectedRoom].name}
            </h4>
            <p><strong>Type:</strong> {rooms[selectedRoom].type}</p>
            <p><strong>Description:</strong> {rooms[selectedRoom].description}</p>
            <p><strong>Hazards:</strong> {rooms[selectedRoom].hazards}</p>
            <p><strong>Loot:</strong> {rooms[selectedRoom].loot}</p>
            <p><strong>Guards:</strong> {rooms[selectedRoom].guards}</p>
          </div>
        )}
      </div>
    );
  }

  function CrewPlanning({ heist, setHeist, data }) {
    const [crewDropdownOpen, setCrewDropdownOpen] = useState({});

    const assignCrew = (role, members) => {
      const updated = {...heist};
      updated.crew = {...updated.crew, [role]: members};
      setHeist(updated);
    };

    const getReadinessScore = () => {
      const crew = heist.crew || {};
      const roles = Object.keys(crew).length;
      return Math.min(100, roles * 12.5);
    };

    const getNPCNames = () => {
      return (data && data.npcs || []).map(npc => npc.name);
    };

    const npcNames = getNPCNames();

    return (
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <Users size={20} /> Crew Assembly
        </div>

        <div style={{...styles.card, marginBottom: '16px', backgroundColor: T.bgCard}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <span>Crew Readiness Score</span>
            <div style={styles.heatMeter(getReadinessScore())}>
              <div style={styles.heatFill(getReadinessScore())}>
                {getReadinessScore()}%
              </div>
            </div>
          </div>
        </div>

        <div>
          {CREW_ROLES.map(role => (
            <div key={role.name} style={styles.crewRole}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px'}}>
                <div>
                  <h4 style={{margin: '0 0 4px 0', color: T.gold}}>{role.name}</h4>
                  <p style={{margin: '0', fontSize: '12px', color: T.textDim}}>
                    Skills: {role.skills.join(', ')}
                  </p>
                  <p style={{margin: '4px 0 0 0', fontSize: '12px', color: T.textDim}}>
                    Tools: {role.tools.join(', ')}
                  </p>
                </div>
              </div>
              <div style={{position: 'relative'}}>
                <input
                  style={{...styles.input, width: '100%'}}
                  placeholder="Assign party member(s) - type to search NPCs"
                  value={(heist.crew && heist.crew[role.name]) || ''}
                  onChange={(e) => assignCrew(role.name, e.target.value)}
                  onFocus={() => setCrewDropdownOpen({...crewDropdownOpen, [role.name]: true})}
                  onBlur={() => setTimeout(() => setCrewDropdownOpen({...crewDropdownOpen, [role.name]: false}), 200)}
                />
                {crewDropdownOpen[role.name] && npcNames.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: T.bgCard,
                    border: `1px solid ${T.border}`,
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 10,
                    marginTop: '4px'
                  }}>
                    {npcNames.map(npcName => (
                      <div
                        key={npcName}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          borderBottom: `1px solid ${T.border}`,
                          fontSize: '14px',
                          color: T.text
                        }}
                        onClick={() => {
                          assignCrew(role.name, npcName);
                          setCrewDropdownOpen({...crewDropdownOpen, [role.name]: false});
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = T.ui}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        {npcName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function PhaseTracking({ heist, setHeist }) {
    const phases = [
      { key: 'reconnaissance', name: 'Reconnaissance', icon: Eye, description: 'Gather intel on target' },
      { key: 'planning', name: 'Planning', icon: Compass, description: 'Choose approach & routes' },
      { key: 'preparation', name: 'Preparation', icon: FileText, description: 'Gather tools & equipment' },
      { key: 'execution', name: 'Execution', icon: Activity, description: 'Execute the heist' },
      { key: 'escape', name: 'Escape', icon: AlertTriangle, description: 'Exit with loot' }
    ];

    const updatePhase = (key, updates) => {
      const updated = {...heist};
      updated.phases[key] = {...updated.phases[key], ...updates};
      setHeist(updated);
    };

    return (
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <Clock size={20} /> Planning Phases
        </div>

        <div style={styles.phaseTimeline}>
          {phases.map((phase, idx) => {
            const phaseData = heist.phases[phase.key];
            const isComplete = phaseData.status === 'complete';
            const isActive = phaseData.status === 'active';
            return (
              <div key={phase.key} style={styles.phaseNode(isComplete, isActive)}>
                {phase.name}
              </div>
            );
          })}
        </div>

        {phases.map(phase => {
          const phaseData = heist.phases[phase.key];
          const Icon = phase.icon;
          return (
            <div key={phase.key} style={styles.card}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                {Icon && <Icon size={18} />}
                <h4 style={{margin: 0, flex: 1, color: T.gold}}>{phase.name}</h4>
                <select
                  style={{...styles.input, padding: '4px 8px'}}
                  value={phaseData.status}
                  onChange={(e) => updatePhase(phase.key, {status: e.target.value})}
                >
                  <option>pending</option>
                  <option>active</option>
                  <option>complete</option>
                </select>
              </div>
              <p style={{margin: '0 0 8px 0', fontSize: '12px', color: T.textDim}}>
                {phase.description}
              </p>
              <textarea
                style={{...styles.input, width: '100%', minHeight: '80px'}}
                placeholder="Phase details, checklist items, decisions..."
                value={phaseData.notes}
                onChange={(e) => updatePhase(phase.key, {notes: e.target.value})}
              />
            </div>
          );
        })}
      </div>
    );
  }

  function ComplicationManager({ heist, setHeist, data }) {
    const drawComplication = () => {
      const random = COMPLICATIONS[Math.floor(Math.random() * COMPLICATIONS.length)];
      const enriched = enrichComplication(random, data);
      const updated = {...heist};
      if (!updated.complications) updated.complications = [];
      updated.complications.push({
        id: Date.now(),
        ...enriched,
        resolved: false
      });
      setHeist(updated);
    };

    const resolveComplication = (id) => {
      const updated = {...heist};
      const comp = updated.complications.find(c => c.id === id);
      if (comp) comp.resolved = !comp.resolved;
      setHeist(updated);
    };

    const removeComplication = (id) => {
      const updated = {...heist};
      updated.complications = updated.complications.filter(c => c.id !== id);
      setHeist(updated);
    };

    const complications = heist.complications || [];

    return (
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <AlertTriangle size={20} /> Complications
        </div>

        <button
          style={styles.button}
          onClick={drawComplication}
        >
          <Dice2Icon size={16} /> Draw Random Complication
        </button>

        <div style={{marginTop: '16px'}}>
          {complications.length === 0 ? (
            <div style={{...styles.card, textAlign: 'center', color: T.textDim}}>
              No complications yet. Smooth sailing!
            </div>
          ) : (
            complications.map(comp => (
              <div
                key={comp.id}
                style={{
                  ...styles.complicationItem(comp.severity),
                  opacity: comp.resolved ? 0.6 : 1,
                  textDecoration: comp.resolved ? 'line-through' : 'none'
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <h4 style={{margin: '0 0 4px 0'}}>{comp.name}</h4>
                    <span style={{fontSize: '12px', textTransform: 'capitalize', color: T.textDim}}>
                      Severity: {comp.severity}
                    </span>
                    {comp.worldContext && (
                      <p style={{margin: '4px 0 0 0', fontSize: '12px', color: T.gold}}>
                        {comp.worldContext}
                      </p>
                    )}
                  </div>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      style={{...styles.button, padding: '6px 8px'}}
                      onClick={() => resolveComplication(comp.id)}
                    >
                      {comp.resolved ? <X size={16} /> : <Check size={16} />}
                    </button>
                    <button
                      style={{...styles.button, padding: '6px 8px', backgroundColor: T.crimson}}
                      onClick={() => removeComplication(comp.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  function HeatSystem({ heist, setHeist }) {
    const updateHeat = useCallback((amount) => {
      const updated = {...heist};
      updated.heat = Math.max(0, Math.min(100, updated.heat + amount));
      setHeist(updated);
    }, [heist, setHeist]);

    const consequences = [
      { threshold: 25, text: 'Local guards on alert' },
      { threshold: 50, text: 'Wanted posters issued' },
      { threshold: 75, text: 'Bounty hunters hired' },
      { threshold: 90, text: 'Guild/Noble sends assassins' }
    ];

    const activeConsequences = useMemo(() => consequences.filter(c => heist.heat >= c.threshold), [heist.heat]);

    return (
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <AlertTriangle size={20} /> Heat Level
        </div>

        <div style={styles.card}>
          <div style={{marginBottom: '16px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
              <span>Current Heat</span>
              <span style={{fontSize: '20px', fontWeight: 'bold'}}>{heist.heat}/100</span>
            </div>
            <div style={styles.heatMeter(heist.heat)}>
              <div style={styles.heatFill(heist.heat)} />
            </div>
          </div>

          <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px'}}>
            <button
              style={{...styles.button, backgroundColor: T.crimson}}
              onClick={() => updateHeat(10)}
            >
              +10 Heat
            </button>
            <button
              style={{...styles.button, backgroundColor: T.crimson}}
              onClick={() => updateHeat(25)}
            >
              +25 Heat
            </button>
            <button
              style={{...styles.button, backgroundColor: T.green}}
              onClick={() => updateHeat(-10)}
            >
              -10 Heat
            </button>
            <button
              style={{...styles.button, backgroundColor: T.green}}
              onClick={() => updateHeat(-25)}
            >
              -25 Heat
            </button>
          </div>

          {activeConsequences.length > 0 && (
            <div style={{...styles.card, backgroundColor: T.bgCard, borderColor: T.crimson, padding: '12px'}}>
              <h4 style={{margin: '0 0 8px 0', color: T.crimsonSoft}}>Active Consequences:</h4>
              {activeConsequences.map((cons, idx) => (
                <p key={idx} style={{margin: '4px 0', fontSize: '14px', color: T.crimsonSoft}}>
                  {cons.text}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  function HeistDetailView({ data, setData, heistId, onBack }) {
    const heists = data.heists || {};
    const heist = heists[heistId];

    if (!heist) {
      return (
        <div style={styles.content}>
          <p>Heist not found</p>
          <button style={styles.button} onClick={onBack}>Back</button>
        </div>
      );
    }

    const setHeist = (updated) => {
      const newData = {...data};
      newData.heists[heistId] = updated;
      setData(newData);
    };

    const getWorldContext = (heistLocation) => {
      if (!data || !data.cities) return null;
      const matchingCity = data.cities.find(c =>
        heistLocation && (
          heistLocation.includes(c.name) ||
          heistLocation === c.name
        )
      );
      if (matchingCity) {
        return {
          region: matchingCity.region,
          faction: data.factions && data.factions.find(f =>
            matchingCity.controllingFaction && f.name === matchingCity.controllingFaction
          )
        };
      }
      return null;
    };

    const worldCtx = getWorldContext(heist.location);

    return (
      <div style={styles.content}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h2 style={{margin: 0, color: T.gold}}>
            {heist.name}
          </h2>
          <button style={styles.button} onClick={onBack}>
            Back to Heists
          </button>
        </div>

        <div style={{...styles.card, marginBottom: '20px'}}>
          <div style={styles.grid}>
            <div>
              <div style={styles.label}>Location</div>
              <p style={{margin: 0}}>{heist.location} ({heist.type})</p>
              {worldCtx && (
                <div style={{display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap'}}>
                  {worldCtx.region && (
                    <div style={{...styles.difficultyBadge(1), backgroundColor: T.ui, fontSize: '11px', padding: '3px 6px'}}>
                      Region: {worldCtx.region}
                    </div>
                  )}
                  {worldCtx.faction && (
                    <div style={{...styles.difficultyBadge(1), backgroundColor: worldCtx.faction.color || T.ui, fontSize: '11px', padding: '3px 6px'}}>
                      {worldCtx.faction.name}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div>
              <div style={styles.label}>Difficulty</div>
              <div style={styles.difficultyBadge(heist.difficulty)}>
                {'★'.repeat(heist.difficulty)}{'○'.repeat(5-heist.difficulty)}
              </div>
            </div>
            <div>
              <div style={styles.label}>Reward</div>
              <p style={{margin: 0}}>{heist.reward}</p>
            </div>
          </div>
          <div style={{marginTop: '12px'}}>
            <div style={styles.label}>Description</div>
            <p style={{margin: 0}}>{heist.description}</p>
          </div>
          <div style={{marginTop: '12px'}}>
            <div style={styles.label}>DM Notes</div>
            <p style={{margin: 0, fontSize: '14px', color: T.textDim}}>{heist.dmNotes}</p>
          </div>
        </div>

        <HeatSystem heist={heist} setHeist={setHeist} />
        <PhaseTracking heist={heist} setHeist={setHeist} />
        <BlueprintEditor heist={heist} setHeist={setHeist} />
        <CrewPlanning heist={heist} setHeist={setHeist} data={data} />
        <ComplicationManager heist={heist} setHeist={setHeist} data={data} />
      </div>
    );
  }

  function Dice2Icon(props) {
    return (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <g><circle cx="6" cy="6" r="3"></circle><path d="M13 13l5.768-9.542a2 2 0 0 0-2.203-3.159L9 11"></path><circle cx="18" cy="18" r="3"></circle></g>
      </svg>
    );
  }

  function HeistPlannerView({ data, setData, viewRole }) {
    const [activeTab, setActiveTab] = useState('list');
    const [selectedHeist, setSelectedHeist] = useState(null);
    const [showCreator, setShowCreator] = useState(false);

    const heists = data.heists || {};
    const heistCount = Object.keys(heists).length;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            <Target size={28} /> Heist Planner
          </h1>
          <div style={{fontSize: '12px', color: T.textDim}}>
            {heistCount} active {heistCount === 1 ? 'heist' : 'heists'}
          </div>
        </div>

        {selectedHeist ? (
          <HeistDetailView
            data={data}
            setData={setData}
            heistId={selectedHeist}
            onBack={() => setSelectedHeist(null)}
          />
        ) : (
          <>
            <div style={styles.tabbar}>
              <button
                style={{...styles.tab, ...(activeTab === 'list' && styles.tabActive)}}
                onClick={() => setActiveTab('list')}
              >
                <FileText size={14} style={{display: 'inline', marginRight: '6px'}} />
                Heists
              </button>
              <button
                style={{...styles.tab, ...(activeTab === 'create' && styles.tabActive)}}
                onClick={() => setActiveTab('create')}
              >
                <Plus size={14} style={{display: 'inline', marginRight: '6px'}} />
                Create New
              </button>
            </div>

            {activeTab === 'list' && (
              <HeistListView
                data={data}
                setData={setData}
                onSelectHeist={setSelectedHeist}
              />
            )}

            {activeTab === 'create' && (
              <div style={styles.content}>
                <HeistCreationPanel
                  data={data}
                  setData={setData}
                  onClose={() => setActiveTab('list')}
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  window.HeistPlannerView = HeistPlannerView;
})();
