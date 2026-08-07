import { logger } from "@/lib/logger";

export interface TraceContext {
  requestId: string;
  correlationId: string;
  startTime: number;
}

export const telemetryTracing = {
  createContext: (headers?: Headers | Record<string, string>): TraceContext => {
    const getHeader = (name: string) => {
      if (!headers) return null;
      if ("get" in headers && typeof headers.get === "function") return headers.get(name);
      return (headers as Record<string, string>)[name] || (headers as Record<string, string>)[name.toLowerCase()];
    };

    const requestId = getHeader("x-request-id") || `req_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const correlationId = getHeader("x-correlation-id") || `corr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    return {
      requestId,
      correlationId,
      startTime: Date.now(),
    };
  },

  logTrace: (context: TraceContext, actionName: string, statusCode = 200, error?: string) => {
    const durationMs = Date.now() - context.startTime;
    logger.info(`[TRACE] ${actionName} completed in ${durationMs}ms`, {
      requestId: context.requestId,
      statusCode,
      durationMs,
      error,
      meta: { correlationId: context.correlationId },
    });
  },
};
