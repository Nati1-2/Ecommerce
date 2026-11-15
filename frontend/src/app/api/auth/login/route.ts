import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB, safeFindUserByEmail, safeSaveUserSession } from "@/lib/mongodb";
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
    const isHttps = req.nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";

    // 0. Quick Administrator Login from ENV
    const envAdminEmail = (process.env.ADMIN_EMAIL || "admin@gmail.com").toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD || "admin";
    const envAdminName = process.env.ADMIN_NAME || "Admin";

    if (normalizedEmail === envAdminEmail && password === envAdminPassword) {
      const userId = "usr-admin-master";
      const token = jwt.sign(
        { id: userId, userId, email: normalizedEmail, role: "ADMIN" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Non-blocking database sync
      (async () => {
        try {
          await connectDB();
          const { User } = await import("@/models/User");
          const existingUser = await User.findOne({ email: normalizedEmail });
          if (!existingUser) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
              email: normalizedEmail,
              password: hashedPassword,
              name: envAdminName,
              role: "ADMIN",
              membership: "SuperAdmin Tier 👑",
              isVerified: true,
            });
          } else if (existingUser.role !== "ADMIN") {
            existingUser.role = "ADMIN";
            await existingUser.save();
          }
        } catch {}
      })().catch(() => null);

      if (global.inMemoryUsers) {
        bcrypt.hash(password, 10).then(hashed => {
          global.inMemoryUsers?.set(normalizedEmail, {
            id: userId,
            _id: userId,
            email: normalizedEmail,
            password: hashed,
            name: envAdminName,
            role: "ADMIN",
            membership: "SuperAdmin Tier 👑",
            points: 9999,
            isVerified: true,
          });
        }).catch(() => null);
      }

      const userObj = {
        id: userId,
        email: normalizedEmail,
        name: envAdminName,
        role: "ADMIN" as const,
        membership: "SuperAdmin Tier 👑",
      };

      const sessionId = await recordSession(req, userId, normalizedEmail, body);

      const res = NextResponse.json({
        success: true,
        token,
        sessionId,
        user: userObj,
      });

      res.cookies.set("token", token, {
        httpOnly: false,
        secure: isHttps,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      res.cookies.set("session_id", sessionId, {
        httpOnly: false,
        secure: isHttps,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      return res;
    }

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
            secure: isHttps,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });

          res.cookies.set("session_id", sessionId, {
            httpOnly: false,
            secure: isHttps,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
          });

          return res;
        }
      } else if (response.status === 401 || response.status === 400) {
        // Log gateway fallback note and proceed to verify against local MongoDB database
        console.log(`Backend Gateway returned status ${response.status}, evaluating local database fallback...`);
      }
    } catch (err) {
      console.warn("Backend Auth Service unreachable, falling back to local DB/in-memory:", err);
    }

    // 2. Fallback to local MongoDB / in-memory demo database (supports database-created admins)
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

      // Check if account is suspended / blocked
      if (user.isVerified === false || user.status === "Blocked" || user.status === "BLOCKED") {
        return NextResponse.json(
          { error: "Account is suspended. Please contact administrative support." },
          { status: 403 }
        );
      }

      let isMatch = await bcrypt.compare(password, user.password).catch(() => false);
      // Transparently support and auto-upgrade legacy unhashed passwords
      if (!isMatch && user.password === password) {
        isMatch = true;
        try {
          const hashed = await bcrypt.hash(password, 10);
          const { User } = await import("@/models/User");
          await User.updateOne({ email: normalizedEmail }, { password: hashed });
        } catch {}
      }

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
      secure: isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    response.cookies.set("session_id", sessionId, {
      httpOnly: false,
      secure: isHttps,
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
