import { Injectable } from '@nestjs/common';
import { ITool } from '../tool.interface.js';
import { BenchmarksService } from '../../benchmarks/benchmarks.service.js';

export interface BenchmarkInput {
  hardwareName: string;
  type: 'cpu' | 'gpu';
}

@Injectable()
export class GetBenchmarkTool implements ITool<BenchmarkInput, any> {
  readonly name = 'get_benchmark';
  readonly description = 'Get standardized benchmark scores for CPU or GPU hardware';

  constructor(private readonly benchmarksService: BenchmarksService) {}

  async execute(input: BenchmarkInput): Promise<any> {
    if (input.type === 'gpu') {
      return this.benchmarksService.getGpuBenchmark(input.hardwareName);
    }
    return this.benchmarksService.getCpuBenchmark(input.hardwareName);
  }
}
