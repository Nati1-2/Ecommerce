import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("CRITICAL: JWT_SECRET environment variable is not configured.");
    }
    return "dev_jwt_secret_must_be_configured_in_env_before_production_deployment";
  }
  return secret;
}

export interface TokenPayload {
  id: string;
  email: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN" | string;
}

export function getUserFromToken(req: NextRequest): TokenPayload | null {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    } else {
      const tokenCookie = req.cookies.get("token");
      token = tokenCookie?.value?.trim() || "";
    }

    if (!token || token === "undefined" || token === "null") {
      return null;
    }

    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as any;
    if (!decoded) return null;

    const id = decoded.id || decoded.userId;
    if (!id) return null;

    return {
      id: String(id),
      email: decoded.email ? String(decoded.email) : "",
      role: decoded.role || "CUSTOMER",
    };
  } catch (err) {
    return null;
  }
}

export const getTokenPayload = getUserFromToken;

export function requireAuth(req: NextRequest): { payload: TokenPayload } | { error: string; status: number } {
  const payload = getTokenPayload(req);
  if (!payload) {
    return { error: "Authentication required", status: 401 };
  }
  return { payload };
}

export function requireVendor(req: NextRequest): { payload: TokenPayload } | { error: string; status: number } {
  const payload = getTokenPayload(req);
  if (!payload) {
    return { error: "Authentication required", status: 401 };
  }
  if (payload.role !== "VENDOR" && payload.role !== "ADMIN") {
    return { error: "Forbidden: Vendor access required", status: 403 };
  }
  return { payload };
}

export function requireAdmin(req: NextRequest): { payload: TokenPayload } | { error: string; status: number } {
  const payload = getTokenPayload(req);
  if (!payload) {
    return { error: "Authentication required", status: 401 };
  }
  if (payload.role !== "ADMIN") {
    return { error: "Forbidden: Administrator access required", status: 403 };
  }
  return { payload };
}
