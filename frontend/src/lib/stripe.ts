import Stripe from "stripe";

export const DEFAULT_STRIPE_PUBLISHABLE_KEY = "";

export const DEFAULT_STRIPE_SECRET_KEY = "";

export const DEFAULT_STRIPE_WEBHOOK_SECRET = "whsec_test_secret_for_local_dev";

export function getStripePublishableKey(): string {
  return (
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    process.env.STRIPE_PUBLISHABLE_KEY ||
    DEFAULT_STRIPE_PUBLISHABLE_KEY
  );
}

export function getStripeSecretKey(): string {
  return (
    process.env.STRIPE_SECRET_KEY ||
    DEFAULT_STRIPE_SECRET_KEY
  );
}

export function getStripeWebhookSecret(): string {
  return (
    process.env.STRIPE_WEBHOOK_SECRET ||
    DEFAULT_STRIPE_WEBHOOK_SECRET
  );
}

let cachedStripeInstance: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  const secretKey = getStripeSecretKey();
  if (!secretKey) return null;

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
