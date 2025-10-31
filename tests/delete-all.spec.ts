// spec: TEST_PLAN.md
// Scenario: 2.4.2 Delete All Policies

import { test, expect, Page } from '@playwright/test';

async function addPolicy(page: Page, name: string){
  await page.goto('http://localhost:8000');
  await page.fill('input[name="applicant_name"]', name);
  await page.selectOption('select[name="policy_type"]', 'Auto');
  await page.fill('input[name="coverage_amount"]', '1000');
  await page.fill('input[name="premium"]', '10');
  await Promise.all([
    page.waitForNavigation(),
    page.click('button:has-text("Add Quote")')
  ]);
}

test.describe('Deleting All Policies', () => {
  test('Delete multiple policies', async ({ page }) => {
    // Add three policies
    await addPolicy(page, 'Del 1');
    await addPolicy(page, 'Del 2');
    await addPolicy(page, 'Del 3');

    await page.goto('http://localhost:8000');
    // Iterate delete buttons robustly: delete the first row repeatedly until none remain
    let rows = page.locator('table tbody tr');
    let count = await rows.count();
    const maxIterations = 50; // safety to avoid infinite loops
    let iterations = 0;
    while (count > 0 && iterations < maxIterations) {
      const firstRow = rows.first();
      // click delete and wait for navigation (form POST -> redirect)
      await Promise.all([
        page.waitForNavigation(),
        firstRow.locator('form[action^="/delete/"] button').click()
      ]);

      // wait briefly for DOM to update and re-evaluate rows
      await page.waitForTimeout(100);
      rows = page.locator('table tbody tr');
      const newCount = await rows.count();
      // if count didn't decrease, increment iterations and try again
      if (newCount >= count) iterations++;
      else iterations = 0; // reset when progress is made
      count = newCount;
    }

    // After deletes, expect zero rows (or fail if max iterations reached)
    const finalCount = await page.locator('table tbody tr').count();
    expect(finalCount).toBe(0);
  });
});