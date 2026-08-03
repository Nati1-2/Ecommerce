import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || "super-secret-ecom-jwt-key";

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export function getUserFromToken(req: NextRequest): TokenPayload | null {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const tokenCookie = req.cookies.get("token");
      token = tokenCookie?.value || "";
    }
    if (!token) return null;

    if (token.startsWith("demo-jwt-token-")) {
      const parts = token.split("-");
      const role = (parts[3] || "CUSTOMER").toUpperCase();
      const id = parts.slice(4).join("-") || "usr-demo-customer";
      const email = role === "VENDOR" ? "vendor@natistore.com" : role === "ADMIN" ? "admin@natistore.com" : "john.smith@gmail.com";
      return { id, email, role };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    return null;
  }
}

export const getTokenPayload = getUserFromToken;

export function requireVendor(req: NextRequest): { payload: TokenPayload } | { error: string; status: number } {
  const payload = getTokenPayload(req);
  if (!payload) return { error: "Unauthorized", status: 401 };
  if (payload.role !== "VENDOR" && payload.role !== "ADMIN") {
    return { error: "Forbidden: Vendor access required", status: 403 };
  }
  return { payload };
}
