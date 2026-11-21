import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@ecom/shared';
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

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : req.cookies?.token;

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. No token found.' });
    return;
  }

  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Failed to verify token:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};
