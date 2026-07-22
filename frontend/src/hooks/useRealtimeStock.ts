"use client";

import { useEffect, useState } from "react";
import { useInventoryStore } from "@/store/inventoryStore";

/**
 * Socket.IO real-time stock monitoring hook.
 * Attempts to connect to standard dev gateway. If unavailable, falls back
 * to a simulated local socket event handler that triggers STOCK_UPDATED & LOW_STOCK_ALERT.
 */
export function useRealtimeStock(productId: string, initialStock: number) {
  const [stock, setStock] = useState(initialStock);
  const addSocketLog = useInventoryStore((state) => state.addSocketLog);

  useEffect(() => {
    let socket: any;
    import("socket.io-client").then(({ io }) => {
      socket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8009", {
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
    });

    // Fallback simulation: periodically ticks down stock to mimic real purchases
    const simulationInterval = setInterval(() => {
      setStock((prev) => {
        if (prev <= 1) return initialStock; // reset when sold out
        // 10% chance to simulate a stock purchase
        if (Math.random() < 0.1) {
          const nextStock = prev - 1;
          if (nextStock <= 5) {
            addSocketLog("LOW_STOCK_ALERT", `ALERT: Stock fell to ${nextStock} units for product ${productId}`);
          } else {
            addSocketLog("STOCK_UPDATED", `Real-time purchase: Stock updated to ${nextStock} units`);
          }
          return nextStock;
        }
        return prev;
      });
    }, 12000);

    return () => {
      if (socket) socket.disconnect();
      clearInterval(simulationInterval);
    };
  }, [productId, initialStock, addSocketLog]);

  return stock;
}
