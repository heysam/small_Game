# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 5 closed green; Milestone 6 formal reward persistence is being consolidated before scene wiring.**

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
- Reward result UI commit `e1794165a9397628ad39b9e5a2be22d7bd76a57e` is verified by run `35258778366` (`completed/success`): formal results can display earned/total coins, while editor previews never show reward data.

### Implemented this batch — awaiting exact CI completion
- Added `game/formalCompletion.ts` as the single formal-completion persistence boundary. It calculates stars, records/unlocks formal progress, applies the existing idempotent reward ledger, and returns `stars`, `coinsEarned`, and `totalCoins` for the result UI.
- Editor previews exit before either progress or reward storage is touched.
- Added unit coverage proving first formal clear persists both stores and awards 35 coins for a 3-star first clear, replay awards zero additional coins, and editor preview mutates neither store.
- Formal completion implementation commit: `5fd3d18046c2f2159f9f84e46c4cde5df3285515`.
- Formal completion test commit: `3fd59522ca6e4a4d8caa297692d0c1915b4f5746`.

### Validation — 2026-09-18
- Branch was re-read at the start and was exactly `23c43ab6b25e756c47aabab93dd2ff5353c35ad6`; no intervening project commit existed.
- Previously pending reward-result UI run `35258778366` was re-read and confirmed `completed/success` before expansion.
- Branch was re-read after both writes and confirmed at exact test commit `3fd59522ca6e4a4d8caa297692d0c1915b4f5746` before this status update.
- `main.ts` and legacy Django/game content were not changed in this batch.
- Exact CI for the new formal-completion boundary is pending; do not mark this batch green until its run completes successfully.
- No reset, force push, deletion or stale-tree overwrite was used.

### Known limitations / not complete
- `RescueScene.finishRound` still uses its older direct progress write and has not yet switched to `persistFormalCompletion`; therefore gameplay does not mint/display coins yet.
- Daily missions and achievements are not implemented yet.
- Progress/rewards remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Re-read exact CI for `3fd59522ca6e4a4d8caa297692d0c1915b4f5746`; fix any failure before expanding.
2. If green, replace the older formal progress block in `RescueScene.finishRound` with `persistFormalCompletion`, refresh level select after persistence, and pass returned `coinsEarned` / `totalCoins` into the prepared result panel; editor preview must remain reward-free.
3. Add Playwright coverage for first-clear reward display and replay non-duplication.
4. Add daily missions and achievements only after formal coin integration is green.
5. Continue later milestones without adding unnecessary workflows.
