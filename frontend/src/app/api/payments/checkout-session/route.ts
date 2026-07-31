import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import { safeFindUserById } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || "fallback-secret-for-dev";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia" as any,
});

function getUserFromToken(req: NextRequest): { id: string; email: string; role: string } | null {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const tokenCookie = req.cookies.get("token");
      token = tokenCookie?.value || "";
    }
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (err) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    const body = await req.json();
    const { orderId, amount, currency = "USD", items, successUrl, cancelUrl } = body;

    if (!orderId || !amount) {
      return NextResponse.json({ error: "Missing required parameters: orderId, amount" }, { status: 400 });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items && items.length > 0
      ? items.map((item: any) => ({
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: item.name },
            unit_amount: Math.round(item.amount * 100),
          },
          quantity: item.quantity || 1,
        }))
      : [{
          price_data: {
            currency: currency.toLowerCase(),
            product_data: { name: `Nati Order #${orderId}` },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        }];

    let customerEmail = decoded?.email;
    let stripeCustomerId = undefined;

    if (decoded?.id) {
      const user = await safeFindUserById(decoded.id);
      if (user) {
        customerEmail = user.email;
        if (user.stripeCustomerId && !user.stripeCustomerId.startsWith("cus_demo_")) {
          stripeCustomerId = user.stripeCustomerId;
        }
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer: stripeCustomerId,
      customer_email: stripeCustomerId ? undefined : customerEmail,
      line_items: lineItems,
      success_url: successUrl || `${req.nextUrl.origin}/order/success/${orderId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.nextUrl.origin}/order/failed/${orderId}`,
      client_reference_id: orderId,
      metadata: {
        orderId,
        userId: decoded?.id || "",
      },
    });

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
