import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/authHelper";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const notifications = [
    {
      id: "notif_1",
      title: "New Vendor Application",
      message: "Apex Tech Wearables has submitted store verification documents.",
      timestamp: "5 mins ago",
      read: false,
      type: "vendor",
    },
    {
      id: "notif_2",
      title: "High Order Volume Alert",
      message: "Platform processed over 1,000 orders in the last hour.",
      timestamp: "30 mins ago",
      read: false,
      type: "system",
    },
    {
      id: "notif_3",
      title: "Catalog Security Audit",
      message: "Daily catalog copyright scan completed with 0 violations.",
      timestamp: "2 hours ago",
      read: true,
      type: "security",
    },
  ];

  return NextResponse.json({ success: true, notifications });
}

export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { title, message } = await req.json();
    return NextResponse.json({
      success: true,
      notification: {
        id: `notif_${Date.now()}`,
        title: title || "Platform Announcement",
        message,
        timestamp: "Just now",
        read: false,
        type: "announcement",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
