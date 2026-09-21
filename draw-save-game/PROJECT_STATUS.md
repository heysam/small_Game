# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 7 active. Ink Refill is CI-green. Shield inventory, one-hit absorption, and dock baseline are CI-green; a pure activation transaction is now under CI verification before scene/collision wiring.**

### Completed and verified
- Isolated `draw-save-game/` TypeScript + Vite + Phaser 3 + Matter project; existing Django/legacy game remains untouched.
- Responsive mouse/touch freehand drawing with finite ink, Matter collision bodies, victory/failure and retry.
- 20 original validated starter levels across city, forest, cave, laboratory and harbor worlds.
- Three playable objective families: `survive`, `reach`, `catch`.
- Six differentiated hazards: bouncing orb, chaser, periodic falling hazard, spike, deterministic mover and timed laser.
- Level Editor/Debug Panel with validation, JSON import/export/reset and isolated preview.
- Level Select, versioned local progress, result dialog, onboarding, hints, feedback/accessibility preferences and objective-aware assist planner.
- One path-scoped GitHub Actions workflow covers unit tests, typecheck, production build and Playwright Chromium smoke.
- Reward/meta-reward flow, formal completion boundary and Editor Preview isolation are CI-green.
- Versioned inventory (`draw-save-game.inventory.v1`) and Ink Refill acquisition/consumption/result presentation are CI-green.
- Shield inventory verification commit `305255b3424f8b6c72b2eac40fcb2bcfc17bb1ba` passed exact run `35494002940`.
- Shield round-state verification commit `845ff6fd1c87e0eea3dd6016a550e878195054bb` passed exact run `35510315140`.
- Shield dock fixture repair commit `99e0e46e09d3ba1000ad12d300009fd71009d6c7` passed exact run `35568159589` (`completed/success`).

### Milestone 7 inventory
- Shared inventory ledger has normalization, bounded stacks, grant/consume and persistence helpers.
- Ink Refill consumes one item and raises current/max ink by 25% (minimum +10), once per round before danger starts.
- Editor Preview refuses formal item consumption.
- Shield shares the same v1 ledger and old Ink-only saves normalize to `shield: 0`.
- Shield round-state contract absorbs exactly one otherwise-lethal hazard hit after arming, then disarms; unarmed hits remain lethal.

### Implemented this batch — 2026-09-22
- Re-read branch head `99e0e46e09d3ba1000ad12d300009fd71009d6c7` and confirmed exact run `35568159589` is green before expanding.
- Added pure `activateShield` inventory transaction: formal activation consumes exactly one Shield and arms the existing round-state contract.
- Preview activation is rejected without inventory mutation; already-armed activation cannot double-consume; empty inventory cannot arm.
- Implementation commit: `9209cd098b21cb192088eed2ee1e5b41f6197d12` (`[skip ci]`).
- Verification commit: `e5734181376b1c103ce383dffada678e9e255eb3`; this is the only CI-triggering commit in this batch.
- Existing gameplay/UI remains fail-safe until the new transaction passes CI; no workflow was added or duplicated.

### Known limitations / not complete
- Exact CI result for `e5734181376b1c103ce383dffada678e9e255eb3` is pending; do not mark the activation transaction green until it passes.
- Shield scene activation and Matter collision interception are still pending; the visible Shield control remains deliberately non-operational until that path is safe and tested.
- Reinforced line, pause, redraw/eraser and revive remain pending.
- Progress/rewards/inventory remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains deferred to the performance milestone.

### Next
1. Verify the exact CI run for `e5734181376b1c103ce383dffada678e9e255eb3`; repair before expanding if red.
2. When green, wire the Shield dock event into the scene using `activateShield`, persist the returned ledger, and route hero/hazard collision through the existing one-hit Shield contract.
3. Add browser smoke for activation, one absorbed hit, subsequent lethal hit and Preview isolation inside the existing workflow only.
