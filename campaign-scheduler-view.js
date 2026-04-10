window.CampaignSchedulerView = function CampaignSchedulerView({ data, setData, viewRole, campaignMembers }) {
  const T = window.__PHMURT_THEME || {
    bg: "var(--bg)", bgNav: "var(--bg-nav)", bgCard: "var(--bg-card)", bgHover: "var(--bg-hover)",
    bgMid: "var(--bg-mid)", bgInput: "var(--bg-input)", text: "var(--text)", textDim: "var(--text-dim)",
    textMuted: "var(--text-muted)", textFaint: "var(--text-faint)", crimson: "var(--crimson)",
    crimsonDim: "var(--crimson-dim)", crimsonBorder: "var(--crimson-border)", border: "var(--border)",
    borderMid: "var(--border-mid)", gold: "var(--gold)", goldDim: "var(--gold-dim)",
    green: "var(--green)", greenDim: "var(--green-dim)",
    heading: "'Cinzel', serif", body: "'Spectral', serif", ui: "'Cinzel', serif"
  };
  try { if (window.T) Object.assign(T, window.T); } catch(e) {}

  const [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [showAvailEditor, setShowAvailEditor] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = React.useState({ start: 19, end: 22 });
  const [expandedPastSessions, setExpandedPastSessions] = React.useState(false);
  const [currentPlayerAvail, setCurrentPlayerAvail] = React.useState({});

  const scheduler = data._scheduler || { players: {}, sessions: [], settings: {} };
  const party = data.party || [];
  const isDM = viewRole === 'dm';
  const currentPlayer = campaignMembers.find(m => m.role !== 'dm'); // For demo, use first non-DM

  // Get next session
  const now = new Date();
  const upcomingSessions = scheduler.sessions
    .filter(s => new Date(s.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextSession = upcomingSessions[0];

  // Calculate countdown timer
  const getCountdown = (dateStr) => {
    const target = new Date(dateStr);
    const diff = target - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `In ${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  // Calendar generation (Sun-Sat, 10am-midnight)
  const getWeekCalendar = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const days = [];
    const hours = Array.from({ length: 15 }, (_, i) => 10 + i);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push({ date: day, dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()] });
    }

    return { days, hours };
  };

  // Get availability color for a time slot
  const getAvailabilityColor = (dayIdx, hour) => {
    const playersAvail = Object.entries(scheduler.players || {})
      .filter(([, avail]) => avail && avail[dayIdx] && avail[dayIdx].includes(hour))
      .length;

    const totalPlayers = Object.keys(scheduler.players || {}).length || 1;
    const ratio = playersAvail / totalPlayers;

    if (ratio === 1) return T.gold;
    if (ratio >= 0.66) return T.green;
    if (ratio > 0) return T.gold;
    return T.textFaint;
  };

  // Handle availability preset
  const applyPreset = (preset) => {
    const newAvail = {};
    const { days, hours } = getWeekCalendar();

    switch (preset) {
      case 'weekday_evenings':
        days.forEach((d, i) => {
          if (i >= 1 && i <= 5) newAvail[i] = [19, 20, 21, 22];
        });
        break;
      case 'weekend_afternoons':
        newAvail[0] = [14, 15, 16, 17, 18];
        newAvail[6] = [14, 15, 16, 17, 18];
        break;
      case 'friday_night':
        newAvail[5] = [19, 20, 21, 22, 23];
        break;
    }
    setCurrentPlayerAvail(newAvail);
  };

  // Find best time slots
  const findBestTimes = () => {
    const { days, hours } = getWeekCalendar();
    const slots = [];

    days.forEach((d, dayIdx) => {
      hours.forEach(hour => {
        const playersAvail = Object.entries(scheduler.players || {})
          .filter(([, avail]) => avail && avail[dayIdx] && avail[dayIdx].includes(hour))
          .length;

        slots.push({ dayIdx, hour, count: playersAvail });
      });
    });

    return slots.sort((a, b) => b.count - a.count).slice(0, 3);
  };

  // Schedule new session
  const handleScheduleSession = () => {
    if (!selectedDate) return;

    const newSession = {
      id: `session_${Date.now()}`,
      date: selectedDate.toISOString(),
      time: `${String(selectedTimeRange.start).padStart(2, '0')}:00`,
      notes: '',
      attendees: [],
      recurring: null
    };

    setData(d => ({
      ...d,
      _scheduler: {
        ...d._scheduler,
        sessions: [...(d._scheduler.sessions || []), newSession]
      }
    }));

    setShowScheduleModal(false);
    setSelectedDate(null);
  };

  // Save player availability
  const handleSaveAvailability = () => {
    setData(d => ({
      ...d,
      _scheduler: {
        ...d._scheduler,
        players: {
          ...d._scheduler.players,
          [currentPlayer?.user_id]: currentPlayerAvail
        }
      }
    }));
    setShowAvailEditor(false);
  };

  // Get player stats
  const getPlayerStats = (playerId) => {
    const playerSessions = scheduler.sessions.filter(s =>
      s.attendees && s.attendees.includes(playerId)
    );
    const attended = playerSessions.length;
    const total = Math.max(scheduler.sessions.length, 1);
    const percentage = Math.round((attended / total) * 100);

    return {
      attended,
      total,
      percentage,
      lastAttended: playerSessions.length > 0
        ? new Date(playerSessions[playerSessions.length - 1].date).toLocaleDateString()
        : 'Never'
    };
  };

  // Render components
  const { days, hours } = getWeekCalendar();
  const bestTimes = findBestTimes();

  return React.createElement('div', {
    style: {
      display: 'flex',
      gap: '20px',
      padding: '20px',
      backgroundColor: T.bg,
      color: T.text,
      minHeight: '100vh',
      fontFamily: T.body,
      fontSize: '14px'
    }
  },
    // LEFT PANEL - Upcoming Sessions
    React.createElement('div', {
      style: {
        flex: '0 0 300px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxHeight: '100vh',
        overflowY: 'auto'
      }
    },
      // Next Session Card
      nextSession && React.createElement('div', {
        style: {
          backgroundColor: T.bgCard,
          border: `2px solid ${T.crimson}`,
          borderRadius: '8px',
          padding: '20px',
          boxShadow: "0 0 20px " + T.crimsonDim
        }
      },
        React.createElement('div', { style: { fontSize: '12px', color: T.gold, fontWeight: 'bold', marginBottom: '8px' } }, 'NEXT SESSION'),
        React.createElement('div', { style: { fontSize: '18px', fontFamily: T.heading, marginBottom: '8px', color: T.gold } },
          new Date(nextSession.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        ),
        React.createElement('div', { style: { fontSize: '14px', color: T.textMuted, marginBottom: '12px' } }, getCountdown(nextSession.date)),
        React.createElement('div', { style: { fontSize: '12px', color: T.textMuted, marginBottom: '12px' } },
          `${nextSession.time || '19:00'} • ${(nextSession.attendees || []).length} expected`
        ),
        React.createElement('div', {
          style: {
            display: 'flex',
            gap: '8px',
            marginBottom: '15px',
            flexWrap: 'wrap'
          }
        },
          (nextSession.attendees || []).map((attendeeId, idx) =>
            React.createElement('div', {
              key: attendeeId,
              style: {
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: T.crimson,
                color: T.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 'bold',
                border: `2px solid ${T.crimson}`
              }
            }, attendeeId.substring(0, 2).toUpperCase())
          )
        ),
        React.createElement('textarea', {
          placeholder: 'Session notes...',
          value: nextSession.notes || '',
          onChange: (e) => {
            const updated = scheduler.sessions.map(s =>
              s.id === nextSession.id ? { ...s, notes: e.target.value } : s
            );
            setData(d => ({ ...d, _scheduler: { ...d._scheduler, sessions: updated } }));
          },
          style: {
            width: '100%',
            padding: '8px',
            backgroundColor: T.bgHover,
            border: `1px solid ${T.border}`,
            borderRadius: '4px',
            color: T.text,
            fontSize: '12px',
            fontFamily: T.body,
            resize: 'vertical',
            minHeight: '60px',
            boxSizing: 'border-box'
          }
        })
      ),

      // Future Sessions List
      upcomingSessions.slice(1, 5).length > 0 && React.createElement('div', {},
        React.createElement('div', { style: { fontSize: '12px', color: T.gold, fontWeight: 'bold', marginBottom: '10px' } }, 'UPCOMING'),
        upcomingSessions.slice(1, 5).map(session =>
          React.createElement('div', {
            key: session.id,
            style: {
              backgroundColor: T.bgCard,
              border: `1px solid ${T.border}`,
              borderRadius: '6px',
              padding: '12px',
              fontSize: '12px'
            }
          },
            React.createElement('div', { style: { color: T.gold, fontWeight: 'bold', marginBottom: '4px' } },
              new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            ),
            React.createElement('div', { style: { color: T.textMuted } }, session.time || '19:00'),
            React.createElement('div', { style: { color: T.textFaint, marginTop: '4px' } },
              `${(session.attendees || []).length} attending`
            )
          )
        )
      ),

      // Schedule New Session Button
      isDM && React.createElement('button', {
        onClick: () => setShowScheduleModal(true),
        style: {
          padding: '12px 16px',
          backgroundColor: T.crimson,
          color: T.bg,
          border: 'none',
          borderRadius: '6px',
          fontFamily: T.ui,
          fontSize: '13px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: 'auto',
          transition: 'all 0.3s'
        },
        onMouseEnter: (e) => e.target.style.backgroundColor = T.crimson,
        onMouseLeave: (e) => e.target.style.backgroundColor = T.crimson
      }, '+ SCHEDULE SESSION'),

      // Past Sessions
      scheduler.sessions.filter(s => new Date(s.date) < now).length > 0 && React.createElement('div', {},
        React.createElement('button', {
          onClick: () => setExpandedPastSessions(!expandedPastSessions),
          style: {
            width: '100%',
            padding: '10px',
            backgroundColor: 'transparent',
            border: `1px solid ${T.border}`,
            color: T.textMuted,
            borderRadius: '4px',
            fontFamily: T.ui,
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }
        }, expandedPastSessions ? '▼ PAST SESSIONS' : '▶ PAST SESSIONS'),
        expandedPastSessions && scheduler.sessions
          .filter(s => new Date(s.date) < now)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
          .map(session =>
            React.createElement('div', {
              key: session.id,
              style: {
                backgroundColor: T.bgNav,
                border: `1px solid ${T.textFaint}`,
                borderRadius: '4px',
                padding: '10px',
                marginTop: '8px',
                fontSize: '11px'
              }
            },
              React.createElement('div', { style: { color: T.textMuted, marginBottom: '6px' } },
                new Date(session.date).toLocaleDateString()
              ),
              React.createElement('div', { style: { color: T.textFaint, lineHeight: '1.4', maxHeight: '60px', overflow: 'hidden' } },
                session.recap || 'No recap recorded.'
              )
            )
          )
      )
    ),

    // CENTER PANEL - Availability Calendar
    React.createElement('div', {
      style: {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }
    },
      React.createElement('div', {
        style: {
          backgroundColor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '8px',
          padding: '20px'
        }
      },
        React.createElement('div', { style: { fontSize: '14px', fontFamily: T.heading, fontWeight: 'bold', marginBottom: '15px', color: T.gold } },
          'AVAILABILITY CALENDAR'
        ),

        // Preset buttons
        React.createElement('div', {
          style: { display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }
        },
          ['Weekday Evenings', 'Weekend Afternoons', 'Friday Night'].map(label =>
            React.createElement('button', {
              key: label,
              onClick: () => applyPreset(label.toLowerCase().replace(/\s/g, '_')),
              style: {
                padding: '6px 12px',
                backgroundColor: T.crimsonDim,
                border: `1px solid ${T.crimson}`,
                color: T.gold,
                borderRadius: '4px',
                fontFamily: T.ui,
                fontSize: '11px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s'
              },
              onMouseEnter: (e) => e.target.style.backgroundColor = T.crimsonBorder,
              onMouseLeave: (e) => e.target.style.backgroundColor = T.crimsonDim
            }, label)
          )
        ),

        React.createElement('button', {
          onClick: () => setShowAvailEditor(!showAvailEditor),
          style: {
            padding: '8px 12px',
            backgroundColor: T.crimson,
            color: T.bg,
            border: 'none',
            borderRadius: '4px',
            fontFamily: T.ui,
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginBottom: '15px'
          }
        }, showAvailEditor ? '▼ EDIT MY AVAILABILITY' : '▶ EDIT MY AVAILABILITY'),

        // Availability Editor
        showAvailEditor && React.createElement('div', {
          style: {
            backgroundColor: T.bgHover,
            borderRadius: '6px',
            padding: '15px',
            marginBottom: '15px',
            border: `1px solid ${T.border}`
          }
        },
          React.createElement('div', { style: { fontSize: '12px', color: T.textMuted, marginBottom: '12px' } }, 'Click and drag to mark your availability'),
          React.createElement('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: `60px repeat(7, 1fr)`,
              gap: '1px',
              backgroundColor: T.textFaint,
              padding: '1px',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '15px'
            }
          },
            React.createElement('div', { style: { backgroundColor: T.bgCard, padding: '6px', fontSize: '10px', fontWeight: 'bold', color: T.textMuted } }),
            ...days.map(d =>
              React.createElement('div', {
                key: d.dayName,
                style: {
                  backgroundColor: T.bgCard,
                  padding: '6px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: T.gold
                }
              }, d.dayName)
            ),
            ...hours.flatMap(hour =>
              [
                React.createElement('div', {
                  key: `hour-${hour}`,
                  style: {
                    backgroundColor: T.bgCard,
                    padding: '4px',
                    fontSize: '9px',
                    color: T.textFaint,
                    textAlign: 'right',
                    fontWeight: 'bold'
                  }
                }, `${hour}:00`),
                ...days.map((d, dayIdx) =>
                  React.createElement('div', {
                    key: `${dayIdx}-${hour}`,
                    onClick: () => {
                      const updated = { ...currentPlayerAvail };
                      if (!updated[dayIdx]) updated[dayIdx] = [];
                      const idx = updated[dayIdx].indexOf(hour);
                      if (idx > -1) {
                        updated[dayIdx].splice(idx, 1);
                        if (updated[dayIdx].length === 0) delete updated[dayIdx];
                      } else {
                        updated[dayIdx].push(hour);
                        updated[dayIdx].sort((a, b) => a - b);
                      }
                      setCurrentPlayerAvail(updated);
                    },
                    style: {
                      backgroundColor: currentPlayerAvail[dayIdx] && currentPlayerAvail[dayIdx].includes(hour) ? T.crimsonDim : T.bgCard,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      opacity: 0.8
                    },
                    onMouseEnter: (e) => e.target.style.opacity = 1,
                    onMouseLeave: (e) => e.target.style.opacity = 0.8
                  })
                )
              ]
            )
          ),
          React.createElement('button', {
            onClick: handleSaveAvailability,
            style: {
              padding: '8px 16px',
              backgroundColor: T.crimson,
              color: T.bg,
              border: 'none',
              borderRadius: '4px',
              fontFamily: T.ui,
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }
          }, 'SAVE AVAILABILITY')
        ),

        // Calendar Grid
        React.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: `60px repeat(7, 1fr)`,
            gap: '2px',
            backgroundColor: T.textFaint,
            padding: '2px',
            borderRadius: '4px',
            overflow: 'hidden'
          }
        },
          React.createElement('div', { style: { backgroundColor: T.bgCard, padding: '8px', fontSize: '10px', fontWeight: 'bold', color: T.textMuted } }),
          ...days.map(d =>
            React.createElement('div', {
              key: d.dayName,
              style: {
                backgroundColor: T.bgCard,
                padding: '8px',
                fontSize: '11px',
                fontWeight: 'bold',
                textAlign: 'center',
                color: T.gold
              }
            },
              React.createElement('div', {}, d.dayName),
              React.createElement('div', { style: { fontSize: '9px', color: T.textMuted } },
                d.date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
              )
            )
          ),
          ...hours.flatMap(hour =>
            [
              React.createElement('div', {
                key: `hour-${hour}`,
                style: {
                  backgroundColor: T.bgCard,
                  padding: '6px',
                  fontSize: '9px',
                  color: T.textFaint,
                  textAlign: 'center',
                  fontWeight: 'bold'
                }
              }, `${hour}:00`),
              ...days.map((d, dayIdx) => {
                const color = getAvailabilityColor(dayIdx, hour);
                const isOptimal = bestTimes.some(t => t.dayIdx === dayIdx && t.hour === hour);
                return React.createElement('div', {
                  key: `cell-${dayIdx}-${hour}`,
                  title: `${d.dayName} ${hour}:00`,
                  style: {
                    backgroundColor: color,
                    cursor: 'pointer',
                    opacity: isOptimal ? 1 : 0.6,
                    border: isOptimal ? `2px solid ${T.gold}` : '1px solid transparent',
                    transition: 'all 0.2s'
                  },
                  onMouseEnter: (e) => e.target.style.opacity = 1,
                  onMouseLeave: (e) => e.target.style.opacity = isOptimal ? 1 : 0.6
                });
              })
            ]
          )
        ),

        React.createElement('button', {
          onClick: () => {
            const best = findBestTimes();
            if (best.length > 0) {
              const slot = best[0];
              const day = days[slot.dayIdx];
              setSelectedDate(day.date);
              setSelectedTimeRange({ start: slot.hour, end: slot.hour + 4 });
            }
          },
          style: {
            marginTop: '15px',
            padding: '8px 16px',
            backgroundColor: T.crimson,
            color: T.bg,
            border: 'none',
            borderRadius: '4px',
            fontFamily: T.ui,
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }
        }, 'FIND BEST TIME')
      )
    ),

    // RIGHT PANEL - Player Stats
    React.createElement('div', {
      style: {
        flex: '0 0 280px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        maxHeight: '100vh',
        overflowY: 'auto'
      }
    },
      // Player List
      React.createElement('div', {
        style: {
          backgroundColor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '8px',
          padding: '15px'
        }
      },
        React.createElement('div', { style: { fontSize: '12px', fontFamily: T.heading, fontWeight: 'bold', marginBottom: '12px', color: T.gold } },
          'ATTENDANCE'
        ),
        campaignMembers
          .filter(m => m.role !== 'dm')
          .map(member => {
            const stats = getPlayerStats(member.user_id);
            const character = party.find(p => p.name?.toLowerCase().includes(member.profiles?.name?.toLowerCase() || ''));
            return React.createElement('div', {
              key: member.user_id,
              style: {
                padding: '10px',
                backgroundColor: T.bgHover,
                borderRadius: '6px',
                marginBottom: '8px',
                fontSize: '11px'
              }
            },
              React.createElement('div', { style: { fontWeight: 'bold', color: T.gold, marginBottom: '4px' } },
                String(member.profiles?.name || 'Unknown').replace(/[<>]/g, '')
              ),
              React.createElement('div', { style: { color: T.textMuted, fontSize: '10px', marginBottom: '6px' } },
                character ? `${String(character.name || '').replace(/[<>]/g, '')} (${String(character.class || '').replace(/[<>]/g, '')})` : 'No character'
              ),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
                React.createElement('span', { style: { color: T.textFaint } }, `${stats.attended || 0}/${stats.total || 0} attended`),
                React.createElement('span', { style: { color: T.gold, fontWeight: 'bold' } }, `${stats.percentage || 0}%`)
              ),
              React.createElement('div', {
                style: {
                  width: '100%',
                  height: '6px',
                  backgroundColor: T.bgNav,
                  borderRadius: '3px',
                  overflow: 'hidden'
                }
              },
                React.createElement('div', {
                  style: {
                    height: '100%',
                    width: `${Math.max(0, Math.min(100, stats.percentage || 0))}%`,
                    background: T.crimson,
                    transition: 'width 0.3s'
                  }
                })
              ),
              React.createElement('div', { style: { color: T.textFaint, fontSize: '9px', marginTop: '4px' } },
                `Last: ${String(stats.lastAttended || 'Never').replace(/[<>]/g, '')}`
              )
            );
          })
      ),

      // Campaign Stats
      React.createElement('div', {
        style: {
          backgroundColor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '8px',
          padding: '15px'
        }
      },
        React.createElement('div', { style: { fontSize: '12px', fontFamily: T.heading, fontWeight: 'bold', marginBottom: '12px', color: T.gold } },
          'CAMPAIGN STATS'
        ),
        [
          { label: 'Total Sessions', value: scheduler.sessions.length },
          { label: 'Average Attendance', value: Math.round(scheduler.sessions.reduce((sum, s) => sum + (s.attendees?.length || 0), 0) / Math.max(scheduler.sessions.length, 1)) }
        ].map(stat =>
          React.createElement('div', {
            key: stat.label,
            style: { marginBottom: '10px', paddingBottom: '10px', borderBottom: `1px solid ${T.border}` }
          },
            React.createElement('div', { style: { fontSize: '10px', color: T.textMuted, marginBottom: '4px' } }, stat.label),
            React.createElement('div', { style: { fontSize: '18px', fontFamily: T.heading, color: T.gold, fontWeight: 'bold' } }, stat.value)
          )
        )
      ),

      // Last Session Recap
      scheduler.sessions.filter(s => new Date(s.date) < now).length > 0 && React.createElement('div', {
        style: {
          backgroundColor: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '8px',
          padding: '15px'
        }
      },
        React.createElement('div', { style: { fontSize: '11px', fontFamily: T.heading, fontWeight: 'bold', marginBottom: '10px', color: T.gold } },
          'LAST RECAP'
        ),
        React.createElement('div', { style: { fontSize: '11px', color: T.textFaint, lineHeight: '1.5' } },
          scheduler.sessions
            .filter(s => new Date(s.date) < now)
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0]?.recap || 'No recap available.'
        )
      )
    ),

    // SCHEDULE SESSION MODAL
    showScheduleModal && React.createElement('div', {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: T.bgNav,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      },
      onClick: () => setShowScheduleModal(false)
    },
      React.createElement('div', {
        onClick: (e) => e.stopPropagation(),
        style: {
          backgroundColor: T.bgCard,
          border: `2px solid ${T.crimson}`,
          borderRadius: '8px',
          padding: '30px',
          maxWidth: '500px',
          width: '90%'
        }
      },
        React.createElement('div', { style: { fontSize: '16px', fontFamily: T.heading, fontWeight: 'bold', marginBottom: '20px', color: T.gold } },
          'SCHEDULE NEW SESSION'
        ),
        React.createElement('div', { style: { marginBottom: '15px' } },
          React.createElement('label', { style: { display: 'block', fontSize: '12px', color: T.textMuted, marginBottom: '6px' } }, 'DATE'),
          React.createElement('input', {
            type: 'date',
            value: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
            onChange: (e) => {
              if (e.target.value) {
                const [year, month, day] = e.target.value.split('-');
                setSelectedDate(new Date(year, parseInt(month) - 1, day));
              } else {
                setSelectedDate(null);
              }
            },
            style: {
              width: '100%',
              padding: '8px',
              backgroundColor: T.bgHover,
              border: `1px solid ${T.border}`,
              borderRadius: '4px',
              color: T.text,
              fontFamily: T.body,
              boxSizing: 'border-box'
            }
          })
        ),
        React.createElement('div', { style: { marginBottom: '15px', display: 'flex', gap: '10px' } },
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('label', { style: { display: 'block', fontSize: '12px', color: T.textMuted, marginBottom: '6px' } }, 'START TIME'),
            React.createElement('select', {
              value: selectedTimeRange.start,
              onChange: (e) => setSelectedTimeRange({ ...selectedTimeRange, start: parseInt(e.target.value) }),
              style: {
                width: '100%',
                padding: '8px',
                backgroundColor: T.bgHover,
                border: `1px solid ${T.border}`,
                borderRadius: '4px',
                color: T.text,
                fontFamily: T.body
              }
            },
              hours.map(h => React.createElement('option', { key: h, value: h }, `${String(h).padStart(2, '0')}:00`))
            )
          ),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('label', { style: { display: 'block', fontSize: '12px', color: T.textMuted, marginBottom: '6px' } }, 'END TIME'),
            React.createElement('select', {
              value: selectedTimeRange.end,
              onChange: (e) => setSelectedTimeRange({ ...selectedTimeRange, end: parseInt(e.target.value) }),
              style: {
                width: '100%',
                padding: '8px',
                backgroundColor: T.bgHover,
                border: `1px solid ${T.border}`,
                borderRadius: '4px',
                color: T.text,
                fontFamily: T.body
              }
            },
              hours.map(h => React.createElement('option', { key: h, value: h }, `${String(h).padStart(2, '0')}:00`))
            )
          )
        ),
        React.createElement('div', { style: { marginBottom: '20px' } },
          React.createElement('label', { style: { display: 'block', fontSize: '12px', color: T.textMuted, marginBottom: '6px' } }, 'NOTES'),
          React.createElement('textarea', {
            placeholder: 'Session details...',
            style: {
              width: '100%',
              padding: '8px',
              backgroundColor: T.bgHover,
              border: `1px solid ${T.border}`,
              borderRadius: '4px',
              color: T.text,
              fontFamily: T.body,
              minHeight: '80px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }
          })
        ),
        React.createElement('div', { style: { display: 'flex', gap: '10px' } },
          React.createElement('button', {
            onClick: handleScheduleSession,
            style: {
              flex: 1,
              padding: '10px',
              backgroundColor: T.crimson,
              color: T.bg,
              border: 'none',
              borderRadius: '4px',
              fontFamily: T.ui,
              fontWeight: 'bold',
              cursor: 'pointer'
            }
          }, 'SCHEDULE'),
          React.createElement('button', {
            onClick: () => setShowScheduleModal(false),
            style: {
              flex: 1,
              padding: '10px',
              backgroundColor: 'transparent',
              border: `1px solid ${T.border}`,
              color: T.textMuted,
              borderRadius: '4px',
              fontFamily: T.ui,
              fontWeight: 'bold',
              cursor: 'pointer'
            }
          }, 'CANCEL')
        )
      )
    )
  );
};
