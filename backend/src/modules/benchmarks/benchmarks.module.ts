import { Module } from '@nestjs/common';
import { BenchmarksRepository } from './benchmarks.repository.js';
import { BenchmarksService } from './benchmarks.service.js';

@Module({
  providers: [BenchmarksRepository, BenchmarksService],
  exports: [BenchmarksService, BenchmarksRepository],
})
export class BenchmarksModule {}
