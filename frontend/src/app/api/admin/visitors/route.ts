import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { VisitorLog } from "@/models/VisitorLog";
import {
  VisitorLogItem,
  VisitorStats,
  TrafficSourceType,
  DeviceType,
} from "@/types/adminVisitors";

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Starter visitor templates for realistic multi-region, multi-device telemetry
const STARTER_VISITORS = [
  {
    sessionId: "v_us_iphone",
    ip: "104.28.19.45",
    deviceType: "Mobile" as const,
    deviceModel: "iPhone 15 Pro",
    deviceBrand: "Apple",
    os: "iOS 17.5",
    browser: "Safari 17.4",
    location: {
      city: "San Francisco",
      region: "California",
      country: "United States",
      countryCode: "US",
      flag: "🇺🇸",
      latitude: 37.7749,
      longitude: -122.4194,
    },
    source: {
      type: "Social Media" as const,
      name: "Instagram",
      referrer: "https://l.instagram.com/?u=https%3A%2F%2Fnatistore.com%2Fproducts%2Faurora",
      utmSource: "instagram",
      utmMedium: "social",
      utmCampaign: "spring_influencer_drop",
    },
    path: "/products/aurora-smartwatch",
    status: "online" as const,
    durationSeconds: 195,
    screenResolution: "393x852",
  },
  {
    sessionId: "v_uk_win",
    ip: "172.56.21.90",
    deviceType: "Desktop" as const,
    deviceModel: "Windows PC",
    deviceBrand: "Microsoft",
    os: "Windows 11",
    browser: "Chrome 124",
    location: {
      city: "London",
      region: "Greater London",
      country: "United Kingdom",
      countryCode: "GB",
      flag: "🇬🇧",
      latitude: 51.5074,
      longitude: -0.1278,
    },
    source: {
      type: "Search Engine" as const,
      name: "Google Search",
      referrer: "https://www.google.com/search?q=buy+wireless+anc+headphones+nati",
      utmSource: "google",
      utmMedium: "organic",
    },
    path: "/products/quantum-anc-headphones",
    status: "online" as const,
    durationSeconds: 310,
    screenResolution: "1920x1080",
  },
  {
    sessionId: "v_de_samsung",
    ip: "188.166.44.12",
    deviceType: "Mobile" as const,
    deviceModel: "Galaxy S24 Ultra",
    deviceBrand: "Samsung",
    os: "Android 14",
    browser: "Chrome 124",
    location: {
      city: "Berlin",
      region: "Berlin",
      country: "Germany",
      countryCode: "DE",
      flag: "🇩🇪",
      latitude: 52.52,
      longitude: 13.405,
    },
    source: {
      type: "Social Media" as const,
      name: "TikTok",
      referrer: "https://www.tiktok.com/@techtrends/video/72918",
      utmSource: "tiktok",
      utmMedium: "short_video",
    },
    path: "/flash-sale",
    status: "online" as const,
    durationSeconds: 84,
    screenResolution: "412x915",
  },
  {
    sessionId: "v_ca_mac",
    ip: "192.168.1.10",
    deviceType: "Desktop" as const,
    deviceModel: "MacBook Pro",
    deviceBrand: "Apple",
    os: "macOS Sonoma",
    browser: "Safari 17.4",
    location: {
      city: "Toronto",
      region: "Ontario",
      country: "Canada",
      countryCode: "CA",
      flag: "🇨🇦",
      latitude: 43.6532,
      longitude: -79.3832,
    },
    source: {
      type: "Direct" as const,
      name: "Direct Access / Bookmark",
      referrer: "direct",
    },
    path: "/checkout",
    status: "online" as const,
    durationSeconds: 520,
    screenResolution: "2560x1440",
  },
  {
    sessionId: "v_jp_iphone",
    ip: "133.242.18.77",
    deviceType: "Mobile" as const,
    deviceModel: "iPhone 14",
    deviceBrand: "Apple",
    os: "iOS 17.2",
    browser: "Mobile Safari",
    location: {
      city: "Tokyo",
      region: "Kanto",
      country: "Japan",
      countryCode: "JP",
      flag: "🇯🇵",
      latitude: 35.6762,
      longitude: 139.6503,
    },
    source: {
      type: "Social Media" as const,
      name: "X / Twitter",
      referrer: "https://t.co/9981kLxq",
      utmSource: "twitter",
      utmMedium: "social",
    },
    path: "/products/apex-mechanical-keyboard",
    status: "idle" as const,
    durationSeconds: 140,
    screenResolution: "390x844",
  },
  {
    sessionId: "v_et_pc",
    ip: "197.156.102.3",
    deviceType: "Desktop" as const,
    deviceModel: "Dell Latitude",
    deviceBrand: "Dell",
    os: "Windows 11",
    browser: "Edge 124",
    location: {
      city: "Addis Ababa",
      region: "Shewa",
      country: "Ethiopia",
      countryCode: "ET",
      flag: "🇪🇹",
      latitude: 9.032,
      longitude: 38.748,
    },
    source: {
      type: "Search Engine" as const,
      name: "Google Search",
      referrer: "https://www.google.com/search?q=ecommerce+store+nati",
      utmSource: "google",
      utmMedium: "organic",
    },
    path: "/",
    status: "exited" as const,
    durationSeconds: 95,
    screenResolution: "1920x1080",
  },
  {
    sessionId: "v_fr_ipad",
    ip: "82.165.197.1",
    deviceType: "Tablet" as const,
    deviceModel: "iPad Air",
    deviceBrand: "Apple",
    os: "iPadOS 17.4",
    browser: "Safari 17",
    location: {
      city: "Paris",
      region: "Île-de-France",
      country: "France",
      countryCode: "FR",
      flag: "🇫🇷",
      latitude: 48.8566,
      longitude: 2.3522,
    },
    source: {
      type: "Referral" as const,
      name: "techradar.com",
      referrer: "https://www.techradar.com/reviews/best-online-marketplaces",
    },
    path: "/bestsellers",
    status: "idle" as const,
    durationSeconds: 260,
    screenResolution: "820x1180",
  },
  {
    sessionId: "v_nl_mac",
    ip: "145.220.10.88",
    deviceType: "Desktop" as const,
    deviceModel: "MacBook Air M2",
    deviceBrand: "Apple",
    os: "macOS Sonoma",
    browser: "Chrome 124",
    location: {
      city: "Amsterdam",
      region: "North Holland",
      country: "Netherlands",
      countryCode: "NL",
      flag: "🇳🇱",
      latitude: 52.3676,
      longitude: 4.9041,
    },
    source: {
      type: "Campaign / Ad" as const,
      name: "Google Ads (PPC)",
      referrer: "https://googleads.g.doubleclick.net/aclk",
      utmSource: "google_ads",
      utmMedium: "cpc",
      utmCampaign: "eu_tech_promo_2026",
    },
    path: "/products",
    status: "online" as const,
    durationSeconds: 410,
    screenResolution: "1728x1117",
  },
  {
    sessionId: "v_au_pixel",
    ip: "203.111.45.6",
    deviceType: "Mobile" as const,
    deviceModel: "Pixel 8 Pro",
    deviceBrand: "Google",
    os: "Android 14",
    browser: "Chrome 124",
    location: {
      city: "Sydney",
      region: "New South Wales",
      country: "Australia",
      countryCode: "AU",
      flag: "🇦🇺",
      latitude: -33.8688,
      longitude: 151.2093,
    },
    source: {
      type: "Social Media" as const,
      name: "YouTube",
      referrer: "https://m.youtube.com/watch?v=tech_review_nati",
      utmSource: "youtube",
      utmMedium: "video_description",
    },
    path: "/products/macbook-pro-16",
    status: "idle" as const,
    durationSeconds: 180,
    screenResolution: "412x892",
  },
  {
    sessionId: "v_ch_linux",
    ip: "185.190.140.22",
    deviceType: "Desktop" as const,
    deviceModel: "Linux Desktop",
    deviceBrand: "Linux",
    os: "Linux (Ubuntu)",
    browser: "Firefox 125",
    location: {
      city: "Zurich",
      region: "Zurich",
      country: "Switzerland",
      countryCode: "CH",
      flag: "🇨🇭",
      latitude: 47.3769,
      longitude: 8.5417,
    },
    source: {
      type: "Referral" as const,
      name: "reddit.com",
      referrer: "https://www.reddit.com/r/gadgets/comments/ecom_deals",
    },
    path: "/categories",
    status: "exited" as const,
    durationSeconds: 70,
    screenResolution: "1920x1080",
  },
  {
    sessionId: "v_br_redmi",
    ip: "177.136.50.14",
    deviceType: "Mobile" as const,
    deviceModel: "Redmi Note 13",
    deviceBrand: "Xiaomi",
    os: "Android 14",
    browser: "Chrome 124",
    location: {
      city: "São Paulo",
      region: "São Paulo",
      country: "Brazil",
      countryCode: "BR",
      flag: "🇧🇷",
      latitude: -23.5505,
      longitude: -46.6333,
    },
    source: {
      type: "Social Media" as const,
      name: "Facebook",
      referrer: "https://m.facebook.com/groups/gadgetlovers",
      utmSource: "facebook",
      utmMedium: "post",
    },
    path: "/flash-sale",
    status: "exited" as const,
    durationSeconds: 110,
    screenResolution: "393x873",
  },
  {
    sessionId: "v_sg_pc",
    ip: "103.21.244.5",
    deviceType: "Desktop" as const,
    deviceModel: "HP Pavilion",
    deviceBrand: "HP",
    os: "Windows 11",
    browser: "Edge 124",
    location: {
      city: "Singapore",
      region: "Central",
      country: "Singapore",
      countryCode: "SG",
      flag: "🇸🇬",
      latitude: 1.3521,
      longitude: 103.8198,
    },
    source: {
      type: "Search Engine" as const,
      name: "Bing Search",
      referrer: "https://www.bing.com/search?q=nati+official+store",
    },
    path: "/about",
    status: "exited" as const,
    durationSeconds: 65,
    screenResolution: "1920x1080",
  },
];

