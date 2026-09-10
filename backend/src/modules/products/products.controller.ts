import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  findAll(
    @Query('budgetMin') budgetMin?: string,
    @Query('budgetMax') budgetMax?: string,
    @Query('q') q?: string,
  ) {
    if (q || budgetMin || budgetMax) {
      return this.products.search({
        budgetMin: budgetMin ? Number(budgetMin) : undefined,
        budgetMax: budgetMax ? Number(budgetMax) : undefined,
        tags: q ? [q] : undefined,
      });
    }
    return this.products.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const p = this.products.findById(id);
    if (!p) return { error: 'NOT_FOUND', id };
    return p;
  }

  @Get('graph/query')
  graph(@Query('software') software?: string, @Query('minBenchmark') minBenchmark?: string) {
    return this.products.graphQuery({ software, minBenchmark: minBenchmark ? Number(minBenchmark) : undefined });
  }
}
