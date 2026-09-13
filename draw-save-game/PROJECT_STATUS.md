# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **20-level starter milestone CI verified; live Level Editor/Debug Panel connected; fifth hazard behavior now implemented and verified**

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
- The Harbor `暴風裝卸區` challenge now includes a horizontally sweeping mover, adding timing and route-planning pressure to the existing mixed-hazard level.
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
- One path-scoped GitHub Actions workflow for test + typecheck + build; documentation-only status updates do not trigger CI.

Validation this round:
- Starting branch SHA was `4c9f7fc02322dd883e8c670d0baf6ee57f181491`; the branch was re-read before the batch and again before this status update to avoid stale-tree overwrite.
- Latest functional commit: `454059634a79926e037ee6519d4cb375a2cf0463` (`feat(game): run moving obstacle in Matter runtime`).
- CI run `34727933633` completed successfully on that exact commit.
- Verified CI steps: checkout, Node setup, `npm install --no-audit --no-fund`, `npm test`, `npm run typecheck`, and `npm run build` all completed successfully.
- Moving-hazard unit tests verify both ends and midpoint positions over a complete oscillation cycle and reject invalid range/speed settings.
- The runtime uses a static Matter body repositioned deterministically each update, with a visible axis marker and normal hero-contact failure behavior.
- The known non-blocking Phaser bundle-size warning remains deferred to the dedicated performance/lazy-loading milestone.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

Next:
1. Add a lightweight browser smoke test for scene boot, drawing input, level switching and at least one hazard-contact failure path now that five hazard behaviors and the editor boundary are stable.
2. Start a simple level-select screen instead of relying only on previous/next debug buttons.
3. Continue toward additional objective types beyond `survive` and `reach`, prioritizing catch/fall-blocking or escort mechanics.
4. Add a laser or timed environmental hazard after browser smoke coverage is in place, rather than stacking more runtime behavior without end-to-end browser verification.
5. Address the Phaser bundle-size warning during the dedicated performance/lazy-loading milestone rather than spending extra CI runs on it now.
