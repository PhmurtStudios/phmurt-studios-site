// ============================================================================
// FANTASY MAP ENGINE - PART 1: TERRAIN SYSTEM
// Standalone vanilla JavaScript map generation engine for D&D worlds
// ============================================================================

// Global FMap object - all state stored here
window.FMap = {
  canvas: null,
  ctx: null,

  // Canvas dimensions
  W: 1400,
  H: 1000,

  // Generation parameters
  seed: 0,
  level: 'world',  // 'world', 'kingdom', 'city'
  dark: true,

  // TERRAIN DATA
  grid: {
    cols: 200,
    rows: 150,
    cells: [],      // Flattened array of cell objects
    heightmap: [],  // 2D array [row][col] of 0-1
    moisture: [],   // 2D array of 0-1
    temperature: [] // 2D array of 0-1
  },

  // WORLD DATA
  world: {
    name: '',
    nameStyle: 'fantasy',
    waterLevel: 0.28,
    mountainLevel: 0.62,

    kingdoms: [],
    cities: [],
    roads: [],
    rivers: [],
    lakes: [],
    pois: [],
    features: {
      mountains: [],
      forests: [],
      seas: [],
      rivers: [],
      lakes: [],
      deserts: [],
      swamps: []
    }
  },

  // INTERACTION STATE
  view: {
    currentKingdom: null,
    currentCity: null,
    hoveredEntity: null,
    selectedEntity: null,
    pan: { x: 0, y: 0 },
    zoom: 1.0
  },

  // MAP BOUNDS for current view
  mapBounds: { x: 0, y: 0, w: 0, h: 0 },

  // USER CUSTOMIZATIONS
  userEdits: {
    renamedEntities: {},
    addedPOIs: [],
    removedPOIs: [],
    notes: {}
  }
};

// ============================================================================
// SEEDED RANDOM NUMBER GENERATOR
// ============================================================================

let fmSeedValue = 0;

/**
 * Set the RNG seed
 */
function fmSeed(s) {
  fmSeedValue = s >>> 0;
}

/**
 * Seeded pseudo-random number 0-1 using xorshift32
 */
function fmRand() {
  fmSeedValue ^= (fmSeedValue << 13) >>> 0;
  fmSeedValue ^= (fmSeedValue >> 17) >>> 0;
  fmSeedValue ^= (fmSeedValue << 5) >>> 0;
  return ((fmSeedValue >>> 0) / 4294967296);
}

/**
 * Random integer in [min, max)
 */
function fmRandInt(min, max) {
  return Math.floor(fmRand() * (max - min)) + min;
}

// ============================================================================
// HTML ESCAPING FOR XSS PREVENTION
// ============================================================================

/**
 * Escape HTML special characters to prevent XSS attacks
 */
function fmEscapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Pick random element from array
 */
function fmPick(arr) {
  if (!arr || arr.length === 0) return null;
  return arr[Math.floor(fmRand() * arr.length)];
}

/**
 * Fisher-Yates shuffle (in-place)
 */
function fmShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(fmRand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Box-Muller transform for Gaussian distribution
 */
function fmGaussian() {
  let u1, u2, s;
  do {
    u1 = fmRand() * 2 - 1;
    u2 = fmRand() * 2 - 1;
    s = u1 * u1 + u2 * u2;
  } while (s >= 1 || s === 0);

  const mul = Math.sqrt(-2 * Math.log(s) / s);
  return u1 * mul;
}

// ============================================================================
// NOISE & INTERPOLATION UTILITIES
// ============================================================================

/**
 * Perlin-style 2D value noise with interpolation
 * Simple implementation suitable for terrain
 */
function fmValueNoise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  // Get corner values using seeded hash
  const n00 = fmHashNoise(xi, yi);
  const n10 = fmHashNoise(xi + 1, yi);
  const n01 = fmHashNoise(xi, yi + 1);
  const n11 = fmHashNoise(xi + 1, yi + 1);

  // Smooth interpolation
  const u = fmSmoothstep(xf);
  const v = fmSmoothstep(yf);

  // Bilinear interpolation
  const nx0 = fmLerp(n00, n10, u);
  const nx1 = fmLerp(n01, n11, u);
  const result = fmLerp(nx0, nx1, v);

  return result;
}

/**
 * Seeded hash function for noise
 */
function fmHashNoise(x, y) {
  let n = Math.sin(x * 12.9898 + y * 78.233 + fmSeedValue) * 43758.5453;
  return n - Math.floor(n);
}

/**
 * Smoothstep interpolation curve
 */
function fmSmoothstep(t) {
  return t * t * (3 - 2 * t);
}

/**
 * Linear interpolation
 */
function fmLerp(a, b, t) {
  return a + (b - a) * t;
}

// ============================================================================
// HEIGHTMAP GENERATION
// ============================================================================

/**
 * Generate a heightmap using multi-octave noise
 * Returns 2D array [row][col] of values 0-1
 */
function fmGenerateHeightmap(cols, rows, terrainType) {
  const heightmap = [];

  // Initialize 2D array
  for (let r = 0; r < rows; r++) {
    heightmap[r] = [];
    for (let c = 0; c < cols; c++) {
      heightmap[r][c] = 0;
    }
  }

  // Multi-octave noise
  const octaves = 6;
  const persistence = 0.5;
  const lacunarity = 2.0;

  let amplitude = 1.0;
  let frequency = 1.0;
  let maxValue = 0;

  // Generate noise for each octave
  for (let oct = 0; oct < octaves; oct++) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = (c / cols) * frequency;
        const y = (r / rows) * frequency;
        const noiseVal = fmValueNoise(x, y);
        heightmap[r][c] += noiseVal * amplitude;
      }
    }

    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  // Normalize to 0-1
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      heightmap[r][c] /= maxValue;
    }
  }

  // Apply continental shaping — use fractal value noise for organic coastlines
  // The C# reference has very irregular, natural-looking landmasses with
  // peninsulas, bays, inlets, and highly variable coastline shapes

  // Helper: sample multi-octave value noise at a given scale (offset from heightmap)
  var sampleWarpNoise = function(px, py, offsetX, offsetY) {
    // 3 octaves of value noise for smooth organic shapes
    var val = 0, amp = 1, freq = 1, total = 0;
    for (var o = 0; o < 3; o++) {
      val += fmValueNoise((px + offsetX) * freq, (py + offsetY) * freq) * amp;
      total += amp;
      amp *= 0.5;
      freq *= 2.0;
    }
    return val / total; // normalized 0-1
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      var nx = c / cols;
      var ny = r / rows;

      // Distance from center — elliptical (wider than tall)
      var dx = (nx - 0.5) * 1.05;
      var dy = (ny - 0.5) * 1.25;

      // Domain warp using smooth value noise at different scales
      // Large-scale warp (freq ~2) creates major peninsulas/bays/asymmetry
      var w0x = sampleWarpNoise(nx * 1.8, ny * 1.8, 20.0, 30.0);
      var w0y = sampleWarpNoise(nx * 1.8, ny * 1.8, 40.0, 55.0);
      // Medium-large warp (freq ~3.5) creates secondary coastal features
      var w1x = sampleWarpNoise(nx * 3.5, ny * 3.5, 50.0, 80.0);
      var w1y = sampleWarpNoise(nx * 3.5, ny * 3.5, 120.0, 200.0);
      // Medium warp (freq ~6) creates smaller inlets/coves
      var w2x = sampleWarpNoise(nx * 6.0, ny * 6.0, 300.0, 400.0);
      var w2y = sampleWarpNoise(nx * 6.0, ny * 6.0, 500.0, 600.0);
      // Fine warp (freq ~11) for jagged coastline detail
      var w3x = sampleWarpNoise(nx * 11.0, ny * 11.0, 700.0, 750.0);
      var w3y = sampleWarpNoise(nx * 11.0, ny * 11.0, 780.0, 830.0);

      // Apply domain warping — strong for C#-like deeply irregular coastlines
      // The C# reference has major bays and peninsulas cutting deep into the land
      dx += (w0x - 0.5) * 0.28 + (w1x - 0.5) * 0.16 + (w2x - 0.5) * 0.07 + (w3x - 0.5) * 0.03;
      dy += (w0y - 0.5) * 0.28 + (w1y - 0.5) * 0.16 + (w2y - 0.5) * 0.07 + (w3y - 0.5) * 0.03;

      var distFromCenter = Math.sqrt(dx * dx + dy * dy) * 2;

      // Smooth gradient: 1 at center, 0 at edges
      var gradient = Math.max(0, 1.0 - distFromCenter);
      gradient = gradient * gradient * (3 - 2 * gradient); // smoothstep

      // Blend: 55% noise + 45% gradient (strong shaping for clear island with water)
      heightmap[r][c] = heightmap[r][c] * 0.55 + gradient * 0.45;

      // Soft edge ocean — smooth fade near borders with noise perturbation
      var edgeDist = Math.min(nx, 1 - nx, ny, 1 - ny);
      var borderNoise = (sampleWarpNoise(nx * 8.0, ny * 8.0, 900.0, 1000.0) - 0.5) * 0.03;
      edgeDist += borderNoise;
      if (edgeDist < 0.14) {
        var edgeFade = Math.max(0, edgeDist) / 0.14;
        edgeFade = edgeFade * edgeFade * (3 - 2 * edgeFade);
        heightmap[r][c] *= edgeFade;
      }
    }
  }

  // Apply terrain type adjustments
  if (terrainType === 'archipelago') {
    // Reduce overall height, favor islands
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        heightmap[r][c] = Math.pow(heightmap[r][c], 1.5);
      }
    }
  } else if (terrainType === 'pangaea') {
    // Increase overall height, favor single landmass
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        heightmap[r][c] = Math.pow(heightmap[r][c], 0.7);
      }
    }
  }
  // 'continental' uses default noise

  return heightmap;
}

// ============================================================================
// MOISTURE MAP GENERATION
// ============================================================================

/**
 * Generate moisture map based on distance to water and rain shadow
 */
function fmGenerateMoisture(cols, rows, heightmap, waterLevel, mountainLevel) {
  const moisture = [];

  // Initialize
  for (let r = 0; r < rows; r++) {
    moisture[r] = [];
    for (let c = 0; c < cols; c++) {
      moisture[r][c] = 0;
    }
  }

  // Base moisture from distance to water
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const h = heightmap[r][c];

      if (h <= waterLevel) {
        // Water cells get full moisture
        moisture[r][c] = 1.0;
      } else {
        // Find distance to nearest water
        let minDist = Infinity;
        for (let rr = 0; rr < rows; rr++) {
          for (let cc = 0; cc < cols; cc++) {
            if (heightmap[rr][cc] <= waterLevel) {
              const dist = Math.sqrt((r - rr) ** 2 + (c - cc) ** 2);
              minDist = Math.min(minDist, dist);
            }
          }
        }

        // Moisture decreases with distance from water (max ~40 cells away)
        const maxDist = 40;
        moisture[r][c] = Math.max(0, 1 - (minDist / maxDist));
      }
    }
  }

  // Apply rain shadow (west-to-east wind)
  // Cells behind mountains lose moisture
  const rainShadowStrength = 0.4;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (heightmap[r][c] > mountainLevel) {
        // This is a mountain - cast shadow to the east
        for (let cc = c + 1; cc < Math.min(c + 15, cols); cc++) {
          const shadowFalloff = 1 - ((cc - c) / 15);
          moisture[r][cc] *= (1 - rainShadowStrength * shadowFalloff);
        }
      }
    }
  }

  // Smooth moisture map with simple averaging
  const smoothed = [];
  for (let r = 0; r < rows; r++) {
    smoothed[r] = [];
    for (let c = 0; c < cols; c++) {
      let sum = 0;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const rr = r + dr;
          const cc = c + dc;
          if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) {
            sum += moisture[rr][cc];
            count++;
          }
        }
      }
      smoothed[r][c] = sum / count;
    }
  }

  return smoothed;
}

// ============================================================================
// TEMPERATURE MAP GENERATION
// ============================================================================

/**
 * Generate temperature map based on latitude and altitude
 */
function fmGenerateTemperature(cols, rows, heightmap, mountainLevel) {
  const temperature = [];

  for (let r = 0; r < rows; r++) {
    temperature[r] = [];
    for (let c = 0; c < cols; c++) {
      // Latitude-based: hot at equator (middle rows), cold at poles
      const latitudeFactor = 1 - Math.abs((r / rows) - 0.5) * 2;
      let temp = latitudeFactor;

      // Altitude cooling: higher elevation = colder
      const h = heightmap[r][c];
      const elevationCooling = Math.max(0, h - mountainLevel) * 0.5;
      temp = Math.max(0, temp - elevationCooling);

      // Clamp to 0-1
      temperature[r][c] = Math.max(0, Math.min(1, temp));
    }
  }

  return temperature;
}

// ============================================================================
// BIOME ASSIGNMENT
// ============================================================================

/**
 * Determine biome for a cell based on height, moisture, and temperature
 */
function fmGetBiome(height, moisture, temperature, waterLevel, mountainLevel) {
  // Water biomes
  if (height < waterLevel) {
    if (height < waterLevel - 0.15) {
      return 'deep_ocean';
    } else if (height < waterLevel - 0.05) {
      return 'ocean';
    } else {
      return 'coast';
    }
  }

  // High elevation biomes
  if (height > mountainLevel + 0.1) {
    return 'snow_peak';
  }
  if (height > mountainLevel) {
    return 'mountain';
  }
  if (height > mountainLevel - 0.08) {
    return 'hills';
  }

  // Lowland biomes based on temperature and moisture
  if (temperature < 0.2) {
    return 'tundra';
  }
  if (temperature < 0.3 && moisture < 0.3) {
    return 'tundra';
  }
  if (moisture < 0.15) {
    return 'desert';
  }
  if (moisture < 0.25 && temperature > 0.6) {
    return 'desert';
  }
  if (moisture > 0.7 && height < waterLevel + 0.08) {
    return 'swamp';
  }
  if (moisture > 0.55) {
    return 'dense_forest';
  }
  if (moisture > 0.25) {
    return 'forest';
  }

  return 'grassland';
}

/**
 * Assign biomes to all cells based on generated maps
 */
function fmAssignBiomes(cols, rows, heightmap, moisture, temperature, waterLevel, mountainLevel) {
  const cells = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const h = heightmap[r][c];
      const m = moisture[r][c];
      const t = temperature[r][c];

      const biome = fmGetBiome(h, m, t, waterLevel, mountainLevel);

      const cell = {
        x: c,
        y: r,
        col: c,
        row: r,
        height: h,
        moisture: m,
        temperature: t,
        biome: biome,
        isWater: h < waterLevel,
        isCoast: biome === 'coast',
        isRiver: false,
        isMountain: biome === 'mountain' || biome === 'snow_peak',
        isForest: biome === 'forest' || biome === 'dense_forest',
        isLake: false,
        kingdomId: null
      };

      cells.push(cell);
    }
  }

  return cells;
}

// ============================================================================
// LAKE DETECTION
// ============================================================================

/**
 * Find enclosed low-elevation areas and mark as lakes
 */
function fmDetectLakes(cols, rows, heightmap, waterLevel, mountainLevel) {
  const lakes = [];
  const visited = [];

  // Initialize visited array
  for (let r = 0; r < rows; r++) {
    visited[r] = [];
    for (let c = 0; c < cols; c++) {
      visited[r][c] = false;
    }
  }

  // Flood-fill from each unvisited land cell
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const h = heightmap[r][c];

      // Skip if already visited, water, or too high
      if (visited[r][c] || h < waterLevel || h > mountainLevel) {
        continue;
      }

      // Start flood fill to find connected region
      const region = [];
      const queue = [[r, c]];
      visited[r][c] = true;
      let minHeight = h;
      let maxHeight = h;

      while (queue.length > 0) {
        const [rr, cc] = queue.shift();
        region.push([rr, cc]);

        // Check all 4 neighbors
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (Math.abs(dr) + Math.abs(dc) !== 1) continue; // Only cardinal

            const nr = rr + dr;
            const nc = cc + dc;

            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
            if (visited[nr][nc]) continue;

            const nh = heightmap[nr][nc];

            // Include cells that are land and not too high
            if (nh >= waterLevel && nh <= mountainLevel) {
              visited[nr][nc] = true;
              queue.push([nr, nc]);
              minHeight = Math.min(minHeight, nh);
              maxHeight = Math.max(maxHeight, nh);
            }
          }
        }
      }

      // Check if region is enclosed (surrounded by higher terrain)
      // A region is a lake if it's surrounded by mountains or edges
      let isEnclosed = true;
      const borderCells = new Set();

      for (const [rr, cc] of region) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (Math.abs(dr) + Math.abs(dc) !== 1) continue;

            const nr = rr + dr;
            const nc = cc + dc;

            if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
              isEnclosed = false;
              break;
            }

            const nh = heightmap[nr][nc];
            if (nh >= waterLevel && nh <= mountainLevel) {
              // Still land
            } else if (nh < waterLevel) {
              // Adjacent to water - not enclosed
              isEnclosed = false;
              break;
            } else {
              // Adjacent to mountains - good
              borderCells.add(`${nr},${nc}`);
            }
          }
          if (!isEnclosed) break;
        }
        if (!isEnclosed) break;
      }

      // Create lake if region is large enough and enclosed
      if (isEnclosed && region.length > 5) {
        // Calculate center
        let centerR = 0, centerC = 0;
        for (const [rr, cc] of region) {
          centerR += rr;
          centerC += cc;
        }
        centerR /= region.length;
        centerC /= region.length;

        const radius = Math.sqrt(region.length / Math.PI);

        lakes.push({
          centerRow: centerR,
          centerCol: centerC,
          radius: radius,
          height: minHeight + (maxHeight - minHeight) * 0.5,
          cellCount: region.length,
          name: '',
          cells: region.map(([rr, cc]) => rr * cols + cc)
        });
      }
    }
  }

  return lakes;
}

// ============================================================================
// RIVER GENERATION
// ============================================================================

/**
 * Generate rivers by tracing downhill from peaks
 */
function fmGenerateRivers(cols, rows, heightmap, waterLevel, mountainLevel) {
  const rivers = [];
  const flowAccumulation = [];

  // Initialize flow accumulation
  for (let r = 0; r < rows; r++) {
    flowAccumulation[r] = [];
    for (let c = 0; c < cols; c++) {
      flowAccumulation[r][c] = 1; // Each cell contributes 1 unit of flow
    }
  }

  // Find high-elevation source points for rivers
  // Use a dynamic threshold: top 15% of land elevations
  var landHeights = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (heightmap[r][c] > waterLevel) landHeights.push(heightmap[r][c]);
  landHeights.sort((a, b) => b - a);
  var riverThreshold = landHeights[Math.floor(landHeights.length * 0.15)] || mountainLevel * 0.85;

  const peaks = [];
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      const h = heightmap[r][c];
      if (h <= waterLevel || h < riverThreshold) continue;

      // Must be a local maximum (higher than at least 6 of 8 neighbors)
      let higherNeighbors = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          if (heightmap[r + dr][c + dc] >= h) higherNeighbors++;
        }
      }
      let isPeak = higherNeighbors <= 2; // At most 2 neighbors higher

      if (isPeak) {
        peaks.push([r, c]);
      }
    }
  }

  // Trace from each peak
  const riverTarget = 8 + Math.floor(fmRand() * 8); // 8-15 rivers
  const selectedPeaks = fmShuffle(peaks.slice()).slice(0, Math.min(riverTarget, peaks.length));

  for (const [startR, startC] of selectedPeaks) {
    const riverPath = [];
    let r = startR;
    let c = startC;
    let flow = flowAccumulation[r][c];
    const visited = new Set();

    // Trace downhill
    while (true) {
      // Check if we reached water
      if (heightmap[r][c] <= waterLevel) {
        riverPath.push([r, c, flow]);
        break;
      }

      visited.add(`${r},${c}`);
      riverPath.push([r, c, flow]);

      // Find steepest neighbor
      let steepestNeighbor = null;
      let steepestDrop = 0;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;

          const nr = r + dr;
          const nc = c + dc;

          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (visited.has(`${nr},${nc}`)) continue;

          const drop = heightmap[r][c] - heightmap[nr][nc];
          if (drop > steepestDrop) {
            steepestDrop = drop;
            steepestNeighbor = [nr, nc];
          }
        }
      }

      // If no downhill neighbor, stop
      if (!steepestNeighbor) {
        break;
      }

      // Move to neighbor and accumulate flow
      [r, c] = steepestNeighbor;
      flow += flowAccumulation[r][c];

      // Prevent infinite loops
      if (riverPath.length > 500) {
        break;
      }
    }

    if (riverPath.length > 5) {
      rivers.push({
        path: riverPath,
        length: riverPath.length,
        maxFlow: Math.max(...riverPath.map(p => p[2])),
        name: ''
      });
    }
  }

  return rivers;
}

// ============================================================================
// COASTLINE EXTRACTION
// ============================================================================

/**
 * Extract coastline polylines by walking boundary between land and water
 */
function fmExtractCoastlines(cols, rows, heightmap, waterLevel) {
  const coastlines = [];
  const visited = new Set();

  // Find all coast cells
  const coastCells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const h = heightmap[r][c];
      if (h <= waterLevel) continue; // Skip water

      // Check if adjacent to water
      let isCoast = false;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;

          const nr = r + dr;
          const nc = c + dc;

          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) {
            isCoast = true;
            break;
          }

          if (heightmap[nr][nc] <= waterLevel) {
            isCoast = true;
            break;
          }
        }
        if (isCoast) break;
      }

      if (isCoast) {
        coastCells.push([r, c]);
      }
    }
  }

  // Trace coastline paths
  for (let i = 0; i < coastCells.length; i++) {
    const [startR, startC] = coastCells[i];
    const key = `${startR},${startC}`;

    if (visited.has(key)) continue;

    const coastline = [];
    let r = startR;
    let c = startC;
    let prevDir = -1;

    // Trace along coast
    for (let step = 0; step < 1000; step++) {
      coastline.push([r, c]);
      visited.add(`${r},${c}`);

      // Find next coast cell (prefer continuing in same direction)
      let found = false;

      // Try directions in order (clockwise from previous direction)
      for (let offset = 0; offset < 8; offset++) {
        const dir = (prevDir + offset + 1) % 8;
        const dr = Math.floor(dir / 3) - 1;
        const dc = (dir % 3) - 1;

        const nr = r + dr;
        const nc = c + dc;

        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (visited.has(`${nr},${nc}`)) continue;

        const h = heightmap[nr][nc];
        if (h <= waterLevel) continue; // Skip water

        // Check if neighbor is coast
        let isCoast = false;
        for (let dr2 = -1; dr2 <= 1; dr2++) {
          for (let dc2 = -1; dc2 <= 1; dc2++) {
            if (dr2 === 0 && dc2 === 0) continue;

            const nr2 = nr + dr2;
            const nc2 = nc + dc2;

            if (nr2 < 0 || nr2 >= rows || nc2 < 0 || nc2 >= cols) {
              isCoast = true;
              break;
            }

            if (heightmap[nr2][nc2] <= waterLevel) {
              isCoast = true;
              break;
            }
          }
          if (isCoast) break;
        }

        if (isCoast) {
          r = nr;
          c = nc;
          prevDir = dir;
          found = true;
          break;
        }
      }

      if (!found || (r === startR && c === startC && step > 10)) {
        break;
      }
    }

    if (coastline.length > 5) {
      coastlines.push(coastline);
    }
  }

  return coastlines;
}

// ============================================================================
// WORLD GENERATION FUNCTION
// ============================================================================

/**
 * Main world generation function
 * @param {Object} options - {size, terrainType, nameStyle}
 */
function fmGenerateWorld(options) {
  const opts = options || {};
  const terrainType = opts.terrainType || 'continental';
  const nameStyle = opts.nameStyle || 'fantasy';

  const cols = FMap.grid.cols;
  const rows = FMap.grid.rows;

  // Set seed (never allow 0 — xorshift produces all zeros)
  if (opts.seed !== undefined && opts.seed !== 0) {
    FMap.seed = opts.seed;
  }
  if (!FMap.seed) {
    FMap.seed = Math.floor(Math.random() * 2147483647) + 1;
  }
  fmSeed(FMap.seed);

  // Generate heightmap
  const heightmap = fmGenerateHeightmap(cols, rows, terrainType);
  FMap.grid.heightmap = heightmap;

  // Generate moisture and temperature maps
  const moisture = fmGenerateMoisture(cols, rows, heightmap, FMap.world.waterLevel, FMap.world.mountainLevel);
  FMap.grid.moisture = moisture;

  const temperature = fmGenerateTemperature(cols, rows, heightmap, FMap.world.mountainLevel);
  FMap.grid.temperature = temperature;

  // Assign biomes to cells
  const cells = fmAssignBiomes(cols, rows, heightmap, moisture, temperature, FMap.world.waterLevel, FMap.world.mountainLevel);
  FMap.grid.cells = cells;

  // Detect lakes
  const lakes = fmDetectLakes(cols, rows, heightmap, FMap.world.waterLevel, FMap.world.mountainLevel);
  FMap.world.lakes = lakes;

  // Mark lake cells
  for (const lake of lakes) {
    for (const cellIdx of lake.cells) {
      if (cellIdx < cells.length) {
        cells[cellIdx].isLake = true;
        cells[cellIdx].biome = 'lake';
      }
    }
  }

  // Generate rivers
  const rivers = fmGenerateRivers(cols, rows, heightmap, FMap.world.waterLevel, FMap.world.mountainLevel);
  FMap.world.rivers = rivers;

  // Mark river cells
  for (const river of rivers) {
    for (const [r, c, flow] of river.path) {
      const idx = r * cols + c;
      if (idx < cells.length) {
        cells[idx].isRiver = true;
      }
    }
  }

  // Extract coastlines
  const coastlines = fmExtractCoastlines(cols, rows, heightmap, FMap.world.waterLevel);
  FMap.world.features.coastlines = coastlines;

  // Update world data
  FMap.world.nameStyle = nameStyle;
  FMap.world.size = opts.size || 'medium';
  FMap.world.name = fmGenerateWorldName(nameStyle);

  // Generate kingdoms, settlements, roads, and POIs
  fmGenerateKingdoms();
  fmGenerateSettlements();
  FMap.world.cities = FMap.world.settlements; // Sync for render code
  fmGenerateRoads();
  fmGeneratePOIs();

  return FMap;
}

// ============================================================================
// UTILITY: World Name Generation
// ============================================================================

function fmGenerateWorldName(style) {
  const fantasyNames = [
    'Aethermoor', 'Valorian', 'Thornwick', 'Celestia', 'Grimhold',
    'Meridian', 'Shadowpeak', 'Goldleaf', 'Stormhaven', 'Winterheim',
    'Sunfire', 'Mystvale', 'Ironforge', 'Starlight', 'Darkwater'
  ];

  if (style === 'fantasy') {
    return fmPick(fantasyNames);
  }

  // Generic fallback
  return 'World ' + Math.floor(fmRand() * 10000);
}

// ============================================================================
// === END PART 1: TERRAIN ENGINE ===
// ============================================================================

// ============================================================================
// PART 2: POLITICAL LAYER - KINGDOMS, SETTLEMENTS, ROADS, POIs
// ============================================================================

// ============================================================================
// 1. NAME GENERATION SYSTEM
// ============================================================================

