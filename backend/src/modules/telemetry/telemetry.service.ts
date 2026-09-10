import { Injectable, Logger } from '@nestjs/common';

export interface TraceEvent {
  traceId: string;
  agent: string;
  status: 'start' | 'done' | 'error';
  detail?: string;
  latencyMs?: number;
  ts: number;
}

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);
  private traces: TraceEvent[] = [];

  start(traceId: string, agent: string, detail?: string) {
    const ev: TraceEvent = { traceId, agent, status: 'start', detail, ts: Date.now() };
    this.traces.push(ev);
    this.logger.log(`[${traceId}] ${agent} START ${detail ?? ''}`);
    return ev;
  }

  done(traceId: string, agent: string, latencyMs: number, detail?: string) {
    const ev: TraceEvent = { traceId, agent, status: 'done', latencyMs, detail, ts: Date.now() };
    this.traces.push(ev);
    this.logger.log(`[${traceId}] ${agent} DONE ${latencyMs}ms ${detail ?? ''}`);
    return ev;
  }

  error(traceId: string, agent: string, err: string) {
    const ev: TraceEvent = { traceId, agent, status: 'error', detail: err, ts: Date.now() };
    this.traces.push(ev);
    this.logger.error(`[${traceId}] ${agent} ERROR ${err}`);
    return ev;
  }

  getTrace(traceId: string) {
    return this.traces.filter((t) => t.traceId === traceId);
  }

  recent(limit = 50) {
    return this.traces.slice(-limit);
  }
}
