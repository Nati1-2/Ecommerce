"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Eye, Star, ShieldCheck, Zap } from "lucide-react";
import { Product } from "@/types";
import { RatingStars } from "@/components/shared/RatingStars";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useRouter } from "next/navigation";
import { cn, formatPrice, formatDiscount } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index: number;
  viewMode: "grid" | "list";
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, index, viewMode, onQuickView }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted ? isWishlisted(product.id) : false;
  const discount = product.discount || formatDiscount(product.originalPrice, product.price);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleItem(product.id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    router.push(`/products/${product.id}`);
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group flex flex-col sm:flex-row gap-5 p-5 bg-white rounded-3xl border border-gray-100 hover:border-[#007BFF]/30 hover:shadow-lg transition-all duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Left: Image */}
        <div className="relative w-full sm:w-48 aspect-square shrink-0 rounded-2xl bg-gray-50 overflow-hidden flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-[#111827] text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
              {product.badge.toUpperCase()}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
              -{discount}%
            </span>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-2">
            <div>
              <span className="text-xs text-[#007BFF] font-bold uppercase tracking-wider">{product.brand}</span>
              <h3 className="text-lg font-black text-gray-900 leading-snug mt-0.5 group-hover:text-[#007BFF] transition-colors">
                {product.name}
              </h3>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <RatingStars rating={product.rating} />
              <span className="text-xs text-gray-400 font-semibold">({product.reviewCount.toLocaleString()})</span>
            </div>

            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed max-w-xl">
              {product.description}
            </p>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-gray-50">
            {/* Price */}
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through font-medium">{formatPrice(product.originalPrice)}</span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">
                {product.inStock ? "🟢 IN STOCK • READY TO SHIP" : "🔴 OUT OF STOCK"}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickView(product);
                }}
                className="p-3 rounded-xl border border-gray-200 hover:border-[#007BFF] text-gray-500 hover:text-[#007BFF] bg-white transition-all"
                title="Quick View"
              >
                <Eye className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={handleWishlist}
                className={cn(
                  "p-3 rounded-xl border transition-all",
                  wishlisted
                    ? "bg-rose-50 border-rose-200 text-rose-500"
                    : "border-gray-200 text-gray-500 hover:border-rose-200 hover:text-rose-500"
                )}
              >
                <Heart className={cn("w-4.5 h-4.5", wishlisted && "fill-current")} />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || added}
                className={cn(
                  "px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2",
                  added
                    ? "bg-green-500 text-white"
                    : "bg-[#111827] hover:bg-[#007BFF] text-white"
                )}
              >
                <ShoppingBag className="w-4 h-4" />
                {added ? "Added!" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view (Default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#007BFF]/30 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
      onClick={handleCardClick}
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-square bg-[#F5F7FA] overflow-hidden flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 bg-[#111827] text-white text-[9px] font-black px-2.5 py-1 rounded-lg">
              {product.badge.toUpperCase()}
            </span>
          )}

          {/* Discount */}
          {discount > 0 && (
            <span className="absolute top-3 right-3 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-lg">
              -{discount}%
            </span>
          )}

          {/* Action trigger overlay */}
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleWishlist}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all",
                wishlisted ? "bg-rose-500 text-white" : "bg-white text-gray-700"
              )}
            >
              <Heart className={cn("w-4.5 h-4.5", wishlisted && "fill-current")} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all text-gray-700"
            >
              <Eye className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-4 space-y-1.5">
          <span className="text-[10px] text-[#007BFF] font-bold uppercase tracking-wider">{product.brand}</span>
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#007BFF] transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <RatingStars rating={product.rating} />
            <span className="text-[10px] text-gray-400 font-semibold">({product.reviewCount.toLocaleString()})</span>
          </div>
        </div>
      </div>

      {/* Pricing and Action Footer */}
      <div className="p-4 pt-0 border-t border-gray-50 mt-auto">
        <div className="flex items-baseline gap-2 pt-3">
          <span className="text-lg font-black text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through font-medium">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock || added}
          className={cn(
            "w-full mt-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
            added
              ? "bg-green-500 text-white"
              : "bg-[#111827] hover:bg-[#007BFF] text-white shadow-sm hover:-translate-y-0.5"
          )}
        >
          <ShoppingBag className="w-4 h-4" />
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}
