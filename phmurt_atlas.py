#!/usr/bin/env python3
"""
PH Murt Studios — hybrid fantasy atlas generator (phmurtstudios.com)

Pipeline (cartographic system, not pure noise):
  1) Hand-authored continental skeleton (Shapely polygons) + ridge polylines + region seeds.
  2) Structural terrain mesh: Poisson-style site sampling on land → SciPy Voronoi → cells clipped
     to land (shared topology for all geographic layers).
  3) Elevation-first field on cell centroids: coast distance, ridge spines, subtle harmonics;
     light graph smoothing to remove flat sinks while preserving ridge highs.
  4) Hydrology: D8-like downhill routing on the Voronoi adjacency graph, flow accumulation,
     trunk+tributary extraction from high-accumulation edges, width ∝ log(flow).
  5) Lakes: local depressions (no downhill) merged to polygons; outlets to lowest neighbor;
     snapped to river network where possible.
  6) Regions: multi-source Dijkstra on the same graph with coast/ridge/river crossing costs.
  7) Contours: regular grid via linear interpolation (griddata) + marching squares → atlas lines.
  8) Layered SVG (svgwrite): sea, land wash, regions, contours, ridges, lakes, rivers, borders,
     settlements, labels.

Dependencies: numpy, scipy, shapely, svgwrite  (see requirements_phmurt_atlas.txt)

Key tunables (AtlasParams):
  - voronoi_sites       : mesh density (structure resolution)
  - coast_elev_scale    : how fast elevation rises inland from shore
  - ridge_prominence    : mountain control on heights and region costs
  - river_acc_q         : quantile threshold for perennial channels (density)
  - contour_levels      : number of closed topographic intervals
  - smooth_passes       : hydrology preconditioning (removes spurious sinks)
"""

from __future__ import annotations

import argparse
import heapq
import math
import random
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Sequence

import numpy as np
from scipy.interpolate import griddata
from scipy.spatial import Voronoi

from shapely.geometry import LineString, MultiPolygon, Point, Polygon
from shapely.ops import unary_union
from shapely.prepared import prep

import svgwrite
from svgwrite import cm, mm


# ---------------------------------------------------------------------------
# Tunable parameters
# ---------------------------------------------------------------------------


@dataclass
class AtlasParams:
    width: float = 2800.0
    height: float = 1800.0
    seed: int = 23
    max_attempts: int = 40
    # Structural mesh
    voronoi_sites: int = 950
    clip_margin: float = 180.0
    # Elevation
    coast_elev_scale: float = 220.0
    ridge_prominence: float = 1.05
    ridge_influence_px: float = 95.0
    harmonic_amp: float = 0.018
    smooth_passes: int = 6
    smooth_ridge_protect: float = 0.42
    smooth_mix: float = 0.22
    # Hydrology
    river_acc_q: float = 0.82  # higher → fewer, bolder rivers
    min_stream_cells: int = 8
    lake_sink_min_acc: float = 6.0
    lake_merge_buf: float = 4.0
    # Regions
    river_barrier_cost: float = 14.0
    ridge_barrier_cost: float = 9.0
    # Contours
    contour_grid_w: int = 360
    contour_grid_h: int = 240
    contour_levels: int = 6
    contour_stroke: float = 0.65
    contour_opacity: float = 0.11
    # Output
    output_svg: Path = field(default_factory=lambda: Path("generated/phmurt_atlas.svg"))
    output_png: Path | None = None


# ---------------------------------------------------------------------------
# 1) Macro skeleton (normalized 0–1 coords → map px)
# ---------------------------------------------------------------------------

# Same macro “big idea” as the legacy generator: west mass, isthmus, east shield, mid gulf, SE hook.
MAINLAND_NORM: list[tuple[float, float]] = [
    (0.070, 0.898), (0.058, 0.748), (0.072, 0.568), (0.095, 0.382), (0.138, 0.222),
    (0.215, 0.118), (0.328, 0.062), (0.455, 0.055), (0.585, 0.072), (0.708, 0.108),
    (0.828, 0.168), (0.912, 0.248), (0.938, 0.322), (0.898, 0.368), (0.782, 0.348),
    (0.642, 0.338), (0.528, 0.352), (0.432, 0.392), (0.382, 0.452), (0.368, 0.518),
    (0.392, 0.582), (0.458, 0.648), (0.552, 0.698), (0.662, 0.738), (0.772, 0.778),
    (0.862, 0.832), (0.888, 0.898), (0.778, 0.928), (0.598, 0.938), (0.418, 0.922),
    (0.268, 0.888), (0.152, 0.858),
]

ISLANDS_NORM: list[list[tuple[float, float]]] = [
    [(0.038, 0.256), (0.066, 0.184), (0.128, 0.162), (0.172, 0.218), (0.158, 0.294), (0.094, 0.304), (0.050, 0.286)],
    [(0.620, 0.084), (0.658, 0.056), (0.694, 0.082), (0.688, 0.126), (0.644, 0.136), (0.614, 0.110)],
    [(0.862, 0.158), (0.906, 0.128), (0.952, 0.146), (0.966, 0.202), (0.936, 0.244), (0.884, 0.234), (0.858, 0.198)],
    [(0.856, 0.772), (0.894, 0.724), (0.942, 0.742), (0.954, 0.802), (0.918, 0.848), (0.866, 0.830), (0.842, 0.794)],
    [(0.046, 0.778), (0.086, 0.728), (0.130, 0.746), (0.144, 0.810), (0.102, 0.848), (0.052, 0.824), (0.030, 0.798)],
]

