export const LOG_MESSAGES = {
  ERROR: 'Error:',
  CHAT_SERVICE_ERROR: 'Chat service error:',
  UNHANDLED_PRISMA_ERROR: 'Unhandled Prisma error:',
  ENV_VALIDATION_FAILED: '❌ Environment variable validation failed:',
  SERVER_RUNNING: (port: number) =>
    `Server is running on http://localhost:${port}. 🚀`,
  HTTP_SERVER_CLOSED: 'HTTP server closed',
  DATABASE_CONNECTION_CLOSED: 'Database connection closed',
  ERROR_DURING_SHUTDOWN: 'Error during shutdown:',
  UNCAUGHT_EXCEPTION: 'Uncaught Exception:',
  UNHANDLED_REJECTION: 'Unhandled Rejection at:',
  SHUTDOWN_SIGNAL: (signal: string) =>
    `\n${signal} received, shutting down gracefully...`,
} as const;

export const PRISMA_LOG_LEVELS = {
  QUERY: 'query',
  ERROR: 'error',
  WARN: 'warn',
} as const;

export const MORGAN_TOKENS = {
  RESPONSE_TIME: 'response-time',
} as const;

export const LOGGING_CONSTANTS = {
  UNKNOWN_IP: 'unknown',
  ROOT_PATH: 'root',
} as const;
