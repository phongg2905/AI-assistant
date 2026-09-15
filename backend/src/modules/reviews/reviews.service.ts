import { Injectable } from '@nestjs/common';
import { ReviewsRepository, Review } from './reviews.repository.js';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepo: ReviewsRepository) {}

  async findByProductId(productId: string): Promise<Review[]> {
    return this.reviewsRepo.findByProductId(productId);
  }

  async search(query: string): Promise<Review[]> {
    return this.reviewsRepo.searchReviews(query);
  }
}
