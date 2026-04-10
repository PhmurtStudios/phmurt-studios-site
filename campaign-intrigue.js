(function() {
  'use strict';
  console.log('[Intrigue] Module loading v156 — full rewrite');

  const { useState, useEffect, useCallback, useRef, useMemo, Fragment } = React;
  const LR = window.LucideReact || {};
  // Safely get icons with fallbacks
  const icon = (name) => LR[name] || null;
  const Crown = icon('Crown');
  const Eye = icon('Eye');
  const EyeOff = icon('EyeOff');
  const Users = icon('Users');
  const Shield = icon('Shield');
  const Skull = icon('Skull');
  const Lock = icon('Lock');
  const Unlock = icon('Unlock');
  const ChevronDown = icon('ChevronDown');
  const ChevronUp = icon('ChevronUp');
  const Plus = icon('Plus');
  const Trash2 = icon('Trash2');
  const X = icon('X');
  const Star = icon('Star');
  const Target = icon('Target');
  const Search = icon('Search');
  const Activity = icon('Activity');
  const Sparkles = icon('Sparkles');
  const RotateCcw = icon('RotateCcw');
  const ArrowLeft = icon('ArrowLeft');
  const ChevronRight = icon('ChevronRight');
  const MapPin = icon('MapPin');
  const Zap = icon('Zap');
  const Network = icon('Network');
  const UserPlus = icon('UserPlus');
  const Circle = icon('Circle');
  const Swords = icon('Swords');
  const AlertTriangle = icon('AlertTriangle');
  const Flag = icon('Flag');
  const TrendingUp = icon('TrendingUp');
  const Layers = icon('Layers');
  const Link2 = icon('Link') || icon('Link2');
  const Globe = icon('Globe');
  const Flame = icon('Flame');
  const BookOpen = icon('BookOpen');

  const T = window.__PHMURT_THEME || {};
  try { if (window.T) Object.assign(T, window.T); } catch(e) {}

  /* ═══════════════════════════════════════════════════════════
     CONSTANTS & STATUS SYSTEM
  ═══════════════════════════════════════════════════════════ */
  const STATUS = {
    hidden:     { label: 'Hidden',     bg: 'rgba(120,120,170,0.7)', text: '#b0b0e0', icon: EyeOff },
    suspected:  { label: 'Suspected',  bg: 'rgba(255,200,0,0.6)',   text: '#ffe066', icon: Search },
    revealed:   { label: 'Revealed',   bg: 'rgba(76,175,80,0.6)',   text: '#81c784', icon: Eye },
    eliminated: { label: 'Eliminated', bg: 'rgba(220,60,50,0.6)',   text: '#ef5350', icon: Skull },
    turned:     { label: 'Turned',     bg: 'rgba(130,80,220,0.6)',  text: '#b39ddb', icon: RotateCcw },
    fled:       { label: 'Fled',       bg: 'rgba(100,100,100,0.5)', text: '#999',    icon: ArrowLeft },
  };
  const STATUS_KEYS = Object.keys(STATUS);
  const RANK_LABELS = { leader: 'Arch-Conspirator', sage: 'Inner Circle', agent: 'Operative', asset: 'Asset' };

  const SCHEME_TYPES = [
    { id: 'assassination', label: 'Assassination', icon: Skull, color: '#ef5350' },
    { id: 'blackmail',     label: 'Blackmail',     icon: Lock,  color: '#ab47bc' },
    { id: 'infiltration',  label: 'Infiltration',  icon: EyeOff, color: '#42a5f5' },
    { id: 'sabotage',      label: 'Sabotage',      icon: Flame, color: '#ff7043' },
    { id: 'recruitment',   label: 'Recruitment',   icon: UserPlus, color: '#66bb6a' },
    { id: 'heist',         label: 'Heist',         icon: Target, color: '#ffd740' },
    { id: 'propaganda',    label: 'Propaganda',    icon: BookOpen, color: '#26c6da' },
    { id: 'alliance',      label: 'Alliance',      icon: Link2, color: '#ec407a' },
  ];

  const CONNECTION_TYPES = [
    { id: 'alliance',  label: 'Secret Alliance',  color: '#66bb6a', dash: '' },
    { id: 'rivalry',   label: 'Bitter Rivalry',    color: '#ef5350', dash: '6 3' },
    { id: 'debt',      label: 'Owes a Debt',       color: '#ffd740', dash: '2 4' },
    { id: 'spy',       label: 'Planted Spy',       color: '#42a5f5', dash: '8 2 2 2' },
    { id: 'family',    label: 'Blood Relation',    color: '#ab47bc', dash: '' },
    { id: 'romance',   label: 'Secret Lovers',     color: '#ec407a', dash: '4 2' },
    { id: 'blackmail', label: 'Being Blackmailed', color: '#ff7043', dash: '3 3' },
  ];

  const DISTRICTS = [
    'Palace Quarter', 'Merchant District', 'Temple Ward', 'Military Fortress',
    'Slums & Underworld', 'Docks & Harbor', 'Noble Estates', 'Scholar\'s Row',
    'Market Square', 'Outer Wall',
  ];

  /* ═══════════════════════════════════════════════════════════
     WORLD INTEGRATION HELPERS
  ═══════════════════════════════════════════════════════════ */
  function getWorldDistricts(data) {
    var cities = (data && data.cities) || [];
    var regions = (data && data.regions) || [];
    if (cities.length > 0) return cities.map(function(c) { return c.name; });
    if (regions.length > 0) return regions.map(function(r) { return r.name; });
    return DISTRICTS; // fallback to hardcoded
  }

  function getWorldNPCAgents(data) {
    if (!data || !data.npcs || data.npcs.length === 0) return [];
    var relevantRoles = ['spy', 'thief', 'noble', 'merchant', 'guard'];
    var filtered = data.npcs.filter(function(npc) {
      var role = (npc.role || '').toLowerCase();
      return relevantRoles.some(function(r) { return role.includes(r); });
    });
    // If no exact matches, just take first few NPCs
    var npcList = filtered.length > 0 ? filtered : data.npcs.slice(0, 3);
    return npcList.map(function(npc) {
      return makeAgent({
        name: npc.name || 'Unknown',
        title: npc.role || '',
        location: npc.region || '',
        influence: Math.floor(Math.random() * 3) + 1,
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     DATA FACTORIES
  ═══════════════════════════════════════════════════════════ */
  const uid = () => 'i_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);

  const makeAgent = (o) => ({
    id: uid(), name: 'Unknown Agent', title: '', rank: 'agent',
    status: 'hidden', revealed: false, influence: 2,
    location: '', notes: '', clues: [], ...o,
  });

  const makeScheme = (o) => ({
    id: uid(), type: 'infiltration', name: 'Unnamed Scheme', description: '',
    progress: 0, status: 'active', assignedAgents: [],
    targetFaction: null, targetDistrict: null, ...o,
  });

  const makeConnection = (o) => ({
    id: uid(), type: 'alliance', fromAgent: '', toAgent: '',
    fromFaction: '', toFaction: '', notes: '', revealed: false, ...o,
  });

  const makeBranch = (o) => ({
    id: uid(), name: 'New Faction', description: '', motto: '',
    colorHue: Math.floor(Math.random() * 360), powerLevel: 50,
    sage: makeAgent({ rank: 'sage', name: 'Unknown Leader', influence: 4 }),
    agents: [], schemes: [], events: [],
    territories: [], // district names this faction controls
    ...o,
  });

  const initializeIntrigueData = function(data) {
    var defaultBranches = [
      makeBranch({ id: 'crown', name: 'The Crown', description: 'Royal Court manipulation', motto: 'The throne remembers', colorHue: 45, powerLevel: 75,
        sage: makeAgent({ id: 'sage_crown', rank: 'sage', name: 'The Courtier', title: 'Royal Advisor', influence: 4, location: 'Palace' }),
        agents: [
          makeAgent({ id: 'a_c1', name: 'Lord Theron', title: 'Chancellor', influence: 3, location: 'Throne Room' }),
          makeAgent({ id: 'a_c2', name: 'Lady Morgeth', title: 'Court Enchantress', influence: 3, location: 'Tower of Sages' }),
          makeAgent({ id: 'a_c3', name: 'Master Aldric', title: 'Head Guard Captain', influence: 2, location: 'Guard Barracks' }),
        ],
        schemes: [makeScheme({ name: 'Influence the King\'s Decree', type: 'propaganda', progress: 40, targetDistrict: 'Palace Quarter' })],
        territories: ['Palace Quarter', 'Noble Estates'],
      }),
      makeBranch({ id: 'coin', name: 'The Coin', description: 'Economic & merchant guild control', motto: 'Gold speaks louder than steel', colorHue: 35, powerLevel: 68,
        sage: makeAgent({ id: 'sage_coin', rank: 'sage', name: 'The Merchant Prince', title: 'Guild Master', influence: 4, location: 'Merchant District' }),
        agents: [
          makeAgent({ id: 'a_m1', name: 'Kess the Banker', title: 'Master of Coins', influence: 3, location: 'Treasury House' }),
          makeAgent({ id: 'a_m2', name: 'Varys the Trader', title: 'Spice Merchant', influence: 3, location: 'Market Square' }),
          makeAgent({ id: 'a_m3', name: 'Helena Goldsmith', title: 'Jeweler & Fence', influence: 2, location: 'Jewel Quarter' }),
        ],
        schemes: [makeScheme({ name: 'Corner the Grain Market', type: 'sabotage', progress: 65, targetDistrict: 'Market Square' })],
        territories: ['Merchant District', 'Market Square'],
      }),
      makeBranch({ id: 'sword', name: 'The Sword', description: 'Military infiltration', motto: 'Strength is the only law', colorHue: 0, powerLevel: 82,
        sage: makeAgent({ id: 'sage_sword', rank: 'sage', name: 'The General', title: 'War Commander', influence: 5, location: 'Military Fortress' }),
        agents: [
          makeAgent({ id: 'a_s1', name: 'Commander Darius', title: 'Colonel of the North', influence: 4, location: 'Northern Camp' }),
          makeAgent({ id: 'a_s2', name: 'Captain Lena', title: 'Shadow Ops', influence: 3, location: 'Secret Base' }),
          makeAgent({ id: 'a_s3', name: 'Sergeant Vex', title: 'Supply Master', influence: 2, location: 'Armory' }),
        ],
        schemes: [makeScheme({ name: 'Arm the Rebellion', type: 'recruitment', progress: 30, targetDistrict: 'Outer Wall' })],
        territories: ['Military Fortress', 'Outer Wall'],
      }),
      makeBranch({ id: 'eye', name: 'The Eye', description: 'Spy network & information', motto: 'Knowledge is the sharpest blade', colorHue: 210, powerLevel: 71,
        sage: makeAgent({ id: 'sage_eye', rank: 'sage', name: 'The Spymaster', title: 'Master of Shadows', influence: 4, location: 'Hidden Lair' }),
        agents: [
          makeAgent({ id: 'a_e1', name: 'Whisper', title: 'Information Broker', influence: 3, location: 'Tavern' }),
          makeAgent({ id: 'a_e2', name: 'Rook', title: 'Street Informant', influence: 2, location: 'Underworld' }),
          makeAgent({ id: 'a_e3', name: 'Maven', title: 'Scholar & Archive', influence: 3, location: 'Library' }),
          makeAgent({ id: 'a_e4', name: 'Shadow', title: 'Assassin', influence: 4, location: 'Rooftops' }),
        ],
        schemes: [makeScheme({ name: 'Steal the Treaty', type: 'heist', progress: 55, targetDistrict: 'Palace Quarter' })],
        territories: ['Scholar\'s Row', 'Docks & Harbor'],
      }),
      makeBranch({ id: 'whisper', name: 'The Whisper', description: 'Religious manipulation', motto: 'The gods whisper only to us', colorHue: 270, powerLevel: 64,
        sage: makeAgent({ id: 'sage_whisper', rank: 'sage', name: 'The High Priest', title: 'Divine Authority', influence: 4, location: 'Temple' }),
        agents: [
          makeAgent({ id: 'a_w1', name: 'Bishop Aldric', title: 'Temple Administrator', influence: 3, location: 'Sacred Temple' }),
          makeAgent({ id: 'a_w2', name: 'Priestess Lyra', title: 'Oracle', influence: 3, location: 'Shrine' }),
        ],
        schemes: [makeScheme({ name: 'Prophecy of Doom', type: 'propaganda', progress: 20, targetDistrict: 'Temple Ward' })],
        territories: ['Temple Ward'],
      }),
      makeBranch({ id: 'mask', name: 'The Mask', description: 'Underground & criminal', motto: 'Every face hides another', colorHue: 350, powerLevel: 79,
        sage: makeAgent({ id: 'sage_mask', rank: 'sage', name: 'The Crime Lord', title: 'Underworld Boss', influence: 5, location: 'Underground' }),
        agents: [
          makeAgent({ id: 'a_k1', name: 'Blackthorn', title: 'Assassin Guild Leader', influence: 4, location: 'Guild Hall' }),
          makeAgent({ id: 'a_k2', name: 'Scar', title: 'Thief', influence: 3, location: 'Slums' }),
          makeAgent({ id: 'a_k3', name: 'Echo', title: 'Fence', influence: 2, location: 'Black Market' }),
          makeAgent({ id: 'a_k4', name: 'Raze', title: 'Enforcer', influence: 3, location: 'Docks' }),
        ],
        schemes: [
          makeScheme({ name: 'Eliminate the Witness', type: 'assassination', progress: 80, targetDistrict: 'Slums & Underworld' }),
          makeScheme({ name: 'Smuggling Ring', type: 'heist', progress: 45, targetDistrict: 'Docks & Harbor' }),
        ],
        territories: ['Slums & Underworld'],
      }),
    ];

    // Generate branches from world factions if available
    var branches = defaultBranches;
    var worldFactions = (data && data.factions) || [];
    if (worldFactions.length > 0) {
      branches = worldFactions.map(function(f, idx) {
        var colorHue = f.color ? parseInt(f.color.replace('#', ''), 16) % 360 : (idx * 60) % 360;
        return makeBranch({
          name: f.name || 'Unknown Faction',
          description: f.govType ? 'Faction of ' + f.govType + ' alignment' : 'Mystery faction',
          colorHue: colorHue,
          powerLevel: 50 + Math.floor(Math.random() * 30),
          sage: makeAgent({
            rank: 'sage',
            name: (f.name || 'Unknown') + ' Leader',
            title: f.govType || 'Leader',
            influence: 4,
          }),
          agents: getWorldNPCAgents(data).slice(0, 2),
        });
      });
    }

    return {
      shadowLeader: makeAgent({
        id: 'leader', name: 'The Shadow Leader', rank: 'leader',
        title: 'True Power Behind the Throne', influence: 5,
        location: 'Unknown', notes: 'The ultimate architect of this conspiracy',
      }),
      branches: branches,
      connections: [
        makeConnection({ type: 'rivalry', fromAgent: 'sage_sword', toAgent: 'sage_mask', fromFaction: 'sword', toFaction: 'mask', notes: 'The General despises the criminal underworld' }),
        makeConnection({ type: 'alliance', fromAgent: 'sage_coin', toAgent: 'sage_mask', fromFaction: 'coin', toFaction: 'mask', notes: 'Secret trade deal — the Coin launders for the Mask' }),
        makeConnection({ type: 'spy', fromAgent: 'a_e1', toAgent: 'a_c1', fromFaction: 'eye', toFaction: 'crown', notes: 'Whisper has ears in the Chancellor\'s office' }),
        makeConnection({ type: 'blackmail', fromAgent: 'a_k1', toAgent: 'a_w1', fromFaction: 'mask', toFaction: 'whisper', notes: 'Blackthorn knows the Bishop\'s secret' }),
        makeConnection({ type: 'family', fromAgent: 'a_c2', toAgent: 'a_w2', fromFaction: 'crown', toFaction: 'whisper', notes: 'Sisters, separated in childhood' }),
      ],
      globalEvents: [{ id: uid(), date: 'Day 1', text: 'The conspiracy begins...', branchId: null }],
    };
  };

  /* ═══════════════════════════════════════════════════════════
     HELPERS
  ═══════════════════════════════════════════════════════════ */
  const hC = (hue, a) => `hsla(${hue}, 60%, 55%, ${a === undefined ? 1 : a})`;
  const hBg = (hue, a) => `hsla(${hue}, 40%, 12%, ${a === undefined ? 1 : a})`;
  const hGlow = (hue) => `0 0 20px hsla(${hue}, 60%, 55%, 0.3)`;
  const gld = T.gold || '#ffd700';
  const bdr = T.border || '#333';
  const txt = T.text || '#eee';
  const dim = T.textDim || '#888';
  const fnt = T.textFaint || '#555';
  const bg0 = T.bg || '#0a0a1a';
  const ui = T.ui || 'system-ui, sans-serif';
  const hd = T.heading || 'Georgia, serif';
  const bd = T.body || 'system-ui, sans-serif';

  const I = (Ic, sz) => Ic ? React.createElement(Ic, { size: sz || 14 }) : null;

  /* ═══════════════════════════════════════════════════════════
     MICRO-COMPONENTS
  ═══════════════════════════════════════════════════════════ */
  function StatusBadge({ status, small }) {
    const s = STATUS[status] || STATUS.hidden;
    return React.createElement('span', {
      style: { display: 'inline-flex', alignItems: 'center', gap: 3,
        background: s.bg, color: s.text, padding: small ? '1px 5px' : '2px 8px',
        borderRadius: 10, fontSize: small ? 9 : 10, fontWeight: 600,
        letterSpacing: '0.5px', fontFamily: ui, textTransform: 'uppercase', whiteSpace: 'nowrap' }
    }, I(s.icon, small ? 9 : 11), s.label);
  }

  function InfluenceStars({ value, max, color }) {
    const stars = [];
    for (var i = 0; i < (max || 5); i++) {
      stars.push(Star ? React.createElement(Star, { key: i, size: 10,
        fill: i < value ? (color || gld) : 'transparent',
        color: i < value ? (color || gld) : fnt }) : null);
    }
    return React.createElement('span', { style: { display: 'inline-flex', gap: 1 } }, stars);
  }

  function PowerBar({ value, hue, height }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
        <div style={{ flex: 1, height: height || 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 3, width: Math.min(100, value) + '%',
            background: 'linear-gradient(90deg, ' + hC(hue, 0.6) + ', ' + hC(hue, 1) + ')',
            transition: 'width 0.5s ease', boxShadow: '0 0 8px ' + hC(hue, 0.3) }} />
        </div>
        <span style={{ fontSize: 10, color: hC(hue), fontWeight: 700, fontFamily: ui, minWidth: 26, textAlign: 'right' }}>{value}%</span>
      </div>
    );
  }

  function Inp({ value, onChange, placeholder, multiline, style: s }) {
    const Tag = multiline ? 'textarea' : 'input';
    return React.createElement(Tag, {
      value: value || '', onChange: function(e) { onChange(e.target.value); },
      placeholder: placeholder || '',
      style: Object.assign({ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid ' + bdr,
        color: txt, padding: '5px 8px', borderRadius: 4, fontFamily: bd, fontSize: 12,
        resize: multiline ? 'vertical' : 'none', minHeight: multiline ? 50 : 'auto', outline: 'none' }, s || {})
    });
  }

  function Lbl({ children }) {
    return <div style={{ fontSize: 9, fontWeight: 700, color: fnt, textTransform: 'uppercase',
      letterSpacing: '1.5px', marginBottom: 4, fontFamily: ui, marginTop: 14 }}>{children}</div>;
  }

  function Btn({ children, onClick, color, disabled, small, outline }) {
    return (
      <button onClick={onClick} disabled={disabled} style={{
        padding: small ? '3px 8px' : '6px 12px', borderRadius: 4, cursor: disabled ? 'default' : 'pointer',
        fontSize: small ? 10 : 11, fontWeight: 600, fontFamily: ui, display: 'flex', alignItems: 'center', gap: 4,
        letterSpacing: '0.3px', opacity: disabled ? 0.4 : 1, transition: 'all 0.15s',
        background: outline ? 'transparent' : (color || gld) + '22',
        border: '1px solid ' + (color || gld) + '44',
        color: color || gld,
      }}>{children}</button>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     SVG WEB PRIMITIVES
  ═══════════════════════════════════════════════════════════ */
  function SvgLine({ x1, y1, x2, y2, color, opacity, dash, thickness, pulse, glow }) {
    var dx = x2 - x1, dy = y2 - y1;
    var len = Math.sqrt(dx*dx + dy*dy) || 1;
    var px = -dy/len * len * 0.08, py = dx/len * len * 0.08;
    var mx = (x1+x2)/2 + px, my = (y1+y2)/2 + py;
    var d = 'M ' + x1 + ' ' + y1 + ' Q ' + mx + ' ' + my + ' ' + x2 + ' ' + y2;
    return (
      <g>
        {glow && <path d={d} fill="none" stroke={color} strokeWidth={(thickness||1.5)+3} strokeOpacity={(opacity||0.5)*0.12} />}
        <path d={d} fill="none" stroke={color} strokeWidth={thickness||1.5} strokeOpacity={opacity||0.5}
          strokeDasharray={dash || (pulse ? '4 4' : 'none')}>
          {pulse && <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.5s" repeatCount="indefinite" />}
        </path>
      </g>
    );
  }

  function SvgNode({ x, y, r, color, filled, pulsing, selected, label, sub, onClick }) {
    return (
      <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }} className="web-node">
        {pulsing && (
          <circle cx={x} cy={y} r={r+8} fill="none" stroke={color} strokeWidth={1.5} strokeOpacity={0.2}>
            <animate attributeName="r" values={(r+5)+';'+(r+12)+';'+(r+5)} dur="2.5s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" values="0.25;0.05;0.25" dur="2.5s" repeatCount="indefinite" />
          </circle>
        )}
        {selected && <circle cx={x} cy={y} r={r+4} fill="none" stroke={color} strokeWidth={2.5} strokeOpacity={0.6} />}
        <circle cx={x} cy={y} r={r} fill={filled ? color : 'rgba(0,0,0,0.7)'} stroke={color}
          strokeWidth={filled ? 0.5 : 1.5} />
        {!filled && (
          <text x={x} y={y+1} textAnchor="middle" dominantBaseline="middle"
            fill={color} fontSize={r*0.7} fontWeight="700" fontFamily={ui}>?</text>
        )}
        {label && (
          <text x={x} y={y+r+13} textAnchor="middle" fill={txt}
            fontSize={10} fontWeight="600" fontFamily={hd}>
            {label.length > 14 ? label.slice(0,12) + '\u2026' : label}
          </text>
        )}
        {sub && (
          <text x={x} y={y+r+24} textAnchor="middle" fill={dim} fontSize={8} fontFamily={ui}>
            {sub.length > 18 ? sub.slice(0,16) + '\u2026' : sub}
          </text>
        )}
      </g>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     SCHEME CARD
  ═══════════════════════════════════════════════════════════ */
  function SchemeCard({ scheme, hue, isDM, onUpdate, onRemove, data }) {
    var st = SCHEME_TYPES.find(function(t) { return t.id === scheme.type; }) || SCHEME_TYPES[0];
    var progressColor = scheme.progress >= 80 ? '#ef5350' : scheme.progress >= 50 ? '#ffa726' : '#66bb6a';
    var districts = getWorldDistricts(data);
    return (
      <div style={{
        padding: '10px 12px', borderRadius: 6, marginBottom: 6,
        background: 'rgba(0,0,0,0.25)', border: '1px solid ' + hC(hue, 0.1),
        borderLeft: '3px solid ' + st.color,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          {I(st.icon, 13)}
          <span style={{ fontSize: 11, fontWeight: 700, color: st.color, fontFamily: ui, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{st.label}</span>
          <span style={{ flex: 1, fontSize: 12, color: txt, fontFamily: hd, marginLeft: 4 }}>{scheme.name}</span>
          {isDM && onRemove && (
            <span onClick={onRemove} style={{ cursor: 'pointer', color: fnt, fontSize: 10 }}>{I(Trash2, 11)}</span>
          )}
        </div>
        {scheme.description && <div style={{ fontSize: 11, color: dim, marginBottom: 6 }}>{scheme.description}</div>}
        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: scheme.progress + '%', borderRadius: 3,
              background: 'linear-gradient(90deg, ' + st.color + '88, ' + st.color + ')',
              transition: 'width 0.3s ease',
              boxShadow: scheme.progress >= 75 ? '0 0 8px ' + st.color + '66' : 'none' }} />
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: progressColor, fontFamily: ui, minWidth: 28 }}>{scheme.progress}%</span>
        </div>
        {isDM && (
          <input type="range" min={0} max={100} value={scheme.progress}
            onChange={function(e) { onUpdate({ progress: Number(e.target.value) }); }}
            style={{ width: '100%', accentColor: st.color, marginTop: 4, height: 4 }} />
        )}
        {isDM && (
          <div style={{ marginTop: 6 }}>
            <div style={{ fontSize: 9, color: fnt, fontStyle: 'italic', marginBottom: 2 }}>Target District:</div>
            <select value={scheme.targetDistrict || ''} onChange={function(e) { onUpdate({ targetDistrict: e.target.value || null }); }}
              style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid ' + bdr, color: txt,
                fontSize: 10, padding: '3px 6px', borderRadius: 3, fontFamily: ui }} >
              <option value="">No target</option>
              {districts.map(function(d) {
                return <option key={d} value={d}>{d}</option>;
              })}
            </select>
          </div>
        )}
        {!isDM && scheme.targetDistrict && (
          <div style={{ fontSize: 10, color: fnt, marginTop: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
            {I(MapPin, 9)} Target: {scheme.targetDistrict}
          </div>
        )}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     CONNECTION BADGE (for the web lines)
  ═══════════════════════════════════════════════════════════ */
  function ConnectionBadge({ conn, intrigue, isDM, onRemove }) {
    var ct = CONNECTION_TYPES.find(function(t) { return t.id === conn.type; }) || CONNECTION_TYPES[0];
    var fromName = findAgentName(intrigue, conn.fromAgent, isDM);
    var toName = findAgentName(intrigue, conn.toAgent, isDM);
    return (
      <div style={{
        padding: '6px 10px', borderRadius: 4, marginBottom: 4,
        background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid ' + ct.color,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 10, color: ct.color, fontWeight: 700, fontFamily: ui, textTransform: 'uppercase', letterSpacing: '0.5px', minWidth: 70 }}>{ct.label}</span>
        <span style={{ fontSize: 11, color: txt }}>{fromName}</span>
        <span style={{ fontSize: 9, color: fnt }}>{'\u2194'}</span>
        <span style={{ fontSize: 11, color: txt }}>{toName}</span>
        {conn.notes && <span style={{ fontSize: 10, color: dim, fontStyle: 'italic', flex: 1, textAlign: 'right' }}>{conn.notes.length > 30 ? conn.notes.slice(0,28) + '\u2026' : conn.notes}</span>}
        {isDM && onRemove && <span onClick={onRemove} style={{ cursor: 'pointer', color: fnt, marginLeft: 4 }}>{I(X, 10)}</span>}
      </div>
    );
  }

  function findAgentName(intrigue, agentId, isDM) {
    if (!agentId) return '?';
    if (intrigue.shadowLeader.id === agentId) return isDM || intrigue.shadowLeader.revealed ? intrigue.shadowLeader.name : '???';
    for (var i = 0; i < intrigue.branches.length; i++) {
      var b = intrigue.branches[i];
      if (b.sage.id === agentId) return isDM || b.sage.revealed ? b.sage.name : '???';
      for (var j = 0; j < b.agents.length; j++) {
        if (b.agents[j].id === agentId) return isDM || b.agents[j].revealed ? b.agents[j].name : '???';
      }
    }
    return '???';
  }

  /* ═══════════════════════════════════════════════════════════
     INFLUENCE MAP (territory control visualization)
  ═══════════════════════════════════════════════════════════ */
  function InfluenceMap({ intrigue, isDM, data }) {
    var districts = getWorldDistricts(data);
    var districtMap = {};
    districts.forEach(function(d) { districtMap[d] = []; });
    intrigue.branches.forEach(function(b) {
      (b.territories || []).forEach(function(t) {
        if (districtMap[t]) districtMap[t].push(b);
      });
    });

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 6 }}>
        {districts.map(function(dist) {
          var factions = districtMap[dist] || [];
          var contested = factions.length > 1;
          var owner = factions[0];
          var bgColor = owner ? hC(owner.colorHue, 0.08) : 'rgba(255,255,255,0.02)';
          var borderColor = owner ? hC(owner.colorHue, contested ? 0.4 : 0.2) : 'rgba(255,255,255,0.05)';
          return (
            <div key={dist} style={{
              padding: '8px 10px', borderRadius: 4,
              background: bgColor, border: '1px solid ' + borderColor,
              position: 'relative', overflow: 'hidden',
            }}>
              {contested && <div style={{
                position: 'absolute', top: 3, right: 5, fontSize: 8, color: '#ef5350',
                fontWeight: 700, fontFamily: ui, textTransform: 'uppercase', letterSpacing: '0.5px',
                animation: 'intriguePulse 2s infinite',
              }}>Contested</div>}
              <div style={{ fontSize: 11, fontWeight: 600, color: txt, fontFamily: hd, marginBottom: 3 }}>{dist}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {factions.map(function(f) {
                  return (
                    <span key={f.id} style={{
                      fontSize: 9, padding: '1px 6px', borderRadius: 8,
                      background: hC(f.colorHue, 0.2), color: hC(f.colorHue),
                      fontFamily: ui, fontWeight: 600,
                    }}>{f.name}</span>
                  );
                })}
                {factions.length === 0 && <span style={{ fontSize: 9, color: fnt, fontStyle: 'italic' }}>Unclaimed</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     MAIN COMPONENT
  ═══════════════════════════════════════════════════════════ */
  function CourtIntrigueView({ data, setData, viewRole }) {
    var _a = useState('web'), view = _a[0], setView = _a[1]; // 'web' | 'territories' | branchId
    var _b = useState(null), editAgent = _b[0], setEditAgent = _b[1];
    var _c = useState(false), showAddBranch = _c[0], setShowAddBranch = _c[1];
    var _d = useState(''), newBranchName = _d[0], setNewBranchName = _d[1];
    var _e = useState(''), newBranchDesc = _e[0], setNewBranchDesc = _e[1];
    var _f = useState(''), newClue = _f[0], setNewClue = _f[1];
    var _g = useState(''), newEventText = _g[0], setNewEventText = _g[1];
    var _h = useState(false), showConnForm = _h[0], setShowConnForm = _h[1];
    var _i = useState(false), showSchemeForm = _i[0], setShowSchemeForm = _i[1];
    var _j = useState('connections'), sideTab = _j[0], setSideTab = _j[1]; // 'connections' | 'schemes' | 'events'
    var svgRef = useRef(null);
    var containerRef = useRef(null);
    var _k = useState({ w: 800, h: 550 }), sz = _k[0], setSz = _k[1];

    var intrigue = data.intrigue || initializeIntrigueData(data);
    var isDM = viewRole === 'DM' || viewRole === 'dm';

    useEffect(function() {
      if (!data.intrigue) {
        setData(function(prev) { return Object.assign({}, prev, { intrigue: initializeIntrigueData(data) }); });
      }
    }, []);

    // Measure container
    useEffect(function() {
      if (!containerRef.current) return;
      var measure = function() {
        var r = containerRef.current.getBoundingClientRect();
        if (r.width > 100 && r.height > 100) setSz({ w: r.width, h: r.height });
      };
      measure();
      var ro = new ResizeObserver(measure);
      ro.observe(containerRef.current);
      return function() { ro.disconnect(); };
    }, [view]);

    /* ── Updaters ── */
    var update = useCallback(function(patch) {
      setData(function(prev) { return Object.assign({}, prev, { intrigue: Object.assign({}, prev.intrigue || intrigue, patch) }); });
    }, [intrigue, setData]);

    var updateBranch = useCallback(function(bid, patch) {
      update({ branches: intrigue.branches.map(function(b) { return b.id === bid ? Object.assign({}, b, patch) : b; }) });
    }, [intrigue, update]);

    var updateAgent = useCallback(function(bid, aid, patch) {
      update({
        branches: intrigue.branches.map(function(b) {
          if (b.id !== bid) return b;
          if (b.sage.id === aid) return Object.assign({}, b, { sage: Object.assign({}, b.sage, patch) });
          return Object.assign({}, b, { agents: b.agents.map(function(a) { return a.id === aid ? Object.assign({}, a, patch) : a; }) });
        }),
      });
      if (editAgent && editAgent.id === aid) setEditAgent(function(p) { return p ? Object.assign({}, p, patch) : p; });
    }, [intrigue, update, editAgent]);

    var addAgent = useCallback(function(bid) {
      var a = makeAgent({});
      update({ branches: intrigue.branches.map(function(b) { return b.id === bid ? Object.assign({}, b, { agents: b.agents.concat([a]) }) : b; }) });
      setEditAgent(a);
    }, [intrigue, update]);

    var removeAgent = useCallback(function(bid, aid) {
      update({ branches: intrigue.branches.map(function(b) { return b.id === bid ? Object.assign({}, b, { agents: b.agents.filter(function(a) { return a.id !== aid; }) }) : b; }) });
      if (editAgent && editAgent.id === aid) setEditAgent(null);
    }, [intrigue, update, editAgent]);

    var addBranch = useCallback(function() {
      if (!newBranchName.trim()) return;
      var br = makeBranch({ name: newBranchName.trim(), description: newBranchDesc.trim() });
      update({ branches: intrigue.branches.concat([br]) });
      setNewBranchName(''); setNewBranchDesc(''); setShowAddBranch(false);
    }, [intrigue, update, newBranchName, newBranchDesc]);

    var removeBranch = useCallback(function(bid) {
      if (!confirm('Remove this entire faction?')) return;
      update({ branches: intrigue.branches.filter(function(b) { return b.id !== bid; }) });
      if (view === bid) setView('web');
    }, [intrigue, update, view]);

    var addScheme = useCallback(function(bid, scheme) {
      update({ branches: intrigue.branches.map(function(b) {
        return b.id === bid ? Object.assign({}, b, { schemes: (b.schemes||[]).concat([scheme]) }) : b;
      })});
    }, [intrigue, update]);

    var updateScheme = useCallback(function(bid, sid, patch) {
      update({ branches: intrigue.branches.map(function(b) {
        if (b.id !== bid) return b;
        return Object.assign({}, b, { schemes: (b.schemes||[]).map(function(s) { return s.id === sid ? Object.assign({}, s, patch) : s; }) });
      })});
    }, [intrigue, update]);

    var removeScheme = useCallback(function(bid, sid) {
      update({ branches: intrigue.branches.map(function(b) {
        if (b.id !== bid) return b;
        return Object.assign({}, b, { schemes: (b.schemes||[]).filter(function(s) { return s.id !== sid; }) });
      })});
    }, [intrigue, update]);

    var addConnection = useCallback(function(conn) {
      update({ connections: (intrigue.connections || []).concat([conn]) });
    }, [intrigue, update]);

    var removeConnection = useCallback(function(cid) {
      update({ connections: (intrigue.connections || []).filter(function(c) { return c.id !== cid; }) });
    }, [intrigue, update]);

    var addEvent = useCallback(function(bid, text) {
      if (!text.trim()) return;
      var evt = { id: uid(), date: 'Session ' + ((intrigue.globalEvents || []).length + 1), text: text.trim(), branchId: bid };
      update({ globalEvents: (intrigue.globalEvents || []).concat([evt]) });
    }, [intrigue, update]);

    var findAgent2 = useCallback(function(aid) {
      if (!aid) return null;
      if (intrigue.shadowLeader.id === aid) return intrigue.shadowLeader;
      for (var i = 0; i < intrigue.branches.length; i++) {
        var b = intrigue.branches[i];
        if (b.sage.id === aid) return b.sage;
        for (var j = 0; j < b.agents.length; j++) { if (b.agents[j].id === aid) return b.agents[j]; }
      }
      return null;
    }, [intrigue]);

    var findBranch = useCallback(function(aid) {
      for (var i = 0; i < intrigue.branches.length; i++) {
        var b = intrigue.branches[i];
        if (b.sage.id === aid || b.agents.some(function(a) { return a.id === aid; })) return b;
      }
      return null;
    }, [intrigue]);

    /* ── Stats ── */
    var totalAgents = intrigue.branches.reduce(function(s, b) { return s + 1 + b.agents.length; }, 0) + 1;
    var totalRevealed = (intrigue.shadowLeader.revealed ? 1 : 0) +
      intrigue.branches.reduce(function(s, b) {
        return s + (b.sage.revealed ? 1 : 0) + b.agents.filter(function(a) { return a.revealed; }).length;
      }, 0);
    var totalSchemes = intrigue.branches.reduce(function(s, b) { return s + (b.schemes||[]).length; }, 0);

    var activeBranch = (view !== 'web' && view !== 'territories') ? intrigue.branches.find(function(b) { return b.id === view; }) : null;

    /* ══════════════ SPIDERWEB LAYOUT ══════════════ */
    var webData = useMemo(function() {
      var w = sz.w, h = sz.h;
      var cx = w / 2, cy = h / 2;
      var brs = intrigue.branches;
      var n = brs.length;
      if (n === 0) return { cx: cx, cy: cy, nodes: [], lines: [] };

      var r1 = Math.min(w, h) * 0.26;
      var r2 = Math.min(w, h) * 0.44;
      var nodes = [];
      var lines = [];

      // Sage positions
      var sagePos = {};
      var agentPos = {};
      brs.forEach(function(b, i) {
        var angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        var sx = cx + Math.cos(angle) * r1;
        var sy = cy + Math.sin(angle) * r1;
        sagePos[b.sage.id] = { x: sx, y: sy, hue: b.colorHue, branch: b };

        // Lines: center → sage
        lines.push({ x1: cx, y1: cy, x2: sx, y2: sy, color: hC(b.colorHue), opacity: 0.25, thickness: 2, glow: true });

        // Agents fanned around sage
        var ac = b.agents.length;
        var fan = Math.min(0.55, ac > 1 ? 0.12 * ac : 0);
        b.agents.forEach(function(a, j) {
          var aa = ac === 1 ? angle : angle + ((j / (ac - 1)) - 0.5) * fan;
          var ax = cx + Math.cos(aa) * r2;
          var ay = cy + Math.sin(aa) * r2;
          agentPos[a.id] = { x: ax, y: ay, hue: b.colorHue, branch: b };
          // Line: sage → agent
          lines.push({ x1: sx, y1: sy, x2: ax, y2: ay, color: hC(b.colorHue), opacity: a.revealed ? 0.35 : 0.08, thickness: 1 });
          nodes.push({ id: a.id, x: ax, y: ay, r: 10, color: hC(b.colorHue), filled: a.revealed,
            pulsing: a.status === 'suspected', label: isDM || a.revealed ? a.name : null,
            sub: isDM || a.revealed ? a.title : null, agent: a, branch: b });
        });

        nodes.push({ id: b.sage.id, x: sx, y: sy, r: 18, color: hC(b.colorHue), filled: b.sage.revealed,
          pulsing: b.sage.status === 'suspected',
          label: isDM || b.sage.revealed ? b.sage.name : b.name,
          sub: isDM || b.sage.revealed ? b.name : null, agent: b.sage, branch: b, isSage: true });
      });

      // Web strands between adjacent sages
      brs.forEach(function(b, i) {
        var next = brs[(i + 1) % n];
        var p1 = sagePos[b.sage.id], p2 = sagePos[next.sage.id];
        if (p1 && p2) lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, color: gld, opacity: 0.04, thickness: 0.7 });
      });

      // Cross-faction connections!
      (intrigue.connections || []).forEach(function(conn) {
        var ct = CONNECTION_TYPES.find(function(t) { return t.id === conn.type; }) || CONNECTION_TYPES[0];
        var p1 = sagePos[conn.fromAgent] || agentPos[conn.fromAgent];
        var p2 = sagePos[conn.toAgent] || agentPos[conn.toAgent];
        if (p1 && p2) {
          lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y,
            color: ct.color, opacity: (isDM || conn.revealed) ? 0.6 : 0.0,
            thickness: 2, dash: ct.dash, glow: true, isConnection: true });
        }
      });

      return { cx: cx, cy: cy, r1: r1, r2: r2, nodes: nodes, lines: lines, sagePos: sagePos, agentPos: agentPos };
    }, [sz, intrigue, isDM]);

    /* ══════════════ RENDER ══════════════ */
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: bg0, color: txt, fontFamily: bd, overflow: 'hidden' }}>
        <style>{'\
          @keyframes intriguePulse { 0%,100%{opacity:0.6} 50%{opacity:1} }\
          @keyframes intrigueSlideIn { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }\
          .web-node:hover circle { filter: brightness(1.4); }\
          .intrigue-scroll::-webkit-scrollbar { width: 5px; }\
          .intrigue-scroll::-webkit-scrollbar-track { background: transparent; }\
          .intrigue-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }\
        '}</style>

        {/* HEADER */}
        <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: '1px solid ' + bdr, background: 'rgba(0,0,0,0.25)', flexShrink: 0 }}>
          {activeBranch && (
            <span onClick={function() { setView('web'); setEditAgent(null); }}
              style={{ color: gld, cursor: 'pointer', display: 'flex', padding: 2 }}>{I(ArrowLeft, 16)}</span>
          )}
          {I(Crown, 18)}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: hd, fontSize: 16, fontWeight: 700, color: gld, letterSpacing: '1px' }}>
              {activeBranch ? activeBranch.name : 'Court Intrigue'}
            </div>
            <div style={{ fontSize: 10, color: dim, marginTop: 1 }}>
              {activeBranch ? (activeBranch.motto || activeBranch.description) :
                totalRevealed + '/' + totalAgents + ' revealed \u00B7 ' + (intrigue.connections||[]).length + ' connections \u00B7 ' + totalSchemes + ' schemes'}
            </div>
          </div>

          {/* View tabs */}
          {!activeBranch && (
            <div style={{ display: 'flex', gap: 2, background: 'rgba(0,0,0,0.3)', borderRadius: 4, padding: 2 }}>
              {[{ id: 'web', label: 'Web', ic: Network }, { id: 'territories', label: 'Influence', ic: Globe }].map(function(t) {
                return (
                  <span key={t.id} onClick={function() { setView(t.id); }}
                    style={{ padding: '4px 10px', borderRadius: 3, cursor: 'pointer', fontSize: 10,
                      fontWeight: 600, fontFamily: ui, color: view === t.id ? gld : fnt,
                      background: view === t.id ? 'rgba(255,215,0,0.1)' : 'transparent',
                      display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.15s' }}>
                    {I(t.ic, 11)} {t.label}
                  </span>
                );
              })}
            </div>
          )}

          {isDM && !activeBranch && <Btn onClick={function() { setShowAddBranch(true); }}>{I(Plus, 12)} Faction</Btn>}
          {isDM && activeBranch && <Btn onClick={function() { addAgent(activeBranch.id); }}>{I(UserPlus, 12)} Agent</Btn>}
        </div>

        {/* BODY */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ═══════ WEB VIEW ═══════ */}
          {view === 'web' && (
            <Fragment>
              <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <svg ref={svgRef} width={sz.w} height={sz.h} style={{ position: 'absolute', top: 0, left: 0 }}>
                  <defs>
                    <radialGradient id="igBg" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(255,215,0,0.03)" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>

                  <circle cx={webData.cx} cy={webData.cy} r={Math.min(sz.w,sz.h)*0.5} fill="url(#igBg)" />
                  {/* Concentric rings */}
                  {[webData.r1, webData.r2].map(function(r, i) {
                    return r ? <circle key={i} cx={webData.cx} cy={webData.cy} r={r} fill="none"
                      stroke="rgba(255,215,0,0.035)" strokeWidth={1} strokeDasharray="3 8" /> : null;
                  })}

                  {/* All lines */}
                  {webData.lines.map(function(l, i) {
                    return <SvgLine key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                      color={l.color} opacity={l.opacity} thickness={l.thickness}
                      dash={l.dash} pulse={l.pulse} glow={l.glow} />;
                  })}

                  {/* All nodes (agents first, then sages on top) */}
                  {webData.nodes.filter(function(n) { return !n.isSage; }).map(function(n) {
                    return <SvgNode key={n.id} x={n.x} y={n.y} r={n.r} color={n.color} filled={n.filled}
                      pulsing={n.pulsing} selected={editAgent && editAgent.id === n.id}
                      label={n.label} sub={n.sub}
                      onClick={function() { setEditAgent(n.agent); }} />;
                  })}
                  {webData.nodes.filter(function(n) { return n.isSage; }).map(function(n) {
                    return <SvgNode key={n.id} x={n.x} y={n.y} r={n.r} color={n.color} filled={n.filled}
                      pulsing={n.pulsing} selected={editAgent && editAgent.id === n.id}
                      label={n.label} sub={n.sub}
                      onClick={function() { setView(n.branch.id); }} />;
                  })}

                  {/* Center node */}
                  <SvgNode x={webData.cx} y={webData.cy} r={24} color={gld}
                    filled={intrigue.shadowLeader.revealed}
                    pulsing={!intrigue.shadowLeader.revealed}
                    label={isDM || intrigue.shadowLeader.revealed ? intrigue.shadowLeader.name : '???'}
                    selected={editAgent && editAgent.id === 'leader'}
                    onClick={function() { setEditAgent(intrigue.shadowLeader); }} />
                </svg>

                {/* Faction badges */}
                {webData.nodes.filter(function(n) { return n.isSage; }).map(function(n) {
                  return (
                    <div key={'badge_'+n.id} onClick={function() { setView(n.branch.id); }}
                      style={{ position: 'absolute', left: n.x, top: n.y - 32,
                        transform: 'translate(-50%, -50%)', padding: '2px 8px', borderRadius: 8,
                        background: hC(n.branch.colorHue, 0.12), border: '1px solid ' + hC(n.branch.colorHue, 0.25),
                        cursor: 'pointer', whiteSpace: 'nowrap', fontSize: 9, fontWeight: 700,
                        fontFamily: ui, color: hC(n.branch.colorHue), letterSpacing: '0.5px',
                        zIndex: 10, transition: 'all 0.15s' }}>
                      {n.branch.name} <span style={{ opacity: 0.5 }}>{n.branch.powerLevel}%</span>
                    </div>
                  );
                })}
              </div>

              {/* Side panel: connections / schemes / events */}
              <div className="intrigue-scroll" style={{
                width: editAgent ? 0 : 280, borderLeft: editAgent ? 'none' : '1px solid ' + bdr,
                overflowY: 'auto', background: 'rgba(0,0,0,0.15)', flexShrink: 0,
                transition: 'width 0.2s',
                display: editAgent ? 'none' : 'block',
              }}>
                <div style={{ padding: 12 }}>
                  {/* Tabs */}
                  <div style={{ display: 'flex', gap: 2, marginBottom: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 4, padding: 2 }}>
                    {[{ id: 'connections', label: 'Links' }, { id: 'schemes', label: 'Schemes' }, { id: 'events', label: 'Events' }].map(function(t) {
                      return (
                        <span key={t.id} onClick={function() { setSideTab(t.id); }}
                          style={{ flex: 1, padding: '4px 6px', borderRadius: 3, cursor: 'pointer',
                            fontSize: 10, fontWeight: 600, fontFamily: ui, textAlign: 'center',
                            color: sideTab === t.id ? gld : fnt,
                            background: sideTab === t.id ? 'rgba(255,215,0,0.1)' : 'transparent' }}>
                          {t.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Connections list */}
                  {sideTab === 'connections' && (
                    <div>
                      {(intrigue.connections || []).length === 0 && (
                        <div style={{ fontSize: 11, color: fnt, fontStyle: 'italic', textAlign: 'center', padding: 20 }}>No cross-faction connections yet</div>
                      )}
                      {(intrigue.connections || []).map(function(c) {
                        return <ConnectionBadge key={c.id} conn={c} intrigue={intrigue} isDM={isDM}
                          onRemove={isDM ? function() { removeConnection(c.id); } : null} />;
                      })}
                      {isDM && <Btn small onClick={function() { setShowConnForm(true); }}>{I(Plus, 10)} Add Connection</Btn>}
                    </div>
                  )}

                  {/* Schemes overview */}
                  {sideTab === 'schemes' && (
                    <div>
                      {intrigue.branches.map(function(b) {
                        var schemes = b.schemes || [];
                        if (schemes.length === 0) return null;
                        return (
                          <div key={b.id} style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: hC(b.colorHue), fontFamily: ui, marginBottom: 4, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                              {b.name}
                            </div>
                            {schemes.map(function(s) {
                              return <SchemeCard key={s.id} scheme={s} hue={b.colorHue} isDM={isDM}
                                onUpdate={function(p) { updateScheme(b.id, s.id, p); }}
                                onRemove={function() { removeScheme(b.id, s.id); }} data={data} />;
                            })}
                          </div>
                        );
                      })}
                      {totalSchemes === 0 && <div style={{ fontSize: 11, color: fnt, fontStyle: 'italic', textAlign: 'center', padding: 20 }}>No active schemes</div>}
                    </div>
                  )}

                  {/* Events log */}
                  {sideTab === 'events' && (
                    <div>
                      {(intrigue.globalEvents || []).slice().reverse().slice(0, 20).map(function(evt) {
                        var brnch = evt.branchId ? intrigue.branches.find(function(b) { return b.id === evt.branchId; }) : null;
                        return (
                          <div key={evt.id} style={{
                            padding: '5px 8px', marginBottom: 3, borderRadius: 3,
                            background: 'rgba(0,0,0,0.2)', fontSize: 11, color: dim,
                            borderLeft: '2px solid ' + (brnch ? hC(brnch.colorHue, 0.4) : 'rgba(255,215,0,0.2)'),
                          }}>
                            <span style={{ color: fnt, fontSize: 9, marginRight: 4 }}>{evt.date}</span>
                            {evt.text}
                          </div>
                        );
                      })}
                      {isDM && (
                        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                          <Inp value={newEventText} onChange={setNewEventText} placeholder="Log event..." style={{ fontSize: 11 }} />
                          <Btn small disabled={!newEventText.trim()} onClick={function() { addEvent(null, newEventText); setNewEventText(''); }}>{I(Plus, 10)}</Btn>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Fragment>
          )}

          {/* ═══════ TERRITORY VIEW ═══════ */}
          {view === 'territories' && (
            <div className="intrigue-scroll" style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: fnt, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 10, fontFamily: ui }}>
                Territorial Influence
              </div>
              <InfluenceMap intrigue={intrigue} isDM={isDM} data={data} />

              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: fnt, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: 8, fontFamily: ui }}>
                  Faction Territories
                </div>
                {intrigue.branches.map(function(b) {
                  var worldDistricts = getWorldDistricts(data);
                  return (
                    <div key={b.id} style={{ marginBottom: 8, padding: '8px 12px', borderRadius: 4,
                      background: hBg(b.colorHue, 0.4), border: '1px solid ' + hC(b.colorHue, 0.1) }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontFamily: hd, fontSize: 13, fontWeight: 700, color: hC(b.colorHue) }}>{b.name}</span>
                        <PowerBar value={b.powerLevel} hue={b.colorHue} />
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {(b.territories || []).map(function(t) {
                          return <span key={t} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 8,
                            background: hC(b.colorHue, 0.15), color: hC(b.colorHue), fontFamily: ui, fontWeight: 600 }}>{t}</span>;
                        })}
                        {(b.territories || []).length === 0 && <span style={{ fontSize: 10, color: fnt, fontStyle: 'italic' }}>No territory</span>}
                      </div>
                      {isDM && (
                        <div style={{ marginTop: 6 }}>
                          <select onChange={function(e) {
                            if (!e.target.value) return;
                            var terrs = (b.territories || []).concat([e.target.value]);
                            updateBranch(b.id, { territories: terrs });
                            e.target.value = '';
                          }} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid ' + bdr, color: dim,
                            fontSize: 10, padding: '3px 6px', borderRadius: 3, fontFamily: ui }}>
                            <option value="">+ Add territory...</option>
                            {worldDistricts.filter(function(d) { return !(b.territories||[]).includes(d); }).map(function(d) {
                              return <option key={d} value={d}>{d}</option>;
                            })}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════ FACTION DETAIL (tree) ═══════ */}
          {activeBranch && (
            <Fragment>
              <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
                <svg width={sz.w} height={Math.max(sz.h, 420)} style={{ position: 'absolute', top: 0, left: 0 }}>
                  <defs>
                    <radialGradient id="tBg" cx="50%" cy="20%" r="60%">
                      <stop offset="0%" stopColor={hC(activeBranch.colorHue, 0.04)} />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#tBg)" />

                  {/* Leader → sage */}
                  <SvgLine x1={sz.w/2} y1={55} x2={sz.w/2} y2={170} color={gld} opacity={0.25} thickness={2} glow={true} />

                  {/* Sage → agents */}
                  {activeBranch.agents.map(function(a, i) {
                    var n = activeBranch.agents.length;
                    var span = Math.min(sz.w - 80, n * 110);
                    var x0 = (sz.w - span) / 2 + (n > 1 ? 0 : span/2);
                    var step = n > 1 ? span / (n - 1) : 0;
                    var ax = n === 1 ? sz.w/2 : x0 + i * step;
                    return <SvgLine key={i} x1={sz.w/2} y1={170} x2={ax} y2={310}
                      color={hC(activeBranch.colorHue)} opacity={a.revealed ? 0.4 : 0.1} thickness={1.2}
                      pulse={a.status === 'suspected'} />;
                  })}

                  {/* Agent nodes */}
                  {activeBranch.agents.map(function(a, i) {
                    var n = activeBranch.agents.length;
                    var span = Math.min(sz.w - 80, n * 110);
                    var x0 = (sz.w - span) / 2 + (n > 1 ? 0 : span/2);
                    var step = n > 1 ? span / (n - 1) : 0;
                    var ax = n === 1 ? sz.w/2 : x0 + i * step;
                    return <SvgNode key={a.id} x={ax} y={310} r={14} color={hC(activeBranch.colorHue)}
                      filled={a.revealed} pulsing={a.status === 'suspected'}
                      label={isDM || a.revealed ? a.name : 'Unknown'}
                      sub={isDM || a.revealed ? a.title : null}
                      selected={editAgent && editAgent.id === a.id}
                      onClick={function() { setEditAgent(a); }} />;
                  })}

                  {/* Sage */}
                  <SvgNode x={sz.w/2} y={170} r={22} color={hC(activeBranch.colorHue)}
                    filled={activeBranch.sage.revealed} pulsing={activeBranch.sage.status === 'suspected'}
                    label={isDM || activeBranch.sage.revealed ? activeBranch.sage.name : 'Unknown Leader'}
                    sub={activeBranch.sage.title}
                    selected={editAgent && editAgent.id === activeBranch.sage.id}
                    onClick={function() { setEditAgent(activeBranch.sage); }} />

                  {/* Leader */}
                  <SvgNode x={sz.w/2} y={55} r={18} color={gld}
                    filled={intrigue.shadowLeader.revealed} pulsing={!intrigue.shadowLeader.revealed}
                    label={isDM || intrigue.shadowLeader.revealed ? intrigue.shadowLeader.name : '???'}
                    selected={editAgent && editAgent.id === 'leader'}
                    onClick={function() { setEditAgent(intrigue.shadowLeader); }} />
                </svg>

                {/* Bottom: schemes + power + events */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 16px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', pointerEvents: 'none' }}>
                  <div style={{ pointerEvents: 'auto' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <PowerBar value={activeBranch.powerLevel} hue={activeBranch.colorHue} height={6} />
                        {isDM && <input type="range" min={0} max={100} value={activeBranch.powerLevel}
                          onChange={function(e) { updateBranch(activeBranch.id, { powerLevel: Number(e.target.value) }); }}
                          style={{ width: '100%', accentColor: hC(activeBranch.colorHue), marginTop: 2, height: 3 }} />}
                      </div>
                      {isDM && <Btn small color="#ef5350" outline onClick={function() { removeBranch(activeBranch.id); }}>{I(Trash2, 10)}</Btn>}
                    </div>

                    {/* Active schemes */}
                    {(activeBranch.schemes || []).map(function(s) {
                      return <SchemeCard key={s.id} scheme={s} hue={activeBranch.colorHue} isDM={isDM}
                        onUpdate={function(p) { updateScheme(activeBranch.id, s.id, p); }}
                        onRemove={function() { removeScheme(activeBranch.id, s.id); }} data={data} />;
                    })}
                    {isDM && (
                      <Btn small onClick={function() {
                        addScheme(activeBranch.id, makeScheme({ name: 'New Scheme' }));
                      }}>{I(Plus, 10)} Add Scheme</Btn>
                    )}
                  </div>
                </div>
              </div>

              {/* Agent detail panel */}
              {editAgent && (
                <div className="intrigue-scroll" style={{
                  width: 320, borderLeft: '1px solid ' + bdr, overflowY: 'auto',
                  background: 'rgba(0,0,0,0.2)', animation: 'intrigueSlideIn 0.2s ease', flexShrink: 0 }}>
                  {renderAgentPanel(editAgent, isDM, intrigue, update, updateAgent, findBranch, setEditAgent, newClue, setNewClue, activeBranch, removeAgent, data)}
                </div>
              )}
            </Fragment>
          )}

          {/* Overview agent panel */}
          {(view === 'web' || view === 'territories') && editAgent && (
            <div className="intrigue-scroll" style={{
              width: 320, borderLeft: '1px solid ' + bdr, overflowY: 'auto',
              background: 'rgba(0,0,0,0.2)', animation: 'intrigueSlideIn 0.2s ease', flexShrink: 0 }}>
              {renderAgentPanel(editAgent, isDM, intrigue, update, updateAgent, findBranch, setEditAgent, newClue, setNewClue, null, removeAgent, data)}
            </div>
          )}
        </div>

        {/* MODALS */}
        {showAddBranch && isDM && renderModal(function() { setShowAddBranch(false); },
          <div>
            <div style={{ fontFamily: hd, fontSize: 16, color: gld, marginBottom: 14 }}>Create New Faction</div>
            <Lbl>Name</Lbl>
            <Inp value={newBranchName} onChange={setNewBranchName} placeholder="Faction name..." />
            <Lbl>Description</Lbl>
            <Inp value={newBranchDesc} onChange={setNewBranchDesc} placeholder="Brief description..." />
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={addBranch} disabled={!newBranchName.trim()} style={{
                flex: 1, padding: '8px 14px', background: gld, color: '#000', border: 'none', borderRadius: 4,
                cursor: 'pointer', fontFamily: ui, fontSize: 12, fontWeight: 700, opacity: newBranchName.trim() ? 1 : 0.4 }}>Create</button>
              <button onClick={function() { setShowAddBranch(false); }} style={{
                padding: '8px 14px', background: 'transparent', color: dim, border: '1px solid ' + bdr,
                borderRadius: 4, cursor: 'pointer', fontFamily: ui, fontSize: 12 }}>Cancel</button>
            </div>
          </div>
        )}

        {showConnForm && isDM && renderAddConnectionModal(intrigue, addConnection, function() { setShowConnForm(false); })}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     AGENT DETAIL PANEL (shared between views)
  ═══════════════════════════════════════════════════════════ */
  function renderAgentPanel(agent, isDM, intrigue, update, updateAgent, findBranch, setEditAgent, newClue, setNewClue, activeBranch, removeAgent, data) {
    var branch = findBranch(agent.id);
    var bid = branch ? branch.id : null;

    var doUpdate = function(patch) {
      if (bid) updateAgent(bid, agent.id, patch);
      else if (agent.id === 'leader') update({ shadowLeader: Object.assign({}, intrigue.shadowLeader, patch) });
    };

    // Find connections involving this agent
    var myConns = (intrigue.connections || []).filter(function(c) {
      return c.fromAgent === agent.id || c.toAgent === agent.id;
    });

    return (
      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontFamily: hd, fontSize: 12, color: gld, letterSpacing: '1px' }}>
            {RANK_LABELS[agent.rank] || 'Agent'}
          </div>
          <span onClick={function() { setEditAgent(null); }} style={{ cursor: 'pointer', color: fnt }}>{I(X, 14)}</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 10 }}><StatusBadge status={agent.status} /></div>

        {isDM ? (
          <Fragment>
            <Lbl>Name</Lbl>
            <Inp value={agent.name} onChange={function(v) { doUpdate({ name: v }); }} placeholder="Name..." />
            <Lbl>Title</Lbl>
            <Inp value={agent.title} onChange={function(v) { doUpdate({ title: v }); }} placeholder="Title..." />
          </Fragment>
        ) : (
          <Fragment>
            <div style={{ fontFamily: hd, fontSize: 15, fontWeight: 700, color: txt, marginBottom: 3 }}>
              {agent.revealed ? agent.name : 'Unknown ' + (RANK_LABELS[agent.rank] || 'Agent')}
            </div>
            {agent.revealed && agent.title && <div style={{ fontSize: 11, color: dim, marginBottom: 10 }}>{agent.title}</div>}
          </Fragment>
        )}

        <Lbl>Location</Lbl>
        {isDM ? (function() {
          var locationOptions = [].concat(
            ((data && data.cities) || []).map(function(c) { return c.name; }),
            ((data && data.pois) || []).map(function(p) { return p.name + ' (' + p.type + ')'; })
          );
          var hasOptions = locationOptions.length > 0;
          if (hasOptions) {
            return React.createElement(
              Fragment,
              null,
              React.createElement('select',
                { value: agent.location, onChange: function(e) { doUpdate({ location: e.target.value }); },
                  style: { width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid ' + bdr, color: txt,
                    padding: '5px 8px', borderRadius: 4, fontSize: 12, fontFamily: ui, marginBottom: 6 } },
                React.createElement('option', { value: '' }, 'Select location...'),
                locationOptions.map(function(loc) {
                  return React.createElement('option', { key: loc, value: loc }, loc);
                })
              ),
              React.createElement('div', { style: { fontSize: 10, color: dim, fontStyle: 'italic', marginBottom: 4 } }, 'Or enter custom:'),
              React.createElement(Inp, { value: agent.location, onChange: function(v) { doUpdate({ location: v }); }, placeholder: 'Custom location...' })
            );
          }
          return React.createElement(Inp, { value: agent.location, onChange: function(v) { doUpdate({ location: v }); }, placeholder: 'Location...' });
        })()
          : <div style={{ fontSize: 12, color: txt }}>{(agent.revealed ? agent.location : '') || 'Unknown'}</div>}

        <Lbl>Influence</Lbl>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <InfluenceStars value={agent.influence} max={5} />
          {isDM && <input type="range" min={1} max={5} step={1} value={agent.influence}
            onChange={function(e) { doUpdate({ influence: Number(e.target.value) }); }}
            style={{ flex: 1, accentColor: gld, height: 3 }} />}
        </div>

        {isDM && (
          <Fragment>
            <Lbl>Status</Lbl>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {STATUS_KEYS.map(function(k) {
                return (
                  <button key={k} onClick={function() {
                    doUpdate({ status: k, revealed: k !== 'hidden' ? true : agent.revealed });
                  }} style={{
                    padding: '2px 7px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: 9, fontWeight: 600, fontFamily: ui,
                    background: agent.status === k ? STATUS[k].bg : 'rgba(255,255,255,0.04)',
                    color: agent.status === k ? STATUS[k].text : fnt }}>
                    {STATUS[k].label}
                  </button>
                );
              })}
            </div>
          </Fragment>
        )}

        {/* Connections for this agent */}
        {myConns.length > 0 && (
          <Fragment>
            <Lbl>Connections ({myConns.length})</Lbl>
            {myConns.map(function(c) {
              var ct = CONNECTION_TYPES.find(function(t) { return t.id === c.type; }) || CONNECTION_TYPES[0];
              var other = c.fromAgent === agent.id ? c.toAgent : c.fromAgent;
              var otherName = findAgentName(intrigue, other, isDM);
              return (
                <div key={c.id} style={{ padding: '4px 8px', marginBottom: 3, borderRadius: 3,
                  background: 'rgba(0,0,0,0.2)', borderLeft: '2px solid ' + ct.color,
                  fontSize: 11, color: dim, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: ct.color, fontWeight: 600, fontSize: 9, fontFamily: ui, textTransform: 'uppercase' }}>{ct.label}</span>
                  <span style={{ color: txt }}>{otherName}</span>
                </div>
              );
            })}
          </Fragment>
        )}

        <Lbl>Clues ({(agent.clues || []).length})</Lbl>
        <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 4, padding: 6, borderLeft: '2px solid ' + gld }}>
          {(agent.clues || []).length === 0 && <div style={{ fontSize: 10, color: fnt, fontStyle: 'italic' }}>No clues yet.</div>}
          {(agent.clues || []).map(function(c, i) {
            return <div key={i} style={{ fontSize: 10, color: dim, padding: '2px 0' }}>
              <span style={{ color: gld, marginRight: 3, fontSize: 8 }}>#{i+1}</span>{c}
            </div>;
          })}
          {isDM && (
            <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
              <Inp value={newClue} onChange={setNewClue} placeholder="Add clue..." style={{ fontSize: 10 }} />
              <Btn small disabled={!newClue.trim()} onClick={function() {
                var clues = (agent.clues || []).concat([newClue.trim()]);
                doUpdate({ clues: clues });
                setNewClue('');
              }}>{I(Plus, 9)}</Btn>
            </div>
          )}
        </div>

        {isDM && (
          <Fragment>
            <Lbl>DM Notes</Lbl>
            <Inp multiline value={agent.notes} onChange={function(v) { doUpdate({ notes: v }); }} placeholder="Notes..." />
          </Fragment>
        )}

        {isDM && agent.id !== 'leader' && (
          <Fragment>
            <Lbl>Actions</Lbl>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {!agent.revealed && <Btn small color="#81c784" onClick={function() { doUpdate({ revealed: true, status: 'revealed' }); }}>{I(Eye, 10)} Reveal</Btn>}
              {agent.rank === 'agent' && activeBranch && (
                <Btn small color="#ef5350" outline onClick={function() {
                  if (confirm('Remove agent?')) removeAgent(activeBranch.id, agent.id);
                }}>{I(Trash2, 10)} Remove</Btn>
              )}
            </div>
          </Fragment>
        )}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
     MODAL HELPERS
  ═══════════════════════════════════════════════════════════ */
  function renderModal(onClose, content) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
        <div onClick={function(e) { e.stopPropagation(); }} style={{
          background: T.bgCard || '#1a1a2e', border: '1px solid ' + bdr, borderRadius: 8,
          padding: 20, width: 400, maxWidth: '90vw' }}>
          {content}
        </div>
      </div>
    );
  }

  function renderAddConnectionModal(intrigue, addConnection, onClose) {
    // Simple form — just dropdowns
    var allAgents = [];
    allAgents.push({ id: intrigue.shadowLeader.id, name: intrigue.shadowLeader.name, faction: 'Leader' });
    intrigue.branches.forEach(function(b) {
      allAgents.push({ id: b.sage.id, name: b.sage.name, faction: b.name });
      b.agents.forEach(function(a) { allAgents.push({ id: a.id, name: a.name, faction: b.name }); });
    });

    var formRef = { type: 'alliance', from: '', to: '', notes: '' };

    return renderModal(onClose,
      <div>
        <div style={{ fontFamily: hd, fontSize: 16, color: gld, marginBottom: 14 }}>Add Cross-Faction Connection</div>
        <Lbl>Type</Lbl>
        <select id="conn-type" defaultValue="alliance" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid ' + bdr, color: txt, padding: '5px 8px', borderRadius: 4, fontSize: 12 }}>
          {CONNECTION_TYPES.map(function(ct) { return <option key={ct.id} value={ct.id}>{ct.label}</option>; })}
        </select>
        <Lbl>From Agent</Lbl>
        <select id="conn-from" defaultValue="" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid ' + bdr, color: txt, padding: '5px 8px', borderRadius: 4, fontSize: 12 }}>
          <option value="">Select...</option>
          {allAgents.map(function(a) { return <option key={a.id} value={a.id}>{a.name} ({a.faction})</option>; })}
        </select>
        <Lbl>To Agent</Lbl>
        <select id="conn-to" defaultValue="" style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid ' + bdr, color: txt, padding: '5px 8px', borderRadius: 4, fontSize: 12 }}>
          <option value="">Select...</option>
          {allAgents.map(function(a) { return <option key={a.id} value={a.id}>{a.name} ({a.faction})</option>; })}
        </select>
        <Lbl>Notes</Lbl>
        <Inp placeholder="Optional notes..." />
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={function() {
            var typeEl = document.getElementById('conn-type');
            var fromEl = document.getElementById('conn-from');
            var toEl = document.getElementById('conn-to');
            if (!fromEl.value || !toEl.value) return;
            var fromBranch = null, toBranch = null;
            intrigue.branches.forEach(function(b) {
              if (b.sage.id === fromEl.value || b.agents.some(function(a) { return a.id === fromEl.value; })) fromBranch = b.id;
              if (b.sage.id === toEl.value || b.agents.some(function(a) { return a.id === toEl.value; })) toBranch = b.id;
            });
            addConnection(makeConnection({
              type: typeEl.value, fromAgent: fromEl.value, toAgent: toEl.value,
              fromFaction: fromBranch || '', toFaction: toBranch || '', revealed: false,
            }));
            onClose();
          }} style={{
            flex: 1, padding: '8px 14px', background: gld, color: '#000', border: 'none', borderRadius: 4,
            cursor: 'pointer', fontFamily: ui, fontSize: 12, fontWeight: 700 }}>Add Connection</button>
          <button onClick={onClose} style={{
            padding: '8px 14px', background: 'transparent', color: dim, border: '1px solid ' + bdr,
            borderRadius: 4, cursor: 'pointer', fontFamily: ui, fontSize: 12 }}>Cancel</button>
        </div>
      </div>
    );
  }

  /* ── Register ── */
  window.CourtIntrigueView = CourtIntrigueView;
  console.log('[Intrigue] Module registered OK, CourtIntrigueView:', typeof window.CourtIntrigueView);
})();
