import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module.js';
import { CellphonesCrawler } from './crawlers/cellphones.crawler.js';
import { GearvnCrawler } from './crawlers/gearvn.crawler.js';
import { PhongvuCrawler } from './crawlers/phongvu.crawler.js';
import { CrawlerService } from './crawler.service.js';
import { CrawlerController } from './crawler.controller.js';

@Module({
  imports: [ProductsModule],
  controllers: [CrawlerController],
  providers: [CellphonesCrawler, GearvnCrawler, PhongvuCrawler, CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
