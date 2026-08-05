import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VendorProduct } from "@/models/VendorProduct";
import { Order } from "@/models/Order";
import { requireVendor } from "@/lib/authHelper";

// GET /api/vendor/metrics — live computed metrics from DB
export async function GET(req: NextRequest) {
  const auth = requireVendor(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { payload } = auth;

  try {
    await connectDB();

    // Products
    const products = await VendorProduct.find({ vendorId: payload.id });
    const totalRevenue = products.reduce((s, p) => s + (p.revenueGenerated || 0), 0);
    const productsSold = products.reduce((s, p) => s + (p.salesCount || 0), 0);
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    // Orders
    const orders = await Order.find({ "items.productId": { $in: products.map(p => p._id.toString()) } });
    const totalOrders = orders.length;
    const pendingOrdersCount = orders.filter(o => o.orderStatus === "PENDING").length;
    const processingOrdersCount = orders.filter(o => o.orderStatus === "PROCESSING").length;
    const shippedOrdersCount = orders.filter(o => o.orderStatus === "SHIPPED").length;
    const deliveredOrdersCount = orders.filter(o => o.orderStatus === "DELIVERED").length;
    const cancelledOrdersCount = orders.filter(o => o.orderStatus === "CANCELLED").length;

    // Unique customers
    const uniqueCustomers = new Set(orders.map(o => o.userId)).size;

    const metrics = {
      totalRevenue,
      revenueChangePercent: 0,
      totalOrders,
      ordersChangePercent: 0,
      productsSold,
      productsSoldChangePercent: 0,
      totalCustomers: uniqueCustomers,
      customersChangePercent: 0,
      pendingOrdersCount,
      processingOrdersCount,
      shippedOrdersCount,
      deliveredOrdersCount,
      cancelledOrdersCount,
      lowStockCount,
      outOfStockCount,
    };

    return NextResponse.json({ success: true, metrics });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
