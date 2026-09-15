import { Module } from '@nestjs/common';
import { MemoryRepository } from './memory.repository.js';
import { MemoryExtractorService } from './memory-extractor.service.js';
import { MemoryService } from './memory.service.js';

@Module({
  providers: [MemoryRepository, MemoryExtractorService, MemoryService],
  exports: [MemoryService, MemoryRepository],
})
export class MemoryModule {}
