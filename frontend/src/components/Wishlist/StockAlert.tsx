"use client";

import { useState } from "react";
import { registerStockAlert } from "@/lib/api";
import { BellRing, Loader2, Check } from "lucide-react";

interface StockAlertProps {
  productId: string;
}

export default function StockAlert({ productId }: StockAlertProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleNotify = async () => {
    setLoading(true);
    try {
      await registerStockAlert(productId);
      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleNotify}
      disabled={loading || success}
      className="w-full py-2 px-3 border border-dashed border-amber-250 bg-amber-50/30 hover:bg-amber-50 text-amber-700 font-bold text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : success ? (
        <Check className="w-3.5 h-3.5 text-emerald-600" />
      ) : (
        <BellRing className="w-3.5 h-3.5 text-amber-500" />
      )}
      <span>{success ? "Alert Configured" : "Notify when available"}</span>
    </button>
  );
}
