import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";

function secret(name: string, fallback: string): string {
  const value = process.env[name];
  if (process.env.NODE_ENV === "production" && (!value || value.length < 32)) {
    throw new Error(`FATAL: ${name} must be at least 32 characters in production.`);
  }
  return value || fallback;
}

export function getJwtSecret(): string {
  return secret("JWT_ACCESS_SECRET", "dev_access_secret_only_for_local_testing_min_32_chars");
}

function getRefreshSecret(): string {
  const value = secret("JWT_REFRESH_SECRET", "dev_refresh_secret_only_for_local_testing_min_32_chars");
  if (value === getJwtSecret()) throw new Error("Access and refresh secrets must differ.");
  return value;
}

export interface TokenPayload {
  id: string;
  userId?: string;
  email: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
  sessionId?: string;
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function isTokenRevoked(token: string): Promise<boolean> {
  const { connectDB } = await import("./mongodb");
  const { RevokedToken } = await import("@/models/RevokedToken");
  await connectDB();
  if (await RevokedToken.exists({ tokenHash: hashToken(token) })) return true;
  const decoded = jwt.decode(token);
  if (decoded && typeof decoded !== "string" && typeof decoded.sessionId === "string") {
    const { UserSession } = await import("@/models/UserSession");
    const session = await UserSession.findOne({ sessionId: decoded.sessionId, userId: decoded.id }).select("revoked");
    return !session || session.revoked;
  }
  return false;
}

function validatedClaims(value: string | JwtPayload, type: "access" | "refresh"): TokenPayload | null {
  if (typeof value === "string" || value.tokenType !== type ||
      typeof value.exp !== "number" || value.exp <= Math.floor(Date.now() / 1000) ||
      typeof value.id !== "string" || !value.id ||
      typeof value.email !== "string" || !value.email ||
      !["CUSTOMER", "VENDOR", "ADMIN"].includes(value.role)) return null;
  return {
    id: value.id,
    userId: typeof value.userId === "string" ? value.userId : value.id,
    email: value.email,
    role: value.role as TokenPayload["role"],
    sessionId: typeof value.sessionId === "string" ? value.sessionId : undefined,
  };
}

async function verify(
  token: string,
  type: "access" | "refresh",
  isRevoked: (token: string) => Promise<boolean>
): Promise<TokenPayload | null> {
  let payload: TokenPayload | null;
  try {
    payload = validatedClaims(jwt.verify(token, type === "access" ? getJwtSecret() : getRefreshSecret(), {
      algorithms: ["HS256"],
    }), type);
  } catch {
    return null;
  }
  if (!payload) return null;
  // A database failure propagates so no caller can accept an unchecked token.
  if (await isRevoked(token)) return null;
  return payload;
}

export const authTokens = {
  generateAccessToken: (payload: TokenPayload): string => jwt.sign(
    { ...payload, userId: payload.id, tokenType: "access" }, getJwtSecret(),
    { algorithm: "HS256", expiresIn: "15m" }
  ),
  generateRefreshToken: (payload: TokenPayload): string => jwt.sign(
    { ...payload, sessionId: crypto.randomUUID(), tokenType: "refresh" }, getRefreshSecret(),
    { algorithm: "HS256", expiresIn: "7d" }
  ),
  verifyAccessToken: (token: string, isRevoked = isTokenRevoked): Promise<TokenPayload | null> =>
    verify(token, "access", isRevoked),
  verifyRefreshToken: (token: string, isRevoked = isTokenRevoked): Promise<TokenPayload | null> =>
    verify(token, "refresh", isRevoked),
  revokeToken: async (token: string): Promise<void> => {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string" || typeof decoded.exp !== "number") {
      throw new Error("Cannot revoke a token without expiration.");
    }
    const { connectDB } = await import("./mongodb");
    const { RevokedToken } = await import("@/models/RevokedToken");
    await connectDB();
    await RevokedToken.findOneAndUpdate(
      { tokenHash: hashToken(token) },
      { $setOnInsert: { tokenHash: hashToken(token), revokedAt: new Date(), expiresAt: new Date(decoded.exp * 1000) } },
      { upsert: true }
    );
  },
  isTokenRevoked,
};
