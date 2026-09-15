import { Injectable } from '@nestjs/common';
import { ITool } from '../tool.interface.js';
import { ProductsService } from '../../products/products.service.js';
import { RankingService, UserWeights } from '../../recommendations/ranking/ranking.service.js';
import { Product } from '../../products/entities/product.entity.js';

export interface CalculateScoreInput {
  productId: string;
  weights?: UserWeights;
}

@Injectable()
export class CalculateScoreTool implements ITool<CalculateScoreInput, Product> {
  readonly name = 'calculate_score';
  readonly description = 'Calculate deterministic multi-attribute score for a laptop';

  constructor(
    private readonly productsService: ProductsService,
    private readonly rankingService: RankingService,
  ) {}

  async execute(input: CalculateScoreInput): Promise<Product> {
    const product = await this.productsService.findById(input.productId);
    const ranked = this.rankingService.rank([product], input.weights);
    return ranked[0];
  }
}
