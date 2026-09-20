import { describe, expect, it } from 'vitest';
import { armShield, createShieldRoundState, resolveHazardHit } from './shield';

describe('shield round state', () => {
  it('starts unarmed and leaves an unshielded hazard hit lethal', () => {
    const initial = createShieldRoundState();
    expect(initial).toEqual({ armed: false, absorbedHits: 0 });

    const hit = resolveHazardHit(initial);
    expect(hit.absorbed).toBe(false);
    expect(hit.lethal).toBe(true);
    expect(hit.state).toEqual(initial);
  });

  it('absorbs exactly one lethal hazard hit after being armed', () => {
    const armed = armShield(createShieldRoundState());
    const firstHit = resolveHazardHit(armed);
    expect(firstHit.absorbed).toBe(true);
    expect(firstHit.lethal).toBe(false);
    expect(firstHit.state).toEqual({ armed: false, absorbedHits: 1 });

    const secondHit = resolveHazardHit(firstHit.state);
    expect(secondHit.absorbed).toBe(false);
    expect(secondHit.lethal).toBe(true);
    expect(secondHit.state.absorbedHits).toBe(1);
  });

  it('does not stack multiple activations in the same round', () => {
    const armed = armShield(createShieldRoundState());
    expect(armShield(armed)).toBe(armed);
  });
});
