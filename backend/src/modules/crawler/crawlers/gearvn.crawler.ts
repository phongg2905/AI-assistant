import { Injectable } from '@nestjs/common';
import { BaseCrawler } from './base.crawler.js';
import { Product } from '../../products/entities/product.entity.js';

@Injectable()
export class GearvnCrawler implements BaseCrawler {
  readonly sourceName = 'gearvn' as const;

  async fetchProducts(): Promise<Product[]> {
    return [
      {
        id: 'gearvn-g14-4060',
        name: 'ASUS ROG Zephyrus G14 RTX 4060',
        brand: 'ASUS',
        priceVnd: 39990000,
        imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed',
        productUrl: 'https://gearvn.com/products/asus-rog-zephyrus-g14.html',
        source: 'gearvn',
        specs: {
          cpu: 'AMD Ryzen 9 8945HS',
          gpu: 'NVIDIA RTX 4060 8GB',
          ramGb: 16,
          storageGb: 1024,
          screenSizeInch: 14.0,
          weightKg: 1.5,
        },
        inStock: true,
      },
    ];
  }
}
