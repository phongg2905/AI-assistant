import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(8).max(120),
  priceNum: z.number().int().min(5_000_000).max(80_000_000),
  cpu: z.string().min(2),
  gpu: z.string().min(2),
  ram: z.string().regex(/\d+GB/),
  weightNum: z.number().min(0.8).max(4),
  batteryWh: z.number().min(30).max(100),
  ppScore: z.number().min(6).max(10),
});

// Repo sẵn: dùng Zod như Pandera/Great Expectations + FlexSearch dedupe
// Nếu tự xây phức tạp: có thể thay bằng https://github.com/crawlee/crawlee (Apify Crawlee) cho crawler,
// https://github.com/mongodb/mongo cho lưu, https://github.com/nextapps-de/flexsearch cho index

export interface PipelineRun {
  runId: string;
  startedAt: string;
  finishedAt?: string;
  bronze: { ingested: number; invalid: number; errors: string[] };
  silver: { cleaned: number; deduped: number; validated: number };
  gold: { aggregated: number; avgPrice: number; avgPP: number };
  status: 'running' | 'success' | 'failed';
}

@Injectable()
export class PipelineService {
  private readonly logger = new Logger(PipelineService.name);
  private runs: PipelineRun[] = [];
  private bronzeRaw: any[] = [];
  private invalidRecords: any[] = [];

  getLastRun(): PipelineRun | null {
    return this.runs[this.runs.length - 1] || null;
  }

  getHistory(limit = 5): PipelineRun[] {
    return this.runs.slice(-limit).reverse();
  }

  getInvalidRecords(): any[] {
    return this.invalidRecords.slice(-20);
  }

  // Giai đoạn 1: Bronze - giữ nguyên HTML/raw + metadata
  async ingestBronze(rawProducts: any[]): Promise<PipelineRun['bronze']> {
    const errors: string[] = [];
    let ingested = 0, invalid = 0;
    for (const raw of rawProducts) {
      try {
        // Lưu raw kèm metadata như NYC taxi bronze
        this.bronzeRaw.push({ ...raw, _ingestedAt: new Date().toISOString(), _source: raw.source || 'crawl' });
        ingested++;
      } catch (e: any) {
        this.invalidRecords.push({ raw, reason: e.message, at: new Date().toISOString() });
        errors.push(e.message);
        invalid++;
      }
    }
    // Giữ tối đa 100 raw
    if (this.bronzeRaw.length > 100) this.bronzeRaw.splice(0, this.bronzeRaw.length - 100);
    return { ingested, invalid, errors: errors.slice(0, 3) };
  }

  // Giai đoạn Silver - làm sạch + chuẩn hoá + validate (như Pandas + Pandera + OpenRefine)
  // Nếu tự xây phức tạp, thay bằng repo: https://github.com/pandas-dev/pandas (Python) hoặc https://github.com/mongodb/mongo
  async transformSilver(candidates: any[]): Promise<{ cleaned: any[]; stats: PipelineRun['silver'] }> {
    const cleaned: any[] = [];
    let deduped = 0, validated = 0;
    const seen = new Set<string>();

    for (const raw of candidates) {
      // 1. Làm sạch tên: trim, bỏ ký tự lạ, chuẩn hoá khoảng trắng, loại tên rác
      let cleanName = String(raw.name || '').trim().replace(/\s+/g, ' ').slice(0, 80);
      cleanName = cleanName.replace(/[^\p{L}\p{N}\s\-()./]/gu, '').trim(); // bỏ emoji/ký tự lạ
      if (cleanName.length < 8) {
        this.invalidRecords.push({ raw, reason: 'name too short', at: new Date().toISOString() });
        continue;
      }
      // Dedupe đơn giản – thay Jaccard phức tạp bằng Set (đủ cho demo, nếu cần chính xác dùng FlexSearch)
      const key = cleanName.toLowerCase().replace(/\s+/g, ' ').slice(0, 40);
      if (seen.has(key)) { deduped++; continue; }
      seen.add(key);

      // 2. Chuẩn hoá giá: bỏ dấu chấm, khoảng trắng, parse int
      let priceNum = Number(raw.priceNum);
      if (!priceNum || isNaN(priceNum)) {
        const m = String(raw.price || raw.priceText || '').match(/\d{1,3}(?:\.\d{3})+/);
        if (m) priceNum = parseInt(m[0].replace(/\./g, ''), 10);
      }
      // 3. Chuẩn hoá spec
      const cpu = String(raw.cpu || this.guessCPU(cleanName)).trim();
      const gpu = String(raw.gpu || this.guessGPU(cleanName)).trim();
      let ram = String(raw.ram || '16GB');
      if (!ram.includes('GB')) ram = `${ram}GB`;
      ram = ram.replace(/\s+/g, ' ').trim();
      const weightNum = Number(raw.weightNum) || parseFloat(String(raw.weight || '1.5')) || 1.5;
      const batteryWh = Number(raw.batteryWh) || 50;
      const ppScore = Math.min(10, Math.max(6, Number(raw.ppScore) || 7.5));

      const normalized = {
        name: cleanName,
        priceNum,
        cpu,
        gpu,
        ram,
        weightNum,
        batteryWh,
        ppScore: parseFloat(ppScore.toFixed(1)),
      };

      // 4. Validate Zod + Great Expectations checks
      const result = ProductSchema.safeParse(normalized);
      if (!result.success) {
        this.invalidRecords.push({ raw: normalized, reason: result.error.issues.map(i=>`${i.path}:${i.message}`).join('; '), at: new Date().toISOString() });
        continue;
      }
      if (normalized.priceNum < 5_000_000 || normalized.priceNum > 80_000_000) {
        this.invalidRecords.push({ raw, reason: 'price out of range', at: new Date().toISOString() });
        continue;
      }
      // Enrich: tính lại ppScore nếu thiếu (như Data Enrichment)
      if (!raw.ppScore) {
        const enrichedPP = Math.min(9.2, 6.5 + (normalized.batteryWh / 20) + (normalized.weightNum < 1.5 ? 0.5 : 0));
        normalized.ppScore = parseFloat(enrichedPP.toFixed(1));
      }
      cleaned.push({ ...raw, ...normalized, name: cleanName, priceNum });
      validated++;
    }

    return { cleaned, stats: { cleaned: cleaned.length, deduped, validated } };
  }

