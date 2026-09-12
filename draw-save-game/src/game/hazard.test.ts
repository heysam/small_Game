import { describe, expect, it } from 'vitest';
import { fallingResetDue, fallingVelocity, velocityToward } from './hazard';

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
