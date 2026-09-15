import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationsRepository, Conversation } from './conversations.repository.js';
import { CreateConversationDto } from './dto/create-conversation.dto.js';

@Injectable()
export class ConversationsService {
  constructor(private readonly repo: ConversationsRepository) {}

  async create(dto: CreateConversationDto): Promise<Conversation> {
    return this.repo.create(dto.title, dto.userId);
  }

  async findAll(): Promise<Conversation[]> {
    return this.repo.findAll();
  }

  async findById(id: string): Promise<Conversation> {
    const c = await this.repo.findById(id);
    if (!c) throw new NotFoundException(`Conversation "${id}" not found`);
    return c;
  }
}
