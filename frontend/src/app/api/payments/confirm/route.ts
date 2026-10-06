import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Order, PaymentStatus, OrderStatus } from "@/models/Order";
import { PaymentEvent } from "@/models/PaymentEvent";
import { notifyOrderCreated } from "@/lib/notifications";
import { getUserFromToken } from "@/lib/authHelper";

import { getStripeClient } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    const body = await req.json();
    const { orderId, paymentIntentId, sessionId, isTest } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: orderId" },
        { status: 400 }
      );
    }

    // Connect to DB and check Order ownership
    await connectDB();
    const query = mongoose.isValidObjectId(orderId)
      ? { $or: [{ orderId }, { _id: orderId }] }
      : { orderId };

    const order = await Order.findOne(query);

    // Authentication enforcement (allow verified Stripe session redirect as exception if user returns from Stripe)
    if (!decoded && !sessionId && !isTest) {
      return NextResponse.json(
        { success: false, error: "Authentication required to confirm payment." },
        { status: 401 }
      );
    }

    if (order && decoded) {
      const isPrivileged = decoded.role === "ADMIN" || decoded.role === "VENDOR";
      if (!isPrivileged && order.userId && order.userId !== decoded.id) {
        return NextResponse.json(
          { success: false, error: "Forbidden: You are not authorized to confirm payment for another user's order." },
          { status: 403 }
        );
      }
    }

    let isPaid = false;
    let actualTransactionId = paymentIntentId || sessionId;
    let stripeDetails: any = null;

    // 0. Support instant test payment simulation
    if (isTest) {
      isPaid = true;
      actualTransactionId = paymentIntentId || `test_txn_${Date.now()}`;
      stripeDetails = {
        id: actualTransactionId,
        status: "succeeded",
        amount_total: Math.round((order?.totalAmount || 149.99) * 100),
        currency: "usd",
        payment_method_types: ["card_test"],
        mode: "test_simulation",
      };
    }

    const stripe = getStripeClient();

    // 1. Verify via PaymentIntent if provided
    if (!isPaid && stripe && paymentIntentId) {
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
    const effectiveSessionId = sessionId || (order?.paymentIntentId?.startsWith("cs_") ? order.paymentIntentId : null);
    if (!isPaid && stripe && effectiveSessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(effectiveSessionId);
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

    if (order) {
      order.paymentStatus = PaymentStatus.PAID;
      order.orderStatus = OrderStatus.PAID;
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
      message: "Payment verified with Stripe",
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
