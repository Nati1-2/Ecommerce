import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authHelper";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  return NextResponse.json({ error: "Persistent system settings are not configured" }, { status: 501 });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  return NextResponse.json({ error: "Persistent system settings are not configured" }, { status: 501 });
}
