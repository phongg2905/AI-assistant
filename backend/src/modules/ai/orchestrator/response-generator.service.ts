import { Injectable } from '@nestjs/common';
import { Product } from '../../products/entities/product.entity.js';

@Injectable()
export class ResponseGeneratorService {
  formatRecommendationResponse(products: Product[], targetUse?: string): string {
    if (!products || products.length === 0) {
      return 'Dạ rất tiếc, TechWise không tìm thấy mẫu laptop nào hoàn toàn khớp với tiêu chí khắt khe này. Bạn có thể nới lỏng ngân sách hoặc dung lượng RAM một chút nhé!';
    }

    const top = products[0];
    let intro = `Dạ TechWise xin gợi ý cho bạn các mẫu laptop tối ưu nhất`;
    if (targetUse) {
      intro += ` cho nhu cầu **${targetUse}**`;
    }
    intro += `:\n\n`;

    const items = products.slice(0, 3).map((p, idx) => {
      const priceM = (p.priceVnd / 1_000_000).toLocaleString('vi-VN');
      const specs = `${p.specs.cpu} | ${p.specs.ramGb}GB RAM | ${p.specs.storageGb}GB SSD | ${p.specs.weightKg}kg`;
      const score = p.matchScore ? ` (Điểm phù hợp: **${p.matchScore}/10**)` : '';
      const notes = p.tradeOffNotes && p.tradeOffNotes.length > 0 ? `\n   💡 *${p.tradeOffNotes[0]}*` : '';
      return `${idx + 1}. **${p.name}** - **${priceM} triệu VNĐ**${score}\n   - Cấu hình: ${specs}${notes}`;
    }).join('\n\n');

    return `${intro}${items}\n\nBạn có muốn so sánh chi tiết hoặc xem điểm benchmark cụ thể của mẫu nào không?`;
  }

  formatComparisonResponse(result: { products: Product[]; tradeOffs: Record<string, string[]> }): string {
    if (!result.products || result.products.length === 0) {
      return 'Không tìm thấy sản phẩm hợp lệ để so sánh.';
    }

    let out = `### 📊 Bảng So Sánh Chi Tiết\n\n`;
    for (const p of result.products) {
      const priceM = (p.priceVnd / 1_000_000).toLocaleString('vi-VN');
      out += `#### 💻 ${p.name} (${priceM} triệu VNĐ)\n`;
      out += `- **CPU/GPU**: ${p.specs.cpu} / ${p.specs.gpu || 'Onboard'}\n`;
      out += `- **RAM/SSD**: ${p.specs.ramGb}GB RAM / ${p.specs.storageGb}GB SSD\n`;
      out += `- **Màn hình/Trọng lượng**: ${p.specs.screenSizeInch}" (${p.specs.weightKg}kg)\n`;
      const notes = result.tradeOffs[p.id];
      if (notes && notes.length > 0) {
        out += `- **Ưu/Nhược điểm**:\n  - ${notes.join('\n  - ')}\n`;
      }
      out += `\n`;
    }
    return out;
  }

  formatGeneralResponse(text: string): string {
    return text;
  }
}
