import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authHelper";

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Announcement message is required" }, { status: 400 });
    }

    // In a full implementation, this might broadcast using WebSockets or save to an announcements collection.
    // For now, return success.
    return NextResponse.json({ success: true, message });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
