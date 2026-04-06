#!/usr/bin/env python3
"""
atlas-to-campaign.py — Convert generate_fantasy_atlas.py SVG output into
ATLAS_* JavaScript constants for campaigns.html WorldView component.

Usage:
    python generate_fantasy_atlas.py --output atlas.svg
    python atlas-to-campaign.py atlas.svg > atlas-data.js

Or with JSON intermediate:
    python generate_fantasy_atlas.py --json atlas.json
    python atlas-to-campaign.py --json atlas.json > atlas-data.js
"""

import sys, json, re, math
from xml.etree import ElementTree as ET

# ═══════════════════════════════════════════════════════════════════
# SVG PARSER — extract paths, shapes, text from the atlas SVG
# ═══════════════════════════════════════════════════════════════════

NS = {"svg": "http://www.w3.org/2000/svg"}

def parse_svg(svg_path):
    """Parse atlas SVG and extract structured geometry."""
    tree = ET.parse(svg_path)
    root = tree.getroot()

    # Get viewBox for coordinate mapping
    vb = root.get("viewBox", "0 0 2800 1800")
    parts = vb.split()
    vb_w, vb_h = float(parts[2]), float(parts[3])

    # Scale factor: ATLAS constants use 6000x4400 coordinate space
    sx = 6000 / vb_w
    sy = 4400 / vb_h

    data = {
        "land_paths": [],
        "islands": [],
        "water_bodies": [],
        "rivers": [],
        "sea_labels": [],
        "range_labels": [],
        "mountain_ranges": [],
        "provinces": [],
        "cities": [],
        "pois": [],
        "scale": {"sx": sx, "sy": sy, "vb_w": vb_w, "vb_h": vb_h},
    }

    # Process layers by group id
    for group in root.iter("{http://www.w3.org/2000/svg}g"):
        gid = group.get("id", "")
        gclass = group.get("class", "")

        if gid == "land" or "land" in gclass:
            _extract_land(group, data, sx, sy)
        elif gid == "islands" or "island" in gclass:
            _extract_islands(group, data, sx, sy)
        elif gid == "water" or "lake" in gclass or "water" in gclass:
            _extract_water(group, data, sx, sy)
        elif gid == "rivers" or "river" in gclass:
            _extract_rivers(group, data, sx, sy)
        elif gid == "regions" or "region" in gclass:
            _extract_regions(group, data, sx, sy)
        elif gid == "mountains" or "mountain" in gclass:
            _extract_mountains(group, data, sx, sy)
        elif gid == "cities" or "city" in gclass or "settlement" in gclass:
            _extract_cities(group, data, sx, sy)
        elif gid == "labels" or "label" in gclass:
            _extract_labels(group, data, sx, sy)
        elif gid == "pois" or "poi" in gclass:
            _extract_pois(group, data, sx, sy)

    # If no structured groups found, try flat extraction
    if not data["land_paths"]:
        _extract_flat(root, data, sx, sy)

    return data


def _scale_path(d, sx, sy):
    """Scale all coordinates in an SVG path string."""
    def replace_coords(match):
        cmd = match.group(1)
        coords = match.group(2)
        # Split into number pairs
        nums = re.findall(r'-?[\d.]+', coords)
        scaled = []
        for i, n in enumerate(nums):
            val = float(n)
            scaled.append(str(round(val * (sx if i % 2 == 0 else sy))))
        return cmd + ",".join(scaled)

    return re.sub(r'([MLCQSAZHVmlcqsahvz])\s*([-\d.,\s]+)', replace_coords, d)


def _extract_land(group, data, sx, sy):
    for path in group.iter("{http://www.w3.org/2000/svg}path"):
        d = path.get("d", "")
        if d:
            data["land_paths"].append(_scale_path(d, sx, sy))


def _extract_islands(group, data, sx, sy):
    for path in group.iter("{http://www.w3.org/2000/svg}path"):
        d = path.get("d", "")
        fill = path.get("fill", "#c6ba8d")
        opacity = float(path.get("opacity", "0.95"))
        if d:
            data["islands"].append({
                "path": _scale_path(d, sx, sy),
                "fill": fill,
                "opacity": round(opacity, 2),
            })


