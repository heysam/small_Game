import { describe, expect, it } from 'vitest';
import { pointInsideTarget, validateLevel, type LevelDefinition } from './level';
import { levels } from './levels';

describe('level data', () => {
  it('ships six valid, unique starter levels across multiple worlds', () => {
    expect(levels).toHaveLength(6);
    expect(new Set(levels.map((level) => level.id)).size).toBe(levels.length);
    expect(new Set(levels.map((level) => level.world)).size).toBeGreaterThan(1);
    expect(levels.some((level) => level.objective === 'reach')).toBe(true);
    for (const level of levels) expect(validateLevel(level)).toBe(level);
  });

  it('rejects invalid ink and survival settings', () => {
    const invalid: LevelDefinition = {
      id: 'invalid', name: 'invalid', world: 'test', objective: 'survive', surviveMs: 0, maxInk: 0, gravityY: 0.5,
      hero: { x: 1, y: 1 }, hazards: [{ kind: 'orb', x: 1, y: 1, radius: 10, velocityX: 0, velocityY: 1 }]
    };
    expect(() => validateLevel(invalid)).toThrow();
  });

  it('requires a target for reach objectives and detects target occupancy', () => {
    const reach = levels.find((level) => level.objective === 'reach')!;
    expect(reach.target).toBeDefined();
    expect(pointInsideTarget({ x: reach.target!.x, y: reach.target!.y }, reach.target!)).toBe(true);
    expect(pointInsideTarget({ x: -100, y: -100 }, reach.target!)).toBe(false);
  });
});
