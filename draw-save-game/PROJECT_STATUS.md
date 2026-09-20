# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 7 active. Ink Refill is CI-green. Shield inventory and isolated one-hit absorption contract are CI-green; accessible Shield dock control is now under CI verification before gameplay collision wiring.**

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
- Shield round-state verification commit `845ff6fd1c87e0eea3dd6016a550e878195054bb` passed exact run `35510315140` (`completed/success`).

### Milestone 7 inventory
- Shared inventory ledger has normalization, bounded stacks, grant/consume and persistence helpers.
- Ink Refill consumes one item and raises current/max ink by 25% (minimum +10), once per round before danger starts.
- Editor Preview refuses formal item consumption.
- Shield shares the same v1 ledger and old Ink-only saves normalize to `shield: 0`.
- Shield round-state contract absorbs exactly one otherwise-lethal hazard hit after arming, then disarms; unarmed hits remain lethal.

### Implemented this batch — 2026-09-21
- Started from branch SHA `e9173668b97f63e2c323bede079062e99c21402f`.
- Verified exact Shield round-state CI run `35510315140` is `completed/success`.
- Added a dedicated accessible `護盾 ×N` item-dock control while preserving the existing Ink Refill event contract.
- Shield control intentionally remains disabled until Matter collision/gameplay activation is wired, so the UI cannot consume inventory without providing protection.
- Added `shieldDock.test.ts` to verify both Ink Refill and Shield controls remain present. Verification commit: `68166e42a7e07736889e26fb733dbf41772a5572`.
- No new workflow was added; the existing consolidated CI is used.

### Known limitations / not complete
- Shield gameplay activation and Matter collision interception are still pending; the visible Shield control is deliberately disabled until that path is safe and tested.
- Reinforced line, pause, redraw/eraser and revive remain pending.
- Progress/rewards/inventory remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains deferred to the performance milestone.

### Next
1. Verify the exact CI run for `68166e42a7e07736889e26fb733dbf41772a5572`; repair before expanding if red.
2. When green, wire Shield activation to consume exactly one inventory item in formal play, preserve Preview inventory, and route hero/hazard collision through the existing one-hit Shield contract.
3. Add browser smoke for activation, one absorbed hit, subsequent lethal hit and Preview isolation inside the existing workflow only.
