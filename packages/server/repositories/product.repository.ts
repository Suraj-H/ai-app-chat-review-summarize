import type { Product } from '../generated/prisma';
import { prisma } from './prisma';

export const productRepository = {
  async getProduct(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  },
};
