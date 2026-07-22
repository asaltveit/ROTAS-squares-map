import { expect } from '@playwright/test';
import { attachPageDiagnostics, formatAppLoadFailure } from './diagnostics.js';

/**
 * Wait for the app to finish loading Supabase data and render the map.
 */
export async function waitForAppReady(page) {
  const diagnostics = attachPageDiagnostics(page);

  const response = await page.goto('/', { waitUntil: 'load' });

  expect(response, 'Navigation did not return a response').not.toBeNull();
  expect(response.ok(), `App failed to load (${response.status()} ${response.statusText()})`).toBeTruthy();

  try {
    // expect() auto-retries and produces clearer assertion output than locator.waitFor().
    await expect(page.getByRole('heading', { name: /rotas squares map/i })).toBeVisible({
      timeout: 60_000,
    });
  } catch (error) {
    throw new Error(`${error.message}\n\n${await formatAppLoadFailure(page, diagnostics)}`);
  }

  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('heading', { name: /^timeline$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^map$/i })).toBeVisible();

  const typeSelect = page.locator('#type-select');
  await expect(typeSelect).toBeVisible();

  await expect
    .poll(
      async () => typeSelect.locator('option').count(),
      { timeout: 60_000, message: 'Waiting for Supabase filter options to load' },
    )
    .toBeGreaterThan(1);

  await expect(page.locator('.map-container svg[class^="plot-"]')).toBeVisible({
    timeout: 60_000,
  });
}
