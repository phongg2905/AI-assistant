import { Injectable } from '@nestjs/common';
import { Product, RecommendationMatrix } from '../../products/product.entity.js';

@Injectable()
export class TradeOffAgent {
  analyze(candidates: Product[]): { matrix: RecommendationMatrix; critiques: string[] } {
    if (!candidates || candidates.length === 0) {
      return {
        matrix: { headers: [], rows: [], analysis: 'Không tìm thấy sản phẩm thỏa mãn tất cả ràng buộc — đã nới lỏng bộ lọc để gợi ý.' },
        critiques: [],
      };
    }
    const headers = candidates.map((c) => c.name);
    const rows = [
      {
        criteria: 'Hiệu năng / Giá',
        values: candidates.map((c) => `${'★'.repeat(Math.round(c.ppScore / 2))} ${c.ppScore}`),
      },
      {
        criteria: 'Trọng lượng',
        values: candidates.map((c) => (c.weightNum <= 1.5 ? `${c.weightNum}kg ✓` : `${c.weightNum}kg`)),
      },
      {
        criteria: 'Pin thực tế',
        values: candidates.map((c) => `~${Math.round(c.batteryWh / 9)}h`),
      },
      {
        criteria: 'Regret 1 năm',
        values: candidates.map((c) => c.regret),
      },
      {
        criteria: 'Nâng cấp',
        values: candidates.map((c) => (c.ramUpgradeable ? 'Có' : 'Hàn chết')),
      },
    ];

    const matrix: RecommendationMatrix = {
      headers,
      rows,
      analysis: this.critique(candidates),
    };

    const critiques = candidates.map((c) => {
      if (c.regret === 'Cao') return `${c.name}: ${c.regretReasons.join('; ') || 'Rủi ro hối hận cao'}`;
      if (c.weightNum > 2.2) return `${c.name}: Nặng, không hợp mang vác hàng ngày`;
      if (!c.ramUpgradeable) return `${c.name}: RAM hàn chết, cân nhắc nhu cầu 2 năm tới`;
      return `${c.name}: Cân bằng`;
    });

    return { matrix, critiques };
  }

  private critique(candidates: Product[]): string {
    if (!candidates || candidates.length === 0) return 'Chưa có ứng viên để so sánh.';
    const lightest = [...candidates].sort((a, b) => a.weightNum - b.weightNum)[0];
    const bestPP = [...candidates].sort((a, b) => b.ppScore - a.ppScore)[0];
    if (!lightest || !bestPP) return 'Cần thêm dữ liệu để phân tích đánh đổi.';
    if (lightest.id === bestPP.id) return `${bestPP.name} thắng cả P/P và trọng lượng — lựa chọn an toàn.`;
    return `Nếu vác máy hàng ngày → ${lightest.name} thắng; Nếu ưu tiên FPS/P/P → ${bestPP.name} thắng nhưng đánh đổi trọng lượng & vật liệu.`;
  }
}
