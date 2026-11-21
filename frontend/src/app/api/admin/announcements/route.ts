import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authHelper";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Announcement message is required" }, { status: 400 });
    }

    return NextResponse.json({ error: "Announcement delivery is not configured" }, { status: 501 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
