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

    // Find orders that contain at least one vendor product
    const query: any = { "items.productId": { $in: productIds } };
    if (status && status !== "All") query.orderStatus = status.toUpperCase();

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Map to vendor-friendly format
    const mapped = orders.map(o => ({
      id: o._id.toString(),
      orderNumber: o.orderId,
      customerId: o.userId,
      customerName: "Customer",
      customerEmail: "",
      items: o.items
        .filter(item => productIds.includes(item.productId))
        .map(item => ({
          id: item.productId,
          productId: item.productId,
          productName: item.name,
          productImage: item.image,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
      totalAmount: o.grandTotal || o.totalAmount,
      paymentStatus: o.paymentStatus,
      status: o.orderStatus,
      shippingAddress: o.shippingAddress
        ? `${o.shippingAddress.street}, ${o.shippingAddress.city}, ${o.shippingAddress.state} ${o.shippingAddress.zipCode}`
        : "",
      trackingNumber: o.trackingNumber,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    }));

    return NextResponse.json({ success: true, orders: mapped, total, page });
  } catch (err: any) {
    console.warn("MongoDB orders fallback:", err.message);
    const rawOrders = global.inMemoryOrders || [];
    const mapped = rawOrders.map(o => ({
      id: o.id || o._id,
      orderNumber: o.orderId,
      customerId: o.userId,
      customerName: o.customerName || "Customer",
      customerEmail: o.customerEmail || "",
      items: (o.items || []).map((item: any) => ({
        id: item.productId || item.id,
        productId: item.productId || item.id,
        productName: item.productName || item.name || "Product",
        productImage: item.productImage || item.image || "/iphone17.png",
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || item.price || 0,
      })),
      totalAmount: o.totalAmount || o.grandTotal || 0,
      paymentStatus: o.paymentStatus || "Paid",
      status: o.orderStatus || o.status || "Pending",
      shippingAddress: o.shippingAddress
        ? typeof o.shippingAddress === "string"
          ? o.shippingAddress
          : `${o.shippingAddress.street}, ${o.shippingAddress.city}, ${o.shippingAddress.state} ${o.shippingAddress.zipCode}`
        : "",
      trackingNumber: o.trackingNumber,
      createdAt: typeof o.createdAt === "string" ? o.createdAt : (o.createdAt?.toISOString() || new Date().toISOString()),
      updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : (o.updatedAt?.toISOString() || new Date().toISOString()),
    }));
    return NextResponse.json({ success: true, orders: mapped, total: mapped.length, page: 1 });
  }
}
