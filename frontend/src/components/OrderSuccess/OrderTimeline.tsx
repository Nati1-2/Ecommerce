"use client";

import { Check, Dot } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderTimelineProps {
  status: string;
}

const TIMELINE_STEPS = [
  { key: "placed", label: "Order Placed", desc: "Order details received" },
  { key: "payment", label: "Payment Confirmed", desc: "Payment cleared via Stripe" },
  { key: "preparing", label: "Preparing Shipment", desc: "Packaging items in fulfillment" },
  { key: "shipped", label: "Shipped", desc: "In transit with local carrier" },
  { key: "delivered", label: "Delivered", desc: "Arrived at your destination" },
];

export default function OrderTimeline({ status }: OrderTimelineProps) {
  // We mock active indexes:
  // "placed" index 0, "payment" index 1, "preparing" index 2, "shipped" index 3, "delivered" index 4
  const activeIndex = 2; // Default mock "Preparing shipment" state

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-5 select-none">
      <h3 className="text-sm font-black text-gray-900">Order Timeline</h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
        {TIMELINE_STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;

          return (
            <div key={step.key} className="relative flex gap-4 items-start text-left">
              {/* Node dot check */}
              <div
                className={cn(
                  "absolute -left-5 top-0.5 w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center transition-colors z-10",
                  isCompleted
                    ? "bg-[#16A34A] border-[#16A34A] text-white"
                    : isActive
                    ? "bg-blue-50 border-[#007BFF] text-[#007BFF]"
                    : "bg-white border-gray-200 text-gray-300"
                )}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 stroke-[3.5px]" />
                ) : isActive ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#007BFF] animate-pulse" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-gray-200" />
                )}
              </div>

              {/* Step info */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-xs font-black leading-snug transition-colors",
                    isActive ? "text-[#007BFF]" : isCompleted ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5 leading-snug">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
