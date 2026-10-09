"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function TrackerLogic() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Never track internal admin routes or API routes
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Prevent duplicate firing on same path
    const fullPath = searchParams?.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    if (lastTrackedPath.current === fullPath) return;
    lastTrackedPath.current = fullPath;

    try {
      // Get or create persistent session ID in sessionStorage
      let sessionId = sessionStorage.getItem("nati_visitor_sid");
      if (!sessionId) {
        sessionId = `vs_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem("nati_visitor_sid", sessionId);
      }

      // Check for UTM parameters
      const utmSource = searchParams?.get("utm_source") || "";
      const utmMedium = searchParams?.get("utm_medium") || "";
      const utmCampaign = searchParams?.get("utm_campaign") || "";

      const referrer = document.referrer || "";
      const screenResolution = `${window.screen?.width || 0}x${window.screen?.height || 0}`;

      const payload = {
        path: fullPath,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        sessionId,
        screenResolution,
      };

      // Non-blocking beacon or fetch
      if (typeof navigator.sendBeacon === "function") {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon("/api/track", blob);
      } else {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Gracefully ignore tracking errors on client side
    }
  }, [pathname, searchParams]);

  return null;
}

export default function VisitorTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerLogic />
    </Suspense>
  );
}
