# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 6 reward/meta-reward flow and result presentation are CI-green. Milestone 7 has started with a versioned inventory and the first formal consumable, Ink Refill, verified end-to-end.**

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
- Objective-aware non-pointer assist planner is wired to a focusable gameplay action and reuses the same finite-ink/Matter/round path as pointer drawing.
- One path-scoped GitHub Actions workflow covers unit tests, typecheck, production build and Playwright Chromium browser smoke.
- Versioned reward ledger (`draw-save-game.rewards.v1`) is CI-green: first clear +20 coins, each newly earned star +5 coins, replay/idempotency and malformed persistence covered.
- Formal reward adapter, result UI and unified formal-completion gameplay integration are CI-green; editor previews do not mutate formal reward storage.
- Browser reward verification commit `6b4699dd4c2c196ead430b97f81689e2b12db195` passed exact run `35379850195` (`completed/success`).
- Meta-reward daily-reset fix commit `ae84b907393e7617eeb657fb8de1fb0421b89378` passed exact run `35426488514` (`completed/success`).
- Meta-reward result presentation commit `599abe00c75a7d93fa0b10ef8c8543a9cbce6020` passed exact run `35459191506` (`completed/success`).
- Versioned local inventory (`draw-save-game.inventory.v1`) and the first consumable item, Ink Refill, are CI-green via exact run `35459429529`.

### Implemented and verified before this batch
- Integrated `game/metaRewards.ts` into `persistFormalCompletion`; no parallel gameplay/reward path was added.
- Formal wins now evaluate daily clear (+15), daily three-star (+20), first rescue (+25), and 10 accumulated best-stars (+40) after formal progress is recorded.
- Mission/achievement grants are credited into the same `draw-save-game.rewards.v1` coin balance as level rewards.
- Formal completion returns meta coins plus newly claimed daily/achievement IDs for later result-UI presentation.
- Daily keys default to the player's local calendar day; a deterministic `rewardDay` override exists for tests/replay.
- Editor Preview exits before progress, level rewards, meta rewards, or coin balance can mutate.
- Added integration coverage for first formal three-star clear, same-day replay idempotency, next-day daily reset without permanent-achievement replay, and complete Preview isolation.
- Integration commit `fcada5b9506c1cfdaa51a52ffd342345be675e0c` used `[skip ci]`; test commit `462a2c13943e4be52d7f8e518b90757d495097da` passed exact run `35442520313` (`completed/success`).

### Implemented this batch — 2026-09-20
- Confirmed exact CI run `35459191506` for `599abe00c75a7d93fa0b10ef8c8543a9cbce6020` completed successfully before starting the next milestone slice.
- Added versioned inventory ledger `draw-save-game.inventory.v1` with normalization, bounded stack counts, grant/consume helpers, persistence helpers and unit coverage.
- Added the first Milestone 7 consumable: Ink Refill. In a formal round it consumes one inventory item and increases current/max ink by 25% (minimum +10).
- Ink Refill is restricted to one use per round and becomes unavailable after danger starts or the round ends.
- Level Editor Preview uses the same item request boundary but refuses consumption, preserving formal inventory.
- Added an accessible DOM item dock with live status/count so the item is keyboard/assistive-technology reachable instead of canvas-only.
- Browser smoke verifies persisted inventory consumption, one-use-per-round behavior, reload persistence and Editor Preview isolation.
- Implementation commits used `[skip ci]`; `9dd5be5a1c91cb63e73fbb613639c912327be315` is the single CI-triggering verification commit for this batch.
- Exact run `35459429529` completed `success`: unit tests, typecheck, production build and Chromium Playwright smoke all passed.

### Validation — 2026-09-20
- Branch started at `ae84b907393e7617eeb657fb8de1fb0421b89378`.
- Exact run `35426488514` for that commit was confirmed `completed/success` before expanding Milestone 6.
- Meta-reward presentation CI is green at exact run `35459191506` for `599abe00c75a7d93fa0b10ef8c8543a9cbce6020`.
- Inventory/Ink Refill CI is green at exact run `35459429529` for `9dd5be5a1c91cb63e73fbb613639c912327be315`.
- Legacy Django/game content was not changed.
- No reset, force push, deletion, secret exposure, or stale-tree overwrite was used.

### Known limitations / not complete
- Inventory currently has no normal earn/purchase path yet; browser tests seed stock only to verify the consumption boundary. The next slice should add a formal, idempotent acquisition path.
- Only Ink Refill is implemented so far; reinforced line, pause, shield, redraw/eraser and revive remain pending.
- Progress/rewards/inventory remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Add a formal idempotent acquisition path for Ink Refill (prefer an existing achievement/daily reward boundary rather than a parallel grant path), with UI presentation and replay safety.
2. After acquisition is green, implement the next distinct consumable behavior with bounded use/cooldown and browser coverage.
3. Keep one inventory ledger, preserve Editor Preview isolation, and do not add another workflow.
