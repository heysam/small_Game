export type ShieldRoundState = {
  armed: boolean;
  absorbedHits: number;
};

export type ShieldHitResult = {
  state: ShieldRoundState;
  absorbed: boolean;
  lethal: boolean;
};

export function createShieldRoundState(): ShieldRoundState {
  return { armed: false, absorbedHits: 0 };
}

export function armShield(state: ShieldRoundState): ShieldRoundState {
  if (state.armed) return state;
  return { ...state, armed: true };
}

export function resolveHazardHit(state: ShieldRoundState): ShieldHitResult {
  if (!state.armed) {
    return { state, absorbed: false, lethal: true };
  }

  return {
    state: { armed: false, absorbedHits: state.absorbedHits + 1 },
    absorbed: true,
    lethal: false
  };
}
