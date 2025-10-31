import fs from 'fs';

/**
 * Patch a test file by replacing the old selector with the new selector.
 * @param filePath Path to the test file
 * @param oldSelector The selector string to replace
 * @param newSelector The new selector string
 * @returns true if patch was applied, false otherwise
 */
export function patchSelectorInFile(filePath: string, oldSelector: string, newSelector: string): boolean {
  if (!fs.existsSync(filePath)) return false;
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!content.includes(oldSelector)) return false;
  const patched = content.replace(new RegExp(oldSelector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newSelector);
  fs.writeFileSync(filePath, patched, 'utf-8');
  return true;
}
