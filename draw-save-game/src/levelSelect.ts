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

export function refreshLevelSelect(levels: readonly LevelDefinition[]) {
  const root = document.getElementById('level-select');
  if (!root) return;
  const progress = loadProgress(levels.length);
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-level-index]')) {
    const index = Number(button.dataset.levelIndex);
    const level = levels[index];
    if (!level) continue;
    const result = progress.results[level.id];
    const locked = index > progress.unlockedLevel;
    button.disabled = locked;
    button.setAttribute('aria-label', locked ? `第 ${index + 1} 關尚未解鎖` : `開始第 ${index + 1} 關 ${level.name}`);
    const name = button.querySelector<HTMLElement>('.level-select__name');
    const stars = button.querySelector<HTMLElement>('.level-select__stars');
    if (name) name.textContent = locked ? '🔒 未解鎖' : level.name;
    if (stars) {
      const count = result?.stars ?? 0;
      stars.textContent = `${'★'.repeat(count)}${'☆'.repeat(3 - count)}`;
    }
  }
}

export function mountLevelSelect({ levels, onSelect }: Options) {
  if (!levels.length || document.getElementById('level-select')) return;
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
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'level-select__level';
      button.dataset.levelIndex = String(index);
      button.innerHTML = `<span class="level-select__number">${index + 1}</span><span class="level-select__name"></span><span class="level-select__stars"></span>`;
      button.addEventListener('click', () => {
        if (!button.disabled) onSelect(structuredClone(level), index);
      });
      grid.append(button);
    }
    group.append(grid);
    root.append(group);
  }

  document.body.append(root);
  refreshLevelSelect(levels);
}
