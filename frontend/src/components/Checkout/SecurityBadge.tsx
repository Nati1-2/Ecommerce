"use client";

import { ShieldCheck, BadgeCheck, RotateCcw } from "lucide-react";

const BADGES = [
  {
    icon: ShieldCheck,
    label: "Secure Payment",
    description: "256-bit SSL encryption",
  },
  {
    icon: BadgeCheck,
    label: "Buyer Protection",
    description: "Full refund if not delivered",
  },
  {
    icon: RotateCcw,
    label: "Easy Returns",
    description: "30-day hassle-free returns",
  },
];

export default function SecurityBadge() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {BADGES.map((badge) => (
        <div
          key={badge.label}
          className="flex flex-col items-center text-center gap-1.5 p-3 rounded-2xl bg-gray-50 border border-gray-100"
        >
          <badge.icon className="w-5 h-5 text-[#007BFF]" />
          <p className="text-[10px] font-black text-gray-900 leading-tight">
            {badge.label}
          </p>
          <p className="text-[9px] text-gray-400 font-semibold leading-tight hidden sm:block">
            {badge.description}
          </p>
        </div>
      ))}
    </div>
  );
}
