import { describe, it, expect } from 'vitest';
import { BudgetConstraint } from './constraints/budget.constraint.js';
import { Product } from '../products/entities/product.entity.js';

describe('BudgetConstraint', () => {
  const dummyProducts: Product[] = [
    {
      id: '1',
      name: 'Laptop Cheap',
      brand: 'Acer',
      priceVnd: 15000000,
      source: 'gearvn',
      inStock: true,
      specs: { cpu: 'i5', ramGb: 8, storageGb: 256, screenSizeInch: 14, weightKg: 1.4 },
    },
    {
      id: '2',
      name: 'Laptop Mid',
      brand: 'Asus',
      priceVnd: 25000000,
      source: 'gearvn',
      inStock: true,
      specs: { cpu: 'i7', ramGb: 16, storageGb: 512, screenSizeInch: 14, weightKg: 1.3 },
    },
  ];

  it('should filter products exceeding max budget', () => {
    const filtered = BudgetConstraint.filter(dummyProducts, 20000000);
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('1');
  });
});
