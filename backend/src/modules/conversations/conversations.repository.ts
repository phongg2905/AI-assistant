import { Injectable } from '@nestjs/common';

export interface Conversation {
  id: string;
  title: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class ConversationsRepository {
  private conversations: Conversation[] = [];

  async create(title?: string, userId?: string): Promise<Conversation> {
    const convo: Conversation = {
      id: `convo-${Date.now()}`,
      title: title || 'Cuộc trò chuyện mới',
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.push(convo);
    return convo;
  }

  async findAll(): Promise<Conversation[]> {
    return this.conversations;
  }

  async findById(id: string): Promise<Conversation | null> {
    return this.conversations.find(c => c.id === id) || null;
  }
}
