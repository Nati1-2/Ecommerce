import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

interface UserPayload {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  // 1. Check Gateway Headers
  const gatewayUserId = req.headers['x-user-id'];
  const gatewayUserEmail = req.headers['x-user-email'];
  const gatewayUserRole = req.headers['x-user-role'];

  if (gatewayUserId && gatewayUserEmail && gatewayUserRole) {
    req.user = {
      id: gatewayUserId as string,
      email: gatewayUserEmail as string,
      role: gatewayUserRole as string
    };
    return next();
  }

  // 2. Local JWT Token extraction (fallback, e.g. direct dev testing)
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : req.cookies?.token;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. No token found.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Failed to verify token:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};
