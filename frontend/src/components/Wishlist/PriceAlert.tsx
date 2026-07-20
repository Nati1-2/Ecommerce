"use client";

import { useWishlistStore } from "@/store/wishlist";
import { Bell, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceAlertProps {
  productId: string;
  enabled: boolean;
}

export default function PriceAlert({ productId, enabled }: PriceAlertProps) {
  const { togglePriceAlert } = useWishlistStore();

  return (
    <button
      onClick={() => togglePriceAlert(productId)}
      className={cn(
        "p-1.5 rounded-lg border transition-colors flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-wider shrink-0",
        enabled
          ? "bg-amber-50 text-amber-600 border-amber-200"
          : "bg-gray-50 text-gray-400 hover:text-gray-600 border-gray-200"
      )}
      title={enabled ? "Disable Price Alerts" : "Enable Price Alerts"}
    >
      {enabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
      <span>{enabled ? "Alert On" : "Alert Off"}</span>
    </button>
  );
}
