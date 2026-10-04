import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { safeFindUserByEmail, safeCreateUser } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET || "your_jwt_access_secret_key_change_in_production";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role = "CUSTOMER" } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Full name is required (minimum 2 characters)" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try to register with backend Auth Service via API Gateway
    const gatewayUrl = process.env.API_GATEWAY_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:8000";
    try {
      const response = await fetch(`${gatewayUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password, name: name.trim(), role }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.accessToken || data.token;
        if (data.success && token) {
          const userObj = {
            id: data.user?.id || data.user?._id || data.user?.userId || data.userId,
            email: data.user?.email || normalizedEmail,
            name: data.user?.name || name.trim(),
            role: data.user?.role || role || "CUSTOMER",
          };

          const res = NextResponse.json({
            success: true,
            token,
            user: userObj,
          });

          res.cookies.set("token", token, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });

          return res;
        }
      } else if (response.status === 400 || response.status === 409) {
        const errData = await response.json().catch(() => null);
        return NextResponse.json(
          { error: errData?.message || errData?.error || "Registration failed" },
          { status: response.status }
        );
      }
    } catch (err) {
      console.warn("Backend Auth Service unreachable, falling back to local DB:", err);
    }

    // 2. Fallback to local MongoDB / in-memory
    const existingUser = await safeFindUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await safeCreateUser({
      email: normalizedEmail,
      password: hashedPassword,
      name: name.trim(),
      role: role || "CUSTOMER",
      isVerified: true,
    });

    const userId = newUser.id || newUser._id;
    const token = jwt.sign(
      { id: userId, userId, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: userId,
        email: newUser.email,
        name: newUser.name || "",
        role: newUser.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
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
