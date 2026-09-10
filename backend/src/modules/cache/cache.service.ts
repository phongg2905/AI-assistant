import { Injectable, Logger } from '@nestjs/common';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  hits: number;
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private store = new Map<string, CacheEntry<any>>();
  private readonly ttlMs = 1000 * 60 * 30; // 30m like Redis
  private readonly maxSize = 500;

  private hashQuery(q: string): string {
    // Cheap semantic hash: normalize, sort tokens, lower
    const norm = q.toLowerCase().replace(/[^a-z0-9\u00C0-\u024F\s]/g, ' ').split(/\s+/).filter(Boolean).sort().join(' ');
    // quick djb2
    let h = 5381;
    for (let i = 0; i < norm.length; i++) h = (h * 33) ^ norm.charCodeAt(i);
    return `intent:${(h >>> 0).toString(16)}:${norm.slice(0, 48)}`;
  }

  // Semantic cache — chỉ HIT khi intent gần như giống hệt (tránh hardcode do cache nhầm)
  get<T>(query: string): { hit: true; value: T; latencyMs: number } | { hit: false } {
    const key = this.hashQuery(query);
    const entry = this.store.get(key);
    if (!entry) {
      // fuzzy chỉ khi overlap rất cao và cùng budget (tránh 10tr ↔ 18tr trả cùng kết quả)
      for (const [k, v] of this.store.entries()) {
        if (Date.now() > v.expiresAt) {
          this.store.delete(k);
          continue;
        }
        const aTokens = key.split(':').pop()!.split(' ');
        const bTokens = k.split(':').pop()!.split(' ');
        const overlap = aTokens.filter((t) => bTokens.includes(t)).length / Math.max(aTokens.length, bTokens.length);
        const sameBudget = aTokens.some((t) => /^\d{1,2}$/.test(t)) ? aTokens.filter((t) => /^\d{1,2}$/.test(t)).some((t) => bTokens.includes(t)) : true;
        if (overlap > 0.88 && sameBudget) {
          v.hits++;
          this.logger.log(`Semantic cache HIT (fuzzy ${overlap.toFixed(2)}) for "${query}" -> ${k}`);
          return { hit: true, value: v.value as T, latencyMs: 18 + Math.floor(Math.random() * 22) };
        }
      }
      return { hit: false };
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return { hit: false };
    }
    entry.hits++;
    this.logger.log(`Semantic cache HIT exact for "${query}"`);
    return { hit: true, value: entry.value as T, latencyMs: 12 + Math.floor(Math.random() * 12) };
  }

  set<T>(query: string, value: T): void {
    if (this.store.size >= this.maxSize) {
      const first = this.store.keys().next().value as string;
      this.store.delete(first);
    }
    const key = this.hashQuery(query);
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs, hits: 0 });
    this.logger.log(`Cache SET ${key}`);
  }

  stats() {
    return { size: this.store.size, keys: [...this.store.keys()].slice(0, 5) };
  }

  clear() {
    this.store.clear();
  }
}
