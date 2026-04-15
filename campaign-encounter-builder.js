(function() {
  "use strict";

  var XP_THRESHOLDS = {
    1: { easy: 25, medium: 50, hard: 75, deadly: 100 },
    2: { easy: 50, medium: 100, hard: 150, deadly: 200 },
    3: { easy: 75, medium: 150, hard: 225, deadly: 400 },
    4: { easy: 125, medium: 250, hard: 375, deadly: 500 },
    5: { easy: 250, medium: 500, hard: 750, deadly: 1100 },
    6: { easy: 300, medium: 600, hard: 900, deadly: 1400 },
    7: { easy: 350, medium: 750, hard: 1100, deadly: 1700 },
    8: { easy: 450, medium: 900, hard: 1400, deadly: 2100 },
    9: { easy: 550, medium: 1100, hard: 1600, deadly: 2400 },
    10: { easy: 600, medium: 1200, hard: 1900, deadly: 2800 },
    11: { easy: 800, medium: 1600, hard: 2400, deadly: 3600 },
    12: { easy: 1000, medium: 2000, hard: 3000, deadly: 4400 },
    13: { easy: 1100, medium: 2200, hard: 3400, deadly: 5100 },
    14: { easy: 1250, medium: 2500, hard: 3800, deadly: 5700 },
    15: { easy: 1400, medium: 2800, hard: 4300, deadly: 6400 },
    16: { easy: 1600, medium: 3200, hard: 4800, deadly: 7200 },
    17: { easy: 2000, medium: 3900, hard: 5900, deadly: 8800 },
    18: { easy: 2100, medium: 4200, hard: 6300, deadly: 9500 },
    19: { easy: 2400, medium: 4900, hard: 7300, deadly: 10900 },
    20: { easy: 2800, medium: 5700, hard: 8500, deadly: 12700 }
  };

  var XP_BY_CR = {
    0: 10,
    0.125: 25,
    0.25: 50,
    0.5: 100,
    1: 200,
    2: 450,
    3: 700,
    4: 1100,
    5: 1800,
    6: 2300,
    7: 2900,
    8: 3900,
    9: 5000,
    10: 5900,
    11: 7200,
    12: 8400,
    13: 10000,
    14: 11500,
    15: 13000,
    16: 15000,
    17: 18000,
    18: 20000,
    19: 22000,
    20: 25000,
    21: 33000,
    22: 41000,
    23: 50000,
    24: 62000,
    25: 75000,
    26: 90000,
    27: 105000,
    28: 120000,
    29: 135000,
    30: 155000
  };

  var ENCOUNTER_MULTIPLIERS = {
    1: 1,
    2: 1.5,
    3: 2,
    4: 2,
    5: 2,
    6: 2,
    7: 2.5,
    8: 2.5,
    9: 2.5,
    10: 2.5,
    11: 3,
    12: 3,
    13: 3,
    14: 3,
    15: 4
  };

  var MONSTER_TYPES = [
    'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon',
    'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid',
    'Monstrosity', 'Ooze', 'Plant', 'Undead'
  ];

  var MONSTER_SIZES = ['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'];

  var ENVIRONMENTS = [
    { name: 'Forest', features: ['Dense trees', 'Undergrowth', 'Natural pathways'] },
    { name: 'Dungeon', features: ['Stone walls', 'Narrow corridors', 'Torch light'] },
    { name: 'Urban', features: ['Buildings', 'Streets', 'Alleyways'] },
    { name: 'Mountain', features: ['Rocky terrain', 'Caves', 'High altitude'] },
    { name: 'Swamp', features: ['Murky water', 'Thick vegetation', 'Soft ground'] },
    { name: 'Underdark', features: ['Caverns', 'Bioluminescence', 'Dangerous creatures'] },
    { name: 'Desert', features: ['Sand dunes', 'Limited water', 'Heat'] },
    { name: 'Coastal', features: ['Beach', 'Cliffs', 'Sea creatures'] }
  ];

  var TEMPLATES = [
    { name: 'Boss + Minions', desc: 'One powerful boss with weaker minions' },
    { name: 'Horde', desc: 'Many weak to moderate creatures' },
    { name: 'Balanced Mix', desc: 'Varied CR creatures for tactical depth' },
    { name: 'Solo Boss', desc: 'Single powerful creature' },
    { name: 'Ambush', desc: 'Quick surprise encounter' }
  ];

  var h = React.createElement;

  function getXPForCR(cr) {
    if (cr === '0') return 10;
    var parsed = parseFloat(cr);
    return XP_BY_CR[parsed] || 0;
  }

  function calculateEncounterDifficulty(totalXP, partySize, avgLevel) {
    if (!partySize || !avgLevel) return null;
    var thresholds = XP_THRESHOLDS[avgLevel] || XP_THRESHOLDS[1];
    var totalBudget = {
      easy: thresholds.easy * partySize,
      medium: thresholds.medium * partySize,
      hard: thresholds.hard * partySize,
      deadly: thresholds.deadly * partySize
    };

    if (totalXP <= totalBudget.easy) return 'Easy';
    if (totalXP <= totalBudget.medium) return 'Medium';
    if (totalXP <= totalBudget.hard) return 'Hard';
    return 'Deadly';
  }

  function getDifficultyColor(difficulty) {
    switch (difficulty) {
      case 'Easy': return '#7cb342';
      case 'Medium': return '#ffa726';
      case 'Hard': return '#ef5350';
      case 'Deadly': return '#8b0000';
      default: return '#999';
    }
  }

  function filterMonsters(monsters, search, crMin, crMax, monsterType, size) {
    return monsters.filter(function(m) {
      var matchesSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
      var cr = parseFloat(m.cr || 0);
      var matchesCR = cr >= crMin && cr <= crMax;
      var matchesType = !monsterType || m.type.toLowerCase().includes(monsterType.toLowerCase());
      var matchesSize = !size || m.size === size;
      return matchesSearch && matchesCR && matchesType && matchesSize;
    });
  }

  function pickRandomMonster(cr) {
    var monsters = window.SRD_MONSTERS || [];
    var candidates = monsters.filter(function(m) {
      var mcr = parseFloat(m.cr || 0);
      return mcr === cr;
    });
    if (candidates.length === 0) {
      candidates = monsters.filter(function(m) {
        var mcr = parseFloat(m.cr || 0);
        return Math.abs(mcr - cr) < 0.5;
      });
    }
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  function generateQuickEncounter(partySize, avgLevel, template) {
    var encounter = [];
    var targetXP = (XP_THRESHOLDS[avgLevel] || XP_THRESHOLDS[1]).medium * partySize;
    var usedXP = 0;

    if (template === 'Boss + Minions') {
      var boss = pickRandomMonster(avgLevel + 1);
      if (boss) {
        encounter.push({ name: boss.name, cr: boss.cr, hp: boss.hp, ac: boss.ac });
        usedXP += getXPForCR(boss.cr);
      }
      var crForMinion = Math.max(0.5, avgLevel - 3);
      while (usedXP < targetXP * 0.8) {
        var minion = pickRandomMonster(crForMinion);
        if (minion) {
          encounter.push({ name: minion.name, cr: minion.cr, hp: minion.hp, ac: minion.ac });
          usedXP += getXPForCR(minion.cr);
        } else break;
      }
    } else if (template === 'Horde') {
      var crForHorde = Math.max(0.25, avgLevel - 2);
      while (usedXP < targetXP * 0.8 && encounter.length < 15) {
        var creature = pickRandomMonster(crForHorde);
        if (creature) {
          encounter.push({ name: creature.name, cr: creature.cr, hp: creature.hp, ac: creature.ac });
          usedXP += getXPForCR(creature.cr);
        } else break;
      }
    } else if (template === 'Balanced Mix') {
      var crs = [avgLevel - 1, avgLevel, avgLevel + 1];
      var idx = 0;
      while (usedXP < targetXP * 0.8 && encounter.length < 6) {
        var targetCR = crs[idx % crs.length];
        var balanced = pickRandomMonster(Math.max(0, targetCR));
        if (balanced) {
          encounter.push({ name: balanced.name, cr: balanced.cr, hp: balanced.hp, ac: balanced.ac });
          usedXP += getXPForCR(balanced.cr);
        }
        idx++;
      }
    } else if (template === 'Solo Boss') {
      var soloBoss = pickRandomMonster(avgLevel + 2);
      if (soloBoss) {
        encounter.push({ name: soloBoss.name, cr: soloBoss.cr, hp: soloBoss.hp, ac: soloBoss.ac });
      }
    } else if (template === 'Ambush') {
      var quick1 = pickRandomMonster(Math.max(0.5, avgLevel - 2));
      var quick2 = pickRandomMonster(Math.max(0.5, avgLevel - 1));
      if (quick1) encounter.push({ name: quick1.name, cr: quick1.cr, hp: quick1.hp, ac: quick1.ac });
      if (quick2) encounter.push({ name: quick2.name, cr: quick2.cr, hp: quick2.hp, ac: quick2.ac });
      if (quick1) encounter.push({ name: quick1.name, cr: quick1.cr, hp: quick1.hp, ac: quick1.ac });
    }

    return encounter;
  }

  function MonsterCard(props) {
    var monster = props.monster;
    var onAdd = props.onAdd;
    var expanded = props.expanded;
    var onToggleExpand = props.onToggleExpand;
    var LucideReact = window.LucideReact || {};
    var ChevronDown = LucideReact.ChevronDown || h('span');
    var Plus = LucideReact.Plus || h('span');

    var crNum = parseFloat(monster.cr || 0);
    var xp = getXPForCR(monster.cr);

    return h('div', {
      style: {
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '10px',
        backgroundColor: 'var(--bg-card)',
        cursor: 'pointer',
        transition: 'all 0.2s'
      },
      onMouseEnter: function(e) {
        e.currentTarget.style.backgroundColor = 'var(--bg-mid)';
        e.currentTarget.style.borderColor = 'var(--border)';
      },
      onMouseLeave: function(e) {
        e.currentTarget.style.backgroundColor = 'var(--bg-card)';
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
      }
    },
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: expanded ? '12px' : '0'
        }
      },
        h('div', {
          style: { flex: 1, cursor: 'pointer' },
          onClick: onToggleExpand
        },
          h('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '4px'
            }
          },
            h(ChevronDown, {
              size: 16,
              style: { transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }
            }),
            h('span', { style: { fontWeight: 'bold', color: 'var(--text)' } }, monster.name)
          ),
          h('div', {
            style: {
              fontSize: '12px',
              color: 'var(--text-muted)',
              display: 'flex',
              gap: '16px'
            }
          },
            h('span', {}, 'CR ' + monster.cr),
            h('span', {}, monster.size || 'Medium'),
            h('span', {}, monster.type || 'Unknown'),
            h('span', {}, 'AC ' + monster.ac),
            h('span', {}, monster.hp + ' HP'),
            h('span', { style: { color: 'var(--gold)' } }, xp + ' XP')
          )
        ),
        h('button', {
          onClick: function(e) {
            e.stopPropagation();
            onAdd();
          },
          style: {
            padding: '8px 12px',
            backgroundColor: 'var(--crimson)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 'bold',
            transition: 'opacity 0.2s'
          },
          onMouseEnter: function(e) { e.currentTarget.style.opacity = '0.8'; },
          onMouseLeave: function(e) { e.currentTarget.style.opacity = '1'; }
        },
          h(Plus, { size: 16 }),
          'Add'
        )
      ),
      expanded && h('div', {
        style: {
          backgroundColor: 'rgba(0,0,0,0.2)',
          padding: '12px',
          borderRadius: '4px',
          fontSize: '12px',
          color: 'var(--text-muted)',
          maxHeight: '300px',
          overflowY: 'auto'
        }
      },
        monster.traits && monster.traits.length > 0 && h('div', { style: { marginBottom: '12px' } },
          h('div', { style: { fontWeight: 'bold', color: 'var(--text)', marginBottom: '6px' } }, 'Traits'),
          monster.traits.slice(0, 3).map(function(trait, idx) {
            return h('div', { key: idx, style: { marginBottom: '6px' } },
              h('span', { style: { color: 'var(--gold)', fontWeight: 'bold' } }, trait.name + ': '),
              h('span', {}, (trait.desc || '').substring(0, 100) + '...')
            );
          })
        ),
        monster.actions && monster.actions.length > 0 && h('div', { style: { marginBottom: '12px' } },
          h('div', { style: { fontWeight: 'bold', color: 'var(--text)', marginBottom: '6px' } }, 'Actions'),
          monster.actions.slice(0, 2).map(function(action, idx) {
            return h('div', { key: idx, style: { marginBottom: '6px' } },
              h('span', { style: { color: 'var(--gold)', fontWeight: 'bold' } }, action.name + ': '),
              h('span', {}, (action.desc || '').substring(0, 80) + '...')
            );
          })
        ),
        h('div', { style: { fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' } },
          'Saves: ' + (monster.saves ? Object.keys(monster.saves).join(', ') : 'None') + ' | ' +
          'Skills: ' + (monster.skills ? Object.keys(monster.skills).join(', ') : 'None')
        )
      )
    );
  }

  function MonsterSearchPanel(props) {
    var onAddMonster = props.onAddMonster;
    var LucideReact = window.LucideReact || {};
    var Search = LucideReact.Search || h('span');
    var Filter = LucideReact.Filter || h('span');

    var monsters = window.SRD_MONSTERS || [];
    var searchRef = React.useRef('');
    var typeRef = React.useRef('');
    var sizeRef = React.useRef('');
    var crMinRef = React.useRef(0);
    var crMaxRef = React.useRef(5);
    var expandedRef = React.useRef({});

    var _search = React.useState('');
    var search = _search[0];
    var setSearch = _search[1];

    var _type = React.useState('');
    var type = _type[0];
    var setType = _type[1];

    var _size = React.useState('');
    var size = _size[0];
    var setSize = _size[1];

    var _crMin = React.useState(0);
    var crMin = _crMin[0];
    var setCRMin = _crMin[1];

    var _crMax = React.useState(5);
    var crMax = _crMax[0];
    var setCRMax = _crMax[1];

    var _expanded = React.useState({});
    var expanded = _expanded[0];
    var setExpanded = _expanded[1];

    var filtered = React.useMemo(function() {
      return filterMonsters(monsters, search, crMin, crMax, type, size).slice(0, 50);
    }, [search, crMin, crMax, type, size]);

    return h('div', {
      style: {
        width: '340px',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg)',
        overflow: 'hidden'
      }
    },
      h('div', {
        style: {
          padding: '16px',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--bg-card)'
        }
      },
        h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--bg-mid)',
            borderRadius: '6px',
            padding: '8px 12px',
            marginBottom: '12px',
            border: '1px solid var(--border-subtle)'
          }
        },
          h(Search, { size: 16, style: { color: 'var(--text-muted)', marginRight: '8px' } }),
          h('input', {
            type: 'text',
            placeholder: 'Search monsters...',
            value: search,
            onChange: function(e) { setSearch(e.target.value); },
            style: {
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: 'var(--text)',
              fontSize: '14px',
              outline: 'none'
            }
          })
        ),
        h('div', { style: { display: 'flex', gap: '8px', marginBottom: '12px' } },
          h('select', {
            value: type,
            onChange: function(e) { setType(e.target.value); },
            style: {
              flex: 1,
              padding: '6px',
              backgroundColor: 'var(--bg-mid)',
              color: 'var(--text)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              fontSize: '12px'
            }
          },
            h('option', { value: '' }, 'All Types'),
            MONSTER_TYPES.map(function(t) {
              return h('option', { key: t, value: t }, t);
            })
          ),
          h('select', {
            value: size,
            onChange: function(e) { setSize(e.target.value); },
            style: {
              flex: 1,
              padding: '6px',
              backgroundColor: 'var(--bg-mid)',
              color: 'var(--text)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              fontSize: '12px'
            }
          },
            h('option', { value: '' }, 'All Sizes'),
            MONSTER_SIZES.map(function(s) {
              return h('option', { key: s, value: s }, s);
            })
          )
        ),
        h('div', { style: { fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' } }, 'CR Range: ' + crMin + ' - ' + crMax),
        h('div', { style: { display: 'flex', gap: '8px' } },
          h('input', {
            type: 'number',
            min: '0',
            max: '30',
            value: crMin,
            onChange: function(e) { setCRMin(Math.min(parseInt(e.target.value) || 0, crMax)); },
            style: {
              flex: 1,
              padding: '6px',
              backgroundColor: 'var(--bg-mid)',
              color: 'var(--text)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              fontSize: '12px'
            }
          }),
          h('input', {
            type: 'number',
            min: '0',
            max: '30',
            value: crMax,
            onChange: function(e) { setCRMax(Math.max(parseInt(e.target.value) || 0, crMin)); },
            style: {
              flex: 1,
              padding: '6px',
              backgroundColor: 'var(--bg-mid)',
              color: 'var(--text)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              fontSize: '12px'
            }
          })
        )
      ),
      h('div', {
        style: {
          flex: 1,
          overflowY: 'auto',
          padding: '12px'
        }
      },
        filtered.length === 0 && h('div', {
          style: { textAlign: 'center', color: 'var(--text-muted)', paddingTop: '20px', fontSize: '13px' }
        }, 'No monsters found'),
        filtered.map(function(monster) {
          return h(MonsterCard, {
            key: monster.name,
            monster: monster,
            onAdd: function() { onAddMonster(monster); },
            expanded: expanded[monster.name] || false,
            onToggleExpand: function() {
              setExpanded(function(prev) {
                var next = Object.assign({}, prev);
                next[monster.name] = !next[monster.name];
                return next;
              });
            }
          });
        })
      )
    );
  }

  function EncounterMonsterRow(props) {
    var monster = props.monster;
    var count = props.count;
    var onRemove = props.onRemove;
    var LucideReact = window.LucideReact || {};
    var Trash2 = LucideReact.Trash2 || h('span');

    return h('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px',
        backgroundColor: 'var(--bg-mid)',
        borderRadius: '6px',
        marginBottom: '8px',
        border: '1px solid var(--border-subtle)',
        transition: 'all 0.2s'
      },
      onMouseEnter: function(e) {
        e.currentTarget.style.backgroundColor = 'var(--bg-dark)';
      },
      onMouseLeave: function(e) {
        e.currentTarget.style.backgroundColor = 'var(--bg-mid)';
      }
    },
      h('div', { style: { flex: 1 } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' } },
          h('span', { style: { fontWeight: 'bold', color: 'var(--text)', minWidth: '150px' } }, monster.name),
          count > 1 && h('span', {
            style: {
              backgroundColor: 'var(--crimson)',
              color: 'white',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '12px',
              fontWeight: 'bold'
            }
          }, 'x' + count)
        ),
        h('div', {
          style: {
            fontSize: '12px',
            color: 'var(--text-muted)',
            display: 'flex',
            gap: '16px'
          }
        },
          h('span', {}, 'CR ' + monster.cr),
          h('span', {}, 'AC ' + monster.ac),
          h('span', {}, monster.hp + ' HP'),
          h('span', { style: { color: 'var(--gold)' } }, getXPForCR(monster.cr) * count + ' XP')
        )
      ),
      h('button', {
        onClick: onRemove,
        style: {
          padding: '8px 12px',
          backgroundColor: 'var(--bg-dark)',
          color: 'var(--crimson)',
          border: '1px solid var(--crimson)',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s'
        },
        onMouseEnter: function(e) {
          e.currentTarget.style.backgroundColor = 'var(--crimson)';
          e.currentTarget.style.color = 'white';
        },
        onMouseLeave: function(e) {
          e.currentTarget.style.backgroundColor = 'var(--bg-dark)';
          e.currentTarget.style.color = 'var(--crimson)';
        }
      },
        h(Trash2, { size: 16 }),
        'Remove'
      )
    );
  }

  function DifficultyGauge(props) {
    var totalXP = props.totalXP;
    var partySize = props.partySize;
    var avgLevel = props.avgLevel;

    if (!partySize || !avgLevel) {
      return h('div', { style: { color: 'var(--text-muted)', fontSize: '13px' } }, 'Set party size and level');
    }

    var thresholds = XP_THRESHOLDS[avgLevel] || XP_THRESHOLDS[1];
    var easy = thresholds.easy * partySize;
    var medium = thresholds.medium * partySize;
    var hard = thresholds.hard * partySize;
    var deadly = thresholds.deadly * partySize;

    var difficulty = calculateEncounterDifficulty(totalXP, partySize, avgLevel);
    var percentage = Math.min(100, (totalXP / deadly) * 100);

    return h('div', {
      style: { marginTop: '12px' }
    },
      h('div', {
        style: {
          width: '100%',
          height: '24px',
          backgroundColor: 'var(--bg-mid)',
          borderRadius: '4px',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '8px'
        }
      },
        h('div', {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: (easy / deadly * 100) + '%',
            backgroundColor: 'rgba(124, 179, 66, 0.3)',
            borderRight: '2px solid #7cb342'
          }
        }),
        h('div', {
          style: {
            position: 'absolute',
            top: 0,
            left: (easy / deadly * 100) + '%',
            height: '100%',
            width: ((medium - easy) / deadly * 100) + '%',
            backgroundColor: 'rgba(255, 167, 38, 0.3)',
            borderRight: '2px solid #ffa726'
          }
        }),
        h('div', {
          style: {
            position: 'absolute',
            top: 0,
            left: (medium / deadly * 100) + '%',
            height: '100%',
            width: ((hard - medium) / deadly * 100) + '%',
            backgroundColor: 'rgba(239, 83, 80, 0.3)',
            borderRight: '2px solid #ef5350'
          }
        }),
        h('div', {
          style: {
            position: 'absolute',
            top: 0,
            left: (hard / deadly * 100) + '%',
            height: '100%',
            width: ((deadly - hard) / deadly * 100) + '%',
            backgroundColor: 'rgba(139, 0, 0, 0.3)'
          }
        }),
        h('div', {
          style: {
            position: 'absolute',
            top: 0,
            left: percentage + '%',
            height: '100%',
            width: '3px',
            backgroundColor: getDifficultyColor(difficulty),
            boxShadow: '0 0 8px ' + getDifficultyColor(difficulty),
            transform: 'translateX(-50%)'
          }
        })
      ),
      h('div', {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--text-muted)'
        }
      },
        h('span', {}, 'Easy: ' + easy),
        h('span', {}, 'Medium: ' + medium),
        h('span', {}, 'Hard: ' + hard),
        h('span', {}, 'Deadly: ' + deadly)
      ),
      h('div', {
        style: {
          marginTop: '8px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          color: getDifficultyColor(difficulty)
        }
      },
        difficulty + ' (' + totalXP + ' XP)'
      )
    );
  }

  function EncounterBuilderView(props) {
    var data = props.data || {};
    var setData = props.setData || function() {};
    var viewRole = props.viewRole;

    var LucideReact = window.LucideReact || {};
    var Plus = LucideReact.Plus || h('span');
    var Save = LucideReact.Save || h('span');
    var RefreshCw = LucideReact.RefreshCw || h('span');
    var AlertTriangle = LucideReact.AlertTriangle || h('span');

    var _partySize = React.useState(data.partySize || 4);
    var partySize = _partySize[0];
    var setPartySize = _partySize[1];

    var _avgLevel = React.useState(data.avgLevel || 1);
    var avgLevel = _avgLevel[0];
    var setAvgLevel = _avgLevel[1];

    var _encounter = React.useState(data.currentEncounter || []);
    var encounter = _encounter[0];
    var setEncounter = _encounter[1];

    var _encounterName = React.useState(data.encounterName || 'New Encounter');
    var encounterName = _encounterName[0];
    var setEncounterName = _encounterName[1];

    var _environment = React.useState(data.environment || 'Dungeon');
    var environment = _environment[0];
    var setEnvironment = _environment[1];

    var _savedEncounters = React.useState(data.encounters || []);
    var savedEncounters = _savedEncounters[0];
    var setSavedEncounters = _savedEncounters[1];

    var _showSaved = React.useState(false);
    var showSaved = _showSaved[0];
    var setShowSaved = _showSaved[1];

    var handleAddMonster = React.useCallback(function(monster) {
      setEncounter(function(prev) {
        var existing = prev.find(function(m) { return m.name === monster.name; });
        if (existing) {
          return prev.map(function(m) {
            return m.name === monster.name ? Object.assign({}, m, { count: (m.count || 1) + 1 }) : m;
          });
        }
        return prev.concat([{
          name: monster.name,
          cr: monster.cr,
          hp: monster.hp,
          ac: monster.ac,
          count: 1
        }]);
      });
    }, []);

    var handleRemoveMonster = React.useCallback(function(monsterName) {
      setEncounter(function(prev) {
        return prev.filter(function(m) { return m.name !== monsterName; });
      });
    }, []);

    var totalXP = React.useMemo(function() {
      return encounter.reduce(function(sum, m) {
        return sum + (getXPForCR(m.cr) * (m.count || 1));
      }, 0);
    }, [encounter]);

    var adjustedXP = React.useMemo(function() {
      if (encounter.length === 0) return 0;
      var count = encounter.reduce(function(sum, m) { return sum + (m.count || 1); }, 0);
      var multiplier = ENCOUNTER_MULTIPLIERS[Math.min(count, 15)] || 4;
      return Math.round(totalXP * multiplier);
    }, [totalXP, encounter]);

    var handleQuickEncounter = React.useCallback(function(template) {
      var generated = generateQuickEncounter(partySize, avgLevel, template);
      setEncounter(generated);
    }, [partySize, avgLevel]);

    var handleSaveEncounter = React.useCallback(function() {
      if (encounter.length === 0) {
        alert('Add monsters to the encounter first');
        return;
      }
      var newEncounter = {
        id: Date.now(),
        name: encounterName,
        monsters: encounter,
        totalXP: totalXP,
        adjustedXP: adjustedXP,
        difficulty: calculateEncounterDifficulty(adjustedXP, partySize, avgLevel),
        environment: environment,
        notes: ''
      };
      var updated = savedEncounters.concat([newEncounter]);
      setSavedEncounters(updated);
      setData(Object.assign({}, data, {
        encounters: updated,
        currentEncounter: [],
        partySize: partySize,
        avgLevel: avgLevel
      }));
      setEncounter([]);
      setEncounterName('New Encounter');
      alert('Encounter saved!');
    }, [encounter, totalXP, adjustedXP, partySize, avgLevel, environment, encounterName, savedEncounters, data, setData]);

    var handleLoadEncounter = React.useCallback(function(enc) {
      setEncounter(enc.monsters);
      setEncounterName(enc.name);
      setEnvironment(enc.environment || 'Dungeon');
      setShowSaved(false);
    }, []);

    var environmentData = ENVIRONMENTS.find(function(e) { return e.name === environment; }) || ENVIRONMENTS[0];

    return h('div', {
      style: {
        display: 'flex',
        height: '100%',
        backgroundColor: 'var(--bg)',
        fontFamily: "'Spectral', serif"
      }
    },
      h(MonsterSearchPanel, {
        onAddMonster: handleAddMonster
      }),
      h('div', {
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: 'var(--bg)'
        }
      },
        h('div', {
          style: {
            padding: '16px',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--bg-card)',
            flexShrink: 0
          }
        },
          h('div', {
            style: {
              display: 'flex',
              gap: '16px',
              marginBottom: '12px',
              alignItems: 'center'
            }
          },
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              h('label', { style: { fontSize: '13px', color: 'var(--text-muted)' } }, 'Party Size:'),
              h('input', {
                type: 'number',
                min: '1',
                max: '10',
                value: partySize,
                onChange: function(e) { setPartySize(parseInt(e.target.value) || 1); },
                style: {
                  width: '50px',
                  padding: '6px',
                  backgroundColor: 'var(--bg-mid)',
                  color: 'var(--text)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  fontSize: '13px'
                }
              })
            ),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              h('label', { style: { fontSize: '13px', color: 'var(--text-muted)' } }, 'Avg Level:'),
              h('input', {
                type: 'number',
                min: '1',
                max: '20',
                value: avgLevel,
                onChange: function(e) { setAvgLevel(parseInt(e.target.value) || 1); },
                style: {
                  width: '50px',
                  padding: '6px',
                  backgroundColor: 'var(--bg-mid)',
                  color: 'var(--text)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  fontSize: '13px'
                }
              })
            ),
            h('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              h('label', { style: { fontSize: '13px', color: 'var(--text-muted)' } }, 'Environment:'),
              h('select', {
                value: environment,
                onChange: function(e) { setEnvironment(e.target.value); },
                style: {
                  padding: '6px',
                  backgroundColor: 'var(--bg-mid)',
                  color: 'var(--text)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  fontSize: '13px'
                }
              },
                ENVIRONMENTS.map(function(env) {
                  return h('option', { key: env.name, value: env.name }, env.name);
                })
              )
            )
          ),
          h(DifficultyGauge, {
            totalXP: adjustedXP,
            partySize: partySize,
            avgLevel: avgLevel
          })
        ),
        h('div', {
          style: {
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--bg)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto'
          }
        },
          TEMPLATES.map(function(template) {
            return h('button', {
              key: template.name,
              onClick: function() { handleQuickEncounter(template.name); },
              title: template.desc,
              style: {
                padding: '8px 12px',
                backgroundColor: 'var(--bg-mid)',
                color: 'var(--text)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              },
              onMouseEnter: function(e) {
                e.currentTarget.style.backgroundColor = 'var(--crimson)';
                e.currentTarget.style.borderColor = 'var(--crimson)';
              },
              onMouseLeave: function(e) {
                e.currentTarget.style.backgroundColor = 'var(--bg-mid)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }
            }, template.name);
          })
        ),
        h('div', {
          style: {
            flex: 1,
            overflowY: 'auto',
            padding: '16px'
          }
        },
          h('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }
          },
            h('div', {
              style: { flex: 1 }
            },
              h('input', {
                type: 'text',
                value: encounterName,
                onChange: function(e) { setEncounterName(e.target.value); },
                placeholder: 'Encounter name...',
                style: {
                  width: '200px',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-mid)',
                  color: 'var(--text)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }
              })
            ),
            h('button', {
              onClick: function() { setShowSaved(!showSaved); },
              style: {
                padding: '8px 12px',
                backgroundColor: 'var(--bg-mid)',
                color: 'var(--text)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                marginRight: '8px'
              }
            }, 'Saved (' + savedEncounters.length + ')'),
            h('button', {
              onClick: handleSaveEncounter,
              style: {
                padding: '8px 12px',
                backgroundColor: 'var(--crimson)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 'bold'
              }
            },
              h(Save, { size: 16 }),
              'Save'
            )
          ),
          showSaved && h('div', {
            style: {
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '16px',
              maxHeight: '200px',
              overflowY: 'auto'
            }
          },
            savedEncounters.length === 0 && h('div', {
              style: { color: 'var(--text-muted)', fontSize: '13px' }
            }, 'No saved encounters'),
            savedEncounters.map(function(enc) {
              return h('div', {
                key: enc.id,
                style: {
                  padding: '8px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                },
                onClick: function() { handleLoadEncounter(enc); },
                onMouseEnter: function(e) { e.currentTarget.style.backgroundColor = 'var(--bg-mid)'; },
                onMouseLeave: function(e) { e.currentTarget.style.backgroundColor = 'transparent'; }
              },
                h('div', {},
                  h('div', { style: { fontWeight: 'bold', color: 'var(--text)', marginBottom: '2px' } }, enc.name),
                  h('div', { style: { fontSize: '11px', color: 'var(--text-muted)' } },
                    enc.monsters.length + ' monsters, ' + enc.adjustedXP + ' XP, ' + enc.difficulty
                  )
                )
              );
            })
          ),
          encounter.length === 0 && !showSaved && h('div', {
            style: {
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--text-muted)',
              fontSize: '14px'
            }
          },
            h('div', { style: { marginBottom: '12px' } }, 'No monsters added'),
            h('div', { style: { fontSize: '12px' } }, 'Search the left panel or use a template to get started')
          ),
          encounter.length > 0 && h('div', {},
            h('div', {
              style: {
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)'
              }
            },
              h('div', {
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--border-subtle)'
                }
              },
                h('span', { style: { fontWeight: 'bold', color: 'var(--text)' } }, 'Encounter Summary'),
                h('button', {
                  onClick: function() { setEncounter([]); },
                  style: {
                    padding: '4px 8px',
                    backgroundColor: 'var(--bg-mid)',
                    color: 'var(--crimson)',
                    border: '1px solid var(--crimson)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }
                }, 'Clear')
              ),
              h('div', {
                style: {
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  fontSize: '13px'
              }
              },
                h('div', {},
                  h('div', { style: { color: 'var(--text-muted)', marginBottom: '2px' } }, 'Total Monsters:'),
                  h('div', { style: { fontWeight: 'bold', color: 'var(--text)' } },
                    encounter.reduce(function(sum, m) { return sum + (m.count || 1); }, 0) + ' creatures'
                  )
                ),
                h('div', {},
                  h('div', { style: { color: 'var(--text-muted)', marginBottom: '2px' } }, 'Raw XP:'),
                  h('div', { style: { fontWeight: 'bold', color: 'var(--gold)' } }, totalXP)
                ),
                h('div', {},
                  h('div', { style: { color: 'var(--text-muted)', marginBottom: '2px' } }, 'Adjusted XP:'),
                  h('div', { style: { fontWeight: 'bold', color: 'var(--gold)' } }, adjustedXP)
                ),
                h('div', {},
                  h('div', { style: { color: 'var(--text-muted)', marginBottom: '2px' } }, 'Encounter Count:'),
                  h('div', { style: { fontWeight: 'bold', color: 'var(--text)' } },
                    'x' + (ENCOUNTER_MULTIPLIERS[Math.min(encounter.reduce(function(sum, m) { return sum + (m.count || 1); }, 0), 15)] || 4).toFixed(1)
                  )
                )
              )
            ),
            h('div', {},
              encounter.map(function(monster) {
                return h(EncounterMonsterRow, {
                  key: monster.name,
                  monster: monster,
                  count: monster.count || 1,
                  onRemove: function() { handleRemoveMonster(monster.name); }
                });
              })
            )
          )
        )
      )
    );
  }

  window.EncounterBuilderView = EncounterBuilderView;

})();
