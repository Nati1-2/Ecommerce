import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { VisitorLog } from "@/models/VisitorLog";
import type { DeviceSession, DeviceTrafficStats, FlattenedActivityItem, DeviceType } from "@/types/deviceTraffic";

const querySchema = z.object({
  search: z.string().max(200).default(""),
  deviceType: z.string().max(40).default("all"),
  status: z.string().max(40).default("all"),
  category: z.string().max(40).default("all"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(req.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid device filters" }, { status: 400 });
  try {
    await connectDB();
    const logs = await VisitorLog.find().sort({ visitedAt: -1 }).limit(1000).lean();
    const now = Date.now();
    const devices: DeviceSession[] = logs.map((log) => {
      const path = log.path || "/";
      const category = path.includes("checkout") ? "checkout" :
        path.includes("cart") ? "cart" : path.includes("search") ? "search" : "browse";
      return {
        id: String(log._id), sessionId: log.sessionId, ip: log.ip,
        deviceModel: log.deviceModel, deviceBrand: log.deviceBrand || "",
        deviceType: log.deviceType as DeviceType, os: log.os, browser: log.browser,
        screenResolution: log.screenResolution || "", viewport: "",
        userAgent: log.userAgent || "",
        location: { ...log.location, isp: "" },
        status: log.status, connectionType: "Unknown", durationSeconds: log.durationSeconds,
        lastActive: log.visitedAt.toISOString(), firstSeen: log.createdAt.toISOString(),
        currentPath: path,
        activities: [{
          id: String(log._id), activityType: "PAGE_NAVIGATION", title: `Visited ${path}`,
          category, path, method: "GET", statusCode: 0,
          timestamp: log.visitedAt.toISOString(), latencyMs: 0,
        }],
      };
    });
    const filters = parsed.data;
    const search = filters.search.toLowerCase();
    const filtered = devices.filter((device) =>
      (!search || [device.deviceModel, device.deviceBrand, device.ip, device.location.city,
        device.location.country, device.currentPath].some((value) => value?.toLowerCase().includes(search))) &&
      (filters.deviceType === "all" || device.deviceType.toLowerCase() === filters.deviceType.toLowerCase()) &&
      (filters.status === "all" || device.status.toLowerCase() === filters.status.toLowerCase()) &&
      (filters.category === "all" || device.activities.some((activity) => activity.category === filters.category))
    );
    const total = devices.length;
    const topModels = new Map<string, number>();
    devices.forEach((device) => topModels.set(device.deviceModel, (topModels.get(device.deviceModel) || 0) + 1));
    const stats: DeviceTrafficStats = {
      activeDevicesCount: devices.filter((device) => device.status === "online").length,
      totalEventsToday: devices.filter((device) => now - new Date(device.lastActive).getTime() < 86400000).length,
      mobileShare: total ? Math.round(devices.filter((device) => device.deviceType === "Mobile").length / total * 100) : 0,
      desktopShare: total ? Math.round(devices.filter((device) => device.deviceType === "Desktop").length / total * 100) : 0,
      tabletShare: total ? Math.round(devices.filter((device) => device.deviceType === "Tablet").length / total * 100) : 0,
      topDeviceModel: [...topModels].sort((a, b) => b[1] - a[1])[0]?.[0] || "",
      uniqueIpsCount: new Set(devices.map((device) => device.ip)).size,
      avgResponseLatency: 0,
    };
    const activities: FlattenedActivityItem[] = filtered.flatMap((device) =>
      device.activities.map((activity) => ({
        ...activity, deviceModel: device.deviceModel, deviceBrand: device.deviceBrand,
        deviceType: device.deviceType, ip: device.ip, flag: device.location.flag,
        city: device.location.city, country: device.location.country, sessionId: device.sessionId,
      }))
    );
    return NextResponse.json({
      success: true, stats, devices: filtered.slice((filters.page - 1) * filters.limit, filters.page * filters.limit),
      allActivities: activities.slice(0, 50), totalCount: filtered.length, page: filters.page,
      totalPages: Math.ceil(filtered.length / filters.limit),
    });
  } catch {
    return NextResponse.json({ error: "Unable to load device traffic" }, { status: 503 });
  }
}
