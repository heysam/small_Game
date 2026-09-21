# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 7 active. Ink Refill is CI-green. Shield inventory and isolated one-hit absorption contract are CI-green; Shield dock verification hit a typecheck regression and has been minimally repaired, pending exact CI confirmation before gameplay collision wiring.**

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
- Started from branch SHA `99f939edc726ae7aa512ee184155b51a91843346`.
- Exact Shield dock CI run `35528808279` was `completed/failure`: all 61 unit tests passed, but `npm run typecheck` failed because `shieldDock.test.ts` imported `node:fs` while the project tsconfig intentionally exposes only Vite/browser types.
- Repaired only the failing test: it now reads `index.html` through the standard `fetch(new URL(..., import.meta.url))` path, avoiding Node-only type dependencies and leaving production code unchanged.
- Repair commit: `94d49118b8311f7a62b91e3d85f686fa2c6796c3`.
- No workflow was added or duplicated; the existing consolidated CI remains the verification gate.

### Known limitations / not complete
- The repair commit's exact CI result is pending; do not wire Shield gameplay until it is green.
- Shield gameplay activation and Matter collision interception are still pending; the visible Shield control remains deliberately non-operational until that path is safe and tested.
- Reinforced line, pause, redraw/eraser and revive remain pending.
- Progress/rewards/inventory remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains deferred to the performance milestone.

### Next
1. Verify the exact CI run for `94d49118b8311f7a62b91e3d85f686fa2c6796c3`; repair before expanding if red.
2. When green, wire Shield activation to consume exactly one inventory item in formal play, preserve Preview inventory, and route hero/hazard collision through the existing one-hit Shield contract.
3. Add browser smoke for activation, one absorbed hit, subsequent lethal hit and Preview isolation inside the existing workflow only.
