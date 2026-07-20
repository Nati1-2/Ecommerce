"use client";

import { useTrackingStore } from "@/store/trackingStore";
import { Check, Truck, ClipboardCheck, Settings, Gift, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "Order Placed", label: "Order Placed", icon: Gift },
  { key: "Payment Confirmed", label: "Payment Confirmed", icon: ClipboardCheck },
  { key: "Order Processing", label: "Processing", icon: Settings },
  { key: "Shipped", label: "Shipped", icon: Truck },
  { key: "Out for Delivery", label: "Out For Delivery", icon: Truck },
  { key: "Delivered", label: "Delivered", icon: Home },
];

export default function TrackingTimeline() {
  const { orderStatus } = useTrackingStore();

  const getActiveIndex = () => {
    const idx = STEPS.findIndex((s) => s.key === orderStatus);
    return idx !== -1 ? idx : 2; // Default mock Processing state
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-6 select-none">
      <h3 className="text-sm font-black text-gray-900">Delivery Milestones</h3>

      {/* Horizontal timeline for tablet/desktop, vertical list fallback on mobile */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 overflow-visible">
        
        {/* Progress track background line (desktop only) */}
        <div className="hidden md:block absolute left-4 right-4 top-[18px] h-0.5 bg-gray-100 -z-10" />

        {STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isActive = idx === activeIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.key}
              className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 md:text-center group"
            >
              {/* Animated Node Circle */}
              <div
                className={cn(
                  "w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 relative z-10",
                  isCompleted
                    ? "bg-[#16A34A] border-[#16A34A] text-white shadow-sm"
                    : isActive
                    ? "bg-white border-[#007BFF] text-[#007BFF] ring-4 ring-[#007BFF]/10 scale-110"
                    : "bg-white border-gray-200 text-gray-300"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3px]" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}

                {/* Pulsing indicator core */}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white animate-ping" />
                )}
              </div>

              {/* Step info label */}
              <div className="text-left md:text-center space-y-0.5">
                <p
                  className={cn(
                    "text-xs font-black transition-colors leading-snug",
                    isActive ? "text-[#007BFF]" : isCompleted ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[9px] text-gray-400 font-semibold leading-tight md:hidden">
                  {isActive ? "Current milestone" : isCompleted ? "Milestone reached" : "Milestone pending"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
