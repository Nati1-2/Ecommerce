"use client";

import { useWishlistStore } from "@/store/wishlist";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistHeader() {
  const { items } = useWishlistStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none text-left">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          My Wishlist
        </h2>
        <p className="text-xs text-gray-405 font-bold">
          {items.length} {items.length === 1 ? "product" : "products"} saved
        </p>
      </div>

      <Link
        href="/"
        className="py-2.5 px-4 bg-gray-50 border border-gray-150 hover:border-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all self-start sm:self-auto"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Continue Shopping
      </Link>
    </div>
  );
}
