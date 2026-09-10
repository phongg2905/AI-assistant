import { Controller, Get, Post, Query } from '@nestjs/common';
import { CrawlerService } from './crawler.service.js';
import { PipelineService } from '../pipeline/pipeline.service.js';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawler: CrawlerService, private readonly pipeline: PipelineService) {}

  @Get('status')
  status(): any {
    return {
      isCrawling: this.crawler.isCrawling(),
      lastResult: this.crawler.getStatus(),
      note: 'Nguồn tươi: CellphoneS + GearVN (2 sàn phổ biến nhất VN, dữ liệu cập nhật hàng giờ, phù hợp đại đa số). Thay hardcode 10 máy.',
    };
  }

  @Post('run')
  async run(@Query('limit') limit?: string, @Query('sources') sources?: string): Promise<any> {
    const lim = limit ? parseInt(limit, 10) : 12;
    const src = sources ? sources.split(',').map((s) => s.trim()) : undefined;
    return this.crawler.crawlFresh({ limit: lim, sources: src });
  }

  @Get('pipeline')
  pipelineStatus(): any {
    return {
      lastRun: this.pipeline.getLastRun(),
      history: this.pipeline.getHistory(5),
      invalidSample: this.pipeline.getInvalidRecords().slice(0, 3),
      note: 'Pipeline tự động: Bronze (giữ raw + metadata) → Silver (chuẩn hoá + Zod validate như Pandera) → Gold (avgPrice/avgPP) — không cần người đụng',
    };
  }

  @Get('run')
  async runGet(@Query('limit') limit?: string): Promise<any> {
    return this.run(limit);
  }
}
