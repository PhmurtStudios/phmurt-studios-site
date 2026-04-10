// Set up minimal DOM mocks
global.window = global;
global.document = {
  createElement(tag) {
    return {
      width: 800, height: 600, clientWidth: 800, clientHeight: 600,
      style: {},
      getContext() {
        return new Proxy({
          canvas: { width: 800, height: 600, clientWidth: 800, clientHeight: 600 },
          font: '', fillStyle: '', strokeStyle: '', lineWidth: 1,
          textAlign: '', textBaseline: '', globalAlpha: 1, globalCompositeOperation: '',
          lineCap: '', lineJoin: '', shadowColor: '', shadowBlur: 0,
          shadowOffsetX: 0, shadowOffsetY: 0,
          measureText() { return { width: 50 }; },
          setLineDash() {}, getLineDash() { return []; },
          getImageData() { return { data: new Uint8ClampedArray(4) }; },
        }, { get(t, p) { return p in t ? t[p] : typeof t[p] === 'undefined' ? function() { return t; } : t[p]; } });
      },
      getBoundingClientRect() { return { width: 800, height: 600, left: 0, top: 0 }; },
      addEventListener() {}, removeEventListener() {},
    };
  },
  addEventListener() {}, removeEventListener() {},
};
global.devicePixelRatio = 1;
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.ResizeObserver = class { observe(){} disconnect(){} };
global.addEventListener = () => {};
global.removeEventListener = () => {};
global.navigator = { userAgent: 'test' };

require('./mnt/Reginald/campaign-map-engine.js');
require('./mnt/Reginald/campaign-map-bridge.js');

const canvas = global.document.createElement('canvas');
const seed = 42;

const engine = new global.MapEngine(canvas);
engine.generate(seed);

const worldData = global.mapEngineToWorldData(engine, seed);

// === SIMULATE LIVING-WORLD.JS QUERIES ===
console.log("=== Living World Integration Test (seed 42) ===\n");

// living-world.js: data.factions.filter(f => f.power > 20)
const powerfulFactions = worldData.factions.filter(f => f.power > 20);
console.log(`Factions with power > 20: ${powerfulFactions.length}/${worldData.factions.length}`);
console.log(`  Names: ${powerfulFactions.map(f => f.name).join(', ')}`);

// living-world.js: data.factions.find(f => f.name === bName)
const testFaction = worldData.factions[0];
const found = worldData.factions.find(f => f.name === testFaction.name);
console.log(`\nFaction lookup by name "${testFaction.name}": ${found ? '✓' : '✗'}`);

// living-world.js: data.regions.filter(r => r.ctrl === f.name)
const controlledRegions = worldData.regions.filter(r => r.ctrl === testFaction.name);
console.log(`Regions controlled by "${testFaction.name}": ${controlledRegions.length}`);

// living-world.js: data.regions.filter(r => r.state === "stable")
const stableRegions = worldData.regions.filter(r => r.state === "stable");
console.log(`Stable regions: ${stableRegions.length}/${worldData.regions.length}`);

// living-world.js: f.allies and f.rivals
console.log(`\nFaction relationships:`);
for (const f of worldData.factions.slice(0, 3)) {
  console.log(`  ${f.name}: allies=[${f.allies.join(',')}] rivals=[${f.rivals.join(',')}]`);
}

// living-world.js: f.hierarchy
console.log(`\nFaction hierarchies:`);
for (const f of worldData.factions.slice(0, 3)) {
  console.log(`  ${f.name}:`);
  for (const h of f.hierarchy) {
    console.log(`    ${h.role}: ${h.name} (${h.title})`);
  }
}

// === CAMPAIGN-ECONOMY.JS QUERIES ===
console.log(`\n=== Economy Integration Test ===`);
const stableForTrade = worldData.regions.filter(r => r.state === "stable");
console.log(`Regions available for trade (stable): ${stableForTrade.length}`);
const coastalRegions = worldData.regions.filter(r => r.terrain === "coast");
console.log(`Coastal regions: ${coastalRegions.length}`);

// Region type check
console.log(`\nRegion types: ${worldData.regions.map(r => r.type).join(', ')}`);
console.log(`Region terrains: ${worldData.regions.map(r => r.terrain).join(', ')}`);

// === CITY DATA CHECK ===
console.log(`\n=== City Data Check ===`);
const city = worldData.cities[0];
console.log(`City: ${city.name}`);
console.log(`  Region: ${city.region}`);
console.log(`  Faction: ${city.faction}`);
console.log(`  Capital: ${city.isCapital}`);
console.log(`  Population: ${city.population}`);
console.log(`  Terrain: ${city.terrain}`);
console.log(`  Features: ${(city.features || []).length}`);
console.log(`  Shops: ${(city.shops || []).length}`);
console.log(`  Tavern: ${city.tavern ? city.tavern.name : 'none'}`);
console.log(`  NPCs: ${(city.npcs || []).length}`);
console.log(`  Quest Hooks: ${(city.questHooks || []).length}`);
console.log(`  mapX/mapY: ${city.mapX?.toFixed(3)}/${city.mapY?.toFixed(3)}`);
console.log(`  Description: ${(city.description || '').substring(0, 80)}...`);

// === VERIFY ALL REQUIRED DATA SHAPES ===
console.log(`\n=== Full Shape Validation ===`);
let errors = 0;

// Regions
for (const r of worldData.regions) {
  if (!r.ctrl) { console.log(`✗ Region "${r.name}" missing ctrl`); errors++; }
  if (!r.state) { console.log(`✗ Region "${r.name}" missing state`); errors++; }
  if (!r.threat) { console.log(`✗ Region "${r.name}" missing threat`); errors++; }
  if (!r.terrain) { console.log(`✗ Region "${r.name}" missing terrain`); errors++; }
}

// Factions
for (const f of worldData.factions) {
  if (typeof f.power !== 'number') { console.log(`✗ Faction "${f.name}" power not number`); errors++; }
  if (!f.attitude) { console.log(`✗ Faction "${f.name}" missing attitude`); errors++; }
  if (!Array.isArray(f.allies)) { console.log(`✗ Faction "${f.name}" allies not array`); errors++; }
  if (!Array.isArray(f.rivals)) { console.log(`✗ Faction "${f.name}" rivals not array`); errors++; }
  if (!Array.isArray(f.hierarchy)) { console.log(`✗ Faction "${f.name}" hierarchy not array`); errors++; }
}

// Cities
for (const c of worldData.cities) {
  if (!c.region) { console.log(`✗ City "${c.name}" missing region`); errors++; }
  if (!c.faction) { console.log(`✗ City "${c.name}" missing faction`); errors++; }
  if (typeof c.mapX !== 'number') { console.log(`✗ City "${c.name}" mapX not number`); errors++; }
  if (typeof c.mapY !== 'number') { console.log(`✗ City "${c.name}" mapY not number`); errors++; }
}

// NPCs
for (const n of worldData.npcs) {
  if (!n.name) { console.log(`✗ NPC id=${n.id} missing name`); errors++; }
  if (!n.loc) { console.log(`✗ NPC "${n.name}" missing loc`); errors++; }
  if (!Array.isArray(n.traits)) { console.log(`✗ NPC "${n.name}" traits not array`); errors++; }
}

if (errors === 0) console.log(`✓ All ${worldData.regions.length} regions, ${worldData.factions.length} factions, ${worldData.cities.length} cities, ${worldData.npcs.length} NPCs validated`);
else console.log(`✗ ${errors} validation errors found`);

console.log(`\n=== Integration Test Complete ===`);
