import { Product } from '../../products/entities/product.entity.js';

export class PerformanceScorer {
  static calculateRawPerformance(product: Product): number {
    const cpuScore = product.cpuBenchmark ?? (product.specs.ramGb >= 32 ? 14000 : product.specs.ramGb >= 16 ? 11000 : 8000);
    const cpuPart = (Math.min(20000, cpuScore) / 20000) * 60;
    const gpuTgp = product.gpuTGP ?? (product.specs.gpu ? 100 : 35);
    const gpuPart = (Math.min(140, gpuTgp) / 140) * 40;
    return parseFloat((cpuPart + gpuPart).toFixed(2));
  }
}
