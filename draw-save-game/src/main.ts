import Phaser from 'phaser';
import './style.css';
import { mountLevelEditorPanel } from './editorPanel';
import { appendDrawPoint } from './game/draw';
import { fallingResetDue, fallingVelocity, laserPhaseAt, oscillatingOffset, velocityToward, type LaserPhase } from './game/hazard';
import { pointInsideTarget, type HazardKind, type LevelDefinition, type Point } from './game/level';
import { levels } from './game/levels20';
import { calculateStars, loadProgress, recordLevelResult, saveProgress } from './game/progress';
import { mountLevelSelect, refreshLevelSelect } from './levelSelect';
import { hideResultPanel, showResultPanel } from './resultPanel';

const WIDTH = 420;
const HEIGHT = 760;
const DRAW_MIN_DISTANCE = 7;
const LINE_WIDTH = 12;

type RuntimeHazard = {
  body: MatterJS.BodyType;
  kind: HazardKind;
  speed?: number;
  spawnX?: number;
  spawnY?: number;
  speedY?: number;
  driftX?: number;
  intervalMs?: number;
  nextResetAt?: number;
  axis?: 'x' | 'y';
  range?: number;
  moveSpeed?: number;
  phaseMs?: number;
  laserLength?: number;
  warningMs?: number;
  activeMs?: number;
  cooldownMs?: number;
  laserPhase?: LaserPhase;
  laserVisual?: Phaser.GameObjects.Rectangle;
};

class RescueScene extends Phaser.Scene {
  private levelIndex = 0;
  private level!: LevelDefinition;
  private customLevel?: LevelDefinition;
  private inkLeft = 0;
  private inkText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private drawing = false;
  private currentPoints: Point[] = [];
  private preview!: Phaser.GameObjects.Graphics;
  private hero!: MatterJS.BodyType;
  private hazards: RuntimeHazard[] = [];
  private roundStartedAt = 0;
  private targetEnteredAt = 0;
  private finished = false;

  constructor() {
    super('rescue');
  }

  init(data: { levelIndex?: number; customLevel?: LevelDefinition }) {
    this.levelIndex = Phaser.Math.Clamp(data.levelIndex ?? this.levelIndex, 0, levels.length - 1);
    this.customLevel = data.customLevel ? structuredClone(data.customLevel) : undefined;
    this.level = this.customLevel ?? levels[this.levelIndex];
    this.inkLeft = this.level.maxInk;
    this.drawing = false;
    this.currentPoints = [];
    this.hazards = [];
    this.roundStartedAt = 0;
    this.targetEnteredAt = 0;
    this.finished = false;
  }

