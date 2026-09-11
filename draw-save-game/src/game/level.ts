export type Point = { x: number; y: number };

export type LevelObjective = 'survive' | 'reach';

export type OrbHazardSpawn = {
  kind: 'orb';
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
};

export type ChaserHazardSpawn = {
  kind: 'chaser';
  x: number;
  y: number;
  radius: number;
  speed: number;
};

export type HazardSpawn = OrbHazardSpawn | ChaserHazardSpawn;
export type HazardKind = HazardSpawn['kind'];

export type StaticPlatform = {
  kind: 'platform';
  x: number;
  y: number;
  width: number;
  height: number;
  angle?: number;
};

export type TargetZone = {
  x: number;
  y: number;
  width: number;
  height: number;
  holdMs?: number;
};

export type LevelDefinition = {
  id: string;
  name: string;
  world: string;
  objective: LevelObjective;
  surviveMs: number;
  maxInk: number;
  gravityY: number;
  hero: Point;
  hazards: HazardSpawn[];
  platforms?: StaticPlatform[];
  target?: TargetZone;
};

export function validateLevel(level: LevelDefinition): LevelDefinition {
  if (!level.id || !level.name || !level.world) throw new Error('Level id/name/world is required');
  if (level.surviveMs <= 0) throw new Error(`Level ${level.id}: surviveMs must be positive`);
  if (level.maxInk <= 0) throw new Error(`Level ${level.id}: maxInk must be positive`);
  if (level.hazards.length === 0) throw new Error(`Level ${level.id}: at least one hazard is required`);
  if (level.hazards.some((hazard) => hazard.radius <= 0)) {
    throw new Error(`Level ${level.id}: hazard radius must be positive`);
  }
  if (level.hazards.some((hazard) => hazard.kind === 'chaser' && hazard.speed <= 0)) {
    throw new Error(`Level ${level.id}: chaser speed must be positive`);
  }
  if (level.platforms?.some((platform) => platform.width <= 0 || platform.height <= 0)) {
    throw new Error(`Level ${level.id}: platform dimensions must be positive`);
  }
  if (level.objective === 'reach') {
    if (!level.target) throw new Error(`Level ${level.id}: reach objective requires a target`);
    if (level.target.width <= 0 || level.target.height <= 0) throw new Error(`Level ${level.id}: target dimensions must be positive`);
  }
  return level;
}

export function pointInsideTarget(point: Point, target: TargetZone): boolean {
  return Math.abs(point.x - target.x) <= target.width / 2 && Math.abs(point.y - target.y) <= target.height / 2;
}
