import type { InventoryLedger } from './items';
import { activateShield, type ActivateShieldResult } from './shieldInventory';
import { createShieldRoundState, resolveHazardHit, type ShieldHitResult, type ShieldRoundState } from './shield';

export type ShieldControllerOptions = {
  isPreview: boolean;
  loadLedger: () => InventoryLedger;
  saveLedger: (ledger: InventoryLedger) => void;
};

/**
 * Stateful scene-facing adapter for Shield. It keeps round state local to the
 * active scene while delegating inventory mutation to the existing v1 ledger.
 */
export class ShieldController {
  private state: ShieldRoundState = createShieldRoundState();

  constructor(private readonly options: ShieldControllerOptions) {}

  getState(): ShieldRoundState {
    return this.state;
  }

  activate(): ActivateShieldResult {
    const result = activateShield(this.options.loadLedger(), this.state, this.options.isPreview);
    if (result.activated) {
      this.state = result.shield;
      this.options.saveLedger(result.ledger);
    }
    return result;
  }

  resolveHit(): ShieldHitResult {
    const result = resolveHazardHit(this.state);
    this.state = result.state;
    return result;
  }

  reset(): void {
    this.state = createShieldRoundState();
  }
}
