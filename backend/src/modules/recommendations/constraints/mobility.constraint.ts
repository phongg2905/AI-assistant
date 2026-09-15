import { Product } from '../../products/entities/product.entity.js';

export class MobilityConstraint {
  static filter(products: Product[], maxWeightKg?: number): Product[] {
    if (!maxWeightKg) return products;
    return products.filter(p => p.specs.weightKg <= maxWeightKg);
  }
}
