"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { ClickEventType } from "@/types/userActivity";

export default function UserActionRecorder() {
  const pathname = usePathname() || "/";
  const user = useAuthStore((s) => s.user);
  const lastClickTimeRef = useRef<number>(0);
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    // Generate or read persistent anonymous session ID
    if (typeof window !== "undefined") {
      let sid = sessionStorage.getItem("nati_tracker_session_id");
      if (!sid) {
        sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        sessionStorage.setItem("nati_tracker_session_id", sid);
      }
      sessionIdRef.current = sid;
    }

    const handleClickCapture = (e: MouseEvent) => {
      // Simple debounce: avoid duplicate spam if clicked within 150ms
      const now = Date.now();
      if (now - lastClickTimeRef.current < 150) return;
      lastClickTimeRef.current = now;

      try {
        const target = e.target as HTMLElement | null;
        if (!target) return;

        // Skip sensitive fields like password inputs
        if (
          target.tagName === "INPUT" &&
          (target as HTMLInputElement).type === "password"
        ) {
          return;
        }

        // Find nearest interactive ancestor (button, a, role=button, input)
        const interactive =
          target.closest("button, a, input, select, textarea, [role='button']") ||
          target;

        const tag = interactive.tagName || "DIV";
        let text =
          interactive.getAttribute("aria-label") ||
          interactive.getAttribute("title") ||
          interactive.textContent?.trim() ||
          (interactive as HTMLInputElement).placeholder ||
          interactive.getAttribute("data-action") ||
          "";

        // Clean text and truncate
        text = text.replace(/\s+/g, " ").substring(0, 100);
        if (!text) {
          text = `${tag} (${interactive.className.split(" ")[0] || "element"})`;
        }

        // Classify event type
        const lowerText = text.toLowerCase();
        let eventType: ClickEventType = "CLICK";

        if (tag === "BUTTON") {
          eventType = "BUTTON_CLICK";
          if (lowerText.includes("cart")) eventType = "ADD_TO_CART_CLICK";
          else if (lowerText.includes("checkout") || lowerText.includes("pay"))
            eventType = "CHECKOUT_CLICK";
          else if (lowerText.includes("donate") || lowerText.includes("support"))
            eventType = "DONATE_CLICK";
          else if (lowerText.includes("filter")) eventType = "FILTER_CLICK";
        } else if (tag === "A") {
          eventType = "LINK_CLICK";
          if (lowerText.includes("cart")) eventType = "ADD_TO_CART_CLICK";
          else if (lowerText.includes("checkout")) eventType = "CHECKOUT_CLICK";
          else eventType = "NAV_CLICK";
        } else if (lowerText.includes("search")) {
          eventType = "SEARCH_SUBMIT";
        }

        // Collect coordinates and screen info
        const coordinates = { x: e.clientX, y: e.clientY };
        const screenResolution = `${window.innerWidth}×${window.innerHeight}`;

        const payload = {
          eventType,
          targetTag: tag,
          elementText: text,
          elementId: interactive.id || "",
          elementClass: interactive.className ? String(interactive.className).substring(0, 80) : "",
          coordinates,
          path: pathname,
          user: user
            ? {
                id: user.id || "usr_auth",
                email: user.email,
                name: user.name || "Customer",
                role: user.role || "CUSTOMER",
              }
            : {
                id: "guest_" + sessionIdRef.current.substring(5, 12),
                email: "guest@natistore.com",
                name: "Guest Visitor",
                role: "GUEST",
              },
          sessionId: sessionIdRef.current,
          screenResolution,
        };

        // Asynchronously post telemetry to /api/track/activity
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/track/activity", JSON.stringify(payload));
        } else {
          fetch("/api/track/activity", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true,
          }).catch(() => {
            // Non-blocking telemetry
          });
        }
      } catch (err) {
        // Completely passive, never break user experience
      }
    };

    window.addEventListener("click", handleClickCapture, { passive: true, capture: true });
    return () => {
      window.removeEventListener("click", handleClickCapture, { capture: true });
    };
  }, [pathname, user]);

  return null;
}
