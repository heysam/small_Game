# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **in progress, falling-hazard + 15-level batch CI verified**

Completed:
- Isolated `draw-save-game/` web project; existing Django game remains untouched.
- TypeScript + Vite + Phaser 3 + Matter Physics skeleton.
- Responsive mobile/desktop canvas with safe-area handling.
- Pointer/touch freehand drawing with a finite ink budget.
- Drawn path converted into static Matter collision segments.
- Original procedural placeholder rescue character/hazard visuals; no copied game assets.
- Collision-based failure, survival victory, HUD, retry control.
- Data-driven `LevelDefinition` schema with runtime validation.
- Fifteen original starter layouts across city, forest, cave and laboratory worlds.
- Static platform/obstacle schema and rendering, including rotated platforms.
- Two objective types: `survive` and `reach`, with visible target zones and hold-to-confirm success.
- Three hazard behaviors: bouncing `orb`, active `chaser`, and periodic gravity-driven `falling` hazards with optional horizontal drift.
- Falling hazards reset on validated intervals so they remain an active environmental threat instead of becoming a one-shot projectile.
- Pure, unit-testable chaser steering and falling-hazard timing/velocity helpers.
- Optional `LevelEditorMetadata` with 1-5 difficulty, tags and hint text; the newest five levels include metadata for future Level Editor/Debug Panel workflows.
- Drawing/ink geometry extracted into deterministic pure utilities so final-segment clipping and sample thresholds are testable.
- Previous/next level controls for quick testing.
- Unit tests for level validation, uniqueness, world/objective/hazard coverage, target occupancy, drawing geometry, chaser steering and falling-hazard timing.
- One path-scoped GitHub Actions workflow for test + typecheck + build; documentation-only status updates do not trigger CI.

Validation this round:
- Starting branch SHA was `889d0b0b61144071f4edd47e3ea1935cb3c963c8` and was re-read before the feature commit.
- Feature commit: `2f887e53816ac232320361473e5eb8aef48d0145` (`feat(game): add falling hazards and fifteen starter levels`).
- CI run `34661550797` completed successfully on the feature commit.
- `npm install --no-audit --no-fund`: passed (54 packages installed).
- `npm test`: passed (3 test files, 11 tests).
- `npm run typecheck`: passed.
- `npm run build`: passed (Vite production build completed).
- Build output currently reports a non-blocking bundle-size warning: the main JS chunk is about 1.23 MB minified / 338 KB gzip. This is recorded for the later performance/lazy-loading milestone rather than hidden or marked resolved.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

Next:
1. Reach the first target of 20 original playable levels, extending Level Editor metadata coverage to the full starter set.
2. Add a fourth environmental threat with substantially different behavior, preferably spikes/laser/moving mechanism rather than another projectile variant.
3. Start the internal Level Editor/Debug Panel with data import/export and live parameter editing before adding large numbers of hand-authored levels.
4. Add a lightweight browser smoke test for scene boot, drawing input and level switching once the editor boundary is established.
5. Address the current Phaser bundle-size warning during the dedicated performance/lazy-loading milestone; do not spend extra CI runs on it before higher-priority gameplay milestones are complete.