const fmNameGen = {
  // Syllable pools for each culture
  cultures: {
    fantasy: {
      prefixes: ['Val', 'Dra', 'Thal', 'Mor', 'Nyx', 'Aet', 'Sol', 'Lun', 'Vor', 'Syl', 'Cri', 'Ald', 'Mir', 'Ren', 'Vess', 'Ast', 'Cyn', 'Pher', 'Iz', 'Wyn'],
      middles: ['dor', 'ath', 'in', 'is', 'an', 'eth', 'ar', 'ir', 'ur', 'ol', 'el', 'al', 'um', 'on', 'en', 'ian', 'ion', 'iel', 'ael', 'aes'],
      suffixes: ['heim', 'haven', 'hold', 'reach', 'wood', 'field', 'ford', 'stone', 'peak', 'dale', 'mark', 'wyn', 'rath', 'tor', 'wick', 'ham', 'burg', 'port', 'crest', 'fall'],
      features: {
        mountain: ['Ironpeak', 'Stormcrest', 'Shattered', 'Dragonspine', 'Skyreach', 'Frostfang', 'Blackthorn', 'Silverfang', 'Coldpeak', 'Ravenfang'],
        forest: ['Darkwood', 'Shadowglen', 'Greenleaf', 'Whisperwood', 'Deepwood', 'Thornwald', 'Eldergrove', 'Mystic Woods', 'Ravencrest Forest', 'Enchanted Wilds'],
        sea: ['The Sapphire', 'The Endless Deep', 'The Shifting Sea', 'The Azure Waters', 'The Tempest Ocean', 'The Shattered Strait', 'The Lonely Deep', 'The Sunken Realm', 'The Twilight Sea', 'The Abyssal Dark'],
        river: ['Silverrun', 'Stormflow', 'Darkwater', 'Goldstream', 'Swiftcourse', 'Boneriver', 'Mistway', 'Thornbrook', 'Ashflow', 'Moonwater'],
        lake: ['Glaciermere', 'Starlight Lake', 'Moonshadow Pool', 'Darkwater Lake', 'Crystal Mere', 'Silent Pool', 'Drowned Castle Lake', 'Shattered Mirror', 'Twilight Lake', 'Lost Depths'],
        desert: ['The Sunscourge', 'The Golden Waste', 'The Scorched Expanse', 'The Dustpan', 'The Bleached Lands', 'The Ashfields', 'The Endless Sand', 'The Crimson Waste', 'The Dead Valley', 'The Shattered Sands'],
        swamp: ['Blightmire', 'Deadmarsh', 'Rottenfen', 'Cursed Mire', 'Shadowfen', 'Bogrot', 'Sickswamp', 'Ghostfens', 'Strangler\'s Marsh', 'Blackwater Bog']
      },
      poi: ['The Sunken Crypt', 'Temple of the Dawn', 'Ruins of Aldmoor', 'The Obsidian Tower', 'Cave of Echoes', 'Shrine of Stars', 'The Shattered Keep', 'Wizard\'s Vale', 'The Drowned Temple', 'Fortress Eternal', 'The Hidden Sanctum', 'Dragon\'s Rest', 'The Crimson Spire', 'Lost Library', 'The Midnight Tower']
    },
    norse: {
      prefixes: ['Bjorn', 'Raven', 'Storm', 'Thor', 'Grim', 'Sver', 'Hel', 'Jor', 'Knut', 'Leif', 'Ulf', 'Berg', 'Stein', 'Frode', 'Sig', 'Dag', 'Nott', 'Vind', 'Frost', 'Hal'],
      middles: ['ar', 'en', 'in', 'an', 'ur', 'vik', 'heim', 'sund', 'fyrd', 'jord', 'stad', 'fell', 'tun', 'dal', 'skerry', 'nyn', 'mark', 'folk', 'gard', 'holmr'],
      suffixes: ['heim', 'vik', 'stad', 'fjord', 'fell', 'ness', 'mark', 'fold', 'hold', 'garde', 'holm', 'tun', 'by', 'folk', 'gard', 'kaup', 'skerry', 'sund', 'dal', 'ey'],
      features: {
        mountain: ['Ironheim', 'Skyfall', 'Stormcrags', 'Frostheim', 'Grimfell', 'Blackstone', 'Ravenfang', 'Shattered Peak', 'Stoneheim', 'Dragoncrags'],
        forest: ['Darkwood Vale', 'Wolfwood', 'Eldergrove', 'Shadowglen', 'Frostwood', 'Mistwald', 'Greenheim', 'Thornwood', 'Deepwood', 'Blackforest'],
        sea: ['The Northsea', 'The Storm Strait', 'The Jade Deep', 'The Shattered Wave', 'The Grey Ocean', 'The Endless Waters', 'The Fjord Runs', 'The Treacherous Deep', 'The Norse Waters', 'The Frozen Sea'],
        river: ['Silverrun', 'Stormflow', 'Icewater', 'Wolfrun', 'Hardanger', 'Raindancer', 'Thortun', 'Viggrun', 'Frostheim', 'Bjornwater'],
        lake: ['Glaciermere', 'Icewater Lake', 'Grimtarn', 'Frostholm', 'Darkwater', 'Stormholm', 'Ravenmere', 'Northholm', 'Skypool', 'Frozen Mere'],
        desert: ['The Ashlands', 'The Scorched Badlands', 'The Dustheap', 'The Burning Waste', 'The Grey Wilds', 'The Dead Marches', 'The Golden Expanse', 'The Sunblasted Plains', 'The Windswept Flats', 'The Forsaken Valley'],
        swamp: ['Rottenfen', 'Blightmire', 'Bogrot', 'Murkmere', 'Foulfen', 'Cursed Marshes', 'Shadowfen', 'Deadland Mire', 'Ghostfens', 'The Rotten Depths']
      },
      poi: ['The Great Hall', 'Tomb of Heroes', 'The Drowned Temple', 'Frostheim Tower', 'The Obsidian Depths', 'Shrine of Odin', 'Ruined Fortress', 'The Rune Stone Circle', 'Hall of the Ancients', 'The Dragon\'s Mound']
    },
    celtic: {
      prefixes: ['Bran', 'Dun', 'Kel', 'Lugh', 'Aed', 'Fionn', 'Conn', 'Cath', 'Sidh', 'Mór', 'Cael', 'Airne', 'Bel', 'Caer', 'Doire', 'Fid', 'Glas', 'Innis', 'Lon', 'Ros'],
      middles: ['an', 'en', 'in', 'adh', 'ach', 'och', 'ugh', 'aig', 'aidh', 'eadh', 'ithe', 'ath', 'eas', 'cladh', 'tuath', 'muig', 'fonn', 'lagh', 'dach', 'gal'],
      suffixes: ['sidh', 'din', 'fort', 'baile', 'cill', 'derry', 'more', 'finn', 'linn', 'tane', 'gaoth', 'tulach', 'cliffe', 'leah', 'glas', 'ness', 'bog', 'wood', 'vale', 'rock'],
      features: {
        mountain: ['Beannagh', 'Sliabh Gréine', 'Carraigheannagh', 'Cruach Dubh', 'An Spéir Dorcha', 'Sliabh Mór', 'Cnoc Fionnaidh', 'Barr Dubhgheal', 'An Bré', 'Carraigeán'],
        forest: ['Coilltean Dorcha', 'Fiodh Glas', 'Craobh Dhubh', 'Doire Tréan', 'Fiadh Gheal', 'Coill Cheannann', 'Fiodh Chaoil', 'Doire Fiadh', 'Sceimh Gheal', 'Fiodh an Chobhair'],
        sea: ['An Muir Thuaidh', 'An Fharraige Gheal', 'An Charraig Dhubh', 'An Spréacharnach', 'An Muir Mór', 'An Fharraige Réaltach', 'An Dúlachán', 'An Charraige Thréan', 'An Muir Gheal', 'An Fharraige Dorcha'],
        river: ['Abhainn Airgid', 'Abhainn Geal', 'Abhainn Dhubh', 'Abhainn na Gréine', 'Abhainn Fhuar', 'Abhainn Thréan', 'Abhainn Ghlas', 'Abhainn Chaol', 'Abhainn Shiúil', 'Abhainn Chluichí'],
        lake: ['Loch Geal', 'Loch Dubh', 'Loch an Spréacharnach', 'Loch Réaltach', 'Loch Glas', 'Loch Fuar', 'Loch an Éisc', 'Loch an Chobhair', 'Loch Tréan', 'Loch an Dorchadas'],
        desert: ['An Fhásach Dhubh', 'An Spréachleacht Dhóite', 'Na Tirim-Thuaidh', 'An Fhásach Gheal', 'An Fhásach Thuaidh', 'An Ghainimh Fhuar', 'An Spréachleacht Lonrach', 'An Fhásach Réamhshaolta', 'An Fhásach Fhuil', 'An Tuaidhgheal'],
        swamp: ['Bogach Dhubh', 'Féar Dorcha', 'Fálcadh Dubh', 'Bogach na Draíochta', 'Féar Foluain', 'Fálcadh Glas', 'Bogach Thréan', 'Féar an Bhhraonaigh', 'Fálcadh Síoraí', 'Bogach Lonrach']
      },
      poi: ['Tuaim an Chatha', 'Teampall an Solais', 'Fuaid Oilbhéim', 'Sídhean Gréine', 'Oileán an Draíochta', 'Teampall Mór', 'Caislean na Cianóige', 'An Carraig Dhraíochta', 'Baile na nGhost', 'Fál an tSíoraí']
    },
    arabic: {
      prefixes: ['Al', 'Ash', 'Az', 'Ibn', 'Umm', 'Jabal', 'Wadi', 'Burj', 'Kasr', 'Qalat', 'Ribat', 'Riad', 'Darb', 'Suq', 'Khan', 'Dar', 'Masjid', 'Minaret', 'Qasida', 'Zarqah'],
      middles: ['if', 'in', 'an', 'il', 'ar', 'or', 'ur', 'aq', 'ah', 'ayn', 'alah', 'adeen', 'amah', 'anah', 'iyyah', 'awiyah', 'aldeen', 'aldin', 'amid', 'amir'],
      suffixes: ['ah', 'ih', 'iyah', 'an', 'in', 'een', 'adh', 'adah', 'abad', 'stan', 'ia', 'ium', 'ara', 'istan', 'istan', 'aldin', 'aldeen', 'uddin', 'uddeen', 'alik'],
      features: {
        mountain: ['Jabal Qahira', 'Jabal Aswad', 'Jabal Ramlah', 'Jabal Qaf', 'Jabal Nur', 'Jabal Hijaz', 'Jabal Durrah', 'Jabal Sundus', 'Jabal Ashraf', 'Jabal Lubnan'],
        forest: ['Ghabet Khadra', 'Ghabet Qadimah', 'Ghabet Asrar', 'Ghabet Adib', 'Ghabet Siraj', 'Ghabet Noor', 'Ghabet Safra', 'Ghabet Amira', 'Ghabet Janna', 'Ghabet Bahira'],
        sea: ['Bahr al-Qazim', 'Bahr al-Abyad', 'Bahr al-Raha', 'Bahr al-Sidr', 'Bahr al-Gharib', 'Bahr al-Kadhim', 'Bahr al-Jammal', 'Bahr al-Noor', 'Bahr al-Lail', 'Bahr as-Samak'],
        river: ['Nahr Zahab', 'Nahr Qamar', 'Nahr Saif', 'Nahr Hana', 'Nahr Baraka', 'Nahr Samrah', 'Nahr Jadwal', 'Nahr Thuluj', 'Nahr Laban', 'Nahr Qasr'],
        lake: ['Buhayrat Azraq', 'Buhayrat Bayda', 'Buhayrat Asrar', 'Buhayrat Qamrah', 'Buhayrat Farrah', 'Buhayrat Sahra', 'Buhayrat Layali', 'Buhayrat Janah', 'Buhayrat Saba', 'Buhayrat Nur'],
        desert: ['Rimal al-Qasim', 'Sahra al-Hamra', 'Rimal al-Khali', 'Sahra al-Qahira', 'Rimal al-Nubaa', 'Sahra al-Asrar', 'Rimal al-Layali', 'Sahra al-Dhahabiyya', 'Rimal al-Labi', 'Sahra al-Faraha'],
        swamp: ['Birka Sawda', 'Marsh al-Aswad', 'Birka al-Asrar', 'Marsh al-Talyah', 'Birka Qadhirah', 'Marsh al-Lail', 'Birka al-Qalb', 'Marsh al-Haram', 'Birka as-Siyanah', 'Marsh al-Qamar']
      },
      poi: ['Qasr al-Qadimah', 'Masjid al-Noor', 'Makbarat al-Amlak', 'Burj al-Ghaib', 'Kutat al-Hikma', 'Kabir al-Sahar', 'Qalat ad-Dhahab', 'Riad al-Jinn', 'Ribat al-Akhira', 'Bayt al-Khafaya']
    },
    eastern: {
      prefixes: ['Jade', 'Silver', 'Golden', 'Mystic', 'Dragon', 'Phoenix', 'Star', 'Moon', 'Sun', 'Cloud', 'Wind', 'Water', 'Stone', 'Bamboo', 'Lotus', 'Petal', 'Autumn', 'Spring', 'Eternal', 'Serene'],
      middles: ['an', 'in', 'en', 'on', 'un', 'ai', 'ei', 'ong', 'ang', 'ing', 'iang', 'uang', 'ia', 'iao', 'ie', 'io', 'ua', 'uo', 'ue', 'üe'],
      suffixes: ['jing', 'yang', 'ling', 'ming', 'feng', 'guo', 'zhou', 'xia', 'shan', 'he', 'men', 'tang', 'hui', 'zhai', 'tian', 'hu', 'gang', 'ye', 'chen', 'an'],
      features: {
        mountain: ['Jade Dragon Peak', 'Silver Crane Mountain', 'Golden Phoenix Summit', 'Eternal Stone Ridge', 'Misty Cloud Peak', 'Phoenix Fire Mountain', 'Celestial Peak', 'Moonlit Crag', 'Sunfire Ridge', 'Serpent Spine Mountain'],
        forest: ['Bamboo Grove', 'Serene Forest', 'Mystic Woodland', 'Ancient Grove', 'Whispering Pines', 'Jade Forest', 'Phoenix Nest Woods', 'Enchanted Garden', 'Moonlit Grove', 'Eternal Glade'],
        sea: ['The Jade Sea', 'The Misty Strait', 'The Eternal Ocean', 'The Pearl Waters', 'The Moonlit Sea', 'The Dragon\'s Waters', 'The Sunlit Expanse', 'The Serene Deep', 'The Crystal Strait', 'The Heaven\'s Mirror'],
        river: ['Jade Dragon River', 'Silver Crescent Flow', 'Golden Phoenix Stream', 'Moonlight Course', 'Whispering River', 'Spirit Flow', 'Eternal Stream', 'Peach Blossom River', 'Star Water', 'Heaven\'s Path River'],
        lake: ['Jade Mirror Lake', 'Serene Pool', 'Moon Reflection Lake', 'Crystal Lotus Lake', 'Azure Heaven Pool', 'Eternal Mirror', 'Dragon\'s Eye Lake', 'Phoenix Nesting Lake', 'Starlight Pool', 'Heaven\'s Breath Lake'],
        desert: ['The Golden Wasteland', 'The Crimson Expanse', 'The Eternal Dunes', 'The Scorched Plains', 'The Endless Sand', 'The Cursed Wastes', 'The Sunblasted Flats', 'The Red Barrens', 'The Forsaken Sands', 'The Dead Lands'],
        swamp: ['Murky Marsh', 'Shadowed Wetland', 'Cursed Bog', 'Rotting Fen', 'Black Mire', 'Fetid Swamp', 'Shadow Marshland', 'Gloomy Wetland', 'Pestilent Bog', 'Sunken Marshes']
      },
      poi: ['Temple of Eternal Light', 'Jade Pagoda', 'Dragon\'s Rest', 'Phoenix Sanctuary', 'Garden of Immortals', 'Tower of Heaven', 'Shrine of Stars', 'Hall of Ancestors', 'Mystic Library', 'Peak of Enlightenment']
    }
  },

  // Helper: Generate compound names from syllables
  _syllableCombo(culture, count = 2) {
    const pool = this.cultures[culture];
    const parts = [];
    if (count >= 1) parts.push(fmPick(pool.prefixes));
    if (count >= 2) parts.push(fmPick(pool.middles));
    if (count >= 3) parts.push(fmPick(pool.suffixes));
    return parts.join('');
  },

  // Kingdom name
  kingdom(culture = 'fantasy') {
    const pool = this.cultures[culture] || this.cultures.fantasy;
    const formats = [
      () => 'The ' + this._syllableCombo(culture, 2) + ' Empire',
      () => 'Kingdom of ' + this._syllableCombo(culture, 2),
      () => 'The ' + this._syllableCombo(culture, 2) + ' Realm',
      () => this._syllableCombo(culture, 2) + ' Domain',
      () => 'The ' + this._syllableCombo(culture, 1) + ' Lands',
      () => 'Dominion of ' + this._syllableCombo(culture, 1),
      () => 'The ' + fmPick(pool.prefixes) + 'hold',
      () => this._syllableCombo(culture, 2) + ' Kingdom'
    ];
    return fmPick(formats)();
  },

  // City name
  city(culture = 'fantasy') {
    const pool = this.cultures[culture] || this.cultures.fantasy;
    const formats = [
      () => this._syllableCombo(culture, 2),
      () => fmPick(pool.prefixes) + fmPick(pool.suffixes),
      () => this._syllableCombo(culture, 3),
      () => fmPick(pool.prefixes) + 'haven',
      () => fmPick(pool.prefixes) + 'port',
      () => fmPick(pool.prefixes) + 'hold'
    ];
    return fmPick(formats)();
  },

  // Town name
  town(culture = 'fantasy') {
    const pool = this.cultures[culture] || this.cultures.fantasy;
    const formats = [
      () => this._syllableCombo(culture, 2),
      () => fmPick(pool.prefixes) + 'field',
      () => fmPick(pool.prefixes) + 'ford',
      () => fmPick(pool.prefixes) + 'wood',
      () => fmPick(pool.prefixes) + 'wick',
      () => fmPick(pool.prefixes) + fmPick(pool.suffixes)
    ];
    return fmPick(formats)();
  },

  // Hamlet name
  hamlet(culture = 'fantasy') {
    const pool = this.cultures[culture] || this.cultures.fantasy;
    const formats = [
      () => fmPick(pool.prefixes) + 'burrow',
      () => 'Old ' + fmPick(pool.prefixes),
      () => fmPick(pool.prefixes) + ' Creek',
      () => fmPick(pool.prefixes) + ' Hollow',
      () => fmPick(pool.prefixes) + ' Rest',
      () => fmPick(pool.prefixes) + ' Stead',
      () => fmPick(pool.suffixes) + ' ' + fmPick(['Spring', 'Shelter', 'Haven', 'Hearth']),
      () => this._syllableCombo(culture, 1) + 'by'
    ];
    return fmPick(formats)();
  },

  // Geographic feature name
  feature(type = 'mountain', culture = 'fantasy') {
    const pool = this.cultures[culture] || this.cultures.fantasy;
    return fmPick(pool.features[type] || pool.features.mountain);
  },

  // POI name
  poi(type = 'dungeon') {
    const typeNames = {
      dungeon: ['The Sunken Crypt', 'The Obsidian Depths', 'Darkfathom Cavern', 'The Infernal Halls', 'Tomb of Kings', 'The Black Abyss', 'Chamber of Sorrows', 'The Endless Dungeon', 'Cavern of Whispers', 'The Iron Pit'],
      ruins: ['Ruins of Aldmoor', 'The Shattered Keep', 'Lost Citadel', 'Fallen Spire', 'The Broken Kingdom', 'Ancient Ramparts', 'The Cursed Tower', 'Remnants of Glory', 'The Forgotten Fort', 'Crumbling Fortress'],
      temple: ['Temple of the Dawn', 'Shrine of Stars', 'Sacred Sanctum', 'The Sunlit Temple', 'Hall of the Divine', 'Temple Eternal', 'The Celestial Shrine', 'House of Prayer', 'The Blessed Sanctuary', 'Temple of Light'],
      tower: ['The Obsidian Tower', 'Wizard\'s Spire', 'The Silent Tower', 'Tower of Ages', 'The Starlight Tower', 'Ebon Tower', 'The Crystal Spire', 'Tower of Echoes', 'The Ancient Lighthouse', 'Tower of Mysteries'],
      cave: ['Cave of Echoes', 'The Deep Cavern', 'Hollow Depths', 'Stone Cathedral', 'The Crystal Caves', 'Cavern of Shadows', 'The Hollow Below', 'Dragon\'s Lair', 'The Singing Caves', 'Abyss Cavern'],
      shrine: ['Shrine of Stars', 'Wayfarer\'s Rest', 'Sacred Stone', 'The Hidden Shrine', 'Shrine of Hope', 'Traveler\'s Blessing', 'The Moonlit Shrine', 'Shrine of Souls', 'The Forgotten Altar', 'Sanctuary of Peace'],
      battlefield: ['Field of Sorrows', 'The Crimson Plains', 'Broken Valley', 'The Shattered Grounds', 'Valley of Echoes', 'The Scarred Earth', 'Field of Bones', 'The Fallen Plain', 'Graveyard Field', 'The Bloodied Grass'],
      mine: ['The Silver Vein', 'Deepdelve Mine', 'The Iron Shaft', 'Goldstrike Mine', 'The Obsidian Quarry', 'Brightstone Mine', 'The Hidden Vein', 'Gemstone Pit', 'The Ancient Mine', 'Deepdark Shaft'],
      camp: ['Bandit\'s Haven', 'The Forsaken Camp', 'Outlaw\'s Rest', 'The Hidden Encampment', 'Brigand\'s Hideout', 'The Nomad Camp', 'Ranger\'s Post', 'The Lost Camp', 'Stronghold Camp', 'The Rebel Base'],
      portal: ['The Void Gate', 'Portal to Beyond', 'The Shattered Gate', 'The Planar Rift', 'Gateway of Souls', 'The Cosmic Tear', 'The Mystic Portal', 'The Star Gate', 'The Dimensional Breach', 'The Eldritch Gate'],
      dragon_lair: ['Dragon\'s Rest', 'The Wyrm\'s Throne', 'The Drake\'s Sanctum', 'Draconic Peak', 'The Golden Hoard', 'Dragon\'s Eyrie', 'The Scaled Palace', 'The Draconic Temple', 'The Wyrm\'s Nest', 'The Dragon Throne']
    };
    return fmPick(typeNames[type] || typeNames.dungeon);
  },

  // NPC ruler name
  person(culture = 'fantasy') {
    const pool = this.cultures[culture] || this.cultures.fantasy;
    const titles = ['Lord', 'Lady', 'King', 'Queen', 'Prince', 'Princess', 'Duke', 'Duchess', 'Count', 'Countess'];
    const name = this._syllableCombo(culture, 2);
    return fmPick(titles) + ' ' + name;
  },

  // Tavern name
  tavern() {
    const colors = ['Red', 'Golden', 'Silver', 'Black', 'Crimson', 'Azure', 'Scarlet', 'White', 'Green', 'Purple'];
    const animals = ['Griffin', 'Dragon', 'Flagon', 'Whistle', 'Stag', 'Wolf', 'Raven', 'Lion', 'Hawk', 'Boar', 'Wyvern', 'Horse', 'Serpent', 'Swan', 'Oak', 'Anvil', 'Crown', 'Cauldron', 'Sword', 'Shield'];
    const formats = [
      () => 'The ' + fmPick(colors) + ' ' + fmPick(animals),
      () => 'The ' + fmPick(animals) + '\'s ' + fmPick(['Rest', 'Haven', 'Inn', 'Hall', 'House']),
      () => 'The ' + fmPick(animals) + ' and ' + fmPick(animals),
      () => fmPick(['The Rusty', 'The Broken', 'The Leaky', 'The Cozy', 'The Warm', 'The Dark', 'The Merry']) + ' ' + fmPick(animals),
      () => fmPick(colors) + ' ' + fmPick(['Lounge', 'Pub', 'Inn', 'Tavern', 'House', 'Lodge'])
    ];
    return fmPick(formats)();
  }
};

// ============================================================================
// 2. KINGDOM GENERATION
// ============================================================================

function fmGenerateKingdoms() {
  const { cols, rows } = FMap.grid;
  // Use world size setting for kingdom count
  var sizeRanges = { small: [5, 7], medium: [6, 9], large: [7, 10] };
  var range = sizeRanges[FMap.world.size] || sizeRanges.medium;
  const numKingdoms = fmRandInt(range[0], range[1]);

  const kingdomColorPalette = [
    {fill:'rgba(180,50,50,0.15)', border:'rgba(180,50,50,0.6)', text:'#b43232'},
    {fill:'rgba(50,100,180,0.15)', border:'rgba(50,100,180,0.6)', text:'#3264b4'},
    {fill:'rgba(50,150,80,0.15)', border:'rgba(50,150,80,0.6)', text:'#329650'},
    {fill:'rgba(140,60,160,0.15)', border:'rgba(140,60,160,0.6)', text:'#8c3ca0'},
    {fill:'rgba(200,130,30,0.15)', border:'rgba(200,130,30,0.6)', text:'#c8821e'},
    {fill:'rgba(40,150,140,0.15)', border:'rgba(40,150,140,0.6)', text:'#28968c'},
    {fill:'rgba(160,80,40,0.15)', border:'rgba(160,80,40,0.6)', text:'#a05028'},
    {fill:'rgba(100,100,150,0.15)', border:'rgba(100,100,150,0.6)', text:'#646496'},
    {fill:'rgba(180,160,40,0.15)', border:'rgba(180,160,40,0.6)', text:'#b4a028'}
  ];

  const cultures = ['fantasy', 'norse', 'celtic', 'arabic', 'eastern'];
  const kingdoms = [];
  const seedCells = [];

  // Find valid seed cells for kingdoms
  function findValidSeedCell(existingSeeds) {
    let attempts = 0;
    while (attempts < 100) {
      const row = fmRandInt(10, rows - 10);
      const col = fmRandInt(10, cols - 10);
      const cell = FMap.grid.cells[row * cols + col];

      // Must be habitable, not water, not mountain
      if (cell && !cell.isWater && !cell.isMountain) {
        // Check distance from other seeds
        let tooClose = false;
        for (let seed of existingSeeds) {
          const dist = Math.sqrt(Math.pow(seed.row - row, 2) + Math.pow(seed.col - col, 2));
          if (dist < 40) {
            tooClose = true;
            break;
          }
        }
        if (!tooClose) return {row, col};
      }
      attempts++;
    }
    return null;
  }

  // Create kingdom seed cells
  for (let i = 0; i < numKingdoms; i++) {
    const seed = findValidSeedCell(seedCells);
    if (seed) {
      seedCells.push(seed);
      const culture = fmPick(cultures);
      const name = fmNameGen.kingdom(culture);
      const ruler = fmNameGen.person(culture);
      const color = kingdomColorPalette[i % kingdomColorPalette.length];

      kingdoms.push({
        id: i,
        name: name,
        ruler: ruler,
        culture: culture,
        color: color,
        seedCell: seed,
        cells: [],
        capital: null,
        cities: [],
        area: 0
      });
    }
  }

  // Flood fill to grow kingdoms
  for (let kingdom of kingdoms) {
    const visited = new Set();
    const queue = [kingdom.seedCell];
    visited.add(`${kingdom.seedCell.row},${kingdom.seedCell.col}`);

    while (queue.length > 0) {
      const current = queue.shift();
      const cell = FMap.grid.cells[current.row * cols + current.col];

      if (!cell || cell.isWater) continue;

      // Assign cell to kingdom
      cell.kingdomId = kingdom.id;
      kingdom.cells.push(cell);

      // Try to expand to neighbors
      const neighbors = [
        {row: current.row - 1, col: current.col},
        {row: current.row + 1, col: current.col},
        {row: current.row, col: current.col - 1},
        {row: current.row, col: current.col + 1}
      ];

      for (let neighbor of neighbors) {
        if (neighbor.row < 0 || neighbor.row >= rows || neighbor.col < 0 || neighbor.col >= cols) continue;
        const key = `${neighbor.row},${neighbor.col}`;
        if (visited.has(key)) continue;
        visited.add(key);

        const nCell = FMap.grid.cells[neighbor.row * cols + neighbor.col];
        if (!nCell || nCell.isWater) continue;

        // Can cross mountains/rivers with difficulty
        let canCross = true;
        let shouldAdd = true;

        if (nCell.isMountain && fmRand() > 0.2) canCross = false;
        if (nCell.isRiver && fmRand() > 0.5) canCross = false;

        if (canCross) {
          queue.push(neighbor);
        }
      }
    }

    kingdom.area = kingdom.cells.length;
  }

  FMap.world.kingdoms = kingdoms;
  return kingdoms;
}

// ============================================================================
// 3. SETTLEMENT PLACEMENT
// ============================================================================

function fmGenerateSettlements() {
  const { cols } = FMap.grid;
  const settlements = [];
  let settlementId = 0;

  const settlementTraits = [
    'trade hub', 'mining town', 'port city', 'fortress', 'holy site',
    'scholar\'s refuge', 'artist colony', 'merchant\'s haven', 'garrison',
    'fishing village', 'agricultural center', 'shipyard', 'library'
  ];

  const buildingNames = {
    tavern: () => fmNameGen.tavern(),
    temple: () => 'Temple of ' + fmNameGen._syllableCombo(fmPick(['fantasy', 'norse', 'celtic']), 1),
    market: () => 'Central Market',
    guild: () => fmPick(['Thieves\' Guild', 'Mages\' College', 'Merchant\'s Guild', 'Craftsmen\'s Hall', 'Adventurers\' Hall']),
    other: () => fmPick(['Blacksmith', 'Town Hall', 'Library', 'Watch House', 'Armory', 'Stable', 'Inn'])
  };

  function getSettlementTraits(settlement) {
    const traits = [];
    if (settlement.isCoastal) traits.push('port city');
    if (settlement.isRiver) traits.push('trade hub');

    // Add random traits
    while (traits.length < 2 && fmRand() > 0.4) {
      const trait = fmPick(settlementTraits);
      if (!traits.includes(trait)) traits.push(trait);
    }
    return traits;
  }

  function getBuildings(settlement) {
    const buildings = [];
    buildings.push(buildingNames.tavern());
    buildings.push(buildingNames.temple());
    if (settlement.population > 500) {
      buildings.push(buildingNames.guild());
    }
    if (settlement.population > 1000) {
      buildings.push(buildingNames.other());
    }
    return buildings;
  }

  function isValidSettlementLocation(row, col, minDist) {
    if (row < 0 || row >= FMap.grid.rows || col < 0 || col >= cols) return false;
    const cell = FMap.grid.cells[row * cols + col];
    if (!cell || cell.isWater || cell.isMountain) return false;

    // Check distance from other settlements
    for (let settlement of settlements) {
      const dist = Math.sqrt(Math.pow(settlement.row - row, 2) + Math.pow(settlement.col - col, 2));
      if (dist < minDist) return false;
    }
    return true;
  }

  // For each kingdom, place settlements
  for (let kingdom of FMap.world.kingdoms) {
    const culture = kingdom.culture;

    // 1. Capital at seed cell
    const seedCell = kingdom.seedCell;
    const capital = {
      id: `settlement_${settlementId++}`,
      name: fmNameGen.city(culture),
      type: 'capital',
      population: fmRandInt(10000, 80000),
      kingdomId: kingdom.id,
      row: seedCell.row,
      col: seedCell.col,
      x: 0,
      y: 0,
      isCoastal: FMap.grid.cells[seedCell.row * cols + seedCell.col].isCoast,
      isRiver: FMap.grid.cells[seedCell.row * cols + seedCell.col].isRiver,
      ruler: kingdom.ruler,
      traits: ['capital'],
      buildings: getBuildings({population: fmRandInt(10000, 80000)}),
      pois: []
    };
    settlements.push(capital);
    kingdom.capital = capital;
    kingdom.cities.push(capital);

    // 2. Cities (2-4 per kingdom)
    const numCities = fmRandInt(2, 5);
    for (let i = 0; i < numCities; i++) {
      let placed = false;
      for (let attempt = 0; attempt < 50; attempt++) {
        const idx = fmRandInt(0, kingdom.cells.length);
        const kCell = kingdom.cells[idx];
        if (isValidSettlementLocation(kCell.row, kCell.col, 15)) {
          const city = {
            id: `settlement_${settlementId++}`,
            name: fmNameGen.city(culture),
            type: 'city',
            population: fmRandInt(3000, 15000),
            kingdomId: kingdom.id,
            row: kCell.row,
            col: kCell.col,
            x: 0,
            y: 0,
            isCoastal: kCell.isCoast,
            isRiver: kCell.isRiver,
            ruler: fmNameGen.person(culture),
            traits: getSettlementTraits({isCoastal: kCell.isCoast, isRiver: kCell.isRiver}),
            buildings: getBuildings({population: fmRandInt(3000, 15000)}),
            pois: []
          };
          settlements.push(city);
          kingdom.cities.push(city);
          placed = true;
          break;
        }
      }
    }

    // 3. Towns (4-8 per kingdom)
    const numTowns = fmRandInt(4, 9);
    for (let i = 0; i < numTowns; i++) {
      let placed = false;
      for (let attempt = 0; attempt < 50; attempt++) {
        const idx = fmRandInt(0, kingdom.cells.length);
        const kCell = kingdom.cells[idx];
        if (isValidSettlementLocation(kCell.row, kCell.col, 8)) {
          const town = {
            id: `settlement_${settlementId++}`,
            name: fmNameGen.town(culture),
            type: 'town',
            population: fmRandInt(500, 3000),
            kingdomId: kingdom.id,
            row: kCell.row,
            col: kCell.col,
            x: 0,
            y: 0,
            isCoastal: kCell.isCoast,
            isRiver: kCell.isRiver,
            ruler: '',
            traits: getSettlementTraits({isCoastal: kCell.isCoast, isRiver: kCell.isRiver}),
            buildings: getBuildings({population: fmRandInt(500, 3000)}),
            pois: []
          };
          settlements.push(town);
          placed = true;
          break;
        }
      }
    }

    // 4. Hamlets (6-12 per kingdom)
    const numHamlets = fmRandInt(6, 13);
    for (let i = 0; i < numHamlets; i++) {
      let placed = false;
      for (let attempt = 0; attempt < 50; attempt++) {
        const idx = fmRandInt(0, kingdom.cells.length);
        const kCell = kingdom.cells[idx];
        if (isValidSettlementLocation(kCell.row, kCell.col, 4)) {
          const hamlet = {
            id: `settlement_${settlementId++}`,
            name: fmNameGen.hamlet(culture),
            type: 'hamlet',
            population: fmRandInt(50, 500),
            kingdomId: kingdom.id,
            row: kCell.row,
            col: kCell.col,
            x: 0,
            y: 0,
            isCoastal: kCell.isCoast,
            isRiver: kCell.isRiver,
            ruler: '',
            traits: [],
            buildings: [],
            pois: []
          };
          settlements.push(hamlet);
          placed = true;
          break;
        }
      }
    }
  }

  FMap.world.settlements = settlements;
  return settlements;
}

// ============================================================================
// 4. ROAD NETWORK WITH A* PATHFINDING
// ============================================================================

// Priority queue for A* algorithm
class PriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(item, priority) {
    const newItem = {item, priority};
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (newItem.priority < this.items[i].priority) {
        this.items.splice(i, 0, newItem);
        added = true;
        break;
      }
    }
    if (!added) this.items.push(newItem);
  }
  dequeue() {
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
}

// A* Pathfinding
function fmAStarPath(start, goal, cols, rows) {
  const getCost = (cell) => {
    if (!cell || cell.isWater) return Infinity;
    if (cell.isMountain) return 15;
    if (cell.isMountain && cell.height > 0.75) return Infinity;
    if (cell.isForest || cell.biome === 'dense_forest') return 3;
    if (cell.biome === 'swamp') return 8;
    if (cell.biome === 'desert') return 4;
    if (cell.biome === 'grassland' || cell.biome === 'hills') return (cell.biome === 'hills' ? 5 : 1);
    if (cell.isCoast || cell.biome === 'beach') return 2;
    return 2;
  };

  const heuristic = (a, b) => {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  };

  const openSet = new PriorityQueue();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  const key = (row, col) => `${row},${col}`;
  const startKey = key(start.row, start.col);
  const goalKey = key(goal.row, goal.col);

  openSet.enqueue(start, 0);
  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(start, goal));

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue().item;
    const currentKey = key(current.row, current.col);

    if (currentKey === goalKey) {
      // Reconstruct path
      const path = [current];
      let prev = current;
      while (cameFrom.has(key(prev.row, prev.col))) {
        prev = cameFrom.get(key(prev.row, prev.col));
        path.unshift(prev);
      }
      return path;
    }

    // Check neighbors
    const neighbors = [
      {row: current.row - 1, col: current.col},
      {row: current.row + 1, col: current.col},
      {row: current.row, col: current.col - 1},
      {row: current.row, col: current.col + 1}
    ];

    for (let neighbor of neighbors) {
      if (neighbor.row < 0 || neighbor.row >= rows || neighbor.col < 0 || neighbor.col >= cols) continue;

      const nCell = FMap.grid.cells[neighbor.row * cols + neighbor.col];
      const nKey = key(neighbor.row, neighbor.col);
      const tentativeG = (gScore.get(currentKey) || 0) + getCost(nCell);

      if (!gScore.has(nKey) || tentativeG < gScore.get(nKey)) {
        cameFrom.set(nKey, current);
        gScore.set(nKey, tentativeG);
        const h = heuristic(neighbor, goal);
        fScore.set(nKey, tentativeG + h);
        openSet.enqueue(neighbor, tentativeG + h);
      }
    }
  }

  // No path found, return empty
  return [];
}

function fmGenerateRoads() {
  const { cols, rows } = FMap.grid;
  const roads = [];
  let roadId = 0;

  const createRoad = (from, to, type) => {
    const fromSettlement = FMap.world.settlements.find(s => s.id === from);
    const toSettlement = FMap.world.settlements.find(s => s.id === to);

    if (!fromSettlement || !toSettlement) return null;

    const startCell = FMap.grid.cells[fromSettlement.row * cols + fromSettlement.col];
    const endCell = FMap.grid.cells[toSettlement.row * cols + toSettlement.col];

    const path = fmAStarPath(startCell, endCell, cols, rows);

    if (path.length > 0) {
      const road = {
        id: `road_${roadId++}`,
        type: type,
        from: from,
        to: to,
        path: path.map(c => ({row: c.row, col: c.col})),
        length: path.length
      };
      return road;
    }
    return null;
  };

  // 1. Major roads: Connect all capitals to each other and to 2-3 nearest cities
  const capitals = FMap.world.settlements.filter(s => s.type === 'capital');
  for (let i = 0; i < capitals.length; i++) {
    for (let j = i + 1; j < capitals.length; j++) {
      const road = createRoad(capitals[i].id, capitals[j].id, 'major');
      if (road) roads.push(road);
    }
  }

  // Connect capitals to nearest cities
  for (let capital of capitals) {
    const capitalCities = FMap.world.settlements.filter(
      s => s.type === 'city' && s.kingdomId === capital.kingdomId && s.id !== capital.id
    );
    const nearest = capitalCities.sort((a, b) => {
      const distA = Math.sqrt(Math.pow(a.row - capital.row, 2) + Math.pow(a.col - capital.col, 2));
      const distB = Math.sqrt(Math.pow(b.row - capital.row, 2) + Math.pow(b.col - capital.col, 2));
      return distA - distB;
    }).slice(0, 3);

    for (let city of nearest) {
      const road = createRoad(capital.id, city.id, 'major');
      if (road) roads.push(road);
    }
  }

  // 2. Minor roads: Connect cities to nearest towns
  const cities = FMap.world.settlements.filter(s => s.type === 'city');
  for (let city of cities) {
    const towns = FMap.world.settlements.filter(
      s => s.type === 'town' && s.kingdomId === city.kingdomId
    );
    const nearest = towns.sort((a, b) => {
      const distA = Math.sqrt(Math.pow(a.row - city.row, 2) + Math.pow(a.col - city.col, 2));
      const distB = Math.sqrt(Math.pow(b.row - city.row, 2) + Math.pow(b.col - city.col, 2));
      return distA - distB;
    }).slice(0, 3);

    for (let town of nearest) {
      const road = createRoad(city.id, town.id, 'minor');
      if (road) roads.push(road);
    }
  }

  // 3. Trails: Connect towns to nearest hamlets
  const towns = FMap.world.settlements.filter(s => s.type === 'town');
  for (let town of towns) {
    const hamlets = FMap.world.settlements.filter(
      s => s.type === 'hamlet' && s.kingdomId === town.kingdomId
    );
    const nearest = hamlets.sort((a, b) => {
      const distA = Math.sqrt(Math.pow(a.row - town.row, 2) + Math.pow(a.col - town.col, 2));
      const distB = Math.sqrt(Math.pow(b.row - town.row, 2) + Math.pow(b.col - town.col, 2));
      return distA - distB;
    }).slice(0, 2);

    for (let hamlet of nearest) {
      const road = createRoad(town.id, hamlet.id, 'trail');
      if (road) roads.push(road);
    }
  }

  FMap.world.roads = roads;
  return roads;
}

// ============================================================================
// 5. POI GENERATION
// ============================================================================

