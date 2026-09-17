import { describe, expect, it } from 'vitest';
import { awardLevelCompletion, createDefaultRewardLedger, normalizeRewardLedger } from './rewards';

describe('coin reward ledger', () => {
  it('awards first clear plus earned stars', () => {
    const reward = awardLevelCompletion(createDefaultRewardLedger(), 'city-1', 2);
    expect(reward).toMatchObject({ coins: 30, firstClearCoins: 20, starCoins: 10 });
    expect(reward.ledger.coins).toBe(30);
    expect(reward.ledger.levels['city-1']).toEqual({ firstClearClaimed: true, rewardedStars: 2 });
  });

  it('does not pay again for an equal or worse replay', () => {
    const first = awardLevelCompletion(createDefaultRewardLedger(), 'city-1', 3);
    const replay = awardLevelCompletion(first.ledger, 'city-1', 2);
    expect(replay.coins).toBe(0);
    expect(replay.ledger.coins).toBe(35);
    expect(replay.ledger.levels['city-1'].rewardedStars).toBe(3);
  });

  it('only pays the newly improved star difference', () => {
    const first = awardLevelCompletion(createDefaultRewardLedger(), 'forest-1', 1);
    const improved = awardLevelCompletion(first.ledger, 'forest-1', 3);
    expect(first.coins).toBe(25);
    expect(improved).toMatchObject({ coins: 10, firstClearCoins: 0, starCoins: 10 });
    expect(improved.ledger.coins).toBe(35);
  });

  it('normalizes malformed persisted values safely', () => {
    expect(normalizeRewardLedger({ coins: -20, levels: { a: { firstClearClaimed: 1, rewardedStars: 9 } } })).toEqual({
      version: 1,
      coins: 0,
      levels: { a: { firstClearClaimed: true, rewardedStars: 3 } }
    });
  });
});
