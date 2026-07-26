import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';

export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const hasRole = roles.some((role) => role.toLowerCase() === req.user?.role.toLowerCase());
    if (!hasRole) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of the following roles: [${roles.join(', ')}]`
      });
      return;
    }

    next();
  };
};