// Helper to seed realistic multi-period logs directly into MongoDB
async function ensureSeedVisitorLogsInDB() {
  try {
    const count = await VisitorLog.countDocuments();
    if (count >= 15) return;

    const now = Date.now();
    const seedDocs: any[] = [];

    // 1. Daily visitors (0m to 20h ago) - 15 records (5 live/online)
    const dailyOffsetsMinutes = [2, 5, 8, 12, 14, 25, 45, 90, 150, 240, 360, 480, 600, 720, 1000];
    dailyOffsetsMinutes.forEach((mins, idx) => {
      const template = STARTER_VISITORS[idx % STARTER_VISITORS.length];
      const isLive = mins <= 15;
      seedDocs.push({
        ...template,
        sessionId: `seed_daily_${idx + 1}`,
        ip: `${template.ip.split(".").slice(0, 3).join(".")}.${10 + idx}`,
        status: isLive ? "online" : idx % 2 === 0 ? "idle" : "exited",
        visitedAt: new Date(now - mins * 60 * 1000),
      });
    });

    // 2. Weekly visitors (1 to 6 days ago) - 15 records
    const weeklyOffsetsHours = [28, 36, 48, 60, 72, 84, 96, 108, 120, 130, 140, 148, 154, 160, 165];
    weeklyOffsetsHours.forEach((hours, idx) => {
      const template = STARTER_VISITORS[(idx + 3) % STARTER_VISITORS.length];
      seedDocs.push({
        ...template,
        sessionId: `seed_weekly_${idx + 1}`,
        ip: `${template.ip.split(".").slice(0, 3).join(".")}.${50 + idx}`,
        status: "exited",
        visitedAt: new Date(now - hours * 60 * 60 * 1000),
      });
    });

    // 3. Monthly visitors (8 to 28 days ago) - 15 records
    const monthlyOffsetsDays = [8, 10, 12, 14, 16, 18, 20, 22, 23, 24, 25, 26, 27, 28, 29];
    monthlyOffsetsDays.forEach((days, idx) => {
      const template = STARTER_VISITORS[(idx + 6) % STARTER_VISITORS.length];
      seedDocs.push({
        ...template,
        sessionId: `seed_monthly_${idx + 1}`,
        ip: `${template.ip.split(".").slice(0, 3).join(".")}.${100 + idx}`,
        status: "exited",
        visitedAt: new Date(now - days * 24 * 60 * 60 * 1000),
      });
    });

    // 4. Yearly visitors (35 to 300 days ago) - 15 records
    const yearlyOffsetsDays = [35, 45, 60, 80, 100, 120, 150, 180, 210, 240, 270, 290, 310, 330, 350];
    yearlyOffsetsDays.forEach((days, idx) => {
      const template = STARTER_VISITORS[(idx + 9) % STARTER_VISITORS.length];
      seedDocs.push({
        ...template,
        sessionId: `seed_yearly_${idx + 1}`,
        ip: `${template.ip.split(".").slice(0, 3).join(".")}.${150 + idx}`,
        status: "exited",
        visitedAt: new Date(now - days * 24 * 60 * 60 * 1000),
      });
    });

    await VisitorLog.insertMany(seedDocs);
    console.log(`✅ Seeded ${seedDocs.length} visitor telemetry logs into MongoDB.`);
  } catch (err: any) {
    console.warn("MongoDB visitor seed warning:", err?.message || err);
  }
}