# Named ridgelines (normalized); rendered and used in elevation.
RIDGES_NORM: list[tuple[str, list[tuple[float, float]]]] = [
    ("Ironspine Range", [(0.12, 0.78), (0.16, 0.52), (0.20, 0.32), (0.28, 0.18)]),
    ("Stormcrown Range", [(0.52, 0.10), (0.68, 0.095), (0.82, 0.14), (0.90, 0.22)]),
    ("Ashen Divide", [(0.42, 0.58), (0.55, 0.68), (0.68, 0.76), (0.82, 0.84)]),
]

REGION_DEFS: list[dict[str, object]] = [
    {"key": "essear", "name": "Essear", "fill": "#d5d0b8", "seed": (0.222, 0.348), "label": (0.248, 0.368), "subtitle": "(Dotharlum)"},
    {"key": "beltros", "name": "Belros", "fill": "#d2ccb4", "seed": (0.648, 0.198), "label": (0.668, 0.218)},
    {"key": "theanas", "name": "Theanas", "fill": "#cfc8ae", "seed": (0.842, 0.448), "label": (0.838, 0.438)},
    {"key": "fara", "name": "Fara", "fill": "#d8d2bc", "seed": (0.152, 0.748), "label": (0.182, 0.772)},
    {"key": "elonia", "name": "Elonia", "fill": "#d4ceb6", "seed": (0.398, 0.548), "label": (0.412, 0.562)},
    {"key": "cyrin", "name": "Cyrin", "fill": "#d0cab2", "seed": (0.598, 0.722), "label": (0.612, 0.732)},
    {"key": "dravina", "name": "Dravina", "fill": "#ccc6ac", "seed": (0.812, 0.812), "label": (0.798, 0.798)},
]

CITIES: list[tuple[str, tuple[float, float], bool, tuple[float, float]]] = [
    ("Goldug", (0.168, 0.288), False, (0, -18)),
    ("Lawklif", (0.292, 0.338), False, (0, -18)),
    ("Rynwood", (0.228, 0.448), False, (0, 22)),
    ("Regnwald", (0.582, 0.152), True, (0, -18)),
    ("Beowick", (0.702, 0.188), False, (0, -18)),
    ("Gerenwalde", (0.768, 0.268), False, (0, -18)),
    ("Ilaes", (0.822, 0.468), True, (0, -18)),
    ("Dremoor", (0.712, 0.412), False, (0, 22)),
    ("Feradell", (0.092, 0.628), False, (0, -18)),
    ("Duskhold", (0.198, 0.762), False, (0, -18)),
    ("Palanor", (0.108, 0.862), False, (0, -18)),
    ("Anora", (0.328, 0.508), False, (0, -18)),
    ("Kronham", (0.432, 0.542), True, (0, -18)),
    ("Wydale", (0.448, 0.688), False, (0, 22)),
    ("Lindel", (0.542, 0.668), True, (0, -18)),
    ("Thebury", (0.642, 0.748), False, (0, 22)),
    ("Zarakyr", (0.588, 0.852), False, (0, -18)),
    ("Loyarn", (0.702, 0.722), False, (0, -18)),
    ("Gildafell", (0.848, 0.868), True, (0, 22)),
]

SEA_LABELS: list[tuple[str, tuple[float, float], float, int, float]] = [
    ("Sea of Frost", (0.128, 0.068), -8, 34, 0.38),
    ("Sea of Winds", (0.920, 0.180), 6, 34, 0.38),
    ("Sea of Silver", (0.900, 0.600), 72, 30, 0.32),
    ("Sea of Twilight", (0.700, 0.970), -3, 30, 0.30),
    ("Vestmar Gulf", (0.58, 0.36), -4, 24, 0.36),
]

LAKE_NAMES: list[tuple[str, tuple[float, float]]] = [
    ("Lake Aster", (0.30, 0.44)),
    ("Lake Petrel", (0.58, 0.54)),
    ("Lunmere", (0.14, 0.68)),
]


def _scale_poly(norm_pts: Sequence[tuple[float, float]], w: float, h: float) -> list[tuple[float, float]]:
    return [(x * w, y * h) for x, y in norm_pts]


def build_macro_geometry(p: AtlasParams) -> tuple[Polygon, list[Polygon], list[LineString], list[tuple[str, LineString]]]:
    w, h = p.width, p.height
    mainland = Polygon(_scale_poly(MAINLAND_NORM, w, h))
    if not mainland.is_valid:
        mainland = mainland.buffer(0)
    islands = []
    for ring in ISLANDS_NORM:
        po = Polygon(_scale_poly(ring, w, h))
        if po.is_valid and po.area > 1:
            islands.append(po)
    land = unary_union([mainland, *islands])
    ridges = []
    ridge_named = []
    for name, pts in RIDGES_NORM:
        ls = LineString(_scale_poly(pts, w, h))
        ridges.append(ls)
        ridge_named.append((name, ls))
    return mainland, islands, ridges, ridge_named


