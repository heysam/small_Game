# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 5 keyboard/accessibility audit expanded; exact CI for the new browser audit is pending.**

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
- Result dialog keyboard behavior (initial focus, Tab/Shift+Tab trap, Escape close and focus restoration) is verified by exact CI run `35039748221`, which completed successfully for commit `d6c618a393fb391e89cde3cb02a43404cc088ba7`.
- One path-scoped GitHub Actions workflow covers unit tests, typecheck, production build and Playwright Chromium browser smoke.

### Implemented this batch — awaiting exact CI completion
- Added a dedicated Playwright keyboard-accessibility browser audit without adding another workflow.
- The audit verifies native keyboard operation of the tutorial disclosure, keyboard activation of an unlocked level, automatic opening of the selected level hint, and keyboard-only operation of all three accessibility preference checkboxes.
- The audit verifies reduced-motion, high-contrast and large-text settings immediately update the document state and persist after reload.
- Existing semantic controls remain native `button`, `details/summary` and checkbox elements, avoiding custom keyboard emulation where browser semantics already provide correct behavior.

### Validation — 2026-09-16
- Branch was re-read before this batch and was exactly `2fe24e1f19ad47107c1576b3e8a93701b2dd33d1`; no intervening commit existed.
- Previous result-dialog keyboard CI run `35039748221` was re-read and confirmed `success` before expanding the audit.
- New keyboard-audit commit: `73c2397896cd39d966c577aa1e0523f59cd1f082`.
- The branch was re-read after the write and confirmed to point at that exact commit before this status update.
- Exact CI for the new audit had not yet surfaced a final result when this status was written; do not mark this batch CI-green until the run for `73c2397896cd39d966c577aa1e0523f59cd1f082` concludes successfully.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

### Known limitations / not complete
- Game-canvas keyboard/pointer-alternative design remains incomplete; drawing itself is still pointer/touch-first.
- Progress remains local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Tutorial/hints remain a lightweight DOM help surface rather than an interactive Phaser-canvas walkthrough.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Re-read the exact CI for `73c2397896cd39d966c577aa1e0523f59cd1f082`; if failed, fix it before expanding. If green, mark the broader DOM keyboard audit verified.
2. Close Milestone 5 after deciding and documenting the minimum viable non-pointer alternative for the freehand game canvas; do not invent a keyboard drawing scheme that harms gameplay.
3. Start Milestone 6 coins/rewards only after the accessibility/keyboard foundation is green.
4. Add dedicated Level Editor controls for hazard-specific parameters as the editor matures.
5. Address bundle size/lazy loading during the dedicated performance milestone.
