import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error in Product Service pipeline:', err);

  const statusCode = err.statusCode || 400;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    errors: [{ message }]
  });
};