def sample_land_sites(land: Polygon, n: int, rng: random.Random) -> np.ndarray:
    """Rejection sampling on land union (structured, not grid-aligned)."""
    minx, miny, maxx, maxy = land.bounds
    pts: list[list[float]] = []
    guard = 0
    while len(pts) < n and guard < n * 80:
        guard += 1
        x = rng.uniform(minx, maxx)
        y = rng.uniform(miny, maxy)
        pt = Point(x, y)
        if land.contains(pt) or land.covers(pt):
            # mild minimum spacing (approximate Poisson)
            ok = True
            for px, py in pts[-200:]:
                if (px - x) ** 2 + (py - y) ** 2 < (12 + rng.random() * 8) ** 2:
                    ok = False
                    break
            if ok:
                pts.append([x + rng.gauss(0, 0.8), y + rng.gauss(0, 0.8)])
    while len(pts) < n:
        x = rng.uniform(minx, maxx)
        y = rng.uniform(miny, maxy)
        if land.contains(Point(x, y)):
            pts.append([x, y])
    return np.array(pts[:n], dtype=np.float64)


def voronoi_cells_on_land(vor: Voronoi, land: Polygon) -> tuple[np.ndarray, list[Polygon], list[int]]:
    """Clip each finite Voronoi region to land; keep cells with sufficient area."""
    polys: list[Polygon] = []
    site_ids: list[int] = []
    new_pts: list[list[float]] = []
    land_p = prep(land.buffer(0))
    for i, pt in enumerate(vor.points):
        reg = vor.regions[vor.point_region[i]]
        if -1 in reg or len(reg) < 3:
            continue
        verts = [vor.vertices[v] for v in reg]
        try:
            raw = Polygon(verts)
        except Exception:
            continue
        if not raw.is_valid:
            raw = raw.buffer(0)
        if not land_p.intersects(raw):
            continue
        inter = raw.intersection(land.buffer(0))
        if inter.is_empty:
            continue
        if inter.geom_type == "Polygon":
            g = inter
        elif inter.geom_type == "MultiPolygon":
            g = max(inter.geoms, key=lambda q: q.area)
        else:
            continue
        if g.area < 80.0:
            continue
        polys.append(g)
        site_ids.append(i)
        new_pts.append([float(pt[0]), float(pt[1])])
    return np.array(new_pts, dtype=np.float64), polys, site_ids


def build_adjacency(vor: Voronoi, site_ids: list[int]) -> list[list[int]]:
    id_set = set(site_ids)
    idx_map = {sid: k for k, sid in enumerate(site_ids)}
    adj: list[list[int]] = [[] for _ in site_ids]
    for a, b in vor.ridge_points:
        if a in id_set and b in id_set:
            ia, ib = idx_map[a], idx_map[b]
            adj[ia].append(ib)
            adj[ib].append(ia)
    for i in range(len(adj)):
        adj[i] = sorted(set(adj[i]))
    return adj


def dist_to_coast(land: Polygon, x: float, y: float) -> float:
    return float(land.boundary.distance(Point(x, y)))


def ridge_field(x: float, y: float, ridges: list[LineString], strength: float, infl: float) -> float:
    m = 0.0
    p = Point(x, y)
    for ls in ridges:
        d = p.distance(ls)
        m = max(m, strength * math.exp(-((d / infl) ** 2.15)))
    return m


def polygon_area_ratio(poly: Polygon) -> tuple[float, float]:
    b = poly.bounds
    w, h = max(b[2] - b[0], 1e-6), max(b[3] - b[1], 1e-6)
    fill = poly.area / (w * h)
    return fill, poly.area


def convexity_ratio(poly: Polygon) -> float:
    try:
        hull = poly.convex_hull
        return poly.area / max(hull.area, 1e-9)
    except Exception:
        return 1.0


@dataclass
class TerrainMesh:
    sites: np.ndarray
    cells: list[Polygon]
    centroid_xy: np.ndarray
    elev: np.ndarray
    ridge_strength: np.ndarray
    coast_dist: np.ndarray
    adj: list[list[int]]
    down: np.ndarray
    acc: np.ndarray
    is_coast: np.ndarray
    land: Polygon


