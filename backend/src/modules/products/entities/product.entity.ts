export interface LaptopSpecs {
  cpu: string;
  gpu?: string;
  ramGb: number;
  storageGb: number;
  storageType?: string;
  screenSizeInch: number;
  resolution?: string;
  refreshRateHz?: number;
  batteryWattHours?: number;
  weightKg: number;
  cpuBenchmark?: number;
  gpuTGP?: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  priceVnd: number;
  originalPriceVnd?: number;
  imageUrl?: string;
  productUrl?: string;
  source: 'gearvn' | 'cellphones' | 'phongvu' | 'manual';
  specs: LaptopSpecs;
  tags?: string[];
  inStock: boolean;
  score?: number;
  matchScore?: number;
  tradeOffNotes?: string[];
  cpuBenchmark?: number;
  gpuTGP?: number;
  weightNum?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
