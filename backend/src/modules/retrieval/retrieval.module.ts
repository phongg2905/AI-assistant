import { Module } from '@nestjs/common';
import { ChunkingService } from './chunking.service.js';
import { VectorSearchService } from './vector-search.service.js';
import { RetrievalService } from './retrieval.service.js';

@Module({
  providers: [ChunkingService, VectorSearchService, RetrievalService],
  exports: [RetrievalService, VectorSearchService],
})
export class RetrievalModule {}
