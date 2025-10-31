// spec: TEST_PLAN.md
// Scenario: 2.3.1 Activate a Policy

import { test, expect, Page } from '@playwright/test';

// Helper to ensure a policy exists and return its row locator
async function addPolicy(page: Page, name: string = 'To Activate'){
  await page.goto('http://localhost:8000');
  await page.fill('input[name="applicant_name"]', name);
  await page.selectOption('select[name="policy_type"]', 'Auto');
  await page.fill('input[name="coverage_amount"]', '10000');
  await page.fill('input[name="premium"]', '100');
  await Promise.all([
    page.waitForNavigation(),
    page.click('button:has-text("Add Quote")')
  ]);
}

test.describe('Updating Policy Status', () => {
  test('Activate a policy', async ({ page }) => {
    // Ensure a policy exists
    await addPolicy(page);

    // Find the row for 'To Activate'
    const row = page.locator('table tbody tr', { hasText: 'To Activate' }).first();
    await expect(row).toBeVisible();

    // Click Activate button
    await Promise.all([
      page.waitForNavigation(),
      row.locator('form[action^="/update_status/"] button').click()
    ]);

    // Verify status changed to Active
    const activeRow = page.locator('table tbody tr', { hasText: 'To Activate' }).first();
    await expect(activeRow).toContainText('Active');
  });
});