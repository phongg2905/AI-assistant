import { Injectable } from '@nestjs/common';
import { AIOrchestratorService, OrchestrationResult } from '../ai/orchestrator/ai-orchestrator.service.js';

@Injectable()
export class ChatService {
  constructor(private readonly orchestrator: AIOrchestratorService) {}

  async handleUserMessage(message: string, conversationId?: string): Promise<OrchestrationResult> {
    return this.orchestrator.processUserMessage(message, { conversationId });
  }
}
