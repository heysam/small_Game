import { describe, expect, it } from 'vitest';
import {
  consumeInventoryItem,
  createDefaultInventoryLedger,
  grantInventoryItem,
  normalizeInventoryLedger
} from './items';

describe('item inventory', () => {
  it('starts empty and clamps malformed persisted counts', () => {
    expect(createDefaultInventoryLedger()).toEqual({ version: 1, items: { 'ink-refill': 0 } });
    expect(normalizeInventoryLedger({ version: 1, items: { 'ink-refill': -8 } }).items['ink-refill']).toBe(0);
    expect(normalizeInventoryLedger({ version: 1, items: { 'ink-refill': 500 } }).items['ink-refill']).toBe(99);
    expect(normalizeInventoryLedger({ version: 2, items: { 'ink-refill': 8 } }).items['ink-refill']).toBe(0);
  });

  it('grants and consumes a refill without allowing a negative balance', () => {
    const granted = grantInventoryItem(createDefaultInventoryLedger(), 'ink-refill', 2);
    expect(granted.items['ink-refill']).toBe(2);

    const first = consumeInventoryItem(granted, 'ink-refill');
    expect(first.consumed).toBe(true);
    expect(first.ledger.items['ink-refill']).toBe(1);

    const second = consumeInventoryItem(first.ledger, 'ink-refill');
    expect(second.consumed).toBe(true);
    expect(second.ledger.items['ink-refill']).toBe(0);

    const empty = consumeInventoryItem(second.ledger, 'ink-refill');
    expect(empty.consumed).toBe(false);
    expect(empty.ledger.items['ink-refill']).toBe(0);
  });
});
