# Files to Push to GitHub

## Last Updated: April 16, 2026

### Changed Files

1. **creator.css** — Global input styling fix (white text boxes with !important), preview layout improvements, trait row base styles, autocomplete dropdown + monster browser modal CSS
2. **creator-util.js** — Added `getAuthorName()` helper for username injection
3. **creator-spell.js** — Injects `_authorName`, fixed unescaped `damageType` XSS
4. **creator-monster.js** — Null check on `s.speed`, bounds checking on splice, `_authorName` injection
5. **creator-class.js** — Fixed `global.showRestToast` → `U.showToast`, `_authorName` injection
6. **creator-race.js** — Bounds checking on splice, stripped inline trait-row styles, `_authorName` injection
7. **creator-subclass.js** — Null guards on array access, `.trim()` null safety, `_authorName` injection
8. **creator-feat.js** — Bounds checking on splice, `.trim()` null safety, `_authorName` injection
9. **creator-encounter.js** — Bounds checking on splice, `.trim()` null safety, `_authorName` injection, **SRD 5e monster database (~320 creatures)**, autocomplete search on enemy name fields with CR auto-fill, "Browse All" button with filterable modal (name search, CR filter, source filter), homebrew monsters merged into picker
10. **creator-background.js** — Four `.trim()` null safety fixes, `_authorName` injection
11. **creator-item.js** — `.trim()` null safety, `_authorName` injection
12. **compendium.html** — Collection system, campaign add, clickable tags, card redesign, XSS fixes (escaped speed, hitDie, sub variable, upgraded cmpEsc to escape quotes), collected items in My Homebrew with creator attribution + "Make a Copy" / "Remove" buttons, `.cmp-card-collected` styling, cache invalidation on collect
13. **campaign-homebrew-view.js** — Community homebrew tab in campaign manager
14. **phmurt-auth.js** — Added `set_app_user` RPC call in `_fireChange()` for RLS user identification

### SQL Migration (apply via Supabase dashboard)

15. **archive/sql/migration-homebrew-rls.sql** — Proper RLS policies for homebrew_content, user_collections, campaign_homebrew tables + helper functions
