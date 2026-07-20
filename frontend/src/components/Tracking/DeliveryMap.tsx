"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation, Compass } from "lucide-react";
import { useTrackingStore } from "@/store/trackingStore";

export default function DeliveryMap() {
  const { orderStatus } = useTrackingStore();

  // Determine progress node percent
  const getProgressPercent = () => {
    switch (orderStatus) {
      case "Order Placed":
        return 0;
      case "Payment Confirmed":
        return 0.15;
      case "Order Processing":
        return 0.35;
      case "Shipped":
        return 0.6;
      case "Out for Delivery":
        return 0.85;
      case "Delivered":
        return 1.0;
      default:
        return 0.5;
    }
  };

  const progress = getProgressPercent();

  // Courier position calculation along the SVG path
  const courierX = 60 + progress * 280;
  const courierY = 120 - Math.sin(progress * Math.PI) * 45;

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-4 select-none relative overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
          <Compass className="w-4.5 h-4.5 text-gray-400" />
          Delivery Map Route
        </h3>
        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
          Live Tracking Enabled
        </span>
      </div>

      {/* SVG Interactive Delivery Route Grid Map */}
      <div className="relative aspect-video w-full border border-gray-100 bg-slate-50/50 rounded-2xl overflow-hidden flex items-center justify-center">
        {/* Map grid lines */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-[0.03] pointer-events-none">
          {Array.from({ length: 72 }).map((_, i) => (
            <div key={i} className="border-t border-l border-slate-900" />
          ))}
        </div>

        {/* SVG canvas layer */}
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full max-w-lg max-h-56 p-4 relative z-10 overflow-visible"
        >
          {/* Path line route (curved bezier path) */}
          <path
            d="M 60 120 Q 200 30, 340 120"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Active progress tracking path */}
          <motion.path
            d="M 60 120 Q 200 30, 340 120"
            fill="none"
            stroke="#007BFF"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Origin Marker */}
          <g transform="translate(60, 120)">
            <circle r="7" fill="#E2E8F0" />
            <circle r="3" fill="#94A3B8" />
          </g>

          {/* Destination Pin Marker */}
          <g transform="translate(340, 120)">
            <motion.circle
              r="14"
              fill="#10B981"
              fillOpacity="0.15"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <circle r="7" fill="#10B981" />
            <circle r="3.5" fill="#FFFFFF" />
          </g>

          {/* Animated Courier Truck/Icon Dot */}
          {progress > 0 && progress < 1.0 && (
            <motion.g
              animate={{
                x: courierX,
                y: courierY,
              }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              {/* Outer pulsing ring */}
              <motion.circle
                r="16"
                fill="#007BFF"
                fillOpacity="0.1"
                animate={{ scale: [1, 1.35, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              />
              {/* Core dot marker */}
              <circle r="8" fill="#007BFF" className="shadow" />
              <circle r="4" fill="#FFFFFF" />
            </motion.g>
          )}
        </svg>

        {/* Small Overlay Legend details */}
        <div className="absolute left-4 bottom-4 flex gap-4 text-[9px] font-bold text-gray-500 bg-white/90 backdrop-blur border border-gray-100/50 p-2.5 rounded-xl">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0" />
            <span>Warehouse</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#007BFF] shrink-0" />
            <span>Courier</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Destination</span>
          </div>
        </div>
      </div>
    </div>
  );
}
