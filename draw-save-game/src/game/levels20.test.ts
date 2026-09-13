import { describe, expect, it } from 'vitest';
import { expansionLevels, levels } from './levels20';

describe('twenty-level starter milestone', () => {
  it('contains twenty unique playable levels', () => {
    expect(levels).toHaveLength(20);
    expect(new Set(levels.map((level) => level.id)).size).toBe(20);
  });

  it('adds static spikes, a moving mechanism, and a fifth world', () => {
    expect(expansionLevels.some((level) => level.hazards.some((hazard) => hazard.kind === 'spike'))).toBe(true);
    expect(expansionLevels.some((level) => level.hazards.some((hazard) => hazard.kind === 'mover'))).toBe(true);
    expect(new Set(levels.map((level) => level.world)).has('harbor')).toBe(true);
  });

  it('gives every expansion level editor metadata', () => {
    expect(expansionLevels.every((level) => level.editor && level.editor.tags.length > 0)).toBe(true);
  });
});
