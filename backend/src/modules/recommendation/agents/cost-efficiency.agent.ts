import { Injectable } from '@nestjs/common';
import { Product } from '../../products/product.entity.js';

export interface ScoredProduct extends Product {
  ppScoreComputed: number;
  ppLabel: string;
}

@Injectable()
export class CostEfficiencyAgent {
  score(products: Product[]): ScoredProduct[] {
    return products
      .map((p) => {
        const perf = p.cpuBenchmark * 0.6 + p.gpuTGP * 42 + (p.batteryWh > 60 ? 400 : 0);
        // normalize to 0-10 scale, blend with original ppScore to keep familiar range
        const raw = (perf / p.priceNum) * 12200;
        const pp = parseFloat((p.ppScore * 0.7 + Math.min(9.6, Math.max(6.0, raw)) * 0.3).toFixed(1));
        const label = pp >= 8.5 ? 'BEST P/P' : pp >= 7.8 ? 'Tốt' : 'Trung bình';
        return { ...p, ppScoreComputed: pp, ppLabel: label, ppScore: pp } as ScoredProduct;
      })
      .sort((a, b) => b.ppScoreComputed - a.ppScoreComputed);
  }
}
