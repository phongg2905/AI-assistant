import { Injectable } from '@nestjs/common';

export interface RetrievedDocument {
  id: string;
  content: string;
  score: number;
  metadata?: Record<string, any>;
}

@Injectable()
export class VectorSearchService {
  private inMemoryIndex: Array<{ id: string; text: string; metadata: any }> = [];

  async indexDocument(id: string, text: string, metadata: any = {}) {
    this.inMemoryIndex.push({ id, text, metadata });
  }

  async search(query: string, topK: number = 3): Promise<RetrievedDocument[]> {
    const qLower = query.toLowerCase();
    const scored = this.inMemoryIndex.map(doc => {
      let score = 0;
      const terms = qLower.split(/\s+/);
      for (const term of terms) {
        if (doc.text.toLowerCase().includes(term)) {
          score += 1;
        }
      }
      return {
        id: doc.id,
        content: doc.text,
        score: score / (terms.length || 1),
        metadata: doc.metadata,
      };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
  }
}
