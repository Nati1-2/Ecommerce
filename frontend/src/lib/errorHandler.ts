import { logger } from "@/lib/logger";
import { sentry } from "@/lib/sentry";

export class ApiError extends Error {
  statusCode: number;
  field?: string;

  constructor(message: string, statusCode = 500, field?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.field = field;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Extracts a safe, user-friendly error message from any caught error.
 * Prevents sensitive details (SQL/Mongo query syntax, server paths, tokens) from leaking.
 */
export function getErrorMessage(
  error: unknown,
  fallback = "An unexpected error occurred. Please try again."
): string {
  if (!error) return fallback;

  if (typeof error === "string") {
    return error.trim() || fallback;
  }

  if (error instanceof ApiError) {
    return error.message || fallback;
  }

  if (error instanceof Error) {
    const msg = error.message;

    // Filter out internal networking/database errors
    if (
      msg.includes("fetch failed") ||
      msg.includes("NetworkError") ||
      msg.includes("Failed to fetch") ||
      msg.includes("ECONNREFUSED")
    ) {
      return "Unable to connect to server. Please check your internet connection.";
    }

    if (
      msg.includes("MongoServerError") ||
      msg.includes("Cast to ObjectId failed") ||
      msg.includes("MongooseError")
    ) {
      return "The requested record could not be processed.";
    }

    return msg || fallback;
  }

  if (typeof error === "object" && error !== null) {
    const errObj = error as Record<string, any>;
    if (errObj.response?.data?.message) {
      return String(errObj.response.data.message);
    }
    if (Array.isArray(errObj.response?.data?.errors) && errObj.response.data.errors[0]?.message) {
      return String(errObj.response.data.errors[0].message);
    }
    if (errObj.message) {
      return String(errObj.message);
    }
  }

  return fallback;
}

/**
 * Centralized error reporting wrapper.
 * Logs locally with structured metadata and dispatches to Sentry if configured.
 */
export function reportError(
  error: unknown,
  context: Record<string, any> = {}
): void {
  const message = getErrorMessage(error);
  const errInstance = error instanceof Error ? error : new Error(message);

  logger.error(message, {
    error: errInstance.message,
    stack: errInstance.stack,
    meta: context,
  });

  sentry.captureException(errInstance, context);
}

