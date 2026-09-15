export interface EvaluationTestCase {
  id: string;
  query: string;
  expectedCategory: string;
  expectedMinRam?: number;
  expectedMaxBudget?: number;
}

export const EVALUATION_TEST_CASES: EvaluationTestCase[] = [
  {
    id: 'case-1',
    query: 'Tư vấn laptop dưới 30 triệu học CNTT chạy Docker',
    expectedCategory: 'coding',
    expectedMinRam: 16,
    expectedMaxBudget: 30000000,
  },
  {
    id: 'case-2',
    query: 'Laptop gaming tầm 40 triệu màn hình OLED',
    expectedCategory: 'gaming',
    expectedMaxBudget: 40000000,
  },
  {
    id: 'case-3',
    query: 'Laptop văn phòng mỏng nhẹ dưới 1.3kg pin trâu',
    expectedCategory: 'office',
  },
];
