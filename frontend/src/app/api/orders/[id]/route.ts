import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order, PaymentStatus, OrderStatus } from "@/models/Order";
import Stripe from "stripe";

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY || process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "";
  if (!secretKey) return null;
  try {
    return new Stripe(secretKey, {
      apiVersion: "2025-01-27.acacia" as any,
    });
  } catch (e) {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    await connectDB();

    // Find the order
    let order = await Order.findOne({ $or: [{ orderId: id }, { _id: id }] });
    if (!order) {
      // Look up in seeded memory fallback just in case
      const { connectDB: _ } = await import("@/lib/mongodb");
      const inMemoryOrder = global.inMemoryOrders?.find((o: any) => o.orderId === id || o.id === id || o._id === id);
      if (inMemoryOrder) {
        return NextResponse.json({ success: true, data: inMemoryOrder });
      }
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Verify session with Stripe if payment is pending and sessionId is provided
    if (order.paymentStatus === PaymentStatus.PENDING && sessionId) {
      const stripe = getStripeClient();
      if (stripe) {
        try {
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          if (session.payment_status === "paid") {
            order.paymentStatus = PaymentStatus.PAID;
            order.orderStatus = OrderStatus.PAID;
            if (session.payment_intent) {
              order.paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id;
            }
            await order.save();
          }
        } catch (err) {
          console.error("Failed to verify Stripe session:", err);
        }
      }
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch order" }, { status: 500 });
  }
}
