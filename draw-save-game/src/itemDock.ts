import { loadInventoryLedger } from './game/items';

const button = document.querySelector<HTMLButtonElement>('#item-ink-refill');
const status = document.querySelector<HTMLElement>('#item-status');

type ItemStateDetail = {
  count: number;
  canUse: boolean;
  message?: string;
};

function render(detail?: ItemStateDetail): void {
  const count = detail?.count ?? loadInventoryLedger().items['ink-refill'];
  if (button) {
    button.textContent = `墨水補給 ×${count}`;
    button.disabled = detail ? !detail.canUse : count <= 0;
    button.setAttribute(
      'aria-label',
      `墨水補給，剩餘 ${count} 個；正式關卡危險啟動前可使用，每局最多一次`
    );
  }
  if (status) {
    status.textContent = detail?.message ?? '正式關卡危險啟動前可使用；每局最多一次。';
  }
}

button?.addEventListener('click', () => {
  document.dispatchEvent(new CustomEvent('draw-save-game:use-item', {
    detail: { itemId: 'ink-refill' }
  }));
});

document.addEventListener('draw-save-game:item-state', (event) => {
  const detail = (event as CustomEvent<ItemStateDetail>).detail;
  render(detail);
});

render();
