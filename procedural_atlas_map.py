#!/usr/bin/env python3
"""
Procedural fantasy atlas — heightmap-first pipeline
====================================================
Everything (coast, rivers, lakes, regions) derives from a single elevation field.

Pipeline
--------
1. ``generate_heightmap`` — layered fractal Perlin (4–6 octaves), optional domain warp in sample space.
2. ``apply_domain_warp`` — warps (x,y) with auxiliary noise so coastlines are not radial blobs.
3. Continental structure — 2–4 random centers with radial lifts blended via ``np.maximum``;
   asymmetric edge falloff biases peninsulas / open ocean on one side.
4. ``generate_mountains`` — ridged directional noise along 2–4 random chains + perpendicular detail.
5. Threshold ``sea_level`` → land/water mask; light morphological coast cleanup.
6. ``fill_depressions`` — priority-flood style fill on land DEM → hydrologically valid surface;
   ``lake_depth = filled - original`` marks basin lakes (no random circles).
7. ``compute_flow`` — D8 steepest descent on filled DEM; ``flow_accumulation`` downstream sum.
8. ``generate_rivers`` — threshold on accumulation; one polyline per labeled component from highest-acc pixel downstream.
9. ``extract_contours`` — marching squares on elevation (land only).
10. ``assign_regions`` — multi-source Dijkstra on grid with elevation + ridge costs.
11. ``render_svg`` — parchment / muted sea / soft rivers (width ∝ log flow).

Dependencies: numpy, scipy, scikit-image (coastline extraction), svgwrite, shapely.

Tunables: see ``MapParams`` dataclass and CLI ``--seed``.
"""

from __future__ import annotations

import argparse
import heapq
import math
import random
from dataclasses import dataclass, field
from pathlib import Path
import numpy as np
from scipy import ndimage
from scipy.ndimage import label as cc_label

from shapely.geometry import LineString, MultiPoint

import svgwrite

# -----------------------------------------------------------------------------
# Cardonia atlas reference — labels, settlements, seas (normalized 0–1 layout)
# -----------------------------------------------------------------------------
CARDONIA_REGION_LABELS: list[tuple[str, tuple[float, float], str | None]] = [
    ("Essear", (0.248, 0.368), "(Dotharlum)"),
    ("Belros", (0.668, 0.218), None),
    ("Theanas", (0.838, 0.438), None),
    ("Fara", (0.182, 0.772), None),
    ("Elonia", (0.412, 0.562), None),
    ("Cyrin", (0.612, 0.732), None),
    ("Dravina", (0.798, 0.798), None),
]

CARDONIA_CITIES: list[tuple[str, tuple[float, float], bool, tuple[float, float]]] = [
    ("Goldug", (0.168, 0.288), False, (0, -14)),
    ("Lawklif", (0.292, 0.338), False, (0, -14)),
    ("Rynwood", (0.228, 0.448), False, (0, 16)),
    ("Regnwald", (0.582, 0.152), True, (0, -14)),
    ("Beowick", (0.702, 0.188), False, (0, -14)),
    ("Gerenwalde", (0.768, 0.268), False, (0, -14)),
    ("Ilaes", (0.822, 0.468), True, (0, -14)),
    ("Dremoor", (0.712, 0.412), False, (0, 16)),
    ("Feradell", (0.092, 0.628), False, (0, -14)),
    ("Duskhold", (0.198, 0.762), False, (0, -14)),
    ("Palanor", (0.108, 0.862), False, (0, -14)),
    ("Anora", (0.328, 0.508), False, (0, -14)),
    ("Kronham", (0.432, 0.542), True, (0, -14)),
    ("Wydale", (0.448, 0.688), False, (0, 16)),
    ("Lindel", (0.542, 0.668), True, (0, -14)),
    ("Thebury", (0.642, 0.748), False, (0, 16)),
    ("Zarakyr", (0.588, 0.852), False, (0, -14)),
    ("Loyarn", (0.702, 0.722), False, (0, -14)),
    ("Gildafell", (0.848, 0.868), True, (0, 16)),
]

CARDONIA_SEA_LABELS: list[tuple[str, tuple[float, float], float, int, float]] = [
    ("Sea of Frost", (0.128, 0.068), -8, 34, 0.52),
    ("Sea of Winds", (0.920, 0.180), 6, 34, 0.52),
    ("Sea of Silver", (0.900, 0.600), 72, 30, 0.45),
    ("Sea of Twilight", (0.700, 0.970), -3, 30, 0.42),
    ("Vestmar Gulf", (0.58, 0.36), -4, 24, 0.48),
]

CARDONIA_RIDGES: list[tuple[str, list[tuple[float, float]]]] = [
    ("Ironspine Range", [(0.12, 0.78), (0.16, 0.52), (0.20, 0.32), (0.28, 0.18)]),
    ("Stormcrown Range", [(0.52, 0.10), (0.68, 0.095), (0.82, 0.14), (0.90, 0.22)]),
    ("Ashen Divide", [(0.42, 0.58), (0.55, 0.68), (0.68, 0.76), (0.82, 0.84)]),
]

CARDONIA_LAKE_NAMES: list[str] = ["Lake Asgir", "Lake Ponten", "Lake Aster", "Lunmere", "Lake Petrel"]

# City index pairs for dashed trade-route style lines (reference map)
CARDONIA_ROAD_PAIRS: list[tuple[int, int]] = [
    (0, 1),
    (1, 3),
    (3, 4),
    (4, 5),
    (6, 7),
    (8, 9),
    (11, 12),
    (12, 13),
    (14, 15),
    (10, 8),
    (16, 17),
]


def nearest_land_cell(
    land: np.ndarray, j: float, i: float, max_radius: int = 50
) -> tuple[int, int] | None:
    """Snap a fractional grid position to the nearest land cell (for labels / cities)."""
    H, W = land.shape
    ic = int(np.clip(round(i), 0, H - 1))
    jc = int(np.clip(round(j), 0, W - 1))
    if land[ic, jc]:
        return jc, ic
    for r in range(1, max_radius + 1):
        for di in range(-r, r + 1):
            for dj in range(-r, r + 1):
                if max(abs(di), abs(dj)) != r:
                    continue
                ni, nj = ic + di, jc + dj
                if 0 <= ni < H and 0 <= nj < W and land[ni, nj]:
                    return nj, ni
    return None


# -----------------------------------------------------------------------------
# Neighbors D8: E, SE, S, SW, W, NW, N, NE
# -----------------------------------------------------------------------------
DI = np.array([0, 1, 1, 1, 0, -1, -1, -1], dtype=np.int16)
DJ = np.array([1, 1, 0, -1, -1, -1, 0, 1], dtype=np.int16)
DIST = np.array([1.0, math.sqrt(2), 1.0, math.sqrt(2), 1.0, math.sqrt(2), 1.0, math.sqrt(2)], dtype=np.float64)


