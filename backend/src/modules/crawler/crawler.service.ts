import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../products/products.service.js';
import { CellphonesCrawler } from './crawlers/cellphones.crawler.js';
import { GearvnCrawler } from './crawlers/gearvn.crawler.js';
import { PhongvuCrawler } from './crawlers/phongvu.crawler.js';
import { ProductValidator } from './validators/product.validator.js';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  constructor(
    private readonly productsService: ProductsService,
    private readonly cellphonesCrawler: CellphonesCrawler,
    private readonly gearvnCrawler: GearvnCrawler,
    private readonly phongvuCrawler: PhongvuCrawler,
  ) {}

  async runAllCrawlers() {
    this.logger.log('Starting ingestion from CellphoneS, GearVN, and PhongVu...');
    const cellphonesProds = await this.cellphonesCrawler.fetchProducts();
    const gearvnProds = await this.gearvnCrawler.fetchProducts();
    const phongvuProds = await this.phongvuCrawler.fetchProducts();

    const rawAll = [...cellphonesProds, ...gearvnProds, ...phongvuProds];
    const valid = rawAll.filter(p => ProductValidator.isValidProduct(p));

    const insertedCount = await this.productsService.upsertMany(valid);
    this.logger.log(`Ingestion completed. Upserted ${insertedCount} items.`);
    return { status: 'success', count: insertedCount };
  }
}
