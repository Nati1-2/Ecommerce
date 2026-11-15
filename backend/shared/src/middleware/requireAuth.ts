import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';

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
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
};

export const requireVendor = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.currentUser) {
    throw new UnauthorizedError('Authentication required');
  }

  if (req.currentUser.role !== 'VENDOR' && req.currentUser.role !== 'ADMIN') {
    throw new ForbiddenError('Vendor access required');
  }

  next();
};

export const requireAdmin = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.currentUser) {
    throw new UnauthorizedError('Authentication required');
  }

  if (req.currentUser.role !== 'ADMIN') {
    throw new ForbiddenError('Admin access required');
  }

  next();
};
