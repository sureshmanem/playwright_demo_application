import { test, expect } from '@playwright/test';
import { generatePlaywrightSteps, PlaywrightStep } from '../utils/generatePlaywrightSteps';
import { executePlaywrightStep } from '../utils/executePlaywrightStep';

// Example: Autonomous test execution with action mapping

test('Autonomously generate and execute mapped Playwright steps', async ({ page }) => {
  const prompt = 'Test the process of adding a new insurance policy quote via the web form. Use the base URL http://localhost:8000 for all navigation.';
  const steps: PlaywrightStep[] = await generatePlaywrightSteps(prompt);

  for (const step of steps) {
    console.log('Executing step:', step);
    await executePlaywrightStep(page, step);
  }

  // Add assertions as needed
  expect(await page.isVisible('table')).toBe(true);
});
