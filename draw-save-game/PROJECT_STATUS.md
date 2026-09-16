# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 5 accessibility foundation is green; non-pointer assist stroke planner implemented and awaiting exact CI.**

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
- Result dialog keyboard behavior (initial focus, Tab/Shift+Tab trap, Escape close and focus restoration) is verified by exact CI run `35039748221`.
- Broader DOM keyboard audit is verified by exact CI run `35063380296` for commit `73c2397896cd39d966c577aa1e0523f59cd1f082`: tutorial disclosure, unlocked-level activation, hint opening, accessibility checkboxes and persistence are green.
- One path-scoped GitHub Actions workflow covers unit tests, typecheck, production build and Playwright Chromium browser smoke.

### Implemented this batch — awaiting exact CI completion
- Added `game/assist.ts`, a deterministic objective-aware non-pointer assist-stroke planner rather than an artificial arrow-key freehand drawing mode.
- `survive` generates a shield toward the nearest hazard; `reach` generates a bridge-like starter stroke toward the target; `catch` generates a cradle centered on the rescue target.
- Generated points are clamped to the playable drawing band and expose their real geometric length so the eventual gameplay integration can charge the same finite ink budget instead of creating a free/cheat path.
- Added unit coverage for all three objective families, hazard-side selection, stroke length and playable bounds.

### Validation — 2026-09-17
- Branch was re-read before this batch and was exactly `1e12cba11d036a97edde42830a72956d734e6a7f`; no intervening commit existed.
- Previous broader keyboard-audit run `35063380296` was re-read and confirmed `completed/success` before writing new gameplay code.
- Assist planner commit: `b7a785c4bf8c7006b78f8f4906b39c1cd342d720`.
- Assist planner test commit: `e2701840c2e70636aea70e80a291f6f8c74c1e49`.
- Branch was re-read after both writes and confirmed at exact test commit `e2701840c2e70636aea70e80a291f6f8c74c1e49` before this status update.
- Exact CI for the assist planner had not yet completed when this status was written; do not mark the batch CI-green until its run concludes successfully.
- No reset, force push or stale-tree overwrite was used. No existing Django/legacy game files were changed.

### Known limitations / not complete
- Assist stroke planner is not yet wired into the Phaser gameplay UI; freehand drawing remains pointer/touch-first until that integration is completed.
- Progress remains local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Tutorial/hints remain a lightweight DOM help surface rather than an interactive Phaser-canvas walkthrough.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Re-read exact CI for `e2701840c2e70636aea70e80a291f6f8c74c1e49`; fix failures before expanding.
2. Wire the assist planner into a focusable DOM/gameplay action and feed generated points through the same finite-ink and Matter line-body path as pointer strokes; add keyboard Playwright coverage.
3. Close Milestone 5 only after that integration is green, then start Milestone 6 coins/rewards.
4. Add dedicated Level Editor controls for hazard-specific parameters as the editor matures.
5. Address bundle size/lazy loading during the dedicated performance milestone.
