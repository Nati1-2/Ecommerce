import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { safeFindUserByEmail, safeCreateUser, safeSaveUserSession } from "@/lib/mongodb";
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
    console.warn("Session recording notice on register:", e);
    return "sess_" + Date.now();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role } = body;

    // Security: Explicitly reject any attempts to self-assign privileged roles
    if (role && String(role).toUpperCase() !== "CUSTOMER") {
      const requestedRole = String(role).toUpperCase();
      if (["ADMIN", "SUPER_ADMIN", "VENDOR", "MODERATOR", "SELLER"].includes(requestedRole)) {
        return NextResponse.json(
          {
            error: "Privilege escalation rejected: Public registration cannot create privileged accounts. Vendor registration requires an approved merchant application.",
          },
          { status: 403 }
        );
      }
    }

    // Public registration always assigns CUSTOMER
    const assignedRole = "CUSTOMER";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (!name || String(name).trim().length < 2) {
      return NextResponse.json({ error: "Full name is required (minimum 2 characters)" }, { status: 400 });
    }

    if (String(password).length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const isHttps = req.nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
    const jwtSecret = getJwtSecret();

    // 1. Check if user already exists
    const existingUser = await safeFindUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // 2. Hash password with bcrypt cost 12
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await safeCreateUser({
      email: normalizedEmail,
      password: hashedPassword,
      name: String(name).trim(),
      role: assignedRole,
      isVerified: true,
    });

    const userId = newUser.id || newUser._id;
    const token = jwt.sign(
      { id: userId, userId, email: newUser.email, role: assignedRole },
      jwtSecret,
      { expiresIn: "7d" }
    );

    const sessionId = await recordSession(req, userId, newUser.email, body);

    // Omit raw JWT from JSON response body; deliver securely in HttpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: userId,
          email: newUser.email,
          name: newUser.name || "",
          role: assignedRole,
        },
      },
      { status: 201 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
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
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Registration service error. Please try again." },
      { status: 500 }
    );
  }
}
