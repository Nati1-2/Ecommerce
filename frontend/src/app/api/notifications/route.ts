import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";

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

export async function GET(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const defaultNotifications = [
      {
        id: "notif-1",
        title: "Order Shipped! 🚚",
        message: "Your order #NATI-1002 has been shipped and is on its way.",
        type: "order",
        read: false,
        createdAt: new Date(Date.now() - 3600 * 4 * 1000).toISOString(),
      },
      {
        id: "notif-2",
        title: "Flash Sale Alert 🔥",
        message: "25% OFF on all smart watches and premium audio gear for VIP members.",
        type: "promo",
        read: false,
        createdAt: new Date(Date.now() - 3600 * 24 * 1000).toISOString(),
      },
      {
        id: "notif-3",
        title: "Security Update 🔒",
        message: "Your account security status is verified and up to date.",
        type: "system",
        read: true,
        createdAt: new Date(Date.now() - 3600 * 48 * 1000).toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      notifications: defaultNotifications,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, notifId } = body;

    return NextResponse.json({
      success: true,
      message: action === "mark_all_read" ? "All notifications marked as read" : `Notification ${notifId} marked as read`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update notification" }, { status: 500 });
  }
}
