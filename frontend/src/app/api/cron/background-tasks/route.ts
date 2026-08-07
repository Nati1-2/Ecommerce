import { NextResponse } from "next/server";
import { queueWorker } from "@/lib/queueWorker";
import { logger } from "@/lib/logger";

export async function GET() {
  logger.info("[VERCEL CRON] Triggering scheduled background task processing");

  // Process queued tasks
  queueWorker.enqueue("ANALYTICS_AGGREGATION", { triggeredBy: "Vercel Cron" });
  await queueWorker.processNextJob();

  return NextResponse.json({
    success: true,
    message: "Cron job executed successfully",
    timestamp: new Date().toISOString(),
  });
}
