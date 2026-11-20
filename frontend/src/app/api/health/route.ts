import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  let dbStatus = "disconnected";
  let isHealthy = false;

  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      dbStatus = "connected";
      isHealthy = true;
    }
  } catch (err: any) {
    dbStatus = "error";
    isHealthy = false;
  }

  const statusCode = isHealthy ? 200 : 503;

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "unhealthy",
      environment: process.env.NODE_ENV || "development",
      mongodb: dbStatus,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      service: "nati-store-ecommerce-api",
    },
    { status: statusCode }
  );
}
