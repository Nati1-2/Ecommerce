"use client";

import { useEffect, useState } from "react";
import { useInventoryStore } from "@/store/inventoryStore";

/**
 * Socket.IO real-time stock monitoring hook.
 * Receives stock events from the configured socket server.
 */
export function useRealtimeStock(productId: string, initialStock: number) {
  const [stock, setStock] = useState(initialStock);
  const addSocketLog = useInventoryStore((state) => state.addSocketLog);

  useEffect(() => {
    setStock(initialStock);
    let socket: any;

    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || (isLocalhost ? "http://localhost:8009" : "");

    if (wsUrl) {
      import("socket.io-client").then(({ io }) => {
        socket = io(wsUrl, {
          autoConnect: false,
          reconnectionAttempts: 1,
          timeout: 2000,
        });

        socket.connect();

        socket.on("STOCK_UPDATED", (data: { id: string; stock: number; name?: string }) => {
          if (data.id === productId) {
            setStock(data.stock);
            addSocketLog("STOCK_UPDATED", `Stock updated for ${data.name || productId}: ${data.stock} units`);
          }
        });

        socket.on("LOW_STOCK_ALERT", (data: { id: string; stock: number; name?: string }) => {
          if (data.id === productId) {
            addSocketLog("LOW_STOCK_ALERT", `ALERT: Low stock warning for ${data.name || productId} (${data.stock} left)`);
          }
        });
      }).catch(() => {});
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [productId, initialStock, addSocketLog]);

  return stock;
}
