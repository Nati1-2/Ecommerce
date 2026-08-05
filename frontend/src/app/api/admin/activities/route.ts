import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { VendorProfile } from "@/models/VendorProfile";
import { VendorProduct } from "@/models/VendorProduct";
import { Order } from "@/models/Order";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    await connectDB();

    // Fetch last 5 vendors
    const latestVendors = await VendorProfile.find().sort({ createdAt: -1 }).limit(5);

    // Fetch last 5 products
    const latestProducts = await VendorProduct.find().sort({ createdAt: -1 }).limit(5);

    // Fetch last 5 orders
    const latestOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    const activities: any[] = [];

    // Helper for relative time string
    const getRelativeTimeStr = (date: Date) => {
      const timeDiff = Date.now() - new Date(date).getTime();
      const mins = Math.floor(timeDiff / (1000 * 60));
      const hours = Math.floor(mins / 60);
      const days = Math.floor(hours / 24);
      if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
      if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      if (mins > 0) return `${mins} min${mins > 1 ? "s" : ""} ago`;
      return "Just now";
    };

    latestVendors.forEach((v) => {
      activities.push({
        id: `act_vendor_${v._id}`,
        user: v.email?.split("@")[0] || "Vendor Onboarding",
        userAvatar: v.logo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        action: `Onboarded vendor store: ${v.storeName}`,
        timestamp: getRelativeTimeStr(v.createdAt),
        category: "vendor",
        rawDate: v.createdAt,
      });
    });

    latestProducts.forEach((p) => {
      activities.push({
        id: `act_product_${p._id}`,
        user: "Vendor Merchant",
        userAvatar: p.images?.[0] || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
        action: `Submitted product listing '${p.name}' for approval`,
        timestamp: getRelativeTimeStr(p.createdAt),
        category: "product",
        rawDate: p.createdAt,
      });
    });

    await Promise.all(
      latestOrders.map(async (o) => {
        const u = await User.findById(o.userId).select("name email");
        activities.push({
          id: `act_order_${o._id}`,
          user: u?.name || u?.email?.split("@")[0] || "Buyer",
          userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
          action: `Placed order #${o.orderId} totaling $${(o.grandTotal || o.totalAmount).toFixed(2)}`,
          timestamp: getRelativeTimeStr(o.createdAt),
          category: "payment",
          rawDate: o.createdAt,
        });
      })
    );

    // Sort combined by date desc
    activities.sort((a, b) => new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime());

    return NextResponse.json({
      success: true,
      activities: activities.slice(0, 10),
    });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
