# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **20-level starter milestone CI verified; Level Editor/Debug Panel connected; six hazard behaviors verified; Level Select has persisted completion/star/unlock flow; three objective types are playable; formal result flow is browser-verified; player tutorial and per-level hints are integrated**

Completed:
- Isolated `draw-save-game/` web project; existing Django game remains untouched.
- TypeScript + Vite + Phaser 3 + Matter Physics responsive prototype with mouse/touch drawing, finite ink, static drawn collision bodies, victory/failure logic and retry.
- Data-driven validated level schema with 20 original starter levels across city, forest, cave, laboratory and harbor worlds.
- Three objective types are supported: `survive`, `reach`, and `catch`.
- `catch` is a real fall-blocking interaction: the rescued character is held static while the player draws, is released when the round starts, and must remain inside a blue rescue zone for the configured hold time; timeout or hazard contact still fails the round.
- Static/rotated platforms and visible reach/catch target zones are supported.
- Six differentiated hazards are implemented: bouncing orb, active chaser, periodic falling hazard, static spike, deterministic oscillating mover, and timed laser.
- Timed laser uses deterministic `warning -> active -> cooldown` phases, optional phase offsets, visible phase styling, and only places its Matter sensor body in the beam while active.
- `lab-05` is the original `雷射撤離` scenario and combines a timed horizontal laser with spikes, a falling hazard and a reach objective.
- Laser schema validation covers beam length, timing values and phase offset; deterministic timing unit tests cover phase boundaries, repeat cycles, offsets and invalid configuration.
- Level Editor/Debug Panel supports safe scalar edits, validation, JSON import/export/reset and in-memory Phaser preview without overwriting checked-in levels.
- Deterministic editor metadata (difficulty/tags/hints) is guaranteed for all 20 runtime levels.
- Real Level Select groups levels by world and renders current lock and best-star state.
- Normal Level Select launch is separate from editor custom-preview semantics: checked-in levels restart as normal gameplay, while editor previews remain `customLevel` runs and never write formal progress.
- Versioned local progress (`draw-save-game.progress.v1`) records successful formal runs, best stars, best remaining ink and next-level unlocks; failures/editor previews grant no progress.
- Initial star calculation is based on remaining ink: >=50% = 3 stars, >=25% = 2 stars, otherwise a completed run receives 1 star. Existing better results are preserved.
- After a formal victory, `finishRound()` saves progress and refreshes the existing Level Select immediately.
- Formal victory/failure opens a responsive DOM result dialog with level name, stars/remaining ink where relevant, retry, conditional next-level navigation and return-to-map behavior.
- Result `重新挑戰` restarts the exact current formal level or preserves the current editor custom preview; `下一關` restarts the following checked-in formal level.
- Editor preview results are explicitly labeled `EDITOR PREVIEW`, state that no formal progress is written, and expose retry/back-to-editor behavior without contaminating saved progress.
- Scene creation always hides any stale result dialog before a restart or level switch.
- Result dialog uses dialog semantics (`role=dialog`, `aria-modal`, labelled heading), safe-area-aware layout, and mobile-responsive controls as a base for later accessibility work.
- Player-facing onboarding is now integrated into Level Select as a concise three-step tutorial covering observation, mouse/touch drawing with finite ink, release-to-start behavior, and the three objective families.
- Tutorial dismissal is versioned with `draw-save-game.tutorial.v1`; storage reads/writes fail safely in restricted/private browser contexts.
- Selecting any unlocked formal level collapses the first-visit tutorial and opens a `本關提示` panel that combines objective-specific guidance (`survive`/`reach`/`catch`) with the existing level `editor.hint`, so the game does not maintain a second duplicate hint dataset.
- Tutorial state and objective-specific guidance have focused unit coverage; the existing browser smoke suite remains green after the Level Select integration.
- Storage helpers remain behind Storage-compatible interfaces for future guest/cloud sync.
- Playwright Chromium covers real app drawing/editor preview, deterministic preview failure/result dismissal, and a real first-level victory that shows stars/Retry/Next, unlocks level 2, uses Next, and still preserves unlock/star progress after page reload.
- Scene restart teardown safely removes the Matter collision listener from the captured world instance.
- One path-scoped GitHub Actions workflow runs unit tests, typecheck, production build and Playwright Chromium smoke; documentation-only status commits do not trigger CI.

Validation this round:
- Starting branch SHA was `2fb169c41444bdbc971cb187112f2cf13205ec64`; branch state was re-read immediately before the feature ref update and had not changed, so no unrelated commit was overwritten.
- Feature commit: `3d2ba0fc2228860bb6e970bd3ad2ede8efac0151` (`feat(game): add player tutorial and level hints`).
- The feature batch was assembled as one Git tree/commit rather than one commit per file, avoiding redundant workflow runs.
- GitHub Actions run `34880818666` completed successfully for exact commit `3d2ba0fc2228860bb6e970bd3ad2ede8efac0151`.
- CI evidence: dependency install passed; unit tests passed; `npm run typecheck` passed; production `npm run build` passed; Playwright Chromium install passed; `npm run test:browser` passed.
- Branch was re-read after CI and remained exactly `3d2ba0fc2228860bb6e970bd3ad2ede8efac0151` before this status update.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

Known limitation / not marked complete:
- Progress is still local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Result UI has baseline dialog semantics and responsive layout, but full keyboard focus management, reduced-motion/high-contrast options and larger-text accessibility controls are not implemented yet.
- Tutorial/hints are now player-facing and persisted, but they remain a lightweight Level Select help surface rather than a step-by-step interactive overlay inside the Phaser canvas.
- Sound and vibration settings are not implemented yet.
- Timed laser currently uses a rectangular beam primitive and deterministic phase state; Level Editor does not yet expose dedicated laser timing/length controls beyond JSON editing.
- Catch currently uses the same rectangular target-zone primitive as reach, with different runtime semantics and presentation; future objective tooling can add dedicated spawn/landing markers without breaking the current schema.
- Star scoring currently uses remaining ink only; future objective/time/optional-goal scoring can extend this without changing the persisted best-result contract.
- Known non-blocking Phaser bundle-size warning remains: current main JS is about 1,243 kB minified / 343 kB gzip. Code splitting/lazy loading stays deferred to the dedicated performance milestone.

Next:
1. Continue Milestone 5 UX with persisted sound/vibration settings and safe defaults.
2. Add accessibility options: reduced motion, high contrast/color-independent cues, larger text/UI, and keyboard/focus behavior around DOM overlays.
3. Add dedicated Level Editor controls for hazard-specific parameters as the editor matures.
4. Expand progression/reward systems only after the Milestone 5 UX foundation remains green.
5. Address bundle-size/lazy-loading only during the dedicated performance milestone.
