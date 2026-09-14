export const TUTORIAL_STORAGE_KEY = 'draw-save-game.tutorial.v1';

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;

export function hasSeenTutorial(storage: StorageLike = window.localStorage): boolean {
  try {
    return storage.getItem(TUTORIAL_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function markTutorialSeen(storage: StorageLike = window.localStorage): void {
  try {
    storage.setItem(TUTORIAL_STORAGE_KEY, '1');
  } catch {
    // Storage can be unavailable in private/restricted browser contexts.
  }
}

export function objectiveHelp(objective: 'survive' | 'reach' | 'catch'): string {
  if (objective === 'reach') return '畫出安全路線，讓人物進入綠色出口並穩定停留。';
  if (objective === 'catch') return '先畫承接結構，放手後接住人物並讓他停在藍色救援區。';
  return '用有限墨水畫出防護結構，放手後撐過倒數時間。';
}
