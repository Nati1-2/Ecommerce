import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/vendor", "/checkout", "/profile"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Add standard Vercel security headers
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Check protected route access
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected) {
    const token = req.cookies.get("token")?.value || req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      // In production, redirect unauthenticated users to home/login if accessing protected pages
      // return NextResponse.redirect(new URL("/?auth=required", req.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
