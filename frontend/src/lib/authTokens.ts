import jwt from "jsonwebtoken";
import { logger } from "@/lib/logger";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key_change_in_production";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || `${JWT_SECRET}_refresh`;

export interface TokenPayload {
  id: string;
  email: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  sessionId?: string;
}

const revokedTokens = new Set<string>();

export const authTokens = {
  generateAccessToken: (payload: TokenPayload): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  },

  generateRefreshToken: (payload: TokenPayload): string => {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return jwt.sign({ ...payload, sessionId }, REFRESH_SECRET, { expiresIn: "7d" });
  },

  verifyAccessToken: (token: string): TokenPayload | null => {
    if (revokedTokens.has(token)) return null;
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  },

  verifyRefreshToken: (refreshToken: string): TokenPayload | null => {
    if (revokedTokens.has(refreshToken)) return null;
    try {
      return jwt.verify(refreshToken, REFRESH_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  },

  revokeToken: (token: string) => {
    revokedTokens.add(token);
    logger.info("Token revoked successfully", { meta: { tokenSnippet: token.substring(0, 10) } });
  },
};
