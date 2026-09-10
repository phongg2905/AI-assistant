export class RecommendDto {
  query!: string;
  budgetMin?: number;
  budgetMax?: number;
  history?: string[]; // previous queries for context
}

export class RecommendResponseDto {
  traceId!: string;
  intent!: {
    budgetMin?: number;
    budgetMax?: number;
    constraints: string[];
    useCases: string[];
  };
  summary!: string;
  clarification?: { question: string; options: string[] } | null;
  products!: any[];
  matrix!: any;
  critiques!: string[];
  graphHits!: any[];
  cache!: { hit: boolean; latencyMs?: number };
  timings!: Record<string, number>;
}

export interface StreamEvent {
  event: 'intent' | 'graph' | 'tradeoff' | 'cost' | 'clarification' | 'final' | 'cache' | 'error';
  data: any;
  latencyMs?: number;
}
