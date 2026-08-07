import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  let dbStatus = "disconnected";
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      dbStatus = "connected";
    }
  } catch (err) {
    dbStatus = "error";
  }

  return NextResponse.json({
    status: dbStatus === "connected" ? "healthy" : "degraded",
    environment: process.env.NODE_ENV || "production",
    mongodb: dbStatus,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    service: "nati-store-ecommerce-api",
  });
}
