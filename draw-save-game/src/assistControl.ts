import { buildAssistStroke } from './game/assist';
import { levels } from './game/levels20';

const button = document.querySelector<HTMLButtonElement>('#assist-stroke');
let activeLevelIndex = 0;

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const levelButton = target.closest<HTMLElement>('[data-level-index]');
  if (!levelButton) return;
  const next = Number(levelButton.dataset.levelIndex);
  if (Number.isInteger(next) && next >= 0 && next < levels.length) activeLevelIndex = next;
});

function emitPointer(canvas: HTMLCanvasElement, type: string, x: number, y: number, buttons: number) {
  const rect = canvas.getBoundingClientRect();
  const clientX = rect.left + x / 420 * rect.width;
  const clientY = rect.top + y / 760 * rect.height;
  canvas.dispatchEvent(new PointerEvent(type, {
    bubbles: true,
    pointerId: 77,
    pointerType: 'mouse',
    isPrimary: true,
    buttons,
    clientX,
    clientY
  }));
}

button?.addEventListener('click', () => {
  const canvas = document.querySelector<HTMLCanvasElement>('#app canvas');
  if (!canvas) return;
  const stroke = buildAssistStroke(levels[activeLevelIndex]);
  const [first, ...rest] = stroke.points;
  if (!first) return;
  button.setAttribute('aria-label', `${stroke.label}：使用目前關卡墨水`);
  emitPointer(canvas, 'pointerdown', first.x, first.y, 1);
  for (const point of rest) emitPointer(canvas, 'pointermove', point.x, point.y, 1);
  const last = stroke.points.at(-1)!;
  emitPointer(canvas, 'pointerup', last.x, last.y, 0);
});
