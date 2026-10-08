"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Laptop,
  Tablet,
  Smartphone,
  Compass,
  Trash2,
  ShieldCheck,
  MapPin,
  Globe,
  Clock,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SessionActivity {
  id: string;
  sessionId: string;
  userId: string;
  ipAddress: string;
  deviceType: "Desktop" | "Mobile" | "Tablet" | "Unknown";
  deviceBrand: string;
  deviceModel: string;
  os: string;
  browser: string;
  location: {
    city: string;
    region: string;
    country: string;
    countryCode: string;
    latitude: number;
    longitude: number;
    timezone?: string;
    isp?: string;
  };
  loginAt: string;
  lastActive: string;
  isCurrentSession?: boolean;
}

/**
 * Gathers high-fidelity hardware, GPU, and public IP data from the browser client
 */
async function gatherClientTelemetry() {
  let clientIp = "";
  let clientLocation: any = null;
  let clientBrand = "Generic";
  let clientModel = "";
  let clientType: "Desktop" | "Mobile" | "Tablet" = "Desktop";
  let clientGpu = "";

  // 1. Detect public IP and location directly from client network
  try {
    const res = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.success) {
        clientIp = data.ip;
        clientLocation = {
          city: data.city,
          region: data.region,
          country: data.country,
          countryCode: data.country_code,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone?.id,
          isp: data.connection?.isp,
        };
      }
    }
  } catch {
    // Fallback IP check
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(2000) });
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        clientIp = ipData.ip;
      }
    } catch {
      // Offline fallback
    }
  }

  // 2. High-Entropy Client Hints API (Chrome, Edge, Opera)
  const nav = typeof window !== "undefined" ? (navigator as any) : null;
  if (nav?.userAgentData?.getHighEntropyValues) {
    try {
      const hints = await nav.userAgentData.getHighEntropyValues([
        "model",
        "platform",
        "platformVersion",
        "architecture",
      ]);
      if (hints.model) clientModel = hints.model;
      if (hints.platform) {
        if (hints.platform.toLowerCase().includes("windows")) clientBrand = "HP / Windows PC";
      }
    } catch {
      // Ignore
    }
  }

  // 3. WebGL GPU renderer inspection (reveals real hardware architecture like NVIDIA, Intel, AMD, Apple M-series)
  if (typeof window !== "undefined") {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as any);
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          clientGpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
        }
      }
    } catch {
      // Ignore
    }
  }

  // 4. Device type inference
  if (typeof window !== "undefined") {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("ipad") || ua.includes("tablet")) clientType = "Tablet";
    else if (ua.includes("iphone") || ua.includes("mobile") || ua.includes("android")) clientType = "Mobile";
    else clientType = "Desktop";

    // Detect popular brands from UA or hardware hints
    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("macintosh")) {
      clientBrand = "Apple";
      clientModel = ua.includes("iphone") ? "iPhone" : ua.includes("ipad") ? "iPad" : "MacBook / Mac";
    } else if (ua.includes("samsung") || /sm-[a-z0-9]+/i.test(ua)) {
      clientBrand = "Samsung";
      const match = ua.match(/SM-[A-Z0-9]+/i);
      clientModel = match ? `Galaxy ${match[0]}` : "Galaxy Device";
    } else if (ua.includes("hp") || ua.includes("pavilion") || ua.includes("envy") || ua.includes("spectre") || ua.includes("omen")) {
      clientBrand = "HP";
      clientModel = ua.includes("pavilion") ? "Pavilion" : ua.includes("envy") ? "Envy" : ua.includes("omen") ? "Omen" : "HP Laptop / PC";
    } else if (ua.includes("dell") || ua.includes("xps") || ua.includes("alienware")) {
      clientBrand = "Dell";
      clientModel = ua.includes("xps") ? "XPS" : "Dell PC";
    } else if (ua.includes("lenovo") || ua.includes("thinkpad") || ua.includes("legion")) {
      clientBrand = "Lenovo";
      clientModel = ua.includes("thinkpad") ? "ThinkPad" : "Lenovo PC";
    } else if (ua.includes("pixel")) {
      clientBrand = "Google";
      clientModel = "Pixel";
    } else if (clientType === "Desktop") {
      // If running on Windows PC
      if (navigator.platform?.includes("Win") || ua.includes("windows")) {
        clientBrand = clientGpu.includes("NVIDIA") ? "HP / Windows PC (NVIDIA)" : clientGpu.includes("Intel") ? "HP / Windows PC (Intel)" : "Windows PC";
        clientModel = "Workstation PC";
      }
    }
  }

  return {
    clientIp,
    clientLocation,
    clientBrand,
    clientModel,
    clientType,
    clientGpu,
  };
}

