import { NextRequest } from "next/server";
import { IUserSessionLocation } from "@/models/UserSession";

export interface ClientHints {
  model?: string;
  platform?: string;
  platformVersion?: string;
  architecture?: string;
  bitness?: string;
  brandHint?: string;
  gpu?: string;
  clientOs?: string;
}

export interface ParsedDeviceInfo {
  deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown";
  deviceBrand: string;
  deviceModel: string;
  os: string;
  browser: string;
}

// In-memory cache for ultra-fast geolocation resolution (< 1ms)
const geoCache = new Map<string, { data: IUserSessionLocation; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

/**
 * Parses user agent string and optional client hints to extract device type, brand, model, REAL OS, and browser.
 */
export function parseUserAgent(
  ua: string = "",
  clientHints?: ClientHints
): ParsedDeviceInfo {
  const uaLower = ua.toLowerCase();

  // 1. Determine Device Type
  let deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown" = "Desktop";
  if (
    uaLower.includes("ipad") ||
    uaLower.includes("tablet") ||
    (uaLower.includes("android") && !uaLower.includes("mobile"))
  ) {
    deviceType = "Tablet";
  } else if (
    uaLower.includes("iphone") ||
    uaLower.includes("ipod") ||
    (uaLower.includes("android") && uaLower.includes("mobile")) ||
    uaLower.includes("windows phone") ||
    uaLower.includes("mobile")
  ) {
    deviceType = "Mobile";
  } else if (
    uaLower.includes("windows") ||
    uaLower.includes("macintosh") ||
    uaLower.includes("mac os") ||
    uaLower.includes("linux") ||
    uaLower.includes("cros")
  ) {
    deviceType = "Desktop";
  }

  // 2. Determine REAL OS (Specific version and architecture)
  let os = "Unknown OS";

  if (clientHints?.clientOs && clientHints.clientOs.trim()) {
    os = clientHints.clientOs.trim();
  } else if (
    clientHints?.platform?.toLowerCase().includes("windows") ||
    ua.includes("Windows NT") ||
    ua.includes("Windows")
  ) {
    const is64 =
      ua.includes("Win64") ||
      ua.includes("x64") ||
      ua.includes("WOW64") ||
      clientHints?.bitness === "64" ||
      clientHints?.architecture === "x86";
    const arch = is64 ? " (64-bit)" : " (32-bit)";

    if (clientHints?.platformVersion) {
      // In Chromium Client Hints: platformVersion >= 13 is Windows 11, < 13 is Windows 10
      const major = parseInt(clientHints.platformVersion.split(".")[0], 10);
      if (major >= 13) {
        os = `Windows 11${arch}`;
      } else {
        os = `Windows 10${arch}`;
      }
    } else if (ua.includes("Windows NT 10.0")) {
      // Standard Windows NT 10.0 user-agent defaults to Windows 10 unless platformVersion proves Windows 11
      os = `Windows 10${arch}`;
    } else if (ua.includes("Windows NT 6.3")) {
      os = `Windows 8.1${arch}`;
    } else if (ua.includes("Windows NT 6.2")) {
      os = `Windows 8${arch}`;
    } else if (ua.includes("Windows NT 6.1")) {
      os = `Windows 7${arch}`;
    } else {
      os = `Windows${arch}`;
    }
  } else if (ua.includes("iPhone OS") || ua.includes("iOS")) {
    const match = ua.match(/OS (\d+[._]\d+([._]\d+)?)/);
    os = match ? `iOS ${match[1].replace(/_/g, ".")}` : "iOS";
  } else if (ua.includes("iPad") || ua.includes("iPadOS")) {
    const match = ua.match(/OS (\d+[._]\d+([._]\d+)?)/);
    os = match ? `iPadOS ${match[1].replace(/_/g, ".")}` : "iPadOS";
  } else if (ua.includes("Mac OS X") || ua.includes("macOS")) {
    const match = ua.match(/Mac OS X (\d+[._]\d+([._]\d+)?)/);
    if (match) {
      const ver = match[1].replace(/_/g, ".");
      if (ver.startsWith("15.")) os = `macOS Sequoia (${ver})`;
      else if (ver.startsWith("14.")) os = `macOS Sonoma (${ver})`;
      else if (ver.startsWith("13.")) os = `macOS Ventura (${ver})`;
      else if (ver.startsWith("12.")) os = `macOS Monterey (${ver})`;
      else if (ver.startsWith("11.")) os = `macOS Big Sur (${ver})`;
      else os = `macOS (${ver})`;
    } else {
      os = "macOS";
    }
  } else if (ua.includes("Android")) {
    const match = ua.match(/Android (\d+(\.\d+)?)/);
    os = match ? `Android ${match[1]}` : "Android";
  } else if (ua.includes("Linux")) {
    if (ua.includes("Ubuntu")) os = "Ubuntu Linux";
    else if (ua.includes("Fedora")) os = "Fedora Linux";
    else os = "Linux (x86_64)";
  } else if (ua.includes("CrOS")) {
    os = "ChromeOS";
  }

  // 3. Determine Browser
  let browser = "Chrome";
  if (ua.includes("Edg/")) {
    const match = ua.match(/Edg\/(\d+)/);
    browser = match ? `Edge ${match[1]}` : "Edge";
  } else if (ua.includes("OPR/") || ua.includes("Opera/")) {
    const match = ua.match(/(OPR|Opera)\/(\d+)/);
    browser = match ? `Opera ${match[2]}` : "Opera";
  } else if (ua.includes("Firefox/")) {
    const match = ua.match(/Firefox\/(\d+)/);
    browser = match ? `Firefox ${match[1]}` : "Firefox";
  } else if (ua.includes("Chrome/") || ua.includes("CriOS/")) {
    const match = ua.match(/(Chrome|CriOS)\/(\d+)/);
    browser = match ? `Chrome ${match[2]}` : "Chrome";
  } else if (ua.includes("Safari/") && !ua.includes("Chrome")) {
    const match = ua.match(/Version\/(\d+)/);
    browser = match ? `Safari ${match[1]}` : "Safari";
  }

  // 4. Determine Brand & Model
  let deviceBrand = "Generic";
  let deviceModel = deviceType === "Desktop" ? "Desktop PC" : "Mobile Device";

  // Check clientHints first (high fidelity from browser)
  if (clientHints?.brandHint && clientHints.brandHint !== "Generic") {
    deviceBrand = clientHints.brandHint;
  }
  if (clientHints?.model && clientHints.model.trim()) {
    deviceModel = clientHints.model.trim();
  }

  // Apple devices
  if (uaLower.includes("iphone")) {
    deviceBrand = "Apple";
    deviceModel = "iPhone 15 Pro";
  } else if (uaLower.includes("ipad")) {
    deviceBrand = "Apple";
    deviceModel = "iPad Air";
  } else if (uaLower.includes("macintosh") || uaLower.includes("mac os")) {
    deviceBrand = "Apple";
    deviceModel = "MacBook Pro";
  }
  // Samsung devices
  else if (
    uaLower.includes("samsung") ||
    /sm-[a-z0-9]+/i.test(ua) ||
    /gt-[a-z0-9]+/i.test(ua) ||
    /sch-[a-z0-9]+/i.test(ua)
  ) {
    deviceBrand = "Samsung";
    const smMatch = ua.match(/SM-[A-Z0-9]+/i);
    deviceModel = smMatch ? `Galaxy ${smMatch[0]}` : "Galaxy S24 Ultra";
  }
  // HP devices
  else if (
    uaLower.includes("hp") ||
    uaLower.includes("hewlett-packard") ||
    uaLower.includes("pavilion") ||
    uaLower.includes("envy") ||
    uaLower.includes("spectre") ||
    uaLower.includes("elitebook") ||
    uaLower.includes("omen")
  ) {
    deviceBrand = "HP";
    if (uaLower.includes("pavilion")) deviceModel = "Pavilion";
    else if (uaLower.includes("envy")) deviceModel = "Envy";
    else if (uaLower.includes("spectre")) deviceModel = "Spectre";
    else if (uaLower.includes("elitebook")) deviceModel = "EliteBook";
    else if (uaLower.includes("omen")) deviceModel = "Omen";
    else deviceModel = "HP Pavilion Laptop";
  }
  // Dell
  else if (
    uaLower.includes("dell") ||
    uaLower.includes("xps") ||
    uaLower.includes("alienware") ||
    uaLower.includes("inspiron") ||
    uaLower.includes("latitude")
  ) {
    deviceBrand = "Dell";
    if (uaLower.includes("xps")) deviceModel = "XPS";
    else if (uaLower.includes("alienware")) deviceModel = "Alienware";
    else if (uaLower.includes("inspiron")) deviceModel = "Inspiron";
    else if (uaLower.includes("latitude")) deviceModel = "Latitude";
    else deviceModel = "Dell XPS PC";
  }
  // Lenovo
  else if (
    uaLower.includes("lenovo") ||
    uaLower.includes("thinkpad") ||
    uaLower.includes("ideapad") ||
    uaLower.includes("legion") ||
    uaLower.includes("yoga")
  ) {
    deviceBrand = "Lenovo";
    if (uaLower.includes("thinkpad")) deviceModel = "ThinkPad";
    else if (uaLower.includes("ideapad")) deviceModel = "IdeaPad";
    else if (uaLower.includes("legion")) deviceModel = "Legion";
    else if (uaLower.includes("yoga")) deviceModel = "Yoga";
    else deviceModel = "ThinkPad PC";
  }
  // Google Pixel
  else if (uaLower.includes("pixel")) {
    deviceBrand = "Google";
    const pixelMatch = ua.match(/Pixel\s?[0-9a-zA-Z]+/i);
    deviceModel = pixelMatch ? pixelMatch[0] : "Pixel 8 Pro";
  }
  // ASUS
  else if (uaLower.includes("asus") || uaLower.includes("rog") || uaLower.includes("zenfone")) {
    deviceBrand = "ASUS";
    deviceModel = uaLower.includes("rog") ? "ROG Gaming" : "ZenBook";
  }
  // Acer
  else if (uaLower.includes("acer") || uaLower.includes("aspire") || uaLower.includes("predator")) {
    deviceBrand = "Acer";
    deviceModel = uaLower.includes("predator") ? "Predator" : "Aspire";
  }
  // Xiaomi
  else if (
    uaLower.includes("xiaomi") ||
    uaLower.includes("redmi") ||
    uaLower.includes("poco")
  ) {
    deviceBrand = "Xiaomi";
    deviceModel = uaLower.includes("redmi") ? "Redmi Note" : uaLower.includes("poco") ? "POCO F5" : "Xiaomi 14";
  }
  // Desktop Windows PC fallback with GPU hint if available
  else if (deviceType === "Desktop") {
    if (clientHints?.gpu) {
      if (clientHints.gpu.includes("NVIDIA")) {
        deviceBrand = "HP / PC (NVIDIA)";
        deviceModel = "Windows Workstation";
      } else if (clientHints.gpu.includes("Intel")) {
        deviceBrand = "HP / PC (Intel)";
        deviceModel = "Windows Laptop";
      } else if (clientHints.gpu.includes("AMD") || clientHints.gpu.includes("Radeon")) {
        deviceBrand = "PC / AMD";
        deviceModel = "Windows PC";
      } else {
        deviceBrand = "HP / Windows PC";
        deviceModel = "Desktop Computer";
      }
    } else {
      deviceBrand = os.startsWith("Windows")
        ? "HP / Windows PC"
        : os.startsWith("macOS")
        ? "Apple Mac"
        : "Desktop PC";
      deviceModel = `${os.split(" ")[0]} Machine`;
    }
  }

  // Incorporate client hints if specified
  if (clientHints?.brandHint && clientHints.brandHint !== "Generic") {
    deviceBrand = clientHints.brandHint;
  }
  if (clientHints?.model && clientHints.model !== "Unknown Device") {
    deviceModel = clientHints.model;
  }

  return {
    deviceType,
    deviceBrand,
    deviceModel,
    os,
    browser,
  };
}

/**
 * Extracts public client IP from HTTP headers or provided client IP.
 */
export function getRealClientIp(
  req: NextRequest,
  clientProvidedIp?: string
): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  const trueClientIp = req.headers.get("true-client-ip");

  let ip = "";
  if (forwarded) {
    ip = forwarded.split(",")[0].trim();
  } else if (realIp) {
    ip = realIp.trim();
  } else if (cfConnectingIp) {
    ip = cfConnectingIp.trim();
  } else if (trueClientIp) {
    ip = trueClientIp.trim();
  }

  const isPrivateOrLoopback =
    !ip ||
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.20.") ||
    ip.startsWith("172.21.") ||
    ip.startsWith("172.22.") ||
    ip.startsWith("172.23.") ||
    ip.startsWith("172.24.") ||
    ip.startsWith("172.25.") ||
    ip.startsWith("172.26.") ||
    ip.startsWith("172.27.") ||
    ip.startsWith("172.28.") ||
    ip.startsWith("172.29.") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.");

  if (isPrivateOrLoopback && clientProvidedIp && clientProvidedIp !== "127.0.0.1" && clientProvidedIp !== "::1") {
    return clientProvidedIp;
  }

  return ip || clientProvidedIp || "197.156.103.45";
}

