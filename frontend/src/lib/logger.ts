/**
 * Structured Production Logger
 * Outputs JSON logs formatted for CloudWatch, Datadog, Grafana Loki, and Sentry.
 */

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogPayload {
  message: string;
  requestId?: string;
  userId?: string;
  endpoint?: string;
  statusCode?: number;
  durationMs?: number;
  error?: string;
  stack?: string;
  meta?: Record<string, any>;
}

class Logger {
  private formatLog(level: LogLevel, payload: LogPayload) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      service: "nati-store-api",
      environment: process.env.NODE_ENV || "production",
      ...payload,
    });
  }

  info(message: string, payload: Omit<LogPayload, "message"> = {}) {
    console.log(this.formatLog("info", { message, ...payload }));
  }

  warn(message: string, payload: Omit<LogPayload, "message"> = {}) {
    console.warn(this.formatLog("warn", { message, ...payload }));
  }

  error(message: string, payload: Omit<LogPayload, "message"> = {}) {
    console.error(this.formatLog("error", { message, ...payload }));
  }

  debug(message: string, payload: Omit<LogPayload, "message"> = {}) {
    if (process.env.NODE_ENV !== "production") {
      console.log(this.formatLog("debug", { message, ...payload }));
    }
  }
}

export const logger = new Logger();
