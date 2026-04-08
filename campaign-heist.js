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
      backgroundColor: T.bg || 'var(--bg)',
      color: T.text || 'var(--text)',
      fontFamily: T.ui || 'system-ui, -apple-system, sans-serif',
      overflow: 'hidden'
    },
    header: {
      padding: '20px',
      borderBottom: `1px solid ${T.border || 'var(--border)'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: T.surface || 'var(--surface)'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      fontFamily: T.heading || 'serif',
      color: T.gold || 'var(--gold)',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    tabbar: {
      display: 'flex',
      gap: '8px',
      padding: '12px 20px',
      borderBottom: `1px solid ${T.border || 'var(--border)'}`,
      backgroundColor: T.bg || 'var(--bg)',
      overflowX: 'auto'
    },
    tab: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: T.ui || 'transparent',
      color: T.textDim || 'var(--text-dim)',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s'
    },
    tabActive: {
      backgroundColor: T.gold || 'var(--gold)',
      color: '#000',
      fontWeight: 'bold'
    },
    content: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      backgroundColor: T.bg || 'var(--bg)'
    },
    card: {
      backgroundColor: T.surface || 'var(--surface)',
      border: `1px solid ${T.border || 'var(--border)'}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px'
    },
    button: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: `1px solid ${T.gold || 'var(--gold)'}`,
      backgroundColor: T.gold || 'var(--gold)',
      color: '#000',
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
      color: T.gold || 'var(--gold)'
    },
    input: {
      padding: '8px 12px',
      borderRadius: '4px',
      border: `1px solid ${T.border || 'var(--border)'}`,
      backgroundColor: T.bg || 'var(--bg)',
      color: T.text || 'var(--text)',
      fontSize: '14px',
      fontFamily: 'inherit'
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      color: T.textDim || 'var(--text-dim)',
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
      const colors = { 1: '#4ade80', 2: '#60a5fa', 3: '#fbbf24', 4: '#f87171', 5: '#a21caf' };
      return {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 8px',
        backgroundColor: colors[difficulty] || '#666',
        color: '#000',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold'
      };
    },
    heatMeter: (heat) => ({
      height: '24px',
      backgroundColor: T.bg || 'var(--bg)',
      borderRadius: '4px',
      overflow: 'hidden',
      border: `1px solid ${T.border || 'var(--border)'}`,
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
        color: '#fff',
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
      backgroundColor: complete ? (T.gold || 'var(--gold)') : (active ? (T.accent || '#6366f1') : (T.surface || 'var(--surface)')),
      color: complete || active ? '#000' : (T.textDim || 'var(--text-dim)'),
      fontSize: '12px',
      fontWeight: '600',
      border: `1px solid ${active ? (T.gold || 'var(--gold)') : (T.border || 'var(--border)')}`
    }),
    section: {
      marginBottom: '24px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: T.gold || 'var(--gold)',
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
      backgroundColor: T.bg || 'var(--bg)',
      borderRadius: '8px',
      border: `2px dotted ${T.border || 'var(--border)'}`,
      minHeight: '400px'
    },
    roomTile: (selected) => ({
      padding: '12px',
      backgroundColor: selected ? (T.gold || 'var(--gold)') : (T.surface || 'var(--surface)'),
      border: `2px solid ${selected ? (T.gold || 'var(--gold)') : (T.border || 'var(--border)')}`,
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      color: selected ? '#000' : (T.text || 'var(--text)'),
      textAlign: 'center',
      transition: 'all 0.2s',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }),
    crewRole: {
      padding: '12px',
      backgroundColor: T.surface || 'var(--surface)',
      border: `1px solid ${T.border || 'var(--border)'}`,
      borderRadius: '6px',
      marginBottom: '8px'
    },
    complicationItem: (severity) => {
      const severityColors = { low: '#4ade80', medium: '#fbbf24', high: '#f87171' };
      return {
        padding: '12px',
        backgroundColor: T.surface || 'var(--surface)',
        border: `2px solid ${severityColors[severity] || '#666'}`,
        borderRadius: '6px',
        marginBottom: '8px'
      };
    },
    heatAction: (type) => {
      const colors = { increase: '#f87171', decrease: '#4ade80', neutral: '#60a5fa' };
      return {
        padding: '8px 12px',
        backgroundColor: colors[type] || '#666',
        color: '#000',
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
      color: T.textDim || 'var(--text-dim)'
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

  const LOCATION_TYPES = ['Vault', 'Mansion', 'Castle', 'Temple', 'Guild Hall', 'Caravan', 'Ship', 'Museum'];
  const REWARD_TIERS = ['Petty', 'Moderate', 'Valuable', 'Legendary'];

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
              <input
                style={styles.input}
                value={newHeist.location}
                onChange={(e) => setNewHeist({...newHeist, location: e.target.value})}
                placeholder="The King's Fortress"
              />
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
              <div style={styles.label}>Difficulty (Skulls)</div>
              <input
                style={styles.input}
                type="range"
                min="1"
                max="5"
                value={newHeist.difficulty}
                onChange={(e) => setNewHeist({...newHeist, difficulty: parseInt(e.target.value)})}
              />
              <div style={{textAlign: 'center', marginTop: '4px', fontSize: '12px'}}>
                {'💀'.repeat(newHeist.difficulty)}
              </div>
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
          Object.values(heists).map(heist => (
            <div key={heist.id} style={styles.card}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px'}}>
                <div style={{flex: 1}}>
                  <h3 style={{margin: '0 0 8px 0', color: T.gold || 'var(--gold)', fontSize: '18px'}}>
                    {heist.name}
                  </h3>
                  <p style={{margin: '4px 0', fontSize: '14px', color: T.textDim || 'var(--text-dim)'}}>
                    <MapPin size={14} style={{display: 'inline', marginRight: '4px'}} />
                    {heist.location} — {heist.type}
                  </p>
                  <p style={{margin: '4px 0', fontSize: '14px'}}>
                    {heist.description}
                  </p>
                  <div style={{display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap'}}>
                    <div style={styles.difficultyBadge(heist.difficulty)}>
                      {'💀'.repeat(heist.difficulty)} {heist.difficulty}/5
                    </div>
                    <div style={{...styles.difficultyBadge(1), backgroundColor: T.accent || '#6366f1'}}>
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
                    style={{...styles.button, backgroundColor: '#f87171'}}
                    onClick={() => deleteHeist(heist.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
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
              <div style={{gridColumn: '1 / -1', textAlign: 'center', color: T.textDim || 'var(--text-dim)', padding: '40px'}}>
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
                  {room.guards > 0 && <div style={{fontSize: '10px', marginTop: '4px'}}>⚔ {room.guards}</div>}
                </div>
              ))
            )}
          </div>
        </div>

        {selectedRoom && rooms[selectedRoom] && (
          <div style={{...styles.card, marginTop: '16px', backgroundColor: T.bg || 'var(--bg)'}}>
            <h4 style={{margin: '0 0 12px 0', color: T.gold || 'var(--gold)'}}>
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

  function CrewPlanning({ heist, setHeist }) {
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

    return (
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <Users size={20} /> Crew Assembly
        </div>

        <div style={{...styles.card, marginBottom: '16px', backgroundColor: T.surface || 'var(--surface)'}}>
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
                  <h4 style={{margin: '0 0 4px 0', color: T.gold || 'var(--gold)'}}>{role.name}</h4>
                  <p style={{margin: '0', fontSize: '12px', color: T.textDim || 'var(--text-dim)'}}>
                    Skills: {role.skills.join(', ')}
                  </p>
                  <p style={{margin: '4px 0 0 0', fontSize: '12px', color: T.textDim || 'var(--text-dim)'}}>
                    Tools: {role.tools.join(', ')}
                  </p>
                </div>
              </div>
              <input
                style={{...styles.input, width: '100%'}}
                placeholder="Assign party member(s) to this role"
                value={(heist.crew && heist.crew[role.name]) || ''}
                onChange={(e) => assignCrew(role.name, e.target.value)}
              />
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
                <h4 style={{margin: 0, flex: 1, color: T.gold || 'var(--gold)'}}>{phase.name}</h4>
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
              <p style={{margin: '0 0 8px 0', fontSize: '12px', color: T.textDim || 'var(--text-dim)'}}>
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

  function ComplicationManager({ heist, setHeist }) {
    const drawComplication = () => {
      const random = COMPLICATIONS[Math.floor(Math.random() * COMPLICATIONS.length)];
      const updated = {...heist};
      if (!updated.complications) updated.complications = [];
      updated.complications.push({
        id: Date.now(),
        ...random,
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
            <div style={{...styles.card, textAlign: 'center', color: T.textDim || 'var(--text-dim)'}}>
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
                    <span style={{fontSize: '12px', textTransform: 'capitalize', color: T.textDim || 'var(--text-dim)'}}>
                      Severity: {comp.severity}
                    </span>
                  </div>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      style={{...styles.button, padding: '6px 8px'}}
                      onClick={() => resolveComplication(comp.id)}
                    >
                      {comp.resolved ? <X size={16} /> : <Check size={16} />}
                    </button>
                    <button
                      style={{...styles.button, padding: '6px 8px', backgroundColor: '#f87171'}}
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
    const updateHeat = (amount) => {
      const updated = {...heist};
      updated.heat = Math.max(0, Math.min(100, updated.heat + amount));
      setHeist(updated);
    };

    const consequences = [
      { threshold: 25, text: 'Local guards on alert' },
      { threshold: 50, text: 'Wanted posters issued' },
      { threshold: 75, text: 'Bounty hunters hired' },
      { threshold: 90, text: 'Guild/Noble sends assassins' }
    ];

    const activeConsequences = consequences.filter(c => heist.heat >= c.threshold);

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
              style={{...styles.button, backgroundColor: '#f87171'}}
              onClick={() => updateHeat(10)}
            >
              +10 Heat
            </button>
            <button
              style={{...styles.button, backgroundColor: '#f87171'}}
              onClick={() => updateHeat(25)}
            >
              +25 Heat
            </button>
            <button
              style={{...styles.button, backgroundColor: '#4ade80'}}
              onClick={() => updateHeat(-10)}
            >
              -10 Heat
            </button>
            <button
              style={{...styles.button, backgroundColor: '#4ade80'}}
              onClick={() => updateHeat(-25)}
            >
              -25 Heat
            </button>
          </div>

          {activeConsequences.length > 0 && (
            <div style={{...styles.card, backgroundColor: '#7f1d1d', borderColor: '#f87171', padding: '12px'}}>
              <h4 style={{margin: '0 0 8px 0', color: '#fca5a5'}}>Active Consequences:</h4>
              {activeConsequences.map((cons, idx) => (
                <p key={idx} style={{margin: '4px 0', fontSize: '14px', color: '#fca5a5'}}>
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

    return (
      <div style={styles.content}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <h2 style={{margin: 0, color: T.gold || 'var(--gold)'}}>
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
            </div>
            <div>
              <div style={styles.label}>Difficulty</div>
              <div style={styles.difficultyBadge(heist.difficulty)}>
                {'💀'.repeat(heist.difficulty)}
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
            <p style={{margin: 0, fontSize: '14px', color: T.textDim || 'var(--text-dim)'}}>{heist.dmNotes}</p>
          </div>
        </div>

        <HeatSystem heist={heist} setHeist={setHeist} />
        <PhaseTracking heist={heist} setHeist={setHeist} />
        <BlueprintEditor heist={heist} setHeist={setHeist} />
        <CrewPlanning heist={heist} setHeist={setHeist} />
        <ComplicationManager heist={heist} setHeist={setHeist} />
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
          <div style={{fontSize: '12px', color: T.textDim || 'var(--text-dim)'}}>
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
