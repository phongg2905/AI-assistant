import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module.js';
import { RecommendationService } from './recommendation.service.js';
import { RecommendationController } from './recommendation.controller.js';
import { RankingService } from './ranking/ranking.service.js';
import { TradeOffService } from './trade-offs/trade-off.service.js';

@Module({
  imports: [ProductsModule],
  controllers: [RecommendationController],
  providers: [RecommendationService, RankingService, TradeOffService],
  exports: [RecommendationService, RankingService, TradeOffService],
})
export class RecommendationsModule {}
