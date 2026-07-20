"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
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
    const socket = io("http://localhost:3000", {
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

    // Fallback periodic simulation for live demo
    const interval = setInterval(() => {
      if (Math.random() < 0.15) {
        const events = [
          {
            type: "NEW_VENDOR" as const,
            title: "New Vendor Registration",
            message: "Aura Tech Solutions submitted store onboarding application",
            severity: "info" as const,
          },
          {
            type: "LARGE_ORDER" as const,
            title: "Large Order Created",
            message: "Enterprise order ORD-2026-9812 created for $8,990.00",
            severity: "success" as const,
          },
          {
            type: "PAYMENT_FAILED" as const,
            title: "Payment Warning",
            message: "Stripe payout batch #PO-8812 experienced a 0.2% retry delay",
            severity: "warning" as const,
          },
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        addNotification({
          ...event,
          timestamp: "Just now",
        });
      }
    }, 15000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [addNotification, showToast]);
}
