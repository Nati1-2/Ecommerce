import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
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
    const paymentIntentId = searchParams.get("payment_intent") || searchParams.get("paymentIntentId");

    let order = null;
    try {
      await connectDB();
      const query = mongoose.isValidObjectId(id)
        ? { $or: [{ orderId: id }, { _id: id }] }
        : { orderId: id };
      order = await Order.findOne(query);
    } catch (dbErr: any) {
      return NextResponse.json({ error: `Database error: ${dbErr.message}` }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Verify session or payment intent with Stripe if payment is pending or needs confirmation
    if (order.paymentStatus !== PaymentStatus.PAID && (sessionId || paymentIntentId)) {
      const stripe = getStripeClient();
      if (stripe) {
        try {
          if (sessionId) {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
            if (session.payment_status === "paid") {
              order.paymentStatus = PaymentStatus.PAID;
              order.orderStatus = OrderStatus.PAID;
              if (session.payment_intent) {
                order.paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id;
              }
              await order.save();
            }
          } else if (paymentIntentId) {
            const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
            if (intent.status === "succeeded") {
              order.paymentStatus = PaymentStatus.PAID;
              order.orderStatus = OrderStatus.PAID;
              order.paymentIntentId = intent.id;
              await order.save();
            }
          }
        } catch (err) {
          console.error("Failed to verify Stripe payment state:", err);
        }
      }
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch order" }, { status: 500 });
  }
}
