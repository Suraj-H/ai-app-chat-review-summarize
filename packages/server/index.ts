import dotenv from 'dotenv';
import express from 'express';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { prisma } from './repositories/prisma';
import router from './routers';

// Load .env file (Bun auto-loads, but dotenv ensures compatibility)
dotenv.config();

const app = express();

// Middleware order matters: logging, then rate limiting, then body parsing
app.use(requestLogger);
app.use('/api', rateLimitMiddleware);
app.use(express.json());
app.use(router);

// Error handler must be after all routes
app.use(errorHandler);

const port = env.PORT;

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}. 🚀`);
});

// Graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\n${signal} received, shutting down gracefully...`);

  server.close(() => {
    console.log('HTTP server closed');
  });

  try {
    await prisma.$disconnect();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  shutdown('unhandledRejection');
});
