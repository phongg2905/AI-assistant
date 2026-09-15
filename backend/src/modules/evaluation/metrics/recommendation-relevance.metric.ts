import { Product } from '../../products/entities/product.entity.js';
import { EvaluationTestCase } from '../datasets/test-cases.dataset.js';

export class RecommendationRelevanceMetric {
  static evaluateTestCase(testCase: EvaluationTestCase, recommendations: Product[]): number {
    if (!recommendations || recommendations.length === 0) return 0;

    let score = 100;
    const top = recommendations[0];

    if (testCase.expectedMaxBudget && top.priceVnd > testCase.expectedMaxBudget) {
      score -= 40;
    }

    if (testCase.expectedMinRam && top.specs.ramGb < testCase.expectedMinRam) {
      score -= 30;
    }

    return Math.max(0, score);
  }
}
