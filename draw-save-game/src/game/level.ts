export type Point = { x: number; y: number };

export type LevelObjective = 'survive' | 'reach' | 'catch';

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

export type FallingHazardSpawn = {
  kind: 'falling';
  x: number;
  y: number;
  radius: number;
  speedY: number;
  driftX?: number;
  intervalMs: number;
};

export type SpikeHazardSpawn = {
  kind: 'spike';
  x: number;
  y: number;
  radius: number;
};

export type MoverHazardSpawn = {
  kind: 'mover';
  x: number;
  y: number;
  radius: number;
  axis: 'x' | 'y';
  range: number;
  speed: number;
  phaseMs?: number;
};

export type LaserHazardSpawn = {
  kind: 'laser';
  x: number;
  y: number;
  radius: number;
  axis: 'x' | 'y';
  length: number;
  warningMs: number;
  activeMs: number;
  cooldownMs: number;
  phaseMs?: number;
};

export type HazardSpawn = OrbHazardSpawn | ChaserHazardSpawn | FallingHazardSpawn | SpikeHazardSpawn | MoverHazardSpawn | LaserHazardSpawn;
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

export type LevelEditorMetadata = {
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  hint?: string;
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
  editor?: LevelEditorMetadata;
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
  if (level.hazards.some((hazard) => hazard.kind === 'falling' && (hazard.speedY <= 0 || hazard.intervalMs < 500))) {
    throw new Error(`Level ${level.id}: falling hazard speed/interval is invalid`);
  }
  if (level.hazards.some((hazard) => hazard.kind === 'mover' && (hazard.range <= 0 || hazard.speed <= 0 || (hazard.phaseMs ?? 0) < 0))) {
    throw new Error(`Level ${level.id}: mover range/speed/phase is invalid`);
  }
  if (level.hazards.some((hazard) => hazard.kind === 'laser' && (hazard.length <= 0 || hazard.warningMs < 0 || hazard.activeMs <= 0 || hazard.cooldownMs < 0 || (hazard.phaseMs ?? 0) < 0))) {
    throw new Error(`Level ${level.id}: laser length/timing/phase is invalid`);
  }
  if (level.platforms?.some((platform) => platform.width <= 0 || platform.height <= 0)) {
    throw new Error(`Level ${level.id}: platform dimensions must be positive`);
  }
  if (level.objective === 'reach' || level.objective === 'catch') {
    if (!level.target) throw new Error(`Level ${level.id}: ${level.objective} objective requires a target`);
    if (level.target.width <= 0 || level.target.height <= 0) throw new Error(`Level ${level.id}: target dimensions must be positive`);
  }
  if (level.editor) {
    if (!Number.isInteger(level.editor.difficulty) || level.editor.difficulty < 1 || level.editor.difficulty > 5) {
      throw new Error(`Level ${level.id}: editor difficulty must be 1-5`);
    }
    if (level.editor.tags.length === 0 || level.editor.tags.some((tag) => !tag.trim())) {
      throw new Error(`Level ${level.id}: editor tags must be non-empty`);
    }
  }
  return level;
}

export function pointInsideTarget(point: Point, target: TargetZone): boolean {
  return Math.abs(point.x - target.x) <= target.width / 2 && Math.abs(point.y - target.y) <= target.height / 2;
}
