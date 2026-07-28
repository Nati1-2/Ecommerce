import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { safeFindUserById, safeUpdateUser } from "@/lib/mongodb";

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

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (err) {
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized: Invalid or missing token" }, { status: 401 });
    }

    const user = await safeFindUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id || user._id,
        name: user.name || "",
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
        phone: user.phone || "",
        address: user.address || "",
        membership: user.membership || "Standard Member ⭐",
        points: user.points ?? 100,
        isVerified: user.isVerified ?? true,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized: Invalid or missing token" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, address, avatar } = body;

    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (avatar !== undefined) updateFields.avatar = avatar;

    const updatedUser = await safeUpdateUser(decoded.id, updateFields);

    if (!updatedUser) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id || updatedUser._id,
        name: updatedUser.name || "",
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
        membership: updatedUser.membership || "Standard Member ⭐",
        points: updatedUser.points ?? 100,
        isVerified: updatedUser.isVerified ?? true,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
  }
}
