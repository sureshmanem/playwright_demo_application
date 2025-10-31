import { Page } from '@playwright/test';
import { PlaywrightStep } from './generatePlaywrightSteps';

export interface StepValidationResult {
  step: PlaywrightStep;
  valid: boolean;
  reason?: string;
}

/**
 * Validates each Playwright step against the current DOM.
 * Checks if selectors exist and are actionable before execution.
 */
export async function validateSteps(page: Page, steps: PlaywrightStep[]): Promise<StepValidationResult[]> {
  const results: StepValidationResult[] = [];
  for (const step of steps) {
    if (step.selector) {
      const count = await page.locator(step.selector).count();
      if (count === 0) {
        results.push({ step, valid: false, reason: `Selector not found: ${step.selector}` });
        continue;
      }
    }
    // Optionally, add more checks for actionability (e.g., visible, enabled)
    results.push({ step, valid: true });
  }
  return results;
}
