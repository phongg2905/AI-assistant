import { Product } from '../../products/entities/product.entity.js';

export class HardwareConstraint {
  static filter(
    products: Product[],
    requirements?: {
      minRamGb?: number;
      minStorageGb?: number;
      requiresDedicatedGpu?: boolean;
    }
  ): Product[] {
    if (!requirements) return products;

    return products.filter(p => {
      if (requirements.minRamGb && p.specs.ramGb < requirements.minRamGb) return false;
      if (requirements.minStorageGb && p.specs.storageGb < requirements.minStorageGb) return false;
      if (requirements.requiresDedicatedGpu && !p.specs.gpu?.toLowerCase().includes('rtx') && !p.specs.gpu?.toLowerCase().includes('gtx')) {
        return false;
      }
      return true;
    });
  }
}
