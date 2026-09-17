import { awardLevelCompletion, loadRewardLedger, saveRewardLedger, type LevelReward, type RewardLedger } from './rewards';

export type CompletionRewardContext = {
  levelId: string;
  stars: 1 | 2 | 3;
  isPreview: boolean;
};

export type RewardStorage = Pick<Storage, 'getItem' | 'setItem'>;

export type CompletionRewardResult = {
  reward: LevelReward | null;
  ledger: RewardLedger;
};

/**
 * Applies rewards only for formal level completions. Editor previews are deliberately
 * isolated so testing a custom level can never mint coins or mutate the reward ledger.
 */
export function applyCompletionReward(
  context: CompletionRewardContext,
  storage: RewardStorage = localStorage
): CompletionRewardResult {
  const ledger = loadRewardLedger(storage);
  if (context.isPreview) return { reward: null, ledger };

  const reward = awardLevelCompletion(ledger, context.levelId, context.stars);
  saveRewardLedger(reward.ledger, storage);
  return { reward, ledger: reward.ledger };
}
