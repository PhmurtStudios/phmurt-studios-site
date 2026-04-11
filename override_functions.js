var fmRenderTerrain = function(ctx) {
  var cellSize = fmGetCellSize();
  var w = cellSize.w;
  var h = cellSize.h;
  var dark = FMap.dark;

  // Reference style: NO blue. Water is warm amber/ochre, slightly lighter than land.
  // All colors in warm brown/gold palette to match golden parchment.
  var waterLight = dark ? '#1a1810' : '#c8a858'; // warm golden for water areas
  var waterDark = dark ? '#181510' : '#b09040';  // slightly darker for deep ocean
  var desertColor = dark ? '#3a3015' : '#d8c070';
  var swampColor = dark ? '#1a2015' : '#a0a060';
  var forestColor = dark ? '#1a2010' : '#8a9050'; // muted olive for forests

  for (var row = 0; row < FMap.grid.rows; row++) {
    for (var col = 0; col < FMap.grid.cols; col++) {
      var cell = FMap.grid.cells[row * FMap.grid.cols + col];
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

  // IMPROVEMENT 2: Add biome transition gradients for smooth blending
  // This creates a distance-field based fade between different terrain types
  var transitionAlpha = 0.05;
  for (var row = 0; row < FMap.grid.rows; row++) {
    for (var col = 0; col < FMap.grid.cols; col++) {
      var cell = FMap.grid.cells[row * FMap.grid.cols + col];
      if (!cell || cell.isWater) continue;

      var screenPos = fmCellToScreen(col, row);

      // Check if adjacent to a different biome type
      var isBorder = false;
      var transColor = null;
      for (var dr = -1; dr <= 1 && !isBorder; dr++) {
        for (var dc = -1; dc <= 1 && !isBorder; dc++) {
          if (dr === 0 && dc === 0) continue;
          var nr = row + dr;
          var nc = col + dc;
          if (nr < 0 || nr >= FMap.grid.rows || nc < 0 || nc >= FMap.grid.cols) continue;
          var neighbor = FMap.grid.cells[nr * FMap.grid.cols + nc];
          if (!neighbor) continue;

          // Check for biome type transitions
          if ((cell.biome === 'forest' || cell.biome === 'dense_forest') && neighbor.isWater) {
            transColor = forestColor;
            isBorder = true;
          } else if (cell.biome === 'mountain' && (neighbor.biome === 'hills' || neighbor.biome === 'grassland')) {
            transColor = dark ? '#3a3a2a' : '#a8a878';
            isBorder = true;
          } else if (cell.biome === 'desert' && neighbor.biome && !neighbor.biome.includes('desert')) {
            transColor = desertColor;
            isBorder = true;
          }
        }
      }
      if (isBorder && transColor) {
        ctx.fillStyle = transColor;
        ctx.globalAlpha = transitionAlpha;
        ctx.fillRect(screenPos.x, screenPos.y, w + 0.5, h + 0.5);
      }
    }
  }
  ctx.globalAlpha = 1.0;
};

// ============================================================================
// 3b. RELIEF SHADING — subtle 3D hillshading effect based on heightmap
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

  // Marching squares: for each 2x2 block, compute case and extract edge segments
  // Segments are in screen coordinates
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

      // Cell top-left in screen coords
      var ox = b.x + (col / cols) * b.w;
      var oy = b.y + (row / rows) * b.h;
      var cw = b.w / cols;
      var ch = b.h / rows;

      // Midpoints of edges: top=T, right=R, bottom=B, left=L
      var T = [ox + cw * 0.5, oy];
      var R = [ox + cw, oy + ch * 0.5];
      var B = [ox + cw * 0.5, oy + ch];
      var L = [ox, oy + ch * 0.5];

      // Lookup: which edges to connect for each case
      var segs;
      switch (caseIdx) {
        case 1:  segs = [[L, T]]; break;
        case 2:  segs = [[T, R]]; break;
        case 3:  segs = [[L, R]]; break;
        case 4:  segs = [[R, B]]; break;
        case 5:  segs = [[L, T], [R, B]]; break; // saddle
        case 6:  segs = [[T, B]]; break;
        case 7:  segs = [[L, B]]; break;
        case 8:  segs = [[B, L]]; break;
        case 9:  segs = [[B, T]]; break;
        case 10: segs = [[T, R], [B, L]]; break; // saddle
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

  // Chain segments into polylines by connecting matching endpoints
  var used = new Array(allSegments.length);
  var chains = [];

  // Build spatial index for fast endpoint lookup
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

    // Extend forward
    var searching = true;
    while (searching) {
      searching = false;
      var last = chain[chain.length - 1];
      var key = snapKey(last[0], last[1]);
      var candidates = endpointMap[key];
      if (candidates) {
        for (var ci = 0; ci < candidates.length; ci++) {
          var c = candidates[ci];
          if (used[c.idx]) continue;
          used[c.idx] = true;
          var ns = allSegments[c.idx];
          if (c.end === 0) {
            chain.push([ns[2], ns[3]]);
          } else {
            chain.push([ns[0], ns[1]]);
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
          var c = candidates[ci];
          if (used[c.idx]) continue;
          used[c.idx] = true;
          var ns = allSegments[c.idx];
          if (c.end === 0) {
            chain.unshift([ns[2], ns[3]]);
          } else {
            chain.unshift([ns[0], ns[1]]);
          }
          searching = true;
          break;
        }
      }
    }

    if (chain.length >= 3) chains.push(chain);
  }

  // Smooth chains with Catmull-Rom spline
  var smoothChain = function(pts) {
    if (pts.length < 3) return pts;
    var result = [];
    for (var p = 0; p < pts.length - 1; p++) {
      var p0 = pts[Math.max(0, p - 1)];
      var p1 = pts[p];
      var p2 = pts[p + 1];
      var p3 = pts[Math.min(pts.length - 1, p + 2)];

      result.push(p1);
      var dx = p2[0] - p1[0];
      var dy = p2[1] - p1[1];
      var steps = Math.max(2, Math.ceil(Math.sqrt(dx * dx + dy * dy) / 3));

      for (var st = 1; st < steps; st++) {
        var t = st / steps;
        var t2 = t * t;
        var t3 = t2 * t;
        var a0 = -0.5 * t3 + t2 - 0.5 * t;
        var a1 = 1.5 * t3 - 2.5 * t2 + 1;
        var a2 = -1.5 * t3 + 2 * t2 + 0.5 * t;
        var a3 = 0.5 * t3 - 0.5 * t2;
        result.push([
          a0 * p0[0] + a1 * p1[0] + a2 * p2[0] + a3 * p3[0],
          a0 * p0[1] + a1 * p1[1] + a2 * p2[1] + a3 * p3[1]
        ]);
      }
    }
    result.push(pts[pts.length - 1]);
    return result;
  };

  // Chaikin corner-cutting subdivision for very smooth coastlines
  var chaikinSmooth = function(pts) {
    if (pts.length < 3) return pts;
    var result = [pts[0]]; // keep first point
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i];
      var p1 = pts[i + 1];
      result.push([p0[0] * 0.75 + p1[0] * 0.25, p0[1] * 0.75 + p1[1] * 0.25]);
      result.push([p0[0] * 0.25 + p1[0] * 0.75, p0[1] * 0.25 + p1[1] * 0.75]);
    }
    result.push(pts[pts.length - 1]); // keep last point
    return result;
  };

  // Smooth all chains: Catmull-Rom + 2x Chaikin subdivision
  var smoothed = [];
  for (var ci = 0; ci < chains.length; ci++) {
    var s = smoothChain(chains[ci]);
    s = chaikinSmooth(s);
    s = chaikinSmooth(s);
    if (s.length >= 2) smoothed.push(s);
  }

  // Determine water-side normal direction for each chain
  var chainWaterDir = [];
  for (var ci = 0; ci < smoothed.length; ci++) {
    var smooth = smoothed[ci];
    var dir = 1;
    if (smooth.length >= 5) {
      var mid = Math.floor(smooth.length / 2);
      var prev = smooth[Math.max(0, mid - 1)];
      var curr = smooth[mid];
      var next = smooth[Math.min(smooth.length - 1, mid + 1)];
      var tdx = next[0] - prev[0];
      var tdy = next[1] - prev[1];
      var tlen = Math.sqrt(tdx * tdx + tdy * tdy) || 1;
      var tnx = -tdy / tlen;
      var tny = tdx / tlen;
      var testDist = 10;
      var testCol1 = Math.floor(((curr[0] + tnx * testDist) - b.x) / b.w * cols);
      var testRow1 = Math.floor(((curr[1] + tny * testDist) - b.y) / b.h * rows);
      var testCol2 = Math.floor(((curr[0] - tnx * testDist) - b.x) / b.w * cols);
      var testRow2 = Math.floor(((curr[1] - tny * testDist) - b.y) / b.h * rows);
      var cell1 = null, cell2 = null;
      if (testRow1 >= 0 && testRow1 < rows && testCol1 >= 0 && testCol1 < cols)
        cell1 = FMap.grid.cells[testRow1 * cols + testCol1];
      if (testRow2 >= 0 && testRow2 < rows && testCol2 >= 0 && testCol2 < cols)
        cell2 = FMap.grid.cells[testRow2 * cols + testCol2];
      if (cell2 && cell2.isWater && !(cell1 && cell1.isWater)) dir = -1;
    }
    chainWaterDir.push(dir);
  }

  // Draw main coastline — bold ink line like C# reference
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 3.0;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = 1.0;

  for (var ci = 0; ci < smoothed.length; ci++) {
    var smooth = smoothed[ci];
    ctx.beginPath();
    ctx.moveTo(smooth[0][0], smooth[0][1]);
    for (var p = 1; p < smooth.length; p++) {
      ctx.lineTo(smooth[p][0], smooth[p][1]);
    }
    ctx.stroke();
  }

  // Shore hachures — dense perpendicular tick marks on the water side
  // Dense and prominent like C# reference hand-drawn fantasy maps
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.5;

  for (var ci = 0; ci < smoothed.length; ci++) {
    var smooth = smoothed[ci];
    if (smooth.length < 5) continue;
    var waterDir = chainWaterDir[ci];

    // Draw hachures every ~3 pixels along the coast (dense like C# reference)
    var accumDist = 0;
    var hachureSpacing = 3;

    for (var p = 1; p < smooth.length; p++) {
      var prev = smooth[p - 1];
      var curr = smooth[p];
      var dx = curr[0] - prev[0];
      var dy = curr[1] - prev[1];
      var segLen = Math.sqrt(dx * dx + dy * dy);
      accumDist += segLen;

      if (accumDist >= hachureSpacing) {
        accumDist -= hachureSpacing;

        var next = smooth[Math.min(smooth.length - 1, p + 1)];
        var tdx = next[0] - prev[0];
        var tdy = next[1] - prev[1];
        var tlen = Math.sqrt(tdx * tdx + tdy * tdy) || 1;

        // Normal pointing into water
        var nx = -tdy / tlen * waterDir;
        var ny = tdx / tlen * waterDir;

        // Hachure length varies — prominent texture band like C# reference
        var hLen = 6 + Math.sin(p * 0.5) * 3;
        // Slight alpha variation for organic feel
        ctx.globalAlpha = 0.5 + Math.sin(p * 0.37) * 0.12;

        ctx.beginPath();
        ctx.moveTo(curr[0], curr[1]);
        ctx.lineTo(curr[0] + nx * hLen, curr[1] + ny * hLen);
        ctx.stroke();
      }
    }
  }

  // Multiple parallel shore lines — the hallmark of hand-drawn fantasy maps
  // Each line is progressively thinner, lighter, and further from the coast
  var shoreLines = [
    { offset: 5, width: 1.0, alpha: 0.35 },
    { offset: 10, width: 0.7, alpha: 0.22 },
    { offset: 16, width: 0.5, alpha: 0.14 },
    { offset: 23, width: 0.3, alpha: 0.08 }
  ];

  for (var si = 0; si < shoreLines.length; si++) {
    var sline = shoreLines[si];
    ctx.lineWidth = sline.width;
    ctx.globalAlpha = sline.alpha;

    for (var ci = 0; ci < smoothed.length; ci++) {
      var smooth = smoothed[ci];
      if (smooth.length < 5) continue;
      var waterDir = chainWaterDir[ci];

      ctx.beginPath();
      var started = false;
      for (var p = 0; p < smooth.length; p++) {
        var prev = smooth[Math.max(0, p - 1)];
        var curr = smooth[p];
        var next = smooth[Math.min(smooth.length - 1, p + 1)];

        var dx = next[0] - prev[0];
        var dy = next[1] - prev[1];
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var nx = -dy / len * sline.offset * waterDir;
        var ny = dx / len * sline.offset * waterDir;

        if (!started) {
          ctx.moveTo(curr[0] + nx, curr[1] + ny);
          started = true;
        } else {
          ctx.lineTo(curr[0] + nx, curr[1] + ny);
        }
      }
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 1.0;

  // IMPROVEMENT 4: Add jagged coastline details and small islands
  // Create rocky outcrops and small islands scattered near coastlines
  var rocks = [];
  for (var ci = 0; ci < smoothed.length; ci++) {
    var smooth = smoothed[ci];
    if (smooth.length < 5) continue;
    var waterDir = chainWaterDir[ci];

    // Sample coastal points for island generation
    for (var p = 0; p < smooth.length; p += Math.max(8, Math.floor(smooth.length / 15))) {
      var curr = smooth[p];
      var next = smooth[Math.min(smooth.length - 1, p + 1)];
      var dx = next[0] - curr[0];
      var dy = next[1] - curr[1];
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var nx = -dy / len * waterDir;
      var ny = dx / len * waterDir;

      // Jagged edge - add small rocks/outcrops jutting into water
      var rockCount = 1 + Math.floor(fmRand() * 3);
      for (var r = 0; r < rockCount; r++) {
        var offsetDist = 8 + fmRand() * 12;
        var jitterX = (fmRand() - 0.5) * 6;
        var jitterY = (fmRand() - 0.5) * 6;
        rocks.push({
          x: curr[0] + nx * offsetDist + jitterX,
          y: curr[1] + ny * offsetDist + jitterY,
          size: 0.5 + fmRand() * 1.5
        });
      }
    }
  }

  // Draw small rock outcrops and islands
  ctx.fillStyle = inkColor;
  ctx.globalAlpha = 0.35;
  for (var ri = 0; ri < rocks.length; ri++) {
    var rock = rocks[ri];
    // Jagged island shape - small irregular polygons
    ctx.beginPath();
    var sides = 3 + Math.floor(fmRand() * 3);
    for (var s = 0; s < sides; s++) {
      var angle = (s / sides) * Math.PI * 2;
      var jag = 0.7 + fmRand() * 0.3;
      var px = rock.x + Math.cos(angle) * rock.size * jag;
      var py = rock.y + Math.sin(angle) * rock.size * jag;
      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Add subtle outline
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.2;
    ctx.stroke();
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
  var lightColor = dark ? '#6a5a4a' : '#221508';

  // IMPROVEMENT 1: Use Perlin noise to create natural clustering and voids
  // instead of uniform grid-based placement
  var getClusteringNoise = function(sx, sy) {
    // Multi-octave Perlin noise for clustering behavior
    var n1 = fmValueNoise(sx * 0.008, sy * 0.008);
    var n2 = fmValueNoise(sx * 0.015, sy * 0.015) * 0.6;
    return (n1 + n2) / 1.6;
  };

  // Collect mountain/hill cells into spatial blocks with noise-based variation
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
        peakGrid[key] = {
          x: sx, y: sy,
          isMtn: isMtn,
          isSnow: cell.biome === 'snow_peak',
          isHill: isHill,
          priority: priority,
          height: cell.height,
          row: row,
          col: col,
          clustering: getClusteringNoise(sx, sy)
        };
      }
    }
  }

  // Add position jitter to break grid alignment with noise-guided variation
  var peaks = [];
  for (var key in peakGrid) {
    var pk = peakGrid[key];
    // Use clustering noise to vary jitter strength — creates natural grouping
    var jitterStrength = 0.2 + pk.clustering * 0.4;
    var jHash = ((pk.col * 2654435761 + pk.row * 340573321) >>> 0) % 1000;
    var jx = (jHash % 100 - 50) / 50 * (pk.isHill ? hillBlockW : mtBlockW) * jitterStrength;
    var jy = ((jHash * 7 + 13) % 100 - 50) / 50 * (pk.isHill ? hillBlockH : mtBlockH) * jitterStrength;
    pk.x += jx;
    pk.y += jy;
  }

  // Sort back-to-front for proper overlapping
  for (var key in peakGrid) {
    peaks.push(peakGrid[key]);
  }
  peaks.sort(function(a, b) { return a.row - b.row; });

  // Draw ridge lines connecting adjacent mountains first (background layer)
  ctx.strokeStyle = inkColor;
  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.25;
  for (var i = 0; i < peaks.length; i++) {
    for (var j = i + 1; j < peaks.length && j < i + 3; j++) {
      var pk1 = peaks[i];
      var pk2 = peaks[j];
      // Only connect nearby peaks
      var dx = pk2.x - pk1.x;
      var dy = pk2.y - pk1.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 65 && pk1.isMtn && pk2.isMtn) {
        ctx.beginPath();
        ctx.moveTo(pk1.x, pk1.y + 15);
        ctx.quadraticCurveTo((pk1.x + pk2.x) / 2, (pk1.y + pk2.y) / 2 - 10, pk2.x, pk2.y + 15);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1.0;

  // Draw each peak
  for (var i = 0; i < peaks.length; i++) {
    var pk = peaks[i];
    var cx = pk.x;
    var cy = pk.y;

    // Deterministic randomness from position
    var hash = (cx * 73 + cy * 137 + i * 31) % 1000;
    var rng = function() { hash = (hash * 1103515245 + 12345) & 0x7fffffff; return (hash % 1000) / 1000; };

    if (pk.isHill) {
      // Hills: gentle, very subtle rounded humps — barely visible like C# reference
      var hw = 6 + rng() * 5;
      var hh = 3 + rng() * 3;

      // Rounded hump outline — very light
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      var wobble1 = (rng() - 0.5) * 0.5;
      var wobble2 = (rng() - 0.5) * 0.5;
      var wobble3 = (rng() - 0.5) * 0.5;
      ctx.moveTo(cx - hw + wobble1, cy + wobble1);
      ctx.quadraticCurveTo(cx - hw * 0.3, cy - hh * 1.4 + wobble2, cx + wobble3, cy - hh + wobble2);
      ctx.quadraticCurveTo(cx + hw * 0.3, cy - hh * 1.4 + wobble3, cx + hw + wobble1, cy + wobble3);
      ctx.stroke();

      // 1-2 subtle hatching lines on left (shadow) face
      ctx.lineWidth = 0.5;
      ctx.globalAlpha = 0.2;
      var hillHatch = 1 + Math.floor(rng() * 2);
      for (var hhi = 0; hhi < hillHatch; hhi++) {
        var ht = 0.2 + (hhi / hillHatch) * 0.6;
        var hx = cx - hw * (1 - ht);
        var hy = cy - hh * ht * 0.8;
        var hLen = hh * (0.5 - ht * 0.3);
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + hLen * 0.2, hy + hLen);
        ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
      continue;
    }

    // === MOUNTAIN PEAK - IMPROVEMENT 3: 5 variations in shape, rotation, and cross-hatching ===
    // Variant selection based on position hash
    var variant = Math.floor(rng() * 5);
    var peakH = pk.isSnow ? 20 + rng() * 10 : 14 + rng() * 10;
    var baseW = peakH * (0.6 + rng() * 0.2);
    var lean = (rng() - 0.5) * 0.08;

    // Rotation multiplier based on variant for visual diversity
    var rotationFactor = [1.0, 0.85, 1.15, 0.9, 1.05][variant];

    // Create multiple ridgeline peaks with variant-specific proportions for visual variety
    var variantBaseWMult = [0.65, 0.75, 0.55, 0.7, 0.6][variant];
    var variantSecondaryMult = [0.6, 0.55, 0.65, 0.58, 0.62][variant];

    var mainTipX = cx + lean * baseW * rotationFactor;
    var mainTipY = cy - peakH;
    var leftX = cx - baseW * variantBaseWMult;
    var rightX = cx + baseW * 0.55;
    var baseY = cy;

    // Secondary peaks for ridgeline detail — varied proportions per variant
    var leftPeakX = leftX + baseW * 0.35;
    var leftPeakY = cy - peakH * variantSecondaryMult;
    var rightPeakX = rightX - baseW * 0.3;
    var rightPeakY = cy - peakH * 0.5;

    // Shadow fill on LEFT side (sunlight from right/southeast)
    ctx.fillStyle = shadowFill;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.moveTo(mainTipX, mainTipY);
    ctx.lineTo(leftPeakX, leftPeakY);
    ctx.lineTo(leftX, baseY);
    ctx.lineTo(cx - baseW * 0.08, baseY);
    ctx.closePath();
    ctx.fill();

    // Main peak outline with ridgeline detail
    ctx.strokeStyle = inkColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.95;
    ctx.lineWidth = 1.6;

    // Draw detailed ridgeline: left slope to left peak, then to main tip, then down
    ctx.beginPath();
    var wobbleLeft = (rng() - 0.5) * 0.8;
    ctx.moveTo(leftX + wobbleLeft, baseY + wobbleLeft);
    ctx.lineTo(leftPeakX, leftPeakY);
    ctx.lineTo(mainTipX, mainTipY);
    ctx.lineTo(rightPeakX, rightPeakY);
    var wobbleRight = (rng() - 0.5) * 0.6;
    ctx.lineTo(rightX + wobbleRight, baseY + wobbleRight);
    ctx.stroke();

    // Add subtle shadow cast to southeast of main peak
    ctx.strokeStyle = shadowFill;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.moveTo(mainTipX, mainTipY);
    ctx.lineTo(mainTipX + 3, mainTipY + 3);
    ctx.stroke();

    // === DETAILED CROSS-HATCHING on shadow side — IMPROVEMENT 3: variant-specific hatch patterns ===
    ctx.strokeStyle = inkColor;
    // Vary hatch count and angle by variant for visual diversity
    var hatchCountBase = variant === 0 ? 2 : variant === 1 ? 4 : variant === 2 ? 3 : variant === 3 ? 3 : 2;
    var hatchCount = hatchCountBase + Math.floor(rng() * 2);
    for (var hi = 0; hi < hatchCount; hi++) {
      var hatchT = 0.2 + (hi / (hatchCount - 1)) * 0.65;

      // Start point on left slope, varied along ridgeline
      var isLeftPeak = hatchT < 0.4;
      var hStartX = isLeftPeak ?
        mainTipX + (leftPeakX - mainTipX) * (hatchT / 0.4) :
        leftPeakX + (mainTipX - leftPeakX) * ((hatchT - 0.4) / 0.6);
      var hStartY = isLeftPeak ?
        mainTipY + (leftPeakY - mainTipY) * (hatchT / 0.4) :
        leftPeakY + (mainTipY - leftPeakY) * ((hatchT - 0.4) / 0.6);

      // End point: rightward hatching lines
      var hEndX = hStartX + baseW * (0.3 + rng() * 0.3);
      var hEndY = hStartY + baseW * (0.05 + rng() * 0.08);

      ctx.lineWidth = 1.1 - hatchT * 0.35;
      ctx.globalAlpha = 0.55 - hatchT * 0.2;

      ctx.beginPath();
      ctx.moveTo(hStartX, hStartY);
      var cpX = (hStartX + hEndX) / 2 + (rng() - 0.5) * 2;
      var cpY = (hStartY + hEndY) / 2 + peakH * 0.03;
      ctx.quadraticCurveTo(cpX, cpY, hEndX, hEndY);
      ctx.stroke();
    }

    // Right side subtle hatching
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 0.7;
    var rightHatch = 1 + Math.floor(rng() * 2);
    for (var rh = 0; rh < rightHatch; rh++) {
      var rt = 0.5 + (rh / (rightHatch + 1)) * 0.4;
      var rsx = mainTipX + (rightPeakX - mainTipX) * rt;
      var rsy = mainTipY + (rightPeakY - mainTipY) * rt;
      var rl = peakH * 0.06;
      ctx.beginPath();
      ctx.moveTo(rsx, rsy);
      ctx.lineTo(rsx - rl * 0.35, rsy + rl * 0.75);
      ctx.stroke();
    }

    // === SNOW CAP with broken edge ===
    if (pk.isSnow) {
      var snowH = peakH * 0.32;
      var snowT = snowH / peakH;
      var sLeft = mainTipX + (leftX - mainTipX) * snowT;
      var sRight = mainTipX + (rightX - mainTipX) * snowT;

      ctx.fillStyle = dark ? '#e8e8f0' : '#faf8f2';
      ctx.globalAlpha = 0.94;
      ctx.beginPath();
      ctx.moveTo(mainTipX, mainTipY);

      // Jagged broken edge — more realistic
      var jags = 5;
      for (var jag = 0; jag <= jags; jag++) {
        var jagT = jag / jags;
        var jagX = sLeft + (sRight - sLeft) * jagT;
        var jagY = mainTipY + snowH + (rng() - 0.5) * 3.5;
        if (jag === 0) ctx.lineTo(sLeft, jagY);
        else ctx.lineTo(jagX, jagY);
      }
      ctx.lineTo(sRight, mainTipY + snowH + (rng() - 0.5) * 3.5);
      ctx.closePath();
      ctx.fill();

      // Subtle outline around snow cap
      ctx.strokeStyle = inkColor;
      ctx.lineWidth = 0.7;
      ctx.globalAlpha = 0.35;
      ctx.stroke();
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

    // Draw as smooth path with subtle widening stroke — like C# reference
    var passes = [
      { widthStart: 0.5, widthEnd: 1.8, alpha: 0.6 },
      { widthStart: 0.3, widthEnd: 1.0, alpha: 0.15 }
    ];

    for (var pass = 0; pass < passes.length; pass++) {
      var p_cfg = passes[pass];
      ctx.strokeStyle = riverColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = p_cfg.alpha;

      // IMPROVEMENT 5: Add natural meandering curves with tributaries
      // Draw segments with interpolated width and Catmull-Rom smoothing
      for (var sp_idx = 0; sp_idx < screenPath.length - 1; sp_idx++) {
        var t = screenPath.length > 1 ? sp_idx / (screenPath.length - 1) : 0;
        ctx.lineWidth = p_cfg.widthStart + (p_cfg.widthEnd - p_cfg.widthStart) * t;

        var p0 = screenPath[Math.max(0, sp_idx - 1)];
        var p1 = screenPath[sp_idx];
        var p2 = screenPath[sp_idx + 1];
        var p3 = screenPath[Math.min(screenPath.length - 1, sp_idx + 2)];

        // Add subtle meander based on position
        var meaderHash = ((r * 73 + sp_idx * 137) >>> 0) % 1000;
        var meander = Math.sin(meaderHash / 1000 * Math.PI * 6) * 1.5;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);

        // Catmull-Rom interpolation with meander
        if (sp_idx < screenPath.length - 2) {
          var mx = (p2.x + p3.x) / 2 + meander;
          var my = (p2.y + p3.y) / 2;
          ctx.quadraticCurveTo(p2.x + meander * 0.5, p2.y, mx, my);
        } else {
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.stroke();
      }

      // IMPROVEMENT 5: Draw tributary lines joining the main river
      if (pass === 1 && screenPath.length > 5) {
        var tributaryAlpha = p_cfg.alpha * 0.4;
        ctx.globalAlpha = tributaryAlpha;
        ctx.lineWidth = 0.4;

        // Add a few tributaries at various points
        for (var t_idx = 0; t_idx < Math.min(3, Math.floor(screenPath.length / 8)); t_idx++) {
          var riverIdx = Math.floor((t_idx + 1) * screenPath.length / 4);
          if (riverIdx >= screenPath.length) continue;

          var riverPt = screenPath[riverIdx];
          // Draw tributary branching off at angle
          var angle = (t_idx % 2 === 0 ? 1 : -1) * (Math.PI / 6 + fmRand() * 0.3);
          var prevPt = screenPath[Math.max(0, riverIdx - 1)];
          var dir = Math.atan2(riverPt.y - prevPt.y, riverPt.x - prevPt.x);

          var tributaryLen = 25 + fmRand() * 15;
          var endX = riverPt.x + Math.cos(dir + angle) * tributaryLen;
          var endY = riverPt.y + Math.sin(dir + angle) * tributaryLen;

          ctx.beginPath();
          ctx.moveTo(riverPt.x, riverPt.y);
          // Curve away from main river
          var cpX = riverPt.x + Math.cos(dir + angle) * tributaryLen * 0.4;
          var cpY = riverPt.y + Math.sin(dir + angle) * tributaryLen * 0.4;
          ctx.quadraticCurveTo(cpX, cpY, endX, endY);
          ctx.stroke();
        }
      }
    }

    // River name label
    if (river.name && screenPath.length > 4) {
      var midIdx = Math.floor(screenPath.length / 2);
      var midPt = screenPath[midIdx];
      var nxtPt = screenPath[Math.min(midIdx + 1, screenPath.length - 1)];

      var angle = Math.atan2(nxtPt.y - midPt.y, nxtPt.x - midPt.x);
      // Flip if upside down
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

var fmRenderRoads = function(ctx) {
  if (!FMap.world || !FMap.world.roads) return;

  var dark = FMap.dark;
  var majorRoadColor = dark ? '#5a4a3a' : '#4a3015';
  var minorRoadColor = dark ? '#4a3a2a' : '#5a4020';
  var trailColor = dark ? '#3a2a1a' : '#6a5030';

  for (var road_idx = 0; road_idx < FMap.world.roads.length; road_idx++) {
    var road = FMap.world.roads[road_idx];
    if (!road.path || road.path.length < 2) continue;

    // Convert path to screen coordinates
    var screenPath = [];
    for (var p = 0; p < road.path.length; p++) {
      var pathPoint = road.path[p];
      var col = pathPoint.col;
      var row = pathPoint.row;
      var screenPos = fmCellToScreen(col, row);
      screenPath.push({x: screenPos.x + fmGetCellSize().w / 2, y: screenPos.y + fmGetCellSize().h / 2});
    }

    if (screenPath.length < 2) continue;

    // Set road style based on type — default to subtle dotted
    var roadColor = majorRoadColor;
    var roadWidth = 0.6;
    var dashPattern = [2, 5];

    if (road.type === 'major') {
      roadColor = majorRoadColor;
      roadWidth = 0.7;
      dashPattern = [3, 4]; // Subtle dotted line like C# reference
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
    ctx.lineWidth = roadWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash(dashPattern);
    ctx.globalAlpha = 0.3; // barely visible like C# reference

    // IMPROVEMENT 5: Draw roads with natural curves and meanders
    // Add subtle waviness to roads to avoid straight lines
    if (screenPath.length === 2) {
      // For 2-point roads, add subtle curve
      var dx = screenPath[1].x - screenPath[0].x;
      var dy = screenPath[1].y - screenPath[0].y;
      var len = Math.sqrt(dx * dx + dy * dy) || 1;
      var perpX = -dy / len;
      var perpY = dx / len;

      // Add slight curve to the road
      var curveAmount = len * 0.1 * (0.5 + fmRand() * 0.5);
      var midX = screenPath[0].x + dx / 2 + perpX * curveAmount;
      var midY = screenPath[0].y + dy / 2 + perpY * curveAmount;

      ctx.beginPath();
      ctx.moveTo(screenPath[0].x, screenPath[0].y);
      ctx.quadraticCurveTo(midX, midY, screenPath[1].x, screenPath[1].y);
      ctx.stroke();
    } else {
      // For longer paths, use Catmull-Rom style curves with slight meanders
      ctx.beginPath();
      ctx.moveTo(screenPath[0].x, screenPath[0].y);

      for (var sp = 1; sp < screenPath.length - 1; sp++) {
        var prevPt = screenPath[Math.max(0, sp - 1)];
        var currPt = screenPath[sp];
        var nextPt = screenPath[Math.min(screenPath.length - 1, sp + 1)];
        var nextNextPt = screenPath[Math.min(screenPath.length - 1, sp + 2)];

        // Use Catmull-Rom control points but add slight meander
        var controlX = currPt.x;
        var controlY = currPt.y;

        // Add meander based on position hash
        var meaderHash = ((road_idx * 73 + sp * 137) >>> 0) % 1000;
        var meander = Math.sin(meaderHash / 1000 * Math.PI * 4) * 2;

        var endX = (currPt.x + nextPt.x) / 2 + meander;
        var endY = (currPt.y + nextPt.y) / 2 + meander * 0.5;

        ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      }

      if (screenPath.length >= 3) {
        ctx.quadraticCurveTo(
          screenPath[screenPath.length - 2].x,
          screenPath[screenPath.length - 2].y,
          screenPath[screenPath.length - 1].x,
          screenPath[screenPath.length - 1].y
        );
      }
      ctx.stroke();
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

  for (var i = 0; i < settlements.length; i++) {
    var city = settlements[i];
    if (!city || city.col === undefined || city.row === undefined) continue;
    var screen = fmCellToScreen(city.col, city.row);
    var x = screen.x;
    var y = screen.y;

    // IMPROVEMENT 3: Add visual variation to settlement symbols
    var symbolVariant = (i + city.col * 73 + city.row * 137) % 3;

    ctx.fillStyle = inkColor;
    ctx.strokeStyle = inkColor;

    if (city.type === 'capital') {
      // === CASTLE: Detailed keep with towers, walls, and pennant flag ===
      var size = 10;
      var cw = size * 0.65;  // castle width
      var ch = size * 0.55;  // castle height

      // Outer walls rectangle with crenellations
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 1.9;
      ctx.strokeStyle = inkColor;
      ctx.beginPath();
      ctx.moveTo(x - cw, y + ch * 0.35);
      ctx.lineTo(x - cw, y - ch);
      ctx.lineTo(x + cw, y - ch);
      ctx.lineTo(x + cw, y + ch * 0.35);
      ctx.stroke();

      // Draw crenellations (castle top)
      ctx.lineWidth = 1.2;
      var crennelW = cw * 0.25;
      ctx.beginPath();
      ctx.moveTo(x - cw, y - ch);
      for (var crn = 0; crn < 4; crn++) {
        var cx = x - cw + (crn + 1) * cw * 0.5;
        ctx.lineTo(cx - crennelW * 0.3, y - ch);
        ctx.lineTo(cx - crennelW * 0.3, y - ch - 1.5);
        ctx.lineTo(cx + crennelW * 0.3, y - ch - 1.5);
        ctx.lineTo(cx + crennelW * 0.3, y - ch);
      }
      ctx.lineTo(x + cw, y - ch);
      ctx.stroke();

      // Corner towers (filled circles with strokes)
      var towerR = 2.5;
      ctx.lineWidth = 1.6;
      ctx.globalAlpha = 0.82;
      var towers = [
        {px: x - cw, py: y - ch},
        {px: x + cw, py: y - ch},
        {px: x - cw, py: y + ch * 0.35},
        {px: x + cw, py: y + ch * 0.35}
      ];
      for (var t = 0; t < towers.length; t++) {
        ctx.beginPath();
        ctx.arc(towers[t].px, towers[t].py, towerR, 0, Math.PI * 2);
        ctx.stroke();
        // Tower window
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(towers[t].px, towers[t].py, 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.82;
      }

      // Central keep/donjon tower
      ctx.globalAlpha = 0.88;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = inkColor;
      ctx.beginPath();
      ctx.rect(x - 1.8, y - ch * 0.6, 3.6, ch * 0.8);
      ctx.stroke();

      // Central spire with tapering
      ctx.globalAlpha = 0.88;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(x, y - ch * 0.6);
      ctx.lineTo(x - 0.5, y - ch - 2);
      ctx.lineTo(x + 0.5, y - ch - 2);
      ctx.closePath();
      ctx.stroke();

      // Spire point
      ctx.beginPath();
      ctx.moveTo(x, y - ch - 2);
      ctx.lineTo(x, y - ch - 4);
      ctx.stroke();

      // Pennant flag on spire (larger and more detailed)
      ctx.fillStyle = isLight ? '#d41e3a' : '#ff5577';
      ctx.globalAlpha = 0.92;
      ctx.beginPath();
      ctx.moveTo(x, y - ch - 4);
      ctx.lineTo(x + 2.5, y - ch - 6);
      ctx.lineTo(x + 1.5, y - ch - 5);
      ctx.lineTo(x + 2.5, y - ch - 5);
      ctx.lineTo(x, y - ch - 3.5);
      ctx.closePath();
      ctx.fill();

      // Pennant outline
      ctx.strokeStyle = isLight ? '#8a0e1a' : '#cc2255';
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.8;
      ctx.stroke();

      // Label — bold small caps with shadow
      ctx.font = 'bold small-caps 11px Palatino, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 0.92;
      ctx.strokeStyle = parchmentHalo;
      ctx.lineWidth = 5;
      ctx.lineJoin = 'round';
      ctx.strokeText((city.name || '').substring(0, 40), x, y + 20);
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = inkColor;
      ctx.fillText((city.name || '').substring(0, 40), x, y + 20);

    } else if (city.type === 'city') {
      // === CITY: Cluster with variant arrangements ===
      // IMPROVEMENT 3: 3 different city layouts for visual variety
      var bSize = 3.5;
      var spacing = 2.5;

      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 1.5;

      if (symbolVariant === 0) {
        // Layout 1: Triangle of buildings with central dome
        ctx.beginPath();
        ctx.rect(x - bSize - spacing, y - bSize, bSize, bSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(x - spacing / 2, y - bSize - 1.5, bSize, bSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(x + spacing, y - bSize + 0.5, bSize, bSize);
        ctx.stroke();
      } else if (symbolVariant === 1) {
        // Layout 2: Linear arrangement
        ctx.beginPath();
        ctx.rect(x - bSize - 2, y - bSize * 0.7, bSize, bSize * 0.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(x - 0.5, y - bSize, bSize, bSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(x + bSize + 1.5, y - bSize * 0.6, bSize * 0.9, bSize * 0.8);
        ctx.stroke();
      } else {
        // Layout 3: Square arrangement with courtyard
        ctx.beginPath();
        ctx.rect(x - bSize, y - bSize, bSize * 0.9, bSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(x + 0.5, y - bSize, bSize * 0.9, bSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(x - bSize, y, bSize * 0.9, bSize * 0.8);
        ctx.stroke();
        ctx.beginPath();
        ctx.rect(x + 0.5, y, bSize * 0.9, bSize * 0.8);
        ctx.stroke();
      }

      // Central dome/spire (all variants have this)
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(x, y - 1, 2.5, Math.PI, 0, false);
      ctx.stroke();

      // Spire on dome
      ctx.beginPath();
      ctx.moveTo(x, y - 1);
      ctx.lineTo(x, y - 5);
      ctx.stroke();

      // Label
      ctx.font = 'small-caps 10px Palatino, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = parchmentHalo;
      ctx.lineWidth = 2.5;
      ctx.strokeText((city.name || '').substring(0, 40), x, y + 15);
      ctx.fillStyle = inkColor;
      ctx.fillText((city.name || '').substring(0, 40), x, y + 15);

    } else if (city.type === 'town') {
      // === TOWN: Houses with peaked roofs (3 variants) ===
      var hSize = 2.8;

      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 1.3;

      if (symbolVariant === 0) {
        // Variant 0: Triangular arrangement
        // House 1 (left)
        ctx.beginPath();
        ctx.moveTo(x - hSize - 1.5, y - hSize);
        ctx.lineTo(x - hSize, y);
        ctx.lineTo(x - 1.5, y);
        ctx.closePath();
        ctx.stroke();

        // House 2 (center, taller)
        ctx.beginPath();
        ctx.moveTo(x, y - hSize * 1.1);
        ctx.lineTo(x - hSize * 0.9, y);
        ctx.lineTo(x + hSize * 0.9, y);
        ctx.closePath();
        ctx.stroke();

        // House 3 (right)
        ctx.beginPath();
        ctx.moveTo(x + hSize + 1.5, y - hSize);
        ctx.lineTo(x + 1.5, y);
        ctx.lineTo(x + hSize, y);
        ctx.closePath();
        ctx.stroke();
      } else if (symbolVariant === 1) {
        // Variant 1: Linear arrangement
        ctx.beginPath();
        ctx.moveTo(x - hSize * 1.2, y - hSize * 0.9);
        ctx.lineTo(x - hSize * 1.5, y);
        ctx.lineTo(x - hSize * 0.9, y);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + 0.5, y - hSize);
        ctx.lineTo(x - hSize * 0.4, y);
        ctx.lineTo(x + hSize * 0.4, y);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + hSize * 1.2, y - hSize * 0.9);
        ctx.lineTo(x + hSize * 0.9, y);
        ctx.lineTo(x + hSize * 1.5, y);
        ctx.closePath();
        ctx.stroke();
      } else {
        // Variant 2: Clustered
        ctx.beginPath();
        ctx.moveTo(x - hSize * 0.6, y - hSize);
        ctx.lineTo(x - hSize * 1.2, y);
        ctx.lineTo(x - 0.2, y);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + hSize * 0.6, y - hSize);
        ctx.lineTo(x + 0.2, y);
        ctx.lineTo(x + hSize * 1.2, y);
        ctx.closePath();
        ctx.stroke();
      }

      // Chimney smoke curl on tallest house
      ctx.strokeStyle = lightInk;
      ctx.lineWidth = 0.8;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(x + hSize * 0.3, y - hSize * 0.8);
      ctx.quadraticCurveTo(x + hSize * 0.6, y - hSize * 1.3, x + hSize * 0.3, y - hSize * 1.6);
      ctx.stroke();

      ctx.strokeStyle = inkColor;

      // Label
      ctx.font = '9px Palatino, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = parchmentHalo;
      ctx.lineWidth = 2;
      ctx.strokeText((city.name || '').substring(0, 40), x, y + 12);
      ctx.fillStyle = inkColor;
      ctx.fillText((city.name || '').substring(0, 40), x, y + 12);

    } else if (city.type === 'hamlet') {
      // === HAMLET/VILLAGE: Single small house with chimney smoke ===
      var hh = 3;  // house height
      var hw = 2;  // half-width

      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 1.2;

      // Single peaked house
      ctx.beginPath();
      ctx.moveTo(x, y - hh);            // Roof peak
      ctx.lineTo(x - hw, y);            // Left base
      ctx.lineTo(x + hw, y);            // Right base
      ctx.closePath();
      ctx.stroke();

      // Small door
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(x - 0.5, y - 0.5);
      ctx.lineTo(x - 0.5, y);
      ctx.lineTo(x + 0.5, y);
      ctx.lineTo(x + 0.5, y - 0.5);
      ctx.stroke();

      // Chimney with smoke
      ctx.strokeStyle = lightInk;
      ctx.lineWidth = 0.7;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(x + hw - 0.8, y - hh * 0.6);
      ctx.lineTo(x + hw - 0.8, y - hh * 0.2);
      ctx.stroke();

      // Smoke puff
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.arc(x + hw - 0.5, y - hh * 0.8, 1, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = inkColor;

      // Label — small italic
      ctx.font = 'italic 8px Palatino, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.globalAlpha = 1.0;
      ctx.strokeStyle = parchmentHalo;
      ctx.lineWidth = 1.5;
      ctx.strokeText((city.name || '').substring(0, 40), x, y + 10);
      ctx.fillStyle = inkColor;
      ctx.fillText((city.name || '').substring(0, 40), x, y + 10);
    }
    ctx.globalAlpha = 1.0;
  }
};