def _extract_water(group, data, sx, sy):
    for elem in group:
        tag = elem.tag.replace("{http://www.w3.org/2000/svg}", "")
        label = elem.get("data-label", "") or elem.get("id", "")
        if tag == "path":
            d = elem.get("d", "")
            if d:
                # Estimate label position from path center
                center = _path_center(d)
                data["water_bodies"].append({
                    "shape": "path",
                    "d": _scale_path(d, sx, sy),
                    "label": _humanize(label),
                    "lx": round(center[0] * sx),
                    "ly": round(center[1] * sy),
                })
        elif tag == "ellipse" or tag == "circle":
            cx = float(elem.get("cx", "0"))
            cy = float(elem.get("cy", "0"))
            rx = float(elem.get("rx", elem.get("r", "50")))
            ry = float(elem.get("ry", elem.get("r", "50")))
            data["water_bodies"].append({
                "shape": "ellipse",
                "cx": round(cx * sx),
                "cy": round(cy * sy),
                "rx": round(rx * sx),
                "ry": round(ry * sy),
                "label": _humanize(label),
                "lx": round(cx * sx),
                "ly": round((cy + ry + 15) * sy),
            })


def _extract_rivers(group, data, sx, sy):
    for path in group.iter("{http://www.w3.org/2000/svg}path"):
        d = path.get("d", "")
        if d:
            data["rivers"].append(_scale_path(d, sx, sy))


def _extract_regions(group, data, sx, sy):
    for elem in group:
        tag = elem.tag.replace("{http://www.w3.org/2000/svg}", "")
        if tag == "path":
            d = elem.get("d", "")
            rid = elem.get("id", "") or elem.get("data-region", "")
            fill = elem.get("fill", "#d5c794")
            label = elem.get("data-label", "") or _humanize(rid)
            if d:
                center = _path_center(d)
                bbox = _path_bbox(d)
                data["provinces"].append({
                    "id": _slugify(rid or label),
                    "name": label,
                    "path": _scale_path(d, sx, sy),
                    "labelX": round(center[0] * sx),
                    "labelY": round(center[1] * sy),
                    "cityX": round(center[0] * sx),
                    "cityY": round((center[1] - 60) * sy),
                    "spreadX": round((bbox[2] - bbox[0]) * 0.35 * sx),
                    "spreadY": round((bbox[3] - bbox[1]) * 0.35 * sy),
                    "fill": fill,
                })


def _extract_mountains(group, data, sx, sy):
    for path in group.iter("{http://www.w3.org/2000/svg}path"):
        d = path.get("d", "")
        rid = path.get("id", "") or path.get("data-range", "")
        if d:
            center = _path_center(d)
            data["mountain_ranges"].append({
                "id": _slugify(rid) or ("range-" + str(len(data["mountain_ranges"]))),
                "ridge": _scale_path(d, sx, sy),
                "peaks": [],
            })
            data["range_labels"].append({
                "x": round(center[0] * sx),
                "y": round(center[1] * sy),
                "label": _humanize(rid) if rid else ("Mountain Range " + str(len(data["range_labels"]) + 1)),
                "rotate": 0,
            })


def _extract_cities(group, data, sx, sy):
    for elem in group:
        tag = elem.tag.replace("{http://www.w3.org/2000/svg}", "")
        if tag == "circle" or tag == "use":
            cx = float(elem.get("cx", elem.get("x", "0")))
            cy = float(elem.get("cy", elem.get("y", "0")))
            label = elem.get("data-label", "") or elem.get("id", "")
            data["cities"].append({
                "x": round(cx * sx),
                "y": round(cy * sy),
                "name": _humanize(label),
            })


def _extract_labels(group, data, sx, sy):
    for text in group.iter("{http://www.w3.org/2000/svg}text"):
        x = float(text.get("x", "0"))
        y = float(text.get("y", "0"))
        content = text.text or ""
        if not content.strip():
            # Try tspan children
            for tspan in text.iter("{http://www.w3.org/2000/svg}tspan"):
                if tspan.text:
                    content = tspan.text
                    break
        size = float(text.get("font-size", "14").replace("px", ""))
        transform = text.get("transform", "")
        rotate = 0
        if "rotate" in transform:
            m = re.search(r'rotate\(([-\d.]+)', transform)
            if m:
                rotate = float(m.group(1))
        ltype = text.get("data-type", "")
        if "sea" in ltype or size > 24:
            data["sea_labels"].append({
                "x": round(x * sx),
                "y": round(y * sy),
                "label": content.strip(),
                "rotate": rotate,
                "size": round(size * 1.5),
                "spacing": 8,
                "opacity": 0.3,
            })


