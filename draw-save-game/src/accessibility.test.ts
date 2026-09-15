import { describe, expect, it } from 'vitest';
import { ACCESSIBILITY_STORAGE_KEY, DEFAULT_ACCESSIBILITY_SETTINGS, loadAccessibilitySettings, saveAccessibilitySettings } from './accessibility';

function memoryStorage(initial?: Record<string, string>) {
  const data = new Map(Object.entries(initial ?? {}));
  return {
    getItem(key: string) { return data.get(key) ?? null; },
    setItem(key: string, value: string) { data.set(key, value); }
  };
}

describe('accessibility settings', () => {
  it('uses safe defaults when no saved settings exist', () => {
    expect(loadAccessibilitySettings(memoryStorage())).toEqual(DEFAULT_ACCESSIBILITY_SETTINGS);
  });

  it('persists explicit accessibility choices', () => {
    const storage = memoryStorage();
    saveAccessibilitySettings({ reducedMotion: true, highContrast: true, largeText: false }, storage);
    expect(loadAccessibilitySettings(storage)).toEqual({ reducedMotion: true, highContrast: true, largeText: false });
  });

  it('normalizes corrupt and partial stored values', () => {
    expect(loadAccessibilitySettings(memoryStorage({ [ACCESSIBILITY_STORAGE_KEY]: '{bad' }))).toEqual(DEFAULT_ACCESSIBILITY_SETTINGS);
    expect(loadAccessibilitySettings(memoryStorage({ [ACCESSIBILITY_STORAGE_KEY]: JSON.stringify({ highContrast: true }) }))).toEqual({ reducedMotion: false, highContrast: true, largeText: false });
  });
});
