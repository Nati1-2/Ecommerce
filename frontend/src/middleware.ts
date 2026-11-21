import { NextRequest, NextResponse } from "next/server.js";

const PROTECTED_PREFIXES = ["/admin", "/vendor", "/checkout", "/payment", "/profile", "/account", "/orders"];

function getJwtSecret(): string {
  const secret = process.env.JWT_ACCESS_SECRET || (process.env.NODE_ENV === "production" ? "" : "dev_access_secret_only_for_local_testing_min_32_chars");
  return process.env.NODE_ENV === "production" && secret.length < 32 ? "" : secret;
}

/**
 * Cryptographic JWT signature verification at the edge using Web Crypto API.
 * Validates HMAC-SHA256 signature and expiration without relying on external Node libraries.
 */
async function verifyJwtSignature(
  token: string,
  secret: string
): Promise<{ role: string; id: string; email: string } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;
    const header = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")));
    if (header.alg !== "HS256" || (header.typ && header.typ !== "JWT")) return null;

    // Decode payload
    const payloadJson = JSON.parse(
      atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    );

    // Validate expiration
    if (typeof payloadJson.exp !== "number" || payloadJson.exp * 1000 <= Date.now() ||
        payloadJson.tokenType !== "access" || typeof payloadJson.id !== "string" ||
        !payloadJson.id || typeof payloadJson.email !== "string" ||
        !["CUSTOMER", "VENDOR", "ADMIN"].includes(payloadJson.role)) {
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
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);

  // Content-Security-Policy (CSP)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' https://js.stripe.com;
    style-src 'self' 'nonce-${nonce}';
    style-src-attr 'unsafe-inline';
    img-src 'self' blob: data: https://images.unsplash.com https://*.stripe.com;
    font-src 'self';
    connect-src 'self' https://api.stripe.com https://m.stripe.network;
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, " ").trim();

  requestHeaders.set("Content-Security-Policy", cspHeader);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
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
    let accepted = false;
    if (payload) {
      try {
        const check = await fetch(new URL("/api/auth/token-status", req.url), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
          cache: "no-store",
        });
        accepted = check.ok && (await check.json()).valid === true;
      } catch {
        accepted = false;
      }
    }

    if (!accepted || !payload) {
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
