import { Injectable } from '@nestjs/common';

export interface ExtractedIntent {
  action: 'recommend' | 'compare' | 'search' | 'benchmark' | 'review' | 'chitchat';
  budgetMaxVnd?: number;
  budgetMinVnd?: number;
  brand?: string;
  minRamGb?: number;
  targetUse?: string;
  compareProductIds?: string[];
  productName?: string;
}

@Injectable()
export class IntentExtractorService {
  extractIntent(message: string): ExtractedIntent {
    const text = message.toLowerCase();

    // 1. Budget extraction (e.g. 30 triệu, 25tr, 30m)
    let budgetMax: number | undefined;
    const millionMatch = text.match(/(\d+)\s*(triệu|trieu|tr|m\b)/);
    if (millionMatch) {
      budgetMax = parseInt(millionMatch[1], 10) * 1_000_000;
    }

    // 2. RAM extraction (e.g. 16gb ram, 32gb)
    let minRamGb: number | undefined;
    const ramMatch = text.match(/(\d+)\s*gb/);
    if (ramMatch) {
      minRamGb = parseInt(ramMatch[1], 10);
    }

    // 3. Brand extraction
    let brand: string | undefined;
    if (text.includes('apple') || text.includes('macbook')) brand = 'Apple';
    else if (text.includes('asus') || text.includes('rog')) brand = 'ASUS';
    else if (text.includes('lenovo') || text.includes('thinkpad')) brand = 'Lenovo';
    else if (text.includes('dell')) brand = 'Dell';
    else if (text.includes('acer')) brand = 'Acer';

    // 4. Action classification
    if (text.includes('so sánh') || text.includes('so sanh') || text.includes('compare')) {
      return {
        action: 'compare',
        budgetMaxVnd: budgetMax,
        minRamGb,
        brand,
      };
    }

    if (text.includes('benchmark') || text.includes('điểm') || text.includes('cinebench')) {
      return {
        action: 'benchmark',
        productName: text,
      };
    }

    if (text.includes('đánh giá') || text.includes('review') || text.includes('nhận xét')) {
      return {
        action: 'review',
        productName: text,
      };
    }

    if (text.includes('tư vấn') || text.includes('mua') || text.includes('tìm') || text.includes('lập trình') || text.includes('gaming') || budgetMax) {
      let targetUse = 'coding';
      if (text.includes('game') || text.includes('gaming')) targetUse = 'gaming';
      else if (text.includes('ai') || text.includes('học máy') || text.includes('deep learning')) targetUse = 'ai';
      else if (text.includes('văn phòng') || text.includes('học tập')) targetUse = 'office';

      return {
        action: 'recommend',
        budgetMaxVnd: budgetMax,
        minRamGb,
        brand,
        targetUse,
      };
    }

    return { action: 'chitchat' };
  }
}
