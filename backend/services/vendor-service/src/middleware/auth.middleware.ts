import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

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

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  // First check API Gateway forwarded headers
  const gatewayUserId = req.headers['x-user-id'] as string;
  const gatewayUserEmail = req.headers['x-user-email'] as string;
  const gatewayUserRole = req.headers['x-user-role'] as 'CUSTOMER' | 'VENDOR' | 'ADMIN';

  if (gatewayUserId && gatewayUserRole) {
    req.user = {
      id: gatewayUserId,
      email: gatewayUserEmail,
      role: gatewayUserRole
    };
    return next();
  }

  // Fallback: Verify JWT Authorization Bearer header directly
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, errors: [{ message: 'Authentication required' }] });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { userId?: string; id?: string; email?: string; role: any };
    req.user = {
      id: payload.userId || payload.id || '',
      email: payload.email,
      role: payload.role
    };
    next();
  } catch (error) {
    res.status(401).json({ success: false, errors: [{ message: 'Invalid or expired access token' }] });
  }
};
