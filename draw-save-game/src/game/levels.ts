import type { LevelDefinition } from './level';
import { validateLevel } from './level';

export const levels: LevelDefinition[] = [
  validateLevel({
    id: 'city-01',
    name: '屋頂初救援',
    objective: 'survive',
    surviveMs: 7000,
    maxInk: 560,
    gravityY: 0.65,
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
    id: 'city-02',
    name: '狹縫護盾',
    objective: 'survive',
    surviveMs: 8000,
    maxInk: 500,
    gravityY: 0.78,
    hero: { x: 120, y: 620 },
    hazards: [
      { kind: 'orb', x: 295, y: 190, radius: 18, velocityX: -2.0, velocityY: 3.4 },
      { kind: 'orb', x: 350, y: 235, radius: 14, velocityX: -2.4, velocityY: 2.8 },
      { kind: 'orb', x: 260, y: 270, radius: 15, velocityX: -1.7, velocityY: 3.6 },
      { kind: 'orb', x: 370, y: 310, radius: 13, velocityX: -2.1, velocityY: 2.7 }
    ]
  }),
  validateLevel({
    id: 'city-03',
    name: '中央包圍',
    objective: 'survive',
    surviveMs: 9000,
    maxInk: 470,
    gravityY: 0.55,
    hero: { x: 210, y: 520 },
    hazards: [
      { kind: 'orb', x: 75, y: 230, radius: 15, velocityX: 2.2, velocityY: 2.5 },
      { kind: 'orb', x: 345, y: 230, radius: 15, velocityX: -2.2, velocityY: 2.5 },
      { kind: 'orb', x: 110, y: 350, radius: 14, velocityX: 2.0, velocityY: 1.8 },
      { kind: 'orb', x: 310, y: 350, radius: 14, velocityX: -2.0, velocityY: 1.8 },
      { kind: 'orb', x: 210, y: 180, radius: 18, velocityX: 0, velocityY: 3.8 }
    ]
  })
];
