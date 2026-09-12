import { levels as baseLevels } from './levels';
import { validateLevel, type LevelDefinition } from './level';
import { ensureEditorMetadataForLevels } from './metadata';

export const expansionLevels: LevelDefinition[] = [
  validateLevel({
    id: 'lab-04', name: '尖刺緩衝區', world: 'lab', objective: 'survive', surviveMs: 10500, maxInk: 455, gravityY: 0.62,
    hero: { x: 210, y: 600 },
    platforms: [
      { kind: 'platform', x: 100, y: 500, width: 120, height: 18, angle: 0.12 },
      { kind: 'platform', x: 320, y: 500, width: 120, height: 18, angle: -0.12 }
    ],
    hazards: [
      { kind: 'spike', x: 115, y: 625, radius: 18 },
      { kind: 'spike', x: 305, y: 625, radius: 18 },
      { kind: 'chaser', x: 210, y: 230, radius: 15, speed: 1.45 }
    ],
    editor: { difficulty: 3, tags: ['spike', 'chaser', 'survive'], hint: '用斜線把追蹤體導開，同時不要把人物推向尖刺。' }
  }),
  validateLevel({
    id: 'lab-05', name: '紅區撤離', world: 'lab', objective: 'reach', surviveMs: 17000, maxInk: 525, gravityY: 0.58,
    hero: { x: 72, y: 590 }, target: { x: 350, y: 545, width: 86, height: 100, holdMs: 900 },
    platforms: [
      { kind: 'platform', x: 90, y: 640, width: 130, height: 20 },
      { kind: 'platform', x: 330, y: 640, width: 145, height: 20 }
    ],
    hazards: [
      { kind: 'spike', x: 205, y: 625, radius: 20 },
      { kind: 'spike', x: 250, y: 625, radius: 20 },
      { kind: 'falling', x: 225, y: 120, radius: 14, speedY: 3.1, driftX: 0.15, intervalMs: 2700 }
    ],
    editor: { difficulty: 4, tags: ['spike', 'falling', 'reach'], hint: '畫橋跨過紅區，再加一小段遮棚擋住落物。' }
  }),
  validateLevel({
    id: 'harbor-01', name: '碼頭護欄', world: 'harbor', objective: 'survive', surviveMs: 11000, maxInk: 470, gravityY: 0.66,
    hero: { x: 210, y: 600 },
    platforms: [
      { kind: 'platform', x: 210, y: 530, width: 150, height: 18 },
      { kind: 'platform', x: 80, y: 430, width: 100, height: 18, angle: 0.15 }
    ],
    hazards: [
      { kind: 'spike', x: 75, y: 625, radius: 18 },
      { kind: 'orb', x: 345, y: 190, radius: 16, velocityX: -2.0, velocityY: 3.1 },
      { kind: 'falling', x: 255, y: 110, radius: 15, speedY: 3.2, driftX: -0.2, intervalMs: 2600 }
    ],
    editor: { difficulty: 3, tags: ['spike', 'orb', 'harbor'], hint: '讓防護線靠平台受力，不要封死人物周圍。' }
  }),
  validateLevel({
    id: 'harbor-02', name: '貨櫃跨越', world: 'harbor', objective: 'reach', surviveMs: 18000, maxInk: 555, gravityY: 0.6,
    hero: { x: 65, y: 600 }, target: { x: 350, y: 300, width: 90, height: 105, holdMs: 950 },
    platforms: [
      { kind: 'platform', x: 85, y: 645, width: 130, height: 20 },
      { kind: 'platform', x: 215, y: 515, width: 115, height: 18 },
      { kind: 'platform', x: 345, y: 385, width: 125, height: 18 }
    ],
    hazards: [
      { kind: 'spike', x: 150, y: 625, radius: 17 },
      { kind: 'spike', x: 280, y: 625, radius: 17 },
      { kind: 'chaser', x: 345, y: 570, radius: 14, speed: 1.35 }
    ],
    editor: { difficulty: 4, tags: ['bridge', 'spike', 'reach'], hint: '把有限墨水分成兩段斜坡，避開底部尖刺。' }
  }),
  validateLevel({
    id: 'harbor-03', name: '暴風裝卸區', world: 'harbor', objective: 'survive', surviveMs: 12000, maxInk: 515, gravityY: 0.7,
    hero: { x: 210, y: 585 },
    platforms: [
      { kind: 'platform', x: 105, y: 520, width: 125, height: 18, angle: 0.08 },
      { kind: 'platform', x: 315, y: 480, width: 125, height: 18, angle: -0.12 }
    ],
    hazards: [
      { kind: 'spike', x: 210, y: 625, radius: 19 },
      { kind: 'falling', x: 95, y: 120, radius: 15, speedY: 3.3, driftX: 0.4, intervalMs: 2400 },
      { kind: 'falling', x: 330, y: 145, radius: 16, speedY: 3.0, driftX: -0.35, intervalMs: 2900 },
      { kind: 'chaser', x: 355, y: 250, radius: 14, speed: 1.35 }
    ],
    editor: { difficulty: 5, tags: ['mixed', 'spike', 'falling', 'chaser'], hint: '用既有平台做支點，形成高低兩層導流結構。' }
  })
];

export const levels: LevelDefinition[] = ensureEditorMetadataForLevels([...baseLevels, ...expansionLevels]);
