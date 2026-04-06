from __future__ import annotations

import argparse
import heapq
import math
import random
import statistics
from collections import deque
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, Sequence
from xml.sax.saxutils import escape


Point = tuple[float, float]
Rect = tuple[float, float, float, float]


@dataclass(frozen=True)
class AtlasConfig:
    width: int = 2800
    height: int = 1800
    seed: int = 23
    grid_step: int = 10
    coastline_step: float = 28.0
    coastline_roughness: float = 24.0
    island_roughness: float = 14.0
    ridge_jitter: float = 10.0
    max_lakes: int = 3
    max_attempts: int = 56
    contour_opacity: float = 0.40
    show_city_labels: bool = True
    show_river_labels: bool = True
    # Painterly peak glyphs on ridges; False = ridge lines only (calmer, reference-style).
    mountain_peaks: bool = False
    output_svg: Path = field(default_factory=lambda: Path(__file__).resolve().parent / "generated" / "fantasy_atlas.svg")
    output_png: Path | None = None


@dataclass(frozen=True)
class Palette:
    sea: str = "#6e9e96"          # richer teal sea for more contrast
    sea_deep: str = "#5a8a82"
    sea_light: str = "#8ab8ae"
    land: str = "#e8daba"         # warm golden parchment
    land_shade: str = "#c4a870"
    land_highlight: str = "#f2ead0"
    coast_outer: str = "#7ea8a0"
    coast_inner: str = "#3e6860"  # darker coastline ink for definition
    coast_glow: str = "#90b8ae"
    border: str = "#8a7050"       # stronger warm brown borders
    river: str = "#3e5030"
    river_label: str = "#7d8965"
    lake: str = "#78a8a0"         # deeper lake blue-green
    mountain: str = "#7a6e54"     # richer brown for peaks
    mountain_fill: str = "#a89868"
    mountain_shadow: str = "#5a5040"
    mountain_snow: str = "#e8e4d4"
    contour: str = "#9a8a68"      # slightly warmer contour
    text: str = "#3a2e10"         # darker text for legibility
    text_soft: str = "#5a4e2a"
    text_sea: str = "#4a6a5a"     # richer sea label color
    paper_line: str = "#8a7e5e"
    paper_light: str = "#ece6d0"
    paper_bg: str = "#dcd6c0"     # slightly cooler parchment for contrast
    city: str = "#3a2e10"
    city_ring: str = "#ddd8c0"
    title: str = "#6a5820"        # richer gold for title


@dataclass(frozen=True)
class CityTemplate:
    name: str
    target: Point
    capital: bool = False
    label_offset: Point = (0.0, 0.0)


@dataclass(frozen=True)
class RegionTemplate:
    key: str
    name: str
    fill: str
    seed: Point
    label_hint: Point
    cities: Sequence[CityTemplate]
    subtitle: str = ""


@dataclass(frozen=True)
class IslandTemplate:
    ring: Sequence[Point]
    roughness_scale: float = 1.0


@dataclass(frozen=True)
class RidgeTemplate:
    name: str
    points: Sequence[Point]
    label_xy: Point
    label_rotation: float
    strength: float
    influence: float
    peak_stride: float


@dataclass(frozen=True)
class BasinTemplate:
    name: str
    center: Point
    radius: float
    depth: float
    label_shift: Point = (0.0, 18.0)


@dataclass(frozen=True)
class SeaLabelSpec:
    name: str
    xy: Point
    rotation: float
    size: int
    opacity: float


@dataclass
class MountainRange:
    name: str
    points: list[Point]
    label_xy: Point
    label_rotation: float
    strength: float
    influence: float
    peak_stride: float


@dataclass
class LakeBody:
    name: str
    polygon: list[Point]
    label_xy: Point
    center: Point
    radius: float
    outlet_idx: int | None


@dataclass
class RiverPath:
    points: list[Point]
    width: float
    cells: set[int]
    grid_cells_len: int = 0
    widths: list[float] | None = None  # per-point width for tapered rendering
    channel_poly: list[Point] | None = None  # closed polygon outlining the water channel


@dataclass
class RegionModel:
    template: RegionTemplate
    cells: list[int]
    label_xy: Point
    cities: list[CityTemplate]


@dataclass
class AtlasScene:
    seed: int
    mainland: list[Point]
    islands: list[list[Point]]
    mountain_ranges: list[MountainRange]
    rivers: list[RiverPath]
    lakes: list[LakeBody]
    regions: list[RegionModel]
    grid: TerrainGrid
    forest_cells: list[int] = field(default_factory=list)
    pois: list[tuple[Point, str, str]] = field(default_factory=list)  # (position, name, type)


PALETTE = Palette()


# Broad continental landmass with a deep northern gulf between Essear and Belros,
# an irregular east coast forming the Theanas peninsula, and a wide southern shore.
# Traced from the Cardonia reference image — the continent fills ~80% of the canvas.
BASE_MAINLAND: Sequence[Point] = [
    # SW coast (Palanor → Fara)
    (0.072, 0.860), (0.058, 0.780), (0.048, 0.680), (0.052, 0.580),
    # West coast heading north
    (0.062, 0.480), (0.072, 0.380), (0.092, 0.300),
    # NW bulge (Essear peninsula)
    (0.118, 0.222), (0.168, 0.162), (0.232, 0.118), (0.310, 0.098),
    # North coast approaching the deep gulf
    (0.365, 0.108), (0.388, 0.135),
    # Northern gulf indent (Vestmar Gulf) — cuts south between Essear and Belros
    (0.395, 0.178), (0.400, 0.242), (0.412, 0.312),
    (0.428, 0.378), (0.448, 0.418), (0.465, 0.408),
    # Gulf wraps back north toward Belros
    (0.482, 0.372), (0.498, 0.305), (0.510, 0.238),
    (0.522, 0.178), (0.538, 0.135),
    # North coast (Belros)
    (0.568, 0.105), (0.618, 0.092), (0.672, 0.108),
    # NE coast approaching Theanas
    (0.738, 0.128), (0.798, 0.158), (0.848, 0.202),
    # Theanas peninsula — bulges NE then comes back
    (0.895, 0.258), (0.918, 0.318), (0.908, 0.375),
    (0.878, 0.418), (0.838, 0.442),
    # East coast dips in between Theanas and Dravina
    (0.802, 0.455), (0.782, 0.488), (0.778, 0.535),
    # Coast swings back east for Dravina
    (0.792, 0.588), (0.818, 0.648), (0.848, 0.708),
    (0.862, 0.768), (0.855, 0.828),
    # SE coast rounding toward south
    (0.828, 0.868), (0.778, 0.895), (0.718, 0.908),
    # South coast (Sea of Twilight)
    (0.648, 0.912), (0.578, 0.905), (0.518, 0.888),
    # Pera Bay indent
    (0.468, 0.898), (0.428, 0.912), (0.388, 0.905),
    # SW coast back to start
    (0.328, 0.888), (0.262, 0.872), (0.188, 0.862),
    (0.128, 0.858),
]


ISLAND_TEMPLATES: Sequence[IslandTemplate] = [
    # NW island (off Essear coast)
    IslandTemplate(((0.042, 0.232), (0.072, 0.168), (0.118, 0.152), (0.148, 0.198),
                     (0.132, 0.262), (0.082, 0.272), (0.050, 0.256)), 1.0),
    # N island (above gulf)
    IslandTemplate(((0.448, 0.052), (0.482, 0.038), (0.512, 0.058), (0.508, 0.092),
                     (0.472, 0.098), (0.445, 0.078)), 0.8),
    # NE island (off Theanas)
    IslandTemplate(((0.912, 0.138), (0.948, 0.118), (0.972, 0.148), (0.968, 0.198),
                     (0.938, 0.222), (0.908, 0.202), (0.902, 0.168)), 0.9),
    # SE island (off Dravina)
    IslandTemplate(((0.898, 0.738), (0.932, 0.708), (0.962, 0.738), (0.958, 0.788),
                     (0.928, 0.812), (0.895, 0.792), (0.888, 0.762)), 0.9),
    # SW island (off Fara)
    IslandTemplate(((0.028, 0.712), (0.062, 0.672), (0.098, 0.692), (0.102, 0.742),
                     (0.072, 0.772), (0.035, 0.752)), 0.9),
    # ── Small islets scattered around the continent ──
    # Tiny islet NW of Essear
    IslandTemplate(((0.032, 0.148), (0.048, 0.132), (0.068, 0.142), (0.062, 0.168),
                     (0.042, 0.172)), 0.5),
    # Islet east of Theanas
    IslandTemplate(((0.958, 0.328), (0.975, 0.315), (0.988, 0.335), (0.982, 0.358),
                     (0.962, 0.352)), 0.4),
    # Tiny islet south
    IslandTemplate(((0.318, 0.952), (0.332, 0.940), (0.348, 0.948), (0.342, 0.968),
                     (0.325, 0.966)), 0.4),
    # Islet off SE coast
    IslandTemplate(((0.838, 0.862), (0.852, 0.848), (0.868, 0.858), (0.862, 0.878),
                     (0.845, 0.880)), 0.5),
    # Small islet far west of Fara
    IslandTemplate(((0.015, 0.598), (0.028, 0.582), (0.045, 0.592), (0.040, 0.615),
                     (0.025, 0.612)), 0.4),
    # Tiny islet south-central
    IslandTemplate(((0.588, 0.938), (0.602, 0.928), (0.618, 0.938), (0.612, 0.955),
                     (0.595, 0.952)), 0.4),
    # Tiny speck off NE
    IslandTemplate(((0.878, 0.068), (0.890, 0.058), (0.902, 0.068), (0.898, 0.082),
                     (0.884, 0.080)), 0.3),
    # ── Additional coastal islets ──
    # Speck off north coast
    IslandTemplate(((0.285, 0.028), (0.298, 0.018), (0.312, 0.028), (0.308, 0.045),
                     (0.292, 0.042)), 0.3),
    # Islet off NW peninsula
    IslandTemplate(((0.068, 0.352), (0.082, 0.338), (0.098, 0.348), (0.092, 0.368),
                     (0.075, 0.365)), 0.4),
    # Speck off west coast mid
    IslandTemplate(((0.008, 0.435), (0.022, 0.422), (0.038, 0.432), (0.032, 0.452),
                     (0.015, 0.448)), 0.3),
    # Tiny islet south of Dravina
    IslandTemplate(((0.758, 0.928), (0.772, 0.918), (0.788, 0.928), (0.782, 0.945),
                     (0.765, 0.942)), 0.35),
    # Speck between NE island and mainland
    IslandTemplate(((0.848, 0.178), (0.862, 0.168), (0.878, 0.178), (0.872, 0.195),
                     (0.855, 0.192)), 0.3),
    # Tiny islet off south coast
    IslandTemplate(((0.438, 0.948), (0.452, 0.938), (0.468, 0.948), (0.462, 0.965),
                     (0.445, 0.962)), 0.3),
    # Speck far SE
    IslandTemplate(((0.928, 0.588), (0.942, 0.575), (0.958, 0.585), (0.952, 0.605),
                     (0.935, 0.602)), 0.35),
    # Small islet off SW coast
    IslandTemplate(((0.048, 0.862), (0.062, 0.848), (0.078, 0.858), (0.072, 0.878),
                     (0.055, 0.875)), 0.4),
    # Tiny speck north of gulf
    IslandTemplate(((0.528, 0.022), (0.540, 0.012), (0.555, 0.022), (0.548, 0.038),
                     (0.535, 0.035)), 0.3),
]


REGIONS: Sequence[RegionTemplate] = [
    RegionTemplate("essear", "Essear", "#c8c4a0", (0.220, 0.280), (0.240, 0.295), (
        CityTemplate("Goldug", (0.138, 0.260), True, (-24.0, -8.0)),
        CityTemplate("Lawklif", (0.332, 0.330), False, (0.0, -24.0)),
        CityTemplate("Rynwood", (0.258, 0.420), False, (0.0, 28.0)),
    ), subtitle="(Dotharlum)"),
    RegionTemplate("beltros", "Belros", "#d8cca8", (0.638, 0.220), (0.628, 0.235), (
        CityTemplate("Regnwald", (0.575, 0.158), True, (0.0, -24.0)),
        CityTemplate("Beowick", (0.682, 0.198), False, (0.0, -24.0)),
        CityTemplate("Gerenwalde", (0.748, 0.292), False, (22.0, -8.0)),
    )),
    RegionTemplate("theanas", "Theanas", "#bcc4a8", (0.848, 0.368), (0.845, 0.362), (
        CityTemplate("Ilaes", (0.832, 0.308), True, (22.0, -8.0)),
        CityTemplate("Dremoor", (0.548, 0.408), False, (0.0, 28.0)),
    )),
    RegionTemplate("fara", "Fara", "#d4c8a4", (0.148, 0.680), (0.158, 0.688), (
        CityTemplate("Feradell", (0.098, 0.568), False, (-24.0, -8.0)),
        CityTemplate("Duskhold", (0.188, 0.708), True, (0.0, -24.0)),
        CityTemplate("Palanor", (0.108, 0.832), False, (-24.0, -8.0)),
    )),
    RegionTemplate("elonia", "Elonia", "#c4c8b0", (0.368, 0.588), (0.378, 0.595), (
        CityTemplate("Anora", (0.298, 0.548), False, (0.0, -24.0)),
        CityTemplate("Kronham", (0.408, 0.528), True, (0.0, -24.0)),
        CityTemplate("Wydale", (0.388, 0.728), False, (0.0, 28.0)),
    )),
    RegionTemplate("cyrin", "Cyrin", "#dcd0b0", (0.578, 0.638), (0.575, 0.645), (
        CityTemplate("Freehold", (0.508, 0.348), False, (0.0, -24.0)),
        CityTemplate("Lindel", (0.548, 0.618), True, (0.0, -24.0)),
        CityTemplate("Thebury", (0.598, 0.718), False, (0.0, 28.0)),
        CityTemplate("Zarakyr", (0.542, 0.838), False, (0.0, -24.0)),
    )),
    RegionTemplate("dravina", "Dravina", "#c0bc9c", (0.778, 0.678), (0.768, 0.668), (
        CityTemplate("Loyarn", (0.718, 0.618), False, (0.0, -24.0)),
        CityTemplate("Gildafell", (0.808, 0.778), True, (22.0, -8.0)),
    )),
]


# Name pools for procedural generation
REGION_NAME_POOL = [
    "Essear", "Belros", "Theanas", "Fara", "Elonia", "Cyrin", "Dravina",
    "Valdheim", "Korrath", "Tethys", "Ashmark", "Selvane", "Dremora", "Wyndell",
    "Caeloth", "Brynmar", "Tarnis", "Ondara", "Kelvor", "Mistvale", "Drakkos",
]

CITY_NAME_POOL = [
    "Goldug", "Regnwald", "Beowick", "Gerenwalde", "Ilaes", "Feradell", "Palanor",
    "Duskhold", "Anora", "Kronham", "Wydale", "Lindel", "Thebury", "Zarakyr",
    "Lawklif", "Rynwood", "Dremoor", "Loyarn", "Gildafell", "Freehold",
    "Borist", "Odrin", "Thornwall", "Ashwick", "Ravenmere", "Stormgate",
    "Ironholt", "Greenhollow", "Whitevale", "Deepwatch", "Foxbury", "Dunmore",
    "Harrowfield", "Millcross", "Copperside", "Brightmoor", "Kingsbridge",
]

SUBTITLE_POOL = [
    "(Dotharlum)", "(Valdros)", "(Caelindor)", "(Thornemark)", "",
    "(Ashenmoor)", "(Greycliffe)", "", "", "",
]

RIDGE_NAME_POOL = [
    "Ironspine Range", "Stormcrown Range", "Ashen Divide",
    "Frostpeak Mountains", "Greymist Heights", "Dragon's Spine",
    "Thundercrest Range", "Silvervein Ridge", "Ebonwall Mountains",
]

LAKE_NAME_POOL = [
    "Lake Ponter", "Lake Aegir", "Lunmere", "Crystal Lake", "Lake Varos",
    "Stillmere", "Lake Ashveil", "Mirrordeep", "Lake Thornwell", "Shadowmere",
    "Lake Ironfrost", "Dimwater", "Lake Silvane", "Mistmere", "Lake Orvane",
]

SEA_NAME_POOL = [
    "Sea of Frost", "Sea of Winds", "Sea of Silver", "Sea of Twilight",
    "Sea of Storms", "Sea of Ash", "Sea of Dreams", "Sea of Embers",
    "Pale Sea", "Iron Sea", "Jade Sea", "Crimson Gulf",
]

MAP_NAME_POOL = [
    "CARDONIA", "VAELTHYR", "ALDENMOOR", "DRAKHEIM", "ESTEROS",
    "THALINDRA", "KORATHIS", "MYRANDEL", "SOLMERE", "ASHENDAL",
]

DESCRIPTOR_POOL = [
    "Kingdom of", "The Free Marches of", "Duchy of", "The Wilds of",
    "Principality of", "Realm of", "The Dominion of", "Borderlands of",
]

POI_PREFIX_POOL = [
    "Ruins of", "Tower of", "Shrine of", "Temple of", "Fortress of",
    "The Lost", "Ancient",
]

POI_SUFFIX_POOL = [
    "Thornfall", "Ironwatch", "Stormhold", "Whispergate", "Duskmourn",
    "Frostpeak", "Shadowmere", "Goldenveil", "Embercrest", "Silentwood",
]

POI_TYPE_POOL = [
    "Ruins", "Fortress", "Temple", "Tower", "Mine", "Shrine",
]


# Three spines: western backbone through Essear/Fara, northern arc across Belros, SE diagonal into Dravina.
RIDGE_TEMPLATES: Sequence[RidgeTemplate] = [
    RidgeTemplate("Ironspine Range", ((0.10, 0.75), (0.14, 0.55), (0.18, 0.38), (0.24, 0.22)), (0.18, 0.46), -18, 0.99, 70, 68),
    RidgeTemplate("Stormcrown Range", ((0.56, 0.12), (0.68, 0.11), (0.80, 0.16), (0.88, 0.24)), (0.72, 0.14), 6, 1.0, 74, 64),
    RidgeTemplate("Ashen Divide", ((0.42, 0.52), (0.54, 0.60), (0.66, 0.68), (0.80, 0.78)), (0.60, 0.66), 28, 0.92, 66, 62),
]


BASINS: Sequence[BasinTemplate] = [
    BasinTemplate("Lake Ponter", (0.34, 0.380), 0.052, 0.30, (0.0, 28.0)),
    BasinTemplate("Lake Aegir", (0.58, 0.480), 0.055, 0.27, (0.0, 24.0)),
    BasinTemplate("Lunmere", (0.16, 0.620), 0.036, 0.22, (0.0, 20.0)),
]


@dataclass(frozen=True)
class RiverRouteTemplate:
    """Hand-crafted river waypoint chain matching the reference geography.

    waypoints: fractional (x, y) coordinates — Catmull-Rom interpolated
    width_tier: 1.0 = trunk, 0.7 = major branch, 0.45 = minor branch
    lake_source: if non-empty, the river begins at this lake's outlet
    """
    name: str
    waypoints: tuple[Point, ...]
    width_tier: float
    lake_source: str = ""


# ── River routes traced from the Cardonia reference ─────────────────────
# Each river is a deliberate path that doesn't cross any other.
RIVER_ROUTES: Sequence[RiverRouteTemplate] = [
    # River Dalsa — from NW mountains, sweeps south through Fara to SW coast
    RiverRouteTemplate(
        "River Dalsa",
        ((0.26, 0.32), (0.22, 0.40), (0.19, 0.50), (0.16, 0.58),
         (0.13, 0.66), (0.10, 0.74), (0.08, 0.82)),
        width_tier=0.85,
    ),
    # River Elane — main trunk from Lake Ponter, east across the center
    RiverRouteTemplate(
        "River Elane",
        ((0.37, 0.40), (0.42, 0.43), (0.48, 0.45), (0.55, 0.47),
         (0.62, 0.50), (0.70, 0.53), (0.77, 0.55), (0.82, 0.57)),
        width_tier=1.0,
        lake_source="Lake Ponter",
    ),
    # Branch from River Elane going SE toward Dravina coast
    RiverRouteTemplate(
        "Dravina Branch",
        ((0.64, 0.52), (0.68, 0.60), (0.71, 0.68), (0.74, 0.76),
         (0.77, 0.84), (0.79, 0.90)),
        width_tier=0.60,
    ),
    # River from Lake Aegir flowing south toward Pera Bay
    RiverRouteTemplate(
        "Aegir River",
        ((0.58, 0.53), (0.54, 0.62), (0.51, 0.70), (0.49, 0.78),
         (0.47, 0.86), (0.46, 0.91)),
        width_tier=0.75,
        lake_source="Lake Aegir",
    ),
    # Lunmere outflow — flows south-east from the western lake
    RiverRouteTemplate(
        "Lunmere Run",
        ((0.18, 0.66), (0.23, 0.73), (0.28, 0.79), (0.33, 0.85),
         (0.37, 0.90)),
        width_tier=0.50,
        lake_source="Lunmere",
    ),
    # Small branch from center area going toward Selvane/east
    RiverRouteTemplate(
        "Eastern Branch",
        ((0.68, 0.51), (0.73, 0.46), (0.78, 0.43), (0.82, 0.42)),
        width_tier=0.40,
    ),
]


SEA_LABELS: Sequence[SeaLabelSpec] = [
    SeaLabelSpec("Sea of Frost", (0.128, 0.058), -8, 38, 0.48),
    SeaLabelSpec("Sea of Winds", (0.938, 0.098), 6, 38, 0.48),
    SeaLabelSpec("Sea of Silver", (0.935, 0.538), 78, 34, 0.42),
    SeaLabelSpec("Sea of Twilight", (0.668, 0.968), -3, 34, 0.40),
    SeaLabelSpec("Pera Bay", (0.448, 0.948), -3, 22, 0.36),
]


@dataclass(frozen=True)
class RiverLabelSpec:
    name: str
    ratio: float       # position along the river (0-1)
    river_index: int   # which river to label
    size: int = 13
    opacity: float = 0.45


RIVER_LABELS: Sequence[RiverLabelSpec] = [
    RiverLabelSpec("River Dolan", 0.35, 0, 13, 0.42),
    RiverLabelSpec("River Slane", 0.40, 1, 13, 0.42),
    RiverLabelSpec("River Elane", 0.45, 2, 12, 0.38),
]


class SvgCanvas:
    def __init__(self, width: int, height: int) -> None:
        self.width = width
        self.height = height
        self.parts: list[str] = []
        self.defs: list[str] = []

    def add_def(self, raw: str) -> None:
        self.defs.append(raw)

    def element(self, tag: str, **attrs: object) -> None:
        self.parts.append(f"<{tag}{self._attrs(attrs)} />")

    def text(self, value: str, **attrs: object) -> None:
        self.parts.append(f"<text{self._attrs(attrs)}>{escape(value)}</text>")

    def group_open(self, **attrs: object) -> None:
        self.parts.append(f"<g{self._attrs(attrs)}>")

    def raw(self, markup: str) -> None:
        self.parts.append(markup)

    def group_close(self) -> None:
        self.parts.append("</g>")

    def render(self) -> str:
        defs_markup = f"<defs>{''.join(self.defs)}</defs>" if self.defs else ""
        return (
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.width}" height="{self.height}" '
            f'viewBox="0 0 {self.width} {self.height}" role="img" aria-label="Generated fantasy atlas">'
            f"{defs_markup}{''.join(self.parts)}</svg>"
        )

    @staticmethod
    def _attrs(attrs: dict[str, object]) -> str:
        rendered = []
        for key, value in attrs.items():
            if value is None:
                continue
            attr_name = key.replace("_", "-")
            attr_value = escape(str(value), {'"': "&quot;"})
            rendered.append(f' {attr_name}="{attr_value}"')
        return "".join(rendered)


class TerrainGrid:
    def __init__(self, cfg: AtlasConfig) -> None:
        self.step = cfg.grid_step
        self.cols = math.ceil(cfg.width / cfg.grid_step)
        self.rows = math.ceil(cfg.height / cfg.grid_step)
        self.size = self.cols * self.rows
        self.land = [False] * self.size
        self.coast_distance = [0] * self.size
        self.ridge_strength = [0.0] * self.size
        self.elevation = [0.0] * self.size
        self.owner = [-1] * self.size
        self.flow_direction: list[int] = [-1] * self.size   # D8: index of downstream neighbor
        self.flow_accumulation: list[float] = [0.0] * self.size  # accumulated upstream cells

    def idx(self, col: int, row: int) -> int:
        return row * self.cols + col

    def cr(self, idx: int) -> tuple[int, int]:
        return idx % self.cols, idx // self.cols

    def inside(self, col: int, row: int) -> bool:
        return 0 <= col < self.cols and 0 <= row < self.rows

    def point(self, idx: int) -> Point:
        col, row = self.cr(idx)
        return (col + 0.5) * self.step, (row + 0.5) * self.step

    def neighbors4(self, idx: int) -> Iterable[int]:
        col, row = self.cr(idx)
        if col > 0:
            yield idx - 1
        if col + 1 < self.cols:
            yield idx + 1
        if row > 0:
            yield idx - self.cols
        if row + 1 < self.rows:
            yield idx + self.cols

    def neighbors8(self, idx: int) -> Iterable[tuple[int, float, Point]]:
        col, row = self.cr(idx)
        for dx, dy in ((-1, -1), (0, -1), (1, -1), (-1, 0), (1, 0), (-1, 1), (0, 1), (1, 1)):
            nc = col + dx
            nr = row + dy
            if not self.inside(nc, nr):
                continue
            dist = 1.4142 if dx and dy else 1.0
            yield self.idx(nc, nr), dist, (dx, dy)


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def px(point: Point, cfg: AtlasConfig) -> Point:
    return point[0] * cfg.width, point[1] * cfg.height


def fmt(point: Point) -> str:
    return f"{point[0]:.1f},{point[1]:.1f}"


def lerp(start: Point, end: Point, t: float) -> Point:
    return start[0] + (end[0] - start[0]) * t, start[1] + (end[1] - start[1]) * t


def distance(a: Point, b: Point) -> float:
    return math.hypot(b[0] - a[0], b[1] - a[1])


def segment_length(start: Point, end: Point) -> float:
    return distance(start, end)


def normalized_perp(start: Point, end: Point) -> Point:
    dx = end[0] - start[0]
    dy = end[1] - start[1]
    mag = math.hypot(dx, dy)
    if mag < 1e-8:
        return 0.0, 0.0
    return -dy / mag, dx / mag


def scale_points(points: Sequence[Point], cfg: AtlasConfig) -> list[Point]:
    return [px(point, cfg) for point in points]


def polygon_path(points: Sequence[Point]) -> str:
    if not points:
        return ""
    return "M" + " L".join(fmt(point) for point in points) + " Z"


def polyline_path(points: Sequence[Point]) -> str:
    if not points:
        return ""
    if len(points) == 1:
        return f"M{fmt(points[0])}"
    if len(points) == 2:
        return f"M{fmt(points[0])} L{fmt(points[1])}"
    commands = [f"M{fmt(points[0])}"]
    for index in range(1, len(points) - 1):
        control = points[index]
        mid = lerp(points[index], points[index + 1], 0.5)
        commands.append(f"Q{fmt(control)} {fmt(mid)}")
    commands.append(f"L{fmt(points[-1])}")
    return " ".join(commands)


