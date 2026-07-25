import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.currentUser) {
    throw new UnauthorizedError('Authentication required');
  }
  next();
};

export const requireRoles = (roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.currentUser) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!roles.includes(req.currentUser.role)) {
      throw new UnauthorizedError('Insufficient permissions');
    }

    next();
  };
};
