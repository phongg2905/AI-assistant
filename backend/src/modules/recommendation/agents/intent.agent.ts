import { Injectable } from '@nestjs/common';

export interface IntentResult {
  budgetMin?: number;
  budgetMax?: number;
  implicit: {
    minRamGB?: number;
    needDiscreteGPU: boolean;
    maxWeightKg?: number;
    mustUpgradeable?: boolean;
    useCases: string[]; // CNTT, Valorant, Genshin, OLED, AI, etc
    displayPref?: string;
  };
  constraints: string[]; // human readable
  confidence: number;
  rawTags: string[];
}

@Injectable()
export class IntentAgent {
  // Rule-based Intent & Constraints Agent: bóc tách ẩn ngôn
  analyze(query: string): IntentResult {
    const q = query.toLowerCase();
    const result: IntentResult = {
      implicit: { needDiscreteGPU: false, useCases: [] },
      constraints: [],
      confidence: 0.88,
      rawTags: [],
    };

    // Budget parsing: "15 triệu", "15tr", "18-20tr", "dưới 20 triệu"
    const budgetPatterns = [
      /(\d{1,2})\s*[-–~]\s*(\d{1,2})\s*(?:tr|triệu)/,
      /(?:tài chính|ngân sách|budget)?\s*(\d{1,2})\s*(?:tr|triệu)/,
      /dưới\s*(\d{1,2})\s*(?:tr|triệu)/,
      /(\d{2,3})\d{6}/, // price like 18000000
    ];
    const range = q.match(budgetPatterns[0]);
    if (range) {
      result.budgetMin = parseInt(range[1], 10) * 1_000_000;
      result.budgetMax = parseInt(range[2], 10) * 1_000_000;
      result.constraints.push(`Ngân sách ${range[1]}–${range[2]}tr`);
    } else {
      const single = q.match(budgetPatterns[1]);
      if (single) {
        const v = parseInt(single[1], 10) * 1_000_000;
        // Nếu câu có "tài chính / ngân sách / tầm / khoảng X triệu" → hiểu là tối đa X, không vượt
        const isMaxBudget = /tài chính|ngân sách|tầm|khoảng|có\s+\d|với\s+\d|cho\s+\d/.test(q);
        if (isMaxBudget) {
          result.budgetMax = v;
          result.budgetMin = Math.max(0, v - 3_000_000);
          result.constraints.push(`Ngân sách tối đa ${single[1]}tr`);
        } else {
          result.budgetMin = Math.max(0, v - 2_000_000);
          result.budgetMax = v + 2_000_000;
          result.constraints.push(`Ngân sách ~${single[1]}tr (±2tr linh động)`);
        }
      }
      const under = q.match(budgetPatterns[2]);
      if (under && !single) {
        result.budgetMax = parseInt(under[1], 10) * 1_000_000;
        result.constraints.push(`Dưới ${under[1]}tr`);
      }
    }
    if (!result.budgetMax) {
      result.budgetMin = 12_000_000;
      result.budgetMax = 22_000_000;
      result.constraints.push('Ngân sách mặc định 12–22tr');
    }

    // Implicit mappings
    if (q.includes('cntt') || q.includes('công nghệ thông tin') || q.includes('lập trình') || q.includes('code') || q.includes('it ')) {
      result.implicit.minRamGB = 16;
      result.implicit.mustUpgradeable = false;
      result.implicit.useCases.push('CNTT');
      result.rawTags.push('CNTT');
      result.constraints.push('Học CNTT → RAM≥16GB, bàn phím tốt');
    }
    if (q.includes('ai') || q.includes('data') || q.includes('machine learning') || q.includes('deep learning')) {
      result.implicit.minRamGB = 16;
      result.implicit.useCases.push('AI/Data');
      result.rawTags.push('AI');
      result.constraints.push('AI/Data → ưu tiên CPU đa nhân, RAM 16GB+');
    }
    if (q.includes('valorant') || q.includes('gaming') || q.includes('game') || q.includes('genshin') || q.includes('liên minh')) {
      result.implicit.needDiscreteGPU = true;
      result.implicit.useCases.push('Gaming');
      if (q.includes('valorant')) result.rawTags.push('Valorant');
      if (q.includes('genshin')) result.rawTags.push('Genshin Impact');
      else result.rawTags.push('Gaming');
      result.constraints.push('Chơi game → cần GPU rời ≥ RTX 2050 hoặc iGPU mạnh');
    }
    if (q.includes('mỏng') || q.includes('nhẹ') || q.includes('<1.4') || q.includes('mang đi') || q.includes('di chuyển')) {
      result.implicit.maxWeightKg = 1.5;
      result.implicit.useCases.push('Mobility');
      result.rawTags.push('Mỏng nhẹ');
      result.constraints.push('Mang vác hàng ngày → ≤1.5kg');
    }
    if (q.includes('oled') || q.includes('màn đẹp') || q.includes('creator') || q.includes('thiết kế')) {
      result.implicit.displayPref = 'OLED 100% sRGB';
      result.rawTags.push('OLED');
      result.constraints.push('Ưu tiên màn OLED 100% sRGB');
    }
    if (q.includes('render') || q.includes('premiere') || q.includes('blender') || q.includes('after effect')) {
      result.implicit.needDiscreteGPU = true;
      result.implicit.useCases.push('Creator');
      result.rawTags.push('Creator');
    }

    // Default tags if none
    if (result.rawTags.length === 0) result.rawTags = ['General'];

    return result;
  }
}
