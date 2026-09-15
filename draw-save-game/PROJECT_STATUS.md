# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 5 UX foundation is CI-green through persisted sound/vibration feedback.**

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
- Persisted feedback preferences (`draw-save-game.feedback.v1`) with independent sound/vibration controls, safe defaults and corrupt/restricted-storage fallback.
- Formal success/failure results emit distinct Web Audio cues when enabled and safe vibration patterns when supported/enabled; unsupported vibration degrades without breaking gameplay.
- One path-scoped GitHub Actions workflow covers unit tests, typecheck, production build and Playwright Chromium browser smoke; no extra workflow was added for feedback.

### Validation — 2026-09-15
- Branch was re-read before this status update and remained exactly feature commit `accc21a7c3a179221375332c7d2b7928947565fc` (`feat(game): add persisted sound and vibration feedback`).
- GitHub Actions run `34913014548` completed **successfully** for that feature commit.
- CI job `verify` passed dependency install, `npm test`, `npm run typecheck`, `npm run build`, Playwright Chromium installation and `npm run test:browser`.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this feature batch.

### Known limitations / not complete
- Progress remains local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Full accessibility controls are not implemented yet: reduced motion, high contrast/color-independent cues, larger text/UI and robust keyboard/focus handling remain next.
- Tutorial/hints remain a lightweight DOM help surface rather than an interactive Phaser-canvas walkthrough.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Add persisted accessibility settings: reduced motion, high contrast/color-independent cues and larger text/UI.
2. Add keyboard/focus behavior for Level Select, settings/tutorial and result overlays, then extend Playwright accessibility smoke coverage.
3. Add dedicated Level Editor controls for hazard-specific parameters as the editor matures.
4. Expand progression/reward systems only after the Milestone 5 UX foundation remains green.
5. Address bundle size/lazy loading during the dedicated performance milestone.