def point_in_polygon(point: Point, polygon: Sequence[Point]) -> bool:
    x, y = point
    inside = False
    for index, start in enumerate(polygon):
        end = polygon[(index + 1) % len(polygon)]
        denom = end[1] - start[1]
        if abs(denom) < 1e-8:
            denom = 1e-8 if denom >= 0 else -1e-8
        if ((start[1] > y) != (end[1] > y)) and x < (
            (end[0] - start[0]) * (y - start[1]) / denom + start[0]
        ):
            inside = not inside
    return inside


def distance_to_segment(point: Point, start: Point, end: Point) -> float:
    seg_len_sq = (end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2
    if seg_len_sq < 1e-8:
        return distance(point, start)
    t = clamp(
        ((point[0] - start[0]) * (end[0] - start[0]) + (point[1] - start[1]) * (end[1] - start[1])) / seg_len_sq,
        0.0,
        1.0,
    )
    projected = lerp(start, end, t)
    return distance(point, projected)


def distance_to_polyline(point: Point, points: Sequence[Point]) -> float:
    return min(distance_to_segment(point, start, end) for start, end in zip(points, points[1:]))


def sample_polyline(points: Sequence[Point], stride: float) -> list[Point]:
    if not points:
        return []
    if len(points) == 1:
        return [points[0]]
    sampled = [points[0]]
    carry = 0.0
    for start, end in zip(points, points[1:]):
        seg_len = distance(start, end)
        if seg_len < 1e-6:
            continue
        cursor = stride - carry
        while cursor < seg_len:
            sampled.append(lerp(start, end, cursor / seg_len))
            cursor += stride
        carry = seg_len - (cursor - stride)
        if abs(carry - stride) < 1e-6:
            carry = 0.0
    sampled.append(points[-1])
    return sampled


def point_and_tangent_at_ratio(points: Sequence[Point], ratio: float) -> tuple[Point, Point]:
    total = sum(distance(start, end) for start, end in zip(points, points[1:]))
    if total < 1e-8:
        return points[0], (1.0, 0.0)
    target = clamp(ratio, 0.0, 1.0) * total
    walk = 0.0
    for start, end in zip(points, points[1:]):
        seg_len = distance(start, end)
        if walk + seg_len >= target:
            t = 0.0 if seg_len < 1e-8 else (target - walk) / seg_len
            tangent = (end[0] - start[0], end[1] - start[1])
            mag = math.hypot(tangent[0], tangent[1])
            if mag < 1e-8:
                tangent = (1.0, 0.0)
            else:
                tangent = (tangent[0] / mag, tangent[1] / mag)
            return lerp(start, end, t), tangent
        walk += seg_len
    return points[-1], (1.0, 0.0)


def text_box(text: str, x: float, y: float, size: int, anchor: str = "middle",
             letter_spacing: float = 0.0) -> Rect:
    char_width = len(text) * size * 0.60
    spacing_extra = max(0, len(text) - 1) * letter_spacing
    width = max(28.0, char_width + spacing_extra)
    if anchor == "start":
        return x, y - size * 0.82, x + width, y + size * 0.28
    if anchor == "end":
        return x - width, y - size * 0.82, x, y + size * 0.28
    return x - width / 2.0, y - size * 0.82, x + width / 2.0, y + size * 0.28


def overlaps(box: Rect, others: Iterable[Rect], padding: float = 8.0) -> bool:
    left, top, right, bottom = box
    for other_left, other_top, other_right, other_bottom in others:
        if right + padding < other_left or left - padding > other_right:
            continue
        if bottom + padding < other_top or top - padding > other_bottom:
            continue
        return True
    return False


def nearest_land_idx(grid: TerrainGrid, target: Point, preferred_owner: int | None = None) -> int:
    col = clamp(int(target[0] / grid.step), 0, grid.cols - 1)
    row = clamp(int(target[1] / grid.step), 0, grid.rows - 1)
    start_col = int(col)
    start_row = int(row)
    best_idx = -1
    best_dist = float("inf")
    for radius in range(0, max(grid.cols, grid.rows)):
        min_col = max(0, start_col - radius)
        max_col = min(grid.cols - 1, start_col + radius)
        min_row = max(0, start_row - radius)
        max_row = min(grid.rows - 1, start_row + radius)
        for test_row in range(min_row, max_row + 1):
            for test_col in (min_col, max_col):
                idx = grid.idx(test_col, test_row)
                if not grid.land[idx]:
                    continue
                if preferred_owner is not None and grid.owner[idx] != preferred_owner:
                    continue
                d = distance(grid.point(idx), target)
                if d < best_dist:
                    best_idx = idx
                    best_dist = d
        for test_col in range(min_col + 1, max_col):
            for test_row in (min_row, max_row):
                idx = grid.idx(test_col, test_row)
                if not grid.land[idx]:
                    continue
                if preferred_owner is not None and grid.owner[idx] != preferred_owner:
                    continue
                d = distance(grid.point(idx), target)
                if d < best_dist:
                    best_idx = idx
                    best_dist = d
        if best_idx >= 0:
            return best_idx
    raise RuntimeError("No land cells were found for nearest-land lookup.")


def _smooth_ring(ring: list[Point], passes: int = 3, blend: float = 0.30) -> list[Point]:
    """Laplacian smoothing on a closed ring to soften sharp angles.

    Preserves overall shape while removing angular artifacts that look
    procedurally generated.  Higher blend values produce smoother results.
    """
    pts = list(ring)
    n = len(pts)
    if n < 5:
        return pts
    for _ in range(passes):
        new_pts: list[Point] = []
        for i in range(n):
            p = pts[(i - 1) % n]
            c = pts[i]
            q = pts[(i + 1) % n]
            nx = c[0] * (1.0 - blend) + (p[0] + q[0]) * 0.5 * blend
            ny = c[1] * (1.0 - blend) + (p[1] + q[1]) * 0.5 * blend
            new_pts.append((nx, ny))
        pts = new_pts
    return pts


def roughen_ring(points: Sequence[Point], cfg: AtlasConfig, rng: random.Random, amplitude: float, step: float) -> list[Point]:
    """Roughen coastline with rhythmic variation in detail density.

    Uses a slow 'activity wave' so some stretches are detailed (bays, headlands)
    while others remain smooth. Feature sizes are mixed: large, medium, small.
    """
    scaled = scale_points(points, cfg)
    n = len(scaled)
    output: list[Point] = []

    # Pre-compute a slow activity wave: 2-4 peaks around the ring
    num_peaks = rng.randint(2, 4)
    peak_phases = [rng.uniform(0, 2.0 * math.pi) for _ in range(num_peaks)]
    peak_amps = [rng.uniform(0.3, 1.0) for _ in range(num_peaks)]

    for index, start in enumerate(scaled):
        end = scaled[(index + 1) % n]
        output.append(start)
        seg_len = distance(start, end)
        if seg_len < step * 1.2:
            continue

        # Activity level for this segment (0.1 = smooth, 1.0 = detailed)
        ring_t = index / max(n, 1) * 2.0 * math.pi
        activity = 0.15  # base activity (never fully zero)
        for pk in range(num_peaks):
            activity += peak_amps[pk] * max(0.0, math.cos(ring_t * (pk + 1) + peak_phases[pk]))
        activity = clamp(activity / (1.0 + sum(peak_amps) * 0.5), 0.08, 1.0)

        local_amp = amplitude * activity

        nx, ny = normalized_perp(start, end)
        tx = (end[0] - start[0]) / seg_len
        ty = (end[1] - start[1]) / seg_len
        cuts = max(1, int(seg_len / step))

        # Coherent noise: random walk with reversion to zero
        drift = 0.0
        for cut in range(1, cuts):
            t = cut / cuts
            base = lerp(start, end, t)
            envelope = math.sin(math.pi * t) ** 0.75
            slide = rng.uniform(-step * 0.12, step * 0.12)

            # Random walk component for spatial coherence
            drift += rng.uniform(-local_amp * 0.35, local_amp * 0.35)
            drift *= 0.82
            push = (drift + rng.uniform(-local_amp * 0.6, local_amp * 0.6)) * envelope

            # Varied feature sizes: occasional large feature (bay or headland)
            roll = rng.random()
            if roll < 0.04:
                # Large feature
                push *= rng.uniform(2.0, 3.5)
            elif roll < 0.12:
                # Medium feature
                push *= rng.uniform(1.3, 2.0)
            # else: small feature (default)

            output.append((base[0] + nx * push + tx * slide, base[1] + ny * push + ty * slide))
    return output


def roughen_ring_pixels(points: Sequence[Point], cfg: AtlasConfig, rng: random.Random, amplitude: float, step: float) -> list[Point]:
    """Second-pass coastline detail in pixel space — gentler, rhythm-aware.

    Adds medium-frequency detail but respects the rhythm established by
    the primary pass. Skips points in already-smooth stretches.
    """
    output: list[Point] = []
    n = len(points)

    # Measure local curvature to decide where to add detail
    # High curvature = already interesting, add less; low curvature = smooth, maybe add some
    for index, start in enumerate(points):
        end = points[(index + 1) % n]
        output.append(start)
        seg_len = distance(start, end)
        if seg_len < step * 1.05:
            continue

        # Check local curvature: if neighbors already have high angle change, reduce noise
        prev = points[(index - 1) % n]
        nxt = points[(index + 2) % n]
        # Angle change at this vertex
        v1x, v1y = start[0] - prev[0], start[1] - prev[1]
        v2x, v2y = end[0] - start[0], end[1] - start[1]
        len1 = math.sqrt(v1x*v1x + v1y*v1y) or 1e-8
        len2 = math.sqrt(v2x*v2x + v2y*v2y) or 1e-8
        dot = (v1x*v2x + v1y*v2y) / (len1 * len2)
        curvature = 1.0 - clamp(dot, -1.0, 1.0)  # 0 = straight, 2 = reversal

        # Reduce amplitude in already-curved areas, boost in straight areas
        curvature_factor = clamp(1.2 - curvature * 0.8, 0.2, 1.0)
        local_amp = amplitude * curvature_factor

        nx, ny = normalized_perp(start, end)
        tx = (end[0] - start[0]) / max(seg_len, 1e-8)
        ty = (end[1] - start[1]) / max(seg_len, 1e-8)
        cuts = max(1, int(seg_len / step))
        for cut in range(1, cuts):
            t = cut / cuts
            base = lerp(start, end, t)
            envelope = math.sin(math.pi * t) ** 0.92
            slide = rng.uniform(-step * 0.10, step * 0.10)
            push = rng.uniform(-local_amp, local_amp) * envelope
            output.append((base[0] + nx * push + tx * slide, base[1] + ny * push + ty * slide))
    return output


def jitter_ridge_points(points: Sequence[Point], cfg: AtlasConfig, rng: random.Random) -> list[Point]:
    scaled = scale_points(points, cfg)
    jittered: list[Point] = []
    for index, point in enumerate(scaled):
        if index == 0:
            ref = scaled[index + 1]
            nx, ny = normalized_perp(point, ref)
        elif index == len(scaled) - 1:
            ref = scaled[index - 1]
            nx, ny = normalized_perp(ref, point)
        else:
            prev_point = scaled[index - 1]
            next_point = scaled[index + 1]
            nx, ny = normalized_perp(prev_point, next_point)
        offset = rng.uniform(-cfg.ridge_jitter, cfg.ridge_jitter) * (0.4 if index in (0, len(scaled) - 1) else 1.0)
        jittered.append((point[0] + nx * offset, point[1] + ny * offset))
    return jittered


def build_irregular_ridge_chain(norm_points: Sequence[Point], cfg: AtlasConfig, rng: random.Random, subdiv_passes: int = 3) -> list[Point]:
    pts = [(float(p[0]), float(p[1])) for p in norm_points]
    for _ in range(subdiv_passes):
        new_pts = [pts[0]]
        for i in range(len(pts) - 1):
            t = 0.48 + rng.uniform(-0.06, 0.06)
            mid = lerp(pts[i], pts[i + 1], t)
            dx = pts[i + 1][0] - pts[i][0]
            dy = pts[i + 1][1] - pts[i][1]
            seg_len = math.hypot(dx, dy) or 1e-8
            nx, ny = -dy / seg_len, dx / seg_len
            edge = 0.35 if i == 0 or i == len(pts) - 2 else 1.0
            kick = rng.uniform(0.004, 0.018) * edge * rng.choice([-1.0, 1.0])
            mid = (mid[0] + nx * kick, mid[1] + ny * kick)
            new_pts.append(mid)
            new_pts.append(pts[i + 1])
        pts = new_pts
    scaled = scale_points(pts, cfg)
    out: list[Point] = []
    for i, p in enumerate(scaled):
        if i == 0:
            ref = scaled[i + 1]
            nx, ny = normalized_perp(p, ref)
        elif i == len(scaled) - 1:
            ref = scaled[i - 1]
            nx, ny = normalized_perp(ref, p)
        else:
            nx, ny = normalized_perp(scaled[i - 1], scaled[i + 1])
        amp = rng.uniform(-cfg.ridge_jitter * 0.38, cfg.ridge_jitter * 0.38) * (0.38 if i in (0, len(scaled) - 1) else 1.0)
        out.append((p[0] + nx * amp, p[1] + ny * amp))
    return out


def _generate_base_ellipse(center: Point, aspect: float, num_points: int, base_ry: float = 0.25) -> list[Point]:
    """Generate a smooth ellipse centered at (cx, cy) with specified aspect ratio.

    aspect: width/height ratio (e.g., 1.8 for roughly 1.8:1 aspect)
    base_ry: semi-minor axis size (default 0.25)
    """
    cx, cy = center
    ry = base_ry
    rx = ry * aspect  # semi-major axis adjusted by aspect

    points: list[Point] = []
    for i in range(num_points):
        theta = 2.0 * math.pi * i / num_points
        x = cx + rx * math.cos(theta)
        y = cy + ry * math.sin(theta)
        points.append((clamp(x, 0.05, 0.95), clamp(y, 0.05, 0.95)))
    return points


def _apply_harmonic_perturbations(ring: list[Point], rng: random.Random,
                                   num_harmonics: int = 5, center: Point = (0.5, 0.5)) -> list[Point]:
    """Apply low-frequency harmonic radial perturbations with tectonic directional bias.

    One random 'tectonic direction' gets compressed/rugged coastline,
    the opposite side gets smoother curves.
    """
    cx, cy = center

    # Choose a tectonic compression direction (angle where coast is more rugged)
    tectonic_angle = rng.uniform(0, 2.0 * math.pi)
    tectonic_strength = rng.uniform(0.03, 0.08)  # subtle compression

    perturbed: list[Point] = []

    for point in ring:
        dx = point[0] - cx
        dy = point[1] - cy
        angle = math.atan2(dy, dx)
        dist = math.sqrt(dx * dx + dy * dy)

        # Apply harmonic perturbations at different frequencies — moderate amplitude
        modulation = 1.0
        for harmonic in range(1, num_harmonics + 1):
            freq = harmonic
            phase = rng.uniform(0, 2.0 * math.pi)
            amplitude = rng.uniform(0.04, 0.12) / (harmonic ** 0.65)
            modulation += amplitude * math.sin(freq * angle + phase)

        # Tectonic bias: compress toward center on tectonic side, expand on opposite
        angle_diff = angle - tectonic_angle
        tectonic_factor = math.cos(angle_diff)
        modulation -= tectonic_strength * tectonic_factor

        new_dist = dist * modulation
        new_x = cx + new_dist * math.cos(angle)
        new_y = cy + new_dist * math.sin(angle)
        perturbed.append((clamp(new_x, 0.05, 0.95), clamp(new_y, 0.05, 0.95)))

    return perturbed


def _add_gulf_indentation(ring: list[Point], rng: random.Random, center: Point = (0.5, 0.5)) -> list[Point]:
    """Add 1-4 smooth inward bites (gulf indentations) to the continent.

    Uses a Gaussian-like falloff across neighbors so gulfs have smooth,
    natural profiles rather than sharp V-shaped notches.
    """
    num_gulfs = rng.randint(1, 4)
    modified = list(ring)
    n = len(modified)

    for _ in range(num_gulfs):
        idx = rng.randint(0, n - 1)
        cx, cy = center
        # First gulf can be a major one (deeper but not extreme)
        if _ == 0:
            indent_depth = rng.uniform(0.10, 0.18)
        else:
            indent_depth = rng.uniform(0.05, 0.12)
        # Width of the gulf in ring indices (how many neighbors are affected)
        width = rng.randint(3, max(4, n // 8))

        for offset in range(-width, width + 1):
            ni = (idx + offset) % n
            # Gaussian-like falloff from center
            falloff = math.exp(-0.5 * (offset / max(width * 0.45, 1)) ** 2)
            depth = indent_depth * falloff
            pt = modified[ni]
            new_x = pt[0] + (cx - pt[0]) * depth
            new_y = pt[1] + (cy - pt[1]) * depth
            modified[ni] = (clamp(new_x, 0.05, 0.95), clamp(new_y, 0.05, 0.95))

    return modified


def _add_peninsula_extensions(ring: list[Point], rng: random.Random, center: Point = (0.5, 0.5)) -> list[Point]:
    """Add 1-3 smooth outward bulges (peninsula extensions) to the continent.

    Uses Gaussian falloff so peninsulas taper naturally from a wide base
    to a narrower tip, like real geographic features.
    """
    num_peninsulas = rng.randint(1, 3)
    modified = list(ring)
    n = len(modified)

    for _ in range(num_peninsulas):
        idx = rng.randint(0, n - 1)
        point = modified[idx]

        cx, cy = center
        dx = point[0] - cx
        dy = point[1] - cy
        dist = math.sqrt(dx * dx + dy * dy)

        if dist > 0.001:
            # First peninsula can be somewhat larger
            if _ == 0:
                extent = rng.uniform(0.06, 0.14)
            else:
                extent = rng.uniform(0.04, 0.10)
            # Width of influence in ring indices
            width = rng.randint(2, max(3, n // 10))

            for offset in range(-width, width + 1):
                ni = (idx + offset) % n
                # Gaussian falloff — tip at center, wide base at edges
                falloff = math.exp(-0.5 * (offset / max(width * 0.40, 1)) ** 2)
                ext = extent * falloff
                nb = modified[ni]
                nb_dx = nb[0] - cx
                nb_dy = nb[1] - cy
                nb_dist = math.sqrt(nb_dx * nb_dx + nb_dy * nb_dy)
                if nb_dist > 0.001:
                    nb_x = nb[0] + (nb_dx / nb_dist) * ext
                    nb_y = nb[1] + (nb_dy / nb_dist) * ext
                    modified[ni] = (clamp(nb_x, 0.05, 0.95), clamp(nb_y, 0.05, 0.95))

    return modified


def _add_fjords_and_inlets(ring: list[Point], rng: random.Random, center: Point = (0.5, 0.5)) -> list[Point]:
    """Add 1-3 deep narrow intrusions (fjords/inlets) that cut sharply into the continent.

    Unlike gulfs which are wide and smooth, these are narrow and deep,
    creating dramatic coastline features.
    """
    num_fjords = rng.randint(1, 3)
    modified = list(ring)
    n = len(modified)
    cx, cy = center

    for _ in range(num_fjords):
        idx = rng.randint(0, n - 1)
        # Deep but narrow
        indent_depth = rng.uniform(0.05, 0.12)
        # Very narrow width (fewer neighbors affected)
        width = rng.randint(1, max(2, n // 20))

        for offset in range(-width, width + 1):
            ni = (idx + offset) % n
            # Sharp triangular falloff (not gaussian) for fjord-like shape
            t = abs(offset) / max(width, 1)
            falloff = max(0.0, 1.0 - t)  # linear taper
            depth = indent_depth * falloff
            pt = modified[ni]
            new_x = pt[0] + (cx - pt[0]) * depth
            new_y = pt[1] + (cy - pt[1]) * depth
            modified[ni] = (clamp(new_x, 0.05, 0.95), clamp(new_y, 0.05, 0.95))

    return modified


def _add_sharp_direction_changes(ring: list[Point], rng: random.Random,
                                  center: Point = (0.5, 0.5)) -> list[Point]:
    """Add clustered direction changes with smooth stretches between them.

    Instead of uniform jitter, creates 3-6 'detail zones' around the coastline
    separated by smooth stretches. This produces natural rhythm:
    smooth → complex → smooth → sharp → smooth
    """
    cx, cy = center
    modified = list(ring)
    n = len(modified)
    if n < 12:
        return modified

    # Pick 3-6 detail zones around the coastline
    num_zones = rng.randint(3, 6)
    zone_centers = sorted(rng.sample(range(n), min(num_zones, n)))

    for zone_idx in zone_centers:
        # Each zone affects 5-15% of the coastline
        zone_width = rng.randint(max(2, n // 20), max(4, n // 8))
        # Intensity varies per zone — subtle, not extreme
        intensity = rng.uniform(0.01, 0.035)

        for offset in range(-zone_width, zone_width + 1):
            i = (zone_idx + offset) % n
            # Falloff from zone center
            t = abs(offset) / max(zone_width, 1)
            falloff = max(0.0, 1.0 - t * t)  # quadratic falloff

            if rng.random() < 0.5 * falloff:  # sparser at edges of zone
                pt = modified[i]
                dx = pt[0] - cx
                dy = pt[1] - cy
                dist = math.sqrt(dx * dx + dy * dy)
                if dist > 0.01:
                    push = rng.choice([-1, 1]) * intensity * falloff
                    new_x = pt[0] + (dx / dist) * push
                    new_y = pt[1] + (dy / dist) * push
                    modified[i] = (clamp(new_x, 0.05, 0.95), clamp(new_y, 0.05, 0.95))

    return modified


def _roughen_and_smooth(ring: list[Point], cfg: AtlasConfig, rng: random.Random,
                        amp_scale: float = 1.0) -> list[Point]:
    """Standard roughening + smoothing pipeline for any continent shape."""
    primary = roughen_ring(ring, cfg, rng, cfg.coastline_roughness * amp_scale, cfg.coastline_step)
    secondary = roughen_ring_pixels(primary, cfg, rng,
                                     cfg.coastline_roughness * 0.35 * amp_scale,
                                     cfg.coastline_step * 0.55)
    return _smooth_ring(secondary, passes=4, blend=0.32)


def _shape_continent(ellipse: list[Point], center: Point, rng: random.Random) -> list[Point]:
    """Apply all shape modifications: harmonics, gulfs, peninsulas, fjords, detail zones."""
    num_harmonics = rng.randint(3, 6)
    perturbed = _apply_harmonic_perturbations(ellipse, rng, num_harmonics, center=center)
    with_gulfs = _add_gulf_indentation(perturbed, rng, center=center)
    with_peninsulas = _add_peninsula_extensions(with_gulfs, rng, center=center)
    with_fjords = _add_fjords_and_inlets(with_peninsulas, rng, center=center)
    return _add_sharp_direction_changes(with_fjords, rng, center=center)


def generate_mainland(cfg: AtlasConfig, rng: random.Random) -> list[Point]:
    """Generate a procedurally unique continent shape per seed.

    Picks from several distinct shape profiles to ensure variety:
    - Wide landscape (classic horizontal continent)
    - Tall portrait (vertical continent, like South America)
    - Diagonal sweep (rotated at ~30-50 degrees)
    - Squat and broad (fills width, shorter vertically)
    - Long and narrow (stretched in one dimension)
    """
    # Pick a shape profile for dramatic variety between seeds
    profile = rng.choice(["wide", "tall", "diagonal", "squat", "narrow"])

    if profile == "wide":
        # Classic wide horizontal continent
        aspect = rng.uniform(1.6, 2.4)
        base_ry = rng.uniform(0.26, 0.34)
        cx = 0.5 + rng.uniform(-0.06, 0.06)
        cy = 0.5 + rng.uniform(-0.05, 0.05)
        rotation = rng.uniform(-0.15, 0.15)
    elif profile == "tall":
        # Tall vertical continent (aspect < 1 means taller than wide)
        aspect = rng.uniform(0.5, 0.8)
        base_ry = rng.uniform(0.32, 0.40)
        cx = 0.5 + rng.uniform(-0.10, 0.10)
        cy = 0.5 + rng.uniform(-0.04, 0.04)
        rotation = rng.uniform(-0.12, 0.12)
    elif profile == "diagonal":
        # Diagonally swept continent
        aspect = rng.uniform(1.4, 2.2)
        base_ry = rng.uniform(0.24, 0.32)
        cx = 0.5 + rng.uniform(-0.06, 0.06)
        cy = 0.5 + rng.uniform(-0.04, 0.04)
        rotation = rng.choice([-1, 1]) * rng.uniform(0.4, 0.75)  # 23-43 degrees
    elif profile == "squat":
        # Very wide and short
        aspect = rng.uniform(2.2, 3.0)
        base_ry = rng.uniform(0.20, 0.26)
        cx = 0.5 + rng.uniform(-0.04, 0.04)
        cy = 0.5 + rng.uniform(-0.06, 0.06)
        rotation = rng.uniform(-0.10, 0.10)
    else:  # narrow
        # Long narrow continent
        aspect = rng.uniform(2.5, 3.5)
        base_ry = rng.uniform(0.16, 0.22)
        cx = 0.5 + rng.uniform(-0.05, 0.05)
        cy = 0.5 + rng.uniform(-0.05, 0.05)
        rotation = rng.uniform(-0.50, 0.50)

    center = (cx, cy)
    num_base_points = rng.randint(48, 64)
    ellipse = _generate_base_ellipse(center, aspect, num_base_points, base_ry)

    # Apply rotation
    if abs(rotation) > 0.05:
        cos_r, sin_r = math.cos(rotation), math.sin(rotation)
        rotated: list[Point] = []
        for px_, py_ in ellipse:
            dx, dy = px_ - cx, py_ - cy
            rx = cx + dx * cos_r - dy * sin_r
            ry_ = cy + dx * sin_r + dy * cos_r
            rotated.append((clamp(rx, 0.06, 0.94), clamp(ry_, 0.06, 0.94)))
        ellipse = rotated

    shaped = _shape_continent(ellipse, center, rng)
    return _roughen_and_smooth(shaped, cfg, rng)


def _generate_offset_continent(cfg: AtlasConfig, rng: random.Random,
                                center: Point = (0.5, 0.5), scale: float = 1.0) -> list[Point]:
    """Generate a continent shape offset from center and scaled.

    Uses the same pipeline as generate_mainland but shifts and scales the result.
    """
    # Pick a random shape profile for this continent too
    profile = rng.choice(["wide", "wide", "tall", "diagonal", "squat"])
    if profile == "wide":
        aspect = rng.uniform(1.4, 2.2)
        base_ry = rng.uniform(0.22, 0.30) * scale
        rotation = rng.uniform(-0.15, 0.15)
    elif profile == "tall":
        aspect = rng.uniform(0.5, 0.9)
        base_ry = rng.uniform(0.28, 0.36) * scale
        rotation = rng.uniform(-0.12, 0.12)
    elif profile == "diagonal":
        aspect = rng.uniform(1.3, 2.0)
        base_ry = rng.uniform(0.20, 0.28) * scale
        rotation = rng.choice([-1, 1]) * rng.uniform(0.35, 0.65)
    else:  # squat
        aspect = rng.uniform(2.0, 2.8)
        base_ry = rng.uniform(0.16, 0.24) * scale
        rotation = rng.uniform(-0.10, 0.10)

    num_base_points = rng.randint(48, 64)
    ellipse = _generate_base_ellipse((0.5, 0.5), aspect, num_base_points, base_ry)

    # Apply rotation
    if abs(rotation) > 0.05:
        cos_r, sin_r = math.cos(rotation), math.sin(rotation)
        rotated: list[Point] = []
        for px_, py_ in ellipse:
            dx, dy = px_ - 0.5, py_ - 0.5
            rx = 0.5 + dx * cos_r - dy * sin_r
            ry_ = 0.5 + dx * sin_r + dy * cos_r
            rotated.append((clamp(rx, 0.06, 0.94), clamp(ry_, 0.06, 0.94)))
        ellipse = rotated

    shaped = _shape_continent(ellipse, (0.5, 0.5), rng)

    # Shift from (0.5, 0.5) to target center
    cx, cy = center
    offset_x = cx - 0.5
    offset_y = cy - 0.5
    shifted = [(clamp(p[0] + offset_x, 0.04, 0.96), clamp(p[1] + offset_y, 0.04, 0.96)) for p in shaped]

    return _roughen_and_smooth(shifted, cfg, rng, amp_scale=scale)


def generate_landmasses(cfg: AtlasConfig, rng: random.Random) -> tuple[list[Point], list[list[Point]]]:
    """Generate one or more major landmasses based on seed.

    Returns (primary_mainland, extra_landmasses) where extra_landmasses
    are large secondary continents treated as islands in the pipeline.

    Layout types (chosen by seed):
    - Single centered continent (25%) — classic centered layout
    - Single offset continent (15%) — large continent pushed to one side
    - One large + one medium continent (25%) — two landmasses
    - Two medium continents side by side (15%) — split world
    - Two continents top/bottom (10%) — vertical split
    - Archipelago: one medium + several large islands (10%)
    """
    roll = rng.random()

    if roll < 0.25:
        # Single large continent — centered, uses full shape variety
        mainland = generate_mainland(cfg, rng)
        return mainland, []

    elif roll < 0.40:
        # Single continent offset to one side of the map
        # This makes it feel like the map is showing part of a larger world
        side = rng.choice(["left", "right", "top", "bottom"])
        if side == "left":
            cx, cy = rng.uniform(0.30, 0.42), rng.uniform(0.40, 0.60)
        elif side == "right":
            cx, cy = rng.uniform(0.58, 0.70), rng.uniform(0.40, 0.60)
        elif side == "top":
            cx, cy = rng.uniform(0.40, 0.60), rng.uniform(0.30, 0.42)
        else:
            cx, cy = rng.uniform(0.40, 0.60), rng.uniform(0.58, 0.68)
        offset_rng = random.Random(rng.randint(0, 2**31))
        mainland = _generate_offset_continent(cfg, offset_rng,
                                               center=(cx, cy),
                                               scale=rng.uniform(0.80, 1.0))
        return mainland, []

    elif roll < 0.65:
        # One large + one medium secondary continent
        # Pick random arrangement: left/right, diagonal, etc.
        arrangement = rng.choice(["lr", "lr", "diagonal", "near"])
        primary_rng = random.Random(rng.randint(0, 2**31))

        if arrangement == "lr":
            # Side by side, primary larger
            pri_cx = rng.uniform(0.28, 0.40)
            pri_cy = rng.uniform(0.38, 0.58)
            sec_cx = rng.uniform(0.65, 0.78)
            sec_cy = rng.uniform(0.30, 0.60)
        elif arrangement == "diagonal":
            # Diagonal placement
            if rng.random() < 0.5:
                pri_cx, pri_cy = rng.uniform(0.28, 0.40), rng.uniform(0.28, 0.42)
                sec_cx, sec_cy = rng.uniform(0.62, 0.75), rng.uniform(0.55, 0.70)
            else:
                pri_cx, pri_cy = rng.uniform(0.28, 0.40), rng.uniform(0.55, 0.68)
                sec_cx, sec_cy = rng.uniform(0.62, 0.75), rng.uniform(0.28, 0.42)
        else:
            # Near each other (like Europe/Africa)
            pri_cx = rng.uniform(0.35, 0.50)
            pri_cy = rng.uniform(0.28, 0.42)
            sec_cx = pri_cx + rng.uniform(-0.10, 0.10)
            sec_cy = rng.uniform(0.58, 0.72)

        primary = _generate_offset_continent(cfg, primary_rng,
                                              center=(pri_cx, pri_cy),
                                              scale=rng.uniform(0.70, 0.85))
        secondary_rng = random.Random(rng.randint(0, 2**31))
        secondary = _generate_offset_continent(cfg, secondary_rng,
                                                center=(sec_cx, sec_cy),
                                                scale=rng.uniform(0.40, 0.60))
        return primary, [secondary]

    elif roll < 0.80:
        # Two medium continents — side by side (horizontal split)
        rng1 = random.Random(rng.randint(0, 2**31))
        rng2 = random.Random(rng.randint(0, 2**31))
        c1 = _generate_offset_continent(cfg, rng1,
                                         center=(rng.uniform(0.25, 0.38), rng.uniform(0.35, 0.60)),
                                         scale=rng.uniform(0.55, 0.70))
        c2 = _generate_offset_continent(cfg, rng2,
                                         center=(rng.uniform(0.62, 0.78), rng.uniform(0.35, 0.60)),
                                         scale=rng.uniform(0.55, 0.70))
        if len(c1) >= len(c2):
            return c1, [c2]
        else:
            return c2, [c1]

    elif roll < 0.90:
        # Two continents — vertical split (top/bottom)
        rng1 = random.Random(rng.randint(0, 2**31))
        rng2 = random.Random(rng.randint(0, 2**31))
        c1 = _generate_offset_continent(cfg, rng1,
                                         center=(rng.uniform(0.38, 0.62), rng.uniform(0.25, 0.38)),
                                         scale=rng.uniform(0.50, 0.65))
        c2 = _generate_offset_continent(cfg, rng2,
                                         center=(rng.uniform(0.38, 0.62), rng.uniform(0.62, 0.75)),
                                         scale=rng.uniform(0.50, 0.65))
        if len(c1) >= len(c2):
            return c1, [c2]
        else:
            return c2, [c1]

    else:
        # Archipelago: one medium + several large island-like masses
        main_rng = random.Random(rng.randint(0, 2**31))
        main = _generate_offset_continent(cfg, main_rng,
                                           center=(rng.uniform(0.35, 0.55), rng.uniform(0.35, 0.55)),
                                           scale=rng.uniform(0.50, 0.65))
        extras: list[list[Point]] = []
        num_extra = rng.randint(2, 4)
        for _ in range(num_extra):
            ex_rng = random.Random(rng.randint(0, 2**31))
            ex_cx = rng.uniform(0.15, 0.85)
            ex_cy = rng.uniform(0.15, 0.80)
            ex_scale = rng.uniform(0.25, 0.42)
            extra = _generate_offset_continent(cfg, ex_rng, center=(ex_cx, ex_cy), scale=ex_scale)
            extras.append(extra)
        return main, extras


def _island_overlaps_mainland(island_pts: Sequence[Point], mainland_pts: Sequence[Point]) -> bool:
    """Check if any island vertex is inside the mainland polygon (or vice versa)."""
    for pt in island_pts[::max(1, len(island_pts) // 12)]:
        if point_in_polygon(pt, mainland_pts):
            return True
    return False


def _min_distance_to_polygon(island_pts: Sequence[Point], mainland_pts: Sequence[Point]) -> float:
    """Approximate minimum distance between island and mainland edges."""
    best = float("inf")
    sample_island = island_pts[::max(1, len(island_pts) // 8)]
    sample_main = mainland_pts[::max(1, len(mainland_pts) // 20)]
    for ip in sample_island:
        for mp in sample_main:
            d = distance(ip, mp)
            if d < best:
                best = d
    return best


def generate_islands(cfg: AtlasConfig, rng: random.Random, mainland: Sequence[Point]) -> list[list[Point]]:
    """Generate procedural islands placed relative to the actual mainland.

    Islands get the same two-pass roughening pipeline as the mainland coast,
    scaled to their size, so they look like mini-continents with bays, inlets
    and varied coastline detail — not smooth blobs.
    """
    templates = generate_island_templates(mainland, cfg, rng)

    islands: list[list[Point]] = []
    for island in templates:
        ring_px = list(island.ring)

        # Measure island size to scale roughening appropriately
        cx = sum(p[0] for p in ring_px) / len(ring_px)
        cy = sum(p[1] for p in ring_px) / len(ring_px)
        avg_radius = sum(math.hypot(p[0] - cx, p[1] - cy) for p in ring_px) / len(ring_px)

        # Scale roughening amplitude to island size (bigger islands = more detail)
        size_factor = clamp(avg_radius / 60.0, 0.4, 1.2)
        amp = cfg.island_roughness * island.roughness_scale * size_factor
        step = cfg.coastline_step * 0.55

        # Two-pass roughening like the mainland: primary + secondary detail
        primary = roughen_ring_pixels(ring_px, cfg, rng, amp, step)
        secondary = roughen_ring_pixels(primary, cfg, rng, amp * 0.35, step * 0.55)
        # Light smoothing to remove jaggies while keeping geographic character
        island_pts = _smooth_ring(secondary, passes=3, blend=0.30)

        # Skip islands that overlap with mainland or are too close
        if _island_overlaps_mainland(island_pts, mainland):
            continue
        if _min_distance_to_polygon(island_pts, mainland) < 40:
            continue
        islands.append(island_pts)
    return islands


def generate_mountain_ranges(cfg: AtlasConfig, rng: random.Random) -> list[MountainRange]:
    ranges: list[MountainRange] = []
    for ridge in RIDGE_TEMPLATES:
        chain = build_irregular_ridge_chain(ridge.points, cfg, rng, subdiv_passes=3)
        ranges.append(
            MountainRange(
                name=ridge.name,
                points=chain,
                label_xy=px(ridge.label_xy, cfg),
                label_rotation=ridge.label_rotation,
                strength=ridge.strength,
                influence=ridge.influence,
                peak_stride=ridge.peak_stride,
            )
        )
    return ranges


def _poisson_disk_sample(domain: Rect, min_distance: float, rng: random.Random,
                         max_attempts: int = 30) -> list[Point]:
    """Poisson-disk sampling to generate well-spaced points in a rectangular domain.

    domain: (min_x, min_y, max_x, max_y)
    Returns list of (x, y) points normalized to [0, 1].
    """
    x_min, y_min, x_max, y_max = domain
    cell_size = min_distance / math.sqrt(2.0)
    grid_width = int((x_max - x_min) / cell_size) + 1
    grid_height = int((y_max - y_min) / cell_size) + 1

    grid: dict[tuple[int, int], bool] = {}
    active: list[Point] = []
    samples: list[Point] = []

    # Start with a random point
    first_x = rng.uniform(x_min, x_max)
    first_y = rng.uniform(y_min, y_max)
    first_pt = (first_x, first_y)
    active.append(first_pt)
    samples.append(first_pt)
    gx = int((first_x - x_min) / cell_size)
    gy = int((first_y - y_min) / cell_size)
    grid[(gx, gy)] = True

    while active:
        idx = rng.randint(0, len(active) - 1)
        pt = active[idx]
        found = False

        for _ in range(max_attempts):
            angle = rng.uniform(0, 2.0 * math.pi)
            dist = rng.uniform(min_distance, 2.0 * min_distance)
            new_x = pt[0] + dist * math.cos(angle)
            new_y = pt[1] + dist * math.sin(angle)

            if not (x_min <= new_x <= x_max and y_min <= new_y <= y_max):
                continue

            gx = int((new_x - x_min) / cell_size)
            gy = int((new_y - y_min) / cell_size)

            if (gx, gy) in grid:
                continue

            # Check neighborhood
            ok = True
            for dx in [-2, -1, 0, 1, 2]:
                for dy in [-2, -1, 0, 1, 2]:
                    ngx = gx + dx
                    ngy = gy + dy
                    if (ngx, ngy) in grid:
                        ngpt = grid.get((ngx, ngy))
                        # In our simple version, grid stores True, so we skip
                        # For proper Poisson, we'd store points and check distance
                        pass

            new_pt = (new_x, new_y)
            samples.append(new_pt)
            active.append(new_pt)
            grid[(gx, gy)] = True
            found = True
            break

        if not found:
            active.pop(idx)

    return samples


def generate_region_templates(grid: TerrainGrid, cfg: AtlasConfig, rng: random.Random) -> list[RegionTemplate]:
    """Generate procedural region templates with scattered seed points on land."""
    # Target 6-8 regions
    num_regions = rng.randint(6, 8)

    # Collect all land cells
    land_points = [grid.point(idx) for idx in range(grid.size) if grid.land[idx]]

    if not land_points:
        # Fallback: return a minimal region setup
        return [
            RegionTemplate(
                key="fallback",
                name=rng.choice(REGION_NAME_POOL),
                fill="#c8c4a0",
                seed=(0.5, 0.5),
                label_hint=(0.5, 0.5),
                cities=(),
                subtitle="",
            )
        ]

    # Use Poisson-disk-like sampling to scatter region seeds
    # (simplified: just random sample from land with distance checking)
    region_seeds: list[Point] = []
    min_seed_distance = 0.15  # normalized distance

    for attempt in range(num_regions * 10):
        if len(region_seeds) >= num_regions:
            break

        # Pick a random land point
        idx = rng.randint(0, len(land_points) - 1)
        candidate = land_points[idx]

        # Check distance to existing seeds
        ok = True
        for existing in region_seeds:
            dx = candidate[0] - existing[0]
            dy = candidate[1] - existing[1]
            if math.sqrt(dx * dx + dy * dy) < min_seed_distance * cfg.width:
                ok = False
                break

        if ok:
            region_seeds.append(candidate)

    # If we couldn't get enough, just use what we have
    if not region_seeds:
        region_seeds = [land_points[rng.randint(0, len(land_points) - 1)] for _ in range(num_regions)]

    # Distinct parchment colors for regions
    region_colors = [
        "#c4b880", "#d8c898", "#a8c0a0", "#d4bc88",
        "#b8c4a0", "#dcc8a0", "#b4b088", "#c8c098",
        "#c0a878", "#b0c4b0",
    ]

    templates: list[RegionTemplate] = []
    used_names = set()

    for i, seed_pt in enumerate(region_seeds):
        # seed_pt is in pixel coordinates; convert to normalized
        seed_norm = (seed_pt[0] / cfg.width, seed_pt[1] / cfg.height)

        # Pick a unique region name
        available_names = [n for n in REGION_NAME_POOL if n not in used_names]
        if not available_names:
            available_names = REGION_NAME_POOL
        region_name = rng.choice(available_names)
        used_names.add(region_name)

        # Pick a color
        color = region_colors[i % len(region_colors)]

        # Label hint: slightly offset from seed (in normalized coords)
        label_x = clamp(seed_norm[0] + rng.uniform(-0.02, 0.02), 0.05, 0.95)
        label_y = clamp(seed_norm[1] + rng.uniform(-0.02, 0.02), 0.05, 0.95)
        label_hint = (label_x, label_y)

        # Cities: 3-6 cities per region, one capital near the seed
        num_cities = rng.randint(3, 6)
        cities: list[CityTemplate] = []

        # Capital city at region seed (in normalized coords)
        capital_name = rng.choice(CITY_NAME_POOL)
        cities.append(CityTemplate(capital_name, seed_norm, capital=True, label_offset=(0.0, -24.0)))

        # Other cities scattered around the seed
        for j in range(num_cities - 1):
            # Place near the region seed but not too close (in normalized coords)
            offset_dist = rng.uniform(0.05, 0.15)  # normalized distance
            offset_angle = rng.uniform(0, 2.0 * math.pi)
            city_x = clamp(seed_norm[0] + offset_dist * math.cos(offset_angle), 0.01, 0.99)
            city_y = clamp(seed_norm[1] + offset_dist * math.sin(offset_angle), 0.01, 0.99)
            city_pt = (city_x, city_y)

            city_name = rng.choice([n for n in CITY_NAME_POOL if n != capital_name])
            cities.append(CityTemplate(city_name, city_pt, capital=False, label_offset=(0.0, -24.0)))

        subtitle = rng.choice(DESCRIPTOR_POOL) + " " + region_name
        templates.append(
            RegionTemplate(
                key=f"region_{i}",
                name=region_name,
                fill=color,
                seed=seed_norm,
                label_hint=label_hint,
                cities=tuple(cities),
                subtitle=subtitle,
            )
        )

    return templates


def _find_nearest_land(grid: TerrainGrid, x: float, y: float) -> int | None:
    """Find the nearest land cell to pixel coordinates (x, y)."""
    col = int(x / grid.step)
    row = int(y / grid.step)
    best_idx = None
    best_dist = float("inf")
    search_r = 15
    for dr in range(-search_r, search_r + 1):
        for dc in range(-search_r, search_r + 1):
            r2 = row + dr
            c2 = col + dc
            if 0 <= r2 < grid.rows and 0 <= c2 < grid.cols:
                idx = grid.idx(c2, r2)
                if grid.land[idx]:
                    px2, py2 = grid.point(idx)
                    d = (px2 - x) ** 2 + (py2 - y) ** 2
                    if d < best_dist:
                        best_dist = d
                        best_idx = idx
    return best_idx


def generate_ridge_templates(grid: TerrainGrid, cfg: AtlasConfig, rng: random.Random) -> list[RidgeTemplate]:
    """Generate procedural ridge templates that span large portions of the continent."""
    num_ridges = rng.randint(2, 4)
    ridge_names = rng.sample(RIDGE_NAME_POOL, min(num_ridges, len(RIDGE_NAME_POOL)))

    templates: list[RidgeTemplate] = []

    # Find all interior land cells (far from coast) sorted by coast_distance
    interior: list[tuple[int, float]] = []
    for idx in range(grid.size):
        if grid.land[idx] and grid.coast_distance[idx] > 40:
            interior.append((idx, grid.coast_distance[idx]))
    if len(interior) < 10:
        return templates

    interior.sort(key=lambda x: x[1], reverse=True)
    used_starts: list[Point] = []

    for ridge_idx, ridge_name in enumerate(ridge_names):
        # Pick a start point far from existing ridge starts
        start_pt = None
        start_idx_grid = -1
        for idx, cd in interior:
            pt = grid.point(idx)
            too_close = False
            for sp in used_starts:
                if distance(pt, sp) < 250:
                    too_close = True
                    break
            if not too_close:
                start_pt = pt
                start_idx_grid = idx
                break
        if start_pt is None:
            # Pick from top interior points randomly
            pick = interior[rng.randint(0, min(20, len(interior) - 1))]
            start_idx_grid = pick[0]
            start_pt = grid.point(start_idx_grid)

        used_starts.append(start_pt)

        # Choose a random direction for the ridge to extend
        angle = rng.uniform(0, 2 * math.pi)
        # Build waypoints by stepping in that direction with jitter
        num_waypoints = rng.randint(4, 7)
        step_len = rng.uniform(120, 220)
        ridge_points: list[Point] = [start_pt]

        cx, cy = start_pt
        for wi in range(num_waypoints):
            # Add angular jitter
            angle += rng.uniform(-0.5, 0.5)
            nx = cx + step_len * math.cos(angle)
            ny = cy + step_len * math.sin(angle)
            # Clamp to map bounds
            nx = max(50, min(cfg.width - 50, nx))
            ny = max(50, min(cfg.height - 50, ny))
            # Check that this point is on land (find nearest land cell)
            nearest_land = _find_nearest_land(grid, nx, ny)
            if nearest_land is not None:
                nx, ny = grid.point(nearest_land)
            ridge_points.append((nx, ny))
            cx, cy = nx, ny

        if len(ridge_points) >= 3:
            mid_idx = len(ridge_points) // 2
            label_xy = ridge_points[mid_idx]
            # Compute angle for label
            if mid_idx + 1 < len(ridge_points):
                dx = ridge_points[mid_idx + 1][0] - ridge_points[mid_idx][0]
                dy = ridge_points[mid_idx + 1][1] - ridge_points[mid_idx][1]
                label_rotation = math.degrees(math.atan2(dy, dx))
            else:
                label_rotation = rng.uniform(-20, 20)

            templates.append(
                RidgeTemplate(
                    name=ridge_name,
                    points=ridge_points,
                    label_xy=label_xy,
                    label_rotation=label_rotation,
                    strength=rng.uniform(0.85, 1.0),
                    influence=rng.uniform(80, 120),
                    peak_stride=rng.uniform(55, 70),
                )
            )

    return templates


def generate_basin_templates(grid: TerrainGrid, cfg: AtlasConfig, rng: random.Random) -> list[BasinTemplate]:
    """Generate procedural basin templates for lakes based on terrain."""
    num_basins = rng.randint(2, 4)
    basin_names = rng.sample(LAKE_NAME_POOL, min(num_basins, len(LAKE_NAME_POOL)))

    templates: list[BasinTemplate] = []

    for basin_idx, basin_name in enumerate(basin_names):
        # Find low-elevation points far from coast
        low_points: list[tuple[int, float]] = []
        for idx in range(grid.size):
            if grid.land[idx] and grid.coast_distance[idx] > 60:
                low_points.append((idx, grid.elevation[idx]))

        if not low_points:
            continue

        # Sort by elevation, pick lowest
        low_points.sort(key=lambda x: x[1])
        basin_idx_grid = low_points[0][0]

        center = grid.point(basin_idx_grid)
        radius = rng.uniform(0.03, 0.06) * cfg.width
        depth = rng.uniform(0.20, 0.35)

        templates.append(
            BasinTemplate(
                name=basin_name,
                center=center,
                radius=radius,
                depth=depth,
                label_shift=(0.0, 18.0),
            )
        )

    return templates


def _smooth_island_ring(ring: list[Point], passes: int = 2) -> list[Point]:
    """Apply Laplacian smoothing to an island ring for organic shapes."""
    pts = list(ring)
    n = len(pts)
    if n < 4:
        return pts
    for _ in range(passes):
        new_pts: list[Point] = []
        for i in range(n):
            prev = pts[(i - 1) % n]
            curr = pts[i]
            nxt = pts[(i + 1) % n]
            nx = curr[0] * 0.5 + (prev[0] + nxt[0]) * 0.25
            ny = curr[1] * 0.5 + (prev[1] + nxt[1]) * 0.25
            new_pts.append((nx, ny))
        pts = new_pts
    return pts


def _make_island_ring(cx: float, cy: float, radius: float, rng: random.Random,
                       elongation: float = 1.0, rotation: float = 0.0) -> list[Point]:
    """Create an organic island ring with geographic character.

    Uses many points + harmonic perturbation + optional gulf indentation
    for coastlines that look like real islands with bays and headlands.
    """
    num_pts = max(24, int(radius * 0.8))  # more points for larger islands
    num_pts = min(num_pts, 48)
    ring: list[Point] = []

    # 3-5 harmonic perturbations for varied shapes
    num_harmonics = rng.randint(3, 5)
    harm_amp = [rng.uniform(0.10, 0.28) / (1 + h * 0.3) for h in range(num_harmonics)]
    harm_freq = [rng.randint(2, 6) for _ in range(num_harmonics)]
    harm_phase = [rng.uniform(0, 2 * math.pi) for _ in range(num_harmonics)]

    # Optional gulf indentation (1-2 bays for larger islands)
    num_gulfs = rng.randint(0, 2) if radius > 25 else 0
    gulf_angles = [rng.uniform(0, 2 * math.pi) for _ in range(num_gulfs)]
    gulf_depths = [rng.uniform(0.15, 0.35) for _ in range(num_gulfs)]
    gulf_widths = [rng.uniform(0.3, 0.7) for _ in range(num_gulfs)]

    cos_rot = math.cos(rotation)
    sin_rot = math.sin(rotation)

    for k in range(num_pts):
        theta = 2.0 * math.pi * k / num_pts
        # Base radius with elongation
        rx = radius * elongation
        ry = radius / elongation
        ex = rx * math.cos(theta)
        ey = ry * math.sin(theta)
        px_r = ex * cos_rot - ey * sin_rot
        py_r = ex * sin_rot + ey * cos_rot
        base_r = math.hypot(px_r, py_r)

        # Harmonic perturbation
        perturb = 0.0
        for h in range(num_harmonics):
            perturb += harm_amp[h] * math.sin(harm_freq[h] * theta + harm_phase[h])

        # Gulf indentations (bays)
        gulf_indent = 0.0
        for gi in range(num_gulfs):
            angle_diff = theta - gulf_angles[gi]
            # Wrap to [-pi, pi]
            while angle_diff > math.pi:
                angle_diff -= 2 * math.pi
            while angle_diff < -math.pi:
                angle_diff += 2 * math.pi
            gulf_indent += gulf_depths[gi] * math.exp(-(angle_diff / gulf_widths[gi]) ** 2)

        r = base_r * (1.0 + perturb - gulf_indent)
        r = max(r, base_r * 0.3)  # don't collapse to nothing
        ring.append((cx + r * math.cos(theta), cy + r * math.sin(theta)))

    return ring


def generate_island_templates(mainland: Sequence[Point], cfg: AtlasConfig, rng: random.Random) -> list[IslandTemplate]:
    """Generate procedural islands that form logical chains and arcs near coastlines.

    Islands are organized into:
    - 1-2 arc chains (curved sequences of islands)
    - 2-3 coastal clusters near continental edges
    - 2-4 scattered outlier islets
    All use harmonic perturbation for smooth organic shapes.
    """
    templates: list[IslandTemplate] = []
    placed_centers: list[tuple[float, float]] = []

    def _too_close_to_placed(x: float, y: float, min_gap: float) -> bool:
        for px2, py2 in placed_centers:
            if math.hypot(x - px2, y - py2) < min_gap:
                return True
        return False

    # --- Arc chains (1-2 chains of 3-5 islands each) ---
    num_chains = rng.randint(1, 2)
    for _ in range(num_chains):
        coast_idx = rng.randint(0, len(mainland) - 1)
        start_pt = mainland[coast_idx]
        base_angle = rng.uniform(0, 2.0 * math.pi)
        arc_curve = rng.uniform(-0.25, 0.25)
        chain_len = rng.randint(3, 5)

        for j in range(chain_len):
            angle = base_angle + arc_curve * j
            dist = (0.06 + 0.035 * j) * cfg.width + rng.uniform(-15, 15)
            ix = start_pt[0] + dist * math.cos(angle)
            iy = start_pt[1] + dist * math.sin(angle)
            ix = clamp(ix, 0.03 * cfg.width, 0.97 * cfg.width)
            iy = clamp(iy, 0.03 * cfg.height, 0.97 * cfg.height)

            if _too_close_to_placed(ix, iy, 50):
                continue

            radius = rng.uniform(0.022, 0.05) * cfg.width * (1.0 - 0.08 * j)
            elongation = rng.uniform(1.0, 1.5)
            rotation = rng.uniform(0, math.pi)
            ring = _make_island_ring(ix, iy, radius, rng, elongation, rotation)
            ring = _smooth_island_ring(ring, passes=3)

            placed_centers.append((ix, iy))
            templates.append(IslandTemplate(ring=tuple(ring), roughness_scale=0.55))

    # --- Coastal clusters (2-3 tight groups near continent edges) ---
    num_clusters = rng.randint(2, 3)
    for _ in range(num_clusters):
        coast_idx = rng.randint(0, len(mainland) - 1)
        cluster_center = mainland[coast_idx]
        angle = rng.uniform(0, 2.0 * math.pi)
        offset_dist = rng.uniform(0.06, 0.10) * cfg.width
        cluster_cx = cluster_center[0] + offset_dist * math.cos(angle)
        cluster_cy = cluster_center[1] + offset_dist * math.sin(angle)
        cluster_cx = clamp(cluster_cx, 0.03 * cfg.width, 0.97 * cfg.width)
        cluster_cy = clamp(cluster_cy, 0.03 * cfg.height, 0.97 * cfg.height)

        cluster_size = rng.randint(2, 3)
        for _ in range(cluster_size):
            scatter = rng.uniform(0.015, 0.035) * cfg.width
            sx = cluster_cx + rng.uniform(-scatter, scatter)
            sy = cluster_cy + rng.uniform(-scatter, scatter)
            sx = clamp(sx, 0.03 * cfg.width, 0.97 * cfg.width)
            sy = clamp(sy, 0.03 * cfg.height, 0.97 * cfg.height)

            if _too_close_to_placed(sx, sy, 40):
                continue

            radius = rng.uniform(0.014, 0.032) * cfg.width
            elongation = rng.uniform(1.0, 1.4)
            rotation = rng.uniform(0, math.pi)
            ring = _make_island_ring(sx, sy, radius, rng, elongation, rotation)
            ring = _smooth_island_ring(ring, passes=3)

            placed_centers.append((sx, sy))
            templates.append(IslandTemplate(ring=tuple(ring), roughness_scale=0.45))

    # --- Scattered outlier islets (3-5) ---
    num_outliers = rng.randint(3, 5)
    for _ in range(num_outliers):
        coast_idx = rng.randint(0, len(mainland) - 1)
        coast_pt = mainland[coast_idx]
        angle = rng.uniform(0, 2.0 * math.pi)
        dist = rng.uniform(0.08, 0.20) * cfg.width
        ox = clamp(coast_pt[0] + dist * math.cos(angle), 0.03 * cfg.width, 0.97 * cfg.width)
        oy = clamp(coast_pt[1] + dist * math.sin(angle), 0.03 * cfg.height, 0.97 * cfg.height)

        if _too_close_to_placed(ox, oy, 35):
            continue

        radius = rng.uniform(0.007, 0.018) * cfg.width
        elongation = rng.uniform(1.0, 1.6)
        rotation = rng.uniform(0, math.pi)
        ring = _make_island_ring(ox, oy, radius, rng, elongation, rotation)
        ring = _smooth_island_ring(ring, passes=3)

        placed_centers.append((ox, oy))
        templates.append(IslandTemplate(ring=tuple(ring), roughness_scale=0.35))

    return templates


def populate_land_mask(grid: TerrainGrid, mainland: Sequence[Point]) -> None:
    for idx in range(grid.size):
        grid.land[idx] = point_in_polygon(grid.point(idx), mainland)


def compute_coast_distance(grid: TerrainGrid) -> int:
    queue: deque[int] = deque()
    for idx in range(grid.size):
        if not grid.land[idx]:
            grid.coast_distance[idx] = -1
            continue
        touches_sea = any(not grid.land[nb] for nb in grid.neighbors4(idx))
        if touches_sea:
            grid.coast_distance[idx] = 0
            queue.append(idx)
        else:
            grid.coast_distance[idx] = 10**9

    max_distance = 0
    while queue:
        idx = queue.popleft()
        next_distance = grid.coast_distance[idx] + 1
        max_distance = max(max_distance, grid.coast_distance[idx])
        for nb in grid.neighbors4(idx):
            if not grid.land[nb] or grid.coast_distance[nb] <= next_distance:
                continue
            grid.coast_distance[nb] = next_distance
            queue.append(nb)
    return max(1, max_distance)


def compute_elevation_field_base(grid: TerrainGrid, cfg: AtlasConfig) -> None:
    """Compute base elevation without mountain ranges — used to find ridge locations."""
    max_coast = max(grid.coast_distance) if grid.coast_distance else 1
    for idx in range(grid.size):
        if not grid.land[idx]:
            continue
        x, y = grid.point(idx)
        coast_rise = grid.coast_distance[idx] / max(max_coast, 1.0)
        harmonic = (
            0.012 * math.sin(x * 0.0028 + y * 0.0008)
            + 0.009 * math.cos(y * 0.0020 - x * 0.0016)
            + 0.006 * math.sin((x * 0.7 + y) * 0.0018)
        )
        gulf_lowland = 0.14 * math.exp(
            -(((x - cfg.width * 0.58) / (cfg.width * 0.17)) ** 2 + ((y - cfg.height * 0.36) / (cfg.height * 0.19)) ** 2)
        )
        coast_elev = math.sqrt(coast_rise) * 0.30
        grid.elevation[idx] = clamp(
            0.04 + coast_elev + gulf_lowland + harmonic,
            0.0,
            1.0,
        )


def compute_elevation_field(grid: TerrainGrid, cfg: AtlasConfig, mountain_ranges: Sequence[MountainRange]) -> None:
    max_coast = max(1, max(grid.coast_distance))
    basin_px = [
        (px(basin.center, cfg), basin.radius * min(cfg.width, cfg.height), basin.depth)
        for basin in BASINS
    ]
    # Generate seed-based phase offsets for varied terrain
    seed_phase = cfg.seed * 0.7137
    for idx in range(grid.size):
        if not grid.land[idx]:
            continue
        x, y = grid.point(idx)
        coast_rise = grid.coast_distance[idx] / max_coast
        ridge_strength = 0.0
        for ridge in mountain_ranges:
            d = distance_to_polyline((x, y), ridge.points)
            t = d / max(ridge.influence, 1e-6)
            ridge_strength = max(ridge_strength, ridge.strength * math.exp(-(t**2.35)))
        basin_drop = 0.0
        for basin_center, basin_radius, basin_depth in basin_px:
            d = distance((x, y), basin_center)
            basin_drop += basin_depth * math.exp(-((d / basin_radius) ** 2) * 2.2)
        # Richer harmonic terrain with seed-based phases
        harmonic = (
            0.018 * math.sin(x * 0.0032 + y * 0.0010 + seed_phase)
            + 0.014 * math.cos(y * 0.0024 - x * 0.0018 + seed_phase * 1.3)
            + 0.010 * math.sin((x * 0.7 + y) * 0.0020 + seed_phase * 0.8)
            + 0.008 * math.cos((x - y * 0.5) * 0.0028 + seed_phase * 2.1)
            + 0.006 * math.sin(x * 0.0055 + y * 0.0035 + seed_phase * 1.7)
        )
        # Procedural hills: add localized bumps for contour interest
        hills = (
            0.06 * math.exp(-((x - cfg.width * 0.3) ** 2 + (y - cfg.height * 0.25) ** 2) / (cfg.width * 80))
            + 0.05 * math.exp(-((x - cfg.width * 0.7) ** 2 + (y - cfg.height * 0.6) ** 2) / (cfg.width * 70))
            + 0.04 * math.exp(-((x - cfg.width * 0.5) ** 2 + (y - cfg.height * 0.8) ** 2) / (cfg.width * 60))
        )
        # Low funnel along the mid gulf (signature bite) — steers trunk rivers toward the embayment.
        gulf_lowland = 0.14 * math.exp(
            -(((x - cfg.width * 0.58) / (cfg.width * 0.17)) ** 2 + ((y - cfg.height * 0.36) / (cfg.height * 0.19)) ** 2)
        )
        grid.ridge_strength[idx] = ridge_strength
        # Stronger ridge and coastal contributions for more contour density
        ridge_elev = ridge_strength ** 0.7 * 0.85
        coast_elev = math.sqrt(coast_rise) * 0.38
        grid.elevation[idx] = clamp(
            0.04 + coast_elev + ridge_elev + hills + gulf_lowland - basin_drop + harmonic,
            0.0,
            1.0,
        )


def compute_flow_direction(grid: TerrainGrid) -> None:
    """D8 steepest-descent flow direction for every land cell.

    Each land cell's flow_direction is set to the neighbor (of 8) with the
    steepest downhill slope.  Cells on the coast (coast_distance <= 0) or
    sea cells drain to themselves (sentinel = own index).  Flat cells
    (no downhill neighbor) are resolved in a second BFS pass that routes
    them toward the nearest cell that *does* have a downhill outlet.
    """
    for idx in range(grid.size):
        if not grid.land[idx]:
            grid.flow_direction[idx] = idx  # sea → self
            continue
        if grid.coast_distance[idx] <= 0:
            grid.flow_direction[idx] = idx
            continue

        el = grid.elevation[idx]
        best_nb = -1
        best_slope = 0.0
        for nb, dist, _ in grid.neighbors8(idx):
            drop = el - grid.elevation[nb]
            slope = drop / dist
            if slope > best_slope:
                best_slope = slope
                best_nb = nb
            elif slope == best_slope == 0.0 and not grid.land[nb]:
                # Prefer draining directly to sea over staying flat
                best_nb = nb
                best_slope = 1e-9

        if best_nb >= 0 and best_slope > 0:
            grid.flow_direction[idx] = best_nb
        else:
            grid.flow_direction[idx] = -1  # flat/pit — resolved below

    # Resolve flats & pits: BFS from cells that already have an outlet,
    # assigning flat neighbors to drain toward the resolved cell.
    queue: deque[int] = deque()
    for idx in range(grid.size):
        if grid.flow_direction[idx] >= 0:
            queue.append(idx)

    while queue:
        idx = queue.popleft()
        for nb, _, _ in grid.neighbors8(idx):
            if grid.flow_direction[nb] == -1:
                grid.flow_direction[nb] = idx
                queue.append(nb)

    # Break any cycles created by equal-elevation D8 assignments.
    # Detect cycles using tortoise-and-hare, then redirect cycled cells
    # toward the nearest lower-coast-distance neighbor.
    for idx in range(grid.size):
        if not grid.land[idx]:
            continue
        # Quick cycle check: follow up to 50 hops
        slow = idx
        fast = idx
        is_cycle = False
        for _ in range(50):
            s_nxt = grid.flow_direction[slow]
            if s_nxt < 0 or s_nxt == slow:
                break
            f1 = grid.flow_direction[fast]
            if f1 < 0 or f1 == fast:
                break
            f2 = grid.flow_direction[f1]
            if f2 < 0 or f2 == f1:
                break
            slow = s_nxt
            fast = f2
            if slow == fast:
                is_cycle = True
                break
        if not is_cycle:
            continue
        # Found a cycle involving this cell — redirect toward coast
        cursor = idx
        visited_cycle: set[int] = set()
        while cursor not in visited_cycle:
            visited_cycle.add(cursor)
            nxt = grid.flow_direction[cursor]
            if nxt < 0 or nxt == cursor:
                break
            cursor = nxt
        # Redirect all cycle members toward their lowest coast_distance neighbor
        for cidx in visited_cycle:
            best_nb = cidx  # self-drain as fallback
            best_coast = grid.coast_distance[cidx]
            for nb, _, _ in grid.neighbors8(cidx):
                if nb not in visited_cycle and grid.coast_distance[nb] < best_coast:
                    best_coast = grid.coast_distance[nb]
                    best_nb = nb
            grid.flow_direction[cidx] = best_nb


def compute_flow_accumulation(grid: TerrainGrid) -> None:
    """Compute flow accumulation by propagating water downstream.

    Every land cell starts with 1 unit; water flows along flow_direction
    until it reaches a sea cell (flow_direction[i] == i).  Uses an
    in-degree approach with topological ordering for efficiency.
    """
    # Initialize accumulation: 1 for each land cell, 0 for sea
    in_degree = [0] * grid.size
    for idx in range(grid.size):
        if grid.land[idx]:
            grid.flow_accumulation[idx] = 1.0
        else:
            grid.flow_accumulation[idx] = 0.0

    # Count in-degree (how many cells flow into each cell)
    for idx in range(grid.size):
        target = grid.flow_direction[idx]
        if target >= 0 and target != idx:
            in_degree[target] += 1

    # Start from cells with zero in-degree (headwater cells)
    queue: deque[int] = deque()
    for idx in range(grid.size):
        if in_degree[idx] == 0 and grid.land[idx]:
            queue.append(idx)

    while queue:
        idx = queue.popleft()
        target = grid.flow_direction[idx]
        if target < 0 or target == idx:
            continue
        grid.flow_accumulation[target] += grid.flow_accumulation[idx]
        in_degree[target] -= 1
        if in_degree[target] == 0:
            queue.append(target)


def _trace_guided_river(
    grid: TerrainGrid,
    start: int,
    target_pt: Point,
    used_cells: set[int],
    rng: random.Random,
    max_steps: int = 2000,
    min_before_confluence: int = 10,
) -> list[int]:
    """Trace a river from *start* toward *target_pt* (a distant coast point).

    Uses a weighted heuristic: each step picks the neighbor that best
    balances (a) moving toward *target_pt*, (b) going downhill, and
    (c) staying on land.  This produces long, continent-spanning rivers
    rather than the shortest-path-to-nearest-coast from D8 flow.
    """
    # Minimum cells we want before allowing the river to reach the coast
    min_inland_cells = 25
    chain: list[int] = [start]
    visited: set[int] = {start}
    cursor = start
    for _ in range(max_steps):
        cur_pt = grid.point(cursor)
        best_nb = -1
        best_score = -float("inf")
        for nb, _, _ in grid.neighbors8(cursor):
            if nb in visited:
                continue
            nb_pt = grid.point(nb)
            if not grid.land[nb]:
                # Reached the sea — only accept after enough inland travel
                if len(chain) >= min_inland_cells:
                    chain.append(nb)
                    visited.add(nb)
                    return chain
                continue  # Skip sea cells early — force river to stay inland
            # Score components:
            # 1. Progress toward target (dot product with direction to target)
            to_target_x = target_pt[0] - cur_pt[0]
            to_target_y = target_pt[1] - cur_pt[1]
            to_target_len = math.hypot(to_target_x, to_target_y)
            if to_target_len > 1e-6:
                to_target_x /= to_target_len
                to_target_y /= to_target_len
            step_x = nb_pt[0] - cur_pt[0]
            step_y = nb_pt[1] - cur_pt[1]
            step_len = math.hypot(step_x, step_y)
            if step_len > 1e-6:
                step_x /= step_len
                step_y /= step_len
            toward_target = step_x * to_target_x + step_y * to_target_y

            # 2. Downhill preference
            elev_drop = grid.elevation[cursor] - grid.elevation[nb]

            # 3. Stay inland bonus — strongly prefer high coast_distance
            #    early in the trace so rivers don't cut across narrow land
            inland_frac = min(1.0, len(chain) / max(min_inland_cells, 1))
            # Early: strong inland preference. Late: allow coastward movement.
            inland_bonus = grid.coast_distance[nb] * (1.0 - inland_frac) * 0.15

            # 4. Random jitter for organic, winding paths
            jitter = rng.uniform(-0.35, 0.35)

            score = toward_target * 1.5 + elev_drop * 2.0 + inland_bonus + jitter
            if score > best_score:
                best_score = score
                best_nb = nb

        if best_nb < 0:
            break  # no valid neighbors
        chain.append(best_nb)
        visited.add(best_nb)
        if best_nb in used_cells and len(chain) >= min_before_confluence:
            break
        cursor = best_nb
    return chain


def _find_distant_coast(grid: TerrainGrid, start: int, rng: random.Random,
                         min_distance: float = 0.0,
                         avoid_directions: list[Point] | None = None,
                         avoid_angle_threshold: float = 0.5) -> Point | None:
    """Find a coast/sea cell far from *start*, avoiding directions already used.

    *avoid_directions* is a list of unit-direction vectors from *start* to
    already-chosen targets.  New targets must differ by at least
    *avoid_angle_threshold* radians from all existing directions.
    """
    start_pt = grid.point(start)
    coast_candidates: list[tuple[float, int]] = []
    step = max(1, grid.size // 3000)
    for idx in range(0, grid.size, step):
        if grid.land[idx]:
            continue
        has_land_nb = False
        for nb in grid.neighbors4(idx):
            if grid.land[nb]:
                has_land_nb = True
                break
        if not has_land_nb:
            continue
        d = distance(start_pt, grid.point(idx))
        if d >= min_distance:
            coast_candidates.append((d, idx))

    if not coast_candidates:
        return None

    # Filter out directions too similar to existing ones
    if avoid_directions:
        filtered: list[tuple[float, int]] = []
        for d, idx in coast_candidates:
            pt = grid.point(idx)
            dx = pt[0] - start_pt[0]
            dy = pt[1] - start_pt[1]
            dl = math.hypot(dx, dy)
            if dl < 1e-6:
                continue
            dx /= dl
            dy /= dl
            too_similar = False
            for avd in avoid_directions:
                # Dot product — 1.0 means same direction
                dot = dx * avd[0] + dy * avd[1]
                if dot > math.cos(avoid_angle_threshold):
                    too_similar = True
                    break
            if not too_similar:
                filtered.append((d, idx))
        if filtered:
            coast_candidates = filtered

    coast_candidates.sort(key=lambda x: x[0], reverse=True)
    top_n = max(1, len(coast_candidates) // 4)
    pick = rng.randint(0, min(top_n - 1, len(coast_candidates) - 1))
    return grid.point(coast_candidates[pick][1])


def _trace_flow_to_coast(
    grid: TerrainGrid,
    start: int,
    used_cells: set[int],
    max_steps: int = 8000,
    min_before_confluence: int = 8,
) -> list[int]:
    """Trace D8 flow from *start* downstream until we reach the coast.

    Simple fallback tracer used for extra (non-lake) rivers and sub-branches.
    """
    chain: list[int] = [start]
    visited: set[int] = {start}
    cursor = start
    stuck_count = 0
    for _ in range(max_steps):
        nxt = grid.flow_direction[cursor]
        if nxt < 0 or nxt == cursor:
            nxt = _step_toward_coast(grid, cursor, visited)
            if nxt < 0:
                break
        if nxt in visited:
            nxt = _step_toward_coast(grid, cursor, visited)
            if nxt < 0:
                break
            stuck_count += 1
            if stuck_count > 30:
                break
        else:
            stuck_count = 0
        chain.append(nxt)
        visited.add(nxt)
        if not grid.land[nxt]:
            break
        if nxt in used_cells and len(chain) >= min_before_confluence:
            break
        cursor = nxt
    return chain


def _step_toward_coast(grid: TerrainGrid, idx: int, visited: set[int]) -> int:
    """Find the best unvisited neighbor that moves toward the coast."""
    best = -1
    best_cd = grid.coast_distance[idx] + 999
    for nb, _, _ in grid.neighbors8(idx):
        if nb in visited:
            continue
        cd = grid.coast_distance[nb]
        if cd < best_cd:
            best_cd = cd
            best = nb
    return best


def _pick_branch_start(
    grid: TerrainGrid,
    trunk_chain: list[int],
    frac: float,
    rng: random.Random,
    used_cells: set[int],
    diverge_steps: int = 10,
) -> int | None:
    """Find a good branching start cell near *frac* along *trunk_chain*.

    Instead of just picking a single neighbor, we pick a neighbor that
    diverges from the trunk and then walk *diverge_steps* in a direction
    that moves AWAY from the trunk (perpendicular + coastward).  This
    ensures branches actually separate visually from the trunk.
    """
    idx_pos = int(frac * (len(trunk_chain) - 1))
    window = max(3, len(trunk_chain) // 10)
    trunk_set = set(trunk_chain)

    # Get trunk direction at this point for computing perpendicular
    lo = max(0, idx_pos - 3)
    hi = min(len(trunk_chain) - 1, idx_pos + 3)
    trunk_dx = grid.point(trunk_chain[hi])[0] - grid.point(trunk_chain[lo])[0]
    trunk_dy = grid.point(trunk_chain[hi])[1] - grid.point(trunk_chain[lo])[1]
    trunk_len = math.hypot(trunk_dx, trunk_dy)
    if trunk_len < 1e-6:
        trunk_dx, trunk_dy = 1.0, 0.0
    else:
        trunk_dx /= trunk_len
        trunk_dy /= trunk_len
    # Perpendicular directions (both sides)
    perp_x, perp_y = -trunk_dy, trunk_dx

    candidates: list[tuple[float, int]] = []
    for offset in range(-window, window + 1):
        ci = idx_pos + offset
        if ci < 2 or ci >= len(trunk_chain) - 2:
            continue
        anchor = trunk_chain[ci]
        anchor_pt = grid.point(anchor)
        for nb, _, _ in grid.neighbors8(anchor):
            if not grid.land[nb] or nb in trunk_set or nb in used_cells:
                continue
            nb_pt = grid.point(nb)
            # Score: prefer cells that go perpendicular to trunk (diverge)
            dx = nb_pt[0] - anchor_pt[0]
            dy = nb_pt[1] - anchor_pt[1]
            perp_score = abs(dx * perp_x + dy * perp_y)  # perpendicular component
            coast_score = -grid.coast_distance[nb] * 0.3  # mild coastward bias
            score = perp_score + coast_score + rng.uniform(-2, 2)
            candidates.append((score, nb))
    if not candidates:
        return None
    candidates.sort(key=lambda x: x[0], reverse=True)
    # Pick from top candidates
    pick = min(len(candidates) - 1, rng.randint(0, min(4, len(candidates) - 1)))
    start_cell = candidates[pick][1]

    # Walk a few steps away from the trunk to create visual separation
    cursor = start_cell
    for _ in range(diverge_steps):
        best_nb = -1
        best_score = -float("inf")
        for nb, _, _ in grid.neighbors8(cursor):
            if not grid.land[nb] or nb in trunk_set or nb in used_cells:
                continue
            nb_pt = grid.point(nb)
            dx = nb_pt[0] - grid.point(cursor)[0]
            dy = nb_pt[1] - grid.point(cursor)[1]
            # Favor perpendicular to trunk + coastward
            score = abs(dx * perp_x + dy * perp_y) * 0.6 - grid.coast_distance[nb] * 0.4
            if score > best_score:
                best_score = score
                best_nb = nb
        if best_nb < 0:
            break
        cursor = best_nb
    return cursor


def extract_river_network(
    grid: TerrainGrid,
    cfg: AtlasConfig,
    lakes_by_name: dict[str, LakeBody],
    lake_masks: dict[str, set[int]],
    rng: random.Random,
) -> list[tuple[list[int], list[float], float]]:
    """Lake-centric branching river network — like the Cardonia reference.

    Each lake produces exactly ONE trunk river that follows D8 flow to the
    coast.  Along each trunk, 1-3 branches split off at angles and also
    flow to the coast, getting progressively shorter.  A couple of extra
    coastal rivers (not from lakes) are added for variety.

    Returns list of (cell_chain, accumulation_chain, width_tier) tuples.
    width_tier: 1.0 = trunk, 0.6 = branch, 0.35 = sub-branch.
    """
    used_cells: set[int] = set()
    segments: list[tuple[list[int], list[float], float]] = []

    # Collect all lake cells into one big set for avoidance
    all_lake_cells: set[int] = set()
    for mask in lake_masks.values():
        all_lake_cells |= mask

    # ── 1. Lake trunk rivers ──────────────────────────────────────────
    # Each lake gets ONE trunk river aimed at a distant coast point,
    # producing long continent-spanning rivers like the reference.
    # Track used directions globally so rivers spread across the map.
    global_used_dirs: list[Point] = []

    for lake_name, lake in lakes_by_name.items():
        if lake.outlet_idx is None:
            continue
        outlet_pt = grid.point(lake.outlet_idx)
        # Find a distant coast point, avoiding directions already used by other trunks
        target = _find_distant_coast(grid, lake.outlet_idx, rng,
                                      min_distance=cfg.width * 0.25,
                                      avoid_directions=global_used_dirs,
                                      avoid_angle_threshold=0.6)
        if target is None:
            target = _find_distant_coast(grid, lake.outlet_idx, rng, min_distance=0)
        if target is None:
            continue
        trunk = _trace_guided_river(grid, lake.outlet_idx, target, used_cells, rng)
        if len(trunk) < 15:
            continue
        used_cells.update(trunk)
        accums = [grid.flow_accumulation[c] for c in trunk]
        segments.append((trunk, accums, 1.0))

        # Record trunk direction for global avoidance
        dx = target[0] - outlet_pt[0]
        dy = target[1] - outlet_pt[1]
        dl = math.hypot(dx, dy)
        if dl > 1e-6:
            global_used_dirs.append((dx / dl, dy / dl))

        # ── 1b. Branches off this trunk ───────────────────────────────
        # Spawn 2-3 branches — each aims at a coast point in a DIFFERENT direction
        branch_fracs = [0.20 + rng.uniform(-0.05, 0.05),
                        0.45 + rng.uniform(-0.05, 0.05),
                        0.70 + rng.uniform(-0.05, 0.05)]
        n_branches = rng.randint(2, 3)
        rng.shuffle(branch_fracs)
        branch_fracs = branch_fracs[:n_branches]
        local_branch_dirs: list[Point] = list(global_used_dirs)  # avoid trunk dir too

        for bf in sorted(branch_fracs):
            bp = _pick_branch_start(grid, trunk, bf, rng, used_cells)
            if bp is None:
                continue
            bp_pt = grid.point(bp)
            # Branch targets a coast point different from trunk and other branches
            b_target = _find_distant_coast(grid, bp, rng,
                                            min_distance=cfg.width * 0.10,
                                            avoid_directions=local_branch_dirs,
                                            avoid_angle_threshold=0.5)
            if b_target is None:
                b_target = _find_distant_coast(grid, bp, rng, min_distance=0)
            if b_target is None:
                continue
            branch = _trace_guided_river(grid, bp, b_target, used_cells, rng)
            if len(branch) < 12:
                continue
            used_cells.update(branch)
            b_accums = [grid.flow_accumulation[c] for c in branch]
            segments.append((branch, b_accums, 0.6))

            # Record branch direction
            bdx = b_target[0] - bp_pt[0]
            bdy = b_target[1] - bp_pt[1]
            bdl = math.hypot(bdx, bdy)
            if bdl > 1e-6:
                local_branch_dirs.append((bdx / bdl, bdy / bdl))

            # Sub-branches: 0-1 off each branch
            if len(branch) > 20 and rng.random() < 0.6:
                sbf = rng.uniform(0.25, 0.55)
                sbp = _pick_branch_start(grid, branch, sbf, rng, used_cells)
                if sbp is not None:
                    sb_target = _find_distant_coast(grid, sbp, rng, min_distance=0)
                    if sb_target:
                        sub = _trace_guided_river(grid, sbp, sb_target, used_cells, rng)
                    else:
                        sub = _trace_flow_to_coast(grid, sbp, used_cells)
                    if len(sub) >= 5:
                        used_cells.update(sub)
                        s_accums = [grid.flow_accumulation[c] for c in sub]
                        segments.append((sub, s_accums, 0.35))

    # ── 2. Extra rivers from deep inland (not from lakes) ──────────
    # Start from high-accumulation inland cells and trace to distant coast
    land_accums = sorted(
        [(grid.flow_accumulation[i], i) for i in range(grid.size)
         if grid.land[i] and i not in used_cells and i not in all_lake_cells
         and grid.coast_distance[i] > 18],  # must be well inland
        reverse=True,
    )
    extra_count = 0
    min_spacing = cfg.width * 0.12
    extra_midpoints: list[Point] = []
    for accum_val, start_idx in land_accums:
        if extra_count >= 2:
            break
        start_pt = grid.point(start_idx)
        # Spacing check against all existing segments
        too_close = False
        for ep in extra_midpoints:
            if distance(start_pt, ep) < min_spacing:
                too_close = True
                break
        for seg_chain, _, tier in segments:
            seg_mid = grid.point(seg_chain[len(seg_chain) // 2])
            if distance(start_pt, seg_mid) < min_spacing * 0.6:
                too_close = True
                break
        if too_close:
            continue
        # Use guided tracer for longer, more deliberate paths
        e_target = _find_distant_coast(grid, start_idx, rng,
                                        min_distance=cfg.width * 0.15,
                                        avoid_directions=global_used_dirs,
                                        avoid_angle_threshold=0.4)
        if e_target is None:
            e_target = _find_distant_coast(grid, start_idx, rng, min_distance=0)
        if e_target is None:
            continue
        chain = _trace_guided_river(grid, start_idx, e_target, used_cells, rng)
        if len(chain) < 20:
            continue
        used_cells.update(chain)
        c_accums = [grid.flow_accumulation[c] for c in chain]
        segments.append((chain, c_accums, 0.5))
        extra_midpoints.append(start_pt)
        extra_count += 1

        # Record direction
        edx = e_target[0] - start_pt[0]
        edy = e_target[1] - start_pt[1]
        edl = math.hypot(edx, edy)
        if edl > 1e-6:
            global_used_dirs.append((edx / edl, edy / edl))

        # One branch off this extra river
        if len(chain) > 20 and rng.random() < 0.6:
            bp = _pick_branch_start(grid, chain, rng.uniform(0.3, 0.6), rng, used_cells)
            if bp is not None:
                sb_target = _find_distant_coast(grid, bp, rng, min_distance=0)
                if sb_target:
                    branch = _trace_guided_river(grid, bp, sb_target, used_cells, rng)
                else:
                    branch = _trace_flow_to_coast(grid, bp, used_cells)
                if len(branch) >= 8:
                    used_cells.update(branch)
                    b_accums = [grid.flow_accumulation[c] for c in branch]
                    segments.append((branch, b_accums, 0.35))

    return segments


def create_lake_polygon(center: Point, base_radius: float, grid: TerrainGrid, rng: random.Random) -> list[Point]:
    """Create a natural lake shape with irregular, organic shoreline.

    Uses multiple harmonic frequencies and a random walk for coherent
    radius variation, producing shapes that look like real glacial or
    tectonic lakes rather than circles.
    """
    num_verts = 40  # high vertex count for smooth, organic shoreline
    polygon: list[Point] = []

    # Pick a random elongation angle and ratio for non-circular shape
    elongation_angle = rng.uniform(0, math.tau)
    elongation_ratio = rng.uniform(0.65, 0.85)  # how squished the short axis is

    # Generate coherent radius noise via random walk
    drift = 0.0
    radii: list[float] = []
    for index in range(num_verts):
        drift += rng.uniform(-0.08, 0.08)
        drift *= 0.72  # decay toward center
        # Multiple harmonics for complex shoreline
        h1 = 0.10 * math.sin(index * 1.4 + rng.uniform(0, 2))
        h2 = 0.06 * math.sin(index * 3.1 + rng.uniform(0, 3))
        h3 = 0.03 * math.sin(index * 5.7 + rng.uniform(0, 4))
        r = base_radius * (0.78 + h1 + h2 + h3 + drift + rng.uniform(-0.04, 0.04))
        r = max(r, base_radius * 0.45)
        radii.append(r)

    # Smooth radii for coherent shoreline (no spiky artifacts)
    for _ in range(3):
        smoothed_r = list(radii)
        for i in range(num_verts):
            prev_r = radii[(i - 1) % num_verts]
            next_r = radii[(i + 1) % num_verts]
            smoothed_r[i] = radii[i] * 0.5 + (prev_r + next_r) * 0.25
        radii = smoothed_r

    for index in range(num_verts):
        angle = math.tau * index / num_verts
        r = radii[index]
        # Apply elongation: compress along one axis
        cos_a = math.cos(angle - elongation_angle)
        sin_a = math.sin(angle - elongation_angle)
        x = center[0] + (cos_a * r)
        y = center[1] + (sin_a * r * elongation_ratio)
        # Rotate back
        dx, dy = x - center[0], y - center[1]
        rot_cos = math.cos(elongation_angle)
        rot_sin = math.sin(elongation_angle)
        x = center[0] + dx * rot_cos - dy * rot_sin
        y = center[1] + dx * rot_sin + dy * rot_cos
        # Pull back toward center if outside land
        for _ in range(8):
            col = int(clamp(x / grid.step, 0, grid.cols - 1))
            row = int(clamp(y / grid.step, 0, grid.rows - 1))
            if grid.land[grid.idx(col, row)]:
                break
            x = (x + center[0]) * 0.5
            y = (y + center[1]) * 0.5
        polygon.append((x, y))
    return polygon


def dilate_cell_set(grid: TerrainGrid, cells: set[int], radius: int) -> set[int]:
    out = set(cells)
    frontier = set(cells)
    for _ in range(max(0, radius)):
        nxt: set[int] = set()
        for c in frontier:
            for nb in grid.neighbors4(c):
                if grid.land[nb]:
                    nxt.add(nb)
        frontier = nxt - out
        out |= nxt
    return out


def lake_cells(grid: TerrainGrid, lake_polygon: Sequence[Point]) -> set[int]:
    left = int(max(0, min(point[0] for point in lake_polygon) // grid.step))
    right = int(min(grid.cols - 1, max(point[0] for point in lake_polygon) // grid.step + 1))
    top = int(max(0, min(point[1] for point in lake_polygon) // grid.step))
    bottom = int(min(grid.rows - 1, max(point[1] for point in lake_polygon) // grid.step + 1))
    cells: set[int] = set()
    for row in range(top, bottom + 1):
        for col in range(left, right + 1):
            idx = grid.idx(col, row)
            if grid.land[idx] and point_in_polygon(grid.point(idx), lake_polygon):
                cells.add(idx)
    return cells


def find_basin_for_point(point: Point, cfg: AtlasConfig) -> BasinTemplate | None:
    best_basin: BasinTemplate | None = None
    best_ratio = 10.0
    for basin in BASINS:
        center = px(basin.center, cfg)
        radius = basin.radius * min(cfg.width, cfg.height)
        ratio = distance(point, center) / max(radius, 1.0)
        if ratio < 1.42 and ratio < best_ratio:
            best_basin = basin
            best_ratio = ratio
    return best_basin


def basin_outlet_idx(grid: TerrainGrid, lake_polygon: Sequence[Point], center_idx: int) -> int | None:
    cx, cy = grid.cr(center_idx)
    radius = 7
    current_height = grid.elevation[center_idx]
    lake_mask = lake_cells(grid, lake_polygon)
    best_idx: int | None = None
    best_score = float("inf")
    for row in range(max(0, cy - radius), min(grid.rows, cy + radius + 1)):
        for col in range(max(0, cx - radius), min(grid.cols, cx + radius + 1)):
            idx = grid.idx(col, row)
            if not grid.land[idx] or idx in lake_mask:
                continue
            if grid.elevation[idx] > current_height + 0.030 and grid.coast_distance[idx] > grid.coast_distance[center_idx]:
                continue
            score = grid.elevation[idx] * 12.0 + grid.coast_distance[idx] * 0.08
            if score < best_score:
                best_score = score
                best_idx = idx
    return best_idx


def mild_smooth_polyline(points: Sequence[Point], passes: int = 2, blend: float = 0.62) -> list[Point]:
    """Laplacian-style smoothing on interior vertices only — keeps endpoints, no vertex explosion."""
    if len(points) < 3:
        return list(points)
    out = [tuple(p) for p in points]
    for _ in range(passes):
        n = len(out)
        nxt = [out[0]]
        for i in range(1, n - 1):
            mx = 0.5 * (out[i - 1][0] + out[i + 1][0])
            my = 0.5 * (out[i - 1][1] + out[i + 1][1])
            nxt.append((blend * out[i][0] + (1.0 - blend) * mx, blend * out[i][1] + (1.0 - blend) * my))
        nxt.append(out[-1])
        out = nxt
    return out


def catmull_rom_chain(points: Sequence[Point], subdivisions: int = 6, alpha: float = 0.5) -> list[Point]:
    """Catmull-Rom spline through a sequence of points.

    Produces smooth, organic curves that pass through every control point —
    ideal for converting angular grid paths into natural river curves.
    Uses the standard cubic Catmull-Rom matrix formulation.
    """
    if len(points) < 2:
        return list(points)
    if len(points) == 2:
        return list(points)

    # Pad start/end by reflecting the first/last segment
    p0_ext = (2.0 * points[0][0] - points[1][0], 2.0 * points[0][1] - points[1][1])
    pn_ext = (2.0 * points[-1][0] - points[-2][0], 2.0 * points[-1][1] - points[-2][1])
    pts = [p0_ext] + list(points) + [pn_ext]

    result: list[Point] = [points[0]]
    # Iterate over each segment between consecutive original points
    for i in range(1, len(pts) - 2):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[i + 1], pts[i + 2]

        for j in range(1, subdivisions + 1):
            t = j / subdivisions
            t2 = t * t
            t3 = t2 * t

            # Standard Catmull-Rom cubic interpolation (tension=0.5)
            # At t=0 → p1, at t=1 → p2
            x = 0.5 * ((2.0 * p1[0]) +
                        (-p0[0] + p2[0]) * t +
                        (2.0 * p0[0] - 5.0 * p1[0] + 4.0 * p2[0] - p3[0]) * t2 +
                        (-p0[0] + 3.0 * p1[0] - 3.0 * p2[0] + p3[0]) * t3)
            y = 0.5 * ((2.0 * p1[1]) +
                        (-p0[1] + p2[1]) * t +
                        (2.0 * p0[1] - 5.0 * p1[1] + 4.0 * p2[1] - p3[1]) * t2 +
                        (-p0[1] + 3.0 * p1[1] - 3.0 * p2[1] + p3[1]) * t3)
            result.append((x, y))

    result.append(points[-1])
    return result


def _add_meanders(pts: list[Point], amplitude: float = 8.0, wavelength: float = 5) -> list[Point]:
    """Displace interior points perpendicular to the path to create natural meanders.

    Uses a sinusoidal pattern with slight randomness so curves look organic, not mechanical.
    """
    if len(pts) < 4:
        return pts
    import hashlib
    result = [pts[0]]
    total_len = sum(distance(pts[i], pts[i + 1]) for i in range(len(pts) - 1))
    if total_len < 1e-6:
        return pts
    cum = 0.0
    for i in range(1, len(pts) - 1):
        cum += distance(pts[i - 1], pts[i])
        frac = cum / total_len
        # Perpendicular direction from local segment
        dx = pts[min(i + 1, len(pts) - 1)][0] - pts[max(i - 1, 0)][0]
        dy = pts[min(i + 1, len(pts) - 1)][1] - pts[max(i - 1, 0)][1]
        seg_len = math.hypot(dx, dy)
        if seg_len < 1e-6:
            result.append(pts[i])
            continue
        nx, ny = -dy / seg_len, dx / seg_len  # perpendicular normal

        # Deterministic pseudo-random phase per vertex (hash-based for reproducibility)
        h = int(hashlib.md5(f"{pts[i][0]:.2f},{pts[i][1]:.2f}".encode()).hexdigest()[:8], 16)
        phase_jitter = (h % 1000) / 1000.0 * 0.8  # 0..0.8 radians jitter
        amp_jitter = 0.7 + (h % 500) / 500.0 * 0.6  # 0.7..1.3 amplitude variation

        # Sinusoidal meander with taper at endpoints + second harmonic for asymmetry
        taper = math.sin(frac * math.pi)  # 0 at ends, 1 at middle
        wave1 = math.sin(2.0 * math.pi * wavelength * frac + phase_jitter)
        wave2 = 0.3 * math.sin(2.0 * math.pi * wavelength * 2.3 * frac + phase_jitter * 1.7)
        offset = amplitude * taper * (wave1 + wave2) * amp_jitter

        result.append((pts[i][0] + nx * offset, pts[i][1] + ny * offset))
    result.append(pts[-1])
    return result


def smooth_river_segment(raw_pts: Sequence[Point]) -> list[Point]:
    """Smooth a river segment into clean, naturally curving lines.

    Pipeline:
    1. Heavy Laplacian to kill grid staircase
    2. Gentle meander displacement for organic curves
    3. Catmull-Rom spline for smooth interpolation
    4. Final Laplacian to remove any remaining kinks
    """
    if len(raw_pts) < 3:
        return list(raw_pts)
    # 1. Heavy Laplacian — 15 passes to thoroughly remove grid artifacts
    smoothed = mild_smooth_polyline(raw_pts, passes=15, blend=0.25)
    # 2. Gentle meander — lower amplitude for cleaner look
    path_len = sum(distance(smoothed[i], smoothed[i + 1]) for i in range(len(smoothed) - 1))
    amp = clamp(path_len * 0.030, 6.0, 28.0)
    meandered = _add_meanders(smoothed, amplitude=amp, wavelength=2.2)
    # 3. Catmull-Rom spline with higher subdivision for silky curves
    splined = catmull_rom_chain(meandered, subdivisions=10, alpha=0.5)
    # 4. Final smoothing — multiple passes for a polished line
    final = mild_smooth_polyline(splined, passes=6, blend=0.35)
    return final


def build_river_channel_polygon(
    pts: Sequence[Point],
    widths: Sequence[float],
    width_scale: float = 4.0,
    min_half_w: float = 1.5,
    max_half_w: float = 22.0,
    subsample: int = 120,
) -> list[Point]:
    """Build a closed polygon representing a river water channel.

    The polygon is formed by offsetting the river centerline left and right
    by a scaled version of the per-point width, then closing it.  This is the
    shape that gets *cut out* of the land — so the river appears as water
    showing through a gap in the continent.

    width_scale multiplies the per-point hydro widths so the channels are
    wide enough to be visible as terrain features (reference-style).
    """
    if len(pts) < 2:
        return []

    # Subsample for performance
    step = max(1, len(pts) // subsample)
    sub_pts = list(pts[::step])
    sub_w = list(widths[::step])
    if pts[-1] != sub_pts[-1]:
        sub_pts.append(pts[-1])
        sub_w.append(widths[-1])

    left_bank: list[Point] = []
    right_bank: list[Point] = []
    for i in range(len(sub_pts)):
        if i == 0:
            dx = sub_pts[1][0] - sub_pts[0][0]
            dy = sub_pts[1][1] - sub_pts[0][1]
        elif i == len(sub_pts) - 1:
            dx = sub_pts[-1][0] - sub_pts[-2][0]
            dy = sub_pts[-1][1] - sub_pts[-2][1]
        else:
            dx = sub_pts[i + 1][0] - sub_pts[i - 1][0]
            dy = sub_pts[i + 1][1] - sub_pts[i - 1][1]
        seg_len = math.hypot(dx, dy)
        if seg_len < 1e-6:
            left_bank.append(sub_pts[i])
            right_bank.append(sub_pts[i])
            continue
        nx, ny = -dy / seg_len, dx / seg_len
        half_w = clamp(sub_w[i] * width_scale * 0.5, min_half_w, max_half_w)
        left_bank.append((sub_pts[i][0] + nx * half_w, sub_pts[i][1] + ny * half_w))
        right_bank.append((sub_pts[i][0] - nx * half_w, sub_pts[i][1] - ny * half_w))

    # Heavy smoothing on banks for clean, natural shoreline edges
    left_bank = mild_smooth_polyline(left_bank, passes=8, blend=0.30)
    right_bank = mild_smooth_polyline(right_bank, passes=8, blend=0.30)

    # Close into a polygon: left bank forward, right bank reversed
    polygon = list(left_bank) + list(reversed(right_bank))
    return polygon


def carve_river_channels(grid: TerrainGrid, rivers: Sequence[RiverPath]) -> None:
    """Mark grid cells inside river channel polygons as non-land.

    This causes contour lines, region fills, and all land-clipped layers
    to naturally avoid the river channels.
    """
    for river in rivers:
        if not river.channel_poly:
            continue
        # Find bounding box of the channel polygon
        xs = [p[0] for p in river.channel_poly]
        ys = [p[1] for p in river.channel_poly]
        min_col = max(0, int(min(xs) / grid.step) - 1)
        max_col = min(grid.cols - 1, int(max(xs) / grid.step) + 1)
        min_row = max(0, int(min(ys) / grid.step) - 1)
        max_row = min(grid.rows - 1, int(max(ys) / grid.step) + 1)
        for row in range(min_row, max_row + 1):
            for col in range(min_col, max_col + 1):
                idx = grid.idx(col, row)
                if not grid.land[idx]:
                    continue
                pt = grid.point(idx)
                if point_in_polygon(pt, river.channel_poly):
                    grid.land[idx] = False


def prebuild_lakes(grid: TerrainGrid, cfg: AtlasConfig, rng: random.Random) -> tuple[dict[str, LakeBody], dict[str, set[int]]]:
    """Generate lakes procedurally in low-elevation interior areas."""
    lakes_by_name: dict[str, LakeBody] = {}
    masks: dict[str, set[int]] = {}

    num_lakes = rng.randint(2, 5)

    # Find candidate lake locations: interior land cells with low-medium elevation
    candidates: list[tuple[int, float]] = []
    for idx in range(grid.size):
        if grid.land[idx] and grid.coast_distance[idx] > 40:
            # Prefer mid-low elevations (valleys)
            elev = grid.elevation[idx]
            if 0.15 < elev < 0.55:
                candidates.append((idx, elev))

    if not candidates:
        return lakes_by_name, masks

    # Sort by elevation (prefer valleys)
    candidates.sort(key=lambda x: x[1])

    # Pick lake centers with minimum spacing
    lake_names = rng.sample(LAKE_NAME_POOL, min(num_lakes, len(LAKE_NAME_POOL)))
    chosen_centers: list[Point] = []
    min_lake_spacing = cfg.width * 0.15

    for idx, elev in candidates:
        if len(chosen_centers) >= num_lakes:
            break
        pt = grid.point(idx)
        # Check spacing from existing lakes
        too_close = False
        for existing in chosen_centers:
            if distance(pt, existing) < min_lake_spacing:
                too_close = True
                break
        if not too_close:
            chosen_centers.append(pt)

    for i, center in enumerate(chosen_centers):
        name = lake_names[i] if i < len(lake_names) else f"Lake {i+1}"
        radius = rng.uniform(0.030, 0.060) * min(cfg.width, cfg.height)
        polygon = create_lake_polygon(center, radius, grid, rng)
        center_idx = nearest_land_idx(grid, center)
        outlet_idx = basin_outlet_idx(grid, polygon, center_idx)
        lakes_by_name[name] = LakeBody(
            name=name,
            polygon=polygon,
            label_xy=(center[0], center[1] + 18.0),
            center=center,
            radius=radius,
            outlet_idx=outlet_idx,
        )
        masks[name] = lake_cells(grid, polygon)

    return lakes_by_name, masks




def _snap_waypoint_to_land(grid: TerrainGrid, pt: Point) -> Point:
    """Snap a waypoint to the nearest land cell center."""
    col = int(clamp(pt[0] / grid.step, 0, grid.cols - 1))
    row = int(clamp(pt[1] / grid.step, 0, grid.rows - 1))
    idx = grid.idx(col, row)
    if grid.land[idx]:
        return grid.point(idx)
    # Search outward for nearest land cell
    for radius in range(1, 20):
        best_d = float("inf")
        best_pt = pt
        for dr in range(-radius, radius + 1):
            for dc in range(-radius, radius + 1):
                nc, nr = col + dc, row + dr
                if not grid.inside(nc, nr):
                    continue
                ni = grid.idx(nc, nr)
                if not grid.land[ni]:
                    continue
                d = distance(pt, grid.point(ni))
                if d < best_d:
                    best_d = d
                    best_pt = grid.point(ni)
        if best_d < float("inf"):
            return best_pt
    return pt


def generate_rivers_and_lakes(
    grid: TerrainGrid,
    cfg: AtlasConfig,
    mountain_ranges: Sequence[MountainRange],
    rng: random.Random,
) -> tuple[list[RiverPath], list[LakeBody], set[int]]:
    """Template-based river system matching the Cardonia reference.

    Instead of procedural extraction, rivers follow hand-crafted waypoint
    chains (RIVER_ROUTES) that are interpolated into smooth Catmull-Rom
    curves.  This guarantees non-crossing, geographically deliberate paths.
    """
    # --- 1. Build lakes ---
    lakes_by_name, lake_masks = prebuild_lakes(grid, cfg, rng)

    # --- 2. Convert river templates to smooth RiverPath objects ---
    rivers: list[RiverPath] = []
    river_barrier: set[int] = set()

    for route in RIVER_ROUTES:
        # Convert fractional waypoints to pixel coords, snapped to land
        raw_pts: list[Point] = []
        for wx, wy in route.waypoints:
            pixel_pt = (wx * cfg.width, wy * cfg.height)
            snapped = _snap_waypoint_to_land(grid, pixel_pt)
            raw_pts.append(snapped)

        if len(raw_pts) < 2:
            continue

        # If lake_source, prepend the lake center as the starting point
        if route.lake_source and route.lake_source in lakes_by_name:
            lake = lakes_by_name[route.lake_source]
            raw_pts[0] = lake.center

        # Add organic jitter to interior waypoints for natural variation
        jitter_amp = 18.0
        for i in range(1, len(raw_pts) - 1):
            raw_pts[i] = (
                raw_pts[i][0] + rng.uniform(-jitter_amp, jitter_amp),
                raw_pts[i][1] + rng.uniform(-jitter_amp, jitter_amp),
            )

        # Catmull-Rom interpolation for smooth base curve
        splined = catmull_rom_chain(raw_pts, subdivisions=14, alpha=0.5)
        # Add natural meander — rivers should curve gently, not run straight
        path_len = sum(distance(splined[i], splined[i + 1]) for i in range(len(splined) - 1))
        amp = clamp(path_len * 0.032, 6.0, 30.0)
        meandered = _add_meanders(splined, amplitude=amp, wavelength=3.0)
        # Final smoothing polish
        river_points = mild_smooth_polyline(meandered, passes=8, blend=0.30)

        # Trim points that are outside land (near coast) to prevent bleedthrough
        trimmed: list[Point] = []
        for pt in river_points:
            col = int(clamp(pt[0] / grid.step, 0, grid.cols - 1))
            row = int(clamp(pt[1] / grid.step, 0, grid.rows - 1))
            idx = grid.idx(col, row)
            if grid.land[idx] and grid.coast_distance[idx] >= 2:
                trimmed.append(pt)
            elif trimmed:
                # Keep one more point at the coast edge, then stop
                trimmed.append(pt)
                break
        river_points = trimmed if len(trimmed) >= 4 else river_points

        if len(river_points) < 4:
            continue

        # Per-point widths: natural taper — thin at source, widening toward mouth
        tier = route.width_tier
        w_start = 0.6 + tier * 0.8   # narrow at source: trunk=1.4, branch=1.1
        w_end = 1.5 + tier * 2.5     # wide at mouth:    trunk=4.0, branch=3.3
        n_pts = len(river_points)
        per_point_widths: list[float] = []
        for si in range(n_pts):
            frac = si / max(n_pts - 1, 1)
            # Concave taper: slow widening early, faster near mouth
            pw = w_start + (w_end - w_start) * (frac ** 1.6)
            pw = clamp(pw, 0.3, 5.0)
            per_point_widths.append(pw)

        width = clamp(tier * 5.0, 0.8, 7.0)

        # Find grid cells near the river for barrier
        river_cells: set[int] = set()
        for pt in river_points[::max(1, len(river_points) // 60)]:
            col = int(clamp(pt[0] / grid.step, 0, grid.cols - 1))
            row = int(clamp(pt[1] / grid.step, 0, grid.rows - 1))
            idx = grid.idx(col, row)
            river_cells.add(idx)
            for nb in grid.neighbors4(idx):
                river_cells.add(nb)

        # Build channel polygon — narrower for natural carved look
        w_scale = 2.5 * tier + 2.0   # trunk=4.5, branch=3.5, minor=3.0
        channel_poly = build_river_channel_polygon(
            river_points, per_point_widths,
            width_scale=w_scale, min_half_w=1.8, max_half_w=14.0,
        )

        rivers.append(RiverPath(
            river_points, width, river_cells,
            grid_cells_len=len(river_points),
            widths=per_point_widths,
            channel_poly=channel_poly if len(channel_poly) >= 3 else None,
        ))
        river_barrier.update(river_cells)

    # Sort: widest (trunk) rivers last so they render on top
    rivers.sort(key=lambda r: r.width)

    all_lakes = list(lakes_by_name.values())
    return rivers, all_lakes, river_barrier


RIVER_NAME_POOL: list[str] = [
    "River Tyne", "River Alder", "River Grennel", "Silvervein", "Mistwater",
    "River Ash", "Serpent Run", "Goldbrook", "River Dusk", "River Thane",
    "Stoneflow", "Ironwash", "River Fern", "Crestfall", "Dewrun",
]


def assign_regions(grid: TerrainGrid, cfg: AtlasConfig, region_templates: Sequence[RegionTemplate],
                   river_barrier: set[int]) -> list[RegionModel]:
    costs = [float("inf")] * grid.size
    queue: list[tuple[float, int, int]] = []

    for region_idx, region in enumerate(region_templates):
        seed_idx = nearest_land_idx(grid, px(region.seed, cfg))
        costs[seed_idx] = 0.0
        grid.owner[seed_idx] = region_idx
        heapq.heappush(queue, (0.0, region_idx, seed_idx))

    while queue:
        cost, region_idx, idx = heapq.heappop(queue)
        if cost > costs[idx] + 1e-9:
            continue
        for nb in grid.neighbors4(idx):
            if not grid.land[nb]:
                continue
            ridge_penalty = ((grid.ridge_strength[idx] + grid.ridge_strength[nb]) * 0.5) ** 2 * 9.5
            river_penalty = 28.0 if idx in river_barrier or nb in river_barrier else 0.0
            slope_penalty = abs(grid.elevation[idx] - grid.elevation[nb]) * 4.2
            new_cost = cost + 1.0 + ridge_penalty + river_penalty + slope_penalty
            if new_cost >= costs[nb]:
                continue
            costs[nb] = new_cost
            grid.owner[nb] = region_idx
            heapq.heappush(queue, (new_cost, region_idx, nb))

    region_models: list[RegionModel] = []
    for region_idx, region in enumerate(region_templates):
        cells = [idx for idx in range(grid.size) if grid.owner[idx] == region_idx and grid.land[idx]]
        if not cells:
            label_xy = px(region.label_hint, cfg)
        else:
            label_idx = nearest_land_idx(grid, px(region.label_hint, cfg), preferred_owner=region_idx)
            label_xy = grid.point(label_idx)
        projected_cities: list[CityTemplate] = []
        for city in region.cities:
            city_idx = nearest_land_idx(grid, px(city.target, cfg), preferred_owner=region_idx)
            city_xy = grid.point(city_idx)
            projected_cities.append(CityTemplate(city.name, (city_xy[0] / cfg.width, city_xy[1] / cfg.height), city.capital, city.label_offset))
        region_models.append(RegionModel(region, cells, label_xy, projected_cities))
    return region_models


def polygon_area(points: Sequence[Point]) -> float:
    area = 0.0
    for index, start in enumerate(points):
        end = points[(index + 1) % len(points)]
        area += start[0] * end[1] - end[0] * start[1]
    return abs(area) * 0.5


def convex_hull(points: Sequence[Point]) -> list[Point]:
    keyed = sorted({(round(p[0], 5), round(p[1], 5)) for p in points})
    pts = [(float(a), float(b)) for a, b in keyed]
    if len(pts) <= 2:
        return list(pts)

    def cross(o: Point, a: Point, b: Point) -> float:
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower: list[Point] = []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    upper: list[Point] = []
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]


def mainland_shape_metrics(mainland: Sequence[Point]) -> tuple[float, float]:
    """(bbox_fill_ratio, area/convex_hull_area). Lower hull ratio ⇒ more gulfs / indentations."""
    left, top, right, bottom = polygon_bounds(mainland)
    w, h = right - left, bottom - top
    fill_ratio = polygon_area(mainland) / max(w * h, 1e-9)
    hull_a = polygon_area(convex_hull(mainland))
    convexity = polygon_area(mainland) / max(hull_a, 1e-9)
    return fill_ratio, convexity


def polygon_bounds(points: Sequence[Point]) -> Rect:
    return (
        min(point[0] for point in points),
        min(point[1] for point in points),
        max(point[0] for point in points),
        max(point[1] for point in points),
    )


def river_sinuosity(points: Sequence[Point]) -> float:
    if len(points) < 2:
        return 0.0
    path_len = sum(distance(start, end) for start, end in zip(points, points[1:]))
    chord = max(distance(points[0], points[-1]), 1.0)
    return path_len / chord


def turn_count(points: Sequence[Point]) -> int:
    turns = 0
    prev_angle: float | None = None
    for start, end in zip(points, points[1:]):
        angle = math.atan2(end[1] - start[1], end[0] - start[0])
        if prev_angle is not None:
            delta = abs((angle - prev_angle + math.pi) % (math.tau) - math.pi)
            if delta > 0.28:
                turns += 1
        prev_angle = angle
    return turns


def orientation(a: Point, b: Point, c: Point) -> float:
    return (b[1] - a[1]) * (c[0] - b[0]) - (b[0] - a[0]) * (c[1] - b[1])


def on_segment(a: Point, b: Point, c: Point) -> bool:
    return (
        min(a[0], c[0]) - 1e-6 <= b[0] <= max(a[0], c[0]) + 1e-6
        and min(a[1], c[1]) - 1e-6 <= b[1] <= max(a[1], c[1]) + 1e-6
    )


def segments_intersect(p1: Point, q1: Point, p2: Point, q2: Point) -> bool:
    o1 = orientation(p1, q1, p2)
    o2 = orientation(p1, q1, q2)
    o3 = orientation(p2, q2, p1)
    o4 = orientation(p2, q2, q1)

    if o1 * o2 < 0 and o3 * o4 < 0:
        return True
    if abs(o1) < 1e-6 and on_segment(p1, p2, q1):
        return True
    if abs(o2) < 1e-6 and on_segment(p1, q2, q1):
        return True
    if abs(o3) < 1e-6 and on_segment(p2, p1, q2):
        return True
    if abs(o4) < 1e-6 and on_segment(p2, q1, q2):
        return True
    return False


def has_self_crossing(points: Sequence[Point]) -> bool:
    if len(points) < 5:
        return False
    for first in range(len(points) - 1):
        a1 = points[first]
        a2 = points[first + 1]
        for second in range(first + 2, len(points) - 1):
            if second == first + 1:
                continue
            b1 = points[second]
            b2 = points[second + 1]
            if a1 == b1 or a1 == b2 or a2 == b1 or a2 == b2:
                continue
            if segments_intersect(a1, a2, b1, b2):
                return True
    return False


def lake_connected_to_river(lake: LakeBody, rivers: Sequence[RiverPath], grid: TerrainGrid) -> bool:
    """Lake is on the hydro network if a river meets the water body or its near-shore band."""
    mask = lake_cells(grid, lake.polygon)
    if not mask:
        return False
    shore = dilate_cell_set(grid, mask, 9)
    for river in rivers:
        if river.cells & mask or river.cells & shore:
            return True
    reach = max(100.0, lake.radius * 2.2)
    for river in rivers:
        if min(distance(point, lake.center) for point in river.points) <= reach:
            return True
    return False


def river_merges_into_network(index: int, river: RiverPath, rivers: Sequence[RiverPath], tolerance: float) -> bool:
    endpoint = river.points[-1]
    for other_index, other in enumerate(rivers):
        if other_index == index:
            continue
        if min(distance(endpoint, point) for point in other.points) <= tolerance:
            return True
    return False


def validate_scene(scene: AtlasScene, cfg: AtlasConfig) -> tuple[bool, str]:
    # Validate the actual generated mainland (not a template)
    # Note: mainland is already in pixel coordinates, don't scale again
    mainland_pts = scene.mainland
    left, top, right, bottom = polygon_bounds(mainland_pts)
    width = right - left
    height = bottom - top

    # Relaxed constraints to allow procedural variety
    # Procedurally generated continents have more variation, so be more permissive
    aspect_ratio = width / max(height, 1.0)
    if not (0.5 <= aspect_ratio <= 4.0):
        return False, "continent silhouette has invalid aspect ratio"

    # Require at least some meaningful land
    if width < cfg.width * 0.10 or height < cfg.height * 0.10:
        return False, "continent is too small"

    bbox_fill, hull_convexity = mainland_shape_metrics(mainland_pts)
    if bbox_fill > 0.95:
        return False, "continent silhouette is too oval-like"

    # Hull convexity check (too convex = not enough bays/gulfs)
    # Relaxed for procedural generation
    if hull_convexity > 0.96:
        return False, "continent lacks sufficient coastline irregularity"

    # River validation — skip if rivers are disabled
    if scene.rivers:
        if len(scene.rivers) < 2:
            return False, "not enough valid river systems"
        for river in scene.rivers:
            if has_self_crossing(river.points):
                return False, "a river crosses itself"

    # Region balance validation
    if scene.regions and len(scene.regions) > 1:
        largest_region = max(len(region.cells) for region in scene.regions)
        smallest_region = min(len(region.cells) for region in scene.regions if region.cells)
        if smallest_region > 0 and largest_region / smallest_region > 15.0:
            return False, "region growth ignored terrain and became too imbalanced"

    return True, "ok"


def identify_forest_cells(grid: TerrainGrid, cfg: AtlasConfig, mountain_ranges: list[MountainRange]) -> list[int]:
    """Identify forest cells: mid-elevation land far from coast and mountains."""
    forest_cells = []
    ridge_points_px: list[Point] = []

    # Collect all ridge points (in pixel coordinates)
    for ridge in mountain_ranges:
        for ridge_pt in ridge.points:
            ridge_points_px.append(ridge_pt)

    # Check each land cell for forest criteria
    for idx in range(grid.size):
        if not grid.land[idx]:
            continue

        # Elevation between 0.15 and 0.60 (more permissive)
        if not (0.15 <= grid.elevation[idx] <= 0.60):
            continue

        # Far from coast (coast_distance > 15 grid cells)
        if grid.coast_distance[idx] <= 15:
            continue

        idx_pt = grid.point(idx)

        # Not near mountains (distance > 100px from any ridge point)
        min_ridge_dist = 100.0
        far_from_mountains = True
        for ridge_pt in ridge_points_px:
            if distance(idx_pt, ridge_pt) < min_ridge_dist:
                far_from_mountains = False
                break

        if far_from_mountains:
            forest_cells.append(idx)

    return forest_cells


def _build_channel_poly(points: list[Point], widths: list[float]) -> list[Point]:
    """Build a closed polygon outlining the river channel."""
    if len(points) < 2:
        return []
    left_bank: list[Point] = []
    right_bank: list[Point] = []
    for i, (px, py) in enumerate(points):
        # Get tangent direction
        if i == 0:
            tx, ty = points[1][0] - px, points[1][1] - py
        elif i == len(points) - 1:
            tx, ty = px - points[-2][0], py - points[-2][1]
        else:
            tx, ty = points[i + 1][0] - points[i - 1][0], points[i + 1][1] - points[i - 1][1]
        tlen = math.sqrt(tx * tx + ty * ty) or 1e-8
        nx, ny = -ty / tlen, tx / tlen  # perpendicular
        hw = widths[i] * 0.5 if widths else 1.5
        left_bank.append((px + nx * hw, py + ny * hw))
        right_bank.append((px - nx * hw, py - ny * hw))
    # Close: left forward + right reversed
    poly = left_bank + list(reversed(right_bank))
    poly.append(poly[0])  # close the polygon
    return poly


def _smooth_river_path(points: list[Point]) -> list[Point]:
    """Simple smoothing: average each point with neighbors."""
    if len(points) < 3:
        return points
    smoothed = [points[0]]
    for i in range(1, len(points) - 1):
        x = (points[i - 1][0] + points[i][0] + points[i + 1][0]) / 3.0
        y = (points[i - 1][1] + points[i][1] + points[i + 1][1]) / 3.0
        smoothed.append((x, y))
    smoothed.append(points[-1])
    return smoothed


def generate_procedural_rivers(
    grid: TerrainGrid, cfg: AtlasConfig, rng: random.Random, lakes: list[LakeBody]
) -> list[RiverPath]:
    """Generate procedural rivers using flow direction and accumulation."""
    rivers: list[RiverPath] = []

    # Step 1: Compute flow direction (D8 steepest descent)
    for idx in range(grid.size):
        if not grid.land[idx]:
            continue

        best_neighbor = -1
        best_elev = grid.elevation[idx]

        # Check all 8 neighbors for lowest elevation
        for neighbor_idx, _, _ in grid.neighbors8(idx):
            if grid.land[neighbor_idx] and grid.elevation[neighbor_idx] < best_elev:
                best_elev = grid.elevation[neighbor_idx]
                best_neighbor = neighbor_idx

        grid.flow_direction[idx] = best_neighbor

    # Step 2: Compute flow accumulation
    # Sort cells by elevation (highest first)
    cells_by_elev = sorted(
        (idx for idx in range(grid.size) if grid.land[idx]),
        key=lambda idx: -grid.elevation[idx]
    )

    for idx in cells_by_elev:
        grid.flow_accumulation[idx] = 1.0  # Start with self
        next_idx = grid.flow_direction[idx]
        if next_idx >= 0 and next_idx != idx:
            grid.flow_accumulation[next_idx] += grid.flow_accumulation[idx]

    # Step 3: Find river sources (high accumulation, inland)
    min_coast_dist = 20  # coast_distance > 20
    candidate_sources = [
        idx
        for idx in range(grid.size)
        if grid.land[idx]
        and grid.coast_distance[idx] > min_coast_dist
        and grid.flow_accumulation[idx] > 30.0  # accumulation threshold
    ]

    # Sort by accumulation, pick top ones with spacing constraint
    candidate_sources.sort(key=lambda idx: -grid.flow_accumulation[idx])

    min_source_spacing = 200.0  # pixels
    selected_sources = []
    for idx in candidate_sources:
        pt = grid.point(idx)
        ok = True
        for other_idx in selected_sources:
            other_pt = grid.point(other_idx)
            if distance(pt, other_pt) < min_source_spacing:
                ok = False
                break
        if ok:
            selected_sources.append(idx)
            if len(selected_sources) >= 6:
                break

    # If we have too few sources, pick at least 3
    if len(selected_sources) < 3 and len(candidate_sources) > 0:
        selected_sources = candidate_sources[: max(3, len(candidate_sources) // 2)]

    # Limit to 3-6 major rivers
    num_rivers = min(6, max(3, len(selected_sources)))
    selected_sources = selected_sources[:num_rivers]

    # Step 4: Trace each river from source to coast
    lake_cells = set()
    for lake in lakes:
        for idx in range(grid.size):
            if point_in_polygon(grid.point(idx), lake.polygon):
                lake_cells.add(idx)

    for source_idx in selected_sources:
        path_indices = []
        visited = set()
        idx = source_idx

        # Trace downhill until we hit coast or leave land
        while idx >= 0 and idx not in visited:
            visited.add(idx)
            path_indices.append(idx)

            # If we hit a lake, skip to its outlet
            if idx in lake_cells:
                for lake in lakes:
                    if lake.outlet_idx is not None and lake.outlet_idx in lake_cells:
                        idx = lake.outlet_idx
                        break
                else:
                    break  # No outlet found

            # Move to next cell downstream
            next_idx = grid.flow_direction[idx]
            if next_idx < 0 or next_idx == idx:
                break
            if not grid.land[next_idx]:
                # Include the coast point as the river mouth
                path_indices.append(next_idx)
                break
            idx = next_idx

        # Skip if path is too short
        if len(path_indices) < 10:
            continue

        # Convert indices to pixel points
        pixel_points = [grid.point(idx) for idx in path_indices]

        # Smooth the path
        smoothed_points = _smooth_river_path(pixel_points)
        if len(smoothed_points) < 2:
            continue

        # Create per-point widths (taper from thin at source to thick at mouth)
        widths = []
        for i in range(len(smoothed_points)):
            t = i / max(1, len(smoothed_points) - 1)
            w = 2.5 + (10.0 - 2.5) * (t ** 0.7)  # Taper from 2.5 to 10.0, faster widening
            widths.append(w)

        # Build channel polygon
        channel_poly = _build_channel_poly(smoothed_points, widths)
        if not channel_poly:
            continue

        # Create RiverPath
        river = RiverPath(
            points=smoothed_points,
            width=3.0,  # base width
            cells=set(path_indices),
            grid_cells_len=len(path_indices),
            widths=widths,
            channel_poly=channel_poly,
        )
        rivers.append(river)

    return rivers


def generate_pois(grid: TerrainGrid, cfg: AtlasConfig, rng: random.Random, regions: list[RegionModel], lakes: list[LakeBody]) -> list[tuple[Point, str, str]]:
    """Generate 4-8 points of interest placed on land with Poisson-disk spacing."""
    pois = []
    num_pois = rng.randint(4, 8)

    # Collect city positions and lake centers for avoidance
    blocked_points = []
    for region in regions:
        for city in region.cities:
            blocked_points.append(city.target)
    for lake in lakes:
        blocked_points.append(lake.center)

    # Collect land points
    land_points = [grid.point(idx) for idx in range(grid.size) if grid.land[idx]]

    # Poisson-disk sampling: place POIs with minimum separation
    min_poi_distance = 0.10 * cfg.width  # normalized distance

    for attempt in range(num_pois * 10):
        if len(pois) >= num_pois:
            break

        # Pick a random land point
        if not land_points:
            break
        candidate = rng.choice(land_points)

        # Check distance to existing POIs and blocked points
        ok = True
        for existing_poi, _, _ in pois:
            if distance(candidate, existing_poi) < min_poi_distance:
                ok = False
                break
        if ok:
            for blocked_pt in blocked_points:
                blocked_px = px(blocked_pt, cfg)
                if distance(candidate, blocked_px) < min_poi_distance * 0.8:
                    ok = False
                    break

        if ok:
            # Generate POI name and type
            poi_name = rng.choice(POI_PREFIX_POOL) + " " + rng.choice(POI_SUFFIX_POOL)
            poi_type = rng.choice(POI_TYPE_POOL)
            pois.append((candidate, poi_name, poi_type))

    return pois


def build_scene(cfg: AtlasConfig) -> AtlasScene:
    last_reason = "unknown"
    for attempt in range(max(1, cfg.max_attempts)):
        attempt_seed = cfg.seed + attempt * 97
        rng = random.Random(attempt_seed)

        # Generate mainland and extra landmasses procedurally
        mainland, extra_landmasses = generate_landmasses(cfg, rng)

        # Generate islands (based on mainland)
        islands = generate_islands(cfg, rng, mainland)
        # Add extra landmasses as "islands" so they get rendered with the same pipeline
        islands = extra_landmasses + islands

        # Build terrain grid
        grid = TerrainGrid(cfg)
        populate_land_mask(grid, mainland)
        # Populate extra landmasses in the land mask
        for extra_land in extra_landmasses:
            for idx in range(grid.size):
                if not grid.land[idx] and point_in_polygon(grid.point(idx), extra_land):
                    grid.land[idx] = True
        compute_coast_distance(grid)

        # Compute base elevation (without ridges) to find good ridge locations
        compute_elevation_field_base(grid, cfg)

        # Generate ridges procedurally (based on base elevation)
        ridge_templates = generate_ridge_templates(grid, cfg, rng)

        # Convert RidgeTemplate to MountainRange
        mountain_ranges: list[MountainRange] = []
        for ridge in ridge_templates:
            mountain_ranges.append(
                MountainRange(
                    name=ridge.name,
                    points=list(ridge.points),
                    label_xy=ridge.label_xy,
                    label_rotation=ridge.label_rotation,
                    strength=ridge.strength,
                    influence=ridge.influence,
                    peak_stride=ridge.peak_stride,
                )
            )

        # If no procedural ridges found, fall back to hardcoded ones
        if not mountain_ranges:
            for ridge in RIDGE_TEMPLATES:
                chain = build_irregular_ridge_chain(ridge.points, cfg, rng, subdiv_passes=3)
                mountain_ranges.append(
                    MountainRange(
                        name=ridge.name,
                        points=chain,
                        label_xy=px(ridge.label_xy, cfg),
                        label_rotation=ridge.label_rotation,
                        strength=ridge.strength,
                        influence=ridge.influence,
                        peak_stride=ridge.peak_stride,
                    )
                )

        # Recompute elevation with discovered ridges
        compute_elevation_field(grid, cfg, mountain_ranges)

        # Generate basins/lakes procedurally (based on terrain)
        # For now, use the existing prebuild_lakes function with the grid state
        lakes_by_name, _lake_masks = prebuild_lakes(grid, cfg, rng)
        lakes = list(lakes_by_name.values())
        rivers = generate_procedural_rivers(grid, cfg, rng, lakes)
        river_barrier: set[int] = set()

        # Generate regions procedurally (scattered seeds on land)
        region_templates = generate_region_templates(grid, cfg, rng)

        # Assign regions using Voronoi-like growth
        regions = assign_regions(grid, cfg, region_templates, river_barrier)

        # Identify forest cells
        forest_cells = identify_forest_cells(grid, cfg, mountain_ranges)

        # Generate POIs
        pois = generate_pois(grid, cfg, rng, regions, lakes)

        scene = AtlasScene(
            seed=attempt_seed,
            mainland=mainland,
            islands=islands,
            mountain_ranges=mountain_ranges,
            rivers=rivers,
            lakes=lakes,
            regions=regions,
            grid=grid,
            forest_cells=forest_cells,
            pois=pois,
        )
        valid, reason = validate_scene(scene, cfg)
        if valid:
            return scene
        last_reason = reason
    raise RuntimeError(f"Could not generate a valid atlas after {cfg.max_attempts} attempts: {last_reason}")


def add_defs(svg: SvgCanvas, palette: Palette) -> None:
    svg.add_def(
        f"""
        <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="{palette.sea_light}" />
          <stop offset="52%" stop-color="{palette.sea}" />
          <stop offset="100%" stop-color="{palette.sea_deep}" />
        </linearGradient>
        <radialGradient id="seaVignette" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stop-color="{palette.sea_light}" stop-opacity="0.3" />
          <stop offset="100%" stop-color="{palette.sea_deep}" stop-opacity="0.25" />
        </radialGradient>
        <radialGradient id="landGradient" cx="50%" cy="42%" r="72%">
          <stop offset="0%" stop-color="{palette.land_highlight}" />
          <stop offset="60%" stop-color="{palette.land}" />
          <stop offset="100%" stop-color="{palette.land_shade}" />
        </radialGradient>
        <filter id="paperTexture" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.026" numOctaves="2" seed="3" stitchTiles="stitch" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="gray" />
          <feBlend mode="soft-light" in="SourceGraphic" in2="gray" result="textured" />
        </filter>
        <filter id="coastBlur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="coastBlurWide" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="32" />
        </filter>
        <filter id="coastBlurUltra" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="55" />
        </filter>
        <filter id="mountainShadow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        """
    )


def render_background(svg: SvgCanvas, palette: Palette, cfg: AtlasConfig) -> None:
    """Warm sage-green sea with vertical gradient, vignette, and paper texture overlay."""
    svg.element("rect", x=0, y=0, width=cfg.width, height=cfg.height, fill="url(#seaGradient)")
    # Vignette darkens edges
    svg.element("rect", x=0, y=0, width=cfg.width, height=cfg.height, fill="url(#seaVignette)", opacity=0.35)
    svg.element("rect", x=0, y=0, width=cfg.width, height=cfg.height, fill=palette.paper_bg, opacity=0.045, filter="url(#paperTexture)")


def render_land(
    svg: SvgCanvas,
    mainland: Sequence[Point],
    islands: Sequence[Sequence[Point]],
    palette: Palette,
    cfg: AtlasConfig,
    rivers: Sequence[RiverPath] | None = None,
    lakes: Sequence[LakeBody] | None = None,
) -> None:
    """Render landmasses with river channels carved out and water fills visible through.

    River channels are cut from the land using SVG fill-rule='evenodd' in the clip
    path.  The sea/water background shows through the channel gaps, making rivers
    look like natural terrain features — water channels in the continental landmass.
    """
    mainland_path = polygon_path(mainland)
    all_land_paths = [mainland_path] + [polygon_path(isl) for isl in islands]

    # River channel cutout paths for evenodd carving
    cutout_paths: list[str] = []
    if rivers:
        for river in rivers:
            if river.channel_poly and len(river.channel_poly) >= 3:
                cutout_paths.append(polygon_path(river.channel_poly))

    # Clip path with river cutouts carved out via evenodd
    clip_all = " ".join(all_land_paths + cutout_paths)
    svg.add_def(
        f'<clipPath id="mainlandClip"><path d="{clip_all}" fill-rule="evenodd" /></clipPath>'
    )

    # Pure land clip (no cutouts) for coast glow, lake shorelines, and river water fills
    clip_land_only = " ".join(all_land_paths)
    svg.add_def(f'<clipPath id="landOnlyClip"><path d="{clip_land_only}" /></clipPath>')

    # ── Concentric coastal glow rings (outermost first) ──
    mainland_glow = [
        ("coastBlurUltra", 100, palette.coast_glow, 0.06),
        ("coastBlurUltra", 70, palette.coast_glow, 0.10),
        ("coastBlurWide",  48, palette.coast_glow, 0.14),
        ("coastBlur",      26, palette.coast_outer, 0.20),
        (None,             10, palette.coast_outer, 0.28),
    ]
    island_glow = [
        ("coastBlur", 12, palette.coast_glow, 0.12),
        (None,         6, palette.coast_outer, 0.20),
    ]
    for filt, sw, color, op in mainland_glow:
        kwargs = dict(d=mainland_path, fill="none", stroke=color, stroke_width=sw, stroke_linejoin="round", opacity=op)
        if filt:
            kwargs["filter"] = f"url(#{filt})"
        svg.element("path", **kwargs)
    for isl_path in all_land_paths[1:]:
        for filt, sw, color, op in island_glow:
            kwargs = dict(d=isl_path, fill="none", stroke=color, stroke_width=sw, stroke_linejoin="round", opacity=op)
            if filt:
                kwargs["filter"] = f"url(#{filt})"
            svg.element("path", **kwargs)

    # ── River water fills — rendered BEFORE land, visible through carved gaps ──
    if rivers:
        svg.group_open(clip_path="url(#landOnlyClip)")
        for river in rivers:
            if river.channel_poly and len(river.channel_poly) >= 3:
                # Soft shadow underneath for carved-valley depth
                svg.element(
                    "path",
                    d=polygon_path(river.channel_poly),
                    fill="#6a8a7a",
                    stroke="none",
                    opacity="0.20",
                    filter="url(#coastBlur)",
                )
                # Water fill in the channel — sea-tone that shows through carved gap
                svg.element(
                    "path",
                    d=polygon_path(river.channel_poly),
                    fill="#8aaa9c",
                    stroke="none",
                    opacity="0.60",
                )
        svg.group_close()

    # ── Fill all land with parchment gradient (carved channels show through) ──
    for lp in all_land_paths:
        svg.element("path", d=lp, fill="url(#landGradient)", stroke="none",
                     clip_path="url(#mainlandClip)")

    for lp in all_land_paths:
        svg.element("path", d=lp, fill=palette.paper_bg, opacity=0.04,
                     filter="url(#paperTexture)", stroke="none",
                     clip_path="url(#mainlandClip)")

    # ── Coastline stroke ──
    for lp in all_land_paths:
        svg.element("path", d=lp, fill="none", stroke=palette.coast_inner,
                     stroke_width=2.2, stroke_linejoin="round", stroke_linecap="round", opacity=0.50)

    # ── Coastal water lines (Tolkien-style offset shore ripples for depth) ──
    # Thin lines outside the landmass suggesting shallow water contours
    water_line_specs = [
        (5.0, 0.8, 0.18),   # (offset as stroke width, line width, opacity)
        (10.0, 0.6, 0.12),
        (18.0, 0.5, 0.07),
    ]
    for offset_sw, line_w, wl_op in water_line_specs:
        for lp in all_land_paths:
            # Draw a wider invisible stroke that creates the offset effect
            svg.element("path", d=lp, fill="none", stroke=palette.coast_inner,
                         stroke_width=offset_sw, stroke_linejoin="round", stroke_linecap="round",
                         opacity=wl_op, stroke_dasharray="4,8")

    # ── River bank strokes — visible edges defining the carved channels ──
    if rivers:
        for river in rivers:
            if river.channel_poly and len(river.channel_poly) >= 3:
                # Outer bank edge — earthy tone defining the river valley
                svg.element(
                    "path",
                    d=polygon_path(river.channel_poly),
                    fill="none",
                    stroke="#7a7060",
                    stroke_width=1.2,
                    stroke_linejoin="round",
                    opacity="0.35",
                    clip_path="url(#landOnlyClip)",
                )
            # Centerline — the actual water flow visible through the carved channel
            if river.points and len(river.points) >= 2:
                center_d = polyline_path(river.points)
                svg.element(
                    "path",
                    d=center_d,
                    fill="none",
                    stroke="#5a7a6a",
                    stroke_width=max(0.8, river.width * 0.4),
                    stroke_linecap="round",
                    stroke_linejoin="round",
                    opacity="0.40",
                    clip_path="url(#landOnlyClip)",
                )

    # ── Lakes: render ON TOP of land with clear water styling ──
    if lakes:
        svg.group_open(clip_path="url(#landOnlyClip)")
        for lake in lakes:
            if lake.polygon and len(lake.polygon) >= 3:
                lp = polygon_path(lake.polygon)
                # Outer glow — soft halo around the lake
                svg.element(
                    "path", d=lp,
                    fill="none",
                    stroke=palette.coast_glow,
                    stroke_width=8.0,
                    stroke_linejoin="round",
                    opacity="0.20",
                    filter="url(#coastBlur)",
                )
                # Water fill — matches the sea tone
                svg.element(
                    "path", d=lp,
                    fill=palette.lake,
                    stroke="none",
                    opacity="0.85",
                )
                # Inner water highlight — lighter center
                svg.element(
                    "path", d=lp,
                    fill=palette.sea_light,
                    stroke="none",
                    opacity="0.15",
                )
                # Shore outline — clear dark border defining water edge
                svg.element(
                    "path", d=lp,
                    fill="none",
                    stroke=palette.coast_inner,
                    stroke_width=2.2,
                    stroke_linejoin="round",
                    opacity="0.55",
                )
                # Second softer outline for depth
                svg.element(
                    "path", d=lp,
                    fill="none",
                    stroke=palette.coast_outer,
                    stroke_width=4.0,
                    stroke_linejoin="round",
                    opacity="0.18",
                )
        svg.group_close()


def region_rows_to_path(grid: TerrainGrid, cells: Sequence[int]) -> str:
    owned = set(cells)
    commands: list[str] = []
    step = grid.step
    for row in range(grid.rows):
        col = 0
        while col < grid.cols:
            idx = grid.idx(col, row)
            if idx not in owned:
                col += 1
                continue
            start_col = col
            col += 1
            while col < grid.cols and grid.idx(col, row) in owned:
                col += 1
            x = start_col * step
            y = row * step
            w = (col - start_col) * step
            commands.append(f"M{x:.1f},{y:.1f} h{w:.1f} v{step:.1f} h{-w:.1f} Z")
    return " ".join(commands)


def _trace_border_chains(grid: TerrainGrid) -> list[list[Point]]:
    """Trace kingdom border segments into continuous polyline chains, then smooth them.

    Instead of rendering raw grid-cell edges (which look blocky), this collects
    border midpoints and chains adjacent ones into polylines, then applies
    Laplacian smoothing so borders flow like natural map boundaries.
    """
    # Collect border midpoints as a set of (x, y) keyed by position
    border_pts: dict[tuple[float, float], Point] = {}
    adjacency: dict[tuple[float, float], list[tuple[float, float]]] = {}
    step = grid.step

    def _add_edge(p1: tuple[float, float], p2: tuple[float, float]) -> None:
        border_pts[p1] = p1
        border_pts[p2] = p2
        adjacency.setdefault(p1, []).append(p2)
        adjacency.setdefault(p2, []).append(p1)

    for idx in range(grid.size):
        if not grid.land[idx] or grid.owner[idx] < 0:
            continue
        col, row = grid.cr(idx)
        # Check right neighbor
        if col + 1 < grid.cols:
            right_idx = idx + 1
            if grid.land[right_idx] and grid.owner[right_idx] != grid.owner[idx]:
                x = (col + 1) * step
                p1 = (round(x, 1), round(row * step, 1))
                p2 = (round(x, 1), round((row + 1) * step, 1))
                _add_edge(p1, p2)
        # Check bottom neighbor
        if row + 1 < grid.rows:
            bottom_idx = idx + grid.cols
            if grid.land[bottom_idx] and grid.owner[bottom_idx] != grid.owner[idx]:
                y = (row + 1) * step
                p1 = (round(col * step, 1), round(y, 1))
                p2 = (round((col + 1) * step, 1), round(y, 1))
                _add_edge(p1, p2)

    # Chain connected border points into polylines via greedy walk
    visited: set[tuple[float, float]] = set()
    chains: list[list[Point]] = []
    for start_key in border_pts:
        if start_key in visited:
            continue
        chain: list[tuple[float, float]] = [start_key]
        visited.add(start_key)
        # Walk forward
        current = start_key
        while True:
            nbs = [n for n in adjacency.get(current, []) if n not in visited]
            if not nbs:
                break
            nxt = nbs[0]
            chain.append(nxt)
            visited.add(nxt)
            current = nxt
        # Walk backward from start
        current = start_key
        while True:
            nbs = [n for n in adjacency.get(current, []) if n not in visited]
            if not nbs:
                break
            nxt = nbs[0]
            chain.insert(0, nxt)
            visited.add(nxt)
            current = nxt

        if len(chain) >= 3:
            # Subsample long chains for performance
            if len(chain) > 200:
                step_s = max(1, len(chain) // 150)
                chain = chain[::step_s] + [chain[-1]]
            chains.append([(float(p[0]), float(p[1])) for p in chain])

    # Smooth each chain heavily then interpolate for flowing, organic curves
    smoothed_chains: list[list[Point]] = []
    for chain in chains:
        if len(chain) < 3:
            smoothed_chains.append(chain)
            continue
        # Heavy Laplacian smoothing to remove grid staircase
        smoothed = mild_smooth_polyline(chain, passes=20, blend=0.50)
        # Subsample for Catmull-Rom input (too many points = slow)
        if len(smoothed) > 80:
            step_s = max(1, len(smoothed) // 60)
            smoothed = smoothed[::step_s] + [smoothed[-1]]
        # Catmull-Rom interpolation for silky flowing curves
        if len(smoothed) >= 4:
            smoothed = catmull_rom_chain(smoothed, subdivisions=6, alpha=0.5)
        # Final light smoothing pass
        smoothed = mild_smooth_polyline(smoothed, passes=4, blend=0.30)
        smoothed_chains.append(smoothed)
    return smoothed_chains


def render_regions(svg: SvgCanvas, grid: TerrainGrid, regions: Sequence[RegionModel], palette: Palette) -> None:
    svg.group_open(clip_path="url(#mainlandClip)")
    # Region fills — visible tinting so kingdoms are distinct
    for region in regions:
        if not region.cells:
            continue
        svg.element("path", d=region_rows_to_path(grid, region.cells), fill=region.template.fill, opacity=0.42, stroke="none")

    # Trace and smooth border chains for natural flowing boundaries
    border_chains = _trace_border_chains(grid)
    for chain in border_chains:
        if len(chain) < 2:
            continue
        bd = polyline_path(chain)
        # Soft wide glow behind the border for depth/separation
        svg.element(
            "path", d=bd,
            fill="none",
            stroke=palette.border,
            stroke_width=7.0,
            stroke_linecap="round",
            stroke_linejoin="round",
            opacity=0.10,
        )
        # Solid kingdom border line
        svg.element(
            "path", d=bd,
            fill="none",
            stroke=palette.border,
            stroke_width=1.8,
            stroke_linecap="round",
            stroke_linejoin="round",
            opacity=0.45,
        )
    svg.group_close()


def render_land_texture(svg: SvgCanvas, grid: TerrainGrid, palette: Palette, cfg: AtlasConfig) -> None:
    """Subtle elevation contours clipped to land — atlas-style terrain read without icon clutter."""
    render_contour_lines(svg, grid, palette, cfg)


def _trace_contour_chains(grid: TerrainGrid, threshold: float) -> list[list[Point]]:
    """Trace contour lines into connected polyline chains using marching squares.

    Instead of emitting disconnected per-cell segments, we connect adjacent crossing
    points into continuous chains.  This produces smooth, long contour lines like
    the reference Cardonia map.
    """
    step = grid.step

    # Phase 1: collect all crossing segments as (point_a, point_b) keyed by edge
    # Edge key = ((col, row, edge_side)) where edge_side in {0=top,1=right,2=bottom,3=left}
    edge_to_point: dict[tuple[int, int, int], Point] = {}
    cell_crossings: dict[tuple[int, int], list[tuple[Point, Point]]] = {}

    for row in range(grid.rows - 1):
        for col in range(grid.cols - 1):
            tl = grid.idx(col, row)
            tr = grid.idx(col + 1, row)
            bl = grid.idx(col, row + 1)
            br = grid.idx(col + 1, row + 1)
            if not (grid.land[tl] or grid.land[tr] or grid.land[bl] or grid.land[br]):
                continue
            vals = [grid.elevation[tl], grid.elevation[tr], grid.elevation[br], grid.elevation[bl]]
            bits = sum((1 << i) for i, v in enumerate(vals) if v >= threshold)
            if bits == 0 or bits == 15:
                continue
            corners = [
                (col * step, row * step),
                ((col + 1) * step, row * step),
                ((col + 1) * step, (row + 1) * step),
                (col * step, (row + 1) * step),
            ]
            edges_def = [(0, 1), (1, 2), (2, 3), (3, 0)]
            crossings: list[Point] = []
            for a, b in edges_def:
                va, vb = vals[a], vals[b]
                if (va >= threshold) != (vb >= threshold):
                    t = (threshold - va) / (vb - va) if abs(vb - va) > 1e-9 else 0.5
                    t = clamp(t, 0.0, 1.0)
                    cx = corners[a][0] + t * (corners[b][0] - corners[a][0])
                    cy = corners[a][1] + t * (corners[b][1] - corners[a][1])
                    crossings.append((cx, cy))
            if len(crossings) >= 2:
                cell_crossings[(col, row)] = []
                cell_crossings[(col, row)].append((crossings[0], crossings[1]))
                if len(crossings) == 4:
                    cell_crossings[(col, row)].append((crossings[2], crossings[3]))

    # Phase 2: connect segments into chains by proximity
    all_segs: list[tuple[Point, Point]] = []
    for segs in cell_crossings.values():
        all_segs.extend(segs)

    if not all_segs:
        return []

    used = [False] * len(all_segs)
    chains: list[list[Point]] = []
    tolerance = step * 1.5

    for start_i in range(len(all_segs)):
        if used[start_i]:
            continue
        used[start_i] = True
        chain = [all_segs[start_i][0], all_segs[start_i][1]]

        # Extend forward from chain[-1]
        changed = True
        while changed:
            changed = False
            tail = chain[-1]
            best_j = -1
            best_d = tolerance
            best_flip = False
            for j in range(len(all_segs)):
                if used[j]:
                    continue
                d0 = distance(tail, all_segs[j][0])
                d1 = distance(tail, all_segs[j][1])
                if d0 < best_d:
                    best_d = d0
                    best_j = j
                    best_flip = False
                if d1 < best_d:
                    best_d = d1
                    best_j = j
                    best_flip = True
            if best_j >= 0:
                used[best_j] = True
                seg = all_segs[best_j]
                if best_flip:
                    chain.append(seg[0])
                else:
                    chain.append(seg[1])
                changed = True

        # Extend backward from chain[0]
        changed = True
        while changed:
            changed = False
            head = chain[0]
            best_j = -1
            best_d = tolerance
            best_flip = False
            for j in range(len(all_segs)):
                if used[j]:
                    continue
                d0 = distance(head, all_segs[j][0])
                d1 = distance(head, all_segs[j][1])
                if d1 < best_d:
                    best_d = d1
                    best_j = j
                    best_flip = False
                if d0 < best_d:
                    best_d = d0
                    best_j = j
                    best_flip = True
            if best_j >= 0:
                used[best_j] = True
                seg = all_segs[best_j]
                if best_flip:
                    chain.insert(0, seg[1])
                else:
                    chain.insert(0, seg[0])
                changed = True

        if len(chain) >= 3:
            chains.append(chain)

    return chains


def render_contour_lines(svg: SvgCanvas, grid: TerrainGrid, palette: Palette, cfg: AtlasConfig) -> None:
    """Generate topographic contour lines from the elevation grid.

    Uses chain tracing for long smooth contours, then fills gaps with raw segments.
    Every 4th contour is an 'index contour' drawn thicker, like real topographic maps.
    """
    svg.group_open(clip_path="url(#mainlandClip)", opacity=str(cfg.contour_opacity))

    land_elevations = [grid.elevation[i] for i in range(grid.size) if grid.land[i]]
    if not land_elevations:
        svg.group_close()
        return
    min_elev = min(land_elevations)
    max_elev = max(land_elevations)
    elev_range = max_elev - min_elev
    if elev_range < 0.01:
        svg.group_close()
        return

    num_contours = 18
    step = grid.step

    for ci in range(1, num_contours + 1):
        threshold = min_elev + ci * (elev_range / (num_contours + 1))

        # Trace chains for smooth long contours
        chains = _trace_contour_chains(grid, threshold)

        # Build SVG paths from chains
        path_parts: list[str] = []
        chain_coverage: set[tuple[float, float]] = set()
        for chain in chains:
            if len(chain) < 2:
                continue
            # Smooth the chain
            smoothed = mild_smooth_polyline(chain, passes=5, blend=0.42)
            path_parts.append(polyline_path(smoothed))
            for p in chain:
                chain_coverage.add((round(p[0], 0), round(p[1], 0)))

        # Also collect raw marching-squares segments for areas chains missed
        raw_segments: list[str] = []
        for row in range(grid.rows - 1):
            for col in range(grid.cols - 1):
                tl = grid.idx(col, row)
                tr = grid.idx(col + 1, row)
                bl = grid.idx(col, row + 1)
                br = grid.idx(col + 1, row + 1)
                if not (grid.land[tl] or grid.land[tr] or grid.land[bl] or grid.land[br]):
                    continue
                vals = [grid.elevation[tl], grid.elevation[tr], grid.elevation[br], grid.elevation[bl]]
                bits = sum((1 << i) for i, v in enumerate(vals) if v >= threshold)
                if bits == 0 or bits == 15:
                    continue
                corners = [
                    (col * step, row * step),
                    ((col + 1) * step, row * step),
                    ((col + 1) * step, (row + 1) * step),
                    (col * step, (row + 1) * step),
                ]
                edges_def = [(0, 1), (1, 2), (2, 3), (3, 0)]
                crossings: list[Point] = []
                for a, b in edges_def:
                    va, vb = vals[a], vals[b]
                    if (va >= threshold) != (vb >= threshold):
                        t = (threshold - va) / (vb - va) if abs(vb - va) > 1e-9 else 0.5
                        t = clamp(t, 0.0, 1.0)
                        cx = corners[a][0] + t * (corners[b][0] - corners[a][0])
                        cy = corners[a][1] + t * (corners[b][1] - corners[a][1])
                        crossings.append((cx, cy))
                if len(crossings) >= 2:
                    # Only add raw segment if not covered by a chain
                    mid = ((crossings[0][0] + crossings[1][0]) * 0.5,
                           (crossings[0][1] + crossings[1][1]) * 0.5)
                    key = (round(mid[0], 0), round(mid[1], 0))
                    if key not in chain_coverage:
                        raw_segments.append(
                            f"M{crossings[0][0]:.1f},{crossings[0][1]:.1f} L{crossings[1][0]:.1f},{crossings[1][1]:.1f}"
                        )
                    if len(crossings) == 4:
                        mid2 = ((crossings[2][0] + crossings[3][0]) * 0.5,
                                (crossings[2][1] + crossings[3][1]) * 0.5)
                        key2 = (round(mid2[0], 0), round(mid2[1], 0))
                        if key2 not in chain_coverage:
                            raw_segments.append(
                                f"M{crossings[2][0]:.1f},{crossings[2][1]:.1f} L{crossings[3][0]:.1f},{crossings[3][1]:.1f}"
                            )

        is_index = (ci % 5 == 0)
        opacity_fade = 0.40 + 0.35 * (ci / (num_contours + 1))

        # Render smooth chains
        if path_parts:
            sw = 2.0 if is_index else 0.9
            op = opacity_fade * (1.2 if is_index else 0.90)
            svg.element(
                "path",
                d=" ".join(path_parts),
                fill="none",
                stroke=palette.contour,
                stroke_width=f"{sw:.1f}",
                opacity=f"{min(op, 1.0):.2f}",
                stroke_linecap="round",
                stroke_linejoin="round",
            )

        # Render raw gap-fill segments (slightly thinner)
        if raw_segments:
            sw_raw = 1.5 if is_index else 0.6
            op_raw = opacity_fade * (1.0 if is_index else 0.75)
            svg.element(
                "path",
                d=" ".join(raw_segments),
                fill="none",
                stroke=palette.contour,
                stroke_width=f"{sw_raw:.1f}",
                opacity=f"{min(op_raw, 1.0):.2f}",
                stroke_linecap="round",
            )
    svg.group_close()


def render_lakes_and_rivers(svg: SvgCanvas, lakes: Sequence[LakeBody], rivers: Sequence[RiverPath], palette: Palette) -> None:
    """Rivers and lakes are now rendered as carved water channels in render_land().

    This function is kept as a no-op for API compatibility; all water rendering
    happens in render_land() via the clip-path evenodd cutout approach.
    """
    pass  # Water features rendered in render_land()


def render_peak(svg: SvgCanvas, point: Point, size: float, palette: Palette, rng: random.Random) -> None:
    """Painterly mountain peak with shadow side, highlight side, and subtle snow cap."""
    x, y = point
    lean = rng.uniform(-0.08, 0.08)
    height_scale = rng.uniform(0.95, 1.25)
    width_scale = rng.uniform(0.85, 1.15)
    half = size * 0.50 * width_scale
    tip_y = y - size * height_scale

    shadow = (
        f"M{x - half * 1.1:.1f},{y:.1f} "
        f"L{x + lean * size:.1f},{tip_y:.1f} "
        f"L{x:.1f},{y:.1f} Z"
    )
    svg.element("path", d=shadow, fill=palette.mountain_shadow, stroke="none", opacity=0.22)

    highlight = (
        f"M{x:.1f},{y:.1f} "
        f"L{x + lean * size:.1f},{tip_y:.1f} "
        f"L{x + half:.1f},{y:.1f} Z"
    )
    svg.element("path", d=highlight, fill=palette.mountain_fill, stroke="none", opacity=0.28)

    svg.element(
        "path",
        d=f"M{x + lean * size:.1f},{tip_y:.1f} L{x:.1f},{y + 2:.1f}",
        fill="none",
        stroke=palette.mountain,
        stroke_width=0.9,
        opacity=0.35,
        stroke_linecap="round",
    )

    if size > 30:
        snow_h = size * 0.22
        snow = (
            f"M{x + lean * size:.1f},{tip_y:.1f} "
            f"L{x - half * 0.18:.1f},{tip_y + snow_h:.1f} "
            f"L{x + half * 0.15:.1f},{tip_y + snow_h * 0.85:.1f} Z"
        )
        svg.element("path", d=snow, fill=palette.mountain_snow, stroke="none", opacity=0.35)


def render_mountains(svg: SvgCanvas, mountain_ranges: Sequence[MountainRange], palette: Palette, cfg: AtlasConfig) -> None:
    """Subtle mountain relief matching the Cardonia reference style.

    The reference uses contour lines as the primary elevation indicator, with only
    a very soft, wide shadow along ridge spines for depth — no visible dark lines.
    """
    rng = random.Random(cfg.seed + 777)
    svg.group_open(clip_path="url(#mainlandClip)")
    for ridge in mountain_ranges:
        # Smooth the raw ridge waypoints into a flowing curve
        if len(ridge.points) >= 4:
            smooth_ridge = catmull_rom_chain(ridge.points, subdivisions=12, alpha=0.5)
        else:
            smooth_ridge = list(ridge.points)
        smooth_ridge = mild_smooth_polyline(smooth_ridge, passes=3, blend=0.35)
        ridge_d = polyline_path(smooth_ridge)

        # Wide soft shadow along ridge spine — broad atmospheric haze
        svg.element(
            "path",
            d=ridge_d,
            fill="none",
            stroke=palette.mountain_shadow,
            stroke_width=60,
            stroke_linecap="round",
            stroke_linejoin="round",
            opacity=0.05,
            filter="url(#mountainShadow)",
        )
        # Medium shadow layer for depth
        svg.element(
            "path",
            d=ridge_d,
            fill="none",
            stroke=palette.mountain_shadow,
            stroke_width=30,
            stroke_linecap="round",
            stroke_linejoin="round",
            opacity=0.07,
            filter="url(#mountainShadow)",
        )
        # Spine line — the visible ridge crest
        svg.element(
            "path",
            d=ridge_d,
            fill="none",
            stroke=palette.mountain,
            stroke_width=2.0,
            stroke_linecap="round",
            stroke_linejoin="round",
            opacity=0.20,
        )
        # Small tick marks along the smoothed ridge for a hand-drawn feel
        pts = smooth_ridge
        tick_spacing = 28  # pixels between ticks
        accum = 0.0
        for k in range(len(pts) - 1):
            dx = pts[k + 1][0] - pts[k][0]
            dy = pts[k + 1][1] - pts[k][1]
            seg_len = math.hypot(dx, dy)
            if seg_len < 1e-3:
                continue
            accum += seg_len
            if accum < tick_spacing:
                continue
            accum = 0.0
            mx = (pts[k][0] + pts[k + 1][0]) * 0.5
            my = (pts[k][1] + pts[k + 1][1]) * 0.5
            # Perpendicular direction
            nx, ny = -dy / seg_len, dx / seg_len
            tick_len = rng.uniform(6, 14)
            side = rng.choice([-1, 1])
            svg.element(
                "line",
                x1=f"{mx:.1f}", y1=f"{my:.1f}",
                x2=f"{mx + nx * tick_len * side:.1f}",
                y2=f"{my + ny * tick_len * side:.1f}",
                stroke=palette.mountain,
                stroke_width="1.0",
                stroke_linecap="round",
                opacity="0.15",
            )
        if cfg.mountain_peaks:
            peaks = sample_polyline(ridge.points, ridge.peak_stride)
            num_peaks = len(peaks)
            for index, point in enumerate(peaks):
                center_factor = 1.0 - 0.45 * abs(2.0 * index / max(num_peaks - 1, 1) - 1.0)
                scale = center_factor * rng.uniform(0.7, 1.0)
                render_peak(svg, point, 42 * scale, palette, rng)
    svg.group_close()


def render_labels(svg: SvgCanvas, cfg: AtlasConfig, regions: Sequence[RegionModel], lakes: Sequence[LakeBody], mountain_ranges: Sequence[MountainRange], palette: Palette, sea_names: Sequence[str] | None = None) -> list[Rect]:
    reserved: list[Rect] = []

    # ── Region names: medium serif with letter-spacing, collision-aware ──
    for region in regions:
        x, y = region.label_xy
        name = region.template.name
        rbox = text_box(name, x, y, 32, letter_spacing=5)
        # Nudge if overlapping existing labels — generous padding and wide search
        if overlaps(rbox, reserved, padding=24.0):
            found = False
            for dy_off in [0, -35, 35, -70, 70, -105, 105]:
                for dx_off in [0, -60, 60, -120, 120, -180, 180]:
                    rbox2 = text_box(name, x + dx_off, y + dy_off, 32, letter_spacing=5)
                    if not overlaps(rbox2, reserved, padding=24.0):
                        x = x + dx_off
                        y = y + dy_off
                        rbox = rbox2
                        found = True
                        break
                if found:
                    break
        reserved.append(rbox)
        # White halo behind text for contrast
        svg.text(
            name,
            x=f"{x:.1f}",
            y=f"{y:.1f}",
            text_anchor="middle",
            fill="none",
            stroke="#f0ecd8",
            stroke_width=4.5,
            paint_order="stroke",
            font_family="Cinzel, Georgia, serif",
            font_size=32,
            font_weight=700,
            letter_spacing=5,
            opacity=0.75,
        )
        # Main text
        svg.text(
            name,
            x=f"{x:.1f}",
            y=f"{y:.1f}",
            text_anchor="middle",
            fill=palette.text,
            font_family="Cinzel, Georgia, serif",
            font_size=32,
            font_weight=700,
            letter_spacing=5,
            opacity=0.92,
        )
        # Subtitle (e.g., "(Dotharlum)") rendered below in italic
        if region.template.subtitle:
            reserved.append(text_box(region.template.subtitle, x, y + 22, 14))
            svg.text(
                region.template.subtitle,
                x=f"{x:.1f}",
                y=f"{y + 22:.1f}",
                text_anchor="middle",
                fill=palette.text_soft,
                stroke=palette.land,
                stroke_width=1.5,
                paint_order="stroke",
                font_family="Spectral, Georgia, serif",
                font_size=14,
                font_style="italic",
                letter_spacing=2,
                opacity=0.55,
            )

    # ── Mountain range names: italic, slightly rotated, with legible halo ──
    for ridge in mountain_ranges:
        x, y = ridge.label_xy
        mbox = text_box(ridge.name, x, y, 20, letter_spacing=3.5)
        # Aggressively nudge to avoid overlapping region names and other labels
        if overlaps(mbox, reserved, padding=16.0):
            found = False
            for dy_off in [-30, 30, -55, 55, -80, 80, -110, 110]:
                for dx_off in [0, -50, 50, -100, 100]:
                    mbox2 = text_box(ridge.name, x + dx_off, y + dy_off, 20, letter_spacing=3.5)
                    if not overlaps(mbox2, reserved, padding=14.0):
                        x = x + dx_off
                        y = y + dy_off
                        mbox = mbox2
                        found = True
                        break
                if found:
                    break
            if not found:
                # Last resort: skip this label entirely rather than overlap
                continue
        reserved.append(mbox)
        # Halo
        svg.text(
            ridge.name,
            x=f"{x:.1f}",
            y=f"{y:.1f}",
            text_anchor="middle",
            fill="none",
            stroke="#ece6d0",
            stroke_width=4.0,
            paint_order="stroke",
            font_family="Spectral, Georgia, serif",
            font_size=20,
            font_style="italic",
            letter_spacing=3.5,
            opacity=0.75,
            transform=f"rotate({ridge.label_rotation:.1f} {x:.1f} {y:.1f})",
        )
        # Text
        svg.text(
            ridge.name,
            x=f"{x:.1f}",
            y=f"{y:.1f}",
            text_anchor="middle",
            fill=palette.mountain,
            font_family="Spectral, Georgia, serif",
            font_size=20,
            font_style="italic",
            letter_spacing=3.5,
            opacity=0.72,
            transform=f"rotate({ridge.label_rotation:.1f} {x:.1f} {y:.1f})",
        )

    # ── Lake names: italic with halo for legibility over water ──
    for lake in lakes:
        x, y = lake.label_xy
        lbox = text_box(lake.name, x, y, 15)
        if overlaps(lbox, reserved, padding=6.0):
            found = False
            for dy_off in [-18, 18, -30, 30, -45, 45]:
                for dx_off in [0, -30, 30]:
                    lbox2 = text_box(lake.name, x + dx_off, y + dy_off, 15)
                    if not overlaps(lbox2, reserved, padding=6.0):
                        x = x + dx_off
                        y = y + dy_off
                        lbox = lbox2
                        found = True
                        break
                if found:
                    break
        reserved.append(lbox)
        # Halo
        svg.text(
            lake.name,
            x=f"{x:.1f}",
            y=f"{y:.1f}",
            text_anchor="middle",
            fill="none",
            stroke="#a0c4b8",
            stroke_width=3.5,
            paint_order="stroke",
            font_family="Spectral, Georgia, serif",
            font_size=15,
            font_style="italic",
            letter_spacing=1.5,
            opacity=0.70,
        )
        # Text
        svg.text(
            lake.name,
            x=f"{x:.1f}",
            y=f"{y:.1f}",
            text_anchor="middle",
            fill="#3a5a4a",
            font_family="Spectral, Georgia, serif",
            font_size=15,
            font_style="italic",
            letter_spacing=1.5,
            opacity=0.78,
        )

    # ── Sea labels: muted green italic ──
    for i, sea in enumerate(SEA_LABELS):
        x, y = px(sea.xy, cfg)
        name = sea_names[i] if sea_names and i < len(sea_names) else sea.name
        reserved.append(text_box(name, x, y, sea.size))
        svg.text(
            name,
            x=f"{x:.1f}",
            y=f"{y:.1f}",
            text_anchor="middle",
            fill=palette.text_sea,
            stroke=palette.sea,
            stroke_width=2.0,
            paint_order="stroke",
            font_family="Spectral, Georgia, serif",
            font_size=sea.size,
            font_style="italic",
            letter_spacing=4.0,
            opacity=min(sea.opacity + 0.12, 0.65),
            transform=f"rotate({sea.rotation:.1f} {x:.1f} {y:.1f})",
        )
    return reserved


def render_river_labels(svg: SvgCanvas, rivers: Sequence[RiverPath], palette: Palette, cfg: AtlasConfig, reserved: list[Rect]) -> None:
    """Render italic river name labels along the river paths, collision-aware."""
    if not cfg.show_river_labels:
        return
    for spec in RIVER_LABELS:
        if spec.river_index >= len(rivers):
            continue
        river = rivers[spec.river_index]
        pts = river.points
        if len(pts) < 2:
            continue
        # Compute cumulative arc length
        cum = [0.0]
        for i in range(1, len(pts)):
            dx = pts[i][0] - pts[i - 1][0]
            dy = pts[i][1] - pts[i - 1][1]
            cum.append(cum[-1] + math.hypot(dx, dy))
        total = cum[-1]
        if total < 1:
            continue
        target = total * spec.ratio
        for i in range(1, len(cum)):
            if cum[i] >= target:
                t = (target - cum[i - 1]) / max(cum[i] - cum[i - 1], 0.001)
                x = pts[i - 1][0] + t * (pts[i][0] - pts[i - 1][0])
                y = pts[i - 1][1] + t * (pts[i][1] - pts[i - 1][1])
                angle = math.degrees(math.atan2(pts[i][1] - pts[i - 1][1], pts[i][0] - pts[i - 1][0]))
                if angle > 90:
                    angle -= 180
                elif angle < -90:
                    angle += 180
                rbox = text_box(spec.name, x, y - 6, spec.size)
                if overlaps(rbox, reserved, padding=6.0):
                    continue  # skip this river label rather than overlap
                reserved.append(rbox)
                svg.text(
                    spec.name,
                    x=f"{x:.1f}",
                    y=f"{y - 6:.1f}",
                    text_anchor="middle",
                    fill=palette.river_label,
                    font_family="Spectral, Georgia, serif",
                    font_size=spec.size,
                    font_style="italic",
                    letter_spacing=1.5,
                    opacity=spec.opacity,
                    transform=f"rotate({angle:.1f} {x:.1f} {y - 6:.1f})",
                )
                break


def render_cities(svg: SvgCanvas, cfg: AtlasConfig, regions: Sequence[RegionModel], palette: Palette, reserved: list[Rect]) -> None:
    fallback_offsets = [
        (0.0, -22.0, "middle"),
        (22.0, -4.0, "start"),
        (-22.0, -4.0, "end"),
        (0.0, 28.0, "middle"),
        (26.0, 20.0, "start"),
        (-26.0, 20.0, "end"),
        (0.0, -40.0, "middle"),
        (36.0, -16.0, "start"),
        (-36.0, -16.0, "end"),
        (0.0, 44.0, "middle"),
    ]
    for region in regions:
        for city in region.cities:
            x, y = px(city.target, cfg)
            if city.capital:
                # Capital: prominent marker with increased ring and inner cross/star shape
                svg.element("circle", cx=f"{x:.1f}", cy=f"{y:.1f}", r=13.5, fill=palette.city_ring, opacity=0.65)
                svg.element("circle", cx=f"{x:.1f}", cy=f"{y:.1f}", r=9.0, fill="none", stroke=palette.city, stroke_width=1.8, opacity=0.80)
                svg.element("circle", cx=f"{x:.1f}", cy=f"{y:.1f}", r=5.5, fill=palette.city, opacity=0.95)
                # Small inner highlight
                svg.element("circle", cx=f"{x:.1f}", cy=f"{y - 1:.1f}", r=1.8, fill=palette.city_ring, opacity=0.55)
                # Inner cross/star shape (4 small lines crossing at center)
                cross_size = 4.0
                svg.element("line", x1=f"{x - cross_size:.1f}", y1=f"{y:.1f}", x2=f"{x + cross_size:.1f}", y2=f"{y:.1f}", stroke=palette.city_ring, stroke_width=1.0, opacity=0.75)
                svg.element("line", x1=f"{x:.1f}", y1=f"{y - cross_size:.1f}", x2=f"{x:.1f}", y2=f"{y + cross_size:.1f}", stroke=palette.city_ring, stroke_width=1.0, opacity=0.75)
            else:
                radius = 4.5
                # Regular city: simple dot with halo (slightly larger)
                svg.element("circle", cx=f"{x:.1f}", cy=f"{y:.1f}", r=radius + 2.8, fill=palette.city_ring, opacity=0.55)
                svg.element("circle", cx=f"{x:.1f}", cy=f"{y:.1f}", r=radius, fill=palette.city, opacity=0.90)
            if not cfg.show_city_labels:
                continue

            candidates: list[tuple[float, float, str]] = []
            if city.label_offset != (0.0, 0.0):
                dx, dy = city.label_offset
                anchor = "start" if dx > 10 else "end" if dx < -10 else "middle"
                candidates.append((dx, dy, anchor))
            candidates.extend(fallback_offsets)

            chosen: tuple[float, float, str, Rect] | None = None
            for dx, dy, anchor in candidates:
                lx = x + dx
                ly = y + dy
                candidate_box = text_box(city.name, lx, ly, 14, anchor)
                if overlaps(candidate_box, reserved):
                    continue
                chosen = (lx, ly, anchor, candidate_box)
                break
            if chosen is None:
                lx, ly, anchor = x, y - 20.0, "middle"
                candidate_box = text_box(city.name, lx, ly, 14, anchor)
            else:
                lx, ly, anchor, candidate_box = chosen
            reserved.append(candidate_box)
            # City label halo
            svg.text(
                city.name,
                x=f"{lx:.1f}",
                y=f"{ly:.1f}",
                text_anchor=anchor,
                fill="none",
                stroke="#ece6d0",
                stroke_width=4.0,
                paint_order="stroke",
                font_family="Spectral, Georgia, serif",
                font_size=15,
                font_style="italic",
                font_weight=500,
                letter_spacing=0.8,
                opacity=0.80,
            )
            # City label text
            svg.text(
                city.name,
                x=f"{lx:.1f}",
                y=f"{ly:.1f}",
                text_anchor=anchor,
                fill=palette.text,
                font_family="Spectral, Georgia, serif",
                font_size=15,
                font_style="italic",
                font_weight=500,
                letter_spacing=0.8,
                opacity=0.85,
            )


def _build_meandering_road(x1: float, y1: float, x2: float, y2: float,
                            grid: TerrainGrid, seed_val: float) -> list[Point]:
    """Build a meandering road path between two cities that curves around terrain.

    Creates 4-6 intermediate waypoints that are displaced perpendicular to the
    direct line, with bias toward lower elevation to simulate roads going
    through valleys.
    """
    import hashlib
    rng_road = random.Random(int(seed_val * 1000) & 0xFFFFFFFF)
    dx, dy = x2 - x1, y2 - y1
    seg_len = math.hypot(dx, dy)
    if seg_len < 30:
        return [(x1, y1), (x2, y2)]

    # Direction and perpendicular
    ux, uy = dx / seg_len, dy / seg_len
    nx, ny = -uy, ux

    # Create 4-6 intermediate waypoints
    num_mid = rng_road.randint(4, 6)
    waypoints: list[Point] = [(x1, y1)]
    for k in range(1, num_mid + 1):
        frac = k / (num_mid + 1)
        # Base position along the direct line
        bx = x1 + dx * frac
        by = y1 + dy * frac
        # Perpendicular meander — sinusoidal with noise
        wave = math.sin(frac * math.pi * 2.3 + seed_val) * seg_len * 0.08
        wave += rng_road.uniform(-1, 1) * seg_len * 0.04
        # Terrain avoidance: check elevation and nudge toward valleys
        col = int(clamp(bx / grid.step, 0, grid.cols - 1))
        row = int(clamp(by / grid.step, 0, grid.rows - 1))
        idx = grid.idx(col, row)
        if grid.land[idx]:
            elev = grid.elevation[idx]
            # If high elevation, push the road sideways more
            wave += (elev - 0.3) * seg_len * 0.12 * (1 if rng_road.random() > 0.5 else -1)
        # Clamp meander to reasonable range
        wave = clamp(wave, -seg_len * 0.15, seg_len * 0.15)
        wx = bx + nx * wave
        wy = by + ny * wave
        waypoints.append((wx, wy))
    waypoints.append((x2, y2))
    return waypoints


def _build_road_tree(cities: list[tuple[float, float, str, bool, int]]) -> list[tuple[int, int, bool]]:
    """Build a branching road network using a minimum spanning tree.

    Returns list of (city_i, city_j, is_trunk) edges.
    Trunk roads connect capitals; branch roads connect smaller towns
    to the nearest point on the existing trunk network.
    """
    n = len(cities)
    if n < 2:
        return []

    # Step 1: Build MST over capitals only (the main trunk road)
    cap_indices = [i for i in range(n) if cities[i][3]]
    trunk_edges: list[tuple[int, int]] = []

    if len(cap_indices) >= 2:
        # Prim's MST on capitals
        in_tree = {cap_indices[0]}
        candidates = set(cap_indices[1:])
        while candidates:
            best_d = float("inf")
            best_pair = (-1, -1)
            for ci in in_tree:
                cx1, cy1 = cities[ci][0], cities[ci][1]
                for cj in candidates:
                    cx2, cy2 = cities[cj][0], cities[cj][1]
                    d = math.hypot(cx2 - cx1, cy2 - cy1)
                    if d < best_d:
                        best_d = d
                        best_pair = (ci, cj)
            if best_pair[1] < 0:
                break
            trunk_edges.append(best_pair)
            in_tree.add(best_pair[1])
            candidates.discard(best_pair[1])
    elif len(cap_indices) == 1:
        pass  # Single capital, no trunk edges needed

    # Step 2: For each non-capital, connect it to the nearest city
    # already in the network (capital or another connected non-capital).
    # This creates natural branching — towns hang off the trunk.
    connected = set()
    for ci in cap_indices:
        connected.add(ci)
    # If no capitals, seed with city 0
    if not connected:
        connected.add(0)

    branch_edges: list[tuple[int, int]] = []
    non_caps = [i for i in range(n) if i not in connected]

    # Sort non-capitals by distance to nearest connected city (closest first)
    # so the tree grows organically outward
    while non_caps:
        best_d = float("inf")
        best_nc = -1
        best_conn = -1
        for nc in non_caps:
            nx, ny = cities[nc][0], cities[nc][1]
            for ci in connected:
                cx, cy = cities[ci][0], cities[ci][1]
                d = math.hypot(nx - cx, ny - cy)
                if d < best_d:
                    best_d = d
                    best_nc = nc
                    best_conn = ci
        if best_nc < 0:
            break
        branch_edges.append((best_conn, best_nc))
        connected.add(best_nc)
        non_caps.remove(best_nc)

    result: list[tuple[int, int, bool]] = []
    for i, j in trunk_edges:
        result.append((i, j, True))
    for i, j in branch_edges:
        result.append((i, j, False))
    return result


def render_roads(svg: SvgCanvas, cfg: AtlasConfig, regions: Sequence[RegionModel], palette: Palette, grid: TerrainGrid) -> None:
    """Draw branching road network — a main trunk through capitals with
    branches splitting off to smaller towns, like a real road system.
    """
    # Collect all city positions with region index
    all_cities: list[tuple[float, float, str, bool, int]] = []
    for ri, region in enumerate(regions):
        for city in region.cities:
            cx, cy = px(city.target, cfg)
            all_cities.append((cx, cy, city.name, city.capital, ri))

    if len(all_cities) < 2:
        return

    # Build branching tree network
    road_edges = _build_road_tree(all_cities)

    # Render roads inside land clip
    svg.group_open(clip_path="url(#mainlandClip)")
    for i, j, is_trunk in road_edges:
        x1, y1 = all_cities[i][0], all_cities[i][1]
        x2, y2 = all_cities[j][0], all_cities[j][1]
        seg_len = math.hypot(x2 - x1, y2 - y1)
        if seg_len < 1e-6:
            continue

        # Build meandering waypoints
        seed_val = x1 * 0.007 + y1 * 0.011 + x2 * 0.013
        waypoints = _build_meandering_road(x1, y1, x2, y2, grid, seed_val)

        # Smooth with Catmull-Rom for flowing curves
        if len(waypoints) >= 4:
            smooth_pts = catmull_rom_chain(waypoints, subdivisions=8, alpha=0.5)
        else:
            smooth_pts = waypoints
        smooth_pts = mild_smooth_polyline(smooth_pts, passes=4, blend=0.35)

        road_d = polyline_path(smooth_pts)

        # Trunk roads are slightly thicker/bolder than branch roads
        if is_trunk:
            sw_glow, sw_main = 4.5, 2.0
            op_main = 0.65
            dash = "2,7"
        else:
            sw_glow, sw_main = 3.0, 1.4
            op_main = 0.50
            dash = "1,8"

        # Road shadow/glow
        svg.element(
            "path", d=road_d,
            fill="none",
            stroke="#b0a878",
            stroke_width=sw_glow,
            stroke_linecap="round",
            stroke_linejoin="round",
            stroke_dasharray=dash,
            opacity=0.12,
        )
        # Main road — dotted brown line
        svg.element(
            "path", d=road_d,
            fill="none",
            stroke="#6a5a3a",
            stroke_width=sw_main,
            stroke_linecap="round",
            stroke_linejoin="round",
            stroke_dasharray=dash,
            opacity=op_main,
        )
    svg.group_close()


def render_title(svg: SvgCanvas, cfg: AtlasConfig, palette: Palette, map_name: str = "CARDONIA") -> None:
    """Warm gold title at bottom-right — sized to complement, not dominate."""
    svg.text(
        map_name,
        x=f"{cfg.width * 0.828:.1f}",
        y=f"{cfg.height * 0.932:.1f}",
        text_anchor="middle",
        fill=palette.title,
        stroke=palette.land,
        stroke_width=2.0,
        paint_order="stroke",
        font_family="Cinzel, Georgia, serif",
        font_size=int(cfg.width * 0.038),
        font_weight=600,
        letter_spacing=10,
        opacity=0.72,
    )


def render_forests(svg: SvgCanvas, cfg: AtlasConfig, grid: TerrainGrid, forest_cells: list[int], palette: Palette, seed: int = 0) -> None:
    """Render forests as clusters of small stylized tree symbols.

    Uses two glyph types (conifer triangles and deciduous circles) with varied
    sizes and subtle position jitter for a hand-drawn feel.
    """
    if not forest_cells:
        return

    tree_rng = random.Random(seed + 7777)
    conifer_color = "#4a6040"
    deciduous_color = "#5a7048"
    tree_spacing = 24

    svg.group_open(opacity=0.45)

    placed_trees: set[tuple[int, int]] = set()

    for cell_idx in forest_cells:
        cell_x, cell_y = grid.point(cell_idx)

        grid_x = int(cell_x / tree_spacing)
        grid_y = int(cell_y / tree_spacing)

        for dx in [-1, 0, 1]:
            for dy in [-1, 0, 1]:
                grid_key = (grid_x + dx, grid_y + dy)
                if grid_key in placed_trees:
                    continue

                base_px = (grid_x + dx + 0.5) * tree_spacing
                base_py = (grid_y + dy + 0.5) * tree_spacing

                if abs(base_px - cell_x) > tree_spacing + 5 or abs(base_py - cell_y) > tree_spacing + 5:
                    continue

                placed_trees.add(grid_key)

                # Jitter position slightly for hand-drawn feel
                tree_px = base_px + tree_rng.uniform(-3, 3)
                tree_py = base_py + tree_rng.uniform(-3, 3)

                size_var = tree_rng.uniform(0.8, 1.3)

                if tree_rng.random() < 0.6:
                    # Conifer: layered triangles (two overlapping for depth)
                    h = 12 * size_var
                    w = 7 * size_var
                    # Lower triangle
                    p1 = f"M{tree_px:.1f},{tree_py - h*0.3:.1f} L{tree_px - w*0.5:.1f},{tree_py + h*0.5:.1f} L{tree_px + w*0.5:.1f},{tree_py + h*0.5:.1f} Z"
                    svg.element("path", d=p1, fill=conifer_color, stroke="none")
                    # Upper triangle (smaller, overlapping)
                    p2 = f"M{tree_px:.1f},{tree_py - h*0.65:.1f} L{tree_px - w*0.35:.1f},{tree_py:.1f} L{tree_px + w*0.35:.1f},{tree_py:.1f} Z"
                    svg.element("path", d=p2, fill=conifer_color, stroke="none")
                else:
                    # Deciduous: small filled circle with trunk line
                    r = 4.0 * size_var
                    svg.element("circle", cx=f"{tree_px:.1f}", cy=f"{tree_py - r*0.5:.1f}",
                                r=f"{r:.1f}", fill=deciduous_color, stroke="none")
                    # Tiny trunk
                    svg.element("line", x1=f"{tree_px:.1f}", y1=f"{tree_py + r*0.3:.1f}",
                                x2=f"{tree_px:.1f}", y2=f"{tree_py + r*0.9:.1f}",
                                stroke=conifer_color, stroke_width=0.8)

    svg.group_close()


def render_pois(svg: SvgCanvas, cfg: AtlasConfig, pois: list[tuple[Point, str, str]], palette: Palette, reserved: list[Rect]) -> None:
    """Render points of interest as diamond icons with labels, collision-aware."""
    if not pois:
        return

    icon_size = 5
    icon_color = "#8a7050"

    for poi_pt, poi_name, poi_type in pois:
        x, y = poi_pt

        # Draw small diamond icon
        diamond_path = f"M{x:.1f},{y - icon_size:.1f} L{x + icon_size:.1f},{y:.1f} L{x:.1f},{y + icon_size:.1f} L{x - icon_size:.1f},{y:.1f} Z"
        svg.element("path", d=diamond_path, fill=icon_color, stroke="none", opacity=0.65)

        # Try label positions: right, left, above, below
        poi_candidates = [
            (x + icon_size + 8, y + 3, "start"),
            (x - icon_size - 8, y + 3, "end"),
            (x, y - icon_size - 6, "middle"),
            (x, y + icon_size + 12, "middle"),
        ]
        placed = False
        for lx, ly, anchor in poi_candidates:
            rbox = text_box(poi_name, lx, ly, 9, anchor)
            if not overlaps(rbox, reserved, padding=4.0):
                reserved.append(rbox)
                svg.text(
                    poi_name,
                    x=f"{lx:.1f}",
                    y=f"{ly:.1f}",
                    text_anchor=anchor,
                    fill=palette.text_soft,
                    font_family="Spectral, Georgia, serif",
                    font_size=9,
                    font_style="italic",
                    opacity=0.70,
                )
                placed = True
                break
        # If all positions overlap, skip the label entirely


def render_compass_rose(svg: SvgCanvas, cfg: AtlasConfig, palette: Palette) -> None:
    """Render a simple 4-point compass rose in the bottom-left corner."""
    cx = 120
    cy = cfg.height - 120
    radius = 40

    # North point (larger, filled)
    north_path = f"M{cx:.1f},{cy - radius:.1f} L{cx - 8:.1f},{cy - radius + 20:.1f} L{cx:.1f},{cy - radius + 12:.1f} L{cx + 8:.1f},{cy - radius + 20:.1f} Z"
    svg.element("path", d=north_path, fill=palette.text, stroke="none", opacity=0.85)

    # South point (smaller)
    south_path = f"M{cx:.1f},{cy + radius:.1f} L{cx - 6:.1f},{cy + radius - 15:.1f} L{cx:.1f},{cy + radius - 10:.1f} L{cx + 6:.1f},{cy + radius - 15:.1f} Z"
    svg.element("path", d=south_path, fill=palette.text_soft, stroke="none", opacity=0.60)

    # East point
    east_path = f"M{cx + radius:.1f},{cy:.1f} L{cx + radius - 15:.1f},{cy - 6:.1f} L{cx + radius - 10:.1f},{cy:.1f} L{cx + radius - 15:.1f},{cy + 6:.1f} Z"
    svg.element("path", d=east_path, fill=palette.text_soft, stroke="none", opacity=0.60)

    # West point
    west_path = f"M{cx - radius:.1f},{cy:.1f} L{cx - radius + 15:.1f},{cy - 6:.1f} L{cx - radius + 10:.1f},{cy:.1f} L{cx - radius + 15:.1f},{cy + 6:.1f} Z"
    svg.element("path", d=west_path, fill=palette.text_soft, stroke="none", opacity=0.60)

    # Center circle
    svg.element("circle", cx=f"{cx:.1f}", cy=f"{cy:.1f}", r=4, fill=palette.text, opacity=0.70)

    # North label
    svg.text(
        "N",
        x=f"{cx:.1f}",
        y=f"{cy - radius - 15:.1f}",
        text_anchor="middle",
        fill=palette.text,
        font_family="Spectral, Georgia, serif",
        font_size=14,
        font_weight="bold",
        opacity=0.75,
    )


def render_scale_bar(svg: SvgCanvas, cfg: AtlasConfig, palette: Palette) -> None:
    """Render a simple scale bar in the bottom-left, below the compass rose."""
    x = 70
    y = cfg.height - 50
    segment_width = 20
    num_segments = 4

    # Draw alternating black/white segments
    for i in range(num_segments):
        segment_x = x + i * segment_width
        color = "#3a2e10" if i % 2 == 0 else "#e8daba"
        svg.element(
            "rect",
            x=f"{segment_x:.1f}",
            y=f"{y:.1f}",
            width=f"{segment_width:.1f}",
            height="8",
            fill=color,
            stroke=palette.text,
            stroke_width=0.5,
            opacity=0.70,
        )

    # Label
    svg.text(
        "100 leagues",
        x=f"{x + num_segments * segment_width / 2:.1f}",
        y=f"{y + 22:.1f}",
        text_anchor="middle",
        fill=palette.text_soft,
        font_family="Spectral, Georgia, serif",
        font_size=10,
        opacity=0.65,
    )


def render_svg(cfg: AtlasConfig) -> str:
    scene = build_scene(cfg)
    name_rng = random.Random(cfg.seed + 999)

    # Procedurally generated region names are already in scene.regions
    # Just pick a map title
    map_name = name_rng.choice(MAP_NAME_POOL)

    # Randomize sea labels
    sea_names = name_rng.sample(SEA_NAME_POOL, min(len(SEA_LABELS), len(SEA_NAME_POOL)))

    svg = SvgCanvas(cfg.width, cfg.height)
    add_defs(svg, PALETTE)
    render_background(svg, PALETTE, cfg)
    render_land(svg, scene.mainland, scene.islands, PALETTE, cfg,
                rivers=scene.rivers, lakes=scene.lakes)
    render_regions(svg, scene.grid, scene.regions, PALETTE)
    render_land_texture(svg, scene.grid, PALETTE, cfg)
    # Forests disabled — focus on topographic lines, towns, roads
    # render_forests(svg, cfg, scene.grid, scene.forest_cells, PALETTE, seed=scene.seed)
    render_lakes_and_rivers(svg, scene.lakes, scene.rivers, PALETTE)
    render_roads(svg, cfg, scene.regions, PALETTE, scene.grid)
    render_mountains(svg, scene.mountain_ranges, PALETTE, cfg)
    reserved = render_labels(svg, cfg, scene.regions, scene.lakes, scene.mountain_ranges, PALETTE, sea_names)
    render_river_labels(svg, scene.rivers, PALETTE, cfg, reserved)
    render_cities(svg, cfg, scene.regions, PALETTE, reserved)
    render_pois(svg, cfg, scene.pois, PALETTE, reserved)
    render_compass_rose(svg, cfg, PALETTE)
    render_scale_bar(svg, cfg, PALETTE)
    render_title(svg, cfg, PALETTE, map_name)
    return svg.render()


def save_svg(svg_markup: str, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(svg_markup, encoding="utf-8")


def export_png(svg_path: Path, png_path: Path) -> bool:
    try:
        import cairosvg
    except Exception:
        return False
    png_path.parent.mkdir(parents=True, exist_ok=True)
    cairosvg.svg2png(url=str(svg_path), write_to=str(png_path))
    return True


def build_config(args: argparse.Namespace) -> AtlasConfig:
    return AtlasConfig(
        width=args.width,
        height=args.height,
        seed=args.seed,
        grid_step=args.grid_step,
        coastline_step=args.coastline_step,
        coastline_roughness=args.coastline_roughness,
        island_roughness=args.island_roughness,
        ridge_jitter=args.ridge_jitter,
        max_lakes=args.max_lakes,
        max_attempts=args.max_attempts,
        contour_opacity=args.contour_opacity,
        show_city_labels=not args.hide_city_labels,
        show_river_labels=not args.hide_river_labels,
        mountain_peaks=args.mountain_peaks,
        output_svg=Path(args.output_svg).expanduser().resolve(),
        output_png=Path(args.output_png).expanduser().resolve() if args.output_png else None,
    )


def parse_args() -> argparse.Namespace:
    default_svg = Path(__file__).resolve().parent / "generated" / "fantasy_atlas.svg"
    parser = argparse.ArgumentParser(description="Generate a rule-based stylized fantasy atlas SVG.")
    parser.add_argument("--output-svg", default=str(default_svg), help="Path to the SVG file to write.")
    parser.add_argument("--output-png", default="", help="Optional PNG preview path. Requires cairosvg.")
    parser.add_argument("--width", type=int, default=2800)
    parser.add_argument("--height", type=int, default=1800)
    parser.add_argument("--seed", type=int, default=23)
    parser.add_argument("--grid-step", type=int, default=10)
    parser.add_argument("--coastline-step", type=float, default=28.0)
    parser.add_argument("--coastline-roughness", type=float, default=24.0)
    parser.add_argument("--island-roughness", type=float, default=14.0)
    parser.add_argument("--ridge-jitter", type=float, default=10.0)
    parser.add_argument("--max-lakes", type=int, default=3)
    parser.add_argument("--max-attempts", type=int, default=56)
    parser.add_argument("--contour-opacity", type=float, default=0.40)
    parser.add_argument("--hide-city-labels", action="store_true")
    parser.add_argument("--hide-river-labels", action="store_true")
    parser.add_argument("--mountain-peaks", action="store_true", help="Draw painterly peak glyphs instead of smooth ridgelines.")
    return parser.parse_args()


def main() -> int:
    cfg = build_config(parse_args())
    svg_markup = render_svg(cfg)
    save_svg(svg_markup, cfg.output_svg)
    print(f"Saved SVG atlas: {cfg.output_svg}")
    if cfg.output_png:
        if export_png(cfg.output_svg, cfg.output_png):
            print(f"Saved PNG preview: {cfg.output_png}")
        else:
            print("Skipped PNG export because cairosvg is not installed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
    