import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { VendorProduct } from "@/models/VendorProduct";
import { requireVendor } from "@/lib/authHelper";

const ALLOWED_STATUSES = new Set(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]);

// PATCH /api/vendor/orders/[id] — update order status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { status } = await req.json();

    if (!status || typeof status !== "string") {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    const normalizedStatus = status.toUpperCase().trim();
    if (!ALLOWED_STATUSES.has(normalizedStatus)) {
      return NextResponse.json({
        error: `Invalid status. Allowed values: ${Array.from(ALLOWED_STATUSES).join(", ")}`,
      }, { status: 400 });
    }

    await connectDB();

    let order = await Order.findOne({
      $or: [{ _id: id }, { orderId: id }],
    });

    if (!order) {
      order = await Order.findById(id);
    }

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Authorization: Verify vendor owns items in this order, or is an admin
    if (payload.role !== "ADMIN") {
      const vendorProducts = await VendorProduct.find({ vendorId: payload.id }).select("_id sku");
      const vendorProductIds = new Set<string>(vendorProducts.map((p) => p._id.toString()));
      const vendorSkus = new Set<string>(vendorProducts.map((p) => p.sku));

      const hasVendorItem = (order.items || []).some((item: any) => {
        if (item.vendorId && item.vendorId === payload.id) return true;
        if (item.productId && (vendorProductIds.has(item.productId.toString()) || vendorSkus.has(item.productId))) return true;
        return false;
      });

      if (!hasVendorItem) {
        return NextResponse.json(
          { error: "Forbidden: You do not have permission to manage this order" },
          { status: 403 }
        );
      }
    }

    order.orderStatus = normalizedStatus;
    await order.save();

    const { notifyOrderStatusChanged } = await import("@/lib/notifications");
    await notifyOrderStatusChanged(order.orderId || order._id.toString(), normalizedStatus, order.userId, payload.id).catch(
      (err) => console.warn("Notify status update error:", err)
    );

    return NextResponse.json({
      success: true,
      order: {
        id: order._id.toString(),
        orderNumber: order.orderId,
        status: order.orderStatus,
        updatedAt: order.updatedAt ? order.updatedAt.toISOString() : new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
