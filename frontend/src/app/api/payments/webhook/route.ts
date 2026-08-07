import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order, PaymentStatus, OrderStatus } from "@/models/Order";
import { notifyOrderCreated } from "@/lib/notifications";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2025-01-27.acacia" as any }) : null;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    if (stripe && webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (err: any) {
        console.error("Stripe Webhook Signature Verification Failed:", err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
      }
    } else {
      // Direct JSON parsing fallback for sandbox testing
      event = JSON.parse(rawBody);
    }

    await connectDB();

    switch (event.type) {
      case "checkout.session.completed":
      case "payment_intent.succeeded": {
        const object = event.data.object as any;
        const orderId = object.metadata?.orderId || object.client_reference_id;
        const paymentIntentId = object.id;

        if (orderId) {
          const order = await Order.findOne({
            $or: [{ _id: orderId }, { orderId: orderId }],
          });

          if (order) {
            order.paymentStatus = PaymentStatus.PAID;
            order.orderStatus = OrderStatus.PROCESSING;
            order.paymentIntentId = paymentIntentId;
            await order.save();

            // Dispatch notifications to Customer, Vendor, and Admin
            await notifyOrderCreated(order).catch((e) => console.warn("Webhook notify error:", e));
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const object = event.data.object as any;
        const orderId = object.metadata?.orderId || object.client_reference_id;

        if (orderId) {
          const order = await Order.findOne({
            $or: [{ _id: orderId }, { orderId: orderId }],
          });

          if (order) {
            order.paymentStatus = PaymentStatus.FAILED;
            await order.save();
          }
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Stripe Webhook Handler Error:", error);
    return NextResponse.json({ error: error.message || "Webhook handler failed" }, { status: 500 });
  }
}