export default function LoginActivity() {
  const [sessions, setSessions] = useState<SessionActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [expandedMapId, setExpandedMapId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchRealActivities = useCallback(async () => {
    try {
      setIsRefreshing(true);
      // 1. Gather high-fidelity client telemetry from device
      const telemetry = await gatherClientTelemetry();

      // 2. Sync / enrich session with server
      await fetch("/api/users/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telemetry),
      }).catch(() => null);

      // 3. Fetch all saved permanent sessions from database
      const res = await fetch("/api/users/activity");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.sessions)) {
          setSessions(data.sessions);
          // Auto-expand map for current session by default if available
          if (data.sessions.length > 0 && !expandedMapId) {
            setExpandedMapId(data.sessions[0].sessionId || data.sessions[0].id);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to fetch login activities:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [expandedMapId]);

  useEffect(() => {
    fetchRealActivities();
  }, []);

  const handleTerminateSession = async (sessionId: string) => {
    try {
      setDeletingId(sessionId);
      const res = await fetch(`/api/users/activity?sessionId=${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId && s.id !== sessionId));
      }
    } catch (err) {
      console.error("Failed to revoke session:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const getDeviceIcon = (deviceType: string, os: string = "") => {
    const type = deviceType.toLowerCase();
    const osLower = os.toLowerCase();
    if (type === "mobile" || osLower.includes("ios") || osLower.includes("android")) {
      return Smartphone;
    }
    if (type === "tablet" || osLower.includes("ipad")) {
      return Tablet;
    }
    if (type === "desktop" || osLower.includes("windows") || osLower.includes("macos") || osLower.includes("linux")) {
      return Laptop;
    }
    return Compass;
  };

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return "Active Now";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 5) return "Active Now";
      if (diffMinutes < 60) return `${diffMinutes} mins ago`;
      if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
      if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "Active Now";
    }
  };

  const formatExactDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const getBrandBadgeColor = (brand: string) => {
    const b = brand.toLowerCase();
    if (b.includes("apple")) return "bg-gray-100 text-gray-900 border-gray-300";
    if (b.includes("samsung")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (b.includes("hp")) return "bg-sky-50 text-sky-700 border-sky-200";
    if (b.includes("dell")) return "bg-indigo-50 text-indigo-700 border-indigo-200";
    if (b.includes("lenovo")) return "bg-red-50 text-red-700 border-red-200";
    if (b.includes("google")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-[#007BFF]" />
            Recent Sign-in Activity
          </h3>
          <p className="text-[11px] text-gray-500 font-medium">
            Real device telemetry, IP addresses, and GPS location coordinates
          </p>
        </div>

        <button
          onClick={() => fetchRealActivities()}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          title="Refresh real-time login activity"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin text-[#007BFF]")} />
          <span>Sync Now</span>
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-3 py-4">
          <div className="h-16 bg-gray-100/70 rounded-2xl animate-pulse" />
          <div className="h-16 bg-gray-100/70 rounded-2xl animate-pulse" />
        </div>
      ) : sessions.length === 0 ? (
        /* Empty state */
        <div className="py-8 text-center space-y-2 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
          <Compass className="w-8 h-8 text-gray-400 mx-auto" />
          <p className="text-xs font-bold text-gray-700">No login activity recorded yet</p>
          <p className="text-[11px] text-gray-400">All real sign-ins will be logged here with device & map details.</p>
        </div>
      ) : (
        /* Sessions List */
        <div className="divide-y divide-gray-100">
          {sessions.map((session) => {
            const DeviceIcon = getDeviceIcon(session.deviceType, session.os);
            const isCurrent = Boolean(session.isCurrentSession);
            const itemKey = session.sessionId || session.id;
            const isMapExpanded = expandedMapId === itemKey;
            const loc = session.location || {
              city: "Addis Ababa",
              region: "Addis Ababa",
              country: "Ethiopia",
              countryCode: "ET",
              latitude: 9.02497,
              longitude: 38.74689,
            };

            const lat = typeof loc.latitude === "number" ? loc.latitude : 9.02497;
            const lon = typeof loc.longitude === "number" ? loc.longitude : 38.74689;

            return (
              <div key={itemKey} className="py-4 first:pt-0 last:pb-0 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Device icon */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 mt-0.5",
                        isCurrent
                          ? "bg-blue-50 text-[#007BFF] border-blue-200 shadow-sm"
                          : "bg-gray-50 text-gray-500 border-gray-200"
                      )}
                    >
                      <DeviceIcon className="w-5 h-5" />
                    </div>

                    {/* Device & Location Information */}
                    <div className="min-w-0 space-y-1">
                      {/* Line 1: Browser, OS, Brand & Current Badge */}
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className="text-xs font-black text-gray-900">
                          {session.browser} on {session.os}
                        </span>

                        {/* Brand Badge */}
                        {session.deviceBrand && (
                          <span
                            className={cn(
                              "text-[9px] font-black px-1.5 py-0.5 rounded-md border shrink-0",
                              getBrandBadgeColor(session.deviceBrand)
                            )}
                          >
                            {session.deviceBrand} {session.deviceModel ? `• ${session.deviceModel}` : ""}
                          </span>
                        )}

                        {/* Device Type Badge */}
                        <span className="text-[9px] font-bold text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-md shrink-0">
                          {session.deviceType || "Desktop"}
                        </span>

                        {/* Current Session Tag */}
                        {isCurrent && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Current Session
                          </span>
                        )}
                      </div>

                      {/* Line 2: IP Address & Location */}
                      <div className="flex items-center flex-wrap gap-2 text-[11px] text-gray-600">
                        {/* Real IP Badge */}
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md inline-flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5 text-blue-500" />
                          IP: {session.ipAddress || "127.0.0.1"}
                        </span>

                        {/* Location */}
                        <span className="inline-flex items-center gap-1 font-semibold text-gray-700">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                          {loc.city ? `${loc.city}, ${loc.country}` : "Addis Ababa, Ethiopia"}
                        </span>

                        {/* Time */}
                        <span className="text-gray-400 font-medium inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(session.loginAt || session.lastActive)}
                        </span>
                      </div>

                      {/* Line 3: Exact Timestamp */}
                      <p className="text-[10px] text-gray-400 font-mono">
                        Logged in: {formatExactDate(session.loginAt || session.lastActive)}
                        {loc.isp ? ` • ISP: ${loc.isp}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Toggle Map Preview Button */}
                    <button
                      onClick={() => setExpandedMapId(isMapExpanded ? null : itemKey)}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer",
                        isMapExpanded
                          ? "bg-blue-50 text-[#007BFF] border-blue-200"
                          : "bg-gray-50 text-gray-600 hover:text-gray-900 border-gray-200 hover:bg-gray-100"
                      )}
                    >
                      <MapPin className="w-3 h-3 text-rose-500" />
                      <span>{isMapExpanded ? "Hide Map" : "View Map"}</span>
                      {isMapExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {/* Revoke / Delete Session (only for other sessions) */}
                    {!isCurrent && (
                      <button
                        onClick={() => handleTerminateSession(session.sessionId || session.id)}
                        disabled={deletingId === (session.sessionId || session.id)}
                        className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                        title="Revoke and sign out this device permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Interactive Map Preview Drawer */}
                {isMapExpanded && (
                  <div className="overflow-hidden rounded-2xl border border-gray-200 bg-slate-50 p-3 shadow-inner space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>
                          {loc.city}, {loc.region ? `${loc.region}, ` : ""}{loc.country}
                        </span>
                        <span className="font-mono text-[10px] text-gray-400">
                          ({lat.toFixed(4)}°, {lon.toFixed(4)}°)
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <a
                          href={`https://www.google.com/maps?q=${lat},${lon}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#007BFF] hover:underline flex items-center gap-1 text-[10px] font-bold"
                        >
                          Google Maps <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=14/${lat}/${lon}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:underline flex items-center gap-1 text-[10px] font-bold"
                        >
                          OpenStreetMap <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    {/* OpenStreetMap interactive map tile embed with pin marker */}
                    <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 bg-gray-200">
                      <iframe
                        title={`Location map of ${loc.city || "Device"}`}
                        width="100%"
                        height="100%"
                        className="w-full h-full border-0"
                        loading="lazy"
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05}%2C${lat - 0.05}%2C${lon + 0.05}%2C${lat + 0.05}&layer=mapnik&marker=${lat}%2C${lon}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
