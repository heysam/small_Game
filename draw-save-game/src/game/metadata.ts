import type { HazardKind, LevelDefinition, LevelEditorMetadata } from './level';

function uniqueTags(tags: string[]): string[] {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];
}

function inferredDifficulty(level: LevelDefinition): LevelEditorMetadata['difficulty'] {
  const kinds = new Set<HazardKind>(level.hazards.map((hazard) => hazard.kind));
  let score = 1;
  if (level.objective === 'reach') score += 1;
  if (level.hazards.length >= 3) score += 1;
  if (kinds.size >= 2) score += 1;
  if (level.maxInk <= 470 || level.surviveMs >= 15000) score += 1;
  return Math.min(5, score) as LevelEditorMetadata['difficulty'];
}

function inferredHint(level: LevelDefinition): string {
  if (level.objective === 'reach') {
    return '先規劃安全路線與出口方向，再用有限墨水補上防護。';
  }
  return '利用既有地形做支點，讓防護線把危險導離人物。';
}

export function ensureEditorMetadata(level: LevelDefinition): LevelDefinition {
  if (level.editor) {
    return {
      ...level,
      editor: {
        ...level.editor,
        tags: uniqueTags(level.editor.tags)
      }
    };
  }

  const hazardTags = level.hazards.map((hazard) => hazard.kind);
  const structuralTags = level.platforms?.length ? ['platform'] : [];
  const tags = uniqueTags([level.world, level.objective, ...hazardTags, ...structuralTags]);

  return {
    ...level,
    editor: {
      difficulty: inferredDifficulty(level),
      tags,
      hint: inferredHint(level)
    }
  };
}

export function ensureEditorMetadataForLevels(levels: LevelDefinition[]): LevelDefinition[] {
  return levels.map(ensureEditorMetadata);
}
