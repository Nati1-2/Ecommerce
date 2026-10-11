"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Truck,
  PackageCheck,
  RotateCcw,
} from "lucide-react";

export type StatusType =
  | "Approved"
  | "Active"
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Completed"
  | "Cancelled"
  | "Rejected"
  | "Suspended"
  | "Blocked"
  | "Refunded"
  | "Failed"
  | "Paid"
  | "Flagged"
  | "Verified"
  | "Unverified"
  | "Draft";

interface StatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md";
}

export default function AdminStatusBadge({
  status,
  className,
  showIcon = true,
  size = "md",
}: StatusBadgeProps) {
  const norm = (status || "").toLowerCase().trim();

  let colorClasses = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
  let IconComponent = Clock;

  if (["approved", "active", "completed", "delivered", "paid", "verified"].includes(norm)) {
    colorClasses = "bg-emerald-50/90 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80";
    IconComponent = CheckCircle2;
  } else if (["pending", "processing", "draft"].includes(norm)) {
    colorClasses = "bg-amber-50/90 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80";
    IconComponent = Clock;
  } else if (["shipped"].includes(norm)) {
    colorClasses = "bg-blue-50/90 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/80";
    IconComponent = Truck;
  } else if (["cancelled", "rejected", "failed", "blocked"].includes(norm)) {
    colorClasses = "bg-rose-50/90 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/80";
    IconComponent = XCircle;
  } else if (["suspended", "flagged"].includes(norm)) {
    colorClasses = "bg-orange-50/90 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200/80 dark:border-orange-800/80";
    IconComponent = AlertTriangle;
  } else if (["refunded"].includes(norm)) {
    colorClasses = "bg-purple-50/90 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/80";
    IconComponent = RotateCcw;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-bold tracking-tight rounded-full border transition-colors",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        colorClasses,
        className
      )}
    >
      {showIcon && <IconComponent className={size === "sm" ? "w-3 h-3 shrink-0" : "w-3.5 h-3.5 shrink-0"} />}
      <span className="capitalize">{status}</span>
    </span>
  );
}
