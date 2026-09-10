import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CrawlerService } from './crawler.service.js';
import { CrawlerController } from './crawler.controller.js';
import { ProductsModule } from '../products/products.module.js';
import { PipelineModule } from '../pipeline/pipeline.module.js';

@Module({
  imports: [ScheduleModule.forRoot(), ProductsModule, PipelineModule],
  controllers: [CrawlerController],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
