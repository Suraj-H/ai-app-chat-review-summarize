import type { Request, Response } from 'express';
import morgan from 'morgan';
import { env } from '../config/env';
import { HTTP_METHODS } from '../config/http';
import { MORGAN_TOKENS } from '../config/logging';
import { ROUTES } from '../config/routes';

morgan.token('response-time-ms', (req, res) => {
  const responseTime = (res as any)[MORGAN_TOKENS.RESPONSE_TIME];
  if (!responseTime) return '';
  return `${Math.round(parseFloat(responseTime))}ms`;
});

const devLogger = morgan(
  ':method :url :status :response-time-ms - :res[content-length]',
  {
    skip: (req: Request) => {
      return req.path === ROUTES.HEALTH || req.method === HTTP_METHODS.OPTIONS;
    },
  }
);

const prodLogger = morgan(
  (tokens: any, req: Request, res: Response): string => {
    const method = tokens.method?.(req, res) || '';
    const url = tokens.url?.(req, res) || '';
    const status = tokens.status?.(req, res) || '0';
    const responseTime = tokens[MORGAN_TOKENS.RESPONSE_TIME]?.(req, res) || '0';
    const ip = tokens['remote-addr']?.(req, res) || '';
    const userAgent = tokens['user-agent']?.(req, res) || '';

    return JSON.stringify({
      method,
      url,
      status: Number(status),
      responseTime: `${Math.round(parseFloat(responseTime))}ms`,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  },
  {
    skip: (req: Request, res: Response) => {
      return (
        req.path === ROUTES.HEALTH ||
        req.method === HTTP_METHODS.OPTIONS ||
        res.statusCode < 400
      );
    },
  }
);

export const requestLogger =
  env.NODE_ENV === 'development' ? devLogger : prodLogger;
