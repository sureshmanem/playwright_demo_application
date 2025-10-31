import fs from 'fs';
import path from 'path';

export interface SelectorSuggestionLog {
  timestamp: string;
  testFile: string;
  failingSelector: string;
  newSelector: string;
  context: {
    error: string;
    domSnapshotPath?: string;
  };
  approved: boolean;
}

const LOG_FILE = path.resolve(__dirname, '../selector-suggestions.log.json');

export function logSelectorSuggestion(entry: Omit<SelectorSuggestionLog, 'timestamp' | 'approved'>) {
  const logEntry: SelectorSuggestionLog = {
    ...entry,
    timestamp: new Date().toISOString(),
    approved: false
  };
  let log: SelectorSuggestionLog[] = [];
  if (fs.existsSync(LOG_FILE)) {
    log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  }
  log.push(logEntry);
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf-8');
}

export function getPendingSuggestions(): SelectorSuggestionLog[] {
  if (!fs.existsSync(LOG_FILE)) return [];
  const log: SelectorSuggestionLog[] = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  return log.filter(entry => !entry.approved);
}

export function approveSuggestion(index: number): boolean {
  if (!fs.existsSync(LOG_FILE)) return false;
  const log: SelectorSuggestionLog[] = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  if (index < 0 || index >= log.length) return false;
  log[index].approved = true;
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf-8');
  return true;
}
