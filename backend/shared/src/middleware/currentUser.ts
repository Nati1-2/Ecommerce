import { Request, Response, NextFunction } from 'express';

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

export const currentUser = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const userId = req.headers['x-user-id'] as string;
  const userEmail = req.headers['x-user-email'] as string;
  const userRole = req.headers['x-user-role'] as 'CUSTOMER' | 'VENDOR' | 'ADMIN';

  if (userId && userEmail && userRole) {
    req.currentUser = {
      id: userId,
      email: userEmail,
      role: userRole,
    };
  }

  next();
};
