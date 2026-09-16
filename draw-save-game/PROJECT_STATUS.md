# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 5 keyboard-safe result dialog implemented; exact browser-smoke CI is running.**

### Completed and verified
- Isolated `draw-save-game/` TypeScript + Vite + Phaser 3 + Matter project; existing Django/legacy game remains untouched.
- Responsive mouse/touch freehand drawing with finite ink, Matter collision bodies, victory/failure and retry.
- 20 original validated starter levels across city, forest, cave, laboratory and harbor worlds.
- Three playable objective families: `survive`, `reach`, `catch`.
- Six differentiated hazards: bouncing orb, chaser, periodic falling hazard, spike, deterministic mover and timed laser (`warning -> active -> cooldown`).
- Level Editor/Debug Panel with validation, JSON import/export/reset and in-memory preview that does not write formal progress.
- Level Select grouped by world with lock state and best stars.
- Versioned local progress (`draw-save-game.progress.v1`) stores completion, best stars, best remaining ink and next-level unlocks.
- Formal responsive result dialog with stars/ink, Retry, conditional Next and return-to-map; editor previews are explicitly isolated from formal progress.
- Player onboarding and per-level hints with versioned tutorial dismissal (`draw-save-game.tutorial.v1`).
- Persisted feedback preferences (`draw-save-game.feedback.v1`) with independent sound/vibration controls and safe fallback; feedback CI run `34913014548` is green.
- Persisted accessibility display preferences (`draw-save-game.accessibility.v1`) for reduced motion, high contrast/color-independent reinforcement and larger text/UI; exact feature CI run `34968796220` completed successfully.
- One path-scoped GitHub Actions workflow covers unit tests, typecheck, production build and Playwright Chromium browser smoke.

### Implemented this batch — awaiting exact CI completion
- Result dialog now moves initial keyboard focus to Retry when opened.
- Tab and Shift+Tab are trapped within the modal action controls so keyboard focus cannot escape behind the overlay.
- Escape closes the result dialog without invoking Retry/Next and restores focus to the element that was active before the dialog appeared when it remains connected.
- Result dialog has a programmatic fallback focus target for the no-action edge case while retaining `role=dialog`, `aria-modal` and labelled title semantics.
- Playwright editor-preview failure smoke now verifies initial focus, forward/backward wrap, Escape close and focus restoration in addition to the existing deterministic failure path.

### Validation — 2026-09-16
- Branch was re-read before this batch and was exactly `ef8035fe35d548886d7086baa2b1cf7403877964`; no intervening commit existed.
- Accessibility display feature CI run `34968796220` was re-read and confirmed `success` before expanding the milestone.
- Keyboard implementation commit: `b0a15798a0907bfb8c39ec76d374896d8ae75a86`.
- Browser-smoke coverage commit: `d6c618a393fb391e89cde3cb02a43404cc088ba7`.
- Exact CI run `35039748221` is running for `d6c618a393fb391e89cde3cb02a43404cc088ba7`; it had entered the `verify` job when this status was written. Do not mark this keyboard batch CI-green until its final conclusion is success.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

### Known limitations / not complete
- Broader keyboard audit for Level Select, settings/tutorial disclosure controls and game-canvas alternatives remains incomplete.
- Progress remains local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Tutorial/hints remain a lightweight DOM help surface rather than an interactive Phaser-canvas walkthrough.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Re-read exact CI run `35039748221`; if failed, fix it before expanding. If green, mark result-dialog keyboard behavior verified.
2. Finish the Milestone 5 keyboard audit for Level Select and settings/tutorial controls, adding browser smoke only where it proves user-visible keyboard behavior.
3. Start Milestone 6 coins/rewards only after the accessibility/keyboard foundation is green.
4. Add dedicated Level Editor controls for hazard-specific parameters as the editor matures.
5. Address bundle size/lazy loading during the dedicated performance milestone.
