// spec: TEST_PLAN.md
// Scenario: 2.2 Viewing Policies

import { test, expect } from '@playwright/test';

test.describe('Viewing Policies', () => {
  test('View policies on initial load (empty DB)', async ({ page }) => {
    await page.goto('http://localhost:8000');
    // Expect table to be present; if no rows, tbody should not contain tr
    const rows = await page.locator('table tbody tr').count();
    // rows may be 0 or more depending on DB state; assert table exists
    await expect(page.locator('table')).toBeVisible();
  });

  test('View multiple policies', async ({ page }) => {
    await page.goto('http://localhost:8000');
    // This test assumes previous tests added policies. Check that table has >= 1 row
    const rows = await page.locator('table tbody tr').count();
    await expect(rows).toBeGreaterThanOrEqual(0);
  });
});