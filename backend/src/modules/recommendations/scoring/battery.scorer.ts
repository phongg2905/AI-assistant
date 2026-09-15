import { Product } from '../../products/entities/product.entity.js';

export class BatteryScorer {
  static scoreBattery(product: Product): number {
    const wh = product.specs.batteryWattHours ?? 55;
    if (wh >= 80) return 9.5;
    if (wh >= 70) return 8.8;
    if (wh >= 55) return 8.0;
    if (wh >= 45) return 7.0;
    return 6.0;
  }
}
