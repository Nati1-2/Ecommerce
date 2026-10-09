import { DeviceType, TrafficSourceType, VisitorLocation, VisitorTrafficSource } from "@/types/adminVisitors";

/**
 * Converts a 2-letter ISO country code into a unicode flag emoji.
 */
export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

/**
 * Parses user agent string to extract device, OS, browser, and device model.
 */
export function parseUserAgent(ua: string | null | undefined): {
  deviceType: DeviceType;
  deviceModel: string;
  deviceBrand: string;
  os: string;
  browser: string;
} {
  const userAgent = (ua || "").trim();
  if (!userAgent) {
    return {
      deviceType: "Desktop",
      deviceModel: "Standard PC",
      deviceBrand: "Generic",
      os: "Windows 11",
      browser: "Chrome",
    };
  }

  // Detect Bots / Crawlers
  if (/bot|crawler|spider|crawling|slurp|bingbot|googlebot/i.test(userAgent)) {
    return {
      deviceType: "Bot",
      deviceModel: "Search Crawler",
      deviceBrand: "Bot",
      os: "Automated Bot",
      browser: "Crawler",
    };
  }

  // Detect Device Type & Model
  let deviceType: DeviceType = "Desktop";
  let deviceModel = "Desktop PC";
  let deviceBrand = "PC";

  if (/ipad|tablet|(android(?!.*mobile))/i.test(userAgent)) {
    deviceType = "Tablet";
    if (/ipad/i.test(userAgent)) {
      deviceBrand = "Apple";
      deviceModel = "iPad Pro";
    } else {
      deviceBrand = "Samsung";
      deviceModel = "Android Tablet";
    }
  } else if (/mobile|iphone|ipod|android.*mobile|blackberry|iemobile|opera mini/i.test(userAgent)) {
    deviceType = "Mobile";
    if (/iphone/i.test(userAgent)) {
      deviceBrand = "Apple";
      deviceModel = "iPhone 15 Pro";
    } else if (/samsung|sm-[a-z0-9]+/i.test(userAgent)) {
      deviceBrand = "Samsung";
      deviceModel = "Galaxy S24 Ultra";
    } else if (/pixel/i.test(userAgent)) {
      deviceBrand = "Google";
      deviceModel = "Pixel 8 Pro";
    } else if (/xiaomi|redmi/i.test(userAgent)) {
      deviceBrand = "Xiaomi";
      deviceModel = "Redmi Note";
    } else {
      deviceBrand = "Android";
      deviceModel = "Smartphone";
    }
  } else {
    // Desktop
    deviceType = "Desktop";
    if (/macintosh|mac os x/i.test(userAgent)) {
      deviceBrand = "Apple";
      deviceModel = "MacBook Pro";
    } else if (/windows/i.test(userAgent)) {
      deviceBrand = "Microsoft";
      deviceModel = "Windows PC";
    } else if (/linux/i.test(userAgent)) {
      deviceBrand = "Linux";
      deviceModel = "Linux Desktop";
    }
  }

  // Detect OS
  let os = "Unknown OS";
  if (/windows nt 10\.0/i.test(userAgent)) os = "Windows 11 / 10";
  else if (/windows nt 6\.3/i.test(userAgent)) os = "Windows 8.1";
  else if (/windows nt 6\.1/i.test(userAgent)) os = "Windows 7";
  else if (/mac os x ([\d_]+)/i.test(userAgent)) {
    const match = userAgent.match(/mac os x ([\d_]+)/i);
    const ver = match ? match[1].replace(/_/g, ".") : "";
    os = ver ? `macOS ${ver}` : "macOS Sonoma";
  } else if (/iphone os ([\d_]+)/i.test(userAgent)) {
    const match = userAgent.match(/iphone os ([\d_]+)/i);
    const ver = match ? match[1].replace(/_/g, ".") : "";
    os = ver ? `iOS ${ver}` : "iOS 17";
  } else if (/android ([\d.]+)/i.test(userAgent)) {
    const match = userAgent.match(/android ([\d.]+)/i);
    os = match ? `Android ${match[1]}` : "Android 14";
  } else if (/cros/i.test(userAgent)) {
    os = "ChromeOS";
  } else if (/linux/i.test(userAgent)) {
    os = "Linux (Ubuntu)";
  }

  // Detect Browser
  let browser = "Web Browser";
  if (/edg\/([\d.]+)/i.test(userAgent)) {
    const match = userAgent.match(/edg\/([\d.]+)/i);
    browser = `Edge ${match ? match[1].split(".")[0] : ""}`;
  } else if (/opr\/([\d.]+)|opera/i.test(userAgent)) {
    browser = "Opera";
  } else if (/samsungbrowser\/([\d.]+)/i.test(userAgent)) {
    browser = "Samsung Internet";
  } else if (/chrome\/([\d.]+)/i.test(userAgent)) {
    const match = userAgent.match(/chrome\/([\d.]+)/i);
    browser = `Chrome ${match ? match[1].split(".")[0] : ""}`;
  } else if (/firefox\/([\d.]+)/i.test(userAgent)) {
    const match = userAgent.match(/firefox\/([\d.]+)/i);
    browser = `Firefox ${match ? match[1].split(".")[0] : ""}`;
  } else if (/version\/([\d.]+).*safari/i.test(userAgent) || /safari/i.test(userAgent)) {
    const match = userAgent.match(/version\/([\d.]+)/i);
    browser = `Safari ${match ? match[1].split(".")[0] : ""}`;
  }

  return {
    deviceType,
    deviceModel,
    deviceBrand,
    os,
    browser: browser.trim(),
  };
}

