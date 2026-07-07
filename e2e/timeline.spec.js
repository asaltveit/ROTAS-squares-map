import { test, expect } from '@playwright/test';
import { waitForAppReady } from './helpers/app.js';

test.describe('Timeline', () => {
  test('changes the year via the slider', async ({ page }) => {
    await waitForAppReady(page);

    const slider = page.getByLabel(/timeline-.* year slider/i);
    const initialYear = await page.locator('#year-display').textContent();

    await slider.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    await expect(page.locator('#year-display')).not.toHaveText(initialYear ?? '');
  });

  test('plays and stops the timeline animation', async ({ page }) => {
    await waitForAppReady(page);

    const playButton = page.getByRole('button', { name: /play timeline animation/i });
    await expect(playButton).toBeVisible();

    await playButton.click();
    await expect(page.getByRole('button', { name: /stop timeline animation/i })).toBeVisible();

    const yearBeforeStop = await page.locator('#year-display').textContent();
    await page.waitForTimeout(500);
    const yearDuringPlay = await page.locator('#year-display').textContent();

    await page.getByRole('button', { name: /stop timeline animation/i }).click();
    await expect(page.getByRole('button', { name: /play timeline animation/i })).toBeVisible();

    expect(yearDuringPlay).not.toBe(yearBeforeStop);
  });
});
