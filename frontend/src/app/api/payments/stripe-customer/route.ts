import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import { safeFindUserById, safeUpdateUser, connectDB } from "@/lib/mongodb";

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

export async function GET(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await safeFindUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let stripeCustomerId = user.stripeCustomerId;

    // Create Stripe Customer if not existing
    if (!stripeCustomerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || user.email.split("@")[0],
          metadata: { userId: user.id },
        });
        stripeCustomerId = customer.id;
        await safeUpdateUser(user.id, { stripeCustomerId });
      } catch (e: any) {
        console.warn("Stripe Customer creation warning:", e.message);
        stripeCustomerId = `cus_demo_${user.id}`;
      }
    }

    // Fetch payment methods from Stripe if real ID
    let paymentMethods: any[] = [];
    if (stripeCustomerId && !stripeCustomerId.startsWith("cus_demo_")) {
      try {
        const stripeMethods = await stripe.paymentMethods.list({
          customer: stripeCustomerId,
          type: "card",
        });
        paymentMethods = stripeMethods.data.map((pm, idx) => ({
          id: pm.id,
          cardBrand: pm.card?.brand?.toUpperCase() || "VISA",
          last4: pm.card?.last4 || "4242",
          expMonth: pm.card?.exp_month || 12,
          expYear: pm.card?.exp_year || 2028,
          isDefault: idx === 0,
        }));
      } catch (e: any) {
        console.warn("Fetch Stripe PaymentMethods warning:", e.message);
      }
    }

    // Fallback to DB saved payment methods if empty
    if (paymentMethods.length === 0 && user.paymentMethods && user.paymentMethods.length > 0) {
      paymentMethods = user.paymentMethods;
    }

    return NextResponse.json({
      success: true,
      stripeCustomerId,
      paymentMethods,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch Stripe customer" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await safeFindUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { action, cardBrand, last4, expMonth, expYear } = body;

    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || user.email.split("@")[0],
          metadata: { userId: user.id },
        });
        stripeCustomerId = customer.id;
        await safeUpdateUser(user.id, { stripeCustomerId });
      } catch (e: any) {
        stripeCustomerId = `cus_demo_${user.id}`;
      }
    }

    if (action === "create_checkout_session") {
      // Create Stripe Checkout Session for setting up payment method or paying
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "setup",
          customer: stripeCustomerId.startsWith("cus_demo_") ? undefined : stripeCustomerId,
          customer_email: stripeCustomerId.startsWith("cus_demo_") ? user.email : undefined,
          success_url: `${req.nextUrl.origin}/dashboard?tab=payments&status=success`,
          cancel_url: `${req.nextUrl.origin}/dashboard?tab=payments&status=cancel`,
        });

        return NextResponse.json({
          success: true,
          url: session.url,
          sessionId: session.id,
        });
      } catch (e: any) {
        return NextResponse.json({ error: e.message || "Failed to create checkout session" }, { status: 400 });
      }
    }

    // Direct add payment method to DB/Stripe
    const newPm = {
      id: `pm_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      cardBrand: (cardBrand || "VISA").toUpperCase(),
      last4: last4 || "4242",
      expMonth: parseInt(expMonth || "12", 10),
      expYear: parseInt(expYear || "2028", 10),
      isDefault: !user.paymentMethods || user.paymentMethods.length === 0,
    };

    const existingMethods = user.paymentMethods || [];
    const updatedMethods = [...existingMethods, newPm];

    await safeUpdateUser(user.id, { paymentMethods: updatedMethods });

    return NextResponse.json({
      success: true,
      paymentMethod: newPm,
      paymentMethods: updatedMethods,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process payment method" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const decoded = getUserFromToken(req);
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const paymentMethodId = searchParams.get("id");
    if (!paymentMethodId) {
      return NextResponse.json({ error: "Payment method ID required" }, { status: 400 });
    }

    const user = await safeFindUserById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Detach from Stripe if real Stripe ID
    if (paymentMethodId.startsWith("pm_") && !paymentMethodId.includes("demo")) {
      try {
        await stripe.paymentMethods.detach(paymentMethodId);
      } catch (e: any) {
        console.warn("Stripe PM detach warning:", e.message);
      }
    }

    const updatedMethods = (user.paymentMethods || []).filter((pm: any) => pm.id !== paymentMethodId);
    await safeUpdateUser(user.id, { paymentMethods: updatedMethods });

    return NextResponse.json({
      success: true,
      paymentMethods: updatedMethods,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete payment method" }, { status: 500 });
  }
}
