# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **in progress, current chaser-hazard batch CI verified**

Completed:
- Isolated `draw-save-game/` web project; existing Django game remains untouched.
- TypeScript + Vite + Phaser 3 + Matter Physics skeleton.
- Responsive mobile/desktop canvas with safe-area handling.
- Pointer/touch freehand drawing with a finite ink budget.
- Drawn path converted into static Matter collision segments.
- Original procedural placeholder rescue character/hazard visuals; no copied game assets.
- Collision-based failure, survival victory, HUD, retry control.
- Data-driven `LevelDefinition` schema with runtime validation.
- Ten original starter layouts across city, forest and cave worlds.
- Static platform/obstacle schema and rendering, including rotated platforms.
- Two objective types: `survive` and `reach`, with visible target zones and hold-to-confirm success.
- Two hazard behaviors: bouncing `orb` and active `chaser` that continuously steers toward the hero.
- Pure, unit-testable chaser steering geometry with speed validation.
- Drawing/ink geometry extracted into deterministic pure utilities so final-segment clipping and sample thresholds are testable.
- Previous/next level controls for quick testing.
- Unit tests for level validation, uniqueness, world/objective/hazard coverage, target occupancy, drawing geometry and chaser steering.
- One path-scoped GitHub Actions workflow for test + typecheck + build; documentation-only status updates do not trigger CI.

Validation this round:
- Feature commit: `5f5e19bd05e67a167bd9215a5e4d714b1f277c6c`.
- The first CI run (`34633481587`) correctly caught a TypeScript regression: `HazardKind` was referenced by the runtime but not exported by `level.ts`.
- Fix commit: `dac05350ece909d964b848033d357afb1b9c5127` exports `HazardKind` from the existing hazard union without changing runtime behavior.
- CI run `34633574529` completed successfully.
- `npm install --no-audit --no-fund`: passed.
- `npm test`: passed (3 files, 8 tests).
- `npm run typecheck`: passed.
- `npm run build`: passed.
- The branch was re-read before each write; no reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

Next:
1. Grow the starter set from 10 toward 20 original playable levels.
2. Add a third hazard behavior with different physics (falling/periodic or environmental hazard) rather than another homing variant.
3. Add objective/editor metadata suitable for the future Level Editor/Debug Panel.
4. Add a lightweight playable smoke test once level behavior is stable enough to avoid brittle CI.
