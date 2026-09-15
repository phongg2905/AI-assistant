import { Injectable } from '@nestjs/common';
import { UserMemory } from './memory.entity.js';

@Injectable()
export class MemoryRepository {
  private memoryStore = new Map<string, UserMemory>();

  get(userId: string): UserMemory | undefined {
    return this.memoryStore.get(userId);
  }

  save(memory: UserMemory): UserMemory {
    this.memoryStore.set(memory.userId, memory);
    return memory;
  }
}
