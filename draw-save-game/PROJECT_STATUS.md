# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **20-level starter milestone CI verified; Level Editor/Debug Panel connected; five hazard behaviors verified; Level Select has persisted completion/star/unlock flow; third objective (`catch`) is now playable and CI verified**

Completed:
- Isolated `draw-save-game/` web project; existing Django game remains untouched.
- TypeScript + Vite + Phaser 3 + Matter Physics responsive prototype with mouse/touch drawing, finite ink, static drawn collision bodies, victory/failure logic and retry.
- Data-driven validated level schema with 20 original starter levels across city, forest, cave, laboratory and harbor worlds.
- Three objective types are now supported: `survive`, `reach`, and `catch`.
- `catch` is a real fall-blocking interaction rather than an alias: the rescued character is held static while the player draws, is released when the round starts, and must remain inside a blue rescue zone for the configured hold time; timeout or hazard contact still fails the round.
- Harbor level `harbor-01` is now the original catch scenario `吊鉤失效`, with a suspended character, rescue zone, side spikes and periodic falling hazard.
- Catch/reach objectives require validated target zones; the Level Editor objective selector now includes `catch`.
- Static/rotated platforms and visible reach/catch target zones are supported.
- Five differentiated hazards: bouncing orb, active chaser, periodic falling hazard, static spike, and deterministic oscillating mover.
- Level Editor/Debug Panel supports safe scalar edits, validation, JSON import/export/reset and in-memory Phaser preview without overwriting checked-in levels.
- Deterministic editor metadata (difficulty/tags/hints) is guaranteed for all 20 runtime levels.
- Real Level Select groups levels by world and renders current lock and best-star state.
- Normal Level Select launch is separate from editor custom-preview semantics: checked-in levels restart as normal gameplay, while editor previews remain `customLevel` runs and never write formal progress.
- Versioned local progress (`draw-save-game.progress.v1`) records successful formal runs, best stars, best remaining ink and next-level unlocks; failures/editor previews grant no progress.
- Initial star calculation is based on remaining ink: >=50% = 3 stars, >=25% = 2 stars, otherwise a completed run receives 1 star. Existing better results are preserved.
- After a formal victory, `finishRound()` saves progress and refreshes the existing Level Select immediately.
- Storage helpers remain behind Storage-compatible interfaces for future guest/cloud sync.
- Playwright Chromium covers three browser paths: real app draw/editor preview, deterministic hero/spike failure, and a real first-level completion that unlocks level 2 and remains unlocked with stars after page reload.
- Scene restart teardown safely removes the Matter collision listener from the captured world instance.
- One path-scoped GitHub Actions workflow runs unit tests, typecheck, production build and Playwright Chromium smoke; documentation-only status commits do not trigger CI.

Validation this round:
- Starting branch SHA was `4435a04d0303458b6ea8cea880ae96b3d160be0c`; branch was re-read before writing and again immediately before commit construction, with no external commit detected.
- Feature commit: `1583f85658df7c2021a0c796f9827897d0e09bed` (`feat(game): add catch rescue objective`).
- GitHub Actions run `34792863426` completed successfully for that exact commit.
- Verified CI steps: dependency install, unit tests, `npm run typecheck`, `npm run build`, Playwright Chromium installation, and the full existing browser smoke suite all succeeded.
- The 20-level test suite now explicitly verifies that a `catch` level exists, has a rescue target, and carries catch metadata.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

Known limitation / not marked complete:
- Progress is still local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Catch currently uses the same rectangular target-zone primitive as reach, with different runtime semantics and presentation; future objective tooling can add dedicated spawn/landing markers without breaking the current schema.
- Star scoring currently uses remaining ink only; future objective/time/optional-goal scoring can extend this without changing the persisted best-result contract.
- Known non-blocking Phaser bundle-size warning remains around the existing large Phaser main bundle; defer code splitting/lazy loading to the performance milestone.

Next:
1. Add the sixth differentiated environmental hazard, prioritizing a timed laser with warning/active phases and deterministic timing tests.
2. Add explicit result presentation with retry/next controls instead of relying mainly on status text.
3. Continue Milestone 5 UX: hint/tutorial behavior, sound/vibration settings and accessibility options.
4. Expand progression/reward systems only after the objective/hazard foundation remains green.
5. Address bundle-size/lazy-loading only during the dedicated performance milestone.
