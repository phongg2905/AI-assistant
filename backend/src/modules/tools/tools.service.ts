import { Injectable } from '@nestjs/common';
import { ITool } from './tool.interface.js';
import { SearchProductsTool } from './adapters/search-products.tool.js';
import { GetProductDetailsTool } from './adapters/get-product-details.tool.js';
import { CompareProductsTool } from './adapters/compare-products.tool.js';
import { CalculateScoreTool } from './adapters/calculate-score.tool.js';
import { GetBenchmarkTool } from './adapters/get-benchmark.tool.js';
import { SearchReviewsTool } from './adapters/search-reviews.tool.js';

@Injectable()
export class ToolsService {
  private tools = new Map<string, ITool>();

  constructor(
    searchProducts: SearchProductsTool,
    getProductDetails: GetProductDetailsTool,
    compareProducts: CompareProductsTool,
    calculateScore: CalculateScoreTool,
    getBenchmark: GetBenchmarkTool,
    searchReviews: SearchReviewsTool,
  ) {
    this.register(searchProducts);
    this.register(getProductDetails);
    this.register(compareProducts);
    this.register(calculateScore);
    this.register(getBenchmark);
    this.register(searchReviews);
  }

  register(tool: ITool) {
    this.tools.set(tool.name, tool);
  }

  getTool(name: string): ITool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): ITool[] {
    return Array.from(this.tools.values());
  }

  async executeTool(name: string, input: any): Promise<any> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool "${name}" is not registered.`);
    }
    return tool.execute(input);
  }
}
