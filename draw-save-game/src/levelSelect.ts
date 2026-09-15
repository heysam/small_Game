import type { LevelDefinition } from './game/level';
import { loadProgress } from './game/progress';
import { mountFeedbackSettings } from './feedback';
import { mountAccessibilitySettings } from './accessibility';
import { hasSeenTutorial, markTutorialSeen, objectiveHelp } from './tutorial';

type Options = {
  levels: readonly LevelDefinition[];
  onSelect: (level: LevelDefinition, index: number) => void;
};

const worldLabels: Record<string, string> = {
  city: '城市屋頂', forest: '森林', cave: '洞窟', lab: '實驗室', harbor: '港口'
};

function updateActiveHint(level: LevelDefinition, index: number) {
  const root = document.getElementById('level-select');
  if (!root) return;
  const details = root.querySelector<HTMLDetailsElement>('.level-select__active-hint');
  const summary = details?.querySelector<HTMLElement>('summary');
  const objective = details?.querySelector<HTMLElement>('[data-hint-objective]');
  const hint = details?.querySelector<HTMLElement>('[data-hint-text]');
  if (!details || !summary || !objective || !hint) return;
  summary.textContent = `第 ${index + 1} 關提示 · ${level.name}`;
  objective.textContent = objectiveHelp(level.objective);
  hint.textContent = level.editor?.hint ?? '觀察危險物的移動方式，再利用地形節省墨水。';
  details.open = true;
}

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

  const tutorial = document.createElement('details');
  tutorial.className = 'level-select__tutorial';
  tutorial.open = !hasSeenTutorial();
  tutorial.innerHTML = `<summary>玩法教學</summary><ol><li><strong>先觀察：</strong>看人物、危險物、地形與目標位置。</li><li><strong>再畫線：</strong>按住滑鼠或手指畫線，墨水有限，線條會變成實體碰撞結構。</li><li><strong>放手開始：</strong>放開後危險啟動；依關卡完成存活、抵達出口或接住人物。</li></ol><p>每關開始後可打開下方「本關提示」，查看不直接洩漏解法的方向提示。</p>`;
  root.append(tutorial);

  const activeHint = document.createElement('details');
  activeHint.className = 'level-select__active-hint';
  activeHint.innerHTML = '<summary>本關提示</summary><p data-hint-objective>選擇關卡後會顯示目標說明。</p><p data-hint-text>提示會使用目前關卡資料，不影響遊戲進度。</p>';
  root.append(activeHint);

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
        if (button.disabled) return;
        markTutorialSeen();
        tutorial.open = false;
        updateActiveHint(level, index);
        onSelect(structuredClone(level), index);
      });
      grid.append(button);
    }
    group.append(grid);
    root.append(group);
  }

  document.body.append(root);
  mountFeedbackSettings();
  mountAccessibilitySettings();
  refreshLevelSelect(levels);
}
