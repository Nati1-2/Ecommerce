import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error caught in middleware:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
    return;
  }

  // Handle mongoose validation/cast errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: err.message
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `Invalid format for field ${err.path}`
    });
    return;
  }

  // Fallback to 500
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};
