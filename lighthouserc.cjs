module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173/'],
      startServerCommand: 'npm run preview -- --host 127.0.0.1 --port 4173',
      startServerReadyPattern: 'Local:',
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
