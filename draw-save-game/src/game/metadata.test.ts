import { describe, expect, it } from 'vitest';
import { ensureEditorMetadata, ensureEditorMetadataForLevels } from './metadata';
import type { LevelDefinition } from './level';

const baseLevel: LevelDefinition = {
  id: 'test-01',
  name: 'Metadata test',
  world: 'city',
  objective: 'reach',
  surviveMs: 16000,
  maxInk: 450,
  gravityY: 0.6,
  hero: { x: 50, y: 50 },
  hazards: [
    { kind: 'orb', x: 100, y: 100, radius: 12, velocityX: 1, velocityY: 2 },
    { kind: 'chaser', x: 200, y: 100, radius: 12, speed: 1.4 },
    { kind: 'spike', x: 250, y: 600, radius: 14 }
  ],
  platforms: [{ kind: 'platform', x: 200, y: 500, width: 120, height: 20 }],
  target: { x: 350, y: 500, width: 80, height: 90 }
};

describe('level editor metadata completion', () => {
  it('derives deterministic metadata without mutating the source level', () => {
    const enriched = ensureEditorMetadata(baseLevel);
    expect(baseLevel.editor).toBeUndefined();
    expect(enriched.editor?.difficulty).toBe(5);
    expect(enriched.editor?.tags).toEqual(['city', 'reach', 'orb', 'chaser', 'spike', 'platform']);
    expect(enriched.editor?.hint).toMatch(/出口/);
  });

  it('preserves authored metadata while normalizing duplicate and blank tags', () => {
    const enriched = ensureEditorMetadata({
      ...baseLevel,
      editor: { difficulty: 3, tags: ['bridge', ' bridge ', ''], hint: 'custom hint' }
    });
    expect(enriched.editor).toEqual({ difficulty: 3, tags: ['bridge'], hint: 'custom hint' });
  });

  it('completes metadata for every level in a collection', () => {
    const levels = ensureEditorMetadataForLevels([baseLevel, { ...baseLevel, id: 'test-02', objective: 'survive', target: undefined }]);
    expect(levels).toHaveLength(2);
    expect(levels.every((level) => level.editor && level.editor.tags.length > 0)).toBe(true);
  });
});
