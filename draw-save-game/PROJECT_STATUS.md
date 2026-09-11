# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **in progress**

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
- One path-scoped GitHub Actions workflow for test + typecheck + build; no per-feature workflow proliferation.

Validation this round:
- Source/config changes are committed as one batch on the isolated `draw-save-game` branch.
- CI is expected to run `npm test`, `npm run typecheck`, and `npm run build`; its result must be checked before this milestone is marked verified.
- Production build is **not yet marked verified** until the new workflow completes successfully.

Next:
1. Inspect the CI run and fix any test/type/build errors before expanding gameplay.
2. Extract drawing/ink geometry into pure utilities and add deterministic unit tests.
3. Expand the level schema to support static platforms/obstacles and at least one additional objective type.
4. Grow the data-driven starter set toward 20 original playable levels.
