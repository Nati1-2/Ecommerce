import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/vendor", "/checkout", "/payment", "/profile", "/account", "/orders"];

function getJwtSecret(): string {
  return process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || "";
}

/**
 * Cryptographic JWT signature verification at the edge using Web Crypto API.
 * Validates HMAC-SHA256 signature and expiration without relying on external Node libraries.
 */
async function verifyJwtSignature(
  token: string,
  secret: string
): Promise<{ role?: string; id?: string; email?: string } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode payload
    const payloadJson = JSON.parse(
      atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    );

    // Validate expiration
    if (payloadJson.exp && payloadJson.exp * 1000 < Date.now()) {
      return null;
    }

    // Fail closed if secret is not configured
    if (!secret) {
      return null;
    }

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const data = enc.encode(`${headerB64}.${payloadB64}`);
    const sigStr = atob(signatureB64.replace(/-/g, "+").replace(/_/g, "/"));
    const sigBytes = new Uint8Array(sigStr.length);
    for (let i = 0; i < sigStr.length; i++) {
      sigBytes[i] = sigStr.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, data);
    return isValid ? payloadJson : null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Add enterprise security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );

  // Content-Security-Policy (CSP)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com https://*.stripe.com;
    font-src 'self';
    connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 https://api.stripe.com;
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, " ").trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  // Check protected route access
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected) {
    const rawToken = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
    const token = rawToken?.trim();

    if (!token || token === "null" || token === "undefined") {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Cryptographic JWT signature verification
    const secret = getJwtSecret();
    const payload = await verifyJwtSignature(token, secret);

    if (!payload) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("error", "invalid_or_expired_session");
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.delete("token");
      redirectResponse.cookies.delete("session_id");
      return redirectResponse;
    }

    const userRole = payload.role?.toUpperCase();

    // Restrict /admin strictly to ADMIN
    if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=unauthorized_admin", req.url));
    }

    // Restrict /vendor strictly to VENDOR or ADMIN
    if (pathname.startsWith("/vendor") && userRole !== "VENDOR" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=unauthorized_vendor", req.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
