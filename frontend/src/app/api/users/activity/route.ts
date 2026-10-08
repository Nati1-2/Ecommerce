import { NextRequest, NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/authHelper";
import {
  safeGetUserSessions,
  safeSaveUserSession,
  safeDeleteUserSession,
} from "@/lib/mongodb";
import {
  parseUserAgent,
  getRealClientIp,
  resolveGeoLocation,
} from "@/lib/deviceTracker";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }

    const currentSessionId = req.cookies.get("session_id")?.value;
    let sessions = await safeGetUserSessions(user.id);

    // If no sessions yet, record current session immediately so real data is permanently saved
    if (!sessions || sessions.length === 0) {
      const ua = req.headers.get("user-agent") || "";
      const parsed = parseUserAgent(ua);
      const ip = getRealClientIp(req);
      const location = await resolveGeoLocation(ip);
      const newSessionId =
        currentSessionId ||
        "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();

      const created = await safeSaveUserSession({
        sessionId: newSessionId,
        userId: user.id,
        email: user.email,
        ipAddress: ip,
        deviceType: parsed.deviceType,
        deviceBrand: parsed.deviceBrand,
        deviceModel: parsed.deviceModel,
        os: parsed.os,
        browser: parsed.browser,
        location,
        userAgent: ua,
      });

      sessions = [created];
    }

    // Decorate sessions with isCurrentSession
    const mappedSessions = sessions.map((s, idx) => {
      const isCurrent = currentSessionId
        ? s.sessionId === currentSessionId
        : idx === 0; // Default latest to current session if no cookie yet
      return {
        ...s,
        isCurrentSession: isCurrent,
      };
    });

    return NextResponse.json({
      success: true,
      sessions: mappedSessions,
    });
  } catch (error: any) {
    console.error("Error fetching login activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch login activity" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const ua = req.headers.get("user-agent") || body.userAgent || "";
    const clientProvidedIp = body.clientIp;

    const parsed = parseUserAgent(ua, {
      model: body.clientModel,
      platform: body.platform,
      brandHint: body.clientBrand,
      gpu: body.clientGpu,
    });

    const ip = getRealClientIp(req, clientProvidedIp);
    const location = await resolveGeoLocation(ip, body.clientLocation);

    const sessionId =
      body.sessionId ||
      req.cookies.get("session_id")?.value ||
      "sess_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();

    const saved = await safeSaveUserSession({
      sessionId,
      userId: user.id,
      email: user.email,
      ipAddress: ip,
      deviceType: body.clientType || parsed.deviceType,
      deviceBrand: body.clientBrand || parsed.deviceBrand,
      deviceModel: body.clientModel || parsed.deviceModel,
      os: parsed.os,
      browser: parsed.browser,
      location,
      userAgent: ua,
    });

    const response = NextResponse.json({
      success: true,
      session: {
        ...saved,
        isCurrentSession: true,
      },
    });

    // Ensure session_id cookie is saved
    response.cookies.set("session_id", sessionId, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Error saving login activity:", error);
    return NextResponse.json(
      { error: "Failed to save login activity" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    await safeDeleteUserSession(user.id, sessionId);

    return NextResponse.json({
      success: true,
      message: "Session revoked successfully",
    });
  } catch (error: any) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 }
    );
  }
}
