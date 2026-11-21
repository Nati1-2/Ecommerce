import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authHelper";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  return NextResponse.json({ error: "Persistent audit logging is not configured" }, { status: 501 });
}
