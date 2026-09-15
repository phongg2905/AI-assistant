import { Product } from '../../products/entities/product.entity.js';

export class BudgetConstraint {
  static filter(products: Product[], maxBudgetVnd?: number, minBudgetVnd?: number): Product[] {
    return products.filter(p => {
      if (maxBudgetVnd !== undefined && p.priceVnd > maxBudgetVnd) return false;
      if (minBudgetVnd !== undefined && p.priceVnd < minBudgetVnd) return false;
      return true;
    });
  }
}
