import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Order, PaymentStatus } from "@/models/Order";
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
    // 1. Enforce Authentication: Only logged-in users can create payment intents
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Authentication required to initiate payment. Please log in first." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { orderId, amount, currency = "usd", billingAddress, receiptEmail } = body;

    if (!orderId || amount === undefined || amount === null) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: orderId and amount" },
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
            { success: false, error: "Forbidden: You are not authorized to create a payment for another user's order." },
            { status: 403 }
          );
        }
      }
    } catch (dbErr: any) {
      console.warn("Notice: could not query order for authorization check:", dbErr.message);
    }

    const stripe = getStripeClient();
    if (!stripe) {
      return NextResponse.json(
        { success: false, error: "Stripe configuration error: STRIPE_SECRET_KEY is not configured on the server" },
        { status: 503 }
      );
    }

    // Stripe expects amounts in cents for USD (min 50 cents)
    const unitAmount = Math.max(50, Math.round(Number(amount) * 100));

    // Create a real Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: unitAmount,
      currency: currency.toLowerCase(),
      receipt_email: receiptEmail || decoded.email || undefined,
      description: `Payment for Order #${orderId}`,
      metadata: {
        orderId: String(orderId),
        userId: decoded.id,
        customerEmail: decoded.email,
        customerName: billingAddress?.name || "Customer",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Save paymentIntentId to order in DB if order exists
    try {
      const query = mongoose.isValidObjectId(orderId)
        ? { $or: [{ orderId }, { _id: orderId }] }
        : { orderId };
      const order = await Order.findOne(query);
      if (order) {
        order.paymentIntentId = paymentIntent.id;
        if (order.paymentStatus !== PaymentStatus.PAID) {
          order.paymentStatus = PaymentStatus.PENDING;
        }
        await order.save();
      }
    } catch (dbErr) {
      console.warn("Notice: could not attach paymentIntentId to MongoDB order:", dbErr);
    }

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error: any) {
    console.error("Stripe create-intent error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
