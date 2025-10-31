// spec: TEST_PLAN.md
// Scenario: 2.5.1 Attempt to Submit Form with Invalid Numeric Data

import { test, expect } from '@playwright/test';

test.describe('Validation - Numeric Fields', () => {
  test('Coverage and premium must be numeric', async ({ page }) => {
    await page.goto('http://localhost:8000');
    await page.fill('input[name="applicant_name"]', 'Invalid Numbers');
    await page.selectOption('select[name="policy_type"]', 'Health');
  // Playwright cannot type non-numeric text into inputs[type=number]. Instead set the value via JS and check validity.
  await page.$eval('input[name="coverage_amount"]', (el: HTMLInputElement) => (el.value = 'abc'));
  await page.$eval('input[name="premium"]', (el: HTMLInputElement) => (el.value = 'xyz'));

  // Check validity (should be invalid)
  const coverageValid = await page.$eval('input[name="coverage_amount"]', (el: HTMLInputElement) => el.checkValidity());
  const premiumValid = await page.$eval('input[name="premium"]', (el: HTMLInputElement) => el.checkValidity());
  expect(coverageValid).toBe(false);
  expect(premiumValid).toBe(false);
  });
});