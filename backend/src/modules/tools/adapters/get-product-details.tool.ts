import { Injectable } from '@nestjs/common';
import { ITool } from '../tool.interface.js';
import { ProductsService } from '../../products/products.service.js';
import { Product } from '../../products/entities/product.entity.js';

@Injectable()
export class GetProductDetailsTool implements ITool<{ id: string }, Product> {
  readonly name = 'get_product_details';
  readonly description = 'Get detailed specifications and info of a laptop by its ID';

  constructor(private readonly productsService: ProductsService) {}

  async execute(input: { id: string }): Promise<Product> {
    return this.productsService.findById(input.id);
  }
}
