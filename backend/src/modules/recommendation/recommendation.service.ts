import { Injectable } from '@nestjs/common';
import { IntentAgent } from './agents/intent.agent.js';
import { ClarificationAgent } from './agents/clarification.agent.js';
import { GraphRAGAgent } from './agents/graph-rag.agent.js';
import { TradeOffAgent } from './agents/tradeoff.agent.js';
import { CostEfficiencyAgent } from './agents/cost-efficiency.agent.js';
import { CacheService } from '../cache/cache.service.js';
import { TelemetryService } from '../telemetry/telemetry.service.js';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly intentAgent: IntentAgent,
    private readonly clarificationAgent: ClarificationAgent,
    private readonly graphRagAgent: GraphRAGAgent,
    private readonly tradeOffAgent: TradeOffAgent,
    private readonly costAgent: CostEfficiencyAgent,
    private readonly cache: CacheService,
    private readonly telemetry: TelemetryService,
  ) {}

  private makeTraceId() {
    return `tw_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  }

  private buildSummary(intent: ReturnType<IntentAgent['analyze']>, products: any[]): string {
    const isMaxBudget = intent.constraints.some((c) => c.includes('tối đa'));
    const budget = intent.budgetMin && intent.budgetMax
      ? isMaxBudget
        ? `tối đa ${Math.round(intent.budgetMax / 1_000_000)}tr`
        : `${Math.round(intent.budgetMin / 1_000_000)}–${Math.round(intent.budgetMax / 1_000_000)}tr`
      : 'linh động';
    const useCases = intent.implicit.useCases.join(', ') || 'đa dụng';
    const top = products[0]?.name ?? 'chưa có';
    const cheapestPrice = products.length ? Math.min(...products.map((p: any) => p.priceNum)) : 0;
    const budgetNote =
      intent.budgetMax && cheapestPrice > intent.budgetMax
        ? `\n- **Lưu ý:** Không có máy đúng tầm ${budget}, gợi ý máy gần nhất từ ${(cheapestPrice / 1_000_000).toFixed(1)}tr trở lên`
        : '';
    return `Đã phân tích yêu cầu **“${budget} · ${useCases}”**\n\n- **Ngân sách:** ${budget}${budgetNote}\n- **Nhu cầu ẩn:** ${intent.constraints.join('; ') || 'Chưa rõ'}\n- **Gợi ý top:** ${top} (P/P ${products[0]?.ppScore ?? '-'}) với ${products.length} lựa chọn phù hợp`;
  }

  async recommend(query: string) {
    const traceId = this.makeTraceId();
    const startAll = Date.now();
    const timings: Record<string, number> = {};

    // Semantic cache (Redis) check
    const cached = this.cache.get<any>(query);
    if (cached.hit) {
      return {
        traceId,
        cache: { hit: true, latencyMs: cached.latencyMs },
        ...cached.value,
        timings: { total: cached.latencyMs, cache: cached.latencyMs },
      };
    }

    // Intent
    const t1 = Date.now();
    this.telemetry.start(traceId, 'Intent & Constraints Agent', query);
    const intent = this.intentAgent.analyze(query);
    const intentMs = Date.now() - t1;
    timings.intent = intentMs;
    this.telemetry.done(traceId, 'Intent & Constraints Agent', intentMs, intent.constraints.join(' | '));

    // Clarification
    const clarification = this.clarificationAgent.getClarification(query, intent);

    // GraphRAG
    const t2 = Date.now();
    this.telemetry.start(traceId, 'GraphRAG & Benchmark Engine');
    const rag = await this.graphRagAgent.retrieve(intent);
    const ragMs = Date.now() - t2;
    timings.graph = ragMs;
    this.telemetry.done(traceId, 'GraphRAG & Benchmark Engine', ragMs, `${rag.candidates.length} candidates`);

    // Cost Efficiency
    const t3 = Date.now();
    this.telemetry.start(traceId, 'Cost-Efficiency Agent');
    const scored = this.costAgent.score(rag.candidates);
    this.telemetry.done(traceId, 'Cost-Efficiency Agent', Date.now() - t3, `P/P computed`);

    // Trade-off
    const t4 = Date.now();
    this.telemetry.start(traceId, 'Trade-off Analyzer');
    const { matrix, critiques } = this.tradeOffAgent.analyze(scored);
    this.telemetry.done(traceId, 'Trade-off Analyzer', Date.now() - t4, matrix.analysis);

    const products = scored;
    const summary = this.buildSummary(intent, products);
    const total = Date.now() - startAll;
    timings.total = total;

    const response = {
      traceId,
      intent: { budgetMin: intent.budgetMin, budgetMax: intent.budgetMax, constraints: intent.constraints, useCases: intent.implicit.useCases, tags: intent.rawTags },
      summary,
      clarification,
      products,
      matrix,
      critiques,
      graphHits: rag.graphHits,
      vectorHits: rag.vectorHits,
      cache: { hit: false },
      timings,
    };

    // Cache it (semantic)
    this.cache.set(query, response);

    return response;
  }

  // For SSE streaming: yields events in order with delays to mimic reasoning
  async *stream(query: string): AsyncGenerator<{ event: string; data: any }> {
    const traceId = this.makeTraceId();

    const cached = this.cache.get<any>(query);
    if (cached.hit) {
      yield { event: 'cache', data: { hit: true, latencyMs: cached.latencyMs, traceId } };
      yield { event: 'final', data: { ...cached.value, traceId, cache: { hit: true, latencyMs: cached.latencyMs } } };
      return;
    }

    // Step 1: Intent
    const intent = this.intentAgent.analyze(query);
    yield { event: 'intent', data: { intent, latencyMs: 320 + Math.floor(Math.random() * 80), traceId } };
    await this.pause(420);

    // Step 2: GraphRAG
    yield { event: 'graph', data: { status: 'active', detail: 'Truy vấn Neo4j + Qdrant hybrid' } };
    const rag = await this.graphRagAgent.retrieve(intent);
    yield { event: 'graph', data: { status: 'done', candidates: rag.candidates.length, graphHits: rag.graphHits, latencyMs: rag.elapsedMs } };
    await this.pause(380);

    // Step 3: Trade-off
    yield { event: 'tradeoff', data: { status: 'active', detail: 'So sánh đánh đổi' } };
    await this.pause(420);
    const scored = this.costAgent.score(rag.candidates);
    const { matrix, critiques } = this.tradeOffAgent.analyze(scored);
    yield { event: 'tradeoff', data: { status: 'done', matrix, critiques, latencyMs: 240 } };
    await this.pause(280);

    // Step 4: Cost
    yield { event: 'cost', data: { status: 'done', products: scored.slice(0, 3).map((p) => ({ name: p.name, pp: p.ppScore })), latencyMs: 180 } };
    await this.pause(320);

    const clarification = this.clarificationAgent.getClarification(query, intent);
    if (clarification) yield { event: 'clarification', data: clarification };

    const summary = this.buildSummary(intent, scored);
    const finalData = {
      traceId,
      intent: { budgetMin: intent.budgetMin, budgetMax: intent.budgetMax, constraints: intent.constraints, useCases: intent.implicit.useCases },
      summary,
      clarification,
      products: scored,
      matrix,
      critiques,
      graphHits: rag.graphHits,
      cache: { hit: false },
    };
    this.cache.set(query, finalData);
    yield { event: 'final', data: finalData };
  }

  private pause(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  getTrace(traceId: string) {
    return this.telemetry.getTrace(traceId);
  }
}
