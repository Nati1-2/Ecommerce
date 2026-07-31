import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { safeFindUserById, safeUpdateUser, connectDB } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "fallback-secret-for-dev";

function getUserFromToken(req: NextRequest): { id: string; email: string; role: string } | null {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const tokenCookie = req.cookies.get("token");
      token = tokenCookie?.value || "";
    }
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (err) {
    return null;
  }
}

export async function PUT(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long" }, { status: 400 });
    }

    let userPasswordHash = "";
    try {
      await connectDB();
      const { User } = await import("@/models/User");
      const user = await User.findById(decoded.id);
      if (user) {
        userPasswordHash = user.password || "";
      }
    } catch (e) {
      console.warn("DB password lookup notice:", e);
    }

    if (currentPassword && userPasswordHash) {
      const isValid = await bcrypt.compare(currentPassword, userPasswordHash);
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    await safeUpdateUser(decoded.id, { password: newPasswordHash });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update password" }, { status: 500 });
  }
}
