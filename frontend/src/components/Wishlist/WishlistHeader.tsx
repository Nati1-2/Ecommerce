"use client";

import { useWishlistStore } from "@/store/wishlist";
import { ArrowLeft, Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistHeader() {
  const { items } = useWishlistStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none text-left bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          </div>
          <span>My Wishlist</span>
        </h2>
        <p className="text-xs text-gray-500 font-semibold pl-1">
          {items.length} {items.length === 1 ? "product" : "products"} saved in your collection
        </p>
      </div>

      <Link
        href="/products"
        className="py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200/80 text-gray-700 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors self-start sm:self-auto shadow-sm"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Continue Shopping</span>
      </Link>
    </div>
  );
}
