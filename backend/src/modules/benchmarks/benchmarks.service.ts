import { Injectable } from '@nestjs/common';
import { BenchmarksRepository, CPUBenchmark, GPUBenchmark } from './benchmarks.repository.js';

@Injectable()
export class BenchmarksService {
  constructor(private readonly benchmarksRepo: BenchmarksRepository) {}

  async getCpuBenchmark(cpu: string): Promise<CPUBenchmark | null> {
    return this.benchmarksRepo.findCpuBenchmark(cpu);
  }

  async getGpuBenchmark(gpu: string): Promise<GPUBenchmark | null> {
    return this.benchmarksRepo.findGpuBenchmark(gpu);
  }
}
