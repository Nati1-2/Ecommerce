"use client";

import { OrderItem } from "@/types";
import { formatPrice } from "@/lib/utils";

interface OrderSummaryProps {
  items: OrderItem[];
}

export default function OrderSummary({ items }: OrderSummaryProps) {
  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <h3 className="text-sm font-black text-gray-900">Items Ordered</h3>

      <div className="divide-y divide-gray-100">
        {items.map((item, idx) => (
          <div
            key={item.productId}
            className={`flex items-center gap-4 py-4 ${idx === 0 ? "pt-0" : ""} ${
              idx === items.length - 1 ? "pb-0" : ""
            }`}
          >
            {/* Product Image */}
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="max-w-full max-h-full object-contain p-1"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-black text-gray-900 truncate">
                {item.name}
              </h4>
              {item.variant && (
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5 truncate">
                  Style: {item.variant}
                </p>
              )}
              <p className="text-[10px] text-gray-400 font-bold mt-1">
                Qty: {item.quantity} • {formatPrice(item.price)}
              </p>
            </div>

            {/* Price */}
            <span className="text-xs font-black text-gray-900 shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
