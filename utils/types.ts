// utils/types.ts

export interface PolicyTestData {
  applicant_name: string;
  policy_type: 'Auto' | 'Home' | 'Life';
  coverage_amount: number;
  premium: number;
}
