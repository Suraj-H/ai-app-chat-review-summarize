export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  VALIDATION_FAILED: 'Validation failed',
  DATABASE_ERROR: 'Database error',

  RESOURCE_ALREADY_EXISTS: 'Resource already exists',
  RESOURCE_NOT_FOUND: 'Resource not found',
  INVALID_REFERENCE: 'Invalid reference',

  FAILED_TO_GENERATE_RESPONSE: 'Failed to generate a response!',

  INVALID_PRODUCT: 'Invalid product.',
  FAILED_TO_GET_REVIEWS: 'Failed to get reviews!',
  FAILED_TO_SUMMARIZE_REVIEWS: 'Failed to summarize reviews!',
  NO_REVIEWS_TO_SUMMARIZE:
    'There are no reviews for this product to summarize.',

  TOO_MANY_REQUESTS: 'Too many requests',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Maximum',
} as const;

export enum ErrorCode {
  UNIQUE_CONSTRAINT_VIOLATION = 'UNIQUE_CONSTRAINT_VIOLATION',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  FOREIGN_KEY_CONSTRAINT = 'FOREIGN_KEY_CONSTRAINT',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

export const PRISMA_ERROR_CODES = {
  UNIQUE_CONSTRAINT_VIOLATION: 'P2002',
  RECORD_NOT_FOUND: 'P2025',
  FOREIGN_KEY_CONSTRAINT: 'P2003',
} as const;

export const ERROR_TYPES = {
  ZOD_ERROR: 'ZodError',
} as const;
