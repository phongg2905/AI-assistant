import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { ProductsModule } from './modules/products/products.module.js';
import { RecommendationsModule } from './modules/recommendations/recommendations.module.js';
import { ChatModule } from './modules/chat/chat.module.js';
import { ConversationsModule } from './modules/conversations/conversations.module.js';
import { AIModule } from './modules/ai/ai.module.js';
import { ToolsModule } from './modules/tools/tools.module.js';
import { ReviewsModule } from './modules/reviews/reviews.module.js';
import { BenchmarksModule } from './modules/benchmarks/benchmarks.module.js';
import { RetrievalModule } from './modules/retrieval/retrieval.module.js';
import { MemoryModule } from './modules/memory/memory.module.js';
import { CrawlerModule } from './modules/crawler/crawler.module.js';
import { EvaluationModule } from './modules/evaluation/evaluation.module.js';
import { VoiceModule } from './modules/voice/voice.module.js';
import { TelemetryModule } from './modules/telemetry/telemetry.module.js';
import { CacheModule } from './modules/cache/cache.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';

@Module({
  imports: [
    ProductsModule,
    RecommendationsModule,
    ChatModule,
    ConversationsModule,
    AIModule,
    ToolsModule,
    ReviewsModule,
    BenchmarksModule,
    RetrievalModule,
    MemoryModule,
    CrawlerModule,
    EvaluationModule,
    VoiceModule,
    TelemetryModule,
    CacheModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
