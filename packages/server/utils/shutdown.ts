import type { Server } from 'http';
import { LOG_MESSAGES } from '../config/logging';
import { prisma } from '../repositories/prisma';

export function setupGracefulShutdown(server: Server): void {
  const shutdown = async (signal: string) => {
    console.log(LOG_MESSAGES.SHUTDOWN_SIGNAL(signal));

    server.close(() => {
      console.log(LOG_MESSAGES.HTTP_SERVER_CLOSED);
    });

    try {
      await prisma.$disconnect();
      console.log(LOG_MESSAGES.DATABASE_CONNECTION_CLOSED);
      process.exit(0);
    } catch (error) {
      console.error(LOG_MESSAGES.ERROR_DURING_SHUTDOWN, error);
      process.exit(1);
    }
  };

  // Handle termination signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('uncaughtException', (error) => {
    console.error(LOG_MESSAGES.UNCAUGHT_EXCEPTION, error);
    shutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error(LOG_MESSAGES.UNHANDLED_REJECTION, promise, 'reason:', reason);
    shutdown('unhandledRejection');
  });
}
