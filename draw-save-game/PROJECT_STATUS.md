# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 5 closed green; Milestone 6 reward ledger/formal adapter green, reward result UI prepared for gameplay wiring.**

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
- Versioned reward ledger (`draw-save-game.rewards.v1`) is CI-green: first clear +20 coins, each newly earned star +5 coins, replay/idempotency and malformed persistence covered. Exact test commit `875fcf49e7d3463251a7c323006656e183e730af` passed run `35189653101`.
- Formal reward adapter `game/rewardFlow.ts` is CI-green. Exact test commit `930cc5cd78ba8ddd24f2326a8dc2e6b6b3469fe2` passed run `35221000762` (`completed/success`). Editor previews return no reward and do not mutate reward storage.

### Implemented this batch — awaiting exact CI completion
- Extended `ResultPanelState` with optional `coinsEarned` and `totalCoins` fields so the formal completion flow can display its already-computed reward without the UI reading/mutating storage itself.
- Formal successful results render `+N 金幣` and the current total when reward data is supplied; replay rewards can correctly render `+0` while preserving the total.
- Editor Preview never renders the coin summary and its copy now explicitly states that neither formal progress nor rewards are written.
- Reward result UI commit: `e1794165a9397628ad39b9e5a2be22d7bd76a57e`.

### Validation — 2026-09-18
- Branch was re-read at the start and was exactly `0b90b86ab954f277e3cb77809cf1ef6b33c69bee`; no intervening project commit existed.
- Previously pending exact adapter run `35221000762` was re-read and confirmed `completed/success` before expansion.
- `main.ts`, formal progress logic and legacy Django/game content were not changed in this batch.
- The reward result UI commit was written as a small isolated batch. Exact CI had not yet appeared in the workflow-runs listing when this status was written; do not mark this UI batch green until its exact run completes successfully.
- No reset, force push, deletion or stale-tree overwrite was used.

### Known limitations / not complete
- `RescueScene.finishRound` still does not invoke `applyCompletionReward`; therefore gameplay does not mint/display coins yet. The result panel is now ready to receive that data once the scene wiring is made.
- Daily missions and achievements are not implemented yet.
- Progress/rewards remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Re-read exact CI for `e1794165a9397628ad39b9e5a2be22d7bd76a57e`; fix any failure before expanding.
2. If green, invoke `applyCompletionReward` from formal `RescueScene.finishRound` only and pass `reward.coins` / `ledger.coins` into the prepared result panel fields; editor preview must remain reward-free.
3. Add Playwright coverage for first-clear reward display and replay non-duplication.
4. Add daily missions and achievements after formal coin integration is green.
5. Continue later milestones without adding unnecessary workflows.
