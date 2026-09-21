import { consumeInventoryItem, type InventoryLedger } from './items';
import { armShield, type ShieldRoundState } from './shield';

export type ActivateShieldResult = {
  activated: boolean;
  reason?: 'preview' | 'already-armed' | 'empty';
  ledger: InventoryLedger;
  shield: ShieldRoundState;
};

/**
 * Pure transaction used by the scene when the player activates Shield.
 * Inventory is only consumed when a formal round can actually arm a shield.
 */
export function activateShield(
  ledger: InventoryLedger,
  shield: ShieldRoundState,
  isPreview: boolean
): ActivateShieldResult {
  if (isPreview) return { activated: false, reason: 'preview', ledger, shield };
  if (shield.armed) return { activated: false, reason: 'already-armed', ledger, shield };

  const consumed = consumeInventoryItem(ledger, 'shield');
  if (!consumed.consumed) return { activated: false, reason: 'empty', ledger, shield };

  return {
    activated: true,
    ledger: consumed.ledger,
    shield: armShield(shield)
  };
}
