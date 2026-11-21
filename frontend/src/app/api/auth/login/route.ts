import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { authTokens } from "@/lib/authTokens";
import { safeFindUserByEmail, safeSaveUserSession } from "@/lib/mongodb";
import { parseUserAgent, getRealClientIp, resolveGeoLocation } from "@/lib/deviceTracker";
import { getJwtSecret } from "@/lib/authHelper";

async function recordSession(req: NextRequest, userId: string, email: string, body: any) {
  try {
    const ua = req.headers.get("user-agent") || body?.userAgent || "";
    const ip = getRealClientIp(req, body?.clientIp);
    const location = await resolveGeoLocation(ip, body?.clientLocation);
    const parsed = parseUserAgent(ua, {
      model: body?.clientModel,
      platform: body?.platform,
      brandHint: body?.clientBrand,
      gpu: body?.clientGpu,
    });
    const sessionId = crypto.randomUUID();
    await safeSaveUserSession({
      sessionId,
      userId,
      email,
      ipAddress: ip,
      deviceType: body?.clientType || parsed.deviceType,
      deviceBrand: body?.clientBrand || parsed.deviceBrand,
      deviceModel: body?.clientModel || parsed.deviceModel,
      os: parsed.os,
      browser: parsed.browser,
      location,
      userAgent: ua,
    });
    return sessionId;
  } catch (e) {
    throw e;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const isHttps = req.nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
    getJwtSecret();

    // 1. Authenticate with backend Auth Service via API Gateway if available
    const gatewayUrl = process.env.API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "");
    if (gatewayUrl) {
      try {
        const response = await fetch(`${gatewayUrl}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail, password }),
        });

        if (response.ok) {
          const data = await response.json();
          const token = data.accessToken || data.token;
          if (data.success && token && data.user) {
            const userId = data.user.id || data.user._id || data.user.userId;
            const userObj = {
              id: userId,
              email: data.user.email,
              name: data.user.name || "",
              role: data.user.role,
            };

            const sessionId = await recordSession(req, userId, data.user.email, body);
            const sessionToken = authTokens.generateAccessToken({
              id: String(userId), email: data.user.email, role: data.user.role, sessionId,
            });

            // Omit raw JWT from JSON response body; deliver securely in HttpOnly cookie
            const res = NextResponse.json({
              success: true,
              user: userObj,
            });

            res.cookies.set("token", sessionToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production" || isHttps,
              sameSite: "lax",
              maxAge: 60 * 15,
              path: "/",
            });

            res.cookies.set("session_id", sessionId, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production" || isHttps,
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 30,
              path: "/",
            });

            return res;
          }
        }
      } catch (err) {
        // Gateway unreachable, continue to local DB verification
      }
    }

    // 2. Query user from MongoDB (No default administrator creation during login)
    const user = await safeFindUserByEmail(normalizedEmail);
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Check account status
    if (user.isVerified === false || user.status === "Blocked" || user.status === "BLOCKED") {
      return NextResponse.json(
        { error: "Account is suspended. Please contact administrative support." },
        { status: 403 }
      );
    }

    // Verify password strictly with bcrypt
    const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const userId = user.id || user._id;

    const userObj = {
      id: userId,
      email: user.email,
      name: user.name || "",
      role: user.role,
      membership: user.membership || (user.role === "ADMIN" ? "SuperAdmin Tier 👑" : user.role === "VENDOR" ? "Vendor Merchant 🚀" : "Standard Member ⭐"),
    };

    const sessionId = await recordSession(req, userId, user.email, body);
    const token = authTokens.generateAccessToken({
      id: String(userId), email: user.email, role: user.role, sessionId,
    });

    // Security: Do NOT expose raw JWT in JSON body; set in secure HttpOnly cookie
    const response = NextResponse.json({
      success: true,
      user: userObj,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || isHttps,
      sameSite: "lax",
      maxAge: 60 * 15,
      path: "/",
    });

    response.cookies.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication service error. Please try again." },
      { status: 500 }
    );
  }
}
