import { Module } from '@nestjs/common';
import { PipelineService } from './pipeline.service.js';

@Module({
  providers: [PipelineService],
  exports: [PipelineService],
})
export class PipelineModule {}
