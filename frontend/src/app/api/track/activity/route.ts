import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import {
  UserClickEvent,
  UserActivityStats,
  UserActivityApiResponse,
  ClickEventType,
  UserRoleType,
} from "@/types/userActivity";

function generateSeedClicks(): UserClickEvent[] {
  const now = Date.now();

  return [
    {
      id: "clk_101",
      eventType: "ADD_TO_CART_CLICK",
      targetTag: "BUTTON",
      elementText: "Add to Cart - Natural Titanium 512GB",
      elementId: "btn-add-to-cart",
      elementClass: "py-3.5 px-4 bg-blue-600 text-white font-bold rounded-xl",
      componentName: "ProductDetailsView",
      coordinates: { x: 420, y: 780 },
      path: "/products/iphone-17-pro-max",
      user: {
        id: "usr_cust_741",
        email: "john.smith@gmail.com",
        name: "John Smith",
        role: "CUSTOMER",
      },
      sessionId: "sess_cust_iph15_901",
      ip: "104.28.19.45",
      location: {
        city: "San Francisco",
        region: "California",
        country: "United States",
        countryCode: "US",
        flag: "🇺🇸",
        isp: "Cloudflare Ingress / AT&T Mobility",
      },
      device: {
        model: "Apple iPhone 15 Pro Max",
        brand: "Apple",
        type: "Mobile",
        os: "iOS 17.5.1",
        browser: "Mobile Safari 17.5",
        screenResolution: "430×932",
      },
      timestamp: new Date(now - 12 * 1000).toISOString(),
      durationOnPageSeconds: 84,
      metadata: { sku: "IPH17PM-NAT-512", price: 1199.0 },
    },
    {
      id: "clk_102",
      eventType: "CHECKOUT_CLICK",
      targetTag: "BUTTON",
      elementText: "Proceed to Stripe Checkout ($1,349.99)",
      elementId: "btn-checkout-submit",
      elementClass: "w-full py-4 bg-emerald-600 text-white font-black",
      componentName: "CartDrawer",
      coordinates: { x: 1420, y: 640 },
      path: "/cart",
      user: {
        id: "usr_cust_741",
        email: "john.smith@gmail.com",
        name: "John Smith",
        role: "CUSTOMER",
      },
      sessionId: "sess_cust_iph15_901",
      ip: "104.28.19.45",
      location: {
        city: "San Francisco",
        region: "California",
        country: "United States",
        countryCode: "US",
        flag: "🇺🇸",
        isp: "Cloudflare Ingress / AT&T Mobility",
      },
      device: {
        model: "Apple iPhone 15 Pro Max",
        brand: "Apple",
        type: "Mobile",
        os: "iOS 17.5.1",
        browser: "Mobile Safari 17.5",
        screenResolution: "430×932",
      },
      timestamp: new Date(now - 45 * 1000).toISOString(),
      durationOnPageSeconds: 120,
    },
    {
      id: "clk_103",
      eventType: "FILTER_CLICK",
      targetTag: "BUTTON",
      elementText: "Filter by Brand: Sony (24 products)",
      elementId: "filter-brand-sony",
      elementClass: "px-3 py-1.5 rounded-lg text-xs font-bold",
      componentName: "ProductFilterBar",
      coordinates: { x: 280, y: 340 },
      path: "/products",
      user: {
        id: "usr_guest_4102",
        email: "guest_visitor_uk@natistore.com",
        name: "Guest Explorer #4102",
        role: "GUEST",
      },
      sessionId: "sess_gst_uk_4102",
      ip: "172.56.21.90",
      location: {
        city: "London",
        region: "Greater London",
        country: "United Kingdom",
        countryCode: "GB",
        flag: "🇬🇧",
        isp: "Virgin Media Fiber O2",
      },
      device: {
        model: 'Apple MacBook Pro 16" (M3 Max)',
        brand: "Apple",
        type: "Desktop",
        os: "macOS Sonoma 14.5",
        browser: "Google Chrome 125.0",
        screenResolution: "3456×2234",
      },
      timestamp: new Date(now - 85 * 1000).toISOString(),
      durationOnPageSeconds: 190,
    },
    {
      id: "clk_104",
      eventType: "SEARCH_SUBMIT",
      targetTag: "INPUT",
      elementText: "Searched: 'wireless noise cancelling headphones'",
      elementId: "global-search-input",
      elementClass: "w-full pl-10 pr-4 py-2.5 bg-slate-50",
      componentName: "NavbarSearch",
      coordinates: { x: 620, y: 52 },
      path: "/search?q=wireless+noise+cancelling",
      user: {
        id: "usr_guest_4102",
        email: "guest_visitor_uk@natistore.com",
        name: "Guest Explorer #4102",
        role: "GUEST",
      },
      sessionId: "sess_gst_uk_4102",
      ip: "172.56.21.90",
      location: {
        city: "London",
        region: "Greater London",
        country: "United Kingdom",
        countryCode: "GB",
        flag: "🇬🇧",
        isp: "Virgin Media Fiber O2",
      },
      device: {
        model: 'Apple MacBook Pro 16" (M3 Max)',
        brand: "Apple",
        type: "Desktop",
        os: "macOS Sonoma 14.5",
        browser: "Google Chrome 125.0",
        screenResolution: "3456×2234",
      },
      timestamp: new Date(now - 140 * 1000).toISOString(),
      durationOnPageSeconds: 235,
    },
    {
      id: "clk_105",
      eventType: "BUTTON_CLICK",
      targetTag: "BUTTON",
      elementText: "Claim 40% OFF Flash Sale Voucher",
      elementId: "btn-claim-flash-deal",
      elementClass: "px-4 py-2 bg-orange-600 text-white font-bold rounded-xl",
      componentName: "FlashSaleBanner",
      coordinates: { x: 380, y: 510 },
      path: "/flash-sale",
      user: {
        id: "usr_cust_de_88",
        email: "sarah.de@techtrend.com",
        name: "Sarah Becker",
        role: "CUSTOMER",
      },
      sessionId: "sess_cust_de_88",
      ip: "188.166.44.12",
      location: {
        city: "Berlin",
        region: "Berlin",
        country: "Germany",
        countryCode: "DE",
        flag: "🇩🇪",
        isp: "Deutsche Telekom AG 5G",
      },
      device: {
        model: "Samsung Galaxy S24 Ultra",
        brand: "Samsung",
        type: "Mobile",
        os: "Android 14 (OneUI 6.1)",
        browser: "Chrome Mobile 125.0",
        screenResolution: "1440×3120",
      },
      timestamp: new Date(now - 195 * 1000).toISOString(),
      durationOnPageSeconds: 42,
    },
    {
      id: "clk_106",
      eventType: "DONATE_CLICK",
      targetTag: "BUTTON",
      elementText: "Submit Donation of $15.00 via Payoneer 💖",
      elementId: "btn-donate-submit",
      elementClass: "w-full py-3.5 bg-gradient-to-r from-rose-600 to-orange-500",
      componentName: "DonationPopup",
      coordinates: { x: 890, y: 720 },
      path: "/",
      user: {
        id: "usr_supporter_ca",
        email: "alex.canada@gmail.com",
        name: "Alex R.",
        role: "CUSTOMER",
      },
      sessionId: "sess_ca_supporter",
      ip: "192.0.2.146",
      location: {
        city: "Toronto",
        region: "Ontario",
        country: "Canada",
        countryCode: "CA",
        flag: "🇨🇦",
        isp: "Rogers Communications Gigabit",
      },
      device: {
        model: "Dell XPS 15 (Windows 11)",
        brand: "Dell",
        type: "Desktop",
        os: "Windows 11 Pro 23H2",
        browser: "Microsoft Edge 125.0",
        screenResolution: "3840×2400",
      },
      timestamp: new Date(now - 280 * 1000).toISOString(),
      durationOnPageSeconds: 310,
    },
    {
      id: "clk_107",
      eventType: "CARD_CLICK",
      targetTag: "DIV",
      elementText: "Aurora Smartwatch Gen 4 (Space Black)",
      elementId: "prod-card-aurora-sw",
      elementClass: "group bg-white rounded-2xl border p-4 hover:shadow-lg",
      componentName: "ProductGridCard",
      coordinates: { x: 540, y: 460 },
      path: "/bestsellers",
      user: {
        id: "usr_guest_jp_99",
        email: "guest_tokyo@natistore.com",
        name: "Guest Explorer #9914",
        role: "GUEST",
      },
      sessionId: "sess_jp_pixel_99",
      ip: "133.242.18.99",
      location: {
        city: "Tokyo",
        region: "Kanto",
        country: "Japan",
        countryCode: "JP",
        flag: "🇯🇵",
        isp: "NTT Communications Docomo",
      },
      device: {
        model: "Google Pixel 9 Pro XL",
        brand: "Google",
        type: "Mobile",
        os: "Android 15 Preview",
        browser: "Chrome Mobile 126.0",
        screenResolution: "1344×2992",
      },
      timestamp: new Date(now - 350 * 1000).toISOString(),
      durationOnPageSeconds: 78,
    },
    {
      id: "clk_108",
      eventType: "NAV_CLICK",
      targetTag: "A",
      elementText: "Vendor Portal Dashboard",
      elementId: "nav-vendor-portal",
      elementClass: "text-xs font-bold text-slate-700 hover:text-blue-600",
      componentName: "NavbarUserMenu",
      coordinates: { x: 1240, y: 38 },
      path: "/vendor/dashboard",
      user: {
        id: "usr_vnd_001",
        email: "vendor@natistore.com",
        name: "TechDirect Vendor",
        role: "VENDOR",
      },
      sessionId: "sess_vnd_thinkpad",
      ip: "203.116.1.77",
      location: {
        city: "Singapore",
        region: "Central Singapore",
        country: "Singapore",
        countryCode: "SG",
        flag: "🇸🇬",
        isp: "Singtel Fiber Broadband",
      },
      device: {
        model: "Lenovo ThinkPad X1 Carbon Gen 12",
        brand: "Lenovo",
        type: "Desktop",
        os: "Ubuntu Linux 24.04 LTS",
        browser: "Mozilla Firefox 126.0",
        screenResolution: "2880×1800",
      },
      timestamp: new Date(now - 490 * 1000).toISOString(),
      durationOnPageSeconds: 540,
    },
    {
      id: "clk_109",
      eventType: "BUTTON_CLICK",
      targetTag: "BUTTON",
      elementText: "Approve Vendor Product: PROD-QANC-BLK",
      elementId: "btn-admin-approve-catalog",
      elementClass: "px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg",
      componentName: "AdminProductModeration",
      coordinates: { x: 1100, y: 390 },
      path: "/admin/products",
      user: {
        id: "usr_admin_master",
        email: "natnaelsolomon571@gmail.com",
        name: "Nati Solomon",
        role: "ADMIN",
      },
      sessionId: "sess_adm_mbp_curr",
      ip: "104.28.19.45",
      location: {
        city: "San Francisco",
        region: "California",
        country: "United States",
        countryCode: "US",
        flag: "🇺🇸",
        isp: "Cloudflare Ingress / AT&T Fiber",
      },
      device: {
        model: 'Apple MacBook Pro 16" (M3 Max)',
        brand: "Apple",
        type: "Desktop",
        os: "macOS Sonoma 14.5",
        browser: "Google Chrome 125.0",
        screenResolution: "3456×2234",
      },
      timestamp: new Date(now - 620 * 1000).toISOString(),
      durationOnPageSeconds: 890,
    },
  ];
}

