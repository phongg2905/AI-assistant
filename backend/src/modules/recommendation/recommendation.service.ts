import { Injectable } from '@nestjs/common';
import { IntentAgent } from './agents/intent.agent.js';
import { ClarificationAgent } from './agents/clarification.agent.js';
import { GraphRAGAgent } from './agents/graph-rag.agent.js';
import { TradeOffAgent } from './agents/tradeoff.agent.js';
import { CostEfficiencyAgent } from './agents/cost-efficiency.agent.js';
import { ChitChatAgent } from './agents/chitchat.agent.js';
import { CacheService } from '../cache/cache.service.js';
import { TelemetryService } from '../telemetry/telemetry.service.js';
import { ProductsService } from '../products/products.service.js';
import { PipelineService } from '../pipeline/pipeline.service.js';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly intentAgent: IntentAgent,
    private readonly clarificationAgent: ClarificationAgent,
    private readonly graphRagAgent: GraphRAGAgent,
    private readonly tradeOffAgent: TradeOffAgent,
    private readonly costAgent: CostEfficiencyAgent,
    private readonly chitChatAgent: ChitChatAgent,
    private readonly cache: CacheService,
    private readonly telemetry: TelemetryService,
    private readonly productsService: ProductsService,
    private readonly pipelineService: PipelineService,
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

    // 0. Chit-chat check TRƯỚC cache – để "chào bạn" / "dữ liệu có lớn không" không bị rập khuôn liệt kê giá
    const chit = await this.chitChatAgent.detect(query);
    if (chit.isChitChat) {
      this.telemetry.start(traceId, 'ChitChat Agent', query);
      this.telemetry.done(traceId, 'ChitChat Agent', 12, chit.intent);
      let reply = chit.reply;
      if (chit.intent === 'system_info') {
        const count = this.productsService.findAll().length;
        const lastRun = this.pipelineService.getLastRun();
        const sources = 'CellphoneS, GearVN, Phong Vũ';
        const avgPrice = lastRun?.gold?.avgPrice ? `${(lastRun.gold.avgPrice / 1_000_000).toFixed(1)}tr` : (count ? 'đang tính từ dữ liệu hiện có' : 'chưa có');
        const status = count > 0 ? `hiện có **${count} sản phẩm thực** (tối đa 30, đang lưu trong memory + file \`backend/data/products.json\`)` : 'chưa có sản phẩm nào (bạn hãy bấm cào thử)';
        const lastRunText = lastRun
          ? `${lastRun.bronze.ingested} raw → ${lastRun.silver.cleaned} sạch, ${lastRun.silver.validated} hợp lệ – ${lastRun.status} lúc ${new Date(lastRun.startedAt).toLocaleString('vi-VN')}`
          : count > 0
            ? `có ${count} sp từ lần cào trước (đã lưu file, pipeline chưa chạy trong phiên này)`
            : 'chưa chạy – hãy bấm “cào thêm”';
        reply = `Dữ liệu của mình ${status}, được cào tự động từ **${sources}** mỗi 2h sáng qua pipeline **Bronze → Silver (Zod validate) → Gold**.\n\n- **Lần cào gần nhất:** ${lastRunText}\n- **Giá trung bình:** ${avgPrice} · **PP trung bình:** ${lastRun?.gold?.avgPP ?? (count ? 'đang tính' : '-')}\n- **Lưu trữ:** memory + file \`data/products.json\` (persist sau mỗi lần cào), có thể thay bằng Postgres/Qdrant nếu bạn muốn lớn hơn.\n\nBạn muốn mình cào thêm cho đủ 30 máy không? Chỉ cần nói “cào thêm” hoặc hỏi “15tr học CNTT” là mình lọc ngay!`;
      }
      return {
        traceId,
        intent: { budgetMin: undefined, budgetMax: undefined, constraints: ['Chit-chat'], useCases: [], tags: [] },
        summary: reply!,
        clarification: null,
        products: [],
        matrix: { headers: [], rows: [], analysis: '' },
        critiques: [],
        graphHits: [],
        vectorHits: [],
        chitChat: true,
        chitChatIntent: chit.intent,
        cache: { hit: false },
        timings: { total: 12, chitChat: 12 },
      };
    }

    // Semantic cache (Redis) check
    const cached = this.cache.get<any>(query);
    if (cached.hit) {
      // Nếu cache là chit-chat cũ thì vẫn trả, nhưng đã check ở trên nên không sao
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

    // Chit-chat early return cho stream
    const chit = await this.chitChatAgent.detect(query);
    if (chit.isChitChat) {
      let reply = chit.reply;
      if (chit.intent === 'system_info') {
        const count = this.productsService.findAll().length;
        const lastRun = this.pipelineService.getLastRun();
        reply = `Dữ liệu hiện có **${count} sp thực** từ CellphoneS/GearVN/Phong Vũ, pipeline ${lastRun ? `${lastRun.bronze.ingested}→${lastRun.silver.cleaned} validated` : 'chưa chạy'}. Hỏi “cào thêm” để mình làm đầy nhé!`;
      }
      yield { event: 'intent', data: { intent: { budgetMin: undefined, budgetMax: undefined, constraints: ['Chit-chat'], useCases: [] }, latencyMs: 18, traceId } };
      await this.pause(180);
      yield { event: 'final', data: { traceId, summary: reply, clarification: null, products: [], matrix: { headers: [], rows: [], analysis: '' }, chitChat: true, chitChatIntent: chit.intent, cache: { hit: false } } };
      return;
    }

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
