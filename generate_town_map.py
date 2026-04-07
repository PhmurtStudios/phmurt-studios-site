"""
Fantasy Town Map Generator v3 — Deep Overhaul
==============================================
Generates richly detailed top-down fantasy city/town SVG maps with:
  - Connected road network (every street joins two roads)
  - Varied town outlines (circular, oval, organic, star)
  - Compound building shapes (L, U, courtyard, round tower)
  - Rich detail layers (wells, market stalls, gardens, fences, bridges)
  - Road-aligned buildings with doors, windows, chimneys
  - Multiple plazas and gathering spaces
  - Scale tiers: Capital (gigantic) → Village (tiny)

Usage:
    python3 generate_town_map_v3.py --seed 1 --name "Thebury" --capital --population 8000
"""
from __future__ import annotations

import argparse
import hashlib
import math
import random
from collections import defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from typing import Sequence
from xml.sax.saxutils import escape

Point = tuple[float, float]
Rect = tuple[float, float, float, float]  # x0, y0, x1, y1

PI = math.pi
TAU = 2 * PI
cos = math.cos
sin = math.sin

# ════════════════════════════════════════════════════════════════════════
# §1  CONFIGURATION & PALETTES
# ════════════════════════════════════════════════════════════════════════

@dataclass(frozen=True)
class TownConfig:
    width: int = 1600
    height: int = 1200
    seed: int = 1
    name: str = "Unnamed Town"
    is_capital: bool = False
    population: int = 5000
    terrain: str = "plains"


def city_tier(cfg: TownConfig) -> str:
    if cfg.is_capital:
        return "capital"
    if cfg.population >= 4000:
        return "large_town"
    if cfg.population >= 1500:
        return "small_town"
    return "village"


def canvas_for_tier(tier: str) -> tuple[int, int]:
    return {
        "capital":    (4800, 3600),
        "large_town": (3200, 2400),
        "small_town": (2200, 1650),
        "village":    (1600, 1200),
    }[tier]


TIER_PARAMS = {
    "capital": dict(
        wall_verts=16, radius_frac=0.42, num_gates=6,
        num_radials=12, ring_fracs=[0.18, 0.30, 0.42, 0.54, 0.66, 0.78, 0.90],
        num_secondary_radials=14, num_side_streets=80, num_alleys=8,
        infill_density=0.99, num_specials=5, num_trees_range=(60, 120),
        house_range=(2800, 3800), road_w_main=48, road_w_sec=22, road_w_conn=11, road_w_lane=3,
        inner_wall=True, inner_wall_frac=0.28,
        num_plazas=10, num_market_stalls=50, num_gardens=60, num_wells=14,
        num_barrels=55, num_fences=80,
        shape_weights={"circular": 0.25, "oval": 0.25, "organic": 0.25, "star": 0.25},
    ),
    "large_town": dict(
        wall_verts=12, radius_frac=0.40, num_gates=4,
        num_radials=8, ring_fracs=[0.25, 0.42, 0.58, 0.75, 0.90],
        num_secondary_radials=7, num_side_streets=35, num_alleys=4,
        infill_density=0.96, num_specials=3, num_trees_range=(30, 60),
        house_range=(700, 1000), road_w_main=28, road_w_sec=14, road_w_conn=8, road_w_lane=3,
        inner_wall=False, inner_wall_frac=0,
        num_plazas=4, num_market_stalls=15, num_gardens=25, num_wells=6,
        num_barrels=20, num_fences=35,
        shape_weights={"circular": 0.25, "oval": 0.30, "organic": 0.30, "star": 0.15},
    ),
    "small_town": dict(
        wall_verts=9, radius_frac=0.36, num_gates=3,
        num_radials=5, ring_fracs=[0.35, 0.62, 0.85],
        num_secondary_radials=4, num_side_streets=18, num_alleys=3,
        infill_density=0.85, num_specials=2, num_trees_range=(18, 35),
        house_range=(180, 300), road_w_main=18, road_w_sec=10, road_w_conn=6, road_w_lane=3,
        inner_wall=False, inner_wall_frac=0,
        num_plazas=2, num_market_stalls=8, num_gardens=12, num_wells=3,
        num_barrels=10, num_fences=18,
        shape_weights={"circular": 0.30, "oval": 0.30, "organic": 0.40, "star": 0.0},
    ),
    "village": dict(
        wall_verts=0, radius_frac=0.34, num_gates=2,
        num_radials=4, ring_fracs=[0.55],
        num_secondary_radials=3, num_side_streets=8, num_alleys=2,
        infill_density=0.80, num_specials=1, num_trees_range=(12, 28),
        house_range=(55, 95), road_w_main=11, road_w_sec=8, road_w_conn=5, road_w_lane=3,
        inner_wall=False, inner_wall_frac=0,
        num_plazas=1, num_market_stalls=4, num_gardens=8, num_wells=2,
        num_barrels=6, num_fences=10,
        shape_weights={"circular": 0.35, "oval": 0.30, "organic": 0.35, "star": 0.0},
    ),
}


DISTRICTS = {
    "noble":       dict(bw=(22, 50), bh=(18, 44), gap=0.4, roofs=["#687070","#788080","#586262","#6a7878","#808a8a","#606868"], walls=["#c8c0b0","#d0c8b8","#bab4a4","#d4ccbc","#c0b8a8"], density=0.97, compound_chance=0.45),
    "market":      dict(bw=(16, 38), bh=(14, 32), gap=0.3, roofs=["#9a5a3a","#a06040","#b87050","#8a5030","#a87048","#c07848"], walls=["#ddd0a8","#d8c8a0","#e0d4b0","#d4c898","#d0c490"], density=0.99, compound_chance=0.25),
    "temple":      dict(bw=(20, 44), bh=(16, 38), gap=0.5, roofs=["#808888","#707878","#909898","#606a6a","#8a9090"], walls=["#d0c8b8","#c8c4b8","#d4d0c8","#ccc4b0"], density=0.95, compound_chance=0.30),
    "residential": dict(bw=(10, 28), bh=(10, 24), gap=0.2, roofs=["#9a5a3a","#8a5030","#7a4028","#a06040","#8a6a48","#946038","#b07050","#884828"], walls=["#d4c8a4","#cec0a0","#d0c4a8","#c8bca0","#d8ccb0","#c4b898"], density=0.99, compound_chance=0.16),
    "poor":        dict(bw=(8, 20), bh=(8, 18), gap=0.15, roofs=["#6a5038","#5a4028","#7a5a40","#4a3820","#685040","#584030"], walls=["#c0b490","#b8ac88","#c4b898","#bcb08c","#b0a480"], density=0.99, compound_chance=0.06),
    "docks":       dict(bw=(18, 50), bh=(12, 28), gap=0.3, roofs=["#7a6a50","#6a5a40","#8a7a60","#786848","#6a5a3a"], walls=["#c8c0a8","#c0b8a0","#bab098","#c4bca8"], density=0.97, compound_chance=0.20),
}

DISTRICT_ORDER_CAPITAL = ["noble", "temple", "market", "residential", "residential", "poor", "docks", "residential"]
DISTRICT_ORDER_TOWN   = ["market", "residential", "residential", "poor", "residential"]
DISTRICT_ORDER_VILLAGE = ["residential", "market", "residential"]


class Pal:
    bg = "#e2dcc0"
    bg_outer = "#d0caac"
    bg_inner = "#d8d2b8"
    road = "#b8ae94"        # medium cobblestone grey-brown
    road_main = "#c4ba9e"   # slightly lighter for main roads
    road_edge = "#7a7060"   # darker curb edge
    road_dark = "#6a6050"
    road_cobble = "#a09888"
    wall_stone = "#606058"
    wall_light = "#888880"
    wall_dark = "#404038"
    wall_fill = "#787870"
    tower_fill = "#707068"
    tower_top = "#585850"
    gate_fill = "#909088"
    water = "#6a9ca0"
    water_dark = "#507880"
    water_shore = "#8cc0b8"
    water_light = "#98d0c8"
    green = "#5a8a48"
    green_light = "#78a860"
    green_dark = "#3a6a28"
    garden = "#6a9850"
    garden_dark = "#4a7838"
    fence = "#8a7050"
    text = "#3a2e10"
    text_soft = "#5a4e2a"
    text_faint = "#8a8070"
    parchment = "#f0e8d0"
    shadow = "#2a2010"
    wood = "#6a5030"
    wood_light = "#8a7050"
    barrel = "#7a5a30"
    door = "#3a2818"
    window = "#a0c8d0"
    window_frame = "#5a5040"
    bridge_stone = "#a0988c"
    bridge_dark = "#706860"


# ════════════════════════════════════════════════════════════════════════
# §2  SPATIAL HASH
# ════════════════════════════════════════════════════════════════════════

class SpatialHash:
    def __init__(self, w: float, h: float, cell: float = 40):
        self.cell = cell
        self.cols = int(w / cell) + 2
        self.rows = int(h / cell) + 2
        self.grid: dict[tuple[int,int], list[Rect]] = defaultdict(list)

    def _cells(self, r: Rect, pad: float = 0):
        x0 = int((r[0] - pad) / self.cell)
        y0 = int((r[1] - pad) / self.cell)
        x1 = int((r[2] + pad) / self.cell) + 1
        y1 = int((r[3] + pad) / self.cell) + 1
        for cy in range(max(0, y0), min(self.rows, y1 + 1)):
            for cx in range(max(0, x0), min(self.cols, x1 + 1)):
                yield (cx, cy)

    def insert(self, r: Rect):
        for c in self._cells(r):
            self.grid[c].append(r)

    def collides(self, r: Rect, pad: float = 0) -> bool:
        pr = (r[0] - pad, r[1] - pad, r[2] + pad, r[3] + pad)
        for c in self._cells(pr):
            for other in self.grid[c]:
                if not (pr[2] < other[0] or other[2] < pr[0] or
                        pr[3] < other[1] or other[3] < pr[1]):
                    return True
        return False


# ════════════════════════════════════════════════════════════════════════
# §3  GEOMETRY HELPERS
# ════════════════════════════════════════════════════════════════════════

def dist(a: Point, b: Point) -> float:
    return math.hypot(b[0]-a[0], b[1]-a[1])

def lerp_pt(a: Point, b: Point, t: float) -> Point:
    return (a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t)

def normalize(dx: float, dy: float) -> tuple[float,float]:
    d = math.hypot(dx, dy) or 1e-9
    return (dx/d, dy/d)

def perp(dx: float, dy: float) -> tuple[float,float]:
    return (-dy, dx)

def seg_intersect(p0: Point, p1: Point, q0: Point, q1: Point):
    """Return the intersection point of segments p0-p1 and q0-q1, or None."""
    dx = p1[0]-p0[0]; dy = p1[1]-p0[1]
    ex = q1[0]-q0[0]; ey = q1[1]-q0[1]
    denom = dx*ey - dy*ex
    if abs(denom) < 1e-9:
        return None  # parallel
    fx = q0[0]-p0[0]; fy = q0[1]-p0[1]
    t = (fx*ey - fy*ex) / denom
    u = (fx*dy - fy*dx) / denom
    if 0.0 <= t <= 1.0 and 0.0 <= u <= 1.0:
        return (p0[0] + t*dx, p0[1] + t*dy)
    return None

def rotate_point(px: float, py: float, cx: float, cy: float, angle: float) -> Point:
    dx, dy = px - cx, py - cy
    c, s = cos(angle), sin(angle)
    return (cx + dx*c - dy*s, cy + dx*s + dy*c)

def point_in_polygon(px: float, py: float, poly: list[Point]) -> bool:
    inside = False
    n = len(poly)
    j = n - 1
    for i in range(n):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if ((yi > py) != (yj > py)) and (px < (xj - xi) * (py - yi) / (yj - yi + 1e-12) + xi):
            inside = not inside
        j = i
    return inside

def polygon_centroid(poly: list[Point]) -> Point:
    sx = sum(p[0] for p in poly) / max(1, len(poly))
    sy = sum(p[1] for p in poly) / max(1, len(poly))
    return (sx, sy)

def smooth_polygon(poly: list[Point], passes: int = 3, blend: float = 0.3) -> list[Point]:
    pts = list(poly)
    n = len(pts)
    for _ in range(passes):
        new = []
        for i in range(n):
            prev = pts[(i-1) % n]
            curr = pts[i]
            nxt  = pts[(i+1) % n]
            nx = curr[0] + blend * ((prev[0]+nxt[0])/2 - curr[0])
            ny = curr[1] + blend * ((prev[1]+nxt[1])/2 - curr[1])
            new.append((nx, ny))
        pts = new
    return pts

def subdivide_polygon(poly: list[Point], max_seg: float = 40) -> list[Point]:
    out = []
    n = len(poly)
    for i in range(n):
        a = poly[i]
        b = poly[(i+1) % n]
        out.append(a)
        d = dist(a, b)
        if d > max_seg:
            nseg = int(d / max_seg) + 1
            for s in range(1, nseg):
                out.append(lerp_pt(a, b, s / nseg))
    return out

def _catmull_rom_path(pts: list[Point], closed: bool = False) -> str:
    if len(pts) < 2:
        return ""
    if len(pts) == 2:
        return f"M{pts[0][0]:.1f},{pts[0][1]:.1f} L{pts[1][0]:.1f},{pts[1][1]:.1f}"
    d = f"M{pts[0][0]:.1f},{pts[0][1]:.1f}"
    for i in range(1, len(pts) - 1):
        mx = (pts[i][0] + pts[i+1][0]) / 2
        my = (pts[i][1] + pts[i+1][1]) / 2
        d += f" Q{pts[i][0]:.1f},{pts[i][1]:.1f} {mx:.1f},{my:.1f}"
    d += f" L{pts[-1][0]:.1f},{pts[-1][1]:.1f}"
    if closed:
        d += " Z"
    return d

def _poly_d(pts: list[Point], closed: bool = True) -> str:
    d = "M" + " L".join(f"{p[0]:.1f},{p[1]:.1f}" for p in pts)
    return d + " Z" if closed else d

def _nearest_road_info(px: float, py: float, roads: list) -> tuple[float, float, float]:
    """Returns (distance, angle, road_width) of nearest road segment."""
    best_dist = float('inf')
    best_angle = 0.0
    best_width = 10.0
    for road in roads:
        for si in range(len(road.points) - 1):
            p0, p1 = road.points[si], road.points[si+1]
            dx, dy = p1[0]-p0[0], p1[1]-p0[1]
            seg_len_sq = dx*dx + dy*dy
            if seg_len_sq < 1:
                continue
            t = max(0, min(1, ((px-p0[0])*dx + (py-p0[1])*dy) / seg_len_sq))
            proj = (p0[0] + t*dx, p0[1] + t*dy)
            d = dist((px, py), proj)
            if d < best_dist:
                best_dist = d
                best_angle = math.atan2(dy, dx)
                best_width = road.width
    return (best_dist, best_angle, best_width)


# ════════════════════════════════════════════════════════════════════════
# §4  TOWN SHAPE & WALL GENERATION
# ════════════════════════════════════════════════════════════════════════

@dataclass
class Gate:
    pos: Point
    angle: float
    wall_index: int

@dataclass
class WallData:
    vertices: list[Point]
    towers: list[Point]
    gates: list[Gate]
    inner_vertices: list[Point]
    inner_gates: list[Point] = None  # points where roads cross inner wall
    shape_type: str = "circular"


def _pick_town_shape(tier: str, rng: random.Random) -> str:
    weights = TIER_PARAMS[tier]["shape_weights"]
    choices = []
    cum_weights = []
    cumul = 0.0
    for name, w in weights.items():
        if w > 0:
            choices.append(name)
            cumul += w
            cum_weights.append(cumul)
    r = rng.uniform(0, cumul)
    for name, cw in zip(choices, cum_weights):
        if r <= cw:
            return name
    return choices[-1] if choices else "circular"


def generate_wall(cx: float, cy: float, base_r: float, num_verts: int,
                  rng: random.Random, shape: str = "circular") -> list[Point]:
    if num_verts < 3:
        return []
    pts = []

    if shape == "oval":
        aspect = rng.uniform(1.25, 1.65)
        rot = rng.uniform(0, PI)
        for i in range(num_verts):
            a = TAU * i / num_verts + rng.uniform(-0.12, 0.12)
            rx = base_r * math.sqrt(aspect)
            ry = base_r / math.sqrt(aspect)
            r_at = (rx * ry) / math.sqrt((ry * cos(a))**2 + (rx * sin(a))**2)
            r_at *= rng.uniform(0.88, 1.12)
            raw_x = r_at * cos(a)
            raw_y = r_at * sin(a)
            c_r, s_r = cos(rot), sin(rot)
            pts.append((cx + raw_x*c_r - raw_y*s_r, cy + raw_x*s_r + raw_y*c_r))

    elif shape == "organic":
        nv = num_verts + rng.randint(4, 8)
        for i in range(nv):
            a = TAU * i / nv + rng.uniform(-0.20, 0.20)
            r = base_r * rng.uniform(0.68, 1.32)
            pts.append((cx + r * cos(a), cy + r * sin(a)))

    elif shape == "star":
        n_bastions = rng.randint(4, 6)
        for i in range(num_verts):
            a = TAU * i / num_verts + rng.uniform(-0.10, 0.10)
            # Check if near a bastion angle
            bastion_r = base_r
            for bi in range(n_bastions):
                ba = TAU * bi / n_bastions
                if abs(((a - ba + PI) % TAU) - PI) < 0.25:
                    bastion_r = base_r * rng.uniform(1.10, 1.25)
                    break
            r = bastion_r * rng.uniform(0.88, 1.12)
            pts.append((cx + r * cos(a), cy + r * sin(a)))

    else:  # circular
        for i in range(num_verts):
            a = TAU * i / num_verts + rng.uniform(-0.18, 0.18)
            r = base_r * rng.uniform(0.84, 1.16)
            pts.append((cx + r * cos(a), cy + r * sin(a)))

    pts = subdivide_polygon(pts, max_seg=base_r * 0.20)
    pts = smooth_polygon(pts, passes=3, blend=0.28)
    return pts


def place_gates(wall: list[Point], cx: float, cy: float, num_gates: int,
                rng: random.Random) -> list[Gate]:
    n = len(wall)
    gates = []
    for gi in range(num_gates):
        target_angle = TAU * gi / num_gates + rng.uniform(-0.15, 0.15)
        best_i = 0
        best_diff = 999
        for i, (wx, wy) in enumerate(wall):
            a = math.atan2(wy - cy, wx - cx)
            diff = abs(((a - target_angle + PI) % TAU) - PI)
            if diff < best_diff:
                best_diff = diff
                best_i = i
        wp = wall[best_i]
        angle = math.atan2(wp[1] - cy, wp[0] - cx)
        gates.append(Gate(pos=wp, angle=angle, wall_index=best_i))
    return gates


