import { Injectable } from '@nestjs/common';
import { Product } from '../../products/entities/product.entity.js';
import { PerformanceScorer } from '../scoring/performance.scorer.js';
import { MobilityScorer } from '../scoring/mobility.scorer.js';
import { BatteryScorer } from '../scoring/battery.scorer.js';
import { ValueScorer } from '../scoring/value.scorer.js';
import { TradeOffService } from '../trade-offs/trade-off.service.js';

export interface UserWeights {
  performance?: number; // default 0.35
  mobility?: number;    // default 0.25
  battery?: number;     // default 0.20
  value?: number;       // default 0.20
}

@Injectable()
export class RankingService {
  constructor(private readonly tradeOffService: TradeOffService) {}

  rank(products: Product[], weights?: UserWeights): Product[] {
    const wPerf = weights?.performance ?? 0.35;
    const wMob = weights?.mobility ?? 0.25;
    const wBat = weights?.battery ?? 0.20;
    const wVal = weights?.value ?? 0.20;

    const scored = products.map(product => {
      const perfScore = (PerformanceScorer.calculateRawPerformance(product) / 100) * 10;
      const mobScore = MobilityScorer.scoreMobility(product);
      const batScore = BatteryScorer.scoreBattery(product);
      const valScore = ValueScorer.scoreValue(product);

      const compositeScore = (perfScore * wPerf) + (mobScore * wMob) + (batScore * wBat) + (valScore * wVal);
      const matchScore = parseFloat(compositeScore.toFixed(2));
      const tradeOffNotes = this.tradeOffService.generateTradeOffs(product);

      return {
        ...product,
        score: matchScore,
        matchScore,
        tradeOffNotes,
      };
    });

    // Deterministic sorting: matchScore descending, then price ascending, then id
    return scored.sort((a, b) => {
      if ((b.matchScore ?? 0) !== (a.matchScore ?? 0)) {
        return (b.matchScore ?? 0) - (a.matchScore ?? 0);
      }
      if (a.priceVnd !== b.priceVnd) {
        return a.priceVnd - b.priceVnd;
      }
      return a.id.localeCompare(b.id);
    });
  }
}
