import { validateLevel, type LevelDefinition } from './level';

export type EditableLevelFields = Pick<LevelDefinition, 'name' | 'world' | 'objective' | 'surviveMs' | 'maxInk' | 'gravityY'>;

export function exportLevelJson(level: LevelDefinition): string {
  return JSON.stringify(validateLevel(structuredClone(level)), null, 2);
}

export function importLevelJson(json: string): LevelDefinition {
  const parsed = JSON.parse(json) as LevelDefinition;
  return validateLevel(parsed);
}

export function updateEditableLevel(level: LevelDefinition, patch: Partial<EditableLevelFields>): LevelDefinition {
  return validateLevel({ ...structuredClone(level), ...patch });
}
