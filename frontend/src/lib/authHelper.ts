import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "fallback-secret-for-dev";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export function getTokenPayload(req: NextRequest): TokenPayload | null {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const tokenCookie = req.cookies.get("token");
      token = tokenCookie?.value || "";
    }

    if (!token || token.startsWith("demo-jwt-token-")) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

export function requireVendor(req: NextRequest): { payload: TokenPayload } | { error: string; status: number } {
  const payload = getTokenPayload(req);
  if (!payload) return { error: "Unauthorized", status: 401 };
  if (payload.role !== "VENDOR" && payload.role !== "ADMIN") {
    return { error: "Forbidden: Vendor access required", status: 403 };
  }
  return { payload };
}
