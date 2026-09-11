import type { LevelDefinition } from './level';
import { validateLevel } from './level';

export const levels: LevelDefinition[] = [
  validateLevel({
    id: 'city-01', name: '屋頂初救援', world: 'city', objective: 'survive', surviveMs: 7000, maxInk: 560, gravityY: 0.65,
    hero: { x: 210, y: 620 },
    hazards: [
      { kind: 'orb', x: 70, y: 210, radius: 16, velocityX: 1.4, velocityY: 3.2 },
      { kind: 'orb', x: 150, y: 250, radius: 16, velocityX: -1.1, velocityY: 3.4 },
      { kind: 'orb', x: 230, y: 215, radius: 16, velocityX: 1.2, velocityY: 3.0 },
      { kind: 'orb', x: 310, y: 250, radius: 16, velocityX: -1.3, velocityY: 3.5 },
      { kind: 'orb', x: 380, y: 215, radius: 16, velocityX: -1.0, velocityY: 3.1 }
    ]
  }),
  validateLevel({
    id: 'city-02', name: '狹縫護盾', world: 'city', objective: 'survive', surviveMs: 8000, maxInk: 500, gravityY: 0.78,
    hero: { x: 120, y: 620 },
    platforms: [{ kind: 'platform', x: 300, y: 500, width: 180, height: 20, angle: -0.08 }],
    hazards: [
      { kind: 'orb', x: 295, y: 190, radius: 18, velocityX: -2.0, velocityY: 3.4 },
      { kind: 'orb', x: 350, y: 235, radius: 14, velocityX: -2.4, velocityY: 2.8 },
      { kind: 'orb', x: 260, y: 270, radius: 15, velocityX: -1.7, velocityY: 3.6 },
      { kind: 'orb', x: 370, y: 310, radius: 13, velocityX: -2.1, velocityY: 2.7 }
    ]
  }),
  validateLevel({
    id: 'city-03', name: '中央包圍', world: 'city', objective: 'survive', surviveMs: 9000, maxInk: 470, gravityY: 0.55,
    hero: { x: 210, y: 520 },
    platforms: [
      { kind: 'platform', x: 105, y: 615, width: 125, height: 18, angle: 0.08 },
      { kind: 'platform', x: 315, y: 615, width: 125, height: 18, angle: -0.08 }
    ],
    hazards: [
      { kind: 'orb', x: 75, y: 230, radius: 15, velocityX: 2.2, velocityY: 2.5 },
      { kind: 'orb', x: 345, y: 230, radius: 15, velocityX: -2.2, velocityY: 2.5 },
      { kind: 'orb', x: 110, y: 350, radius: 14, velocityX: 2.0, velocityY: 1.8 },
      { kind: 'orb', x: 310, y: 350, radius: 14, velocityX: -2.0, velocityY: 1.8 },
      { kind: 'orb', x: 210, y: 180, radius: 18, velocityX: 0, velocityY: 3.8 }
    ]
  }),
  validateLevel({
    id: 'city-04', name: '跨橋撤離', world: 'city', objective: 'reach', surviveMs: 12000, maxInk: 430, gravityY: 0.68,
    hero: { x: 85, y: 560 }, target: { x: 345, y: 535, width: 86, height: 95, holdMs: 800 },
    platforms: [
      { kind: 'platform', x: 90, y: 620, width: 125, height: 22 },
      { kind: 'platform', x: 335, y: 620, width: 125, height: 22 }
    ],
    hazards: [{ kind: 'orb', x: 210, y: 230, radius: 17, velocityX: 0.4, velocityY: 3.4 }]
  }),
  validateLevel({
    id: 'city-05', name: '追跡警報', world: 'city', objective: 'survive', surviveMs: 8500, maxInk: 455, gravityY: 0.58,
    hero: { x: 210, y: 600 },
    platforms: [
      { kind: 'platform', x: 105, y: 520, width: 120, height: 18, angle: 0.12 },
      { kind: 'platform', x: 315, y: 520, width: 120, height: 18, angle: -0.12 }
    ],
    hazards: [
      { kind: 'chaser', x: 65, y: 215, radius: 17, speed: 1.75 },
      { kind: 'orb', x: 350, y: 195, radius: 14, velocityX: -1.4, velocityY: 3.0 }
    ]
  }),
  validateLevel({
    id: 'forest-01', name: '樹根防線', world: 'forest', objective: 'survive', surviveMs: 8500, maxInk: 520, gravityY: 0.72,
    hero: { x: 210, y: 585 },
    platforms: [
      { kind: 'platform', x: 95, y: 500, width: 150, height: 18, angle: 0.18 },
      { kind: 'platform', x: 325, y: 460, width: 145, height: 18, angle: -0.2 }
    ],
    hazards: [
      { kind: 'orb', x: 75, y: 180, radius: 14, velocityX: 2.0, velocityY: 2.9 },
      { kind: 'orb', x: 345, y: 190, radius: 16, velocityX: -2.2, velocityY: 3.1 },
      { kind: 'orb', x: 215, y: 145, radius: 13, velocityX: 0.7, velocityY: 3.6 }
    ]
  }),
  validateLevel({
    id: 'forest-02', name: '藤蔓出口', world: 'forest', objective: 'reach', surviveMs: 14000, maxInk: 470, gravityY: 0.62,
    hero: { x: 75, y: 590 }, target: { x: 345, y: 315, width: 90, height: 105, holdMs: 900 },
    platforms: [
      { kind: 'platform', x: 105, y: 640, width: 145, height: 20 },
      { kind: 'platform', x: 250, y: 515, width: 120, height: 18, angle: -0.2 },
      { kind: 'platform', x: 345, y: 390, width: 110, height: 18 }
    ],
    hazards: [
      { kind: 'orb', x: 300, y: 180, radius: 14, velocityX: -1.5, velocityY: 2.8 },
      { kind: 'orb', x: 365, y: 210, radius: 13, velocityX: -1.8, velocityY: 2.5 }
    ]
  }),
  validateLevel({
    id: 'forest-03', name: '獵影出口', world: 'forest', objective: 'reach', surviveMs: 15000, maxInk: 500, gravityY: 0.6,
    hero: { x: 70, y: 605 }, target: { x: 350, y: 270, width: 92, height: 105, holdMs: 950 },
    platforms: [
      { kind: 'platform', x: 95, y: 645, width: 135, height: 20 },
      { kind: 'platform', x: 220, y: 525, width: 115, height: 18, angle: -0.16 },
      { kind: 'platform', x: 340, y: 350, width: 120, height: 18 }
    ],
    hazards: [
      { kind: 'chaser', x: 360, y: 585, radius: 16, speed: 1.55 },
      { kind: 'orb', x: 205, y: 185, radius: 13, velocityX: 0.6, velocityY: 2.7 }
    ]
  }),
  validateLevel({
    id: 'cave-01', name: '洞窟夾擊', world: 'cave', objective: 'survive', surviveMs: 9500, maxInk: 485, gravityY: 0.5,
    hero: { x: 210, y: 575 },
    platforms: [
      { kind: 'platform', x: 85, y: 450, width: 120, height: 20, angle: 0.1 },
      { kind: 'platform', x: 335, y: 450, width: 120, height: 20, angle: -0.1 }
    ],
    hazards: [
      { kind: 'chaser', x: 60, y: 210, radius: 16, speed: 1.65 },
      { kind: 'chaser', x: 360, y: 210, radius: 16, speed: 1.65 },
      { kind: 'orb', x: 210, y: 145, radius: 15, velocityX: 0, velocityY: 3.2 }
    ]
  }),
  validateLevel({
    id: 'cave-02', name: '地下逃生線', world: 'cave', objective: 'reach', surviveMs: 15500, maxInk: 520, gravityY: 0.54,
    hero: { x: 72, y: 600 }, target: { x: 350, y: 540, width: 86, height: 100, holdMs: 900 },
    platforms: [
      { kind: 'platform', x: 92, y: 645, width: 140, height: 20 },
      { kind: 'platform', x: 210, y: 540, width: 105, height: 18, angle: 0.12 },
      { kind: 'platform', x: 340, y: 610, width: 125, height: 20 }
    ],
    hazards: [
      { kind: 'chaser', x: 245, y: 205, radius: 17, speed: 1.45 },
      { kind: 'orb', x: 330, y: 175, radius: 14, velocityX: -1.0, velocityY: 2.8 }
    ]
  })
];
