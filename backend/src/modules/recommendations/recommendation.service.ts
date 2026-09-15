import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service.js';
import { Product } from '../products/entities/product.entity.js';
import { RecommendDto } from './dto/recommend.dto.js';
import { BudgetConstraint } from './constraints/budget.constraint.js';
import { HardwareConstraint } from './constraints/hardware.constraint.js';
import { MobilityConstraint } from './constraints/mobility.constraint.js';
import { RankingService, UserWeights } from './ranking/ranking.service.js';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly rankingService: RankingService,
  ) {}

  async recommend(dto: RecommendDto): Promise<Product[]> {
    const allProducts = await this.productsService.findAll();

    // 1. Filter with Constraints
    let filtered = BudgetConstraint.filter(allProducts, dto.budgetMaxVnd, dto.budgetMinVnd);
    filtered = HardwareConstraint.filter(filtered, {
      minRamGb: dto.minRamGb,
      minStorageGb: dto.minStorageGb,
      requiresDedicatedGpu: dto.requiresDedicatedGpu,
    });
    filtered = MobilityConstraint.filter(filtered, dto.maxWeightKg);

    // If constraints are too strict and return empty, fall back to relaxed budget/hardware
    if (filtered.length === 0) {
      filtered = allProducts;
    }

    // 2. Determine Weights based on usagePurpose
    const weights: UserWeights = {};
    if (dto.usagePurpose === 'gaming' || dto.usagePurpose === 'ai') {
      weights.performance = 0.50;
      weights.mobility = 0.15;
      weights.battery = 0.15;
      weights.value = 0.20;
    } else if (dto.usagePurpose === 'office' || dto.usagePurpose === 'student') {
      weights.performance = 0.20;
      weights.mobility = 0.35;
      weights.battery = 0.25;
      weights.value = 0.20;
    } else {
      weights.performance = 0.35;
      weights.mobility = 0.25;
      weights.battery = 0.20;
      weights.value = 0.20;
    }

    // 3. Rank Deterministically
    return this.rankingService.rank(filtered, weights);
  }
}
