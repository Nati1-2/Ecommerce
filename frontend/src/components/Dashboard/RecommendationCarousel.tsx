"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import { fetchRecommendations } from "@/lib/api";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function RecommendationCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useCartStore((s) => s.setCartDrawerOpen);

  const wishlist = useWishlistStore();

  useEffect(() => {
    fetchRecommendations()
      .then((data) => {
        setProducts(data);
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
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-36 bg-gray-100 rounded-2xl" />
              <div className="h-3 w-32 bg-gray-100 rounded" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
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
        <h3 className="text-base font-black text-gray-900">Recommended For You</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((product) => {
          const isWish = wishlist.isWishlisted?.(product.id) || false;

          return (
            <div
              key={product.id}
              className="group relative bg-white border border-gray-100/80 rounded-2xl p-3 flex flex-col gap-2.5 hover:shadow-md hover:border-gray-200 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square w-full rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100/30">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
                />

                <button
                  onClick={() => wishlist.toggleItem?.(product.id)}
                  className={cn(
                    "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm border border-gray-100 bg-white hover:scale-105 transition-all",
                    isWish ? "text-rose-500" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <Heart className={cn("w-3.5 h-3.5", isWish ? "fill-rose-500" : "")} />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-[11px] font-black text-gray-900 line-clamp-2 leading-snug">
                  {product.name}
                </h4>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-[9px] text-gray-500 font-bold">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Price & Add */}
              <div className="flex items-center justify-between mt-1 pt-1 border-t border-gray-50">
                <span className="text-xs font-black text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="p-2 rounded-xl bg-blue-50 hover:bg-[#007BFF] text-[#007BFF] hover:text-white transition-all shadow-sm"
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
