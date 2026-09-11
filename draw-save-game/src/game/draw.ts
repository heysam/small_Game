export type Point = { x: number; y: number };

export type DrawStep = {
  accepted: boolean;
  next: Point;
  spent: number;
  inkLeft: number;
};

export function distanceBetween(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function appendDrawPoint(last: Point, pointer: Point, inkLeft: number, minDistance: number): DrawStep {
  const distance = distanceBetween(last, pointer);
  if (inkLeft <= 0 || distance < minDistance || distance === 0) {
    return { accepted: false, next: last, spent: 0, inkLeft: Math.max(0, inkLeft) };
  }

  const spent = Math.min(distance, inkLeft);
  const ratio = spent / distance;
  return {
    accepted: true,
    next: {
      x: last.x + (pointer.x - last.x) * ratio,
      y: last.y + (pointer.y - last.y) * ratio
    },
    spent,
    inkLeft: Math.max(0, inkLeft - spent)
  };
}
