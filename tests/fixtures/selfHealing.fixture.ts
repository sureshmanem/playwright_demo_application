import { test as base, expect, Page } from '@playwright/test';
import { suggestNewSelector } from '../../utils/suggestNewSelector';
import { logSelectorSuggestion } from '../../utils/selectorSuggestionLog';

export const test = base.extend<{ recoverSelector: (params: {
  page: Page;
  failingCode: string;
  error: string;
  testFile: string;
  selector: string;
}) => Promise<string> }>({
  recoverSelector: async ({}, use) => {
    await use(async ({ page, failingCode, error, testFile, selector }) => {
      const domSnapshot = await page.content();
      const newSelector = await suggestNewSelector(failingCode, error, domSnapshot);
      logSelectorSuggestion({
        testFile,
        failingSelector: selector,
        newSelector,
        context: { error }
      });
      return newSelector;
    });
  },
});
