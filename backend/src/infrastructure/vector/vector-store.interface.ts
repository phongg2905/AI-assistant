export interface VectorDocument {
  id: string;
  content: string;
  embedding?: number[];
  metadata: Record<string, any>;
}

export interface VectorSearchResult {
  document: VectorDocument;
  score: number;
}

export interface VectorStore {
  addDocuments(docs: VectorDocument[]): Promise<void>;
  similaritySearch(query: string | number[], topK: number, filter?: Record<string, any>): Promise<VectorSearchResult[]>;
  deleteDocument(id: string): Promise<void>;
}
