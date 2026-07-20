import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-errors';
import { logger } from '../utils/logger';

/**
 * Global error handling middleware.
 * Catches all thrown errors, formats them consistently, and returns JSON responses.
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ errors: err.serializeErrors() });
    return;
  }

  logger.error('Unhandled error:', { error: err.message, stack: err.stack });

  res.status(500).json({
    errors: [{ message: 'Something went wrong' }],
  });
};
