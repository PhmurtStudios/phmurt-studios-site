(function() {
  'use strict';

  const { useState, useEffect, useCallback, useRef, useMemo, Fragment } = React;
  const { Crown, Eye, EyeOff, Users, Shield, Skull, Lock, Unlock, ChevronDown, ChevronUp, Plus, Edit2, Trash2, Check, X, AlertTriangle, Star, Target, Search, Layers, Activity, Heart, Swords, BookOpen, Sparkles, RotateCcw, ArrowLeft, ChevronRight, MapPin, FileText, Zap, Network, UserPlus, Copy, MoreVertical, Circle } = window.LucideReact || {};

  const T = window.__PHMURT_THEME || {};
  try { if (window.T) Object.assign(T, window.T); } catch(e) {}

  /* ───────────────────── STATUS SYSTEM ───────────────────── */
  const STATUS = {
    hidden:     { label: 'Hidden',     color: 'rgba(120,120,170,0.7)', text: '#b0b0e0', icon: EyeOff },
    suspected:  { label: 'Suspected',  color: 'rgba(255,200,0,0.6)',   text: '#ffe066', icon: Search },
    revealed:   { label: 'Revealed',   color: 'rgba(76,175,80,0.6)',   text: '#81c784', icon: Eye },
    eliminated: { label: 'Eliminated', color: 'rgba(220,60,50,0.6)',   text: '#ef5350', icon: Skull },
    turned:     { label: 'Turned',     color: 'rgba(130,80,220,0.6)',  text: '#b39ddb', icon: RotateCcw },
    fled:       { label: 'Fled',       color: 'rgba(100,100,100,0.5)', text: '#999',    icon: ArrowLeft },
  };
  const STATUS_KEYS = Object.keys(STATUS);
  const RANK_LABELS = { leader: 'Arch-Conspirator', sage: 'Inner Circle', agent: 'Operative', asset: 'Asset' };

  /* ───────────────────── DEFAULT DATA ───────────────────── */
  const uid = () => 'i_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);

  const makeAgent = (o) => ({
    id: uid(), name: 'Unknown Agent', title: '', rank: 'agent',
    status: 'hidden', revealed: false, influence: 2,
    location: '', notes: '', clues: [], connections: [], ...o,
  });

  const makeBranch = (o) => ({
    id: uid(), name: 'New Faction', description: '',
    colorHue: Math.floor(Math.random() * 360), powerLevel: 50,
    sage: makeAgent({ rank: 'sage', name: 'Unknown Leader', influence: 4 }),
    agents: [], missions: [], events: [], ...o,
  });

  const initializeIntrigueData = () => ({
    shadowLeader: makeAgent({
      id: 'leader', name: 'The Shadow Leader', rank: 'leader',
      title: 'True Power Behind the Throne', influence: 5,
      location: 'Unknown', notes: 'The ultimate architect of this conspiracy',
    }),
    branches: [
      makeBranch({ id: 'crown', name: 'The Crown', description: 'Royal Court manipulation', colorHue: 45, powerLevel: 75,
        sage: makeAgent({ id: 'sage_crown', rank: 'sage', name: 'The Courtier', title: 'Royal Advisor', influence: 4, location: 'Palace' }),
        agents: [
          makeAgent({ id: 'a_c1', name: 'Lord Theron', title: 'Chancellor', influence: 3, location: 'Throne Room' }),
          makeAgent({ id: 'a_c2', name: 'Lady Morgeth', title: 'Court Enchantress', influence: 3, location: 'Tower of Sages' }),
          makeAgent({ id: 'a_c3', name: 'Master Aldric', title: 'Head Guard Captain', influence: 2, location: 'Guard Barracks' }),
        ],
      }),
      makeBranch({ id: 'coin', name: 'The Coin', description: 'Economic & merchant guild control', colorHue: 35, powerLevel: 68,
        sage: makeAgent({ id: 'sage_coin', rank: 'sage', name: 'The Merchant Prince', title: 'Guild Master', influence: 4, location: 'Merchant District' }),
        agents: [
          makeAgent({ id: 'a_m1', name: 'Kess the Banker', title: 'Master of Coins', influence: 3, location: 'Treasury House' }),
          makeAgent({ id: 'a_m2', name: 'Varys the Trader', title: 'Spice Merchant', influence: 3, location: 'Market Square' }),
          makeAgent({ id: 'a_m3', name: 'Helena Goldsmith', title: 'Jeweler & Fence', influence: 2, location: 'Jewel Quarter' }),
        ],
      }),
      makeBranch({ id: 'sword', name: 'The Sword', description: 'Military infiltration', colorHue: 0, powerLevel: 82,
        sage: makeAgent({ id: 'sage_sword', rank: 'sage', name: 'The General', title: 'War Commander', influence: 5, location: 'Military Fortress' }),
        agents: [
          makeAgent({ id: 'a_s1', name: 'Commander Darius', title: 'Colonel of the North', influence: 4, location: 'Northern Camp' }),
          makeAgent({ id: 'a_s2', name: 'Captain Lena', title: 'Shadow Ops', influence: 3, location: 'Secret Base' }),
          makeAgent({ id: 'a_s3', name: 'Sergeant Vex', title: 'Supply Master', influence: 2, location: 'Armory' }),
        ],
      }),
      makeBranch({ id: 'eye', name: 'The Eye', description: 'Spy network & information control', colorHue: 210, powerLevel: 71,
        sage: makeAgent({ id: 'sage_eye', rank: 'sage', name: 'The Spymaster', title: 'Master of Shadows', influence: 4, location: 'Hidden Lair' }),
        agents: [
          makeAgent({ id: 'a_e1', name: 'Whisper', title: 'Information Broker', influence: 3, location: 'Tavern' }),
          makeAgent({ id: 'a_e2', name: 'Rook', title: 'Street Informant', influence: 2, location: 'Underworld' }),
          makeAgent({ id: 'a_e3', name: 'Maven', title: 'Scholar & Archive', influence: 3, location: 'Library' }),
          makeAgent({ id: 'a_e4', name: 'Shadow', title: 'Assassin', influence: 4, location: 'Rooftops' }),
        ],
      }),
      makeBranch({ id: 'whisper', name: 'The Whisper', description: 'Religious manipulation', colorHue: 270, powerLevel: 64,
        sage: makeAgent({ id: 'sage_whisper', rank: 'sage', name: 'The High Priest', title: 'Divine Authority', influence: 4, location: 'Temple' }),
        agents: [
          makeAgent({ id: 'a_w1', name: 'Bishop Aldric', title: 'Temple Administrator', influence: 3, location: 'Sacred Temple' }),
          makeAgent({ id: 'a_w2', name: 'Priestess Lyra', title: 'Oracle', influence: 3, location: 'Shrine' }),
        ],
      }),
      makeBranch({ id: 'mask', name: 'The Mask', description: 'Underground & criminal control', colorHue: 350, powerLevel: 79,
        sage: makeAgent({ id: 'sage_mask', rank: 'sage', name: 'The Crime Lord', title: 'Underworld Boss', influence: 5, location: 'Underground' }),
        agents: [
          makeAgent({ id: 'a_k1', name: 'Blackthorn', title: 'Assassin Guild Leader', influence: 4, location: 'Guild Hall' }),
          makeAgent({ id: 'a_k2', name: 'Scar', title: 'Thief', influence: 3, location: 'Slums' }),
          makeAgent({ id: 'a_k3', name: 'Echo', title: 'Fence', influence: 2, location: 'Black Market' }),
          makeAgent({ id: 'a_k4', name: 'Raze', title: 'Enforcer', influence: 3, location: 'Docks' }),
        ],
      }),
    ],
    clueBoard: [],
    globalEvents: [{ id: uid(), date: 'Day 1', text: 'The conspiracy begins...', branchId: null }],
  });

  /* ───────────────────── HELPERS ───────────────────── */
  const bC = (hue, a) => `hsla(${hue}, 60%, 55%, ${a || 1})`;
  const bBg = (hue, a) => `hsla(${hue}, 40%, 12%, ${a || 1})`;
  const bGlow = (hue) => `0 0 20px hsla(${hue}, 60%, 55%, 0.25)`;
  const gold = T.gold || '#ffd700';

  /* ───────────────────── TINY COMPONENTS ───────────────────── */
  function InfluenceStars({ value, max, color }) {
    return (
      <span style={{ display: 'inline-flex', gap: 2 }}>
        {[...Array(max || 5)].map((_, i) => (
          <Star key={i} size={11} fill={i < value ? (color || gold) : 'transparent'} color={i < value ? (color || gold) : (T.textFaint || '#555')} />
        ))}
      </span>
    );
  }

  function StatusBadge({ status, small }) {
    const s = STATUS[status] || STATUS.hidden;
    const Icon = s.icon;
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        background: s.color, color: s.text,
        padding: small ? '1px 5px' : '2px 8px', borderRadius: 10,
        fontSize: small ? 9 : 10, fontWeight: 600, letterSpacing: '0.5px',
        fontFamily: T.ui, textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>
        {Icon && <Icon size={small ? 9 : 11} />}
        {s.label}
      </span>
    );
  }

  function PowerBar({ value, hue }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
        <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 3, width: value + '%',
            background: `linear-gradient(90deg, ${bC(hue, 0.7)}, ${bC(hue, 1)})`, transition: 'width 0.5s ease' }} />
        </div>
        <span style={{ fontSize: 10, color: bC(hue), fontWeight: 700, fontFamily: T.ui, minWidth: 28, textAlign: 'right' }}>{value}%</span>
      </div>
    );
  }

  function EditableText({ value, onChange, placeholder, multiline, style: extStyle }) {
    const Tag = multiline ? 'textarea' : 'input';
    return (
      <Tag value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''}
        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid ' + (T.border || '#333'),
          color: T.text || '#eee', padding: '6px 8px', borderRadius: 4, fontFamily: T.body,
          fontSize: 13, resize: multiline ? 'vertical' : 'none',
          minHeight: multiline ? 60 : 'auto', outline: 'none', ...extStyle }} />
    );
  }

  function SectionLabel({ children }) {
    return (
      <div style={{ fontSize: 10, fontWeight: 700, color: T.textFaint || '#666', textTransform: 'uppercase',
        letterSpacing: '1.5px', marginBottom: 6, fontFamily: T.ui, marginTop: 16 }}>{children}</div>
    );
  }

  /* ═════════════════════════════════════════════════════════════
     SVG WEB / TREE DRAWING HELPERS
  ═════════════════════════════════════════════════════════════ */

  // Curved connection line between two points
  function WebLine({ x1, y1, x2, y2, color, opacity, pulse, thickness }) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    // Slight curve offset perpendicular to the line
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const curveMag = len * 0.12;
    // perpendicular
    const px = -dy / len * curveMag;
    const py = dx / len * curveMag;
    const cx = mx + px;
    const cy = my + py;
    const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    return (
      <g>
        {/* Glow */}
        <path d={d} fill="none" stroke={color} strokeWidth={(thickness || 1.5) + 2} strokeOpacity={(opacity || 0.5) * 0.15} />
        {/* Main line */}
        <path d={d} fill="none" stroke={color} strokeWidth={thickness || 1.5} strokeOpacity={opacity || 0.5}
          strokeDasharray={pulse ? '4 4' : 'none'}>
          {pulse && <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.5s" repeatCount="indefinite" />}
        </path>
      </g>
    );
  }

  // Node circle for the web
  function WebNode({ x, y, r, color, glowColor, filled, pulsing, label, sublabel, onClick, isSelected, statusColor }) {
    return (
      <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        {/* Glow ring */}
        {(isSelected || pulsing) && (
          <circle cx={x} cy={y} r={r + 6} fill="none" stroke={glowColor || color} strokeWidth={2} strokeOpacity={0.3}>
            {pulsing && <animate attributeName="r" values={`${r+4};${r+10};${r+4}`} dur="2.5s" repeatCount="indefinite" />}
            {pulsing && <animate attributeName="stroke-opacity" values="0.3;0.1;0.3" dur="2.5s" repeatCount="indefinite" />}
          </circle>
        )}
        {/* Selection ring */}
        {isSelected && <circle cx={x} cy={y} r={r + 3} fill="none" stroke={color} strokeWidth={2} strokeOpacity={0.7} />}
        {/* Status ring */}
        {statusColor && <circle cx={x} cy={y} r={r + 1} fill="none" stroke={statusColor} strokeWidth={2} strokeOpacity={0.8} />}
        {/* Main node */}
        <circle cx={x} cy={y} r={r} fill={filled ? color : 'rgba(0,0,0,0.6)'} stroke={color} strokeWidth={filled ? 0 : 1.5} />
        {/* Inner icon area - a ? for hidden */}
        {!filled && (
          <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
            fill={color} fontSize={r * 0.8} fontWeight="700" fontFamily={T.ui}>?</text>
        )}
        {/* Label below */}
        {label && (
          <text x={x} y={y + r + 14} textAnchor="middle" fill={T.text || '#eee'}
            fontSize={11} fontWeight="600" fontFamily={T.heading}>
            {label.length > 16 ? label.slice(0, 14) + '…' : label}
          </text>
        )}
        {sublabel && (
          <text x={x} y={y + r + 26} textAnchor="middle" fill={T.textDim || '#888'}
            fontSize={9} fontFamily={T.ui}>
            {sublabel.length > 20 ? sublabel.slice(0, 18) + '…' : sublabel}
          </text>
        )}
      </g>
    );
  }

  /* ═════════════════════════════════════════════════════════════
     MAIN COMPONENT
  ═════════════════════════════════════════════════════════════ */
  function CourtIntrigueView({ data, setData, viewRole }) {
    const [view, setView] = useState('overview');
    const [editingAgent, setEditingAgent] = useState(null);
    const [showAddBranch, setShowAddBranch] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');
    const [newBranchDesc, setNewBranchDesc] = useState('');
    const [newClue, setNewClue] = useState('');
    const [newEventText, setNewEventText] = useState('');
    const [hoveredNode, setHoveredNode] = useState(null);
    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ w: 900, h: 600 });

    const intrigue = data.intrigue || initializeIntrigueData();
    const isDM = viewRole === 'DM' || viewRole === 'dm';

    useEffect(() => {
      if (!data.intrigue) {
        setData(prev => ({ ...prev, intrigue: initializeIntrigueData() }));
      }
    }, []);

    // Measure container
    useEffect(() => {
      if (!containerRef.current) return;
      const measure = () => {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setContainerSize({ w: rect.width, h: rect.height });
        }
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(containerRef.current);
      return () => ro.disconnect();
    }, [view]);

    /* ── Updaters ── */
    const update = useCallback((patch) => {
      setData(prev => ({ ...prev, intrigue: { ...(prev.intrigue || intrigue), ...patch } }));
    }, [intrigue, setData]);

    const updateBranch = useCallback((branchId, patch) => {
      update({ branches: intrigue.branches.map(b => b.id === branchId ? { ...b, ...patch } : b) });
    }, [intrigue, update]);

    const updateAgentInBranch = useCallback((branchId, agentId, patch) => {
      update({
        branches: intrigue.branches.map(b => {
          if (b.id !== branchId) return b;
          if (b.sage.id === agentId) return { ...b, sage: { ...b.sage, ...patch } };
          return { ...b, agents: b.agents.map(a => a.id === agentId ? { ...a, ...patch } : a) };
        }),
      });
      if (editingAgent && editingAgent.id === agentId) {
        setEditingAgent(prev => prev ? { ...prev, ...patch } : prev);
      }
    }, [intrigue, update, editingAgent]);

    const addAgentToBranch = useCallback((branchId) => {
      const agent = makeAgent({});
      update({ branches: intrigue.branches.map(b => b.id === branchId ? { ...b, agents: [...b.agents, agent] } : b) });
      setEditingAgent(agent);
    }, [intrigue, update]);

    const removeAgentFromBranch = useCallback((branchId, agentId) => {
      update({ branches: intrigue.branches.map(b => b.id === branchId ? { ...b, agents: b.agents.filter(a => a.id !== agentId) } : b) });
      if (editingAgent && editingAgent.id === agentId) setEditingAgent(null);
    }, [intrigue, update, editingAgent]);

    const addBranch = useCallback(() => {
      if (!newBranchName.trim()) return;
      const branch = makeBranch({ name: newBranchName.trim(), description: newBranchDesc.trim() });
      update({ branches: [...intrigue.branches, branch] });
      setNewBranchName(''); setNewBranchDesc(''); setShowAddBranch(false);
      setView(branch.id);
    }, [intrigue, update, newBranchName, newBranchDesc]);

    const removeBranch = useCallback((branchId) => {
      if (!confirm('Remove this entire faction and all its agents?')) return;
      update({ branches: intrigue.branches.filter(b => b.id !== branchId) });
      if (view === branchId) setView('overview');
    }, [intrigue, update, view]);

    const addClueToAgent = useCallback((branchId, agentId, text) => {
      if (!text.trim()) return;
      const agent = findAgent(agentId);
      if (!agent) return;
      updateAgentInBranch(branchId, agentId, { clues: [...(agent.clues || []), text.trim()] });
    }, [updateAgentInBranch]);

    const addEvent = useCallback((branchId, text) => {
      if (!text.trim()) return;
      const evt = { id: uid(), date: 'Session ' + ((intrigue.globalEvents?.length || 0) + 1), text: text.trim(), branchId };
      update({ globalEvents: [...(intrigue.globalEvents || []), evt] });
    }, [intrigue, update]);

    const findAgent = useCallback((agentId) => {
      if (intrigue.shadowLeader.id === agentId) return intrigue.shadowLeader;
      for (const b of intrigue.branches) {
        if (b.sage.id === agentId) return b.sage;
        const a = b.agents.find(x => x.id === agentId);
        if (a) return a;
      }
      return null;
    }, [intrigue]);

    const findBranchForAgent = useCallback((agentId) => {
      for (const b of intrigue.branches) {
        if (b.sage.id === agentId) return b;
        if (b.agents.some(a => a.id === agentId)) return b;
      }
      return null;
    }, [intrigue]);

    /* ── Stats ── */
    const totalAgents = useMemo(() => intrigue.branches.reduce((s, b) => s + 1 + b.agents.length, 0) + 1, [intrigue.branches]);
    const totalRevealed = useMemo(() => {
      let c = intrigue.shadowLeader.revealed ? 1 : 0;
      intrigue.branches.forEach(b => { if (b.sage.revealed) c++; b.agents.forEach(a => { if (a.revealed) c++; }); });
      return c;
    }, [intrigue]);

    const activeBranch = view !== 'overview' ? intrigue.branches.find(b => b.id === view) : null;

    /* ═══════════════════════════════════════════════════
       SPIDERWEB OVERVIEW LAYOUT CALCULATOR
    ═══════════════════════════════════════════════════ */
    const webLayout = useMemo(() => {
      const { w, h } = containerSize;
      const cx = w / 2;
      const cy = h / 2;
      const branches = intrigue.branches;
      const n = branches.length;
      if (n === 0) return { center: { x: cx, y: cy }, branches: [] };

      // Radii for each ring
      const sageRadius = Math.min(w, h) * 0.28;
      const agentRadius = Math.min(w, h) * 0.46;

      const branchLayouts = branches.map((branch, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2; // start from top
        const sageX = cx + Math.cos(angle) * sageRadius;
        const sageY = cy + Math.sin(angle) * sageRadius;

        // Spread agents in a fan around the sage
        const agentCount = branch.agents.length;
        const fanSpread = Math.min(0.6, (agentCount > 1 ? 0.15 * agentCount : 0));
        const agentLayouts = branch.agents.map((agent, j) => {
          let agentAngle;
          if (agentCount === 1) {
            agentAngle = angle;
          } else {
            const t = agentCount > 1 ? (j / (agentCount - 1)) - 0.5 : 0;
            agentAngle = angle + t * fanSpread;
          }
          return {
            agent,
            x: cx + Math.cos(agentAngle) * agentRadius,
            y: cy + Math.sin(agentAngle) * agentRadius,
          };
        });

        return { branch, sageX, sageY, angle, agents: agentLayouts };
      });

      return { center: { x: cx, y: cy }, sageRadius, agentRadius, branches: branchLayouts };
    }, [containerSize, intrigue.branches]);

    /* ═══════════════════════════════════════════════════
       TREE LAYOUT FOR FACTION DETAIL
    ═══════════════════════════════════════════════════ */
    const treeLayout = useMemo(() => {
      if (!activeBranch) return null;
      const { w, h } = containerSize;
      const agents = activeBranch.agents;
      const n = agents.length;

      // Leader at top, sage below, agents fanning out below sage
      const leaderX = w / 2;
      const leaderY = 60;
      const sageY = 180;
      const sageX = w / 2;

      // Agents in a row or arc below
      const agentY = 320;
      const maxSpan = Math.min(w - 80, n * 120);
      const startX = (w - maxSpan) / 2 + 40;
      const step = n > 1 ? maxSpan / (n - 1) : 0;

      const agentPositions = agents.map((agent, i) => ({
        agent,
        x: n === 1 ? w / 2 : startX + i * step,
        y: agentY,
      }));

      // Sub-level: if agents have many, spread a third row
      // For now we keep 3 tiers: leader, sage, agents

      return { leaderX, leaderY, sageX, sageY, agents: agentPositions };
    }, [activeBranch, containerSize]);

    /* ════════════════════════════════════════════════════
       RENDER
    ════════════════════════════════════════════════════ */
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%',
        background: T.bg || '#0a0a1a', color: T.text || '#eee', fontFamily: T.body, overflow: 'hidden' }}>
        <style>{`
          @keyframes intriguePulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
          @keyframes intrigueSlideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
          .intrigue-card:hover { border-color: rgba(255,255,255,0.15) !important; transform: translateY(-2px); }
          .intrigue-scroll::-webkit-scrollbar { width: 6px; }
          .intrigue-scroll::-webkit-scrollbar-track { background: transparent; }
          .intrigue-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
          .web-node:hover { filter: brightness(1.3); }
        `}</style>

        {/* ── HEADER BAR ── */}
        <div style={{
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: '1px solid ' + (T.border || '#333'), background: 'rgba(0,0,0,0.2)', flexShrink: 0,
        }}>
          {view !== 'overview' && (
            <button onClick={() => { setView('overview'); setEditingAgent(null); }}
              style={{ background: 'none', border: 'none', color: gold, cursor: 'pointer', padding: 4, display: 'flex' }}>
              <ArrowLeft size={18} />
            </button>
          )}
          <Crown size={20} style={{ color: gold, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.heading, fontSize: 18, fontWeight: 700, color: gold, letterSpacing: '1px' }}>
              {activeBranch ? activeBranch.name : 'Court Intrigue'}
            </div>
            <div style={{ fontSize: 11, color: T.textDim || '#888', marginTop: 1 }}>
              {activeBranch ? activeBranch.description :
                `${totalRevealed}/${totalAgents} agents revealed across ${intrigue.branches.length} factions`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, flexShrink: 0, fontSize: 12, color: T.textDim || '#888' }}>
            <span><Network size={13} style={{ verticalAlign: 'middle', marginRight: 3 }} />{intrigue.branches.length}</span>
            <span><Users size={13} style={{ verticalAlign: 'middle', marginRight: 3 }} />{totalAgents}</span>
            <span><Eye size={13} style={{ verticalAlign: 'middle', marginRight: 3 }} />{totalRevealed}</span>
          </div>
          {isDM && view === 'overview' && (
            <button onClick={() => setShowAddBranch(true)} style={{
              background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)',
              color: gold, padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
              fontFamily: T.ui, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '0.5px',
            }}><Plus size={13} /> Faction</button>
          )}
          {isDM && activeBranch && (
            <button onClick={() => addAgentToBranch(activeBranch.id)} style={{
              background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)',
              color: gold, padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
              fontFamily: T.ui, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4,
            }}><UserPlus size={13} /> Agent</button>
          )}
        </div>

        {/* ── BODY ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ══════════════════ SPIDERWEB OVERVIEW ══════════════════ */}
          {view === 'overview' && (
            <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              {/* Background radial lines */}
              <svg width={containerSize.w} height={containerSize.h} style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                  <radialGradient id="webBgGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(255,215,0,0.03)" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>

                {/* Web background glow */}
                <circle cx={webLayout.center.x} cy={webLayout.center.y} r={Math.min(containerSize.w, containerSize.h) * 0.5} fill="url(#webBgGrad)" />

                {/* Concentric web rings */}
                {[0.28, 0.46].map((r, i) => (
                  <circle key={i} cx={webLayout.center.x} cy={webLayout.center.y}
                    r={Math.min(containerSize.w, containerSize.h) * r}
                    fill="none" stroke="rgba(255,215,0,0.04)" strokeWidth={1} strokeDasharray="4 8" />
                ))}

                {/* Radial web lines from center outward */}
                {webLayout.branches.map((bl, i) => {
                  const endX = webLayout.center.x + Math.cos(bl.angle) * Math.min(containerSize.w, containerSize.h) * 0.5;
                  const endY = webLayout.center.y + Math.sin(bl.angle) * Math.min(containerSize.w, containerSize.h) * 0.5;
                  return (
                    <line key={i} x1={webLayout.center.x} y1={webLayout.center.y} x2={endX} y2={endY}
                      stroke="rgba(255,215,0,0.03)" strokeWidth={1} />
                  );
                })}

                {/* Connection lines: center → sages */}
                {webLayout.branches.map((bl, i) => (
                  <WebLine key={'cs_' + i}
                    x1={webLayout.center.x} y1={webLayout.center.y}
                    x2={bl.sageX} y2={bl.sageY}
                    color={bC(bl.branch.colorHue, 1)}
                    opacity={bl.branch.sage.revealed ? 0.6 : 0.15}
                    thickness={2}
                    pulse={bl.branch.sage.status === 'suspected'}
                  />
                ))}

                {/* Connection lines: sages → agents */}
                {webLayout.branches.map((bl, i) =>
                  bl.agents.map((al, j) => (
                    <WebLine key={'sa_' + i + '_' + j}
                      x1={bl.sageX} y1={bl.sageY}
                      x2={al.x} y2={al.y}
                      color={bC(bl.branch.colorHue, 1)}
                      opacity={al.agent.revealed ? 0.5 : 0.1}
                      thickness={1.2}
                      pulse={al.agent.status === 'suspected'}
                    />
                  ))
                )}

                {/* Cross-web connections between adjacent sages (the web strands) */}
                {webLayout.branches.map((bl, i) => {
                  const next = webLayout.branches[(i + 1) % webLayout.branches.length];
                  return (
                    <WebLine key={'web_' + i}
                      x1={bl.sageX} y1={bl.sageY}
                      x2={next.sageX} y2={next.sageY}
                      color="rgba(255,215,0,0.5)"
                      opacity={0.06}
                      thickness={0.8}
                    />
                  );
                })}

                {/* Agent nodes (outer ring) */}
                {webLayout.branches.map((bl, i) =>
                  bl.agents.map((al, j) => (
                    <WebNode key={'an_' + i + '_' + j}
                      x={al.x} y={al.y} r={12}
                      color={bC(bl.branch.colorHue, 1)}
                      glowColor={bC(bl.branch.colorHue, 0.5)}
                      filled={al.agent.revealed}
                      pulsing={al.agent.status === 'suspected'}
                      label={isDM || al.agent.revealed ? al.agent.name : null}
                      sublabel={isDM || al.agent.revealed ? al.agent.title : null}
                      statusColor={(STATUS[al.agent.status] || STATUS.hidden).color}
                      isSelected={editingAgent?.id === al.agent.id}
                      onClick={() => {
                        setEditingAgent(al.agent);
                      }}
                    />
                  ))
                )}

                {/* Sage nodes (middle ring) */}
                {webLayout.branches.map((bl, i) => (
                  <WebNode key={'sn_' + i}
                    x={bl.sageX} y={bl.sageY} r={20}
                    color={bC(bl.branch.colorHue, 1)}
                    glowColor={bC(bl.branch.colorHue, 0.5)}
                    filled={bl.branch.sage.revealed}
                    pulsing={bl.branch.sage.status === 'suspected'}
                    label={isDM || bl.branch.sage.revealed ? bl.branch.sage.name : bl.branch.name}
                    sublabel={isDM || bl.branch.sage.revealed ? bl.branch.name : null}
                    statusColor={(STATUS[bl.branch.sage.status] || STATUS.hidden).color}
                    isSelected={editingAgent?.id === bl.branch.sage.id}
                    onClick={() => setView(bl.branch.id)}
                  />
                ))}

                {/* Center node: Shadow Leader */}
                <WebNode
                  x={webLayout.center.x} y={webLayout.center.y} r={28}
                  color={gold} glowColor="rgba(255,215,0,0.4)"
                  filled={intrigue.shadowLeader.revealed}
                  pulsing={!intrigue.shadowLeader.revealed}
                  label={isDM || intrigue.shadowLeader.revealed ? intrigue.shadowLeader.name : 'The Shadow Leader'}
                  isSelected={editingAgent?.id === 'leader'}
                  onClick={() => setEditingAgent(intrigue.shadowLeader)}
                />
              </svg>

              {/* Faction labels as HTML overlays with click to enter faction */}
              {webLayout.branches.map((bl, i) => {
                // Position a small badge near the sage
                const badgeX = bl.sageX;
                const badgeY = bl.sageY - 36;
                return (
                  <div key={'lbl_' + i} onClick={() => setView(bl.branch.id)}
                    style={{
                      position: 'absolute',
                      left: badgeX, top: badgeY,
                      transform: 'translate(-50%, -50%)',
                      padding: '3px 10px', borderRadius: 10,
                      background: bC(bl.branch.colorHue, 0.15),
                      border: '1px solid ' + bC(bl.branch.colorHue, 0.3),
                      cursor: 'pointer', whiteSpace: 'nowrap',
                      fontSize: 10, fontWeight: 700, fontFamily: T.ui,
                      color: bC(bl.branch.colorHue), letterSpacing: '0.5px',
                      pointerEvents: 'auto', zIndex: 10,
                      transition: 'all 0.2s',
                    }}>
                    {bl.branch.name} <span style={{ opacity: 0.5, marginLeft: 2 }}>{bl.branch.powerLevel}%</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══════════════════ FACTION TREE DETAIL ══════════════════ */}
          {activeBranch && treeLayout && (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
              <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
                <svg width={containerSize.w} height={Math.max(containerSize.h, 440)}
                  style={{ position: 'absolute', top: 0, left: 0 }}>
                  <defs>
                    <radialGradient id="treeBgGrad" cx="50%" cy="20%" r="60%">
                      <stop offset="0%" stopColor={bC(activeBranch.colorHue, 0.04)} />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>

                  {/* Background */}
                  <rect width="100%" height="100%" fill="url(#treeBgGrad)" />

                  {/* Connection: leader → sage */}
                  <WebLine
                    x1={treeLayout.leaderX} y1={treeLayout.leaderY}
                    x2={treeLayout.sageX} y2={treeLayout.sageY}
                    color={gold} opacity={0.3} thickness={2}
                  />

                  {/* Connections: sage → agents */}
                  {treeLayout.agents.map((al, i) => (
                    <WebLine key={'ta_' + i}
                      x1={treeLayout.sageX} y1={treeLayout.sageY}
                      x2={al.x} y2={al.y}
                      color={bC(activeBranch.colorHue, 1)}
                      opacity={al.agent.revealed ? 0.5 : 0.15}
                      thickness={1.5}
                      pulse={al.agent.status === 'suspected'}
                    />
                  ))}

                  {/* Cross connections between agents (web strands) */}
                  {treeLayout.agents.length > 1 && treeLayout.agents.map((al, i) => {
                    if (i === treeLayout.agents.length - 1) return null;
                    const next = treeLayout.agents[i + 1];
                    return (
                      <WebLine key={'tw_' + i}
                        x1={al.x} y1={al.y}
                        x2={next.x} y2={next.y}
                        color={bC(activeBranch.colorHue, 0.5)}
                        opacity={0.05}
                        thickness={0.8}
                      />
                    );
                  })}

                  {/* Agent nodes */}
                  {treeLayout.agents.map((al, i) => (
                    <WebNode key={'tn_' + i}
                      x={al.x} y={al.y} r={16}
                      color={bC(activeBranch.colorHue, 1)}
                      glowColor={bC(activeBranch.colorHue, 0.5)}
                      filled={al.agent.revealed}
                      pulsing={al.agent.status === 'suspected'}
                      label={isDM || al.agent.revealed ? al.agent.name : 'Unknown Operative'}
                      sublabel={isDM || al.agent.revealed ? al.agent.title : null}
                      statusColor={(STATUS[al.agent.status] || STATUS.hidden).color}
                      isSelected={editingAgent?.id === al.agent.id}
                      onClick={() => setEditingAgent(al.agent)}
                    />
                  ))}

                  {/* Sage node */}
                  <WebNode
                    x={treeLayout.sageX} y={treeLayout.sageY} r={24}
                    color={bC(activeBranch.colorHue, 1)}
                    glowColor={bC(activeBranch.colorHue, 0.5)}
                    filled={activeBranch.sage.revealed}
                    pulsing={activeBranch.sage.status === 'suspected'}
                    label={isDM || activeBranch.sage.revealed ? activeBranch.sage.name : 'Unknown Leader'}
                    sublabel={activeBranch.sage.title}
                    statusColor={(STATUS[activeBranch.sage.status] || STATUS.hidden).color}
                    isSelected={editingAgent?.id === activeBranch.sage.id}
                    onClick={() => setEditingAgent(activeBranch.sage)}
                  />

                  {/* Leader node at top */}
                  <WebNode
                    x={treeLayout.leaderX} y={treeLayout.leaderY} r={20}
                    color={gold} glowColor="rgba(255,215,0,0.4)"
                    filled={intrigue.shadowLeader.revealed}
                    pulsing={!intrigue.shadowLeader.revealed}
                    label={isDM || intrigue.shadowLeader.revealed ? intrigue.shadowLeader.name : 'The Shadow Leader'}
                    isSelected={editingAgent?.id === 'leader'}
                    onClick={() => setEditingAgent(intrigue.shadowLeader)}
                  />
                </svg>

                {/* Power bar + info overlay */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 20px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', pointerEvents: 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'auto' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: T.textFaint || '#666', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4, fontFamily: T.ui }}>
                        Faction Power
                      </div>
                      <PowerBar value={activeBranch.powerLevel} hue={activeBranch.colorHue} />
                      {isDM && (
                        <input type="range" min={0} max={100} value={activeBranch.powerLevel}
                          onChange={e => updateBranch(activeBranch.id, { powerLevel: Number(e.target.value) })}
                          style={{ width: '100%', accentColor: bC(activeBranch.colorHue), marginTop: 4 }} />
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: T.textDim || '#888', textAlign: 'right' }}>
                      <div>{1 + activeBranch.agents.length} agents</div>
                      <div>{activeBranch.agents.filter(a => a.revealed).length + (activeBranch.sage.revealed ? 1 : 0)} revealed</div>
                    </div>
                    {isDM && (
                      <button onClick={() => removeBranch(activeBranch.id)} style={{
                        background: 'rgba(220,60,50,0.15)', border: '1px solid rgba(220,60,50,0.3)',
                        color: '#ef5350', padding: '6px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 10, fontFamily: T.ui,
                      }}><Trash2 size={12} /></button>
                    )}
                  </div>

                  {/* Event log */}
                  <div style={{ marginTop: 10, maxHeight: 120, overflowY: 'auto', pointerEvents: 'auto' }}>
                    {(intrigue.globalEvents || []).filter(e => !e.branchId || e.branchId === activeBranch.id).slice(-5).reverse().map(evt => (
                      <div key={evt.id} style={{
                        padding: '4px 8px', marginBottom: 2, borderRadius: 3,
                        background: 'rgba(0,0,0,0.3)', fontSize: 11, color: T.textDim || '#888',
                        borderLeft: '2px solid ' + bC(activeBranch.colorHue, 0.3),
                      }}>
                        <span style={{ color: T.textFaint || '#666', fontSize: 9, marginRight: 6 }}>{evt.date}</span>
                        {evt.text}
                      </div>
                    ))}
                    {isDM && (
                      <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                        <EditableText value={newEventText} onChange={setNewEventText} placeholder="Log an event..." style={{ fontSize: 11 }} />
                        <button onClick={() => { addEvent(activeBranch.id, newEventText); setNewEventText(''); }}
                          disabled={!newEventText.trim()}
                          style={{
                            padding: '4px 10px', background: bC(activeBranch.colorHue, 0.2),
                            border: '1px solid ' + bC(activeBranch.colorHue, 0.3),
                            color: bC(activeBranch.colorHue), borderRadius: 4, cursor: 'pointer',
                            fontSize: 10, fontFamily: T.ui, opacity: newEventText.trim() ? 1 : 0.4,
                          }}><Plus size={11} /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── RIGHT PANEL: Agent Detail ── */}
              {editingAgent && (
                <div className="intrigue-scroll" style={{
                  width: 340, borderLeft: '1px solid ' + (T.border || '#333'),
                  overflowY: 'auto', background: 'rgba(0,0,0,0.2)',
                  animation: 'intrigueSlideIn 0.25s ease', flexShrink: 0,
                }}>
                  <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ fontFamily: T.heading, fontSize: 13, color: gold, letterSpacing: '1px' }}>
                        {RANK_LABELS[editingAgent.rank] || 'Agent'}
                      </div>
                      <button onClick={() => setEditingAgent(null)}
                        style={{ background: 'none', border: 'none', color: T.textFaint || '#666', cursor: 'pointer' }}>
                        <X size={16} />
                      </button>
                    </div>

                    <div style={{ marginBottom: 12, textAlign: 'center' }}><StatusBadge status={editingAgent.status} /></div>

                    {isDM ? (
                      <Fragment>
                        <SectionLabel>Name</SectionLabel>
                        <EditableText value={editingAgent.name} onChange={v => {
                          const b = findBranchForAgent(editingAgent.id);
                          if (b) updateAgentInBranch(b.id, editingAgent.id, { name: v });
                          else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, name: v } });
                        }} placeholder="Agent name..." />
                        <SectionLabel>Title</SectionLabel>
                        <EditableText value={editingAgent.title} onChange={v => {
                          const b = findBranchForAgent(editingAgent.id);
                          if (b) updateAgentInBranch(b.id, editingAgent.id, { title: v });
                          else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, title: v } });
                        }} placeholder="Title or role..." />
                      </Fragment>
                    ) : (
                      <Fragment>
                        <div style={{ fontFamily: T.heading, fontSize: 16, fontWeight: 700, color: T.text || '#eee', marginBottom: 4 }}>
                          {editingAgent.revealed ? editingAgent.name : 'Unknown ' + (RANK_LABELS[editingAgent.rank] || 'Agent')}
                        </div>
                        {editingAgent.revealed && editingAgent.title && (
                          <div style={{ fontSize: 12, color: T.textDim || '#888', marginBottom: 12 }}>{editingAgent.title}</div>
                        )}
                      </Fragment>
                    )}

                    <SectionLabel>Location</SectionLabel>
                    {isDM ? (
                      <EditableText value={editingAgent.location} onChange={v => {
                        const b = findBranchForAgent(editingAgent.id);
                        if (b) updateAgentInBranch(b.id, editingAgent.id, { location: v });
                        else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, location: v } });
                      }} placeholder="Last known location..." />
                    ) : (
                      <div style={{ fontSize: 13, color: T.text || '#eee' }}>{editingAgent.location || 'Unknown'}</div>
                    )}

                    <SectionLabel>Influence</SectionLabel>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <InfluenceStars value={editingAgent.influence} max={5} />
                      {isDM && (
                        <input type="range" min={1} max={5} step={1} value={editingAgent.influence}
                          onChange={e => {
                            const v = Number(e.target.value);
                            const b = findBranchForAgent(editingAgent.id);
                            if (b) updateAgentInBranch(b.id, editingAgent.id, { influence: v });
                            else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, influence: v } });
                          }}
                          style={{ flex: 1, accentColor: gold }} />
                      )}
                    </div>

                    {isDM && (
                      <Fragment>
                        <SectionLabel>Status</SectionLabel>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {STATUS_KEYS.map(key => (
                            <button key={key} onClick={() => {
                              const patch = { status: key, revealed: key !== 'hidden' ? true : editingAgent.revealed };
                              const b = findBranchForAgent(editingAgent.id);
                              if (b) updateAgentInBranch(b.id, editingAgent.id, patch);
                              else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, ...patch } });
                            }} style={{
                              padding: '3px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
                              fontSize: 9, fontWeight: 600, fontFamily: T.ui, letterSpacing: '0.5px',
                              background: editingAgent.status === key ? STATUS[key].color : 'rgba(255,255,255,0.04)',
                              color: editingAgent.status === key ? STATUS[key].text : (T.textFaint || '#666'),
                            }}>{STATUS[key].label}</button>
                          ))}
                        </div>
                      </Fragment>
                    )}

                    <SectionLabel>Clues ({(editingAgent.clues || []).length})</SectionLabel>
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 4, padding: 8, borderLeft: '2px solid ' + gold }}>
                      {(editingAgent.clues || []).length === 0 && (
                        <div style={{ fontSize: 11, color: T.textFaint || '#666', fontStyle: 'italic' }}>No clues yet.</div>
                      )}
                      {(editingAgent.clues || []).map((clue, i) => (
                        <div key={i} style={{ fontSize: 11, color: T.textDim || '#888', padding: '3px 0',
                          borderBottom: i < editingAgent.clues.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                          <span style={{ color: gold, marginRight: 4, fontSize: 9 }}>#{i + 1}</span>{clue}
                        </div>
                      ))}
                      {isDM && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                          <EditableText value={newClue} onChange={setNewClue} placeholder="Add clue..." style={{ fontSize: 11 }} />
                          <button onClick={() => {
                            const b = findBranchForAgent(editingAgent.id);
                            if (b) addClueToAgent(b.id, editingAgent.id, newClue);
                            setNewClue('');
                          }} disabled={!newClue.trim()} style={{
                            padding: '3px 8px', background: 'rgba(255,215,0,0.15)',
                            border: '1px solid rgba(255,215,0,0.2)', color: gold,
                            borderRadius: 4, cursor: 'pointer', fontSize: 10, opacity: newClue.trim() ? 1 : 0.4,
                          }}><Plus size={10} /></button>
                        </div>
                      )}
                    </div>

                    {isDM && (
                      <Fragment>
                        <SectionLabel>DM Notes</SectionLabel>
                        <EditableText multiline value={editingAgent.notes} onChange={v => {
                          const b = findBranchForAgent(editingAgent.id);
                          if (b) updateAgentInBranch(b.id, editingAgent.id, { notes: v });
                          else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, notes: v } });
                        }} placeholder="Private DM notes..." />
                      </Fragment>
                    )}

                    {isDM && editingAgent.id !== 'leader' && (
                      <Fragment>
                        <SectionLabel>Actions</SectionLabel>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {!editingAgent.revealed && (
                            <button onClick={() => {
                              const b = findBranchForAgent(editingAgent.id);
                              if (b) updateAgentInBranch(b.id, editingAgent.id, { revealed: true, status: 'revealed' });
                            }} style={{
                              padding: '6px 12px', borderRadius: 4, border: 'none', cursor: 'pointer',
                              background: STATUS.revealed.color, color: '#fff', fontSize: 11,
                              fontFamily: T.ui, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                            }}><Eye size={12} /> Reveal</button>
                          )}
                          {editingAgent.rank === 'agent' && (
                            <button onClick={() => {
                              if (confirm('Remove this agent permanently?')) {
                                removeAgentFromBranch(activeBranch.id, editingAgent.id);
                              }
                            }} style={{
                              padding: '6px 12px', borderRadius: 4, border: '1px solid ' + (T.crimson || '#ef5350'),
                              background: 'transparent', color: T.crimson || '#ef5350', fontSize: 11,
                              fontFamily: T.ui, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                            }}><Trash2 size={12} /> Remove</button>
                          )}
                        </div>
                      </Fragment>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── OVERVIEW Right Panel (when agent selected from web) ── */}
          {view === 'overview' && editingAgent && (
            <div className="intrigue-scroll" style={{
              width: 340, borderLeft: '1px solid ' + (T.border || '#333'),
              overflowY: 'auto', background: 'rgba(0,0,0,0.2)',
              animation: 'intrigueSlideIn 0.25s ease', flexShrink: 0,
            }}>
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontFamily: T.heading, fontSize: 13, color: gold, letterSpacing: '1px' }}>
                    {RANK_LABELS[editingAgent.rank] || 'Agent'}
                  </div>
                  <button onClick={() => setEditingAgent(null)}
                    style={{ background: 'none', border: 'none', color: T.textFaint || '#666', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </div>
                <div style={{ marginBottom: 12, textAlign: 'center' }}><StatusBadge status={editingAgent.status} /></div>

                {isDM ? (
                  <Fragment>
                    <SectionLabel>Name</SectionLabel>
                    <EditableText value={editingAgent.name} onChange={v => {
                      const b = findBranchForAgent(editingAgent.id);
                      if (b) updateAgentInBranch(b.id, editingAgent.id, { name: v });
                      else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, name: v } });
                    }} placeholder="Agent name..." />
                    <SectionLabel>Title</SectionLabel>
                    <EditableText value={editingAgent.title} onChange={v => {
                      const b = findBranchForAgent(editingAgent.id);
                      if (b) updateAgentInBranch(b.id, editingAgent.id, { title: v });
                      else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, title: v } });
                    }} placeholder="Title..." />
                  </Fragment>
                ) : (
                  <Fragment>
                    <div style={{ fontFamily: T.heading, fontSize: 16, fontWeight: 700, color: T.text || '#eee', marginBottom: 4 }}>
                      {editingAgent.revealed ? editingAgent.name : 'Unknown'}
                    </div>
                    {editingAgent.revealed && editingAgent.title && (
                      <div style={{ fontSize: 12, color: T.textDim || '#888', marginBottom: 12 }}>{editingAgent.title}</div>
                    )}
                  </Fragment>
                )}

                <SectionLabel>Location</SectionLabel>
                <div style={{ fontSize: 13, color: T.text || '#eee' }}>
                  {(isDM || editingAgent.revealed) ? (editingAgent.location || 'Unknown') : 'Unknown'}
                </div>

                <SectionLabel>Influence</SectionLabel>
                <InfluenceStars value={editingAgent.influence} max={5} />

                {isDM && (
                  <Fragment>
                    <SectionLabel>Status</SectionLabel>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {STATUS_KEYS.map(key => (
                        <button key={key} onClick={() => {
                          const patch = { status: key, revealed: key !== 'hidden' ? true : editingAgent.revealed };
                          const b = findBranchForAgent(editingAgent.id);
                          if (b) updateAgentInBranch(b.id, editingAgent.id, patch);
                          else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, ...patch } });
                        }} style={{
                          padding: '3px 8px', borderRadius: 10, border: 'none', cursor: 'pointer',
                          fontSize: 9, fontWeight: 600, fontFamily: T.ui,
                          background: editingAgent.status === key ? STATUS[key].color : 'rgba(255,255,255,0.04)',
                          color: editingAgent.status === key ? STATUS[key].text : (T.textFaint || '#666'),
                        }}>{STATUS[key].label}</button>
                      ))}
                    </div>
                  </Fragment>
                )}

                <SectionLabel>Clues ({(editingAgent.clues || []).length})</SectionLabel>
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 4, padding: 8, borderLeft: '2px solid ' + gold }}>
                  {(editingAgent.clues || []).length === 0 && (
                    <div style={{ fontSize: 11, color: T.textFaint || '#666', fontStyle: 'italic' }}>No clues yet.</div>
                  )}
                  {(editingAgent.clues || []).map((clue, i) => (
                    <div key={i} style={{ fontSize: 11, color: T.textDim || '#888', padding: '3px 0' }}>
                      <span style={{ color: gold, marginRight: 4, fontSize: 9 }}>#{i + 1}</span>{clue}
                    </div>
                  ))}
                </div>

                {isDM && (
                  <Fragment>
                    <SectionLabel>DM Notes</SectionLabel>
                    <EditableText multiline value={editingAgent.notes} onChange={v => {
                      const b = findBranchForAgent(editingAgent.id);
                      if (b) updateAgentInBranch(b.id, editingAgent.id, { notes: v });
                      else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, notes: v } });
                    }} placeholder="Private DM notes..." />
                  </Fragment>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── ADD BRANCH MODAL ── */}
        {showAddBranch && isDM && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} onClick={() => setShowAddBranch(false)}>
            <div onClick={e => e.stopPropagation()} style={{
              background: T.bgCard || '#1a1a2e', border: '1px solid ' + (T.border || '#333'), borderRadius: 8,
              padding: 24, width: 400, maxWidth: '90vw',
            }}>
              <div style={{ fontFamily: T.heading, fontSize: 16, color: gold, marginBottom: 16 }}>Create New Faction</div>
              <SectionLabel>Name</SectionLabel>
              <EditableText value={newBranchName} onChange={setNewBranchName} placeholder="Faction name..." />
              <SectionLabel>Description</SectionLabel>
              <EditableText value={newBranchDesc} onChange={setNewBranchDesc} placeholder="Brief description..." />
              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button onClick={addBranch} disabled={!newBranchName.trim()} style={{
                  flex: 1, padding: '10px 16px', background: gold, color: '#000',
                  border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: T.ui,
                  fontSize: 12, fontWeight: 700, opacity: newBranchName.trim() ? 1 : 0.4,
                }}>Create Faction</button>
                <button onClick={() => setShowAddBranch(false)} style={{
                  padding: '10px 16px', background: 'transparent', color: T.textDim || '#888',
                  border: '1px solid ' + (T.border || '#333'), borderRadius: 4, cursor: 'pointer',
                  fontFamily: T.ui, fontSize: 12,
                }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Register ── */
  window.registerCampaignTab('intrigue', function intrigueLoader({ React }) {
    return CourtIntrigueView;
  });
})();
