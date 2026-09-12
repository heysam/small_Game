import { describe, expect, it } from 'vitest';
import { exportLevelJson, importLevelJson, updateEditableLevel } from './editor';
import { levels } from './levels20';

describe('level editor data boundary', () => {
  it('round-trips a playable level through JSON export/import', () => {
    const source = levels[levels.length - 1];
    const json = exportLevelJson(source);
    const imported = importLevelJson(json);
    expect(imported).toEqual(source);
  });

  it('applies editable scalar patches while preserving hazards', () => {
    const source = levels[0];
    const edited = updateEditableLevel(source, { maxInk: source.maxInk + 25, gravityY: 0.5 });
    expect(edited.maxInk).toBe(source.maxInk + 25);
    expect(edited.gravityY).toBe(0.5);
    expect(edited.hazards).toEqual(source.hazards);
  });

  it('rejects malformed imported levels', () => {
    expect(() => importLevelJson('{"id":"broken"}')).toThrow();
  });
});
