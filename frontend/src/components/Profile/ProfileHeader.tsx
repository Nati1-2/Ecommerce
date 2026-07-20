"use client";

import { useProfileStore } from "@/store/profileStore";
import AvatarUpload from "./AvatarUpload";
import { Star } from "lucide-react";

export default function ProfileHeader() {
  const { user } = useProfileStore();

  return (
    <div className="p-6 border border-gray-100 rounded-3xl bg-white shadow-sm space-y-6 select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Avatar Upload */}
        <AvatarUpload />

        {/* User Badge meta */}
        <div className="text-center sm:text-right space-y-1.5 shrink-0">
          <h3 className="text-base font-black text-gray-900 leading-snug">
            {user.firstName} {user.lastName}
          </h3>
          <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
            {user.role}
          </span>
        </div>
      </div>
    </div>
  );
}
