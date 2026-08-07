/**
 * Production Environment Validator
 * Verifies that required environment variables are set before startup.
 */

export function validateProductionEnv(): { valid: boolean; missing: string[] } {
  const requiredEnvVars = [
    "MONGODB_URI",
    "JWT_SECRET",
  ];

  const optionalEnvVars = [
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ];

  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0 && process.env.NODE_ENV === "production") {
    console.warn(`[ENV WARNING] Missing critical production environment variables: ${missing.join(", ")}`);
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}
