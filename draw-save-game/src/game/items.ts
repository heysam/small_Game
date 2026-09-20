export type ItemId = 'ink-refill' | 'shield';

export type InventoryLedger = {
  version: 1;
  items: Record<ItemId, number>;
};

export type ConsumeItemResult = {
  consumed: boolean;
  ledger: InventoryLedger;
};

export const INVENTORY_STORAGE_KEY = 'draw-save-game.inventory.v1';
export const MAX_ITEM_STACK = 99;

export const createDefaultInventoryLedger = (): InventoryLedger => ({
  version: 1,
  items: { 'ink-refill': 0, shield: 0 }
});

function clampCount(value: unknown): number {
  return Math.max(0, Math.min(MAX_ITEM_STACK, Math.trunc(Number(value) || 0)));
}

export function normalizeInventoryLedger(value: unknown): InventoryLedger {
  if (!value || typeof value !== 'object') return createDefaultInventoryLedger();
  const source = value as Partial<InventoryLedger>;
  if (source.version !== 1 || !source.items || typeof source.items !== 'object') {
    return createDefaultInventoryLedger();
  }
  const items = source.items as Partial<Record<ItemId, unknown>>;
  return {
    version: 1,
    items: {
      'ink-refill': clampCount(items['ink-refill']),
      shield: clampCount(items.shield)
    }
  };
}

export function grantInventoryItem(
  ledger: InventoryLedger,
  itemId: ItemId,
  amount = 1
): InventoryLedger {
  const nextAmount = clampCount(ledger.items[itemId] + Math.max(0, Math.trunc(amount)));
  return {
    version: 1,
    items: { ...ledger.items, [itemId]: nextAmount }
  };
}

export function consumeInventoryItem(
  ledger: InventoryLedger,
  itemId: ItemId
): ConsumeItemResult {
  if (ledger.items[itemId] <= 0) return { consumed: false, ledger };
  return {
    consumed: true,
    ledger: {
      version: 1,
      items: { ...ledger.items, [itemId]: ledger.items[itemId] - 1 }
    }
  };
}

export function loadInventoryLedger(
  storage: Pick<Storage, 'getItem'> = localStorage
): InventoryLedger {
  try {
    const raw = storage.getItem(INVENTORY_STORAGE_KEY);
    return normalizeInventoryLedger(raw ? JSON.parse(raw) : null);
  } catch {
    return createDefaultInventoryLedger();
  }
}

export function saveInventoryLedger(
  ledger: InventoryLedger,
  storage: Pick<Storage, 'setItem'> = localStorage
): void {
  storage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(ledger));
}
