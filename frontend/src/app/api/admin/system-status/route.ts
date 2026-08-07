import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { metrics } from "@/lib/metrics";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let dbStatus = "disconnected";
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) dbStatus = "connected";
  } catch {
    dbStatus = "error";
  }

  const metricsSummary = metrics.getSummary();

  return NextResponse.json({
    success: true,
    status: dbStatus === "connected" ? "HEALTHY" : "DEGRADED",
    database: {
      status: dbStatus,
      latencyMs: metricsSummary.avgDbLatencyMs,
    },
    telemetry: {
      totalRequests: metricsSummary.totalRequests,
      errorRatePercent: metricsSummary.errorRatePercent,
      avgApiLatencyMs: metricsSummary.avgApiLatencyMs,
      paymentSuccessRatePercent: metricsSummary.paymentSuccessRatePercent,
      activeUsers: metricsSummary.activeUsers,
    },
    alerts: metricsSummary.errorRatePercent > 5.0 ? [{ severity: "HIGH", message: "API Error rate spike detected" }] : [],
    timestamp: new Date().toISOString(),
  });
}
