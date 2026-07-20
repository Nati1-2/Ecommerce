import rateLimit from 'express-rate-limit';

/**
 * Global rate limiter — applies to all incoming requests.
 * 100 requests per 15-minute window per IP.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    errors: [{ message: 'Too many requests, please try again later.' }],
  },
});

/**
 * Stricter rate limiter for auth endpoints (login, register, forgot-password).
 * 20 requests per 15-minute window per IP.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    errors: [{ message: 'Too many authentication attempts, please try again later.' }],
  },
});
