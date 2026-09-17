export type RewardLedger = {
  version: 1;
  coins: number;
  levels: Record<string, { firstClearClaimed: boolean; rewardedStars: 0 | 1 | 2 | 3 }>;
};

export type LevelReward = {
  coins: number;
  firstClearCoins: number;
  starCoins: number;
  ledger: RewardLedger;
};

export const REWARD_STORAGE_KEY = 'draw-save-game.rewards.v1';
export const FIRST_CLEAR_COINS = 20;
export const COINS_PER_NEW_STAR = 5;

export const createDefaultRewardLedger = (): RewardLedger => ({ version: 1, coins: 0, levels: {} });

export function awardLevelCompletion(ledger: RewardLedger, levelId: string, stars: 1 | 2 | 3): LevelReward {
  const previous = ledger.levels[levelId] ?? { firstClearClaimed: false, rewardedStars: 0 as const };
  const firstClearCoins = previous.firstClearClaimed ? 0 : FIRST_CLEAR_COINS;
  const newStars = Math.max(0, stars - previous.rewardedStars);
  const starCoins = newStars * COINS_PER_NEW_STAR;
  const coins = firstClearCoins + starCoins;
  const rewardedStars = Math.max(previous.rewardedStars, stars) as 0 | 1 | 2 | 3;
  return {
    coins,
    firstClearCoins,
    starCoins,
    ledger: {
      version: 1,
      coins: ledger.coins + coins,
      levels: { ...ledger.levels, [levelId]: { firstClearClaimed: true, rewardedStars } }
    }
  };
}

export function normalizeRewardLedger(value: unknown): RewardLedger {
  if (!value || typeof value !== 'object') return createDefaultRewardLedger();
  const source = value as Partial<RewardLedger>;
  const levels: RewardLedger['levels'] = {};
  if (source.levels && typeof source.levels === 'object') {
    for (const [id, raw] of Object.entries(source.levels)) {
      if (!raw || typeof raw !== 'object') continue;
      const item = raw as { firstClearClaimed?: unknown; rewardedStars?: unknown };
      levels[id] = {
        firstClearClaimed: Boolean(item.firstClearClaimed),
        rewardedStars: Math.max(0, Math.min(3, Math.trunc(Number(item.rewardedStars) || 0))) as 0 | 1 | 2 | 3
      };
    }
  }
  return { version: 1, coins: Math.max(0, Math.trunc(Number(source.coins) || 0)), levels };
}

export function loadRewardLedger(storage: Pick<Storage, 'getItem'> = localStorage): RewardLedger {
  try {
    const raw = storage.getItem(REWARD_STORAGE_KEY);
    return normalizeRewardLedger(raw ? JSON.parse(raw) : null);
  } catch {
    return createDefaultRewardLedger();
  }
}

export function saveRewardLedger(ledger: RewardLedger, storage: Pick<Storage, 'setItem'> = localStorage) {
  storage.setItem(REWARD_STORAGE_KEY, JSON.stringify(ledger));
}
