import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

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

    await connectDB();

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name || "",
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
        phone: user.phone || "",
        address: user.address || "",
        membership: user.membership || "Standard Member ⭐",
        points: user.points ?? 100,
        isVerified: user.isVerified,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch profile" }, { status: 500 });
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

    await connectDB();

    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (avatar !== undefined) updateFields.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name || "",
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
        membership: updatedUser.membership || "Standard Member ⭐",
        points: updatedUser.points ?? 100,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
