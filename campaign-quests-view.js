window.CampaignQuestsView = function CampaignQuestsView({ data, setData, viewRole }) {
  const T = {
    bg: "#0c0804", bgNav: "#100c08", bgCard: "rgba(18,14,10,0.97)",
    text: "#e8dcc8", textMuted: "#a89878", textFaint: "#6a6050",
    crimson: "#d4433a", crimsonBorder: "rgba(212,67,58,0.15)",
    gold: "#c9a85c", border: "rgba(212,67,58,0.08)",
    heading: "'Cinzel', serif", body: "'Spectral', serif", ui: "'Cinzel', serif"
  };

  const [filters, setFilters] = React.useState({
    status: 'all',
    type: 'all',
    difficulty: 'all',
    region: 'all',
    search: ''
  });
  const [expandedQuestId, setExpandedQuestId] = React.useState(null);
  const [showDowntimeLog, setShowDowntimeLog] = React.useState(false);
  const [downtimeAssignments, setDowntimeAssignments] = React.useState({});

  const quests = data.quests || [];
  const factions = data.factions || [];
  const regions = data.regions || [];
  const npcs = data.npcs || [];
  const party = data.party || [];
  const _downtime = data._downtime || {};

  const isDM = viewRole === 'dm';

  // Get unique values for filter dropdowns
  const questTypes = React.useMemo(() => {
    const types = new Set(quests.map(q => q.type).filter(Boolean));
    return Array.from(types).sort();
  }, [quests]);

  const difficulties = ['trivial', 'easy', 'medium', 'hard', 'legendary'];

  // Filter quests based on criteria
  const filteredQuests = React.useMemo(() => {
    return quests.filter(q => {
      const statusMatch = filters.status === 'all' || q.status === filters.status;
      const typeMatch = filters.type === 'all' || q.type === filters.type;
      const diffMatch = filters.difficulty === 'all' || q.difficulty === filters.difficulty;
      const regionMatch = filters.region === 'all' || q.region === filters.region;
      const searchMatch = !filters.search ||
        q.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        q.description.toLowerCase().includes(filters.search.toLowerCase());

      return statusMatch && typeMatch && diffMatch && regionMatch && searchMatch;
    });
  }, [quests, filters]);

  // Count quests by status
  const questCounts = React.useMemo(() => ({
    active: quests.filter(q => q.status === 'active').length,
    available: quests.filter(q => q.status === 'available').length,
    completed: quests.filter(q => q.status === 'completed').length
  }), [quests]);

  // Difficulty color mapping
  const difficultyColor = (difficulty) => {
    const colors = {
      trivial: '#7a7a7a',
      easy: '#5db36f',
      medium: '#c9a85c',
      hard: '#ff9f3d',
      legendary: '#a855e8'
    };
    return colors[difficulty] || colors.medium;
  };

  // Get faction color
  const getFactionColor = (factionName) => {
    const faction = factions.find(f => f.name === factionName);
    return faction?.color || '#888888';
  };

  // Get quest giver NPC
  const getQuestGiver = (questId) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest?.giver) return null;
    return npcs.find(n => n.name === quest.giver);
  };

  // Handle quest status changes
  const updateQuestStatus = React.useCallback((questId, newStatus) => {
    setData(d => ({
      ...d,
      quests: d.quests.map(q =>
        q.id === questId ? { ...q, status: newStatus } : q
      )
    }));
  }, [setData]);

  // Handle objective toggle
  const toggleObjective = React.useCallback((questId, objIndex) => {
    setData(d => ({
      ...d,
      quests: d.quests.map(q => {
        if (q.id === questId) {
          const newObjs = [...q.objectives];
          newObjs[objIndex] = { ...newObjs[objIndex], completed: !newObjs[objIndex].completed };
          return { ...q, objectives: newObjs };
        }
        return q;
      })
    }));
  }, [setData]);

  // Handle quest generation (DM only)
  const generateQuests = React.useCallback(() => {
    if (typeof window.QuestBoard !== 'undefined' && window.QuestBoard.generateQuests) {
      const generated = window.QuestBoard.generateQuests(data);
      setData(d => ({
        ...d,
        quests: [...d.quests, ...generated]
      }));
    } else {
      console.warn('QuestBoard.generateQuests not available');
    }
  }, [data, setData]);

  // Render quest card
  const QuestCard = ({ quest }) => {
    const isExpanded = expandedQuestId === quest.id;
    const giver = getQuestGiver(quest.id);
    const region = regions.find(r => r.name === quest.region);

    return (
      <div
        key={quest.id}
        style={{
          backgroundColor: isExpanded ? T.bgCard : T.bgCard,
          border: `1px solid ${isExpanded ? T.crimson : T.textFaint}33`,
          borderRadius: '8px',
          padding: '16px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={() => setExpandedQuestId(isExpanded ? null : quest.id)}
      >
        {/* Difficulty badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: difficultyColor(quest.difficulty),
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 'bold',
            fontFamily: T.ui,
            textTransform: 'uppercase'
          }}
        >
          {quest.difficulty}
        </div>

        {/* Header */}
        <div style={{ marginBottom: '12px', paddingRight: '80px' }}>
          <h3
            style={{
              margin: '0 0 6px 0',
              fontSize: '18px',
              fontFamily: T.heading,
              color: T.text,
              fontWeight: 'bold'
            }}
          >
            {quest.title}
          </h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '12px' }}>
            <span style={{ color: T.textMuted, fontFamily: T.body }}>
              {quest.type}
            </span>
            {quest.urgency && (
              <span
                style={{
                  backgroundColor: 'rgba(212,67,58,0.3)',
                  color: T.crimson,
                  padding: '2px 8px',
                  borderRadius: '3px',
                  fontWeight: 'bold',
                  fontFamily: T.ui
                }}
              >
                URGENT
              </span>
            )}
          </div>
        </div>

        {/* Quest giver & region */}
        <div
          style={{
            fontSize: '12px',
            color: T.textMuted,
            marginBottom: '12px',
            fontFamily: T.body
          }}
        >
          {giver && <div>From: {giver.name}</div>}
          {region && <div>Region: {region.name}</div>}
        </div>

        {/* Faction tag */}
        {quest.faction && (
          <div style={{ marginBottom: '12px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: getFactionColor(quest.faction) + '22',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontFamily: T.ui,
                color: T.text
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getFactionColor(quest.faction)
                }}
              />
              {quest.faction}
            </div>
          </div>
        )}

        {/* Description */}
        <p
          style={{
            margin: '12px 0',
            fontSize: '13px',
            color: T.textMuted,
            fontFamily: T.body,
            lineHeight: '1.4',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: isExpanded ? 'block' : '-webkit-box',
            WebkitLineClamp: isExpanded ? 'unset' : 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {quest.description}
        </p>

        {/* Rewards */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            fontSize: '12px',
            marginBottom: '12px',
            fontFamily: T.body,
            color: T.gold
          }}
        >
          {quest.rewards?.gold > 0 && <span>{quest.rewards.gold} gold</span>}
          {quest.rewards?.xp > 0 && <span>{quest.rewards.xp} XP</span>}
        </div>

        {/* Status badge */}
        <div
          style={{
            display: 'inline-block',
            backgroundColor: quest.status === 'completed' ? '#5db36f33' :
                           quest.status === 'failed' ? '#d4433a33' :
                           quest.status === 'active' ? T.crimsonBorder : '#7a7a7a33',
            color: quest.status === 'completed' ? '#5db36f' :
                   quest.status === 'failed' ? T.crimson :
                   quest.status === 'active' ? T.crimson : T.textMuted,
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: T.ui,
            textTransform: 'uppercase',
            fontWeight: 'bold'
          }}
        >
          {quest.status}
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: `1px solid ${T.border}`
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Objectives */}
            {quest.objectives && quest.objectives.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontFamily: T.heading, color: T.gold }}>
                  Objectives
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {quest.objectives.map((obj, idx) => (
                    <label
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: isDM ? 'pointer' : 'default',
                        fontSize: '13px',
                        fontFamily: T.body,
                        color: obj.completed ? T.textFaint : T.textMuted,
                        opacity: obj.completed ? 0.6 : 1
                      }}
                      onClick={() => isDM && toggleObjective(quest.id, idx)}
                    >
                      <input
                        type="checkbox"
                        checked={obj.completed}
                        onChange={() => isDM && toggleObjective(quest.id, idx)}
                        disabled={!isDM}
                        style={{ cursor: isDM ? 'pointer' : 'default' }}
                      />
                      <span style={{ textDecoration: obj.completed ? 'line-through' : 'none' }}>
                        {obj.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed rewards */}
            {quest.rewards && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontFamily: T.heading, color: T.gold }}>
                  Rewards
                </h4>
                <div style={{ fontSize: '13px', fontFamily: T.body, color: T.textMuted }}>
                  {quest.rewards.gold > 0 && <div>{quest.rewards.gold} gold pieces</div>}
                  {quest.rewards.xp > 0 && <div>{quest.rewards.xp} experience points</div>}
                  {quest.rewards.items && quest.rewards.items.length > 0 && (
                    <div>
                      Items: {quest.rewards.items.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quest chain progress */}
            {quest.chain && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontFamily: T.heading, color: T.gold }}>
                  Quest Chain
                </h4>
                <div style={{ fontSize: '12px', fontFamily: T.body, color: T.textMuted }}>
                  Part of: {quest.chain}
                </div>
              </div>
            )}

            {/* Lore */}
            {quest.lore && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontFamily: T.heading, color: T.gold }}>
                  Lore
                </h4>
                <p style={{ margin: 0, fontSize: '12px', fontFamily: T.body, color: T.textMuted, lineHeight: '1.5' }}>
                  {quest.lore}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              {quest.status === 'available' && (
                <button
                  onClick={() => updateQuestStatus(quest.id, 'active')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: T.crimson,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: T.ui,
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  Accept Quest
                </button>
              )}
              {quest.status === 'active' && (
                <button
                  onClick={() => updateQuestStatus(quest.id, 'completed')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#5db36f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: T.ui,
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  Complete Quest
                </button>
              )}
              {(quest.status === 'active' || quest.status === 'available') && (
                <button
                  onClick={() => updateQuestStatus(quest.id, 'failed')}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    color: T.textMuted,
                    border: `1px solid ${T.crimson}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: T.ui,
                    fontSize: '12px'
                  }}
                >
                  Abandon
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render downtime panel
  const DowntimePanel = () => {
    const DOWNTIME_ACTIVITIES = [
      'Crafting', 'Research', 'Training', 'Carousing', 'Spellcasting',
      'Work', 'Recuperating', 'Scouting', 'Gambling', 'Religious'
    ];

    return (
      <div
        style={{
          backgroundColor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <h3
          style={{
            margin: '0 0 16px 0',
            fontFamily: T.heading,
            color: T.gold,
            fontSize: '16px'
          }}
        >
          Downtime Activities
        </h3>

        {party.length === 0 ? (
          <p style={{ color: T.textMuted, fontFamily: T.body, fontSize: '13px' }}>
            No party members loaded
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            {party.map(member => (
              <div
                key={member.name}
                style={{
                  backgroundColor: 'rgba(18,14,10,0.5)',
                  border: `1px solid ${T.border}`,
                  borderRadius: '6px',
                  padding: '12px'
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <div
                    style={{
                      fontFamily: T.heading,
                      color: T.text,
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}
                  >
                    {member.name}
                  </div>
                  <div
                    style={{
                      fontFamily: T.body,
                      color: T.textMuted,
                      fontSize: '11px'
                    }}
                  >
                    {member.class} Level {member.level}
                  </div>
                </div>
                <select
                  value={downtimeAssignments[member.name] || ''}
                  onChange={(e) => setDowntimeAssignments(prev => ({
                    ...prev,
                    [member.name]: e.target.value
                  }))}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    backgroundColor: T.bg,
                    color: T.text,
                    border: `1px solid ${T.textFaint}33`,
                    borderRadius: '4px',
                    fontFamily: T.body,
                    fontSize: '12px'
                  }}
                >
                  <option value="">Select activity...</option>
                  {DOWNTIME_ACTIVITIES.map(act => (
                    <option key={act} value={act}>{act}</option>
                  ))}
                </select>
              </div>
            ))}
            <button
              style={{
                marginTop: 'auto',
                padding: '10px 16px',
                backgroundColor: T.gold,
                color: T.bg,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: T.ui,
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Resolve Downtime
            </button>
          </div>
        )}
      </div>
    );
  };

  // Main render
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: T.bg,
        color: T.text,
        fontFamily: T.body
      }}
    >
      {/* Header bar */}
      <div
        style={{
          backgroundColor: T.bgNav,
          borderBottom: `1px solid ${T.border}`,
          padding: '16px',
          marginBottom: '16px'
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              fontFamily: T.heading,
              color: T.text,
              marginBottom: '4px'
            }}
          >
            Quest Board
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: T.textMuted,
              fontFamily: T.body
            }}
          >
            {questCounts.active} Active • {questCounts.available} Available • {questCounts.completed} Completed
          </p>
        </div>

        {/* Filter row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '12px'
          }}
        >
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            style={{
              padding: '8px 12px',
              backgroundColor: T.bgCard,
              color: T.text,
              border: `1px solid ${T.border}`,
              borderRadius: '4px',
              fontFamily: T.ui,
              fontSize: '12px'
            }}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            style={{
              padding: '8px 12px',
              backgroundColor: T.bgCard,
              color: T.text,
              border: `1px solid ${T.border}`,
              borderRadius: '4px',
              fontFamily: T.ui,
              fontSize: '12px'
            }}
          >
            <option value="all">All Types</option>
            {questTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={filters.difficulty}
            onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
            style={{
              padding: '8px 12px',
              backgroundColor: T.bgCard,
              color: T.text,
              border: `1px solid ${T.border}`,
              borderRadius: '4px',
              fontFamily: T.ui,
              fontSize: '12px'
            }}
          >
            <option value="all">All Difficulties</option>
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>

          <select
            value={filters.region}
            onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
            style={{
              padding: '8px 12px',
              backgroundColor: T.bgCard,
              color: T.text,
              border: `1px solid ${T.border}`,
              borderRadius: '4px',
              fontFamily: T.ui,
              fontSize: '12px'
            }}
          >
            <option value="all">All Regions</option>
            {regions.map(region => (
              <option key={region.name} value={region.name}>{region.name}</option>
            ))}
          </select>
        </div>

        {/* Search & action row */}
        <div
          style={{
            display: 'flex',
            gap: '12px'
          }}
        >
          <input
            type="text"
            placeholder="Search quests..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            style={{
              flex: 1,
              padding: '8px 12px',
              backgroundColor: T.bgCard,
              color: T.text,
              border: `1px solid ${T.border}`,
              borderRadius: '4px',
              fontFamily: T.body,
              fontSize: '12px'
            }}
          />
          {isDM && (
            <button
              onClick={generateQuests}
              style={{
                padding: '8px 16px',
                backgroundColor: T.gold,
                color: T.bg,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: T.ui,
                fontSize: '12px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}
            >
              Generate Quests
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 320px',
          gap: '16px',
          padding: '0 16px 16px 16px',
          flex: 1,
          minHeight: 0
        }}
      >
        {/* Quest cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '12px',
            overflowY: 'auto',
            paddingRight: '8px'
          }}
        >
          {filteredQuests.length === 0 ? (
            <div
              style={{
                gridColumn: '1 / -1',
                padding: '40px 20px',
                textAlign: 'center',
                color: T.textMuted,
                fontFamily: T.body
              }}
            >
              No quests match your filters
            </div>
          ) : (
            filteredQuests.map(quest => <QuestCard key={quest.id} quest={quest} />)
          )}
        </div>

        {/* Sidebar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto'
          }}
        >
          <DowntimePanel />
        </div>
      </div>
    </div>
  );
};
