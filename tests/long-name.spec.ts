// spec: TEST_PLAN.md
// Scenario: 2.1.4 Add a Quote with a Long Applicant Name

import { test, expect } from '@playwright/test';

test.describe('Adding New Quotes - Long Name', () => {
  test('Add Quote with very long applicant name', async ({ page }) => {
    await page.goto('http://localhost:8000');
    const longName = 'A'.repeat(200);
    await page.fill('input[name="applicant_name"]', longName);
    await page.selectOption('select[name="policy_type"]', 'Life');
    await page.fill('input[name="coverage_amount"]', '1000');
    await page.fill('input[name="premium"]', '10');

    await Promise.all([
      page.waitForNavigation(),
      page.click('button:has-text("Add Quote")')
    ]);

    const row = await page.locator('table tbody tr', { hasText: longName }).first();
    await expect(row).toBeVisible();
  });
});