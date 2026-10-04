import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || "your_jwt_access_secret_key_change_in_production";

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

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded) return null;

    const id = decoded.id || decoded.userId;
    if (!id) return null;

    return {
      id,
      email: decoded.email || "",
      role: decoded.role || "CUSTOMER",
    };
  } catch (err) {
    return null;
  }
}

export const getTokenPayload = getUserFromToken;

export function requireAuth(req: NextRequest): { payload: TokenPayload } | { error: string; status: number } {
  const payload = getTokenPayload(req);
  if (!payload) return { error: "Authentication required", status: 401 };
  return { payload };
}

export function requireVendor(req: NextRequest): { payload: TokenPayload } | { error: string; status: number } {
  const payload = getTokenPayload(req);
  if (!payload) return { error: "Authentication required", status: 401 };
  if (payload.role !== "VENDOR" && payload.role !== "ADMIN") {
    return { error: "Forbidden: Vendor access required", status: 403 };
  }
  return { payload };
}

export function requireAdmin(req: NextRequest): { payload: TokenPayload } | { error: string; status: number } {
  const payload = getTokenPayload(req);
  if (!payload) return { error: "Authentication required", status: 401 };
  if (payload.role !== "ADMIN") {
    return { error: "Forbidden: Admin access required", status: 403 };
  }
  return { payload };
}
