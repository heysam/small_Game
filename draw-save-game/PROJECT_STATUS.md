# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 5 closed green; Milestone 6 formal reward persistence is gameplay-wired and browser reward verification is awaiting exact CI.**

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
- One path-scoped GitHub Actions workflow covers unit tests, typecheck, production build and Playwright Chromium browser smoke.
- Versioned reward ledger (`draw-save-game.rewards.v1`) is CI-green: first clear +20 coins, each newly earned star +5 coins, replay/idempotency and malformed persistence covered. Exact test commit `875fcf49e7d3463251a7c323006656e183e730af` passed run `35189653101`.
- Formal reward adapter `game/rewardFlow.ts` is CI-green. Exact test commit `930cc5cd78ba8ddd24f2326a8dc2e6b6b3469fe2` passed run `35221000762` (`completed/success`). Editor previews return no reward and do not mutate reward storage.
- Reward result UI commit `e1794165a9397628ad39b9e5a2be22d7bd76a57e` passed run `35258778366`.
- Formal-completion type fix commit `2483f957dda3c2bfbdcb0bef697de6e250aa1e9b` passed run `35314331621`.
- Gameplay integration commit `18e840a1fb54356f9263f10a2d9c4b80e8710557` passed run `35344167189` (`completed/success`): `RescueScene.finishRound` now persists formal progress and rewards through the unified completion boundary and sends reward totals to the result UI.

### Implemented this batch — awaiting exact CI completion
- Extended the existing Playwright browser smoke instead of creating another workflow.
- The formal first-clear browser path now asserts a visible positive coin award and persisted `draw-save-game.rewards.v1` ledger.
- The same test retries the completed level, verifies the result shows `+0 金幣`, and confirms the persisted coin balance is unchanged.
- The test reloads the application and verifies the same coin balance survives reload while normal level unlock persistence remains intact.
- Browser reward verification commit: `6b4699dd4c2c196ead430b97f81689e2b12db195`.

### Validation — 2026-09-19
- Branch was re-read at start at `a6dbb860cdb37f21a6703e6974df21278bac1517`; its parent gameplay commit was `18e840a1fb54356f9263f10a2d9c4b80e8710557`.
- Exact gameplay integration run `35344167189` was confirmed `completed/success` before adding browser coverage.
- Existing browser smoke was inspected and extended in place; no extra CI workflow was created.
- Legacy Django/game content was not changed.
- Exact CI for browser reward verification is pending; do not mark this batch green until its run completes successfully.
- No reset, force push, deletion or stale-tree overwrite was used.

### Known limitations / not complete
- Daily missions and achievements are not implemented yet.
- Progress/rewards remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Re-read exact CI for browser reward verification commit `6b4699dd4c2c196ead430b97f81689e2b12db195`; fix any failure before expanding.
2. If green, close the formal first-clear/replay browser verification slice and begin the smallest versioned daily-mission/achievement reward model without adding workflows.
3. Keep editor previews excluded from all formal rewards.
4. Continue later milestones without unnecessary workflows.
