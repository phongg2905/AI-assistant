import { Injectable } from '@nestjs/common';
import { ITool } from '../tool.interface.js';
import { ProductsService } from '../../products/products.service.js';
import { TradeOffService } from '../../recommendations/trade-offs/trade-off.service.js';
import { Product } from '../../products/entities/product.entity.js';

export interface CompareProductsInput {
  ids: string[];
}

export interface CompareProductsOutput {
  products: Product[];
  tradeOffs: Record<string, string[]>;
}

@Injectable()
export class CompareProductsTool implements ITool<CompareProductsInput, CompareProductsOutput> {
  readonly name = 'compare_products';
  readonly description = 'Compare 2 to 4 laptops side by side with trade-off analysis';

  constructor(
    private readonly productsService: ProductsService,
    private readonly tradeOffService: TradeOffService,
  ) {}

  async execute(input: CompareProductsInput): Promise<CompareProductsOutput> {
    const products: Product[] = [];
    for (const id of input.ids) {
      const p = await this.productsService.findById(id).catch(() => null);
      if (p) products.push(p);
    }

    const tradeOffs: Record<string, string[]> = {};
    for (const p of products) {
      const other = products.find(o => o.id !== p.id);
      tradeOffs[p.id] = this.tradeOffService.generateTradeOffs(p, other);
    }

    return { products, tradeOffs };
  }
}
