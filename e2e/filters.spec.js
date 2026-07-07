import { test, expect } from '@playwright/test';
import { waitForAppReady } from './helpers/app.js';

test.describe('Filters', () => {
  test('closes and reopens the filters panel', async ({ page }) => {
    await waitForAppReady(page);

    await expect(page.getByRole('heading', { name: /^filters$/i })).toBeVisible();

    await page.getByRole('button', { name: /close filters/i }).click();
    await expect(page.getByRole('heading', { name: /^filters$/i })).not.toBeVisible();
    await expect(page.getByRole('button', { name: /show filters/i })).toBeVisible();

    await page.getByRole('button', { name: /show filters/i }).click();
    await expect(page.getByRole('heading', { name: /^filters$/i })).toBeVisible();
  });

  test('applies a type filter and updates the active filter count', async ({ page }) => {
    await waitForAppReady(page);

    await expect(page.getByText('Active filters: 0')).toBeVisible();

    const typeSelect = page.locator('#type-select');
    const firstTypeValue = await typeSelect.locator('option').nth(1).getAttribute('value');
    expect(firstTypeValue).toBeTruthy();

    await typeSelect.selectOption(firstTypeValue);
    await expect(page.getByText('Active filters: 1')).toBeVisible();
    await expect(page.locator('.map-container svg[class^="plot-"]')).toBeVisible();
  });
});
