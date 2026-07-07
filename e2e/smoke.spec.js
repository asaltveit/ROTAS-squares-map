import { test, expect } from '@playwright/test';
import { waitForAppReady } from './helpers/app.js';

test.describe('Smoke', () => {
  test('loads the app with map and timeline', async ({ page }) => {
    await waitForAppReady(page);

    await expect(page.getByRole('heading', { name: /rotas squares map/i })).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();
    await expect(page.getByRole('heading', { name: /^timeline$/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /^map$/i })).toBeVisible();
    await expect(page.getByLabel('Interactive map showing location markers')).toBeVisible();
    await expect(page.locator('.map-container svg[class^="plot-"]')).toBeVisible();
    await expect(page.getByText(/active filters:/i)).toBeVisible();
  });
});
