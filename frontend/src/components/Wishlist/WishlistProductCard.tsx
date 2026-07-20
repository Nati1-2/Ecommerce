"use client";

import { WishlistItem, useWishlistStore } from "@/store/wishlist";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { Heart, ShoppingBag, Eye, Star, AlertTriangle, CheckCircle2 } from "lucide-react";
import PriceAlert from "./PriceAlert";
import StockAlert from "./StockAlert";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WishlistProductCardProps {
  product: WishlistItem;
  onQuickView: () => void;
}

export default function WishlistProductCard({
  product,
  onQuickView,
}: WishlistProductCardProps) {
  const { removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const setCartDrawerOpen = useCartStore((s) => s.setCartDrawerOpen);

  const discountPercent =
    product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.productId,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    removeItem(product.productId);
    setCartDrawerOpen(true);
  };

  return (
    <div className="group relative bg-white border border-gray-150 rounded-2xl p-4 flex flex-col gap-3.5 hover:shadow-md transition-shadow select-none text-left">
      
      {/* Product Image and badges */}
      <div className="relative aspect-square w-full rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100/30">
        <img
          src={product.image}
          alt={product.name}
          className="max-w-[85%] max-h-[85%] object-contain group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 text-[8px] font-black text-white bg-red-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {discountPercent}% Off
          </span>
        )}

        {/* Remove heart */}
        <button
          onClick={() => removeItem(product.productId)}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center shadow-sm border border-gray-100 bg-white hover:scale-105 text-red-500 transition-all"
        >
          <Heart className="w-3.5 h-3.5 fill-red-500" />
        </button>
      </div>

      {/* Info details */}
      <div className="flex-1 min-w-0 space-y-1 text-xs font-semibold">
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">
          {product.brand}
        </span>
        <h4 className="text-xs font-black text-gray-900 line-clamp-2 leading-snug">
          {product.name}
        </h4>

        {/* Rating stars */}
        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-[10px] text-gray-500 font-bold">
            {product.rating} ({product.reviewsCount})
          </span>
        </div>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm font-black text-gray-900">
            {formatPrice(product.price)}
          </span>
          {discountPercent > 0 && (
            <span className="text-[10px] text-gray-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Stock status indicator */}
        <div className="pt-1.5 flex items-center gap-1.5 text-[9px] font-bold">
          {product.stock > 0 ? (
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              In Stock ({product.stock})
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3" />
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Bottom price alert & add button */}
      <div className="space-y-2 pt-2 border-t border-gray-50">
        <div className="flex items-center gap-2">
          {/* Price alert configuration toggle */}
          <PriceAlert
            productId={product.productId}
            enabled={product.priceAlertEnabled || false}
          />
          
          <button
            onClick={onQuickView}
            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-1 text-[9px] font-black uppercase tracking-wider shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick
          </button>
        </div>

        {product.stock > 0 ? (
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 bg-[#007BFF] hover:bg-blue-600 text-white font-bold text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-blue-500/10"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
        ) : (
          <StockAlert productId={product.productId} />
        )}
      </div>
    </div>
  );
}
