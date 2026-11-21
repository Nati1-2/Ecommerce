"use client";

import { useEffect } from "react";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";

/**
 * Socket.IO real-time monitoring hook for platform admin.
 * Listens for system notifications:
 * - NEW_VENDOR
 * - LARGE_ORDER
 * - PAYMENT_FAILED
 * - PRODUCT_REPORTED
 */
export function useAdminRealtime() {
  const addNotification = useAdminDashboardStore((state) => state.addNotification);
  const showToast = useAdminDashboardStore((state) => state.showToast);

  useEffect(() => {
    let socket: any;

    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    // Only attempt socket connection if an explicit external WS URL is configured, or running locally
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || (isLocalhost ? "http://localhost:8009" : "");

    if (wsUrl) {
      import("socket.io-client").then(({ io }) => {
        socket = io(wsUrl, {
          autoConnect: false,
          reconnectionAttempts: 1,
          timeout: 2000,
        });

        socket.connect();

        socket.on("NEW_VENDOR", (data: { storeName: string }) => {
          addNotification({
            type: "NEW_VENDOR",
            title: "New Vendor Registration",
            message: `${data.storeName} submitted verification request`,
            timestamp: "Just now",
            severity: "info",
          });
          showToast(`New Vendor Registered: ${data.storeName}`, "info");
        });

        socket.on("LARGE_ORDER", (data: { orderId: string; amount: number }) => {
          addNotification({
            type: "LARGE_ORDER",
            title: "High Value Order",
            message: `Order #${data.orderId} placed for $${data.amount.toLocaleString()}`,
            timestamp: "Just now",
            severity: "success",
          });
          showToast(`High Value Order #${data.orderId}`, "success");
        });
      }).catch(() => {
        // Ignore socket import error
      });
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [addNotification, showToast]);
}
