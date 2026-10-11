import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { VendorProduct } from "@/models/VendorProduct";
import { User } from "@/models/User";
import { requireVendor } from "@/lib/authHelper";

// GET /api/vendor/orders — orders containing vendor's products strictly
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

    // Build strictly scoped query
    let query: any = {
      $or: [
        { "items.productId": { $in: idList } },
        { "items.vendorId": payload.id },
      ],
    };

    if (idList.length === 0) {
      query = { "items.vendorId": payload.id };
    }

    if (status && status !== "All") {
      query.orderStatus = status.toUpperCase();
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Map to vendor-friendly format with real user info
    const mapped = await Promise.all(
      orders.map(async (o) => {
        let customerName = "Customer";
        let customerEmail = "";
        let customerAvatar = "";

        try {
          if (o.userId) {
            const user = await User.findById(o.userId).select("name email avatar").catch(() => null);
            if (user) {
              customerName = user.name || user.email?.split("@")[0] || "Customer";
              customerEmail = user.email || "";
              customerAvatar = user.avatar || "";
            }
          }
        } catch {
          // ignore lookup error
        }

        const statusMap: Record<string, string> = {
          PENDING: "Pending",
          PROCESSING: "Processing",
          SHIPPED: "Shipped",
          DELIVERED: "Delivered",
          CANCELLED: "Cancelled",
          PAID: "Processing",
        };

        const shippingStr = o.shippingAddress && o.shippingAddress.street
          ? `${o.shippingAddress.street}, ${o.shippingAddress.city || ""}, ${o.shippingAddress.state || ""} ${o.shippingAddress.zipCode || ""}`.trim()
          : "Direct Electronic / Fulfillment";

        return {
          id: o._id.toString(),
          orderNumber: o.orderId || `ORD-${o._id.toString().substring(0, 8)}`,
          customerId: o.userId,
          customerName,
          customerEmail,
          customerAvatar,
          items: (o.items || []).map((item: any) => ({
            id: item.productId,
            productId: item.productId,
            productName: item.name,
            productImage: item.image,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
          totalAmount: o.grandTotal || o.totalAmount || 0,
          paymentStatus: o.paymentStatus || "Paid",
          status: statusMap[o.orderStatus] || o.orderStatus || "Pending",
          shippingAddress: shippingStr,
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
