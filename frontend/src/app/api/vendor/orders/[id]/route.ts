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

    // Verify this order contains at least one of this vendor's products
    const vendorProducts = await VendorProduct.find({ vendorId: payload.id }).select("_id");
    const productIds = vendorProducts.map(p => p._id.toString());

    const order = await Order.findOne({
      _id: id,
      "items.productId": { $in: productIds },
    });

    if (!order) return NextResponse.json({ error: "Order not found or not yours" }, { status: 404 });

    order.orderStatus = status.toUpperCase();
    await order.save();

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
    console.warn("MongoDB order status update failed, trying in-memory fallback:", err.message);

    const inMemoryOrder = global.inMemoryOrders?.find(
      (o: any) => o._id === id || o.id === id || o.orderId === id
    );

    if (inMemoryOrder) {
      inMemoryOrder.orderStatus = status.toUpperCase();
      inMemoryOrder.status = status.toUpperCase();
      inMemoryOrder.updatedAt = new Date();

      return NextResponse.json({
        success: true,
        order: {
          id: inMemoryOrder.id || inMemoryOrder._id,
          orderNumber: inMemoryOrder.orderId,
          status: inMemoryOrder.orderStatus,
          updatedAt: typeof inMemoryOrder.updatedAt === "string"
            ? inMemoryOrder.updatedAt
            : inMemoryOrder.updatedAt.toISOString(),
        },
      });
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
