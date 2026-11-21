import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@ecom/shared';

export interface UserPayload {
  id: string;
  email?: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, errors: [{ message: 'Authentication required' }] });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = await verifyToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, errors: [{ message: 'Invalid or expired access token' }] });
  }
};

export const requireRole = (roles: Array<'CUSTOMER' | 'VENDOR' | 'ADMIN'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, errors: [{ message: 'Authentication required' }] });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, errors: [{ message: 'Insufficient permissions' }] });
      return;
    }

    next();
  };
};
