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
      description: 'Domain-specific AI Laptop Shopping Assistant',
      architecture: 'NestJS Clean Architecture (AI Orchestrator + Approved Tools + Domain Services)',
      endpoints: {
        chat: 'POST /api/chat {query: string}',
        chatStream: 'GET /api/chat/stream?query=... (SSE)',
        recommend: 'POST /api/recommend {query: string}',
        recommendStream: 'GET /api/recommend/stream?query=... (SSE)',
        products: 'GET /api/products?budgetMin=&budgetMax=&q=&category=',
        productDetails: 'GET /api/products/:id',
        conversations: 'GET /api/conversations',
        crawlerStatus: 'GET /api/crawler/status',
        crawlerRun: 'POST /api/crawler/run?limit=8',
        health: 'GET /api/health',
      },
    };
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      service: 'TechWise Backend',
      uptime: process.uptime(),
      timestamp: Date.now(),
    };
  }
}
