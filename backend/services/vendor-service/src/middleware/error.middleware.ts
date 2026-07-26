import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error in Vendor Service pipeline:', err);

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      errors: err.errors.map((e) => ({
        message: `${e.path.join('.')}: ${e.message}`
      }))
    });
    return;
  }

  // 2. Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    res.status(400).json({
      success: false,
      errors: [{ message: `A record with this ${field} already exists.` }]
    });
    return;
  }

  // 3. General custom or standard error
  const statusCode = err.statusCode || 400;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    errors: [{ message }]
  });
};
