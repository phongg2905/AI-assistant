export type ReasoningStep = {
  id: string;
  label: string;
  status: "pending" | "active" | "done";
  detail: string;
  time?: string;
};
export type Product = {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  display: string;
  weight: string;
  weightNum?: number;
  batteryWh?: number;
  ppScore: number;
  regret: "Thấp" | "Trung bình" | "Cao";
  regretColor: string;
  benchmark: string;
  pros: string[];
  cons: string[];
  affiliate: string;
  badge?: string;
  category: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  reasoning?: ReasoningStep[];
  products?: Product[];
  clarification?: { question: string; options: string[] };
  matrix?: boolean;
};
