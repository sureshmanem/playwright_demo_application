import { test, expect } from '@playwright/test';
import { generateTestData } from '../utils/generateTestData';
import { PolicyTestData } from '../utils/types';

test('Generate valid policy test data', async () => {
  const schema = {
      applicant_name: 'string',
      policy_type: ['Auto', 'Home', 'Life'],
      coverage_amount: 'number',
      premium: 'number'
  };
    const prompt = 'Generate a valid insurance policy test data object. The policy_type must be one of: Auto, Home, or Life.';

  const testData: PolicyTestData = await generateTestData(prompt, schema);
    console.log('Generated policy_type:', testData.policy_type);

  expect(typeof testData.applicant_name).toBe('string');
  expect(['Auto', 'Home', 'Life']).toContain(testData.policy_type);
  expect(typeof testData.coverage_amount).toBe('number');
  expect(typeof testData.premium).toBe('number');
});
