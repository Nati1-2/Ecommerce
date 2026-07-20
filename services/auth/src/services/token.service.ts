import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { createLogger } from '@ecom/common';

const logger = createLogger('auth-service:token');

export interface AccessTokenPayload {
  id: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload {
  id: string;
  tokenVersion: number;
}

const getAccessSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    logger.warn('JWT_ACCESS_SECRET is not set. Using fallback (NOT for production).');
    return 'fallback-access-secret';
  }
  return secret;
};

const getRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    logger.warn('JWT_REFRESH_SECRET is not set. Using fallback (NOT for production).');
    return 'fallback-refresh-secret';
  }
  return secret;
};

/**
 * Sign a short-lived access token (15m by default).
 */
export const generateAccessToken = (payload: AccessTokenPayload): string => {
  const expiry = process.env.JWT_ACCESS_EXPIRY || '15m';
  return jwt.sign(payload, getAccessSecret(), { expiresIn: expiry });
};

/**
 * Sign a long-lived refresh token (7d by default).
 */
export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  const expiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  return jwt.sign(payload, getRefreshSecret(), { expiresIn: expiry });
};

/**
 * Verify and decode an access token.
 */
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, getAccessSecret()) as AccessTokenPayload;
};

/**
 * Verify and decode a refresh token.
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, getRefreshSecret()) as RefreshTokenPayload;
};

/**
 * Generate a cryptographically secure random token (hex string).
 * Used for email verification and password reset tokens.
 */
export const generateRandomToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
