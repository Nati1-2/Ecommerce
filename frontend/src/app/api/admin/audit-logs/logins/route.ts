import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let sessions: any[] = [];
  try {
    await connectDB();
    const { UserSession } = await import("@/models/UserSession");
    const found = await UserSession.find().sort({ loginAt: -1 }).limit(50).lean();
    if (found && found.length > 0) {
      sessions = found.map((s: any) => ({
        id: s.sessionId || s._id?.toString(),
        user: s.email ? s.email.split("@")[0] : "Authorized User",
        userEmail: s.email || "user@natistore.com",
        role: "CUSTOMER",
        device: s.deviceBrand ? `${s.deviceBrand} (${s.deviceModel || s.deviceType})` : s.deviceType || "Desktop",
        browser: s.browser || "Chrome",
        location: s.location?.city ? `${s.location.city}, ${s.location.country}` : "Addis Ababa, Ethiopia",
        ip: s.ipAddress || "127.0.0.1",
        status: s.revoked ? "Revoked" : "Successful",
        timestamp: s.loginAt ? new Date(s.loginAt).toLocaleString() : "Just now",
      }));
    }
  } catch (err: any) {
    console.warn("Admin login history fetch notice:", err?.message || err);
  }

  // Merge with memory sessions
  if (global.inMemoryUserSessions && global.inMemoryUserSessions.length > 0) {
    const memList = global.inMemoryUserSessions.map((s: any) => ({
      id: s.sessionId || "sess_" + Math.random(),
      user: s.email ? s.email.split("@")[0] : "Current User",
      userEmail: s.email || "user@natistore.com",
      role: "CUSTOMER",
      device: s.deviceBrand ? `${s.deviceBrand} (${s.deviceModel || s.deviceType})` : s.deviceType || "Desktop",
      browser: s.browser || "Chrome",
      location: s.location?.city ? `${s.location.city}, ${s.location.country}` : "Addis Ababa, Ethiopia",
      ip: s.ipAddress || "127.0.0.1",
      status: s.revoked ? "Revoked" : "Successful",
      timestamp: s.loginAt ? new Date(s.loginAt).toLocaleString() : "Just now",
    }));

    const map = new Map<string, any>();
    for (const item of [...sessions, ...memList]) {
      if (!map.has(item.id)) map.set(item.id, item);
    }
    sessions = Array.from(map.values());
  }

  return NextResponse.json({ success: true, logins: sessions });
}
