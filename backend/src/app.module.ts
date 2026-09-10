import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProductsModule } from './modules/products/products.module.js';
import { RecommendationModule } from './modules/recommendation/recommendation.module.js';
import { CacheModule } from './modules/cache/cache.module.js';
import { TelemetryModule } from './modules/telemetry/telemetry.module.js';
import { VoiceModule } from './modules/voice/voice.module.js';
import { CrawlerModule } from './modules/crawler/crawler.module.js';

@Module({
  imports: [ProductsModule, RecommendationModule, CacheModule, TelemetryModule, VoiceModule, CrawlerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
