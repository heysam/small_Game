import { describe, expect, it } from 'vitest';
import { createDefaultInventoryLedger, type InventoryLedger } from './items';
import { ShieldController } from './shieldController';
import { getShieldSceneItemState, isSceneHazardHitLethal } from './shieldScene';

function setup(shields = 1, isPreview = false) {
  let ledger: InventoryLedger = {
    ...createDefaultInventoryLedger(),
    items: { 'ink-refill': 0, shield: shields }
  };
  const controller = new ShieldController({
    isPreview,
    loadLedger: () => ledger,
    saveLedger: (next) => { ledger = next; },
  });
  return { controller, ledger: () => ledger };
}

describe('Shield scene adapter', () => {
  it('publishes a usable formal-round Shield when inventory exists', () => {
    const { controller, ledger } = setup(1);
    expect(getShieldSceneItemState(controller, ledger(), false, false)).toEqual({
      shieldCount: 1,
      canUseShield: true,
      shieldArmed: false,
    });
  });

  it('never exposes Preview inventory as consumable', () => {
    const { controller, ledger } = setup(1, true);
    expect(getShieldSceneItemState(controller, ledger(), true, false).canUseShield).toBe(false);
  });

  it('absorbs the first hit after activation and makes the next hit lethal', () => {
    const { controller, ledger } = setup(1);
    expect(controller.activate().activated).toBe(true);
    expect(ledger().items.shield).toBe(0);
    expect(isSceneHazardHitLethal(controller)).toBe(false);
    expect(controller.getState().armed).toBe(false);
    expect(isSceneHazardHitLethal(controller)).toBe(true);
  });
});
