import {
  BadRequestError,
  NotFoundError,
  NotAuthorizedError,
  ConflictError,
  createLogger,
  messageBroker,
  EventType,
} from '@ecom/common';
import { User, IUser } from '../models/user.model';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateRandomToken,
} from './token.service';

const logger = createLogger('auth-service:service');

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface RegisterResult {
  user: IUser;
  tokens: AuthTokens;
}

// ────────────────────────────────────────────────
// Register
// ────────────────────────────────────────────────
export const registerUser = async (
  email: string,
  password: string,
  role: 'CUSTOMER' | 'ADMIN' | 'VENDOR' = 'CUSTOMER'
): Promise<RegisterResult> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ConflictError('A user with this email already exists');
  }

  const verificationToken = generateRandomToken();

  const user = new User({
    email,
    password,
    role,
    verificationToken,
  });

  // Generate tokens
  const accessToken = generateAccessToken({
    id: user.id as string,
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    id: user.id as string,
    tokenVersion: 0,
  });

  user.refreshTokens.push(refreshToken);
  await user.save();

  // Publish USER_CREATED event
  await messageBroker.publish({
    type: EventType.USER_CREATED,
    data: {
      userId: user.id as string,
      email: user.email,
      role: user.role,
    },
    timestamp: new Date().toISOString(),
  });

  logger.info('User registered', { userId: user.id, email: user.email });

  return { user, tokens: { accessToken, refreshToken } };
};

// ────────────────────────────────────────────────
// Login
// ────────────────────────────────────────────────
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: IUser; tokens: AuthTokens }> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError('Invalid credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new BadRequestError('Invalid credentials');
  }

  const accessToken = generateAccessToken({
    id: user.id as string,
    email: user.email,
    role: user.role,
  });
  const refreshToken = generateRefreshToken({
    id: user.id as string,
    tokenVersion: 0,
  });

  user.refreshTokens.push(refreshToken);

  // Limit stored refresh tokens to the 5 most recent
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }

  await user.save();

  logger.info('User logged in', { userId: user.id });

  return { user, tokens: { accessToken, refreshToken } };
};

// ────────────────────────────────────────────────
// Logout
// ────────────────────────────────────────────────
export const logoutUser = async (
  userId: string,
  refreshToken: string
): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
  await user.save();

  logger.info('User logged out', { userId });
};

// ────────────────────────────────────────────────
// Refresh Token
// ────────────────────────────────────────────────
export const refreshAccessToken = async (
  oldRefreshToken: string
): Promise<AuthTokens> => {
  let payload;
  try {
    payload = verifyRefreshToken(oldRefreshToken);
  } catch {
    throw new NotAuthorizedError();
  }

  const user = await User.findById(payload.id);
  if (!user) {
    throw new NotAuthorizedError();
  }

  // Check that the refresh token is still stored (not revoked)
  if (!user.refreshTokens.includes(oldRefreshToken)) {
    // Possible token reuse attack — invalidate all refresh tokens
    user.refreshTokens = [];
    await user.save();
    logger.warn('Refresh token reuse detected, all tokens revoked', {
      userId: user.id,
    });
    throw new NotAuthorizedError();
  }

  // Rotate refresh token
  user.refreshTokens = user.refreshTokens.filter((t) => t !== oldRefreshToken);

  const accessToken = generateAccessToken({
    id: user.id as string,
    email: user.email,
    role: user.role,
  });
  const newRefreshToken = generateRefreshToken({
    id: user.id as string,
    tokenVersion: 0,
  });

  user.refreshTokens.push(newRefreshToken);
  await user.save();

  logger.info('Access token refreshed', { userId: user.id });

  return { accessToken, refreshToken: newRefreshToken };
};

// ────────────────────────────────────────────────
// Verify Email
// ────────────────────────────────────────────────
export const verifyEmail = async (token: string): Promise<IUser> => {
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    throw new BadRequestError('Invalid or expired verification token');
  }

  user.isVerified = true;
  user.verificationToken = null;
  await user.save();

  logger.info('Email verified', { userId: user.id });

  return user;
};

// ────────────────────────────────────────────────
// Forgot Password
// ────────────────────────────────────────────────
export const forgotPassword = async (email: string): Promise<string> => {
  const user = await User.findOne({ email });
  if (!user) {
    // Return the same message for security — don't reveal if user exists
    return 'If an account with that email exists, a password reset link has been sent.';
  }

  const resetToken = generateRandomToken();

  // Store the reset token in the verification token field (reused for password resets)
  user.verificationToken = resetToken;
  await user.save();

  // In production, send an email with the reset link.
  // For now, log the token for development purposes.
  logger.info('Password reset token generated', {
    userId: user.id,
    resetToken,
  });

  return 'If an account with that email exists, a password reset link has been sent.';
};

// ────────────────────────────────────────────────
// Get Current User
// ────────────────────────────────────────────────
export const getCurrentUser = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User');
  }
  return user;
};
