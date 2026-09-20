# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 6 reward/meta-reward flow is CI-green. Milestone 7 is active: Ink Refill acquisition/presentation is green; Shield inventory foundation is implemented and awaiting exact CI verification.**

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
- Ink Refill result presentation/browser verification commit `9b1b2833dda4a1d512b7ee66bc8178f93b75b87d` passed exact run `35478488755` (`completed/success`).

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
- Started from branch SHA `666a5748e6993eb3d41670f075781a4326cf18c5` and verified Ink Refill acquisition-result browser coverage is green via exact run `35478488755`.
- Extended the existing v1 inventory ledger with the next distinct consumable ID, `shield`, without creating a second inventory store or changing the storage key.
- Existing persisted v1 ledgers that contain only `ink-refill` normalize safely to `shield: 0`, preserving the existing refill balance.
- The same bounded grant/consume helpers now support Shield, including 0..99 stack clamping and no negative consumption.
- Foundation commit `d4303474980e8016261b898a5b10b42362dcf36c` used `[skip ci]`; verification commit `305255b3424f8b6c72b2eac40fcb2bcfc17bb1ba` is the only CI-triggering commit in this batch.
- Shield gameplay activation/damage interception is deliberately not marked complete until this inventory contract is green.

### Known limitations / not complete
- Ink Refill is fully wired; Shield now has an inventory contract but gameplay activation is pending. Reinforced line, pause, redraw/eraser and revive remain pending.
- Progress/rewards/inventory remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Verify the exact CI run for `305255b3424f8b6c72b2eac40fcb2bcfc17bb1ba`; repair before expanding if red.
2. When green, wire Shield activation into the existing item dock/round state and intercept one otherwise-lethal hazard hit, with one-use-per-round behavior and Preview isolation.
3. Keep all new browser coverage inside the existing workflow; do not add a second CI path.
