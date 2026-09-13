# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **20-level starter milestone CI verified; live Level Editor/Debug Panel connected; five hazard behaviors verified; Chromium browser smoke coverage now green**

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
- Five hazard behaviors: bouncing `orb`, active `chaser`, periodic gravity-driven `falling`, immobile contact `spike`, and kinematic oscillating `mover` mechanisms.
- Falling hazards reset on validated intervals so they remain an active environmental threat instead of becoming a one-shot projectile.
- Spike hazards are static Matter bodies and immediately fail the run on hero contact, creating a floor/route constraint rather than another projectile variant.
- Mover hazards support horizontal/vertical axes, range, speed and optional phase offsets. Runtime movement is deterministic, kinematic, and independent of gravity so it behaves like a moving machine/obstacle rather than another projectile.
- The Harbor `暴風裝卸區` challenge includes a horizontally sweeping mover, adding timing and route-planning pressure to the existing mixed-hazard level.
- Pure, unit-testable chaser steering, falling-hazard timing/velocity, and oscillating mover-position helpers.
- `LevelEditorMetadata` with 1-5 difficulty, tags and hint text is guaranteed for the entire 20-level runtime set. Authored metadata is preserved; earlier levels without metadata receive deterministic derived metadata from world, objective, hazard mix, platform use, ink budget and time limit.
- Metadata normalization removes blank/duplicate tags without mutating the checked-in source level object, so editor/search data remains consistent.
- Validated JSON export/import plus safe scalar edit helpers for name/world/objective/time/ink/gravity.
- Internal Level Editor/Debug Panel UI is connected to the running Phaser scene: select a starter level, edit scalar fields, receive immediate validation errors, export/import JSON, restore the starter definition, and restart the scene with an in-memory custom level preview.
- Editor preview is explicitly non-destructive: edits stay in memory and do not overwrite the checked-in level set.
- Custom previews preserve their edited definition when the in-game Retry control is used; previous/next controls intentionally return to checked-in starter levels.
- Drawing/ink geometry extracted into deterministic pure utilities so final-segment clipping and sample thresholds are testable.
- Previous/next level controls for quick testing.
- Unit tests cover level validation, uniqueness, world/objective/hazard coverage, target occupancy, drawing geometry, chaser steering, falling timing, mover oscillation, 20-level coverage, spike/mover/world expansion, editor JSON round trips, and metadata derivation/preservation/completion.
- Playwright Chromium browser smoke coverage now boots the real Vite/Phaser app, performs a real mouse-drawn stroke, switches an editor-selected level preview, imports a deterministic custom spike scenario, exercises hero/hazard contact, captures canvas state changes, and fails on uncaught page errors.
- Unit tests and Playwright tests use separate runners so Vitest does not collect Playwright specs.
- Scene restarts now detach the Matter `collisionstart` listener from the captured world instance rather than dereferencing `this.matter.world` after Phaser teardown; this fixes the real browser restart error surfaced by the new smoke test.
- One path-scoped GitHub Actions workflow runs unit tests, typecheck, production build and Playwright Chromium smoke tests; documentation-only status updates do not trigger CI.

Validation this round:
- Starting branch SHA was `0d9e6c838261690c27668d1aaf44bae967ac4bbc`; the branch was re-read before writes and again before this status update to avoid stale-tree overwrite.
- Browser-smoke infrastructure commit: `1993a7ea8dbea3788da08797423c83d359cf0361`.
- The first CI run correctly exposed that Vitest was collecting Playwright specs; `eb9a0f0e2ca0e25318b58c6cfe09f4c321d38434` separated the runners.
- The next browser run exposed two issues rather than being marked complete: the textarea assertion needed value semantics, and scene restart raised `TypeError: Cannot read properties of null (reading 'off')` during Matter teardown.
- Browser assertion fix commit: `cfb0724322e0e284503542b5154addad5e68e5fe`.
- Runtime teardown fix commit: `05fd6b71ba2d6c2127761815b6836b3300967702` (`fix(game): detach Matter collision listener safely on restart`).
- CI run `34742656354` on the runtime fix completed successfully.
- Verified CI steps on the green run: `npm install --no-audit --no-fund`, `npm test` (6 files / 22 unit tests), `npm run typecheck`, `npm run build`, `npx playwright install --with-deps chromium`, and `npm run test:browser` (2 Chromium smoke tests) all succeeded.
- The known non-blocking Phaser bundle-size warning remains approximately 1.235 MB minified / 340.74 KB gzip and is deferred to the dedicated performance/lazy-loading milestone.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

Next:
1. Build a real level-select screen grouped by world instead of relying only on previous/next debug controls.
2. Add persistent local progress primitives (unlocked level, best stars/result) so the level-select screen can represent player progression before cloud accounts are introduced.
3. Continue toward additional objective types beyond `survive` and `reach`, prioritizing catch/fall-blocking or escort mechanics.
4. Add a laser or timed environmental hazard now that browser smoke coverage protects scene restart, drawing and hazard-contact paths.
5. Reduce repeated Playwright browser installation cost in CI when moving into the dedicated CI/performance pass; keep the existing single workflow rather than adding another workflow.
6. Address the Phaser bundle-size warning during the dedicated performance/lazy-loading milestone.
