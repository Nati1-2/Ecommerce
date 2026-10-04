import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";
import { connectDB, safeFindUserById } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getUserFromToken } from "@/lib/authHelper";

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
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
    // 1. Enforce Authentication: Checkout/Payment is available ONLY to logged-in users
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Authentication required to checkout. Please log in first." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId, amount, currency = "USD", items, successUrl, cancelUrl } = body;

    if (!orderId || amount === undefined || amount === null) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: orderId, amount" },
        { status: 400 }
      );
    }

    // 2. Validate Order Ownership in Database
    try {
      await connectDB();
      const query = mongoose.isValidObjectId(orderId)
        ? { $or: [{ orderId }, { _id: orderId }] }
        : { orderId };
      const order = await Order.findOne(query);

      if (order) {
        const isPrivileged = decoded.role === "ADMIN" || decoded.role === "VENDOR";
        if (!isPrivileged && order.userId && order.userId !== decoded.id) {
          return NextResponse.json(
            { success: false, error: "Forbidden: You are not authorized to pay for another user's order." },
            { status: 403 }
          );
        }
      }
    } catch (dbErr: any) {
      console.warn("Notice: could not query order for authorization check:", dbErr.message);
    }

    // 3. Ensure Stripe Client is configured
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: "Stripe payment gateway is not configured on the server." },
        { status: 503 }
      );
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

    let customerEmail = decoded.email;
    let stripeCustomerId: string | undefined = undefined;

    if (decoded.id) {
      try {
        const user = await safeFindUserById(decoded.id);
        if (user) {
          customerEmail = user.email || decoded.email;
          if (user.stripeCustomerId && !user.stripeCustomerId.startsWith("cus_demo_")) {
            stripeCustomerId = user.stripeCustomerId;
          }
        }
      } catch (err) {
        console.warn("User lookup notice:", err);
      }
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      mode: "payment",
      customer: stripeCustomerId,
      customer_email: stripeCustomerId ? undefined : (customerEmail || undefined),
      line_items: lineItems,
      success_url: successUrl || `${req.nextUrl.origin}/order/success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.nextUrl.origin}/order/failed/${orderId}`,
      client_reference_id: String(orderId),
      metadata: {
        orderId: String(orderId),
        userId: decoded.id,
      },
    };

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create(sessionParams);
    } catch (stripeErr: any) {
      if (stripeCustomerId && stripeErr?.message?.includes("No such customer")) {
        delete sessionParams.customer;
        sessionParams.customer_email = customerEmail || undefined;
        session = await stripe.checkout.sessions.create(sessionParams);
      } else {
        throw stripeErr;
      }
    }

    // Attach session to order in DB
    try {
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
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
