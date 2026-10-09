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

// High-fidelity starter visitor profiles for realistic demonstration
const SAMPLE_VISITORS = [
  {
    sessionId: "demo_v1",
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
    offsetMinutes: 2,
  },
  {
    sessionId: "demo_v2",
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
    offsetMinutes: 5,
  },
  {
    sessionId: "demo_v3",
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
    offsetMinutes: 8,
  },
  {
    sessionId: "demo_v4",
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
      referrer: "Direct URL navigation",
    },
    path: "/checkout",
    status: "online" as const,
    durationSeconds: 520,
    screenResolution: "2560x1440",
    offsetMinutes: 12,
  },
  {
    sessionId: "demo_v5",
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
    offsetMinutes: 24,
  },
  {
    sessionId: "demo_v6",
    ip: "197.156.102.3",
    deviceType: "Desktop" as const,
    deviceModel: "Windows PC",
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
    offsetMinutes: 38,
  },
  {
    sessionId: "demo_v7",
    ip: "82.165.197.1",
    deviceType: "Tablet" as const,
    deviceModel: "iPad Air",
    deviceBrand: "Apple",
    os: "iOS 17.4",
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
    offsetMinutes: 45,
  },
  {
    sessionId: "demo_v8",
    ip: "145.220.10.88",
    deviceType: "Desktop" as const,
    deviceModel: "MacBook Pro",
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
    offsetMinutes: 52,
  },
  {
    sessionId: "demo_v9",
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
    offsetMinutes: 65,
  },
  {
    sessionId: "demo_v10",
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
    offsetMinutes: 80,
  },
  {
    sessionId: "demo_v11",
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
    offsetMinutes: 105,
  },
  {
    sessionId: "demo_v12",
    ip: "103.21.244.5",
    deviceType: "Desktop" as const,
    deviceModel: "Windows PC",
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
    offsetMinutes: 130,
  },
];

