import { Injectable } from '@nestjs/common';

export interface CPUBenchmark {
  name: string;
  cinebenchR23Multi: number;
  cinebenchR23Single: number;
  geekbench6Multi: number;
  geekbench6Single: number;
}

export interface GPUBenchmark {
  name: string;
  timeSpyGraphics: number;
  fireStrikeGraphics: number;
}

@Injectable()
export class BenchmarksRepository {
  private cpuBenchmarks: Record<string, CPUBenchmark> = {
    'apple m2': { name: 'Apple M2', cinebenchR23Multi: 8700, cinebenchR23Single: 1580, geekbench6Multi: 9800, geekbench6Single: 2600 },
    'amd ryzen 9 8945hs': { name: 'AMD Ryzen 9 8945HS', cinebenchR23Multi: 16500, cinebenchR23Single: 1820, geekbench6Multi: 12500, geekbench6Single: 2650 },
    'amd ryzen 7 pro 7840u': { name: 'AMD Ryzen 7 PRO 7840U', cinebenchR23Multi: 13800, cinebenchR23Single: 1750, geekbench6Multi: 11000, geekbench6Single: 2500 },
    'intel core i7-1360p': { name: 'Intel Core i7-1360P', cinebenchR23Multi: 11900, cinebenchR23Single: 1780, geekbench6Multi: 10400, geekbench6Single: 2450 },
    'intel core ultra 7 155h': { name: 'Intel Core Ultra 7 155H', cinebenchR23Multi: 15200, cinebenchR23Single: 1760, geekbench6Multi: 12200, geekbench6Single: 2400 },
  };

  private gpuBenchmarks: Record<string, GPUBenchmark> = {
    'rtx 4060': { name: 'NVIDIA GeForce RTX 4060 Laptop', timeSpyGraphics: 10500, fireStrikeGraphics: 26000 },
    'intel arc': { name: 'Intel Arc Graphics (8 Xe cores)', timeSpyGraphics: 3400, fireStrikeGraphics: 8500 },
    'radeon 780m': { name: 'AMD Radeon 780M', timeSpyGraphics: 3100, fireStrikeGraphics: 7800 },
  };

  async findCpuBenchmark(cpuName: string): Promise<CPUBenchmark | null> {
    const key = Object.keys(this.cpuBenchmarks).find(k => cpuName.toLowerCase().includes(k));
    return key ? this.cpuBenchmarks[key] : null;
  }

  async findGpuBenchmark(gpuName: string): Promise<GPUBenchmark | null> {
    const key = Object.keys(this.gpuBenchmarks).find(k => gpuName.toLowerCase().includes(k));
    return key ? this.gpuBenchmarks[key] : null;
  }
}