@dataclass
class MapParams:
    width_px: float = 2400.0
    height_px: float = 1500.0
    grid_w: int = 260
    grid_h: int = 180
    seed: int = 0
    # Noise / warp
    noise_scale: float = 2.8
    warp_strength: float = 42.0
    octaves: int = 5
    persistence: float = 0.52
    lacunarity: float = 2.05
    # Continent masses
    n_continent_centers: int = 3
    continent_radius_scale: tuple[float, float] = (0.22, 0.38)
    continental_lift: tuple[float, float] = (0.55, 0.95)
    edge_falloff: tuple[float, float] = (0.35, 0.72)
    asymmetry: tuple[float, float] = (-0.45, 0.55)  # biases gulf / peninsula geometry
    # Sea
    land_fraction_target: tuple[float, float] = (0.28, 0.42)
    coast_smooth_iters: int = 1  # closing-only; avoids binary_opening that severs thin land bridges
    # Mountains
    n_ridge_axes: int = 3
    ridge_amplitude: tuple[float, float] = (0.08, 0.18)
    ridge_freq: tuple[float, float] = (0.012, 0.028)
    # Hydrology (on filled DEM)
    river_quantile: tuple[float, float] = (0.985, 0.996)
    min_river_cells: int = 10
    lake_min_depth: float = 0.002
    # Regions
    n_regions: int = 7
    # Contours
    n_contour_levels: int = 7
    contour_alpha: float = 0.17
    # Output
    output_svg: Path = field(default_factory=lambda: Path("generated/procedural_atlas.svg"))
    max_attempts: int = 50


def _rng(seed: int) -> random.Random:
    return random.Random(seed)


def _perm_table(seed: int) -> np.ndarray:
    r = np.random.default_rng(seed & 0xFFFFFFFF)
    p = np.arange(256, dtype=np.int32)
    r.shuffle(p)
    return np.concatenate([p, p])


def _fade(t: float) -> float:
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0)


def _lerp(a: float, b: float, t: float) -> float:
    return a + t * (b - a)


def _grad2(h: int, x: float, y: float) -> float:
    h &= 7
    if h in (0, 4):
        return x + y
    if h in (1, 5):
        return -x + y
    if h in (2, 6):
        return x - y
    return -x - y


def _noise2_single(x: float, y: float, p: np.ndarray) -> float:
    """Single-octave 2D gradient noise ~[-1, 1]."""
    xi = int(math.floor(x)) & 255
    yi = int(math.floor(y)) & 255
    xf = x - math.floor(x)
    yf = y - math.floor(y)
    u = _fade(xf)
    v = _fade(yf)
    aa = int(p[p[xi] + yi])
    ab = int(p[p[xi] + yi + 1])
    ba = int(p[p[xi + 1] + yi])
    bb = int(p[p[xi + 1] + yi + 1])
    x1 = _lerp(_grad2(aa, xf, yf), _grad2(ba, xf - 1.0, yf), u)
    x2 = _lerp(_grad2(ab, xf, yf - 1.0), _grad2(bb, xf - 1.0, yf - 1.0), u)
    return _lerp(x1, x2, v)


class GradientNoise2D:
    """Deterministic 2D gradient noise (Perlin-style) for any platform."""

    def __init__(self, seed: int) -> None:
        self.perm = _perm_table(seed)

    def noise2(self, x: float, y: float) -> float:
        return _noise2_single(x, y, self.perm)

    def fbm(
        self,
        x: float,
        y: float,
        scale: float,
        octaves: int,
        persistence: float,
        lacunarity: float,
        phase: float = 0.0,
    ) -> float:
        amp = 1.0
        freq = scale
        v = 0.0
        norm = 0.0
        for o in range(octaves):
            v += amp * self.noise2(x * freq + phase + o * 17.3, y * freq + phase * 0.7 + o * 11.1)
            norm += amp
            amp *= persistence
            freq *= lacunarity
        return v / max(norm, 1e-9)

    def ridged(
        self,
        x: float,
        y: float,
        scale: float,
        octaves: int,
        persistence: float,
        lacunarity: float,
        phase: float = 0.0,
    ) -> float:
        amp = 0.55
        freq = scale
        s = 0.0
        norm = 0.0
        for o in range(octaves):
            n = self.noise2(x * freq + phase + o * 23.0, y * freq + o * 9.4)
            n = 1.0 - abs(n)
            s += n * amp
            norm += amp
            amp *= persistence
            freq *= lacunarity
        return s / max(norm, 1e-9)


def pnoise_octaves(
    gn: GradientNoise2D,
    x: float,
    y: float,
    scale: float,
    octaves: int,
    persistence: float,
    lacunarity: float,
) -> float:
    return gn.fbm(x, y, scale, octaves, persistence, lacunarity)


def ridged_octaves(
    gn: GradientNoise2D,
    x: float,
    y: float,
    scale: float,
    octaves: int,
    persistence: float,
    lacunarity: float,
    phase: float,
) -> float:
    return gn.ridged(x, y, scale, octaves, persistence, lacunarity, phase=phase)


