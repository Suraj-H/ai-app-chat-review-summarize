import { PrismaClient, type Product } from '../generated/prisma';

const prisma = new PrismaClient();

export const productRepository = {
  async getProduct(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  },
};
