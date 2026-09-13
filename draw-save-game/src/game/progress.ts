export type LevelResult = { stars: 0 | 1 | 2 | 3; completed: boolean; bestInkLeft?: number };

export type PlayerProgress = {
  version: 1;
  unlockedLevel: number;
  results: Record<string, LevelResult>;
};

export const PROGRESS_STORAGE_KEY = 'draw-save-game.progress.v1';

export const createDefaultProgress = (): PlayerProgress => ({ version: 1, unlockedLevel: 0, results: {} });

export function normalizeProgress(value: unknown, levelCount: number): PlayerProgress {
  const fallback = createDefaultProgress();
  if (!value || typeof value !== 'object') return fallback;
  const source = value as Partial<PlayerProgress>;
  const unlocked = Number.isFinite(source.unlockedLevel) ? Math.trunc(source.unlockedLevel as number) : 0;
  const results: Record<string, LevelResult> = {};
  if (source.results && typeof source.results === 'object') {
    for (const [id, raw] of Object.entries(source.results)) {
      if (!raw || typeof raw !== 'object') continue;
      const item = raw as Partial<LevelResult>;
      const stars = Math.max(0, Math.min(3, Math.trunc(Number(item.stars) || 0))) as LevelResult['stars'];
      results[id] = { stars, completed: Boolean(item.completed), ...(Number.isFinite(item.bestInkLeft) ? { bestInkLeft: Number(item.bestInkLeft) } : {}) };
    }
  }
  return { version: 1, unlockedLevel: Math.max(0, Math.min(Math.max(0, levelCount - 1), unlocked)), results };
}

export function recordLevelResult(progress: PlayerProgress, levelId: string, levelIndex: number, levelCount: number, result: LevelResult): PlayerProgress {
  const previous = progress.results[levelId];
  const merged: LevelResult = {
    completed: Boolean(previous?.completed || result.completed),
    stars: Math.max(previous?.stars ?? 0, result.stars) as LevelResult['stars'],
    ...(Math.max(previous?.bestInkLeft ?? -Infinity, result.bestInkLeft ?? -Infinity) > -Infinity
      ? { bestInkLeft: Math.max(previous?.bestInkLeft ?? -Infinity, result.bestInkLeft ?? -Infinity) }
      : {})
  };
  const unlockCandidate = result.completed ? Math.min(levelCount - 1, levelIndex + 1) : progress.unlockedLevel;
  return { ...progress, unlockedLevel: Math.max(progress.unlockedLevel, unlockCandidate), results: { ...progress.results, [levelId]: merged } };
}

export function loadProgress(levelCount: number, storage: Pick<Storage, 'getItem'> = localStorage): PlayerProgress {
  try {
    const raw = storage.getItem(PROGRESS_STORAGE_KEY);
    return normalizeProgress(raw ? JSON.parse(raw) : null, levelCount);
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(progress: PlayerProgress, storage: Pick<Storage, 'setItem'> = localStorage) {
  storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}
