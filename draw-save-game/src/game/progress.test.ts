import { describe, expect, it } from 'vitest';
import { createDefaultProgress, normalizeProgress, recordLevelResult } from './progress';

describe('player progress', () => {
  it('starts with only the first level unlocked', () => {
    expect(createDefaultProgress()).toEqual({ version: 1, unlockedLevel: 0, results: {} });
  });

  it('keeps best stars and unlocks the next level on completion', () => {
    let progress = createDefaultProgress();
    progress = recordLevelResult(progress, 'city-1', 0, 20, { completed: true, stars: 2, bestInkLeft: 120 });
    progress = recordLevelResult(progress, 'city-1', 0, 20, { completed: true, stars: 1, bestInkLeft: 90 });
    expect(progress.unlockedLevel).toBe(1);
    expect(progress.results['city-1']).toEqual({ completed: true, stars: 2, bestInkLeft: 120 });
  });

  it('normalizes malformed persisted data safely', () => {
    const value = normalizeProgress({ unlockedLevel: 999, results: { a: { stars: 8, completed: 1 } } }, 20);
    expect(value.unlockedLevel).toBe(19);
    expect(value.results.a).toEqual({ stars: 3, completed: true });
  });
});
