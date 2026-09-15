export interface ProductReview {
  id: string;
  productId: string;
  productName: string;
  author: string;
  rating: number; // 1-5
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  verifiedPurchase: boolean;
  createdAt: string;
  source: string;
}
