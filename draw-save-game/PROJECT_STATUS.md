# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **20-level starter milestone CI verified; live Level Editor/Debug Panel connected**

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
- Optional `LevelEditorMetadata` with 1-5 difficulty, tags and hint text; all five expansion levels currently carry editor metadata.
- Validated JSON export/import plus safe scalar edit helpers for name/world/objective/time/ink/gravity.
- Internal Level Editor/Debug Panel UI is now connected to the running Phaser scene: select a starter level, edit scalar fields, receive immediate validation errors, export/import JSON, restore the starter definition, and restart the scene with an in-memory custom level preview.
- Editor preview is explicitly non-destructive: edits stay in memory and do not overwrite the checked-in level set.
- Custom previews preserve their edited definition when the in-game Retry control is used; previous/next controls intentionally return to checked-in starter levels.
- Drawing/ink geometry extracted into deterministic pure utilities so final-segment clipping and sample thresholds are testable.
- Previous/next level controls for quick testing.
- Unit tests for level validation, uniqueness, world/objective/hazard coverage, target occupancy, drawing geometry, chaser steering, falling timing, 20-level coverage, spike/world expansion and editor JSON round trips.
- One path-scoped GitHub Actions workflow for test + typecheck + build; documentation-only status updates do not trigger CI.

Validation this round:
- Starting branch SHA was `3d2ee4ba690ccc557b13664277573afdd0c6e966` and latest branch state was re-read before the final status update.
- Functional batch commits: `69a4e937e93d76ea03ebd865ae1e6f0f4114e537` (editor UI), `a8dc34bcf8cc67200ab245b5e44e31d4acfde65c` (responsive editor styling), and `bdef5d6b93542c3918ef3f2ad9a632e8229b7306` (live Phaser preview wiring).
- CI run `34693625419` completed successfully on `bdef5d6b93542c3918ef3f2ad9a632e8229b7306`.
- `npm install --no-audit --no-fund`: passed.
- `npm test`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- The known non-blocking Phaser bundle-size warning remains deferred to the dedicated performance/lazy-loading milestone.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

Next:
1. Extend editor metadata to the earlier 15 starter levels so the whole 20-level set is editable/searchable consistently.
2. Add the next substantially different threat, preferably laser or a moving mechanism, while keeping behavior data-driven and testable.
3. Add a lightweight browser smoke test for scene boot, drawing input, level switching and at least one spike-contact failure path now that the editor boundary is stable.
4. Start a simple level-select screen instead of relying only on previous/next debug buttons.
5. Continue toward additional objective types beyond `survive` and `reach`, prioritizing catch/fall-blocking or escort mechanics.
6. Address the Phaser bundle-size warning during the dedicated performance/lazy-loading milestone rather than spending extra CI runs on it now.
