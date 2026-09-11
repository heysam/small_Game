import { describe, expect, it } from 'vitest';
import { validateLevel, type LevelDefinition } from './level';
import { levels } from './levels';

describe('level data', () => {
  it('ships three valid, unique starter levels', () => {
    expect(levels).toHaveLength(3);
    expect(new Set(levels.map((level) => level.id)).size).toBe(levels.length);
    for (const level of levels) expect(validateLevel(level)).toBe(level);
  });

  it('rejects invalid ink and survival settings', () => {
    const invalid: LevelDefinition = {
      id: 'invalid',
      name: 'invalid',
      objective: 'survive',
      surviveMs: 0,
      maxInk: 0,
      gravityY: 0.5,
      hero: { x: 1, y: 1 },
      hazards: [{ kind: 'orb', x: 1, y: 1, radius: 10, velocityX: 0, velocityY: 1 }]
    };
    expect(() => validateLevel(invalid)).toThrow();
  });
});