function fmGeneratePOIs() {
  const { cols, rows } = FMap.grid;
  const pois = [];
  let poiId = 0;

  const poiTemplates = {
    dungeon: {
      descriptions: [
        'An ancient crypt said to hold the remains of a forgotten king. Local villagers report ghostly lights at night.',
        'A sunken dungeon complex, its entrance hidden beneath overgrown vines. Strange sounds echo from the depths.',
        'An obsidian tower fallen into ruin, its chambers now infested with creatures of shadow.',
        'The hollow remains of a great fortress, its dungeons still intact but sealed from the world.',
        'A network of caverns carved by ancient civilization, now home to unknown terrors.'
      ],
      levels: [5, 8, 10, 12, 15],
      loot: ['Ancient artifacts', 'Gold and jewels', 'Magical weapons', 'Cursed relics', 'Lost treasures']
    },
    ruins: {
      descriptions: [
        'Crumbling towers of a once-great civilization, reclaimed by nature.',
        'The shattered remains of a grand fortress, now a haunt for bandits and worse.',
        'Ancient stone structures, their purpose long forgotten, covered in mysterious runes.',
        'A field of fallen monuments, each telling of a glory long past.',
        'The broken citadel of an ancient empire, its secrets buried beneath the rubble.'
      ],
      levels: [3, 6, 8, 10, 12],
      loot: ['Artifacts', 'Historical records', 'Gold coins', 'Strange gems', 'Ancient scrolls']
    },
    temple: {
      descriptions: [
        'A sacred temple devoted to ancient gods, its altars still pristine.',
        'An ornate sanctuary hidden in the wilderness, tended by mysterious monks.',
        'A crumbling temple complex, its chambers filled with reliquaries and treasures.',
        'A sunlit shrine built upon a sacred hill, known for miracles and answered prayers.',
        'An ancient temple, its rituals still performed by devoted followers.'
      ],
      levels: [2, 4, 6, 8, 10],
      loot: ['Holy relics', 'Offerings', 'Sacred texts', 'Divine artifacts', 'Blessed items']
    },
    tower: {
      descriptions: [
        'A crumbling watchtower overlooking the valley. Bandits have taken up residence.',
        'An arcane tower once home to a powerful wizard, now sealed and silent.',
        'A lighthouse tower on a cliff, still tended by a mysterious keeper.',
        'A tower of dark stone, radiating an unnatural cold.',
        'A crystal spire visible for miles, its purpose unknown.'
      ],
      levels: [4, 7, 9, 11, 13],
      loot: ['Magical artifacts', 'Spellbooks', 'Treasure hoard', 'Strange devices', 'Potions']
    },
    cave: {
      descriptions: [
        'A vast cavern system beneath the earth, home to ancient creatures.',
        'A limestone cave network, glittering with crystals and underground rivers.',
        'Dark caverns inhabited by things that fear the light.',
        'An echo chamber of vast proportions, its walls carved with ancient script.',
        'A network of flooded caves, accessible only by boat or magic.'
      ],
      levels: [3, 6, 8, 10, 12],
      loot: ['Gemstones', 'Minerals', 'Creatures\' hoard', 'Strange bones', 'Underground treasures']
    },
    shrine: {
      descriptions: [
        'A small wayside shrine, tended by traveling monks and grateful pilgrims.',
        'A hidden shrine nestled in a glade, sacred to druids and nature lovers.',
        'An ancient shrine, worn smooth by centuries of pilgrims seeking blessing.',
        'A roadside shrine marking the grave of a legendary hero.',
        'A shrine dedicated to a mysterious power, its guardians unknown.'
      ],
      levels: [1, 2, 3, 4, 5],
      loot: ['Offerings', 'Blessed water', 'Sacred relics', 'Donations', 'Ancient coins']
    },
    battlefield: {
      descriptions: [
        'A haunted field where thousands fell in ancient war. Spirits still linger.',
        'A valley of bones, where great armies clashed in the distant past.',
        'A scarred plain where a legendary battle decided the fate of nations.',
        'An open field stained with blood, now home to restless spectres.',
        'A grassland littered with ancient weapons and bones, forgotten by history.'
      ],
      levels: [6, 8, 10, 12, 14],
      loot: ['Ancient weapons', 'Armor', 'Coins', 'Treasures', 'Haunted items']
    },
    mine: {
      descriptions: [
        'An abandoned mine shaft, its veins still rich with valuable ore.',
        'A working silver mine, now overrun with dangerous creatures.',
        'An ancient mining complex, its deepest levels unexplored.',
        'A gemstone mine flooded with water, accessible only to those with magic.',
        'A deep iron mine where dwarven craftsmen once worked, now silent.'
      ],
      levels: [4, 6, 8, 10, 12],
      loot: ['Ore', 'Gemstones', 'Gold', 'Rare minerals', 'Dwarven treasures']
    },
    camp: {
      descriptions: [
        'A hidden camp of bandits, well-supplied and heavily guarded.',
        'The makeshift camp of nomadic raiders, abandoned but recently used.',
        'A rebel stronghold hidden in the forest, defended by desperate fighters.',
        'An outlaw\'s hideout, notorious throughout the region.',
        'A mercenary camp, presently abandoned but showing signs of recent occupation.'
      ],
      levels: [3, 5, 7, 9, 11],
      loot: ['Stolen goods', 'Weapons', 'Gold', 'Maps', 'Supplies']
    },
    portal: {
      descriptions: [
        'An ancient gateway of mysterious origins, humming with eldritch energy.',
        'A shimmering rift in reality, leading to unknown planes of existence.',
        'A portal sealed long ago, but still faintly visible to those who know where to look.',
        'A cosmic tear in the fabric of existence, dangerous and unpredictable.',
        'A gateway created by powerful magic, its purpose obscured by time.'
      ],
      levels: [15, 16, 17, 18, 20],
      loot: ['Planar artifacts', 'Alien treasures', 'Impossible items', 'Ancient knowledge', 'Otherworldly power']
    },
    dragon_lair: {
      descriptions: [
        'The cavernous lair of an ancient dragon, filled with gold and jewels beyond measure.',
        'A mountain peak hollowed by a wyrm of immense age and power.',
        'A vast underground palace carved by a dragon\'s claw, its hoard legendary.',
        'The broken nest of a mighty draconic beast, still reeking of brimstone.',
        'A cavern sanctum where a dragon of terrible power makes its home.'
      ],
      levels: [18, 19, 20, 20, 20],
      loot: ['Dragon hoard', 'Ancient artifacts', 'Dragon scales', 'Spell components', 'Legendary treasures']
    }
  };

  const difficulties = ['easy', 'medium', 'hard', 'deadly'];

  const numPOIs = fmRandInt(30, 61);
  const poiTypes = Object.keys(poiTemplates);

  // Add rare POIs first
  const rareTypes = {portal: 2, dragon_lair: 2};
  for (let type in rareTypes) {
    for (let i = 0; i < rareTypes[type]; i++) {
      let placed = false;
      for (let attempt = 0; attempt < 100; attempt++) {
        const row = fmRandInt(10, rows - 10);
        const col = fmRandInt(10, cols - 10);
        const cell = FMap.grid.cells[row * cols + col];

        if (cell && !cell.isWater && (type === 'dragon_lair' ? cell.isMountain : true)) {
          // Find nearest settlement
          let nearest = null;
          let minDist = Infinity;
          for (let settlement of FMap.world.settlements) {
            const dist = Math.sqrt(Math.pow(settlement.row - row, 2) + Math.pow(settlement.col - col, 2));
            if (dist < minDist) {
              minDist = dist;
              nearest = settlement;
            }
          }

          const template = poiTemplates[type];
          const poi = {
            id: `poi_${poiId++}`,
            name: fmNameGen.poi(type),
            type: type,
            description: fmPick(template.descriptions),
            row: row,
            col: col,
            level: fmPick(template.levels),
            difficulty: fmPick(difficulties),
            loot: fmPick(template.loot),
            nearestSettlement: nearest ? nearest.name : 'Unknown',
            kingdomId: cell.kingdomId
          };
          pois.push(poi);
          placed = true;
          break;
        }
      }
    }
  }

  // Generate remaining POIs
  while (pois.length < numPOIs) {
    let attempts = 0;
    while (attempts < 50) {
      const row = fmRandInt(5, rows - 5);
      const col = fmRandInt(5, cols - 5);
      const cell = FMap.grid.cells[row * cols + col];

      if (cell && !cell.isWater) {
        // Check if too close to existing POI
        let tooClose = false;
        for (let poi of pois) {
          const dist = Math.sqrt(Math.pow(poi.row - row, 2) + Math.pow(poi.col - col, 2));
          if (dist < 8) {
            tooClose = true;
            break;
          }
        }

        if (!tooClose) {
          // Filter to non-rare types
          let type = fmPick(poiTypes.filter(t => !rareTypes[t]));

          // Find nearest settlement
          let nearest = null;
          let minDist = Infinity;
          for (let settlement of FMap.world.settlements) {
            const dist = Math.sqrt(Math.pow(settlement.row - row, 2) + Math.pow(settlement.col - col, 2));
            if (dist < minDist) {
              minDist = dist;
              nearest = settlement;
            }
          }

          const template = poiTemplates[type];
          const poi = {
            id: `poi_${poiId++}`,
            name: fmNameGen.poi(type),
            type: type,
            description: fmPick(template.descriptions),
            row: row,
            col: col,
            level: fmPick(template.levels),
            difficulty: fmPick(difficulties),
            loot: fmPick(template.loot),
            nearestSettlement: nearest ? nearest.name : 'Unknown',
            kingdomId: cell.kingdomId
          };
          pois.push(poi);
          break;
        }
      }
      attempts++;
    }
  }

  FMap.world.pois = pois.slice(0, numPOIs);
  return FMap.world.pois;
}

// ============================================================================
// 6. FEATURE NAMING
// ============================================================================

function fmNameFeatures() {
  const { cols, rows } = FMap.grid;
  const visited = new Set();

  const features = {
    mountains: [],
    forests: [],
    seas: [],
    rivers: [],
    lakes: [],
    deserts: [],
    swamps: []
  };

  // Helper: Flood fill to find connected regions
  const floodFill = (startRow, startCol, predicate) => {
    const region = [];
    const queue = [{row: startRow, col: startCol}];
    const key = (r, c) => `${r},${c}`;
    const visited2 = new Set();

    while (queue.length > 0) {
      const current = queue.shift();
      const k = key(current.row, current.col);
      if (visited2.has(k)) continue;
      visited2.add(k);

      const cell = FMap.grid.cells[current.row * cols + current.col];
      if (!cell || !predicate(cell)) continue;

      region.push(cell);

      const neighbors = [
        {row: current.row - 1, col: current.col},
        {row: current.row + 1, col: current.col},
        {row: current.row, col: current.col - 1},
        {row: current.row, col: current.col + 1}
      ];

      for (let neighbor of neighbors) {
        if (neighbor.row < 0 || neighbor.row >= rows || neighbor.col < 0 || neighbor.col >= cols) continue;
        const nk = key(neighbor.row, neighbor.col);
        if (!visited2.has(nk)) {
          queue.push(neighbor);
        }
      }
    }
    return region;
  };

  // Find mountains
  for (let i = 0; i < FMap.grid.cells.length; i++) {
    const cell = FMap.grid.cells[i];
    const key = `${cell.row},${cell.col}`;
    if (cell.isMountain && !visited.has(key)) {
      const region = floodFill(cell.row, cell.col, c => c.isMountain);
      if (region.length > 0) {
        region.forEach(c => visited.add(`${c.row},${c.col}`));
        const culture = fmPick(['fantasy', 'norse', 'celtic']);
        features.mountains.push({
          name: fmNameGen.feature('mountain', culture),
          cells: region,
          center: {row: Math.round(region.reduce((a, c) => a + c.row, 0) / region.length),
                   col: Math.round(region.reduce((a, c) => a + c.col, 0) / region.length)},
          cellCount: region.length
        });
      }
    }
  }

  // Find forests
  visited.clear();
  for (let i = 0; i < FMap.grid.cells.length; i++) {
    const cell = FMap.grid.cells[i];
    const key = `${cell.row},${cell.col}`;
    if ((cell.isForest || cell.biome === 'dense_forest') && !visited.has(key)) {
      const region = floodFill(cell.row, cell.col, c => c.isForest || c.biome === 'dense_forest');
      if (region.length > 20) {
        region.forEach(c => visited.add(`${c.row},${c.col}`));
        const culture = fmPick(['fantasy', 'norse', 'celtic']);
        features.forests.push({
          name: fmNameGen.feature('forest', culture),
          cells: region,
          center: {row: Math.round(region.reduce((a, c) => a + c.row, 0) / region.length),
                   col: Math.round(region.reduce((a, c) => a + c.col, 0) / region.length)},
          cellCount: region.length
        });
      }
    }
  }

  // Find seas (large water bodies)
  visited.clear();
  for (let i = 0; i < FMap.grid.cells.length; i++) {
    const cell = FMap.grid.cells[i];
    const key = `${cell.row},${cell.col}`;
    if (cell.isWater && !visited.has(key)) {
      const region = floodFill(cell.row, cell.col, c => c.isWater);
      if (region.length > 100) {
        region.forEach(c => visited.add(`${c.row},${c.col}`));
        const culture = fmPick(['fantasy', 'norse', 'celtic']);
        features.seas.push({
          name: fmNameGen.feature('sea', culture),
          cells: region,
          center: {row: Math.round(region.reduce((a, c) => a + c.row, 0) / region.length),
                   col: Math.round(region.reduce((a, c) => a + c.col, 0) / region.length)},
          cellCount: region.length
        });
      }
    }
  }

  // Name rivers from FMap.world.rivers
  if (FMap.world.rivers && FMap.world.rivers.length > 0) {
    for (let river of FMap.world.rivers) {
      const culture = fmPick(['fantasy', 'norse', 'celtic']);
      features.rivers.push({
        name: fmNameGen.feature('river', culture),
        cells: river,
        cellCount: river.length
      });
    }
  }

  // Name lakes from FMap.world.lakes
  if (FMap.world.lakes && FMap.world.lakes.length > 0) {
    for (let lake of FMap.world.lakes) {
      const culture = fmPick(['fantasy', 'norse', 'celtic']);
      features.lakes.push({
        name: fmNameGen.feature('lake', culture),
        cells: lake.cells,
        center: lake.center,
        cellCount: lake.cellCount
      });
    }
  }

  // Find deserts
  visited.clear();
  for (let i = 0; i < FMap.grid.cells.length; i++) {
    const cell = FMap.grid.cells[i];
    const key = `${cell.row},${cell.col}`;
    if (cell.biome === 'desert' && !visited.has(key)) {
      const region = floodFill(cell.row, cell.col, c => c.biome === 'desert');
      if (region.length > 50) {
        region.forEach(c => visited.add(`${c.row},${c.col}`));
        const culture = fmPick(['fantasy', 'arabic', 'eastern']);
        features.deserts.push({
          name: fmNameGen.feature('desert', culture),
          cells: region,
          center: {row: Math.round(region.reduce((a, c) => a + c.row, 0) / region.length),
                   col: Math.round(region.reduce((a, c) => a + c.col, 0) / region.length)},
          cellCount: region.length
        });
      }
    }
  }

  // Find swamps
  visited.clear();
  for (let i = 0; i < FMap.grid.cells.length; i++) {
    const cell = FMap.grid.cells[i];
    const key = `${cell.row},${cell.col}`;
    if (cell.biome === 'swamp' && !visited.has(key)) {
      const region = floodFill(cell.row, cell.col, c => c.biome === 'swamp');
      if (region.length > 50) {
        region.forEach(c => visited.add(`${c.row},${c.col}`));
        const culture = fmPick(['fantasy', 'celtic', 'norse']);
        features.swamps.push({
          name: fmNameGen.feature('swamp', culture),
          cells: region,
          center: {row: Math.round(region.reduce((a, c) => a + c.row, 0) / region.length),
                   col: Math.round(region.reduce((a, c) => a + c.col, 0) / region.length)},
          cellCount: region.length
        });
      }
    }
  }

  // Preserve coastlines from terrain generation
  if (FMap.world.features && FMap.world.features.coastlines) {
    features.coastlines = FMap.world.features.coastlines;
  }
  FMap.world.features = features;
  return features;
}

// ============================================================================
// 7. MASTER FUNCTION - BUILD ENTIRE WORLD
// ============================================================================

function fmBuildWorld() {
  console.log('Building political layer...');

  fmGenerateKingdoms();
  console.log(`Generated ${FMap.world.kingdoms.length} kingdoms`);

  fmGenerateSettlements();
  FMap.world.cities = FMap.world.settlements;  // Sync for render/interaction code
  console.log(`Generated ${FMap.world.settlements.length} settlements`);

  fmGenerateRoads();
  console.log(`Generated ${FMap.world.roads.length} roads`);

  fmGeneratePOIs();
  console.log(`Generated ${FMap.world.pois.length} points of interest`);

  fmNameFeatures();
  console.log('Named geographic features');

  console.log('World build complete!');
}

// ============================================================================
// === END PART 2: POLITICAL LAYER ===
// ============================================================================

// === PART 3: RENDERING ENGINE - TOLKIEN-STYLE FANTASY CARTOGRAPHY ===

// Helper: Convert cell coordinates to screen coordinates
function fmCellToScreen(col, row) {
  var b = FMap.mapBounds;
  return {
    x: b.x + (col / FMap.grid.cols) * b.w,
    y: b.y + (row / FMap.grid.rows) * b.h
  };
}

// Helper: Get cell width and height in screen pixels
function fmGetCellSize() {
  var b = FMap.mapBounds;
  return {
    w: b.w / FMap.grid.cols,
    h: b.h / FMap.grid.rows
  };
}


// === 1-10. TERRAIN & FEATURE RENDERING ===
// Fantasy Map Engine - Tolkien-style Cartography Rendering Functions
// Traditional ink on aged parchment aesthetic

// ============================================================================
// 1. PARCHMENT BACKGROUND
// ============================================================================
var fmRenderParchment = function(ctx, w, h, dark) {
  // Warm olive-brown parchment matching C# reference tone
  var baseColor = dark ? '#2a2218' : '#c4a050';

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, w, h);

  // Warm golden gradient — lighter center, darker edges (like old vellum)
  var warmGrad = ctx.createRadialGradient(w * 0.45, h * 0.4, w * 0.08, w * 0.5, h * 0.5, w * 0.75);
  warmGrad.addColorStop(0, dark ? 'rgba(60, 50, 30, 0.15)' : 'rgba(230, 205, 140, 0.35)');
  warmGrad.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
  warmGrad.addColorStop(1, dark ? 'rgba(10, 5, 0, 0.15)' : 'rgba(80, 50, 20, 0.12)');
  ctx.fillStyle = warmGrad;
  ctx.fillRect(0, 0, w, h);

  // Second warm wash — asymmetric for natural unevenness
  var wash2 = ctx.createRadialGradient(w * 0.3, h * 0.6, 0, w * 0.3, h * 0.6, w * 0.5);
  wash2.addColorStop(0, dark ? 'rgba(50, 40, 20, 0.08)' : 'rgba(220, 190, 120, 0.15)');
  wash2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = wash2;
  ctx.fillRect(0, 0, w, h);

  // Paper grain noise — warm tones
  var imageData = ctx.getImageData(0, 0, w, h);
  var data = imageData.data;
  var noiseAmount = dark ? 10 : 16;

  for (var i = 0; i < data.length; i += 4) {
    var noise = (Math.random() - 0.5) * noiseAmount;
    data[i] += noise;             // R
    data[i + 1] += noise * 0.8;   // G
    data[i + 2] += noise * 0.45;  // B (much less — keeps it warm)
  }
  ctx.putImageData(imageData, 0, 0);

  // Large age stains — irregular warm washes like real old maps
  var stainCount = fmRandInt(5, 8);
  for (var s = 0; s < stainCount; s++) {
    var stainX = fmRandInt(w * 0.02, w * 0.98);
    var stainY = fmRandInt(h * 0.02, h * 0.98);
    var stainRadius = fmRandInt(60, 200);
    var stainAlpha = dark ? 0.06 : 0.1;

    var gradient = ctx.createRadialGradient(stainX, stainY, 0, stainX, stainY, stainRadius);
    gradient.addColorStop(0, 'rgba(140, 100, 40, ' + stainAlpha + ')');
    gradient.addColorStop(0.5, 'rgba(120, 85, 35, ' + (stainAlpha * 0.4) + ')');
    gradient.addColorStop(1, 'rgba(100, 70, 30, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(stainX - stainRadius, stainY - stainRadius, stainRadius * 2, stainRadius * 2);
  }

  // Fold creases — subtle dark lines
  ctx.strokeStyle = dark ? 'rgba(0, 0, 0, 0.05)' : 'rgba(100, 70, 30, 0.06)';
  ctx.lineWidth = 1.5;

  var crease1Y = h * 0.33 + fmRandInt(-15, 15);
  var crease2Y = h * 0.66 + fmRandInt(-15, 15);
  ctx.beginPath(); ctx.moveTo(0, crease1Y); ctx.lineTo(w, crease1Y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, crease2Y); ctx.lineTo(w, crease2Y); ctx.stroke();

  var crease1X = w * 0.33 + fmRandInt(-15, 15);
  var crease2X = w * 0.66 + fmRandInt(-15, 15);
  ctx.beginPath(); ctx.moveTo(crease1X, 0); ctx.lineTo(crease1X, h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(crease2X, 0); ctx.lineTo(crease2X, h); ctx.stroke();

  // Heavy edge vignette — dramatically darkened borders like the reference
  var vignetteGradient = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.sqrt(w * w + h * h) / 2);
  vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignetteGradient.addColorStop(0.55, 'rgba(0, 0, 0, 0)');
  vignetteGradient.addColorStop(0.8, 'rgba(40, 25, 5, ' + (dark ? 0.15 : 0.1) + ')');
  vignetteGradient.addColorStop(1, 'rgba(30, 15, 0, ' + (dark ? 0.35 : 0.25) + ')');
  ctx.fillStyle = vignetteGradient;
  ctx.fillRect(0, 0, w, h);
};

// ============================================================================
// 2. ORNATE BORDER
// ============================================================================
var fmRenderBorder = function(ctx, w, h, dark) {
  var inkColor = dark ? '#8a7a5a' : '#1a1005';
  var tickColor = dark ? '#6a5a4a' : '#1a1005';
  var padding = 40;

  ctx.strokeStyle = inkColor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Outer thick border line
  ctx.lineWidth = 3;
  ctx.strokeRect(padding, padding, w - padding * 2, h - padding * 2);

  // Inner thin border line (8px inside outer)
  ctx.lineWidth = 1;
  var innerPadding = padding + 8;
  ctx.strokeRect(innerPadding, innerPadding, w - innerPadding * 2, h - innerPadding * 2);

  // Edge tick marks every 50px between the two lines
  ctx.strokeStyle = tickColor;
  ctx.lineWidth = 1;
  var tickLength = 6;

  // Top and bottom ticks
  for (var x = padding + 50; x < w - padding; x += 50) {
    // Top outer
    ctx.beginPath();
    ctx.moveTo(x, padding - tickLength / 2);
    ctx.lineTo(x, padding + tickLength / 2);
    ctx.stroke();
    // Top inner
    ctx.beginPath();
    ctx.moveTo(x, innerPadding - tickLength / 2);
    ctx.lineTo(x, innerPadding + tickLength / 2);
    ctx.stroke();
    // Bottom outer
    ctx.beginPath();
    ctx.moveTo(x, h - padding - tickLength / 2);
    ctx.lineTo(x, h - padding + tickLength / 2);
    ctx.stroke();
    // Bottom inner
    ctx.beginPath();
    ctx.moveTo(x, h - innerPadding - tickLength / 2);
    ctx.lineTo(x, h - innerPadding + tickLength / 2);
    ctx.stroke();
  }

  // Left and right ticks
  for (var y = padding + 50; y < h - padding; y += 50) {
    // Left outer
    ctx.beginPath();
    ctx.moveTo(padding - tickLength / 2, y);
    ctx.lineTo(padding + tickLength / 2, y);
    ctx.stroke();
    // Left inner
    ctx.beginPath();
    ctx.moveTo(innerPadding - tickLength / 2, y);
    ctx.lineTo(innerPadding + tickLength / 2, y);
    ctx.stroke();
    // Right outer
    ctx.beginPath();
    ctx.moveTo(w - padding - tickLength / 2, y);
    ctx.lineTo(w - padding + tickLength / 2, y);
    ctx.stroke();
    // Right inner
    ctx.beginPath();
    ctx.moveTo(w - innerPadding - tickLength / 2, y);
    ctx.lineTo(w - innerPadding + tickLength / 2, y);
    ctx.stroke();
  }

  // Ornate corner pieces — Tolkien-style vine/leaf flourishes
  var corners = [
    {x: padding, y: padding, sx: 1, sy: 1},
    {x: w - padding, y: padding, sx: -1, sy: 1},
    {x: padding, y: h - padding, sx: 1, sy: -1},
    {x: w - padding, y: h - padding, sx: -1, sy: -1}
  ];

  ctx.strokeStyle = inkColor;
  ctx.fillStyle = inkColor;
  ctx.lineCap = 'round';

  for (var c = 0; c < corners.length; c++) {
    var corner = corners[c];
    var ox = corner.x;
    var oy = corner.y;
    var sx = corner.sx;
    var sy = corner.sy;

    // Main vine curl extending along both edges
    ctx.lineWidth = 2.0;
    ctx.globalAlpha = 0.85;

    // Horizontal vine
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.quadraticCurveTo(ox + 25 * sx, oy + 5 * sy, ox + 50 * sx, oy + 2 * sy);
    ctx.stroke();
    // Vine tendril curl
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(ox + 30 * sx, oy + 4 * sy);
    ctx.quadraticCurveTo(ox + 35 * sx, oy + 12 * sy, ox + 25 * sx, oy + 10 * sy);
    ctx.stroke();

    // Vertical vine
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.quadraticCurveTo(ox + 5 * sx, oy + 25 * sy, ox + 2 * sx, oy + 50 * sy);
    ctx.stroke();
    // Vine tendril curl
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(ox + 4 * sx, oy + 30 * sy);
    ctx.quadraticCurveTo(ox + 12 * sx, oy + 35 * sy, ox + 10 * sx, oy + 25 * sy);
    ctx.stroke();

    // Small leaf at corner junction
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(ox + 3 * sx, oy + 3 * sy);
    ctx.quadraticCurveTo(ox + 10 * sx, oy + 2 * sy, ox + 12 * sx, oy + 12 * sy);
    ctx.quadraticCurveTo(ox + 2 * sx, oy + 10 * sy, ox + 3 * sx, oy + 3 * sy);
    ctx.fill();

    // Center diamond at the corner
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(ox, oy - 4 * sy);
    ctx.lineTo(ox + 4 * sx, oy);
    ctx.lineTo(ox, oy + 4 * sy);
    ctx.lineTo(ox - 4 * sx, oy);
    ctx.closePath();
    ctx.fill();
  }

  ctx.globalAlpha = 1.0;
};

// ============================================================================
// 2.5. ROUND 3 GLOBAL HELPERS: Hand-drawn imperfection utilities
// ============================================================================
// These provide jitter, wobble, and ink-like line quality across all rendering

// Seeded hash for deterministic jitter
var fmJitterHash = function(x, y, seed) {
  var h = ((x * 2654435761 + y * 340573321 + (seed || 0) * 1013904223) >>> 0);
  return (h % 10000) / 10000;
};

// Add wobble to a point - simulates hand tremor
var fmWobble = function(x, y, amount, seed) {
  var h1 = fmJitterHash(x * 100, y * 100, seed || 0);
  var h2 = fmJitterHash(x * 100 + 1, y * 100 + 1, seed || 0);
  return {
    x: x + (h1 - 0.5) * amount * 2,
    y: y + (h2 - 0.5) * amount * 2
  };
};

// Draw a hand-drawn line with wobble segments
var fmHandLine = function(ctx, x1, y1, x2, y2, wobbleAmount, segments) {
  wobbleAmount = wobbleAmount || 1.0;
  segments = segments || 6;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  for (var i = 1; i <= segments; i++) {
    var t = i / segments;
    var mx = x1 + (x2 - x1) * t;
    var my = y1 + (y2 - y1) * t;
    if (i < segments) {
      var w = fmWobble(mx, my, wobbleAmount, i);
      ctx.lineTo(w.x, w.y);
    } else {
      ctx.lineTo(x2, y2);
    }
  }
  ctx.stroke();
};

// Draw hand-drawn curve through points with variable width
var fmHandCurve = function(ctx, points, baseWidth, widthVar) {
  if (points.length < 2) return;
  widthVar = widthVar || 0.3;
  for (var i = 0; i < points.length - 1; i++) {
    var t = i / (points.length - 1);
    // Simulate pressure: heavier in middle, lighter at ends
    var pressure = 1.0 - Math.abs(t - 0.5) * 0.6;
    // Add noise to pressure for ink variation
    var noiseP = fmJitterHash(points[i].x * 10, points[i].y * 10, 42);
    pressure += (noiseP - 0.5) * widthVar;
    ctx.lineWidth = baseWidth * Math.max(0.4, pressure);
    ctx.beginPath();
    ctx.moveTo(points[i].x, points[i].y);
    if (i < points.length - 2) {
      var cpx = (points[i].x + points[i+1].x) / 2;
      var cpy = (points[i].y + points[i+1].y) / 2;
      ctx.quadraticCurveTo(points[i+1].x, points[i+1].y,
        (points[i+1].x + points[Math.min(i+2, points.length-1)].x) / 2,
        (points[i+1].y + points[Math.min(i+2, points.length-1)].y) / 2);
    } else {
      ctx.lineTo(points[i+1].x, points[i+1].y);
    }
    ctx.stroke();
  }
};

// Composition field: creates focal hierarchy (dense vs sparse regions)
var fmCompositionField = function(sx, sy) {
  // Large-scale noise creates "interest zones"
  var n1 = fmValueNoise(sx * 0.003, sy * 0.003);
  var n2 = fmValueNoise(sx * 0.007 + 100, sy * 0.007 + 100) * 0.5;
  var field = (n1 + n2) / 1.5;
  // Remap to create distinct focal areas (some very dense, some sparse)
  // Values > 0.6 = focal area (high detail), < 0.35 = quiet area (low detail)
  return field;
};

// Stipple pattern for ink-like shading
var fmStipple = function(ctx, x, y, radius, density, inkColor, alpha) {
  ctx.fillStyle = inkColor;
  ctx.globalAlpha = alpha || 0.3;
  var count = Math.floor(density * radius * radius * 0.3);
  for (var i = 0; i < count; i++) {
    var h1 = fmJitterHash(x + i, y + i, i * 7);
    var h2 = fmJitterHash(x + i + 1, y + i + 1, i * 13);
    var angle = h1 * Math.PI * 2;
    var dist = h2 * radius;
    var px = x + Math.cos(angle) * dist;
    var py = y + Math.sin(angle) * dist;
    var dotSize = 0.3 + h1 * 0.5;
    ctx.beginPath();
    ctx.arc(px, py, dotSize, 0, Math.PI * 2);
    ctx.fill();
  }
};

// ============================================================================
// 3a. OCEAN RENDERING — waves, stippling, and water texture detail
// ============================================================================
var fmRenderOcean = function(ctx) {
  var cellSize = fmGetCellSize();
  var w = cellSize.w;
  var h = cellSize.h;
  var dark = FMap.dark;
  var cols = FMap.grid.cols;
  var rows = FMap.grid.rows;
  var b = FMap.mapBounds;

  var inkColor = dark ? '#5a4a3a' : '#2a1a08';
  var waveColor = dark ? '#4a3a2a' : '#3a2a15';

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Pass 1: Stipple dots in deep ocean - INCREASED DENSITY
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var cell = FMap.grid.cells[row * cols + col];
      if (!cell || !cell.isWater) continue;

      // Render ~35% of cells (increased from 25%)
      var skipHash = ((col * 2654435761 + row * 340573321) >>> 0) % 100;
      if (skipHash > 35) continue;

      var screenPos = fmCellToScreen(col, row);
      var sx = screenPos.x + w / 2;
      var sy = screenPos.y + h / 2;

      var isDeep = cell.biome === 'deep_ocean';
      var compField = typeof fmCompositionField === 'function' ? fmCompositionField(sx, sy) : 0.5;
      var detailMult = 0.5 + compField * 0.8;

      if (isDeep) {
        ctx.fillStyle = inkColor;
        ctx.globalAlpha = 0.09 * detailMult;  // Increased from 0.06
        var dotCount = Math.floor(3 + detailMult * 4);  // More dots
        for (var di = 0; di < dotCount; di++) {
          var dHash = ((col * 73 + row * 137 + di * 31) >>> 0) % 1000;
          var dx = screenPos.x + (dHash % 100) / 100 * w;
          var dy = screenPos.y + ((dHash * 7) % 100) / 100 * h;
          var dotR = 0.3 + ((dHash * 13) % 100) / 150;  // Slightly larger dots
          ctx.beginPath();
          ctx.arc(dx, dy, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // Pass 2: Wave marks - INCREASED DENSITY AND VISIBILITY
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var cell = FMap.grid.cells[row * cols + col];
      if (!cell || !cell.isWater) continue;

      // ~25% of water cells (increased from 15%)
      var wHash = ((col * 1103515245 + row * 12345) >>> 0) % 100;
      if (wHash > 25) continue;

      var screenPos = fmCellToScreen(col, row);
      var sx = screenPos.x + w / 2;
      var sy = screenPos.y + h / 2;

      var compField = typeof fmCompositionField === 'function' ? fmCompositionField(sx, sy) : 0.5;

      // Determine wave direction by checking nearby land
      var landAngle = 0;
      var foundLand = false;
      for (var dr = -3; dr <= 3 && !foundLand; dr++) {
        for (var dc = -3; dc <= 3 && !foundLand; dc++) {
          if (dr === 0 && dc === 0) continue;
          var nr = row + dr;
          var nc = col + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          var neighbor = FMap.grid.cells[nr * cols + nc];
          if (neighbor && !neighbor.isWater) {
            landAngle = Math.atan2(dr, dc) + Math.PI / 2;
            foundLand = true;
          }
        }
      }
      if (!foundLand) {
        landAngle = ((col * 47 + row * 83) % 628) / 100;
      }

      // Draw 1-3 wave marks (increased)
      var waveCount = 1 + (wHash % 3);
      ctx.strokeStyle = waveColor;
      ctx.globalAlpha = 0.12 + compField * 0.08;  // Increased from 0.08 + 0.06

      for (var wi = 0; wi < waveCount; wi++) {
        var wSeed = col * 73 + row * 137 + wi * 31;
        var wLen = 6 + ((wSeed >>> 0) % 10);  // Longer waves
        var wobbleAmt = ((wSeed * 7) % 100) / 200 - 0.25;

        var wx = sx + ((wSeed * 3 % 100) - 50) / 100 * w * 0.6;
        var wy = sy + ((wSeed * 11 % 100) - 50) / 100 * h * 0.6;

        var angle = landAngle + wobbleAmt;

        var x1 = wx - Math.cos(angle) * wLen / 2;
        var y1 = wy - Math.sin(angle) * wLen / 2;
        var x2 = wx + Math.cos(angle) * wLen / 2;
        var y2 = wy + Math.sin(angle) * wLen / 2;

        var cpDist = wLen * 0.35;
        var cpAngle = angle + Math.PI / 2;
        var cpx = wx + Math.cos(cpAngle) * cpDist;
        var cpy = wy + Math.sin(cpAngle) * cpDist;

        ctx.lineWidth = 0.5 + ((wSeed * 17) % 100) / 200;  // Slightly thicker
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cpx, cpy, x2, y2);
        ctx.stroke();
      }
    }
  }

  // Pass 3: Cross-hatching near coastlines (shallow water) - MORE VISIBLE
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var cell = FMap.grid.cells[row * cols + col];
      if (!cell || !cell.isWater) continue;
      if (cell.biome === 'deep_ocean') continue;

      var nearCoast = false;
      for (var dr = -1; dr <= 1 && !nearCoast; dr++) {
        for (var dc = -1; dc <= 1 && !nearCoast; dc++) {
          if (dr === 0 && dc === 0) continue;
          var nr = row + dr;
          var nc = col + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          var neighbor = FMap.grid.cells[nr * cols + nc];
          if (neighbor && !neighbor.isWater) nearCoast = true;
        }
      }
      if (!nearCoast) continue;

      // ~30% of coastal water cells (increased from 20%)
      var chHash = ((col * 997 + row * 1009) >>> 0) % 100;
      if (chHash > 30) continue;

      var screenPos = fmCellToScreen(col, row);

      ctx.strokeStyle = inkColor;
      ctx.globalAlpha = 0.08;  // Increased from 0.05
      ctx.lineWidth = 0.4;

      var hatchCount = 3 + (chHash % 3);  // More hatches
      for (var hi = 0; hi < hatchCount; hi++) {
        var hSeed = col * 53 + row * 97 + hi * 23;
        var hx = screenPos.x + ((hSeed % 100) / 100) * w;
        var hy = screenPos.y + (((hSeed * 7) % 100) / 100) * h;
        var hAngle = Math.PI / 4 + ((hSeed * 3) % 100) / 300;
        var hLen = 2.5 + ((hSeed * 11) % 100) / 40;  // Longer hatches

        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + Math.cos(hAngle) * hLen, hy + Math.sin(hAngle) * hLen);
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1.0;
};

// ============================================================================
// 3. TERRAIN BASE TINTING — subtle color washes for water/desert/swamp
// ============================================================================
var fmRenderTerrain = function(ctx) {
  var cellSize = fmGetCellSize();
  var w = cellSize.w;
  var h = cellSize.h;
  var dark = FMap.dark;
  var cols = FMap.grid.cols;
  var rows = FMap.grid.rows;

  var waterLight = dark ? '#1a1810' : '#c8a858';
  var waterDark = dark ? '#181510' : '#b09040';
  var desertColor = dark ? '#3a3015' : '#d8c070';
  var swampColor = dark ? '#1a2015' : '#a0a060';
  var forestColor = dark ? '#1a2010' : '#8a9050';

  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var cell = FMap.grid.cells[row * cols + col];
      if (!cell) continue;

      var screenPos = fmCellToScreen(col, row);
      var tintColor = null;
      var alpha = 0;

      if (cell.biome === 'deep_ocean') {
        tintColor = waterDark;
        alpha = 0.2;
      } else if (cell.biome === 'ocean' || cell.isWater) {
        tintColor = waterLight;
        alpha = 0.15;
      } else if (cell.isLake) {
        tintColor = waterLight;
        alpha = 0.18;
      } else if (cell.biome === 'desert') {
        tintColor = desertColor;
        alpha = 0.15;
      } else if (cell.biome === 'swamp') {
        tintColor = swampColor;
        alpha = 0.1;
      } else if (cell.biome === 'forest' || cell.biome === 'dense_forest') {
        tintColor = forestColor;
        alpha = 0.08;
      }

      if (tintColor) {
        ctx.fillStyle = tintColor;
        ctx.globalAlpha = alpha;
        ctx.fillRect(screenPos.x, screenPos.y, w + 0.5, h + 0.5);
      }
    }
  }
  ctx.globalAlpha = 1.0;

  // ROUND 3: Enhanced terrain transitions with multi-cell gradient blending
  // Use a wider transition zone for smoother, more organic biome edges
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var cell = FMap.grid.cells[row * cols + col];
      if (!cell || cell.isWater) continue;

      var screenPos = fmCellToScreen(col, row);

      // Check 2-cell radius for transition effects
      var transColor = null;
      var transAlpha = 0;
      var neighborTypes = {};

      for (var dr = -2; dr <= 2; dr++) {
        for (var dc = -2; dc <= 2; dc++) {
          if (dr === 0 && dc === 0) continue;
          var nr = row + dr;
          var nc = col + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          var neighbor = FMap.grid.cells[nr * cols + nc];
          if (!neighbor) continue;

          var dist = Math.sqrt(dr * dr + dc * dc);
          if (dist > 2.5) continue;

          // Track different neighbor types for blending
          if (neighbor.isWater && !cell.isWater) {
            neighborTypes.water = (neighborTypes.water || 0) + (1 / dist);
          }
          if ((neighbor.biome === 'forest' || neighbor.biome === 'dense_forest') &&
              cell.biome !== 'forest' && cell.biome !== 'dense_forest') {
            neighborTypes.forest = (neighborTypes.forest || 0) + (1 / dist);
          }
          if (neighbor.biome === 'mountain' && cell.biome !== 'mountain') {
            neighborTypes.mountain = (neighborTypes.mountain || 0) + (1 / dist);
          }
          if (neighbor.biome === 'desert' && cell.biome !== 'desert') {
            neighborTypes.desert = (neighborTypes.desert || 0) + (1 / dist);
          }
        }
      }

      // Apply gradual transition tints
      if (neighborTypes.forest && neighborTypes.forest > 0.5) {
        ctx.fillStyle = forestColor;
        ctx.globalAlpha = Math.min(0.06, neighborTypes.forest * 0.015);
        ctx.fillRect(screenPos.x, screenPos.y, w + 0.5, h + 0.5);
      }
      if (neighborTypes.mountain && neighborTypes.mountain > 0.5) {
        ctx.fillStyle = dark ? '#3a3a2a' : '#a8a878';
        ctx.globalAlpha = Math.min(0.05, neighborTypes.mountain * 0.012);
        ctx.fillRect(screenPos.x, screenPos.y, w + 0.5, h + 0.5);
      }
      if (neighborTypes.desert && neighborTypes.desert > 0.5) {
        ctx.fillStyle = desertColor;
        ctx.globalAlpha = Math.min(0.06, neighborTypes.desert * 0.015);
        ctx.fillRect(screenPos.x, screenPos.y, w + 0.5, h + 0.5);
      }
    }
  }
  ctx.globalAlpha = 1.0;
};

