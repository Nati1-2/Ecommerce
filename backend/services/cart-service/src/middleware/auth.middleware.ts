import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@ecom/shared';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
  guestId?: string;
}

/**
  Extracts optional JWT token OR guest session ID (from X-Guest-Id header or query)
 */
export const parseSession = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.cookies?.token;

  if (token) {
    try {
      const decoded = await verifyToken(token);
      req.user = decoded;
    } catch {
      res.status(401).json({ success: false, message: 'Invalid or unchecked token' });
      return;
    }
  }

  const guestIdHeader = req.headers['x-guest-id'] || req.query.guestId;
  if (guestIdHeader && typeof guestIdHeader === 'string') {
    req.guestId = guestIdHeader;
  }

  next();
};

/**
 * Strict authentication check for endpoints like /merge that require a logged-in user
 */
export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required for this operation' });
    return;
  }
  next();
};
