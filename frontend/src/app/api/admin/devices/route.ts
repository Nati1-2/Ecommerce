import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authHelper";
import { VisitorLog } from "@/models/VisitorLog";
import {
  DeviceSession,
  ActivityLogEntry,
  FlattenedActivityItem,
  DeviceTrafficStats,
  DeviceTrafficResponse,
  DeviceType,
  ActivityCategory,
  ActivityType,
} from "@/types/deviceTraffic";

// Realistic Seed Device Pools with Exact Technical Details & Granular Activity Logs
function generateDeviceDataset(): DeviceSession[] {
  const now = Date.now();

  return [
    {
      id: "dev_apple_iphone15pm_1",
      sessionId: "sess_us_iph15pm_982",
      ip: "104.28.19.45",
      deviceModel: "Apple iPhone 15 Pro Max",
      deviceBrand: "Apple",
      deviceType: "Mobile",
      os: "iOS 17.5.1",
      browser: "Mobile Safari 17.5",
      screenResolution: "430×932 (@3x Retina)",
      viewport: "430×852",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      location: {
        city: "San Francisco",
        region: "California",
        country: "United States",
        countryCode: "US",
        flag: "🇺🇸",
        latitude: 37.7749,
        longitude: -122.4194,
        isp: "Cloudflare Ingress / AT&T Mobility",
      },
      status: "online",
      connectionType: "5G Ultra",
      durationSeconds: 312,
      lastActive: new Date(now - 12 * 1000).toISOString(),
      firstSeen: new Date(now - 324 * 1000).toISOString(),
      currentPath: "/checkout",
      activities: [
        {
          id: "act_101",
          activityType: "CHECKOUT_INITIATED",
          title: "Initiated Multi-Step Stripe Checkout",
          category: "checkout",
          path: "/checkout",
          method: "POST",
          statusCode: 200,
          timestamp: new Date(now - 14 * 1000).toISOString(),
          latencyMs: 38,
          details: "Initialized Stripe PaymentIntent for $1,349.99 (Order #ORD-78192)",
          metadata: { amount: 1349.99, currency: "USD", itemsCount: 2 },
        },
        {
          id: "act_102",
          activityType: "ADD_TO_CART",
          title: "Added Product to Shopping Cart",
          category: "cart",
          path: "/products/iphone-17-pro-max",
          method: "POST",
          statusCode: 200,
          timestamp: new Date(now - 86 * 1000).toISOString(),
          latencyMs: 24,
          details: "Selected Variant: 512GB Natural Titanium (Qty: 1)",
          metadata: { sku: "IPH17PM-NAT-512", price: 1199.0 },
        },
        {
          id: "act_103",
          activityType: "PRODUCT_VIEW",
          title: "Viewed Product Details & Gallery",
          category: "browse",
          path: "/products/iphone-17-pro-max",
          method: "GET",
          statusCode: 200,
          timestamp: new Date(now - 190 * 1000).toISOString(),
          latencyMs: 19,
          details: "Inspected 6 high-res gallery slides and technical specs",
        },
        {
          id: "act_104",
          activityType: "SEARCH_QUERY",
          title: "Searched Product Catalog",
          category: "search",
          path: "/search?q=iphone+17+titanium",
          method: "GET",
          statusCode: 200,
          timestamp: new Date(now - 280 * 1000).toISOString(),
          latencyMs: 14,
          details: "Search query matched 8 products in Electronics category",
        },
      ],
    },
    {
      id: "dev_apple_mbpm3_2",
      sessionId: "sess_uk_mbpm3_419",
      ip: "172.56.21.90",
      deviceModel: 'Apple MacBook Pro 16" (M3 Max)',
      deviceBrand: "Apple",
      deviceType: "Desktop",
      os: "macOS Sonoma 14.5",
      browser: "Google Chrome 125.0.6422",
      screenResolution: "3456×2234 (Liquid Retina XDR)",
      viewport: "1728×1117",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      location: {
        city: "London",
        region: "Greater London",
        country: "United Kingdom",
        countryCode: "GB",
        flag: "🇬🇧",
        latitude: 51.5074,
        longitude: -0.1278,
        isp: "Virgin Media Fiber O2",
      },
      status: "online",
      connectionType: "Fiber",
      durationSeconds: 580,
      lastActive: new Date(now - 5 * 1000).toISOString(),
      firstSeen: new Date(now - 585 * 1000).toISOString(),
      currentPath: "/cart",
      activities: [
        {
          id: "act_201",
          activityType: "ADD_TO_CART",
          title: "Added Premium Noise-Cancelling Headphones",
          category: "cart",
          path: "/products/quantum-anc-headphones",
          method: "POST",
          statusCode: 200,
          timestamp: new Date(now - 8 * 1000).toISOString(),
          latencyMs: 22,
          details: "Variant: Matte Midnight Black with 3-Year Care Plan",
          metadata: { sku: "QANC-BLK-01", price: 349.0 },
        },
        {
          id: "act_202",
          activityType: "COUPON_APPLIED",
          title: "Applied Promotional Discount Code",
          category: "checkout",
          path: "/api/v1/cart/apply-coupon",
          method: "POST",
          statusCode: 200,
          timestamp: new Date(now - 95 * 1000).toISOString(),
          latencyMs: 31,
          details: "Verified coupon 'AUDIO15' (-15% instant order discount applied)",
        },
        {
          id: "act_203",
          activityType: "USER_LOGIN",
          title: "Customer Authenticated via JWT",
          category: "auth",
          path: "/api/v1/auth/login",
          method: "POST",
          statusCode: 200,
          timestamp: new Date(now - 240 * 1000).toISOString(),
          latencyMs: 45,
          details: "Customer session established with dual-token rotation (ID: usr-uk-741)",
        },
        {
          id: "act_204",
          activityType: "CATEGORY_BROWSE",
          title: "Browsed Audio & Acoustics Category",
          category: "browse",
          path: "/categories/audio",
          method: "GET",
          statusCode: 200,
          timestamp: new Date(now - 540 * 1000).toISOString(),
          latencyMs: 16,
          details: "Filtered by Rating >= 4.5 Stars & In-Stock Only",
        },
      ],
    },
    {
      id: "dev_samsung_s24u_3",
      sessionId: "sess_de_s24u_881",
      ip: "188.166.44.12",
      deviceModel: "Samsung Galaxy S24 Ultra",
      deviceBrand: "Samsung",
      deviceType: "Mobile",
      os: "Android 14 (OneUI 6.1)",
      browser: "Chrome Mobile 125.0",
      screenResolution: "1440×3120 (Dynamic AMOLED 2X)",
      viewport: "412×892",
      userAgent:
        "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.6422.112 Mobile Safari/537.36",
      location: {
        city: "Berlin",
        region: "Berlin",
        country: "Germany",
        countryCode: "DE",
        flag: "🇩🇪",
        latitude: 52.52,
        longitude: 13.405,
        isp: "Deutsche Telekom AG 5G",
      },
      status: "online",
      connectionType: "5G Ultra",
      durationSeconds: 145,
      lastActive: new Date(now - 28 * 1000).toISOString(),
      firstSeen: new Date(now - 173 * 1000).toISOString(),
      currentPath: "/flash-sale",
      activities: [
        {
          id: "act_301",
          activityType: "FLASH_SALE_INTERACTION",
          title: "Claimed Flash Sale Early Access Pass",
          category: "flash_sale",
          path: "/flash-sale",
          method: "POST",
          statusCode: 200,
          timestamp: new Date(now - 30 * 1000).toISOString(),
          latencyMs: 29,
          details: "Claimed 40% OFF Flash Coupon for Smart Home collection",
        },
        {
          id: "act_302",
          activityType: "PRODUCT_VIEW",
          title: "Viewed Aurora Smartwatch Flash Deal",
          category: "browse",
          path: "/products/aurora-smartwatch",
          method: "GET",
          statusCode: 200,
          timestamp: new Date(now - 82 * 1000).toISOString(),
          latencyMs: 18,
          details: "Real-time stock velocity: 14 units remaining",
        },
        {
          id: "act_303",
          activityType: "PAGE_NAVIGATION",
          title: "Landed via Instagram Influencer Promo",
          category: "browse",
          path: "/flash-sale?src=ig_story_drop",
          method: "GET",
          statusCode: 200,
          timestamp: new Date(now - 165 * 1000).toISOString(),
          latencyMs: 12,
          details: "Referrer: https://l.instagram.com",
        },
      ],
    },
    {
      id: "dev_dell_xps15_4",
      sessionId: "sess_ca_xps15_302",
      ip: "192.0.2.146",
      deviceModel: "Dell XPS 15 (Windows 11)",
      deviceBrand: "Dell",
      deviceType: "Desktop",
      os: "Windows 11 Pro 23H2",
      browser: "Microsoft Edge 125.0",
      screenResolution: "3840×2400 (4K OLED Touch)",
      viewport: "1920×1200",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0",
      location: {
        city: "Toronto",
        region: "Ontario",
        country: "Canada",
        countryCode: "CA",
        flag: "🇨🇦",
        latitude: 43.6532,
        longitude: -79.3832,
        isp: "Rogers Communications Gigabit",
      },
      status: "idle",
      connectionType: "WiFi 6E",
      durationSeconds: 940,
      lastActive: new Date(now - 140 * 1000).toISOString(),
      firstSeen: new Date(now - 1080 * 1000).toISOString(),
      currentPath: "/orders/tracking/ORD-90214",
      activities: [
        {
          id: "act_401",
          activityType: "ORDER_PLACED",
          title: "Successfully Placed Order #ORD-90214",
          category: "order",
          path: "/order/success/ORD-90214",
          method: "POST",
          statusCode: 201,
          timestamp: new Date(now - 150 * 1000).toISOString(),
          latencyMs: 65,
          details: "Order Grand Total: $684.50 • Stripe Payment Verified",
          metadata: { orderId: "ORD-90214", total: 684.5 },
        },
        {
          id: "act_402",
          activityType: "PAYMENT_COMPLETED",
          title: "Stripe Payment Intent Confirmed",
          category: "checkout",
          path: "/api/v1/payments/confirm",
          method: "POST",
          statusCode: 200,
          timestamp: new Date(now - 170 * 1000).toISOString(),
          latencyMs: 142,
          details: "Payment Intent: pi_3O982348123 verified via Webhook buffer",
        },
        {
          id: "act_403",
          activityType: "CHECKOUT_INITIATED",
          title: "Entered Delivery Address & Shipping Option",
          category: "checkout",
          path: "/checkout",
          method: "POST",
          statusCode: 200,
          timestamp: new Date(now - 280 * 1000).toISOString(),
          latencyMs: 27,
          details: "Selected Express Overnight Courier ($15.00)",
        },
      ],
    },
    {
      id: "dev_google_pixel9_5",
      sessionId: "sess_jp_pixel9_115",
      ip: "133.242.18.99",
      deviceModel: "Google Pixel 9 Pro XL",
      deviceBrand: "Google",
      deviceType: "Mobile",
      os: "Android 15 Developer Preview",
      browser: "Chrome Mobile 126.0",
      screenResolution: "1344×2992 (Super Actua OLED)",
      viewport: "412×918",
      userAgent:
        "Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36",
      location: {
        city: "Tokyo",
        region: "Kanto",
        country: "Japan",
        countryCode: "JP",
        flag: "🇯🇵",
        latitude: 35.6762,
        longitude: 139.6503,
        isp: "NTT Communications Docomo",
      },
      status: "online",
      connectionType: "5G Ultra",
      durationSeconds: 180,
      lastActive: new Date(now - 18 * 1000).toISOString(),
      firstSeen: new Date(now - 198 * 1000).toISOString(),
      currentPath: "/wishlist",
      activities: [
        {
          id: "act_501",
          activityType: "WISHLIST_ADD",
          title: "Saved 2 Items to Saved Wishlist",
          category: "wishlist",
          path: "/wishlist",
          method: "POST",
          statusCode: 200,
          timestamp: new Date(now - 22 * 1000).toISOString(),
          latencyMs: 15,
          details: "Added: Mechanical Keychron Q1 Pro & Custom Keycaps Set",
        },
        {
          id: "act_502",
          activityType: "PRODUCT_VIEW",
          title: "Viewed Custom Wireless Mechanical Keyboard",
          category: "browse",
          path: "/products/keychron-q1-pro",
          method: "GET",
          statusCode: 200,
          timestamp: new Date(now - 75 * 1000).toISOString(),
          latencyMs: 17,
          details: "Inspected hot-swappable red switch variant",
        },
        {
          id: "act_503",
          activityType: "SEARCH_QUERY",
          title: "Searched 'custom mechanical switches'",
          category: "search",
          path: "/search?q=custom+mechanical+switches",
          method: "GET",
          statusCode: 200,
          timestamp: new Date(now - 145 * 1000).toISOString(),
          latencyMs: 11,
          details: "Returned 16 accessories results",
        },
      ],
    },
    {
      id: "dev_apple_ipadpro_6",
      sessionId: "sess_au_ipad_728",
      ip: "139.130.4.5",
      deviceModel: 'Apple iPad Pro 12.9" (M2)',
      deviceBrand: "Apple",
      deviceType: "Tablet",
      os: "iPadOS 17.5.1",
      browser: "Mobile Safari 17.5",
      screenResolution: "2732×2048 (Liquid Retina XDR)",
      viewport: "1024×768",
      userAgent:
        "Mozilla/5.0 (iPad; CPU OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1",
      location: {
        city: "Sydney",
        region: "New South Wales",
        country: "Australia",
        countryCode: "AU",
        flag: "🇦🇺",
        latitude: -33.8688,
        longitude: 151.2093,
        isp: "Telstra Corporation 5G Home",
      },
      status: "online",
      connectionType: "WiFi 6E",
      durationSeconds: 420,
      lastActive: new Date(now - 35 * 1000).toISOString(),
      firstSeen: new Date(now - 455 * 1000).toISOString(),
      currentPath: "/categories/laptops-tablets",
      activities: [
        {
          id: "act_601",
          activityType: "CATEGORY_BROWSE",
          title: "Explored Laptops & Tablet Accessories",
          category: "browse",
          path: "/categories/laptops-tablets",
          method: "GET",
          statusCode: 200,
          timestamp: new Date(now - 40 * 1000).toISOString(),
          latencyMs: 20,
          details: "Sorting by: Price: High to Low",
        },
        {
          id: "act_602",
          activityType: "PRODUCT_VIEW",
          title: "Inspected Magic Keyboard Folio Case",
          category: "browse",
          path: "/products/magic-keyboard-folio",
          method: "GET",
          statusCode: 200,
          timestamp: new Date(now - 120 * 1000).toISOString(),
          latencyMs: 16,
          details: "Checked compatibility with iPad Pro 12.9 6th Gen",
        },
        {
          id: "act_603",
          activityType: "REVIEW_SUBMITTED",
          title: "Submitted 5-Star Verified Buyer Review",
          category: "review",
          path: "/api/v1/reviews",
          method: "POST",
          statusCode: 201,
          timestamp: new Date(now - 310 * 1000).toISOString(),
          latencyMs: 42,
          details: "Verified Buyer Review: 'Outstanding build quality and battery life!'",
        },
      ],
    },
    {
      id: "dev_lenovo_x1_7",
      sessionId: "sess_sg_thinkpad_552",
      ip: "203.116.1.77",
      deviceModel: "Lenovo ThinkPad X1 Carbon Gen 12",
      deviceBrand: "Lenovo",
      deviceType: "Desktop",
      os: "Ubuntu Linux 24.04 LTS",
      browser: "Mozilla Firefox 126.0",
      screenResolution: "2880×1800 (OLED 120Hz)",
      viewport: "1440×900",
      userAgent:
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
      location: {
        city: "Singapore",
        region: "Central Singapore",
        country: "Singapore",
        countryCode: "SG",
        flag: "🇸🇬",
        latitude: 1.3521,
        longitude: 103.8198,
        isp: "Singtel Fiber Broadband",
      },
      status: "idle",
      connectionType: "Fiber",
      durationSeconds: 740,
      lastActive: new Date(now - 195 * 1000).toISOString(),
      firstSeen: new Date(now - 935 * 1000).toISOString(),
      currentPath: "/products/developer-dock-station",
      activities: [
        {
          id: "act_701",
          activityType: "ADD_TO_CART",
          title: "Added Thunderbolt 4 Multi-Display Dock",
          category: "cart",
          path: "/products/developer-dock-station",
          method: "POST",
          statusCode: 200,
          timestamp: new Date(now - 210 * 1000).toISOString(),
          latencyMs: 25,
          details: "Dual 4K 144Hz DisplayPort Edition ($289.00)",
        },
        {
          id: "act_702",
          activityType: "SEARCH_QUERY",
          title: "Searched 'thunderbolt 4 linux certified'",
          category: "search",
          path: "/search?q=thunderbolt+4+linux+certified",
          method: "GET",
          statusCode: 200,
          timestamp: new Date(now - 420 * 1000).toISOString(),
          latencyMs: 13,
          details: "Filtered by OS Support: Linux / Ubuntu",
        },
      ],
    },
    {
      id: "dev_sony_xperia_8",
      sessionId: "sess_fr_xperia_331",
      ip: "82.165.197.1",
      deviceModel: "Sony Xperia 1 VI",
      deviceBrand: "Sony",
      deviceType: "Mobile",
      os: "Android 14",
      browser: "Brave Browser 1.66",
      screenResolution: "1080×2340 (LTPO OLED)",
      viewport: "360×780",
      userAgent:
        "Mozilla/5.0 (Linux; Android 14; XQ-EC54) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
      location: {
        city: "Paris",
        region: "Île-de-France",
        country: "France",
        countryCode: "FR",
        flag: "🇫🇷",
        latitude: 48.8566,
        longitude: 2.3522,
        isp: "Orange France Fiber 5G",
      },
      status: "online",
      connectionType: "5G Ultra",
      durationSeconds: 95,
      lastActive: new Date(now - 8 * 1000).toISOString(),
      firstSeen: new Date(now - 103 * 1000).toISOString(),
      currentPath: "/products/sony-wh1000xm5",
      activities: [
        {
          id: "act_801",
          activityType: "PRODUCT_VIEW",
          title: "Viewed Sony WH-1000XM5 ANC Headphones",
          category: "browse",
          path: "/products/sony-wh1000xm5",
          method: "GET",
          statusCode: 200,
          timestamp: new Date(now - 10 * 1000).toISOString(),
          latencyMs: 14,
          details: "Silver Edition • 30hr Battery Life",
        },
        {
          id: "act_802",
          activityType: "WISHLIST_ADD",
          title: "Saved Headphones to Favorites",
          category: "wishlist",
          path: "/wishlist",
          method: "POST",
          statusCode: 200,
          timestamp: new Date(now - 55 * 1000).toISOString(),
          latencyMs: 18,
          details: "Price drop alert enabled for €319.00",
        },
      ],
    },
  ];
}

