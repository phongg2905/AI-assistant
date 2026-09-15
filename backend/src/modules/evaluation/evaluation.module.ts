import { Module } from '@nestjs/common';
import { RecommendationsModule } from '../recommendations/recommendations.module.js';
import { EvaluationService } from './evaluation.service.js';

@Module({
  imports: [RecommendationsModule],
  providers: [EvaluationService],
  exports: [EvaluationService],
})
export class EvaluationModule {}
