import { env } from '../config/env';
import { PRISMA_LOG_LEVELS } from '../config/logging';
import { PrismaClient } from '../generated/prisma';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? [
            PRISMA_LOG_LEVELS.QUERY,
            PRISMA_LOG_LEVELS.ERROR,
            PRISMA_LOG_LEVELS.WARN,
          ]
        : [PRISMA_LOG_LEVELS.ERROR],
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
