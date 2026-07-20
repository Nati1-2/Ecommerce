"use client";

import { useState } from "react";
import { useCheckoutStore } from "@/store/checkoutStore";
import { Tag, X, Check, Loader2 } from "lucide-react";

const VALID_COUPONS: Record<string, number> = {
  WELCOME10: 10,
  SAVE20: 20,
  FLASH50: 50,
  PREMIUM100: 100,
};

export default function CouponBox() {
  const { couponCode, discountAmount, applyCoupon, removeCoupon } =
    useCheckoutStore();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!input.trim()) return;
    setError("");
    setLoading(true);

    // Simulate API call POST /coupon/validate
    await new Promise((r) => setTimeout(r, 800));

    const code = input.trim().toUpperCase();
    const discount = VALID_COUPONS[code];

    if (discount) {
      applyCoupon(code, discount);
      setInput("");
    } else {
      setError("Invalid coupon code. Try WELCOME10.");
    }
    setLoading(false);
  };

  if (couponCode) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50">
        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-emerald-700">
            Code &quot;{couponCode}&quot; applied!
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">
            You save ${discountAmount.toFixed(2)}
          </p>
        </div>
        <button
          onClick={removeCoupon}
          className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-500 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            placeholder="Enter coupon code"
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#007BFF]/30"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-[#111827] hover:bg-gray-800 disabled:opacity-40 text-white font-bold text-xs transition-all shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Apply"
          )}
        </button>
      </div>
      {error && (
        <p className="text-[10px] font-bold text-red-500 pl-1">{error}</p>
      )}
    </div>
  );
}
