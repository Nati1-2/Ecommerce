import jwt from "jsonwebtoken";
import crypto from "crypto";
import { logger } from "./logger.ts";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("FATAL: JWT_SECRET environment variable is missing in production.");
    }
    return "dev_secret_only_for_local_development_testing_min_32_chars";
  }
  return secret;
}

function getRefreshSecret(): string {
  const refreshSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET;
  if (!refreshSecret) {
    const base = getJwtSecret();
    return `${base}_refresh_secure_key`;
  }
  return refreshSecret;
}

export interface TokenPayload {
  id: string;
  userId?: string;
  email: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  sessionId?: string;
}

// In-memory revocation cache for high-throughput single-process lookups
const inMemoryRevokedTokens = new Set<string>();

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const authTokens = {
  generateAccessToken: (payload: TokenPayload): string => {
    return jwt.sign({ ...payload, userId: payload.id }, getJwtSecret(), { expiresIn: "15m" });
  },

  generateRefreshToken: (payload: TokenPayload): string => {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return jwt.sign({ ...payload, sessionId }, getRefreshSecret(), { expiresIn: "7d" });
  },

  verifyAccessToken: (token: string): TokenPayload | null => {
    const tokenHash = hashToken(token);
    if (inMemoryRevokedTokens.has(tokenHash)) return null;

    try {
      return jwt.verify(token, getJwtSecret()) as TokenPayload;
    } catch {
      return null;
    }
  },

  verifyRefreshToken: (refreshToken: string): TokenPayload | null => {
    const tokenHash = hashToken(refreshToken);
    if (inMemoryRevokedTokens.has(tokenHash)) return null;

    try {
      return jwt.verify(refreshToken, getRefreshSecret()) as TokenPayload;
    } catch {
      return null;
    }
  },

  /**
   * Revokes token both in-memory and persistently in MongoDB RevokedToken collection
   * for reliable distributed invalidation across serverless / multi-instance clusters.
   */
  revokeToken: (token: string) => {
    const tokenHash = hashToken(token);
    inMemoryRevokedTokens.add(tokenHash);

    // Asynchronously persist to database with TTL auto-cleanup
    try {
      let expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days fallback
      try {
        const decoded = jwt.decode(token) as any;
        if (decoded?.exp) {
          expiresAt = new Date(decoded.exp * 1000);
        }
      } catch {}

      import("@/models/RevokedToken")
        .then(({ RevokedToken }) => {
          RevokedToken.findOneAndUpdate(
            { tokenHash },
            { $setOnInsert: { tokenHash, revokedAt: new Date(), expiresAt } },
            { upsert: true }
          ).catch((e) => console.warn("RevokedToken DB notice:", e?.message || e));
        })
        .catch(() => {});
    } catch (e) {
      // Non-blocking background persistence
    }

    logger.info("Token revoked successfully", { meta: { tokenSnippet: token.substring(0, 10) } });
  },

  /**
   * Checks database revocation for distributed multi-instance architectures.
   */
  isTokenRevoked: async (token: string): Promise<boolean> => {
    const tokenHash = hashToken(token);
    if (inMemoryRevokedTokens.has(tokenHash)) return true;

    try {
      const { RevokedToken } = await import("@/models/RevokedToken");
      const found = await RevokedToken.findOne({ tokenHash });
      if (found) {
        inMemoryRevokedTokens.add(tokenHash);
        return true;
      }
    } catch {
      // Fall back to memory check if DB query fails
    }
    return false;
  },
};
