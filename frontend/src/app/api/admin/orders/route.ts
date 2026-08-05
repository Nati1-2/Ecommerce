import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { VendorProduct } from "@/models/VendorProduct";
import { VendorProfile } from "@/models/VendorProfile";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    await connectDB();

    const dbOrders = await Order.find().sort({ createdAt: -1 }).limit(100);

    const orders = await Promise.all(
      dbOrders.map(async (o) => {
        // Find customer name
        const user = await User.findById(o.userId).select("name email");
        const customerName = user?.name || user?.email?.split("@")[0] || "Customer";

        // Find vendor of first product
        let vendorName = "Apex Tech Labs";
        if (o.items?.[0]?.productId) {
          const product = await VendorProduct.findById(o.items[0].productId).select("vendorId");
          if (product?.vendorId) {
            const store = await VendorProfile.findOne({ userId: product.vendorId }).select("storeName");
            if (store) vendorName = store.storeName;
          }
        }

        const statusMap: Record<string, string> = {
          PENDING: "Pending",
          PROCESSING: "Processing",
          SHIPPED: "Shipped",
          DELIVERED: "Delivered",
          CANCELLED: "Cancelled",
          PAID: "Processing",
        };

        const timeDiff = Date.now() - new Date(o.createdAt).getTime();
        const mins = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);
        let timeStr = "Just now";
        if (days > 0) timeStr = `${days} day${days > 1 ? "s" : ""} ago`;
        else if (hours > 0) timeStr = `${hours} hour${hours > 1 ? "s" : ""} ago`;
        else if (mins > 0) timeStr = `${mins} min${mins > 1 ? "s" : ""} ago`;

        return {
          id: o._id.toString(),
          orderNumber: o.orderId,
          customerName,
          vendorName,
          totalAmount: o.grandTotal || o.totalAmount,
          paymentMethod: "Stripe Card",
          status: statusMap[o.orderStatus] || "Pending",
          createdAt: timeStr,
        };
      })
    );

    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
