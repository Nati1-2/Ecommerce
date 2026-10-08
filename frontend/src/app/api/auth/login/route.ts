import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { safeFindUserByEmail, safeSaveUserSession } from "@/lib/mongodb";
import { parseUserAgent, getRealClientIp, resolveGeoLocation } from "@/lib/deviceTracker";

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || "your_jwt_access_secret_key_change_in_production";

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
    const sessionId = "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();
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
    console.warn("Session recording notice:", e);
    return "sess_" + Date.now();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try to authenticate with the backend Auth Service via API Gateway
    const gatewayUrl = process.env.API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000";
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

          const res = NextResponse.json({
            success: true,
            token,
            sessionId,
            user: userObj,
          });

          res.cookies.set("token", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });

          res.cookies.set("session_id", sessionId, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
          });

          return res;
        }
      } else if (response.status === 401 || response.status === 400) {
        if (normalizedEmail === "john.smith@gmail.com" || body.isDemo) {
          console.log("Demo account authentication: proceeding to local fallback verification...");
        } else {
          const errData = await response.json().catch(() => null);
          return NextResponse.json(
            { error: errData?.message || errData?.error || "Invalid email or password" },
            { status: 401 }
          );
        }
      }
    } catch (err) {
      console.warn("Backend Auth Service unreachable, falling back to local DB/in-memory:", err);
    }

    // 2. Fallback to local MongoDB / in-memory demo database
    let user = await safeFindUserByEmail(normalizedEmail);

    // Guaranteed demo customer account
    if (normalizedEmail === "john.smith@gmail.com" || body.isDemo) {
      if (!user) {
        user = {
          id: "usr-demo-customer",
          _id: "usr-demo-customer",
          email: "john.smith@gmail.com",
          name: "John Smith",
          role: "CUSTOMER",
          membership: "Standard Member ⭐",
          password: "",
        };
      }
      // Demo password check passes if password matches password123 or isDemo flag
      const isDemoMatch = password === "password123" || Boolean(body.isDemo);
      if (!isDemoMatch) {
        return NextResponse.json({ error: "Invalid password for demo account" }, { status: 401 });
      }
    } else {
      if (!user || !user.password) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }
    }

    const userId = user.id || user._id;
    const token = jwt.sign(
      { id: userId, userId, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userObj = {
      id: userId,
      email: user.email,
      name: user.name || "",
      role: user.role,
      membership: user.membership || (user.role === "ADMIN" ? "SuperAdmin Tier 👑" : user.role === "VENDOR" ? "Vendor Merchant 🚀" : "Standard Member ⭐"),
    };

    const sessionId = await recordSession(req, userId, user.email, body);

    const response = NextResponse.json({
      success: true,
      token,
      sessionId,
      user: userObj,
    });

    response.cookies.set("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    response.cookies.set("session_id", sessionId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
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
