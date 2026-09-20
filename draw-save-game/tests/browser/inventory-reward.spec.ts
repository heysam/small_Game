import { expect, test } from '@playwright/test';

test('shows a newly acquired Ink Refill once after a formal three-star clear', async ({ page }) => {
  const pageErrors: Error[] = [];
  page.on('pageerror', (error) => pageErrors.push(error));

  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const canvas = page.locator('#app canvas');
  await expect(canvas).toBeVisible();
  await page.locator('[data-level-index="0"]').click();
  await page.waitForTimeout(300);
  await canvas.scrollIntoViewIfNeeded();

  const drawThreeStarSafetyLine = async () => {
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;
    const point = (x: number, y: number) => ({ x: box.x + box.width * (x / 420), y: box.y + box.height * (y / 760) });
    const start = point(80, 500);
    const end = point(340, 500);
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(end.x, end.y, { steps: 28 });
    await page.mouse.up();
  };

  await drawThreeStarSafetyLine();
  const result = page.locator('#result-panel');
  await expect(result).toBeVisible({ timeout: 9500 });
  await expect(result).toContainText('救援成功');
  await expect(result.locator('.result-panel__stars')).toHaveText('★★★');
  await expect(result.locator('[data-reward-id="daily-three-stars"]')).toBeVisible();
  await expect(result.locator('[data-inventory-reward="ink-refill"]')).toContainText('墨水補給 ×1');

  const inventoryAfterFirstClear = await page.evaluate(() => JSON.parse(localStorage.getItem('draw-save-game.inventory.v1') ?? '{}'));
  expect(inventoryAfterFirstClear.items['ink-refill']).toBe(1);

  await result.locator('[data-result-action="retry"]').click();
  await expect(result).toBeHidden();
  await page.waitForTimeout(250);
  await drawThreeStarSafetyLine();
  await expect(result).toBeVisible({ timeout: 9500 });
  await expect(result.locator('[data-inventory-reward="ink-refill"]')).toHaveCount(0);
  const inventoryAfterReplay = await page.evaluate(() => JSON.parse(localStorage.getItem('draw-save-game.inventory.v1') ?? '{}'));
  expect(inventoryAfterReplay.items['ink-refill']).toBe(1);
  expect(pageErrors).toEqual([]);
});
