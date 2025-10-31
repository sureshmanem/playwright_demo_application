import { test, expect } from '@playwright/test';
import { generateTestData } from '../utils/generateTestData';
import { PolicyTestData } from '../utils/types';

test('Generate valid policy test data', async () => {
  const schema = {
    applicant_name: 'string',
    policy_type: 'string',
    coverage_amount: 'number',
    premium: 'number'
  };
  const prompt = 'Generate a realistic insurance policy quote for a new applicant.';

  const testData: PolicyTestData = await generateTestData(prompt, schema);

  expect(typeof testData.applicant_name).toBe('string');
  expect(['Auto', 'Home', 'Life']).toContain(testData.policy_type);
  expect(typeof testData.coverage_amount).toBe('number');
  expect(typeof testData.premium).toBe('number');
});
