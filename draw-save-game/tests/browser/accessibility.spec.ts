import { expect, test } from '@playwright/test';

test.describe('Draw to Rescue keyboard accessibility', () => {
  test('operates tutorial, level selection, assist stroke and accessibility settings without a pointer', async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    const tutorial = page.locator('.level-select__tutorial');
    const tutorialSummary = tutorial.locator('summary');
    await tutorialSummary.focus();
    await expect(tutorialSummary).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(tutorial).not.toHaveAttribute('open', '');
    await page.keyboard.press('Enter');
    await expect(tutorial).toHaveAttribute('open', '');

    const firstLevel = page.locator('[data-level-index="0"]');
    await firstLevel.focus();
    await expect(firstLevel).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.level-select__active-hint')).toHaveAttribute('open', '');
    await expect(page.locator('#app canvas')).toBeVisible();

    const assist = page.locator('#assist-stroke');
    await assist.focus();
    await expect(assist).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(assist).toHaveAttribute('aria-label', /輔助防護線/);
    await expect.poll(async () => page.locator('#app canvas').count()).toBe(1);

    const settings = page.locator('#accessibility-settings');
    const settingsSummary = settings.locator('summary');
    await settingsSummary.focus();
    await page.keyboard.press('Enter');
    await expect(settings).toHaveAttribute('open', '');

    const reducedMotion = settings.locator('[data-accessibility="reducedMotion"]');
    await reducedMotion.focus();
    await page.keyboard.press('Space');
    await expect(reducedMotion).toBeChecked();
    await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true');

    const highContrast = settings.locator('[data-accessibility="highContrast"]');
    await highContrast.focus();
    await page.keyboard.press('Space');
    await expect(highContrast).toBeChecked();
    await expect(page.locator('html')).toHaveAttribute('data-high-contrast', 'true');

    const largeText = settings.locator('[data-accessibility="largeText"]');
    await largeText.focus();
    await page.keyboard.press('Space');
    await expect(largeText).toBeChecked();
    await expect(page.locator('html')).toHaveAttribute('data-large-text', 'true');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-high-contrast', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-large-text', 'true');
    expect(pageErrors).toEqual([]);
  });
});
