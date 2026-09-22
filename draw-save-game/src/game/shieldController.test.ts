import { describe, expect, it, vi } from 'vitest';
import { createDefaultInventoryLedger, grantInventoryItem } from './items';
import { ShieldController } from './shieldController';

describe('ShieldController', () => {
  it('consumes once, absorbs the first hit, then leaves the next hit lethal', () => {
    let ledger = grantInventoryItem(createDefaultInventoryLedger(), 'shield', 2);
    const saveLedger = vi.fn((next) => { ledger = next; });
    const controller = new ShieldController({ isPreview: false, loadLedger: () => ledger, saveLedger });

    expect(controller.activate().activated).toBe(true);
    expect(ledger.items.shield).toBe(1);
    expect(saveLedger).toHaveBeenCalledTimes(1);

    const firstHit = controller.resolveHit();
    expect(firstHit).toMatchObject({ absorbed: true, lethal: false });
    expect(controller.getState()).toEqual({ armed: false, absorbedHits: 1 });

    const secondHit = controller.resolveHit();
    expect(secondHit).toMatchObject({ absorbed: false, lethal: true });
    expect(ledger.items.shield).toBe(1);
  });

  it('never persists or consumes inventory in editor preview', () => {
    const ledger = grantInventoryItem(createDefaultInventoryLedger(), 'shield', 1);
    const saveLedger = vi.fn();
    const controller = new ShieldController({ isPreview: true, loadLedger: () => ledger, saveLedger });

    expect(controller.activate()).toMatchObject({ activated: false, reason: 'preview' });
    expect(ledger.items.shield).toBe(1);
    expect(saveLedger).not.toHaveBeenCalled();
    expect(controller.resolveHit()).toMatchObject({ absorbed: false, lethal: true });
  });

  it('does not double-consume while armed and resets round state cleanly', () => {
    let ledger = grantInventoryItem(createDefaultInventoryLedger(), 'shield', 2);
    const controller = new ShieldController({ isPreview: false, loadLedger: () => ledger, saveLedger: (next) => { ledger = next; } });

    expect(controller.activate().activated).toBe(true);
    expect(controller.activate()).toMatchObject({ activated: false, reason: 'already-armed' });
    expect(ledger.items.shield).toBe(1);

    controller.reset();
    expect(controller.getState()).toEqual({ armed: false, absorbedHits: 0 });
  });
});
