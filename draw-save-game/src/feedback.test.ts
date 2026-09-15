import { describe, expect, it } from 'vitest';
import { DEFAULT_FEEDBACK_SETTINGS, FEEDBACK_STORAGE_KEY, loadFeedbackSettings, saveFeedbackSettings } from './feedback';

function memoryStorage(initial?: Record<string, string>) {
  const data = new Map(Object.entries(initial ?? {}));
  return {
    getItem(key: string) { return data.get(key) ?? null; },
    setItem(key: string, value: string) { data.set(key, value); }
  };
}

describe('feedback settings', () => {
  it('uses safe defaults when no saved settings exist', () => {
    expect(loadFeedbackSettings(memoryStorage())).toEqual(DEFAULT_FEEDBACK_SETTINGS);
  });

  it('persists explicit sound and vibration choices', () => {
    const storage = memoryStorage();
    saveFeedbackSettings({ sound: false, vibration: true }, storage);
    expect(loadFeedbackSettings(storage)).toEqual({ sound: false, vibration: true });
  });

  it('normalizes corrupt and partial stored values', () => {
    expect(loadFeedbackSettings(memoryStorage({ [FEEDBACK_STORAGE_KEY]: '{bad' }))).toEqual(DEFAULT_FEEDBACK_SETTINGS);
    expect(loadFeedbackSettings(memoryStorage({ [FEEDBACK_STORAGE_KEY]: JSON.stringify({ sound: false }) }))).toEqual({ sound: false, vibration: true });
  });
});
