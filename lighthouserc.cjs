module.exports = {
  ci: {
    collect: {
      // Serve prebuilt ./dist — avoids vite preview stdout buffering in CI.
      staticDistDir: './dist',
      isSinglePageApplication: true,
      url: ['http://localhost/'],
      numberOfRuns: 1,
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
