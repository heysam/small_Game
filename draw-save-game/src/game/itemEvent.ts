export type UsableItemId = 'ink-refill' | 'shield';

export type UseItemDetail = {
  itemId: UsableItemId;
};

export function createUseItemDetail(itemId: UsableItemId): UseItemDetail {
  return { itemId };
}
