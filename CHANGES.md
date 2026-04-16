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

### Navigation Reorganization

20. **phmurt-shell.js** *(updated)* — Flattened nav to all top-level links. Renamed: Grimoire → "Content", Compendium → "Homebrew Workshop". Added "Getting Started" nav link. Removed Character Sheets from nav. Removed dropdown groups entirely. New nav order: Home | Content | Homebrew Workshop | Characters | Campaigns | Generators | Getting Started | About. Updated all breadcrumbs and activeNavFor map (learn/gallery → Getting Started, soup-savant/legendary → Content).
21. **character-builder.html** *(updated)* — Homebrew create cards now open Homebrew Compendium tab (`showHomebrewManager()`) instead of inline entity modal
22. **getting-started.html** *(new)* — New hub page for new players. Three-step walkthrough (Learn Basics → Pick Character → Join Adventure), cards linking to Learn to Play and Character Gallery, interactive quick-start checklist with localStorage persistence, CTA banner linking to Characters page.

### Stale Reference Fixes (post-rename sweep)

23. **index.html** — "More in the Grimoire" → "More Content", "Player & DM Tools" → "Tools & Guides"
24. **learn.html** — "Explore the Grimoire →" → "Explore Content →"
25. **404.html** — "Browse the Grimoire" → "Browse Content"
26. **soup-savant.html** — Breadcrumb "Grimoire" → "Content"
27. **legendary.html** — Breadcrumb "Grimoire" → "Content"
28. **grimoire.html** — 2 "Compendium" link labels → "Homebrew Workshop"
29. **learn-dm.html** — "Compendium" tip card title → "Homebrew Workshop"
30. **campaigns.html** *(updated)* — Sidebar tool labels: "Compendium" → "Workshop", "Grimoire" → "Content"
31. **campaign-homebrew-view.js** *(updated)* — "Compendium" empty-state link → "Homebrew Workshop"
32. **creator-spell.js** *(updated)* — "Back to Compendium" button → "Back to Workshop"
33. **sw.js** *(updated)* — Added getting-started.html and char-sheet-export.js to service worker precache list

### Character Sheet PDF Export

34. **char-sheet-export.js** *(new)* — Traditional D&D character sheet PDF export. Opens a print-optimized window styled like a classic character sheet (parchment boxes, Cinzel headings, ability score blocks, saves, skills, equipment, spells, features, personality traits, backstory). Supports both 5e (`exportCharSheet5e()`) and 3.5e (`exportCharSheet35()`) with edition-appropriate fields (BAB for 3.5e, proficiency bonus for 5e).
35. **character-builder.html** *(updated)* — "Print / PDF" button replaced with "Export PDF" calling `exportCharSheet5e()`, script tag added for char-sheet-export.js
36. **character-builder-35.html** — "Print / PDF" button replaced with "Export PDF" calling `exportCharSheet35()`, script tag added for char-sheet-export.js

### Campaign Manager Mobile Fixes

38. **campaigns.html** *(updated)* — Mobile responsive CSS: hidden sidebar nav at 640px, map sidebar width override at 480px, 2-col stat grid, 1-col flyout, modal width caps, tighter action panel spacing

### Character Gallery Expansion

39. **gallery.html** *(updated)* — Added 24 new premade characters (12 Level 1, 12 Level 5) bringing total to 36 across all 12 classes at 3 levels. Race filter expanded with High Elf, Wood Elf, Dark Elf, Lightfoot Halfling, Stout Halfling, Rock Gnome, Forest Gnome.

### Shareable Character & Homebrew URLs

40. **shared.html** *(new)* — Public view page for shared characters and homebrew. Accepts `?type=character&id=UUID` or `?type=homebrew&t=type&id=UUID`. Renders read-only character sheets (ability scores, stats, saves, skills, features, equipment, spells, backstory) and homebrew content (type-specific detail views for races, classes, spells, monsters, items, etc.). Copy link button, edition badges, author attribution.
41. **phmurt-auth.js** *(updated)* — Added `shareCharacter(id)`, `unshareCharacter(id)`, `getShareUrl(type, id)` methods to PhmurtDB. Updated `getCharacters()` to include `is_public` column.
42. **characters.html** *(updated)* — Added Share button to character cards. Gold styling for unshared, green for shared. Click shared → copies link to clipboard. Click unshared → shares character + copies link. Subtle upgrade banner for free-tier users approaching 3-character limit.
43. **compendium.html** *(updated)* — Added "🔗 Link" copy button next to shared homebrew items in My Homebrew tab. Subtle upgrade nudge shown once after first share for free users.
44. **phmurt-shell.js** *(updated)* — Added `shared.html` and `learn-dm.html` to activeNavFor map.

### Subtle Upgrade Prompts

45. **characters.html** *(updated)* — Contextual upgrade hint appears below toolbar when free-tier user has 2+ characters (out of 3 free). Shows "View Plans" link to pricing.html.
46. **getting-started.html** *(updated)* — Pro upgrade hint shown to free-tier signed-in users after CTA banner. Hidden for subscribers/admins.
47. **compendium.html** *(updated)* — After first homebrew share, free-tier users see a one-time toast suggesting Pro upgrade.

### Shared Utilities Consolidation

48. **phmurt-utils.js** *(new)* — Site-wide shared utility module (`window.PU`). Consolidates duplicate functions from 18+ files: HTML escaping (`esc`, `escAttr`), ability score helpers (`abilityMod`, `fmtMod`, `modStr`), proficiency bonus (`profBonus`, `profBonusStr`), string utils (`capitalize`, `slugify`, `truncate`), DOM helpers (`selectHtml`), clipboard (`copyToClipboard`), dice rolling (`rollDie`, `rollDice`, `rollExpr`), number formatting (`fmtNum`, `ordinal`), toast wrapper.

