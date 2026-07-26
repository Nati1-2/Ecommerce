import { Request, Response, NextFunction } from 'express';

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(430).json({ 
        success: false, 
        message: `Role Forbidden: Required one of [${roles.join(', ')}], actual: '${req.user.role}'` 
      });
      return;
    }

    next();
  };
};
