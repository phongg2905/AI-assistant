import { describe, it, expect } from 'vitest';
import { ProductValidator } from './validators/product.validator.js';

describe('ProductValidator', () => {
  it('should validate complete product specs', () => {
    const valid = ProductValidator.isValidProduct({
      name: 'MacBook Air M2',
      priceVnd: 28000000,
      specs: {
        cpu: 'M2',
        ramGb: 16,
        storageGb: 512,
        screenSizeInch: 13.6,
        weightKg: 1.24,
      },
    });
    expect(valid).toBe(true);
  });

  it('should reject invalid product missing price or specs', () => {
    const invalid = ProductValidator.isValidProduct({
      name: 'Bad laptop',
      priceVnd: 0,
    });
    expect(invalid).toBe(false);
  });
});
