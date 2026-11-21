/**
 * Production Environment Validator
 * Verifies that required environment variables are set before startup.
 */

export interface EnvValidationResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

export function validateProductionEnv(): EnvValidationResult {
  const criticalEnvVars = [
    "MONGODB_URI",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
  ];

  const paymentEnvVars = [
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
  ];

  const missingCritical = criticalEnvVars.filter((key) =>
    !process.env[key] || (key.startsWith("JWT_") && process.env.NODE_ENV === "production" && process.env[key]!.length < 32)
  );
  if (process.env.JWT_ACCESS_SECRET && process.env.JWT_ACCESS_SECRET === process.env.JWT_REFRESH_SECRET) {
    missingCritical.push("JWT_REFRESH_SECRET (must differ from JWT_ACCESS_SECRET)");
  }
  const missingPayment = paymentEnvVars.filter((key) => !process.env[key]);

  const warnings: string[] = [];
  if (missingPayment.length > 0) {
    warnings.push(`Stripe payment integration incomplete. Missing: ${missingPayment.join(", ")}`);
  }

  if (missingCritical.length > 0 && process.env.NODE_ENV === "production") {
    const errorMsg = `[CRITICAL FATAL CONFIG] Missing essential production environment variables: ${missingCritical.join(", ")}`;
    console.error(errorMsg);
  }

  return {
    valid: missingCritical.length === 0,
    missing: missingCritical,
    warnings,
  };
}
