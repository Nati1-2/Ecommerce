"use client";

import { useEffect, useState } from "react";
import { useProfileStore } from "@/store/profileStore";
import { Laptop, Tablet, Smartphone, Compass, Trash2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginActivity() {
  const { security, removeDevice } = useProfileStore();
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    // 1. Detect OS
    const ua = typeof window !== "undefined" ? navigator.userAgent : "";
    let os = "Windows";
    if (ua.indexOf("Windows") !== -1) os = "Windows";
    else if (ua.indexOf("Macintosh") !== -1) os = "macOS";
    else if (ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1) os = "iOS";
    else if (ua.indexOf("Android") !== -1) os = "Android";
    else if (ua.indexOf("Linux") !== -1) os = "Linux";

    // 2. Detect Browser
    let browser = "Chrome";
    if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
    else if (ua.indexOf("Opera") !== -1 || ua.indexOf("OPR") !== -1) browser = "Opera";
    else if (ua.indexOf("Edg") !== -1) browser = "Edge";
    else if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
    else if (ua.indexOf("Safari") !== -1) browser = "Safari";

    // 3. Set dynamic device list
    const initialDevices = [
      { id: "current-session", browser, os, location: "Detecting location...", time: "Active Now" },
      { id: "dev-2", browser: "Safari", os: "iOS", location: "New York, USA", time: "2 hours ago" },
      { id: "dev-3", browser: "Firefox", os: "macOS", location: "London, UK", time: "3 days ago" },
    ];
    setDevices(initialDevices);

    // 4. Fetch real location
    fetch("https://ipapi.co/json/")
      .then((res) => {
        if (!res.ok) throw new Error("Location fetch failed");
        return res.json();
      })
      .then((data) => {
        if (data.city && data.country_name) {
          setDevices((prev) =>
            prev.map((d) =>
              d.id === "current-session"
                ? { ...d, location: `${data.city}, ${data.country_name}` }
                : d
            )
          );
        }
      })
      .catch(() => {
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "United States";
          const city = tz.split("/").pop()?.replace("_", " ") || "United States";
          setDevices((prev) =>
            prev.map((d) =>
              d.id === "current-session" ? { ...d, location: `${city}, Local` } : d
            )
          );
        } catch {
          setDevices((prev) =>
            prev.map((d) =>
              d.id === "current-session" ? { ...d, location: "United States" } : d
            )
          );
        }
      });
  }, []);

  const getDeviceIcon = (os: string) => {
    switch (os.toLowerCase()) {
      case "windows":
      case "macos":
        return Laptop;
      case "ios":
      case "android":
        return Smartphone;
      default:
        return Compass;
    }
  };

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
          <ShieldAlert className="w-4.5 h-4.5 text-gray-400" />
          Recent Sign-in Activity
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {devices.map((device, idx) => {
          const DeviceIcon = getDeviceIcon(device.os);
          const isCurrent = device.time === "Active Now";

          return (
            <div
              key={device.id}
              className={cn(
                "flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0",
                isCurrent && "group"
              )}
            >
              <div className="flex items-center gap-3.5">
                {/* Round icon */}
                <div className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center border shrink-0",
                  isCurrent ? "bg-blue-50 text-[#007BFF] border-blue-100/50" : "bg-gray-50 text-gray-400 border-gray-100"
                )}>
                  <DeviceIcon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-gray-900">
                      {device.browser} on {device.os}
                    </span>
                    {isCurrent && (
                      <span className="text-[8px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-full shrink-0">
                        Current Session
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                    {device.location} • {device.time}
                  </p>
                </div>
              </div>

              {/* Terminate button */}
              {!isCurrent && (
                <button
                  onClick={() => {
                    setDevices((prev) => prev.filter((d) => d.id !== device.id));
                    removeDevice(device.id);
                  }}
                  className="p-2 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-100 rounded-xl transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
