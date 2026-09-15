import { Injectable } from '@nestjs/common';
import { ITool } from '../tool.interface.js';
import { ReviewsService } from '../../reviews/reviews.service.js';
import { Review } from '../../reviews/reviews.repository.js';

export interface SearchReviewsInput {
  productId?: string;
  query?: string;
}

@Injectable()
export class SearchReviewsTool implements ITool<SearchReviewsInput, Review[]> {
  readonly name = 'search_reviews';
  readonly description = 'Search verified buyer reviews and sentiment for laptops';

  constructor(private readonly reviewsService: ReviewsService) {}

  async execute(input: SearchReviewsInput): Promise<Review[]> {
    if (input.productId) {
      return this.reviewsService.findByProductId(input.productId);
    }
    if (input.query) {
      return this.reviewsService.search(input.query);
    }
    return [];
  }
}