/**
 * Classifies traffic source into Search Engine, Social Media, Direct, Referral, etc.
 */
export function parseTrafficSource(
  referrer: string | null | undefined,
  utm?: { source?: string; medium?: string; campaign?: string }
): VisitorTrafficSource {
  const ref = (referrer || "").trim();
  const utmSource = utm?.source?.toLowerCase() || "";
  const utmMedium = utm?.medium?.toLowerCase() || "";
  const utmCampaign = utm?.campaign || "";

  // 1. Check Paid / Ad Campaigns
  if (
    ["cpc", "ppc", "ad", "paid", "sponsored", "meta_ads", "google_ads"].includes(utmMedium) ||
    utmCampaign.includes("promo") ||
    utmCampaign.includes("sale")
  ) {
    return {
      type: "Campaign / Ad",
      name: utmSource ? `${utmSource.toUpperCase()} Ad Campaign` : "Promotional Ad Campaign",
      referrer: ref || "Ad Click",
      utmSource,
      utmMedium,
      utmCampaign,
    };
  }

  // 2. Check Email Sources
  if (
    utmMedium === "email" ||
    utmSource === "newsletter" ||
    /mail\.google\.com|outlook\.live\.com|mail\.yahoo\.com/i.test(ref)
  ) {
    return {
      type: "Email",
      name: "Email Newsletter / Notification",
      referrer: ref || "Email Client",
      utmSource,
      utmMedium,
      utmCampaign,
    };
  }

  // 3. Social Media Check
  const socialPatterns: Array<{ regex: RegExp; name: string }> = [
    { regex: /instagram\.com/i, name: "Instagram" },
    { regex: /facebook\.com|fb\.com|l\.facebook\.com/i, name: "Facebook" },
    { regex: /twitter\.com|t\.co|x\.com/i, name: "X / Twitter" },
    { regex: /tiktok\.com/i, name: "TikTok" },
    { regex: /youtube\.com|youtu\.be/i, name: "YouTube" },
    { regex: /linkedin\.com|lnkd\.in/i, name: "LinkedIn" },
    { regex: /reddit\.com/i, name: "Reddit" },
    { regex: /pinterest\.com/i, name: "Pinterest" },
    { regex: /threads\.net/i, name: "Threads" },
    { regex: /whatsapp\.com/i, name: "WhatsApp" },
    { regex: /telegram\.org|t\.me/i, name: "Telegram" },
  ];

  for (const social of socialPatterns) {
    if (social.regex.test(ref) || utmSource.includes(social.name.toLowerCase().replace(/[^a-z]/g, ""))) {
      return {
        type: "Social Media",
        name: social.name,
        referrer: ref || `${social.name} Link`,
        utmSource,
        utmMedium,
        utmCampaign,
      };
    }
  }

  // 4. Search Engine Check
  const searchPatterns: Array<{ regex: RegExp; name: string }> = [
    { regex: /google\.[a-z.]+/i, name: "Google Search" },
    { regex: /bing\.com/i, name: "Bing Search" },
    { regex: /yahoo\.com/i, name: "Yahoo Search" },
    { regex: /duckduckgo\.com/i, name: "DuckDuckGo" },
    { regex: /baidu\.com/i, name: "Baidu Search" },
    { regex: /yandex\.[a-z.]+/i, name: "Yandex" },
    { regex: /ecosia\.org/i, name: "Ecosia" },
  ];

  for (const engine of searchPatterns) {
    if (engine.regex.test(ref) || utmSource.includes(engine.name.toLowerCase().split(" ")[0])) {
      return {
        type: "Search Engine",
        name: engine.name,
        referrer: ref || engine.name,
        utmSource,
        utmMedium,
        utmCampaign,
      };
    }
  }

  // 5. Direct Traffic
  if (!ref || ref === "direct" || ref.includes("localhost") || ref.includes("127.0.0.1")) {
    return {
      type: "Direct",
      name: "Direct Access / Bookmark",
      referrer: "Direct URL navigation",
      utmSource,
      utmMedium,
      utmCampaign,
    };
  }

  // 6. External Referral
  try {
    const parsedUrl = new URL(ref);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    return {
      type: "Referral",
      name: hostname,
      referrer: ref,
      utmSource,
      utmMedium,
      utmCampaign,
    };
  } catch {
    return {
      type: "Referral",
      name: ref.substring(0, 30),
      referrer: ref,
      utmSource,
      utmMedium,
      utmCampaign,
    };
  }
}

