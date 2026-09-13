# Draw to Rescue — Project Status

## Milestone 1 — Core prototype

Status: **20-level starter milestone CI verified; Level Editor/Debug Panel connected; five hazard behaviors verified; Level Select now has real persisted completion/star/unlock flow with Chromium reload coverage**

Completed:
- Isolated `draw-save-game/` web project; existing Django game remains untouched.
- TypeScript + Vite + Phaser 3 + Matter Physics responsive prototype with mouse/touch drawing, finite ink, static drawn collision bodies, victory/failure logic and retry.
- Data-driven validated level schema with 20 original starter levels across city, forest, cave, laboratory and harbor worlds.
- `survive` and `reach` objectives; static/rotated platforms and visible reach targets.
- Five differentiated hazards: bouncing orb, active chaser, periodic falling hazard, static spike, and deterministic oscillating mover.
- Level Editor/Debug Panel supports safe scalar edits, validation, JSON import/export/reset and in-memory Phaser preview without overwriting checked-in levels.
- Deterministic editor metadata (difficulty/tags/hints) is guaranteed for all 20 runtime levels.
- Real Level Select groups levels by world and renders current lock and best-star state.
- Normal Level Select launch is now separate from editor custom-preview semantics: checked-in levels restart as normal gameplay, while editor previews remain `customLevel` runs and never write formal progress.
- Versioned local progress (`draw-save-game.progress.v1`) now records successful formal runs, best stars, best remaining ink and next-level unlocks; failures/editor previews grant no progress.
- Initial star calculation is based on remaining ink: >=50% = 3 stars, >=25% = 2 stars, otherwise a completed run receives 1 star. Existing better results are preserved.
- After a formal victory, `finishRound()` saves progress and refreshes the existing Level Select immediately.
- Storage helpers remain behind Storage-compatible interfaces for future guest/cloud sync.
- Playwright Chromium now covers three browser paths: real app draw/editor preview, deterministic hero/spike failure, and a real first-level completion that unlocks level 2 and remains unlocked with stars after page reload.
- Scene restart teardown safely removes the Matter collision listener from the captured world instance.
- One path-scoped GitHub Actions workflow runs unit tests, typecheck, production build and Playwright Chromium smoke; documentation-only status commits do not trigger CI.

Validation this round:
- Starting branch SHA was `8ae28c6158b54ff63b1a94d5b3239c92372c2333`; branch was re-read before each write and no external commit was overwritten.
- Core runtime feature commit: `d16be28d1560ac19fecd853e412205467e9d136c` (`feat(game): persist completed level progress`).
- Browser smoke stabilization commits: `09244ba792334b5df38bce416c6249c1568beb44`, `b54d540e2219d4aa638ab52f63be89512581c709`, and final verified test commit `609970eda290f46b452a6451bfdc35ed9d5a8ee7`.
- The first two CI attempts correctly exposed a flaky/ineffective real-level drawing path; unit tests, typecheck and production build were already green. The browser test was not marked complete until a reliable full-width in-game shield completed the real first level.
- GitHub Actions run `34775001853` completed successfully for exact commit `609970eda290f46b452a6451bfdc35ed9d5a8ee7`.
- Verified CI: `npm install --no-audit --no-fund`, 7 test files / 26 unit tests, `npm run typecheck`, `npm run build`, Playwright Chromium installation, and all 3 browser smoke tests succeeded.
- Real persistence browser evidence covers: clear storage -> level 1 unlocked / level 2 locked -> select level 1 -> draw within the 560-ink budget -> survive the formal 7-second level -> level 2 becomes enabled -> progress contains `city-01` -> reload -> level 2 and star result remain persisted.
- No reset, force push or stale-tree overwrite was used.
- No existing Django/legacy game files were changed by this batch.

Known limitation / not marked complete:
- Progress is still local-only; guest/account/D1 synchronization belongs to the later data/account milestone.
- Star scoring currently uses remaining ink only; future objective/time/optional-goal scoring can extend this without changing the persisted best-result contract.
- Known non-blocking Phaser bundle-size warning remains: main JS is about 1.24 MB minified / 342 KB gzip; defer code splitting/lazy loading to the performance milestone.

Next:
1. Add the next objective type beyond `survive`/`reach`, prioritizing catch/fall-blocking or escort so the game is not dominated by protection-only goals.
2. Add another differentiated timed/environmental hazard, prioritizing laser.
3. Continue Milestone 5 UX: explicit result presentation, retry/next controls, hint/tutorial behavior, sound/vibration settings and accessibility options.
4. Expand progression/reward systems only after the objective/hazard foundation remains green.
5. Address bundle-size/lazy-loading only during the dedicated performance milestone.
