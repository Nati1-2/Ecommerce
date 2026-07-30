import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { safeFindUserByEmail, safeCreateUser } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "fallback-secret-for-dev";

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
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password, name: name.trim(), role }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.token) {
          const res = NextResponse.json({
            success: true,
            token: data.token,
            user: {
              id: data.user.id || data.user._id,
              email: data.user.email,
              name: data.user.name || "",
              role: data.user.role,
            },
          });

          res.cookies.set("token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
          });

          return res;
        }
      }
    } catch (err) {
      console.warn("Backend Auth Service registration failed, falling back to local DB:", err);
    }

    // 2. Fallback to local MongoDB
    const existingUser = await safeFindUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Always register as CUSTOMER — role cannot be set from client
    const newUser = await safeCreateUser({
      email: normalizedEmail,
      password: hashedPassword,
      name: name.trim(),
      role: "CUSTOMER",
      isVerified: true,
    });

    const userId = newUser.id || newUser._id;
    const token = jwt.sign(
      { id: userId, email: newUser.email, role: newUser.role },
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
      httpOnly: true,
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