// ============================================================================
// 3b. RELIEF SHADING — subtle 3D hillshading effect based on heightmap
// ============================================================================
var fmRenderReliefShading = function(ctx) {
  var cellSize = fmGetCellSize();
  var w = cellSize.w;
  var h = cellSize.h;
  var dark = FMap.dark;
  var cols = FMap.grid.cols;
  var rows = FMap.grid.rows;
  var b = FMap.mapBounds;

  var shadowColor = dark ? '#8a7a6a' : '#1a1005';
  var highlightColor = dark ? '#5a4a3a' : '#e8d8c8';

  // Light source from northwest (upper-left)
  var lightAngle = -Math.PI / 4; // 45 degrees from top-left
  var lightX = Math.cos(lightAngle);
  var lightY = Math.sin(lightAngle);

  ctx.globalAlpha = 1.0;

  for (var row = 0; row < rows - 1; row++) {
    for (var col = 0; col < cols - 1; col++) {
      var cell = FMap.grid.cells[row * cols + col];
      if (!cell || cell.isWater) continue;

      var screenPos = fmCellToScreen(col, row);
      var sx = screenPos.x + w / 2;
      var sy = screenPos.y + h / 2;

      // Sample heightmap values for slope calculation
      var hCenter = FMap.grid.heightmap[row] && FMap.grid.heightmap[row][col] ? FMap.grid.heightmap[row][col] : 0.5;
      var hRight = col + 1 < cols && FMap.grid.heightmap[row] && FMap.grid.heightmap[row][col + 1] ? FMap.grid.heightmap[row][col + 1] : hCenter;
      var hBottom = row + 1 < rows && FMap.grid.heightmap[row + 1] ? FMap.grid.heightmap[row + 1][col] : hCenter;
      var hDiag = row + 1 < rows && col + 1 < cols && FMap.grid.heightmap[row + 1] ? FMap.grid.heightmap[row + 1][col + 1] : hCenter;

      // Calculate surface normal using Sobel operator
      var dx = (hRight - hCenter) + (hDiag - hBottom) * 0.5;
      var dy = (hBottom - hCenter) + (hDiag - hRight) * 0.5;

      // Normal vector (simplified)
      var normLen = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = -dx / normLen;
      var ny = -dy / normLen;
      var nz = 0.8; // Arbitrary vertical component

      // Dot product with light direction (on XY plane, with Z bias)
      var dotProduct = nx * lightX + ny * lightY + nz * 0.3;

      // Apply shading: negative = shadow, positive = highlight
      if (dotProduct < -0.1) {
        // Shadow on southeast-facing slopes
        ctx.fillStyle = shadowColor;
        ctx.globalAlpha = Math.min(0.15, Math.abs(dotProduct) * 0.12);
        ctx.fillRect(screenPos.x, screenPos.y, w + 0.5, h + 0.5);
      } else if (dotProduct > 0.15) {
        // Highlight on northwest-facing slopes
        ctx.fillStyle = highlightColor;
        ctx.globalAlpha = Math.min(0.12, dotProduct * 0.08);
        ctx.fillRect(screenPos.x, screenPos.y, w + 0.5, h + 0.5);
      }
    }
  }

  ctx.globalAlpha = 1.0;
};

