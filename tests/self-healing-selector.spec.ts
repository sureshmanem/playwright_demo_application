import { test } from './fixtures/selfHealing.fixture';
import { expect } from '@playwright/test';

// This test demonstrates self-healing selector recovery with log and patch
import { patchSelectorInFile } from '../utils/patchSelectorInFile';

test('Self-healing selector: log and patch', async ({ page, recoverSelector }) => {
  await page.goto('http://localhost:8000');
  try {
    // Intentionally use a selector that may fail
  await page.click('button[data-testid="add-quote"]');
  } catch (error) {
    // Attempt to recover with AI-suggested selector
    const newSelector = await recoverSelector({
      page,
  failingCode: "await page.click('button[data-testid=\"add-quote\"]')",
      error: String(error),
      testFile: __filename,
  selector: 'button[data-testid="add-quote"]'
    });
    console.log('AI suggested selector:', newSelector);
    console.log('AI suggested selector:', newSelector);
    if (newSelector) {
      const count = await page.locator(newSelector).count();
      if (count === 0) {
        // Optionally, log the DOM for debugging
        const dom = await page.content();
        console.error('Selector not found in DOM:', newSelector);
        console.error('Current DOM snapshot:', dom);
        throw new Error(`AI-suggested selector "${newSelector}" not found in DOM.`);
      }
      await page.click(newSelector);
      // Patch the test file for future runs
  patchSelectorInFile(__filename, 'button[data-testid="add-quote"]', newSelector);
      // Assert that the UI responds as expected (customize as needed)
      await expect(page.locator('form')).toBeVisible();
    } else {
      throw new Error('No new selector suggested by AI');
    }
  }
});
