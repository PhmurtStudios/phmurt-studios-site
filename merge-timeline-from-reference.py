#!/usr/bin/env python3
"""
Splice the Campaign Manager *timeline* implementation from a reference campaigns.html
into your base file, leaving the rest of the base file unchanged.

Usage:
  python merge-timeline-from-reference.py BASE.html REFERENCE.html -o OUT.html

Example (after restoring your original Reginald campaigns.html to original.html):
  python merge-timeline-from-reference.py original.html "..\\Reginald - Copy\\campaigns.html" -o campaigns.html
"""
from __future__ import annotations

import argparse
import re
import sys

TIMELINE_ANCHOR_START = (
    "// ═══════════════════════════════════════════════════════════════════════════\n"
    "// TIMELINE\n"
    "// ═══════════════════════════════════════════════════════════════════════════"
)
WORLD_ANCHOR = (
    "\n// ═══════════════════════════════════════════════════════════════════════════\n"
    "// WORLD STATE\n"
    "// ═══════════════════════════════════════════════════════════════════════════"
)

# Example campaign: first session's event rows (optional upgrade for sample data)
OLD_SAMPLE_EVENTS = """        { id:"e1", type:"encounter",    text:"Ambush by 6 Blighted Wolves in the outer marshes",  outcome:"Victory — Fenris badly wounded", dmOnly:false },
        { id:"e2", type:"discovery",    text:"Found Seraphine's journal revealing the Crown's true location", outcome:"New quest lead unlocked", dmOnly:true },
        { id:"e3", type:"encounter",    text:"Boss fight: Seraphine the Lost (CR 11 Shadow Mage)", outcome:"Seraphine slain, obelisk still active", dmOnly:false },
        { id:"e4", type:"world_change", text:"The Hollow's grip on Shadowfen weakens slightly", outcome:"Faction power shift", dmOnly:false },
        { id:"e5", type:"loot",         text:"Acquired Seraphine's Shadow Staff and encoded map", outcome:"Key item obtained", dmOnly:false },"""

NEW_SAMPLE_EVENTS = """        { id:"e1", type:"encounter",    headline:"Wolf ambush in the outer marshes", text:"Ambush by 6 Blighted Wolves in the outer marshes",  outcome:"Victory — Fenris badly wounded", dmOnly:false, location:"Shadowfen", scope:"party", linkedNames:["Fenris Darkmoor"] },
        { id:"e2", type:"discovery",    headline:"Seraphine's journal", text:"Found Seraphine's journal revealing the Crown's true location", outcome:"New quest lead unlocked", dmOnly:true, importance:"major", linkedNames:["Seraphine the Lost"] },
        { id:"e3", type:"encounter",    headline:"Boss: Seraphine the Lost", text:"Boss fight: Seraphine the Lost (CR 11 Shadow Mage)", outcome:"Seraphine slain, obelisk still active", dmOnly:false, location:"Ritual site", importance:"major", linkedNames:["Seraphine the Lost","Kael Stormwind"] },
        { id:"e4", type:"world_change", headline:"Hollow grip slips in Shadowfen", text:"The Hollow's grip on Shadowfen weakens slightly", outcome:"Faction power shift", dmOnly:false, scope:"world" },
        { id:"e5", type:"loot",         headline:"Shadow Staff & map", text:"Acquired Seraphine's Shadow Staff and encoded map", outcome:"Key item obtained", dmOnly:false, importance:"minor" },"""


def extract_timeline_block(text: str) -> str:
    i0 = text.find(TIMELINE_ANCHOR_START)
    if i0 == -1:
        raise SystemExit("Reference or base: TIMELINE section start not found.")
    i1 = text.find(WORLD_ANCHOR, i0)
    if i1 == -1:
        raise SystemExit("Reference or base: WORLD STATE anchor not found after TIMELINE.")
    return text[i0:i1]


def replace_lucide_and_hooks(base: str, ref: str) -> str:
    # React hooks: use reference line if present
    m_ref = re.search(
        r"^    const \{ useState, useEffect, useCallback, useRef[^\n]* \} = React;\s*$",
        ref,
        re.M,
    )
    if m_ref:
        base = re.sub(
            r"^    const \{ useState, useEffect, useCallback, useRef[^\n]* \} = React;\s*$",
            m_ref.group(0).rstrip(),
            base,
            count=1,
            flags=re.M,
        )
    # Lucide block: comment + destructuring + optional FilterIcon (two lines after comment)
    lucide_ref = re.search(
        r"^    // Lucide icons from global\n    const \{ ChevronDown.*?\n(?:    const FilterIcon = .*?\n)?",
        ref,
        re.M | re.S,
    )
    if lucide_ref:
        chunk = lucide_ref.group(0)
        base = re.sub(
            r"^    // Lucide icons from global\n    const \{ ChevronDown.*?\n",
            chunk if chunk.endswith("\n") else chunk + "\n",
            base,
            count=1,
            flags=re.M | re.S,
        )
    return base


def fix_timeline_tab(base: str) -> str:
    base = re.sub(
        r"\{tab===\"timeline\"\s+&&\s*<TimelineView\s+data=\{data\}\s+setData=\{setData\}\s*/>\}",
        '{tab==="timeline"  && <TimelineView data={data} setData={setData} onNav={setTab}/>}',
        base,
    )
    return base


def main() -> None:
    ap = argparse.ArgumentParser(description="Merge timeline code from reference campaigns.html into base.")
    ap.add_argument("base", help="Your campaigns.html (keep everything except timeline splice)")
    ap.add_argument("reference", help="Reference file containing the new timeline (e.g. Reginald - Copy)")
    ap.add_argument("-o", "--out", required=True, help="Output path")
    args = ap.parse_args()

    base = open(args.base, encoding="utf-8").read()
    ref = open(args.reference, encoding="utf-8").read()

    new_timeline = extract_timeline_block(ref)
    old_timeline = extract_timeline_block(base)
    base = base.replace(old_timeline, new_timeline, 1)

    base = replace_lucide_and_hooks(base, ref)
    base = fix_timeline_tab(base)

    if OLD_SAMPLE_EVENTS in base:
        base = base.replace(OLD_SAMPLE_EVENTS, NEW_SAMPLE_EVENTS, 1)

    open(args.out, "w", encoding="utf-8", newline="\n").write(base)
    print("Wrote", args.out)


if __name__ == "__main__":
    main()