### Learn to DM Polish

49. **getting-started.html** *(updated)* — Added "Learn to DM" as third card in the hub grid (3-column layout). Links to learn-dm.html with DM-focused description and "Become a DM →" CTA.
50. **learn-dm.html** *(updated)* — Fixed breadcrumb format (now `Home > Getting Started > Learn to DM` with proper links). Set `data-nav-active="Getting Started"` for correct nav highlighting. Added quiz score localStorage persistence: saves best score to `phmurt_dm_quiz_best`, displays previous best on revisit and after retake.

### Service Worker Update

51. **sw.js** *(updated)* — Cache version bumped to 186. Added `shared.html` and `phmurt-utils.js` to precache list.

### SQL Migration (apply via Supabase dashboard)

37. **archive/sql/migration-homebrew-rls.sql** — Proper RLS policies for homebrew_content, user_collections, campaign_homebrew tables + helper functions
52. **archive/sql/migration-character-sharing.sql** *(new)* — Adds `is_public` boolean column to characters table (default false), creates index for public lookups, adds RLS policy for anonymous read access to shared characters, ensures homebrew_content has matching public read policy.

### Character Builder Onboarding Wizard

53. **builder-wizard.js** *(new)* — Guided onboarding wizard for the Character Builder. Shows welcome overlay on first visit with 3 options: Guided Mode (step-by-step tips), Free Build (jump right in), or Quick Build (6 archetypes: Warrior, Spellcaster, Healer, Sneak, Ranger, Face). Quick Build auto-selects race, class, background, and abilities. Guide toggle button in sidebar. Step-specific tips update as you navigate. Responsive with 480px/375px mobile breakpoints for the overlay.
54. **character-builder.html** *(updated)* — Added `defer` to builder-data.js script tag for performance. Added builder-wizard.js script before phmurt-shell.js. Added 375px mobile breakpoint for compact layout on small screens.

### Initiative Tracker

55. **campaign-initiative.js** *(new)* — React initiative tracker component for the Campaign Manager. 15 D&D conditions with icons/colors. Add/remove combatants (player, enemy, ally, lair types). HP tracking with color-coded bars, AC, DEX mod. Condition toggle picker. Start/end combat, next/prev turn, round counter, roll all initiative, clear all. Active combatant highlighted. Death saves for players at 0 HP. Sorted by initiative (descending) with DEX tiebreaker.
56. **campaigns.html** *(updated)* — Added Initiative tab to campaign manager navigation. Lazy-loads campaign-initiative.js following existing module pattern.

### Encounter Generator Enhancement

57. **generators.html** *(updated)* — Enhanced random encounter generator with proper DMG XP budget calculations (XP thresholds per level, CR→XP lookup, encounter multiplier by monster count). Shows raw XP, adjusted XP, actual difficulty with color coding. Added "⚔️ Initiative Tracker" button that sends generated encounter to campaign manager. Added 480px and 375px mobile breakpoints for split-pane layout.

### Performance Audit

58. **character-builder-35.html** *(updated)* — Added `defer` to builder-data-35.js script tag to unblock HTML parsing.

### Automated Smoke Tests

59. **tests/playwright.config.js** *(new)* — Playwright config with Desktop Chrome + Mobile Safari projects, 30s timeout, 1 retry, 2 workers.
60. **tests/smoke.spec.js** *(new)* — Comprehensive smoke test suite: 13+ page load tests, character builder tests (race cards, wizard overlay), navigation link verification, gallery premade character count, Getting Started cards + interactive checklist, shared page error states, campaign manager auth gate, responsive layout tests (no horizontal overflow on mobile).

### Mobile Responsiveness Fixes

61. **style.css** *(updated)* — Added 375px global breakpoint (reduced padding, font sizes, 1-column grids, compact mobile menu). Fixed min-width overflow issues: dice popup uses `min(220px, 90vw)`, nav dropdown uses `min(200px, 85vw)`, grimoire search input uses `min-width:0`.
62. **shared.html** *(updated)* — Added 375px breakpoint: 2-column ability grid, 50% stat row wrapping, reduced section padding, compact header/button sizing.
63. **getting-started.html** *(updated)* — Added 375px breakpoint: tighter wrap padding, smaller hero title (1.3rem), compact step/card/checklist styling.
64. **learn-dm.html** *(updated)* — Added 375px breakpoint: reduced content padding (14px), smaller section titles and hero text, compact quiz option buttons.
65. **characters.html** *(updated)* — Added 375px breakpoint: tighter hub padding, compact cards, wrapping footer buttons, responsive filter bar.
66. **compendium.html** *(updated)* — Added 375px breakpoint: reduced layout padding, smaller type titles, compact form inputs and modal sizing.
67. **builder-wizard.js** *(updated)* — Injected responsive CSS for wizard overlay: 480px shows 2-column archetype grid, 375px shows single-column mode buttons and archetypes.

### Navigation Reorder

68. **phmurt-shell.js** *(updated)* — Moved "Getting Started" tab to sit between "Content" and "Homebrew Workshop" in both `nav` and `flatNav` arrays.

### Community Homebrew Attribution (SQL — already applied)

69. **archive/sql/migration-attribute-homebrew-to-loki.sql** *(new, already applied)* — Updated `_authorName` in the JSONB `data` column to "Loki" for all public `homebrew_content` rows. Community tab now displays "by Loki" for every shared entry.
