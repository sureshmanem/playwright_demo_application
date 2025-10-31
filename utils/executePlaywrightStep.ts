import { Page, expect } from '@playwright/test';
import { PlaywrightStep } from './generatePlaywrightSteps';

export async function executePlaywrightStep(page: Page, step: PlaywrightStep): Promise<void> {
  switch (step.action) {
    case 'goto':
      if (typeof step.value === 'string') await page.goto(step.value);
      break;
    case 'click':
      if (step.selector) {
        const count = await page.locator(step.selector).count();
        if (count === 0) {
          console.warn(`Selector not found for click: ${step.selector}`);
          break;
        }
        await page.click(step.selector);
      }
      break;
    case 'fill':
      if (step.selector && typeof step.value === 'string') {
        const count = await page.locator(step.selector).count();
        if (count === 0) {
          console.warn(`Selector not found for fill: ${step.selector}`);
          break;
        }
        await page.fill(step.selector, step.value);
      }
      break;
    case 'selectOption':
      if (step.selector && step.value) {
        const count = await page.locator(step.selector).count();
        if (count === 0) {
          console.warn(`Selector not found for selectOption: ${step.selector}`);
          break;
        }
        await page.selectOption(step.selector, String(step.value));
      }
      break;
    case 'check':
      if (step.selector) {
        const count = await page.locator(step.selector).count();
        if (count === 0) {
          console.warn(`Selector not found for check: ${step.selector}`);
          break;
        }
        await page.check(step.selector);
      }
      break;
    case 'uncheck':
      if (step.selector) {
        const count = await page.locator(step.selector).count();
        if (count === 0) {
          console.warn(`Selector not found for uncheck: ${step.selector}`);
          break;
        }
        await page.uncheck(step.selector);
      }
      break;
    case 'expectVisible':
      if (step.selector) await expect(page.locator(step.selector)).toBeVisible();
      break;
    default:
      console.warn('Unknown action:', step);
  }
}