def build_mesh_and_elevation(p: AtlasParams, land: Polygon, ridges: list[LineString], rng: random.Random) -> TerrainMesh:
    sites = sample_land_sites(land, p.voronoi_sites, rng)
    vor = Voronoi(sites)
    sites_f, polys_f, site_ids_f = voronoi_cells_on_land(vor, land)
    adj = build_adjacency(vor, site_ids_f)
    n = len(polys_f)
    cx = np.array([po.centroid.x for po in polys_f])
    cy = np.array([po.centroid.y for po in polys_f])
    cd = np.array([dist_to_coast(land, cx[i], cy[i]) for i in range(n)])
    max_cd = max(float(np.max(cd)), 1.0)
    rs = np.array([ridge_field(cx[i], cy[i], ridges, p.ridge_prominence, p.ridge_influence_px) for i in range(n)])
    wvx = p.width
    wvy = p.height
    harm = np.array(
        [
            p.harmonic_amp * math.sin(cx[i] / wvx * 6.2 + cy[i] / wvy * 3.1)
            + p.harmonic_amp * 0.7 * math.cos(cy[i] / wvy * 5.4 - cx[i] / wvx * 2.8)
            for i in range(n)
        ]
    )
    # Gulf low bias (same macro story as legacy)
    gulf = np.array(
        [
            0.11
            * math.exp(
                -(((cx[i] - wvx * 0.58) / (wvx * 0.17)) ** 2 + ((cy[i] - wvy * 0.36) / (wvy * 0.19)) ** 2)
            )
            for i in range(n)
        ]
    )
    elev = 0.07 + 0.38 * (cd / max_cd) + 0.52 * rs + gulf + harm
    elev = np.clip(elev, 0.0, 1.0)
    for _ in range(p.smooth_passes):
        ne = elev.copy()
        for i in range(n):
            if rs[i] >= p.smooth_ridge_protect:
                continue
            if not adj[i]:
                continue
            nb = np.mean([elev[j] for j in adj[i]])
            ne[i] = (1.0 - p.smooth_mix) * elev[i] + p.smooth_mix * nb
        elev = np.clip(ne, 0.0, 1.0)
    is_coast = np.array([cd[i] < 18.0 or polys_f[i].touches(land.boundary) for i in range(n)])
    down = np.full(n, -1, dtype=np.int32)
    for i in range(n):
        if is_coast[i]:
            continue
        best = -1
        best_el = elev[i]
        for j in adj[i]:
            if elev[j] < best_el - 1e-7:
                best_el = elev[j]
                best = j
        down[i] = best
    acc = np.ones(n, dtype=np.float64)
    order = np.argsort(-elev)
    for i in order:
        j = int(down[i])
        if j >= 0:
            acc[j] += acc[i]
    return TerrainMesh(
        sites=sites_f,
        cells=polys_f,
        centroid_xy=np.column_stack([cx, cy]),
        elev=elev,
        ridge_strength=rs,
        coast_dist=cd,
        adj=adj,
        down=down,
        acc=acc,
        is_coast=is_coast,
        land=land,
    )


def extract_river_edges(mesh: TerrainMesh, p: AtlasParams) -> list[tuple[int, int, float]]:
    thr = float(np.quantile(mesh.acc, p.river_acc_q))
    edges: list[tuple[int, int, float]] = []
    for i in range(len(mesh.down)):
        j = int(mesh.down[i])
        if j < 0:
            continue
        a = max(mesh.acc[i], mesh.acc[j])
        if a < thr:
            continue
        edges.append((i, j, a))
    return edges


