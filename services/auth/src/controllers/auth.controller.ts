import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  verifyEmail,
  forgotPassword,
  getCurrentUser,
} from '../services/auth.service';

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, role } = req.body as {
    email: string;
    password: string;
    role?: 'CUSTOMER' | 'ADMIN' | 'VENDOR';
  };

  const { user, tokens } = await registerUser(email, password, role);

  res.status(201).json({
    message: 'User registered successfully',
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const { user, tokens } = await loginUser(email, password);

  res.status(200).json({
    message: 'Login successful',
    user,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

// POST /api/auth/logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body as { refreshToken: string };
  const userId = req.currentUser!.id;

  await logoutUser(userId, refreshToken);

  res.status(200).json({ message: 'Logged out successfully' });
};

// POST /api/auth/refresh-token
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken: token } = req.body as { refreshToken: string };

  const tokens = await refreshAccessToken(token);

  res.status(200).json({
    message: 'Token refreshed successfully',
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
};

// POST /api/auth/verify-email/:token
export const verifyUserEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.params;

  const user = await verifyEmail(token!);

  res.status(200).json({
    message: 'Email verified successfully',
    user,
  });
};

// POST /api/auth/forgot-password
export const forgotUserPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body as { email: string };

  const message = await forgotPassword(email);

  res.status(200).json({ message });
};

// GET /api/auth/me
export const me = async (req: Request, res: Response): Promise<void> => {
  const user = await getCurrentUser(req.currentUser!.id);

  res.status(200).json({ user });
};
