"use client";

import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: string;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getBadgeStyle = () => {
    switch (status) {
      case "Processing":
        return "text-amber-700 bg-amber-50 border-amber-100";
      case "Shipped":
        return "text-blue-700 bg-blue-50 border-blue-100";
      case "Delivered":
        return "text-emerald-700 bg-emerald-50 border-emerald-100";
      case "Cancelled":
        return "text-red-700 bg-red-50 border-red-100";
      case "Returned":
        return "text-purple-700 bg-purple-50 border-purple-100";
      default:
        return "text-gray-700 bg-gray-50 border-gray-100";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shrink-0",
        getBadgeStyle()
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      {status}
    </span>
  );
}
