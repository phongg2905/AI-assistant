import { Injectable } from '@nestjs/common';
import { VectorSearchService, RetrievedDocument } from './vector-search.service.js';
import { ChunkingService } from './chunking.service.js';

@Injectable()
export class RetrievalService {
  constructor(
    private readonly vectorSearchService: VectorSearchService,
    private readonly chunkingService: ChunkingService,
  ) {}

  async ingestText(id: string, text: string, metadata: any = {}) {
    const chunks = this.chunkingService.chunkText(text);
    for (let i = 0; i < chunks.length; i++) {
      await this.vectorSearchService.indexDocument(`${id}-chunk-${i}`, chunks[i], metadata);
    }
  }

  async searchRelevantContext(query: string, topK: number = 3): Promise<RetrievedDocument[]> {
    return this.vectorSearchService.search(query, topK);
  }
}
