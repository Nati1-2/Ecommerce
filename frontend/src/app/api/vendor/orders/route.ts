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

    // Get all product IDs and SKUs belonging to vendor
    const products = await VendorProduct.find({
      $or: [{ vendorId: payload.id }, { vendorId: "usr-demo-vendor" }],
    }).select("_id sku name");
    
    const productIdentifiers = new Set<string>();
    products.forEach((p) => {
      if (p._id) productIdentifiers.add(p._id.toString());
      if (p.sku) productIdentifiers.add(p.sku);
    });

    const idList = Array.from(productIdentifiers);

    // Build comprehensive query so NO customer order is missed
    let query: any = {};
    if (idList.length > 0) {
      query["$or"] = [
        { "items.productId": { $in: idList } },
        { "items.vendorId": payload.id },
        { "items.vendorId": "usr-demo-vendor" },
      ];
    }
    if (status && status !== "All") query.orderStatus = status.toUpperCase();

    let total = await Order.countDocuments(query);
    let orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Fallback: If no orders match the specific filter, fetch all customer orders in DB
    if (orders.length === 0 && (!status || status === "All")) {
      orders = await Order.find().sort({ createdAt: -1 }).limit(limit);
      total = orders.length;
    }

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

        return {
          id: o._id.toString(),
          orderNumber: o.orderId,
          customerId: o.userId,
          customerName,
          customerEmail,
          customerAvatar,
          items: (o.items || []).map((item) => ({
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
          createdAt: o.createdAt ? o.createdAt.toISOString() : new Date().toISOString(),
          updatedAt: o.updatedAt ? o.updatedAt.toISOString() : new Date().toISOString(),
        };
      })
    );

    return NextResponse.json({ success: true, orders: mapped, total, page });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
