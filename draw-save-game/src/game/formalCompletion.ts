import { calculateStars, loadProgress, recordLevelResult, saveProgress } from './progress';
import { applyCompletionReward } from './rewardFlow';

export type FormalCompletionInput = {
  levelId: string;
  levelIndex: number;
  levelCount: number;
  inkLeft: number;
  maxInk: number;
  isPreview: boolean;
};

export type FormalCompletionResult = {
  stars: 0 | 1 | 2 | 3;
  coinsEarned?: number;
  totalCoins?: number;
  persisted: boolean;
};

export function persistFormalCompletion(
  input: FormalCompletionInput,
  storage: Storage = localStorage
): FormalCompletionResult {
  if (input.isPreview) return { stars: 0, persisted: false };

  const stars = calculateStars(input.inkLeft, input.maxInk);
  const current = loadProgress(input.levelCount, storage);
  const next = recordLevelResult(current, input.levelId, input.levelIndex, input.levelCount, {
    completed: true,
    stars,
    bestInkLeft: Math.max(0, Math.round(input.inkLeft))
  });
  saveProgress(next, storage);

  const rewardResult = applyCompletionReward({
    levelId: input.levelId,
    stars,
    isPreview: false
  }, storage);

  return {
    stars,
    coinsEarned: rewardResult.reward?.coins ?? 0,
    totalCoins: rewardResult.ledger.coins,
    persisted: true
  };
}
