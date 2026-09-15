import { Injectable } from '@nestjs/common';
import { BaseCrawler } from './base.crawler.js';
import { Product } from '../../products/entities/product.entity.js';

@Injectable()
export class CellphonesCrawler implements BaseCrawler {
  readonly sourceName = 'cellphones' as const;

  async fetchProducts(): Promise<Product[]> {
    return [
      {
        id: 'cellphone-mac-m2',
        name: 'MacBook Air M2 13-inch 16GB 512GB',
        brand: 'Apple',
        priceVnd: 28990000,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        productUrl: 'https://cellphones.com.vn/macbook-air-m2.html',
        source: 'cellphones',
        specs: {
          cpu: 'Apple M2 8-core',
          ramGb: 16,
          storageGb: 512,
          screenSizeInch: 13.6,
          weightKg: 1.24,
        },
        inStock: true,
      },
    ];
  }
}
