import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://192.168.1.12:3000', 'http://192.168.1.12:3001'],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3001);
  console.log(`TechWise API Gateway running on http://localhost:${process.env.PORT ?? 3001}/api`);
  console.log(`  POST /api/recommend  {query: string}`);
  console.log(`  GET  /api/recommend/stream?query=...  (SSE)`);
  console.log(`  GET  /api/products`);
}
await bootstrap();
