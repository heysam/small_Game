import { describe, expect, it } from 'vitest';
import { createDefaultInventoryLedger, grantInventoryItem } from './items';
import { createShieldRoundState } from './shield';
import { activateShield } from './shieldInventory';

describe('shield inventory activation', () => {
  it('consumes exactly one shield and arms a formal round', () => {
    const ledger = grantInventoryItem(createDefaultInventoryLedger(), 'shield', 2);
    const result = activateShield(ledger, createShieldRoundState(), false);

    expect(result.activated).toBe(true);
    expect(result.ledger.items.shield).toBe(1);
    expect(result.shield.armed).toBe(true);
  });

  it('never consumes inventory in editor preview', () => {
    const ledger = grantInventoryItem(createDefaultInventoryLedger(), 'shield', 1);
    const result = activateShield(ledger, createShieldRoundState(), true);

    expect(result).toMatchObject({ activated: false, reason: 'preview' });
    expect(result.ledger.items.shield).toBe(1);
    expect(result.shield.armed).toBe(false);
  });

  it('does not double-consume while already armed', () => {
    const ledger = grantInventoryItem(createDefaultInventoryLedger(), 'shield', 2);
    const first = activateShield(ledger, createShieldRoundState(), false);
    const second = activateShield(first.ledger, first.shield, false);

    expect(second).toMatchObject({ activated: false, reason: 'already-armed' });
    expect(second.ledger.items.shield).toBe(1);
  });

  it('does not arm when inventory is empty', () => {
    const result = activateShield(createDefaultInventoryLedger(), createShieldRoundState(), false);

    expect(result).toMatchObject({ activated: false, reason: 'empty' });
    expect(result.shield.armed).toBe(false);
  });
});
