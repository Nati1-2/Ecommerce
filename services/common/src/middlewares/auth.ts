import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { NotAuthorizedError } from '../errors/custom-errors';

// Extend Express Request to include currentUser
export interface UserPayload {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN' | 'VENDOR';
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

/**
 * Extracts and verifies JWT token from Authorization header.
 * Sets req.currentUser if token is valid, does NOT throw if absent.
 */
export const currentUser = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  try {
    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }
    const payload = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || 'fallback-secret'
    ) as UserPayload;
    req.currentUser = payload;
  } catch {
    // Token invalid or expired — proceed without setting currentUser
  }

  next();
};

/**
 * Requires user to be authenticated. Must be used AFTER currentUser middleware.
 */
export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
  next();
};

/**
 * Requires user to have a specific role. Must be used AFTER requireAuth.
 */
export const requireRole = (...roles: UserPayload['role'][]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.currentUser || !roles.includes(req.currentUser.role)) {
      throw new NotAuthorizedError();
    }
    next();
  };
};
