# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **20-level starter milestone CI verified; editor data boundary started**

Completed:
- Isolated `draw-save-game/` web project; existing Django game remains untouched.
- TypeScript + Vite + Phaser 3 + Matter Physics skeleton.
- Responsive mobile/desktop canvas with safe-area handling.
- Pointer/touch freehand drawing with a finite ink budget.
- Drawn path converted into static Matter collision segments.
- Original procedural placeholder rescue character/hazard visuals; no copied game assets.
- Collision-based failure, survival victory, HUD, retry control.
- Data-driven `LevelDefinition` schema with runtime validation.
- Twenty original starter layouts across city, forest, cave, laboratory and harbor worlds.
- Static platform/obstacle schema and rendering, including rotated platforms.
- Two objective types: `survive` and `reach`, with visible target zones and hold-to-confirm success.
- Four hazard behaviors: bouncing `orb`, active `chaser`, periodic gravity-driven `falling`, and immobile contact `spike` traps.
- Falling hazards reset on validated intervals so they remain an active environmental threat instead of becoming a one-shot projectile.
- Spike hazards are static Matter bodies and immediately fail the run on hero contact, creating a floor/route constraint rather than another projectile variant.
- Pure, unit-testable chaser steering and falling-hazard timing/velocity helpers.
- Optional `LevelEditorMetadata` with 1-5 difficulty, tags and hint text; all five new expansion levels carry editor metadata.
- First Level Editor data boundary: validated JSON export/import plus safe scalar live-edit helpers for name/world/objective/time/ink/gravity.
- Drawing/ink geometry extracted into deterministic pure utilities so final-segment clipping and sample thresholds are testable.
- Previous/next level controls for quick testing.
- Unit tests for level validation, uniqueness, world/objective/hazard coverage, target occupancy, drawing geometry, chaser steering, falling timing, 20-level coverage, spike/world expansion and editor JSON round trips.
- One path-scoped GitHub Actions workflow for test + typecheck + build; documentation-only status updates do not trigger CI.

Validation this round:
- Starting branch SHA was `2a67cded523a89b4e78da587788416c49e7680b0` and was re-read before the feature commit.
- Feature commit: `dadcb0fceb2e840f4cce9aadf9887ba9f3050835` (`feat(game): reach twenty levels with spike hazards and editor data tools`).
- CI run `34678278848` completed successfully.
- `npm install --no-audit --no-fund`: passed (54 packages installed).
- `npm test`: passed (5 test files, 17 tests).
- `npm run typecheck`: passed.
- `npm run build`: passed (Vite production build completed in about 4.64s).
- Build output still reports the known non-blocking bundle-size warning: main JS is about 1.23 MB minified / 338.82 KB gzip.
- GitHub runner additionally warns that `actions/checkout@v4` and `actions/setup-node@v4` target deprecated Node 20 internals even though the workflow itself explicitly tests on Node 22; this is upstream action-runtime noise, not an application build failure.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

Next:
1. Turn the editor data helpers into an internal Level Editor/Debug Panel UI with JSON import/export, live scalar controls, immediate validation errors and level preview/restart.
2. Extend editor metadata to the earlier 15 starter levels so the whole 20-level set is editable/searchable consistently.
3. Add the next substantially different threat, preferably laser or moving mechanism, and keep gameplay logic data-driven.
4. Add a lightweight browser smoke test for scene boot, drawing input, level switching and at least one spike-contact failure path once the editor boundary is stable.
5. Start a simple level-select screen instead of relying only on previous/next debug buttons.
6. Address the Phaser bundle-size warning during the dedicated performance/lazy-loading milestone; do not spend extra CI runs on it before higher-priority gameplay milestones are complete.
