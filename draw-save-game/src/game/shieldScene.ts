import type { InventoryLedger } from './items';
import { ShieldController } from './shieldController';

export type ShieldSceneItemState = {
  shieldCount: number;
  canUseShield: boolean;
  shieldArmed: boolean;
};

/**
 * Derives the dock-facing Shield state from the same controller/ledger used by
 * the scene. Preview rounds intentionally never expose a consumable Shield.
 */
export function getShieldSceneItemState(
  controller: ShieldController,
  ledger: InventoryLedger,
  isPreview: boolean,
  finished: boolean,
): ShieldSceneItemState {
  const shieldCount = ledger.items.shield;
  const shieldArmed = controller.getState().armed;
  return {
    shieldCount,
    shieldArmed,
    canUseShield: !isPreview && !finished && !shieldArmed && shieldCount > 0,
  };
}

/**
 * Scene collision boundary: returns true only when the hit remains lethal.
 * An armed Shield consumes exactly one absorption through ShieldController.
 */
export function isSceneHazardHitLethal(controller: ShieldController): boolean {
  return controller.resolveHit().lethal;
}
