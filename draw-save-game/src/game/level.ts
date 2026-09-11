export type Point = { x: number; y: number };

export type HazardKind = 'orb';

export type HazardSpawn = {
  kind: HazardKind;
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
};

export type LevelDefinition = {
  id: string;
  name: string;
  objective: 'survive';
  surviveMs: number;
  maxInk: number;
  gravityY: number;
  hero: Point;
  hazards: HazardSpawn[];
};

export function validateLevel(level: LevelDefinition): LevelDefinition {
  if (!level.id || !level.name) throw new Error('Level id/name is required');
  if (level.surviveMs <= 0) throw new Error(`Level ${level.id}: surviveMs must be positive`);
  if (level.maxInk <= 0) throw new Error(`Level ${level.id}: maxInk must be positive`);
  if (level.hazards.length === 0) throw new Error(`Level ${level.id}: at least one hazard is required`);
  return level;
}
