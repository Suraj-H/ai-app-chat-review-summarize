import { ipKeyGenerator, rateLimit } from 'express-rate-limit';
import { ERROR_MESSAGES } from '../config/errors';
import { HTTP_STATUS } from '../config/http';
import { LOGGING_CONSTANTS } from '../config/logging';
import { ROUTES } from '../config/routes';

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Maximum requests per window
export const rateLimitMiddleware = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: {
    error: ERROR_MESSAGES.TOO_MANY_REQUESTS,
    message: `${ERROR_MESSAGES.RATE_LIMIT_EXCEEDED} ${MAX_REQUESTS} requests per ${WINDOW_MS / 1000 / 60} minutes.`,
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Use IP address for rate limiting with proper IPv6 handling
  keyGenerator: (req) => {
    const ip = req.ip || req.socket.remoteAddress;
    if (!ip) {
      return LOGGING_CONSTANTS.UNKNOWN_IP;
    }
    // Use ipKeyGenerator to properly handle IPv6 addresses (uses /56 subnet for IPv6)
    return ipKeyGenerator(ip, 56);
  },
  handler: (req, res) => {
    res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
      error: ERROR_MESSAGES.TOO_MANY_REQUESTS,
      message: `${ERROR_MESSAGES.RATE_LIMIT_EXCEEDED} ${MAX_REQUESTS} requests per ${WINDOW_MS / 1000 / 60} minutes.`,
      retryAfter: Math.ceil(WINDOW_MS / 1000),
    });
  },
  skip: (req) => {
    return req.path === ROUTES.HEALTH;
  },
});
