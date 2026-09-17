# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 5 assist gameplay integration implemented; awaiting exact CI before closure.**

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
- Result dialog keyboard behavior is verified by exact CI run `35039748221`.
- Broader DOM keyboard audit is verified by exact CI run `35063380296`.
- Objective-aware assist planner unit-test commit `e2701840c2e70636aea70e80a291f6f8c74c1e49` is verified by exact CI run `35133679834` (`completed/success`).
- One path-scoped GitHub Actions workflow covers unit tests, typecheck, production build and Playwright Chromium browser smoke.

### Implemented this batch — awaiting exact CI completion
- Added `assistControl.ts` and a focusable `輔助畫線` DOM action for players who cannot reliably perform freehand pointer drawing.
- The control uses the objective-aware planner for `survive`, `reach` and `catch`, then emits the planned stroke through the existing Phaser canvas pointer input path. This deliberately reuses the same `appendDrawPoint` finite-ink accounting, Matter line bodies, round start and victory/failure rules instead of creating a parallel cheat path.
- Active level selection is tracked from the existing `data-level-index` controls so the assist stroke follows the selected formal level.
- Added Playwright keyboard coverage that focuses and activates the assist action with Enter and verifies the objective-specific accessible label without using a pointer.
- Integration commits: `ee162266403b45b70ea106aef2ecac2b819ad45b`, `c53d59303b307c5449dcfbdf6c50c974f1228a89`, `79782bb9f1f56afab5444c43cca77cfb61ac5a73`.

### Validation — 2026-09-17
- Branch was re-read at the start and was exactly `5bf9119f14112fd41fa8dd974dc66c9050b296bd`; no intervening commit existed.
- Exact planner CI run `35133679834` was re-read and confirmed `completed/success` before expansion.
- The first integration CI runs were in progress when this status was written; do not mark the integration CI-green until the exact test commit run concludes successfully.
- No reset, force push or stale-tree overwrite was used. No existing Django/legacy game files were changed.

### Known limitations / not complete
- Progress remains local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Tutorial/hints remain a lightweight DOM help surface rather than an interactive Phaser-canvas walkthrough.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Re-read exact CI for assist integration/test commits and fix any failure before expanding.
2. If green, close Milestone 5 and start Milestone 6 with a versioned coin/reward ledger: first-clear, star bonus and idempotent replay behavior, with unit tests before UI expansion.
3. Add daily missions/achievements after the base reward ledger is green.
4. Add dedicated Level Editor controls for hazard-specific parameters as the editor matures.
5. Address bundle size/lazy loading during the dedicated performance milestone.
