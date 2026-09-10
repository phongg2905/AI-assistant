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

  // Giai đoạn 1: Silver - làm sạch + chuẩn hoá + validate (pandera/great_expectations style)
  async transformSilver(candidates: any[]): Promise<{ cleaned: any[]; stats: PipelineRun['silver'] }> {
    const cleaned: any[] = [];
    let deduped = 0, validated = 0;
    const seen = new Set<string>();

    for (const raw of candidates) {
      // Dedupe
      const key = (raw.name || '').toLowerCase().replace(/\s+/g, ' ').slice(0, 40);
      if (seen.has(key)) { deduped++; continue; }
      seen.add(key);

      // Chuẩn hoá
      const normalized = {
        name: String(raw.name || '').trim().slice(0, 80),
        priceNum: Number(raw.priceNum),
        cpu: String(raw.cpu || 'i5-1335U').trim(),
        gpu: String(raw.gpu || 'Iris Xe').trim(),
        ram: String(raw.ram || '16GB').includes('GB') ? String(raw.ram) : `${raw.ram}GB`,
        weightNum: Number(raw.weightNum) || parseFloat(String(raw.weight || '1.5')) || 1.5,
        batteryWh: Number(raw.batteryWh) || 50,
        ppScore: Number(raw.ppScore) || 7.5,
      };

      // Validate như pandera: schema + domain checks
      const result = ProductSchema.safeParse(normalized);
      if (!result.success) {
        this.invalidRecords.push({ raw: normalized, reason: result.error.issues.map(i=>`${i.path}:${i.message}`).join('; '), at: new Date().toISOString() });
        continue;
      }
      // Thêm check như great_expectations: expect_column_values_to_be_between
      if (normalized.priceNum < 5_000_000 || normalized.priceNum > 80_000_000) {
        this.invalidRecords.push({ raw, reason: 'price out of range', at: new Date().toISOString() });
        continue;
      }
      cleaned.push({ ...raw, ...normalized });
      validated++;
    }

    return { cleaned, stats: { cleaned: cleaned.length, deduped, validated } };
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