// ============================================================================
// 4. COASTLINES — smooth marching-squares contour with Catmull-Rom smoothing
// ============================================================================
var fmRenderCoastlines = function(ctx) {
  var cellSize = fmGetCellSize();
  var w = cellSize.w;
  var h = cellSize.h;
  var dark = FMap.dark;
  var cols = FMap.grid.cols;
  var rows = FMap.grid.rows;
  var b = FMap.mapBounds;

  var inkColor = dark ? '#6a5a4a' : '#1a1005';

  // Marching squares coastline extraction (same as before)
  var allSegments = [];
  for (var row = 0; row < rows - 1; row++) {
    for (var col = 0; col < cols - 1; col++) {
      var c0 = FMap.grid.cells[row * cols + col];
      var c1 = FMap.grid.cells[row * cols + col + 1];
      var c2 = FMap.grid.cells[(row + 1) * cols + col + 1];
      var c3 = FMap.grid.cells[(row + 1) * cols + col];

      var v0 = c0 && !c0.isWater ? 1 : 0;
      var v1 = c1 && !c1.isWater ? 1 : 0;
      var v2 = c2 && !c2.isWater ? 1 : 0;
      var v3 = c3 && !c3.isWater ? 1 : 0;

      var caseIdx = v0 | (v1 << 1) | (v2 << 2) | (v3 << 3);
      if (caseIdx === 0 || caseIdx === 15) continue;

      var ox = b.x + (col / cols) * b.w;
      var oy = b.y + (row / rows) * b.h;
      var cw = b.w / cols;
      var ch = b.h / rows;

      var T = [ox + cw * 0.5, oy];
      var R = [ox + cw, oy + ch * 0.5];
      var B = [ox + cw * 0.5, oy + ch];
      var L = [ox, oy + ch * 0.5];

      var segs;
      switch (caseIdx) {
        case 1: segs = [[L, T]]; break;
        case 2: segs = [[T, R]]; break;
        case 3: segs = [[L, R]]; break;
        case 4: segs = [[R, B]]; break;
        case 5: segs = [[L, T], [R, B]]; break;
        case 6: segs = [[T, B]]; break;
        case 7: segs = [[L, B]]; break;
        case 8: segs = [[B, L]]; break;
        case 9: segs = [[B, T]]; break;
        case 10: segs = [[T, R], [B, L]]; break;
        case 11: segs = [[B, R]]; break;
        case 12: segs = [[R, L]]; break;
        case 13: segs = [[R, T]]; break;
        case 14: segs = [[T, L]]; break;
        default: segs = []; break;
      }

      for (var s = 0; s < segs.length; s++) {
        allSegments.push([segs[s][0][0], segs[s][0][1], segs[s][1][0], segs[s][1][1]]);
      }
    }
  }

  // Chain segments into polylines
  var used = new Array(allSegments.length);
  var chains = [];
  var endpointMap = {};
  var snapKey = function(x, y) { return Math.round(x * 2) + ',' + Math.round(y * 2); };

  for (var i = 0; i < allSegments.length; i++) {
    var seg = allSegments[i];
    var k0 = snapKey(seg[0], seg[1]);
    var k1 = snapKey(seg[2], seg[3]);
    if (!endpointMap[k0]) endpointMap[k0] = [];
    if (!endpointMap[k1]) endpointMap[k1] = [];
    endpointMap[k0].push({idx: i, end: 0});
    endpointMap[k1].push({idx: i, end: 1});
  }

  for (var i = 0; i < allSegments.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    var seg = allSegments[i];
    var chain = [[seg[0], seg[1]], [seg[2], seg[3]]];

    var searching = true;
    while (searching) {
      searching = false;
      var last = chain[chain.length - 1];
      var key = snapKey(last[0], last[1]);
      var candidates = endpointMap[key];
      if (candidates) {
        for (var ci = 0; ci < candidates.length; ci++) {
          var cand = candidates[ci];
          if (used[cand.idx]) continue;
          used[cand.idx] = true;
          var cseg = allSegments[cand.idx];
          if (cand.end === 0) {
            chain.push([cseg[2], cseg[3]]);
          } else {
            chain.push([cseg[0], cseg[1]]);
          }
          searching = true;
          break;
        }
      }
    }
    // Extend backward
    searching = true;
    while (searching) {
      searching = false;
      var first = chain[0];
      var key = snapKey(first[0], first[1]);
      var candidates = endpointMap[key];
      if (candidates) {
        for (var ci = 0; ci < candidates.length; ci++) {
          var cand = candidates[ci];
          if (used[cand.idx]) continue;
          used[cand.idx] = true;
          var cseg = allSegments[cand.idx];
          if (cand.end === 0) {
            chain.unshift([cseg[2], cseg[3]]);
          } else {
            chain.unshift([cseg[0], cseg[1]]);
          }
          searching = true;
          break;
        }
      }
    }

    if (chain.length > 3) {
      chains.push(chain);
    }
  }

  // Catmull-Rom smoothing
  var smoothChain = function(pts, tension) {
    tension = tension || 0.3;
    if (pts.length < 3) return pts;
    var result = [];
    result.push(pts[0]);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[Math.max(0, i - 1)];
      var p1 = pts[i];
      var p2 = pts[Math.min(pts.length - 1, i + 1)];
      var p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (var t = 0.25; t <= 0.75; t += 0.25) {
        var t2 = t * t;
        var t3 = t2 * t;
        var x = 0.5 * ((2 * p1[0]) +
          (-p0[0] + p2[0]) * t +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
        var y = 0.5 * ((2 * p1[1]) +
          (-p0[1] + p2[1]) * t +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
        result.push([x, y]);
      }
    }
    result.push(pts[pts.length - 1]);
    return result;
  };

  // ROUND 3: Draw coastlines with HAND-DRAWN variable width and wobble
  for (var ci = 0; ci < chains.length; ci++) {
    var chain = chains[ci];
    var smooth = smoothChain(chain);
    if (smooth.length < 3) continue;

    // Add wobble to each point
    for (var pi = 0; pi < smooth.length; pi++) {
      if (typeof fmWobble === 'function') {
        var wb = fmWobble(smooth[pi][0], smooth[pi][1], 1.2, ci * 7 + pi);
        smooth[pi] = [wb.x, wb.y];
      }
    }

    // ROUND 3: Main coastline with VARIABLE WIDTH (simulates pen pressure)
    ctx.strokeStyle = inkColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (var pi = 0; pi < smooth.length - 1; pi++) {
      var t = pi / smooth.length;
      // Pressure variation: simulate pen strokes
      var pressureBase = 1.5;
      var pressureNoise = typeof fmJitterHash === 'function' ?
        fmJitterHash(smooth[pi][0], smooth[pi][1], 33) : 0.5;
      var pressure = pressureBase * (0.7 + pressureNoise * 0.6);
      // Add periodic thick/thin alternation like real ink
      pressure *= (0.85 + Math.sin(pi * 0.3) * 0.15);

      ctx.lineWidth = pressure;
      ctx.globalAlpha = 0.85 + pressureNoise * 0.1;

      ctx.beginPath();
      ctx.moveTo(smooth[pi][0], smooth[pi][1]);
      ctx.lineTo(smooth[pi+1][0], smooth[pi+1][1]);
      ctx.stroke();
    }

    // ROUND 3: Hachure marks with variable length and angle (hand-drawn)
    ctx.globalAlpha = 0.3;
    var hachureSpacing = 8;
    for (var pi = 0; pi < smooth.length - 1; pi += hachureSpacing) {
      var pt = smooth[pi];
      var nextPt = smooth[Math.min(pi + 1, smooth.length - 1)];
      var dx = nextPt[0] - pt[0];
      var dy = nextPt[1] - pt[1];
      var len = Math.sqrt(dx * dx + dy * dy);
      if (len < 0.1) continue;
      var nx = -dy / len;
      var ny = dx / len;

      // Variable hachure length
      var hLen = 4 + (typeof fmJitterHash === 'function' ?
        fmJitterHash(pt[0], pt[1], 55) * 4 : 2);

      // Wobble the hachure angle slightly
      var angleWobble = typeof fmJitterHash === 'function' ?
        (fmJitterHash(pt[0], pt[1], 66) - 0.5) * 0.3 : 0;

      var hx = nx * Math.cos(angleWobble) - ny * Math.sin(angleWobble);
      var hy = nx * Math.sin(angleWobble) + ny * Math.cos(angleWobble);

      // Determine water side (draw towards water)
      var testX = pt[0] + hx * 5;
      var testY = pt[1] + hy * 5;
      var testCol = Math.floor((testX - b.x) / b.w * cols);
      var testRow = Math.floor((testY - b.y) / b.h * rows);
      var isWaterSide = true;
      if (testCol >= 0 && testCol < cols && testRow >= 0 && testRow < rows) {
        var testCell = FMap.grid.cells[testRow * cols + testCol];
        if (testCell && !testCell.isWater) isWaterSide = false;
      }
      if (!isWaterSide) { hx = -hx; hy = -hy; }

      // Variable line width for hachure
      ctx.lineWidth = 0.5 + (typeof fmJitterHash === 'function' ?
        fmJitterHash(pt[0] + 1, pt[1], 77) * 0.5 : 0.2);

      ctx.beginPath();
      ctx.moveTo(pt[0], pt[1]);
      ctx.lineTo(pt[0] + hx * hLen, pt[1] + hy * hLen);
      ctx.stroke();
    }

    // ROUND 3: Parallel shore line with more organic offset
    ctx.globalAlpha = 0.12;
    ctx.lineWidth = 0.7;
    for (var pi = 0; pi < smooth.length - 1; pi++) {
      var pt = smooth[pi];
      var nextPt = smooth[Math.min(pi + 1, smooth.length - 1)];
      var dx = nextPt[0] - pt[0];
      var dy = nextPt[1] - pt[1];
      var len = Math.sqrt(dx * dx + dy * dy);
      if (len < 0.1) continue;
      var nx = -dy / len;
      var ny = dx / len;

      // Organic offset varies along coastline
      var offset = 6 + Math.sin(pi * 0.15) * 2;
      if (typeof fmJitterHash === 'function') {
        offset += (fmJitterHash(pt[0], pt[1], 88) - 0.5) * 3;
      }

      var testX = pt[0] + nx * 5;
      var testY = pt[1] + ny * 5;
      var testCol = Math.floor((testX - b.x) / b.w * cols);
      var testRow = Math.floor((testY - b.y) / b.h * rows);
      var isWaterSide = true;
      if (testCol >= 0 && testCol < cols && testRow >= 0 && testRow < rows) {
        var testCell = FMap.grid.cells[testRow * cols + testCol];
        if (testCell && !testCell.isWater) isWaterSide = false;
      }
      var dir = isWaterSide ? 1 : -1;

      ctx.beginPath();
      ctx.moveTo(pt[0] + nx * offset * dir, pt[1] + ny * offset * dir);
      var np = smooth[Math.min(pi + 1, smooth.length - 1)];
      var ndx = smooth[Math.min(pi + 2, smooth.length - 1)][0] - np[0];
      var ndy = smooth[Math.min(pi + 2, smooth.length - 1)][1] - np[1];
      var nlen = Math.sqrt(ndx * ndx + ndy * ndy) || 1;
      ctx.lineTo(np[0] + (-ndy / nlen) * offset * dir, np[1] + (ndx / nlen) * offset * dir);
      ctx.stroke();
    }

    // ROUND 3: Rocky outcrops / small islands near coast
    if (chain.length > 20) {
      var outcrops = Math.min(5, Math.floor(chain.length / 25));
      for (var oi = 0; oi < outcrops; oi++) {
        var oidx = Math.floor((oi + 0.5) * smooth.length / outcrops);
        if (oidx >= smooth.length) continue;
        var opt = smooth[oidx];
        var onPt = smooth[Math.min(oidx + 1, smooth.length - 1)];
        var odx = onPt[0] - opt[0];
        var ody = onPt[1] - opt[1];
        var olen = Math.sqrt(odx * odx + ody * ody) || 1;

        var islandDist = 12 + (typeof fmJitterHash === 'function' ?
          fmJitterHash(opt[0], opt[1], 99) * 10 : 5);
        var ix = opt[0] + (-ody / olen) * islandDist;
        var iy = opt[1] + (odx / olen) * islandDist;

        ctx.globalAlpha = 0.25;
        ctx.lineWidth = 0.8;
        var islandR = 2 + (typeof fmJitterHash === 'function' ?
          fmJitterHash(ix, iy, 101) * 3 : 1);
        ctx.beginPath();
        // Draw irregular island shape
        for (var ia = 0; ia <= 8; ia++) {
          var iAngle = (ia / 8) * Math.PI * 2;
          var iR = islandR * (0.6 + (typeof fmJitterHash === 'function' ?
            fmJitterHash(ix + ia, iy, 102) * 0.8 : 0.4));
          var ipx = ix + Math.cos(iAngle) * iR;
          var ipy = iy + Math.sin(iAngle) * iR;
          if (ia === 0) ctx.moveTo(ipx, ipy);
          else ctx.lineTo(ipx, ipy);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1.0;
};

// ============================================================================
// 5. MOUNTAINS — detailed triangular peaks with shadow hatching and ridge lines
// ============================================================================
var fmRenderMountains = function(ctx) {
  var cellSize = fmGetCellSize();
  var w = cellSize.w;
  var h = cellSize.h;
  var dark = FMap.dark;
  var cols = FMap.grid.cols;
  var rows = FMap.grid.rows;

  var inkColor = dark ? '#8a7a5a' : '#1a1005';
  var shadowFill = dark ? '#4a3a2a' : '#1a1005';

  var getClusteringNoise = function(sx, sy) {
    var n1 = fmValueNoise(sx * 0.008, sy * 0.008);
    var n2 = fmValueNoise(sx * 0.015, sy * 0.015) * 0.6;
    return (n1 + n2) / 1.6;
  };

  var mtBlockW = 45;
  var mtBlockH = 42;
  var hillBlockW = 55;
  var hillBlockH = 50;
  var peakGrid = {};

  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var cell = FMap.grid.cells[row * cols + col];
      if (!cell) continue;
      var isMtn = cell.biome === 'mountain' || cell.biome === 'snow_peak';
      var isHill = cell.biome === 'hills';
      if (!isMtn && !isHill) continue;
      var screenPos = fmCellToScreen(col, row);
      var sx = screenPos.x + w / 2;
      var sy = screenPos.y + h / 2;
      var blockW = isHill ? hillBlockW : mtBlockW;
      var blockH = isHill ? hillBlockH : mtBlockH;
      var bCol = Math.floor(sx / blockW);
      var bRow = Math.floor(sy / blockH);
      var key = bRow + '-' + bCol;
      var priority = isMtn ? 100 + cell.height : cell.height;
      if (!peakGrid[key] || priority > peakGrid[key].priority) {
        peakGrid[key] = { x: sx, y: sy, isMtn: isMtn, isSnow: cell.biome === 'snow_peak',
          isHill: isHill, priority: priority, height: cell.height, row: row, col: col,
          clustering: getClusteringNoise(sx, sy) };
      }
    }
  }

  var peaks = [];
  for (var key in peakGrid) {
    var pk = peakGrid[key];
    var jitterStrength = 0.2 + pk.clustering * 0.4;
    var jHash = ((pk.col * 2654435761 + pk.row * 340573321) >>> 0) % 1000;
    pk.x += (jHash % 100 - 50) / 50 * (pk.isHill ? hillBlockW : mtBlockW) * jitterStrength;
    pk.y += ((jHash * 7 + 13) % 100 - 50) / 50 * (pk.isHill ? hillBlockH : mtBlockH) * jitterStrength;
    peaks.push(pk);
  }
  peaks.sort(function(a, b) { return a.row - b.row; });

  // Ridgelines
  ctx.strokeStyle = inkColor;
  ctx.lineCap = 'round';
  for (var i = 0; i < peaks.length; i++) {
    for (var j = i + 1; j < peaks.length && j < i + 4; j++) {
      var pk1 = peaks[i]; var pk2 = peaks[j];
      var dx = pk2.x - pk1.x; var dy = pk2.y - pk1.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 70 && pk1.isMtn && pk2.isMtn) {
        var ridgePts = [];
        for (var s = 0; s <= 8; s++) {
          var t = s / 8;
          var wb = fmWobble(pk1.x + dx * t, pk1.y + dy * t + 15 - Math.sin(t * Math.PI) * 12, 1.5, i * 7 + j);
          ridgePts.push({x: wb.x, y: wb.y});
        }
        ctx.globalAlpha = 0.18;
        fmHandCurve(ctx, ridgePts, 1.0, 0.5);
      }
    }
  }
  ctx.globalAlpha = 1.0;

  for (var i = 0; i < peaks.length; i++) {
    var pk = peaks[i];
    var cx = pk.x; var cy = pk.y;
    var hash = (cx * 73 + cy * 137 + i * 31) % 1000;
    var rng = function() { hash = (hash * 1103515245 + 12345) & 0x7fffffff; return (hash % 1000) / 1000; };
    var compField = typeof fmCompositionField === 'function' ? fmCompositionField(cx, cy) : 0.5;
    var detailMult = 0.6 + compField * 0.8;

    if (pk.isHill) {
      var hw = 6 + rng() * 5; var hh = 3 + rng() * 3;
      ctx.strokeStyle = inkColor; ctx.globalAlpha = 0.35;
      var hillPts = [];
      for (var hs = 0; hs <= 8; hs++) {
        var ht = hs / 8;
        var wb = fmWobble(cx - hw + ht * hw * 2, cy - hh * Math.sin(ht * Math.PI), 0.7, i * 13 + hs);
        hillPts.push({x: wb.x, y: wb.y});
      }
      fmHandCurve(ctx, hillPts, 0.9, 0.4);
      ctx.globalAlpha = 0.2 * detailMult;
      for (var hhi = 0; hhi < 1 + Math.floor(rng() * 2 * detailMult); hhi++) {
        var hft = 0.15 + (hhi / 2) * 0.5;
        var wb1 = fmWobble(cx - hw * (1 - hft), cy - hh * hft * 0.8, 0.4, i * 7 + hhi);
        var wb2 = fmWobble(cx - hw * (1 - hft) + hh * (0.5 - hft * 0.3) * 0.2, cy - hh * hft * 0.8 + hh * (0.5 - hft * 0.3), 0.4, i * 7 + hhi + 1);
        ctx.lineWidth = 0.4 + rng() * 0.3;
        ctx.beginPath(); ctx.moveTo(wb1.x, wb1.y); ctx.lineTo(wb2.x, wb2.y); ctx.stroke();
      }
      ctx.globalAlpha = 1.0; continue;
    }

    // === R4: 8 DRAMATICALLY VARIED MOUNTAIN SILHOUETTES ===
    var variant = Math.floor(rng() * 8);
    var heightMult = [1.0, 0.7, 1.3, 0.85, 1.15, 1.4, 0.65, 1.1][variant];
    var peakH = (pk.isSnow ? 20 + rng() * 10 : 14 + rng() * 10) * heightMult;
    var baseW = peakH * (0.6 + rng() * 0.25);
    peakH *= (0.85 + detailMult * 0.2);
    var baseY = cy;
    var outlinePts = [];
    var addWPt = function(x, y, amt) {
      var w = fmWobble(x, y, amt || 0.8, i * 3 + outlinePts.length);
      outlinePts.push({x: w.x, y: w.y});
    };
    var shadowPts = [];

    if (variant === 0 || variant === 4) {
      // Classic pointed peak
      var lx = cx - baseW * 0.65; var rx = cx + baseW * 0.55;
      var tx = cx + (rng() - 0.5) * 0.08 * baseW; var ty = cy - peakH;
      var lpx = lx + baseW * 0.35; var lpy = cy - peakH * 0.6;
      var rpx = rx - baseW * 0.3; var rpy = cy - peakH * 0.5;
      addWPt(lx, baseY, 1.0); addWPt(lpx, lpy, 0.6); addWPt(tx, ty, 0.4); addWPt(rpx, rpy, 0.6); addWPt(rx, baseY, 1.0);
      shadowPts = [{x:tx,y:ty},{x:lpx,y:lpy},{x:lx,y:baseY}];
    } else if (variant === 1) {
      // ASYMMETRIC steep-left gradual-right
      var lx = cx - baseW * 0.35; var rx = cx + baseW * 0.85;
      var tx = cx - baseW * 0.1; var ty = cy - peakH;
      addWPt(lx, baseY, 1.0); addWPt(tx, ty, 0.4);
      addWPt(cx + baseW * 0.2, cy - peakH * 0.6, 0.5);
      addWPt(cx + baseW * 0.5, cy - peakH * 0.3, 0.6);
      addWPt(rx, baseY, 1.0);
      shadowPts = [{x:tx,y:ty},{x:lx,y:baseY}];
    } else if (variant === 2) {
      // JAGGED CRAGGY multiple peaks
      var lx = cx - baseW * 0.7; var rx = cx + baseW * 0.6;
      addWPt(lx, baseY, 1.0);
      addWPt(cx - baseW * 0.4, cy - peakH * 0.55, 0.5);
      var jagCount = 3 + Math.floor(rng() * 2);
      for (var jg = 0; jg < jagCount; jg++) {
        var jgT = jg / (jagCount - 1);
        addWPt(cx - baseW * 0.3 + jgT * baseW * 0.5, cy - peakH * (0.85 + rng() * 0.15), 0.3);
        if (jg < jagCount - 1) addWPt(cx - baseW * 0.3 + jgT * baseW * 0.5 + baseW * 0.08, cy - peakH * (0.6 + rng() * 0.15), 0.4);
      }
      addWPt(cx + baseW * 0.35, cy - peakH * 0.5, 0.5);
      addWPt(rx, baseY, 1.0);
      shadowPts = [{x:cx-baseW*0.1,y:cy-peakH*0.9},{x:cx-baseW*0.4,y:cy-peakH*0.55},{x:lx,y:baseY}];
    } else if (variant === 3) {
      // ROUNDED DOME
      var lx = cx - baseW * 0.7; var rx = cx + baseW * 0.65;
      addWPt(lx, baseY, 1.0);
      for (var ds = 0; ds <= 8; ds++) {
        var dt = ds / 8; var dAngle = Math.PI * dt;
        addWPt(cx - baseW * 0.68 * Math.cos(dAngle), cy - peakH * 0.92 * Math.sin(dAngle), 0.5);
      }
      addWPt(rx, baseY, 1.0);
      shadowPts = [{x:cx,y:cy-peakH*0.9},{x:cx-baseW*0.5,y:cy-peakH*0.6},{x:lx,y:baseY}];
    } else if (variant === 5) {
      // ASYMMETRIC gradual-left steep-right
      var lx = cx - baseW * 0.8; var rx = cx + baseW * 0.4;
      var tx = cx + baseW * 0.15; var ty = cy - peakH;
      addWPt(lx, baseY, 1.0);
      addWPt(cx - baseW * 0.4, cy - peakH * 0.3, 0.6);
      addWPt(cx - baseW * 0.15, cy - peakH * 0.65, 0.5);
      addWPt(tx, ty, 0.4); addWPt(rx, baseY, 1.0);
      shadowPts = [{x:tx,y:ty},{x:cx-baseW*0.15,y:cy-peakH*0.65},{x:lx,y:baseY}];
    } else if (variant === 6) {
      // TWIN PEAKS
      var lx = cx - baseW * 0.7; var rx = cx + baseW * 0.7;
      addWPt(lx, baseY, 1.0);
      addWPt(cx - baseW * 0.45, cy - peakH * 0.5, 0.5);
      addWPt(cx - baseW * 0.25, cy - peakH * 0.9, 0.4);
      addWPt(cx, cy - peakH * 0.55, 0.5);
      addWPt(cx + baseW * 0.25, cy - peakH, 0.4);
      addWPt(cx + baseW * 0.45, cy - peakH * 0.45, 0.5);
      addWPt(rx, baseY, 1.0);
      shadowPts = [{x:cx-baseW*0.25,y:cy-peakH*0.9},{x:cx-baseW*0.45,y:cy-peakH*0.5},{x:lx,y:baseY}];
    } else {
      // FLAT-TOP PLATEAU
      var lx = cx - baseW * 0.55; var rx = cx + baseW * 0.5;
      var py = cy - peakH * 0.75;
      addWPt(lx, baseY, 1.0);
      addWPt(cx - baseW * 0.4, py, 0.5);
      addWPt(cx - baseW * 0.2, py - rng() * 2, 0.4);
      addWPt(cx + baseW * 0.15, py - rng() * 2, 0.4);
      addWPt(cx + baseW * 0.35, py, 0.5);
      addWPt(rx, baseY, 1.0);
      shadowPts = [{x:cx-baseW*0.2,y:py},{x:cx-baseW*0.4,y:py},{x:lx,y:baseY}];
    }

    // Shadow fill
    if (shadowPts.length >= 2) {
      ctx.fillStyle = shadowFill; ctx.globalAlpha = 0.25; ctx.beginPath();
      var swb = fmWobble(shadowPts[0].x, shadowPts[0].y, 0.6, i);
      ctx.moveTo(swb.x, swb.y);
      for (var si = 1; si < shadowPts.length; si++) {
        swb = fmWobble(shadowPts[si].x, shadowPts[si].y, 0.6, i + si);
        ctx.lineTo(swb.x, swb.y);
      }
      ctx.lineTo(cx - baseW * 0.05, baseY); ctx.closePath(); ctx.fill();
    }

    // Outline with variable stroke width
    ctx.strokeStyle = inkColor; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha = 0.92;
    for (var pi = 0; pi < outlinePts.length - 1; pi++) {
      var segT = pi / (outlinePts.length - 1);
      var pressure = segT < 0.5 ? 1.8 - segT * 1.2 : 0.8 + (segT - 0.5) * 1.5;
      pressure *= (0.85 + fmJitterHash(outlinePts[pi].x, outlinePts[pi].y, 99) * 0.3);
      ctx.lineWidth = pressure; ctx.beginPath();
      ctx.moveTo(outlinePts[pi].x, outlinePts[pi].y);
      ctx.lineTo(outlinePts[pi+1].x, outlinePts[pi+1].y); ctx.stroke();
    }

    // R4: Stipple OR Hatching shading
    var useStipple = (variant === 2 || variant === 3 || variant === 7);
    var tipPt = outlinePts[Math.floor(outlinePts.length / 2)];
    if (useStipple) {
      ctx.fillStyle = inkColor;
      var stipCount = Math.floor((8 + rng() * 10) * detailMult);
      for (var sti = 0; sti < stipCount; sti++) {
        var stX = cx - baseW * 0.5 + rng() * baseW * 0.6;
        var stY = tipPt.y + rng() * (baseY - tipPt.y) * 0.8;
        if (stX > cx - baseW * 0.05) continue;
        ctx.globalAlpha = (0.25 - rng() * 0.1) * detailMult;
        ctx.beginPath(); ctx.arc(stX, stY, 0.3 + rng() * 0.5, 0, Math.PI * 2); ctx.fill();
      }
    } else {
      ctx.strokeStyle = inkColor;
      var hatchCount = Math.floor((2 + Math.floor(rng() * 3)) * detailMult);
      for (var hi = 0; hi < hatchCount; hi++) {
        var hatchT = 0.15 + (hi / Math.max(1, hatchCount - 1)) * 0.7;
        var hSX = tipPt.x + (outlinePts[0].x - tipPt.x) * hatchT;
        var hSY = tipPt.y + (outlinePts[0].y - tipPt.y) * hatchT;
        var hEX = hSX + baseW * (0.25 + rng() * 0.35);
        var hEY = hSY + baseW * (0.04 + rng() * 0.1);
        ctx.lineWidth = (1.2 - hatchT * 0.5) * (0.7 + rng() * 0.3);
        ctx.globalAlpha = (0.5 - hatchT * 0.2) * detailMult;
        var hw1 = fmWobble(hSX, hSY, 0.5, i * 13 + hi);
        var hw2 = fmWobble(hEX, hEY, 0.8, i * 13 + hi + 1);
        ctx.beginPath(); ctx.moveTo(hw1.x, hw1.y);
        ctx.quadraticCurveTo((hw1.x+hw2.x)/2+(rng()-0.5)*2, (hw1.y+hw2.y)/2+peakH*0.02, hw2.x, hw2.y);
        ctx.stroke();
      }
    }

    // Scree
    if (detailMult > 0.6) {
      ctx.fillStyle = inkColor; ctx.globalAlpha = 0.12;
      for (var sc = 0; sc < Math.floor(4 + rng() * 6 * detailMult); sc++) {
        ctx.beginPath();
        ctx.arc(cx + (rng() - 0.5) * baseW * 1.5, baseY + rng() * 5, 0.3 + rng() * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Right-side hatching
    ctx.strokeStyle = inkColor; ctx.globalAlpha = 0.18;
    var rightPt = outlinePts[outlinePts.length - 2] || outlinePts[outlinePts.length - 1];
    for (var rh = 0; rh < Math.floor((1 + rng() * 2) * detailMult); rh++) {
      var rt = 0.5 + (rh / 3) * 0.4;
      var rsx = tipPt.x + (rightPt.x - tipPt.x) * rt;
      var rsy = tipPt.y + (rightPt.y - tipPt.y) * rt;
      ctx.lineWidth = 0.5 + rng() * 0.3;
      var rw1 = fmWobble(rsx, rsy, 0.3, i * 17 + rh);
      var rw2 = fmWobble(rsx - peakH * 0.02, rsy + peakH * 0.045, 0.3, i * 17 + rh + 1);
      ctx.beginPath(); ctx.moveTo(rw1.x, rw1.y); ctx.lineTo(rw2.x, rw2.y); ctx.stroke();
    }

    // Snow cap
    if (pk.isSnow) {
      var snowH = peakH * 0.32;
      var sL = tipPt.x + (outlinePts[0].x - tipPt.x) * (snowH / peakH);
      var sR = tipPt.x + (outlinePts[outlinePts.length-1].x - tipPt.x) * (snowH / peakH);
      ctx.fillStyle = dark ? '#e8e8f0' : '#faf8f2'; ctx.globalAlpha = 0.92;
      ctx.beginPath(); ctx.moveTo(tipPt.x, tipPt.y);
      for (var jag = 0; jag <= 7; jag++) {
        var jagT = jag / 7;
        var jw = fmWobble(sL + (sR - sL) * jagT, tipPt.y + snowH + (rng() - 0.5) * 4, 1.0, i * 19 + jag);
        ctx.lineTo(jw.x, jw.y);
      }
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = inkColor; ctx.lineWidth = 0.6 + rng() * 0.3; ctx.globalAlpha = 0.3; ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  }
};

// ============================================================================
// 6. FORESTS — Dense clusters of detailed deciduous and conifer trees
// ============================================================================
var fmRenderForests = function(ctx) {
  var dark = FMap.dark;
  var cols = FMap.grid.cols;
  var rows = FMap.grid.rows;
  var cellSize = fmGetCellSize();

  var inkColor = dark ? '#6a5a4a' : '#1a1005';

  // IMPROVEMENT 1: Add clustering noise for natural forest density variation
  var getForestClusteringNoise = function(px, py) {
    // Multi-octave noise creates clustering effect
    var n1 = fmValueNoise(px * 0.005, py * 0.005);
    var n2 = fmValueNoise(px * 0.012, py * 0.012) * 0.5;
    var n3 = fmValueNoise(px * 0.025, py * 0.025) * 0.25;
    return (n1 + n2 + n3) / 1.75;
  };

  // Build cell-based lookup for forest biomes
  var b = FMap.mapBounds;

  // Build a coast-distance map (in cells) using BFS from water cells
  // This lets us make forests denser near coasts (like C# reference)
  var coastDist = new Array(rows * cols);
  for (var ci = 0; ci < coastDist.length; ci++) coastDist[ci] = 9999;
  var queue = [];
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var cell = FMap.grid.cells[row * cols + col];
      if (!cell || cell.isWater) {
        // Check if adjacent to land
        for (var dr = -1; dr <= 1; dr++) {
          for (var dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            var nr = row + dr, nc = col + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              var neighbor = FMap.grid.cells[nr * cols + nc];
              if (neighbor && !neighbor.isWater) {
                if (coastDist[nr * cols + nc] > 0) {
                  coastDist[nr * cols + nc] = 0;
                  queue.push(nr * cols + nc);
                }
              }
            }
          }
        }
      }
    }
  }
  // BFS to propagate distances
  var qi = 0;
  while (qi < queue.length) {
    var idx = queue[qi++];
    var cr = Math.floor(idx / cols);
    var cc = idx % cols;
    var d = coastDist[idx];
    for (var dr = -1; dr <= 1; dr++) {
      for (var dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        var nr = cr + dr, nc = cc + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          var ni = nr * cols + nc;
          var cell2 = FMap.grid.cells[ni];
          if (cell2 && !cell2.isWater && coastDist[ni] > d + 1) {
            coastDist[ni] = d + 1;
            queue.push(ni);
          }
        }
      }
    }
  }

  // Get coast distance for a screen position (in cells)
  var getCoastDist = function(px, py) {
    var col = Math.floor((px - b.x) / b.w * cols);
    var row = Math.floor((py - b.y) / b.h * rows);
    if (col < 0 || col >= cols || row < 0 || row >= rows) return 9999;
    return coastDist[row * cols + col];
  };

  var getForestType = function(px, py) {
    var col = Math.floor((px - b.x) / b.w * cols);
    var row = Math.floor((py - b.y) / b.h * rows);
    if (col < 0 || col >= cols || row < 0 || row >= rows) return 0;
    var cell = FMap.grid.cells[row * cols + col];
    if (!cell) return 0;
    if (cell.isWater || cell.biome === 'snow_peak' ||
        cell.biome === 'desert' || cell.biome === 'deep_ocean' ||
        cell.biome === 'ocean') return 0;
    if (cell.biome === 'dense_forest') return 2;
    if (cell.biome === 'forest') return 1;
    if (cell.biome === 'mountain') return 3;
    return 3; // sparse coverage for all other land
  };

  var samples = [];

  // Three passes: dense(2), normal(1), sparse(3)
  // C# reference pattern: very dense dots near coast, sparse inland
  var passConfig = [
    { targetFt: 2, spacing: 5, skip: 4, clearingThresh: 0.8 },
    { targetFt: 1, spacing: 7, skip: 25, clearingThresh: 0.4 },
    { targetFt: 3, spacing: 10, skip: 45, clearingThresh: 0.3 }
  ];

  for (var pass = 0; pass < passConfig.length; pass++) {
    var cfg = passConfig[pass];
    var spacing = cfg.spacing;
    var targetFt = cfg.targetFt;

    for (var gy = b.y + 4; gy < b.y + b.h - 4; gy += spacing) {
      var rowIdx = Math.floor(gy / spacing);
      var rowHash = ((rowIdx * 2654435761) >>> 0) % 1000;
      var rowOffset = (rowHash / 1000) * spacing;

      for (var gx = b.x + 4 + rowOffset; gx < b.x + b.w - 4; gx += spacing) {
        var ft = getForestType(gx, gy);
        if (ft !== targetFt) continue;

        var hash = (((gx * 2654435761 + gy * 340573321) >>> 0) % 1000);
        var h100 = hash % 100;

        // IMPROVEMENT 1: Use clustering noise to create organic voids and dense patches
        var clusterNoise = getForestClusteringNoise(gx, gy);
        var adjustedSkip = cfg.skip - clusterNoise * 30; // Denser clusters, sparser voids
        if (h100 < adjustedSkip) continue;

        // Coast-distance modulation: C# reference has a narrow dense forest
        // band RIGHT at the coastline, with a dramatically lighter interior
        var cd = getCoastDist(gx, gy);
        if (targetFt === 3) {
          // Sparse type (grassland/hills): only draw near coast
          if (cd > 8) {
            if (h100 < 85) continue; // far inland: almost nothing
          } else if (cd > 4) {
            if (h100 < 65) continue; // mid: sparse
          }
        } else if (targetFt === 1) {
          // Normal forest: thin out significantly inland
          if (cd > 12) {
            if (h100 < 55) continue; // far inland: noticeably sparser
          } else if (cd > 7) {
            if (h100 < 30) continue; // mid: slightly sparser
          }
        } else if (targetFt === 2) {
          // Dense forest: even this thins a bit deep inland
          if (cd > 15) {
            if (h100 < 25) continue;
          }
        }

        // Organic clearings
        var cn1 = Math.sin(gx * 0.015 + gy * 0.01) * Math.cos(gx * 0.009 - gy * 0.013);
        var cn2 = Math.sin(gx * 0.028 - gy * 0.024) * 0.35;
        var cn3 = Math.cos(gx * 0.045 + gy * 0.038) * 0.15;
        var clearingNoise = cn1 + cn2 + cn3;
        if (clearingNoise > cfg.clearingThresh) continue;

        // Strong jitter
        var jScale = spacing * 0.65;
        var jx = gx + ((hash * 13 + 7) % (jScale * 2 | 0)) - jScale;
        var jy = gy + ((hash * 17 + 11) % (jScale * 2 | 0)) - jScale;
        samples.push([jx, jy, ft, h100, cd]);
      }
    }
  }

  // Sort back to front
  samples.sort(function(a, b) { return a[1] - b[1]; });

  // Draw individual trees with leaf-shaped symbols
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (var ti = 0; ti < samples.length; ti++) {
    var tx = samples[ti][0];
    var ty = samples[ti][1];
    var ft = samples[ti][2];
    var hash = samples[ti][3];
    var cd = samples[ti][4];

    // IMPROVEMENT 3: Create 3-5 tree symbol variations per forest type
    var treeVariant = hash % 5;

    // Tree size — slightly larger near coast, variant-specific
    var r;
    var coastBoost = cd < 5 ? 0.3 : cd < 10 ? 0.15 : 0;
    var variantSizeMult = [1.0, 0.85, 1.1, 0.9, 1.05][treeVariant];
    if (ft === 2) {
      r = (1.4 + (hash % 4) * 0.25 + coastBoost) * variantSizeMult;  // dense: 1.4-2.15px
    } else if (ft === 1) {
      r = (1.2 + (hash % 4) * 0.2 + coastBoost) * variantSizeMult;   // normal: 1.2-1.8px
    } else {
      r = (0.9 + (hash % 3) * 0.2 + coastBoost * 0.5) * variantSizeMult;   // sparse: 0.9-1.3px
    }

    // Opacity: higher near coast, fading inland
    var baseAlpha = ft === 2 ? 0.68 : ft === 1 ? 0.52 : 0.38;
    if (cd > 15) baseAlpha *= 0.7;
    else if (cd < 4) baseAlpha = Math.min(baseAlpha + 0.12, 0.78);

    // Determine if this is a large "ancient tree" (sparse in dense forests)
    var isAncient = ft === 2 && (hash % 100) < 8;

    if (isAncient) {
      // Ancient tree: larger, darker, with more detail
      var ar = r * 1.5;
      ctx.fillStyle = inkColor;
      ctx.globalAlpha = baseAlpha + 0.15;

      // Draw a more complex leaf crown
      ctx.beginPath();
      ctx.moveTo(tx, ty - ar);
      // Top-left lobe
      ctx.quadraticCurveTo(tx - ar * 0.6, ty - ar * 0.7, tx - ar * 0.8, ty);
      // Bottom-left lobe
      ctx.quadraticCurveTo(tx - ar * 0.6, ty + ar * 0.5, tx, ty + ar * 0.8);
      // Bottom-right lobe
      ctx.quadraticCurveTo(tx + ar * 0.6, ty + ar * 0.5, tx + ar * 0.8, ty);
      // Top-right lobe
      ctx.quadraticCurveTo(tx + ar * 0.6, ty - ar * 0.7, tx, ty - ar);
      ctx.closePath();
      ctx.fill();

      // Small trunk
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = 0.4;
      ctx.globalAlpha = baseAlpha * 0.6;
      ctx.beginPath();
      ctx.moveTo(tx, ty + ar * 0.8);
      ctx.lineTo(tx, ty + ar * 1.1);
      ctx.stroke();
    } else {
      // IMPROVEMENT 3: Regular tree with 5 visual variants (conifer, deciduous, etc.)
      ctx.fillStyle = inkColor;
      ctx.globalAlpha = baseAlpha;

      if (treeVariant === 0) {
        // Variant 0: Classic leaf-shaped crown
        ctx.beginPath();
        ctx.moveTo(tx, ty - r);
        ctx.quadraticCurveTo(tx - r * 0.65, ty - r * 0.5, tx - r * 0.7, ty + r * 0.3);
        ctx.quadraticCurveTo(tx - r * 0.3, ty + r * 0.5, tx, ty + r * 0.6);
        ctx.quadraticCurveTo(tx + r * 0.3, ty + r * 0.5, tx + r * 0.7, ty + r * 0.3);
        ctx.quadraticCurveTo(tx + r * 0.65, ty - r * 0.5, tx, ty - r);
        ctx.closePath();
        ctx.fill();
      } else if (treeVariant === 1) {
        // Variant 1: Conifer/Pine tree (tight triangular)
        ctx.beginPath();
        ctx.moveTo(tx, ty - r);
        ctx.lineTo(tx - r * 0.5, ty + r * 0.4);
        ctx.lineTo(tx + r * 0.5, ty + r * 0.4);
        ctx.closePath();
        ctx.fill();
      } else if (treeVariant === 2) {
        // Variant 2: Wide deciduous (rounded, bushy)
        ctx.beginPath();
        ctx.arc(tx, ty - r * 0.1, r * 0.8, 0, Math.PI * 2);
        ctx.fill();
      } else if (treeVariant === 3) {
        // Variant 3: Tall columnar (cypress-like)
        ctx.beginPath();
        ctx.moveTo(tx, ty - r);
        ctx.lineTo(tx - r * 0.3, ty + r * 0.5);
        ctx.lineTo(tx + r * 0.3, ty + r * 0.5);
        ctx.closePath();
        ctx.fill();
      } else {
        // Variant 4: Multi-lobed crown (oak-like)
        ctx.beginPath();
        ctx.moveTo(tx - r * 0.4, ty - r * 0.6);
        ctx.quadraticCurveTo(tx - r * 0.7, ty - r * 0.2, tx - r * 0.6, ty + r * 0.3);
        ctx.quadraticCurveTo(tx - r * 0.2, ty + r * 0.5, tx, ty + r * 0.5);
        ctx.quadraticCurveTo(tx + r * 0.2, ty + r * 0.5, tx + r * 0.6, ty + r * 0.3);
        ctx.quadraticCurveTo(tx + r * 0.7, ty - r * 0.2, tx + r * 0.4, ty - r * 0.6);
        ctx.quadraticCurveTo(tx, ty - r, tx - r * 0.4, ty - r * 0.6);
        ctx.closePath();
        ctx.fill();
      }

      // Subtle trunk
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = Math.max(0.3, r * 0.2);
      ctx.globalAlpha = baseAlpha * 0.4;
      ctx.beginPath();
      ctx.moveTo(tx, ty + r * 0.4);
      ctx.lineTo(tx, ty + r * 0.7);
      ctx.stroke();
    }

    // Color variation: slightly darker at forest centers
    if (cd < 6 && (hash % 100) < 15) {
      ctx.fillStyle = inkColor;
      ctx.globalAlpha = baseAlpha * 0.3;
      ctx.beginPath();
      ctx.arc(tx, ty, r * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1.0;
};

// ============================================================================
// 6b. COASTAL GLOW — warm diffuse light around land edges like C# reference
// ============================================================================
var fmRenderCoastalGlow = function(ctx) {
  var cols = FMap.grid.cols;
  var rows = FMap.grid.rows;
  var cellSize = fmGetCellSize();
  var w = cellSize.w;
  var h = cellSize.h;
  var dark = FMap.dark;
  var b = FMap.mapBounds;

  // Build a set of coastal land cells (land cells adjacent to water)
  var coastCells = [];
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var cell = FMap.grid.cells[row * cols + col];
      if (!cell || cell.isWater) continue;

      // Check if adjacent to water
      var adjWater = false;
      for (var dr = -1; dr <= 1 && !adjWater; dr++) {
        for (var dc = -1; dc <= 1 && !adjWater; dc++) {
          if (dr === 0 && dc === 0) continue;
          var nr = row + dr;
          var nc = col + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) { adjWater = true; continue; }
          var neighbor = FMap.grid.cells[nr * cols + nc];
          if (!neighbor || neighbor.isWater) adjWater = true;
        }
      }
      if (adjWater) {
        var screenPos = fmCellToScreen(col, row);
        coastCells.push({ x: screenPos.x + w / 2, y: screenPos.y + h / 2 });
      }
    }
  }

  // Draw soft warm glow circles at each coastal cell with enhanced visibility
  var glowColor1 = dark ? '#3a3a2a' : '#e8d090';
  var glowColor2 = dark ? '#2a2010' : '#d8c080';
  var glowRadius = 45;
  var glowRadius2 = 28;

  ctx.save();
  for (var ci = 0; ci < coastCells.length; ci++) {
    var cc = coastCells[ci];

    // Primary warm glow (larger, more diffuse)
    var grad1 = ctx.createRadialGradient(cc.x, cc.y, 0, cc.x, cc.y, glowRadius);
    grad1.addColorStop(0, glowColor1);
    grad1.addColorStop(0.5, glowColor2);
    grad1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad1;
    ctx.globalAlpha = 0.16;
    ctx.fillRect(cc.x - glowRadius, cc.y - glowRadius, glowRadius * 2, glowRadius * 2);

    // Secondary glow (smaller, warmer)
    var grad2 = ctx.createRadialGradient(cc.x, cc.y, 0, cc.x, cc.y, glowRadius2);
    grad2.addColorStop(0, glowColor2);
    grad2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad2;
    ctx.globalAlpha = 0.14;
    ctx.fillRect(cc.x - glowRadius2, cc.y - glowRadius2, glowRadius2 * 2, glowRadius2 * 2);
  }
  ctx.restore();
  ctx.globalAlpha = 1.0;
};

// ============================================================================
// 7. WATER — systematic wave rows in deep ocean, stippling in shallow water
// ============================================================================
var fmRenderWater = function(ctx) {
  var cellSize = fmGetCellSize();
  var w = cellSize.w;
  var h = cellSize.h;
  var dark = FMap.dark;
  var cols = FMap.grid.cols;
  var rows = FMap.grid.rows;
  var b = FMap.mapBounds;

  // Ink color for drawing (keep warm parchment tones, no blue)
  var inkColor = dark ? '#8a7a5a' : '#1a1005';

  // Build distance-from-land grid
  var distFromLand = new Array(rows * cols);
  for (var i = 0; i < distFromLand.length; i++) distFromLand[i] = 999;

  // Horizontal scan
  for (var row = 0; row < rows; row++) {
    var dist = 999;
    for (var col = 0; col < cols; col++) {
      var idx = row * cols + col;
      var cell = FMap.grid.cells[idx];
      if (!cell || !cell.isWater) { dist = 0; continue; }
      dist++;
      if (dist < distFromLand[idx]) distFromLand[idx] = dist;
    }
    dist = 999;
    for (var col = cols - 1; col >= 0; col--) {
      var idx = row * cols + col;
      var cell = FMap.grid.cells[idx];
      if (!cell || !cell.isWater) { dist = 0; continue; }
      dist++;
      if (dist < distFromLand[idx]) distFromLand[idx] = dist;
    }
  }
  // Vertical scan
  for (var col = 0; col < cols; col++) {
    var dist = 999;
    for (var row = 0; row < rows; row++) {
      var idx = row * cols + col;
      var cell = FMap.grid.cells[idx];
      if (!cell || !cell.isWater) { dist = 0; continue; }
      dist++;
      if (dist < distFromLand[idx]) distFromLand[idx] = dist;
    }
    dist = 999;
    for (var row = rows - 1; row >= 0; row--) {
      var idx = row * cols + col;
      var cell = FMap.grid.cells[idx];
      if (!cell || !cell.isWater) { dist = 0; continue; }
      dist++;
      if (dist < distFromLand[idx]) distFromLand[idx] = dist;
    }
  }

  // PART 1: Deep ocean — systematic wave rows with sine curves
  ctx.strokeStyle = inkColor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (var row = 0; row < rows; row++) {
    var inWater = false;
    var startCol = 0;
    var minDist = 999;

    for (var col = 0; col <= cols; col++) {
      var cell = col < cols ? FMap.grid.cells[row * cols + col] : null;
      var isWater = cell && cell.isWater;

      if (isWater && !inWater) {
        startCol = col;
        minDist = distFromLand[row * cols + col];
        inWater = true;
      } else if (isWater && inWater) {
        var d = distFromLand[row * cols + col];
        if (d < minDist) minDist = d;
      } else if (!isWater && inWater) {
        var spanLen = col - startCol;
        if (spanLen > 2) {
          // Only draw in deep water (far from coast)
          var isDeepWater = minDist > 8;
          if (isDeepWater) {
            var sp1 = fmCellToScreen(startCol, row);
            var sp2 = fmCellToScreen(col, row);
            var midY = sp1.y + h / 2;
            var firstX = sp1.x + w * 0.5;
            var lastX = sp2.x;

            // Systematic wave rows at regular intervals (every 5 rows in deep water)
            if (row % 5 === 0) {
              // Draw 3 parallel wavy lines per wave group, spaced 3px apart
              for (var lineOffset = 0; lineOffset < 3; lineOffset++) {
                var lineY = midY + (lineOffset - 1) * 3;
                var waveAlpha = 0.25 - lineOffset * 0.05; // Fainter for each successive line
                ctx.globalAlpha = Math.max(0.1, waveAlpha);
                ctx.lineWidth = 0.6;

                ctx.beginPath();
                ctx.moveTo(firstX, lineY);

                // Gentle sine-wave dashes
                var dashLength = 8;
                var dashGap = 4;
                var isDrawing = true;
                var linePos = 0;

                for (var px = firstX; px <= lastX; px += 1) {
                  var waveY = lineY + Math.sin(px * 0.04 + row * 0.15) * 1.5;

                  if (isDrawing) {
                    if (linePos === 0) ctx.moveTo(px, waveY);
                    else ctx.lineTo(px, waveY);
                    linePos++;
                    if (linePos >= dashLength) {
                      ctx.stroke();
                      isDrawing = false;
                      linePos = 0;
                    }
                  } else {
                    linePos++;
                    if (linePos >= dashGap) {
                      ctx.beginPath();
                      ctx.moveTo(px, waveY);
                      isDrawing = true;
                      linePos = 0;
                    }
                  }
                }
                if (isDrawing && linePos > 0) ctx.stroke();
              }
            }
          }
        }
        inWater = false;
        minDist = 999;
      }
    }
  }

  // PART 2: Shallow coastal water — enhanced stippling with wave patterns
  ctx.fillStyle = inkColor;
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var idx = row * cols + col;
      var cell = FMap.grid.cells[idx];
      if (!cell || !cell.isWater) continue;

      var dist = distFromLand[idx];

      var sp = fmCellToScreen(col, row);
      var cx = sp.x + w / 2;
      var cy = sp.y + h / 2;

      // Dense stippling very near coast (distance 1-3)
      if (dist >= 1 && dist <= 3) {
        ctx.globalAlpha = 0.25 + (3 - dist) * 0.1;
        var stippleCount = 6 + fmRand(row, col, 'stipple') * 5;
        for (var s = 0; s < stippleCount; s++) {
          var dotX = cx + (fmRand(row, col, 'stipX' + s) - 0.5) * w;
          var dotY = cy + (fmRand(row, col, 'stipY' + s) - 0.5) * h;
          var dotR = 0.25 + fmRand(row, col, 'stipR' + s) * 0.4;
          ctx.beginPath();
          ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // Moderate stippling further out (distance 4-8)
      else if (dist > 3 && dist <= 8) {
        ctx.globalAlpha = 0.12 + (8 - dist) * 0.018;
        var stippleCount = 3 + fmRand(row, col, 'stipple') * 2;
        for (var s = 0; s < stippleCount; s++) {
          var dotX = cx + (fmRand(row, col, 'stipX' + s) - 0.5) * w;
          var dotY = cy + (fmRand(row, col, 'stipY' + s) - 0.5) * h;
          var dotR = 0.3 + fmRand(row, col, 'stipR' + s) * 0.3;
          ctx.beginPath();
          ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  // PART 3: Subtle wave line patterns in open ocean
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.08;
  for (var row = 1; row < rows - 1; row += 8) {
    for (var col = 1; col < cols - 1; col++) {
      var cell = FMap.grid.cells[row * cols + col];
      if (!cell || !cell.isWater) continue;
      var dist = distFromLand[row * cols + col];
      if (dist <= 8) continue; // Skip shallow water, only deep ocean

      var sp1 = fmCellToScreen(col - 1, row);
      var sp2 = fmCellToScreen(col + 1, row);
      var startX = sp1.x + w / 2;
      var startY = sp1.y + h / 2;
      var endX = sp2.x + w / 2;
      var endY = sp2.y + h / 2;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      for (var px = startX; px <= endX; px += 2) {
        var t = (px - startX) / (endX - startX);
        var waveY = startY + Math.sin(px * 0.03 + row * 0.08) * 0.8;
        ctx.lineTo(px, waveY);
      }
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1.0;
};

// ============================================================================
// 8. RIVERS — smooth flowing lines, widening toward mouth
// ============================================================================
var fmRenderRivers = function(ctx) {
  if (!FMap.world || !FMap.world.rivers) return;

  var dark = FMap.dark;
  var riverColor = dark ? '#5a4a3a' : '#1a1005';
  var labelColor = dark ? '#6a5a4a' : '#1a1005';

  for (var r = 0; r < FMap.world.rivers.length; r++) {
    var river = FMap.world.rivers[r];
    if (!river.path || river.path.length < 2) continue;

    var cs = fmGetCellSize();
    var screenPath = [];
    for (var p = 0; p < river.path.length; p++) {
      var pathPoint = river.path[p];
      var col = pathPoint[1];
      var row = pathPoint[0];
      var sp = fmCellToScreen(col, row);
      screenPath.push({x: sp.x + cs.w / 2, y: sp.y + cs.h / 2});
    }

    if (screenPath.length < 2) continue;

    // ROUND 3: Add wobble to river points for hand-drawn meander
    for (var wi = 1; wi < screenPath.length - 1; wi++) {
      if (typeof fmWobble === 'function') {
        var wb = fmWobble(screenPath[wi].x, screenPath[wi].y, 2.0, r * 7 + wi);
        screenPath[wi].x = wb.x;
        screenPath[wi].y = wb.y;
      }
    }

    // ROUND 3: Draw with VARIABLE WIDTH (thin at source, thick at mouth)
    // Multiple passes for depth
    var passes = [
      { widthStart: 0.3, widthEnd: 2.2, alpha: 0.55 },
      { widthStart: 0.15, widthEnd: 1.2, alpha: 0.12 }
    ];

    for (var pass = 0; pass < passes.length; pass++) {
      var p_cfg = passes[pass];
      ctx.strokeStyle = riverColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (var sp_idx = 0; sp_idx < screenPath.length - 1; sp_idx++) {
        var t = screenPath.length > 1 ? sp_idx / (screenPath.length - 1) : 0;
        // ROUND 3: Variable width with ink-like pressure variation
        var baseWidth = p_cfg.widthStart + (p_cfg.widthEnd - p_cfg.widthStart) * t;
        var pressureNoise = typeof fmJitterHash === 'function' ?
          fmJitterHash(screenPath[sp_idx].x, screenPath[sp_idx].y, 44) : 0.5;
        ctx.lineWidth = baseWidth * (0.8 + pressureNoise * 0.4);

        ctx.globalAlpha = p_cfg.alpha;

        var p1 = screenPath[sp_idx];
        var p2 = screenPath[sp_idx + 1];

        // Catmull-Rom smoothing with enhanced meander
        var meaderHash = ((r * 73 + sp_idx * 137) >>> 0) % 1000;
        var meander = Math.sin(meaderHash / 1000 * Math.PI * 6) * 2.0;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);

        if (sp_idx < screenPath.length - 2) {
          var p3 = screenPath[sp_idx + 2];
          var mx = (p2.x + p3.x) / 2 + meander;
          var my = (p2.y + p3.y) / 2;
          ctx.quadraticCurveTo(p2.x + meander * 0.5, p2.y, mx, my);
        } else {
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.stroke();
      }

      // ROUND 3: Tributaries with more natural branching
      if (pass === 1 && screenPath.length > 5) {
        var tributaryCount = Math.min(4, Math.floor(screenPath.length / 6));
        for (var t_idx = 0; t_idx < tributaryCount; t_idx++) {
          var riverIdx = Math.floor((t_idx + 0.5) * screenPath.length / (tributaryCount + 1));
          if (riverIdx >= screenPath.length) continue;

          var riverPt = screenPath[riverIdx];
          var angle = (t_idx % 2 === 0 ? 1 : -1) * (Math.PI / 5 + (typeof fmJitterHash === 'function' ?
            fmJitterHash(riverPt.x, riverPt.y, t_idx) * 0.4 : 0.2));
          var prevPt = screenPath[Math.max(0, riverIdx - 1)];
          var dir = Math.atan2(riverPt.y - prevPt.y, riverPt.x - prevPt.x);

          var tributaryLen = 20 + (typeof fmJitterHash === 'function' ?
            fmJitterHash(riverPt.x + 1, riverPt.y, t_idx) * 20 : 10);
          var endX = riverPt.x + Math.cos(dir + angle) * tributaryLen;
          var endY = riverPt.y + Math.sin(dir + angle) * tributaryLen;

          // Variable width tributary (thin at end)
          ctx.globalAlpha = p_cfg.alpha * 0.35;

          // Draw with 3 segments for tapering
          for (var ts = 0; ts < 3; ts++) {
            var tt = ts / 3;
            var t1x = riverPt.x + (endX - riverPt.x) * tt;
            var t1y = riverPt.y + (endY - riverPt.y) * tt;
            var t2x = riverPt.x + (endX - riverPt.x) * (tt + 1/3);
            var t2y = riverPt.y + (endY - riverPt.y) * (tt + 1/3);
            ctx.lineWidth = 0.5 * (1 - tt * 0.7);
            ctx.beginPath();
            ctx.moveTo(t1x, t1y);
            ctx.lineTo(t2x, t2y);
            ctx.stroke();
          }
        }
      }
    }

    // River name label
    if (river.name && screenPath.length > 4) {
      var midIdx = Math.floor(screenPath.length / 2);
      var midPt = screenPath[midIdx];
      var nxtPt = screenPath[Math.min(midIdx + 1, screenPath.length - 1)];

      var angle = Math.atan2(nxtPt.y - midPt.y, nxtPt.x - midPt.x);
      if (angle > Math.PI / 2 || angle < -Math.PI / 2) angle += Math.PI;

      ctx.save();
      ctx.translate(midPt.x, midPt.y);
      ctx.rotate(angle);

      ctx.font = 'italic 9px serif';
      ctx.fillStyle = labelColor;
      ctx.globalAlpha = 0.55;
      ctx.textAlign = 'center';
      ctx.fillText(river.name, 0, -4);

      ctx.restore();
    }
  }
  ctx.globalAlpha = 1.0;
};

// ============================================================================
// 9. KINGDOM BORDERS WITH DASHED LINES
// ============================================================================
// ============================================================================
// 8b. TERRAIN FEATURES — desert stipple clusters, swamp reed tufts with hand-drawn feel
// ============================================================================
var fmRenderTerrainFeatures = function(ctx) {
  var cellSize = fmGetCellSize();
  var w = cellSize.w;
  var h = cellSize.h;
  var dark = FMap.dark;
  var cols = FMap.grid.cols;
  var rows = FMap.grid.rows;

  var inkColor = dark ? '#8a7a5a' : '#1a1005';

  // PART 1: Desert — small dot stippling in sparse clusters
  ctx.fillStyle = inkColor;
  for (var row = 0; row < rows; row += 2) {
    for (var col = 0; col < cols; col += 2) {
      var cell = FMap.grid.cells[row * cols + col];
      if (!cell || cell.biome !== 'desert') continue;

      var sp = fmCellToScreen(col, row);
      var cx = sp.x + w / 2;
      var cy = sp.y + h / 2;

      // Sparse clusters of 5-8 dots with slight irregularity
      ctx.globalAlpha = 0.2;
      var clusterSize = 5 + Math.floor(fmRand(row, col, 'dCluster') * 4); // 5-8 dots per cluster
      for (var d = 0; d < clusterSize; d++) {
        // Hand-drawn irregularity: vary positions slightly
        var angle = fmRand(row, col, 'dAngle' + d) * Math.PI * 2;
        var dist = fmRand(row, col, 'dDist' + d) * w * 0.8;
        var dotX = cx + Math.cos(angle) * dist;
        var dotY = cy + Math.sin(angle) * dist;
        var dotR = 0.4 + fmRand(row, col, 'dRad' + d) * 0.5;
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // PART 2: Swamp — tufts of grass/reeds with hand-drawn variation
  ctx.strokeStyle = inkColor;
  ctx.lineCap = 'round';
  for (var row = 0; row < rows; row += 3) {
    for (var col = 0; col < cols; col += 3) {
      var cell = FMap.grid.cells[row * cols + col];
      if (!cell || cell.biome !== 'swamp') continue;

      var sp = fmCellToScreen(col, row);
      var cx = sp.x + w / 2;
      var cy = sp.y + h / 2;

      // Horizontal water line (base)
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy);
      ctx.lineTo(cx + 5, cy);
      ctx.stroke();

      // 3 vertical strokes fanning outward (grass/reed tufts)
      ctx.lineWidth = 0.7;
      ctx.globalAlpha = 0.25;
      var tufts = 3;
      for (var t = 0; t < tufts; t++) {
        // Slight variation in angle for each tuft (hand-drawn feel)
        var angleVar = fmRand(row, col, 'tAngle' + t) * 0.3 - 0.15;
        var baseAngle = -Math.PI / 2 + (t - 1) * (Math.PI / 4) + angleVar;

        // Length varies slightly per tuft
        var tuftLen = 4 + fmRand(row, col, 'tLen' + t) * 2;

        var startX = cx + Math.cos(baseAngle - Math.PI / 2) * 2;
        var startY = cy;
        var endX = startX + Math.cos(baseAngle) * tuftLen;
        var endY = startY + Math.sin(baseAngle) * tuftLen;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1.0;
};

var fmRenderKingdomBorders = function(ctx) {
  if (!FMap.world || !FMap.world.kingdoms) return;

  var cellSize = fmGetCellSize();
  var w = cellSize.w;
  var h = cellSize.h;
  var bounds = FMap.mapBounds;
  var drawnBorders = {};

  ctx.lineWidth = 0.4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = 0.2;
  ctx.setLineDash([3, 8]);

  for (var row = 0; row < FMap.grid.rows; row++) {
    for (var col = 0; col < FMap.grid.cols; col++) {
      var cell = FMap.grid.cells[row * FMap.grid.cols + col];
      if (!cell || !cell.kingdomId) continue;

      var currentKingdom = cell.kingdomId;
      var screenPos = fmCellToScreen(col, row);
      var x = screenPos.x;
      var y = screenPos.y;

      // Check right neighbor
      var rightCell = (col + 1 < FMap.grid.cols) ? FMap.grid.cells[row * FMap.grid.cols + col + 1] : null;
      if (rightCell && rightCell.kingdomId && rightCell.kingdomId !== currentKingdom) {
        var borderKey = Math.min(currentKingdom, rightCell.kingdomId) + '-' + Math.max(currentKingdom, rightCell.kingdomId) + '-right-' + row + '-' + col;
        if (!drawnBorders[borderKey]) {
          var kingdom = FMap.world.kingdoms.find(function(k) { return k.id === currentKingdom; });
          var borderColor = kingdom && kingdom.color && kingdom.color.border ? kingdom.color.border : '#8a7a6a';
          ctx.strokeStyle = borderColor;
          ctx.beginPath();
          ctx.moveTo(x + w, y);
          ctx.lineTo(x + w, y + h);
          ctx.stroke();
          drawnBorders[borderKey] = true;
        }
      }

      // Check bottom neighbor
      var bottomCell = (row + 1 < FMap.grid.rows) ? FMap.grid.cells[(row + 1) * FMap.grid.cols + col] : null;
      if (bottomCell && bottomCell.kingdomId && bottomCell.kingdomId !== currentKingdom) {
        var borderKey = Math.min(currentKingdom, bottomCell.kingdomId) + '-' + Math.max(currentKingdom, bottomCell.kingdomId) + '-bottom-' + row + '-' + col;
        if (!drawnBorders[borderKey]) {
          var kingdom = FMap.world.kingdoms.find(function(k) { return k.id === currentKingdom; });
          var borderColor = kingdom && kingdom.color && kingdom.color.border ? kingdom.color.border : '#8a7a6a';
          ctx.strokeStyle = borderColor;
          ctx.beginPath();
          ctx.moveTo(x, y + h);
          ctx.lineTo(x + w, y + h);
          ctx.stroke();
          drawnBorders[borderKey] = true;
        }
      }
    }
  }

  ctx.setLineDash([]);
  ctx.globalAlpha = 1.0;
};

// ============================================================================
// 10. ROADS WITH DOTTED/DASHED PATTERNS
// ============================================================================
var fmRenderRoads = function(ctx) {
  if (!FMap.world || !FMap.world.roads) return;

  var dark = FMap.dark;
  var majorRoadColor = dark ? '#5a4a3a' : '#4a3015';
  var minorRoadColor = dark ? '#4a3a2a' : '#5a4020';
  var trailColor = dark ? '#3a2a1a' : '#6a5030';

  for (var road_idx = 0; road_idx < FMap.world.roads.length; road_idx++) {
    var road = FMap.world.roads[road_idx];
    if (!road.path || road.path.length < 2) continue;

    var screenPath = [];
    for (var p = 0; p < road.path.length; p++) {
      var pathPoint = road.path[p];
      var col = pathPoint.col;
      var row = pathPoint.row;
      var screenPos = fmCellToScreen(col, row);
      screenPath.push({x: screenPos.x + fmGetCellSize().w / 2, y: screenPos.y + fmGetCellSize().h / 2});
    }

    if (screenPath.length < 2) continue;

    // ROUND 3: Add wobble to road points for hand-drawn feel
    for (var wi = 1; wi < screenPath.length - 1; wi++) {
      if (typeof fmWobble === 'function') {
        var wb = fmWobble(screenPath[wi].x, screenPath[wi].y, 1.5, road_idx * 11 + wi);
        screenPath[wi].x = wb.x;
        screenPath[wi].y = wb.y;
      }
    }

    var roadColor = majorRoadColor;
    var roadWidth = 0.6;
    var dashPattern = [2, 5];

    if (road.type === 'major') {
      roadColor = majorRoadColor;
      roadWidth = 0.7;
      dashPattern = [3, 4];
    } else if (road.type === 'minor') {
      roadColor = minorRoadColor;
      roadWidth = 0.5;
      dashPattern = [2, 5];
    } else if (road.type === 'trail') {
      roadColor = trailColor;
      roadWidth = 0.4;
      dashPattern = [1.5, 6];
    }

    ctx.strokeStyle = roadColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash(dashPattern);
    ctx.globalAlpha = 0.3;

    // ROUND 3: Draw with variable width segments
    if (screenPath.length === 2) {
      var dx = screenPath[1].x - screenPath[0].x;
      var dy = screenPath[1].y - screenPath[0].y;
      var len = Math.sqrt(dx * dx + dy * dy);
      var perpX = -dy / len;
      var perpY = dx / len;

      var curveAmount = len * 0.1 * (0.5 + fmRand() * 0.5);
      var midX = screenPath[0].x + dx / 2 + perpX * curveAmount;
      var midY = screenPath[0].y + dy / 2 + perpY * curveAmount;

      ctx.lineWidth = roadWidth;
      ctx.beginPath();
      ctx.moveTo(screenPath[0].x, screenPath[0].y);
      ctx.quadraticCurveTo(midX, midY, screenPath[1].x, screenPath[1].y);
      ctx.stroke();
    } else {
      // Variable width along the road
      for (var sp = 0; sp < screenPath.length - 1; sp++) {
        var t = sp / (screenPath.length - 1);
        // Slight width variation
        var widthNoise = typeof fmJitterHash === 'function' ?
          fmJitterHash(screenPath[sp].x, screenPath[sp].y, road_idx) : 0.5;
        ctx.lineWidth = roadWidth * (0.8 + widthNoise * 0.4);

        var currPt = screenPath[sp];
        var nextPt = screenPath[Math.min(sp + 1, screenPath.length - 1)];

        var meaderHash = ((road_idx * 73 + sp * 137) >>> 0) % 1000;
        var meander = Math.sin(meaderHash / 1000 * Math.PI * 4) * 2;

        if (sp < screenPath.length - 2) {
          var endX = (currPt.x + nextPt.x) / 2 + meander;
          var endY = (currPt.y + nextPt.y) / 2 + meander * 0.5;
          ctx.beginPath();
          ctx.moveTo(currPt.x, currPt.y);
          ctx.quadraticCurveTo(nextPt.x, nextPt.y, endX, endY);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(currPt.x, currPt.y);
          ctx.lineTo(nextPt.x, nextPt.y);
          ctx.stroke();
        }
      }
    }
  }

  ctx.setLineDash([]);
  ctx.globalAlpha = 1.0;
};


// === 11-17. SETTLEMENTS, POIS, LABELS & UI ===
// ============================================================================
// FANTASY MAP ENGINE - UI/DECORATION RENDERING LAYER
// Tolkien-style cartography with warm sepia, hand-drawn parchment aesthetic
// ============================================================================

var fmRenderSettlements = function(ctx) {
  var settlements = FMap.world.cities || [];
  var isLight = !FMap.dark;
  var inkColor = isLight ? '#1a1005' : '#a89070';
  var parchmentHalo = isLight ? '#c4a050' : '#3a2a1a';
  var lightInk = isLight ? '#4a3a2a' : '#b8a890';

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // === ROUND 5: LABEL COLLISION DETECTION ===
  // Pre-compute label bounding boxes and resolve collisions
  var labelBoxes = [];
  var LABEL_PAD = 3;

  // Helper to measure text width
  var measureLabel = function(name, font) {
    ctx.font = font;
    var metrics = ctx.measureText(name);
    return metrics.width;
  };

  // Pre-compute all label positions and sizes
  var labelData = [];
  for (var i = 0; i < settlements.length; i++) {
    var city = settlements[i];
    var screen = fmCellToScreen(city.col, city.row);
    var x = screen.x;
    var y = screen.y;

    var font, yOffset, labelWidth;
    if (city.type === 'capital') {
      font = 'bold small-caps 11px Palatino, Georgia, serif';
      yOffset = 22;
    } else if (city.type === 'city') {
      font = 'small-caps 10px Palatino, Georgia, serif';
      yOffset = 16;
    } else if (city.type === 'town') {
      font = '9px Palatino, Georgia, serif';
      yOffset = 12;
    } else {
      font = 'italic 8px Palatino, Georgia, serif';
      yOffset = 10;
    }

    labelWidth = measureLabel(city.name, font);
    var fontSize = parseInt(font) || 9;

    labelData.push({
      idx: i,
      city: city,
      x: x,
      y: y,
      labelX: x - labelWidth / 2,
      labelY: y + yOffset - fontSize,
      labelW: labelWidth,
      labelH: fontSize + 4,
      font: font,
      yOffset: yOffset,
      placed: false,
      priority: city.type === 'capital' ? 4 : city.type === 'city' ? 3 : city.type === 'town' ? 2 : 1
    });
  }

  // Sort by priority (capitals first)
  labelData.sort(function(a, b) { return b.priority - a.priority; });

  // Try to place labels with collision avoidance
  var placedBoxes = [];

  var boxOverlaps = function(box) {
    for (var j = 0; j < placedBoxes.length; j++) {
      var pb = placedBoxes[j];
      if (box.x < pb.x + pb.w + LABEL_PAD &&
          box.x + box.w + LABEL_PAD > pb.x &&
          box.y < pb.y + pb.h + LABEL_PAD &&
          box.y + box.h + LABEL_PAD > pb.y) {
        return true;
      }
    }
    return false;
  };

  // Placement positions to try: below, above, right, left, below-right, above-right
  var offsets = [
    function(d) { return { dx: -d.labelW / 2, dy: d.yOffset }; },           // below center
    function(d) { return { dx: -d.labelW / 2, dy: -d.yOffset - 4 }; },      // above center
    function(d) { return { dx: d.labelW * 0.1 + 8, dy: 4 }; },              // right
    function(d) { return { dx: -d.labelW - 8, dy: 4 }; },                    // left
    function(d) { return { dx: 6, dy: d.yOffset + 4 }; },                    // below-right
    function(d) { return { dx: -d.labelW - 4, dy: -d.yOffset }; },           // above-left
    function(d) { return { dx: 6, dy: -d.yOffset - 4 }; },                   // above-right
    function(d) { return { dx: -d.labelW / 2, dy: d.yOffset + 10 }; }        // further below
  ];

  for (var i = 0; i < labelData.length; i++) {
    var ld = labelData[i];
    var placed = false;

    for (var oi = 0; oi < offsets.length; oi++) {
      var off = offsets[oi](ld);
      var testBox = {
        x: ld.x + off.dx,
        y: ld.y + off.dy - ld.labelH,
        w: ld.labelW,
        h: ld.labelH
      };

      if (!boxOverlaps(testBox)) {
        ld.finalLabelX = ld.x + off.dx + ld.labelW / 2;
        ld.finalLabelY = ld.y + off.dy;
        ld.placed = true;
        placedBoxes.push(testBox);
        placed = true;
        break;
      }
    }

    // If no position works, use default but mark as crowded
    if (!placed) {
      ld.finalLabelX = ld.x;
      ld.finalLabelY = ld.y + ld.yOffset;
      ld.placed = true;
      ld.crowded = true;
      placedBoxes.push({
        x: ld.x - ld.labelW / 2,
        y: ld.y + ld.yOffset - ld.labelH,
        w: ld.labelW,
        h: ld.labelH
      });
    }
  }

  // Now render all settlements with their resolved label positions
  // Re-sort by y position for proper overlap
  labelData.sort(function(a, b) { return a.y - b.y; });

  for (var li = 0; li < labelData.length; li++) {
    var ld = labelData[li];
    var city = ld.city;
    var x = ld.x;
    var y = ld.y;
    var i = ld.idx;

    var symbolVariant = (i + city.col * 73 + city.row * 137) % 3;
    var compField = typeof fmCompositionField === 'function' ? fmCompositionField(x, y) : 0.5;
    var detailMult = 0.7 + compField * 0.6;

    ctx.fillStyle = inkColor;
    ctx.strokeStyle = inkColor;

    if (city.type === 'capital') {
      var size = 10;
      var cw = size * 0.65;
      var ch = size * 0.55;
      ctx.globalAlpha = 0.85;

      var wallPts = [
        {x: x - cw, y: y + ch * 0.35},
        {x: x - cw, y: y - ch},
        {x: x + cw, y: y - ch},
        {x: x + cw, y: y + ch * 0.35}
      ];
      for (var wi = 0; wi < wallPts.length - 1; wi++) {
        var wpt1 = wallPts[wi]; var wpt2 = wallPts[wi + 1];
        var wb1 = typeof fmWobble === 'function' ? fmWobble(wpt1.x, wpt1.y, 0.5, i * 7 + wi) : wpt1;
        var wb2 = typeof fmWobble === 'function' ? fmWobble(wpt2.x, wpt2.y, 0.5, i * 7 + wi + 1) : wpt2;
        ctx.lineWidth = 1.6 + (typeof fmJitterHash === 'function' ? fmJitterHash(wpt1.x, wpt1.y, wi) * 0.6 : 0);
        ctx.beginPath(); ctx.moveTo(wb1.x, wb1.y); ctx.lineTo(wb2.x, wb2.y); ctx.stroke();
      }

      ctx.lineWidth = 1.0;
      for (var crn = 0; crn < 4; crn++) {
        var crx = x - cw + (crn + 0.5) * cw * 0.5;
        var wb = typeof fmWobble === 'function' ? fmWobble(crx, y - ch, 0.3, i * 13 + crn) : {x: crx, y: y - ch};
        ctx.beginPath();
        ctx.moveTo(wb.x - 1.2, y - ch); ctx.lineTo(wb.x - 1.2, y - ch - 1.8);
        ctx.lineTo(wb.x + 1.2, y - ch - 1.8); ctx.lineTo(wb.x + 1.2, y - ch); ctx.stroke();
      }

      var towerR = 2.5;
      ctx.lineWidth = 1.4; ctx.globalAlpha = 0.82;
      var towers = [{px:x-cw,py:y-ch},{px:x+cw,py:y-ch},{px:x-cw,py:y+ch*0.35},{px:x+cw,py:y+ch*0.35}];
      for (var t = 0; t < towers.length; t++) {
        ctx.beginPath();
        for (var ta = 0; ta <= 12; ta++) {
          var tAngle = (ta / 12) * Math.PI * 2;
          var tR = towerR * (0.9 + (typeof fmJitterHash === 'function' ? fmJitterHash(towers[t].px + ta, towers[t].py, t) * 0.2 : 0.1));
          var tpx = towers[t].px + Math.cos(tAngle) * tR;
          var tpy = towers[t].py + Math.sin(tAngle) * tR;
          if (ta === 0) ctx.moveTo(tpx, tpy); else ctx.lineTo(tpx, tpy);
        }
        ctx.closePath(); ctx.stroke();
        ctx.globalAlpha = 0.6; ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(towers[t].px, towers[t].py - towerR - 1.5);
        ctx.lineTo(towers[t].px - towerR * 0.6, towers[t].py - towerR * 0.3);
        ctx.lineTo(towers[t].px + towerR * 0.6, towers[t].py - towerR * 0.3);
        ctx.closePath(); ctx.stroke(); ctx.globalAlpha = 0.82;
      }

      ctx.globalAlpha = 0.88; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.rect(x - 2, y - ch * 0.6, 4, ch * 0.8); ctx.stroke();
      ctx.globalAlpha = 0.5; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.arc(x, y - ch * 0.3, 0.8, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 0.88; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(x, y - ch * 0.6); ctx.lineTo(x, y - ch - 4); ctx.stroke();

      ctx.fillStyle = isLight ? '#d41e3a' : '#ff5577'; ctx.globalAlpha = 0.92;
      ctx.beginPath();
      ctx.moveTo(x, y - ch - 4); ctx.lineTo(x + 3, y - ch - 6); ctx.lineTo(x + 1.5, y - ch - 5.2);
      ctx.lineTo(x + 3, y - ch - 4.8); ctx.lineTo(x, y - ch - 3.5); ctx.closePath(); ctx.fill();

      ctx.strokeStyle = inkColor; ctx.globalAlpha = 0.6; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(x, y + ch * 0.35, 1.5, Math.PI, 0, false); ctx.stroke();

      // Label with collision-resolved position
      ctx.font = 'bold small-caps 11px Palatino, Georgia, serif';
      ctx.textAlign = 'center'; ctx.globalAlpha = ld.crowded ? 0.6 : 0.92;
      ctx.strokeStyle = parchmentHalo; ctx.lineWidth = 5; ctx.lineJoin = 'round';
      ctx.strokeText(city.name, ld.finalLabelX, ld.finalLabelY);
      ctx.globalAlpha = ld.crowded ? 0.7 : 1.0;
      ctx.fillStyle = inkColor; ctx.fillText(city.name, ld.finalLabelX, ld.finalLabelY);

    } else if (city.type === 'city') {
      var bSize = 3.5; var spacing = 2.5;
      ctx.globalAlpha = 0.8;

      ctx.lineWidth = 0.6; ctx.globalAlpha = 0.25;
      ctx.beginPath();
      for (var wa = 0; wa <= 16; wa++) {
        var wAngle = (wa / 16) * Math.PI * 2;
        var wR = 9 * (0.9 + (typeof fmJitterHash === 'function' ? fmJitterHash(x + wa, y, i) * 0.2 : 0.1));
        var wpx = x + Math.cos(wAngle) * wR; var wpy = y + Math.sin(wAngle) * wR;
        if (wa === 0) ctx.moveTo(wpx, wpy); else ctx.lineTo(wpx, wpy);
      }
      ctx.closePath(); ctx.stroke();

      ctx.globalAlpha = 0.8; ctx.lineWidth = 1.3;
      var buildingPositions;
      if (symbolVariant === 0) {
        buildingPositions = [{bx:x-bSize-spacing,by:y-bSize,bw:bSize,bh:bSize},{bx:x-spacing/2,by:y-bSize-1.5,bw:bSize,bh:bSize},{bx:x+spacing,by:y-bSize+0.5,bw:bSize,bh:bSize}];
      } else if (symbolVariant === 1) {
        buildingPositions = [{bx:x-bSize-2,by:y-bSize*0.7,bw:bSize,bh:bSize*0.8},{bx:x-0.5,by:y-bSize,bw:bSize,bh:bSize},{bx:x+bSize+1.5,by:y-bSize*0.6,bw:bSize*0.9,bh:bSize*0.8}];
      } else {
        buildingPositions = [{bx:x-bSize,by:y-bSize,bw:bSize*0.9,bh:bSize},{bx:x+0.5,by:y-bSize,bw:bSize*0.9,bh:bSize},{bx:x-bSize,by:y,bw:bSize*0.9,bh:bSize*0.8},{bx:x+0.5,by:y,bw:bSize*0.9,bh:bSize*0.8}];
      }
      for (var bi = 0; bi < buildingPositions.length; bi++) {
        var bp = buildingPositions[bi];
        var corners = [{x:bp.bx,y:bp.by},{x:bp.bx+bp.bw,y:bp.by},{x:bp.bx+bp.bw,y:bp.by+bp.bh},{x:bp.bx,y:bp.by+bp.bh}];
        ctx.beginPath();
        for (var ci = 0; ci <= corners.length; ci++) {
          var c = corners[ci % corners.length];
          var wb = typeof fmWobble === 'function' ? fmWobble(c.x, c.y, 0.3, i * 11 + bi * 5 + ci) : c;
          if (ci === 0) ctx.moveTo(wb.x, wb.y); else ctx.lineTo(wb.x, wb.y);
        }
        ctx.stroke();
        ctx.lineWidth = 0.8; ctx.globalAlpha = 0.6;
        ctx.beginPath(); ctx.moveTo(bp.bx - 0.5, bp.by); ctx.lineTo(bp.bx + bp.bw * 0.5, bp.by - 2);
        ctx.lineTo(bp.bx + bp.bw + 0.5, bp.by); ctx.stroke();
        ctx.globalAlpha = 0.8; ctx.lineWidth = 1.3;
      }
      ctx.globalAlpha = 0.85; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.arc(x, y - 1, 2.5, Math.PI, 0, false); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - 1); ctx.lineTo(x, y - 5.5); ctx.stroke();

      ctx.font = 'small-caps 10px Palatino, Georgia, serif';
      ctx.textAlign = 'center'; ctx.globalAlpha = ld.crowded ? 0.5 : 1.0;
      ctx.strokeStyle = parchmentHalo; ctx.lineWidth = 2.5;
      ctx.strokeText(city.name, ld.finalLabelX, ld.finalLabelY);
      ctx.fillStyle = inkColor; ctx.fillText(city.name, ld.finalLabelX, ld.finalLabelY);

    } else if (city.type === 'town') {
      var hSize = 2.8; ctx.globalAlpha = 0.8; ctx.lineWidth = 1.1;
      var houseData = [];
      if (symbolVariant === 0) {
        houseData = [{px:x-hSize-1.5,py:y,tipOff:0},{px:x,py:y,tipOff:-0.3},{px:x+hSize+1.5,py:y,tipOff:0.2}];
      } else if (symbolVariant === 1) {
        houseData = [{px:x-hSize*1.2,py:y,tipOff:-0.2},{px:x+0.5,py:y,tipOff:0},{px:x+hSize*1.2,py:y,tipOff:0.3}];
      } else {
        houseData = [{px:x-hSize*0.6,py:y,tipOff:0},{px:x+hSize*0.6,py:y,tipOff:-0.2}];
      }
      for (var hi = 0; hi < houseData.length; hi++) {
        var hd = houseData[hi];
        var hsz = hSize * (0.9 + (typeof fmJitterHash === 'function' ? fmJitterHash(hd.px, hd.py, hi) * 0.2 : 0.1));
        var p1 = typeof fmWobble === 'function' ? fmWobble(hd.px + hd.tipOff, hd.py - hsz, 0.3, i + hi) : {x: hd.px + hd.tipOff, y: hd.py - hsz};
        var p2 = typeof fmWobble === 'function' ? fmWobble(hd.px - hsz * 0.6, hd.py, 0.3, i + hi + 1) : {x: hd.px - hsz * 0.6, y: hd.py};
        var p3 = typeof fmWobble === 'function' ? fmWobble(hd.px + hsz * 0.6, hd.py, 0.3, i + hi + 2) : {x: hd.px + hsz * 0.6, y: hd.py};
        ctx.lineWidth = 1.0 + (typeof fmJitterHash === 'function' ? fmJitterHash(hd.px, hd.py, 88) * 0.4 : 0);
        ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y);
        ctx.closePath(); ctx.stroke();
        if (detailMult > 0.7) {
          ctx.globalAlpha = 0.4; ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(hd.px - 0.4, hd.py); ctx.lineTo(hd.px - 0.4, hd.py - 0.8);
          ctx.lineTo(hd.px + 0.4, hd.py - 0.8); ctx.lineTo(hd.px + 0.4, hd.py); ctx.stroke();
          ctx.globalAlpha = 0.8;
        }
      }
      ctx.strokeStyle = lightInk; ctx.lineWidth = 0.6; ctx.globalAlpha = 0.25;
      ctx.beginPath(); ctx.moveTo(x + hSize * 0.3, y - hSize * 0.8);
      ctx.quadraticCurveTo(x + hSize * 0.7, y - hSize * 1.4, x + hSize * 0.2, y - hSize * 1.7);
      ctx.quadraticCurveTo(x + hSize * 0.6, y - hSize * 2.0, x + hSize * 0.3, y - hSize * 2.2); ctx.stroke();
      ctx.strokeStyle = inkColor;

      ctx.font = '9px Palatino, Georgia, serif';
      ctx.textAlign = 'center'; ctx.globalAlpha = ld.crowded ? 0.5 : 1.0;
      ctx.strokeStyle = parchmentHalo; ctx.lineWidth = 2;
      ctx.strokeText(city.name, ld.finalLabelX, ld.finalLabelY);
      ctx.fillStyle = inkColor; ctx.fillText(city.name, ld.finalLabelX, ld.finalLabelY);

    } else if (city.type === 'hamlet') {
      var hh = 3; var hw = 2;
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 1.0 + (typeof fmJitterHash === 'function' ? fmJitterHash(x, y, 33) * 0.3 : 0);
      var hp1 = typeof fmWobble === 'function' ? fmWobble(x, y - hh, 0.2, i) : {x: x, y: y - hh};
      var hp2 = typeof fmWobble === 'function' ? fmWobble(x - hw, y, 0.2, i + 1) : {x: x - hw, y: y};
      var hp3 = typeof fmWobble === 'function' ? fmWobble(x + hw, y, 0.2, i + 2) : {x: x + hw, y: y};
      ctx.beginPath(); ctx.moveTo(hp1.x, hp1.y); ctx.lineTo(hp2.x, hp2.y); ctx.lineTo(hp3.x, hp3.y);
      ctx.closePath(); ctx.stroke();
      ctx.strokeStyle = lightInk; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.3;
      ctx.beginPath(); ctx.moveTo(x + hw - 0.8, y - hh * 0.6);
      ctx.quadraticCurveTo(x + hw, y - hh * 1.1, x + hw - 0.3, y - hh * 1.5); ctx.stroke();
      ctx.strokeStyle = inkColor;

      ctx.font = 'italic 8px Palatino, Georgia, serif';
      ctx.textAlign = 'center'; ctx.globalAlpha = ld.crowded ? 0.4 : 1.0;
      ctx.strokeStyle = parchmentHalo; ctx.lineWidth = 1.5;
      ctx.strokeText(city.name, ld.finalLabelX, ld.finalLabelY);
      ctx.fillStyle = inkColor; ctx.fillText(city.name, ld.finalLabelX, ld.finalLabelY);
    }
    ctx.globalAlpha = 1.0;
  }
};

var fmRenderPOIs = function(ctx) {
  var pois = FMap.world.pois || [];
  var isLight = !FMap.dark;
  var inkColor = isLight ? '#4a3a2a' : '#b8a890';

  for (var i = 0; i < pois.length; i++) {
    var poi = pois[i];
    var screen = fmCellToScreen(poi.col, poi.row);
    var x = screen.x;
    var y = screen.y;

    ctx.fillStyle = inkColor;
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 1.0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (poi.type === 'dungeon') {
      // Skull-gate doorway
      ctx.lineWidth = 1.1;
      // Skull
      ctx.beginPath();
      ctx.arc(x, y - 1.5, 2.2, 0, Math.PI * 2);
      ctx.stroke();
      // Eye sockets
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(x - 0.8, y - 1.8, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 0.8, y - 1.8, 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
      // Jaw
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(x - 1.5, y + 0.8);
      ctx.lineTo(x + 1.5, y + 0.8);
      ctx.stroke();

    } else if (poi.type === 'ruins') {
      // Broken columns
      ctx.lineWidth = 1.0;
      // Left column (broken)
      ctx.beginPath();
      ctx.moveTo(x - 1.5, y - 3);
      ctx.lineTo(x - 1.5, y - 0.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 1.5, y + 0.8);
      ctx.lineTo(x - 1.5, y + 3);
      ctx.stroke();
      // Right column (broken)
      ctx.beginPath();
      ctx.moveTo(x + 1.5, y - 3);
      ctx.lineTo(x + 1.5, y - 0.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 1.5, y + 0.5);
      ctx.lineTo(x + 1.5, y + 3);
      ctx.stroke();
      // Center column fragment
      ctx.beginPath();
      ctx.moveTo(x, y - 2);
      ctx.lineTo(x, y + 1.5);
      ctx.stroke();

    } else if (poi.type === 'temple') {
      // Temple facade with cross
      ctx.lineWidth = 1.1;
      // Pitched roof
      ctx.beginPath();
      ctx.moveTo(x - 2.5, y - 2.5);
      ctx.lineTo(x, y - 4);
      ctx.lineTo(x + 2.5, y - 2.5);
      ctx.stroke();
      // Walls
      ctx.beginPath();
      ctx.rect(x - 2.5, y - 2.5, 5, 5);
      ctx.stroke();
      // Door
      ctx.globalAlpha = 0.6;
      ctx.fillRect(x - 0.8, y + 0.5, 1.6, 1.8);
      ctx.globalAlpha = 1.0;
      // Cross on facade
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x, y - 1.5);
      ctx.lineTo(x, y + 0.5);
      ctx.moveTo(x - 0.8, y - 0.5);
      ctx.lineTo(x + 0.8, y - 0.5);
      ctx.stroke();

    } else if (poi.type === 'tower') {
      // Thin tall tower with flags
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x - 1.2, y - 3.5);
      ctx.lineTo(x - 1.2, y + 2);
      ctx.lineTo(x + 1.2, y + 2);
      ctx.lineTo(x + 1.2, y - 3.5);
      ctx.stroke();
      // Crenellations
      ctx.lineWidth = 0.6;
      for (var j = 0; j < 3; j++) {
        ctx.beginPath();
        ctx.moveTo(x - 0.8 + j * 1, y - 3.5);
        ctx.lineTo(x - 0.8 + j * 1, y - 4.2);
        ctx.stroke();
      }

    } else if (poi.type === 'cave') {
      // Dark arch opening
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(x, y + 0.5, 2.5, Math.PI * 0.2, Math.PI * 0.8, false);
      ctx.stroke();
      // Dark fill
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(x, y + 0.5, 2.3, Math.PI * 0.25, Math.PI * 0.75, false);
      ctx.lineTo(x - 2.2, y + 1.5);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1.0;

    } else if (poi.type === 'shrine') {
      // Star with central cross
      ctx.lineWidth = 1.0;
      var starR = 2.5;
      ctx.beginPath();
      // 8-point star
      for (var sp = 0; sp < 8; sp++) {
        var angle = (sp / 8) * Math.PI * 2 - Math.PI / 2;
        var radius = sp % 2 === 0 ? starR : starR * 0.6;
        var px = x + Math.cos(angle) * radius;
        var py = y + Math.sin(angle) * radius;
        if (sp === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      // Central cross
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x, y - 1.2);
      ctx.lineTo(x, y + 1.2);
      ctx.moveTo(x - 1.2, y);
      ctx.lineTo(x + 1.2, y);
      ctx.stroke();

    } else if (poi.type === 'battlefield') {
      // Crossed swords
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x - 2.5, y - 2.5);
      ctx.lineTo(x + 2.5, y + 2.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 2.5, y - 2.5);
      ctx.lineTo(x - 2.5, y + 2.5);
      ctx.stroke();
      // Center guard knot
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.stroke();

    } else if (poi.type === 'mine') {
      // Pickaxe over ore
      ctx.lineWidth = 1.0;
      // Pick head
      ctx.beginPath();
      ctx.moveTo(x - 1.8, y - 1.5);
      ctx.lineTo(x - 0.5, y + 0.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 0.8, y - 2);
      ctx.lineTo(x - 0.2, y - 0.8);
      ctx.stroke();
      // Handle
      ctx.beginPath();
      ctx.moveTo(x - 0.5, y + 0.5);
      ctx.lineTo(x + 1.2, y + 2);
      ctx.stroke();
      // Ore rocks below
      ctx.beginPath();
      ctx.arc(x + 0.5, y + 2.5, 1.2, 0, Math.PI * 2);
      ctx.stroke();

    } else if (poi.type === 'camp') {
      // Tent with campfire
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(x, y - 3);
      ctx.lineTo(x - 2.5, y + 1.5);
      ctx.lineTo(x + 2.5, y + 1.5);
      ctx.closePath();
      ctx.stroke();
      // Tent pole
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(x, y - 3);
      ctx.lineTo(x, y + 1.5);
      ctx.stroke();
      // Campfire
      ctx.fillStyle = isLight ? '#e85a3a' : '#ff8866';
      ctx.globalAlpha = 0.7;
      for (var f = 0; f < 3; f++) {
        ctx.beginPath();
        ctx.arc(x + (f - 1) * 1.5, y + 2.2 + f * 0.3, 0.5 + f * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = inkColor;

    } else if (poi.type === 'portal') {
      // Glowing concentric circles
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 2.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.stroke();
      // Glow effect
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(x, y, 3.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1.0;

    } else if (poi.type === 'dragon_lair') {
      // Dragon silhouette with wings
      ctx.lineWidth = 1.1;
      // Body S-curve
      ctx.beginPath();
      ctx.moveTo(x - 2.5, y);
      ctx.quadraticCurveTo(x - 1, y - 2, x + 0.5, y - 1.5);
      ctx.quadraticCurveTo(x + 1.5, y - 0.5, x + 2.5, y + 1);
      ctx.stroke();
      // Head
      ctx.beginPath();
      ctx.arc(x + 2.5, y + 0.8, 1, 0, Math.PI * 2);
      ctx.stroke();
      // Wings (triangles)
      ctx.beginPath();
      ctx.moveTo(x, y - 1);
      ctx.lineTo(x - 1.5, y - 2.8);
      ctx.lineTo(x + 0.5, y - 1);
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 0.5;
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Label
    ctx.font = 'italic 8px Palatino, Georgia, serif';
    ctx.textAlign = 'left';
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = inkColor;
    ctx.fillText(poi.name, x + 7, y + 3);
    ctx.globalAlpha = 1.0;
  }
};

var fmRenderFeatureLabels = function(ctx) {
  var isLight = !FMap.dark;

  // Kingdom names
  var kingdoms = FMap.world.kingdoms || [];
  for (var k = 0; k < kingdoms.length; k++) {
    var kingdom = kingdoms[k];
    if (!kingdom.bounds || !kingdom.name) continue;

    // Center of kingdom
    var centerCol = (kingdom.bounds.minCol + kingdom.bounds.maxCol) / 2;
    var centerRow = (kingdom.bounds.minRow + kingdom.bounds.maxRow) / 2;
    var screen = fmCellToScreen(centerCol, centerRow);

    // Kingdom name — prominent with wide text halo for readability through dense dots
    ctx.font = 'small-caps 20px Palatino, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '8px';

    // Wide parchment-colored halo — clears dots around text like C# reference
    ctx.globalAlpha = 0.85;
    ctx.strokeStyle = isLight ? '#c4a050' : '#2a2218';
    ctx.lineWidth = 6;
    ctx.lineJoin = 'round';
    ctx.strokeText(kingdom.name.toUpperCase(), screen.x, screen.y);

    // Text fill
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = kingdom.color && kingdom.color.text ? kingdom.color.text : (isLight ? '#2a1a0a' : '#a89070');
    ctx.fillText(kingdom.name.toUpperCase(), screen.x, screen.y);
    ctx.globalAlpha = 1;
  }

  // Geographic features
  var features = FMap.world.features || [];
  for (var f = 0; f < features.length; f++) {
    var feature = features[f];
    if (!feature.bounds || !feature.name) continue;

    var fCenterCol = (feature.bounds.minCol + feature.bounds.maxCol) / 2;
    var fCenterRow = (feature.bounds.minRow + feature.bounds.maxRow) / 2;
    var fScreen = fmCellToScreen(fCenterCol, fCenterRow);

    var fSize = 12, fColor = isLight ? '#3a2a1a' : '#b8a890', fStyle = 'italic';

    if (feature.type === 'mountain') {
      fSize = 12;
      fColor = isLight ? '#3a2a1a' : '#a89070';
      fStyle = 'italic';
    } else if (feature.type === 'forest') {
      fSize = 12;
      fColor = isLight ? '#4a3a2a' : '#a89070';
      fStyle = 'italic';
    } else if (feature.type === 'ocean' || feature.type === 'sea') {
      fSize = 18;
      fColor = isLight ? '#4a3518' : '#9db0c8';
      fStyle = 'italic';
    } else if (feature.type === 'river') {
      fSize = 10;
      fColor = isLight ? '#5a6a80' : '#9db0c8';
      fStyle = 'italic';
      var rotation = fRand() * 0.3 - 0.15;
      ctx.save();
      ctx.translate(fScreen.x, fScreen.y);
      ctx.rotate(rotation);
      ctx.font = fStyle + ' ' + fSize + 'px Palatino, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = fColor;
      ctx.fillText(feature.name, 0, 0);
      ctx.restore();
      continue;
    } else if (feature.type === 'desert') {
      fSize = 14;
      fColor = isLight ? '#8b7a5a' : '#d4c4a0';
      fStyle = 'italic';
    } else if (feature.type === 'swamp') {
      fSize = 12;
      fColor = isLight ? '#5a6a4a' : '#9db090';
      fStyle = 'italic';
    }

    ctx.font = fStyle + ' ' + fSize + 'px Palatino, Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Parchment halo for readability through dots
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = isLight ? '#c4a050' : '#2a2218';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.strokeText(feature.name, fScreen.x, fScreen.y);

    ctx.globalAlpha = 0.7;
    ctx.fillStyle = fColor;
    ctx.fillText(feature.name, fScreen.x, fScreen.y);
    ctx.globalAlpha = 1.0;
  }
};

var fmRenderCompass = function(ctx, cx, cy, size) {
  var isLight = !FMap.dark;
  var inkColor = isLight ? '#1a1005' : '#a89070';
  var accentColor = '#8b3a1a';
  var lightInk = isLight ? '#4a3a2a' : '#b8a890';
  var parchColor = isLight ? '#e8c87a' : '#3a2a1a';

  ctx.save();
  ctx.translate(cx, cy);
  var s = size / 100;

  // === TRIPLE DECORATIVE RINGS ===
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 2.2 * s;
  ctx.globalAlpha = 0.92;
  ctx.beginPath();
  ctx.arc(0, 0, 50 * s, 0, Math.PI * 2);
  ctx.stroke();

  // Middle ring
  ctx.lineWidth = 1.0 * s;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(0, 0, 46 * s, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring
  ctx.lineWidth = 0.8 * s;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(0, 0, 42 * s, 0, Math.PI * 2);
  ctx.stroke();

  // 32 tick marks — major at cardinal/ordinal, minor at others
  ctx.lineWidth = 0.9 * s;
  for (var t = 0; t < 32; t++) {
    var ta = (t / 32) * Math.PI * 2;
    var isMajor = (t % 8 === 0);
    var inner = isMajor ? 40 * s : 43.5 * s;
    var outer = 50 * s;

    ctx.globalAlpha = isMajor ? 0.8 : 0.5;
    ctx.lineWidth = isMajor ? 1.2 * s : 0.7 * s;
    ctx.beginPath();
    ctx.moveTo(Math.cos(ta) * inner, Math.sin(ta) * inner);
    ctx.lineTo(Math.cos(ta) * outer, Math.sin(ta) * outer);
    ctx.stroke();
  }

  // === 16-POINT STAR: 4 cardinal (long) + 4 intermediate (medium) + 8 minor (short) ===
  // Cardinal points — longer and wider with alternating fill
  var cardAngles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI]; // N, E, S, W

  for (var c = 0; c < 4; c++) {
    var a = cardAngles[c];
    var tipDist = 46 * s;
    var baseW = 0.24;

    var tipX = Math.cos(a) * tipDist;
    var tipY = Math.sin(a) * tipDist;
    var leftX = Math.cos(a + baseW) * 11 * s;
    var leftY = Math.sin(a + baseW) * 11 * s;
    var rightX = Math.cos(a - baseW) * 11 * s;
    var rightY = Math.sin(a - baseW) * 11 * s;

    // Dark filled half
    ctx.fillStyle = (c === 0) ? accentColor : inkColor;
    ctx.globalAlpha = 0.96;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Light filled half
    ctx.fillStyle = parchColor;
    ctx.globalAlpha = 0.90;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(rightX, rightY);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Bold outline
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 1.4 * s;
    ctx.globalAlpha = 0.88;
    ctx.stroke();
  }

  // Intermediate points (45 degrees) — medium size
  var intAngles = [-Math.PI / 4, Math.PI / 4, 3 * Math.PI / 4, -3 * Math.PI / 4];
  for (var in_idx = 0; in_idx < 4; in_idx++) {
    var a = intAngles[in_idx];
    var tipDist = 38 * s;
    var baseW = 0.16;

    var tipX = Math.cos(a) * tipDist;
    var tipY = Math.sin(a) * tipDist;
    var leftX = Math.cos(a + baseW) * 8 * s;
    var leftY = Math.sin(a + baseW) * 8 * s;
    var rightX = Math.cos(a - baseW) * 8 * s;
    var rightY = Math.sin(a - baseW) * 8 * s;

    // Dark half
    ctx.fillStyle = inkColor;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Light half
    ctx.fillStyle = parchColor;
    ctx.globalAlpha = 0.78;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(rightX, rightY);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Outline
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 0.95 * s;
    ctx.globalAlpha = 0.80;
    ctx.stroke();
  }

  // 8 minor points (every 45 degrees offset by 22.5) — thin, unfilled
  var minorAngles = [];
  for (var m = 0; m < 8; m++) {
    minorAngles.push((m * Math.PI / 4) + Math.PI / 8 - Math.PI / 2);
  }

  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 0.6 * s;
  ctx.globalAlpha = 0.6;
  for (var min_idx = 0; min_idx < minorAngles.length; min_idx++) {
    var a = minorAngles[min_idx];
    var tipDist = 28 * s;
    var baseR = 5 * s;

    var tipX = Math.cos(a) * tipDist;
    var tipY = Math.sin(a) * tipDist;
    var baseX = Math.cos(a) * baseR;
    var baseY = Math.sin(a) * baseR;

    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(baseX, baseY);
    ctx.stroke();
  }

  // === DECORATIVE FLEUR-DE-LIS ON NORTH POINT ===
  ctx.strokeStyle = accentColor;
  ctx.fillStyle = accentColor;
  ctx.lineWidth = 1.5 * s;
  ctx.globalAlpha = 0.95;
  var fY = -48 * s;

  // Center petal (pointed upward)
  ctx.beginPath();
  ctx.moveTo(0, fY - 6 * s);
  ctx.quadraticCurveTo(2.5 * s, fY - 2 * s, 0.8 * s, fY + 1.5 * s);
  ctx.quadraticCurveTo(0, fY, -0.8 * s, fY + 1.5 * s);
  ctx.quadraticCurveTo(-2.5 * s, fY - 2 * s, 0, fY - 6 * s);
  ctx.fill();

  // Left petal
  ctx.beginPath();
  ctx.moveTo(-1.5 * s, fY);
  ctx.quadraticCurveTo(-5 * s, fY - 3.5 * s, -4 * s, fY + 2.5 * s);
  ctx.quadraticCurveTo(-2 * s, fY + 0.5 * s, -1.5 * s, fY);
  ctx.fill();

  // Right petal
  ctx.beginPath();
  ctx.moveTo(1.5 * s, fY);
  ctx.quadraticCurveTo(5 * s, fY - 3.5 * s, 4 * s, fY + 2.5 * s);
  ctx.quadraticCurveTo(2 * s, fY + 0.5 * s, 1.5 * s, fY);
  ctx.fill();

  // === CENTER ORNAMENT — double concentric circles ===
  ctx.globalAlpha = 1.0;

  // Outer circle (filled)
  ctx.fillStyle = inkColor;
  ctx.beginPath();
  ctx.arc(0, 0, 6 * s, 0, Math.PI * 2);
  ctx.fill();

  // Middle circle (light)
  ctx.fillStyle = parchColor;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.arc(0, 0, 4 * s, 0, Math.PI * 2);
  ctx.fill();

  // Inner circle (dark)
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(0, 0, 2 * s, 0, Math.PI * 2);
  ctx.fill();

  // === CARDINAL LABELS in serif with decorative style ===
  ctx.globalAlpha = 1.0;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  var labelDist = 62 * s;

  // North — prominent red letter with serifs
  ctx.fillStyle = accentColor;
  ctx.font = 'bold ' + Math.round(20 * s) + 'px Palatino, Georgia, serif';
  ctx.fillText('N', 0, -labelDist);

  // South, East, West — smaller, normal weight
  ctx.fillStyle = inkColor;
  ctx.font = Math.round(13 * s) + 'px Palatino, Georgia, serif';
  ctx.fillText('S', 0, labelDist);
  ctx.fillText('E', labelDist, 0);
  ctx.fillText('W', -labelDist, 0);

  // Add decorative dots at intermediate cardinal points
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.5;
  var dotDist = 52 * s;
  var dotSize = 0.8 * s;
  ctx.beginPath();
  ctx.arc(dotDist * Math.cos(Math.PI / 4), dotDist * Math.sin(Math.PI / 4), dotSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(dotDist * Math.cos(3 * Math.PI / 4), dotDist * Math.sin(3 * Math.PI / 4), dotSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(dotDist * Math.cos(5 * Math.PI / 4), dotDist * Math.sin(5 * Math.PI / 4), dotSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(dotDist * Math.cos(7 * Math.PI / 4), dotDist * Math.sin(7 * Math.PI / 4), dotSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.globalAlpha = 1.0;
  ctx.restore();
};

var fmRenderCartouche = function(ctx, x, y, title, subtitle) {
  var isLight = !FMap.dark;
  var inkColor = isLight ? '#1a1005' : '#a89070';
  var parchmentColor = isLight ? '#e8c896' : '#4a3a2a';
  var borderColor = isLight ? '#3a2a1a' : '#a89070';
  var lightInk = isLight ? '#5a4a3a' : '#9a8a70';
  var accentColor = '#8b5a2b';

  var width = 280;
  var height = 110;
  var curveExt = 20;  // curl extension

  ctx.save();

  // === DECORATIVE BACKGROUND SHADOW ===
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(x - width / 2 - 3, y - height / 2 - 3);
  ctx.lineTo(x + width / 2 + 3, y - height / 2 - 3);
  ctx.quadraticCurveTo(x + width / 2 + 3, y + height / 2 + 3, x - width / 2 - 3, y + height / 2 + 3);
  ctx.lineTo(x - width / 2 - 3, y - height / 2 - 3);
  ctx.closePath();
  ctx.fill();

  // === SCROLL/BANNER SHAPE with curled ends ===
  // Main banner body
  ctx.fillStyle = parchmentColor;
  ctx.globalAlpha = 0.96;
  ctx.beginPath();
  // Top edge
  ctx.moveTo(x - width / 2 + 12, y - height / 2);
  ctx.lineTo(x + width / 2 - 12, y - height / 2);

  // Top-right curl
  ctx.quadraticCurveTo(x + width / 2 + 6, y - height / 2 + 8, x + width / 2 + 8, y - height / 2 + curveExt);
  ctx.quadraticCurveTo(x + width / 2, y - height / 2 + curveExt * 0.6, x + width / 2 - 2, y - height / 2 + 12);

  // Right edge
  ctx.lineTo(x + width / 2 - 2, y + height / 2 - 12);

  // Bottom-right curl
  ctx.quadraticCurveTo(x + width / 2, y + height / 2 - curveExt * 0.6, x + width / 2 + 8, y + height / 2 - curveExt);
  ctx.quadraticCurveTo(x + width / 2 + 6, y + height / 2 - 8, x + width / 2 - 12, y + height / 2);

  // Bottom edge
  ctx.lineTo(x - width / 2 + 12, y + height / 2);

  // Bottom-left curl
  ctx.quadraticCurveTo(x - width / 2 - 6, y + height / 2 - 8, x - width / 2 - 8, y + height / 2 - curveExt);
  ctx.quadraticCurveTo(x - width / 2, y + height / 2 - curveExt * 0.6, x - width / 2 + 2, y + height / 2 - 12);

  // Left edge
  ctx.lineTo(x - width / 2 + 2, y - height / 2 + 12);

  // Top-left curl
  ctx.quadraticCurveTo(x - width / 2, y - height / 2 + curveExt * 0.6, x - width / 2 - 8, y - height / 2 - curveExt);
  ctx.quadraticCurveTo(x - width / 2 - 6, y - height / 2 - 8, x - width / 2 + 12, y - height / 2);

  ctx.closePath();
  ctx.fill();

  // === DOUBLE-LINE DECORATIVE BORDER ===
  // Outer border (thicker)
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 2.2;
  ctx.globalAlpha = 0.92;
  ctx.beginPath();
  ctx.moveTo(x - width / 2 + 12, y - height / 2);
  ctx.lineTo(x + width / 2 - 12, y - height / 2);
  ctx.quadraticCurveTo(x + width / 2 + 6, y - height / 2 + 8, x + width / 2 + 8, y - height / 2 + curveExt);
  ctx.quadraticCurveTo(x + width / 2, y - height / 2 + curveExt * 0.6, x + width / 2 - 2, y - height / 2 + 12);
  ctx.lineTo(x + width / 2 - 2, y + height / 2 - 12);
  ctx.quadraticCurveTo(x + width / 2, y + height / 2 - curveExt * 0.6, x + width / 2 + 8, y + height / 2 - curveExt);
  ctx.quadraticCurveTo(x + width / 2 + 6, y + height / 2 - 8, x + width / 2 - 12, y + height / 2);
  ctx.lineTo(x - width / 2 + 12, y + height / 2);
  ctx.quadraticCurveTo(x - width / 2 - 6, y + height / 2 - 8, x - width / 2 - 8, y + height / 2 - curveExt);
  ctx.quadraticCurveTo(x - width / 2, y + height / 2 - curveExt * 0.6, x - width / 2 + 2, y + height / 2 - 12);
  ctx.lineTo(x - width / 2 + 2, y - height / 2 + 12);
  ctx.quadraticCurveTo(x - width / 2, y - height / 2 + curveExt * 0.6, x - width / 2 - 8, y - height / 2 - curveExt);
  ctx.quadraticCurveTo(x - width / 2 - 6, y - height / 2 - 8, x - width / 2 + 12, y - height / 2);
  ctx.stroke();

  // Inner border (thinner line, inset)
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 0.9;
  ctx.globalAlpha = 0.75;
  ctx.beginPath();
  ctx.moveTo(x - width / 2 + 20, y - height / 2 + 8);
  ctx.lineTo(x + width / 2 - 20, y - height / 2 + 8);
  ctx.quadraticCurveTo(x + width / 2 - 8, y - height / 2 + 8, x + width / 2 - 8, y - height / 2 + 18);
  ctx.lineTo(x + width / 2 - 8, y + height / 2 - 18);
  ctx.quadraticCurveTo(x + width / 2 - 8, y + height / 2 - 8, x + width / 2 - 20, y + height / 2 - 8);
  ctx.lineTo(x - width / 2 + 20, y + height / 2 - 8);
  ctx.quadraticCurveTo(x - width / 2 + 8, y + height / 2 - 8, x - width / 2 + 8, y + height / 2 - 18);
  ctx.lineTo(x - width / 2 + 8, y - height / 2 + 18);
  ctx.quadraticCurveTo(x - width / 2 + 8, y - height / 2 + 8, x - width / 2 + 20, y - height / 2 + 8);
  ctx.stroke();

  // === CORNER FLORAL ORNAMENTS — detailed flourishes ===
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.3;
  ctx.globalAlpha = 0.72;

  // Top-left corner flourish
  ctx.beginPath();
  ctx.moveTo(x - width / 2 + 22, y - height / 2 + 14);
  ctx.quadraticCurveTo(x - width / 2 + 16, y - height / 2 + 10, x - width / 2 + 12, y - height / 2 + 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - width / 2 + 22, y - height / 2 + 14);
  ctx.quadraticCurveTo(x - width / 2 + 24, y - height / 2 + 20, x - width / 2 + 18, y - height / 2 + 24);
  ctx.stroke();

  // Top-right corner flourish
  ctx.beginPath();
  ctx.moveTo(x + width / 2 - 22, y - height / 2 + 14);
  ctx.quadraticCurveTo(x + width / 2 - 16, y - height / 2 + 10, x + width / 2 - 12, y - height / 2 + 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + width / 2 - 22, y - height / 2 + 14);
  ctx.quadraticCurveTo(x + width / 2 - 24, y - height / 2 + 20, x + width / 2 - 18, y - height / 2 + 24);
  ctx.stroke();

  // Bottom-left corner flourish
  ctx.beginPath();
  ctx.moveTo(x - width / 2 + 22, y + height / 2 - 14);
  ctx.quadraticCurveTo(x - width / 2 + 16, y + height / 2 - 10, x - width / 2 + 12, y + height / 2 - 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - width / 2 + 22, y + height / 2 - 14);
  ctx.quadraticCurveTo(x - width / 2 + 24, y + height / 2 - 20, x - width / 2 + 18, y + height / 2 - 24);
  ctx.stroke();

  // Bottom-right corner flourish
  ctx.beginPath();
  ctx.moveTo(x + width / 2 - 22, y + height / 2 - 14);
  ctx.quadraticCurveTo(x + width / 2 - 16, y + height / 2 - 10, x + width / 2 - 12, y + height / 2 - 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + width / 2 - 22, y + height / 2 - 14);
  ctx.quadraticCurveTo(x + width / 2 - 24, y + height / 2 - 20, x + width / 2 - 18, y + height / 2 - 24);
  ctx.stroke();

  // === TITLE TEXT — large decorative serif ===
  ctx.globalAlpha = 1.0;
  ctx.font = 'bold small-caps 24px Palatino, Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Text halo/shadow for readability
  ctx.strokeStyle = parchmentColor;
  ctx.lineWidth = 3.5;
  ctx.strokeText(title, x, y - 18);
  ctx.fillStyle = borderColor;
  ctx.fillText(title, x, y - 18);

  // === ORNAMENTAL DIVIDER — elaborate flourish with center accent ===
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.1;
  ctx.globalAlpha = 0.85;

  // Left flourish
  ctx.beginPath();
  ctx.moveTo(x - 80, y + 6);
  ctx.quadraticCurveTo(x - 50, y + 2, x - 12, y + 6);
  ctx.stroke();

  // Right flourish
  ctx.beginPath();
  ctx.moveTo(x + 80, y + 6);
  ctx.quadraticCurveTo(x + 50, y + 2, x + 12, y + 6);
  ctx.stroke();

  // Center ornament — diamond with decorative dots
  ctx.fillStyle = accentColor;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.moveTo(x, y + 2);
  ctx.lineTo(x + 5, y + 6);
  ctx.lineTo(x, y + 10);
  ctx.lineTo(x - 5, y + 6);
  ctx.closePath();
  ctx.fill();

  // Flanking decorative dots
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(x - 10, y + 6, 1.5, 0, Math.PI * 2);
  ctx.arc(x + 10, y + 6, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // === SUBTITLE TEXT — smaller italic serif ===
  ctx.globalAlpha = 0.88;
  ctx.font = 'italic 12px Palatino, Georgia, serif';
  ctx.fillStyle = inkColor;
  ctx.fillText(subtitle, x, y + 28);

  ctx.globalAlpha = 1.0;
  ctx.restore();
};

var fmRenderScaleBar = function(ctx, x, y, label) {
  var isLight = !FMap.dark;
  var inkColor = isLight ? '#1a1005' : '#a89070';

  var segmentWidth = 18;
  var segmentHeight = 7;
  var numSegments = 7;
  var totalWidth = segmentWidth * numSegments;

  ctx.lineWidth = 1.2;
  ctx.strokeStyle = inkColor;
  ctx.fillStyle = inkColor;

  // Draw alternating black/white segments (like a ruler)
  for (var seg = 0; seg < numSegments; seg++) {
    var segX = x + seg * segmentWidth;

    // Draw rectangle border
    ctx.strokeRect(segX, y, segmentWidth, segmentHeight);

    // Fill alternating segments (black, white, black, etc.)
    if (seg % 2 === 0) {
      ctx.fillRect(segX, y, segmentWidth, segmentHeight);
    }
  }

  // End caps with small vertical lines extending up/down
  var capHeight = 4;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  // Left end cap
  ctx.moveTo(x, y - capHeight);
  ctx.lineTo(x, y + segmentHeight + capHeight);
  // Right end cap
  ctx.moveTo(x + totalWidth, y - capHeight);
  ctx.lineTo(x + totalWidth, y + segmentHeight + capHeight);
  ctx.stroke();

  // Small decorative serifs at each segment boundary
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.5;
  for (var tick = 1; tick < numSegments; tick++) {
    var tickX = x + tick * segmentWidth;
    ctx.beginPath();
    ctx.moveTo(tickX, y - capHeight * 0.7);
    ctx.lineTo(tickX, y + segmentHeight + capHeight * 0.7);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  // Label text below scale bar
  ctx.font = 'serif 8px Georgia, Palatino, serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = inkColor;
  ctx.fillText(label || 'Scale', x + totalWidth / 2, y + segmentHeight + 14);
};

var fmRenderLegend = function(ctx, x, y) {
  var isLight = !FMap.dark;
  var inkColor = isLight ? '#1a1005' : '#a89070';
  var parchmentColor = isLight ? '#d4b06a' : '#3a2a1a';
  var bgColor = isLight ? 'rgba(212,176,106,0.85)' : 'rgba(58,42,26,0.88)';

  var width = 145;
  var itemHeight = 16;
  var numItems = 8;
  var height = 40 + numItems * itemHeight;
  var padding = 8;
  var iconSize = 10;

  // Parchment background
  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, width, height);

  // Decorative double-line border
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x, y, width, height);
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.4;
  ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);
  ctx.globalAlpha = 1.0;

  // Title "Legend" in small caps style
  ctx.font = 'bold 10px Palatino, Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = inkColor;
  ctx.fillText('LEGEND', x + width / 2, y + 16);

  // Divider line
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = inkColor;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.moveTo(x + padding, y + 22);
  ctx.lineTo(x + width - padding, y + 22);
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Legend items with improved icons
  var legendItems = [
    { icon: 'capital', label: 'Capital' },
    { icon: 'city', label: 'City' },
    { icon: 'town', label: 'Town' },
    { icon: 'hamlet', label: 'Hamlet' },
    { icon: 'mountain', label: 'Mountain' },
    { icon: 'forest', label: 'Forest' },
    { icon: 'road', label: 'Road' },
    { icon: 'river', label: 'River' }
  ];

  var iconStartX = x + padding + 2;
  var labelStartX = x + padding + iconSize + 12;

  for (var item = 0; item < legendItems.length; item++) {
    var itemY = y + 30 + item * itemHeight;
    var iconCenterX = iconStartX + iconSize / 2;
    var iconCenterY = itemY + 4;

    ctx.lineWidth = 0.9;
    ctx.fillStyle = inkColor;
    ctx.strokeStyle = inkColor;
    ctx.globalAlpha = 0.7;

    // Draw mini icons (~10px size) — detailed versions
    if (legendItems[item].icon === 'capital') {
      // Capital: star
      ctx.fillStyle = inkColor;
      var starPoints = 5;
      for (var p = 0; p < starPoints * 2; p++) {
        var angle = (p * Math.PI) / starPoints;
        var r = p % 2 === 0 ? 3 : 1.5;
        var px = iconCenterX + Math.cos(angle) * r;
        var py = iconCenterY + Math.sin(angle) * r;
        if (p === 0) ctx.beginPath();
        ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    } else if (legendItems[item].icon === 'city') {
      // City: circle
      ctx.beginPath();
      ctx.arc(iconCenterX, iconCenterY, 2, 0, Math.PI * 2);
      ctx.stroke();
    } else if (legendItems[item].icon === 'town') {
      // Town: two small squares
      ctx.fillRect(iconCenterX - 1.5, iconCenterY - 1, 1.8, 1.8);
      ctx.fillRect(iconCenterX + 0.7, iconCenterY - 1, 1.8, 1.8);
    } else if (legendItems[item].icon === 'hamlet') {
      // Hamlet: single dot
      ctx.beginPath();
      ctx.arc(iconCenterX, iconCenterY, 1, 0, Math.PI * 2);
      ctx.fill();
    } else if (legendItems[item].icon === 'mountain') {
      // Mountain: triangle
      ctx.beginPath();
      ctx.moveTo(iconCenterX - 2.5, iconCenterY + 2);
      ctx.lineTo(iconCenterX, iconCenterY - 2.5);
      ctx.lineTo(iconCenterX + 2.5, iconCenterY + 2);
      ctx.closePath();
      ctx.stroke();
    } else if (legendItems[item].icon === 'forest') {
      // Forest: tree shape
      ctx.beginPath();
      ctx.moveTo(iconCenterX, iconCenterY - 2.5);
      ctx.lineTo(iconCenterX - 2, iconCenterY + 1);
      ctx.lineTo(iconCenterX + 2, iconCenterY + 1);
      ctx.closePath();
      ctx.fill();
    } else if (legendItems[item].icon === 'road') {
      // Road: dashed line
      ctx.lineWidth = 1.2;
      ctx.setLineDash([2, 1.5]);
      ctx.beginPath();
      ctx.moveTo(iconCenterX - 2.5, iconCenterY);
      ctx.lineTo(iconCenterX + 2.5, iconCenterY);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (legendItems[item].icon === 'river') {
      // River: wavy line
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(iconCenterX - 2, iconCenterY + 1);
      for (var px = -2; px <= 2; px += 0.5) {
        var wy = iconCenterY + 1 + Math.sin(px * 0.5) * 1;
        ctx.lineTo(iconCenterX + px, wy);
      }
      ctx.stroke();
    }

    // Label in serif font
    ctx.font = '8px Palatino, Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = inkColor;
    ctx.globalAlpha = 0.8;
    ctx.fillText(legendItems[item].label, labelStartX, itemY + 5);
  }

  ctx.globalAlpha = 1.0;
};

// ============================================================================
// SEA SERPENT — detailed undulating body with head detail, tail fin, body segments
// ============================================================================
var fmRenderSeaSerpent = function(ctx) {
  var dark = FMap.dark;
  var inkColor = dark ? '#a89070' : '#1a1005';
  var cols = FMap.grid.cols;
  var rows = FMap.grid.rows;

  // Find largest ocean area
  var bestX = -1, bestY = -1, bestCount = 0;
  var scanStep = 25;

  for (var row = scanStep; row < rows - scanStep; row += scanStep) {
    for (var col = scanStep; col < cols - scanStep; col += scanStep) {
      var waterCount = 0;
      for (var dr = -scanStep; dr <= scanStep; dr += 5) {
        for (var dc = -scanStep; dc <= scanStep; dc += 5) {
          var r2 = row + dr, c2 = col + dc;
          if (r2 >= 0 && r2 < rows && c2 >= 0 && c2 < cols) {
            var cell = FMap.grid.cells[r2 * cols + c2];
            if (cell && cell.isWater) waterCount++;
          }
        }
      }
      if (waterCount > bestCount) {
        bestCount = waterCount;
        bestX = col;
        bestY = row;
      }
    }
  }

  // Need lots of open water
  if (bestCount < 80) return;

  var sp = fmCellToScreen(bestX, bestY);
  var cx = sp.x;
  var cy = sp.y;

  ctx.strokeStyle = inkColor;
  ctx.fillStyle = inkColor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Simple elegant serpent — 3 humps emerging from water
  ctx.lineWidth = 1.8;
  ctx.globalAlpha = 0.4;

  // Body: smooth S-curve with 3 humps
  ctx.beginPath();
  ctx.moveTo(cx - 35, cy);
  ctx.bezierCurveTo(cx - 20, cy - 12, cx - 10, cy - 14, cx, cy - 4);
  ctx.bezierCurveTo(cx + 10, cy + 6, cx + 20, cy - 10, cx + 30, cy - 3);
  ctx.bezierCurveTo(cx + 38, cy + 4, cx + 45, cy - 6, cx + 55, cy);
  ctx.stroke();

  // Small head at start
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx - 38, cy, 3, 0, Math.PI * 2);
  ctx.stroke();
  // Eye dot
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.arc(cx - 39, cy - 1, 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Tail flick at end
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(cx + 55, cy);
  ctx.quadraticCurveTo(cx + 62, cy - 5, cx + 65, cy - 8);
  ctx.stroke();

  ctx.globalAlpha = 1.0;
};

// End of Fantasy Map Engine UI/Decoration Rendering Layer
// ============================================================================



// === 18. MASTER RENDER FUNCTION ===
function fmRenderWorldMap() {
  // Detect dark mode
  var docEl = document.documentElement;
  if (docEl && docEl.classList) {
    FMap.dark = docEl.classList.contains('dark') || docEl.classList.contains('dark-mode');
  }

  // Ensure canvas is available
  if (!FMap.canvas) {
    FMap.canvas = document.getElementById('fantasyMapCanvas') || document.getElementById('mapCanvas');
    if (!FMap.canvas) return;
  }
  FMap.ctx = FMap.canvas.getContext('2d');

  // Set canvas dimensions
  FMap.canvas.width = FMap.W;
  FMap.canvas.height = FMap.H;

  // Calculate map bounds (margins: 55px top/left/right, 50px bottom)
  FMap.mapBounds = {
    x: 55,
    y: 55,
    w: FMap.W - 110,
    h: FMap.H - 105
  };

  var ctx = FMap.ctx;

  // Reset seed for reproducible random in render
  fmSeed(FMap.seed);

  // 1. Parchment background
  fmRenderParchment(ctx, FMap.W, FMap.H, FMap.dark);

  // 2. Decorative border
  fmRenderBorder(ctx, FMap.W, FMap.H, FMap.dark);

  // 3. Terrain tints (subtle washes, not colored blocks)
  fmRenderTerrain(ctx);

  // 3a. Ocean rendering — waves, stippling, and water texture detail
  fmRenderOcean(ctx);

  // 3b. Relief shading (subtle 3D hillshading effect)
  fmRenderReliefShading(ctx);

  // 3b. Coastal glow — warm diffuse light around land edges (like C# reference)
  fmRenderCoastalGlow(ctx);

  // 4. Water textures (wave lines, stipple dots)
  fmRenderWater(ctx);

  // 5. Coastline hatching (parallel lines)
  fmRenderCoastlines(ctx);

  // 6. Rivers
  fmRenderRivers(ctx);

  // 7. Mountains (individual peak illustrations)
  fmRenderMountains(ctx);

  // 8. Forests (individual tree symbols)
  fmRenderForests(ctx);

  // 8b. Terrain features (desert stipple, swamp marks)
  fmRenderTerrainFeatures(ctx);

  // 9. Kingdom borders (subtle dashed lines)
  fmRenderKingdomBorders(ctx);

  // 10. Roads (dotted/dashed paths)
  fmRenderRoads(ctx);

  // 11. Settlement icons
  fmRenderSettlements(ctx);

  // 12. POI icons
  fmRenderPOIs(ctx);

  // 13. Feature labels (kingdom names, geographic features)
  fmRenderFeatureLabels(ctx);

  // 14. Compass rose (bottom-left area, larger and more ornate)
  fmRenderCompass(ctx, 120, FMap.H - 120, 65);

  // 15. Title cartouche (top center)
  fmRenderCartouche(ctx, FMap.W / 2, 32, FMap.world.name || 'Unnamed World', 'Here be Dragons & Ancient Realms');

  // 16. Scale bar (bottom-center-left)
  fmRenderScaleBar(ctx, 200, FMap.H - 50, '100 leagues');

  // 17. Legend (bottom-right)
  fmRenderLegend(ctx, FMap.W - 155, FMap.H - 310);

  // 18. Tolkien-esque sea serpent decoration in ocean areas
  fmRenderSeaSerpent(ctx);
}


// === PART 4: ZOOM SYSTEM, KINGDOM VIEW, CITY VIEW, INTERACTION HANDLERS, USER INPUT UI ===

// ============================================================================
// 1. KINGDOM ZOOM VIEW
// ============================================================================

function fmRenderKingdomMap(kingdomId) {
  if (!FMap.world.kingdoms) return;

  var kingdom = FMap.world.kingdoms.find(function(k) { return k.id === kingdomId; });
  if (!kingdom) return;

  // Ensure canvas
  if (!FMap.canvas) {
    FMap.canvas = document.getElementById('fantasyMapCanvas') || document.getElementById('mapCanvas');
    if (!FMap.canvas) return;
  }
  FMap.ctx = FMap.canvas.getContext('2d');

  // Kingdom cells are cell objects with .row and .col
  var cells = kingdom.cells || [];
  if (cells.length === 0) return;

  // Extract kingdom bounding box from cell objects
  var minRow = Infinity, maxRow = -Infinity;
  var minCol = Infinity, maxCol = -Infinity;

  for (var i = 0; i < cells.length; i++) {
    var c = cells[i];
    if (c.row < minRow) minRow = c.row;
    if (c.row > maxRow) maxRow = c.row;
    if (c.col < minCol) minCol = c.col;
    if (c.col > maxCol) maxCol = c.col;
  }

  // Add padding around kingdom
  var padding = 10;
  minRow = Math.max(0, minRow - padding);
  maxRow = Math.min(FMap.grid.rows - 1, maxRow + padding);
  minCol = Math.max(0, minCol - padding);
  maxCol = Math.min(FMap.grid.cols - 1, maxCol + padding);

  var kingdomColSpan = maxCol - minCol + 1;
  var kingdomRowSpan = maxRow - minRow + 1;

  FMap.level = 'kingdom';
  FMap.view.currentKingdom = kingdomId;

  // Set up mapBounds so existing render functions zoom into this region.
  // The render functions map col 0..grid.cols to b.x .. b.x+b.w.
  // We need col=minCol to map to the left margin and col=maxCol to the right margin.
  var marginX = 55, marginY = 55;
  var drawW = FMap.W - 2 * marginX;
  var drawH = FMap.H - marginY - 50;

  // b.x + (minCol / grid.cols) * b.w = marginX
  // b.x + (maxCol / grid.cols) * b.w = marginX + drawW
  // Solving: b.w = drawW * grid.cols / kingdomColSpan
  var bw = drawW * FMap.grid.cols / kingdomColSpan;
  var bx = marginX - (minCol / FMap.grid.cols) * bw;

  var bh = drawH * FMap.grid.rows / kingdomRowSpan;
  var by = marginY - (minRow / FMap.grid.rows) * bh;

  FMap.mapBounds = { x: bx, y: by, w: bw, h: bh };

  // Render using the same pipeline as world view, clipped to canvas
  var ctx = FMap.ctx;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, FMap.W, FMap.H);
  ctx.clip();

  // Parchment background & border
  fmRenderParchment(ctx, FMap.W, FMap.H, FMap.dark);
  fmRenderBorder(ctx, FMap.W, FMap.H, FMap.dark);

  // Full render pipeline (same order as world view for consistency)
  fmRenderTerrain(ctx);
  if (typeof fmRenderReliefShading === 'function') fmRenderReliefShading(ctx);
  if (typeof fmRenderCoastalGlow === 'function') fmRenderCoastalGlow(ctx);
  if (typeof fmRenderWater === 'function') fmRenderWater(ctx);
  fmRenderCoastlines(ctx);
  fmRenderRivers(ctx);
  fmRenderMountains(ctx);
  fmRenderForests(ctx);
  if (typeof fmRenderTerrainFeatures === 'function') fmRenderTerrainFeatures(ctx);
  fmRenderKingdomBorders(ctx);
  fmRenderRoads(ctx);
  fmRenderSettlements(ctx);
  fmRenderPOIs(ctx);
  fmRenderFeatureLabels(ctx);

  ctx.restore();

  // Kingdom title cartouche
  fmDrawKingdomCartouche(ctx, kingdom);

  // Compass in lower-left
  fmRenderCompass(ctx, 60, FMap.H - 80, 40);

  // Scale bar
  fmRenderScaleBar(ctx, FMap.W - 180, FMap.H - 40, kingdomColSpan + ' leagues');
}

function fmDrawKingdomCartouche(ctx, kingdom) {
  const x = FMap.W / 2;
  const y = 30;
  const w = 300;
  const h = 50;

  // Draw cartouche background
  ctx.fillStyle = FMap.dark ? 'rgba(80, 40, 20, 0.9)' : 'rgba(220, 200, 160, 0.9)';
  ctx.strokeStyle = FMap.dark ? '#d4af37' : '#8b6914';
  ctx.lineWidth = 2;
  fmDrawRoundRect(ctx, x - w / 2, y, w, h, 5);
  ctx.fill();
  ctx.stroke();

  // Text
  ctx.font = 'bold 16px Cinzel';
  ctx.fillStyle = FMap.dark ? '#d4af37' : '#8b2e00';
  ctx.textAlign = 'center';
  ctx.fillText(kingdom.name, x, y + 18);

  ctx.font = '12px Cinzel';
  ctx.fillStyle = FMap.dark ? '#d4af37' : '#6b4423';
  ctx.fillText(`Ruler: ${kingdom.ruler || 'Unknown'}`, x, y + 33);
}

// ============================================================================
// 2. CITY ZOOM VIEW
// ============================================================================

function fmRenderCityMap(cityObj) {
  if (!cityObj) return;

  FMap.level = 'city';
  FMap.view.currentCity = cityObj;

  // Ensure canvas
  if (!FMap.canvas) {
    FMap.canvas = document.getElementById('fantasyMapCanvas') || document.getElementById('mapCanvas');
    if (!FMap.canvas) return;
  }
  var ctx = FMap.canvas.getContext('2d');

  // Clear canvas
  ctx.fillStyle = '#90b880';
  ctx.fillRect(0, 0, FMap.W, FMap.H);

  // Generate city layout
  const cityLayout = fmGenerateCityLayout(cityObj);

  // Draw city walls
  fmDrawCityWalls(ctx, cityLayout);

  // Draw districts
  fmDrawCityDistricts(ctx, cityLayout);

  // Draw streets
  fmDrawCityStreets(ctx, cityLayout);

  // Draw landmarks
  const landmarks = fmDrawCityLandmarks(ctx, cityLayout);

  // Draw surrounding countryside
  fmDrawCityCountryside(ctx, cityLayout);

  // Draw city name cartouche
  fmDrawCityCartouche(ctx, cityObj);

  // Store landmark positions for interaction
  FMap.view.cityLandmarks = landmarks;
}

function fmGenerateCityLayout(cityObj) {
  const centerX = FMap.W / 2;
  const centerY = FMap.H / 2;

  // Determine city size based on population
  let radiusBase = 80;
  if (cityObj.population > 100000) radiusBase = 150;
  else if (cityObj.population > 50000) radiusBase = 120;
  else if (cityObj.population > 20000) radiusBase = 100;
  else if (cityObj.population > 5000) radiusBase = 80;
  else if (cityObj.population > 1000) radiusBase = 60;
  else radiusBase = 40;

  const numDistricts = cityObj.type === 'capital' ? 7 :
                       cityObj.type === 'city' ? 5 :
                       cityObj.type === 'town' ? 3 : 2;

  const hasWalls = cityObj.type !== 'hamlet';
  const hasHarbor = cityObj.isCoastal;
  const hasRiver = cityObj.isRiver;

  return {
    centerX, centerY,
    radiusBase,
    numDistricts,
    hasWalls,
    hasHarbor,
    hasRiver,
    cityType: cityObj.type,
    gateAngles: [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2],
    districts: []
  };
}

function fmDrawCityWalls(ctx, layout) {
  if (!layout.hasWalls) return;

  ctx.strokeStyle = '#3d3d3d';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(layout.centerX, layout.centerY, layout.radiusBase, 0, 2 * Math.PI);
  ctx.stroke();

  // Gate towers
  ctx.fillStyle = '#2a2a2a';
  layout.gateAngles.forEach(angle => {
    const gateX = layout.centerX + Math.cos(angle) * layout.radiusBase;
    const gateY = layout.centerY + Math.sin(angle) * layout.radiusBase;
    ctx.fillRect(gateX - 8, gateY - 8, 16, 16);
  });
}

function fmDrawCityDistricts(ctx, layout) {
  const anglePerDistrict = (2 * Math.PI) / layout.numDistricts;
  const districtRadius = layout.radiusBase * 0.75;

  const colors = [
    '#d4a574', // Noble quarter
    '#c9a961', // Market
    '#d4a574', // Temple
    '#b8956a', // Harbor
    '#a89968', // Residential
    '#8b7355', // Slums
    '#a0826d'  // Military
  ];

  for (let i = 0; i < layout.numDistricts; i++) {
    const startAngle = i * anglePerDistrict;
    const endAngle = (i + 1) * anglePerDistrict;

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(layout.centerX, layout.centerY);
    ctx.arc(layout.centerX, layout.centerY, districtRadius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();

    layout.districts.push({
      angle: startAngle + anglePerDistrict / 2,
      radius: districtRadius,
      index: i
    });
  }
}

function fmDrawCityStreets(ctx, layout) {
  ctx.strokeStyle = '#c4b8a8';
  ctx.lineWidth = 3;

  // Radial streets
  layout.districts.forEach(district => {
    const startX = layout.centerX;
    const startY = layout.centerY;
    const endX = layout.centerX + Math.cos(district.angle) * layout.radiusBase;
    const endY = layout.centerY + Math.sin(district.angle) * layout.radiusBase;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  });

  // Ring roads
  ctx.strokeStyle = '#c4b8a8';
  ctx.lineWidth = 2;
  for (let r = 0.3; r < 1; r += 0.35) {
    const radius = layout.radiusBase * r;
    ctx.beginPath();
    ctx.arc(layout.centerX, layout.centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
}

function fmDrawCityLandmarks(ctx, layout) {
  const landmarks = [];

  // Central castle/keep for capitals
  if (layout.cityType === 'capital') {
    const castleX = layout.centerX;
    const castleY = layout.centerY;
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(castleX - 15, castleY - 15, 30, 30);
    ctx.strokeStyle = '#5c2e0a';
    ctx.lineWidth = 2;
    ctx.strokeRect(castleX - 15, castleY - 15, 30, 30);
    landmarks.push({
      x: castleX, y: castleY,
      name: 'Castle',
      type: 'castle',
      radius: 20
    });
  }

  // Market square
  const marketAngle = 0;
  const marketDist = layout.radiusBase * 0.4;
  const marketX = layout.centerX + Math.cos(marketAngle) * marketDist;
  const marketY = layout.centerY + Math.sin(marketAngle) * marketDist;

  ctx.fillStyle = '#d4af37';
  ctx.fillRect(marketX - 12, marketY - 12, 24, 24);
  ctx.strokeStyle = '#8b6914';
  ctx.lineWidth = 1;
  ctx.strokeRect(marketX - 12, marketY - 12, 24, 24);
  // Draw stall symbols
  for (let i = 0; i < 4; i++) {
    const sx = marketX - 8 + (i % 2) * 8;
    const sy = marketY - 8 + Math.floor(i / 2) * 8;
    ctx.fillRect(sx, sy, 4, 4);
  }

  landmarks.push({
    x: marketX, y: marketY,
    name: 'Market Square',
    type: 'market',
    radius: 18
  });

  // Temple
  const templeAngle = Math.PI / 2;
  const templeDist = layout.radiusBase * 0.5;
  const templeX = layout.centerX + Math.cos(templeAngle) * templeDist;
  const templeY = layout.centerY + Math.sin(templeAngle) * templeDist;

  ctx.fillStyle = '#d4af37';
  ctx.beginPath();
  ctx.moveTo(templeX, templeY - 15);
  ctx.lineTo(templeX + 10, templeY + 10);
  ctx.lineTo(templeX - 10, templeY + 10);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#8b6914';
  ctx.lineWidth = 2;
  ctx.stroke();

  landmarks.push({
    x: templeX, y: templeY,
    name: 'Temple',
    type: 'temple',
    radius: 18
  });

  // Tavern
  const tavernAngle = Math.PI;
  const tavernDist = layout.radiusBase * 0.45;
  const tavernX = layout.centerX + Math.cos(tavernAngle) * tavernDist;
  const tavernY = layout.centerY + Math.sin(tavernAngle) * tavernDist;

  ctx.fillStyle = '#8b4513';
  ctx.fillRect(tavernX - 10, tavernY - 10, 20, 20);
  ctx.fillStyle = '#d4af37';
  ctx.fillRect(tavernX - 8, tavernY - 8, 16, 16);

  landmarks.push({
    x: tavernX, y: tavernY,
    name: 'Tavern',
    type: 'tavern',
    radius: 18
  });

  // Barracks (if military district exists)
  if (layout.numDistricts >= 7) {
    const barracksAngle = 3 * Math.PI / 2;
    const barracksDist = layout.radiusBase * 0.45;
    const barracksX = layout.centerX + Math.cos(barracksAngle) * barracksDist;
    const barracksY = layout.centerY + Math.sin(barracksAngle) * barracksDist;

    ctx.fillStyle = '#666666';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(barracksX - 12 + i * 6, barracksY - 8, 4, 8);
    }

    landmarks.push({
      x: barracksX, y: barracksY,
      name: 'Barracks',
      type: 'barracks',
      radius: 18
    });
  }

  return landmarks;
}

function fmDrawCityCountryside(ctx, layout) {
  ctx.globalAlpha = 0.3;

  // Draw farms/fields outside walls
  const farmRadius = layout.radiusBase + 60;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * 2 * Math.PI;
    const farmX = layout.centerX + Math.cos(angle) * farmRadius;
    const farmY = layout.centerY + Math.sin(angle) * farmRadius;

    ctx.fillStyle = '#90b880';
    ctx.fillRect(farmX - 20, farmY - 20, 40, 40);

    // Field pattern
    ctx.strokeStyle = '#6b8e5f';
    ctx.lineWidth = 1;
    for (let row = -1; row <= 1; row++) {
      ctx.beginPath();
      ctx.moveTo(farmX - 20, farmY - 20 + (row + 1) * 20);
      ctx.lineTo(farmX + 20, farmY - 20 + (row + 1) * 20);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1.0;
}

function fmDrawCityCartouche(ctx, cityObj) {
  const x = FMap.W / 2;
  const y = 30;
  const w = 280;
  const h = 60;

  ctx.fillStyle = FMap.dark ? 'rgba(80, 40, 20, 0.9)' : 'rgba(220, 200, 160, 0.9)';
  ctx.strokeStyle = FMap.dark ? '#d4af37' : '#8b6914';
  ctx.lineWidth = 2;
  fmDrawRoundRect(ctx, x - w / 2, y, w, h, 5);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 16px Cinzel';
  ctx.fillStyle = FMap.dark ? '#d4af37' : '#8b2e00';
  ctx.textAlign = 'center';
  ctx.fillText(cityObj.name, x, y + 18);

  ctx.font = '11px Cinzel';
  ctx.fillStyle = FMap.dark ? '#d4af37' : '#6b4423';
  ctx.fillText(`${cityObj.type} (Pop: ~${cityObj.population})`, x, y + 34);
  ctx.fillText(`Ruler: ${cityObj.ruler || 'Unknown'}`, x, y + 48);
}

// ============================================================================
// 3. INTERACTION SYSTEM
// ============================================================================

function fmSetupInteraction() {
  if (!FMap.canvas) return;

  // Tooltip element
  let tooltip = document.getElementById('mapTooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'mapTooltip';
    tooltip.style.cssText = `
      position: fixed;
      display: none;
      background: var(--bg-card);
      border: 2px solid var(--border);
      border-radius: 6px;
      padding: 8px 12px;
      font-family: Cinzel, serif;
      font-size: 12px;
      color: var(--text);
      z-index: 1000;
      pointer-events: none;
      white-space: nowrap;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(tooltip);
  }

  // Mouse move handler
  FMap.canvas.addEventListener('mousemove', (e) => {
    const rect = FMap.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert to grid coords
    const gridCoords = fmScreenToGridCoords(mouseX, mouseY);
    if (!gridCoords) {
      tooltip.style.display = 'none';
      return;
    }

    let hoveredEntity = null;
    let tooltipText = '';
    let isClickable = false;

    if (FMap.level === 'world') {
      // Check kingdoms via cell's kingdomId
      var cell = FMap.grid.cells[gridCoords.cellId];
      if (cell && cell.kingdomId !== null && cell.kingdomId !== undefined) {
        var kingdom = (FMap.world.kingdoms || []).find(function(k) { return k.id === cell.kingdomId; });
        if (kingdom) {
          hoveredEntity = { type: 'kingdom', data: kingdom };
          tooltipText = kingdom.name + ' - Click to zoom in';
          isClickable = true;
        }
      }

      // Check settlements
      if (!hoveredEntity && FMap.world.cities) {
        for (let city of FMap.world.cities) {
          const dx = city.col - gridCoords.col;
          const dy = city.row - gridCoords.row;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 2) { // ~20px radius
            hoveredEntity = { type: 'settlement', data: city };
            tooltipText = `${city.name} (${city.type}, Pop ~${city.population})`;
            isClickable = true;
            break;
          }
        }
      }
    } else if (FMap.level === 'kingdom') {
      // Check settlements
      if (FMap.world.cities) {
        for (let city of FMap.world.cities) {
          if (city.kingdomId === FMap.view.currentKingdom) {
            const screenPos = fmCellToScreen(city.col, city.row);
            const dx = screenPos.x - mouseX;
            const dy = screenPos.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 25) {
              hoveredEntity = { type: 'settlement', data: city };
              tooltipText = `${city.name} - Click to enter`;
              isClickable = true;
              break;
            }
          }
        }
      }

      // Check POIs
      if (!hoveredEntity && FMap.world.pois) {
        for (let poi of FMap.world.pois) {
          if (poi.kingdomId === FMap.view.currentKingdom) {
            const screenPos = fmCellToScreen(poi.col, poi.row);
            const dx = screenPos.x - mouseX;
            const dy = screenPos.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 20) {
              hoveredEntity = { type: 'poi', data: poi };
              tooltipText = `${poi.name} (${poi.type}) - Click for details`;
              isClickable = true;
              break;
            }
          }
        }
      }
    } else if (FMap.level === 'city') {
      // Check landmarks
      if (FMap.view.cityLandmarks) {
        for (let landmark of FMap.view.cityLandmarks) {
          const dx = landmark.x - mouseX;
          const dy = landmark.y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < landmark.radius) {
            hoveredEntity = { type: 'landmark', data: landmark };
            tooltipText = `${landmark.name} - Click for details`;
            isClickable = true;
            break;
          }
        }
      }
    }

    FMap.view.hoveredEntity = hoveredEntity;
    FMap.canvas.style.cursor = isClickable ? 'pointer' : 'default';

    if (hoveredEntity && tooltipText) {
      tooltip.textContent = tooltipText;
      tooltip.style.display = 'block';
      tooltip.style.left = (e.clientX + 10) + 'px';
      tooltip.style.top = (e.clientY + 10) + 'px';
    } else {
      tooltip.style.display = 'none';
    }
  });

  // Click handler
  FMap.canvas.addEventListener('click', (e) => {
    if (!FMap.view.hoveredEntity) return;

    const entity = FMap.view.hoveredEntity;

    if (entity.type === 'kingdom') {
      fmRenderKingdomMap(entity.data.id);
      fmUpdateBreadcrumb();
      fmUpdateInfoPanel();
    } else if (entity.type === 'settlement') {
      fmRenderCityMap(entity.data);
      fmUpdateBreadcrumb();
      fmUpdateInfoPanel();
    } else if (entity.type === 'poi') {
      fmShowPOIDetail(entity.data);
    } else if (entity.type === 'landmark') {
      fmShowLandmarkDetail(entity.data);
    }
  });

  // Context menu handler
  FMap.canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    if (!FMap.view.hoveredEntity) {
      // Show "add POI here" option
      const rect = FMap.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const gridCoords = fmScreenToGridCoords(mouseX, mouseY);
      if (gridCoords) {
        fmShowContextMenu(e.clientX, e.clientY, 'empty', { row: gridCoords.row, col: gridCoords.col });
      }
    } else {
      fmShowContextMenu(e.clientX, e.clientY, FMap.view.hoveredEntity.type, FMap.view.hoveredEntity.data);
    }
  });

  // Canvas resize listener
  window.addEventListener('resize', () => {
    if (FMap.level === 'world') {
      fmRenderWorldMap();
    } else if (FMap.level === 'kingdom') {
      fmRenderKingdomMap(FMap.view.currentKingdom);
    } else if (FMap.level === 'city') {
      fmRenderCityMap(FMap.view.currentCity);
    }
  });
}

function fmScreenToGridCoords(screenX, screenY) {
  var b = FMap.mapBounds;
  if (!b || b.w === 0 || b.h === 0) return null;

  // Both world and kingdom views use mapBounds to map grid to screen:
  // screenX = b.x + (col / grid.cols) * b.w  →  col = (screenX - b.x) / b.w * grid.cols
  var col, row;

  if (FMap.level === 'world' || FMap.level === 'kingdom') {
    col = Math.floor((screenX - b.x) / b.w * FMap.grid.cols);
    row = Math.floor((screenY - b.y) / b.h * FMap.grid.rows);
  } else {
    return null; // City view doesn't use grid coords
  }

  if (col < 0 || col >= FMap.grid.cols || row < 0 || row >= FMap.grid.rows) {
    return null;
  }

  var cellId = row * FMap.grid.cols + col;
  return { col: col, row: row, cellId: cellId };
}

// ============================================================================
// 4. CONTEXT MENU
// ============================================================================

function fmShowContextMenu(x, y, entityType, entityData) {
  // Remove existing menu
  const existingMenu = document.getElementById('mapContextMenu');
  if (existingMenu) existingMenu.remove();

  const menu = document.createElement('div');
  menu.id = 'mapContextMenu';
  menu.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: 6px;
    min-width: 150px;
    z-index: 1100;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  `;

  const options = [];

  if (entityType === 'settlement' || entityType === 'poi') {
    options.push({ label: 'Rename', action: () => fmShowEditPanel(entityData.id, entityData.name) });
    options.push({ label: 'Add Note', action: () => fmShowNotePanel(entityData.id) });
  }

  if (entityType === 'empty') {
    options.push({ label: 'Add POI Here', action: () => fmAddUserPOI(entityData.row, entityData.col) });
  }

  options.push({ label: 'Close', action: () => menu.remove() });

  options.forEach(opt => {
    const item = document.createElement('div');
    item.style.cssText = `
      padding: 8px 12px;
      cursor: pointer;
      border-bottom: 1px solid var(--border);
      font-family: Cinzel, serif;
      font-size: 12px;
      color: var(--text);
    `;
    item.textContent = opt.label;
    item.addEventListener('mouseover', () => {
      item.style.background = 'var(--accent)';
      item.style.color = '#fff';
    });
    item.addEventListener('mouseout', () => {
      item.style.background = '';
      item.style.color = 'var(--text)';
    });
    item.addEventListener('click', () => {
      opt.action();
      menu.remove();
    });
    menu.appendChild(item);
  });

  document.body.appendChild(menu);

  // Close menu on outside click
  const closeMenu = () => {
    menu.remove();
    document.removeEventListener('click', closeMenu);
  };
  setTimeout(() => document.addEventListener('click', closeMenu), 100);
}

// ============================================================================
// 5. BREADCRUMB NAVIGATION
// ============================================================================

function fmUpdateBreadcrumb() {
  const breadcrumb = document.getElementById('mapBreadcrumb');
  if (!breadcrumb) return;

  let html = '';

  if (FMap.level === 'world') {
    html = `<span style="color: crimson; font-weight: bold;">${fmEscapeHtml(FMap.world.name || 'World')}</span>`;
  } else if (FMap.level === 'kingdom') {
    const kingdom = FMap.world.kingdoms.find(k => k.id === FMap.view.currentKingdom);
    if (kingdom) {
      html = `
        <span style="cursor: pointer; color: var(--text);" onclick="fmRenderWorldMap(); fmUpdateBreadcrumb(); fmUpdateInfoPanel();">
          ${fmEscapeHtml(FMap.world.name || 'World')}
        </span>
        <span style="margin: 0 6px;">></span>
        <span style="color: crimson; font-weight: bold;">${fmEscapeHtml(kingdom.name)}</span>
      `;
    }
  } else if (FMap.level === 'city') {
    const kingdom = FMap.world.kingdoms.find(k => k.id === FMap.view.currentCity.kingdomId);
    const city = FMap.view.currentCity;
    if (kingdom && city) {
      html = `
        <span style="cursor: pointer; color: var(--text);" onclick="fmRenderWorldMap(); fmUpdateBreadcrumb(); fmUpdateInfoPanel();">
          ${fmEscapeHtml(FMap.world.name || 'World')}
        </span>
        <span style="margin: 0 6px;">></span>
        <span style="cursor: pointer; color: var(--text);" onclick="fmRenderKingdomMap('${kingdom.id}'); fmUpdateBreadcrumb(); fmUpdateInfoPanel();">
          ${fmEscapeHtml(kingdom.name)}
        </span>
        <span style="margin: 0 6px;">></span>
        <span style="color: crimson; font-weight: bold;">${fmEscapeHtml(city.name)}</span>
      `;
    }
  }

  breadcrumb.innerHTML = html;
}

// ============================================================================
// 6. INFO PANEL
// ============================================================================

function fmUpdateInfoPanel() {
  const panel = document.getElementById('mapInfoPanel');
  if (!panel) return;

  let html = '';

  if (FMap.level === 'world') {
    html = fmBuildWorldInfoPanel();
  } else if (FMap.level === 'kingdom') {
    const kingdom = FMap.world.kingdoms.find(k => k.id === FMap.view.currentKingdom);
    if (kingdom) {
      html = fmBuildKingdomInfoPanel(kingdom);
    }
  } else if (FMap.level === 'city') {
    const city = FMap.view.currentCity;
    if (city) {
      html = fmBuildCityInfoPanel(city);
    }
  }

  panel.innerHTML = html;
}

function fmBuildWorldInfoPanel() {
  let html = `
    <h3>${fmEscapeHtml(FMap.world.name || 'World')}</h3>
    <p>Total Kingdoms: ${FMap.world.kingdoms.length}</p>
    <p>Total Settlements: ${FMap.world.cities.length}</p>

    <h4>Kingdoms</h4>
    <ul style="font-size: 12px; max-height: 200px; overflow-y: auto;">
  `;

  FMap.world.kingdoms.forEach(k => {
    const capital = k.capital ? FMap.world.cities.find(c => c.id === k.capital) : null;
    html += `
      <li style="cursor: pointer; margin: 4px 0;" onclick="fmRenderKingdomMap('${k.id}'); fmUpdateBreadcrumb(); fmUpdateInfoPanel();">
        <strong>${fmEscapeHtml(k.name)}</strong> - Ruler: ${fmEscapeHtml(k.ruler || 'Unknown')}
        ${capital ? `<br/>Capital: ${fmEscapeHtml(capital.name)}` : ''}
      </li>
    `;
  });

  html += '</ul>';
  return html;
}

function fmBuildKingdomInfoPanel(kingdom) {
  const cities = FMap.world.cities.filter(c => c.kingdomId === kingdom.id);
  const pois = FMap.world.pois.filter(p => p.kingdomId === kingdom.id);

  let html = `
    <h3>${fmEscapeHtml(kingdom.name)}</h3>
    <p><strong>Ruler:</strong> ${fmEscapeHtml(kingdom.ruler || 'Unknown')}</p>
    <p><strong>Culture:</strong> ${fmEscapeHtml(kingdom.culture || 'Unknown')}</p>
    <p><strong>Settlements:</strong> ${cities.length}</p>

    <h4>Cities & Towns</h4>
    <ul style="font-size: 11px; max-height: 150px; overflow-y: auto;">
  `;

  cities.forEach(city => {
    html += `
      <li style="cursor: pointer; margin: 3px 0;" onclick="fmRenderCityMap({...${JSON.stringify(city)}}); fmUpdateBreadcrumb(); fmUpdateInfoPanel();">
        <strong>${fmEscapeHtml(city.name)}</strong> (${fmEscapeHtml(city.type)}, Pop ~${city.population})
      </li>
    `;
  });

  html += `</ul>`;

  if (pois.length > 0) {
    html += `<h4>Points of Interest</h4><ul style="font-size: 11px;">`;
    pois.slice(0, 5).forEach(poi => {
      html += `<li>${fmEscapeHtml(poi.name)} (${fmEscapeHtml(poi.type)})</li>`;
    });
    if (pois.length > 5) {
      html += `<li><em>...and ${pois.length - 5} more</em></li>`;
    }
    html += `</ul>`;
  }

  return html;
}

function fmBuildCityInfoPanel(city) {
  const pois = FMap.world.pois.filter(p => p.nearestSettlement === city.id);

  let html = `
    <h3>${fmEscapeHtml(city.name)}</h3>
    <p><strong>Type:</strong> ${fmEscapeHtml(city.type)}</p>
    <p><strong>Population:</strong> ~${city.population}</p>
    <p><strong>Ruler:</strong> ${fmEscapeHtml(city.ruler || 'Unknown')}</p>

    <h4>Notable Landmarks</h4>
    <ul style="font-size: 11px;">
      <li>Market Square</li>
      <li>Temple</li>
      <li>Tavern</li>
      ${city.type === 'capital' ? '<li>Castle</li>' : ''}
      ${city.isCoastal ? '<li>Harbor & Docks</li>' : ''}
    </ul>

    ${pois.length > 0 ? `
    <h4>Nearby POIs</h4>
    <ul style="font-size: 11px;">
      ${pois.slice(0, 3).map(p => `<li>${fmEscapeHtml(p.name)} (${fmEscapeHtml(p.type)})</li>`).join('')}
    </ul>
    ` : ''}
  `;

  return html;
}

// ============================================================================
// 7. POI & LANDMARK DETAIL PANELS
// ============================================================================

function fmShowPOIDetail(poi) {
  fmShowDetailPanel('POI', fmEscapeHtml(poi.name), `
    <p><strong>Type:</strong> ${fmEscapeHtml(poi.type)}</p>
    <p><strong>Difficulty:</strong> Level ${poi.difficulty || '?'}</p>
    <p><strong>Description:</strong> ${fmEscapeHtml(poi.description || 'No description available.')}</p>
    <p><strong>Loot:</strong> ${fmEscapeHtml(poi.loot || 'Unknown')}</p>
    <p><strong>Nearest Settlement:</strong> ${fmEscapeHtml(fmGetCityName(poi.nearestSettlement))}</p>
  `);
}

function fmShowLandmarkDetail(landmark) {
  fmShowDetailPanel('Landmark', fmEscapeHtml(landmark.name), `
    <p><strong>Type:</strong> ${fmEscapeHtml(landmark.type)}</p>
    <p><strong>Part of:</strong> ${fmEscapeHtml(FMap.view.currentCity.name)}</p>
    <p>A notable location in the city.</p>
  `);
}

function fmShowDetailPanel(title, name, content) {
  let panel = document.getElementById('mapDetailPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'mapDetailPanel';
    panel.style.cssText = `
      position: fixed;
      right: 0;
      top: 0;
      width: 300px;
      height: 100vh;
      background: var(--bg-card);
      border-left: 2px solid var(--border);
      padding: 20px;
      overflow-y: auto;
      z-index: 800;
      box-shadow: -4px 0 8px rgba(0,0,0,0.2);
      font-family: 'Segoe UI', sans-serif;
      font-size: 13px;
    `;
    document.body.appendChild(panel);
  }

  panel.innerHTML = `
    <button onclick="document.getElementById('mapDetailPanel').style.display='none';" style="float:right; background:none; border:none; font-size:18px; cursor:pointer;">×</button>
    <h2 style="margin-top:0; color:var(--accent);">${fmEscapeHtml(title)}</h2>
    <h3 style="color:var(--text);">${fmEscapeHtml(name)}</h3>
    ${content}
  `;
  panel.style.display = 'block';
}

function fmGetCityName(cityId) {
  if (!cityId) return 'Unknown';
  const city = FMap.world.cities.find(c => c.id === cityId);
  return city ? city.name : 'Unknown';
}

// ============================================================================
// 8. USER CUSTOMIZATION PANELS
// ============================================================================

function fmShowEditPanel(entityId, currentName) {
  const modal = fmCreateModal('Edit Entity', `
    <label style="display:block; margin-bottom:8px;">
      <strong>Rename:</strong><br/>
      <input type="text" id="editNameInput" value="${fmEscapeHtml(currentName)}" style="width:100%; padding:6px; box-sizing:border-box; margin-top:4px;">
    </label>
    <label style="display:block; margin-bottom:12px;">
      <strong>Notes:</strong><br/>
      <textarea id="editNoteInput" style="width:100%; height:80px; padding:6px; box-sizing:border-box; margin-top:4px; resize:vertical;"></textarea>
    </label>
    <button data-entity-id="${fmEscapeHtml(entityId)}" class="fmSaveEditBtn" style="padding:8px 16px; background:var(--accent); color:#fff; border:none; border-radius:4px; cursor:pointer; margin-right:8px;">Save</button>
    <button onclick="this.closest('.mapModal').remove();" style="padding:8px 16px; background:#999; color:#fff; border:none; border-radius:4px; cursor:pointer;">Cancel</button>
  `);

  // Load existing note if available
  if (FMap.userEdits.notes[entityId]) {
    document.getElementById('editNoteInput').value = FMap.userEdits.notes[entityId];
  }

  // Attach event listener to save button
  setTimeout(() => {
    const saveBtn = modal.querySelector('.fmSaveEditBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        fmSaveEntityEdit(entityId);
        this.closest('.mapModal').remove();
      });
    }
  }, 0);
}

function fmShowNotePanel(entityId) {
  const modal = fmCreateModal('Add Note', `
    <textarea id="noteInput" placeholder="Add a note..." style="width:100%; height:100px; padding:6px; box-sizing:border-box; resize:vertical;"></textarea><br/><br/>
    <button data-entity-id="${fmEscapeHtml(entityId)}" class="fmSaveNoteBtn" style="padding:8px 16px; background:var(--accent); color:#fff; border:none; border-radius:4px; cursor:pointer; margin-right:8px;">Save Note</button>
    <button onclick="this.closest('.mapModal').remove();" style="padding:8px 16px; background:#999; color:#fff; border:none; border-radius:4px; cursor:pointer;">Cancel</button>
  `);

  if (FMap.userEdits.notes[entityId]) {
    document.getElementById('noteInput').value = FMap.userEdits.notes[entityId];
  }

  setTimeout(() => document.getElementById('noteInput').focus(), 100);

  // Attach event listener to save button
  setTimeout(() => {
    const saveBtn = modal.querySelector('.fmSaveNoteBtn');
    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        fmSaveEntityNote(entityId);
        this.closest('.mapModal').remove();
      });
    }
  }, 0);
}

function fmAddUserPOI(row, col) {
  const modal = fmCreateModal('Add POI', `
    <label style="display:block; margin-bottom:8px;">
      <strong>Name:</strong><br/>
      <input type="text" id="poiNameInput" placeholder="POI Name" style="width:100%; padding:6px; box-sizing:border-box; margin-top:4px;">
    </label>
    <label style="display:block; margin-bottom:8px;">
      <strong>Type:</strong><br/>
      <select id="poiTypeInput" style="width:100%; padding:6px; box-sizing:border-box; margin-top:4px;">
        <option>Dungeon</option>
        <option>Tower</option>
        <option>Shrine</option>
        <option>Ruins</option>
        <option>Monster Lair</option>
        <option>Mine</option>
        <option>Temple</option>
        <option>Other</option>
      </select>
    </label>
    <label style="display:block; margin-bottom:12px;">
      <strong>Description:</strong><br/>
      <textarea id="poiDescInput" placeholder="Description..." style="width:100%; height:80px; padding:6px; box-sizing:border-box; margin-top:4px; resize:vertical;"></textarea>
    </label>
    <button onclick="fmSaveUserPOI(${row}, ${col}); this.closest('.mapModal').remove();" style="padding:8px 16px; background:var(--accent); color:#fff; border:none; border-radius:4px; cursor:pointer; margin-right:8px;">Add POI</button>
    <button onclick="this.closest('.mapModal').remove();" style="padding:8px 16px; background:#999; color:#fff; border:none; border-radius:4px; cursor:pointer;">Cancel</button>
  `);

  setTimeout(() => document.getElementById('poiNameInput').focus(), 100);
}

function fmCreateModal(title, content) {
  const backdrop = document.createElement('div');
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 2000;
  `;
  backdrop.onclick = (e) => {
    if (e.target === backdrop) backdrop.remove();
  };

  const modal = document.createElement('div');
  modal.className = 'mapModal';
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: 8px;
    padding: 20px;
    min-width: 300px;
    max-width: 500px;
    z-index: 2001;
    font-family: 'Segoe UI', sans-serif;
    font-size: 13px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  `;

  modal.innerHTML = `
    <h2 style="margin-top:0; color:var(--accent);">${fmEscapeHtml(title)}</h2>
    ${content}
  `;

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  return modal;
}

function fmSaveEntityEdit(entityId) {
  const newName = document.getElementById('editNameInput').value;
  const note = document.getElementById('editNoteInput').value;

  if (newName) {
    FMap.userEdits.renamedEntities[entityId] = newName;
  }
  if (note) {
    FMap.userEdits.notes[entityId] = note;
  }

  fmSaveEdits();

  // Refresh current view
  if (FMap.level === 'kingdom') {
    fmRenderKingdomMap(FMap.view.currentKingdom);
  } else if (FMap.level === 'city') {
    fmRenderCityMap(FMap.view.currentCity);
  }
  fmUpdateInfoPanel();
}

function fmSaveEntityNote(entityId) {
  const note = document.getElementById('noteInput').value;
  if (note) {
    FMap.userEdits.notes[entityId] = note;
    fmSaveEdits();
  }
}

function fmSaveUserPOI(row, col) {
  const name = document.getElementById('poiNameInput').value;
  const type = document.getElementById('poiTypeInput').value;
  const description = document.getElementById('poiDescInput').value;

  if (!name) {
    alert('Please enter a name for the POI');
    return;
  }

  const poiId = 'user_' + Date.now();
  const newPOI = {
    id: poiId,
    name: name,
    type: type,
    description: description,
    row: row,
    col: col,
    level: 1,
    difficulty: 1,
    loot: 'Unknown',
    nearestSettlement: null,
    kingdomId: FMap.view.currentKingdom
  };

  FMap.world.pois.push(newPOI);
  FMap.userEdits.addedPOIs.push(poiId);
  fmSaveEdits();

  if (FMap.level === 'kingdom') {
    fmRenderKingdomMap(FMap.view.currentKingdom);
  }
}

function fmDeletePOI(poiId) {
  if (confirm('Remove this POI?')) {
    FMap.world.pois = FMap.world.pois.filter(p => p.id !== poiId);
    FMap.userEdits.removedPOIs.push(poiId);
    fmSaveEdits();

    if (FMap.level === 'kingdom') {
      fmRenderKingdomMap(FMap.view.currentKingdom);
    } else if (FMap.level === 'city') {
      fmRenderCityMap(FMap.view.currentCity);
    }

    const detail = document.getElementById('mapDetailPanel');
    if (detail) detail.style.display = 'none';
  }
}

// ============================================================================
// 9. SAVE/LOAD USER EDITS
// ============================================================================

function fmSaveEdits() {
  const editsJSON = JSON.stringify(FMap.userEdits);
  localStorage.setItem('fmap_user_edits', editsJSON);
}

function fmLoadEdits() {
  const stored = localStorage.getItem('fmap_user_edits');
  if (stored) {
    try {
      FMap.userEdits = JSON.parse(stored);

      // Apply renames
      Object.keys(FMap.userEdits.renamedEntities).forEach(id => {
        const city = FMap.world.cities.find(c => c.id === id);
        if (city) city.name = FMap.userEdits.renamedEntities[id];

        const poi = FMap.world.pois.find(p => p.id === id);
        if (poi) poi.name = FMap.userEdits.renamedEntities[id];
      });

      // Restore user-added POIs
      FMap.userEdits.addedPOIs.forEach(poiId => {
        // POIs should already be in the world from a previous session
        // If they're not, they were deleted
      });

      // Remove deleted POIs
      FMap.world.pois = FMap.world.pois.filter(p =>
        !FMap.userEdits.removedPOIs.includes(p.id)
      );
    } catch (e) {
      console.error('Failed to load user edits:', e);
    }
  }
}

// ============================================================================
// 10. DOWNLOAD FUNCTION
// ============================================================================

function fmDownloadMap() {
  const canvas = FMap.canvas;
  const link = document.createElement('a');

  let filename = 'fantasy-map';
  if (FMap.level === 'kingdom') {
    const kingdom = FMap.world.kingdoms.find(k => k.id === FMap.view.currentKingdom);
    if (kingdom) filename = `map-${kingdom.name.replace(/\s+/g, '-')}`;
  } else if (FMap.level === 'city') {
    if (FMap.view.currentCity) {
      filename = `map-${FMap.view.currentCity.name.replace(/\s+/g, '-')}`;
    }
  } else {
    filename = `map-${FMap.world.name.replace(/\s+/g, '-')}`;
  }

  link.href = canvas.toDataURL('image/png');
  link.download = filename + '.png';
  link.click();
}

// ============================================================================
// 11. HELPER UTILITIES
// ============================================================================

function fmDrawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fmDrawParchmentBackground(ctx) {
  // Subtle parchment texture
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#8b6f47';
  for (let i = 0; i < FMap.W; i += 50) {
    for (let j = 0; j < FMap.H; j += 50) {
      ctx.fillRect(i + Math.random() * 10 - 5, j + Math.random() * 10 - 5, 20, 20);
    }
  }
  ctx.restore();
}

function fmDrawCompass(ctx, x, y) {
  const radius = 25;

  // Circle
  ctx.fillStyle = FMap.dark ? 'rgba(255, 215, 0, 0.3)' : 'rgba(139, 110, 50, 0.3)';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = FMap.dark ? '#d4af37' : '#8b6e32';
  ctx.lineWidth = 1;
  ctx.stroke();

  // N, S, E, W
  ctx.font = 'bold 10px Cinzel';
  ctx.fillStyle = FMap.dark ? '#d4af37' : '#8b6e32';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillText('N', x, y - radius + 8);
  ctx.fillText('S', x, y + radius - 8);
  ctx.fillText('E', x + radius - 8, y);
  ctx.fillText('W', x - radius + 8, y);

  // Center dot
  ctx.fillStyle = FMap.dark ? '#d4af37' : '#8b6e32';
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, 2 * Math.PI);
  ctx.fill();
}

function fmDrawScaleBar(ctx, x, y, distance) {
  const barWidth = 50;

  ctx.strokeStyle = FMap.dark ? '#d4af37' : '#8b6e32';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + barWidth, y);
  ctx.stroke();

  // End caps
  ctx.beginPath();
  ctx.moveTo(x, y - 5);
  ctx.lineTo(x, y + 5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + barWidth, y - 5);
  ctx.lineTo(x + barWidth, y + 5);
  ctx.stroke();

  // Label
  ctx.font = '10px Cinzel';
  ctx.fillStyle = FMap.dark ? '#d4af37' : '#8b6e32';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(`~${Math.round(distance / 10)}km`, x + barWidth / 2, y + 8);
}

// ============================================================================
// 12. MASTER ENTRY POINT
// ============================================================================

function generateFantasyWorld() {
  // Read options from DOM
  const mapSizeSelect = document.getElementById('mapSize');
  const terrainSelect = document.getElementById('terrainType');
  const nameStyleSelect = document.getElementById('nameStyle');

  const options = {
    size: mapSizeSelect ? mapSizeSelect.value : 'large',
    terrainType: terrainSelect ? terrainSelect.value : 'varied',
    nameStyle: nameStyleSelect ? nameStyleSelect.value : 'fantasy'
  };

  // Check theme
  FMap.dark = document.body.classList.contains('dark') ||
              (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Get canvas
  FMap.canvas = document.getElementById('fantasyMapCanvas') || document.getElementById('mapCanvas');
  if (!FMap.canvas) {
    console.error('Canvas element not found');
    return;
  }

  // Set canvas dimensions
  const container = FMap.canvas.parentElement;
  if (container) {
    FMap.W = container.clientWidth || 1400;
    FMap.H = container.clientHeight || 1000;
  } else {
    FMap.W = 1400;
    FMap.H = 1000;
  }

  FMap.canvas.width = FMap.W;
  FMap.canvas.height = FMap.H;

  // Set random seed
  FMap.seed = Math.floor(Math.random() * 2147483647) + 1;
  options.seed = FMap.seed;

  // Generate world
  fmGenerateWorld(options);
  fmBuildWorld();
  fmRenderWorldMap();
  fmSetupInteraction();
  fmUpdateBreadcrumb();
  fmUpdateInfoPanel();

  // Show canvas container
  var mapContainer = document.getElementById('mapCanvasContainer') || document.getElementById('mapContainer');
  if (mapContainer) mapContainer.style.display = 'block';

  // Load user edits
  fmLoadEdits();
}

function mapZoomTo(level) {
  if (level === 'world') {
    fmRenderWorldMap();
  } else if (level === 'kingdom' && FMap.view.currentKingdom) {
    fmRenderKingdomMap(FMap.view.currentKingdom);
  } else if (level === 'city' && FMap.view.currentCity) {
    fmRenderCityMap(FMap.view.currentCity);
  }
  fmUpdateBreadcrumb();
  fmUpdateInfoPanel();
}

function downloadCurrentMap() {
  fmDownloadMap();
}

// ============================================================================
// 13. LEGACY SHIMS FOR BACKWARD COMPATIBILITY
// ============================================================================

var currentMapScale = 'world';

function switchMapScale() {
  // Legacy function - kept for compatibility
}

function generateCurrentMap() {
  generateFantasyWorld();
}

var worldMapData = null;

function showOtherMapGen(type) {
  // Legacy function - show other map generation options if needed
  console.log('Map generation type:', type);
}

// === END PART 4: INTERACTION & UI ===
