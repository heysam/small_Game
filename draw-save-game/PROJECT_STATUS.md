# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 6 reward/meta-reward flow is CI-green. Milestone 7 is active: inventory + Ink Refill consumption and formal acquisition are green; acquisition result presentation is implemented and awaiting exact CI verification.**

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
- Formal Ink Refill acquisition verification commit `2f0c2b1f650b576875ad1b2b4afb2b6ead6957a2` passed exact run `35461051235` (`completed/success`).

### Milestone 7 inventory
- Versioned inventory ledger has normalization, bounded stack counts, grant/consume helpers and persistence helpers.
- Ink Refill consumes one inventory item and increases current/max ink by 25% (minimum +10).
- Ink Refill is restricted to one use per round and unavailable after danger starts or the round ends.
- Editor Preview refuses item consumption and preserves formal inventory.
- Accessible DOM item dock exposes status/count for keyboard and assistive technology.
- Browser smoke verifies consumption, one-use-per-round behavior, reload persistence and Preview isolation.
- Consumption verification commit `9dd5be5a1c91cb63e73fbb613639c912327be315` passed exact run `35459429529`.
- Existing idempotent `daily-three-stars` claim grants one `ink-refill`; same-day replay cannot grant a second item and a new day can grant one again.

### Implemented this batch — 2026-09-20
- Started from branch SHA `d51a8722a92835d990acc2b6a8093453e30f9ea8` and verified the previous acquisition slice is green via exact run `35461051235`.
- Formal result dialog now presents `獲得道具 / 墨水補給 ×1` only when the current completion newly claims `daily-three-stars`, matching the same idempotent event that grants inventory.
- Replays do not show the acquisition callout because `daily-three-stars` is no longer newly claimed that day.
- Editor Preview cannot show the acquisition callout because preview completion does not claim formal daily rewards.
- Presentation commit `9ea5b6b409bc0a1acb32fb48b64f5812a536bc04` used `[skip ci]` to avoid a redundant run.
- Browser verification commit `9b1b2833dda4a1d512b7ee66bc8178f93b75b87d` adds a formal three-star clear check for the visible Ink Refill acquisition, persisted inventory count, and replay idempotency; this is the only CI-triggering commit in this batch.
- At status-write time the exact Actions run for `9b1b2833dda4a1d512b7ee66bc8178f93b75b87d` had not appeared yet, so this presentation slice is not marked green prematurely.

### Known limitations / not complete
- Only Ink Refill is implemented so far; reinforced line, pause, shield, redraw/eraser and revive remain pending.
- Progress/rewards/inventory remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Verify the exact CI run for `9b1b2833dda4a1d512b7ee66bc8178f93b75b87d`; repair before expanding if red.
2. When green, implement the next distinct consumable behavior with bounded use/cooldown while preserving one inventory ledger and Editor Preview isolation.
3. Keep all new browser coverage inside the existing workflow; do not add a second CI path.
