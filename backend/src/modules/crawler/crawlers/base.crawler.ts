import { Product } from '../../products/entities/product.entity.js';

export interface BaseCrawler {
  readonly sourceName: 'gearvn' | 'cellphones' | 'phongvu';
  fetchProducts(): Promise<Product[]>;
}
