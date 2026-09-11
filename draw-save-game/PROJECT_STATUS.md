# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **in progress, CI verified**

Completed:
- Isolated `draw-save-game/` web project; existing Django game remains untouched.
- TypeScript + Vite + Phaser 3 + Matter Physics skeleton.
- Responsive mobile/desktop canvas with safe-area handling.
- Pointer/touch freehand drawing with a finite ink budget.
- Drawn path converted into static Matter collision segments.
- Original procedural placeholder rescue character/hazard visuals; no copied game assets.
- Collision-based failure, survival victory, HUD, retry control.
- Data-driven `LevelDefinition` schema with runtime validation.
- Three original starter layouts (`city-01` to `city-03`) with different hero positions, ink limits, gravity, survival times and deterministic hazard spawns.
- Previous/next level controls for quick testing.
- Unit tests for level validation and starter-level uniqueness.
- One path-scoped GitHub Actions workflow for test + typecheck + build; documentation-only status updates no longer trigger CI.

Validation this round:
- CI run `34570111151` on commit `7664849a2e2b37cc07a518c5a7f054f6f8c91493` completed successfully.
- `npm install --no-audit --no-fund`: passed.
- `npm test`: passed (1 test file, 2 tests).
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Earlier CI failures were fixed rather than ignored: first the cache referenced a non-existent lockfile; then Matter/Phaser typing errors were corrected by using Matter bodies directly and cleaning the collision listener on scene shutdown.

Next:
1. Extract drawing/ink geometry into pure utilities and add deterministic unit tests.
2. Expand the level schema to support static platforms/obstacles and at least one additional objective type.
3. Grow the data-driven starter set toward 20 original playable levels.
4. Add the first distinct hazard behavior so gameplay is no longer limited to bouncing orb hazards.
