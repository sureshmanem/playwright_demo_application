#!/usr/bin/env node
// review-approve-selectors.js
// Usage: node review-approve-selectors.js


const fs = require('fs');
const path = require('path');
const readline = require('readline');

const LOG_FILE = path.resolve(__dirname, 'selector-suggestions.log.json');

function getPendingSuggestions() {
  if (!fs.existsSync(LOG_FILE)) return [];
  const log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  return log.filter(entry => !entry.approved);
}

function approveSuggestion(index) {
  if (!fs.existsSync(LOG_FILE)) return false;
  const log = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  if (index < 0 || index >= log.length) return false;
  log[index].approved = true;
  fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2), 'utf-8');
  return true;
}

function printSuggestion(s, idx) {
  console.log(`\n[${idx}]`);
  console.log(`Test File: ${s.testFile}`);
  console.log(`Failing Selector: ${s.failingSelector}`);
  console.log(`Suggested Selector: ${s.newSelector}`);
  console.log(`Error: ${s.context.error}`);
  if (s.context.domSnapshotPath) {
    console.log(`DOM Snapshot Path: ${s.context.domSnapshotPath}`);
  }
  console.log(`Approved: ${s.approved}`);
}

async function main() {
  if (!fs.existsSync(LOG_FILE)) {
    console.log('No selector-suggestions.log.json file found.');
    return;
  }
  const fullLog = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
  const pending = fullLog.filter(entry => !entry.approved);
  if (!pending.length) {
    console.log('No pending selector suggestions to review.');
    return;
  }
  console.log(`Found ${pending.length} pending selector suggestion(s):`);
  pending.forEach(printSuggestion);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('\nEnter the index of the suggestion to approve (or press Enter to skip): ', (answer) => {
    const idx = parseInt(answer, 10);
    if (!isNaN(idx) && idx >= 0 && idx < pending.length) {
      // Find the index in the full log (not just pending)
      const suggestion = pending[idx];
      const realIdx = fullLog.findIndex(e => e.timestamp === suggestion.timestamp && e.testFile === suggestion.testFile);
      if (realIdx !== -1) {
        if (approveSuggestion(realIdx)) {
          console.log(`Approved suggestion [${idx}] for test file: ${suggestion.testFile}`);
        } else {
          console.log('Failed to approve suggestion.');
        }
      } else {
        console.log('Could not find suggestion in log.');
      }
    } else {
      console.log('No suggestion approved.');
    }
    rl.close();
  });
}

main();
