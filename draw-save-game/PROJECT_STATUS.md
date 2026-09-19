# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 5 closed green; Milestone 6 formal rewards are browser-verified green and daily-mission/achievement reward modeling has started.**

### Completed and verified
- Isolated `draw-save-game/` TypeScript + Vite + Phaser 3 + Matter project; existing Django/legacy game remains untouched.
- Responsive mouse/touch freehand drawing with finite ink, Matter collision bodies, victory/failure and retry.
- 20 original validated starter levels across city, forest, cave, laboratory and harbor worlds.
- Three playable objective families: `survive`, `reach`, `catch`.
- Six differentiated hazards: bouncing orb, chaser, periodic falling hazard, spike, deterministic mover and timed laser (`warning -> active -> cooldown`).
- Level Editor/Debug Panel with validation, JSON import/export/reset and in-memory preview that does not write formal progress.
- Level Select grouped by world with lock state and best stars.
- Versioned local progress (`draw-save-game.progress.v1`) stores completion, best stars, best remaining ink and next-level unlocks.
- Formal responsive result dialog with stars/ink, Retry, conditional Next and return-to-map; editor previews are explicitly isolated from formal progress.
- Player onboarding, hints, feedback preferences and accessibility display preferences.
- Result dialog keyboard behavior and broader DOM keyboard audit are CI-green.
- Objective-aware non-pointer assist planner is wired to a focusable gameplay action and reuses the same finite-ink/Matter/round path as pointer drawing.
- One path-scoped GitHub Actions workflow covers unit tests, typecheck, production build and Playwright Chromium browser smoke.
- Versioned reward ledger (`draw-save-game.rewards.v1`) is CI-green: first clear +20 coins, each newly earned star +5 coins, replay/idempotency and malformed persistence covered.
- Formal reward adapter, result UI and unified formal-completion gameplay integration are CI-green; editor previews do not mutate formal reward storage.
- Browser reward verification commit `6b4699dd4c2c196ead430b97f81689e2b12db195` passed exact run `35379850195` (`completed/success`): first clear shows/persists a positive award, same-level retry shows `+0 金幣` without balance growth, and reload preserves reward balance and level unlock state.

### Implemented this batch — awaiting exact CI completion
- Added versioned `game/metaRewards.ts` model for daily missions and achievements without adding another workflow.
- Daily mission slice: one clear/day (+15) and one three-star clear/day (+20); daily progress resets when the supplied local-day key changes.
- Achievement slice: first rescue (+25) and 10 best-stars accumulated (+40); achievement claims remain persistent across daily resets.
- Claims are idempotent and malformed persisted progress is defensively normalized.
- Added unit coverage for first claim/replay idempotency, independent three-star/10-star claims, next-day reset behavior and malformed persistence.
- Feature commit `56ed17abaa33d0efa7df6760f365b75f7140370a`; test commit `9fca39f430919fc16e2ecea3063326fedb565754`.

### Validation — 2026-09-19
- Branch was re-read at start at `dd38eb8c2a13877847992062a5d6d20867bd59bc`; its parent browser test commit was `6b4699dd4c2c196ead430b97f81689e2b12db195`.
- Exact browser reward run `35379850195` was confirmed `completed/success` before expanding Milestone 6.
- New meta-reward tests were committed into the same existing CI path; exact CI is pending and this batch must not be marked green until it completes.
- Legacy Django/game content was not changed.
- No reset, force push, deletion or stale-tree overwrite was used.

### Known limitations / not complete
- Daily missions/achievements are modeled but not yet wired into formal completion or UI.
- Progress/rewards remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Re-read exact CI for meta-reward test commit `9fca39f430919fc16e2ecea3063326fedb565754`; fix any failure before expanding.
2. If green, integrate meta rewards through the unified formal-completion boundary so Editor Preview remains excluded.
3. Credit mission/achievement coin grants into the existing reward balance atomically and surface newly claimed rewards in the result UI.
4. Continue later milestones without unnecessary workflows.
