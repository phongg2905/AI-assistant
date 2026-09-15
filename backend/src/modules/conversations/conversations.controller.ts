import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ConversationsService } from './conversations.service.js';
import { CreateConversationDto } from './dto/create-conversation.dto.js';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  async getConversations() {
    return this.conversationsService.findAll();
  }

  @Post()
  async createConversation(@Body() dto: CreateConversationDto) {
    return this.conversationsService.create(dto);
  }

  @Get(':id')
  async getConversation(@Param('id') id: string) {
    return this.conversationsService.findById(id);
  }
}
