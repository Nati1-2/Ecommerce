import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { User } from "@/models/User";
import { UserSession } from "@/models/UserSession";
import type { AdminLoginDevice, AdminLoginDevicesResponse } from "@/types/adminLoginDevices";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("revoke"), deviceId: z.string().min(1) }),
  z.object({ action: z.literal("revoke_all_others") }),
]);

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    await connectDB();
    const admins = await User.find({ role: "ADMIN" }).select("_id name email");
    const identities = new Map(admins.map((admin) => [String(admin._id), admin]));
    const sessions = await UserSession.find({ userId: { $in: [...identities.keys()] } })
      .sort({ lastActive: -1 }).limit(500);
    const currentSession = req.cookies.get("session_id")?.value;
    const devices: AdminLoginDevice[] = sessions.map((session) => {
      const owner = identities.get(session.userId);
      const current = session.sessionId === currentSession && session.userId === auth.payload.id;
      const status = session.revoked ? "REVOKED" :
        current ? "CURRENT" :
        Date.now() - new Date(session.lastActive).getTime() > 15 * 60 * 1000 ? "IDLE" : "ACTIVE";
      return {
        id: session.sessionId, sessionId: session.sessionId,
        adminEmail: session.email || owner?.email || "", adminName: owner?.name || "",
        role: "ADMIN", deviceModel: session.deviceModel, deviceBrand: session.deviceBrand,
        deviceType: session.deviceType === "Unknown" ? "Desktop" : session.deviceType,
        os: session.os, browser: session.browser, ip: session.ipAddress,
        location: {
          city: session.location?.city || "", region: session.location?.region || "",
          country: session.location?.country || "", countryCode: session.location?.countryCode || "",
          flag: "", isp: session.location?.isp || "",
        },
        status, loginTime: session.loginAt.toISOString(), lastActive: session.lastActive.toISOString(),
        is2FAVerified: false, isCurrentDevice: current,
        authMethod: "Password + JWT", userAgent: session.userAgent || "",
      };
    });
    const active = devices.filter((device) => device.status === "CURRENT" || device.status === "ACTIVE").length;
    const response: AdminLoginDevicesResponse = {
      success: true,
      stats: {
        activeAdminSessions: active, totalDevicesCount: devices.length, trustedDevicesCount: 0,
        failedLoginsToday: 0, totalAdminActions24h: 0, mfaEnforcementRate: 0,
      },
      devices, activities: [],
    };
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Unable to load admin sessions" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const parsed = actionSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Unsupported session action" }, { status: 400 });
  try {
    await connectDB();
    const adminIds = (await User.find({ role: "ADMIN" }).select("_id")).map((admin) => String(admin._id));
    if (parsed.data.action === "revoke") {
      const result = await UserSession.updateOne(
        { sessionId: parsed.data.deviceId, userId: { $in: adminIds }, revoked: false },
        { $set: { revoked: true } }
      );
      if (result.modifiedCount === 0) return NextResponse.json({ error: "Active session not found" }, { status: 404 });
      return NextResponse.json({ success: true, message: "Admin session revoked" });
    }
    const currentSession = req.cookies.get("session_id")?.value;
    await UserSession.updateMany(
      { userId: { $in: adminIds }, sessionId: { $ne: currentSession }, revoked: false },
      { $set: { revoked: true } }
    );
    return NextResponse.json({ success: true, message: "Other admin sessions revoked" });
  } catch {
    return NextResponse.json({ error: "Unable to revoke admin sessions" }, { status: 503 });
  }
}
