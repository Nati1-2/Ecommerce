import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { VendorProduct } from "@/models/VendorProduct";
import { requireVendor } from "@/lib/authHelper";

// GET /api/vendor/orders — orders containing vendor's products
export async function GET(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    await connectDB();

    // Get all this vendor's product IDs
    const products = await VendorProduct.find({ vendorId: payload.id }).select("_id name images");
    const productIds = products.map(p => p._id.toString());

    // Find orders that contain at least one vendor product (or all orders if vendor owns all products)
    let query: any = {};
    if (productIds.length > 0) {
      query["items.productId"] = { $in: productIds };
    }
    if (status && status !== "All") query.orderStatus = status.toUpperCase();

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const { User } = await import("@/models/User");

    // Map to vendor-friendly format with real user info
    const mapped = await Promise.all(
      orders.map(async (o) => {
        const user = await User.findById(o.userId).select("name email avatar");
        const customerName = user?.name || user?.email?.split("@")[0] || "Customer";
        const customerEmail = user?.email || "";
        const customerAvatar = user?.avatar || "";

        const statusMap: Record<string, string> = {
          PENDING: "Pending",
          PROCESSING: "Processing",
          SHIPPED: "Shipped",
          DELIVERED: "Delivered",
          CANCELLED: "Cancelled",
          PAID: "Processing",
        };

        const matchingItems = productIds.length > 0
          ? o.items.filter((item) => productIds.includes(item.productId))
          : o.items;

        return {
          id: o._id.toString(),
          orderNumber: o.orderId,
          customerId: o.userId,
          customerName,
          customerEmail,
          customerAvatar,
          items: (matchingItems.length > 0 ? matchingItems : o.items).map((item) => ({
            id: item.productId,
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
          totalAmount: o.grandTotal || o.totalAmount,
          paymentStatus: o.paymentStatus || "Paid",
          status: statusMap[o.orderStatus] || o.orderStatus || "Pending",
          shippingAddress: o.shippingAddress
            ? `${o.shippingAddress.street}, ${o.shippingAddress.city}, ${o.shippingAddress.state} ${o.shippingAddress.zipCode}`
            : "",
          trackingNumber: o.trackingNumber,
          createdAt: o.createdAt.toISOString(),
          updatedAt: o.updatedAt.toISOString(),
        };
      })
    );

    return NextResponse.json({ success: true, orders: mapped, total, page });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
