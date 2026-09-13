import { expect, test } from '@playwright/test';

test.describe('Draw to Rescue browser smoke', () => {
  test('boots the Phaser scene and exercises drawing plus level preview switching', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    await page.goto('/');
    const canvas = page.locator('#app canvas');
    await expect(canvas).toBeVisible();
    await expect(page.locator('#level-editor')).toBeVisible();

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
    const levelSelect = editor.locator('select').first();
    await levelSelect.selectOption('4');
    await expect(levelSelect).toHaveValue('4');
    const json = editor.locator('textarea');
    await expect(json).toContainText('"id"');
    await editor.getByRole('button', { name: '套用並預覽' }).click();
    await expect(editor.locator('.level-editor__status')).toContainText('已套用到遊戲預覽');
    await expect(canvas).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test('exercises a deterministic hero-spike contact failure scenario without browser errors', async ({ page }) => {
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
    level.objective = 'survive';
    delete level.target;
    level.surviveMs = 2000;
    level.hazards = [{ kind: 'spike', x: level.hero.x, y: level.hero.y, radius: 34 }];
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
    await page.waitForTimeout(400);

    const after = await canvas.screenshot();
    expect(after.equals(before)).toBe(false);
    await expect(canvas).toBeVisible();
    expect(pageErrors).toEqual([]);
  });
});
