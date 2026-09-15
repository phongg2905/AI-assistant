import { Injectable } from '@nestjs/common';

export interface UserPreference {
  budgetMaxVnd?: number;
  favoredBrands?: string[];
  preferredUse?: string;
  minRamGb?: number;
}

@Injectable()
export class MemoryService {
  private userMemory = new Map<string, UserPreference>();

  async getPreferences(userId: string): Promise<UserPreference> {
    return this.userMemory.get(userId) || {};
  }

  async updatePreferences(userId: string, prefs: Partial<UserPreference>): Promise<UserPreference> {
    const existing = this.userMemory.get(userId) || {};
    const updated = { ...existing, ...prefs };
    this.userMemory.set(userId, updated);
    return updated;
  }
}
