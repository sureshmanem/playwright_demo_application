import { Page, expect } from '@playwright/test';
import { PlaywrightStep } from './generatePlaywrightSteps';

export async function executePlaywrightStep(page: Page, step: PlaywrightStep): Promise<void> {
  switch (step.action) {
    case 'goto':
      if (typeof step.value === 'string') await page.goto(step.value);
      break;
    case 'click':
      if (step.selector) await page.click(step.selector);
      break;
    case 'fill':
      if (step.selector && typeof step.value === 'string') await page.fill(step.selector, step.value);
      break;
    case 'selectOption':
      if (step.selector && step.value) await page.selectOption(step.selector, String(step.value));
      break;
    case 'check':
      if (step.selector) await page.check(step.selector);
      break;
    case 'uncheck':
      if (step.selector) await page.uncheck(step.selector);
      break;
    case 'expectVisible':
      if (step.selector) await expect(page.locator(step.selector)).toBeVisible();
      break;
    default:
      console.warn('Unknown action:', step);
  }
}