def apply_domain_warp(
    gn: GradientNoise2D,
    ys: np.ndarray,
    xs: np.ndarray,
    warp_strength: float,
    noise_scale: float,
) -> tuple[np.ndarray, np.ndarray]:
    """Smooth domain warp via coarse FBM grid + bilinear zoom (fast)."""
    H, W = ys.shape
    sh = max(6, H // 5)
    sw = max(6, W // 5)
    wx_c = np.zeros((sh, sw), dtype=np.float64)
    wy_c = np.zeros((sh, sw), dtype=np.float64)
    for yi in range(sh):
        for xi in range(sw):
            iy = min(H - 1, max(0, int((yi + 0.5) * (H - 1) / max(sh - 1, 1))))
            ix = min(W - 1, max(0, int((xi + 0.5) * (W - 1) / max(sw - 1, 1))))
            yf, xf = float(ys[iy, ix]), float(xs[iy, ix])
            wx_c[yi, xi] = gn.fbm(xf * noise_scale * 0.08 + 13, yf * noise_scale * 0.08 + 7, 0.9, 3, 0.5, 2.0)
            wy_c[yi, xi] = gn.fbm(xf * noise_scale * 0.08 + 29, yf * noise_scale * 0.08 + 19, 0.9, 3, 0.5, 2.0)
    zx = W / wx_c.shape[1]
    zy = H / wx_c.shape[0]
    wx = ndimage.zoom(wx_c, (zy, zx), order=1)
    wy = ndimage.zoom(wy_c, (zy, zx), order=1)
    wx = wx[:H, :W]
    wy = wy[:H, :W]
    if wx.shape != (H, W):
        wx = np.pad(wx, ((0, H - wx.shape[0]), (0, W - wx.shape[1])), mode="edge")
        wy = np.pad(wy, ((0, H - wy.shape[0]), (0, W - wy.shape[1])), mode="edge")
    return xs + wx * warp_strength, ys + wy * warp_strength


def generate_heightmap(p: MapParams, rng: random.Random) -> tuple[np.ndarray, dict]:
    """Build raw elevation in [0,1] before sea threshold."""
    H, W = p.grid_h, p.grid_w
    meta: dict = {}
    base = rng.randint(0, 10_000)
    ns = rng.uniform(2.0, 3.6) * p.noise_scale / 3.0
    warp = rng.uniform(0.65, 1.35) * p.warp_strength
    octv = rng.randint(4, 7)
    persist = rng.uniform(0.48, 0.58)
    lac = rng.uniform(1.95, 2.2)

    jj, ii = np.mgrid[0:H, 0:W].astype(np.float64)
    jj = jj / (H - 1) * 1000.0
    ii = ii / (W - 1) * 1000.0

    gn = GradientNoise2D(base)
    wii, wjj = apply_domain_warp(gn, jj, ii, warp, ns)

    elev = np.zeros((H, W), dtype=np.float64)
    for y in range(H):
        for x in range(W):
            elev[y, x] = pnoise_octaves(gn, wjj[y, x], wii[y, x], ns * 0.0012, octv, persist, lac)

    elev = (elev - elev.min()) / (elev.max() - elev.min() + 1e-12)

    # Continental masses: max of radial bumps
    ncent = rng.randint(2, min(5, p.n_continent_centers + 2))
    lifts = []
    for _ in range(ncent):
        cx = rng.uniform(0.15, 0.85) * 1000.0
        cy = rng.uniform(0.15, 0.85) * 1000.0
        r = 1000.0 * rng.uniform(*p.continent_radius_scale)
        g = rng.uniform(*p.continental_lift)
        dx = wii - cx
        dy = wjj - cy
        d = np.sqrt(dx * dx + dy * dy) / r
        bump = np.clip(1.0 - d**rng.uniform(1.4, 2.2), 0.0, 1.0) ** rng.uniform(1.1, 1.8)
        lifts.append(bump * g)
    cont = lifts[0]
    for b in lifts[1:]:
        cont = np.maximum(cont, b)
    elev = 0.45 * elev + 0.55 * np.maximum(elev, cont)

    # Asymmetric edge falloff → ocean bias, peninsulas, gulfs
    asym_x = rng.uniform(*p.asymmetry)
    asym_y = rng.uniform(*p.asymmetry)
    nx = wii / 1000.0 - 0.5 + asym_x * 0.25
    ny = wjj / 1000.0 - 0.5 + asym_y * 0.25
    edge_m = rng.uniform(*p.edge_falloff)
    fall = edge_m * (nx**2 * rng.uniform(0.85, 1.35) + ny**2 * rng.uniform(0.85, 1.35))
    # Push one side more (strong gulf / inland sea tendency)
    side = rng.choice([-1, 1])
    fall = fall + side * rng.uniform(0.04, 0.14) * nx**3
    elev = elev - fall
    elev = np.clip(elev, 0.0, 1.0)

    meta.update(
        dict(
            noise_base=base,
            noise_scale=ns,
            warp=warp,
            octaves=octv,
            n_centers=ncent,
            asym_x=asym_x,
            asym_y=asym_y,
        )
    )
    return elev.astype(np.float64), meta


def generate_mountains(elev: np.ndarray, p: MapParams, rng: random.Random, meta: dict) -> np.ndarray:
    """Add 2–4 directional ridgelines to elevation."""
    H, W = elev.shape
    wii = np.linspace(0, 1000, W, dtype=np.float64)
    wjj = np.linspace(0, 1000, H, dtype=np.float64)
    wii, wjj = np.meshgrid(wii, wjj)
    add = np.zeros_like(elev)
    nax = rng.randint(2, min(5, p.n_ridge_axes + 2))
    gn = GradientNoise2D(int(meta.get("noise_base", 0)) + 400)
    for k in range(nax):
        ang = rng.uniform(0, math.pi)
        c, s = math.cos(ang), math.sin(ang)
        freq = rng.uniform(*p.ridge_freq) * 1000.0
        amp = rng.uniform(*p.ridge_amplitude)
        u = (wii * c + wjj * s) / freq
        v = (-wii * s + wjj * c) / (freq * rng.uniform(1.8, 3.2))
        ridge = np.zeros((H, W), dtype=np.float64)
        ph = float(k * 51 + int(meta.get("noise_base", 0)) * 0.001)
        for y in range(H):
            for x in range(W):
                ridge[y, x] = ridged_octaves(gn, u[y, x], v[y, x], 1.0, 4, 0.5, 2.0, ph)
        add += amp * ridge
    out = np.clip(elev + add, 0.0, 1.0)
    meta["n_ridge_axes"] = nax
    return out


def threshold_sea_level(elev: np.ndarray, p: MapParams, rng: random.Random) -> tuple[np.ndarray, float]:
    """Land where elev > sea_level; target land fraction."""
    lo, hi = p.land_fraction_target
    target = rng.uniform(lo, hi)
    flat = elev.ravel()
    sea_level = float(np.quantile(flat, 1.0 - target))
    land = elev > sea_level
    return land, sea_level


def smooth_coast(land: np.ndarray, iters: int) -> np.ndarray:
    """Closing only — fills tiny coastal gaps. Avoid opening: it erodes thin isthmuses into speckle."""
    m = land.astype(bool)
    struct = np.ones((3, 3), dtype=bool)
    for _ in range(max(0, iters)):
        m = ndimage.binary_closing(m, structure=struct)
    return m


def fill_depressions(dem: np.ndarray, land: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """
    Depression fill on land: ``F = max(D, nanmin(land-neighbors F))``.
    Ocean is omitted from the minimum so min is only over **land** neighbors (true spill surface).
    """
    H, W = dem.shape
    ocean = ~land
    D = dem.astype(np.float64).copy()
    neg = -1e9
    F = D.copy()
    F[ocean] = neg
    coastal = np.zeros((H, W), dtype=bool)
    for i in range(H):
        for j in range(W):
            if not land[i, j]:
                continue
            for k in range(8):
                ni, nj = i + int(DI[k]), j + int(DJ[k])
                if 0 <= ni < H and 0 <= nj < W and ocean[ni, nj]:
                    coastal[i, j] = True
                    break
    max_iter = min(120, max(H, W) + 40)

    def neighbors_min_land(Fold: np.ndarray) -> np.ndarray:
        Pl = np.where(land, Fold, np.nan)
        P = np.pad(Pl, ((1, 1), (1, 1)), constant_values=np.nan)
        stacks = [
            P[0:H, 0:W],
            P[0:H, 1 : W + 1],
            P[0:H, 2 : W + 2],
            P[1 : H + 1, 0:W],
            P[1 : H + 1, 2 : W + 2],
            P[2 : H + 2, 0:W],
            P[2 : H + 2, 1 : W + 1],
            P[2 : H + 2, 2 : W + 2],
        ]
        stacked = np.stack(stacks, axis=0)
        stacked_f = np.where(np.isfinite(stacked), stacked, np.inf)
        nmin = np.min(stacked_f, axis=0)
        return np.where(np.isfinite(nmin), nmin, D)

    for _ in range(max_iter):
        Fold = F
        nmin = neighbors_min_land(Fold)
        Fnew = np.where(coastal, D, np.where(land, np.maximum(D, nmin), neg))
        if float(np.max(np.abs(Fnew - F))) < 1e-7:
            F = Fnew
            break
        F = Fnew
    filled = F.copy()
    filled[ocean] = D[ocean]
    lake_depth = np.maximum(0.0, filled - D)
    lake_depth[~land] = 0.0
    return filled, lake_depth


def compute_flow(filled: np.ndarray, land: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """
    D8 steepest descent. flow_dir: 0..7 or -1 (ocean / flat pour).
    """
    H, W = filled.shape
    fd = np.full((H, W), -1, dtype=np.int8)
    for i in range(1, H - 1):
        for j in range(1, W - 1):
            if not land[i, j]:
                continue
            best_k = -1
            best_slope = 0.0
            hi = filled[i, j]
            for k in range(8):
                ni, nj = i + int(DI[k]), j + int(DJ[k])
                hn = filled[ni, nj]
                slope = (hi - hn) / DIST[k]
                if slope > best_slope + 1e-12:
                    best_slope = slope
                    best_k = k
            if best_k < 0 or best_slope <= 1e-9:
                fd[i, j] = -1
            else:
                fd[i, j] = best_k
    acc = np.ones((H, W), dtype=np.float64)
    order = np.argsort(filled.ravel())
    for idx in reversed(order):
        i, j = divmod(int(idx), W)
        if not land[i, j]:
            continue
        k = int(fd[i, j])
        if k < 0:
            continue
        ni, nj = i + int(DI[k]), j + int(DJ[k])
        acc[ni, nj] += acc[i, j]
    return fd, acc


def _trace_river(
    i0: int,
    j0: int,
    land: np.ndarray,
    fd: np.ndarray,
    acc: np.ndarray,
    H: int,
    W: int,
) -> tuple[list[tuple[float, float]], float] | None:
    path: list[tuple[int, int]] = []
    ci, cj = i0, j0
    seen: set[tuple[int, int]] = set()
    while 0 <= ci < H and 0 <= cj < W and land[ci, cj] and (ci, cj) not in seen:
        seen.add((ci, cj))
        path.append((ci, cj))
        k = int(fd[ci, cj])
        if k < 0:
            break
        ci, cj = ci + int(DI[k]), cj + int(DJ[k])
    if len(path) < 3:
        return None
    flow = float(np.max([acc[i, j] for i, j in path]))
    pts = [(j + 0.5, i + 0.5) for i, j in path]
    return pts, flow


def generate_rivers(
    land: np.ndarray,
    fd: np.ndarray,
    acc: np.ndarray,
    p: MapParams,
    rng: random.Random,
) -> list[tuple[list[tuple[float, float]], float]]:
    acc_land = acc[land]
    if acc_land.size == 0:
        return []
    q0 = rng.uniform(*p.river_quantile)
    H, W = land.shape
    rivers: list[tuple[list[tuple[float, float]], float]] = []

    for dq in (0.0, 0.025, 0.055, 0.1, 0.14, 0.2):
        qv = max(0.78, min(0.999, q0 - dq))
        thr = float(np.quantile(acc_land, qv))
        river_mask = land & (acc >= thr) & (acc >= max(4, p.min_river_cells // 2))
        if not np.any(river_mask):
            continue
        lbl, ncomp = cc_label(river_mask)
        rivers = []
        for comp in range(1, ncomp + 1):
            cells = np.argwhere(lbl == comp)
            if len(cells) < 3:
                continue
            cells_sorted = sorted(cells, key=lambda ij: float(-acc[ij[0], ij[1]]))
            taken: set[tuple[int, int]] = set()
            for ij in cells_sorted[: min(8, len(cells_sorted))]:
                i0, j0 = int(ij[0]), int(ij[1])
                if (i0, j0) in taken:
                    continue
                tr = _trace_river(i0, j0, land, fd, acc, H, W)
                if tr is None:
                    continue
                pts, flow = tr
                for px, py in pts:
                    jj = int(round(px - 0.5))
                    ii = int(round(py - 0.5))
                    if 0 <= ii < H and 0 <= jj < W:
                        taken.add((ii, jj))
                rivers.append((pts, flow))
        if len(rivers) >= 3:
            break
    rivers.sort(key=lambda r: -r[1])
    return rivers[:48]


def generate_lake_mask(lake_depth: np.ndarray, land: np.ndarray, p: MapParams) -> np.ndarray:
    m = (lake_depth >= p.lake_min_depth) & land
    m = ndimage.binary_opening(m, structure=np.ones((3, 3)))
    return m


def marching_squares_segments(
    field: np.ndarray,
    level: float,
    inside: np.ndarray | None = None,
) -> list[tuple[tuple[float, float], tuple[float, float]]]:
    """field shape (H,W), returns segments in (x,y) cell coordinates (j+frac, i+frac)."""
    H, W = field.shape
    segs: list[tuple[tuple[float, float], tuple[float, float]]] = []

    def interp_x(i, j, j2, v00, v10):
        t = (level - v00) / (v10 - v00 + 1e-12)
        t = np.clip(t, 0.0, 1.0)
        return (j + t, i)

    def interp_y(i, j, i2, v0, v1):
        t = (level - v0) / (v1 - v0 + 1e-12)
        t = np.clip(t, 0.0, 1.0)
        return (j, i + t)

    for i in range(H - 1):
        for j in range(W - 1):
            if inside is not None and not (inside[i, j] or inside[i + 1, j] or inside[i, j + 1] or inside[i + 1, j + 1]):
                continue
            v00, v10, v01, v11 = field[i, j], field[i, j + 1], field[i + 1, j], field[i + 1, j + 1]
            if not all(math.isfinite(float(v)) for v in (v00, v10, v01, v11)):
                continue
            s = sum(1 << k for k, v in enumerate([v00, v10, v11, v01]) if v >= level)
            if s in (0, 15):
                continue
            c00, c10, c01, c11 = (j, i), (j + 1, i), (j, i + 1), (j + 1, i + 1)
            if s == 1:
                segs.append((interp_y(i, j, i + 1, v00, v01), interp_x(i, j, j + 1, v00, v10)))
            elif s == 14:
                segs.append((interp_x(i, j, j + 1, v00, v10), interp_y(i, j, i + 1, v00, v01)))
            elif s == 2:
                segs.append((interp_x(i, j, j + 1, v00, v10), interp_y(i, j + 1, i, v01, v11)))
            elif s == 13:
                segs.append((interp_y(i, j + 1, i, v01, v11), interp_x(i, j, j + 1, v00, v10)))
            elif s == 3:
                segs.append((interp_y(i, j, i + 1, v00, v01), interp_y(i, j + 1, i, v01, v11)))
            elif s == 12:
                segs.append((interp_y(i, j + 1, i, v01, v11), interp_y(i, j, i + 1, v00, v01)))
            elif s == 4:
                segs.append((interp_y(i, j + 1, i, v01, v11), interp_x(i + 1, j, j + 1, v10, v11)))
            elif s == 11:
                segs.append((interp_x(i + 1, j, j + 1, v10, v11), interp_y(i, j + 1, i, v01, v11)))
            elif s == 6:
                segs.append((interp_y(i, j, i + 1, v00, v01), interp_x(i + 1, j, j + 1, v10, v11)))
            elif s == 9:
                segs.append((interp_x(i + 1, j, j + 1, v10, v11), interp_y(i, j, i + 1, v00, v01)))
            elif s == 7:
                segs.append((interp_x(i, j, j + 1, v00, v10), interp_x(i + 1, j, j + 1, v10, v11)))
            elif s == 8:
                segs.append((interp_x(i + 1, j, j + 1, v10, v11), interp_y(i, j, i + 1, v00, v01)))
            else:
                # ambiguous 5 / 10 — break using center value
                vc = 0.25 * (v00 + v10 + v01 + v11)
                if s == 5:
                    if vc >= level:
                        segs.append((interp_y(i, j, i + 1, v00, v01), interp_x(i, j, j + 1, v00, v10)))
                        segs.append((interp_y(i, j + 1, i, v01, v11), interp_x(i + 1, j, j + 1, v10, v11)))
                    else:
                        segs.append((interp_x(i, j, j + 1, v00, v10), interp_y(i, j + 1, i, v01, v11)))
                        segs.append((interp_y(i, j, i + 1, v00, v01), interp_x(i + 1, j, j + 1, v10, v11)))
                elif s == 10:
                    if vc >= level:
                        segs.append((interp_x(i, j, j + 1, v00, v10), interp_y(i, j + 1, i, v01, v11)))
                        segs.append((interp_y(i, j, i + 1, v00, v01), interp_x(i + 1, j, j + 1, v10, v11)))
                    else:
                        segs.append((interp_y(i, j, i + 1, v00, v01), interp_x(i, j, j + 1, v00, v10)))
                        segs.append((interp_x(i + 1, j, j + 1, v10, v11), interp_y(i, j + 1, i, v01, v11)))
    return segs


def extract_contours(dem: np.ndarray, land: np.ndarray, p: MapParams) -> list[str]:
    if not np.any(land):
        return []
    base = float(np.min(dem[land]))
    z = np.where(land, dem, base - 0.15)
    zmin = float(np.min(dem[land]))
    zmax = float(np.max(dem[land]))
    if not math.isfinite(zmin) or zmax - zmin < 1e-6:
        return []
    levels = [zmin + (k + 1) * (zmax - zmin) / (p.n_contour_levels + 1) for k in range(p.n_contour_levels)]
    paths: list[str] = []
    for lvl in levels:
        segs = marching_squares_segments(z, lvl, inside=land)
        if not segs:
            continue
        parts = [f"M {a[0]:.2f},{a[1]:.2f} L {b[0]:.2f},{b[1]:.2f}" for a, b in segs]
        paths.append(" ".join(parts))
    return paths


def land_boundary_polylines(land: np.ndarray, min_vertices: int = 10) -> list[list[tuple[float, float]]]:
    """
    Closed coast rings in grid coordinates (column, row).

    Plain marching squares on a solid rectangle produces **no** segments (every 2×2 cell is
    fully inside), so the land fill never drew. Pad with ocean, then use skimage's contour
    tracer for reliable boundaries (continents + islands).
    """
    if not np.any(land):
        return []
    try:
        from skimage.measure import find_contours
    except ImportError as e:
        raise ImportError(
            "land_boundary_polylines requires scikit-image (pip install scikit-image). "
            "It is used for correct coastline extraction from the land mask."
        ) from e

    padded = np.pad(land.astype(np.float64), 1, mode="constant", constant_values=0.0)
    contours = find_contours(padded, 0.5, positive_orientation="high")
    out: list[list[tuple[float, float]]] = []
    for c in contours:
        if len(c) < min_vertices:
            continue
        # c[:,0] = row, c[:,1] = col in padded indices → grid (x,y) = (col-1, row-1)
        ring = [(float(col - 1.0), float(row - 1.0)) for row, col in c]
        if len(ring) >= 3:
            out.append(ring)
    return out


def assign_regions(
    elev: np.ndarray,
    land: np.ndarray,
    p: MapParams,
    rng: random.Random,
    ridge_strength: np.ndarray | None = None,
) -> tuple[np.ndarray, list[tuple[float, float]]]:
    """Multi-source Dijkstra on grid; costs favor following valleys, crossing ridges is expensive."""
    H, W = elev.shape
    rid = np.full((H, W), -1, dtype=np.int32)
    cost = np.full((H, W), np.inf)
    seeds: list[tuple[int, int, int]] = []

    attempts = 0
    while len(seeds) < p.n_regions and attempts < 2000:
        attempts += 1
        j = rng.randint(2, W - 3)
        i = rng.randint(2, H - 3)
        if not land[i, j]:
            continue
        ok = True
        for _, si, sj in seeds:
            if (si - i) ** 2 + (sj - j) ** 2 < (min(H, W) // (p.n_regions + 2)) ** 2:
                ok = False
                break
        if ok:
            seeds.append((len(seeds), i, j))

    pq: list[tuple[float, int, int, int]] = []
    for k, i, j in seeds:
        cost[i, j] = 0.0
        rid[i, j] = k
        heapq.heappush(pq, (0.0, k, i, j))

    rs = ridge_strength if ridge_strength is not None else np.zeros_like(elev)

    while pq:
        c, rk, i, j = heapq.heappop(pq)
        if c > cost[i, j] + 1e-9:
            continue
        for k in range(8):
            ni, nj = i + int(DI[k]), j + int(DJ[k])
            if not (0 <= ni < H and 0 <= nj < W) or not land[ni, nj]:
                continue
            dz = abs(float(elev[ni, nj]) - float(elev[i, j]))
            step = 1.0 + dz * 6.0 + 0.35 * (rs[i, j] + rs[ni, nj])
            nc = c + step * DIST[k]
            if nc < cost[ni, nj]:
                cost[ni, nj] = nc
                rid[ni, nj] = rk
                heapq.heappush(pq, (nc, rk, ni, nj))

    label_pos: list[tuple[float, float]] = []
    for k, i, j in seeds:
        label_pos.append((j + 0.5, i + 0.5))
    return rid, label_pos


def shape_metrics(land: np.ndarray) -> tuple[float, float, float]:
    """Elongation (sqrt of eigenvalue ratio), solidity, land fraction."""
    pts = np.argwhere(land)
    if len(pts) < 50:
        return 1.0, 1.0, 0.0
    cy, cx = pts.mean(axis=0)
    x = pts[:, 1] - cx
    y = pts[:, 0] - cy
    cov = np.cov(np.vstack([x, y]))
    ev = np.linalg.eigvalsh(cov)
    ev = np.sort(np.maximum(ev, 1e-12))
    elong = math.sqrt(ev[1] / ev[0])
    step = max(1, len(pts) // 5000)
    mp = MultiPoint([(float(p[1]), float(p[0])) for p in pts[::step]])
    hull = mp.convex_hull
    solidity = len(pts) / max(hull.area, 1.0) if hull.geom_type == "Polygon" else 0.5
    frac = land.mean()
    return elong, solidity, frac


def water_body_features(land: np.ndarray) -> tuple[int, float]:
    """Largest interior water hole (4-connected) relative to map — gulf / inland sea signal."""
    ocean = ~land
    lbl, n = cc_label(ocean, structure=np.array([[0, 1, 0], [1, 1, 1], [0, 1, 0]]))
    areas = []
    for k in range(1, n + 1):
        areas.append(int(np.sum(lbl == k)))
    areas.sort(reverse=True)
    total = land.size
    if len(areas) < 2:
        return 0, 0.0
    second = areas[1] / total
    return len(areas), second


def validate(
    land: np.ndarray,
    rivers: list,
    lake_mask: np.ndarray,
    prev_fingerprint: np.ndarray | None,
) -> tuple[bool, str]:
    elong, solidity, frac = shape_metrics(land)
    if elong < 1.12:
        return False, "landmass too compact / round — increase asymmetry or warp"
    if solidity > 0.92:
        return False, "land too convex (blob-like)"
    if frac < 0.12 or frac > 0.62:
        return False, "implausible land fraction"
    _, second_ocean_frac = water_body_features(land)
    if second_ocean_frac < 0.002 and elong < 1.35:
        return False, "no secondary water body / gulf signal and low elongation"
    if len(rivers) < 2:
        return False, "river network too sparse"
    if prev_fingerprint is not None:
        a = ndimage.zoom(land.astype(np.float32), (64 / land.shape[0], 64 / land.shape[1]), order=0)
        b = prev_fingerprint
        inter = np.logical_and(a, b).sum()
        union = np.logical_or(a, b).sum()
        iou = inter / max(union, 1)
        if iou > 0.72:
            return False, "too similar to previous landmask (IoU)"
    return True, "ok"


def grid_to_svg_xy(
    x: float,
    y: float,
    W: int,
    H: int,
    width_px: float,
    height_px: float,
) -> tuple[float, float]:
    sx = width_px / W
    sy = height_px / H
    return x * sx, y * sy


@dataclass(frozen=True)
class AtlasStyle:
    """Palette aligned with Cardonia-style fantasy atlas: warm land, cool water, sepia ink."""

    # Sea — muted seafoam / teal (clearly cooler than land)
    sea_a: str = "#b8d4d0"
    sea_b: str = "#7fb0ad"
    sea_c: str = "#5a8f8d"
    sea_d: str = "#4a7a78"
    # Land — light parchment cream → warm tan (high contrast vs sea)
    land_a: str = "#fdf8ee"
    land_b: str = "#f0e6d4"
    land_c: str = "#e2d2b8"
    land_d: str = "#d0bc9a"
    # Coast — dark umber / sepia (reference: brown outline, not grey-green)
    coast_stroke: str = "#3d2f24"
    coast_width: float = 1.35
    coast_halo_stroke: str = "#8b7355"
    coast_halo_width: float = 5.5
    coast_halo_opacity: float = 0.18
    # Rivers — blue-teal, readable on parchment
    river_stroke: str = "#2a4f58"
    river_opacity: float = 0.92
    # Lakes — slightly deeper than open sea
    lake_fill: str = "#4f8788"
    lake_stroke: str = "#2d4a4c"
    lake_opacity: float = 0.98
    # Contours / relief ink
    contour_stroke: str = "#4a3a2c"
    contour_width: float = 0.38
    # Ridge guide lines (decorative, under contours)
    ridge_stroke: str = "#5c4a3a"
    ridge_width: float = 1.05
    ridge_opacity: float = 0.14
    # Internal kingdom boundaries
    border_stroke: str = "#6b5b48"
    border_width: float = 0.85
    border_opacity: float = 0.55
    # Region capitals
    region_fill: str = "#2a2118"
    region_stroke: str = "#faf4e8"
    region_stroke_w: float = 1.35
    region_size: float = 32.0
    region_opacity: float = 0.98
    region_sub_size: float = 15.0
    region_sub_opacity: float = 0.72
    # Sea / water labels
    sea_label_fill: str = "#3d3228"
    sea_label_opacity: float = 0.62
    # Settlements
    city_dot: str = "#1a1410"
    city_name_fill: str = "#2e241c"
    city_cap_size: float = 13.5
    city_size: float = 12.0
    city_opacity: float = 0.9
    # Roads
    road_stroke: str = "#5c4d3e"
    road_opacity: float = 0.55
    road_width: float = 0.75
    # Map title
    title_fill: str = "#3a2e22"
    title_stroke: str = "#faf4e8"
    title_size_ratio: float = 0.048


def _collect_region_boundary_lines(
    region_id: np.ndarray,
    land: np.ndarray,
    W: int,
    H: int,
    width_px: float,
    height_px: float,
) -> list[tuple[tuple[float, float], tuple[float, float]]]:
    """Shared edges between differing region ids → subtle dashed borders (no per-cell fill mud)."""
    lines: list[tuple[tuple[float, float], tuple[float, float]]] = []
    for i in range(H):
        for j in range(W - 1):
            if not (land[i, j] and land[i, j + 1]):
                continue
            r0, r1 = int(region_id[i, j]), int(region_id[i, j + 1])
            if r0 < 0 or r1 < 0 or r0 == r1:
                continue
            p0 = grid_to_svg_xy(j + 1, i, W, H, width_px, height_px)
            p1 = grid_to_svg_xy(j + 1, i + 1, W, H, width_px, height_px)
            lines.append((p0, p1))
    for i in range(H - 1):
        for j in range(W):
            if not (land[i, j] and land[i + 1, j]):
                continue
            r0, r1 = int(region_id[i, j]), int(region_id[i + 1, j])
            if r0 < 0 or r1 < 0 or r0 == r1:
                continue
            p0 = grid_to_svg_xy(j, i + 1, W, H, width_px, height_px)
            p1 = grid_to_svg_xy(j + 1, i + 1, W, H, width_px, height_px)
            lines.append((p0, p1))
    return lines


def render_svg(
    p: MapParams,
    land: np.ndarray,
    elev: np.ndarray,
    filled: np.ndarray,
    lake_mask: np.ndarray,
    rivers: list[tuple[list[tuple[float, float]], float]],
    contours: list[str],
    region_id: np.ndarray,
) -> None:
    W, H = land.shape[1], land.shape[0]
    wpx, hpx = int(p.width_px), int(p.height_px)
    sty = AtlasStyle()
    dwg = svgwrite.Drawing(str(p.output_svg), size=(f"{wpx}px", f"{hpx}px"), profile="full")

    defs = dwg.defs
    defs.add(
        dwg.style(
            """
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Spectral:ital,wght@0,400;0,600;1,400&display=swap');
            """
        )
    )

    lg = dwg.linearGradient(id="seaGrad", x1="0%", y1="0%", x2="100%", y2="100%")
    lg.add_stop_color(offset="0%", color=sty.sea_a)
    lg.add_stop_color(offset="35%", color=sty.sea_b)
    lg.add_stop_color(offset="70%", color=sty.sea_c)
    lg.add_stop_color(offset="100%", color=sty.sea_d)
    defs.add(lg)
    lg2 = dwg.radialGradient(id="landGrad", cx="44%", cy="35%", r="82%")
    lg2.add_stop_color(offset="0%", color=sty.land_a)
    lg2.add_stop_color(offset="40%", color=sty.land_b)
    lg2.add_stop_color(offset="72%", color=sty.land_c)
    lg2.add_stop_color(offset="100%", color=sty.land_d)
    defs.add(lg2)

    root = dwg.add(dwg.g(id="root"))

    g_sea = root.add(dwg.g(id="layer_sea"))
    g_sea.add(dwg.rect(insert=(0, 0), size=(wpx, hpx), fill="url(#seaGrad)"))

    coast_polys = land_boundary_polylines(land)
    g_land = root.add(dwg.g(id="layer_land"))
    for ring in coast_polys:
        if len(ring) < 3:
            continue
        pts = [grid_to_svg_xy(x, y, W, H, p.width_px, p.height_px) for x, y in ring]
        g_land.add(
            dwg.polygon(
                points=pts,
                fill="none",
                stroke=sty.coast_halo_stroke,
                stroke_width=sty.coast_halo_width,
                stroke_linejoin="round",
                opacity=sty.coast_halo_opacity,
            )
        )
        g_land.add(
            dwg.polygon(
                points=pts,
                fill="url(#landGrad)",
                stroke=sty.coast_stroke,
                stroke_width=sty.coast_width,
                stroke_linejoin="round",
                stroke_linecap="round",
                opacity=1.0,
            )
        )

    g_ridge = root.add(dwg.g(id="layer_ridges", fill="none"))
    for rname, rpts in CARDONIA_RIDGES:
        svg_r = [(nx * p.width_px, ny * p.height_px) for nx, ny in rpts]
        if len(svg_r) >= 2:
            g_ridge.add(
                dwg.polyline(
                    points=svg_r,
                    stroke=sty.ridge_stroke,
                    stroke_width=sty.ridge_width,
                    stroke_linejoin="round",
                    opacity=sty.ridge_opacity,
                )
            )
            ls = LineString(svg_r)
            mid = ls.interpolate(0.5, normalized=True)
            mx, my = float(mid.x), float(mid.y)
            ang = math.degrees(math.atan2(svg_r[-1][1] - svg_r[0][1], svg_r[-1][0] - svg_r[0][0]))
            if ang > 90:
                ang -= 180
            if ang < -90:
                ang += 180
            rt = dwg.text(
                rname,
                insert=(mx, my),
                text_anchor="middle",
                font_family="Spectral, Georgia, serif",
                font_size=10,
                font_style="italic",
                fill=sty.ridge_stroke,
                opacity=0.38,
            )
            rt.rotate(ang, center=(mx, my))
            g_ridge.add(rt)

    g_ctr = root.add(
        dwg.g(
            id="layer_contours",
            fill="none",
            opacity=str(p.contour_alpha),
        )
    )
    for d in contours:
        g_ctr.add(
            dwg.path(
                d=d,
                stroke=sty.contour_stroke,
                stroke_width=sty.contour_width,
                stroke_linecap="round",
            )
        )

    g_lake = root.add(dwg.g(id="layer_lakes"))
    ll, nn = cc_label(lake_mask)
    lake_idx = 0
    for k in range(1, nn + 1):
        m = ll == k
        if m.sum() < 30:
            continue
        ys, xs = np.where(m)
        hull = MultiPoint([(float(c), float(r)) for r, c in zip(ys, xs)]).convex_hull
        if hull.geom_type != "Polygon":
            continue
        coords = list(hull.exterior.coords)
        svg_c = [grid_to_svg_xy(x, y, W, H, p.width_px, p.height_px) for x, y in coords]
        cx = sum(p[0] for p in svg_c) / len(svg_c)
        cy = sum(p[1] for p in svg_c) / len(svg_c)
        lname = CARDONIA_LAKE_NAMES[lake_idx % len(CARDONIA_LAKE_NAMES)]
        lake_idx += 1
        g_lake.add(
            dwg.polygon(
                points=svg_c,
                fill=sty.lake_fill,
                stroke=sty.lake_stroke,
                stroke_width=1.15,
                stroke_linejoin="round",
                opacity=sty.lake_opacity,
            )
        )
        g_lake.add(
            dwg.text(
                lname,
                insert=(cx, cy + 4),
                text_anchor="middle",
                font_family="Spectral, Georgia, serif",
                font_size=11,
                font_style="italic",
                fill=sty.sea_label_fill,
                opacity=0.5,
            )
        )

    g_riv = root.add(dwg.g(id="layer_rivers", fill="none"))
    mx_acc = max((r[1] for r in rivers), default=1.0)
    for pts, flow in rivers:
        if len(pts) < 2:
            continue
        svg_pts = [grid_to_svg_xy(x, y, W, H, p.width_px, p.height_px) for x, y in pts]
        sw = 0.95 + 2.6 * math.log1p(flow) / math.log1p(mx_acc)
        sw = float(np.clip(sw, 0.95, 4.2))
        g_riv.add(
            dwg.polyline(
                points=svg_pts,
                stroke=sty.river_stroke,
                stroke_width=sw,
                stroke_linejoin="round",
                stroke_linecap="round",
                opacity=sty.river_opacity,
            )
        )

    g_borders = root.add(
        dwg.g(
            id="layer_region_borders",
            fill="none",
            opacity=str(sty.border_opacity),
        )
    )
    for pa, pb in _collect_region_boundary_lines(region_id, land, W, H, p.width_px, p.height_px):
        g_borders.add(
            dwg.line(
                start=pa,
                end=pb,
                stroke=sty.border_stroke,
                stroke_width=sty.border_width,
                stroke_dasharray="4,5",
                stroke_linecap="round",
            )
        )

    g_sea_lab = root.add(dwg.g(id="layer_sea_labels"))
    for name, (nx, ny), rot_deg, fs, op in CARDONIA_SEA_LABELS:
        x, y = nx * p.width_px, ny * p.height_px
        t = dwg.text(
            name,
            insert=(x, y),
            text_anchor="middle",
            font_family="Spectral, Georgia, serif",
            font_size=fs,
            font_style="italic",
            fill=sty.sea_label_fill,
            opacity=min(op, sty.sea_label_opacity),
        )
        t.rotate(rot_deg, center=(x, y))
        g_sea_lab.add(t)

    g_routes = root.add(dwg.g(id="layer_roads", fill="none"))
    city_px: list[tuple[float, float] | None] = []
    for name, (nx, ny), cap, off in CARDONIA_CITIES:
        jg = nx * (W - 1)
        ig = ny * (H - 1)
        hit = nearest_land_cell(land, jg, ig)
        if hit is None:
            city_px.append(None)
            continue
        jc, ic = hit
        bx, by = grid_to_svg_xy(jc + 0.5, ic + 0.5, W, H, p.width_px, p.height_px)
        city_px.append((bx, by))

    for a, b in CARDONIA_ROAD_PAIRS:
        if a >= len(city_px) or b >= len(city_px):
            continue
        pa, pb = city_px[a], city_px[b]
        if pa is None or pb is None:
            continue
        dist = math.hypot(pa[0] - pb[0], pa[1] - pb[1])
        if dist > p.width_px * 0.42:
            continue
        g_routes.add(
            dwg.line(
                start=pa,
                end=pb,
                stroke=sty.road_stroke,
                stroke_width=sty.road_width,
                stroke_dasharray="3,4",
                stroke_linecap="round",
                opacity=sty.road_opacity,
            )
        )

    g_settle = root.add(dwg.g(id="layer_settlements"))
    for idx, (name, (nx, ny), cap, off) in enumerate(CARDONIA_CITIES):
        if idx >= len(city_px) or city_px[idx] is None:
            continue
        bx, by = city_px[idx]
        ox, oy = off
        g_settle.add(dwg.circle(center=(bx, by), r=2.2, fill=sty.city_dot))
        g_settle.add(
            dwg.text(
                name,
                insert=(bx + ox, by + oy),
                text_anchor="middle",
                font_family="Spectral, Georgia, serif",
                font_size=sty.city_cap_size if cap else sty.city_size,
                font_weight="600" if cap else "normal",
                font_style="italic",
                fill=sty.city_name_fill,
                opacity=sty.city_opacity,
            )
        )

    g_lab = root.add(dwg.g(id="layer_region_labels"))
    for name, (nx, ny), sub in CARDONIA_REGION_LABELS:
        jg, ig = nx * (W - 1), ny * (H - 1)
        hit = nearest_land_cell(land, jg, ig)
        if hit is None:
            continue
        jc, ic = hit
        x, y = grid_to_svg_xy(jc + 0.5, ic + 0.5, W, H, p.width_px, p.height_px)
        g_lab.add(
            dwg.text(
                name.upper(),
                insert=(x, y),
                text_anchor="middle",
                font_family="Cinzel, Georgia, serif",
                font_size=sty.region_size,
                font_weight="bold",
                fill=sty.region_fill,
                stroke=sty.region_stroke,
                stroke_width=sty.region_stroke_w,
                opacity=sty.region_opacity,
            )
        )
        if sub:
            g_lab.add(
                dwg.text(
                    sub,
                    insert=(x, y + 22),
                    text_anchor="middle",
                    font_family="Spectral, Georgia, serif",
                    font_size=sty.region_sub_size,
                    font_style="italic",
                    fill=sty.region_fill,
                    opacity=sty.region_sub_opacity,
                )
            )

    root.add(
        dwg.text(
            "CARDONIA",
            insert=(p.width_px * 0.82, p.height_px * 0.93),
            text_anchor="middle",
            font_family="Cinzel, Georgia, serif",
            font_size=int(p.width_px * sty.title_size_ratio),
            font_weight="bold",
            fill=sty.title_fill,
            stroke=sty.title_stroke,
            stroke_width=2.0,
            opacity=0.88,
        )
    )

    # Subtle warm veil (svgwrite-safe alternative to feTurbulence grain).
    veil = root.add(dwg.g(id="paper_veil", opacity="0.02"))
    veil.add(
        dwg.rect(
            insert=(0, 0),
            size=(p.width_px, p.height_px),
            fill="#6b5b4f",
        )
    )

    p.output_svg.parent.mkdir(parents=True, exist_ok=True)
    dwg.save()


def run_generation(p: MapParams, rng: random.Random, prev_fp: np.ndarray | None) -> tuple[bool, str, np.ndarray | None]:
    elev, meta = generate_heightmap(p, rng)
    elev = generate_mountains(elev, p, rng, meta)

    land, sea_level = threshold_sea_level(elev, p, rng)
    land = smooth_coast(land, p.coast_smooth_iters)
    elev_land = elev.copy()
    elev_land[~land] = sea_level

    filled, lake_depth = fill_depressions(elev_land, land)
    rs = np.random.default_rng(rng.randint(0, 2**31 - 1))
    filled_flow = filled + rs.normal(0.0, 1e-7, filled.shape)
    fd, acc = compute_flow(filled_flow, land)
    rivers = generate_rivers(land, fd, acc, p, rng)
    lake_mask = generate_lake_mask(lake_depth, land, p)

    ridge_hint = np.maximum(0.0, elev - filled)

    region_id, _label_xy = assign_regions(elev, land, p, rng, ridge_strength=ridge_hint * 8.0)
    contours = extract_contours(filled, land, p)

    fp = ndimage.zoom(land.astype(np.float32), (64 / land.shape[0], 64 / land.shape[1]), order=0)
    ok, msg = validate(land, rivers, lake_mask, prev_fp)
    if ok:
        render_svg(p, land, elev, filled, lake_mask, rivers, contours, region_id)
    return ok, msg, fp


def main() -> int:
    ap = argparse.ArgumentParser(description="Heightmap-first procedural fantasy atlas (SVG).")
    ap.add_argument("--seed", type=int, default=None)
    ap.add_argument("--output", type=Path, default=Path("generated/procedural_atlas.svg"))
    ap.add_argument("--attempts", type=int, default=50)
    ap.add_argument("--width", type=float, default=2400)
    ap.add_argument("--height", type=float, default=1500)
    args = ap.parse_args()
    seed = args.seed if args.seed is not None else random.randrange(1_000_000_000)
    p = MapParams(
        seed=seed,
        output_svg=args.output,
        max_attempts=args.attempts,
        width_px=args.width,
        height_px=args.height,
    )
    prev: np.ndarray | None = None
    last_msg = ""
    for att in range(p.max_attempts):
        rng = random.Random(seed + att * 9973)
        ok, msg, fp = run_generation(p, rng, prev)
        last_msg = msg
        if ok:
            print(f"Saved {p.output_svg} (seed={seed}, attempt={att + 1})")
            return 0
        prev = fp
    print(f"Failed after {p.max_attempts} attempts: {last_msg}")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
