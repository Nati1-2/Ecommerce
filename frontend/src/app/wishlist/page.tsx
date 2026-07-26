"use client";

import { useWishlistStore } from "@/store/wishlist";
import WishlistHeader from "@/components/Wishlist/WishlistHeader";
import WishlistToolbar from "@/components/Wishlist/WishlistToolbar";
import WishlistCollections from "@/components/Wishlist/WishlistCollections";
import WishlistGrid from "@/components/Wishlist/WishlistGrid";
import WishlistEmptyState from "@/components/Wishlist/WishlistEmptyState";
import WishlistRecommendations from "@/components/Wishlist/WishlistRecommendations";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <WishlistHeader />

        {items.length > 0 ? (
          <>
            <WishlistToolbar />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              <div className="lg:col-span-1">
                <WishlistCollections />
              </div>
              <div className="lg:col-span-3">
                <WishlistGrid />
              </div>
            </div>
          </>
        ) : (
          <WishlistEmptyState />
        )}

        <WishlistRecommendations />
      </div>
    </div>
  );
}
