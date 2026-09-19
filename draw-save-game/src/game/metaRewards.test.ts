import { describe, expect, it } from 'vitest';
import {
  applyCompletionMetaRewards,
  createDefaultMetaRewardLedger,
  normalizeMetaRewardLedger,
  DAILY_CLEAR_COINS,
  DAILY_THREE_STARS_COINS,
  FIRST_RESCUE_COINS,
  STAR_COLLECTOR_10_COINS
} from './metaRewards';

describe('meta reward model', () => {
  it('claims daily clear and first rescue once', () => {
    const first = applyCompletionMetaRewards(createDefaultMetaRewardLedger('2026-09-19'), {
      day: '2026-09-19', stars: 1, totalCompletedLevels: 1, totalBestStars: 1
    });
    expect(first.coins).toBe(DAILY_CLEAR_COINS + FIRST_RESCUE_COINS);
    expect(first.newlyClaimedDaily).toEqual(['daily-clear']);
    expect(first.newlyClaimedAchievements).toEqual(['first-rescue']);

    const replay = applyCompletionMetaRewards(first.ledger, {
      day: '2026-09-19', stars: 1, totalCompletedLevels: 1, totalBestStars: 1
    });
    expect(replay.coins).toBe(0);
  });

  it('claims the three-star daily and ten-star achievement independently', () => {
    const grant = applyCompletionMetaRewards(createDefaultMetaRewardLedger('2026-09-19'), {
      day: '2026-09-19', stars: 3, totalCompletedLevels: 4, totalBestStars: 10
    });
    expect(grant.coins).toBe(DAILY_CLEAR_COINS + DAILY_THREE_STARS_COINS + FIRST_RESCUE_COINS + STAR_COLLECTOR_10_COINS);
    expect(grant.newlyClaimedDaily).toEqual(['daily-clear', 'daily-three-stars']);
    expect(grant.newlyClaimedAchievements).toEqual(['first-rescue', 'star-collector-10']);
  });

  it('resets daily missions on a new day but keeps achievements', () => {
    const first = applyCompletionMetaRewards(createDefaultMetaRewardLedger('2026-09-19'), {
      day: '2026-09-19', stars: 3, totalCompletedLevels: 4, totalBestStars: 10
    });
    const nextDay = applyCompletionMetaRewards(first.ledger, {
      day: '2026-09-20', stars: 1, totalCompletedLevels: 4, totalBestStars: 10
    });
    expect(nextDay.coins).toBe(DAILY_CLEAR_COINS);
    expect(nextDay.ledger.claimedAchievements).toEqual(first.ledger.claimedAchievements);
    expect(nextDay.ledger.claimedDaily).toEqual(['daily-clear']);
  });

  it('normalizes malformed persisted data', () => {
    const normalized = normalizeMetaRewardLedger({
      version: 1,
      day: '2026-09-19',
      dailyProgress: { 'daily-clear': -5, 'daily-three-stars': '2' },
      claimedDaily: ['daily-clear', 'bad'],
      claimedAchievements: ['first-rescue', 'bad']
    }, '2026-09-19');
    expect(normalized.dailyProgress).toEqual({ 'daily-clear': 0, 'daily-three-stars': 2 });
    expect(normalized.claimedDaily).toEqual(['daily-clear']);
    expect(normalized.claimedAchievements).toEqual(['first-rescue']);
  });
});
