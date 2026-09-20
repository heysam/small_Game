import { loadInventoryLedger, type InventoryItemId } from './game/items';

const inkButton = document.querySelector<HTMLButtonElement>('#item-ink-refill');
const shieldButton = document.querySelector<HTMLButtonElement>('#item-shield');
const status = document.querySelector<HTMLElement>('#item-status');

type ItemStateDetail = {
  counts: Record<InventoryItemId, number>;
  canUseInkRefill: boolean;
  canUseShield: boolean;
  shieldArmed: boolean;
  message?: string;
};

function render(detail?: ItemStateDetail): void {
  const ledger = loadInventoryLedger();
  const inkCount = detail?.counts['ink-refill'] ?? ledger.items['ink-refill'];
  const shieldCount = detail?.counts.shield ?? ledger.items.shield;
  if (inkButton) {
    inkButton.textContent = `墨水補給 ×${inkCount}`;
    inkButton.disabled = detail ? !detail.canUseInkRefill : inkCount <= 0;
    inkButton.setAttribute('aria-label', `墨水補給，剩餘 ${inkCount} 個；正式關卡危險啟動前可使用，每局最多一次`);
  }
  if (shieldButton) {
    shieldButton.textContent = detail?.shieldArmed ? `護盾 已啟用` : `護盾 ×${shieldCount}`;
    shieldButton.disabled = detail ? !detail.canUseShield : shieldCount <= 0;
    shieldButton.setAttribute('aria-label', `護盾，剩餘 ${shieldCount} 個；啟用後抵擋一次致命危險`);
  }
  if (status) status.textContent = detail?.message ?? '正式關卡可在危險啟動前使用道具。';
}

function useItem(itemId: InventoryItemId): void {
  document.dispatchEvent(new CustomEvent('draw-save-game:use-item', { detail: { itemId } }));
}

inkButton?.addEventListener('click', () => useItem('ink-refill'));
shieldButton?.addEventListener('click', () => useItem('shield'));

document.addEventListener('draw-save-game:item-state', (event) => {
  render((event as CustomEvent<ItemStateDetail>).detail);
});

render();
