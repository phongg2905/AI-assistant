import { Product } from '../../products/entities/product.entity.js';
import { PerformanceScorer } from './performance.scorer.js';

export class ValueScorer {
  /**
   * Deterministic Value/Price Score (0-10 scale):
   * Ratio of performance to price in millions VND.
   */
  static scoreValue(product: Product): number {
    const perf = PerformanceScorer.calculateRawPerformance(product);
    const priceM = Math.max(10, product.priceVnd / 1_000_000);
    const ratio = (perf / priceM) * 3.5;
    return Math.min(9.9, Math.max(5.0, parseFloat(ratio.toFixed(2))));
  }
}
