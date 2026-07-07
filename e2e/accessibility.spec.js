// Axe scans run against real Supabase-backed UI states.
// Observable Plot SVG map internals are excluded via e2e/helpers/axe.js because
// they produce false positives for chart-specific accessibility rules.

import { test } from '@playwright/test';
import { waitForAppReady } from './helpers/app.js';
import { assertNoSeriousViolations, scanPage } from './helpers/axe.js';

test.describe('Accessibility', () => {
  test('initial load has no serious accessibility violations', async ({ page }) => {
    await waitForAppReady(page);
    const results = await scanPage(page);
    assertNoSeriousViolations(results);
  });

  test('filters open has no serious accessibility violations', async ({ page }) => {
    await waitForAppReady(page);
    await page.getByRole('heading', { name: /^filters$/i }).waitFor();
    const results = await scanPage(page);
    assertNoSeriousViolations(results);
  });

  test('filters closed has no serious accessibility violations', async ({ page }) => {
    await waitForAppReady(page);
    await page.getByRole('button', { name: /close filters/i }).click();
    await page.getByRole('button', { name: /show filters/i }).waitFor();
    const results = await scanPage(page);
    assertNoSeriousViolations(results);
  });

  test('recording panel open has no serious accessibility violations', async ({ page }) => {
    await waitForAppReady(page);
    await page.getByRole('button', { name: /show recording and export/i }).click();
    await page.getByRole('button', { name: /close recording and export/i }).waitFor();
    const results = await scanPage(page);
    assertNoSeriousViolations(results);
  });
});