def edges_to_polylines(_edges: list[tuple[int, int, float]], mesh: TerrainMesh, min_cells: int) -> list[tuple[list[tuple[float, float]], float]]:
    """Trace downhill from upland source candidates (ridge × elevation), not from high-acc mouths."""
    n = len(mesh.down)
    scored: list[tuple[float, int]] = []
    for i in range(n):
        if mesh.is_coast[i] or int(mesh.down[i]) < 0:
            continue
        el, rs = float(mesh.elev[i]), float(mesh.ridge_strength[i])
        nb_max = max((float(mesh.elev[j]) for j in mesh.adj[i]), default=el)
        if el + 1e-5 < nb_max:
            continue
        scored.append((el * (0.35 + rs), i))
    scored.sort(key=lambda t: -t[0])
    heads = [i for _, i in scored[:min(120, max(24, n // 8))]]
    if len(heads) < 12:
        fb = [
            (float(mesh.ridge_strength[i]) * float(mesh.elev[i]), i)
            for i in range(n)
            if not mesh.is_coast[i] and int(mesh.down[i]) >= 0
        ]
        fb.sort(key=lambda t: -t[0])
        heads = [i for _, i in fb[: min(100, max(30, n // 7))]]
    seen_prefix: set[tuple[int, ...]] = set()
    rivers: list[tuple[list[tuple[float, float]], float]] = []
    for h in heads:
        path: list[int] = []
        cur = h
        vis: set[int] = set()
        while cur >= 0 and cur not in vis:
            vis.add(cur)
            path.append(cur)
            nxt = int(mesh.down[cur])
            if nxt < 0:
                break
            cur = nxt
        if len(path) < min_cells:
            continue
        key = (path[0], path[-1], len(path))
        if key in seen_prefix:
            continue
        seen_prefix.add(key)
        pts = [(float(mesh.centroid_xy[i, 0]), float(mesh.centroid_xy[i, 1])) for i in path]
        flow = float(np.max([mesh.acc[i] for i in path]))
        rivers.append((pts, flow))
    rivers.sort(key=lambda r: -r[1])
    return rivers[:48]


def simplify_lake_poly(p: Polygon, buf: float) -> Polygon:
    try:
        q = p.buffer(buf).buffer(-buf * 0.6)
        if q.is_empty:
            return p
        if q.geom_type == "Polygon":
            return q
        return max(q.geoms, key=lambda g: g.area)
    except Exception:
        return p


def find_sink_lakes(mesh: TerrainMesh, p: AtlasParams, land: Polygon) -> list[Polygon]:
    sinks = [i for i in range(len(mesh.down)) if mesh.down[i] < 0 and not mesh.is_coast[i] and mesh.acc[i] >= p.lake_sink_min_acc]
    polys: list[Polygon] = [mesh.cells[i] for i in sinks]
    w, h = p.width, p.height
    for _, (nx, ny) in LAKE_NAMES:
        seed = Point(nx * w, ny * h)
        if land.contains(seed) or land.distance(seed) < 40:
            r = 18 + 14 * (len(polys) % 3)
            g = seed.buffer(r).intersection(land.buffer(0))
            if g.is_empty:
                continue
            if g.geom_type == "MultiPolygon":
                g = max(g.geoms, key=lambda q: q.area)
            if g.geom_type == "Polygon" and g.area > 200:
                polys.append(g)
    if not polys:
        return []
    merged = unary_union(polys)
    out: list[Polygon] = []
    if merged.geom_type == "Polygon":
        out.append(simplify_lake_poly(merged, p.lake_merge_buf))
    else:
        for g in merged.geoms:
            if g.area > 400:
                out.append(simplify_lake_poly(g, p.lake_merge_buf))
    return out[:6]


def assign_regions(mesh: TerrainMesh, p: AtlasParams, river_edges: set[tuple[int, int]]) -> np.ndarray:
    n = len(mesh.cells)
    rid = np.full(n, -1, dtype=np.int32)
    costs = np.full(n, np.inf)
    pq: list[tuple[float, int, int]] = []
    for k, rd in enumerate(REGION_DEFS):
        sx, sy = rd["seed"]  # type: ignore[index]
        pt = Point(sx * p.width, sy * p.height)
        best = -1
        best_d = 1e18
        for i in range(n):
            d = mesh.cells[i].distance(pt)
            if d < best_d:
                best_d = d
                best = i
        if best >= 0:
            costs[best] = 0.0
            rid[best] = k
            heapq.heappush(pq, (0.0, k, best))
    while pq:
        c, rk, i = heapq.heappop(pq)
        if c > costs[i] + 1e-9:
            continue
        for j in mesh.adj[i]:
            el, er = float(mesh.elev[i]), float(mesh.elev[j])
            step = 1.0 + abs(el - er) * 3.5
            rm = 0.5 * (mesh.ridge_strength[i] + mesh.ridge_strength[j])
            step += rm * rm * p.ridge_barrier_cost
            if (min(i, j), max(i, j)) in {(min(a, b), max(a, b)) for a, b in river_edges}:
                step += p.river_barrier_cost
            nc = c + step
            if nc < costs[j]:
                costs[j] = nc
                rid[j] = rk
                heapq.heappush(pq, (nc, rk, j))
    return rid


def marching_squares_contours(
    xs: np.ndarray, ys: np.ndarray, z: np.ndarray, levels: list[float], land: Polygon
) -> dict[float, list[tuple[tuple[float, float], tuple[float, float]]]]:
    # xs, ys 1d; z shape (len(ys), len(xs))
    segments: list[tuple[float, tuple[float, float], tuple[float, float]]] = []
    ny, nx = z.shape

    def interp(p1, v1, p2, v2, lvl):
        t = (lvl - v1) / (v2 - v1 + 1e-12)
        t = max(0.0, min(1.0, t))
        return (p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1]))

    for j in range(ny - 1):
        for i in range(nx - 1):
            x0, x1 = xs[i], xs[i + 1]
            y0, y1 = ys[j], ys[j + 1]
            z00, z10, z01, z11 = z[j, i], z[j, i + 1], z[j + 1, i], z[j + 1, i + 1]
            c00, c10, c01, c11 = (x0, y0), (x1, y0), (x0, y1), (x1, y1)
            if not land.intersects(LineString([c00, c10, c11, c01, c00])):
                continue
            for lvl in levels:
                s = (
                    (1 if z00 >= lvl else 0)
                    | (2 if z10 >= lvl else 0)
                    | (4 if z11 >= lvl else 0)
                    | (8 if z01 >= lvl else 0)
                )
                if s in (0, 15):
                    continue
                pts = [c00, c10, c11, c01]
                vals = [z00, z10, z11, z01]
                segs = {
                    1: [(interp(pts[0], vals[0], pts[1], vals[1], lvl), interp(pts[0], vals[0], pts[3], vals[3], lvl))],
                    2: [(interp(pts[0], vals[0], pts[1], vals[1], lvl), interp(pts[1], vals[1], pts[2], vals[2], lvl))],
                    3: [(interp(pts[0], vals[0], pts[3], vals[3], lvl), interp(pts[1], vals[1], pts[2], vals[2], lvl))],
                    4: [(interp(pts[1], vals[1], pts[2], vals[2], lvl), interp(pts[3], vals[3], pts[2], vals[2], lvl))],
                    5: [
                        (interp(pts[0], vals[0], pts[1], vals[1], lvl), interp(pts[3], vals[3], pts[2], vals[2], lvl)),
                        (interp(pts[1], vals[1], pts[2], vals[2], lvl), interp(pts[0], vals[0], pts[3], vals[3], lvl)),
                    ],
                    6: [(interp(pts[0], vals[0], pts[3], vals[3], lvl), interp(pts[1], vals[1], pts[2], vals[2], lvl))],
                    7: [(interp(pts[0], vals[0], pts[3], vals[3], lvl), interp(pts[3], vals[3], pts[2], vals[2], lvl))],
                    8: [(interp(pts[0], vals[0], pts[3], vals[3], lvl), interp(pts[3], vals[3], pts[2], vals[2], lvl))],
                    9: [(interp(pts[0], vals[0], pts[3], vals[3], lvl), interp(pts[1], vals[1], pts[2], vals[2], lvl))],
                    10: [
                        (interp(pts[0], vals[0], pts[1], vals[1], lvl), interp(pts[3], vals[3], pts[2], vals[2], lvl)),
                        (interp(pts[0], vals[0], pts[3], vals[3], lvl), interp(pts[1], vals[1], pts[2], vals[2], lvl)),
                    ],
                    11: [(interp(pts[0], vals[0], pts[1], vals[1], lvl), interp(pts[1], vals[1], pts[2], vals[2], lvl))],
                    12: [(interp(pts[0], vals[0], pts[1], vals[1], lvl), interp(pts[3], vals[3], pts[2], vals[2], lvl))],
                    13: [(interp(pts[0], vals[0], pts[1], vals[1], lvl), interp(pts[3], vals[3], pts[2], vals[2], lvl))],
                    14: [(interp(pts[0], vals[0], pts[3], vals[3], lvl), interp(pts[0], vals[0], pts[1], vals[1], lvl))],
                }
                for a, b in segs.get(s, []):
                    segments.append((lvl, a, b))
    by_lvl: dict[float, list[tuple[tuple[float, float], tuple[float, float]]]] = defaultdict(list)
    for lvl, a, b in segments:
        by_lvl[lvl].append((a, b))
    return by_lvl


def _segments_to_svg_paths(segs: list[tuple[tuple[float, float], tuple[float, float]]]) -> list[str]:
    """Turn contour segments into SVG subpaths (many M L fragments; browsers merge visually)."""
    if not segs:
        return []
    return [f"M {a[0]:.1f},{a[1]:.1f} L {b[0]:.1f},{b[1]:.1f}" for a, b in segs]


def build_contours(mesh: TerrainMesh, p: AtlasParams, land: Polygon) -> list[tuple[float, str]]:
    gx = np.linspace(0, p.width, p.contour_grid_w)
    gy = np.linspace(0, p.height, p.contour_grid_h)
    gxg, gyg = np.meshgrid(gx, gy)
    z = griddata(mesh.centroid_xy, mesh.elev, (gxg, gyg), method="linear")
    z = np.nan_to_num(z, nan=np.nanmean(mesh.elev))
    zmin, zmax = float(np.min(mesh.elev)), float(np.max(mesh.elev))
    levels = [zmin + (k + 1) * (zmax - zmin) / (p.contour_levels + 1) for k in range(p.contour_levels)]
    by_lvl = marching_squares_contours(gx, gy, z, levels, land)
    rendered: list[tuple[float, str]] = []
    for lvl, segs in by_lvl.items():
        parts = _segments_to_svg_paths(segs)
        if not parts:
            continue
        rendered.append((lvl, " ".join(parts)))
    return rendered


def validate_scene(mainland: Polygon, rivers: list, lakes: list, mesh: TerrainMesh) -> tuple[bool, str]:
    fill, _ = polygon_area_ratio(mainland)
    conv = convexity_ratio(mainland)
    if conv > 0.93:
        return False, "macro silhouette lacks a strong re-entrant / gulf character"
    if fill > 0.88:
        return False, "mainland too box-filling / oval-like"
    if len(rivers) < 4:
        return False, "too few drainage lines for atlas readability"
    if max(mesh.acc) < 20:
        return False, "flow accumulation collapsed — check mesh or smoothing"
    return True, "ok"


def render_svg(
    p: AtlasParams,
    mainland: Polygon,
    islands: list[Polygon],
    ridge_named: list[tuple[str, LineString]],
    mesh: TerrainMesh,
    region_id: np.ndarray,
    rivers: list[tuple[list[tuple[float, float]], float]],
    lake_polys: list[Polygon],
    contours: list[tuple[float, str]],
    river_edges: set[tuple[int, int]],
) -> None:
    w, h = int(p.width), int(p.height)
    dwg = svgwrite.Drawing(str(p.output_svg), size=(f"{w}px", f"{h}px"), profile="full")
    dwg.defs.add(
        dwg.style(
            """
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Spectral:ital,wght@0,400;0,600;1,400&display=swap');
            """
        )
    )
    # defs gradients
    defs = dwg.defs
    lg = dwg.linearGradient(id="seaG", x1="0%", y1="0%", x2="100%", y2="100%")
    lg.add_stop_color(offset="0%", color="#a8c4bc")
    lg.add_stop_color(offset="55%", color="#92b0a8")
    lg.add_stop_color(offset="100%", color="#7d9b94")
    defs.add(lg)
    lg2 = dwg.radialGradient(id="landG", cx="48%", cy="40%", r="72%")
    lg2.add_stop_color(offset="0%", color="#f0e8d4")
    lg2.add_stop_color(offset="55%", color="#e2d8be")
    lg2.add_stop_color(offset="100%", color="#cbb88a")
    defs.add(lg2)

    g_sea = dwg.add(dwg.g(id="layer_sea"))
    g_sea.add(dwg.rect(insert=(0, 0), size=(w, h), fill="url(#seaG)"))

    land_union = unary_union([mainland, *islands])
    g_land = dwg.add(dwg.g(id="layer_land"))
    if land_union.geom_type == "Polygon":
        coords = list(land_union.exterior.coords)
        g_land.add(dwg.polygon(points=[(x, y) for x, y in coords], fill="url(#landG)", stroke="#5a7a73", stroke_width=1.4, opacity=0.98))
    else:
        for g in land_union.geoms:
            coords = list(g.exterior.coords)
            g_land.add(dwg.polygon(points=[(x, y) for x, y in coords], fill="url(#landG)", stroke="#5a7a73", stroke_width=1.4, opacity=0.98))

    g_regions = dwg.add(dwg.g(id="layer_regions", opacity="0.13"))
    for i, poly in enumerate(mesh.cells):
        r = int(region_id[i])
        if r < 0:
            continue
        fill = str(REGION_DEFS[r]["fill"])
        if poly.geom_type == "Polygon":
            coords = list(poly.exterior.coords)
            g_regions.add(dwg.polygon(points=[(x, y) for x, y in coords], fill=fill, stroke="none"))

    g_contour = dwg.add(dwg.g(id="layer_contours", fill="none", opacity=str(p.contour_opacity)))
    for _, d in contours:
        g_contour.add(dwg.path(d=d, stroke="#a09878", stroke_width=p.contour_stroke, stroke_linecap="round"))

    g_ridge = dwg.add(dwg.g(id="layer_ridges", fill="none", opacity="0.16"))
    for name, ls in ridge_named:
        coords = list(ls.coords)
        g_ridge.add(dwg.polyline(points=[(x, y) for x, y in coords], stroke="#6b6050", stroke_width=3.0, stroke_linejoin="round"))
        g_ridge.add(dwg.polyline(points=[(x, y) for x, y in coords], stroke="#8a7e64", stroke_width=1.2, stroke_linejoin="round"))

    g_lakes = dwg.add(dwg.g(id="layer_lakes", opacity="0.88"))
    for i, lp in enumerate(lake_polys):
        if lp.is_empty:
            continue
        coords = list(lp.exterior.coords)
        nm = LAKE_NAMES[i % len(LAKE_NAMES)][0]
        g_lakes.add(dwg.polygon(points=[(x, y) for x, y in coords], fill="#8eb4ac", stroke="#5a7a73", stroke_width=1.0))
        c = lp.centroid
        g_lakes.add(
            dwg.text(
                nm,
                insert=(c.x, c.y + 6),
                text_anchor="middle",
                font_family="Spectral, Georgia, serif",
                font_size=13,
                fill="#4a5c56",
                font_style="italic",
                opacity=0.55,
            )
        )

    g_riv = dwg.add(dwg.g(id="layer_rivers", fill="none"))
    for pts, flow in rivers:
        if len(pts) < 2:
            continue
        sw = 1.4 + 2.8 * math.log1p(flow) / math.log1p(float(np.max(mesh.acc)))
        sw = max(1.2, min(8.5, sw))
        g_riv.add(dwg.polyline(points=pts, stroke="#6d8f89", stroke_width=sw, stroke_linejoin="round", stroke_linecap="round", opacity=0.88))

    g_borders = dwg.add(dwg.g(id="layer_borders", fill="none", opacity="0.2"))
    for i in range(len(mesh.cells)):
        for j in mesh.adj[i]:
            if j <= i:
                continue
            if region_id[i] != region_id[j] and region_id[i] >= 0 and region_id[j] >= 0:
                p1 = mesh.centroid_xy[i]
                p2 = mesh.centroid_xy[j]
                g_borders.add(dwg.line(start=(float(p1[0]), float(p1[1])), end=(float(p2[0]), float(p2[1])), stroke="#a89872", stroke_width=0.9, stroke_dasharray="4,3"))

    g_labels = dwg.add(dwg.g(id="layer_labels"))
    for rd in REGION_DEFS:
        lx, ly = rd["label"]  # type: ignore[index]
        x, y = lx * p.width, ly * p.height
        name = str(rd["name"]).upper()
        g_labels.add(
            dwg.text(
                name,
                insert=(x, y),
                text_anchor="middle",
                font_family="Cinzel, Georgia, serif",
                font_size=44,
                font_weight="bold",
                fill="#5a4e30",
                stroke="#f0e8d4",
                stroke_width=1.6,
                opacity=0.78,
            )
        )
        sub = rd.get("subtitle")
        if sub:
            g_labels.add(
                dwg.text(
                    str(sub),
                    insert=(x, y + 28),
                    text_anchor="middle",
                    font_family="Spectral, Georgia, serif",
                    font_size=15,
                    font_style="italic",
                    fill="#6a5e3a",
                    opacity=0.5,
                )
            )

    for name, xy, cap, off in [
        (CITIES[k][0], CITIES[k][1], CITIES[k][2], CITIES[k][3]) for k in range(len(CITIES))
    ]:
        x, y = xy[0] * p.width + off[0], xy[1] * p.height + off[1]
        g_labels.add(
            dwg.text(
                name,
                insert=(x, y),
                text_anchor="middle",
                font_family="Spectral, Georgia, serif",
                font_size=16 if cap else 14,
                font_weight="600" if cap else "normal",
                font_style="italic" if not cap else "normal",
                fill="#4a3e20",
                stroke="#ece6d0",
                stroke_width=0.7,
                opacity=0.88,
            )
        )

    for name, xy, rot, sz, op in SEA_LABELS:
        x, y = xy[0] * p.width, xy[1] * p.height
        t = dwg.text(
            name,
            insert=(x, y),
            text_anchor="middle",
            font_family="Spectral, Georgia, serif",
            font_size=sz,
            font_style="italic",
            fill="#5a7a6a",
            opacity=op,
        )
        t.rotate(rot, center=(x, y))
        g_labels.add(t)

    for name, ls in ridge_named:
        mid = ls.interpolate(0.5, normalized=True)
        x, y = mid.x, mid.y - 8
        t = dwg.text(
            name,
            insert=(x, y),
            text_anchor="middle",
            font_family="Spectral, Georgia, serif",
            font_size=11,
            font_style="italic",
            fill="#6b6050",
            opacity=0.42,
        )
        ang = math.degrees(math.atan2(ls.coords[-1][1] - ls.coords[0][1], ls.coords[-1][0] - ls.coords[0][0]))
        if ang > 90:
            ang -= 180
        if ang < -90:
            ang += 180
        t.rotate(ang, center=(x, y))
        g_labels.add(t)

    dwg.add(
        dwg.text(
            "CARDONIA",
            insert=(p.width * 0.828, p.height * 0.927),
            text_anchor="middle",
            font_family="Cinzel, Georgia, serif",
            font_size=int(p.width * 0.052),
            font_weight="bold",
            fill="#6a571e",
            stroke="#ece6d0",
            stroke_width=2.0,
            opacity=0.74,
        )
    )

    p.output_svg.parent.mkdir(parents=True, exist_ok=True)
    dwg.save()


def run_once(p: AtlasParams, rng: random.Random) -> tuple[bool, str]:
    mainland, islands, ridges, ridge_named = build_macro_geometry(p)
    land = unary_union([mainland, *islands])
    mesh = build_mesh_and_elevation(p, land, ridges, rng)
    edges_list = extract_river_edges(mesh, p)
    edge_set = {(min(i, j), max(i, j)) for i, j, _ in edges_list}
    river_edges_graph = {(i, j) for i, j, _ in edges_list}
    rivers = edges_to_polylines(edges_list, mesh, p.min_stream_cells)
    lakes = find_sink_lakes(mesh, p, land)
    region_id = assign_regions(mesh, p, river_edges_graph)
    contours = build_contours(mesh, p, land)
    ok, msg = validate_scene(mainland, rivers, lakes, mesh)
    if ok:
        render_svg(p, mainland, islands, ridge_named, mesh, region_id, rivers, lakes, contours, river_edges_graph)
    return ok, msg


def main() -> int:
    ap = argparse.ArgumentParser(description="PH Murt Studios Voronoi / elevation-first fantasy atlas (SVG).")
    ap.add_argument("--seed", type=int, default=23)
    ap.add_argument("--output", type=Path, default=Path("generated/phmurt_atlas.svg"))
    ap.add_argument("--png", type=Path, default=None)
    ap.add_argument("--sites", type=int, default=950)
    ap.add_argument("--attempts", type=int, default=40)
    args = ap.parse_args()
    p = AtlasParams(seed=args.seed, output_svg=args.output, voronoi_sites=args.sites, max_attempts=args.attempts, output_png=args.png)
    last = "unknown"
    for att in range(p.max_attempts):
        rng = random.Random(p.seed + att * 131)
        ok, msg = run_once(p, rng)
        last = msg
        if ok:
            print(f"Saved {p.output_svg} (attempt {att + 1}, ok)")
            if p.output_png:
                try:
                    import cairosvg

                    cairosvg.svg2png(url=str(p.output_svg), write_to=str(p.output_png))
                    print(f"PNG preview: {p.output_png}")
                except Exception as e:
                    print(f"PNG export skipped: {e}")
            return 0
    print(f"Failed validation after {p.max_attempts} attempts: {last}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
