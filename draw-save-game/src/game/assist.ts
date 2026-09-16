import type { LevelDefinition, Point } from './level';

export type AssistStroke = {
  label: string;
  points: Point[];
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

/**
 * Builds a deterministic, objective-aware starter stroke for players who
 * cannot reliably perform freehand pointer drawing. The returned stroke is
 * deliberately just a normal stroke: callers must feed it through the same
 * ink accounting, Matter bodies and round rules as pointer input.
 */
export function buildAssistStroke(level: LevelDefinition): AssistStroke {
  const hero = level.hero;

  if (level.objective === 'reach' && level.target) {
    const target = level.target;
    const midY = clamp(Math.max(hero.y, target.y) + 42, 175, 620);
    return {
      label: '輔助橋樑',
      points: [
        { x: clamp(hero.x - 34, 24, 396), y: midY },
        { x: clamp((hero.x + target.x) / 2, 24, 396), y: midY },
        { x: clamp(target.x + 34, 24, 396), y: clamp(target.y + target.height / 2 + 18, 175, 620) }
      ]
    };
  }

  if (level.objective === 'catch' && level.target) {
    const target = level.target;
    const y = clamp(target.y - target.height / 2 + 10, 175, 620);
    const half = Math.max(42, target.width / 2);
    return {
      label: '輔助承接線',
      points: [
        { x: clamp(target.x - half, 24, 396), y },
        { x: clamp(target.x, 24, 396), y: y + 12 },
        { x: clamp(target.x + half, 24, 396), y }
      ]
    };
  }

  const nearestHazard = [...level.hazards].sort((a, b) =>
    Math.hypot(a.x - hero.x, a.y - hero.y) - Math.hypot(b.x - hero.x, b.y - hero.y)
  )[0];
  const hazardOnRight = nearestHazard ? nearestHazard.x >= hero.x : true;
  const shieldX = clamp(hero.x + (hazardOnRight ? 44 : -44), 24, 396);
  return {
    label: '輔助防護線',
    points: [
      { x: shieldX, y: clamp(hero.y - 70, 175, 620) },
      { x: shieldX + (hazardOnRight ? 18 : -18), y: clamp(hero.y, 175, 620) },
      { x: shieldX, y: clamp(hero.y + 70, 175, 620) }
    ]
  };
}

export function strokeLength(points: Point[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return length;
}
