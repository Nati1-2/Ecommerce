import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../security/tokenVerification.js';

export interface UserPayload {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const auth = req.headers.authorization;
  if (!auth) return next();
  if (!auth.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Invalid authorization header' });
    return;
  }
  try {
    const verified = await verifyToken(auth.slice(7));
    req.currentUser = { id: verified.id, email: verified.email, role: verified.role };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or unchecked token' });
  }
};
