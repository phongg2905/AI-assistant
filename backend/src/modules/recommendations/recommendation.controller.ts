import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { RecommendationService } from './recommendation.service.js';
import { RecommendDto } from './dto/recommend.dto.js';
import { Product } from '../products/entities/product.entity.js';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  async getRecommendations(@Body() dto: RecommendDto): Promise<Product[]> {
    return this.recommendationService.recommend(dto);
  }

  @Get()
  async getRecommendationsGet(@Query() dto: RecommendDto): Promise<Product[]> {
    return this.recommendationService.recommend(dto);
  }
}
