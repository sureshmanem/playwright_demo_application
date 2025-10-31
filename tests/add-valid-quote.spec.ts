// spec: TEST_PLAN.md
// Scenario: 2.1.1 Add a Valid Quote (Happy Path)

import { test, expect } from '@playwright/test';

test.describe('Adding New Quotes', () => {
  test('Add a Valid Quote', async ({ page }) => {
    // 1. Navigate to the application's home page.
    await page.goto('http://localhost:8000');

    // 2. In the "Create a New Quote" form, enter a valid Applicant Name (e.g., "John Doe").
    await page.fill('input[name="applicant_name"]', 'John Doe');

    // 3. Select a Policy Type from the dropdown (e.g., "Auto").
    await page.selectOption('select[name="policy_type"]', 'Auto');

    // 4. Enter a valid Coverage Amount (e.g., "50000").
    await page.fill('input[name="coverage_amount"]', '50000');

    // 5. Enter a valid Premium (e.g., "500").
    await page.fill('input[name="premium"]', '500');

    // 6. Click the "Add Quote" button.
    await Promise.all([
      page.waitForNavigation(),
      page.click('button:has-text("Add Quote")')
    ]);

    // Expected: The new policy should appear in the table with status 'Quote'.
    const row = await page.locator('table tbody tr', { hasText: 'John Doe' }).first();
    await expect(row).toBeVisible();
    await expect(row).toContainText('Auto');
    await expect(row).toContainText('$50000.00');
    await expect(row).toContainText('$500.00');
    await expect(row).toContainText('Quote');
  });
});