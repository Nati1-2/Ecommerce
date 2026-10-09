import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { VisitorLog } from "@/models/VisitorLog";
import { parseUserAgent, parseTrafficSource, parseGeoLocation } from "@/lib/visitorParser";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      path = "/",
      referrer = "",
      utmSource = "",
      utmMedium = "",
      utmCampaign = "",
      sessionId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      screenResolution = "",
    } = body;

    // Skip tracking for internal admin endpoints or static assets
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return NextResponse.json({ success: true, ignored: true });
    }

    // Extract Client IP
    const forwarded = req.headers.get("x-forwarded-for");
    const rawIp = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";
    const ip = rawIp === "::1" ? "127.0.0.1" : rawIp;

    const userAgent = req.headers.get("user-agent") || "";
    const parsedUa = parseUserAgent(userAgent);
    const parsedSource = parseTrafficSource(referrer, {
      source: utmSource,
      medium: utmMedium,
      campaign: utmCampaign,
    });
    const parsedLocation = parseGeoLocation(req.headers);

    const logEntry = {
      sessionId,
      ip,
      deviceType: parsedUa.deviceType,
      deviceModel: parsedUa.deviceModel,
      deviceBrand: parsedUa.deviceBrand,
      os: parsedUa.os,
      browser: parsedUa.browser,
      location: parsedLocation,
      source: parsedSource,
      path,
      status: "online" as const,
      durationSeconds: 15,
      visitedAt: new Date(),
      screenResolution,
      userAgent: userAgent.substring(0, 250),
    };

    // Attempt MongoDB insertion / update
    let dbSaved = false;
    try {
      await connectDB();
      const existing = await VisitorLog.findOne({ sessionId });
      if (existing) {
        existing.path = path;
        existing.status = "online";
        existing.durationSeconds = (existing.durationSeconds || 0) + 15;
        existing.visitedAt = new Date();
        await existing.save();
      } else {
        await VisitorLog.create(logEntry);
      }
      dbSaved = true;
    } catch (err: any) {
      console.warn("Visitor track MongoDB notice (using in-memory):", err?.message || err);
    }

    // Update in-memory fallback list
    if (global.inMemoryVisitorLogs) {
      const idx = global.inMemoryVisitorLogs.findIndex((v) => v.sessionId === sessionId);
      if (idx >= 0) {
        global.inMemoryVisitorLogs[idx].path = path;
        global.inMemoryVisitorLogs[idx].durationSeconds += 15;
        global.inMemoryVisitorLogs[idx].visitedAt = new Date();
        global.inMemoryVisitorLogs[idx].status = "online";
      } else {
        global.inMemoryVisitorLogs.unshift({
          ...logEntry,
          id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          _id: `mem_${Date.now()}`,
        });
        // Keep in-memory logs bounded to last 200
        if (global.inMemoryVisitorLogs.length > 200) {
          global.inMemoryVisitorLogs = global.inMemoryVisitorLogs.slice(0, 200);
        }
      }
    }

    return NextResponse.json({ success: true, dbSaved });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to record visitor" },
      { status: 500 }
    );
  }
}
