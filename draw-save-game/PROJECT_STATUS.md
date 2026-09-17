# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 5 closed green; Milestone 6 reward ledger green and formal-completion adapter awaiting exact CI.**

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

### Implemented this batch — awaiting exact CI completion
- Added `game/rewardFlow.ts` as the formal-completion boundary between gameplay and the reward ledger.
- Formal completions load, award and persist through one adapter; Level Editor previews explicitly return no reward and do not write reward storage.
- Added tests proving formal first-clear persistence, preview isolation and same-star replay idempotency.
- Adapter commit: `307aeeacefed6e7e3cf6defdf87865e7125f4526`.
- Test commit: `930cc5cd78ba8ddd24f2326a8dc2e6b6b3469fe2`.

### Validation — 2026-09-17
- Branch was re-read at the start and was exactly `8427143dab10d1ede9b21a998cea50d38c94af1c`; no intervening project commit existed.
- Previous reward ledger exact CI run `35189653101` was confirmed `completed/success` before expansion.
- Formal reward adapter and tests were committed as a small isolated batch without touching Django/legacy game files.
- Exact CI run `35221000762` for test commit `930cc5cd78ba8ddd24f2326a8dc2e6b6b3469fe2` was still in progress when this status was written; do not mark this adapter CI-green until it completes successfully.
- No reset, force push, deletion or stale-tree overwrite was used.

### Known limitations / not complete
- Formal reward adapter is not yet invoked by `RescueScene.finishRound`; therefore gameplay does not mint/display coins yet. Wire it only after exact adapter CI is green.
- Result UI does not yet show newly earned or total coins.
- Daily missions and achievements are not implemented yet.
- Progress/rewards remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Re-read exact CI run `35221000762`; fix any failure before expanding.
2. If green, invoke `applyCompletionReward` from formal `finishRound` only and pass new/total coins to the result dialog; editor preview must remain reward-free.
3. Add Playwright coverage for first-clear reward display and replay non-duplication.
4. Add daily missions and achievements after formal coin integration is green.
5. Continue later milestones without adding unnecessary workflows.