def _extract_pois(group, data, sx, sy):
    for elem in group:
        tag = elem.tag.replace("{http://www.w3.org/2000/svg}", "")
        if tag in ("circle", "use", "g"):
            cx = float(elem.get("cx", elem.get("x", "0")))
            cy = float(elem.get("cy", elem.get("y", "0")))
            label = elem.get("data-label", "") or elem.get("id", "")
            ptype = elem.get("data-type", "default")
            data["pois"].append({
                "x": round(cx * sx),
                "y": round(cy * sy),
                "name": _humanize(label),
                "type": ptype,
            })


def _extract_flat(root, data, sx, sy):
    """Fallback: extract all paths from the SVG without group structure."""
    paths = list(root.iter("{http://www.w3.org/2000/svg}path"))
    if not paths:
        return

    # Largest path is likely the mainland
    largest = max(paths, key=lambda p: len(p.get("d", "")))
    data["land_paths"].append(_scale_path(largest.get("d", ""), sx, sy))

    # Remaining paths: categorize by fill color and size
    for path in paths:
        if path is largest:
            continue
        d = path.get("d", "")
        fill = path.get("fill", "").lower()
        stroke = path.get("stroke", "").lower()
        if not d:
            continue
        dlen = len(d)

        # Blue-ish fills → water
        if any(c in fill for c in ("#0", "#1", "#2", "#3", "#4", "#5", "#6", "#7", "#8", "#9", "blue", "aqua", "cyan")) and ("a" in fill or "b" in fill or "c" in fill or "d" in fill or "e" in fill or "f" in fill):
            if dlen < 500:
                center = _path_center(d)
                data["water_bodies"].append({
                    "shape": "path",
                    "d": _scale_path(d, sx, sy),
                    "label": "",
                    "lx": round(center[0] * sx),
                    "ly": round(center[1] * sy),
                })
            else:
                data["rivers"].append(_scale_path(d, sx, sy))
        # Brown/green paths → regions or terrain
        elif dlen > 200:
            center = _path_center(d)
            rid = path.get("id", "") or ("region-" + str(len(data["provinces"])))
            data["provinces"].append({
                "id": _slugify(rid),
                "name": _humanize(rid),
                "path": _scale_path(d, sx, sy),
                "labelX": round(center[0] * sx),
                "labelY": round(center[1] * sy),
                "cityX": round(center[0] * sx),
                "cityY": round((center[1] - 40) * sy),
                "spreadX": 300,
                "spreadY": 250,
                "fill": fill or "#d5c794",
            })


# ═══════════════════════════════════════════════════════════════════
# UTILITIES
# ═══════════════════════════════════════════════════════════════════

def _path_center(d):
    """Approximate center of an SVG path from its coordinates."""
    nums = [float(n) for n in re.findall(r'-?[\d.]+', d)]
    if len(nums) < 2:
        return (0, 0)
    xs = [nums[i] for i in range(0, len(nums), 2)]
    ys = [nums[i] for i in range(1, len(nums), 2)]
    return (sum(xs) / len(xs), sum(ys) / len(ys))


def _path_bbox(d):
    """Approximate bounding box [x1, y1, x2, y2] of an SVG path."""
    nums = [float(n) for n in re.findall(r'-?[\d.]+', d)]
    if len(nums) < 2:
        return (0, 0, 100, 100)
    xs = [nums[i] for i in range(0, len(nums), 2)]
    ys = [nums[i] for i in range(1, len(nums), 2)]
    return (min(xs), min(ys), max(xs), max(ys))


def _humanize(s):
    """Convert slug/id to human-readable name."""
    if not s:
        return ""
    s = re.sub(r'[-_]+', ' ', s)
    return s.strip().title()


def _slugify(s):
    """Convert to slug for JS constant id."""
    if not s:
        return ""
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


# ═══════════════════════════════════════════════════════════════════
# JSON INTERMEDIATE FORMAT (from generate_fantasy_atlas.py --json)
# ═══════════════════════════════════════════════════════════════════

