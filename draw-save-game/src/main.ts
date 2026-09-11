import Phaser from 'phaser';
import './style.css';

const WIDTH = 420;
const HEIGHT = 760;
const MAX_INK = 560;
const SURVIVE_MS = 7000;

type Point = { x: number; y: number };

class RescueScene extends Phaser.Scene {
  private inkLeft = MAX_INK;
  private inkText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private drawing = false;
  private currentPoints: Point[] = [];
  private preview!: Phaser.GameObjects.Graphics;
  private hero!: MatterJS.SpriteType;
  private hazards: MatterJS.SpriteType[] = [];
  private roundStartedAt = 0;
  private finished = false;

  constructor() {
    super('rescue');
  }

  create() {
    this.cameras.main.setBackgroundColor('#d8f1ff');
    this.matter.world.setBounds(0, 0, WIDTH, HEIGHT, 48, true, true, true, true);

    this.add.rectangle(WIDTH / 2, HEIGHT - 55, WIDTH, 110, 0x6f9f4f);
    this.add.text(22, 20, 'DRAW TO RESCUE', { fontFamily: 'system-ui', fontSize: '25px', color: '#172033', fontStyle: 'bold' });
    this.add.text(22, 53, '畫線保護角色，撐過 7 秒即可過關', { fontFamily: 'system-ui', fontSize: '15px', color: '#334155' });

    this.inkText = this.add.text(22, 90, '', { fontFamily: 'system-ui', fontSize: '16px', color: '#172033' });
    this.timerText = this.add.text(WIDTH - 22, 90, '', { fontFamily: 'system-ui', fontSize: '16px', color: '#172033' }).setOrigin(1, 0);
    this.statusText = this.add.text(WIDTH / 2, 130, '按住並畫出防護線', { fontFamily: 'system-ui', fontSize: '18px', color: '#172033' }).setOrigin(0.5);
    this.preview = this.add.graphics();

    this.hero = this.matter.add.sprite(WIDTH / 2, HEIGHT - 140, undefined, undefined, { shape: { type: 'circle', radius: 25 }, restitution: 0.25 });
    this.hero.setCircle(25).setBounce(0.15).setFriction(0.8);
    const heroVisual = this.add.circle(WIDTH / 2, HEIGHT - 140, 25, 0xffcf66).setStrokeStyle(4, 0x172033);
    this.events.on('update', () => heroVisual.setPosition(this.hero.x, this.hero.y));

    const resetButton = this.add.text(WIDTH - 22, 20, '重試', { fontFamily: 'system-ui', fontSize: '17px', color: '#ffffff', backgroundColor: '#172033', padding: { x: 12, y: 7 } }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    resetButton.on('pointerup', () => this.scene.restart());

    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => this.startDrawing(p));
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => this.continueDrawing(p));
    this.input.on('pointerup', () => this.finishDrawing());
    this.input.on('pointerupoutside', () => this.finishDrawing());

    this.refreshHud();
  }

  private startDrawing(pointer: Phaser.Input.Pointer) {
    if (this.roundStartedAt || this.finished || pointer.y < 150) return;
    this.drawing = true;
    this.currentPoints = [{ x: pointer.x, y: pointer.y }];
    this.preview.clear();
  }

  private continueDrawing(pointer: Phaser.Input.Pointer) {
    if (!this.drawing || this.inkLeft <= 0) return;
    const last = this.currentPoints.at(-1)!;
    const distance = Phaser.Math.Distance.Between(last.x, last.y, pointer.x, pointer.y);
    if (distance < 7) return;
    const accepted = Math.min(distance, this.inkLeft);
    const ratio = accepted / distance;
    const next = { x: last.x + (pointer.x - last.x) * ratio, y: last.y + (pointer.y - last.y) * ratio };
    this.currentPoints.push(next);
    this.inkLeft -= accepted;
    this.drawPreview();
    this.refreshHud();
    if (this.inkLeft <= 0) this.finishDrawing();
  }

  private drawPreview() {
    this.preview.clear().lineStyle(12, 0x172033, 1).beginPath();
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
      const body = this.add.rectangle((a.x + b.x) / 2, (a.y + b.y) / 2, length + 4, 12, 0x172033).setRotation(angle);
      this.matter.add.gameObject(body, { isStatic: true, friction: 0.8 });
    }
    this.preview.clear();
    this.statusText.setText('危險開始！');
    this.roundStartedAt = this.time.now;
    this.spawnHazards();
  }

  private spawnHazards() {
    for (let i = 0; i < 5; i++) {
      const hazard = this.matter.add.sprite(55 + i * 78, 205 + (i % 2) * 32, undefined, undefined, { shape: { type: 'circle', radius: 16 }, restitution: 0.9 });
      hazard.setCircle(16).setBounce(0.95).setFrictionAir(0.005).setVelocity(Phaser.Math.Between(-2, 2), Phaser.Math.Between(2, 4));
      const visual = this.add.circle(hazard.x, hazard.y, 16, 0xff5d73).setStrokeStyle(3, 0x7f1d1d);
      this.events.on('update', () => visual.setPosition(hazard.x, hazard.y));
      this.hazards.push(hazard);
    }

    this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
      for (const pair of event.pairs) {
        const heroBody = this.hero.body as MatterJS.BodyType;
        const hitHero = pair.bodyA === heroBody || pair.bodyB === heroBody;
        const other = pair.bodyA === heroBody ? pair.bodyB : pair.bodyA;
        if (hitHero && this.hazards.some((h) => h.body === other)) this.finishRound(false);
      }
    });
  }

  update(time: number) {
    if (!this.roundStartedAt || this.finished) return;
    const elapsed = time - this.roundStartedAt;
    if (elapsed >= SURVIVE_MS) this.finishRound(true);
    this.timerText.setText(`${Math.max(0, (SURVIVE_MS - elapsed) / 1000).toFixed(1)}s`);
  }

  private finishRound(won: boolean) {
    if (this.finished) return;
    this.finished = true;
    this.statusText.setText(won ? '救援成功 ★★★' : '受到攻擊，點右上角重試');
    this.hazards.forEach((h) => h.setStatic(true));
  }

  private refreshHud() {
    this.inkText.setText(`墨水 ${Math.ceil(this.inkLeft)} / ${MAX_INK}`);
    if (!this.roundStartedAt) this.timerText.setText('7.0s');
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#d8f1ff',
  physics: { default: 'matter', matter: { gravity: { x: 0, y: 0.65 }, debug: false } },
  scene: [RescueScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH }
});
