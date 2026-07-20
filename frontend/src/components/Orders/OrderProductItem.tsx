"use client";

import { OrderItem } from "@/types";
import { formatPrice } from "@/lib/utils";

interface OrderProductItemProps {
  item: OrderItem;
}

export default function OrderProductItem({ item }: OrderProductItemProps) {
  return (
    <div className="flex items-center gap-4 py-3 select-none">
      {/* image */}
      <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="max-w-full max-h-full object-contain p-0.5"
        />
      </div>

      {/* info details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-black text-gray-900 truncate">
          {item.name}
        </h4>
        {item.variant && (
          <p className="text-[9px] text-gray-400 font-semibold mt-0.5 truncate">
            Variant: {item.variant}
          </p>
        )}
        <p className="text-[10px] text-gray-400 font-bold mt-1">
          Qty: {item.quantity} • {formatPrice(item.price)}
        </p>
      </div>

      {/* price */}
      <span className="text-xs font-black text-gray-900 shrink-0">
        {formatPrice(item.price * item.quantity)}
      </span>
    </div>
  );
}
