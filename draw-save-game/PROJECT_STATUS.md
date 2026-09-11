# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **in progress, current batch CI verified**

Completed:
- Isolated `draw-save-game/` web project; existing Django game remains untouched.
- TypeScript + Vite + Phaser 3 + Matter Physics skeleton.
- Responsive mobile/desktop canvas with safe-area handling.
- Pointer/touch freehand drawing with a finite ink budget.
- Drawn path converted into static Matter collision segments.
- Original procedural placeholder rescue character/hazard visuals; no copied game assets.
- Collision-based failure, survival victory, HUD, retry control.
- Data-driven `LevelDefinition` schema with runtime validation.
- Six original starter layouts across city and forest worlds.
- Static platform/obstacle schema and rendering, including rotated platforms.
- Second objective type: `reach`, with a visible target zone, hold-to-confirm success and time-limit failure.
- Drawing/ink geometry extracted into deterministic pure utilities so final-segment clipping and sample thresholds are testable.
- Previous/next level controls for quick testing.
- Unit tests for level validation, uniqueness, world/objective coverage, target occupancy and drawing geometry.
- One path-scoped GitHub Actions workflow for test + typecheck + build; documentation-only status updates do not trigger CI.

Validation this round:
- CI run `34598819302` on commit `4888a26fb680df7b4bb5d6c6ee1900ee7ee4b1fc` completed successfully.
- `npm install --no-audit --no-fund`: passed.
- `npm test`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- No existing Django/legacy game files were changed by this batch.

Next:
1. Add the first distinct hazard behavior so gameplay is no longer limited to bouncing orb hazards.
2. Grow the data-driven starter set from 6 toward 20 original playable levels.
3. Add objective-specific level metadata suitable for the future level editor/debug panel.
4. Add a lightweight playable smoke test once level behavior is stable enough to avoid brittle CI.
