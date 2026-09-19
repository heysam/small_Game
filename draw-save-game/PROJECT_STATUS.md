# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 6 reward/meta-reward flow is CI-green. Milestone 7 is active: inventory + Ink Refill consumption are green; formal Ink Refill acquisition is implemented and awaiting exact CI verification.**

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

### Milestone 7 inventory
- Versioned inventory ledger has normalization, bounded stack counts, grant/consume helpers and persistence helpers.
- Ink Refill consumes one inventory item and increases current/max ink by 25% (minimum +10).
- Ink Refill is restricted to one use per round and unavailable after danger starts or the round ends.
- Editor Preview refuses item consumption and preserves formal inventory.
- Accessible DOM item dock exposes status/count for keyboard and assistive technology.
- Browser smoke verifies consumption, one-use-per-round behavior, reload persistence and Preview isolation.
- Consumption verification commit `9dd5be5a1c91cb63e73fbb613639c912327be315` passed exact run `35459429529`.

### Implemented this batch — 2026-09-20
- Started from branch SHA `dbfb8c9960ffd398739626b5e23b7f3ef8e64121`; the previous Ink Refill consumption milestone was already green.
- Added a formal acquisition path without creating a second reward system: the existing idempotent `daily-three-stars` claim now grants one `ink-refill` through the existing inventory ledger.
- Same-day replay cannot grant a second item because acquisition is driven only by `newlyClaimedDaily`.
- A new day can grant one new Ink Refill after the daily three-star claim resets.
- `FormalCompletionResult` now reports `inventoryGranted` for later result-UI presentation.
- Editor Preview still exits before progress, coin rewards, meta rewards or inventory can mutate.
- Implementation commit `b04626bf7be72215a67223cd7ada5ffcd226ad29` used `[skip ci]`.
- Verification commit `2f0c2b1f650b576875ad1b2b4afb2b6ead6957a2` adds unit coverage for first acquisition, replay idempotency, next-day reacquisition and Preview inventory isolation; this is the only CI-triggering commit in this batch.
- At status-write time the exact Actions run for `2f0c2b1f650b576875ad1b2b4afb2b6ead6957a2` had not appeared yet, so this acquisition slice is not marked green prematurely.

### Known limitations / not complete
- Formal acquisition result is not yet presented in the result dialog; wire `inventoryGranted` into existing result UI only after exact CI is green.
- Only Ink Refill is implemented so far; reinforced line, pause, shield, redraw/eraser and revive remain pending.
- Progress/rewards/inventory remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Verify the exact CI run for `2f0c2b1f650b576875ad1b2b4afb2b6ead6957a2`; repair before expanding if red.
2. When green, present newly acquired Ink Refill in the existing formal result UI and add browser smoke coverage without adding another workflow.
3. Then implement the next distinct consumable behavior with bounded use/cooldown while preserving one inventory ledger and Editor Preview isolation.
