import { describe, expect, it } from 'vitest';
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
  it('persists progress and rewards once for a formal clear', () => {
    const storage = memoryStorage();
    const first = persistFormalCompletion({ levelId: 'city-01', levelIndex: 0, levelCount: 20, inkLeft: 60, maxInk: 100, isPreview: false }, storage);
    expect(first).toMatchObject({ stars: 3, coinsEarned: 35, totalCoins: 35, persisted: true });
    expect(storage.getItem(PROGRESS_STORAGE_KEY)).toContain('city-01');
    expect(storage.getItem(REWARD_STORAGE_KEY)).toContain('city-01');

    const replay = persistFormalCompletion({ levelId: 'city-01', levelIndex: 0, levelCount: 20, inkLeft: 60, maxInk: 100, isPreview: false }, storage);
    expect(replay).toMatchObject({ stars: 3, coinsEarned: 0, totalCoins: 35, persisted: true });
  });

  it('keeps editor previews isolated from both stores', () => {
    const storage = memoryStorage();
    const result = persistFormalCompletion({ levelId: 'preview', levelIndex: 0, levelCount: 20, inkLeft: 100, maxInk: 100, isPreview: true }, storage);
    expect(result).toEqual({ stars: 0, persisted: false });
    expect(storage.getItem(PROGRESS_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(REWARD_STORAGE_KEY)).toBeNull();
  });
});
