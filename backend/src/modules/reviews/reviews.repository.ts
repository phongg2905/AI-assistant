import { Injectable } from '@nestjs/common';

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  source: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  createdAt: Date;
}

@Injectable()
export class ReviewsRepository {
  private reviews: Review[] = [
    {
      id: 'rev-1',
      productId: 'prod-1',
      author: 'Nguyễn Văn A',
      rating: 5,
      comment: 'Pin siêu trâu, máy mát rượi, mang đi học cả ngày không cần sạc.',
      source: 'cellphones',
      sentiment: 'positive',
      createdAt: new Date(),
    },
    {
      id: 'rev-2',
      productId: 'prod-2',
      author: 'Trần Minh B',
      rating: 4.8,
      comment: 'Màn hình OLED 3K quá đẹp, chơi Cyberpunk 2077 mượt mà với DLSS 3.',
      source: 'gearvn',
      sentiment: 'positive',
      createdAt: new Date(),
    },
    {
      id: 'rev-3',
      productId: 'prod-3',
      author: 'Lê Hoàng C',
      rating: 5,
      comment: 'Bàn phím ThinkPad gõ sướng nhất, RAM 32GB chạy 15 container docker mượt re.',
      source: 'phongvu',
      sentiment: 'positive',
      createdAt: new Date(),
    },
  ];

  async findByProductId(productId: string): Promise<Review[]> {
    return this.reviews.filter(r => r.productId === productId);
  }

  async searchReviews(query: string): Promise<Review[]> {
    const q = query.toLowerCase();
    return this.reviews.filter(r => r.comment.toLowerCase().includes(q));
  }
}
