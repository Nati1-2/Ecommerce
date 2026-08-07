import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { VendorProduct } from "@/models/VendorProduct";
import { requireVendor } from "@/lib/authHelper";

// PATCH /api/vendor/orders/[id] — update order status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = requireVendor(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const { payload } = auth;

  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { status } = await req.json();
    if (!status) return NextResponse.json({ error: "status is required" }, { status: 400 });

    await connectDB();

    let order = await Order.findOne({
      $or: [{ _id: id }, { orderId: id }],
    });

    if (!order) {
      order = await Order.findById(id);
    }

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    order.orderStatus = status.toUpperCase();
    await order.save();

    const { notifyOrderStatusChanged } = await import("@/lib/notifications");
    await notifyOrderStatusChanged(order.orderId || order._id.toString(), status, order.userId, payload.id).catch(
      (err) => console.warn("Notify status update error:", err)
    );

    return NextResponse.json({
      success: true,
      order: {
        id: order._id.toString(),
        orderNumber: order.orderId,
        status: order.orderStatus,
        updatedAt: order.updatedAt.toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: `Database error: ${err.message}` }, { status: 500 });
  }
}
