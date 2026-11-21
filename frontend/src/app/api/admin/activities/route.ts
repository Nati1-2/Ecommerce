import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { VendorProfile } from "@/models/VendorProfile";
import { VendorProduct } from "@/models/VendorProduct";
import { Order } from "@/models/Order";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    await connectDB();
    const [vendors, products, orders] = await Promise.all([
      VendorProfile.find().sort({ createdAt: -1 }).limit(10),
      VendorProduct.find().sort({ createdAt: -1 }).limit(10),
      Order.find().sort({ createdAt: -1 }).limit(10),
    ]);
    const events = [
      ...vendors.map((v) => ({
        id: `vendor_${v._id}`, user: v.email || "", userAvatar: v.logo || "",
        action: `Vendor store created: ${v.storeName}`, category: "vendor", date: v.createdAt,
      })),
      ...products.map((p) => ({
        id: `product_${p._id}`, user: p.vendorId, userAvatar: "",
        action: `Product listed: ${p.name}`, category: "product", date: p.createdAt,
      })),
      ...orders.map((o) => ({
        id: `order_${o._id}`, user: o.userId, userAvatar: "",
        action: `Order placed: ${o.orderId || o._id}`, category: "order", date: o.createdAt,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
    return NextResponse.json({
      success: true,
      activities: events.map(({ date, ...event }) => ({ ...event, timestamp: new Date(date).toISOString() })),
    });
  } catch {
    return NextResponse.json({ error: "Unable to load activity" }, { status: 503 });
  }
}