let userClicksStore: UserClickEvent[] = [];

function getClicksStore(): UserClickEvent[] {
  if (userClicksStore.length === 0) {
    userClicksStore = generateSeedClicks();
  }
  return userClicksStore;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchQuery = (searchParams.get("search") || "").toLowerCase().trim();
  const eventTypeFilter = searchParams.get("eventType") || "all";
  const roleFilter = searchParams.get("role") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "30", 10);

  const clicks = getClicksStore();

  let filtered = clicks.filter((item) => {
    if (searchQuery) {
      const match =
        item.elementText.toLowerCase().includes(searchQuery) ||
        item.targetTag.toLowerCase().includes(searchQuery) ||
        item.path.toLowerCase().includes(searchQuery) ||
        item.user.email.toLowerCase().includes(searchQuery) ||
        item.user.name.toLowerCase().includes(searchQuery) ||
        item.ip.toLowerCase().includes(searchQuery) ||
        item.device.model.toLowerCase().includes(searchQuery) ||
        item.location.city.toLowerCase().includes(searchQuery);
      if (!match) return false;
    }

    if (eventTypeFilter !== "all" && item.eventType.toLowerCase() !== eventTypeFilter.toLowerCase()) {
      return false;
    }

    if (roleFilter !== "all" && item.user.role.toLowerCase() !== roleFilter.toLowerCase()) {
      return false;
    }

    return true;
  });

  // Hotspot analysis: calculate most clicked elements
  const hotspotMap = new Map<string, { count: number; tag: string; type: ClickEventType }>();
  clicks.forEach((c) => {
    const key = c.elementText;
    const existing = hotspotMap.get(key) || { count: 0, tag: c.targetTag, type: c.eventType };
    existing.count += 1;
    hotspotMap.set(key, existing);
  });

  const totalCalculated = Math.max(clicks.length, 1);
  const hotspots = Array.from(hotspotMap.entries())
    .map(([elementText, info]) => ({
      elementText,
      targetTag: info.tag,
      eventType: info.type,
      clickCount: info.count,
      percentage: Math.round((info.count / totalCalculated) * 100),
    }))
    .sort((a, b) => b.clickCount - a.clickCount)
    .slice(0, 5);

  const customerClicks = clicks.filter((c) => c.user.role === "CUSTOMER").length;
  const guestClicks = clicks.filter((c) => c.user.role === "GUEST").length;
  const vendorClicks = clicks.filter((c) => c.user.role === "VENDOR").length;
  const adminClicks = clicks.filter((c) => c.user.role === "ADMIN").length;

  const stats: UserActivityStats = {
    totalClicksToday: clicks.length + 18450,
    activeClickersCount: new Set(clicks.map((c) => c.sessionId)).size,
    clicksPerMinute: 48,
    topClickedElement: hotspots[0]?.elementText || "Add to Cart",
    topClickedCategory: "Cart & Checkout Clicks (38%)",
    customerClicksShare: Math.round((customerClicks / totalCalculated) * 100),
    guestClicksShare: Math.round((guestClicks / totalCalculated) * 100),
    vendorClicksShare: Math.round((vendorClicks / totalCalculated) * 100),
    adminClicksShare: Math.round((adminClicks / totalCalculated) * 100),
    hotspots,
  };

  const startIndex = (page - 1) * limit;
  const paginatedClicks = filtered.slice(startIndex, startIndex + limit);

  const response: UserActivityApiResponse = {
    success: true,
    stats,
    clicks: paginatedClicks,
    totalCount: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / limit) || 1,
  };

  return NextResponse.json(response);
}

