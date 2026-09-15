import { describe, it, expect } from 'vitest';
import { MobilityScorer } from './scoring/mobility.scorer.js';
import { Product } from '../products/entities/product.entity.js';

describe('MobilityScorer', () => {
  const ultraLightProduct: Product = {
    id: '1',
    name: 'Ultra Lightweight Laptop',
    brand: 'Apple',
    priceVnd: 28000000,
    source: 'cellphones',
    inStock: true,
    specs: { cpu: 'M2', ramGb: 16, storageGb: 512, screenSizeInch: 13.3, weightKg: 1.2 },
  };

  it('should give high mobility score to laptops under 1.25kg', () => {
    const score = MobilityScorer.scoreMobility(ultraLightProduct);
    expect(score).toBeGreaterThanOrEqual(9.5);
  });
});
