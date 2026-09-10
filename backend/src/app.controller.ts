import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {
      service: 'TechWise API Gateway',
      version: '1.0.0',
      architecture: 'NestJS + GraphRAG + Multi-Agent',
      endpoints: {
        recommend: 'POST /api/recommend {query}',
        stream: 'GET /api/recommend/stream?query=...  (SSE)',
        products: 'GET /api/products?budgetMin=&budgetMax=&q=',
        health: 'GET /api',
      },
      docs: 'See instruction.md for 5 breakthroughs: Intent, Trade-off, GraphRAG, Clarification, Caching',
    };
  }

  @Get('health')
  health() {
    return { status: 'ok', uptime: process.uptime(), ts: Date.now() };
  }
}
