import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/CustomError.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      success: false,
      errors: err.serializeErrors(),
    });
    return;
  }

  console.error('Unhandled Error:', err);

  res.status(500).json({
    success: false,
    errors: [{ message: 'Internal Server Error' }],
  });
};
