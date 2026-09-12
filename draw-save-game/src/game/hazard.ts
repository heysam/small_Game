import type { Point } from './level';

export function velocityToward(from: Point, to: Point, speed: number): Point {
  if (speed <= 0) throw new Error('speed must be positive');
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  if (distance === 0) return { x: 0, y: 0 };
  return { x: dx / distance * speed, y: dy / distance * speed };
}

export function fallingVelocity(speedY: number, driftX = 0): Point {
  if (speedY <= 0) throw new Error('speedY must be positive');
  return { x: driftX, y: speedY };
}

export function fallingResetDue(time: number, nextResetAt: number): boolean {
  return time >= nextResetAt;
}
