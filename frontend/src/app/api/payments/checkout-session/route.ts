import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";
import { connectDB, safeFindUserById } from "@/lib/mongodb";
import { Order, PaymentStatus } from "@/models/Order";
import { getUserFromToken } from "@/lib/authHelper";
import { getStripeClient } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce Authentication
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Authentication required to checkout. Please log in first." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId, currency = "USD", successUrl, cancelUrl } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: orderId" },
        { status: 400 }
      );
    }

    // 2. Validate Order Existence & Ownership in Database (Fail Closed)
    await connectDB();
    const query = mongoose.isValidObjectId(orderId)
      ? { $or: [{ orderId }, { _id: orderId }] }
      : { orderId };

    const order = await Order.findOne(query);

    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order '${orderId}' was not found. Cannot initiate checkout session.` },
        { status: 404 }
      );
    }

    // Check ownership
    const isPrivileged = decoded.role === "ADMIN";
    if (!isPrivileged && order.userId && order.userId !== decoded.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You are not authorized to pay for another user's order." },
        { status: 403 }
      );
    }

    // Check if order is already paid
    if (order.paymentStatus === PaymentStatus.PAID) {
      return NextResponse.json(
        { success: false, error: "This order has already been paid and settled." },
        { status: 400 }
      );
    }

    // 3. Ensure Stripe Client is configured
    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: "Stripe payment gateway is not configured on the server." },
        { status: 503 }
      );
    }

    // 4. Server-Authoritative Line Items Built from Verified Order in DB
    const authoritativeItems = Array.isArray(order.items) && order.items.length > 0 ? order.items : [];
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = authoritativeItems.length > 0
      ? authoritativeItems.map((item: any) => ({
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: String(item.name || "Item") },
            unit_amount: Math.max(50, Math.round(Number(item.price) * 100)),
          },
          quantity: Math.max(1, Number(item.quantity) || 1),
        }))
      : [{
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: `Order #${order.orderId}` },
            unit_amount: Math.max(50, Math.round(Number(order.grandTotal ?? order.totalAmount) * 100)),
          },
          quantity: 1,
        }];

    // Append shipping and tax as line items if applicable
    if (order.shippingCost && order.shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { name: "Shipping & Handling" },
          unit_amount: Math.round(order.shippingCost * 100),
        },
        quantity: 1,
      });
    }

    if (order.tax && order.tax > 0) {
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: { name: "Estimated Tax (5%)" },
          unit_amount: Math.round(order.tax * 100),
        },
        quantity: 1,
      });
    }

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
        // User lookup warning
      }
    }

    const host = req.headers.get("origin") || req.headers.get("referer") || "http://localhost:3000";
    const resolvedSuccessUrl = successUrl || `${host}/orders/${order.orderId}?session_id={CHECKOUT_SESSION_ID}`;
    const resolvedCancelUrl = cancelUrl || `${host}/orders/${order.orderId}?payment_cancelled=true`;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      mode: "payment",
      customer: stripeCustomerId,
      customer_email: stripeCustomerId ? undefined : (customerEmail || undefined),
      line_items: lineItems,
      success_url: resolvedSuccessUrl,
      cancel_url: resolvedCancelUrl,
      client_reference_id: String(order.orderId),
      metadata: {
        orderId: String(order.orderId),
        userId: decoded.id,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Attach session ID to order
    if (session.id) {
      order.checkoutSessionId = session.id;
      await order.save();
    }

    return NextResponse.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error("Create checkout session error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Checkout session creation failed" },
      { status: 500 }
    );
  }
}
