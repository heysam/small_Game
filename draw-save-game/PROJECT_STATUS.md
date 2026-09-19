# Draw to Rescue — Project Status

## Current milestone

Status: **Milestone 5 closed green; Milestone 6 meta rewards are integrated and now itemized in the formal result dialog. Exact CI for the presentation batch is pending.**

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
- Objective-aware non-pointer assist planner is wired to a focusable gameplay action and reuses the same finite-ink/Matter/round path as pointer drawing.
- One path-scoped GitHub Actions workflow covers unit tests, typecheck, production build and Playwright Chromium browser smoke.
- Versioned reward ledger (`draw-save-game.rewards.v1`) is CI-green: first clear +20 coins, each newly earned star +5 coins, replay/idempotency and malformed persistence covered.
- Formal reward adapter, result UI and unified formal-completion gameplay integration are CI-green; editor previews do not mutate formal reward storage.
- Browser reward verification commit `6b4699dd4c2c196ead430b97f81689e2b12db195` passed exact run `35379850195` (`completed/success`).
- Meta-reward daily-reset fix commit `ae84b907393e7617eeb657fb8de1fb0421b89378` passed exact run `35426488514` (`completed/success`).

### Implemented and verified before this batch
- Integrated `game/metaRewards.ts` into `persistFormalCompletion`; no parallel gameplay/reward path was added.
- Formal wins now evaluate daily clear (+15), daily three-star (+20), first rescue (+25), and 10 accumulated best-stars (+40) after formal progress is recorded.
- Mission/achievement grants are credited into the same `draw-save-game.rewards.v1` coin balance as level rewards.
- Formal completion returns meta coins plus newly claimed daily/achievement IDs for later result-UI presentation.
- Daily keys default to the player's local calendar day; a deterministic `rewardDay` override exists for tests/replay.
- Editor Preview exits before progress, level rewards, meta rewards, or coin balance can mutate.
- Added integration coverage for first formal three-star clear, same-day replay idempotency, next-day daily reset without permanent-achievement replay, and complete Preview isolation.
- Integration commit `fcada5b9506c1cfdaa51a52ffd342345be675e0c` used `[skip ci]`; test commit `462a2c13943e4be52d7f8e518b90757d495097da` passed exact run `35442520313` (`completed/success`).

### Implemented this batch — 2026-09-20
- Confirmed exact CI run `35442520313` for `462a2c13943e4be52d7f8e518b90757d495097da` completed successfully before expanding.
- Result dialog now itemizes newly claimed daily missions and achievements returned by the existing formal completion boundary; no second reward path was introduced.
- Gameplay passes `newlyClaimedDaily` and `newlyClaimedAchievements` into the existing result panel.
- Browser smoke now verifies first-clear meta reward presentation and verifies replay does not render a duplicate meta-reward list.
- Presentation commits `c05633c72a954f6060a45a7545217d52c44dc262` and `4eabb643e78a654dc169f98c7f2f6784956bf7c2` used `[skip ci]`; `599abe00c75a7d93fa0b10ef8c8543a9cbce6020` is the single CI-triggering commit.
- Exact run `35459191506` is currently queued and must not be marked green until it completes successfully.

### Validation — 2026-09-20
- Branch started at `ae84b907393e7617eeb657fb8de1fb0421b89378`.
- Exact run `35426488514` for that commit was confirmed `completed/success` before expanding Milestone 6.
- Previous integration CI is green at exact run `35442520313`. Current presentation CI is queued at exact run `35459191506` for `599abe00c75a7d93fa0b10ef8c8543a9cbce6020`.
- Legacy Django/game content was not changed.
- No reset, force push, deletion, secret exposure, or stale-tree overwrite was used.

### Known limitations / not complete
- Progress/rewards remain local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Level Editor still lacks dedicated controls for all hazard-specific parameters such as laser timing/length.
- Star scoring currently uses remaining ink only.
- Known non-blocking Phaser bundle-size warning remains around 1.24 MB minified / 343 KB gzip; code splitting/lazy loading stays deferred to the performance milestone.

### Next
1. Verify exact CI run `35459191506` for `599abe00c75a7d93fa0b10ef8c8543a9cbce6020`; fix failures before expanding.
2. If green, continue the next unfinished Milestone 6/7 reward/item slice without adding workflows.
3. Keep reward grants routed only through `persistFormalCompletion` and preserve editor-preview isolation.