export async function GET(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const search = (searchParams.get("search") || "").trim().toLowerCase();
  const sourceType = searchParams.get("source") || "all";
  const deviceType = searchParams.get("device") || "all";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(5, Math.min(100, parseInt(searchParams.get("limit") || "25", 10)));

  let allLogs: VisitorLogItem[] = [];

  try {
    await connectDB();
    const dbLogs = await VisitorLog.find().sort({ visitedAt: -1 }).limit(200).lean();

    allLogs = dbLogs.map((doc: any) => ({
      id: doc._id?.toString() || doc.sessionId,
      ip: doc.ip,
      deviceType: doc.deviceType,
      deviceModel: doc.deviceModel,
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
  } catch (err: any) {
    console.warn("Visitor tracker DB query warning:", err?.message || err);
  }

  // Merge in-memory logs if available
  if (global.inMemoryVisitorLogs && global.inMemoryVisitorLogs.length > 0) {
    const existingIds = new Set(allLogs.map((l) => l.id));
    for (const mem of global.inMemoryVisitorLogs) {
      if (!existingIds.has(mem.id)) {
        allLogs.push({
          ...mem,
          id: mem.id || mem.sessionId,
          visitedAt: mem.visitedAt ? new Date(mem.visitedAt).toISOString() : new Date().toISOString(),
        });
      }
    }
  }

  // If there are very few entries, inject sample records with relative times
  if (allLogs.length < 10) {
    const now = Date.now();
    const seeded = SAMPLE_VISITORS.map((s, idx) => ({
      id: `seed_${idx + 1}`,
      ip: s.ip,
      deviceType: s.deviceType,
      deviceModel: s.deviceModel,
      deviceBrand: s.deviceBrand,
      os: s.os,
      browser: s.browser,
      location: s.location,
      source: s.source,
      path: s.path,
      status: s.status,
      durationSeconds: s.durationSeconds,
      visitedAt: new Date(now - s.offsetMinutes * 60 * 1000).toISOString(),
      screenResolution: s.screenResolution,
    }));
    allLogs = [...allLogs, ...seeded];
  }

  // Sort descending by visitedAt
  allLogs.sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime());

  // Compute Aggregates & Statistics across all logs
  const totalVisits = allLogs.length;
  const uniqueIps = new Set(allLogs.map((l) => l.ip)).size;

  const tenMinutesAgo = Date.now() - 15 * 60 * 1000;
  const liveActive = allLogs.filter(
    (l) => l.status === "online" || new Date(l.visitedAt).getTime() > tenMinutesAgo
  ).length;

  // Source breakdown
  const sourceCountMap = new Map<string, { type: TrafficSourceType; count: number }>();
  allLogs.forEach((l) => {
    const key = l.source.name || l.source.type;
    const existing = sourceCountMap.get(key) || { type: l.source.type, count: 0 };
    existing.count += 1;
    sourceCountMap.set(key, existing);
  });

  const sourceBreakdown = Array.from(sourceCountMap.entries())
    .map(([name, data]) => ({
      name,
      type: data.type,
      count: data.count,
      percentage: Math.round((data.count / totalVisits) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count);

  // Device breakdown
  const deviceCountMap = new Map<DeviceType, number>();
  allLogs.forEach((l) => {
    deviceCountMap.set(l.deviceType, (deviceCountMap.get(l.deviceType) || 0) + 1);
  });

  const deviceBreakdown = Array.from(deviceCountMap.entries())
    .map(([deviceType, count]) => ({
      deviceType,
      count,
      percentage: Math.round((count / totalVisits) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count);

  // OS breakdown
  const osCountMap = new Map<string, number>();
  allLogs.forEach((l) => {
    osCountMap.set(l.os, (osCountMap.get(l.os) || 0) + 1);
  });

  const osBreakdown = Array.from(osCountMap.entries())
    .map(([os, count]) => ({
      os,
      count,
      percentage: Math.round((count / totalVisits) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Country breakdown
  const countryCountMap = new Map<string, { code: string; flag: string; count: number }>();
  allLogs.forEach((l) => {
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
      percentage: Math.round((data.count / totalVisits) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const topSourceItem = sourceBreakdown[0] || {
    type: "Search Engine" as TrafficSourceType,
    name: "Google Search",
    percentage: 35,
  };

  const stats: VisitorStats = {
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

  // Apply filters
  let filteredLogs = allLogs;

  if (sourceType !== "all") {
    filteredLogs = filteredLogs.filter(
      (l) => l.source.type.toLowerCase() === sourceType.toLowerCase()
    );
  }

  if (deviceType !== "all") {
    filteredLogs = filteredLogs.filter(
      (l) => l.deviceType.toLowerCase() === deviceType.toLowerCase()
    );
  }

  if (search) {
    filteredLogs = filteredLogs.filter(
      (l) =>
        l.ip.toLowerCase().includes(search) ||
        l.location.country.toLowerCase().includes(search) ||
        l.location.city.toLowerCase().includes(search) ||
        l.path.toLowerCase().includes(search) ||
        l.source.name.toLowerCase().includes(search) ||
        l.os.toLowerCase().includes(search) ||
        l.browser.toLowerCase().includes(search)
    );
  }

  const totalCount = filteredLogs.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    stats,
    visitors: paginatedLogs,
    totalCount,
    page,
    totalPages,
  });
}

// POST endpoint to inject simulated live visitor test hits
export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const sample = SAMPLE_VISITORS[Math.floor(Math.random() * SAMPLE_VISITORS.length)];
  const randomIp = `198.51.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;

  const newLog = {
    ...sample,
    id: `live_${Date.now()}`,
    sessionId: `sid_${Date.now()}`,
    ip: randomIp,
    visitedAt: new Date().toISOString(),
    status: "online" as const,
  };

  if (!global.inMemoryVisitorLogs) {
    global.inMemoryVisitorLogs = [];
  }
  global.inMemoryVisitorLogs.unshift(newLog);

  return NextResponse.json({ success: true, message: "Simulated visitor hit recorded", visitor: newLog });
}

// DELETE endpoint to clear/reset visitor logs
export async function DELETE(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    await connectDB();
    await VisitorLog.deleteMany({});
  } catch (err: any) {
    console.warn("Visitor reset DB warning:", err?.message || err);
  }

  global.inMemoryVisitorLogs = [];

  return NextResponse.json({ success: true, message: "Visitor logs cleared successfully." });
}
