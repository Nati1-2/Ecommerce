"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { useCheckoutStore } from "@/store/checkoutStore";
import { SHIPPING_OPTIONS } from "./ShippingMethod";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PriceSummaryProps {
  onContinue: () => void;
  buttonLabel?: string;
  disabled?: boolean;
}

export default function PriceSummary({
  onContinue,
  buttonLabel = "Continue",
  disabled = false,
}: PriceSummaryProps) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const items = useCartStore((s) => s.items);
  const { shippingMethodId, discountAmount } = useCheckoutStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = mounted
    ? items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    : 0;
  const shippingCost =
    SHIPPING_OPTIONS.find((o) => o.id === shippingMethodId)?.price ?? 0;
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% tax
  const total = subtotal - discountAmount + shippingCost + tax;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
      {/* Collapsible header (mobile friendly) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 sm:hidden"
      >
        <span className="text-xs font-black text-gray-900">
          Order Summary • {formatPrice(total)}
        </span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Desktop always-visible header */}
      <div className="hidden sm:block p-5 pb-0">
        <h3 className="text-sm font-black text-gray-900">Order Summary</h3>
      </div>

      {/* Expandable body */}
      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        className="overflow-hidden sm:!h-auto sm:!opacity-100"
      >
        <div className="p-5 space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-semibold">Subtotal</span>
            <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-xs">
              <span className="text-emerald-600 font-semibold">Discount</span>
              <span className="font-bold text-emerald-600">
                -{formatPrice(discountAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-semibold">Shipping</span>
            <span className="font-bold text-gray-900">
              {shippingCost === 0 ? (
                <span className="text-emerald-600">FREE</span>
              ) : (
                formatPrice(shippingCost)
              )}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-semibold">Estimated Tax</span>
            <span className="font-bold text-gray-900">{formatPrice(tax)}</span>
          </div>

          <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between items-baseline">
            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">
              Total
            </span>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <div className="p-5 pt-0">
        <button
          onClick={onContinue}
          disabled={disabled}
          className="w-full py-3.5 bg-[#007BFF] hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
