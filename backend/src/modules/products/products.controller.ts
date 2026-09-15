import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { FindProductsDto } from './dto/find-products.dto.js';
import { Product } from './entities/product.entity.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() query: FindProductsDto): Promise<Product[]> {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return this.productsService.findById(id);
  }
}
