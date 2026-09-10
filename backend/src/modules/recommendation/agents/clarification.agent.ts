import { Injectable } from '@nestjs/common';
import { IntentResult } from './intent.agent.js';

export interface Clarification {
  question: string;
  options: string[];
}

@Injectable()
export class ClarificationAgent {
  // Interactive Counter-Questioning: detect ambiguous queries
  getClarification(query: string, intent: IntentResult): Clarification | null {
    const q = query.toLowerCase();
    const ambiguous = q.split(/\s+/).length < 6 || (!q.includes('tr') && !q.includes('triệu') && !q.includes('game') && !q.includes('cntt'));
    const hasBudget = intent.budgetMax !== undefined;
    const hasUseCase = intent.implicit.useCases.length > 0;

    // If query is short or missing budget/useCase, ask
    if (ambiguous || (!hasBudget && !hasUseCase) || q.includes('tư vấn') || q.includes('mua máy gì')) {
      if (intent.implicit.useCases.includes('CNTT') || q.includes('cntt') || q.includes('học')) {
        return {
          question: 'Để chốt chính xác hơn, bạn học chuyên ngành nào và có ưu tiên mỏng nhẹ không?',
          options: ['Web/App - ưu tiên nhẹ & pin', 'AI/Data - ưu tiên CPU/RAM mạnh', 'Game nặng thêm - ưu tiên GPU rời'],
        };
      }
      return {
        question: 'Bạn ưu tiên điều gì nhất trong tầm giá này?',
        options: ['Hiệu năng / Giá tốt nhất', 'Mỏng nhẹ & pin lâu', 'Màn đẹp OLED cho thiết kế'],
      };
    }

    // Budget without enough context
    if (hasBudget && intent.implicit.useCases.length === 0) {
      return {
        question: 'Với ngân sách này, bạn dùng máy chủ yếu để làm gì?',
        options: ['Học & code', 'Chơi game', 'Thiết kế / Creator'],
      };
    }

    return null; // No clarification needed
  }
}