def parse_json(json_path):
    """Parse JSON intermediate output from the atlas generator."""
    with open(json_path) as f:
        raw = json.load(f)

    sx = 6000 / raw.get("width", 2800)
    sy = 4400 / raw.get("height", 1800)

    data = {
        "land_paths": [],
        "islands": [],
        "water_bodies": [],
        "rivers": [],
        "sea_labels": [],
        "range_labels": [],
        "mountain_ranges": [],
        "provinces": [],
        "cities": [],
        "pois": [],
        "scale": {"sx": sx, "sy": sy},
    }

    # Mainland
    if "mainland" in raw:
        data["land_paths"].append(_scale_path(raw["mainland"].get("path", ""), sx, sy))

    # Islands
    for island in raw.get("islands", []):
        data["islands"].append({
            "path": _scale_path(island.get("path", ""), sx, sy),
            "fill": island.get("fill", "#c6ba8d"),
            "opacity": island.get("opacity", 0.95),
        })

    # Regions
    for region in raw.get("regions", []):
        data["provinces"].append({
            "id": _slugify(region.get("id", region.get("name", ""))),
            "name": region.get("name", ""),
            "path": _scale_path(region.get("path", ""), sx, sy),
            "labelX": round(region.get("label_x", 0) * sx),
            "labelY": round(region.get("label_y", 0) * sy),
            "cityX": round(region.get("city_x", region.get("label_x", 0)) * sx),
            "cityY": round(region.get("city_y", region.get("label_y", 0) - 60) * sy),
            "spreadX": round(region.get("spread_x", 300) * sx / (6000 / 2800)),
            "spreadY": round(region.get("spread_y", 250) * sy / (4400 / 1800)),
            "fill": region.get("fill", "#d5c794"),
        })

    # Lakes
    for lake in raw.get("lakes", []):
        data["water_bodies"].append({
            "shape": "path",
            "d": _scale_path(lake.get("path", ""), sx, sy),
            "label": lake.get("name", ""),
            "lx": round(lake.get("label_x", 0) * sx),
            "ly": round(lake.get("label_y", 0) * sy),
        })

    # Rivers
    for river in raw.get("rivers", []):
        data["rivers"].append(_scale_path(river.get("path", ""), sx, sy))

    # Mountains
    for mtn in raw.get("mountains", []):
        data["mountain_ranges"].append({
            "id": _slugify(mtn.get("name", "")),
            "ridge": _scale_path(mtn.get("ridge", ""), sx, sy),
            "peaks": [],
        })
        center = _path_center(mtn.get("ridge", "M0,0"))
        data["range_labels"].append({
            "x": round(center[0] * sx),
            "y": round(center[1] * sy),
            "label": mtn.get("name", "Mountain Range"),
            "rotate": 0,
        })

    # Cities
    for city in raw.get("cities", []):
        data["cities"].append({
            "x": round(city.get("x", 0) * sx),
            "y": round(city.get("y", 0) * sy),
            "name": city.get("name", ""),
        })

    # POIs
    for poi in raw.get("pois", []):
        data["pois"].append({
            "x": round(poi.get("x", 0) * sx),
            "y": round(poi.get("y", 0) * sy),
            "name": poi.get("name", ""),
            "type": poi.get("type", "default"),
        })

    return data


# ═══════════════════════════════════════════════════════════════════
# JAVASCRIPT EMITTER
# ═══════════════════════════════════════════════════════════════════

