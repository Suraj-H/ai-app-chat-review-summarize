import type { Review, Summary } from '../generated/prisma';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export const reviewRepository = {
  async getReviews(productId: number, limit?: number): Promise<Review[]> {
    return prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async storeReviewSummary(
    productId: number,
    summary: string
  ): Promise<Summary> {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days from now
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
