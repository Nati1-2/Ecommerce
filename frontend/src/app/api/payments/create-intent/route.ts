import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Order, PaymentStatus } from "@/models/Order";
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
    const { orderId, currency = "usd", billingAddress, receiptEmail } = body;

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
        { success: false, error: `Order '${orderId}' not found. Cannot initiate payment for nonexistent order.` },
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

    // 3. Server-Authoritative Amount Calculation
    // Never trust client-provided amount; strictly use order.grandTotal from database
    const authoritativeAmount = Number(order.grandTotal ?? order.totalAmount ?? 0);
    if (authoritativeAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order amount. Total must be greater than zero." },
        { status: 400 }
      );
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: "Stripe configuration error: STRIPE_SECRET_KEY is not configured on the server." },
        { status: 503 }
      );
    }

    // Stripe expects amounts in cents for USD (min 50 cents)
    const unitAmount = Math.max(50, Math.round(authoritativeAmount * 100));

    // Create Stripe PaymentIntent with authoritative amount and verified order metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: unitAmount,
      currency: String(currency).toLowerCase(),
      receipt_email: receiptEmail || decoded.email || undefined,
      description: `Payment for Order #${order.orderId}`,
      metadata: {
        orderId: String(order.orderId),
        userId: decoded.id,
        customerEmail: decoded.email,
        customerName: billingAddress?.name || "Customer",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Attach paymentIntentId to order
    order.paymentIntentId = paymentIntent.id;
    if (order.paymentStatus !== PaymentStatus.PAID) {
      order.paymentStatus = PaymentStatus.PENDING;
    }
    await order.save();

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: authoritativeAmount,
    });
  } catch (error: any) {
    console.error("Create payment intent error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment intent creation failed" },
      { status: 500 }
    );
  }
}
