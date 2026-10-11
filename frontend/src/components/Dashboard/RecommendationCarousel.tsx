"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { fetchRecommendations } from "@/lib/api";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { ShoppingBag, Heart, Star, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function RecommendationCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useCartStore((s) => s.setCartDrawerOpen);
  const wishlist = useWishlistStore();

  useEffect(() => {
    fetchRecommendations()
      .then((data) => {
        setProducts(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setCartDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse select-none">
        <div className="h-5 w-40 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl" />
              <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
              <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="space-y-5 select-none">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Recommended For You
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((product) => {
          const isWish = wishlist.isWishlisted?.(product.id) || false;

          return (
            <div
              key={product.id}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 flex flex-col gap-2.5 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              {/* Image */}
              <Link
                href={`/products/${product.id}`}
                className="relative aspect-square w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    wishlist.toggleItem?.(product.id);
                  }}
                  className={cn(
                    "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-xs border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 hover:scale-105 transition-all cursor-pointer",
                    isWish ? "text-rose-500" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  )}
                  aria-label={isWish ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={cn("w-3.5 h-3.5", isWish ? "fill-rose-500 text-rose-500" : "")} />
                </button>
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-[11px] font-black text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <Link href={`/products/${product.id}`}>{product.name}</Link>
                </h4>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-bold">
                    {(product.rating || 5.0).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Price & Add */}
              <div className="flex items-center justify-between mt-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums">
                  {formatPrice(product.price)}
                </span>
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white transition-all shadow-xs cursor-pointer"
                  title="Add to cart"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
