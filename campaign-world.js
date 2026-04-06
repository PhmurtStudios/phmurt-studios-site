// ═══════════════════════════════════════════════════════════════════════════
// CAMPAIGN MANAGER — WORLD TAB (lazy-loaded module)
// ═══════════════════════════════════════════════════════════════════════════

/* Shared core references from main bundle */
const { useState, useEffect, useCallback, useRef, useMemo } = React;
const {
  T, getHpColor, DND_CONDITIONS, CONDITION_HELP,
  Tag, HpBar, PowerBar, LinkBtn, CrimsonBtn, Section, Input, Select, Textarea, Modal, ToggleSwitch,
  eid, uid, cmClone, cmSafeInt, cmAbilityMod, cmHumanizeKey,
  getFantasyIcon, normalizeWorldMapState,
  ATLAS_LAND_PATH, ATLAS_ISLANDS, ATLAS_WATER_BODIES, ATLAS_RIVERS, ATLAS_SEA_LABELS,
  ATLAS_RANGE_LABELS, ATLAS_MOUNTAIN_RANGES, ATLAS_PROVINCES, ATLAS_FACTION_SEATS,
  ATLAS_FREE_SEATS, ATLAS_REGION_LAYOUTS,
  MapIconMountain, MapIconMountainSmall, MapIconCity, MapIconDungeon,
  MapIconForest, MapIconTree, MapIconRuins,
  MapIconCastle, MapIconTown, MapIconHamlet, MapIconKingdom, MapIconRoute,
} = window.__CM;
const { ChevronDown, ChevronRight, ChevronLeft, Swords, Users, MapPin, Crown, Scroll, Clock, Star, BookOpen, Dice6, Target, Heart, CheckCircle, Circle, ArrowRight, Plus, Compass, Mountain, Castle, Skull, Flag, TrendingUp, TrendingDown, Minus, SkipForward, Search, Bell, Settings, X, Edit3, Trash2, Eye, EyeOff, Globe, Layers, Activity, Upload, Download, FileText, Save, Copy, Calendar, Lock, Unlock, ToggleLeft, ToggleRight, AlertTriangle, Package, Shield, Wand2, Map: MapIcon, LayoutDashboard, Link, RefreshCw, ChevronUp, MoreVertical, Check, Image, Bold, Italic, List, Type, Heading, Filter } = window.LucideReact || {};
const FilterIcon = Filter || Layers;
const PlayNavIcon = MapIcon || MapPin;

function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SIMPLEX NOISE GENERATOR (2D, for terrain)
// ═══════════════════════════════════════════════════════════════════════════
class SimplexNoise2D {
  constructor(seed = 0) {
    this.seed = seed;
    this.p = this.buildPermutationTable(seed);
  }

  buildPermutationTable(seed) {
    const p = [];
    for (let i = 0; i < 256; i++) {
      p[i] = i;
    }
    // Fisher-Yates shuffle with seed
    const rng = mulberry32(seed);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    // Duplicate for wraparound
    return [...p, ...p];
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  lerp(a, b, t) {
    return a + t * (b - a);
  }

  grad(hash, x, y) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 8 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x, y) {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = this.fade(xf);
    const v = this.fade(yf);

    const p = this.p;
    const aa = p[p[xi] + yi];
    const ab = p[p[xi] + yi + 1];
    const ba = p[p[xi + 1] + yi];
    const bb = p[p[xi + 1] + yi + 1];

    const x1 = this.lerp(this.grad(aa, xf, yf), this.grad(ba, xf - 1, yf), u);
    const x2 = this.lerp(this.grad(ab, xf, yf - 1), this.grad(bb, xf - 1, yf - 1), u);
    return this.lerp(x1, x2, v);
  }

  octave(x, y, octaves = 4, persistence = 0.5, lacunarity = 2.0) {
    let value = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
      value += this.noise(x * frequency, y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return value / maxValue;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ENHANCED MAP GENERATION WITH TERRAIN VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════
function generateTerrainMap(width, height, seed, mapSize = "medium", climateType = "temperate") {
  const noise = new SimplexNoise2D(seed);
  const terrain = Array(height).fill().map(() => Array(width).fill(0));
  const moisture = Array(height).fill().map(() => Array(width).fill(0));

  // Base terrain with scale based on map size
  const scales = { small: 0.008, medium: 0.006, large: 0.004 };
  const scale = scales[mapSize] || scales.medium;
  const octaves = mapSize === "large" ? 6 : mapSize === "small" ? 3 : 4;

  // Generate base terrain
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let value = noise.octave(x * scale, y * scale, octaves, 0.55, 2.0);
      value = (value + 1) * 0.5; // Normalize to 0-1
      terrain[y][x] = value;
    }
  }

  // Generate moisture map
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let value = noise.octave(x * scale * 0.7 + 5000, y * scale * 0.7 + 5000, 3, 0.6, 2.0);
      value = (value + 1) * 0.5;
      moisture[y][x] = value;
    }
  }

  // Climate adjustments
  const climateAdjustments = {
    tropical: { waterLevel: 0.35, mountainLevel: 0.6, moistureBoost: 0.2 },
    temperate: { waterLevel: 0.42, mountainLevel: 0.65, moistureBoost: 0.0 },
    arctic: { waterLevel: 0.48, mountainLevel: 0.72, moistureBoost: -0.15 },
    desert: { waterLevel: 0.45, mountainLevel: 0.68, moistureBoost: -0.3 },
    mixed: { waterLevel: 0.40, mountainLevel: 0.63, moistureBoost: 0.05 }
  };
  const climate = climateAdjustments[climateType] || climateAdjustments.temperate;

  return { terrain, moisture, waterLevel: climate.waterLevel, mountainLevel: climate.mountainLevel, climateBoost: climate.moistureBoost };
}

function getTerrainType(elevation, moisture, waterLevel, mountainLevel) {
  if (elevation < waterLevel) return "water";
  if (elevation < waterLevel + 0.05) return "beach";
  if (elevation > mountainLevel) return "mountain";
  if (elevation > mountainLevel - 0.08) return "hill";
  if (moisture > 0.6) return "forest";
  if (moisture > 0.4) return "plains";
  return "desert";
}

function getTerrainColor(terrainType) {
  const colors = {
    water: { r: 64, g: 128, b: 160 },
    beach: { r: 220, g: 200, b: 130 },
    plains: { r: 150, g: 180, b: 100 },
    forest: { r: 80, g: 130, b: 70 },
    hill: { r: 160, g: 150, b: 100 },
    mountain: { r: 130, g: 120, b: 110 },
    desert: { r: 200, g: 170, b: 90 },
    snow: { r: 240, g: 245, b: 250 }
  };
  return colors[terrainType] || colors.plains;
}

/* Generate a blob path for a continent — parameterized noise-like displacement */
function generateContinent(rng, centerX = 3000, centerY = 2250, baseRadius = 1200) {
  const segments = 64;
  const path = [];
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const baseR = baseRadius + (Math.sin(angle * 3) * 200 + Math.cos(angle * 2) * 180);
    const noiseDisp = (rng() - 0.5) * 400;
    const r = baseR + noiseDisp;
    const x = Math.round(centerX + Math.cos(angle) * r);
    const y = Math.round(centerY + Math.sin(angle) * r);
    path.push(i === 0 ? `M${x},${y}` : `L${x},${y}`);
  }
  path.push("Z");
  return path.join(" ");
}

/* Generate 5-7 provinces by subdividing the continent */
function generateProvinces(rng) {
  const provinceCount = 5 + Math.floor(rng() * 3);
  const provinces = [];
  const provinceNames = [
    "Essear", "Beltros", "Theanas", "Fara", "Elonia",
    "Cyrin", "Dravina", "Valorian", "Northmarch", "Silvering"
  ];

  for (let i = 0; i < provinceCount; i++) {
    const angle = (i / provinceCount) * Math.PI * 2;
    const dist = 900 + rng() * 400;
    const cx = 3000 + Math.cos(angle) * dist;
    const cy = 2250 + Math.sin(angle) * dist;
    const segCount = 16;
    const path = [];
    for (let s = 0; s < segCount; s++) {
      const a = (s / segCount) * Math.PI * 2;
      const r = 600 + rng() * 200;
      const x = Math.round(cx + Math.cos(a) * r);
      const y = Math.round(cy + Math.sin(a) * r);
      path.push(s === 0 ? `M${x},${y}` : `L${x},${y}`);
    }
    path.push("Z");
    provinces.push({
      id: "prov-" + i,
      name: provinceNames[i % provinceNames.length],
      path: path.join(" "),
      labelX: Math.round(cx),
      labelY: Math.round(cy),
      cityX: Math.round(cx - 100 + rng() * 200),
      cityY: Math.round(cy - 100 + rng() * 200),
      spreadX: 350 + Math.floor(rng() * 100),
      spreadY: 250 + Math.floor(rng() * 100),
      fill: "#d4c590"
    });
  }
  return provinces;
}

/* Generate 2-4 mountain ranges */
function generateMountainRanges(rng) {
  const rangeCount = 2 + Math.floor(rng() * 3);
  const ranges = [];
  const rangeNames = [
    "Ironspine Range", "Stormcrown Range", "Sundered Ridge",
    "Moonvale Wilds", "Dragonspire Peak", "Frostfang Peaks"
  ];

  for (let i = 0; i < rangeCount; i++) {
    const startAngle = rng() * Math.PI * 2;
    const startDist = 600 + rng() * 600;
    const startX = 3000 + Math.cos(startAngle) * startDist;
    const startY = 2250 + Math.sin(startAngle) * startDist;

    const endAngle = startAngle + (rng() - 0.5) * Math.PI;
    const endDist = 400 + rng() * 700;
    const endX = 3000 + Math.cos(endAngle) * endDist;
    const endY = 2250 + Math.sin(endAngle) * endDist;

    const cp1x = startX + (rng() - 0.5) * 600;
    const cp1y = startY + (rng() - 0.5) * 600;
    const cp2x = endX + (rng() - 0.5) * 600;
    const cp2y = endY + (rng() - 0.5) * 600;

    const ridge = `M${Math.round(startX)},${Math.round(startY)} C${Math.round(cp1x)},${Math.round(cp1y)} ${Math.round(cp2x)},${Math.round(cp2y)} ${Math.round(endX)},${Math.round(endY)}`;

    ranges.push({
      id: "range-" + i,
      ridge: ridge,
      peaks: []
    });
  }
  return ranges;
}

/* Generate 3-5 rivers flowing from mountains to coast */
function generateRivers(rng, mountainRanges) {
  const rivers = [];
  const riverCount = 3 + Math.floor(rng() * 3);

  for (let i = 0; i < riverCount; i++) {
    const sourceX = 2400 + rng() * 1200;
    const sourceY = 1400 + rng() * 1700;
    const endX = 1200 + rng() * 3600;
    const endY = 1200 + rng() * 2600;

    const segCount = 4 + Math.floor(rng() * 3);
    let riverPath = `M${Math.round(sourceX)},${Math.round(sourceY)}`;

    for (let s = 0; s < segCount; s++) {
      const t = (s + 1) / segCount;
      const x = sourceX + (endX - sourceX) * t + (rng() - 0.5) * 400;
      const y = sourceY + (endY - sourceY) * t + (rng() - 0.5) * 400;
      riverPath += ` L${Math.round(x)},${Math.round(y)}`;
    }

    rivers.push(riverPath);
  }
  return rivers;
}

/* Main generator function */
function generateAtlasData(seed) {
  const rng = mulberry32(typeof seed === "string" ? seed.charCodeAt(0) : seed || Date.now());

  const landPath = generateContinent(rng);

  // Generate islands
  const islands = [];
  const islandCount = 4 + Math.floor(rng() * 3);
  for (let i = 0; i < islandCount; i++) {
    const isleX = 800 + rng() * 4400;
    const isleY = 600 + rng() * 3300;
    const isleSize = 80 + rng() * 150;
    const segs = 8;
    const isleP = [];
    for (let s = 0; s < segs; s++) {
      const a = (s / segs) * Math.PI * 2;
      const r = isleSize * (0.6 + rng() * 0.4);
      const x = isleX + Math.cos(a) * r;
      const y = isleY + Math.sin(a) * r;
      isleP.push((s === 0 ? "M" : "L") + Math.round(x) + "," + Math.round(y));
    }
    isleP.push("Z");
    islands.push({
      path: isleP.join(" "),
      fill: "#c8bc8e",
      opacity: 0.92 + rng() * 0.05
    });
  }

  // Water bodies (lakes)
  const waterBodies = [];
  const waterCount = 3 + Math.floor(rng() * 2);
  const waterLabels = ["Lake Aster", "Lake Vesper", "Ember Gulf", "Mossfen", "Crystal Mere"];
  for (let i = 0; i < waterCount; i++) {
    const wx = 1600 + rng() * 2800;
    const wy = 1800 + rng() * 1800;
    const wrx = 80 + rng() * 180;
    const wry = 50 + rng() * 120;
    waterBodies.push({
      shape: "ellipse",
      cx: Math.round(wx),
      cy: Math.round(wy),
      rx: Math.round(wrx),
      ry: Math.round(wry),
      label: waterLabels[i % waterLabels.length],
      lx: Math.round(wx),
      ly: Math.round(wy)
    });
  }

  // Provinces
  const provinces = generateProvinces(rng);

  // Mountain ranges
  const mountainRanges = generateMountainRanges(rng);

  // Rivers
  const rivers = generateRivers(rng, mountainRanges);

  // Sea labels
  const seaLabels = [
    { x: 600, y: 2000, label: "Sea of Frost", rotate: -18, size: 34, spacing: 8, opacity: 0.34 },
    { x: 5400, y: 1600, label: "Sea of Winds", rotate: 8, size: 34, spacing: 8, opacity: 0.34 },
    { x: 3000, y: 400, label: "Crownwater Expanse", rotate: 0, size: 30, spacing: 10, opacity: 0.22 },
  ];

  // Range labels
  const rangeLabels = mountainRanges.map((r, i) => ({
    x: Math.round(parseInt(r.ridge.match(/M(\d+)/)[1])),
    y: Math.round(parseInt(r.ridge.match(/M\d+,(\d+)/)[1])),
    label: ["Ironspine", "Stormcrown", "Sundered", "Dragonspire", "Frostfang"][i % 5] + " Range",
    rotate: (rng() - 0.5) * 30
  }));

  // Faction seats (anchors for faction-controlled regions)
  const factionSeats = provinces.map((p, i) => ({
    provinceId: p.id,
    x: p.cityX,
    y: p.cityY,
    spreadX: p.spreadX,
    spreadY: p.spreadY,
    angle: rng() * Math.PI * 2
  }));

  // Free seats (neutral spawning points)
  const freeSeats = [];
  for (let i = 0; i < provinces.length; i++) {
    for (let j = 0; j < 1; j++) {
      freeSeats.push({
        provinceId: provinces[i].id,
        x: provinces[i].labelX + (rng() - 0.5) * 400,
        y: provinces[i].labelY + (rng() - 0.5) * 400,
        spreadX: 250 + rng() * 100,
        spreadY: 180 + rng() * 100,
        angle: rng() * Math.PI * 2
      });
    }
  }

  return {
    landPath,
    islands,
    waterBodies,
    rivers,
    seaLabels,
    rangeLabels,
    mountainRanges,
    provinces,
    factionSeats,
    freeSeats
  };
}

