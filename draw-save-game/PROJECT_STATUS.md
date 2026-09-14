# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **20-level starter milestone CI verified; Level Editor/Debug Panel connected; six hazard behaviors verified; Level Select has persisted completion/star/unlock flow; three objective types are playable**

Completed:
- Isolated `draw-save-game/` web project; existing Django game remains untouched.
- TypeScript + Vite + Phaser 3 + Matter Physics responsive prototype with mouse/touch drawing, finite ink, static drawn collision bodies, victory/failure logic and retry.
- Data-driven validated level schema with 20 original starter levels across city, forest, cave, laboratory and harbor worlds.
- Three objective types are supported: `survive`, `reach`, and `catch`.
- `catch` is a real fall-blocking interaction: the rescued character is held static while the player draws, is released when the round starts, and must remain inside a blue rescue zone for the configured hold time; timeout or hazard contact still fails the round.
- Static/rotated platforms and visible reach/catch target zones are supported.
- Six differentiated hazards are now implemented: bouncing orb, active chaser, periodic falling hazard, static spike, deterministic oscillating mover, and timed laser.
- Timed laser uses deterministic `warning -> active -> cooldown` phases, optional phase offsets, visible phase styling, and only places its Matter sensor body in the beam while active.
- `lab-05` is now the original `雷射撤離` scenario and combines a timed horizontal laser with spikes, a falling hazard and a reach objective.
- Laser schema validation covers beam length, timing values and phase offset; deterministic timing unit tests cover phase boundaries, repeat cycles, offsets and invalid configuration.
- Level Editor/Debug Panel supports safe scalar edits, validation, JSON import/export/reset and in-memory Phaser preview without overwriting checked-in levels.
- Deterministic editor metadata (difficulty/tags/hints) is guaranteed for all 20 runtime levels.
- Real Level Select groups levels by world and renders current lock and best-star state.
- Normal Level Select launch is separate from editor custom-preview semantics: checked-in levels restart as normal gameplay, while editor previews remain `customLevel` runs and never write formal progress.
- Versioned local progress (`draw-save-game.progress.v1`) records successful formal runs, best stars, best remaining ink and next-level unlocks; failures/editor previews grant no progress.
- Initial star calculation is based on remaining ink: >=50% = 3 stars, >=25% = 2 stars, otherwise a completed run receives 1 star. Existing better results are preserved.
- After a formal victory, `finishRound()` saves progress and refreshes the existing Level Select immediately.
- Storage helpers remain behind Storage-compatible interfaces for future guest/cloud sync.
- Playwright Chromium covers real app draw/editor preview, deterministic hero/spike failure, and a real first-level completion that unlocks level 2 and remains unlocked with stars after page reload.
- Scene restart teardown safely removes the Matter collision listener from the captured world instance.
- One path-scoped GitHub Actions workflow runs unit tests, typecheck, production build and Playwright Chromium smoke; documentation-only status commits do not trigger CI.

Validation this round:
- Starting branch SHA was `84f72c9c7eeaf3957662e22c68e5d0053069038f`; the branch was re-read before creating Git objects, again before creating the commit, and again before the fast-forward ref update, with no external commit detected.
- Feature commit: `3e53499e17d0c04a5f53005f3ea43611c409cef2` (`feat(game): add timed laser hazard`).
- GitHub Actions run `34813574702` completed successfully for that exact commit.
- Verified CI steps: dependency install, unit tests, `npm run typecheck`, `npm run build`, Playwright Chromium installation, and the full existing browser smoke suite all succeeded.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

Known limitation / not marked complete:
- Progress is still local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Timed laser currently uses a rectangular beam primitive and deterministic phase state; Level Editor does not yet expose dedicated laser timing/length controls beyond JSON editing.
- Catch currently uses the same rectangular target-zone primitive as reach, with different runtime semantics and presentation; future objective tooling can add dedicated spawn/landing markers without breaking the current schema.
- Star scoring currently uses remaining ink only; future objective/time/optional-goal scoring can extend this without changing the persisted best-result contract.
- Known non-blocking Phaser bundle-size warning remains around the existing large Phaser main bundle; defer code splitting/lazy loading to the performance milestone.

Next:
1. Add explicit result presentation with retry/next controls instead of relying mainly on status text.
2. Continue Milestone 5 UX: hint/tutorial behavior, sound/vibration settings and accessibility options.
3. Add dedicated Level Editor controls for hazard-specific parameters as the editor matures.
4. Expand progression/reward systems only after the objective/hazard foundation remains green.
5. Address bundle-size/lazy-loading only during the dedicated performance milestone.
