import { describe, expect, it } from 'vitest';
import { buildAssistStroke, strokeLength } from './assist';
import type { LevelDefinition } from './level';

const base: LevelDefinition = {
  id: 'assist-test',
  name: 'Assist test',
  world: 'city',
  objective: 'survive',
  surviveMs: 5000,
  maxInk: 300,
  gravityY: 0.65,
  hero: { x: 180, y: 420 },
  hazards: [{ kind: 'orb', x: 320, y: 380, radius: 16, velocityX: -2, velocityY: 0 }]
};

describe('assist stroke planner', () => {
  it('places a survive shield toward the nearest hazard', () => {
    const stroke = buildAssistStroke(base);
    expect(stroke.label).toBe('輔助防護線');
    expect(stroke.points).toHaveLength(3);
    expect(stroke.points.every((point) => point.x > base.hero.x)).toBe(true);
    expect(strokeLength(stroke.points)).toBeGreaterThan(0);
  });

  it('builds a bridge for reach objectives', () => {
    const stroke = buildAssistStroke({
      ...base,
      objective: 'reach',
      target: { x: 340, y: 470, width: 70, height: 80 }
    });
    expect(stroke.label).toBe('輔助橋樑');
    expect(stroke.points[2].x).toBeGreaterThan(stroke.points[0].x);
  });

  it('centers a catch cradle on the rescue target', () => {
    const target = { x: 210, y: 520, width: 120, height: 70 };
    const stroke = buildAssistStroke({ ...base, objective: 'catch', target });
    expect(stroke.label).toBe('輔助承接線');
    expect(stroke.points[1].x).toBe(target.x);
    expect(stroke.points[0].x).toBeLessThan(target.x);
    expect(stroke.points[2].x).toBeGreaterThan(target.x);
  });

  it('keeps generated points inside the playable drawing band', () => {
    const stroke = buildAssistStroke({ ...base, hero: { x: 410, y: 150 } });
    for (const point of stroke.points) {
      expect(point.x).toBeGreaterThanOrEqual(24);
      expect(point.x).toBeLessThanOrEqual(396);
      expect(point.y).toBeGreaterThanOrEqual(175);
      expect(point.y).toBeLessThanOrEqual(620);
    }
  });
});