  create() {
    hideResultPanel();
    const worldBackground = this.level.world === 'forest' ? '#dff4df' : this.level.world === 'cave' ? '#e5e0f2' : this.level.world === 'lab' ? '#e3f4f6' : this.level.world === 'harbor' ? '#deedf3' : '#d8f1ff';
    const groundColor = this.level.world === 'forest' ? 0x557c43 : this.level.world === 'cave' ? 0x5b526f : this.level.world === 'lab' ? 0x47747d : this.level.world === 'harbor' ? 0x496a78 : 0x6f9f4f;
    this.cameras.main.setBackgroundColor(worldBackground);
    this.matter.world.setGravity(0, this.level.gravityY);
    this.matter.world.setBounds(0, 0, WIDTH, HEIGHT, 48, true, true, true, true);

    this.add.rectangle(WIDTH / 2, HEIGHT - 55, WIDTH, 110, groundColor);
    this.add.text(22, 20, 'DRAW TO RESCUE', { fontFamily: 'system-ui', fontSize: '25px', color: '#172033', fontStyle: 'bold' });
    const levelLabel = this.customLevel ? `編輯預覽 · ${this.level.name}` : `第 ${this.levelIndex + 1} 關 · ${this.level.name}`;
    this.add.text(22, 53, levelLabel, { fontFamily: 'system-ui', fontSize: '15px', color: '#334155' });

    this.inkText = this.add.text(22, 90, '', { fontFamily: 'system-ui', fontSize: '16px', color: '#172033' });
    this.timerText = this.add.text(WIDTH - 22, 90, '', { fontFamily: 'system-ui', fontSize: '16px', color: '#172033' }).setOrigin(1, 0);
    const instruction = this.level.objective === 'reach'
      ? '畫路線，讓人物到達綠色出口'
      : this.level.objective === 'catch'
        ? '先畫承接線，把人物接在藍色救援區'
        : '按住並畫出防護線';
    this.statusText = this.add.text(WIDTH / 2, 130, instruction, { fontFamily: 'system-ui', fontSize: '18px', color: '#172033', align: 'center' }).setOrigin(0.5);
    this.preview = this.add.graphics();

    this.createPlatforms();
    this.createTargetZone();

    this.hero = this.matter.add.circle(this.level.hero.x, this.level.hero.y, 25, { restitution: 0.15, friction: 0.8, isStatic: this.level.objective === 'catch' });
    const heroVisual = this.add.circle(this.level.hero.x, this.level.hero.y, 25, 0xffcf66).setStrokeStyle(4, 0x172033);
    this.events.on('update', () => heroVisual.setPosition(this.hero.position.x, this.hero.position.y));

    const retryButton = this.add.text(WIDTH - 22, 20, '重試', { fontFamily: 'system-ui', fontSize: '17px', color: '#ffffff', backgroundColor: '#172033', padding: { x: 12, y: 7 } }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    retryButton.on('pointerup', () => this.scene.restart({ levelIndex: this.levelIndex, customLevel: this.customLevel }));

    const previousButton = this.add.text(22, HEIGHT - 40, '‹ 上一關', { fontFamily: 'system-ui', fontSize: '15px', color: '#ffffff', backgroundColor: '#334155', padding: { x: 10, y: 6 } }).setInteractive({ useHandCursor: true });
    previousButton.on('pointerup', () => this.switchLevel(-1));
    const nextButton = this.add.text(WIDTH - 22, HEIGHT - 40, '下一關 ›', { fontFamily: 'system-ui', fontSize: '15px', color: '#ffffff', backgroundColor: '#334155', padding: { x: 10, y: 6 } }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    nextButton.on('pointerup', () => this.switchLevel(1));

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.startDrawing(p));
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => this.continueDrawing(p));
    this.input.on('pointerup', () => this.finishDrawing());
    this.input.on('pointerupoutside', () => this.finishDrawing());

    const matterWorld = this.matter.world;
    matterWorld.on('collisionstart', this.onCollisionStart, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => matterWorld.off('collisionstart', this.onCollisionStart, this));

    this.refreshHud();
  }

  private createPlatforms() {
    for (const platform of this.level.platforms ?? []) {
      const view = this.add.rectangle(platform.x, platform.y, platform.width, platform.height, 0x64748b).setStrokeStyle(2, 0x334155);
      view.setRotation(platform.angle ?? 0);
      this.matter.add.gameObject(view, { isStatic: true, friction: 0.9, angle: platform.angle ?? 0 });
    }
  }

  private createTargetZone() {
    if (!this.level.target) return;
    const isCatch = this.level.objective === 'catch';
    const fill = isCatch ? 0x38bdf8 : 0x4ade80;
    const stroke = isCatch ? 0x0369a1 : 0x15803d;
    const textColor = isCatch ? '#075985' : '#166534';
    this.add.rectangle(this.level.target.x, this.level.target.y, this.level.target.width, this.level.target.height, fill, 0.28).setStrokeStyle(3, stroke);
    this.add.text(this.level.target.x, this.level.target.y, isCatch ? '救援區' : '出口', { fontFamily: 'system-ui', fontSize: '16px', color: textColor, fontStyle: 'bold' }).setOrigin(0.5);
  }

  private switchLevel(delta: number) {
    const nextIndex = Phaser.Math.Wrap(this.levelIndex + delta, 0, levels.length);
    this.scene.restart({ levelIndex: nextIndex });
  }

  private startDrawing(pointer: Phaser.Input.Pointer) {
    if (this.roundStartedAt || this.finished || pointer.y < 150 || pointer.y > HEIGHT - 90) return;
    this.drawing = true;
    this.currentPoints = [{ x: pointer.x, y: pointer.y }];
    this.preview.clear();
  }

  private continueDrawing(pointer: Phaser.Input.Pointer) {
    if (!this.drawing || this.inkLeft <= 0) return;
    const last = this.currentPoints.at(-1)!;
    const step = appendDrawPoint(last, { x: pointer.x, y: pointer.y }, this.inkLeft, DRAW_MIN_DISTANCE);
    if (!step.accepted) return;
    this.currentPoints.push(step.next);
    this.inkLeft = step.inkLeft;
    this.drawPreview();
    this.refreshHud();
    if (this.inkLeft <= 0) this.finishDrawing();
  }

