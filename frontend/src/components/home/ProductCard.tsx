"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star, Eye, Zap } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { cn, formatPrice, formatDiscount } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const badgeConfig = {
  new: { label: "NEW", class: "bg-green-500" },
  sale: { label: "SALE", class: "bg-red-500" },
  hot: { label: "🔥 HOT", class: "bg-orange-500" },
  bestseller: { label: "★ BEST", class: "bg-purple-600" },
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageError, setImageError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const wishlisted = mounted ? isWishlisted(product.id) : false;
  const discount = product.discount || formatDiscount(product.originalPrice, product.price);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#007BFF]/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={imageError ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" : product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span className={cn(
            "absolute top-3 left-3 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg",
            badgeConfig[product.badge].class
          )}>
            {badgeConfig[product.badge].label}
          </span>
        )}

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
            -{discount}%
          </span>
        )}

        {/* Hover actions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-black/10 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto"
        >
          <button
            onClick={() => toggleItem(product.id)}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110",
              wishlisted ? "bg-rose-500 text-white" : "bg-white text-gray-700"
            )}
          >
            <Heart className={cn("w-4 h-4", wishlisted && "fill-current")} />
          </button>
          <Link
            href={`/products/${product.id}`}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 text-gray-700"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-[#007BFF] font-semibold uppercase tracking-wide">{product.brand}</p>
        <Link href={`/products/${product.id}`} className="hover:text-[#007BFF] transition-colors block">
          <h3 className="text-sm font-bold text-gray-900 mt-1 line-clamp-2 leading-snug">{product.name}</h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-3 h-3",
                  star <= Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : star - 0.5 <= product.rating
                    ? "fill-amber-400/50 text-amber-400"
                    : "fill-gray-200 text-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-black text-[#111827]">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className={cn(
            "w-full mt-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2",
            addedToCart
              ? "bg-green-500 text-white"
              : "bg-[#007BFF] hover:bg-blue-600 text-white shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5"
          )}
        >
          <AnimatePresence mode="wait">
            {addedToCart ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2"
              >
                ✓ Added to Cart
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}

interface ProductGridSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  label?: string;
  viewAllHref?: string;
}

export function ProductGridSection({ title, subtitle, products, label, viewAllHref = "/products" }: ProductGridSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            {label && <p className="text-[#007BFF] text-sm font-semibold uppercase tracking-widest mb-1">{label}</p>}
            <h2 className="text-3xl sm:text-4xl font-black text-[#111827]">{title}</h2>
            {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <a href={viewAllHref} className="hidden sm:flex items-center gap-1 text-[#007BFF] font-semibold text-sm hover:gap-2 transition-all">
            View All <span>→</span>
          </a>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Loading Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-4/5" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-5 bg-gray-100 rounded w-2/5" />
        <div className="h-9 bg-gray-100 rounded-xl mt-3" />
      </div>
    </div>
  );
}
