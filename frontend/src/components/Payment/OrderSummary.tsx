"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { useCheckoutStore } from "@/store/checkoutStore";
import { SHIPPING_OPTIONS } from "@/components/Checkout/ShippingMethod";
import { formatPrice } from "@/lib/utils";
import { ChevronDown, ChevronUp, ShoppingBag, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSummary() {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const items = useCartStore((s) => s.items);
  const { shippingMethodId, discountAmount, couponCode } = useCheckoutStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = mounted
    ? items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    : 0;

  const shippingCost =
    SHIPPING_OPTIONS.find((o) => o.id === shippingMethodId)?.price ?? 0;

  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% sales tax
  const total = Math.max(0, subtotal - discountAmount + shippingCost + tax);

  if (!mounted) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden select-none">
      {/* Header section toggle (mobile) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 sm:hidden"
      >
        <span className="text-xs font-black text-gray-900 flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-gray-500" />
          Order Summary ({items.length})
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-gray-900">
            {formatPrice(total)}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Desktop static header */}
      <div className="hidden sm:flex items-center justify-between p-5 pb-0">
        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-gray-400" />
          Order Summary
        </h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        className="overflow-hidden sm:!h-auto sm:!opacity-100"
      >
        <div className="p-5 space-y-4">
          {/* Scrollable products list */}
          <div className="max-h-52 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-3.5 p-3 rounded-2xl border border-gray-100 bg-gray-50/30"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden flex items-center justify-center shrink-0 border border-gray-100/50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-w-full max-h-full object-contain p-0.5"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                    Qty: {item.quantity} • {formatPrice(item.price)}
                  </p>
                </div>
                <span className="text-xs font-black text-gray-900 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="space-y-2.5 border-t border-gray-100 pt-4 text-xs font-semibold">
            <div className="flex justify-between">
              <span className="text-gray-500 font-bold">Subtotal</span>
              <span className="text-gray-900 font-black">{formatPrice(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  Discount ({couponCode})
                </span>
                <span className="text-emerald-600 font-black">
                  -{formatPrice(discountAmount)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-500 font-bold">Shipping</span>
              <span className="text-gray-900 font-black">
                {shippingCost === 0 ? (
                  <span className="text-emerald-600">FREE</span>
                ) : (
                  formatPrice(shippingCost)
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500 font-bold">Estimated Tax</span>
              <span className="text-gray-900 font-black">{formatPrice(tax)}</span>
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
        </div>
      </motion.div>
    </div>
  );
}
