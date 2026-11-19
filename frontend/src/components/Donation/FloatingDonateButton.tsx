"use client";

import React from "react";
import { Heart, Sparkles } from "lucide-react";
import { useDonationStore } from "@/store/donationStore";
import { usePathname } from "next/navigation";

export default function FloatingDonateButton() {
  const { openDonationModal } = useDonationStore();
  const pathname = usePathname() || "";

  // Do not display on checkout, admin, or vendor dashboards
  if (
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/vendor")
  ) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={openDonationModal}
      className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40 flex items-center gap-2 py-2.5 px-4 bg-gradient-to-r from-rose-600 via-pink-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white font-black text-xs rounded-full shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group select-none border border-white/20"
      title="Support Nati E-Commerce Platform via Payoneer"
    >
      <div className="relative">
        <Heart className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-yellow-300 animate-ping" />
      </div>
      <span className="tracking-tight">Donate</span>
      <span className="hidden sm:inline text-white/80 font-semibold">• Payoneer</span>
    </button>
  );
}
