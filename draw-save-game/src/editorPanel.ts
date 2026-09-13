import { exportLevelJson, importLevelJson, updateEditableLevel } from './game/editor';
import type { LevelDefinition } from './game/level';
import { mountLevelSelect } from './levelSelect';

type Options = {
  levels: readonly LevelDefinition[];
  onPreview: (level: LevelDefinition, index: number) => void;
};

const clone = (level: LevelDefinition) => structuredClone(level);

export function mountLevelEditorPanel({ levels, onPreview }: Options) {
  if (!levels.length || document.getElementById('level-editor')) return;

  mountLevelSelect({ levels, onSelect: onPreview });

  const panel = document.createElement('details');
  panel.id = 'level-editor';
  panel.className = 'level-editor';
  const summary = document.createElement('summary');
  summary.textContent = 'Level Editor / Debug Panel';
  panel.append(summary);

  const body = document.createElement('div');
  body.className = 'level-editor__body';
  panel.append(body);

  const levelSelect = document.createElement('select');
  levels.forEach((level, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${index + 1}. ${level.name}`;
    levelSelect.append(option);
  });

  const name = document.createElement('input');
  const world = document.createElement('input');
  const objective = document.createElement('select');
  for (const value of ['survive', 'reach']) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    objective.append(option);
  }
  const surviveMs = document.createElement('input');
  surviveMs.type = 'number';
  const maxInk = document.createElement('input');
  maxInk.type = 'number';
  const gravityY = document.createElement('input');
  gravityY.type = 'number';
  gravityY.step = '0.05';
  const json = document.createElement('textarea');
  const status = document.createElement('div');
  status.className = 'level-editor__status';

  const addField = (labelText: string, control: HTMLElement) => {
    const label = document.createElement('label');
    label.textContent = labelText;
    label.append(control);
    body.append(label);
  };

  addField('Starter level', levelSelect);
  addField('Name', name);
  addField('World', world);
  addField('Objective', objective);
  addField('Time (ms)', surviveMs);
  addField('Ink', maxInk);
  addField('Gravity Y', gravityY);

  const actions = document.createElement('div');
  actions.className = 'level-editor__actions';
  const button = (text: string) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.textContent = text;
    actions.append(el);
    return el;
  };
  const previewButton = button('套用並預覽');
  const exportButton = button('匯出 JSON');
  const importButton = button('匯入 JSON');
  const resetButton = button('還原關卡');
  body.append(actions, json, status);

  let index = 0;
  let working = clone(levels[0]);

  const setStatus = (message: string, isError = false) => {
    status.textContent = message;
    status.dataset.error = String(isError);
  };

  const render = () => {
    levelSelect.value = String(index);
    name.value = working.name;
    world.value = working.world;
    objective.value = working.objective;
    surviveMs.value = String(working.surviveMs);
    maxInk.value = String(working.maxInk);
    gravityY.value = String(working.gravityY);
    json.value = exportLevelJson(working);
  };

  const applyFields = () => {
    try {
      working = updateEditableLevel(working, {
        name: name.value.trim(),
        world: world.value.trim(),
        objective: objective.value as LevelDefinition['objective'],
        surviveMs: Number(surviveMs.value),
        maxInk: Number(maxInk.value),
        gravityY: Number(gravityY.value)
      });
      json.value = exportLevelJson(working);
      setStatus('參數有效，可預覽。');
      return true;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '關卡參數無效。', true);
      return false;
    }
  };

  levelSelect.addEventListener('change', () => {
    index = Number(levelSelect.value);
    working = clone(levels[index]);
    render();
    setStatus('已載入 starter level。');
  });

  previewButton.addEventListener('click', () => {
    if (!applyFields()) return;
    onPreview(clone(working), index);
    setStatus('已套用到遊戲預覽。');
  });

  exportButton.addEventListener('click', () => {
    if (!applyFields()) return;
    json.focus();
    json.select();
    setStatus('JSON 已更新，可直接複製。');
  });

  importButton.addEventListener('click', () => {
    try {
      working = importLevelJson(json.value);
      render();
      onPreview(clone(working), index);
      setStatus('JSON 驗證成功並已預覽。');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'JSON 無法匯入。', true);
    }
  });

  resetButton.addEventListener('click', () => {
    working = clone(levels[index]);
    render();
    onPreview(clone(working), index);
    setStatus('已還原 starter level。');
  });

  render();
  setStatus('編輯器只修改本機預覽，不會直接覆寫正式關卡。');
  document.body.append(panel);
}