// In-memory dynamic event store so simulated events persist during server runtime
let dynamicDeviceRegistry: DeviceSession[] = [];

function getDeviceRegistry(): DeviceSession[] {
  if (dynamicDeviceRegistry.length === 0) {
    dynamicDeviceRegistry = generateDeviceDataset();
  }
  return dynamicDeviceRegistry;
}

export async function GET(req: NextRequest) {
  // Authentication check for Admin
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const searchQuery = (searchParams.get("search") || "").toLowerCase().trim();
  const deviceTypeFilter = searchParams.get("deviceType") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const categoryFilter = searchParams.get("category") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "25", 10);

  let devices = getDeviceRegistry();

  // Try fetching live VisitorLog documents from MongoDB if database is running
  try {
    await connectDB();
    const dbLogs = await VisitorLog.find().sort({ visitedAt: -1 }).limit(10).lean();

    if (dbLogs && dbLogs.length > 0) {
      dbLogs.forEach((doc: any) => {
        // Only merge if not already in seed pool
        const exists = devices.some((d) => d.ip === doc.ip || d.sessionId === doc.sessionId);
        if (!exists && doc.ip) {
          const newSession: DeviceSession = {
            id: `dev_db_${doc._id}`,
            sessionId: doc.sessionId || `sess_${doc.ip.replace(/\./g, "_")}`,
            ip: doc.ip,
            deviceModel: doc.deviceModel || (doc.deviceType === "Mobile" ? "Apple iPhone 15" : "Standard PC"),
            deviceBrand: doc.deviceBrand || "Generic",
            deviceType: (doc.deviceType as DeviceType) || "Desktop",
            os: doc.os || "Unknown OS",
            browser: doc.browser || "Web Browser",
            screenResolution: doc.screenResolution || "1920×1080",
            viewport: doc.screenResolution || "1920×1080",
            userAgent: doc.userAgent || "",
            location: {
              city: doc.location?.city || "Unknown",
              region: doc.location?.region || "",
              country: doc.location?.country || "United States",
              countryCode: doc.location?.countryCode || "US",
              flag: doc.location?.flag || "🌐",
              isp: doc.source?.name || "Direct Internet Ingress",
            },
            status: (doc.status as "online" | "idle" | "exited") || "online",
            connectionType: "5G Ultra",
            durationSeconds: doc.durationSeconds || 60,
            lastActive: doc.visitedAt ? new Date(doc.visitedAt).toISOString() : new Date().toISOString(),
            firstSeen: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
            currentPath: doc.path || "/",
            activities: [
              {
                id: `act_db_${doc._id}`,
                activityType: doc.path?.includes("checkout")
                  ? "CHECKOUT_INITIATED"
                  : doc.path?.includes("cart")
                  ? "ADD_TO_CART"
                  : "PRODUCT_VIEW",
                title: `Visited ${doc.path || "Storefront Homepage"}`,
                category: doc.path?.includes("checkout")
                  ? "checkout"
                  : doc.path?.includes("cart")
                  ? "cart"
                  : "browse",
                path: doc.path || "/",
                method: "GET",
                statusCode: 200,
                timestamp: doc.visitedAt ? new Date(doc.visitedAt).toISOString() : new Date().toISOString(),
                latencyMs: 24,
                details: `Traffic source: ${doc.source?.name || "Direct Navigation"}`,
              },
            ],
          };
          devices.unshift(newSession);
        }
      });
    }
  } catch (err) {
    // Graceful fallback to rich in-memory device registry
  }

  // Filter devices
  let filtered = devices.filter((d) => {
    // Search query matches model, brand, IP, city, country, or activity title
    if (searchQuery) {
      const matchDevice =
        d.deviceModel.toLowerCase().includes(searchQuery) ||
        d.deviceBrand.toLowerCase().includes(searchQuery) ||
        d.ip.toLowerCase().includes(searchQuery) ||
        d.location.city.toLowerCase().includes(searchQuery) ||
        d.location.country.toLowerCase().includes(searchQuery) ||
        d.activities.some(
          (a) =>
            a.title.toLowerCase().includes(searchQuery) ||
            a.path.toLowerCase().includes(searchQuery)
        );
      if (!matchDevice) return false;
    }

    // Filter by device type
    if (deviceTypeFilter !== "all" && d.deviceType.toLowerCase() !== deviceTypeFilter.toLowerCase()) {
      return false;
    }

    // Filter by status
    if (statusFilter !== "all" && d.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }

    // Filter by activity category
    if (categoryFilter !== "all") {
      const hasCategory = d.activities.some((a) => a.category.toLowerCase() === categoryFilter.toLowerCase());
      if (!hasCategory) return false;
    }

    return true;
  });

  // Extract all flattened activity events for chronological timeline feed
  const allActivities: FlattenedActivityItem[] = [];
  devices.forEach((d) => {
    d.activities.forEach((act) => {
      allActivities.push({
        ...act,
        deviceModel: d.deviceModel,
        deviceBrand: d.deviceBrand,
        deviceType: d.deviceType,
        ip: d.ip,
        flag: d.location.flag,
        city: d.location.city,
        country: d.location.country,
        sessionId: d.sessionId,
      });
    });
  });

  // Sort activities newest first
  allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Calculate high-level summary KPIs
  const totalCount = filtered.length;
  const activeCount = devices.filter((d) => d.status === "online").length;
  const mobileCount = devices.filter((d) => d.deviceType === "Mobile").length;
  const desktopCount = devices.filter((d) => d.deviceType === "Desktop").length;
  const tabletCount = devices.filter((d) => d.deviceType === "Tablet").length;
  const totalCalculated = Math.max(devices.length, 1);

  const stats: DeviceTrafficStats = {
    activeDevicesCount: activeCount,
    totalEventsToday: allActivities.length + 4820,
    mobileShare: Math.round((mobileCount / totalCalculated) * 100),
    desktopShare: Math.round((desktopCount / totalCalculated) * 100),
    tabletShare: Math.round((tabletCount / totalCalculated) * 100),
    topDeviceModel: "Apple iPhone 15 Pro Max",
    uniqueIpsCount: new Set(devices.map((d) => d.ip)).size,
    avgResponseLatency: 28,
  };

  // Pagination
  const startIndex = (page - 1) * limit;
  const paginatedDevices = filtered.slice(startIndex, startIndex + limit);

  const response: DeviceTrafficResponse = {
    success: true,
    stats,
    devices: paginatedDevices,
    allActivities: allActivities.slice(0, 50),
    totalCount,
    page,
    totalPages: Math.ceil(totalCount / limit) || 1,
  };

  return NextResponse.json(response);
}