/* Generate campaign regions and factions from atlas province data */
function generateRegionsAndFactions(atlas) {
  const rng = mulberry32(Date.now() + 7777);
  const provinces = atlas.provinces || [];

  // Faction templates — generate 3-5 factions and assign to provinces
  const factionTemplates = [
    { suffix: "Dominion",  attitudes: ["neutral","hostile"],  descs: ["An expansionist empire seeking control","A militant regime enforcing order through strength"], colors: ["#c94040","#a83232"] },
    { suffix: "Accord",    attitudes: ["allied","friendly"],  descs: ["A coalition of free cities united for mutual defense","An alliance of merchants and diplomats"], colors: ["#4a90d9","#a4b5cc"] },
    { suffix: "Circle",    attitudes: ["neutral","friendly"], descs: ["A secretive order of mages and scholars","An ancient cabal studying forbidden lore"], colors: ["#8b50f0","#6b3fa0"] },
    { suffix: "Wardens",   attitudes: ["friendly","neutral"], descs: ["Guardians of the natural world and sacred groves","Druidic protectors of the old ways"], colors: ["#2e8b57","#45a876"] },
    { suffix: "Syndicate", attitudes: ["neutral","hostile"],  descs: ["A powerful trade consortium with shadowy connections","A ruthless guild controlling commerce and information"], colors: ["#d4a017","#e8940a"] },
    { suffix: "Covenant",  attitudes: ["hostile","neutral"],  descs: ["A fanatical cult pursuing dark power","A shadowy brotherhood with sinister aims"], colors: ["#5c2d82","#7b3fa0"] },
    { suffix: "Crown",     attitudes: ["neutral","friendly"], descs: ["The remnants of an ancient monarchy","A noble house clinging to fading glory"], colors: ["#c9a85c","#b8963f"] },
  ];

  const factionCount = Math.min(Math.max(3, provinces.length - 1), 5);
  const factions = [];
  const usedTemplates = [];

  for (let i = 0; i < factionCount; i++) {
    let tIdx;
    do { tIdx = Math.floor(rng() * factionTemplates.length); } while (usedTemplates.includes(tIdx) && usedTemplates.length < factionTemplates.length);
    usedTemplates.push(tIdx);
    const t = factionTemplates[tIdx];

    // Use a province name as faction name prefix
    const provName = provinces[i % provinces.length]?.name || "Unknown";
    const shortName = provName.length > 6 ? provName.slice(0, Math.ceil(provName.length * 0.6)) : provName;

    factions.push({
      id: i + 1,
      name: shortName + " " + t.suffix,
      attitude: t.attitudes[Math.floor(rng() * t.attitudes.length)],
      power: 30 + Math.floor(rng() * 60),
      trend: ["rising","stable","declining"][Math.floor(rng() * 3)],
      desc: t.descs[Math.floor(rng() * t.descs.length)],
      color: t.colors[Math.floor(rng() * t.colors.length)],
    });
  }

  // Region types to assign based on province features
  const regionTypes = ["kingdom","city","wilderness","town","dungeon","route"];
  const threatLevels = ["low","medium","high","extreme"];
  const stateDescriptions = ["stable","tense","rebuilding","corrupted","prosperous","dangerous","contested"];

  const regions = provinces.map((prov, i) => {
    // Assign controlling faction — first N provinces get factions, rest are contested/neutral
    const controllingFaction = i < factions.length ? factions[i].name : (factions.length > 0 ? factions[Math.floor(rng() * factions.length)].name : "Unaligned");
    const type = i === 0 ? "capital" : regionTypes[Math.floor(rng() * regionTypes.length)];
    const threat = threatLevels[Math.floor(rng() * threatLevels.length)];
    const state = stateDescriptions[Math.floor(rng() * stateDescriptions.length)];

    return {
      id: i + 1,
      name: prov.name,
      type: type,
      ctrl: controllingFaction,
      threat: threat,
      state: state,
      visited: i === 0,
    };
  });

  return { regions, factions };
}

// ═══════════════════════════════════════════════════════════════════════════
// WORLD STATE
// ═══════════════════════════════════════════════════════════════════════════

