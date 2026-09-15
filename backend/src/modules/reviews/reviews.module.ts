import { Module } from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository.js';
import { ReviewsService } from './reviews.service.js';

@Module({
  providers: [ReviewsRepository, ReviewsService],
  exports: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}
