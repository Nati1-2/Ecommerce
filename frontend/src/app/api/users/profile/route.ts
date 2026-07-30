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

    // Connect to MongoDB to fetch stats counts
    let ordersCount = 0;
    let reviewsCount = 0;
    try {
      await connectDB();
      const { Order } = await import("@/models/Order");
      const { Review } = await import("@/models/Review");
      ordersCount = await Order.countDocuments({ userId: decoded.id }).catch(() => 0);
      reviewsCount = await Review.countDocuments({ customerId: decoded.id }).catch(() => 0);
    } catch (err) {
      console.warn("Stats count failed:", err);
    }

    // 1. Try to fetch from backend User Service via API Gateway
    const authHeader = req.headers.get("authorization");
    const token = authHeader || req.cookies.get("token")?.value;

    try {
      const response = await fetch("http://localhost:8000/api/v1/users/profile", {
        headers: token ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {},
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const profile = data.data;
          return NextResponse.json({
            success: true,
            user: {
              id: profile.userId || profile.id || decoded.id,
              name: profile.name || `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "",
              email: profile.email || decoded.email,
              role: profile.role || decoded.role,
              avatar: profile.avatar || "",
              phone: profile.phone || "",
              address: profile.address || "",
              membership: profile.membership || "Standard Member ⭐",
              points: profile.points ?? 120,
              isVerified: profile.isVerified ?? true,
              ordersCount,
              reviewsCount,
            },
          });
        }
      }
    } catch (err) {
      console.warn("Backend User Service fetch failed, falling back to local DB:", err);
    }

    // 2. Fallback to local MongoDB / in-memory database
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
        ordersCount,
        reviewsCount,
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

    const authHeader = req.headers.get("authorization");
    const token = authHeader || req.cookies.get("token")?.value;

    // 1. Try to update via backend User Service
    try {
      const nameParts = (name || "").trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const response = await fetch("http://localhost:8000/api/v1/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ firstName, lastName, phone, address, avatar }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const profile = data.data;
          return NextResponse.json({
            success: true,
            user: {
              id: profile.userId || profile.id || decoded.id,
              name: profile.name || `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "",
              email: profile.email || decoded.email,
              role: profile.role || decoded.role,
              avatar: profile.avatar || "",
              phone: profile.phone || "",
              address: profile.address || "",
              membership: profile.membership || "Standard Member ⭐",
              points: profile.points ?? 120,
              isVerified: profile.isVerified ?? true,
            },
          });
        }
      }
    } catch (err) {
      console.warn("Backend User Service update failed, falling back to local DB:", err);
    }

    // 2. Fallback to local MongoDB / in-memory database
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
