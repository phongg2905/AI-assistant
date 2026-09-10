import { Injectable } from '@nestjs/common';
import { ProductsService } from '../../products/products.service.js';
import { Product } from '../../products/product.entity.js';
import { IntentResult } from './intent.agent.js';

export interface GraphRAGResult {
  candidates: Product[];
  graphHits: { laptop: string; relation: string; benchmark: number }[];
  vectorHits: { review: string; score: number }[];
  elapsedMs: number;
}

@Injectable()
export class GraphRAGAgent {
  constructor(private readonly products: ProductsService) {}

  async retrieve(intent: IntentResult): Promise<GraphRAGResult> {
    const start = Date.now();
    // Simulate Neo4j + Qdrant latency
    await new Promise((r) => setTimeout(r, 120 + Math.random() * 80));

    const tags = intent.rawTags;
    const software = tags.find((t) => ['Valorant', 'Genshin Impact', 'Gaming'].includes(t)) || tags[0];
    const minBenchmark = intent.implicit.minRamGB ? 12000 : 10000;

    // Knowledge Graph: CAN_RUN
    const graphHits = this.products
      .graphQuery({ software, minBenchmark })
      .slice(0, 6)
      .map((g) => ({ laptop: g.laptop.name, relation: g.relation, benchmark: g.laptop.cpuBenchmark }));

    // Vector DB hybrid: mock reviews
    const vectorHits = [
      { review: 'Bàn phím gõ tốt, hành trình sâu - hợp code đêm', score: 0.88 },
      { review: 'Quạt ồn nhưng tản nhiệt ổn khi chơi Valorant 3 tiếng', score: 0.82 },
      { review: 'OLED rực rỡ nhưng hao pin hơn IPS 15%', score: 0.79 },
    ];

    // Hybrid candidates: search by constraints
    const candidates = this.products.search({
      budgetMin: intent.budgetMin,
      budgetMax: intent.budgetMax,
      minRamGB: intent.implicit.minRamGB,
      needDiscreteGPU: intent.implicit.needDiscreteGPU,
      maxWeightKg: intent.implicit.maxWeightKg,
      tags,
    });

    return {
      candidates,
      graphHits,
      vectorHits,
      elapsedMs: Date.now() - start,
    };
  }
}
