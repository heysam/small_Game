# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **20-level starter milestone CI verified; Level Editor/Debug Panel connected; six hazard behaviors verified; Level Select has persisted completion/star/unlock flow; three objective types are playable; formal result flow is browser-verified**

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
- Formal victory/failure now opens a responsive DOM result dialog instead of relying only on Phaser status text.
- Formal victory result shows level name, earned stars, remaining ink, `重新挑戰`, conditional `下一關`, and `關卡地圖`; `下一關` is omitted on failure, editor preview, and the final level.
- Result `重新挑戰` restarts the exact current formal level or preserves the current editor custom preview; `下一關` restarts the following checked-in formal level.
- Editor preview results are explicitly labeled `EDITOR PREVIEW`, state that no formal progress is written, and expose retry/back-to-editor behavior without contaminating saved progress.
- Scene creation always hides any stale result dialog before a restart or level switch.
- Result dialog uses dialog semantics (`role=dialog`, `aria-modal`, labelled heading), safe-area-aware layout, and mobile-responsive controls as a base for later accessibility work.
- Storage helpers remain behind Storage-compatible interfaces for future guest/cloud sync.
- Playwright Chromium covers real app drawing/editor preview, deterministic preview failure/result dismissal, and a real first-level victory that shows stars/Retry/Next, unlocks level 2, uses Next, and still preserves unlock/star progress after page reload.
- Scene restart teardown safely removes the Matter collision listener from the captured world instance.
- One path-scoped GitHub Actions workflow runs unit tests, typecheck, production build and Playwright Chromium smoke; documentation-only status commits do not trigger CI.

Validation this round:
- Starting branch SHA was `516438922b4976f43de1ffff1dc43ab3f3a145b3`; branch state was re-read before Git object writes/ref updates and before the final status update. No unrelated external commit was overwritten.
- Result-panel module commit: `124cac6bef651bf17d7d2308db79202e954fe9e1` (`feat(game): add reusable result panel`).
- Main integration commit: `e7b0b627a6517231da5a4def6a06d4e012a9661f` (`feat(game): connect formal result flow`).
- The first integration CI correctly caught an invalid browser-test assumption: an initially overlapping Matter spike did not deterministically produce the intended failure. The production result path itself and the formal-success browser case passed; the test was not marked complete.
- Test fixture commit `30f68b7ee330866e3bcf7fd765a4501c0d7385ff` changed the failure scenario to deterministic reach-timeout semantics. CI then correctly rejected that fixture because it violated the existing schema requirement for at least one hazard; the schema was preserved rather than weakened.
- Final test fixture commit: `03281ad1f3e743109dcff9dad1c24f0ad93128cc` (`test(game): keep result failure fixture schema-valid`), adding a harmless valid spike while keeping deterministic timeout failure.
- GitHub Actions run `34844131844` completed successfully for exact commit `03281ad1f3e743109dcff9dad1c24f0ad93128cc`.
- Final CI evidence: 7 Vitest files / 29 unit tests passed; `npm run typecheck` passed; production `npm run build` passed; Playwright Chromium installed successfully; 3/3 browser smoke tests passed.
- Browser smoke explicitly verified the result dialog on editor-preview failure and formal first-level victory, formal Retry/Next controls, next-level unlock, Next navigation, and persisted star/unlock state after reload.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

Known limitation / not marked complete:
- Progress is still local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Result UI now has baseline dialog semantics and responsive layout, but full keyboard focus management, reduced-motion/high-contrast options and larger-text accessibility controls are not implemented yet.
- Hint metadata exists, but player-facing hint/tutorial behavior is not implemented yet.
- Sound and vibration settings are not implemented yet.
- Timed laser currently uses a rectangular beam primitive and deterministic phase state; Level Editor does not yet expose dedicated laser timing/length controls beyond JSON editing.
- Catch currently uses the same rectangular target-zone primitive as reach, with different runtime semantics and presentation; future objective tooling can add dedicated spawn/landing markers without breaking the current schema.
- Star scoring currently uses remaining ink only; future objective/time/optional-goal scoring can extend this without changing the persisted best-result contract.
- Known non-blocking Phaser bundle-size warning remains: current main JS is about 1,243.26 kB minified / 343.45 kB gzip. Code splitting/lazy loading stays deferred to the dedicated performance milestone.

Next:
1. Continue Milestone 5 UX with player-facing hint/tutorial behavior using existing level hint metadata.
2. Add sound/vibration settings with safe defaults and persistence.
3. Add accessibility options: reduced motion, high contrast/color-independent cues, larger text/UI, and keyboard/focus behavior around DOM overlays.
4. Add dedicated Level Editor controls for hazard-specific parameters as the editor matures.
5. Expand progression/reward systems only after the Milestone 5 UX foundation remains green.
6. Address bundle-size/lazy-loading only during the dedicated performance milestone.
