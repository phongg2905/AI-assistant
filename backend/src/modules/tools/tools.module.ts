import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module.js';
import { RecommendationsModule } from '../recommendations/recommendations.module.js';
import { BenchmarksModule } from '../benchmarks/benchmarks.module.js';
import { ReviewsModule } from '../reviews/reviews.module.js';
import { ToolsService } from './tools.service.js';
import { SearchProductsTool } from './adapters/search-products.tool.js';
import { GetProductDetailsTool } from './adapters/get-product-details.tool.js';
import { CompareProductsTool } from './adapters/compare-products.tool.js';
import { CalculateScoreTool } from './adapters/calculate-score.tool.js';
import { GetBenchmarkTool } from './adapters/get-benchmark.tool.js';
import { SearchReviewsTool } from './adapters/search-reviews.tool.js';

@Module({
  imports: [ProductsModule, RecommendationsModule, BenchmarksModule, ReviewsModule],
  providers: [
    ToolsService,
    SearchProductsTool,
    GetProductDetailsTool,
    CompareProductsTool,
    CalculateScoreTool,
    GetBenchmarkTool,
    SearchReviewsTool,
  ],
  exports: [ToolsService],
})
export class ToolsModule {}
