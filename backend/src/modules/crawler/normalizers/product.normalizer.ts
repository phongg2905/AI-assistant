import { Product } from '../../products/entities/product.entity.js';

export class ProductNormalizer {
  static normalizePrice(rawPrice: string | number): number {
    if (typeof rawPrice === 'number') return rawPrice;
    const clean = rawPrice.replace(/[^\d]/g, '');
    return parseInt(clean, 10) || 0;
  }

  static normalizeRam(rawRam: string | number): number {
    if (typeof rawRam === 'number') return rawRam;
    const match = rawRam.match(/(\d+)\s*gb/i);
    return match ? parseInt(match[1], 10) : 16;
  }
}
