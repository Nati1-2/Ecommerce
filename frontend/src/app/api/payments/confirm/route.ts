import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Order, PaymentStatus, OrderStatus } from "@/models/Order";
import { PaymentEvent } from "@/models/PaymentEvent";
import { notifyOrderCreated } from "@/lib/notifications";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, paymentIntentId, sessionId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: orderId" },
        { status: 400 }
      );
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: "Stripe configuration error: STRIPE_SECRET_KEY is missing" },
        { status: 500 }
      );
    }

    let isPaid = false;
    let actualTransactionId = paymentIntentId || sessionId;
    let stripeDetails: any = null;

    // 1. Verify via PaymentIntent if provided
    if (paymentIntentId) {
      try {
        const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
        stripeDetails = intent;
        if (intent.status === "succeeded") {
          isPaid = true;
          actualTransactionId = intent.id;
        }
      } catch (err: any) {
        console.error("Error retrieving PaymentIntent from Stripe:", err.message);
      }
    }

    // 2. Verify via Checkout Session if provided and not yet verified
    if (!isPaid && sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        stripeDetails = session;
        if (session.payment_status === "paid") {
          isPaid = true;
          actualTransactionId = typeof session.payment_intent === "string" 
            ? session.payment_intent 
            : (session.payment_intent?.id || session.id);
        }
      } catch (err: any) {
        console.error("Error retrieving Checkout Session from Stripe:", err.message);
      }
    }

    if (!isPaid) {
      return NextResponse.json({
        success: false,
        message: "Payment has not yet succeeded or could not be verified with Stripe",
        status: stripeDetails?.status || "unverified",
      }, { status: 400 });
    }

    // Connect to DB and update Order status
    await connectDB();
    const query = mongoose.isValidObjectId(orderId)
      ? { $or: [{ orderId }, { _id: orderId }] }
      : { orderId };

    const order = await Order.findOne(query);

    if (order) {
      order.paymentStatus = PaymentStatus.PAID;
      order.orderStatus = OrderStatus.PROCESSING;
      order.paymentIntentId = actualTransactionId;
      await order.save();

      // Record payment event idempotently
      if (actualTransactionId) {
        await PaymentEvent.findOneAndUpdate(
          { stripeEventId: actualTransactionId },
          {
            stripeEventId: actualTransactionId,
            eventType: "payment.confirmed",
            processed: true,
            payload: stripeDetails || { orderId, transactionId: actualTransactionId },
          },
          { upsert: true, new: true }
        ).catch(() => null);
      }

      // Notify customer, vendor, and admin
      await notifyOrderCreated(order).catch((err) =>
        console.warn("Notice: notification trigger warning:", err)
      );

      return NextResponse.json({
        success: true,
        message: "Payment successfully verified and order marked as PAID",
        orderId: order.orderId,
        paymentStatus: order.paymentStatus,
        transactionId: actualTransactionId,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified with Stripe (no order record updated)",
      transactionId: actualTransactionId,
    });
  } catch (error: any) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
