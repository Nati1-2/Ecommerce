"use client";

import { VendorProfile } from "@/types/vendor";
import { Star, BadgeCheck, Store, MapPin, Calendar } from "lucide-react";

interface Props {
  profile: VendorProfile;
}

export default function StoreOverviewCard({ profile }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Banner */}
      <div className="h-32 w-full relative bg-slate-800">
        <img
          src={profile.banner}
          alt={profile.storeName}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-0 relative flex flex-col md:flex-row items-start md:items-end justify-between gap-4 -mt-12">
        <div className="flex items-end gap-4">
          <img
            src={profile.logo}
            alt={profile.storeName}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl bg-white"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{profile.storeName}</h1>
              {profile.verified && <BadgeCheck className="w-5 h-5 text-blue-500 shrink-0" />}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {profile.description}
            </p>
          </div>
        </div>

        {/* Stats Badges */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl font-bold border border-amber-200 dark:border-amber-800/50">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{profile.rating}</span>
            <span className="text-slate-400 font-normal">({profile.totalReviews} reviews)</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-xl font-medium">
            <Store className="w-4 h-4 text-blue-500" />
            <span>{profile.productCount} Products</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-xl">
            <MapPin className="w-4 h-4" />
            <span>{profile.address.city}, {profile.address.state}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
