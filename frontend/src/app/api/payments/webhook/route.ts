import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Order, PaymentStatus, OrderStatus } from "@/models/Order";
import { PaymentEvent } from "@/models/PaymentEvent";
import { notifyOrderCreated } from "@/lib/notifications";
import Stripe from "stripe";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

    const stripe = getStripeClient();
    const webhookSecret = getStripeWebhookSecret();

    let event: Stripe.Event;

    // Strict Webhook Signature Verification
    if (!webhookSecret || !sig) {
      if (process.env.NODE_ENV === "production") {
        console.error("Missing STRIPE_WEBHOOK_SECRET or stripe-signature header in production.");
        return NextResponse.json({ error: "Missing webhook secret or signature" }, { status: 400 });
      }
      // Fail closed if signature verification is bypassed
      return NextResponse.json({ error: "Stripe webhook signature and secret are required" }, { status: 400 });
    }

    if (!stripe) {
      return NextResponse.json({ error: "Stripe client is not configured on the server" }, { status: 503 });
    }

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err: any) {
      console.error("Stripe Webhook Signature Verification Failed:", err.message);
      return NextResponse.json({ error: `Webhook Signature Verification Error: ${err.message}` }, { status: 400 });
    }

    if (!event || !event.type) {
      return NextResponse.json({ error: "Invalid event object" }, { status: 400 });
    }

    await connectDB();

    // ── Atomic Webhook Idempotency Check ────────────────────────────────────
    // Prevents duplicate processing under concurrent webhook delivery/retries
    const existingProcessed = await PaymentEvent.findOne({
      stripeEventId: event.id,
      processed: true,
    });

    if (existingProcessed) {
      return NextResponse.json({ received: true, idempotent: true });
    }

    // Upsert the event record
    await PaymentEvent.findOneAndUpdate(
      { stripeEventId: event.id },
      {
        $setOnInsert: {
          stripeEventId: event.id,
          eventType: event.type,
          processed: false,
          payload: event.data.object as any,
        },
      },
      { upsert: true, new: true }
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId || session.client_reference_id;
        const paymentIntentId = typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

        if (orderId && session.payment_status === "paid") {
          const query = mongoose.isValidObjectId(orderId)
            ? { $or: [{ _id: orderId }, { orderId }] }
            : { orderId };
          const order = await Order.findOne(query);

          if (order && order.paymentStatus !== PaymentStatus.PAID) {
            order.paymentStatus = PaymentStatus.PAID;
            order.orderStatus = OrderStatus.PROCESSING;
            if (paymentIntentId) {
              order.paymentIntentId = paymentIntentId;
            }
            await order.save();

            // Dispatch customer & vendor notifications
            await notifyOrderCreated(order).catch((e) => console.warn("Webhook notify error:", e));
          }
        }
        break;
      }

      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const orderId = intent.metadata?.orderId;
        const paymentIntentId = intent.id;

        if (orderId && intent.status === "succeeded") {
          const query = mongoose.isValidObjectId(orderId)
            ? { $or: [{ _id: orderId }, { orderId }] }
            : { orderId };
          const order = await Order.findOne(query);

          if (order && order.paymentStatus !== PaymentStatus.PAID) {
            // Verify payment amount matches expected order total
            const expectedCents = Math.round(Number(order.grandTotal ?? order.totalAmount) * 100);
            if (intent.amount >= expectedCents) {
              order.paymentStatus = PaymentStatus.PAID;
              order.orderStatus = OrderStatus.PROCESSING;
              order.paymentIntentId = paymentIntentId;
              await order.save();

              await notifyOrderCreated(order).catch((e) => console.warn("Webhook notify error:", e));
            } else {
              console.error(`Fraud warning: PaymentIntent amount ${intent.amount} < expected ${expectedCents} for Order ${orderId}`);
            }
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const orderId = intent.metadata?.orderId;

        if (orderId) {
          const query = mongoose.isValidObjectId(orderId)
            ? { $or: [{ _id: orderId }, { orderId }] }
            : { orderId };
          const order = await Order.findOne(query);

          if (order && order.paymentStatus !== PaymentStatus.PAID) {
            order.paymentStatus = PaymentStatus.FAILED;
            await order.save();
          }
        }
        break;
      }

      case "payment_intent.canceled": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const orderId = intent.metadata?.orderId;

        if (orderId) {
          const query = mongoose.isValidObjectId(orderId)
            ? { $or: [{ _id: orderId }, { orderId }] }
            : { orderId };
          const order = await Order.findOne(query);

          if (order && order.paymentStatus !== PaymentStatus.PAID) {
            order.paymentStatus = PaymentStatus.FAILED;
            order.orderStatus = OrderStatus.CANCELLED;
            await order.save();
          }
        }
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }

    // Mark event as processed (idempotency settled)
    await PaymentEvent.findOneAndUpdate(
      { stripeEventId: event.id },
      { $set: { processed: true } }
    );

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe Webhook Handler Error:", error);
    return NextResponse.json({ error: error.message || "Webhook handler failed" }, { status: 500 });
  }
}
