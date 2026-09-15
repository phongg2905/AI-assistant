import { Module } from '@nestjs/common';
import { ToolsModule } from '../tools/tools.module.js';
import { RecommendationsModule } from '../recommendations/recommendations.module.js';
import { IntentExtractorService } from './orchestrator/intent-extractor.service.js';
import { ResponseGeneratorService } from './orchestrator/response-generator.service.js';
import { AIOrchestratorService } from './orchestrator/ai-orchestrator.service.js';

@Module({
  imports: [ToolsModule, RecommendationsModule],
  providers: [IntentExtractorService, ResponseGeneratorService, AIOrchestratorService],
  exports: [AIOrchestratorService, IntentExtractorService, ResponseGeneratorService],
})
export class AIModule {}
