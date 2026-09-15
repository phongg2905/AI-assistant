import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private cache = new Map<string, { val: any; expiresAt: number }>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.val as T;
  }

  async set<T>(key: string, val: T, ttlSeconds: number = 300): Promise<void> {
    this.cache.set(key, {
      val,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}
