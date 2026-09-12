# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **20-level starter milestone CI verified; live Level Editor/Debug Panel connected; editor metadata complete for all 20 levels**

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
- `LevelEditorMetadata` with 1-5 difficulty, tags and hint text is now guaranteed for the entire 20-level runtime set. Authored metadata is preserved; earlier levels without metadata receive deterministic derived metadata from world, objective, hazard mix, platform use, ink budget and time limit.
- Metadata normalization removes blank/duplicate tags without mutating the checked-in source level object, so editor/search data remains consistent.
- Validated JSON export/import plus safe scalar edit helpers for name/world/objective/time/ink/gravity.
- Internal Level Editor/Debug Panel UI is connected to the running Phaser scene: select a starter level, edit scalar fields, receive immediate validation errors, export/import JSON, restore the starter definition, and restart the scene with an in-memory custom level preview.
- Editor preview is explicitly non-destructive: edits stay in memory and do not overwrite the checked-in level set.
- Custom previews preserve their edited definition when the in-game Retry control is used; previous/next controls intentionally return to checked-in starter levels.
- Drawing/ink geometry extracted into deterministic pure utilities so final-segment clipping and sample thresholds are testable.
- Previous/next level controls for quick testing.
- Unit tests cover level validation, uniqueness, world/objective/hazard coverage, target occupancy, drawing geometry, chaser steering, falling timing, 20-level coverage, spike/world expansion, editor JSON round trips, and metadata derivation/preservation/completion.
- One path-scoped GitHub Actions workflow for test + typecheck + build; documentation-only status updates do not trigger CI.

Validation this round:
- Starting branch SHA was `ee32422acc32877d02f619df4ddb9a091d4095e9`; branch state was re-read immediately before creating the functional commit and had not moved.
- Functional commit: `2fcc52f10bbb56a81c2ddca82e3393f37892276f` (`feat(game): complete editor metadata for all levels`).
- CI run `34710926769` completed successfully on that exact commit.
- The CI workflow executed the existing install/test/typecheck/build verification pipeline successfully.
- New metadata unit tests verify deterministic derivation, preservation of authored difficulty/hints, duplicate/blank tag normalization, non-mutation of source levels, and collection-wide completion.
- The known non-blocking Phaser bundle-size warning remains deferred to the dedicated performance/lazy-loading milestone.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

Next:
1. Add the next substantially different threat, preferably a laser or moving mechanism, while keeping behavior data-driven and testable.
2. Add a lightweight browser smoke test for scene boot, drawing input, level switching and at least one spike-contact failure path now that the editor boundary is stable.
3. Start a simple level-select screen instead of relying only on previous/next debug buttons.
4. Continue toward additional objective types beyond `survive` and `reach`, prioritizing catch/fall-blocking or escort mechanics.
5. Address the Phaser bundle-size warning during the dedicated performance/lazy-loading milestone rather than spending extra CI runs on it now.
