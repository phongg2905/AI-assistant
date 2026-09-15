import { Module } from '@nestjs/common';
import { AIModule } from '../ai/ai.module.js';
import { ChatController } from './chat.controller.js';
import { ChatService } from './chat.service.js';
import { StreamingService } from './streaming.service.js';

@Module({
  imports: [AIModule],
  controllers: [ChatController],
  providers: [ChatService, StreamingService],
  exports: [ChatService, StreamingService],
})
export class ChatModule {}
