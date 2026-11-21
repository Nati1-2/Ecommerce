import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const started = Date.now();
  try {
    await connectDB();
    await mongoose.connection.db?.admin().ping();
    const dbLatencyMs = Date.now() - started;
    const systemStatus = {
      api: "Operational", database: "Connected", redis: "Unknown", rabbitmq: "Unknown",
      microservices: [],
    };
    return NextResponse.json({
      success: true, status: systemStatus, systemStatus, healthStatus: "HEALTHY",
      database: { status: "connected", latencyMs: dbLatencyMs },
      telemetry: {
        uptimeSeconds: Math.floor(process.uptime()),
        heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1048576),
        dbLatencyMs, nodeVersion: process.version,
      },
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Database health check failed" }, { status: 503 });
  }
}