  private drawPreview() {
    this.preview.clear().lineStyle(LINE_WIDTH, 0x172033, 1).beginPath();
    const first = this.currentPoints[0];
    this.preview.moveTo(first.x, first.y);
    for (const point of this.currentPoints.slice(1)) this.preview.lineTo(point.x, point.y);
    this.preview.strokePath();
  }

  private finishDrawing() {
    if (!this.drawing) return;
    this.drawing = false;
    if (this.currentPoints.length < 2) return;

    for (let i = 1; i < this.currentPoints.length; i++) {
      const a = this.currentPoints[i - 1];
      const b = this.currentPoints[i];
      const length = Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
      const angle = Phaser.Math.Angle.Between(a.x, a.y, b.x, b.y);
      const body = this.add.rectangle((a.x + b.x) / 2, (a.y + b.y) / 2, length + 4, LINE_WIDTH, 0x172033).setRotation(angle);
      this.matter.add.gameObject(body, { isStatic: true, friction: 0.8 });
    }
    this.preview.clear();
    if (this.level.objective === 'catch') this.matter.body.setStatic(this.hero, false);
    this.statusText.setText(this.level.objective === 'reach' ? '前往出口！' : this.level.objective === 'catch' ? '接住人物！' : '危險開始！');
    this.roundStartedAt = this.time.now;
    this.spawnHazards();
  }

  private spawnHazards() {
    for (const spawn of this.level.hazards) {
      const isLaser = spawn.kind === 'laser';
      const restitution = spawn.kind === 'orb' ? 0.95 : spawn.kind === 'falling' ? 0.05 : spawn.kind === 'spike' || spawn.kind === 'mover' || isLaser ? 0 : 0.2;
      const frictionAir = spawn.kind === 'orb' ? 0.005 : spawn.kind === 'falling' ? 0.015 : spawn.kind === 'spike' || spawn.kind === 'mover' || isLaser ? 0 : 0.08;
      const hazard = isLaser
        ? this.matter.add.rectangle(spawn.x, spawn.y, spawn.axis === 'x' ? spawn.length : spawn.radius * 2, spawn.axis === 'y' ? spawn.length : spawn.radius * 2, { isStatic: true, isSensor: true })
        : this.matter.add.circle(spawn.x, spawn.y, spawn.radius, { restitution, frictionAir, isStatic: spawn.kind === 'spike' || spawn.kind === 'mover' });
      if (spawn.kind === 'orb') this.matter.body.setVelocity(hazard, { x: spawn.velocityX, y: spawn.velocityY });
      if (spawn.kind === 'falling') this.matter.body.setVelocity(hazard, fallingVelocity(spawn.speedY, spawn.driftX));
      if (isLaser) this.matter.body.setPosition(hazard, { x: -1000, y: -1000 });

      if (isLaser) {
        const width = spawn.axis === 'x' ? spawn.length : spawn.radius * 2;
        const height = spawn.axis === 'y' ? spawn.length : spawn.radius * 2;
        const laserVisual = this.add.rectangle(spawn.x, spawn.y, width, height, 0xf59e0b, 0.35).setStrokeStyle(2, 0xb45309);
        this.add.text(spawn.x, spawn.y - (spawn.axis === 'x' ? 18 : 0), 'LASER', { fontFamily: 'system-ui', fontSize: '11px', color: '#7c2d12', fontStyle: 'bold' }).setOrigin(0.5);
        this.hazards.push({
          body: hazard,
          kind: spawn.kind,
          spawnX: spawn.x,
          spawnY: spawn.y,
          axis: spawn.axis,
          phaseMs: spawn.phaseMs ?? 0,
          laserLength: spawn.length,
          warningMs: spawn.warningMs,
          activeMs: spawn.activeMs,
          cooldownMs: spawn.cooldownMs,
          laserPhase: 'warning',
          laserVisual
        });
        continue;
      }

      const fillColor = spawn.kind === 'chaser' ? 0x8b5cf6 : spawn.kind === 'falling' ? 0xf59e0b : spawn.kind === 'spike' ? 0xdc2626 : spawn.kind === 'mover' ? 0x0891b2 : 0xff5d73;
      const strokeColor = spawn.kind === 'chaser' ? 0x4c1d95 : spawn.kind === 'falling' ? 0x92400e : spawn.kind === 'spike' ? 0x7f1d1d : spawn.kind === 'mover' ? 0x164e63 : 0x7f1d1d;
      const visual = this.add.circle(spawn.x, spawn.y, spawn.radius, fillColor).setStrokeStyle(3, strokeColor);
      if (spawn.kind === 'chaser') this.add.text(spawn.x, spawn.y, '◉', { fontFamily: 'system-ui', fontSize: `${Math.max(14, spawn.radius)}px`, color: '#ffffff' }).setOrigin(0.5);
      if (spawn.kind === 'falling') this.add.text(spawn.x, spawn.y, '◆', { fontFamily: 'system-ui', fontSize: `${Math.max(12, spawn.radius - 2)}px`, color: '#fff7ed' }).setOrigin(0.5);
      if (spawn.kind === 'spike') this.add.text(spawn.x, spawn.y, '▲', { fontFamily: 'system-ui', fontSize: `${Math.max(14, spawn.radius + 2)}px`, color: '#fee2e2' }).setOrigin(0.5);
      if (spawn.kind === 'mover') {
        const marker = this.add.text(spawn.x, spawn.y, spawn.axis === 'x' ? '↔' : '↕', { fontFamily: 'system-ui', fontSize: `${Math.max(14, spawn.radius)}px`, color: '#ecfeff', fontStyle: 'bold' }).setOrigin(0.5);
        this.events.on('update', () => marker.setPosition(hazard.position.x, hazard.position.y));
      }
      this.events.on('update', () => visual.setPosition(hazard.position.x, hazard.position.y));
      this.hazards.push({
        body: hazard,
        kind: spawn.kind,
        speed: spawn.kind === 'chaser' ? spawn.speed : undefined,
        spawnX: spawn.kind === 'falling' || spawn.kind === 'mover' ? spawn.x : undefined,
        spawnY: spawn.kind === 'falling' || spawn.kind === 'mover' ? spawn.y : undefined,
        speedY: spawn.kind === 'falling' ? spawn.speedY : undefined,
        driftX: spawn.kind === 'falling' ? (spawn.driftX ?? 0) : undefined,
        intervalMs: spawn.kind === 'falling' ? spawn.intervalMs : undefined,
        nextResetAt: spawn.kind === 'falling' ? this.time.now + spawn.intervalMs : undefined,
        axis: spawn.kind === 'mover' ? spawn.axis : undefined,
        range: spawn.kind === 'mover' ? spawn.range : undefined,
        moveSpeed: spawn.kind === 'mover' ? spawn.speed : undefined,
        phaseMs: spawn.kind === 'mover' ? (spawn.phaseMs ?? 0) : undefined
      });
    }
  }

