import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

export interface VerifiedToken {
  id: string;
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
}

function getSecret(type: 'access' | 'refresh'): string {
  const name = type === 'access' ? 'JWT_ACCESS_SECRET' : 'JWT_REFRESH_SECRET';
  const fallback = type === 'access'
    ? 'dev_access_secret_only_for_local_testing_min_32_chars'
    : 'dev_refresh_secret_only_for_local_testing_min_32_chars';
  const value = process.env[name];
  if (process.env.NODE_ENV === 'production' && (!value || value.length < 32)) {
    throw new Error(`${name} must be at least 32 characters in production`);
  }
  const secret = value || fallback;
  if (type === 'refresh' && secret === getSecret('access')) {
    throw new Error('Access and refresh secrets must differ');
  }
  return secret;
}

export async function verifyToken(token: string, type: 'access' | 'refresh' = 'access'): Promise<VerifiedToken> {
  const value = jwt.verify(token, getSecret(type), { algorithms: ['HS256'] });
  if (typeof value === 'string') throw new Error('Invalid token claims');
  const claims: JwtPayload = value;
  if (claims.tokenType !== type || typeof claims.exp !== 'number' ||
      claims.exp <= Math.floor(Date.now() / 1000) ||
      typeof claims.id !== 'string' || !claims.id ||
      typeof claims.email !== 'string' || !claims.email ||
      !['CUSTOMER', 'VENDOR', 'ADMIN'].includes(claims.role)) {
    throw new Error('Invalid token claims');
  }

  const endpoint = process.env.TOKEN_STATUS_URL ||
    (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000/api/auth/token-status');
  if (!endpoint) throw new Error('TOKEN_STATUS_URL is required');
  const statusUrl = new URL(endpoint);
  if (process.env.NODE_ENV === 'production' && statusUrl.protocol !== 'https:') {
    throw new Error('TOKEN_STATUS_URL must use HTTPS in production');
  }
  const response = await fetch(statusUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, type }),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok || (await response.json()).valid !== true) {
    throw new Error('Token revoked or revocation service unavailable');
  }
  return {
    id: claims.id,
    userId: typeof claims.userId === 'string' ? claims.userId : claims.id,
    email: claims.email,
    role: claims.role as VerifiedToken['role'],
  };
}
