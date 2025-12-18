import type { Review, Summary } from '../generated/prisma';
import { prisma } from './prisma';

export const reviewRepository = {
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        author: true,
        rating: true,
        content: true,
        createdAt: true,
        productId: true,
      },
    });
  },

  async storeReviewSummary(
    productId: number,
    summary: string,
    expiryDays: number = 7
  ): Promise<Summary> {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * expiryDays);
    const now = new Date();

    return prisma.summary.upsert({
      where: { productId },
      update: {
        content: summary,
        expiresAt,
        generatedAt: now,
      },
      create: {
        productId,
        content: summary,
        expiresAt,
        generatedAt: now,
      },
    });
  },

  async getReviewSummary(productId: number): Promise<string | null> {
    const summary = await prisma.summary.findFirst({
      where: { AND: [{ productId }, { expiresAt: { gt: new Date() } }] },
      select: { content: true },
    });

    return summary?.content ?? null;
  },
};
