export function attachPageDiagnostics(page) {
  const errors = [];

  page.on('pageerror', (error) => {
    errors.push(`Page error: ${error.message}`);
  });

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(`Console error: ${message.text()}`);
    }
  });

  return {
    summary() {
      return errors.length > 0
        ? errors.join('\n')
        : 'No JavaScript errors were logged.';
    },
  };
}

export async function describePageState(page) {
  return page.evaluate(() => ({
    title: document.title,
    rootEmpty: document.querySelector('#root')?.childElementCount === 0,
    rootPreview: document.querySelector('#root')?.innerHTML?.slice(0, 300) ?? '',
    scriptSrcs: [...document.querySelectorAll('script[src]')].map((script) => script.src),
  }));
}

export async function formatAppLoadFailure(page, diagnostics) {
  const state = await describePageState(page);

  return [
    'The app shell never rendered.',
    `Page title: ${state.title}`,
    `Root empty: ${state.rootEmpty}`,
    state.rootPreview ? `Root HTML preview: ${state.rootPreview}` : 'Root HTML preview: (empty)',
    state.scriptSrcs.length > 0
      ? `Scripts: ${state.scriptSrcs.join(', ')}`
      : 'Scripts: (none loaded)',
    diagnostics.summary(),
    'If running in CI, confirm VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set as repository secrets or variables on the build job.',
  ].join('\n');
}
