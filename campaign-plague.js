(function() {
  'use strict';

  // React hooks destructuring
  const { useState, useEffect, useCallback, useRef, useMemo } = React;

  // Theme configuration
  const T = window.__PHMURT_THEME || {};
  try { if (window.T) Object.assign(T, window.T); } catch(e) {}

  // Icons from Lucide React UMD
  const {
    Skull, Heart, AlertTriangle, Plus, Edit2, Trash2, Check, X, Shield,
    Activity, Users, Eye, ChevronDown, ChevronUp, Thermometer, Droplets,
    Wind, Bug
  } = window.LucideReact || {};

  // ============================================================================
  // PREDEFINED DISEASE LIBRARY
  // ============================================================================
  const DISEASE_LIBRARY = {
    filthfever: {
      id: 'filthfever',
      name: 'Filth Fever',
      description: 'A virulent infection spread through contact with waste and filth',
      symptoms: ['High fever', 'Nausea', 'Weakness', 'Body aches'],
      transmission: 'contact',
      incubationDays: 3,
      severity: 'moderate',
      dc: 11,
      mortalityRate: 0.05,
      stages: [
        { num: 1, description: 'Exposed - no symptoms yet', days: 3 },
        { num: 2, description: 'Mild fever and discomfort, disadvantage on rolls', days: 4 },
        { num: 3, description: 'Severe fever, -2 to all rolls, bed-ridden', days: 5 },
        { num: 4, description: 'Critical - risks death or permanent damage', days: 7 }
      ],
      cureComponents: ['Herbalism Kit proficiency', 'Healing Herbs', 'Rest (7 days)'],
      cureSpells: ['Lesser Restoration', 'Healing Spirit']
    },
    mindfire: {
      id: 'mindfire',
      name: 'Mindfire',
      description: 'A magical plague affecting the mind, causing delirium and madness',
      symptoms: ['Confusion', 'Paranoia', 'Hallucinations', 'Violent outbursts'],
      transmission: 'magical',
      incubationDays: 2,
      severity: 'severe',
      dc: 13,
      mortalityRate: 0.15,
      stages: [
        { num: 1, description: 'Subtle thoughts intrude', days: 2 },
        { num: 2, description: 'Disadvantage on Wisdom saves, difficulty concentrating', days: 3 },
        { num: 3, description: 'Short-term madness, unpredictable behavior', days: 4 },
        { num: 4, description: 'Long-term madness, threat of permanent insanity', days: 10 }
      ],
      cureComponents: ['Rare herbs', 'Arcane focus', 'Mind Ward ritual'],
      cureSpells: ['Greater Restoration', 'Dispel Magic']
    },
    shakes: {
      id: 'shakes',
      name: 'The Shakes',
      description: 'A common affliction causing uncontrollable tremors',
      symptoms: ['Trembling hands', 'Loss of fine motor control', 'Weakness'],
      transmission: 'contact',
      incubationDays: 4,
      severity: 'mild',
      dc: 10,
      mortalityRate: 0.02,
      stages: [
        { num: 1, description: 'Slight tremors', days: 2 },
        { num: 2, description: 'Disadvantage on attack rolls, fine manipulation tasks', days: 4 },
        { num: 3, description: 'Severe tremors, difficulty holding weapons', days: 5 },
        { num: 4, description: 'Paralytic stage, inability to perform tasks', days: 7 }
      ],
      cureComponents: ['Herbalism Kit', 'Calming Herbs', 'Rest'],
      cureSpells: ['Restoration']
    },
    slimydoom: {
      id: 'slimydoom',
      name: 'Slimy Doom',
      description: 'A grotesque disease causing physical deterioration',
      symptoms: ['Pustules', 'Oozing sores', 'Decaying flesh', 'Putrid smell'],
      transmission: 'contact',
      incubationDays: 5,
      severity: 'severe',
      dc: 14,
      mortalityRate: 0.25,
      stages: [
        { num: 1, description: 'Small pustules appear', days: 3 },
        { num: 2, description: 'Painful sores, -1 to Dexterity', days: 5 },
        { num: 3, description: 'Rapid deterioration, -3 to all physical rolls', days: 7 },
        { num: 4, description: 'Extreme decay, death likely without intervention', days: 10 }
      ],
      cureComponents: ['Healer\'s supplies', 'Rare antibiotic herbs', 'Restoration ritual'],
      cureSpells: ['Regenerate', 'Greater Restoration']
    },
    redache: {
      id: 'redache',
      name: 'Red Ache',
      description: 'A painful inflammatory condition',
      symptoms: ['Burning pain', 'Red welts', 'Stiffness', 'Fever'],
      transmission: 'airborne',
      incubationDays: 2,
      severity: 'moderate',
      dc: 12,
      mortalityRate: 0.08,
      stages: [
        { num: 1, description: 'Joint soreness begins', days: 2 },
        { num: 2, description: 'Movement pain, -1 to AC and Dexterity saves', days: 3 },
        { num: 3, description: 'Severe inflammation, -2 to AC, half speed', days: 4 },
        { num: 4, description: 'Immobilizing pain, unable to move effectively', days: 7 }
      ],
      cureComponents: ['Herbalism Kit', 'Pain-relief herbs', 'Heat therapy'],
      cureSpells: ['Lesser Restoration']
    },
    blindingsickness: {
      id: 'blindingsickness',
      name: 'Blinding Sickness',
      description: 'A plague that impairs or destroys vision',
      symptoms: ['Blurred vision', 'Eye pain', 'Sensitivity to light', 'Blindness'],
      transmission: 'airborne',
      incubationDays: 3,
      severity: 'severe',
      dc: 13,
      mortalityRate: 0.10,
      stages: [
        { num: 1, description: 'Mild eye discomfort', days: 2 },
        { num: 2, description: 'Disadvantage on Perception checks relying on sight', days: 3 },
        { num: 3, description: 'Blurred vision, disadvantage on all attack rolls', days: 5 },
        { num: 4, description: 'Blindness (partial or complete)', days: 14 }
      ],
      cureComponents: ['Healer\'s supplies', 'Vision-restoring herbs', 'Ritual of sight'],
      cureSpells: ['Restore Sight', 'Cure Blindness']
    },
    cackle: {
      id: 'cacklefever',
      name: 'Cackle Fever',
      description: 'A magical affliction causing uncontrollable laughter and madness',
      symptoms: ['Hysterical laughter', 'Coughing fits', 'Delirium', 'Exhaustion'],
      transmission: 'airborne',
      incubationDays: 1,
      severity: 'moderate',
      dc: 11,
      mortalityRate: 0.12,
      stages: [
        { num: 1, description: 'Minor laughter episodes', days: 1 },
        { num: 2, description: 'Frequent uncontrolled laughter, disadvantage on Stealth', days: 2 },
        { num: 3, description: 'Severe coughing, laughter spasms, disadvantage on all rolls', days: 3 },
        { num: 4, description: 'Complete delirium, complete incapacity', days: 5 }
      ],
      cureComponents: ['Rare magical herb', 'Calming oil', 'Dispel ritual'],
      cureSpells: ['Dispel Magic', 'Greater Restoration']
    },
    sightrot: {
      id: 'sightrot',
      name: 'Sight Rot',
      description: 'A necrotic disease that rots living tissue beginning with the eyes',
      symptoms: ['Eye decay', 'Black discharge', 'Tissue necrosis', 'Permanent blindness'],
      transmission: 'contact',
      incubationDays: 4,
      severity: 'deadly',
      dc: 15,
      mortalityRate: 0.40,
      stages: [
        { num: 1, description: 'Eyes begin to itch and water', days: 2 },
        { num: 2, description: 'Pain, -1 to Perception', days: 2 },
        { num: 3, description: 'Blindness and necrosis begins, -2 to all rolls', days: 3 },
        { num: 4, description: 'Complete blindness and death likely without immediate aid', days: 7 }
      ],
      cureComponents: ['Rare resurrection herb', 'Blessed oil', 'Powerful restoration'],
      cureSpells: ['Regenerate', 'Wish']
    },
    sewerplague: {
      id: 'sewerplague',
      name: 'Sewer Plague',
      description: 'A virulent filth-borne disease common in urban areas',
      symptoms: ['Violent vomiting', 'Intestinal cramps', 'Diarrhea', 'Dehydration'],
      transmission: 'waterborne',
      incubationDays: 2,
      severity: 'moderate',
      dc: 11,
      mortalityRate: 0.10,
      stages: [
        { num: 1, description: 'Nausea and mild discomfort', days: 1 },
        { num: 2, description: 'Frequent illness, -1 to Strength', days: 2 },
        { num: 3, description: 'Severe intestinal distress, -2 to Strength, disadvantage on saves', days: 3 },
        { num: 4, description: 'Extreme dehydration and organ failure risk', days: 5 }
      ],
      cureComponents: ['Clean water', 'Antitoxin', 'Healing potions'],
      cureSpells: ['Cure Disease', 'Lesser Restoration']
    },
    cascadeblight: {
      id: 'cascadeblight',
      name: 'Cascade Blight',
      description: 'A plant-based plague that spreads rapidly through nature magic',
      symptoms: ['Plant overgrowth on body', 'Spore inhalation', 'Choking vines', 'Suffocation'],
      transmission: 'magical',
      incubationDays: 3,
      severity: 'severe',
      dc: 13,
      mortalityRate: 0.20,
      stages: [
        { num: 1, description: 'Unusual plant growth on skin', days: 2 },
        { num: 2, description: 'Choking vines, difficulty breathing, disadvantage on saves', days: 3 },
        { num: 3, description: 'Severe overgrowth, restricted movement', days: 4 },
        { num: 4, description: 'Complete suffocation imminent', days: 5 }
      ],
      cureComponents: ['Antitoxin', 'Fire (controlled burn)', 'Nature magic cleansing'],
      cureSpells: ['Cure Disease', 'Dispel Magic']
    },
    shadowtaint: {
      id: 'shadowtaint',
      name: 'Shadowtaint',
      description: 'A corruption of the shadow plane seeping into the material world',
      symptoms: ['Shadow spreading from infection', 'Weakness to light', 'Void touch', 'Necrotic corruption'],
      transmission: 'magical',
      incubationDays: 2,
      severity: 'deadly',
      dc: 14,
      mortalityRate: 0.30,
      stages: [
        { num: 1, description: 'Shadow marks appear', days: 2 },
        { num: 2, description: 'Vulnerability to light, disadvantage near bright light', days: 3 },
        { num: 3, description: 'Necrotic corruption spreads, -3 to rolls in sunlight', days: 5 },
        { num: 4, description: 'Complete shadow transformation, death imminent', days: 10 }
      ],
      cureComponents: ['Holy water', 'Divine ritual', 'Light magic'],
      cureSpells: ['Dispel Magic', 'Greater Restoration', 'Holy Aura']
    },
    sporelung: {
      id: 'sporelung',
      name: 'Sporelung',
      description: 'A fungal infection that colonizes the lungs',
      symptoms: ['Violent coughing', 'Wheezing', 'Spore clouds', 'Chest pain'],
      transmission: 'airborne',
      incubationDays: 3,
      severity: 'severe',
      dc: 12,
      mortalityRate: 0.18,
      stages: [
        { num: 1, description: 'Slight persistent cough', days: 2 },
        { num: 2, description: 'Difficulty breathing, disadvantage on stamina', days: 3 },
        { num: 3, description: 'Spore production, spreads to nearby creatures', days: 4 },
        { num: 4, description: 'Lung failure, death without intervention', days: 7 }
      ],
      cureComponents: ['Antifungal herbs', 'Dry environment', 'Healing potions'],
      cureSpells: ['Lesser Restoration', 'Cure Disease']
    }
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const calculateSpreadRate = (outbreak) => {
    let rate = outbreak.dailyRate || 0.15;
    if (outbreak.quarantined) rate *= 0.3;
    if (outbreak.sanitation === 'poor') rate *= 1.5;
    if (outbreak.sanitation === 'excellent') rate *= 0.5;
    if (outbreak.season === 'winter') rate *= 1.2;
    if (outbreak.season === 'summer') rate *= 0.8;
    return Math.min(rate, 0.9);
  };

  const getDisease = (diseaseId) => {
    return DISEASE_LIBRARY[diseaseId] || null;
  };

  const getSeverityColor = (severity) => {
    const colors = {
      mild: '#10b981',
      moderate: '#f59e0b',
      severe: '#ef4444',
      deadly: '#991b1b'
    };
    return colors[severity] || '#6b7280';
  };

  const getOutbreakSeverity = (infected, population) => {
    const ratio = infected / population;
    if (ratio > 0.2) return 'pandemic';
    if (ratio > 0.1) return 'epidemic';
    if (ratio > 0.02) return 'spreading';
    return 'contained';
  };

  // ============================================================================
  // MAIN COMPONENT
  // ============================================================================

  function PlagueTrackerView({ data, setData, viewRole }) {
    const plague = data.plague || {};
    const isDM = viewRole === 'dm' || viewRole === 'dm-view';
    const [activeTab, setActiveTab] = useState('outbreaks');
    const [editingDisease, setEditingDisease] = useState(null);
    const [expandedOutbreak, setExpandedOutbreak] = useState(null);
    const [showNewDiseaseForm, setShowNewDiseaseForm] = useState(false);

    // Initialize plague data structure
    const ensurePlagueData = useCallback(() => {
      if (!plague.outbreaks) {
        setData(prev => {
          const d = { ...prev };
          d.plague = {
            outbreaks: [],
            patients: [],
            exposureLog: [],
            customDiseases: {},
            mutations: [],
            cureProgress: {}
          };
          return d;
        });
      }
    }, [plague, setData]);

    useEffect(() => {
      if (!plague.outbreaks) {
        ensurePlagueData();
      }
    }, [plague, ensurePlagueData]);

    // Add or update outbreak
    const toggleOutbreak = useCallback((location, diseaseId) => {
      setData(prev => {
        const d = { ...prev };
        if (!d.plague) d.plague = {};
        if (!d.plague.outbreaks) d.plague.outbreaks = [];

        const existingIdx = d.plague.outbreaks.findIndex(
          o => o.location === location && o.diseaseId === diseaseId
        );

        if (existingIdx >= 0) {
          d.plague.outbreaks.splice(existingIdx, 1);
        } else {
          d.plague.outbreaks.push({
            id: Math.random().toString(36).substr(2, 9),
            location,
            diseaseId,
            infectedCount: 1,
            population: 5000,
            daysSince: 0,
            quarantined: false,
            sanitation: 'normal',
            season: 'spring',
            dailyRate: 0.15,
            createdAt: new Date().toISOString()
          });
        }
        return d;
      });
    }, [setData]);

    // Add patient
    const addPatient = useCallback((name, diseaseId) => {
      setData(prev => {
        const d = { ...prev };
        if (!d.plague) d.plague = {};
        if (!d.plague.patients) d.plague.patients = [];

        d.plague.patients.push({
          id: Math.random().toString(36).substr(2, 9),
          name,
          diseaseId,
          currentStage: 1,
          successSaves: 0,
          failedSaves: 0,
          treatments: [],
          exposedAt: new Date().toISOString(),
          status: 'infected'
        });
        return d;
      });
    }, [setData]);

    // Update patient stage
    const updatePatientStage = useCallback((patientId, stage) => {
      setData(prev => {
        const d = { ...prev };
        const patient = d.plague.patients.find(p => p.id === patientId);
        if (patient) {
          patient.currentStage = Math.min(Math.max(stage, 1), 4);
        }
        return d;
      });
    }, [setData]);

    // Update patient save
    const updatePatientSave = useCallback((patientId, type) => {
      setData(prev => {
        const d = { ...prev };
        const patient = d.plague.patients.find(p => p.id === patientId);
        if (patient) {
          if (type === 'success') patient.successSaves++;
          else patient.failedSaves++;
        }
        return d;
      });
    }, [setData]);

    // Add treatment
    const addTreatment = useCallback((patientId, treatment) => {
      setData(prev => {
        const d = { ...prev };
        const patient = d.plague.patients.find(p => p.id === patientId);
        if (patient) {
          patient.treatments.push({
            type: treatment,
            date: new Date().toISOString()
          });
        }
        return d;
      });
    }, [setData]);

    // Advance day
    const advanceDay = useCallback(() => {
      setData(prev => {
        const d = { ...prev };
        if (!d.plague) d.plague = {};

        // Process each outbreak
        (d.plague.outbreaks || []).forEach(outbreak => {
          const rate = calculateSpreadRate(outbreak);
          const newInfected = Math.floor(outbreak.infectedCount * rate);
          outbreak.infectedCount = Math.min(
            outbreak.infectedCount + newInfected,
            outbreak.population
          );
          outbreak.daysSince++;

          // Random mutation
          if (Math.random() < 0.05) {
            if (!d.plague.mutations) d.plague.mutations = [];
            d.plague.mutations.push({
              outbreak: outbreak.location,
              disease: outbreak.diseaseId,
              severity: Math.random() > 0.5 ? 'increased' : 'decreased',
              date: new Date().toISOString()
            });
            outbreak.dailyRate += (Math.random() - 0.5) * 0.05;
          }
        });

        // Progress patient stages
        (d.plague.patients || []).forEach(patient => {
          if (patient.status === 'infected' && Math.random() < 0.2) {
            patient.currentStage = Math.min(patient.currentStage + 1, 4);
            if (patient.currentStage === 4 && Math.random() < 0.3) {
              patient.status = 'deceased';
            }
          }
        });

        return d;
      });
    }, [setData]);

    // Save custom disease
    const saveCustomDisease = useCallback((disease) => {
      setData(prev => {
        const d = { ...prev };
        if (!d.plague) d.plague = {};
        if (!d.plague.customDiseases) d.plague.customDiseases = {};
        d.plague.customDiseases[disease.id] = disease;
        return d;
      });
      setEditingDisease(null);
      setShowNewDiseaseForm(false);
    }, [setData]);

    // Get all available diseases
    const allDiseases = useMemo(() => {
      return {
        ...DISEASE_LIBRARY,
        ...(plague.customDiseases || {})
      };
    }, [plague.customDiseases]);

    if (!plague.outbreaks) {
      return (
        <div style={{ padding: '20px', color: 'var(--text)' }}>
          <p>Initializing plague tracker...</p>
        </div>
      );
    }

    // ========================================================================
    // RENDER: OUTBREAKS TAB
    // ========================================================================

    const OutbreaksTab = () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Outbreak Summary */}
        {plague.outbreaks && plague.outbreaks.length > 0 && (
          <div style={{
            background: 'var(--surface)',
            border: `2px solid ${T.border || 'var(--border)'}`,
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'var(--gold)', fontSize: '16px' }}>
              Active Outbreaks: {plague.outbreaks.length}
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              {plague.outbreaks.map(outbreak => {
                const disease = allDiseases[outbreak.diseaseId];
                const severity = getOutbreakSeverity(outbreak.infectedCount, outbreak.population);
                const severityColor = getSeverityColor(disease?.severity || 'mild');
                return (
                  <div
                    key={outbreak.id}
                    onClick={() => setExpandedOutbreak(
                      expandedOutbreak?.id === outbreak.id ? null : outbreak
                    )}
                    style={{
                      background: 'var(--bg)',
                      border: `1px solid ${severityColor}40`,
                      borderRadius: '6px',
                      padding: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      {Bug && <Bug size={16} style={{ color: severityColor }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', color: 'var(--gold)' }}>
                          {outbreak.location}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                          {disease?.name || 'Unknown Disease'}
                        </div>
                      </div>
                      <div style={{
                        fontSize: '12px',
                        padding: '2px 6px',
                        background: severityColor + '20',
                        borderRadius: '3px',
                        color: severityColor
                      }}>
                        {severity}
                      </div>
                    </div>
                    <div style={{
                      background: 'var(--bg)',
                      height: '6px',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      marginBottom: '8px'
                    }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${(outbreak.infectedCount / outbreak.population) * 100}%`,
                          background: severityColor,
                          transition: 'width 0.3s',
                          animation: severity === 'pandemic' ? 'pulse 1.5s infinite' : 'none'
                        }}
                      />
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {outbreak.infectedCount} / {outbreak.population} infected
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Expanded Outbreak Details */}
        {expandedOutbreak && (
          <div style={{
            background: 'var(--surface)',
            border: `1px solid var(--gold)`,
            borderRadius: '8px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, color: 'var(--gold)' }}>
                {expandedOutbreak.location} - {allDiseases[expandedOutbreak.diseaseId]?.name}
              </h4>
              {isDM && (
                <button
                  onClick={() => toggleOutbreak(expandedOutbreak.location, expandedOutbreak.diseaseId)}
                  style={{
                    background: 'var(--crimson)',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  End Outbreak
                </button>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '12px',
              marginBottom: '12px'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Days Active</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--gold)' }}>
                  {expandedOutbreak.daysSince}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Daily Spread Rate</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--gold)' }}>
                  {(calculateSpreadRate(expandedOutbreak) * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Sanitation</div>
                <div style={{ fontSize: '14px', color: 'var(--text)' }}>
                  {expandedOutbreak.sanitation}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Quarantine</div>
                <div style={{ fontSize: '14px', color: expandedOutbreak.quarantined ? '#10b981' : 'var(--crimson)' }}>
                  {expandedOutbreak.quarantined ? 'Active' : 'None'}
                </div>
              </div>
            </div>

            {isDM && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    setData(prev => {
                      const d = { ...prev };
                      const ob = d.plague.outbreaks.find(o => o.id === expandedOutbreak.id);
                      if (ob) ob.quarantined = !ob.quarantined;
                      return d;
                    });
                  }}
                  style={{
                    background: expandedOutbreak.quarantined ? '#10b981' : 'var(--surface)',
                    color: expandedOutbreak.quarantined ? 'white' : 'var(--gold)',
                    border: `1px solid var(--gold)`,
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {expandedOutbreak.quarantined ? 'Lift' : 'Enforce'} Quarantine
                </button>
                <select
                  value={expandedOutbreak.sanitation}
                  onChange={(e) => {
                    setData(prev => {
                      const d = { ...prev };
                      const ob = d.plague.outbreaks.find(o => o.id === expandedOutbreak.id);
                      if (ob) ob.sanitation = e.target.value;
                      return d;
                    });
                  }}
                  style={{
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    border: `1px solid var(--gold)`,
                    padding: '6px 8px',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}
                >
                  <option value="poor">Poor Sanitation</option>
                  <option value="normal">Normal Sanitation</option>
                  <option value="excellent">Excellent Sanitation</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Create Outbreak */}
        {isDM && (
          <div style={{
            background: 'var(--surface)',
            border: `1px dashed var(--gold)`,
            borderRadius: '8px',
            padding: '12px'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px' }}>
              + New Outbreak
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
              {Object.entries(allDiseases).map(([id, disease]) => (
                <button
                  key={id}
                  onClick={() => toggleOutbreak('New Region', id)}
                  style={{
                    background: 'var(--bg)',
                    color: 'var(--gold)',
                    border: `1px solid var(--gold)`,
                    padding: '8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    transition: 'all 0.2s'
                  }}
                >
                  {disease.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    // ========================================================================
    // RENDER: PATIENTS TAB
    // ========================================================================

    const PatientsTab = () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {plague.patients && plague.patients.map(patient => {
          const disease = allDiseases[patient.diseaseId];
          const stage = disease?.stages[patient.currentStage - 1];
          const isCritical = patient.currentStage === 4;

          return (
            <div
              key={patient.id}
              style={{
                background: 'var(--surface)',
                border: `2px solid ${isCritical ? 'var(--crimson)' : 'var(--border)'}`,
                borderRadius: '8px',
                padding: '14px',
                animation: isCritical ? 'pulse 1s infinite' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text)' }}>
                    {patient.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                    {disease?.name || 'Unknown'} - Stage {patient.currentStage}/4
                  </div>
                </div>
                <div style={{
                  background: getSeverityColor(disease?.severity) + '20',
                  color: getSeverityColor(disease?.severity),
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {patient.status.toUpperCase()}
                </div>
              </div>

              {stage && (
                <div style={{
                  background: 'var(--bg)',
                  padding: '8px',
                  borderRadius: '4px',
                  marginBottom: '12px',
                  fontSize: '12px',
                  color: 'var(--text-dim)',
                  borderLeft: `3px solid ${getSeverityColor(disease?.severity)}`
                }}>
                  {stage.description}
                </div>
              )}

              {/* Constitution Saves */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  Constitution Saves (DC {disease?.dc || 10})
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {Array(patient.successSaves).fill(null).map((_, i) => (
                      <div
                        key={`s${i}`}
                        style={{
                          width: '16px',
                          height: '16px',
                          background: '#10b981',
                          borderRadius: '2px'
                        }}
                      />
                    ))}
                    {Array(patient.failedSaves).fill(null).map((_, i) => (
                      <div
                        key={`f${i}`}
                        style={{
                          width: '16px',
                          height: '16px',
                          background: 'var(--crimson)',
                          borderRadius: '2px'
                        }}
                      />
                    ))}
                  </div>
                  {isDM && patient.status === 'infected' && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => updatePatientSave(patient.id, 'success')}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        +Success
                      </button>
                      <button
                        onClick={() => updatePatientSave(patient.id, 'failure')}
                        style={{
                          background: 'var(--crimson)',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        +Fail
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Stage Progress */}
              {isDM && patient.status === 'infected' && (
                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                  {[1, 2, 3, 4].map(s => (
                    <button
                      key={s}
                      onClick={() => updatePatientStage(patient.id, s)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        background: patient.currentStage >= s ? 'var(--gold)' : 'var(--bg)',
                        color: patient.currentStage >= s ? 'black' : 'var(--text-dim)',
                        border: `1px solid var(--gold)`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Treatments */}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  Treatments Applied
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {patient.treatments.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--bg)',
                        padding: '4px 8px',
                        borderRadius: '3px',
                        fontSize: '11px',
                        color: 'var(--gold)',
                        border: `1px solid var(--gold)`
                      }}
                    >
                      {t.type}
                    </div>
                  ))}
                </div>
                {isDM && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => addTreatment(patient.id, 'Herbalism')}
                      style={{
                        background: 'var(--bg)',
                        color: 'var(--gold)',
                        border: `1px solid var(--gold)`,
                        padding: '4px 8px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      +Herbs
                    </button>
                    <button
                      onClick={() => addTreatment(patient.id, 'Potion')}
                      style={{
                        background: 'var(--bg)',
                        color: 'var(--gold)',
                        border: `1px solid var(--gold)`,
                        padding: '4px 8px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      +Potion
                    </button>
                    <button
                      onClick={() => addTreatment(patient.id, 'Spell')}
                      style={{
                        background: 'var(--bg)',
                        color: 'var(--gold)',
                        border: `1px solid var(--gold)`,
                        padding: '4px 8px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      +Spell
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isDM && (
          <div style={{
            background: 'var(--surface)',
            border: `1px dashed var(--gold)`,
            borderRadius: '8px',
            padding: '12px'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '12px' }}>
              + Add Patient
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
              {Object.entries(allDiseases).map(([id, disease]) => (
                <button
                  key={id}
                  onClick={() => addPatient('New Patient', id)}
                  style={{
                    background: 'var(--bg)',
                    color: 'var(--gold)',
                    border: `1px solid var(--gold)`,
                    padding: '8px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  {disease.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    // ========================================================================
    // RENDER: DISEASES TAB
    // ========================================================================

    const DiseasesTab = () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.entries(allDiseases).map(([id, disease]) => (
          <div
            key={id}
            style={{
              background: 'var(--surface)',
              border: `1px solid ${getSeverityColor(disease.severity)}40`,
              borderLeft: `3px solid ${getSeverityColor(disease.severity)}`,
              borderRadius: '6px',
              padding: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--gold)' }}>
                  {disease.name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '2px' }}>
                  {disease.description}
                </div>
              </div>
              <div style={{
                background: getSeverityColor(disease.severity) + '20',
                color: getSeverityColor(disease.severity),
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap'
              }}>
                {disease.severity.toUpperCase()}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', fontSize: '11px', marginBottom: '8px' }}>
              <div>
                <div style={{ color: 'var(--text-dim)' }}>Transmission</div>
                <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{disease.transmission}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)' }}>Incubation</div>
                <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{disease.incubationDays} days</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)' }}>DC to Resist</div>
                <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{disease.dc}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-dim)' }}>Mortality</div>
                <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{(disease.mortalityRate * 100).toFixed(0)}%</div>
              </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '4px' }}>Cure Components</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {disease.cureComponents.map((comp, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--bg)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontSize: '10px',
                      color: 'var(--text-dim)',
                      border: `1px solid var(--border)`
                    }}
                  >
                    {comp}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );

    // ========================================================================
    // RENDER: SIMULATION TAB
    // ========================================================================

    const SimulationTab = () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Control Panel */}
        <div style={{
          background: 'var(--surface)',
          border: `1px solid var(--gold)`,
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: 'var(--gold)' }}>Time Control</h3>
          {isDM && (
            <button
              onClick={advanceDay}
              style={{
                background: 'var(--gold)',
                color: 'black',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              Advance 1 Day
            </button>
          )}
          {!isDM && (
            <div style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
              Only DMs can advance the simulation
            </div>
          )}
        </div>

        {/* Mutations Log */}
        {plague.mutations && plague.mutations.length > 0 && (
          <div style={{
            background: 'var(--surface)',
            border: `1px solid var(--crimson)`,
            borderRadius: '8px',
            padding: '16px'
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'var(--crimson)' }}>Recent Mutations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {plague.mutations.slice(-5).reverse().map((mut, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg)',
                    padding: '8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    borderLeft: `3px solid ${mut.severity === 'increased' ? 'var(--crimson)' : '#10b981'}`
                  }}
                >
                  <div style={{ color: 'var(--gold)', fontWeight: 'bold' }}>
                    {mut.disease} in {mut.location}
                  </div>
                  <div style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
                    Virulence {mut.severity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simulation Stats */}
        <div style={{
          background: 'var(--surface)',
          border: `1px dashed var(--border)`,
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: 'var(--text)' }}>Campaign Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Total Outbreaks
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--gold)' }}>
                {plague.outbreaks?.length || 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Infected Patients
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--crimson)' }}>
                {plague.patients?.filter(p => p.status === 'infected').length || 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Deceased
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                {plague.patients?.filter(p => p.status === 'deceased').length || 0}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px' }}>
                Total Mutations
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)' }}>
                {plague.mutations?.length || 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    // ========================================================================
    // MAIN RENDER
    // ========================================================================

    return (
      <div style={{
        background: T.bg || 'var(--bg)',
        color: T.text || 'var(--text)',
        fontFamily: T.ui || 'system-ui, sans-serif',
        minHeight: '100vh',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '24px', borderBottom: `1px solid var(--border)`, paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            {Skull && <Skull size={32} style={{ color: 'var(--crimson)' }} />}
            <h1 style={{ margin: 0, color: 'var(--gold)', fontSize: '28px', fontFamily: T.heading || 'serif' }}>
              Plague & Contagion Tracker
            </h1>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
            Manage diseases, track outbreaks, and monitor patient progression
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '20px',
          borderBottom: `1px solid var(--border)`,
          paddingBottom: '12px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'outbreaks', label: 'Outbreaks', icon: Activity },
            { id: 'patients', label: 'Patients', icon: Heart },
            { id: 'diseases', label: 'Diseases', icon: Bug },
            { id: 'simulation', label: 'Simulation', icon: Thermometer }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--gold)' : 'transparent',
                color: activeTab === tab.id ? 'black' : 'var(--text-dim)',
                border: `1px solid ${activeTab === tab.id ? 'var(--gold)' : 'var(--border)'}`,
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {tab.icon && tab.icon({ size: 16 })}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ animation: 'fadeIn 0.2s' }}>
          {activeTab === 'outbreaks' && <OutbreaksTab />}
          {activeTab === 'patients' && <PatientsTab />}
          {activeTab === 'diseases' && <DiseasesTab />}
          {activeTab === 'simulation' && <SimulationTab />}
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  // ============================================================================
  // REGISTER COMPONENT
  // ============================================================================

  window.PlagueTrackerView = PlagueTrackerView;

})();