  private guessCPU(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('ultra 7')) return 'Ultra 7 155H';
    if (lower.includes('ultra 5')) return 'Ultra 5 125H';
    if (lower.includes('i7')) return 'i7-13650H';
    if (lower.includes('i5')) return 'i5-13420H';
    if (lower.includes('ryzen 7')) return 'Ryzen 7 7735HS';
    if (lower.includes('ryzen 5')) return 'Ryzen 5 7535HS';
    return 'i5-1335U';
  }
  private guessGPU(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('4050')) return 'RTX 4050 75W';
    if (lower.includes('4060')) return 'RTX 4060 85W';
    if (lower.includes('3050')) return 'RTX 3050 65W';
    return 'Iris Xe';
  }

  // Giai đoạn 1: Gold - aggregate cho BI / Recommendation
  async aggregateGold(cleaned: any[]): Promise<PipelineRun['gold']> {
    if (cleaned.length === 0) return { aggregated: 0, avgPrice: 0, avgPP: 0 };
    const avgPrice = Math.round(cleaned.reduce((s, p) => s + p.priceNum, 0) / cleaned.length);
    const avgPP = parseFloat((cleaned.reduce((s, p) => s + (p.ppScore || 7.5), 0) / cleaned.length).toFixed(2));
    return { aggregated: cleaned.length, avgPrice, avgPP };
  }

  async runFullPipeline(rawProducts: any[]): Promise<{ run: PipelineRun; cleaned: any[] }> {
    const runId = `pipe_${Date.now().toString(36)}`;
    const run: PipelineRun = {
      runId,
      startedAt: new Date().toISOString(),
      bronze: { ingested: 0, invalid: 0, errors: [] },
      silver: { cleaned: 0, deduped: 0, validated: 0 },
      gold: { aggregated: 0, avgPrice: 0, avgPP: 0 },
      status: 'running',
    };
    this.runs.push(run);
    this.logger.log(`[${runId}] Pipeline bắt đầu với ${rawProducts.length} raw`);

    try {
      run.bronze = await this.ingestBronze(rawProducts);
      const { cleaned, stats } = await this.transformSilver(rawProducts);
      run.silver = stats;
      run.gold = await this.aggregateGold(cleaned);
      run.status = 'success';
      run.finishedAt = new Date().toISOString();
      this.logger.log(`[${runId}] Pipeline success: bronze ${run.bronze.ingested} → silver ${run.silver.cleaned} → gold avgPrice ${(run.gold.avgPrice/1_000_000).toFixed(1)}tr`);
      return { run, cleaned };
    } catch (e: any) {
      run.status = 'failed';
      run.finishedAt = new Date().toISOString();
      run.bronze.errors.push(e.message);
      this.logger.error(`[${runId}] Pipeline failed: ${e.message}`);
      return { run, cleaned: [] };
    }
  }
}
