import { describe, expect, it } from 'vitest';
import { INVENTORY_STORAGE_KEY } from './items';
import { META_REWARD_STORAGE_KEY } from './metaRewards';
import { PROGRESS_STORAGE_KEY } from './progress';
import { REWARD_STORAGE_KEY } from './rewards';
import { persistFormalCompletion } from './formalCompletion';

function memoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() { return data.size; },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => Array.from(data.keys())[index] ?? null,
    removeItem: (key) => { data.delete(key); },
    setItem: (key, value) => { data.set(key, value); }
  };
}

describe('persistFormalCompletion', () => {
  it('persists level, daily, achievement, and item rewards once for a formal clear', () => {
    const storage = memoryStorage();
    const first = persistFormalCompletion({
      levelId: 'city-01', levelIndex: 0, levelCount: 20, inkLeft: 60, maxInk: 100,
      isPreview: false, rewardDay: '2026-09-19'
    }, storage);
    expect(first).toMatchObject({
      stars: 3,
      coinsEarned: 95,
      metaCoinsEarned: 60,
      totalCoins: 95,
      newlyClaimedDaily: ['daily-clear', 'daily-three-stars'],
      newlyClaimedAchievements: ['first-rescue'],
      inventoryGranted: [{ itemId: 'ink-refill', amount: 1 }],
      persisted: true
    });
    expect(storage.getItem(PROGRESS_STORAGE_KEY)).toContain('city-01');
    expect(storage.getItem(REWARD_STORAGE_KEY)).toContain('city-01');
    expect(storage.getItem(META_REWARD_STORAGE_KEY)).toContain('first-rescue');
    expect(storage.getItem(INVENTORY_STORAGE_KEY)).toContain('"ink-refill":1');

    const replay = persistFormalCompletion({
      levelId: 'city-01', levelIndex: 0, levelCount: 20, inkLeft: 60, maxInk: 100,
      isPreview: false, rewardDay: '2026-09-19'
    }, storage);
    expect(replay).toMatchObject({
      stars: 3, coinsEarned: 0, metaCoinsEarned: 0, totalCoins: 95,
      inventoryGranted: [], persisted: true
    });
    expect(storage.getItem(INVENTORY_STORAGE_KEY)).toContain('"ink-refill":1');
  });

  it('resets daily claims on a new day without re-awarding permanent achievements', () => {
    const storage = memoryStorage();
    persistFormalCompletion({ levelId: 'city-01', levelIndex: 0, levelCount: 20, inkLeft: 30, maxInk: 100, isPreview: false, rewardDay: '2026-09-19' }, storage);
    const nextDay = persistFormalCompletion({ levelId: 'city-01', levelIndex: 0, levelCount: 20, inkLeft: 30, maxInk: 100, isPreview: false, rewardDay: '2026-09-20' }, storage);
    expect(nextDay.metaCoinsEarned).toBe(15);
    expect(nextDay.newlyClaimedDaily).toEqual(['daily-clear']);
    expect(nextDay.newlyClaimedAchievements).toEqual([]);
    expect(nextDay.inventoryGranted).toEqual([]);
  });

  it('grants another ink refill when the three-star daily claim resets on a new day', () => {
    const storage = memoryStorage();
    persistFormalCompletion({ levelId: 'city-01', levelIndex: 0, levelCount: 20, inkLeft: 60, maxInk: 100, isPreview: false, rewardDay: '2026-09-19' }, storage);
    const nextDay = persistFormalCompletion({ levelId: 'city-01', levelIndex: 0, levelCount: 20, inkLeft: 60, maxInk: 100, isPreview: false, rewardDay: '2026-09-20' }, storage);
    expect(nextDay.inventoryGranted).toEqual([{ itemId: 'ink-refill', amount: 1 }]);
    expect(storage.getItem(INVENTORY_STORAGE_KEY)).toContain('"ink-refill":2');
  });

  it('keeps editor previews isolated from all reward, progress, and inventory stores', () => {
    const storage = memoryStorage();
    const result = persistFormalCompletion({ levelId: 'preview', levelIndex: 0, levelCount: 20, inkLeft: 100, maxInk: 100, isPreview: true, rewardDay: '2026-09-19' }, storage);
    expect(result).toEqual({ stars: 0, persisted: false });
    expect(storage.getItem(PROGRESS_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(REWARD_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(META_REWARD_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(INVENTORY_STORAGE_KEY)).toBeNull();
  });
});
