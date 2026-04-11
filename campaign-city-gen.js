// ═══════════════════════════════════════════════════════════════════════════
// PROCEDURAL CAPITAL CITY MAP GENERATOR
// Generates SVG city maps + interactive metadata for capital cities
// ═══════════════════════════════════════════════════════════════════════════
(function() {
"use strict";

// ─── Seeded RNG (mulberry32) ────────────────────────────────────────────
function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function hashSeed(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function seededRng(name, seed) {
  return mulberry32(hashSeed(name + "-" + seed));
}

// ─── Utility functions ──────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }
function dist(x1, y1, x2, y2) { return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function shuffle(arr, rng) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(rng() * (i + 1));
    var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr;
}
function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
function randRange(lo, hi, rng) { return lo + rng() * (hi - lo); }
function randInt(lo, hi, rng) { return Math.floor(randRange(lo, hi + 1, rng)); }

function smoothPolygon(pts, passes, blend) {
  var p = pts.slice();
  for (var pass = 0; pass < passes; pass++) {
    var n = [];
    for (var i = 0; i < p.length; i++) {
      var prev = p[(i - 1 + p.length) % p.length];
      var curr = p[i];
      var next = p[(i + 1) % p.length];
      n.push([
        curr[0] + blend * ((prev[0] + next[0]) / 2 - curr[0]),
        curr[1] + blend * ((prev[1] + next[1]) / 2 - curr[1])
      ]);
    }
    p = n;
  }
  return p;
}

function pointInPolygon(px, py, poly) {
  var inside = false;
  for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    var xi = poly[i][0], yi = poly[i][1];
    var xj = poly[j][0], yj = poly[j][1];
    if (((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi + 1e-12) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

function polygonPath(pts) {
  if (!pts.length) return "";
  var d = "M " + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
  for (var i = 1; i < pts.length; i++) {
    d += " L " + pts[i][0].toFixed(1) + " " + pts[i][1].toFixed(1);
  }
  return d + " Z";
}

function polylinePath(pts) {
  if (!pts.length) return "";
  var d = "M " + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
  for (var i = 1; i < pts.length; i++) {
    d += " L " + pts[i][0].toFixed(1) + " " + pts[i][1].toFixed(1);
  }
  return d;
}

// Smooth curve through points (Catmull-Rom → cubic bezier)
function smoothCurvePath(pts, closed) {
  if (pts.length < 2) return "";
  if (pts.length === 2) return polylinePath(pts);
  var d = "M " + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
  for (var i = 0; i < pts.length - 1; i++) {
    var p0 = pts[Math.max(0, i - 1)];
    var p1 = pts[i];
    var p2 = pts[Math.min(pts.length - 1, i + 1)];
    var p3 = pts[Math.min(pts.length - 1, i + 2)];
    var cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    var cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    var cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    var cp2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += " C " + cp1x.toFixed(1) + " " + cp1y.toFixed(1) + "," +
         cp2x.toFixed(1) + " " + cp2y.toFixed(1) + "," +
         p2[0].toFixed(1) + " " + p2[1].toFixed(1);
  }
  if (closed) d += " Z";
  return d;
}

// Offset a line by a perpendicular distance
function offsetPolyline(pts, distance) {
  var result = [];
  for (var i = 0; i < pts.length; i++) {
    var prev = i === 0 ? pts[pts.length - 1] : pts[i - 1];
    var curr = pts[i];
    var next = i === pts.length - 1 ? pts[0] : pts[i + 1];

    var dx1 = curr[0] - prev[0], dy1 = curr[1] - prev[1];
    var len1 = Math.sqrt(dx1*dx1 + dy1*dy1);
    var px1 = len1 > 0 ? -dy1 / len1 : 0, py1 = len1 > 0 ? dx1 / len1 : 0;

    var dx2 = next[0] - curr[0], dy2 = next[1] - curr[1];
    var len2 = Math.sqrt(dx2*dx2 + dy2*dy2);
    var px2 = len2 > 0 ? -dy2 / len2 : 0, py2 = len2 > 0 ? dx2 / len2 : 0;

    var px = (px1 + px2) / 2, py = (py1 + py2) / 2;
    var len = Math.sqrt(px*px + py*py);
    if (len > 0.001) {
      px = px / len * distance;
      py = py / len * distance;
    }
    result.push([curr[0] + px, curr[1] + py]);
  }
  return result;
}

// ─── Spatial Hash for collision detection ────────────────────────────────
function SpatialHash(w, h, cellSize) {
  this.cell = cellSize || 40;
  this.cols = Math.ceil(w / this.cell);
  this.rows = Math.ceil(h / this.cell);
  this.grid = {};
}
SpatialHash.prototype.insert = function(x, y, w, h, pad) {
  pad = pad || 0;
  var x0 = Math.max(0, Math.floor((x - pad) / this.cell));
  var y0 = Math.max(0, Math.floor((y - pad) / this.cell));
  var x1 = Math.min(this.cols - 1, Math.floor((x + w + pad) / this.cell));
  var y1 = Math.min(this.rows - 1, Math.floor((y + h + pad) / this.cell));
  for (var cy = y0; cy <= y1; cy++) {
    for (var cx = x0; cx <= x1; cx++) {
      var key = cx + "," + cy;
      if (!this.grid[key]) this.grid[key] = [];
      this.grid[key].push([x, y, x + w, y + h]);
    }
  }
};
SpatialHash.prototype.collides = function(x, y, w, h, pad) {
  pad = pad || 0;
  var ax = x - pad, ay = y - pad, ax2 = x + w + pad, ay2 = y + h + pad;
  var x0 = Math.max(0, Math.floor(ax / this.cell));
  var y0 = Math.max(0, Math.floor(ay / this.cell));
  var x1 = Math.min(this.cols - 1, Math.floor(ax2 / this.cell));
  var y1 = Math.min(this.rows - 1, Math.floor(ay2 / this.cell));
  for (var cy = y0; cy <= y1; cy++) {
    for (var cx = x0; cx <= x1; cx++) {
      var rects = this.grid[cx + "," + cy];
      if (rects) {
        for (var i = 0; i < rects.length; i++) {
          var r = rects[i];
          if (!(ax2 < r[0] || r[2] < ax || ay2 < r[1] || r[3] < ay)) return true;
        }
      }
    }
  }
  return false;
};


// ═══════════════════════════════════════════════════════════════════════════
// CITY GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

var CW = 4800, CH = 3600; // capital canvas size

// District definitions (IMPROVED: larger buildings, lower gaps, higher density)
var DISTRICTS = {
  noble:       { bw:[40,80], bh:[36,70], gap:6, roofs:["#6b3a3a","#5a2e2e","#7a4545","#4e2828","#8a5050","#3d2020"], walls:["#c8b898","#b8a888","#d8c8a8","#a89878","#e0d0b0"], density:0.96, compound:0.45 },
  temple:      { bw:[36,70], bh:[30,60], gap:8, roofs:["#8a7a5a","#7a6a4a","#9a8a6a","#6a5a3a","#a89a7a","#5a4a2a"], walls:["#d8d0c0","#c8c0b0","#e0d8c8","#b8b0a0","#e8e0d0"], density:0.94, compound:0.35 },
  market:      { bw:[28,55], bh:[24,48], gap:3, roofs:["#8a6040","#7a5030","#9a7050","#6a4020","#a88060","#5a3010"], walls:["#c8b898","#b8a888","#d0c0a0","#a89878","#c0b090"], density:0.98, compound:0.25 },
  residential: { bw:[20,44], bh:[20,40], gap:2, roofs:["#8a6a4a","#7a5a3a","#9a7a5a","#6a4a2a","#a08a6a","#5a3a1a"], walls:["#c0b090","#b0a080","#d0c0a0","#a09070","#b8a888"], density:0.98, compound:0.16 },
  poor:        { bw:[14,32], bh:[14,28], gap:1, roofs:["#6a6050","#5a5040","#7a7060","#4a4030","#8a8070","#3a3020"], walls:["#a09880","#908870","#b0a890","#807860","#988870"], density:0.99, compound:0.06 },
  docks:       { bw:[30,72], bh:[22,48], gap:4, roofs:["#7a6a50","#6a5a40","#8a7a60","#5a4a30","#9a8a70","#4a3a20"], walls:["#b0a890","#a09880","#c0b8a0","#908870","#b8b098"], density:0.96, compound:0.20 }
};

// District layouts for capitals
var CAPITAL_DISTRICTS = ["noble","temple","market","residential","residential","poor","docks","residential"];

// Color palettes
var PAL = {
  ground:  "#e8dcc0",
  grass:   "#c8d8a0",
  road:    "#c0b498",
  roadEdge:"#a09070",
  water:   "#7aacc8",
  waterDk: "#5a8ca8",
  waterLt: "#a0cce8",
  wall:    "#706050",
  wallLt:  "#908070",
  wallDk:  "#50403a",
  crenl:   "#605040",
  tower:   "#605040",
  gate:    "#807060",
  tree:    "#6a9a50",
  treeDk:  "#4a7a30",
  shadow:  "rgba(0,0,0,0.08)",
  plaza:   "#d8cca8",
  field1:  "#b8c890",
  field2:  "#c8d8a0",
  field3:  "#a8b880",
  // District ground colors (subtle variations)
  districtNoble:     "#e4d8b8",
  districtTemple:    "#dcd8c8",
  districtMarket:    "#e0d0b0",
  districtResidential:"#e2d6be",
  districtPoor:      "#d0c8a8",
  districtDocks:     "#d4d0c0"
};

// ─── WALL GENERATION ────────────────────────────────────────────────────
function generateWall(cx, cy, baseR, numVerts, numGates, rng) {
  // Pick wall shape
  var shapes = ["circular","oval","organic","star"];
  var shapeType = pick(shapes, rng);
  var pts = [];
  var aspect = shapeType === "oval" ? randRange(1.2, 1.55, rng) : 1;
  var starBastions = shapeType === "star" ? randInt(4, 6, rng) : 0;
  var ovalAngle = rng() * Math.PI;

  for (var i = 0; i < numVerts; i++) {
    var a = (i / numVerts) * Math.PI * 2;
    var r = baseR;

    if (shapeType === "oval") {
      var ca = Math.cos(a - ovalAngle), sa = Math.sin(a - ovalAngle);
      r = baseR / Math.sqrt(ca * ca + (sa * sa) / (aspect * aspect));
    } else if (shapeType === "organic") {
      r += baseR * (rng() * 0.25 - 0.125);
      r += baseR * 0.08 * Math.sin(a * 3 + rng() * 6);
      r += baseR * 0.05 * Math.sin(a * 7 + rng() * 6);
    } else if (shapeType === "star") {
      var bastionPhase = rng() * Math.PI * 2;
      for (var b = 0; b < starBastions; b++) {
        var ba = bastionPhase + (b / starBastions) * Math.PI * 2;
        var da = Math.abs(((a - ba + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        if (da < 0.35) r += baseR * 0.12 * (1 - da / 0.35);
      }
    }

    // General jitter
    r += baseR * (rng() * 0.06 - 0.03);
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }

  // Subdivide and smooth
  var subdiv = [];
  for (var i = 0; i < pts.length; i++) {
    var next = pts[(i + 1) % pts.length];
    subdiv.push(pts[i]);
    subdiv.push([(pts[i][0] + next[0]) / 2, (pts[i][1] + next[1]) / 2]);
  }
  pts = smoothPolygon(subdiv, 3, 0.28);

  // Gates: evenly spaced with slight randomization
  var gates = [];
  var gateAngles = [];
  for (var g = 0; g < numGates; g++) {
    var targetAngle = (g / numGates) * Math.PI * 2 + (rng() * 0.3 - 0.15);
    gateAngles.push(targetAngle);
    // Find closest wall vertex to this angle
    var bestIdx = 0, bestDist = Infinity;
    for (var i = 0; i < pts.length; i++) {
      var pa = Math.atan2(pts[i][1] - cy, pts[i][0] - cx);
      var diff = Math.abs(((pa - targetAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (diff < bestDist) { bestDist = diff; bestIdx = i; }
    }
    gates.push({ x: pts[bestIdx][0], y: pts[bestIdx][1], angle: targetAngle, idx: bestIdx });
  }

  // Inner wall for capital (noble quarter)
  var innerR = baseR * 0.30;
  var innerPts = [];
  var innerVerts = Math.floor(numVerts * 0.5);
  for (var i = 0; i < innerVerts; i++) {
    var a = (i / innerVerts) * Math.PI * 2;
    var r = innerR + innerR * (rng() * 0.08 - 0.04);
    innerPts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  innerPts = smoothPolygon(innerPts, 2, 0.3);

  // Towers along outer wall (every ~8 vertices)
  var towers = [];
  var towerSpacing = Math.max(4, Math.floor(pts.length / 20));
  for (var i = 0; i < pts.length; i += towerSpacing) {
    towers.push({ x: pts[i][0], y: pts[i][1] });
  }

  return {
    vertices: pts,
    gates: gates,
    gateAngles: gateAngles,
    towers: towers,
    innerVertices: innerPts,
    shapeType: shapeType,
    baseR: baseR
  };
}


// ─── ROAD NETWORK ───────────────────────────────────────────────────────
function generateRoads(cx, cy, wall, rng) {
  var roads = [];
  var gates = wall.gates;
  var baseR = wall.baseR;

  // Helper: get wall radius at angle
  function wallRadiusAt(angle) {
    var best = Infinity, bestR = baseR;
    for (var i = 0; i < wall.vertices.length; i++) {
      var pa = Math.atan2(wall.vertices[i][1] - cy, wall.vertices[i][0] - cx);
      var diff = Math.abs(((pa - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      if (diff < best) {
        best = diff;
        bestR = dist(cx, cy, wall.vertices[i][0], wall.vertices[i][1]);
      }
    }
    return bestR;
  }

  // 1. Main arteries: gate → center with organic S-curves
  for (var g = 0; g < gates.length; g++) {
    var gate = gates[g];
    var pts = [];
    var steps = 12;
    for (var s = 0; s <= steps; s++) {
      var t = s / steps;
      var px = lerp(gate.x, cx, t);
      var py = lerp(gate.y, cy, t);
      // Add organic wander with s-curve effect
      var perp = gate.angle + Math.PI / 2;
      var wander = Math.sin(t * Math.PI * 1.8 + rng() * 3) * baseR * 0.025 * (1 - t);
      px += Math.cos(perp) * wander;
      py += Math.sin(perp) * wander;
      pts.push([px, py]);
    }
    roads.push({ points: pts, width: 46, type: "main" });
  }

  // 2. Ring roads at various radii with more irregular spacing
  var ringFracs = [0.25, 0.42, 0.60, 0.78, 0.92];
  for (var ri = 0; ri < ringFracs.length; ri++) {
    var frac = ringFracs[ri];
    var pts = [];
    var ringSegs = 48;
    for (var s = 0; s <= ringSegs; s++) {
      var a = (s / ringSegs) * Math.PI * 2;
      var wr = wallRadiusAt(a);
      var r = wr * frac + (rng() * 6 - 3); // increased variance
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    pts = smoothPolygon(pts, 4, 0.3);
    pts.push(pts[0].slice()); // close loop
    roads.push({ points: pts, width: ri < 2 ? 22 : 14, type: ri < 2 ? "secondary" : "connector" });
  }

  // 3. Secondary radials between main arteries
  var numSecondary = randInt(6, 12, rng);
  for (var s = 0; s < numSecondary; s++) {
    var angle = rng() * Math.PI * 2;
    var innerFrac = randRange(0.15, 0.4, rng);
    var outerFrac = randRange(0.65, 0.95, rng);
    var wr = wallRadiusAt(angle);
    var pts = [];
    var steps = 8;
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var r = lerp(wr * innerFrac, wr * outerFrac, t);
      var wander = Math.sin(t * Math.PI * 3 + rng() * 6) * baseR * 0.015;
      var a = angle + wander / r;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    roads.push({ points: pts, width: 10, type: "connector" });
  }

  // 4. Side streets (short connections between rings) with dead-ends & cul-de-sacs
  var numSide = randInt(20, 40, rng);
  for (var s = 0; s < numSide; s++) {
    var angle = rng() * Math.PI * 2;
    var r1 = wallRadiusAt(angle) * randRange(0.2, 0.85, rng);
    var r2 = r1 + randRange(30, 80, rng);

    // Sometimes create dead-ends (don't reach outer ring)
    if (rng() < 0.3) r2 = r1 + randRange(20, 50, rng);

    var pts = [
      [cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1],
      [cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2]
    ];
    roads.push({ points: pts, width: 6, type: "lane" });
  }

  return roads;
}


// ─── RIVER GENERATION ───────────────────────────────────────────────────
function generateRiver(cx, cy, W, H, wall, rng) {
  // River flows through city with gentle natural meanders (NOT sine waves)
  var horizontal = rng() > 0.5;
  var offset = (rng() * 0.2 - 0.1); // slight offset from center
  var pts = [];
  var steps = 30;

  // Use Perlin-like noise via accumulated random walk for natural curves
  // Key: LOW frequency (0.5-0.8 bends across canvas), moderate amplitude
  var phase1 = rng() * Math.PI * 2;
  var phase2 = rng() * Math.PI * 2;
  var freq1 = 0.4 + rng() * 0.4; // 0.4-0.8 bends — gentle S-curve
  var freq2 = 0.8 + rng() * 0.6; // secondary wobble
  var amp1 = 0.07 + rng() * 0.04; // main meander amplitude
  var amp2 = 0.015 + rng() * 0.01; // subtle secondary wobble

  if (horizontal) {
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var x = t * W;
      var y = cy + offset * H;
      y += Math.sin(t * Math.PI * freq1 * 2 + phase1) * H * amp1;
      y += Math.sin(t * Math.PI * freq2 * 2 + phase2) * H * amp2;
      pts.push([x, y]);
    }
  } else {
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var y = t * H;
      var x = cx + offset * W;
      x += Math.sin(t * Math.PI * freq1 * 2 + phase1) * W * amp1;
      x += Math.sin(t * Math.PI * freq2 * 2 + phase2) * W * amp2;
      pts.push([x, y]);
    }
  }

  var riverWidth = randRange(55, 85, rng);

  // Add tributary/fork chance (30%)
  var hasTributary = rng() < 0.3;
  var tribPts = null;
  if (hasTributary && pts.length > 5) {
    var forkIdx = Math.floor(pts.length * randRange(0.3, 0.65, rng));
    var forkAngle = (horizontal ? -Math.PI/2 : Math.PI) + (rng() * 0.8 - 0.4);
    tribPts = [];
    var tribLen = randInt(8, 14, rng);
    for (var i = 0; i < tribLen; i++) {
      var t = i / tribLen;
      var d = t * Math.min(W, H) * 0.2;
      var wobble = Math.sin(t * Math.PI * 1.5) * 20;
      tribPts.push([
        pts[forkIdx][0] + Math.cos(forkAngle) * d + Math.cos(forkAngle + Math.PI/2) * wobble,
        pts[forkIdx][1] + Math.sin(forkAngle) * d + Math.sin(forkAngle + Math.PI/2) * wobble
      ]);
    }
  }

  return { points: pts, width: riverWidth, horizontal: horizontal, offset: offset, tributary: tribPts };
}


// ─── DISTRICT ASSIGNMENT ────────────────────────────────────────────────
function buildDistrictSectors(cx, cy, river, marketAngle, rng) {
  var districts = CAPITAL_DISTRICTS.slice();
  var numSectors = districts.length;
  var sliceSize = (Math.PI * 2) / numSectors;

  // Start with market district aligned to market angle
  var marketIdx = districts.indexOf("market");
  var rotation = marketAngle - (marketIdx + 0.5) * sliceSize;

  // If river exists, align docks near river
  if (river) {
    var riverAngle = river.horizontal
      ? (river.offset > 0 ? Math.PI / 2 : -Math.PI / 2)
      : (river.offset > 0 ? 0 : Math.PI);
    var docksIdx = districts.indexOf("docks");
    if (docksIdx >= 0) {
      // Find which sector is closest to river angle and swap docks there
      var bestSlot = 0, bestDiff = Infinity;
      for (var i = 0; i < numSectors; i++) {
        var slotAngle = rotation + (i + 0.5) * sliceSize;
        var diff = Math.abs(((slotAngle - riverAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        if (diff < bestDiff && i !== 0) { // don't put docks in noble slot
          bestDiff = diff; bestSlot = i;
        }
      }
      // Swap
      var temp = districts[bestSlot];
      districts[bestSlot] = districts[docksIdx];
      districts[docksIdx] = temp;
    }
  }

  // Build sector boundaries with jitter
  var sectors = [];
  for (var i = 0; i < numSectors; i++) {
    var boundary = rotation + (i + 1) * sliceSize + (rng() * 0.15 - 0.075);
    // Normalize to -PI..PI
    boundary = ((boundary + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    sectors.push({ boundary: boundary, district: districts[i] });
  }
  // Sort by boundary
  sectors.sort(function(a, b) { return a.boundary - b.boundary; });

  return sectors;
}

function getDistrict(px, py, cx, cy, sectors) {
  var a = Math.atan2(py - cy, px - cx);
  for (var i = 0; i < sectors.length; i++) {
    if (a < sectors[i].boundary) return sectors[i].district;
  }
  return sectors[sectors.length - 1].district;
}


// ─── BUILDING PLACEMENT ─────────────────────────────────────────────────

var SHOP_NAMES = [
  "Blacksmith","Armorer","Herbalist","Alchemist","Tailor","Jeweler","Baker",
  "Butcher","Carpenter","Cobbler","Tanner","Weaver","Brewer","Chandler",
  "Scribe","Cartographer","Apothecary","Furrier","Glassblower","Potter",
  "Bookbinder","Artificer","Enchanter","Bowyer","Fletcher","Stonemason",
  "Wheelwright","Cooper","Dyer","Fishmonger","Mercer","Haberdasher"
];
var TAVERN_NAMES = [
  "The Golden Griffin","The Drunken Dragon","The Rusty Sword","The Sleeping Giant",
  "The Prancing Pony","The Silver Stag","The Broken Crown","The Iron Flagon",
  "The Wanderer's Rest","The Red Lantern","The Blue Boar","The Black Wolf",
  "The Lucky Dice","The Velvet Rose","The Copper Kettle","The Fallen Knight"
];
var SPECIAL_BUILDINGS = {
  castle:     { w: 260, h: 200, name: "Castle", icon: "castle" },
  cathedral:  { w: 80, h: 60,  name: "Cathedral", icon: "cathedral" },
  mageTower:  { w: 45, h: 45,  name: "Mage Tower", icon: "tower" },
  barracks:   { w: 65, h: 50,  name: "Barracks", icon: "barracks" },
  guildhall:  { w: 55, h: 45,  name: "Guildhall", icon: "guildhall" },
  marketHall: { w: 70, h: 55,  name: "Grand Market Hall", icon: "market" },
  townHall:   { w: 55, h: 45,  name: "Town Hall", icon: "townhall" },
  prison:     { w: 50, h: 40,  name: "Prison", icon: "prison" },
  library:    { w: 50, h: 40,  name: "Library", icon: "library" },
  arena:      { w: 90, h: 70,  name: "Arena", icon: "arena" }
};
var POI_TYPES = [
  "Well","Statue","Fountain","Notice Board","Shrine","Guard Post","Stable",
  "Graveyard","Training Ground","Watchtower","Garden","Warehouse","Granary",
  "Windmill","Bathhouse","Clocktower","Memorial","Brewery","Lumber Yard"
];


function placeBuildings(cx, cy, wall, roads, river, sectors, hash, rng) {
  var buildings = [];
  var innerWall = wall.innerVertices;
  var usedShopNames = {};
  var usedTavernNames = {};

  function isInsideWall(px, py) {
    return pointInPolygon(px, py, wall.vertices);
  }
  function isInsideInner(px, py) {
    return innerWall.length > 0 && pointInPolygon(px, py, innerWall);
  }
  function isInRiver(px, py) {
    if (!river) return false;
    for (var i = 0; i < river.points.length - 1; i++) {
      var p1 = river.points[i], p2 = river.points[i + 1];
      var dx = p2[0] - p1[0], dy = p2[1] - p1[1];
      var len = Math.sqrt(dx * dx + dy * dy);
      if (len < 1) continue;
      var t = clamp(((px - p1[0]) * dx + (py - p1[1]) * dy) / (len * len), 0, 1);
      var nx = p1[0] + t * dx - px, ny = p1[1] + t * dy - py;
      if (Math.sqrt(nx * nx + ny * ny) < river.width * 0.6) return true;
    }
    return false;
  }

  function tryPlace(x, y, w, h, pad) {
    if (hash.collides(x, y, w, h, pad || 2)) return false;
    if (!isInsideWall(x + w / 2, y + h / 2)) return false;
    if (isInRiver(x + w / 2, y + h / 2)) return false;
    return true;
  }

  // 1. Castle at center
  var castle = SPECIAL_BUILDINGS.castle;
  var castleX = cx - castle.w / 2, castleY = cy - castle.h / 2;
  buildings.push({
    x: castleX, y: castleY, w: castle.w, h: castle.h,
    type: "special", name: castle.name, icon: castle.icon,
    district: "noble", roofColor: "#5a3030", wallColor: "#a09080",
    shape: "castle"
  });
  hash.insert(castleX, castleY, castle.w, castle.h, 20);

  // 2. Special buildings placed in appropriate districts
  var specials = [
    { key: "cathedral", district: "temple" },
    { key: "mageTower", district: "noble" },
    { key: "barracks", district: "noble" },
    { key: "guildhall", district: "market" },
    { key: "marketHall", district: "market" },
    { key: "townHall", district: "noble" },
    { key: "prison", district: "poor" },
    { key: "library", district: "temple" },
    { key: "arena", district: "residential" }
  ];

  for (var si = 0; si < specials.length; si++) {
    var spec = specials[si];
    var bldg = SPECIAL_BUILDINGS[spec.key];
    var targetDistrict = spec.district;
    var attempts = 0;
    while (attempts < 80) {
      var angle = rng() * Math.PI * 2;
      var r = wall.baseR * randRange(0.2, 0.8, rng);
      var bx = cx + Math.cos(angle) * r - bldg.w / 2;
      var by = cy + Math.sin(angle) * r - bldg.h / 2;
      var actualDistrict = getDistrict(bx + bldg.w / 2, by + bldg.h / 2, cx, cy, sectors);
      // Prefer target district, but accept any after 40 attempts
      if ((actualDistrict === targetDistrict || attempts >= 40) && tryPlace(bx, by, bldg.w, bldg.h, 8)) {
        var wallColors = DISTRICTS[targetDistrict].walls;
        var roofColors = DISTRICTS[targetDistrict].roofs;
        var shape = spec.key === "cathedral" ? "cruciform" : spec.key === "arena" ? "oval" : spec.key === "mageTower" ? "circle" : "rect";
        buildings.push({
          x: bx, y: by, w: bldg.w, h: bldg.h,
          type: "special", name: bldg.name, icon: bldg.icon,
          district: targetDistrict, roofColor: pick(roofColors, rng), wallColor: pick(wallColors, rng),
          shape: shape
        });
        hash.insert(bx, by, bldg.w, bldg.h, 12);
        break;
      }
      attempts++;
    }
  }

  // 3. Shops and taverns (placed BEFORE dense infill so spatial hash has room)
  var numShops = 22;
  for (var si = 0; si < numShops; si++) {
    var attempts = 0;
    while (attempts < 40) {
      var angle = rng() * Math.PI * 2;
      var r = wall.baseR * randRange(0.4, 0.8, rng);
      var bx = cx + Math.cos(angle) * r - 20;
      var by = cy + Math.sin(angle) * r - 20;
      if (tryPlace(bx, by, 40, 40, 4)) {
        var dist = getDistrict(bx + 20, by + 20, cx, cy, sectors);
        var dd = DISTRICTS[dist];
        var shopName = pick(Object.keys(usedShopNames).length < SHOP_NAMES.length / 2 ? SHOP_NAMES : [], rng);
        if (shopName) usedShopNames[shopName] = true;
        buildings.push({
          x: bx, y: by, w: 40, h: 40,
          type: "shop", name: shopName, district: dist,
          roofColor: pick(dd.roofs, rng), wallColor: pick(dd.walls, rng), shape: "rect"
        });
        hash.insert(bx, by, 40, 40, 4);
        break;
      }
      attempts++;
    }
  }

  var numTaverns = 10;
  for (var ti = 0; ti < numTaverns; ti++) {
    var attempts = 0;
    while (attempts < 40) {
      var angle = rng() * Math.PI * 2;
      var r = wall.baseR * randRange(0.3, 0.75, rng);
      var bx = cx + Math.cos(angle) * r - 25;
      var by = cy + Math.sin(angle) * r - 25;
      if (tryPlace(bx, by, 50, 50, 4)) {
        var dist = getDistrict(bx + 25, by + 25, cx, cy, sectors);
        var dd = DISTRICTS[dist];
        var tavernName = pick(Object.keys(usedTavernNames).length < TAVERN_NAMES.length / 2 ? TAVERN_NAMES : [], rng);
        if (tavernName) usedTavernNames[tavernName] = true;
        buildings.push({
          x: bx, y: by, w: 50, h: 50,
          type: "tavern", name: tavernName, district: dist,
          roofColor: pick(dd.roofs, rng), wallColor: pick(dd.walls, rng), shape: "rect"
        });
        hash.insert(bx, by, 50, 50, 4);
        break;
      }
      attempts++;
    }
  }

  // 4. Road-hugging buildings — the most important pass for realism
  // Medieval cities grew ALONG roads, so we place buildings on both sides of every road
  for (var ri = 0; ri < roads.length; ri++) {
    var road = roads[ri];
    var pts = road.points;
    var isMain = road.type === "main" || road.type === "secondary";
    var step = isMain ? 18 : 24; // sample spacing along road

    for (var pi = 0; pi < pts.length - 1; pi++) {
      var p1 = pts[pi], p2 = pts[pi + 1];
      var dx = p2[0] - p1[0], dy = p2[1] - p1[1];
      var segLen = Math.sqrt(dx * dx + dy * dy);
      if (segLen < 5) continue;
      var nx = -dy / segLen, ny = dx / segLen; // perpendicular normal

      var numSamples = Math.floor(segLen / step);
      for (var s = 0; s < numSamples; s++) {
        var t = (s + 0.5) / numSamples;
        var mx = p1[0] + dx * t;
        var my = p1[1] + dy * t;

        // Place on BOTH sides of road
        for (var side = -1; side <= 1; side += 2) {
          if (rng() < 0.25) continue; // skip some for variety
          var dist_d = getDistrict(mx, my, cx, cy, sectors);
          var dd = DISTRICTS[dist_d];
          var bw = randInt(dd.bw[0], dd.bw[1], rng);
          var bh = randInt(dd.bh[0], dd.bh[1], rng);
          // offset from road center: road half-width + small gap + half building
          var offset = road.width / 2 + 3 + bw / 2;
          var bx = mx + nx * side * offset - bw / 2 + (rng() * 4 - 2);
          var by = my + ny * side * offset - bh / 2 + (rng() * 4 - 2);

          if (tryPlace(bx, by, bw, bh, 1)) {
            var shape = pick(["rect","rect","rect","rect","l_shape","t_shape"], rng);
            buildings.push({
              x: bx, y: by, w: bw, h: bh,
              type: "house", district: dist_d, shape: shape,
              roofColor: pick(dd.roofs, rng), wallColor: pick(dd.walls, rng)
            });
            hash.insert(bx, by, bw, bh, 1);
          }
        }
      }
    }
  }

  // 5. Regular buildings with infill passes
  var districtKeys = Object.keys(DISTRICTS);
  var districtBuildings = {};
  for (var di = 0; di < districtKeys.length; di++) {
    districtBuildings[districtKeys[di]] = [];
  }

  // Pass 1: Place larger clusters in gaps between road-buildings
  var numClusters = 350;
  for (var ci = 0; ci < numClusters; ci++) {
    var targetDistrict = pick(CAPITAL_DISTRICTS, rng);
    var districtDef = DISTRICTS[targetDistrict];
    var angle = rng() * Math.PI * 2;
    var r = wall.baseR * randRange(0.15, 0.88, rng);
    var cx_off = cx + Math.cos(angle) * r;
    var cy_off = cy + Math.sin(angle) * r;

    var clusterSize = randInt(3, 8, rng);
    for (var cl = 0; cl < clusterSize; cl++) {
      var bw = randInt(districtDef.bw[0], districtDef.bw[1], rng);
      var bh = randInt(districtDef.bh[0], districtDef.bh[1], rng);
      var bx = cx_off + (rng() * 50 - 25);
      var by = cy_off + (rng() * 50 - 25);

      if (tryPlace(bx, by, bw, bh, 2)) {
        var dist = getDistrict(bx + bw / 2, by + bh / 2, cx, cy, sectors);
        var dd = DISTRICTS[dist];
        var shape = pick(["rect","rect","rect","l_shape","t_shape"], rng);
        var building = {
          x: bx, y: by, w: bw, h: bh,
          type: "house", district: dist, shape: shape,
          roofColor: pick(dd.roofs, rng), wallColor: pick(dd.walls, rng)
        };
        districtBuildings[dist].push(building);
        buildings.push(building);
        hash.insert(bx, by, bw, bh, 1);
      }
    }
  }

  // Pass 2: Dense infill — fill remaining gaps
  var fillAttempts = 12000;
  for (var fa = 0; fa < fillAttempts; fa++) {
    var targetDistrict = pick(CAPITAL_DISTRICTS, rng);
    var dd = DISTRICTS[targetDistrict];
    var angle = rng() * Math.PI * 2;
    var r = wall.baseR * randRange(0.1, 0.92, rng);
    var bx = cx + Math.cos(angle) * r + (rng() * 30 - 15);
    var by = cy + Math.sin(angle) * r + (rng() * 30 - 15);
    var bw = randInt(dd.bw[0], dd.bw[1], rng);
    var bh = randInt(dd.bh[0], dd.bh[1], rng);

    if (rng() < dd.density && tryPlace(bx, by, bw, bh, 1)) {
      var dist = getDistrict(bx + bw / 2, by + bh / 2, cx, cy, sectors);
      var dd2 = DISTRICTS[dist];
      var shape = pick(["rect","rect","rect","rect","l_shape"], rng);
      var building = {
        x: bx, y: by, w: bw, h: bh,
        type: "house", district: dist, shape: shape,
        roofColor: pick(dd2.roofs, rng), wallColor: pick(dd2.walls, rng)
      };
      buildings.push(building);
      hash.insert(bx, by, bw, bh, 1);
    }
  }

  // Pass 3: Tight inner-city infill with small buildings (market stalls, lean-tos)
  var innerFill = 4000;
  for (var fa = 0; fa < innerFill; fa++) {
    var angle = rng() * Math.PI * 2;
    var r = wall.baseR * randRange(0.08, 0.65, rng); // focus on inner city
    var bx = cx + Math.cos(angle) * r + (rng() * 20 - 10);
    var by = cy + Math.sin(angle) * r + (rng() * 20 - 10);
    var bw = randInt(10, 28, rng); // smaller buildings
    var bh = randInt(10, 24, rng);

    if (tryPlace(bx, by, bw, bh, 0)) {
      var dist = getDistrict(bx + bw / 2, by + bh / 2, cx, cy, sectors);
      var dd2 = DISTRICTS[dist];
      buildings.push({
        x: bx, y: by, w: bw, h: bh,
        type: "house", district: dist, shape: "rect",
        roofColor: pick(dd2.roofs, rng), wallColor: pick(dd2.walls, rng)
      });
      hash.insert(bx, by, bw, bh, 0);
    }
  }

  // 6. POIs scattered around (wells, statues, fountains, etc.)
  var poiTypes = shuffle(POI_TYPES.slice(), rng);
  var poiCount = 0;
  for (var i = 0; i < 200 && poiCount < 22; i++) {
    var angle = rng() * Math.PI * 2;
    var r = rng() * wall.baseR * 0.88;
    var px = cx + Math.cos(angle) * r;
    var py = cy + Math.sin(angle) * r;
    if (!isInsideWall(px, py) || isInRiver(px, py)) continue;
    if (hash.collides(px - 6, py - 6, 12, 12, 4)) continue;
    var poiType = poiTypes[poiCount % poiTypes.length];
    buildings.push({
      x: px - 6, y: py - 6, w: 12, h: 12,
      type: "poi", name: poiType, icon: "poi",
      district: getDistrict(px, py, cx, cy, sectors),
      roofColor: "#888", wallColor: "#888",
      shape: "poi"
    });
    hash.insert(px - 6, py - 6, 12, 12, 2);
    poiCount++;
  }

  return buildings;
}


// ─── TREE PLACEMENT ─────────────────────────────────────────────────────
function placeTrees(cx, cy, wall, river, buildings, hash, rng, W, H) {
  var trees = [];

  // Inner city trees (gardens, parks, courtyards)
  var numInner = 150;
  for (var ti = 0; ti < numInner; ti++) {
    var attempts = 0;
    while (attempts < 8) {
      var angle = rng() * Math.PI * 2;
      var r = wall.baseR * randRange(0.05, 0.95, rng);
      var tx = cx + Math.cos(angle) * r;
      var ty = cy + Math.sin(angle) * r;
      var tr = randRange(6, 16, rng);

      if (!hash.collides(tx - tr, ty - tr, tr * 2, tr * 2, 4)) {
        var inside = pointInPolygon(tx, ty, wall.vertices);
        if (inside) {
          trees.push({ x: tx, y: ty, r: tr, inside: true });
          hash.insert(tx - tr, ty - tr, tr * 2, tr * 2, 0);
          break;
        }
      }
      attempts++;
    }
  }

  // Outer trees — forests and groves outside walls
  var numOuter = 400;
  for (var ti = 0; ti < numOuter; ti++) {
    var angle = rng() * Math.PI * 2;
    var r = wall.baseR * randRange(1.05, 2.2, rng);
    var tx = cx + Math.cos(angle) * r;
    var ty = cy + Math.sin(angle) * r;
    if (tx < 40 || tx > W - 40 || ty < 40 || ty > H - 40) continue;
    var tr = randRange(10, 28, rng);
    // Avoid outfield roads
    var blocked = false;
    if (hash.collides(tx - tr, ty - tr, tr * 2, tr * 2, 2)) blocked = true;
    if (!blocked) {
      trees.push({ x: tx, y: ty, r: tr, inside: false });
    }
  }

  // Tree clusters (small groves of 3-8 trees)
  var numClusters = 30;
  for (var ci = 0; ci < numClusters; ci++) {
    var angle = rng() * Math.PI * 2;
    var r = wall.baseR * randRange(1.1, 2.0, rng);
    var gx = cx + Math.cos(angle) * r;
    var gy = cy + Math.sin(angle) * r;
    if (gx < 60 || gx > W - 60 || gy < 60 || gy > H - 60) continue;
    var gs = randInt(3, 8, rng);
    for (var gi = 0; gi < gs; gi++) {
      var tx = gx + (rng() * 40 - 20);
      var ty = gy + (rng() * 40 - 20);
      var tr = randRange(12, 24, rng);
      trees.push({ x: tx, y: ty, r: tr, inside: false });
    }
  }

  return trees;
}


// ─── PLAZA GENERATION ────────────────────────────────────────────────────
function placeePlazas(cx, cy, wall, roads, hash, rng) {
  var plazas = [];
  var numPlazas = randInt(3, 6, rng);

  for (var pi = 0; pi < numPlazas; pi++) {
    var angle = rng() * Math.PI * 2;
    var r = wall.baseR * randRange(0.3, 0.75, rng);
    var px = cx + Math.cos(angle) * r;
    var py = cy + Math.sin(angle) * r;
    var pw = randInt(60, 120, rng);
    var ph = randInt(60, 120, rng);

    if (!hash.collides(px - pw / 2, py - ph / 2, pw, ph, 10) && pointInPolygon(px, py, wall.vertices)) {
      plazas.push({ x: px - pw / 2, y: py - ph / 2, w: pw, h: ph });
      hash.insert(px - pw / 2, py - ph / 2, pw, ph, 5);
    }
  }

  return plazas;
}


// ─── OUTFIELD STRUCTURES ────────────────────────────────────────────────
function generateOutfield(cx, cy, wall, W, H, rng) {
  var roads = [];
  var buildings = [];
  var fields = [];

  // Outfield roads (highways radiating out from gates)
  var gates = wall.gates;
  for (var gi = 0; gi < gates.length; gi++) {
    var gate = gates[gi];
    var pts = [];
    var steps = 8;
    for (var s = 0; s <= steps; s++) {
      var t = s / steps;
      var px = lerp(gate.x, gate.x + Math.cos(gate.angle) * (W / 2), t);
      var py = lerp(gate.y, gate.y + Math.sin(gate.angle) * (H / 2), t);
      pts.push([px, py]);
    }
    roads.push({ points: pts, width: 24 });
  }

  // Outfield buildings (farmsteads, mills, shrines)
  var numOutfield = randInt(15, 30, rng);
  for (var oi = 0; oi < numOutfield; oi++) {
    var x = rng() * W;
    var y = rng() * H;
    var d = dist(x, y, cx, cy);
    if (d < wall.baseR * 1.1) continue;
    if (d > wall.baseR * 2.5) continue;

    var bw = randInt(30, 60, rng);
    var bh = randInt(30, 60, rng);
    buildings.push({
      x: x - bw / 2, y: y - bh / 2, w: bw, h: bh,
      wallColor: "#a89878", roofColor: "#7a6040"
    });
  }

  // Farm fields
  var numFields = randInt(8, 15, rng);
  for (var fi = 0; fi < numFields; fi++) {
    var x = rng() * W;
    var y = rng() * H;
    var d = dist(x, y, cx, cy);
    if (d < wall.baseR * 0.8) continue;
    if (d > wall.baseR * 2.8) continue;

    var fw = randInt(200, 400, rng);
    var fh = randInt(200, 400, rng);
    var fieldColors = [PAL.field1, PAL.field2, PAL.field3];
    var rotation = rng() * Math.PI;
    var furrows = randInt(6, 12, rng);

    fields.push({
      x: x, y: y, w: fw, h: fh, rotation: rotation,
      color: pick(fieldColors, rng), furrows: furrows
    });
  }

  return { roads: roads, buildings: buildings, fields: fields };
}


// ═══════════════════════════════════════════════════════════════════════════
// RENDERING FUNCTIONS (PROFESSIONAL QUALITY)
// ═══════════════════════════════════════════════════════════════════════════

// Helper: Draw a roof with ridge line and shading
function drawRoof(svg, x, y, w, h, roofColor, isWing) {
  // From top-down, the roof covers the ENTIRE building footprint
  // Ridge runs along the LONG axis
  var lightShade = adjustBrightness(roofColor, 1.18);
  var darkShade = adjustBrightness(roofColor, 0.78);
  var ridgeColor = adjustBrightness(roofColor, 0.55);

  var horizontal = w >= h; // ridge runs along long axis

  if (horizontal) {
    // Ridge runs horizontally (left-right), roof slopes north and south
    var ridgeY = y + h * 0.48; // slightly above center (perspective)
    // Light side (top/north - facing light from upper-left)
    svg.push('<polygon points="' +
      x.toFixed(1) + ',' + y.toFixed(1) + ' ' +
      (x + w).toFixed(1) + ',' + y.toFixed(1) + ' ' +
      (x + w - 1).toFixed(1) + ',' + ridgeY.toFixed(1) + ' ' +
      (x + 1).toFixed(1) + ',' + ridgeY.toFixed(1) +
      '" fill="' + lightShade + '"/>');
    // Dark side (bottom/south - shadow side)
    svg.push('<polygon points="' +
      (x + 1).toFixed(1) + ',' + ridgeY.toFixed(1) + ' ' +
      (x + w - 1).toFixed(1) + ',' + ridgeY.toFixed(1) + ' ' +
      (x + w).toFixed(1) + ',' + (y + h).toFixed(1) + ' ' +
      x.toFixed(1) + ',' + (y + h).toFixed(1) +
      '" fill="' + darkShade + '"/>');
    // Ridge line
    if (!isWing) {
      svg.push('<line x1="' + (x + 1).toFixed(1) + '" y1="' + ridgeY.toFixed(1) + '" x2="' + (x + w - 1).toFixed(1) + '" y2="' + ridgeY.toFixed(1) + '" stroke="' + ridgeColor + '" stroke-width="1.5" stroke-linecap="round"/>');
    }
  } else {
    // Ridge runs vertically (top-bottom), roof slopes east and west
    var ridgeX = x + w * 0.48;
    // Light side (left/west - facing light)
    svg.push('<polygon points="' +
      x.toFixed(1) + ',' + y.toFixed(1) + ' ' +
      ridgeX.toFixed(1) + ',' + (y + 1).toFixed(1) + ' ' +
      ridgeX.toFixed(1) + ',' + (y + h - 1).toFixed(1) + ' ' +
      x.toFixed(1) + ',' + (y + h).toFixed(1) +
      '" fill="' + lightShade + '"/>');
    // Dark side (right/east - shadow side)
    svg.push('<polygon points="' +
      ridgeX.toFixed(1) + ',' + (y + 1).toFixed(1) + ' ' +
      (x + w).toFixed(1) + ',' + y.toFixed(1) + ' ' +
      (x + w).toFixed(1) + ',' + (y + h).toFixed(1) + ' ' +
      ridgeX.toFixed(1) + ',' + (y + h - 1).toFixed(1) +
      '" fill="' + darkShade + '"/>');
    // Ridge line
    if (!isWing) {
      svg.push('<line x1="' + ridgeX.toFixed(1) + '" y1="' + (y + 1).toFixed(1) + '" x2="' + ridgeX.toFixed(1) + '" y2="' + (y + h - 1).toFixed(1) + '" stroke="' + ridgeColor + '" stroke-width="1.5" stroke-linecap="round"/>');
    }
  }
  // Roof outline
  svg.push('<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="none" stroke="#00000018" stroke-width="0.5" rx="0.5"/>');
}

function adjustBrightness(color, factor) {
  var r = parseInt(color.substr(1, 2), 16);
  var g = parseInt(color.substr(3, 2), 16);
  var b = parseInt(color.substr(5, 2), 16);
  r = Math.floor(Math.min(255, r * factor)).toString(16).padStart(2, '0');
  g = Math.floor(Math.min(255, g * factor)).toString(16).padStart(2, '0');
  b = Math.floor(Math.min(255, b * factor)).toString(16).padStart(2, '0');
  return '#' + r + g + b;
}

// Render detailed wall with crenellations and thickness
function drawDetailedWall(svg, vertices) {
  // Draw wall as thick STROKED ring, not filled polygon
  // Shadow
  svg.push('<path d="' + polygonPath(vertices) + '" fill="none" stroke="#00000020" stroke-width="18"/>');
  // Wall body — thick dark stroke with lighter inner
  svg.push('<path d="' + polygonPath(vertices) + '" fill="none" stroke="' + PAL.wallDk + '" stroke-width="14"/>');
  svg.push('<path d="' + polygonPath(vertices) + '" fill="none" stroke="' + PAL.wall + '" stroke-width="10"/>');
  svg.push('<path d="' + polygonPath(vertices) + '" fill="none" stroke="' + PAL.wallLt + '" stroke-width="4"/>');

  // Crenellations along outer edge (small ticks perpendicular to wall)
  for (var i = 0; i < vertices.length; i++) {
    var p1 = vertices[i];
    var p2 = vertices[(i + 1) % vertices.length];
    var dx = p2[0] - p1[0], dy = p2[1] - p1[1];
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len < 12) continue;
    // Normal pointing outward
    var nx = -dy / len, ny = dx / len;
    // Place crenellations every ~20px along this segment
    var numCren = Math.floor(len / 20);
    for (var c = 0; c < numCren; c++) {
      var t = (c + 0.5) / numCren;
      var cx = p1[0] + dx * t;
      var cy = p1[1] + dy * t;
      // Outer crenellation tick
      svg.push('<line x1="' + (cx + nx * 5).toFixed(1) + '" y1="' + (cy + ny * 5).toFixed(1) + '" x2="' + (cx + nx * 11).toFixed(1) + '" y2="' + (cy + ny * 11).toFixed(1) + '" stroke="' + PAL.crenl + '" stroke-width="3" stroke-linecap="round"/>');
    }
  }
}

// Render detailed castle
function renderCastlePro(svg, b) {
  var cx = b.x + b.w / 2;
  var cy = b.y + b.h / 2;

  // Shadow
  svg.push('<ellipse cx="' + (cx + 4).toFixed(1) + '" cy="' + (cy + 6).toFixed(1) + '" rx="' + (b.w/2 + 8).toFixed(1) + '" ry="' + (b.h/2 + 10).toFixed(1) + '" fill="#00000015"/>');

  // Outer curtain wall (thick polygon)
  var outerWall = [
    [b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h]
  ];
  svg.push('<path d="' + polygonPath(outerWall) + '" fill="' + PAL.wall + '" stroke="' + PAL.wallDk + '" stroke-width="2"/>');

  // Courtyard
  var courtW = b.w - 60, courtH = b.h - 60;
  svg.push('<rect x="' + (b.x + 30).toFixed(0) + '" y="' + (b.y + 30).toFixed(0) + '" width="' + courtW + '" height="' + courtH + '" fill="#d8cca8" stroke="#a09080" stroke-width="2" rx="2"/>');

  // Barbican/gate
  svg.push('<rect x="' + (cx - 35).toFixed(0) + '" y="' + (b.y - 5).toFixed(0) + '" width="70" height="40" fill="' + PAL.gate + '" stroke="' + PAL.wallDk + '" stroke-width="2"/>');
  svg.push('<rect x="' + (cx - 28).toFixed(0) + '" y="' + (b.y + 5).toFixed(0) + '" width="56" height="20" fill="#5a4030" stroke="none"/>');

  // Corner towers with crenellations
  var corners = [
    [b.x + 15, b.y + 15], [b.x + b.w - 15, b.y + 15],
    [b.x + 15, b.y + b.h - 15], [b.x + b.w - 15, b.y + b.h - 15]
  ];
  for (var i = 0; i < corners.length; i++) {
    var tc = corners[i];
    svg.push('<circle cx="' + tc[0].toFixed(0) + '" cy="' + tc[1].toFixed(0) + '" r="16" fill="' + PAL.tower + '" stroke="' + PAL.wallLt + '" stroke-width="2"/>');
    svg.push('<circle cx="' + tc[0].toFixed(0) + '" cy="' + tc[1].toFixed(0) + '" r="12" fill="' + PAL.wall + '"/>');
    // Crenellation marks
    for (var c = 0; c < 4; c++) {
      var ca = (c / 4) * Math.PI * 2;
      var crx = tc[0] + Math.cos(ca) * 14;
      var cry = tc[1] + Math.sin(ca) * 14;
      svg.push('<rect x="' + (crx - 2).toFixed(0) + '" y="' + (cry - 3).toFixed(0) + '" width="4" height="6" fill="' + PAL.crenl + '"/>');
    }
  }

  // Keep (central donjon with strong ridge)
  var keepX = cx - 50, keepY = cy - 45;
  var keepW = 100, keepH = 90;
  drawRoof(svg, keepX, keepY, keepW, keepH, "#8a7a6a", true);
  svg.push('<rect x="' + keepX.toFixed(1) + '" y="' + (keepY + keepH * 0.35).toFixed(1) + '" width="' + keepW.toFixed(1) + '" height="' + (keepH * 0.65).toFixed(1) + '" fill="#6a5a4a" stroke="' + PAL.wallDk + '" stroke-width="1.5"/>');

  // Mid-wall towers
  var mw = [[cx, b.y + 8], [cx, b.y + b.h - 8], [b.x + 8, cy], [b.x + b.w - 8, cy]];
  for (var i = 0; i < mw.length; i++) {
    svg.push('<circle cx="' + mw[i][0].toFixed(0) + '" cy="' + mw[i][1].toFixed(0) + '" r="12" fill="' + PAL.tower + '" stroke="' + PAL.wallLt + '" stroke-width="1.5"/>');
    svg.push('<circle cx="' + mw[i][0].toFixed(0) + '" cy="' + mw[i][1].toFixed(0) + '" r="8" fill="' + PAL.wall + '"/>');
  }

  // Banner pole and flag on keep
  svg.push('<line x1="' + cx.toFixed(0) + '" y1="' + (keepY - 5).toFixed(0) + '" x2="' + cx.toFixed(0) + '" y2="' + (keepY - 50).toFixed(0) + '" stroke="#3a2a1a" stroke-width="2.5"/>');
  svg.push('<polygon points="' + cx.toFixed(0) + ',' + (keepY - 50).toFixed(0) + ' ' + (cx + 20).toFixed(0) + ',' + (keepY - 42).toFixed(0) + ' ' + cx.toFixed(0) + ',' + (keepY - 35).toFixed(0) + '" fill="#d94040"/>');
}

// Render tree cluster (deterministic using hash of position)
function renderTreeCluster(svg, tx, ty, tr) {
  // Use position-based pseudo-random for determinism
  var seed = Math.floor(tx * 31 + ty * 7);
  var prng = function() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed % 1000) / 1000; };

  // Shadow
  svg.push('<ellipse cx="' + (tx + 2).toFixed(1) + '" cy="' + (ty + 3).toFixed(1) + '" rx="' + (tr * 0.85).toFixed(1) + '" ry="' + (tr * 0.6).toFixed(1) + '" fill="#00000010"/>');

  // Canopy: 3-5 overlapping circles with varied greens
  var greens = ["#5a8a40","#4a7a30","#6a9a50","#528a3a","#3a6a28","#72a458"];
  var numLayers = 3 + Math.floor(prng() * 3);
  for (var layer = 0; layer < numLayers; layer++) {
    var lx = tx + (prng() - 0.5) * tr * 0.5;
    var ly = ty + (prng() - 0.5) * tr * 0.5;
    var lr = tr * (0.5 + prng() * 0.5);
    var shade = greens[Math.floor(prng() * greens.length)];
    svg.push('<circle cx="' + lx.toFixed(1) + '" cy="' + ly.toFixed(1) + '" r="' + lr.toFixed(1) + '" fill="' + shade + '" opacity="' + (0.55 + prng() * 0.25).toFixed(2) + '"/>');
  }

  // Highlight dot
  svg.push('<circle cx="' + (tx - tr * 0.15).toFixed(1) + '" cy="' + (ty - tr * 0.15).toFixed(1) + '" r="' + (tr * 0.25).toFixed(1) + '" fill="#8ac060" opacity="0.3"/>');
}

// Render building with professional roof ridge details
function renderBuildingPro(svg, b, rng) {
  if (b.shape === "castle") {
    renderCastlePro(svg, b);
    return;
  }
  if (b.shape === "poi") {
    svg.push('<circle cx="' + (b.x + 8).toFixed(1) + '" cy="' + (b.y + 8).toFixed(1) + '" r="4" fill="#b09060" stroke="#806040" stroke-width="1" opacity="0.7"/>');
    return;
  }

  // Shadow (offset down-right, from light source upper-left)
  svg.push('<rect x="' + (b.x + 3).toFixed(1) + '" y="' + (b.y + 4).toFixed(1) + '" width="' + b.w.toFixed(1) + '" height="' + b.h.toFixed(1) + '" fill="#00000018" rx="1"/>');

  // Wall color as thin strip visible on shadow sides (SE edges)
  svg.push('<rect x="' + b.x.toFixed(1) + '" y="' + b.y.toFixed(1) + '" width="' + b.w.toFixed(1) + '" height="' + b.h.toFixed(1) + '" fill="' + b.wallColor + '" rx="0.5"/>');

  // Roof covers full footprint (slightly inset to show wall edge on shadow side)
  drawRoof(svg, b.x, b.y, b.w - 1, b.h - 1, b.roofColor, false);

  // Special shapes — additional wing sections
  if (b.shape === "l_shape") {
    var ww = b.w * 0.45, wh = b.h * 0.5;
    var wx = b.x + b.w - ww, wy = b.y + b.h;
    // Wing shadow
    svg.push('<rect x="' + (wx + 3).toFixed(1) + '" y="' + (wy + 4).toFixed(1) + '" width="' + ww.toFixed(1) + '" height="' + wh.toFixed(1) + '" fill="#00000015" rx="1"/>');
    // Wing wall + roof
    svg.push('<rect x="' + wx.toFixed(1) + '" y="' + wy.toFixed(1) + '" width="' + ww.toFixed(1) + '" height="' + wh.toFixed(1) + '" fill="' + b.wallColor + '" rx="0.5"/>');
    drawRoof(svg, wx, wy, ww - 1, wh - 1, b.roofColor, true);
  } else if (b.shape === "t_shape") {
    var ww = b.w * 0.35, wh = b.h * 0.45;
    var wx = b.x + (b.w - ww) / 2, wy = b.y + b.h;
    svg.push('<rect x="' + (wx + 3).toFixed(1) + '" y="' + (wy + 4).toFixed(1) + '" width="' + ww.toFixed(1) + '" height="' + wh.toFixed(1) + '" fill="#00000015" rx="1"/>');
    svg.push('<rect x="' + wx.toFixed(1) + '" y="' + wy.toFixed(1) + '" width="' + ww.toFixed(1) + '" height="' + wh.toFixed(1) + '" fill="' + b.wallColor + '" rx="0.5"/>');
    drawRoof(svg, wx, wy, ww - 1, wh - 1, b.roofColor, true);
  } else if (b.shape === "cruciform") {
    // Cathedral: cruciform floor plan (cross shape)
    var cw = b.w * 0.4;
    var ch = b.h * 0.4;
    var coff = (b.w - cw) / 2;

    // Transept (horizontal cross arm)
    svg.push('<rect x="' + b.x.toFixed(1) + '" y="' + (b.y + coff).toFixed(1) + '" width="' + b.w.toFixed(1) + '" height="' + ch.toFixed(1) + '" fill="' + b.wallColor + '" stroke="#00000012" stroke-width="0.5" rx="1"/>');
    drawRoof(svg, b.x, b.y + coff, b.w, ch, b.roofColor, false);

    // Tall spire in center
    var spireR = cw * 0.2;
    svg.push('<circle cx="' + (b.x + b.w/2).toFixed(1) + '" cy="' + (b.y + b.h/2).toFixed(1) + '" r="' + spireR.toFixed(1) + '" fill="' + PAL.tower + '" stroke="' + PAL.wallDk + '" stroke-width="1"/>');
    svg.push('<polygon points="' + (b.x + b.w/2).toFixed(1) + ',' + (b.y + b.h/2 - spireR*1.8).toFixed(1) + ' ' + (b.x + b.w/2 - spireR*0.6).toFixed(1) + ',' + (b.y + b.h/2).toFixed(1) + ' ' + (b.x + b.w/2 + spireR*0.6).toFixed(1) + ',' + (b.y + b.h/2).toFixed(1) + '" fill="' + PAL.crenl + '"/>');
  } else if (b.shape === "oval") {
    // Arena: oval/elliptical outline
    svg.push('<ellipse cx="' + (b.x + b.w/2).toFixed(1) + '" cy="' + (b.y + b.h/2).toFixed(1) + '" rx="' + (b.w/2).toFixed(1) + '" ry="' + (b.h/2).toFixed(1) + '" fill="' + b.wallColor + '" stroke="#00000012" stroke-width="0.5" opacity="0.9"/>');
    // Inner ellipse (arena floor)
    svg.push('<ellipse cx="' + (b.x + b.w/2).toFixed(1) + '" cy="' + (b.y + b.h/2).toFixed(1) + '" rx="' + (b.w/2.5).toFixed(1) + '" ry="' + (b.h/2.5).toFixed(1) + '" fill="#d8cca8" stroke="#c0b090" stroke-width="1"/>');
  } else if (b.shape === "circle") {
    // Mage tower: circular
    var r = Math.min(b.w, b.h) / 2;
    svg.push('<circle cx="' + (b.x + b.w/2).toFixed(1) + '" cy="' + (b.y + b.h/2).toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + b.wallColor + '" stroke="#00000012" stroke-width="0.5"/>');
    // Roof cone
    svg.push('<polygon points="' + (b.x + b.w/2).toFixed(1) + ',' + (b.y - 10).toFixed(1) + ' ' + (b.x + b.w/2 - r).toFixed(1) + ',' + (b.y + b.h/2).toFixed(1) + ' ' + (b.x + b.w/2 + r).toFixed(1) + ',' + (b.y + b.h/2).toFixed(1) + '" fill="' + b.roofColor + '"/>');
    // Arcane symbol
    svg.push('<circle cx="' + (b.x + b.w/2).toFixed(1) + '" cy="' + (b.y + b.h/2).toFixed(1) + '" r="' + (r * 0.4).toFixed(1) + '" fill="none" stroke="#e0a040" stroke-width="1.5" opacity="0.6"/>');
  }

  // Chimney on some buildings (deterministic based on position)
  if (b.shape === "rect" && b.w > 18 && b.h > 18) {
    var chSeed = Math.floor(b.x * 17 + b.y * 31);
    if ((chSeed % 3) === 0) {
      var chx = b.x + (chSeed % 2 === 0 ? b.w * 0.75 : b.w * 0.25);
      var chy = b.y + 2;
      svg.push('<rect x="' + (chx - 2).toFixed(1) + '" y="' + (chy - 3).toFixed(1) + '" width="4" height="5" fill="#706050" rx="0.5"/>');
      // Smoke wisps
      if ((chSeed % 5) === 0) {
        svg.push('<circle cx="' + chx.toFixed(1) + '" cy="' + (chy - 6).toFixed(1) + '" r="2" fill="#a0a0a0" opacity="0.15"/>');
        svg.push('<circle cx="' + (chx + 1).toFixed(1) + '" cy="' + (chy - 10).toFixed(1) + '" r="2.5" fill="#b0b0b0" opacity="0.1"/>');
      }
    }
  }

  // Shop/tavern markers (small colored dot on building)
  if (b.type === "shop") {
    svg.push('<rect x="' + (b.x + b.w - 8).toFixed(1) + '" y="' + (b.y + 2).toFixed(1) + '" width="6" height="6" fill="#c9a032" stroke="#a08020" stroke-width="0.5" rx="1"/>');
    // Awning
    svg.push('<rect x="' + b.x.toFixed(1) + '" y="' + (b.y + b.h - 4).toFixed(1) + '" width="' + b.w.toFixed(1) + '" height="4" fill="#d0a040" opacity="0.5" rx="0.5"/>');
  } else if (b.type === "tavern") {
    svg.push('<rect x="' + (b.x + b.w - 8).toFixed(1) + '" y="' + (b.y + 2).toFixed(1) + '" width="6" height="6" fill="#c88040" stroke="#a06020" stroke-width="0.5" rx="1"/>');
    // Hanging sign
    svg.push('<line x1="' + (b.x + b.w/2).toFixed(1) + '" y1="' + (b.y + b.h).toFixed(1) + '" x2="' + (b.x + b.w/2).toFixed(1) + '" y2="' + (b.y + b.h + 5).toFixed(1) + '" stroke="#5a4030" stroke-width="1"/>');
    svg.push('<rect x="' + (b.x + b.w/2 - 4).toFixed(1) + '" y="' + (b.y + b.h + 5).toFixed(1) + '" width="8" height="5" fill="#c08040" stroke="#805030" stroke-width="0.5" rx="0.5"/>');
  }
}

function renderCitySVG(city) {
  var svg = [];
  var W = CW, H = CH;
  var cx = city.cx, cy = city.cy;

  svg.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '">');

  // Defs with filters
  svg.push('<defs>');
  svg.push('<radialGradient id="bgGrad" cx="50%" cy="50%" r="60%">');
  svg.push('<stop offset="0%" stop-color="#d0c8a0"/>');
  svg.push('<stop offset="100%" stop-color="#b8b088"/>');
  svg.push('</radialGradient>');
  svg.push('<filter id="buildingShadow" x="-10%" y="-10%" width="130%" height="130%">');
  svg.push('<feGaussianBlur in="SourceGraphic" stdDeviation="1.5"/>');
  svg.push('</filter>');
  svg.push('<clipPath id="wallClip"><path d="' + polygonPath(city.wall.vertices) + '"/></clipPath>');
  svg.push('</defs>');

  // 1. Background
  svg.push('<rect width="' + W + '" height="' + H + '" fill="url(#bgGrad)"/>');

  // Parchment noise texture
  for (var i = 0; i < 150; i++) {
    var nx = city.rng() * W, ny = city.rng() * H;
    var nr = city.rng() * 30 + 5;
    svg.push('<circle cx="' + nx.toFixed(0) + '" cy="' + ny.toFixed(0) + '" r="' + nr.toFixed(0) + '" fill="#c8c09020" opacity="0.3"/>');
  }

  // 2. Outfield roads
  for (var i = 0; i < city.outfield.roads.length; i++) {
    var road = city.outfield.roads[i];
    var rp = road.points.length > 3 ? smoothCurvePath(road.points, false) : polylinePath(road.points);
    svg.push('<path d="' + rp + '" fill="none" stroke="' + PAL.roadEdge + '" stroke-width="' + (road.width + 4).toFixed(0) + '" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"/>');
    svg.push('<path d="' + rp + '" fill="none" stroke="' + PAL.road + '" stroke-width="' + road.width.toFixed(0) + '" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>');
  }

  // 3. Farm fields with furrow details
  for (var i = 0; i < city.fields.length; i++) {
    var f = city.fields[i];
    var fTrans = 'translate(' + f.x.toFixed(0) + ',' + f.y.toFixed(0) + ') rotate(' + (f.rotation * 180 / Math.PI).toFixed(0) + ')';
    svg.push('<rect x="' + (-f.w/2).toFixed(0) + '" y="' + (-f.h/2).toFixed(0) + '" width="' + f.w.toFixed(0) + '" height="' + f.h.toFixed(0) + '" fill="' + f.color + '" opacity="0.7" rx="2" stroke="#a0986830" stroke-width="1" transform="' + fTrans + '"/>');
    for (var j = 0; j < f.furrows; j++) {
      var fy = -f.h / 2 + ((j + 0.5) / f.furrows) * f.h;
      svg.push('<line x1="' + (-f.w/2 + 2) + '" y1="' + fy.toFixed(1) + '" x2="' + (f.w/2 - 2) + '" y2="' + fy.toFixed(1) + '" stroke="#8a8a6a" stroke-width="0.8" opacity="0.35" transform="' + fTrans + '"/>');
    }
  }

  // 3b. Outfield buildings (farmsteads, mills)
  for (var i = 0; i < city.outfield.buildings.length; i++) {
    var ob = city.outfield.buildings[i];
    svg.push('<rect x="' + (ob.x + 2).toFixed(1) + '" y="' + (ob.y + 3).toFixed(1) + '" width="' + ob.w.toFixed(1) + '" height="' + ob.h.toFixed(1) + '" fill="#00000010" rx="1"/>');
    svg.push('<rect x="' + ob.x.toFixed(1) + '" y="' + ob.y.toFixed(1) + '" width="' + ob.w.toFixed(1) + '" height="' + ob.h.toFixed(1) + '" fill="' + ob.wallColor + '" rx="0.5"/>');
    drawRoof(svg, ob.x, ob.y, ob.w - 1, ob.h - 1, ob.roofColor, false);
  }

  // 3c. Grass moat/clearing just outside walls
  var wallGrass = offsetPolyline(city.wall.vertices, 50);
  svg.push('<path d="' + polygonPath(wallGrass) + '" fill="' + PAL.grass + '" opacity="0.25"/>');

  // 4. Ground fill inside walls
  svg.push('<path d="' + polygonPath(city.wall.vertices) + '" fill="' + PAL.ground + '"/>');

  // District ground fills as pie slices
  for (var i = 0; i < city.sectors.length; i++) {
    var sector = city.sectors[i];
    var districtColor;
    if (sector.district === "noble") districtColor = PAL.districtNoble;
    else if (sector.district === "temple") districtColor = PAL.districtTemple;
    else if (sector.district === "market") districtColor = PAL.districtMarket;
    else if (sector.district === "poor") districtColor = PAL.districtPoor;
    else if (sector.district === "docks") districtColor = PAL.districtDocks;
    else districtColor = PAL.districtResidential;

    var nextBoundary = city.sectors[(i + 1) % city.sectors.length].boundary;
    var startAngle = i === 0 ? ((city.sectors[city.sectors.length - 1].boundary + nextBoundary) / 2) : sector.boundary;
    var endAngle = nextBoundary;

    var radius = city.wall.baseR * 0.95;
    var slice = [];
    slice.push([cx, cy]);
    var steps = 30;
    for (var s = 0; s <= steps; s++) {
      var a = startAngle + (s / steps) * (endAngle - startAngle);
      slice.push([cx + Math.cos(a) * radius, cy + Math.sin(a) * radius]);
    }
    svg.push('<path d="' + polygonPath(slice) + '" fill="' + districtColor + '" opacity="0.6" clip-path="url(#wallClip)"/>');
  }

  // 5. River
  if (city.river) {
    var rp = smoothCurvePath(city.river.points, false);
    svg.push('<path d="' + rp + '" fill="none" stroke="' + PAL.waterDk + '" stroke-width="' + (city.river.width + 12).toFixed(0) + '" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>');
    svg.push('<path d="' + rp + '" fill="none" stroke="' + PAL.water + '" stroke-width="' + city.river.width.toFixed(0) + '" stroke-linecap="round" stroke-linejoin="round"/>');
    // Ripples
    svg.push('<path d="' + rp + '" fill="none" stroke="' + PAL.waterLt + '" stroke-width="' + (city.river.width * 0.3).toFixed(0) + '" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>');
    if (city.river.tributary && city.river.tributary.length > 0) {
      var tp = smoothCurvePath(city.river.tributary, false);
      svg.push('<path d="' + tp + '" fill="none" stroke="' + PAL.water + '" stroke-width="' + (city.river.width * 0.4).toFixed(0) + '" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>');
    }
  }

  // 6. Roads (back to front ordering with improved detail)
  var roadOrder = ["lane","connector","secondary","main"];
  for (var ro = 0; ro < roadOrder.length; ro++) {
    var rt = roadOrder[ro];
    for (var ri = 0; ri < city.roads.length; ri++) {
      var road = city.roads[ri];
      if (road.type !== rt) continue;
      var rp = road.points.length > 3 ? smoothCurvePath(road.points, false) : polylinePath(road.points);
      // Gutter/edge shadow
      svg.push('<path d="' + rp + '" fill="none" stroke="#8a7a6030" stroke-width="' + (road.width + 8).toFixed(0) + '" stroke-linecap="round" stroke-linejoin="round"/>');
      // Dark edge
      svg.push('<path d="' + rp + '" fill="none" stroke="' + PAL.roadEdge + '" stroke-width="' + (road.width + 3).toFixed(0) + '" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>');
      // Road surface
      svg.push('<path d="' + rp + '" fill="none" stroke="' + PAL.road + '" stroke-width="' + road.width.toFixed(0) + '" stroke-linecap="round" stroke-linejoin="round"/>');
      // Center line for main roads
      if (rt === "main") {
        svg.push('<path d="' + rp + '" fill="none" stroke="#d0c4a8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.4" stroke-dasharray="8 12"/>');
      }
    }
  }

  // 7. Inner wall ground
  if (city.wall.innerVertices.length > 0) {
    svg.push('<path d="' + polygonPath(city.wall.innerVertices) + '" fill="' + PAL.districtNoble + '" opacity="0.6"/>');
  }

  // 8. Plazas
  for (var pi = 0; pi < city.plazas.length; pi++) {
    var p = city.plazas[pi];
    svg.push('<rect x="' + p.x.toFixed(0) + '" y="' + p.y.toFixed(0) + '" width="' + p.w.toFixed(0) + '" height="' + p.h.toFixed(0) + '" fill="' + PAL.plaza + '" opacity="0.7" rx="4"/>');
  }

  // 9. Buildings
  for (var bi = 0; bi < city.buildings.length; bi++) {
    var b = city.buildings[bi];
    renderBuildingPro(svg, b, city.rng);
  }

  // 10. Trees (with clusters)
  for (var ti = 0; ti < city.trees.length; ti++) {
    var t = city.trees[ti];
    renderTreeCluster(svg, t.x, t.y, t.r);
  }

  // 11. Walls - detailed with crenellations
  drawDetailedWall(svg, city.wall.vertices);

  // Tower crenellations
  for (var ti = 0; ti < city.wall.towers.length; ti++) {
    var tw = city.wall.towers[ti];
    svg.push('<circle cx="' + tw.x.toFixed(1) + '" cy="' + tw.y.toFixed(1) + '" r="12" fill="' + PAL.tower + '" stroke="' + PAL.wallLt + '" stroke-width="2"/>');
    svg.push('<circle cx="' + tw.x.toFixed(1) + '" cy="' + tw.y.toFixed(1) + '" r="8" fill="' + PAL.wall + '"/>');
    for (var c = 0; c < 4; c++) {
      var ca = (c / 4) * Math.PI * 2;
      var crx = tw.x + Math.cos(ca) * 10;
      var cry = tw.y + Math.sin(ca) * 10;
      svg.push('<rect x="' + (crx - 1.5).toFixed(1) + '" y="' + (cry - 2).toFixed(1) + '" width="3" height="4" fill="' + PAL.crenl + '"/>');
    }
  }

  // Gates with detail
  for (var gi = 0; gi < city.wall.gates.length; gi++) {
    var gate = city.wall.gates[gi];
    var ga = gate.angle;
    var gw = 32, gh = 18;
    svg.push('<rect x="' + (-gw/2).toFixed(0) + '" y="' + (-gh/2).toFixed(0) + '" width="' + gw + '" height="' + gh + '" fill="' + PAL.gate + '" stroke="' + PAL.wallDk + '" stroke-width="2" rx="3" transform="translate(' + gate.x.toFixed(1) + ',' + gate.y.toFixed(1) + ') rotate(' + (ga * 180 / Math.PI).toFixed(0) + ')"/>');
    // Portcullis hint
    svg.push('<line x1="' + (gate.x - 6).toFixed(1) + '" y1="' + (gate.y - 4).toFixed(1) + '" x2="' + (gate.x - 6).toFixed(1) + '" y2="' + (gate.y + 4).toFixed(1) + '" stroke="#5a4030" stroke-width="1" opacity="0.7"/>');
    svg.push('<line x1="' + (gate.x + 6).toFixed(1) + '" y1="' + (gate.y - 4).toFixed(1) + '" x2="' + (gate.x + 6).toFixed(1) + '" y2="' + (gate.y + 4).toFixed(1) + '" stroke="#5a4030" stroke-width="1" opacity="0.7"/>');
    // Flanking towers
    svg.push('<circle cx="' + (gate.x + Math.cos(ga + Math.PI/2) * 14).toFixed(1) + '" cy="' + (gate.y + Math.sin(ga + Math.PI/2) * 14).toFixed(1) + '" r="9" fill="' + PAL.tower + '" stroke="' + PAL.wallLt + '" stroke-width="1.5"/>');
    svg.push('<circle cx="' + (gate.x + Math.cos(ga - Math.PI/2) * 14).toFixed(1) + '" cy="' + (gate.y + Math.sin(ga - Math.PI/2) * 14).toFixed(1) + '" r="9" fill="' + PAL.tower + '" stroke="' + PAL.wallLt + '" stroke-width="1.5"/>');
  }

  // Inner wall
  if (city.wall.innerVertices.length > 0) {
    svg.push('<path d="' + polygonPath(city.wall.innerVertices) + '" fill="none" stroke="' + PAL.wall + '" stroke-width="6"/>');
    svg.push('<path d="' + polygonPath(city.wall.innerVertices) + '" fill="none" stroke="' + PAL.wallLt + '" stroke-width="3"/>');
  }

  // 12. Bridges
  if (city.river) {
    for (var ri = 0; ri < city.roads.length; ri++) {
      var road = city.roads[ri];
      if (road.type !== "main") continue;
      for (var pi = 0; pi < road.points.length - 1; pi++) {
        var rp1 = road.points[pi], rp2 = road.points[pi + 1];
        for (var rvi = 0; rvi < city.river.points.length - 1; rvi++) {
          var rv1 = city.river.points[rvi], rv2 = city.river.points[rvi + 1];
          var ix = lineIntersect(rp1, rp2, rv1, rv2);
          if (ix) {
            var ba = Math.atan2(rp2[1] - rp1[1], rp2[0] - rp1[0]);
            var bw = city.river.width + 20;
            svg.push('<rect x="' + (-bw/2).toFixed(0) + '" y="-18" width="' + bw.toFixed(0) + '" height="36" fill="#a09070" stroke="#807060" stroke-width="2" rx="4" transform="translate(' + ix[0].toFixed(1) + ',' + ix[1].toFixed(1) + ') rotate(' + (ba * 180 / Math.PI).toFixed(0) + ')"/>');
            svg.push('<line x1="' + (ix[0] - Math.cos(ba) * bw/2).toFixed(1) + '" y1="' + (ix[1] - Math.sin(ba) * bw/2).toFixed(1) + '" x2="' + (ix[0] + Math.cos(ba) * bw/2).toFixed(1) + '" y2="' + (ix[1] + Math.sin(ba) * bw/2).toFixed(1) + '" stroke="#807060" stroke-width="3"/>');
          }
        }
      }
    }
  }

  // 13. City name label
  svg.push('<text x="' + (W/2) + '" y="60" text-anchor="middle" fill="#4a3a2a" font-family="serif" font-size="48" font-weight="bold" letter-spacing="8" opacity="0.7">' + escXml(city.name) + '</text>');

  // Compass rose
  svg.push('<g transform="translate(' + (W - 80) + ',80)" opacity="0.4">');
  svg.push('<line x1="0" y1="-30" x2="0" y2="30" stroke="#4a3a2a" stroke-width="2"/>');
  svg.push('<line x1="-30" y1="0" x2="30" y2="0" stroke="#4a3a2a" stroke-width="2"/>');
  svg.push('<polygon points="0,-35 -5,-15 5,-15" fill="#4a3a2a"/>');
  svg.push('<text x="0" y="-40" text-anchor="middle" fill="#4a3a2a" font-size="14" font-family="serif">N</text>');
  svg.push('</g>');

  // Decorative border
  svg.push('<rect x="8" y="8" width="' + (W - 16) + '" height="' + (H - 16) + '" fill="none" stroke="#8a7a5a33" stroke-width="3" rx="4"/>');
  svg.push('<rect x="14" y="14" width="' + (W - 28) + '" height="' + (H - 28) + '" fill="none" stroke="#8a7a5a22" stroke-width="1" rx="2"/>');

  svg.push('</svg>');
  return svg.join("\n");
}


function lineIntersect(p1, p2, p3, p4) {
  var d1x = p2[0] - p1[0], d1y = p2[1] - p1[1];
  var d2x = p4[0] - p3[0], d2y = p4[1] - p3[1];
  var denom = d1x * d2y - d1y * d2x;
  if (Math.abs(denom) < 0.001) return null;
  var t = ((p3[0] - p1[0]) * d2y - (p3[1] - p1[1]) * d2x) / denom;
  var u = ((p3[0] - p1[0]) * d1y - (p3[1] - p1[1]) * d1x) / denom;
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return [p1[0] + t * d1x, p1[1] + t * d1y];
  }
  return null;
}

function escXml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}


// ═══════════════════════════════════════════════════════════════════════════
// MAIN GENERATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

function generateCapitalCity(name, seed, population, terrain) {
  var rng = seededRng(name, seed || 0);

  var W = CW, H = CH;
  var cx = W / 2 + (rng() * 80 - 40);
  var cy = H / 2 + (rng() * 60 - 30);

  // Base radius scales with canvas
  var baseR = Math.min(W, H) * 0.38;

  // Has river? (50% chance, influenced by terrain)
  var hasRiver = terrain === "coast" || terrain === "river" || rng() < 0.5;
  var river = hasRiver ? generateRiver(cx, cy, W, H, null, rng) : null;

  // Generate wall
  var wall = generateWall(cx, cy, baseR, 64, randInt(4, 6, rng), rng);

  // Generate roads
  var roads = generateRoads(cx, cy, wall, rng);

  // Reserve roads and river in spatial hash
  var hash = new SpatialHash(W, H, Math.max(20, Math.min(W, H) / 60));

  // Reserve river
  if (river) {
    for (var i = 0; i < river.points.length - 1; i++) {
      var p1 = river.points[i], p2 = river.points[i + 1];
      var mx = Math.min(p1[0], p2[0]) - river.width / 2;
      var my = Math.min(p1[1], p2[1]) - river.width / 2;
      var mw = Math.abs(p2[0] - p1[0]) + river.width;
      var mh = Math.abs(p2[1] - p1[1]) + river.width;
      hash.insert(mx, my, mw, mh);
    }
  }

  // Reserve roads
  for (var ri = 0; ri < roads.length; ri++) {
    var road = roads[ri];
    for (var pi = 0; pi < road.points.length - 1; pi++) {
      var p1 = road.points[pi], p2 = road.points[pi + 1];
      var mx = Math.min(p1[0], p2[0]) - road.width / 2;
      var my = Math.min(p1[1], p2[1]) - road.width / 2;
      var mw = Math.abs(p2[0] - p1[0]) + road.width;
      var mh = Math.abs(p2[1] - p1[1]) + road.width;
      hash.insert(mx, my, mw, mh);
    }
  }

  // District sectors
  var marketAngle = wall.gateAngles.length > 0 ? wall.gateAngles[0] : 0;
  var sectors = buildDistrictSectors(cx, cy, river, marketAngle, rng);

  // Place buildings
  var buildings = placeBuildings(cx, cy, wall, roads, river, sectors, hash, rng);

  // Place trees
  var trees = placeTrees(cx, cy, wall, river, buildings, hash, rng, W, H);

  // Place plazas
  var plazas = placeePlazas(cx, cy, wall, roads, hash, rng);

  // Generate outfield
  var outfield = generateOutfield(cx, cy, wall, W, H, rng);

  // Assemble city object
  var city = {
    name: name,
    cx: cx, cy: cy,
    wall: wall,
    roads: roads,
    river: river,
    sectors: sectors,
    buildings: buildings,
    trees: trees,
    plazas: plazas,
    outfield: outfield,
    fields: outfield.fields,
    rng: rng
  };

  // Render to SVG
  var svgStr = renderCitySVG(city);

  // Build metadata
  var metadata = {
    name: name,
    seed: seed,
    isCapital: true,
    population: population || 100000,
    canvasWidth: W,
    canvasHeight: H,
    buildings: []
  };
  for (var bi = 0; bi < buildings.length; bi++) {
    var b = buildings[bi];
    if (b.type === "house") continue; // skip houses for interactivity
    metadata.buildings.push({
      name: b.name || b.type,
      type: b.type,
      icon: b.icon || b.type,
      x: b.x / W,
      y: b.y / H,
      w: b.w / W,
      h: b.h / H
    });
  }

  return {
    svg: svgStr,
    metadata: metadata
  };
}


// ═══════════════════════════════════════════════════════════════════════════
// INTEGRATION: Generate city maps for all capitals and register them
// ═══════════════════════════════════════════════════════════════════════════

function generateAllCapitalMaps(cities, worldSeed) {
  if (!cities || !cities.length) return;

  window.TOWN_IMAGES = window.TOWN_IMAGES || {};
  window.TOWN_METADATA = window.TOWN_METADATA || {};

  for (var i = 0; i < cities.length; i++) {
    var c = cities[i];
    if (!c.isCapital && !c.capital) continue;
    if (window.TOWN_IMAGES[c.name]) continue; // already has pre-generated image

    var seed = worldSeed ? hashSeed(worldSeed + "-" + c.name) : hashSeed(c.name);
    var result = generateCapitalCity(c.name, seed, c.population || 100000, c.terrain || "plains");

    // Store as SVG data URI
    window.TOWN_IMAGES[c.name] = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(result.svg)));
    window.TOWN_METADATA[c.name] = result.metadata;
  }
}


// ─── EXPORTS ────────────────────────────────────────────────────────────
window.generateCapitalCity = generateCapitalCity;
window.generateAllCapitalMaps = generateAllCapitalMaps;
})();
