import { describe, expect, it } from 'vitest';
import {
  consumeInventoryItem,
  createDefaultInventoryLedger,
  grantInventoryItem,
  normalizeInventoryLedger
} from './items';

describe('item inventory', () => {
  it('starts empty and clamps malformed persisted counts', () => {
    expect(createDefaultInventoryLedger()).toEqual({
      version: 1,
      items: { 'ink-refill': 0, shield: 0 }
    });
    expect(normalizeInventoryLedger({ version: 1, items: { 'ink-refill': -8, shield: -2 } }).items).toEqual({
      'ink-refill': 0,
      shield: 0
    });
    expect(normalizeInventoryLedger({ version: 1, items: { 'ink-refill': 500, shield: 120 } }).items).toEqual({
      'ink-refill': 99,
      shield: 99
    });
    expect(normalizeInventoryLedger({ version: 2, items: { 'ink-refill': 8, shield: 4 } }).items).toEqual({
      'ink-refill': 0,
      shield: 0
    });
  });

  it('migrates an existing v1 ink-only ledger without losing its refill balance', () => {
    expect(normalizeInventoryLedger({ version: 1, items: { 'ink-refill': 3 } }).items).toEqual({
      'ink-refill': 3,
      shield: 0
    });
  });

  it.each(['ink-refill', 'shield'] as const)('grants and consumes %s without allowing a negative balance', (itemId) => {
    const granted = grantInventoryItem(createDefaultInventoryLedger(), itemId, 2);
    expect(granted.items[itemId]).toBe(2);

    const first = consumeInventoryItem(granted, itemId);
    expect(first.consumed).toBe(true);
    expect(first.ledger.items[itemId]).toBe(1);

    const second = consumeInventoryItem(first.ledger, itemId);
    expect(second.consumed).toBe(true);
    expect(second.ledger.items[itemId]).toBe(0);

    const empty = consumeInventoryItem(second.ledger, itemId);
    expect(empty.consumed).toBe(false);
    expect(empty.ledger.items[itemId]).toBe(0);
  });
});
