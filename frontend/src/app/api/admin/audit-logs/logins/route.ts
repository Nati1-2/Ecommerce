import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { UserSession } from "@/models/UserSession";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    await connectDB();
    const sessions = await UserSession.find().sort({ loginAt: -1 }).limit(50).lean();
    const users = await User.find({ _id: { $in: sessions.map((session) => session.userId) } }).select("name email role");
    const identities = new Map(users.map((user) => [String(user._id), user]));
    const logins = sessions.map((session) => {
      const user = identities.get(session.userId);
      return {
        id: session.sessionId, user: user?.name || session.email || "",
        userEmail: session.email || user?.email || "", role: user?.role || "",
        device: session.deviceModel, browser: session.browser,
        location: [session.location?.city, session.location?.country].filter(Boolean).join(", "),
        ip: session.ipAddress, status: session.revoked ? "Revoked" : "Successful",
        timestamp: session.loginAt.toISOString(),
      };
    });
    return NextResponse.json({ success: true, logins });
  } catch {
    return NextResponse.json({ error: "Unable to load login history" }, { status: 503 });
  }
}
