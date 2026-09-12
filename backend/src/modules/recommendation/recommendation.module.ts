import { Module } from '@nestjs/common';
import { RecommendationService } from './recommendation.service.js';
import { RecommendationController } from './recommendation.controller.js';
import { ProductsModule } from '../products/products.module.js';
import { CacheModule } from '../cache/cache.module.js';
import { TelemetryModule } from '../telemetry/telemetry.module.js';
import { PipelineModule } from '../pipeline/pipeline.module.js';
import { IntentAgent } from './agents/intent.agent.js';
import { ClarificationAgent } from './agents/clarification.agent.js';
import { GraphRAGAgent } from './agents/graph-rag.agent.js';
import { TradeOffAgent } from './agents/tradeoff.agent.js';
import { CostEfficiencyAgent } from './agents/cost-efficiency.agent.js';
import { ChitChatAgent } from './agents/chitchat.agent.js';

@Module({
  imports: [ProductsModule, CacheModule, TelemetryModule, PipelineModule],
  controllers: [RecommendationController],
  providers: [
    RecommendationService,
    IntentAgent,
    ClarificationAgent,
    GraphRAGAgent,
    TradeOffAgent,
    CostEfficiencyAgent,
    ChitChatAgent,
  ],
  exports: [RecommendationService],
})
export class RecommendationModule {}
