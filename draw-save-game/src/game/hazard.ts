import type { Point } from './level';

export type LaserPhase = 'warning' | 'active' | 'cooldown';

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

export function oscillatingOffset(timeMs: number, range: number, speed: number): number {
  if (range <= 0) throw new Error('range must be positive');
  if (speed <= 0) throw new Error('speed must be positive');
  const travel = (Math.max(0, timeMs) / 1000 * speed) % (range * 4);
  return travel <= range * 2 ? -range + travel : range * 3 - travel;
}

export function laserPhaseAt(elapsedMs: number, warningMs: number, activeMs: number, cooldownMs: number, phaseMs = 0): LaserPhase {
  if (warningMs < 0) throw new Error('warningMs must be zero or positive');
  if (activeMs <= 0) throw new Error('activeMs must be positive');
  if (cooldownMs < 0) throw new Error('cooldownMs must be zero or positive');
  if (phaseMs < 0) throw new Error('phaseMs must be zero or positive');
  const cycleMs = warningMs + activeMs + cooldownMs;
  const cycleTime = (Math.max(0, elapsedMs) + phaseMs) % cycleMs;
  if (cycleTime < warningMs) return 'warning';
  if (cycleTime < warningMs + activeMs) return 'active';
  return 'cooldown';
}
