// spec: TEST_PLAN.md
// Scenario: 2.1.3 Add a Quote with Zero Values

import { test, expect } from '@playwright/test';

test.describe('Adding New Quotes - Zero Values', () => {
  test('Add Quote with zero coverage and premium', async ({ page }) => {
    await page.goto('http://localhost:8000');
    await page.fill('input[name="applicant_name"]', 'Zero Values');
    await page.selectOption('select[name="policy_type"]', 'Home');
    await page.fill('input[name="coverage_amount"]', '0');
    await page.fill('input[name="premium"]', '0');

    await Promise.all([
      page.waitForNavigation(),
      page.click('button:has-text("Add Quote")')
    ]);

    const row = await page.locator('table tbody tr', { hasText: 'Zero Values' }).first();
    await expect(row).toBeVisible();
    await expect(row).toContainText('$0.00');
  });
});