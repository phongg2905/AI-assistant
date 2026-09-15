import { Injectable } from '@nestjs/common';
import { BaseCrawler } from './base.crawler.js';
import { Product } from '../../products/entities/product.entity.js';

@Injectable()
export class PhongvuCrawler implements BaseCrawler {
  readonly sourceName = 'phongvu' as const;

  async fetchProducts(): Promise<Product[]> {
    return [
      {
        id: 'phongvu-thinkpad-p16s',
        name: 'Lenovo ThinkPad P16s Gen 2 Ryzen 7',
        brand: 'Lenovo',
        priceVnd: 34500000,
        imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef',
        productUrl: 'https://phongvu.vn/lenovo-thinkpad-p16s.html',
        source: 'phongvu',
        specs: {
          cpu: 'AMD Ryzen 7 PRO 7840U',
          ramGb: 32,
          storageGb: 1024,
          screenSizeInch: 16.0,
          weightKg: 1.7,
        },
        inStock: true,
      },
    ];
  }
}
