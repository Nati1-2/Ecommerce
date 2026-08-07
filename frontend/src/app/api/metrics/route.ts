import { NextResponse } from "next/server";
import { metrics } from "@/lib/metrics";

export async function GET() {
  const body = metrics.getPrometheusFormat();
  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
