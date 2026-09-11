import { describe, expect, it } from 'vitest';
import { appendDrawPoint, distanceBetween } from './draw';

describe('drawing geometry', () => {
  it('ignores movement below the sampling threshold', () => {
    const result = appendDrawPoint({ x: 0, y: 0 }, { x: 3, y: 4 }, 100, 7);
    expect(result.accepted).toBe(false);
    expect(result.spent).toBe(0);
    expect(result.inkLeft).toBe(100);
  });

  it('clips the final segment to the remaining ink', () => {
    const result = appendDrawPoint({ x: 0, y: 0 }, { x: 30, y: 40 }, 20, 7);
    expect(distanceBetween({ x: 0, y: 0 }, result.next)).toBeCloseTo(20, 6);
    expect(result.spent).toBeCloseTo(20, 6);
    expect(result.inkLeft).toBe(0);
  });
});
