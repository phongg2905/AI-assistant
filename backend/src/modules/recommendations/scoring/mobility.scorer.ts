import { Product } from '../../products/entities/product.entity.js';

export class MobilityScorer {
  static scoreMobility(product: Product): number {
    const w = product.weightNum ?? product.specs.weightKg;
    if (w <= 1.25) return 9.8;
    if (w <= 1.4) return 9.2;
    if (w <= 1.6) return 8.5;
    if (w <= 1.9) return 7.6;
    if (w <= 2.2) return 6.8;
    return 5.8;
  }
}
