(function() {
  const { useState, useEffect, useCallback, useRef, useMemo } = React;
  const T = window.__PHMURT_THEME || {};
  try { if (window.T) Object.assign(T, window.T); } catch(e) {}

  const { Key, Lock, Unlock, Eye, EyeOff, Plus, Edit2, Trash2, Check, X, ChevronDown, ChevronUp, Search, Star, AlertTriangle, Lightbulb, Layers, Grid, Hash, Shuffle, RotateCcw, Copy, BookOpen, Target, MapPin } = window.LucideReact || {};
  const LightbulbIcon = Lightbulb || Star;

  // Deterministic hash for puzzle ID to select world data
  function hashPuzzleId(id) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  // Contextualize puzzle with world data
  function contextualizePuzzle(puzzle, data) {
    if (!data || (!data.regions && !data.cities && !data.npcs && !data.pois)) {
      return puzzle;
    }

    const seed = hashPuzzleId(puzzle.id);
    let contextualized = { ...puzzle };

    // Patterns to replace
    const patterns = [
      {
        pattern: /A sphinx blocks your path/i,
        replacement: (data) => {
          if (data.cities && data.cities.length > 0) {
            const city = data.cities[seed % data.cities.length];
            return `A sphinx blocks the road to ${city.name}`;
          }
          return null;
        }
      },
      {
        pattern: /An ancient door/i,
        replacement: (data) => {
          if (data.pois && data.pois.length > 0) {
            const poi = data.pois[seed % data.pois.length];
            return `An ancient door in the ruins of ${poi.name}`;
          }
          return null;
        }
      },
      {
        pattern: /A mysterious figure/i,
        replacement: (data) => {
          if (data.npcs && data.npcs.length > 0) {
            const npc = data.npcs[seed % data.npcs.length];
            return `${npc.name}, a mysterious ${npc.role || 'figure'}`;
          }
          return null;
        }
      }
    ];

    // Apply replacements to setup and description
    patterns.forEach(({ pattern, replacement }) => {
      const replaced = replacement(data);
      if (replaced) {
        contextualized.setup = contextualized.setup.replace(pattern, replaced);
        contextualized.description = contextualized.description.replace(pattern, replaced);
      }
    });

    // Mark as contextualized with metadata
    contextualized._contextualized = true;
    if (data.regions && data.regions.length > 0) {
      contextualized._region = data.regions[seed % data.regions.length].name;
    }
    if (data.npcs && data.npcs.length > 0) {
      contextualized._givenBy = data.npcs[seed % data.npcs.length].name;
    }

    return contextualized;
  }

  const PUZZLE_TEMPLATES = [
    {
      id: 'riddle-1',
      name: 'The Sphinx\'s Riddle',
      type: 'riddle',
      difficulty: 3,
      description: 'A classic riddle from an ancient sphinx',
      setup: 'The sphinx blocks your path and speaks: "I have cities but no houses, forests but no trees, water but no fish. What am I?"',
      solution: 'A map',
      hints: ['Something you can hold in your hands', 'It shows places and geography', 'You would use it to navigate'],
      interactive: null
    },
    {
      id: 'riddle-2',
      name: 'What Am I?',
      type: 'riddle',
      difficulty: 2,
      description: 'A simple personification riddle',
      setup: 'A voice asks: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"',
      solution: 'An echo',
      hints: ['It repeats what you say', 'It comes from your own voice', 'You\'ve heard me in canyons and caves'],
      interactive: null
    },
    {
      id: 'logic-1',
      name: 'The Guard Riddle',
      type: 'logic',
      difficulty: 3,
      description: 'Two guards, one tells truth, one lies. Choose the correct door.',
      setup: 'Two guards stand before twin doors. One always lies, one always tells truth. You don\'t know which is which. What ONE question do you ask to find the safe door?',
      solution: 'Ask either guard: "If I asked the OTHER guard which door is safe, what would they say?" Then choose the OPPOSITE door.',
      hints: ['Think about what happens when a liar answers about a truth-teller\'s answer', 'The answer will always point to the WRONG door', 'Ask about what the OTHER guard would say'],
      interactive: null
    },
    {
      id: 'logic-2',
      name: 'Number Sequence',
      type: 'logic',
      difficulty: 2,
      description: 'Find the next number in the sequence',
      setup: 'What number comes next? 2, 4, 8, 16, 32, ?',
      solution: '64 (each number doubles)',
      hints: ['Look at the relationship between consecutive numbers', 'Try multiplying', 'The pattern is exponential growth'],
      interactive: null
    },
    {
      id: 'logic-3',
      name: 'Knight and Knave',
      type: 'logic',
      difficulty: 4,
      description: 'Determine who is the honest knight and the lying knave',
      setup: 'You meet two people claiming to be from a kingdom. The first says: "We are both knights." The second says nothing. Who is lying?',
      solution: 'The first person is a knave (liar). If they were a knight, they\'d tell the truth, but saying "we\'re both knights" when their companion is silent is impossible.',
      hints: ['Assume the first person is a knight and see if it\'s consistent', 'Assume the first person is a knave and see if it works', 'A knight would never falsely claim to be a knave'],
      interactive: null
    },
    {
      id: 'mechanical-1',
      name: 'Pressure Plate Combination',
      type: 'mechanical',
      difficulty: 3,
      description: 'Step on pressure plates in the correct sequence to open a door',
      setup: 'A stone floor has four pressure plates arranged in a square. An inscription reads: "Step where the ancient symbols align: ☆ ◆ ● ■"',
      solution: 'Press plates in order: Star, Diamond, Circle, Square',
      hints: ['The inscription gives you the sequence', 'Each symbol corresponds to a plate', 'You must press them in the exact order given'],
      interactive: { type: 'grid', width: 2, height: 2, labels: ['☆', '◆', '●', '■'] }
    },
    {
      id: 'mechanical-2',
      name: 'Lever Sequence Puzzle',
      type: 'mechanical',
      difficulty: 3,
      description: 'Pull levers in the correct sequence',
      setup: 'Three levers hang from chains, each with a runic symbol. A voice echoes: "Pull in the order of power: weakest first, strongest last."',
      solution: 'Silver lever (weakest), Gold lever, Platinum lever (strongest)',
      hints: ['Consider which material is weakest', 'Consider which material is strongest', 'Silver is soft, platinum is dense'],
      interactive: null
    },
    {
      id: 'mechanical-3',
      name: 'Rotating Ring Lock',
      type: 'mechanical',
      difficulty: 4,
      description: 'Align concentric rings to form a code',
      setup: 'A circular mechanism has three rotating rings, each with 8 symbols. The center must spell a word: CAT (using symbol positions)',
      solution: 'Align rings to: C (position 3), A (position 1), T (position 20)',
      hints: ['Think of the rings as a combination lock', 'Each ring must be rotated independently', 'Position the symbols correctly'],
      interactive: { type: 'wheel', rings: 3 }
    },
    {
      id: 'cipher-1',
      name: 'Caesar Cipher: ROT13',
      type: 'cipher',
      difficulty: 2,
      description: 'Decode a message shifted by 13 positions',
      setup: 'A note reads: "URYYB JBEYQ" - What does it say?',
      solution: 'HELLO WORLD (shift backward by 13)',
      hints: ['Try shifting each letter by a few positions', 'The shift is 13', 'Check if words start to make sense'],
      interactive: { type: 'wheel', shift: 13 }
    },
    {
      id: 'cipher-2',
      name: 'Substitution Cipher',
      type: 'cipher',
      difficulty: 3,
      description: 'Decode using a substitution cipher',
      setup: 'A parchment shows: "WEB XNZFR BH BNXD" - Decode this ancient message.',
      solution: 'THE ANSWER IS ASKED (using A→W, B→E, C→B pattern)',
      hints: ['This isn\'t a shift cipher - each letter maps to another specific letter', 'Common letters like E, T, A might be key', 'Try working from word patterns and common phrases'],
      interactive: null
    },
    {
      id: 'cipher-3',
      name: 'Rune Matching',
      type: 'cipher',
      difficulty: 2,
      description: 'Match rune pairs to unlock a ward',
      setup: 'Six rune stones surround an altar. Match pairs with identical meanings: ᚠ ᚢ ᚦ ᚠ ᚢ ᚦ',
      solution: 'Match: ᚠ with ᚠ, ᚢ with ᚢ, ᚦ with ᚦ',
      hints: ['Look for duplicate symbols', 'Each rune appears exactly twice', 'Visual matching is the key'],
      interactive: { type: 'grid', width: 3, height: 2 }
    },
    {
      id: 'environmental-1',
      name: 'Elemental Altar Arrangement',
      type: 'environmental',
      difficulty: 3,
      description: 'Arrange elemental tokens on an altar in the correct order',
      setup: 'An ancient altar has four pedestals. A mural shows elements in sequence: Fire, Water, Earth, Air. Arrange the glowing tokens accordingly.',
      solution: 'Place in order: Fire (red), Water (blue), Earth (brown), Air (white)',
      hints: ['Follow the mural\'s sequence', 'Red corresponds to fire', 'Water is blue'],
      interactive: { type: 'grid', width: 4, height: 1 }
    },
    {
      id: 'environmental-2',
      name: 'Water Flow Puzzle',
      type: 'environmental',
      difficulty: 3,
      description: 'Redirect water pipes to fill all containers',
      setup: 'A system of stone pipes can be rotated. Direct the water flow to fill all three containers simultaneously.',
      solution: 'Rotate pipes at positions 2 and 4 to create a connected path',
      hints: ['Water flows from the source at the top', 'Pipes can be rotated 90 degrees', 'All three containers must receive water'],
      interactive: null
    },
    {
      id: 'environmental-3',
      name: 'Constellation Mapping',
      type: 'environmental',
      difficulty: 4,
      description: 'Connect stars to form the correct constellation',
      setup: 'A ceiling dome shows scattered stars. A book describes the constellation of the Dragon: "Head at 45°, body coils through center, tail at 315°"',
      solution: 'Connect stars at positions: 45°, 90°, 135°, 180°, 225°, 270°, 315°',
      hints: ['Use cardinal directions as reference', 'The dragon spirals through the center', 'Start with the head position'],
      interactive: null
    },
    {
      id: 'environmental-4',
      name: 'Musical Note Sequence',
      type: 'environmental',
      difficulty: 3,
      description: 'Play musical notes in the correct sequence',
      setup: 'A magical instrument shows eight pads. A hymn teaches: Do-Re-Mi-Fa-Sol. Play this sequence.',
      solution: 'Press pads in musical order: C, D, E, F, G (first five notes)',
      hints: ['Follow the standard musical scale', 'The song is a basic diatonic melody', 'Each note appears only once'],
      interactive: null
    },
    {
      id: 'sliding-1',
      name: 'Sliding Tile Puzzle',
      type: 'mechanical',
      difficulty: 3,
      description: 'Rearrange numbered tiles to form sequence 1-8',
      setup: 'Eight wooden tiles are jumbled in a 3x3 grid. Slide them to form the numbers 1 through 8 in order with an empty space.',
      solution: '1 2 3 / 4 5 6 / 7 8 (empty)',
      hints: ['You can only slide tiles adjacent to the empty space', 'Think about the empty space as your working area', 'Try to form corners and edges first'],
      interactive: { type: 'grid', width: 3, height: 3 }
    },
    {
      id: 'mirror-1',
      name: 'Mirror Beam Redirection',
      type: 'mechanical',
      difficulty: 4,
      description: 'Redirect a light beam using mirrors to hit all targets',
      setup: 'A laser source emits a beam. Three mirrors surround the room at angles. You must hit all three targets using exactly two mirror bounces.',
      solution: 'Angle mirrors at 45°, 90°, and 135° to create correct light path',
      hints: ['Light reflects at equal angles to the mirror surface', 'Plan the path backwards from the final target', 'Each mirror can be rotated'],
      interactive: null
    },
    {
      id: 'wordplay-1',
      name: 'Acrostic Message',
      type: 'riddle',
      difficulty: 2,
      description: 'Read the hidden message in the first letter of each line',
      setup: '"The ancient tome\'s pages read: Doorways open to new knowledge. Remember to seek the hidden way. Always ask what\'s truly here. Go forth with understanding. Only knowledge brings you here. Never stop your quest."',
      solution: 'DRAM AGON (Dragon - read first letters)',
      hints: ['Look at the first letter of each line', 'Read downward', 'It spells a single word or name'],
      interactive: null
    },
    {
      id: 'sequence-1',
      name: 'Pattern Completion',
      type: 'logic',
      difficulty: 3,
      description: 'Complete the visual pattern',
      setup: 'Tiles show: ■ ■ □ / ■ □ ■ / ? □ □ - What goes in the ??',
      solution: '■ (filled square - alternating pattern)',
      hints: ['Look at each row and column', 'Count filled vs empty squares', 'Find the recurring pattern'],
      interactive: null
    },
    {
      id: 'balance-1',
      name: 'Balance Puzzle',
      type: 'logic',
      difficulty: 4,
      description: 'Determine which of three objects is heavier',
      setup: 'You have three gems and a balance scale. One weighs 100 gold, two weigh 50 each. You must identify the 100g gem in two weighings.',
      solution: 'Weigh A vs B. If equal, C is heavy. If unequal, weigh the heavier against another from the pair.',
      hints: ['In the first weighing, only A and B go on the scale', 'The result tells you which gem is which', 'Use the balance scale logically'],
      interactive: null
    }
  ];

  function CipherWheel({ puzzle, size = 200 }) {
    const [shift, setShift] = useState(puzzle.interactive?.shift || 0);
    const radius = size / 2;
    const innerRadius = radius * 0.5;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const rotatedLetters = letters.map((_, i) => letters[(i + shift) % 26]);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
        <svg width={size} height={size} style={{ border: `1px solid ${T.border}`, borderRadius: '50%', background: T.bg || 'var(--bg)' }}>
          <circle cx={radius} cy={radius} r={radius - 2} fill="none" stroke={T.border} strokeWidth="1" opacity="0.3" />
          <circle cx={radius} cy={radius} r={innerRadius} fill="none" stroke={T.border} strokeWidth="1" opacity="0.3" />
          {letters.map((letter, i) => {
            const angle = (i / 26) * Math.PI * 2 - Math.PI / 2;
            const x = radius + Math.cos(angle) * (radius - 20);
            const y = radius + Math.sin(angle) * (radius - 20);
            return (
              <text key={`outer-${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill={T.text} fontWeight="bold">
                {letter}
              </text>
            );
          })}
          {rotatedLetters.map((letter, i) => {
            const angle = (i / 26) * Math.PI * 2 - Math.PI / 2;
            const x = radius + Math.cos(angle) * innerRadius;
            const y = radius + Math.sin(angle) * innerRadius;
            return (
              <text key={`inner-${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill={T.gold} fontWeight="bold">
                {letter}
              </text>
            );
          })}
          <line x1={radius} y1={radius - innerRadius - 5} x2={radius} y2={5} stroke={T.gold} strokeWidth="2" />
        </svg>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setShift((s) => (s - 1 + 26) % 26)} style={{ padding: '4px 8px', background: T.bgCard, border: `1px solid ${T.border}`, color: T.text, cursor: 'pointer', borderRadius: '4px' }}>←</button>
          <span style={{ fontFamily: T.ui, fontSize: '14px', color: T.gold, fontWeight: 'bold', minWidth: '80px', textAlign: 'center' }}>Shift: {shift}</span>
          <button onClick={() => setShift((s) => (s + 1) % 26)} style={{ padding: '4px 8px', background: T.bgCard, border: `1px solid ${T.border}`, color: T.text, cursor: 'pointer', borderRadius: '4px' }}>→</button>
        </div>
      </div>
    );
  }

  function GridPuzzle({ puzzle, width = 3, height = 3, labels = [] }) {
    const [grid, setGrid] = useState(new Array(width * height).fill(0));
    const size = Math.min(200, 300 / Math.max(width, height));

    const toggleCell = (index) => {
      const newGrid = [...grid];
      newGrid[index] = newGrid[index] ? 0 : 1;
      setGrid(newGrid);
    };

    return (
      <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${width}, 1fr)`, gap: '4px', padding: '8px', background: T.bg || 'var(--bg)', borderRadius: '4px' }}>
          {grid.map((cell, idx) => (
            <div
              key={idx}
              onClick={() => toggleCell(idx)}
              style={{
                width: size,
                height: size,
                background: cell ? (T.gold) : (T.bgCard),
                border: `1px solid ${T.border}`,
                cursor: 'pointer',
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: cell ? T.bg : (T.text),
                transition: 'all 0.2s'
              }}
            >
              {labels[idx] || ''}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function PuzzleCard({ puzzle, onSelect, onEdit, onDelete }) {
    return (
      <div
        style={{
          background: T.bgCard,
          border: `1px solid ${T.border}`,
          borderRadius: '6px',
          padding: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.4)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)'; }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 4px 0', color: T.gold, fontFamily: T.heading, fontSize: '16px', fontWeight: 'bold' }}>
              {puzzle.name}
            </h3>
            <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: T.textDim }}>
              {puzzle.type.charAt(0).toUpperCase() + puzzle.type.slice(1)} • Difficulty {puzzle.difficulty}/5
            </p>
            {puzzle._contextualized && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '11px', color: T.green || 'var(--green)' }}>
                {puzzle._region && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {MapPin && <MapPin size={12} />} {puzzle._region}
                  </span>
                )}
                {puzzle._givenBy && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    By: {puzzle._givenBy}
                  </span>
                )}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {Array(puzzle.difficulty).fill(0).map((_, i) => (
              <Star key={i} size={12} fill={T.gold} color={T.gold} />
            ))}
          </div>
        </div>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: T.text, lineHeight: '1.4' }}>
          {puzzle.description}
        </p>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(puzzle); }}
            style={{
              flex: 1,
              padding: '6px 8px',
              background: T.gold,
              color: T.bg || 'var(--bg)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            Select
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(puzzle); }}
            style={{
              padding: '6px 8px',
              background: T.bgCard,
              color: T.text,
              border: `1px solid ${T.border}`,
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}
          >
            {Edit2 && <Edit2 size={14} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(puzzle.id); }}
            style={{
              padding: '6px 8px',
              background: T.bgCard,
              color: T.crimson,
              border: `1px solid ${T.crimson}`,
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px'
            }}
          >
            {Trash2 && <Trash2 size={14} />}
          </button>
        </div>
      </div>
    );
  }

  function PuzzleDetail({ puzzle, onClose, onAdd }) {
    const [hintsRevealed, setHintsRevealed] = useState(0);

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: T.bgCard,
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            border: `2px solid ${T.gold}`,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, color: T.gold, fontFamily: T.heading, fontSize: '22px' }}>
              {puzzle.name}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: T.text,
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              {X && <X size={20} />}
            </button>
          </div>

          <div style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${T.border}` }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: T.textDim }}>
              Type: {puzzle.type} • Difficulty: {puzzle.difficulty}/5 • Status: {puzzle.solved ? '✓ Solved' : 'Pending'}
            </p>
            {puzzle.timeTaken && <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: T.textDim }}>Time: {puzzle.timeTaken} min</p>}
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: T.gold, fontFamily: T.heading }}>Setup</h4>
            <p style={{ margin: 0, color: T.text, lineHeight: '1.6', fontStyle: 'italic' }}>"{puzzle.setup}"</p>
          </div>

          {puzzle.interactive && (
            <div style={{ marginBottom: '16px', padding: '12px', background: T.bg || 'var(--bg)', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 12px 0', color: T.gold, fontFamily: T.heading }}>Interactive Component</h4>
              {puzzle.interactive.type === 'wheel' && <CipherWheel puzzle={puzzle} />}
              {puzzle.interactive.type === 'grid' && <GridPuzzle puzzle={puzzle} width={puzzle.interactive.width} height={puzzle.interactive.height} labels={puzzle.interactive.labels} />}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: T.gold, fontFamily: T.heading }}>Hints ({hintsRevealed}/3)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {puzzle.hints.map((hint, i) => (
                <div key={i} style={{ opacity: i < hintsRevealed ? 1 : 0.5 }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: T.textDim, fontWeight: 'bold' }}>
                    Hint {i + 1}: {i < hintsRevealed ? hint : '(locked)'}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={() => setHintsRevealed(Math.min(hintsRevealed + 1, 3))}
              disabled={hintsRevealed >= 3}
              style={{
                marginTop: '8px',
                padding: '6px 12px',
                background: hintsRevealed >= 3 ? T.textDim : (T.gold),
                color: T.bg || 'var(--bg)',
                border: 'none',
                borderRadius: '4px',
                cursor: hintsRevealed >= 3 ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                opacity: hintsRevealed >= 3 ? 0.6 : 1
              }}
            >
              {LightbulbIcon && <LightbulbIcon size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />} Reveal Next Hint
            </button>
          </div>

          <div style={{ marginBottom: '16px', padding: '12px', background: T.crimsonSoft || 'rgba(220,53,69,0.1)', borderRadius: '4px', border: `1px solid ${T.crimson}` }}>
            <h4 style={{ margin: '0 0 8px 0', color: T.gold, fontFamily: T.heading }}>Solution (DM Only)</h4>
            <p style={{ margin: 0, color: T.text, fontWeight: 'bold', fontFamily: T.ui }}>
              {puzzle.solution}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { onAdd(puzzle); onClose(); }}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: T.gold,
                color: T.bg || 'var(--bg)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold'
              }}
            >
              {Plus && <span style={{ marginRight: '4px' }}>+</span>} Add to Session
            </button>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: T.bgCard,
                color: T.text,
                border: `1px solid ${T.border}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 'bold'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  function PuzzleCreator({ onSave, onCancel, data }) {
    const [form, setForm] = useState({
      name: '',
      type: 'riddle',
      difficulty: 3,
      description: '',
      setup: '',
      solution: '',
      hints: ['', '', ''],
      associatedRegion: '',
      associatedNpc: '',
      location: ''
    });

    const handleChange = (field, value) => {
      setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleHintChange = (idx, value) => {
      const newHints = [...form.hints];
      newHints[idx] = value;
      setForm(prev => ({ ...prev, hints: newHints }));
    };

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={onCancel}
      >
        <div
          style={{
            background: T.bgCard,
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            border: `2px solid ${T.gold}`,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={{ margin: '0 0 16px 0', color: T.gold, fontFamily: T.heading, fontSize: '22px' }}>
            Create Custom Puzzle
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: T.text }}>Name</label>
              <input
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: T.bg || 'var(--bg)',
                  border: `1px solid ${T.border}`,
                  borderRadius: '4px',
                  color: T.text,
                  boxSizing: 'border-box',
                  fontSize: '13px'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: T.text }}>Type</label>
                <select
                  value={form.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: T.bg || 'var(--bg)',
                    border: `1px solid ${T.border}`,
                    borderRadius: '4px',
                    color: T.text,
                    fontSize: '13px'
                  }}
                >
                  <option value="riddle">Riddle</option>
                  <option value="logic">Logic</option>
                  <option value="cipher">Cipher</option>
                  <option value="mechanical">Mechanical</option>
                  <option value="environmental">Environmental</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: T.text }}>Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => handleChange('difficulty', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: T.bg || 'var(--bg)',
                    border: `1px solid ${T.border}`,
                    borderRadius: '4px',
                    color: T.text,
                    fontSize: '13px'
                  }}
                >
                  {[1, 2, 3, 4, 5].map(d => <option key={d} value={d}>{d}/5</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: T.text }}>Description</label>
              <input
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: T.bg || 'var(--bg)',
                  border: `1px solid ${T.border}`,
                  borderRadius: '4px',
                  color: T.text,
                  boxSizing: 'border-box',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: T.text }}>Setup (what players hear)</label>
              <textarea
                value={form.setup}
                onChange={(e) => handleChange('setup', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: T.bg || 'var(--bg)',
                  border: `1px solid ${T.border}`,
                  borderRadius: '4px',
                  color: T.text,
                  boxSizing: 'border-box',
                  fontSize: '13px',
                  fontFamily: T.ui,
                  minHeight: '80px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: T.text }}>Solution (DM Only)</label>
              <input
                value={form.solution}
                onChange={(e) => handleChange('solution', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: T.bg || 'var(--bg)',
                  border: `1px solid ${T.border}`,
                  borderRadius: '4px',
                  color: T.text,
                  boxSizing: 'border-box',
                  fontSize: '13px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: T.text }}>Hints (3 levels)</label>
              {form.hints.map((hint, i) => (
                <input
                  key={i}
                  value={hint}
                  onChange={(e) => handleHintChange(i, e.target.value)}
                  placeholder={`Hint ${i + 1}: ${i === 0 ? 'vague' : i === 1 ? 'moderate' : 'obvious'}`}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    background: T.bg || 'var(--bg)',
                    border: `1px solid ${T.border}`,
                    borderRadius: '4px',
                    color: T.text,
                    boxSizing: 'border-box',
                    fontSize: '12px',
                    marginBottom: i < 2 ? '6px' : '0'
                  }}
                />
              ))}
            </div>

            <div style={{ padding: '12px', background: T.bg || 'var(--bg)', borderRadius: '4px', border: `1px dashed ${T.border}`, marginTop: '8px' }}>
              <p style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: 'bold', color: T.textDim }}>WORLD CONTEXT (Optional)</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: T.text }}>Associated Region</label>
                  <select
                    value={form.associatedRegion}
                    onChange={(e) => handleChange('associatedRegion', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: T.bgCard || 'var(--bgCard)',
                      border: `1px solid ${T.border}`,
                      borderRadius: '4px',
                      color: T.text,
                      fontSize: '13px'
                    }}
                  >
                    <option value="">None</option>
                    {data && data.regions && data.regions.map((region, i) => (
                      <option key={i} value={region.name}>{region.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: T.text }}>Associated NPC</label>
                  <select
                    value={form.associatedNpc}
                    onChange={(e) => handleChange('associatedNpc', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: T.bgCard || 'var(--bgCard)',
                      border: `1px solid ${T.border}`,
                      borderRadius: '4px',
                      color: T.text,
                      fontSize: '13px'
                    }}
                  >
                    <option value="">None</option>
                    {data && data.npcs && data.npcs.map((npc, i) => (
                      <option key={i} value={npc.name}>{npc.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: 'bold', color: T.text }}>Location</label>
                <select
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: T.bgCard || 'var(--bgCard)',
                    border: `1px solid ${T.border}`,
                    borderRadius: '4px',
                    color: T.text,
                    fontSize: '13px'
                  }}
                >
                  <option value="">None</option>
                  {data && data.cities && data.cities.map((city, i) => (
                    <option key={`city-${i}`} value={city.name}>{city.name} (City)</option>
                  ))}
                  {data && data.pois && data.pois.map((poi, i) => (
                    <option key={`poi-${i}`} value={poi.name}>{poi.name} (POI)</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={() => {
                  if (form.name && form.setup && form.solution) {
                    onSave(form);
                  }
                }}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: T.gold,
                  color: T.bg || 'var(--bg)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}
              >
                {Check && <span style={{ marginRight: '4px' }}>✓</span>} Create
              </button>
              <button
                onClick={onCancel}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  background: T.bgCard,
                  color: T.text,
                  border: `1px solid ${T.border}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function PuzzleStats({ data }) {
    const sessionPuzzles = data.puzzles || [];
    const totalPresented = sessionPuzzles.length;
    const totalSolved = sessionPuzzles.filter(p => p.solved).length;
    const solveRate = totalPresented > 0 ? Math.round((totalSolved / totalPresented) * 100) : 0;
    const avgHints = totalPresented > 0 ? (sessionPuzzles.reduce((sum, p) => sum + (p.hintsRevealed || 0), 0) / totalPresented).toFixed(1) : 0;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: T.textDim, fontWeight: 'bold' }}>PRESENTED</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: T.gold, fontFamily: T.ui }}>{totalPresented}</p>
        </div>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: T.textDim, fontWeight: 'bold' }}>SOLVED</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: T.gold, fontFamily: T.ui }}>{totalSolved}</p>
        </div>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: T.textDim, fontWeight: 'bold' }}>SOLVE RATE</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: T.gold, fontFamily: T.ui }}>{solveRate}%</p>
        </div>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: T.textDim, fontWeight: 'bold' }}>AVG HINTS</p>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: T.gold, fontFamily: T.ui }}>{avgHints}</p>
        </div>
      </div>
    );
  }

  function PuzzlePageView({ data, setData, viewRole }) {
    const [tab, setTab] = useState('library');
    const [selectedPuzzle, setSelectedPuzzle] = useState(null);
    const [showCreator, setShowCreator] = useState(false);
    const [filterType, setFilterType] = useState('all');
    const [filterDifficulty, setFilterDifficulty] = useState('all');
    const [filterRegion, setFilterRegion] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const allTemplates = useMemo(() => {
      return PUZZLE_TEMPLATES.concat((data.customPuzzles || []).map(p => ({ ...p, custom: true })));
    }, [data.customPuzzles]);

    const filteredPuzzles = useMemo(() => {
      return allTemplates.filter(p => {
        if (filterType !== 'all' && p.type !== filterType) return false;
        if (filterDifficulty !== 'all' && p.difficulty !== parseInt(filterDifficulty)) return false;
        if (filterRegion !== 'all' && p._region !== filterRegion) return false;
        if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase()) && !p.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
      });
    }, [allTemplates, filterType, filterDifficulty, filterRegion, searchTerm]);

    const handleAddPuzzle = (puzzle) => {
      // Contextualize puzzle with world data if available
      const contextualized = contextualizePuzzle(puzzle, data);
      const newSessionPuzzle = {
        ...contextualized,
        id: `session-${Date.now()}`,
        solved: false,
        hintsRevealed: 0,
        timeTaken: null,
        solvedBy: null
      };
      setData(prev => ({
        ...prev,
        puzzles: [...(prev.puzzles || []), newSessionPuzzle]
      }));
    };

    const handleSaveCustom = (puzzle) => {
      setData(prev => ({
        ...prev,
        customPuzzles: [...(prev.customPuzzles || []), { ...puzzle, id: `custom-${Date.now()}` }]
      }));
      setShowCreator(false);
    };

    const handleDeletePuzzle = (puzzleId) => {
      if (confirm('Delete this puzzle?')) {
        setData(prev => ({
          ...prev,
          puzzles: (prev.puzzles || []).filter(p => p.id !== puzzleId)
        }));
      }
    };

    const handleGenerateRandom = () => {
      const filtered = allTemplates.filter(p => !p.custom);
      if (filtered.length > 0) {
        const random = filtered[Math.floor(Math.random() * filtered.length)];
        setSelectedPuzzle(random);
      }
    };

    const handleMarkSolved = (puzzleId) => {
      setData(prev => ({
        ...prev,
        puzzles: (prev.puzzles || []).map(p =>
          p.id === puzzleId ? { ...p, solved: true } : p
        )
      }));
    };

    const puzzleTypeColors = {
      riddle: T.gold,
      logic: T.green || 'var(--green)',
      cipher: T.crimson,
      mechanical: T.orange || 'var(--orange)',
      environmental: T.gold
    };

    return (
      <div style={{ padding: '16px', color: T.text }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ margin: '0 0 12px 0', color: T.gold, fontFamily: T.heading, fontSize: '28px', fontWeight: 'bold' }}>
            {BookOpen && <BookOpen size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />} Puzzle Master
          </h1>
          <p style={{ margin: 0, color: T.textDim, fontSize: '13px' }}>
            Manage riddles, logic puzzles, and interactive challenges for your campaign.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {['library', 'session', 'stats'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 12px',
                background: tab === t ? (T.gold) : (T.bgCard),
                color: tab === t ? (T.bg || 'var(--bg)') : (T.text),
                border: tab === t ? 'none' : `1px solid ${T.border}`,
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              {t === 'library' && Layers && <Layers size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
              {t === 'session' && Target && <Target size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
              {t === 'stats' && Star && <Star size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === 'library' && (
          <div>
            <div style={{ marginBottom: '16px', padding: '12px', background: T.bgCard, borderRadius: '6px', border: `1px solid ${T.border}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: 'bold', color: T.textDim }}>SEARCH</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: T.bg || 'var(--bg)', borderRadius: '4px', border: `1px solid ${T.border}`, paddingLeft: '8px' }}>
                    {Search && <Search size={14} color={T.textDim} />}
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search puzzles..."
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        background: 'transparent',
                        border: 'none',
                        color: T.text,
                        outline: 'none',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: 'bold', color: T.textDim }}>TYPE</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      background: T.bg || 'var(--bg)',
                      border: `1px solid ${T.border}`,
                      borderRadius: '4px',
                      color: T.text,
                      fontSize: '12px'
                    }}
                  >
                    <option value="all">All Types</option>
                    <option value="riddle">Riddle</option>
                    <option value="logic">Logic</option>
                    <option value="cipher">Cipher</option>
                    <option value="mechanical">Mechanical</option>
                    <option value="environmental">Environmental</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: 'bold', color: T.textDim }}>DIFFICULTY</label>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      background: T.bg || 'var(--bg)',
                      border: `1px solid ${T.border}`,
                      borderRadius: '4px',
                      color: T.text,
                      fontSize: '12px'
                    }}
                  >
                    <option value="all">Any</option>
                    <option value="1">1 - Easy</option>
                    <option value="2">2 - Medium</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - Hard</option>
                    <option value="5">5 - Expert</option>
                  </select>
                </div>
                {data && data.regions && data.regions.length > 0 && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: 'bold', color: T.textDim }}>REGION</label>
                    <select
                      value={filterRegion}
                      onChange={(e) => setFilterRegion(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: T.bg || 'var(--bg)',
                        border: `1px solid ${T.border}`,
                        borderRadius: '4px',
                        color: T.text,
                        fontSize: '12px'
                      }}
                    >
                      <option value="all">All Regions</option>
                      {data.regions.map((region, i) => (
                        <option key={i} value={region.name}>{region.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowCreator(true)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: T.gold,
                    color: T.bg || 'var(--bg)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {Plus && <span style={{ marginRight: '4px' }}>+</span>} Create Custom
                </button>
                <button
                  onClick={handleGenerateRandom}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    background: T.bgCard,
                    color: T.text,
                    border: `1px solid ${T.border}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {Shuffle && <Shuffle size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />} Random
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
              {filteredPuzzles.map(puzzle => (
                <PuzzleCard
                  key={puzzle.id}
                  puzzle={puzzle}
                  onSelect={setSelectedPuzzle}
                  onEdit={() => setSelectedPuzzle(puzzle)}
                  onDelete={handleDeletePuzzle}
                />
              ))}
            </div>

            {filteredPuzzles.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: T.textDim }}>
                <p style={{ margin: 0, fontSize: '14px' }}>No puzzles match your filters.</p>
              </div>
            )}
          </div>
        )}

        {tab === 'session' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ margin: '0 0 12px 0', color: T.gold, fontFamily: T.heading, fontSize: '18px' }}>
                Session Puzzles ({(data.puzzles || []).length})
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                {(data.puzzles || []).map(puzzle => (
                  <div
                    key={puzzle.id}
                    style={{
                      background: T.bgCard,
                      border: `1px solid ${T.border}`,
                      borderRadius: '6px',
                      padding: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', color: T.gold, fontFamily: T.heading, fontSize: '15px', fontWeight: 'bold' }}>
                          {puzzle.name}
                        </h3>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: T.textDim }}>
                          {puzzle.type} • Difficulty {puzzle.difficulty}/5
                        </p>
                      </div>
                      {puzzle.solved && <span style={{ fontSize: '18px', color: T.gold }}>✓</span>}
                    </div>
                    <div style={{ marginBottom: '8px', fontSize: '12px', color: T.text }}>
                      <p style={{ margin: '4px 0', fontWeight: 'bold' }}>Hints: {puzzle.hintsRevealed}/3</p>
                      {puzzle.timeTaken && <p style={{ margin: '4px 0' }}>Time: {puzzle.timeTaken} min</p>}
                      {puzzle.solvedBy && <p style={{ margin: '4px 0' }}>Solved by: {puzzle.solvedBy}</p>}
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedPuzzle(puzzle)}
                        style={{
                          flex: 1,
                          padding: '6px 8px',
                          background: T.bgCard,
                          color: T.text,
                          border: `1px solid ${T.border}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}
                      >
                        View
                      </button>
                      {!puzzle.solved && (
                        <button
                          onClick={() => handleMarkSolved(puzzle.id)}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            background: T.gold,
                            color: T.bg || 'var(--bg)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: 'bold'
                          }}
                        >
                          Mark Solved
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePuzzle(puzzle.id)}
                        style={{
                          padding: '6px 8px',
                          background: T.crimsonSoft || 'rgba(220,53,69,0.1)',
                          color: T.crimson,
                          border: `1px solid ${T.crimson}`,
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}
                      >
                        {Trash2 && <Trash2 size={12} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {(data.puzzles || []).length === 0 && (
                <p style={{ textAlign: 'center', color: T.textDim, padding: '20px', fontSize: '13px' }}>
                  No puzzles added to session yet.
                </p>
              )}
            </div>
          </div>
        )}

        {tab === 'stats' && (
          <div>
            <h2 style={{ margin: '0 0 16px 0', color: T.gold, fontFamily: T.heading, fontSize: '18px' }}>
              Puzzle Statistics
            </h2>
            <PuzzleStats data={data} />
          </div>
        )}

        {selectedPuzzle && (
          <PuzzleDetail
            puzzle={selectedPuzzle}
            onClose={() => setSelectedPuzzle(null)}
            onAdd={handleAddPuzzle}
          />
        )}

        {showCreator && (
          <PuzzleCreator
            data={data}
            onSave={handleSaveCustom}
            onCancel={() => setShowCreator(false)}
          />
        )}
      </div>
    );
  }

  window.PuzzlePageView = PuzzlePageView;
})();
