// spec: TEST_PLAN.md
// Scenario: 2.1.2 Add a Quote with Missing Required Fields

import { test, expect } from '@playwright/test';

test.describe('Adding New Quotes - Validation', () => {
  test('Add Quote missing applicant name', async ({ page }) => {
    // 1. Navigate to the application's home page.
    await page.goto('http://localhost:8000');

  // 2. Leave the Applicant Name blank and fill other fields
  await page.selectOption('select[name="policy_type"]', 'Auto');
    await page.fill('input[name="coverage_amount"]', '10000');
    await page.fill('input[name="premium"]', '100');

  // 3. Attempt to submit the form. Browser's native validation should prevent submission.
  // Click the Add Quote button and ensure the URL does not change (no navigation)
  const before = page.url();
  await page.click('button:has-text("Add Quote")');
  // wait a short time to let potential navigation happen
  await page.waitForTimeout(500);
  const after = page.url();
  expect(after).toBe(before);
  });
});