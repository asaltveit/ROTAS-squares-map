/**
 * Wait for the app to finish loading Supabase data and render the map.
 */
export async function waitForAppReady(page) {
  await page.goto('/');
  await page.getByRole('heading', { name: /rotas squares map/i }).waitFor();
  await page.getByRole('main').waitFor();
  await page.getByRole('heading', { name: /^timeline$/i }).waitFor();
  await page.getByRole('heading', { name: /^map$/i }).waitFor();

  const typeSelect = page.locator('#type-select');
  await typeSelect.waitFor();
  await page.waitForFunction(() => {
    const select = document.querySelector('#type-select');
    return select && select.options.length > 1;
  });

  await page.locator('.map-container svg[class^="plot-"]').waitFor({ timeout: 30000 });
}
