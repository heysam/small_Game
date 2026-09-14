import { describe, expect, it } from 'vitest';
import { hasSeenTutorial, markTutorialSeen, objectiveHelp, TUTORIAL_STORAGE_KEY } from './tutorial';

function memoryStorage(initial?: Record<string, string>) {
  const data = new Map(Object.entries(initial ?? {}));
  return {
    getItem(key: string) { return data.get(key) ?? null; },
    setItem(key: string, value: string) { data.set(key, value); }
  };
}

describe('tutorial state', () => {
  it('starts unseen and persists dismissal', () => {
    const storage = memoryStorage();
    expect(hasSeenTutorial(storage)).toBe(false);
    markTutorialSeen(storage);
    expect(storage.getItem(TUTORIAL_STORAGE_KEY)).toBe('1');
    expect(hasSeenTutorial(storage)).toBe(true);
  });

  it('returns objective-specific player guidance', () => {
    expect(objectiveHelp('survive')).toContain('倒數');
    expect(objectiveHelp('reach')).toContain('綠色出口');
    expect(objectiveHelp('catch')).toContain('藍色救援區');
  });
});
