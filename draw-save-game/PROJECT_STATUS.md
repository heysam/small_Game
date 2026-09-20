# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 6 reward/meta-reward flow is CI-green. Milestone 7 is active: Ink Refill is green; Shield inventory is green and its isolated round-state/damage contract is under CI verification.**

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
- Shield inventory verification commit `305255b3424f8b6c72b2eac40fcb2bcfc17bb1ba` passed exact run `35494002940` (`completed/success`).

### Milestone 7 inventory
- Versioned inventory ledger has normalization, bounded stack counts, grant/consume helpers and persistence helpers.
- Ink Refill consumes one inventory item and increases current/max ink by 25% (minimum +10).
- Ink Refill is restricted to one use per round and unavailable after danger starts or the round ends.
- Editor Preview refuses item consumption and preserves formal inventory.
- Accessible DOM item dock exposes status/count for keyboard and assistive technology.
- Browser smoke verifies consumption, one-use-per-round behavior, reload persistence and Preview isolation.
- Consumption verification commit `9dd5be5a1c91cb63e73fbb613639c912327be315` passed exact run `35459429529`.
- Existing idempotent `daily-three-stars` claim grants one `ink-refill`; same-day replay cannot grant a second item and a new day can grant one again.
- Shield shares the same v1 inventory ledger; old Ink-only saves normalize safely to `shield: 0`.

### Implemented this batch — 2026-09-20
- Started from branch SHA `0754e6631cd1a712b884c9f27b9002baeb9aeb46`.
- Verified Shield inventory commit `305255b3424f8b6c72b2eac40fcb2bcfc17bb1ba` is green via exact run `35494002940`.
- Added an isolated Shield round-state contract: unarmed hits remain lethal; an armed shield absorbs exactly one otherwise-lethal hazard hit and then disarms; repeated arming in the same active state does not stack.
- Contract implementation commit `681e21da1f26b940c1828106d463b1a129fa0a21` used `[skip ci]`; test commit `845ff6fd1c87e0eea3dd6016a550e878195054bb` is the only CI-triggering commit in this batch.
- Gameplay/UI wiring is deliberately not marked complete until the new contract is green.

### Known limitations / not complete
- Ink Refill is fully wired; Shield inventory is green and its round-state contract exists, but gameplay activation/UI and Matter collision interception are still pending. Reinforced line, pause, redraw/eraser and revive remain pending.
- Progress/rewards/inventory remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Verify the exact CI run for `845ff6fd1c87e0eea3dd6016a550e878195054bb`; repair before expanding if red.
2. When green, wire Shield activation into the existing item dock/round state and intercept one otherwise-lethal hazard hit, preserving Preview isolation and one-use-per-round semantics.
3. Keep all browser coverage inside the existing workflow; do not add a second CI path.
