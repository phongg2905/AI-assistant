import { Injectable } from '@nestjs/common';
import { UserPreference } from './memory.service.js';

@Injectable()
export class MemoryExtractorService {
  extractPreferencesFromDialogue(messages: Array<{ role: string; content: string }>): Partial<UserPreference> {
    const prefs: Partial<UserPreference> = {};
    const text = messages.map(m => m.content).join(' ').toLowerCase();

    const millionMatch = text.match(/(\d+)\s*(triệu|trieu|tr|m\b)/);
    if (millionMatch) {
      prefs.budgetMaxVnd = parseInt(millionMatch[1], 10) * 1_000_000;
    }

    const ramMatch = text.match(/(\d+)\s*gb/);
    if (ramMatch) {
      prefs.minRamGb = parseInt(ramMatch[1], 10);
    }

    const brands: string[] = [];
    if (text.includes('apple') || text.includes('macbook')) brands.push('Apple');
    if (text.includes('asus') || text.includes('rog')) brands.push('ASUS');
    if (text.includes('lenovo') || text.includes('thinkpad')) brands.push('Lenovo');
    if (brands.length > 0) {
      prefs.favoredBrands = brands;
    }

    return prefs;
  }
}
