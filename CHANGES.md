# Files to Push to GitHub

## Last Updated: April 16, 2026

### Changed Files

1. **creator.css** — Global input styling fix (white text boxes with !important), preview layout improvements, trait row base styles, **monster picker overhaul**: replaced card grid with horizontal row layout, filter pills (Type/Size/Source), expandable traditional D&D stat blocks, SVG search icon
2. **creator-util.js** — Added `getAuthorName()` helper for username injection
3. **creator-spell.js** — Injects `_authorName`, fixed unescaped `damageType` XSS
4. **creator-monster.js** — Null check on `s.speed`, bounds checking on splice, `_authorName` injection
5. **creator-class.js** — Fixed `global.showRestToast` → `U.showToast`, `_authorName` injection
6. **creator-race.js** — Bounds checking on splice, stripped inline trait-row styles, `_authorName` injection
7. **creator-subclass.js** — Null guards on array access, `.trim()` null safety, `_authorName` injection
8. **creator-feat.js** — Bounds checking on splice, `.trim()` null safety, `_authorName` injection
9. **creator-encounter.js** — Bounds checking on splice, `.trim()` null safety, `_authorName` injection, **complete SRD 5e monster database (~334 creatures with full stat blocks)**: ability scores, traits, actions, legendary actions for every monster. **Monster picker overhaul**: horizontal row layout with CR color stripe, Type/Size/Source filter pills, expand arrow reveals traditional D&D stat block (AC, HP, Speed, ability scores with modifiers, saves, skills, senses, languages, CR/XP, traits, actions, legendary actions), SVG search icon, Sort by Name/CR↑/CR↓/XP, homebrew monsters merged into picker
10. **creator-background.js** — Four `.trim()` null safety fixes, `_authorName` injection
11. **creator-item.js** — `.trim()` null safety, `_authorName` injection
12. **compendium.html** — Collection system, campaign add, clickable tags, card redesign, XSS fixes (escaped speed, hitDie, sub variable, upgraded cmpEsc to escape quotes), collected items in My Homebrew with creator attribution + "Make a Copy" / "Remove" buttons, `.cmp-card-collected` styling, cache invalidation on collect
13. **campaign-homebrew-view.js** — Community homebrew tab in campaign manager
14. **phmurt-auth.js** — Added `set_app_user` RPC call in `_fireChange()` for RLS user identification

15. **character-builder.html** — "Create Homebrew" buttons moved from standalone full-width buttons at the bottom of each step to inline dashed-border cards in the selection grid alongside standard options (Race, Class, Background steps)

### Style Consistency Fixes

16. **pricing.html** — Replaced rogue purple accent `#7c3aed` with `var(--crimson, #d4433a)`, fixed `--bg-card` fallback `#1e1e2e` → `#141420`, fixed pro card box-shadow to crimson glow
17. **campaigns.html** — Fixed loading shell `--bg` fallback `#0c0804` → `#08080a`, `--bg-nav` fallback `#100c08` → `#06060a`
18. **creator-util.js** *(updated)* — Fixed confirm dialog `--bg-card` fallback `#1e1914` → `#141420`, `--text` fallback `#e8dcc8` → `#f2e8d6`
19. **compendium.html** *(updated)* — Fixed view modal `--bg-card` fallback `#1e1914` → `#141420`, fixed 5 `--text` fallbacks `#e8dcc8` → `#f2e8d6`

### SQL Migration (apply via Supabase dashboard)

20. **archive/sql/migration-homebrew-rls.sql** — Proper RLS policies for homebrew_content, user_collections, campaign_homebrew tables + helper functions