def build_wall_data(cfg: TownConfig, tier: str, rng: random.Random) -> WallData:
    W, H = cfg.width, cfg.height
    cx, cy = W / 2, H / 2
    tp = TIER_PARAMS[tier]
    base_r = min(W, H) * tp["radius_frac"]
    shape = _pick_town_shape(tier, rng)

    wall_verts = []
    towers = []
    gates_list = []
    inner_verts = []

    if tp["wall_verts"] > 0:
        wall_verts = generate_wall(cx, cy, base_r, tp["wall_verts"], rng, shape)
        gates_list = place_gates(wall_verts, cx, cy, tp["num_gates"], rng)
        step = max(1, len(wall_verts) // tp["wall_verts"])
        towers = [wall_verts[i] for i in range(0, len(wall_verts), step)]
        if tp["inner_wall"]:
            inner_r = base_r * tp["inner_wall_frac"]
            inner_verts = generate_wall(cx, cy, inner_r, max(6, tp["wall_verts"] // 2), rng, "circular")
    else:
        base_r_v = min(W, H) * tp["radius_frac"]
        wall_verts = generate_wall(cx, cy, base_r_v, 12, rng, shape)
        gates_list = place_gates(wall_verts, cx, cy, tp["num_gates"], rng)

    return WallData(vertices=wall_verts, towers=towers, gates=gates_list,
                    inner_vertices=inner_verts, shape_type=shape)


# ════════════════════════════════════════════════════════════════════════
# §5  ROAD NETWORK — connected graph-based generation
# ════════════════════════════════════════════════════════════════════════

@dataclass
class Road:
    points: list[Point]
    width: float
    road_type: str = "main"

    @property
    def is_main(self) -> bool:
        return self.road_type == "main"

@dataclass
class Plaza:
    x: float
    y: float
    radius: float
    plaza_type: str = "square"  # "square", "market", "fountain"

@dataclass
class MarketSquare:
    x: float       # top-left of bounding box
    y: float
    w: float
    h: float
    shops: list     # list of Building objects ringing the square
    stalls: list    # list of (x, y, rotation, color) tuples for market stalls
    has_fountain: bool = True
    has_well: bool = False
    name: str = "Market Square"
    shape: str = "square"  # "square" or "circle"


def _perturb_line(p0: Point, p1: Point, rng: random.Random, n_mid: int = 3,
                  jitter: float = 0.08) -> list[Point]:
    pts = [p0]
    seg_d = dist(p0, p1)
    for i in range(1, n_mid + 1):
        t = i / (n_mid + 1)
        mx, my = lerp_pt(p0, p1, t)
        dx, dy = normalize(p1[0]-p0[0], p1[1]-p0[1])
        px, py = perp(dx, dy)
        offset = seg_d * jitter * rng.uniform(-1, 1)
        pts.append((mx + px * offset, my + py * offset))
    pts.append(p1)
    return pts


def _build_road_sample_index(roads: list[Road], spacing: float = 18) -> list[tuple[int, Point]]:
    """Build a spatial index of sample points along all roads."""
    samples = []
    for ri, road in enumerate(roads):
        for si in range(len(road.points) - 1):
            p0, p1 = road.points[si], road.points[si+1]
            seg_len = dist(p0, p1)
            steps = max(1, int(seg_len / spacing))
            for s in range(steps + 1):
                t = s / steps
                pt = lerp_pt(p0, p1, t)
                samples.append((ri, pt))
    return samples


def _snap_to_road(pt: Point, road: 'Road') -> Point:
    """Project pt onto the nearest point on road's polyline (exact on-centerline)."""
    best_d = float('inf')
    best_p = pt
    for i in range(len(road.points) - 1):
        a, b = road.points[i], road.points[i + 1]
        dx, dy = b[0] - a[0], b[1] - a[1]
        seg_len_sq = dx * dx + dy * dy
        if seg_len_sq < 1e-9:
            cp = a
        else:
            t = max(0.0, min(1.0, ((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dy) / seg_len_sq))
            cp = (a[0] + t * dx, a[1] + t * dy)
        d = dist(pt, cp)
        if d < best_d:
            best_d = d
            best_p = cp
    return best_p


def _angle_of(p0: Point, p1: Point) -> float:
    """Angle of segment p0->p1 in radians [0, PI) (direction-agnostic)."""
    from math import atan2, pi
    a = atan2(p1[1] - p0[1], p1[0] - p0[0]) % pi
    return a


def _crosses_river(p0: Point, p1: Point, water: list, margin: float = 0) -> bool:
    """Check if segment p0-p1 crosses any river."""
    for wf in water:
        if not wf.is_river:
            continue
        rpts = wf.river_pts
        for ri in range(len(rpts) - 1):
            if seg_intersect(p0, p1, rpts[ri], rpts[ri + 1]) is not None:
                return True
    return False


def _build_market_square_roads(roads: list[Road], wall_poly: list[Point],
                                cx: float, cy: float, base_r: float,
                                ring_radii: list[float], tier: str,
                                rng: random.Random, tp: dict,
                                inner_wall_poly: list[Point] = None) -> dict | None:
    """Create a market square as a road-bounded loop (square or circle) placed
    where a main road meets a ring road. Roads pass through/into the market.
    Returns dict with 'roads', 'cx', 'cy', 'radius', 'shape', 'perimeter' or None."""
    sizes = {"capital": 140, "large_town": 85, "small_town": 55, "village": 32}
    sq_r = sizes[tier]
    road_w = tp["road_w_sec"]
    main_w = tp["road_w_main"]

    # Strategy: find where a main road (radial) crosses a ring road (secondary)
    # and place the market square centered on that intersection.
    intersections = []
    for main_road in roads:
        if main_road.road_type != "main":
            continue
        for ring_road in roads:
            if ring_road.road_type != "secondary":
                continue
            for mi in range(len(main_road.points) - 1):
                mp0, mp1 = main_road.points[mi], main_road.points[mi + 1]
                for ri in range(len(ring_road.points) - 1):
                    rp0, rp1 = ring_road.points[ri], ring_road.points[ri + 1]
                    cross = seg_intersect(mp0, mp1, rp0, rp1)
                    if cross is not None:
                        d_from_center = dist(cross, (cx, cy))
                        # Not too close to center, not too close to wall
                        if base_r * 0.22 < d_from_center < base_r * 0.75:
                            intersections.append(cross)

    if not intersections:
        return None

    rng.shuffle(intersections)

    # Try each intersection candidate
    for mqx, mqy in intersections:
        # Check footprint is inside outer walls
        margin = sq_r + 30
        corners_ok = all(
            point_in_polygon(mqx + dx2, mqy + dy2, wall_poly)
            for dx2 in [-margin, margin]
            for dy2 in [-margin, margin]
        )
        if not corners_ok:
            continue
        # Not too close to center plaza
        if dist((mqx, mqy), (cx, cy)) < sq_r * 1.8:
            continue
        # Must be OUTSIDE the inner wall (noble/castle district)
        if inner_wall_poly:
            inside_inner = point_in_polygon(mqx, mqy, inner_wall_poly)
            # Also check that the market footprint doesn't overlap the inner wall
            corners_in_inner = any(
                point_in_polygon(mqx + dx2, mqy + dy2, inner_wall_poly)
                for dx2 in [-sq_r, 0, sq_r]
                for dy2 in [-sq_r, 0, sq_r]
            )
            if inside_inner or corners_in_inner:
                continue
        break
    else:
        return None

    # No artificial geometric loop road — the market is just an open area
    # at a road intersection. The existing roads already pass through/near it.
    # We only add short connector stubs from nearby roads into the market center
    # so traffic naturally flows through the open space.
    shape = "square"  # just for rendering the cobblestone ground
    perimeter = [
        (mqx - sq_r, mqy - sq_r),
        (mqx + sq_r, mqy - sq_r),
        (mqx + sq_r, mqy + sq_r),
        (mqx - sq_r, mqy + sq_r),
    ]

    new_roads = []
    connected_angles = []

    for road in roads:
        if road.road_type not in ("main", "secondary"):
            continue
        rw = road.width
        for i in range(len(road.points) - 1):
            a, b = road.points[i], road.points[i + 1]
            dx, dy = b[0] - a[0], b[1] - a[1]
            sl2 = dx * dx + dy * dy
            if sl2 < 1:
                continue
            t = max(0, min(1, ((mqx - a[0]) * dx + (mqy - a[1]) * dy) / sl2))
            proj = (a[0] + t * dx, a[1] + t * dy)
            d = dist((mqx, mqy), proj)
            if d > sq_r * 1.5:
                continue

            conn_angle = math.atan2(proj[1] - mqy, proj[0] - mqx)
            too_close = any(abs(((conn_angle - ca + PI) % TAU) - PI) < 0.4 for ca in connected_angles)
            if too_close:
                continue

            connected_angles.append(conn_angle)

    return {
        "roads": new_roads,
        "cx": mqx, "cy": mqy,
        "radius": sq_r,
        "shape": shape,
        "perimeter": perimeter,
        "connected_angles": connected_angles,
        "all_roads": roads,
    }


def _generate_organic_roads(cfg: TownConfig, wall: WallData, tier: str,
                            rng: random.Random, water: list) -> tuple[list[Road], list[Plaza], dict | None]:
    """Generate structured but asymmetric medieval road networks.

    The layout feels intentional — like a town that grew over centuries along
    trade routes — but avoids the rigid radial symmetry of planned cities.
    Key features: gently winding main roads, partial arcs (not full rings),
    well-spaced branches, and purposeful cross-streets.
    """
    W, H = cfg.width, cfg.height
    cx, cy = W / 2, H / 2
    tp = TIER_PARAMS[tier]
    roads: list[Road] = []
    plazas: list[Plaza] = []
    base_r = min(W, H) * tp["radius_frac"]

    # ── Off-center hub — subtle shift for asymmetry ──
    hub_x = cx + rng.uniform(-base_r * 0.08, base_r * 0.08)
    hub_y = cy + rng.uniform(-base_r * 0.08, base_r * 0.08)

    # ── Helper: gentle winding road (controlled S-curve, not random wobble) ──
    def _winding_road(p0, p1, n_mid=5, jitter=0.06, bias=0.0):
        """Road with gentle, purposeful curves. bias shifts the curve to one side."""
        pts = [p0]
        seg_d = dist(p0, p1)
        if seg_d < 1:
            return [p0, p1]
        dx, dy = normalize(p1[0] - p0[0], p1[1] - p0[1])
        px, py = perp(dx, dy)
        # Single smooth arc with slight variation, not random walk
        curve_dir = bias if abs(bias) > 0.01 else rng.uniform(-1, 1)
        curve_mag = jitter * curve_dir
        for i in range(1, n_mid + 1):
            t = i / (n_mid + 1)
            mx, my = lerp_pt(p0, p1, t)
            # Smooth bell-curve envelope: strongest in middle, zero at endpoints
            envelope = math.sin(t * PI)
            offset = seg_d * curve_mag * envelope + seg_d * 0.015 * rng.uniform(-1, 1)
            pts.append((mx + px * offset, my + py * offset))
        pts.append(p1)
        return pts

    # ── Wall radius lookup for arc generation ──
    wall_angle_radius = []
    if wall.vertices:
        for wx, wy in wall.vertices:
            wa = math.atan2(wy - cy, wx - cx)
            wr = math.hypot(wx - cx, wy - cy)
            wall_angle_radius.append((wa, wr))
        wall_angle_radius.sort()

    def _wall_r_at(a):
        if not wall_angle_radius:
            return base_r
        a = ((a + PI) % TAU) - PI
        n = len(wall_angle_radius)
        idx = 0
        for i in range(n):
            if wall_angle_radius[i][0] > a:
                idx = i
                break
        else:
            idx = 0
        prev_idx = (idx - 1) % n
        a0, r0 = wall_angle_radius[prev_idx]
        a1, r1 = wall_angle_radius[idx]
        da = ((a1 - a0 + PI) % TAU) - PI
        dt = ((a - a0 + PI) % TAU) - PI
        if abs(da) < 1e-9:
            return r0
        t = max(0.0, min(1.0, dt / da))
        return r0 + (r1 - r0) * t

    # ── Phase 1: Main trade routes — gentle curves from gates to hub ──
    for gate in wall.gates:
        n_mid = max(4, int(dist(gate.pos, (hub_x, hub_y)) / 100))
        bias = rng.uniform(-0.8, 0.8)
        pts = _winding_road(gate.pos, (hub_x, hub_y), n_mid=n_mid, jitter=0.06, bias=bias)
        roads.append(Road(pts, tp["road_w_main"], "main"))

    # ── Phase 2: Partial arc roads — like ring roads but only covering 90-200° ──
    # These give structure without full circular symmetry
    num_arcs = {"capital": 4, "large_town": 3, "small_town": 2, "village": 0}[tier]
    arc_fracs = {"capital": [0.30, 0.50, 0.70, 0.88],
                 "large_town": [0.35, 0.58, 0.80],
                 "small_town": [0.40, 0.70],
                 "village": []}[tier]

    for ai in range(min(num_arcs, len(arc_fracs))):
        frac = arc_fracs[ai]
        # Each arc covers a random angular span (not full circle)
        start_a = rng.uniform(0, TAU)
        span = rng.uniform(PI * 0.5, PI * 1.2)  # 90° to 216°
        n_pts = max(12, int(span * base_r * frac / 20))

        arc_pts = []
        for i in range(n_pts):
            t = i / (n_pts - 1)
            a = start_a + span * t
            wr = _wall_r_at(a)
            r = wr * frac + rng.uniform(-8, 8)  # slight wobble
            arc_pts.append((cx + r * cos(a), cy + r * sin(a)))

        # Smooth the arc
        arc_pts = smooth_polygon(arc_pts[:], passes=3, blend=0.25)
        # Don't close it — it's a partial arc

        # Check: skip arcs that cross rivers
        skip = False
        for i in range(len(arc_pts) - 1):
            if water and _crosses_river(arc_pts[i], arc_pts[i + 1], water):
                skip = True
                break
        if skip:
            continue

        # Clip to inside wall
        clipped = [p for p in arc_pts if not wall.vertices or point_in_polygon(p[0], p[1], wall.vertices)]
        if len(clipped) >= 4:
            roads.append(Road(clipped, tp["road_w_sec"], "secondary"))

    # ── Phase 3: Secondary through-roads — 1-2 roads connecting wall points ──
    # These cross the town at non-radial angles for variety
    num_throughs = {"capital": 2, "large_town": 2, "small_town": 1, "village": 0}[tier]
    for _ in range(num_throughs):
        a1 = rng.uniform(0, TAU)
        a2 = a1 + rng.uniform(PI * 0.7, PI * 1.3)
        r1 = _wall_r_at(a1) * rng.uniform(0.88, 0.98)
        r2 = _wall_r_at(a2) * rng.uniform(0.88, 0.98)
        p1 = (cx + r1 * cos(a1), cy + r1 * sin(a1))
        p2 = (cx + r2 * cos(a2), cy + r2 * sin(a2))

        # Route via a waypoint near (but not at) the hub
        wp_a = (a1 + a2) / 2 + rng.uniform(-0.3, 0.3)
        wp_r = base_r * rng.uniform(0.12, 0.30)
        waypoint = (hub_x + wp_r * cos(wp_a), hub_y + wp_r * sin(wp_a))

        seg1 = _winding_road(p1, waypoint, n_mid=4, jitter=0.05)
        seg2 = _winding_road(waypoint, p2, n_mid=4, jitter=0.05)
        full_pts = seg1[:-1] + seg2

        skip = False
        for i in range(len(full_pts) - 1):
            if water and _crosses_river(full_pts[i], full_pts[i + 1], water):
                skip = True
                break
        if skip:
            continue

        roads.append(Road(full_pts, tp["road_w_sec"], "secondary"))

    # ── Phase 4: Connector streets — well-spaced branches off main/secondary ──
    num_conns = {"capital": 22, "large_town": 14, "small_town": 8, "village": 3}[tier]
    conn_sources = _build_road_sample_index(
        [r for r in roads if r.road_type in ("main", "secondary")], spacing=50)

    # Spatial grid to keep branches well-spaced
    _branch_cell = 80
    _placed_branches: list[Point] = []

    def _branch_too_close(pt):
        for bp in _placed_branches:
            if dist(pt, bp) < _branch_cell:
                return True
        return False

    for _ in range(num_conns * 2):  # oversample
        if len(_placed_branches) >= num_conns:
            break
        if not conn_sources:
            break
        src_ri, src_pt = rng.choice(conn_sources)
        if wall.vertices and not point_in_polygon(src_pt[0], src_pt[1], wall.vertices):
            continue
        if _branch_too_close(src_pt):
            continue

        parent = roads[src_ri]
        parent_dir = _road_dir_at(parent, src_pt)
        perp_angle = math.atan2(parent_dir[1], parent_dir[0]) + PI / 2
        # Branch mostly perpendicular, slight variation
        branch_angle = perp_angle + rng.uniform(-PI / 5, PI / 5)
        # Pick a side
        if rng.random() < 0.5:
            branch_angle += PI

        length = base_r * rng.uniform(0.12, 0.28)
        end_pt = (src_pt[0] + length * cos(branch_angle),
                  src_pt[1] + length * sin(branch_angle))

        if wall.vertices and not point_in_polygon(end_pt[0], end_pt[1], wall.vertices):
            for frac in [0.6, 0.4]:
                end_pt = (src_pt[0] + length * frac * cos(branch_angle),
                          src_pt[1] + length * frac * sin(branch_angle))
                if point_in_polygon(end_pt[0], end_pt[1], wall.vertices):
                    break
            else:
                continue

        if water and _crosses_river(src_pt, end_pt, water):
            continue

        n_mid = max(2, int(dist(src_pt, end_pt) / 80))
        pts = _winding_road(src_pt, end_pt, n_mid=n_mid, jitter=0.05)

        # Snap & extend start into parent road
        snapped = _snap_to_road(pts[0], parent)
        overshoot = parent.width * 0.4
        dx2 = snapped[0] - pts[1][0]
        dy2 = snapped[1] - pts[1][1]
        ln2 = max(1e-6, (dx2*dx2 + dy2*dy2) ** 0.5)
        pts[0] = (snapped[0] + dx2/ln2 * overshoot, snapped[1] + dy2/ln2 * overshoot)

        roads.append(Road(pts, tp["road_w_conn"], "connector"))
        _placed_branches.append(lerp_pt(src_pt, end_pt, 0.5))

    # ── Phase 5: Side streets — short links between nearby roads ──
    num_sides = {"capital": 60, "large_town": 30, "small_town": 16, "village": 5}[tier]
    all_samples = _build_road_sample_index(roads, spacing=22)

    _side_cell = 55
    _placed_sides: list[tuple[Point, float]] = []

    def _side_overlaps(p0, p1):
        mid = lerp_pt(p0, p1, 0.5)
        ang = _angle_of(p0, p1)
        for emid, eang in _placed_sides:
            if dist(mid, emid) < _side_cell:
                da = abs(ang - eang)
                if da > PI / 2:
                    da = PI - da
                if da < PI / 3:
                    return True
        return False

    min_side = 35
    max_side = base_r * 0.20

    for _ in range(num_sides * 3):
        if len(_placed_sides) >= num_sides:
            break
        if not all_samples:
            break
        src_ri, src_pt = rng.choice(all_samples)
        if wall.vertices and not point_in_polygon(src_pt[0], src_pt[1], wall.vertices):
            continue

        candidates = rng.sample(all_samples, min(250, len(all_samples)))
        best_d = float('inf')
        best_pt = None
        best_ri = -1
        for tgt_ri, tgt_pt in candidates:
            if tgt_ri == src_ri:
                continue
            d = dist(src_pt, tgt_pt)
            if min_side < d < max_side and d < best_d:
                if not wall.vertices or point_in_polygon(tgt_pt[0], tgt_pt[1], wall.vertices):
                    best_d = d
                    best_pt = tgt_pt
                    best_ri = tgt_ri
        if best_pt is None:
            continue
        if water and _crosses_river(src_pt, best_pt, water):
            continue
        if _side_overlaps(src_pt, best_pt):
            continue

        snapped_src = _snap_to_road(src_pt, roads[src_ri])
        snapped_tgt = _snap_to_road(best_pt, roads[best_ri])

        # Extend into parent roads
        for road_idx, snap_pt, other_pt in [(src_ri, snapped_src, snapped_tgt),
                                              (best_ri, snapped_tgt, snapped_src)]:
            ov = roads[road_idx].width * 0.4
            ddx = snap_pt[0] - other_pt[0]
            ddy = snap_pt[1] - other_pt[1]
            lln = max(1e-6, (ddx*ddx + ddy*ddy)**0.5)
            if road_idx == src_ri:
                snapped_src = (snap_pt[0] + ddx/lln*ov, snap_pt[1] + ddy/lln*ov)
            else:
                snapped_tgt = (snap_pt[0] + ddx/lln*ov, snap_pt[1] + ddy/lln*ov)

        pts = _winding_road(snapped_src, snapped_tgt, n_mid=1, jitter=0.04)
        roads.append(Road(pts, tp["road_w_lane"], "lane"))
        mid = lerp_pt(snapped_src, snapped_tgt, 0.5)
        _placed_sides.append((mid, _angle_of(snapped_src, snapped_tgt)))

    # ── Phase 6: A few alleys for character (very few) ──
    num_alleys = {"capital": 6, "large_town": 4, "small_town": 2, "village": 1}[tier]
    alley_sources = _build_road_sample_index(
        [r for r in roads if r.road_type in ("main", "secondary", "connector")], spacing=40)
    for _ in range(num_alleys * 2):
        if num_alleys <= 0:
            break
        if not alley_sources:
            break
        src_ri, src_pt = rng.choice(alley_sources)
        if wall.vertices and not point_in_polygon(src_pt[0], src_pt[1], wall.vertices):
            continue
        angle = rng.uniform(0, TAU)
        length = rng.uniform(25, 50)
        end_pt = (src_pt[0] + length * cos(angle), src_pt[1] + length * sin(angle))
        if wall.vertices and not point_in_polygon(end_pt[0], end_pt[1], wall.vertices):
            continue
        if water and _crosses_river(src_pt, end_pt, water):
            continue
        roads.append(Road([src_pt, end_pt], tp["road_w_lane"] * 1.5, "alley"))
        num_alleys -= 1

    # ── Phase 7: Plazas ──
    hub_sz = {"capital": 70, "large_town": 50, "small_town": 35, "village": 22}[tier]
    plazas.append(Plaza(hub_x, hub_y, hub_sz, "fountain"))

    num_plazas = tp["num_plazas"]
    # Place secondary plazas where main roads have waypoints
    plaza_candidates = []
    for road in roads:
        if road.road_type in ("main", "secondary"):
            for pt in road.points[1:-1]:
                if wall.vertices and point_in_polygon(pt[0], pt[1], wall.vertices):
                    if dist(pt, (hub_x, hub_y)) > base_r * 0.18:
                        plaza_candidates.append(pt)
    rng.shuffle(plaza_candidates)
    for pt in plaza_candidates[:num_plazas - 1]:
        if all(dist(pt, (p.x, p.y)) > 90 for p in plazas):
            plazas.append(Plaza(pt[0], pt[1], rng.uniform(20, 38),
                                rng.choice(["square", "market", "fountain"])))

    # ── Phase 8: Market square ──
    market_sq_data = _build_market_square_roads(
        roads, wall.vertices, cx, cy, base_r, [], tier, rng, tp,
        inner_wall_poly=wall.inner_vertices if wall.inner_vertices else None)

    # ── Phase 9: Outer paths from gates ──
    for gate in wall.gates:
        ddx, ddy = normalize(cos(gate.angle), sin(gate.angle))
        end = (gate.pos[0] + ddx * base_r * 0.6, gate.pos[1] + ddy * base_r * 0.6)
        pts = _winding_road(gate.pos, end, n_mid=3, jitter=0.04)
        roads.append(Road(pts, tp["road_w_main"] * 0.7, "outer"))

    return roads, plazas, market_sq_data


def _road_dir_at(road: Road, pt: Point) -> tuple[float, float]:
    """Get the direction vector of a road at the closest point to pt."""
    best_d = float('inf')
    best_dir = (1.0, 0.0)
    for i in range(len(road.points) - 1):
        a, b = road.points[i], road.points[i + 1]
        dx, dy = b[0] - a[0], b[1] - a[1]
        seg_len_sq = dx * dx + dy * dy
        if seg_len_sq < 1e-9:
            continue
        t = max(0.0, min(1.0, ((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dy) / seg_len_sq))
        cp = (a[0] + t * dx, a[1] + t * dy)
        d = dist(pt, cp)
        if d < best_d:
            best_d = d
            ln = seg_len_sq ** 0.5
            best_dir = (dx / ln, dy / ln)
    return best_dir


def _generate_village_roads(cfg: TownConfig, wall: WallData, tier: str,
                            rng: random.Random, water: list) -> tuple[list[Road], list[Plaza], dict | None]:
    """Village roads: one main through-road with a few small branches."""
    W, H = cfg.width, cfg.height
    cx, cy = W / 2, H / 2
    tp = TIER_PARAMS[tier]
    roads: list[Road] = []
    plazas: list[Plaza] = []
    base_r = min(W, H) * tp["radius_frac"]

    # ── Main through-road: enters from one side, exits the other ──
    # Pick a slightly off-axis angle for the main road
    main_angle = rng.uniform(-PI / 6, PI / 6)  # roughly east-west with variation
    road_len = base_r * 2.2  # extends well beyond the village area
    p_start = (cx - road_len * 0.5 * cos(main_angle) - road_len * 0.5 * sin(main_angle) * 0.1,
               cy - road_len * 0.5 * sin(main_angle) + road_len * 0.5 * cos(main_angle) * 0.1)
    p_end = (cx + road_len * 0.5 * cos(main_angle) + road_len * 0.5 * sin(main_angle) * 0.1,
             cy + road_len * 0.5 * sin(main_angle) - road_len * 0.5 * cos(main_angle) * 0.1)

    # Gentle curve through the village center
    n_mid = 5
    main_pts = [p_start]
    curve_bias = rng.uniform(-0.6, 0.6)
    dx, dy = normalize(p_end[0] - p_start[0], p_end[1] - p_start[1])
    px, py = perp(dx, dy)
    seg_d = dist(p_start, p_end)
    for i in range(1, n_mid + 1):
        t = i / (n_mid + 1)
        mx, my = lerp_pt(p_start, p_end, t)
        envelope = math.sin(t * PI)
        offset = seg_d * 0.06 * curve_bias * envelope + seg_d * 0.01 * rng.uniform(-1, 1)
        main_pts.append((mx + px * offset, my + py * offset))
    main_pts.append(p_end)

    main_road = Road(main_pts, tp["road_w_main"], "main")
    roads.append(main_road)

    # ── Small plaza/crossroads at the village center ──
    # Find the point on the main road closest to the center
    center_pt = _snap_to_road((cx, cy), main_road)
    plazas.append(Plaza(center_pt[0], center_pt[1], 22, "fountain"))

    # ── A secondary road crossing at an angle ──
    cross_angle = main_angle + rng.uniform(PI * 0.3, PI * 0.7)  # 55-125° from main
    if rng.random() < 0.5:
        cross_angle = main_angle - rng.uniform(PI * 0.3, PI * 0.7)
    cross_len = base_r * rng.uniform(0.8, 1.4)
    cross_start = (center_pt[0] - cross_len * 0.5 * cos(cross_angle),
                   center_pt[1] - cross_len * 0.5 * sin(cross_angle))
    cross_end = (center_pt[0] + cross_len * 0.5 * cos(cross_angle),
                 center_pt[1] + cross_len * 0.5 * sin(cross_angle))

    cross_pts = _perturb_line(cross_start, cross_end, rng, n_mid=3, jitter=0.04)
    roads.append(Road(cross_pts, tp["road_w_sec"], "secondary"))

    # ── Meandering branch lanes off the main road ──
    num_branches = rng.randint(4, 8)
    main_samples = _build_road_sample_index([main_road], spacing=30)

    placed_branches: list[Point] = []
    for _ in range(num_branches * 3):
        if len(placed_branches) >= num_branches:
            break
        if not main_samples:
            break
        _, src_pt = rng.choice(main_samples)

        # Don't place branches too close together
        if any(dist(src_pt, bp) < 50 for bp in placed_branches):
            continue

        # Branch angle: mostly perpendicular but with wide variation
        parent_dir = _road_dir_at(main_road, src_pt)
        perp_a = math.atan2(parent_dir[1], parent_dir[0]) + PI / 2
        branch_a = perp_a + rng.uniform(-PI / 4, PI / 4)
        if rng.random() < 0.5:
            branch_a += PI  # other side

        # Varying lengths — some short stubs, some long winding paths
        length = rng.choice([
            rng.uniform(25, 50),       # short stub
            rng.uniform(50, 90),       # medium
            rng.uniform(90, base_r * 0.65),  # long meandering path
        ])

        # Build a meandering multi-segment path (not a straight line)
        n_segs = max(2, int(length / 35))
        path_pts = [src_pt]
        cur_angle = branch_a
        cur_pt = src_pt
        for si in range(n_segs):
            seg_len = length / n_segs + rng.uniform(-8, 8)
            # Wander: each segment drifts the angle slightly
            cur_angle += rng.uniform(-0.4, 0.4)
            next_pt = (cur_pt[0] + seg_len * cos(cur_angle),
                       cur_pt[1] + seg_len * sin(cur_angle))
            path_pts.append(next_pt)
            cur_pt = next_pt

        # Check the endpoint is reasonable
        end_pt = path_pts[-1]
        if water and _crosses_river(src_pt, end_pt, water):
            continue

        # Snap & extend start into main road
        snapped = _snap_to_road(path_pts[0], main_road)
        ov = main_road.width * 0.4
        ddx = snapped[0] - path_pts[1][0]
        ddy = snapped[1] - path_pts[1][1]
        lln = max(1e-6, (ddx*ddx + ddy*ddy) ** 0.5)
        path_pts[0] = (snapped[0] + ddx/lln * ov, snapped[1] + ddy/lln * ov)

        roads.append(Road(path_pts, tp["road_w_conn"], "connector"))
        placed_branches.append(src_pt)

    # ── Meandering lanes off the crossing road ──
    cross_road = roads[1]
    cross_samples = _build_road_sample_index([cross_road], spacing=35)
    for _ in range(rng.randint(2, 4)):
        if not cross_samples:
            break
        _, src_pt = rng.choice(cross_samples)
        if dist(src_pt, center_pt) < 30:
            continue

        parent_dir = _road_dir_at(cross_road, src_pt)
        perp_a = math.atan2(parent_dir[1], parent_dir[0]) + PI / 2
        branch_a = perp_a + rng.uniform(-PI / 4, PI / 4)
        if rng.random() < 0.5:
            branch_a += PI

        length = rng.choice([rng.uniform(25, 45), rng.uniform(45, base_r * 0.45)])
        n_segs = max(2, int(length / 30))
        path_pts = [src_pt]
        cur_angle = branch_a
        cur_pt = src_pt
        for si in range(n_segs):
            seg_len = length / n_segs + rng.uniform(-6, 6)
            cur_angle += rng.uniform(-0.35, 0.35)
            next_pt = (cur_pt[0] + seg_len * cos(cur_angle),
                       cur_pt[1] + seg_len * sin(cur_angle))
            path_pts.append(next_pt)
            cur_pt = next_pt

        snapped = _snap_to_road(path_pts[0], cross_road)
        ov = cross_road.width * 0.4
        ddx = snapped[0] - path_pts[1][0]
        ddy = snapped[1] - path_pts[1][1]
        lln = max(1e-6, (ddx*ddx + ddy*ddy) ** 0.5)
        path_pts[0] = (snapped[0] + ddx/lln * ov, snapped[1] + ddy/lln * ov)

        roads.append(Road(path_pts, tp["road_w_lane"], "lane"))

    # No market square for villages
    return roads, plazas, None


def generate_roads(cfg: TownConfig, wall: WallData, tier: str,
                   rng: random.Random, water: list = None) -> tuple[list[Road], list[Plaza], dict | None]:
    W, H = cfg.width, cfg.height
    cx, cy = W / 2, H / 2
    tp = TIER_PARAMS[tier]
    roads: list[Road] = []
    plazas: list[Plaza] = []
    base_r = min(W, H) * tp["radius_frac"]
    if water is None:
        water = []

    # ── Village: simple through-road layout ──
    if tier == "village":
        return _generate_village_roads(cfg, wall, tier, rng, water)

    # ── Phase 1: Main arteries (gate → center) — straight lines ──
    for gate in wall.gates:
        pts = [gate.pos, (cx, cy)]  # perfectly straight
        roads.append(Road(pts, tp["road_w_main"], "main"))

    # ── Phase 2: Ring roads — follow the wall contour, scaled inward ──
    ring_radii = []
    # Build sorted wall-angle/radius pairs for smooth interpolation
    wall_angle_radius = []
    if wall.vertices:
        for wx, wy in wall.vertices:
            wa = math.atan2(wy - cy, wx - cx)
            wr = math.hypot(wx - cx, wy - cy)
            wall_angle_radius.append((wa, wr))
        wall_angle_radius.sort()

    def _wall_r_at_angle(a):
        """Smoothly interpolate wall radius at angle a."""
        if not wall_angle_radius:
            return base_r
        # Normalize a to [-PI, PI]
        a = ((a + PI) % TAU) - PI
        # Binary search for bracketing angles
        n = len(wall_angle_radius)
        # Find the two vertices that bracket angle a
        idx = 0
        for i in range(n):
            if wall_angle_radius[i][0] > a:
                idx = i
                break
        else:
            idx = 0  # wrap around
        prev_idx = (idx - 1) % n
        a0, r0 = wall_angle_radius[prev_idx]
        a1, r1 = wall_angle_radius[idx]
        # Angular distance, handling wrap-around
        da = ((a1 - a0 + PI) % TAU) - PI
        dt = ((a - a0 + PI) % TAU) - PI
        if abs(da) < 1e-9:
            return r0
        t = max(0.0, min(1.0, dt / da))
        return r0 + (r1 - r0) * t

    for ring_frac in tp["ring_fracs"]:
        ring_r = base_r * ring_frac
        ring_radii.append(ring_r)
        n_ring = max(36, int(ring_r * TAU / 14))
        ring_pts = []
        for i in range(n_ring):
            a = TAU * i / n_ring
            wr = _wall_r_at_angle(a)
            r = wr * ring_frac
            ring_pts.append((cx + r * cos(a), cy + r * sin(a)))
        # Heavy smoothing — 5 passes to remove any angular jitter
        ring_pts = smooth_polygon(ring_pts, passes=5, blend=0.30)
        ring_pts.append(ring_pts[0])
        roads.append(Road(ring_pts, tp["road_w_sec"], "secondary"))

    # ── Phase 3: Connector radials — thinner roads between ring roads ──
    # These are visually subordinate to the ring roads and main arteries.
    # Each connector snaps to and extends INTO the ring road polylines.
    main_angles = sorted([g.angle for g in wall.gates])
    num_sec = tp["num_secondary_radials"]

    # Build lookup: ring index → Road object (ring roads are the last len(ring_radii) secondary roads)
    ring_road_objs = []
    for r in roads:
        if r.road_type == "secondary":
            ring_road_objs.append(r)

    # Overlap grid for connectors — keep them well spaced
    _conn_cell = 90
    _placed_conns: list[tuple[Point, float]] = []

    def _conn_overlaps(p0: Point, p1: Point) -> bool:
        mid = lerp_pt(p0, p1, 0.5)
        ang = _angle_of(p0, p1)
        for emid, eang in _placed_conns:
            if dist(mid, emid) < _conn_cell:
                da = abs(ang - eang)
                if da > PI / 2:
                    da = PI - da
                if da < PI / 4:
                    return True
        return False

    conn_w = tp["road_w_conn"]
    for i in range(num_sec):
        gi = i % len(main_angles)
        a1 = main_angles[gi]
        a2 = main_angles[(gi + 1) % len(main_angles)]
        t = rng.uniform(0.25, 0.75)
        angle = a1 + ((a2 - a1 + PI) % TAU - PI) * t

        ri_start = len(ring_road_objs)  # default: no snap
        ri_end = len(ring_road_objs)
        if len(ring_radii) >= 2:
            ri_start = rng.randint(0, len(ring_radii) - 2)
            ri_end = rng.randint(ri_start + 1, len(ring_radii) - 1)
            inner_r = ring_radii[ri_start]
            outer_r = ring_radii[ri_end]
        elif len(ring_radii) == 1:
            inner_r = base_r * rng.uniform(0.10, 0.22)
            outer_r = ring_radii[0]
        else:
            inner_r = base_r * rng.uniform(0.10, 0.28)
            outer_r = base_r * rng.uniform(0.55, 0.80)

        p_in = (cx + inner_r * cos(angle), cy + inner_r * sin(angle))
        p_out = (cx + outer_r * cos(angle), cy + outer_r * sin(angle))

        # Skip if crosses a river
        if water and _crosses_river(p_in, p_out, water):
            continue

        # Snap endpoints to the actual ring road polylines
        if ri_start < len(ring_road_objs):
            p_in = _snap_to_road(p_in, ring_road_objs[ri_start])
        if ri_end < len(ring_road_objs):
            p_out = _snap_to_road(p_out, ring_road_objs[ri_end])

        # Check overlap with existing connectors
        if _conn_overlaps(p_in, p_out):
            continue

        # Extend endpoints INTO the ring roads so they visually merge
        overshoot_in = tp["road_w_sec"] * 0.5
        overshoot_out = tp["road_w_sec"] * 0.5
        dx, dy = p_out[0] - p_in[0], p_out[1] - p_in[1]
        ln = (dx*dx + dy*dy) ** 0.5
        if ln > 1e-6:
            ux, uy = dx / ln, dy / ln
            p_in = (p_in[0] - ux * overshoot_in, p_in[1] - uy * overshoot_in)
            p_out = (p_out[0] + ux * overshoot_out, p_out[1] + uy * overshoot_out)

        roads.append(Road([p_in, p_out], conn_w, "connector"))
        _placed_conns.append((lerp_pt(p_in, p_out, 0.5), _angle_of(p_in, p_out)))

    # ── Phase 4: Connected side streets — straight segments ──
    # ONLY sample from main + secondary roads so every lane endpoint
    # terminates visually INTO a thick road (never lane-to-lane chains).
    major_road_samples = _build_road_sample_index(roads, spacing=20)

    min_side = 60  # reject short stubs
    max_side = base_r * 0.30

    # Overlap-prevention grid: wide spacing so lanes are well separated
    _lane_cell = 70  # grid cell size — streets within this dist compete
    _placed_lanes: dict[tuple[int,int], list[tuple[Point, float]]] = {}  # cell -> [(midpt, angle)]

    def _lane_overlaps(p0: Point, p1: Point) -> bool:
        """Reject if a nearby lane with similar angle already exists."""
        mid = lerp_pt(p0, p1, 0.5)
        ang = _angle_of(p0, p1)
        gi, gj = int(mid[0] / _lane_cell), int(mid[1] / _lane_cell)
        for di in range(-1, 2):
            for dj in range(-1, 2):
                key = (gi + di, gj + dj)
                for existing_mid, existing_ang in _placed_lanes.get(key, []):
                    if dist(mid, existing_mid) < _lane_cell * 1.4:
                        # Angle difference (direction-agnostic, 0..PI/2)
                        da = abs(ang - existing_ang)
                        if da > PI / 2:
                            da = PI - da
                        if da < PI / 4:  # within 45° = nearly parallel and close
                            return True
        return False

    def _register_lane(p0: Point, p1: Point):
        mid = lerp_pt(p0, p1, 0.5)
        ang = _angle_of(p0, p1)
        key = (int(mid[0] / _lane_cell), int(mid[1] / _lane_cell))
        _placed_lanes.setdefault(key, []).append((mid, ang))

    def _extend_into_road(pt: Point, other_pt: Point, road: 'Road') -> Point:
        """Push pt a bit past the road centerline so the lane visually
        sinks INTO the wider road surface instead of just touching it."""
        overshoot = road.width * 0.45  # extend ~half the road width past center
        dx, dy = pt[0] - other_pt[0], pt[1] - other_pt[1]
        ln = (dx*dx + dy*dy) ** 0.5
        if ln < 1e-6:
            return pt
        return (pt[0] + dx / ln * overshoot, pt[1] + dy / ln * overshoot)

    for _ in range(tp["num_side_streets"]):
        if not major_road_samples:
            break
        src_ri, src_pt = rng.choice(major_road_samples)
        if wall.vertices and not point_in_polygon(src_pt[0], src_pt[1], wall.vertices):
            continue

        best_d = float('inf')
        best_pt = None
        best_ri = -1
        candidates = rng.sample(major_road_samples, min(300, len(major_road_samples)))
        for tgt_ri, tgt_pt in candidates:
            if tgt_ri == src_ri:
                continue
            d = dist(src_pt, tgt_pt)
            if min_side < d < max_side and d < best_d:
                if not wall.vertices or point_in_polygon(tgt_pt[0], tgt_pt[1], wall.vertices):
                    best_d = d
                    best_pt = tgt_pt
                    best_ri = tgt_ri

        if best_pt:
            # Snap both endpoints exactly onto their parent road centerlines
            snapped_src = _snap_to_road(src_pt, roads[src_ri])
            snapped_tgt = _snap_to_road(best_pt, roads[best_ri])

            # Re-check length after snapping
            d = dist(snapped_src, snapped_tgt)
            if d < min_side or d > max_side:
                continue

            # Skip if this lane crosses a river
            if water and _crosses_river(snapped_src, snapped_tgt, water):
                continue

            # Skip if overlaps/doubles-up with an existing lane
            if _lane_overlaps(snapped_src, snapped_tgt):
                continue

            # Extend endpoints INTO the parent roads so the lane visually
            # merges into the wider road surface (not just touching it)
            ext_src = _extend_into_road(snapped_src, snapped_tgt, roads[src_ri])
            ext_tgt = _extend_into_road(snapped_tgt, snapped_src, roads[best_ri])

            roads.append(Road([ext_src, ext_tgt], tp["road_w_lane"], "lane"))
            _register_lane(ext_src, ext_tgt)
            # Do NOT add lane midpoints to major_road_samples —
            # this prevents lane-to-lane chains that float disconnected

    # ── Phase 5: Short alleys (dead-ends from major roads only) ──
    for _ in range(tp["num_alleys"]):
        if not major_road_samples:
            break
        src_ri, src_pt = rng.choice(major_road_samples)
        if wall.vertices and not point_in_polygon(src_pt[0], src_pt[1], wall.vertices):
            continue
        # Snap start to parent road centerline, then extend INTO the road
        snapped_src = _snap_to_road(src_pt, roads[src_ri])
        angle = rng.uniform(0, TAU)
        length = rng.uniform(30, 60)
        end_pt = (snapped_src[0] + length * cos(angle), snapped_src[1] + length * sin(angle))
        ext_src = _extend_into_road(snapped_src, end_pt, roads[src_ri])
        if not wall.vertices or point_in_polygon(end_pt[0], end_pt[1], wall.vertices):
            # Skip if this alley crosses a river
            if water and _crosses_river(ext_src, end_pt, water):
                continue
            # Skip if overlaps existing lane
            if _lane_overlaps(ext_src, end_pt):
                continue
            roads.append(Road([ext_src, end_pt], tp["road_w_lane"] * 1.5, "alley"))
            _register_lane(ext_src, end_pt)

    # ── Phase 6: Plazas at key intersections ──
    num_plazas = tp["num_plazas"]
    # Always put one at center
    center_sz = {"capital": 80, "large_town": 55, "small_town": 40, "village": 28}[tier]
    plazas.append(Plaza(cx, cy, center_sz, "fountain"))

    # Additional plazas where main roads cross ring roads
    for gate in wall.gates:
        for ring_r in ring_radii:
            if rng.random() < 0.3 and len(plazas) < num_plazas:
                angle = gate.angle
                px = cx + ring_r * cos(angle) + rng.uniform(-8, 8)
                py = cy + ring_r * sin(angle) + rng.uniform(-8, 8)
                if wall.vertices and point_in_polygon(px, py, wall.vertices):
                    plaza_r = rng.uniform(18, 35)
                    ptype = rng.choice(["square", "market", "fountain"])
                    plazas.append(Plaza(px, py, plaza_r, ptype))

    # ── Phase 6b: Market square — a road loop where roads converge ──
    market_sq_data = _build_market_square_roads(
        roads, wall.vertices, cx, cy, base_r, ring_radii, tier, rng, tp,
        inner_wall_poly=wall.inner_vertices if wall.inner_vertices else None)
    if market_sq_data:
        for mroad in market_sq_data["roads"]:
            roads.append(mroad)
        # Don't add a plaza — the market square is rendered separately
        # and we don't want a visible cobblestone rectangle.

    # ── Phase 7: Outer paths leading from gates ──
    for gate in wall.gates:
        dx, dy = normalize(cos(gate.angle), sin(gate.angle))
        end = (gate.pos[0] + dx * base_r * 0.6, gate.pos[1] + dy * base_r * 0.6)
        pts = _perturb_line(gate.pos, end, rng, n_mid=3, jitter=0.05)
        roads.append(Road(pts, tp["road_w_main"] * 0.7, "outer"))

    return roads, plazas, market_sq_data


# ════════════════════════════════════════════════════════════════════════
# §6  DISTRICT ASSIGNMENT
# ════════════════════════════════════════════════════════════════════════

def assign_district(px: float, py: float, cx: float, cy: float,
                    district_sectors: list[tuple[float, str]]) -> str:
    a = math.atan2(py - cy, px - cx)
    if a < 0:
        a += TAU
    for boundary, dname in district_sectors:
        if a < boundary:
            return dname
    return district_sectors[-1][1]


def build_district_sectors(tier: str, rng: random.Random,
                           cx: float = 0, cy: float = 0,
                           water: list = None,
                           market_data: dict = None) -> list[tuple[float, str]]:
    order = list({
        "capital":    DISTRICT_ORDER_CAPITAL,
        "large_town": DISTRICT_ORDER_TOWN,
        "small_town": DISTRICT_ORDER_TOWN,
        "village":    DISTRICT_ORDER_VILLAGE,
    }[tier])

    # ── Remove docks if no river exists ──
    has_river = False
    river_angle = None
    if water:
        for wf in water:
            if wf.is_river and wf.river_pts:
                has_river = True
                # Compute angle from city center toward the river's midpoint
                mid_pt = wf.river_pts[len(wf.river_pts) // 2]
                river_angle = math.atan2(mid_pt[1] - cy, mid_pt[0] - cx)
                if river_angle < 0:
                    river_angle += TAU
                break

    if "docks" in order and not has_river:
        # Replace docks with residential when no river
        order = [("residential" if d == "docks" else d) for d in order]

    # ── Compute anchor angles for key districts ──
    # Market should face toward actual market square
    market_angle = None
    if market_data and "cx" in market_data and "cy" in market_data:
        market_angle = math.atan2(market_data["cy"] - cy, market_data["cx"] - cx)
        if market_angle < 0:
            market_angle += TAU

    # ── Build sectors, anchoring key districts to real locations ──
    n = len(order)
    base = TAU / n

    # Primary anchor: market (most visually important)
    # Secondary anchor: docks (must be near river)
    # Strategy: rotate entire ring so market aligns, then swap docks
    # into the slot closest to the river angle.
    if market_angle is not None and "market" in order:
        mi = order.index("market")
        default_center = mi * base + base / 2
        rotation = market_angle - default_center
    elif river_angle is not None and "docks" in order:
        di = order.index("docks")
        default_center = di * base + base / 2
        rotation = river_angle - default_center
    else:
        rotation = rng.uniform(0, TAU)

    # After rotation, check if docks is near the river; if not, swap it
    if river_angle is not None and "docks" in order:
        di = order.index("docks")
        dock_center = (di * base + base / 2 + rotation) % TAU
        dock_err = min(abs(dock_center - river_angle),
                       TAU - abs(dock_center - river_angle))
        if dock_err > base * 1.5:
            # Find which slot is closest to the river angle
            best_slot = di
            best_err = dock_err
            for si in range(n):
                if order[si] == "docks":
                    continue
                slot_center = (si * base + base / 2 + rotation) % TAU
                err = min(abs(slot_center - river_angle),
                          TAU - abs(slot_center - river_angle))
                if err < best_err:
                    best_err = err
                    best_slot = si
            if best_slot != di:
                order[di], order[best_slot] = order[best_slot], order[di]

    boundaries = []
    cumulative = 0
    for i, dname in enumerate(order):
        cumulative += base + rng.uniform(-base * 0.10, base * 0.10)
        boundaries.append((cumulative, dname))
    scale = TAU / cumulative

    # Apply rotation and normalize to [0, TAU]
    result = []
    for b, d in boundaries:
        angle = (b * scale + rotation) % TAU
        result.append((angle, d))

    # Sort by angle so sectors are in angular order
    result.sort(key=lambda x: x[0])
    return result


# ════════════════════════════════════════════════════════════════════════
# §7  BUILDING TYPES & SHAPES
# ════════════════════════════════════════════════════════════════════════

@dataclass
class Building:
    x: float
    y: float
    w: float
    h: float
    btype: str           # "house", "shop", "tavern", "special", "poi"
    shape: str = "rect"  # "rect", "l_shape", "u_shape", "courtyard", "round"
    name: str = ""
    icon: str = ""
    roof_color: str = ""
    wall_color: str = ""
    district: str = "residential"
    rotation: float = 0
    # Compound shape details
    wing_w: float = 0
    wing_h: float = 0
    wing_corner: str = ""  # "ne", "nw", "se", "sw"
    courtyard_margin: float = 0
    gate_sides: list = None  # list of sides ("n","s","e","w") where castle gates go
    castle_shape: str = "rect"  # "rect", "L", "U", "hex"
    castle_gates: list = None  # list of (x, y, angle) for exact gate positions on perimeter

    @property
    def rect(self) -> Rect:
        return (self.x, self.y, self.x + self.w, self.y + self.h)

    @property
    def cx(self) -> float:
        return self.x + self.w / 2

    @property
    def cy(self) -> float:
        return self.y + self.h / 2


SHOP_NAMES = [
    "Blacksmith", "Apothecary", "General Store", "Bakery", "Tailor", "Jeweler",
    "Bookshop", "Fletcher", "Leatherworker", "Enchanter", "Herbalist", "Armorer",
    "Cartographer", "Candlemaker", "Carpenter", "Glassblower", "Weaver", "Brewer",
    "Tanner", "Cobbler", "Furrier", "Tinker", "Scribe", "Mason", "Potter",
    "Alchemist", "Dye Works", "Rope Maker", "Locksmith", "Perfumer",
]

TAVERN_NAMES = [
    "The Golden Flagon", "The Rusty Anchor", "The Prancing Pony", "The Silver Stag",
    "The Sleeping Dragon", "The Laughing Rogue", "The Copper Kettle", "The Broken Crown",
    "The Wanderer's Rest", "The Dancing Bear", "The Last Hearth", "The Crimson Lantern",
    "The Drunken Dwarf", "The Moonlit Owl", "The Iron Tankard", "The Verdant Vine",
    "The Gilded Gryphon", "The Salty Dog", "The Three Crowns", "The Blind Harpy",
]

SPECIAL_BUILDINGS = {
    "capital": [
        ("Castle", 300, 240, "castle"), ("Cathedral", 75, 58, "cathedral"),
        ("Mage Tower", 45, 45, "mage_tower"), ("Barracks", 65, 50, "barracks"),
        ("Grand Market Hall", 70, 52, "market_hall"), ("Guildhall", 55, 42, "guildhall"),
    ],
    "large_town": [
        ("Town Hall", 58, 46, "hall"), ("Temple", 52, 44, "temple"),
        ("Guard Tower", 34, 34, "guard_tower"),
    ],
    "small_town": [
        ("Town Hall", 46, 38, "hall"), ("Chapel", 36, 32, "chapel"),
    ],
    "village": [
        ("Elder's Hall", 40, 32, "hall"),
    ],
}

POI_TYPES = [
    "Town Well", "Statue", "Fountain", "Notice Board", "Shrine", "Guard Post",
    "Market Stall", "Stable", "Library", "Graveyard", "Training Ground",
    "Watchtower", "Garden", "Prison", "Warehouse", "Granary", "Windmill",
]


def _pick_building_shape(district: str, bw: float, bh: float, rng: random.Random) -> str:
    """Pick a building footprint shape based on district and size."""
    dinfo = DISTRICTS[district]
    if rng.random() > dinfo["compound_chance"]:
        return "rect"
    if min(bw, bh) < 12:
        return "rect"  # too small for compound shapes
    shapes = ["l_shape", "u_shape", "courtyard"]
    weights = [0.50, 0.25, 0.25]
    if district == "noble":
        weights = [0.30, 0.30, 0.40]
    elif district == "temple":
        weights = [0.40, 0.40, 0.20]
    r = rng.uniform(0, sum(weights))
    cumul = 0
    for s, w in zip(shapes, weights):
        cumul += w
        if r <= cumul:
            return s
    return "l_shape"


# ════════════════════════════════════════════════════════════════════════
# §8  BUILDING PLACEMENT
# ════════════════════════════════════════════════════════════════════════

def _reserve_roads(spatial: SpatialHash, roads: list[Road]):
    for road in roads:
        if road.road_type == "outer":
            continue
        for i in range(len(road.points) - 1):
            p0, p1 = road.points[i], road.points[i+1]
            seg_len = dist(p0, p1)
            steps = max(2, int(seg_len / 10))
            for s in range(steps + 1):
                t = s / steps
                rpx, rpy = lerp_pt(p0, p1, t)
                hw = road.width * 0.65
                spatial.insert((rpx - hw, rpy - hw, rpx + hw, rpy + hw))


def _reserve_plazas(spatial: SpatialHash, plazas: list[Plaza]):
    for p in plazas:
        spatial.insert((p.x - p.radius, p.y - p.radius,
                        p.x + p.radius, p.y + p.radius))


MARKET_SHOP_TYPES = [
    # (name, wall_color, roof_color) — muted earthy tones
    ("Baker", "#c8b898", "#8a6848"),
    ("Butcher", "#c4b498", "#7a5040"),
    ("Greengrocer", "#c0b898", "#6a7858"),
    ("Fishmonger", "#b8b8b0", "#5a7078"),
    ("Candlemaker", "#d0c8a8", "#8a7858"),
    ("Weaver", "#c0b8b0", "#6a5868"),
    ("Spice Merchant", "#c8b890", "#8a6848"),
    ("Cheese Monger", "#ccc098", "#8a7850"),
    ("Potter", "#c0a890", "#7a6048"),
    ("Wine Merchant", "#c0b0a8", "#6a4848"),
    ("Jeweler", "#c0c0b8", "#5a5868"),
    ("Herbalist", "#b8c0a8", "#5a6848"),
    ("Tailor", "#c0b8b8", "#686068"),
    ("Cobbler", "#b8a890", "#6a5840"),
    ("Tanner", "#c0a880", "#7a5838"),
    ("Florist", "#c0c0a8", "#687858"),
]

STALL_COLORS = [
    "#c45040", "#d09030", "#4878a8", "#488858", "#a85890",
    "#c87030", "#3888a0", "#b84848", "#58a048", "#8860a8",
    "#d06830", "#3878b0", "#c04870", "#48a078", "#b88030",
]


def _place_market_square_shops(market_data: dict, wall_poly: list[Point],
                               spatial: SpatialHash, rng: random.Random,
                               tier: str,
                               inner_wall_poly: list[Point] = None) -> MarketSquare | None:
    """Place shops lining both sides of ALL roads throughout the market area —
    along approaches, the perimeter, and any nearby road segments.
    Excludes shops from inside the inner wall / castle district."""
    mcx = market_data["cx"]
    mcy = market_data["cy"]
    sq_r = market_data["radius"]
    shape = market_data["shape"]
    perimeter = market_data["perimeter"]
    connected_angles = market_data.get("connected_angles", [])
    all_roads = market_data.get("all_roads", [])

    mx = mcx - sq_r
    my = mcy - sq_r
    sq_w = sq_r * 2
    sq_h = sq_r * 2

    shops = []
    shop_pool = list(MARKET_SHOP_TYPES) * 4  # repeat pool so we never run out
    rng.shuffle(shop_pool)
    shop_idx = 0

    shop_w_range = {"capital": (16, 26), "large_town": (14, 22), "small_town": (12, 18), "village": (10, 14)}[tier]
    shop_h_range = {"capital": (12, 20), "large_town": (10, 16), "small_town": (8, 14), "village": (7, 11)}[tier]
    max_shops = {"capital": 50, "large_town": 30, "small_town": 18, "village": 8}[tier]
    # How far from market center to place shops (larger = shops spread further)
    market_zone = sq_r * {"capital": 2.2, "large_town": 2.0, "small_town": 1.8, "village": 1.6}[tier]

    # ── Collect all road segments within the market zone ──
    # For each segment, we'll place shops on both sides at regular intervals.
    road_segments = []  # list of (p0, p1, width, road_type)
    for road in all_roads:
        rw = road.width
        for i in range(len(road.points) - 1):
            p0, p1 = road.points[i], road.points[i + 1]
            seg_mid = ((p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2)
            seg_len = dist(p0, p1)
            if seg_len < 5:
                continue
            d_to_market = dist(seg_mid, (mcx, mcy))
            if d_to_market < market_zone:
                road_segments.append((p0, p1, rw, road.road_type, seg_len, d_to_market))

    # Sort by distance to market center — place shops on closer roads first
    road_segments.sort(key=lambda s: s[5])

    # NOTE: We only use real town roads — NOT the artificial market perimeter.
    # Shops should line the actual roads that pass through/near the market.

    # ── Place shops along both sides of each road segment ──
    for (p0, p1, rw, rtype, seg_len, d_mkt) in road_segments:
        if shop_idx >= max_shops:
            break
        if rtype in ("lane", "alley"):
            continue  # skip tiny roads

        dx = p1[0] - p0[0]
        dy = p1[1] - p0[1]
        length = (dx * dx + dy * dy) ** 0.5
        if length < 1:
            continue
        # Unit direction along the road
        ux, uy = dx / length, dy / length
        # Perpendicular (to place shops on either side)
        px, py = -uy, ux

        road_half_w = rw / 2 + 3  # setback from road edge

        # How many shops fit along this segment
        avg_shop_w = (shop_w_range[0] + shop_w_range[1]) / 2
        spacing = avg_shop_w + rng.uniform(2, 5)
        n_along = max(1, int(seg_len / spacing))

        for side in [1, -1]:
            for si in range(n_along):
                if shop_idx >= max_shops:
                    break

                sw = rng.uniform(*shop_w_range)
                sh = rng.uniform(*shop_h_range)

                # Position along the road
                t = (si + 0.5) / n_along
                cx2 = p0[0] + dx * t
                cy2 = p0[1] + dy * t
                # Offset to the side
                cx2 += px * side * (road_half_w + sh / 2)
                cy2 += py * side * (road_half_w + sh / 2)

                # Must be within the market zone
                if dist((cx2, cy2), (mcx, mcy)) > market_zone:
                    continue
                # Don't place too close to the fountain/center
                if dist((cx2, cy2), (mcx, mcy)) < sq_r * 0.3:
                    continue
                # Don't place inside the inner wall (castle district)
                if inner_wall_poly and point_in_polygon(cx2, cy2, inner_wall_poly):
                    continue

                bx = cx2 - sw / 2
                by = cy2 - sh / 2
                brect = (bx, by, bx + sw, by + sh)

                if (wall_poly and point_in_polygon(cx2, cy2, wall_poly)
                        and not spatial.collides(brect, pad=2)):
                    spatial.insert(brect)
                    sname, swc, src = shop_pool[shop_idx % len(shop_pool)]
                    b = Building(bx, by, sw, sh, "shop", name=sname, district="market")
                    b.wall_color = swc
                    b.roof_color = src
                    # Rotate to roughly align with road
                    road_angle = math.degrees(math.atan2(dy, dx))
                    b.rotation = road_angle + rng.uniform(-8, 8)
                    shops.append(b)
                    shop_idx += 1

    # ── Place stalls inside the market square open area ──
    stalls = []
    num_stalls = {"capital": 10, "large_town": 6, "small_town": 4, "village": 2}[tier]
    center_clear = sq_r * 0.22
    for _ in range(num_stalls):
        for _ in range(30):
            if shape == "circle":
                a = rng.uniform(0, TAU)
                r = rng.uniform(center_clear + 8, sq_r * 0.75)
                sx = mcx + r * cos(a)
                sy = mcy + r * sin(a)
            else:
                sx = rng.uniform(mx + 20, mx + sq_w - 20)
                sy = rng.uniform(my + 20, my + sq_h - 20)
            if dist((sx, sy), (mcx, mcy)) < center_clear:
                continue
            if inner_wall_poly and point_in_polygon(sx, sy, inner_wall_poly):
                continue
            srect = (sx - 6, sy - 4, sx + 6, sy + 4)
            if not spatial.collides(srect, pad=2):
                spatial.insert(srect)
                rot = rng.uniform(-20, 20)
                color = rng.choice(STALL_COLORS)
                stalls.append((sx, sy, rot, color))
                break

    has_fountain = rng.random() < 0.6
    has_well = not has_fountain and rng.random() < 0.7

    # Reserve the market interior so regular buildings don't infill over it
    spatial.insert((mx - 4, my - 4, mx + sq_w + 4, my + sq_h + 4))

    return MarketSquare(mx, my, sq_w, sq_h, shops, stalls,
                        has_fountain=has_fountain, has_well=has_well,
                        name=f"{'Round' if shape == 'circle' else 'Town'} Market",
                        shape=shape)


def _find_inner_wall_gates(inner_verts: list[Point], roads: list[Road]) -> list[Point]:
    """Find points where main/secondary roads cross the inner wall polygon."""
    gates = []
    n = len(inner_verts)
    for road in roads:
        if road.road_type not in ("main", "secondary", "connector"):
            continue
        for si in range(len(road.points) - 1):
            rp0, rp1 = road.points[si], road.points[si + 1]
            for wi in range(n):
                wp0 = inner_verts[wi]
                wp1 = inner_verts[(wi + 1) % n]
                cross = seg_intersect(rp0, rp1, wp0, wp1)
                if cross is not None:
                    # Don't duplicate gates too close together
                    too_close = any(dist(cross, g) < 40 for g in gates)
                    if not too_close:
                        gates.append(cross)
    return gates


def _reserve_inner_wall(inner_verts: list[Point], spatial: SpatialHash, pad: float = 18):
    """Reserve the inner wall path in the spatial hash so buildings don't overlap it."""
    n = len(inner_verts)
    for i in range(n):
        p0 = inner_verts[i]
        p1 = inner_verts[(i + 1) % n]
        seg_len = dist(p0, p1)
        steps = max(2, int(seg_len / 12))
        for s in range(steps + 1):
            t = s / steps
            wx, wy = lerp_pt(p0, p1, t)
            spatial.insert((wx - pad, wy - pad, wx + pad, wy + pad))


def _make_building(bx: float, by: float, bw: float, bh: float,
                   district: str, rng: random.Random, roads: list[Road]) -> Building:
    """Create a building with shape, colors, and road alignment."""
    dinfo = DISTRICTS[district]
    shape = _pick_building_shape(district, bw, bh, rng)

    # Compute rotation to align with nearest road
    rd, r_angle, _ = _nearest_road_info(bx + bw/2, by + bh/2, roads)
    if rd < 80:
        # Snap to road angle (nearest 90 degrees)
        deg = math.degrees(r_angle)
        snap = round(deg / 90) * 90
        rotation = snap + rng.uniform(-3, 3)
    else:
        rotation = rng.uniform(-5, 5)

    b = Building(bx, by, bw, bh, "house", shape=shape, district=district)
    b.roof_color = rng.choice(dinfo["roofs"])
    b.wall_color = rng.choice(dinfo["walls"])
    b.rotation = rotation

    if shape == "l_shape":
        b.wing_w = bw * rng.uniform(0.35, 0.55)
        b.wing_h = bh * rng.uniform(0.35, 0.55)
        b.wing_corner = rng.choice(["ne", "nw", "se", "sw"])
    elif shape == "u_shape":
        b.wing_w = bw * rng.uniform(0.25, 0.40)
        b.wing_h = bh * rng.uniform(0.50, 0.70)
        b.wing_corner = rng.choice(["east", "west"])
    elif shape == "courtyard":
        b.courtyard_margin = min(bw, bh) * rng.uniform(0.18, 0.28)

    return b


def place_buildings_along_roads(roads: list[Road], wall_poly: list[Point],
                                spatial: SpatialHash, district_sectors: list,
                                cx: float, cy: float,
                                rng: random.Random, tier: str,
                                inner_wall_poly: list[Point] = None) -> list[Building]:
    tp = TIER_PARAMS[tier]
    buildings: list[Building] = []

    for road in roads:
        if road.road_type == "outer":
            continue
        for seg_i in range(len(road.points) - 1):
            p0 = road.points[seg_i]
            p1 = road.points[seg_i + 1]
            seg_len = dist(p0, p1)
            if seg_len < 8:
                continue
            dx, dy = normalize(p1[0]-p0[0], p1[1]-p0[1])
            nx, ny = perp(dx, dy)

            for side in (-1, 1):
                cursor = 0
                while cursor < seg_len - 4:
                    t = cursor / seg_len
                    road_pt = lerp_pt(p0, p1, t)
                    # Inside inner wall → force noble district (larger buildings)
                    if inner_wall_poly and point_in_polygon(road_pt[0], road_pt[1], inner_wall_poly):
                        dname = "noble"
                    else:
                        dname = assign_district(road_pt[0], road_pt[1], cx, cy, district_sectors)
                    dinfo = DISTRICTS[dname]

                    bw = rng.uniform(dinfo["bw"][0], dinfo["bw"][1])
                    bh = rng.uniform(dinfo["bh"][0], dinfo["bh"][1])
                    setback = road.width * 0.35 + rng.uniform(0.3, 1.5)

                    bcx = road_pt[0] + nx * side * (setback + bh / 2)
                    bcy = road_pt[1] + ny * side * (setback + bh / 2)
                    bx = bcx - bw / 2
                    by = bcy - bh / 2
                    rect = (bx, by, bx + bw, by + bh)

                    if (wall_poly and point_in_polygon(bcx, bcy, wall_poly) and
                            not spatial.collides(rect, pad=dinfo["gap"])):
                        spatial.insert(rect)
                        b = _make_building(bx, by, bw, bh, dname, rng, roads)
                        buildings.append(b)

                    cursor += bw + rng.uniform(dinfo["gap"], dinfo["gap"] + 0.8)

    return buildings


def infill_buildings(wall_poly: list[Point], spatial: SpatialHash,
                     district_sectors: list, cx: float, cy: float,
                     rng: random.Random, tier: str,
                     target_count: int, roads: list[Road],
                     inner_wall_poly: list[Point] = None) -> list[Building]:
    tp = TIER_PARAMS[tier]
    buildings: list[Building] = []
    if not wall_poly:
        return buildings

    xs = [p[0] for p in wall_poly]
    ys = [p[1] for p in wall_poly]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)

    attempts = 0
    max_attempts = target_count * 25
    while len(buildings) < target_count and attempts < max_attempts:
        attempts += 1
        px = rng.uniform(min_x + 8, max_x - 8)
        py = rng.uniform(min_y + 8, max_y - 8)

        if not point_in_polygon(px, py, wall_poly):
            continue

        # Inside inner wall → force noble district
        if inner_wall_poly and point_in_polygon(px, py, inner_wall_poly):
            dname = "noble"
        else:
            dname = assign_district(px, py, cx, cy, district_sectors)
        dinfo = DISTRICTS[dname]

        if rng.random() > dinfo["density"]:
            continue

        bw = rng.uniform(dinfo["bw"][0], dinfo["bw"][1])
        bh = rng.uniform(dinfo["bh"][0], dinfo["bh"][1])
        bx, by = px - bw / 2, py - bh / 2
        rect = (bx, by, bx + bw, by + bh)

        if not spatial.collides(rect, pad=dinfo["gap"]):
            spatial.insert(rect)
            b = _make_building(bx, by, bw, bh, dname, rng, roads)
            buildings.append(b)

    return buildings


def infill_buildings_small(wall_poly: list[Point], spatial: SpatialHash,
                           district_sectors: list, cx: float, cy: float,
                           rng: random.Random, tier: str,
                           target_count: int,
                           inner_wall_poly: list[Point] = None) -> list[Building]:
    """Third pass: pack tiny buildings into remaining gaps."""
    buildings: list[Building] = []
    if not wall_poly:
        return buildings
    xs = [p[0] for p in wall_poly]
    ys = [p[1] for p in wall_poly]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)

    attempts = 0
    max_attempts = target_count * 20
    while len(buildings) < target_count and attempts < max_attempts:
        attempts += 1
        px = rng.uniform(min_x + 6, max_x - 6)
        py = rng.uniform(min_y + 6, max_y - 6)
        if not point_in_polygon(px, py, wall_poly):
            continue
        # Inside inner wall → force noble district
        if inner_wall_poly and point_in_polygon(px, py, inner_wall_poly):
            dname = "noble"
        else:
            dname = assign_district(px, py, cx, cy, district_sectors)
        dinfo = DISTRICTS[dname]
        # Use smaller buildings
        bw = rng.uniform(max(5, dinfo["bw"][0] * 0.7), dinfo["bw"][1] * 0.75)
        bh = rng.uniform(max(5, dinfo["bh"][0] * 0.7), dinfo["bh"][1] * 0.75)
        bx, by = px - bw / 2, py - bh / 2
        rect = (bx, by, bx + bw, by + bh)
        if not spatial.collides(rect, pad=dinfo["gap"] * 0.7):
            spatial.insert(rect)
            b = Building(bx, by, bw, bh, "house", district=dname)
            b.roof_color = rng.choice(dinfo["roofs"])
            b.wall_color = rng.choice(dinfo["walls"])
            b.rotation = rng.uniform(-4, 4)
            buildings.append(b)
    return buildings


def _place_castle_early(cfg: TownConfig, wall_poly: list[Point],
                        spatial: SpatialHash, tier: str,
                        rng: random.Random) -> Building:
    """Place the castle before roads so it gets unobstructed space near center."""
    cx, cy = cfg.width / 2, cfg.height / 2
    specials = SPECIAL_BUILDINGS.get(tier, [])
    for sname, sw, sh, sicon in specials:
        if sname != "Castle":
            continue
        pad = 15  # clearance from water features already placed
        for attempt in range(200):
            angle = rng.uniform(0, TAU)
            # Start near center, gradually widen search
            max_d = min(cfg.width, cfg.height) * (0.04 + attempt * 0.002)
            d = rng.uniform(5, max_d)
            bx = cx + d * cos(angle) - sw / 2
            by = cy + d * sin(angle) - sh / 2
            rect = (bx, by, bx + sw, by + sh)
            bcx, bcy = bx + sw / 2, by + sh / 2

            if (wall_poly and point_in_polygon(bcx, bcy, wall_poly) and
                    not spatial.collides(rect, pad=pad)):
                # Reserve the castle footprint + margin so roads/buildings route around it
                margin = 30
                expanded = (rect[0] - margin, rect[1] - margin,
                            rect[2] + margin, rect[3] + margin)
                spatial.insert(expanded)
                castle_shapes = ["rect", "L", "U", "hex"]
                cshape = rng.choice(castle_shapes)
                b = Building(bx, by, sw, sh, "special", name=sname, icon=sicon,
                             district="noble", castle_shape=cshape)
                b.roof_color = "#707878"
                b.wall_color = "#c0b8a8"
                return b
    return None


def place_special_buildings(cfg: TownConfig, wall_poly: list[Point],
                            spatial: SpatialHash, tier: str,
                            rng: random.Random,
                            roads: list[Road] = None) -> list[Building]:
    cx, cy = cfg.width / 2, cfg.height / 2
    specials = SPECIAL_BUILDINGS.get(tier, [])
    buildings: list[Building] = []

    for sname, sw, sh, sicon in specials:
        if sname == "Castle":
            continue  # Castle is placed early via _place_castle_early
        is_castle = False
        pad = 14

        for attempt in range(200):
            if is_castle and attempt < 80:
                # Place castle near center — widen search radius gradually
                angle = rng.uniform(0, TAU)
                max_d = min(cfg.width, cfg.height) * (0.06 + attempt * 0.003)
                d = rng.uniform(10, max_d)
            else:
                angle = rng.uniform(0, TAU)
                base_r = min(cfg.width, cfg.height) * TIER_PARAMS[tier]["radius_frac"]
                d = rng.uniform(base_r * 0.05, base_r * 0.50)
            bx = cx + d * cos(angle) - sw / 2
            by = cy + d * sin(angle) - sh / 2
            rect = (bx, by, bx + sw, by + sh)
            bcx, bcy = bx + sw / 2, by + sh / 2

            if (wall_poly and point_in_polygon(bcx, bcy, wall_poly) and
                    not spatial.collides(rect, pad=pad)):
                if is_castle:
                    # Reserve a wider exclusion zone so houses don't crowd the castle
                    margin = 15
                    expanded = (rect[0] - margin, rect[1] - margin,
                                rect[2] + margin, rect[3] + margin)
                    spatial.insert(expanded)
                else:
                    spatial.insert(rect)
                b = Building(bx, by, sw, sh, "special", name=sname, icon=sicon,
                             district="noble" if is_castle else "temple")
                b.roof_color = "#707878"
                b.wall_color = "#c0b8a8"

                # Determine which sides of the castle face main roads
                if is_castle and roads:
                    gate_sides = _compute_castle_gate_sides(b, roads)
                    b.gate_sides = gate_sides if gate_sides else ["s"]

                buildings.append(b)
                break

    return buildings


def _compute_castle_gate_sides(b: Building, roads: list[Road]) -> list[str]:
    """Figure out which sides of the castle are closest to main/secondary roads.
    Also computes exact gate positions on the castle perimeter and stores them
    in b.castle_gates as list of (x, y, angle) tuples."""
    sides = []
    gate_positions = []
    x, y, w, h = b.x, b.y, b.w, b.h
    pad = 6  # expand detection box slightly

    # Build castle perimeter segments based on castle_shape
    perimeter = _castle_perimeter(b)

    for road in roads:
        if road.road_type not in ("main", "secondary"):
            continue
        for si in range(len(road.points) - 1):
            rp0, rp1 = road.points[si], road.points[si + 1]
            for pi in range(len(perimeter)):
                wp0 = perimeter[pi]
                wp1 = perimeter[(pi + 1) % len(perimeter)]
                cross = seg_intersect(rp0, rp1, wp0, wp1)
                if cross is not None:
                    # Compute wall direction angle at this point
                    wdx = wp1[0] - wp0[0]
                    wdy = wp1[1] - wp0[1]
                    wall_angle = math.atan2(wdy, wdx)
                    # Check not too close to existing gates
                    too_close = any(dist(cross, (g[0], g[1])) < 30 for g in gate_positions)
                    if not too_close:
                        gate_positions.append((cross[0], cross[1], wall_angle))

    # Also compute side labels for backwards compatibility
    side_mids = {
        "n": (b.cx, b.y),
        "s": (b.cx, b.y + b.h),
        "w": (b.x, b.cy),
        "e": (b.x + b.w, b.cy),
    }
    for side, (sx, sy) in side_mids.items():
        for gx, gy, _ in gate_positions:
            if side in ("n", "s"):
                if abs(gy - sy) < h * 0.15:
                    if side not in sides:
                        sides.append(side)
            else:
                if abs(gx - sx) < w * 0.15:
                    if side not in sides:
                        sides.append(side)

    b.castle_gates = gate_positions
    return sides


def _castle_perimeter(b: Building) -> list[Point]:
    """Return the perimeter polygon for a castle based on its shape."""
    x, y, w, h = b.x, b.y, b.w, b.h
    shape = b.castle_shape

    if shape == "L":
        # L-shape: main rect with a wing cut out of top-right
        cw, ch = w * 0.40, h * 0.40  # cutout size
        return [
            (x, y), (x + w - cw, y), (x + w - cw, y + ch),
            (x + w, y + ch), (x + w, y + h),
            (x, y + h),
        ]
    elif shape == "U":
        # U-shape: open at the top center
        notch_w = w * 0.36
        notch_h = h * 0.35
        nx_left = x + (w - notch_w) / 2
        return [
            (x, y), (nx_left, y), (nx_left, y + notch_h),
            (nx_left + notch_w, y + notch_h), (nx_left + notch_w, y),
            (x + w, y), (x + w, y + h), (x, y + h),
        ]
    elif shape == "hex":
        # Hexagonal-ish shape
        inset = min(w, h) * 0.18
        return [
            (x + inset, y), (x + w - inset, y),
            (x + w, y + h * 0.30), (x + w, y + h * 0.70),
            (x + w - inset, y + h), (x + inset, y + h),
            (x, y + h * 0.70), (x, y + h * 0.30),
        ]
    else:
        # Default rectangle
        return [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]


def place_shops_and_taverns(roads: list[Road], wall_poly: list[Point],
                            spatial: SpatialHash, cx: float, cy: float,
                            rng: random.Random, tier: str,
                            canvas_w: int = 1600, canvas_h: int = 1200) -> list[Building]:
    buildings: list[Building] = []
    base_r = min(canvas_w, canvas_h) * 0.35

    num_shops = {"capital": 28, "large_town": 14, "small_town": 7, "village": 3}[tier]
    num_taverns = {"capital": 8, "large_town": 4, "small_town": 2, "village": 1}[tier]

    shop_pool = list(SHOP_NAMES)
    rng.shuffle(shop_pool)
    tavern_pool = list(TAVERN_NAMES)
    rng.shuffle(tavern_pool)

    max_r = base_r * 0.85
    for i in range(num_shops + num_taverns):
        is_tavern = i >= num_shops
        for attempt in range(60):
            angle = rng.uniform(0, TAU)
            r = rng.uniform(30, max_r)
            bw = rng.uniform(30, 56)
            bh = rng.uniform(24, 46)
            bx = cx + r * cos(angle) - bw / 2
            by = cy + r * sin(angle) - bh / 2
            bcx, bcy = bx + bw / 2, by + bh / 2
            rect = (bx, by, bx + bw, by + bh)

            if (wall_poly and point_in_polygon(bcx, bcy, wall_poly) and
                    not spatial.collides(rect, pad=4)):
                spatial.insert(rect)
                if is_tavern:
                    name = tavern_pool[min(i - num_shops, len(tavern_pool)-1)]
                    b = Building(bx, by, bw, bh, "tavern", name=name, district="market")
                    b.roof_color = rng.choice(["#8a4020", "#7a3018", "#9a5030"])
                    b.wall_color = "#c8a060"
                else:
                    name = shop_pool[min(i, len(shop_pool)-1)]
                    b = Building(bx, by, bw, bh, "shop", name=name, district="market")
                    b.roof_color = rng.choice(["#9a5a3a", "#a06040", "#b87050"])
                    b.wall_color = "#ddd0a8"
                buildings.append(b)
                break

    return buildings


def place_pois(wall_poly: list[Point], spatial: SpatialHash,
               cx: float, cy: float, rng: random.Random,
               tier: str, canvas_w: int = 1600, canvas_h: int = 1200) -> list[Building]:
    num = {"capital": 16, "large_town": 10, "small_town": 6, "village": 3}[tier]
    pool = list(POI_TYPES)
    rng.shuffle(pool)
    buildings: list[Building] = []
    base_r = min(canvas_w, canvas_h) * 0.35

    for i in range(min(num, len(pool))):
        for attempt in range(50):
            angle = rng.uniform(0, TAU)
            r = rng.uniform(20, base_r)
            px = cx + r * cos(angle)
            py = cy + r * sin(angle)
            rect = (px - 10, py - 10, px + 10, py + 10)
            if wall_poly and point_in_polygon(px, py, wall_poly) and \
               not spatial.collides(rect, pad=6):
                spatial.insert(rect)
                b = Building(px - 10, py - 10, 20, 20, "poi", name=pool[i], district="residential")
                buildings.append(b)
                break

    return buildings


# ════════════════════════════════════════════════════════════════════════
# §9  DETAIL ELEMENTS
# ════════════════════════════════════════════════════════════════════════

@dataclass
class Detail:
    x: float
    y: float
    detail_type: str  # "well", "barrel", "crate", "market_stall", "garden",
                      # "fence", "haystack", "gravestone", "dock_plank"
    w: float = 6
    h: float = 6
    rotation: float = 0
    color: str = ""


def generate_details(cfg: TownConfig, wall_poly: list[Point], roads: list[Road],
                     buildings: list[Building], plazas: list[Plaza],
                     spatial: SpatialHash, rng: random.Random, tier: str) -> list[Detail]:
    W, H = cfg.width, cfg.height
    cx, cy = W / 2, H / 2
    tp = TIER_PARAMS[tier]
    details: list[Detail] = []
    base_r = min(W, H) * tp["radius_frac"]

    # ── Wells near some plazas / intersections ──
    for _ in range(tp["num_wells"]):
        angle = rng.uniform(0, TAU)
        r = rng.uniform(base_r * 0.10, base_r * 0.85)
        wx = cx + r * cos(angle)
        wy = cy + r * sin(angle)
        if wall_poly and point_in_polygon(wx, wy, wall_poly):
            wrect = (wx - 5, wy - 5, wx + 5, wy + 5)
            if not spatial.collides(wrect, pad=5):
                spatial.insert(wrect)
                details.append(Detail(wx, wy, "well", 10, 10))

    # ── Market stalls in market-ish areas ──
    for _ in range(tp["num_market_stalls"]):
        # Place near center / plazas
        if plazas:
            plaza = rng.choice(plazas)
            angle = rng.uniform(0, TAU)
            r = rng.uniform(plaza.radius * 0.3, plaza.radius * 1.3)
            sx = plaza.x + r * cos(angle)
            sy = plaza.y + r * sin(angle)
        else:
            angle = rng.uniform(0, TAU)
            r = rng.uniform(15, 100)
            sx = cx + r * cos(angle)
            sy = cy + r * sin(angle)

        if wall_poly and point_in_polygon(sx, sy, wall_poly):
            srect = (sx - 4, sy - 3, sx + 4, sy + 3)
            if not spatial.collides(srect, pad=2):
                spatial.insert(srect)
                rot = rng.uniform(-30, 30)
                color = rng.choice(["#c44020", "#d4a030", "#2060a0", "#208040", "#a04080"])
                details.append(Detail(sx, sy, "market_stall", 8, 5, rot, color))

    # ── Gardens behind residential buildings ──
    residential = [b for b in buildings if b.district in ("residential", "noble") and b.btype == "house"]
    garden_candidates = rng.sample(residential, min(tp["num_gardens"], len(residential)))
    for b in garden_candidates:
        # Place garden on the far side from the road
        _, r_angle, _ = _nearest_road_info(b.cx, b.cy, roads)
        # Opposite direction from road
        gx = b.cx - cos(r_angle) * (b.h * 0.5 + 6)
        gy = b.cy - sin(r_angle) * (b.h * 0.5 + 6)
        gw = rng.uniform(6, 14)
        gh = rng.uniform(5, 10)
        grect = (gx - gw/2, gy - gh/2, gx + gw/2, gy + gh/2)
        if wall_poly and point_in_polygon(gx, gy, wall_poly):
            if not spatial.collides(grect, pad=1):
                spatial.insert(grect)
                details.append(Detail(gx, gy, "garden", gw, gh))

    # ── Barrels and crates near taverns, warehouses, docks ──
    taverns_etc = [b for b in buildings if b.btype in ("tavern", "shop")]
    barrel_candidates = rng.sample(taverns_etc, min(tp["num_barrels"], len(taverns_etc)))
    for b in barrel_candidates:
        for _ in range(rng.randint(1, 3)):
            offset_a = rng.uniform(0, TAU)
            offset_r = max(b.w, b.h) * 0.5 + rng.uniform(2, 6)
            bx = b.cx + offset_r * cos(offset_a)
            by = b.cy + offset_r * sin(offset_a)
            dtype = rng.choice(["barrel", "crate"])
            sz = rng.uniform(3, 5)
            brect = (bx - sz, by - sz, bx + sz, by + sz)
            if not spatial.collides(brect, pad=1):
                spatial.insert(brect)
                details.append(Detail(bx, by, dtype, sz * 2, sz * 2, rng.uniform(0, 45)))

    # ── Fences between close buildings ──
    for _ in range(tp["num_fences"]):
        if len(buildings) < 2:
            break
        b1 = rng.choice(buildings)
        if b1.btype != "house":
            continue
        # Find a nearby building
        for b2 in buildings:
            if b2 is b1 or b2.btype != "house":
                continue
            d = dist((b1.cx, b1.cy), (b2.cx, b2.cy))
            if 10 < d < 35:
                details.append(Detail(
                    (b1.cx + b2.cx) / 2, (b1.cy + b2.cy) / 2,
                    "fence", d, 1,
                    math.degrees(math.atan2(b2.cy - b1.cy, b2.cx - b1.cx))
                ))
                break

    # ── Haystacks outside walls ──
    for _ in range(5 if tier in ("capital", "large_town") else 2):
        angle = rng.uniform(0, TAU)
        r = base_r * rng.uniform(1.05, 1.30)
        hx = cx + r * cos(angle)
        hy = cy + r * sin(angle)
        if 20 < hx < W - 20 and 20 < hy < H - 20:
            details.append(Detail(hx, hy, "haystack", rng.uniform(8, 14), rng.uniform(6, 10)))

    return details


# ════════════════════════════════════════════════════════════════════════
# §10  TREES & WATER
# ════════════════════════════════════════════════════════════════════════

@dataclass
class TreeCluster:
    x: float
    y: float
    r: float
    trees: int
    tree_type: str = "deciduous"  # "deciduous", "conifer"

@dataclass
class WaterFeature:
    cx: float
    cy: float
    rx: float
    ry: float
    name: str = ""
    is_river: bool = False
    river_pts: list[Point] = field(default_factory=list)
    river_width: float = 40


def generate_trees(cfg: TownConfig, wall_poly: list[Point], spatial: SpatialHash,
                   tier: str, rng: random.Random) -> list[TreeCluster]:
    W, H = cfg.width, cfg.height
    cx, cy = W / 2, H / 2
    tp = TIER_PARAMS[tier]
    base_r = min(W, H) * tp["radius_frac"]
    num_trees = rng.randint(*tp["num_trees_range"])
    clusters: list[TreeCluster] = []

    for _ in range(num_trees):
        for _ in range(15):
            angle = rng.uniform(0, TAU)
            r = rng.uniform(base_r * 0.15, base_r * 1.6)
            tx = cx + r * cos(angle)
            ty = cy + r * sin(angle)
            if tx < 10 or tx > W - 10 or ty < 10 or ty > H - 10:
                continue
            tree_r = rng.uniform(5, 20)
            trect = (tx - tree_r, ty - tree_r, tx + tree_r, ty + tree_r)

            inside = wall_poly and point_in_polygon(tx, ty, wall_poly)
            if inside:
                if rng.random() < 0.30 and not spatial.collides(trect, pad=3):
                    spatial.insert(trect)
                    ttype = rng.choice(["deciduous", "deciduous", "conifer"])
                    clusters.append(TreeCluster(tx, ty, tree_r, rng.randint(1, 3), ttype))
                    break
            else:
                if not spatial.collides(trect, pad=1):
                    spatial.insert(trect)
                    ttype = rng.choice(["deciduous", "conifer", "deciduous"])
                    clusters.append(TreeCluster(tx, ty, tree_r, rng.randint(2, 6), ttype))
                    break

    return clusters


def generate_water(cfg: TownConfig, wall_poly: list[Point], spatial: SpatialHash,
                   rng: random.Random, tier: str) -> list[WaterFeature]:
    features = []
    W, H = cfg.width, cfg.height
    cx, cy = W / 2, H / 2
    base_r = min(W, H) * TIER_PARAMS[tier]["radius_frac"]

    if tier in ("large_town",) and rng.random() < 0.40:
        side = rng.choice(["horizontal", "vertical"])
        river_pts = []
        rw = rng.uniform(32, 52)
        if side == "horizontal":
            y_off = rng.uniform(-base_r * 0.25, base_r * 0.25)
            for i in range(14):
                rx = W * i / 13
                ry = cy + y_off + rng.uniform(-25, 25)
                river_pts.append((rx, ry))
        else:
            x_off = rng.uniform(-base_r * 0.25, base_r * 0.25)
            for i in range(14):
                ry = H * i / 13
                rx = cx + x_off + rng.uniform(-25, 25)
                river_pts.append((rx, ry))
        wf = WaterFeature(cx, cy, 0, 0, "River", is_river=True,
                          river_pts=river_pts, river_width=rw)
        features.append(wf)
        for pt in river_pts:
            hw = rw * 0.7
            spatial.insert((pt[0]-hw, pt[1]-hw, pt[0]+hw, pt[1]+hw))

    num_ponds = rng.randint(0, 1)
    if tier == "capital":
        num_ponds = 0  # No ponds in capitals — keep dense urban layout
    elif tier == "large_town":
        num_ponds = rng.randint(0, 2)
    for _ in range(num_ponds):
        for _ in range(30):
            pa = rng.uniform(0, TAU)
            pd = base_r * rng.uniform(0.12, 0.60)
            prx = rng.uniform(18, 50) * (1.4 if tier == "capital" else 1.0)
            pry = rng.uniform(14, 40) * (1.4 if tier == "capital" else 1.0)
            pcx = cx + pd * cos(pa)
            pcy = cy + pd * sin(pa)
            prect = (pcx - prx - 4, pcy - pry - 4, pcx + prx + 4, pcy + pry + 4)
            if not spatial.collides(prect, pad=6):
                spatial.insert(prect)
                features.append(WaterFeature(pcx, pcy, prx, pry, "Pond"))
                break

    return features


# ════════════════════════════════════════════════════════════════════════
# §11  SVG RENDERING
# ════════════════════════════════════════════════════════════════════════

class SvgCanvas:
    def __init__(self, w: int, h: int):
        self.w, self.h = w, h
        self.parts: list[str] = []
        self.defs: list[str] = []

    def add_def(self, d: str):
        self.defs.append(d)

    def el(self, tag: str, **kw):
        a = "".join(f' {k.replace("_","-")}="{escape(str(v),{chr(34):"&quot;"})}"'
                     for k, v in kw.items() if v is not None)
        self.parts.append(f"<{tag}{a}/>")

    def txt(self, content: str, **kw):
        a = "".join(f' {k.replace("_","-")}="{escape(str(v),{chr(34):"&quot;"})}"'
                     for k, v in kw.items() if v is not None)
        self.parts.append(f"<text{a}>{escape(content)}</text>")

    def raw(self, s: str):
        self.parts.append(s)

    def render(self) -> str:
        d = f"<defs>{''.join(self.defs)}</defs>" if self.defs else ""
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" '
                f'viewBox="0 0 {self.w} {self.h}">{d}{"".join(self.parts)}</svg>')


def render_town_svg(town: dict) -> str:
    cfg: TownConfig = town["cfg"]
    W, H = cfg.width, cfg.height
    cx, cy = W / 2, H / 2
    tier = town["tier"]
    wall: WallData = town["wall"]
    roads: list[Road] = town["roads"]
    plazas: list[Plaza] = town["plazas"]
    buildings: list[Building] = town["buildings"]
    # Market square shops are already in buildings list via generate_town()
    trees: list[TreeCluster] = town["trees"]
    water: list[WaterFeature] = town["water"]
    details: list[Detail] = town["details"]

    svg = SvgCanvas(W, H)
    rng = random.Random(town["seed"] + 777)
    P = Pal

    # ── Defs ──
    svg.add_def(f'''<radialGradient id="bgGrad" cx="50%" cy="50%" r="58%">
        <stop offset="0%" stop-color="{P.bg}"/>
        <stop offset="100%" stop-color="{P.bg_outer}"/>
    </radialGradient>''')
    svg.add_def('''<filter id="bSh"><feDropShadow dx="1.8" dy="1.8" stdDeviation="1.4"
        flood-color="#2a2010" flood-opacity="0.16"/></filter>''')
    svg.add_def('''<filter id="wSh"><feDropShadow dx="3" dy="3" stdDeviation="2.5"
        flood-color="#2a2010" flood-opacity="0.18"/></filter>''')
    # Cobblestone pattern
    svg.add_def(f'''<pattern id="cobble" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="{P.road_main}"/>
        <circle cx="2" cy="2" r="1.2" fill="{P.road_cobble}" opacity="0.18"/>
        <circle cx="7" cy="6" r="1.0" fill="{P.road_edge}" opacity="0.12"/>
        <circle cx="4" cy="8" r="0.9" fill="{P.road_cobble}" opacity="0.14"/>
    </pattern>''')
    # Grass pattern for gardens
    svg.add_def(f'''<pattern id="grass" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="{P.garden}"/>
        <circle cx="2" cy="3" r="0.8" fill="{P.garden_dark}" opacity="0.35"/>
        <circle cx="6" cy="6" r="0.6" fill="{P.green_dark}" opacity="0.30"/>
    </pattern>''')

    # ════════ LAYER 0: Background ════════
    svg.el("rect", x="0", y="0", width=str(W), height=str(H), fill="url(#bgGrad)")

    # Parchment texture noise
    for _ in range(100):
        tx = rng.uniform(0, W); ty = rng.uniform(0, H)
        tr = rng.uniform(12, 65)
        svg.el("circle", cx=f"{tx:.0f}", cy=f"{ty:.0f}", r=f"{tr:.0f}",
               fill=rng.choice(["#c8bca0","#d8d0b0","#b8a880","#ddd5c0","#c0b498"]),
               opacity=f"{rng.uniform(0.015, 0.045):.3f}")

    # ════════ LAYER 0b: Outer terrain ════════
    base_r = min(W, H) * TIER_PARAMS[tier]["radius_frac"]
    # Farm fields outside walls
    for _ in range(20):
        fa = rng.uniform(0, TAU)
        fd = base_r * rng.uniform(1.0, 1.5)
        fx, fy = cx + fd * cos(fa), cy + fd * sin(fa)
        fw, fh = rng.uniform(25, 90), rng.uniform(20, 65)
        if 0 < fx < W and 0 < fy < H:
            svg.el("rect", x=f"{fx:.0f}", y=f"{fy:.0f}",
                   width=f"{fw:.0f}", height=f"{fh:.0f}",
                   fill=rng.choice([P.green_light, "#c0b880", "#b8c888", "#c8c498", "#a8b878"]),
                   opacity=f"{rng.uniform(0.05, 0.12):.2f}", rx="2",
                   transform=f"rotate({rng.uniform(-25,25):.0f} {fx+fw/2:.0f} {fy+fh/2:.0f})")

    # ════════ LAYER 1: Ground fill inside walls ════════
    if wall.vertices and tier != "village":
        wd = _poly_d(wall.vertices)
        svg.el("path", d=wd, fill=P.bg_inner, stroke="none", opacity="0.65")

    # ════════ LAYER 2: Water features ════════
    for wf in water:
        if wf.is_river:
            rd = _catmull_rom_path(wf.river_pts)
            rw = wf.river_width
            svg.el("path", d=rd, fill="none", stroke=P.water_shore,
                   stroke_width=f"{rw + 14:.0f}", stroke_linecap="round",
                   stroke_linejoin="round", opacity="0.25")
            svg.el("path", d=rd, fill="none", stroke=P.water,
                   stroke_width=f"{rw:.0f}", stroke_linecap="round",
                   stroke_linejoin="round", opacity="0.72")
            svg.el("path", d=rd, fill="none", stroke=P.water_light,
                   stroke_width=f"{rw * 0.35:.0f}", stroke_linecap="round",
                   stroke_linejoin="round", opacity="0.18")
            # Water ripple lines
            for i in range(0, len(wf.river_pts) - 1, 2):
                p0, p1 = wf.river_pts[i], wf.river_pts[min(i+1, len(wf.river_pts)-1)]
                mid = lerp_pt(p0, p1, 0.5)
                ripple_w = rw * 0.3
                svg.el("line", x1=f"{mid[0] - ripple_w:.0f}", y1=f"{mid[1]:.0f}",
                       x2=f"{mid[0] + ripple_w:.0f}", y2=f"{mid[1]:.0f}",
                       stroke="#a0d8d8", stroke_width="1.5", opacity="0.15",
                       stroke_linecap="round")
        else:
            _render_pond(svg, wf, rng, P)

    # ════════ LAYER 3: Roads (narrow first, wide on top to cut off side streets) ════════
    # Outer paths (faint trails outside the city)
    outer_d = ""
    outer_w = 0
    for road in roads:
        if road.road_type != "outer":
            continue
        rd = _catmull_rom_path(road.points)
        if rd:
            outer_d += " " + rd
            outer_w = max(outer_w, road.width)
    if outer_d:
        svg.el("path", d=outer_d.strip(), fill="none", stroke=P.road,
               stroke_width=f"{outer_w:.0f}", stroke_linecap="butt",
               stroke_linejoin="round", opacity="0.25")

    # Interior roads: group by road_type so each type merges into ONE path
    type_groups: dict[str, tuple[str, float]] = {}  # type -> (path_d, width)
    for road in roads:
        if road.road_type == "outer":
            continue
        rd = _catmull_rom_path(road.points)
        if rd:
            rt = road.road_type
            if rt not in type_groups:
                type_groups[rt] = ("", road.width)
            old_d, old_w = type_groups[rt]
            type_groups[rt] = (old_d + " " + rd, max(old_w, road.width))

    # Render NARROWEST first, widest last — side streets go down first,
    # then main roads paint over them so side streets appear to stop/merge
    # into the main road rather than crossing over it
    render_order = ["alley", "lane", "connector", "secondary", "main"]
    for rt in render_order:
        if rt not in type_groups:
            continue
        path_d, w = type_groups[rt]
        color = P.road_main if rt == "main" else P.road
        svg.el("path", d=path_d.strip(), fill="none",
               stroke=color, stroke_width=f"{w:.0f}",
               stroke_linecap="butt", stroke_linejoin="round",
               opacity="1.0")

    # ════════ LAYER 4: Plazas ════════
    for plaza in plazas:
        r = plaza.radius
        # Plaza ground
        svg.el("rect", x=f"{plaza.x - r:.0f}", y=f"{plaza.y - r:.0f}",
               width=f"{r * 2:.0f}", height=f"{r * 2:.0f}",
               fill="url(#cobble)", stroke=P.road_edge, stroke_width="1.5",
               rx="5", opacity="0.60")
        # Inner border
        svg.el("rect", x=f"{plaza.x - r + 4:.0f}", y=f"{plaza.y - r + 4:.0f}",
               width=f"{r * 2 - 8:.0f}", height=f"{r * 2 - 8:.0f}",
               fill="none", stroke=P.road_edge, stroke_width="0.6", rx="3", opacity="0.20")

        if plaza.plaza_type == "fountain":
            # Fountain basin
            svg.el("circle", cx=f"{plaza.x:.0f}", cy=f"{plaza.y:.0f}",
                   r=f"{r * 0.22:.0f}", fill=P.water, stroke=P.water_dark,
                   stroke_width="2", opacity="0.55")
            svg.el("circle", cx=f"{plaza.x:.0f}", cy=f"{plaza.y:.0f}",
                   r=f"{r * 0.10:.0f}", fill=P.water_light, opacity="0.35")
            # Spray drops
            for _ in range(4):
                da = rng.uniform(0, TAU)
                dr = r * 0.15
                svg.el("circle", cx=f"{plaza.x + dr * cos(da):.0f}",
                       cy=f"{plaza.y + dr * sin(da):.0f}",
                       r="1.5", fill=P.water_light, opacity="0.25")
        elif plaza.plaza_type == "market":
            # Market cross / monument
            svg.el("rect", x=f"{plaza.x - 3:.0f}", y=f"{plaza.y - r * 0.15:.0f}",
                   width="6", height=f"{r * 0.3:.0f}",
                   fill=P.wall_stone, opacity="0.45")
            svg.el("rect", x=f"{plaza.x - r * 0.10:.0f}", y=f"{plaza.y - 3:.0f}",
                   width=f"{r * 0.2:.0f}", height="6",
                   fill=P.wall_stone, opacity="0.45")
        else:
            # Simple statue/obelisk
            svg.el("circle", cx=f"{plaza.x:.0f}", cy=f"{plaza.y:.0f}",
                   r=f"{r * 0.12:.0f}", fill=P.wall_stone, stroke=P.wall_dark,
                   stroke_width="1.5", opacity="0.40")

    # ════════ LAYER 4b: Market Square ════════
    market_sq = town.get("market_square")
    if market_sq:
        _render_market_square(svg, market_sq, rng, P, tier)

    # ════════ LAYER 5: Trees outside walls ════════
    outside_trees = [t for t in trees if not (wall.vertices and point_in_polygon(t.x, t.y, wall.vertices))]
    inside_trees = [t for t in trees if wall.vertices and point_in_polygon(t.x, t.y, wall.vertices)]

    for tc in outside_trees:
        _render_tree_cluster(svg, tc, rng, P)

    # ════════ LAYER 6: Details (ground level - gardens, fences) ════════
    for det in details:
        _render_detail(svg, det, rng, P)

    # ════════ LAYER 7: Buildings (non-castle) ════════
    sorted_bldgs = sorted(buildings, key=lambda b: b.y)
    castle_bldg = None
    svg.raw('<g filter="url(#bSh)">')
    for b in sorted_bldgs:
        if b.icon == "castle":
            castle_bldg = b
            continue  # render castle on its own layer
        _render_building(svg, b, rng, tier)
    svg.raw('</g>')

    # ════════ LAYER 7b: Castle (above other buildings, below city walls) ════════
    if castle_bldg:
        svg.raw('<g filter="url(#bSh)">')
        _render_building(svg, castle_bldg, rng, tier)
        svg.raw('</g>')

    # Inside trees (canopy over buildings)
    for tc in inside_trees:
        _render_tree_cluster(svg, tc, rng, P)

    # ════════ LAYER 8: Walls & Towers ════════
    if wall.vertices and TIER_PARAMS[tier]["wall_verts"] > 0:
        _render_walls(svg, wall, tier, rng, P)

    # ════════ LAYER 9: Bridge overlays (on top of walls) ════════
    _render_bridges(svg, water, wall, roads, rng, P, tier)

    # ════════ LAYER 10a: Special building labels only (scaled to canvas) ════════
    base_scale = W / 2200
    for b in sorted_bldgs:
        if b.btype == "special" and b.name:
            fs = max(11, int(14 * base_scale))
            sw = max(3, fs * 0.3)
            svg.txt(b.name, x=f"{b.cx:.1f}", y=f"{b.y - 5:.1f}",
                    text_anchor="middle", fill=P.text,
                    font_family="'Spectral', Georgia, serif", font_size=str(fs),
                    font_weight="600",
                    opacity="0.82", paint_order="stroke",
                    stroke=P.parchment, stroke_width=f"{sw:.1f}")
        elif b.btype == "poi" and b.name:
            fs_poi = max(7, int(9 * base_scale))
            svg.txt(b.name, x=f"{b.cx:.1f}", y=f"{b.cy + 14:.1f}",
                    text_anchor="middle", fill="#4a7a90",
                    font_family="'Spectral', Georgia, serif", font_size=str(fs_poi),
                    font_style="italic", font_weight="600", opacity="0.68",
                    paint_order="stroke", stroke=P.parchment,
                    stroke_width=f"{max(2, fs_poi * 0.25):.1f}")

    # ════════ LAYER 10b: District name labels ════════
    district_sectors = town.get("district_sectors", [])
    if district_sectors and wall.vertices:
        _render_district_labels(svg, district_sectors, wall, cx, cy, W, H, tier, P)

    # ════════ LAYER 11: Frame, compass, title ════════
    _render_chrome(svg, cfg, tier, W, H, P, rng)

    return svg.render()


def _render_building(svg: SvgCanvas, b: Building, rng: random.Random, tier: str):
    x, y, w, h = b.x, b.y, b.w, b.h
    roof_c = b.roof_color or "#9a5a3a"
    wall_c = b.wall_color or "#d4c8a4"
    rot = b.rotation
    P = Pal

    if b.btype == "poi":
        pcx, pcy = b.cx, b.cy
        svg.el("circle", cx=f"{pcx:.1f}", cy=f"{pcy:.1f}", r="7",
               fill="#c0d0d0", stroke="#4a7a90", stroke_width="1.5", opacity="0.55")
        svg.el("circle", cx=f"{pcx:.1f}", cy=f"{pcy:.1f}", r="3",
               fill="#4a7a90", stroke="white", stroke_width="0.8", opacity="0.75")
        return

    if b.btype == "special":
        _render_special_building(svg, b, rng)
        return

    # Market shops get unique, trade-specific rendering
    if b.btype == "shop" and b.district == "market":
        _render_market_shop(svg, b, rng, tier)
        return

    # ── Standard building ──
    transform = f"rotate({rot:.1f} {b.cx:.1f} {b.cy:.1f})" if abs(rot) > 0.5 else None

    if b.shape == "l_shape" and b.wing_w > 0:
        _render_l_building(svg, b, transform, rng)
        return
    elif b.shape == "u_shape" and b.wing_w > 0:
        _render_u_building(svg, b, transform, rng)
        return
    elif b.shape == "courtyard" and b.courtyard_margin > 0:
        _render_courtyard_building(svg, b, transform, rng)
        return

    # Basic rect building
    _render_rect_building(svg, x, y, w, h, roof_c, wall_c, transform, rng, b.btype)


def _render_rect_building(svg, x, y, w, h, roof_c, wall_c, transform, rng, btype="house"):
    P = Pal
    # Wall base
    svg.el("rect", x=f"{x:.1f}", y=f"{y:.1f}", width=f"{w:.1f}", height=f"{h:.1f}",
           fill=wall_c, stroke="#6a5a40", stroke_width="0.7", rx="0.5",
           opacity="0.93", transform=transform)
    # Roof
    inset = min(1.5, w * 0.06, h * 0.06)
    svg.el("rect", x=f"{x+inset:.1f}", y=f"{y+inset:.1f}",
           width=f"{w-2*inset:.1f}", height=f"{h-2*inset:.1f}",
           fill=roof_c, opacity="0.83", rx="0.3", transform=transform)
    # Ridge line
    if w >= h:
        ry = y + h / 2
        svg.el("line", x1=f"{x + 2:.1f}", y1=f"{ry:.1f}",
               x2=f"{x + w - 2:.1f}", y2=f"{ry:.1f}",
               stroke="rgba(0,0,0,0.20)", stroke_width="1.2",
               stroke_linecap="round", transform=transform)
    else:
        rx_line = x + w / 2
        svg.el("line", x1=f"{rx_line:.1f}", y1=f"{y + 2:.1f}",
               x2=f"{rx_line:.1f}", y2=f"{y + h - 2:.1f}",
               stroke="rgba(0,0,0,0.20)", stroke_width="1.2",
               stroke_linecap="round", transform=transform)
    # Windows (small dots along sides)
    if w > 12 and h > 10:
        num_win = max(1, int(w / 8))
        for wi in range(num_win):
            wx = x + 3 + (w - 6) * (wi + 0.5) / num_win
            svg.el("rect", x=f"{wx - 1:.1f}", y=f"{y + 2:.1f}",
                   width="2", height="2", fill=P.window, stroke=P.window_frame,
                   stroke_width="0.3", opacity="0.40", transform=transform)
            svg.el("rect", x=f"{wx - 1:.1f}", y=f"{y + h - 4:.1f}",
                   width="2", height="2", fill=P.window, stroke=P.window_frame,
                   stroke_width="0.3", opacity="0.40", transform=transform)
    # Door
    if w > 8:
        dx = x + w * rng.uniform(0.35, 0.65)
        svg.el("rect", x=f"{dx - 1.5:.1f}", y=f"{y + h - 3:.1f}",
               width="3", height="3", fill=P.door, rx="0.5",
               opacity="0.50", transform=transform)
    # Chimney
    if btype == "tavern" or (btype == "house" and rng.random() < 0.25):
        chx = x + w * rng.uniform(0.7, 0.9)
        chy = y + 2
        svg.el("rect", x=f"{chx-2:.1f}", y=f"{chy-4:.1f}",
               width="4", height="5", fill="#4a3a28", rx="0.5", opacity="0.60",
               transform=transform)
        # Smoke wisps
        if btype == "tavern":
            for i in range(3):
                svg.el("circle", cx=f"{chx + rng.uniform(-2, 2):.1f}",
                       cy=f"{chy - 6 - i * 4:.1f}",
                       r=f"{2 + i:.1f}", fill="#bbb", opacity=f"{0.12 - i*0.03:.2f}")
    # Shop awning
    if btype == "shop":
        svg.el("line", x1=f"{x:.1f}", y1=f"{y + h - 1.5:.1f}",
               x2=f"{x + w:.1f}", y2=f"{y + h - 1.5:.1f}",
               stroke="#c9a85c", stroke_width="2.5", opacity="0.50",
               transform=transform)
    # Tavern sign
    if btype == "tavern":
        sx = x + w + 1
        sy = y + h * 0.4
        svg.el("rect", x=f"{sx:.1f}", y=f"{sy:.1f}",
               width="5", height="4", fill="#7a5020", rx="0.5",
               opacity="0.45", transform=transform)
        svg.el("line", x1=f"{sx + 2.5:.1f}", y1=f"{sy:.1f}",
               x2=f"{sx + 2.5:.1f}", y2=f"{sy - 3:.1f}",
               stroke="#5a3a18", stroke_width="0.8", opacity="0.40",
               transform=transform)


def _render_l_building(svg, b, transform, rng):
    """Render L-shaped building."""
    x, y, w, h = b.x, b.y, b.w, b.h
    ww, wh = b.wing_w, b.wing_h
    corner = b.wing_corner

    # Main body
    _render_rect_building(svg, x, y, w, h - wh if corner in ("se", "sw") else h,
                          b.roof_color, b.wall_color, transform, rng, b.btype)
    # Wing
    if corner == "se":
        _render_rect_building(svg, x + w - ww, y + h - wh, ww, wh,
                              b.roof_color, b.wall_color, transform, rng)
    elif corner == "sw":
        _render_rect_building(svg, x, y + h - wh, ww, wh,
                              b.roof_color, b.wall_color, transform, rng)
    elif corner == "ne":
        _render_rect_building(svg, x + w - ww, y, ww, wh,
                              b.roof_color, b.wall_color, transform, rng)
    else:  # nw
        _render_rect_building(svg, x, y, ww, wh,
                              b.roof_color, b.wall_color, transform, rng)


def _render_u_building(svg, b, transform, rng):
    """Render U-shaped building."""
    x, y, w, h = b.x, b.y, b.w, b.h
    ww, wh = b.wing_w, b.wing_h
    P = Pal

    # Bottom bar
    _render_rect_building(svg, x, y + h - (h - wh), w, h - wh,
                          b.roof_color, b.wall_color, transform, rng, b.btype)
    # Left wing
    _render_rect_building(svg, x, y, ww, wh,
                          b.roof_color, b.wall_color, transform, rng)
    # Right wing
    _render_rect_building(svg, x + w - ww, y, ww, wh,
                          b.roof_color, b.wall_color, transform, rng)
    # Courtyard floor (between wings)
    cx_inner = x + ww
    cy_inner = y
    cw_inner = w - 2 * ww
    ch_inner = wh
    if cw_inner > 2 and ch_inner > 2:
        svg.el("rect", x=f"{cx_inner:.1f}", y=f"{cy_inner:.1f}",
               width=f"{cw_inner:.1f}", height=f"{ch_inner:.1f}",
               fill=P.garden, opacity="0.25", transform=transform)


def _render_courtyard_building(svg, b, transform, rng):
    """Render building with inner courtyard."""
    x, y, w, h = b.x, b.y, b.w, b.h
    m = b.courtyard_margin
    P = Pal

    # Outer walls
    _render_rect_building(svg, x, y, w, h, b.roof_color, b.wall_color, transform, rng, b.btype)
    # Inner courtyard (garden/paved)
    if w - 2*m > 3 and h - 2*m > 3:
        fill = rng.choice([P.garden, P.road, P.bg_inner])
        svg.el("rect", x=f"{x + m:.1f}", y=f"{y + m:.1f}",
               width=f"{w - 2*m:.1f}", height=f"{h - 2*m:.1f}",
               fill=fill, stroke="#8a7a60", stroke_width="0.5",
               rx="1", opacity="0.50", transform=transform)
        # Small tree or well in courtyard
        if rng.random() < 0.5:
            svg.el("circle", cx=f"{b.cx:.1f}", cy=f"{b.cy:.1f}",
                   r="2.5", fill=P.green_dark, opacity="0.40", transform=transform)


def _render_castle(svg: SvgCanvas, b: Building, rng: random.Random, P):
    """Render a large, visually striking castle compound with varied shape,
    keep, courtyard, moat, specialty buildings, thick curtain walls, towers,
    and gatehouses positioned exactly where roads meet the perimeter."""
    x, y, w, h = b.x, b.y, b.w, b.h
    bcx, bcy = b.cx, b.cy
    wall_t = 10
    tower_r = min(w, h) * 0.065
    gate_w = 24
    moat_w = 8
    castle_gates = b.castle_gates or []
    perimeter = _castle_perimeter(b)
    n_perim = len(perimeter)

    # ── Helpers ──
    def _wall_seg(p0, p1, t=wall_t):
        svg.el("line", x1=f"{p0[0]:.1f}", y1=f"{p0[1]:.1f}",
               x2=f"{p1[0]:.1f}", y2=f"{p1[1]:.1f}",
               stroke=P.wall_fill, stroke_width=f"{t:.0f}",
               stroke_linecap="butt", opacity="0.95")
        svg.el("line", x1=f"{p0[0]:.1f}", y1=f"{p0[1]:.1f}",
               x2=f"{p1[0]:.1f}", y2=f"{p1[1]:.1f}",
               stroke=P.wall_stone, stroke_width=f"{t - 3:.0f}",
               stroke_linecap="butt", opacity="0.40")
        svg.el("line", x1=f"{p0[0]:.1f}", y1=f"{p0[1]:.1f}",
               x2=f"{p1[0]:.1f}", y2=f"{p1[1]:.1f}",
               stroke=P.wall_dark, stroke_width="2",
               stroke_linecap="butt", opacity="0.45")

    def _tower(tx, ty, r, big=True):
        svg.el("circle", cx=f"{tx:.1f}", cy=f"{ty:.1f}", r=f"{r + 3:.1f}",
               fill=P.shadow, opacity="0.12")
        svg.el("circle", cx=f"{tx:.1f}", cy=f"{ty:.1f}", r=f"{r:.1f}",
               fill=P.tower_fill, stroke=P.wall_dark,
               stroke_width="2.5" if big else "2", opacity="0.94")
        svg.el("circle", cx=f"{tx:.1f}", cy=f"{ty:.1f}", r=f"{r * 0.55:.1f}",
               fill=P.tower_top, stroke=P.wall_dark, stroke_width="0.8",
               opacity="0.60")
        if big:
            svg.el("circle", cx=f"{tx:.1f}", cy=f"{ty:.1f}", r=f"{r * 0.82:.1f}",
                   fill="none", stroke=P.wall_dark, stroke_width="1.2",
                   stroke_dasharray="3,3", opacity="0.30")
            for a_deg in range(0, 360, 45):
                bx2 = tx + r * 0.90 * cos(a_deg * math.pi / 180)
                by2 = ty + r * 0.90 * sin(a_deg * math.pi / 180)
                svg.el("circle", cx=f"{bx2:.1f}", cy=f"{by2:.1f}",
                       r="1.5", fill=P.wall_dark, opacity="0.20")

    def _small_bldg(bx2, by2, bw2, bh2, fill):
        svg.el("rect", x=f"{bx2 + 2:.1f}", y=f"{by2 + 2:.1f}",
               width=f"{bw2:.1f}", height=f"{bh2:.1f}",
               fill=P.shadow, rx="1", opacity="0.10")
        svg.el("rect", x=f"{bx2:.1f}", y=f"{by2:.1f}",
               width=f"{bw2:.1f}", height=f"{bh2:.1f}",
               fill=fill, stroke=P.wall_dark, stroke_width="1.5",
               rx="1", opacity="0.88")
        svg.el("line", x1=f"{bx2 + bw2 * 0.06:.1f}", y1=f"{by2 + bh2 / 2:.1f}",
               x2=f"{bx2 + bw2 * 0.94:.1f}", y2=f"{by2 + bh2 / 2:.1f}",
               stroke=P.wall_dark, stroke_width="1.2", opacity="0.25")
        for wx_f in (0.30, 0.70):
            for wy_f in (0.30, 0.70):
                svg.el("rect", x=f"{bx2 + bw2 * wx_f - 1.5:.1f}",
                       y=f"{by2 + bh2 * wy_f - 1.5:.1f}",
                       width="3", height="3",
                       fill=P.wall_dark, opacity="0.18", rx="0.5")

    # ══════════════════════════════════════════════════════════════
    # 0. MOAT — follows the perimeter shape, offset outward
    # ══════════════════════════════════════════════════════════════
    # Compute an offset perimeter for the moat
    moat_offset = moat_w + 4
    moat_poly = []
    for i in range(n_perim):
        p = perimeter[i]
        # Offset each vertex outward from center
        dx, dy = p[0] - bcx, p[1] - bcy
        d = math.hypot(dx, dy)
        if d > 1e-6:
            moat_poly.append((p[0] + dx / d * moat_offset, p[1] + dy / d * moat_offset))
        else:
            moat_poly.append(p)

    # Outer bank
    outer_bank = []
    for i in range(n_perim):
        p = perimeter[i]
        dx, dy = p[0] - bcx, p[1] - bcy
        d = math.hypot(dx, dy)
        if d > 1e-6:
            outer_bank.append((p[0] + dx / d * (moat_offset + 4), p[1] + dy / d * (moat_offset + 4)))
        else:
            outer_bank.append(p)
    svg.el("path", d=_poly_d(outer_bank), fill="#8a8a70", opacity="0.18")
    svg.el("path", d=_poly_d(moat_poly), fill="#607868", opacity="0.22")
    # Inner fill covers the moat interior
    inner_bank = []
    for i in range(n_perim):
        p = perimeter[i]
        dx, dy = p[0] - bcx, p[1] - bcy
        d = math.hypot(dx, dy)
        if d > 1e-6:
            inner_bank.append((p[0] + dx / d * 2, p[1] + dy / d * 2))
        else:
            inner_bank.append(p)
    svg.el("path", d=_poly_d(inner_bank), fill="#c8c0a8", opacity="1.0")

    # ══════════════════════════════════════════════════════════════
    # 1. GROUND — courtyard floor following the castle shape
    # ══════════════════════════════════════════════════════════════
    # Shadow
    shadow_poly = []
    for p in perimeter:
        shadow_poly.append((p[0] + 4, p[1] + 4))
    svg.el("path", d=_poly_d(shadow_poly), fill=P.shadow, opacity="0.16")

    # Courtyard ground
    svg.el("path", d=_poly_d(perimeter), fill="#ccc4ac", stroke="none", opacity="1.0")

    # Cobblestone paving texture
    for _ in range(int(w * h / 200)):
        sx = rng.uniform(x + 10, x + w - 10)
        sy = rng.uniform(y + 10, y + h - 10)
        if point_in_polygon(sx, sy, perimeter):
            sr = rng.uniform(1.0, 2.5)
            svg.el("circle", cx=f"{sx:.1f}", cy=f"{sy:.1f}", r=f"{sr:.1f}",
                   fill="#b5ad95", opacity=f"{rng.uniform(0.08, 0.16):.2f}")

    # Paving grid lines (clipped to shape via path)
    for gx_off in range(int(x + 20), int(x + w - 10), 20):
        svg.el("line", x1=f"{gx_off}", y1=f"{y + 10:.0f}",
               x2=f"{gx_off}", y2=f"{y + h - 10:.0f}",
               stroke="#a8a088", stroke_width="0.5", opacity="0.08")
    for gy_off in range(int(y + 20), int(y + h - 10), 20):
        svg.el("line", x1=f"{x + 10:.0f}", y1=f"{gy_off}",
               x2=f"{x + w - 10:.0f}", y2=f"{gy_off}",
               stroke="#a8a088", stroke_width="0.5", opacity="0.08")

    # ══════════════════════════════════════════════════════════════
    # 2. INNER KEEP
    # ══════════════════════════════════════════════════════════════
    kw, kh = w * 0.30, h * 0.32
    kx = x + w * 0.05
    ky = y + h * 0.05
    # Keep moat
    svg.el("rect", x=f"{kx - 4:.1f}", y=f"{ky - 4:.1f}",
           width=f"{kw + 8:.1f}", height=f"{kh + 8:.1f}",
           fill="#607868", rx="2", opacity="0.15")
    svg.el("rect", x=f"{kx - 2:.1f}", y=f"{ky - 2:.1f}",
           width=f"{kw + 4:.1f}", height=f"{kh + 4:.1f}",
           fill="#b0a898", rx="2", opacity="0.70")
    svg.el("rect", x=f"{kx:.1f}", y=f"{ky:.1f}",
           width=f"{kw:.1f}", height=f"{kh:.1f}",
           fill=P.wall_fill, stroke=P.wall_dark, stroke_width="4",
           rx="2", opacity="0.95")
    svg.el("rect", x=f"{kx:.1f}", y=f"{ky:.1f}",
           width=f"{kw:.1f}", height=f"{kh:.1f}",
           fill="none", stroke=P.wall_dark, stroke_width="1.5",
           stroke_dasharray="5,4", rx="2", opacity="0.25")
    svg.el("rect", x=f"{kx + 6:.1f}", y=f"{ky + 6:.1f}",
           width=f"{kw - 12:.1f}", height=f"{kh - 12:.1f}",
           fill="#9a9488", opacity="0.45", rx="1")

    # Throne room
    tr_x, tr_y = kx + kw * 0.12, ky + kh * 0.10
    tr_w, tr_h = kw * 0.76, kh * 0.55
    svg.el("rect", x=f"{tr_x:.1f}", y=f"{tr_y:.1f}",
           width=f"{tr_w:.1f}", height=f"{tr_h:.1f}",
           fill="#8a8278", stroke=P.wall_dark, stroke_width="1.5",
           rx="1", opacity="0.60")
    # Throne seat
    svg.el("rect", x=f"{tr_x + tr_w * 0.50 - 4:.1f}", y=f"{tr_y + tr_h * 0.25 - 3:.1f}",
           width="8", height="6", fill="#c8a838", stroke=P.wall_dark,
           stroke_width="1", rx="1", opacity="0.65")
    # Pillars
    for px_f in (0.20, 0.80):
        for py_f in (0.25, 0.75):
            svg.el("circle", cx=f"{tr_x + tr_w * px_f:.1f}", cy=f"{tr_y + tr_h * py_f:.1f}",
                   r="2.5", fill=P.wall_stone, stroke=P.wall_dark,
                   stroke_width="0.8", opacity="0.50")

    # Private chambers
    pc_y = ky + kh * 0.70
    pc_h = kh * 0.22
    svg.el("rect", x=f"{kx + kw * 0.10:.1f}", y=f"{pc_y:.1f}",
           width=f"{kw * 0.35:.1f}", height=f"{pc_h:.1f}",
           fill="#807468", stroke=P.wall_dark, stroke_width="1", rx="1", opacity="0.50")
    svg.el("rect", x=f"{kx + kw * 0.52:.1f}", y=f"{pc_y:.1f}",
           width=f"{kw * 0.38:.1f}", height=f"{pc_h:.1f}",
           fill="#807468", stroke=P.wall_dark, stroke_width="1", rx="1", opacity="0.50")

    # Keep corner towers
    keep_tr = min(kw, kh) * 0.13
    for (ktx, kty) in [(kx, ky), (kx + kw, ky), (kx, ky + kh), (kx + kw, ky + kh)]:
        _tower(ktx, kty, keep_tr, big=True)

    # Donjon (central great tower)
    donjon_r = min(kw, kh) * 0.16
    donjon_x, donjon_y = kx + kw * 0.50, ky + kh * 0.40
    svg.el("circle", cx=f"{donjon_x:.1f}", cy=f"{donjon_y:.1f}",
           r=f"{donjon_r + 4:.1f}", fill=P.shadow, opacity="0.12")
    svg.el("circle", cx=f"{donjon_x:.1f}", cy=f"{donjon_y:.1f}",
           r=f"{donjon_r:.1f}", fill=P.wall_fill, stroke=P.wall_dark,
           stroke_width="3", opacity="0.95")
    svg.el("circle", cx=f"{donjon_x:.1f}", cy=f"{donjon_y:.1f}",
           r=f"{donjon_r * 0.65:.1f}", fill=P.tower_top, stroke=P.wall_dark,
           stroke_width="1.5", opacity="0.60")
    svg.el("circle", cx=f"{donjon_x:.1f}", cy=f"{donjon_y:.1f}",
           r=f"{donjon_r * 0.30:.1f}", fill="#c8a838", stroke=P.wall_dark,
           stroke_width="0.8", opacity="0.55")
    svg.el("circle", cx=f"{donjon_x:.1f}", cy=f"{donjon_y:.1f}",
           r=f"{donjon_r * 0.88:.1f}", fill="none", stroke=P.wall_dark,
           stroke_width="1.2", stroke_dasharray="3,3", opacity="0.25")

    # ══════════════════════════════════════════════════════════════
    # 3. COURTYARD FEATURES
    # ══════════════════════════════════════════════════════════════
    # Parade ground
    court_x = x + w * 0.40
    court_y = y + h * 0.08
    court_w = w * 0.50
    court_h = h * 0.38
    svg.el("rect", x=f"{court_x:.1f}", y=f"{court_y:.1f}",
           width=f"{court_w:.1f}", height=f"{court_h:.1f}",
           fill="#d4ccb4", stroke="#a09880", stroke_width="0.8",
           rx="2", opacity="0.35")

    # Garden
    gx = x + w * 0.56
    gy = y + h * 0.52
    gw, gh = w * 0.28, h * 0.17
    svg.el("rect", x=f"{gx:.1f}", y=f"{gy:.1f}",
           width=f"{gw:.1f}", height=f"{gh:.1f}",
           fill=P.garden, stroke=P.garden_dark, stroke_width="1",
           rx="3", opacity="0.38")
    svg.el("rect", x=f"{gx + 2:.1f}", y=f"{gy + 2:.1f}",
           width=f"{gw - 4:.1f}", height=f"{gh - 4:.1f}",
           fill="none", stroke="#4a6a3a", stroke_width="1.5", rx="2", opacity="0.30")
    svg.el("line", x1=f"{gx + gw/2:.1f}", y1=f"{gy:.1f}",
           x2=f"{gx + gw/2:.1f}", y2=f"{gy + gh:.1f}",
           stroke="#c8c0a0", stroke_width="2", opacity="0.45")
    svg.el("line", x1=f"{gx:.1f}", y1=f"{gy + gh/2:.1f}",
           x2=f"{gx + gw:.1f}", y2=f"{gy + gh/2:.1f}",
           stroke="#c8c0a0", stroke_width="2", opacity="0.45")
    # Fountain
    svg.el("circle", cx=f"{gx + gw/2:.1f}", cy=f"{gy + gh/2:.1f}", r="5",
           fill="#8ab0c0", stroke="#506878", stroke_width="1", opacity="0.50")
    svg.el("circle", cx=f"{gx + gw/2:.1f}", cy=f"{gy + gh/2:.1f}", r="2",
           fill="#a0d0e0", opacity="0.55")

    # Well
    well_x, well_y = x + w * 0.42, y + h * 0.56
    svg.el("circle", cx=f"{well_x:.1f}", cy=f"{well_y:.1f}", r="6",
           fill="#708898", stroke=P.wall_dark, stroke_width="1.5", opacity="0.55")
    svg.el("circle", cx=f"{well_x:.1f}", cy=f"{well_y:.1f}", r="3",
           fill=P.water_dark, opacity="0.55")

    # Specialty buildings
    bldgs = [
        (0.04, 0.44, 0.17, 0.11, "#9a8a70"),
        (0.04, 0.58, 0.17, 0.11, "#8a7a60"),
        (0.04, 0.73, 0.13, 0.09, "#8a7a60"),
        (0.68, 0.75, 0.15, 0.11, "#988878"),
        (0.42, 0.75, 0.15, 0.09, "#8a7860"),
        (0.25, 0.04, 0.11, 0.09, "#908068"),
        (0.87, 0.48, 0.08, 0.13, "#907868"),
    ]
    for (xf, yf, wf, hf, fill) in bldgs:
        bx2 = x + w * xf
        by2 = y + h * yf
        bw2, bh2 = w * wf, h * hf
        # Only render if inside the perimeter
        if point_in_polygon(bx2 + bw2 / 2, by2 + bh2 / 2, perimeter):
            _small_bldg(bx2, by2, bw2, bh2, fill)

    # Pathways
    path_color = "#b8b098"
    svg.el("line", x1=f"{bcx:.1f}", y1=f"{y + h - wall_t:.1f}",
           x2=f"{bcx:.1f}", y2=f"{ky + kh + 6:.1f}",
           stroke=path_color, stroke_width="10", stroke_linecap="butt", opacity="0.28")
    svg.el("line", x1=f"{x + wall_t:.1f}", y1=f"{bcy:.1f}",
           x2=f"{x + w - wall_t:.1f}", y2=f"{bcy:.1f}",
           stroke=path_color, stroke_width="8", stroke_linecap="butt", opacity="0.22")

    # Banners
    banner_positions = [
        (x + w * 0.38, y + h * 0.08),
        (x + w * 0.62, y + h * 0.08),
        (kx + kw * 0.5, ky - 2),
    ]
    for (fx, fy) in banner_positions:
        svg.el("line", x1=f"{fx:.1f}", y1=f"{fy:.1f}",
               x2=f"{fx:.1f}", y2=f"{fy - 12:.1f}",
               stroke="#5a4a38", stroke_width="1.5", opacity="0.50")
        bc = rng.choice(["#c83030", "#2050a0", "#c8a020", "#308030"])
        svg.el("polygon",
               points=f"{fx:.1f},{fy - 12:.1f} {fx + 8:.1f},{fy - 9:.1f} {fx:.1f},{fy - 6:.1f}",
               fill=bc, stroke=P.wall_dark, stroke_width="0.5", opacity="0.60")

    # ══════════════════════════════════════════════════════════════
    # 4. CURTAIN WALLS — follow perimeter with gaps at gate positions
    # ══════════════════════════════════════════════════════════════
    gate_gap = gate_w * 0.65  # half-width gap on each side of gate point

    for i in range(n_perim):
        p0 = perimeter[i]
        p1 = perimeter[(i + 1) % n_perim]
        edge_dx = p1[0] - p0[0]
        edge_dy = p1[1] - p0[1]
        edge_len = math.hypot(edge_dx, edge_dy)
        if edge_len < 1e-6:
            continue

        # Find gates that intersect this edge
        gate_hits = []
        for (gx2, gy2, ga) in castle_gates:
            t = ((gx2 - p0[0]) * edge_dx + (gy2 - p0[1]) * edge_dy) / (edge_len * edge_len)
            if -0.05 <= t <= 1.05:
                proj = (p0[0] + t * edge_dx, p0[1] + t * edge_dy)
                if dist((gx2, gy2), proj) < gate_gap * 2:
                    gate_hits.append((t, gx2, gy2, ga))
        gate_hits.sort(key=lambda x: x[0])

        if not gate_hits:
            _wall_seg(p0, p1)
            # Crenellation
            svg.el("line", x1=f"{p0[0]:.1f}", y1=f"{p0[1]:.1f}",
                   x2=f"{p1[0]:.1f}", y2=f"{p1[1]:.1f}",
                   stroke=P.wall_dark, stroke_width="1.5",
                   stroke_dasharray="4,4", opacity="0.25")
        else:
            # Draw wall segments between gate gaps
            cursor = 0.0
            for (gt, gx2, gy2, ga) in gate_hits:
                frac_before = max(0, gt - gate_gap / edge_len)
                if frac_before > cursor + 0.01:
                    seg_start = lerp_pt(p0, p1, cursor)
                    seg_end = lerp_pt(p0, p1, frac_before)
                    _wall_seg(seg_start, seg_end)
                    svg.el("line", x1=f"{seg_start[0]:.1f}", y1=f"{seg_start[1]:.1f}",
                           x2=f"{seg_end[0]:.1f}", y2=f"{seg_end[1]:.1f}",
                           stroke=P.wall_dark, stroke_width="1.5",
                           stroke_dasharray="4,4", opacity="0.25")
                cursor = min(1, gt + gate_gap / edge_len)
            # Final segment after last gate
            if cursor < 0.99:
                seg_start = lerp_pt(p0, p1, cursor)
                _wall_seg(seg_start, p1)
                svg.el("line", x1=f"{seg_start[0]:.1f}", y1=f"{seg_start[1]:.1f}",
                       x2=f"{p1[0]:.1f}", y2=f"{p1[1]:.1f}",
                       stroke=P.wall_dark, stroke_width="1.5",
                       stroke_dasharray="4,4", opacity="0.25")

    # ══════════════════════════════════════════════════════════════
    # 5. CORNER TOWERS — at each perimeter vertex
    # ══════════════════════════════════════════════════════════════
    for i, pt in enumerate(perimeter):
        too_close = any(dist(pt, (g[0], g[1])) < gate_gap * 1.5 for g in castle_gates)
        if not too_close:
            _tower(pt[0], pt[1], tower_r * 1.10, big=True)

    # ══════════════════════════════════════════════════════════════
    # 6. MID-WALL TOWERS — one per long edge, avoiding gates
    # ══════════════════════════════════════════════════════════════
    mid_r = tower_r * 0.72
    for i in range(n_perim):
        p0 = perimeter[i]
        p1 = perimeter[(i + 1) % n_perim]
        edge_len = dist(p0, p1)
        if edge_len < 60:
            continue
        mid_pt = lerp_pt(p0, p1, 0.5)
        too_close = any(dist(mid_pt, (g[0], g[1])) < gate_gap * 1.8 for g in castle_gates)
        if not too_close:
            _tower(mid_pt[0], mid_pt[1], mid_r, big=False)

    # ══════════════════════════════════════════════════════════════
    # 7. GATEHOUSES — flanking towers + passage at exact road positions
    # ══════════════════════════════════════════════════════════════
    gate_tr = tower_r * 0.68
    for (gx2, gy2, ga) in castle_gates:
        # Wall direction at this gate
        edx, edy = cos(ga), sin(ga)
        # Normal (points outward)
        enx, eny = -edy, edx
        # Flanking towers along wall direction
        for sign in (-1, 1):
            tx = gx2 + edx * sign * (gate_gap + 2)
            ty = gy2 + edy * sign * (gate_gap + 2)
            _tower(tx, ty, gate_tr, big=False)

        # Gate passage
        passage_len = gate_w * 0.8
        passage_w = gate_w * 0.6
        px0 = gx2 - edx * passage_len / 2
        py0 = gy2 - edy * passage_len / 2
        px1 = gx2 + edx * passage_len / 2
        py1 = gy2 + edy * passage_len / 2
        # Drawbridge plank (outward)
        svg.el("line", x1=f"{gx2 + enx * 6:.0f}", y1=f"{gy2 + eny * 6:.0f}",
               x2=f"{gx2 - enx * 6:.0f}", y2=f"{gy2 - eny * 6:.0f}",
               stroke="#8a7a58", stroke_width=f"{passage_len + 4:.0f}",
               stroke_linecap="butt", opacity="0.35")
        # Stone archway
        svg.el("line", x1=f"{px0:.0f}", y1=f"{py0:.0f}",
               x2=f"{px1:.0f}", y2=f"{py1:.0f}",
               stroke=P.wall_fill, stroke_width=f"{passage_w + 6:.0f}",
               stroke_linecap="butt", opacity="0.70")
        # Road surface
        svg.el("line", x1=f"{px0:.0f}", y1=f"{py0:.0f}",
               x2=f"{px1:.0f}", y2=f"{py1:.0f}",
               stroke=P.road_main, stroke_width=f"{passage_w:.0f}",
               stroke_linecap="butt", opacity="0.80")
        # Portcullis bars
        for bar_t in (0.25, 0.45, 0.55, 0.75):
            bx3 = lerp_pt((px0, py0), (px1, py1), bar_t)[0]
            by3 = lerp_pt((px0, py0), (px1, py1), bar_t)[1]
            svg.el("line",
                   x1=f"{bx3 - enx * (passage_w/2 - 2):.0f}",
                   y1=f"{by3 - eny * (passage_w/2 - 2):.0f}",
                   x2=f"{bx3 + enx * (passage_w/2 - 2):.0f}",
                   y2=f"{by3 + eny * (passage_w/2 - 2):.0f}",
                   stroke=P.wall_dark, stroke_width="0.8", opacity="0.28")


def _render_special_building(svg: SvgCanvas, b: Building, rng: random.Random):
    x, y, w, h = b.x, b.y, b.w, b.h
    P = Pal

    # Base with thick border
    svg.el("rect", x=f"{x:.1f}", y=f"{y:.1f}", width=f"{w:.1f}", height=f"{h:.1f}",
           fill="#c0b8a8", stroke="#4a3a28", stroke_width="2.5", rx="2", opacity="0.94")
    svg.el("rect", x=f"{x+3:.1f}", y=f"{y+3:.1f}",
           width=f"{w-6:.1f}", height=f"{h-6:.1f}",
           fill="none", stroke="#5a4a38", stroke_width="0.8", rx="1.5", opacity="0.35")
    svg.el("rect", x=f"{x+2:.1f}", y=f"{y+2:.1f}",
           width=f"{w-4:.1f}", height=f"{h-4:.1f}",
           fill="#707878", opacity="0.55", rx="1")

    icon = b.icon

    if icon == "castle":
        _render_castle(svg, b, rng, P)

    elif icon in ("cathedral", "temple", "chapel"):
        svg.el("circle", cx=f"{b.cx:.1f}", cy=f"{b.cy:.1f}", r="7",
               fill="#b0a890", stroke="#4a3a28", stroke_width="1.5", opacity="0.65")
        svg.el("line", x1=f"{b.cx:.1f}", y1=f"{b.cy-12:.1f}",
               x2=f"{b.cx:.1f}", y2=f"{b.cy+12:.1f}",
               stroke="#5a4020", stroke_width="2.5")
        svg.el("line", x1=f"{b.cx-8:.1f}", y1=f"{b.cy-3:.1f}",
               x2=f"{b.cx+8:.1f}", y2=f"{b.cy-3:.1f}",
               stroke="#5a4020", stroke_width="2.5")
        # Rose window
        svg.el("circle", cx=f"{b.cx:.1f}", cy=f"{b.cy - h*0.25:.1f}", r="4",
               fill="#a0b0c8", stroke="#5a4a38", stroke_width="1", opacity="0.40")

    elif icon == "mage_tower":
        r = min(w, h) * 0.42
        svg.el("circle", cx=f"{b.cx:.1f}", cy=f"{b.cy:.1f}", r=f"{r:.1f}",
               fill="#8a80a0", stroke="#5040a0", stroke_width="2.5", opacity="0.58")
        svg.el("circle", cx=f"{b.cx:.1f}", cy=f"{b.cy:.1f}", r=f"{r*0.58:.1f}",
               fill="none", stroke="#7a60c0", stroke_width="1.5",
               stroke_dasharray="4,3", opacity="0.38")
        svg.el("circle", cx=f"{b.cx:.1f}", cy=f"{b.cy:.1f}", r=f"{r*0.25:.1f}",
               fill="#b0a8d0", opacity="0.35")
        # Arcane symbols
        for i in range(4):
            a = TAU * i / 4
            sx = b.cx + r * 0.75 * cos(a)
            sy = b.cy + r * 0.75 * sin(a)
            svg.el("circle", cx=f"{sx:.1f}", cy=f"{sy:.1f}", r="2",
                   fill="#9080c0", opacity="0.30")

    elif icon == "barracks":
        # Training yard
        svg.el("rect", x=f"{x + w*0.6:.1f}", y=f"{y + h*0.1:.1f}",
               width=f"{w*0.3:.1f}", height=f"{h*0.8:.1f}",
               fill=P.road, opacity="0.30", rx="1")
        # Weapon rack marks
        for i in range(3):
            yy = y + h * 0.3 + i * h * 0.2
            svg.el("line", x1=f"{x + w*0.65:.1f}", y1=f"{yy:.1f}",
                   x2=f"{x + w*0.85:.1f}", y2=f"{yy:.1f}",
                   stroke=P.wood, stroke_width="1.5", opacity="0.25")

    elif icon == "market_hall":
        # Stall outlines inside
        for i in range(3):
            for j in range(2):
                sx = x + 8 + i * (w - 16) / 3
                sy = y + 8 + j * (h - 16) / 2
                svg.el("rect", x=f"{sx:.1f}", y=f"{sy:.1f}",
                       width=f"{(w-24)/3:.1f}", height=f"{(h-20)/2:.1f}",
                       fill=P.road, stroke=P.road_edge, stroke_width="0.5",
                       rx="1", opacity="0.25")

    elif icon == "guildhall":
        # Banner/shield
        svg.el("rect", x=f"{b.cx - 5:.1f}", y=f"{y + 6:.1f}",
               width="10", height="12", fill="#8a2020", stroke="#4a1010",
               stroke_width="1", rx="1", opacity="0.40")
        # Columns
        for i in range(3):
            cx_col = x + (i + 1) * w / 4
            svg.el("rect", x=f"{cx_col - 1:.1f}", y=f"{y + h*0.3:.1f}",
                   width="2", height=f"{h*0.5:.1f}",
                   fill=P.wall_light, opacity="0.30")


def _render_tree_cluster(svg: SvgCanvas, tc: TreeCluster, rng: random.Random, P):
    tree_rng = random.Random(int(tc.x * 1000 + tc.y))

    if tc.tree_type == "conifer":
        for _ in range(tc.trees):
            ox = tree_rng.uniform(-tc.r * 0.3, tc.r * 0.3)
            oy = tree_rng.uniform(-tc.r * 0.3, tc.r * 0.3)
            r = tc.r * tree_rng.uniform(0.5, 0.9)
            tx, ty = tc.x + ox, tc.y + oy
            # Triangle (conifer)
            pts = f"{tx:.1f},{ty - r:.1f} {tx - r*0.6:.1f},{ty + r*0.5:.1f} {tx + r*0.6:.1f},{ty + r*0.5:.1f}"
            svg.raw(f'<polygon points="{pts}" fill="#4a6a38" opacity="0.50"/>')
            svg.raw(f'<polygon points="{tx:.1f},{ty - r*0.6:.1f} {tx - r*0.4:.1f},{ty + r*0.3:.1f} {tx + r*0.4:.1f},{ty + r*0.3:.1f}" fill="#5a7a48" opacity="0.40"/>')
            # Trunk
            svg.el("circle", cx=f"{tx:.1f}", cy=f"{ty + r*0.2:.1f}",
                   r=f"{r*0.10:.1f}", fill="#5a4a2a", opacity="0.35")
    else:
        for _ in range(tc.trees):
            ox = tree_rng.uniform(-tc.r * 0.4, tc.r * 0.4)
            oy = tree_rng.uniform(-tc.r * 0.4, tc.r * 0.4)
            r = tc.r * tree_rng.uniform(0.55, 1.0)
            svg.el("circle", cx=f"{tc.x + ox:.1f}", cy=f"{tc.y + oy:.1f}", r=f"{r:.1f}",
                   fill=P.green_dark, opacity="0.48")
            svg.el("circle", cx=f"{tc.x + ox + r*0.15:.1f}",
                   cy=f"{tc.y + oy - r*0.15:.1f}",
                   r=f"{r*0.6:.1f}", fill=P.green_light, opacity="0.38")
            svg.el("circle", cx=f"{tc.x + ox:.1f}", cy=f"{tc.y + oy:.1f}",
                   r=f"{r*0.12:.1f}", fill="#5a4a2a", opacity="0.40")


def _render_market_shop(svg: SvgCanvas, b: Building, rng: random.Random, tier: str):
    """Render a market shop — natural muted tones, looks like a real building alongside a road."""
    x, y, w, h = b.x, b.y, b.w, b.h
    P = Pal
    roof_c = b.roof_color or "#7a6048"
    wall_c = b.wall_color or "#c8b898"
    rot = b.rotation
    transform = f"rotate({rot:.1f} {b.cx:.1f} {b.cy:.1f})" if abs(rot) > 0.5 else None
    name = b.name

    # ── Building body — natural stone/plaster ──
    # Shadow
    svg.el("rect", x=f"{x + 1.2:.1f}", y=f"{y + 1.2:.1f}", width=f"{w:.1f}", height=f"{h:.1f}",
           fill=P.shadow, rx="0.8", opacity="0.12", transform=transform)
    # Wall
    svg.el("rect", x=f"{x:.1f}", y=f"{y:.1f}", width=f"{w:.1f}", height=f"{h:.1f}",
           fill=wall_c, stroke="#6a5a40", stroke_width="0.8", rx="0.8",
           opacity="0.92", transform=transform)

    # ── Roof ──
    inset = min(1.8, w * 0.06, h * 0.06)
    svg.el("rect", x=f"{x + inset:.1f}", y=f"{y + inset:.1f}",
           width=f"{w - 2 * inset:.1f}", height=f"{h - 2 * inset:.1f}",
           fill=roof_c, opacity="0.82", rx="0.4", transform=transform)
    # Ridge line
    if w >= h:
        ry = y + h / 2
        svg.el("line", x1=f"{x + 2:.1f}", y1=f"{ry:.1f}",
               x2=f"{x + w - 2:.1f}", y2=f"{ry:.1f}",
               stroke="rgba(0,0,0,0.18)", stroke_width="1.2",
               stroke_linecap="round", transform=transform)
    else:
        rx_line = x + w / 2
        svg.el("line", x1=f"{rx_line:.1f}", y1=f"{y + 2:.1f}",
               x2=f"{rx_line:.1f}", y2=f"{y + h - 2:.1f}",
               stroke="rgba(0,0,0,0.18)", stroke_width="1.2",
               stroke_linecap="round", transform=transform)

    # ── Subtle shop awning (muted, wood-toned) ──
    awning_h = max(3, h * 0.14)
    svg.el("line", x1=f"{x:.1f}", y1=f"{y + h - 0.5:.1f}",
           x2=f"{x + w:.1f}", y2=f"{y + h - 0.5:.1f}",
           stroke=roof_c, stroke_width=f"{awning_h * 0.6:.1f}", opacity="0.35",
           transform=transform)

    # ── Windows (small, proportional) ──
    if w > 10 and h > 8:
        num_win = max(1, int(w / 9))
        for wi in range(num_win):
            wx = x + 3 + (w - 6) * (wi + 0.5) / num_win
            svg.el("rect", x=f"{wx - 1.2:.1f}", y=f"{y + 2:.1f}",
                   width="2.4", height="2.4", fill=P.window, stroke=P.window_frame,
                   stroke_width="0.3", opacity="0.35", transform=transform)

    # ── Door ──
    if w > 7:
        door_w2 = max(2.5, w * 0.12)
        door_h2 = max(3.5, h * 0.18)
        ddx = x + w * rng.uniform(0.38, 0.62) - door_w2 / 2
        ddy = y + h - door_h2
        svg.el("rect", x=f"{ddx:.1f}", y=f"{ddy:.1f}",
               width=f"{door_w2:.1f}", height=f"{door_h2:.1f}",
               fill="#5a3a20", stroke="#3a2a18", stroke_width="0.5",
               rx="0.4", opacity="0.50", transform=transform)

    # ── Trade-specific exterior details ──
    _render_shop_trade_detail(svg, b, rng, transform)


def _render_shop_trade_detail(svg: SvgCanvas, b: Building, rng: random.Random, transform):
    """Add trade-specific visual details to a market shop exterior."""
    x, y, w, h = b.x, b.y, b.w, b.h
    P = Pal
    name = b.name

    if name == "Baker":
        # Bread display near base
        for i in range(rng.randint(2, 3)):
            bx = x + 3 + i * (w - 6) / 3
            svg.el("ellipse", cx=f"{bx:.1f}", cy=f"{y + h + 1:.1f}",
                   rx="2", ry="1.2", fill="#c8a060", opacity="0.35", transform=transform)

    elif name == "Butcher":
        # Hanging meats from awning
        for i in range(rng.randint(2, 4)):
            mx2 = x + 3 + i * (w - 6) / 4
            svg.el("line", x1=f"{mx2:.1f}", y1=f"{y + h - 6:.1f}",
                   x2=f"{mx2:.1f}", y2=f"{y + h - 2:.1f}",
                   stroke="#5a3a28", stroke_width="0.6", opacity="0.45", transform=transform)
            svg.el("ellipse", cx=f"{mx2:.1f}", cy=f"{y + h - 1.5:.1f}",
                   rx="1.8", ry="2.5", fill="#983828", opacity="0.50", transform=transform)

    elif name == "Greengrocer":
        # Produce crates outside
        for i in range(rng.randint(2, 3)):
            cx2 = x + 2 + i * (w / 3)
            cy2 = y + h + 1
            svg.el("rect", x=f"{cx2:.1f}", y=f"{cy2:.1f}",
                   width="6", height="4", fill="#8a7050",
                   stroke="#5a4030", stroke_width="0.5", rx="0.5", opacity="0.45", transform=transform)
            # Produce dots
            for _ in range(3):
                svg.el("circle", cx=f"{cx2 + rng.uniform(1, 5):.1f}",
                       cy=f"{cy2 + rng.uniform(0.5, 2.5):.1f}", r="1.2",
                       fill=rng.choice(["#808a50", "#a06848", "#b0a050", "#a88050"]),
                       opacity="0.38", transform=transform)

    elif name == "Fishmonger":
        # Fish drying rack / hanging fish
        svg.el("line", x1=f"{x + 2:.1f}", y1=f"{y - 2:.1f}",
               x2=f"{x + w - 2:.1f}", y2=f"{y - 2:.1f}",
               stroke="#5a4a38", stroke_width="1", opacity="0.35", transform=transform)
        for i in range(rng.randint(3, 5)):
            fx = x + 4 + i * (w - 8) / 5
            svg.el("ellipse", cx=f"{fx:.1f}", cy=f"{y - 1:.1f}",
                   rx="1.2", ry="2.5", fill="#8090a0", opacity="0.40", transform=transform)

    elif name == "Candlemaker":
        # Yellow candle shapes in window area
        for i in range(rng.randint(3, 5)):
            cx2 = x + w * 0.25 + i * (w * 0.5) / 5
            svg.el("rect", x=f"{cx2 - 0.5:.1f}", y=f"{y + h * 0.30:.1f}",
                   width="1", height="4", fill="#e8d888", opacity="0.50", transform=transform)
            svg.el("circle", cx=f"{cx2:.1f}", cy=f"{y + h * 0.28:.1f}",
                   r="1", fill="#f0a020", opacity="0.40", transform=transform)

    elif name == "Weaver":
        # Fabric/cloth bolts displayed outside
        colors = ["#705880", "#8060a0", "#a080c0", "#c088a0"]
        for i in range(rng.randint(2, 3)):
            cx2 = x + 3 + i * (w - 6) / 3
            col = rng.choice(colors)
            svg.el("rect", x=f"{cx2:.1f}", y=f"{y + h:.1f}",
                   width="4", height="3", fill=col, rx="0.5",
                   opacity="0.45", transform=transform)

    elif name == "Spice Merchant":
        # Colorful spice sacks at entrance
        spice_colors = ["#d8b030", "#c05020", "#80a028", "#a06020", "#d08850"]
        for i in range(rng.randint(3, 5)):
            sx = x + 2 + i * (w - 4) / 5
            col = rng.choice(spice_colors)
            svg.el("circle", cx=f"{sx:.1f}", cy=f"{y + h + 1:.1f}",
                   r="2", fill=col, stroke="#5a4030",
                   stroke_width="0.4", opacity="0.50", transform=transform)

    elif name == "Cheese Monger":
        # Cheese wheels in window
        for i in range(rng.randint(2, 3)):
            cx2 = x + w * 0.3 + i * w * 0.2
            svg.el("circle", cx=f"{cx2:.1f}", cy=f"{y + h * 0.40:.1f}",
                   r="2.5", fill="#e0c868", stroke="#a89040",
                   stroke_width="0.4", opacity="0.45", transform=transform)

    elif name == "Potter":
        # Pottery displayed outside
        for i in range(rng.randint(2, 4)):
            px = x + 2 + i * (w - 4) / 4
            # Pot shape (circle + small rect neck)
            svg.el("circle", cx=f"{px:.1f}", cy=f"{y + h + 1.5:.1f}",
                   r="2", fill="#c0a080", stroke="#8a6040",
                   stroke_width="0.4", opacity="0.45", transform=transform)
            svg.el("rect", x=f"{px - 1:.1f}", y=f"{y + h - 0.5:.1f}",
                   width="2", height="2", fill="#c0a080",
                   opacity="0.40", transform=transform)

    elif name == "Wine Merchant":
        # Wine barrels
        for i in range(rng.randint(1, 3)):
            bx2 = x + 1 + i * (w - 2) / 3
            svg.el("ellipse", cx=f"{bx2 + 2:.1f}", cy=f"{y + h + 1:.1f}",
                   rx="3", ry="2", fill="#6a3020",
                   stroke="#4a2018", stroke_width="0.5", opacity="0.50", transform=transform)
            # Band
            svg.el("ellipse", cx=f"{bx2 + 2:.1f}", cy=f"{y + h + 1:.1f}",
                   rx="3", ry="2", fill="none",
                   stroke="#886040", stroke_width="0.4", opacity="0.40", transform=transform)

    elif name == "Jeweler":
        # Sparkle dots in display window
        for _ in range(rng.randint(4, 7)):
            jx = x + rng.uniform(w * 0.2, w * 0.8)
            jy = y + rng.uniform(h * 0.25, h * 0.50)
            svg.el("circle", cx=f"{jx:.1f}", cy=f"{jy:.1f}",
                   r="0.8", fill="#f0e8b0", opacity="0.55", transform=transform)
        # Display case outline
        svg.el("rect", x=f"{x + w * 0.15:.1f}", y=f"{y + h * 0.25:.1f}",
               width=f"{w * 0.7:.1f}", height=f"{h * 0.22:.1f}",
               fill="none", stroke="#8088a0", stroke_width="0.5",
               rx="0.5", opacity="0.35", transform=transform)

    elif name == "Herbalist":
        # Hanging herbs from eaves
        for i in range(rng.randint(3, 5)):
            hx = x + 2 + i * (w - 4) / 5
            svg.el("line", x1=f"{hx:.1f}", y1=f"{y:.1f}",
                   x2=f"{hx:.1f}", y2=f"{y - 3:.1f}",
                   stroke="#4a6830", stroke_width="0.8", opacity="0.40", transform=transform)
            svg.el("circle", cx=f"{hx:.1f}", cy=f"{y - 3.5:.1f}",
                   r="1.8", fill="#6a9838", opacity="0.40", transform=transform)

    elif name == "Tailor":
        # Dress form / mannequin silhouette in window
        mx2 = x + w / 2
        my2 = y + h * 0.35
        svg.el("line", x1=f"{mx2:.1f}", y1=f"{my2 - 3:.1f}",
               x2=f"{mx2:.1f}", y2=f"{my2 + 3:.1f}",
               stroke="#685078", stroke_width="0.8", opacity="0.35", transform=transform)
        svg.el("ellipse", cx=f"{mx2:.1f}", cy=f"{my2:.1f}",
               rx="2.5", ry="3", fill="#b8a8c0", stroke="#685078",
               stroke_width="0.4", opacity="0.35", transform=transform)

    elif name == "Cobbler":
        # Boot shapes outside
        for i in range(rng.randint(2, 3)):
            bx2 = x + 2 + i * (w - 4) / 3
            svg.el("rect", x=f"{bx2:.1f}", y=f"{y + h:.1f}",
                   width="3", height="2.5", fill="#6a5038",
                   rx="0.5", opacity="0.40", transform=transform)
            svg.el("rect", x=f"{bx2 + 1.5:.1f}", y=f"{y + h + 2:.1f}",
                   width="2.5", height="1", fill="#6a5038",
                   rx="0.5", opacity="0.40", transform=transform)

    elif name == "Tanner":
        # Hanging hides/leather
        svg.el("line", x1=f"{x + 2:.1f}", y1=f"{y - 1:.1f}",
               x2=f"{x + w - 2:.1f}", y2=f"{y - 1:.1f}",
               stroke="#5a4028", stroke_width="1", opacity="0.35", transform=transform)
        for i in range(rng.randint(2, 4)):
            lx = x + 3 + i * (w - 6) / 4
            svg.el("rect", x=f"{lx:.1f}", y=f"{y - 1:.1f}",
                   width="3", height="5", fill="#a88058",
                   rx="0.5", opacity="0.35", transform=transform)

    elif name == "Florist":
        # Flower boxes / pots outside
        colors = ["#e05060", "#e8c040", "#d070a0", "#8060c0", "#f09030"]
        for i in range(rng.randint(3, 5)):
            fx = x + 1 + i * (w - 2) / 5
            # Pot
            svg.el("rect", x=f"{fx:.1f}", y=f"{y + h:.1f}",
                   width="3", height="2.5", fill="#8a6040",
                   rx="0.3", opacity="0.45", transform=transform)
            # Flowers (cluster of colored dots)
            for _ in range(3):
                svg.el("circle",
                       cx=f"{fx + rng.uniform(0.5, 2.5):.1f}",
                       cy=f"{y + h - rng.uniform(0.5, 2):.1f}",
                       r="1.2", fill=rng.choice(colors),
                       opacity="0.50", transform=transform)

    # ── Chimney for certain trades ──
    if name in ("Baker", "Butcher", "Candlemaker", "Tanner") and w > 10:
        chx = x + w * rng.uniform(0.7, 0.9)
        chy = y + 1
        svg.el("rect", x=f"{chx - 1.5:.1f}", y=f"{chy - 3:.1f}",
               width="3", height="4", fill="#5a4a38", rx="0.4", opacity="0.50",
               transform=transform)


def _render_market_square(svg: SvgCanvas, ms: MarketSquare, rng: random.Random, P, tier: str):
    """Render a bustling market square with cobblestones, stalls, and central feature."""
    x, y, w, h = ms.x, ms.y, ms.w, ms.h
    mcx, mcy = x + w / 2, y + h / 2
    is_circle = ms.shape == "circle"
    rad = w / 2  # radius for circular shape

    # No visible square ground — the market is just an open area
    # defined by the roads and shops around it. Only render the
    # central feature and stalls.

    # ── Central feature ──
    if ms.has_fountain:
        # Large ornate fountain
        fr = min(w, h) * 0.12
        # Outer basin
        svg.el("circle", cx=f"{mcx:.0f}", cy=f"{mcy:.0f}", r=f"{fr + 4:.0f}",
               fill=P.wall_stone, stroke=P.wall_dark, stroke_width="2", opacity="0.40")
        svg.el("circle", cx=f"{mcx:.0f}", cy=f"{mcy:.0f}", r=f"{fr:.0f}",
               fill=P.water, stroke=P.water_dark, stroke_width="2", opacity="0.60")
        # Inner tier
        svg.el("circle", cx=f"{mcx:.0f}", cy=f"{mcy:.0f}", r=f"{fr * 0.55:.0f}",
               fill=P.water_light, stroke=P.water_dark, stroke_width="1", opacity="0.40")
        # Spout
        svg.el("circle", cx=f"{mcx:.0f}", cy=f"{mcy:.0f}", r=f"{fr * 0.2:.0f}",
               fill=P.wall_stone, stroke=P.wall_dark, stroke_width="1.5", opacity="0.55")
        # Water spray
        for _ in range(6):
            a = rng.uniform(0, TAU)
            dr = fr * rng.uniform(0.3, 0.8)
            svg.el("circle", cx=f"{mcx + dr * cos(a):.0f}", cy=f"{mcy + dr * sin(a):.0f}",
                   r="1.5", fill=P.water_light, opacity="0.30")
    elif ms.has_well:
        # Stone well
        wr = min(w, h) * 0.06
        svg.el("circle", cx=f"{mcx:.0f}", cy=f"{mcy:.0f}", r=f"{wr + 3:.0f}",
               fill=P.wall_stone, stroke=P.wall_dark, stroke_width="1.5", opacity="0.45")
        svg.el("circle", cx=f"{mcx:.0f}", cy=f"{mcy:.0f}", r=f"{wr:.0f}",
               fill=P.water_dark, stroke=P.wall_dark, stroke_width="1", opacity="0.55")
        # Well frame
        svg.el("line", x1=f"{mcx - wr - 2:.0f}", y1=f"{mcy - wr - 5:.0f}",
               x2=f"{mcx + wr + 2:.0f}", y2=f"{mcy - wr - 5:.0f}",
               stroke="#6a5a48", stroke_width="2", opacity="0.45")
    else:
        # Market cross / monument
        cr = min(w, h) * 0.04
        svg.el("circle", cx=f"{mcx:.0f}", cy=f"{mcy:.0f}", r=f"{cr + 6:.0f}",
               fill=P.wall_stone, stroke=P.wall_dark, stroke_width="1.5", opacity="0.35")
        svg.el("rect", x=f"{mcx - 2:.0f}", y=f"{mcy - cr * 2:.0f}",
               width="4", height=f"{cr * 4:.0f}",
               fill=P.wall_stone, stroke=P.wall_dark, stroke_width="1", rx="1", opacity="0.55")
        svg.el("rect", x=f"{mcx - cr * 1.2:.0f}", y=f"{mcy - 2:.0f}",
               width=f"{cr * 2.4:.0f}", height="4",
               fill=P.wall_stone, stroke=P.wall_dark, stroke_width="1", rx="1", opacity="0.55")

    # ── Market stalls (varied types) ──
    STALL_TYPES = [
        "produce", "fabric", "pottery", "bread", "meat", "flowers",
        "trinkets", "spices", "cheese", "tools", "fish", "leather",
    ]
    for idx, (sx, sy, rot, color) in enumerate(ms.stalls):
        stall_type = STALL_TYPES[idx % len(STALL_TYPES)]
        svg.raw(f'<g transform="rotate({rot:.1f},{sx:.1f},{sy:.1f})">')

        # Table legs (4 small posts)
        for lx, ly in [(sx - 4, sy - 2.5), (sx + 4, sy - 2.5),
                        (sx - 4, sy + 2.5), (sx + 4, sy + 2.5)]:
            svg.el("rect", x=f"{lx - 0.4:.1f}", y=f"{ly - 0.4:.1f}",
                   width="0.8", height="0.8", fill="#6a5030", opacity="0.40")
        # Stall table
        svg.el("rect", x=f"{sx - 6:.1f}", y=f"{sy - 3.5:.1f}",
               width="12", height="7",
               fill="#c8b890", stroke=P.wall_dark, stroke_width="1",
               rx="0.5", opacity="0.88")
        # Striped awning/canopy — larger and brighter
        svg.el("rect", x=f"{sx - 7:.1f}", y=f"{sy - 6:.1f}",
               width="14", height="4",
               fill=color, stroke=P.wall_dark, stroke_width="0.8",
               rx="1", opacity="0.88")
        # Awning stripes
        for si in range(5):
            stripe_x = sx - 7 + si * 3
            svg.el("rect", x=f"{stripe_x:.1f}", y=f"{sy - 6:.1f}",
                   width="1.5", height="4",
                   fill="white", opacity="0.18", rx="0.3")
        # Awning fringe
        svg.el("line", x1=f"{sx - 7:.1f}", y1=f"{sy - 2:.1f}",
               x2=f"{sx + 7:.1f}", y2=f"{sy - 2:.1f}",
               stroke=color, stroke_width="1", opacity="0.55",
               stroke_dasharray="1.5,1")
        # Support poles
        svg.el("line", x1=f"{sx - 6.5:.1f}", y1=f"{sy - 6:.1f}",
               x2=f"{sx - 6.5:.1f}", y2=f"{sy + 3.5:.1f}",
               stroke="#5a4028", stroke_width="1", opacity="0.55")
        svg.el("line", x1=f"{sx + 6.5:.1f}", y1=f"{sy - 6:.1f}",
               x2=f"{sx + 6.5:.1f}", y2=f"{sy + 3.5:.1f}",
               stroke="#5a4028", stroke_width="1", opacity="0.55")

        # ── Stall-type-specific goods (high visibility) ──
        if stall_type == "produce":
            for _ in range(rng.randint(5, 8)):
                gx = rng.uniform(sx - 4, sx + 4)
                gy = rng.uniform(sy - 2, sy + 2)
                svg.el("circle", cx=f"{gx:.1f}", cy=f"{gy:.1f}",
                       r=f"{rng.uniform(1.0, 1.8):.1f}",
                       fill=rng.choice(["#70aa30", "#d05020", "#e8c020", "#d08838", "#90c040"]),
                       opacity="0.75")
        elif stall_type == "fabric":
            for i in range(rng.randint(3, 6)):
                fx = sx - 4 + i * 1.8
                svg.el("rect", x=f"{fx:.1f}", y=f"{sy - 2:.1f}",
                       width="1.5", height="4",
                       fill=rng.choice(["#8050a0", "#c05060", "#4080b0", "#c09030", "#50a068"]),
                       rx="0.3", opacity="0.70")
        elif stall_type == "pottery":
            for i in range(rng.randint(3, 6)):
                px = sx - 4 + i * 1.8
                svg.el("circle", cx=f"{px:.1f}", cy=f"{sy:.1f}",
                       r=f"{rng.uniform(1.0, 1.6):.1f}",
                       fill=rng.choice(["#c0a080", "#b08860", "#a07848"]),
                       stroke="#7a5838", stroke_width="0.4", opacity="0.70")
        elif stall_type == "bread":
            for i in range(rng.randint(4, 6)):
                bx = sx - 4 + i * 1.8
                svg.el("ellipse", cx=f"{bx:.1f}", cy=f"{sy:.1f}",
                       rx="1.4", ry="0.9",
                       fill=rng.choice(["#d4a050", "#c89038", "#dab868"]),
                       opacity="0.75")
        elif stall_type == "meat":
            for i in range(rng.randint(3, 5)):
                mx2 = sx - 3.5 + i * 2.2
                svg.el("line", x1=f"{mx2:.1f}", y1=f"{sy - 4:.1f}",
                       x2=f"{mx2:.1f}", y2=f"{sy - 0.5:.1f}",
                       stroke="#5a2818", stroke_width="0.7", opacity="0.55")
                svg.el("ellipse", cx=f"{mx2:.1f}", cy=f"{sy:.1f}",
                       rx="1.0", ry="1.8", fill="#983828", opacity="0.70")
        elif stall_type == "flowers":
            colors = ["#e05060", "#e8c040", "#d070a0", "#8060c0", "#f09030", "#50b070"]
            for _ in range(rng.randint(6, 10)):
                fx = rng.uniform(sx - 4, sx + 4)
                fy = rng.uniform(sy - 2, sy + 2)
                svg.el("circle", cx=f"{fx:.1f}", cy=f"{fy:.1f}",
                       r=f"{rng.uniform(0.8, 1.5):.1f}",
                       fill=rng.choice(colors), opacity="0.70")
        elif stall_type == "trinkets":
            for _ in range(rng.randint(6, 10)):
                tx = rng.uniform(sx - 4, sx + 4)
                ty = rng.uniform(sy - 1.5, sy + 1.5)
                svg.el("circle", cx=f"{tx:.1f}", cy=f"{ty:.1f}",
                       r="0.8", fill=rng.choice(["#f0e8b0", "#c8c8d8", "#d0a840"]),
                       opacity="0.70")
        elif stall_type == "spices":
            spice_colors = ["#d8b030", "#c05020", "#80a028", "#a06020", "#d08850"]
            for i in range(rng.randint(4, 7)):
                scx = sx - 4 + i * 1.5
                svg.el("circle", cx=f"{scx:.1f}", cy=f"{sy:.1f}",
                       r="1.2", fill=rng.choice(spice_colors),
                       stroke="#5a4030", stroke_width="0.4", opacity="0.70")
        elif stall_type == "cheese":
            for i in range(rng.randint(3, 5)):
                cx2 = sx - 3 + i * 2
                svg.el("circle", cx=f"{cx2:.1f}", cy=f"{sy:.1f}",
                       r="1.5", fill="#e0c868", stroke="#a89040",
                       stroke_width="0.4", opacity="0.65")
        elif stall_type == "tools":
            for i in range(rng.randint(3, 5)):
                tx = sx - 3.5 + i * 1.8
                svg.el("rect", x=f"{tx:.1f}", y=f"{sy - 1.5:.1f}",
                       width="0.8", height="3.5", fill="#888",
                       opacity="0.60")
                svg.el("rect", x=f"{tx - 0.4:.1f}", y=f"{sy + 1.5:.1f}",
                       width="1.5", height="1.8", fill="#6a5030",
                       opacity="0.60")
        elif stall_type == "fish":
            for i in range(rng.randint(3, 6)):
                fx = sx - 4 + i * 1.8
                svg.el("ellipse", cx=f"{fx:.1f}", cy=f"{sy:.1f}",
                       rx="1.8", ry="0.8", fill="#8090a0", opacity="0.65")
        elif stall_type == "leather":
            for i in range(rng.randint(3, 5)):
                lx = sx - 3.5 + i * 2
                svg.el("rect", x=f"{lx:.1f}", y=f"{sy - 1.5:.1f}",
                       width="1.8", height="3", fill="#a88058",
                       rx="0.3", opacity="0.62")

        svg.raw('</g>')

    # ── Decorative corner posts / bollards ──
    if not is_circle:
        for (cx2, cy2) in [(x + 6, y + 6), (x + w - 6, y + 6),
                            (x + 6, y + h - 6), (x + w - 6, y + h - 6)]:
            svg.el("circle", cx=f"{cx2:.0f}", cy=f"{cy2:.0f}", r="3",
                   fill=P.wall_stone, stroke=P.wall_dark, stroke_width="1",
                   opacity="0.40")

    # ── Barrels and crates clustered near edges ──
    for _ in range(rng.randint(4, 8)):
        if is_circle:
            a = rng.uniform(0, TAU)
            br = rad * rng.uniform(0.75, 0.92)
            bx2 = mcx + br * cos(a)
            by2 = mcy + br * sin(a)
        else:
            bx2 = rng.choice([rng.uniform(x + 4, x + 14), rng.uniform(x + w - 14, x + w - 4)])
            by2 = rng.choice([rng.uniform(y + 4, y + 14), rng.uniform(y + h - 14, y + h - 4)])
        if rng.random() < 0.5:
            # Barrel
            r_bar = rng.uniform(2, 3.5)
            svg.el("circle", cx=f"{bx2:.0f}", cy=f"{by2:.0f}",
                   r=f"{r_bar:.1f}", fill="#8a7050", stroke=P.wall_dark,
                   stroke_width="0.6", opacity="0.45")
            svg.el("circle", cx=f"{bx2:.0f}", cy=f"{by2:.0f}",
                   r=f"{r_bar * 0.6:.1f}", fill="none", stroke=P.wall_dark,
                   stroke_width="0.4", opacity="0.25")
        else:
            # Crate
            cs = rng.uniform(3, 5)
            svg.el("rect", x=f"{bx2 - cs / 2:.0f}", y=f"{by2 - cs / 2:.0f}",
                   width=f"{cs:.0f}", height=f"{cs:.0f}",
                   fill="#9a8058", stroke=P.wall_dark, stroke_width="0.5",
                   rx="0.5", opacity="0.42")
            svg.el("line", x1=f"{bx2 - cs / 2:.0f}", y1=f"{by2 - cs / 2:.0f}",
                   x2=f"{bx2 + cs / 2:.0f}", y2=f"{by2 + cs / 2:.0f}",
                   stroke=P.wall_dark, stroke_width="0.3", opacity="0.20")


def _render_detail(svg: SvgCanvas, det: Detail, rng: random.Random, P):
    x, y = det.x, det.y

    if det.detail_type == "well":
        svg.el("circle", cx=f"{x:.1f}", cy=f"{y:.1f}", r="5",
               fill=P.wall_light, stroke=P.wall_dark, stroke_width="1.5", opacity="0.55")
        svg.el("circle", cx=f"{x:.1f}", cy=f"{y:.1f}", r="2.5",
               fill=P.water_dark, opacity="0.50")
        # Support beam
        svg.el("line", x1=f"{x-3:.0f}", y1=f"{y-5:.0f}",
               x2=f"{x+3:.0f}", y2=f"{y-5:.0f}",
               stroke=P.wood, stroke_width="1.5", opacity="0.40")

    elif det.detail_type == "market_stall":
        w, h = det.w, det.h
        rot = det.rotation
        color = det.color or "#c44020"
        transform = f"rotate({rot:.0f} {x:.0f} {y:.0f})"
        # Table
        svg.el("rect", x=f"{x-w/2:.1f}", y=f"{y-h/2:.1f}",
               width=f"{w:.1f}", height=f"{h:.1f}",
               fill=P.wood_light, stroke=P.wood, stroke_width="0.8",
               rx="0.5", opacity="0.55", transform=transform)
        # Awning
        svg.el("rect", x=f"{x-w/2-1:.1f}", y=f"{y-h/2-2:.1f}",
               width=f"{w+2:.1f}", height="3",
               fill=color, opacity="0.40", rx="0.5", transform=transform)

    elif det.detail_type == "garden":
        w, h = det.w, det.h
        svg.el("rect", x=f"{x-w/2:.1f}", y=f"{y-h/2:.1f}",
               width=f"{w:.1f}", height=f"{h:.1f}",
               fill="url(#grass)", stroke=P.garden_dark, stroke_width="0.5",
               rx="1", opacity="0.45")
        # A few plant dots
        for _ in range(rng.randint(2, 5)):
            px = x + rng.uniform(-w/3, w/3)
            py = y + rng.uniform(-h/3, h/3)
            svg.el("circle", cx=f"{px:.1f}", cy=f"{py:.1f}",
                   r=f"{rng.uniform(1.0, 2.0):.1f}",
                   fill=rng.choice([P.green_dark, "#8aaa58", "#6a8a38"]),
                   opacity=f"{rng.uniform(0.25, 0.45):.2f}")

    elif det.detail_type == "barrel":
        r = det.w / 2
        svg.el("circle", cx=f"{x:.1f}", cy=f"{y:.1f}", r=f"{r:.1f}",
               fill=P.barrel, stroke=P.wood, stroke_width="0.8", opacity="0.50")
        svg.el("circle", cx=f"{x:.1f}", cy=f"{y:.1f}", r=f"{r*0.5:.1f}",
               fill="none", stroke=P.wood, stroke_width="0.5", opacity="0.30")

    elif det.detail_type == "crate":
        s = det.w / 2
        rot = det.rotation
        transform = f"rotate({rot:.0f} {x:.0f} {y:.0f})"
        svg.el("rect", x=f"{x-s:.1f}", y=f"{y-s:.1f}",
               width=f"{s*2:.1f}", height=f"{s*2:.1f}",
               fill=P.wood_light, stroke=P.wood, stroke_width="0.8",
               rx="0.5", opacity="0.50", transform=transform)
        # Cross lines
        svg.el("line", x1=f"{x-s:.1f}", y1=f"{y-s:.1f}",
               x2=f"{x+s:.1f}", y2=f"{y+s:.1f}",
               stroke=P.wood, stroke_width="0.5", opacity="0.25", transform=transform)

    elif det.detail_type == "fence":
        w = det.w
        rot = det.rotation
        transform = f"rotate({rot:.0f} {x:.0f} {y:.0f})"
        svg.el("line", x1=f"{x-w/2:.1f}", y1=f"{y:.1f}",
               x2=f"{x+w/2:.1f}", y2=f"{y:.1f}",
               stroke=P.fence, stroke_width="1.2", opacity="0.30",
               stroke_dasharray="3,2", transform=transform)

    elif det.detail_type == "haystack":
        w, h = det.w, det.h
        svg.el("ellipse", cx=f"{x:.1f}", cy=f"{y:.1f}",
               rx=f"{w/2:.1f}", ry=f"{h/2:.1f}",
               fill="#c8a840", stroke="#a08830", stroke_width="0.8", opacity="0.45")
        svg.el("ellipse", cx=f"{x:.1f}", cy=f"{y - h*0.15:.1f}",
               rx=f"{w*0.35:.1f}", ry=f"{h*0.3:.1f}",
               fill="#d8b850", opacity="0.30")


def _render_walls(svg: SvgCanvas, wall: WallData, tier: str, rng: random.Random, P):
    wd = _poly_d(wall.vertices)
    is_stone = tier in ("capital", "large_town")
    is_capital = tier == "capital"

    if is_stone:
        # --- Thick, prominent stone wall ---
        wall_thick = 18 if is_capital else 12
        outer_thick = wall_thick + 8
        inner_edge_thick = wall_thick - 4

        # Deep shadow for depth
        svg.el("path", d=wd, fill="none", stroke=P.shadow,
               stroke_width=f"{outer_thick + 6}", stroke_linejoin="round", opacity="0.12",
               transform="translate(4,4)")
        # Outer stone face (lighter)
        svg.el("path", d=wd, fill="none", stroke=P.wall_light,
               stroke_width=f"{outer_thick}", stroke_linejoin="round", opacity="0.50")
        # Main wall body
        svg.el("path", d=wd, fill="none", stroke=P.wall_fill,
               stroke_width=f"{wall_thick}", stroke_linejoin="round", opacity="0.80")
        # Stone texture — subtle inner highlight
        svg.el("path", d=wd, fill="none", stroke=P.wall_stone,
               stroke_width=f"{inner_edge_thick}", stroke_linejoin="round", opacity="0.45")
        # Dark inner edge for definition
        svg.el("path", d=wd, fill="none", stroke=P.wall_dark,
               stroke_width="2.5", stroke_linejoin="round", opacity="0.60")

        # Crenellation merlons along outer face
        n = len(wall.vertices)
        merlon_step = max(1, n // (80 if is_capital else 50))
        for i in range(0, n, merlon_step):
            p = wall.vertices[i]
            p_next = wall.vertices[(i + 1) % n]
            dx, dy = normalize(p_next[0] - p[0], p_next[1] - p[1])
            nx, ny = perp(dx, dy)
            # Outward-facing merlon block
            mw = 4.0 if is_capital else 3.0
            mh = 3.0 if is_capital else 2.5
            offset = wall_thick / 2 + 1
            mx = p[0] + nx * offset - mw / 2
            my = p[1] + ny * offset - mh / 2
            svg.el("rect",
                   x=f"{mx:.1f}", y=f"{my:.1f}",
                   width=f"{mw:.1f}", height=f"{mh:.1f}",
                   fill=P.wall_fill, stroke=P.wall_dark,
                   stroke_width="0.5", opacity="0.50")

        # --- Wall Towers (large, detailed) ---
        tower_r = 16 if is_capital else 12
        for tp_pt in wall.towers:
            tx, ty = tp_pt
            # Tower shadow
            svg.el("circle", cx=f"{tx+2:.1f}", cy=f"{ty+2:.1f}",
                   r=f"{tower_r+2}", fill=P.shadow, opacity="0.12")
            # Tower base (thick stone circle)
            svg.el("circle", cx=f"{tx:.1f}", cy=f"{ty:.1f}",
                   r=f"{tower_r}", fill=P.wall_fill, stroke=P.wall_dark,
                   stroke_width="3", opacity="0.88")
            # Inner stone ring
            svg.el("circle", cx=f"{tx:.1f}", cy=f"{ty:.1f}",
                   r=f"{tower_r - 4}", fill=P.tower_fill, stroke=P.wall_stone,
                   stroke_width="1.5", opacity="0.70")
            # Top cap highlight
            svg.el("circle", cx=f"{tx:.1f}", cy=f"{ty:.1f}",
                   r=f"{tower_r - 7}", fill=P.wall_light, stroke=P.wall_dark,
                   stroke_width="1", opacity="0.45")
            # Crenellation ring (dashed) around tower top
            svg.el("circle", cx=f"{tx:.1f}", cy=f"{ty:.1f}",
                   r=f"{tower_r - 2}", fill="none", stroke=P.wall_dark,
                   stroke_width="1.2", stroke_dasharray="3,2.5", opacity="0.35")

        # --- Gates (impressive gatehouse structures) ---
        for gate in wall.gates:
            gx, gy = gate.pos
            ga = gate.angle
            rdx, rdy = cos(ga), sin(ga)
            nx, ny = perp(rdx, rdy)

            gate_tower_r = 18 if is_capital else 13
            gate_spacing = 22 if is_capital else 16

            # Gatehouse connecting wall between towers
            for side_sign in (-1, 1):
                # Flanking tower position
                ftx = gx + nx * side_sign * gate_spacing
                fty = gy + ny * side_sign * gate_spacing
                # Tower shadow
                svg.el("circle", cx=f"{ftx+2:.1f}", cy=f"{fty+2:.1f}",
                       r=f"{gate_tower_r+2}", fill=P.shadow, opacity="0.12")
                # Tower base
                svg.el("circle", cx=f"{ftx:.1f}", cy=f"{fty:.1f}",
                       r=f"{gate_tower_r}", fill=P.wall_fill, stroke=P.wall_dark,
                       stroke_width="3.5", opacity="0.90")
                # Inner ring
                svg.el("circle", cx=f"{ftx:.1f}", cy=f"{fty:.1f}",
                       r=f"{gate_tower_r - 5}", fill=P.tower_fill, stroke=P.wall_stone,
                       stroke_width="1.5", opacity="0.72")
                # Top cap
                svg.el("circle", cx=f"{ftx:.1f}", cy=f"{fty:.1f}",
                       r=f"{gate_tower_r - 8}", fill=P.wall_light, stroke=P.wall_dark,
                       stroke_width="1", opacity="0.50")
                # Crenellation ring
                svg.el("circle", cx=f"{ftx:.1f}", cy=f"{fty:.1f}",
                       r=f"{gate_tower_r - 2}", fill="none", stroke=P.wall_dark,
                       stroke_width="1.2", stroke_dasharray="3,2.5", opacity="0.35")

            # Gate passage (stone archway between towers)
            passage_len = 24 if is_capital else 16
            passage_w = 16 if is_capital else 12
            px0 = gx - rdx * passage_len / 2
            py0 = gy - rdy * passage_len / 2
            px1 = gx + rdx * passage_len / 2
            py1 = gy + rdy * passage_len / 2
            # Passage outer stone
            svg.el("line", x1=f"{px0:.0f}", y1=f"{py0:.0f}",
                   x2=f"{px1:.0f}", y2=f"{py1:.0f}",
                   stroke=P.wall_fill, stroke_width=f"{passage_w + 4:.0f}",
                   stroke_linecap="butt", opacity="0.75")
            # Passage opening (road color)
            svg.el("line", x1=f"{px0:.0f}", y1=f"{py0:.0f}",
                   x2=f"{px1:.0f}", y2=f"{py1:.0f}",
                   stroke=P.road_main, stroke_width=f"{passage_w - 2:.0f}",
                   stroke_linecap="butt", opacity="0.80")
            # Portcullis lines (thin vertical bars)
            for bar_t in (0.35, 0.50, 0.65):
                bx = lerp_pt((px0, py0), (px1, py1), bar_t)[0]
                by = lerp_pt((px0, py0), (px1, py1), bar_t)[1]
                svg.el("line",
                       x1=f"{bx - nx * (passage_w/2 - 2):.0f}",
                       y1=f"{by - ny * (passage_w/2 - 2):.0f}",
                       x2=f"{bx + nx * (passage_w/2 - 2):.0f}",
                       y2=f"{by + ny * (passage_w/2 - 2):.0f}",
                       stroke=P.wall_dark, stroke_width="1", opacity="0.30")
    else:
        # Wooden palisade
        svg.el("path", d=wd, fill="none", stroke=P.wall_stone,
               stroke_width="8", stroke_linejoin="round", opacity="0.40")
        svg.el("path", d=wd, fill="none", stroke=P.wood,
               stroke_width="5", stroke_linejoin="round", opacity="0.50")
        svg.el("path", d=wd, fill="none", stroke=P.wall_dark,
               stroke_width="1.5", stroke_dasharray="6,4",
               stroke_linejoin="round", opacity="0.40")
        # Palisade posts
        n = len(wall.vertices)
        post_step = max(1, n // 30)
        for i in range(0, n, post_step):
            p = wall.vertices[i]
            svg.el("circle", cx=f"{p[0]:.1f}", cy=f"{p[1]:.1f}",
                   r="3", fill=P.wood, stroke=P.wall_dark,
                   stroke_width="0.8", opacity="0.45")

    # Inner wall (for capitals) — with gate gaps where roads cross
    if wall.inner_vertices:
        inner_thick = 14 if is_capital else 9
        inner_tower_r = 12 if is_capital else 8
        gate_gap = 28  # half-width of gap at each gate point
        inner_gates = wall.inner_gates or []
        iv = wall.inner_vertices
        n_iv = len(iv)

        # Build wall segments with gaps at gate points
        # Walk each edge; if a gate is near, split the segment around it
        segments = []  # list of polyline point-lists
        current_seg = [iv[0]]
        for i in range(n_iv):
            p0 = iv[i]
            p1 = iv[(i + 1) % n_iv]
            edge_dx, edge_dy = p1[0] - p0[0], p1[1] - p0[1]
            edge_len = math.hypot(edge_dx, edge_dy)
            if edge_len < 1e-6:
                continue
            # Check if any gate intersects this edge
            gate_hits = []
            for gpt in inner_gates:
                # Project gate point onto edge
                t = ((gpt[0] - p0[0]) * edge_dx + (gpt[1] - p0[1]) * edge_dy) / (edge_len * edge_len)
                if -0.1 <= t <= 1.1:
                    proj = (p0[0] + t * edge_dx, p0[1] + t * edge_dy)
                    if dist(gpt, proj) < gate_gap * 1.5:
                        gate_hits.append((t, gpt))
            gate_hits.sort(key=lambda x: x[0])

            if not gate_hits:
                current_seg.append(p1)
            else:
                for gt, gpt in gate_hits:
                    # Point just before the gate gap
                    frac_before = max(0, gt - gate_gap / edge_len)
                    pt_before = lerp_pt(p0, p1, frac_before)
                    current_seg.append(pt_before)
                    segments.append(current_seg)
                    # Start new segment after the gate gap
                    frac_after = min(1, gt + gate_gap / edge_len)
                    pt_after = lerp_pt(p0, p1, frac_after)
                    current_seg = [pt_after]
                # Continue to next vertex
                current_seg.append(p1)
        # Close: connect last segment to first if no gate gap between them
        if segments and len(current_seg) > 1:
            # Check if first and last segments can be merged
            if dist(current_seg[-1], segments[0][0]) < 2:
                segments[0] = current_seg + segments[0][1:]
            else:
                segments.append(current_seg)
        elif not segments:
            # No gates at all, single closed polygon
            segments = [iv + [iv[0]]]
        else:
            segments.append(current_seg)

        # Render each wall segment
        for seg in segments:
            if len(seg) < 2:
                continue
            sd = "M " + " L ".join(f"{p[0]:.1f} {p[1]:.1f}" for p in seg)
            # Shadow
            svg.el("path", d=sd, fill="none", stroke=P.shadow,
                   stroke_width=f"{inner_thick + 4}", stroke_linejoin="round",
                   stroke_linecap="round", opacity="0.10",
                   transform="translate(2,2)")
            # Main wall
            svg.el("path", d=sd, fill="none", stroke=P.wall_fill,
                   stroke_width=f"{inner_thick}", stroke_linejoin="round",
                   stroke_linecap="round", opacity="0.70")
            svg.el("path", d=sd, fill="none", stroke=P.wall_stone,
                   stroke_width=f"{inner_thick - 4}", stroke_linejoin="round",
                   stroke_linecap="round", opacity="0.50")
            svg.el("path", d=sd, fill="none", stroke=P.wall_dark,
                   stroke_width="2", stroke_linejoin="round",
                   stroke_linecap="round", opacity="0.50")

        # Inner wall towers at vertices (skip vertices too close to gates)
        inner_step = max(1, n_iv // 8)
        for i in range(0, n_iv, inner_step):
            pt = iv[i]
            too_close_to_gate = any(dist(pt, g) < gate_gap * 1.2 for g in inner_gates)
            if too_close_to_gate:
                continue
            svg.el("circle", cx=f"{pt[0]:.1f}", cy=f"{pt[1]:.1f}",
                   r=f"{inner_tower_r}", fill=P.wall_fill, stroke=P.wall_dark,
                   stroke_width="2.5", opacity="0.78")
            svg.el("circle", cx=f"{pt[0]:.1f}", cy=f"{pt[1]:.1f}",
                   r=f"{inner_tower_r - 4}", fill=P.tower_fill, stroke=P.wall_stone,
                   stroke_width="1", opacity="0.55")
            svg.el("circle", cx=f"{pt[0]:.1f}", cy=f"{pt[1]:.1f}",
                   r=f"{inner_tower_r - 2}", fill="none", stroke=P.wall_dark,
                   stroke_width="1", stroke_dasharray="2.5,2", opacity="0.30")

        # Gate towers flanking each inner gate
        for gpt in inner_gates:
            # Find the wall edge direction at the gate
            best_edge_dir = (1, 0)
            for i in range(n_iv):
                wp0 = iv[i]
                wp1 = iv[(i + 1) % n_iv]
                mid = ((wp0[0] + wp1[0]) / 2, (wp0[1] + wp1[1]) / 2)
                if dist(gpt, mid) < dist(wp0, wp1) * 0.7:
                    elen = dist(wp0, wp1)
                    if elen > 1e-6:
                        best_edge_dir = ((wp1[0] - wp0[0]) / elen, (wp1[1] - wp0[1]) / elen)
                    break
            edx, edy = best_edge_dir
            # Normal to the wall edge
            enx, eny = -edy, edx
            # Two flanking towers offset along wall direction
            tower_offset = gate_gap * 0.85
            for sign in (-1, 1):
                tx = gpt[0] + edx * sign * tower_offset
                ty = gpt[1] + edy * sign * tower_offset
                tr = inner_tower_r + 1
                svg.el("circle", cx=f"{tx:.1f}", cy=f"{ty:.1f}",
                       r=f"{tr}", fill=P.wall_fill, stroke=P.wall_dark,
                       stroke_width="2.5", opacity="0.80")
                svg.el("circle", cx=f"{tx:.1f}", cy=f"{ty:.1f}",
                       r=f"{tr - 4}", fill=P.tower_fill, stroke=P.wall_stone,
                       stroke_width="1", opacity="0.55")
            # Gate passage (stone archway)
            passage_len = 18
            passage_w = 14
            px0 = gpt[0] - edx * passage_len / 2
            py0 = gpt[1] - edy * passage_len / 2
            px1 = gpt[0] + edx * passage_len / 2
            py1 = gpt[1] + edy * passage_len / 2
            svg.el("line", x1=f"{px0:.0f}", y1=f"{py0:.0f}",
                   x2=f"{px1:.0f}", y2=f"{py1:.0f}",
                   stroke=P.wall_fill, stroke_width=f"{passage_w + 4:.0f}",
                   stroke_linecap="butt", opacity="0.65")
            svg.el("line", x1=f"{px0:.0f}", y1=f"{py0:.0f}",
                   x2=f"{px1:.0f}", y2=f"{py1:.0f}",
                   stroke=P.road_main, stroke_width=f"{passage_w - 2:.0f}",
                   stroke_linecap="butt", opacity="0.75")


def _render_pond(svg: SvgCanvas, wf: 'WaterFeature', rng: random.Random, P):
    """Render a pond/lake with an irregular organic shoreline."""
    pcx, pcy = wf.cx, wf.cy
    prx, pry = wf.rx, wf.ry

    # ── Generate irregular shoreline polygon ──
    n_pts = rng.randint(10, 16)
    # Base rotation so each pond looks different
    rot = rng.uniform(0, TAU)
    shore_pts = []
    for i in range(n_pts):
        a = TAU * i / n_pts + rot
        # Vary radius at each vertex for organic shape
        r_scale = rng.uniform(0.72, 1.28)
        # Also slightly squish in one direction
        rx_at = prx * r_scale
        ry_at = pry * rng.uniform(0.75, 1.25)
        x = pcx + rx_at * cos(a)
        y = pcy + ry_at * sin(a)
        shore_pts.append((x, y))

    # Smooth the polygon for natural curves
    shore_pts = smooth_polygon(shore_pts, passes=3, blend=0.35)

    # Build SVG path
    shore_d = _poly_d(shore_pts)

    # ── Muddy shore band (slightly larger, muted) ──
    shore_outer = []
    for sx, sy in shore_pts:
        dx, dy = sx - pcx, sy - pcy
        ln = max(1e-6, (dx*dx + dy*dy) ** 0.5)
        shore_outer.append((sx + dx/ln * 5, sy + dy/ln * 5))
    shore_outer = smooth_polygon(shore_outer, passes=2, blend=0.3)
    shore_outer_d = _poly_d(shore_outer)

    svg.el("path", d=shore_outer_d, fill=P.water_shore, stroke="none", opacity="0.30")

    # ── Main water body ──
    svg.el("path", d=shore_d, fill=P.water, stroke=P.water_dark,
           stroke_width="1.2", opacity="0.68")

    # ── Light reflection highlight (offset blob) ──
    highlight_pts = []
    h_offset_x = prx * rng.uniform(-0.15, 0.05)
    h_offset_y = pry * rng.uniform(-0.25, -0.10)
    for i in range(8):
        a = TAU * i / 8 + rng.uniform(-0.2, 0.2)
        hr = prx * rng.uniform(0.18, 0.32)
        hx = pcx + h_offset_x + hr * cos(a)
        hy = pcy + h_offset_y + hr * rng.uniform(0.6, 0.9) * sin(a)
        highlight_pts.append((hx, hy))
    highlight_pts = smooth_polygon(highlight_pts, passes=2, blend=0.3)
    highlight_d = _poly_d(highlight_pts)
    svg.el("path", d=highlight_d, fill=P.water_light, stroke="none", opacity="0.18")

    # ── Shore details: reeds, rocks, mud patches ──
    num_reeds = rng.randint(5, 14)
    for _ in range(num_reeds):
        # Pick a point on the shoreline
        si = rng.randint(0, len(shore_pts) - 1)
        sx, sy = shore_pts[si]
        # Offset slightly outward
        dx, dy = sx - pcx, sy - pcy
        ln = max(1e-6, (dx*dx + dy*dy) ** 0.5)
        bx = sx + dx/ln * rng.uniform(1, 5)
        by = sy + dy/ln * rng.uniform(1, 5)

        if rng.random() < 0.6:
            # Reed cluster (2-4 thin lines)
            for _ in range(rng.randint(2, 4)):
                tip_x = bx + rng.uniform(-2, 2)
                tip_y = by - rng.uniform(4, 10)
                svg.el("line", x1=f"{bx:.1f}", y1=f"{by:.1f}",
                       x2=f"{tip_x:.1f}", y2=f"{tip_y:.1f}",
                       stroke=P.green_dark, stroke_width="1.2",
                       opacity=f"{rng.uniform(0.25, 0.45):.2f}",
                       stroke_linecap="round")
        else:
            # Small rock
            svg.el("circle", cx=f"{bx:.1f}", cy=f"{by:.1f}",
                   r=f"{rng.uniform(1.5, 3.5):.1f}",
                   fill="#8a8070", stroke="#6a6050", stroke_width="0.6",
                   opacity=f"{rng.uniform(0.25, 0.40):.2f}")

    # ── Subtle ripple arcs on the water surface ──
    for _ in range(rng.randint(2, 5)):
        ra = rng.uniform(0, TAU)
        rd = rng.uniform(0.2, 0.6)
        rcx = pcx + prx * rd * cos(ra)
        rcy = pcy + pry * rd * sin(ra)
        arc_r = rng.uniform(4, prx * 0.25)
        start_a = rng.uniform(0, TAU)
        span = rng.uniform(PI * 0.3, PI * 0.8)
        # Draw a small arc
        x1 = rcx + arc_r * cos(start_a)
        y1 = rcy + arc_r * sin(start_a)
        x2 = rcx + arc_r * cos(start_a + span)
        y2 = rcy + arc_r * sin(start_a + span)
        arc_d = f"M{x1:.1f},{y1:.1f} A{arc_r:.1f},{arc_r:.1f} 0 0,1 {x2:.1f},{y2:.1f}"
        svg.el("path", d=arc_d, fill="none", stroke=P.water_light,
               stroke_width="0.8", opacity="0.15", stroke_linecap="round")


def _render_bridges(svg: SvgCanvas, water: list[WaterFeature], wall: WallData,
                    roads: list[Road], rng: random.Random, P, tier: str):
    """Render stone arch bridges at exact road/river intersection points."""
    is_capital = tier == "capital"
    bridges_placed = []  # (x, y) of placed bridges to avoid duplicates

    for wf in water:
        if not wf.is_river:
            continue
        rw = wf.river_width  # visual river width in pixels

        for road in roads:
            if road.road_type not in ("main", "secondary"):
                continue
            road_dx_full, road_dy_full = 0.0, 0.0
            for si in range(len(road.points) - 1):
                p0, p1 = road.points[si], road.points[si + 1]
                # Precise intersection with each river segment
                for ri in range(len(wf.river_pts) - 1):
                    rp0, rp1 = wf.river_pts[ri], wf.river_pts[ri + 1]
                    cross = seg_intersect(p0, p1, rp0, rp1)
                    if cross is None:
                        continue

                    # Skip if a bridge is already nearby
                    too_close = any(dist(cross, b) < rw * 2.5 for b in bridges_placed)
                    if too_close:
                        continue
                    bridges_placed.append(cross)

                    bx, by = cross
                    # Road direction at the crossing
                    road_dx, road_dy = normalize(p1[0] - p0[0], p1[1] - p0[1])
                    # Perpendicular = river direction
                    nx, ny = perp(road_dx, road_dy)

                    # Bridge length = river width + generous overhang on each bank
                    overhang = rw * 0.5
                    bridge_len = rw + overhang * 2
                    bridge_w = road.width + (8 if is_capital else 5)
                    num_arches = 3 if (is_capital and rw > 28) else 2

                    # Endpoints along the road direction spanning the river
                    bx0 = bx - road_dx * bridge_len / 2
                    by0 = by - road_dy * bridge_len / 2
                    bx1 = bx + road_dx * bridge_len / 2
                    by1 = by + road_dy * bridge_len / 2

                    # Shadow
                    svg.el("line", x1=f"{bx0+3:.0f}", y1=f"{by0+3:.0f}",
                           x2=f"{bx1+3:.0f}", y2=f"{by1+3:.0f}",
                           stroke=P.shadow, stroke_width=f"{bridge_w + 10:.0f}",
                           stroke_linecap="butt", opacity="0.18")
                    # Outer stone edge
                    svg.el("line", x1=f"{bx0:.0f}", y1=f"{by0:.0f}",
                           x2=f"{bx1:.0f}", y2=f"{by1:.0f}",
                           stroke=P.bridge_dark, stroke_width=f"{bridge_w + 6:.0f}",
                           stroke_linecap="butt", opacity="0.75")
                    # Stone surface
                    svg.el("line", x1=f"{bx0:.0f}", y1=f"{by0:.0f}",
                           x2=f"{bx1:.0f}", y2=f"{by1:.0f}",
                           stroke=P.bridge_stone, stroke_width=f"{bridge_w:.0f}",
                           stroke_linecap="butt", opacity="0.88")
                    # Road surface on top
                    svg.el("line", x1=f"{bx0:.0f}", y1=f"{by0:.0f}",
                           x2=f"{bx1:.0f}", y2=f"{by1:.0f}",
                           stroke=P.road, stroke_width=f"{bridge_w - 8:.0f}",
                           stroke_linecap="butt", opacity="0.60")

                    # Arch openings — drawn along the river span (perpendicular to road)
                    # The arches face across the river width, centered on the crossing
                    arch_span = rw * 0.80  # total span of the arch set
                    for ai in range(num_arches):
                        t = (ai + 1.0) / (num_arches + 1.0)
                        # Arch center: offset along road from bridge start, at crossing center
                        arc_bx = bx0 + (bx1 - bx0) * t
                        arc_by = by0 + (by1 - by0) * t
                        arch_r = arch_span / (num_arches * 1.6)
                        # Arch spans perpendicular (across river)
                        a_x0 = arc_bx - nx * arch_r
                        a_y0 = arc_by - ny * arch_r
                        a_x1 = arc_bx + nx * arch_r
                        a_y1 = arc_by + ny * arch_r
                        arch_d = (f"M {a_x0:.0f},{a_y0:.0f} "
                                  f"A {arch_r:.0f},{arch_r:.0f} 0 0 1 "
                                  f"{a_x1:.0f},{a_y1:.0f}")
                        svg.el("path", d=arch_d, fill="none",
                               stroke=P.bridge_dark, stroke_width="3",
                               opacity="0.60")
                        inner_r = arch_r * 0.65
                        ia_x0 = arc_bx - nx * inner_r
                        ia_y0 = arc_by - ny * inner_r
                        ia_x1 = arc_bx + nx * inner_r
                        ia_y1 = arc_by + ny * inner_r
                        inner_d = (f"M {ia_x0:.0f},{ia_y0:.0f} "
                                   f"A {inner_r:.0f},{inner_r:.0f} 0 0 1 "
                                   f"{ia_x1:.0f},{ia_y1:.0f}")
                        svg.el("path", d=inner_d, fill="none",
                               stroke=P.bridge_dark, stroke_width="1.5",
                               opacity="0.38")

                    # Stone parapet rails on each side
                    for side in (-1, 1):
                        rail_off = bridge_w / 2 + 1
                        rx0 = bx0 + nx * side * rail_off
                        ry0 = by0 + ny * side * rail_off
                        rx1 = bx1 + nx * side * rail_off
                        ry1 = by1 + ny * side * rail_off
                        svg.el("line", x1=f"{rx0:.0f}", y1=f"{ry0:.0f}",
                               x2=f"{rx1:.0f}", y2=f"{ry1:.0f}",
                               stroke=P.bridge_dark, stroke_width="5",
                               stroke_linecap="butt", opacity="0.65")
                        svg.el("line", x1=f"{rx0:.0f}", y1=f"{ry0:.0f}",
                               x2=f"{rx1:.0f}", y2=f"{ry1:.0f}",
                               stroke=P.bridge_stone, stroke_width="3",
                               stroke_linecap="butt", opacity="0.55")
                        # Parapet posts
                        n_posts = max(3, int(bridge_len / 20))
                        for pi in range(n_posts):
                            pt = (pi + 0.5) / n_posts
                            ppx = rx0 + (rx1 - rx0) * pt
                            ppy = ry0 + (ry1 - ry0) * pt
                            svg.el("rect",
                                   x=f"{ppx - 2.5:.0f}", y=f"{ppy - 2.5:.0f}",
                                   width="5", height="5",
                                   fill=P.bridge_stone, stroke=P.bridge_dark,
                                   stroke_width="1", opacity="0.55")

                    # Abutment pillars at each bank end
                    for end_pt in ((bx0, by0), (bx1, by1)):
                        ex, ey = end_pt
                        for side in (-1, 1):
                            abx = ex + nx * side * (bridge_w / 2)
                            aby = ey + ny * side * (bridge_w / 2)
                            svg.el("rect",
                                   x=f"{abx - 5:.0f}", y=f"{aby - 5:.0f}",
                                   width="10", height="10",
                                   fill=P.bridge_stone, stroke=P.bridge_dark,
                                   stroke_width="2", rx="1", opacity="0.70")
                    break  # one bridge per road-segment/river-segment pair


DISTRICT_DISPLAY_NAMES = {
    "noble": "Noble Quarter",
    "market": "Market District",
    "temple": "Temple District",
    "residential": "Residential",
    "poor": "Low Quarter",
    "docks": "Dockside",
}


def _render_district_labels(svg: SvgCanvas, district_sectors: list,
                            wall: 'WallData', cx: float, cy: float,
                            W: int, H: int, tier: str, P):
    """Render district name labels at the centroid of each district sector."""
    from math import cos, sin, atan2

    base_scale = W / 2200
    fs = max(16, int(30 * base_scale))
    sw = max(2.5, fs * 0.18)

    # Compute wall radius at a given angle (approximate)
    def wall_radius_at(angle):
        best_r = 0
        for vx, vy in wall.vertices:
            va = atan2(vy - cy, vx - cx)
            da = abs(va - angle)
            if da > PI:
                da = TAU - da
            if da < PI / 6:  # within 30 degrees
                r = ((vx - cx)**2 + (vy - cy)**2) ** 0.5
                if r > best_r:
                    best_r = r
        return best_r if best_r > 0 else min(W, H) * 0.3

    # Deduplicate: merge consecutive sectors with the same district name
    merged = []
    prev_boundary = 0
    for boundary, dname in district_sectors:
        if merged and merged[-1][2] == dname:
            # extend previous sector
            merged[-1] = (merged[-1][0], boundary, dname)
        else:
            merged.append((prev_boundary, boundary, dname))
        prev_boundary = boundary

    seen_names = set()
    for start_angle, end_angle, dname in merged:
        display = DISTRICT_DISPLAY_NAMES.get(dname, dname.title())
        if display in seen_names:
            # Append a numeral for repeated districts
            count = sum(1 for s in seen_names if s.startswith(display))
            display = display  # skip duplicates — just don't label again
            continue
        seen_names.add(display)

        mid_angle = (start_angle + end_angle) / 2
        # Place label ~60% of the way from center to wall
        wr = wall_radius_at(mid_angle)

        # Use inner wall if it exists — place label between inner and outer wall
        if wall.inner_vertices:
            inner_r = 0
            for vx, vy in wall.inner_vertices:
                va = atan2(vy - cy, vx - cx)
                da = abs(va - mid_angle)
                if da > PI:
                    da = TAU - da
                if da < PI / 6:
                    r = ((vx - cx)**2 + (vy - cy)**2) ** 0.5
                    if r > inner_r:
                        inner_r = r
            if inner_r > 0:
                label_r = inner_r + (wr - inner_r) * 0.55
            else:
                label_r = wr * 0.60
        else:
            label_r = wr * 0.55

        lx = cx + label_r * cos(mid_angle)
        ly = cy + label_r * sin(mid_angle)

        # Halo layer — parchment outline for readability
        svg.txt(display.upper(), x=f"{lx:.1f}", y=f"{ly:.1f}",
                text_anchor="middle", fill="none",
                font_family="'Spectral', Georgia, serif", font_size=str(fs),
                font_weight="700", font_style="italic",
                opacity="0.70",
                stroke=P.parchment, stroke_width=f"{sw:.1f}",
                letter_spacing="3")
        # Fill layer — pure black on top
        svg.txt(display.upper(), x=f"{lx:.1f}", y=f"{ly:.1f}",
                text_anchor="middle", fill="#1a1a1a",
                font_family="'Spectral', Georgia, serif", font_size=str(fs),
                font_weight="700", font_style="italic",
                opacity="0.92",
                letter_spacing="3")


def _render_chrome(svg: SvgCanvas, cfg: TownConfig, tier: str,
                   W: int, H: int, P, rng: random.Random):
    """Render frame, compass rose, title cartouche."""
    # Frame
    svg.el("rect", x="8", y="8", width=f"{W-16}", height=f"{H-16}",
           fill="none", stroke=P.text_soft, stroke_width="1.5", rx="3", opacity="0.22")
    svg.el("rect", x="12", y="12", width=f"{W-24}", height=f"{H-24}",
           fill="none", stroke=P.text_soft, stroke_width="0.5", rx="2", opacity="0.14")

    # Corner ornaments
    orn_sz = 22
    for (ox, oy, sx, sy) in [(16, 16, 1, 1), (W-16, 16, -1, 1), (16, H-16, 1, -1), (W-16, H-16, -1, -1)]:
        svg.raw(f'<g transform="translate({ox},{oy}) scale({sx},{sy})" opacity="0.28">'
                f'<line x1="0" y1="0" x2="{orn_sz}" y2="0" stroke="{P.text_soft}" stroke-width="1"/>'
                f'<line x1="0" y1="0" x2="0" y2="{orn_sz}" stroke="{P.text_soft}" stroke-width="1"/>'
                f'<line x1="3" y1="3" x2="14" y2="3" stroke="{P.text_soft}" stroke-width="0.5"/>'
                f'<line x1="3" y1="3" x2="3" y2="14" stroke="{P.text_soft}" stroke-width="0.5"/>'
                f'<circle cx="5" cy="5" r="1.5" fill="{P.text_soft}" opacity="0.40"/>'
                f'</g>')

    # Compass rose
    comp_x, comp_y = W - 60, H - 60
    svg.el("circle", cx=f"{comp_x}", cy=f"{comp_y}", r="24",
           fill="none", stroke=P.text_soft, stroke_width="0.8", opacity="0.28")
    svg.el("circle", cx=f"{comp_x}", cy=f"{comp_y}", r="18",
           fill="none", stroke=P.text_soft, stroke_width="0.4", opacity="0.15")
    # N arrow
    svg.el("line", x1=f"{comp_x}", y1=f"{comp_y+10}", x2=f"{comp_x}", y2=f"{comp_y-14}",
           stroke=P.text_soft, stroke_width="1.4", opacity="0.38")
    svg.raw(f'<polygon points="{comp_x},{comp_y-16} {comp_x-4},{comp_y-9} {comp_x+4},{comp_y-9}"'
            f' fill="{P.text_soft}" opacity="0.38"/>')
    # Tick marks
    for a, label, dx, dy in [(0, "E", 22, 3), (PI, "W", -22, 3), (PI/2, "S", 0, 24), (-PI/2, "N", 0, -20)]:
        svg.txt(label, x=f"{comp_x+dx}", y=f"{comp_y+dy}",
                text_anchor="middle", fill=P.text_soft,
                font_family="'Cinzel', serif", font_size="8", font_weight="600", opacity="0.38")

    # Title cartouche — scaled to canvas size for readability
    title = cfg.name.upper()
    # Scale font size based on canvas width
    title_fs = max(28, int(W * 0.012))  # ~58px for capitals, ~38 for large_town, ~26 for small
    sub_fs = max(12, int(title_fs * 0.42))
    char_w = title_fs * 0.72
    title_w = max(len(title) * char_w + 80, 240)
    title_h = title_fs * 2.8
    title_x = W / 2 - title_w / 2
    title_y = 14
    # Cartouche background — solid and readable
    svg.el("rect", x=f"{title_x:.0f}", y=f"{title_y:.0f}",
           width=f"{title_w:.0f}", height=f"{title_h:.0f}",
           rx="8", fill=P.parchment, stroke=P.text_soft, stroke_width="1.5", opacity="0.95")
    svg.el("rect", x=f"{title_x + 5:.0f}", y=f"{title_y + 5:.0f}",
           width=f"{title_w - 10:.0f}", height=f"{title_h - 10:.0f}",
           rx="5", fill="none", stroke=P.text_soft, stroke_width="0.6", opacity="0.30")
    # Decorative lines flanking title
    line_y = title_y + title_h * 0.48
    half_text_w = len(title) * char_w * 0.5 + 10
    svg.el("line", x1=f"{title_x + 20:.0f}", y1=f"{line_y:.0f}",
           x2=f"{W/2 - half_text_w:.0f}", y2=f"{line_y:.0f}",
           stroke=P.text_soft, stroke_width="0.6", opacity="0.25")
    svg.el("line", x1=f"{W/2 + half_text_w:.0f}", y1=f"{line_y:.0f}",
           x2=f"{title_x + title_w - 20:.0f}", y2=f"{line_y:.0f}",
           stroke=P.text_soft, stroke_width="0.6", opacity="0.25")
    # Title text
    svg.txt(title, x=f"{W/2:.0f}", y=f"{title_y + title_h * 0.52:.0f}",
            text_anchor="middle", fill=P.text,
            font_family="'Cinzel', serif", font_size=f"{title_fs}",
            font_weight="700", letter_spacing=f"{max(2, title_fs // 8)}",
            opacity="0.95")
    # Subtitle
    subtitle = "— Capital —" if cfg.is_capital else f"Pop. ~{cfg.population:,}"
    svg.txt(subtitle, x=f"{W/2:.0f}", y=f"{title_y + title_h * 0.80:.0f}",
            text_anchor="middle", fill=P.text_soft,
            font_family="'Spectral', Georgia, serif", font_size=f"{sub_fs}",
            font_style="italic", opacity="0.62")

    # Scale bar
    sb_x, sb_y = W - 110, 40
    svg.el("line", x1=f"{sb_x}", y1=f"{sb_y}", x2=f"{sb_x+65}", y2=f"{sb_y}",
           stroke=P.text, stroke_width="1.5", opacity="0.32")
    for tick in [sb_x, sb_x + 32, sb_x + 65]:
        svg.el("line", x1=f"{tick}", y1=f"{sb_y-3}", x2=f"{tick}", y2=f"{sb_y+3}",
               stroke=P.text, stroke_width="1", opacity="0.32")
    svg.txt("100 ft", x=f"{sb_x+32}", y=f"{sb_y+13}", text_anchor="middle",
            fill=P.text_faint, font_family="'Spectral', Georgia, serif",
            font_size="8", opacity="0.42")


# ════════════════════════════════════════════════════════════════════════
# §11b  DESTROYED VARIANT RENDERER
# ════════════════════════════════════════════════════════════════════════

class PalDestroyed:
    """Scorched, ashen palette for destroyed/conquered towns."""
    bg = "#3a3228"
    bg_outer = "#2e2820"
    bg_inner = "#484038"
    road = "#5a5048"
    road_main = "#6a6058"
    road_edge = "#3a3228"
    road_dark = "#2a2420"
    road_cobble = "#504840"
    wall_stone = "#484040"
    wall_light = "#585050"
    wall_dark = "#282420"
    wall_fill = "#504848"
    tower_fill = "#444040"
    tower_top = "#383430"
    gate_fill = "#5a5450"
    water = "#4a5858"
    water_dark = "#3a4848"
    water_shore = "#5a6a68"
    water_light = "#607070"
    green = "#4a5038"
    green_light = "#586048"
    green_dark = "#384028"
    garden = "#4a5038"
    garden_dark = "#384028"
    fence = "#5a4830"
    text = "#c8b898"
    text_soft = "#a89878"
    text_faint = "#887868"
    parchment = "#4a4238"
    shadow = "#1a1008"
    wood = "#3a2818"
    wood_light = "#5a4830"
    barrel = "#4a3820"
    door = "#2a1c10"
    window = "#5a4838"
    window_frame = "#3a3028"
    bridge_stone = "#585048"
    bridge_dark = "#3a3428"
    # Destruction-specific
    fire_orange = "#d86020"
    fire_yellow = "#e8a030"
    ember = "#c04818"
    smoke = "#2a2828"
    ash = "#6a6460"
    scorch = "#1a1410"
    rubble = "#5a5248"
    blood = "#6a2020"


def render_town_svg_destroyed(town: dict) -> str:
    """Render a destroyed variant of a town — scorched palette, ruined buildings,
    broken walls, fire/smoke overlays, rubble scattered about."""
    cfg: TownConfig = town["cfg"]
    W, H = cfg.width, cfg.height
    cx, cy = W / 2, H / 2
    tier = town["tier"]
    wall: WallData = town["wall"]
    roads: list[Road] = town["roads"]
    plazas: list[Plaza] = town["plazas"]
    buildings: list[Building] = town["buildings"]
    trees: list[TreeCluster] = town["trees"]
    water: list[WaterFeature] = town["water"]
    details: list[Detail] = town["details"]

    svg = SvgCanvas(W, H)
    rng = random.Random(town["seed"] + 9999)  # different seed offset for destruction variation
    P = PalDestroyed

    # ── Defs ──
    svg.add_def(f'''<radialGradient id="bgGrad" cx="50%" cy="50%" r="58%">
        <stop offset="0%" stop-color="{P.bg}"/>
        <stop offset="100%" stop-color="{P.bg_outer}"/>
    </radialGradient>''')
    svg.add_def('''<filter id="bSh"><feDropShadow dx="1.8" dy="1.8" stdDeviation="1.4"
        flood-color="#1a1008" flood-opacity="0.25"/></filter>''')
    svg.add_def('''<filter id="wSh"><feDropShadow dx="3" dy="3" stdDeviation="2.5"
        flood-color="#1a1008" flood-opacity="0.28"/></filter>''')
    # Subtle haze filter for atmosphere
    svg.add_def('''<filter id="haze"><feGaussianBlur in="SourceGraphic" stdDeviation="6"/></filter>''')
    # Cobblestone — darkened
    svg.add_def(f'''<pattern id="cobble" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="{P.road_main}"/>
        <circle cx="2" cy="2" r="1.2" fill="{P.road_cobble}" opacity="0.18"/>
        <circle cx="7" cy="6" r="1.0" fill="{P.road_edge}" opacity="0.12"/>
        <circle cx="4" cy="8" r="0.9" fill="{P.road_cobble}" opacity="0.14"/>
    </pattern>''')
    # Dead grass pattern
    svg.add_def(f'''<pattern id="grass" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="{P.garden}"/>
        <circle cx="2" cy="3" r="0.8" fill="{P.garden_dark}" opacity="0.35"/>
        <circle cx="6" cy="6" r="0.6" fill="{P.green_dark}" opacity="0.30"/>
    </pattern>''')

    # ════════ LAYER 0: Background (scorched earth) ════════
    svg.el("rect", x="0", y="0", width=str(W), height=str(H), fill="url(#bgGrad)")

    # Ashen texture noise — soot and dirt patches
    for _ in range(160):
        tx = rng.uniform(0, W); ty = rng.uniform(0, H)
        tr = rng.uniform(12, 90)
        svg.el("circle", cx=f"{tx:.0f}", cy=f"{ty:.0f}", r=f"{tr:.0f}",
               fill=rng.choice(["#2a2420","#3a3028","#1a1810","#4a4238","#322a22","#201a14","#3a3430"]),
               opacity=f"{rng.uniform(0.02, 0.07):.3f}")

    # Scorch marks — dark radial burns where catapult strikes / dragon fire landed
    for _ in range(rng.randint(8, 22)):
        sx = rng.uniform(W * 0.1, W * 0.9)
        sy = rng.uniform(H * 0.1, H * 0.9)
        sr = rng.uniform(25, 90)
        svg.el("circle", cx=f"{sx:.0f}", cy=f"{sy:.0f}", r=f"{sr:.0f}",
               fill=P.scorch, opacity=f"{rng.uniform(0.03, 0.09):.3f}")

    # Overgrown weed patches — nature reclaiming the ruins
    for _ in range(rng.randint(20, 55)):
        wx = rng.uniform(W * 0.05, W * 0.95)
        wy = rng.uniform(H * 0.05, H * 0.95)
        wr = rng.uniform(6, 30)
        svg.el("circle", cx=f"{wx:.0f}", cy=f"{wy:.0f}", r=f"{wr:.0f}",
               fill=rng.choice(["#3a4828", "#2e3c22", "#44523a", "#354528"]),
               opacity=f"{rng.uniform(0.06, 0.16):.3f}")

    # ════════ LAYER 0b: Outer terrain (abandoned farmland) ════════
    base_r = min(W, H) * TIER_PARAMS[tier]["radius_frac"]
    for _ in range(20):
        fa = rng.uniform(0, TAU)
        fd = base_r * rng.uniform(1.0, 1.5)
        fx, fy = cx + fd * cos(fa), cy + fd * sin(fa)
        fw, fh = rng.uniform(25, 90), rng.uniform(20, 65)
        if 0 < fx < W and 0 < fy < H:
            svg.el("rect", x=f"{fx:.0f}", y=f"{fy:.0f}",
                   width=f"{fw:.0f}", height=f"{fh:.0f}",
                   fill=rng.choice(["#3a3228", "#3a4030", "#2e3828", "#4a4838", "#3a3420"]),
                   opacity=f"{rng.uniform(0.05, 0.12):.2f}", rx="2",
                   transform=f"rotate({rng.uniform(-25,25):.0f} {fx+fw/2:.0f} {fy+fh/2:.0f})")

    # ════════ LAYER 1: Ground fill inside walls (ashen) ════════
    if wall.vertices and tier != "village":
        wd = _poly_d(wall.vertices)
        svg.el("path", d=wd, fill=P.bg_inner, stroke="none", opacity="0.65")

    # ════════ LAYER 2: Water features (murky/stagnant) ════════
    for wf in water:
        if wf.is_river:
            rd = _catmull_rom_path(wf.river_pts)
            rw = wf.river_width
            svg.el("path", d=rd, fill="none", stroke=P.water_shore,
                   stroke_width=f"{rw + 14:.0f}", stroke_linecap="round",
                   stroke_linejoin="round", opacity="0.25")
            svg.el("path", d=rd, fill="none", stroke=P.water,
                   stroke_width=f"{rw:.0f}", stroke_linecap="round",
                   stroke_linejoin="round", opacity="0.60")
        else:
            _render_pond(svg, wf, rng, Pal)
            svg.el("ellipse", cx=f"{wf.cx:.0f}", cy=f"{wf.cy:.0f}",
                   rx=f"{wf.rx * 1.1:.0f}", ry=f"{wf.ry * 1.1:.0f}",
                   fill="#2a3030", opacity="0.35")

    # ════════ LAYER 3: Roads (cracked, partially destroyed, debris-covered) ════════
    # Outer paths — faint, overgrown
    outer_d = ""
    outer_w = 0
    for road in roads:
        if road.road_type != "outer":
            continue
        rd = _catmull_rom_path(road.points)
        if rd:
            outer_d += " " + rd
            outer_w = max(outer_w, road.width)
    if outer_d:
        svg.el("path", d=outer_d.strip(), fill="none", stroke=P.road,
               stroke_width=f"{outer_w:.0f}", stroke_linecap="butt",
               stroke_linejoin="round", opacity="0.18")

    # Interior roads: render each road INDIVIDUALLY so we can damage them
    for road in roads:
        if road.road_type == "outer":
            continue
        pts = road.points
        if len(pts) < 2:
            continue
        w = road.width
        color = P.road_main if road.road_type == "main" else P.road

        # Decide road damage: 0=intact-ish, 1=cracked, 2=partially destroyed, 3=obliterated
        rd_damage = rng.choices([0, 1, 2, 3],
                                weights=[0.10, 0.30, 0.40, 0.20])[0]

        if rd_damage == 3:
            # Obliterated — faint ghost outline + rubble
            rd = _catmull_rom_path(pts)
            if rd:
                svg.el("path", d=rd, fill="none", stroke=P.road,
                       stroke_width=f"{w:.0f}", stroke_linecap="butt",
                       stroke_linejoin="round", opacity="0.20",
                       stroke_dasharray=f"{rng.uniform(8,20):.0f} {rng.uniform(10,25):.0f}")
            # Rubble on the road
            for pt in pts[::max(1, len(pts)//4)]:
                for _ in range(rng.randint(2, 5)):
                    rx = pt[0] + rng.uniform(-w*0.6, w*0.6)
                    ry = pt[1] + rng.uniform(-w*0.6, w*0.6)
                    rs = rng.uniform(2, 6)
                    svg.el("rect", x=f"{rx:.0f}", y=f"{ry:.0f}",
                           width=f"{rs:.0f}", height=f"{rs*0.7:.0f}",
                           fill=rng.choice([P.rubble, P.ash, "#504840"]),
                           opacity=f"{rng.uniform(0.20, 0.45):.2f}", rx="0.5",
                           transform=f"rotate({rng.uniform(0,360):.0f} {rx+rs/2:.0f} {ry+rs*0.35:.0f})")
            continue

        if rd_damage == 2:
            # Partially destroyed — draw segments with gaps
            seg_count = len(pts) - 1
            for si in range(seg_count):
                if rng.random() < 0.35:
                    # Gap — skip this segment, place rubble
                    mid_x = (pts[si][0] + pts[si+1][0]) / 2
                    mid_y = (pts[si][1] + pts[si+1][1]) / 2
                    for _ in range(rng.randint(2, 4)):
                        rx = mid_x + rng.uniform(-w*0.5, w*0.5)
                        ry = mid_y + rng.uniform(-w*0.5, w*0.5)
                        rs = rng.uniform(1.5, 5)
                        svg.el("rect", x=f"{rx:.0f}", y=f"{ry:.0f}",
                               width=f"{rs:.0f}", height=f"{rs*0.7:.0f}",
                               fill=rng.choice([P.rubble, P.ash]),
                               opacity=f"{rng.uniform(0.20, 0.40):.2f}", rx="0.5",
                               transform=f"rotate({rng.uniform(0,360):.0f} {rx:.0f} {ry:.0f})")
                    continue
                # Draw this segment
                svg.el("line", x1=f"{pts[si][0]:.0f}", y1=f"{pts[si][1]:.0f}",
                       x2=f"{pts[si+1][0]:.0f}", y2=f"{pts[si+1][1]:.0f}",
                       stroke=color, stroke_width=f"{w:.0f}",
                       stroke_linecap="butt", opacity="0.65")
            continue

        # damage 0 or 1 — draw the full road
        rd = _catmull_rom_path(pts)
        if not rd:
            continue
        opacity = "0.70" if rd_damage == 1 else "0.80"
        svg.el("path", d=rd, fill="none", stroke=color,
               stroke_width=f"{w:.0f}", stroke_linecap="butt",
               stroke_linejoin="round", opacity=opacity)

        if rd_damage == 1:
            # Crack lines along the road
            for pt in pts[::max(1, len(pts)//3)]:
                for _ in range(rng.randint(1, 3)):
                    cx1 = pt[0] + rng.uniform(-w*0.4, w*0.4)
                    cy1 = pt[1] + rng.uniform(-w*0.4, w*0.4)
                    cx2 = cx1 + rng.uniform(-w*0.8, w*0.8)
                    cy2 = cy1 + rng.uniform(-w*0.5, w*0.5)
                    svg.el("line", x1=f"{cx1:.0f}", y1=f"{cy1:.0f}",
                           x2=f"{cx2:.0f}", y2=f"{cy2:.0f}",
                           stroke="#1a1410", stroke_width=f"{rng.uniform(0.8, 2.0):.1f}",
                           opacity=f"{rng.uniform(0.15, 0.30):.2f}",
                           stroke_linecap="round")

    # ════════ LAYER 4: Plazas (cracked, overgrown) ════════
    for plaza in plazas:
        r = plaza.radius
        svg.el("rect", x=f"{plaza.x - r:.0f}", y=f"{plaza.y - r:.0f}",
               width=f"{r * 2:.0f}", height=f"{r * 2:.0f}",
               fill="url(#cobble)", stroke=P.road_edge, stroke_width="1.5",
               rx="5", opacity="0.45")
        # Deep cracks across plazas
        for _ in range(rng.randint(3, 8)):
            crack_x = plaza.x + rng.uniform(-r * 0.8, r * 0.8)
            crack_y = plaza.y + rng.uniform(-r * 0.8, r * 0.8)
            # Branching crack
            cx1, cy1 = crack_x, crack_y
            for _ in range(rng.randint(2, 5)):
                cx2 = cx1 + rng.uniform(-r * 0.3, r * 0.3)
                cy2 = cy1 + rng.uniform(-r * 0.2, r * 0.2)
                svg.el("line", x1=f"{cx1:.0f}", y1=f"{cy1:.0f}",
                       x2=f"{cx2:.0f}", y2=f"{cy2:.0f}",
                       stroke="#1a1410", stroke_width=f"{rng.uniform(0.8, 2.5):.1f}",
                       opacity=f"{rng.uniform(0.15, 0.30):.2f}",
                       stroke_linecap="round")
                cx1, cy1 = cx2, cy2
        # Weeds growing through cracks
        for _ in range(rng.randint(2, 6)):
            wx = plaza.x + rng.uniform(-r * 0.7, r * 0.7)
            wy = plaza.y + rng.uniform(-r * 0.7, r * 0.7)
            svg.el("circle", cx=f"{wx:.0f}", cy=f"{wy:.0f}",
                   r=f"{rng.uniform(3, 8):.0f}",
                   fill=rng.choice(["#3a4828", "#2e3c22", "#44523a"]),
                   opacity=f"{rng.uniform(0.12, 0.28):.2f}")

    # ════════ LAYER 4b: Market Square (collapsed stalls) ════════
    # Don't render market stalls — they're destroyed. Just place rubble where they were.
    market_sq = town.get("market_square")
    if market_sq and hasattr(market_sq, 'shops'):
        for shop in market_sq.shops:
            # Collapsed stall footprint
            svg.el("rect", x=f"{shop.x:.1f}", y=f"{shop.y:.1f}",
                   width=f"{shop.w:.1f}", height=f"{shop.h:.1f}",
                   fill=rng.choice([P.rubble, P.ash, "#4a3a28", "#3a3028"]),
                   opacity=f"{rng.uniform(0.15, 0.35):.2f}", rx="1")
            # Scattered debris from the stall
            for _ in range(rng.randint(1, 3)):
                dx = shop.x + rng.uniform(-3, shop.w + 3)
                dy = shop.y + rng.uniform(-3, shop.h + 3)
                svg.el("rect", x=f"{dx:.0f}", y=f"{dy:.0f}",
                       width=f"{rng.uniform(2, 5):.0f}", height=f"{rng.uniform(1, 3):.0f}",
                       fill=rng.choice([P.wood, "#5a4830", P.rubble]),
                       opacity=f"{rng.uniform(0.18, 0.35):.2f}", rx="0.5",
                       transform=f"rotate({rng.uniform(0,360):.0f} {dx+2:.0f} {dy+1:.0f})")

    # ════════ LAYER 5: Trees (dead stumps, bare trunks, some overgrown) ════════
    outside_trees = [t for t in trees if not (wall.vertices and point_in_polygon(t.x, t.y, wall.vertices))]
    inside_trees = [t for t in trees if wall.vertices and point_in_polygon(t.x, t.y, wall.vertices)]

    for tc in outside_trees:
        _render_dead_tree(svg, tc, rng, P)
    for tc in inside_trees:
        _render_dead_tree(svg, tc, rng, P)

    # ════════ LAYER 6: Skip most details (destroyed) — only render a few fences/wells ════════
    for det in details:
        if rng.random() < 0.25:  # only 25% of details survive
            _render_detail(svg, det, rng, Pal)

    # ════════ LAYER 7: Buildings (ruined) ════════
    sorted_bldgs = sorted(buildings, key=lambda b: b.y)
    castle_bldg_ref = None
    svg.raw('<g filter="url(#bSh)">')
    for b in sorted_bldgs:
        if b.icon == "castle":
            castle_bldg_ref = b
            continue
        _render_ruined_building(svg, b, rng, tier, P)
    svg.raw('</g>')

    # ════════ LAYER 7b: Castle (ruined) ════════
    if castle_bldg_ref:
        svg.raw('<g filter="url(#bSh)">')
        _render_ruined_building(svg, castle_bldg_ref, rng, tier, P)
        svg.raw('</g>')

    # ════════ LAYER 8: Walls (breached, broken) ════════
    if wall.vertices and TIER_PARAMS[tier]["wall_verts"] > 0:
        _render_broken_walls(svg, wall, tier, rng, P)

    # ════════ LAYER 9: Rubble & debris piles (larger, more varied) ════════
    num_rubble = rng.randint(40, 100) if tier in ("capital", "large_town") else rng.randint(15, 40)
    for _ in range(num_rubble):
        rx = rng.uniform(W * 0.06, W * 0.94)
        ry = rng.uniform(H * 0.06, H * 0.94)
        inside = wall.vertices and point_in_polygon(rx, ry, wall.vertices)
        if not inside and rng.random() < 0.65:
            continue
        rr = rng.uniform(5, 22) if inside else rng.uniform(3, 10)
        # Rubble base (irregular dark patch)
        svg.el("ellipse", cx=f"{rx:.0f}", cy=f"{ry:.0f}",
               rx=f"{rr * 1.2:.0f}", ry=f"{rr * 0.8:.0f}",
               fill=rng.choice([P.rubble, "#3a3228", "#4a4238"]),
               opacity=f"{rng.uniform(0.10, 0.22):.3f}",
               transform=f"rotate({rng.uniform(0,360):.0f} {rx:.0f} {ry:.0f})")
        # Individual stone/wood chunks
        for _ in range(rng.randint(3, 10)):
            ox = rx + rng.uniform(-rr, rr)
            oy = ry + rng.uniform(-rr * 0.7, rr * 0.7)
            rs = rng.uniform(1.5, rr * 0.4)
            shape_type = rng.choice(["rect", "rect", "circle"])  # mostly rectangular rubble
            if shape_type == "circle":
                svg.el("circle", cx=f"{ox:.0f}", cy=f"{oy:.0f}",
                       r=f"{rs:.0f}",
                       fill=rng.choice([P.rubble, P.ash, P.wall_stone, "#5a5040", P.wood]),
                       opacity=f"{rng.uniform(0.20, 0.50):.2f}")
            else:
                rw = rs * rng.uniform(1.2, 2.5)
                rh = rs * rng.uniform(0.6, 1.5)
                svg.el("rect", x=f"{ox:.0f}", y=f"{oy:.0f}",
                       width=f"{rw:.0f}", height=f"{rh:.0f}",
                       fill=rng.choice([P.rubble, P.ash, P.wall_stone, "#5a5040", P.wood]),
                       opacity=f"{rng.uniform(0.20, 0.50):.2f}", rx="0.5",
                       transform=f"rotate({rng.uniform(0,360):.0f} {ox+rw/2:.0f} {oy+rh/2:.0f})")

    # ════════ LAYER 10: Overgrowth on ruins (vines, moss patches) ════════
    overgrowth_count = rng.randint(15, 45) if tier in ("capital", "large_town") else rng.randint(5, 20)
    for _ in range(overgrowth_count):
        ox = rng.uniform(W * 0.08, W * 0.92)
        oy = rng.uniform(H * 0.08, H * 0.92)
        # Moss/vine patch
        svg.el("ellipse", cx=f"{ox:.0f}", cy=f"{oy:.0f}",
               rx=f"{rng.uniform(4, 18):.0f}", ry=f"{rng.uniform(3, 12):.0f}",
               fill=rng.choice(["#3a5028", "#2e4422", "#4a5838", "#354028", "#3a4430"]),
               opacity=f"{rng.uniform(0.08, 0.22):.3f}",
               transform=f"rotate({rng.uniform(0,360):.0f} {ox:.0f} {oy:.0f})")

    # ════════ LAYER 11: Labels (faded, partially illegible) ════════
    base_scale = W / 2200
    for b in sorted_bldgs:
        if b.btype == "special" and b.name:
            fs = max(11, int(14 * base_scale))
            sw = max(3, fs * 0.3)
            svg.txt(b.name, x=f"{b.cx:.1f}", y=f"{b.y - 5:.1f}",
                    text_anchor="middle", fill=P.text,
                    font_family="'Spectral', Georgia, serif", font_size=str(fs),
                    font_weight="600",
                    opacity="0.35", paint_order="stroke",
                    stroke=P.parchment, stroke_width=f"{sw:.1f}")

    # ════════ LAYER 12: Chrome (frame, title with "RUINS OF") ════════
    _render_chrome_destroyed(svg, cfg, tier, W, H, P, rng)

    return svg.render()


def _render_dead_tree(svg: SvgCanvas, tc, rng: random.Random, P):
    """Render a dead/burned tree — just dark bare trunk and branches."""
    for _ in range(tc.trees):
        tx = tc.x + rng.uniform(-tc.r, tc.r)
        ty = tc.y + rng.uniform(-tc.r, tc.r)
        trunk_h = rng.uniform(4, 10)
        # Dark bare trunk
        svg.el("line", x1=f"{tx:.0f}", y1=f"{ty:.0f}",
               x2=f"{tx:.0f}", y2=f"{ty - trunk_h:.0f}",
               stroke="#2a2018", stroke_width=f"{rng.uniform(1.5, 3):.1f}",
               opacity="0.50", stroke_linecap="round")
        # Two bare branches
        for bdir in [-1, 1]:
            bx = tx + bdir * rng.uniform(3, 7)
            by = ty - trunk_h * rng.uniform(0.4, 0.8)
            svg.el("line", x1=f"{tx:.0f}", y1=f"{by:.0f}",
                   x2=f"{bx:.0f}", y2=f"{by - rng.uniform(2, 5):.0f}",
                   stroke="#2a2018", stroke_width="1",
                   opacity="0.35", stroke_linecap="round")
        # Occasional charred stump (wider, shorter)
        if rng.random() < 0.3:
            svg.el("circle", cx=f"{tx:.0f}", cy=f"{ty:.0f}",
                   r=f"{rng.uniform(2, 5):.1f}",
                   fill="#1a1410", opacity="0.25")


def _darken_hex(color: str, amount: float = 0.45) -> str:
    """Darken a hex color by mixing it toward black. amount=0 is original, 1 is black."""
    try:
        c = color.lstrip("#")
        if len(c) < 6:
            return "#3a3228"
        r, g, b = int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16)
        r = int(r * (1 - amount))
        g = int(g * (1 - amount))
        b = int(b * (1 - amount))
        return f"#{r:02x}{g:02x}{b:02x}"
    except (ValueError, TypeError):
        return "#3a3228"


def _render_ruined_building(svg: SvgCanvas, b: Building, rng: random.Random,
                            tier: str, P):
    """Render a building as partially destroyed — uses ACTUAL building shape/position
    with destruction effects overlaid to match the original city layout."""
    x, y, w, h = b.x, b.y, b.w, b.h

    # POIs — dim marker
    if b.btype == "poi":
        svg.el("circle", cx=f"{b.cx:.1f}", cy=f"{b.cy:.1f}", r="5",
               fill="#4a4040", stroke="#2a2020", stroke_width="1", opacity="0.40")
        return

    # Special buildings (castle, temple, etc.) — render the REAL building, then damage it
    if b.btype == "special":
        # Determine destruction level for specials
        spec_destruction = rng.choices([1, 2, 3], weights=[0.25, 0.50, 0.25])[0]

        if spec_destruction == 3 and b.icon != "castle":
            # Completely collapsed — rubble footprint matching building dimensions
            svg.el("rect", x=f"{x:.1f}", y=f"{y:.1f}",
                   width=f"{w:.1f}", height=f"{h:.1f}",
                   fill=rng.choice([P.rubble, P.ash, "#3a3028"]),
                   opacity=f"{rng.uniform(0.25, 0.40):.2f}", rx="1")
            # Outline of former walls
            svg.el("rect", x=f"{x:.1f}", y=f"{y:.1f}",
                   width=f"{w:.1f}", height=f"{h:.1f}",
                   fill="none", stroke="#3a3028", stroke_width="1.5",
                   stroke_dasharray="6 4", rx="2", opacity="0.30")
            # Rubble chunks
            for _ in range(rng.randint(4, 10)):
                rx2 = x + rng.uniform(-3, w + 3)
                ry2 = y + rng.uniform(-3, h + 3)
                svg.el("rect", x=f"{rx2:.0f}", y=f"{ry2:.0f}",
                       width=f"{rng.uniform(2, 7):.0f}", height=f"{rng.uniform(1.5, 5):.0f}",
                       fill=rng.choice([P.rubble, P.wall_stone, "#5a5048"]),
                       opacity=f"{rng.uniform(0.20, 0.45):.2f}", rx="0.5",
                       transform=f"rotate({rng.uniform(0,360):.0f} {rx2+3:.0f} {ry2+2:.0f})")
            return

        # Render the actual building first (including castle)
        _render_special_building(svg, b, rng)

        # Then overlay destruction damage
        # Scorch/soot layer
        svg.el("rect", x=f"{x:.1f}", y=f"{y:.1f}",
               width=f"{w:.1f}", height=f"{h:.1f}",
               fill="#1a1410", opacity=f"{rng.uniform(0.30, 0.55):.2f}", rx="1")

        # Collapsed sections — punch holes through the building
        num_holes = rng.randint(1, 3) if spec_destruction == 1 else rng.randint(2, 5)
        for _ in range(num_holes):
            hx = x + rng.uniform(w * 0.1, w * 0.8)
            hy = y + rng.uniform(h * 0.1, h * 0.8)
            hw = rng.uniform(w * 0.08, w * 0.25)
            hh = rng.uniform(h * 0.08, h * 0.25)
            svg.el("rect", x=f"{hx:.1f}", y=f"{hy:.1f}",
                   width=f"{hw:.1f}", height=f"{hh:.1f}",
                   fill=P.bg_inner, opacity=f"{rng.uniform(0.5, 0.8):.2f}", rx="0.5")
            # Rubble spilling from hole
            for _ in range(rng.randint(1, 3)):
                rx2 = hx + rng.uniform(-2, hw + 2)
                ry2 = hy + hh + rng.uniform(0, 4)
                svg.el("rect", x=f"{rx2:.0f}", y=f"{ry2:.0f}",
                       width=f"{rng.uniform(2, 5):.0f}", height=f"{rng.uniform(1, 3):.0f}",
                       fill=rng.choice([P.rubble, P.wall_stone]),
                       opacity=f"{rng.uniform(0.20, 0.40):.2f}", rx="0.5",
                       transform=f"rotate({rng.uniform(0,360):.0f} {rx2:.0f} {ry2:.0f})")

        # Cracks radiating from damage
        for _ in range(rng.randint(2, 6)):
            cx1 = x + rng.uniform(0, w)
            cy1 = y + rng.uniform(0, h)
            for _ in range(rng.randint(2, 4)):
                cx2 = cx1 + rng.uniform(-w*0.15, w*0.15)
                cy2 = cy1 + rng.uniform(-h*0.15, h*0.15)
                svg.el("line", x1=f"{cx1:.0f}", y1=f"{cy1:.0f}",
                       x2=f"{cx2:.0f}", y2=f"{cy2:.0f}",
                       stroke="#1a1410", stroke_width=f"{rng.uniform(0.8, 2.0):.1f}",
                       opacity=f"{rng.uniform(0.15, 0.30):.2f}", stroke_linecap="round")
                cx1, cy1 = cx2, cy2
        return

    # Market shops — mostly destroyed
    if b.btype == "shop" and b.district == "market":
        if rng.random() < 0.7:
            svg.el("rect", x=f"{x:.1f}", y=f"{y:.1f}",
                   width=f"{w:.1f}", height=f"{h:.1f}",
                   fill=rng.choice([P.rubble, P.ash, "#4a3a28"]),
                   opacity=f"{rng.uniform(0.25, 0.45):.2f}", rx="1")
            return
        _render_market_shop(svg, b, rng, tier)
        svg.el("rect", x=f"{x:.1f}", y=f"{y:.1f}",
               width=f"{w:.1f}", height=f"{h:.1f}",
               fill="#1a1410", opacity="0.35", rx="1")
        return

    rot = b.rotation
    transform = f"rotate({rot:.1f} {b.cx:.1f} {b.cy:.1f})" if abs(rot) > 0.5 else None

    # Determine destruction level (0=scorched, 1=damaged, 2=heavily ruined, 3=rubble)
    destruction = rng.choices([0, 1, 2, 3], weights=[0.08, 0.30, 0.40, 0.22])[0]

    # Darken the ACTUAL building colors for scorched look
    orig_wall_c = b.wall_color or "#d4c8a4"
    orig_roof_c = b.roof_color or "#9a5a3a"
    dark_wall = _darken_hex(orig_wall_c, rng.uniform(0.35, 0.55))
    dark_roof = _darken_hex(orig_roof_c, rng.uniform(0.40, 0.60))

    if destruction == 3:
        # Total rubble — footprint with debris in building's original colors (darkened)
        svg.el("rect", x=f"{x:.1f}", y=f"{y:.1f}",
               width=f"{w:.1f}", height=f"{h:.1f}",
               fill=dark_wall, opacity=f"{rng.uniform(0.18, 0.35):.2f}", rx="1",
               transform=transform)
        # Foundation outline still visible
        svg.el("rect", x=f"{x:.1f}", y=f"{y:.1f}",
               width=f"{w:.1f}", height=f"{h:.1f}",
               fill="none", stroke=_darken_hex(orig_wall_c, 0.6),
               stroke_width="0.8", stroke_dasharray="4 3", rx="0.5",
               opacity="0.25", transform=transform)
        # Scattered chunks
        for _ in range(rng.randint(2, 6)):
            cx2 = x + rng.uniform(0, w)
            cy2 = y + rng.uniform(0, h)
            svg.el("rect", x=f"{cx2:.0f}", y=f"{cy2:.0f}",
                   width=f"{rng.uniform(2, 6):.0f}", height=f"{rng.uniform(1.5, 4):.0f}",
                   fill=rng.choice([dark_wall, dark_roof, P.rubble, "#5a5048"]),
                   opacity=f"{rng.uniform(0.25, 0.50):.2f}", rx="0.5",
                   transform=f"rotate({rng.uniform(0,360):.0f} {cx2+2:.0f} {cy2+1.5:.0f})")
        return

    if destruction == 0:
        # Scorched but mostly intact — render actual building shape with darkened colors
        _render_rect_building(svg, x, y, w, h, dark_roof, dark_wall, transform, rng, b.btype)
        # Light soot overlay
        svg.el("rect", x=f"{x:.1f}", y=f"{y:.1f}",
               width=f"{w:.1f}", height=f"{h:.1f}",
               fill="#1a1410", opacity="0.12", rx="0.5", transform=transform)
        return

    # destruction 1 or 2: Partially destroyed — use actual building colors darkened
    # Base walls (scorched version of original color)
    svg.el("rect", x=f"{x:.1f}", y=f"{y:.1f}", width=f"{w:.1f}", height=f"{h:.1f}",
           fill=dark_wall, stroke=_darken_hex(orig_wall_c, 0.6), stroke_width="0.7", rx="0.5",
           opacity="0.82", transform=transform)

    # Partial roof in darkened original roof color
    inset = min(1.5, w * 0.06, h * 0.06)
    roof_w_frac = rng.uniform(0.3, 0.65) if destruction == 2 else rng.uniform(0.6, 0.9)
    svg.el("rect", x=f"{x+inset:.1f}", y=f"{y+inset:.1f}",
           width=f"{(w-2*inset) * roof_w_frac:.1f}", height=f"{h-2*inset:.1f}",
           fill=dark_roof, opacity="0.72", rx="0.3", transform=transform)

    # Collapsed section
    chunk_x = x + w * rng.uniform(0.4, 0.8)
    chunk_y = y + h * rng.uniform(0.0, 0.4)
    chunk_w = w * rng.uniform(0.15, 0.4)
    chunk_h = h * rng.uniform(0.25, 0.55)
    svg.el("rect", x=f"{chunk_x:.1f}", y=f"{chunk_y:.1f}",
           width=f"{chunk_w:.1f}", height=f"{chunk_h:.1f}",
           fill=P.bg_inner, opacity=f"{rng.uniform(0.45, 0.75):.2f}", rx="0.5",
           transform=transform)

    # Rubble spill around collapsed section
    for _ in range(rng.randint(1, 4)):
        rx2 = chunk_x + rng.uniform(-3, chunk_w + 3)
        ry2 = chunk_y + chunk_h + rng.uniform(-1, 5)
        svg.el("rect", x=f"{rx2:.0f}", y=f"{ry2:.0f}",
               width=f"{rng.uniform(2, 5):.0f}", height=f"{rng.uniform(1, 3):.0f}",
               fill=rng.choice([dark_wall, dark_roof, P.rubble]),
               opacity=f"{rng.uniform(0.20, 0.40):.2f}", rx="0.5")


def _render_broken_walls(svg: SvgCanvas, wall: WallData, tier: str,
                         rng: random.Random, P):
    """Render city walls with breaches and collapsed sections."""
    verts = wall.vertices
    if not verts:
        return

    is_stone = tier in ("capital", "large_town")
    n = len(verts)

    # Choose which wall segments are breached (30-60% of segments)
    breach_rate = rng.uniform(0.30, 0.60)

    for i in range(n):
        v0 = verts[i]
        v1 = verts[(i + 1) % n]

        is_breached = rng.random() < breach_rate

        if is_breached:
            # Draw only partial segment with rubble at breach point
            mid = lerp_pt(v0, v1, rng.uniform(0.3, 0.7))
            # First half of wall segment
            svg.el("line", x1=f"{v0[0]:.0f}", y1=f"{v0[1]:.0f}",
                   x2=f"{mid[0]:.0f}", y2=f"{mid[1]:.0f}",
                   stroke=P.wall_stone, stroke_width="10" if is_stone else "5",
                   stroke_linecap="round", opacity="0.55")
            # Rubble at breach point
            for _ in range(rng.randint(3, 8)):
                rx = mid[0] + rng.uniform(-12, 12)
                ry = mid[1] + rng.uniform(-12, 12)
                svg.el("rect", x=f"{rx:.0f}", y=f"{ry:.0f}",
                       width=f"{rng.uniform(3, 8):.0f}",
                       height=f"{rng.uniform(2, 6):.0f}",
                       fill=rng.choice([P.wall_stone, P.rubble, P.ash]),
                       opacity=f"{rng.uniform(0.25, 0.50):.2f}", rx="0.5",
                       transform=f"rotate({rng.uniform(0,360):.0f} {rx+3:.0f} {ry+2:.0f})")
        else:
            # Intact but scorched wall segment
            svg.el("line", x1=f"{v0[0]:.0f}", y1=f"{v0[1]:.0f}",
                   x2=f"{v1[0]:.0f}", y2=f"{v1[1]:.0f}",
                   stroke=P.wall_dark, stroke_width="10" if is_stone else "5",
                   stroke_linecap="round", opacity="0.65")
            # Damaged crenellations on surviving walls
            if is_stone and rng.random() < 0.5:
                seg_len = math.hypot(v1[0] - v0[0], v1[1] - v0[1])
                for t in range(0, int(seg_len), 12):
                    if rng.random() < 0.5:
                        continue
                    frac = t / seg_len
                    cx = v0[0] + (v1[0] - v0[0]) * frac
                    cy = v0[1] + (v1[1] - v0[1]) * frac
                    svg.el("rect", x=f"{cx - 2:.0f}", y=f"{cy - 2:.0f}",
                           width="4", height="4",
                           fill=P.wall_stone, opacity="0.35")

    # Towers — some collapsed, some standing but damaged
    for tower in wall.towers:
        if rng.random() < 0.4:
            # Collapsed tower — rubble pile
            svg.el("circle", cx=f"{tower[0]:.0f}", cy=f"{tower[1]:.0f}",
                   r="14", fill=P.rubble, opacity="0.35")
            for _ in range(rng.randint(3, 6)):
                tx = tower[0] + rng.uniform(-10, 10)
                ty = tower[1] + rng.uniform(-10, 10)
                svg.el("rect", x=f"{tx:.0f}", y=f"{ty:.0f}",
                       width=f"{rng.uniform(3, 7):.0f}",
                       height=f"{rng.uniform(2, 5):.0f}",
                       fill=P.wall_stone, opacity="0.30", rx="0.5",
                       transform=f"rotate({rng.uniform(0,360):.0f} {tx+3:.0f} {ty+2:.0f})")
        else:
            # Damaged but standing tower
            r = 11 if is_stone else 7
            svg.el("circle", cx=f"{tower[0]:.0f}", cy=f"{tower[1]:.0f}",
                   r=f"{r}", fill=P.tower_fill, stroke=P.wall_dark,
                   stroke_width="2", opacity="0.55")
            svg.el("circle", cx=f"{tower[0]:.0f}", cy=f"{tower[1]:.0f}",
                   r=f"{r - 3}", fill=P.tower_top, opacity="0.40")


def _render_chrome_destroyed(svg: SvgCanvas, cfg: TownConfig, tier: str,
                              W: int, H: int, P, rng: random.Random):
    """Render frame, compass, and 'RUINS OF' title for destroyed variant."""
    # Dark frame
    svg.el("rect", x="8", y="8", width=f"{W-16}", height=f"{H-16}",
           fill="none", stroke=P.text_soft, stroke_width="1.5", rx="3", opacity="0.22")
    svg.el("rect", x="12", y="12", width=f"{W-24}", height=f"{H-24}",
           fill="none", stroke=P.text_soft, stroke_width="0.5", rx="2", opacity="0.14")

    # Corner ornaments (darkened)
    orn_sz = 22
    for (ox, oy, sx, sy) in [(16, 16, 1, 1), (W-16, 16, -1, 1), (16, H-16, 1, -1), (W-16, H-16, -1, -1)]:
        svg.raw(f'<g transform="translate({ox},{oy}) scale({sx},{sy})" opacity="0.20">'
                f'<line x1="0" y1="0" x2="{orn_sz}" y2="0" stroke="{P.text_soft}" stroke-width="1"/>'
                f'<line x1="0" y1="0" x2="0" y2="{orn_sz}" stroke="{P.text_soft}" stroke-width="1"/>'
                f'<line x1="3" y1="3" x2="14" y2="3" stroke="{P.text_soft}" stroke-width="0.5"/>'
                f'<line x1="3" y1="3" x2="3" y2="14" stroke="{P.text_soft}" stroke-width="0.5"/>'
                f'<circle cx="5" cy="5" r="1.5" fill="{P.text_soft}" opacity="0.40"/>'
                f'</g>')

    # Compass rose (faded)
    comp_x, comp_y = W - 60, H - 60
    svg.el("circle", cx=f"{comp_x}", cy=f"{comp_y}", r="24",
           fill="none", stroke=P.text_soft, stroke_width="0.8", opacity="0.20")
    svg.el("line", x1=f"{comp_x}", y1=f"{comp_y+10}", x2=f"{comp_x}", y2=f"{comp_y-14}",
           stroke=P.text_soft, stroke_width="1.4", opacity="0.25")
    svg.raw(f'<polygon points="{comp_x},{comp_y-16} {comp_x-4},{comp_y-9} {comp_x+4},{comp_y-9}"'
            f' fill="{P.text_soft}" opacity="0.25"/>')
    for a, label, dx, dy in [(0, "E", 22, 3), (PI, "W", -22, 3), (PI/2, "S", 0, 24), (-PI/2, "N", 0, -20)]:
        svg.txt(label, x=f"{comp_x+dx}", y=f"{comp_y+dy}",
                text_anchor="middle", fill=P.text_soft,
                font_family="'Cinzel', serif", font_size="8", font_weight="600", opacity="0.25")

    # Title cartouche — "RUINS OF [CITY NAME]"
    title = f"RUINS OF {cfg.name.upper()}"
    title_fs = max(24, int(W * 0.010))
    sub_fs = max(10, int(title_fs * 0.42))
    char_w = title_fs * 0.65
    title_w = max(len(title) * char_w + 80, 280)
    title_h = title_fs * 2.8
    title_x = W / 2 - title_w / 2
    title_y = 14
    # Dark cartouche background
    svg.el("rect", x=f"{title_x:.0f}", y=f"{title_y:.0f}",
           width=f"{title_w:.0f}", height=f"{title_h:.0f}",
           rx="8", fill="#2a2420", stroke=P.text_soft, stroke_width="1.5", opacity="0.92")
    svg.el("rect", x=f"{title_x + 5:.0f}", y=f"{title_y + 5:.0f}",
           width=f"{title_w - 10:.0f}", height=f"{title_h - 10:.0f}",
           rx="5", fill="none", stroke=P.text_soft, stroke_width="0.6", opacity="0.25")
    # Title text — blood red
    svg.txt(title, x=f"{W/2:.0f}", y=f"{title_y + title_h * 0.52:.0f}",
            text_anchor="middle", fill="#a04030",
            font_family="'Cinzel', serif", font_size=f"{title_fs}",
            font_weight="700", letter_spacing=f"{max(2, title_fs // 8)}",
            opacity="0.90")
    # Subtitle — "Destroyed"
    svg.txt("— Destroyed —", x=f"{W/2:.0f}", y=f"{title_y + title_h * 0.80:.0f}",
            text_anchor="middle", fill=P.text_soft,
            font_family="'Spectral', Georgia, serif", font_size=f"{sub_fs}",
            font_style="italic", opacity="0.55")

    # Scale bar
    sb_x, sb_y = W - 110, 40
    svg.el("line", x1=f"{sb_x}", y1=f"{sb_y}", x2=f"{sb_x+65}", y2=f"{sb_y}",
           stroke=P.text, stroke_width="1.5", opacity="0.22")
    for tick in [sb_x, sb_x + 32, sb_x + 65]:
        svg.el("line", x1=f"{tick}", y1=f"{sb_y-3}", x2=f"{tick}", y2=f"{sb_y+3}",
               stroke=P.text, stroke_width="1", opacity="0.22")
    svg.txt("100 ft", x=f"{sb_x+32}", y=f"{sb_y+13}", text_anchor="middle",
            fill=P.text_faint, font_family="'Spectral', Georgia, serif",
            font_size="8", opacity="0.32")


# ════════════════════════════════════════════════════════════════════════
# §12  METADATA & PIPELINE
# ════════════════════════════════════════════════════════════════════════

def extract_town_metadata(town: dict) -> dict:
    cfg: TownConfig = town["cfg"]
    bldgs = []
    for b in town["buildings"]:
        if b.btype == "house":
            continue
        bldgs.append({
            "name": b.name, "type": b.btype, "icon": b.icon,
            "x": round(b.x / cfg.width, 4), "y": round(b.y / cfg.height, 4),
            "w": round(b.w / cfg.width, 4), "h": round(b.h / cfg.height, 4),
        })
    return {
        "name": cfg.name, "seed": cfg.seed,
        "isCapital": cfg.is_capital, "population": cfg.population,
        "canvasWidth": cfg.width, "canvasHeight": cfg.height,
        "buildings": bldgs,
    }


def generate_town(cfg: TownConfig) -> dict:
    seed = int(hashlib.md5(f"{cfg.name}-{cfg.seed}".encode()).hexdigest()[:8], 16)
    rng = random.Random(seed)
    tier = city_tier(cfg)

    W, H = canvas_for_tier(tier)
    cfg = TownConfig(width=W, height=H, seed=cfg.seed, name=cfg.name,
                     is_capital=cfg.is_capital, population=cfg.population,
                     terrain=cfg.terrain)

    cx, cy = W / 2, H / 2
    tp = TIER_PARAMS[tier]
    spatial = SpatialHash(W, H, cell=max(20, min(W, H) // 40))

    # 1. Wall
    wall = build_wall_data(cfg, tier, rng)

    # 2. Water
    water = generate_water(cfg, wall.vertices, spatial, rng, tier)

    # 2b. Place castle FIRST (before roads) so it gets prime space near center
    castle_bldg = _place_castle_early(cfg, wall.vertices, spatial, tier, rng)

    # 3. Roads + plazas + market square (integrated into road system)
    roads, plazas, market_sq_data = generate_roads(cfg, wall, tier, rng, water)

    # 3c. Build market square with shops using the road-bounded space
    market_square = None
    if market_sq_data:
        market_square = _place_market_square_shops(
            market_sq_data, wall.vertices, spatial, rng, tier,
            inner_wall_poly=wall.inner_vertices if wall.inner_vertices else None)

    # Reserve roads + plazas
    _reserve_roads(spatial, roads)
    _reserve_plazas(spatial, plazas)

    # 3b. Inner wall processing — find road crossings and reserve wall in spatial hash
    if wall.inner_vertices:
        wall.inner_gates = _find_inner_wall_gates(wall.inner_vertices, roads)
        _reserve_inner_wall(wall.inner_vertices, spatial, pad=18)

    # 4. Districts — context-aware placement
    district_sectors = build_district_sectors(tier, rng, cx=cx, cy=cy,
                                              water=water,
                                              market_data=market_sq_data)

    # 5. Special buildings (non-castle) + attach gate info to castle
    specials = place_special_buildings(cfg, wall.vertices, spatial, tier, rng, roads)
    if castle_bldg:
        # Now that roads exist, compute which sides face roads
        castle_bldg.gate_sides = _compute_castle_gate_sides(castle_bldg, roads) or ["s"]
        specials.insert(0, castle_bldg)

    # 6. Shops & taverns
    shops = place_shops_and_taverns(roads, wall.vertices, spatial, cx, cy, rng, tier, W, H)

    # 7. Road-facing buildings
    inner_poly = wall.inner_vertices if wall.inner_vertices else None
    road_bldgs = place_buildings_along_roads(roads, wall.vertices, spatial,
                                              district_sectors, cx, cy, rng, tier,
                                              inner_wall_poly=inner_poly)

    # 8. Infill — aggressive multi-pass
    current_count = len(road_bldgs)
    target_total = rng.randint(*tp["house_range"])
    infill_target = max(0, target_total - current_count)
    infill_bldgs = infill_buildings(wall.vertices, spatial, district_sectors,
                                    cx, cy, rng, tier, infill_target, roads,
                                    inner_wall_poly=inner_poly)
    # Second pass with smaller buildings to fill remaining gaps
    remaining = max(0, target_total - current_count - len(infill_bldgs))
    if remaining > 10:
        infill_bldgs2 = infill_buildings_small(wall.vertices, spatial, district_sectors,
                                                cx, cy, rng, tier, remaining,
                                                inner_wall_poly=inner_poly)
        infill_bldgs += infill_bldgs2

    # 9. POIs
    pois = place_pois(wall.vertices, spatial, cx, cy, rng, tier, W, H)

    # 10. Details
    market_shops = market_square.shops if market_square else []
    all_buildings = specials + shops + market_shops + road_bldgs + infill_bldgs + pois
    details = generate_details(cfg, wall.vertices, roads, all_buildings, plazas, spatial, rng, tier)

    # 11. Trees
    trees = generate_trees(cfg, wall.vertices, spatial, tier, rng)

    return {
        "cfg": cfg, "tier": tier, "seed": seed,
        "wall": wall, "roads": roads, "plazas": plazas,
        "market_square": market_square,
        "buildings": all_buildings, "trees": trees, "water": water,
        "details": details,
        "district_sectors": district_sectors,
    }


def main():
    import json as _json
    parser = argparse.ArgumentParser(description="Generate fantasy town map SVG (v3)")
    parser.add_argument("--seed", type=int, default=1)
    parser.add_argument("--name", type=str, default="Thebury")
    parser.add_argument("--capital", action="store_true")
    parser.add_argument("--population", type=int, default=5000)
    parser.add_argument("--terrain", type=str, default="plains")
    parser.add_argument("--output", type=str, default="town.svg")
    args = parser.parse_args()

    cfg = TownConfig(seed=args.seed, name=args.name, is_capital=args.capital,
                     population=args.population, terrain=args.terrain)
    town = generate_town(cfg)
    svg_str = render_town_svg(town)

    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(svg_str)
    print(f"Saved: {out}  ({town['cfg'].width}x{town['cfg'].height}, "
          f"{len(town['buildings'])} buildings, tier={town['tier']}, shape={town['wall'].shape_type})")

    meta = extract_town_metadata(town)
    meta_path = out.with_suffix(".json")
    meta_path.write_text(_json.dumps(meta, indent=2))
    print(f"Metadata: {meta_path}")


if __name__ == "__main__":
    main()
