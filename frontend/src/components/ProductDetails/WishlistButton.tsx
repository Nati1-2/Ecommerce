"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { toggleItem, isWishlisted } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted ? isWishlisted(productId) : false;

  return (
    <button
      onClick={() => toggleItem(productId)}
      className={cn(
        "p-4 rounded-2xl border flex items-center justify-center transition-all",
        wishlisted
          ? "bg-rose-50 border-rose-200 text-rose-500 shadow-md shadow-rose-500/10"
          : "bg-white border-gray-200 text-gray-500 hover:border-rose-200 hover:text-rose-500"
      )}
      title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <Heart className={cn("w-5 h-5", wishlisted && "fill-current")} />
    </button>
  );
}
