import { emitResultFeedback } from './feedback';

export type ResultPanelState = {
  won: boolean;
  levelName: string;
  levelNumber: number;
  stars: 0 | 1 | 2 | 3;
  inkLeft: number;
  maxInk: number;
  isPreview: boolean;
  canGoNext: boolean;
  onRetry: () => void;
  onNext?: () => void;
};

let panel: HTMLElement | null = null;

function ensurePanel(): HTMLElement {
  if (panel) return panel;
  panel = document.createElement('section');
  panel.id = 'result-panel';
  panel.className = 'result-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'result-panel-title');
  document.body.append(panel);
  return panel;
}

export function hideResultPanel(): void {
  const element = ensurePanel();
  element.hidden = true;
  element.replaceChildren();
}

export function showResultPanel(state: ResultPanelState): void {
  const element = ensurePanel();
  const earnedStars = state.isPreview ? 0 : state.stars;
  const stars = `${'★'.repeat(earnedStars)}${'☆'.repeat(Math.max(0, 3 - earnedStars))}`;
  const inkLeft = Math.max(0, Math.round(state.inkLeft));
  const inkPercent = state.maxInk > 0 ? Math.round((inkLeft / state.maxInk) * 100) : 0;
  const heading = state.isPreview
    ? (state.won ? '預覽成功' : '預覽失敗')
    : (state.won ? '救援成功！' : '救援失敗');
  const detail = state.isPreview
    ? '這是 Level Editor 預覽，不會寫入正式進度。'
    : state.won
      ? `剩餘墨水 ${inkLeft} / ${state.maxInk}（${inkPercent}%）`
      : '調整畫線方式，再試一次。';

  element.innerHTML = `
    <div class="result-panel__card" data-result="${state.won ? 'won' : 'lost'}">
      <p class="result-panel__eyebrow">${state.isPreview ? 'EDITOR PREVIEW' : `LEVEL ${state.levelNumber}`}</p>
      <h2 id="result-panel-title">${heading}</h2>
      <p class="result-panel__level"></p>
      ${state.isPreview ? '' : `<div class="result-panel__stars" aria-label="${earnedStars} 星">${stars}</div>`}
      <p class="result-panel__detail">${detail}</p>
      <div class="result-panel__actions">
        <button type="button" data-result-action="retry">重新挑戰</button>
        ${state.won && state.canGoNext && !state.isPreview ? '<button type="button" class="primary" data-result-action="next">下一關</button>' : ''}
        <button type="button" data-result-action="levels">${state.isPreview ? '返回編輯器' : '關卡地圖'}</button>
      </div>
    </div>`;

  const levelText = element.querySelector<HTMLElement>('.result-panel__level');
  if (levelText) levelText.textContent = state.levelName;
  element.querySelector<HTMLButtonElement>('[data-result-action="retry"]')?.addEventListener('click', () => {
    hideResultPanel();
    state.onRetry();
  });
  element.querySelector<HTMLButtonElement>('[data-result-action="next"]')?.addEventListener('click', () => {
    hideResultPanel();
    state.onNext?.();
  });
  element.querySelector<HTMLButtonElement>('[data-result-action="levels"]')?.addEventListener('click', () => hideResultPanel());
  element.hidden = false;
  emitResultFeedback(state.won);
}