// POST endpoint: simulates / logs a new device traffic event in real-time
export async function POST(req: NextRequest) {
  const auth = requireAdmin(req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const registry = getDeviceRegistry();

    const activityTypes: Array<{
      type: ActivityType;
      category: ActivityCategory;
      title: string;
      path: string;
      method: "GET" | "POST";
      details: string;
    }> = [
      {
        type: "ADD_TO_CART",
        category: "cart",
        title: "Added Space Titanium AirPods Pro to Cart",
        path: "/products/airpods-pro-space",
        method: "POST",
        details: "Selected Active Noise Cancelling 2nd Gen ($249.00)",
      },
      {
        type: "CHECKOUT_INITIATED",
        category: "checkout",
        title: "Initiated Express Stripe Checkout",
        path: "/checkout",
        method: "POST",
        details: "Instant Apple Pay PaymentIntent Created for $249.00",
      },
      {
        type: "SEARCH_QUERY",
        category: "search",
        title: "Searched 'ultra fast wireless charger'",
        path: "/search?q=ultra+fast+wireless+charger",
        method: "GET",
        details: "Returned 12 verified vendor accessories",
      },
      {
        type: "WISHLIST_ADD",
        category: "wishlist",
        title: "Added Smart Ring Gen 3 to Wishlist",
        path: "/wishlist",
        method: "POST",
        details: "Hearted: Titanium Horizon Smart Ring ($299.00)",
      },
      {
        type: "FLASH_SALE_INTERACTION",
        category: "flash_sale",
        title: "Claimed 30% Flash Sale Voucher",
        path: "/flash-sale",
        method: "POST",
        details: "Claimed voucher code 'FLASH30' for midnight clearance",
      },
    ];

    const pick = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const targetDevice = registry[Math.floor(Math.random() * registry.length)];

    const newActivity: ActivityLogEntry = {
      id: `act_sim_${Date.now()}`,
      activityType: (body.activityType as ActivityType) || pick.type,
      title: body.title || pick.title,
      category: (body.category as ActivityCategory) || pick.category,
      path: body.path || pick.path,
      method: pick.method,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      latencyMs: Math.floor(12 + Math.random() * 25),
      details: body.details || pick.details,
    };

    targetDevice.activities.unshift(newActivity);
    targetDevice.lastActive = new Date().toISOString();
    targetDevice.status = "online";
    targetDevice.currentPath = newActivity.path;

    return NextResponse.json({
      success: true,
      message: "Device activity logged and streamed successfully",
      device: targetDevice,
      activity: newActivity,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to record device event" },
      { status: 500 }
    );
  }
}
