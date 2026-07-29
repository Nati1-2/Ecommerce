import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { safeFindUserByEmail, safeCreateUser } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "fallback-secret-for-dev";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Full name is required (minimum 2 characters)" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const existingUser = await safeFindUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Always register as CUSTOMER — role cannot be set from client
    const newUser = await safeCreateUser({
      email: email.toLowerCase().trim(),
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
