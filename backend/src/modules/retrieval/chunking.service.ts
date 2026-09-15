import { Injectable } from '@nestjs/common';

@Injectable()
export class ChunkingService {
  chunkText(text: string, chunkSize: number = 300, overlap: number = 50): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];

    for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.trim()) {
        chunks.push(chunk.trim());
      }
    }
    return chunks;
  }
}
