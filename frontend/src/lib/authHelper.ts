import { NextRequest } from "next/server";
import { authTokens, getJwtSecret } from "./authTokens.ts";

export { getJwtSecret };

export interface TokenPayload {
  id: string;
  email: string;
  role: "CUSTOMER" | "VENDOR" | "ADMIN";
}

export async function getUserFromToken(req: NextRequest): Promise<TokenPayload | null> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : req.cookies.get("token")?.value?.trim();
  if (!token || token === "undefined" || token === "null") return null;
  const verified = await authTokens.verifyAccessToken(token);
  return verified ? { id: verified.id, email: verified.email, role: verified.role } : null;
}

export const getTokenPayload = getUserFromToken;

type AuthResult = { payload: TokenPayload } | { error: string; status: number };

export async function requireAuth(req: NextRequest): Promise<AuthResult> {
  const payload = await getTokenPayload(req);
  return payload ? { payload } : { error: "Authentication required", status: 401 };
}

export async function requireVendor(req: NextRequest): Promise<AuthResult> {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth;
  return auth.payload.role === "VENDOR" || auth.payload.role === "ADMIN"
    ? auth : { error: "Forbidden: Vendor access required", status: 403 };
}

export async function requireAdmin(req: NextRequest): Promise<AuthResult> {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth;
  return auth.payload.role === "ADMIN"
    ? auth : { error: "Forbidden: Administrator access required", status: 403 };
}
