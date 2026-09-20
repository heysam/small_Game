import { loadInventoryLedger } from './game/items';

const inkButton = document.querySelector<HTMLButtonElement>('#item-ink-refill');
const shieldButton = document.querySelector<HTMLButtonElement>('#item-shield');
const status = document.querySelector<HTMLElement>('#item-status');

type ItemStateDetail = {
  count: number;
  canUse: boolean;
  message?: string;
};

function render(detail?: ItemStateDetail): void {
  const ledger = loadInventoryLedger();
  const inkCount = detail?.count ?? ledger.items['ink-refill'];
  const shieldCount = ledger.items.shield;
  if (inkButton) {
    inkButton.textContent = `墨水補給 ×${inkCount}`;
    inkButton.disabled = detail ? !detail.canUse : inkCount <= 0;
    inkButton.setAttribute('aria-label', `墨水補給，剩餘 ${inkCount} 個；正式關卡危險啟動前可使用，每局最多一次`);
  }
  if (shieldButton) {
    shieldButton.textContent = `護盾 ×${shieldCount}`;
    shieldButton.disabled = true;
    shieldButton.setAttribute('aria-label', `護盾，剩餘 ${shieldCount} 個；戰鬥接線完成後可啟用`);
  }
  if (status) status.textContent = detail?.message ?? '正式關卡危險啟動前可使用；每局最多一次。';
}

inkButton?.addEventListener('click', () => {
  document.dispatchEvent(new CustomEvent('draw-save-game:use-item', { detail: { itemId: 'ink-refill' } }));
});

document.addEventListener('draw-save-game:item-state', (event) => {
  render((event as CustomEvent<ItemStateDetail>).detail);
});

render();
