# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 5 closed green; Milestone 6 coin/reward ledger implemented and awaiting exact CI.**

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
- Player onboarding, hints, feedback preferences and accessibility display preferences.
- Result dialog keyboard behavior and broader DOM keyboard audit are CI-green.
- Objective-aware non-pointer assist planner is wired to a focusable gameplay action and reuses the same finite-ink/Matter/round path as pointer drawing.
- Exact assist integration test commit `79782bb9f1f56afab5444c43cca77cfb61ac5a73` is verified by GitHub Actions run `35166313183` (`completed/success`).
- One path-scoped GitHub Actions workflow covers unit tests, typecheck, production build and Playwright Chromium browser smoke.

### Implemented this batch — awaiting exact CI completion
- Started Milestone 6 with a separate versioned local reward ledger (`draw-save-game.rewards.v1`) so currency accounting is not coupled to level-unlock progress.
- First formal clear awards 20 coins; each newly earned star awards 5 coins.
- Replay rewards are idempotent: equal/worse replays pay zero, while improving a previous star result only pays the newly earned star difference.
- Persisted reward data is normalized defensively and negative/malformed coin balances cannot be loaded as valid currency.
- Added unit tests for first-clear reward, duplicate replay prevention, incremental star improvement and malformed persisted data.
- Reward ledger commits: `62e897d1e25709f918ffbb031eefdbe962367b2e`, `875fcf49e7d3463251a7c323006656e183e730af`.

### Validation — 2026-09-17
- Branch was re-read at the start and was exactly `2e7b014ba5e771c23d43ef7a01e79f755f8d2b9e`; no intervening commit existed.
- Assist integration exact CI run `35166313183` was confirmed `completed/success` before Milestone 6 expansion.
- Branch was re-read after reward code/tests and confirmed at exact test commit `875fcf49e7d3463251a7c323006656e183e730af` before this status update.
- Exact CI for the new reward ledger had not completed when this status was written; do not mark this batch CI-green until its run concludes successfully.
- No reset, force push or stale-tree overwrite was used. No existing Django/legacy game files were changed.

### Known limitations / not complete
- Reward ledger is not yet wired into formal victory/result UI; no coins are granted by gameplay until that integration is implemented after ledger CI is green.
- Daily missions and achievements are not implemented yet.
- Progress/rewards remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Re-read exact CI for `875fcf49e7d3463251a7c323006656e183e730af`; fix any failure before expanding.
2. If green, integrate the reward ledger only into formal victory (never editor preview), persist it, and show total/new coins in the result UI with browser coverage.
3. Add daily missions and achievements after formal coin integration is green.
4. Add dedicated Level Editor controls for hazard-specific parameters as the editor matures.
5. Address bundle size/lazy loading during the dedicated performance milestone.
