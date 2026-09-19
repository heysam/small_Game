import { grantInventoryItem, loadInventoryLedger, saveInventoryLedger } from './items';
import { applyCompletionMetaRewards, loadMetaRewardLedger, saveMetaRewardLedger } from './metaRewards';
import { calculateStars, loadProgress, recordLevelResult, saveProgress } from './progress';
import { applyCompletionReward } from './rewardFlow';
import { saveRewardLedger } from './rewards';

export type FormalCompletionInput = {
  levelId: string;
  levelIndex: number;
  levelCount: number;
  inkLeft: number;
  maxInk: number;
  isPreview: boolean;
  /** Optional deterministic day for tests/server replay. Defaults to the player's local day. */
  rewardDay?: string;
};

export type FormalCompletionResult = {
  stars: 0 | 1 | 2 | 3;
  coinsEarned?: number;
  totalCoins?: number;
  metaCoinsEarned?: number;
  newlyClaimedDaily?: string[];
  newlyClaimedAchievements?: string[];
  inventoryGranted?: Array<{ itemId: 'ink-refill'; amount: number }>;
  persisted: boolean;
};

function localDay(now = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function persistFormalCompletion(
  input: FormalCompletionInput,
  storage: Storage = localStorage
): FormalCompletionResult {
  if (input.isPreview) return { stars: 0, persisted: false };

  // Formal wins always earn at least one star. Keep this narrowed before passing
  // the value to reward boundaries, whose contracts intentionally exclude zero.
  const stars = calculateStars(input.inkLeft, input.maxInk) as 1 | 2 | 3;
  const current = loadProgress(input.levelCount, storage);
  const next = recordLevelResult(current, input.levelId, input.levelIndex, input.levelCount, {
    completed: true,
    stars,
    bestInkLeft: Math.max(0, Math.round(input.inkLeft))
  });
  saveProgress(next, storage);

  const levelReward = applyCompletionReward({
    levelId: input.levelId,
    stars,
    isPreview: false
  }, storage);

  const totalCompletedLevels = Object.values(next.results).filter((result) => result.completed).length;
  const totalBestStars = Object.values(next.results).reduce((sum, result) => sum + result.stars, 0);
  const rewardDay = input.rewardDay ?? localDay();
  const metaReward = applyCompletionMetaRewards(loadMetaRewardLedger(rewardDay, storage), {
    day: rewardDay,
    stars,
    totalCompletedLevels,
    totalBestStars
  });
  saveMetaRewardLedger(metaReward.ledger, storage);

  // Meta rewards share the same coin balance as level rewards. Persist them only
  // after both idempotent ledgers have decided what is newly claimable.
  const combinedLedger = {
    ...levelReward.ledger,
    coins: levelReward.ledger.coins + metaReward.coins
  };
  saveRewardLedger(combinedLedger, storage);

  // Reuse the idempotent daily-claim decision as the acquisition boundary.
  // A daily three-star claim grants one Ink Refill exactly once for that day.
  const inventoryGranted: FormalCompletionResult['inventoryGranted'] = [];
  if (metaReward.newlyClaimedDaily.includes('daily-three-stars')) {
    const inventory = grantInventoryItem(loadInventoryLedger(storage), 'ink-refill', 1);
    saveInventoryLedger(inventory, storage);
    inventoryGranted.push({ itemId: 'ink-refill', amount: 1 });
  }

  return {
    stars,
    coinsEarned: (levelReward.reward?.coins ?? 0) + metaReward.coins,
    metaCoinsEarned: metaReward.coins,
    totalCoins: combinedLedger.coins,
    newlyClaimedDaily: metaReward.newlyClaimedDaily,
    newlyClaimedAchievements: metaReward.newlyClaimedAchievements,
    inventoryGranted,
    persisted: true
  };
}