  private onCollisionStart(event: Phaser.Physics.Matter.Events.CollisionStartEvent) {
    for (const pair of event.pairs) {
      const hitHero = pair.bodyA === this.hero || pair.bodyB === this.hero;
      const other = pair.bodyA === this.hero ? pair.bodyB : pair.bodyA;
      if (hitHero && this.hazards.some((hazard) => hazard.body === other)) this.finishRound(false);
    }
  }

  update(time: number) {
    if (!this.roundStartedAt || this.finished) return;

    const elapsed = time - this.roundStartedAt;
    for (const hazard of this.hazards) {
      if (hazard.kind === 'chaser') {
        const velocity = velocityToward(hazard.body.position, this.hero.position, hazard.speed ?? 1.5);
        this.matter.body.setVelocity(hazard.body, velocity);
      }
      if (hazard.kind === 'falling' && fallingResetDue(time, hazard.nextResetAt ?? Number.POSITIVE_INFINITY)) {
        this.matter.body.setPosition(hazard.body, { x: hazard.spawnX ?? hazard.body.position.x, y: hazard.spawnY ?? 100 });
        this.matter.body.setVelocity(hazard.body, fallingVelocity(hazard.speedY ?? 2.5, hazard.driftX ?? 0));
        hazard.nextResetAt = time + (hazard.intervalMs ?? 2500);
      }
      if (hazard.kind === 'mover') {
        const offset = oscillatingOffset(elapsed + (hazard.phaseMs ?? 0), hazard.range ?? 60, hazard.moveSpeed ?? 70);
        const x = (hazard.spawnX ?? hazard.body.position.x) + (hazard.axis === 'x' ? offset : 0);
        const y = (hazard.spawnY ?? hazard.body.position.y) + (hazard.axis === 'y' ? offset : 0);
        this.matter.body.setPosition(hazard.body, { x, y });
      }
      if (hazard.kind === 'laser') {
        const phase = laserPhaseAt(elapsed, hazard.warningMs ?? 900, hazard.activeMs ?? 700, hazard.cooldownMs ?? 1500, hazard.phaseMs ?? 0);
        if (phase !== hazard.laserPhase) hazard.laserPhase = phase;
        const active = phase === 'active';
        this.matter.body.setPosition(hazard.body, active ? { x: hazard.spawnX ?? 0, y: hazard.spawnY ?? 0 } : { x: -1000, y: -1000 });
        const fill = active ? 0xef4444 : phase === 'warning' ? 0xf59e0b : 0x94a3b8;
        const stroke = active ? 0x991b1b : phase === 'warning' ? 0xb45309 : 0x475569;
        const alpha = active ? 0.9 : phase === 'warning' ? 0.4 : 0.12;
        hazard.laserVisual?.setFillStyle(fill, alpha).setStrokeStyle(2, stroke, Math.max(alpha, 0.35));
      }
    }

    const remaining = Math.max(0, this.level.surviveMs - elapsed);
    this.timerText.setText(`${(remaining / 1000).toFixed(1)}s`);

    if (this.level.objective === 'survive') {
      if (elapsed >= this.level.surviveMs) this.finishRound(true);
      return;
    }

    const target = this.level.target!;
    if (pointInsideTarget(this.hero.position, target)) {
      if (!this.targetEnteredAt) this.targetEnteredAt = time;
      const heldMs = time - this.targetEnteredAt;
      const neededMs = target.holdMs ?? 700;
      const label = this.level.objective === 'catch' ? '救援區穩定' : '出口確認';
      this.statusText.setText(`${label} ${(Math.min(heldMs, neededMs) / neededMs * 100).toFixed(0)}%`);
      if (heldMs >= neededMs) this.finishRound(true);
    } else {
      this.targetEnteredAt = 0;
    }
    if (elapsed >= this.level.surviveMs) this.finishRound(false);
  }

