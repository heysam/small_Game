import type { LevelDefinition } from './game/level';
import { loadProgress } from './game/progress';

type Options = {
  levels: readonly LevelDefinition[];
  onSelect: (level: LevelDefinition, index: number) => void;
};

const worldLabels: Record<string, string> = {
  city: '城市屋頂',
  forest: '森林',
  cave: '洞窟',
  lab: '實驗室',
  harbor: '港口'
};

export function mountLevelSelect({ levels, onSelect }: Options) {
  if (!levels.length || document.getElementById('level-select')) return;
  const progress = loadProgress(levels.length);
  const root = document.createElement('section');
  root.id = 'level-select';
  root.className = 'level-select';
  root.setAttribute('aria-label', '關卡選擇');

  const heading = document.createElement('div');
  heading.className = 'level-select__heading';
  heading.innerHTML = '<strong>關卡地圖</strong><span>選擇已解鎖的救援任務</span>';
  root.append(heading);

  const groups = new Map<string, { level: LevelDefinition; index: number }[]>();
  levels.forEach((level, index) => {
    const items = groups.get(level.world) ?? [];
    items.push({ level, index });
    groups.set(level.world, items);
  });

  for (const [world, items] of groups) {
    const group = document.createElement('div');
    group.className = 'level-select__world';
    const title = document.createElement('h2');
    title.textContent = worldLabels[world] ?? world;
    group.append(title);
    const grid = document.createElement('div');
    grid.className = 'level-select__grid';

    for (const { level, index } of items) {
      const result = progress.results[level.id];
      const locked = index > progress.unlockedLevel;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'level-select__level';
      button.disabled = locked;
      button.dataset.levelIndex = String(index);
      button.setAttribute('aria-label', locked ? `第 ${index + 1} 關尚未解鎖` : `開始第 ${index + 1} 關 ${level.name}`);
      const stars = result?.stars ?? 0;
      button.innerHTML = `<span class="level-select__number">${index + 1}</span><span class="level-select__name">${locked ? '🔒 未解鎖' : level.name}</span><span class="level-select__stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</span>`;
      if (!locked) button.addEventListener('click', () => onSelect(structuredClone(level), index));
      grid.append(button);
    }
    group.append(grid);
    root.append(group);
  }

  document.body.append(root);
}
