/**
 * Wait for the app to finish loading Supabase data and render the map.
 * Mirrors e2e/helpers/app.js readiness checks for Lighthouse CI.
 */
module.exports = async (browser, context) => {
  const page = await browser.newPage();
  const baseUrl = context.url.replace(/\/$/, '');

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

  await page.waitForFunction(
    () => document.querySelector('h1')?.textContent?.match(/rotas squares map/i),
  );
  await page.waitForSelector('main');
  await page.waitForFunction(
    () => [...document.querySelectorAll('h2')].some((el) => /^timeline$/i.test(el.textContent)),
  );
  await page.waitForFunction(
    () => [...document.querySelectorAll('h2')].some((el) => /^map$/i.test(el.textContent)),
  );

  await page.waitForSelector('#type-select');
  await page.waitForFunction(() => {
    const select = document.querySelector('#type-select');
    return select && select.options.length > 1;
  });

  await page.waitForSelector('.map-container svg[class^="plot-"]', { timeout: 30000 });
};
