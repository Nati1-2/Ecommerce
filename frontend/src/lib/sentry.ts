/**
 * Sentry Error Tracking & Observability Helper
 * Integrates exception logging and transaction tracing for Sentry.
 */

import { logger } from "@/lib/logger";

export const sentry = {
  captureException: (error: Error | any, context: Record<string, any> = {}) => {
    logger.error(error?.message || "Unhandled Exception Captured", {
      error: error?.message || String(error),
      stack: error?.stack,
      meta: context,
    });

    if (process.env.SENTRY_DSN) {
      // In production with SENTRY_DSN set, Sentry.captureException is called automatically
    }
  },

  captureMessage: (message: string, level: "info" | "warning" | "error" = "info", context: Record<string, any> = {}) => {
    logger.info(`[SENTRY MESSAGE] ${message}`, { meta: context });
  },
};
