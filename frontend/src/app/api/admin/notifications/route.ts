import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { Notification } from "@/models/Notification";
import { VendorProfile } from "@/models/VendorProfile";
import { VendorProduct } from "@/models/VendorProduct";
import { Order } from "@/models/Order";

function getRelativeTimeStr(date: Date | string): string {
  const timeDiff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(timeDiff / (1000 * 60));
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (mins > 0) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  return "Just now";
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const notifications: Array<{
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    type: string;
    severity?: "info" | "success" | "warning" | "error";
  }> = [];

  try {
    await connectDB();

    // 1. Fetch saved notifications for ADMIN from DB
    const dbNotifs = await Notification.find({
      recipientId: { $in: ["ADMIN", "ALL"] },
    })
      .sort({ createdAt: -1 })
      .limit(10);

    for (const n of dbNotifs) {
      notifications.push({
        id: n._id.toString(),
        title: n.title,
        message: n.message,
        timestamp: getRelativeTimeStr(n.createdAt),
        read: n.read,
        type: n.type || "system",
        severity: (n.type === "error" || n.type === "alert") ? "error" : "info",
      });
    }

    // 2. Derive live actionable alerts from real entities if not already filled
    const pendingVendors = await VendorProfile.find({ verified: false })
      .sort({ createdAt: -1 })
      .limit(3);
    for (const v of pendingVendors) {
      notifications.push({
        id: `notif_vendor_${v._id}`,
        title: "Vendor Verification Required",
        message: `Store '${v.storeName}' has submitted an application for review.`,
        timestamp: getRelativeTimeStr(v.createdAt || new Date()),
        read: false,
        type: "vendor",
        severity: "warning",
      });
    }

    const pendingProducts = await VendorProduct.find({ status: "Pending" })
      .sort({ createdAt: -1 })
      .limit(3);
    for (const p of pendingProducts) {
      notifications.push({
        id: `notif_prod_${p._id}`,
        title: "Product Moderation Alert",
        message: `Product '${p.name}' is waiting for catalog clearance.`,
        timestamp: getRelativeTimeStr(p.createdAt || new Date()),
        read: false,
        type: "catalog",
        severity: "info",
      });
    }

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(3);
    for (const o of recentOrders) {
      notifications.push({
        id: `notif_ord_${o._id}`,
        title: "Order Processed",
        message: `Order #${o.orderId || o._id.toString().substring(0, 8)} totaling $${(o.grandTotal || o.totalAmount || 0).toFixed(2)} was received.`,
        timestamp: getRelativeTimeStr(o.createdAt || new Date()),
        read: true,
        type: "order",
        severity: "success",
      });
    }
  } catch (err: any) {
    console.warn("Admin notifications DB notice:", err?.message || err);
  }

  return NextResponse.json({ success: true, notifications });
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { title, message, type = "announcement" } = await req.json();
    await connectDB();

    const created = await Notification.create({
      recipientId: "ADMIN",
      title: title || "Platform Announcement",
      message: message || "",
      type,
      read: false,
    });

    return NextResponse.json({
      success: true,
      notification: {
        id: created._id.toString(),
        title: created.title,
        message: created.message,
        timestamp: "Just now",
        read: false,
        type: created.type,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
