(function() {
  const { useState, useEffect, useCallback, useRef, useMemo } = React;
  const T = window.__PHMURT_THEME || {};
  try { if (window.T) Object.assign(T, window.T); } catch(e) {}

  const {
    Flame, Moon, Wand2, Heart, Zap, Skull, Coins, Hammer,
    ChevronDown, ChevronUp, Plus, Edit2, Trash2, Check, AlertCircle,
    Sparkles, BookOpen, Users, Calendar, Eye, EyeOff, Settings, Save, X
  } = window.LucideReact || {};

  // Default deity pantheon
  const DEFAULT_PANTHEON = [
    { id: 'solarius', name: 'Solarius', domain: 'life', alignment: 'LG', symbol: '☉', description: 'God of the Sun, Light, and Noble Life. Grants blessings to those who seek truth and justice.', temples: 3, favor: 0, activeBlessing: null, activeCurse: null },
    { id: 'lunara', name: 'Lunara', domain: 'knowledge', alignment: 'CG', symbol: '☽', description: 'Goddess of the Moon, Dreams, and Hidden Knowledge. Favors those who seek wisdom in darkness.', temples: 2, favor: 0, activeBlessing: null, activeCurse: null },
    { id: 'ferros', name: 'Ferros', domain: 'war', alignment: 'LN', symbol: '⚔', description: 'God of War, Valor, and Honorable Combat. Grants strength to those who fight with honor.', temples: 4, favor: 0, activeBlessing: null, activeCurse: null },
    { id: 'verdana', name: 'Verdana', domain: 'nature', alignment: 'NG', symbol: '❧', description: 'Goddess of Nature, Growth, and Renewal. Protects the balance of the wild.', temples: 2, favor: 0, activeBlessing: null, activeCurse: null },
    { id: 'morthos', name: 'Morthos', domain: 'death', alignment: 'N', symbol: '☠', description: 'God of Death, Passage, and the Inevitable End. Neutral in all things mortal.', temples: 1, favor: 0, activeBlessing: null, activeCurse: null },
    { id: 'auros', name: 'Auros', domain: 'trickery', alignment: 'CN', symbol: '◆', description: 'God of Commerce, Fortune, and Clever Deception. Favors the cunning and lucky.', temples: 5, favor: 0, activeBlessing: null, activeCurse: null },
    { id: 'tempestus', name: 'Tempestus', domain: 'tempest', alignment: 'CE', symbol: '⚡', description: 'God of Storms, Sea, and Chaos. Unpredictable and dangerous.', temples: 1, favor: 0, activeBlessing: null, activeCurse: null },
    { id: 'forgara', name: 'Forgara', domain: 'forge', alignment: 'LG', symbol: '⚒', description: 'Goddess of Craft, Earth, and Creation. Grants skill to those who work with dedication.', temples: 3, favor: 0, activeBlessing: null, activeCurse: null }
  ];

  const BLESSINGS_BY_DOMAIN = {
    life: [
      { name: 'Healing Touch', effect: '+2 to healing spells', duration: 'Until next dawn' },
      { name: 'Vitality', effect: 'Temporary 10 HP per party member', duration: 'Until next long rest' },
      { name: 'Protection', effect: '+1 AC for 24 hours', duration: '24 hours' }
    ],
    knowledge: [
      { name: 'Keen Mind', effect: '+2 to Intelligence checks', duration: 'Until next long rest' },
      { name: 'Insight', effect: 'Advantage on Wisdom checks to read creatures', duration: '24 hours' },
      { name: 'Revelation', effect: 'Detect magic 3 times', duration: 'Until next dawn' }
    ],
    war: [
      { name: 'Warrior\'s Strength', effect: '+2 to attack rolls', duration: '24 hours' },
      { name: 'Valor', effect: 'Advantage on saving throws vs fear', duration: 'Until next long rest' },
      { name: 'Tactical Eye', effect: 'Advantage on initiative rolls', duration: '24 hours' }
    ],
    nature: [
      { name: 'Growth', effect: 'Advantage on Constitution saves', duration: '24 hours' },
      { name: 'Wild Stride', effect: 'Double movement speed in natural terrain', duration: 'Until next dawn' },
      { name: 'Animal Ally', effect: 'Summon a beast companion', duration: '8 hours' }
    ],
    death: [
      { name: 'Borrowed Time', effect: 'Restore one use of Death Save', duration: 'One resurrection' },
      { name: 'Pale Passage', effect: 'Cannot be detected by undead', duration: 'Until next dusk' },
      { name: 'Shade Veil', effect: 'Resistance to necrotic damage', duration: '24 hours' }
    ],
    trickery: [
      { name: 'Lucky', effect: '+2 to Sleight of Hand and Stealth', duration: '24 hours' },
      { name: 'Favor\'s Smile', effect: 'Advantage on one d20 roll', duration: 'Until used' },
      { name: 'Escape', effect: 'Dimension Door spell once', duration: 'Until used' }
    ],
    tempest: [
      { name: 'Storm\'s Fury', effect: '+1d6 lightning damage on spells', duration: '24 hours' },
      { name: 'Typhoon', effect: 'Resistance to lightning and thunder', duration: 'Until next dawn' },
      { name: 'Sky Walk', effect: 'Levitate for 1 hour', duration: 'Until used' }
    ],
    forge: [
      { name: 'Masterwork', effect: '+1 to crafted item AC/bonus', duration: 'Permanent on one item' },
      { name: 'Unbreaking', effect: 'Weapon/armor cannot be damaged', duration: '24 hours' },
      { name: 'Forge Fury', effect: 'Weapons deal +1d4 damage', duration: 'Until next long rest' }
    ]
  };

  const CURSES_BY_DOMAIN = {
    life: [
      { name: 'Blight', effect: '-2 to healing received', duration: '3 days' },
      { name: 'Weakness', effect: 'Disadvantage on Strength saves', duration: '24 hours' },
      { name: 'Pestilence', effect: 'Constitution saves at disadvantage', duration: 'Until blessed' }
    ],
    knowledge: [
      { name: 'Confusion', effect: '-2 to Intelligence checks', duration: '24 hours' },
      { name: 'Madness', effect: 'Cannot prepare spells', duration: 'Until blessed' },
      { name: 'Blindness', effect: 'Disadvantage on Wisdom checks', duration: '3 days' }
    ],
    war: [
      { name: 'Cowardice', effect: 'Disadvantage on attack rolls', duration: '24 hours' },
      { name: 'Wounding', effect: 'All damage dealt is reduced by 2', duration: '3 days' },
      { name: 'Fumble', effect: 'On d20 roll of 5 or less, weapon drops', duration: 'Until blessed' }
    ],
    nature: [
      { name: 'Withering', effect: '-2 to Constitution checks', duration: '3 days' },
      { name: 'Sickly', effect: 'Disadvantage on saves vs disease and poison', duration: 'Until blessed' },
      { name: 'Entangled', effect: 'Movement halved in all terrain', duration: '24 hours' }
    ],
    death: [
      { name: 'Death Mark', effect: 'Next melee attack against you has advantage', duration: 'Until next long rest' },
      { name: 'Haunted', effect: 'Disadvantage on saves vs undead', duration: '3 days' },
      { name: 'Doomed', effect: 'Gain one level of exhaustion', duration: 'Until blessed' }
    ],
    trickery: [
      { name: 'Betrayal', effect: 'Disadvantage on rolls to deceive or hide', duration: '24 hours' },
      { name: 'Misfortune', effect: '-2 to all d20 rolls', duration: '3 days' },
      { name: 'Exposed', effect: 'Cannot be unseen by enemies', duration: 'Until blessed' }
    ],
    tempest: [
      { name: 'Tempest Wrath', effect: 'Disadvantage on Dexterity saves', duration: '24 hours' },
      { name: 'Grounded', effect: 'Cannot fly or levitate', duration: '3 days' },
      { name: 'Lightning Rod', effect: 'Lightning damage taken is doubled', duration: 'Until blessed' }
    ],
    forge: [
      { name: 'Brittle', effect: 'Equipment breaks on critical failure', duration: '24 hours' },
      { name: 'Rust', effect: 'Armor AC reduced by 1', duration: '3 days' },
      { name: 'Broken Tools', effect: 'Disadvantage on crafting checks', duration: 'Until blessed' }
    ]
  };

  function initializeReligionState() {
    return {
      pantheon: DEFAULT_PANTHEON.map(d => ({ ...d })),
      divineFavor: DEFAULT_PANTHEON.reduce((acc, d) => ({ ...acc, [d.id]: 0 }), {}),
      activeBlessing: null,
      activeCurse: null,
      prayerLog: [],
      holyDays: [
        { name: 'Solstice of Light', season: 'summer', deityId: 'solarius', effect: '+1 divine favor with all good-aligned deities' },
        { name: 'Moonrise Festival', season: 'autumn', deityId: 'lunara', effect: 'Spells cast at night gain advantage' },
        { name: 'War Games', season: 'spring', deityId: 'ferros', effect: '+1d4 damage to weapon attacks' },
        { name: 'Harvest Blessing', season: 'autumn', deityId: 'verdana', effect: 'Advantage on food gathering and nature checks' },
        { name: 'Veil Night', season: 'winter', deityId: 'morthos', effect: 'Undead cannot sense the party' },
        { name: 'Fortune\'s Day', season: 'spring', deityId: 'auros', effect: 'Advantage on rolls involving luck' },
        { name: 'Storm Season', season: 'spring', deityId: 'tempestus', effect: 'Electrical phenomena common' },
        { name: 'Forge Fest', season: 'winter', deityId: 'forgara', effect: '+1 to crafting, repair all items free' }
      ]
    };
  }

  function TriggerDisplay({ trigger, canEdit, onRemove }) {
    const getIcon = () => {
      switch(trigger.type) {
        case 'faction_power': return '◈';
        case 'npc_dead': return '☠';
        case 'region_state': return '◎';
        case 'war_declared': return '⚔';
        default: return '◆';
      }
    };

    const getTriggerText = () => {
      switch(trigger.type) {
        case 'faction_power':
          return `${trigger.factionName} power ${trigger.operator} ${trigger.value}`;
        case 'npc_dead':
          return `${trigger.npcName} is dead`;
        case 'region_state':
          return `${trigger.regionName} state: ${trigger.state}`;
        case 'war_declared':
          return `War between ${trigger.faction1} and ${trigger.faction2}`;
        default:
          return trigger.description || 'Custom trigger';
      }
    };

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px',
        backgroundColor: trigger.met ? `${T.greenDim}20` : `${T.textDim}10`,
        border: `1px solid ${trigger.met ? T.green : T.textDim}`,
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <span>{getIcon()}</span>
        <span style={{ flex: 1, color: trigger.met ? 'var(--green)' : 'var(--text)' }}>
          {getTriggerText()}
        </span>
        {trigger.met && <Check size={14} color="var(--green)" />}
        {canEdit && (
          <button
            onClick={() => onRemove()}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={14} color="var(--text-muted)" />
          </button>
        )}
      </div>
    );
  }

  function ProphecyCard({ prophecy, onEdit, onDelete, canEdit, deityName, viewRole }) {
    const [expanded, setExpanded] = useState(false);
    const triggers = prophecy?.triggers || [];
    const metTriggers = triggers.filter(t => t.met).length;
    const totalTriggers = triggers.length;
    const progressPercent = totalTriggers > 0 ? (metTriggers / totalTriggers) * 100 : 0;

    const getStatusColor = () => {
      switch(prophecy.status) {
        case 'fulfilled': return 'var(--green)';
        case 'failed': return 'var(--crimson)';
        case 'dormant': return 'var(--text-dim)';
        default: return 'var(--gold)';
      }
    };

    const getImportanceColor = () => {
      switch(prophecy.importance) {
        case 'world_shaking': return 'var(--crimson)';
        case 'major': return 'var(--gold)';
        default: return 'var(--orange)';
      }
    };

    const shouldShowTriggers = viewRole === 'dm' || (prophecy?.visibility || 'public') !== 'dm_only';

    return (
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: `1px solid var(--border)`,
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
              flexWrap: 'wrap'
            }}>
              <span style={{
                fontStyle: 'italic',
                fontFamily: T.heading,
                color: T.gold,
                fontSize: '13px',
                flex: '1 1 100%'
              }}>
                "{prophecy.text}"
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: getStatusColor(),
                backgroundColor: `${getStatusColor()}20`,
                padding: '2px 6px',
                borderRadius: '3px',
                textTransform: 'uppercase'
              }}>
                {prophecy.status}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: getImportanceColor(),
                backgroundColor: `${getImportanceColor()}20`,
                padding: '2px 6px',
                borderRadius: '3px'
              }}>
                {prophecy.importance}
              </span>
              {deityName && (
                <span style={{
                  fontSize: '10px',
                  color: T.textDim,
                  padding: '2px 6px',
                  borderRadius: '3px',
                  backgroundColor: `${T.textDim}10`
                }}>
                  {deityName}
                </span>
              )}
              {(prophecy?.visibility || 'public') !== 'public' && (
                <span style={{
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  {(prophecy?.visibility || 'public') === 'dm_only' ? <EyeOff size={10} /> : <Eye size={10} />}
                  {(prophecy?.visibility || 'public') === 'dm_only' ? 'DM Only' : 'Partial'}
                </span>
              )}
            </div>

            {totalTriggers > 0 && (
              <div style={{ marginBottom: '8px' }}>
                <div style={{
                  height: '6px',
                  backgroundColor: 'var(--bg-mid)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  marginBottom: '4px'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    backgroundColor: getStatusColor(),
                    transition: 'width 0.3s'
                  }} />
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-dim)',
                  textAlign: 'center'
                }}>
                  {metTriggers}/{totalTriggers} conditions met
                </div>
              </div>
            )}

            {(prophecy?.signs || []).length > 0 && (
              <div style={{
                padding: '8px',
                backgroundColor: `${T.orange}10`,
                border: `1px solid ${T.orange}`,
                borderRadius: '4px',
                marginBottom: '8px'
              }}>
                <div style={{ fontSize: '10px', color: T.orange, fontWeight: 'bold', marginBottom: '4px' }}>
                  SIGNS APPEARED:
                </div>
                {(prophecy?.signs || []).map((sign, idx) => (
                  <div key={idx} style={{ fontSize: '11px', color: T.text, marginBottom: '2px' }}>
                    • {sign.text} (Turn {sign.triggeredAt})
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-dim)'
            }}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {expanded && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', marginTop: '12px' }}>
            {viewRole === 'dm' && prophecy.interpretation && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: 'var(--crimson)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '4px'
                }}>
                  DM Interpretation
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text)',
                  backgroundColor: `${T.crimsonDim}05`,
                  padding: '8px',
                  borderRadius: '4px',
                  borderLeft: '2px solid var(--crimson)'
                }}>
                  {prophecy.interpretation}
                </div>
              </div>
            )}

            {shouldShowTriggers && triggers.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: 'var(--text-dim)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}>
                  Trigger Conditions ({prophecy?.triggerMode || 'all'})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {triggers.map((trigger, idx) => (
                    <TriggerDisplay
                      key={idx}
                      trigger={trigger}
                      canEdit={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {prophecy.fulfillmentEvent && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: 'var(--gold)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '4px'
                }}>
                  Fulfillment Event
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text)',
                  fontStyle: 'italic'
                }}>
                  {prophecy.fulfillmentEvent}
                </div>
              </div>
            )}

            {prophecy.consequences && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: 'var(--orange)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '4px'
                }}>
                  Mechanical Consequences
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text)',
                  backgroundColor: `${T.orangeDim}05`,
                  padding: '8px',
                  borderRadius: '4px'
                }}>
                  {prophecy.consequences}
                </div>
              </div>
            )}

            {canEdit && (
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                <button
                  onClick={() => onEdit(prophecy)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    backgroundColor: 'var(--bg-mid)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => onDelete(prophecy.id)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    backgroundColor: `${T.crimsonDim}10`,
                    color: 'var(--crimson)',
                    border: '1px solid var(--crimson)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Prophecy templates for random generation
  const PROPHECY_TEMPLATES = [
    "When the {faction} falls and {region} burns, {npc} shall rise from the ashes",
    "The throne of {city} shall crumble when {npc} speaks the forgotten name",
    "Three moons shall wax and wane before {npc} claims {region} as their own",
    "The {faction} will feast upon {city}'s spoils, but {npc} walks a darker path",
    "Where {region} trembles, {npc} shall plant the seeds of {faction}'s downfall",
    "A child of {city} shall betray their own blood when {npc} returns",
    "The stars align when {faction} breaks their sacred oath in {region}",
    "In {city}'s darkest hour, {npc} becomes either savior or destroyer",
    "{faction} will achieve dominion, but {npc} holds the final key to its fate",
    "When {region} drowns in blood, {npc} shall inherit what remains",
    "The prophecy echoes: {city} shall fall, {npc} shall rise, {faction} shall rule no more",
    "Death comes for {npc}, but not before {region} learns {faction}'s greatest secret",
    "{npc} cannot escape their destiny, nor can {city} escape the coming storm",
    "The sands shift in {region}, and {faction} will discover what {npc} has hidden",
    "When the bells of {city} toll for the last time, {npc} shall smile"
  ];

  function ProphecyEditor({ prophecy, deities, onSave, onCancel, viewRole, worldData = {} }) {
    const [text, setText] = useState(prophecy?.text || '');
    const [interpretation, setInterpretation] = useState(prophecy?.interpretation || '');
    const [status, setStatus] = useState(prophecy?.status || 'active');
    const [visibility, setVisibility] = useState(prophecy?.visibility || 'public');
    const [importance, setImportance] = useState(prophecy?.importance || 'minor');
    const [linkedDeity, setLinkedDeity] = useState(prophecy?.linkedDeity || null);
    const [triggerMode, setTriggerMode] = useState(prophecy?.triggerMode || 'all');
    const [fulfillmentEvent, setFulfillmentEvent] = useState(prophecy?.fulfillmentEvent || '');
    const [consequences, setConsequences] = useState(prophecy?.consequences || '');
    const [triggers, setTriggers] = useState(prophecy?.triggers || []);
    const [newTrigger, setNewTrigger] = useState({ type: 'custom', description: '' });

    // Helper function to generate random prophecy
    const generateRandomProphecy = () => {
      const regions = (worldData.regions || []);
      const factions = (worldData.factions || []);
      const npcs = (worldData.npcs || []);
      const cities = (worldData.cities || []);

      if (regions.length === 0 || factions.length === 0 || npcs.length === 0 || cities.length === 0) {
        alert('World data not fully loaded. Please ensure regions, factions, NPCs, and cities are defined.');
        return;
      }

      const template = PROPHECY_TEMPLATES[Math.floor(Math.random() * PROPHECY_TEMPLATES.length)];
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      const randomFaction = factions[Math.floor(Math.random() * factions.length)];
      const randomNpc = npcs[Math.floor(Math.random() * npcs.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];

      // Safely handle null/undefined selections with fallback values
      const regionName = (randomRegion && randomRegion.name) || 'a distant region';
      const factionName = (randomFaction && randomFaction.name) || 'a mysterious faction';
      const npcName = (randomNpc && randomNpc.name) || 'an unknown figure';
      const cityName = (randomCity && randomCity.name) || 'a forgotten city';

      const generatedText = template
        .replace('{region}', regionName)
        .replace('{faction}', factionName)
        .replace('{npc}', npcName)
        .replace('{city}', cityName);

      setText(generatedText);
    };

    const handleAddTrigger = () => {
      if (newTrigger.type === 'custom' && !newTrigger.description) return;
      setTriggers([...triggers, { ...newTrigger, met: false }]);
      setNewTrigger({ type: 'custom', description: '' });
    };

    const handleRemoveTrigger = (idx) => {
      setTriggers(triggers.filter((_, i) => i !== idx));
    };

    const handleSave = () => {
      onSave({
        id: prophecy?.id || 'prophecy_' + Date.now(),
        text: text.trim(),
        interpretation: interpretation.trim(),
        status,
        visibility,
        importance,
        linkedDeity,
        triggerMode,
        fulfillmentEvent: fulfillmentEvent.trim(),
        consequences: consequences.trim(),
        triggers,
        signs: prophecy?.signs || [],
        createdTurn: prophecy?.createdTurn || 0
      });
    };

    return (
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '16px'
      }}>
        <h3 style={{
          fontSize: '14px',
          fontFamily: T.heading,
          color: 'var(--text)',
          marginBottom: '16px'
        }}>
          {prophecy ? 'Edit Prophecy' : 'Create New Prophecy'}
        </h3>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '8px',
            fontWeight: 'bold',
            color: 'var(--crimson)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            Prophecy Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the cryptic prophecy as the players will hear it..."
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '8px',
              backgroundColor: 'var(--bg-mid)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              fontFamily: T.body,
              fontSize: '12px',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={generateRandomProphecy}
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '8px',
              backgroundColor: 'var(--crimson)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} /> Generate Random Prophecy
          </button>
        </div>

        {viewRole === 'dm' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '8px',
              fontWeight: 'bold',
              color: 'var(--crimson)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}>
              DM Interpretation (Private)
            </label>
            <textarea
              value={interpretation}
              onChange={(e) => setInterpretation(e.target.value)}
              placeholder="Your private notes on what this prophecy actually means..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '8px',
                backgroundColor: 'var(--bg-mid)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontFamily: T.body,
                fontSize: '12px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '8px',
              fontWeight: 'bold',
              color: 'var(--text-dim)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--bg-mid)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="active">Active</option>
              <option value="dormant">Dormant</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '8px',
              fontWeight: 'bold',
              color: 'var(--text-dim)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}>
              Importance
            </label>
            <select
              value={importance}
              onChange={(e) => setImportance(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--bg-mid)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="world_shaking">World-Shaking</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '8px',
              fontWeight: 'bold',
              color: 'var(--text-dim)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}>
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--bg-mid)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="public">Public (Players see all)</option>
              <option value="partial">Partial (Text only)</option>
              <option value="dm_only">DM Only</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '8px',
              fontWeight: 'bold',
              color: 'var(--text-dim)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '6px'
            }}>
              Linked Deity
            </label>
            <select
              value={linkedDeity || ''}
              onChange={(e) => setLinkedDeity(e.target.value || null)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--bg-mid)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '12px'
              }}
            >
              <option value="">None</option>
              {deities.map(d => (
                <option key={d.id} value={d.id}>{d.symbol} {d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '8px',
            fontWeight: 'bold',
            color: 'var(--text-dim)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            Fulfillment Event
          </label>
          <textarea
            value={fulfillmentEvent}
            onChange={(e) => setFulfillmentEvent(e.target.value)}
            placeholder="What happens narratively when this prophecy is fulfilled?"
            style={{
              width: '100%',
              minHeight: '60px',
              padding: '8px',
              backgroundColor: 'var(--bg-mid)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              fontFamily: T.body,
              fontSize: '12px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '8px',
            fontWeight: 'bold',
            color: 'var(--text-dim)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            Mechanical Consequences
          </label>
          <textarea
            value={consequences}
            onChange={(e) => setConsequences(e.target.value)}
            placeholder="What mechanical effects does fulfillment have? (XP, loot, ability changes, etc.)"
            style={{
              width: '100%',
              minHeight: '60px',
              padding: '8px',
              backgroundColor: 'var(--bg-mid)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              fontFamily: T.body,
              fontSize: '12px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <label style={{
              fontSize: '8px',
              fontWeight: 'bold',
              color: 'var(--text-dim)',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              Trigger Mode
            </label>
            <select
              value={triggerMode}
              onChange={(e) => setTriggerMode(e.target.value)}
              style={{
                padding: '4px 8px',
                backgroundColor: 'var(--bg-mid)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '11px'
              }}
            >
              <option value="all">ALL conditions must be met</option>
              <option value="any">ANY condition can fulfill</option>
            </select>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-mid)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '12px'
          }}>
            <div style={{
              fontSize: '8px',
              fontWeight: 'bold',
              color: 'var(--text-dim)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              Trigger Conditions
            </div>
            {triggers.map((trigger, idx) => (
              <div key={idx} style={{ marginBottom: '6px' }}>
                <TriggerDisplay
                  trigger={trigger}
                  canEdit={true}
                  onRemove={() => handleRemoveTrigger(idx)}
                />
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: 'var(--bg-mid)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '12px'
          }}>
            <div style={{
              fontSize: '8px',
              fontWeight: 'bold',
              color: 'var(--text-dim)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginBottom: '8px'
            }}>
              Add Trigger
            </div>
            <select
              value={newTrigger.type}
              onChange={(e) => setNewTrigger({ ...newTrigger, type: e.target.value, description: '' })}
              style={{
                width: '100%',
                padding: '6px',
                backgroundColor: 'var(--bg)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '11px',
                marginBottom: '8px'
              }}
            >
              <option value="custom">Custom Condition</option>
              <option value="faction_power">Faction Power Level</option>
              <option value="npc_dead">NPC Death</option>
              <option value="region_state">Region State</option>
              <option value="war_declared">War Declaration</option>
            </select>

            {newTrigger.type === 'custom' && (
              <input
                type="text"
                value={newTrigger.description}
                onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                placeholder="Describe the condition..."
                style={{
                  width: '100%',
                  padding: '6px',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  fontSize: '11px',
                  marginBottom: '8px',
                  boxSizing: 'border-box'
                }}
              />
            )}

            {newTrigger.type === 'faction_power' && (
              <div style={{ marginBottom: '8px' }}>
                <select
                  value={newTrigger.description}
                  onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    marginBottom: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select faction...</option>
                  {(worldData.factions || []).map(f => (
                    <option key={f.name} value={f.name}>{f.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newTrigger.description}
                  onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                  placeholder="Or enter faction name manually..."
                  style={{
                    width: '100%',
                    padding: '6px',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            {newTrigger.type === 'npc_dead' && (
              <div style={{ marginBottom: '8px' }}>
                <select
                  value={newTrigger.description}
                  onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    marginBottom: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select NPC...</option>
                  {(worldData.npcs || []).map(n => (
                    <option key={n.name} value={n.name}>{n.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newTrigger.description}
                  onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                  placeholder="Or enter NPC name manually..."
                  style={{
                    width: '100%',
                    padding: '6px',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            {newTrigger.type === 'region_state' && (
              <div style={{ marginBottom: '8px' }}>
                <select
                  value={newTrigger.description}
                  onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    marginBottom: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select region...</option>
                  {(worldData.regions || []).map(r => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newTrigger.description}
                  onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                  placeholder="Or enter region name manually..."
                  style={{
                    width: '100%',
                    padding: '6px',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            {newTrigger.type === 'war_declared' && (
              <div style={{ marginBottom: '8px' }}>
                <select
                  value={newTrigger.description}
                  onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    marginBottom: '4px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select faction...</option>
                  {(worldData.factions || []).map(f => (
                    <option key={f.name} value={f.name}>{f.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newTrigger.description}
                  onChange={(e) => setNewTrigger({ ...newTrigger, description: e.target.value })}
                  placeholder="Or enter faction name manually..."
                  style={{
                    width: '100%',
                    padding: '6px',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: '4px',
                    fontSize: '11px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            <button
              onClick={handleAddTrigger}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'var(--crimson)',
                color: 'var(--bg)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Plus size={12} /> Add Trigger
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: 'var(--crimson)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Save size={14} /> Save Prophecy
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: 'var(--bg-mid)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  function DeityCard({ deity, onFavorChange, onGrantBlessing, onInflictCurse, canEdit, deityRegions = [] }) {
    const [expanded, setExpanded] = useState(false);
    const blessings = BLESSINGS_BY_DOMAIN[deity.domain] || [];
    const curses = CURSES_BY_DOMAIN[deity.domain] || [];

    const getFavorColor = () => {
      if (deity.favor > 25) return 'var(--green)';
      if (deity.favor < -25) return 'var(--crimson)';
      return 'var(--gold)';
    };

    return (
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: `1px solid ${getFavorColor()}40`,
        borderRadius: '6px',
        padding: '12px',
        cursor: 'pointer',
        transition: 'border-color 0.2s'
      }}>
        <div onClick={() => setExpanded(!expanded)} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: expanded ? '12px' : '0'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '6px'
          }}>
            {deity.symbol}
          </div>
          <h3 style={{
            fontSize: '14px',
            fontFamily: T.heading,
            color: 'var(--text)',
            margin: '0 0 4px 0'
          }}>
            {deity.name}
          </h3>
          <div style={{
            fontSize: '10px',
            color: 'var(--text-dim)',
            marginBottom: '8px'
          }}>
            {deity.domain} · {deity.alignment}
          </div>

          <div style={{ width: '100%', marginBottom: '8px' }}>
            <div style={{
              height: '4px',
              backgroundColor: 'var(--bg-mid)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.max(0, Math.min(100, (deity.favor + 100) / 2))}%`,
                backgroundColor: getFavorColor(),
                transition: 'width 0.3s'
              }} />
            </div>
            <div style={{
              fontSize: '9px',
              color: getFavorColor(),
              textAlign: 'center',
              marginTop: '2px',
              fontWeight: 'bold'
            }}>
              {deity.favor > 0 ? '+' : ''}{deity.favor} Favor
            </div>
          </div>

          {deity.activeBlessing && (
            <div style={{
              width: '100%',
              padding: '4px',
              backgroundColor: `${T.greenDim}10`,
              border: '1px solid var(--green)',
              borderRadius: '3px',
              fontSize: '9px',
              color: 'var(--green)',
              marginBottom: '4px',
              fontWeight: 'bold'
            }}>
              ✓ {deity.activeBlessing}
            </div>
          )}

          {deity.activeCurse && (
            <div style={{
              width: '100%',
              padding: '4px',
              backgroundColor: `${T.crimsonDim}10`,
              border: '1px solid var(--crimson)',
              borderRadius: '3px',
              fontSize: '9px',
              color: 'var(--crimson)',
              marginBottom: '4px',
              fontWeight: 'bold'
            }}>
              ✗ {deity.activeCurse}
            </div>
          )}

          <div style={{
            fontSize: '9px',
            color: 'var(--text-muted)',
            marginBottom: expanded ? '0' : '0'
          }}>
            {deity.temples} {deity.temples === 1 ? 'temple' : 'temples'}
          </div>
        </div>

        {expanded && (
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
            <div style={{
              fontSize: '11px',
              color: 'var(--text)',
              marginBottom: '12px',
              lineHeight: '1.4'
            }}>
              {deity.description}
            </div>

            {deityRegions.length > 0 && (
              <div style={{
                fontSize: '9px',
                color: 'var(--text-dim)',
                marginBottom: '12px',
                padding: '8px',
                backgroundColor: `${T.orangeDim}05`,
                border: '1px solid var(--border)',
                borderRadius: '3px'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--gold)' }}>
                  Worshipped in:
                </div>
                {deityRegions.map(region => (
                  <div key={region.name} style={{ marginBottom: '2px' }}>
                    {region.name}
                  </div>
                ))}
              </div>
            )}

            {canEdit && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: 'var(--text-dim)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '8px'
                }}>
                  Adjust Favor
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '4px' }}>
                  <button
                    onClick={() => onFavorChange(deity.id, -25)}
                    style={{
                      padding: '6px',
                      backgroundColor: `${T.crimsonDim}10`,
                      color: 'var(--crimson)',
                      border: '1px solid var(--crimson)',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    -25
                  </button>
                  <button
                    onClick={() => onFavorChange(deity.id, -5)}
                    style={{
                      padding: '6px',
                      backgroundColor: `${T.crimsonDim}10`,
                      color: 'var(--crimson)',
                      border: '1px solid var(--crimson)',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    -5
                  </button>
                  <button
                    onClick={() => onFavorChange(deity.id, 5)}
                    style={{
                      padding: '6px',
                      backgroundColor: `${T.greenDim}10`,
                      color: 'var(--green)',
                      border: '1px solid var(--green)',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    +5
                  </button>
                  <button
                    onClick={() => onFavorChange(deity.id, 25)}
                    style={{
                      padding: '6px',
                      backgroundColor: `${T.greenDim}10`,
                      color: 'var(--green)',
                      border: '1px solid var(--green)',
                      borderRadius: '3px',
                      cursor: 'pointer',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    +25
                  </button>
                </div>
              </div>
            )}

            {blessings.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: 'var(--green)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '6px'
                }}>
                  Available Blessings
                </div>
                {blessings.map((blessing, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: '10px',
                      color: 'var(--text)',
                      backgroundColor: `${T.greenDim}05`,
                      padding: '6px',
                      borderRadius: '3px',
                      marginBottom: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{blessing.name}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>{blessing.effect}</div>
                      <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{blessing.duration}</div>
                    </div>
                    {canEdit && (
                      <button
                        onClick={() => onGrantBlessing(deity.id, blessing.name)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: 'var(--green)',
                          color: 'var(--bg)',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                          marginLeft: '8px'
                        }}
                      >
                        Grant
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {curses.length > 0 && (
              <div>
                <div style={{
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: 'var(--crimson)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '6px'
                }}>
                  Available Curses
                </div>
                {curses.map((curse, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: '10px',
                      color: 'var(--text)',
                      backgroundColor: `${T.crimsonDim}05`,
                      padding: '6px',
                      borderRadius: '3px',
                      marginBottom: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{curse.name}</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-dim)' }}>{curse.effect}</div>
                      <div style={{ fontSize: '8px', color: 'var(--text-muted)' }}>{curse.duration}</div>
                    </div>
                    {canEdit && (
                      <button
                        onClick={() => onInflictCurse(deity.id, curse.name)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: 'var(--crimson)',
                          color: 'var(--bg)',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '9px',
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                          marginLeft: '8px'
                        }}
                      >
                        Inflict
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  function ProphecyReligionView({ data, setData, viewRole = 'dm' }) {
    const [activeTab, setActiveTab] = useState('prophecies');
    const [editingProphecy, setEditingProphecy] = useState(null);
    const [creatingProphecy, setCreatingProphecy] = useState(false);

    const canEdit = viewRole === 'dm';

    // Helper function to get regions that worship a deity (deterministic based on deity name hash)
    const getDeityRegions = (deityName) => {
      const regions = (data.regions || []);
      if (regions.length === 0) return [];

      // Create a simple hash from deity name for deterministic selection
      let hash = 0;
      for (let i = 0; i < deityName.length; i++) {
        hash = ((hash << 5) - hash) + deityName.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }

      // Deterministically pick 1-2 regions based on hash
      const abs = Math.abs(hash);
      const count = (abs % 2) + 1;
      const selectedRegions = [];

      for (let i = 0; i < count && selectedRegions.length < regions.length; i++) {
        const idx = (abs + i * 7) % regions.length;
        if (!selectedRegions.find(r => r.name === regions[idx].name)) {
          selectedRegions.push(regions[idx]);
        }
      }

      return selectedRegions;
    };

    const religionState = useMemo(() => {
      if (!data.religionState) {
        return initializeReligionState();
      }
      return data.religionState;
    }, [data.religionState]);

    const prophecies = useMemo(() => {
      return data.prophecies || [];
    }, [data.prophecies]);

    const handleCreateProphecy = (prophecyData) => {
      const newProphecies = [...prophecies, prophecyData];
      setData({ ...data, prophecies: newProphecies });
      setCreatingProphecy(false);
    };

    const handleUpdateProphecy = (prophecyData) => {
      const newProphecies = prophecies.map(p => p.id === prophecyData.id ? prophecyData : p);
      setData({ ...data, prophecies: newProphecies });
      setEditingProphecy(null);
    };

    const handleDeleteProphecy = (id) => {
      const newProphecies = prophecies.filter(p => p.id !== id);
      setData({ ...data, prophecies: newProphecies });
    };

    const handleFavorChange = (deityId, delta) => {
      const newPantheon = religionState.pantheon.map(d =>
        d.id === deityId
          ? { ...d, favor: Math.max(-100, Math.min(100, d.favor + delta)) }
          : d
      );
      setData({
        ...data,
        religionState: { ...religionState, pantheon: newPantheon }
      });
    };

    const handleGrantBlessing = (deityId, blessingName) => {
      const newPantheon = religionState.pantheon.map(d =>
        d.id === deityId
          ? { ...d, activeBlessing: blessingName }
          : d
      );
      setData({
        ...data,
        religionState: { ...religionState, pantheon: newPantheon }
      });
    };

    const handleInflictCurse = (deityId, curseName) => {
      const newPantheon = religionState.pantheon.map(d =>
        d.id === deityId
          ? { ...d, activeCurse: curseName }
          : d
      );
      setData({
        ...data,
        religionState: { ...religionState, pantheon: newPantheon }
      });
    };

    return (
      <div style={{
        display: 'flex',
        height: '100%',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        fontFamily: T.body
      }}>
        {/* Left sidebar */}
        <div style={{
          flex: '0 0 250px',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '12px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            gap: '6px'
          }}>
            <button
              onClick={() => setActiveTab('prophecies')}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: activeTab === 'prophecies' ? 'var(--crimson)' : 'var(--bg-mid)',
                color: activeTab === 'prophecies' ? 'var(--bg)' : 'var(--text)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            >
              Prophecies
            </button>
            <button
              onClick={() => setActiveTab('pantheon')}
              style={{
                flex: 1,
                padding: '8px',
                backgroundColor: activeTab === 'pantheon' ? 'var(--crimson)' : 'var(--bg-mid)',
                color: activeTab === 'pantheon' ? 'var(--bg)' : 'var(--text)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 'bold'
              }}
            >
              Pantheon
            </button>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '12px' }}>
            {activeTab === 'prophecies' && (
              <div>
                {canEdit && (
                  <button
                    onClick={() => setCreatingProphecy(true)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: 'var(--crimson)',
                      color: 'var(--bg)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={14} /> New Prophecy
                  </button>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {prophecies.map(prophecy => {
                    const linkedDeity = prophecy.linkedDeity
                      ? religionState.pantheon.find(d => d.id === prophecy.linkedDeity)
                      : null;
                    return (
                      <div key={prophecy.id} style={{ marginBottom: '8px' }}>
                        <ProphecyCard
                          prophecy={prophecy}
                          onEdit={setEditingProphecy}
                          onDelete={handleDeleteProphecy}
                          canEdit={canEdit}
                          deityName={linkedDeity ? `${linkedDeity.symbol} ${linkedDeity.name}` : null}
                          viewRole={viewRole}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'pantheon' && (
              <div>
                <div style={{
                  fontSize: '8px',
                  fontWeight: 'bold',
                  color: 'var(--text-dim)',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '12px'
                }}>
                  The Pantheon
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px'
                }}>
                  {religionState.pantheon.map(deity => (
                    <DeityCard
                      key={deity.id}
                      deity={deity}
                      onFavorChange={handleFavorChange}
                      onGrantBlessing={handleGrantBlessing}
                      onInflictCurse={handleInflictCurse}
                      canEdit={canEdit}
                      deityRegions={getDeityRegions(deity.name)}
                    />
                  ))}
                </div>

                <div style={{
                  marginTop: '20px',
                  padding: '12px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px'
                }}>
                  <div style={{
                    fontSize: '8px',
                    fontWeight: 'bold',
                    color: 'var(--text-dim)',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '8px'
                  }}>
                    Holy Days
                  </div>
                  {religionState.holyDays.map((day, idx) => {
                    const deity = religionState.pantheon.find(d => d.id === day.deityId);
                    return (
                      <div key={idx} style={{
                        fontSize: '10px',
                        color: 'var(--text)',
                        marginBottom: '6px',
                        paddingBottom: '6px',
                        borderBottom: '1px solid var(--border)'
                      }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                          {day.name} {deity && deity.symbol}
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginBottom: '2px' }}>
                          Season: {day.season}
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                          {day.effect}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px'
        }}>
          {creatingProphecy && (
            <ProphecyEditor
              prophecy={null}
              deities={religionState.pantheon}
              onSave={handleCreateProphecy}
              onCancel={() => setCreatingProphecy(false)}
              viewRole={viewRole}
              worldData={data}
            />
          )}

          {editingProphecy && (
            <ProphecyEditor
              prophecy={editingProphecy}
              deities={religionState.pantheon}
              onSave={handleUpdateProphecy}
              onCancel={() => setEditingProphecy(null)}
              viewRole={viewRole}
              worldData={data}
            />
          )}

          {!creatingProphecy && !editingProphecy && activeTab === 'prophecies' && (
            <div>
              <h2 style={{
                fontSize: '18px',
                fontFamily: T.heading,
                color: 'var(--gold)',
                marginTop: '0',
                marginBottom: '16px'
              }}>
                Prophecy Engine
              </h2>
              <div style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '16px'
              }}>
                <p style={{
                  color: 'var(--text-dim)',
                  fontSize: '13px',
                  lineHeight: '1.6'
                }}>
                  The Prophecy Engine tracks cryptic predictions and their fulfillment across your campaign. Define trigger conditions for each prophecy, and the system will monitor their status as your campaign unfolds.
                </p>
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: `${T.orangeDim}05`,
                  border: '1px solid var(--orange)',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: 'var(--text)'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--orange)' }}>How it works:</div>
                  <ul style={{ margin: '0', paddingLeft: '20px', color: 'var(--text-dim)' }}>
                    <li>Create a prophecy with cryptic text</li>
                    <li>Define trigger conditions (faction power, NPC deaths, war declarations, etc.)</li>
                    <li>Set visibility: public (players see all), partial (text only), or DM only</li>
                    <li>The system tracks progress toward fulfillment automatically</li>
                    <li>Prophecies can be fulfilled, failed, or dormant</li>
                    <li>Link prophecies to deities for thematic connections</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {!creatingProphecy && !editingProphecy && activeTab === 'pantheon' && (
            <div>
              <h2 style={{
                fontSize: '18px',
                fontFamily: T.heading,
                color: 'var(--gold)',
                marginTop: '0',
                marginBottom: '16px'
              }}>
                Religion System
              </h2>
              <div style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '16px'
              }}>
                <p style={{
                  color: 'var(--text-dim)',
                  fontSize: '13px',
                  lineHeight: '1.6'
                }}>
                  Track your party's relationship with the gods through the Pantheon system. Each deity can grant blessings or curse those who anger them.
                </p>
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: `${T.greenDim}05`,
                  border: '1px solid var(--green)',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: 'var(--text)'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px', color: 'var(--green)' }}>Mechanics:</div>
                  <ul style={{ margin: '0', paddingLeft: '20px', color: 'var(--text-dim)' }}>
                    <li>Favor ranges from -100 (cursed) to +100 (blessed)</li>
                    <li>Each deity has unique blessings and curses by domain</li>
                    <li>Blessings provide mechanical bonuses for 24 hours to permanent effects</li>
                    <li>Curses impose penalties until the character seeks redemption</li>
                    <li>Holy days grant special effects to aligned followers</li>
                    <li>Prayers can be logged with divine responses</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  window.ProphecyReligionView = ProphecyReligionView;
})();
