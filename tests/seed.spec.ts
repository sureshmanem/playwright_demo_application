import { test } from '@playwright/test';

// simple seed test to ensure Playwright setup works
test('seed', async ({ page }) => {
  await page.goto('http://localhost:8000');
});
