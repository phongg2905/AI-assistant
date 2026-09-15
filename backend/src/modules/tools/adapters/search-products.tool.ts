import { Injectable } from '@nestjs/common';
import { ITool } from '../tool.interface.js';
import { ProductsService } from '../../products/products.service.js';
import { FindProductsDto } from '../../products/dto/find-products.dto.js';
import { Product } from '../../products/entities/product.entity.js';

@Injectable()
export class SearchProductsTool implements ITool<FindProductsDto, Product[]> {
  readonly name = 'search_products';
  readonly description = 'Search laptops in catalog by budget, brand, ram, or query text';

  constructor(private readonly productsService: ProductsService) {}

  async execute(input: FindProductsDto): Promise<Product[]> {
    return this.productsService.findAll(input);
  }
}
