"use client";

import React from "react";
import {
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Cpu,
} from "lucide-react";
import { DeviceType } from "@/types/deviceTraffic";

interface DeviceIconBadgeProps {
  deviceType: DeviceType | string;
  deviceBrand?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function DeviceIconBadge({
  deviceType,
  deviceBrand = "",
  size = "md",
  className = "",
}: DeviceIconBadgeProps) {
  const normalizedType = (deviceType || "Desktop").toLowerCase();

  let Icon = Monitor;
  let bgColors = "bg-blue-50 text-blue-600 border-blue-200/80";

  if (normalizedType.includes("mobile") || normalizedType.includes("phone")) {
    Icon = Smartphone;
    bgColors = "bg-violet-50 text-violet-600 border-violet-200/80";
  } else if (normalizedType.includes("tablet") || normalizedType.includes("ipad")) {
    Icon = Tablet;
    bgColors = "bg-teal-50 text-teal-600 border-teal-200/80";
  } else if (normalizedType.includes("desktop") || normalizedType.includes("macbook") || normalizedType.includes("laptop")) {
    Icon = Laptop;
    bgColors = "bg-indigo-50 text-indigo-600 border-indigo-200/80";
  } else if (normalizedType.includes("bot")) {
    Icon = Cpu;
    bgColors = "bg-amber-50 text-amber-600 border-amber-200/80";
  }

  const sizeClasses = {
    sm: "w-7 h-7 p-1 rounded-xl text-xs",
    md: "w-9 h-9 p-1.5 rounded-2xl text-sm",
    lg: "w-11 h-11 p-2 rounded-2xl text-base",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4.5 h-4.5",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 border shadow-xs ${bgColors} ${sizeClasses[size]} ${className}`}
      title={`${deviceBrand || "Device"} • ${deviceType}`}
    >
      <Icon className={iconSizes[size]} />
    </div>
  );
}
