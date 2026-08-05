import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { VendorProduct } from "@/models/VendorProduct";
import { requireVendor } from "@/lib/authHelper";

// GET /api/vendor/customers — unique buyers of this vendor's products
export async function GET(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    await connectDB();

    // Get vendor's product IDs
    const products = await VendorProduct.find({ vendorId: payload.id }).select("_id");
    const productIds = products.map(p => p._id.toString());

    // Find orders with vendor's products
    const orders = await Order.find({ "items.productId": { $in: productIds } })
      .sort({ createdAt: -1 });

    // Aggregate per customer
    const customerMap: Record<string, {
      id: string;
      totalOrders: number;
      totalSpent: number;
      lastPurchaseDate: string;
      memberSince: string;
    }> = {};

    for (const order of orders) {
      const uid = order.userId;
      const relevantItems = order.items.filter(item => productIds.includes(item.productId));
      const spent = relevantItems.reduce((s, i) => s + i.price * i.quantity, 0);

      if (!customerMap[uid]) {
        customerMap[uid] = {
          id: uid,
          totalOrders: 0,
          totalSpent: 0,
          lastPurchaseDate: order.createdAt.toISOString().split("T")[0],
          memberSince: order.createdAt.toISOString().split("T")[0],
        };
      }

      customerMap[uid].totalOrders += 1;
      customerMap[uid].totalSpent += spent;

      // Track latest purchase
      if (order.createdAt.toISOString() > customerMap[uid].lastPurchaseDate) {
        customerMap[uid].lastPurchaseDate = order.createdAt.toISOString().split("T")[0];
      }
    }

    // Fetch user details for each unique customer
    const customerIds = Object.keys(customerMap);
    const users = await User.find({ _id: { $in: customerIds } }).select("name email avatar phone createdAt");

    const customers = users.map(u => {
      const uid = u._id.toString();
      const agg = customerMap[uid] || { totalOrders: 0, totalSpent: 0, lastPurchaseDate: "", memberSince: "" };
      return {
        id: uid,
        name: u.name || u.email.split("@")[0],
        email: u.email,
        avatar: u.avatar || "",
        phone: u.phone || "",
        location: "—",
        totalOrders: agg.totalOrders,
        totalSpent: agg.totalSpent,
        lastPurchaseDate: agg.lastPurchaseDate,
        memberSince: u.createdAt ? u.createdAt.toISOString().split("T")[0] : agg.memberSince,
        status: agg.totalOrders >= 5 ? "VIP" : "Active",
      };
    });

    return NextResponse.json({ success: true, customers });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
