import { Controller, Post, Body } from '@nestjs/common';
import { AIOrchestratorService } from '../ai/orchestrator/ai-orchestrator.service.js';

@Controller('voice')
export class VoiceController {
  constructor(private readonly orchestrator: AIOrchestratorService) {}

  @Post('transcribe')
  async transcribe(@Body() body: { audioBase64?: string; textMock?: string }) {
    // Phase 1 Voice Adapter / Local Whisper fallback
    const transcription = body.textMock || 'Tư vấn laptop dưới 30 triệu';
    const aiResponse = await this.orchestrator.processUserMessage(transcription);
    return {
      transcription,
      reply: aiResponse.reply,
      action: aiResponse.action,
      data: aiResponse.data,
    };
  }
}
