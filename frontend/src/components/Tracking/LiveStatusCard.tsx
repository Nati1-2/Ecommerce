"use client";

import { useTrackingStore } from "@/store/trackingStore";
import { Navigation, Clock, ShieldAlert } from "lucide-react";

export default function LiveStatusCard() {
  const { currentLocation, orderStatus } = useTrackingStore();

  const getStatusMessage = () => {
    switch (orderStatus) {
      case "Order Placed":
        return "Order details submitted. Preparing for payment verification.";
      case "Payment Confirmed":
        return "Transaction cleared. Dispatching order details to fulfillment center.";
      case "Order Processing":
        return "Items sorted and packed. Awaiting carrier pickup.";
      case "Shipped":
        return "In transit to carrier sorting facilities.";
      case "Out for Delivery":
        return "Your package is currently out with the local courier.";
      case "Delivered":
        return "Order has been successfully dropped off at destination.";
      default:
        return "Package logistics in progress.";
    }
  };

  return (
    <div className="p-6 border border-[#007BFF]/10 rounded-3xl bg-blue-50/15 shadow-sm space-y-4 select-none relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 w-32 h-32 rounded-full bg-blue-500/5 -z-10 blur-xl" />

      <h3 className="text-xs font-black text-[#007BFF] uppercase tracking-widest flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[#007BFF] animate-pulse shrink-0" />
        Live Tracking Status
      </h3>

      <div className="space-y-1">
        <p className="text-base font-black text-gray-900 leading-snug">
          &quot;{getStatusMessage()}&quot;
        </p>
      </div>

      {/* Logistics info labels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2.5 border-t border-gray-100/70 text-xs font-semibold text-gray-500">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="truncate">
            Current Location: <strong className="text-gray-950 font-black">{currentLocation}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500 shrink-0" />
          <span>
            Last Updated: <strong className="text-gray-950 font-black">Just now</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
