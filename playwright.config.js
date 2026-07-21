import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const port = 5173;
const host = isCI ? '127.0.0.1' : 'localhost';
const baseURL = `http://${host}:${port}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: 1,
  timeout: isCI ? 90_000 : 30_000,
  reporter: isCI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: isCI
    ? {
        command: `npm run preview -- --host ${host} --port ${port}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      }
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
