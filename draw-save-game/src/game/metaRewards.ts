export type MissionId = 'daily-clear' | 'daily-three-stars';
export type AchievementId = 'first-rescue' | 'star-collector-10';

export type MetaRewardLedger = {
  version: 1;
  day: string;
  dailyProgress: Record<MissionId, number>;
  claimedDaily: MissionId[];
  claimedAchievements: AchievementId[];
};

export type MetaRewardGrant = {
  coins: number;
  ledger: MetaRewardLedger;
  newlyClaimedDaily: MissionId[];
  newlyClaimedAchievements: AchievementId[];
};

export const META_REWARD_STORAGE_KEY = 'draw-save-game.meta-rewards.v1';
export const DAILY_CLEAR_COINS = 15;
export const DAILY_THREE_STARS_COINS = 20;
export const FIRST_RESCUE_COINS = 25;
export const STAR_COLLECTOR_10_COINS = 40;

export const createDefaultMetaRewardLedger = (day: string): MetaRewardLedger => ({
  version: 1,
  day,
  dailyProgress: { 'daily-clear': 0, 'daily-three-stars': 0 },
  claimedDaily: [],
  claimedAchievements: []
});

export function applyCompletionMetaRewards(
  ledger: MetaRewardLedger,
  input: { day: string; stars: 1 | 2 | 3; totalCompletedLevels: number; totalBestStars: number }
): MetaRewardGrant {
  const current = ledger.day === input.day
    ? ledger
    : { ...createDefaultMetaRewardLedger(input.day), claimedAchievements: [...ledger.claimedAchievements] };
  const dailyProgress = {
    'daily-clear': current.dailyProgress['daily-clear'] + 1,
    'daily-three-stars': current.dailyProgress['daily-three-stars'] + (input.stars === 3 ? 1 : 0)
  };
  const claimedDaily = [...current.claimedDaily];
  const claimedAchievements = [...current.claimedAchievements];
  const newlyClaimedDaily: MissionId[] = [];
  const newlyClaimedAchievements: AchievementId[] = [];
  let coins = 0;

  const claimDaily = (id: MissionId, ready: boolean, reward: number) => {
    if (ready && !claimedDaily.includes(id)) {
      claimedDaily.push(id);
      newlyClaimedDaily.push(id);
      coins += reward;
    }
  };
  claimDaily('daily-clear', dailyProgress['daily-clear'] >= 1, DAILY_CLEAR_COINS);
  claimDaily('daily-three-stars', dailyProgress['daily-three-stars'] >= 1, DAILY_THREE_STARS_COINS);

  const claimAchievement = (id: AchievementId, ready: boolean, reward: number) => {
    if (ready && !claimedAchievements.includes(id)) {
      claimedAchievements.push(id);
      newlyClaimedAchievements.push(id);
      coins += reward;
    }
  };
  claimAchievement('first-rescue', input.totalCompletedLevels >= 1, FIRST_RESCUE_COINS);
  claimAchievement('star-collector-10', input.totalBestStars >= 10, STAR_COLLECTOR_10_COINS);

  return {
    coins,
    ledger: { version: 1, day: input.day, dailyProgress, claimedDaily, claimedAchievements },
    newlyClaimedDaily,
    newlyClaimedAchievements
  };
}

export function normalizeMetaRewardLedger(value: unknown, day: string): MetaRewardLedger {
  if (!value || typeof value !== 'object') return createDefaultMetaRewardLedger(day);
  const source = value as Partial<MetaRewardLedger>;
  if (source.version !== 1 || typeof source.day !== 'string') return createDefaultMetaRewardLedger(day);
  const validMissions: MissionId[] = ['daily-clear', 'daily-three-stars'];
  const validAchievements: AchievementId[] = ['first-rescue', 'star-collector-10'];
  const progress = source.dailyProgress as Partial<Record<MissionId, unknown>> | undefined;
  return {
    version: 1,
    day: source.day,
    dailyProgress: {
      'daily-clear': Math.max(0, Math.trunc(Number(progress?.['daily-clear']) || 0)),
      'daily-three-stars': Math.max(0, Math.trunc(Number(progress?.['daily-three-stars']) || 0))
    },
    claimedDaily: Array.isArray(source.claimedDaily) ? source.claimedDaily.filter((id): id is MissionId => validMissions.includes(id as MissionId)) : [],
    claimedAchievements: Array.isArray(source.claimedAchievements) ? source.claimedAchievements.filter((id): id is AchievementId => validAchievements.includes(id as AchievementId)) : []
  };
}

export function loadMetaRewardLedger(day: string, storage: Pick<Storage, 'getItem'> = localStorage): MetaRewardLedger {
  try {
    const raw = storage.getItem(META_REWARD_STORAGE_KEY);
    return normalizeMetaRewardLedger(raw ? JSON.parse(raw) : null, day);
  } catch {
    return createDefaultMetaRewardLedger(day);
  }
}

export function saveMetaRewardLedger(ledger: MetaRewardLedger, storage: Pick<Storage, 'setItem'> = localStorage) {
  storage.setItem(META_REWARD_STORAGE_KEY, JSON.stringify(ledger));
}
