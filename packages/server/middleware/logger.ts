import type { Request, Response } from 'express';
import morgan from 'morgan';
import { env } from '../config/env';

// Custom token for response time in milliseconds
morgan.token('response-time-ms', (req, res) => {
  const responseTime = (res as any)['response-time'];
  if (!responseTime) return '';
  return `${Math.round(parseFloat(responseTime))}ms`;
});

// Development logger: Colored, concise format
// Example: GET /api/chat 200 45ms - 1234
const devLogger = morgan(
  ':method :url :status :response-time-ms - :res[content-length]',
  {
    skip: (req: Request) => {
      return req.path === '/health' || req.method === 'OPTIONS';
    },
  }
);

// Production logger: Structured JSON format
const prodLogger = morgan(
  (tokens: any, req: Request, res: Response): string => {
    const method = tokens.method?.(req, res) || '';
    const url = tokens.url?.(req, res) || '';
    const status = tokens.status?.(req, res) || '0';
    const responseTime = tokens['response-time']?.(req, res) || '0';
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
        req.path === '/health' ||
        req.method === 'OPTIONS' ||
        res.statusCode < 400 // Only log errors in production
      );
    },
  }
);

// Export the appropriate logger based on environment
export const requestLogger =
  env.NODE_ENV === 'development' ? devLogger : prodLogger;
