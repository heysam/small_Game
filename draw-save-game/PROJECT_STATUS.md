# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 7 active. Ink Refill is CI-green. Shield inventory, one-hit absorption, activation transaction, and scene-facing controller are CI-green; Shield dock activation-event verification failed only because its Node/Vitest test referenced browser `localStorage`, and that test harness issue is now repaired pending CI.**

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
- Shield dock fixture repair commit `99e0e46e09d3ba1000ad12d300009fd71009d6c7` passed exact run `35568159589`.
- Shield activation transaction verification commit `e5734181376b1c103ce383dffada678e9e255eb3` passed exact run `35637667714`.
- Scene-facing Shield controller verification commit `202d9020697f8d58a04fab91eff4cac3eec5e666` passed exact run `35671851664` (`completed/success`).

### Milestone 7 inventory
- Shared inventory ledger has normalization, bounded stacks, grant/consume and persistence helpers.
- Ink Refill consumes one item and raises current/max ink by 25% (minimum +10), once per round before danger starts.
- Editor Preview refuses formal item consumption.
- Shield shares the same v1 ledger and old Ink-only saves normalize to `shield: 0`.
- Shield round-state contract absorbs exactly one otherwise-lethal hazard hit after arming, then disarms; unarmed hits remain lethal.
- Shield activation transaction consumes inventory only when a formal round can actually arm the shield.
- `ShieldController` owns scene-local shield state while reusing the shared inventory transaction and one-hit contract.

### Implemented this batch — 2026-09-22
- Re-read branch status before expanding.
- Exact Shield dock verification run `35694433644` for commit `4a88e44b609d0c2f3982d1a361a73b4dceb7f1b4` completed with failure.
- Failure was isolated to `shieldDock.test.ts`: 68/69 unit tests passed, while the new event test failed at setup because `localStorage` is unavailable in the Node/Vitest environment. Typecheck/build/browser stages were skipped after that unit-test failure.
- Removed the unnecessary `localStorage.clear()` from the dock event test; the event assertion does not depend on persisted inventory because `itemDock` already normalizes missing storage through the shared ledger loader.
- Repair commit: `3c4d111c302800a6bf28af6758aab5d2fa7f09c7`; CI result pending. No production gameplay code or workflow was changed in this repair.

### Known limitations / not complete
- Exact CI result for repair commit `3c4d111c302800a6bf28af6758aab5d2fa7f09c7` is pending; do not expand until green.
- Shield Phaser scene activation and Matter collision interception are still pending; the visible Shield control remains disabled because the scene does not yet publish `canUseShield`.
- Reinforced line, pause, redraw/eraser and revive remain pending.
- Progress/rewards/inventory remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains deferred to the performance milestone.

### Next
1. Verify exact CI for `3c4d111c302800a6bf28af6758aab5d2fa7f09c7`; repair before expanding if red.
2. When green, instantiate `ShieldController` in `RescueScene`, consume the dock Shield event, publish shield state through `emitItemState`, and route hero/hazard collision through `resolveHit()`.
3. Add browser smoke for activation, one absorbed hit, subsequent lethal hit and Preview isolation inside the existing workflow only.
