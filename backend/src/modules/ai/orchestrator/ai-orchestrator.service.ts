import { Injectable, Logger } from '@nestjs/common';
import { IntentExtractorService } from './intent-extractor.service.js';
import { ResponseGeneratorService } from './response-generator.service.js';
import { ToolsService } from '../../tools/tools.service.js';
import { RecommendationService } from '../../recommendations/recommendation.service.js';

export interface OrchestrationResult {
  reply: string;
  action: string;
  data?: any;
}

@Injectable()
export class AIOrchestratorService {
  private readonly logger = new Logger(AIOrchestratorService.name);

  constructor(
    private readonly intentExtractor: IntentExtractorService,
    private readonly responseGenerator: ResponseGeneratorService,
    private readonly toolsService: ToolsService,
    private readonly recommendationService: RecommendationService,
  ) {}

  async processUserMessage(message: string, context?: any): Promise<OrchestrationResult> {
    this.logger.log(`Processing message: "${message}"`);
    const intent = this.intentExtractor.extractIntent(message);

    if (intent.action === 'recommend') {
      const recommendations = await this.recommendationService.recommend({
        budgetMaxVnd: intent.budgetMaxVnd,
        budgetMinVnd: intent.budgetMinVnd,
        minRamGb: intent.minRamGb,
        usagePurpose: intent.targetUse,
      });

      const reply = this.responseGenerator.formatRecommendationResponse(recommendations, intent.targetUse);
      return { reply, action: 'recommend', data: recommendations };
    }

    if (intent.action === 'compare') {
      const prods = await this.recommendationService.recommend({
        budgetMaxVnd: intent.budgetMaxVnd,
        minRamGb: intent.minRamGb,
      });
      const idsToCompare = prods.slice(0, 2).map(p => p.id);
      const comparisonResult = await this.toolsService.executeTool('compare_products', { ids: idsToCompare });
      const reply = this.responseGenerator.formatComparisonResponse(comparisonResult);
      return { reply, action: 'compare', data: comparisonResult };
    }

    if (intent.action === 'benchmark') {
      const bench = await this.toolsService.executeTool('get_benchmark', { hardwareName: message, type: 'cpu' });
      const reply = bench
        ? `Điểm benchmark cho ${bench.name}: Cinebench R23 Multi-Core: **${bench.cinebenchR23Multi}**, Single-Core: **${bench.cinebenchR23Single}**.`
        : `Dạ TechWise chưa tìm thấy dữ liệu benchmark chi tiết cho phần cứng này.`;
      return { reply, action: 'benchmark', data: bench };
    }

    if (intent.action === 'review') {
      const reviews = await this.toolsService.executeTool('search_reviews', { query: message });
      const reply = reviews && reviews.length > 0
        ? `Dạ đây là nhận xét thực tế từ người dùng: "${reviews[0].comment}" (Đánh giá: ${reviews[0].rating}⭐)`
        : `Dạ hiện tại TechWise chưa có đánh giá thực tế chi tiết cho mục này.`;
      return { reply, action: 'review', data: reviews };
    }

    // Default chit-chat / general assistance
    return {
      reply: 'Xin chào! TechWise là trợ lý AI chuyên tư vấn mua laptop (Lập trình, AI/Data, Docker, Gaming, Học tập văn phòng). Bạn hãy chia sẻ mức ngân sách hoặc nhu cầu cụ thể để mình gợi ý nhé!',
      action: 'chitchat',
    };
  }
}
