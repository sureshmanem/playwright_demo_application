import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: { timeout: 5000 },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    headless: true,
    baseURL: 'http://localhost:8000',
    actionTimeout: 10_000,
    navigationTimeout: 30_000
  }
});
