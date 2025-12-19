import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import {
  ERROR_MESSAGES,
  ERROR_TYPES,
  ErrorCode,
  PRISMA_ERROR_CODES,
} from '../config/errors';
import { HTTP_STATUS } from '../config/http';
import { LOG_MESSAGES } from '../config/logging';

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
  console.error(LOG_MESSAGES.ERROR, {
    message: err.message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (isPrismaKnownRequestError(err)) {
    switch (err.code) {
      case PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_VIOLATION:
        return res.status(HTTP_STATUS.CONFLICT).json({
          error: ERROR_MESSAGES.RESOURCE_ALREADY_EXISTS,
          code: ErrorCode.UNIQUE_CONSTRAINT_VIOLATION,
        });
      case PRISMA_ERROR_CODES.RECORD_NOT_FOUND:
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ERROR_MESSAGES.RESOURCE_NOT_FOUND,
          code: ErrorCode.RECORD_NOT_FOUND,
        });
      case PRISMA_ERROR_CODES.FOREIGN_KEY_CONSTRAINT:
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          error: ERROR_MESSAGES.INVALID_REFERENCE,
          code: ErrorCode.FOREIGN_KEY_CONSTRAINT,
        });
      default:
        console.error(LOG_MESSAGES.UNHANDLED_PRISMA_ERROR, err.code);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
          error: ERROR_MESSAGES.DATABASE_ERROR,
          code: ErrorCode.DATABASE_ERROR,
        });
    }
  }

  if (err.name === ERROR_TYPES.ZOD_ERROR) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.VALIDATION_FAILED,
      details: (err as any).issues,
    });
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    ...(env.NODE_ENV === 'development' && {
      message: err.message,
      stack: err.stack,
    }),
  });
};
