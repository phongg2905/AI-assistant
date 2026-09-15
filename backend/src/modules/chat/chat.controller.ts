import { Controller, Post, Body, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatService } from './chat.service.js';
import { StreamingService } from './streaming.service.js';
import { IsString, IsOptional } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  conversationId?: string;
}

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly streamingService: StreamingService,
  ) {}

  @Post()
  async sendMessage(@Body() dto: ChatMessageDto) {
    return this.chatService.handleUserMessage(dto.message, dto.conversationId);
  }

  @Sse('stream')
  streamMessage(@Body() dto: ChatMessageDto): Observable<{ data: string }> {
    const defaultResponse = `TechWise đang phân tích nhu cầu của bạn cho "${dto.message}"...`;
    return this.streamingService.createStreamFromText(defaultResponse);
  }
}
