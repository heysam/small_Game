# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **20-level starter milestone CI verified; Level Editor/Debug Panel connected; five hazard behaviors verified; Chromium browser smoke green; first real world-grouped Level Select and local progress primitives added**

Completed:
- Isolated `draw-save-game/` web project; existing Django game remains untouched.
- TypeScript + Vite + Phaser 3 + Matter Physics responsive prototype with mouse/touch drawing, finite ink, static drawn collision bodies, victory/failure logic and retry.
- Data-driven validated level schema with 20 original starter levels across city, forest, cave, laboratory and harbor worlds.
- `survive` and `reach` objectives; static/rotated platforms and visible reach targets.
- Five differentiated hazards: bouncing orb, active chaser, periodic falling hazard, static spike, and deterministic oscillating mover.
- Level Editor/Debug Panel supports safe scalar edits, validation, JSON import/export/reset and in-memory Phaser preview without overwriting checked-in levels.
- Deterministic editor metadata (difficulty/tags/hints) is guaranteed for all 20 runtime levels.
- Playwright Chromium smoke boots the real Vite/Phaser app, draws with the mouse, changes editor preview, imports a deterministic spike scenario and verifies a hero/hazard failure path without uncaught page errors.
- Scene restart teardown safely removes the Matter collision listener from the captured world instance.
- New real Level Select UI groups the 20 starter levels by world, renders lock state and best-star state, and is responsive for desktop/mobile layouts.
- New versioned local progress model (`draw-save-game.progress.v1`) stores unlocked level and per-level results, safely normalizes malformed persisted data, retains best stars/best ink, and unlocks the next level after a completed result.
- Progress persistence helpers are isolated behind Storage-compatible get/set interfaces so they remain unit-testable and can later be swapped for guest/cloud sync.
- One path-scoped GitHub Actions workflow runs unit tests, typecheck, production build and Playwright Chromium smoke; documentation-only status commits do not trigger CI.

Validation this round:
- Starting branch SHA was `7ebaf02f84761b89fdbb0d2ee14555b597194c66`; branch was re-read immediately before commit and was unchanged.
- Feature commit: `6fc9e96e197bdd1d070573c3908f741189bed02e` (`feat(game): add level map and local progress primitives`).
- GitHub Actions run `34757155149` completed successfully for that exact commit.
- Verified CI steps: `npm install --no-audit --no-fund`, `npm test`, `npm run typecheck`, `npm run build`, Playwright Chromium installation, and `npm run test:browser` all succeeded.
- New progress unit tests verify default locked progression, sequential unlock, best-result preservation, and malformed persisted-state normalization.
- Existing browser smoke remained green after mounting the Level Select UI.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

Known limitation / not marked complete:
- The Level Select reads persisted progress and displays lock/star state, but the Phaser `finishRound()` path does not yet persist a completed result. That runtime wiring is the next highest-priority task; this round only marks the persistence primitives and map UI complete.
- Level Select currently enters a checked-in level through the existing preview/restart callback path; the next wiring pass should distinguish normal play from editor custom-preview semantics while recording results.
- Known non-blocking Phaser bundle-size warning remains deferred to the dedicated performance/lazy-loading milestone.

Next:
1. Wire normal Level Select launch semantics directly into the Phaser scene (no editor-preview label/semantics for normal play).
2. On successful `finishRound()`, calculate an initial star result, save local progress, unlock the next level and refresh Level Select state; preserve retry/failure behavior without granting progress.
3. Extend Playwright smoke to prove completing a deterministic level persists/unlocks progression across reload.
4. Add the next objective type beyond `survive`/`reach`, prioritizing catch/fall-blocking or escort.
5. Add a laser/timed environmental hazard.
6. Address bundle-size/lazy-loading only during the dedicated performance milestone.
