export type RegretLevel = 'Thấp' | 'Trung bình' | 'Cao';

export interface Product {
  id: string;
  name: string;
  category: 'GAMING' | 'ULTRABOOK' | 'ENTRY GAMING' | 'WORKSTATION' | 'CREATOR';
  price: string;
  priceNum: number;
  cpu: string;
  cpuBenchmark: number; // Cinebench/Geekbench normalized
  gpu: string;
  gpuTGP: number; // W
  ram: string;
  ramUpgradeable: boolean;
  storage: string;
  display: string;
  weight: string;
  weightNum: number; // kg
  batteryWh: number;
  material: 'Nhôm' | 'Nhựa' | 'Magie';
  ppScore: number; // 0-10
  regret: RegretLevel;
  regretColor: string;
  regretReasons: string[];
  benchmark: string;
  pros: string[];
  cons: string[];
  affiliate: string;
  affiliateUrl?: string;
  badge?: string;
  // GraphRAG links
  canRun: string[]; // software/game names
  limitations: string[];
}

export interface TradeOffRow {
  criteria: string;
  values: string[];
}

export interface RecommendationMatrix {
  headers: string[]; // product names
  rows: TradeOffRow[];
  analysis: string;
}
