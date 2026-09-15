export interface CPUBenchmark {
  cpuName: string;
  cinebenchR23Single: number;
  cinebenchR23Multi: number;
  geekbench6Multi: number;
  tdpWatts: number;
  cores: number;
  threads: number;
}

export interface GPUBenchmark {
  gpuName: string;
  tgpWatts: number;
  timeSpyScore: number;
  valorantFPS1080p: number;
  cyberpunkFPS1080p: number;
  vramGB: number;
}

export interface ProductBenchmarkData {
  productId: string;
  cpu: CPUBenchmark;
  gpu: GPUBenchmark;
  batteryRunHoursWeb: number;
}
