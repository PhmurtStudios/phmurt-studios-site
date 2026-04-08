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

  const makeAgent = (overrides) => ({
    id: uid(), name: 'Unknown Agent', title: '', rank: 'agent',
    status: 'hidden', revealed: false, influence: 2,
    location: '', notes: '', clues: [], connections: [],
    ...overrides,
  });

  const makeBranch = (overrides) => ({
    id: uid(), name: 'New Faction', description: '',
    colorHue: Math.floor(Math.random() * 360), powerLevel: 50,
    sage: makeAgent({ rank: 'sage', name: 'Unknown Leader', influence: 4 }),
    agents: [],
    missions: [],
    events: [],
    ...overrides,
  });

  const initializeIntrigueData = () => ({
    shadowLeader: makeAgent({
      id: 'leader', name: 'The Shadow Leader', rank: 'leader',
      title: 'True Power Behind the Throne', influence: 5,
      location: 'Unknown', notes: 'The ultimate architect of this conspiracy',
    }),
    branches: [
      makeBranch({
        id: 'crown', name: 'The Crown', description: 'Royal Court manipulation',
        colorHue: 45, powerLevel: 75,
        sage: makeAgent({ id: 'sage_crown', rank: 'sage', name: 'The Courtier', title: 'Royal Advisor', influence: 4, location: 'Palace' }),
        agents: [
          makeAgent({ id: 'a_c1', name: 'Lord Theron', title: 'Chancellor', influence: 3, location: 'Throne Room' }),
          makeAgent({ id: 'a_c2', name: 'Lady Morgeth', title: 'Court Enchantress', influence: 3, location: 'Tower of Sages' }),
          makeAgent({ id: 'a_c3', name: 'Master Aldric', title: 'Head Guard Captain', influence: 2, location: 'Guard Barracks' }),
        ],
      }),
      makeBranch({
        id: 'coin', name: 'The Coin', description: 'Economic & merchant guild control',
        colorHue: 35, powerLevel: 68,
        sage: makeAgent({ id: 'sage_coin', rank: 'sage', name: 'The Merchant Prince', title: 'Guild Master', influence: 4, location: 'Merchant District' }),
        agents: [
          makeAgent({ id: 'a_m1', name: 'Kess the Banker', title: 'Master of Coins', influence: 3, location: 'Treasury House' }),
          makeAgent({ id: 'a_m2', name: 'Varys the Trader', title: 'Spice Merchant', influence: 3, location: 'Market Square' }),
          makeAgent({ id: 'a_m3', name: 'Helena Goldsmith', title: 'Jeweler & Fence', influence: 2, location: 'Jewel Quarter' }),
        ],
      }),
      makeBranch({
        id: 'sword', name: 'The Sword', description: 'Military infiltration',
        colorHue: 0, powerLevel: 82,
        sage: makeAgent({ id: 'sage_sword', rank: 'sage', name: 'The General', title: 'War Commander', influence: 5, location: 'Military Fortress' }),
        agents: [
          makeAgent({ id: 'a_s1', name: 'Commander Darius', title: 'Colonel of the North', influence: 4, location: 'Northern Camp' }),
          makeAgent({ id: 'a_s2', name: 'Captain Lena', title: 'Shadow Ops', influence: 3, location: 'Secret Base' }),
          makeAgent({ id: 'a_s3', name: 'Sergeant Vex', title: 'Supply Master', influence: 2, location: 'Armory' }),
        ],
      }),
      makeBranch({
        id: 'eye', name: 'The Eye', description: 'Spy network & information control',
        colorHue: 210, powerLevel: 71,
        sage: makeAgent({ id: 'sage_eye', rank: 'sage', name: 'The Spymaster', title: 'Master of Shadows', influence: 4, location: 'Hidden Lair' }),
        agents: [
          makeAgent({ id: 'a_e1', name: 'Whisper', title: 'Information Broker', influence: 3, location: 'Tavern' }),
          makeAgent({ id: 'a_e2', name: 'Rook', title: 'Street Informant', influence: 2, location: 'Underworld' }),
          makeAgent({ id: 'a_e3', name: 'Maven', title: 'Scholar & Archive', influence: 3, location: 'Library' }),
          makeAgent({ id: 'a_e4', name: 'Shadow', title: 'Assassin', influence: 4, location: 'Rooftops' }),
        ],
      }),
      makeBranch({
        id: 'whisper', name: 'The Whisper', description: 'Religious manipulation',
        colorHue: 270, powerLevel: 64,
        sage: makeAgent({ id: 'sage_whisper', rank: 'sage', name: 'The High Priest', title: 'Divine Authority', influence: 4, location: 'Temple' }),
        agents: [
          makeAgent({ id: 'a_w1', name: 'Bishop Aldric', title: 'Temple Administrator', influence: 3, location: 'Sacred Temple' }),
          makeAgent({ id: 'a_w2', name: 'Priestess Lyra', title: 'Oracle', influence: 3, location: 'Shrine' }),
        ],
      }),
      makeBranch({
        id: 'mask', name: 'The Mask', description: 'Underground & criminal control',
        colorHue: 350, powerLevel: 79,
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
    globalEvents: [
      { id: uid(), date: 'Day 1', text: 'The conspiracy begins...', branchId: null },
    ],
  });

  /* ───────────────────── HELPERS ───────────────────── */
  const branchColor = (hue, a) => `hsla(${hue}, 60%, 55%, ${a || 1})`;
  const branchBg    = (hue, a) => `hsla(${hue}, 40%, 12%, ${a || 1})`;
  const branchGlow  = (hue) => `0 0 20px hsla(${hue}, 60%, 55%, 0.25)`;

  const countByStatus = (agents) => {
    const c = {};
    STATUS_KEYS.forEach(k => { c[k] = 0; });
    agents.forEach(a => { c[a.status] = (c[a.status] || 0) + 1; });
    return c;
  };

  /* ───────────────────── SUB-COMPONENTS ───────────────────── */

  /* ── Influence Stars ── */
  function InfluenceStars({ value, max, color }) {
    return (
      <span style={{ display: 'inline-flex', gap: 2 }}>
        {[...Array(max || 5)].map((_, i) => (
          <Star key={i} size={12} fill={i < value ? (color || T.gold) : 'transparent'} color={i < value ? (color || T.gold) : T.textFaint} />
        ))}
      </span>
    );
  }

  /* ── Status Badge ── */
  function StatusBadge({ status, small }) {
    const s = STATUS[status] || STATUS.hidden;
    const Icon = s.icon;
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        background: s.color, color: s.text,
        padding: small ? '2px 6px' : '3px 10px', borderRadius: 10,
        fontSize: small ? 10 : 11, fontWeight: 600, letterSpacing: '0.5px',
        fontFamily: T.ui, textTransform: 'uppercase',
      }}>
        {Icon && <Icon size={small ? 10 : 12} />}
        {s.label}
      </span>
    );
  }

  /* ── Power Bar ── */
  function PowerBar({ value, hue }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
        <div style={{
          flex: 1, height: 6, borderRadius: 3,
          background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 3, width: value + '%',
            background: `linear-gradient(90deg, ${branchColor(hue, 0.7)}, ${branchColor(hue, 1)})`,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <span style={{ fontSize: 11, color: branchColor(hue), fontWeight: 700, fontFamily: T.ui, minWidth: 32, textAlign: 'right' }}>
          {value}%
        </span>
      </div>
    );
  }

  /* ── Editable Text ── */
  function EditableText({ value, onChange, placeholder, multiline, style: extStyle }) {
    const Tag = multiline ? 'textarea' : 'input';
    return (
      <Tag
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || ''}
        style={{
          width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid ' + T.border,
          color: T.text, padding: '6px 8px', borderRadius: 4, fontFamily: T.body,
          fontSize: 13, resize: multiline ? 'vertical' : 'none',
          minHeight: multiline ? 60 : 'auto', outline: 'none',
          ...extStyle,
        }}
      />
    );
  }

  /* ── Section Header ── */
  function SectionLabel({ children }) {
    return (
      <div style={{
        fontSize: 10, fontWeight: 700, color: T.textFaint, textTransform: 'uppercase',
        letterSpacing: '1.5px', marginBottom: 6, fontFamily: T.ui, marginTop: 16,
      }}>{children}</div>
    );
  }

  /* ── Tree Node (for hierarchy) ── */
  function TreeNode({ agent, hue, depth, isDM, onSelect, isSelected }) {
    const color = branchColor(hue);
    const StatusIcon = (STATUS[agent.status] || STATUS.hidden).icon;
    return (
      <div style={{ marginLeft: depth * 28 }}>
        <div
          onClick={() => onSelect(agent)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
            background: isSelected ? branchBg(hue, 0.6) : 'rgba(0,0,0,0.15)',
            border: isSelected ? '1px solid ' + color : '1px solid transparent',
            borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s',
            marginBottom: 4,
          }}
        >
          {/* Rank Indicator */}
          <div style={{
            width: agent.rank === 'sage' ? 36 : 28,
            height: agent.rank === 'sage' ? 36 : 28,
            borderRadius: agent.rank === 'sage' ? 6 : '50%',
            background: agent.revealed ? color : 'rgba(255,255,255,0.06)',
            border: '1px solid ' + (agent.revealed ? color : 'rgba(255,255,255,0.1)'),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: agent.rank === 'sage' ? 16 : 12,
            color: agent.revealed ? '#000' : T.textFaint,
            fontWeight: 700,
            boxShadow: agent.revealed ? branchGlow(hue) : 'none',
          }}>
            {agent.revealed ? (StatusIcon ? <StatusIcon size={agent.rank === 'sage' ? 18 : 14} /> : '?') : '?'}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: T.text, fontFamily: T.heading,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {(isDM || agent.revealed) ? agent.name : 'Unknown ' + (RANK_LABELS[agent.rank] || 'Agent')}
            </div>
            {(isDM || agent.revealed) && agent.title && (
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 1 }}>{agent.title}</div>
            )}
          </div>

          {/* Right Side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <InfluenceStars value={agent.influence} max={5} color={color} />
            <StatusBadge status={agent.status} small />
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════
     MAIN COMPONENT
  ════════════════════════════════════════════════════════════ */
  function CourtIntrigueView({ data, setData, viewRole }) {
    const [view, setView] = useState('overview');           // 'overview' | branchId
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [editingAgent, setEditingAgent] = useState(null);  // agent being edited in panel
    const [showAddAgent, setShowAddAgent] = useState(false);
    const [showAddBranch, setShowAddBranch] = useState(false);
    const [newBranchName, setNewBranchName] = useState('');
    const [newBranchDesc, setNewBranchDesc] = useState('');
    const [newClue, setNewClue] = useState('');
    const [showEventLog, setShowEventLog] = useState(false);
    const [newEventText, setNewEventText] = useState('');

    const intrigue = data.intrigue || initializeIntrigueData();
    const isDM = viewRole === 'DM' || viewRole === 'dm';

    // ── Init ──
    useEffect(() => {
      if (!data.intrigue) {
        setData(prev => ({ ...prev, intrigue: initializeIntrigueData() }));
      }
    }, []);

    // ── Core updaters ──
    const update = useCallback((patch) => {
      setData(prev => ({ ...prev, intrigue: { ...prev.intrigue || intrigue, ...patch } }));
    }, [intrigue, setData]);

    const updateBranch = useCallback((branchId, patch) => {
      update({
        branches: intrigue.branches.map(b => b.id === branchId ? { ...b, ...patch } : b),
      });
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
      update({
        branches: intrigue.branches.map(b =>
          b.id === branchId ? { ...b, agents: [...b.agents, agent] } : b
        ),
      });
      setEditingAgent(agent);
      setShowAddAgent(false);
    }, [intrigue, update]);

    const removeAgentFromBranch = useCallback((branchId, agentId) => {
      update({
        branches: intrigue.branches.map(b =>
          b.id === branchId ? { ...b, agents: b.agents.filter(a => a.id !== agentId) } : b
        ),
      });
      if (editingAgent && editingAgent.id === agentId) setEditingAgent(null);
    }, [intrigue, update, editingAgent]);

    const addBranch = useCallback(() => {
      if (!newBranchName.trim()) return;
      const branch = makeBranch({ name: newBranchName.trim(), description: newBranchDesc.trim() });
      update({ branches: [...intrigue.branches, branch] });
      setNewBranchName('');
      setNewBranchDesc('');
      setShowAddBranch(false);
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
      const clues = [...(agent.clues || []), text.trim()];
      updateAgentInBranch(branchId, agentId, { clues });
    }, [updateAgentInBranch]);

    const addEvent = useCallback((branchId, text) => {
      if (!text.trim()) return;
      const evt = { id: uid(), date: 'Session ' + (intrigue.globalEvents?.length || 0 + 1), text: text.trim(), branchId };
      update({ globalEvents: [...(intrigue.globalEvents || []), evt] });
    }, [intrigue, update]);

    // ── Finders ──
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

    // ── Stats ──
    const totalAgents = useMemo(() =>
      intrigue.branches.reduce((s, b) => s + 1 + b.agents.length, 0) + 1
    , [intrigue.branches]);
    const totalRevealed = useMemo(() => {
      let c = intrigue.shadowLeader.revealed ? 1 : 0;
      intrigue.branches.forEach(b => {
        if (b.sage.revealed) c++;
        b.agents.forEach(a => { if (a.revealed) c++; });
      });
      return c;
    }, [intrigue]);

    const activeBranch = view !== 'overview' ? intrigue.branches.find(b => b.id === view) : null;

    /* ════════════════════ RENDER ════════════════════ */
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        background: T.bg, color: T.text, fontFamily: T.body, overflow: 'hidden',
      }}>
        <style>{`
          @keyframes intriguePulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
          @keyframes intrigueSlideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
          .intrigue-card:hover { border-color: rgba(255,255,255,0.15) !important; transform: translateY(-2px); }
          .intrigue-tree-node:hover { background: rgba(255,255,255,0.04) !important; }
          .intrigue-scroll::-webkit-scrollbar { width: 6px; }
          .intrigue-scroll::-webkit-scrollbar-track { background: transparent; }
          .intrigue-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        `}</style>

        {/* ── HEADER BAR ── */}
        <div style={{
          padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: '1px solid ' + T.border, background: 'rgba(0,0,0,0.2)',
          flexShrink: 0,
        }}>
          {view !== 'overview' && (
            <button onClick={() => { setView('overview'); setEditingAgent(null); }}
              style={{ background: 'none', border: 'none', color: T.gold, cursor: 'pointer', padding: 4, display: 'flex' }}>
              <ArrowLeft size={18} />
            </button>
          )}
          <Crown size={20} style={{ color: T.gold, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.heading, fontSize: 18, fontWeight: 700, color: T.gold, letterSpacing: '1px' }}>
              {activeBranch ? activeBranch.name : 'Court Intrigue'}
            </div>
            {!activeBranch && (
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 1 }}>
                {totalRevealed}/{totalAgents} agents revealed across {intrigue.branches.length} factions
              </div>
            )}
            {activeBranch && (
              <div style={{ fontSize: 11, color: T.textDim, marginTop: 1 }}>{activeBranch.description}</div>
            )}
          </div>

          {/* Global Stats */}
          <div style={{ display: 'flex', gap: 16, flexShrink: 0, fontSize: 12, color: T.textDim }}>
            <span><Network size={13} style={{ verticalAlign: 'middle', marginRight: 3 }} />{intrigue.branches.length} Factions</span>
            <span><Users size={13} style={{ verticalAlign: 'middle', marginRight: 3 }} />{totalAgents} Agents</span>
            <span><Eye size={13} style={{ verticalAlign: 'middle', marginRight: 3 }} />{totalRevealed} Revealed</span>
          </div>

          {isDM && view === 'overview' && (
            <button onClick={() => setShowAddBranch(true)}
              style={{
                background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)',
                color: T.gold, padding: '6px 12px', borderRadius: 4, cursor: 'pointer',
                fontFamily: T.ui, fontSize: 11, display: 'flex', alignItems: 'center', gap: 4,
                letterSpacing: '0.5px',
              }}>
              <Plus size={13} /> Faction
            </button>
          )}
        </div>

        {/* ── BODY ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ══════════ OVERVIEW ══════════ */}
          {view === 'overview' && (
            <div className="intrigue-scroll" style={{
              flex: 1, overflowY: 'auto', padding: 20,
            }}>
              {/* Shadow Leader Card */}
              <div style={{
                marginBottom: 20, padding: 20, borderRadius: 8,
                background: 'linear-gradient(135deg, rgba(255,215,0,0.06) 0%, rgba(0,0,0,0.3) 100%)',
                border: '1px solid rgba(255,215,0,0.15)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: intrigue.shadowLeader.revealed ? T.gold : 'rgba(255,215,0,0.1)',
                    border: '2px solid ' + T.gold, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(255,215,0,0.2)',
                    fontSize: 28, fontWeight: 700, color: intrigue.shadowLeader.revealed ? '#000' : T.gold,
                    animation: !intrigue.shadowLeader.revealed ? 'intriguePulse 3s infinite' : 'none',
                  }}>
                    {intrigue.shadowLeader.revealed ? <Crown size={28} /> : '?'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: T.heading, fontSize: 16, fontWeight: 700, color: T.gold }}>
                      {isDM || intrigue.shadowLeader.revealed ? intrigue.shadowLeader.name : 'The Shadow Leader'}
                    </div>
                    <div style={{ fontSize: 12, color: T.textDim, marginTop: 2 }}>{intrigue.shadowLeader.title}</div>
                  </div>
                  <StatusBadge status={intrigue.shadowLeader.status} />
                  <InfluenceStars value={intrigue.shadowLeader.influence} max={5} />
                </div>
              </div>

              {/* Faction Grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14,
              }}>
                {intrigue.branches.map(branch => {
                  const allAgents = [branch.sage, ...branch.agents];
                  const counts = countByStatus(allAgents);
                  const hue = branch.colorHue || 45;
                  const color = branchColor(hue);

                  return (
                    <div
                      key={branch.id}
                      className="intrigue-card"
                      onClick={() => setView(branch.id)}
                      style={{
                        padding: 18, borderRadius: 8, cursor: 'pointer',
                        background: branchBg(hue, 0.5),
                        border: '1px solid ' + branchColor(hue, 0.15),
                        transition: 'all 0.25s',
                      }}
                    >
                      {/* Card Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontFamily: T.heading, fontSize: 15, fontWeight: 700, color }}>
                            {branch.name}
                          </div>
                          <div style={{ fontSize: 11, color: T.textDim, marginTop: 2 }}>{branch.description}</div>
                        </div>
                        <ChevronRight size={16} style={{ color: T.textFaint }} />
                      </div>

                      {/* Power Bar */}
                      <PowerBar value={branch.powerLevel} hue={hue} />

                      {/* Agent Stats */}
                      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: T.textDim }}>
                          <Users size={11} style={{ verticalAlign: 'middle', marginRight: 2 }} />
                          {allAgents.length} agents
                        </span>
                        {counts.revealed > 0 && (
                          <span style={{ fontSize: 11, color: STATUS.revealed.text }}>
                            {counts.revealed} revealed
                          </span>
                        )}
                        {counts.eliminated > 0 && (
                          <span style={{ fontSize: 11, color: STATUS.eliminated.text }}>
                            {counts.eliminated} eliminated
                          </span>
                        )}
                        {counts.suspected > 0 && (
                          <span style={{ fontSize: 11, color: STATUS.suspected.text }}>
                            {counts.suspected} suspected
                          </span>
                        )}
                      </div>

                      {/* Sage Preview */}
                      <div style={{
                        marginTop: 12, padding: '8px 10px', borderRadius: 4,
                        background: 'rgba(0,0,0,0.2)', border: '1px solid ' + branchColor(hue, 0.1),
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: 4,
                          background: branch.sage.revealed ? color : 'rgba(255,255,255,0.06)',
                          border: '1px solid ' + branchColor(hue, 0.3),
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 700, color: branch.sage.revealed ? '#000' : T.textFaint,
                        }}>
                          {branch.sage.revealed ? <Shield size={12} /> : '?'}
                        </div>
                        <div style={{ fontSize: 12, color: T.text, flex: 1 }}>
                          {isDM || branch.sage.revealed ? branch.sage.name : 'Unknown Leader'}
                        </div>
                        <StatusBadge status={branch.sage.status} small />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Branch Modal */}
              {showAddBranch && isDM && (
                <div style={{
                  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }} onClick={() => setShowAddBranch(false)}>
                  <div onClick={e => e.stopPropagation()} style={{
                    background: T.bgCard, border: '1px solid ' + T.border, borderRadius: 8,
                    padding: 24, width: 400, maxWidth: '90vw',
                  }}>
                    <div style={{ fontFamily: T.heading, fontSize: 16, color: T.gold, marginBottom: 16 }}>Create New Faction</div>
                    <SectionLabel>Name</SectionLabel>
                    <EditableText value={newBranchName} onChange={setNewBranchName} placeholder="Faction name..." />
                    <SectionLabel>Description</SectionLabel>
                    <EditableText value={newBranchDesc} onChange={setNewBranchDesc} placeholder="Brief description..." />
                    <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                      <button onClick={addBranch} disabled={!newBranchName.trim()}
                        style={{
                          flex: 1, padding: '10px 16px', background: T.gold, color: '#000',
                          border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: T.ui,
                          fontSize: 12, fontWeight: 700, opacity: newBranchName.trim() ? 1 : 0.4,
                        }}>Create Faction</button>
                      <button onClick={() => setShowAddBranch(false)}
                        style={{
                          padding: '10px 16px', background: 'transparent', color: T.textDim,
                          border: '1px solid ' + T.border, borderRadius: 4, cursor: 'pointer',
                          fontFamily: T.ui, fontSize: 12,
                        }}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════ FACTION DETAIL PAGE ══════════ */}
          {activeBranch && (
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

              {/* LEFT: Hierarchy Tree */}
              <div className="intrigue-scroll" style={{
                flex: 1, overflowY: 'auto', padding: 20, minWidth: 0,
              }}>
                {/* Faction Header Card */}
                <div style={{
                  marginBottom: 16, padding: 16, borderRadius: 8,
                  background: branchBg(activeBranch.colorHue, 0.6),
                  border: '1px solid ' + branchColor(activeBranch.colorHue, 0.15),
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontFamily: T.heading, fontSize: 18, fontWeight: 700, color: branchColor(activeBranch.colorHue) }}>
                      {activeBranch.name}
                    </div>
                    {isDM && (
                      <button onClick={() => removeBranch(activeBranch.id)}
                        style={{ background: 'none', border: 'none', color: T.textFaint, cursor: 'pointer', padding: 4 }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <PowerBar value={activeBranch.powerLevel} hue={activeBranch.colorHue} />

                  {isDM && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                      <SectionLabel>Power Level</SectionLabel>
                      <input type="range" min={0} max={100} value={activeBranch.powerLevel}
                        onChange={e => updateBranch(activeBranch.id, { powerLevel: Number(e.target.value) })}
                        style={{ flex: 1, accentColor: branchColor(activeBranch.colorHue) }}
                      />
                    </div>
                  )}
                </div>

                {/* Hierarchy Tree */}
                <SectionLabel>Hierarchy</SectionLabel>

                {/* Connection to Shadow Leader */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', marginBottom: 4,
                  background: 'rgba(255,215,0,0.04)', borderRadius: 4, border: '1px solid rgba(255,215,0,0.08)',
                  cursor: 'pointer', fontSize: 12, color: T.gold, fontFamily: T.ui,
                }} onClick={() => {
                  setEditingAgent(intrigue.shadowLeader);
                }}>
                  <Crown size={14} />
                  <span>{isDM || intrigue.shadowLeader.revealed ? intrigue.shadowLeader.name : 'The Shadow Leader'}</span>
                  <ChevronDown size={12} style={{ marginLeft: 'auto', color: T.textFaint }} />
                </div>

                {/* Sage (Inner Circle) */}
                <TreeNode
                  agent={activeBranch.sage}
                  hue={activeBranch.colorHue}
                  depth={1}
                  isDM={isDM}
                  onSelect={a => setEditingAgent(a)}
                  isSelected={editingAgent?.id === activeBranch.sage.id}
                />

                {/* Agents */}
                {activeBranch.agents.map(agent => (
                  <TreeNode
                    key={agent.id}
                    agent={agent}
                    hue={activeBranch.colorHue}
                    depth={2}
                    isDM={isDM}
                    onSelect={a => setEditingAgent(a)}
                    isSelected={editingAgent?.id === agent.id}
                  />
                ))}

                {/* Add Agent Button */}
                {isDM && (
                  <div style={{ marginLeft: 56, marginTop: 4 }}>
                    <button onClick={() => addAgentToBranch(activeBranch.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
                        background: 'rgba(255,255,255,0.03)', border: '1px dashed ' + T.border,
                        borderRadius: 6, cursor: 'pointer', color: T.textDim, fontSize: 12,
                        fontFamily: T.ui, width: '100%',
                      }}>
                      <UserPlus size={13} /> Add Operative
                    </button>
                  </div>
                )}

                {/* Event Log */}
                <SectionLabel>Event Log</SectionLabel>
                <div style={{ marginTop: 4 }}>
                  {(intrigue.globalEvents || []).filter(e => !e.branchId || e.branchId === activeBranch.id).slice(-10).reverse().map(evt => (
                    <div key={evt.id} style={{
                      padding: '6px 10px', marginBottom: 3, borderRadius: 4,
                      background: 'rgba(0,0,0,0.15)', fontSize: 12, color: T.textDim,
                      borderLeft: '2px solid ' + branchColor(activeBranch.colorHue, 0.3),
                    }}>
                      <span style={{ color: T.textFaint, fontSize: 10, marginRight: 6 }}>{evt.date}</span>
                      {evt.text}
                    </div>
                  ))}
                  {isDM && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      <EditableText value={newEventText} onChange={setNewEventText} placeholder="Log an event..." />
                      <button onClick={() => { addEvent(activeBranch.id, newEventText); setNewEventText(''); }}
                        disabled={!newEventText.trim()}
                        style={{
                          padding: '6px 12px', background: branchColor(activeBranch.colorHue, 0.2),
                          border: '1px solid ' + branchColor(activeBranch.colorHue, 0.3),
                          color: branchColor(activeBranch.colorHue), borderRadius: 4, cursor: 'pointer',
                          fontSize: 11, fontFamily: T.ui, whiteSpace: 'nowrap',
                          opacity: newEventText.trim() ? 1 : 0.4,
                        }}>
                        <Plus size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Agent Detail Panel */}
              {editingAgent && (
                <div className="intrigue-scroll" style={{
                  width: 380, borderLeft: '1px solid ' + T.border,
                  overflowY: 'auto', background: 'rgba(0,0,0,0.15)',
                  animation: 'intrigueSlideIn 0.25s ease',
                  flexShrink: 0,
                }}>
                  <div style={{ padding: 20 }}>
                    {/* Close */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ fontFamily: T.heading, fontSize: 14, color: T.gold, letterSpacing: '1px' }}>
                        {RANK_LABELS[editingAgent.rank] || 'Agent'} Detail
                      </div>
                      <button onClick={() => setEditingAgent(null)}
                        style={{ background: 'none', border: 'none', color: T.textFaint, cursor: 'pointer' }}>
                        <X size={16} />
                      </button>
                    </div>

                    {/* Status Badge */}
                    <div style={{ marginBottom: 16, textAlign: 'center' }}>
                      <StatusBadge status={editingAgent.status} />
                    </div>

                    {/* Name & Title */}
                    {isDM ? (
                      <>
                        <SectionLabel>Name</SectionLabel>
                        <EditableText
                          value={editingAgent.name}
                          onChange={v => {
                            const b = findBranchForAgent(editingAgent.id);
                            if (b) updateAgentInBranch(b.id, editingAgent.id, { name: v });
                            else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, name: v } });
                          }}
                          placeholder="Agent name..."
                        />
                        <SectionLabel>Title / Position</SectionLabel>
                        <EditableText
                          value={editingAgent.title}
                          onChange={v => {
                            const b = findBranchForAgent(editingAgent.id);
                            if (b) updateAgentInBranch(b.id, editingAgent.id, { title: v });
                            else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, title: v } });
                          }}
                          placeholder="Title or role..."
                        />
                      </>
                    ) : (
                      <>
                        <div style={{ fontFamily: T.heading, fontSize: 18, fontWeight: 700, color: T.text, marginBottom: 4 }}>
                          {editingAgent.revealed ? editingAgent.name : 'Unknown ' + (RANK_LABELS[editingAgent.rank] || 'Agent')}
                        </div>
                        {editingAgent.revealed && editingAgent.title && (
                          <div style={{ fontSize: 13, color: T.textDim, marginBottom: 12 }}>{editingAgent.title}</div>
                        )}
                      </>
                    )}

                    {/* Location */}
                    <SectionLabel>Location</SectionLabel>
                    {isDM ? (
                      <EditableText
                        value={editingAgent.location}
                        onChange={v => {
                          const b = findBranchForAgent(editingAgent.id);
                          if (b) updateAgentInBranch(b.id, editingAgent.id, { location: v });
                          else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, location: v } });
                        }}
                        placeholder="Last known location..."
                      />
                    ) : (
                      <div style={{ fontSize: 13, color: T.text }}>{editingAgent.location || 'Unknown'}</div>
                    )}

                    {/* Influence */}
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
                          style={{ flex: 1, accentColor: T.gold }}
                        />
                      )}
                    </div>

                    {/* Status Selector (DM) */}
                    {isDM && (
                      <>
                        <SectionLabel>Status</SectionLabel>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {STATUS_KEYS.map(key => (
                            <button key={key}
                              onClick={() => {
                                const patch = { status: key, revealed: key !== 'hidden' ? true : editingAgent.revealed };
                                const b = findBranchForAgent(editingAgent.id);
                                if (b) updateAgentInBranch(b.id, editingAgent.id, patch);
                                else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, ...patch } });
                              }}
                              style={{
                                padding: '4px 10px', borderRadius: 10, border: 'none', cursor: 'pointer',
                                fontSize: 10, fontWeight: 600, fontFamily: T.ui, letterSpacing: '0.5px',
                                background: editingAgent.status === key ? STATUS[key].color : 'rgba(255,255,255,0.04)',
                                color: editingAgent.status === key ? STATUS[key].text : T.textFaint,
                              }}>
                              {STATUS[key].label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Clues */}
                    <SectionLabel>Clues ({(editingAgent.clues || []).length})</SectionLabel>
                    <div style={{
                      background: 'rgba(0,0,0,0.2)', borderRadius: 4, padding: 8,
                      borderLeft: '2px solid ' + T.gold,
                    }}>
                      {(editingAgent.clues || []).length === 0 && (
                        <div style={{ fontSize: 12, color: T.textFaint, fontStyle: 'italic' }}>No clues discovered yet.</div>
                      )}
                      {(editingAgent.clues || []).map((clue, i) => (
                        <div key={i} style={{ fontSize: 12, color: T.textDim, padding: '4px 0', borderBottom: i < editingAgent.clues.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                          <span style={{ color: T.gold, marginRight: 6, fontSize: 10 }}>#{i + 1}</span>
                          {clue}
                        </div>
                      ))}
                      {isDM && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                          <EditableText value={newClue} onChange={setNewClue} placeholder="Add clue..." style={{ fontSize: 11 }} />
                          <button onClick={() => {
                            const b = findBranchForAgent(editingAgent.id);
                            if (b) addClueToAgent(b.id, editingAgent.id, newClue);
                            setNewClue('');
                          }} disabled={!newClue.trim()}
                            style={{
                              padding: '4px 10px', background: 'rgba(255,215,0,0.15)',
                              border: '1px solid rgba(255,215,0,0.2)', color: T.gold,
                              borderRadius: 4, cursor: 'pointer', fontSize: 10,
                              opacity: newClue.trim() ? 1 : 0.4,
                            }}>
                            <Plus size={11} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* DM Notes */}
                    {isDM && (
                      <>
                        <SectionLabel>DM Notes</SectionLabel>
                        <EditableText
                          multiline
                          value={editingAgent.notes}
                          onChange={v => {
                            const b = findBranchForAgent(editingAgent.id);
                            if (b) updateAgentInBranch(b.id, editingAgent.id, { notes: v });
                            else if (editingAgent.id === 'leader') update({ shadowLeader: { ...intrigue.shadowLeader, notes: v } });
                          }}
                          placeholder="Private DM notes..."
                        />
                      </>
                    )}

                    {/* Actions */}
                    {isDM && editingAgent.id !== 'leader' && (
                      <>
                        <SectionLabel>Actions</SectionLabel>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {!editingAgent.revealed && (
                            <button onClick={() => {
                              const b = findBranchForAgent(editingAgent.id);
                              if (b) updateAgentInBranch(b.id, editingAgent.id, { revealed: true, status: 'revealed' });
                            }} style={{
                              padding: '8px 14px', borderRadius: 4, border: 'none', cursor: 'pointer',
                              background: STATUS.revealed.color, color: '#fff', fontSize: 12,
                              fontFamily: T.ui, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                              <Eye size={13} /> Reveal
                            </button>
                          )}
                          {editingAgent.rank === 'agent' && (
                            <button onClick={() => {
                              if (confirm('Remove this agent permanently?')) {
                                removeAgentFromBranch(activeBranch.id, editingAgent.id);
                              }
                            }} style={{
                              padding: '8px 14px', borderRadius: 4, border: '1px solid ' + T.crimson,
                              background: 'transparent', color: T.crimson, fontSize: 12,
                              fontFamily: T.ui, fontWeight: 600, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: 4,
                            }}>
                              <Trash2 size={13} /> Remove
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  window.CourtIntrigueView = CourtIntrigueView;
})();
