export interface ITool<TInput = any, TOutput = any> {
  name: string;
  description: string;
  execute(input: TInput): Promise<TOutput> | TOutput;
}
