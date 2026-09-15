import { Product } from '../../products/entities/product.entity.js';

export class ProductValidator {
  static isValidProduct(raw: Partial<Product>): boolean {
    if (!raw.name || typeof raw.name !== 'string') return false;
    if (!raw.priceVnd || raw.priceVnd <= 0) return false;
    if (!raw.specs || !raw.specs.cpu || !raw.specs.ramGb) return false;
    return true;
  }
}
