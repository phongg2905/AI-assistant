export interface AIConfig {
  provider: 'mock' | 'openai' | 'anthropic' | 'gemini' | 'local';
  modelName: string;
  temperature: number;
  maxTokens: number;
  whisperModel: string;
}

export const aiConfig = (): { ai: AIConfig } => ({
  ai: {
    provider: (process.env.AI_PROVIDER as any) || 'local',
    modelName: process.env.AI_MODEL_NAME || 'distilbert-base-uncased-mnli',
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.2'),
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '1024', 10),
    whisperModel: process.env.WHISPER_MODEL || 'Xenova/whisper-small',
  },
});
