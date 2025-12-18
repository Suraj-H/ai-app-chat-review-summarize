import type { Review } from '../generated/prisma';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const reviewRepository = {
  async getReviews(productId: number): Promise<Review[]> {
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
  },
};