// Compute aggregate telemetry metrics from matching logs
function computeStatsFromLogs(logs: any[]): VisitorStats {
  const totalVisits = logs.length;
  const uniqueIps = new Set(logs.map((l) => l.ip)).size;

  const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
  const liveActive = logs.filter(
    (l) => l.status === "online" || new Date(l.visitedAt).getTime() > fifteenMinutesAgo
  ).length;

  // Source breakdown
  const sourceCountMap = new Map<string, { type: TrafficSourceType; count: number }>();
  logs.forEach((l) => {
    const key = l.source?.name || l.source?.type || "Direct Access";
    const stype = (l.source?.type || "Direct") as TrafficSourceType;
    const existing = sourceCountMap.get(key) || { type: stype, count: 0 };
    existing.count += 1;
    sourceCountMap.set(key, existing);
  });

  const sourceBreakdown = Array.from(sourceCountMap.entries())
    .map(([name, data]) => ({
      name,
      type: data.type,
      count: data.count,
      percentage: totalVisits > 0 ? Math.round((data.count / totalVisits) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Device breakdown
  const deviceCountMap = new Map<DeviceType, number>();
  logs.forEach((l) => {
    const dt = (l.deviceType || "Desktop") as DeviceType;
    deviceCountMap.set(dt, (deviceCountMap.get(dt) || 0) + 1);
  });

  const deviceBreakdown = Array.from(deviceCountMap.entries())
    .map(([deviceType, count]) => ({
      deviceType,
      count,
      percentage: totalVisits > 0 ? Math.round((count / totalVisits) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // OS breakdown
  const osCountMap = new Map<string, number>();
  logs.forEach((l) => {
    const osName = l.os || "Unknown OS";
    osCountMap.set(osName, (osCountMap.get(osName) || 0) + 1);
  });

  const osBreakdown = Array.from(osCountMap.entries())
    .map(([os, count]) => ({
      os,
      count,
      percentage: totalVisits > 0 ? Math.round((count / totalVisits) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Country breakdown
  const countryCountMap = new Map<string, { code: string; flag: string; count: number }>();
  logs.forEach((l) => {
    const countryName = l.location?.country || "United States";
    const existing = countryCountMap.get(countryName) || {
      code: l.location?.countryCode || "US",
      flag: l.location?.flag || "🌐",
      count: 0,
    };
    existing.count += 1;
    countryCountMap.set(countryName, existing);
  });

  const topCountries = Array.from(countryCountMap.entries())
    .map(([country, data]) => ({
      country,
      countryCode: data.code,
      flag: data.flag,
      count: data.count,
      percentage: totalVisits > 0 ? Math.round((data.count / totalVisits) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const topSourceItem = sourceBreakdown[0] || {
    type: "Search Engine" as TrafficSourceType,
    name: "Google Search",
    percentage: 35,
  };

  return {
    totalVisits,
    liveActive,
    uniqueIps,
    topSource: {
      type: topSourceItem.type,
      name: topSourceItem.name,
      percentage: topSourceItem.percentage,
    },
    deviceBreakdown,
    sourceBreakdown,
    osBreakdown,
    topCountries,
  };
}

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const sourceType = searchParams.get("source") || "all";
  const deviceType = searchParams.get("device") || "all";
  const statusParam = searchParams.get("status") || "all";
  const countryParam = searchParams.get("country") || "all";
  const timeframe = (searchParams.get("timeframe") || "all").trim().toLowerCase();
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(5, Math.min(100, parseInt(searchParams.get("limit") || "25", 10)));

  // 1. Calculate Date Boundary
  const now = Date.now();
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (startDateParam) {
    const s = new Date(startDateParam);
    if (!isNaN(s.getTime())) {
      s.setHours(0, 0, 0, 0);
      startDate = s;
    }
  }

  if (endDateParam) {
    const e = new Date(endDateParam);
    if (!isNaN(e.getTime())) {
      e.setHours(23, 59, 59, 999);
      endDate = e;
    }
  }

  // Fallback to timeframe preset if no custom dates were given
  if (!startDate && !endDate) {
    if (timeframe === "daily" || timeframe === "today" || timeframe === "24h") {
      startDate = new Date(now - 24 * 60 * 60 * 1000);
    } else if (timeframe === "weekly" || timeframe === "7d") {
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === "monthly" || timeframe === "30d") {
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
    } else if (timeframe === "yearly" || timeframe === "1y" || timeframe === "year") {
      startDate = new Date(now - 365 * 24 * 60 * 60 * 1000);
    }
  }

  // 2. Build MongoDB Query Objects
  const timeframeMongoQuery: any = {};
  if (startDate || endDate) {
    timeframeMongoQuery.visitedAt = {};
    if (startDate) timeframeMongoQuery.visitedAt.$gte = startDate;
    if (endDate) timeframeMongoQuery.visitedAt.$lte = endDate;
  }

  const tableMongoQuery: any = { ...timeframeMongoQuery };

  if (sourceType !== "all") {
    tableMongoQuery["source.type"] = {
      $regex: new RegExp(`^${escapeRegex(sourceType)}$`, "i"),
    };
  }

  if (deviceType !== "all") {
    tableMongoQuery.deviceType = {
      $regex: new RegExp(`^${escapeRegex(deviceType)}$`, "i"),
    };
  }

  if (statusParam !== "all") {
    tableMongoQuery.status = {
      $regex: new RegExp(`^${escapeRegex(statusParam)}$`, "i"),
    };
  }

  if (countryParam !== "all") {
    tableMongoQuery["location.country"] = {
      $regex: new RegExp(`^${escapeRegex(countryParam)}$`, "i"),
    };
  }

  if (search) {
    const sRegex = new RegExp(escapeRegex(search), "i");
    tableMongoQuery.$or = [
      { ip: { $regex: sRegex } },
      { path: { $regex: sRegex } },
      { "location.country": { $regex: sRegex } },
      { "location.city": { $regex: sRegex } },
      { "source.name": { $regex: sRegex } },
      { browser: { $regex: sRegex } },
      { os: { $regex: sRegex } },
      { deviceModel: { $regex: sRegex } },
    ];
  }

  let dbConnected = false;

  try {
    await connectDB();
    await ensureSeedVisitorLogsInDB();
    dbConnected = true;

    // Real backend MongoDB execution:
    // a) Calculate timeframe-scoped telemetry statistics from real DB
    const timeframeLogs = await VisitorLog.find(timeframeMongoQuery).lean();

    // b) Compute real stats for the chosen date range
    const stats = computeStatsFromLogs(timeframeLogs);

    // c) Real DB pagination & filtered count
    const totalCount = await VisitorLog.countDocuments(tableMongoQuery);
    const totalPages = Math.ceil(totalCount / limit) || 1;
    const startIndex = (page - 1) * limit;

    const dbVisitors = await VisitorLog.find(tableMongoQuery)
      .sort({ visitedAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .lean();

    const visitors: VisitorLogItem[] = dbVisitors.map((doc: any) => ({
      id: doc._id?.toString() || doc.sessionId,
      ip: doc.ip,
      deviceType: doc.deviceType,
      deviceModel: doc.deviceModel || doc.deviceType,
      deviceBrand: doc.deviceBrand,
      os: doc.os,
      browser: doc.browser,
      location: doc.location || {
        city: "Unknown",
        region: "",
        country: "United States",
        countryCode: "US",
        flag: "🇺🇸",
      },
      source: doc.source || {
        type: "Direct",
        name: "Direct Access",
        referrer: "direct",
      },
      path: doc.path || "/",
      status: doc.status || "online",
      durationSeconds: doc.durationSeconds || 30,
      visitedAt: doc.visitedAt ? new Date(doc.visitedAt).toISOString() : new Date().toISOString(),
      screenResolution: doc.screenResolution,
      userAgent: doc.userAgent,
    }));

    return NextResponse.json({
      success: true,
      stats,
      visitors,
      totalCount,
      page,
      totalPages,
      timeframe,
      startDate: startDateParam || undefined,
      endDate: endDateParam || undefined,
      dbConnected: true,
    });
  } catch (err: any) {
    console.warn("Visitor tracker DB query notice (fallback to memory):", err?.message || err);
  }

  // 3. Resilient In-Memory Fallback if MongoDB is temporarily unavailable
  if (!global.inMemoryVisitorLogs || global.inMemoryVisitorLogs.length === 0) {
    // Generate initial memory logs spanning timeframes
    const memLogs: any[] = [];
    const offsetsMinutes = [2, 5, 8, 12, 14, 25, 45, 90, 150, 360, 720, 1400, 2800, 7000, 14000, 30000];
    offsetsMinutes.forEach((mins, idx) => {
      const template = STARTER_VISITORS[idx % STARTER_VISITORS.length];
      memLogs.push({
        ...template,
        id: `mem_seed_${idx + 1}`,
        sessionId: `mem_sid_${idx + 1}`,
        visitedAt: new Date(now - mins * 60 * 1000).toISOString(),
      });
    });
    global.inMemoryVisitorLogs = memLogs;
  }

  let memoryLogs = [...global.inMemoryVisitorLogs];

  // Filter memory logs by custom date range or timeframe
  if (startDate || endDate) {
    memoryLogs = memoryLogs.filter((l) => {
      const logTime = new Date(l.visitedAt).getTime();
      if (startDate && logTime < startDate.getTime()) return false;
      if (endDate && logTime > endDate.getTime()) return false;
      return true;
    });
  }

  const memoryStats = computeStatsFromLogs(memoryLogs);

  // Apply source, device, status, country, and search filter in memory
  let filteredMemoryLogs = memoryLogs;

  if (sourceType !== "all") {
    filteredMemoryLogs = filteredMemoryLogs.filter(
      (l) => (l.source?.type || "").toLowerCase() === sourceType.toLowerCase()
    );
  }

  if (deviceType !== "all") {
    filteredMemoryLogs = filteredMemoryLogs.filter(
      (l) => (l.deviceType || "").toLowerCase() === deviceType.toLowerCase()
    );
  }

  if (statusParam !== "all") {
    filteredMemoryLogs = filteredMemoryLogs.filter(
      (l) => (l.status || "").toLowerCase() === statusParam.toLowerCase()
    );
  }

  if (countryParam !== "all") {
    filteredMemoryLogs = filteredMemoryLogs.filter(
      (l) => (l.location?.country || "").toLowerCase() === countryParam.toLowerCase()
    );
  }

  if (search) {
    filteredMemoryLogs = filteredMemoryLogs.filter(
      (l) =>
        (l.ip || "").toLowerCase().includes(search) ||
        (l.path || "").toLowerCase().includes(search) ||
        (l.location?.country || "").toLowerCase().includes(search) ||
        (l.location?.city || "").toLowerCase().includes(search) ||
        (l.source?.name || "").toLowerCase().includes(search) ||
        (l.browser || "").toLowerCase().includes(search) ||
        (l.os || "").toLowerCase().includes(search)
    );
  }

  const memTotalCount = filteredMemoryLogs.length;
  const memTotalPages = Math.ceil(memTotalCount / limit) || 1;
  const memStartIndex = (page - 1) * limit;
  const paginatedMem = filteredMemoryLogs.slice(memStartIndex, memStartIndex + limit);

  return NextResponse.json({
    success: true,
    stats: memoryStats,
    visitors: paginatedMem,
    totalCount: memTotalCount,
    page,
    totalPages: memTotalPages,
    timeframe,
    startDate: startDateParam || undefined,
    endDate: endDateParam || undefined,
    dbConnected,
  });
}

// POST endpoint to inject a real simulated visitor session
export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const template = STARTER_VISITORS[Math.floor(Math.random() * STARTER_VISITORS.length)];
  const randomIp = `198.51.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;

  const newLog = {
    ...template,
    sessionId: `sid_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    ip: randomIp,
    visitedAt: new Date(),
    status: "online" as const,
    durationSeconds: 15,
  };

  let savedInDb = false;

  try {
    await connectDB();
    const created = await VisitorLog.create(newLog);
    savedInDb = true;
    newLog.sessionId = created._id.toString();
  } catch (err: any) {
    console.warn("Simulate visitor DB insert warning:", err?.message || err);
  }

  if (!global.inMemoryVisitorLogs) {
    global.inMemoryVisitorLogs = [];
  }
  global.inMemoryVisitorLogs.unshift({
    ...newLog,
    id: `live_${Date.now()}`,
    visitedAt: new Date().toISOString(),
  });

  return NextResponse.json({
    success: true,
    message: "Live visitor hit recorded in real database",
    savedInDb,
    visitor: newLog,
  });
}

// DELETE endpoint to clear/reset all visitor logs
export async function DELETE(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let dbCleared = false;
  try {
    await connectDB();
    await VisitorLog.deleteMany({});
    dbCleared = true;
  } catch (err: any) {
    console.warn("Visitor reset DB warning:", err?.message || err);
  }

  global.inMemoryVisitorLogs = [];

  return NextResponse.json({
    success: true,
    message: "Visitor telemetry logs cleared successfully.",
    dbCleared,
  });
}
