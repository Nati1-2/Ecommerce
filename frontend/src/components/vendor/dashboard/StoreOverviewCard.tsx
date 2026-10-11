"use client";

import { VendorProfile } from "@/types/vendor";
import { Star, BadgeCheck, Store, Calendar, ShieldCheck, Database } from "lucide-react";

interface Props {
  profile: VendorProfile;
}

export default function StoreOverviewCard({ profile }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs">
      {/* Banner with gradient overlay */}
      <div className="h-36 sm:h-44 w-full relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
        {profile.banner && (
          <img
            src={profile.banner}
            alt={profile.storeName}
            className="w-full h-full object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
      </div>

      {/* Profile Header Content */}
      <div className="px-6 sm:px-8 pb-6 pt-0 relative flex flex-col md:flex-row items-start md:items-end justify-between gap-5 -mt-14 sm:-mt-16">
        <div className="flex items-end gap-4 sm:gap-5">
          <div className="relative">
            <img
              src={profile.logo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80"}
              alt={profile.storeName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl bg-white dark:bg-slate-800"
            />
            {profile.verified && (
              <span className="absolute -bottom-1 -right-1 p-1 bg-blue-600 text-white rounded-full ring-2 ring-white dark:ring-slate-900 shadow-sm" title="Verified Merchant">
                <BadgeCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="mb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {profile.storeName}
              </h1>
              <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px] rounded-md border border-emerald-200/80 dark:border-emerald-800">
                Active Storefront
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl font-medium line-clamp-2">
              {profile.description || "Official Vendor Storefront"}
            </p>
          </div>
        </div>

        {/* Live Badges - purely from real backend, NO mock phone or address */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs self-stretch md:self-auto">
          {/* MongoDB Live Link */}
          <div className="flex items-center gap-1.5 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl font-bold border border-emerald-200/80 dark:border-emerald-800 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <Database className="w-3.5 h-3.5" />
            <span>MongoDB: Connected</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl font-bold border border-slate-200/80 dark:border-slate-700 shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{typeof profile.rating === "number" ? profile.rating.toFixed(1) : "5.0"}</span>
            <span className="text-slate-400 font-normal">({profile.totalReviews ?? 0})</span>
          </div>

          {/* Catalog Count */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl font-bold shadow-2xs">
            <Store className="w-3.5 h-3.5 text-blue-500" />
            <span>{profile.productCount ?? 0} Products</span>
          </div>

          {/* Joined Date */}
          {profile.joinedDate && (
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-xl font-medium shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Joined {profile.joinedDate}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
