import { loadInventoryLedger } from './game/items';
import { createUseItemDetail } from './game/itemEvent';

const inkButton = document.querySelector<HTMLButtonElement>('#item-ink-refill');
const shieldButton = document.querySelector<HTMLButtonElement>('#item-shield');
const status = document.querySelector<HTMLElement>('#item-status');

type ItemStateDetail = {
  count: number;
  canUse: boolean;
  shieldCount?: number;
  canUseShield?: boolean;
  shieldArmed?: boolean;
  message?: string;
};

function render(detail?: ItemStateDetail): void {
  const ledger = loadInventoryLedger();
  const inkCount = detail?.count ?? ledger.items['ink-refill'];
  const shieldCount = detail?.shieldCount ?? ledger.items.shield;
  if (inkButton) {
    inkButton.textContent = `墨水補給 ×${inkCount}`;
    inkButton.disabled = detail ? !detail.canUse : inkCount <= 0;
    inkButton.setAttribute('aria-label', `墨水補給，剩餘 ${inkCount} 個；正式關卡危險啟動前可使用，每局最多一次`);
  }
  if (shieldButton) {
    const armed = detail?.shieldArmed ?? false;
    shieldButton.textContent = armed ? `護盾已啟用 ×${shieldCount}` : `護盾 ×${shieldCount}`;
    shieldButton.disabled = !detail?.canUseShield;
    shieldButton.setAttribute('aria-pressed', String(armed));
    shieldButton.setAttribute('aria-label', armed
      ? `護盾已啟用，剩餘 ${shieldCount} 個；可抵擋下一次致命碰撞`
      : `護盾，剩餘 ${shieldCount} 個；正式關卡可消耗一個啟用一次傷害吸收`);
  }
  if (status) status.textContent = detail?.message ?? '正式關卡危險啟動前可使用；每局最多一次。';
}

inkButton?.addEventListener('click', () => {
  document.dispatchEvent(new CustomEvent('draw-save-game:use-item', { detail: createUseItemDetail('ink-refill') }));
});

shieldButton?.addEventListener('click', () => {
  document.dispatchEvent(new CustomEvent('draw-save-game:use-item', { detail: createUseItemDetail('shield') }));
});

document.addEventListener('draw-save-game:item-state', (event) => {
  render((event as CustomEvent<ItemStateDetail>).detail);
});

render();
