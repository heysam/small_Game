import { describe, expect, it } from 'vitest';
import { applyCompletionReward } from '../src/game/rewardFlow';
import { REWARD_STORAGE_KEY } from '../src/game/rewards';

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe('applyCompletionReward', () => {
  it('persists first-clear and star rewards for a formal completion', () => {
    const storage = new MemoryStorage();
    const result = applyCompletionReward({ levelId: 'city-01', stars: 2, isPreview: false }, storage);

    expect(result.reward?.coins).toBe(30);
    expect(result.ledger.coins).toBe(30);
    expect(storage.getItem(REWARD_STORAGE_KEY)).not.toBeNull();
  });

  it('does not mint coins or persist data for editor previews', () => {
    const storage = new MemoryStorage();
    const result = applyCompletionReward({ levelId: 'preview', stars: 3, isPreview: true }, storage);

    expect(result.reward).toBeNull();
    expect(result.ledger.coins).toBe(0);
    expect(storage.getItem(REWARD_STORAGE_KEY)).toBeNull();
  });

  it('remains idempotent when a completed level is replayed with the same stars', () => {
    const storage = new MemoryStorage();
    applyCompletionReward({ levelId: 'forest-01', stars: 3, isPreview: false }, storage);
    const replay = applyCompletionReward({ levelId: 'forest-01', stars: 3, isPreview: false }, storage);

    expect(replay.reward?.coins).toBe(0);
    expect(replay.ledger.coins).toBe(35);
  });
});
