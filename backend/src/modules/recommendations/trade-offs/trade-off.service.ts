import { Injectable } from '@nestjs/common';
import { Product } from '../../products/entities/product.entity.js';

@Injectable()
export class TradeOffService {
  /**
   * Generates deterministic trade-off analysis between products
   */
  generateTradeOffs(product: Product, comparisonBase?: Product): string[] {
    const notes: string[] = [];
    const specs = product.specs;

    if (specs.weightKg <= 1.3) {
      notes.push('Cực kỳ nhẹ và cơ động, nhưng hiệu năng tản nhiệt có thể bị giới hạn khi tải nặng dài hạn.');
    } else if (specs.weightKg >= 1.8) {
      notes.push('Hiệu năng tản nhiệt và sức mạnh phần cứng tốt, nhưng trọng lượng nặng hơn khi mang vác.');
    }

    if (specs.gpu?.toLowerCase().includes('rtx')) {
      notes.push('GPU rời mạnh mẽ cho gaming/AI/render, tuy nhiên thời lượng pin khi dùng tác vụ nặng sẽ giảm nhanh.');
    } else {
      notes.push('Thời lượng pin ấn tượng và mát mẻ, nhưng không phù hợp chơi game AAA hay train model AI nặng.');
    }

    if (specs.ramGb >= 32) {
      notes.push('Dung lượng RAM 32GB tối ưu tuyệt đối cho chạy nhiều Docker containers và mở nhiều IDEs.');
    } else if (specs.ramGb <= 16) {
      notes.push('RAM 16GB đủ dùng tốt cho tác vụ lập trình cơ bản, nhưng cần cân nhắc nếu mở nhiều máy ảo.');
    }

    if (comparisonBase) {
      if (product.priceVnd < comparisonBase.priceVnd) {
        const diffM = Math.round((comparisonBase.priceVnd - product.priceVnd) / 1_000_000);
        notes.push(`Tiết kiệm khoảng ${diffM} triệu VNĐ so với ${comparisonBase.name}.`);
      }
    }

    return notes;
  }
}
