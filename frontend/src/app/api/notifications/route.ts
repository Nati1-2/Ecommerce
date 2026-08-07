import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";

import { getUserFromToken } from "@/lib/authHelper";

import { Notification } from "@/models/Notification";

export async function GET(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    const userId = decoded?.id || "usr-demo-customer";
    const role = (decoded?.role || "CUSTOMER").toUpperCase();

    await connectDB();

    const recipients = [userId, role];
    if (role === "ADMIN") recipients.push("ADMIN");

    let dbNotifs = await Notification.find({ recipientId: { $in: recipients } })
      .sort({ createdAt: -1 })
      .limit(50);

    if (dbNotifs.length === 0) {
      // Seed default welcome notification if user has none
      const welcome = await Notification.create({
        recipientId: userId,
        type: "SYSTEM",
        title: "Welcome to Nati Store! 🎉",
        message: "Your account is verified and ready for fast checkout and order tracking.",
        link: "/products",
        read: false,
      });
      dbNotifs = [welcome];
    }

    const mapped = dbNotifs.map((n) => ({
      id: n._id.toString(),
      title: n.title,
      message: n.message,
      type: n.type,
      link: n.link || "#",
      read: n.read,
      createdAt: n.createdAt ? n.createdAt.toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      notifications: mapped,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    const userId = decoded?.id || "usr-demo-customer";
    const role = (decoded?.role || "CUSTOMER").toUpperCase();

    await connectDB();

    const body = await req.json().catch(() => ({}));
    const { action, notifId } = body;

    const recipients = [userId, role];
    if (role === "ADMIN") recipients.push("ADMIN");

    if (action === "mark_all_read") {
      await Notification.updateMany({ recipientId: { $in: recipients } }, { $set: { read: true } });
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (notifId) {
      await Notification.findByIdAndUpdate(notifId, { $set: { read: true } });
    }

    return NextResponse.json({
      success: true,
      message: `Notification updated successfully`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update notification" }, { status: 500 });
  }
}
