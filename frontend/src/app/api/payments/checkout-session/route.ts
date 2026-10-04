import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import { safeFindUserById } from "@/lib/mongodb";

import { getUserFromToken } from "@/lib/authHelper";

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
    const decoded = getUserFromToken(req);
    const body = await req.json();
    const { orderId, amount, currency = "USD", items, successUrl, cancelUrl } = body;

    if (!orderId || amount === undefined || amount === null) {
      return NextResponse.json({ error: "Missing required parameters: orderId, amount" }, { status: 400 });
    }

    const userContext = decoded || { id: "usr-demo-customer", email: body.customerEmail || "customer@natistore.com", role: "CUSTOMER" };

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json({
        success: true,
        data: {
          checkoutUrl: `${successUrl || `${req.nextUrl.origin}/order/success/${orderId}`}`,
          sessionId: `cs_demo_${Date.now()}`,
        },
      });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items && items.length > 0
      ? items.map((item: any) => ({
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: item.name || "Item" },
            unit_amount: Math.max(50, Math.round(Number(item.amount || amount) * 100)),
          },
          quantity: item.quantity || 1,
        }))
      : [{
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: `Nati Order #${orderId}` },
            unit_amount: Math.max(50, Math.round(Number(amount) * 100)),
          },
          quantity: 1,
        }];

    let customerEmail = userContext.email;
    let stripeCustomerId: string | undefined = undefined;

    if (userContext.id && userContext.id !== "guest") {
      try {
        const user = await safeFindUserById(userContext.id);
        if (user) {
          customerEmail = user.email;
          if (user.stripeCustomerId && !user.stripeCustomerId.startsWith("cus_demo_")) {
            stripeCustomerId = user.stripeCustomerId;
          }
        }
      } catch (err) {
        console.warn("User lookup notice:", err);
      }
    }

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer: stripeCustomerId,
        customer_email: stripeCustomerId ? undefined : customerEmail,
        line_items: lineItems,
        success_url: successUrl || `${req.nextUrl.origin}/order/success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${req.nextUrl.origin}/order/failed/${orderId}`,
        client_reference_id: String(orderId),
        metadata: {
          orderId: String(orderId),
          userId: userContext.id || "",
        },
      });
    } catch (stripeErr: any) {
      if (stripeCustomerId && stripeErr?.message?.includes("No such customer")) {
        session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          customer_email: customerEmail,
          line_items: lineItems,
          success_url: successUrl || `${req.nextUrl.origin}/order/success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: cancelUrl || `${req.nextUrl.origin}/order/failed/${orderId}`,
          client_reference_id: String(orderId),
          metadata: {
            orderId: String(orderId),
            userId: userContext.id || "",
          },
        });
      } else {
        throw stripeErr;
      }
    }

    // Attach session to order in DB
    try {
      const { connectDB } = await import("@/lib/mongodb");
      const { Order } = await import("@/models/Order");
      const mongoose = (await import("mongoose")).default;
      await connectDB();
      const query = mongoose.isValidObjectId(orderId)
        ? { $or: [{ orderId }, { _id: orderId }] }
        : { orderId };
      const order = await Order.findOne(query);
      if (order) {
        order.paymentIntentId = session.id;
        await order.save();
      }
    } catch (dbErr) {
      console.warn("Notice: could not attach session ID to order:", dbErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        checkoutUrl: session.url,
        sessionId: session.id,
      },
    });
  } catch (error: any) {
    console.error("Stripe Checkout Session Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 });
  }
}
