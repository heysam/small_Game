# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **in progress; chaser hazard batch awaiting CI verification**

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
- Functional commit is pending GitHub Actions verification.
- The branch base was re-read before writing and remained at `4d058824ba9585e65aef60dc6b930f5cd2a8d8ec`.
- No existing Django/legacy game files are included in this batch.

Next:
1. Confirm test + typecheck + build in GitHub Actions; fix any regression before adding features.
2. Grow the starter set from 10 toward 20 original playable levels.
3. Add a third hazard behavior with different physics (falling/periodic or environmental hazard) rather than another homing variant.
4. Add objective/editor metadata suitable for the future Level Editor/Debug Panel.
5. Add a lightweight playable smoke test once level behavior is stable enough to avoid brittle CI.
