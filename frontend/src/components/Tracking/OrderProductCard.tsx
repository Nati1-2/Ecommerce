"use client";

import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

export default function OrderProductCard() {
  const items = useCartStore((s) => s.items);

  // Fallback products if cart is empty
  const displayItems =
    items.length > 0
      ? items.slice(0, 2)
      : [
          {
            productId: "0",
            name: "Apple iPhone 17 Pro",
            price: 1199,
            quantity: 1,
            image: "/iphone17.png",
          },
        ];

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none">
      <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
        <ShoppingBag className="w-4.5 h-4.5 text-gray-400" />
        Items in Shipment
      </h3>

      <div className="divide-y divide-gray-100">
        {displayItems.map((item, idx) => (
          <div
            key={item.productId}
            className={`flex items-center gap-4 py-3.5 ${idx === 0 ? "pt-0" : ""} ${
              idx === displayItems.length - 1 ? "pb-0" : ""
            }`}
          >
            {/* Product image */}
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
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
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                Quantity: {item.quantity} • {formatPrice(item.price)}
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
