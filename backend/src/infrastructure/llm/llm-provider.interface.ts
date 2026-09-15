export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
}

export interface LLMCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMProvider {
  generate(messages: ChatMessage[], options?: LLMCompletionOptions): Promise<string>;
  stream(messages: ChatMessage[], options?: LLMCompletionOptions): AsyncIterable<string>;
}
