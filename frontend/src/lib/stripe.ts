import Stripe from "stripe";

export function getStripePublishableKey(): string {
  return (
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.STRIPE_PUBLISHABLE_KEY ||
    ""
  );
}

export function getStripeSecretKey(): string {
  return process.env.STRIPE_SECRET_KEY || "";
}

export function getStripeWebhookSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET || "";
}

let cachedStripeInstance: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  const secretKey = getStripeSecretKey();
  if (!secretKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("CRITICAL: STRIPE_SECRET_KEY is not configured on the server.");
    }
    return null;
  }

  if (cachedStripeInstance) {
    return cachedStripeInstance;
  }

  try {
    cachedStripeInstance = new Stripe(secretKey, {
      apiVersion: "2025-01-27.acacia" as any,
    });
    return cachedStripeInstance;
  } catch (e) {
    console.error("Failed to initialize Stripe client:", e);
    return null;
  }
}
