// spec: TEST_PLAN.md
// Scenario: 2.4.1 Delete a Policy

import { test, expect, Page } from '@playwright/test';

async function addPolicy(page: Page, name: string = 'To Delete'){
  await page.goto('http://localhost:8000');
  await page.fill('input[name="applicant_name"]', name);
  await page.selectOption('select[name="policy_type"]', 'Home');
  await page.fill('input[name="coverage_amount"]', '5000');
  await page.fill('input[name="premium"]', '50');
  await Promise.all([
    page.waitForNavigation(),
    page.click('button:has-text("Add Quote")')
  ]);
}

test.describe('Deleting Policies', () => {
  test('Delete a policy', async ({ page }) => {
    await addPolicy(page);
    const row = page.locator('table tbody tr', { hasText: 'To Delete' }).first();
    await expect(row).toBeVisible();

    // Click Delete
    await Promise.all([
      page.waitForNavigation(),
      row.locator('form[action^="/delete/"] button').click()
    ]);

    // Verify the policy is no longer present
    const count = await page.locator('table tbody tr', { hasText: 'To Delete' }).count();
    expect(count).toBe(0);
  });
});