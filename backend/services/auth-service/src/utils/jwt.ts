import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { config } from '../config/env.js';
import { verifyToken } from '@ecom/shared';

export interface TokenPayload {
  userId: string;
  id: string;
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
}

export class JWTUtils {
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign({ ...payload, tokenType: 'access' }, config.jwtSecret, { algorithm: 'HS256', expiresIn: '15m' });
  }

  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign({ ...payload, tokenType: 'refresh', jti: crypto.randomUUID() },
      config.jwtRefreshSecret, { algorithm: 'HS256', expiresIn: '7d' });
  }

  static async verifyAccessToken(token: string): Promise<TokenPayload> {
    return verifyToken(token, 'access');
  }

  static async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return verifyToken(token, 'refresh');
  }
}
