# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **in progress, CI verified through previous round; current batch awaiting CI**

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

Previous verified baseline:
- CI run `34570111151` on commit `7664849a2e2b37cc07a518c5a7f054f6f8c91493` completed successfully.
- `npm install --no-audit --no-fund`, `npm test`, `npm run typecheck`, and `npm run build` passed.

Current batch validation:
- Awaiting GitHub Actions for the commit that adds drawing utilities, static platforms, reach objectives and levels 4–6. Do not treat this batch as verified until that workflow is green.

Next:
1. Verify current batch in CI; fix any regression before expanding features.
2. Add the first distinct hazard behavior so gameplay is no longer limited to bouncing orb hazards.
3. Grow the data-driven starter set from 6 toward 20 original playable levels.
4. Add objective-specific level metadata suitable for the future level editor/debug panel.
