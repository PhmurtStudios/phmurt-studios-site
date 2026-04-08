(function() {
  'use strict';

  const { useState, useEffect, useCallback, useRef, useMemo } = React;
  const { Crown, Eye, EyeOff, Users, Shield, Skull, Lock, Unlock, ChevronDown, ChevronUp, Plus, Edit2, Trash2, Check, X, AlertTriangle, Star, Target, Search, Layers, Activity, Heart, Swords, BookOpen, Sparkles, Undo } = window.LucideReact || {};

  // Theme setup
  const T = window.__PHMURT_THEME || {};
  try {
    if (window.T) Object.assign(T, window.T);
  } catch(e) {}

  // Initialize default data structure
  const initializeIntrigueData = () => ({
    shadowLeader: {
      id: 'leader',
      name: 'The Shadow Leader',
      revealed: false,
      title: 'True Power Behind the Throne',
      status: 'hidden',
      influence: 5,
      clues: [],
      location: 'Unknown',
      notes: 'The ultimate architect of this conspiracy'
    },
    branches: [
      {
        id: 'crown',
        name: 'The Crown',
        icon: Crown,
        description: 'Royal Court manipulation',
        color: '#FFD700',
        powerLevel: 75,
        sage: {
          id: 'sage_crown',
          name: 'The Courtier',
          revealed: false,
          title: 'Royal Advisor',
          status: 'hidden',
          influence: 4,
          clues: [],
          location: 'Palace',
          notes: ''
        },
        agents: [
          { id: 'agent_c1', name: 'Lord Theron', revealed: false, title: 'Chancellor', status: 'hidden', influence: 3, clues: [], location: 'Throne Room', notes: '' },
          { id: 'agent_c2', name: 'Lady Morgeth', revealed: false, title: 'Court Enchantress', status: 'hidden', influence: 3, clues: [], location: 'Tower of Sages', notes: '' },
          { id: 'agent_c3', name: 'Master Aldric', revealed: false, title: 'Head Guard Captain', status: 'hidden', influence: 2, clues: [], location: 'Guard Barracks', notes: '' }
        ]
      },
      {
        id: 'coin',
        name: 'The Coin',
        icon: Users,
        description: 'Economic & merchant guild control',
        color: '#FFB700',
        powerLevel: 68,
        sage: {
          id: 'sage_coin',
          name: 'The Merchant Prince',
          revealed: false,
          title: 'Guild Master',
          status: 'hidden',
          influence: 4,
          clues: [],
          location: 'Merchant District',
          notes: ''
        },
        agents: [
          { id: 'agent_m1', name: 'Kess the Banker', revealed: false, title: 'Master of Coins', status: 'hidden', influence: 3, clues: [], location: 'Treasury House', notes: '' },
          { id: 'agent_m2', name: 'Varys the Trader', revealed: false, title: 'Spice Merchant', status: 'hidden', influence: 3, clues: [], location: 'Market Square', notes: '' },
          { id: 'agent_m3', name: 'Helena Goldsmith', revealed: false, title: 'Jeweler & Fence', status: 'hidden', influence: 2, clues: [], location: 'Jewel Quarter', notes: '' },
          { id: 'agent_m4', name: 'Dorian Cartographer', revealed: false, title: 'Trade Route Master', status: 'hidden', influence: 2, clues: [], location: 'Docks', notes: '' }
        ]
      },
      {
        id: 'sword',
        name: 'The Sword',
        icon: Swords,
        description: 'Military infiltration',
        color: '#FF6B6B',
        powerLevel: 82,
        sage: {
          id: 'sage_sword',
          name: 'The General',
          revealed: false,
          title: 'War Commander',
          status: 'hidden',
          influence: 5,
          clues: [],
          location: 'Military Fortress',
          notes: ''
        },
        agents: [
          { id: 'agent_s1', name: 'Commander Darius', revealed: false, title: 'Colonel of the North', status: 'hidden', influence: 4, clues: [], location: 'Northern Camp', notes: '' },
          { id: 'agent_s2', name: 'Captain Lena', revealed: false, title: 'Shadow Ops', status: 'hidden', influence: 3, clues: [], location: 'Secret Base', notes: '' },
          { id: 'agent_s3', name: 'Sergeant Vex', revealed: false, title: 'Supply Master', status: 'hidden', influence: 2, clues: [], location: 'Armory', notes: '' }
        ]
      },
      {
        id: 'eye',
        name: 'The Eye',
        icon: Eye,
        description: 'Spy network & information control',
        color: '#9D84B7',
        powerLevel: 71,
        sage: {
          id: 'sage_eye',
          name: 'The Spymaster',
          revealed: false,
          title: 'Master of Shadows',
          status: 'hidden',
          influence: 4,
          clues: [],
          location: 'Hidden Lair',
          notes: ''
        },
        agents: [
          { id: 'agent_e1', name: 'Whisper', revealed: false, title: 'Information Broker', status: 'hidden', influence: 3, clues: [], location: 'Tavern', notes: '' },
          { id: 'agent_e2', name: 'Rook', revealed: false, title: 'Street Informant', status: 'hidden', influence: 2, clues: [], location: 'Underworld', notes: '' },
          { id: 'agent_e3', name: 'Maven', revealed: false, title: 'Scholar & Archive', status: 'hidden', influence: 3, clues: [], location: 'Library', notes: '' },
          { id: 'agent_e4', name: 'Shadow', revealed: false, title: 'Assassin', status: 'hidden', influence: 4, clues: [], location: 'Rooftops', notes: '' }
        ]
      },
      {
        id: 'whisper',
        name: 'The Whisper',
        icon: BookOpen,
        description: 'Religious manipulation',
        color: '#A78BFA',
        powerLevel: 64,
        sage: {
          id: 'sage_whisper',
          name: 'The High Priest',
          revealed: false,
          title: 'Divine Authority',
          status: 'hidden',
          influence: 4,
          clues: [],
          location: 'Temple',
          notes: ''
        },
        agents: [
          { id: 'agent_w1', name: 'Bishop Aldric', revealed: false, title: 'Temple Administrator', status: 'hidden', influence: 3, clues: [], location: 'Sacred Temple', notes: '' },
          { id: 'agent_w2', name: 'Priestess Lyra', revealed: false, title: 'Oracle', status: 'hidden', influence: 3, clues: [], location: 'Shrine', notes: '' },
          { id: 'agent_w3', name: 'Monk Thorne', revealed: false, title: 'Scribe', status: 'hidden', influence: 2, clues: [], location: 'Monastery', notes: '' }
        ]
      },
      {
        id: 'mask',
        name: 'The Mask',
        icon: AlertTriangle,
        description: 'Underground & criminal control',
        color: '#FF1744',
        powerLevel: 79,
        sage: {
          id: 'sage_mask',
          name: 'The Crime Lord',
          revealed: false,
          title: 'Underworld Boss',
          status: 'hidden',
          influence: 5,
          clues: [],
          location: 'Underground',
          notes: ''
        },
        agents: [
          { id: 'agent_k1', name: 'Blackthorn', revealed: false, title: 'Assassin Guild Leader', status: 'hidden', influence: 4, clues: [], location: 'Guild Hall', notes: '' },
          { id: 'agent_k2', name: 'Scar', revealed: false, title: 'Thief', status: 'hidden', influence: 3, clues: [], location: 'Slums', notes: '' },
          { id: 'agent_k3', name: 'Echo', revealed: false, title: 'Fence', status: 'hidden', influence: 2, clues: [], location: 'Black Market', notes: '' },
          { id: 'agent_k4', name: 'Raze', revealed: false, title: 'Enforcer', status: 'hidden', influence: 3, clues: [], location: 'Docks', notes: '' }
        ]
      }
    ],
    events: [
      { id: 'evt1', date: 'Day 1', title: 'Suspicious Meeting', description: 'Three nobles met in secret at midnight', linkedAgents: [] }
    ]
  });

  // MAIN COMPONENT
  function CourtIntrigueView({ data, setData, viewRole }) {
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [selectedBranchId, setSelectedBranchId] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [panX, setPanX] = useState(0);
    const [panY, setPanY] = useState(0);
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [showCluePanel, setShowCluePanel] = useState(false);
    const [newClueText, setNewClueText] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const containerRef = useRef(null);

    const intrigue = data.intrigue || initializeIntrigueData();

    const isDM = viewRole === 'DM' || viewRole === 'dm';

    // Initialize data if needed
    useEffect(() => {
      if (!data.intrigue) {
        setData(prev => {
          const d = { ...prev };
          d.intrigue = initializeIntrigueData();
          return d;
        });
      }
    }, []);

    // Update intrigue data
    const updateIntrigue = useCallback((updates) => {
      setData(prev => {
        const d = { ...prev };
        d.intrigue = { ...intrigue, ...updates };
        return d;
      });
    }, [intrigue]);

    // Update a specific agent
    const updateAgent = useCallback((agentId, updates) => {
      const newIntrigue = JSON.parse(JSON.stringify(intrigue));

      // Check shadow leader
      if (newIntrigue.shadowLeader.id === agentId) {
        Object.assign(newIntrigue.shadowLeader, updates);
      } else {
        // Check branches
        for (let branch of newIntrigue.branches) {
          if (branch.sage.id === agentId) {
            Object.assign(branch.sage, updates);
            break;
          }
          const agent = branch.agents.find(a => a.id === agentId);
          if (agent) {
            Object.assign(agent, updates);
            break;
          }
        }
      }

      updateIntrigue(newIntrigue);
    }, [intrigue, updateIntrigue]);

    // Calculate positions for radial layout
    const calculateNodePosition = useCallback((index, total, radius, centerX, centerY) => {
      const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { x, y, angle };
    }, []);

    // Pan handlers
    const handleContainerMouseDown = (e) => {
      if (e.button === 2) {
        setIsPanning(true);
        setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
        e.preventDefault();
      }
    };

    const handleContainerMouseMove = (e) => {
      if (isPanning) {
        setPanX(e.clientX - panStart.x);
        setPanY(e.clientY - panStart.y);
      }
    };

    const handleContainerMouseUp = () => {
      setIsPanning(false);
    };

    // Get agent details
    const getAgentDetails = useCallback((agentId) => {
      if (intrigue.shadowLeader.id === agentId) return intrigue.shadowLeader;

      for (let branch of intrigue.branches) {
        if (branch.sage.id === agentId) return branch.sage;
        const agent = branch.agents.find(a => a.id === agentId);
        if (agent) return agent;
      }
      return null;
    }, [intrigue]);

    // Get parent of agent (branch or leader)
    const getAgentParent = useCallback((agentId) => {
      for (let branch of intrigue.branches) {
        if (branch.sage.id === agentId) return { type: 'branch', data: branch };
        if (branch.agents.some(a => a.id === agentId)) return { type: 'branch', data: branch };
      }
      return null;
    }, [intrigue]);

    // Calculate total conspiracy power
    const totalPower = useMemo(() => {
      const branchPower = intrigue.branches.reduce((sum, b) => sum + b.powerLevel, 0);
      return Math.round((branchPower / (intrigue.branches.length * 100)) * 100);
    }, [intrigue.branches]);

    // Web dimensions
    const webWidth = 1000;
    const webHeight = 1000;
    const centerX = webWidth / 2;
    const centerY = webHeight / 2;
    const leaderRadius = 80;
    const sageRadius = 250;
    const agentRadius = 450;

    const styles = {
      container: {
        display: 'flex',
        height: '100vh',
        background: `linear-gradient(135deg, ${T.bg || '#0a0e27'} 0%, ${T.bg || '#1a1f3a'} 100%)`,
        fontFamily: T.ui || 'system-ui, -apple-system, sans-serif',
        color: T.text || '#e0e0e0',
        overflow: 'hidden'
      },
      mainArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      },
      header: {
        padding: '20px 24px',
        borderBottom: `1px solid ${T.border || 'rgba(255, 215, 0, 0.1)'}`,
        background: `rgba(0, 0, 0, 0.3)`,
        backdropFilter: 'blur(10px)'
      },
      headerTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: T.gold || '#FFD700',
        marginBottom: '8px',
        fontFamily: T.heading || 'serif'
      },
      headerSubtitle: {
        fontSize: '13px',
        color: T.textDim || '#888',
        display: 'flex',
        gap: '16px',
        alignItems: 'center'
      },
      webCanvas: {
        flex: 1,
        position: 'relative',
        overflow: 'auto',
        background: `radial-gradient(ellipse at center, rgba(255,215,0,0.03) 0%, transparent 70%),
                     repeating-linear-gradient(0deg, rgba(255,215,0,0.02) 0px, rgba(255,215,0,0.02) 1px, transparent 1px, transparent 2px)`,
        cursor: isPanning ? 'grabbing' : 'grab'
      },
      webContent: {
        position: 'relative',
        width: webWidth,
        height: webHeight,
        margin: 'auto',
        transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
        transformOrigin: '0 0',
        transition: isPanning ? 'none' : 'transform 0.2s ease'
      },
      webBg: {
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: `radial-gradient(circle at center,
                     rgba(255,215,0,0.05) 0%,
                     rgba(255,215,0,0.02) 30%,
                     transparent 70%)`,
        pointerEvents: 'none'
      },
      controls: {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '8px',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        padding: '8px',
        borderRadius: '8px',
        border: `1px solid ${T.border || 'rgba(255, 215, 0, 0.2)'}`,
        zIndex: 100
      },
      controlBtn: {
        width: '32px',
        height: '32px',
        border: 'none',
        background: 'rgba(255, 215, 0, 0.1)',
        color: T.gold || '#FFD700',
        cursor: 'pointer',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        transition: 'all 0.2s',
        fontWeight: 'bold'
      },
      detailPanel: {
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: '420px',
        background: `linear-gradient(180deg, ${T.surface || '#1a1f3a'} 0%, ${T.bg || '#0a0e27'} 100%)`,
        borderLeft: `2px solid ${T.gold || '#FFD700'}`,
        boxShadow: '0 0 60px rgba(255, 215, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        animation: 'slideIn 0.3s ease'
      },
      detailClose: {
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: 'none',
        border: 'none',
        color: T.gold || '#FFD700',
        cursor: 'pointer',
        fontSize: '20px',
        padding: '4px'
      },
      detailContent: {
        flex: 1,
        overflowY: 'auto',
        padding: '32px 24px 24px'
      },
      detailHeader: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: T.gold || '#FFD700',
        marginBottom: '16px',
        fontFamily: T.heading || 'serif'
      },
      detailField: {
        marginBottom: '16px'
      },
      detailLabel: {
        fontSize: '11px',
        fontWeight: '600',
        color: T.textDim || '#888',
        textTransform: 'uppercase',
        marginBottom: '4px',
        letterSpacing: '1px'
      },
      detailValue: {
        fontSize: '14px',
        color: T.text || '#e0e0e0',
        wordBreak: 'break-word'
      },
      statusBadge: {
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        marginBottom: '12px'
      },
      buttonGroup: {
        display: 'flex',
        gap: '8px',
        paddingTop: '16px',
        borderTop: `1px solid ${T.border || 'rgba(255, 215, 0, 0.1)'}`
      },
      button: {
        flex: 1,
        padding: '10px 12px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
      }
    };

    const statusColors = {
      hidden: 'rgba(100, 100, 150, 0.6)',
      suspected: 'rgba(255, 200, 0, 0.6)',
      revealed: 'rgba(76, 175, 80, 0.6)',
      eliminated: 'rgba(244, 67, 54, 0.6)',
      turned: 'rgba(103, 58, 183, 0.6)'
    };

    // Render a single agent node
    const AgentNode = ({ agent, branchColor, parentData, isLeader = false }) => {
      const isSelected = selectedAgent?.id === agent.id;
      const isEliminated = agent.status === 'eliminated';
      const isRevealed = agent.revealed;

      let radius = agentRadius;
      let index = 0;
      let total = intrigue.branches.length;

      if (isLeader) {
        radius = 0;
        index = 0;
        total = 1;
      } else if (parentData) {
        if (parentData.type === 'sage') {
          radius = sageRadius;
          index = parentData.index;
          total = intrigue.branches.length;
        } else if (parentData.type === 'agent') {
          const sage = parentData.sage;
          const agentIndex = parentData.sage.agents.indexOf(agent);
          const numAgents = parentData.sage.agents.length;
          const sagePos = calculateNodePosition(parentData.index, intrigue.branches.length, sageRadius, centerX, centerY);
          const angleSpread = Math.PI / 3;
          const startAngle = sagePos.angle - angleSpread / 2;
          const angle = startAngle + (agentIndex / numAgents) * angleSpread;
          const x = centerX + agentRadius * Math.cos(angle);
          const y = centerY + agentRadius * Math.sin(angle);

          const nodeStyle = {
            position: 'absolute',
            left: x - 24,
            top: y - 24,
            width: '48px',
            height: '48px',
            cursor: 'pointer',
            zIndex: isSelected ? 50 : 10,
            transition: 'all 0.3s'
          };

          return (
            <div key={agent.id} style={nodeStyle} onClick={() => setSelectedAgent(agent)}>
              <AgentHexagon agent={agent} isRevealed={isRevealed} isEliminated={isEliminated} branchColor={branchColor} isSelected={isSelected} />
            </div>
          );
        }
      }

      const pos = calculateNodePosition(index, total, radius, centerX, centerY);
      const nodeStyle = {
        position: 'absolute',
        left: pos.x - 24,
        top: pos.y - 24,
        width: '48px',
        height: '48px',
        cursor: 'pointer',
        zIndex: isSelected ? 50 : 10,
        transition: 'all 0.3s'
      };

      return (
        <div key={agent.id} style={nodeStyle} onClick={() => setSelectedAgent(agent)}>
          <AgentHexagon agent={agent} isRevealed={isRevealed} isEliminated={isEliminated} branchColor={branchColor} isSelected={isSelected} />
        </div>
      );
    };

    // Hexagon node component
    const AgentHexagon = ({ agent, isRevealed, isEliminated, branchColor, isSelected }) => {
      const getStatusColor = () => {
        if (isEliminated) return '#FF1744';
        if (isRevealed) return '#4CAF50';
        return '#555';
      };

      return (
        <div style={{
          position: 'relative',
          width: '48px',
          height: '48px',
          background: getStatusColor(),
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          border: isSelected ? `2px solid ${T.gold || '#FFD700'}` : `1px solid ${branchColor}`,
          boxShadow: isSelected ? `0 0 30px ${T.gold || '#FFD700'}, inset 0 0 20px rgba(255,215,0,0.3)` : `0 0 10px ${branchColor}80`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: !isRevealed && !isEliminated ? 'pulse 2s infinite' : 'none',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}>
          {isEliminated ? (
            <span style={{ fontSize: '24px', color: '#fff', fontWeight: 'bold' }}>✕</span>
          ) : isRevealed ? (
            <span style={{ fontSize: '16px', color: '#fff', fontWeight: 'bold' }}>✓</span>
          ) : (
            <span style={{ fontSize: '20px', color: '#999', fontWeight: 'bold' }}>?</span>
          )}
        </div>
      );
    };

    // Connection line between nodes
    const ConnectionLine = ({ x1, y1, x2, y2, color = '#FFD700' }) => {
      const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const angle = Math.atan2(y2 - y1, x2 - x1);

      return (
        <div style={{
          position: 'absolute',
          left: x1,
          top: y1,
          width: length,
          height: '1px',
          background: `linear-gradient(to right, ${color}80, ${color}20)`,
          transform: `rotate(${angle}rad)`,
          transformOrigin: '0 0',
          pointerEvents: 'none'
        }} />
      );
    };

    // Get status badge color
    const getStatusBadgeStyle = (status) => {
      const statusMap = {
        hidden: { bg: 'rgba(100, 100, 150, 0.6)', text: '#b0b0e0' },
        suspected: { bg: 'rgba(255, 200, 0, 0.6)', text: '#ffe066' },
        revealed: { bg: 'rgba(76, 175, 80, 0.6)', text: '#81c784' },
        eliminated: { bg: 'rgba(244, 67, 54, 0.6)', text: '#ef5350' },
        turned: { bg: 'rgba(103, 58, 183, 0.6)', text: '#b39ddb' }
      };
      const s = statusMap[status] || statusMap.hidden;
      return { background: s.bg, color: s.text };
    };

    return (
      <div style={styles.container}>
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(420px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { box-shadow: 0 0 10px rgba(255,215,0,0.4), inset 0 0 10px rgba(255,215,0,0.1); }
            50% { box-shadow: 0 0 20px rgba(255,215,0,0.6), inset 0 0 15px rgba(255,215,0,0.2); }
          }
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 10px rgba(255,215,0,0.5); }
            50% { text-shadow: 0 0 20px rgba(255,215,0,0.8); }
          }
          .intrigue-scroll::-webkit-scrollbar {
            width: 8px;
          }
          .intrigue-scroll::-webkit-scrollbar-track {
            background: rgba(255, 215, 0, 0.05);
          }
          .intrigue-scroll::-webkit-scrollbar-thumb {
            background: rgba(255, 215, 0, 0.3);
            border-radius: 4px;
          }
          .intrigue-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 215, 0, 0.5);
          }
        `}
        <div style={styles.mainArea}>
          {/* HEADER */}
          <div style={styles.header}>
            <div style={styles.headerTitle}>
              <Crown size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              The Court Intrigue Web
            </div>
            <div style={styles.headerSubtitle}>
              <span>
                <Sparkles size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                Power Level: <strong style={{ color: T.gold || '#FFD700' }}>{totalPower}%</strong>
              </span>
              <span>
                <Users size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                {intrigue.branches.length} Branches
              </span>
              <span>
                <Target size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                {intrigue.branches.reduce((sum, b) => sum + b.agents.length, 0)} Agents
              </span>
            </div>
          </div>

          {/* WEB CANVAS */}
          <div
            style={styles.webCanvas}
            ref={containerRef}
            onMouseDown={handleContainerMouseDown}
            onMouseMove={handleContainerMouseMove}
            onMouseUp={handleContainerMouseUp}
            onMouseLeave={handleContainerMouseUp}
            onContextMenu={(e) => e.preventDefault()}
            className="intrigue-scroll"
          >
            <div style={styles.webContent}>
              <div style={styles.webBg} />

              {/* Draw connection lines from shadow leader to sages */}
              {intrigue.branches.map((branch, idx) => {
                const sagePos = calculateNodePosition(idx, intrigue.branches.length, sageRadius, centerX, centerY);
                return (
                  <ConnectionLine key={`line_leader_${branch.id}`} x1={centerX} y1={centerY} x2={sagePos.x} y2={sagePos.y} color={branch.color} />
                );
              })}

              {/* Draw connection lines from sages to their agents */}
              {intrigue.branches.map((branch, branchIdx) => {
                const sagePos = calculateNodePosition(branchIdx, intrigue.branches.length, sageRadius, centerX, centerY);
                const angleSpread = Math.PI / 3;
                const startAngle = sagePos.angle - angleSpread / 2;

                return branch.agents.map((agent, agentIdx) => {
                  const angle = startAngle + (agentIdx / branch.agents.length) * angleSpread;
                  const agentX = centerX + agentRadius * Math.cos(angle);
                  const agentY = centerY + agentRadius * Math.sin(angle);
                  return (
                    <ConnectionLine
                      key={`line_${branch.id}_${agent.id}`}
                      x1={sagePos.x}
                      y1={sagePos.y}
                      x2={agentX}
                      y2={agentY}
                      color={branch.color}
                    />
                  );
                });
              })}

              {/* SHADOW LEADER (center) */}
              <div
                style={{
                  position: 'absolute',
                  left: centerX - 48,
                  top: centerY - 48,
                  width: '96px',
                  height: '96px',
                  cursor: 'pointer',
                  zIndex: selectedAgent?.id === 'leader' ? 50 : 20
                }}
                onClick={() => setSelectedAgent(intrigue.shadowLeader)}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: intrigue.shadowLeader.revealed ? '#FFD700' : '#333',
                  borderRadius: '50%',
                  border: selectedAgent?.id === 'leader' ? `3px solid ${T.gold || '#FFD700'}` : `2px solid ${T.gold || '#FFD700'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: selectedAgent?.id === 'leader'
                    ? `0 0 40px ${T.gold || '#FFD700'}, inset 0 0 30px rgba(255,215,0,0.4)`
                    : `0 0 25px ${T.gold || '#FFD700'}80, inset 0 0 15px rgba(255,215,0,0.2)`,
                  transition: 'all 0.3s',
                  animation: !intrigue.shadowLeader.revealed ? 'pulse 3s infinite' : 'none',
                  fontFamily: T.heading || 'serif',
                  fontSize: '48px',
                  fontWeight: 'bold'
                }}>
                  {intrigue.shadowLeader.revealed ? '👑' : '?'}
                </div>
              </div>

              {/* BRANCH SAGES AND AGENTS */}
              {intrigue.branches.map((branch, branchIdx) => {
                const sagePos = calculateNodePosition(branchIdx, intrigue.branches.length, sageRadius, centerX, centerY);

                return (
                  <div key={branch.id}>
                    {/* SAGE */}
                    <div
                      style={{
                        position: 'absolute',
                        left: sagePos.x - 32,
                        top: sagePos.y - 32,
                        width: '64px',
                        height: '64px',
                        cursor: 'pointer',
                        zIndex: selectedAgent?.id === branch.sage.id ? 50 : 20
                      }}
                      onClick={() => setSelectedAgent(branch.sage)}
                    >
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: branch.sage.revealed ? branch.color : '#444',
                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                        border: selectedAgent?.id === branch.sage.id ? `2px solid ${T.gold || '#FFD700'}` : `1px solid ${branch.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: selectedAgent?.id === branch.sage.id
                          ? `0 0 30px ${T.gold || '#FFD700'}, inset 0 0 20px rgba(255,215,0,0.3)`
                          : `0 0 15px ${branch.color}80`,
                        transition: 'all 0.2s',
                        animation: !branch.sage.revealed ? 'pulse 2s infinite' : 'none',
                        fontWeight: 'bold'
                      }}>
                        {branch.sage.status === 'eliminated' ? '✕' : branch.sage.revealed ? '✓' : '?'}
                      </div>
                    </div>

                    {/* AGENTS */}
                    {(() => {
                      const angleSpread = Math.PI / 3;
                      const startAngle = sagePos.angle - angleSpread / 2;

                      return branch.agents.map((agent, agentIdx) => {
                        const angle = startAngle + (agentIdx / branch.agents.length) * angleSpread;
                        const agentX = centerX + agentRadius * Math.cos(angle);
                        const agentY = centerY + agentRadius * Math.sin(angle);

                        return (
                          <div
                            key={agent.id}
                            style={{
                              position: 'absolute',
                              left: agentX - 24,
                              top: agentY - 24,
                              width: '48px',
                              height: '48px',
                              cursor: 'pointer',
                              zIndex: selectedAgent?.id === agent.id ? 50 : 10
                            }}
                            onClick={() => setSelectedAgent(agent)}
                          >
                            <div style={{
                              position: 'relative',
                              width: '100%',
                              height: '100%',
                              background: agent.revealed ? '#4CAF50' : agent.status === 'eliminated' ? '#FF1744' : '#555',
                              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                              border: selectedAgent?.id === agent.id ? `2px solid ${T.gold || '#FFD700'}` : `1px solid ${branch.color}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: selectedAgent?.id === agent.id
                                ? `0 0 30px ${T.gold || '#FFD700'}, inset 0 0 20px rgba(255,215,0,0.3)`
                                : `0 0 10px ${branch.color}80`,
                              transition: 'all 0.2s',
                              animation: !agent.revealed && agent.status !== 'eliminated' ? 'pulse 2s infinite' : 'none',
                              fontWeight: 'bold'
                            }}>
                              {agent.status === 'eliminated' ? '✕' : agent.revealed ? '✓' : '?'}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                );
              })}

              {/* LEGEND RINGS (optional visual guides) */}
              <div style={{
                position: 'absolute',
                left: centerX - agentRadius,
                top: centerY - agentRadius,
                width: agentRadius * 2,
                height: agentRadius * 2,
                border: '1px solid rgba(255, 215, 0, 0.1)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }} />
              <div style={{
                position: 'absolute',
                left: centerX - sageRadius,
                top: centerY - sageRadius,
                width: sageRadius * 2,
                height: sageRadius * 2,
                border: '1px solid rgba(255, 215, 0, 0.15)',
                borderRadius: '50%',
                pointerEvents: 'none'
              }} />
            </div>
          </div>

          {/* ZOOM CONTROLS */}
          <div style={styles.controls}>
            <button
              style={{
                ...styles.controlBtn,
                opacity: zoom >= 2 ? 0.5 : 1,
                cursor: zoom >= 2 ? 'not-allowed' : 'pointer'
              }}
              onClick={() => setZoom(Math.min(2, zoom + 0.2))}
              title="Zoom in"
              disabled={zoom >= 2}
            >
              +
            </button>
            <span style={{
              color: T.textDim || '#888',
              fontSize: '12px',
              padding: '0 8px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              style={{
                ...styles.controlBtn,
                opacity: zoom <= 0.5 ? 0.5 : 1,
                cursor: zoom <= 0.5 ? 'not-allowed' : 'pointer'
              }}
              onClick={() => setZoom(Math.max(0.5, zoom - 0.2))}
              title="Zoom out"
              disabled={zoom <= 0.5}
            >
              -
            </button>
            <div style={{ width: '1px', background: 'rgba(255, 215, 0, 0.2)' }} />
            <button
              style={styles.controlBtn}
              onClick={() => { setZoom(1); setPanX(0); setPanY(0); }}
              title="Reset view"
            >
              ⊙
            </button>
          </div>
        </div>

        {/* DETAIL PANEL */}
        {selectedAgent && (
          <div style={styles.detailPanel}>
            <button
              style={styles.detailClose}
              onClick={() => setSelectedAgent(null)}
              title="Close panel"
            >
              ✕
            </button>

            <div style={styles.detailContent}>
              {/* PORTRAIT */}
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 20px',
                background: selectedAgent.revealed ? '#4CAF50' : '#444',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${T.gold || '#FFD700'}`,
                fontSize: '48px',
                boxShadow: `0 0 20px ${T.gold || '#FFD700'}80`
              }}>
                {selectedAgent.status === 'eliminated' ? '☠' : selectedAgent.revealed ? '👤' : '?'}
              </div>

              {/* NAME */}
              <div style={styles.detailHeader}>
                {selectedAgent.revealed || isDM ? selectedAgent.name : 'Unknown Agent'}
              </div>

              {/* STATUS BADGE */}
              {selectedAgent.id !== 'leader' && (
                <div style={{
                  ...styles.statusBadge,
                  ...getStatusBadgeStyle(selectedAgent.status)
                }}>
                  {selectedAgent.status.charAt(0).toUpperCase() + selectedAgent.status.slice(1)}
                </div>
              )}

              {/* DETAILS */}
              <div style={styles.detailField}>
                <div style={styles.detailLabel}>Title / Position</div>
                <div style={styles.detailValue}>{selectedAgent.title}</div>
              </div>

              {(selectedAgent.revealed || isDM) && (
                <div style={styles.detailField}>
                  <div style={styles.detailLabel}>Status</div>
                  <div style={styles.detailValue}>{selectedAgent.status}</div>
                </div>
              )}

              <div style={styles.detailField}>
                <div style={styles.detailLabel}>Last Known Location</div>
                <div style={styles.detailValue}>{selectedAgent.location}</div>
              </div>

              <div style={styles.detailField}>
                <div style={styles.detailLabel}>Influence</div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < selectedAgent.influence ? T.gold || '#FFD700' : 'transparent'}
                      color={i < selectedAgent.influence ? T.gold || '#FFD700' : T.textDim || '#666'}
                    />
                  ))}
                </div>
              </div>

              {(selectedAgent.revealed || isDM) && selectedAgent.clues?.length > 0 && (
                <div style={styles.detailField}>
                  <div style={styles.detailLabel}>Clues Found ({selectedAgent.clues.length})</div>
                  <div style={{
                    background: 'rgba(255, 215, 0, 0.05)',
                    borderLeft: `2px solid ${T.gold || '#FFD700'}`,
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '13px'
                  }}>
                    {selectedAgent.clues.map((clue, idx) => (
                      <div key={idx} style={{ marginBottom: idx < selectedAgent.clues.length - 1 ? '8px' : 0 }}>
                        • {clue}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isDM && (
                <>
                  <div style={styles.detailField}>
                    <div style={styles.detailLabel}>DM Notes</div>
                    <textarea
                      value={selectedAgent.notes || ''}
                      onChange={(e) => updateAgent(selectedAgent.id, { notes: e.target.value })}
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: `1px solid ${T.border || 'rgba(255, 215, 0, 0.2)'}`,
                        color: T.text || '#e0e0e0',
                        padding: '8px',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        resize: 'none'
                      }}
                      placeholder="Private DM notes..."
                    />
                  </div>

                  <div style={styles.buttonGroup}>
                    {!selectedAgent.revealed && selectedAgent.id !== 'leader' && (
                      <button
                        style={{
                          ...styles.button,
                          background: 'rgba(76, 175, 80, 0.6)',
                          color: '#81c784'
                        }}
                        onClick={() => updateAgent(selectedAgent.id, { revealed: true })}
                      >
                        <Eye size={14} /> Reveal
                      </button>
                    )}

                    {selectedAgent.status !== 'eliminated' && selectedAgent.id !== 'leader' && (
                      <button
                        style={{
                          ...styles.button,
                          background: 'rgba(244, 67, 54, 0.6)',
                          color: '#ef5350'
                        }}
                        onClick={() => updateAgent(selectedAgent.id, { status: 'eliminated' })}
                      >
                        <Skull size={14} /> Eliminate
                      </button>
                    )}

                    {selectedAgent.status === 'eliminated' && selectedAgent.id !== 'leader' && (
                      <button
                        style={{
                          ...styles.button,
                          background: 'rgba(100, 100, 150, 0.6)',
                          color: '#b0b0e0'
                        }}
                        onClick={() => updateAgent(selectedAgent.id, { status: 'hidden' })}
                      >
                        <Undo size={14} /> Restore
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  window.CourtIntrigueView = CourtIntrigueView;
})();