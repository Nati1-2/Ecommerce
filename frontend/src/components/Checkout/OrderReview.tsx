"use client";

import { useEffect, useState } from "react";
import { useCartStore, CartItem } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function OrderReview() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayItems: CartItem[] = mounted
    ? items
    : [];

  if (displayItems.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-base font-black text-gray-900">Order Review</h3>
        <div className="p-8 rounded-2xl border border-gray-100 bg-gray-50 text-center">
          <p className="text-sm text-gray-400 font-semibold">Your cart is empty.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-gray-900">Order Review</h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {displayItems.length} {displayItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="space-y-3">
        {displayItems.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white"
          >
            {/* Product Image */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#F5F7FA] overflow-hidden shrink-0 flex items-center justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="max-w-full max-h-full object-contain p-1"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-xs font-black text-gray-900 truncate">{item.name}</p>
              <p className="text-[10px] text-gray-400 font-semibold">
                Qty: {item.quantity}
              </p>
            </div>

            {/* Price */}
            <p className="text-sm font-black text-gray-900 shrink-0">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
