import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

// Type guard for Prisma errors (PrismaClientKnownRequestError has a 'code' property starting with 'P')
function isPrismaKnownRequestError(err: unknown): err is { code: string } {
  return (
    err !== null &&
    typeof err === 'object' &&
    'code' in err &&
    typeof (err as any).code === 'string' &&
    (err as any).code.startsWith('P')
  );
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error details
  console.error('Error:', {
    message: err.message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle Prisma-specific errors
  if (isPrismaKnownRequestError(err)) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'Resource already exists',
          code: 'UNIQUE_CONSTRAINT_VIOLATION',
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Resource not found',
          code: 'RECORD_NOT_FOUND',
        });
      case 'P2003':
        return res.status(400).json({
          error: 'Invalid reference',
          code: 'FOREIGN_KEY_CONSTRAINT',
        });
      default:
        console.error('Unhandled Prisma error:', err.code);
        return res.status(500).json({
          error: 'Database error',
          code: 'DATABASE_ERROR',
        });
    }
  }

  // Handle validation errors (Zod errors have a specific structure)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: (err as any).issues,
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error',
    ...(env.NODE_ENV === 'development' && {
      message: err.message,
      stack: err.stack,
    }),
  });
};
