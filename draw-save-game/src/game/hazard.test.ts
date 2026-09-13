import { describe, expect, it } from 'vitest';
import { fallingResetDue, fallingVelocity, oscillatingOffset, velocityToward } from './hazard';

describe('hazard steering', () => {
  it('returns a velocity with the requested speed toward the target', () => {
    const velocity = velocityToward({ x: 0, y: 0 }, { x: 3, y: 4 }, 2);
    expect(velocity.x).toBeCloseTo(1.2);
    expect(velocity.y).toBeCloseTo(1.6);
    expect(Math.hypot(velocity.x, velocity.y)).toBeCloseTo(2);
  });

  it('stays still when already on the target and rejects invalid speed', () => {
    expect(velocityToward({ x: 5, y: 5 }, { x: 5, y: 5 }, 1.5)).toEqual({ x: 0, y: 0 });
    expect(() => velocityToward({ x: 0, y: 0 }, { x: 1, y: 1 }, 0)).toThrow();
  });
});

describe('falling hazard timing', () => {
  it('creates deterministic falling velocity with optional horizontal drift', () => {
    expect(fallingVelocity(3.2, -0.4)).toEqual({ x: -0.4, y: 3.2 });
    expect(() => fallingVelocity(0)).toThrow(/speedY/);
  });

  it('resets only when its next interval has elapsed', () => {
    expect(fallingResetDue(2499, 2500)).toBe(false);
    expect(fallingResetDue(2500, 2500)).toBe(true);
  });
});

describe('moving hazard motion', () => {
  it('oscillates deterministically between both ends of its configured range', () => {
    expect(oscillatingOffset(0, 50, 100)).toBe(-50);
    expect(oscillatingOffset(500, 50, 100)).toBe(0);
    expect(oscillatingOffset(1000, 50, 100)).toBe(50);
    expect(oscillatingOffset(1500, 50, 100)).toBe(0);
    expect(oscillatingOffset(2000, 50, 100)).toBe(-50);
  });

  it('rejects invalid mover range or speed', () => {
    expect(() => oscillatingOffset(100, 0, 10)).toThrow(/range/);
    expect(() => oscillatingOffset(100, 10, 0)).toThrow(/speed/);
  });
});
