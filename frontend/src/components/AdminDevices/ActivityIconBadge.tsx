"use client";

import React from "react";
import {
  ShoppingCart,
  CreditCard,
  PackageCheck,
  Eye,
  Search,
  Heart,
  Zap,
  ShieldCheck,
  Star,
  Tag,
  Globe,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { ActivityType, ActivityCategory } from "@/types/deviceTraffic";

interface ActivityIconBadgeProps {
  type: ActivityType | string;
  category?: ActivityCategory | string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function getActivityConfig(type: ActivityType | string, category?: ActivityCategory | string) {
  switch (type) {
    case "ADD_TO_CART":
    case "REMOVE_FROM_CART":
      return {
        icon: ShoppingCart,
        label: "Cart Action",
        bg: "bg-purple-50 text-purple-600 border-purple-200/80",
        badgeBg: "bg-purple-600 text-white",
        ring: "ring-purple-500/20",
      };
    case "CHECKOUT_INITIATED":
    case "PAYMENT_COMPLETED":
      return {
        icon: CreditCard,
        label: "Stripe Checkout",
        bg: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
        badgeBg: "bg-emerald-600 text-white",
        ring: "ring-emerald-500/20",
      };
    case "ORDER_PLACED":
      return {
        icon: PackageCheck,
        label: "Order Placed",
        bg: "bg-green-50 text-green-700 border-green-200/80",
        badgeBg: "bg-green-600 text-white",
        ring: "ring-green-500/20",
      };
    case "SEARCH_QUERY":
      return {
        icon: Search,
        label: "Catalog Search",
        bg: "bg-amber-50 text-amber-600 border-amber-200/80",
        badgeBg: "bg-amber-500 text-white",
        ring: "ring-amber-500/20",
      };
    case "WISHLIST_ADD":
    case "WISHLIST_REMOVE":
      return {
        icon: Heart,
        label: "Wishlist",
        bg: "bg-rose-50 text-rose-600 border-rose-200/80",
        badgeBg: "bg-rose-500 text-white",
        ring: "ring-rose-500/20",
      };
    case "FLASH_SALE_INTERACTION":
      return {
        icon: Zap,
        label: "Flash Sale",
        bg: "bg-orange-50 text-orange-600 border-orange-200/80",
        badgeBg: "bg-orange-500 text-white",
        ring: "ring-orange-500/20",
      };
    case "USER_LOGIN":
    case "USER_REGISTER":
      return {
        icon: ShieldCheck,
        label: "User Auth",
        bg: "bg-indigo-50 text-indigo-600 border-indigo-200/80",
        badgeBg: "bg-indigo-600 text-white",
        ring: "ring-indigo-500/20",
      };
    case "REVIEW_SUBMITTED":
      return {
        icon: Star,
        label: "Product Review",
        bg: "bg-yellow-50 text-yellow-700 border-yellow-200/80",
        badgeBg: "bg-yellow-500 text-white",
        ring: "ring-yellow-500/20",
      };
    case "COUPON_APPLIED":
      return {
        icon: Tag,
        label: "Coupon Code",
        bg: "bg-teal-50 text-teal-600 border-teal-200/80",
        badgeBg: "bg-teal-600 text-white",
        ring: "ring-teal-500/20",
      };
    case "CATEGORY_BROWSE":
      return {
        icon: LayoutGrid,
        label: "Category Browse",
        bg: "bg-blue-50 text-blue-600 border-blue-200/80",
        badgeBg: "bg-blue-600 text-white",
        ring: "ring-blue-500/20",
      };
    case "PRODUCT_VIEW":
    default:
      return {
        icon: Eye,
        label: "Product View",
        bg: "bg-sky-50 text-sky-600 border-sky-200/80",
        badgeBg: "bg-sky-600 text-white",
        ring: "ring-sky-500/20",
      };
  }
}

export default function ActivityIconBadge({
  type,
  category,
  size = "md",
  showLabel = false,
  className = "",
}: ActivityIconBadgeProps) {
  const config = getActivityConfig(type, category);
  const Icon = config.icon;

  const sizeClasses = {
    sm: "w-6 h-6 p-1 rounded-lg text-xs",
    md: "w-8 h-8 p-1.5 rounded-xl text-sm",
    lg: "w-10 h-10 p-2 rounded-2xl text-base",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`flex items-center justify-center shrink-0 border shadow-xs transition-transform hover:scale-105 ${config.bg} ${sizeClasses[size]}`}
        title={config.label}
      >
        <Icon className={iconSizes[size]} />
      </div>
      {showLabel && (
        <span className="text-xs font-bold text-slate-700 tracking-tight">
          {config.label}
        </span>
      )}
    </div>
  );
}
