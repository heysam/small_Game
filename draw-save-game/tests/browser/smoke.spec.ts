import { expect, test } from '@playwright/test';

test.describe('Draw to Rescue browser smoke', () => {
  test('boots the Phaser scene and exercises drawing plus level preview switching', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    await page.goto('/');
    const canvas = page.locator('#app canvas');
    await expect(canvas).toBeVisible();
    await expect(page.locator('#level-editor')).toBeVisible();
    await expect(page.locator('#level-select')).toBeVisible();

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    const sx = box.x + box.width * (110 / 420);
    const sy = box.y + box.height * (280 / 760);
    const ex = box.x + box.width * (300 / 420);
    const ey = box.y + box.height * (320 / 760);
    await page.mouse.move(sx, sy);
    await page.mouse.down();
    await page.mouse.move(ex, ey, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(250);

    const editor = page.locator('#level-editor');
    await editor.locator('summary').click();
    const editorSelect = editor.locator('select').first();
    await editorSelect.selectOption('4');
    await expect(editorSelect).toHaveValue('4');
    const json = editor.locator('textarea');
    await expect(json).toHaveValue(/"id"/);
    await editor.getByRole('button', { name: '套用並預覽' }).click();
    await expect(editor.locator('.level-editor__status')).toContainText('已套用到遊戲預覽');
    await expect(canvas).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test('shows a deterministic editor-preview failure result without browser errors', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    await page.goto('/');
    const canvas = page.locator('#app canvas');
    await expect(canvas).toBeVisible();
    const before = await canvas.screenshot();

    const editor = page.locator('#level-editor');
    await editor.locator('summary').click();
    const json = editor.locator('textarea');
    const level = JSON.parse(await json.inputValue());
    level.objective = 'reach';
    level.target = { x: 20, y: 190, width: 28, height: 28, holdMs: 700 };
    level.surviveMs = 500;
    level.hazards = [];
    await json.fill(JSON.stringify(level, null, 2));
    await editor.getByRole('button', { name: '匯入 JSON' }).click();
    await expect(editor.locator('.level-editor__status')).toContainText('JSON 驗證成功並已預覽');

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.45);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.72, box.y + box.height * 0.45, { steps: 14 });
    await page.mouse.up();
    await expect(page.locator('#result-panel')).toBeVisible({ timeout: 2500 });
    await expect(page.locator('#result-panel')).toContainText('預覽失敗');
    await expect(page.locator('#result-panel')).toContainText('不會寫入正式進度');
    await page.locator('[data-result-action="levels"]').click();
    await expect(page.locator('#result-panel')).toBeHidden();

    const after = await canvas.screenshot();
    expect(after.equals(before)).toBe(false);
    await expect(canvas).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test('persists a real completed level, shows result controls, unlocks next and survives reload', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const canvas = page.locator('#app canvas');
    await expect(canvas).toBeVisible();
    const first = page.locator('[data-level-index="0"]');
    const second = page.locator('[data-level-index="1"]');
    await expect(first).toBeEnabled();
    await expect(second).toBeDisabled();
    await first.click();
    await page.waitForTimeout(300);
    await canvas.scrollIntoViewIfNeeded();
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;
    const point = (x: number, y: number) => ({ x: box.x + box.width * (x / 420), y: box.y + box.height * (y / 760) });
    const start = point(25, 500);
    const end = point(395, 500);
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, { steps: 36 });
    await page.mouse.up();

    const result = page.locator('#result-panel');
    await expect(result).toBeVisible({ timeout: 9500 });
    await expect(result).toContainText('救援成功');
    await expect(result.locator('.result-panel__stars')).toHaveText(/[★][★☆]{2}/);
    await expect(result.locator('[data-result-action="retry"]')).toBeVisible();
    await expect(result.locator('[data-result-action="next"]')).toBeVisible();
    await expect(second).toBeEnabled();
    await expect(first.locator('.level-select__stars')).not.toHaveText('☆☆☆');
    const stored = await page.evaluate(() => localStorage.getItem('draw-save-game.progress.v1'));
    expect(stored).toContain('city-01');

    await result.locator('[data-result-action="next"]').click();
    await expect(result).toBeHidden();
    await page.waitForTimeout(250);
    await expect(canvas).toBeVisible();

    await page.reload();
    await expect(page.locator('[data-level-index="1"]')).toBeEnabled();
    await expect(page.locator('[data-level-index="0"] .level-select__stars')).not.toHaveText('☆☆☆');
    expect(pageErrors).toEqual([]);
  });
});
