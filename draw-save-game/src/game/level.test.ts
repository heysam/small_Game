import { describe, expect, it } from 'vitest';
import { pointInsideTarget, validateLevel, type LevelDefinition } from './level';
import { levels } from './levels';

describe('level data', () => {
  it('ships ten valid, unique starter levels across multiple worlds and hazard types', () => {
    expect(levels).toHaveLength(10);
    expect(new Set(levels.map((level) => level.id)).size).toBe(levels.length);
    expect(new Set(levels.map((level) => level.world)).size).toBeGreaterThanOrEqual(3);
    expect(levels.some((level) => level.objective === 'reach')).toBe(true);
    expect(levels.some((level) => level.hazards.some((hazard) => hazard.kind === 'chaser'))).toBe(true);
    for (const level of levels) expect(validateLevel(level)).toBe(level);
  });

  it('rejects invalid ink and survival settings', () => {
    const invalid: LevelDefinition = {
      id: 'invalid', name: 'invalid', world: 'test', objective: 'survive', surviveMs: 0, maxInk: 0, gravityY: 0.5,
      hero: { x: 1, y: 1 }, hazards: [{ kind: 'orb', x: 1, y: 1, radius: 10, velocityX: 0, velocityY: 1 }]
    };
    expect(() => validateLevel(invalid)).toThrow();
  });

  it('rejects a chaser with non-positive speed', () => {
    const invalid: LevelDefinition = {
      id: 'bad-chaser', name: 'bad', world: 'test', objective: 'survive', surviveMs: 1000, maxInk: 100, gravityY: 0.5,
      hero: { x: 1, y: 1 }, hazards: [{ kind: 'chaser', x: 20, y: 20, radius: 10, speed: 0 }]
    };
    expect(() => validateLevel(invalid)).toThrow(/chaser speed/);
  });

  it('requires a target for reach objectives and detects target occupancy', () => {
    const reach = levels.find((level) => level.objective === 'reach')!;
    expect(reach.target).toBeDefined();
    expect(pointInsideTarget({ x: reach.target!.x, y: reach.target!.y }, reach.target!)).toBe(true);
    expect(pointInsideTarget({ x: -100, y: -100 }, reach.target!)).toBe(false);
  });
});
