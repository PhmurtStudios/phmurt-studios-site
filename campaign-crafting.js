/* ═══════════════════════════════════════════════════════════════════════════
   CRAFTING & ENCHANTMENT WORKSHOP — D&D Campaign Crafting Management
   Enables players to craft items, brew potions, scribe scrolls, and enchant
   equipment using gathered materials. Integrates with party data, economy,
   and stronghold systems.
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  // THEME CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────

  const T = window.__PHMURT_THEME || {
    bg: 'var(--bg)',
    bgNav: 'var(--bg-nav)',
    bgCard: 'var(--bg-card)',
    bgHover: 'var(--bg-hover)',
    text: 'var(--text)',
    textDim: 'var(--text-dim)',
    crimson: 'var(--crimson)',
    gold: 'var(--gold)',
    border: 'var(--border)',
    ui: "'Cinzel', serif",
    heading: "'Cinzel', serif",
    body: "'Spectral', Georgia, serif"
  };

  // ─────────────────────────────────────────────────────────────────────────
  // MATERIAL RARITIES & DATA
  // ─────────────────────────────────────────────────────────────────────────

  const MATERIAL_RARITIES = {
    common: { color: '#888888', multiplier: 1, label: 'Common' },
    uncommon: { color: '#1eff00', multiplier: 2, label: 'Uncommon' },
    rare: { color: '#0070dd', multiplier: 5, label: 'Rare' },
    veryRare: { color: '#a335ee', multiplier: 10, label: 'Very Rare' },
    legendary: { color: '#ff8000', multiplier: 25, label: 'Legendary' }
  };

  const MATERIALS = {
    // Metals
    iron_ingot: {
      name: 'Iron Ingot',
      rarity: 'common',
      type: 'metal',
      description: 'Standard forging metal',
      value: 5
    },
    steel_ingot: {
      name: 'Steel Ingot',
      rarity: 'uncommon',
      type: 'metal',
      description: 'Hardened alloy',
      value: 15
    },
    mithral_ingot: {
      name: 'Mithral Ingot',
      rarity: 'rare',
      type: 'metal',
      description: 'Lightweight magical metal',
      value: 100
    },
    adamantine_ingot: {
      name: 'Adamantine Ingot',
      rarity: 'veryRare',
      type: 'metal',
      description: 'Nearly indestructible metal',
      value: 250
    },
    // Hides & Cloth
    leather: {
      name: 'Leather',
      rarity: 'common',
      type: 'hide',
      description: 'Animal hide for armor',
      value: 3
    },
    dragon_scale: {
      name: 'Dragon Scale',
      rarity: 'veryRare',
      type: 'hide',
      description: 'Iridescent dragon hide',
      value: 200
    },
    spider_silk: {
      name: 'Spider Silk',
      rarity: 'uncommon',
      type: 'cloth',
      description: 'Impossibly strong fiber',
      value: 25
    },
    // Herbs & Reagents
    healing_herb: {
      name: 'Healing Herb',
      rarity: 'common',
      type: 'herb',
      description: 'Common medicinal plant',
      value: 2
    },
    moonpetal: {
      name: 'Moonpetal',
      rarity: 'uncommon',
      type: 'herb',
      description: 'Glows under moonlight',
      value: 15
    },
    phoenix_ash: {
      name: 'Phoenix Ash',
      rarity: 'legendary',
      type: 'reagent',
      description: 'Ashes of a risen phoenix',
      value: 500
    },
    dragon_blood: {
      name: "Dragon's Blood",
      rarity: 'rare',
      type: 'reagent',
      description: 'Essence of draconic power',
      value: 150
    },
    arcane_dust: {
      name: 'Arcane Dust',
      rarity: 'uncommon',
      type: 'reagent',
      description: 'Crystallized magical energy',
      value: 20
    },
    elemental_essence: {
      name: 'Elemental Essence',
      rarity: 'rare',
      type: 'reagent',
      description: 'Concentrated elemental power',
      value: 100
    },
    // Gems
    ruby: {
      name: 'Ruby',
      rarity: 'rare',
      type: 'gem',
      description: 'Deep crimson gemstone',
      value: 50
    },
    diamond_dust: {
      name: 'Diamond Dust',
      rarity: 'veryRare',
      type: 'gem',
      description: 'Ground diamond powder',
      value: 200
    },
    soul_gem: {
      name: 'Soul Gem',
      rarity: 'legendary',
      type: 'gem',
      description: 'Captures a fragment of soul',
      value: 1000
    },
    // Wood & Bone
    ironwood: {
      name: 'Ironwood',
      rarity: 'uncommon',
      type: 'wood',
      description: 'Wood hard as iron',
      value: 10
    },
    bone: {
      name: 'Monster Bone',
      rarity: 'common',
      type: 'bone',
      description: 'Large creature bone',
      value: 5
    },
    elder_wood: {
      name: 'Elder Treant Wood',
      rarity: 'rare',
      type: 'wood',
      description: 'Ancient wood of power',
      value: 75
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RECIPES DATABASE
  // ─────────────────────────────────────────────────────────────────────────

  const RECIPES = {
    // Weapons
    longsword: {
      name: 'Longsword',
      category: 'weapon',
      materials: { iron_ingot: 2, leather: 1 },
      hours: 8,
      dc: 12,
      tools: 'smith',
      result: {
        name: 'Longsword',
        damage: '1d8 slashing',
        value: 15,
        properties: []
      }
    },
    mithral_rapier: {
      name: 'Mithral Rapier',
      category: 'weapon',
      materials: { mithral_ingot: 2, leather: 1 },
      hours: 24,
      dc: 16,
      tools: 'smith',
      result: {
        name: 'Mithral Rapier',
        damage: '1d8 piercing',
        value: 500,
        properties: ['finesse', 'lightweight']
      }
    },
    // Armor
    chain_mail: {
      name: 'Chain Mail',
      category: 'armor',
      materials: { iron_ingot: 4, leather: 2 },
      hours: 16,
      dc: 14,
      tools: 'smith',
      result: {
        name: 'Chain Mail',
        ac: 16,
        value: 75,
        properties: []
      }
    },
    dragon_scale_armor: {
      name: 'Dragon Scale Mail',
      category: 'armor',
      materials: { dragon_scale: 5, steel_ingot: 2, leather: 3 },
      hours: 48,
      dc: 18,
      tools: 'smith',
      result: {
        name: 'Dragon Scale Mail',
        ac: 17,
        value: 2000,
        properties: ['resistance to dragon element']
      }
    },
    // Potions
    healing_potion: {
      name: 'Potion of Healing',
      category: 'potion',
      materials: { healing_herb: 2, arcane_dust: 1 },
      hours: 2,
      dc: 10,
      tools: 'alchemist',
      result: {
        name: 'Potion of Healing',
        effect: 'Heals 2d4+2 HP',
        value: 50,
        properties: []
      }
    },
    greater_healing: {
      name: 'Potion of Greater Healing',
      category: 'potion',
      materials: { healing_herb: 4, moonpetal: 2, arcane_dust: 2 },
      hours: 6,
      dc: 14,
      tools: 'alchemist',
      result: {
        name: 'Potion of Greater Healing',
        effect: 'Heals 4d4+4 HP',
        value: 150,
        properties: []
      }
    },
    potion_of_fire_resistance: {
      name: 'Potion of Fire Resistance',
      category: 'potion',
      materials: { elemental_essence: 1, dragon_blood: 1 },
      hours: 4,
      dc: 14,
      tools: 'alchemist',
      result: {
        name: 'Potion of Fire Resistance',
        effect: 'Resistance to fire for 1 hour',
        value: 200,
        properties: []
      }
    },
    invisibility_potion: {
      name: 'Potion of Invisibility',
      category: 'potion',
      materials: { moonpetal: 3, spider_silk: 2, arcane_dust: 3 },
      hours: 8,
      dc: 16,
      tools: 'alchemist',
      result: {
        name: 'Potion of Invisibility',
        effect: 'Invisible for 1 hour',
        value: 300,
        properties: []
      }
    },
    // Scrolls
    scroll_fireball: {
      name: 'Scroll of Fireball',
      category: 'scroll',
      materials: { arcane_dust: 3, phoenix_ash: 1 },
      hours: 6,
      dc: 15,
      tools: 'calligrapher',
      result: {
        name: 'Scroll of Fireball',
        effect: 'Cast Fireball (3rd level)',
        value: 200,
        properties: []
      }
    },
    scroll_revivify: {
      name: 'Scroll of Revivify',
      category: 'scroll',
      materials: { diamond_dust: 1, healing_herb: 3 },
      hours: 8,
      dc: 16,
      tools: 'calligrapher',
      result: {
        name: 'Scroll of Revivify',
        effect: 'Cast Revivify',
        value: 500,
        properties: []
      }
    },
    // Enchantments
    enchant_flaming: {
      name: 'Flaming Enchantment',
      category: 'enchantment',
      materials: { elemental_essence: 2, ruby: 1, arcane_dust: 5 },
      hours: 16,
      dc: 16,
      tools: 'arcana',
      result: {
        name: '+1d6 Fire Damage',
        effect: 'Weapon deals extra 1d6 fire damage',
        value: 1000,
        properties: []
      }
    },
    enchant_protection: {
      name: 'Protection Enchantment',
      category: 'enchantment',
      materials: { mithral_ingot: 1, diamond_dust: 1, arcane_dust: 3 },
      hours: 12,
      dc: 15,
      tools: 'arcana',
      result: {
        name: '+1 AC',
        effect: 'Armor grants +1 AC',
        value: 800,
        properties: []
      }
    },
    enchant_healing: {
      name: 'Healing Enchantment',
      category: 'enchantment',
      materials: { healing_herb: 5, moonpetal: 3, soul_gem: 1 },
      hours: 24,
      dc: 18,
      tools: 'arcana',
      result: {
        name: 'Self-Healing',
        effect: 'Regain 1d4 HP at dawn',
        value: 2000,
        properties: []
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CRAFTING ENGINE
  // ─────────────────────────────────────────────────────────────────────────

  class CraftingEngine {
    constructor(campaignData) {
      this.party = campaignData.party || [];
      this.strongholds = campaignData.strongholds || [];
      // Data is managed via setData in React component
    }

    /**
     * Check if party member can craft recipe
     */
    canCraft(party, crafterId, recipeId, materials) {
      const recipe = RECIPES[recipeId];
      if (!recipe) return { canCraft: false, reason: 'Recipe not found' };

      const crafter = party.find(p => p.id === crafterId);
      if (!crafter) return { canCraft: false, reason: 'Crafter not found' };

      // Check tool proficiency (simplified: all party members can attempt)
      // In full system, check proficiencies against recipe.tools

      // Check materials
      for (const [matId, needed] of Object.entries(recipe.materials)) {
        const have = materials[matId] || 0;
        if (have < needed) {
          return {
            canCraft: false,
            reason: `Need ${needed} ${MATERIALS[matId]?.name}, have ${have}`
          };
        }
      }

      return { canCraft: true };
    }

    /**
     * Start a crafting project
     */
    startProject(data, recipeId, crafterId) {
      const recipe = RECIPES[recipeId];
      if (!recipe) throw new Error('Recipe not found');

      const crafter = data.party?.find(p => p.id === crafterId);
      if (!crafter) throw new Error('Crafter not found');

      const check = this.canCraft(data.party, crafterId, recipeId, data.crafting?.inventory || {});
      if (!check.canCraft) throw new Error(check.reason);

      const projectId = 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);

      return {
        id: projectId,
        recipeId,
        crafterId,
        crafterName: crafter.name,
        hoursWorked: 0,
        hoursNeeded: recipe.hours,
        started: Date.now(),
        status: 'in_progress'
      };
    }

    /**
     * Advance project hours
     */
    advanceHours(project, hours) {
      const updated = { ...project, hoursWorked: project.hoursWorked + hours };

      if (updated.hoursWorked >= updated.hoursNeeded) {
        updated.status = 'ready_for_check';
      }

      return updated;
    }

    /**
     * Resolve crafting check (DC vs roll)
     * Returns: { success, quality, item }
     */
    resolveCraft(recipe, crafter, d20Roll) {
      const profBonus = Math.ceil(crafter.level / 4) + 1;
      const abilityMod = 2; // Simplified: average of relevant ability
      const totalRoll = d20Roll + profBonus + abilityMod;

      const success = totalRoll >= recipe.dc;
      let quality = 'standard';

      if (d20Roll === 20) {
        quality = 'masterwork';
      } else if (!success && totalRoll >= recipe.dc - 5) {
        quality = 'flawed';
      } else if (!success) {
        quality = 'failed';
      }

      return {
        success: success || quality === 'flawed' || quality === 'masterwork',
        quality,
        totalRoll,
        needed: recipe.dc,
        item: quality !== 'failed' ? { ...recipe.result } : null
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // REACT COMPONENTS
  // ─────────────────────────────────────────────────────────────────────────

  const { useState, useEffect, useRef, useCallback } = React;

  function MaterialCard({ materialId, quantity, material }) {
    const rarity = MATERIAL_RARITIES[material.rarity];

    return React.createElement(
      'div',
      {
        style: {
          padding: '12px',
          backgroundColor: T.bgCard,
          border: `2px solid ${rarity.color}`,
          borderRadius: '8px',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 4px 12px ${rarity.color}40`;
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      },
      React.createElement(
        'h4',
        { style: { margin: '0 0 6px 0', fontSize: '14px', fontWeight: '600', color: rarity.color } },
        material.name
      ),
      React.createElement(
        'p',
        { style: { margin: '0 0 8px 0', fontSize: '11px', color: T.textDim } },
        rarity.label
      ),
      React.createElement(
        'div',
        { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' } },
        React.createElement(
          'span',
          {
            style: {
              padding: '4px 8px',
              backgroundColor: rarity.color,
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 'bold'
            }
          },
          quantity
        )
      )
    );
  }

  function RecipeCard({ recipeId, recipe, canCraft, onCraft, viewRole }) {
    const [showDetails, setShowDetails] = useState(false);

    return React.createElement(
      'div',
      {
        style: {
          padding: '14px',
          backgroundColor: T.bgCard,
          border: `2px solid ${T.border}`,
          borderRadius: '8px',
          transition: 'all 0.2s ease'
        }
      },
      React.createElement(
        'div',
        { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' } },
        React.createElement(
          'div',
          {},
          React.createElement('h4', { style: { margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: T.text } }, recipe.name),
          React.createElement('p', { style: { margin: '0 0 4px 0', fontSize: '12px', color: T.textDim } }, `Category: ${recipe.category}`),
          React.createElement('p', { style: { margin: '0', fontSize: '12px', color: T.textDim } }, `DC: ${recipe.dc} | Hours: ${recipe.hours}`)
        ),
        React.createElement(
          'button',
          {
            onClick: () => setShowDetails(!showDetails),
            style: {
              padding: '6px 12px',
              backgroundColor: T.bgHover,
              color: T.text,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }
          },
          showDetails ? 'Hide' : 'Details'
        )
      ),
      React.createElement(
        'div',
        { style: { marginBottom: '10px' } },
        React.createElement(
          'p',
          { style: { margin: '0 0 6px 0', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: T.gold } },
          'Materials Required:'
        ),
        React.createElement(
          'div',
          { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
          Object.entries(recipe.materials).map(([matId, needed]) => {
            const material = MATERIALS[matId];
            const have = (typeof window !== 'undefined' && window._currentCraftingInventory?.[matId]) || 0;
            const haveEnough = have >= needed;

            return React.createElement(
              'span',
              {
                key: matId,
                style: {
                  padding: '4px 8px',
                  backgroundColor: haveEnough ? T.bgHover : '#300000',
                  color: haveEnough ? T.gold : T.crimson,
                  borderRadius: '4px',
                  fontSize: '11px'
                }
              },
              `${material.name} (${have}/${needed})`
            );
          })
        )
      ),
      showDetails &&
        React.createElement(
          React.Fragment,
          {},
          React.createElement(
            'div',
            { style: { marginBottom: '10px', paddingTop: '10px', borderTop: `1px solid ${T.border}` } },
            React.createElement(
              'p',
              { style: { margin: '0 0 6px 0', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: T.gold } },
              'Result:'
            ),
            React.createElement('p', { style: { margin: '0', fontSize: '12px', color: T.text } }, recipe.result.name),
            recipe.result.effect && React.createElement('p', { style: { margin: '4px 0 0 0', fontSize: '11px', color: T.textDim } }, recipe.result.effect),
            recipe.result.damage && React.createElement('p', { style: { margin: '4px 0 0 0', fontSize: '11px', color: T.textDim } }, `Damage: ${recipe.result.damage}`),
            recipe.result.ac && React.createElement('p', { style: { margin: '4px 0 0 0', fontSize: '11px', color: T.textDim } }, `AC: ${recipe.result.ac}`)
          )
        ),
      viewRole === 'dm' &&
        React.createElement(
          'button',
          {
            onClick: onCraft,
            disabled: !canCraft,
            style: {
              width: '100%',
              padding: '8px',
              marginTop: '10px',
              backgroundColor: canCraft ? T.gold : T.textDim,
              color: canCraft ? '#000' : '#666',
              border: 'none',
              borderRadius: '4px',
              cursor: canCraft ? 'pointer' : 'not-allowed',
              fontSize: '13px',
              fontWeight: '600'
            }
          },
          'Start Crafting'
        )
    );
  }

  function ProjectCard({ project, recipe, data, setData, viewRole }) {
    const progressPercent = Math.min(100, project.hoursNeeded > 0 ? (project.hoursWorked / project.hoursNeeded) * 100 : 0);

    const handleAdvanceHours = (hours) => {
      setData((prev) => ({
        ...prev,
        crafting: {
          ...prev.crafting,
          activeProjects: prev.crafting.activeProjects.map((p) =>
            p.id === project.id
              ? {
                  ...p,
                  hoursWorked: Math.min(p.hoursWorked + hours, p.hoursNeeded),
                  status: p.hoursWorked + hours >= p.hoursNeeded ? 'ready_for_check' : p.status
                }
              : p
          )
        }
      }));
    };

    const handleResolveCheck = () => {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const crafter = data.party?.find((p) => p.id === project.crafterId) || {};
      const engine = new CraftingEngine(data);
      const result = engine.resolveCraft(recipe, crafter, d20);

      const completedItem = {
        id: 'item_' + Date.now(),
        name: result.item?.name || recipe.result.name,
        recipeId: project.recipeId,
        crafterName: project.crafterName,
        quality: result.quality,
        completedAt: Date.now(),
        properties: result.item?.properties || []
      };

      setData((prev) => ({
        ...prev,
        crafting: {
          ...prev.crafting,
          activeProjects: prev.crafting.activeProjects.filter((p) => p.id !== project.id),
          completedItems: [...(prev.crafting.completedItems || []), completedItem],
          craftingLog: [
            ...(prev.crafting.craftingLog || []),
            {
              timestamp: Date.now(),
              message: `${project.crafterName} completed crafting check for ${recipe.result.name}. Result: ${result.quality} (rolled ${d20 + 2} vs DC ${recipe.dc})`,
              type: result.success ? 'success' : 'failure'
            }
          ]
        }
      }));
    };

    return React.createElement(
      'div',
      {
        style: {
          padding: '14px',
          backgroundColor: T.bgCard,
          border: `2px solid ${project.status === 'ready_for_check' ? T.gold : T.border}`,
          borderRadius: '8px'
        }
      },
      React.createElement(
        'div',
        { style: { marginBottom: '10px' } },
        React.createElement('h4', { style: { margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: T.text } }, `${recipe.name} by ${project.crafterName}`),
        React.createElement(
          'p',
          { style: { margin: '0', fontSize: '12px', color: T.textDim } },
          `Status: ${project.status === 'ready_for_check' ? 'Ready for Check' : 'In Progress'}`
        )
      ),
      React.createElement(
        'div',
        { style: { marginBottom: '10px' } },
        React.createElement(
          'div',
          { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' } },
          React.createElement('span', { style: { fontSize: '12px', color: T.textDim } }, 'Progress'),
          React.createElement('span', { style: { fontSize: '12px', color: T.gold, fontWeight: '600' } }, `${project.hoursWorked}/${project.hoursNeeded} hours`)
        ),
        React.createElement('div', {
          style: {
            width: '100%',
            height: '8px',
            backgroundColor: T.bgHover,
            borderRadius: '4px',
            overflow: 'hidden'
          }
        },
          React.createElement('div', {
            style: {
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: T.gold,
              transition: 'width 0.3s ease'
            }
          })
        )
      ),
      viewRole === 'dm' &&
        React.createElement(
          'div',
          { style: { display: 'flex', gap: '6px' } },
          React.createElement(
            'button',
            {
              onClick: () => handleAdvanceHours(4),
              style: {
                flex: 1,
                padding: '8px',
                backgroundColor: T.crimson,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600'
              }
            },
            '+4h'
          ),
          React.createElement(
            'button',
            {
              onClick: () => handleAdvanceHours(8),
              style: {
                flex: 1,
                padding: '8px',
                backgroundColor: T.crimson,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600'
              }
            },
            '+8h'
          ),
          project.status === 'ready_for_check' &&
            React.createElement(
              'button',
              {
                onClick: handleResolveCheck,
                style: {
                  flex: 1,
                  padding: '8px',
                  backgroundColor: T.gold,
                  color: '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }
              },
              'Resolve'
            )
        )
    );
  }

  function CraftingView({ data, setData, viewRole }) {
    const [activeTab, setActiveTab] = useState('inventory');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [selectedCrafter, setSelectedCrafter] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const debounceTimer = useRef(null);

    // Initialize crafting data if not present
    useEffect(() => {
      if (!data.crafting) {
        setData((prev) => ({
          ...prev,
          crafting: {
            inventory: {},
            activeProjects: [],
            completedItems: [],
            craftingLog: []
          }
        }));
      }
    }, [data, setData]);

    // Store inventory in window for recipe cards to access
    useEffect(() => {
      window._currentCraftingInventory = data.crafting?.inventory || {};
    }, [data.crafting?.inventory]);

    // Auto-save with debounce
    useEffect(() => {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        // Auto-save would happen here via parent component
      }, 500);

      return () => clearTimeout(debounceTimer.current);
    }, [data.crafting]);

    const handleAddMaterial = (materialId, quantity) => {
      if (viewRole !== 'dm') return;

      setData((prev) => ({
        ...prev,
        crafting: {
          ...prev.crafting,
          inventory: {
            ...prev.crafting.inventory,
            [materialId]: (prev.crafting.inventory?.[materialId] || 0) + quantity
          },
          craftingLog: [
            ...(prev.crafting.craftingLog || []),
            {
              timestamp: Date.now(),
              message: `${quantity} ${MATERIALS[materialId]?.name} added to inventory`,
              type: 'material'
            }
          ]
        }
      }));
    };

    const handleRemoveMaterial = (materialId, quantity) => {
      if (viewRole !== 'dm') return;

      setData((prev) => ({
        ...prev,
        crafting: {
          ...prev.crafting,
          inventory: {
            ...prev.crafting.inventory,
            [materialId]: Math.max(0, (prev.crafting.inventory?.[materialId] || 0) - quantity)
          }
        }
      }));
    };

    const handleStartCraft = (recipeId) => {
      setSelectedRecipe(recipeId);
    };

    const handleConfirmCraft = () => {
      if (!selectedRecipe || !selectedCrafter) return;

      const engine = new CraftingEngine(data);
      const project = engine.startProject(data, selectedRecipe, selectedCrafter);

      // Consume materials
      const recipe = RECIPES[selectedRecipe];
      const newInventory = { ...data.crafting.inventory };
      Object.entries(recipe.materials).forEach(([matId, amount]) => {
        newInventory[matId] = (newInventory[matId] || 0) - amount;
      });

      setData((prev) => ({
        ...prev,
        crafting: {
          ...prev.crafting,
          inventory: newInventory,
          activeProjects: [...(prev.crafting.activeProjects || []), project],
          craftingLog: [
            ...(prev.crafting.craftingLog || []),
            {
              timestamp: Date.now(),
              message: `${selectedCrafter} started crafting ${recipe.name}`,
              type: 'start'
            }
          ]
        }
      }));

      setSelectedRecipe(null);
      setSelectedCrafter(null);
    };

    const craftingData = data.crafting || { inventory: {}, activeProjects: [], completedItems: [], craftingLog: [] };
    const categories = ['all', 'weapon', 'armor', 'potion', 'scroll', 'enchantment'];
    const filteredRecipes = categoryFilter === 'all' ? Object.entries(RECIPES) : Object.entries(RECIPES).filter(([_, r]) => r.category === categoryFilter);

    return React.createElement(
      'div',
      { style: { padding: '16px', backgroundColor: T.bg, color: T.text, fontFamily: T.body } },
      // Header
      React.createElement(
        'div',
        { style: { marginBottom: '24px' } },
        React.createElement('h2', { style: { margin: '0 0 4px 0', fontSize: '28px', fontWeight: 'bold', fontFamily: T.heading } }, 'Crafting & Enchantment Workshop'),
        React.createElement('p', { style: { margin: '0', fontSize: '13px', color: T.textDim } }, 'Create items, brew potions, scribe scrolls, and enchant equipment')
      ),

      // Tab Bar
      React.createElement(
        'div',
        { style: { display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: `2px solid ${T.border}` } },
        ['inventory', 'recipes', 'workshop', 'completed'].map((tab) =>
          React.createElement(
            'button',
            {
              key: tab,
              onClick: () => setActiveTab(tab),
              style: {
                padding: '10px 16px',
                backgroundColor: activeTab === tab ? T.crimson : 'transparent',
                color: activeTab === tab ? 'white' : T.textDim,
                border: 'none',
                borderBottom: activeTab === tab ? `3px solid ${T.gold}` : 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                textTransform: 'capitalize'
              }
            },
            tab
          )
        )
      ),

      // Inventory Tab
      activeTab === 'inventory' &&
        React.createElement(
          'div',
          {},
          viewRole === 'dm' &&
            React.createElement(
              'div',
              { style: { marginBottom: '20px', padding: '14px', backgroundColor: T.bgCard, border: `2px solid ${T.border}`, borderRadius: '8px' } },
              React.createElement('h3', { style: { margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600' } }, 'Add Materials (DM Only)'),
              React.createElement(
                'div',
                { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' } },
                Object.entries(MATERIALS).slice(0, 8).map(([matId, material]) =>
                  React.createElement(
                    'div',
                    { key: matId, style: { display: 'flex', gap: '4px' } },
                    React.createElement(
                      'button',
                      {
                        onClick: () => handleAddMaterial(matId, 1),
                        style: {
                          flex: 1,
                          padding: '6px',
                          backgroundColor: T.crimson,
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }
                      },
                      `+${material.name}`
                    ),
                    React.createElement(
                      'button',
                      {
                        onClick: () => handleRemoveMaterial(matId, 1),
                        style: {
                          padding: '6px 8px',
                          backgroundColor: T.bgHover,
                          color: T.crimson,
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }
                      },
                      '-'
                    )
                  )
                )
              )
            ),
          React.createElement(
            'div',
            { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' } },
            Object.entries(craftingData.inventory).map(([matId, quantity]) =>
              quantity > 0 &&
                React.createElement(MaterialCard, {
                  key: matId,
                  materialId: matId,
                  quantity,
                  material: MATERIALS[matId]
                })
            )
          ),
          Object.values(craftingData.inventory).every((q) => q <= 0) &&
            React.createElement(
              'div',
              { style: { padding: '24px', textAlign: 'center', color: T.textDim } },
              'No materials yet. Add some to get started!'
            )
        ),

      // Recipes Tab
      activeTab === 'recipes' &&
        React.createElement(
          'div',
          {},
          React.createElement(
            'div',
            { style: { marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' } },
            categories.map((cat) =>
              React.createElement(
                'button',
                {
                  key: cat,
                  onClick: () => setCategoryFilter(cat),
                  style: {
                    padding: '6px 12px',
                    backgroundColor: categoryFilter === cat ? T.crimson : T.bgCard,
                    color: categoryFilter === cat ? 'white' : T.text,
                    border: `1px solid ${T.border}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }
                },
                cat
              )
            )
          ),
          React.createElement(
            'div',
            { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
            filteredRecipes.map(([recipeId, recipe]) => {
              const engine = new CraftingEngine(data);
              const canCraft = engine.canCraft(data.party || [], selectedCrafter || '', recipeId, craftingData.inventory).canCraft;

              return React.createElement(RecipeCard, {
                key: recipeId,
                recipeId,
                recipe,
                canCraft,
                onCraft: () => handleStartCraft(recipeId),
                viewRole
              });
            })
          )
        ),

      // Workshop Tab
      activeTab === 'workshop' &&
        React.createElement(
          'div',
          {},
          React.createElement(
            'div',
            { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
            craftingData.activeProjects?.length === 0
              ? React.createElement(
                  'div',
                  { style: { padding: '24px', textAlign: 'center', color: T.textDim } },
                  'No active projects. Start crafting!'
                )
              : craftingData.activeProjects?.map((project) =>
                  React.createElement(ProjectCard, {
                    key: project.id,
                    project,
                    recipe: RECIPES[project.recipeId],
                    data,
                    setData,
                    viewRole
                  })
                )
          )
        ),

      // Completed Tab
      activeTab === 'completed' &&
        React.createElement(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
          craftingData.completedItems?.length === 0
            ? React.createElement(
                'div',
                { style: { padding: '24px', textAlign: 'center', color: T.textDim } },
                'No completed items yet.'
              )
            : craftingData.completedItems?.map((item) => {
                const qualityColors = {
                  masterwork: T.gold,
                  standard: T.gold,
                  flawed: T.crimson
                };

                return React.createElement(
                  'div',
                  {
                    key: item.id,
                    style: {
                      padding: '14px',
                      backgroundColor: T.bgCard,
                      border: `2px solid ${qualityColors[item.quality]}`,
                      borderRadius: '8px'
                    }
                  },
                  React.createElement(
                    'div',
                    { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' } },
                    React.createElement(
                      'div',
                      {},
                      React.createElement('h4', { style: { margin: '0 0 4px 0', fontSize: '15px', fontWeight: '600', color: T.text } }, item.name),
                      React.createElement('p', { style: { margin: '0', fontSize: '12px', color: T.textDim } }, `Crafter: ${item.crafterName}`)
                    ),
                    React.createElement(
                      'span',
                      {
                        style: {
                          padding: '6px 12px',
                          backgroundColor: qualityColors[item.quality],
                          color: item.quality === 'flawed' ? 'white' : '#000',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase'
                        }
                      },
                      item.quality
                    )
                  )
                );
              })
        ),

      // Crafter Selection Modal
      selectedRecipe &&
        React.createElement(
          'div',
          {
            style: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }
          },
          React.createElement(
            'div',
            {
              style: {
                backgroundColor: T.bgCard,
                border: `2px solid ${T.gold}`,
                borderRadius: '8px',
                padding: '20px',
                maxWidth: '500px',
                width: '90%'
              }
            },
            React.createElement(
              'h3',
              { style: { margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: T.gold } },
              `Select Crafter for ${RECIPES[selectedRecipe]?.name}`
            ),
            React.createElement(
              'div',
              { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' } },
              (data.party || []).map((member) =>
                React.createElement(
                  'button',
                  {
                    key: member.id,
                    onClick: () => setSelectedCrafter(member.id),
                    style: {
                      padding: '12px',
                      backgroundColor: selectedCrafter === member.id ? T.crimson : T.bgHover,
                      color: selectedCrafter === member.id ? 'white' : T.text,
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                      textAlign: 'left'
                    }
                  },
                  `${member.name} (Lvl ${member.level} ${member.class})`
                )
              )
            ),
            React.createElement(
              'div',
              { style: { display: 'flex', gap: '8px' } },
              React.createElement(
                'button',
                {
                  onClick: handleConfirmCraft,
                  disabled: !selectedCrafter,
                  style: {
                    flex: 1,
                    padding: '10px',
                    backgroundColor: selectedCrafter ? T.crimson : T.textDim,
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: selectedCrafter ? 'pointer' : 'not-allowed',
                    fontSize: '13px',
                    fontWeight: '600'
                  }
                },
                'Start Crafting'
              ),
              React.createElement(
                'button',
                {
                  onClick: () => {
                    setSelectedRecipe(null);
                    setSelectedCrafter(null);
                  },
                  style: {
                    flex: 1,
                    padding: '10px',
                    backgroundColor: T.bgHover,
                    color: T.text,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600'
                  }
                },
                'Cancel'
              )
            )
          )
        )
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EXPORTS
  // ─────────────────────────────────────────────────────────────────────────

  window.CraftingView = CraftingView;
  window.CraftingEngine = CraftingEngine;
  window.MATERIALS = MATERIALS;
  window.RECIPES = RECIPES;
  window.MATERIAL_RARITIES = MATERIAL_RARITIES;
})();
