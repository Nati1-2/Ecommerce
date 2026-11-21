import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { VisitorLog } from "@/models/VisitorLog";
import type { VisitorLogItem, VisitorStats, TrafficSourceType, DeviceType } from "@/types/adminVisitors";

const querySchema = z.object({
  search: z.string().max(200).default(""),
  source: z.string().max(80).default("all"),
  device: z.string().max(80).default("all"),
  status: z.string().max(40).default("all"),
  country: z.string().max(80).default("all"),
  timeframe: z.enum(["all", "daily", "weekly", "monthly", "yearly", "custom"]).default("all"),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

function share<T extends string>(items: T[]): Array<{ value: T; count: number; percentage: number }> {
  const counts = new Map<T, number>();
  for (const item of items) counts.set(item, (counts.get(item) || 0) + 1);
  return [...counts].map(([value, count]) => ({
    value, count, percentage: items.length ? Math.round(count / items.length * 1000) / 10 : 0,
  })).sort((a, b) => Number(b.count) - Number(a.count));
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const parsed = querySchema.safeParse(Object.fromEntries(new URL(req.url).searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Invalid visitor filters" }, { status: 400 });
  const filters = parsed.data;
  try {
    await connectDB();
    const now = new Date();
    const start = filters.startDate ? new Date(filters.startDate) :
      filters.timeframe === "daily" ? new Date(now.getTime() - 86400000) :
      filters.timeframe === "weekly" ? new Date(now.getTime() - 7 * 86400000) :
      filters.timeframe === "monthly" ? new Date(now.getTime() - 30 * 86400000) :
      filters.timeframe === "yearly" ? new Date(now.getTime() - 365 * 86400000) : null;
    const end = filters.endDate ? new Date(`${filters.endDate}T23:59:59.999Z`) : null;
    const query: Record<string, unknown> = {};
    if (start || end) query.visitedAt = {
      ...(start ? { $gte: start } : {}), ...(end ? { $lte: end } : {}),
    };
    if (filters.source !== "all") query["source.type"] = filters.source;
    if (filters.device !== "all") query.deviceType = filters.device;
    if (filters.status !== "all") query.status = filters.status;
    if (filters.country !== "all") query["location.country"] = filters.country;
    if (filters.search) {
      const escaped = filters.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      query.$or = [
        { ip: regex }, { path: regex }, { "location.country": regex },
        { "location.city": regex }, { "source.name": regex }, { browser: regex },
        { os: regex }, { deviceModel: regex },
      ];
    }
    const [count, records, all] = await Promise.all([
      VisitorLog.countDocuments(query),
      VisitorLog.find(query).sort({ visitedAt: -1 }).skip((filters.page - 1) * filters.limit).limit(filters.limit).lean(),
      VisitorLog.find(query).select("ip status deviceType source os location").lean(),
    ]);
    const sources = share(all.map((log) => log.source?.type as TrafficSourceType).filter(Boolean))
      .map(({ value, ...entry }) => ({ ...entry, type: value, name: value }));
    const devices = share(all.map((log) => log.deviceType as DeviceType).filter(Boolean))
      .map(({ value, ...entry }) => ({ ...entry, deviceType: value }));
    const operatingSystems = share(all.map((log) => log.os).filter(Boolean))
      .map(({ value, ...entry }) => ({ ...entry, os: value }));
    const countries = share(all.map((log) => log.location?.country).filter(Boolean))
      .map(({ value, ...entry }) => {
        const location = all.find((log) => log.location?.country === value)?.location;
        return { ...entry, country: value, countryCode: location?.countryCode || "", flag: location?.flag || "" };
      });
    const stats: VisitorStats = {
      totalVisits: count,
      liveActive: all.filter((log) => log.status === "online").length,
      uniqueIps: new Set(all.map((log) => log.ip)).size,
      topSource: sources.length
        ? { type: sources[0].type, name: sources[0].name, percentage: sources[0].percentage }
        : { type: "Other", name: "None", percentage: 0 },
      deviceBreakdown: devices,
      sourceBreakdown: sources,
      osBreakdown: operatingSystems,
      topCountries: countries,
    };
    const visitors: VisitorLogItem[] = records.map((log) => ({
      id: String(log._id), ip: log.ip, deviceType: log.deviceType,
      deviceModel: log.deviceModel, deviceBrand: log.deviceBrand,
      os: log.os, browser: log.browser, location: log.location,
      source: log.source as VisitorLogItem["source"], path: log.path,
      status: log.status, durationSeconds: log.durationSeconds,
      visitedAt: log.visitedAt.toISOString(), screenResolution: log.screenResolution,
      userAgent: log.userAgent,
    }));
    return NextResponse.json({
      success: true, stats, visitors, totalCount: count, page: filters.page,
      totalPages: Math.ceil(count / filters.limit), timeframe: filters.timeframe,
      startDate: filters.startDate, endDate: filters.endDate,
    });
  } catch {
    return NextResponse.json({ error: "Unable to load visitor data" }, { status: 503 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  try {
    await connectDB();
    await VisitorLog.deleteMany({});
    return NextResponse.json({ success: true, message: "Visitor logs cleared" });
  } catch {
    return NextResponse.json({ error: "Unable to clear visitor logs" }, { status: 503 });
  }
}