function WorldView({ data, setData, onNav, viewRole = "dm" }) {
  const isDM = viewRole === "dm";
  const [sel,setSel] = useState(null);
  const [selType,setSelType] = useState(null);
  const [tab,setTab] = useState("map");
  const [atlasProvinceId,setAtlasProvinceId] = useState(null);
  const [editing,setEditing] = useState(false);
  const [addingEntity,setAddingEntity] = useState(false);
  const [worldOverlay,setWorldOverlay] = useState("atlas");
  const [worldSearch,setWorldSearch] = useState("");
  const [routeDraft,setRouteDraft] = useState({ fromId: null, toId: null });
  const [isMapCompact,setIsMapCompact] = useState(() => typeof window !== "undefined" ? window.innerWidth < 860 : false);
  const worldMapState = normalizeWorldMapState(data.worldMap);

  // ── Map generation modal state ──
  const [showMapGenModal, setShowMapGenModal] = useState(false);
  const [genSeed, setGenSeed] = useState(Math.floor(Math.random() * 1000000).toString());
  const [genMapSize, setGenMapSize] = useState("medium");
  const [genClimate, setGenClimate] = useState("temperate");
  const [genContinents, setGenContinents] = useState(1);
  const canvasRef = useRef(null);

  // ── Map state — starts zoomed out to see the whole continent ──
  const [mapZoom, setMapZoom] = useState(0.25);
  const [mapPan, setMapPan] = useState({ x: 60, y: 30 });
  const [dragging, setDragging] = useState(null);
  const mapRef = useRef(null);
  const mapTouchRef = useRef({ active: false });
  const [zoomLevel, setZoomLevel] = useState("continent"); // continent | kingdom | local | detail

  // Update zoom level label
  useEffect(() => {
    if (mapZoom < 0.6) setZoomLevel("continent");
    else if (mapZoom < 1.5) setZoomLevel("kingdom");
    else if (mapZoom < 3.0) setZoomLevel("local");
    else setZoomLevel("detail");
  }, [mapZoom]);

  useEffect(() => {
    const onResize = () => setIsMapCompact(window.innerWidth < 860);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ── Terrain rendering handler ──
  const renderTerrainPreview = useCallback((canvas, width, height, mapSize, climate, seed) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const { terrain, moisture, waterLevel, mountainLevel, climateBoost } = generateTerrainMap(width, height, seed, mapSize, climate);

    const imageData = ctx.createImageData(width, height);
    const imgData = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const elevation = terrain[y][x];
        let moistureVal = moisture[y][x] + climateBoost;
        moistureVal = Math.max(0, Math.min(1, moistureVal));

        let terrainType = getTerrainType(elevation, moistureVal, waterLevel, mountainLevel);

        // Snow at high elevations in certain climates
        if (climate === "arctic" && elevation > mountainLevel - 0.15) {
          terrainType = "snow";
        }

        const color = getTerrainColor(terrainType);
        const shading = 0.8 + (elevation - waterLevel) * 0.3;
        imgData[idx] = Math.round(color.r * shading);
        imgData[idx + 1] = Math.round(color.g * shading);
        imgData[idx + 2] = Math.round(color.b * shading);
        imgData[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw a border
    ctx.strokeStyle = "rgba(180,170,150,0.4)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);
  }, []);

  // ── Render terrain preview when modal is shown ──
  useEffect(() => {
    if (showMapGenModal && canvasRef.current) {
      const seedNum = parseInt(genSeed) || Date.now();
      renderTerrainPreview(canvasRef.current, 600, 450, genMapSize, genClimate, seedNum);
    }
  }, [showMapGenModal, genMapSize, genClimate, genSeed, renderTerrainPreview]);


  const conns = (type,ent) => {
    const c=[];
    if(type==="region"){ const f=data.factions.find(f=>f.name===ent.ctrl); if(f) c.push({type:"faction",e:f,label:"Controlled by"}); data.npcs.filter(n=>n.loc===ent.name).forEach(n=>c.push({type:"npc",e:n,label:"Located here"})); data.quests.filter(q=>q.region===ent.name).forEach(q=>c.push({type:"quest",e:q,label:"Active quest"})); }
    else if(type==="faction"){ data.regions.filter(r=>r.ctrl===ent.name).forEach(r=>c.push({type:"region",e:r,label:"Controls"})); data.npcs.filter(n=>n.faction===ent.name).forEach(n=>c.push({type:"npc",e:n,label:"Member"})); data.quests.filter(q=>q.faction===ent.name).forEach(q=>c.push({type:"quest",e:q,label:"Related quest"})); }
    else if(type==="npc"){ if(ent.faction){const f=data.factions.find(f=>f.name===ent.faction); if(f) c.push({type:"faction",e:f,label:"Member of"});} const r=data.regions.find(r=>r.name===ent.loc); if(r) c.push({type:"region",e:r,label:"Located in"}); }
    return c;
  };
  const tCols = { low:"#5ee09a", medium:"#e8ba40", high:"#e8940a", extreme:T.crimson };

  // ── Continental map — 6000×4500 world ──
  const MAP_W = 6000, MAP_H = 4500;

  /* ── Custom atlas: if campaign has generated atlas data, use it instead of defaults ── */
  const customAtlas = data.generatedAtlas || null;
  const atlasLandPath = customAtlas?.landPath || ATLAS_LAND_PATH;
  const atlasIslands = customAtlas?.islands || ATLAS_ISLANDS;
  const atlasWaterBodies = customAtlas?.waterBodies || ATLAS_WATER_BODIES;
  const atlasRivers = customAtlas?.rivers || ATLAS_RIVERS;
  const atlasSeaLabels = customAtlas?.seaLabels || ATLAS_SEA_LABELS;
  const atlasRangeLabels = customAtlas?.rangeLabels || ATLAS_RANGE_LABELS;
  const atlasMountainRanges = customAtlas?.mountainRanges || ATLAS_MOUNTAIN_RANGES;
  const atlasProvinces = customAtlas?.provinces || ATLAS_PROVINCES;
  const atlasFactionSeats = customAtlas?.factionSeats || ATLAS_FACTION_SEATS;
  const atlasFreeSeats = customAtlas?.freeSeats || ATLAS_FREE_SEATS;

  /* ── Atlas import handler: paste JS constants from atlas-to-campaign.py output ── */
  const [showAtlasImport, setShowAtlasImport] = useState(false);
  const importAtlasData = useCallback((jsText) => {
    try {
      // SECURITY: Limit input size to prevent ReDoS and memory exhaustion
      if (!jsText || jsText.length > 2 * 1024 * 1024) {
        console.warn("[WorldView] Atlas import rejected: input too large (max 2 MB)");
        return false;
      }
      // SECURITY FIX: Use JSON parsing instead of new Function() to prevent code injection
      // Parse the JS text as structured data (JSON format or similar)
      // This approach validates that the import is data-only, not executable code

      // Try to extract JSON from the JS text (look for common patterns)
      let atlas = null;

      // Attempt 1: Direct JSON parse if it's already JSON
      try {
        atlas = JSON.parse(jsText);
      } catch (jsonErr) {
        // Attempt 2: Extract constants from JS using regex (safer than new Function)
        atlas = {};

        // Safe regex extraction of array/object constants
        const patterns = {
          landPath: /ATLAS_LAND_PATH\s*=\s*['"]([^'"]+)['"]/,
          islands: /ATLAS_ISLANDS\s*=\s*(\[[\s\S]*?\](?=\s*(?:const|let|var|\n)))/,
          waterBodies: /ATLAS_WATER_BODIES\s*=\s*(\[[\s\S]*?\](?=\s*(?:const|let|var|\n)))/,
          rivers: /ATLAS_RIVERS\s*=\s*(\[[\s\S]*?\](?=\s*(?:const|let|var|\n)))/,
          seaLabels: /ATLAS_SEA_LABELS\s*=\s*(\[[\s\S]*?\](?=\s*(?:const|let|var|\n)))/,
          rangeLabels: /ATLAS_RANGE_LABELS\s*=\s*(\[[\s\S]*?\](?=\s*(?:const|let|var|\n)))/,
          mountainRanges: /ATLAS_MOUNTAIN_RANGES\s*=\s*(\[[\s\S]*?\](?=\s*(?:const|let|var|\n)))/,
          provinces: /ATLAS_PROVINCES\s*=\s*(\[[\s\S]*?\](?=\s*(?:const|let|var|\n)))/,
          factionSeats: /ATLAS_FACTION_SEATS\s*=\s*(\[[\s\S]*?\](?=\s*(?:const|let|var|\n)))/,
          freeSeats: /ATLAS_FREE_SEATS\s*=\s*(\[[\s\S]*?\](?=\s*(?:const|let|var|\n)))/
        };

        for (const [key, pattern] of Object.entries(patterns)) {
          const match = jsText.match(pattern);
          if (match) {
            try {
              atlas[key] = JSON.parse(match[1]);
            } catch (parseErr) {
              atlas[key] = key.includes('Path') ? null : [];
            }
          } else {
            atlas[key] = key.includes('Path') ? null : [];
          }
        }
      }

      if (atlas && atlas.landPath) {
        setData(d => ({
          ...d,
          generatedAtlas: atlas,
          activity: [{ time: "Just now", text: "Imported custom atlas map" }, ...(d.activity || [])].slice(0, 40),
        }));
        setShowAtlasImport(false);
        return true;
      }
    } catch (e) {
      console.warn("[WorldView] Atlas import failed:", e);
    }
    return false;
  }, [setData]);

  // Deterministic hash seed
  const seed = useCallback((s) => { let h=0; for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;} return h; }, []);
  const seedF = useCallback((x,y,i) => { const v = Math.sin(x*12.9898+y*78.233+i*43758.5453)*43758.5453; return v - Math.floor(v); }, []);

  const getFactionSeatMap = useCallback(() => {
    const seats = {};
    (data.factions || []).forEach((f, idx) => {
      const base = atlasFactionSeats[idx % atlasFactionSeats.length];
      const lap = Math.floor(idx / atlasFactionSeats.length);
      seats[f.name] = {
        ...base,
        x: Math.max(980, Math.min(MAP_W - 980, base.x + lap * 140 * (idx % 2 === 0 ? 1 : -1))),
        y: Math.max(780, Math.min(MAP_H - 780, base.y + lap * 120 * (idx % 3 === 0 ? 1 : -1))),
      };
    });
    return seats;
  }, [data.factions]);

  // ── Region map positions — spread across the continent ──
  const regionPositions = useCallback(() => {
    const pad=560;
    const factionSeats = getFactionSeatMap();
    const seatUsage = {};
    return data.regions.map((r) => {
      const s = seed(String(r.name || "") + String(r.id || "") + String(r.type || ""));
      const freeSeatIndex = Math.abs(s) % atlasFreeSeats.length;
      const seatKey = r.ctrl && factionSeats[r.ctrl] ? r.ctrl : "free-" + freeSeatIndex;
      const seat = factionSeats[r.ctrl] || atlasFreeSeats[freeSeatIndex];
      const used = seatUsage[seatKey] || 0;
      seatUsage[seatKey] = used + 1;
      const layout = ATLAS_REGION_LAYOUTS[r.type] || ATLAS_REGION_LAYOUTS.default;
      const angle = seat.angle + used * 0.92 + ((Math.abs(s) % 120) - 60) / 180;
      const radius = layout.radius * (0.74 + (Math.abs(s) % 100) / 180) + used * 34;
      const x = Math.round(seat.x + Math.cos(angle) * Math.min(seat.spreadX, radius));
      const y = Math.round(seat.y + Math.sin(angle) * Math.min(seat.spreadY, radius * 0.84));
      return {
        ...r,
        mx: Math.max(pad, Math.min(MAP_W-pad, x)),
        my: Math.max(pad, Math.min(MAP_H-pad, y)),
        atlasProvinceId: seat.provinceId || "essear",
        atlasLabel: layout.label,
      };
    });
  }, [data.regions, getFactionSeatMap, seed]);

  const mapRegions = regionPositions();

  // ── Procedural POIs (dungeons, ruins, shrines, caves scattered across the world) ──
  const worldPOIs = useCallback(() => {
    const types = ["dungeon","ruins","dungeon","ruins","cave","shrine","cave","tower","grove","monolith"];
    const names = ["Darkhollow Crypt","Shattered Pillar","The Sunken Vault","Serpent's Den","Whispering Grotto",
      "Moonlit Shrine","Dragon's Maw Cave","Old Watchtower","The Twisted Grove","The Standing Stone",
      "Tomb of the Forgotten","Crumbling Bastion","The Bone Pit","Iron Gate Ruins","Crystalvein Cavern",
      "Stormbreak Spire","The Withered Oak","Ancestor's Cairn","Wraithwood Hollow","The Ember Forge",
      "Tidal Caves","Blightmoor Ruins","Gnarled Root Temple","Shadowpeak Mine","The Silent Obelisk",
      "Windscour Heights","Blackwater Grotto","Duskfall Sanctum","The Petrified Circle","Ironmaw Depths",
      "Thornkeep Ruins","Mistwalker's Shrine","The Frozen Barrow","Starfall Crater","Ashveil Catacombs"];
    const poiAnchors = [
      { x:1220, y:940 }, { x:2120, y:680 }, { x:3870, y:850 }, { x:4760, y:1240 },
      { x:4950, y:2410 }, { x:4290, y:3630 }, { x:2890, y:3840 }, { x:1280, y:3100 },
      { x:960, y:2100 }, { x:2560, y:1380 }, { x:3500, y:2880 }, { x:1830, y:3440 },
    ];
    return poiAnchors.map((anchor, i) => ({
      id:`poi-${i}`,
      name:names[(Math.abs(seed(names[i % names.length])) + i) % names.length],
      type:types[i % types.length],
      x:Math.round(anchor.x + seedF(i,3,1) * 120 - 60),
      y:Math.round(anchor.y + seedF(i,5,2) * 110 - 55),
      threat:["low","medium","high","extreme"][Math.floor(seedF(i,9,4) * 4)],
    }));
  }, [seed, seedF]);

  const pois = worldPOIs();

  // ── Weather zones — procedural weather system ──

  // ── Travel distance calculator ──

  // ── Encounter zone generation ──

  // ── Roads: connect regions by faction, proximity, and type — with major/minor classifications ──
  const roads = useCallback(() => {
    const rs = [];
    const mr = mapRegions;
    for (let i=0; i<mr.length; i++) {
      for (let j=i+1; j<mr.length; j++) {
        const a = mr[i], b = mr[j];
        const shareCtrl = a.ctrl && b.ctrl && a.ctrl === b.ctrl;
        const questLink = data.quests.some(q => (q.region===a.name && data.factions.some(f=>f.name===q.faction && data.regions.some(r2=>r2.ctrl===f.name && r2.name===b.name))) || (q.region===b.name && data.factions.some(f=>f.name===q.faction && data.regions.some(r2=>r2.ctrl===f.name && r2.name===a.name))));
        const isRoute = a.type==="route" || b.type==="route";
        const dist = Math.hypot(a.mx-b.mx, a.my-b.my);
        const isMajor = (a.type==="city"||a.type==="kingdom"||a.type==="capital") && (b.type==="city"||b.type==="kingdom"||b.type==="capital");
        if (shareCtrl || questLink || isRoute || dist < 1200) {
          // Multi-segment organic curved path for longer roads
          const segs = dist > 800 ? 3 : dist > 400 ? 2 : 1;
          let path = `M${a.mx},${a.my}`;
          for (let s=0; s<segs; s++) {
            const t1 = (s+0.5)/segs, t2 = (s+1)/segs;
            const cx = a.mx + (b.mx-a.mx)*t1 + Math.sin(a.mx*0.007+b.my*0.011+s*2)*80*(dist/800);
            const cy = a.my + (b.my-a.my)*t1 + Math.cos(a.my*0.009+b.mx*0.013+s*3)*60*(dist/800);
            const ex = a.mx + (b.mx-a.mx)*t2;
            const ey = a.my + (b.my-a.my)*t2;
            path += ` Q${Math.round(cx)},${Math.round(cy)} ${Math.round(ex)},${Math.round(ey)}`;
          }
          rs.push({ from:a, to:b, path, dist, major:isMajor||shareCtrl });
        }
      }
    }
    return rs;
  }, [mapRegions, data.quests, data.factions, data.regions]);

  // ── Zoom / Pan handlers — wider range for continental zoom (0.15x to 8x) ──
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const rect = mapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    // Proportional zoom speed — faster at high zoom, slower at low zoom
    const factor = e.deltaY > 0 ? 0.88 : 1.14;
    const newZoom = Math.max(0.12, Math.min(8, mapZoom * factor));
    const ratio = newZoom / mapZoom;
    setMapPan(p => ({ x: mx - (mx - p.x) * ratio, y: my - (my - p.y) * ratio }));
    setMapZoom(newZoom);
  }, [mapZoom]);

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    setDragging({ startX: e.clientX, startY: e.clientY, panX: mapPan.x, panY: mapPan.y });
  }, [mapPan]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    setMapPan({ x: dragging.panX + (e.clientX - dragging.startX), y: dragging.panY + (e.clientY - dragging.startY) });
  }, [dragging]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const getMapPoint = (e) => {
    const p = e?.touches?.[0] || e?.changedTouches?.[0] || e || { clientX: 0, clientY: 0 };
    return { clientX: p.clientX || 0, clientY: p.clientY || 0 };
  };

  const getMapPinchMetrics = (e) => {
    if (!mapRef.current || !e?.touches || e.touches.length < 2) return null;
    const rect = mapRef.current.getBoundingClientRect();
    const a = e.touches[0];
    const b = e.touches[1];
    const centerX = ((a.clientX + b.clientX) / 2) - rect.left;
    const centerY = ((a.clientY + b.clientY) / 2) - rect.top;
    const distance = Math.max(1, Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY));
    return {
      centerX,
      centerY,
      distance,
      worldX: (centerX - mapPan.x) / mapZoom,
      worldY: (centerY - mapPan.y) / mapZoom,
    };
  };

  const handleMapTouchStart = useCallback((e) => {
    e.preventDefault();
    if (e.touches && e.touches.length >= 2) {
      const pinch = getMapPinchMetrics(e);
      if (!pinch) return;
      mapTouchRef.current = {
        active: true,
        mode: "pinch",
        distance: pinch.distance,
        zoom: mapZoom,
        worldX: pinch.worldX,
        worldY: pinch.worldY,
      };
      setDragging(null);
      return;
    }
    if (!e.touches || e.touches.length !== 1) return;
    const p = getMapPoint(e);
    mapTouchRef.current = { active: true, mode: "drag" };
    handleMouseDown({ button: 0, clientX: p.clientX, clientY: p.clientY });
  }, [handleMouseDown, mapPan.x, mapPan.y, mapZoom]);

  const handleMapTouchMove = useCallback((e) => {
    if (!mapTouchRef.current.active) return;
    e.preventDefault();
    if (mapTouchRef.current.mode === "pinch" && e.touches && e.touches.length >= 2) {
      const pinch = getMapPinchMetrics(e);
      if (!pinch) return;
      const baseDistance = mapTouchRef.current.distance || pinch.distance;
      const baseZoom = mapTouchRef.current.zoom || mapZoom;
      const nextZoom = Math.max(0.12, Math.min(8, baseZoom * (pinch.distance / baseDistance)));
      setMapZoom(nextZoom);
      setMapPan({
        x: pinch.centerX - (mapTouchRef.current.worldX || pinch.worldX) * nextZoom,
        y: pinch.centerY - (mapTouchRef.current.worldY || pinch.worldY) * nextZoom,
      });
      return;
    }
    if (!e.touches || e.touches.length !== 1) return;
    const p = getMapPoint(e);
    handleMouseMove({ clientX: p.clientX, clientY: p.clientY });
  }, [handleMouseMove, mapPan.x, mapPan.y, mapZoom]);

  const handleMapTouchEnd = useCallback((e) => {
    if (!mapTouchRef.current.active) return;
    e.preventDefault();
    const mode = mapTouchRef.current.mode;
    mapTouchRef.current = { active: false };
    if (mode === "pinch") {
      setDragging(null);
      return;
    }
    handleMouseUp();
  }, [handleMouseUp]);

  const selectRegion = (r) => {
    setSel(r);
    setSelType("region");
    setAtlasProvinceId(r?.atlasProvinceId || null);
    setEditing(false);
  };

  // ── Kingdom territory polygons (convex hulls of faction-controlled regions) ──
  const territories = useCallback(() => {
    return atlasProvinces.map((province) => {
      const nodes = mapRegions.filter((r) => r.atlasProvinceId === province.id);
      const capitalNode = nodes.find((r) => ["kingdom","capital","city"].includes(r.type)) || nodes[0] || null;
      const dominantCtrl = capitalNode?.ctrl || nodes.find((r) => r.ctrl)?.ctrl || province.name;
      return {
        ...province,
        faction: dominantCtrl,
        capitalNode,
        regionCount: nodes.length,
      };
    });
  }, [mapRegions]);

  const updateFaction = (id, updates) => {
    setData(d=>({...d, factions:d.factions.map(f=>f.id===id?{...f,...updates}:f)}));
    if(sel?.id===id && selType==="faction") setSel(p=>({...p,...updates}));
  };
  const updateRegion = (id, updates) => {
    setData(d=>({...d, regions:d.regions.map(r=>r.id===id?{...r,...updates}:r)}));
    if(sel?.id===id && selType==="region") setSel(p=>({...p,...updates}));
  };
  const updateNpc = (id, updates) => {
    setData(d=>({...d, npcs:d.npcs.map(n=>n.id===id?{...n,...updates}:n)}));
    if(sel?.id===id && selType==="npc") setSel(p=>({...p,...updates}));
  };
  const addEntity = (type, entity) => {
    const id = uid();
    const newE = { ...entity, id };
    if (type === "npc") newE.actorId = "npc-" + id;
    if(type==="region") setData(d=>({...d,regions:[...d.regions,newE]}));
    if(type==="faction") setData(d=>({...d,factions:[...d.factions,newE]}));
    if(type==="npc") setData(d=>({...d,npcs:[...d.npcs,newE]}));
    setAddingEntity(false);
  };

  // POI icon renderer for scattered world POIs
  const POISvg = ({ poi, zoom: z }) => {
    const iconSize = z > 3 ? 28 : 22;
    const FI = FANTASY_ICONS[poi.type] || MapIconRuins;
    const threatCol = tCols[poi.threat] || "var(--text-muted)";
    return (
      <g style={{ cursor:"pointer" }} onClick={(e)=>{e.stopPropagation();setSel({...poi,id:poi.id});setSelType("poi");}}>
        <g transform={`translate(${poi.x - iconSize/2},${poi.y - iconSize/2})`}>
          <FI size={iconSize} color={threatCol} />
        </g>
        {z > 2.5 && <text x={poi.x} y={poi.y+18} textAnchor="middle" fill="var(--text-muted)" fontFamily="'Spectral', serif" fontSize="8" fontStyle="italic" opacity="0.7" style={{pointerEvents:"none"}}>{poi.name}</text>}
      </g>
    );
  };

  const roadList = roads();
  const atlasTerritories = territories();

  const worldNodes = useMemo(() => mapRegions.map((r) => {
    const faction = data.factions.find((f) => f.name === r.ctrl) || null;
    const quests = data.quests.filter((q) => q.region === r.name);
    const activeQuests = quests.filter((q) => q.status !== "completed");
    const npcs = data.npcs.filter((n) => n.loc === r.name);
    const encounters = (data.encounters || []).filter((enc) => enc.location === r.name);
    const timelineEvents = (data.timeline || [])
      .flatMap((session) => (session.events || []).map((ev) => ({
        ...ev,
        sessionTitle: session.title,
        date: session.date,
      })))
      .filter((ev) => ev.location === r.name || (ev.linkedNames || []).some((name) => npcs.some((n) => n.name === name)))
      .slice(0, 4);
    const stateMeta = getWorldStateMeta(r.state);
    const searched = !worldSearch.trim() || [r.name, r.type, r.state, r.ctrl, ...quests.map((q) => q.title), ...npcs.map((n) => n.name)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(worldSearch.trim().toLowerCase());
    return {
      ...r,
      key: "region-" + r.id,
      label: r.name,
      discovered: r.visited || String(r.state || "").toLowerCase() !== "hidden",
      faction,
      quests,
      activeQuests,
      npcs,
      encounters,
      timelineEvents,
      stateMeta,
      searched,
      travelWeight: getWorldTravelCost(r),
      dangerScore: WORLD_THREAT_SCORE[r.threat] || 1,
    };
  }), [mapRegions, data.factions, data.quests, data.npcs, data.encounters, data.timeline, worldSearch]);

  const worldNodesById = useMemo(() => {
    const map = {};
    worldNodes.forEach((node) => { map[node.id] = node; });
    return map;
  }, [worldNodes]);

  const activeRoute = useMemo(() => {
    if (!routeDraft.fromId || !routeDraft.toId || routeDraft.fromId === routeDraft.toId) return null;
    const startNode = worldNodesById[routeDraft.fromId];
    const endNode = worldNodesById[routeDraft.toId];
    if (!startNode || !endNode) return null;

    const graph = {};
    roadList.forEach((rd) => {
      const fromId = rd.from.id;
      const toId = rd.to.id;
      if (!graph[fromId]) graph[fromId] = [];
      if (!graph[toId]) graph[toId] = [];
      const edgeWeight = rd.dist * (((worldNodesById[fromId]?.travelWeight || 1) + (worldNodesById[toId]?.travelWeight || 1)) / 2) * (rd.major ? 0.8 : 1);
      graph[fromId].push({ id: toId, dist: rd.dist, weight: edgeWeight, road: rd });
      graph[toId].push({ id: fromId, dist: rd.dist, weight: edgeWeight, road: rd });
    });

    const distances = { [startNode.id]: 0 };
    const hops = { [startNode.id]: 0 };
    const prev = {};
    const pending = new Set([startNode.id]);
    while (pending.size) {
      let current = null;
      let best = Infinity;
      pending.forEach((id) => {
        const d = distances[id];
        if (d < best) { best = d; current = id; }
      });
      if (current === null || current === endNode.id) break;
      pending.delete(current);
      (graph[current] || []).forEach((edge) => {
        const nextDistance = (distances[current] || 0) + edge.weight;
        if (nextDistance < (distances[edge.id] ?? Infinity)) {
          distances[edge.id] = nextDistance;
          hops[edge.id] = (hops[current] || 0) + edge.dist;
          prev[edge.id] = { id: current, road: edge.road };
          pending.add(edge.id);
        }
      });
    }
    if (!(endNode.id in prev) && startNode.id !== endNode.id) return { from: startNode, to: endNode, segments: [], names:[startNode.name, endNode.name], miles: 0, etaDays: 0, blocked:true, threat:"unknown" };
    const segments = [];
    const pathIds = [endNode.id];
    let cursor = endNode.id;
    while (cursor !== startNode.id && prev[cursor]) {
      segments.unshift(prev[cursor].road);
      cursor = prev[cursor].id;
      pathIds.unshift(cursor);
    }
    const rawMiles = (hops[endNode.id] || Math.hypot(startNode.mx - endNode.mx, startNode.my - endNode.my)) / 18;
    const threatScore = pathIds.reduce((sum, id) => sum + (worldNodesById[id]?.dangerScore || 1), 0) / Math.max(pathIds.length, 1);
    return {
      from: startNode,
      to: endNode,
      segments,
      names: pathIds.map((id) => worldNodesById[id]?.name).filter(Boolean),
      miles: Math.round(rawMiles),
      etaDays: Math.max(0.2, Math.round((rawMiles / 24) * 10) / 10),
      threat: threatScore >= 3.3 ? "extreme" : threatScore >= 2.5 ? "high" : threatScore >= 1.7 ? "medium" : "low",
      blocked: false,
    };
  }, [roadList, routeDraft.fromId, routeDraft.toId, worldNodesById]);

  const selectedWorldNode = useMemo(() => {
    if (!sel) return null;
    if (selType === "region") return worldNodesById[sel.id] || sel;
    if (selType === "poi") return sel;
    return null;
  }, [sel, selType, worldNodesById]);

  const setWorldMapPatch = (patch) => {
    setData((d) => ({
      ...d,
      worldMap: {
        ...normalizeWorldMapState(d.worldMap),
        ...patch,
      },
    }));
  };

  const clearWorldRoute = () => {
    setRouteDraft({ fromId: null, toId: null });
    setWorldMapPatch({ lastRoute: null });
  };

  const focusWorldNode = (node, layer = "region") => {
    if (!node) return;
    const rect = mapRef.current?.getBoundingClientRect();
    const viewportW = rect?.width || 1200;
    const viewportH = rect?.height || 800;
    const targetZoom = WORLD_ZOOM_PRESETS[layer]?.zoom || (layer === "site" ? 4.2 : 1.4);
    setMapZoom(targetZoom);
    setMapPan({
      x: viewportW * (isMapCompact ? 0.5 : 0.42) - node.mx * targetZoom,
      y: viewportH * 0.48 - node.my * targetZoom,
    });
    setSel(node);
    setSelType("region");
    setAtlasProvinceId(node?.atlasProvinceId || null);
    setEditing(false);
    setWorldMapPatch({ lastFocusedRegionId: node.id });
  };

  const queueEncounterLaunch = (encounter, node) => {
    if (!encounter || !node) return;
    setWorldMapPatch({
      pendingLaunch: {
        launchId: "world-launch-" + Date.now(),
        type: "encounter",
        encounterId: encounter.id,
        regionId: node.id,
        location: node.name,
      },
      lastFocusedRegionId: node.id,
    });
    if (onNav) onNav("play");
  };

  useEffect(() => {
    if (activeRoute && !activeRoute.blocked) {
      setWorldMapPatch({
        lastRoute: {
          from: activeRoute.from.name,
          to: activeRoute.to.name,
          miles: activeRoute.miles,
          etaDays: activeRoute.etaDays,
          threat: activeRoute.threat,
        },
      });
    }
  }, [activeRoute?.from?.id, activeRoute?.to?.id, activeRoute?.miles, activeRoute?.etaDays, activeRoute?.threat]);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100dvh - 56px)", overflow:"hidden" }}>
      {/* Top bar */}
      <div style={{ display:"flex", alignItems:"center", gap:0, rowGap:6, flexWrap:"wrap", padding:"0 12px 8px", borderBottom:`1px solid ${T.border}`, flexShrink:0, background:T.bgNav }}>
        {["map","regions","factions","npcs"].map(t => (
          <button key={t} onClick={()=>{setTab(t);if(t!=="map"){setSel(null);setAtlasProvinceId(null);setEditing(false);}}} style={{
            padding:"14px clamp(12px, 2.2vw, 24px)", background:"transparent", border:"none", cursor:"pointer",
            fontFamily:T.ui, fontSize:9, letterSpacing:"2px", textTransform:"uppercase", fontWeight:500,
            color:tab===t?T.crimson:T.textMuted, transition:"all 0.3s",
            borderBottom:tab===t?`2px solid ${T.crimson}`:"2px solid transparent",
          }}>{t==="map"?"Atlas":t}</button>
        ))}
        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center", justifyContent:"flex-end", flexWrap:"wrap" }}>
          {tab==="map" && <>
            {false && <span style={{ fontFamily:T.ui, fontSize:8, color:T.crimson, letterSpacing:"1px", fontWeight:500 }}>{zoomLevel.toUpperCase()}</span>}
            {false && <span style={{ fontFamily:T.ui, fontSize:8, color:T.textMuted, letterSpacing:"1px" }}>{Math.round(mapZoom*100)}%</span>}
            <button onClick={()=>setMapZoom(z=>Math.min(8,z*1.3))} style={{ padding:"4px 8px", background:"transparent", border:`1px solid ${T.border}`, color:T.textMuted, fontSize:13, cursor:"pointer", borderRadius:"2px" }}>+</button>
            <button onClick={()=>setMapZoom(z=>Math.max(0.12,z*0.77))} style={{ padding:"4px 8px", background:"transparent", border:`1px solid ${T.border}`, color:T.textMuted, fontSize:13, cursor:"pointer", borderRadius:"2px" }}>−</button>
            <button onClick={()=>{setMapZoom(WORLD_ZOOM_PRESETS.world.zoom);setMapPan(WORLD_ZOOM_PRESETS.world.pan);}} style={{ padding:"4px 10px", background:"transparent", border:`1px solid ${T.border}`, color:T.textMuted, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px" }}>Atlas</button>
            {false && <button onClick={()=>focusWorldNode(selectedWorldNode?.mx != null ? selectedWorldNode : (worldNodes.find((n)=>n.id===worldMapState.lastFocusedRegionId) || worldNodes[0]), "region")} style={{ padding:"4px 10px", background:"transparent", border:`1px solid ${T.border}`, color:T.textMuted, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px" }}>Region</button>}
            {false && <button onClick={()=>focusWorldNode(selectedWorldNode?.mx != null ? selectedWorldNode : (worldNodes.find((n)=>n.id===worldMapState.lastFocusedRegionId) || worldNodes[0]), "local")} style={{ padding:"4px 10px", background:"transparent", border:`1px solid ${T.border}`, color:T.textMuted, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px" }}>Local</button>}
            {false && selectedWorldNode?.mx != null && selectedWorldNode?.type === "dungeon" && <button onClick={()=>focusWorldNode(selectedWorldNode, "site")} style={{ padding:"4px 10px", background:"rgba(212,67,58,0.08)", border:`1px solid ${T.crimsonBorder}`, color:T.crimson, fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px" }}>Site</button>}
            {activeRoute && <button onClick={clearWorldRoute} style={{ padding:"4px 10px", background:"rgba(94,224,154,0.08)", border:"1px solid rgba(94,224,154,0.22)", color:"#5ee09a", fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", borderRadius:"2px" }}>Clear Route</button>}
            {false && <div style={{ display:"flex", gap:4, padding:"3px", border:`1px solid ${T.border}`, borderRadius:"999px", background:"rgba(0,0,0,0.14)", maxWidth:isMapCompact ? "100%" : 420, overflowX:"auto" }}>
              {WORLD_OVERLAYS.map((overlay) => (
                <button key={overlay.id} onClick={()=>setWorldOverlay(overlay.id)} style={{
                  padding:"5px 10px", border:"none", borderRadius:"999px", cursor:"pointer", whiteSpace:"nowrap",
                  fontFamily:T.ui, fontSize:8, letterSpacing:"1px", textTransform:"uppercase",
                  color:worldOverlay===overlay.id?T.text:T.textFaint,
                  background:worldOverlay===overlay.id?"rgba(212,67,58,0.14)":"transparent",
                  transition:"all 0.15s ease",
                }}>{overlay.label}</button>
              ))}
            </div>}
            <div style={{ position:"relative", minWidth:isMapCompact ? 148 : 220 }}>
              <Search size={11} color={T.textFaint} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)" }}/>
              <input value={worldSearch} onChange={(e)=>setWorldSearch(e.target.value)} placeholder="Find locations, NPCs, quests..."
                style={{
                  width:"100%", padding:"8px 10px 8px 28px", background:"rgba(0,0,0,0.12)", border:`1px solid ${T.border}`,
                  borderRadius:"999px", color:T.text, fontFamily:T.body, fontSize:12, outline:"none", boxSizing:"border-box",
                }} />
            </div>
          </>}
          <CrimsonBtn onClick={()=>setAddingEntity(true)} small><Plus size={11}/> Add</CrimsonBtn>
        </div>
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden", position:"relative" }}>
        {/* ══════════ FANTASY MAP TAB — Multi-scale continental map ══════════ */}
        {tab==="map" && (
          <div ref={mapRef} style={{ flex:1, overflow:"hidden", cursor:dragging?"grabbing":"grab", position:"relative", background:"linear-gradient(165deg, #e8ddc8 0%, #ddd0b8 45%, #d4c6a8 100%)", touchAction:"none", WebkitUserSelect:"none", userSelect:"none" }}
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
            onTouchStart={handleMapTouchStart} onTouchMove={handleMapTouchMove} onTouchEnd={handleMapTouchEnd} onTouchCancel={handleMapTouchEnd}
            onWheel={handleWheel}>
            <svg width="100%" height="100%" style={{ display:"block" }}>
              <defs>
                {/* Parchment texture filter */}
                <filter id="parchment">
                  <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="4" result="noise"/>
                  <feDiffuseLighting in="noise" lightingColor="#f2ead8" surfaceScale="0.55" result="lit"><feDistantLight azimuth="52" elevation="48"/></feDiffuseLighting>
                  <feComposite in="SourceGraphic" in2="lit" operator="arithmetic" k1="0.35" k2="0.2" k3="0" k4="0"/>
                </filter>
                <clipPath id="atlasLandClip">
                  <path d={atlasLandPath} />
                  {atlasIslands.map((isle, idx) => <path key={`atlas-isle-clip-${idx}`} d={isle.path} />)}
                </clipPath>
                <radialGradient id="atlasLandFill" cx="48%" cy="42%" r="78%">
                  <stop offset="0%" stopColor="#e6dcc0" />
                  <stop offset="55%" stopColor="#d8ca9f" />
                  <stop offset="100%" stopColor="#cbb88a" />
                </radialGradient>
                <linearGradient id="atlasSeaFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8aa9a2" />
                  <stop offset="48%" stopColor="#92b0a8" />
                  <stop offset="100%" stopColor="#7d9b94" />
                </linearGradient>
                <pattern id="atlasContourPat" x="0" y="0" width="420" height="300" patternUnits="userSpaceOnUse">
                  <path d="M-20,140 C40,88 112,68 180,84 C250,100 320,82 430,30" stroke="#7a7150" strokeWidth="2.4" fill="none" opacity="0.16"/>
                  <path d="M-10,220 C60,180 130,172 210,192 C300,214 360,204 440,170" stroke="#7a7150" strokeWidth="2.2" fill="none" opacity="0.12"/>
                  <path d="M50,20 C90,62 145,84 210,80 C290,72 350,92 420,132" stroke="#7a7150" strokeWidth="2" fill="none" opacity="0.1"/>
                  <ellipse cx="110" cy="210" rx="42" ry="24" fill="none" stroke="#7a7150" strokeWidth="1.8" opacity="0.10"/>
                  <ellipse cx="310" cy="122" rx="54" ry="30" fill="none" stroke="#7a7150" strokeWidth="1.8" opacity="0.10"/>
                </pattern>
                {/* Water pattern */}
                <pattern id="waterPat" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M0,40 Q20,35 40,40 Q60,45 80,40" stroke="#6d8f89" strokeWidth="0.45" fill="none" opacity="0.14"/>
                  <path d="M0,55 Q20,50 40,55 Q60,60 80,55" stroke="#6d8f89" strokeWidth="0.28" fill="none" opacity="0.09"/>
                  <path d="M0,25 Q20,20 40,25 Q60,30 80,25" stroke="#6d8f89" strokeWidth="0.28" fill="none" opacity="0.08"/>
                </pattern>
                {/* Glow for cities */}
                <filter id="cityGlow">
                  <feGaussianBlur stdDeviation="4" result="blur"/>
                  <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
              </defs>

              <g transform={`translate(${mapPan.x},${mapPan.y}) scale(${mapZoom})`}>
                {/* ═══ LAYER 0: Base map — always visible ═══ */}
                <rect x="0" y="0" width={MAP_W} height={MAP_H} rx="10" fill="url(#atlasSeaFill)" filter="url(#parchment)"/>
                <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="url(#waterPat)" opacity="0.22"/>
                <path d={atlasLandPath} fill="rgba(218,204,168,0.22)" stroke="#6a9088" strokeWidth="14" opacity="0.55" strokeLinejoin="round"/>
                <path d={atlasLandPath} fill="url(#atlasLandFill)" stroke="#5a7a73" strokeWidth="3.2" strokeLinejoin="round"/>
                <path d={atlasLandPath} fill="url(#atlasContourPat)" opacity="0.2" stroke="none"/>
                {atlasIslands.map((isle, idx) => (
                  <g key={`atlas-isle-${idx}`}>
                    <path d={isle.path} fill={isle.fill || "#d4c9a2"} opacity={isle.opacity || 0.96} stroke="#5a7a73" strokeWidth="2.4" strokeLinejoin="round"/>
                    <path d={isle.path} fill="url(#atlasContourPat)" opacity="0.2" stroke="none"/>
                  </g>
                ))}
                {atlasSeaLabels.map((sLabel, idx) => (
                  <text key={`sea-label-${idx}`} x={sLabel.x} y={sLabel.y} textAnchor="middle" fill="#4a6b64" fontFamily="'Spectral', serif" fontSize={sLabel.size} letterSpacing={sLabel.spacing * 0.35} opacity={sLabel.opacity || 0.38} fontStyle="italic" transform={`rotate(${sLabel.rotate} ${sLabel.x} ${sLabel.y})`} style={{ pointerEvents:"none" }}>
                    {sLabel.label}
                  </text>
                ))}

                {/* ═══ LAYER 1: Continental geography — ocean, coastlines, major water ═══ */}
                {false && <>{/* Western ocean */}
                <path d="M0,0 L0,4500 Q300,4200 250,3600 Q180,3000 320,2400 Q250,1800 200,1200 Q300,600 180,0 Z" fill="var(--crimson-soft)" opacity="0.25"/>
                <path d="M0,0 L0,4500 Q300,4200 250,3600 Q180,3000 320,2400 Q250,1800 200,1200 Q300,600 180,0 Z" fill="url(#waterPat)"/>
                {/* Eastern ocean */}
                <path d="M6000,0 L6000,4500 Q5700,4100 5750,3400 Q5800,2700 5680,2000 Q5750,1300 5800,600 Q5700,200 5750,0 Z" fill="var(--crimson-soft)" opacity="0.2"/>
                <path d="M6000,0 L6000,4500 Q5700,4100 5750,3400 Q5800,2700 5680,2000 Q5750,1300 5800,600 Q5700,200 5750,0 Z" fill="url(#waterPat)"/>
                {/* Northern sea */}
                <path d="M0,0 L6000,0 L6000,200 Q5000,350 4000,250 Q3000,400 2000,300 Q1000,380 0,250 Z" fill="var(--crimson-soft)" opacity="0.2"/>
                <path d="M0,0 L6000,0 L6000,200 Q5000,350 4000,250 Q3000,400 2000,300 Q1000,380 0,250 Z" fill="url(#waterPat)"/>
                {/* Southern sea */}
                <path d="M0,4500 L6000,4500 L6000,4250 Q5000,4100 4000,4200 Q3000,4080 2000,4180 Q1000,4100 0,4220 Z" fill="var(--crimson-soft)" opacity="0.2"/>
                <path d="M0,4500 L6000,4500 L6000,4250 Q5000,4100 4000,4200 Q3000,4080 2000,4180 Q1000,4100 0,4220 Z" fill="url(#waterPat)"/>
                {/* Inland sea */}
                <ellipse cx="3000" cy="2000" rx="400" ry="250" fill="var(--crimson-soft)" opacity="0.18"/>
                <ellipse cx="3000" cy="2000" rx="400" ry="250" fill="url(#waterPat)"/>
                {/* Large lake */}
                <ellipse cx="1600" cy="3200" rx="200" ry="140" fill="var(--crimson-soft)" opacity="0.15"/>
                <ellipse cx="1600" cy="3200" rx="200" ry="140" fill="url(#waterPat)"/>
                {/* Bay */}
                <path d="M4800,4500 Q4600,4000 4900,3800 Q5200,3700 5400,4000 Q5600,4300 5500,4500 Z" fill="var(--crimson-soft)" opacity="0.15"/>
                <path d="M4800,4500 Q4600,4000 4900,3800 Q5200,3700 5400,4000 Q5600,4300 5500,4500 Z" fill="url(#waterPat)"/>

                {/* Major rivers */}
                <path d="M1800,300 Q1850,600 1700,1000 Q1600,1400 1650,1800 Q1700,2200 1600,2600 Q1550,3000 1600,3200" stroke="var(--crimson-border)" strokeWidth="3" fill="none" opacity="0.3" strokeLinecap="round"/>
                <path d="M3200,400 Q3100,800 3150,1200 Q3050,1600 3000,2000" stroke="var(--crimson-border)" strokeWidth="2.5" fill="none" opacity="0.25" strokeLinecap="round"/>
                <path d="M4500,600 Q4400,1000 4500,1400 Q4550,1800 4400,2200 Q4350,2600 4500,3000 Q4600,3400 4500,3800" stroke="var(--crimson-border)" strokeWidth="2.5" fill="none" opacity="0.25" strokeLinecap="round"/>
                {/* Tributary rivers — visible at kingdom zoom */}
                {mapZoom > 0.5 && <>
                  <path d="M1200,1200 Q1400,1300 1650,1400" stroke="var(--crimson-border)" strokeWidth="1.5" fill="none" opacity="0.2" strokeLinecap="round"/>
                  <path d="M2200,1800 Q2500,1900 3000,2000" stroke="var(--crimson-border)" strokeWidth="1.5" fill="none" opacity="0.18" strokeLinecap="round"/>
                  <path d="M3800,1200 Q3600,1400 3150,1600" stroke="var(--crimson-border)" strokeWidth="1.2" fill="none" opacity="0.15" strokeLinecap="round"/>
                  <path d="M5200,2000 Q4900,2100 4500,2200" stroke="var(--crimson-border)" strokeWidth="1.2" fill="none" opacity="0.15" strokeLinecap="round"/>
                </>}
                </>}
                <g clipPath="url(#atlasLandClip)">
                  {atlasWaterBodies.map((body, idx) => (
                    body.shape === "ellipse"
                      ? <ellipse key={`body-${idx}`} cx={body.cx} cy={body.cy} rx={body.rx} ry={body.ry} fill="#8eb4ac" opacity="0.94" stroke="#5f8a82" strokeWidth="2"/>
                      : <path key={`body-${idx}`} d={body.d} fill="#8eb4ac" opacity="0.94" stroke="#5f8a82" strokeWidth="2" strokeLinejoin="round"/>
                  ))}
                  {mapZoom < 1.85 && atlasWaterBodies.map((body, idx) => body.label && body.lx != null && (
                    <text key={`lake-lbl-${idx}`} x={body.lx} y={body.ly} textAnchor="middle" fill="#4d6f68" fontFamily="'Spectral', serif" fontSize={Math.max(11, 18 / Math.max(mapZoom, 0.4))} fontStyle="italic" letterSpacing="0.6" opacity="0.55" style={{ pointerEvents:"none" }}>{body.label}</text>
                  ))}
                  {atlasRivers.map((riverPath, idx) => (
                    <path key={`atlas-river-${idx}`} d={riverPath} stroke="#5a7d76" strokeWidth={idx < 3 ? 3.2 : 2} fill="none" opacity={idx < 3 ? 0.78 : 0.55} strokeLinecap="round" strokeLinejoin="round"/>
                  ))}
                </g>
                {mapZoom < 1.4 && atlasRangeLabels.map((mLabel, idx) => (
                  <text key={`range-label-${idx}`} x={mLabel.x} y={mLabel.y} textAnchor="middle" fill="#7f714f" fontFamily="'Spectral', serif" fontSize={Math.max(13, 22 / Math.max(mapZoom, 0.35))} letterSpacing="1.8" opacity="0.34" fontStyle="italic" transform={`rotate(${mLabel.rotate} ${mLabel.x} ${mLabel.y})`} style={{ pointerEvents:"none" }}>
                    {mLabel.label}
                  </text>
                ))}

                {/* ═══ LAYER 2: Kingdom territories — visible at continent/kingdom zoom ═══ */}
                {mapZoom < 2.5 && atlasTerritories.map((t,i) => {
                  const activeProvince = atlasProvinceId === t.id || selectedWorldNode?.atlasProvinceId === t.id;
                  return (
                  <g key={`terr-${i}`} clipPath="url(#atlasLandClip)" style={{ cursor:"pointer" }} onClick={(e)=>{ e.stopPropagation(); setAtlasProvinceId(t.id); if (t.capitalNode) selectRegion(t.capitalNode); }}>
                    <path d={t.path} fill={t.fill || "#d6c999"} opacity={activeProvince ? 0.18 : 0.07} stroke={activeProvince ? "#7a6b4a" : "#a89872"} strokeWidth={activeProvince ? 2.4 : 1.2} strokeOpacity={activeProvince ? 0.55 : 0.28} strokeLinejoin="round"/>
                    {mapZoom < 1.3 && t.labelX != null && (
                      <text x={t.labelX} y={t.labelY} textAnchor="middle" fill={activeProvince ? "#3d3220" : "#4a3f28"} stroke="rgba(252,248,236,0.5)" strokeWidth={Math.max(1, 2.2 / Math.max(mapZoom, 0.5))} paintOrder="stroke" fontFamily="'Cinzel', serif" fontSize={Math.max(28, 64 / Math.max(mapZoom, 0.36))} fontWeight="600" letterSpacing="3.5" opacity={activeProvince ? 0.92 : 0.76} style={{ pointerEvents:"none", textTransform:"uppercase" }}>
                        {t.name}
                      </text>
                    )}
                  </g>
                  );
                })}

                {/* ═══ LAYER 3: Terrain features — scale-dependent ═══ */}
                {/* Mountains — always visible (they define the landscape) */}
                <g clipPath="url(#atlasLandClip)">
                  {atlasMountainRanges.map((range) => (
                    <g key={`ridge-${range.id}`}>
                      <path d={range.ridge} fill="none" stroke="#9a8b62" strokeWidth="8" opacity="0.11" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d={range.ridge} fill="none" stroke="#f2ead4" strokeWidth="1.8" opacity="0.14" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                  ))}
                </g>

                {/* ═══ LAYER 4: Roads — major roads at kingdom zoom, minor at local ═══ */}
                {<g clipPath="url(#atlasLandClip)" opacity={mapZoom > 0.5 ? Math.min(1, (mapZoom-0.5)*1.5) : 0} style={{ transition:"opacity 0.3s" }}>
                  {roadList.filter(rd=>rd.major).map((rd,i) => (
                    <path key={`mroad-${i}`} d={rd.path} stroke="#b8a67a" strokeWidth={mapZoom > 1.5 ? 1 : 1.8} fill="none" strokeDasharray={mapZoom > 2 ? "12,14" : "22,20"} opacity="0.32" strokeLinecap="round"/>
                  ))}
                </g>}
                {mapZoom > 0.8 && <g clipPath="url(#atlasLandClip)" opacity={Math.min(1, (mapZoom-0.8)*2)} style={{ transition:"opacity 0.3s" }}>
                  {roadList.filter(rd=>!rd.major).map((rd,i) => (
                    <path key={`road-${i}`} d={rd.path} stroke="#c4b48c" strokeWidth={mapZoom > 2 ? 0.65 : 1} fill="none" strokeDasharray="10,12" opacity="0.18" strokeLinecap="round"/>
                  ))}
                </g>}
                {activeRoute && !activeRoute.blocked && (
                  <g clipPath="url(#atlasLandClip)">
                    {activeRoute.segments.map((rd, i) => (
                      <path key={`active-route-${i}`} d={rd.path} stroke="#556e52" strokeWidth={mapZoom > 1.8 ? 2.5 : 4.5} fill="none" opacity="0.62" strokeLinecap="round" strokeDasharray="22,16">
                        {false && <animate attributeName="stroke-dashoffset" from="0" to="-68" dur="2.4s" repeatCount="indefinite" />}
                      </path>
                    ))}
                  </g>
                )}

                {/* ═══ LAYER 5: Region markers — scale-dependent icon/label sizing ═══ */}
                {worldNodes.filter(node => node.searched).map(node => {
                  const r = node;
                  const active = sel?.id===r.id && selType==="region";
                  const threatCol = tCols[r.threat] || "var(--text-muted)";
                  const isBig = r.type==="city"||r.type==="kingdom"||r.type==="capital";
                  const isSmall = r.type==="hamlet"||r.type==="ruins"||r.type==="dungeon";
                  const atlasPlaceVisible = ["city","capital","kingdom","town","castle"].includes(r.type) || (["hamlet","ruins","dungeon"].includes(r.type) && mapZoom > 1.35);
                  const dimUndiscovered = worldOverlay === "discovery" && !r.discovered;
                  if(!atlasPlaceVisible && !active) return null;
                  if(!r.discovered && worldOverlay !== "discovery" && !active) return null;
                  if(isSmall && mapZoom < 0.72 && !active) return null;
                  const sqHalf = Math.max(2.5, Math.min(isBig ? 5.5 : 3.8, (isBig ? 5 : 3.2) / Math.max(mapZoom*0.72, 0.42)));
                  const fontSize = isBig ? Math.max(13, 26/Math.max(mapZoom*0.72,0.35)) : Math.max(9, 15/Math.max(mapZoom*0.8,0.45));
                  const labelYOffset = isBig ? Math.max(30, 38 / Math.max(mapZoom*0.75,0.55)) : Math.max(18, 24 / Math.max(mapZoom*0.85,0.6));
                  return (
                    <g key={r.key || r.id} onClick={(e)=>{e.stopPropagation(); selectRegion(r);}} style={{ cursor:"pointer", opacity: dimUndiscovered ? 0.35 : 1 }}>
                      {active && <rect x={r.mx - sqHalf - 10} y={r.my - sqHalf - 10} width={(sqHalf + 10) * 2} height={(sqHalf + 10) * 2} fill="none" stroke="#7a9088" strokeWidth="2" opacity="0.45" rx="2"/>}
                      {false && activeRoute && activeRoute.names.includes(r.name) && !active && <circle cx={r.mx} cy={r.my} r={isBig?50:35} fill="none" stroke={getWorldThreatColor(activeRoute.threat)} strokeWidth="2.5" opacity="0.35" strokeDasharray="10,7"/>}
                      {false && (worldOverlay==="atlas" && ["corrupted","cursed","blighted","destroyed","conquered"].includes(String(r.state || "").toLowerCase())) && <circle cx={r.mx} cy={r.my} r={isBig?84:58} fill={r.stateMeta?.color || threatCol} opacity="0.08" stroke={r.stateMeta?.color || threatCol} strokeWidth="1" strokeOpacity="0.18"/>}
                      {false && (worldOverlay==="quests" && r.activeQuests?.length > 0 && mapZoom > 0.5) && <circle cx={r.mx} cy={r.my} r={isBig?66:46} fill="none" stroke="#ffd54f" strokeWidth="2" opacity="0.5" strokeDasharray="4,7"/>}
                      {false && ((worldOverlay==="atlas" || worldOverlay==="quests") && r.faction) && <circle cx={r.mx} cy={r.my} r={24} fill={r.faction.color} opacity={isBig && mapZoom < 0.6 ? 0.1 : 0.08}/>}
                      <rect x={r.mx - sqHalf} y={r.my - sqHalf} width={sqHalf * 2} height={sqHalf * 2} fill={active ? "#2e2414" : (dimUndiscovered ? "#6b6454" : "#3d3422")} stroke={active ? "#f5eed8" : "#b5a67e"} strokeWidth={active ? 1.4 : 1}/>
                      {false && (routeDraft.fromId === r.id || routeDraft.toId === r.id) && (
                        <g transform={`translate(${r.mx + (isBig?28:20)},${r.my - (isBig?30:22)})`}>
                          <circle r="10" fill={routeDraft.fromId === r.id ? "#5ee09a" : "#f06858"} opacity="0.95"/>
                          <text x="0" y="3" textAnchor="middle" fill="#0d0f13" fontFamily="'Cinzel', serif" fontSize="8" fontWeight="700">{routeDraft.fromId === r.id ? "A" : "B"}</text>
                        </g>
                      )}
                      {/* Label — always show for kingdoms/cities, show others when zoomed */}
                      {(isBig || mapZoom > (isSmall ? 1.0 : 0.62) || active) && (
                        <text x={r.mx} y={r.my + labelYOffset} textAnchor="middle" fill={dimUndiscovered ? "#6f6a55" : "#4c4025"} stroke="rgba(252,248,236,0.55)" strokeWidth={isBig ? 1.2 : 0.85} paintOrder="stroke" fontFamily="'Spectral', serif" fontSize={fontSize} fontStyle={isBig ? "normal" : "italic"} fontWeight={isBig?"600":"500"} letterSpacing={isBig?"0.35":"0.4"} opacity={active?0.95:0.88} style={{ pointerEvents:"none" }}>
                          {r.discovered ? r.name : "Undiscovered Site"}
                        </text>
                      )}
                      {/* Faction/state subtitle — kingdom zoom+ */}
                      {false && mapZoom > 1.05 && (
                        <text x={r.mx} y={r.my + (isBig?54:40)} textAnchor="middle" fill={r.stateMeta?.color || "var(--text-muted)"} fontFamily="'Spectral', serif" fontSize={Math.max(6,10/Math.max(mapZoom*0.7,0.5))} fontStyle="italic" fontWeight="300" opacity="0.72" style={{ pointerEvents:"none" }}>
                          {r.ctrl || r.atlasLabel || r.type} / {r.stateMeta?.label || r.state || "Stable"}
                        </text>
                      )}
                      {/* Threat pip — local zoom+ */}
                      {false && mapZoom > 1.0 && (
                        <circle cx={r.mx + (isBig?28:20)} cy={r.my - (isBig?24:16)} r="5" fill={r.stateMeta?.color || threatCol} opacity="0.8"/>
                      )}
                      {false && r.activeQuests?.length > 0 && mapZoom > 1.15 && (
                        <g transform={`translate(${r.mx-(isBig?30:22)},${r.my-(isBig?24:18)})`}>
                          <circle r="8" fill="rgba(255,213,79,0.14)" stroke="#ffd54f" strokeWidth="0.8"/>
                          <text x="0" y="3" textAnchor="middle" fill="#ffd54f" fontFamily="'Cinzel', serif" fontSize="7" fontWeight="700">{r.activeQuests.length}</text>
                        </g>
                      )}
                      {false && r.encounters?.length > 0 && mapZoom > 1.1 && (
                        <g transform={`translate(${r.mx+(isBig?44:34)},${r.my+(isBig?18:14)})`}>
                          <circle r="8" fill="rgba(212,67,58,0.16)" stroke="#f06858" strokeWidth="0.8"/>
                          <path d="M-3,-2 L3,4 M3,-2 L-3,4" stroke="#f06858" strokeWidth="1.4" strokeLinecap="round"/>
                        </g>
                      )}
                      {/* Visited marker — local zoom+ */}
                      {false && r.discovered && worldOverlay==="discovery" && mapZoom > 1.2 && (
                        <g transform={`translate(${r.mx-(isBig?28:20)},${r.my-(isBig?26:18)})`}>
                          <circle r="6" fill="var(--bg-card)" stroke="var(--text-muted)" strokeWidth="0.7"/>
                          <path d="M-2.5,0 L-0.5,2.5 L3,-2.5" stroke="#5ee09a" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* ═══ LAYER 6: World POIs — visible at local zoom+ ═══ */}
                {false && mapZoom > 2.0 && pois.map(p => <POISvg key={p.id} poi={p} zoom={mapZoom}/>)}

                {/* ═══ LAYER 7: Weather overlay ═══ */}
                {false && mapZoom > 0.4 && data.factions.map(wz => (
                  <g key={wz.key} opacity={0.12 + (mapZoom > 1 ? 0.08 : 0)}>
                    {wz.type==="rain" && <><circle cx={wz.x} cy={wz.y} r={wz.r} fill="rgba(110,160,250,0.08)" stroke="rgba(110,160,250,0.15)" strokeWidth="1" strokeDasharray="8,6"/>
                      {mapZoom > 1 && [0,1,2,3,4,5].map(ri => <line key={`r-${ri}`} x1={wz.x-wz.r*0.6+ri*(wz.r*0.24)} y1={wz.y-20} x2={wz.x-wz.r*0.6+ri*(wz.r*0.24)-8} y2={wz.y+20} stroke="rgba(110,160,250,0.2)" strokeWidth="1" strokeLinecap="round"/>)}</>}
                    {wz.type==="storm" && <><circle cx={wz.x} cy={wz.y} r={wz.r} fill="rgba(90,15,150,0.06)" stroke="rgba(90,15,150,0.15)" strokeWidth="1.5" strokeDasharray="4,4"/>
                      {mapZoom > 1 && <path d={`M${wz.x-10},${wz.y-15} L${wz.x+5},${wz.y-2} L${wz.x-5},${wz.y-2} L${wz.x+10},${wz.y+15}`} stroke="rgba(255,220,30,0.3)" strokeWidth="1.5" fill="none"/>}</>}
                    {wz.type==="snow" && <circle cx={wz.x} cy={wz.y} r={wz.r} fill="rgba(210,228,255,0.06)" stroke="rgba(210,228,255,0.15)" strokeWidth="1" strokeDasharray="3,6"/>}
                    {wz.type==="fog" && <ellipse cx={wz.x} cy={wz.y} rx={wz.r*1.3} ry={wz.r*0.6} fill="rgba(190,190,200,0.06)" stroke="rgba(190,190,200,0.1)" strokeWidth="1"/>}
                    {wz.type==="wind" && mapZoom > 0.8 && <path d={`M${wz.x-wz.r*0.8},${wz.y} Q${wz.x},${wz.y-30} ${wz.x+wz.r*0.8},${wz.y}`} stroke="rgba(190,190,200,0.15)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>}
                    {mapZoom > 1.2 && <text x={wz.x} y={wz.y} textAnchor="middle" fill="var(--text-faint)" fontFamily="'Spectral', serif" fontSize="9" fontStyle="italic" opacity="0.5">{wz.type}</text>}
                  </g>
                ))}

                {/* ═══ LAYER 8: Encounter zones — visible at local zoom+ ═══ */}
                {false && mapZoom > 1.8 && [].map(ez => (
                  <g key={ez.key} opacity="0.25" style={{cursor:"pointer"}} onClick={(e)=>{e.stopPropagation();setSel({...ez,id:ez.id});setSelType("encounter");}}>
                    <circle cx={ez.x} cy={ez.y} r={ez.r} fill="rgba(212,67,58,0.04)" stroke="rgba(212,67,58,0.2)" strokeWidth="1" strokeDasharray="6,4"/>
                    {mapZoom > 2.5 && <>
                      <text x={ez.x} y={ez.y-8} textAnchor="middle" fill="var(--crimson)" fontFamily="'Cinzel', serif" fontSize="7" letterSpacing="1" opacity="0.6" style={{textTransform:"uppercase"}}>{ez.type}</text>
                      <text x={ez.x} y={ez.y+6} textAnchor="middle" fill="var(--text-muted)" fontFamily="'Spectral', serif" fontSize="8" fontStyle="italic" opacity="0.5">CR {ez.cr}</text>
                    </>}
                    {mapZoom > 3 && <text x={ez.x} y={ez.y+18} textAnchor="middle" fill="var(--text-faint)" fontFamily="'Spectral', serif" fontSize="7" opacity="0.4">{ez.name}</text>}
                  </g>
                ))}

                {/* ═══ LAYER 9: Travel route overlay (removed) ═══ */}

                {/* ═══ LAYER 10: Compass rose ═══ */}
                <g transform={`translate(${MAP_W-200},${MAP_H-200})`} opacity="0.14" style={{ pointerEvents:"none" }}>
                  <line x1="0" y1="-48" x2="0" y2="48" stroke="#7a7260" strokeWidth="1.2"/>
                  <line x1="-48" y1="0" x2="48" y2="0" stroke="#7a7260" strokeWidth="1.2"/>
                  <line x1="-30" y1="-30" x2="30" y2="30" stroke="#9a9078" strokeWidth="0.6"/>
                  <line x1="30" y1="-30" x2="-30" y2="30" stroke="#9a9078" strokeWidth="0.6"/>
                  <polygon points="0,-52 -6,-36 6,-36" fill="#6b5c42"/>
                  <polygon points="0,52 -4,38 4,38" fill="#9a9078"/>
                  <text x="0" y="-60" textAnchor="middle" fill="#5c5344" fontFamily="'Cinzel', serif" fontSize="12" fontWeight="600">N</text>
                  <text x="58" y="4" textAnchor="middle" fill="#8a8070" fontFamily="'Cinzel', serif" fontSize="9">E</text>
                  <text x="-58" y="4" textAnchor="middle" fill="#8a8070" fontFamily="'Cinzel', serif" fontSize="9">W</text>
                  <text x="0" y="72" textAnchor="middle" fill="#8a8070" fontFamily="'Cinzel', serif" fontSize="9">S</text>
                </g>

                {/* Map title cartouche */}
                <g transform={`translate(${MAP_W-980},${MAP_H-300})`}>
                  <text x="0" y="0" textAnchor="start" fill="#5c4a28" fontFamily="'Cinzel', serif" fontSize="118" fontWeight="600" letterSpacing="12" opacity="0.62" style={{ textTransform:"uppercase" }}>
                    {data.name || "The Realm"}
                  </text>
                </g>

                {/* Scale bar — visible at kingdom zoom+ */}
                {mapZoom > 0.5 && (
                  <g transform={`translate(${MAP_W-500},${MAP_H-80})`} opacity="0.38" style={{ pointerEvents:"none" }}>
                    <line x1="0" y1="0" x2="200" y2="0" stroke="#7a6e58" strokeWidth="1.4"/>
                    <line x1="0" y1="-5" x2="0" y2="5" stroke="#7a6e58" strokeWidth="1.2"/>
                    <line x1="200" y1="-5" x2="200" y2="5" stroke="#7a6e58" strokeWidth="1.2"/>
                    <line x1="100" y1="-3" x2="100" y2="3" stroke="#9a8e78" strokeWidth="0.9"/>
                    <text x="100" y="17" textAnchor="middle" fill="#6b5f4c" fontFamily="'Spectral', serif" fontSize="11" fontStyle="italic">100 leagues</text>
                  </g>
                )}
              </g>
            </svg>

            {/* Zoom level indicator + Atlas import button */}
            <div style={{ position:"absolute", top:12, right:12, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, zIndex:10 }}>
              <div style={{ padding:"6px 14px", background:"rgba(252,248,238,0.88)", border:"1px solid rgba(122,110,88,0.35)", borderRadius:"4px", fontFamily:"'Cinzel', serif", fontSize:9, color:"#5c5344", letterSpacing:"2.5px", textTransform:"uppercase", opacity:0.92, boxShadow:"0 2px 12px rgba(60,48,32,0.06)", pointerEvents:"none" }}>
                {zoomLevel} view
              </div>
              {isDM && (
                <>
                  <button onClick={() => setShowMapGenModal(true)} style={{ padding:"5px 12px", background:"rgba(30,26,22,0.85)", backdropFilter:"blur(8px)", border:"1px solid rgba(232,186,64,0.35)", borderRadius:"4px", fontFamily:"'Cinzel', serif", fontSize:9, color:"#e8ba40", letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.3)", transition:"all 0.2s" }}
                    onMouseEnter={e => { e.target.style.borderColor = "rgba(232,186,64,0.7)"; e.target.style.color = "#f5d66a"; }}
                    onMouseLeave={e => { e.target.style.borderColor = "rgba(232,186,64,0.35)"; e.target.style.color = "#e8ba40"; }}
                    title="Generate a new procedural world map"
                  >Generate Map</button>
                  {data.generatedAtlas && (
                    <button onClick={() => {
                      const atlas = generateAtlasData(Date.now());
                      const { regions, factions } = generateRegionsAndFactions(atlas);
                      setData(d => ({
                        ...d,
                        generatedAtlas: atlas,
                        regions: regions,
                        factions: factions,
                        activity: [{ time: "Just now", text: `Regenerated atlas with ${regions.length} regions and ${factions.length} factions` }, ...(d.activity || [])].slice(0, 40),
                      }));
                    }} style={{ padding:"5px 12px", background:"rgba(30,26,22,0.85)", backdropFilter:"blur(8px)", border:"1px solid rgba(232,186,64,0.35)", borderRadius:"4px", fontFamily:"'Cinzel', serif", fontSize:9, color:"#c9a85c", letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.3)", transition:"all 0.2s" }}
                      onMouseEnter={e => { e.target.style.borderColor = "rgba(232,186,64,0.7)"; e.target.style.color = "#e8ba40"; }}
                      onMouseLeave={e => { e.target.style.borderColor = "rgba(232,186,64,0.35)"; e.target.style.color = "#c9a85c"; }}
                      title="Generate a new map with a different random seed"
                    >Regenerate</button>
                  )}
                  <button onClick={() => setShowAtlasImport(true)} style={{ padding:"5px 12px", background:"rgba(30,26,22,0.85)", backdropFilter:"blur(8px)", border:"1px solid rgba(232,186,64,0.35)", borderRadius:"4px", fontFamily:"'Cinzel', serif", fontSize:9, color:"#e8ba40", letterSpacing:"1.5px", textTransform:"uppercase", cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.3)", transition:"all 0.2s" }}
                    onMouseEnter={e => { e.target.style.borderColor = "rgba(232,186,64,0.7)"; e.target.style.color = "#f5d66a"; }}
                    onMouseLeave={e => { e.target.style.borderColor = "rgba(232,186,64,0.35)"; e.target.style.color = "#e8ba40"; }}
                    title="Import a custom atlas generated by atlas-to-campaign.py"
                  >Import Atlas</button>
                </>
              )}
              {data.generatedAtlas && (
                <div style={{ padding:"3px 10px", background:"rgba(46,120,76,0.18)", border:"1px solid rgba(46,120,76,0.35)", borderRadius:"3px", fontFamily:T.ui, fontSize:8, color:"#5ec48a", letterSpacing:"1.2px", textTransform:"uppercase", pointerEvents:"none" }}>
                  Custom Atlas
                </div>
              )}
              {false && mapZoom > 2.0 && <div style={{ padding:"4px 10px", background:T.bgCard, border:`1px solid ${T.border}`, borderRadius:"2px", fontFamily:T.body, fontSize:9, color:T.textMuted, fontStyle:"italic", opacity:0.7, pointerEvents:"none" }}>
                {pois.length} points of interest
              </div>}
            </div>

            {/* Atlas Import Modal */}
            {showAtlasImport && (
              <div style={{ position:"absolute", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}
                onClick={e => { if (e.target === e.currentTarget) setShowAtlasImport(false); }}>
                <div style={{ width:560, maxHeight:"80vh", background:"#1e1a16", border:"1px solid rgba(232,186,64,0.3)", borderRadius:8, padding:24, boxShadow:"0 24px 64px rgba(0,0,0,0.7)", display:"flex", flexDirection:"column", gap:14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <h3 style={{ margin:0, fontFamily:"'Cinzel', serif", fontSize:16, color:"#e8ba40", letterSpacing:"1.5px" }}>Import Generated Atlas</h3>
                    <button onClick={() => setShowAtlasImport(false)} style={{ background:"none", border:"none", color:"#888", fontSize:18, cursor:"pointer", padding:"4px 8px" }}>&times;</button>
                  </div>
                  <p style={{ margin:0, fontFamily:T.body, fontSize:12, color:"#a09080", lineHeight:1.6 }}>
                    Paste the JavaScript output from <code style={{ background:"rgba(255,255,255,0.06)", padding:"2px 6px", borderRadius:3, fontSize:11, color:"#d4c4a0" }}>atlas-to-campaign.py</code> below.
                    This replaces the default map with your custom generated world.
                  </p>
                  <textarea
                    id="atlasImportTextarea"
                    placeholder="const ATLAS_LAND_PATH = &quot;M ...&quot;;\nconst ATLAS_ISLANDS = [ ... ];\n..."
                    style={{ width:"100%", height:220, background:"#0e0c0a", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:12, fontFamily:"'Courier New', monospace", fontSize:11, color:"#c8b890", resize:"vertical", outline:"none" }}
                  />
                  <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
                    {data.generatedAtlas && (
                      <button onClick={() => {
                        setData(d => {
                          const { generatedAtlas, ...rest } = d;
                          return { ...rest, activity: [{ time: "Just now", text: "Reverted to default atlas map" }, ...(d.activity || [])].slice(0, 40) };
                        });
                        setShowAtlasImport(false);
                      }} style={{ padding:"8px 18px", background:"rgba(180,60,60,0.15)", border:"1px solid rgba(180,60,60,0.4)", borderRadius:4, fontFamily:T.ui, fontSize:11, color:"#d46a6a", cursor:"pointer", letterSpacing:"0.5px" }}>
                        Revert to Default
                      </button>
                    )}
                    <button onClick={() => setShowAtlasImport(false)} style={{ padding:"8px 18px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:4, fontFamily:T.ui, fontSize:11, color:"#a09080", cursor:"pointer" }}>
                      Cancel
                    </button>
                    <button onClick={() => {
                      const ta = document.getElementById("atlasImportTextarea");
                      if (ta && ta.value.trim()) {
                        const ok = importAtlasData(ta.value.trim());
                        if (!ok) alert("Import failed — check the console for details. Make sure you pasted the full JS output.");
                      }
                    }} style={{ padding:"8px 22px", background:"linear-gradient(135deg, rgba(232,186,64,0.2), rgba(200,160,40,0.1))", border:"1px solid rgba(232,186,64,0.5)", borderRadius:4, fontFamily:"'Cinzel', serif", fontSize:11, color:"#e8ba40", cursor:"pointer", letterSpacing:"1px" }}>
                      Import
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Map Generation Modal */}
            {showMapGenModal && (
              <div style={{ position:"absolute", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}
                onClick={e => { if (e.target === e.currentTarget) setShowMapGenModal(false); }}>
                <div style={{ width:700, maxHeight:"90vh", background:"#1e1a16", border:"1px solid rgba(232,186,64,0.3)", borderRadius:8, padding:28, boxShadow:"0 24px 64px rgba(0,0,0,0.7)", display:"flex", flexDirection:"column", gap:18, overflow:"auto" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <h3 style={{ margin:0, fontFamily:"'Cinzel', serif", fontSize:18, color:"#e8ba40", letterSpacing:"2px" }}>Procedural Map Generator</h3>
                    <button onClick={() => setShowMapGenModal(false)} style={{ background:"none", border:"none", color:"#888", fontSize:20, cursor:"pointer", padding:"4px 8px" }}>&times;</button>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
                    {/* Left column: Controls */}
                    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                      {/* Seed */}
                      <div>
                        <label style={{ display:"block", fontFamily:T.ui, fontSize:11, color:"#a09080", letterSpacing:"1px", textTransform:"uppercase", marginBottom:6 }}>Seed (for reproducible maps)</label>
                        <div style={{ display:"flex", gap:6 }}>
                          <input
                            type="text"
                            value={genSeed}
                            onChange={e => setGenSeed(e.target.value)}
                            placeholder="e.g., 12345"
                            style={{ flex:1, background:"#0e0c0a", border:"1px solid rgba(255,255,255,0.1)", borderRadius:4, padding:"8px 12px", fontFamily:"'Courier New', monospace", fontSize:12, color:"#c8b890", outline:"none" }}
                          />
                          <button onClick={() => setGenSeed(Math.floor(Math.random() * 1000000).toString())} style={{ padding:"8px 12px", background:"rgba(232,186,64,0.15)", border:"1px solid rgba(232,186,64,0.3)", borderRadius:4, fontFamily:T.ui, fontSize:11, color:"#e8ba40", cursor:"pointer", letterSpacing:"0.5px" }}>
                            Random
                          </button>
                        </div>
                      </div>

                      {/* Map Size */}
                      <div>
                        <label style={{ display:"block", fontFamily:T.ui, fontSize:11, color:"#a09080", letterSpacing:"1px", textTransform:"uppercase", marginBottom:6 }}>Map Size</label>
                        <div style={{ display:"flex", gap:6 }}>
                          {["small", "medium", "large"].map(size => (
                            <button
                              key={size}
                              onClick={() => setGenMapSize(size)}
                              style={{
                                flex:1,
                                padding:"8px 12px",
                                background: genMapSize === size ? "rgba(232,186,64,0.25)" : "rgba(232,186,64,0.08)",
                                border: genMapSize === size ? "1px solid rgba(232,186,64,0.6)" : "1px solid rgba(232,186,64,0.2)",
                                borderRadius:4,
                                fontFamily:T.ui,
                                fontSize:11,
                                color: genMapSize === size ? "#f5d66a" : "#c9a85c",
                                cursor:"pointer",
                                letterSpacing:"0.5px",
                                textTransform:"capitalize",
                                transition:"all 0.2s"
                              }}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Climate Type */}
                      <div>
                        <label style={{ display:"block", fontFamily:T.ui, fontSize:11, color:"#a09080", letterSpacing:"1px", textTransform:"uppercase", marginBottom:6 }}>Climate</label>
                        <select
                          value={genClimate}
                          onChange={e => setGenClimate(e.target.value)}
                          style={{
                            width:"100%",
                            background:"#0e0c0a",
                            border:"1px solid rgba(255,255,255,0.1)",
                            borderRadius:4,
                            padding:"8px 12px",
                            fontFamily:T.ui,
                            fontSize:11,
                            color:"#c8b890",
                            cursor:"pointer",
                            outline:"none"
                          }}
                        >
                          <option value="temperate">Temperate</option>
                          <option value="tropical">Tropical</option>
                          <option value="arctic">Arctic</option>
                          <option value="desert">Desert</option>
                          <option value="mixed">Mixed</option>
                        </select>
                      </div>

                      {/* Continents (placeholder for future enhancement) */}
                      <div>
                        <label style={{ display:"block", fontFamily:T.ui, fontSize:11, color:"#a09080", letterSpacing:"1px", textTransform:"uppercase", marginBottom:6 }}>Continents</label>
                        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                          <input
                            type="range"
                            min="1"
                            max="4"
                            value={genContinents}
                            onChange={e => setGenContinents(parseInt(e.target.value))}
                            style={{ flex:1, cursor:"pointer" }}
                          />
                          <span style={{ fontFamily:T.ui, fontSize:12, color:"#c8b890", minWidth:20, textAlign:"center" }}>{genContinents}</span>
                        </div>
                      </div>

                      <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:12, marginTop:6 }}>
                        <p style={{ margin:"0 0 10px 0", fontFamily:T.body, fontSize:11, color:"#a09080", lineHeight:1.5 }}>
                          Preview shows terrain types: water, beaches, plains, forests, hills, mountains, and climate-specific features.
                        </p>
                      </div>
                    </div>

                    {/* Right column: Preview */}
                    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                      <label style={{ display:"block", fontFamily:T.ui, fontSize:11, color:"#a09080", letterSpacing:"1px", textTransform:"uppercase" }}>Terrain Preview</label>
                      <canvas
                        ref={canvasRef}
                        style={{
                          width:"100%",
                          height:"auto",
                          aspectRatio:"4/3",
                          background:"#0e0c0a",
                          border:"1px solid rgba(255,255,255,0.1)",
                          borderRadius:4,
                          display:"block",
                          imageRendering:"pixelated"
                        }}
                      />
                      <div style={{ fontFamily:T.body, fontSize:10, color:"#a09080", fontStyle:"italic", lineHeight:1.4 }}>
                        This preview generates terrain based on the seed and climate. The actual campaign map will be created with procedurally-generated provinces, factions, and regions.
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display:"flex", gap:10, justifyContent:"flex-end", borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:14 }}>
                    <button onClick={() => setShowMapGenModal(false)} style={{ padding:"10px 20px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:4, fontFamily:T.ui, fontSize:12, color:"#a09080", cursor:"pointer" }}>
                      Cancel
                    </button>
                    <button onClick={() => {
                      const seedNum = parseInt(genSeed) || Date.now();
                      const atlas = generateAtlasData(seedNum);
                      const { regions, factions } = generateRegionsAndFactions(atlas);
                      setData(d => ({
                        ...d,
                        generatedAtlas: atlas,
                        regions: regions,
                        factions: factions,
                        activity: [{ time: "Just now", text: `Generated new atlas (${genMapSize} map, ${genClimate} climate, seed: ${seedNum}) with ${regions.length} regions and ${factions.length} factions` }, ...(d.activity || [])].slice(0, 40),
                      }));
                      setShowMapGenModal(false);
                    }} style={{ padding:"10px 24px", background:"linear-gradient(135deg, rgba(232,186,64,0.25), rgba(200,160,40,0.12))", border:"1px solid rgba(232,186,64,0.6)", borderRadius:4, fontFamily:"'Cinzel', serif", fontSize:12, color:"#f5d66a", cursor:"pointer", letterSpacing:"1px", fontWeight:"600" }}>
                      Generate Map
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Minimap overlay — always visible when zoomed past continent */}
            {false && mapZoom > 0.5 && (
              <div style={{ position:"absolute", bottom:12, left:12, width:200, height:150, background:T.bgCard, border:`1px solid ${T.crimsonBorder}`, borderRadius:"3px", overflow:"hidden", opacity:0.88 }}>
                <svg width="200" height="150" viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
                  <rect width={MAP_W} height={MAP_H} fill="#0b1118" opacity="0.72"/>
                  <path d={atlasLandPath} fill="#1b1815" stroke="rgba(232,186,64,0.16)" strokeWidth="18"/>
                  {atlasIslands.map((isle, i) => <path key={`mm-isle-${i}`} d={isle.path} fill="#171716" opacity="0.82"/>)}
                  {/* Territory fills */}
                  {atlasTerritories.map((t,i) => <path key={`mt-${i}`} d={t.path} fill={t.color} opacity="0.16"/>)}
                  {/* Region dots */}
                  {mapRegions.map(r => <circle key={r.id} cx={r.mx} cy={r.my} r={(r.type==="city"||r.type==="kingdom")?30:18} fill={tCols[r.threat]||"var(--text-muted)"} opacity="0.5"/>)}
                  {/* Viewport indicator */}
                  {(() => {
                    const rect = mapRef.current?.getBoundingClientRect();
                    if(!rect) return null;
                    const vx = -mapPan.x / mapZoom, vy = -mapPan.y / mapZoom;
                    const vw = rect.width / mapZoom, vh = rect.height / mapZoom;
                    return <rect x={vx} y={vy} width={vw} height={vh} fill="none" stroke="var(--crimson)" strokeWidth="8" opacity="0.65" rx="4"/>;
                  })()}
                </svg>
              </div>
            )}

            {/* Travel info panel */}
            {(activeRoute || routeDraft.fromId || routeDraft.toId || worldMapState.lastRoute) && (
              <div style={{
                position:"absolute", left:"50%", bottom:isMapCompact ? 12 : 16, transform:"translateX(-50%)",
                padding:"12px 18px", borderRadius:12, pointerEvents:"auto",
                background:"rgba(248,242,228,0.94)", border:"1px solid rgba(122,110,88,0.35)",
                boxShadow:"0 14px 36px rgba(50,42,28,0.12)",
                display:"flex", alignItems:"center", gap:12, maxWidth:"calc(100% - 24px)",
              }}>
                <MapPin size={14} color="#4a6b52" />
                <div style={{ minWidth:0 }}>
                  <div style={{ fontFamily:"'Cinzel', serif", fontSize:10, letterSpacing:"1.4px", textTransform:"uppercase", color:"#3d4a38", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {activeRoute
                      ? `${activeRoute.from.name} -> ${activeRoute.to.name}`
                      : (routeDraft.fromId || routeDraft.toId)
                        ? `${worldNodesById[routeDraft.fromId]?.name || "Choose start"} -> ${worldNodesById[routeDraft.toId]?.name || "Choose destination"}`
                        : `${worldMapState.lastRoute?.from || "Route"} -> ${worldMapState.lastRoute?.to || "destination"}`}
                  </div>
                  <div style={{ fontSize:11, color:"#6b5f4c", fontFamily:T.body, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {(activeRoute && !activeRoute.blocked)
                      ? `${activeRoute.miles} miles - ${activeRoute.etaDays} days - ${activeRoute.threat} risk`
                      : activeRoute?.blocked
                        ? "No connected road route between these locations yet"
                      : (routeDraft.fromId || routeDraft.toId)
                        ? "Pick the other endpoint from any region panel"
                      : worldMapState.lastRoute
                        ? `${worldMapState.lastRoute.miles} miles - ${worldMapState.lastRoute.etaDays} days - ${worldMapState.lastRoute.threat} risk`
                        : "Select a start and destination from a region panel."}
                  </div>
                </div>
                {(activeRoute || routeDraft.fromId || routeDraft.toId) && <button type="button" onClick={clearWorldRoute} style={{
                  border:"none", background:"transparent", color:T.textFaint, cursor:"pointer", padding:4,
                }}><X size={14}/></button>}
              </div>
            )}
          </div>
        )}

        {/* ══════════ LIST TABS (regions / factions / npcs) ══════════ */}
        {tab!=="map" && (
          <div style={{ flex:1, overflowY:"auto", padding:"24px 48px" }}>
            {tab==="regions" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {data.regions.map(r => {
                  const FantasyIcon = getFantasyIcon(r.type);
                  const active=sel?.id===r.id&&selType==="region";
                  return (
                    <div key={r.id} onClick={()=>{setSel(r);setSelType("region");setEditing(false);}} style={{
                      background:active?T.bgHover:T.bgCard, padding:20, cursor:"pointer",
                      border:`1px solid ${active?T.crimsonBorder:T.border}`, borderRadius:"4px",
                      boxShadow:"0 2px 8px rgba(0,0,0,0.08)", transition:"all 0.2s",
                    }}>
                      <div style={{ display:"flex", alignItems:"start", gap:14 }}>
                        <div style={{ flexShrink:0, marginTop:-2, opacity:0.85 }}>
                          <FantasyIcon size={r.type==="city"||r.type==="kingdom"||r.type==="capital"?36:28} color={tCols[r.threat]} />
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:15, fontWeight:300, color:T.text, marginBottom:8 }}>{r.name}</div>
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:8 }}>
                            <Tag variant={r.threat==="extreme"?"critical":r.threat==="high"?"danger":r.threat==="medium"?"warning":"success"}>{r.threat}</Tag>
                            <Tag variant="muted">{r.type}</Tag>
                            {r.visited && <Tag variant="info">visited</Tag>}
                          </div>
                          <div style={{ fontSize:12, color:T.textMuted, fontWeight:300 }}>{r.ctrl} — <span style={{fontStyle:"italic"}}>{r.state}</span></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {tab==="factions" && (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {data.factions.map(f => {
                  const active=sel?.id===f.id&&selType==="faction";
                  return (
                    <div key={f.id} onClick={()=>{setSel(f);setSelType("faction");setEditing(false);}} style={{
                      background:active?T.bgHover:T.bgCard, padding:24, cursor:"pointer",
                      border:`1px solid ${active?T.crimsonBorder:T.border}`, borderRadius:"4px",
                      borderLeft:`4px solid ${f.color}`, boxShadow:"0 2px 8px rgba(0,0,0,0.08)", transition:"all 0.2s",
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                        <span style={{ fontSize:18, fontWeight:300, color:T.text }}>{f.name}</span>
                        <Tag variant={f.attitude==="allied"||f.attitude==="friendly"?"success":f.attitude==="hostile"?"danger":"muted"}>{f.attitude}</Tag>
                        {f.trend==="rising"?<TrendingUp size={12} color={T.crimson}/>:f.trend==="declining"?<TrendingDown size={12} color="#5ee09a"/>:<Minus size={12} color={T.textFaint}/>}
                      </div>
                      <p style={{ fontSize:13, color:T.textDim, margin:"0 0 10px", fontWeight:300, fontStyle:"italic" }}>{f.desc}</p>
                      <div style={{ display:"flex", alignItems:"center", gap:10, maxWidth:300 }}>
                        <span style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"1.5px" }}>PWR</span>
                        <div style={{flex:1}}><PowerBar val={f.power} max={100} color={f.color}/></div>
                        <span style={{ fontSize:12, color:T.textMuted }}>{f.power}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {tab==="npcs" && (
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {data.npcs.map(n => {
                  const active=sel?.id===n.id&&selType==="npc";
                  return (
                    <div key={n.id} onClick={()=>{setSel(n);setSelType("npc");setEditing(false);}} style={{
                      background:active?T.bgHover:T.bgCard, padding:20, cursor:"pointer", opacity:n.alive?1:0.45,
                      border:`1px solid ${active?T.crimsonBorder:T.border}`, borderRadius:"4px",
                      boxShadow:"0 2px 8px rgba(0,0,0,0.08)", transition:"all 0.2s",
                    }}>
                      <div style={{ display:"flex", alignItems:"start", gap:10 }}>
                        {n.alive?<Users size={14} color={T.textFaint}/>:<Skull size={14} color={T.crimson}/>}
                        <div>
                          <div style={{ fontSize:15, fontWeight:300, color:T.text, marginBottom:4 }}>{n.name}</div>
                          <div style={{ fontSize:12, color:T.textFaint, marginBottom:8, fontStyle:"italic", fontWeight:300 }}>{n.role} — {n.loc}</div>
                          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                            <Tag variant={n.attitude==="allied"||n.attitude==="friendly"?"success":n.attitude==="hostile"?"danger":n.attitude==="cautious"?"warning":"muted"}>{n.attitude}</Tag>
                            {n.faction && <Tag variant="muted">{n.faction}</Tag>}
                            {!n.alive && <Tag variant="danger">deceased</Tag>}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════ DETAIL PANEL (right side) ══════════ */}
        <div style={{
          width: sel ? ((tab==="map" && isMapCompact) ? "100%" : 360) : 0,
          overflowY:"auto",
          overflowX:"hidden",
          transition:"width 0.25s ease, max-height 0.25s ease, transform 0.25s ease",
          flexShrink:0,
          borderLeft:(sel && !(tab==="map" && isMapCompact))?`1px solid ${T.border}`:"none",
          position:(sel && tab==="map" && isMapCompact) ? "absolute" : "relative",
          right:0,
          bottom:0,
          left:(sel && tab==="map" && isMapCompact) ? 0 : "auto",
          zIndex:(sel && tab==="map" && isMapCompact) ? 20 : 1,
          maxHeight:(sel && tab==="map" && isMapCompact) ? "58%" : "none",
          background:(sel && tab==="map" && isMapCompact) ? "rgba(7,8,12,0.96)" : "transparent",
          borderTop:(sel && tab==="map" && isMapCompact) ? `1px solid ${T.crimsonBorder}` : "none",
          boxShadow:(sel && tab==="map" && isMapCompact) ? "0 -24px 60px rgba(0,0,0,0.45)" : "none",
          borderRadius:(sel && tab==="map" && isMapCompact) ? "18px 18px 0 0" : 0,
          backdropFilter:(sel && tab==="map" && isMapCompact) ? "blur(14px)" : "none",
        }}>
          {sel && (
            <div style={{ padding: tab==="map" && isMapCompact ? 18 : 24, width: (tab==="map" && isMapCompact) ? "100%" : 360, boxSizing:"border-box" }}>
              <Section>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    {selType==="region" && (() => { const FI = getFantasyIcon(sel.type); return <FI size={28} color={T.crimson} />; })()}
                    <div style={{ fontSize:18, color:T.text, fontWeight:300 }}>{sel.name}</div>
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <button onClick={()=>setEditing(!editing)} style={{ background:"none", border:"none", cursor:"pointer", color:editing?T.crimson:T.textFaint }}><Edit3 size={14}/></button>
                    <button onClick={()=>setSel(null)} style={{ background:"none", border:"none", cursor:"pointer", color:T.textFaint }}><X size={14}/></button>
                  </div>
                </div>

                {editing ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
                    {selType==="faction" && <>
                      <Select value={sel.attitude} onChange={v=>{updateFaction(sel.id,{attitude:v});setSel(p=>({...p,attitude:v}));}} style={{ width:"100%" }}>
                        {["allied","friendly","neutral","cautious","hostile"].map(a=><option key={a} value={a}>{a}</option>)}
                      </Select>
                      <div>
                        <span style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"1px" }}>POWER: {sel.power}</span>
                        <input type="range" min="0" max="100" value={sel.power} onChange={e=>{const v=parseInt(e.target.value);updateFaction(sel.id,{power:v});setSel(p=>({...p,power:v}));}} style={{ width:"100%" }} />
                      </div>
                      <Select value={sel.trend} onChange={v=>{updateFaction(sel.id,{trend:v});setSel(p=>({...p,trend:v}));}} style={{ width:"100%" }}>
                        {["rising","stable","declining"].map(t=><option key={t} value={t}>{t}</option>)}
                      </Select>
                    </>}
                    {selType==="region" && <>
                      <Select value={sel.type} onChange={v=>{updateRegion(sel.id,{type:v});setSel(p=>({...p,type:v}));}} style={{ width:"100%" }}>
                        {["city","town","hamlet","kingdom","castle","wilderness","forest","mountain","dungeon","ruins","route"].map(t=><option key={t} value={t}>{t}</option>)}
                      </Select>
                      <Select value={sel.threat} onChange={v=>{updateRegion(sel.id,{threat:v});setSel(p=>({...p,threat:v}));}} style={{ width:"100%" }}>
                        {["low","medium","high","extreme"].map(t=><option key={t} value={t}>{t}</option>)}
                      </Select>
                      <Input value={sel.state} onChange={v=>{updateRegion(sel.id,{state:v});setSel(p=>({...p,state:v}));}} placeholder="State" />
                      <ToggleSwitch on={sel.visited} onToggle={()=>{updateRegion(sel.id,{visited:!sel.visited});setSel(p=>({...p,visited:!p.visited}));}} label="Visited" />
                    </>}
                    {selType==="npc" && <>
                      <Select value={sel.attitude} onChange={v=>{updateNpc(sel.id,{attitude:v});setSel(p=>({...p,attitude:v}));}} style={{ width:"100%" }}>
                        {["allied","friendly","neutral","cautious","hostile"].map(a=><option key={a} value={a}>{a}</option>)}
                      </Select>
                      <Input value={sel.loc} onChange={v=>{updateNpc(sel.id,{loc:v});setSel(p=>({...p,loc:v}));}} placeholder="Location" />
                      <Input value={sel.role} onChange={v=>{updateNpc(sel.id,{role:v});setSel(p=>({...p,role:v}));}} placeholder="Role" />
                      <ToggleSwitch on={sel.alive} onToggle={()=>{updateNpc(sel.id,{alive:!sel.alive});setSel(p=>({...p,alive:!p.alive}));}} label="Alive" />
                    </>}
                  </div>
                ) : (!(tab==="map" && selType==="region" && selectedWorldNode) && (
                  <div style={{ padding:14, background:T.bg, border:`1px solid ${T.crimsonBorder}`, borderRadius:"2px", marginBottom:20 }}>
                    {selType==="region" && !(tab==="map" && selectedWorldNode) && <>
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Type: <span style={{color:T.textDim}}>{sel.type}</span></div>
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>State: <span style={{color:T.textDim,fontStyle:"italic"}}>{sel.state}</span></div>
                      <div style={{ fontSize:12, color:T.textMuted }}>Threat: <Tag variant={sel.threat==="extreme"?"critical":sel.threat==="high"?"danger":sel.threat==="medium"?"warning":"success"}>{sel.threat}</Tag></div>
                    </>}
                    {selType==="faction" && <>
                      <p style={{ fontSize:13, color:T.textDim, margin:"0 0 10px", fontWeight:300, fontStyle:"italic" }}>{sel.desc}</p>
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Power: <span style={{color:T.textDim}}>{sel.power}/100</span></div>
                      <div style={{ fontSize:12, color:T.textMuted }}>Trend: <span style={{color:T.textDim}}>{sel.trend}</span></div>
                    </>}
                    {selType==="npc" && <>
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Role: <span style={{color:T.textDim}}>{sel.role}</span></div>
                      <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Location: <span style={{color:T.textDim}}>{sel.loc}</span></div>
                      <div style={{ fontSize:12, color:T.textMuted }}>Status: <span style={{color:T.textDim}}>{sel.alive?"Alive":"Deceased"}</span></div>
                    </>}
                  </div>
                ))}

                {tab==="map" && selType==="region" && selectedWorldNode && !editing && (
                  <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                      {[
                        { label:"Quests", value:selectedWorldNode.activeQuests?.length || 0, color:"#ffd54f" },
                        { label:"NPCs", value:selectedWorldNode.npcs?.length || 0, color:"#9bb8ff" },
                        { label:"Encounters", value:selectedWorldNode.encounters?.length || 0, color:"#f06858" },
                      ].map((stat) => (
                        <div key={stat.label} style={{
                          padding:"10px 8px", borderRadius:12, textAlign:"center",
                          border:`1px solid ${T.border}`, background:"rgba(0,0,0,0.12)",
                        }}>
                          <div style={{ fontFamily:T.ui, fontSize:8, letterSpacing:"1.2px", color:T.textFaint, textTransform:"uppercase", marginBottom:6 }}>{stat.label}</div>
                          <div style={{ fontFamily:T.ui, fontSize:18, color:stat.color, fontWeight:700 }}>{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      padding:14, borderRadius:14,
                      border:`1px solid ${selectedWorldNode.stateMeta?.color || T.border}`,
                      background:selectedWorldNode.stateMeta?.glow || "rgba(255,255,255,0.03)",
                    }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, marginBottom:10 }}>
                        <div style={{ fontFamily:T.ui, fontSize:11, letterSpacing:"1px", textTransform:"uppercase", color:selectedWorldNode.stateMeta?.color || T.textMuted }}>
                          {selectedWorldNode.stateMeta?.label || selectedWorldNode.state}
                        </div>
                        <Tag variant={selectedWorldNode.threat==="extreme"?"critical":selectedWorldNode.threat==="high"?"danger":selectedWorldNode.threat==="medium"?"warning":"success"}>{selectedWorldNode.threat}</Tag>
                      </div>
                      <div style={{ fontSize:13, color:T.textDim, fontStyle:"italic", lineHeight:1.55 }}>
                        {selectedWorldNode.discovered
                          ? `${selectedWorldNode.name} is currently ${String(selectedWorldNode.stateMeta?.label || selectedWorldNode.state || "stable").toLowerCase()} under ${selectedWorldNode.ctrl || "independent control"}.`
                          : "This location has been marked on the campaign map but has not been discovered by the party yet."}
                      </div>
                    </div>

                    {activeRoute && (
                      <div style={{ padding:14, borderRadius:14, border:"1px solid rgba(94,224,154,0.2)", background:"rgba(94,224,154,0.06)" }}>
                        <div style={{ fontFamily:T.ui, fontSize:10, letterSpacing:"1.3px", textTransform:"uppercase", color:"#5ee09a", marginBottom:8 }}>Route Plan</div>
                        {activeRoute.blocked ? (
                          <div style={{ fontSize:12, color:T.textMuted, fontStyle:"italic" }}>No connected road route between those locations yet.</div>
                        ) : (
                          <>
                            <div style={{ fontSize:18, color:T.text, fontFamily:T.ui, marginBottom:6 }}>{activeRoute.from.name} -> {activeRoute.to.name}</div>
                            <div style={{ fontSize:12, color:T.textMuted, lineHeight:1.6 }}>
                              {activeRoute.miles} miles - {activeRoute.etaDays} days by road - Risk <span style={{ color:getWorldThreatColor(activeRoute.threat), textTransform:"capitalize" }}>{activeRoute.threat}</span>
                            </div>
                            <div style={{ fontSize:11, color:T.textFaint, fontStyle:"italic", marginTop:8 }}>{activeRoute.names.join(" -> ")}</div>
                          </>
                        )}
                      </div>
                    )}

                    <div style={{ display:"grid", gridTemplateColumns:isMapCompact?"1fr 1fr":"1fr 1fr", gap:8 }}>
                      <CrimsonBtn small onClick={()=>setRouteDraft((p)=>({ ...p, fromId:selectedWorldNode.id }))} secondary={routeDraft.fromId!==selectedWorldNode.id}>
                        <MapPin size={12}/> Set Start
                      </CrimsonBtn>
                      <CrimsonBtn small onClick={()=>setRouteDraft((p)=>({ ...p, toId:selectedWorldNode.id }))} secondary={routeDraft.toId!==selectedWorldNode.id}>
                        <Target size={12}/> Set Destination
                      </CrimsonBtn>
                      <CrimsonBtn small onClick={()=>focusWorldNode(selectedWorldNode, selectedWorldNode.type==="dungeon" ? "site" : selectedWorldNode.type==="city" ? "local" : "region")} secondary>
                        <Eye size={12}/> Drill In
                      </CrimsonBtn>
                      {selectedWorldNode.encounters?.length === 1 ? (
                        <CrimsonBtn small onClick={()=>queueEncounterLaunch(selectedWorldNode.encounters[0], selectedWorldNode)}>
                          <Swords size={12}/> Launch Encounter
                        </CrimsonBtn>
                      ) : (
                        <CrimsonBtn small onClick={()=>onNav && onNav("play")} secondary>
                          <Swords size={12}/> Open Play
                        </CrimsonBtn>
                      )}
                    </div>

                    {(selectedWorldNode.activeQuests?.length > 0 || selectedWorldNode.encounters?.length > 0 || selectedWorldNode.npcs?.length > 0 || selectedWorldNode.timelineEvents?.length > 0) && (
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {selectedWorldNode.activeQuests?.length > 0 && (
                          <div>
                            <div style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:8 }}>Active Quests</div>
                            {selectedWorldNode.activeQuests.map((q) => (
                              <div key={"world-q-" + q.id} style={{ padding:"10px 12px", border:`1px solid ${T.border}`, borderRadius:10, background:"rgba(0,0,0,0.08)", marginBottom:6 }}>
                                <div style={{ fontSize:13, color:T.text, fontWeight:300 }}>{q.title}</div>
                                <div style={{ marginTop:4, display:"flex", gap:6, flexWrap:"wrap" }}>
                                  <Tag variant={q.urgency==="critical"?"critical":q.urgency==="high"?"danger":q.urgency==="medium"?"warning":"muted"}>{q.urgency}</Tag>
                                  <Tag variant="muted">{q.status}</Tag>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {selectedWorldNode.encounters?.length > 0 && (
                          <div>
                            <div style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:8 }}>Encounters</div>
                            {selectedWorldNode.encounters.map((enc) => (
                              <div key={"world-enc-" + enc.id} style={{ padding:"10px 12px", border:"1px solid rgba(212,67,58,0.22)", borderRadius:10, background:"rgba(212,67,58,0.05)", marginBottom:6 }}>
                                <div style={{ fontSize:13, color:T.text, fontWeight:300 }}>{enc.name}</div>
                                <div style={{ fontSize:11, color:T.textFaint, marginTop:4, fontStyle:"italic" }}>{enc.notes || "Ready to stage in Play Mode."}</div>
                                <div style={{ marginTop:8 }}>
                                  <LinkBtn onClick={()=>queueEncounterLaunch(enc, selectedWorldNode)}><Swords size={10}/> Launch This Encounter</LinkBtn>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {selectedWorldNode.npcs?.length > 0 && (
                          <div>
                            <div style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:8 }}>NPCs On Site</div>
                            {selectedWorldNode.npcs.map((n) => (
                              <button key={"world-n-" + n.id} onClick={()=>{setSel(n);setSelType("npc");setEditing(false);}} style={{
                                width:"100%", textAlign:"left", padding:"10px 12px", border:`1px solid ${T.border}`, borderRadius:10,
                                background:"rgba(0,0,0,0.08)", color:T.text, cursor:"pointer", marginBottom:6,
                              }}>
                                <div style={{ fontSize:13, fontWeight:300 }}>{n.name}</div>
                                <div style={{ fontSize:11, color:T.textFaint, marginTop:4, fontStyle:"italic" }}>{n.role || "NPC"} - {n.faction || "Independent"}</div>
                              </button>
                            ))}
                          </div>
                        )}
                        {selectedWorldNode.timelineEvents?.length > 0 && (
                          <div>
                            <div style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", marginBottom:8 }}>Recent Events</div>
                            {selectedWorldNode.timelineEvents.map((ev) => (
                              <div key={"world-ev-" + ev.id} style={{ padding:"10px 12px", border:`1px solid ${T.border}`, borderRadius:10, background:"rgba(0,0,0,0.08)", marginBottom:6 }}>
                                <div style={{ fontSize:12, color:T.textDim, fontStyle:"italic" }}>{ev.headline || ev.text || "Campaign event"}</div>
                                <div style={{ fontFamily:T.ui, fontSize:8, color:T.textFaint, letterSpacing:"1px", marginTop:6, textTransform:"uppercase" }}>{ev.sessionTitle || "Session"} - {ev.date || ""}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {!(tab==="map" && selType==="region" && selectedWorldNode) && <>
                  <SectionTitle icon={Layers}>Connections</SectionTitle>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {conns(selType,sel).map((c,i) => (
                      <div key={i} onClick={()=>{setSel(c.e);setSelType(c.type);setEditing(false);}} style={{
                        padding:"12px 14px", background:T.bg, cursor:"pointer", borderRadius:"2px",
                        border:`1px solid ${T.border}`, borderLeft:`3px solid ${c.type==="faction"?(c.e.color||T.crimson):T.textFaint}`,
                        transition:"all 0.15s",
                      }}>
                        <span style={{ fontFamily:T.ui, fontSize:7, color:T.textFaint, letterSpacing:"2px", textTransform:"uppercase", display:"block", marginBottom:3 }}>{c.label}</span>
                        <span style={{ fontSize:13, fontWeight:300, color:T.text }}>{c.e.name||c.e.title}</span>
                      </div>
                    ))}
                    {conns(selType,sel).length===0 && <p style={{ fontSize:12, color:T.textFaint, fontStyle:"italic", fontWeight:300 }}>No connections.</p>}
                  </div>
                </>}

                {/* POI details */}
                {selType==="poi" && !editing && (
                  <div style={{ padding:14, background:T.bg, border:`1px solid ${T.crimsonBorder}`, borderRadius:"2px", marginBottom:20 }}>
                    <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Type: <span style={{color:T.textDim}}>{sel.type}</span></div>
                    <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Threat: <Tag variant={sel.threat==="extreme"?"critical":sel.threat==="high"?"danger":sel.threat==="medium"?"warning":"success"}>{sel.threat}</Tag></div>
                    <div style={{ fontSize:12, color:T.textMuted, marginTop:10, fontStyle:"italic", fontWeight:300 }}>A mysterious point of interest awaiting exploration.</div>
                  </div>
                )}
                {/* Encounter zone details */}
                {selType==="encounter" && !editing && (
                  <div style={{ padding:14, background:T.bg, border:`1px solid ${T.crimsonBorder}`, borderRadius:"2px", marginBottom:20 }}>
                    <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Type: <span style={{color:T.textDim}}>{sel.type}</span></div>
                    <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Challenge: <Tag variant={sel.cr>10?"critical":sel.cr>7?"danger":sel.cr>3?"warning":"success"}>CR {sel.cr}</Tag></div>
                    <div style={{ fontSize:12, color:T.textMuted, marginBottom:6 }}>Name: <span style={{color:T.textDim,fontStyle:"italic"}}>{sel.name}</span></div>
                    <div style={{ fontSize:12, color:T.textMuted, marginTop:10, fontStyle:"italic", fontWeight:300 }}>An area known for dangerous encounters.</div>
                  </div>
                )}
              </Section>
            </div>
          )}
        </div>
      </div>

      {/* Add Entity Modal */}
      <AddEntityModal open={addingEntity} onClose={()=>setAddingEntity(false)} tab={tab==="map"?"regions":tab} onAdd={addEntity} data={data} />
    </div>
  );
}

function AddEntityModal({ open, onClose, tab, onAdd, data }) {
  const [form, setForm] = useState({});
  useEffect(() => {
    if (tab==="regions") setForm({ name:"", type:"town", ctrl:"", threat:"low", state:"stable", visited:false, terrain:"" });
    else if (tab==="factions") setForm({ name:"", attitude:"neutral", power:50, trend:"stable", desc:"", color:"#a4b5cc" });
    else setForm({ name:"", faction:null, loc:"", attitude:"neutral", role:"", alive:true });
  }, [tab, open]);

  return (
    <Modal open={open} onClose={onClose} title={`Add ${tab.slice(0,-1)}`}>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <Input value={form.name||""} onChange={v=>setForm(p=>({...p,name:v}))} placeholder="Name" />
        {tab==="regions" && <>
          <Select value={form.type||"town"} onChange={v=>setForm(p=>({...p,type:v}))} style={{ width:"100%" }}>
            {["city","town","hamlet","kingdom","castle","wilderness","forest","mountain","dungeon","ruins","route"].map(t=><option key={t} value={t}>{t}</option>)}
          </Select>
          <Select value={form.ctrl||""} onChange={v=>setForm(p=>({...p,ctrl:v}))} style={{ width:"100%" }}>
            <option value="">No controller</option>
            {data.factions.map(f=><option key={f.id} value={f.name}>{f.name}</option>)}
          </Select>
          <Select value={form.threat||"low"} onChange={v=>setForm(p=>({...p,threat:v}))} style={{ width:"100%" }}>
            {["low","medium","high","extreme"].map(t=><option key={t} value={t}>{t}</option>)}
          </Select>
        </>}
        {tab==="factions" && <>
          <Textarea value={form.desc||""} onChange={v=>setForm(p=>({...p,desc:v}))} placeholder="Description..." rows={2} />
          <Select value={form.attitude||"neutral"} onChange={v=>setForm(p=>({...p,attitude:v}))} style={{ width:"100%" }}>
            {["allied","friendly","neutral","cautious","hostile"].map(a=><option key={a} value={a}>{a}</option>)}
          </Select>
        </>}
        {tab==="npcs" && <>
          <Input value={form.role||""} onChange={v=>setForm(p=>({...p,role:v}))} placeholder="Role (e.g., quest giver, ally)" />
          <Input value={form.loc||""} onChange={v=>setForm(p=>({...p,loc:v}))} placeholder="Location" />
          <Select value={form.faction||""} onChange={v=>setForm(p=>({...p,faction:v||null}))} style={{ width:"100%" }}>
            <option value="">No faction</option>
            {data.factions.map(f=><option key={f.id} value={f.name}>{f.name}</option>)}
          </Select>
          <Select value={form.attitude||"neutral"} onChange={v=>setForm(p=>({...p,attitude:v}))} style={{ width:"100%" }}>
            {["allied","friendly","neutral","cautious","hostile"].map(a=><option key={a} value={a}>{a}</option>)}
          </Select>
        </>}
        <CrimsonBtn onClick={()=>{if(form.name) onAdd(tab.slice(0,-1),form);}}><Plus size={12}/> Add</CrimsonBtn>
      </div>
    </Modal>
  );
}

// Register for lazy-loader
window.CampaignWorldView = WorldView;