def emit_js(data, var_prefix="ATLAS"):
    """Emit ATLAS_* JavaScript constants from parsed data."""
    lines = []
    lines.append("/* Auto-generated by atlas-to-campaign.py */")
    lines.append("")

    # ATLAS_LAND_PATH
    land = " ".join(data["land_paths"]) if data["land_paths"] else ""
    lines.append(f'const {var_prefix}_LAND_PATH = "{land}";')
    lines.append("")

    # ATLAS_ISLANDS
    lines.append(f"const {var_prefix}_ISLANDS = [")
    for isl in data["islands"]:
        lines.append(f'  {{ path:"{isl["path"]}", fill:"{isl["fill"]}", opacity:{isl["opacity"]} }},')
    lines.append("];")
    lines.append("")

    # ATLAS_WATER_BODIES
    lines.append(f"const {var_prefix}_WATER_BODIES = [")
    for wb in data["water_bodies"]:
        if wb["shape"] == "ellipse":
            lines.append(f'  {{ shape:"ellipse", cx:{wb["cx"]}, cy:{wb["cy"]}, rx:{wb.get("rx",60)}, ry:{wb.get("ry",40)}, label:"{wb["label"]}", lx:{wb["lx"]}, ly:{wb["ly"]} }},')
        else:
            lines.append(f'  {{ shape:"path", d:"{wb["d"]}", label:"{wb["label"]}", lx:{wb["lx"]}, ly:{wb["ly"]} }},')
    lines.append("];")
    lines.append("")

    # ATLAS_RIVERS
    lines.append(f"const {var_prefix}_RIVERS = [")
    for rv in data["rivers"]:
        lines.append(f'  "{rv}",')
    lines.append("];")
    lines.append("")

    # ATLAS_SEA_LABELS
    lines.append(f"const {var_prefix}_SEA_LABELS = [")
    for sl in data["sea_labels"]:
        lines.append(f'  {{ x:{sl["x"]}, y:{sl["y"]}, label:"{sl["label"]}", rotate:{sl["rotate"]}, size:{sl["size"]}, spacing:{sl["spacing"]}, opacity:{sl["opacity"]} }},')
    lines.append("];")
    lines.append("")

    # ATLAS_RANGE_LABELS
    lines.append(f"const {var_prefix}_RANGE_LABELS = [")
    for rl in data["range_labels"]:
        lines.append(f'  {{ x:{rl["x"]}, y:{rl["y"]}, label:"{rl["label"]}", rotate:{rl["rotate"]} }},')
    lines.append("];")
    lines.append("")

    # ATLAS_MOUNTAIN_RANGES
    lines.append(f"const {var_prefix}_MOUNTAIN_RANGES = [")
    for mr in data["mountain_ranges"]:
        lines.append(f'  {{ id:"{mr["id"]}", ridge:"{mr["ridge"]}", peaks:[] }},')
    lines.append("];")
    lines.append("")

    # ATLAS_PROVINCES
    lines.append(f"const {var_prefix}_PROVINCES = [")
    for prov in data["provinces"]:
        lines.append("  {")
        lines.append(f'    id:"{prov["id"]}", name:"{prov["name"]}", path:"{prov["path"]}",')
        lines.append(f'    labelX:{prov["labelX"]}, labelY:{prov["labelY"]}, cityX:{prov["cityX"]}, cityY:{prov["cityY"]}, spreadX:{prov["spreadX"]}, spreadY:{prov["spreadY"]}, fill:"{prov["fill"]}"')
        lines.append("  },")
    lines.append("];")
    lines.append("")

    # ATLAS_FACTION_SEATS (generated from provinces)
    lines.append(f"const {var_prefix}_FACTION_SEATS = [")
    for i, prov in enumerate(data["provinces"]):
        angle = round((i * 2 * math.pi / max(1, len(data["provinces"]))), 2)
        lines.append(f'  {{ provinceId:"{prov["id"]}", x:{prov["cityX"]}, y:{prov["cityY"]}, spreadX:{prov["spreadX"]}, spreadY:{prov["spreadY"]}, angle:{angle} }},')
    lines.append("];")
    lines.append("")

    # ATLAS_FREE_SEATS (offset from faction seats)
    lines.append(f"const {var_prefix}_FREE_SEATS = [")
    for i, prov in enumerate(data["provinces"]):
        ox = prov["labelX"] + 200
        oy = prov["labelY"] + 150
        angle = round(((i * 2 * math.pi / max(1, len(data["provinces"]))) + 1.2) % (2 * math.pi), 2)
        lines.append(f'  {{ provinceId:"{prov["id"]}", x:{ox}, y:{oy}, spreadX:{round(prov["spreadX"]*0.7)}, spreadY:{round(prov["spreadY"]*0.7)}, angle:{angle} }},')
    lines.append("];")
    lines.append("")

    return "\n".join(lines)


# ═══════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════

def main():
    if len(sys.argv) < 2:
        print("Usage: python atlas-to-campaign.py [--json] <input-file>", file=sys.stderr)
        sys.exit(1)

    use_json = "--json" in sys.argv
    input_file = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not input_file:
        print("No input file specified.", file=sys.stderr)
        sys.exit(1)

    if use_json:
        data = parse_json(input_file[0])
    else:
        data = parse_svg(input_file[0])

    js = emit_js(data)
    print(js)


if __name__ == "__main__":
    main()
