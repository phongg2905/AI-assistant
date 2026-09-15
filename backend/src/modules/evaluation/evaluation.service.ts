import { Injectable } from '@nestjs/common';
import { RecommendationService } from '../recommendations/recommendation.service.js';
import { EVALUATION_TEST_CASES } from './datasets/test-cases.dataset.js';
import { RecommendationRelevanceMetric } from './metrics/recommendation-relevance.metric.js';

@Injectable()
export class EvaluationService {
  constructor(private readonly recommendationService: RecommendationService) {}

  async runOfflineEvaluation() {
    const results = [];
    let totalScore = 0;

    for (const testCase of EVALUATION_TEST_CASES) {
      const recs = await this.recommendationService.recommend({
        budgetMaxVnd: testCase.expectedMaxBudget,
        minRamGb: testCase.expectedMinRam,
        usagePurpose: testCase.expectedCategory,
      });

      const score = RecommendationRelevanceMetric.evaluateTestCase(testCase, recs);
      totalScore += score;
      results.push({
        testCaseId: testCase.id,
        query: testCase.query,
        score,
        topProduct: recs[0]?.name,
      });
    }

    const averageScore = totalScore / (EVALUATION_TEST_CASES.length || 1);
    return { averageScore, results };
  }
}