  private finishRound(won: boolean) {
    if (this.finished) return;
    this.finished = true;
    let stars: 0 | 1 | 2 | 3 = 0;
    if (won && !this.customLevel) {
      stars = calculateStars(this.inkLeft, this.level.maxInk);
      const current = loadProgress(levels.length);
      const next = recordLevelResult(current, this.level.id, this.levelIndex, levels.length, {
        completed: true,
        stars,
        bestInkLeft: Math.max(0, Math.round(this.inkLeft))
      });
      saveProgress(next);
      refreshLevelSelect(levels);
    }
    this.statusText.setText(won ? `救援成功 ${this.customLevel ? '' : '★'.repeat(stars)}` : '救援失敗');
    this.hazards.forEach((hazard) => this.matter.body.setStatic(hazard.body, true));
    if (this.level.objective === 'catch') this.matter.body.setStatic(this.hero, true);

    showResultPanel({
      won,
      levelName: this.level.name,
      levelNumber: this.levelIndex + 1,
      stars,
      inkLeft: this.inkLeft,
      maxInk: this.level.maxInk,
      isPreview: Boolean(this.customLevel),
      canGoNext: won && !this.customLevel && this.levelIndex < levels.length - 1,
      onRetry: () => this.scene.restart({ levelIndex: this.levelIndex, customLevel: this.customLevel }),
      onNext: () => this.scene.restart({ levelIndex: this.levelIndex + 1 })
    });
  }

  private refreshHud() {
    this.inkText.setText(`墨水 ${Math.ceil(this.inkLeft)} / ${this.level.maxInk}`);
    if (!this.roundStartedAt) this.timerText.setText(`${(this.level.surviveMs / 1000).toFixed(1)}s`);
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#d8f1ff',
  physics: { default: 'matter', matter: { gravity: { x: 0, y: 0.65 }, debug: false } },
  scene: [RescueScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }
});

mountLevelSelect({
  levels,
  onSelect: (_level, levelIndex) => {
    const scene = game.scene.getScene('rescue');
    scene.scene.restart({ levelIndex });
  }
});

mountLevelEditorPanel({
  levels,
  onPreview: (level, levelIndex) => {
    const scene = game.scene.getScene('rescue');
    scene.scene.restart({ levelIndex, customLevel: level });
  }
});