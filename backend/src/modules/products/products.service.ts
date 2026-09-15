import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository.js';
import { Product } from './entities/product.entity.js';
import { FindProductsDto } from './dto/find-products.dto.js';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async findAll(dto?: FindProductsDto): Promise<Product[]> {
    return this.productsRepository.findAll(dto);
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  async create(product: Product): Promise<Product> {
    return this.productsRepository.create(product);
  }

  async upsertMany(products: Product[]): Promise<number> {
    return this.productsRepository.upsertMany(products);
  }
}
