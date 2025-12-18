import rateLimit from 'express-rate-limit';

// Rate limit configuration
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Maximum requests per window

// Standard rate limiter for API routes
export const rateLimitMiddleware = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: {
    error: 'Too many requests',
    message: `Rate limit exceeded. Maximum ${MAX_REQUESTS} requests per ${WINDOW_MS / 1000 / 60} minutes.`,
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Use IP address for rate limiting
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || 'unknown';
  },
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: `Rate limit exceeded. Maximum ${MAX_REQUESTS} requests per ${WINDOW_MS / 1000 / 60} minutes.`,
      retryAfter: Math.ceil(WINDOW_MS / 1000),
    });
  },
  // Skip rate limiting for certain conditions (optional)
  skip: (req) => {
    // Skip health checks
    return req.path === '/health';
  },
});
