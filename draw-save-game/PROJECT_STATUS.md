# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 7 active. Ink Refill is CI-green. Shield inventory, one-hit absorption, activation transaction, scene-facing controller, and dock event contract are CI-green. Shield scene collision boundary is now under CI verification.**

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
- Shield inventory verification `305255b3424f8b6c72b2eac40fcb2bcfc17bb1ba` passed run `35494002940`.
- Shield round-state verification `845ff6fd1c87e0eea3dd6016a550e878195054bb` passed run `35510315140`.
- Shield dock fixture repair `99e0e46e09d3ba1000ad12d300009fd71009d6c7` passed run `35568159589`.
- Shield activation transaction `e5734181376b1c103ce383dffada678e9e255eb3` passed run `35637667714`.
- Scene-facing Shield controller `202d9020697f8d58a04fab91eff4cac3eec5e666` passed run `35671851664`.
- DOM-free Shield dock event verification `be98a037bb1bdeb5802cb68b616ee2456a91c110` passed run `35767251332` (`completed/success`).

### Milestone 7 inventory
- Shared inventory ledger has normalization, bounded stacks, grant/consume and persistence helpers.
- Ink Refill consumes one item and raises current/max ink by 25% (minimum +10), once per round before danger starts.
- Editor Preview refuses formal item consumption.
- Shield shares the same v1 ledger and old Ink-only saves normalize to `shield: 0`.
- Shield round-state absorbs exactly one otherwise-lethal hazard hit after arming, then disarms; unarmed hits remain lethal.
- Shield activation consumes inventory only when a formal round can actually arm the shield.
- `ShieldController` owns scene-local shield state while reusing the shared inventory transaction and one-hit contract.

### Implemented this batch — 2026-09-23
- Re-read branch head, status record and exact workflow result before expansion.
- Confirmed verification commit `be98a037bb1bdeb5802cb68b616ee2456a91c110` passed exact run `35767251332`.
- Added `shieldScene.ts`, a thin scene boundary that derives dock-facing Shield state and converts `ShieldController.resolveHit()` into the lethal/non-lethal decision needed by Matter collision handling.
- Added tests proving: formal inventory exposes Shield as usable; Editor Preview never exposes inventory as consumable; after activation the first hazard hit is absorbed and the next is lethal.
- Production adapter commit `b4304e5b1d97de84e81467b7ca254fc66236a0e2` used `[skip ci]`; verification commit `8f613d1a7726a9de5a0393193678f27bcc3f1bf6` is the only CI-triggering commit for this batch.

### Known limitations / not complete
- Exact CI result for `8f613d1a7726a9de5a0393193678f27bcc3f1bf6` is pending; repair before expanding if red.
- `RescueScene` still needs to instantiate `ShieldController`, consume the Shield dock event, publish Shield state through `emitItemState`, and route hero/hazard collision through the new scene boundary.
- Reinforced line, pause, redraw/eraser and revive remain pending.
- Progress/rewards/inventory remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains deferred to the performance milestone.

### Next
1. Verify exact CI for `8f613d1a7726a9de5a0393193678f27bcc3f1bf6`; repair before expanding if red.
2. When green, wire `ShieldController` + `shieldScene` into `RescueScene`, the existing item event and `emitItemState`.
3. Add browser smoke for activation, one absorbed hit, subsequent lethal hit and Preview isolation inside the existing workflow only.