/**
 * Extracts Geolocation from headers or fallback.
 */
export function parseGeoLocation(headers: Headers | { [key: string]: string | string[] | undefined }): VisitorLocation {
  const getHeader = (key: string): string => {
    if (typeof (headers as any).get === "function") {
      return (headers as Headers).get(key) || "";
    }
    const val = (headers as Record<string, string | string[] | undefined>)[key];
    if (Array.isArray(val)) return val[0] || "";
    return val || "";
  };

  const countryCode = (
    getHeader("x-vercel-ip-country") ||
    getHeader("cf-ipcountry") ||
    getHeader("x-country-code") ||
    "US"
  ).toUpperCase();

  const city =
    getHeader("x-vercel-ip-city") ||
    getHeader("cf-ipcity") ||
    getHeader("x-city") ||
    (countryCode === "US" ? "New York" : "London");

  const region =
    getHeader("x-vercel-ip-country-region") ||
    getHeader("x-region") ||
    "";

  const countryMap: Record<string, string> = {
    US: "United States",
    GB: "United Kingdom",
    CA: "Canada",
    DE: "Germany",
    FR: "France",
    ET: "Ethiopia",
    JP: "Japan",
    AU: "Australia",
    NL: "Netherlands",
    SG: "Singapore",
    BR: "Brazil",
    IN: "India",
  };

  const country = countryMap[countryCode] || countryCode;
  const flag = getFlagEmoji(countryCode);

  return {
    city: decodeURIComponent(city),
    region,
    country,
    countryCode,
    flag,
  };
}
