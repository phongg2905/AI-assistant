export class ChatRequestDto {
  query!: string;
  conversationId?: string;
}

export class ChatResponseDto {
  traceId!: string;
  text!: string;
  products?: any[];
  matrix?: any;
  clarification?: any;
  timings?: Record<string, number>;
}
