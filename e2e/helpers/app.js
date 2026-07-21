/**
 * Wait for the app to finish loading Supabase data and render the map.
 */
export async function waitForAppReady(page) {
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' });

  if (response && !response.ok()) {
    throw new Error(`App failed to load (${response.status()} ${response.statusText()})`);
  }

  // Wait for React to mount before role-based queries.
  await page.locator('#root h1').waitFor({ state: 'visible', timeout: 60_000 });
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

  await page.locator('.map-container svg[class^="plot-"]').waitFor({ timeout: 60_000 });
}
