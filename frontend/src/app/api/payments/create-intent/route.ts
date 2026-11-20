import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Order, PaymentStatus, OrderStatus } from "@/models/Order";
import { getUserFromToken } from "@/lib/authHelper";
import { getStripeClient } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce Authentication
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Authentication required to initiate payment. Please log in first." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId, billingAddress, receiptEmail } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameter: orderId" },
        { status: 400 }
      );
    }

    // 2. Validate Order Existence & Strict Ownership in Database (Fail Closed)
    await connectDB();
    const query = mongoose.isValidObjectId(orderId)
      ? { $or: [{ orderId }, { _id: orderId }] }
      : { orderId };

    const order = await Order.findOne(query);

    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order '${orderId}' not found. Cannot initiate payment for nonexistent order.` },
        { status: 404 }
      );
    }

    // Exact ownership validation: Non-admins can only pay for their own orders
    const isPrivileged = decoded.role === "ADMIN";
    if (!isPrivileged && (!order.userId || order.userId !== decoded.id)) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You are not authorized to pay for another user's order." },
        { status: 403 }
      );
    }

    // Reject already-paid orders
    if (order.paymentStatus === PaymentStatus.PAID) {
      return NextResponse.json(
        { success: false, error: "This order has already been paid and settled." },
        { status: 400 }
      );
    }

    // Reject cancelled orders
    if (order.orderStatus === OrderStatus.CANCELLED) {
      return NextResponse.json(
        { success: false, error: "Cannot process payment: This order has been cancelled." },
        { status: 400 }
      );
    }

    // 3. Server-Authoritative Amount and Currency (Never trust client body)
    const authoritativeAmount = Number(order.grandTotal ?? order.totalAmount ?? 0);
    if (authoritativeAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order amount. Total must be greater than zero." },
        { status: 400 }
      );
    }

    const orderCurrency = String(order.currency || "usd").toLowerCase().trim();

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: "Stripe configuration error: STRIPE_SECRET_KEY is not configured on the server." },
        { status: 503 }
      );
    }

    // Calculate unit amount in cents
    const unitAmount = Math.max(50, Math.round(authoritativeAmount * 100));

    // Reuse existing incomplete PaymentIntent if one already exists for this order
    if (order.paymentIntentId) {
      try {
        const existingIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
        if (existingIntent && existingIntent.status === "requires_payment_method") {
          return NextResponse.json({
            success: true,
            clientSecret: existingIntent.client_secret,
            paymentIntentId: existingIntent.id,
            amount: authoritativeAmount,
            currency: orderCurrency,
          });
        }
      } catch {
        // Intent retrieval failed, proceed to create a new one
      }
    }

    // Create Stripe PaymentIntent with Stripe Idempotency Key
    const idempotencyKey = `intent_${order.orderId}_${Date.now()}`;
    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: unitAmount,
        currency: orderCurrency,
        receipt_email: receiptEmail || decoded.email || undefined,
        description: `Payment for Order #${order.orderId}`,
        metadata: {
          orderId: String(order.orderId),
          userId: decoded.id,
          expectedAmount: String(unitAmount),
          currency: orderCurrency,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      },
      { idempotencyKey }
    );

    // Attach payment attempt to order in DB
    order.paymentIntentId = paymentIntent.id;
    order.paymentAttemptId = idempotencyKey;
    order.paymentStatus = PaymentStatus.PENDING;
    order.orderStatus = OrderStatus.PENDING_PAYMENT;
    await order.save();

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: authoritativeAmount,
      currency: orderCurrency,
    });
  } catch (error: any) {
    console.error("Create payment intent error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment intent creation failed" },
      { status: 500 }
    );
  }
}
