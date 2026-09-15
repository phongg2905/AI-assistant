import { Module } from '@nestjs/common';
import { VoiceService } from './voice.service.js';
import { VoiceController } from './voice.controller.js';
import { AIModule } from '../ai/ai.module.js';

@Module({
  imports: [AIModule],
  controllers: [VoiceController],
  providers: [VoiceService],
  exports: [VoiceService],
})
export class VoiceModule {}
