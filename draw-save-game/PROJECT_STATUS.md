# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 5 closed green; Milestone 6 formal reward persistence is now wired into gameplay, awaiting exact integration CI.**

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
- Formal-completion type fix commit `2483f957dda3c2bfbdcb0bef697de6e250aa1e9b` passed GitHub Actions run `35314331621` (`completed/success`).

### Implemented this batch — awaiting exact CI completion
- Replaced the older direct progress write in `RescueScene.finishRound` with the tested `persistFormalCompletion` boundary.
- Formal wins now persist progress and the idempotent reward ledger through one path, then pass `coinsEarned` and `totalCoins` to the prepared result dialog.
- Level Editor preview wins call the same boundary with `isPreview=true`, which exits before progress/reward storage and therefore remain reward-free.
- Level Select refresh now occurs only when the completion boundary reports a real persisted formal result.
- Gameplay integration commit: `18e840a1fb54356f9263f10a2d9c4b80e8710557`.

### Validation — 2026-09-18
- Branch was re-read at the start and was exactly `2483f957dda3c2bfbdcb0bef697de6e250aa1e9b`; no intervening project commit existed.
- The prior type-fix exact run `35314331621` was confirmed `completed/success` before scene expansion.
- Existing formal-completion unit coverage already proves first 3-star clear awards 35 coins, replay awards zero additional coins, and editor preview mutates neither store.
- Branch was re-read after the gameplay write and confirmed at exact commit `18e840a1fb54356f9263f10a2d9c4b80e8710557` before this status update.
- Legacy Django/game content was not changed.
- Exact CI for gameplay wiring is pending; do not mark this batch green until its run completes successfully.
- No reset, force push, deletion or stale-tree overwrite was used.

### Known limitations / not complete
- Browser-level first-clear/replay reward display coverage is still pending after the scene integration is green.
- Daily missions and achievements are not implemented yet.
- Progress/rewards remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Re-read exact CI for gameplay integration commit `18e840a1fb54356f9263f10a2d9c4b80e8710557`; fix any failure before expanding.
2. If green, add focused Playwright coverage for first-clear reward display and replay non-duplication without creating another workflow.
3. Add daily missions and achievements only after formal coin integration is browser-verified green.
4. Continue later milestones without adding unnecessary workflows.