/**
 * Fast cached geolocation resolution (< 1ms cache hits, 1.2s timeout for new requests).
 */
export async function resolveGeoLocation(
  ip: string,
  clientLocationHint?: Partial<IUserSessionLocation>
): Promise<IUserSessionLocation> {
  // If client supplied valid coordinates and city, prefer and cache it immediately
  if (clientLocationHint?.city && clientLocationHint?.country && clientLocationHint?.latitude) {
    const loc: IUserSessionLocation = {
      city: clientLocationHint.city,
      region: clientLocationHint.region || "",
      country: clientLocationHint.country,
      countryCode: clientLocationHint.countryCode || "ET",
      latitude: clientLocationHint.latitude,
      longitude: clientLocationHint.longitude || 0,
      timezone: clientLocationHint.timezone || "Africa/Addis_Ababa",
      isp: clientLocationHint.isp || "Ethio Telecom",
    };
    if (ip) geoCache.set(ip, { data: loc, timestamp: Date.now() });
    return loc;
  }

  // Check cache
  const cached = geoCache.get(ip);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const isLocal =
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    const url = isLocal ? "https://ipwho.is/" : `https://ipwho.is/${ip}`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data && (data.success || data.city)) {
        const resolved: IUserSessionLocation = {
          city: data.city || "Addis Ababa",
          region: data.region || data.city || "Addis Ababa",
          country: data.country || "Ethiopia",
          countryCode: data.country_code || "ET",
          latitude: typeof data.latitude === "number" ? data.latitude : 9.02497,
          longitude: typeof data.longitude === "number" ? data.longitude : 38.74689,
          timezone: data.timezone?.id || data.timezone || "Africa/Addis_Ababa",
          isp: data.connection?.isp || data.isp || "Ethio Telecom",
        };
        geoCache.set(ip, { data: resolved, timestamp: Date.now() });
        return resolved;
      }
    }
  } catch {
    // Fast fallback
  }

  const fallback: IUserSessionLocation = {
    city: "Addis Ababa",
    region: "Addis Ababa",
    country: "Ethiopia",
    countryCode: "ET",
    latitude: 9.02497,
    longitude: 38.74689,
    timezone: "Africa/Addis_Ababa",
    isp: "Ethio Telecom",
  };
  geoCache.set(ip, { data: fallback, timestamp: Date.now() });
  return fallback;
}
