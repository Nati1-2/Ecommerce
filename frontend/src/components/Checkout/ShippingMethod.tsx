"use client";

import { Truck, Zap, Clock } from "lucide-react";
import { useCheckoutStore } from "@/store/checkoutStore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const SHIPPING_OPTIONS = [
  {
    id: "standard",
    name: "Standard Shipping",
    deliveryTime: "5–7 business days",
    price: 0,
    icon: Truck,
    description: "Free on all orders",
  },
  {
    id: "express",
    name: "Express Shipping",
    deliveryTime: "1–2 business days",
    price: 20,
    icon: Zap,
    description: "Priority handling & tracking",
  },
  {
    id: "same-day",
    name: "Same Day Delivery",
    deliveryTime: "Today before 9 PM",
    price: 40,
    icon: Clock,
    description: "Available in select metro areas",
  },
];

export default function ShippingMethod() {
  const { shippingMethodId, setShippingMethodId } = useCheckoutStore();

  return (
    <div className="space-y-5">
      <h3 className="text-base font-black text-gray-900">Select Delivery Method</h3>

      <div className="space-y-3">
        {SHIPPING_OPTIONS.map((option) => {
          const isSelected = shippingMethodId === option.id;
          const Icon = option.icon;

          return (
            <motion.div
              key={option.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => setShippingMethodId(option.id)}
              className={cn(
                "relative flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all select-none",
                isSelected
                  ? "border-[#007BFF] bg-blue-50/30 ring-2 ring-[#007BFF]/10 shadow-sm"
                  : "border-gray-100 hover:border-gray-300 bg-white"
              )}
            >
              {/* Radio dot */}
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all",
                  isSelected ? "border-[#007BFF]" : "border-gray-300"
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="shipping-radio"
                    className="w-2.5 h-2.5 rounded-full bg-[#007BFF]"
                  />
                )}
              </div>

              {/* Icon */}
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  isSelected ? "bg-[#007BFF] text-white" : "bg-gray-100 text-gray-500"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-gray-900">{option.name}</p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                  {option.description} • {option.deliveryTime}
                </p>
              </div>

              {/* Price */}
              <span
                className={cn(
                  "text-xs font-black shrink-0",
                  option.price === 0 ? "text-emerald-600" : "text-gray-900"
                )}
              >
                {option.price === 0 ? "FREE" : `$${option.price.toFixed(2)}`}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export { SHIPPING_OPTIONS };
