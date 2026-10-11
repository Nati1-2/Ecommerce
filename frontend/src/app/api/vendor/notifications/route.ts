import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireVendor } from "@/lib/authHelper";
import { Notification } from "@/models/Notification";
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

// GET /api/vendor/notifications — real notifications for authenticated vendor
export async function GET(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  const notifications: Array<{
    id: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
  }> = [];

  try {
    await connectDB();

    // 1. Fetch saved notifications for this vendor or ALL
    const dbNotifs = await Notification.find({
      recipientId: { $in: [payload.id, "VENDOR", "ALL"] },
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
      });
    }

    // 2. Derive live inventory stock alerts from vendor's real products
    const lowStockProducts = await VendorProduct.find({
      vendorId: payload.id,
      $expr: { $lte: ["$stock", "$lowStockThreshold"] },
    }).limit(3);

    for (const p of lowStockProducts) {
      notifications.push({
        id: `stock_alert_${p._id}`,
        title: p.stock === 0 ? "Out of Stock Alert" : "Low Inventory Warning",
        message: `'${p.name}' has ${p.stock} units remaining (Threshold: ${p.lowStockThreshold}).`,
        timestamp: getRelativeTimeStr(p.updatedAt || p.createdAt || new Date()),
        read: false,
      });
    }

    // 3. Derive real recent orders containing vendor's items
    const products = await VendorProduct.find({ vendorId: payload.id }).select("_id");
    const pIds = products.map((p) => p._id.toString());

    if (pIds.length > 0) {
      const recentOrders = await Order.find({
        $or: [
          { "items.productId": { $in: pIds } },
          { "items.vendorId": payload.id },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(3);

      for (const o of recentOrders) {
        notifications.push({
          id: `order_notif_${o._id}`,
          title: "New Customer Order",
          message: `Order #${o.orderId || o._id.toString().substring(0, 8)} placed for $${(o.grandTotal || o.totalAmount || 0).toFixed(2)}.`,
          timestamp: getRelativeTimeStr(o.createdAt || new Date()),
          read: true,
        });
      }
    }
  } catch (err: any) {
    console.warn("Vendor notifications DB notice:", err?.message || err);
  }

  return NextResponse.json({ success: true, notifications });
}