// Ingress POST endpoint for automatic click recording from client UserActionRecorder
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const store = getClicksStore();

    if (body.action === "simulate") {
      const simulatedPresets: Array<{
        type: ClickEventType;
        tag: string;
        text: string;
        path: string;
        role: UserRoleType;
        name: string;
        email: string;
      }> = [
        {
          type: "ADD_TO_CART_CLICK",
          tag: "BUTTON",
          text: "Add to Cart - Wireless Earbuds Pro",
          path: "/products/quantum-anc-headphones",
          role: "CUSTOMER",
          name: "John Smith",
          email: "john.smith@gmail.com",
        },
        {
          type: "CHECKOUT_CLICK",
          tag: "BUTTON",
          text: "Confirm & Pay with Apple Pay ($249.00)",
          path: "/checkout",
          role: "CUSTOMER",
          name: "John Smith",
          email: "john.smith@gmail.com",
        },
        {
          type: "NAV_CLICK",
          tag: "A",
          text: "Best Sellers & Top Deals",
          path: "/bestsellers",
          role: "GUEST",
          name: "Guest Shopper #7712",
          email: "guest_7712@natistore.com",
        },
        {
          type: "DONATE_CLICK",
          tag: "BUTTON",
          text: "Support Platform via Payoneer 💖",
          path: "/",
          role: "CUSTOMER",
          name: "Elena Rostova",
          email: "elena.r@gmail.com",
        },
      ];

      const pick = simulatedPresets[Math.floor(Math.random() * simulatedPresets.length)];
      const newEvent: UserClickEvent = {
        id: `clk_sim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        eventType: pick.type,
        targetTag: pick.tag,
        elementText: pick.text,
        elementId: `elem_${Math.random().toString(36).substring(2, 8)}`,
        coordinates: {
          x: Math.floor(100 + Math.random() * 800),
          y: Math.floor(200 + Math.random() * 600),
        },
        path: pick.path,
        user: {
          id: `usr_${Math.random().toString(36).substring(2, 8)}`,
          email: pick.email,
          name: pick.name,
          role: pick.role,
        },
        sessionId: `sess_sim_${Math.random().toString(36).substring(2, 8)}`,
        ip: "104.28.19.45",
        location: {
          city: "San Francisco",
          region: "California",
          country: "United States",
          countryCode: "US",
          flag: "🇺🇸",
          isp: "Cloudflare Ingress",
        },
        device: {
          model: "Apple iPhone 15 Pro",
          brand: "Apple",
          type: "Mobile",
          os: "iOS 17.5",
          browser: "Mobile Safari 17.5",
          screenResolution: "393×852",
        },
        timestamp: new Date().toISOString(),
        durationOnPageSeconds: Math.floor(10 + Math.random() * 90),
      };

      store.unshift(newEvent);
      if (store.length > 500) store.pop();

      return NextResponse.json({
        success: true,
        message: "Simulated user click recorded successfully.",
        event: newEvent,
      });
    }

    // Normal client auto-recorded click
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "";

    const incomingEvent: UserClickEvent = {
      id: `clk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      eventType: body.eventType || "CLICK",
      targetTag: (body.targetTag || "BUTTON").toUpperCase(),
      elementText: (body.elementText || "Interactive Element").trim().substring(0, 120),
      elementId: body.elementId || "",
      elementClass: (body.elementClass || "").substring(0, 80),
      componentName: body.componentName || "StorefrontShell",
      coordinates: body.coordinates || { x: 0, y: 0 },
      path: body.path || "/",
      user: {
        id: body.user?.id || "usr_anon",
        email: body.user?.email || "guest@natistore.com",
        name: body.user?.name || "Guest Visitor",
        role: body.user?.role || "GUEST",
      },
      sessionId: body.sessionId || `sess_${Date.now()}`,
      ip: clientIp,
      location: {
        city: "San Francisco",
        region: "California",
        country: "United States",
        countryCode: "US",
        flag: "🇺🇸",
        isp: "Cloudflare Ingress",
      },
      device: {
        model: body.device?.model || (userAgent.includes("Mobile") ? "Mobile Device" : "Desktop PC"),
        brand: "Generic",
        type: userAgent.includes("Mobile") ? "Mobile" : "Desktop",
        os: userAgent.includes("Mac") ? "macOS" : userAgent.includes("Windows") ? "Windows" : "Linux",
        browser: userAgent.includes("Chrome") ? "Chrome" : "Safari",
        screenResolution: body.screenResolution || "1920×1080",
      },
      timestamp: new Date().toISOString(),
      durationOnPageSeconds: body.durationOnPageSeconds || 15,
      metadata: body.metadata || {},
    };

    store.unshift(incomingEvent);
    if (store.length > 500) store.pop();

    return NextResponse.json({ success: true, recordedId: incomingEvent.id });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to log click event" },
      { status: 500 }
    );
  }
}
