import { Body, Controller, Get, Post, Query, Sse, MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RecommendationService } from './recommendation.service.js';
import { RecommendDto } from './dto/recommend.dto.js';

@Controller('recommend')
export class RecommendationController {
  constructor(private readonly rec: RecommendationService) {}

  @Post()
  async recommend(@Body() dto: RecommendDto) {
    if (!dto.query || !dto.query.trim()) return { error: 'QUERY_REQUIRED' };
    return this.rec.recommend(dto.query.trim());
  }

  @Get('stream')
  @Sse()
  stream(@Query('query') query: string): Observable<MessageEvent> {
    const q = (query || '').trim();
    if (!q) {
      return new Observable((sub) => {
        sub.next({ data: JSON.stringify({ event: 'error', data: { message: 'QUERY_REQUIRED' } }) } as MessageEvent);
        sub.complete();
      });
    }
    return new Observable((subscriber) => {
      (async () => {
        try {
          for await (const ev of this.rec.stream(q)) {
            subscriber.next({
              data: JSON.stringify(ev),
            } as MessageEvent);
          }
          subscriber.complete();
        } catch (e: any) {
          subscriber.next({ data: JSON.stringify({ event: 'error', data: { message: e.message } }) } as MessageEvent);
          subscriber.complete();
        }
      })();
    });
  }

  @Get('trace/:id')
  trace(@Query('id') id: string) {
    // alias for /recommend/trace?id=
    return this.rec.getTrace(id);
  }
}
