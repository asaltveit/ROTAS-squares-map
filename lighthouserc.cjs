module.exports = {
  ci: {
    collect: {
      // Serve ./dist with LHCI's built-in static server instead of `vite preview`.
      // `npm run preview` often buffers stdout in CI, so startServerReadyPattern
      // never matches and LHCI times out before the server is detected.
      staticDistDir: './dist',
      isSinglePageApplication: true,
      url: ['http://localhost/'],
      numberOfRuns: 3,
      puppeteerScript: './scripts/lhci-puppeteer.cjs',
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.7 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.15 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
